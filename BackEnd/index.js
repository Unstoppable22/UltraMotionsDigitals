import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ------------------------------
// 1. Define allowed origins clearly
const allowedOrigins = [
  "https://ultramotiondigitals.com",
  "https://www.ultramotiondigitals.com",
  "https://ultra-motions-digitals-99fx.vercel.app"
];

// 2. The ONLY CORS Middleware you need
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // If the origin is in our list, allow it specifically
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // For debugging: this helps you see in Render logs if a new URL is trying to connect
    console.log("Origin not explicitly allowed:", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  // IMMEDIATELY handle the browser's "handshake" (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});


// Standard CORS as a backup
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ------------------------------
// 3. MIDDLEWARE
// ------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ------------------------------
// 4. ROUTES (Cleaned - No duplicates)
// ------------------------------
app.get("/", (req, res) => {
  res.send("✅ Ultra Motions Digitals Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ------------------------------
// 5. ERROR HANDLING & STARTUP
// ------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  } catch (err) {
    console.error("❌ Startup Error:", err.message);
  }
};

startServer();