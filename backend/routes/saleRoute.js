import express from "express";

import {
  createSale,
  
} from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";



const saleRouter = express.Router();

// ✅ Create sale
saleRouter.post(
  "/create",
  protect,
  authorizeRoles("CASHIER", "MANAGER", "ADMIN"),
  createSale
);

// ✅ View sales
// saleRouter.get(
//   "/",
//   protect,
//   authorizeRoles("MANAGER", "ADMIN"),
//   getSales
// );

export default saleRouter;