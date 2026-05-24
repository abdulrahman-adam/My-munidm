import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">

      <div className="text-center space-y-8 max-w-2xl">

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-extrabold text-gray-900"
        >
          Welcome to <span className="text-indigo-600">MunIDM</span>
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-sm sm:text-lg"
        >
          Manage your products, inventory, and business in one powerful system.
        </motion.p>

        {/* LOGIN BUTTON */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 10px 30px rgba(79, 70, 229, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white bg-indigo-600 rounded-full group transition-all duration-300"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-indigo-700 group-hover:scale-110 transition-transform duration-500"></span>

          <span className="relative flex items-center gap-2">
            Login
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </motion.button>

        {/* FOOTER TEXT */}
        <p className="text-xs text-gray-400 pt-10">
          Secure • Fast • Modern Inventory System
        </p>

      </div>
    </div>
  );
}