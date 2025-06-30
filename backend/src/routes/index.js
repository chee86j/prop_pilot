import { Router } from "express";
import authRoutes from "./auth.js";
import propertyRoutes from "./property.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Public routes
router.use("/auth", authRoutes);

// Health check route
router.get("/", (req, res) => {
  res.json({ message: "PropPilot API v1" });
});

// Protected routes
router.use("/properties", authenticateToken, propertyRoutes);

// Protected routes (add these later)
// router.use('/users', authenticateToken, userRoutes);

export default router;
