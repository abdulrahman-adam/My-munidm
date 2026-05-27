import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { generateDailyReport } from "../controllers/reportController.js";



const reportRouter = express.Router();

// ✅ Daily sales
// reportRouter.get(
//   "/daily-sales",
//   protect,
//   authorizeRoles("MANAGER", "ADMIN"),
//   getDailySalesReport
// );

// ✅ Top selling products
// reportRouter.get(
//   "/top-products",
//   protect,
//   authorizeRoles("MANAGER", "ADMIN"),
//   getTopProducts
// );

// ✅ Low stock
// reportRouter.get(
//   "/low-stock",
//   protect,
//   authorizeRoles("MANAGER", "ADMIN"),
//   getLowStockProducts
// );



reportRouter.get("/daily-report", protect,authorizeRoles("MANAGER", "ADMIN"), generateDailyReport);

export default reportRouter;