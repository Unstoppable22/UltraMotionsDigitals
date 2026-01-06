import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";
import { sendWhatsApp } from "../utils/sendWhatsApp.js";

const bookingSchema = new mongoose.Schema(
  {
    billboardId: { type: String, default: () => `BILL-${Date.now()}` },
    billboardTitle: { type: String, default: "Standard Billboard" }, 
    userId: { type: String, required: true },
    userName: { type: String, default: "Guest User" },
    userEmail: { type: String, required: true },
    userPhone: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    campaignType: { type: String, default: "Standard" },
    mediaUrl: { type: String, trim: true },
    agreed: { type: Boolean, default: true },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

// --- NOTIFICATIONS ---
bookingSchema.post("save", async function (doc) {
  const approveLink = `${process.env.FRONTEND_URL}/admin/dashboard`;
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "📢 New Booking Received - Ultra Motion",
      text: `New booking by ${doc.userName} for "${doc.billboardTitle}".\n\nView details: ${approveLink}`
    });

    if (process.env.ADMIN_WHATSAPP) {
      await sendWhatsApp({
        to: process.env.ADMIN_WHATSAPP,
        message: `📢 *New Booking Received*\n\n*Client:* ${doc.userName}\n*Billboard:* ${doc.billboardTitle}`
      });
    }
  } catch (err) {
    console.error("❌ Notification Error:", err.message);
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;