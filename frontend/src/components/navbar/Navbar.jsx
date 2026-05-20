import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import ThemeToggle from "../themeToggle/ThemeToggle";
import ShortContact from "../shortContact/ShortContact";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const {
    axios,
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
   
  } = useAppContext();

  useEffect(() => {
    setShowUserLogin(false);
    setOpen(false);
  }, [location.pathname, setShowUserLogin]);

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* --- ELITE NAV BAR --- */}
      <nav className="flex items-center justify-between px-4 md:px-10 lg:px-16 py-4 h-[65px] border-b border-white/10 sticky top-0 z-[60] bg-white/80 backdrop-blur-xl transition-all duration-500 shadow-sm">
        
        {/* --- LOGO --- */}
        <NavLink to="/" className="z-50 transform hover:scale-110 active:scale-95 transition-all duration-300">
          <img
            src={`${window.location.origin}/logo.png`}
            alt="logo"
            className="object-cover filter drop-shadow-sm"
            style={{ height: "60px", width: "230px"}}
          />
        </NavLink>

        {/* --- DESKTOP NAVIGATION --- */}
        <ul className="hidden sm:flex items-center gap-8 font-bold text-gray-600">
          {[
            { name: "Accueil", path: "/" },
            { name: "Services", path: "/services" },
            { name: "Partenaire", path: "/partenaire" },
            { name: "Contact", path: "/contact" }
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative py-1 transition-all duration-300 hover:text-indigo-600 ${
                  isActive ? "text-indigo-600" : ""
                } group`
              }
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-500 group-hover:w-full"></span>
            </NavLink>
          ))}
        </ul>


       

        {/* --- ACTIONS --- */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-gray-100/50 px-4 py-2 rounded-2xl border border-transparent focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-indigo-100 transition-all duration-500 group">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery || ""}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== "/products") navigate("/products");
              }}
              className="bg-transparent outline-none text-sm w-32 xl:w-48 placeholder:text-gray-400"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
          </div>

                &nbsp;&nbsp;<ShortContact />

          {/* Profile & Login Logic: THE MIRACLE CLICK */}
          <div className="flex items-center">
            {!user ? (
              /* If no user, clicking this icon opens the login popup directly */
              <div 
                onClick={() => setShowUserLogin(true)}
                className="cursor-pointer group p-2 hover:bg-indigo-50 rounded-full transition-all duration-300 active:scale-75 flex items-center justify-center"
                title="Connexion"
              >
                 <i className="bi bi-person-add text-2xl text-gray-700 opacity-80 group-hover:text-indigo-600 transition-all"></i>
              </div>
            ) : (
              /* If user exists, show profile image with dropdown menu */
              <div className="relative group">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-50 p-0.5 cursor-pointer group-hover:border-indigo-500 group-hover:shadow-lg transition-all duration-500">
                    <img src={assets.profile_icon} alt="profile" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="invisible group-hover:visible absolute right-0 top-full pt-3 w-48 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-[70]">
                  <ul className="bg-white/90 backdrop-blur-lg shadow-2xl border border-gray-100 rounded-2xl py-3 text-sm overflow-hidden">
  
                    <li onClick={logout} className="px-5 py-2.5 hover:bg-red-50 text-red-500 cursor-pointer flex items-center gap-3 transition-colors border-t border-gray-50 mt-1">
                      <i className="bi bi-box-arrow-right"></i> Déconnexion
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Mobile Menu */}
          <button 
            className="sm:hidden p-2 rounded-xl bg-gray-50 hover:bg-indigo-50 text-indigo-600 transition-all active:scale-90" 
            onClick={() => setOpen(true)}
          >
            <i className="bi bi-grid-fill text-xl"></i>
          </button>
        </div>
      </nav>

      {/* --- MIRACLE MOBILE SIDEBAR --- */}
      <div className={`fixed inset-0 z-[100] transition-all duration-700 ${open ? "visible" : "invisible"}`}>
        <div 
          className={`absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`} 
          onClick={() => setOpen(false)}
        ></div>
        
        <div className={`absolute top-0 right-0 bottom-0 bg-white w-[85%] max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.2)] transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <img src={`${window.location.origin}/logo.png`} alt="logo" className="w-14" />
            <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:rotate-90 transition-all duration-500">
              <i className="bi bi-x-lg text-lg"></i>
            </button>
          </div>

          <div className="flex flex-col p-8 gap-8 overflow-y-auto">
            {[
                { to: "/", icon: "house-door-fill", label: "Accueil" },
                { to: "/services", icon: "box-fill", label: "Services" },
                { to: "/partenaire", icon: "people-fill", label: "Partenaire" },
                { to: "/contact", icon: "envelope-paper-fill", label: "Contact" }
            ].map((link, i) => (
                <NavLink 
                    key={i} 
                    to={link.to} 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-5 text-2xl font-black text-gray-800 hover:text-indigo-600 transition-all animate-miracleIn"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                        <i className={`bi bi-${link.icon}`}></i>
                    </div>
                    {link.label}
                </NavLink>
            ))}

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

            <div className="mt-auto pt-10 flex flex-col gap-4 animate-miracleIn" style={{ animationDelay: '450ms' }}>
              {!user ? (
                <button
                  onClick={() => { setShowUserLogin(true); setOpen(false); }}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 active:scale-95 transition-all"
                >
                  Connexion / S'inscrire
                </button>
              ) : (
                <>
                 
                  <button onClick={logout} className="flex items-center gap-4 p-5 rounded-2xl bg-red-50 text-red-500 font-black transition-all active:bg-red-500 active:text-white">
                    <i className="bi bi-power"></i> Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes miracleIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-miracleIn {
          animation: miracleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default Navbar;