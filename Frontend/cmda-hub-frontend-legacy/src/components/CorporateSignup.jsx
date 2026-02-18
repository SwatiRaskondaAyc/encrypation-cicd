// // CorporateSignUp.jsx
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Login from './Login';
// import { data } from 'autoprefixer';
// import { FaIdCard } from 'react-icons/fa';
// import { IoFlagSharp, IoHomeOutline, IoHomeSharp } from 'react-icons/io5';

// const CorporateSignUp = () => {
//   const [showMoreDetails, setShowMoreDetails] = useState(false);
//   const navigate = useNavigate();
//   const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onChange" }); 
//   const password = watch("password", "");
  


   
 

//   const onSubmit = async (data) => {
//     const payload = {
//       companyName: data.companyName,
//       employeeName: data.employeeName,
//       email: data.email,
//       password: data.password,
//       jobTitle: data.jobTitle,
//       role: data.role,
//       mobileNum: data.mobileNum,
//       contryCode: data.contryCode,
//       ...(showMoreDetails && {
//         gender: data.gender,
//         adharcard: data.adharcard,
//         pancard: data.pancard,
//         address: data.address,
//         dateofbirth: data.dateofbirth,
//         terms: false,
//       }),
//     };

//     try {
//       const response = await fetch("http://localhost:8080/api/auth/corporate/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         alert("Registration successful! 🎉")
//         navigate("/");
//       } else {
//         throw new Error(await response.text());
//       }
//     } catch (error) {
//       toast.error("Failed to Signup. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center dark:bg-slate-800 dark:text-white">
//       <Link to="/" className="absolute top-4 left-4 text-black-500 hover:text-black-700">
//                 <IoHomeOutline className="ml-10 mt-10  text-2xl" />
//               </Link>
//       <div className="modal-box dark:bg-slate-800 dark:text-white">
//       <h1 className="text-3xl font-semibold mb-4">
//           Signup
//           <span className=" dark:bg-slate-600 dark:text-white inline-flex items-center rounded-md bg-sky-100 px-2 py-1 text-xs font-large text-black-700 ring-1 ring-inset ring-red-600/10">
//             New User
//           </span>
//         </h1>
//         <div className="form-container"> {/* Maintain the same design */}
//         <h3 className="text-2xl flex justify-center">Create Corporate Account</h3>
//       <form onSubmit={handleSubmit(onSubmit)}>
//       <>
//                  <label className="block">
//                  <span className='text-l text-red-500'>*</span><span>Organization Name:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//                 <input type="text" className="grow" placeholder="Organization Name" {...register("companyName", { required: true })} />
//                 {errors.companyName && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>

//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Employee Name:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg> 
//                 <input type="text" className="grow" placeholder="Employee Name"  {...register("employeeName", { required: true })}  />
              
//                 {errors.ename && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>
//             {/* <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Job Role:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//               <select {...register("role",{required:true})}
                
//                  className=" w-full md:1/2 py-2 bg-white dark:bg-gray-900 dark:text-white  "
//                  >
//                  <option  disabled selected>Job Role</option>
//                     <option>User</option>
//                     <option>Admin</option>
//                     </select>
              
//                 {errors.role && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label> */}

// <label className="block">
//   <span className='text-l text-red-500'>*</span><span>Job Role:</span>
//   <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//       <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//     </svg>
//     <input 
//       type="text"
//       value="Admin" 
//       readOnly 
//       className="w-full md:1/2 py-2 bg-white dark:bg-gray-900 dark:text-white"
//     />
//   </div>
//   <input 
//     type="hidden" 
//     {...register("role")} 
//     value="Admin" 
//   />
// </label>


//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Job Title:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//                 <input type="text" className="grow" placeholder="Job Title" {...register("jobTitle", { required: true })} />
              
//                 {errors.jobTitle && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>

//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Corp Email/Email:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//                   <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
//                   <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
//                 </svg>
//                 <input type="email" className="grow" placeholder="Corp Email" {...register("email", { required: true })} />
              
//                 <div class="input-group-append">
//                   <span className="input-group-text">@example.com</span> 
//                 </div>
//                 {errors.email && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>

//             <label className="block">
//   <span className='text-l text-red-500'>*</span><span>Contact Number:</span>
//   <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//       <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//     </svg>
//     <input 
//       type="text" 
//       className="grow" 
//       placeholder="Contact Number" 
//       {...register("mobileNum", { 
//         required: "Contact number is required",
//         pattern: {
//           value: /^[0-9]{10}$/,  // Regex for exactly 10 digits
//           message: "Contact number must be exactly 10 digits"
//         }
//       })} 
//       maxLength={10} // Ensures user can't enter more than 10 digits
//     />
//   </div>
//   {errors.mobileNum && <span className='text-l text-red-500'>{errors.mobileNum.message}</span>}
// </label>


//   <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Country Name:</span>
//               <div 
//               className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white"
//               >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
              
//               <IoFlagSharp /> 
//                 </svg>
//                 <select 
//                  {...register("countryCode", { required: true })}
//                  className=" w-full py-2 bg-white dark:bg-gray-900 dark:text-white  "
//                  >
//                   <option  disabled selected>Country Name</option>
                  
//                     <option>+91 <span>India</span></option>
//                     <option>+93 <span>Afghanistan</span></option>
//                     <option>+358 <span>Aland Islands</span></option>
//                     <option>+82 <span>Korea</span></option>
//                   </select>
                
//                 {errors.countryCode && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>


// <label className="block">
//         <span className="text-l text-red-500">*</span>
//         <span>Password:</span>
//         <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//             <path
//               fillRule="evenodd"
//               d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
//               clipRule="evenodd"
//             />
//           </svg>
//           <input
//             type="password"
//             className="grow"
//             placeholder="Password"
//             onPaste={(e) => e.preventDefault()}  // Prevent pasting
//             onCopy={(e) => e.preventDefault()}  // Prevent copying
//             {...register("password", {
//               required: "Password is required",
//               pattern: {
//                 value: /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
//                 message: "Must start with a capital, include a number & special character, min 8 chars"
//               }
//             })}
//           />
//         </div>
//         {errors.password && <span className="text-l text-red-500">{errors.password.message}</span>}
//       </label>

//       {/* Confirm Password Field */}
//       <label className="block">
//         <span className="text-l text-red-500">*</span>
//         <span>Confirm Password:</span>
//         <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//             <path
//               fillRule="evenodd"
//               d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
//               clipRule="evenodd"
//             />
//           </svg>
//           <input
//             type="password"
//             className="grow"
//             placeholder="Confirm Password"
//             onPaste={(e) => e.preventDefault()}  // Prevent pasting
//             onCopy={(e) => e.preventDefault()}  // Prevent copying
//             {...register("confirmpassword", {
//               required: "Confirm password is required",
//               validate: (value) => value === password || "Passwords do not match"
//             })}
//           />
//         </div>
//         {errors.confirmpassword && <span className="text-l text-red-500">{errors.confirmpassword.message}</span>}
//       </label>
//             <div className="mt-2 text-sm font-bold ">
//           <p>Note:</p>
//           <ul className="list-disc pl-5">
//             <li>Maximum 8 characters.</li>
//             <li>Staring with uppercase letter (A-Z).
//             </li>
//             <li>At least one lowercase letter (a-z).</li>
//             <li>At least one number (0-9).</li>
//             <li>At least one special character (!@#$%&*?).</li>
//           </ul>
//         </div>
            
          
//             {/* Add More Details button */}
//             <div className="flex justify-center items-center my-4">
//                   <button type="button" onClick={() => setShowMoreDetails(prev => !prev)}>
//                     {showMoreDetails ? "Hide More Details" : "Add More Details"}
//                   </button>
//                 </div>

//                 {/* Additional Fields (only show if showMoreDetails is true) */}
//                 {showMoreDetails && (
//                   <>
//                   <label className="block">
//        <span>gender:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//              </svg>
//              <input type="text" className="grow" placeholder="gender" {...register("gender", { required: false })} />
            
//              {errors.gender && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>

//          <label className="block">
//          <span>adharcard:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <FaIdCard/>
//              <input type="text" className="grow" placeholder="adharcard" {...register("adharcard", { required: false })} />
            
//              {errors.adharcard && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>

//          <label className="block">
//          <span>pancard:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <FaIdCard/>
//              <input type="text" className="grow" placeholder="pancard" {...register("pancard", { required: false })} />
            
//              {errors.pancard && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>

//          <label className="block">
//          <span>address:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
//                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
//              </svg>
//              <input type="text" className="grow" placeholder="address" {...register("address", { required: false })} />
            
//              {errors.address && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>

//          <label className="block">
//        <span>dateofbirth:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//              </svg>
//              <input type="date" className="grow" placeholder="dateofbirth" {...register("dateofbirth", { required: false })} />
            
//              {errors.dateofbirth && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>
//          <br></br>  
//          <div>
//             <label className="cursor-pointer flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 name="terms"
//                 checked={data.terms}
                
//                 className="checkbox checkbox-warning"
//               />
//               <span>I agree to the Terms and Conditions</span>
//             </label>
//           </div>

                
//                </>
//                 )}
           
            
               

      
//       <div className="p-3">
//                   <button className="text-lg btn btn-block btn-warning">Sign Up</button>
//                   </div>

                    
//                   <div>
//                     Already have an account? 
//                     <button className="text-lg underline text-sky-500 cursor-pointer" onClick={() => document.getElementById("my_modal_3").showModal()}>
//                       Login
//                     </button>
//                       <Login/>
                    
//                   </div>
//                     </>
//                     </form>
//           </div>
//             </div>
//     </div>
//   );
// };

// export default CorporateSignUp;


// // CorporateSignUp.jsx
// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Login from './Login';
// import { data } from 'autoprefixer';
// import { FaIdCard } from 'react-icons/fa';
// import { IoFlagSharp, IoHomeOutline, IoHomeSharp } from 'react-icons/io5';
// import HomeNavbar from './HomeNavbar';

// const CorporateSignUp = () => {
//   const [showMoreDetails, setShowMoreDetails] = useState(false);
//   const [verifiedEmail, setVerifiedEmail] = useState('');
//   const navigate = useNavigate();
//   const { register, handleSubmit,setValue, watch, formState: { errors } } = useForm({ mode: "onChange" }); 
//   const password = watch("password", "");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  
//   // useEffect(() => {
//   //   const storedEmail = localStorage.getItem("verifiedEmail");
//   //   if (storedEmail) {
//   //     setVerifiedEmail(storedEmail);
//   //     setValue("email", storedEmail); // Pre-fill the email in the form
//   //   }
//   // }, [setValue]);
//   useEffect(() => {
//     const storedEmail = localStorage.getItem("verifiedEmail");
//     if (storedEmail) {
//       setVerifiedEmail(storedEmail);
//       setValue("email", storedEmail); // Pre-fill the email field
//     }
//   }, [setValue]);
 

//   const onSubmit = async (data) => {
//     const payload = {
//       companyName: data.companyName,
//       employeeName: data.employeeName,
//       email: verifiedEmail || data.email,
//       password: data.password,
//       jobTitle: data.jobTitle,
//       role: data.role,
//       mobileNum: data.mobileNum,
//       contryCode: data.contryCode,
//       ...(showMoreDetails && {
//         gender: data.gender,
//         adharcard: data.adharcard,
//         pancard: data.pancard,
//         address: data.address,
//         dateofbirth: data.dateofbirth,
//         terms: false,
//       }),
//     };

//     try {
//       const response = await fetch(`${API_BASE}/api/auth/corporate/register`, {
//         // const response = await fetch("http://192.168.1.250:8080/CMDA-3.3.9/api/auth/corporate/register", {
//           // const response = await fetch("http://192.168.1.250:8080/api/auth/corporate/register", {

//           // const response = await fetch(`${VITE_URL}/api/auth/corporate/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         alert("Registration successful! 🎉")
//         localStorage.removeItem("verifiedEmail"); // Clear stored email
//         navigate("/");
//       } else {
//         throw new Error(await response.text());
//       }
//     } catch (error) {
//       toast.error("Failed to Signup. Please try again.");
//     }
//   };

//   return (
//     <>
//      <HomeNavbar/>
//    {/* <div className="min-h-screen flex items-center justify-center dark:bg-slate-800 dark:text-white"> */}
//     {/* <HomeNavbar/> */}
//     {/* <div className=""> */}
//       {/* <Link to="/" className="absolute top-4 left-4 text-black-500 hover:text-black-700">
//                 <IoHomeOutline className="ml-10 mt-10  text-2xl" />
//               </Link> */}
              
//       <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow-lg shadow-black mb-5 dark:bg-slate-800 dark:text-white modal-box">
//       <h1 className="text-3xl font-semibold mb-4 text-center">
//           Signup <br/>
//           <span className=" dark:bg-slate-600 dark:text-white inline-flex items-center rounded-md bg-sky-100 px-2 py-1 text-xs font-large text-black-700 ring-1 ring-inset ring-red-600/10">
//             New User
//           </span>
//         </h1>
//         <div className="form-container"> {/* Maintain the same design */}
//         <h3 className="text-2xl flex justify-center">Create Corporate Account</h3>
//       <form onSubmit={handleSubmit(onSubmit)}>
//       <>
//                  <label className="block">
//                  <span className='text-l text-red-500'>*</span><span>Organization Name:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//                 <input type="text" className="grow" placeholder="Organization Name" {...register("companyName", { required: true })} />
//                 {errors.companyName && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>

//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Employee Name:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg> 
//                 <input type="text" className="grow" placeholder="Employee Name"  {...register("employeeName", { required: true })}  />
              
//                 {errors.ename && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>
//             {/* <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Job Role:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//               <select {...register("role",{required:true})}
                
//                  className=" w-full md:1/2 py-2 bg-white dark:bg-gray-900 dark:text-white  "
//                  >
//                  <option  disabled selected>Job Role</option>
//                     <option>User</option>
//                     <option>Admin</option>
//                     </select>
              
//                 {errors.role && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label> */}

// <label className="block">
//   <span className='text-l text-red-500'>*</span><span>Job Role:</span>
//   <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//       <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//     </svg>
//     <input 
//       type="text"
//       value="Admin" 
//       readOnly 
//       className="w-full md:1/2 py-2 bg-white dark:bg-gray-900 dark:text-white"
//     />
//   </div>
//   <input 
//     type="hidden" 
//     {...register("role")} 
//     value="Admin" 
//   />
// </label>


//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Job Title:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//                 <input type="text" className="grow" placeholder="Job Title" {...register("jobTitle", { required: true })} />
              
//                 {errors.jobTitle && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>

//             {/* <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Corp Email/Email:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//                   <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
//                   <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
//                 </svg>
//                 <input type="email" className="grow" placeholder="Corp Email" {...register("email", { required: true })} />
              
//                 <div class="input-group-append">
//                   <span className="input-group-text">@example.com</span> 
//                 </div>
//                 {errors.email && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label> */}


//             <label className="block">
//               <span className='text-l text-red-500'>*</span><span>Email:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//                   <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
//                   <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
//                 </svg>
//                 <input 
//                   type="email"
//                   className="grow" placeholder="Corp Email"
//                   {...register("email", { required: true })}
//                   value={verifiedEmail || ''} // Auto-fill the email
//                   readOnly={!!verifiedEmail} // Make read-only if email is verified
//                 />
//               </div>
//               {errors.email && <span className='text-l text-red-500'>required</span>}
//             </label>

//             <label className="block">
//   <span className='text-l text-red-500'>*</span><span>Contact Number:</span>
//   <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//       <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//     </svg>
//     <input 
//       type="text" 
//       className="grow" 
//       placeholder="Contact Number" 
//       {...register("mobileNum", { 
//         required: "Contact number is required",
//         pattern: {
//           value: /^[0-9]{10}$/,  // Regex for exactly 10 digits
//           message: "Contact number must be exactly 10 digits"
//         }
//       })} 
//       maxLength={10} // Ensures user can't enter more than 10 digits
//     />
//   </div>
//   {errors.mobileNum && <span className='text-l text-red-500'>{errors.mobileNum.message}</span>}
// </label>


//   <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Country Name:</span>
//               <div 
//               className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white"
//               >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
              
//               <IoFlagSharp /> 
//                 </svg>
//                 <select 
//                  {...register("countryCode", { required: true })}
//                  className=" w-full py-2 bg-white dark:bg-gray-900 dark:text-white  "
//                  >
//                   <option  disabled selected>Country Name</option>
                  
//                     <option>+91 <span>India</span></option>
//                     <option>+93 <span>Afghanistan</span></option>
//                     <option>+358 <span>Aland Islands</span></option>
//                     <option>+82 <span>Korea</span></option>
//                   </select>
                
//                 {errors.countryCode && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>


// <label className="block">
//         <span className="text-l text-red-500">*</span>
//         <span>Password:</span>
//         <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//             <path
//               fillRule="evenodd"
//               d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
//               clipRule="evenodd"
//             />
//           </svg>
//           <input
//             type="password"
//             className="grow"
//             placeholder="Password"
//             onPaste={(e) => e.preventDefault()}  // Prevent pasting
//             onCopy={(e) => e.preventDefault()}  // Prevent copying
//             {...register("password", {
//               required: "Password is required",
//               pattern: {
//                 value: /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
//                 message: "Must start with a capital, include a number & special character, min 8 chars"
//               }
//             })}
//           />
//         </div>
//         {errors.password && <span className="text-l text-red-500">{errors.password.message}</span>}
//       </label>

//       {/* Confirm Password Field */}
//       <label className="block">
//         <span className="text-l text-red-500">*</span>
//         <span>Confirm Password:</span>
//         <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//             <path
//               fillRule="evenodd"
//               d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
//               clipRule="evenodd"
//             />
//           </svg>
//           <input
//             type="password"
//             className="grow"
//             placeholder="Confirm Password"
//             onPaste={(e) => e.preventDefault()}  // Prevent pasting
//             onCopy={(e) => e.preventDefault()}  // Prevent copying
//             {...register("confirmpassword", {
//               required: "Confirm password is required",
//               validate: (value) => value === password || "Passwords do not match"
//             })}
//           />
//         </div>
//         {errors.confirmpassword && <span className="text-l text-red-500">{errors.confirmpassword.message}</span>}
//       </label>
//             <div className="mt-2 text-sm font-bold ">
//           <p>Note:</p>
//           <ul className="list-disc pl-5">
//             <li>Maximum 8 characters.</li>
//             <li>Staring with uppercase letter (A-Z).
//             </li>
//             <li>At least one lowercase letter (a-z).</li>
//             <li>At least one number (0-9).</li>
//             <li>At least one special character (!@#$%&*?).</li>
//           </ul>
//         </div>
            
          
//             {/* Add More Details button */}
//             <div className="flex justify-center items-center my-4">
//                   <button type="button" onClick={() => setShowMoreDetails(prev => !prev)}>
//                     {showMoreDetails ? "Hide More Details" : "Add More Details"}
//                   </button>
//                 </div>

//                 {/* Additional Fields (only show if showMoreDetails is true) */}
//                 {showMoreDetails && (
//                   <>
//                   <label className="block">
//        <span>gender:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//              </svg>
//              <input type="text" className="grow" placeholder="gender" {...register("gender", { required: false })} />
            
//              {errors.gender && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>

//          <label className="block">
//          <span>adharcard:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <FaIdCard/>
//              <input type="text" className="grow" placeholder="adharcard" {...register("adharcard", { required: false })} />
            
//              {errors.adharcard && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>

//          <label className="block">
//          <span>pancard:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <FaIdCard/>
//              <input type="text" className="grow" placeholder="pancard" {...register("pancard", { required: false })} />
            
//              {errors.pancard && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>

//          <label className="block">
//          <span>address:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
//                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
//              </svg>
//              <input type="text" className="grow" placeholder="address" {...register("address", { required: false })} />
            
//              {errors.address && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>

//          <label className="block">
//        <span>dateofbirth:</span>
//            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//              </svg>
//              <input type="date" className="grow" placeholder="dateofbirth" {...register("dateofbirth", { required: false })} />
            
//              {errors.dateofbirth && <span className='text-l text-red-500'>required</span>}
//            </div>
//          </label>
//          <br></br>  
//          <div>
//             <label className="cursor-pointer flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 name="terms"
//                 checked={data.terms}
                
//                 className="checkbox checkbox-warning"
//               />
//               <span>I agree to the Terms and Conditions</span>
//             </label>
//           </div>

                
//                </>
//                 )}
           
            
               

      
//       <div className="p-3">
//                   <button className="text-lg btn btn-block btn-warning">Sign Up</button>
//                   </div>

                    
//                   <div>
//                     Already have an account? 
//                     <button className="text-lg underline text-sky-500 cursor-pointer" onClick={() => document.getElementById("my_modal_3").showModal()}>
//                       Login
//                     </button>
//                       <Login/>
                    
//                   </div>
//                     </>
//                     </form>
//           </div>
//             </div>
//     {/* </div>
//    </div> */}


//    </>
//   );
// };

// export default CorporateSignUp;









// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Login from './Login';
// import { FaIdCard, FaBuilding, FaUser, FaBriefcase, FaEnvelope, FaPhone, FaLock, FaGlobe } from 'react-icons/fa';
// import HomeNavbar from './HomeNavbar';

// const CorporateSignUp = () => {
//   const [showMoreDetails, setShowMoreDetails] = useState(false);
//   const [verifiedEmail, setVerifiedEmail] = useState('');
//   const navigate = useNavigate();
//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ mode: "onChange" });
//   const password = watch("password", "");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("verifiedEmail");
//     if (storedEmail) {
//       setVerifiedEmail(storedEmail);
//       setValue("email", storedEmail);
//     }
//   }, [setValue]);

//   const onSubmit = async (data) => {
//     const payload = {
//       companyName: data.companyName,
//       employeeName: data.employeeName,
//       email: verifiedEmail || data.email,
//       password: data.password,
//       jobTitle: data.jobTitle,
//       role: data.role,
//       mobileNum: data.mobileNum,
//       countryCode: data.countryCode,
//       userType: data.userType,
//       ...(showMoreDetails && {
//         gender: data.gender,
//         adharcard: data.adharcard,
//         pancard: data.pancard,
//         address: data.address,
//         dateofbirth: data.dateofbirth,
//         terms: data.terms,
//       }),
//     };

//     try {
//       const response = await fetch(`${API_BASE}/auth/corporate/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         toast.success("Registration successful! 🎉");
//         localStorage.removeItem("verifiedEmail");
//         navigate("/");
//       } else {
//         throw new Error(await response.text());
//       }
//     } catch (error) {
//       toast.error("Failed to Sign up. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
//       <HomeNavbar />
//       <div className="flex-grow flex items-center justify-center p-4">
//         <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//           <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
//             Corporate Sign Up
//             <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-sm font-medium">
//               New User
//             </span>
//           </h1>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <div className="space-y-4">
//               {/* Organization Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Organization Name
//                 </label>
//                 <div className="relative">
//                   <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     placeholder="Enter organization name"
//                     {...register("companyName", { required: "Organization name is required" })}
//                   />
//                   {errors.companyName && (
//                     <span className="text-red-500 text-sm mt-1">{errors.companyName.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Employee Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Employee Name
//                 </label>
//                 <div className="relative">
//                   <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     placeholder="Enter employee name"
//                     {...register("employeeName", { required: "Employee name is required" })}
//                   />
//                   {errors.employeeName && (
//                     <span className="text-red-500 text-sm mt-1">{errors.employeeName.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Job Title */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Job Title
//                 </label>
//                 <div className="relative">
//                   <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     placeholder="Enter job title"
//                     {...register("jobTitle", { required: "Job title is required" })}
//                   />
//                   {errors.jobTitle && (
//                     <span className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Role */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Role
//                 </label>
//                 <div className="relative">
//                   <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     value="Admin"
//                     readOnly
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                   />
//                   <input type="hidden" {...register("role")} value="Admin" />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Email
//                 </label>
//                 <div className="relative">
//                   <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="email"
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     placeholder="Enter corporate email"
//                     {...register("email", { required: "Email is required" })}
//                     value={verifiedEmail || ''}
//                     readOnly={!!verifiedEmail}
//                   />
//                   {errors.email && (
//                     <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Contact Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Contact Number
//                 </label>
//                 <div className="relative">
//                   <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     placeholder="Enter 10-digit number"
//                     maxLength={10}
//                     {...register("mobileNum", {
//                       required: "Contact number is required",
//                       pattern: {
//                         value: /^[0-9]{10}$/,
//                         message: "Contact number must be exactly 10 digits"
//                       }
//                     })}
//                   />
//                   {errors.mobileNum && (
//                     <span className="text-red-500 text-sm mt-1">{errors.mobileNum.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Country Code */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Country
//                 </label>
//                 <div className="relative">
//                   <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <select
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     {...register("countryCode", { required: "Country is required" })}
//                   >
//                     <option value="" disabled selected>Select Country</option>
//                     <option value="+91">India (+91)</option>
//                     <option value="+93">Afghanistan (+93)</option>
//                     <option value="+358">Aland Islands (+358)</option>
//                     <option value="+82">Korea (+82)</option>
//                   </select>
//                   {errors.countryCode && (
//                     <span className="text-red-500 text-sm mt-1">{errors.countryCode.message}</span>
//                   )}
//                 </div>
//               </div>

//               <label className="block">
//   <span className='text-l text-red-500'>*</span><span>User Type:</span>
//   <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//       <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//     </svg>
//     <select
//       {...register("userType", { required: "User type is required" })}
//       className="w-full py-2 bg-white dark:bg-gray-900 dark:text-white"
//     >
//       <option value="" disabled selected>Select User Type</option>
//       <option value="Salaried">Salaried</option>
//       <option value="Housewife">Housewife</option>
//     </select>
//   </div>
//   {errors.userType && <span className='text-l text-red-500'>{errors.userType.message}</span>}
// </label>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Password
//                 </label>
//                 <div className="relative">
//                   <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="password"
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     placeholder="Enter password"
//                     onPaste={(e) => e.preventDefault()}
//                     onCopy={(e) => e.preventDefault()}
//                     {...register("password", {
//                       required: "Password is required",
//                       pattern: {
//                         pattern: {
//                                     value: /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//                                     message: "Must start with a capital, include a number & special character, min 9 chars"
//                                   }

//                       }
//                     })}
//                   />
//                   {errors.password && (
//                     <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Confirm Password
//                 </label>
//                 <div className="relative">
//                   <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="password"
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                     placeholder="Confirm password"
//                     onPaste={(e) => e.preventDefault()}
//                     onCopy={(e) => e.preventDefault()}
//                     {...register("confirmpassword", {
//                       required: "Confirm password is required",
//                       validate: (value) => value === password || "Passwords do not match"
//                     })}
//                   />
//                   {errors.confirmpassword && (
//                     <span className="text-red-500 text-sm mt-1">{errors.confirmpassword.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Password Requirements */}
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 <p className="font-medium">Password must:</p>
//                 <ul className="list-disc pl-5 space-y-1">
//                   <li>Be at least 9 characters</li>
//                   <li>Start with an uppercase letter (A-Z)</li>
//                   <li>Include at least one lowercase letter (a-z)</li>
//                   <li>Include at least one number (0-9)</li>
//                   <li>Include at least one special character (!@#$%&*?)</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Additional Details Section */}
//             <div className="flex justify-center">
//               <button
//                 type="button"
//                 onClick={() => setShowMoreDetails(prev => !prev)}
//                 className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 font-medium"
//               >
//                 {showMoreDetails ? "Hide Additional Details" : "Add More Details"}
//               </button>
//             </div>

//             {showMoreDetails && (
//               <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Gender
//                   </label>
//                   <div className="relative">
//                     <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                       placeholder="Enter gender"
//                       {...register("gender")}
//                     />
//                   </div>
//                 </div>

//                 {/* Aadhar Card */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Aadhar Card
//                   </label>
//                   <div className="relative">
//                     <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                       placeholder="Enter Aadhar card number"
//                       {...register("adharcard")}
//                     />
//                   </div>
//                 </div>

//                 {/* PAN Card */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     PAN Card
//                   </label>
//                   <div className="relative">
//                     <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                       placeholder="Enter PAN card number"
//                       {...register("pancard")}
//                     />
//                   </div>
//                 </div>

//                 {/* Address */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Address
//                   </label>
//                   <div className="relative">
//                     <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                       placeholder="Enter address"
//                       {...register("address")}
//                     />
//                   </div>
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Date of Birth
//                   </label>
//                   <div className="relative">
//                     <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="date"
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
//                       {...register("dateofbirth")}
//                     />
//                   </div>
//                 </div>

//                 {/* Terms and Conditions */}
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
//                     {...register("terms", { required: showMoreDetails ? "You must agree to the terms" : false })}
//                   />
//                   <label className="text-sm text-gray-700 dark:text-gray-300">
//                     I agree to the Terms and Conditions
//                   </label>
//                   {errors.terms && (
//                     <span className="text-red-500 text-sm">{errors.terms.message}</span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors duration-200 font-medium"
//               >
//                 Sign Up
//               </button>
//             </div>

//             {/* Login Link */}
//             <div className="text-center text-sm text-gray-600 dark:text-gray-400">
//               Already have an account?{' '}
//               <button
//                 type="button"
//                 className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 font-medium"
//                 onClick={() => document.getElementById("my_modal_3").showModal()}
//               >
//                 Login
//               </button>
//               <Login />
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CorporateSignUp;


//MAIN CODE BEFORE PROMOCODE

// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Login from './Login';
// import { FaIdCard, FaBuilding, FaUser, FaBriefcase, FaEnvelope, FaPhone, FaLock, FaGlobe, FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaVenusMars, FaPlusCircle, FaMinusCircle, FaCheckCircle, FaChevronDown, FaUserTag, FaUserShield } from 'react-icons/fa';
// import Navbar from './Navbar';

// const CorporateSignUp = () => {
//   const [showMoreDetails, setShowMoreDetails] = useState(false);
//   const [verifiedEmail, setVerifiedEmail] = useState('');
//   const navigate = useNavigate();
//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ mode: "onChange" });
//   const password = watch("password", "");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("verifiedEmail");
//     if (storedEmail) {
//       setVerifiedEmail(storedEmail);
//       setValue("email", storedEmail);
//     }
//   }, [setValue]);

//   const onSubmit = async (data) => {
//     const payload = {
//       companyName: data.companyName,
//       employeeName: data.employeeName,
//       email: verifiedEmail || data.email,
//       password: data.password,
//       jobTitle: data.jobTitle,
//       role: data.role,
//       mobileNum: data.mobileNum,
//       countryCode: data.countryCode,
//       userType: data.userType,
//       ...(showMoreDetails && {
//         gender: data.gender,
//         adharcard: data.adharcard,
//         pancard: data.pancard,
//         address: data.address,
//         dateofbirth: data.dateofbirth,
//         terms: data.terms,
//       }),
//     };

//     try {
//       const response = await fetch(`${API_BASE}/auth/corporate/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         toast.success("Registration successful! 🎉");
//         localStorage.removeItem("verifiedEmail");
//         navigate("/");
//       } else {
//         throw new Error(await response.text());
//       }
//     } catch (error) {
//       toast.error("Failed to Sign up. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300">
//   <Navbar/>
//   <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
//     <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
//       <div className="text-center mb-6">
//         <div className="relative inline-block">
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2 relative z-10">
//             Corporate Sign Up
//           </h1>
//           <div className="absolute -bottom-1 left-0 w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-full z-0"></div>
//         </div>
//         <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium animate-pulse">
//           New Organization
//         </span>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Organization Name */}
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> Organization Name
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaBuilding className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                 placeholder="Enter organization name"
//                 {...register("companyName", { required: "Organization name is required" })}
//               />
//               {errors.companyName && (
//                 <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.companyName.message}</span>
//               )}
//             </div>
//           </div>

//           {/* Employee Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> Employee Name
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaUser className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                 placeholder="Enter employee name"
//                 {...register("employeeName", { required: "Employee name is required" })}
//               />
//               {errors.employeeName && (
//                 <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.employeeName.message}</span>
//               )}
//             </div>
//           </div>

//           {/* Job Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> Job Title
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaBriefcase className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                 placeholder="Enter job title"
//                 {...register("jobTitle", { required: "Job title is required" })}
//               />
//               {errors.jobTitle && (
//                 <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.jobTitle.message}</span>
//               )}
//             </div>
//           </div>

//           {/* Role */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> Role
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaUserShield className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 value="Admin"
//                 readOnly
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white transition-all duration-200 cursor-not-allowed"
//               />
//               <input type="hidden" {...register("role")} value="Admin" />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> Email
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaEnvelope className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <input
//                 type="email"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 bg-gray-50 dark:bg-gray-600"
//                 placeholder="Enter corporate email"
//                 {...register("email", { required: "Email is required" })}
//                 value={verifiedEmail || ''}
//                 readOnly={!!verifiedEmail}
//               />
//               {verifiedEmail && (
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                   <FaCheckCircle className="text-green-500" />
//                 </div>
//               )}
//               {errors.email && (
//                 <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.email.message}</span>
//               )}
//             </div>
//           </div>

//           {/* Contact Number */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> Contact Number
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaPhone className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                 placeholder="Enter 10-digit number"
//                 maxLength={10}
//                 {...register("mobileNum", {
//                   required: "Contact number is required",
//                   pattern: {
//                     value: /^[0-9]{10}$/,
//                     message: "Contact number must be exactly 10 digits"
//                   }
//                 })}
//               />
//               {errors.mobileNum && (
//                 <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.mobileNum.message}</span>
//               )}
//             </div>
//           </div>

//           {/* Country Code */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> Country
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaGlobe className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <select
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 appearance-none"
//                 {...register("countryCode", { required: "Country is required" })}
//               >
//                 <option value="" disabled selected>Select Country</option>
//                 <option value="+91">India (+91)</option>
//                 <option value="+93">Afghanistan (+93)</option>
//                 <option value="+358">Aland Islands (+358)</option>
//                 <option value="+82">Korea (+82)</option>
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                 <FaChevronDown className="text-gray-400 text-xs" />
//               </div>
//               {errors.countryCode && (
//                 <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.countryCode.message}</span>
//               )}
//             </div>
//           </div>

//           {/* User Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> User Type
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaUserTag className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <select
//                 {...register("userType", { required: "User type is required" })}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 appearance-none"
//               >
//                 <option value="" disabled selected>Select User Type</option>
//                 <option value="Salaried">Salaried</option>
//                 <option value="Housewife">Housewife</option>
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                 <FaChevronDown className="text-gray-400 text-xs" />
//               </div>
//               {errors.userType && (
//                 <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.userType.message}</span>
//               )}
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> Password
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaLock className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <input
//                 type="password"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                 placeholder="Enter password"
//                 onPaste={(e) => e.preventDefault()}
//                 onCopy={(e) => e.preventDefault()}
//                 {...register("password", {
//                   required: "Password is required",
//                   pattern: {
//                     value: /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//                     message: "Must start with a capital, include a number & special character, min 9 chars"
//                   }
//                 })}
//               />
//               {errors.password && (
//                 <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.password.message}</span>
//               )}
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               <span className="text-red-500">*</span> Confirm Password
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <FaLock className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//               </div>
//               <input
//                 type="password"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                 placeholder="Confirm password"
//                 onPaste={(e) => e.preventDefault()}
//                 onCopy={(e) => e.preventDefault()}
//                 {...register("confirmpassword", {
//                   required: "Confirm password is required",
//                   validate: (value) => value === password || "Passwords do not match"
//                 })}
//               />
//               {errors.confirmpassword && (
//                 <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.confirmpassword.message}</span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Password Requirements */}
//         <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
//           <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">Password must:</p>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-blue-600 dark:text-blue-400">
//             <li className="flex items-center">
//               <FaCheckCircle className="mr-2 text-xs" /> At least 9 characters
//             </li>
//             <li className="flex items-center">
//               <FaCheckCircle className="mr-2 text-xs" /> Start with uppercase
//             </li>
//             <li className="flex items-center">
//               <FaCheckCircle className="mr-2 text-xs" /> Include lowercase
//             </li>
//             <li className="flex items-center">
//               <FaCheckCircle className="mr-2 text-xs" /> Include number
//             </li>
//             <li className="flex items-center sm:col-span-2">
//               <FaCheckCircle className="mr-2 text-xs" /> Include special character (!@#$%&*?)
//             </li>
//           </ul>
//         </div>

//         {/* Additional Details Button */}
//         <div className="flex justify-center">
//           <button
//             type="button"
//             onClick={() => setShowMoreDetails(prev => !prev)}
//             className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
//           >
//             {showMoreDetails ? (
//               <>
//                 <FaMinusCircle className="mr-2" /> Hide Additional Details
//               </>
//             ) : (
//               <>
//                 <FaPlusCircle className="mr-2" /> Add More Details
//               </>
//             )}
//           </button>
//         </div>

//         {/* Additional Fields */}
//         {showMoreDetails && (
//           <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn  gap-4">
//             {/* Gender */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Gender
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FaVenusMars className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                   type="text"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                   placeholder="Enter gender"
//                   {...register("gender")}
//                 />
//               </div>
//             </div>

//             {/* Aadhar Card */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Aadhar Card
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FaIdCard className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                   type="text"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                   placeholder="Enter Aadhar card number"
//                   {...register("adharcard")}
//                 />
//               </div>
//             </div>

//             {/* PAN Card */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 PAN Card
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FaIdCard className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                   type="text"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                   placeholder="Enter PAN card number"
//                   {...register("pancard")}
//                 />
//               </div>
//             </div>

//             {/* Address */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Address
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FaMapMarkerAlt className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                   type="text"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                   placeholder="Enter address"
//                   {...register("address")}
//                 />
//               </div>
//             </div>

//             {/* Date of Birth */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Date of Birth
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FaCalendarAlt className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                   type="date"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 appearance-none"
//                   {...register("dateofbirth")}
//                 />
//               </div>
//             </div>

//             {/* Terms and Conditions */}
//             <div className="md:col-span-2 flex items-start space-x-3 pt-2">
//               <div className="flex items-center h-5">
//                 <input
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
//                   {...register("terms", { required: showMoreDetails ? "You must agree to the terms" : false })}
//                 />
//               </div>
//               <label className="text-sm text-gray-700 dark:text-gray-300">
//                 I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms and Conditions</a>
//               </label>
//               {errors.terms && (
//                 <span className="text-red-500 text-xs block animate-fadeIn">{errors.terms.message}</span>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Submit Button */}
//         <div className="pt-4">
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center"
//           >
//             <span>Register Organization</span>
//             <FaArrowRight className="ml-2" />
//           </button>
//         </div>

//         {/* Login Link */}
//         {/* <div className="text-center text-sm text-gray-600 dark:text-gray-400">
//           Already have an account?{' '}
//           <button
//             type="button"
//             className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
//             onClick={() => document.getElementById("my_modal_3").showModal()}
//           >
//             Login
//           </button>
//           <Login />
//         </div> */}
//       </form>
//     </div>
//   </div>
// </div>
//   );
// };

// export default CorporateSignUp;

//MAIN CODE BEFORE PROMOCODE

// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Login from './Login';
// import { FaIdCard, FaBuilding, FaUser, FaBriefcase, FaEnvelope, FaPhone, FaLock, FaGlobe, FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaVenusMars, FaPlusCircle, FaMinusCircle, FaCheckCircle, FaChevronDown, FaUserTag, FaUserShield } from 'react-icons/fa';
// import Navbar from './Navbar';

// const CorporateSignUp = () => {
//   const [showMoreDetails, setShowMoreDetails] = useState(false);
//   const [verifiedEmail, setVerifiedEmail] = useState('');
//   const navigate = useNavigate();
//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ mode: "onChange" });
//   const password = watch("password", "");
//   const confirmPassword = watch("confirmpassword");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("verifiedEmail");
//     if (storedEmail) {
//       setVerifiedEmail(storedEmail);
//       setValue("email", storedEmail);
//     }
//   }, [setValue]);

//   const onSubmit = async (data) => {
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     const payload = {
//       companyName: data.companyName,
//       employeeName: data.employeeName,
//       email: verifiedEmail || data.email,
//       password: data.password,
//       confirmpassword: data.confirmpassword,
//       jobTitle: data.jobTitle,
//       role: data.role,
//       mobileNum: data.mobileNum,
//       countryCode: data.countryCode,
//       userType: data.userType,
//       promoCode: data.promoCode, // Added promoCode to payload
//       ...(showMoreDetails && {
//         gender: data.gender,
//         adharcard: data.adharcard,
//         pancard: data.pancard,
//         address: data.address,
//         dateofbirth: data.dateofbirth,
//         terms: data.terms,
//       }),
//     };

//     try {
//       const response = await fetch(`${API_BASE}/auth/corporate/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         toast.success("Registration successful! 🎉");
//         localStorage.removeItem("verifiedEmail");
//         navigate("/");
//       } else {
//         throw new Error(await response.text());
//       }
//     } catch (error) {
//       toast.error("Failed to Sign up. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300">
//       <Navbar />
//       <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
//         <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
//           <div className="text-center mb-6">
//             <div className="relative inline-block">
//               <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2 relative z-10">
//                 Corporate Sign Up
//               </h1>
//               <div className="absolute -bottom-1 left-0 w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-full z-0"></div>
//             </div>
//             <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium animate-pulse">
//               New Organization
//             </span>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Organization Name */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Organization Name
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaBuilding className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                     placeholder="Enter organization name"
//                     {...register("companyName", { required: "Organization name is required" })}
//                   />
//                   {errors.companyName && (
//                     <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.companyName.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Employee Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Employee Name
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaUser className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                     placeholder="Enter employee name"
//                     {...register("employeeName", { required: "Employee name is required" })}
//                   />
//                   {errors.employeeName && (
//                     <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.employeeName.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Job Title */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Job Title
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaBriefcase className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                     placeholder="Enter job title"
//                     {...register("jobTitle", { required: "Job title is required" })}
//                   />
//                   {errors.jobTitle && (
//                     <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.jobTitle.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Role */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Role
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaUserShield className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     type="text"
//                     value="Admin"
//                     readOnly
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white transition-all duration-200 cursor-not-allowed"
//                   />
//                   <input type="hidden" {...register("role")} value="Admin" />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Email
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaEnvelope className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     type="email"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 bg-gray-50 dark:bg-gray-600"
//                     placeholder="Enter corporate email"
//                     {...register("email", { required: "Email is required" })}
//                     value={verifiedEmail || ''}
//                     readOnly={!!verifiedEmail}
//                   />
//                   {verifiedEmail && (
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                       <FaCheckCircle className="text-green-500" />
//                     </div>
//                   )}
//                   {errors.email && (
//                     <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.email.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Contact Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Contact Number
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaPhone className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                     placeholder="Enter 10-digit number"
//                     maxLength={10}
//                     {...register("mobileNum", {
//                       required: "Contact number is required",
//                       pattern: {
//                         value: /^[0-9]{10}$/,
//                         message: "Contact number must be exactly 10 digits"
//                       }
//                     })}
//                   />
//                   {errors.mobileNum && (
//                     <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.mobileNum.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Country Code */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Country
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaGlobe className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 appearance-none"
//                     {...register("countryCode", { required: "Country is required" })}
//                   >
//                     <option value="" disabled selected>Select Country</option>
//                     <option value="+91">India (+91)</option>
//                     <option value="+93">Afghanistan (+93)</option>
//                     <option value="+358">Aland Islands (+358)</option>
//                     <option value="+82">Korea (+82)</option>
//                   </select>
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     <FaChevronDown className="text-gray-400 text-xs" />
//                   </div>
//                   {errors.countryCode && (
//                     <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.countryCode.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* User Type */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> User Type
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaUserTag className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <select
//                     {...register("userType", { required: "User type is required" })}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 appearance-none"
//                   >
//                     <option value="" disabled selected>Select User Type</option>
//                     <option value="Salaried">Salaried</option>
//                     <option value="Housewife">Housewife</option>
//                   </select>
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     <FaChevronDown className="text-gray-400 text-xs" />
//                   </div>
//                   {errors.userType && (
//                     <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.userType.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Password
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaLock className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     type="password"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                     placeholder="Enter password"
//                     onPaste={(e) => e.preventDefault()}
//                     onCopy={(e) => e.preventDefault()}
//                     {...register("password", {
//                       required: "Password is required",
//                       pattern: {
//                         value: /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//                         message: "Must start with a capital, include a number & special character, min 9 chars"
//                       }
//                     })}
//                   />
//                   {errors.password && (
//                     <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.password.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   <span className="text-red-500">*</span> Confirm Password
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaLock className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     type="password"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                     placeholder="Confirm password"
//                     onPaste={(e) => e.preventDefault()}
//                     onCopy={(e) => e.preventDefault()}
//                     {...register("confirmpassword", {
//                       required: "Confirm password is required",
//                       validate: (value) => value === password || "Passwords do not match"
//                     })}
//                   />
//                   {errors.confirmpassword && (
//                     <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.confirmpassword.message}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Promo Code */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Promo Code (Optional)
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaUser className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                   </div>
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                     placeholder="Enter Promo Code"
//                     {...register("promoCode", { required: false })}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Password Requirements */}
//             <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
//               <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">Password must:</p>
//               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-blue-600 dark:text-blue-400">
//                 <li className="flex items-center">
//                   <FaCheckCircle className="mr-2 text-xs" /> At least 9 characters
//                 </li>
//                 <li className="flex items-center">
//                   <FaCheckCircle className="mr-2 text-xs" /> Start with uppercase
//                 </li>
//                 <li className="flex items-center">
//                   <FaCheckCircle className="mr-2 text-xs" /> Include lowercase
//                 </li>
//                 <li className="flex items-center">
//                   <FaCheckCircle className="mr-2 text-xs" /> Include number
//                 </li>
//                 <li className="flex items-center sm:col-span-2">
//                   <FaCheckCircle className="mr-2 text-xs" /> Include special character (!@#$%&*?)
//                 </li>
//               </ul>
//             </div>

//             {/* Additional Details Button */}
//             <div className="flex justify-center">
//               <button
//                 type="button"
//                 onClick={() => setShowMoreDetails(prev => !prev)}
//                 className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
//               >
//                 {showMoreDetails ? (
//                   <>
//                     <FaMinusCircle className="mr-2" /> Hide Additional Details
//                   </>
//                 ) : (
//                   <>
//                     <FaPlusCircle className="mr-2" /> Add More Details
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Additional Fields */}
//             {showMoreDetails && (
//               <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn gap-4">
//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Gender
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <FaVenusMars className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                     </div>
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                       placeholder="Enter gender"
//                       {...register("gender")}
//                     />
//                   </div>
//                 </div>

//                 {/* Aadhar Card */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Aadhar Card
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <FaIdCard className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                     </div>
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                       placeholder="Enter Aadhar card number"
//                       {...register("adharcard")}
//                     />
//                   </div>
//                 </div>

//                 {/* PAN Card */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     PAN Card
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <FaIdCard className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                     </div>
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                       placeholder="Enter PAN card number"
//                       {...register("pancard")}
//                     />
//                   </div>
//                 </div>

//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Address
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <FaMapMarkerAlt className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                     </div>
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
//                       placeholder="Enter address"
//                       {...register("address")}
//                     />
//                   </div>
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Date of Birth
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <FaCalendarAlt className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//                     </div>
//                     <input
//                       type="date"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 appearance-none"
//                       {...register("dateofbirth")}
//                     />
//                   </div>
//                 </div>

//                 {/* Terms and Conditions */}
//                 <div className="md:col-span-2 flex items-start space-x-3 pt-2">
//                   <div className="flex items-center h-5">
//                     <input
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
//                       {...register("terms", { required: showMoreDetails ? "You must agree to the terms" : false })}
//                     />
//                   </div>
//                   <label className="text-sm text-gray-700 dark:text-gray-300">
//                     I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms and Conditions</a>
//                   </label>
//                   {errors.terms && (
//                     <span className="text-red-500 text-xs block animate-fadeIn">{errors.terms.message}</span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center"
//               >
//                 <span>Register Organization</span>
//                 <FaArrowRight className="ml-2" />
//               </button>
//             </div>

//             {/* Login Link */}
//             {/* <div className="text-center text-sm text-gray-600 dark:text-gray-400">
//               Already have an account?{' '}
//               <button
//                 type="button"
//                 className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
//                 onClick={() => document.getElementById("my_modal_3").showModal()}
//               >
//                 Login
//               </button>
//               <Login />
//             </div> */}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CorporateSignUp;





//code for  promocode distribution limit logic
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Login from './Login';
import { FaIdCard, FaBuilding, FaUser, FaBriefcase, FaEnvelope, FaPhone, FaLock, FaGlobe, FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaVenusMars, FaPlusCircle, FaMinusCircle, FaCheckCircle, FaChevronDown, FaUserTag, FaUserShield, FaGift, FaExclamationTriangle } from 'react-icons/fa';
import Navbar from './Navbar';

const CorporateSignUp = () => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ mode: "onChange" });
  const password = watch("password", "");
  const confirmPassword = watch("confirmpassword");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    const storedEmail = localStorage.getItem("verifiedEmail");
    if (storedEmail) {
      setVerifiedEmail(storedEmail);
      setValue("email", storedEmail);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match! 🔒", { duration: 4000 });
      return;
    }

    const payload = {
      companyName: data.companyName,
      employeeName: data.employeeName,
      email: verifiedEmail || data.email,
      password: data.password,
      confirmpassword: data.confirmpassword,
      jobTitle: data.jobTitle,
      role: data.role,
      mobileNum: data.mobileNum,
      countryCode: data.countryCode,
      userType: data.userType,
      promoCode: data.promoCode || null, // Ensure promoCode is null if empty
      ...(showMoreDetails && {
        gender: data.gender,
        adharcard: data.adharcard,
        pancard: data.pancard,
        address: data.address,
        dateofbirth: data.dateofbirth,
        terms: data.terms,
      }),
    };

    try {
      const response = await fetch(`${API_BASE}/auth/corporate/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const message = await response.text();

      // Check the content of the message to determine success or error
      if (message.toLowerCase().includes("successfully")) {
        toast.success("Registration successful! 🎉", { duration: 4000 });
        localStorage.removeItem("verifiedEmail");
        navigate("/");
      } else {
        // Handle specific promo code errors with clear alerts
        if (message.includes("Invalid promo code")) {
          toast.error("Promo code is invalid! ❌ Please check and try again.", { 
            duration: 5000,
            icon: <FaExclamationTriangle className="text-red-500" />
          });
        } else if (message.includes("Promo code is not valid or has expired")) {
          toast.error("Promo code has expired! ⏰ Use a valid active code.", { 
            duration: 5000,
            icon: <FaExclamationTriangle className="text-red-500" />
          });
        } else if (message.includes("Promo code limit has been reached")) {
          toast.error("Promo code limit reached! 🚫 Maximum uses exceeded. Try another code.", { 
            duration: 5000,
            icon: <FaExclamationTriangle className="text-red-500" />
          });
        } else {
          toast.error(message || "Registration failed! 😔 Please try again.", { 
            duration: 5000,
            icon: <FaExclamationTriangle className="text-red-500" />
          });
        }
      }
    } catch (error) {
      toast.error("Failed to Sign up. Please try again. ⚠️", { 
        duration: 5000,
        icon: <FaExclamationTriangle className="text-red-500" />
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2 relative z-10">
                Corporate Sign Up
              </h1>
              <div className="absolute -bottom-1 left-0 w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-full z-0"></div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium animate-pulse">
              New Organization
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organization Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> Organization Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaBuilding className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                    placeholder="Enter organization name"
                    {...register("companyName", { required: "Organization name is required" })}
                  />
                  {errors.companyName && (
                    <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.companyName.message}</span>
                  )}
                </div>
              </div>

              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> Employee Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                    placeholder="Enter employee name"
                    {...register("employeeName", { required: "Employee name is required" })}
                  />
                  {errors.employeeName && (
                    <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.employeeName.message}</span>
                  )}
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> Job Title
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaBriefcase className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                    placeholder="Enter job title"
                    {...register("jobTitle", { required: "Job title is required" })}
                  />
                  {errors.jobTitle && (
                    <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.jobTitle.message}</span>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> Role
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUserShield className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value="Admin"
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white transition-all duration-200 cursor-not-allowed"
                  />
                  <input type="hidden" {...register("role")} value="Admin" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 bg-gray-50 dark:bg-gray-600"
                    placeholder="Enter corporate email"
                    {...register("email", { required: "Email is required" })}
                    value={verifiedEmail || ''}
                    readOnly={!!verifiedEmail}
                  />
                  {verifiedEmail && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaCheckCircle className="text-green-500" />
                    </div>
                  )}
                  {errors.email && (
                    <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.email.message}</span>
                  )}
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> Contact Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaPhone className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    {...register("mobileNum", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Contact number must be exactly 10 digits"
                      }
                    })}
                  />
                  {errors.mobileNum && (
                    <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.mobileNum.message}</span>
                  )}
                </div>
              </div>

              {/* Country Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> Country
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaGlobe className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 appearance-none"
                    {...register("countryCode", { required: "Country is required" })}
                  >
                    <option value="" disabled selected>Select Country</option>
                    <option value="+91">India (+91)</option>
                    <option value="+93">Afghanistan (+93)</option>
                    <option value="+358">Aland Islands (+358)</option>
                    <option value="+82">Korea (+82)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaChevronDown className="text-gray-400 text-xs" />
                  </div>
                  {errors.countryCode && (
                    <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.countryCode.message}</span>
                  )}
                </div>
              </div>

              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> User Type
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUserTag className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <select
                    {...register("userType", { required: "User type is required" })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 appearance-none"
                  >
                    <option value="" disabled selected>Select User Type</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Housewife">Housewife</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaChevronDown className="text-gray-400 text-xs" />
                  </div>
                  {errors.userType && (
                    <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.userType.message}</span>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                    placeholder="Enter password"
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: "Must start with a capital, include a number & special character, min 9 chars"
                      }
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.password.message}</span>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="text-red-500">*</span> Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                    placeholder="Confirm password"
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    {...register("confirmpassword", {
                      required: "Confirm password is required",
                      validate: (value) => value === password || "Passwords do not match"
                    })}
                  />
                  {errors.confirmpassword && (
                    <span className="text-red-500 text-xs mt-1 block animate-fadeIn">{errors.confirmpassword.message}</span>
                  )}
                </div>
              </div>

              {/* Promo Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Promo Code (Optional) <FaGift className="inline ml-1 text-blue-500" />
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaGift className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                    placeholder="Enter Promo Code"
                    {...register("promoCode", { required: false })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a valid promo code for special benefits!</p>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">Password must:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-blue-600 dark:text-blue-400">
                <li className="flex items-center">
                  <FaCheckCircle className="mr-2 text-xs" /> At least 9 characters
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-2 text-xs" /> Start with uppercase
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-2 text-xs" /> Include lowercase
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="mr-2 text-xs" /> Include number
                </li>
                <li className="flex items-center sm:col-span-2">
                  <FaCheckCircle className="mr-2 text-xs" /> Include special character (!@#$%&*?)
                </li>
              </ul>
            </div>

            {/* Additional Details Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowMoreDetails(prev => !prev)}
                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {showMoreDetails ? (
                  <>
                    <FaMinusCircle className="mr-2" /> Hide Additional Details
                  </>
                ) : (
                  <>
                    <FaPlusCircle className="mr-2" /> Add More Details
                  </>
                )}
              </button>
            </div>

            {/* Additional Fields */}
            {showMoreDetails && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaVenusMars className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                      placeholder="Enter gender"
                      {...register("gender")}
                    />
                  </div>
                </div>

                {/* Aadhar Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Aadhar Card
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaIdCard className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                      placeholder="Enter Aadhar card number"
                      {...register("adharcard")}
                    />
                  </div>
                </div>

                {/* PAN Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    PAN Card
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaIdCard className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                      placeholder="Enter PAN card number"
                      {...register("pancard")}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400"
                      placeholder="Enter address"
                      {...register("address")}
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaCalendarAlt className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-blue-400 appearance-none"
                      {...register("dateofbirth")}
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="md:col-span-2 flex items-start space-x-3 pt-2">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                      {...register("terms", { required: showMoreDetails ? "You must agree to the terms" : false })}
                    />
                  </div>
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms and Conditions</a>
                  </label>
                  {errors.terms && (
                    <span className="text-red-500 text-xs block animate-fadeIn">{errors.terms.message}</span>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <span>Register Organization</span>
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CorporateSignUp;