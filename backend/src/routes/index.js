import express from 'express';
import authRoutes from './auth.js';
import propertyRoutes from './property.js';
import phaseRoutes from './phase.js';
import tenantRoutes from './tenant.js';
import leaseRoutes from './lease.js';
import maintenanceRoutes from './maintenance.js';
import constructionRoutes from './construction.js';
import receiptRoutes from './receipt.js';
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/properties', authenticateToken, propertyRoutes);
router.use('/phases', phaseRoutes);
router.use('/tenants', tenantRoutes);
router.use('/leases', leaseRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/construction', constructionRoutes);
router.use('/receipts', receiptRoutes);

// Protected routes (add these later)
// router.use('/users', authenticateToken, userRoutes);

export default router;
