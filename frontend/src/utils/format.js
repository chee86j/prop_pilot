/**
 * Formatting utilities
 * Contains functions for formatting various data types (currency, percentages, etc.)
 */

/**
 * Format currency for standard display with K and M abbreviations
 * @param {number|string} value - Value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  if (!value || isNaN(value)) return "";
  // Val to number
  const numericValue = parseFloat(value);
  // Thousands range
  if (numericValue >= 1000 && numericValue < 1000000) {
    return `$${(numericValue / 1000).toFixed(0)}K`;
  }
  // Millions range
  if (numericValue >= 1000000) {
    return `$${(numericValue / 1000000).toFixed(2)}M`;
  }
  // Default format
  return numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

/**
 * Format currency with more precision (showing 1 decimal place for thousands)
 * @param {number|string} value - Value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrencyDetailed = (value) => {
  if (!value || isNaN(value)) return "";
  // Val to number
  const numericValue = parseFloat(value);
  // Thousands range
  if (numericValue >= 1000 && numericValue < 1000000) {
    return `$${(numericValue / 1000).toFixed(1)}K`;
  }
  // Default format
  return numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

/**
 * Format currency with full notation (no abbreviations)
 * @param {number|string} value - Value to format
 * @returns {string} - Formatted currency string
 */
export const formatFullCurrency = (value) => {
  if (!value || isNaN(value)) return "";
  // Val to number
  const numericValue = parseFloat(value);
  // Default format
  return numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Format percentage value
 * @param {number|string} value - Value to format as percentage
 * @returns {string} - Formatted percentage string
 */
export const formatPercent = (value) => {
  if (!value && value !== 0) return "";
  return `${parseFloat(value).toFixed(2)}%`;
};

/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString("en-US", { ...defaultOptions, ...options });
};

/**
 * Export data to CSV file
 * @param {string} data - CSV formatted data
 * @param {string} filename - Name for the exported file
 */
export const exportToCSV = (data, filename) => {
  const csvContent = "data:text/csv;charset=utf-8," + data;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
