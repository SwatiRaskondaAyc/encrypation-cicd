// import React from 'react'
// import Navbar from '../Navbar'
// import Footer from '../Footer'

// const PortDash = () => {
//   return (
//     <div>
//         <Navbar/>
        
//         <section className="m-20">
//           <a className="mt-2 text-2xl">
//             #CMD<span className="text-yellow-500">A</span> <span className="text-yellow-500">DashBoard</span>
//           </a>
//           <h1 className="text-3xl text-center font-bold">
//             <hr />
//             {/* <div className="drawer lg:drawer-open">
//   <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
//   <div className="drawer-content flex flex-col items-center justify-center">
   
//     <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
//       Open drawer
//     </label>
//   </div>
//   <div className="drawer-side">
//     <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
//     <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
   
//       <li><a>Sidebar Item 1</a></li>
//       <li><a>Sidebar Item 2</a></li>
//     </ul>
//   </div>
// </div> */}
              
//             <hr />
//           </h1>
//         </section>
//         <Footer/>
//     </div>
//   )
// }

// export default PortDash


// import Navbar from "../Navbar";
// import PortNav from "../Portfolio/PortNav";
// import PortLandPage from "./PortLandPage";
// import MyPortfolioPage from "./MyPortfolioPage";
// import { RiHome8Fill } from "react-icons/ri";
// import React, { useEffect, useState } from "react";
// import { FaBars, FaSignInAlt, FaUserCircle } from "react-icons/fa";// Importing icons from react-icons
// import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import ProfilePicture from "../ProfilePicture";
// import profile from "../../../public/profile.png";
// import { getProfilePicture } from "../../services/api";
// import Username from "../Username";
// import Login from "../Login";
// import UpdateCorporateProfile from "../UpdateCorporateProfile";
// import UpdateIndividualProfile from "../UpdateIndividualProfile";
// import { MdOutlineSettings } from "react-icons/md";
// import { MdHome } from 'react-icons/md';
// import Home from "../../home/Home";
// import PortfolioReplacement from "./PortfolioReplacement";
// import BuildOwnPort from "./BuildOwnPort";
// import { ToastContainer } from 'react-toastify';
// import { RxDashboard } from "react-icons/rx";

// const PortDash = () => {
//   const [activePage, setActivePage] = useState("");
//  const navigate = useNavigate();
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//  const [profileImage, setProfileImage] = useState(null);
//   const [userType, setUserType] = useState(null);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//  const [fullName, setFullName] = useState('');
//    const location = useLocation(); 
// const [isSidebarOpen, setIsSidebarOpen] = useState(true);



//   const handleHome = () => navigate('/');

//       useEffect(() => {
//     const currentPath = location.pathname.split('/')[1];  // Get the route part after "/"
//     setActivePage(currentPath ? currentPath : 'Home');  // Default to 'Home' if empty
//   }, [location])

//     const fetchProfilePicture = async () => {
//      const imageUrl = await getProfilePicture();
//      if (imageUrl) {
//        setProfileImage(imageUrl);
//      }
//    };
 
//    fetchProfilePicture();


//     const element = document.documentElement;
//    useEffect(() => {
//      if (theme === "dark") {
//        element.classList.add("dark");
//        localStorage.setItem("theme", "dark");
//        document.body.classList.add("dark");
//      } else {
//        element.classList.remove("dark");
//        localStorage.setItem("theme", "light");
//        document.body.classList.remove("dark");
//      }
//    }, [theme]);


//      const handleLoginClick = () => {
//      const modal = document.getElementById("my_modal_3");
//      if (modal) {
//        if (!modal.open) {
//          modal.showModal();
//        } else {
//          // console.warn("Modal is already open.");
//        }
//      } else {
//        // console.error("Modal not found!");
//      }
//    };
   

   
   
//    const handleLogout = () => {
//      localStorage.removeItem('authToken');
//      localStorage.removeItem('userType');
//      localStorage.removeItem('userEmail');
//      setIsLoggedIn(false);
//      navigate('/portDash');
//    };

//      useEffect(() => {
//      // Fetch userType from localStorage or any other source
//      const storedUserType = localStorage.getItem('userType') || 'individual'; // Default to 'individual'
//      setUserType(storedUserType);
//    }, []);

//   const renderContent = () => {
//     switch (activePage) {
      
//       case "portfolio":
//         return <MyPortfolioPage />;
//         case "portfolioReplacement":
//           return <PortfolioReplacement />
//           case "ownportfolio":
//             return <BuildOwnPort />
//       default:
//         return (
//           <div className="">
//           {/* <Navbar/> */}
//           {/* <PortNav/> */}
//           <div>
//             <PortLandPage/>
//           </div>
           
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sticky Sidebar */}
//     <div className={`mt-15 bg-sky-800  shadow-lg min-h-screen p-6 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
//   {/* Toggle button */}
//   <button
//     className="absolute top-4  z-50 bg-white p-2 rounded-md shadow-lg hover:bg-gray-200"
//     onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//   >
//     <FaBars size={20} />
//   </button>
      
//         <div className="flex flex-col space-y-4 ml-5 mt-10">
//            <div className="dropdown dropdown-end  dark:bg-slate-800 dark:text-white">
     
//      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//      <div className="avatar">
       
//  <div className="mask mask-hexagon w-15 h-15 ">
//    {profileImage ? (
//    <img src={profileImage}
//     alt="Profile" />
//  ) : (
//    <div className="sidebar-profile flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-700 text-sm text-center">
//       <img src={profile} alt="" />
//    </div>
//  )}
//  </div>
//  </div>
//      </div>
//      <ul
//        tabIndex={0}
//        className="menu menu-sm dropdown-content bg-gray-500 rounded-box z-[1] mt-3 w-54 p-2 shadow">
//        <li>
//          {/* <a href='' className="justify-between"> */}
//          <div className="flex items-center justify-between p-4 dark:bg-slate-600 dark:text-white">
//      <div className="flex items-center gap-3">
//        <div className="avatar online relative w-20 h-20">
//          <ProfilePicture/>
//        </div>
//        {userType && (
//          <div className="flex flex-col  dark:bg-slate-600 dark:text-white">
//            <span className="text-yellow-500 font-bold text-xl">Hi,</span>
//            <Username userType={userType} setFullName={setFullName} />
//            <span className="text-gray-800 text-xl font-medium dark:bg-slate-600 dark:text-white">{fullName}</span>
//          </div>
//        )}
//      </div>
//  </div>
           
//          {/* </a> */}
//        </li>
//        {/* <li><a href='/'>Home</a></li> */}
//        <div className="dark:bg-slate-600 dark:text-white  collapse">
//                <input type="checkbox" className="peer" />
//                <div className="collapse-title bg-ghost text-gray-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//                  <li>
//                    <a className="text-white settings-link">
//                      <MdOutlineSettings /> Settings
//                    </a>
//                  </li>
//                </div>
//                <div className="collapse-content bg-ghost text-ghost-content peer-checked:bg-ghost peer-checked:text-ghost-content">
//                  <li>
//                    {userType === "individual" && (
//                      <Link to="/updateIndividualProfile" className="text-white ">Update Profile</Link>
//                    )}
//                  </li>
//                  <Routes>
//                  <Route path="/updateIndividualProfile" element={<UpdateIndividualProfile />} />
//                  </Routes>
//                  <li>
//                    {userType === "corporate" && (
//                      <Link to="/updateCorporateProfile" className="text-white">Update Corporate Profile</Link>
//                    )}
//                  </li>
//                  <Routes>
              
//               <Route path="/updateCorporateProfile" element={<UpdateCorporateProfile />} />
//             </Routes>
//                </div>



               
//              </div>



             
//        <li>
//         <div className="flex flex-row" onClick={handleLogout}>
       
//        </div>
//        </li>
//        <li>
//        <div className="flex flex-row  dark:bg-slate-600 dark:text-white theme-switcher">
//        <h3 className="text-white">Appearance & Themes</h3>
//        <div>
//  <label className="swap swap-rotate px-1">

//  <input type="checkbox" className="theme-controller" value="synthwave" />


//  <svg
//    className="swap-off h-8 w-8 fill-current text-black"
//    xmlns="http://www.w3.org/2000/svg"
//    viewBox="0 0 24 24"
//    onClick={()=>setTheme(theme==="light"?"dark":"light")}
//  >
//    <path
//      d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
//  </svg>


//  <svg
//    className="swap-on h-8 w-8 fill-current"
//    xmlns="http://www.w3.org/2000/svg"
//    viewBox="0 0 64 64"
//    onClick={()=>setTheme(theme==="light"?"dark":"light")}
//    >
//    <path
//      d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
//  </svg>
// </label>
//  </div>
//        </div>
//        </li>


       
//      </ul>
   
//    </div>
 
// <div className="mb-10 mt-12 text-white font-bold text-xl text-center whitespace-nowrap overflow-hidden transition-all duration-200">
//     {isSidebarOpen && (
//       <>
//         #CMD<span className="text-yellow-500">A</span>
//         <span className="text-yellow-500"> PortFolio</span>
//       </>
//     )}
//   </div>

//   {/* Sidebar Menu */}
//   <div className="flex flex-col space-y-6 mt-6">
//     <button onClick={handleHome} className="flex items-center gap-3 text-white hover:text-yellow-300 transition">
//       <MdHome size={22} />
//       {isSidebarOpen && <span>Home</span>}
//     </button>

//     <button className="flex items-center gap-3 hover:text-yellow-300 text-white transition" onClick={() => setActivePage("services")}>
//       <RxDashboard size={22} />
//       {isSidebarOpen && <span>Dashboard</span>}
//     </button>

//     <button className="flex items-center gap-3 hover:text-yellow-300 text-white transition" onClick={() => setActivePage("portfolio")}>
//       📁
//       {isSidebarOpen && <span>My Portfolio</span>}
//     </button>

//     <button className="flex items-center gap-3 hover:text-yellow-300  text-white transition" onClick={() => setActivePage("portfolioReplacement")}>
//       🔄
//       {isSidebarOpen && <span>Port Replacement</span>}
//     </button>

//     <button className="flex items-center gap-3 hover:text-yellow-300 text-white transition" onClick={() => setActivePage("ownportfolio")}>
//       🗂️
//       {isSidebarOpen && <span>Own Portfolio</span>}
//     </button>
//   </div>
//             <div className="dropdown dropdown-end dark:bg-slate-800 dark:text-white ">

      
      
//       <div className="navbar-end ml-10 mt-0">
//       <div className="flex justify-center items-center space-y-8 ">
//           {isLoggedIn ? (
//           <button onClick={handleLogout} className="rounded-md btn text-sm hover:bg-yellow-500 text-white  ">
//             Logout
//           </button>
//           ) : (
//             <button
//               className=" rounded-md text-xl   duration-300 cursor-pointer mt-2 "
//               // onClick={() => document.getElementById("my_modal_3").showModal()}
//               onClick={handleLoginClick}
//             >
//             <div className="w-full">  <Login /></div>
             
//             </button>
           
//           )}
//           </div>
//           </div>
//     </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 p-6 bg-white">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default PortDash;


// import React, { useEffect, useState } from "react";
// import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import { MdOutlineSettings, MdHome, MdOutlineCreateNewFolder } from "react-icons/md";
// import { RxDashboard } from "react-icons/rx";
// import { SiPlotly } from "react-icons/si";
// import { GiHamburgerMenu } from "react-icons/gi";
// import PortLandPage from "./PortLandPage";
// import MyPortfolioPage from "./MyPortfolioPage";
// import PortfolioReplacement from "./PortfolioReplacement";
// import BuildOwnPort from "./BuildOwnPort";
// import UpdateCorporateProfile from "../UpdateCorporateProfile";
// import UpdateIndividualProfile from "../UpdateIndividualProfile";
// import ProfilePicture from "../ProfilePicture";
// import Username from "../Username";
// import Login from "../Login";

// import { getProfilePicture } from "../../services/api";
// import profile from "../../../public/profile.png";

// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer } from 'react-toastify';
// import { TbReplace } from "react-icons/tb";

// const PortDash = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [activePage, setActivePage] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [profileImage, setProfileImage] = useState(null);
//   const [userType, setUserType] = useState("individual");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [fullName, setFullName] = useState('');
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   // Set active route
//   useEffect(() => {
//     const currentPath = location.pathname.split('/')[1];
//     setActivePage(currentPath || 'Home');
//   }, [location]);

//   // Fetch profile image
//   useEffect(() => {
//     const fetchProfilePicture = async () => {
//       const imageUrl = await getProfilePicture();
//       if (imageUrl) setProfileImage(imageUrl);
//     };
//     fetchProfilePicture();
//   }, []);

//   // Set theme
//   useEffect(() => {
//     const root = document.documentElement;
//     if (theme === "dark") {
//       root.classList.add("dark");
//       document.body.classList.add("dark");
//     } else {
//       root.classList.remove("dark");
//       document.body.classList.remove("dark");
//     }
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   // Fetch user type
//   useEffect(() => {
//     const storedUserType = localStorage.getItem('userType');
//     setUserType(storedUserType || "individual");
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     navigate('/portDash');
//   };

//   const handleLoginClick = () => {
//     const modal = document.getElementById("my_modal_3");
//     if (modal && !modal.open) modal.showModal();
//   };

//   const renderContent = () => {
//     switch (activePage) {
//       case "portfolio":
//         return <MyPortfolioPage />;
//       case "portfolioReplacement":
//         return <PortfolioReplacement />;
//       case "ownportfolio":
//         return <BuildOwnPort />;
//       default:
//         return <PortLandPage />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      
//       {/* Sidebar */}
// <aside
//   className={`transition-all duration-300 bg-sky-800 dark:bg-gray-800 text-white shadow-lg ${
//     isSidebarOpen ? 'w-64' : 'w-20'
//   } flex flex-col justify-between`}
// >
//   {/* Top section: Logo, Profile, Navigation */}
//   <div>
//     {/* Logo and Toggle */}
//     <div className="flex items-center justify-between px-4 py-4 border-b border-sky-700">
//       <div className="flex items-center space-x-2">
//         <a className="text-xl font-bold text-white whitespace-nowrap">
//           #CMD<span className="text-yellow-400">A</span>
//           {isSidebarOpen && <span className="ml-1 text-yellow-400">PortFolio</span>}
//         </a>
//       </div>
//       <button
//         className="text-white hover:text-yellow-300"
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//       >
//         <GiHamburgerMenu size={22} />
//       </button>
//     </div>

//     {/* Profile Section */}
//     <div className="flex items-center gap-3 px-4 py-6 border-b border-sky-700">
//       <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400">
//         <img src={profileImage || profile} alt="Profile" className="w-full h-full object-cover" />
//       </div>
//       {isSidebarOpen && (
//         <div className="text-sm">
//           <p className="text-yellow-400 font-semibold">Hi,</p>
//           <Username userType={userType} setFullName={setFullName} />
//           <p>{fullName}</p>
//         </div>
//       )}
//     </div>

//     {/* Navigation */}
//     <nav className="flex flex-col gap-4 mt-6 px-4 text-sm font-medium">
//       <SidebarButton icon={<MdHome />} label="Home" isOpen={isSidebarOpen} onClick={() => navigate('/')} />
//       <SidebarButton icon={<RxDashboard />} label="Upload File" isOpen={isSidebarOpen} onClick={() => setActivePage("services")} />
//       <SidebarButton icon={<SiPlotly />} label="My Portfolio" isOpen={isSidebarOpen} onClick={() => setActivePage("portfolio")} />
//       <SidebarButton icon={<TbReplace />} label="Port Replacement" isOpen={isSidebarOpen} onClick={() => setActivePage("portfolioReplacement")} />
//       <SidebarButton icon={<MdOutlineCreateNewFolder />} label="Own Portfolio" isOpen={isSidebarOpen} onClick={() => setActivePage("ownportfolio")} />
//     </nav>
//   </div>

//   {/* Bottom section: Theme Toggle + Auth */}
//   <div>
//     <div className="border-t border-sky-700 px-4 py-4">
//       <button
//         className="flex items-center gap-3 w-full text-white hover:text-yellow-300 transition"
//         onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//       >
//         <MdOutlineSettings size={20} />
//         {isSidebarOpen && <span>Theme: {theme === "light" ? "Light" : "Dark"}</span>}
//       </button>
//     </div>

//     <div className="px-4 pb-6">
//       {isLoggedIn ? (
//         <button
//           onClick={handleLogout}
//           className="w-full text-sm py-2 px-4 rounded-md bg-yellow-500 text-black hover:bg-yellow-400 transition"
//         >
//           Logout
//         </button>
//       ) : (
//         <button
//           onClick={handleLoginClick}
//           className="w-full text-sm py-2 px-4 rounded-md bg-yellow-500 text-black hover:bg-yellow-400 transition"
//         >
//           <Login />
//         </button>
//       )}
//     </div>
//   </div>
// </aside>




//       {/* Main content */}
//       <main className="flex-1 p-6 overflow-auto">
//         {renderContent()}
//       </main>

//       {/* Profile Routes */}
//       <Routes>
//         <Route path="/updateIndividualProfile" element={<UpdateIndividualProfile />} />
//         <Route path="/updateCorporateProfile" element={<UpdateCorporateProfile />} />
//       </Routes>

//       <ToastContainer />
//     </div>
//   );
// };

// // Sidebar Button Component
// const SidebarButton = ({ icon, label, isOpen, onClick }) => (
//   <button onClick={onClick} className="flex items-center gap-3 hover:text-yellow-300 transition w-full">
//     <span>{typeof icon === "string" ? icon : React.cloneElement(icon, { size: 20 })}</span>
//     {isOpen && <span>{label}</span>}
//   </button>
// );

// export default PortDash;












////_________________________________________working code but sidebar n0t______________

// import React, { useEffect, useState } from "react";
// import {
//   Link,
//   Routes,
//   Route,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";
// import {
//   MdOutlineSettings,
//   MdHome,
//   MdOutlineCreateNewFolder,
// } from "react-icons/md";
// import { RxDashboard } from "react-icons/rx";
// import { SiPlotly } from "react-icons/si";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { TbReplace } from "react-icons/tb";
// import PortLandPage from "./PortLandPage";
// import MyPortfolioPage from "./MyPortfolioPage";
// import PortfolioReplacement from "./PortfolioReplacement";
// import BuildOwnPort from "./BuildOwnPort";
// import UpdateCorporateProfile from "../UpdateCorporateProfile";
// import UpdateIndividualProfile from "../UpdateIndividualProfile";
// import ProfilePicture from "../ProfilePicture";
// import Username from "../Username";
// import Login from "../Login";
// import { getProfilePicture } from "../../services/api";
// import profile from "../../../public/profile.png";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaBars } from "react-icons/fa";
// import { FaArrowRightArrowLeft } from "react-icons/fa6";

// const PortDash = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [activePage, setActivePage] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [profileImage, setProfileImage] = useState(null);
//   const [userType, setUserType] = useState("individual");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [fullName, setFullName] = useState("");
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   // Set active route
//   useEffect(() => {
//     const currentPath = location.pathname.split("/")[1];
//     setActivePage(currentPath || "Home");
//   }, [location]);

//   // Fetch profile image
//   useEffect(() => {
//     const fetchProfilePicture = async () => {
//       const imageUrl = await getProfilePicture();
//       if (imageUrl) setProfileImage(imageUrl);
//     };
//     fetchProfilePicture();
//   }, []);

//   // Set theme
//   useEffect(() => {
//     const root = document.documentElement;
//     if (theme === "dark") {
//       root.classList.add("dark");
//       document.body.classList.add("dark");
//     } else {
//       root.classList.remove("dark");
//       document.body.classList.remove("dark");
//     }
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   // Fetch user type
//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     setUserType(storedUserType || "individual");
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     navigate("/portDash");
//   };

//   const handleLoginClick = () => {
//     const modal = document.getElementById("my_modal_3");
//     if (modal && !modal.open) modal.showModal();
//   };

//   const renderContent = () => {
//     switch (activePage) {
//       case "portfolio":
//         return <MyPortfolioPage />;
//       case "portfolioReplacement":
//         return <PortfolioReplacement />;
//       case "ownportfolio":
//         return <BuildOwnPort />;
//       default:
//         return <PortLandPage />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside
//         className={`transition-all duration-300 bg-sky-800 dark:bg-gray-800 text-white shadow-lg ${
//           isSidebarOpen ? "w-64" : "w-20"
//         } flex flex-col justify-between`}
//       >
//         {/* Top section: Logo, Profile, Navigation */}
//         <div>
//           {/* Logo and Toggle */}
//      <div className="relative flex items-center justify-between px-4 py-4 border-b border-sky-700">
//   {/* Logo Section */}
//   <div className="flex items-center space-x-2">
//     <span className="text-xl font-bold text-white whitespace-nowrap">
//       #CMD<span className="text-yellow-400">A</span>
//       {isSidebarOpen && (
//         <span className="ml-1 text-yellow-400">PortFolio</span>
//       )}
//     </span>
//   </div>

//   {/* Floating Hamburger Toggle */}
//   <button
//     className="absolute-right-3 top-4 transform translate-x-full z-50 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-200 transition"
//     onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//     aria-label="Toggle Sidebar"
//   >
//     <FaArrowRightArrowLeft size={20} />
//   </button>
// </div>

//           {/* Profile Section */}
//           <div className="flex items-center gap-3 px-4 py-6 border-b border-sky-700">
//             <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400">
//               <img
//                 src={profileImage || profile}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             {isSidebarOpen && (
//               <div className="text-sm">
//                 <p className="text-yellow-400 font-semibold">Hi,</p>
//                 <Username className='text-white' userType={userType} setFullName={setFullName} />
//                 <p>{fullName}</p>
//               </div>
//             )}
//           </div>

//           {/* Navigation */}
//           <nav className="flex flex-col gap-4 mt-6 px-4 text-sm font-medium">
//             <SidebarButton
//               icon={<MdHome />}
//               label="Home"
//               isOpen={isSidebarOpen}
//               onClick={() => navigate("/")}
//             />
//             <SidebarButton
//               icon={<RxDashboard />}
//               label="UploadFile"
//               isOpen={isSidebarOpen}
//               onClick={() => setActivePage("services")}
//             />
//             <SidebarButton
//               icon={<SiPlotly />}
//               label="MyPortfolio"
//               isOpen={isSidebarOpen}
//               onClick={() => setActivePage("portfolio")}
//             />
//             <SidebarButton
//               icon={<TbReplace />}
//               label="PortReplacement"
//               isOpen={isSidebarOpen}
//               onClick={() => setActivePage("portfolioReplacement")}
//             />
//             <SidebarButton
//               icon={<MdOutlineCreateNewFolder />}
//               label="OwnPortfolio"
//               isOpen={isSidebarOpen}
//               onClick={() => setActivePage("ownportfolio")}
//             />
//           </nav>
//         </div>

//         {/* Bottom section: Theme Toggle + Auth */}
//         <div>
//           <div className="border-t border-sky-700 px-4 py-4">
//             <button
//               className="flex items-center gap-3 w-full text-white hover:text-yellow-300 transition"
//               onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//             >
//               <MdOutlineSettings size={20} />
//               {isSidebarOpen && (
//                 <span>Theme: {theme === "light" ? "Light" : "Dark"}</span>
//               )}
//             </button>
//           </div>
//           <div className="px-4 pb-6">
//             {isLoggedIn ? (
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-sm py-2 px-4 rounded-md bg-yellow-500 text-black hover:bg-yellow-400 transition"
//               >
//                 Logout
//               </button>
//             ) : (
//               <button
//                 onClick={handleLoginClick}
//                 className="w-full text-sm py-2 px-4 rounded-md bg-yellow-500 text-black hover:bg-yellow-400 transition"
//               >
//                 <Login />
//               </button>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>

//       {/* Routes */}
//       <Routes>
//         <Route
//           path="/updateIndividualProfile"
//           element={<UpdateIndividualProfile />}
//         />
//         <Route
//           path="/updateCorporateProfile"
//           element={<UpdateCorporateProfile />}
//         />
//       </Routes>

//       <ToastContainer />
//     </div>
//   );
// };

// // Sidebar Button Component
// const SidebarButton = ({ icon, label, isOpen, onClick }) => (
//   <button
//     onClick={onClick}
//     className="flex items-center gap-3 hover:text-yellow-300 transition w-full"
//   >
//     <span>{React.cloneElement(icon, { size: 20 })}</span>
//     {isOpen && <span>{label}</span>}
//   </button>
// );

// export default PortDash;





// import React, { useEffect, useState } from "react";
// import {
//   Routes,
//   Route,
//   useNavigate,
//   useLocation,
// } from "react-router-dom";
// import {
//   MdOutlineSettings,
//   MdHome,
//   MdOutlineCreateNewFolder,
// } from "react-icons/md";
// import { RxDashboard } from "react-icons/rx";
// import { SiPlotly } from "react-icons/si";
// import { TbReplace } from "react-icons/tb";
// import { FaArrowRightArrowLeft, FaBars } from "react-icons/fa6";
// import PortLandPage from "./PortLandPage";
// import MyPortfolioPage from "./MyPortfolioPage";
// import PortfolioReplacement from "./PortfolioReplacement";
// import BuildOwnPort from "./BuildOwnPort";
// import UpdateCorporateProfile from "../UpdateCorporateProfile";
// import UpdateIndividualProfile from "../UpdateIndividualProfile";
// import ProfilePicture from "../ProfilePicture";
// import Username from "../Username";
// import Login from "../Login";
// import { getProfilePicture } from "../../services/api";
// import profile from "../../../public/profile.png";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const PortDash = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activePage, setActivePage] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [profileImage, setProfileImage] = useState(null);
//   const [userType, setUserType] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [fullName, setFullName] = useState("");
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const currentPath = location.pathname.split("/")[1] || "Home";
//     setActivePage(currentPath);
//   }, [location]);

//   useEffect(() => {
//     const fetchProfilePicture = async () => {
//       const imageUrl = await getProfilePicture();
//       if (imageUrl) setProfileImage(imageUrl);
//     };
//     fetchProfilePicture();
//   }, []);

//   useEffect(() => {
//     const root = document.documentElement;
//     if (theme === "dark") {
//       root.classList.add("dark");
//       document.body.classList.add("dark");
//     } else {
//       root.classList.remove("dark");
//       document.body.classList.remove("dark");
//     }
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     setUserType(storedUserType || "individual");
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     navigate("/portDash");
//   };

//   const handleLoginClick = () => {
//     const modal = document.getElementById("my_modal_3");
//     if (modal && !modal.open) modal.showModal();
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const renderContent = () => {
//     switch (activePage) {
//       case "portfolio":
//         return <MyPortfolioPage />;
//       case "portfolioReplacement":
//         return <PortfolioReplacement />;
//       case "ownportfolio":
//         return <BuildOwnPort />;
//       case "updateIndividualProfile":
//         return <UpdateIndividualProfile />;
//       case "updateCorporateProfile":
//         return <UpdateCorporateProfile />;
//       default:
//         return <PortLandPage />;
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
//       {/* Mobile Toggle Button */}
//       <div className="flex md:hidden justify-between items-center px-4 py-3 bg-sky-800 text-white shadow-md">
//         <span className="text-xl font-bold">
//           #CMD<span className="text-yellow-400">A</span> PortFolio
//         </span>
//         <button onClick={toggleSidebar}>
//           <FaBars size={24} />
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`
//           transition-all duration-300 bg-sky-800 dark:bg-gray-800 text-white shadow-lg
//           ${isMobile ? (isSidebarOpen ? "w-full" : "hidden") : isSidebarOpen ? "w-64" : "w-20"}
//           flex flex-col justify-between md:min-h-screen
//         `}
//       >
//         <div>
//           {/* Sidebar Toggle Button for Desktop */}
//           {!isMobile && (
//             <div className="flex justify-end p-4">
              
//               <button onClick={toggleSidebar} className="text-white hover:text-yellow-300">
//                 <FaArrowRightArrowLeft size={20} />
//               </button>
//             </div>
//           )}

//           {/* Profile */}
//           <div
//             className={`flex items-center gap-3 px-4 py-6 border-b border-sky-700 ${
//               !isSidebarOpen && !isMobile ? "justify-center" : ""
//             }`}
//           >
//             <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400">
//               <img
//                 src={profileImage || profile}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             {isSidebarOpen && userType && (
//               <div className="text-sm">
//                 <p className="text-yellow-400 font-semibold">Hi,</p>
//                 <Username className="text-white" userType={userType} setFullName={setFullName} />
//                 <p>{fullName}</p>
//               </div>
//             )}
//           </div>

//           {/* Navigation */}
//           <nav className="flex flex-col gap-4 mt-6 px-4 text-sm font-medium">
//             <SidebarButton
//               icon={<MdHome />}
//               label="Home"
//               isOpen={isSidebarOpen}
//               isActive={activePage === "Home"}
//               onClick={() => navigate("/")}
//             />
//             <SidebarButton
//               icon={<RxDashboard />}
//               label="Upload File"
//               isOpen={isSidebarOpen}
//               isActive={activePage === "services"}
//               onClick={() => setActivePage("services")}
//             />
//             <SidebarButton
//               icon={<SiPlotly />}
//               label="My Portfolio"
//               isOpen={isSidebarOpen}
//               isActive={activePage === "portfolio"}
//               onClick={() => setActivePage("portfolio")}
//             />
//             <SidebarButton
//               icon={<TbReplace />}
//               label="Resculpt Your Portfolio"
//               isOpen={isSidebarOpen}
//               isActive={activePage === "portfolioReplacement"}
//               onClick={() => setActivePage("portfolioReplacement")}
//             />
//             <SidebarButton
//               icon={<MdOutlineCreateNewFolder />}
//               label="Customize Portfolio"
//               isOpen={isSidebarOpen}
//               isActive={activePage === "ownportfolio"}
//               onClick={() => setActivePage("ownportfolio")}
//             />
//           </nav>
//         </div>

//         {/* Bottom Settings */}
//         <div>
//           <div className="border-t border-sky-700 px-4 py-4">
//             <button
//               className={`flex items-center gap-3 w-full text-white hover:text-yellow-300 transition ${
//                 !isSidebarOpen && !isMobile ? "justify-center" : ""
//               }`}
//               onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//             >
//               <MdOutlineSettings size={20} />
//               {isSidebarOpen && <span>Theme: {theme === "light" ? "Light" : "Dark"}</span>}
//             </button>
//           </div>
//           <div className="px-4 pb-6">
//             {isLoggedIn ? (
//               <button
//                 onClick={handleLogout}
//                 className={`w-full text-sm py-2 px-4 rounded-md  text-black  transition ${
//                   !isSidebarOpen && !isMobile ? "flex justify-center" : ""
//                 }`}
//               >
//                 {isSidebarOpen ? "Logout" : <FaArrowRightArrowLeft size={20} />}
//               </button>
//             ) : (
//               <button
//                 onClick={handleLoginClick}
//                 className={`w-full text-sm py-2 px-4 rounded-md  text-black  transition ${
//                   !isSidebarOpen && !isMobile ? "flex justify-center" : ""
//                 }`}
//               >
//                 {isSidebarOpen ? <Login /> : <FaArrowRightArrowLeft size={20} />}
//               </button>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-4 overflow-auto">{renderContent()}</main>

//       {/* Extra Routes */}
//       <Routes>
//         <Route path="/updateIndividualProfile" element={<UpdateIndividualProfile />} />
//         <Route path="/updateCorporateProfile" element={<UpdateCorporateProfile />} />
//       </Routes>

//       <ToastContainer />
//     </div>
//   );
// };

// // Sidebar Button Component
// const SidebarButton = ({ icon, label, isOpen, isActive, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`
//       flex items-center gap-3 w-full px-2 py-2 rounded-md transition
//       ${isActive ? "bg-slate-100 text-black font-bold" : "text-white hover:text-yellow-300"}
//       ${!isOpen ? "justify-center" : ""}
//     `}
//   >
//     <span>{React.cloneElement(icon, { size: 20 })}</span>
//     {isOpen && <span>{label}</span>}
//   </button>
// );

// export default PortDash;



import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  MdOutlineSettings,
  MdHome,
  MdOutlineCreateNewFolder,
} from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { SiPlotly } from "react-icons/si";
import { TbReplace } from "react-icons/tb";
import { FaArrowRightArrowLeft, FaBars } from "react-icons/fa6";
import PortLandPage from "./PortLandPage";
import MyPortfolioPage from "./MyPortfolioPage";
import PortfolioReplacement from "./PortfolioReplacement";
import BuildOwnPort from "./BuildOwnPort";
import UpdateCorporateProfile from "../UpdateCorporateProfile";
import UpdateIndividualProfile from "../UpdateIndividualProfile";
import ProfilePicture from "../ProfilePicture";
import Username from "../Username";
import Login from "../Login";
import { getProfilePicture } from "../../services/api";
import profile from "../../../public/profile.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toast from 'react-hot-toast';
const PortDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [profileImage, setProfileImage] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [showLoginModal, setShowLoginModal] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1] || "Home";
    setActivePage(currentPath);
  }, [location]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const imageUrl = await getProfilePicture();
      if (imageUrl) setProfileImage(imageUrl);
    };
    fetchProfilePicture();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType || "individual");
  }, []);

   useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
       toast.success("Logged out successfully!");
    navigate("/");
    
  };

 const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };
    const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activePage) {
      case "portfolio":
        return <MyPortfolioPage />;
      case "portfolioReplacement":
        return <PortfolioReplacement />;
      case "ownportfolio": // Customize Portfolio
        return <BuildOwnPort />;
      case "updateIndividualProfile":
        return <UpdateIndividualProfile />;
      case "updateCorporateProfile":
        return <UpdateCorporateProfile />;
      default:
        return <PortLandPage />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Toggle Button */}
      <div className="flex md:hidden justify-between items-center px-4 py-3 bg-sky-800 text-white shadow-md">
        <span className="text-xl font-bold">
          #SMD<span className="text-yellow-400">A</span> PortFolio
        </span>
        <button onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          transition-all duration-300 bg-sky-800 dark:bg-gray-800 text-white shadow-lg
          ${isMobile ? (isSidebarOpen ? "w-full" : "hidden") : isSidebarOpen ? "w-64" : "w-20"}
          flex flex-col justify-between md:min-h-screen
        `}
      >
        <div>
          {/* Sidebar Toggle Button for Desktop */}
          {!isMobile && (
            <div className="flex justify-end p-4">
              
              <button onClick={toggleSidebar} className="text-white hover:text-yellow-300">
                <FaArrowRightArrowLeft size={20} />
              </button>
            </div>
          )}

          {/* Profile */}
          <div
            className={`flex items-center gap-3 px-4 py-6 border-b border-sky-400 ${
              !isSidebarOpen && !isMobile ? "justify-center" : ""
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400">
              <img
                src={profileImage || profile}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isSidebarOpen && userType && (
              <div className="text-sm">
                <p className="text-sky-400 font-semibold">Hi,</p>
                <Username className="text-white" userType={userType} setFullName={setFullName} />
                <p className="text-white">{fullName}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-4 mt-6 px-4 text-sm font-medium">
            <SidebarButton
              icon={<MdHome />}
              label="Home"
              isOpen={isSidebarOpen}
              isActive={activePage === "Home"}
              onClick={() => navigate("/")}
            />
            <SidebarButton
              icon={<RxDashboard />}
              label="Upload File"
              isOpen={isSidebarOpen}
              isActive={activePage === "services"}
              onClick={() => setActivePage("services")}
            />
            <SidebarButton
              icon={<SiPlotly />}
              label="My Portfolio"
              isOpen={isSidebarOpen}
              isActive={activePage === "portfolio"}
              onClick={() => setActivePage("portfolio")}
            />
            <SidebarButton
              icon={<TbReplace />}
              label="Resculpt Your Portfolio"
              isOpen={isSidebarOpen}
              isActive={activePage === "portfolioReplacement"}
              onClick={() => setActivePage("portfolioReplacement")}
            />
            <SidebarButton
              icon={<MdOutlineCreateNewFolder />}
              label="Customize Portfolio"
              isOpen={isSidebarOpen}
              isActive={activePage === "ownportfolio"}
              onClick={() => setActivePage("ownportfolio")}
            />
          </nav>
        </div>

        {/* Bottom Settings */}
        <div>
          <div className="border-t border-sky-700 px-4 py-4">
            {/* <button
              className={`flex items-center gap-3 w-full text-white hover:text-yellow-300 transition ${
                !isSidebarOpen && !isMobile ? "justify-center" : ""
              }`}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <MdOutlineSettings size={20} />
              {isSidebarOpen && <span>Theme: {theme === "light" ? "Light" : "Dark"}</span>}
            </button> */}
          </div>
                   <div className="navbar-end ml-10">
             {isLoggedIn ? (
  <button 
    onClick={handleLogout} 
    className="btn text-sm bg-sky-800 text-white px-3 py-1 rounded border border-white  dark:bg-slate-800"
    id="nav-logout"
  >
    Logout
  </button>
) : (
  <button
    className="text-sm px-3 py-1 rounded transition-colors text-white bg-sky-800 border border-white"
    id="nav-login"
    onClick={handleLoginClick} // This should directly open the modal
  >
    Login
  </button>
)}
            </div>

 

        </div>

        {/* Add this Login Modal at the bottom of your return statement */}
      
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">{renderContent()}</main>

      {/* Extra Routes */}
      <Routes>
        <Route path="/updateindividualprofile" element={<UpdateIndividualProfile />} />
        <Route path="/updatecorporateprofile" element={<UpdateCorporateProfile />} />
      </Routes>

      <ToastContainer />
           {showLoginModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
             <Login 
        isOpen={showLoginModal} 
        onClose={handleLoginClose} 
        onSuccess={() => {
          setIsLoggedIn(true);
          handleLoginClose();
        }}
      />
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar Button Component
const SidebarButton = ({ icon, label, isOpen, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 w-full px-2 py-2 rounded-md transition
      ${isActive ? "bg-slate-100 text-black font-bold" : "text-white hover:text-yellow-300"}
      ${!isOpen ? "justify-center" : ""}
    `}
  >
    <span>{React.cloneElement(icon, { size: 20 })}</span>
    {isOpen && <span>{label}</span>}
  </button>
);

export default PortDash;