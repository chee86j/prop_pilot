import sequelize from "./database.js";
import { User, Property, Phase } from "../models/index.js";
import logger from "../utils/logger.js";

const isDev = process.env.NODE_ENV === "development";

async function initializeDatabase() {
  try {
    // Sync all models with the database
    await sequelize.sync({ alter: isDev });
    logger.info("✅ Database synchronized successfully");
  } catch (error) {
    logger.error("❌ Failed to sync database:", error);
    throw error;
  }
}

export default initializeDatabase;
