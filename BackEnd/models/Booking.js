import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";
import { sendWhatsapp } from "../utils/sendWhatsapp.js";

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

// Triggered when user clicks "Book Now"
bookingSchema.post("save", async function (doc) {
  if (this.isNew) {
    try {
      // 1. Email to User
      await sendEmail({
        to: doc.userEmail,
        subject: "Booking Successfully Received!",
        text: `Hello ${doc.userName}, we have received your booking for "${doc.billboardTitle}". Our team will review it shortly.`
      });

      // 2. WhatsApp to Admin
      await sendWhatsapp(`New Booking! 📢\nClient: ${doc.userName}\nBillboard: ${doc.billboardTitle}\nType: ${doc.campaignType}`);
    } catch (err) {
      console.error("Booking Notification Error:", err.message);
    }
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;