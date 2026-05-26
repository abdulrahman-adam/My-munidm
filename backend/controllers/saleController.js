import Sale from "../models/Sale.js";
import { Op } from "sequelize";

/* =========================
   CREATE SALE
========================= */
export const createSale = async (req, res) => {
  try {
    const {
      user_id,
      cashier_name,
      invoice_number,
      total,
      payment_method,
      payment_reference,
      shift_id,
      offline_synced,
    } = req.body;

    if (!user_id || !invoice_number || !total) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const sale = await Sale.create({
      user_id,
      cashier_name,
      invoice_number,
      total,
      payment_method,
      payment_reference,
      shift_id,
      offline_synced: offline_synced ?? true,
      status: "COMPLETED",
    });

    return res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL SALES
========================= */
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: sales.length,
      sales,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET SALE BY ID
========================= */
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findByPk(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    return res.status(200).json({
      success: true,
      sale,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   FILTER SALES
========================= */
export const filterSales = async (req, res) => {
  try {
    const { startDate, endDate, cashier_id, status } = req.query;

    let where = {};

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    if (cashier_id) {
      where.user_id = cashier_id;
    }

    if (status) {
      where.status = status;
    }

    const sales = await Sale.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: sales.length,
      sales,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE SALE STATUS
========================= */
export const updateSaleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const sale = await Sale.findByPk(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    sale.status = status;
    await sale.save();

    return res.status(200).json({
      success: true,
      message: "Sale status updated",
      sale,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE SALE (ADMIN ONLY)
========================= */
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findByPk(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    await sale.destroy();

    return res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};