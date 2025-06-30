import winston from "winston";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupLogger(name, logFile) {
  // Ensure logs directory exists
  const logDir = path.join(__dirname, "..", "logs");
  fs.mkdirSync(logDir, { recursive: true });

  const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: name },
    transports: [
      // Write all logs to file
      new winston.transports.File({
        filename: path.join(logDir, logFile),
        level: "info",
      }),
      // Write errors to error.log
      new winston.transports.File({
        filename: path.join(logDir, "error.log"),
        level: "error",
      }),
      // Console output for development
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  });

  return logger;
}
