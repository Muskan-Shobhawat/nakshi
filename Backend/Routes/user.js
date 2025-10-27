import express from 'express';
// import { verifyToken } from "../Middleware/auth.js";
import { register, login } from "../Controllers/user.js";
import { sendOtp, verifyOtp } from "../Controllers/otp.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.post("/login", login);

export default router;
