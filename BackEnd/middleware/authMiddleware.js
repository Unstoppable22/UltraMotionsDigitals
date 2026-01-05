import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Auth Middleware: No Bearer token found in headers");
      return res.status(401).json({ message: "Access denied. Please login." });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 4. Attach user info to request
    req.user = decoded; 
    console.log("✅ Auth Middleware: Token verified for user ID:", decoded.id);
    
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Invalid session. Please login again." });
  }
};