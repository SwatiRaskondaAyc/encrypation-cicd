// import React, { useState } from "react";
// import axios from "axios"; // Ensure axios is installed and imported
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { FaArrowLeft } from "react-icons/fa6";
// import { Link } from "react-router-dom";

// const options = [
//   { key: "m", text: "Male", value: "male" },
//   { key: "f", text: "Female", value: "female" },
//   { key: "o", text: "Other", value: "other" },
// ];

// const initialFormData = {
//   gender: "",
//   adharcard: "",
//   pancard: "",
//   address: "",
//   dateofbirth: "",
//   terms: false,
// };

// const CompleteData = () => {
//   const [formData, setFormData] = useState(initialFormData);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmitButton = async (e) => {
//     e.preventDefault();

//     if (
//       formData.gender.trim() !== "" &&
//       formData.adharcard.trim() !== "" &&
//       formData.pancard.trim() !== "" &&
//       formData.address.trim() !== "" &&
//       formData.dateofbirth.trim() !== "" &&
//       formData.terms
//     ) {
//       try {
//         const response = await axios.put(
//           "http://localhost:8080/api/Userprofile/complete-profile",
//           {
//             gender: formData.gender,
//             adharcard: formData.adharcard,
//             pancard: formData.pancard,
//             address: formData.address,
//             dateofbirth: formData.dateofbirth,
//           },
//           { withCredentials: true }
//         );

//         toast.success("Data submitted successfully!");
//         console.log("Response:", response.data);
//         setFormData(initialFormData); // Reset the form
//       } catch (error) {
//         console.error("Error submitting data:", error);
//         toast.error("Failed to submit data. Please try again.");
//       }
//     } else {
//       toast.error("Please fill in all required fields.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">
//       <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center text-lg underline text-yellow-500 cursor-pointer m-3">
//           <Link to="/signup">
//             <FaArrowLeft />
//           </Link>
//           <Link
//             to="/"
//             className="btn btn-sm btn-circle btn-ghost text-black dark:text-white"
//           >
//             ✕
//           </Link>
//         </div>
//         <form onSubmit={handleSubmitButton} className="space-y-4">
//           <h1 className="text-2xl font-bold text-center mb-4">Complete Your Information</h1>

//           <div>
//             <label className="block text-sm font-medium">Gender</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Gender</option>
//               {options.map((option) => (
//                 <option key={option.key} value={option.value}>
//                   {option.text}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Aadhar Card Number</label>
//             <input
//               type="text"
//               name="adharcard"
//               value={formData.adharcard}
//               onChange={handleChange}
//               className="input input-bordered w-full"
//               placeholder="Enter your Aadhar Card number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Pan Card Number</label>
//             <input
//               type="text"
//               name="pancard"
//               value={formData.pancard}
//               onChange={handleChange}
//               className="input input-bordered w-full"
//               placeholder="Enter your Pan Card number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Address</label>
//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               className="textarea textarea-bordered w-full"
//               placeholder="Enter your address"
//             ></textarea>
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Date of Birth</label>
//             <input
//               type="date"
//               name="dateofbirth"
//               value={formData.dateofbirth}
//               onChange={handleChange}
//               className="input input-bordered w-full"
//             />
//           </div>

//           <div>
//             <label className="cursor-pointer flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 name="terms"
//                 checked={formData.terms}
//                 onChange={handleChange}
//                 className="checkbox checkbox-warning"
//               />
//               <span>I agree to the Terms and Conditions</span>
//             </label>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className={`btn btn-warning w-full ${!formData.terms ? "btn-disabled" : ""}`}
//               disabled={!formData.terms}
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CompleteData;

// import React, { useState } from "react";
// import axios from "axios"; // Ensure axios is installed and imported
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { FaArrowLeft } from "react-icons/fa6";
// import { Link } from "react-router-dom";
// import JwtUtil from "../services/JwtUtil"; // Import the JwtUtil file

// const options = [
//   { key: "m", text: "Male", value: "male" },
//   { key: "f", text: "Female", value: "female" },
//   { key: "o", text: "Other", value: "other" },
// ];

// const initialFormData = {
//   gender: "",
//   adharcard: "",
//   pancard: "",
//   address: "",
//   dateofbirth: "",
//   terms: false,
// };

// const CompleteData = () => {
//   const [formData, setFormData] = useState(initialFormData);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmitButton = async (e) => {
//     e.preventDefault();

//     if (
//       formData.gender.trim() !== "" &&
//       formData.adharcard.trim() !== "" &&
//       formData.pancard.trim() !== "" &&
//       formData.address.trim() !== "" &&
//       formData.dateofbirth.trim() !== "" &&
//       formData.terms
//     ) {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) throw new Error("Unauthorized. No token found.");

//         const email = JwtUtil.extractEmail(token);
//         if (!email) throw new Error("Unable to extract email from token.");

//         const response = await axios.put(
//           "http://localhost:8080/api/Userprofile/complete-profile",
//           {
//             ...formData,
//             email, // Include the email in the payload
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         alert("Data submitted successfully!");
//         console.log("Response:", response.data);
//         setFormData(initialFormData); // Reset the form
//       } catch (error) {
//         console.error("Error submitting data:", error);
//         toast.error("Failed to submit data. Please try again.");
//       }
//     } else {
//       toast.error("Please fill in all required fields.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">
//       <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center text-lg underline text-yellow-500 cursor-pointer m-3">
//           <Link to="/signup">
//             <FaArrowLeft />
//           </Link>
//           <Link
//             to="/"
//             className="btn btn-sm btn-circle btn-ghost text-black dark:text-white"
//           >
//             Skip
//           </Link>
//         </div>
//         <h2 className="text-xl font-bold mb-4 text-center">
//           Complete Your Profile
//         </h2>
//         <form onSubmit={handleSubmitButton} className="space-y-4">
//           <div>
//             <label className="block mb-1">Gender</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="select select-bordered w-full dark:bg-slate-900 dark:text-white"
//             >
//               <option value="" disabled>
//                 Select Gender
//               </option>
//               {options.map((option) => (
//                 <option key={option.key} value={option.value}>
//                   {option.text}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block mb-1">Aadhar Card</label>
//             <input
//               type="text"
//               name="adharcard"
//               value={formData.adharcard}
//               onChange={handleChange}
//               className="input input-bordered w-full dark:bg-slate-900 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block mb-1">PAN Card</label>
//             <input
//               type="text"
//               name="pancard"
//               value={formData.pancard}
//               onChange={handleChange}
//               className="input input-bordered w-full dark:bg-slate-900 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               className="input input-bordered w-full dark:bg-slate-900 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Date of Birth</label>
//             <input
//               type="date"
//               name="dateofbirth"
//               value={formData.dateofbirth}
//               onChange={handleChange}
//               className="input input-bordered w-full dark:bg-slate-900 dark:text-white"
//             />
//           </div>
//           {/* <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="terms"
//               checked={formData.terms}
//               onChange={handleChange}
//               className="checkbox checkbox-primary dark:bg-slate-900 dark:text-white"
//             />
//             <label className="ml-2">I agree to the terms and conditions</label>
//           </div> */}
//            <div>
//             <label className="cursor-pointer flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 name="terms"
//                 checked={formData.terms}
//                 onChange={handleChange}
//                 className="checkbox checkbox-warning"
//               />
//               <span>I agree to the Terms and Conditions</span>
//             </label>
//           </div>

//           <button type="submit" className="btn btn-warning w-full">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CompleteData;


// import React, { useEffect, useState } from "react";
// import axios from "axios"; // Ensure axios is installed and imported
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { FaArrowLeft } from "react-icons/fa6";
// import { Link } from "react-router-dom";
// import JwtUtil from "../services/JwtUtil"; // Import the JwtUtil file

// const options = [
//   { key: "m", text: "Male", value: "male" },
//   { key: "f", text: "Female", value: "female" },
//   { key: "o", text: "Other", value: "other" },
// ];

// const initialFormData = {
//   userType: "", // Add userType to distinguish between regular and corporate users
//   gender: "",
//   adharcard: "",
//   pancard: "",
//   address: "",
//   dateofbirth: "",
//   terms: false,
// };

// const CompleteData = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [formData, setFormData] = useState(initialFormData);
//   const [userType, setUserType] = useState("individual");
//   const profilePath = userType === "corporate" ? "/updateCorporateProfile" : "/updateIndividualProfile";

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, []);

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
  
//     if (storedUserType) {
//       setFormData((prev) => ({
//         ...prev,
//         userType: storedUserType, // Ensure correct userType is stored
//       }));
//     }
//   }, []);
  

//   const handleSubmitButton = async (e) => {
//     e.preventDefault();

//     if (
//       formData.userType.trim() !== "" &&
//       formData.gender.trim() !== "" &&
//       formData.adharcard.trim() !== "" &&
//       formData.pancard.trim() !== "" &&
//       formData.address.trim() !== "" &&
//       formData.dateofbirth.trim() !== "" &&
//       formData.terms
//     ) {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) throw new Error("Unauthorized. No token found.");

//         const email = JwtUtil.extractEmail(token);
//         if (!email) throw new Error("Unable to extract email from token.");

//         // API endpoint based on user type
//         const apiUrl =
//           formData.userType === "corporate"
//             ? `${API_BASE}/corporate/complete-profile`
//             : `${API_BASE}/Userprofile/complete-profile`;
//             // ? "http://192.168.1.250:8080/CMDA-3.3.9/api/corporate/complete-profile"
//             // : "http://192.168.1.250:8080/CMDA-3.3.9/api/Userprofile/complete-profile";
//             // ? "http://192.168.1.250:8080/api/corporate/complete-profile"
//             // : "http://192.168.1.250:8080/api/Userprofile/complete-profile";
//             // ? `${VITE_URL}/api/corporate/complete-profile`
//             // : `${VITE_URL}/api/Userprofile/complete-profile`;

//         const response = await axios.put(
//           apiUrl,
//           {
//             ...formData,
//             email, // Include the email in the payload
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         alert("Data submitted successfully!");
//         console.log("Response:", response.data);
//         setFormData(initialFormData); // Reset the form
//       } catch (error) {
//         console.error("Error submitting data:", error);
//         toast.error("Failed to submit data. Please try again.");
//       }
//     } else {
//       toast.error("Please fill in all required fields.");
//     }
//   };

//   return (
//     <div
//     className="relative overflow-hidden py-20 px-4 md:px-12 lg:px-24 banner-background"
//     style={{
//       background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(10, 205, 235, 0.7)), url("/public/directly-shot-toy-blocks-yellow-background_1048944-30326937.jpg")',
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       backgroundAttachment: 'fixed',
//     }}
//   >
//     <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">
//       <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
       
//         {/* <div className="flex justify-between items-center text-lg underline text-yellow-500 cursor-pointer m-3">
//           <Link to="/updateIndividualProfile">
//             <FaArrowLeft />
//           </Link>
//           <Link
//             to="/"
//             className="btn btn-sm btn-circle btn-ghost text-black dark:text-white"
//           >
//             Skip
//           </Link>
//         </div> */}

// <div className="flex justify-between items-center text-lg underline text-yellow-500 cursor-pointer m-3">
//       {/* Back Navigation Based on User Type */}
//       <Link to={profilePath}>
//         <FaArrowLeft />
//       </Link>

//       {/* Skip Button */}
//       <Link to="/" className="btn btn-sm btn-circle btn-ghost text-black dark:text-white">
//         Skip
//       </Link>
//     </div>


//         <h2 className="text-xl font-bold mb-4 text-center">
//           Complete Your Profile
//         </h2>
//         <form onSubmit={handleSubmitButton} className="space-y-4">
//           {/* <div>
//             <label className="block mb-1">User Type</label>
//             <select
//               name="userType"
//               value={formData.userType}
//               onChange={handleChange}
//               className="select select-bordered w-full dark:bg-slate-900 dark:text-white"
//             >
//               <option value="" disabled>
//                 Select User Type
//               </option>
//               <option value="regular">Regular User</option>
//               <option value="corporate">Corporate User</option>
//             </select>
//           </div> */}

// <div>
//   <label className="block mb-1">User Type</label>
//   <input
//     type="text"
//     value={formData.userType === "corporate" ? "Corporate User" : "Individual User"}
//     readOnly
//     className="input input-bordered w-full dark:bg-slate-900 dark:text-white"
//   />
// </div>


//           <div>
//             <label className="block mb-1">Gender</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="select select-bordered w-full dark:bg-slate-900 dark:text-white"
//             >
//               <option value="" disabled>
//                 Select Gender
//               </option>
//               {options.map((option) => (
//                 <option key={option.key} value={option.value}>
//                   {option.text}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block mb-1">Aadhar Card</label>
//             <input
//               type="text"
//               name="adharcard"
//               value={formData.adharcard}
//               onChange={handleChange}
//               className="input input-bordered w-full dark:bg-slate-900 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block mb-1">PAN Card</label>
//             <input
//               type="text"
//               name="pancard"
//               value={formData.pancard}
//               onChange={handleChange}
//               className="input input-bordered w-full dark:bg-slate-900 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               className="input input-bordered w-full dark:bg-slate-900 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Date of Birth</label>
//             <input
//               type="date"
//               name="dateofbirth"
//               value={formData.dateofbirth}
//               onChange={handleChange}
//               className="input input-bordered w-full dark:bg-slate-900 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="cursor-pointer flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 name="terms"
//                 checked={formData.terms}
//                 onChange={handleChange}
//                 className="checkbox checkbox-warning"
//               />
//               <span>I agree to the Terms and Conditions</span>
//             </label>
//           </div>

//           <button type="submit" className="btn btn-warning w-full">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default CompleteData;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { FaArrowLeft, FaUserTie, FaUser, FaIdCard, FaHome, FaBirthdayCake } from "react-icons/fa";
// import { GiReceiveMoney } from "react-icons/gi";
// import { Link } from "react-router-dom";
// import JwtUtil from "../services/JwtUtil";

// const options = [
//   { key: "m", text: "Male", value: "male" },
//   { key: "f", text: "Female", value: "female" },
//   { key: "o", text: "Other", value: "other" },
// ];

// const initialFormData = {
//   userType: "",
//   gender: "",
//   adharcard: "",
//   pancard: "",
//   address: "",
//   dateofbirth: "",
//   terms: false,
// };

// const CompleteData = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [formData, setFormData] = useState(initialFormData);
//   const [userType, setUserType] = useState("individual");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const profilePath = userType === "corporate" ? "/updateCorporateProfile" : "/updateIndividualProfile";

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   useEffect(() => {
//     const storedUserType = localStorage.getItem("userType");
//     if (storedUserType) {
//       setUserType(storedUserType);
//       setFormData(prev => ({ ...prev, userType: storedUserType }));
//     }
//   }, []);

//   const handleSubmitButton = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!formData.terms) {
//       toast.error("Please agree to the Terms and Conditions");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Unauthorized. No token found.");

//       const email = JwtUtil.extractEmail(token);
//       if (!email) throw new Error("Unable to extract email from token.");

//       const apiUrl = formData.userType === "corporate"
//         ? `${API_BASE}/corporate/complete-profile`
//         : `${API_BASE}/Userprofile/complete-profile`;

//       const response = await axios.put(
//         apiUrl,
//         { ...formData, email },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Profile completed successfully!");
//       setFormData(initialFormData);
//     } catch (error) {
//       console.error("Error submitting data:", error);
//       toast.error(error.response?.data?.message || "Failed to submit data. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800">
//       {/* Header Section */}
//       <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-700 to-sky-800 dark:from-slate-800 dark:to-slate-700">
//         <div className="absolute inset-0 opacity-20 bg-[url('/public/directly-shot-toy-blocks-yellow-background_1048944-30326937.jpg')] bg-cover bg-center"></div>
//         <div className="relative max-w-7xl mx-auto text-center">
//           <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
//             Complete Your Profile
//           </h1>
//           <p className="text-lg text-amber-100 dark:text-amber-200">
//             Help us serve you better with complete information
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-2xl mx-auto">
//           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden">
//             {/* Navigation Header */}
//             <div className="bg-gradient-to-r from-sky-700 to-sky-800 dark:from-slate-700 dark:to-slate-600 p-4 flex justify-between items-center">
//               <Link 
//                 to={profilePath} 
//                 className="flex items-center text-white hover:text-amber-100 transition-colors"
//               >
//                 <FaArrowLeft className="mr-2" />
//                 <span>Back</span>
//               </Link>
//               <Link 
//                 to="/" 
//                 className="text-white hover:text-amber-100 transition-colors"
//               >
//                 Skip for now
//               </Link>
//             </div>

//             {/* Form Section */}
//             <div className="p-6 sm:p-8">
//               <form onSubmit={handleSubmitButton} className="space-y-6">
//                 {/* User Type */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text dark:text-gray-300">Account Type</span>
//                   </label>
//                   <div className="relative">
//                     <div className="flex items-center input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white">
//                       {formData.userType === "corporate" ? (
//                         <>
//                           <FaUserTie className="absolute left-3 text-gray-500" />
//                           Corporate Account
//                         </>
//                       ) : (
//                         <>
//                           <FaUser className="absolute left-3 text-gray-500" />
//                           Individual Account
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Gender */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text dark:text-gray-300">Gender</span>
//                   </label>
//                   <div className="relative">
//                     <select
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleChange}
//                       required
//                       className="select select-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
//                     >
//                       <option value="" disabled>Select Gender</option>
//                       {options.map((option) => (
//                         <option key={option.key} value={option.value}>
//                           {option.text}
//                         </option>
//                       ))}
//                     </select>
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                       👤
//                     </span>
//                   </div>
//                 </div>

//                 {/* Aadhar Card */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text dark:text-gray-300">Aadhar Card Number</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="adharcard"
//                       value={formData.adharcard}
//                       onChange={handleChange}
//                       required
//                       pattern="[0-9]{12}"
//                       title="12-digit Aadhar number"
//                       className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
//                       placeholder="1234 5678 9012"
//                     />
//                     <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   </div>
//                 </div>

//                 {/* PAN Card */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text dark:text-gray-300">PAN Card Number</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="pancard"
//                       value={formData.pancard}
//                       onChange={handleChange}
//                       required
//                       pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
//                       title="10-character PAN (e.g., ABCDE1234F)"
//                       className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
//                       placeholder="ABCDE1234F"
//                     />
//                     <GiReceiveMoney className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   </div>
//                 </div>

//                 {/* Address */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text dark:text-gray-300">Address</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       required
//                       className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
//                       placeholder="Your complete address"
//                     />
//                     <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   </div>
//                 </div>

//                 {/* Date of Birth */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text dark:text-gray-300">Date of Birth</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="date"
//                       name="dateofbirth"
//                       value={formData.dateofbirth}
//                       onChange={handleChange}
//                       required
//                       className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
//                     />
//                     <FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   </div>
//                 </div>

//                 {/* Terms and Conditions */}
//                 <div className="form-control pt-4">
//                   <label className="cursor-pointer label justify-start">
//                     <input
//                       type="checkbox"
//                       name="terms"
//                       checked={formData.terms}
//                       onChange={handleChange}
//                       className="checkbox checkbox-tertiary mr-3"
//                     />
//                     <span className="label-text dark:text-gray-300">
//                       I agree to the <Link to="/terms" className="text-sky-600 hover:underline">Terms and Conditions</Link>
//                     </span>
//                   </label>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="pt-6">
//                   <button
//                     type="submit"
//                     className={`btn btn-block bg-sky-800 text-white ${isSubmitting ? "loading" : ""}`}
//                     disabled={isSubmitting || !formData.terms}
//                   >
//                     {isSubmitting ? "Processing..." : "Complete Profile"}
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

// export default CompleteData;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft, FaUserTie, FaUser, FaIdCard, FaHome, FaBirthdayCake } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import JwtUtil from "../services/JwtUtil";
import Navbar from "./Navbar";

const options = [
  { key: "m", text: "Male", value: "male" },
  { key: "f", text: "Female", value: "female" },
  { key: "o", text: "Other", value: "other" },
];

const initialFormData = {
  userType: "",
  gender: "",
  adharcard: "",
  pancard: "",
  address: "",
  dateofbirth: "",
  terms: false,
};

const CompleteData = () => {
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const [formData, setFormData] = useState(initialFormData);
  const [userType, setUserType] = useState("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profilePath = userType === "corporate" ? "/updatecorporateprofile" : "/updateindividualprofile";
 const navigate=useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "dateofbirth") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day
      if (selectedDate > today) {
        toast.error("Date of birth cannot be in the future!");
        return; // Prevent updating state with future date
      }
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
      setFormData(prev => ({ ...prev, userType: storedUserType }));
    }
  }, []);

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.terms) {
      toast.error("Please agree to the Terms and Conditions");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Unauthorized. No token found.");

      const email = JwtUtil.extractEmail(token);
      if (!email) throw new Error("Unable to extract email from token.");

      const apiUrl = formData.userType === "corporate"
        ? `${API_BASE}/corporate/complete-profile`
        : `${API_BASE}/Userprofile/complete-profile`;

      const response = await axios.put(
        apiUrl,
        { ...formData, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Profile completed successfully!");
      setFormData(initialFormData);
      navigate("/")
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(error.response?.data?.message || "Failed to submit data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800 pt-10">
      {/* Header Section */}
      <Navbar />
      <div className="relative mt-6 py-16 px-4  mt-10 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-700 to-sky-800 dark:from-slate-800 dark:to-slate-700">
        <div className="absolute inset-0 opacity-20 bg-[url('/public/directly-shot-toy-blocks-yellow-background_1048944-30326937.jpg')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-lg text-amber-100 dark:text-amber-200">
            Help us serve you better with complete information
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden">
            {/* Navigation Header */}
            <div className="bg-gradient-to-r from-sky-700 to-sky-800 dark:from-slate-700 dark:to-slate-600 p-4 flex justify-between items-center">
              <Link 
                to={profilePath} 
                className="flex items-center text-white hover:text-amber-100 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                <span>Back</span>
              </Link>
              <Link 
                to="/" 
                className="text-white hover:text-amber-100 transition-colors"
              >
                Skip for now
              </Link>
            </div>

            {/* Form Section */}
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmitButton} className="space-y-6">
                {/* User Type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text dark:text-gray-300">Account Type</span>
                  </label>
                  <div className="relative">
                    <div className="flex items-center input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white">
                      {formData.userType === "corporate" ? (
                        <>
                          <FaUserTie className="absolute left-3 text-gray-500" />
                          Corporate Account
                        </>
                      ) : (
                        <>
                          <FaUser className="absolute left-3 text-gray-500" />
                          Individual Account
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text dark:text-gray-300">Gender</span>
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="select select-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="" disabled>Select Gender</option>
                      {options.map((option) => (
                        <option key={option.key} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      👤
                    </span>
                  </div>
                </div>

                {/* Aadhar Card */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text dark:text-gray-300">Aadhar Card Number</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="adharcard"
                      value={formData.adharcard}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{12}"
                      title="12-digit Aadhar number"
                      className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
                      placeholder="1234 5678 9012"
                    />
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* PAN Card */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text dark:text-gray-300">PAN Card Number</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="pancard"
                      value={formData.pancard}
                      onChange={handleChange}
                      required
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      title="10-character PAN (e.g., ABCDE1234F)"
                      className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
                      placeholder="ABCDE1234F"
                    />
                    <GiReceiveMoney className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* Address */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text dark:text-gray-300">Address</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
                      placeholder="Your complete address"
                    />
                    <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text dark:text-gray-300">Date of Birth</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateofbirth"
                      value={formData.dateofbirth}
                      onChange={handleChange}
                      required
                      max={today}
                      className="input input-bordered w-full pl-10 dark:bg-slate-700 dark:text-white"
                    />
                    <FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="form-control pt-4">
                  <label className="cursor-pointer label justify-start">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      className="checkbox checkbox-tertiary mr-3"
                    />
                    <span className="label-text dark:text-gray-300">
                      I agree to the <Link to="/terms" className="text-sky-600 hover:underline">Terms and Conditions</Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className={`btn btn-block bg-sky-800 text-white ${isSubmitting ? "loading" : ""}`}
                    disabled={isSubmitting || !formData.terms}
                  >
                    {isSubmitting ? "Processing..." : "Complete Profile"}
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

export default CompleteData;