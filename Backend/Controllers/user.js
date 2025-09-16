import User from "../Models/user.js";
import jwt from "jsonwebtoken";
// import fetch from "node-fetch";
import bcrypt from "bcrypt";

// Generate 6 digit OTP
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and password are required",
      });
    }

    // Check if phone/email already exists in main users collection
    const query = [{ phone }];
    if (email) query.push({ email }); // ✅ only check if email is provided

    const existing = await User.findOne({ $or: query });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: existing.phone === phone ? "Phone already registered" : "Email already registered",
      });
    }

    // Hash password early
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Generate OTP
    // const otp = generateOtp();
    // call MSG91 Send OTP
    const response = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "authkey": process.env.MSG91_AUTHKEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: "91" + phone,
      }),
    });
    const data = await response.json();

    if (data.type !== "success") {
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }


    // Temporarily store user data + OTP in-memory (or Redis/DB)
    // For demo: attach to session (NOT good for prod, better use Redis)
    //     req.app.locals.tempUsers = req.app.locals.tempUsers || {};
    //     req.app.locals.tempUsers[phone] = {
    //       name,
    //       phone,
    //       email: email || undefined, // ✅ allow null
    //       password: hashedPassword,
    //       otp,
    //     };

    //     // TODO: Send via SMS/Email
    //     console.log(`OTP for ${phone} is ${otp}`);

    //     return res.status(200).json({
    //       success: true,
    //       message: "OTP sent, please verify your account",
    //     });
    //   } catch (err) {
    //     console.error("REGISTER ERROR:", err);
    //     return res.status(500).json({ success: false, message: "Internal server error" });
    //   }

    // temporarily store user info until OTP verified
    req.app.locals.tempUsers = req.app.locals.tempUsers || {};
    req.app.locals.tempUsers[phone] = { name, phone, email, password };

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const tempUsers = req.app.locals.tempUsers || {};
    const tempUser = tempUsers[phone];

    if (!tempUser) {
      return res.status(400).json({ success: false, message: "No pending registration found" });
    }

    // if (parseInt(tempUser.otp) !== parseInt(otp)) {
    //   return res.status(400).json({ success: false, message: "Invalid OTP" });
    // }

    // call MSG91 Verify API
    const response = await fetch("https://api.msg91.com/api/v5/otp/verify", {
      method: "POST",
      headers: {
        "authkey": process.env.MSG91_AUTHKEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile: "91" + phone, otp }),
    });
    const data = await response.json();

    if (data.type !== "success") {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Save verified user into DB
  //  
  // save user after verification
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

    return res.json({ success: true, message: "Account verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
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
