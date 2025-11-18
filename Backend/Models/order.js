// Models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, index: true, unique: true },
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    amount: { type: Number },
    method: { type: String }, // e.g. "PhonePe-QR"
    txnId: { type: String }, // transaction id (uppercase alnum)
    screenshot: { type: String }, // firebase download URL
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "cancelled", "failed"],
      default: "pending",
    },
    meta: { type: mongoose.Schema.Types.Mixed }, // any extra data
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
