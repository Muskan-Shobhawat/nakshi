// Models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    phone: { type: String, required: true, unique: true, trim: true },

    password: { type: String, required: true },

    verified: { type: Boolean, default: false },

    // new: role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
