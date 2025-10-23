import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";

// Load environment variables
dotenv.config();

console.log("🟢 index.js is running"); // Just to confirm the file starts running

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174","https://ultra-motions-digitals-99fx.vercel.app/"],
  credentials: true,
}));
app.use(express.json());


// ✅ Serve uploaded files (for images/videos)
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// ✅ Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Database connection error:", err));
