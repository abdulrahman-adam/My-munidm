



import { useContext, useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  // --- State ---
  // const [user, setUser] = useState(null); 
  // To this:
  const [user, setUser] = useState(undefined);
  const [adminData, setAdminData] = useState(null); 
  const [isSeller, setIsSeller] = useState(null);


  const [showUserLogin, setShowUserLogin] = useState(false);
  const [contacts, setContacts] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");

  const [partenaires, setPartenaires] = useState([]);

  // --- Opening Hours State ---
  const [shopStatus, setShopStatus] = useState({ 
    status: "CHARGEMENT...", 
    schedule: [], 
    today: null,
    message: ""
  });

  // --- AUTH & PROFILES ---
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchSellerProfile = async () => {
    try {
      const { data } = await axios.get("/api/seller/profile");
      if (data.success) setAdminData(data.seller);
    } catch (error) {
      console.error("Seller profile error");
    }
  };

const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        
        // --- Your Cart Logic ---
        let rawCart = data.user.cartItems;
        if (typeof rawCart === "string") {
          try {
            while (typeof rawCart === "string") { rawCart = JSON.parse(rawCart); }
            setCartItems(rawCart || {});
          } catch { setCartItems({}); }
        } else {
          setCartItems(rawCart || {});
        }
      } else {
        // If server responds but success is false
        setUser(null); 
      }
    } catch (error) {
      // If unauthorized (401) or network error
      setUser(null); 
    }
};

  // --- LIFECYCLE ---
  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchSeller();
    
    };
    init();
  }, []);

  useEffect(() => {
    if (isSeller) {
      fetchSellerProfile();
      
    } 
  }, [isSeller, user]);

  
  const getAllContacts = async () => {
    if (!isSeller) return;
    try {
      const { data } = await axios.get(`/api/contact/all`);
      if (data.success) setContacts(data.data || []);
    } catch (error) {
      console.error("Contacts error:", error.message);
    }
  };

    const deleteContact = async (id) => {
    try {
      const { data } = await axios.delete(`/api/contact/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        getAllContacts();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  // --- PARTENAIRE LOGIC ---

  // Function for companies to apply to be a partner
  const createPartenaire = async (formData) => {
    try {
      // formData should contain: companyName, siret, profession, contactEmail, description
      const { data } = await axios.post(`/api/partenaire/apply`, formData);
      
      if (data.success) {
        toast.success(data.message);
        return true; // Return true so the form component can clear its inputs
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error("Application error:", error.message);
      toast.error(error.response?.data?.message || "Failed to submit application");
      return false;
    }
  };

  const getAllPartenaires = async () => {
    if (!isSeller) return;
    try {
      const { data } = await axios.get(`/api/partenaire/all`);
      if (data.success) setPartenaires(data.data || []);
    } catch (error) {
      console.error("Partners error:", error.message);
    }
  };


  const updatePartenaireStatus = async (id, newStatus) => {
    try {
      const { data } = await axios.put(`/api/partenaire/update-status/${id}`, { status: newStatus });
      if (data.success) {
        toast.success(data.message);
        getAllPartenaires();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const deletePartenaire = async (id) => {
    try {
      const { data } = await axios.delete(`/api/partenaire/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        getAllPartenaires();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  // Automatically fetch data when the seller is authenticated
  useEffect(() => {
    if (isSeller) {
      getAllContacts();
      getAllPartenaires();
    }
  }, [isSeller]);

// 2. Add this Helper Function inside AppContextProvider
const calculateStatusLocally = (schedule) => {
    // Force "Europe/Paris" time calculation
    const now = new Date();
    const parisTimeStr = now.toLocaleString("en-GB", { timeZone: "Europe/Paris" }); 
    // Format: "DD/MM/YYYY, HH:mm:ss"
    
    const [datePart, timePart] = parisTimeStr.split(', ');
    const [hours, minutes] = timePart.split(':').map(Number);
    const currentTimeMinutes = hours * 60 + minutes;

    // Get the current day in French to match your database (Lundi, Mardi...)
    const dayName = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', timeZone: 'Europe/Paris' }).format(now);
    const currentDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    const todayData = schedule.find(s => s.day_of_week === currentDay);

    if (!todayData || todayData.is_closed) {
        return { status: "FERMÉ", today: todayData, message: "Aujourd'hui est un jour de fermeture" };
    }

    const [openH, openM] = todayData.open_time.split(':').map(Number);
    const [closeH, closeM] = todayData.close_time.split(':').map(Number);
    
    const openTimeMinutes = openH * 60 + openM;
    const closeTimeMinutes = closeH * 60 + closeM;

    // Logic for Status
    if (currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes) {
        // Check if closing in less than 30 minutes
        if (closeTimeMinutes - currentTimeMinutes <= 30) {
            return { status: "FERMETURE PROCHE", today: todayData, message: `Ferme à ${todayData.close_time.slice(0,5)}` };
        }
        return { status: "OUVERT", today: todayData, message: "" };
    } else if (currentTimeMinutes < openTimeMinutes) {
        return { status: "FERMÉ", today: todayData, message: `Ouvre à ${todayData.open_time.slice(0,5).replace(':', 'h')}` };
    } else {
        return { status: "FERMÉ", today: todayData, message: "Fermé pour aujourd'hui" };
    }
};

// 3. Update the fetchShopStatus function
const fetchShopStatus = async () => {
    try {
        const { data } = await axios.get("/api/hours/status");
        if (data.schedule) {
            // Recalculate status based on Paris Timezone, not Server Timezone
            const localStatus = calculateStatusLocally(data.schedule);
            setShopStatus({
                ...localStatus,
                schedule: data.schedule
            });
        }
    } catch (error) {
        console.error("Error fetching shop status:", error);
    }
};

  // --- Update Opening Hours (Admin Only) ---
  const updateShopHours = async (day, updatedData) => {
    try {
      const { data } = await axios.put(`/api/hours/update/${day}`, updatedData);
      if (data.success || data.message) {
        toast.success(`Horaires de ${day} mis à jour !`);
        fetchShopStatus(); // Refresh data
        return true;
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      return false;
    }
  };

  // --- Add to Lifecycle ---
  useEffect(() => {
    fetchShopStatus();
    // Optional: Refresh status every 5 minutes to keep "Closing Soon" accurate
    const interval = setInterval(fetchShopStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);



  const value = {
    currency, navigate, user, setUser, isSeller, setIsSeller, adminData, setAdminData,contacts, getAllContacts,
  deleteContact,
    showUserLogin, setShowUserLogin, fetchUser,
     axios, searchQuery, setSearchQuery, shopStatus, 
    fetchShopStatus, 
    updateShopHours,
    partenaires,
    createPartenaire,
    setPartenaires,
    getAllPartenaires,
    updatePartenaireStatus,
    deletePartenaire,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);