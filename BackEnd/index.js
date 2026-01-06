import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/authRoutes.js";
import fs from 'fs';

// 1. PLACE THIS HERE (GLOBAL SCOPE)
const allowedOrigins = [
  "https://ultramotiondigitals.com",
  "https://www.ultramotiondigitals.com",
  "https://ultra-motions-digitals-99fx.vercel.app",
  "http://localhost:5173"
];

// Ensure directory exists
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

dotenv.config();
const app = express();

// 2. MANUAL CORS BLOCK (Uses the global allowedOrigins)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// 3. STANDARD CORS (Now it can see the variable!)
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send("✅ Ultra Motions Digitals Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// --- ERROR HANDLING ---
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