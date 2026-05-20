

import React from "react";
import { Link, NavLink, Outlet, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/loading/Loading";
import { assets } from "../../assets/assets";

const AdminLayout = () => {
  const { axios, navigate, setIsSeller, setUserData, setUser, user, isSeller,adminData } = useAppContext();
  // const { adminData, isSeller, logout } = useAppContext();

  const sidebarLinks = [
    { name: "Add Product", path: "/admin", icon: assets.add_icon },
    { name: "Product List", path: "/admin/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
    { name: "Add Category", path: "/admin/add-category", icon: assets.add_icon },
    { name: "Category List", path: "/admin/category-list", icon: assets.product_list_icon },
    { name: "Contact List", path: "/admin/all-contact", icon: assets.product_list_icon },
    { name: "Hours List", path: "/admin/hours", icon: assets.coin_icon },
    { name: "Partenaire List", path: "/admin/all-partenaire", icon: assets.delivery_truck_icon },
  ];

  // --- 1. THE REFRESH PROTECTION ---
  // If we don't know if the user is a seller yet, show the loader.
  // This prevents the screen from going black or jumping to the login page.
  if (isSeller === null) {
    return <Loading />;
  }

  // If the check finished and they are NOT a seller, redirect them to login
  if (isSeller === false) {
    return <Navigate to="/admin" />;
  }

  const logout = async () => {
  try {
    const { data } = await axios.get("/api/seller/logout");

    if (data && data.success) {
      // 1. Check if setters are actually functions before calling
      if (typeof setIsSeller === 'function') {
          setIsSeller(false);
      }
      
      if (typeof setUserData === 'function') {
          setUserData(null);
      }

      if (typeof setUser === 'function') {
          setUser(null);
      }

      // 2. Ensure toast exists and is called correctly
      toast.success(data.message || "Déconnecté");

      // 3. Ensure navigate is a function
      if (typeof navigate === 'function') {
          navigate("/");
      } else {
          window.location.href = "/"; // Fallback if navigate fails
      }
    }
  } catch (error) {
    console.error("Full logout error:", error);
    toast.error(error?.response?.data?.message || error.message);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- NAVBAR --- */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white sticky top-0 z-10" style={{height: "55px"}}>
        <Link to='/'>
          <img src="/logo.png" alt="logo" className="cursor-pointer md:w-38" style={{width: "55px", height: "55px"}}/>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 text-gray-600">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Mode Administrateur</p>
            <p className="text-sm font-medium text-indigo-600">
              {/* Salut, {user ? user.name : "Admin"} */}
              Salut, {adminData ? adminData.name : "Admin"}
            </p>
          </div>
          
          <p className="sm:hidden text-sm font-medium text-indigo-600">
            {user ? user.name.split(' ')[0] : "Admin"}
          </p>

          <button 
            onClick={logout} 
            className="bg-red-500 hover:bg-red-600 transition-colors rounded-full text-xs px-4 py-1.5 text-white font-medium cursor-pointer"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex">
        {/* SIDEBAR */}
        <div className="md:w-64 w-16 border-r min-h-[calc(100vh-65px)] bg-white border-gray-300 pt-4 flex flex-col">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name} 
              end={item.path === '/admin'}
              className={({isActive}) => `flex items-center py-3 px-4 gap-3 transition-all
                ${isActive
                  ? "border-r-4 md:border-r-[6px] bg-indigo-50 border-indigo-500 text-indigo-600"
                  : "hover:bg-gray-50 border-transparent text-gray-500"
                }`}
            >
              <img src={item.icon} alt="icon" className="w-6 h-6 grayscale opacity-70"/>
              <p className="md:block hidden font-medium text-sm">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 h-[calc(100vh-65px)] overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;