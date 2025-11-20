// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import userRoutes from "./Routes/user.js"; // adjust the path if different
// import productRoutes from "./Routes/products.js"; // adjust the path if different
// import otpRoutes from "./Routes/otp.js";
// import cartRoutes from "./Routes/cart.js";
// import ordersRouter from "./Routes/order.js"; // adjust path


// dotenv.config();

// const app = express();

// // ✅ Allowed origins (local + vercel frontend)
// const allowedOrigins = [
//   "http://localhost:5173", // local dev
//   "https://nakshifrontend-two.vercel.app", // vercel deployment
//   "https://nakshijewellers.com",
//  "https://www.nakshijewellers.com",
// ];

// // middlewares
// // app.use((req, res, next) => {
// //   const allowedOrigin = "https://nakshijewellers.com";
// //   res.header("Access-Control-Allow-Origin", allowedOrigins);
// //   res.header("Access-Control-Allow-Credentials", "true");
// //   res.header(
// //     "Access-Control-Allow-Headers",
// //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
// //   );
// //   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

// //   // Preflight request
// //   if (req.method === "OPTIONS") {
// //     return res.sendStatus(204);
// //   }
// //   next();
// // });


// app.use(express.json()); // parse JSON
// app.use(express.urlencoded({ extended: true }));

// // routes
// app.use("/api/user", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/user", otpRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", ordersRouter);



// // 404 handler (returns JSON, not HTML)
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Not found" });
// });

// // error handler (returns JSON)
// app.use((err, req, res, next) => {
//   console.error("UNCAUGHT APP ERROR:", err);
//   res.status(500).json({ success: false, message: "Internal server error" });
// });

// // db + server
// const PORT = process.env.PORT || 5000;
// console.log("Mongo URI:", process.env.MONGO_URI);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Mongo connection error:", err);
//     process.exit(1);
//   });


// /mnt/data/server.js  (replace current content with this)
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./Routes/user.js";
import productRoutes from "./Routes/products.js";
import otpRoutes from "./Routes/otp.js";
import cartRoutes from "./Routes/cart.js";
import ordersRouter from "./Routes/order.js";

dotenv.config();

const app = express();

// ✅ Allowed origins (local + vercel frontend + www)
const allowedOrigins = [
  "http://localhost:5173",
  "https://nakshifrontend-two.vercel.app",
  "https://nakshijewellers.com",
  "https://www.nakshijewellers.com"
];

// --- CORS using the cors package (recommended) ---
app.use(cors({
  origin: (origin, callback) => {
    // Log origin for debugging (will log "undefined" for curl/server-to-server requests)
    console.log("CORS origin:", origin);

    // allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"]
}));

// Optional: small middleware to return friendly message for root
app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", otpRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRouter);

// 404 handler (returns JSON)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// error handler (returns JSON)
app.use((err, req, res, next) => {
  console.error("UNCAUGHT APP ERROR:", err && (err.message || err));
  // If it's a CORS rejection from the cors package, return 403 and message
  if (err && /not allowed by CORS/i.test(err.message || "")) {
    return res.status(403).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Internal server error" });
});

// db + server
const PORT = process.env.PORT || 5000;
console.log("Mongo URI:", process.env.MONGO_URI ? "SET" : "NOT SET");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Bind to 0.0.0.0 so Render can detect the port
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
