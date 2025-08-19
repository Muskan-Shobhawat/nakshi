import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // Optional email (unique only if provided)
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // allows multiple nulls
      trim: true,
      lowercase: true,
    },

    phone: { type: String, required: true, unique: true, trim: true },

    password: { type: String, required: true },
    verified: { type: Boolean, default: false }, 

    // role: { type: String, default: "user" },
  },
  { timestamps: true }
);


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
