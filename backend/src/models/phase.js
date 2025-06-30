import { DataTypes } from "sequelize";
import BaseModel from "./base.js";
import sequelize from "../config/database.js";
import logger from "../utils/logger.js";

class Phase extends BaseModel {
  toJSON() {
    const values = super.toJSON();
    return {
      id: values.id,
      property_id: values.property_id,
      name: values.name,
      startDate: values.startDate,
      expectedStartDate: values.expectedStartDate,
      endDate: values.endDate,
      expectedEndDate: values.expectedEndDate,
    };
  }
}

Phase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "properties",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expectedStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expectedEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Phase",
    tableName: "phases",
    hooks: {
      beforeSave: async (phase) => {
        logger.info("Saving phase", {
          id: phase.id,
          property_id: phase.property_id,
          name: phase.name,
        });
      },
    },
  }
);

// Define the association
Phase.associate = (models) => {
  Phase.belongsTo(models.Property, {
    foreignKey: "property_id",
    as: "property",
  });
};

export default Phase;
