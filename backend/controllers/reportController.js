import PDFDocument from "pdfkit";
import { Op } from "sequelize";
import models from "../models/index.js";

const { Sale, SaleItem, Product } = models;

export const generateDailyReport = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await Sale.findAll({
      where: {
        sale_date: {
          [Op.between]: [startOfDay, endOfDay], // 🔥 FIXED (use sale_date)
        },
      },
      include: [
        {
          model: SaleItem,
          as: "saleItems", // 🔥 MUST MATCH MODEL
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      order: [["sale_date", "DESC"]],
    });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=daily-report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("DAILY SALES REPORT", { align: "center" });
    doc.moveDown(2);

    let totalRevenue = 0;
    let totalItemsSold = 0;

    sales.forEach((sale, index) => {
      const date = new Date(sale.sale_date);

      const formattedDate = date.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      doc.fontSize(12).text(`Sale #${index + 1}`);
      doc.text(`Invoice: ${sale.invoice_number}`);
      doc.text(`Payment: ${sale.payment_method}`);
      doc.text(`Date & Time: ${formattedDate}`);

      doc.text("----------------------------------------");

      const items = sale.saleItems || [];

      if (items.length === 0) {
        doc.text("No items found");
      } else {
        items.forEach((item) => {
          const name = item.product?.name || "Unknown";
          const qty = Number(item.quantity);
          const price = Number(item.price);
          const subtotal = Number(item.subtotal);

          totalItemsSold += qty;
          totalRevenue += subtotal;

          doc.text(`${name} | ${qty} x ${price} = ${subtotal}`);
        });
      }

      doc.text("========================================");
      doc.moveDown();
    });

    doc.fontSize(14).text("SUMMARY", { underline: true });
    doc.text(`Total Sales: ${sales.length}`);
    doc.text(`Total Items: ${totalItemsSold}`);
    doc.text(`Revenue: ${totalRevenue.toFixed(2)} €`);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};