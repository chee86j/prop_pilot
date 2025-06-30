import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class MaintenanceRequest extends Model {}

MaintenanceRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "properties",
        key: "id",
      },
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "tenants",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "urgent"),
      defaultValue: "low",
    },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "completed", "cancelled"),
      defaultValue: "open",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    actualCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vendorInfo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    documents: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tenantFeedback: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "MaintenanceRequest",
    tableName: "maintenance_requests",
    timestamps: true,
    indexes: [
      {
        fields: ["propertyId"],
      },
      {
        fields: ["tenantId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["priority"],
      },
    ],
  }
);

export default MaintenanceRequest;
