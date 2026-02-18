// // GoogleRegisterButton.jsx
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
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [countryCode, setCountryCode] = useState('+91');
//   const [fullPhone, setFullPhone] = useState('');

//   if (!isOpen) return null;

//   const handleSubmit = () => {
//     onSubmit(promoCode, { number: phoneNumber, countryCode });
//   };

//   const handleSkip = () => {
//     onSubmit('', { number: '', countryCode: '+91' });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//           Welcome, {email}!
//         </h2>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Contact Number (Optional)
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <FaPhone className="text-gray-400 group-hover:text-sky-500 transition-colors" />
//             </div>
//             <PhoneInput
//               country="in"
//               value={fullPhone}
//               onChange={(value, country) => {
//                 setFullPhone(value);
//                 const dialCode = '+' + country.dialCode;
//                 setCountryCode(dialCode);
//                 setPhoneNumber(value.startsWith(dialCode) ? value.slice(dialCode.length) : value);
//               }}
//               inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
//               placeholder="Enter phone number (optional)"
//             />
//           </div>
//         </div>
//         <input
//           type="text"
//           value={promoCode}
//           onChange={(e) => setPromoCode(e.target.value)}
//           placeholder="Enter promo code (optional)"
//           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
//         />
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={handleSubmit}
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

// const GoogleRegisterButton = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [pendingData, setPendingData] = useState(null);

//   const currentDomain = window.location.hostname;
//   const isWWW = currentDomain.startsWith('www.');
//   const API_BASE = isWWW
//     ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
//     : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
//   const AUTH_ENDPOINT = isWWW ? '/auth876/google/google-www' : '/auth/google';
//   const clientId = isWWW
//     ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
//     : import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE}${AUTH_ENDPOINT}`,
//         { credential: credentialResponse.credential },
//         { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
//       );

//       if (response.data.pendingToken) {
//         setPendingData({
//           pendingToken: response.data.pendingToken,
//           email: response.data.email,
//           name: response.data.name,
//           picture: response.data.picture,
//         });
//         setShowPromoModal(true);
//       } else {
//         // Already registered → login
//         const { token, email, name, userType, picture } = response.data;
//         login(token);
//         localStorage.setItem('userType', userType || 'individual');
//         localStorage.setItem('userName', name);
//         localStorage.setItem('profilePicture', picture);
//         window.dispatchEvent(new Event('storage'));
//         window.dispatchEvent(new Event('authChange'));
//         toast.success('Logged in successfully!');
//         navigate('/');
//       }
//     } catch (error) {
//       toast.error('Google Sign-In failed.');
//     }
//   };

//   const handleCompleteRegistration = async (promoCode, phone) => {
//     if (!pendingData) return;

//     try {
//       const response = await axios.post(
//         `${API_BASE}/auth/google/complete`,
//         {
//           pendingToken: pendingData.pendingToken,
//           promoCode: promoCode || '',
//           countryCode: phone.countryCode || '+91',
//           mobileNum: phone.number || '',
//         },
//         { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
//       );

//       const { token, email, name, userType, picture } = response.data;
//       login(token);
//       localStorage.setItem('userType', userType || 'individual');
//       localStorage.setItem('userName', name);
//       localStorage.setItem('profilePicture', picture);
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('authChange'));
//       toast.success('Registered successfully!');
//       setShowPromoModal(false);
//       navigate('/');
//     } catch (error) {
//       const msg = error.response?.data || 'Registration failed';
//       if (msg.includes('promo')) {
//         toast.error(msg, { duration: 5000 });
//       } else {
//         toast.error(msg);
//         setShowPromoModal(false);
//       }
//     }
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={clientId}>
//         <GoogleLogin
//           onSuccess={handleGoogleSuccess}
//           onError={() => toast.error('Google Sign-In failed')}
//           render={(renderProps) => (
//             <button
//               type="button"
//               className="w-full bg-white text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center justify-center space-x-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
//               onClick={renderProps.onClick}
//               disabled={renderProps.disabled}
//             >
//               <img src="/Google_logo.png" alt="Google" className="w-5 h-5" />
//               <span>Sign up with Google</span>
//             </button>
//           )}
//         />
//       </GoogleOAuthProvider>

//       <PromoCodeModal
//         isOpen={showPromoModal}
//         onClose={() => setShowPromoModal(false)}
//         onSubmit={handleCompleteRegistration}
//         email={pendingData?.email || ''}
//       />
//     </>
//   );
// };

// export default GoogleRegisterButton;


// src/components/GoogleRegisterButton.jsx
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
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

//   const handleSubmit = () => onSubmit(promoCode, { number: phoneNumber, countryCode });
//   const handleSkip   = () => onSubmit('', { number: '', countryCode: '+91' });

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//           Welcome, {email}!
//         </h2>

//         {/* Phone */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Contact Number (Optional)
//           </label>
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <FaPhone className="text-gray-400 group-hover:text-sky-500 transition-colors" />
//             </div>
//             <PhoneInput
//               country="in"
//               value={fullPhone}
//               onChange={(value, country) => {
//                 setFullPhone(value);
//                 const dial = '+' + country.dialCode;
//                 setCountryCode(dial);
//                 setPhoneNumber(value.startsWith(dial) ? value.slice(dial.length) : value);
//               }}
//               inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
//               placeholder="Enter phone number (optional)"
//             />
//           </div>
//         </div>

//         {/* Promo */}
//         <input
//           type="text"
//           value={promoCode}
//           onChange={e => setPromoCode(e.target.value)}
//           placeholder="Enter promo code (optional)"
//           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
//         />

//         <div className="flex justify-end gap-4">
//           <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//             Submit
//           </button>
//           <button onClick={handleSkip} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
//             Skip
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoogleRegisterButton = () => {
//   const navigate = useNavigate();
//   const [showPromo, setShowPromo] = useState(false);
//   const [pending, setPending] = useState(null);

//   const currentDomain = window.location.hostname;
//   const isWWW = currentDomain.startsWith('www.');
//   const API_BASE = isWWW
//     ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
//     : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
//   const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
//   const clientId = isWWW
//     ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
//     : import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   /* --------------------------------------------------------------
//      1. First call – Google returns credential → backend creates
//          a *pending* token (user does NOT exist yet)
//      -------------------------------------------------------------- */
//   const handleGoogle = async credentialResponse => {
//     try {
//       const { data } = await axios.post(
//         `${API_BASE}${AUTH_ENDPOINT}`,
//         { credential: credentialResponse.credential },
//         { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
//       );

//       // pendingToken → show promo/phone modal
//       if (data.pendingToken) {
//         setPending({
//           pendingToken: data.pendingToken,
//           email: data.email,
//           name: data.name,
//           picture: data.picture,
//         });
//         setShowPromo(true);
//       } else {
//         // User already exists → should never happen on the *signup* page
//         toast.error('Account already exists. Please log in.');
//         navigate('/login');
//       }
//     } catch (e) {
//       toast.error(e.response?.data || 'Google sign-in failed');
//     }
//   };

//   /* --------------------------------------------------------------
//      2. Complete registration – **NO login()**, just create account
//      -------------------------------------------------------------- */
//   const completeRegistration = async (promoCode, phone) => {
//     if (!pending) return;

//     try {
//       await axios.post(
//         `${API_BASE}/auth/google/complete`,
//         {
//           pendingToken: pending.pendingToken,
//           promoCode: promoCode || '',
//           countryCode: phone.countryCode || '+91',
//           mobileNum: phone.number || '',
//         },
//         { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
//       );

//       toast.success('Registration successful! Please log in.');
//       setShowPromo(false);
//       setPending(null);
//       navigate('/login');               // <-- **NO AUTO LOGIN**
//     } catch (e) {
//       const msg = e.response?.data || 'Registration failed';
//       toast.error(msg);
//     }
//   };

//   return (
//     <>
//       <GoogleOAuthProvider clientId={clientId}>
//         <GoogleLogin
//           onSuccess={handleGoogle}
//           onError={() => toast.error('Google sign-in failed')}
//           render={renderProps => (
//             <button
//               type="button"
//               className="w-full bg-white text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center justify-center space-x-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
//               onClick={renderProps.onClick}
//               disabled={renderProps.disabled}
//             >
//               <img src="/Google_logo.png" alt="Google" className="w-5 h-5" />
//               <span>Sign up with Google</span>
//             </button>
//           )}
//         />
//       </GoogleOAuthProvider>

//       <PromoCodeModal
//         isOpen={showPromo}
//         onClose={() => setShowPromo(false)}
//         onSubmit={completeRegistration}
//         email={pending?.email || ''}
//       />
//     </>
//   );
// };

// export default GoogleRegisterButton;

import { useEffect, useRef, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaPhone } from 'react-icons/fa';

const PromoCodeModal = ({ isOpen, onClose, onSubmit, email }) => {
  const [promoCode, setPromoCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [fullPhone, setFullPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => onSubmit(promoCode, { number: phoneNumber, countryCode });
  const handleSkip = () => onSubmit('', { number: '', countryCode: '+91' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Welcome, {email}!
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contact Number (Optional)
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaPhone className="text-gray-400 group-hover:text-sky-500 transition-colors" />
            </div>
            <PhoneInput
              country="in"
              value={fullPhone}
              onChange={(value, country) => {
                setFullPhone(value);
                const dial = '+' + country.dialCode;
                setCountryCode(dial);
                setPhoneNumber(value.startsWith(dial) ? value.slice(dial.length) : value);
              }}
              inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white transition-all duration-200 group-hover:border-sky-400"
              placeholder="Enter phone number (optional)"
            />
          </div>
        </div>

        <input
          type="text"
          value={promoCode}
          onChange={e => setPromoCode(e.target.value)}
          placeholder="Enter promo code (optional)"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            onClick={handleSkip}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

const GoogleRegisterButton = () => {
  const navigate = useNavigate();
  const [showPromo, setShowPromo] = useState(false);
  const [pending, setPending] = useState(null);
  const buttonRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);

  const currentDomain = window.location.hostname;
  const isWWW = currentDomain.startsWith('www.');
  const API_BASE = isWWW
    ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
    : import.meta.env.VITE_URL || 'https://cmdahub.com/api';
  const AUTH_ENDPOINT = isWWW ? '/auth/google/google-www' : '/auth/google';
  const clientId = isWWW
    ? import.meta.env.VITE_GOOGLE_CLIENT_WWW_ID
    : import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogle = async credentialResponse => {
    try {
      const { data } = await axios.post(
        `${API_BASE}${AUTH_ENDPOINT}`,
        { credential: credentialResponse.credential },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      if (data.pendingToken) {
        setPending({
          pendingToken: data.pendingToken,
          email: data.email,
          name: data.name,
          picture: data.picture,
        });
        setShowPromo(true);
      } else {
        toast.error('Account already exists. Please log in.');
        navigate('/login');
      }
    } catch (e) {
      toast.error(e.response?.data || 'Google sign-in failed');
    }
  };

  const completeRegistration = async (promoCode, phone) => {
    if (!pending) return;

    try {
      await axios.post(
        `${API_BASE}/auth/google/complete`,
        {
          pendingToken: pending.pendingToken,
          promoCode: promoCode || '',
          countryCode: phone.countryCode || '+91',
          mobileNum: phone.number || '',
        },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      toast.success('Registration successful! Please log in.');
      setShowPromo(false);
      setPending(null);
      navigate('/login');
    } catch (e) {
      const msg = e.response?.data || 'Registration failed';
      toast.error(msg);
    }
  };

  // ✅ copied from working login logic
  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.accounts && buttonRef.current) {
        clearInterval(checkGoogle);
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogle,
          });
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            width: '100%',
            shape: 'rectangular',
          });
          setGoogleReady(true);
        } catch (err) {
          console.error('Google init failed:', err);
        }
      }
    }, 300);
    return () => clearInterval(checkGoogle);
  }, [clientId]);

  const handleClick = () => {
    const realBtn = buttonRef.current?.querySelector('div[role="button"]');
    if (realBtn) {
      realBtn.click();
    } else {
      toast.error('Google register not ready yet. Please wait a second.');
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <div
          onClick={handleClick}
          className={`
            w-full h-11 cursor-pointer
            flex items-center justify-center gap-3
            bg-white border border-gray-300
            rounded-md hover:bg-gray-50 transition-all duration-150
            active:scale-[0.99]
            ${!googleReady ? 'opacity-60 cursor-not-allowed' : ''}
          `}
        >
          <img src="/Google_logo.png" alt="Google" className="w-5 h-5" />
          <span className="text-gray-700 font-medium text-[15px]">
            Sign up with Google
          </span>
          <div ref={buttonRef} className="hidden" />
        </div>
      </GoogleOAuthProvider>

      <PromoCodeModal
        isOpen={showPromo}
        onClose={() => setShowPromo(false)}
        onSubmit={completeRegistration}
        email={pending?.email || ''}
      />
    </>
  );
};

export default GoogleRegisterButton;
