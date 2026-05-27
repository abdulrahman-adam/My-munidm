import PDFDocument from "pdfkit";
import { Op } from "sequelize";

import Sale from "../models/Sale.js";
import SaleItem from "../models/SaleItem.js";
import Product from "../models/Product.js";

export const generateDailyReport = async (req, res) => {
  try {
    /* =========================
       DATE RANGE
    ========================= */

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    /* =========================
       FETCH SALES
    ========================= */

    const sales = await Sale.findAll({
      where: {
        sale_date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },

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

      order: [["sale_date", "DESC"]],
    });

    /* =========================
       PDF SETUP
    ========================= */

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=daily-report.pdf"
    );

    doc.pipe(res);

    /* =========================
       HEADER
    ========================= */

    doc
      .fontSize(20)
      .text("DAILY SALES REPORT", { align: "center" });

    doc.moveDown(2);

    let totalRevenue = 0;
    let totalSales = sales.length;
    let totalItems = 0;

    /* =========================
       SALES LOOP
    ========================= */

    sales.forEach((sale, index) => {
      const saleDate = new Date(sale.sale_date);

      const formattedDate = saleDate.toLocaleString("fr-FR", {
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

      const items = sale.items || [];

      if (items.length === 0) {
        doc.text("No items found");
      } else {
        items.forEach((item) => {
          const productName =
            item.product?.name || "Unknown Product";

          const quantity = Number(item.quantity) || 0;
          const price = Number(item.price) || 0;
          const subtotal = Number(item.subtotal) || 0;

          totalItems += quantity;
          totalRevenue += subtotal;

          doc.text(
            `${productName} | ${quantity} x ${price.toFixed(
              2
            )} € = ${subtotal.toFixed(2)} €`
          );
        });
      }

      doc.moveDown();
      doc.text("========================================");
      doc.moveDown();
    });

    /* =========================
       SUMMARY SECTION
    ========================= */

    doc.moveDown();

    doc.fontSize(14).text("SUMMARY", { underline: true });

    doc.moveDown(0.5);

    doc.fontSize(12).text(`Total Sales: ${totalSales}`);
    doc.text(`Total Items Sold: ${totalItems}`);
    doc.text(`Total Revenue: ${totalRevenue.toFixed(2)} €`);

    doc.moveDown();

    doc
      .fontSize(16)
      .text(`NET TOTAL: ${totalRevenue.toFixed(2)} €`, {
        align: "right",
      });

    /* =========================
       END PDF
    ========================= */

    doc.end();
  } catch (error) {
    console.error("DAILY REPORT ERROR:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to generate daily report",
        error: error.message,
      });
    }
  }
};