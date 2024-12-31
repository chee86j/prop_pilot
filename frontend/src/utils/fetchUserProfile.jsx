export const fetchUserProfile = async (setUser, setAuth) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("Viewing as Guest. No access token available.");
    if (setAuth) {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
    }
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(
        `User: ${userData.first_name} ${userData.last_name} Logged In`
      );
      if (setUser) {
        setUser(userData);
      }
      if (setAuth) {
        setAuth({
          isAuthenticated: true,
          user: userData,
        });
      }
    } else if (response.status === 401) {
      // Unauthorized
      console.error("Authorization failed. User may need to log in again.");
      localStorage.removeItem("accessToken"); // Clear token if expired or invalid
      if (setAuth) {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
      }
    } else {
      console.error(
        "Failed to fetch user profile with status:",
        response.status
      );
      if (setAuth) {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
      }
    }
  } catch (error) {
    console.error(
      "Network error or CORS issue occurred while fetching user profile:",
      error
    );
    if (setAuth) {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
    }
  }
};
