import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";
import { sendWhatsApp } from "../utils/sendWhatsApp.js";

const bookingSchema = new mongoose.Schema(
  {
    billboardId: { type: String, required: true, trim: true },
    billboardTitle: { type: String, required: true, trim: true },
    userId: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    userPhone: { type: String, trim: true }, // For WhatsApp
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mediaUrl: { type: String, trim: true },
    agreed: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// Notify admin when new booking is created
bookingSchema.post("save", async function (doc) {
  const approveLink = `${process.env.FRONTEND_URL}/api/admin/bookings/${doc._id}/update-status?status=approved`;
  const rejectLink = `${process.env.FRONTEND_URL}/api/admin/bookings/${doc._id}/update-status?status=rejected`;

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "New Booking Received",
    text: `New booking by ${doc.userName} for "${doc.billboardTitle}".
Approve: ${approveLink}
Reject: ${rejectLink}`
  });

  await sendWhatsApp({
    to: process.env.ADMIN_WHATSAPP,
    message: `New booking by ${doc.userName} for "${doc.billboardTitle}".
Approve: ${approveLink}
Reject: ${rejectLink}`
  });
});

// Notify user after status change
bookingSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  if (doc.status === "approved") {
    await sendEmail({
      to: doc.userEmail,
      subject: "Booking Approved ✅",
      text: `Hello ${doc.userName}, your booking for "${doc.billboardTitle}" has been approved.`
    });

    await sendWhatsApp({
      to: doc.userPhone,
      message: `Hello ${doc.userName}, your booking for "${doc.billboardTitle}" has been approved.`
    });
  } else if (doc.status === "rejected") {
    await sendEmail({
      to: doc.userEmail,
      subject: "Booking Rejected ❌",
      text: `Hello ${doc.userName}, unfortunately your booking for "${doc.billboardTitle}" has been rejected.`
    });

    await sendWhatsApp({
      to: doc.userPhone,
      message: `Hello ${doc.userName}, unfortunately your booking for "${doc.billboardTitle}" has been rejected.`
    });
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
