
// import React, { useEffect, useState } from 'react'
// import { AiFillHome, AiFillProfile } from 'react-icons/ai'
// import { Link, Route, Routes, useNavigate } from 'react-router-dom'
// import { logActivity } from '../services/api';
// import Profile from './Profile';
// import { MdOutlineSettings } from 'react-icons/md';
// import UpdateIndividualProfile from './UpdateIndividualProfile';
// import UpdateCorporateProfile from './UpdateCorporateProfile';
// import Username from './Username';
// import { IoLogOutOutline } from 'react-icons/io5';
// import ProfilePicture from './ProfilePicture';
// import {getProfilePicture } from "../services/api";
// import profile from '../../public/profile.png'


// const HomeNavbar = () => {

//    const [theme, setTheme] = useState(
//     localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
//   );
//     const [userType, setUserType] = useState(null);
//      const [fullName, setFullName] = useState('');
//      const [isLoggedIn, setIsLoggedIn] = useState(false);
    
//      const handleAvatarClick = () => {
//       console.log('Avatar clicked!'); // Add functionality for avatar click if needed
//     };
//      const [profileImage, setProfileImage] = useState(null);
//      useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     setIsLoggedIn(!!token);
//   }, []);

    
  
//     const fetchProfilePicture = async () => {
//       const imageUrl = await getProfilePicture();
//       if (imageUrl) {
//         setProfileImage(imageUrl);
//       }
//     };
//     fetchProfilePicture();

    
//     const element = document.documentElement;
//   useEffect(() => {
//     if (theme === "dark") {
//       element.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//       document.body.classList.add("dark");
//     } else {
//       element.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//       document.body.classList.remove("dark");
//     }
//   }, [theme]);

//    const [sticky, setSticky] = useState(false);
  
//     useEffect(() => {
//       const handleScroll = () => {
//         if (window.scrollY > 0) {
//           setSticky(true);
//         } else {
//           setSticky(false);
//         }
//       };
//       window.addEventListener("scroll", handleScroll);
//       return () => {
//         window.removeEventListener("scroll", handleScroll);
//       };
//     }, []);

// const navigate = useNavigate();

// const handleLogout = () => {
//   // Remove user authentication details from localStorage
//   localStorage.removeItem("authToken");
//   localStorage.removeItem("userType");
//   localStorage.removeItem("userEmail");

//   // Notify other components that logout has happened
//   window.dispatchEvent(new Event("storage"));

//   // Show success message
//   alert("Logged out successfully!");
//   navigate("/");
//   // Redirect to home after a slight delay
//   // setTimeout(() => {
//   //   navigate("/"); 
//   // }, 500);
// };

  


//   useEffect(() => {
//     // Fetch userType from localStorage or any other source
//     const storedUserType = localStorage.getItem('userType') || 'individual'; // Default to 'individual'
//     setUserType(storedUserType);
//   }, []);

//   // Handle navigation click
//   const handleNavClick = async (label) => {
//     await logActivity(`${label} tab clicked`);
//   };
//   return (
    
//     <div  className={`w-full top-0 right-0 left-0 z-50 
//       md:px-9 px-3 dark:bg-slate-800 dark:text-white font-bold
//       ${sticky ? "sticky-navbar shadow-md bg-stone-200" : ""}`}>
//       <div className="navbar bg-base-100 dark:bg-slate-800 dark:text-white">
//   <div className="flex-1">
//   <a className="text-4xl">
//             #CMD<span className="text-cyan-500">A</span>
//           </a>
//   </div>
//   <div className="flex">
//           <div className="dropdown dropdown-end">
//             <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
//               <div className="indicator">
//                 <Link to='/' className="text-2xl"><AiFillHome /></Link>
//               </div>
//             </div>
//           </div>


    
//     <div className="drawer drawer-end ">
//   <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//   <div className="drawer-content ">
//     {/* Page content here */}
//     <label htmlFor="my-drawer-4" className="drawer-button">
//         <div className="avatar">
//   <div className="mask mask-hexagon w-12">
//   {profileImage ? (
//     <img src={profileImage}
//      alt="Profile" />
//   ) : (
//     <div className="flex items-center justify-center w-12 h-12 bg-gray-300 text-gray-700 text-sm text-center">
//        <img src={profile} alt="profile" />
//     </div>
//   )}
//   </div>
// </div></label>
//   </div>
//   <div className="drawer-side">
//   <label
//     htmlFor="my-drawer-4"
//     aria-label="close sidebar"
//     className="drawer-overlay"
//   ></label>
//   <ul className="dark:bg-slate-800 dark:text-white menu bg-base-100 text-base-content w-80">
 

// <div className="flex items-center justify-between p-4 shadow-md bg-white rounded-lg dark:bg-slate-800 dark:text-white">
//       <div className="flex items-center gap-3">
//         <div className="avatar online relative w-20 h-20">
          
//             <ProfilePicture/>
       
//         </div>
//         {userType && (
//           <div className="flex flex-col ">
//             <span className="text-yellow-500 font-bold text-xl">Hi,</span>
//             <Username userType={userType} setFullName={setFullName} />
//             <span className="text-gray-800 text-4xl font-medium">{fullName}</span>
//           </div>
//         )}
//       </div>
//     </div>
     
  
//     <div className="text-center text-xl">
//       <li>
     
//  <div className="dark:bg-slate-600 dark:text-white bg-base-200 collapse">
//       <input type="checkbox" className="peer" />
//       <div
//         className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//         <li>
//           <a>
//             <AiFillProfile/> View Profile
//           </a>
//         </li>
//       </div>
//       <div
//         className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//         <li>
//           <Profile />
//         </li>
//       </div>
//     </div>
// <hr />


// <>
//       <div className="dark:bg-slate-600 dark:text-white bg-base-200 collapse">
//         <input type="checkbox" className="peer" />
//         <div className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//           <li>
//             <a>
//               <MdOutlineSettings /> Settings
//             </a>
//           </li>
//         </div>
//         <div className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//           <li>
//             {userType === "individual" && (
//               <Link to="/updateIndividualProfile">Update Individual Profile</Link>
//             )}
//           </li>
//           <Routes>
//           <Route path="/updateIndividualProfile" element={<UpdateIndividualProfile />} />
//           </Routes>
//           <li>
//             {userType === "corporate" && (
//               <Link to="/updateCorporateProfile">Update Corporate Profile</Link>
//             )}
//           </li>
//           <Routes>
       
//        <Route path="/updateCorporateProfile" element={<UpdateCorporateProfile />} />
//      </Routes>
//         </div>
//       </div>

//       {/* Place Routes Outside */}
   
//     </>
//       <hr />
   
       
//       </li>
      
      
//       <hr />
//       <li>
//         <div className="flex flex-row">
//         <h3>Appearance & Themes</h3>
//         <div>
//   <label className="swap swap-rotate px-1">
 
//   <input type="checkbox" className="theme-controller" value="synthwave" />

 
//   <svg
//     className="swap-off h-8 w-8 fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     onClick={()=>setTheme(theme==="light"?"dark":"light")}
//   >
//     <path
//       d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
//   </svg>

 
//   <svg
//     className="swap-on h-8 w-8 fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     onClick={()=>setTheme(theme==="light"?"dark":"light")}
//     >
//     <path
//       d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
//   </svg>
// </label>
//   </div>
//         </div>
//         </li>
//         <hr />
//         <li>
//         <div className="flex flex-row" onClick={handleLogout}>
//         {isLoggedIn? (
//           <button onClick={handleLogout} className='text-xl flex flex-row'>
//             <h3 className=' hover:text-xl transition-all duration-100'>Logout</h3> 
//           </button> ):(
//         <Link to='/' className="text-xl flex flex-row">
//         <h3 className=" hover:text-xl transition-all duration-100">Go to Home</h3>
//         {/* <IoLogOutOutline className="text-xl text-red-500" /> */}
//         </Link>
//       )}
//         <div>
  
//   </div>
//         </div>
//         </li>
//     </div>
//   </ul>
// </div>




// </div>
//   </div>
// </div>
//     </div>
//   )
// }

// export default HomeNavbar



// import React, { useEffect, useState } from 'react'
// import { AiFillHome, AiFillProfile } from 'react-icons/ai'
// import { Link, Route, Routes, useNavigate } from 'react-router-dom'
// import { logActivity } from '../services/api';
// import Profile from './Profile';
// import { MdOutlineSettings } from 'react-icons/md';
// import UpdateIndividualProfile from './UpdateIndividualProfile';
// import UpdateCorporateProfile from './UpdateCorporateProfile';
// import Username from './Username';
// import { IoLogOutOutline } from 'react-icons/io5';
// import ProfilePicture from './ProfilePicture';
// import {getProfilePicture } from "../services/api";
// import profile from '../../public/profile.png'
// import { MdHome } from "react-icons/md";



// const HomeNavbar = () => {

//    const [theme, setTheme] = useState(
//     localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
//   );
//     const [userType, setUserType] = useState(null);
//      const [fullName, setFullName] = useState('');
//      const [isLoggedIn, setIsLoggedIn] = useState(false);
    
//      const handleAvatarClick = () => {
//       console.log('Avatar clicked!'); // Add functionality for avatar click if needed
//     };
//      const [profileImage, setProfileImage] = useState(null);
//      useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     setIsLoggedIn(!!token);
//   }, []);

    
  
//     const fetchProfilePicture = async () => {
//       const imageUrl = await getProfilePicture();
//       if (imageUrl) {
//         setProfileImage(imageUrl);
//       }
//     };
//     fetchProfilePicture();

    
//     const element = document.documentElement;
//   useEffect(() => {
//     if (theme === "dark") {
//       element.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//       document.body.classList.add("dark");
//     } else {
//       element.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//       document.body.classList.remove("dark");
//     }
//   }, [theme]);

//    const [sticky, setSticky] = useState(false);
  
//     useEffect(() => {
//       const handleScroll = () => {
//         if (window.scrollY > 0) {
//           setSticky(true);
//         } else {
//           setSticky(false);
//         }
//       };
//       window.addEventListener("scroll", handleScroll);
//       return () => {
//         window.removeEventListener("scroll", handleScroll);
//       };
//     }, []);

// const navigate = useNavigate();

// function handleHome()
// {
//   navigate('/');
// }

// const handleLogout = () => {
//   // Remove user authentication details from localStorage
//   localStorage.removeItem("authToken");
//   localStorage.removeItem("userType");
//   localStorage.removeItem("userEmail");

//   // Notify other components that logout has happened
//   window.dispatchEvent(new Event("storage"));

//   // Show success message
//   toast.success("Logged out successfully!");

//   // Redirect to home after a slight delay
//   setTimeout(() => {
//     navigate("/"); // Redirect to home page
//   }, 500);
// };

  


//   useEffect(() => {
//     // Fetch userType from localStorage or any other source
//     const storedUserType = localStorage.getItem('userType') || 'individual'; // Default to 'individual'
//     setUserType(storedUserType);
//   }, []);

//   // Handle navigation click
//   const handleNavClick = async (label) => {
//     await logActivity(`${label} tab clicked`);
//   };
//   return (
    
//     <div  className={`w-full top-0 right-0 left-0 z-50 
//       md:px-9 px-3 dark:bg-slate-800 dark:text-white font-bold
//       ${sticky ? "sticky-navbar shadow-md bg-stone-200" : ""}`}>
//       <div className="navbar bg-base-100 dark:bg-slate-800 dark:text-white">
//   <div className="flex-1">
//   <a className="text-4xl">
//             #CMD<span className="text-cyan-500">A</span>
//           </a>
//   </div>
//   <div className="flex gap-2 ">
//   <div className="ml-8 space-y-6 mt-0">
//             <button onClick={ handleHome} className="text-black text-2xl font-bold px-2 py-3 rounded"> <MdHome /></button>
//             </div>




//     <div className="drawer drawer-end ">
//   <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//   <div className="drawer-content ">
//     {/* Page content here */}
//     <label htmlFor="my-drawer-4" className="drawer-button">
//         <div className="avatar">
//   <div className="mask mask-hexagon w-12">
//   {profileImage ? (
//     <img src={profileImage}
//      alt="Profile" />
//   ) : (
//     <div className="flex items-center justify-center w-12 h-12 bg-gray-300 text-gray-700 text-sm text-center">
//        <img src={profile} alt="profile" />
//     </div>
//   )}
//   </div>
// </div></label>
//   </div>
//   <div className="drawer-side">
//   <label
//     htmlFor="my-drawer-4"
//     aria-label="close sidebar"
//     className="drawer-overlay"
//   ></label>
//   <ul className="dark:bg-slate-800 dark:text-white menu bg-base-100 text-base-content w-80">
 

// <div className="flex items-center justify-between p-4 shadow-md bg-white rounded-lg dark:bg-slate-800 dark:text-white">
//       <div className="flex items-center gap-3">
//         <div className="avatar online relative w-20 h-20">
          
//             <ProfilePicture/>
       
//         </div>
//         {userType && (
//           <div className="flex flex-col ">
//             <span className="text-yellow-500 font-bold text-xl">Hi,</span>
//             <Username userType={userType} setFullName={setFullName} />
//             <span className="text-gray-800 text-4xl font-medium">{fullName}</span>
//           </div>
//         )}
//       </div>
//     </div>
     
  
//     <div className="text-center text-xl">
//       <li>
     
//  <div className="dark:bg-slate-600 dark:text-white bg-base-200 collapse">
//       <input type="checkbox" className="peer" />
//       <div
//         className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//         <li>
//           <a>
//             <AiFillProfile/> View Profile
//           </a>
//         </li>
//       </div>
//       <div
//         className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//         <li>
//           <Profile />
//         </li>
//       </div>
//     </div>
// <hr />


// <>
//       <div className="dark:bg-slate-600 dark:text-white bg-base-200 collapse">
//         <input type="checkbox" className="peer" />
//         <div className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//           <li>
//             <a>
//               <MdOutlineSettings /> Settings
//             </a>
//           </li>
//         </div>
//         <div className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//           <li>
//             {userType === "individual" && (
//               <Link to="/updateIndividualProfile">Update Individual Profile</Link>
//             )}
//           </li>
//           <Routes>
//           <Route path="/updateIndividualProfile" element={<UpdateIndividualProfile />} />
//           </Routes>
//           <li>
//             {userType === "corporate" && (
//               <Link to="/updateCorporateProfile">Update Corporate Profile</Link>
//             )}
//           </li>
//           <Routes>
       
//        <Route path="/updateCorporateProfile" element={<UpdateCorporateProfile />} />
//      </Routes>
//         </div>
//       </div>

//       {/* Place Routes Outside */}
   
//     </>
//       <hr />
   
       
//       </li>
      
      
//       <hr />
//       <li>
//         <div className="flex flex-row">
//         <h3>Appearance & Themes</h3>
//         <div>
//   <label className="swap swap-rotate px-1">
 
//   <input type="checkbox" className="theme-controller" value="synthwave" />

 
//   <svg
//     className="swap-off h-8 w-8 fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     onClick={()=>setTheme(theme==="light"?"dark":"light")}
//   >
//     <path
//       d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
//   </svg>

 
//   <svg
//     className="swap-on h-8 w-8 fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     onClick={()=>setTheme(theme==="light"?"dark":"light")}
//     >
//     <path
//       d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
//   </svg>
// </label>
//   </div>
//         </div>
//         </li>
//         <hr />
//         <li>
//         <div className="flex flex-row" onClick={handleLogout}>
//         {isLoggedIn? (
//           <button onClick={handleLogout} className='text-xl flex flex-row'>
//             <h3 className=' hover:text-xl transition-all duration-100'>Logout</h3> 
//           </button> ):(
//         <Link to='/' className="text-xl flex flex-row">
//         <h3 className=" hover:text-xl transition-all duration-100">Go to Home</h3>
//         {/* <IoLogOutOutline className="text-xl text-red-500" /> */}
//         </Link>
//       )}
//         <div>
  
//   </div>
//         </div>
//         </li>
//     </div>
//   </ul>
// </div>




// </div>
//   </div>
// </div>
//     </div>
//   )
// }

// export default HomeNavbar


//--------------working code-------

// import React, { useEffect, useState } from 'react';
// import { AiFillProfile } from 'react-icons/ai';
// import { Link, useNavigate } from 'react-router-dom';
// import { logActivity, getProfilePicture } from '../services/api';
// import Profile from './Profile';
// import { MdOutlineSettings, MdHome } from 'react-icons/md';
// import UpdateIndividualProfile from './UpdateIndividualProfile';
// import UpdateCorporateProfile from './UpdateCorporateProfile';
// import Username from './Username';
// import { IoLogOutOutline } from 'react-icons/io5';
// import ProfilePicture from './ProfilePicture';
// import toast from 'react-hot-toast';
// import profile from '../../public/profile.png';

// const HomeNavbar = () => {
//   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
//   const [userType, setUserType] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [profileImage, setProfileImage] = useState(null);
//   const [sticky, setSticky] = useState(false);
//   const navigate = useNavigate();

//   function handleHome()
// {
//   navigate('/');
// }

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     setIsLoggedIn(!!token);
//     const storedUserType = localStorage.getItem('userType') || 'individual';
//     setUserType(storedUserType);

//     const fetchProfilePicture = async () => {
//       try {
//         const imageUrl = await getProfilePicture();
//         if (imageUrl) {
//           setProfileImage(imageUrl);
//         }
//       } catch (error) {
//         console.error('Error fetching profile picture:', error);
//       }
//     };
//     fetchProfilePicture();

//     const handleScroll = () => {
//       setSticky(window.scrollY > 0);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const element = document.documentElement;
//     if (theme === 'dark') {
//       element.classList.add('dark');
//       document.body.classList.add('dark');
//     } else {
//       element.classList.remove('dark');
//       document.body.classList.remove('dark');
//     }
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   // const handleHome = () => {
//   //   navigate('/');
//   //   logActivity('Home button clicked');
//   // };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('userEmail');
//     window.dispatchEvent(new Event('storage'));
//     toast.success('Logged out successfully!');
//     setTimeout(() => navigate('/'), 500);
//   };

//   const handleNavClick = async (label) => {
//     await logActivity(`${label} tab clicked`);
//   };

//   return (
//     <nav
//       className={`w-full top-0 z-50 transition-all duration-300 ${
//         sticky
//           ? 'fixed bg-white dark:bg-gray-800 shadow-lg'
//           : 'bg-gray-100 dark:bg-gray-900'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
//               #SMD<span className="text-cyan-500">A</span>
//             </Link>
//           </div>

//           {/* Navigation Items */}
//           <div className="flex items-center space-x-4">
//            {/* <button
//               onClick={handleHome}
//               className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
//               aria-label="Go to Home"
//             >
//               <MdHome className="w-6 h-6" />
//             </button>
// */}


//       <div className="ml-8 space-y-6 mt-0">
//              <button onClick={ handleHome} className="text-black text-2xl font-bold px-2 py-3 rounded dark:text-white"> <MdHome /></button>
//              </div>

             
//             <div className="drawer drawer-end">
//               <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//               <div className="drawer-content">
//                 <label htmlFor="my-drawer-4" className="drawer-button cursor-pointer">
//                   <div className="avatar">
//                     <div className="w-10 rounded-full ring ring-cyan-500 ring-offset-2 ring-offset-base-100">
//                       {profileImage ? (
//                         <img src={profileImage} alt="Profile" />
//                       ) : (
//                         <img src={profile} alt="Default Profile" />
//                       )}
//                     </div>
//                   </div>
//                 </label>
//               </div>

//               {/* Drawer Sidebar */}
//               <div className="drawer-side z-50">
//                 <label
//                   htmlFor="my-drawer-4"
//                   aria-label="Close sidebar"
//                   className="drawer-overlay"
//                 ></label>
//                 <ul className="menu bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-64 min-h-full p-4 space-y-2">
//                   {/* Profile Section */}
//                   <li>
//                     <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
//                       <div className="avatar online">
//                         <div className="w-12 rounded-full">
//                           <ProfilePicture />
//                         </div>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-sm text-yellow-500 font-semibold">Hi,</span>
//                         <Username userType={userType} />
//                       </div>
//                     </div>
//                   </li>

//                   <hr className="border-gray-200 dark:border-gray-600" />

//                   {/* Profile Link */}
//                   <li>
//                     <Link
//                       to="/profile"
//                       onClick={() => handleNavClick('Profile')}
//                       className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
//                     >
//                       <AiFillProfile className="w-5 h-5" />
//                       View Profile
//                     </Link>
//                   </li>

//                   {/* Settings */}
//                   <li>
//                     <div className="collapse">
//                       <input type="checkbox" className="peer" />
//                       <div className="collapse-title flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
//                         <MdOutlineSettings className="w-5 h-5" />
//                         Settings
//                       </div>
//                       <div className="collapse-content">
//                         {userType === 'individual' && (
//                           <Link
//                             to="/updateIndividualProfile"
//                             className="block pl-8 py-2 text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400"
//                             onClick={() => handleNavClick('Update Individual Profile')}
//                           >
//                             Update Individual Profile
//                           </Link>
//                         )}
//                         {userType === 'corporate' && (
//                           <Link
//                             to="/updateCorporateProfile"
//                             className="block pl-8 py-2 text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400"
//                             onClick={() => handleNavClick('Update Corporate Profile')}
//                           >
//                             Update Corporate Profile
//                           </Link>
//                         )}
//                       </div>
//                     </div>
//                   </li>

//                   <hr className="border-gray-200 dark:border-gray-600" />

//                   {/* Theme Toggle */}
//                   <li>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-700 dark:text-gray-200">Theme</span>
//                       <label className="swap swap-rotate">
//                         <input
//                           type="checkbox"
//                           checked={theme === 'dark'}
//                           onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
//                           aria-label="Toggle theme"
//                         />
//                         <svg
//                           className="swap-off fill-current w-6 h-6"
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                         >
//                           <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
//                         </svg>
//                         <svg
//                           className="swap-on fill-current w-6 h-6"
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                         >
//                           <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
//                         </svg>
//                       </label>
//                     </div>
//                   </li>

//                   <hr className="border-gray-200 dark:border-gray-600" />

//                   {/* Logout / Home */}
//                   <li>
//                     {isLoggedIn ? (
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center gap-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-md"
//                       >
//                         <IoLogOutOutline className="w-5 h-5" />
//                         Logout
//                       </button>
//                     ) : (
//                       <Link
//                         to="/"
//                         className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
//                         onClick={() => handleNavClick('Go to Home')}
//                       >
//                         <MdHome className="w-5 h-5" />
//                         Go to Home
//                       </Link>
//                     )}
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default HomeNavbar;




import React, { useEffect, useState } from 'react';
import { AiFillProfile } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { logActivity, getProfilePicture } from '../services/api';
import Profile from './Profile';
import { MdOutlineSettings, MdHome } from 'react-icons/md';
import UpdateIndividualProfile from './UpdateIndividualProfile';
import UpdateCorporateProfile from './UpdateCorporateProfile';
import Username from './Username';
import { IoLogOutOutline } from 'react-icons/io5';
import ProfilePicture from './ProfilePicture';
import toast from 'react-hot-toast';
import profile from '../../public/profile.png';
import { useAuth } from './AuthContext';
// import { MdHome } from "react-icons/md"
import { CiLogout } from "react-icons/ci";
const HomeNavbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  // const [userType, setUserType] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [sticky, setSticky] = useState(false);
  const navigate = useNavigate();
const { isLoggedIn, login, logout } = useAuth();
  // const navigate = useNavigate();
 const [userType, setUserType] = useState(null);
  const [fullName, setFullName] = useState('');
function handleHome()
{
  navigate('/');
}

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') || 'individual';
    setUserType(storedUserType);
    
    const fetchImage = async () => {
      const url = await getProfilePicture();
      if (url) setProfileImage(url);
    };
    fetchImage();
  }, []);  



  useEffect(() => {
    const element = document.documentElement;
    if (theme === 'dark') {
      element.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      element.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // const handleHome = () => {
  //   navigate('/');
  //   logActivity('Home button clicked');
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem('authToken');
  //   localStorage.removeItem('userType');
  //   localStorage.removeItem('userEmail');
  //   window.dispatchEvent(new Event('storage'));
  //   toast.success('Logged out successfully!');
  //   setTimeout(() => navigate('/'), 500);
  // };
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    logout();
    toast.success("Logout successfully!");
    navigate('/');
  };
  const handleNavClick = async (label) => {
    await logActivity(`${label} tab clicked`);
  };

  return (
    <nav
      className={`w-full top-0 z-50 transition-all duration-300 ${
        sticky
          ? 'fixed bg-white dark:bg-gray-800 shadow-lg'
          : 'bg-gray-100 dark:bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
              #SMD<span className="text-cyan-500">A</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
           {/* <button
              onClick={handleHome}
              className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
              aria-label="Go to Home"
            >
              <MdHome className="w-6 h-6" />
            </button>
            
*/}


   <div className="ml-8 space-y-6 mt-0">
             <button onClick={ handleHome} className="text-black text-2xl font-bold px-2 py-3 rounded dark:text-white"> <MdHome /></button>
             </div>
      

              {/* Drawer Sidebar */}
                {isLoggedIn && (
              <div className="drawer drawer-end z-50" id="profile-section">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label htmlFor="my-drawer-4" className="drawer-button cursor-pointer">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full ring ring-gray-300 overflow-hidden">
                        <img src={profileImage || profile} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </label>
                </div>
                <div className="drawer-side ">
                  <label htmlFor="my-drawer-4" className="drawer-overlay bg-black/50 backdrop-blur-sm"></label>
                  <div className="menu w-full dark:bg-slate-800 sm:w-80 min-h-full bg-white p-5 shadow-lg text-white">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-slate-800 dark:to-slate-800 shadow">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full border-2 border-blue-400 overflow-hidden">
                          <ProfilePicture />
                        </div>
                      </div>
                      {userType && (
                        <div className="dark:bg-slate-800">
                          <p className="text-xs text-gray-500">Welcome back,</p>
                          <p className="text-sm font-bold dark:text-white">{fullName}</p>
                          <Username userType={userType} setFullName={setFullName} />
                        </div>
                      )}
                    </div>
                    <div className="mt-6 space-y-4 dark:bg-slate-800">
                      <div className="collapse bg-white rounded-md shadow dark:shadow-white dark:bg-slate-800">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title dark:text-white flex gap-4 text-black text-lg font-medium hover:bg-gray-200 rounded-md p-3">
                          <AiFillProfile className="text-blue-400" />
                          View Profile
                        </div>
                        <div className="collapse-content px-4 pb-3 dark:text-white text-sm">
                          <Profile />
                        </div>
                      </div>
                      <div className="collapse bg-white rounded-md shadow dark:shadow-white dark:bg-slate-800">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-black dark:text-white flex gap-4 text-lg font-medium hover:bg-gray-200 rounded-md p-3">
                          <MdOutlineSettings className="text-blue-400" />
                          Settings
                        </div>
                        <div className="collapse-content px-4 pb-3 text-sm text-black">
                          {userType === "individual" ? (
                            <Link to="/updateindividualprofile" className="block py-1 dark:text-white hover:text-blue-500">
                              Update Profile
                            </Link>
                          ) : (
                            <Link to="/updatecorporateprofile" className="block py-1 dark:text-white hover:text-blue-500">
                              Update Corporate Profile
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="collapse bg-white rounded-md shadow">
                        <div
                          className="collapse-title flex gap-4 text-lg text-black font-medium hover:bg-gray-200 rounded-md p-3 dark:bg-slate-800 dark:text-white cursor-pointer"
                          onClick={logout}
                        >
                          <CiLogout className="text-blue-700 font-bold" />
                          Logout
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
           
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;

