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
  return parseFloat(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
