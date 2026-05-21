import express from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";


const userRouter = express.Router();

// ✅ Create user
userRouter.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createUser
);

// ✅ Get all users
userRouter.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getUsers
);



// ✅ Get single user
userRouter.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  getUserById
);

// ✅ Update user
userRouter.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateUser
);

// ✅ Delete user
userRouter.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteUser
);

export default userRouter;