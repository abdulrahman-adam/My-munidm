import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

/* =========================================================
   AXIOS CONFIG
========================================================= */

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

/* =========================================================
   CONTEXT
========================================================= */

export const AppContext = createContext();

/* =========================================================
   PROVIDER
========================================================= */

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const currency = import.meta.env.VITE_CURRENCY || "€";

  /* =========================================================
     AUTH STATES
  ========================================================= */

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [loading, setLoading] = useState(true);

  /* =========================================================
     POS STATES
  ========================================================= */

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const [offlineSales, setOfflineSales] = useState(
    JSON.parse(localStorage.getItem("offlineSales")) || []
  );

  /* =========================================================
     AUTO AUTH HEADER
  ========================================================= */

  // Replace your existing interceptor with this:
axios.interceptors.request.use(
  (config) => {
    const currentToken = localStorage.getItem("token"); // Always fetch fresh from storage
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

 /* =========================================================
   AUTO LOGIN ON REFRESH
========================================================= */

useEffect(() => {
  const loadUser = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setUser(res.data.user);
    } catch (error) {
      console.log("Auth load failed:", error);

      // invalid or expired token → clean logout
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);

  /* =========================================================
     SAVE CART
  ========================================================= */

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  /* =========================================================
     SAVE OFFLINE SALES
  ========================================================= */

  useEffect(() => {

    localStorage.setItem(
      "offlineSales",
      JSON.stringify(offlineSales)
    );

  }, [offlineSales]);

  /* =========================================================
     AUTH FUNCTIONS
  ========================================================= */

  // REGISTER
const register = async (data) => {
  const token = localStorage.getItem("token");

  // This check prevents sending "Bearer null"
  if (!token || token === "null" || token === undefined) {
    toast.error("You are not logged in! Please log in as Admin first.");
    return;
  }

  try {
    await axios.post("/api/users", data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("User created successfully!");
    navigate("/users");
  } catch (error) {
    toast.error(error.response?.data?.message || "Register failed");
  }
};

  // LOGIN
const login = async (data) => {
  try {
    const res = await axios.post("/api/auth/login", data);
    const { token, user } = res.data;

    // 1. Set state
    setToken(token);
    localStorage.setItem("token", token);
    setUser(user);

    // 2. Redirect based on role
    // Using trim().toUpperCase() ensures we match your "ADMIN" string perfectly
    if (user.role && user.role.trim().toUpperCase() === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  }
};

  // LOGOUT
  const logout = () => {

    setUser(null);

    setToken("");

    localStorage.removeItem("token");

    toast.success("Logged out");

    navigate("/");
  };

  /* =========================================================
     OTP AUTH
  ========================================================= */

  const sendOtp = async (email) => {

    try {

      const res = await axios.post(
        "/api/auth/send-otp",
        { email }
      );

      toast.success(res.data.message);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "OTP failed"
      );
    }
  };

  const verifyOtp = async (data) => {

    try {

      const res = await axios.post(
        "/api/auth/verify-otp",
        data
      );

      const authToken = res.data.token;

      setToken(authToken);

      localStorage.setItem(
        "token",
        authToken
      );

      setUser(res.data.user);

      toast.success(res.data.message);

      navigate("/");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Invalid OTP"
      );
    }
  };

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  const forgotPassword = async (email) => {

    try {

      const res = await axios.post(
        "/api/auth/forgot-password",
        { email }
      );

      toast.success(res.data.message);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed"
      );
    }
  };

  const verifyResetOtp = async (data) => {

    try {

      const res = await axios.post(
        "/api/auth/verify-reset-otp",
        data
      );

      toast.success(res.data.message);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Invalid OTP"
      );
    }
  };

  const resetPassword = async (data) => {

    try {

      const res = await axios.post(
        "/api/auth/reset-password",
        data
      );

      toast.success(res.data.message);

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Reset failed"
      );
    }
  };

  /* =========================================================
     ROLE PROTECTION
  ========================================================= */

const hasRole = (...roles) => {
  if (!user || !user.role) return false;
  // This cleans the role and checks if it exists in the provided list
  return roles.some(role => role.trim().toUpperCase() === user.role.trim().toUpperCase());
};

  const isAdmin = hasRole("ADMIN");

  const isManager = hasRole("MANAGER");

  const isCashier = hasRole("CASHIER");

  /* =========================================================
     POS CART SYSTEM
  ========================================================= */

  const addToCart = (product) => {

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {

      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      setCart(updatedCart);

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }

    toast.success("Product added");
  };

  const removeFromCart = (productId) => {

    const updatedCart = cart
      .map((item) => {

        if (item.id === productId) {

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {

    return cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

  }, [cart]);

  /* =========================================================
     OFFLINE POS SALES
  ========================================================= */

  const saveOfflineSale = (saleData) => {

    setOfflineSales((prev) => [
      ...prev,
      {
        ...saleData,
        offline: true,
        createdAt: new Date(),
      },
    ]);

    toast.success("Sale saved offline");
  };

  const syncOfflineSales = async () => {

    if (!navigator.onLine) {
      return;
    }

    try {

      for (const sale of offlineSales) {

        await axios.post(
          "/api/sales",
          sale
        );
      }

      setOfflineSales([]);

      localStorage.removeItem("offlineSales");

      toast.success(
        "Offline sales synchronized"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Offline sync failed"
      );
    }
  };

  /* =========================================================
     AUTO SYNC WHEN INTERNET RETURNS
  ========================================================= */

  useEffect(() => {

    window.addEventListener(
      "online",
      syncOfflineSales
    );

    return () => {

      window.removeEventListener(
        "online",
        syncOfflineSales
      );
    };

  }, [offlineSales]);

  /* =========================================================
     CONTEXT VALUE
  ========================================================= */

  const value = {
    currency,
    navigate,

    // states
    user,
    token,
    loading,

    // roles
    isAdmin,
    isManager,
    isCashier,
    hasRole,

    // auth
    register,
    login,
    logout,

    sendOtp,
    verifyOtp,

    forgotPassword,
    verifyResetOtp,
    resetPassword,

    // POS
    cart,
    setCart,

    addToCart,
    removeFromCart,
    clearCart,

    cartTotal,

    // offline POS
    offlineSales,
    saveOfflineSale,
    syncOfflineSales,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/* =========================================================
   CUSTOM HOOK
========================================================= */

export const useAppContext = () => {
  return useContext(AppContext);
};