import express from "express";
import upload from "../Middleware/uploadPayment.js";
import { createOrder } from "../Controllers/order.js";

const router = express.Router();

// screenshot field name must match frontend → "screenshot"
router.post("/", upload.single("screenshot"), createOrder);

export default router;
