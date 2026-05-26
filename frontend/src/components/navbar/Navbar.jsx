import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  Menu,
  X,
  WifiOff,
  LayoutDashboard,
  Calculator,
  Shield,
} from "lucide-react";

import { useAppContext } from "../../context/AppContext";

export default function Navbar() {
  const {
    user,
    logout,
    cart,
    offlineSales,
    syncOfflineSales,
    isAdmin,
    isManager,
    isCashier,
  } = useAppContext();

  const [isOpen, setIsOpen] = useState(false);

  const cartItemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Close menu when a link is clicked
  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* =========================
                LOGO
            ========================= */}
            <div className="flex items-center">
              <Link
                to="/admin-dashboard"
                className="group flex items-center gap-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-all duration-500"></div>

                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all duration-500">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                    Fancymarket
                  </h1>

                  <p className="text-[11px] text-gray-500 font-medium tracking-wider uppercase">
                    Smart POS System
                  </p>
                </div>
              </Link>
            </div>

            {/* =========================
                DESKTOP MENU
            ========================= */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <Link
                to="/admin-dashboard"
                className="group relative text-gray-600 hover:text-blue-600 flex items-center gap-2 font-semibold transition-all duration-300"
              >
                <div className="absolute -bottom-2 left-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>

                <LayoutDashboard className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />

                Dashboard
              </Link>

              {(isCashier || isManager || isAdmin) && (
                <Link
                  to="/pos"
                  className="group relative text-gray-600 hover:text-blue-600 flex items-center gap-2 font-semibold transition-all duration-300"
                >
                  <div className="absolute -bottom-2 left-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>

                  <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />

                  Point of Sale

                  {cartItemCount > 0 && (
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* BARCODE SCANNER */}
              <Link
                to="/search-product"
                className="group relative text-gray-600 hover:text-cyan-600 flex items-center gap-2 font-semibold transition-all duration-300"
              >
                <div className="absolute -bottom-2 left-0 h-[2px] w-0 bg-cyan-600 transition-all duration-300 group-hover:w-full"></div>

                <Calculator className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />

                Search Product
              </Link>

              {isAdmin && (
                <Link
                  to="/admin-panel"
                  className="group relative text-gray-600 hover:text-purple-600 flex items-center gap-2 font-semibold transition-all duration-300"
                >
                  <div className="absolute -bottom-2 left-0 h-[2px] w-0 bg-purple-600 transition-all duration-300 group-hover:w-full"></div>

                  <Shield className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />

                  Admin Panel
                </Link>
              )}

              {offlineSales.length > 0 && (
                <button
                  onClick={syncOfflineSales}
                  className="flex items-center gap-2 text-sm bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <WifiOff className="h-4 w-4 animate-pulse" />

                  Sync {offlineSales.length} Sales
                </button>
              )}

              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>

              {/* USER */}
              <div className="flex items-center gap-4">
                <div className="hidden xl:flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black shadow-lg">
                    {user?.name?.charAt(0)}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">
                      {user?.name}
                    </p>

                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {user?.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="group p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 hover:rotate-12 hover:shadow-lg"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* =========================
                MOBILE BUTTON
            ========================= */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isOpen
                    ? "bg-red-50 text-red-600 rotate-90"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================
          OVERLAY
      ========================= */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] transition-all duration-500 lg:hidden ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* =========================
          MOBILE DRAWER
      ========================= */}
      <div
        className={`fixed top-0 right-0 h-full w-[330px] max-w-full bg-white z-[50] shadow-2xl transform transition-all duration-500 ease-in-out lg:hidden overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* TOP */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-6">
          {/* Glow */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>

          {/* HEADER */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <Calculator className="h-7 w-7 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Fancymarket
                </h2>

                <p className="text-blue-100 text-sm">
                  Smart POS System
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="h-11 w-11 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-md hover:rotate-90 transition-all duration-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* USER */}
          <div className="mt-8 flex items-center gap-4 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {user?.name?.charAt(0)}
            </div>

            <div>
              <p className="text-white font-bold text-lg">
                {user?.name}
              </p>

              <p className="text-blue-100 text-sm uppercase tracking-wider">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            LINKS
        ========================= */}
        <div className="p-5 space-y-3">
          {/* DASHBOARD */}
          <Link
            to="/admin-dashboard"
            onClick={handleLinkClick}
            className="group flex items-center gap-4 rounded-2xl px-4 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-2"
          >
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <LayoutDashboard className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold text-base">
                Dashboard
              </p>

              <p className="text-xs text-gray-500">
                Manage your dashboard
              </p>
            </div>
          </Link>

          {/* POS */}
          {(isCashier || isManager || isAdmin) && (
            <Link
              to="/pos"
              onClick={handleLinkClick}
              className="group flex items-center justify-between rounded-2xl px-4 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:translate-x-2"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <ShoppingCart className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-base">
                    Point of Sale
                  </p>

                  <p className="text-xs text-gray-500">
                    Sell products quickly
                  </p>
                </div>
              </div>

              {cartItemCount > 0 && (
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs rounded-full min-w-[28px] h-7 px-2 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* BARCODE */}
          <Link
            to="/search-product"
            onClick={handleLinkClick}
            className="group flex items-center gap-4 rounded-2xl px-4 py-4 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-all duration-300 hover:translate-x-2"
          >
            <div className="h-12 w-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:rotate-12 transition-all duration-300">
              <Calculator className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold text-base">
                Search Product
              </p>

              <p className="text-xs text-gray-500">
                Scan and search products
              </p>
            </div>
          </Link>

          {/* ADMIN */}
          {isAdmin && (
            <Link
              to="/admin-panel"
              onClick={handleLinkClick}
              className="group flex items-center gap-4 rounded-2xl px-4 py-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:translate-x-2"
            >
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <Shield className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold text-base">
                  Admin Panel
                </p>

                <p className="text-xs text-gray-500">
                  Manage administrators
                </p>
              </div>
            </Link>
          )}

          {/* OFFLINE SALES */}
          {offlineSales.length > 0 && (
            <button
              onClick={() => {
                syncOfflineSales();
                handleLinkClick();
              }}
              className="w-full group flex items-center gap-4 rounded-2xl px-4 py-4 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <WifiOff className="h-5 w-5 animate-pulse" />
              </div>

              <div className="text-left">
                <p className="font-bold text-base">
                  Sync Offline Sales
                </p>

                <p className="text-xs text-amber-600">
                  {offlineSales.length} pending sales
                </p>
              </div>
            </button>
          )}

          {/* LOGOUT */}
          <button
            onClick={() => {
              logout();
              handleLinkClick();
            }}
            className="w-full group flex items-center gap-4 rounded-2xl px-4 py-4 text-red-600 hover:bg-red-50 transition-all duration-300 mt-6 border border-red-100"
          >
            <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:rotate-12 transition-all duration-300">
              <LogOut className="h-5 w-5" />
            </div>

            <div className="text-left">
              <p className="font-bold text-base">
                Logout
              </p>

              <p className="text-xs text-red-400">
                Exit from your account
              </p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}