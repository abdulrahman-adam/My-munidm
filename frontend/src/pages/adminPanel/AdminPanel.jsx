import { useEffect, useState } from "react";
import { TrendingUp, Users, ShoppingBag, Clock } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import Register from "../auth/Register";

export default function AdminPanel() {
  const {
    user,
    isAdmin,
    isManager,
    currency,
    offlineSales,
    getDashboardStats,
    getRecentSales,
  } = useAppContext();

  const [showRegister, setShowRegister] = useState(false);

  const [statsData, setStatsData] = useState({
    todaySales: 0,
    totalOrders: 0,
    activeCashiers: 0,
  });

  const [transactions, setTransactions] = useState([]);

  /* =========================
     LOAD REAL DATA
  ========================= */
  useEffect(() => {
    const load = async () => {
      try {
        const stats = await getDashboardStats();
        const sales = await getRecentSales();

        setStatsData(stats);
        setTransactions(sales || []);
      } catch (err) {
        console.log("Dashboard load error:", err);
      }
    };

    load();
  }, []);

  const stats = [
    {
      label: "Today's Sales",
      value: `${currency}${statsData.todaySales}`,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Orders",
      value: statsData.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending Offline",
      value: offlineSales.length.toString(),
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Active Cashiers",
      value: statsData.activeCashiers,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-500">
            Here's what's happening at your store today.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowRegister(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create User
          </button>
        )}
      </div>

      {/* STATS */}
      {(isAdmin || isManager) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className={`p-4 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TRANSACTIONS (NOW REAL DATA) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Recent Transactions
          </h3>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <ShoppingBag className="h-10 w-10 mb-2 opacity-30" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between border-b pb-2 text-sm"
                >
                  <span>{t.invoice_number || "SALE"}</span>
                  <span className="font-bold text-gray-700">
                    {currency}{t.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SYSTEM STATUS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            System Status
          </h3>

          <div className="space-y-4">

            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Network</span>
              <span className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Online
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Offline Cache</span>
              <span className="text-sm font-medium text-gray-800">
                {offlineSales.length} items
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Role</span>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {user?.role}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕ create user account
            </button>

            <Register />
          </div>
        </div>
      )}
    </div>
  );
}