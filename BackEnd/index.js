import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from 'fs';

import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// 1. Folder setup
const dir = './uploads';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// 2. CORS setup
const allowedOrigins = [
    "https://ultramotiondigitals.com",
    "https://www.ultramotiondigitals.com",
    "https://ultramotionsdigitals.onrender.com",
    "https://ultra-motions-digitals-99fx.vercel.app",
    "http://localhost:5173", 
    "http://localhost:3000"  
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy violation'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions)); // Fixes PathError for modern Node

// 3. Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// 4. Routes
app.get("/", (req, res) => {
    res.send("✅ Ultra Motions Digitals Backend is running!");
});

// These prefixes determine the URLs:
app.use("/api/auth", authRoutes);      // URLs start with /api/auth
app.use("/api/bookings", bookingRoutes); // URLs start with /api/bookings
app.use("/api/admin", adminRoutes);    // URLs start with /api/admin

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.message);
    res.status(err.status || 500).json({ 
        message: err.message || "Internal Server Error"
    });
});

const startServer = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoURI) throw new Error("MONGODB_URI is missing");
        
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB Connected Successfully");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Ultra Motions API running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ DB CONNECTION FAILED:", err.message);
        process.exit(1);
    }
};

startServer();