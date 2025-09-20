// import fetch from "node-fetch";
import Otp from "../Models/otp.js"; // define schema below

// Send OTP
export const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

        // generate 6-digit random otp
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Save/Update OTP in DB (valid 5 mins)
        await Otp.findOneAndUpdate(
            { phone },
            { otp, expiresAt: Date.now() + 5 * 60 * 1000 }, // 5 minutes expiry
            { upsert: true, new: true }
        );

        // send via SMS API
        // sendOtp function (inside otpController.js)
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
                // rout: "waninza" ✅ add only if using WhatsApp
            }),
        }).then(r => r.json());


        return res.json({ success: true, message: "OTP sent successfully", smsRes });
    } catch (err) {
        console.error("SEND OTP ERROR:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = await Otp.findOne({ phone });
    if (!record) return res.status(400).json({ success: false, message: "OTP not found" });

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (Number(otp) !== record.otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ Mark session as verified
    req.session.verified = true;

    await Otp.deleteOne({ phone });

    return res.json({ success: true, message: "OTP verified!" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
