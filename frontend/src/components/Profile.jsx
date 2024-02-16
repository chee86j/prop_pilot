/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const Profile = ({ auth }) => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    first_name: "",
    last_name: "",
  });
  const [editing, setEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    email: "",
    first_name: "",
    last_name: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Ensure that auth.user is defined before setting user details
    if (auth && auth.user) {
      setUserDetails({
        email: auth.user.email || "",
        first_name: auth.user.first_name || "",
        last_name: auth.user.last_name || "",
      });
      setEditedDetails({
        email: auth.user.email || "",
        first_name: auth.user.first_name || "",
        last_name: auth.user.last_name || "",
      });
    }
  }, [auth]);

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(editedDetails),
      });
      const data = await response.json();
      if (response.ok) {
        setUserDetails(editedDetails);
        setEditing(false);
      } else {
        setErrorMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating profile");
    }
  };

  const handleChange = (e) => {
    setEditedDetails({ ...editedDetails, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white/30 backdrop-blur-lg rounded-xl shadow-lg p-6 md:p-8 border border-gray-200/50 max-w-full md:max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">Profile</h1>
        {editing ? (
          <form>
            {/* Input Fields */}
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editedDetails.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={editedDetails.first_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={editedDetails.last_name}
                onChange={handleChange}
              />
            </div>
            {errorMessage && <div>{errorMessage}</div>}
            {/* Save Button */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          // Displaying User Details
          <>
            <p className="text-md mb-2">
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>First Name: {userDetails.first_name}</p>
            <p>Last Name: {userDetails.last_name}</p>

            {/* Edit Button */}
            <div className="text-center mt-6">
              <button
                onClick={handleEdit}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
