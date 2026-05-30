import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  Package,
  AlertTriangle,
  Layers3,
  DollarSign,
  Wifi,
  WifiOff,
  Activity,
  Receipt,
} from "lucide-react";

import { motion } from "framer-motion";

import { useAppContext } from "../../context/AppContext";
import Register from "../auth/Register";

export default function AdminPanel() {

const {
  user,
  isAdmin,
  isManager,
  currency,
  offlineSales,
  sales,
  categories,
  products,
  users,
  lowStock,
  getAllSales,
  getUsers,
  getProducts,
  getLowStockProducts,
} = useAppContext();

const [showRegister, setShowRegister] = useState(false);
const [loading, setLoading] = useState(true);


const safeUsers = users ?? [];
// const safeUsers = Array.isArray(users) ? users : [];
const safeLowStock = lowStock ?? [];
// const safeLowStock = Array.isArray(lowStock) ? lowStock : [];
const safeProducts = products ?? [];
const safeSales = sales ?? [];
const safeOfflineSales = offlineSales ?? [];

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const todaySales = useMemo(() => {
    const today = new Date().toDateString();

    return (sales || [])
      .filter(
        (sale) =>
          new Date(sale.createdAt).toDateString() ===
          today
      )
      .reduce(
        (acc, sale) => acc + Number(sale.total || 0),
        0
      );
  }, [sales]);

  const totalOrders = sales?.length || 0;

const activeCashiers = useMemo(() => {
  return safeUsers.filter(
    (u) => u.role?.toUpperCase() === "CASHIER"
  ).length;
}, [safeUsers]);

const totalProducts = (products || []).length;

 const expiredProducts = (products || []).filter(
  (p) => p.is_expired
).length;

  const expiringSoon = products.filter(
    (p) => p.is_expiring_soon
  ).length;

  const totalCategories = categories?.length || 0;

const totalStockValue = (products || []).reduce(
  (acc, p) =>
    acc + Number(p.price || 0) * Number(p.stock || 0),
  0
);

  const stats = [
    {
      label: "Today's Sales",
      value: `${currency}${todaySales.toFixed(2)}`,
      icon: TrendingUp,
      color:
        "from-green-500 to-emerald-500",
      bg: "bg-green-500/10",
    },

    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color:
        "from-indigo-500 to-blue-500",
      bg: "bg-indigo-500/10",
    },

    {
      label: "Products",
      value: totalProducts,
      icon: Package,
      color:
        "from-cyan-500 to-sky-500",
      bg: "bg-cyan-500/10",
    },

    {
      label: "Categories",
      value: totalCategories,
      icon: Layers3,
      color:
        "from-purple-500 to-fuchsia-500",
      bg: "bg-purple-500/10",
    },

    {
      label: "Low Stock",
      value: safeLowStock.length,
      icon: AlertTriangle,
      color:
        "from-orange-500 to-amber-500",
      bg: "bg-orange-500/10",
    },

    {
      label: "Active Cashiers",
      // value: activeCashiers,
      value: safeUsers.length,
      icon: Users,
      color:
        "from-pink-500 to-rose-500",
      bg: "bg-pink-500/10",
    },

    {
      label: "Offline Sales",
      value: offlineSales.length,
      icon: Clock,
      color:
        "from-yellow-500 to-orange-500",
      bg: "bg-yellow-500/10",
    },

    {
      label: "Stock Value",
      value: `${currency}${totalStockValue.toFixed(
        2
      )}`,
      icon: DollarSign,
      color:
        "from-teal-500 to-green-500",
      bg: "bg-teal-500/10",
    },
  ];

  const recentTransactions = useMemo(() => {
  return (sales || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10); // last 10 sales
}, [sales]);

console.log("LOW STOCK:", lowStock ?? []);
console.log("USERS:", users ?? []);


useEffect(() => {
  console.log("ADMIN PANEL USERS:", users);
  console.log("ADMIN PANEL LOW STOCK:", lowStock);
}, [users, lowStock]);


useEffect(() => {
  console.log("🔥 ADMIN PANEL RENDER STATE:", {
    user,
    users,
    lowStock,
    products
  });
}, [user, users, lowStock, products]);



  return (
    <div className="space-y-8">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-8 shadow-2xl"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-600/20 blur-[120px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div>
            <motion.h1
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="text-3xl md:text-5xl font-black text-white"
            >
              Welcome back{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {user?.name}
              </span>
            </motion.h1>

            <p className="mt-4 text-slate-300 text-sm md:text-base max-w-2xl">
              Real-time analytics, sales monitoring,
              inventory management, and cashier activity
              from your smart POS ecosystem.
            </p>
          </div>

          {isAdmin && (
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                setShowRegister(true)
              }
              className="group relative overflow-hidden px-6 py-4 font-bold text-white shadow-2xl"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-700 group-hover:scale-110" />

              <span className="relative z-10">
                + Create User
              </span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* =========================================================
          STATS
      ========================================================= */}
      {(isAdmin || isManager) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/70 backdrop-blur-2xl p-6 shadow-xl"
            >
              {/* animated glow */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br ${stat.color}`}
              />

              <div className="relative z-10 flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {stat.label}
                  </p>

                  <h3 className="mt-2 text-3xl font-black text-gray-900">
                    {stat.value}
                  </h3>
                </div>

                <div
                  className={`p-4 rounded-2xl ${stat.bg}`}
                >
                  <stat.icon className="h-7 w-7 text-gray-800" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* =========================================================
            RECENT SALES
        ========================================================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="xl:col-span-2 border border-white/10 bg-white/70 backdrop-blur-2xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-indigo-500/10">
              <Receipt className="h-6 w-6 text-indigo-600" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Recent Transactions
              </h2>

              <p className="text-sm text-gray-500">
                Latest sales from database
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl animate-pulse bg-gray-200"
                />
              ))}
            </div>
          ) : recentTransactions.length ===
            0 ? (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400">
              <ShoppingBag className="h-16 w-16 opacity-20" />

              <p className="mt-4 text-lg">
                No sales yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map(
                (sale, index) => (
                  <motion.div
                    key={sale.id}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      scale: 1.01,
                    }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg"
                  >
                    <div>
                      <h4 className="font-black text-gray-900">
                        {sale.invoice_number ||
                          "SALE"}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          sale.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">

                      <span className="rounded-xl bg-green-100 px-4 py-2 font-bold text-green-700">
                        {currency}
                        {sale.total}
                      </span>

                      <span className="rounded-xl bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
                        {sale.payment_method}
                      </span>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </motion.div>

        {/* =========================================================
            SYSTEM STATUS
        ========================================================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="border border-white/10 bg-white/70 backdrop-blur-2xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-green-500/10">
              <Activity className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900">
                System Status
              </h2>

              <p className="text-sm text-gray-500">
                Live application status
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {/* NETWORK */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                {navigator.onLine ? (
                  <Wifi className="text-green-600" />
                ) : (
                  <WifiOff className="text-red-600" />
                )}

                <span className="font-semibold text-gray-700">
                  Network
                </span>
              </div>

              <span
                className={`px-3 py-1 rounded-xl text-sm font-bold ${
                  navigator.onLine
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {navigator.onLine
                  ? "ONLINE"
                  : "OFFLINE"}
              </span>
            </div>

            {/* ROLE */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span className="font-semibold text-gray-700">
                Current Role
              </span>

              <span className="px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 text-sm font-bold">
                {user?.role}
              </span>
            </div>

            {/* EXPIRED */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span className="font-semibold text-gray-700">
                Expired Products
              </span>

              <span className="px-3 py-1 rounded-xl bg-red-100 text-red-700 text-sm font-bold">
                {expiredProducts}
              </span>
            </div>

            {/* EXPIRING SOON */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span className="font-semibold text-gray-700">
                Expiring Soon
              </span>

              <span className="px-3 py-1 rounded-xl bg-orange-100 text-orange-700 text-sm font-bold">
                {expiringSoon}
              </span>
            </div>

            {/* LOW STOCK */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span className="font-semibold text-gray-700">
                Low Stock Alerts
              </span>

              <span className="px-3 py-1 rounded-xl bg-yellow-100 text-yellow-700 text-sm font-bold">
                {safeLowStock.length}
              </span>
            </div>

          </div>
        </motion.div>
      </div>

      {/* =========================================================
          REGISTER MODAL
      ========================================================= */}
      {showRegister && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
              y: 40,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl"
          >
            <button
              onClick={() =>
                setShowRegister(false)
              }
              className="absolute right-5 top-5 rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-200"
            >
              ✕ Close
            </button>

            <Register />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}