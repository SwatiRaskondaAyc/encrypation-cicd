// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil'; // Import the JwtUtil file
// import toast from 'react-hot-toast';

// function Username({ userType }) {
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');
//       console.log("Token:", token);

//       if (!token) {
//         toast.success('Unauthorized. Please login.');
//         navigate('/');
//         return;
//       }

//       // Extract the email from the JWT token
//       const email = JwtUtil.extractEmail(token);
//       console.log("Extracted email from token:", email);

//       if (!email) {
//         setError("Email is required to fetch profile data.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const apiUrl = `/api/Userprofile/${email}`;

//         const response = await axios.get(`http://localhost:8080${apiUrl}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         setProfileData(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch profile data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userType, navigate]);

 

//   if (loading) return <p>please login </p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div>
//       {profileData && (
//         <div>
//           <p> {profileData.fullname || profileData.fullName}</p>
         
//         </div>
//       )}
//     </div>
//   );
// }

// export default Username;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil'; // Import the JwtUtil file
// import toast from 'react-hot-toast';

// function Username({ userType, setFullName }) {
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');
//       console.log('Token:', token);

//       if (!token) {
//         toast.error('Unauthorized. Please login.');
//         navigate('/');
//         return;
//       }

//       // Extract the email from the JWT token
//       const email = JwtUtil.extractEmail(token);
//       console.log('Extracted email from token:', email);

//       if (!email) {
//         setError('Email is required to fetch profile data.');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Determine the appropriate API endpoint based on userType
//         const apiUrl =
//           userType === 'corporate'
//             ? `/api/corporate/${email}`
//             : `/api/Userprofile/${email}`;

//         const response = await axios.get(`http://localhost:8080${apiUrl}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         const name =
//         userType === 'corporate'
//           ? response.data.employeeName
//           : response.data.fullname || response.data.fullName;

//           setFullName(name);

//         } catch (err) {
//           setError('Failed to fetch name');
//         } finally {
//           setLoading(false);
//         }
//       };

//     fetchProfile();
//   }, [userType, setFullName]);

//   if (loading) return <p>please Login..!!</p>;
//   if (error) return <p>Error: {error}</p>;

//   return null;
//   // (
//     // <div>
//     //   {profileData && (
//     //     <div>
//     //       <p>{profileData.fullname || profileData.fullName}</p>
//     //     </div>
//     //   )}
//     // </div>
// //     <div>
// //   {profileData && (
// //     <div>
// //       {userType === 'individual' && <p>Full Name: {profileData.fullname || profileData.fullName}</p>}
// //       {userType === 'corporate' && <p>Employee Name: {profileData.employeeName}</p>}
// //     </div>
// //   )}
// // </div>

//   // );
// }

// export default Username;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil'; // Import the JwtUtil file
// import toast from 'react-hot-toast';

// function Username({ userType }) {
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // Username.defaultProps = {
//   //   userType: 'corporate', // Default to individual user
//   // };
  

//   useEffect(() => {

//     console.log("User Type:", userType);


//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');
//       console.log("Token:", token);

//       // if (!token) {
//       //   toast.error('Unauthorized. Please login.');
//       //   navigate('/');
//       //   return;
//       // }

//       // Extract the email from the JWT token
//       const email = JwtUtil.extractEmail(token);
//       console.log("Extracted email from token:", email);

//       if (!email) {
//         setError("Email is required to fetch profile data.");
//         setLoading(false);
//         return;
//       }

//       try {
//         // Determine the API URL based on userType
//         const apiUrl =
//           userType === 'corporate'
//             ? `/api/corporate/${email}`
//             : `/api/Userprofile/${email}`;

//         const response = await axios.get(`${API_BASE}${apiUrl}`, { 
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         setProfileData(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch profile data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userType, navigate]);
//   // const fetchProfile = async () => {
//   //   const token = localStorage.getItem('authToken');
  
//   //   if (JwtUtil.isTokenExpired(token)) {
//   //     console.error("Token is expired.");
//   //     localStorage.removeItem('authToken');
//   //     setError("Session expired. Please log in again.");
//   //     navigate('/');
//   //     return;
//   //   }
  
//   //   let email;
//   //   try {
//   //     email = JwtUtil.extractEmail(token);
//   //     console.log("Extracted email from token:", email);
//   //   } catch (error) {
//   //     console.error("Error decoding token:", error);
//   //     setError("Invalid session. Please log in again.");
//   //     navigate('/');
//   //     return;
//   //   }
  
//   //   if (!email) {
//   //     setError("Failed to extract email from token.");
//   //     return;
//   //   }
  
//   //   try {
//   //     const apiUrl = userType === 'corporate'
//   //       ? `/api/corporate/${email}`
//   //       : `/api/Userprofile/${email}`;
  
//   //     const response = await axios.get(`${API_BASE}${apiUrl}`, {
//   //       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//   //     });
  
//   //     setProfileData(response.data);
//   //     setLoading(false);
//   //   } catch (err) {
//   //     setError(err.response?.data?.message || 'Failed to fetch profile data');
//   //     setLoading(false);
//   //   }
//   // };
  

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     alert('Logged out successfully');
//     navigate('/');
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className='text-black  dark:bg-slate-800 dark:text-white'>
//       {userType !== 'corporate' && profileData && (
//         <div>
//           <p className='text-2xl'>{profileData.fullname || profileData.fullName}</p>
         
//         </div>
//       )}

//       {userType === 'corporate' && profileData && (
//         <div>
//           <p className='text-2xl'> {profileData.employeeName}</p>
         
//         </div>
//       )}
//     </div>
//   );
// }

// export default Username;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JwtUtil from '../services/JwtUtil'; // Import the JwtUtil file
import toast from 'react-hot-toast';

function Username({ userType }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`; // Correct way in Vite


  // Username.defaultProps = {
  //   userType: 'corporate', // Default to individual user
  // };
  

  useEffect(() => {

    console.log("User Type:", userType);


    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      // console.log("Token:", token);

      // if (!token) {
      //   toast.error('Unauthorized. Please login.');
      //   navigate('/');
      //   return;
      // }

      // Extract the email from the JWT token
      const email = JwtUtil.extractEmail(token);
      // console.log("Extracted email from token:", email);

      if (!email) {
        setError("Email is required.");
        setLoading(false);
        return;
      }

      try {
        // Determine the API URL based on userType
        const apiUrl =
          userType === 'corporate'
            ? `/corporate/${email}`
            : `/Userprofile/${email}`;

        // const response = await axios.get(`http://localhost:8080${apiUrl}`, {
          // const response = await axios.get(`http://192.168.1.250:8080/CMDA-3.3.9${apiUrl}`, { 
            // const response = await axios.get(`http://192.168.1.250:8080${apiUrl}`, { 
            const response = await axios.get(`${API_BASE}${apiUrl}`, {  
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    alert('Logged out successfully');
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p> {error}</p>;

  return (
    <div className='text-black  dark:text-white'>
      {userType !== 'corporate' && profileData && (
        <div>
          <p className='text-black dark:text-white'>{profileData.fullname || profileData.fullName}</p>
         
        </div>
      )}

      {userType === 'corporate' && profileData && (
        <div>
          <p className='text-black dark:text-white'> {profileData.employeeName}</p>
         
        </div>
      )}
    </div>
  );
}

export default Username;




