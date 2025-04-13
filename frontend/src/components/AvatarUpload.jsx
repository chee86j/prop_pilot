import { useState } from "react";
import PropTypes from "prop-types";
import { UserCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";

const AvatarUpload = ({ currentAvatar, onAvatarChange }) => {
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || "");
  const [error, setError] = useState("");

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 300,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      
      // Convert to base64 instead of blob URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
      });
    } catch (error) {
      console.error("Error during image compression:", error);
      throw new Error("Failed to compress image");
    }
  };

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB max
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload a JPEG, PNG or GIF");
    }
    if (file.size > maxSize) {
      throw new Error("File is too large. Maximum size is 5MB");
    }
  };

  const onFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      validateFile(file);
      setError("");

      const compressedUrl = await compressImage(file);
      setPreviewUrl(compressedUrl);
      onAvatarChange(compressedUrl);
      toast.success("Avatar updated successfully!"); // Success toast
    } catch (err) {
      setError(err.message);
      setPreviewUrl(currentAvatar || "");
      toast.error(`Failed to update avatar: ${err.message}`); // Error toast
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              setError("Failed to load avatar image");
            }}
          />
        ) : (
          <UserCircle className="w-20 h-20 text-gray-400" />
        )}
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={onFileChange}
        className="hidden"
        id="avatar-upload"
      />
      <label
        htmlFor="avatar-upload"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        {previewUrl ? "Change Avatar" : "Choose Avatar"}
      </label>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

AvatarUpload.propTypes = {
  currentAvatar: PropTypes.string,
  onAvatarChange: PropTypes.func.isRequired,
};

export default AvatarUpload;
