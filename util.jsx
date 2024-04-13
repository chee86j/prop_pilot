export const emailValidator = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const passwordValidator = (password) => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[0-9a-zA-Z\W_]{8,}$/;
  return re.test(password);
};

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
