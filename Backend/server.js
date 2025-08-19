import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./Routes/user.js"; // adjust the path if different

dotenv.config();

const app = express();

// middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // <- critical for parsing JSON bodies
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/user", userRoutes);

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
