import jwt from "jsonwebtoken";
import User from "../models/User.js"; // This import is critical!

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

      // 3. CRITICAL STEP: Fetch the user from the DB
      // We use 'await' to ensure we have the data before moving on
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("❌ Auth Middleware: User not found in DB");
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("❌ Auth Middleware Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};