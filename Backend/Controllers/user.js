import User from "../Models/user.js";
import jwt from "jsonwebtoken";
// import fetch from "node-fetch";
import bcrypt from "bcrypt";

// Generate 6 digit OTP
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// import fetch from "node-fetch"; // if not already available in Node 18+

// REGISTER with OTP
export const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // hash password immediately
    const hashedPassword = await bcrypt.hash(password, 10);

    // init tempUsers store
    if (!req.app.locals.tempUsers) {
      req.app.locals.tempUsers = {};
    }

    // save in temp store
    req.app.locals.tempUsers[phone] = {
      name,
      phone,
      email,
      password: hashedPassword,
    };

    console.log("TEMP USERS AFTER REGISTER:", req.app.locals.tempUsers);

    // send OTP via MSG91
    const response = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        authkey: process.env.MSG91_AUTHKEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: "91" + phone,
      }),
    });

    const data = await response.json();
    console.log("MSG91 OTP RESPONSE:", data);

    if (data.type !== "success") {
      return res
        .status(400)
        .json({ success: false, message: "Failed to send OTP" });
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
      phone,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    console.log("VERIFY OTP BODY:", req.body);
    console.log("ALL TEMP USERS:", req.app.locals.tempUsers);

    const tempUsers = req.app.locals.tempUsers || {};
    const tempUser = tempUsers[phone];

    if (!tempUser) {
      console.log("No pending registration for phone:", phone);
      return res
        .status(400)
        .json({ success: false, message: "No pending registration found" });
    }

    // verify OTP with MSG91
    const response = await fetch("https://api.msg91.com/api/v5/otp/verify", {
      method: "POST",
      headers: {
        authkey: process.env.MSG91_AUTHKEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: "91" + phone,
        otp,
      }),
    });

    const data = await response.json();
    console.log("MSG91 VERIFY RESPONSE:", data);

    if (data.type !== "success") {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // create actual user
    const user = new User({
      name: tempUser.name,
      phone: tempUser.phone,
      email: tempUser.email,
      password: tempUser.password, // already hashed
      verified: true,
    });

    await user.save();

    // cleanup temp store
    delete req.app.locals.tempUsers[phone];

    return res.json({
      success: true,
      message: "Account verified successfully",
      user,
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
