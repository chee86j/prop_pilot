import { Model, DataTypes } from 'sequelize';
import bcrypt from "bcrypt";
import sequelize from '../config/database.js';
import logger from "../utils/logger.js";

class User extends Model {
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

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

// Instance methods
User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    delete values.verificationToken;
    delete values.resetPasswordToken;
    delete values.resetPasswordExpires;
    return values;
};

export default User;
