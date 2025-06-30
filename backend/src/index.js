import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

import routes from "./routes/index.js";
import { testConnection } from "./config/database.js";
import initializeDatabase from "./config/init-db.js";
import logger from "./utils/logger.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Serve static files from uploads directory
app.use("/uploads", express.static(join(__dirname, "../uploads")));

// API routes
app.use("/api/v1", routes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error("Error:", { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Initialize database and sync models
    await initializeDatabase();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
