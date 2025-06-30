import winston from 'winston';
import path from 'path';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

const logEmojis = {
  error: '❌',
  warn: '⚠️',
  info: '📝',
  debug: '🔍',
};

winston.addColors(logColors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    const emoji = logEmojis[level] || '📋';
    return `${timestamp} ${emoji} ${level.toUpperCase()}: ${message}`;
  })
);

const logger = winston.createLogger({
  levels: logLevels,
  format,
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
    }),
  ],
});

// Ensure log directory exists
import { promises as fs } from 'fs';
const logDir = path.join(process.cwd(), 'logs');
fs.mkdir(logDir, { recursive: true }).catch(console.error);

export { logger };
