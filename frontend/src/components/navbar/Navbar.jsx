import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, Menu, X, WifiOff, LayoutDashboard, Calculator, Shield } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function Navbar() {
  const { user, logout, cart, offlineSales, syncOfflineSales, isAdmin, isManager, isCashier } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <Calculator className="h-6 w-6" />
              <span>SmartPOS</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 font-medium">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            
            {(isCashier || isManager || isAdmin) && (
              <Link to="/pos" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 font-medium">
                <ShoppingCart className="h-4 w-4" /> Point of Sale
                {cartItemCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 font-medium">
                <Shield className="h-4 w-4" /> Admin Panel
              </Link>
            )}

            {offlineSales.length > 0 && (
              <button 
                onClick={syncOfflineSales}
                className="flex items-center gap-2 text-sm bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md font-medium hover:bg-amber-200 transition-colors"
              >
                <WifiOff className="h-4 w-4" />
                Sync {offlineSales.length} Sales
              </button>
            )}

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50">Dashboard</Link>
          {(isCashier || isManager || isAdmin) && (
            <Link to="/pos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50">Point of Sale</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50">Admin Panel</Link>
          )}
          {offlineSales.length > 0 && (
            <button onClick={syncOfflineSales} className="w-full text-left px-3 py-2 text-amber-600 font-medium">
              Sync {offlineSales.length} Offline Sales
            </button>
          )}
          <button onClick={logout} className="w-full text-left px-3 py-2 text-red-600 font-medium">Logout</button>
        </div>
      )}
    </nav>
  );
}