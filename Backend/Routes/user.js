import express from 'express';
import { register, login, sendOtp, verifyOtp } from '../Controllers/user.js';
import { verifyToken } from "../Middleware/auth.js";

const router = express.Router();

// @api desc:- User Signup
// @api method:- POST
// @api endPoint:- /api/user/register
router.post("/register", register);

// @api desc:- User Login
// @api method:- POST
// @api endPoint:- /api/user/login
router.post("/login", login);

// @api desc:- Send OTP after signup
// @api method:- POST
// @api endPoint:- /api/user/send-otp
// router.post("/send-otp", sendOtp);

// @api desc:- Verify OTP
// @api method:- POST
// @api endPoint:- /api/user/verify-otp
// router.post("/verify-otp", verifyOtp);

// Example protected route (optional)
// router.get("/profile", verifyToken, (req, res) => {
//   res.json({ message: "Protected route", user: req.user });
// });

export default router;
