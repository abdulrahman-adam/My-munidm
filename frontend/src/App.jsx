import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { useAppContext } from "./context/AppContext";

// Components
import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import POS from "./pages/pos/POS";
import AdminPanel from "./pages/adminPanel/AdminPanel";
import Home from "./pages/home/Home";

// IMPORTANT: Outlet fix
import { Outlet } from "react-router-dom";
import CashierDashboard from "./pages/cashier/CashierDashboard";

/* =========================
   LAYOUT (FIXED)
========================= */
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

/* =========================
   APP
========================= */
export default function App() {
  const { loading } = useAppContext();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* =========================
            PROTECTED LAYOUT GROUP
        ========================= */}
        <Route element={<Layout />}>


          {/* DASHBOARD (ADMIN ONLY OR AUTH MANAGER) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* POS SYSTEM */}
          <Route
            path="/pos"
            element={
              <ProtectedRoute allowedRoles={["CASHIER", "MANAGER", "ADMIN"]}>
                <POS />
              </ProtectedRoute>
            }
          />

          {/* ADMIN PANEL */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />


          {/* CASHIER DASHBOARD */}
          <Route
            path="/cashier-dashboard"
            element={
              <ProtectedRoute allowedRoles={["CASHIER"]}>
                <CashierDashboard />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* =========================
            FALLBACK ROUTE
        ========================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}