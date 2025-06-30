import { Router } from "express";
import { User, Property, Phase } from "../models/index.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  convertToFloat,
  serializeProperty,
  serializePropertySummary,
} from "../utils/property.js";
import logger from "../utils/logger.js";

const router = Router();

// Get all properties for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { owner_id: req.user.id },
    });

    res.json(properties.map(serializePropertySummary));
  } catch (error) {
    logger.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties" });
  }
});

// Get a specific property
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(serializeProperty(property));
  } catch (error) {
    logger.error("Error fetching property:", error);
    res.status(500).json({ message: "Error fetching property" });
  }
});

// Create a new property
router.post("/", authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ message: "No data provided" });
    }

    // Convert numeric fields
    const numericFields = [
      "purchaseCost",
      "refinanceCosts",
      "totalRehabCost",
      "equipmentCost",
      "constructionCost",
      "largeRepairsCost",
      "renovationCost",
      "kickStartFunds",
      "lenderConstructionDrawsReceived",
      "utilitiesCost",
      "sewer",
      "water",
      "lawn",
      "garbage",
      "yearlyPropertyTaxes",
      "mortgagePaid",
      "homeownersInsurance",
      "expectedYearlyRent",
      "rentalIncomeReceived",
      "vacancyRate",
      "avgTenantStay",
      "otherMonthlyIncome",
      "vacancyLoss",
      "managementFees",
      "maintenanceCosts",
      "totalEquity",
      "arvSalePrice",
      "realtorFees",
      "propTaxtillEndOfYear",
      "lenderLoanBalance",
      "payOffStatement",
      "attorneyFees",
      "miscFees",
      "utilities",
      "cash2closeFromPurchase",
      "cash2closeFromRefinance",
      "totalRehabCosts",
      "expectedRemainingRentEndToYear",
      "totalExpenses",
      "totalConstructionDrawsReceived",
      "projectNetProfitIfSold",
      "cashFlow",
      "cashRoi",
      "rule2Percent",
      "rule50Percent",
      "financeAmount",
      "purchaseCapRate",
      "downPaymentPercentage",
      "loanInterestRate",
      "pmiPercentage",
      "lenderPointsAmount",
    ];

    numericFields.forEach((field) => {
      data[field] = convertToFloat(data[field]);
    });

    // Set owner
    data.owner_id = req.user.id;

    const property = await Property.create(data);

    res.status(201).json(serializeProperty(property));
  } catch (error) {
    logger.error("Error creating property:", error);
    res.status(500).json({ message: "Error creating property" });
  }
});

// Update a property
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const data = req.body;

    // Convert numeric fields
    const numericFields = [
      "purchaseCost",
      "refinanceCosts",
      "totalRehabCost",
      "equipmentCost",
      "constructionCost",
      "largeRepairsCost",
      "renovationCost",
      "kickStartFunds",
      "lenderConstructionDrawsReceived",
      "utilitiesCost",
      "sewer",
      "water",
      "lawn",
      "garbage",
      "yearlyPropertyTaxes",
      "mortgagePaid",
      "homeownersInsurance",
      "expectedYearlyRent",
      "rentalIncomeReceived",
      "vacancyRate",
      "avgTenantStay",
      "otherMonthlyIncome",
      "vacancyLoss",
      "managementFees",
      "maintenanceCosts",
      "totalEquity",
      "arvSalePrice",
      "realtorFees",
      "propTaxtillEndOfYear",
      "lenderLoanBalance",
      "payOffStatement",
      "attorneyFees",
      "miscFees",
      "utilities",
      "cash2closeFromPurchase",
      "cash2closeFromRefinance",
      "totalRehabCosts",
      "expectedRemainingRentEndToYear",
      "totalExpenses",
      "totalConstructionDrawsReceived",
      "projectNetProfitIfSold",
      "cashFlow",
      "cashRoi",
      "rule2Percent",
      "rule50Percent",
      "financeAmount",
      "purchaseCapRate",
      "downPaymentPercentage",
      "loanInterestRate",
      "pmiPercentage",
      "lenderPointsAmount",
    ];

    numericFields.forEach((field) => {
      if (field in data) {
        data[field] = convertToFloat(data[field]);
      }
    });

    await property.update(data);

    res.json(serializeProperty(property));
  } catch (error) {
    logger.error("Error updating property:", error);
    res.status(500).json({ message: "Error updating property" });
  }
});

// Delete a property
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    await property.destroy();
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    logger.error("Error deleting property:", error);
    res.status(500).json({ message: "Error deleting property" });
  }
});

// Get phases for a property
router.get("/:id/phases", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
      include: [
        {
          model: Phase,
          as: "phases",
        },
      ],
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property.phases);
  } catch (error) {
    logger.error("Error fetching phases:", error);
    res.status(500).json({ message: "Error fetching phases" });
  }
});

// Create a new phase
router.post("/:id/phases", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const phase = await Phase.create({
      ...req.body,
      property_id: property.id,
    });

    res.status(201).json(phase);
  } catch (error) {
    logger.error("Error creating phase:", error);
    res.status(500).json({ message: "Error creating phase" });
  }
});

// Update a phase
router.put("/phases/:phaseId", authenticateToken, async (req, res) => {
  try {
    const phase = await Phase.findOne({
      where: { id: req.params.phaseId },
      include: [
        {
          model: Property,
          as: "property",
          where: { owner_id: req.user.id },
        },
      ],
    });

    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    await phase.update(req.body);
    res.json(phase);
  } catch (error) {
    logger.error("Error updating phase:", error);
    res.status(500).json({ message: "Error updating phase" });
  }
});

// Delete a phase
router.delete("/phases/:phaseId", authenticateToken, async (req, res) => {
  try {
    const phase = await Phase.findOne({
      where: { id: req.params.phaseId },
      include: [
        {
          model: Property,
          as: "property",
          where: { owner_id: req.user.id },
        },
      ],
    });

    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    await phase.destroy();
    res.json({ message: "Phase deleted successfully" });
  } catch (error) {
    logger.error("Error deleting phase:", error);
    res.status(500).json({ message: "Error deleting phase" });
  }
});

export default router;
