import mongoose from "mongoose";

// ✅ Individual Cart Item Schema
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true, // store product name snapshot
    },
    price: {
      type: Number,
      required: true, // store product price at time of adding
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
      default: 1,
    },
    image: {
      type: String, // snapshot of product image (mainPhoto)
      required: true,
    },
  },
  { _id: false } // prevents generating a new _id for each item
);

// ✅ Main Cart Schema
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ Auto-calculate totals before saving
cartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  this.tax = this.subtotal * 0.05; // 5% tax (example)
  this.total = this.subtotal + this.tax;
  next();
});

export default mongoose.model("Cart", cartSchema);
