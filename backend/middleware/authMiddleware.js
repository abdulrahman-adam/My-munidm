import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Vérifie :
// token JWT
// user existe
// user actif


export const protect = async (req, res, next) => {

  try {

    let token;

    // Bearer TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // check active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "User disabled",
      });
    }

    // attach user
    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};