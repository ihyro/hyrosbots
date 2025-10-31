import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../AuthContext";
import { ArrowLeftStartOnRectangleIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/subscriptions").then(({ data }) => setItems(data.items || []));
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-gradient-to-br from-black via-[#0a0a1f] to-[#1a0033]">
      {/* Arka Plan Efekt */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#0ff_10%,transparent_60%),radial-gradient(circle_at_80%_80%,#f0f_10%,transparent_60%)] animate-[pulse_8s_infinite]" />

      {/* Kullanıcı Kartı */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-6 pt-16"
      >
        <div className="flex items-center justify-between rounded-2xl backdrop-blur-xl bg-white/10 p-6 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full ring-2 ring-cyan-400 shadow-lg"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-white/20" />
              )}
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                {user?.username || "Misafir"}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Discord Bot Yönetim Paneli
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Geri Dön Butonu */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-200 to-white text-black font-semibold hover:from-cyan-400 hover:to-pink-400 hover:text-white transition-all shadow-md"
            >
              <ArrowUturnLeftIcon className="h-5 w-5" />
              Geri Dön
            </motion.button>

            {/* Çıkış Yap Butonu */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gradient-to-r from-cyan-400 to-pink-400 hover:text-white transition-all shadow-md"
            >
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
              Çıkış Yap
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Satın Alınanlar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-5xl mx-auto px-6 py-16"
      >
        <h2 className="text-2xl font-bold mb-6">Satın Aldıkların</h2>

        {items.length === 0 ? (
          <div className="text-white/60 text-center py-10 italic">
            Henüz bir bot satın alınmamış 💭
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {items.map((it, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="rounded-2xl p-5 bg-white/10 border border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{it.botId}</h3>
                  <span className="text-xs text-cyan-300">
                    {new Date(it.ts).toLocaleString()}
                  </span>
                </div>
                <a
                  className="block text-center px-4 py-2 mt-3 rounded-lg bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-semibold hover:opacity-90 transition"
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Kurulum Talimatı
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
