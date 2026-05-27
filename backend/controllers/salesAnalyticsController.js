import { Op, fn, col } from "sequelize";
import Sale from "../models/Sale.js";
import SaleItem from "../models/SaleItem.js";
import Product from "../models/Product.js";



// WEEKLY REPORT
export const getWeeklySales = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 7);

    const data = await Sale.findAll({
      where: {
        sale_date: {
          [Op.between]: [start, now],
        },
      },
      attributes: [
        [fn("DATE", col("sale_date")), "date"],
        [fn("SUM", col("total")), "total"],
      ],
      group: [fn("DATE", col("sale_date"))],
      order: [[fn("DATE", col("sale_date")), "ASC"]],
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MONTHLY REPORT
export const getMonthlySales = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date();
    start.setMonth(now.getMonth() - 1);

    const data = await Sale.findAll({
      where: {
        sale_date: {
          [Op.between]: [start, now],
        },
      },
      attributes: [
        [fn("DATE", col("sale_date")), "date"],
        [fn("SUM", col("total")), "total"],
      ],
      group: [fn("DATE", col("sale_date"))],
      order: [[fn("DATE", col("sale_date")), "ASC"]],
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// SALES CHART API (DASHBOARD)
export const getSalesChart = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 7);

    const data = await Sale.findAll({
      where: {
        sale_date: {
          [Op.gte]: start,
        },
      },
      attributes: [
        [fn("DATE", col("sale_date")), "date"],
        [fn("SUM", col("total")), "total"],
      ],
      group: [fn("DATE", col("sale_date"))],
      order: [[fn("DATE", col("sale_date")), "ASC"]],
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BEST SELLING PRODUCTS REPORT
export const getBestSellingProducts = async (req, res) => {
  try {
    const data = await SaleItem.findAll({
      attributes: [
        "product_id",
        [fn("SUM", col("quantity")), "total_sold"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price"],
        },
      ],
      group: ["product_id", "product.id"],
      order: [[fn("SUM", col("quantity")), "DESC"]],
      limit: 10,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PDF INVOICE PER SALE (VERY IMPORTANT)
export const generateInvoice = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: SaleItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${sale.invoice_number}.pdf`
    );

    doc.pipe(res);

    /* HEADER */
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice: ${sale.invoice_number}`);
    doc.text(`Payment: ${sale.payment_method}`);
    doc.text(
      `Date: ${new Date(sale.sale_date).toLocaleString("fr-FR")}`
    );

    doc.moveDown();
    doc.text("------------------------------");

    let total = 0;

    sale.items.forEach((item) => {
      const name = item.product?.name || "Unknown";
      const line = item.quantity * item.price;

      doc.text(
        `${name} | ${item.quantity} x ${item.price} = ${line} €`
      );

      total += line;
    });

    doc.moveDown();
    doc.fontSize(14).text(`TOTAL: ${total.toFixed(2)} €`, {
      align: "right",
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};