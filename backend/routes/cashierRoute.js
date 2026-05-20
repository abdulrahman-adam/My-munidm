import express from "express";


const cashierRouter = express.Router();

cashierRouter.post(
  "/sales",
  protect,
  authorizeRoles("CASHIER", "ADMIN", "MANAGER"),
  createSale
);

export default cashierRouter;