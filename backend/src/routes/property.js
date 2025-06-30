import express from "express";
import {
  Property,
  Phase,
  Tenant,
  MaintenanceRequest,
} from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import { validatePropertyData } from "../utils/validation.js";

const router = express.Router();

// Get all properties for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { ownerId: req.user.id },
      include: [
        { model: Phase, as: "phases" },
        { model: Tenant, as: "tenants" },
        { model: MaintenanceRequest, as: "maintenanceRequests" },
      ],
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific property
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
      include: [
        { model: Phase, as: "phases" },
        { model: Tenant, as: "tenants" },
        { model: MaintenanceRequest, as: "maintenanceRequests" },
      ],
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new property
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validationError = validatePropertyData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const property = await Property.create({
      ...req.body,
      ownerId: req.user.id,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a property
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const validationError = validatePropertyData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const property = await Property.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    await property.update(req.body);
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a property
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    await property.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get property financial summary
router.get("/:id/financial-summary", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const summary = {
      totalInvestment: property.purchaseCost + property.totalRehabCost,
      monthlyIncome: property.expectedYearlyRent / 12,
      monthlyExpenses:
        property.yearlyPropertyTaxes / 12 +
        property.homeownersInsurance / 12 +
        property.managementFees +
        property.maintenanceCosts,
      cashFlow:
        property.expectedYearlyRent / 12 -
        (property.yearlyPropertyTaxes / 12 +
          property.homeownersInsurance / 12 +
          property.managementFees +
          property.maintenanceCosts),
      capRate: property.purchaseCapRate,
      roi:
        ((property.expectedYearlyRent -
          property.yearlyPropertyTaxes -
          property.homeownersInsurance -
          property.managementFees * 12 -
          property.maintenanceCosts * 12) /
          (property.purchaseCost + property.totalRehabCost)) *
        100,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload property images
router.post("/:id/images", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Handle image upload logic here
    // This is a placeholder for the actual implementation
    const imageUrls = req.body.imageUrls || [];

    property.images = [...property.images, ...imageUrls];
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
