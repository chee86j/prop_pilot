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
export function validateProperty(property) {
  const requiredFields = ["address", "purchaseCost", "propertyType"];

  const missingFields = requiredFields.filter((field) => !property[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      errors: missingFields.map((field) => `${field} is required`),
    };
  }

  return { isValid: true };
}

// Tenant validation
export function validateTenant(tenant) {
  const requiredFields = ["firstName", "lastName", "email", "phone"];

  const missingFields = requiredFields.filter((field) => !tenant[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      errors: missingFields.map((field) => `${field} is required`),
    };
  }

  if (!validateEmail(tenant.email)) {
    return {
      isValid: false,
      errors: ["Invalid email format"],
    };
  }

  return { isValid: true };
}

// Lease validation
export function validateLease(lease) {
  const requiredFields = [
    "startDate",
    "endDate",
    "monthlyRent",
    "securityDeposit",
  ];

  const missingFields = requiredFields.filter((field) => !lease[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      errors: missingFields.map((field) => `${field} is required`),
    };
  }

  // Validate dates
  const startDate = new Date(lease.startDate);
  const endDate = new Date(lease.endDate);

  if (endDate <= startDate) {
    return {
      isValid: false,
      errors: ["End date must be after start date"],
    };
  }

  return { isValid: true };
}

// Maintenance request validation
export function validateMaintenanceRequest(request) {
  const requiredFields = ["title", "description", "priority", "propertyId"];

  const missingFields = requiredFields.filter((field) => !request[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      errors: missingFields.map((field) => `${field} is required`),
    };
  }

  const validPriorities = ["low", "medium", "high", "urgent"];
  if (!validPriorities.includes(request.priority.toLowerCase())) {
    return {
      isValid: false,
      errors: ["Invalid priority level"],
    };
  }

  return { isValid: true };
}
