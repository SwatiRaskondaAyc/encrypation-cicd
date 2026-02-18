// export const getUserData = async () => {
//     try {
//       const response = await fetch("/user", {
//         method: "GET",
//         credentials: "include", // Ensures cookies are sent if using sessions
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to fetch user data");
//       }
  
//       const user = await response.json();
//       return user;
//     } catch (error) {
//     //   console.error("Error fetching user data:");
//       return null;
//     }
//   };
  

// src/services/authservice.js
import api from './api';
import toast from 'react-hot-toast';
import { CORPORATE_API_URL, USER_API_URL, ACTIVITY_API_URL } from './api';

export const getUserData = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const getProfilePicture = async () => {
  const userType = localStorage.getItem("userType");
  const API_URL = userType === "corporate" ? CORPORATE_API_URL : USER_API_URL;

  try {
    const response = await api.get(`${API_URL}/profile-picture`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile picture:", error.response?.data || error.message);
    return null;
  }
};

export const uploadProfilePicture = async (file) => {
  if (!file) {
    toast.error("No file selected. Please choose an image.");
    return null;
  }

  const userType = localStorage.getItem("userType");
  const API_URL = userType === "corporate" ? CORPORATE_API_URL : USER_API_URL;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.put(`${API_URL}/upload-profile-picture`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Profile picture updated successfully!");
    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture:", error.response?.data || error.message);
    toast.error("Failed to upload profile picture.");
    return null;
  }
};

export const logActivity = async (activity) => {
  try {
    await api.post(ACTIVITY_API_URL, { activity });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};