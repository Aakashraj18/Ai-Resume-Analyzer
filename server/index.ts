import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not set in environment variables");
  process.exit(1);
}

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analyses", analysisRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve React Router frontend in production
if (process.env.NODE_ENV === "production") {
  // We dynamically import createRequestHandler to avoid dev dependency issues
  // and load the build file only in production
  app.use(express.static("build/client"));
  app.all(
    "*",
    async (req, res, next) => {
      try {
        const { createRequestHandler } = await import("@react-router/express");
        // @ts-expect-error - The build file might not exist during dev/typecheck
        const build = await import("../build/server/index.js");
        const handler = createRequestHandler({ build });
        return handler(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  );
}

// Start server
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
