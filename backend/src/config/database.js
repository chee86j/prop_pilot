import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger.js';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'prop_pilot',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  logging: (msg) => logger.debug(`🔍 ${msg}`),
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export { sequelize };
