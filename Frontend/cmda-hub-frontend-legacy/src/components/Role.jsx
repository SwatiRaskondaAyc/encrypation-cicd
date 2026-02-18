import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JwtUtil from '../services/JwtUtil'; // Import the JwtUtil file
import toast from 'react-hot-toast';

function Role({ userType }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      console.log("Token:", token);

      if (!token) {
        toast.success('Unauthorized. Please login.');
        navigate('/');
        return;
      }

      // Extract the email from the JWT token
      const email = JwtUtil.extractEmail(token);
      console.log("Extracted email from token:", email);

      if (!email) {
        setError("Email is required to fetch profile data.");
        setLoading(false);
        return;
      }

      try {
        const apiUrl = `/corporate/${email}`;

        const response = await axios.get(`${API_BASE}${apiUrl}`, {
          // const response = await axios.get(`http://192.168.1.250:8080/CMDA-3.3.9${apiUrl}`, {
            // const response = await axios.get(`http://192.168.1.250:8080${apiUrl}`, {

            // const response = await axios.get(`${VITE_URL}${apiUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setProfileData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userType, navigate]);

 

  if (loading) return <p>please login </p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {profileData && (
        <div>
          <p> {profileData.role || profileData.role}</p>
         
        </div>
      )}
    </div>
  );
}

export default Role;