import { motion } from "framer-motion";
import {
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

const bots = [
  {
    id: "gmail",
    name: "Gmail Onaylı Kayıt Botu",
    price: 250,
    desc: "Gmail doğrulamasıyla güvenli kayıt sistemi. Anti-spam koruma, şık panel yönetimi ve özel giriş akışı.",
    gradient: "from-cyan-500 via-blue-500 to-purple-600",
    icon: SparklesIcon,
  },
  {
    id: "fal",
    name: "Fal Randevu Botu",
    price: 250,
    desc: "Kahve falı için DM üzerinden otomatik randevu planlayan sistem. Bildirimli, etkileşimli ve eğlenceli.",
    gradient: "from-pink-500 via-fuchsia-500 to-violet-600",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    id: "ai-satis",
    name: "Yapay Zeka Satış Botu",
    price: 250,
    desc: "AI destekli sohbetlerle otomatik müşteri yönlendirme ve satış sistemi. Gerçek zamanlı öğrenme altyapısı.",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    icon: CpuChipIcon,
  },
  {
    id: "boost",
    name: "Sunucu Boost Takip Botu",
    price: 200,
    desc: "Sunucundaki boost’ları izleyen, kullanıcıya özel teşekkür mesajları gönderen zarif takip botu.",
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    icon: RocketLaunchIcon,
  },
  {
    id: "music",
    name: "Müzik & DJ Botu",
    price: 300,
    desc: "Spotify & YouTube entegrasyonlu müzik botu. Bass boost, 3D surround, playlist kaydetme özellikleriyle efsane.",
    gradient: "from-indigo-500 via-blue-400 to-sky-500",
    icon: SparklesIcon,
  },
  {
    id: "guard",
    name: "Sunucu Güvenlik Botu",
    price: 275,
    desc: "Anti-raid, anti-link, yeni kullanıcı doğrulama sistemi. Her Discord topluluğu için sarsılmaz güvenlik.",
    gradient: "from-red-500 via-rose-500 to-pink-600",
    icon: CpuChipIcon,
  },
];

export default function Store() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Neon Background */}
      <div className="absolute inset-0 -z-10">
        <div className="w-[800px] h-[800px] bg-fuchsia-500/25 rounded-full blur-[220px] absolute -top-60 -left-40 animate-pulse"></div>
        <div className="w-[600px] h-[600px] bg-cyan-500/25 rounded-full blur-[220px] absolute bottom-0 right-0 animate-pulse delay-700"></div>
      </div>

      {/* Geri Dön Butonu */}
      <div className="absolute top-6 left-6">
        <a
          href="/"
          className="flex items-center gap-2 text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Geri Dön
        </a>
      </div>

      {/* Başlık */}
      <div className="text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold mb-4"
        >
          🚀 Premium Discord Bot Mağazası
        </motion.h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Modern, hızlı ve akıllı bot çözümleri. Tüm sistemler tamamen optimize — güvenli ödeme, anında destek.
        </p>
      </div>

      {/* Bot Kartları */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-6 pb-20">
        {bots.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.04 }}
            className={`relative group p-[2px] rounded-3xl bg-gradient-to-br ${b.gradient} shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
          >
            <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-6 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <b.icon className="h-8 w-8 text-white/90" />
                  <h2 className="text-2xl font-bold">{b.name}</h2>
                </div>
                <p className="text-white/70 text-sm">{b.desc}</p>
              </div>

              <div className="flex justify-between items-center mt-6">
                <span className="text-3xl font-extrabold">₺{b.price}</span>
                <motion.a
                  href="https://discord.gg/F76mjaw25Q"
                  target="_blank"
                  rel="noreferrer"
                  whileTap={{ scale: 0.95 }}
                  className="relative px-5 py-2 rounded-lg font-bold text-black transition-transform hover:scale-[1.05] focus:scale-[1.02] bg-gradient-to-r from-white to-gray-300 select-none cursor-pointer"
                >
                  Satın Al
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center py-6 text-white/60 text-sm">
        © {new Date().getFullYear()} Kaan’s Discord Bots — Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
