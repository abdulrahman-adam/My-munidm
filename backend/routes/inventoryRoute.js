import express from "express";
import {
  addStock,
  removeStock,
  adjustStock,
  getInventoryLogs,
  getProductHistory,
  getLowStockProducts,
  getSalesAnalytics,
  getReorderSuggestions,
} from "../controllers/inventoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const inventoryRouter = express.Router();

/* =========================================================
   ADD STOCK (RESTOCK)
========================================================= */
inventoryRouter.post(
  "/add-stock",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  addStock
);

/* =========================================================
   REMOVE STOCK (OUT / DAMAGE / LOSS)
========================================================= */
inventoryRouter.post(
  "/remove-stock",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  removeStock
);

/* =========================================================
   ADJUST STOCK (ADMIN CORRECTION)
========================================================= */
inventoryRouter.put(
  "/adjust-stock",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  adjustStock
);

/* =========================================================
   GET ALL INVENTORY LOGS
========================================================= */
inventoryRouter.get(
  "/logs",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  getInventoryLogs
);

/* =========================================================
   GET PRODUCT HISTORY
========================================================= */
inventoryRouter.get(
  "/product/:product_id",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  getProductHistory
);


inventoryRouter.get("/low-stock", protect, getLowStockProducts);
inventoryRouter.get("/analytics", protect, getSalesAnalytics);
inventoryRouter.get("/reorder", protect, getReorderSuggestions);

export default inventoryRouter;