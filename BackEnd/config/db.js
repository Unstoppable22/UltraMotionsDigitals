const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("UltraMotionDigitals");
    console.log("✅ MongoDB Connected Successfully");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

module.exports = { connectDB, client };
