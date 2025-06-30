// Email validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
export function validatePassword(password) {
  // At least 8 characters long
  // Contains at least one number
  // Contains at least one uppercase letter
  // Contains at least one special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return passwordRegex.test(password);
}

// Property validation
export const validatePropertyData = (data) => {
  if (!data.address) {
    return "Address is required";
  }
  if (!data.propertyType) {
    return "Property type is required";
  }
  if (!data.purchaseCost || isNaN(data.purchaseCost)) {
    return "Valid purchase cost is required";
  }
  return null;
};

// Phase validation
export const validatePhaseData = (data) => {
  if (!data.propertyId) {
    return "Property ID is required";
  }
  if (!data.name) {
    return "Phase name is required";
  }
  if (!data.startDate) {
    return "Start date is required";
  }
  if (
    data.completionPercentage !== undefined &&
    (isNaN(data.completionPercentage) ||
      data.completionPercentage < 0 ||
      data.completionPercentage > 100)
  ) {
    return "Completion percentage must be between 0 and 100";
  }
  return null;
};

// Tenant validation
export const validateTenantData = (data) => {
  if (!data.propertyId) {
    return "Property ID is required";
  }
  if (!data.firstName) {
    return "First name is required";
  }
  if (!data.lastName) {
    return "Last name is required";
  }
  if (!data.email) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Invalid email format";
  }
  if (!data.phone) {
    return "Phone number is required";
  }
  return null;
};

// Lease validation
export const validateLeaseData = (data) => {
  if (!data.propertyId) {
    return "Property ID is required";
  }
  if (!data.tenantId) {
    return "Tenant ID is required";
  }
  if (!data.startDate) {
    return "Start date is required";
  }
  if (!data.endDate) {
    return "End date is required";
  }
  if (new Date(data.startDate) >= new Date(data.endDate)) {
    return "End date must be after start date";
  }
  if (!data.monthlyRent || isNaN(data.monthlyRent) || data.monthlyRent <= 0) {
    return "Valid monthly rent amount is required";
  }
  if (
    !data.securityDeposit ||
    isNaN(data.securityDeposit) ||
    data.securityDeposit < 0
  ) {
    return "Valid security deposit amount is required";
  }
  return null;
};

// Maintenance request validation
export const validateMaintenanceRequestData = (data) => {
  if (!data.propertyId) {
    return "Property ID is required";
  }
  if (!data.title) {
    return "Title is required";
  }
  if (!data.description) {
    return "Description is required";
  }
  if (
    data.priority &&
    !["low", "medium", "high", "urgent"].includes(data.priority)
  ) {
    return "Invalid priority level";
  }
  if (
    data.estimatedCost &&
    (isNaN(data.estimatedCost) || data.estimatedCost < 0)
  ) {
    return "Estimated cost must be a positive number";
  }
  return null;
};

// Construction draw validation
export const validateConstructionDrawData = (data) => {
  if (!data.propertyId) {
    return "Property ID is required";
  }
  if (!data.drawNumber || isNaN(data.drawNumber) || data.drawNumber <= 0) {
    return "Valid draw number is required";
  }
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    return "Valid amount is required";
  }
  if (!data.description) {
    return "Description is required";
  }
  return null;
};

// Receipt validation
export const validateReceiptData = (data) => {
  if (!data.propertyId) {
    return "Property ID is required";
  }
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    return "Valid amount is required";
  }
  if (!data.category) {
    return "Category is required";
  }
  if (
    !data.paymentMethod ||
    !["cash", "check", "credit_card", "bank_transfer", "other"].includes(
      data.paymentMethod
    )
  ) {
    return "Valid payment method is required";
  }
  if (!data.receiptNumber) {
    return "Receipt number is required";
  }
  return null;
};
