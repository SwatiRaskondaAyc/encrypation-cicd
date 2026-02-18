
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import JwtUtil from "../services/JwtUtil"; // Import the JwtUtil file
// import { TbHexagonPlusFilled } from "react-icons/tb";
// import { IoFlagSharp, IoHomeOutline, IoHomeSharp } from "react-icons/io5";
// import { Link } from "react-router-dom";

// import HomeNavbar from "./HomeNavbar";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import Login from "./Login";

// const UpdateCorporateProfile = () => {
  
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(null);
//   const [userData, setUserData] = useState(null); // State to store user data
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const token = localStorage.getItem("authToken");

//   useEffect(() => {
//     if (!token) {
//       setIsLoggedIn(false);
//     } else {
//       setIsLoggedIn(true);
//       fetchUserDetails();
//     }
//   }, []);
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue, // Used to set default values dynamically
//     formState: { errors },
//   } = useForm({ mode: "onChange" });

//   const password = watch("password", "");

//   // Function to fetch user details
//   const fetchUserDetails = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Unauthorized. No token found.");

//       const email = JwtUtil.extractEmail(token);
//       if (!email) throw new Error("Unable to extract email from token.");

//       const response = await axios.get(`${API_BASE}/api/corporate/${email}`, {
//         // const response = await axios.get(`http://192.168.1.250:8080/CMDA-3.3.9/api/corporate/${email}`, { 
//           // const response = await axios.get(`http://192.168.1.250:8080/api/corporate/${email}`, { 

//           // const response = await axios.get(`${VITE_URL}/api/corporate/${email}`, { 
//         headers: {
//           Authorization: `Bearer ${token}`,
//          // "Content-Type": "application/json",
//         },
//       });

//       setUserData(response.data);

//       // Prefill form fields using setValue()
//       setValue("companyName", response.data.companyName);
//       setValue("employeeName", response.data.employeeName);
//       setValue("jobTitle", response.data.jobTitle);
//       setValue("countryCode", response.data.countryCode);
//     } catch (err) {
//       toast.error("Failed to load user details.");
//       console.error("Fetch Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Unauthorized. No token found.");

//       const email = JwtUtil.extractEmail(token);
//       if (!email) throw new Error("Unable to extract email from token.");

//       const apiUrl = "/api/corporate/update";
//       const payload = { ...data, email };

//       // await axios.put(`http://localhost:8080${apiUrl}`, payload, {
//         // await axios.put(`http://192.168.1.250:8080/CMDA-3.3.9${apiUrl}`, payload, {
//           await axios.put(`${API_BASE}${apiUrl}`, payload, {

//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       toast.success("Profile updated successfully!");
//       navigate(from, { replace: true });
//     } catch (err) {
//       toast.error(err.message || "An error occurred.");
//       console.error("Submit Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
// <div>
//   <HomeNavbar/>
// <div className="min-h-screen flex items-center justify-center dark:bg-slate-800 dark:text-white">
     
//      <div className="modal-box dark:bg-slate-800 dark:text-white">
     
//        <h1 className="text-3xl font-semibold mb-4">Update Corporate Profile</h1>
//        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//          {/* Organization Name */}
//          <label className="block">
//            <span>Organization Name:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//              <input type="text" className="grow" placeholder="Organization Name" {...register("companyName")} disabled />
//            </div>
//          </label>
//               <label className="block">
//              <span>Employee Name:</span>
//                  <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                   </svg> 
//                    <input type="text" className="grow" placeholder="Employee Name"  {...register("employeeName"  )}  />
             
//                   {errors.employeeName   }
//                 </div>
//                </label>
//          {/* Job Title */}
//          <label className="block">
//                <span>JobTitle:</span>
//                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//                   <input type="Text" className="grow" placeholder="Your Designation" {...register("jobTitle"  )} />
//                   <div className="input-group-append">
                 
//                   </div>
//                   {errors.jobTitle}
              
//                 </div>
//               </label>

//           <label className="block">
//                      <span>Country Name:</span>
//                      <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                        <IoFlagSharp />
//                        <select {...register("countryCode")} className="w-full py-2 bg-white dark:bg-gray-900 dark:text-white">
//                          <option disabled selected>Country Name</option>
//                          <option>+91 India</option>
//                          <option>+93 Afghanistan</option>
//                          <option>+358 Aland Islands</option>
//                          <option>+82 Korea</option>
//                        </select>
//                        {errors.countryCode && <span className="text-red-500">{errors.countryCode.message}</span>}
//                      </div>
//                    </label>

//          {/* Password */}
//          <label className="block">
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
// </label>
//          {/* Confirm Password */}
//          <label className="block">
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
// </label>


//          {/* Add More Details Link */}
//          <div className="flex justify-center items-center my-4">
//            <Link to={"/completeData"} className="flex items-center gap-2 text-blue-500 hover:underline">
//              <TbHexagonPlusFilled className="text-xl" />
//              Add More Details
//            </Link>
//          </div>

//          {/* Submit Button */}
//          <button type="submit" className="btn btn-block btn-warning" disabled={loading}>
//            {loading ? "Updating..." : "Update"}
//          </button>
//        </form>
//      </div>
//    </div>
// </div>
    
   
//   );
// };

// export default UpdateCorporateProfile;



// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import JwtUtil from "../services/JwtUtil"; // Import the JwtUtil file
// import { TbHexagonPlusFilled } from "react-icons/tb";
// import { IoFlagSharp, IoHomeOutline, IoHomeSharp } from "react-icons/io5";
// import { Link } from "react-router-dom";

// import { EyeIcon, EyeOffIcon } from "lucide-react";
// import Login from "./Login";
// import HomeNavbar from "./HomeNavbar";

// const UpdateCorporateProfile = () => {
  
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(null);
//   const [userData, setUserData] = useState(null); // State to store user data
//   const location = useLocation();
//   const navigate = useNavigate();
//   // const [showPassword, setShowPassword] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const token = localStorage.getItem("authToken");

//   useEffect(() => {
//     if (!token) {
//       setIsLoggedIn(false);
//     } else {
//       setIsLoggedIn(true);
//       fetchUserDetails();
//     }
//   }, []);
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue, // Used to set default values dynamically
//     formState: { errors },
//   } = useForm({ mode: "onChange" });

//   const password = watch("password", "");

//   // Function to fetch user details
//   const fetchUserDetails = async () => {
//     try {
//      // const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Unauthorized. No token found.");

//       const email = JwtUtil.extractEmail(token);
//       if (!email) throw new Error("Unable to extract email from token.");

//       const response = await axios.get(`${API_BASE}/corporate/${email}`, {
        
//         headers: {
//           Authorization: `Bearer ${token}`,
//          // "Content-Type": "application/json",
//         },
//       });

//       setUserData(response.data);

//       // Prefill form fields using setValue()
//       setValue("companyName", response.data.companyName);
//       setValue("employeeName", response.data.employeeName);
//       setValue("jobTitle", response.data.jobTitle);
//       setValue("countryCode", response.data.countryCode);
//     } catch (err) {
//       toast.error("Failed to load user details.");
//       console.error("Fetch Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       //const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Unauthorized. No token found.");

//       const email = JwtUtil.extractEmail(token);
//       if (!email) throw new Error("Unable to extract email from token.");

//       const apiUrl = "/corporate/update";
//       const payload = { ...data, email };

//       // await axios.put(`http://localhost:8080${apiUrl}`, payload, {
//         // await axios.put(`http://192.168.1.250:8080/CMDA-3.3.9${apiUrl}`, payload, {
//           await axios.put(`${API_BASE}${apiUrl}`, payload, {

//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       toast.success("Profile updated successfully!");
//       navigate('/', { replace: true });
//     } catch (err) {
//       toast.error(err.message || "An error occurred.");
//       console.error("Submit Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//  if (!isLoggedIn) {
//     return (
//       <div>
//         <HomeNavbar />
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white px-4">
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
//     <>
//     <HomeNavbar/>
//     <div
//       className="relative overflow-hidden py-20 px-4 md:px-12 lg:px-24 banner-background"
//       style={{
//         background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(10, 205, 235, 0.7)), url("/public/directly-shot-toy-blocks-yellow-background_1048944-30326937.jpg")',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed',
//       }}
//     >
//     <h1 className="text-3xl font-semibold text-center text-white mb-0">Update Corporate Profile</h1>
// <div className=" flex items-center justify-center gap-24 dark:bg-slate-800 dark:text-white mt-10">
  
// {/* <div className="min-h-screen flex items-center justify-center dark:bg-slate-800 dark:text-white">
     
//      <div className="modal-box dark:bg-slate-800 dark:text-white"> */}
//      {/* <div className="w-xl">
//       <img src="public/up2.jpg" className="w-full h-full"/>
//      </div>
//       */}
//        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white w-74 p-10">
//          {/* Organization Name */}
//          <label className="block">
//            <span>Organization Name:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//              <input type="text" className="grow" placeholder="Organization Name" {...register("companyName")} disabled />
//            </div>
//          </label>
//               <label className="block">
//              <span>Employee Name:</span>
//                  <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                   </svg> 
//                    <input type="text" className="grow" placeholder="Employee Name"  {...register("employeeName"  )}  />
             
//                   {errors.employeeName   }
//                 </div>
//                </label>
//          {/* Job Title */}
//          <label className="block">
//                <span>JobTitle:</span>
//                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//                   <input type="Text" className="grow" placeholder="Your Designation" {...register("jobTitle"  )} />
//                   <div className="input-group-append">
                 
//                   </div>
//                   {errors.jobTitle}
              
//                 </div>
//               </label>

//           <label className="block">
//                      <span>Country Name:</span>
//                      <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                        <IoFlagSharp />
//                        <select {...register("countryCode")} className="w-full py-2 bg-white dark:bg-gray-900 dark:text-white">
//                          <option disabled selected>Country Name</option>
//                          <option>+91 India</option>
//                          <option>+93 Afghanistan</option>
//                          <option>+358 Aland Islands</option>
//                          <option>+82 Korea</option>
//                        </select>
//                        {errors.countryCode && <span className="text-red-500">{errors.countryCode.message}</span>}
//                      </div>
//                    </label>

//          {/* Password */}
//          {/* <label className="block">
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
//          {/* Confirm Password */}
//          {/* <label className="block">
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


//          {/* Add More Details Link */}
//          <div className="flex justify-center items-center my-4">
//            <Link to={"/completeData"} className="flex items-center gap-2 text-blue-500 hover:underline">
//              <TbHexagonPlusFilled className="text-xl" />
//              Add More Details
//            </Link>
//          </div>

//          {/* Submit Button */}
//          <button type="submit" className="btn btn-block btn-warning" disabled={loading}>
//            {loading ? "Updating..." : "Update"}
//          </button>
//        </form>
//       {/* </div>
//    </div> */}
// </div>
// </div>
// </>
//   );
// };

// export default UpdateCorporateProfile;




import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JwtUtil from "../services/JwtUtil";
import { TbHexagonPlusFilled } from "react-icons/tb";
import { IoFlagSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Login from "./Login";
import Navbar from "./Navbar";

const UpdateCorporateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      fetchUserDetails();
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const fetchUserDetails = async () => {
    try {
      if (!token) throw new Error("Unauthorized. No token found.");

      const email = JwtUtil.extractEmail(token);
      if (!email) throw new Error("Unable to extract email from token.");

      const response = await axios.get(`${API_BASE}/corporate/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data);
      setValue("companyName", response.data.companyName);
      setValue("employeeName", response.data.employeeName);
      setValue("jobTitle", response.data.jobTitle);
      setValue("countryCode", response.data.countryCode);
    } catch (err) {
      toast.error("Failed to load user details.");
      console.error("Fetch Error:", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const email = JwtUtil.extractEmail(token);
      if (!email) throw new Error("Unable to extract email from token.");

      const apiUrl = "/corporate/update";
      const payload = { ...data, email };

      await axios.put(`${API_BASE}${apiUrl}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Profile updated successfully!");
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message || "An error occurred.");
      console.error("Submit Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center transition-all duration-300 hover:shadow-xl">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">🔒 Access Required</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Please log in to update your corporate profile.
            </p>
            <div className="mt-6">
              <Login />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-slate-800 dark:to-slate-700">
        <div className="absolute inset-0 opacity-20 bg-[url('/public/directly-shot-toy-blocks-yellow-background_1048944-30326937.jpg')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            Update Corporate Profile
          </h1>
          <p className="text-xl text-cyan-100 dark:text-cyan-200 max-w-3xl mx-auto">
            Keep your organization's information up to date
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Illustration Side (visible on larger screens) */}
              <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-cyan-500 to-blue-500 dark:from-slate-700 dark:to-slate-600 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-6xl mb-4">🏢</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Corporate Profile</h3>
                  <p className="text-cyan-100 dark:text-cyan-200">
                    Update your organization details to maintain accurate records
                  </p>
                </div>
              </div>

              {/* Form Side */}
              <div className="w-full md:w-2/3 p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Organization Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text dark:text-gray-300">Organization Name</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
                        placeholder="Organization Name"
                        {...register("companyName")}
                        disabled
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        🏛️
                      </span>
                    </div>
                  </div>

                  {/* Employee Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text dark:text-gray-300">Employee Name</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
                        placeholder="Employee Name"
                        {...register("employeeName", {
                          required: "Employee name is required",
                        })}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        👤
                      </span>
                    </div>
                    {errors.employeeName && (
                      <span className="text-sm text-red-500 mt-1">
                        {errors.employeeName.message}
                      </span>
                    )}
                  </div>

                  {/* Job Title */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text dark:text-gray-300">Job Title</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
                        placeholder="Your Designation"
                        {...register("jobTitle", {
                          required: "Job title is required",
                        })}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        💼
                      </span>
                    </div>
                    {errors.jobTitle && (
                      <span className="text-sm text-red-500 mt-1">
                        {errors.jobTitle.message}
                      </span>
                    )}
                  </div>

                  {/* Country */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text dark:text-gray-300">Country</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register("countryCode", {
                          required: "Country is required",
                        })}
                        className="select select-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
                      >
                        <option disabled value="">
                          Select Country
                        </option>
                        <option value="+91 India">+91 India</option>
                        <option value="+93 Afghanistan">+93 Afghanistan</option>
                        <option value="+358 Aland Islands">+358 Aland Islands</option>
                        <option value="+82 Korea">+82 Korea</option>
                      </select>
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <IoFlagSharp />
                      </span>
                    </div>
                    {errors.countryCode && (
                      <span className="text-sm text-red-500 mt-1">
                        {errors.countryCode.message}
                      </span>
                    )}
                  </div>

                  {/* Additional Details Link */}
                  <div className="pt-4">
                    <Link
                      to="/completedata"
                      className="flex items-center justify-center gap-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
                    >
                      <TbHexagonPlusFilled className="text-xl" />
                      <span>Add More Details</span>
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className={`btn btn-block btn-primary ${loading ? "loading" : ""}`}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCorporateProfile;