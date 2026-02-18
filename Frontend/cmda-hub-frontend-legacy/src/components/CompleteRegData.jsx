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

// const CompleteRegData = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [formData, setFormData] = useState(initialFormData);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };
//   console.log(import.meta.env.VITE_URL);

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
//           `${API_BASE}/Userprofile/complete-profile`,
//           // "http://192.168.1.250:8080/CMDA-3.3.9/api/Userprofile/complete-profile",
//           // "http://192.168.1.250:8080/api/Userprofile/complete-profile",

//           // `${VITE_URL}/api/Userprofile/complete-profile`,
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

//         // alert("Data submitted successfully!");
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
//             to="/SignUp"
//             className="btn btn-sm btn-circle btn-ghost text-black dark:text-white"
//           >
//             Skip
//           </Link>
//         </div>
//         {/* <h2 className="text-xl font-bold mb-4 text-center">
//           Complete Your Profile
//         </h2> */}
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
// {/* 
//           <button type="submit" className="btn btn-warning w-full">
//             Submit
//           </button> */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CompleteRegData;






import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft, FaIdCard, FaHome, FaBirthdayCake, FaCheck, FaUserEdit, FaShieldAlt } from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";
import { BiMaleFemale } from "react-icons/bi";
import { IoHomeSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import JwtUtil from "../services/JwtUtil";

const CompleteRegData = () => {
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const [formData, setFormData] = useState({
    gender: "",
    adharcard: "",
    pancard: "",
    address: "",
    dateofbirth: "",
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genderOptions = [
    { value: "male", label: "Male", icon: <GiMale className="text-blue-500 text-2xl" /> },
    { value: "female", label: "Female", icon: <GiFemale className="text-pink-500 text-2xl" /> },
    { value: "other", label: "Other", icon: <BiMaleFemale className="text-purple-500 text-2xl" /> },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.terms) {
        throw new Error("Please accept the terms and conditions");
      }

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Unauthorized. No token found.");

      const email = JwtUtil.extractEmail(token);
      if (!email) throw new Error("Unable to extract email from token.");

      await axios.put(
        `${API_BASE}/Userprofile/complete-profile`,
        { ...formData, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Profile completed successfully!");
      setFormData({
        gender: "",
        adharcard: "",
        pancard: "",
        address: "",
        dateofbirth: "",
        terms: false,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to submit data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-cyan-200 rounded-full opacity-20 mix-blend-multiply filter blur-3xl dark:bg-cyan-800 dark:opacity-10"></div>
        <div className="absolute bottom-20 -right-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 mix-blend-multiply filter blur-3xl dark:bg-blue-800 dark:opacity-10"></div>
      </div>

      {/* Header with Navigation */}
      <div className="relative bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
            <IoHomeSharp className="h-6 w-6 mr-1" />
            <span className="text-xl font-semibold">Home</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Complete Your Profile</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-slate-700 dark:to-slate-900 p-6 md:p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <FaUserEdit className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Complete Your Profile</h2>
                  <p className="text-sm opacity-90">Just a few more details to get started</p>
                </div>
              </div>
              <Link 
                to="/dashboard" 
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition text-sm font-medium flex items-center"
              >
                Skip for now
              </Link>
            </div>
            <div className="mt-6 w-full bg-white/30 h-2 rounded-full">
              <div className="bg-white h-2 rounded-full w-3/4"></div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {genderOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                        ${formData.gender === option.value 
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-slate-700 shadow-md' 
                          : 'border-gray-200 dark:border-slate-600 hover:border-cyan-300'}
                      `}
                      onClick={() => setFormData({...formData, gender: option.value})}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {option.icon}
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {option.label}
                        </span>
                      </div>
                      {formData.gender === option.value && (
                        <div className="absolute top-2 right-2 bg-cyan-500 rounded-full p-1">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Aadhar Card */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Aadhar Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaIdCard className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="adharcard"
                    value={formData.adharcard}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX"
                    className="input input-bordered w-full pl-10 dark:bg-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* PAN Card */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PAN Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaIdCard className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="pancard"
                    value={formData.pancard}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className="input input-bordered w-full pl-10 dark:bg-slate-900 dark:text-white uppercase"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHome className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your complete address"
                    className="input input-bordered w-full pl-10 dark:bg-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBirthdayCake className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dateofbirth"
                    value={formData.dateofbirth}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 dark:bg-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start pt-4">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="checkbox checkbox-primary rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  I agree to the <span className="text-cyan-600 hover:underline">Terms and Conditions</span>
                </label>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  By continuing, you acknowledge that you've read and accept our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="px-6 pb-6 text-center border-t border-gray-100 dark:border-slate-700 pt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <FaShieldAlt className="mr-2 text-cyan-500" />
              <span>Secured with end-to-end encryption. Your information is safe with us.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegData;