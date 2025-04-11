/**
 * Main index file for utility functions
 * Organizes utility functions by category and re-exports them
 */

// Format-related utilities
export * from "./format";

// Validation-related utilities
export * from "./validation";

// Performance-related utilities
export * from "./performance";

// Property-related utilities
export * from "./property";

// Authentication-related utilities
export { default as AuthManager } from "./auth";

// Logging utilities
export { default as logger } from "./logger";

// Data utilities
export * from "./data";

// User utilities
export * from "./user";
