import { Router } from "express";
import { Property } from "../db/models/Property";
import { authenticateToken } from "../middleware/auth.middleware";
import { ValidationError } from "../utils/errors";

const router = Router();

// Get all properties for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { owner_id: req.user.id },
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// Get single property
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

// Create new property
router.post("/", authenticateToken, async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      owner_id: req.user.id,
    };

    const property = await Property.create(propertyData);
    res.status(201).json(property);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to create property" });
    }
  }
});

// Update property
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    await property.update(req.body);
    res.json(property);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to update property" });
    }
  }
});

// Delete property
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    await property.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property" });
  }
});

export default router;
