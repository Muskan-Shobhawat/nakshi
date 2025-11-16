import express from "express";
import { verifyToken, requireRole } from "../Middleware/auth.js";
import { register, login } from "../Controllers/user.js";
import { sendOtp, verifyOtp } from "../Controllers/otp.js";
import User from "../Models/user.js";

const router = express.Router();

// ---------- AUTH ----------
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.post("/login", login);

// ---------- PROFILE ----------
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // req.user.id comes from decoded JWT
    const user = await User.findById(req.user.id).select("name _id");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching profile" });
  }
});

// user.js route file
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name phone");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Fetch user by ID error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------- ADMIN (example protected route) ----------
/**
 * Accessible only to users with role === "admin".
 * Usage: GET /api/user/admin/dashboard
 */
router.get(
  "/admin/dashboard",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      // simple admin payload - you can expand this
      res.status(200).json({
        success: true,
        message: "Welcome to the admin dashboard",
        user: req.user, // contains decoded token (id, phone, role) if your token includes it
      });
    } catch (err) {
      console.error("Admin dashboard error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ONLY FOR ONE-TIME USE! Remove after creation.
router.get("/set-admin", async (req, res) => {
  try {
    const phone = process.env.ADMIN_PHONE;

    if (!phone) {
      return res.status(400).json({ success: false, message: "ADMIN_PHONE not set" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({ success: true, message: "Admin granted!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;
