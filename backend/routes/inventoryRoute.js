import express from "express";
import {
  addStock,
  updateInventory,
  getInventoryLogs,
} from "../controllers/inventoryController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const inventoryRouter = express.Router();

// ✅ Add stock
inventoryRouter.post(
  "/add-stock",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  addStock
);

// ✅ Update inventory
inventoryRouter.put(
  "/update/:productId",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  updateInventory
);

// ✅ View inventory logs
inventoryRouter.get(
  "/logs",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  getInventoryLogs
);

export default inventoryRouter;