import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import cookieSession from "cookie-session";
import Stripe from "stripe";

dotenv.config();
const app = express();

// === Middleware ===
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "sess",
    secret: process.env.SESSION_SECRET || "supersecret",
    httpOnly: true,
    sameSite: "lax",
  })
);

// Basit in-memory "abonelik" depolama
const purchases = new Map(); // key: userId, value: array of {botId, ts}

// --- Discord OAuth2 ---
const DISCORD_AUTH_URL = "https://discord.com/api/oauth2/authorize";
const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_ME_URL = "https://discord.com/api/users/@me";

function discordAuthorizeURL() {
  const p = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    scope: "identify",
    prompt: "consent",
  });
  return `${DISCORD_AUTH_URL}?${p.toString()}`;
}

// --- 1) Frontend login URL ---
app.get("/api/auth/login-url", (_req, res) => {
  res.json({ url: discordAuthorizeURL() });
});

// --- 2) Discord callback ---
app.get("/api/auth/discord/callback", async (req, res) => {
  console.log("CALLBACK HIT ✅");
  console.log("CLIENT_ORIGIN:", process.env.CLIENT_ORIGIN);
  console.log("DISCORD_REDIRECT_URI:", process.env.DISCORD_REDIRECT_URI);

  const code = req.query.code;
  if (!code) {
    console.error("No code provided in callback");
    return res.status(400).send("No code provided");
  }

  try {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });

    const tokenResp = await axios.post(DISCORD_TOKEN_URL, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const access_token = tokenResp.data.access_token;

    const me = await axios.get(DISCORD_ME_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    req.session.user = {
      id: me.data.id,
      username: `${me.data.username}#${me.data.discriminator ?? ""}`,
      avatar: me.data.avatar
        ? `https://cdn.discordapp.com/avatars/${me.data.id}/${me.data.avatar}.png`
        : null,
    };

    // CLIENT_ORIGIN okunamazsa fallback ile düzeltelim:
    const redirectBase = process.env.CLIENT_ORIGIN || "https://hyrosbots.vercel.app";
    res.redirect(`${redirectBase}/auth/success`);
  } catch (err) {
    console.error("Discord OAuth Error:", err?.response?.data || err.message);
    const redirectBase = process.env.CLIENT_ORIGIN || "https://hyrosbots.vercel.app";
    res.redirect(`${redirectBase}/auth/error`);
  }
});

// --- 3) Kimlik doğrulama kontrolü ---
app.get("/api/auth/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

// --- 4) Çıkış ---
app.post("/api/auth/logout", (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

// --- 5) Abonelik listeleme ---
app.get("/api/subscriptions", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "unauthorized" });
  const list = purchases.get(req.session.user.id) || [];
  res.json({ items: list });
});

// --- 6) Stripe Checkout ---
const stripeKey = process.env.STRIPE_SECRET || "";
const stripe = stripeKey ? new Stripe(stripeKey) : null;
const CURRENCY = (process.env.CURRENCY || "try").toLowerCase();
const PRICE_AMOUNT = parseInt(process.env.PRICE_AMOUNT || "25000", 10); // 250.00 TRY

app.post("/api/checkout", async (req, res) => {
  const { botId } = req.body || {};
  if (!botId) return res.status(400).json({ error: "botId required" });

  const origin = process.env.CLIENT_ORIGIN || "https://hyrosbots.vercel.app";

  // DEMO modu (Stripe yoksa)
  if (!stripe) {
    if (req.session?.user?.id) {
      const arr = purchases.get(req.session.user.id) || [];
      arr.push({ botId, ts: Date.now(), mode: "demo" });
      purchases.set(req.session.user.id, arr);
    }
    return res.json({ url: `${origin}/thank-you?bot=${botId}` });
  }

  // Stripe ödeme işlemi
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: { name: `Kaan's Discord Bot: ${botId}` },
            unit_amount: PRICE_AMOUNT,
          },
          quantity: 1,
        },
      ],
      metadata: {
        botId,
        userId: req.session?.user?.id || "guest",
      },
      success_url: `${origin}/thank-you?bot=${encodeURIComponent(botId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1`,
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "stripe_failed" });
  }
});

// --- 7) Stripe Success doğrulama ---
app.get("/api/checkout/confirm", async (req, res) => {
  if (!stripe) return res.json({ ok: true, mode: "demo" });

  const session_id = req.query.session_id;
  if (!session_id) return res.status(400).json({ error: "session_id required" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === "paid") {
      const botId = session.metadata?.botId || "unknown";
      const userId = req.session?.user?.id || session.metadata?.userId || "guest";
      const arr = purchases.get(userId) || [];
      arr.push({ botId, ts: Date.now(), mode: "stripe" });
      purchases.set(userId, arr);
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: "not_paid" });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "confirm_failed" });
  }
});

// --- Server başlat ---
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
