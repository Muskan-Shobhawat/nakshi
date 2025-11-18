// Models/Order.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String }, // optional product image url
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    // customer copy
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    items: { type: [OrderItemSchema], required: true },

    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },

    paymentMethod: { type: String, required: true }, // e.g. "PhonePe-QR"
    transactionId: { type: String, required: true }, // alphanumeric uppercase
    screenshotUrl: { type: String, required: true }, // URL from firebase

    status: {
      type: String,
      enum: ["pending", "confirmed", "failed", "cancelled", "delivered"],
      default: "pending",
    },

    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
