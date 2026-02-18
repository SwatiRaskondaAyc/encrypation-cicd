// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil'; // Import the JwtUtil file
// import toast from 'react-hot-toast';

// function Profile({ userType }) {
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

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     alert('Logged out successfully');
//     navigate('/');
//   };

//   if (loading) return <p>Guest</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div>
//       {profileData && (
//         <div>
//           <p>Full Name: {profileData.fullname || profileData.fullName}</p>
//           <p>Email: {profileData.email}</p>
//           <p>contact:{profileData.mobileNum}</p>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil'; // Import the JwtUtil file
// import toast from 'react-hot-toast';

// function Profile() {
//   const [profileData, setProfileData] = useState(null);
//    const [userType, setUserType] = useState('individual');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   Profile.defaultProps = {
//     userType: 'corporate', // Default to individual user
//   };
//    useEffect(() => {
//       // Fetch userType from localStorage or any other source
//       const storedUserType = localStorage.getItem('userType') || 'individual'; // Default to 'individual'
//       setUserType(storedUserType);
//     }, []);

//     // useEffect(() => {
//     //   // Fetch userType from localStorage or any other source
//     //   const storedUserType = localStorage.getItem('userType') || 'corporate'; // Default to 'individual'
//     //   setUserType(storedUserType);
//     // }, []);
  

//   useEffect(() => {

//     console.log("User Type:", userType);


//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');
//       console.log("Token:", token);

//       if (!token) {
//         toast.error('Unauthorized. Please login.');
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
//         // Determine the API URL based on userType
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

//         setProfileData(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch profile data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userType) {
//       fetchProfile();
//     }

//     fetchProfile();
//   }, [userType, navigate]
// );
    

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
//     alert('Logged out successfully');
//     navigate('/');
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className='text-black'>
//       {userType !== 'corporate' && profileData && (
//         <div>
//           <p>Full Name: {profileData.fullname || profileData.fullName}</p>
//           <p>Email: {profileData.email}</p>
//           <p>Contact: {profileData.mobileNum}</p>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       )}

//       {userType === 'corporate' && profileData && (
//         <div>
//           <p>Employee Name: {profileData.employeeName}</p>
//           <p>Job Title: {profileData.jobTitle}</p>
//           <p>Email: {profileData.email}</p>
//           <p>Company Name: {profileData.companyName}</p>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil'; // Import the JwtUtil file
// import toast from 'react-hot-toast';
// import { IoMdPersonAdd } from 'react-icons/io';
// import { VscAdd } from 'react-icons/vsc';
// import Admin from './Admin';

// function Profile() {
//   const [profileData, setProfileData] = useState(null);
//   const [userType, setUserType] = useState(''); // Initialize as an empty string
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     // Fetch userType from localStorage or set to 'individual' by default
//     const storedUserType = localStorage.getItem('userType') || 'individual';
//     setUserType(storedUserType);
//   }, []);

//   useEffect(() => {
//     if (!userType) return; // Avoid running if userType is not set

//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');

//       // if (!token) {
//       //   toast.error('Unauthorized. Please login.');
//       //   navigate('/');
//       //   return;
//       // }

//       const email = JwtUtil.extractEmail(token);

//       if (!email) {
//         setError('Email is required.');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Determine the API URL based on userType
//         const apiUrl =
//           userType === 'corporate'
//             ? `/corporate/${email}`
//             : `/Userprofile/${email}`;

//         const response = await axios.get(`${API_BASE}${apiUrl}`, {
//           // const response = await axios.get(`http://192.168.1.250:8080/CMDA-3.3.9${apiUrl}`, {
//             // const response = await axios.get(`http://192.168.1.250:8080${apiUrl}`, {

//             // const response = await axios.get(`${VITE_URL}${apiUrl}`, {
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

//   const handleLogout = () => {
//     // Remove the user's authentication token and user type from localStorage
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
    
//     // Show the alert using window.alert
//     window.alert('You have logged out successfully!');
    
//     // Optionally, you can use toast as well
//     toast.success('Logged out successfully');
    
//     // Navigate the user back to the home page
//     navigate('/');
//   };
  
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className='text-black'>{error}</p>;

//   return (
//     <div className="text-black">
//       {userType !== 'corporate' && profileData && (
//         <div>
//           <p>Full Name: {profileData.fullname || profileData.fullName}</p>
//           <p>Email: {profileData.email}</p>
//          <p>contact:{profileData.mobileNum}</p>
//          {/* <button className='mt-3 btn btn-block btn-warning flex justify-center ' onClick={handleLogout}>Logout</button> */}
//         </div>
//       )}

//       {userType === 'corporate' && profileData && (
//         <div>
//           <div>
//           <p>Employee Name: {profileData.employeeName}</p>
//           <p>Job Title: {profileData.jobTitle}</p>
//           <p>Email: {profileData.email}</p>
//           <p>Company Name: {profileData.companyName}</p>
//           <p>role:{profileData.role}</p>
//           {/* <button onClick={handleLogout}>Logout</button> */}
//           </div>
          
//           {/* <div>
//             {profileData.role === 'Admin' ? (
//               <div className="dark:bg-slate-600 dark:text-white bg-base-200 collapse">
//                 <input type="checkbox" className="peer" />
                
      
      
//                 <div
//                   className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content"
//                 >
//                   <li>
//                     <a>
//                       <IoMdPersonAdd /> Add New Profile
//                     </a>
//                   </li>
//                 </div>
                
//                 <div
//                   className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content"
               
//                >
//                   <li>
//                     <a>
//                       <VscAdd />
//                       <Link to={'/signup'}>New User</Link>
//                     </a>
//                   </li>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-red-500">
//                 You do not have permission to add new profiles.
//               </p>
//             )}
//           </div> */}

// <div>
//       {profileData.role === 'Admin' ? (
        
//         <div className="m-10 dark:bg-slate-600 dark:text-white  collapse">
//           <Link to='/admin/*' className='flex flex-row '>
//                 <IoMdPersonAdd /> 
//                 Add New Profile
//               </Link>
//         </div>
//       ) : (
//         <p className="text-red-500">
//           You do not have permission to add new profiles.
//         </p>
//       )}
//     </div>

//     {/* <button className='mt-3 btn btn-block btn-warning flex justify-center ' onClick={handleLogout}>Logout</button> */}
//         </div>
        
        
//       )}
//     </div>

    
//   );
// }

// export default Profile;




// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil'; // Import the JwtUtil file
// import toast from 'react-hot-toast';
// import { IoMdPersonAdd } from 'react-icons/io';
// import { VscAdd } from 'react-icons/vsc';
// import Admin from './Admin';

// function Profile() {
//   const [profileData, setProfileData] = useState(null);
//   const [userType, setUserType] = useState(''); // Initialize as an empty string
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     // Fetch userType from localStorage or set to 'individual' by default
//     const storedUserType = localStorage.getItem('userType') || 'individual';
//     setUserType(storedUserType);
//   }, []);

//   useEffect(() => {
//     if (!userType) return; // Avoid running if userType is not set

//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');

//       // if (!token) {
//       //   toast.error('Unauthorized. Please login.');
//       //   navigate('/');
//       //   return;
//       // }

//       const email = JwtUtil.extractEmail(token);

//       if (!email) {
//         setError('Email is required.');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Determine the API URL based on userType
//         const apiUrl =
//           userType === 'corporate'
//             ? `/corporate/${email}`
//             : `/Userprofile/${email}`;

//         const response = await axios.get(`${API_BASE}${apiUrl}`, {
//           // const response = await axios.get(`http://192.168.1.250:8080/CMDA-3.3.9${apiUrl}`, {
//             // const response = await axios.get(`http://192.168.1.250:8080${apiUrl}`, {

//             // const response = await axios.get(`${VITE_URL}${apiUrl}`, {
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

  
//   const handleLogout = () => {
//     // Remove the user's authentication token and user type from localStorage
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
    
//     // Show the alert using window.alert
//     window.alert('You have logged out successfully!');
    
//     // Optionally, you can use toast as well
//     toast.success('Logged out successfully');
    
//     // Navigate the user back to the home page
//     navigate('/');
//   };
  
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className='text-black'>{error}</p>;

//   return (
//     <div className="text-black">
//       {userType !== 'corporate' && profileData && (
//         <div>
//           <p>Full Name: {profileData.fullname || profileData.fullName}</p>
//           <p>Email: {profileData.email}</p>
//          <p>contact:{profileData.mobileNum}</p>
//          {/* <button className='mt-3 btn btn-block btn-warning flex justify-center ' onClick={handleLogout}>Logout</button> */}
//         </div>
//       )}

//       {userType === 'corporate' && profileData && (
//         <div>
//           <div>
//           <p>Employee Name: {profileData.employeeName}</p>
//           <p>Job Title: {profileData.jobTitle}</p>
//           <p>Email: {profileData.email}</p>
//           <p>Company Name: {profileData.companyName}</p>
//           <p>role:{profileData.role}</p>
//           {/* <button onClick={handleLogout}>Logout</button> */}
//           </div>
          
//           {/* <div>
//             {profileData.role === 'Admin' ? (
//               <div className="dark:bg-slate-600 dark:text-white bg-base-200 collapse">
//                 <input type="checkbox" className="peer" />
                
      
      
//                 <div
//                   className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content"
//                 >
//                   <li>
//                     <a>
//                       <IoMdPersonAdd /> Add New Profile
//                     </a>
//                   </li>
//                 </div>
                
//                 <div
//                   className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content"
               
//                >
//                   <li>
//                     <a>
//                       <VscAdd />
//                       <Link to={'/signup'}>New User</Link>
//                     </a>
//                   </li>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-red-500">
//                 You do not have permission to add new profiles.
//               </p>
//             )}
//           </div> */}

// <div>
//       {profileData.role === 'Admin' ? (
        
//         <div className="m-10 dark:bg-slate-600 dark:text-white  collapse">
//           <Link to='/admin/*' className='flex flex-row '>
//                 <IoMdPersonAdd /> 
//                 Add New Profile
//               </Link>
//         </div>
//       ) : (
//         <p className="text-red-500">
//           You do not have permission to add new profiles.
//         </p>
//       )}
//     </div>

//     {/* <button className='mt-3 btn btn-block btn-warning flex justify-center ' onClick={handleLogout}>Logout</button> */}
//         </div>
        
        
//       )}
//     </div>

    
//   );
// }

// export default Profile;



import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JwtUtil from '../services/JwtUtil';
import toast from 'react-hot-toast';
import { IoMdPersonAdd } from 'react-icons/io';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem('userType') || 'individual');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Unauthorized. Please login.');
      setLoading(false);
      navigate('/');
      return;
    }

    const email = JwtUtil.extractEmail(token);
    if (!email) {
      setError('Invalid token. Please login again.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      window.dispatchEvent(new Event('authChange'));
      setLoading(false);
      navigate('/');
      return;
    }

    try {
      const apiUrl = userType === 'corporate' ? `/corporate/${email}` : `/Userprofile/${email}`;
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
  }, [userType, navigate]);

  useEffect(() => {
    if (userType) {
 
      fetchProfile();
    }

    const handleAuthChange = () => {
      const storedUserType = localStorage.getItem('userType') || 'individual';
      if (storedUserType !== userType) {
        setUserType(storedUserType);
      }
      setProfileData(null);
      setLoading(true);
      if (localStorage.getItem('authToken')) {
        fetchProfile();
      } else {
        setError('Unauthorized. Please login.');
        navigate('/');
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [userType, fetchProfile, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('profilePicture');
    window.dispatchEvent(new Event('authChange'));
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (loading) return <p className="text-black dark:text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="text-black dark:text-white">
      {userType !== 'corporate' && profileData && (
        <div className="space-y-2">
          <p><strong>Full Name:</strong> {profileData.fullname || profileData.fullName}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Contact:</strong> {profileData.mobileNum}</p>
         {/* <button
            className="mt-3 btn btn-block btn-warning flex justify-center"
            onClick={handleLogout}
          >
            Logout
          </button>  */}
        </div>
      )}

      {userType === 'corporate' && profileData && (
        <div className="space-y-2">
          <p><strong>Employee Name:</strong> {profileData.employeeName}</p>
          <p><strong>Job Title:</strong> {profileData.jobTitle}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Company Name:</strong> {profileData.companyName}</p>
          <p><strong>Role:</strong> {profileData.role}</p>
          {profileData.role === 'Admin' ? (
            <div className="mt-4">
              <Link
                to="/admin/*"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <IoMdPersonAdd className="text-xl" />
                Add New Profile
              </Link>
            </div>
          ) : (
            <p className="text-red-500">
              You do not have permission to add new profiles.
            </p>
          )}
          {/* <button
            className="mt-3 btn btn-block btn-warning flex justify-center"
            onClick={handleLogout}
          >
            Logout
          </button> */}
        </div>
      )}
    </div>
  );
}

export default Profile;