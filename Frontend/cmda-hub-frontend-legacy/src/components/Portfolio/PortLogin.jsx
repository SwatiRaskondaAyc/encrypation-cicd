import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import emailLogo from '../../../public/email.png'
import { EyeIcon, EyeOffIcon } from "lucide-react";

const PortLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');
   
  


  // OTP states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const otpModalRef = useRef(null);
  const [signupType, setSignupType]= useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const signupModalRef = useRef(null); 
  const userTypeModalRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
 
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event("storage"));
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
    navigate('/');
  };


    
  const closeSignupModal = () => {
    if (signupModalRef.current) {
      signupModalRef.current.close();
    }
  };



  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        // 'http://localhost:8080/api/auth/login',
        // 'http://192.168.1.250:8080/CMDA-3.3.9/api/auth/login',
        // 'http://192.168.1.250:8080/api/auth/login',
        `${API_BASE}/auth/login`,
        { email: data.email, password: data.password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        const { token, userType, email } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userEmail', email);
	      window.dispatchEvent(new Event("storage"));
        toast.success('Successfully Logged In!');
        setIsModalOpen(false);
	      setIsLoggedIn(true);
        navigate('/portDash');
      } else {
         toast.error('Invalid credentials. Please try again.');
      }
    } catch (err) {
     toast.error('Login failed. Please check your email and password.');
    }
  };

  // Function to send OTP
  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    try {
      const response = await axios.post(
        // 'http://localhost:8080/api/auth/send-otp',
        // 'http://192.168.1.250:8080/CMDA-3.3.9/api/auth/send-otp',
        // 'http://192.168.1.250:8080/api/auth/send-otp',
        `${API_BASE}/auth/send-otp`,
        { email }
      );
      
      if (response.status === 200) {
        toast.success('OTP sent successfully!');
        setOtpSent(true);
      }
    } catch (err) {
      toast.error('Failed to send OTP. Try again.');
      console.error(err);
    }
  };

  // Verify OTP and open user type modal
  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        // 'http://localhost:8080/api/auth/verify-otp',
        // 'http://192.168.1.250:8080/CMDA-3.3.9/api/auth/verify-otp',
        // 'http://192.168.1.250:8080/api/auth/verify-otp',
        `${API_BASE}/auth/verify-otp`,
        { email, otp }
      );

      if (response.status === 200) {
        toast.success('OTP verified!');

        localStorage.setItem('verifiedEmail', email);

        // Open the User Type Modal
        setTimeout(() => {
          userTypeModalRef.current.showModal();
        }, 500);
      } else {
        toast.error('Invalid OTP. Try again.');
      }
    } catch (err) {
      toast.error('OTP verification failed.');
      console.error(err);
    }
  };

  // Handle User Type Selection
  const handleUserTypeSelection = (type) => {
    navigate('/register', { state: { email, signupType: type } });
    userTypeModalRef.current.close(); // Close modal after selection
  };

  return (
    <div className="text-black">
      {isModalOpen && (
      <dialog  open id="my_modal_3" className="modal">
        <div className="modal-box dark:bg-slate-800 dark:text-white">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsModalOpen(false)}
          >
            ✕
          </button>

          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            <h3 className="text-2xl">Login</h3>
            <div className="py-1">
              <label className="mt-2 text-left block">
                <span>User Name:</span>
                <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                  <input
                    type="text"
                    className="grow"
                    placeholder="UserName"
                    {...register('email', { required: false })}
                  />
                  {errors.email && <span className="text-2xl text-red-500">*</span>}
                </div>
              </label>
              <label className="mt-2 text-left block">
                <span>Password:</span>
                <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="grow"
                    placeholder="Password"
                    {...register('password', { required: false })}
                  />
 		 <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  {errors.password && <span className="text-2xl text-red-500">*</span>}
                </div>
              </label>

              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className="p-2">
                <button type="submit" className="text-lg btn btn-block btn-warning">
                  Login
                </button>
		<Link to="/forgotpassword" className="text-sm text-blue-500 hover:underline">
                    Forgot Password?
                  </Link>
              </div>
              <div className='p-2'>
                  Not registered?{' '} 
                  
                </div>
              {/* Register with Email Option */}
              <div className="flex justify-around mt-2">
               <div className='p-2'>
               <button className="text-lg btn btn-block btn-warning">
                    <img src="/Google_logo.png" alt="Google Logo" className="w-12 " />
                    Sign in with Google
                  </button>
                </div>
                 <div  className='p-2'>
                
                    {/* <button
                          type="button"  // <-- Prevents accidental form submission
                          className="text-lg btn btn-block btn-warning"
                          onClick={() => {
                            document.getElementById('my_modal_3').close(); // Close login modal
                            setTimeout(() => otpModalRef.current.showModal(), 300); // Open OTP modal after delay
                          }}
                        >
                          <img src={emailLogo} alt="Email Logo" className="w-12" />
                          Sign in with Email
                    </button> */}

<button
  type="button"
  className="text-lg btn btn-block btn-warning"
  onClick={() => {
    const loginModal = document.getElementById('my_modal_3');

    if (loginModal) {
      loginModal.close(); // Close login modal if it's a <dialog> element
      loginModal.style.display = "none"; // Extra step in case it's using CSS display property
    }

    setTimeout(() => {
      if (otpModalRef.current) {
        otpModalRef.current.showModal(); // Open OTP modal
      } else {
        console.error("OTP Modal reference is null");
      }
    }, 300);
  }}
>
  <img src={emailLogo} alt="Email Logo" className="w-12" />
  Sign in with Email
</button>


                         
  
                 </div>
                 <br />
                
              </div>
            </div>
          </form>
        </div>
      </dialog>
)}

      {/* OTP Modal */}
      <dialog ref={otpModalRef} className="modal">
        <div className="modal-box dark:bg-slate-800 dark:text-white">
          <h3 className="text-2xl">Register with Email</h3>
          <label className="mt-2 text-left block">
            <span>Email:</span>
            <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
              <input
                type="email"
                className="grow"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>
          <button
            className="btn btn-block btn-primary mt-2"
            onClick={sendOtp}
            disabled={otpSent}
          >
            {otpSent ? 'OTP Sent ✔' : 'Send OTP'}
          </button>

          {otpSent && (
            <>
              <label className="mt-2 text-left block">
                <span>Enter OTP:</span>
                <div className="input input-bordered flex items-center gap-2 dark:bg-slate-900 dark:text-white">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </label>
              <button className="btn btn-block btn-success mt-2" onClick={verifyOtp}>
                Verify OTP
              </button>
            </>
          )}

          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => otpModalRef.current.close()}
          >
            ✕
          </button>
        </div>
      </dialog>

      {/* User Type Selection Modal */}
      <dialog ref={userTypeModalRef} className="modal">
        <div className="modal-box dark:bg-slate-800 dark:text-white">
          <h3 className="text-2xl">Choose Signup Type</h3>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="signupType"
              value="individual"
              onChange={() => setSignupType('individual')}
            />
            Individual Signup
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="signupType"
              value="corporate"
              onChange={() => setSignupType('corporate')}
            />
            Corporate Signup
          </label>
          <div className="p-2">
            <button
              className="text-lg btn btn-block btn-warning"
              onClick={() => {
                if (signupType === 'individual') navigate('/individualsignup');
                else if (signupType === 'corporate') navigate('/corporatesignup');
                closeSignupModal();
              }}
              disabled={!signupType}
            >
              Continue
            </button>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeSignupModal}
          >
            ✕
          </button>
        </div>
      </dialog>
      <div className="navbar-end px-1">
        {isLoggedIn ? (
          <button
            className="btn bg-cyan-600 text-white text-xl mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="bg-slate-800 dark:bg-slate-900 text-xl text-white px-3 py-2 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Login...
          </button>
        )}
      </div>


      <ToastContainer />
    </div>
  );
};

export default PortLogin;