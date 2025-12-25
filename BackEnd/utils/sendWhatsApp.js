// utils/sendWhatsApp.js

import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio WhatsApp number

const client = Twilio(accountSid, authToken);

export const sendWhatsApp = async ({ to, message }) => {
  try {
    const msg = await client.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`,
    });
    console.log("WhatsApp sent:", msg.sid);
  } catch (error) {
    console.error("WhatsApp send error:", error);
  }
};
