import express from "express";

import {
  getWeeklySales,
  getMonthlySales,
  getSalesChart,
  getBestSellingProducts,
  generateInvoice,
} from "../controllers/salesAnalyticsController.js";


const analyticsRouter = express.Router();

analyticsRouter.get("/weekly", getWeeklySales);
analyticsRouter.get("/monthly", getMonthlySales);
analyticsRouter.get("/chart", getSalesChart);
analyticsRouter.get("/best-products", getBestSellingProducts);
analyticsRouter.get("/invoice/:id", generateInvoice);

export default analyticsRouter;