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
      cashier_name,
      payment_method,
      invoice_number,
      items,
    } = req.body;

    if (!items || items.length === 0) {
      await transaction.rollback();

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
      const product = await Product.findByPk(
        item.product_id,
        { transaction }
      );

      if (!product) {
        await transaction.rollback();

        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();

        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      total +=
        Number(product.price) * item.quantity;
    }

    /* =========================================================
       CREATE SALE
    ========================================================= */
    const sale = await Sale.create(
      {
        user_id,
        cashier_name,
        invoice_number,
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
      const product = await Product.findByPk(
        item.product_id,
        { transaction }
      );

      /* =========================
         CREATE SALE ITEM
      ========================= */
      await SaleItem.create(
        {
          sale_id: sale.id,
          product_id: product.id,
          quantity: item.quantity,
          price: product.price,
          subtotal:
            Number(product.price) *
            item.quantity,
        },
        { transaction }
      );

      /* =========================
         REDUCE STOCK
      ========================= */
      product.stock =
        product.stock - item.quantity;

      await product.save({ transaction });

      /* =========================
         BARCODE HISTORY
      ========================= */
      await BarcodeHistory.create(
        {
          sale_id: sale.id,
          product_id: product.id,
          barcode: product.barcode,
          cashier_id: user_id,
          cashier_name,
          quantity: item.quantity,
        },
        { transaction }
      );
    }

    /* =========================================================
       DAILY SALES LOG
    ========================================================= */
    await DailySale.create(
      {
        sale_id: sale.id,
        total,
        payment_method,
        cashier_id: user_id,
      },
      { transaction }
    );

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