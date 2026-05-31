import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef, // ✅ ADDED
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
     RELOAD GUARDS (🔥 FIX DOUBLE CALLS)
  ========================================================= */
  const didInitAuth = useRef(false);
  const didInitData = useRef(false);

  /* =========================================================
     AUTH STATES
  ========================================================= */

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [loading, setLoading] = useState(true);

  /* =========================
     CATEGORY STATE
  ========================= */
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);

 /* =========================
     PRODUCT STATE
  ========================= */
  // const [products, setProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);

  /* =========================
     LOWSTOCK STATE
  ========================= */
const [lowStock, setLowStock] = useState([]);
  /* =========================================================
    INVENTORY STATES
  ========================================================= */

  const [inventoryLogs, setInventoryLogs] = useState([]);
/* =========================================================
    SALES STATES
  ========================================================= */
  const [sales, setSales] = useState([]);

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const [offlineSales, setOfflineSales] = useState(
    JSON.parse(localStorage.getItem("offlineSales")) || []
  );




  /* =========================================================
     AUTO AUTH HEADER
  ========================================================= */


/* =========================================================
     CLEAN AXIOS INTERCEPTOR (ONLY ONE)
  ========================================================= */

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem("token");

        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);


  /* =========================================================
     AUTO LOGIN ON REFRESH (FIXED DOUBLE CALL)
  ========================================================= */

  useEffect(() => {
    if (didInitAuth.current) return;
    didInitAuth.current = true;

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
    navigate("/admin-dashboard");
  } catch (error) {
    toast.error(error.response?.data?.message || "Register failed");
  }
};

  // LOGIN
const login = async (data) => {
  try {
    const res = await axios.post("/api/auth/login", data);
    const { token, user } = res.data;

    setToken(token);
    localStorage.setItem("token", token);
    setUser(user);

    const role = user?.role?.trim().toUpperCase();

    if (role === "ADMIN") {
      navigate("/admin-dashboard");
    } else if (role === "MANAGER") {
      navigate("/admin-dashboard");
    } else if (role === "CASHIER") {
      navigate("/cashier-dashboard");
    } else {
      navigate("/");
    }

    return user; // optional if needed elsewhere

  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  }
};


  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(""); // 🔥 FIX (was null → can break checks)
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
     USERS CRUD
  ========================================================= */
// const getUsers = async () => {
//   try {
//     const res = await axios.get("/api/users");

//     setUsers(res.data.users); // ✅ correct

//     return res.data.users;
//   } catch (error) {
//     toast.error(
//       error.response?.data?.message ||
//         "Failed to fetch users"
//     );

//     return [];
//   }
// };


const getUsers = async () => {
  try {
    const role = user?.role?.toUpperCase();
    const token = localStorage.getItem("token");

    console.log("🧠 getUsers CALLED");
    console.log("👤 ROLE:", role);
    console.log("🔑 TOKEN EXISTS:", !!token);

    const res = await axios.get("/api/users");

    console.log("📦 USERS RESPONSE RAW:", res.data);
    console.log("👥 USERS ARRAY:", res.data?.users);

    setUsers(res.data.users || []);

    return res.data.users || [];
  } catch (error) {
     console.log("❌ USERS ERROR FULL:", error);
  console.log("❌ STATUS:", error.response?.status);
  console.log("❌ DATA:", error.response?.data);

    toast.error(
      error.response?.data?.message ||
        "Failed to fetch users"
    );

    return [];
  }
};



// const getUsers = async () => {
//   try {
//     const res = await axios.get("/api/users");

//     const usersData = res.data?.users || [];

//     setUsers(usersData);

//     return usersData; // ✅ IMPORTANT
//   } catch (error) {
//     setUsers([]); // ✅ force consistency
//     return [];
//   }
// };


  const getUserById = async (id) => {
    try {
      const res = await axios.get(
        `/api/users/${id}`
      );

      return res.data.user;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch user"
      );
    }
  };

  const updateUser = async (id, data) => {
    try {
      const res = await axios.put(
        `/api/users/${id}`,
        data
      );

      toast.success(
        res.data.message || "User updated"
      );

      return res.data.user;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Update failed"
      );
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(
        `/api/users/${id}`
      );

      toast.success(
        res.data.message ||
          "User deactivated"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Delete failed"
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
     CREATE CATEGORY (WITH IMAGES)
  ========================================================= */
  const createCategory = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description || "");

      // multiple images
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append("images", data.images[i]);
        }
      }

      const res = await axios.post("/api/category/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Category created");

      setCategories((prev) => [res.data.category, ...prev]);

      return res.data.category;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create category"
      );
    }
  };


  /* =========================================================
     GET ALL CATEGORIES
  ========================================================= */
  const getCategories = async () => {
    try {
      setCatLoading(true);

      const res = await axios.get("/api/category/all");

      setCategories(res.data.categories);

      return res.data.categories;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load categories"
      );
      throw error; // ⭐ IMPORTANT FIX
      return [];
    } finally {
      setCatLoading(false);
    }
  };

 

  /* =========================================================
     UPDATE CATEGORY
  ========================================================= */
  const updateCategory = async (id, data) => {
    try {
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.is_active !== undefined)
        formData.append("is_active", data.is_active);

      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append("images", data.images[i]);
        }
      }

      const res = await axios.put(`/api/category/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Category updated");

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? res.data.category : cat))
      );

      return res.data.category;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );

      throw error; // ⭐ IMPORTANT FIX
    }
  };

  /* =========================================================
     DELETE CATEGORY
  ========================================================= */
  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`);

      toast.success(res.data.message || "Category deleted");

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  /* =========================================================
     AUTO LOAD CATEGORIES
  ========================================================= */
 useEffect(() => {
  if (localStorage.getItem("token")) {
    getCategories();
  }
}, []);

  
  /* =========================
➕ CREATE PRODUCT (WITH IMAGES)
========================= */
const createProduct = async (data) => {
  try {
    const formData = new FormData();

    /* =========================
       BASIC FIELDS (SAFE CAST)
    ========================= */

    formData.append("category_id", Number(data.category_id));
    formData.append("name", data.name?.trim());
    formData.append("barcode", data.barcode?.trim() || "");
    formData.append("price", Number(data.price));
    formData.append("cost_price", Number(data.cost_price || 0));
    formData.append("stock", Number(data.stock || 0));
    formData.append("description", data.description?.trim() || "");

    /* =========================
       OPTIONAL FIELD
    ========================= */

    if (data.expiration_date) {
      formData.append("expiration_date", data.expiration_date);
    }

    /* =========================
       IMAGES (MOBILE SAFE)
    ========================= */

    if (Array.isArray(data.images) && data.images.length > 0) {
      if (data.images.length > 4) {
        toast.error("Maximum 4 images allowed");
        return;
      }

      data.images.forEach((img) => {
        if (img) {
          formData.append("images", img);
        }
      });
    }

    /* =========================
       API CALL
    ========================= */

    const res = await axios.post("/api/products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(res.data.message || "Product created successfully");

    return res.data.product;

  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Failed to create product"
    );
  }
};


/* =========================
📦 GET PRODUCT BY ID
========================= */
const getProductById = async (id) => {
  try {
    const res = await axios.get(`/api/products/${id}`);

    // ✅ NEW: safety check
    if (!res?.data?.product) {
      toast.error("Product not found");
      return null;
    }

    const product = res.data.product;

    // ✅ NEW: normalize expiration date (safe for UI usage)
    return {
      ...product,
      expiration_date: product.expiration_date
        ? new Date(product.expiration_date)
        : null,
    };
  } catch (error) {
    console.error("GET_PRODUCT_BY_ID_ERROR:", error);

    toast.error(
      error.response?.data?.message || "Failed to fetch product"
    );

    return null;
  }
};

// GET PRODUCT BY BARCODE
const getProductByBarcode = async (barcode) => {
  try {
    const { data } = await axios.get(
      `/api/products/barcode/${barcode}`
    );

    return data.product; // ✅ IMPORTANT FIX
  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message || "Product not found"
    );

    return { success: false };
  }
};

/* =========================
📦 GET ALL PRODUCTS
========================= */

// const getProducts = async () => {
//   try {
//     const res = await axios.get("/api/products/all");

//     const products = res.data?.products;
    
    

//     if (!Array.isArray(products)) {
//       console.warn("getProducts: invalid response format", res.data);
//       return [];
//     }

//     const now = new Date();

//     // ✅ NEW: enrich products with expiration logic
//     const enrichedProducts = products.map((product) => {
//       const expDate = product.expiration_date
//         ? new Date(product.expiration_date)
//         : null;

//       let is_expired = false;
//       let is_expiring_soon = false;

//       if (expDate) {
//         is_expired = expDate < now;

//         const diffDays =
//           (expDate - now) / (1000 * 60 * 60 * 24);

//         is_expiring_soon = diffDays <= 7 && diffDays >= 0;
//       }

//       return {
//         ...product,
//         expiration_date: expDate,
//         is_expired,
//         is_expiring_soon,
//       };
//     });

//     return enrichedProducts;
//   } catch (error) {
//     console.error("GET_PRODUCTS_ERROR:", error);

//     toast.error(
//       error.response?.data?.message || "Failed to fetch products"
//     );

//     return [];
//   }
// };



const getProducts = async () => {
  console.log("🌍 API CALL: getProducts");
  try {
    setProdLoading(true);

    const res = await axios.get("/api/products/all");

    const products = res.data?.products;

    if (!Array.isArray(products)) return [];

    const now = new Date();

    const enrichedProducts = products.map((product) => {
      const expDate = product.expiration_date
        ? new Date(product.expiration_date)
        : null;

      let is_expired = false;
      let is_expiring_soon = false;

      if (expDate) {
        is_expired = expDate < now;

        const diffDays =
          (expDate - now) / (1000 * 60 * 60 * 24);

        is_expiring_soon = diffDays <= 7 && diffDays >= 0;
      }

      return {
        ...product,
        expiration_date: expDate,
        is_expired,
        is_expiring_soon,
      };
    });

    setProducts(enrichedProducts); // ✅ STORE HERE

    return enrichedProducts;

  } catch (error) {
    toast.error("Failed to fetch products");
    return [];
  } finally {
    setProdLoading(false);
  }
};


/* =========================
✏️ UPDATE PRODUCT
========================= */
const updateProduct = async (id, data) => {
  try {
    const formData = new FormData();

    /* =========================
       SAFE FIELD APPENDING
    ========================= */

    if (data.category_id !== undefined && data.category_id !== null) {
      formData.append("category_id", Number(data.category_id));
    }

    if (data.name) {
      formData.append("name", data.name.trim());
    }

    if (data.barcode) {
      formData.append("barcode", data.barcode.trim());
    }

    if (data.price !== undefined && data.price !== null) {
      formData.append("price", Number(data.price));
    }

    if (data.cost_price !== undefined && data.cost_price !== null) {
      formData.append("cost_price", Number(data.cost_price));
    }

    if (data.stock !== undefined) {
      formData.append("stock", Number(data.stock));
    }

    if (data.description) {
      formData.append("description", data.description.trim());
    }

    /* =========================
       OPTIONAL FIELD
    ========================= */

    if (data.expiration_date) {
      formData.append("expiration_date", data.expiration_date);
    }

    /* =========================
       IMAGES (SAFE)
    ========================= */

    if (Array.isArray(data.images) && data.images.length > 0) {
      if (data.images.length > 4) {
        toast.error("Maximum 4 images allowed");
        return;
      }

      data.images.forEach((img) => {
        if (img) {
          formData.append("images", img);
        }
      });
    }

    /* =========================
       API CALL
    ========================= */

    const res = await axios.put(`/api/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(res.data.message || "Product updated successfully");

    return res.data.product;

  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Update failed"
    );
  }
};

/* =========================
🗑️ DELETE PRODUCT (SOFT DELETE)
========================= */ 

const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(`/api/products/${id}`);

    toast.success(res.data.message || "Product deleted");

    // ✅ NEW: optional debug log for admin tracking
    console.log("PRODUCT_DELETED:", id);

    return {
      success: true,
      id,
    };
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR:", error);

    toast.error(
      error.response?.data?.message || "Delete failed"
    );

    return {
      success: false,
      id,
    };
  }
};

/* =========================================================
   ADD STOCK
========================================================= */
  const addStock = async (data) => {
    try {
      const res = await axios.post("/api/inventory/add-stock", data);

      toast.success("Stock added successfully");

      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Add stock failed");
    }
  };


  /* =========================================================
   REMOVE STOCK
========================================================= */
  const removeStock = async (data) => {
    try {
      const res = await axios.post("/api/inventory/remove-stock", data);

      toast.success("Stock removed successfully");

      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Remove stock failed");
    }
  };


  /* =========================================================
   ADJUST STOCK
========================================================= */
  const adjustStock = async (data) => {
    try {
      const res = await axios.put("/api/inventory/adjust-stock", data);

      toast.success("Stock adjusted successfully");

      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Adjust stock failed");
    }
  };


  /* =========================================================
   GET INVENTORY LOGS
========================================================= */
  const getInventoryLogs = async () => {
    try {
      const res = await axios.get("/api/inventory/logs");

      setInventoryLogs(res.data.logs);

      return res.data.logs;
    } catch (error) {
      console.log(error);
      toast.error("Failed to load inventory logs");
    }
  };

  /* =========================================================
   GET PRODUCT HISTORY
========================================================= */
  const getProductHistory = async (product_id) => {
    try {
      const res = await axios.get(`/api/inventory/product/${product_id}`);

      return res.data.logs;
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product history");
    }
  };

/* =========================
   LOW STOCK
========================= */
const getLowStockProducts = async () => {
  try {
    const res = await axios.get("/api/inventory/low-stock");

    setLowStock(res.data.products); // ✅ correct

    return res.data.products;
  } catch (error) {
    toast.error("Failed to load low stock");
    return [];
  }
};


// const getLowStockProducts = async () => {
//   try {
//     const res = await axios.get("/api/inventory/low-stock");

//     const data = res.data?.products || [];

//     setLowStock(data);

//     return data; // ✅ IMPORTANT
//   } catch (error) {
//     setLowStock([]); // ✅ force consistency
//     return [];
//   }
// };


/* =========================
   ANALYTICS
========================= */
const getSalesAnalytics = async () => {
  try {
    const res = await axios.get("/api/inventory/analytics");
    return res.data;
  } catch (error) {
    toast.error("Failed to load analytics");
  }
};

/* =========================
   REORDER
========================= */
const getReorderSuggestions = async () => {
  try {
    const res = await axios.get("/api/inventory/reorder");
    return res.data.suggestions;
  } catch (error) {
    toast.error("Failed to load reorder data");
  }
};

// CREATE SALE (CASHIER CHECKOUT)
 /* =========================
     CREATE SALE
  ========================= */
const createSale = async (data) => {
  try {
    console.log("🔥 CREATE SALE INPUT DATA:", data);
    console.log("🧾 ITEMS BEFORE SEND:", data.items);

    const res = await axios.post("/api/sales/create", {
      ...data,
      items: data.items, // 🔥 MUST exist
    });

    console.log("✅ SALE CREATED RESPONSE:", res.data);

    setSales((prev) => [res.data.sale, ...prev]);

    return res.data;
  } catch (error) {
    console.log("❌ CREATE SALE ERROR:", error.response?.data || error.message);
  }
};


    /* =========================
     GET ALL SALES
  ========================= */
  const getAllSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/sales/all");
      setSales(res.data.sales);
    
      return res.data.sales;
    } catch (error) {
      console.log("GET SALES ERROR:", error.message);
    } finally {
      setLoading(false);
    }
  };


 /* =========================
     FILTER SALES
  ========================= */
  const filterSales = async (filters) => {
    try {
      const res = await axios.get("/api/sales/filter", {
        params: filters,
      });
      setSales(res.data.sales);
      return res.data.sales;
    } catch (error) {
      console.log("FILTER SALES ERROR:", error.message);
    }
  };

 /* =========================
     GET SALE BY ID
  ========================= */
  const getSaleById = async (id) => {
    try {
      const res = await axios.get(`/api/sales/${id}`);
      return res.data.sale;
    } catch (error) {
      console.log("GET SALE ERROR:", error.message);
    }
  };


    /* =========================
     UPDATE SALE STATUS
  ========================= */
  const updateSaleStatus = async (id, status) => {
    try {
      const res = await axios.put(`/api/sales/${id}/status`, {
        status,
      });

      setSales((prev) =>
        prev.map((s) => (s.id === id ? res.data.sale : s))
      );

      return res.data;
    } catch (error) {
      console.log("UPDATE STATUS ERROR:", error.message);
    }
  };

    /* =========================
     DELETE SALE
  ========================= */
  const deleteSale = async (id) => {
    try {
      await axios.delete(`/api/sales/${id}`);
      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.log("DELETE SALE ERROR:", error.message);
    }
  };

// CREATE RETURN
const createReturn = async (data) => {
  try {
    const res = await axios.post("/api/returns/create", data);

    toast.success(res.data.message || "Return processed");

    return res.data.returnItem;
  } catch (error) {
    toast.error(error.response?.data?.message || "Return failed");
  }
};


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
          "/api/sales/create",
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
     REPORTS
  ========================================================= */

const downloadReport = async () => {
  try {
    /* =========================
       REQUEST PDF FROM API
    ========================= */

    const response = await axios.get(
      "/api/reports/daily-report",
      {
        responseType: "blob",
      }
    );

    /* =========================
       CREATE BLOB URL
    ========================= */

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const fileURL = window.URL.createObjectURL(blob);

    /* =========================
       DOWNLOAD FILE
    ========================= */

    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "daily-report.pdf");

    document.body.appendChild(link);
    link.click();

    /* =========================
       CLEANUP
    ========================= */

    link.remove();
    window.URL.revokeObjectURL(fileURL);

  } catch (error) {
    console.error("❌ Download report failed:", error);

    // Optional: better UX
    if (error.response) {
      console.error("Server error:", error.response.data);
    }
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
     AUTO DATA LOADING
  ========================================================= */
useEffect(() => {
  if (!token || !user?.role) return;

  const loadInitialData = async () => {
    const role = user.role.toUpperCase();

    // Available for all authenticated users
    await getProducts();

    // Admin / Manager only
    if (role === "ADMIN" || role === "MANAGER") {
      const lowStockData = await getLowStockProducts();
      const usersData = await getUsers();

      console.log("FINAL LOW STOCK:", lowStockData);
      console.log("FINAL USERS:", usersData);

      await getAllSales();
    }
  };

  loadInitialData();
}, [token, user?.role]);

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

   // CRUD USERS
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    users,

    /* categories */
    categories,
    catLoading,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,

     // PRODUCTS
      getProducts,
      getProductById,
      createProduct,
      updateProduct,
      deleteProduct,
      getProductByBarcode,
      products,
      setProducts,
      prodLoading,

       /* SALES FUNCTIONS */
        sales,
        createSale,
        getAllSales,
        filterSales,
        getSaleById,
        updateSaleStatus,
        deleteSale,

      /* INVENTORY */
        addStock,
        removeStock,
        adjustStock,
        getInventoryLogs,
        inventoryLogs,
        getProductHistory,
        getLowStockProducts,
        getSalesAnalytics,
        getReorderSuggestions,
        lowStock,
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

    // report
    downloadReport
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