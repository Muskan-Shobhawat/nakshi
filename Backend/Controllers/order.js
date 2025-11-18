// Controllers/orders.js
import Order from "../Models/order.js";

/**
 * Create new order.
 * Expect body like:
 * {
 *   orderId, name, phone, address, amount, method, txnId, screenshot, items, meta
 * }
 *
 * (Assumes screenshot URL is uploaded from frontend to Firebase already)
 */
export const createOrder = async (req, res) => {
  try {
    // If you used FormData and meta string: allow both ways
    let payload = req.body;
    if (payload?.meta && typeof payload.meta === "string") {
      try {
        payload = { ...payload, ...JSON.parse(payload.meta) };
      } catch (e) {
        // ignore parse error
      }
    }

    const requiredFields = ["orderId", "phone", "amount", "txnId", "screenshot"];
    for (const f of requiredFields) {
      if (!payload[f]) {
        return res.status(400).json({ success: false, message: `Missing required field: ${f}` });
      }
    }

    const order = new Order({
      orderId: payload.orderId,
      name: payload.name,
      phone: payload.phone,
      address: payload.address,
      amount: payload.amount,
      method: payload.method || "PhonePe-QR",
      txnId: payload.txnId,
      screenshot: payload.screenshot,
      items: Array.isArray(payload.items) ? payload.items : [],
      meta: payload.meta || {},
      status: payload.status || "pending",
    });

    await order.save();
    res.status(201).json({ success: true, message: "Order created", orderId: order.orderId, order });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;
    const orders = await Order.find(q).sort({ createdAt: -1 }).lean();
    res.json({ success: true, total: orders.length, orders });
  } catch (err) {
    console.error("getOrders error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).lean();
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    console.error("getOrderById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Status required" });

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Status updated", order });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
