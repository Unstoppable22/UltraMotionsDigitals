import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Replace this with your own secure values or a database later
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "123456";
const JWT_SECRET = "supersecretkey"; // move to .env later

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;
