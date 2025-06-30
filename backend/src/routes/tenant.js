import express from "express";
import {
  Tenant,
  Property,
  Lease,
  MaintenanceRequest,
} from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateTenantData } from "../utils/validation.js";

const router = express.Router();

// Get all tenants for a property
router.get("/property/:propertyId", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.propertyId,
        ownerId: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const tenants = await Tenant.findAll({
      where: { propertyId: req.params.propertyId },
      include: [
        { model: Lease, as: "leases" },
        { model: MaintenanceRequest, as: "maintenanceRequests" },
      ],
    });

    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific tenant
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
        { model: Lease, as: "leases" },
        { model: MaintenanceRequest, as: "maintenanceRequests" },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new tenant
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validationError = validateTenantData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const property = await Property.findOne({
      where: {
        id: req.body.propertyId,
        ownerId: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const tenant = await Tenant.create(req.body);
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a tenant
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const validationError = validateTenantData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const tenant = await Tenant.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    await tenant.update(req.body);
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a tenant
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    await tenant.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload tenant documents
router.post("/:id/documents", authenticateToken, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // Handle document upload logic here
    // This is a placeholder for the actual implementation
    const documentUrls = req.body.documentUrls || [];

    tenant.documents = [...tenant.documents, ...documentUrls];
    await tenant.save();

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tenant background check status
router.patch("/:id/background-check", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "passed", "failed", "not_required"].includes(status)) {
      return res.status(400).json({ error: "Invalid background check status" });
    }

    const tenant = await Tenant.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    await tenant.update({ backgroundCheckStatus: status });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tenant payment history
router.get("/:id/payment-history", authenticateToken, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    res.json(tenant.rentPaymentHistory || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
