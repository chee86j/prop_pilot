/*
 * User utilities
 * Contains functions for managing user profiles and data
 */
import logger from "./logger";

/**
 * Fetches user profile data from the API
 * @param {string|Function} userIdOrCallback - User ID to fetch or callback function
 * @param {string} [token] - Authentication token (optional if using localStorage)
 * @returns {Promise<Object>} - User profile data
 */
export const fetchUserProfile = async (userIdOrCallback, token = null) => {
  try {
    const authToken = token || localStorage.getItem("accessToken");

    if (!authToken) {
      // Return a default guest profile instead of throwing error
      const guestProfile = {
        first_name: "Guest",
        last_name: "",
        email: "",
        avatar: null,
        isGuest: true,
      };

      if (typeof userIdOrCallback === "function") {
        userIdOrCallback(guestProfile);
      }

      return guestProfile;
    }

    // Determine if first parameter is a callback function
    const isCallback = typeof userIdOrCallback === "function";
    const userId = isCallback ? null : userIdOrCallback;

    logger.info(`🔍 Fetching profile for user ${userId || "current"}`);

    // Fix the URL to avoid 'api/api' duplication
    const endpoint = userId
      ? `http://localhost:5000/api/users/${userId}`
      : `http://localhost:5000/api/profile`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        logger.info("User not authenticated");
        throw new Error("Authentication required");
      }

      const errorData = await response.json();
      logger.error("Failed to fetch user profile", {
        status: response.status,
        error: errorData.error,
      });
      throw new Error(errorData.error || "Failed to fetch user profile");
    }

    const userData = await response.json();
    logger.info("✅ User profile fetched successfully");

    // If callback was provided, invoke it with the user data
    if (isCallback) {
      userIdOrCallback(userData);
    }

    return userData;
  } catch (error) {
    if (error.message !== "Authentication required") {
      logger.error("Error in fetchUserProfile", error);
    }
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

    const endpoint = userId
      ? `http://localhost:5000/api/users/${userId}`
      : `http://localhost:5000/api/profile`;

    const response = await fetch(endpoint, {
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
