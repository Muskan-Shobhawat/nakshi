import Otp from "../Models/otp.js";

// ===================== SEND OTP =====================
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    // Check if an OTP already exists and hasn't expired
    const existing = await Otp.findOne({ phone });
    if (existing && existing.expiresAt > new Date()) {
      const secondsLeft = Math.floor((existing.expiresAt - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before requesting a new OTP.`,
      });
    }

    // Generate a new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save or update OTP record
    await Otp.findOneAndUpdate(
      { phone },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // ✅ Send OTP via NinzaSMS
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

    // Optional: log NinzaSMS API response for debugging
if (!smsRes || (smsRes.status !== 1 && smsRes.status !== "OK")) {
  console.error("NinzaSMS send warning:", smsRes);
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
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    const record = await Otp.findOne({ phone });

    if (!record) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    // Check if OTP expired
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ phone });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Validate OTP
    if (Number(otp) !== record.otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ OTP verified successfully
    if (req.session) req.session.verified = true;

    // Remove OTP record after successful verification
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
