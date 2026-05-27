import PDFDocument from "pdfkit";
import { Op } from "sequelize";

import Sale from "../models/Sale.js";
import SaleItem from "../models/SaleItem.js";
import Product from "../models/Product.js";

export const generateDailyReport = async (
  req,
  res
) => {
  try {

    /* =========================
       TODAY DATE
    ========================= */

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    /* =========================
       GET SALES
    ========================= */

    const sales = await Sale.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
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

      order: [["createdAt", "DESC"]],
    });

    /* =========================
       PDF DOCUMENT
    ========================= */

    const doc = new PDFDocument({
      margin: 40,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=daily-report.pdf"
    );

    doc.pipe(res);

    /* =========================
       TITLE
    ========================= */

    doc
      .fontSize(20)
      .text("DAILY SALES REPORT", {
        align: "center",
      });

    doc.moveDown(2);

    let totalRevenue = 0;

    /* =========================
       SALES LOOP
    ========================= */

    sales.forEach((sale) => {

      doc
        .fontSize(12)
        .text(
          `Invoice: ${sale.invoice_number}`
        );

      doc.text(
        `Payment: ${sale.payment_method}`
      );

      doc.text(
        `Date: ${new Date(
          sale.createdAt
        ).toLocaleString()}`
      );

      doc.moveDown(0.5);

      doc.text(
        "-----------------------------------"
      );

      /* =========================
         SALE ITEMS
      ========================= */

      if (
        sale.SaleItems &&
        sale.SaleItems.length > 0
      ) {

        sale.SaleItems.forEach((item) => {

          const productName =
            item.Product?.name ||
            "Unknown Product";

          const quantity =
            Number(item.quantity) || 0;

          const price =
            Number(item.price) || 0;

          const subtotal =
            Number(item.subtotal) || 0;

          doc.text(
            `${productName} | ${quantity} x ${price} € = ${subtotal} €`
          );

          totalRevenue += subtotal;
        });

      } else {

        doc.text("No items found");

      }

      doc.moveDown();
    });

    /* =========================
       TOTAL
    ========================= */

    doc.moveDown();

    doc
      .fontSize(14)
      .text(
        `TOTAL REVENUE: ${totalRevenue.toFixed(2)} €`,
        {
          align: "right",
        }
      );

    /* =========================
       END PDF
    ========================= */

    doc.end();

  } catch (error) {

    console.error(
      "DAILY REPORT ERROR:",
      error
    );

    if (!res.headersSent) {

      res.status(500).json({
        message:
          "Failed to generate daily report",
        error: error.message,
      });

    }
  }
};