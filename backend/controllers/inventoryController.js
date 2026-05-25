import { sequelize } from "../configs/db.js";
import { Op, fn, col } from "sequelize";

import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import Sale from "../models/Sale.js";

/* =========================================================
   ADD STOCK (RESTOCK PRODUCT)
========================================================= */
export const addStock = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { product_id, user_id, quantity, reason } = req.body;

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.stock += Number(quantity);
    await product.save({ transaction });

    const log = await InventoryLog.create(
      {
        product_id,
        user_id,
        type: "IN",
        quantity,
        reason: reason || "Stock added",
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Stock added successfully",
      product,
      log,
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   REMOVE STOCK (MANUAL OUT)
========================================================= */
export const removeStock = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { product_id, user_id, quantity, reason } = req.body;

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }

    product.stock -= Number(quantity);
    await product.save({ transaction });

    const log = await InventoryLog.create(
      {
        product_id,
        user_id,
        type: "OUT",
        quantity,
        reason: reason || "Stock removed",
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Stock removed successfully",
      product,
      log,
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   ADJUST STOCK (ADMIN CORRECTION)
========================================================= */
export const adjustStock = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { product_id, user_id, new_quantity, reason } = req.body;

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const oldStock = product.stock;
    const diff = new_quantity - oldStock;

    product.stock = new_quantity;
    await product.save({ transaction });

    const log = await InventoryLog.create(
      {
        product_id,
        user_id,
        type: "ADJUSTMENT",
        quantity: diff,
        reason: reason || "Stock adjusted",
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Stock adjusted successfully",
      product,
      log,
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET INVENTORY LOGS
========================================================= */
export const getInventoryLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });

  } catch (error) {
    console.log("GET INVENTORY LOGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* =========================================================
   GET PRODUCT HISTORY
========================================================= */
export const getProductHistory = async (req, res) => {
  try {
    const { product_id } = req.params;

    const logs = await InventoryLog.findAll({
      where: { product_id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET PRODUCT LOWER
========================================================= */
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: sequelize.where(
        sequelize.col("stock"),
        "<=",
        5
      ),
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   SALES ANALYTICS (DAILY / WEEKLY)
========================================================= */
export const getSalesAnalytics = async (req, res) => {
  try {
    /* =========================
       DAILY SALES
    ========================= */
    const daily = await Sale.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", col("total")), "total"],
      ],
      group: ["date"],
      order: [["date", "DESC"]],
      limit: 7,
    });

    /* =========================
       WEEKLY SALES
    ========================= */
    const weekly = await Sale.findAll({
      attributes: [
        [fn("WEEK", col("createdAt")), "week"],
        [fn("SUM", col("total")), "total"],
      ],
      group: ["week"],
      order: [["week", "DESC"]],
      limit: 4,
    });

    return res.status(200).json({
      success: true,
      daily,
      weekly,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   AUTO REORDER SYSTEM (SMART LOGIC)
========================================================= */

export const getReorderSuggestions = async (req, res) => {
  try {
    const products = await Product.findAll();

    const suggestions = products
      .filter((p) => p.stock <= 10)
      .map((p) => ({
        product_id: p.id,
        name: p.name,
        stock: p.stock,
        suggested_order: Math.max(20 - p.stock, 5),
      }));

    return res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};