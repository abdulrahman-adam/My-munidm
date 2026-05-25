import PDFDocument from "pdfkit";
import Sale from "../models/Sale.js";
import SaleItem from "../models/SaleItem.js";
import Product from "../models/Product.js";

export const generateDailyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await Sale.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
        },
      },
      include: [
        {
          model: SaleItem,
          include: [Product],
        },
      ],
    });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=daily-report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("DAILY SALES REPORT", { align: "center" });
    doc.moveDown();

    let totalRevenue = 0;

    sales.forEach((sale) => {
      doc.fontSize(12).text(`Invoice: ${sale.invoice_number}`);
      doc.text(`Payment: ${sale.payment_method}`);
      doc.text("-----------------------------");

      sale.SaleItems.forEach((item) => {
        const line = `${item.Product.name} | ${item.quantity} x ${item.price} = ${item.subtotal}`;
        doc.text(line);
        totalRevenue += Number(item.subtotal);
      });

      doc.moveDown();
    });

    doc.fontSize(14).text(`TOTAL REVENUE: ${totalRevenue} €`, {
      align: "right",
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};