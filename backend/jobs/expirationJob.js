import cron from "node-cron";
// import Product from "../models/Product.js";
// import { sendEmailAlert, sendWhatsAppAlert } from "../utils/alertService.js";
import { Op } from "sequelize";
import Product from "../models/Product.js";
import { sendEmailAlert } from "../services/emailService.js";
import { sendWhatsAppAlert } from "../services/whatsappService.js";

/* =========================
   RUN EVERY DAY
========================= */
cron.schedule("0 8 * * *", async () => {
  const today = new Date();

  const products = await Product.findAll({
    where: {
      expiration_date: {
        [Op.lte]: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    },
  });

  for (const p of products) {
    const msg = `⛔ EXPIRATION ALERT

Product: ${p.name}
Category: ${p.category}
Expires: ${p.expiration_date}`;

    await sendEmailAlert("Expiration Alert", msg);
    await sendWhatsAppAlert(msg);
  }
});