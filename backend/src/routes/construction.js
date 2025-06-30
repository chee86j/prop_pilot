import express from "express";
import { ConstructionDraw, Property } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateConstructionDrawData } from "../utils/validation.js";

const router = express.Router();

// Get all construction draws for a property
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

    const draws = await ConstructionDraw.findAll({
      where: { propertyId: req.params.propertyId },
      order: [["drawNumber", "ASC"]],
    });

    res.json(draws);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific construction draw
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const draw = await ConstructionDraw.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!draw) {
      return res.status(404).json({ error: "Construction draw not found" });
    }

    res.json(draw);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new construction draw
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validationError = validateConstructionDrawData(req.body);
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

    // Get the highest draw number and add 1
    const maxDrawNumber = await ConstructionDraw.max("drawNumber", {
      where: { propertyId: req.body.propertyId },
    });

    const draw = await ConstructionDraw.create({
      ...req.body,
      drawNumber: (maxDrawNumber || 0) + 1,
    });

    res.status(201).json(draw);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a construction draw
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const validationError = validateConstructionDrawData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const draw = await ConstructionDraw.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!draw) {
      return res.status(404).json({ error: "Construction draw not found" });
    }

    await draw.update(req.body);
    res.json(draw);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a construction draw
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const draw = await ConstructionDraw.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!draw) {
      return res.status(404).json({ error: "Construction draw not found" });
    }

    await draw.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload construction draw documents
router.post("/:id/documents", authenticateToken, async (req, res) => {
  try {
    const draw = await ConstructionDraw.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!draw) {
      return res.status(404).json({ error: "Construction draw not found" });
    }

    // Handle document upload logic here
    // This is a placeholder for the actual implementation
    const documentUrls = req.body.documentUrls || [];

    draw.documents = [...draw.documents, ...documentUrls];
    await draw.save();

    res.json(draw);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update construction draw status
router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "disbursed", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const draw = await ConstructionDraw.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!draw) {
      return res.status(404).json({ error: "Construction draw not found" });
    }

    const updateData = {
      status,
      approvalDate: status === "approved" ? new Date() : draw.approvalDate,
      disbursementDate:
        status === "disbursed" ? new Date() : draw.disbursementDate,
    };

    await draw.update(updateData);
    res.json(draw);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
