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

export const formatFullCurrency = (value) => {
  if (!value || isNaN(value)) return "";
  // Val to number
  const numericValue = parseFloat(value);
  // Default format
  return numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
