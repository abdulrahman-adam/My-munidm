import express from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  filterSales,
  updateSaleStatus,
  deleteSale,
} from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";



const saleRouter = express.Router();

/* =========================
   CREATE SALE
   CASHIER, MANAGER, ADMIN
========================= */
saleRouter.post(
  "/create",
  protect,
  authorizeRoles("CASHIER", "MANAGER", "ADMIN"),
  createSale
);

/* =========================
   GET ALL SALES
   MANAGER, ADMIN
========================= */
saleRouter.get(
  "/all",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  getAllSales
);

/* =========================
   FILTER SALES
   MANAGER, ADMIN
========================= */
saleRouter.get(
  "/filter",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  filterSales
);

/* =========================
   GET SALE BY ID
   CASHIER, MANAGER, ADMIN
========================= */
saleRouter.get(
  "/:id",
  protect,
  authorizeRoles("CASHIER", "MANAGER", "ADMIN"),
  getSaleById
);

/* =========================
   UPDATE SALE STATUS
   MANAGER, ADMIN ONLY
========================= */
saleRouter.put(
  "/:id/status",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  updateSaleStatus
);

/* =========================
   DELETE SALE
   ADMIN ONLY
========================= */
saleRouter.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteSale
);

export default saleRouter;