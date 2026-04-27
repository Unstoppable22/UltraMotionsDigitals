import twilio from "twilio";

export const sendWhatsapp = async (message) => {
  try {
    // These must match the keys in your Render Dashboard
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE}`, 
      to: `whatsapp:${process.env.ADMIN_PHONE}`,  
      body: `📢 *Ultra Motions Alert*\n\n${message}`
    });
    console.log("✅ WhatsApp sent to Admin");
  } catch (error) {
    console.error("❌ WhatsApp Error:", error.message);
  }
};