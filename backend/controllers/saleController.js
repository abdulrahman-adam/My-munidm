import Sale from "../models/Sale.js";
import { Op } from "sequelize";
import SaleItem from "../models/SaleItem.js";
import { sequelize } from "../configs/db.js";
import Product from "../models/Product.js";

/* =========================
   CREATE SALE
========================= */
// export const createSale = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const {
//       user_id,
//       cashier_name,
//       payment_method,
//       payment_reference,
//       shift_id,
//       items,
//     } = req.body;

//     // =====================
//     // VALIDATION
//     // =====================
//     if (!user_id || !payment_method) {
//       await transaction.rollback();
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     if (!Array.isArray(items) || items.length === 0) {
//       await transaction.rollback();
//       return res.status(400).json({ message: "Items required" });
//     }

//     // =====================
//     // CREATE SALE FIRST
//     // =====================
//     const sale = await Sale.create(
//       {
//         user_id,
//         cashier_name: cashier_name || "SYSTEM",
//         payment_method,
//         payment_reference: payment_reference || null,
//         shift_id: shift_id || null,
//         status: "COMPLETED",
//         total: 0,
//         invoice_number: "TEMP",
//       },
//       { transaction }
//     );

//     // =====================
//     // SAFE INVOICE
//     // =====================
//     const invoice_number = `POS-${String(sale.id).padStart(6, "0")}`;

//     await Sale.update(
//       { invoice_number },
//       { where: { id: sale.id }, transaction }
//     );

//     // =====================
//     // VALIDATE ITEMS (IMPORTANT)
//     // =====================
//     const saleItems = items.map((i) => {
//       if (!i.product_id) {
//         throw new Error("Missing product_id in items");
//       }

//       return {
//         sale_id: sale.id,
//         product_id: i.product_id,
//         quantity: Number(i.quantity),
//         price: Number(i.price),
//         subtotal: Number(i.quantity) * Number(i.price),
//       };
//     });

//     // =====================
//     // INSERT ITEMS
//     // =====================
//     await SaleItem.bulkCreate(saleItems, { transaction });

//     // =====================
//     // TOTAL
//     // =====================
//     const total = saleItems.reduce((sum, i) => sum + i.subtotal, 0);

//     await Sale.update(
//       { total: Number(total.toFixed(2)) },
//       { where: { id: sale.id }, transaction }
//     );

//     // =====================
//     // COMMIT
//     // =====================
//     await transaction.commit();

//     const finalSale = await Sale.findByPk(sale.id, {
//       include: [{ model: SaleItem, as: "saleItems" }],
//     });

//     return res.status(201).json({
//       success: true,
//       sale: finalSale,
//     });

//   } catch (error) {
//     await transaction.rollback();

//     console.error("🔥 CREATE SALE ERROR FULL:");
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//       details: error.errors || null,
//     });
//   }
// };


export const createSale = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      user_id,
      cashier_name,
      payment_method,
      payment_reference,
      shift_id,
      items,
    } = req.body;

    // =====================
    // VALIDATION
    // =====================
    if (!user_id || !payment_method) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Items required" });
    }

    // =====================
    // CREATE SALE
    // =====================
    const sale = await Sale.create(
      {
        user_id,
        cashier_name: cashier_name || "SYSTEM",
        payment_method,
        payment_reference: payment_reference || null,
        shift_id: shift_id || null,
        status: "COMPLETED",
        total: 0,
        invoice_number: "TEMP",
      },
      { transaction }
    );

    // =====================
    // INVOICE NUMBER
    // =====================
    const invoice_number = `POS-${String(sale.id).padStart(6, "0")}`;

    await Sale.update(
      { invoice_number },
      { where: { id: sale.id }, transaction }
    );

    // =====================
    // BUILD SALE ITEMS
    // =====================
    const saleItems = items.map(({ product_id, quantity, price }) => {
      if (!product_id) {
        throw new Error("Missing product_id in items");
      }

      return {
        sale_id: sale.id,
        product_id,
        quantity: Number(quantity),
        price: Number(price),
        subtotal: Number(quantity) * Number(price),
      };
    });

    // =====================
    // INSERT ITEMS
    // =====================
    await SaleItem.bulkCreate(saleItems, { transaction });

    // =====================
    // TOTAL CALCULATION
    // =====================
    const total = saleItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    await Sale.update(
      { total: Number(total.toFixed(2)) },
      { where: { id: sale.id }, transaction }
    );

    // =====================
    // 🔥 STOCK UPDATE (ADDED CODE)
    // =====================
    for (const { product_id, quantity } of saleItems) {
      await Product.decrement(
        { stock: quantity },
        {
          where: { id: product_id },
          transaction,
        }
      );
    }

    // =====================
    // COMMIT
    // =====================
    await transaction.commit();

    const finalSale = await Sale.findByPk(sale.id, {
      include: [{ model: SaleItem, as: "saleItems" }],
    });

    return res.status(201).json({
      success: true,
      sale: finalSale,
    });

  } catch (error) {
    await transaction.rollback();

    console.error("🔥 CREATE SALE ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      details: error.errors || null,
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