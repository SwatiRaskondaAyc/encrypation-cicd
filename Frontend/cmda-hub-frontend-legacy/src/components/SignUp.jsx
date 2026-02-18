// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Login from './Login';
// import { TbHexagonPlusFilled } from "react-icons/tb";
// import { IoFlagSharp } from "react-icons/io5";
// import toast from 'react-hot-toast';

// const SignUp = () => {
//   const [activeTab, setActiveTab] = useState("organization");
//   const location = useLocation();
//   const navigate = useNavigate();
//   const from = location.state?.from?.pathname || "/";
//   const { register,
//      handleSubmit, 
//      formState: { errors } } = useForm();

//   const onSubmit = async (data) => {
//     const apiUrl = activeTab === "organization"
//       ? "/api/auth/corporate/register"
//       : "/api/auth/individual/register";

//     const payload = 
//     activeTab === "organization"
//       ? {
//           companyName: data.companyName,
//           employeeName:data.employeeName,
//           email: data.email,
//           password: data.password,
//           jobTitle: data.jobTitle,
//           role:data.role,
//           mobileNum: data.mobileNum,
//         }
//       : {
//           fullname: data.fullname,
//           email: data.email,
//           password: data.password,
//           countryCode: data.countryCode,
//           mobileNum: data.mobileNum,
//         };

//     try {
//       const response = await fetch(`http://localhost:8080${apiUrl}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.text();
//         toast.success(result);
//         navigate(from, { replace: true });
//       } else {
//         const error = await response.text();
//         throw new Error(error);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Failed to Signup. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center dark:bg-slate-800 dark:text-white">
//       <div className="modal-box dark:bg-slate-800 dark:text-white">
//         <h1 className="text-3xl font-semibold mb-4">
//           Signup
//           <span className=" dark:bg-slate-600 dark:text-white inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-large text-black-700 ring-1 ring-inset ring-red-600/10">
//             New User
//           </span>
//         </h1>

        
//         <div className=" dark:bg-slate-800 dark:text-white tabs tabs-lifted">
//           <button
//             className={`dark:bg-slate-800 dark:text-white tab ${activeTab === "organization" ? "tab-active" : ""}`}
//             onClick={() => setActiveTab("organization")}
//           >
//             Organization
//           </button>
//           <button
//             className={`dark:bg-slate-800 dark:text-white tab ${activeTab === "individual" ? "tab-active" : ""} `}
//             onClick={() => setActiveTab("individual")}
//           >
//             Individual
//           </button>
//         </div>

//         {/* Form */}
//         <div className=" dark:bg-slate-800 dark:text-white bg-base-100 border-base-300 rounded-box p-6">
//           <form className='dark:bg-slate-800 dark:text-white' onSubmit={handleSubmit(onSubmit)}>
//           <Link to={'/'} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</Link>
//           <h3 className="text-2xl flex justify-center">Create Account</h3>
//           <br />
//             {activeTab === "organization" && (
//               <>
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
//             <label className="block">
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
//             </label>

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
//             <span className='text-l text-red-500'>*</span><span>Contact Number:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//                 <input type="number" className="grow" placeholder="Contact Number" {...register("mobileNum", { required: true })} />
//                 {errors.mobileNum && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>
            
//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Password:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
//                 </svg>
//                 <input type="password" className="grow" placeholder="Password" {...register("password", { required: true })} />
                
//                 {errors.password && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>

//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Confirm Password:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
//                 </svg>
//                 <input type="password" className="grow" placeholder="Confirm Password" {...register("confirmpassword", { required: true })} />
                
//                 {errors.confirmpassword && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>

           
            
               

//       <div className="flex justify-center items-center my-4">
//                         <Link to={'/completeData'} className="flex items-center gap-2 text-blue-500 hover:underline">
//                           <TbHexagonPlusFilled className="text-xl" />
//                           Add More Details
//                         </Link>
//                 </div>
// <div className="p-3">
//             <button className="text-lg btn btn-block btn-warning">Sign Up</button>
//             </div>

              
//             <div>
//               Already have an account? 
//               <button className="text-lg underline text-blue-500 cursor-pointer" onClick={() => document.getElementById("my_modal_3").showModal()}>
//                 Login
//               </button>
//                 <Login/>
//                 <label className="label" >
//                             <a href="#" className="label-text-alt link dark:text-white hover:text-blue-500 dark:hover:text-blue-300 hover:underline hover:bg-blue-100 dark:hover:bg-warning-700">Forgot password?</a>
//                           </label>
//             </div>
//               </>
//             )}
//             {activeTab === "individual" && (
//               <>
//                  <label className="block">
//                  <span className='text-l text-red-500'>*</span><span>Full Name:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//                 <input type="text" className="grow" placeholder="Full Name" {...register("fullname", { required: true })} />
                
//                 {errors.fullname && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>


//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Email:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//                   <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
//                   <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
//                 </svg>
//                 <input type="email" className="grow" placeholder="Your Email" {...register("email", { required: true })} />
//                 <div className="input-group-append">
//                   <span className="input-group-text">@example.com</span>
//                 </div>
//                 {errors.email && <span className='text-l text-red-500'>required</span>}
               
//               </div>
//             </label>



//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Password:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
//                 </svg>
//                 <input type="password" className="grow" placeholder="Password" {...register("password", { required: true })} />
                
//                 {errors.pass && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>

//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Confirm Password:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
//                 </svg>
//                 <input type="password" className="grow" placeholder="Confirm Password" {...register("confirmpassword", { required: true })} />
               
//                 {errors.confirmpassword && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>


//             <label className="block">
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


//             <label className="block">
//             <span className='text-l text-red-500'>*</span><span>Contact Number:</span>
//               <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
//                   <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
//                 </svg>
//                 <input type="number" className="grow" placeholder="Contact Number" {...register("mobileNum", { required: true })} />
//                 {errors.mobileNum && <span className='text-l text-red-500'>required</span>}
//               </div>
//             </label>

//             <div className="flex justify-center items-center my-4">
//                   <Link to={'/completeData'} className="flex items-center gap-2 text-blue-500 hover:underline">
//                     <TbHexagonPlusFilled className="text-xl" />
//                     Add More Details
//                   </Link>
//           </div>

//             <div className="p-3">
//             <button className="text-lg btn btn-block btn-warning">Sign Up</button>
//             </div>
            

//             <div className="p-2">
//               <button onClick={() => toast.error("Sign in with Google functionality coming soon!")} className="text-lg btn btn-block btn-warning">
//                 <img src="/Google_logo.png" alt="Google Logo" className="w-12 h-12" />
//                 Sign in with Google
//               </button>
//             </div>

//             <div>
//               Already have an account? 
//               <button className="text-lg underline text-blue-500 cursor-pointer" onClick={() => document.getElementById("my_modal_3").showModal()}>
//                 Login
//               </button>
//               <Login/>
//               <label className="label" >
//                           <a href="#" className="label-text-alt link dark:text-white hover:text-blue-500 dark:hover:text-blue-300 hover:underline hover:bg-blue-100 dark:hover:bg-warning-700">Forgot password?</a>
//                         </label>
//                         </div>
//               </>
//             )}
            
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import { TbHexagonPlusFilled } from "react-icons/tb";
import { IoFlagSharp } from "react-icons/io5";
import toast from 'react-hot-toast';

const SignUp = () => {
  console.log(import.meta.env.VITE_URL);
  const [activeTab, setActiveTab] = useState("organization");
  const location = useLocation();
  const [showMoreDetails, setShowMoreDetails] = useState(false);  
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const { register,
     handleSubmit, 
     formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const apiUrl = activeTab === "organization"
      ? "/auth/corporate/register"
      : "/auth/individual/register";

    const payload = 
    activeTab === "organization"
      ? {
          companyName: data.companyName,
          employeeName:data.employeeName,
          email: data.email,
          password: data.password,
          jobTitle: data.jobTitle,
          role:data.role,
          mobileNum: data.mobileNum,
          ...(showMoreDetails && {
            gender: data.gender, 
            adharcard:data.adharcard,
            pancard: data.pancard,
            address: data.address,
            dateofbirth: data.dateofbirth,
            terms:false
            
          }),
        }
      : {
          fullname: data.fullname,
          email: data.email,
          password: data.password,
          countryCode: data.countryCode,
          mobileNum: data.mobileNum,
          ...(showMoreDetails && {
            gender: data.gender,
            adharcard:data.adharcard,
            pancard: data.pancard,
            address: data.address,
            dateofbirth: data.dateofbirth,
            terms:false 
            
          }),
        };

    try {
      const response = await fetch(`localhost:8080${apiUrl}`, {
        // const response = await fetch(`http://192.168.1.250:8080/CMDA-3.3.9${apiUrl}`, {
          // const response = await fetch(`http://192.168.1.250:8080${apiUrl}`, {

          // const response = await fetch(`${VITE_URL}'${apiUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.text();
        toast.success(result);
        navigate(from, { replace: true });
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to Signup. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-slate-800 dark:text-white">
      <div className="modal-box dark:bg-slate-800 dark:text-white">
        <h1 className="text-3xl font-semibold mb-4">
          Signup
          <span className=" dark:bg-slate-600 dark:text-white inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-large text-black-700 ring-1 ring-inset ring-red-600/10">
            New User
          </span>
        </h1>

        
        <div className=" dark:bg-slate-800 dark:text-white tabs tabs-lifted">
          <button
            className={`dark:bg-slate-800 dark:text-white tab ${activeTab === "organization" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("organization")}
            
          >
            Organization
          </button>
          <button
            className={`dark:bg-slate-800 dark:text-white tab ${activeTab === "individual" ? "tab-active" : ""} `}
            onClick={() => setActiveTab("individual")}
          >
            Individual
          </button>
        </div>

        {/* Form */}
        <div className=" dark:bg-slate-800 dark:text-white bg-base-100 border-base-300 rounded-box p-6">
          <form className='dark:bg-slate-800 dark:text-white' onSubmit={handleSubmit(onSubmit)}>
          <Link to={'/'} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</Link>
          <h3 className="text-2xl flex justify-center">Create Account</h3>
          <br />
            {activeTab === "organization" && (
              <>
                 <label className="block">
                 <span className='text-l text-red-500'>*</span><span>Organization Name:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" placeholder="Organization Name" {...register("companyName", { required: true })} />
                {errors.companyName && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Employee Name:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg> 
                <input type="text" className="grow" placeholder="Employee Name"  {...register("employeeName", { required: true })}  />
              
                {errors.ename && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>
            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Job Role:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
              <select {...register("role",{required:true})}
                
                 className=" w-full md:1/2 py-2 bg-white dark:bg-gray-900 dark:text-white  "
                 >
                 <option  disabled selected>Job Role</option>
                    <option>User</option>
                    <option>Admin</option>
                    </select>
              
                {errors.role && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Job Title:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" placeholder="Job Title" {...register("jobTitle", { required: true })} />
              
                {errors.jobTitle && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Corp Email/Email:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input type="email" className="grow" placeholder="Corp Email" {...register("email", { required: true })} />
              
                <div class="input-group-append">
                  <span className="input-group-text">@example.com</span> 
                </div>
                {errors.email && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Contact Number:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="number" className="grow" placeholder="Contact Number" {...register("mobileNum", { required: true })} />
                {errors.mobileNum && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Password:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input type="password" className="grow" placeholder="Password" {...register("password", { required: true })} />
                
                {errors.pass && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Confirm Password:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input type="password" className="grow" placeholder="Confirm Password" {...register("confirmpassword", { required: true })} />
               
                {errors.confirmpassword && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>
            
          
            {/* Add More Details button */}
            <div className="flex justify-center items-center my-4">
                  <button type="button" onClick={() => setShowMoreDetails(prev => !prev)}>
                    {showMoreDetails ? "Hide More Details" : "Add More Details"}
                  </button>
                </div>

                {/* Additional Fields (only show if showMoreDetails is true) */}
                {showMoreDetails && (
                  <>
                     <label className="block">
            <span className='text-l text-red-500'>*</span><span>gendervxbv:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" placeholder="gender" {...register("gender", { required: true })} />
               
                {errors.gender && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>adharcard:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" placeholder="adharcard" {...register("adharcard", { required: true })} />
               
                {errors.adharcard && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>pancard:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" placeholder="pancard" {...register("pancard", { required: true })} />
               
                {errors.pancard && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>address:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input type="text" className="grow" placeholder="address" {...register("address", { required: true })} />
               
                {errors.address && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>dateofbirth:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" placeholder="dateofbirth" {...register("dateofbirth", { required: true })} />
               
                {errors.dateofbirth && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>
                   
                    
                   
                  </>
                )}
           
            
               

      
<div className="p-3">
            <button className="text-lg btn btn-block btn-warning">Sign Up</button>
            </div>

              
            <div>
              Already have an account? 
              <button className="text-lg underline text-blue-500 cursor-pointer" onClick={() => document.getElementById("my_modal_3").showModal()}>
                Login
              </button>
                <Login/>
                <label className="label" >
                            <a href="#" className="label-text-alt link dark:text-white hover:text-blue-500 dark:hover:text-blue-300 hover:underline hover:bg-blue-100 dark:hover:bg-warning-700">Forgot password?</a>
                          </label>
            </div>
              </>
            )}
            {activeTab === "individual" && (
              <>
                 <label className="block">
                 <span className='text-l text-red-500'>*</span><span>Full Name:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" placeholder="Full Name" {...register("fullname", { required: true })} />
                
                {errors.fullname && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>


            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Email:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input type="email" className="grow" placeholder="Your Email" {...register("email", { required: true })} />
                <div className="input-group-append">
                  <span className="input-group-text">@example.com</span>
                </div>
                {errors.email && <span className='text-l text-red-500'>required</span>}
               
              </div>
            </label>



            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Password:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input type="password" className="grow" placeholder="Password" {...register("password", { required: true })} />
                
                {errors.pass && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>

            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Confirm Password:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input type="password" className="grow" placeholder="Confirm Password" {...register("confirmpassword", { required: true })} />
               
                {errors.confirmpassword && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>


            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Country Name:</span>
              <div 
              className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white"
              >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
              
              <IoFlagSharp /> 
                </svg>
                <select 
                 {...register("countryCode", { required: true })}
                 className=" w-full py-2 bg-white dark:bg-gray-900 dark:text-white  "
                 >
                  <option  disabled selected>Country Name</option>
                  
                    <option>+91 <span>India</span></option>
                    <option>+93 <span>Afghanistan</span></option>
                    <option>+358 <span>Aland Islands</span></option>
                    <option>+82 <span>Korea</span></option>
                  </select>
                
                {errors.countryCode && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>


            <label className="block">
            <span className='text-l text-red-500'>*</span><span>Contact Number:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="number" className="grow" placeholder="Contact Number" {...register("mobileNum", { required: true })} />
                {errors.mobileNum && <span className='text-l text-red-500'>required</span>}
              </div>
            </label>
            <div className="mt-2 text-sm font-bold ">
          <p>Note:</p>
          <ul className="list-disc pl-5">
            <li>Maximum 8 characters.</li>
            <li>Staring with uppercase letter (A-Z).
            </li>
            <li>At least one lowercase letter (a-z).</li>
            <li>At least one number (0-9).</li>
            <li>At least one special character (!@#$%&*?).</li>
          </ul>
        </div>

              {/* Add More Details button */}
              <div className="flex justify-center items-center my-4">
                  <button type="button" onClick={() => setShowMoreDetails(prev => !prev)}>
                    {showMoreDetails ? "Hide More Details" : "Add More Details"}
                  </button>
                </div>

                {/* Additional Fields (only show if showMoreDetails is true) */}
                {showMoreDetails && (
                  <>
                    <label className="block">
                      <span>gender:</span>
                      <input type="text" className="input input-bordered dark:bg-slate-900 dark:text-white" {...register("gender")} />
                    </label>
                    <label className="block">
                      <span>adharcard:</span>
                      <input type="text" className="input input-bordered dark:bg-slate-900 dark:text-white" {...register("adharcard")} />
                    </label>
                    <label className="block">
                      <span>pancard:</span>
                      <input type="text" className="input input-bordered dark:bg-slate-900 dark:text-white" {...register("pancard")} />
                    </label>
                    <label className="block">
                      <span>address:</span>
                      <input type="text" className="input input-bordered dark:bg-slate-900 dark:text-white" {...register("address")} />
                    </label>
                    <label className="block">
                      <span>dateofbirth:</span>
                      <input type="text" className="input input-bordered dark:bg-slate-900 dark:text-white" {...register("dateofbirth")} />
                    </label>
                   
                  </>
                )}
          

            <div className="p-3">
            <button className="text-lg btn btn-block btn-warning">Sign Up</button>
            </div>
            

            <div className="p-2">
              <button onClick={() => toast.error("Sign in with Google functionality coming soon!")} className="text-lg btn btn-block btn-warning">
                <img src="/Google_logo.png" alt="Google Logo" className="w-12 h-12" />
                Sign in with Google
              </button>
            </div>

            <div>
              Already have an account? 
              <button className="text-lg underline text-blue-500 cursor-pointer" onClick={() => document.getElementById("my_modal_3").showModal()}>
                Login
              </button>
              <Login/>
              <label className="label" >
                          <a href="#" className="label-text-alt link dark:text-white hover:text-blue-500 dark:hover:text-blue-300 hover:underline hover:bg-blue-100 dark:hover:bg-warning-700">Forgot password?</a>
                        </label>
                        </div>
              </>
            )}
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;


