import nodemailer from "nodemailer";

/* =========================
   TRANSPORTER (GLOBAL)
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   GENERIC EMAIL
========================= */
export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"POS System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: text, // 🔥 change THIS
  });
};

/* =========================
   LOW STOCK ALERT EMAIL
========================= */
export const sendEmailAlert = async (subject, text) => {
  await transporter.sendMail({
    from: `"POS SYSTEM" <${process.env.EMAIL_USER}>`,
    to: "abdulrahman939291@gmail.com",
    subject,
    text,
  });
};