import express from "express";
import { createReturn } from "../controllers/returnController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const returnRouter = express.Router();

returnRouter.post(
  "/create",
  protect,
  authorizeRoles("CASHIER", "MANAGER", "ADMIN"),
  createReturn
);

export default returnRouter;