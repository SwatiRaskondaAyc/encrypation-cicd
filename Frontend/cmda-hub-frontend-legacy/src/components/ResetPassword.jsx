import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
    const  {
        register,
        handleSubmit,
        formState:{errors},
      }=useForm();
      const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
    
      const onSubmit = async (data) => {
        try {
          const response = await fetch(`${API_BASE}/users/login`, {
            // const response = await fetch(`${VITE_URL}/api/users/login`, {
              // const response = await fetch("http://192.168.1.250:8080/CMDA-3.3.9/api/users/login", {
              // const response = await fetch("http://192.168.1.250:8080/api/users/login", {

            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.text();
          toast.success(result);
          document.getElementById("my_modal_7").close();
          setTimeout(()=>{
            window.location.reload()
          },1000)
        } catch (error) {
          console.error("Error:", error);
          toast.error("Failed to login. Please try again.");
          setTimeout(()=>{},2000)
        }
        
      };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} method="dialog">
        {/* The button to open modal */}
      <label htmlFor="my_modal_7" className="btn">
        Reset Password
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Reset Password</h3>
          <p className="py-4">
            <label className="block">
              <span className="text-l text-red-500">*</span>
              <span className="font-bold py-10">Password:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 "
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="Password"
                  className="grow"
                  placeholder="Password"
                  {...register("password", { required: true })}
                />
              </div>
              {errors.pass && <span className='text-l text-red-500'>required</span>}
            </label>

            <label className="block">
              <span className="text-l text-red-500">*</span>
              <span className="font-bold">Confirm Password:</span>
              <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 "
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="Password"
                  className="grow"
                  placeholder="Confirm Password"
                  {...register("cp", { required: true })}
                />
              </div>
              {errors.cp && <span className='text-l text-red-500'>required</span>}
            </label>

            
            <a href="/"
              className="btn btn-warning mt-4"
              onClick={() => toast.success("Password Reset Submitted")}
            >
              Submit
            </a>
          </p>
        </div>
      </div>
      </form>
    </div>
  );
};

export default ResetPassword;