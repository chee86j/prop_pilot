import express from "express";
import { Phase, Property } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import { validatePhaseData } from "../utils/validation.js";

const router = express.Router();

// Get all phases for a property
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

    const phases = await Phase.findAll({
      where: { propertyId: req.params.propertyId },
      order: [["order", "ASC"]],
    });

    res.json(phases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific phase
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const phase = await Phase.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!phase) {
      return res.status(404).json({ error: "Phase not found" });
    }

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new phase
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validationError = validatePhaseData(req.body);
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

    // Get the highest order number and add 1
    const maxOrder = await Phase.max("order", {
      where: { propertyId: req.body.propertyId },
    });

    const phase = await Phase.create({
      ...req.body,
      order: (maxOrder || 0) + 1,
    });

    res.status(201).json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a phase
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const validationError = validatePhaseData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const phase = await Phase.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!phase) {
      return res.status(404).json({ error: "Phase not found" });
    }

    await phase.update(req.body);
    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a phase
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const phase = await Phase.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!phase) {
      return res.status(404).json({ error: "Phase not found" });
    }

    await phase.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reorder phases
router.post("/reorder", authenticateToken, async (req, res) => {
  try {
    const { propertyId, phaseOrders } = req.body;

    const property = await Property.findOne({
      where: {
        id: propertyId,
        ownerId: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // phaseOrders should be an array of { id, order }
    for (const { id, order } of phaseOrders) {
      await Phase.update({ order }, { where: { id, propertyId } });
    }

    const updatedPhases = await Phase.findAll({
      where: { propertyId },
      order: [["order", "ASC"]],
    });

    res.json(updatedPhases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update phase completion percentage
router.patch("/:id/completion", authenticateToken, async (req, res) => {
  try {
    const { completionPercentage } = req.body;

    if (
      typeof completionPercentage !== "number" ||
      completionPercentage < 0 ||
      completionPercentage > 100
    ) {
      return res.status(400).json({ error: "Invalid completion percentage" });
    }

    const phase = await Phase.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!phase) {
      return res.status(404).json({ error: "Phase not found" });
    }

    await phase.update({
      completionPercentage,
      status: completionPercentage === 100 ? "completed" : "in_progress",
    });

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
