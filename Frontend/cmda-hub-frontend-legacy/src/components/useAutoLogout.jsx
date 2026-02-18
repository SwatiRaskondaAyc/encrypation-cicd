import { useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext"; // Adjust based on your context
import JwtUtil from '../services/JwtUtil'; // Client-side JWT utility

// const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000; 
const ONE_DAY = 24 * 60 * 60 * 1000;
const INACTIVITY_TIMEOUT = 2 * ONE_DAY;
const useAutoLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Auth context for logout
  const inactivityTimer = useRef(null);

  // Reset inactivity timer on user activity
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      handleAutoLogout();
    }, INACTIVITY_TIMEOUT);
  };

  // Handle auto-logout
  const handleAutoLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No token found. Logging out.');
      clearLocalStorage();
      return;
    }

    try {
      const response = await axios.post(
        'https://cmda.aycanalytics.com/api/auth/validate-token',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        // Token is still valid, no action needed
        resetInactivityTimer();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired due to inactivity. Please log in again.');
        clearLocalStorage();
      } else {
        toast.error('Error validating session. Logging out.');
        clearLocalStorage();
      }
    }
  };

  // Clear local storage and redirect
  const clearLocalStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    logout(); // Call context logout
    navigate('/');
  };

  // Manual logout handler
  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    let email;
    try {
      email = JwtUtil.extractEmail(token);
    } catch (error) {
      toast.error('Invalid token. Logging out.');
      clearLocalStorage();
      return;
    }

    if (!email) {
      toast.error('Missing user email. Logging out.');
      clearLocalStorage();
      return;
    }

    try {
      const response = await axios.post(
        'https://cmda.aycanalytics.com/api/auth/logout',
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(response.data || 'Logout successful');
      clearLocalStorage();
    } catch (error) {
      toast.error(error.response?.data || 'Logout failed');
      clearLocalStorage();
    }
  };

  // Set up event listeners for user activity
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const handleActivity = () => resetInactivityTimer();

    // Start inactivity timer
    resetInactivityTimer();

    // Add event listeners
    events.forEach((event) => window.addEventListener(event, handleActivity));

    // Periodically validate token (every 30 seconds)
    const tokenValidationInterval = setInterval(async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        clearLocalStorage();
        return;
      }
      try {
        await axios.post(
          'https://cmda.aycanalytics.com/api/auth/validate-token',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          clearLocalStorage();
        }
      }
    }, 30 * 1000); // Check every 30 seconds

    // Cleanup on unmount
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      clearInterval(tokenValidationInterval);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, []);

  return { handleLogout };
};

export default useAutoLogout;