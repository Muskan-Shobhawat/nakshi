import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // Optional email (unique only if provided)
    // email: {
    //   type: String,
    //   unique: true,
    //   sparse: true, // allows multiple null values
    //   trim: true,
    //   lowercase: true,
    // },

    phone: { type: String, required: true, unique: true, trim: true },

    password: { type: String, required: true },

    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ❌ Removed pre("save") hook (since password is hashed in controller)

export default mongoose.model("User", userSchema);


