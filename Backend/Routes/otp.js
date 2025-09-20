import express from "express";
import { sendOtp, verifyOtp } from "../Controllers/otp.js";
import requireOtpVerified from "../Middleware/otpauth.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.get("/protected", requireOtpVerified, (req, res) => {
  res.json({ success: true, message: "You are verified!" });
});

export default router;
