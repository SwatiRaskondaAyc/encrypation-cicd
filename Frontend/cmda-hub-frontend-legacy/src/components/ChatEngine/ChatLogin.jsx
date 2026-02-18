import React from 'react'
import { Link } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import toast from 'react-hot-toast'
import ForgotPassword from '../../components/ForgotPassword.jsx'
import Login from '../Login.jsx'
import chat from '../../../public/chat.png'


const ChatLogin = () => {
  const  {
    register,
    handleSubmit,
    formState:{errors},
  }=useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.text();
      toast.success(result);
      document.getElementById("my_modal_3").close();
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
    <div className='text-black'>
        <dialog id="my_modal_1" className="modal ">
  <div className="modal-box w-[80vw] max-w-none h-[80vh] dark:bg-slate-800 dark:text-white">
    <form  method="dialog">
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
  
    <h3 className="text-2xl my-5">Login to the StockTalks</h3>
    <div className="card lg:card-side bg-base-100 shadow-xl p-5 dark:bg-slate-800 dark:text-white">
            
            <figure>
              <img
                className="w-[400px] h-[400px] object-cover"
                src={chat}
                alt="chat"
              />
            </figure>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="card-title">
                  <span className="text-yellow-500">Let's</span> Connect!
                </h2>
  
              
                <label className="block">
                  <span className="block text-left" >Nick Name:</span>
                  <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                    <input
                      type="text"
                      className="grow"
                      placeholder="Enter your Nick Name"
                      {...register('nickname', { required: true })}
                    />
                    {errors.nickname && <span className="text-red-500">Required</span>}
                  </div>
                </label>
  
               
                <label className="block">
                  <span className="block text-left">Email:</span>
                  <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                    <input
                      type="email"
                      className="grow"
                      placeholder="Enter your email"
                      {...register('email', { required: true })}
                    />
                    {errors.email && <span className="text-red-500">Required</span>}
                  </div>
                </label>
  
                <div className="card-actions justify-end">
                  <Link to={'/chatPage'} className="text-lg btn btn-block btn-warning">Send</Link>
                </div>
              </form>
            </div>
          </div>
    </form>
  </div>
</dialog>
    </div>
  )
}

export default ChatLogin