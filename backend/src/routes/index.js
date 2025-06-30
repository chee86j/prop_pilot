import { Router } from "express";
import authRoutes from "./auth.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Public routes
router.use("/auth", authRoutes);

// Health check route
router.get("/", (req, res) => {
  res.json({ message: "PropPilot API v1" });
});

// Protected routes (add these later)
// router.use('/properties', authenticateToken, propertyRoutes);
// router.use('/users', authenticateToken, userRoutes);

export default router;
