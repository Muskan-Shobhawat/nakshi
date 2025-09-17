import User from "../Models/user.js";
import jwt from "jsonwebtoken";
// import fetch from "node-fetch";
import bcrypt from "bcrypt";

// Generate 6 digit OTP
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

export const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and password are required",
      });
    }

    // Check if phone/email already exists
    const query = [{ phone }];
    if (email) query.push({ email });

    const existing = await User.findOne({ $or: query });
    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          existing.phone === phone
            ? "Phone already registered"
            : "Email already registered",
      });
    }

    // Temporarily save user details in memory
    req.app.locals.tempUsers = req.app.locals.tempUsers || {};
    req.app.locals.tempUsers[phone] = {
      name,
      phone,
      email: email || undefined,
      password,
    };

    // ✅ Call MSG91 Send OTP API (without template)
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp?authkey=${process.env.MSG91_AUTHKEY}&mobile=91${phone}&otp_length=6`,
      { method: "POST" }
    );

    const data = await response.json();
    console.log("MSG91 SEND OTP RESPONSE:", data);
      console.log("OTP sent to:", "91" + phone, "Response:", data);

    if (data.type !== "success") {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });
    }

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const tempUsers = req.app.locals.tempUsers || {};
    const tempUser = tempUsers[phone];

    if (!tempUser) {
      return res
        .status(400)
        .json({ success: false, message: "No pending registration found" });
    }

    // ✅ Call MSG91 Verify API
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?authkey=${process.env.MSG91_AUTHKEY}&mobile=91${phone}&otp=${otp}`,
      { method: "POST" }
    );
    console.log("Verifying OTP for:", "91" + phone, "Frontend OTP:", otp);

    const data = await response.json();
    console.log("MSG91 VERIFY OTP RESPONSE:", data);
    console.log("Frontend OTP:", otp);


    if (data.type !== "success") {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);

    const user = new User({
      name: tempUser.name,
      phone: tempUser.phone,
      email: tempUser.email,
      password: hashedPassword,
      verified: true,
    });
    await user.save();

    delete req.app.locals.tempUsers[phone];

    return res.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 1. Validate inputs
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }
    console.log(phone, password);

    // 2. Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (user not found)",
      });
    }

    // 3. Require verification (if you added 'verified' field in schema)
    if (user.verified === false) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first",
      });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (wrong password)",
      });
    }

    // 5. Generate JWT
    const token = jwt.sign(
      { id: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Send success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ---------------- RESEND OTP ----------------
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Phone is required" });

    const user = await User.findOne({ phone });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otp = generateOtp();
    user.otp = otp;
    await user.save();

    console.log(`Resent OTP for ${phone} is ${otp}`); // TODO: SMS/email

    return res.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
