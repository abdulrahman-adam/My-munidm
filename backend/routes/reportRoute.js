import express from "express";

import {
  getDailySalesReport,
  getTopProducts,
  getLowStockProducts,
  getRevenueReport,
} from "../controllers/reportController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const reportRouter = express.Router();

// ✅ Daily sales
reportRouter.get(
  "/daily-sales",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  getDailySalesReport
);

// ✅ Top selling products
reportRouter.get(
  "/top-products",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  getTopProducts
);

// ✅ Low stock
reportRouter.get(
  "/low-stock",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  getLowStockProducts
);

// ✅ Revenue report
reportRouter.get(
  "/revenue",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  getRevenueReport
);

export default reportRouter;