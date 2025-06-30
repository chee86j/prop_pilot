import express from "express";
import { Lease, Property, Tenant } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateLeaseData } from "../utils/validation.js";

const router = express.Router();

// Get all leases for a property
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

    const leases = await Lease.findAll({
      where: { propertyId: req.params.propertyId },
      include: [{ model: Tenant, as: "tenant" }],
    });

    res.json(leases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all leases for a tenant
router.get("/tenant/:tenantId", authenticateToken, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId },
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

    const leases = await Lease.findAll({
      where: { tenantId: req.params.tenantId },
    });

    res.json(leases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific lease
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const lease = await Lease.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
        { model: Tenant, as: "tenant" },
      ],
    });

    if (!lease) {
      return res.status(404).json({ error: "Lease not found" });
    }

    res.json(lease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new lease
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validationError = validateLeaseData(req.body);
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

    const tenant = await Tenant.findOne({
      where: {
        id: req.body.tenantId,
        propertyId: req.body.propertyId,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const lease = await Lease.create(req.body);
    res.status(201).json(lease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a lease
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const validationError = validateLeaseData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const lease = await Lease.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!lease) {
      return res.status(404).json({ error: "Lease not found" });
    }

    await lease.update(req.body);
    res.json(lease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a lease
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const lease = await Lease.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!lease) {
      return res.status(404).json({ error: "Lease not found" });
    }

    await lease.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload lease documents
router.post("/:id/documents", authenticateToken, async (req, res) => {
  try {
    const lease = await Lease.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!lease) {
      return res.status(404).json({ error: "Lease not found" });
    }

    // Handle document upload logic here
    // This is a placeholder for the actual implementation
    const documentUrls = req.body.documentUrls || [];

    lease.documents = [...lease.documents, ...documentUrls];
    await lease.save();

    res.json(lease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record rent payment
router.post("/:id/payments", authenticateToken, async (req, res) => {
  try {
    const { amount, date, method, reference } = req.body;

    const lease = await Lease.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!lease) {
      return res.status(404).json({ error: "Lease not found" });
    }

    const payment = {
      amount,
      date,
      method,
      reference,
      timestamp: new Date(),
    };

    lease.paymentHistory = [...lease.paymentHistory, payment];
    await lease.save();

    res.json(lease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lease payment history
router.get("/:id/payments", authenticateToken, async (req, res) => {
  try {
    const lease = await Lease.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!lease) {
      return res.status(404).json({ error: "Lease not found" });
    }

    res.json(lease.paymentHistory || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
