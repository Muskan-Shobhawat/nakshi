// Routes/orders.js
import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../Controllers/orders.js";
import { verifyToken, requireRole } from "../Middleware/auth.js"; // optional protection

const router = express.Router();

// Public: create a new order (frontend already uploaded screenshot to Firebase)
router.post("/", createOrder);

// Admin: get all orders (protect with verifyToken + requireRole('admin') if you want)
router.get("/", verifyToken, requireRole("admin"), getOrders);

// Admin: get specific order by orderId
router.get("/:id", verifyToken, requireRole("admin"), getOrderById);

// Admin: update order status
router.put("/:id/status", verifyToken, requireRole("admin"), updateOrderStatus);

export default router;
