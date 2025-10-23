import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("Using Mongo URI:", process.env.MONGO_URI);

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connection successful!");
    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

testConnection();
