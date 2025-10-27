// import jwt from "jsonwebtoken";

// const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
// const otpToken = jwt.sign(
//   { otp, phone: userPhone }, 
//   process.env.JWT_SECRET, 
//   { expiresIn: "5m" } // OTP valid for 5 minutes
// );

// // Send OTP to user via SMS
// sendOtpToUser(userPhone, otp);

// // Send OTP token back to frontend (hidden, not shown to user)
// res.json({ success: true, otpToken });


// const requireOtpVerified = (req, res, next) => {
//   if (!req.session?.verified) {
//     return res.status(403).json({ success: false, message: "OTP verification required" });
//   }
//   next();
// };

// export default requireOtpVerified;

