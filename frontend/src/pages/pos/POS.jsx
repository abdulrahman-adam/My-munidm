import { useState } from "react";
import { 
  Plus, Minus, Trash2, CreditCard, Search, WifiOff, ShoppingCart 
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

// Mock Data for POS
const MOCK_PRODUCTS = [
  { id: 1, name: "Artisan Coffee", price: 4.5, category: "Beverages", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "Avocado Toast", price: 8.5, category: "Food", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "Iced Latte", price: 5.0, category: "Beverages", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=200&q=80" },
  { id: 4, name: "Blueberry Muffin", price: 3.5, category: "Pastries", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=200&q=80" },
  { id: 5, name: "Green Tea", price: 3.0, category: "Beverages", image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=200&q=80" },
  { id: 6, name: "Club Sandwich", price: 11.0, category: "Food", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=200&q=80" },
];

export default function POS() {
  const { 
    currency, cart, addToCart, removeFromCart, clearCart, cartTotal, saveOfflineSale 
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    
    const saleData = {
      items: cart,
      total: cartTotal,
      date: new Date().toISOString()
    };

    // Simulate API call or Offline Fallback
    setTimeout(() => {
      if (!navigator.onLine) {
        saveOfflineSale(saleData);
      } else {
        // In a real app, you'd call axios.post('/api/sales', saleData) here
        toast.success("Payment processed successfully!");
      }
      clearCart();
      setIsCheckingOut(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left Column: Products */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-4 overflow-y-auto flex-1 bg-gray-50/50">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group flex flex-col h-full"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg mb-3">
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">{product.category}</p>
                    <h3 className="font-semibold text-gray-800 leading-tight">{product.name}</h3>
                  </div>
                  <p className="text-blue-600 font-bold mt-2">{currency}{product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Cart Sidebar */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="text-lg font-bold text-gray-800">Current Order</h2>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
              <Trash2 className="h-4 w-4" /> Clear
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
              <ShoppingCart className="h-12 w-12 opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex-1 pr-4">
                  <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                  <p className="text-gray-500 text-xs">{currency}{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                  <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer / Checkout */}
        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal</span>
              <span>{currency}{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Tax (0%)</span>
              <span>{currency}0.00</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>{currency}{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
          >
            {isCheckingOut ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                {!navigator.onLine ? <WifiOff className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                {navigator.onLine ? 'Process Payment' : 'Save Offline Sale'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}