import Return from "../models/Return.js";
import SaleItem from "../models/SaleItem.js";
import Product from "../models/Product.js";
import sequelize from "../configs/db.js";

export const createReturn = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      sale_id,
      product_id,
      quantity,
      reason,
      refund_amount,
    } = req.body;

    const saleItem = await SaleItem.findOne({
      where: { sale_id, product_id },
    });

    if (!saleItem) {
      return res.status(404).json({
        success: false,
        message: "Sale item not found",
      });
    }

    /* =========================================================
       CREATE RETURN
    ========================================================= */
    const returnItem = await Return.create(
      {
        sale_id,
        product_id,
        quantity,
        reason,
        refund_amount,
      },
      { transaction }
    );

    /* =========================================================
       RESTORE STOCK
    ========================================================= */
    const product = await Product.findByPk(product_id);

    product.stock = product.stock + quantity;
    await product.save({ transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Return processed successfully",
      returnItem,
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};