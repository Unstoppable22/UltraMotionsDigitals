import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    billboardId: { type: String, required: true },
    billboardTitle: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mediaUrl: { type: String },
    agreed: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
