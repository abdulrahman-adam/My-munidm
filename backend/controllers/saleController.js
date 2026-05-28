import Sale from "../models/Sale.js";
import { Op } from "sequelize";
import SaleItem from "../models/SaleItem.js";
import { sequelize } from "../configs/db.js";

/* =========================
   CREATE SALE
========================= */
export const createSale = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      user_id,
      cashier_name,
      invoice_number,
      payment_method,
      payment_reference,
      shift_id,
      items, // 🔥 IMPORTANT (missing before)
    } = req.body;

    // 1. CREATE SALE
    const sale = await Sale.create(
      {
        user_id,
        cashier_name,
        invoice_number,
        total: 0,
        payment_method,
        payment_reference,
        shift_id,
        status: "COMPLETED",
      },
      { transaction }
    );

    // 2. CREATE ITEMS (🔥 THIS WAS MISSING)
    const saleItems = items.map((i) => ({
      sale_id: sale.id,
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.price,
      subtotal: i.quantity * i.price,
    }));

    // await SaleItem.bulkCreate(saleItems, { transaction });
    try {
  await SaleItem.bulkCreate(saleItems, { transaction });
} catch (err) {
  console.log("❌ SALE ITEMS ERROR:", err);
}

    // 3. UPDATE TOTAL
    const total = saleItems.reduce((sum, i) => sum + i.subtotal, 0);

    sale.total = total;
    await sale.save({ transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      sale,
    });
  } catch (error) {
    await transaction.rollback();

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