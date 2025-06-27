import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { testConnection } from "./db";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

// Test database connection
testConnection()
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

// Basic health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
