import { Model } from "sequelize";

class BaseModel extends Model {
  static init(attributes, options) {
    return super.init(attributes, {
      ...options,
      underscored: true, // Use snake_case for database columns
      timestamps: true, // Add created_at and updated_at
    });
  }

  // Common model methods can be added here
  toJSON() {
    const values = { ...this.get() };
    // Convert dates to ISO strings
    Object.keys(values).forEach((key) => {
      if (values[key] instanceof Date) {
        values[key] = values[key].toISOString();
      }
    });
    return values;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export default BaseModel;
