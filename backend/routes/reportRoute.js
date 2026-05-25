import express from "express";

import {
  getDailySalesReport,
  getTopProducts,
  getLowStockProducts,
  getRevenueReport,
  generateDailyReport,
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



reportRouter.get("/daily-report", protect,authorizeRoles("MANAGER", "ADMIN"), generateDailyReport);

export default reportRouter;