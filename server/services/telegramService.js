const axios = require("axios");
require("dotenv").config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

/**
 * This function sends a message to a Telegram chat using the Telegram Bot API.
 * @param { string } message 
 */
async function sendTelegramNotification(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
    console.log("Telegram notification sent.");
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
}

module.exports = sendTelegramNotification;
