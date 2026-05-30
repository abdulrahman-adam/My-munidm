import { useState, useRef, useEffect } from "react";
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
import CategoryManagement from "../../components/admin/CategoryManagement";
import ProductManagement from "../../components/admin/ProductManagement";
import InventoryDashboard from "../../components/inventory/InventoryDashboard";
import ReportsDashboard from "../../components/reports/ReportsDashboard";

export default function AdminDashboard() {
  const [showRegister, setShowRegister] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // ✅ ADD REF FOR SCROLL
  const sectionRef = useRef(null);

  // ✅ AUTO SCROLL WHEN SECTION CHANGES
  useEffect(() => {
    if (activeSection && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "categories":
        return <CategoryManagement />;
      case "products":
        return <ProductManagement />;
      case "reports":
        return <ReportsDashboard />;
      case "database":
        return <InventoryDashboard />;
      default:
        return null;
    }
  };

  return (
    <div
  className="px-2 md:px-4 lg:px-10"
 
>
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
          className="px-5 py-2.5 bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all duration-300 hover:scale-105"
        >
          + Create User
        </button>
      </div>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
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
            <card.icon
              className={`h-8 w-8 ${card.color} mb-4 group-hover:scale-110 transition-transform`}
            />

            <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>

            <p className="text-gray-500 text-sm mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* ================= ACTIVE SECTION ================= */}
      {activeSection && (
        <div
          ref={sectionRef}
          className="relative bg-white transition-all duration-500 mt-8"
        >
          {/* BACK BUTTON */}
          <button
            onClick={() => setActiveSection("")}
            className="mb-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            ← Back
          </button>

          {/* SECTION CONTENT */}
          <div className="animate-[fadeIn_0.4s_ease]">{renderSection()}</div>
        </div>
      )}

      {/* DEFAULT VIEW */}
      {activeSection === "" && (
        <div className="w-full bg-white py-6 shadow-sm mt-8 px-4">
          <h2 className="text-lg font-bold mb-4">Live System Insights</h2>
          <p className="text-gray-400">
            📊 Select a module to manage system data
          </p>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
  
  <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl bg-white shadow-2xl border border-gray-200 rounded-2xl flex flex-col max-h-[95vh]">

    {/* HEADER */}
    <div className="flex items-start justify-between border-b px-5 md:px-6 py-0 flex-shrink-0">

      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900">
          Create New User
        </h2>
        <p className="text-sm text-gray-500">
          Create cashier, manager, or admin account
        </p>
      </div>

      <button
        onClick={() => setShowRegister(false)}
        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-200"
      >
        ✕
      </button>

    </div>

    {/* CONTENT */}
    <div className="px-2 md:px-2 py-2 flex-1 overflow-hidden">
      <Register />
    </div>

  </div>
</div>
      )}

      {/* ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
