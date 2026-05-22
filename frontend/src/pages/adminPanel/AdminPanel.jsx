import { useState } from "react";
import {
  Users,
  Settings,
  Database,
  TrendingUp,
  Package,
  Tags,
} from "lucide-react";

import Register from "../auth/Register";
import UserManagement from "../../components/admin/UserManagement";

export default function AdminPanel() {
  const [showRegister, setShowRegister] = useState(false);
  const [activeSection, setActiveSection] = useState("");

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
            Manage users, products, categories and system settings.
          </p>
        </div>

        <button
          onClick={() => setShowRegister(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 hover:scale-105"
        >
          + Create User
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        {[
          {
            title: "User Management",
            desc: "Add, edit or remove users",
            icon: Users,
            color: "text-blue-600",
            section: "users",
          },
          {
            title: "Category Management",
            desc: "Manage product categories",
            icon: Tags,
            color: "text-orange-600",
            section: "categories",
          },
          {
            title: "Product Management",
            desc: "Add and manage products",
            icon: Package,
            color: "text-indigo-600",
            section: "products",
          },
          {
            title: "Reports",
            desc: "Sales & financial analytics",
            icon: TrendingUp,
            color: "text-green-600",
            section: "reports",
          },
          {
            title: "Database",
            desc: "Sync system data",
            icon: Database,
            color: "text-purple-600",
            section: "database",
          },
        ].map((card, i) => (
          <div
            key={i}
            onClick={() => setActiveSection(card.section)}
            className={`
              bg-white p-6 rounded-xl shadow-sm border cursor-pointer
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group

              ${
                activeSection === card.section
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-100"
              }
            `}
          >
            <card.icon className={`h-8 w-8 ${card.color} mb-4 group-hover:scale-110 transition-transform`} />

            <h3 className="text-lg font-bold text-gray-800">
              {card.title}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* =========================
          ACTIVE SECTIONS
      ========================= */}

      {activeSection === "users" && <UserManagement />}

      {activeSection === "categories" && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Category Management</h2>
          <p className="text-gray-500">🗂️ Categories CRUD will be here</p>
        </div>
      )}

      {activeSection === "products" && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Product Management</h2>
          <p className="text-gray-500">📦 Products CRUD will be here</p>
        </div>
      )}

      {activeSection === "reports" && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Reports</h2>
          <p className="text-gray-500">📈 Reports coming soon...</p>
        </div>
      )}

      {activeSection === "database" && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Database</h2>
          <p className="text-gray-500">🗄️ Sync tools coming soon...</p>
        </div>
      )}

      {activeSection === "" && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold mb-4">Live System Insights</h2>
          <p className="text-gray-400">
            📊 Select a module to manage system data
          </p>
        </div>
      )}

      {/* =========================
          REGISTER MODAL
      ========================= */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm py-6">

          <div className="relative w-full max-w-lg bg-white shadow-2xl border overflow-hidden">

            <div className="flex items-center justify-between border-b px-6 py-5">

              <div>
                <h2 className="text-xl font-bold">Create New User</h2>
                <p className="text-sm text-gray-500">
                  Create cashier, manager, or admin account
                </p>
              </div>

              <button
                onClick={() => setShowRegister(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100"
              >
                ✕
              </button>

            </div>

            <div className="max-h-[85vh] overflow-y-auto">
              <Register />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}