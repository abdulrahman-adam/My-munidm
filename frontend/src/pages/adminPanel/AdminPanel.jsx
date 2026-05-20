import { Users, Settings, Database, TrendingUp } from "lucide-react";

export default function AdminPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-gray-500" /> System Administration
        </h1>
        <p className="text-gray-500">Manage users, view system logs, and configure POS settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "User Management", desc: "Add or remove cashiers and managers", icon: Users },
          { title: "Financial Reports", desc: "Export tax and revenue data", icon: TrendingUp },
          { title: "Database Sync", desc: "Force sync local databases", icon: Database },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer group">
            <card.icon className="h-8 w-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}