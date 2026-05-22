import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const createUser = async (req, res) => {

  try {

    const { name, email, phone, password, role } = req.body;

    // check existing user
    const existingUser = await User.findOne({
      where: { email },
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

export const getUsers = async (req, res) => {

  try {

    const users = await User.findAll({
      where: {
        is_active: true, // ✅ IMPORTANT FIX
      },
      attributes: {
        exclude: ["password_hash", "otp_code", "otp_expire"],
      },
      order: [["created_at", "DESC"]],
    });

    return res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUserById = async (req, res) => {

  try {

    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password_hash", "otp_code", "otp_expire"],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {

  try {

    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, email, phone, role, is_active } = req.body;

    await user.update({
      name: name ?? user.name,
      email: email ?? user.email,
      phone: phone ?? user.phone,
      role: role ?? user.role,
      is_active: is_active ?? user.is_active,
    });

    return res.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User permanently deleted",
    });

  } catch (error) {
    console.error("DELETE_USER_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};