/*
 * Property-related utilities
 * Contains functions for managing properties, their details and phases
 */
import { toast } from "react-toastify";

/**
 * Exports property data to a CSV file
 * @param {Array} properties - Array of property objects to export
 * @param {string} filename - Name of the output file (defaults to 'properties.csv')
 */
export const exportToCSV = (properties, filename = "properties.csv") => {
  if (!properties || properties.length === 0) {
    toast.error("No properties to export");
    return;
  }

  try {
    // Get headers from the first property object
    const headers = Object.keys(properties[0]);

    // Create CSV header row
    const csvHeader = headers.join(",");

    // Create CSV content with data rows
    const csvContent = properties
      .map((property) => {
        return headers
          .map((header) => {
            const value = property[header];
            // Handle null/undefined values and comma-containing values
            if (value == null) return "";
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`;
            }
            return String(value);
          })
          .join(",");
      })
      .join("\n");

    // Combine header and content
    const csv = `${csvHeader}\n${csvContent}`;

    // Create a Blob with the CSV content
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Set up the download link
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    // Add to DOM, trigger click to download, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Successfully exported to ${filename}`);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    toast.error("Failed to export properties to CSV");
  }
};

/**
 * Saves property changes to the server
 * @param {Object} details - Property details to save
 * @param {string} propertyId - ID of the property being edited
 * @param {Function} setIsEditing - Function to update editing state
 * @param {Function} setPropertyDetails - Function to update property details
 * @returns {Promise<boolean>} - Success status
 */
export const savePropertyChanges = async (
  details,
  propertyId,
  setIsEditing,
  setPropertyDetails
) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/properties/${propertyId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(details),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save changes");
    }

    // Update the UI with the saved details
    setPropertyDetails(details);
    setIsEditing(false);

    toast.success("Changes saved successfully!", {
      position: "bottom-center",
      autoClose: 3000,
    });

    return true;
  } catch (error) {
    console.error("Error saving changes:", error);
    toast.error(error.message || "Failed to save changes");
    return false;
  }
};

/**
 * Updates or adds a phase for a property
 * @param {Object} formData - Phase data to save
 * @param {string} propertyId - ID of the property
 * @param {Function} setPhases - Function to update phases state
 * @param {Function} setIsEditing - Function to update editing state
 * @param {Function} setIsAddingPhase - Function to update adding phase state
 * @param {Function} setEditedDetails - Function to update edited details
 * @returns {Promise<boolean>} - Success status
 */
export const savePhase = async (
  formData,
  propertyId,
  setPhases,
  setIsEditing,
  setIsAddingPhase,
  setEditedDetails
) => {
  const phaseData = {
    ...formData,
    property_id: propertyId,
  };

  try {
    const response = await fetch(
      phaseData.id
        ? `http://localhost:5000/api/phases/${phaseData.id}`
        : "http://localhost:5000/api/phases",
      {
        method: phaseData.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(phaseData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error saving phase");
    }

    // Get the updated phase data from the response
    const savedPhase = await response.json();

    // Update the phases state
    setPhases((currentPhases) =>
      phaseData.id
        ? currentPhases.map((phase) =>
            phase.id === phaseData.id ? savedPhase : phase
          )
        : [...currentPhases, savedPhase]
    );

    // Reset form state
    setIsEditing(false);
    setIsAddingPhase(false);
    setEditedDetails({});
    toast.success("Phase saved successfully!");
    return true;
  } catch (error) {
    console.error("Error:", error);
    toast.error(error.message || "Failed to save phase.");
    return false;
  }
};

/**
 * Filters properties based on search criteria
 * @param {Array} properties - List of properties
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered properties
 */
export const filterProperties = (properties, filters) => {
  if (!properties || !filters) return properties || [];

  return properties.filter((property) => {
    // Price range filter
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;

    // Status filter
    if (
      filters.status &&
      filters.status !== "all" &&
      property.status !== filters.status
    )
      return false;

    // Search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const searchableFields = [
        property.address,
        property.city,
        property.state,
        property.zipcode,
        property.description,
      ]
        .filter(Boolean)
        .map((field) => field.toLowerCase());

      if (!searchableFields.some((field) => field.includes(term))) return false;
    }

    return true;
  });
};

/**
 * Gets property data and related entities from the API
 * @param {string} propertyId - Property ID to fetch
 * @returns {Promise<Object>} - Property data
 */
export const getPropertyData = async (propertyId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/properties/${propertyId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch property data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching property data:", error);
    throw error;
  }
};
