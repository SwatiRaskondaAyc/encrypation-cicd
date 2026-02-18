import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JwtUtil from "../services/JwtUtil"; // Import the JwtUtil file
import { TbHexagonPlusFilled } from "react-icons/tb";
import { IoFlagSharp } from "react-icons/io5";

const UpdateProfile = () => {
  console.log(import.meta.env.VITE_URL);
  const [activeTab, setActiveTab] = useState("organization");
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Unauthorized. No token found.");
  
      const email = JwtUtil.extractEmail(token);
      if (!email) throw new Error("Unable to extract email from token.");
  
      const apiUrl =
        activeTab === "organization"
          ? "/corporate/update"
          : "/Userprofile/update";
  
      const payload = { ...data, email }; // Ensure email is sent
  
      const response = await axios.put(
        `${API_BASE}${apiUrl}`,
        // `http://192.168.1.250:8080/CMDA-3.3.9${apiUrl}`,
        // `http://192.168.1.250:8080${apiUrl}`,
        // `${VITE_URL}${apiUrl}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      toast.success("Profile updated successfully!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "An error occurred.");
      console.error("Submit Error:", err);
    }
  };
  




  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-slate-800 dark:text-white">
      
      <div className="modal-box dark:bg-slate-800 dark:text-white">
        <h1 className="text-3xl font-semibold mb-4">Update Profile</h1>
        <div className="tabs tabs-lifted">
          <button
            className={`tab ${activeTab === "organization" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("organization")}
          >
            Organization
          </button>
          <button
            className={`tab ${activeTab === "individual" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("individual")}
          >
            Individual
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {activeTab === "organization" && (
            <>
              {/* Organization Fields */}
              <label className="block">
                  <span>Organization Name:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" className="grow" placeholder="Organization Name" {...register("companyName",  )} />
                {errors.companyName  }
              </div>
            </label>
              <label className="block">
              <span>Employee Name:</span>
                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                     <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                   </svg> 
                   <input type="text" className="grow" placeholder="Employee Name"  {...register("employeeName"  )}  />
              
                   {errors.employeeName   }
                 </div>
               </label>




<label className="block">
                <span>JobTitle:</span>
                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                 </svg>
                   <input type="Text" className="grow" placeholder="Your Designation" {...register("jobTitle"  )} />
                   <div className="input-group-append">
                  
                   </div>
                   {errors.jobTitle}
               
                 </div>
               </label>

               <label className="block">
                <span>Password:</span>
                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                     <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                   </svg>
                   <input type="Password" className="grow" placeholder="Password" {...register("password"  )} />
                
                   {errors.password   }
                 </div>
               </label>

               <label className="block">
                <span>Confirm Password:</span>
                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                     <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                   </svg>
                   <input type="Password" className="grow" placeholder="Confirm Password" {  ...register("confirmpassword"  )} />
                
                   {errors.confirmpassword   }
                 </div>
               </label>

            
               <div className="flex justify-center items-center my-4">
               <Link to={'/completedata'} className="flex items-center gap-2 text-blue-500 hover:underline">
                       <TbHexagonPlusFilled className="text-xl" />
                       Add More Details
                     </Link>
   </div>



            </>
          )}
          {activeTab === "individual" && (
            <>
              {/* Individual Fields */}
              <label className="block">
                     <span>user Name:</span>
                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                     <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                   </svg>
                   <input type="text" className="grow" placeholder="User Name" {...register("fullname" )} />
                   {errors. fullname }
                 </div>
               </label>
                 {/* <label className="block">
                <span>Email:</span>
                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                     <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                     <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                   </svg>
                   <input type="email" className="grow" placeholder="Your Email" {...register("email"  )} />
                   <div className="input-group-append">
                     <span className="input-group-text">@example.com</span>
                   </div>
                   {errors.email   }
               
                 </div>
               </label> */}



               <label className="block">
                <span>Password:</span>
                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                     <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                   </svg>
                   <input type="pass" className="grow" placeholder="Password" {...register("password"  )} />
                
                   {errors.password   }
                 </div>
               </label>

               <label className="block">
                <span>Confirm Password:</span>
                 <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                     <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                   </svg>
                   <input type="cp" className="grow" placeholder="Confirm Password" {  ...register("confirmpassword"  )} />
               
                   {errors.confirmpassword   } 
                 </div>
               </label>


               <label className="block">
                <span>Country Name:</span>
                 <div 
              className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
              
              <IoFlagSharp /> 
                </svg>
                <select 
                 {...register("countryCode"  )}
                 className=" w-full md:1/2 py-2 bg-white dark:bg-gray-900 dark:text-white  ">
                  <option  disabled selected>Country Name</option>
                  
                    <option>+91 <span>India</span></option>
                    <option>+93 <span>Afghanistan</span></option>
                    <option>+358 <span>Aland Islands</span></option>
                    <option>+82 <span>Korea</span></option>
                  </select>
                
                {errors.countryCode}
              </div>
            </label>


            <label className="block">
             <span>Contact Number:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70 ">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="number" className="grow" placeholder="Contact Number" {...register("mobileNum"  )} />
                {errors.mobileNum   }
              </div>
            </label>

            <div className="flex justify-center items-center my-4">
                  <Link to={'/completedata'} className="flex items-center gap-2 text-blue-500 hover:underline">
                    <TbHexagonPlusFilled className="text-xl" />
                    Add More Details
                  </Link>
          </div>
            </>
          )}
         <button type="submit" className="btn btn-block btn-warning">
             Update
           </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
