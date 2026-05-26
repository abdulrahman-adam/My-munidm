import axios from "axios";

/* =========================
   WHATSAPP ALERT
========================= */
export const sendWhatsAppAlert = async (message) => {
  try {
    await axios.get(
      `https://api.callmebot.com/whatsapp.php?phone=33651490377&text=${encodeURIComponent(
        message
      )}&apikey=YOUR_API_KEY`
    );
  } catch (err) {
    console.log("WhatsApp error:", err.message);
  }
};