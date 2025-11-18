import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./Routes/user.js"; // adjust the path if different
import productRoutes from "./Routes/products.js"; // adjust the path if different
import otpRoutes from "./Routes/otp.js";
import cartRoutes from "./Routes/cart.js";
import ordersRouter from "./Routes/order.js"; // adjust path


dotenv.config();

const app = express();

// ✅ Allowed origins (local + vercel frontend)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://nakshifrontend-two.vercel.app", // vercel deployment
   "https://nakshijewellers.com",
  
];

// middlewares
app.use((req, res, next) => {
  const allowedOrigin = "https://nakshijewellers.com";
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", otpRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRouter);



// 404 handler (returns JSON, not HTML)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// error handler (returns JSON)
app.use((err, req, res, next) => {
  console.error("UNCAUGHT APP ERROR:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// db + server
const PORT = process.env.PORT || 5000;
console.log("Mongo URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`API server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
