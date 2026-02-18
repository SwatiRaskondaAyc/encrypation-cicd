import React, { useState, useEffect } from "react";
import { uploadProfilePicture, getProfilePicture } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePicture = ({ src, className = "", onUpdate }) => {
  const [profileImage, setProfileImage] = useState(src || null);
  const [isLoading, setIsLoading] = useState(false);
  const userType = localStorage.getItem("userType");

  // Update when src prop changes
  useEffect(() => {
    if (src) {
      setProfileImage(src);
    }
  }, [src]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file (PNG, JPG, JPEG, GIF, WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsLoading(true);
    
    try {
      const imageUrl = await uploadProfilePicture(file);
      if (imageUrl) {
        // Add timestamp to prevent caching
        const freshUrl = `${imageUrl}?t=${Date.now()}`;
        setProfileImage(freshUrl);
        
        // Dispatch event to notify Navbar and other components
        window.dispatchEvent(new CustomEvent('profilePictureUpdated', { 
          detail: { imageUrl: freshUrl } 
        }));
        
        toast.success("Profile picture updated successfully!");
        
        // Call onUpdate callback if provided
        if (onUpdate) {
          onUpdate(freshUrl);
        }
      } else {
        toast.error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = null;
    }
  };

  // Default fallback image
  const defaultImage = "/profile.png";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <label 
        htmlFor="profile-upload" 
        className={`cursor-pointer relative ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Click to change profile picture"
      >
        <div className="relative w-full h-full">
          <img
            src={profileImage || defaultImage}
            alt="Profile"
            className="w-full h-full rounded-full border-2 border-gray-300 dark:border-gray-600 hover:opacity-80 transition-all duration-300 object-cover"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          {/* Edit overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
            <svg className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </label>
      <input
        type="file"
        id="profile-upload"
        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />
      {!isLoading && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
          Click to {profileImage ? "change" : "upload"} picture
        </p>
      )}
      {isLoading && (
        <p className="mt-2 text-sm text-sky-500 dark:text-sky-400">
          Uploading...
        </p>
      )}
    </div>
  );
};

export default ProfilePicture;