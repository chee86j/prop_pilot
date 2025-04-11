/**
 * User utilities
 * Contains functions for managing user profiles and data
 */
import logger from "./logger";

/**
 * Fetches user profile data from the API
 * @param {string} userId - User ID to fetch
 * @param {string} [token] - Authentication token (optional if using localStorage)
 * @returns {Promise<Object>} - User profile data
 */
export const fetchUserProfile = async (userId, token = null) => {
  try {
    const authToken = token || localStorage.getItem("accessToken");

    if (!authToken) {
      logger.error(
        "❌ Authentication token missing when fetching user profile"
      );
      throw new Error("Authentication required");
    }

    if (!userId) {
      logger.error("❌ User ID missing when fetching user profile");
      throw new Error("User ID is required");
    }

    logger.info(`🔍 Fetching profile for user ${userId}`);

    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error("❌ Failed to fetch user profile", {
        status: response.status,
        error: errorData.error,
      });
      throw new Error(errorData.error || "Failed to fetch user profile");
    }

    const userData = await response.json();
    logger.info("✅ User profile fetched successfully");

    return userData;
  } catch (error) {
    logger.error("❌ Error in fetchUserProfile", error);
    throw error;
  }
};

/**
 * Updates user profile data
 * @param {string} userId - User ID to update
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const authToken = localStorage.getItem("accessToken");

    if (!authToken) {
      logger.error(
        "❌ Authentication token missing when updating user profile"
      );
      throw new Error("Authentication required");
    }

    logger.info(`📝 Updating profile for user ${userId}`);

    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error("❌ Failed to update user profile", {
        status: response.status,
        error: errorData.error,
      });
      throw new Error(errorData.error || "Failed to update user profile");
    }

    const updatedData = await response.json();
    logger.info("✅ User profile updated successfully");

    return updatedData;
  } catch (error) {
    logger.error("❌ Error in updateUserProfile", error);
    throw error;
  }
};

/**
 * Gets the current user's ID from localStorage
 * @returns {string|null} - User ID or null if not found
 */
export const getCurrentUserId = () => {
  try {
    const userData = localStorage.getItem("userData");
    if (!userData) return null;

    const parsedData = JSON.parse(userData);
    return parsedData.id || null;
  } catch (error) {
    logger.error("❌ Error retrieving current user ID", error);
    return null;
  }
};
