import { TrendingUp, Users, ShoppingBag, Clock } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function Dashboard() {
  const { user, isAdmin, isManager, currency, offlineSales } = useAppContext();

  const stats = [
    { label: "Today's Sales", value: `${currency}1,240.50`, icon: TrendingUp, color: "bg-green-100 text-green-600" },
    { label: "Total Orders", value: "84", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
    { label: "Pending Offline", value: offlineSales.length.toString(), icon: Clock, color: "bg-amber-100 text-amber-600" },
    { label: "Active Cashiers", value: "3", icon: Users, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-500">Here's what's happening at your store today.</p>
        </div>
      </div>

      {/* Stats Grid - Show more details for Admins/Managers */}
      {(isAdmin || isManager) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-4 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <ShoppingBag className="h-10 w-10 mb-2 opacity-30" />
            <p>Connect backend API to display real-time history.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Network</span>
              <span className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Offline Cache</span>
              <span className="text-sm font-medium text-gray-800">{offlineSales.length} items</span>
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
    </div>
  );
}