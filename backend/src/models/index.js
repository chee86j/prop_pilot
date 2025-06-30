import { sequelize } from '../config/database.js';
import { logger } from '../utils/logger.js';

// Import models here as they are created
// import User from './user.js';
// import Property from './property.js';
// etc...

const initializeDatabase = async () => {
  try {
    logger.info('🔄 Initializing database connection...');
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');

    // Sync all models with database
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database models synchronized.');
    }

    // Define model associations here as models are created
    // User.hasMany(Property);
    // Property.belongsTo(User);
    // etc...
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export { initializeDatabase, sequelize };
