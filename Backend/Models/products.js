import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1000 },
    quantity: { type: Number, required: true, min: 1 },

    // Gender: Male, Female, Unisex
    gender: {
      type: String,
      enum: ["Male", "Female", "Unisex"],
      required: true
    },

    // Category: Rings, Chains, Earrings, etc.
    category: {
      type: String,
      enum: [
        "Rings",
        "Chains",
        "Earrings",
        "Necklace",
        "Bangles",
        "Bracelet",
        "Mangalsutra",
        "Kada",
        "Watches"
      ],
      required: true,
    },

    // Occasion: Everyday, Bridal, Festive
    occasion: {
      type: String,
      enum: ["Everyday", "Bridal", "Festive"],
      required: true,
    },

    // Photos
    mainPhoto: { type: String, required: true }, // store image URL or path
    photos: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
