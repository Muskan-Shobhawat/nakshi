// Models/products.js
import mongoose from "mongoose";

/**
 * Allowed subcategories per category.
 * Edit this mapping when you add new categories or subcategories.
 */
const allowedSubcategories = {
  Rings: ["All Rings", "Casual Rings", "Traditional Rings"],
  Earrings: ["All Earrings", "Studs & Tops", "Jhumkas"],
  Chains: ["Thin Chains", "Thick Chains", "Box Chains"],
  Necklace: ["Necklace", "Necklace Sets", "Choker"],
  "Necklace Sets": ["Necklace Sets"],
  Bangles: ["Glass Bangles", "Metal Bangles"],
  Bracelet: ["Charm Bracelet", "Chain Bracelet"],
  Mangalsutra: ["Traditional Mangalsutra", "Modern Mangalsutra"],
  Kada: ["Plain Kada", "Stone Kada"],
  Watches: ["Analog", "Digital", "Smartwatch"],
};

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
      required: true,
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
        "Watches",
      ],
      required: true,
    },

    // Subcategory: optional, validated against the category mapping above
    subcategory: {
      type: String,
      trim: true,
        required: true,
      default: null,
      validate: {
        validator: function (v) {
          // allow null/empty (no subcategory)
          if (v === null || v === undefined || String(v).trim() === "") return true;
          const cat = this.category;
          if (!cat) return true; // can't validate if category missing (other validators handle required)
          const allowed = allowedSubcategories[cat];
          if (!allowed) return true; // if we don't have a mapping, accept any subcategory
          // case-insensitive match
          return allowed.map((s) => s.toLowerCase()).includes(String(v).toLowerCase());
        },
        message: function (props) {
          const cat = props && props.instance && props.instance.category;
          const allowed = cat && allowedSubcategories[cat];
          if (allowed && Array.isArray(allowed)) {
            return `Invalid subcategory '${props.value}' for category '${cat}'. Allowed: ${allowed.join(", ")}`;
          }
          return `Invalid subcategory '${props.value}'.`;
        },
      },
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

// Expose allowed subcategories (helper)
productSchema.statics.getAllowedSubcategories = function (category) {
  return allowedSubcategories[category] || [];
};

export default mongoose.model("Product", productSchema);
