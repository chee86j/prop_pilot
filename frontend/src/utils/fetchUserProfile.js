import logger from "./logger";

/**
 * Fetches the current user's profile from the API
 * Can be called with a callback function to set user data or as a promise
 * @param {Function} [setUser] - Optional callback function to update user state
 * @param {Function} [setAuth] - Optional callback function to update auth state
 * @returns {Promise<Object>} - User profile data
 */
export const fetchUserProfile = async (setUser, setAuth) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    logger.error("Viewing as Guest. No access token available.");
    if (setAuth) {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
    }
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const userData = await response.json();
      logger.info(
        `User: ${userData.first_name} ${userData.last_name} Logged In`
      );

      // Handle callback style
      if (typeof setUser === "function") {
        setUser(userData);
      }
      if (typeof setAuth === "function") {
        setAuth({
          isAuthenticated: true,
          user: userData,
        });
      }

      // Return for promise-based usage
      return userData;
    } else if (response.status === 401) {
      // Unauthorized
      logger.error("Authorization failed. User may need to log in again.");
      localStorage.removeItem("accessToken"); // Clear token if expired or invalid
      if (setAuth) {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
      }
      throw new Error("Authorization failed");
    } else {
      logger.error(
        "Failed to fetch user profile with status:",
        response.status
      );
      if (setAuth) {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
      }
      throw new Error(
        `Failed to fetch user profile with status: ${response.status}`
      );
    }
  } catch (error) {
    logger.error("Network error occurred while fetching user profile:", error);
    if (setAuth) {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
    }
    throw error;
  }
};
