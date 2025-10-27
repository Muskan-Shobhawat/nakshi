import express from "express";
import { verifyToken } from "../Middleware/auth.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../Controllers/cart.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.delete("/remove", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);

export default router;
