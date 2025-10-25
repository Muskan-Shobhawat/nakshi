import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// 🧠 TTL Index — auto-delete document once expiresAt time passes
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Optional: prevent duplicate OTP records for the same phone
otpSchema.index({ phone: 1 }, { unique: true });

// Before saving: update expiresAt if not set
otpSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    // Default: OTP expires in 5 minutes
    this.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  }
  next();
});

export default mongoose.model("Otp", otpSchema);
