import winston from "winston";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const emoji =
      {
        error: "🔥",
        warn: "⚠️",
        info: "ℹ️",
        debug: "🐛",
      }[level] || "📝";

    return JSON.stringify({
      timestamp,
      level,
      emoji,
      message,
      ...meta,
    });
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: join(__dirname, "../../logs/error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: join(__dirname, "../../logs/combined.log"),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
