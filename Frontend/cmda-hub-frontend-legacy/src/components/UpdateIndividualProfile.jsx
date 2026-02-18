// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import JwtUtil from "../services/JwtUtil"; 
// import { TbHexagonPlusFilled } from "react-icons/tb";
// import { IoFlagSharp, IoHomeOutline, IoHomeSharp } from "react-icons/io5";
// import { Link } from "react-router-dom";
// import HomeNavbar from "./HomeNavbar";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import Login from "./Login";

// const UpdateIndividualProfile = () => {
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(null);
//   const [userData, setUserData] = useState(null); // Store user details
//   const location = useLocation();
//   const navigate = useNavigate();
//   // const [showPassword, setShowPassword] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const token = localStorage.getItem("authToken");

//   useEffect(() => {
//     if (!token) {
//       setIsLoggedIn(false);
//     } else {
//       setIsLoggedIn(true);
//       fetchUserDetails();
//     }
//   }, []);

//   const fetchUserDetails = async () => {
//     try {
//       if (!token) throw new Error("Unauthorized. No token found.");

//       const email = JwtUtil.extractEmail(token);
//       if (!email) throw new Error("Unable to extract email from token.");

//       const response = await axios.get(`${API_BASE}/Userprofile/${email}`, {
//         // const response = await axios.get(`http://192.168.1.250:8080/api/Userprofile/${email}`, { 
//           // const response = await axios.get(`${VITE_URL}/api/Userprofile/${email}`, { 
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUserData(response.data); // Store user details
//       reset(response.data); // Populate form with data
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       toast.error("Failed to load user details.");
//     }
//   };

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({ mode: "onChange" });

//   // const password = watch("password", "");

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);

//       if (!token) throw new Error("Unauthorized. No token found.");

//       const email = JwtUtil.extractEmail(token);
//       if (!email) throw new Error("Unable to extract email from token.");

//       const payload = { ...data, email };

//       await axios.put(
//         // `http://localhost:8080/api/Userprofile/update`,
//         // `http://192.168.1.250:8080/CMDA-3.3.9/api/Userprofile/update`,
//         `${API_BASE}/Userprofile/update`,
//         // `${VITE_URL}/api/Userprofile/update`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Profile updated successfully!");
//       navigate("/", { replace: true });
//     } catch (err) {
//       toast.error(err.message || "An error occurred.");
//       console.error("Submit Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isLoggedIn === null) {
//     return <div>Loading...</div>;
//   }

//   // if (!isLoggedIn) {
//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center dark:bg-slate-800 dark:text-white">
//   //       <div className="modal-box dark:bg-slate-800 dark:text-white">
//   //         <h1 className="text-xl font-semibold mb-4">Please login to update your profile</h1>
//   //       </div>
//   //     </div>
//   //   );
//   // }


//   if (isLoggedIn === null) {
//     return <div>Loading...</div>;
//   }

//   // if (!isLoggedIn) {
//   //   return (
//   //   <div>
//   //     <HomeNavbar/>
//   //       <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-white">
//   //       <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6 w-96 text-center">
//   //         <h1 className="text-2xl font-semibold mb-4">🔒 Access Restricted</h1>
//   //         <p className="text-gray-600 dark:text-gray-300 mb-6">
//   //           You need to log in to update your profile.
//   //         </p>
//   //         <a
//   //               onClick={() => document.getElementById("my_modal_3").showModal()} 
//   //               className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
//   //             >
              
//   //             </a>
//   //             <Login/>
//   //       </div>
//   //     </div>
//   //    </div>
//   //   );
//   // }

//   if (!isLoggedIn) {
//     return (
//       <div>
//         <HomeNavbar />
//         <div className="min-h-screen flex items-center justify-center bg-cyan-300 dark:bg-slate-900 text-gray-800 dark:text-white px-4">
//           <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-8 w-full max-w-md text-center transition-all duration-300">
//             <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">🔒 Access Denied</h1>
//             <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
//               You need to log in to update your profile.
//             </p>
//             <button
//               onClick={() => document.getElementById("my_modal_3").showModal()}
//               // className="bg-cyan-600 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 shadow-md w-full"
//             >
//               <Login />
//             </button>
            
//           </div>
//         </div>
  
//       </div>
//     );
//   }
  
  

//   return (
//     <div>
//       <HomeNavbar/>
//       <div  className="relative overflow-hidden py-20 px-4 md:px-12 lg:px-24 banner-background"
//       style={{
//         background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(10, 205, 235, 0.7)), url("/public/directly-shot-toy-blocks-yellow-background_1048944-30326937.jpg")',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed',
//       }}>
//    <h1 className="text-3xl font-semibold mb-4 text-center mt-5 text-white">Update Individual Profile</h1>
//    {/* <div className="modal-box dark:bg-slate-800 dark:text-white"> */}
//      {/* <h1 className="text-3xl font-semibold mb-4">Update Individual Profile</h1> */}
//      <div className="flex items-center justify-center ">
     
//      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-10 shadow-lg bg-white">
//        {/* User Name */}
//        <label className="block">
//          <span>User Name:</span>
//          <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//            </svg>
//            <input type="text" className="grow" placeholder="User Name" {...register("fullname")} />
//            {errors.fullname && <span className="text-red-500">{errors.fullname.message}</span>}
//          </div>
//        </label>

//        {/* Country Code */}
//  <label className="block">
//          <span>Country Name:</span>
//          <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <IoFlagSharp />
//            <select {...register("countryCode")} className="w-full py-2 bg-white dark:bg-gray-900 dark:text-white">
//              <option disabled selected>Country Name</option>
//              <option>+91 India</option>
//              <option>+93 Afghanistan</option>
//              <option>+358 Aland Islands</option>
//              <option>+82 Korea</option>
//            </select>
//            {errors.countryCode && <span className="text-red-500">{errors.countryCode.message}</span>}
//          </div>
//        </label>

//        {/* Contact Number */}
//        <label className="block">
//          <span>Contact Number:</span>
//          <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//            </svg>
//            <input type="number" className="grow" placeholder="Contact Number" {...register("mobileNum")} />
//            {errors.mobileNum && <span className="text-red-500">{errors.mobileNum.message}</span>}
//          </div>
//        </label>


//        {/* Password Fields */}
//        {/* <label className="block">
//   <span className="text-l text-red-500">*</span>
//   <span>Password:</span>
//   <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//     <input
//       type={showPassword ? "text" : "password"}
//       className="grow"
//       placeholder="Password"
//       onPaste={(e) => e.preventDefault()} // Prevent pasting
//       onCopy={(e) => e.preventDefault()} // Prevent copying
//       {...register("password", {
//         required: "Password is required",
//         pattern: {
//           value: /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
//           message: "Must start with a capital, include a number & special character, min 8 chars",
//         },
//       })}
//     />
//     <button type="button" onClick={() => setShowPassword(!showPassword)}>
//       {showPassword ? (
//         <EyeOffIcon className="h-5 w-5 text-gray-500" />
//       ) : (
//         <EyeIcon className="h-5 w-5 text-gray-500" />
//       )}
//     </button>
//   </div>
//   {errors.password && <span className="text-l text-red-500">{errors.password.message}</span>}
// </label> */}


//    {/* Confirm Password Field */}
//    {/* <label className="block">
//   <span className="text-l text-red-500">*</span>
//   <span>Confirm Password:</span>
//   <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//     <input
//       type={showPassword ? "text" : "password"}
//       className="grow"
//       placeholder="Confirm Password"
//       onPaste={(e) => e.preventDefault()} // Prevent pasting
//       onCopy={(e) => e.preventDefault()} // Prevent copying
//       {...register("confirmpassword", {
//         required: "Confirm password is required",
//         validate: (value) => value === password || "Passwords do not match",
//       })}
//     />
//     <button type="button" onClick={() => setShowPassword(!showPassword)}>
//       {showPassword ? (
//         <EyeOffIcon className="h-5 w-5 text-gray-500" />
//       ) : (
//         <EyeIcon className="h-5 w-5 text-gray-500" />
//       )}
//     </button>
//   </div>
//   {errors.confirmpassword && <span className="text-l text-red-500">{errors.confirmpassword.message}</span>}
// </label> */}

 
      

//        {/* Add More Details Link */}
//        <div className="flex justify-center items-center my-4">
//          <Link to={'/completeData'} className="flex items-center gap-2 text-blue-500 hover:underline">
//            <TbHexagonPlusFilled className="text-xl" />
//            Add More Details
//          </Link>
//        </div>

//        {/* Submit Button */}
//        <button type="submit" className="btn btn-block btn-warning" disabled={loading}>
//          {loading ? "Updating..." : "Update"}
//        </button>
//      </form>
//    {/* </div> */}
    
//      </div>
//  </div>
//     </div>
//   );
// };

// export default UpdateIndividualProfile;



// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import JwtUtil from "../services/JwtUtil"; 
// import { TbHexagonPlusFilled } from "react-icons/tb";
// import { IoFlagSharp, IoHomeOutline, IoHomeSharp } from "react-icons/io5";
// import { Link } from "react-router-dom";

// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import Login from "./Login";
// import Navbar from "./Navbar";

// const UpdateIndividualProfile = () => {
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const token = localStorage.getItem("authToken");

//   useEffect(() => {
//     if (!token) {
//       setIsLoggedIn(false);
//     } else {
//       setIsLoggedIn(true);
//       fetchUserDetails();
//     }
//   }, []);

//   const fetchUserDetails = async () => {
//     try {
//       if (!token) throw new Error("Unauthorized. No token found.");

//       const email = JwtUtil.extractEmail(token);
//       if (!email) throw new Error("Unable to extract email from token.");

//       const response = await axios.get(`${API_BASE}/Userprofile/${email}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUserData(response.data);
//       reset(response.data);
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       toast.error("Failed to load user details.");
//     }
//   };

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({ mode: "onChange" });

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);

//       if (!token) throw new Error("Unauthorized. No token found.");

//       const email = JwtUtil.extractEmail(token);
//       if (!email) throw new Error("Unable to extract email from token.");

//       const payload = { ...data, email };

//       await axios.put(
//         `${API_BASE}/Userprofile/update`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Profile updated successfully!");
//       navigate("/", { replace: true });
//     } catch (err) {
//       toast.error(err.message || "An error occurred.");
//       console.error("Submit Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isLoggedIn === null) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//       </div>
//     );
//   }

//   if (!isLoggedIn) {
//     return (
//       <div>
//         <Navbar />
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-slate-900 dark:to-slate-800 px-4">
//           <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8 w-full max-w-md text-center transition-all duration-300 transform hover:scale-[1.01]">
//             <div className="flex justify-center mb-6">
//               <div className="bg-cyan-100 dark:bg-slate-700 p-4 rounded-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">🔒 Access Required</h1>
//             <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
//               Please log in to update your profile.
//             </p>
//             <button
//               onClick={() => document.getElementById("my_modal_3").showModal()}
//               className="w-full"
//             >
//               <Login />
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (

    
//     <div className="min-h-screen  dark:from-slate-900 dark:to-slate-800">
//       <Navbar />
      
//       <div className="relative overflow-hidden py-12 md:py-20 px-4 md:px-12 lg:px-24">
//         <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50  dark:from-slate-800/80 dark:to-slate-900/80 z-0"></div>
        
//         <div className="max-w-6xl mx-auto relative z-10">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
//               Update Your Profile
//             </h1>
//             <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//               Keep your information up to date to get the best experience
//             </p>
//           </div>

//           <div className="flex flex-col lg:flex-row gap-8">
//             <div className="lg:w-1/3 w-3/3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 self-start sticky top-6">
//               <div className="flex flex-col items-center text-center mb-6">
//                 <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   {userData?.fullname || "Your Name"}
//                 </h3>
//                 <p className="text-gray-500 dark:text-gray-400">
//                   {userData?.email || "user@example.com"}
//                 </p>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
//                   <div className="p-2 bg-cyan-100 dark:bg-slate-700 rounded-full">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                     </svg>
//                   </div>
//                   <span className="text-gray-700 dark:text-gray-300">
//                     {userData?.mobileNum || "+1 (234) 567-890"}
//                   </span>
//                 </div>
 
//                 {/*<div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
//                   <div className="p-2 bg-cyan-100 dark:bg-slate-700 rounded-full">
//                     <IoFlagSharp className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
//                   </div>
//                   <span className="text-gray-700 dark:text-gray-300">
//                     {userData?.countryCode || "Country not set"}
//                   </span>
//                 </div>*/}

//                 <Link 
//                   to="/completedata" 
//                   className="flex items-center justify-center gap-2 p-3 rounded-lg bg-cyan-50 dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-slate-600 transition-colors mt-6"
//                 >
//                   <TbHexagonPlusFilled className="text-xl" />
//                   <span>Add More Details</span>
//                 </Link>
//               </div>
//             </div>

//             <div className="lg:w-2/3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 <div>
//                   <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
//                     Basic Information
//                   </h2>
                  
//                   <div className="space-y-5">
//                     {/* Full Name */}
//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text text-gray-700 dark:text-gray-300">Full Name</span>
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                           </svg>
//                         </div>
//                         <input
//                           type="text"
//                           className="input input-bordered w-full pl-10 dark:bg-slate-900 dark:text-white"
//                           placeholder="Your full name"
//                           {...register("fullname", { required: "Full name is required" })}
//                         />
//                       </div>
//                       {errors.fullname && (
//                         <p className="mt-1 text-sm text-red-500">{errors.fullname.message}</p>
//                       )}
//                     </div>

//                     {/* Country Code */}
//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text text-gray-700 dark:text-gray-300">Country</span>
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                           <IoFlagSharp className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <select
//                           {...register("countryCode", { required: "Country is required" })}
//                           className="select select-bordered w-full pl-10 dark:bg-slate-900 dark:text-white"
//                         >
//                           <option disabled value="">Select your country</option>
//                           <option value="+91 India">+91 India</option>
//                           <option value="+93 Afghanistan">+93 Afghanistan</option>
//                           <option value="+358 Aland Islands">+358 Aland Islands</option>
//                           <option value="+82 Korea">+82 Korea</option>
//                         </select>
//                       </div>
//                       {errors.countryCode && (
//                         <p className="mt-1 text-sm text-red-500">{errors.countryCode.message}</p>
//                       )}
//                     </div>

//                     {/* Contact Number */}
//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text text-gray-700 dark:text-gray-300">Phone Number</span>
//                       </label>
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                             <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                           </svg>
//                         </div>
//                         <input
//                           type="tel"
//                           className="input input-bordered w-full pl-10 dark:bg-slate-900 dark:text-white"
//                           placeholder="Phone number"
//                           {...register("mobileNum", {
//                             required: "Phone number is required",
//                             pattern: {
//                               value: /^[0-9]{10,15}$/,
//                               message: "Please enter a valid phone number"
//                             }
//                           })}
//                         />
//                       </div>
//                       {errors.mobileNum && (
//                         <p className="mt-1 text-sm text-red-500">{errors.mobileNum.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
//                   <button
//                     type="submit"
//                     className={`btn bg-sky-800 text-white w-full ${loading ? 'loading' : ''}`}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <span className="flex items-center justify-center">
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Updating...
//                       </span>
//                     ) : (
//                       "Update Profile"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateIndividualProfile;



import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JwtUtil from "../services/JwtUtil";
import { TbHexagonPlusFilled } from "react-icons/tb";
import { IoFlagSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Login from "./Login";
import Navbar from "./Navbar";
import debounce from "lodash.debounce";


const UpdateIndividualProfile = () => {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userData, setUserData] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const token = localStorage.getItem("authToken");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // -------------------------------------------------
  // 1. Load profile
  // -------------------------------------------------
  const fetchUserDetails = async () => {
    try {
      if (!token) throw new Error("Unauthorized. No token found.");
      const email = JwtUtil.extractEmail(token);
      if (!email) throw new Error("Unable to extract email from token.");

      const response = await axios.get(`${API_BASE}/Userprofile/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      setUserData(data);
      reset(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details.");
    }
  };

  // -------------------------------------------------
  // 2. Fetch subscription status
  // -------------------------------------------------
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/auth/get-subscription-status`,
        // "http://168.231.121.219:8084/api/auth/get-subscription-status",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubscribed(response.data.subscribed === true);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
      toast.error("Could not load email preferences.");
    }
  };

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      fetchUserDetails();
      fetchSubscriptionStatus();
    }
  }, [token]);

  // -------------------------------------------------
  // 3. Update subscription
  // -------------------------------------------------
  const updateSubscription = async (value) => {
    if (!token) return toast.error("You are not logged in.");

    setSubLoading(true);
    try {
      await axios.put(
        `${API_BASE}/auth/update-subscription`,
        // "http://168.231.121.219:8084/api/auth/update-subscription",
        { subscribeToCMDA: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSubscribed(value);
      toast.success(
        value
          ? "You're subscribed! We'll keep you updated."
          : "You've been unsubscribed."
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update subscription.");
      setSubscribed(!value);
    } finally {
      setSubLoading(false);
    }
  };

  const debouncedUpdate = useCallback(
    debounce((val) => updateSubscription(val), 600),
    [token]
  );

  // -------------------------------------------------
  // 4. Toggle handler with confirmation
  // -------------------------------------------------
  const handleToggle = (checked) => {
    if (checked) {
      debouncedUpdate(true);
    } else {
      setShowUnsubscribeModal(true);
    }
  };

  const confirmUnsubscribe = () => {
    setShowUnsubscribeModal(false);
    debouncedUpdate(false);
  };

  // -------------------------------------------------
  // 5. Main form submit (no redirect)
  // -------------------------------------------------
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (!token) throw new Error("Unauthorized. No token found.");

      const email = JwtUtil.extractEmail(token);
      if (!email) throw new Error("Unable to extract email from token.");

      const payload = { ...data, email };

      await axios.put(`${API_BASE}/Userprofile/update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Profile updated successfully!");
      // Stay on the same page — no navigate!
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // 6. Render
  // -------------------------------------------------
  if (isLoggedIn === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-slate-900 dark:to-slate-800 px-4">
          <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8 w-full max-w-md text-center transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex justify-center mb-6">
              <div className="bg-cyan-100 dark:bg-slate-700 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Access Required</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">Please log in to update your profile.</p>
            <button onClick={() => document.getElementById("my_modal_3").showModal()} className="w-full">
              <Login />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      {/* Unsubscribe Confirmation Modal */}
      {showUnsubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unsubscribe?</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You will stop receiving updates, new features, and exclusive offers.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmUnsubscribe}
                disabled={subLoading}
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
              >
                {subLoading ? "Unsubscribing..." : "Yes, Unsubscribe"}
              </button>
              <button
                onClick={() => setShowUnsubscribeModal(false)}
                className="flex-1 btn bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden py-12 md:py-20 px-4 md:px-12 lg:px-24">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800/80 dark:to-slate-900/80 z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Update Your Profile
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Keep your information up to date to get the best experience
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ---- LEFT SIDEBAR ---- */}
            <div className="lg:w-1/3 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 self-start sticky top-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {userData?.fullname || "Your Name"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {userData?.email || "user@example.com"}
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="p-2 bg-cyan-100 dark:bg-slate-700 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {userData?.mobileNum || "+1 (234) 567-890"}
                  </span>
                </div>

                {/* Email Updates Badge */}
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="p-2 bg-cyan-100 dark:bg-slate-700 rounded-full">
                    {subscribed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Email Updates: {subscribed ? "ON" : "OFF"}
                  </span>
                </div>

                {/* ---- STAY IN THE LOOP SECTION ---- */}
                <div className="mt-6 p-5 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl border border-cyan-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Stay in the Loop</h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                    Get notified about new features, tips, and exclusive updates.
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscribed}
                      onChange={(e) => handleToggle(e.target.checked)}
                      disabled={subLoading}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {subLoading ? "Updating..." : subscribed ? "ON" : "OFF"}
                    </span>
                  </label>
                </div>

                <Link
                  to="/completeData"
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-cyan-50 dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-slate-600 transition-colors mt-6"
                >
                  <TbHexagonPlusFilled className="text-xl" />
                  <span>Add More Details</span>
                </Link>
              </div>
            </div>

            {/* ---- RIGHT FORM ---- */}
            <div className="lg:w-2/3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Basic Information
                  </h2>

                  <div className="space-y-5">
                    {/* Full Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 dark:text-gray-300">Full Name</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          className="input input-bordered w-full pl-10 dark:bg-slate-900 dark:text-white"
                          placeholder="Your full name"
                          {...register("fullname", { required: "Full name is required" })}
                        />
                      </div>
                      {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname.message}</p>}
                    </div>

                    {/* Country */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 dark:text-gray-300">Country</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <IoFlagSharp className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          {...register("countryCode", { required: "Country is required" })}
                          className="select select-bordered w-full pl-10 dark:bg-slate-900 dark:text-white"
                        >
                          <option disabled value="">Select your country</option>
                          <option value="+91 India">+91 India</option>
                          <option value="+93 Afghanistan">+93 Afghanistan</option>
                          <option value="+358 Aland Islands">+358 Aland Islands</option>
                          <option value="+82 Korea">+82 Korea</option>
                        </select>
                      </div>
                      {errors.countryCode && <p className="mt-1 text-sm text-red-500">{errors.countryCode.message}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 dark:text-gray-300">Phone Number</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          className="input input-bordered w-full pl-10 dark:bg-slate-900 dark:text-white"
                          placeholder="Phone number"
                          {...register("mobileNum", {
                            required: "Phone number is required",
                            pattern: {
                              value: /^[0-9]{10,15}$/,
                              message: "Please enter a valid phone number",
                            },
                          })}
                        />
                      </div>
                      {errors.mobileNum && <p className="mt-1 text-sm text-red-500">{errors.mobileNum.message}</p>}
                    </div>
                  </div>
                </div>

                {/* ---- SUBMIT BUTTON ---- */}
                <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button
                    type="submit"
                    className={`btn bg-sky-800 text-white w-full ${loading ? "loading" : ""}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateIndividualProfile;