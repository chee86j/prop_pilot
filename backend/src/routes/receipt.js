import express from "express";
import { Receipt, Property, Tenant } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateReceiptData } from "../utils/validation.js";

const router = express.Router();

// Get all receipts for a property
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

    const receipts = await Receipt.findAll({
      where: { propertyId: req.params.propertyId },
      include: [{ model: Tenant, as: "tenant" }],
      order: [["date", "DESC"]],
    });

    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all receipts for a tenant
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

    const receipts = await Receipt.findAll({
      where: { tenantId: req.params.tenantId },
      order: [["date", "DESC"]],
    });

    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific receipt
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
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

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new receipt
router.post("/", authenticateToken, async (req, res) => {
  try {
    const validationError = validateReceiptData(req.body);
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

    // Generate a unique receipt number
    const date = new Date();
    const receiptNumber = `RCP-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    const receipt = await Receipt.create({
      ...req.body,
      receiptNumber,
      date: date,
    });

    res.status(201).json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a receipt
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const validationError = validateReceiptData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const receipt = await Receipt.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    // Don't allow changing the receipt number
    delete req.body.receiptNumber;

    await receipt.update(req.body);
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a receipt
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    await receipt.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload receipt image
router.post("/:id/image", authenticateToken, async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    // Handle image upload logic here
    // This is a placeholder for the actual implementation
    const imageUrl = req.body.imageUrl;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    receipt.image = imageUrl;
    await receipt.save();

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update receipt status
router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const receipt = await Receipt.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          as: "property",
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const updateData = {
      status,
      approvedBy: status === "approved" ? req.user.id : null,
      approvalDate: status === "approved" ? new Date() : null,
      rejectionReason: status === "rejected" ? req.body.rejectionReason : null,
    };

    await receipt.update(updateData);
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
