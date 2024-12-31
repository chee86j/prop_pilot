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

  const handleCancel = () => {
    setEditing(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white/30 backdrop-blur-lg rounded-xl shadow-lg p-6 md:p-8 border border-gray-200/50 max-w-full md:max-w-md w-full">
        {editing && (
          <button
            onClick={handleCancel}
            type="button"
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        )}
        <h1 className="text-2xl font-semibold text-center mb-6">
          <span className="italic text-green-500">
            {`${userDetails.first_name}'s `}
          </span>
          Account Details
        </h1>
        {editing ? (
          <>
            <form onSubmit={handleSaveProfile}>
              <div className="relative mb-4">
                <input
                  className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full"
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  disabled
                  placeholder="Email"
                />
                {userDetails.email && (
                  <label className="form-label text-xs absolute top-0 left-3 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                    Email
                  </label>
                )}
              </div>
              <div className="relative mb-4">
                <input
                  className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full"
                  type="text"
                  name="first_name"
                  value={userDetails.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                {userDetails.first_name && (
                  <label className="form-label text-xs absolute top-0 left-3 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                    First Name
                  </label>
                )}
              </div>
              <div className="relative mb-4">
                <input
                  className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full"
                  type="text"
                  name="last_name"
                  value={userDetails.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
                {userDetails.last_name && (
                  <label className="form-label text-xs absolute top-0 left-3 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                    Last Name
                  </label>
                )}
              </div>
              {errorMessage && (
                <div className="text-red-500 mt-2">{errorMessage}</div>
              )}
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-6 py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline">
                Save Profile
              </button>
            </form>
            <form onSubmit={handleSavePassword}>
              <div className="relative mb-4">
                <input
                  className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full"
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handleChange}
                  placeholder="Current Password"
                />
                {passwords.currentPassword && (
                  <label className="form-label text-xs absolute top-0 left-3 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                    Current Password
                  </label>
                )}
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-500" />
                  ) : (
                    <Eye className="text-gray-500" />
                  )}
                </div>
              </div>
              <div className="relative mb-4">
                <input
                  className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                />
                {passwords.newPassword && (
                  <label className="form-label text-xs absolute top-0 left-3 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                    New Password
                  </label>
                )}
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-500" />
                  ) : (
                    <Eye className="text-gray-500" />
                  )}
                </div>
              </div>
              <div className="relative mb-4">
                <input
                  className="input border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3 w-full"
                  type={showPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={passwords.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                />
                {passwords.confirmNewPassword && (
                  <label className="form-label text-xs absolute top-0 left-3 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                    Confirm New Password
                  </label>
                )}
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-500" />
                  ) : (
                    <Eye className="text-gray-500" />
                  )}
                </div>
              </div>
              {errorMessage && (
                <div className="text-red-500 mt-2">{errorMessage}</div>
              )}
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
            <p className="text-md mb-2">
              <strong>First Name:</strong> {userDetails.first_name}
            </p>
            <p className="text-md mb-4">
              <strong>Last Name:</strong> {userDetails.last_name}
            </p>
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
