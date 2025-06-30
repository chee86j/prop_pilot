import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import BaseModel from "./base.js";
import sequelize from "../config/database.js";
import logger from "../utils/logger.js";

class User extends BaseModel {
  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  validatePassword(password) {
    if (password.length < 4) {
      throw new Error("Password must be at least 4 characters long");
    }
  }

  async setPassword(password) {
    this.validatePassword(password);
    this.password_hash = await User.hashPassword(password);
  }

  async checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(512),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    last_name: {
      type: DataTypes.STRING(512),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password_hash")) {
          logger.info("Hashing new password for user");
        }
      },
    },
  }
);

export default User;
