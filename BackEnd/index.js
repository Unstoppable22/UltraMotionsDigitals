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
// 1. CLEANED ORIGINS (No trailing slashes!)
// ------------------------------
const allowedOrigins = [
  "https://ultramotiondigitals.com",
  "https://www.ultramotiondigitals.com",
  "http://localhost:5173",
  "https://ultra-motions-digitals-99fx.vercel.app"
];

// ------------------------------
// 2. THE "FORCED" HEADER OVERRIDE (Must be first)
// ------------------------------
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if the request origin is in our allowed list
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Allow non-browser requests (like your keep-alive ping)
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  // Handle Preflight (The browser's handshake)
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