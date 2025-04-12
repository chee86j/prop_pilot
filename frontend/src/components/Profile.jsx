import { useState, useEffect } from "react";
import { fetchUserProfile } from "../utils/user";
import { emailValidator, passwordValidator } from "../utils/validation";
import {
  Eye,
  EyeOff,
  UserCircle,
  Save,
  XCircle,
  Edit2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import AvatarUpload from "./AvatarUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'password'
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        await fetchUserProfile(setUserDetails);
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error("Profile loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
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
    setErrorMessage("");

    // Validate email first
    if (!emailValidator(userDetails.email)) {
      setErrorMessage("Invalid email format.");
      toast.error("Invalid email format");
      return;
    }

    try {
      setIsLoading(true);
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
        toast.success("Profile updated successfully");
      } else {
        setErrorMessage(data.message || "Update failed.");
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("An error occurred while updating the profile.");
      toast.error("An error occurred while updating the profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Validate passwords
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setErrorMessage("New passwords do not match.");
      toast.error("New passwords do not match");
      return;
    }
    if (!passwordValidator(passwords.newPassword)) {
      setErrorMessage("New password does not meet requirements.");
      toast.error(
        "Password must contain at least one symbol, number, uppercase letter, lowercase letter, and be 8+ characters"
      );
      return;
    }

    try {
      setIsLoading(true);
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
        toast.success("Password updated successfully");
      } else {
        setErrorMessage(data.message || "Password update failed.");
        toast.error(data.message || "Password update failed");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("An error occurred while updating the password.");
      toast.error("An error occurred while updating the password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAvatarChange = (avatarData) => {
    setUserDetails({ ...userDetails, avatar: avatarData });
  };

  // Loading skeleton for profile
  const ProfileSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <ToastContainer position="bottom-center" />

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200/50 w-full max-w-md transform transition-all duration-300">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
              <User className="text-green-500" size={24} />
              <span>
                <span className="italic text-green-500">
                  {`${userDetails.first_name || "Your"}'s `}
                </span>
                Account
              </span>
            </h1>

            {editing ? (
              <div className="space-y-4">
                {/* Tabs for Profile and Password sections */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === "profile"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    Profile Details
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === "password"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("password")}
                  >
                    Change Password
                  </button>
                </div>

                {activeTab === "profile" ? (
                  <>
                    <div className="mb-6 flex justify-center">
                      <AvatarUpload
                        currentAvatar={userDetails.avatar}
                        onAvatarChange={handleAvatarChange}
                      />
                    </div>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <input
                          className="input bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-lg px-4 py-3 pl-10 w-full transition-all duration-200"
                          type="email"
                          name="email"
                          value={userDetails.email || ""}
                          onChange={handleChange}
                          disabled
                          placeholder="Email"
                          aria-label="Email"
                        />
                        {userDetails.email && (
                          <label className="form-label text-xs absolute top-0 left-10 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                            Email
                          </label>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-gray-400" />
                        </div>
                        <input
                          className="input bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-lg px-4 py-3 pl-10 w-full transition-all duration-200"
                          type="text"
                          name="first_name"
                          value={userDetails.first_name || ""}
                          onChange={handleChange}
                          placeholder="First Name"
                          aria-label="First Name"
                        />
                        {userDetails.first_name && (
                          <label className="form-label text-xs absolute top-0 left-10 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                            First Name
                          </label>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-gray-400" />
                        </div>
                        <input
                          className="input bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-lg px-4 py-3 pl-10 w-full transition-all duration-200"
                          type="text"
                          name="last_name"
                          value={userDetails.last_name || ""}
                          onChange={handleChange}
                          placeholder="Last Name"
                          aria-label="Last Name"
                        />
                        {userDetails.last_name && (
                          <label className="form-label text-xs absolute top-0 left-10 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                            Last Name
                          </label>
                        )}
                      </div>

                      {errorMessage && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700 text-sm">
                          {errorMessage}
                        </div>
                      )}

                      <div className="flex space-x-3 pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-4 rounded-lg shadow hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Save size={18} /> Save
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg shadow hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <XCircle size={18} /> Cancel
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <form onSubmit={handleSavePassword} className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        className="input bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-lg px-4 py-3 pl-10 w-full pr-10 transition-all duration-200"
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        placeholder="Current Password"
                        aria-label="Current Password"
                      />
                      {passwords.currentPassword && (
                        <label className="form-label text-xs absolute top-0 left-10 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                          Current Password
                        </label>
                      )}
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        role="button"
                        tabIndex={0}
                      >
                        {showPassword ? (
                          <EyeOff
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            size={18}
                          />
                        ) : (
                          <Eye
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            size={18}
                          />
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        className="input bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-lg px-4 py-3 pl-10 w-full pr-10 transition-all duration-200"
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        placeholder="New Password"
                        aria-label="New Password"
                      />
                      {passwords.newPassword && (
                        <label className="form-label text-xs absolute top-0 left-10 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                          New Password
                        </label>
                      )}
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        role="button"
                        tabIndex={0}
                      >
                        {showPassword ? (
                          <EyeOff
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            size={18}
                          />
                        ) : (
                          <Eye
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            size={18}
                          />
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        className="input bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-lg px-4 py-3 pl-10 w-full pr-10 transition-all duration-200"
                        type={showPassword ? "text" : "password"}
                        name="confirmNewPassword"
                        value={passwords.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="Confirm New Password"
                        aria-label="Confirm New Password"
                      />
                      {passwords.confirmNewPassword && (
                        <label className="form-label text-xs absolute top-0 left-10 pointer-events-none transition-all duration-300 ease-in-out text-gray-500">
                          Confirm New Password
                        </label>
                      )}
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        role="button"
                        tabIndex={0}
                      >
                        {showPassword ? (
                          <EyeOff
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            size={18}
                          />
                        ) : (
                          <Eye
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            size={18}
                          />
                        )}
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700 text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-2 mb-4">
                      Password must contain at least one symbol, one number, one
                      uppercase letter, one lowercase letter, and be at least 8
                      characters long.
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Save size={18} /> Update Password
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg shadow hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} /> Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <>
                <div className="mb-8 flex justify-center">
                  <div
                    className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner border-4 border-white"
                    role="img"
                    aria-label={
                      userDetails.avatar
                        ? `${userDetails.first_name}'s profile picture`
                        : "Default profile picture"
                    }
                  >
                    {userDetails.avatar ? (
                      <img
                        src={userDetails.avatar}
                        alt={`${
                          userDetails.first_name || "User"
                        }'s profile picture`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "";
                          e.target.parentElement.innerHTML =
                            '<svg class="w-20 h-20 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
                        }}
                      />
                    ) : (
                      <UserCircle
                        className="w-20 h-20 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium">{userDetails.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User size={18} className="text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">First Name</div>
                      <div className="font-medium">
                        {userDetails.first_name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User size={18} className="text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Last Name</div>
                      <div className="font-medium">{userDetails.last_name}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-4 rounded-lg shadow hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
