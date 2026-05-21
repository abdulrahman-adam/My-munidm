import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/sendEmail.js";



export const register = async (req, res) => {

  try {

    const { name, email, phone, password, role } = req.body;

    // check if user exists
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      phone,
      password_hash: hashedPassword,
      role: role || "CASHIER",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const login = async (req, res) => {
  console.log("DEBUG: RECEIVED REQ.BODY:", req.body);

  try {

    const { email, password } = req.body;

    // find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // check if active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "User disabled",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET CURRENT USER (/me)
   👉 THIS FIXES YOUR REFRESH PROBLEM
========================= */
export const me = async (req, res) => {
  res.json({
    user: req.user,
  });
};


export const sendOtp = async (req, res) => {

  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp_code = otp;
  user.otp_expire = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  console.log("OTP:", otp); // replace with email/SMS service

  return res.json({
    message: "OTP sent",
  });
};


export const verifyOtp = async (req, res) => {

  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (user.otp_code !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  if (new Date() > user.otp_expire) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }

  user.otp_code = null;
  user.otp_expire = null;
  await user.save();

  const token = generateToken(user);

  return res.json({
    message: "Login success",
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  });
};



// 🔐 Step 1: Send OTP for password reset


// 🔐 Forgot Password (OTP Email)
export const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    // 1. find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "User is disabled",
      });
    }

    // 2. generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 3. save OTP
    user.otp_code = otp;
    user.otp_expire = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await user.save();

    // 4. send email
    await sendEmail(
      user.email,
      "POS Password Reset OTP",
      `Your OTP code is: ${otp}. It expires in 5 minutes.`
    );

    return res.json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyResetOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (new Date() > user.otp_expire) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    return res.json({
      success: true,
      message: "OTP verified. You can reset password now",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {

  try {

    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check OTP again (security)
    if (user.otp_code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (new Date() > user.otp_expire) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password_hash = hashedPassword;

    // clear OTP
    user.otp_code = null;
    user.otp_expire = null;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};