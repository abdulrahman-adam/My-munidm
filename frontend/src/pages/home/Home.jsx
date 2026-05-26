import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4">

      {/* 🌌 Animated background blobs */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[520px] h-[520px] bg-indigo-600/25 rounded-full blur-[140px] top-[-120px] left-[-120px]"
      />

      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[420px] h-[420px] bg-purple-600/25 rounded-full blur-[140px] bottom-[-120px] right-[-120px]"
      />

      {/* ✨ Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center space-y-8 max-w-2xl p-10 backdrop-blur-3xl shadow-2xl"
      >

        {/* 🔥 Title */}
        <motion.h1
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight"
        >
          Bienvenue à{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 animate-pulse">
            Fancymarket
          </span>
        </motion.h1>

        {/* 💡 Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-gray-300 text-sm sm:text-lg leading-relaxed"
        >
         Gérez vos produits, vos stocks, vos ventes et vos données commerciales grâce à un système de point de vente puissant et

moderne, conçu pour la rapidité et le contrôle.
        </motion.p>

        {/* 🚀 Button */}
        <motion.button
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 25px 70px rgba(99, 102, 241, 0.55)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="relative inline-flex items-center justify-center px-10 py-4 font-bold text-white rounded-2xl overflow-hidden"
        >
          {/* animated gradient background */}
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-[length:200%_200%]"
          />

          {/* glow layer */}
          <span className="absolute inset-0 opacity-30 bg-white blur-2xl group-hover:opacity-60 transition" />

          <span className="relative flex items-center gap-2 text-lg">
            Se connecter
            <motion.svg
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </motion.svg>
          </span>
        </motion.button>

        {/* 🧾 Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-8 flex flex-col items-center gap-2"
        >
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <p className="text-xs text-gray-400 tracking-widest uppercase">
    
            Système • d'inventaire sécurisé • rapide et moderne
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}