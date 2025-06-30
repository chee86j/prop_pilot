import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/property.js';
import financialRoutes from './routes/financial.js';
import tenantRoutes from './routes/tenant.js';
import maintenanceRoutes from './routes/maintenance.js';
import userRoutes from './routes/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Create Express app
const app = express();

// Configure database
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: (msg) => logger.debug(msg)
    }
);

// Test database connection
async function testDbConnection() {
    try {
        await sequelize.authenticate();
        logger.info('✅ Database connection successful!');
        
        // Sync database models
        await sequelize.sync();
        logger.info('✅ Database tables created successfully!');
    } catch (error) {
        logger.error('❌ Database connection failed:', error);
        throw error;
    }
}

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 120
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", "https://accounts.google.com", "https://www.googleapis.com"]
        }
    }
}));

// JWT middleware
app.use((req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
        } catch (error) {
            logger.error('JWT verification failed:', error);
        }
    }
    next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api', propertyRoutes);
app.use('/api', financialRoutes);
app.use('/api', tenantRoutes);
app.use('/api', maintenanceRoutes);
app.use('/api', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Check required environment variables
        const requiredVars = ['JWT_SECRET_KEY'];
        const missingVars = requiredVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
        
        // Test database connection
        await testDbConnection();
        
        // Start server
        app.listen(PORT, () => {
            logger.info(`🚀 Property Pilot API server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export default app; 