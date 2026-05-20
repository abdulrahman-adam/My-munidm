import express from "express";

import {
  createSale,
  getSales,
} from "../controllers/saleController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const saleRouter = express.Router();

// ✅ Create sale
saleRouter.post(
  "/",
  protect,
  authorizeRoles("CASHIER", "MANAGER", "ADMIN"),
  createSale
);

// ✅ View sales
saleRouter.get(
  "/",
  protect,
  authorizeRoles("MANAGER", "ADMIN"),
  getSales
);

export default saleRouter;