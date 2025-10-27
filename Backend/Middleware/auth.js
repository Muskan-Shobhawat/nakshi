// Backend/Middleware/auth.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request

    next(); // move to next middleware or route
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token." });
  }
};
