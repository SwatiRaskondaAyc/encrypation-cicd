// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
// import Navbar from './Navbar';

// const EmailLogin = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [step, setStep] = useState(1); // Tracks current step (1: Email, 2: OTP, 3: Account Type)
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtpSentMessage, setShowOtpSentMessage] = useState(false);
//   const [showOtpErrorMessage, setShowOtpErrorMessage] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [signupType, setSignupType] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const from = location.state?.from || '/';

//   const sendOtp = async () => {
//     if (!email) {
//       setErrorMessage('Please enter a valid email.');
//       return;
//     }
//     try {
//       const res = await axios.post(`${API_BASE}/auth/send-otp`, { email });
//       if (res.status === 200) {
//         setOtpSent(true);
//         setShowOtpSentMessage(true);
//         setErrorMessage('');
//         setStep(2);
//         setTimeout(() => setShowOtpSentMessage(false), 5000);
//       }
//     } catch (err) {
//       setShowOtpErrorMessage(true);
//       setErrorMessage('This email is already registered. Please log in or use a different email.');
//       setTimeout(() => setShowOtpErrorMessage(false), 7000);
//     }
//   };

//   const verifyOtp = async () => {
//     setIsVerifying(true);
//     try {
//       const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
//       if (res.status === 200) {
//         localStorage.setItem('verifiedEmail', email);
//         setIsOtpVerified(true);
//         setSuccessMessage('OTP verified successfully!');
//         setErrorMessage('');
//         setTimeout(() => {
//           setSuccessMessage('');
//           setStep(3);
//         }, 2000);
//       }
//     } catch (err) {
//       setErrorMessage(err.response?.data?.message || 'OTP verification failed.');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleAccountSelection = () => {
//     if (signupType === 'individual') {
//       navigate('/individualSignUp', { state: { email, signupType: 'individual', from } });
//     } else if (signupType === 'corporate') {
//       navigate('/corporateSignUp', { state: { email, signupType: 'corporate', from } });
//     }
//   };

//   return (
//     <>
//     <Navbar/>
//     <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-10 px-4 relative overflow-hidden">
//       {/* Animated stock chart background */}
//       <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
//         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//           <path d="M0,50 L20,45 L40,60 L60,30 L80,40 L100,20" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-500" />
//           <path d="M0,70 L20,65 L40,80 L60,50 L80,60 L100,40" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-green-500" />
//           <path d="M0,30 L20,25 L40,40 L60,10 L80,20 L100,5" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-sky-500" />
//         </svg>
//       </div>

//       {/* Floating stock indicators */}
//       <div className="absolute top-10 left-10 text-green-500 animate-pulse">
//         <TrendingUp size={24} />
//       </div>
//       <div className="absolute top-1/4 right-16 text-blue-500">
//         <TrendingUp size={24} />
//       </div>

//       {/* Main Content */}
//       <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8 space-y-6 border border-gray-200 dark:border-gray-700 relative z-10">
//         <Link
//           to={from}
//           className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
//           aria-label="Close and return to previous page"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </Link>
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-3 rounded-full">
//               <TrendingUp className="text-white" size={32} />
//             </div>
//           </div>
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Email Sign In</h2>
//           <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
//             Step {step} of 3: {step === 1 ? 'Enter Email' : step === 2 ? 'Verify OTP' : 'Choose Account Type'}
//           </p>
//         </div>

//         {/* Progress Bar */}
//         <div className="flex items-center justify-between mb-6">
//           <div className={`w-1/3 h-1 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
//           <div className={`w-1/3 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full mx-2`}></div>
//           <div className={`w-1/3 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
//         </div>

//         {/* Step 1: Enter Email */}
//         {step === 1 && (
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="user@example.com"
//                 className="w-full mt-1 px-4 py-3 rounded-xl dark:text-white border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
//                 disabled={otpSent}
//               />
//             </div>
//             {showOtpErrorMessage && (
//               <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl flex items-start gap-2">
//                 <AlertCircle className="w-5 h-5 mt-0.5" />
//                 <div>
//                   <p className="font-semibold">Oops!</p>
//                   <p>{errorMessage}</p>
//                 </div>
//               </div>
//             )}
//             <button
//               onClick={sendOtp}
//               className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
//                 !email || otpSent
//                   ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
//               }`}
//               disabled={!email || otpSent}
//             >
//               Send OTP
//             </button>
//           </div>
//         )}

//         {/* Step 2: Enter OTP */}
//         {step === 2 && (
//           <div className="space-y-4">
//             {showOtpSentMessage && (
//               <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2">
//                 <CheckCircle className="w-5 h-5" />
//                 OTP Sent to {email}
//               </div>
//             )}
//             {successMessage && (
//               <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2">
//                 <CheckCircle className="w-5 h-5" />
//                 {successMessage}
//               </div>
//             )}
//             {errorMessage && (
//               <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl flex items-start gap-2">
//                 <AlertCircle className="w-5 h-5 mt-0.5" />
//                 {errorMessage}
//               </div>
//             )}
//             <div>
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="Enter 6-digit code"
//                 className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
//                 maxLength={6}
//               />
//             </div>
//             <button
//               onClick={verifyOtp}
//               className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
//                 !otp || otp.length < 6 || isOtpVerified || isVerifying
//                   ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
//               }`}
//               disabled={!otp || otp.length < 6 || isOtpVerified || isVerifying}
//             >
//               {isVerifying ? (
//                 <span className="flex items-center justify-center gap-2">
//                   Verifying...
//                   <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                 </span>
//               ) : (
//                 'Verify OTP'
//               )}
//             </button>
//           </div>
//         )}

//         {/* Step 3: Choose Account Type */}
//         {step === 3 && (
//           <div className="space-y-4">
//             <div
//               className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
//                 signupType === 'individual'
//                   ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
//                   : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50'
//               }`}
//               onClick={() => setSignupType('individual')}
//             >
//               <div className="flex items-start">
//                 <div
//                   className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
//                     signupType === 'individual' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
//                   }`}
//                 >
//                   {signupType === 'individual' && (
//                     <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-800 dark:text-white">Individual Account</h4>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For personal use and individual creators</p>
//                 </div>
//               </div>
//             </div>
//             <div
//               className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
//                 signupType === 'corporate'
//                   ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
//                   : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50'
//               }`}
//               onClick={() => setSignupType('corporate')}
//             >
//               <div className="flex items-start">
//                 <div
//                   className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
//                     signupType === 'corporate' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
//                   }`}
//                 >
//                   {signupType === 'corporate' && (
//                     <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-800 dark:text-white">Business Account</h4>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For companies and organizations</p>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={handleAccountSelection}
//               className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
//                 !signupType
//                   ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
//               }`}
//               disabled={!signupType}
//             >
//               Continue
//               <svg className="h-5 w-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
//                 <path
//                   fillRule="evenodd"
//                   d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//     </>
//   );
// };

// export default EmailLogin;



//code before gayatri's changes
// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
// import Navbar from './Navbar';

// const EmailLogin = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [step, setStep] = useState(1); // Tracks current step (1: Email, 2: OTP, 3: Account Type)
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtpSentMessage, setShowOtpSentMessage] = useState(false);
//   const [showOtpErrorMessage, setShowOtpErrorMessage] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isSending, setIsSending] = useState(false); // Controls button disable state during send
//   const [timer, setTimer] = useState(0); // Timer for resend OTP (30 seconds)
//   const [signupType, setSignupType] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const from = location.state?.from || '/';
//   const errorModalRef = useRef(null);

//   // Allowed email domains
//   const ALLOWED_DOMAINS = new Set([
//     'aycanalytics.com',
//     'gmail.com',
//     'googlemail.com',
//     'outlook.com',
//     'hotmail.com',
//     'live.com',
//     'msn.com',
//     'yahoo.com',
//     'icloud.com',
//     'me.com',
//     'mac.com',
//     'aol.com',
//     'protonmail.com',
//     'gmx.com',
//     'zoho.com',
//     'yandex.com',
//   ]);

//   // Countdown timer for resend OTP
//   useEffect(() => {
//     let interval = null;
//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer <= 1) {
//             clearInterval(interval);
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);
//     } else if (timer === 0 && otpSent) {
//       setIsSending(false); // Enable resend when timer ends
//     }
//     return () => clearInterval(interval);
//   }, [timer, otpSent]);

//   const sendOtp = async () => {
//     if (!email) {
//       setErrorMessage('Please enter a valid email.');
//       return;
//     }

//     // Validate email domain
//     const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
//     if (!ALLOWED_DOMAINS.has(domain)) {
//       setErrorMessage('Please use a valid email domain (e.g., gmail.com, aycanalytics.com).');
//       return;
//     }

//     // OTP send limit logic
//     let otpData = JSON.parse(localStorage.getItem('otpAttempts')) || {};
//     let emailData = otpData[email] || { attempts: 0, blockedUntil: 0, lastAttempt: 0 };
//     const now = Date.now();

//     if (emailData.blockedUntil > now) {
//       const remaining = Math.ceil((emailData.blockedUntil - now) / 60000);
//       setErrorMessage(
//         `Too many OTP requests. Please try again after ${remaining} minute${remaining > 1 ? 's' : ''}.`
//       );
//       return;
//     }

//     // Reset attempts if more than 5 minutes since last attempt
//     if (emailData.lastAttempt && now - emailData.lastAttempt > 300000) {
//       emailData.attempts = 0;
//     }

//     // Check if attempts exceed limit
//     if (emailData.attempts >= 3) {
//       emailData.blockedUntil = now + 300000; // Block for 5 minutes
//       emailData.lastAttempt = now;
//       otpData[email] = emailData;
//       localStorage.setItem('otpAttempts', JSON.stringify(otpData));
//       setErrorMessage('Too many OTP requests. Please try again after 5 minutes.');
//       return;
//     }

//     // Proceed to send OTP
//     setIsSending(true);
//     try {
//       const res = await axios.post(`${API_BASE}/auth/send-otp`, { email });
//       if (res.status === 200) {
//         // Increment attempts after successful send
//         emailData.attempts += 1;
//         emailData.lastAttempt = now;
//         otpData[email] = emailData;
//         localStorage.setItem('otpAttempts', JSON.stringify(otpData));

//         setOtpSent(true);
//         setShowOtpSentMessage(true);
//         setErrorMessage('');
//         setTimer(30); // Start 30-second timer
//         setStep(2);
//         setTimeout(() => setShowOtpSentMessage(false), 5000);
//       }
//     } catch (err) {
//       setShowOtpErrorMessage(true);
//       setErrorMessage('This email is already registered. Please log in or use a different email.');
//       setTimeout(() => setShowOtpErrorMessage(false), 7000);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const resendOtp = () => {
//     setOtp('');
//     setOtpSent(false);
//     setTimer(0);
//     sendOtp();
//   };

//   const verifyOtp = async () => {
//     setIsVerifying(true);
//     try {
//       const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
//       if (res.status === 200) {
//         localStorage.setItem('verifiedEmail', email);
//         setIsOtpVerified(true);
//         setSuccessMessage('OTP verified successfully!');
//         setErrorMessage('');
//         setTimeout(() => {
//           setSuccessMessage('');
//           setStep(3);
//         }, 2000);
//       }
//     } catch (err) {
//       setErrorMessage(err.response?.data?.message || 'OTP verification failed.');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleAccountSelection = () => {
//     if (signupType === 'individual') {
//       navigate('/individualsignup', { state: { email, signupType: 'individual', from } });
//     } else if (signupType === 'corporate') {
//       navigate('/corporatesignup', { state: { email, signupType: 'corporate', from } });
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-10 px-4 relative overflow-hidden">
//         {/* Animated stock chart background */}
//         <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
//           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//             <path
//               d="M0,50 L20,45 L40,60 L60,30 L80,40 L100,20"
//               stroke="currentColor"
//               strokeWidth="0.5"
//               fill="none"
//               className="text-blue-500"
//             />
//             <path
//               d="M0,70 L20,65 L40,80 L60,50 L80,60 L100,40"
//               stroke="currentColor"
//               strokeWidth="0.5"
//               fill="none"
//               className="text-green-500"
//             />
//             <path
//               d="M0,30 L20,25 L40,40 L60,10 L80,20 L100,5"
//               stroke="currentColor"
//               strokeWidth="0.5"
//               fill="none"
//               className="text-sky-500"
//             />
//           </svg>
//         </div>

//         {/* Floating stock indicators */}
//         <div className="absolute top-10 left-10 text-green-500 animate-pulse">
//           <TrendingUp size={24} />
//         </div>
//         <div className="absolute top-1/4 right-16 text-blue-500">
//           <TrendingUp size={24} />
//         </div>

//         {/* Main Content */}
//         <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8 space-y-6 border border-gray-200 dark:border-gray-700 relative z-10">
//           <Link
//             to={from}
//             className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
//             aria-label="Close and return to previous page"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </Link>
//           <div className="text-center">
//             <div className="flex justify-center mb-4">
//               <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-3 rounded-full">
//                 <TrendingUp className="text-white" size={32} />
//               </div>
//             </div>
//             <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Email Sign In</h2>
//             <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
//               Step {step} of 3: {step === 1 ? 'Enter Email' : step === 2 ? 'Verify OTP' : 'Choose Account Type'}
//             </p>
//           </div>

//           {/* Progress Bar */}
//           <div className="flex items-center justify-between mb-6">
//             <div className={`w-1/3 h-1 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
//             <div className={`w-1/3 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full mx-2`}></div>
//             <div className={`w-1/3 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
//           </div>

//           {/* Step 1: Enter Email */}
//           {step === 1 && (
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="user@example.com"
//                   className="w-full mt-1 px-4 py-3 rounded-xl dark:text-white border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
//                   disabled={otpSent && timer > 0}
//                 />
//               </div>
//               {errorMessage && (
//                 <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl flex items-start gap-2">
//                   <AlertCircle className="w-5 h-5 mt-0.5" />
//                   <div>
//                     <p className="font-semibold">Oops!</p>
//                     <p>{errorMessage}</p>
//                   </div>
//                 </div>
//               )}
//               <button
//                 onClick={sendOtp}
//                 className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
//                   !email || isSending || (otpSent && timer > 0)
//                     ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
//                 }`}
//                 disabled={!email || isSending || (otpSent && timer > 0)}
//               >
//                 {isSending ? (
//                   <span className="flex items-center justify-center gap-2">
//                     Sending...
//                     <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                   </span>
//                 ) : 'Send OTP'}
//               </button>
//             </div>
//           )}

//           {/* Step 2: Enter OTP */}
//           {step === 2 && (
//             <div className="space-y-4">
//               {showOtpSentMessage && (
//                 <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5" />
//                   OTP Sent to {email}
//                 </div>
//               )}
//               {successMessage && (
//                 <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5" />
//                   {successMessage}
//                 </div>
//               )}
//               {errorMessage && (
//                 <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl flex items-start gap-2">
//                   <AlertCircle className="w-5 h-5 mt-0.5" />
//                   {errorMessage}
//                 </div>
//               )}
//               <div>
//                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter 6-digit code"
//                   className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
//                   maxLength={6}
//                 />
//               </div>
//               <button
//                 onClick={verifyOtp}
//                 className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
//                   !otp || otp.length < 6 || isOtpVerified || isVerifying
//                     ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
//                 }`}
//                 disabled={!otp || otp.length < 6 || isOtpVerified || isVerifying}
//               >
//                 {isVerifying ? (
//                   <span className="flex items-center justify-center gap-2">
//                     Verifying...
//                     <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                   </span>
//                 ) : (
//                   'Verify OTP'
//                 )}
//               </button>
//               {otpSent && timer === 0 && (
//                 <button
//                   onClick={resendOtp}
//                   className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg"
//                 >
//                   Resend OTP
//                 </button>
//               )}
//               {otpSent && timer > 0 && (
//                 <p className="text-center text-sm text-gray-500 dark:text-gray-400">
//                   Resend OTP in {timer} seconds
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Step 3: Choose Account Type */}
//           {step === 3 && (
//             <div className="space-y-4">
//               <div
//                 className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
//                   signupType === 'individual'
//                     ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
//                     : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50'
//                 }`}
//                 onClick={() => setSignupType('individual')}
//               >
//                 <div className="flex items-start">
//                   <div
//                     className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
//                       signupType === 'individual' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
//                     }`}
//                   >
//                     {signupType === 'individual' && (
//                       <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-800 dark:text-white">Individual Account</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For personal use and individual creators</p>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
//                   signupType === 'corporate'
//                     ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
//                     : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50'
//                 }`}
//                 onClick={() => setSignupType('corporate')}
//               >
//                 <div className="flex items-start">
//                   <div
//                     className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
//                       signupType === 'corporate' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
//                     }`}
//                   >
//                     {signupType === 'corporate' && (
//                       <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-800 dark:text-white">Business Account</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For companies and organizations</p>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={handleAccountSelection}
//                 className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
//                   !signupType
//                     ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
//                 }`}
//                 disabled={!signupType}
//               >
//                 Continue
//                 <svg className="h-5 w-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmailLogin;





//gayatris changes

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';

const EmailLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // Tracks current step (1: Email, 2: OTP, 3: Account Type)
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpSentMessage, setShowOtpSentMessage] = useState(false);
  const [showOtpErrorMessage, setShowOtpErrorMessage] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false); // Controls button disable state during send
  const [timer, setTimer] = useState(0); // Timer for resend OTP (30 seconds)
  const [signupType, setSignupType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const from = location.state?.from || '/';
  const errorModalRef = useRef(null);

  // Allowed email domains
  const ALLOWED_DOMAINS = new Set([
    'aycanalytics.com',
    'gmail.com',
    'googlemail.com',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'msn.com',
    'yahoo.com',
    'icloud.com',
    'me.com',
    'mac.com',
    'aol.com',
    'protonmail.com',
    'gmx.com',
    'zoho.com',
    'yandex.com',
  ]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setIsSending(false); // Enable resend when timer ends
    }
    return () => clearInterval(interval);
  }, [timer, otpSent]);

  const sendOtp = async () => {
    if (!email) {
      setErrorMessage('Please enter a valid email.');
      return;
    }

    // Validate email domain
    const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase();
    if (!ALLOWED_DOMAINS.has(domain)) {
      setErrorMessage('Please use a valid email domain (e.g., gmail.com, aycanalytics.com).');
      return;
    }

    // OTP send limit logic
    let otpData = JSON.parse(localStorage.getItem('otpAttempts')) || {};
    let emailData = otpData[email] || { attempts: 0, blockedUntil: 0, lastAttempt: 0 };
    const now = Date.now();

    if (emailData.blockedUntil > now) {
      const remaining = Math.ceil((emailData.blockedUntil - now) / 60000);
      setErrorMessage(
        `Too many OTP requests. Please try again after ${remaining} minute${remaining > 1 ? 's' : ''}.`
      );
      return;
    }

    // Reset attempts if more than 5 minutes since last attempt
    if (emailData.lastAttempt && now - emailData.lastAttempt > 300000) {
      emailData.attempts = 0;
    }

    // Check if attempts exceed limit
    if (emailData.attempts >= 3) {
      emailData.blockedUntil = now + 300000; // Block for 5 minutes
      emailData.lastAttempt = now;
      otpData[email] = emailData;
      localStorage.setItem('otpAttempts', JSON.stringify(otpData));
      setErrorMessage('Too many OTP requests. Please try again after 5 minutes.');
      return;
    }

    // Proceed to send OTP
    setIsSending(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/send-otp`, { email });
      if (res.status === 200) {
        // Increment attempts after successful send
        emailData.attempts += 1;
        emailData.lastAttempt = now;
        otpData[email] = emailData;
        localStorage.setItem('otpAttempts', JSON.stringify(otpData));

        setOtpSent(true);
        setShowOtpSentMessage(true);
        setErrorMessage('');
        setTimer(30); // Start 30-second timer
        setStep(2);
        setTimeout(() => setShowOtpSentMessage(false), 5000);
      }
    } catch (err) {
      setShowOtpErrorMessage(true);
      setErrorMessage('This email is already registered. Please log in or use a different email.');
      setTimeout(() => setShowOtpErrorMessage(false), 7000);
    } finally {
      setIsSending(false);
    }
  };

  const resendOtp = () => {
    setOtp('');
    setOtpSent(false);
    setTimer(0);
    sendOtp();
  };

  const verifyOtp = async () => {
    setIsVerifying(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
      if (res.status === 200) {
        localStorage.setItem('verifiedEmail', email);
        setIsOtpVerified(true);
        setSuccessMessage('OTP verified successfully!');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
          setStep(3);
        }, 2000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAccountSelection = () => {
    if (signupType === 'individual') {
      navigate('/individualSignUp', { state: { email, signupType: 'individual', from } });
    } 
    // else if (signupType === 'corporate') {
    //   navigate('/corporateSignUp', { state: { email, signupType: 'corporate', from } });
    // }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-10 px-4 relative overflow-hidden">
        {/* Animated stock chart background */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,50 L20,45 L40,60 L60,30 L80,40 L100,20"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-blue-500"
            />
            <path
              d="M0,70 L20,65 L40,80 L60,50 L80,60 L100,40"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-green-500"
            />
            <path
              d="M0,30 L20,25 L40,40 L60,10 L80,20 L100,5"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-sky-500"
            />
          </svg>
        </div>

        {/* Floating stock indicators */}
        <div className="absolute top-10 left-10 text-green-500 animate-pulse">
          <TrendingUp size={24} />
        </div>
        <div className="absolute top-1/4 right-16 text-blue-500">
          <TrendingUp size={24} />
        </div>

        {/* Main Content */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8 space-y-6 border border-gray-200 dark:border-gray-700 relative z-10">
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
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Email Sign In</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Step {step} of 3: {step === 1 ? 'Enter Email' : step === 2 ? 'Verify OTP' : 'Choose Account Type'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className={`w-1/3 h-1 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
            <div className={`w-1/3 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full mx-2`}></div>
            <div className={`w-1/3 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
          </div>

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full mt-1 px-4 py-3 rounded-xl dark:text-white border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                  disabled={otpSent && timer > 0}
                />
              </div>
              {errorMessage && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-semibold">Oops!</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}
              <button
                onClick={sendOtp}
                className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
                  !email || isSending || (otpSent && timer > 0)
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                }`}
                disabled={!email || isSending || (otpSent && timer > 0)}
              >
                {isSending ? (
                  <span className="flex items-center justify-center gap-2">
                    Sending...
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                ) : 'Send OTP'}
              </button>
            </div>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <div className="space-y-4">
              {showOtpSentMessage && (
                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  OTP Sent to {email}
                </div>
              )}
              {successMessage && (
                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                  {errorMessage}
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 dark:text-white dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                  maxLength={6}
                />
              </div>
              <button
                onClick={verifyOtp}
                className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
                  !otp || otp.length < 6 || isOtpVerified || isVerifying
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                }`}
                disabled={!otp || otp.length < 6 || isOtpVerified || isVerifying}
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    Verifying...
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                ) : (
                  'Verify OTP'
                )}
              </button>
              {otpSent && timer === 0 && (
                <button
                  onClick={resendOtp}
                  className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg"
                >
                  Resend OTP
                </button>
              )}
              {otpSent && timer > 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Resend OTP in {timer} seconds
                </p>
              )}
            </div>
          )}

          {/* Step 3: Choose Account Type */}
          {step === 3 && (
            <div className="space-y-4">
              <div
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  signupType === 'individual'
                    ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSignupType('individual')}
              >
                <div className="flex items-start">
                  <div
                    className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
                      signupType === 'individual' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
                    }`}
                  >
                    {signupType === 'individual' && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Individual Account</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For personal use and individual creators</p>
                  </div>
                </div>
              </div>
              {/* <div
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  signupType === 'corporate'
                    ? 'border-blue-500 bg-blue-50 dark:bg-gray-700 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSignupType('corporate')}
              >
                <div className="flex items-start">
                  <div
                    className={`flex items-center justify-center h-6 w-6 rounded-full border-2 mr-3 mt-1 ${
                      signupType === 'corporate' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-500'
                    }`}
                  >
                    {signupType === 'corporate' && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Business Account</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For companies and organizations</p>
                  </div>
                </div>
              </div> */}
              <button
                onClick={handleAccountSelection}
                className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg ${
                  !signupType
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                }`}
                disabled={!signupType}
              >
                Continue
                <svg className="h-5 w-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmailLogin;