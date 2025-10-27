import Otp from "../Models/otp.js";
import User from "../Models/user.js"; // ✅ import User model

// ===================== SEND OTP =====================
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // ✅ Step 1: Check if phone already registered
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already registered.",
      });
    }

    // ✅ Step 2: Check for cooldown (if OTP still active)
    const existingOtp = await Otp.findOne({ phone });
    if (existingOtp && existingOtp.expiresAt > new Date()) {
      const secondsLeft = Math.floor((existingOtp.expiresAt - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before requesting a new OTP.`,
      });
    }

    // ✅ Step 3: Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

    // Save or update OTP record
    await Otp.findOneAndUpdate(
      { phone },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    console.log(`✅ Generated OTP ${otp} for ${phone}`);

    // ✅ Step 4: Send via NinzaSMS
    const smsRes = await fetch("https://ninzasms.in.net/auth/send_sms", {
      method: "POST",
      headers: {
        authorization: process.env.NINZA_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender_id: process.env.NINZA_SENDER_ID,
        variables_values: otp.toString(),
        numbers: phone,
      }),
    }).then((r) => r.json());

    // Log any non-success response for debugging
    if (!smsRes || (smsRes.status !== 1 && smsRes.status !== "OK")) {
      console.error("⚠️ NinzaSMS warning:", smsRes);
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpRes: smsRes,
    });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
    });
  }
};

// ===================== VERIFY OTP =====================
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const record = await Otp.findOne({ phone });
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // ✅ Step 1: Check expiration
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ phone });
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ✅ Step 2: Validate OTP
    if (Number(otp) !== record.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ Step 3: Success — delete OTP and confirm verification
    console.log(`✅ OTP verified successfully for ${phone}`);

    await Otp.deleteOne({ phone });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully!",
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
    });
  }
};
