// Routes/orders.js
import express from "express";
import { verifyToken, requireRole } from "../Middleware/auth.js";
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
} from "../Controllers/order.js";

const router = express.Router();

// Public create (but requires verifyToken so only logged-in users can place orders)
router.post("/", verifyToken, createOrder);

// Admin: list all orders
router.get("/", verifyToken, requireRole("admin"), listOrders);

// Get a single order by id or orderId - owner OR admin
router.get("/:id", verifyToken, getOrder);

// Admin: update status
router.put("/:id/status", verifyToken, requireRole("admin"), updateOrderStatus);

export default router;
