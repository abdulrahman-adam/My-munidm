


import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt"; // Required to check the hashed password

// 1. Seller/Admin Login Function
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND: Look for the user in the DB
    const user = await User.findOne({ where: { email } });

    // CHECK: Does user exist AND is he an ADMIN?
    if (!user || user.role !== 'ADMIN') {
      return res.json({ success: false, message: "Accès refusé: Identifiants non reconnus." });
    }

    // VERIFY: Check if the password is correct (assuming you use bcrypt for registration)
    // If you are using plain text (not recommended), use: if (password === user.password)
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Generate token using the database ID
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Send to cookie
      res.cookie('sellerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, message: "Connecté avec succès" });
    } else {
      return res.json({ success: false, message: "Mot de passe incorrect" });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 2. Check Seller Auth
export const isSellerAuth = async (req, res) => {
  try {
    // This function is simple because the 'authSeller' middleware 
    // already did the heavy lifting before reaching here.
    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// 3. Get Seller Profile (Dynamic from Database)
export const getSellerProfile = async (req, res) => {
  try {
    // We use req.sellerId which was set in the authSeller middleware
    const adminUser = await User.findByPk(req.sellerId, {
      attributes: ['name', 'email', 'role']
    });

    if (!adminUser) {
      return res.json({ success: false, message: "Utilisateur non trouvé" });
    }

    return res.json({
      success: true,
      seller: {
        name: adminUser.name,
        email: adminUser.email
      }
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 4. Seller Logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie('sellerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.json({ success: true, message: "Déconnecté" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};