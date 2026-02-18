import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { EyeIcon, EyeOffIcon, TrendingUp, BarChart3, DollarSign, Activity } from 'lucide-react';
import { HiOutlineLogout } from 'react-icons/hi';
import GoogleLoginButton from './GoogleLoginButton';
import { FaRupeeSign } from 'react-icons/fa';
import Navbar from './Navbar';
import { Helmet } from 'react-helmet-async';
import { trackSignup, trackLogin } from '../utils/tracking';

const Login = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '', type: 'error' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const errorModalRef = useRef(null);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const [showPassword, setShowPassword] = useState(false);

  // Get the previous page's pathname from location.state, default to '/'
  const from = location.state?.from || '/';

  useEffect(() => {
    if (errorModal.isOpen && errorModalRef.current) {
      errorModalRef.current.showModal();
    }
  }, [errorModal.isOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setErrorModal({ isOpen: true, message: 'Logged out successfully!', type: 'success' });
    navigate('/');
  };

  const handleGoogleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    window.dispatchEvent(new Event('authChange'));
    if (onSuccess) onSuccess(userData);
    // Navigate to the previous page and reload
    navigate(from, { replace: true });
    setTimeout(() => window.location.reload(), 0);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE}/auth/login`,
        data,
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
        window.dispatchEvent(new Event('storage'));
        setErrorModal({ isOpen: true, message: 'Logged in successfully!', type: 'success' });
        setIsLoggedIn(true);
        if (onSuccess) onSuccess({ token, userType, email });
        reset();
        // Navigate to the previous page and reload
        navigate(from, { replace: true });
        setTimeout(() => window.location.reload(), 0);
      } else {
        setErrorModal({ isOpen: true, message: 'Invalid credentials', type: 'error' });
      }
    } catch (err) {
      if (err.response?.data?.error === 'Account not found. Please register again.') {
        setErrorModal({
          isOpen: true,
          message: 'Your account has been deleted. Please register with email to create a new account.',
          type: 'error',
        });
        setTimeout(() => {
          navigate('/emaillogin', { state: { from, email: data.email } });
          setErrorModal({ isOpen: false, message: '', type: 'error' });
        }, 2000);
      } else {
        setErrorModal({
          isOpen: true,
          message: err.response?.data?.message || 'Login failed. Check email and password.',
          type: 'error',
        });
      }
    }
  };

  return (
    // <div className="font-sans text-gray-900 dark:text-gray-100 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col relative overflow-hidden">
    <div className="font-sans text-gray-900 dark:text-gray-100 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col relative overflow-hidden pt-20 md:pt-24">
      <Helmet>
        <title>Login – Access Your CMDA Market Analytics Dashboard</title>
        <meta
          name="description"
          content="Log in to CMDA Hub to access your market analytics dashboard, equity insights, research tools, and personalized investment data."
        />

        <meta
          name="keywords"
          content="CMDA login, login dashboard, market analytics login, equity insights access, investment dashboard login, stock market tools login, CMDA Hub login, user authentication"
        />

        <meta property="og:title" content="Login – Access Your CMDA Market Analytics Dashboard" />
        <meta
          property="og:description"
          content="Sign in to CMDA Hub to unlock personalized market insights, dashboards, research tools, and real-time investment analytics."
        />
        <meta property="og:url" content="https://cmdahub.com/login" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CMDA Hub" />

        <link rel="canonical" href="https://cmdahub.com/login" />
      </Helmet>


      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {/* Animated stock chart background */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 L20,45 L40,60 L60,30 L80,40 L100,20" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-500" />
          <path d="M0,70 L20,65 L40,80 L60,50 L80,60 L100,40" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-green-500" />
          <path d="M0,30 L20,25 L40,40 L60,10 L80,20 L100,5" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-sky-500" />
        </svg>
      </div>

      {/* Floating stock indicators */}
      <div className="absolute top-10 left-10 text-green-500 animate-pulse">
        <TrendingUp size={24} />
      </div>
      <div className="absolute top-1/4 right-16 text-blue-500">
        <BarChart3 size={24} />
      </div>
      <div className="absolute bottom-1/3 left-20 text-sky-500">
        <DollarSign size={24} />
      </div>
      <div className="absolute bottom-20 right-24 text-red-500">
        <Activity size={24} />
      </div>
      <div className="absolute top-1/4 left-64 text-green-500">
        <FaRupeeSign size={24} />
      </div>

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center py-10 px-4 relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-3 space-y-6 border border-gray-200 dark:border-gray-700 relative">
          <Link
            to={from}
            className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Close and return to previous page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-3 rounded-full">
                <TrendingUp className="text-white" size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Welcome to CMDA</h2>
            {/* <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Sign in to your CMDA account</p> */}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                placeholder="user@example.com"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              <Link
                to="/ForgotPassword"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </Link>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="subscribeToCMDA"
                {...register('subscribeToCMDA')}
                className="h-4 w-4 text-blue-600 border-gray-200 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700"
              />
              <label htmlFor="subscribeToCMDA" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable CMDA subscription
              </label>
            </div>
             */}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:from-blue-700 hover:to-sky-700"
            >
              Login
            </button>
            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or Register with</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
                <GoogleLoginButton
                  className="w-full flex items-center justify-center py-3 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300"
                  onSuccess={handleGoogleLoginSuccess}
                />
              </div>

              <button
              type="button"
              onClick={() => navigate('/individualsignup', { state: { from } })}
              className="flex items-center justify-center gap-3 w-full bg-slate-800 text-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400"
              >
                <svg className="w-5 h-5 text-gray-100 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              Sign up with Email
            </button>
            </div>*/}

            {/* ── OR Divider ── */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or
                </span>
              </div>
            </div>

            {/* ── Google Login (full-width, proper sizing) ── */}
            <div className="w-full">
              <GoogleLoginButton
                className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:border-blue-400"
                onSuccess={handleGoogleLoginSuccess}
              />
            </div>

            {/* ── Create Account Link ── */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New to CMDA?{' '}
                <Link
                  to="/individualsignup"
                  state={{ from }}
                  onClick={() => trackSignup('login_page', 'individual')}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
                  data-track="login_signup_link"
                >
                  Create an account
                </Link>
              </p>
            </div>


          </form>
        </div>
      </div>

      {/* Error/Success Modal */}
      <dialog ref={errorModalRef} className="modal z-[101] backdrop:bg-black/20 backdrop-blur-sm">
        <div className="modal-box p-0 max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
          <div
            className={`h-1 animate-gradient ${errorModal.type === 'success'
              ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-500'
              : 'bg-gradient-to-r from-red-500 via-red-600 to-red-500'
              }`}
          />
          <button
            onClick={() => {
              errorModalRef.current?.close();
              setErrorModal({ isOpen: false, message: '', type: 'error' });
            }}
            className="absolute right-4 top-4 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 transform hover:scale-110"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>




          </button>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              {errorModal.type === 'success' ? 'Success' : 'Error'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{errorModal.message}</p>
            <button
              onClick={() => {
                errorModalRef.current?.close();
                setErrorModal({ isOpen: false, message: '', type: 'error' });
              }}
              className={`w-full mt-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${errorModal.type === 'success'
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                }`}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Login;
