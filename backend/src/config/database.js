import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_NAME = "prop_pilot",
  DB_USER = "postgres",
  DB_PASSWORD = "postgres",
  DB_HOST = "localhost",
  DB_PORT = 5432,
  NODE_ENV = "development",
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

export default sequelize;
