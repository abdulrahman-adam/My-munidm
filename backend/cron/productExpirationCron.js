import cron from "node-cron";
import { Op } from "sequelize";


import Product from "../models/Product.js";
import { sendEmail } from "../utils/sendEmail.js";

cron.schedule("0 8 * * *", async () => {
  try {
    console.log("Running product expiration check...");

    const today = new Date();

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const products = await Product.findAll({
      where: {
        is_active: true,
        expiration_date: {
          [Op.between]: [today, nextWeek],
        },
        expiry_notification_sent: false,
      },
    });

    for (const product of products) {
      await sendEmail(
        process.env.SEED_ADMIN_EMAIL,
        `⚠ Product Expiration Alert: ${product.name}`,
        `
          <div style="font-family:Arial">
            <h2>Product Expiration Warning</h2>

            <p>
              The product <b>${product.name}</b> will expire soon.
            </p>

            <p>
              Expiration Date:
              <b>${new Date(product.expiration_date).toDateString()}</b>
            </p>

            <p>
              Stock: <b>${product.stock}</b>
            </p>

            <p style="color:red;">
              Please take action immediately.
            </p>
          </div>
        `
      );

      product.expiry_notification_sent = true;
      await product.save();
    }

    console.log("Expiration check completed");
  } catch (error) {
    console.error("EXPIRATION_CRON_ERROR:", error);
  }
});