import express from "express";
import { MaintenanceRequest, Property, Tenant } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateMaintenanceRequestData } from "../utils/validation.js";

const router = express.Router();

// Get all maintenance requests for a property
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

    const requests = await MaintenanceRequest.findAll({
      where: { propertyId: req.params.propertyId },
      include: [{ model: Tenant, as: "tenant" }],
      order: [
        ["priority", "DESC"],
        ["requestDate", "DESC"],
      ],
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all maintenance requests for a tenant
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

    const requests = await MaintenanceRequest.findAll({
      where: { tenantId: req.params.tenantId },
      order: [["requestDate", "DESC"]],
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific maintenance request
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const request = await MaintenanceRequest.findOne({
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

    if (!request) {
      return res.status(404).json({ error: "Maintenance request not found" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new maintenance request
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validationError = validateMaintenanceRequestData(req.body);
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

    if (req.body.tenantId) {
      const tenant = await Tenant.findOne({
        where: {
          id: req.body.tenantId,
          propertyId: req.body.propertyId,
        },
      });

      if (!tenant) {
        return res.status(404).json({ error: "Tenant not found" });
      }
    }

    const request = await MaintenanceRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a maintenance request
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const validationError = validateMaintenanceRequestData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const request = await MaintenanceRequest.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Maintenance request not found" });
    }

    await request.update(req.body);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a maintenance request
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const request = await MaintenanceRequest.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Maintenance request not found" });
    }

    await request.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload maintenance request images
router.post("/:id/images", authenticateToken, async (req, res) => {
  try {
    const request = await MaintenanceRequest.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Maintenance request not found" });
    }

    // Handle image upload logic here
    // This is a placeholder for the actual implementation
    const imageUrls = req.body.imageUrls || [];

    request.images = [...request.images, ...imageUrls];
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update maintenance request status
router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "in_progress", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const request = await MaintenanceRequest.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Maintenance request not found" });
    }

    await request.update({
      status,
      completionDate: status === "completed" ? new Date() : null,
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add tenant feedback
router.post("/:id/feedback", authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const request = await MaintenanceRequest.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Maintenance request not found" });
    }

    const feedback = {
      rating,
      comment,
      timestamp: new Date(),
    };

    request.tenantFeedback = feedback;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
