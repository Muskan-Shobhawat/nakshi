import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controllers/products.js";

const router = express.Router();

// Routes
router.post("/", createProduct);       // Add new product
router.get("/", getProducts);          // Get all products
router.get("/:id", getProductById);    // Get product by ID
router.put("/:id", updateProduct);     // Update product
router.delete("/:id", deleteProduct);  // Delete product

export default router;
