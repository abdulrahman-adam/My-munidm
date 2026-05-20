import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { useAppContext } from "./context/AppContext";

// Components
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Loading from "./components/loading/Loading";
import Login from "./components/login/Login";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";

// Pages
import Home from "./pages/home/Home";
import Contact from "./pages/contact/Contact";
import ContactList from "./pages/admin/ContactList";
import { Toaster } from "react-hot-toast";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy";
import About from "./pages/about/About";
import Terms from "./pages/terms/Terms";
import FAQ from "./pages/faq/FAQ";
import Shipping from "./pages/Shipping/Shipping";
import Promotions from "./pages/promotions/Promotions";
import AdminHours from "./pages/admin/AdminHours";
import Partenaire from "./pages/partenaire/Partenaire";
import PartenaireList from "./pages/admin/PartenaireList";
import Services from "./pages/services/Services";
import CookieConsent from "./components/consent/CookieConsent ";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";


const App = () => {
  const { pathname } = useLocation();
  const isSellerPath = pathname.includes("admin");
  const { showUserLogin, setShowUserLogin, isSeller, user } = useAppContext();

  useEffect(() => {
    setShowUserLogin(false);
  }, [pathname, setShowUserLogin]);

  // 1. Wait for Auth check to complete
  // This prevents the <Navigate to="/" /> from running before the server answers
  if (user === undefined) {
    return <Loading />;
  }

  // 2. Existing Seller check
  if (isSellerPath && isSeller === null) return <Loading />;


  
  return (
    // <div className="text-default min-h-screen text-gray-700 bg-white">
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-[#020617] text-gray-700 dark:text-gray-200">
      {!isSellerPath && <Navbar />}
      
      {showUserLogin && <Login />}

   {/* Standard Toaster with Z-Index Fix */}
<div style={{ zIndex: 99999, position: 'relative' }}>
  <Toaster 
    position="top-center"
    reverseOrder={false}
    gutter={8}
    containerStyle={{
      top: 40, // Adds a little extra space from the very top
    }}
    toastOptions={{
      duration: 3000,
      style: {
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      success: {
        style: {
          background: '#10b981',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      },
      error: {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      },
    }}
  />
</div>

        <CookieConsent />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partenaire" element={<Partenaire />} />
        
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/sales" element={<Promotions />} />
        <Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>
        {/* Redirection si la page n'existe pas */}
        <Route path="*" element={<h1 className="text-center py-20">404 - Page non trouvée</h1>} />
       
        

      
        <Route path="/loader" element={<Loading />} />


        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={isSeller ? <AdminLayout /> : <AdminLogin />}
        >
  
          <Route path="all-contact" element={<ContactList />} />
          <Route path="all-partenaire" element={<PartenaireList />} />
          <Route path="hours" element={<AdminHours />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;

// Breadcrumb Navigation
// Recursive || Recursive Filter
// getAllDescendantIds

// splat (wildcard)
// fix a mistake" (Soft Reset)
// git reset --soft HEAD~1