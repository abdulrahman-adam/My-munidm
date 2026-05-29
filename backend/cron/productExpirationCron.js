import cron from "node-cron";
import { Op } from "sequelize";

import Product from "../models/Product.js";
import { sendEmail } from "../utils/sendEmail.js";

cron.schedule("* * * * *", async () => {
  try {
  

    const today = new Date();

    const nextWeek = new Date();
    // message avant 7 jour d'expiration
    nextWeek.setDate(today.getDate() + 7);
    // for today
    // nextWeek.setDate(today.getDate() + 365);

    const products = await Product.findAll({
      where: {
        is_active: true,
        expiration_date: {
          [Op.between]: [today, nextWeek],
        },
        expiry_notification_sent: false,
      },
    });

    

    if (products.length === 0) {
      console.log("⚠️ NO PRODUCTS TO SEND");
    }

    for (const product of products) {

      console.log("================================");
      console.log("🛒 PRODUCT:", product.name);
      console.log("📦 STOCK:", product.stock);
      console.log("📅 EXPIRATION:", product.expiration_date);
      console.log("================================");

      try {

        console.log("📤 SENDING EMAIL...");

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

        console.log("✅ EMAIL SENT SUCCESS");

        product.expiry_notification_sent = true;

        await product.save();

        console.log("✅ PRODUCT UPDATED");

      } catch (emailError) {

        console.error("❌ EMAIL SEND ERROR:");
        console.error(emailError);

      }
    }

    console.log("✅ CRON FINISHED");

  } catch (error) {

    console.error("🔥 EXPIRATION_CRON_ERROR:");
    console.error(error);

  }
});