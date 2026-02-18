

// import React, { createContext, useContext, useState, useEffect } from "react";
// import JwtUtil from "../services/JwtUtil";
// import axios from "axios";
// import { toast } from "react-toastify";


// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const TOKEN_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

//   // Initialize login state from localStorage
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     const token = localStorage.getItem("authToken");
//     return !!token && !JwtUtil.isTokenExpired(token);
//   });

//   /** --- Core helpers --- */
//   const getAuthToken = () => localStorage.getItem("authToken");

//   const clearSession = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("userType");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("profilePicture");
//     localStorage.removeItem("hasShownQuizPopup");
//     setIsLoggedIn(false);
//   };

//   /** --- Auth actions --- */
//   const login = (token) => {
//     if (token && !JwtUtil.isTokenExpired(token)) {
//       localStorage.setItem("authToken", token);
//       setIsLoggedIn(true);
//       window.dispatchEvent(new Event("authChange"));
//       return true;
//     }
//     setIsLoggedIn(false);
//     return false;
//   };



//   const logout = async () => {
//     const token = getAuthToken();
//     const email = JwtUtil.extractEmail(token);

//     // Dispatch authChange event before any cleanup to allow RatingSystem to submit cached ratings
//     window.dispatchEvent(new Event("authChange"));

//     if (token && email) {
//       try {
//         await axios.post(
//           `${API_BASE}/auth/logout`,
//           { email },
//           { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//         );
//         toast.success("Logout successful");
//       } catch (err) {
//         const msg = err.response?.data?.message || "Failed to logout";
//         console.error(msg);
//         toast.error(msg);
//       }
//     } else {
//       toast.error("Missing user email or token. Session cleared.");
//     }

//     // Clear session after submission
//     clearSession();
//     setIsLoggedIn(false);
//     setHasShownQuizPopup(false);
//     setShowQuizModal(false);
//     setProfileImage(profile); // Assuming 'profile' is a default image
//   };
//   /** --- Token monitoring --- */
//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = getAuthToken();
//       if (token && JwtUtil.isTokenExpired(token)) {
//         toast.error("Session expired. Please log in again.");
//         logout();
//       } else if (token && !isLoggedIn) {
//         setIsLoggedIn(true);
//       }
//     };

//     checkTokenExpiration();
//     const interval = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
//     return () => clearInterval(interval);
//   }, [isLoggedIn]);

//   /** --- Sync across tabs --- */
//   useEffect(() => {
//     const handleStorage = (event) => {
//       if (event.key === "authToken") {
//         const token = getAuthToken();
//         const valid = !!token && !JwtUtil.isTokenExpired(token);
//         setIsLoggedIn(valid);
//       }
//     };
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   /** --- Immediate updates via custom event --- */
//   useEffect(() => {
//     const handleAuthChange = () => {
//       const token = getAuthToken();
//       const valid = !!token && !JwtUtil.isTokenExpired(token);
//       setIsLoggedIn(valid);
//     };
//     window.addEventListener("authChange", handleAuthChange);
//     return () => window.removeEventListener("authChange", handleAuthChange);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout, getAuthToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);








// import React, { createContext, useContext, useState, useEffect } from "react";
// import JwtUtil from "../services/JwtUtil";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   // const TOKEN_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour
//   const TOKEN_CHECK_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours


//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     const token = localStorage.getItem("authToken");
//     return !!token && !JwtUtil.isTokenExpired(token);
//   });

//   // Auto-fetch profile if logged in but data is missing
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     const userId = localStorage.getItem("userId");
//     if (token && !JwtUtil.isTokenExpired(token) && !userId) {
//       login(token);
//     }
//   }, []);
//   const [profileImage, setProfileImage] = useState(() => {
//     return localStorage.getItem("profilePicture") || "/default-profile.png";
//   });

//   const getAuthToken = () => localStorage.getItem("authToken");

//   const clearSession = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userPhone");
//     localStorage.removeItem("userType");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("profilePicture");
//     localStorage.removeItem("hasShownQuizPopup");
//     setIsLoggedIn(false);
//     setProfileImage("/default-profile.png");
//   };

//   const login = async (token) => {
//     if (token && !JwtUtil.isTokenExpired(token)) {
//       localStorage.setItem("authToken", token);
//       setIsLoggedIn(true);
//       window.dispatchEvent(new Event("authChange"));

//       try {
//         const response = await axios.get(`${API_BASE}/auth/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const { id, profilePicture, email, name, phone } = response.data;
//         localStorage.setItem("userId", id);
//         localStorage.setItem("userPhone", phone || "");
//         localStorage.setItem("profilePicture", profilePicture || "/default-profile.png");
//         localStorage.setItem("userEmail", email);
//         localStorage.setItem("userName", name);
//         setProfileImage(profilePicture || "/default-profile.png");
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//         // toast.error("Failed to load user profile.");
//       }
//       return true;
//     }
//     setIsLoggedIn(false);
//     return false;
//   };

//   const logout = async () => {
//     const token = getAuthToken();
//     const email = JwtUtil.extractEmail(token);

//     window.dispatchEvent(new Event("authChange"));

//     if (token && email) {
//       try {
//         await axios.post(
//           `${API_BASE}/auth/logout`,
//           { email },
//           { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//         );
//         toast.success("Logout successful");
//       } catch (err) {
//         const msg = err.response?.data?.message || "Failed to logout";
//         console.error(msg);
//         toast.error(msg);
//       }
//     } else {
//       // toast.error("Missing user email or token. Session cleared.");
//     }

//     clearSession();
//   };

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = getAuthToken();
//       if (token && JwtUtil.isTokenExpired(token)) {
//         toast.warn("Session expired. Please log in again.");
//         logout();
//       } else if (token && !isLoggedIn) {
//         setIsLoggedIn(true);
//       }
//     };

//     checkTokenExpiration();
//     const interval = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
//     return () => clearInterval(interval);
//   }, [isLoggedIn]);

//   useEffect(() => {
//     const handleStorage = (event) => {
//       if (event.key === "authToken") {
//         const token = getAuthToken();
//         const valid = !!token && !JwtUtil.isTokenExpired(token);
//         setIsLoggedIn(valid);
//       } else if (event.key === "profilePicture") {
//         setProfileImage(event.newValue || "/default-profile.png");
//       }
//     };
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   useEffect(() => {
//     const handleAuthChange = () => {
//       const token = getAuthToken();
//       const valid = !!token && !JwtUtil.isTokenExpired(token);
//       setIsLoggedIn(valid);
//     };
//     window.addEventListener("authChange", handleAuthChange);
//     return () => window.removeEventListener("authChange", handleAuthChange);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout, getAuthToken, profileImage }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




import React, { createContext, useContext, useState, useEffect } from "react";
import JwtUtil from "../services/JwtUtil";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  // const TOKEN_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour
  const TOKEN_CHECK_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours


  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("authToken");
    return !!token && !JwtUtil.isTokenExpired(token);
  });

  // Auto-fetch profile if logged in but data is missing
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (token && !JwtUtil.isTokenExpired(token) && !userId) {
      login(token);
    }
  }, []);
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem("profilePicture") || "/default-profile.png";
  });
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem("userPhone") || "");

  const getAuthToken = () => localStorage.getItem("authToken");

  const clearSession = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("profilePicture");
    localStorage.removeItem("hasShownQuizPopup");
    setIsLoggedIn(false);
    setUserId(null);
    setUserPhone("");
    setProfileImage("/default-profile.png");
  };

  const login = async (token) => {
    if (token && !JwtUtil.isTokenExpired(token)) {
      localStorage.setItem("authToken", token);
      setIsLoggedIn(true);
      window.dispatchEvent(new Event("authChange"));

      try {
        const response = await axios.get(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { id, profilePicture, email, name, phone } = response.data;
        localStorage.setItem("userId", id);
        localStorage.setItem("userPhone", phone || "");
        localStorage.setItem("profilePicture", profilePicture || "/default-profile.png");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);

        setUserId(id);
        setUserPhone(phone || "");
        setProfileImage(profilePicture || "/default-profile.png");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
      return true;
    }
    setIsLoggedIn(false);
    return false;
  };

  const logout = async () => {
    const token = getAuthToken();
    const email = JwtUtil.extractEmail(token);

    window.dispatchEvent(new Event("authChange"));

    if (token && email) {
      try {
        await axios.post(
          `${API_BASE}/auth/logout`,
          { email },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        toast.success("Logout successful");
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to logout";
        console.error(msg);
        toast.error(msg);
      }
    }

    clearSession();
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = getAuthToken();
      if (token && JwtUtil.isTokenExpired(token)) {
        toast.warn("Session expired. Please log in again.");
        logout();
      } else if (token && !isLoggedIn) {
        setIsLoggedIn(true);
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "authToken") {
        const token = getAuthToken();
        const valid = !!token && !JwtUtil.isTokenExpired(token);
        setIsLoggedIn(valid);
      } else if (event.key === "profilePicture") {
        setProfileImage(event.newValue || "/default-profile.png");
      } else if (event.key === "userId") {
        setUserId(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const token = getAuthToken();
      const valid = !!token && !JwtUtil.isTokenExpired(token);
      setIsLoggedIn(valid);
      setUserId(localStorage.getItem("userId"));
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAuthenticated: isLoggedIn, login, logout, getAuthToken, profileImage, userId, userPhone }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);