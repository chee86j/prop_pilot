import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../utils/fetchUserProfile";
import { emailValidator, passwordValidator } from "../utils/validation";
import { Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile(setUserDetails);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name in passwords) {
      setPasswords({ ...passwords, [name]: value });
    } else {
      setUserDetails({ ...userDetails, [name]: value });
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    // Validate email first
    if (!emailValidator(userDetails.email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(userDetails),
      });
      const data = await response.json();
      if (response.ok) {
        setEditing(false);
        navigate("/profile");
      } else {
        setErrorMessage(data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("An error occurred while updating the profile.");
    }
  };

  const handleSavePassword = async (event) => {
    event.preventDefault();

    // Validate passwords
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }
    if (!passwordValidator(passwords.newPassword)) {
      setErrorMessage("New password does not meet requirements.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile/password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            current_password: passwords.currentPassword,
            new_password: passwords.newPassword,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        navigate("/profile");
      } else {
        setErrorMessage(data.message || "Password update failed.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("An error occurred while updating the password.");
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white/30 backdrop-blur-lg rounded-xl shadow-lg p-6 md:p-8 border border-gray-200/50 max-w-full md:max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">Profile</h1>
        {editing ? (
          <>
            <form onSubmit={handleSaveProfile}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  value={userDetails.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  value={userDetails.last_name}
                  onChange={handleChange}
                />
              </div>
              {errorMessage && <div>{errorMessage}</div>}
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline">
                Save Profile
              </button>
            </form>
            <form onSubmit={handleSavePassword}>
              <div>
                <label>Current Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>New Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Confirm New Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={passwords.confirmNewPassword}
                  onChange={handleChange}
                />
                <span onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
              {errorMessage && <div>{errorMessage}</div>}
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline">
                Save Password
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-md mb-2">
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>First Name: {userDetails.first_name}</p>
            <p>Last Name: {userDetails.last_name}</p>
            <button
              onClick={handleEdit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
