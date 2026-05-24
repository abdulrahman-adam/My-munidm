import express from "express";

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getByBarcode,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../configs/multer.js";

const productRouter = express.Router();

/* =========================================================
   CREATE PRODUCT (WITH IMAGES)
========================================================= */
productRouter.post(
  "/create",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  upload.array("images", 4), // 🔥 IMPORTANT: handles 1–4 images
  createProduct
);

productRouter.get(
  "/barcode/:barcode",
  protect,
  authorizeRoles("CASHIER", "MANAGER", "ADMIN"),
  getByBarcode
);

/* =========================================================
   GET PRODUCTS
========================================================= */
productRouter.get(
  "/all",
  protect,
  authorizeRoles("CASHIER", "MANAGER", "ADMIN"),
  getProducts
);

/* =========================================================
   UPDATE PRODUCT (WITH IMAGES)
========================================================= */
productRouter.put(
  "/:id",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  upload.array("images", 4), // 🔥 allow replacing images
  updateProduct
);

/* =========================================================
   DELETE PRODUCT
========================================================= */
productRouter.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteProduct
);

export default productRouter;