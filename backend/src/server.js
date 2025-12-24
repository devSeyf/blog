import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { protect } from "./middleware/auth.js";
import { requestLogger } from "./middleware/logger.js";
import postRoutes from "./routes/postRoutes.js";


import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);




// Health check
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.status(200).json({
    status: "ok",
    database: {
      state: dbStateNames[dbState],
      stateCode: dbState,
      connected: dbState === 1
    },
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
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
  console.error("  Missing MONGO_URI in .env");
  process.exit(1);
}

async function start() {
  try {
    console.log('========================================');
    console.log('  STARTING SERVER');
    console.log('========================================');
    console.log('🔌 Connecting to MongoDB...');
    console.log(`  URI: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`); // Hide password

    const dbConnectStart = performance.now();

    await mongoose.connect(MONGO_URI, {
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
    });

    const dbConnectEnd = performance.now();
    const connectDuration = Math.round(dbConnectEnd - dbConnectStart);

    console.log(`  MongoDB connected in ${connectDuration}ms`);
    console.log(`  Connection pool: min=2, max=10`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`  State: ${mongoose.connection.readyState} (1=connected)`);

    if (connectDuration > 2000) {
      console.warn(`   WARNING: DB connection took ${connectDuration}ms`);
      console.warn('   This suggests network latency or slow DB server.');
      console.warn('   Consider using a local MongoDB or checking network.');
    }

    // Monitor connection events
    mongoose.connection.on('disconnected', () => {
      console.error('  MongoDB disconnected!');
      console.error('   This will cause 4+ second delays on requests!');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('  MongoDB reconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('  MongoDB error:', err);
    });

    console.log('========================================');
    console.log(`  Server running on http://localhost:${PORT}`);
    console.log('========================================\n');

    app.listen(PORT, () => {
      console.log(`  Listening on port ${PORT}`);
      console.log(`  Health check: http://localhost:${PORT}/health`);
      console.log(`  Ready to debug performance issues!\n`);
    });
  } catch (err) {
    console.error("  MongoDB connection error:", err.message);
    console.error("   Stack:", err.stack);
    process.exit(1);
  }
}

start();

