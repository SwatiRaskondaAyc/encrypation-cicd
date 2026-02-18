// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AiFillProfile } from "react-icons/ai";
// import { MdOutlineSettings } from "react-icons/md";
// import { VscAdd } from "react-icons/vsc";
// import { IoMdPersonAdd } from "react-icons/io";
// import jwtDecode from "jwt-decode";
// import Profile from "./Profile";api
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil';
// import UpdateProfile from "./UpdateProfile";
// import UpdateCorporateProfile from "./UpdateCorporateProfile";


// const ProfileDrawer = ({ userType }) => {
//   const [email, setEmail] = useState(null);  // For storing the user's email
//   const [theme, setTheme] = useState("light");
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   // Example function to handle avatar click
//   const handleOnClick = () => {
//     const token = localStorage.getItem("token");  // Assuming you store the JWT in localStorage
//     if (!token) {
//       alert("Please log in first.");
//     } else {
//       // Decode the token and extract user info
//       try {
//         const decodedToken = jwtDecode(token);
//         setEmail(decodedToken.sub);  // Assuming the email is stored in 'sub'
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setEmail(decodedToken.sub);  // Assuming the email is stored in 'sub'
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');
//       console.log("Token:", token);

//       if (!token) {
//         alert('Unauthorized. Please login.');
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
//     localStorage.removeItem('authToken');
//     alert('Logged out successfully');
//     navigate('/');
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (

    
//     <div className="drawer drawer-end ">
//       <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//       <div className="drawer-content">
//         {/* Page content */}
//         <label htmlFor="my-drawer-4" className="drawer-button">
//           <div className="avatar">
//             <div className="mask mask-hexagon w-12">
//               <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//             </div>
//           </div>
//         </label>
//       </div>

//       <div className="drawer-side">
//         <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
//         <ul className="dark:bg-slate-800 dark:text-white menu bg-base-100 text-base-content w-80">
//           {/* Sidebar content */}
//           <div className="flex justify-center items-center m-5">
//             <div className="avatar online">
//               <div className="rounded-full mask mask-hexagon w-12" onClick={handleOnClick}>
//                 <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//               </div>
//             </div>
//           </div>
//           <h4 className="text-center text-2xl">
//             Hi, <span className="text-yellow-500">{email ? email : "Guest"}</span>
//           </h4>
//           <hr />
//           <div className="text-center text-xl">
//             <li>
//               <div className="dark:bg-slate-600 dark:text-white bg-base-200 collapse">
//                 <input type="checkbox" className="peer" />
//                 <div className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//                   <li>
//                     <a>
//                       <AiFillProfile /> View Profile
//                     </a>
                    
//                   </li>
//                 </div>
//                 <div className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content">

//                   <li>
                    
//                     <div>
//                         {profileData && (
//                             <div>
//                             <p>Full Name: {profileData.fullname || profileData.fullName}</p>
//                             <p>Email: {profileData.email}</p>
//                             <button onClick={handleLogout}>Logout</button>
//                             </div>
//                         )}
//                         </div>
//                   </li>
//                 </div>
//               </div>
//               <hr />
//               <div className="dark:bg-slate-600 dark:text-white bg-base-200 collapse">
//                 <input type="checkbox" className="peer" />
//                 <div className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//                   <li>
//                     <a>
//                       <MdOutlineSettings /> Settings
//                     </a>
//                   </li>
//                 </div>
//                 <div className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//                   <li>
//                     <a>
//                       <VscAdd />
//                       <Link to={"/updateProfile"}>Update Profile</Link>
//                     </a>
//                   </li>
//                 </div>
//               </div>

//               <hr />
//               <div className="dark:bg-slate-600 dark:text-white bg-base-200 collapse">
//                 <input type="checkbox" className="peer" />
//                 <div className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//                   <li>
//                     <a>
//                       <IoMdPersonAdd /> Add New Profile
//                     </a>
//                   </li>
//                 </div>
//                 <div className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//                   <li>
//                     <a>
//                       <VscAdd />
//                       <Link to={"/signup"}>New User</Link>
//                     </a>
//                   </li>
//                 </div>
//               </div>
//               <hr />
//               <li>
//                 <div className="flex flex-row">
//                   <h3>Appearance & Themes</h3>
//                   <div>
//                     <label className="swap swap-rotate px-1">
//                       {/* This hidden checkbox controls the state */}
//                       <input type="checkbox" className="theme-controller" value="synthwave" />
//                       {/* Sun icon */}
//                       <svg className="swap-off h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
//                         <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
//                       </svg>
//                       {/* Moon icon */}
//                       <svg className="swap-on h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
//                         <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
//                       </svg>
//                     </label>
//                   </div>
//                 </div>
//               </li>
//               <hr />
//               </li>
//             </div>
//           </ul>
//         </div>
//       </div>
  
//   );
// };

// export default ProfileDrawer;















// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AiFillProfile } from "react-icons/ai";
// import { MdOutlineSettings } from "react-icons/md";
// import { VscAdd } from "react-icons/vsc";
// import { IoMdPersonAdd } from "react-icons/io";
// import jwtDecode from "jwt-decode";
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil';

// const ProfileDrawer = ({ userType }) => {
//   const [email, setEmail] = useState(null);
//   const [theme, setTheme] = useState("light");
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setEmail(decodedToken.sub);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         alert('Unauthorized. Please login.');
//         navigate('/');
//         return;
//       }

//       const email = JwtUtil.extractEmail(token);
//       if (!email) {
//         setError("Email is required to fetch profile data.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`${API_BASE}/api/Userprofile/${email}`, {
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

//    const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('userEmail');
//     setIsLoggedIn(false);
//     navigate('/');
//   };
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="drawer drawer-end">
//       <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//       <div className="drawer-content">
//         <label htmlFor="my-drawer-4" className="drawer-button">
//           <div className="avatar">
//             <div className="mask mask-hexagon w-12">
//               <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//             </div>
//           </div>
//         </label>
//       </div>

//       <div className="drawer-side">
//         <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
//         <ul className="menu w-80 bg-base-100 dark:bg-slate-800 text-base-content dark:text-white">
//           <div className="flex justify-center items-center m-5">
//             <div className="avatar online">
//               <div className="rounded-full mask mask-hexagon w-12">
//                 <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//               </div>
//             </div>
//           </div>

//           <h4 className="text-center text-2xl">
//             Hi, <span className="text-yellow-500">{email || "Guest"}</span>
//           </h4>

//           <hr />

//           {/* View Profile Section */}
//           <li className="dark:bg-slate-600 bg-base-200 collapse">
//             <input type="checkbox" className="peer" />
//             <div className="collapse-title">
//               <AiFillProfile /> View Profile
//             </div>
//             <div className="collapse-content">
//               {profileData && (
//                 <div>
//                   <p>Full Name: {profileData.fullname || profileData.fullName}</p>
//                   <p>Email: {profileData.email}</p>
//                   <button onClick={handleLogout}>Logout</button>
//                 </div>
//               )}
//             </div>
//           </li>

//           <hr />

//           {/* Settings Section */}
//           <li className="dark:bg-slate-600 bg-base-200 collapse">
//             <input type="checkbox" className="peer" />
//             <div className="collapse-title">
//               <MdOutlineSettings /> Settings
//             </div>
//             <div className="collapse-content">
//               <li>
//                 <VscAdd />
//                 <Link to="/updateProfile/*">Update Profile</Link>
//               </li>
//             </div>
//           </li>

//           <hr />

//           {/* New User Section */}
//           <li className="dark:bg-slate-600 bg-base-200 collapse">
//             <input type="checkbox" className="peer" />
//             <div className="collapse-title">
//               <IoMdPersonAdd /> Add New Profile
//             </div>
//             <div className="collapse-content">
//               <li>
//                 <VscAdd />
//                 <Link to="/signup">New User</Link>
//               </li>
//             </div>
//           </li>

//           <hr />

//           {/* Theme Switch */}
//           <li>
//             <div className="flex flex-row justify-between items-center px-4 py-2">
//               <span>Appearance & Themes</span>
//               <label className="swap swap-rotate">
//                 <input
//                   type="checkbox"
//                   className="theme-controller"
//                   value="synthwave"
//                   onChange={() => setTheme(theme === "light" ? "dark" : "light")}
//                 />
//                 <svg className="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path d="M5.64,17...Z" />
//                 </svg>
//                 <svg className="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                   <path d="M21.64,13...Z" />
//                 </svg>
//               </label>
//             </div>
//           </li>

//           <hr />

//           <li>
//             <div className="navbar-end px-1 ml-5">
//           {isLoggedIn ? (
//           <button onClick={handleLogout} className="btn text-xl  text-black mt-2">
//             Logout
//           </button>
//           ) : (
//             <button
//               className=" rounded-md text-xl  duration-300 cursor-pointer mt-2"
//               // onClick={() => document.getElementById("my_modal_3").showModal()}
//               onClick={handleLoginClick}
//             >
            
//               <Login />
//             </button>
           
//           )}
//           </div>
//           </li>
          
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ProfileDrawer;



// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AiFillProfile } from "react-icons/ai";
// import { MdOutlineSettings } from "react-icons/md";
// import { VscAdd } from "react-icons/vsc";
// import { IoMdPersonAdd } from "react-icons/io";
// import jwtDecode from "jwt-decode";
// import axios from 'axios';
// import JwtUtil from '../services/JwtUtil';
// import Login from './Login';

// const ProfileDrawer = ({ userType }) => {
//   const [email, setEmail] = useState(null);
//   const [theme, setTheme] = useState("light");
//   const [profileData, setProfileData] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setEmail(decodedToken.sub);
//         setIsLoggedIn(true);
//       } catch (error) {
//         console.error("Token decoding failed", error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const email = JwtUtil.extractEmail(token);
//       if (!email) {
//         setError("Email is required to fetch profile data.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`${API_BASE}/Userprofile/${email}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setProfileData(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch profile');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userType]);

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     navigate('/');
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     document.documentElement.setAttribute('data-theme', newTheme);
//   };

//   return (
//     <div className="drawer drawer-end z-50">
//       <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//       <div className="drawer-content">
//         <label htmlFor="my-drawer-4" className="drawer-button cursor-pointer">
//           <div className="avatar">
//             <div className="mask mask-hexagon w-10">
//               <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User Avatar" />
//             </div>
//           </div>
//         </label>
//       </div>

//       <div className="drawer-side">
//         <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
//         <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content dark:bg-slate-800">
//           <div className="flex flex-col items-center mb-4">
//             <div className="avatar online mb-2">
//               <div className="mask mask-hexagon w-14">
//                 <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Profile" />
//               </div>
//             </div>
//             <h2 className="text-xl font-semibold">
//               Hello, <span className="text-primary">{email || "Guest"}</span>
//             </h2>
//           </div>

//           <div className="collapse collapse-arrow bg-base-200 dark:bg-slate-700 mb-2">
//             <input type="checkbox" />
//             <div className="collapse-title font-medium flex items-center gap-2">
//               <AiFillProfile /> View Profile
//             </div>
//             <div className="collapse-content">
//               {loading && <p className="text-sm text-gray-500">Loading...</p>}
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               {profileData && (
//                 <div className="text-sm space-y-1">
//                   <p><strong>Name:</strong> {profileData.fullname || profileData.fullName}</p>
//                   <p><strong>Email:</strong> {profileData.email}</p>
//                   <button onClick={handleLogout} className="btn btn-sm btn-error mt-2">Logout</button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="collapse collapse-arrow bg-base-200 dark:bg-slate-700 mb-2">
//             <input type="checkbox" />
//             <div className="collapse-title font-medium flex items-center gap-2">
//               <MdOutlineSettings /> Settings
//             </div>
//             <div className="collapse-content">
//               <Link to="/updateProfile/*" className="btn btn-outline btn-sm w-full mt-1">
//                 <VscAdd className="mr-1" /> Update Profile
//               </Link>
//             </div>
//           </div>

//           <div className="collapse collapse-arrow bg-base-200 dark:bg-slate-700 mb-2">
//             <input type="checkbox" />
//             <div className="collapse-title font-medium flex items-center gap-2">
//               <IoMdPersonAdd /> Add New Profile
//             </div>
//             <div className="collapse-content">
//               <Link to="/signup" className="btn btn-outline btn-sm w-full mt-1">
//                 <VscAdd className="mr-1" /> New User
//               </Link>
//             </div>
//           </div>

//           <div className="flex items-center justify-between bg-base-200 dark:bg-slate-700 p-3 rounded mt-4">
//             <span className="text-sm">Appearance</span>
//             <label className="swap swap-rotate">
//               <input type="checkbox" onChange={toggleTheme} />
//               <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path d="M5.64 17.66A9 9 0 1 1 18.36 6.34..." />
//               </svg>
//               <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path d="M21.64 13.34A9 9 0 0 1 10.66 2.36..." />
//               </svg>
//             </label>
//           </div>

//           {!isLoggedIn && (
//             <div className="mt-4">
//               <Login />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileDrawer;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillProfile } from "react-icons/ai";
import { MdOutlineSettings } from "react-icons/md";
import { VscAdd } from "react-icons/vsc";
import { IoMdPersonAdd } from "react-icons/io";
import jwtDecode from "jwt-decode";
import axios from 'axios';
import JwtUtil from '../services/JwtUtil';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileDrawer = () => {
  const [email, setEmail] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [profileData, setProfileData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const [userType, setUserType] = useState(localStorage.getItem("userType") || "individual");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized. Please login.");
        setIsLoggedIn(false);
        setLoading(false);
        navigate("/");
        return;
      }

      const email = JwtUtil.extractEmail(token);
      if (!email) {
        setError("Invalid token. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userType");
        window.dispatchEvent(new Event("authChange"));
        setIsLoggedIn(false);
        setLoading(false);
        navigate("/");
        return;
      }

      try {
        const apiUrl = userType === "corporate" ? `/corporate/${email}` : `/Userprofile/${email}`;
        const response = await axios.get(`${API_BASE}${apiUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setProfileData(response.data);
        setEmail(email);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    if (userType) {
      fetchProfile();
    }

    const handleAuthChange = () => {
      const token = localStorage.getItem("authToken");
      const storedUserType = localStorage.getItem("userType") || "individual";
      setIsLoggedIn(!!token);
      setUserType(storedUserType);
      setProfileData(null);
      setEmail(null);
      setLoading(true);
      if (token) {
        fetchProfile();
      } else {
        setError("Unauthorized. Please login.");
        navigate("/");
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [userType, navigate]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("profilePicture");
    setIsLoggedIn(false);
    setProfileData(null);
    setEmail(null);
    setUserType("individual");
    window.dispatchEvent(new Event("authChange"));
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  if (!isLoggedIn) {
    return (
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer-4" className="drawer-button cursor-pointer">
            <div className="avatar">
              <div className="mask mask-hexagon w-10">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User Avatar" />
              </div>
            </div>
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content dark:bg-slate-800">
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-xl font-semibold">
                Please <Link to="/" className="text-primary">login</Link> to view your profile
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="drawer drawer-end z-50">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer-4" className="drawer-button cursor-pointer">
          <div className="avatar">
            <div className="mask mask-hexagon w-10">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User Avatar" />
            </div>
          </div>
        </label>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content dark:bg-slate-800">
          <div className="flex flex-col items-center mb-4">
            <div className="avatar online mb-2">
              <div className="mask mask-hexagon w-14">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Profile" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">
              Hello, <span className="text-primary">{email || "Guest"}</span>
            </h2>
          </div>

          <div className="collapse collapse-arrow bg-base-200 dark:bg-slate-700 mb-2">
            <input type="checkbox" />
            <div className="collapse-title font-medium flex items-center gap-2">
              <AiFillProfile /> View Profile
            </div>
            <div className="collapse-content">
              {loading && <p className="text-sm text-gray-500">Loading...</p>}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {profileData && (
                <div className="text-sm space-y-1">
                  {userType === "corporate" ? (
                    <>
                      <p><strong>Employee Name:</strong> {profileData.employeeName}</p>
                      <p><strong>Job Title:</strong> {profileData.jobTitle}</p>
                      <p><strong>Company Name:</strong> {profileData.companyName}</p>
                      <p><strong>Role:</strong> {profileData.role}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Name:</strong> {profileData.fullname || profileData.fullName}</p>
                      <p><strong>Email:</strong> {profileData.email}</p>
                      <p><strong>Contact:</strong> {profileData.mobileNum}</p>
                    </>
                  )}
                  <button onClick={handleLogout} className="btn btn-sm btn-error mt-2 w-full">Logout</button>
                </div>
              )}
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-200 dark:bg-slate-700 mb-2">
            <input type="checkbox" />
            <div className="collapse-title font-medium flex items-center gap-2">
              <MdOutlineSettings /> Settings
            </div>
            <div className="collapse-content">
              <Link
                to={userType === "corporate" ? "/updatecorporateprofile" : "/updateindividualprofile"}
                className="btn btn-outline btn-sm w-full mt-1"
              >
                <VscAdd className="mr-1" /> Update Profile
              </Link>
            </div>
          </div>

          {userType === "corporate" && profileData?.role === "Admin" && (
            <div className="collapse collapse-arrow bg-base-200 dark:bg-slate-700 mb-2">
              <input type="checkbox" />
              <div className="collapse-title font-medium flex items-center gap-2">
                <IoMdPersonAdd /> Add New Profile
              </div>
              <div className="collapse-content">
                <Link to="/signup" className="btn btn-outline btn-sm w-full mt-1">
                  <VscAdd className="mr-1" /> New User
                </Link>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between bg-base-200 dark:bg-slate-700 p-3 rounded mt-4">
            <span className="text-sm">Appearance</span>
            <label className="swap swap-rotate">
              <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
              <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5.64 17.66A9 9 0 1 1 18.36 6.34..." />
              </svg>
              <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.64 13.34A9 9 0 0 1 10.66 2.36..." />
              </svg>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;