import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class ConstructionDraw extends Model {}

ConstructionDraw.init(
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
    drawNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    requestDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    disbursementDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "disbursed", "rejected"),
      defaultValue: "pending",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    workCompleted: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    inspectionRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    inspectionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    inspectionReport: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    inspectorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    documents: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    receipts: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ConstructionDraw",
    tableName: "construction_draws",
    timestamps: true,
    indexes: [
      {
        fields: ["propertyId"],
      },
      {
        fields: ["drawNumber"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

export default ConstructionDraw;
