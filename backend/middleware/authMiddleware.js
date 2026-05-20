import jwt from "jsonwebtoken"; // <--- YOU ARE MISSING THIS IMPORT
import User from "../models/User.js"


export const protect = async (req, res, next) => {
  try {
    // 1. Get header
    const authHeader = req.headers.authorization;
    
    // 2. Debugging
    console.log("Full Headers:", req.headers); 
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Protect Failed: Header missing or wrong format");
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Protect Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};