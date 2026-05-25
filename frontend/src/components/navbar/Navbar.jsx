import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, Menu, X, WifiOff, LayoutDashboard, Calculator, Shield } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export default function Navbar() {
  const { user, logout, cart, offlineSales, syncOfflineSales, isAdmin, isManager, isCashier } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Close menu when a link is clicked
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <Calculator className="h-6 w-6" />
              <span>Fancymarket</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/admin-dashboard" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 font-medium">
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
              <button onClick={syncOfflineSales} className="flex items-center gap-2 text-sm bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md font-medium hover:bg-amber-200 transition-colors">
                <WifiOff className="h-4 w-4" /> Sync {offlineSales.length} Sales
              </button>
            )}

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button onClick={logout} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 p-2 z-[60] relative pointer-events-auto transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[40] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sliding Mobile Menu (Right to Left) */}
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[50] shadow-2xl transform transition-transform duration-500 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col pt-20 px-6 space-y-6">
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-blue-600">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          {(isCashier || isManager || isAdmin) && (
            <Link to="/pos" onClick={handleLinkClick} className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-blue-600">
              <ShoppingCart className="h-5 w-5" /> Point of Sale
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={handleLinkClick} className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-blue-600">
              <Shield className="h-5 w-5" /> Admin Panel
            </Link>
          )}
          {offlineSales.length > 0 && (
            <button onClick={() => { syncOfflineSales(); handleLinkClick(); }} className="flex items-center gap-3 text-lg font-medium text-amber-600">
              <WifiOff className="h-5 w-5" /> Sync {offlineSales.length} Sales
            </button>
          )}
          <button onClick={() => { logout(); handleLinkClick(); }} className="flex items-center gap-3 text-lg font-medium text-red-600 pt-6 border-t border-gray-100">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}