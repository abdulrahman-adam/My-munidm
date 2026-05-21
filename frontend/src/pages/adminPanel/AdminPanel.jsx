import { useState } from "react";
import { Users, Settings, Database, TrendingUp } from "lucide-react";
import Register from "../auth/Register";

export default function AdminPanel() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-7 w-7 text-blue-600 animate-pulse" />
            System Administration
          </h1>

          <p className="text-gray-500 mt-1">
            Manage users, monitor system performance, and control POS configuration.
          </p>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={() => setShowRegister(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 hover:scale-105"
        >
          + Create User
        </button>
      </div>

      {/* STATS HEADER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "User Management",
            desc: "Add, edit or remove cashiers and managers",
            icon: Users,
            color: "text-blue-600",
          },
          {
            title: "Financial Reports",
            desc: "Export revenue, tax and sales analytics",
            icon: TrendingUp,
            color: "text-green-600",
          },
          {
            title: "Database Sync",
            desc: "Force synchronization across systems",
            icon: Database,
            color: "text-purple-600",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <card.icon
              className={`h-8 w-8 ${card.color} mb-4 group-hover:scale-110 transition-transform`}
            />
            <h3 className="text-lg font-bold text-gray-800">
              {card.title}
            </h3>
            <p className="text-gray-500 text-sm mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* SYSTEM INSIGHTS SECTION */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Live System Insights
        </h2>

        <div className="h-40 flex items-center justify-center text-gray-400">
          <p>📊 Analytics dashboard will be connected here (sales, users, logs)</p>
        </div>
      </div>

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl animate-[fadeIn_0.3s_ease-out]">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Create New User
            </h2>

            <Register />
          </div>
        </div>
      )}
    </div>
  );
}