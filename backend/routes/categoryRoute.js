import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../configs/multer.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";



const categoryRouter = express.Router();

/* =========================================================
   CREATE CATEGORY
========================================================= */
categoryRouter.post(
  "/create",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  upload.array("images", 4),
  createCategory
);

/* =========================================================
   GET ALL
========================================================= */
categoryRouter.get(
  "/all",
  protect,
  authorizeRoles("CASHIER", "MANAGER", "ADMIN"),
  getCategories
);

/* =========================================================
   UPDATE CATEGORY
========================================================= */
categoryRouter.put(
  "/:id",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  upload.array("images", 4),
  updateCategory
);

/* =========================================================
   DELETE CATEGORY
========================================================= */
categoryRouter.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteCategory
);

export default categoryRouter;