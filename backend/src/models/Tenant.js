import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Tenant extends Model {}

Tenant.init(
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ssn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employmentStatus: {
      type: DataTypes.ENUM(
        "employed",
        "self_employed",
        "unemployed",
        "retired"
      ),
      allowNull: true,
    },
    employer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monthlyIncome: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    creditScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 300,
        max: 850,
      },
    },
    emergencyContact: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        name: "",
        relationship: "",
        phone: "",
        email: "",
      },
    },
    documents: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM("active", "pending", "former", "rejected"),
      defaultValue: "pending",
    },
    moveInDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    moveOutDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    backgroundCheckStatus: {
      type: DataTypes.ENUM("pending", "passed", "failed", "not_required"),
      defaultValue: "pending",
    },
    rentPaymentHistory: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "Tenant",
    tableName: "tenants",
    timestamps: true,
    indexes: [
      {
        fields: ["propertyId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["email"],
      },
    ],
  }
);

// Instance method to mask sensitive data
Tenant.prototype.toJSON = function () {
  const values = { ...this.get() };
  // Mask sensitive data
  if (values.ssn) {
    values.ssn = "XXX-XX-" + values.ssn.slice(-4);
  }
  delete values.creditScore;
  return values;
};

export default Tenant;
