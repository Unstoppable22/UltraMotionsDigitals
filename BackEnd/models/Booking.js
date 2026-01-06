import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";
import { sendWhatsApp } from "../utils/sendWhatsApp.js";

const bookingSchema = new mongoose.Schema(
  {
    billboardId: { 
      type: String, 
      required: true, 
      trim: true 
    },
    billboardTitle: { 
      type: String, 
      required: true, 
      trim: true 
    },
    userId: { 
      type: String, 
      required: true, 
      trim: true 
    },
    userName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    userEmail: { 
      type: String, 
      required: true, 
      trim: true 
    },
    userPhone: { 
      type: String, 
      trim: true 
    }, 
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
    mediaUrl: { 
      type: String, 
      trim: true 
    },
    agreed: { 
      type: Boolean, 
      default: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

// --- NOTIFICATIONS ---

// This hook runs AFTER the booking is successfully saved to the database
bookingSchema.post("save", async function (doc) {
  const approveLink = `${process.env.FRONTEND_URL}/admin/dashboard`; 
  
  try {
    // 1. Send Email to Admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "📢 New Booking Received - Ultra Motion",
      text: `New booking by ${doc.userName} for "${doc.billboardTitle}".\n\nView details in the dashboard: ${approveLink}`
    });

    // 2. Send WhatsApp to Admin
    if (process.env.ADMIN_WHATSAPP) {
      await sendWhatsApp({
        to: process.env.ADMIN_WHATSAPP,
        message: `📢 *New Booking Received*\n\n*Client:* ${doc.userName}\n*Billboard:* ${doc.billboardTitle}\n*Dates:* ${doc.startDate.toDateString()} to ${doc.endDate.toDateString()}`
      });
    }
  } catch (err) {
    // We log the error but don't crash the app if notification fails
    console.error("❌ Post-Save Notification Error:", err.message);
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;