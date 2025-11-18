// Routes/orders.js
import express from "express";
import multer from "multer";
import { verifyToken, requireRole } from "../Middleware/auth.js";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../Controllers/order.js";

const router = express.Router();

// multer memory storage (keeps file buffer in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    // accept only jpg/jpeg/png
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
      return cb(new Error("Only JPG, JPEG or PNG images are allowed"));
    }
    cb(null, true);
  },
});

// create order (authenticated users)
router.post("/", verifyToken, upload.single("screenshot"), createOrder);

// admin: list orders
router.get("/", verifyToken, requireRole("admin"), getOrders);

// get order by id (orderId or _id)
router.get("/:id", verifyToken, getOrderById);

// admin: update order status
router.patch("/:id/status", verifyToken, requireRole("admin"), updateOrderStatus);

export default router;
