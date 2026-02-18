


// ----- promo code chnages shreya ----

// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { useAuth } from './AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import toast from 'react-hot-toast';

// const PromoCodeModal = ({ isOpen, onClose, onSubmit, email }) => {
//   const [promoCode, setPromoCode] = useState('');

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//           Welcome, {email}!
//         </h2>
//         <p className="text-gray-600 dark:text-gray-300 mb-4">
//           Do you have a promo code? (Optional)
//         </p>
//         <input
//           type="text"
//           value={promoCode}
//           onChange={(e) => setPromoCode(e.target.value)}
//           placeholder="Enter promo code"
//           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
//         />
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => onSubmit(promoCode)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Submit
//           </button>
//           <button
//             onClick={() => onSubmit('')}
//             className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
//           >
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoogleLoginButton = ({ onClose }) => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [pendingData, setPendingData] = useState(null);

//   const currentDomain = window.location.hostname;
//   const isWWW = currentDomain.startsWith('www.');
//   const API_BASE = isWWW
//     ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
//     : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
//   const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
//   const clientId = isWWW
//     ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
//     : import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const handleSuccess = async (credentialResponse) => {
//     console.log('Google Credential:', credentialResponse.credential);
//     try {
//       const response = await axios.post(
//         `${API_BASE}${AUTH_ENDPOINT}`,
//         { credential: credentialResponse.credential },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       console.log('Backend Response:', response.data);
//       if (response.data.pendingToken || response.data.status === 'new_user') {
//         console.log('New user detected, showing promo modal');
//         setPendingData({
//           pendingToken: response.data.pendingToken || null,
//           email: response.data.email,
//           name: response.data.name,
//           picture: response.data.profilePicture || response.data.picture,
//         });
//         setShowPromoModal(true);
//       } else {
//         console.log('Existing user, logging in');
//         const { token, email, name, userType, picture } = response.data;
//         login(token);
//         localStorage.setItem('userType', userType || 'individual');
//         localStorage.setItem('userName', name);
//         localStorage.setItem('profilePicture', picture);
//         window.dispatchEvent(new Event('storage'));
//         window.dispatchEvent(new Event('authChange'));
//         toast.success('Logged in with Google successfully!');
//         if (onClose) onClose();
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Google Sign-In Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to sign in with Google.');
//     }
//   };

//   const handlePromoSubmit = async (promoCode) => {
//     if (!pendingData) {
//       console.error('No pending data for promo submission');
//       return;
//     }
//     console.log('Submitting promo code:', promoCode);
//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/google/complete`,
//         {
//           pendingToken: pendingData.pendingToken || '',
//           promoCode: promoCode || '',
//         },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       console.log('Complete Registration Response:', response.data);
//       const { token, email, name, userType, picture } = response.data;
//       login(token);
//       localStorage.setItem('userType', userType || 'individual');
//       localStorage.setItem('userName', name);
//       localStorage.setItem('profilePicture', picture);
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('authChange'));
//       toast.success('Registered with Google successfully!');
//       setShowPromoModal(false);
//       setPendingData(null);
//       if (onClose) onClose();
//       navigate('/');
//     } catch (error) {
//       console.error('Google Registration Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to complete registration.');
//     }
//   };

//   const handleError = () => {
//     console.error('Google Sign-In Error');
//     toast.error('An error occurred during Google Sign-In.');
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={clientId}>
//         <div className="w-full">
//           <GoogleLogin
//             onSuccess={handleSuccess}
//             onError={handleError}
//             flow="auth-code"
//             redirect_uri={isWWW ? 'https://www.cmdahub.com/auth/google/callback' : 'https://cmdahub.com/auth/google/callback'}
//             render={(renderProps) => (
//               <button
//                 type="button"
//                 className="flex items-center w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm text-gray-800 dark:text-white overflow-hidden"
//                 onClick={renderProps.onClick}
//                 disabled={renderProps.disabled}
//               >
//                 <img src="/Google_logo.png" alt="Google" className="w-5 h-5 mr-2" />
//                 <span className="truncate">Google</span>
//               </button>
//             )}
//           />
//         </div>
//       </GoogleOAuthProvider>
//       <PromoCodeModal
//         isOpen={showPromoModal}
//         onClose={() => setShowPromoModal(false)}
//         onSubmit={handlePromoSubmit}
//         email={pendingData?.email || ''}
//       />
//     </>
//   );
// };

// export default GoogleLoginButton;



// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { useAuth } from './AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { FaPhone } from 'react-icons/fa';

// const PromoCodeModal = ({ isOpen, onClose, onSubmit, email }) => {
//   const [promoCode, setPromoCode] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState(''); // Local number without country code
//   const [countryCode, setCountryCode] = useState('+91'); // Default country code
//   const [fullPhone, setFullPhone] = useState(''); // Full value for PhoneInput display

//   if (!isOpen) return null;

//   const handlePromoSubmit = (promo, phone, country) => {
//     if (promo && !phone) {
//       toast.error('Mobile number is required when entering a promo code');
//       return; // Do not close modal or submit
//     }
//     // Submit and close if:
//     // 1. Phone number is provided (with or without promo code), or
//     // 2. Both are empty (skip case)
//     if (phone || (!promo && !phone)) {
//       onSubmit(promo || '', { number: phone || '', countryCode: country || '+91' });
//       onClose();
//     }
//   };

//   const handleSkip = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     // Check current state: Prevent skip if promo entered without phone
//     if (promoCode && !phoneNumber) {
//       toast.error('Mobile number is required when entering a promo code');
//       return; // Do not close modal or submit
//     }
//     handlePromoSubmit('', '', countryCode);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//           Welcome, {email}!
//         </h2>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             {promoCode ? <span className="text-red-500">*</span> : null} Contact Number {promoCode ? '' : '(Optional)'}
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <FaPhone className="text-gray-400 group-hover:text-sky-500 transition-colors" />
//             </div>
//            {/* <PhoneInput
//               country={'in'}
//               value={fullPhone}
//               onChange={(value, country) => {
//                 setFullPhone(value);
//                 setCountryCode('+' + country.dialCode);
//                 setPhoneNumber(value.slice(country.dialCode.length + 1)); // Separate local number (remove + and dialCode)
//               }}
//               inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
//               placeholder="Enter phone number"
//             />*/}

//           <PhoneInput
//               country={'in'}
//               value={fullPhone}
//               onChange={(value, country) => {
//                 setFullPhone(value); // Store full value for display
//                 const dialCode = '+' + country.dialCode; // e.g., "+91"
//                 setCountryCode(dialCode);
//                 // Extract local number: Remove country code if present
//                 if (value.startsWith(dialCode)) {
//                   setPhoneNumber(value.slice(dialCode.length)); // Remove "+91" to get "9999999999"
//                 } else {
//                   setPhoneNumber(value); // Use as-is if no country code (e.g., user types local number)
//                 }
//               }}
//               inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
//               placeholder="Enter phone number"
//             />


//           </div>
//         </div>
//         <p className="text-gray-600 dark:text-gray-300 mt-4 mb-2">
//           Do you have a promo code? (Optional)
//         </p>
//         <input
//           type="text"
//           value={promoCode}
//           onChange={(e) => setPromoCode(e.target.value)}
//           placeholder="Enter promo code"
//           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
//         />
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handlePromoSubmit(promoCode, phoneNumber, countryCode);
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Submit
//           </button>
//           <button
//             onClick={handleSkip}
//             className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
//           >
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoogleLoginButton = ({ onClose }) => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [pendingData, setPendingData] = useState(null);

//   const currentDomain = window.location.hostname;
//   const isWWW = currentDomain.startsWith('www.');
//   const API_BASE = isWWW
//     ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
//     : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
//   const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
//   const clientId = isWWW
//     ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
//     : import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE}${AUTH_ENDPOINT}`,
//         { credential: credentialResponse.credential },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       if (response.data.pendingToken) {
//         setPendingData({
//           pendingToken: response.data.pendingToken || null,
//           email: response.data.email,
//           name: response.data.name,
//           picture: response.data.picture,
//         });
//         setShowPromoModal(true);
//       } else {
//         const { token, email, name, userType, picture } = response.data;
//         login(token);
//         localStorage.setItem('userType', userType || 'individual');
//         localStorage.setItem('userName', name);
//         localStorage.setItem('profilePicture', picture);
//         window.dispatchEvent(new Event('storage'));
//         window.dispatchEvent(new Event('authChange'));
//         toast.success('Logged in with Google successfully!');
//         if (onClose) onClose();
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Google Sign-In Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to sign in with Google.');
//     }
//   };

//   const handleGoogleSubmit = async (promoCode, phone) => {
//     if (!pendingData) {
//       console.error('No pending data for promo submission');
//       toast.error('No pending data for registration.');
//       setShowPromoModal(false);
//       if (onClose) onClose();
//       return;
//     }

//     const payload = {
//       pendingToken: pendingData.pendingToken || '',
//       promoCode: promoCode || '',
//       countryCode: phone.countryCode || '+91',
//       mobileNum: phone.number || '',
//     };

//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/google/complete`,
//         payload,
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       const { token, email, name, userType, picture } = response.data;
//       login(token);
//       localStorage.setItem('userType', userType || 'individual');
//       localStorage.setItem('userName', name);
//       localStorage.setItem('profilePicture', picture);
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('authChange'));
//       toast.success('Registered with Google successfully!');
//       setShowPromoModal(false);
//       setPendingData(null);
//       if (onClose) onClose();
//       navigate('/');
//     } catch (error) {
//       console.error('Google Registration Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to complete registration.');
//       setShowPromoModal(false);
//       if (onClose) onClose();
//     }
//   };

//   const handleError = () => {
//     console.error('Google Sign-In Error');
//     toast.error('An error occurred during Google Sign-In.');
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={clientId}>
//         <div className="w-full">
//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={handleError}
//             render={(renderProps) => (
//               <button
//                 type="button"
//                 className="flex items-center w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm text-gray-800 dark:text-white overflow-hidden"
//                 onClick={renderProps.onClick}
//                 disabled={renderProps.disabled}
//               >
//                 <img src="/Google_logo.png" alt="Google" className="w-5 h-5 mr-2" />
//                 <span className="truncate">Google</span>
//               </button>
//             )}
//           />
//         </div>
//       </GoogleOAuthProvider>
//       <PromoCodeModal
//         isOpen={showPromoModal}
//         onClose={() => {
//           setShowPromoModal(false);
//           setPendingData(null);
//           if (onClose) onClose();
//         }}
//         onSubmit={handleGoogleSubmit}
//         email={pendingData?.email || ''}
//       />
//     </>
//   );
// };

// export default GoogleLoginButton;



//not close modal // mobile number not compulsory logic 

// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { useAuth } from './AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { FaPhone } from 'react-icons/fa';

// const PromoCodeModal = ({ isOpen, onClose, onSubmit, email }) => {
//   const [promoCode, setPromoCode] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState(''); // Local number without country code
//   const [countryCode, setCountryCode] = useState('+91'); // Default country code
//   const [fullPhone, setFullPhone] = useState(''); // Full value for PhoneInput display

//   if (!isOpen) return null;

//   const handlePromoSubmit = (promo, phone, country) => {
//     // Do not call onClose here; let the parent handle it based on submission result
//     onSubmit(promo || '', { number: phone || '', countryCode: country || '+91' });
//   };

//   const handleSkip = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     // Do not call onClose here; let the parent handle it
//     handlePromoSubmit('', '', countryCode);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//           Welcome, {email}!
//         </h2>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Contact Number (Optional)
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <FaPhone className="text-gray-400 group-hover:text-sky-500 transition-colors" />
//             </div>
//             <PhoneInput
//               country={'in'}
//               value={fullPhone}
//               onChange={(value, country) => {
//                 setFullPhone(value); // Store full value for display
//                 const dialCode = '+' + country.dialCode; // e.g., "+91"
//                 setCountryCode(dialCode);
//                 // Extract local number: Remove country code if present
//                 if (value.startsWith(dialCode)) {
//                   setPhoneNumber(value.slice(dialCode.length)); // Remove "+91" to get "9999999999"
//                 } else {
//                   setPhoneNumber(value); // Use as-is if no country code
//                 }
//               }}
//               inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
//               placeholder="Enter phone number (optional)"
//             />
//           </div>
//         </div>
//         <p className="text-gray-600 dark:text-gray-300 mt-4 mb-2">
//           Do you have a promo code? (Optional)
//         </p>
//         <input
//           type="text"
//           value={promoCode}
//           onChange={(e) => setPromoCode(e.target.value)}
//           placeholder="Enter promo code"
//           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
//         />
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handlePromoSubmit(promoCode, phoneNumber, countryCode);
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Submit
//           </button>
//           <button
//             onClick={handleSkip}
//             className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
//           >
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoogleLoginButton = ({ onClose }) => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [pendingData, setPendingData] = useState(null);

//   const currentDomain = window.location.hostname;
//   const isWWW = currentDomain.startsWith('www.');
//   const API_BASE = isWWW
//     ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
//     : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
//   const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
//   const clientId = isWWW
//     ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
//     : import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE}${AUTH_ENDPOINT}`,
//         { credential: credentialResponse.credential },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       if (response.data.pendingToken) {
//         setPendingData({
//           pendingToken: response.data.pendingToken || null,
//           email: response.data.email,
//           name: response.data.name,
//           picture: response.data.picture,
//         });
//         setShowPromoModal(true);
//       } else {
//         const { token, email, name, userType, picture } = response.data;
//         login(token);
//         localStorage.setItem('userType', userType || 'individual');
//         localStorage.setItem('userName', name);
//         localStorage.setItem('profilePicture', picture);
//         window.dispatchEvent(new Event('storage'));
//         window.dispatchEvent(new Event('authChange'));
//         toast.success('Logged in with Google successfully!');
//         if (onClose) onClose();
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Google Sign-In Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to sign in with Google.');
//     }
//   };

//   const handleGoogleSubmit = async (promoCode, phone) => {
//     if (!pendingData) {
//       console.error('No pending data for promo submission');
//       toast.error('No pending data for registration.');
//       setShowPromoModal(false);
//       if (onClose) onClose();
//       return;
//     }

//     const payload = {
//       pendingToken: pendingData.pendingToken || '',
//       promoCode: promoCode || '',
//       countryCode: phone.countryCode || '+91',
//       mobileNum: phone.number || '',
//     };

//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/google/complete`,
//         payload,
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       const { token, email, name, userType, picture } = response.data;
//       login(token);
//       localStorage.setItem('userType', userType || 'individual');
//       localStorage.setItem('userName', name);
//       localStorage.setItem('profilePicture', picture);
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('authChange'));
//       toast.success('Registered with Google successfully!');
//       setShowPromoModal(false);
//       setPendingData(null);
//       if (onClose) onClose();
//       navigate('/');
//     } catch (error) {
//       console.error('Google Registration Failed:', error.response?.data || error.message);
//       const errorMessage = error.response?.data || 'Failed to complete registration.';
//       if (errorMessage.includes('Promo code limit has been reached')) {
//         toast.error('Promo code limit reached! 🚫 Maximum uses exceeded. Try another code.', {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//       } else if (errorMessage.includes('Invalid promo code')) {
//         toast.error('Promo code is invalid! ❌ Please check and try again.', {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//       } else if (errorMessage.includes('not valid or has expired')) {
//         toast.error('Promo code has expired! ⏰ Use a valid active code.', {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//       } else {
//         toast.error(errorMessage, {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//         setShowPromoModal(false); // Close only for non-promo errors
//         if (onClose) onClose();
//       }
//     }
//   };

//   const handleError = () => {
//     console.error('Google Sign-In Error');
//     toast.error('An error occurred during Google Sign-In.');
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={clientId}>
//         <div className="w-full">
//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={handleError}
//             render={(renderProps) => (
//               // <button
//               //   type="button"
//               //   className="flex items-center w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm text-gray-800 dark:text-white overflow-hidden"
//               //   onClick={renderProps.onClick}
//               //   disabled={renderProps.disabled}
//               // >
//               //   <img src="/Google_logo.png" alt="Google" className="w-5 h-5 mr-2" />
//               //   <span className="truncate">Google</span>
//               // </button>
//               <button
//                 type="button"
//                 onClick={renderProps.onClick}
//                 disabled={renderProps.disabled}
//                 className="relative flex items-center justify-center w-full px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 
//              bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-100 shadow-sm 
//              hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 
//              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <img
//                   src="/Google_logo.png"
//                   alt="Google"
//                   className="w-5 h-5 absolute left-4"
//                 />
//                 <span className="truncate">Continue with Google</span>
//               </button>

//             )}
//           />
//         </div>
//       </GoogleOAuthProvider>
//       <PromoCodeModal
//         isOpen={showPromoModal}
//         onClose={() => {
//           setShowPromoModal(false);
//           setPendingData(null);
//           if (onClose) onClose();
//         }}
//         onSubmit={handleGoogleSubmit}
//         email={pendingData?.email || ''}
//       />
//     </>
//   );
// };

// export default GoogleLoginButton;




//code before gayatri's changes for google login and registartion
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { useAuth } from './AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
// import toast from 'react-hot-toast';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { FaPhone, FaTimes } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion'; // For animations

// const PromoCodeModal = ({ isOpen, onClose, onSubmit, email }) => {
//   const [promoCode, setPromoCode] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [countryCode, setCountryCode] = useState('+91');
//   const [fullPhone, setFullPhone] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const modalRef = useRef(null);

//   // Handle clicking outside modal to close
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };
//     const handleEscape = (event) => {
//       if (event.key === 'Escape') {
//         onClose();
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     document.addEventListener('keydown', handleEscape);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleEscape);
//     };
//   }, [onClose]);

//   if (!isOpen) return null;

//   const handlePromoSubmit = async (promo, phone, country) => {
//     setIsSubmitting(true);
//     try {
//       await onSubmit(promo || '', { number: phone || '', countryCode: country || '+91' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSkip = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     handlePromoSubmit('', '', countryCode);
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
//           role="dialog"
//           aria-labelledby="promo-modal-title"
//           aria-modal="true"
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full relative"
//             ref={modalRef}
//           >
//             <button
//               onClick={onClose}
//               className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
//               aria-label="Close modal"
//             >
//               <FaTimes size={20} />
//             </button>
//             <h2
//               id="promo-modal-title"
//               className="text-xl font-bold text-gray-900 dark:text-white mb-4"
//             >
//               Welcome, {email}!
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="phone-input"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//                 >
//                   Contact Number (Optional)
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <FaPhone className="text-gray-400 group-hover:text-sky-500 transition-colors" />
//                   </div>
//                   <PhoneInput
//                     country={'in'}
//                     value={fullPhone}
//                     onChange={(value, country) => {
//                       setFullPhone(value);
//                       const dialCode = '+' + country.dialCode;
//                       setCountryCode(dialCode);
//                       setPhoneNumber(value.startsWith(dialCode) ? value.slice(dialCode.length) : value);
//                     }}
//                     inputProps={{
//                       id: 'phone-input',
//                       className:
//                         'w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400',
//                       placeholder: 'Enter phone number (optional)',
//                     }}
//                     buttonClass="dark:bg-gray-700 dark:border-gray-600"
//                     dropdownClass="dark:bg-gray-700 dark:text-white"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label
//                   htmlFor="promo-code"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//                 >
//                   Promo Code (Optional)
//                 </label>
//                 <input
//                   id="promo-code"
//                   type="text"
//                   value={promoCode}
//                   onChange={(e) => setPromoCode(e.target.value)}
//                   placeholder="Enter promo code"
//                   className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={handleSkip}
//                 className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
//                 disabled={isSubmitting}
//               >
//                 Skip
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   handlePromoSubmit(promoCode, phoneNumber, countryCode);
//                 }}
//                 className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting && (
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
//                     />
//                   </svg>
//                 )}
//                 Submit
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// const GoogleLoginButton = ({ onClose }) => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [pendingData, setPendingData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const currentDomain = window.location.hostname;
//   const isWWW = currentDomain.startsWith('www.');
//   const API_BASE = isWWW
//     ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
//     : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
//   const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
//   const clientId = isWWW
//     ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
//     : import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const handleGoogleSuccess = async (credentialResponse) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE}${AUTH_ENDPOINT}`,
//         { credential: credentialResponse.credential },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       if (response.data.pendingToken) {
//         setPendingData({
//           pendingToken: response.data.pendingToken || null,
//           email: response.data.email,
//           name: response.data.name,
//           picture: response.data.picture,
//         });
//         setShowPromoModal(true);
//       } else {
//         const { token, email, name, userType, picture } = response.data;
//         login(token);
//         localStorage.setItem('userType', userType || 'individual');
//         localStorage.setItem('userName', name);
//         localStorage.setItem('profilePicture', picture);
//         window.dispatchEvent(new Event('storage'));
//         window.dispatchEvent(new Event('authChange'));
//         toast.success('Logged in with Google successfully!', {
//           duration: 4000,
//           icon: '🎉',
//         });
//         if (onClose) onClose();
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Google Sign-In Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to sign in with Google.', {
//         duration: 5000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSubmit = async (promoCode, phone) => {
//     if (!pendingData) {
//       console.error('No pending data for promo submission');
//       toast.error('No pending data for registration.', { duration: 5000 });
//       setShowPromoModal(false);
//       if (onClose) onClose();
//       return;
//     }

//     const payload = {
//       pendingToken: pendingData.pendingToken || '',
//       promoCode: promoCode || '',
//       countryCode: phone.countryCode || '+91',
//       mobileNum: phone.number || '',
//     };

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/google/complete`,
//         payload,
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       const { token, email, name, userType, picture } = response.data;
//       login(token);
//       localStorage.setItem('userType', userType || 'individual');
//       localStorage.setItem('userName', name);
//       localStorage.setItem('profilePicture', picture);
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('authChange'));
//       toast.success('Registered with Google successfully!', {
//         duration: 4000,
//         icon: '🎉',
//       });
//       setShowPromoModal(false);
//       setPendingData(null);
//       if (onClose) onClose();
//       navigate('/');
//     } catch (error) {
//       console.error('Google Registration Failed:', error.response?.data || error.message);
//       const errorMessage = error.response?.data || 'Failed to complete registration.';
//       if (errorMessage.includes('Promo code limit has been reached')) {
//         toast.error('Promo code limit reached! 🚫 Maximum uses exceeded. Try another code.', {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//       } else if (errorMessage.includes('Invalid promo code')) {
//         toast.error('Promo code is invalid! ❌ Please check and try again.', {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//       } else if (errorMessage.includes('not valid or has expired')) {
//         toast.error('Promo code has expired! ⏰ Use a valid active code.', {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//       } else {
//         toast.error(errorMessage, {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//         setShowPromoModal(false);
//         if (onClose) onClose();
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleError = () => {
//     console.error('Google Sign-In Error');
//     toast.error('An error occurred during Google Sign-In.', { duration: 5000 });
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={clientId}>
//         <div className="w-full">
//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={handleError}
//             render={(renderProps) => (
//               <button
//                 type="button"
//                 className="flex items-center justify-center w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 text-sm text-gray-800 dark:text-white disabled:opacity-50"
//                 onClick={renderProps.onClick}
//                 disabled={renderProps.disabled || isLoading}
//                 aria-label="Sign in with Google"
//               >
//                 {isLoading ? (
//                   <svg
//                     className="animate-spin h-5 w-5 text-gray-800 dark:text-white "
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
//                     />
//                   </svg>
//                 ) : (
//                   <img src="/Google_logo.png" alt="Google logo" className="w-5 h-5 mr-2" />
//                 )}
//                 <span className="truncate">{isLoading ? 'Signing In...' : 'Sign in with Google'}</span>
//               </button>
//             )}
//           />
//         </div>
//       </GoogleOAuthProvider>
//       <PromoCodeModal
//         isOpen={showPromoModal}
//         onClose={() => {
//           setShowPromoModal(false);
//           setPendingData(null);
//           if (onClose) onClose();
//         }}
//         onSubmit={handleGoogleSubmit}
//         email={pendingData?.email || ''}
//       />
//     </>
//   );
// };

// export default GoogleLoginButton;


//gayatri's code /////////////////////////////////////////////////////////////

// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { useAuth } from './AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
// import toast from 'react-hot-toast';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { FaPhone } from 'react-icons/fa';

// const PromoCodeModal = ({ isOpen, onClose, onSubmit, email }) => {
//   const [promoCode, setPromoCode] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [countryCode, setCountryCode] = useState('+91');
//   const [fullPhone, setFullPhone] = useState('');

//   if (!isOpen) return null;

//   const handlePromoSubmit = (promo, phone, country) => {
//     onSubmit(promo || '', { number: phone || '', countryCode: country || '+91' });
//   };

//   const handleSkip = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     handlePromoSubmit('', '', countryCode);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//           Welcome, {email}!
//         </h2>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Contact Number (Optional)
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <FaPhone className="text-gray-400 group-hover:text-sky-500 transition-colors" />
//             </div>
//             <PhoneInput
//               country={'in'}
//               value={fullPhone}
//               onChange={(value, country) => {
//                 setFullPhone(value);
//                 const dialCode = '+' + country.dialCode;
//                 setCountryCode(dialCode);
//                 if (value.startsWith(dialCode)) {
//                   setPhoneNumber(value.slice(dialCode.length));
//                 } else {
//                   setPhoneNumber(value);
//                 }
//               }}
//               inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
//               placeholder="Enter phone number (optional)"
//             />
//           </div>
//         </div>
//         <p className="text-gray-600 dark:text-gray-300 mt-4 mb-2">
//           Do you have a promo code? (Optional)
//         </p>
//         <input
//           type="text"
//           value={promoCode}
//           onChange={(e) => setPromoCode(e.target.value)}
//           placeholder="Enter promo code"
//           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
//         />
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handlePromoSubmit(promoCode, phoneNumber, countryCode);
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Submit
//           </button>
//           <button
//             onClick={handleSkip}
//             className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
//           >
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoogleLoginButton = ({ onClose }) => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [pendingData, setPendingData] = useState(null);
//   const buttonRef = useRef(null);

//   const currentDomain = window.location.hostname;
//   const isWWW = currentDomain.startsWith('www.');
//   const API_BASE = isWWW
//     ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
//     : import.meta.env.VITE_URL || 'https://cmdahub.com/api'; 
//   const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
//   const clientId = isWWW
//     ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
//     : import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE}${AUTH_ENDPOINT}`,
//         { credential: credentialResponse.credential },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       if (response.data.pendingToken) {
//         setPendingData({
//           pendingToken: response.data.pendingToken || null,
//           email: response.data.email,
//           name: response.data.name,
//           picture: response.data.picture,
//         });
//         setShowPromoModal(true);
//       } else {
//         const { token, email, name, userType, picture } = response.data;
//         login(token);
//         localStorage.setItem('userType', userType || 'individual');
//         localStorage.setItem('userName', name);
//         localStorage.setItem('profilePicture', picture);
//         window.dispatchEvent(new Event('storage'));
//         window.dispatchEvent(new Event('authChange'));
//         toast.success('Logged in with Google successfully!');
//         if (onClose) onClose();
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Google Sign-In Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to sign in with Google.');
//     }
//   };

//   const handleGoogleSubmit = async (promoCode, phone) => {
//     if (!pendingData) {
//       console.error('No pending data for promo submission');
//       toast.error('No pending data for registration.');
//       setShowPromoModal(false);
//       if (onClose) onClose();
//       return;
//     }

//     const payload = {
//       pendingToken: pendingData.pendingToken || '',
//       promoCode: promoCode || '',
//       countryCode: phone.countryCode || '+91',
//       mobileNum: phone.number || '',
//     };

//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/google/complete`,
//         payload,
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       const { token, email, name, userType, picture } = response.data;
//       login(token);
//       localStorage.setItem('userType', userType || 'individual');
//       localStorage.setItem('userName', name);
//       localStorage.setItem('profilePicture', picture);
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('authChange'));
//       toast.success('Registered with Google successfully!');
//       setShowPromoModal(false);
//       setPendingData(null);
//       if (onClose) onClose();
//       navigate('/');
//     } catch (error) {
//       console.error('Google Registration Failed:', error.response?.data || error.message);
//       const errorMessage = error.response?.data || 'Failed to complete registration.';
//       if (errorMessage.includes('Promo code limit has been reached')) {
//         toast.error('Promo code limit reached! 🚫 Maximum uses exceeded. Try another code.', {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//       } else if (errorMessage.includes('Invalid promo code')) {
//         toast.error('Promo code is invalid! ❌ Please check and try again.', {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//       } else if (errorMessage.includes('not valid or has expired')) {
//         toast.error('Promo code has expired! ⏰ Use a valid active code.', {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//       } else {
//         toast.error(errorMessage, {
//           duration: 5000,
//           icon: <FaPhone className="text-red-500" />,
//         });
//         setShowPromoModal(false);
//         if (onClose) onClose();
//       }
//     }
//   };

//   const handleError = () => {
//     console.error('Google Sign-In Error');
//     toast.error('An error occurred during Google Sign-In.');
//   };

//   // ✅ Render logic copied from working Register Button
//   useEffect(() => {
//     const checkGoogle = setInterval(() => {
//       if (window.google && window.google.accounts && buttonRef.current) {
//         clearInterval(checkGoogle);
//         try {
//           window.google.accounts.id.initialize({
//             client_id: clientId,
//             callback: handleGoogleSuccess,
//           });
//           window.google.accounts.id.renderButton(buttonRef.current, {
//             theme: 'outline',
//             size: 'large',
//             text: 'signin_with',
//             width: '100%',
//             shape: 'rectangular',
//           });
//           setGoogleReady(true);
//         } catch (err) {
//           console.error('Google init failed:', err);
//         }
//       }
//     }, 300);
//     return () => clearInterval(checkGoogle);
//   }, [clientId]);

//   const [googleReady, setGoogleReady] = useState(false);
//   const handleClick = () => {
//     const realBtn = buttonRef.current?.querySelector('div[role="button"]');
//     if (realBtn) {
//       realBtn.click();
//     } else {
//       toast.error('Google login not ready yet. Please wait a second.');
//     }
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={clientId}>
//         <div
//           onClick={handleClick}
//           className={`w-full h-11 cursor-pointer flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-150 active:scale-[0.99] ${
//             !googleReady ? 'opacity-60 cursor-not-allowed' : ''
//           }`}
//         >
//           <img src="/Google_logo.png" alt="Google" className="w-5 h-5" />
//           <span className="text-gray-700 font-medium text-[15px]">
//             Login with Google
//           </span>
//           <div ref={buttonRef} className="hidden" />
//         </div>
//       </GoogleOAuthProvider>

//       <PromoCodeModal
//         isOpen={showPromoModal}
//         onClose={() => {
//           setShowPromoModal(false);
//           setPendingData(null);
//           if (onClose) onClose();
//         }}
//         onSubmit={handleGoogleSubmit}
//         email={pendingData?.email || ''}
//       />
//     </>
//   );
// };

// export default GoogleLoginButton;


//Digambar's code /////////////////////////////////////////////////////////////


import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const GoogleLoginButton = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const buttonRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);

  const currentDomain = window.location.hostname;
  const isWWW = currentDomain.startsWith('www.');

  /** ✅ FIXED - Vite requires import.meta.env */
  const API_BASE = isWWW
    ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
    : import.meta.env.VITE_URL || 'https://cmdahub.com/api';

  const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';

  /** ✅ FIXED - Correct Vite ENV usage */
  const clientId = isWWW
    ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
    : import.meta.env.VITE_GOOGLE_CLIENT_ID;

  /** ✅ Safety check (optional but useful) */
  useEffect(() => {
    if (!clientId) {
      console.error('❌ Google Client ID is missing!');
      toast.error('Google Client ID is missing! Check your environment variables.');
    }
  }, [clientId]);

  /** ✅ useCallback prevents re-render dependency loop */
  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${API_BASE}${AUTH_ENDPOINT}`,
        { credential: credentialResponse.credential },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // ✅ If pendingToken → redirect user to complete registration
      if (response.data.pendingToken) {
        toast.success('Welcome! Please complete your registration.');

        navigate('/individualsignup', {
          state: { pendingData: response.data },
        });

        if (onClose) onClose();
        return;
      }

      // ✅ Existing user → login directly
      const { token, email, name, userType, picture } = response.data;
      login(token);
      localStorage.setItem('userType', userType || 'individual');
      localStorage.setItem('userName', name);
      localStorage.setItem('profilePicture', picture);

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('authChange'));

      toast.success('Logged in with Google successfully!');
      if (onClose) onClose();
      navigate('/');
    } catch (error) {
      console.error('Google Sign-In Failed:', error);
      toast.error(error.response?.data || 'Failed to sign in with Google.');
    }
  }, [API_BASE, AUTH_ENDPOINT, login, navigate, onClose]);

  const handleError = () => {
    console.error('Google Sign-In Error');
    toast.error('An error occurred during Google Sign-In.');
  };

  /** ✅ Google button initialization */
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && window.google.accounts && buttonRef.current) {
        clearInterval(interval);
        try {
          window.google.accounts.id.initialize({
            client_id: clientId, // ✅ THIS MUST NOT BE undefined!
            callback: handleGoogleSuccess,
            error_callback: handleError,
          });

          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          });

          setGoogleReady(true);
        } catch (err) {
          console.error('Google init failed:', err);
          toast.error('Google initialization failed.');
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [clientId, handleGoogleSuccess]);

  const handleClick = () => {
    const realButton = buttonRef.current?.querySelector('div[role="button"]');
    if (!googleReady || !realButton) {
      toast.error('Google login not ready yet. Please wait.');
      return;
    }
    realButton.click();
  };

  return (
    <>
      <GoogleOAuthProvider clientId={clientId || ''}>
        <div
          onClick={handleClick}
          className={`w-full h-11 cursor-pointer flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-150 active:scale-[0.99] ${
            !googleReady ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          <img src="/Google_logo.png" alt="Google" className="w-5" />
          <span className="text-gray-700 font-medium text-[15px]">
            Sign in with Google
          </span>
          <div ref={buttonRef} className="hidden" />
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleLoginButton;
