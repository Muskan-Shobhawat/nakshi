import express from "express";
import { verifyToken } from "../Middleware/auth.js";
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

export default router;
