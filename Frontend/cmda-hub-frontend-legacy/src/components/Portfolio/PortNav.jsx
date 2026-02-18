// import React from 'react'

// const PortNav = () => {
//   return (
//     <div className="navbar bg-base-100">
//   <div className="flex-1">
//   <a className="text-2xl">
//             #CMD<span className="text-yellow-500">A</span>
//           </a>
//   </div>
//   <div className="flex-none">
//     <div className="dropdown dropdown-end">
//       <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
//         <div className="indicator">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//           </svg>
//           <span className="badge badge-sm indicator-item">8</span>
//         </div>
//       </div>
      
//       <div
//         tabIndex={0}
//         className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
//         <div className="card-body">
//           <span className="text-lg font-bold">8 Items</span>
//           <span className="text-info">Subtotal: $999</span>
//           <div className="card-actions">
//             <button className="btn btn-neutral btn-block">View cart</button>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="dropdown dropdown-end">
      
//       <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//       <div className="avatar">
//   <div className="mask mask-hexagon w-12">
//     <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//   </div>
//   </div>
//       </div>
//       <ul
//         tabIndex={0}
//         className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
//         <li>
//           <a href='' className="justify-between">
//             Profile
//             <span className="badge">New</span>
//           </a>
//         </li>
//         <li><a href='/'>Home</a></li>
//         <li><a href='/updateProfile' >Settings</a></li>
//         <li><a>Logout</a></li>
//       </ul>
//     </div>
//   </div>
// </div>
//   )
// }

// export default PortNav


import React, { useEffect, useState } from 'react'
import ProfilePicture from '../ProfilePicture'
import profile from '../../../public/profile.png'
import { Link, useNavigate} from 'react-router-dom'
import { getProfilePicture } from '../../services/api'
import Username from '../Username'




const PortNav = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
    const [userType, setUserType] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [fullName, setFullName] = useState('');
    const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  useEffect(()=>{
     const fetchProfilePicture = async () => {
    const imageUrl = await getProfilePicture();
    if (imageUrl) {
      setProfileImage(imageUrl);
    }
  };

  fetchProfilePicture();
  },[])

  const element = document.documentElement;
  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
    }
  }, [theme]);
  
  const handleLogout = () => {
    // Remove user authentication details from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
  
    // Notify other components that logout has happened
    window.dispatchEvent(new Event("storage"));
  
    // Show success message
    toast.success("Logged out successfully!");
  
    // Redirect to home after a slight delay
    setTimeout(() => {
      navigate("/"); // Redirect to home page
    }, 500);
  };

 useEffect(() => {
    // Fetch userType from localStorage or any other source
    const storedUserType = localStorage.getItem('userType') || 'individual'; // Default to 'individual'
    setUserType(storedUserType);
  }, []);

  
  return (
    <div className="navbar bg-base-100 dark:bg-slate-800 dark:text-white ">
  <div className="flex-1 ">
  <a className="text-2xl dark:bg-slate-800 dark:text-white">
            #CMD<span className="text-yellow-500">A</span>
          </a>
  </div>
  <div className="flex-none dark:bg-slate-800 dark:text-white">
    <div className="dropdown dropdown-end dark:bg-slate-800 dark:text-white">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="badge badge-sm indicator-item dark:bg-slate-800 dark:text-white">8</span>
        </div>
      </div>
      
      <div
        tabIndex={0}
        className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
        <div className="card-body">
          <span className="text-lg font-bold">8 Items</span>
          <span className="text-info">Subtotal: $999</span>
          <div className="card-actions">
            <button className="btn btn-neutral btn-block">View cart</button>
          </div>
        </div>
      </div>
    </div>
    <div className="dropdown dropdown-end dark:bg-slate-800 dark:text-white">
      
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      <div className="avatar">
  <div className="mask mask-hexagon w-10 h-10">
    {profileImage ? (
    <img src={profileImage}
     alt="Profile" />
  ) : (
    <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-700 text-sm text-center">
       <img src={profile} alt="" />
    </div>
  )}
  </div>
  </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          {/* <a href='' className="justify-between"> */}
          <div className="flex items-center justify-between p-4 dark:bg-slate-800 dark:text-white">
      <div className="flex items-center gap-3">
        <div className="avatar online relative w-20 h-20">
          <ProfilePicture/>
        </div>
        {userType && (
          <div className="flex flex-col dark:bg-slate-800 dark:text-white">
            <span className="text-yellow-500 font-bold text-xl">Hi,</span>
            <Username userType={userType} setFullName={setFullName} />
            <span className="text-gray-800 text-4xl font-medium dark:bg-slate-800 dark:text-white">{fullName}</span>
          </div>
        )}
      </div>
  </div>
            
          {/* </a> */}
        </li>
        {/* <li><a href='/'>Home</a></li> */}
        <li><a href='/updateprofile' className=' dark:bg-slate-800 dark:text-white'>Settings</a></li>
        <li><div className="flex flex-row" onClick={handleLogout}>
        {isLoggedIn? (
          <button onClick={handleLogout} className='flex flex-row'>
            <h3 className=' dark:bg-slate-800 dark:text-white hover:transition-all duration-100'>Logout</h3> 
          </button> ):(
        <Link to='/' className="flex flex-row">
        <h3 className=" dark:bg-slate-800 dark:text-white hover:transition-all duration-100">Home</h3>
       </Link>
      )}
        </div>
        </li>
        <li>
        <div className="flex flex-row  dark:bg-slate-800 dark:text-white">
        <h3>Appearance & Themes</h3>
        <div>
  <label className="swap swap-rotate px-1">
 
  <input type="checkbox" className="theme-controller" value="synthwave" />

 
  <svg
    className="swap-off h-8 w-8 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    onClick={()=>setTheme(theme==="light"?"dark":"light")}
  >
    <path
      d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
  </svg>

 
  <svg
    className="swap-on h-8 w-8 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    onClick={()=>setTheme(theme==="light"?"dark":"light")}
    >
    <path
      d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
  </svg>
</label>
  </div>
        </div>
        </li>
      </ul>
    </div>
  </div>
</div>
  )
}

export default PortNav