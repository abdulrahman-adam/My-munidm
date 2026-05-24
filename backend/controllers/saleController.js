import Sale from "../models/Sale.js";
import SaleItem from "../models/SaleItem.js";
import Product from "../models/Product.js";
import sequelize from "../configs/db.js";

/* =========================================================
   CREATE SALE (MAIN CASHIER ACTION)
========================================================= */
export const createSale = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      user_id,
      payment_method,
      items, // [{ product_id, quantity }]
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in sale",
      });
    }

    let total = 0;

    /* =========================================================
       CHECK STOCK + CALCULATE TOTAL
    ========================================================= */
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      total += Number(product.price) * item.quantity;
    }

    /* =========================================================
       CREATE SALE
    ========================================================= */
    const sale = await Sale.create(
      {
        user_id,
        total,
        payment_method,
        status: "COMPLETED",
      },
      { transaction }
    );

    /* =========================================================
       CREATE SALE ITEMS + REDUCE STOCK
    ========================================================= */
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);

      await SaleItem.create(
        {
          sale_id: sale.id,
          product_id: product.id,
          quantity: item.quantity,
          price: product.price,
          subtotal: Number(product.price) * item.quantity,
        },
        { transaction }
      );

      // 🔥 REDUCE STOCK HERE (IMPORTANT)
      product.stock = product.stock - item.quantity;
      await product.save({ transaction });
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Sale completed successfully",
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