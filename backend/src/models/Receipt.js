import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Receipt extends Model {}

Receipt.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM(
        "cash",
        "check",
        "credit_card",
        "bank_transfer",
        "other"
      ),
      allowNull: false,
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vendorContact: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    taxDeductible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    taxCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Receipt",
    tableName: "receipts",
    timestamps: true,
    indexes: [
      {
        fields: ["propertyId"],
      },
      {
        fields: ["tenantId"],
      },
      {
        fields: ["category"],
      },
      {
        fields: ["status"],
      },
      {
        unique: true,
        fields: ["receiptNumber"],
      },
    ],
  }
);

export default Receipt;
