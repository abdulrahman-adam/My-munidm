import express from "express";

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const productRouter = express.Router();

// ✅ Create product
productRouter.post(
  "/",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  createProduct
);

// ✅ Get products
productRouter.get(
  "/",
  protect,
  authorizeRoles("CASHIER", "MANAGER", "ADMIN"),
  getProducts
);

// ✅ Update product
productRouter.put(
  "/:id",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  updateProduct
);

// ✅ Delete product
productRouter.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteProduct
);

export default productRouter;