import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { protect } from "./middleware/auth.js";
import postRoutes from "./routes/postRoutes.js";


import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);




// Health check
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.get("/api/me", protect, (req, res) => {
  res.json({ user: req.user });
});




// Start serve PURE
app.get("/", (req, res) => {
  res.send("API is running ....");
});



// Start server after DB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  }
}

start();
