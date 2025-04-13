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

/**
 * Persists avatar data properly (converts URLs to base64 data URIs for consistent storage)
 * @param {string} avatarUrl - The avatar URL to persist
 * @returns {Promise<string>} - The persisted avatar URL (base64 or original URL)
 */
export const persistAvatarData = async (avatarUrl) => {
  try {
    if (!avatarUrl) return null;

    // If it's already a data URL, no need to convert
    if (avatarUrl.startsWith('data:')) {
      return avatarUrl;
    }

    // Check for invalid blob URLs that might cause errors
    if (avatarUrl.startsWith('blob:') && !sessionStorage.getItem('avatar_validated')) {
      logger.warn("🚧 Potentially invalid blob URL detected, will convert");
    }

    // For both blob URLs and http(s) URLs (including Google profile pictures),
    // fetch and convert to base64 for consistent storage
    try {
      const response = await fetch(avatarUrl);
      if (!response.ok) {
        logger.error(`❌ Failed to fetch avatar: ${response.status}`);
        throw new Error(`Failed to fetch avatar: ${response.status}`);
      }
      
      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || blob.type || 'image/jpeg';
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          // Ensure we have a proper data URL with content type
          const result = reader.result;
          if (!result.startsWith('data:')) {
            // If somehow the result doesn't have the right format, fix it
            const base64 = result.replace(/^data:.*?;base64,/, '');
            resolve(`data:${contentType};base64,${base64}`);
          } else {
            resolve(result);
          }
        };
        reader.onerror = (error) => {
          logger.error("❌ Error converting to base64", error);
          reject(error);
        };
      });
    } catch (error) {
      // If fetch fails, log and return the original URL as fallback
      logger.error(`❌ Error fetching avatar: ${error.message}`);
      return avatarUrl; // Fallback to original URL
    }
  } catch (error) {
    logger.error("❌ Error persisting avatar data", error);
    return null;
  }
};
