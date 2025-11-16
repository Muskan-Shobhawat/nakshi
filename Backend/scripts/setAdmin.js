// scripts/setAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// adjust this path if your Models folder is elsewhere
import User from "../Models/user.js";

const MONGO = process.env.MONGO_URI || process.env.MONGO || "mongodb://localhost:5173/yourdb";
const phoneToMakeAdmin = process.argv[2];

if (!phoneToMakeAdmin) {
  console.error("Usage: node scripts/setAdmin.js <phoneNumber>");
  process.exit(1);
}

async function run() {
  try {
    console.log("Connecting to DB...", MONGO);
    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ phone: phoneToMakeAdmin });
    if (!user) {
      console.error("User not found for phone:", phoneToMakeAdmin);
      process.exit(1);
    }

    user.role = "admin";
    await user.save();
    console.log("✅ Updated user to admin:", user.phone, "id:", user._id.toString());
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(1);
  }
}

run();
