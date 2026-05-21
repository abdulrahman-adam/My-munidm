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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm py-6">

    {/* MODAL CARD */}
    <div
      className="
        relative
        w-full
        max-w-lg
        bg-white
        shadow-2xl
        border border-gray-100
        overflow-hidden
        animate-[fadeIn_0.25s_ease-out]
      "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Create New User
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Create cashier, manager, or admin account
          </p>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowRegister(false)}
          className="
            flex items-center justify-center
            w-10 h-10
            rounded-full
            bg-gray-100
            hover:bg-red-100
            text-gray-500
            hover:text-red-600
            transition-all duration-200
          "
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="max-h-[85vh] overflow-y-auto">
        <Register />
      </div>
    </div>
  </div>
)}
    </div>
  );
}