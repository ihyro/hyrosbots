import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import {
  BoltIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeOpenIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { api } from "./utils/api";
import { useAuth } from "./AuthContext";
import "./App.css";

/* 🌀 Animated Gradient Background */
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0014] to-[#120024]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(147,51,234,0.18),_transparent_70%)] animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(56,189,248,0.15),_transparent_70%)] animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(236,72,153,0.12),_transparent_70%)] animate-[pulse_12s_ease-in-out_infinite]" />
    </div>
  );
}

/* 🧠 Bot List */
const bots = [
  {
    id: "gmail",
    name: "Gmail Onaylı Kayıt Botu",
    price: 250,
    icon: EnvelopeOpenIcon,
    tagline: "Gmail onayıyla güvenli kullanıcı kaydı",
    bullets: [
      "Gmail doğrulama akışı",
      "Spam/çift hesap önleme",
      "Panelden kullanıcı yönetimi",
    ],
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "fal",
    name: "Fal Randevu Botu",
    price: 250,
    icon: CalendarDaysIcon,
    tagline: "Kahve falı için otomatik randevu planlama",
    bullets: [
      "Özel DM randevu akışı",
      "Hatırlatıcı bildirimleri",
      "Takvim dışa aktarım (ics)",
    ],
    gradient: "from-pink-500 to-fuchsia-500",
  },
  {
    id: "ai-satis",
    name: "Yapay Zeka Destekli Satış Botu",
    price: 250,
    icon: BoltIcon,
    tagline: "AI ile otomatik cevap ve satış hunisi",
    bullets: [
      "Sohbet tabanlı yönlendirme",
      "Sipariş formu & takip",
      "Rol/izin otomasyonu",
    ],
    gradient: "from-amber-500 to-orange-500",
  },
];

/* ⚙️ Utility */
function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

/* 🌟 Main Component */
export default function App() {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const { user, loading, login, logout } = useAuth();

  const SelectedIcon = useMemo(() => (selected ? selected.icon : null), [selected]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <AnimatedBackground />

      {/* 🌈 Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-lg border-b border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.05)]">
        <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-pink-400 to-cyan-400 grid place-items-center shadow-inner shadow-white/10">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-wide bg-gradient-to-r from-cyan-300 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
              Kaan’s Discord Bots
            </span>
          </motion.div>

          <div className="flex items-center gap-3">
            <a
              href="#bots"
              className="hidden sm:inline-flex rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10 transition"
            >
              Botlar
            </a>
            <a
              href="/store"
              className="hidden sm:inline-flex rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-pink-400 hover:to-cyan-400 hover:text-black transition"
            >
              Mağaza
            </a>
            {!loading && !user && (
              <button
                onClick={login}
                className="rounded-lg bg-white text-black px-4 py-2 font-semibold hover:scale-[1.05] transition"
              >
                Discord ile Giriş
              </button>
            )}
            {!loading && user && (
              <Menu as="div" className="relative">
                <Menu.Button className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20 transition">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-5 w-5 rounded-full" />
                  ) : (
                    <span className="h-5 w-5 rounded-full bg-white/30 inline-block" />
                  )}
                  {user.username}
                  <ChevronDownIcon className="h-4 w-4" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-52 rounded-xl bg-black/70 backdrop-blur-xl p-1 ring-1 ring-white/10 shadow-2xl focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/dashboard"
                          className={classNames(
                            "block rounded-lg px-3 py-2 text-sm",
                            active ? "bg-white/10" : ""
                          )}
                        >
                          Panel
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={classNames(
                            "block w-full text-left rounded-lg px-3 py-2 text-sm",
                            active ? "bg-white/10" : ""
                          )}
                        >
                          Çıkış Yap
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </header>

      {/* 🌌 Hero */}
      <section className="relative mx-auto max-w-7xl px-5 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
              AI Destekli
            </span>{" "}
            Discord Botlarıyla Tanış 💫
          </h1>
          <p className="mt-6 text-white/80 max-w-xl text-lg leading-relaxed">
            Gelişmiş yapay zekâ, güvenli kayıt sistemleri ve etkileyici randevu akışları.
            <b> Tek bir panelden</b> yönet, topluluğunu bir üst seviyeye çıkar!
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#bots"
              className="rounded-full bg-white text-black px-6 py-3 font-semibold shadow-lg hover:scale-[1.05] transition"
            >
              Botları Gör
            </a>
            <a
              href="/store"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-400 hover:text-black transition"
            >
              Mağazayı Ziyaret Et
            </a>
          </div>
        </motion.div>

{/* 🎧 Discord Presence Widget */}
{/* 🎧 Discord Presence Widget (auto-refresh) */}
<motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.3, duration: 0.8 }}
  className="w-full md:w-[520px] flex justify-center md:justify-end"
>
  <div className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_45px_rgba(147,51,234,0.35)] p-[2px] hover:scale-[1.02] transition-transform duration-300">
    <div className="rounded-3xl bg-gradient-to-br from-[#1e002f] via-[#10001a] to-[#0b0014] p-2">
      <iframe
        key={Date.now()} // her renderda yenile
        src={`https://lanyard.cnrad.dev/api/306091349533523968?bg=00000000&borderRadius=20px&animated=true&idleMessage=Boşta%20takılıyor...&hideDiscrim=true&${Date.now()}`}
        width="460"
        height="210"
        className="rounded-2xl border border-white/10"
        style={{ background: "rgba(0,0,0,0.5)" }}
        title="Discord Presence"
      ></iframe>
    </div>
  </div>
</motion.div>


      </section>

      {/* 🤖 Bot Kartları */}
      <section id="bots" className="mx-auto max-w-7xl px-5 pt-16 pb-32">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-cyan-300 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
          Öne Çıkan Botlarımız
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {bots.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-[1.03] transition"
            >
              <div className={`bg-gradient-to-r ${b.gradient} p-[1px] rounded-2xl mb-4`}>
                <div className="bg-black/70 p-4 rounded-2xl flex items-center justify-center">
                  <b.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold">{b.name}</h3>
              <p className="text-white/70 mt-2 mb-4">{b.tagline}</p>
              <ul className="text-sm text-white/60 space-y-2">
                {b.bullets.map((x, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-pink-400" />
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-between items-center">
                <span className="text-2xl font-extrabold">₺{b.price}</span>
                <button
                  onClick={() => {
                    setSelected(b);
                    setOpen(true);
                  }}
                  className="rounded-lg bg-white text-black px-4 py-2 font-semibold hover:scale-[1.05] transition"
                >
                  Satın Al
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💳 Satın Alma Modal */}
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl p-6">
              <div className="flex items-center gap-3">
                {SelectedIcon && (
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-pink-400 to-cyan-400 grid place-items-center">
                    <SelectedIcon className="h-6 w-6" />
                  </div>
                )}
                <Dialog.Title className="text-lg font-bold">
                  {selected?.name || "Satın Alma"}
                </Dialog.Title>
              </div>
              <p className="mt-3 text-white/80">
                Onaylarsan seni Discord mağazamıza yönlendireceğim 💫
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="border border-white/20 rounded-lg px-4 py-2 hover:bg-white/10 transition"
                >
                  Vazgeç
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    window.location.href = "https://discord.gg/F76mjaw25Q";
                  }}
                  className="bg-gradient-to-r from-pink-400 to-cyan-400 text-black px-4 py-2 font-semibold rounded-lg hover:scale-[1.03] transition"
                >
                  Onayla (₺250/ay)
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
