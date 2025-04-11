/*
 * Validation utilities
 * Contains functions for validating different types of input
 */

/*
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const emailValidator = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/*
 * Validates a password meets security requirements
 * Must include: at least 8 chars, upper & lowercase letters, number, special char
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets requirements
 */
export const passwordValidator = (password) => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[0-9a-zA-Z\W_]{8,}$/;
  return re.test(password);
};

/*
 * Validates a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone number is valid
 */
export const phoneValidator = (phone) => {
  const re = /^\+?[1-9]\d{9,14}$/;
  return re.test(phone.replace(/\D/g, ""));
};

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is valid
 */
export const urlValidator = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates a property price value
 * @param {number|string} value - Price value to validate
 * @returns {boolean} - True if price is valid
 */
export const priceValidator = (value) => {
  if (!value) return false;
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue > 0;
};

/**
 * Get validation errors for a form
 * @param {Object} data - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} - Validation errors
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.entries(rules).forEach(([field, validators]) => {
    if (!Array.isArray(validators)) {
      validators = [validators];
    }

    for (const validator of validators) {
      if (typeof validator === "function") {
        if (!validator(data[field])) {
          errors[field] = errors[field] || `Invalid ${field}`;
          break;
        }
      } else if (validator.required && !data[field]) {
        errors[field] = validator.message || `${field} is required`;
        break;
      }
    }
  });

  return errors;
};
