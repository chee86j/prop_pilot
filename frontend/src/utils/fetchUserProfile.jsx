export const fetchUserProfile = async (setUser, setAuth) => {
  try {
    const response = await fetch("http://localhost:5000/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.ok) {
      const userData = await response.json();
      console.log(`User fetched: ${userData.first_name} ${userData.last_name}`);
      if (setUser) {
        setUser(userData);
      }
      if (setAuth) {
        setAuth({
          isAuthenticated: true,
          user: userData,
        });
      }
    } else {
      console.error("Failed to fetch user profile");
      if (setAuth) {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
      }
    }
  } catch (error) {
    console.error("An error occurred while fetching user profile:", error);
    if (setAuth) {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
    }
  }
};
