/**
 * Logging utility for frontend application
 * Handles logging based on environment and provides consistent formatting
 */

const ENVIRONMENTS = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
};

// Get current environment
const getCurrentEnvironment = () => {
  return import.meta.env.MODE || ENVIRONMENTS.DEVELOPMENT;
};

// Sanitize data for logging
const sanitizeData = (data) => {
  if (!data) return "";

  // Create a copy of the data
  const sanitized = { ...data };

  // Remove sensitive fields
  const sensitiveFields = ["access_token", "credential", "password", "token"];
  sensitiveFields.forEach((field) => {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]";
    }
  });

  return sanitized;
};

const logger = {
  info: (message, data = null) => {
    if (getCurrentEnvironment() === ENVIRONMENTS.DEVELOPMENT) {
      console.info(`ℹ️ ${message}`, data ? sanitizeData(data) : "");
    }
  },

  warn: (message, data = null) => {
    if (getCurrentEnvironment() !== ENVIRONMENTS.PRODUCTION) {
      console.warn(`⚠️ ${message}`, data ? sanitizeData(data) : "");
    }
  },

  error: (message, error = null) => {
    // Always log errors, but sanitize in production
    const errorData =
      getCurrentEnvironment() === ENVIRONMENTS.PRODUCTION
        ? sanitizeData(error)
        : error;

    console.error(`❌ ${message}`, errorData || "");
  },

  debug: (message, data = null) => {
    if (getCurrentEnvironment() === ENVIRONMENTS.DEVELOPMENT) {
      console.debug(`🔍 ${message}`, data ? sanitizeData(data) : "");
    }
  },
};

export default logger;
