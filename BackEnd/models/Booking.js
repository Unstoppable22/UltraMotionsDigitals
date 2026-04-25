import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";

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
      enum: ["pending", "approved", "rejected", "running", "completed"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

// NOTIFICATION LOGIC
bookingSchema.post("save", async function (doc) {
  try {
    // 1. Alert Admin on New Booking
    if (this.isNew) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "📢 New Booking Received - Ultra Motion",
        text: `New booking by ${doc.userName} for "${doc.billboardTitle}". Check dashboard to review.`
      });
    }
  } catch (err) { console.error("Email Error:", err.message); }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;