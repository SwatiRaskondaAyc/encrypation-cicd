// import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Toaster, toast } from 'react-hot-toast';
// import { useAuth } from './components/AuthContext'; // Ensure this is correctly imported
// import SignUp from './components/SignUp';
// import Home from './home/Home';
// import News from './components/News';
// import Support from './components/Support';
// import Plan from './components/Plan';
// import Offer from './components/Offer';
// // import Portfolio from './components/Portfolio/Portfolio.jsx';
// import FAQ from './components/FAQ';
// import CompleteData from './components/CompleteData';
// import UpdateProfile from './components/UpdateProfile';
// import ProfileDrawer from './components/ProfileDrawer';
// import ForgotPassword from './components/ForgotPassword';
// import ResetPassword from './components/ResetPassword';
// import AboutUs from './components/AboutUs';
// import TermsConditions from './components/TermsConditions';
// import Admin from './components/Admin';
// import CompleteRegData from './components/CompleteRegData';
// import UpdateIndividualProfile from './components/UpdateIndividualProfile';
// import UpdateCorporateProfile from './components/UpdateCorporateProfile';
// import EquityHub from './components/EquityHub/EquityHub.jsx';
// import Search from './components/EquityHub/Search.jsx';
// import StockTalks from './components/ChatEngine/StockTalks.jsx';
// import ChatPage from './components/ChatEngine/ChatPage.jsx';
// import IndividualSignUp from './components/IndividualSignUp.jsx';
// import CorporateSignUp from './components/CorporateSignup.jsx'
// import IndividualResetPassword from './components/IndividualResetPassword.jsx';
// import CorporateResetPassword from './components/CorporateResetPassword.jsx';
// import Dashboard from './components/DashBoard/DashBoard.jsx';
// import OpenCloseCards from './components/EquityHub/OpenCloseCards.jsx';
// import HomeNavbar from './components/HomeNavbar.jsx';
// import SavedDashboard from './components/DashBoard/SavedDashbord.jsx';
// import PublicDashboard from './components/DashBoard/PublicDashboard.jsx';
// import OAuth2RedirectHandler from './services/OAuth2RedirectHandler.jsx';
// import PortLandPage from './components/Portfolio/PortLandPage.jsx';
// import MyPortfolioPage from './components/Portfolio/MyPortfolioPage.jsx';
// import PortfolioReplacement from './components/Portfolio/PortfolioReplacement.jsx';
// import BuildOwnPort from './components/Portfolio/BuildOwnPort.jsx';
// import PromoCodeStep from './components/PromoCodeStep';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Bot, X, Maximize2, Minimize2 } from 'lucide-react';
// import Draggable from 'react-draggable';
// import AddNewModal from './components/DashBoard/AddNewModal.jsx'
// import Login from './components/Login.jsx';
// import EmailLogin from './components/EmailLogin.jsx';
// import Patterns from './components/CandlePatternComponent/Patterns.jsx';

// import RedirectUppercase from './components/RedirectUppercase.jsx';
// import NotFound from './components/NotFound.jsx';
// import MarketIndices from './components/Indice/MarketIndices.jsx';
// import BrokerageCalculator from './components/Finance/BrokerageCalculator.jsx';
// import SearchTutorial from './components/EquityHub/SearchTutorial.jsx';
// import Sidebar from './components/Portfolio/Sidebar.jsx';
// // import UserProfile from './components/ProfileSection/UserProfile.jsx';

// // import { Helmet } from 'react-helmet-async';

// const ResetPasswordHandler = () => {
//   const queryParams = new URLSearchParams(window.location.search);
//   const userType = queryParams.get('type');
//   const token = queryParams.get('token');

//   // console.log('Extracted userType from URL:', userType);
//   // console.log('Extracted token from URL:', token);

//   if (!userType || !token) {
//     return <h2>Invalid reset link</h2>;
//   }

//   return userType === 'corporate' ? (
//     <CorporateResetPassword token={token} />
//   ) : (
//     <IndividualResetPassword token={token} />
//   );
// };

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();
//   return isAuthenticated ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
// };
// const GoogleCallback = () => {
//   const location = useLocation();
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [showPromoModal, setShowPromoModal] = useState(false);
//   const [pendingData, setPendingData] = useState(null);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const code = params.get('code');
//     if (code) {
//       axios
//         .post(
//           'https://cmdahub.com/api/auth/google/callback',
//           { code },
//           { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
//         )
//         .then((response) => {
//           const { pendingToken, email, name, picture } = response.data;
//           if (pendingToken) {
//             setPendingData({ pendingToken, email, name, picture });
//             setShowPromoModal(true);
//           } else {
//             const { token, email, name, userType, picture } = response.data;
//             login(token);
//             localStorage.setItem('userType', userType || 'individual');
//             localStorage.setItem('userName', name);
//             localStorage.setItem('profilePicture', picture);
//             window.dispatchEvent(new Event('storage'));
//             window.dispatchEvent(new Event('authChange'));
//             toast.success('Logged in with Google successfully!');
//             navigate('/');
//           }
//         })
//         .catch((error) => {
//           console.error('Google Callback Failed:', error.response?.data || error.message);
//           toast.error('Failed to process Google login.');
//           navigate('/signup');
//         });
//     } else {
//       toast.error('No authorization code provided.');
//       navigate('/signup');
//     }
//   }, [location, login, navigate]);

//   const handlePromoSubmit = async (promoCode) => {
//     if (!pendingData) {
//       console.error('No pending data for promo submission');
//       return;
//     }
//     try {
//       const response = await axios.post(
//         'https://cmdahub.com/api/auth/google/complete',
//         {
//           pendingToken: pendingData.pendingToken,
//           promoCode: promoCode || '',
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
//       toast.success('Registered with Google successfully!');
//       setShowPromoModal(false);
//       setPendingData(null);
//       navigate('/');
//     } catch (error) {
//       console.error('Google Registration Failed:', error.response?.data || error.message);
//       toast.error(error.response?.data || 'Failed to complete registration.');
//     }
//   };

//   return (
//     <>
//       <div>Processing Google login...</div>
//       <PromoCodeStep
//         isOpen={showPromoModal}
//         onClose={() => setShowPromoModal(false)}
//         onSubmit={handlePromoSubmit}
//         email={pendingData?.email || ''}
//       />
//     </>
//   );
// };

// const App = () => {
//   const [theme, setTheme] = useState('light');
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [iframeError, setIframeError] = useState(false);
//   const { login } = useAuth();
//   const location = useLocation();
//   const handleLoginSuccess = () => {
//     login();
//   };


//   // useEffect(() => {
//   //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
//   //   setTheme(prefersDark.matches ? 'dark' : 'light');
//   //   const handleChange = (e) => setTheme(e.matches ? 'dark' : 'light');
//   //   prefersDark.addEventListener('change', handleChange);
//   //   return () => prefersDark.removeEventListener('change', handleChange);
//   // }, []);

//   useEffect(() => {
//     // Force light mode on initial load and route change
//     setTheme('light');
//     document.documentElement.classList.remove('dark');
//     document.documentElement.classList.add('light');
//     document.documentElement.style.colorScheme = 'light';
//   }, [location.pathname]);


//   const toggleChat = () => setIsChatOpen(!isChatOpen);
//   const toggleMaximize = () => setIsMaximized(!isMaximized);

//   useEffect(() => {
//     if (isChatOpen) {
//       setShowPopup(false);
//       return;
//     }
//     const initialTimeout = setTimeout(() => setShowPopup(true), 6000);
//     const interval = setInterval(() => {
//       setShowPopup(true);
//       setTimeout(() => setShowPopup(false), 3000);
//     }, 10000 + Math.random() * 5000);
//     return () => {
//       clearTimeout(initialTimeout);
//       clearInterval(interval);
//     };
//   }, [isChatOpen]);

//   const handleIframeError = () => setIframeError(true);

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.2 },
//     }),
//   };

//   const bannerVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
//   };

//   const chatVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
//   };

//   const popupVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
//   };

//   return (
//     <div className={`app ${theme}`}>


//       {/* <Helmet>
//         {/* Meta Pixel Script 
//         <script>
//           {`
//             !function(f,b,e,v,n,t,s)
//             {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//             n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//             if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//             n.queue=[];t=b.createElement(e);t.async=!0;
//             t.src=v;s=b.getElementsByTagName(e)[0];
//             s.parentNode.insertBefore(t,s)}(window, document,'script',
//             'https://connect.facebook.net/en_US/fbevents.js');
//             fbq('init', '1212004467278399');
//             fbq('track', 'PageView');
//           `}
//         </script>
//         {/* Noscript fallback 
//         <noscript>
//           {`
//             <img
//               height="1"
//               width="1"
//               style="display:none"
//               src="https://www.facebook.com/tr?id=1212004467278399&ev=PageView&noscript=1"
//             />
//           `}
//         </noscript>
//       </Helmet> */}
//       <RedirectUppercase />
//       <Routes className={theme}>
//         <Route path="/" element={<Home />} />
//         <Route path='*' element={<NotFound />} />

//         <Route path='/login' element={<Login onSuccess={handleLoginSuccess} />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/news" element={<News />} />
//         <Route path="/support" element={<Support />} />
//         <Route path="/plan" element={<Plan />} />
//         <Route path="/offer" element={<Offer />} />
//         {/* <Route path="/portfolio" element={<Portfolio />} /> */}
//         <Route path="/faq" element={<FAQ />} />
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/completedata" element={<CompleteData />} />
//         <Route path="/completeregdata" element={<CompleteRegData />} />
//         <Route path="/updateprofile/*" element={<UpdateProfile />} />
//         <Route path="/profiledrawer" element={<ProfileDrawer />} />
//         <Route path="/forgotpassword" element={<ForgotPassword />} />
//         <Route path="/resetpassword" element={<ResetPassword />} />
//         <Route path="/terms" element={<TermsConditions />} />
//         <Route path="/promo" element={<PromoCodeStep />} />
//         <Route path="/admin/*" element={<Admin />} />
//         <Route path="/equityinsights" element={<EquityHub onSuccess={handleLoginSuccess} />} />
//         <Route path="/search" element={<Search />} />
//         {/* <Route path="/portfolio" element={<PortLandPage />} /> */}
//         <Route path="/portfolio/mysaved-portfolio" element={<MyPortfolioPage />} />
//         <Route path="/portfolio/swap" element={<PortfolioReplacement />} />
//         <Route path="/portfolio/paper-trading" element={<BuildOwnPort />} />

//         <Route path="/updateindividualprofile" element={<UpdateIndividualProfile />} />
//         <Route path="/updatecorporateprofile/*" element={<UpdateCorporateProfile />} />
//         <Route path="/individualsignup" element={<IndividualSignUp onSuccess={handleLoginSuccess} />} />
//         <Route path="/corporatesignup" element={<CorporateSignUp onSuccess={handleLoginSuccess} />} />
//         <Route path="/emaillogin" element={<EmailLogin />} />
//         <Route path="/reset-password" element={<ResetPasswordHandler />} />
//         <Route path="/individualresetpassword" element={<IndividualResetPassword />} />
//         <Route path="/corporateresetpassword" element={<CorporateResetPassword />} />
//         <Route path="/researchpanel" element={<Dashboard onSuccess={handleLoginSuccess} />} />
//         <Route path="/oauth/redirect" element={<OAuth2RedirectHandler />} />
//         <Route path="/addnewModal" element={<AddNewModal />} />
//         <Route path="/savedDashboard" element={<SavedDashboard />} />
//         <Route path="/public-dashboard" element={<PublicDashboard />} />
//        <Route path='/search-tutorial' element={< SearchTutorial />} />
//             <Route path='/patterns' element={<Patterns />} />
//             <Route path='/portfolio' element={<Sidebar /> } />



//         <Route
//           path="/api/dashboard/:dashId"
//           element={<Navigate to={({ params }) => `/public-dashboard?dashId=${params.dashId}`} replace />}
//         />
//         <Route path="/auth/google/callback" element={<GoogleCallback />} />
//         <Route path="/market-indices" element={<MarketIndices />} />
//        <Route path="/calculators/brokerage-calculator" element={<BrokerageCalculator />} />
//       </Routes>

//       <Toaster />

//       {/* Chatbot Button */}
//       <button
//         onClick={toggleChat}
//         className="fixed bottom-6 right-6 bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-900 transition-colors duration-300 z-50"
//         title={isChatOpen ? 'Close Chatbot' : 'Open Chatbot'}
//       >
//         <Bot size={24} />
//       </button>
//       {/* Chatbot Popup */}
//       <AnimatePresence>
//         {showPopup && !isChatOpen && (
//           <motion.div
//             className="fixed bottom-20 right-6 bg-sky-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 cursor-pointer max-w-[200px] text-sm"
//             initial="hidden"
//             animate="visible"
//             exit="hidden"
//             variants={popupVariants}
//             onClick={toggleChat}
//             title="Click to open chatbot"
//           >
//             Instant Stock Analysis & Market Insights – Powered by AI
//           </motion.div>
//         )}
//       </AnimatePresence>
//       {/* Chatbot Window */}
//       <AnimatePresence>
//         {isChatOpen && (
//           <Draggable handle=".chat-header" disabled={isMaximized}>
//             <motion.div
//               className={`fixed bottom-20 right-6 bg-white dark:bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden
//                 ${isMaximized ? 'top-0 left-0 w-full h-full' : 'w-[400px] h-[600px]'}`}
//               initial="hidden"
//               animate="visible"
//               exit="hidden"
//               variants={chatVariants}
//             >
//               <div className="chat-header bg-sky-800 text-white p-2 flex justify-between items-center cursor-move">
//                 <span className="font-semibold">Chatbot</span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={toggleMaximize}
//                     className="p-1 hover:bg-sky-700 rounded"
//                     title={isMaximized ? 'Restore' : 'Maximize'}
//                   >
//                     {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//                   </button>
//                   <button
//                     onClick={toggleChat}
//                     className="p-1 hover:bg-sky-700 rounded"
//                     title="Close"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               </div>
//               {iframeError ? (
//                 <div className="w-full h-[calc(100%-40px)] flex items-center justify-center text-center p-4 text-gray-600 dark:text-gray-300">
//                   Unable to load chatbot. Please try again or access it from https://cmdahub.com/.
//                 </div>
//               ) : (
//                 <iframe
//                   src="https://cmdahub.info/"
//                   className="w-full h-[calc(100%-40px)] border-none"
//                   title="Chatbot"
//                   referrerPolicy="strict-origin-when-cross-origin"
//                   onError={handleIframeError}
//                 />
//               )}
//             </motion.div>
//           </Draggable>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default App;







import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
// import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from './components/AuthContext'; // Ensure this is correctly imported
import SignUp from './components/SignUp';
import Home from './home/Home';
import News from './components/News';
import Support from './components/Support';
import Plan from './components/Plan';
import Offer from './components/Offer';
// import Portfolio from './components/Portfolio/Portfolio.jsx';
import FAQ from './components/FAQ';
import CompleteData from './components/CompleteData';
import UpdateProfile from './components/UpdateProfile';
import ProfileDrawer from './components/ProfileDrawer';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AboutUs from './components/AboutUs';
import TermsConditions from './components/TermsConditions';
import Admin from './components/Admin';
import CompleteRegData from './components/CompleteRegData';
import UpdateIndividualProfile from './components/UpdateIndividualProfile';
import UpdateCorporateProfile from './components/UpdateCorporateProfile';
import EquityHub from './components/EquityHub/EquityHub.jsx';
import Search from './components/EquityHub/Search.jsx';
import StockTalks from './components/ChatEngine/StockTalks.jsx';
import ChatPage from './components/ChatEngine/ChatPage.jsx';
import IndividualSignUp from './components/IndividualSignUp.jsx';
import CorporateSignUp from './components/CorporateSignup.jsx'
import IndividualResetPassword from './components/IndividualResetPassword.jsx';
import CorporateResetPassword from './components/CorporateResetPassword.jsx';
import Dashboard from './components/DashBoard/DashBoard.jsx';
import OpenCloseCards from './components/EquityHub/OpenCloseCards.jsx';
import HomeNavbar from './components/HomeNavbar.jsx';
import SavedDashboard from './components/DashBoard/SavedDashbord.jsx';
import PublicDashboard from './components/DashBoard/PublicDashboard.jsx';
import OAuth2RedirectHandler from './services/OAuth2RedirectHandler.jsx';
import PortLandPage from './components/Portfolio/PortLandPage.jsx';
import MyPortfolioPage from './components/Portfolio/MyPortfolioPage.jsx';
import PortfolioReplacement from './components/Portfolio/PortfolioReplacement.jsx';
import BuildOwnPort from './components/Portfolio/BuildOwnPort.jsx';
import PromoCodeStep from './components/PromoCodeStep';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Maximize2, Minimize2 } from 'lucide-react';
import Draggable from 'react-draggable';
import AddNewModal from './components/DashBoard/AddNewModal.jsx'
import Login from './components/Login.jsx';
import EmailLogin from './components/EmailLogin.jsx';
import Patterns from './components/CandlePatternComponent/Patterns.jsx';

import RedirectUppercase from './components/RedirectUppercase.jsx';
import NotFound from './components/NotFound.jsx';
import MarketIndices from './components/Indice/MarketIndices.jsx';
import BrokerageCalculator from './components/Finance/BrokerageCalculator.jsx';
import SearchTutorial from './components/EquityHub/SearchTutorial.jsx';
import Sidebar from './components/Portfolio/Sidebar.jsx';
import Webinar from './components/Webinar/Webinar.jsx';
import WebinarDetails from './components/Webinar/WebinarDetails.jsx';
// import UserProfile from './components/ProfileSection/UserProfile.jsx';

// ✅ IMPORT ALL NEEDED TRACKING FUNCTIONS
import {
  trackPageView,
  trackLogin,
  trackSignup,
  trackRegistrationComplete,
  trackChatbot
} from './utils/tracking.js';
import { ToastContainer } from 'react-toastify';
// import { Helmet } from 'react-helmet-async';

const ResetPasswordHandler = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const userType = queryParams.get('type');
  const token = queryParams.get('token');

  // console.log('Extracted userType from URL:', userType);
  // console.log('Extracted token from URL:', token);

  if (!userType || !token) {
    return <h2>Invalid reset link</h2>;
  }

  return userType === 'corporate' ? (
    <CorporateResetPassword token={token} />
  ) : (
    <IndividualResetPassword token={token} />
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};
const GoogleCallback = () => {
  const location = useLocation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      axios
        .post(
          'https://cmdahub.com/api/auth/google/callback',
          { code },
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        )
        .then((response) => {
          const { pendingToken, email, name, picture } = response.data;
          if (pendingToken) {
            setPendingData({ pendingToken, email, name, picture });
            setShowPromoModal(true);
          } else {
            const { token, email, name, userType, picture } = response.data;
            login(token);
            localStorage.setItem('userType', userType || 'individual');
            localStorage.setItem('userName', name);
            localStorage.setItem('profilePicture', picture);
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('authChange'));
            // ✅ USE TRACKING UTILITY - FIXED
            trackRegistrationComplete('google', userType, false);
            toast.success('Logged in with Google successfully!');
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('Google Callback Failed:', error.response?.data || error.message);
          toast.error('Failed to process Google login.');
          navigate('/signup');
        });
    } else {
      toast.error('No authorization code provided.');
      navigate('/signup');
    }
  }, [location, login, navigate]);

  const handlePromoSubmit = async (promoCode) => {
    if (!pendingData) {
      console.error('No pending data for promo submission');
      return;
    }
    try {
      const response = await axios.post(
        'https://cmdahub.com/api/auth/google/complete',
        {
          pendingToken: pendingData.pendingToken,
          promoCode: promoCode || '',
        },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      const { token, email, name, userType, picture } = response.data;
      login(token);
      localStorage.setItem('userType', userType || 'individual');
      localStorage.setItem('userName', name);
      localStorage.setItem('profilePicture', picture);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('authChange'));
      // ✅ USE TRACKING UTILITY - FIXED
      trackRegistrationComplete('google', userType, !!promoCode);
      toast.success('Registered with Google successfully!');
      setShowPromoModal(false);
      setPendingData(null);
      navigate('/');
    } catch (error) {
      console.error('Google Registration Failed:', error.response?.data || error.message);
      toast.error(error.response?.data || 'Failed to complete registration.');
    }
  };

  return (
    <>
      <div>Processing Google login...</div>
      <PromoCodeStep
        isOpen={showPromoModal}
        onClose={() => setShowPromoModal(false)}
        onSubmit={handlePromoSubmit}
        email={pendingData?.email || ''}
      />
    </>
  );
};

const App = () => {
  const [theme, setTheme] = useState('light');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    login();
    // ✅ USE TRACKING UTILITY - FIXED
    trackLogin('email');
  };


  // useEffect(() => {
  //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  //   setTheme(prefersDark.matches ? 'dark' : 'light');
  //   const handleChange = (e) => setTheme(e.matches ? 'dark' : 'light');
  //   prefersDark.addEventListener('change', handleChange);
  //   return () => prefersDark.removeEventListener('change', handleChange);
  // }, []);

  useEffect(() => {
    // Force light mode on initial load and route change
    setTheme('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
  }, [location.pathname]);

  // ✅ SINGLE useEffect for page tracking - REMOVE DUPLICATE
  useEffect(() => {
    // Track page views on route change
    trackPageView(location.pathname, document.title);

    // Log for debugging
    if (import.meta.env.DEV) {
      console.log(`📍 Route changed to: ${location.pathname}`);
    }
  }, [location]);


  useEffect(() => {
    if (isChatOpen) {
      setShowPopup(false);
      return;
    }
    const initialTimeout = setTimeout(() => setShowPopup(true), 6000);
    const interval = setInterval(() => {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }, 10000 + Math.random() * 5000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isChatOpen]);

  const handleIframeError = () => setIframeError(true);
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      // ✅ USE TRACKING UTILITY - FIXED
      trackChatbot.open('floating_button');
    } else {
      trackChatbot.close();
    }
  };

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  const bannerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const chatVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  // Enhanced signup handler with tracking
  const handleSignupClick = (source = 'unknown') => {
    // ✅ USE TRACKING UTILITY - FIXED
    trackSignup(source, 'individual');
    navigate('/signup');
  };

  // Enhanced login handler with tracking
  const handleLoginClick = (method = 'email') => {
    // ✅ USE TRACKING UTILITY - FIXED
    trackLogin(method);
  };
  return (
    <div className={`app ${theme}`}>


      {/* <Helmet>
        {/* Meta Pixel Script 
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1212004467278399');
            fbq('track', 'PageView');
          `}
        </script>
        {/* Noscript fallback 
        <noscript>
          {`
            <img
              height="1"
              width="1"
              style="display:none"
              src="https://www.facebook.com/tr?id=1212004467278399&ev=PageView&noscript=1"
            />
          `}
        </noscript>
      </Helmet> */}
      <RedirectUppercase />
      <Routes className={theme}>
        <Route path="/" element={<Home onSignupClick={handleSignupClick} onLoginClick={handleLoginClick} />} />
        <Route path='*' element={<NotFound />} />

        <Route path='/login' element={<Login onSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/news" element={<News />} />
        <Route path="/support" element={<Support />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/offer" element={<Offer />} />
        {/* <Route path="/portfolio" element={<Portfolio />} /> */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/completedata" element={<CompleteData />} />
        <Route path="/completeregdata" element={<CompleteRegData />} />
        <Route path="/updateprofile/*" element={<UpdateProfile />} />
        <Route path="/profiledrawer" element={<ProfileDrawer />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/promo" element={<PromoCodeStep />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/equityinsights" element={<EquityHub onSuccess={handleLoginSuccess} />} />
        <Route path="/search" element={<Search />} />
        {/* <Route path="/portfolio" element={<PortLandPage />} /> */}
        <Route path="/portfolio/mysaved-portfolio" element={<MyPortfolioPage />} />
        <Route path="/portfolio/swap" element={<PortfolioReplacement />} />
        <Route path="/portfolio/paper-trading" element={<BuildOwnPort />} />

        <Route path="/updateindividualprofile" element={<UpdateIndividualProfile />} />
        <Route path="/updatecorporateprofile/*" element={<UpdateCorporateProfile />} />
        <Route path="/individualsignup" element={<IndividualSignUp onSuccess={handleLoginSuccess} />} />
        <Route path="/corporatesignup" element={<CorporateSignUp onSuccess={handleLoginSuccess} />} />
        <Route path="/emaillogin" element={<EmailLogin />} />
        <Route path="/reset-password" element={<ResetPasswordHandler />} />
        <Route path="/individualresetpassword" element={<IndividualResetPassword />} />
        <Route path="/corporateresetpassword" element={<CorporateResetPassword />} />
        <Route path="/researchpanel" element={<Dashboard onSuccess={handleLoginSuccess} />} />
        <Route path="/oauth/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/addnewModal" element={<AddNewModal />} />
        <Route path="/savedDashboard" element={<SavedDashboard />} />
        <Route path="/public-dashboard" element={<PublicDashboard />} />
        <Route path='/search-tutorial' element={< SearchTutorial />} />
        <Route path='/patterns' element={<Patterns />} />
        <Route path='/education' element={<Webinar />} />
        <Route path='/education/:id' element={<WebinarDetails />} />
        <Route path='/portfolio' element={<Sidebar />} />



        <Route
          path="/api/dashboard/:dashId"
          element={<Navigate to={({ params }) => `/public-dashboard?dashId=${params.dashId}`} replace />}
        />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/market-indices" element={<MarketIndices />} />
        <Route path="/calculators/brokerage-calculator" element={<BrokerageCalculator />} />
      </Routes>

      {/* <Toaster /> */}
      <ToastContainer
        position="top-center"
        autoClose={9000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* Chatbot Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-900 transition-colors duration-300 z-50"
        title={isChatOpen ? 'Close Chatbot' : 'Open Chatbot'}
        data-track="chatbot_toggle"
        data-track-params='{"button_type": "floating"}'
      >
        <Bot size={24} />
      </button>
      {/* Chatbot Popup */}
      <AnimatePresence>
        {showPopup && !isChatOpen && (
          <motion.div
            className="fixed bottom-20 right-6 bg-sky-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 cursor-pointer max-w-[200px] text-sm"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={popupVariants}
            onClick={toggleChat}
            title="Click to open chatbot"
            data-track="chatbot_popup_click"
          >
            Instant Stock Analysis & Market Insights – Powered by AI
          </motion.div>
        )}
      </AnimatePresence>
      {/* Chatbot Window */}
      <AnimatePresence>
        {isChatOpen && (
          <Draggable handle=".chat-header" disabled={isMaximized}>
            <motion.div
              className={`fixed bottom-20 right-6 bg-white dark:bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden
                ${isMaximized ? 'top-0 left-0 w-full h-full' : 'w-[400px] h-[600px]'}`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={chatVariants}
            >
              <div className="chat-header bg-sky-800 text-white p-2 flex justify-between items-center cursor-move">
                <span className="font-semibold">Chatbot</span>
                <div className="flex gap-2">
                  <button
                    onClick={toggleMaximize}
                    className="p-1 hover:bg-sky-700 rounded"
                    title={isMaximized ? 'Restore' : 'Maximize'}
                    data-track="chatbot_maximize_toggle"
                  >
                    {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    onClick={toggleChat}
                    className="p-1 hover:bg-sky-700 rounded"
                    title="Close"
                    data-track="chatbot_close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              {iframeError ? (
                <div className="w-full h-[calc(100%-40px)] flex items-center justify-center text-center p-4 text-gray-600 dark:text-gray-300">
                  Unable to load chatbot. Please try again or access it from https://cmdahub.com/.
                </div>
              ) : (
                <iframe
                  src="https://cmdahub.info/"
                  className="w-full h-[calc(100%-40px)] border-none"
                  title="Chatbot"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onError={handleIframeError}
                  onLoad={() => {
                    if (window.dataLayer) {
                      window.dataLayer.push({
                        event: 'chatbot_loaded',
                        timestamp: new Date().toISOString()
                      });
                    }
                  }}
                />
              )}
            </motion.div>
          </Draggable>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
