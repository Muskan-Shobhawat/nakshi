// Backend/Middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../Models/user.js"; // adjust path if needed

/**
 * verifyToken
 * - Verifies JWT from Authorization header (Bearer <token>)
 * - Attaches decoded token payload to req.user
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (should contain id, phone, role if your login includes it)
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(403).json({ success: false, message: "Invalid or expired token." });
  }
};

/**
 * requireRole(role)
 * - Middleware factory that checks req.user.role
 * - Usage: router.get('/admin', verifyToken, requireRole('admin'), handler)
 */
export const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      // ensure token was verified earlier
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // If token already contains role, check it first
      if (req.user.role) {
        if (req.user.role === role) return next();
        return res.status(403).json({ success: false, message: "Forbidden: insufficient privileges" });
      }

      // fallback: fetch user from DB (handles tokens that only carry user id)
      if (req.user.id) {
        const user = await User.findById(req.user.id).select("role");
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
        if (user.role === role) return next();
        return res.status(403).json({ success: false, message: "Forbidden: insufficient privileges" });
      }

      // if no role info and no id -> forbidden
      return res.status(403).json({ success: false, message: "Forbidden" });
    } catch (err) {
      console.error("requireRole error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
};

/**
 * helper: isAdminToken (optional)
 * - quick programmatic check of token string (not used as middleware)
 * - returns true/false; useful for simple server-side checks
 */
export const isAdminToken = (token) => {
  try {
    if (!token) return false;
    const decoded = jwt.verify(token.replace(/^Bearer\s+/i, ""), process.env.JWT_SECRET);
    return decoded?.role === "admin";
  } catch {
    return false;
  }
};

export default { verifyToken, requireRole, isAdminToken };
