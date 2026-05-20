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

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
    <Navbar />
    <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {children}
    </main>
  </div>
);

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
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes (Authenticated) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* POS System (Cashier, Manager, Admin) */}
        <Route
          path="/pos"
          element={
            <ProtectedRoute allowedRoles={["CASHIER", "MANAGER", "ADMIN"]}>
              <Layout>
                <POS />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Panel (Admin Only) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <AdminPanel />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}