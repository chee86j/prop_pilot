import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Lease extends Model {}

Lease.init(
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
      allowNull: false,
      references: {
        model: "tenants",
        key: "id",
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    monthlyRent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    securityDeposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    petDeposit: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("active", "pending", "terminated", "expired"),
      defaultValue: "pending",
    },
    paymentDueDay: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 31,
      },
    },
    lateFeeAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    lateFeeGracePeriod: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    utilities: {
      type: DataTypes.JSON,
      defaultValue: {
        water: false,
        electricity: false,
        gas: false,
        internet: false,
        trash: false,
      },
    },
    petsAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    petDetails: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    renewalOption: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    renewalTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specialConditions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    documents: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    paymentHistory: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    maintenanceRequests: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Lease",
    tableName: "leases",
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
    ],
  }
);

export default Lease;
