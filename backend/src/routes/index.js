import { Router } from 'express';
import { logger } from '../utils/logger.js';

// Import route handlers here as they are created
// import authRoutes from './auth.js';
// import propertyRoutes from './property.js';
// etc...

const setupRoutes = (app) => {
  const apiRouter = Router();

  // Register routes here as they are created
  // apiRouter.use('/auth', authRoutes);
  // apiRouter.use('/properties', propertyRoutes);
  // etc...

  // Health check endpoint
  apiRouter.get('/health', (req, res) => {
    logger.debug('🏥 Health check requested');
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Register the API router
  app.use('/api', apiRouter);

  // Handle 404 routes
  app.use('*', (req, res) => {
    logger.warn(`⚠️ Route not found: ${req.originalUrl}`);
    res.status(404).json({
      status: 'error',
      message: `Route ${req.originalUrl} not found`,
    });
  });

  logger.info('✅ Routes initialized successfully');
};

export { setupRoutes };
