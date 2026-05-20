

import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import 'bootstrap-icons/font/bootstrap-icons.css';

// Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Loading from './components/Loading';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';

// Admin Components & Pages
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AddProduct from './pages/admin/AddProduct';
import ProductList from './pages/admin/ProductList';
import Orders from './pages/admin/Orders';
import AddCategory from './pages/admin/AddCategory';
import ListCategory from './pages/admin/ListCategory';
import ContactList from './pages/admin/ContactList';

// Context
import { useAppContext } from './context/AppContext';

const App = () => {
  const { pathname } = useLocation();
  const isSellerPath = pathname.includes("admin");
  const { showUserLogin, setShowUserLogin, isSeller } = useAppContext();

  // Hide login modal whenever the URL changes
  useEffect(() => {
    setShowUserLogin(false);
  }, [pathname, setShowUserLogin]);

  // --- CRITICAL: AUTH LOADING CHECK ---
  // If isSeller is null, it means we are still waiting for the API response (is-auth).
  // This prevents the "Black Screen" or "404" during a page refresh.
  if (isSellerPath && isSeller === null) {
    return <Loading />;
  }

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {/* Show Navbar only if NOT in Admin routes */}
      {!isSellerPath && <Navbar />}
      
      {/* Shared Login Modal */}
      {showUserLogin && <Login />}

      {/* Global Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          success: { style: { background: "#4caf50", color: "#fff" } },
          error: { style: { background: "#f44336", color: "#fff" } },
        }}
      />

      <div className={isSellerPath ? "mx-0 px-0" : "mx-0 px-0"}>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Loading />} />

          {/* Admin Protected Routes */}
          {/* If not a seller, show AdminLogin. If seller, show AdminLayout (which contains Sidebar/Navbar) */}
          <Route path='/admin' element={isSeller ? <AdminLayout /> : <AdminLogin />}>
            {/* These routes will render inside the <Outlet /> of AdminLayout */}
            <Route index element={<AddProduct />} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
            <Route path='add-category' element={<AddCategory />} />
            <Route path='category-list' element={<ListCategory />} />
            <Route path='all-contact' element={<ContactList />} />
          </Route>

          {/* Catch-all: Redirect unknown routes to Home */}
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Show Footer only if NOT in Admin routes */}
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
