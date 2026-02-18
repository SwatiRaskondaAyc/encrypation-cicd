
// import React, { useEffect, useState, useRef } from "react";
// import { logActivity, getProfilePicture } from "../services/api";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaSun, FaMoon, FaTimes } from "react-icons/fa";
// import { MdDelete, MdOutlineSettings } from "react-icons/md";
// import { AiFillProfile } from "react-icons/ai";
// import { BsQuestionCircle } from "react-icons/bs";
// import Profile from "./Profile";
// import UpdateIndividualProfile from "./UpdateIndividualProfile";
// import UpdateCorporateProfile from "./UpdateCorporateProfile";
// import Username from "./Username";
// import ProfilePicture from "./ProfilePicture";
// import profile from "../../public/profile.png";
// import { CgLogIn, CgProfile } from "react-icons/cg";
// import { HiOutlineLogout } from "react-icons/hi";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "./AuthContext";
// import { Search } from "lucide-react";
// import SearchList from "./EquityHub/SearchList";
// import axios from "axios";
// import { IoMdArrowDropdown, IoMdMenu } from "react-icons/io";
// import QuizModal from "./QuizModal";
// import JwtUtil from "../services/JwtUtil";
// import FinancialCalculatorsMenu from "./Finance/FinancialCalculatorsMenu";
// // import { useState, useEffect, useRef } from "react";
// import { FaCoins } from "react-icons/fa";
// import PointsDashboard from "./EarnedPoints/PointsDashboard";
// import NavbarSearchList from "./EquityHub/NavbarSearchList";
// import Webinar from "../components/Webinar/Webinar";


// const Navbar = ({ handleNavClick: propNavClick, hasUnsavedChanges, setPendingNavigation, setShowUnsavedModal }) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [profileImage, setProfileImage] = useState(null);
//     const [sticky, setSticky] = useState(false);
//     const [userType, setUserType] = useState(localStorage.getItem('userType') || 'individual');
//     const [fullName, setFullName] = useState("");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [results, setResults] = useState([]);
//     const [error, setError] = useState(null);
//     const [showQuizModal, setShowQuizModal] = useState(false);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [hasShownQuizPopup, setHasShownQuizPopup] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
//     const [isDisabled, setIsDisabled] = useState(true);
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { login, logout } = useAuth();

//     const profileCollapseRef = useRef(null);
//     const settingsCollapseRef = useRef(null);
//     const quizCollapseRef = useRef(null);
//     const mobileMenuRef = useRef(null);
//     const searchRef = useRef(null);
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const CACHE_TTL = 24 * 60 * 60 * 1000;
//     const ONE_DAY = 24 * 60 * 60 * 1000;
//     const INACTIVITY_TIMEOUT = 2 * ONE_DAY;
//     // const INACTIVITY_TIMEOUT = 12 * 60 * 60 * 1000;
//     const TOKEN_CHECK_INTERVAL = 24 * 60 * 60 * 1000;
//     const [isFinancialCalculatorsOpen, setIsFinancialCalculatorsOpen] = useState(false);
//     const [pointsCount, setPointsCount] = useState(0);
//     const drawerCheckboxRef = useRef(null); // Optional: better than document.getElementById

//     useEffect(() => {
//         const drawerCheckbox = drawerCheckboxRef.current || document.getElementById("my-drawer-4");

//         const fetchPoints = async () => {
//             try {
//                 const res = await fetch("/api/user/points", {

//                 });
//                 const data = await res.json();
//                 setPoints(data.points ?? 0);
//             } catch (err) {
//                 console.error("Failed to load points", err);
//                 setPoints(0);
//             }
//         };

//         // Fetch when drawer opens
//         if (drawerCheckbox?.checked) {
//             fetchPoints();
//         }

//         const handleDrawerChange = () => {
//             if (drawerCheckbox?.checked) {
//                 fetchPoints();
//             }
//         };

//         drawerCheckbox?.addEventListener("change", handleDrawerChange);

//         return () => {
//             drawerCheckbox?.removeEventListener("change", handleDrawerChange);
//         };
//     }, []);

//     let inactivityTimer;


//     // Listen for points updates (you can use a context or event system)
//     useEffect(() => {
//         const handlePointsUpdate = (event) => {
//             setPointsCount(prev => prev + event.detail.points);
//         };

//         window.addEventListener('pointsAdded', handlePointsUpdate);
//         return () => window.removeEventListener('pointsAdded', handlePointsUpdate);
//     }, []);

//     // Close mobile menu when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
//                 setIsMobileMenuOpen(false);
//             }
//             if (searchRef.current && !searchRef.current.contains(event.target)) {
//                 setResults([]);
//                 setError(null);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // Theme effect
//     useEffect(() => {
//         if (theme === 'dark') {
//             document.documentElement.classList.add('dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//         }
//         localStorage.setItem('theme', theme);
//     }, [theme]);

//     const toggleTheme = () => {
//         setTheme(theme === 'dark' ? 'light' : 'dark');
//     };

//     const resetInactivityTimer = () => {
//         if (inactivityTimer) clearTimeout(inactivityTimer);
//         if (isLoggedIn) inactivityTimer = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
//     };

//     // Enhanced logout function with immediate state update
//     const coreLogout = async () => {
//         // Immediately update UI state before API call
//         setIsLoggedIn(false);
//         setProfileImage(profile);
//         setFullName("");

//         await logout();
//         navigate('/');
//         setIsMobileMenuOpen(false);
//         setIsDrawerOpen(false);

//         // Force close the drawer
//         const drawerCheckbox = drawerCheckboxRef.current || document.getElementById("my-drawer-4");
//         if (drawerCheckbox) {
//             drawerCheckbox.checked = false;
//         }
//     };

//     const handleLogout = () => {
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label: 'logout', path: '/' });
//             setShowUnsavedModal(true);
//             return;
//         }
//         coreLogout();
//     };

//     const handleDeleteAccount = async () => {
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label: 'deleteAccount', path: '/' });
//             setShowUnsavedModal(true);
//             return;
//         }
//         const apiUrl = userType === "corporate"
//             ? `${API_BASE}/corporate/delete-account`
//             : `${API_BASE}/Userprofile/delete-account`;

//         try {
//             await axios.delete(apiUrl, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//                     "Content-Type": "application/json",
//                 },
//             });
//             toast.success("Account deleted successfully");
//             localStorage.removeItem("authToken");
//             localStorage.removeItem("userType");
//             localStorage.removeItem("hasShownQuizPopup");

//             // Use enhanced logout
//             await coreLogout();
//             setShowDeleteModal(false);
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to delete account");
//         }
//     };

//     useEffect(() => {
//         const checkTokenExpiration = () => {
//             const token = localStorage.getItem('authToken');
//             if (token && JwtUtil.isTokenExpired(token)) {
//                 toast.error("Session expired. Please log in again.");
//                 handleLogout();
//             }
//         };

//         if (isLoggedIn) {
//             checkTokenExpiration();
//             const interval = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
//             return () => clearInterval(interval);
//         }
//     }, [isLoggedIn]);

//     useEffect(() => {
//         const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
//         const handleActivity = () => resetInactivityTimer();

//         if (isLoggedIn) {
//             resetInactivityTimer();
//             events.forEach(event => window.addEventListener(event, handleActivity));
//         }

//         return () => {
//             if (inactivityTimer) clearTimeout(inactivityTimer);
//             events.forEach(event => window.removeEventListener(event, handleActivity));
//         };
//     }, [isLoggedIn]);

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 const res = await axios.get(`${API_BASE}/assessment/questions`);
//                 if (res.status === 200) setQuizQuestions(res.data);
//             } catch (error) {
//                 console.error("Failed to fetch quiz questions", error);
//                 toast.error("Failed to load quiz questions");
//             }
//         };
//         fetchQuestions();
//     }, []);

//     const handlePortfolioClick = (e) => {
//         navigateWithCheck("Portfolio", "/portfolio", {}, e);
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (!event.target.closest("#portfolio-dropdown")) setIsPortfolioOpen(false);
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     useEffect(() => {
//         const handleScroll = () => setSticky(window.scrollY > 0);
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     const fetchProfileImage = async () => {
//         try {
//             const url = await getProfilePicture();
//             setProfileImage(url ? `${url}?t=${Date.now()}` : profile);
//         } catch (error) {
//             console.error("Failed to fetch profile picture:", error);
//             setProfileImage(profile);
//             toast.error("Failed to load profile picture");
//         }
//     };

//     useEffect(() => {
//         const storedUserType = localStorage.getItem("userType") || "individual";
//         setUserType(storedUserType);

//         const token = localStorage.getItem("authToken");
//         const isCurrentlyLoggedIn = !!token && !JwtUtil.isTokenExpired(token);
//         setIsLoggedIn(isCurrentlyLoggedIn);

//         if (isCurrentlyLoggedIn) fetchProfileImage();
//         else setProfileImage(profile);
//     }, [isLoggedIn]);

//     const fetchName = async () => {
//         const token = localStorage.getItem('authToken');
//         if (!token) return;

//         const email = JwtUtil.extractEmail(token);
//         if (!email) return;

//         try {
//             const url = userType === 'corporate' ? `/corporate/${email}` : `/Userprofile/${email}`;
//             const response = await axios.get(`${API_BASE}${url}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             const name = userType === 'corporate' ? response.data.employeeName : response.data.fullname || response.data.fullName;
//             setFullName(name);
//         } catch (error) {
//             console.error('Failed to fetch user name:', error);
//         }
//     };

//     useEffect(() => {
//         fetchName();

//         const syncName = () => {
//             setUserType(localStorage.getItem('userType') || 'individual');
//             fetchName();
//         };

//         window.addEventListener('authChange', syncName);
//         window.addEventListener('storage', syncName);

//         return () => {
//             window.removeEventListener('authChange', syncName);
//             window.removeEventListener('storage', syncName);
//         };
//     }, []);

//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         const isCurrentlyLoggedIn = !!token && !JwtUtil.isTokenExpired(token);
//         setIsLoggedIn(isCurrentlyLoggedIn);

//         if (isCurrentlyLoggedIn && !localStorage.getItem("hasTakenQuiz")) {
//             const hasSeenQuizModal = localStorage.getItem("hasSeenQuizModal") === "true";
//             if (!hasShownQuizPopup && !hasSeenQuizModal) {
//                 const timer = setTimeout(() => {
//                     setShowQuizModal(true);
//                     setHasShownQuizPopup(true);
//                 }, 3000);
//                 return () => clearTimeout(timer);
//             }
//         }
//     }, [isLoggedIn, hasShownQuizPopup]);

//     const navigateWithCheck = async (label, path, state = {}, e = null) => {
//         if (e) e.preventDefault();
//         if (propNavClick) {
//             propNavClick(label, path, state);
//         } else {
//             await logActivity(`${label} tab clicked`);
//             navigate(path, { state });
//         }
//     };

//     const isActive = (path) => location.pathname === path;

//     const handleDashboardClick = (e) => {
//         e.preventDefault();
//         if (!isLoggedIn) {
//             toast.error("Please login to access the Research Panel");
//             return;
//         }
//         navigateWithCheck("Research Panel", "/researchpanel");
//     };

//     const getCachedData = (key) => {
//         const cached = localStorage.getItem(key);
//         if (!cached) return null;
//         try {
//             const { data, timestamp } = JSON.parse(cached);
//             if (Date.now() - timestamp > CACHE_TTL) {
//                 localStorage.removeItem(key);
//                 return null;
//             }
//             return data;
//         } catch (err) {
//             setError("Failed to parse cached data.");
//             console.error("Cache parse error:", err);
//             return null;
//         }
//     };

//     const setCachedData = (key, data) => {
//         try {
//             localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//         } catch (err) {
//             setError("Failed to cache data.");
//             console.error("Cache set error:", err);
//         }
//     };

//     const fetchData = async (value) => {
//         if (!value || value.length < 2) {
//             setResults([]);
//             setError(null);
//             return;
//         }

//         const cacheKey = `search_${value.toLowerCase()}`;
//         const cachedResults = getCachedData(cacheKey);
//         if (cachedResults) {
//             setResults(cachedResults);
//             return;
//         }

//         try {
//             const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//                 params: { prefix: value },
//             });
//             const filteredResults = response.data.filter((symbol) =>
//                 symbol?.symbol?.toLowerCase().includes(value.toLowerCase())
//             );
//             if (filteredResults.length === 0) {
//                 setError("No matching stocks found.");
//             } else {
//                 setResults(filteredResults);
//                 setCachedData(cacheKey, filteredResults);
//                 setError(null);
//             }
//         } catch (error) {
//             setError(error.response?.data?.error || error.message || "Failed to fetch search results.");
//             setResults([]);
//         }
//     };

//     const handleSearch = (e) => {
//         e.preventDefault();
//         if (searchQuery.trim()) {
//             navigate(`/equityinsights?query=${encodeURIComponent(searchQuery)}`);
//             setSearchQuery("");
//             setResults([]);
//             setError(null);
//             setIsMobileMenuOpen(false);
//         }
//     };

//     const handleSelectItem = (item) => {
//         if (item && item.symbol) {
//             setSearchQuery("");
//             setResults([]);
//             setError(null);
//             navigate(`/equityinsights?query=${encodeURIComponent(item.symbol)}`);
//             setIsMobileMenuOpen(false);
//         }
//     };

//     const handleClearSearch = () => {
//         setSearchQuery("");
//         setResults([]);
//         setError(null);
//     };

//     const handleLoginClick = (e) => {
//         e.preventDefault();
//         navigateWithCheck("Login", "/login", { from: location.pathname });
//         setIsMobileMenuOpen(false);
//     };

//     const handleLoginSuccess = () => {
//         login();
//         setIsLoggedIn(true);
//         localStorage.removeItem("hasSeenQuizModal");
//         localStorage.removeItem("hasTakenQuiz");
//         setHasShownQuizPopup(false);
//         fetchProfileImage();
//     };

//     const handleOpenQuiz = () => {
//         setShowQuizModal(true);
//         setIsMobileMenuOpen(false);
//     };

//     const handleDrawerToggle = (e) => {
//         const isChecked = e.target.checked;
//         setIsDrawerOpen(isChecked);
//         if (isChecked) {
//             if (profileCollapseRef.current) profileCollapseRef.current.checked = false;
//             if (settingsCollapseRef.current) settingsCollapseRef.current.checked = false;
//             if (quizCollapseRef.current) quizCollapseRef.current.checked = false;
//         }
//     };

//     const toggleMobileMenu = () => {
//         setIsMobileMenuOpen(!isMobileMenuOpen);
//     };

//     const navItems = (
//         <ul className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-6">
//             <li>
//                 <Link
//                     to="/"
//                     onClick={(e) => navigateWithCheck("Home", "/", {}, e)}
//                     className={`text-base font-medium transition-all duration-300 ease-in-out 
//             ${isActive("/") ? "text-sky-500 underline underline-offset-8 font-bold" : "text-gray-800 dark:text-white"} 
//             hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
//                 >
//                     Home
//                 </Link>
//             </li>

//             {/* Portfolio Dropdown with Financial Calculators */}
//             {/* <li
//                 id="portfolio-dropdown"
//                 className="relative"
//                 onMouseEnter={() => setIsPortfolioOpen(true)}
//                 onMouseLeave={() => {
//                     setIsPortfolioOpen(false);
//                     setIsFinancialCalculatorsOpen(false);
//                 }}
//             >
//                 <div className="flex items-center">
//                     <Link
//                         to="/portfolio"
//                         onClick={(e) => navigateWithCheck("Portfolio", "/portfolio", {}, e)}
//                         className={`text-base font-medium transition-all duration-300 ease-in-out cursor-pointer 
//               ${isActive("/portfolio") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
//               hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
//                     >
//                         Portfolio
//                     </Link>
//                     {/* Dropdown Icon *
//                     <button
//                         onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
//                         className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
//                         aria-label="Toggle portfolio menu"
//                     >
//                         <IoMdArrowDropdown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${isPortfolioOpen ? 'rotate-180' : ''}`} />
//                     </button>
//                 </div>

//                 {isPortfolioOpen && (
//                     <ul
//                         className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-10 lg:mt-0 border border-gray-200 dark:border-gray-700"
//                         onMouseEnter={() => setIsPortfolioOpen(true)}
//                         onMouseLeave={() => {
//                             setIsPortfolioOpen(false);
//                             setIsFinancialCalculatorsOpen(false);
//                         }}
//                     >
//                         <li>
//                             <Link
//                                 to="/portfolio"
//                                 onClick={(e) => {
//                                     setIsPortfolioOpen(false);
//                                     navigateWithCheck("Upload File", "/portfolio", {}, e);
//                                 }}
//                                 className="flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200"
//                             >
//                                 Upload File
//                             </Link>
//                         </li>
//                         <li>
//                             <Link
//                                 to="/portfolio/mysaved-portfolio"
//                                 onClick={(e) => {
//                                     setIsPortfolioOpen(false);
//                                     navigateWithCheck("Saved Portfolio", "/portfolio/mysaved-portfolio", {}, e);
//                                 }}
//                                 className="flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200"
//                             >
//                                 Saved Portfolio
//                             </Link>
//                         </li>
//                         <li>
//                             <Link
//                                 to="/portfolio/swap"
//                                 onClick={(e) => {
//                                     setIsPortfolioOpen(false);
//                                     navigateWithCheck("Recreate Portfolio", "/portfolio/swap", {}, e);
//                                 }}
//                                 className="flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200"
//                             >
//                                 Swap
//                             </Link>
//                         </li>
//                         <li>
//                             <Link
//                                 to="/portfolio/paper-trading"
//                                 onClick={(e) => {
//                                     setIsPortfolioOpen(false);
//                                     navigateWithCheck("Create own Portfolio", "/portfolio/paper-trading", {}, e);
//                                 }}
//                                 className="flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200"
//                             >
//                                 Paper Trading
//                             </Link>
//                         </li>

//                         {/* Financial Calculators Item with Dropdown Icon 
//                         {/* In your Navbar component - update the Financial Calculators section *
//                         <li
//                             className="relative border-t border-gray-200 dark:border-gray-700 mt-2 pt-2"
//                             onMouseEnter={() => setIsFinancialCalculatorsOpen(true)}
//                             onMouseLeave={(e) => {
//                                 // Add a small delay to prevent immediate closing when moving to the submenu
//                                 setTimeout(() => {
//                                     if (!e.currentTarget.querySelector(':hover')) {
//                                         setIsFinancialCalculatorsOpen(false);
//                                     }
//                                 }, 100);
//                             }}
//                         >
//                             <div
//                                 className="flex items-center justify-between px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200 cursor-pointer group"
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     e.stopPropagation();
//                                     setIsFinancialCalculatorsOpen(!isFinancialCalculatorsOpen);
//                                 }}
//                             >
//                                 <span>Financial Comparator</span>
//                                 <IoMdArrowDropdown className={`w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isFinancialCalculatorsOpen ? 'rotate-180' : ''}`} />
//                             </div>

//                             {/* Financial Calculators Dropdown *
//                             {isFinancialCalculatorsOpen && (
//                                 <div
//                                     className="absolute left-full top-0 ml-1"
//                                     onMouseEnter={() => setIsFinancialCalculatorsOpen(true)}
//                                     onMouseLeave={() => setIsFinancialCalculatorsOpen(false)}
//                                 >
//                                     <FinancialCalculatorsMenu
//                                         onItemClick={(calculatorName, e) => {
//                                             setIsPortfolioOpen(false);
//                                             setIsFinancialCalculatorsOpen(false);
//                                             const pathMap = {
//                                                 'Brokerage Calculator': '/calculators/brokerage-calculator',
//                                                 'EMI Calculator': '/calculators/emi-calculator',
//                                                 'Margin Calculator': '/calculators/margin-calculator'
//                                             };
//                                             navigateWithCheck(calculatorName, pathMap[calculatorName], {}, e);
//                                         }}
//                                     />
//                                 </div>
//                             )}
//                         </li>
//                     </ul>
//                 )}
//             </li> */}
//             <li>
//                 <Link
//                     to="/portfolio"
//                     onClick={(e) => navigateWithCheck("Portfolio", "/portfolio", {}, e)}
//                     className={`text-base font-medium transition-all duration-300 ease-in-out 
//             ${isActive("/portfolio") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
//             hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
//                 >
//                     Portfolio Analysis
//                 </Link>
//             </li>

//             <li>
//                 <Link
//                     to="/equityinsights"
//                     onClick={(e) => navigateWithCheck("Equity Insights", "/equityinsights", {}, e)}
//                     className={`text-base font-medium transition-all duration-300 ease-in-out 
//             ${isActive("/equityinsights") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
//             hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
//                 >
//                     Equity Insights
//                 </Link>
//             </li>
//             <li>
//                 <Link
//                     to="/researchpanel"
//                     onClick={handleDashboardClick}
//                     className={`text-base font-medium transition-all duration-300 ease-in-out 
//             ${isActive("/researchpanel") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
//             hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
//                 >
//                     Research Panel
//                 </Link>
//             </li>

//             <li>
//                 <Link
//                     to="/patterns"
//                     onClick={(e) => navigateWithCheck("Patterns", "/patterns", {}, e)}
//                     className={`text-base font-medium transition-all duration-300 ease-in-out 
//             ${isActive("/patterns") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
//             hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
//                 >
//                     Patterns
//                 </Link>
//             </li>
//             <li>
//                 <Link
//                     to="/education"
//                     onClick={(e) => navigateWithCheck("Education", "/education", {}, e)}
//                     className={`text-base font-medium transition-all duration-300 ease-in-out 
//             ${isActive("/education") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
//             hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
//                 >
//                     Education
//                 </Link>
//             </li>
//             <li>
//                 <Link
//                     to="/about"
//                     onClick={(e) => navigateWithCheck("About", "/about", {}, e)}
//                     className={`text-base font-medium transition-all duration-300 ease-in-out 
//             ${isActive("/about") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
//             hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
//                 >
//                     About
//                 </Link>
//             </li>
//             <li className={isDisabled ? "opacity-50 pointer-events-none" : ""}>
//                 <Link
//                     to="/plan"
//                     onClick={(e) => {
//                         if (isDisabled) {
//                             e.preventDefault();
//                             return;
//                         }
//                         navigateWithCheck("Subscription", "/plan", {}, e);
//                     }}
//                     className={`text-base font-medium transition-all duration-300 ease-in-out 
//             ${isActive('/plan') ? 'text-sky-500 underline underline-offset-8' : 'text-gray-800 dark:text-white'} 
//             hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
//                     data-tour="subscription-link"
//                 >
//                     Subscription
//                 </Link>
//             </li>
//         </ul>
//     );

//     return (
//         <>
//             <nav
//                 className={`fixed top-0 left-0 pr-10  right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-10 py-3 transition-all duration-300 ${sticky
//                     ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
//                     : "bg-transparent shadow-md"
//                     }`}
//             >
//                 <div className="max-w-screen-2xl mx-auto flex flex-wrap justify-between items-center gap-y-4">

//                     {/* Desktop Navigation */}
//                     <div className="hidden lg:flex lg:items-center">{navItems}</div>
//                     {/* Search Field */}
//                     {/* Clean Financial App Style Search (like Groww/Zerodha) */}
//                     <div ref={searchRef} className="relative flex-1 max-w-md">
//                         {/* The full NavbarSearchList handles input + dropdown */}
//                         <NavbarSearchList
//                             onSelect={(company) => {
//                                 navigate(`/equityinsights?query=${encodeURIComponent(company.symbol)}`);
//                                 setSearchQuery(""); // Clear any old state if needed
//                             }}
//                             showFilters={false}
//                         />
//                     </div>
//                     {/* Right Side Items */}
//                     <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

//                         {/* Theme Toggle */}
//                         <button
//                             onClick={toggleTheme}
//                             className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110 transition-all duration-200"
//                             aria-label="Toggle theme"
//                         >
//                             {theme === 'dark' ? <FaSun className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaMoon className="w-4 h-4 sm:w-5 sm:h-5" />}
//                         </button>



//                         {/* === AUTH BUTTONS: Login & Register === */}
//                         {/* {!isLoggedIn && (
//                             <div className="flex items-center gap-3">
//                                 {/* LOGIN BUTTON - Professional Blue Gradient *
//                                 <Link
//                                     to="/login"
//                                     onClick={handleLoginClick}
//                                     className="group relative flex items-center gap-1.5 px-3 py-1.5 xs:px-4 xs:py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full text-xs xs:text-sm sm:text-base font-semibold hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
//                                 >
//                                     {/* Shimmer effect *
//                                     <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

//                                     <span className="flex items-center gap-1">
//                                         <span className="hidden sm:inline">Free Login</span>
//                                         <span className="sm:hidden">Login</span>
//                                         <span className="animate-bounce inline-block">😊</span>
//                                     </span>

//                                     {/* Hover "Badge" for Free *
//                                     <span className="absolute -right-2 top-0 bg-emerald-500 text-[8px] font-bold px-1 rounded-full opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300">
//                                         FREE
//                                     </span>
//                                 </Link>


//                                 {/* REGISTER BUTTON - Sleek Professional Black *
//                                 <Link
//                                     to="/IndividualSignUp"
//                                     state={{ from: location.pathname }}
//                                     className="group relative flex items-center gap-1.5 px-3 py-1.5 xs:px-4 xs:py-2 bg-gray-900 text-white rounded-full text-xs xs:text-sm sm:text-base font-semibold hover:bg-black transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden border border-gray-700 hover:border-sky-500"
//                                 >
//                                     {/* Animated light line *
//                                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

//                                     <span className="flex items-center gap-1.5">
//                                         <span className="hidden sm:inline">Free Register</span>
//                                         <span className="sm:hidden">Register</span>
//                                         <span className="group-hover:scale-125 transition-transform duration-300">�</span>
//                                         <span className="hidden md:inline animate-pulse text-lg" style={{ animationDuration: '2s' }}>�</span>
//                                         <span className="hidden lg:inline group-hover:rotate-12 transition-transform">😃</span>
//                                     </span>
//                                 </Link>

//                                 {/* Desktop Benefit Helper */}
//                         {/* <div className="hidden xl:flex flex-col items-start leading-none ml-1">
//                                     <div className="flex items-center gap-1">
//                                         <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">100% Free</span>
//                                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
//                                     </div>
//                                     <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium">Join 50k+ Users</span>
//                                 </div> *
//                             </div>
//                         )} */}

//                         {/* {!isLoggedIn && (
//                             <div className="flex items-center gap-4 lg:gap-6">


//                                 <div className="flex items-center gap-3">
//                                     <Link
//                                         to="/login"
//                                         onClick={handleLoginClick}
//                                         className="group relative flex items-center gap-1.5 px-3 py-1.5 xs:px-4 xs:py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full text-xs xs:text-sm sm:text-base font-semibold hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
//                                     >
//                                         {/* Shimmer effect *
//                                         <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

//                                         <span className="flex items-center gap-1">
//                                             <span className="hidden sm:inline">Login</span>
//                                             <span className="sm:hidden">Login</span>
//                                             {/* <span className="animate-bounce inline-block">😊</span> *
//                                         </span>
//                                     </Link>
//                                     <Link
//                                         to="/IndividualSignUp"
//                                         className="group relative flex items-center gap-2 px-5 py-2 bg-neutral-900 text-white rounded-full text-sm sm:text-base font-semibold hover:scale-[1.03] hover:shadow-xl transition-all duration-300"
//                                     >
//                                         <span>Free Registeration !</span>
//                                     </Link>
//                                 </div>

//                             </div>
//                         )} */}

//                         {!isLoggedIn && (
//                             <div className="flex items-center gap-4 lg:gap-6 ml-auto lg:ml-0">
//                                 <div className="flex items-center gap-4">
//                                     <Link
//                                         to="/login"
//                                         onClick={handleLoginClick}
//                                         className="group relative flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full text-xs sm:text-sm font-bold hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
//                                     >
//                                         <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
//                                         <span className="flex items-center gap-1">
//                                             <span>Login</span>
//                                         </span>
//                                     </Link>

//                                     <Link
//                                         to="/IndividualSignUp"
//                                         className="group relative flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-neutral-300 text-black rounded-full text-xs sm:text-sm font-bold hover:scale-[1.05] hover:shadow-xl transition-all duration-300 border border-transparent hover:border-sky-500 shadow-md"
//                                     >
//                                         {/* FREE Badge */}
//                                         <span className="absolute -top-2 -right-2 bg-neutral-900 dark:bg-white dark:text-gray-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
//                                             FREE
//                                         </span>

//                                         <span className="hidden xs:inline">Free Registration!</span>
//                                         <span className="xs:hidden">Register </span>
//                                     </Link>

//                                 </div>
//                             </div>
//                         )}

//                         {/* Profile Avatar (Only when logged in) */}
//                         {isLoggedIn && (
//                             <div className="drawer drawer-end z-50" id="profile-section">
//                                 <input
//                                     id="my-drawer-4"
//                                     type="checkbox"
//                                     className="drawer-toggle"
//                                     ref={drawerCheckboxRef}
//                                     onChange={handleDrawerToggle}
//                                 />
//                                 <div className="drawer-content">
//                                     <label htmlFor="my-drawer-4" className="drawer-button cursor-pointer">
//                                         <div className="avatar">
//                                             <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-sky-500 ring-offset-2 overflow-hidden shadow-md hover:scale-110 transition-all duration-200">
//                                                 <img src={profileImage || profile} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.src = profile; }} />
//                                             </div>
//                                         </div>
//                                     </label>
//                                 </div>
//                                 <div className="drawer-side">
//                                     <label htmlFor="my-drawer-4" className="drawer-overlay bg-black/60 backdrop-blur-sm"></label>
//                                     <div className="menu w-80 min-h-full bg-white dark:bg-gray-800 p-6 shadow-2xl text-gray-800 dark:text-white rounded-l-xl">
//                                         <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 shadow-md mb-6">
//                                             <div className="avatar">
//                                                 <div className="w-12 h-12 rounded-full border-2 border-sky-400 overflow-hidden shadow-lg">
//                                                     <ProfilePicture src={profileImage || profile} />
//                                                 </div>
//                                             </div>
//                                             {userType && (
//                                                 <div>
//                                                     <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
//                                                     <Username userType={userType} setFullName={setFullName} />
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="space-y-4">
//                                             <div className="collapse bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
//                                                 <input type="checkbox" className="peer" ref={profileCollapseRef} />
//                                                 <div className="collapse-title flex gap-4 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-4 transition-colors duration-200">
//                                                     <AiFillProfile className="text-sky-500 mt-1" />
//                                                     View Profile
//                                                 </div>
//                                                 <div className="collapse-content px-4 pb-4 text-base bg-white/50 dark:bg-gray-800/50">
//                                                     <Profile />
//                                                 </div>
//                                             </div>
//                                             <div className="collapse bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
//                                                 <input type="checkbox" className="peer" ref={settingsCollapseRef} />
//                                                 <div className="collapse-title flex gap-4 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-4 transition-colors duration-200">
//                                                     <MdOutlineSettings className="text-sky-500 mt-1" />
//                                                     Settings
//                                                 </div>
//                                                 <div className="collapse-content px-4 pb-4 text-base bg-white/50 dark:bg-gray-800/50 space-y-2">
//                                                     {userType === "individual" ? (
//                                                         <div className="flex gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-3 cursor-pointer transition-colors duration-200">
//                                                             <CgProfile className="text-sky-500 mt-1" />
//                                                             <Link
//                                                                 to="/updateindividualprofile"
//                                                                 className="block hover:text-sky-500"
//                                                             >
//                                                                 Update Profile
//                                                             </Link>
//                                                         </div>
//                                                     ) : (
//                                                         <div className="flex gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-3 cursor-pointer transition-colors duration-200">
//                                                             <CgProfile className="text-sky-500 mt-1" />
//                                                             <Link
//                                                                 to="/updatecorporateprofile"
//                                                                 className="block hover:text-sky-500"
//                                                             >
//                                                                 Update Corporate Profile
//                                                             </Link>
//                                                         </div>
//                                                     )}
//                                                     <div className="flex gap-4 text-base font-medium 
//                                                     hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-3 
//                                                     cursor-pointer transition-colors duration-200"
//                                                         onClick={handleLogout}
//                                                     >
//                                                         <HiOutlineLogout className="text-sky-500 mt-1" />
//                                                         <span className="tracking-wide">Logout</span>
//                                                     </div>
//                                                     <div className="flex gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-3 cursor-pointer transition-colors duration-200" onClick={() => setShowDeleteModal(true)}>
//                                                         <MdDelete className="text-sky-500 mt-1" />
//                                                         <span className="tracking-wide">Delete Account</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
//                                                 <div
//                                                     className="flex gap-4 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-4 cursor-pointer transition-colors duration-200"
//                                                     onClick={handleOpenQuiz}
//                                                 >
//                                                     <BsQuestionCircle className="text-sky-500 mt-1" />
//                                                     <span className="tracking-wide">Take Quiz</span>
//                                                 </div>
//                                             </div>

//                                             <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
//                                                 <PointsDashboard />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Mobile Menu Button */}
//                         <div className="lg:hidden">
//                             <button
//                                 onClick={toggleMobileMenu}
//                                 className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
//                                 aria-label="Open menu"
//                             >
//                                 {isMobileMenuOpen ? (
//                                     <FaTimes className="w-5 h-5 xs:w-6 xs:h-6" />
//                                 ) : (
//                                     <IoMdMenu className="w-5 h-5 xs:w-6 xs:h-6" />
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Mobile Menu Content - IMPROVED RESPONSIVENESS */}
//                 <div
//                     ref={mobileMenuRef}
//                     className={`fixed inset-0 top-[60px] xs:top-[68px] z-40 bg-white dark:bg-gray-900 lg:hidden transform transition-transform duration-500 ease-in-out overflow-y-auto shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
//                         }`}
//                 >
//                     <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
//                         {isLoggedIn && (
//                             <div className="mb-4 sm:mb-6">
//                                 <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 shadow-md">
//                                     <div className="avatar">
//                                         <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-sky-400 overflow-hidden shadow-lg">
//                                             <ProfilePicture src={profileImage || profile} />
//                                         </div>
//                                     </div>
//                                     {userType && (
//                                         <div>
//                                             <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
//                                             <Username userType={userType} setFullName={setFullName} />
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
//                                     <div className="collapse bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
//                                         <input type="checkbox" className="peer" ref={profileCollapseRef} />
//                                         <div className="collapse-title flex gap-3 sm:gap-4 text-base sm:text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-3 sm:p-4 transition-colors duration-200">
//                                             <AiFillProfile className="text-sky-500 mt-0.5 sm:mt-1" /> View Profile
//                                         </div>
//                                         <div className="collapse-content px-3 sm:px-4 pb-3 sm:pb-4 text-sm sm:text-base bg-white/50 dark:bg-gray-800/50"><Profile /></div>
//                                     </div>
//                                     <div className="collapse bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
//                                         <input type="checkbox" className="peer" ref={settingsCollapseRef} />
//                                         <div className="collapse-title flex gap-3 sm:gap-4 text-base sm:text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-3 sm:p-4 transition-colors duration-200">
//                                             <MdOutlineSettings className="text-sky-500 mt-0.5 sm:mt-1" /> Settings
//                                         </div>
//                                         <div className="collapse-content px-3 sm:px-4 pb-3 sm:pb-4 text-sm sm:text-base bg-white/50 dark:bg-gray-800/50 space-y-2">
//                                             {userType === "individual" ? (
//                                                 <div className="flex gap-3 sm:gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-2 sm:p-3 cursor-pointer transition-colors duration-200">
//                                                     <CgProfile className="text-sky-500 mt-0.5 sm:mt-1" />
//                                                     <Link to="/updateindividualprofile" className="block hover:text-sky-500" onClick={() => setIsMobileMenuOpen(false)}>Update Profile</Link>
//                                                 </div>
//                                             ) : (
//                                                 <div className="flex gap-3 sm:gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-2 sm:p-3 cursor-pointer transition-colors duration-200">
//                                                     <CgProfile className="text-sky-500 mt-0.5 sm:mt-1" />
//                                                     <Link to="/updatecorporateprofile" className="block hover:text-sky-500" onClick={() => setIsMobileMenuOpen(false)}>Update Corporate Profile</Link>
//                                                 </div>
//                                             )}
//                                             <div className="flex gap-3 sm:gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-2 sm:p-3 cursor-pointer transition-colors duration-200" onClick={handleLogout}>
//                                                 <HiOutlineLogout className="text-sky-500 mt-0.5 sm:mt-1" /> <span>Logout</span>
//                                             </div>
//                                             <div className="flex gap-3 sm:gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-2 sm:p-3 cursor-pointer transition-colors duration-200" onClick={() => setShowDeleteModal(true)}>
//                                                 <MdDelete className="text-sky-500 mt-0.5 sm:mt-1" /> <span>Delete Account</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
//                                         <div className="flex gap-3 sm:gap-4 text-base sm:text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-3 sm:p-4 cursor-pointer transition-colors duration-200" onClick={handleOpenQuiz}>
//                                             <BsQuestionCircle className="text-sky-500 mt-0.5 sm:mt-1" /> <span>Take Quiz</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Improved Mobile Navigation with better spacing */}
//                         <ul className="space-y-3 sm:space-y-4">
//                             <li>
//                                 <Link to="/" onClick={(e) => { navigateWithCheck("Home", "/", {}, e); setIsMobileMenuOpen(false); }} className={`block py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-base sm:text-lg font-semibold ${isActive("/") ? "bg-sky-100 dark:bg-sky-900 text-sky-500" : "text-gray-800 dark:text-white"} hover:bg-sky-50 dark:hover:bg-sky-800 hover:text-sky-600 transition-all duration-200`}>
//                                     Home
//                                 </Link>
//                             </li>




//                             {/* Other Mobile Navigation Items */}
//                             {[
//                                 { path: "/portfolio", label: "Portfolio analysis" },
//                                 { path: "/equityinsights", label: "Equity Insights" },
//                                 { path: "/researchpanel", label: "Research Panel", onClick: handleDashboardClick },
//                                 { path: "/patterns", label: "Patterns" },
//                                 { path: "/education", label: "Education" },
//                                 { path: "/about", label: "About" },
//                                 { path: "/plan", label: "Subscription" }
//                             ].map((item) => (
//                                 <li key={item.path}>
//                                     <Link
//                                         to={item.path}
//                                         onClick={(e) => {
//                                             if (item.onClick) {
//                                                 item.onClick(e);
//                                             } else {
//                                                 navigateWithCheck(item.label, item.path, {}, e);
//                                             }
//                                             setIsMobileMenuOpen(false);
//                                         }}
//                                         className={`block py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-base sm:text-lg font-semibold ${isActive(item.path) ? "bg-sky-100 dark:bg-sky-900 text-sky-500" : "text-gray-800 dark:text-white"} hover:bg-sky-50 dark:hover:bg-sky-800 hover:text-sky-600 transition-all duration-200`}
//                                     >
//                                         {item.label}
//                                     </Link>
//                                 </li>
//                             ))}

//                             {/* Login button for mobile when not logged in */}
//                             {!isLoggedIn && (
//                                 <li className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
//                                     {/* <Link
//                                         to="/login"
//                                         onClick={handleLoginClick}
//                                         className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2.5 sm:py-3 rounded-full text-base font-medium hover:bg-sky-600 transition-all duration-200 shadow-md hover:shadow-lg block text-center"
//                                     >
//                                         Login
//                                     </Link> */}
//                                     <Link
//                                         to="/login"
//                                         onClick={handleLoginClick}
//                                         className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base 
//              bg-sky-600 text-white rounded-full font-medium
//              hover:bg-sky-700 transition-colors duration-200"
//                                     >
//                                         Login
//                                     </Link>

//                                 </li>
//                             )}
//                         </ul>
//                     </div>
//                 </div>
//             </nav>

//             {/* Quiz Modal */}
//             <QuizModal
//                 showModal={showQuizModal}
//                 setShowModal={setShowQuizModal}
//                 allQuestions={quizQuestions}
//                 userId={localStorage.getItem("userId") || null}
//                 onLoginClick={handleLoginClick}
//             />

//             {/* Delete Account Modal */}
//             {showDeleteModal && (
//                 <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
//                     <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
//                         <button
//                             onClick={() => setShowDeleteModal(false)}
//                             className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:scale-110 transition-all duration-200"
//                         >
//                             <svg
//                                 className="w-6 h-6"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                         <div className="text-center">
//                             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Confirm Account Deletion</h2>
//                             <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
//                                 Are you sure you want to delete your account? This action cannot be undone.
//                             </p>
//                             <div className="flex flex-col sm:flex-row justify-center gap-3">
//                                 <button
//                                     onClick={handleDeleteAccount}
//                                     className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
//                                 >
//                                     Delete
//                                 </button>
//                                 <button
//                                     onClick={() => setShowDeleteModal(false)}
//                                     className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-200 shadow-md"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default Navbar;


import React, { useEffect, useState, useRef } from "react";
import { logActivity, getProfilePicture } from "../services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaTimes } from "react-icons/fa";
import { MdDelete, MdOutlineSettings } from "react-icons/md";
import { AiFillProfile } from "react-icons/ai";
import { BsQuestionCircle } from "react-icons/bs";
import Profile from "./Profile";
import UpdateIndividualProfile from "./UpdateIndividualProfile";
import UpdateCorporateProfile from "./UpdateCorporateProfile";
import Username from "./Username";
import ProfilePicture from "./ProfilePicture";
import profile from "../../public/profile.png";
import { CgLogIn, CgProfile } from "react-icons/cg";
import { HiOutlineLogout } from "react-icons/hi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";
import { Search } from "lucide-react";
import SearchList from "./EquityHub/SearchList";
import axios from "axios";
import { IoMdArrowDropdown, IoMdMenu } from "react-icons/io";
import QuizModal from "./QuizModal";
import JwtUtil from "../services/JwtUtil";
import FinancialCalculatorsMenu from "./Finance/FinancialCalculatorsMenu";
// import { useState, useEffect, useRef } from "react";
import { FaCoins } from "react-icons/fa";
import PointsDashboard from "./EarnedPoints/PointsDashboard";
import NavbarSearchList from "./EquityHub/NavbarSearchList";
import Webinar from "../components/Webinar/Webinar";
import { trackSignup, trackLogin, trackAction } from "../utils/tracking";
import "react-toastify/dist/ReactToastify.css";


const Navbar = ({ handleNavClick: propNavClick, hasUnsavedChanges, setPendingNavigation, setShowUnsavedModal, onLoginClick, onSignupClick }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [sticky, setSticky] = useState(false);
    const [userType, setUserType] = useState(localStorage.getItem('userType') || 'individual');
    const [fullName, setFullName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [hasShownQuizPopup, setHasShownQuizPopup] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, logout } = useAuth();

    const profileCollapseRef = useRef(null);
    const settingsCollapseRef = useRef(null);
    const quizCollapseRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const searchRef = useRef(null);
    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
    const CACHE_TTL = 24 * 60 * 60 * 1000;
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const INACTIVITY_TIMEOUT = 2 * ONE_DAY;
    // const INACTIVITY_TIMEOUT = 12 * 60 * 60 * 1000;
    const TOKEN_CHECK_INTERVAL = 24 * 60 * 60 * 1000;
    const [isFinancialCalculatorsOpen, setIsFinancialCalculatorsOpen] = useState(false);
    const [pointsCount, setPointsCount] = useState(0);
    const drawerCheckboxRef = useRef(null); // Optional: better than document.getElementById

    useEffect(() => {
        const drawerCheckbox = drawerCheckboxRef.current || document.getElementById("my-drawer-4");

        const fetchPoints = async () => {
            try {
                const res = await fetch("/api/user/points", {

                });
                const data = await res.json();
                setPoints(data.points ?? 0);
            } catch (err) {
                console.error("Failed to load points", err);
                setPoints(0);
            }
        };

        // Fetch when drawer opens
        if (drawerCheckbox?.checked) {
            fetchPoints();
        }

        const handleDrawerChange = () => {
            if (drawerCheckbox?.checked) {
                fetchPoints();
            }
        };

        drawerCheckbox?.addEventListener("change", handleDrawerChange);

        return () => {
            drawerCheckbox?.removeEventListener("change", handleDrawerChange);
        };
    }, []);

    let inactivityTimer;


    // Listen for points updates (you can use a context or event system)
    useEffect(() => {
        const handlePointsUpdate = (event) => {
            setPointsCount(prev => prev + event.detail.points);
        };

        window.addEventListener('pointsAdded', handlePointsUpdate);
        return () => window.removeEventListener('pointsAdded', handlePointsUpdate);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setResults([]);
                setError(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Theme effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const resetInactivityTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        if (isLoggedIn) inactivityTimer = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
    };

    // Enhanced logout function with immediate state update
    const coreLogout = async () => {
        // Immediately update UI state before API call
        setIsLoggedIn(false);
        setProfileImage(profile);
        setFullName("");

        await logout();
        trackAction('nav_logout_click', 'Navigation');
        navigate('/');
        setIsMobileMenuOpen(false);
        setIsDrawerOpen(false);

        // Force close the drawer
        const drawerCheckbox = drawerCheckboxRef.current || document.getElementById("my-drawer-4");
        if (drawerCheckbox) {
            drawerCheckbox.checked = false;
        }
    };

    const handleLogout = () => {
        if (hasUnsavedChanges) {
            setPendingNavigation({ label: 'logout', path: '/' });
            setShowUnsavedModal(true);
            return;
        }
        coreLogout();
    };

    const handleDeleteAccount = async () => {
        if (hasUnsavedChanges) {
            setPendingNavigation({ label: 'deleteAccount', path: '/' });
            setShowUnsavedModal(true);
            return;
        }
        const apiUrl = userType === "corporate"
            ? `${API_BASE}/corporate/delete-account`
            : `${API_BASE}/Userprofile/delete-account`;

        try {
            await axios.delete(apiUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "application/json",
                },
            });
            toast.success("Account deleted successfully");
            localStorage.removeItem("authToken");
            localStorage.removeItem("userType");
            localStorage.removeItem("hasShownQuizPopup");

            // Use enhanced logout
            await coreLogout();
            setShowDeleteModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete account");
        }
    };

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('authToken');
            if (token && JwtUtil.isTokenExpired(token)) {
                toast.error("Session expired. Please log in again.");
                handleLogout();
            }
        };

        if (isLoggedIn) {
            checkTokenExpiration();
            const interval = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        const handleActivity = () => resetInactivityTimer();

        if (isLoggedIn) {
            resetInactivityTimer();
            events.forEach(event => window.addEventListener(event, handleActivity));
        }

        return () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [isLoggedIn]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`${API_BASE}/assessment/questions`);
                if (res.status === 200) setQuizQuestions(res.data);
            } catch (error) {
                console.error("Failed to fetch quiz questions", error);
                toast.error("Failed to load quiz questions");
            }
        };
        fetchQuestions();
    }, []);

    const handlePortfolioClick = (e) => {
        navigateWithCheck("Portfolio", "/portfolio", {}, e);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest("#portfolio-dropdown")) setIsPortfolioOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setSticky(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchProfileImage = async () => {
        try {
            const url = await getProfilePicture();
            setProfileImage(url ? `${url}?t=${Date.now()}` : profile);
        } catch (error) {
            console.error("Failed to fetch profile picture:", error);
            setProfileImage(profile);
            toast.error("Failed to load profile picture");
        }
    };

    useEffect(() => {
        const storedUserType = localStorage.getItem("userType") || "individual";
        setUserType(storedUserType);

        const token = localStorage.getItem("authToken");
        const isCurrentlyLoggedIn = !!token && !JwtUtil.isTokenExpired(token);
        setIsLoggedIn(isCurrentlyLoggedIn);

        if (isCurrentlyLoggedIn) fetchProfileImage();
        else setProfileImage(profile);
    }, [isLoggedIn]);

    const fetchName = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const email = JwtUtil.extractEmail(token);
        if (!email) return;

        try {
            const url = userType === 'corporate' ? `/corporate/${email}` : `/Userprofile/${email}`;
            const response = await axios.get(`${API_BASE}${url}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const name = userType === 'corporate' ? response.data.employeeName : response.data.fullname || response.data.fullName;
            setFullName(name);
        } catch (error) {
            console.error('Failed to fetch user name:', error);
        }
    };

    useEffect(() => {
        fetchName();

        const syncName = () => {
            setUserType(localStorage.getItem('userType') || 'individual');
            fetchName();
        };

        window.addEventListener('authChange', syncName);
        window.addEventListener('storage', syncName);

        return () => {
            window.removeEventListener('authChange', syncName);
            window.removeEventListener('storage', syncName);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const isCurrentlyLoggedIn = !!token && !JwtUtil.isTokenExpired(token);
        setIsLoggedIn(isCurrentlyLoggedIn);

        if (isCurrentlyLoggedIn && !localStorage.getItem("hasTakenQuiz")) {
            const hasSeenQuizModal = localStorage.getItem("hasSeenQuizModal") === "true";
            if (!hasShownQuizPopup && !hasSeenQuizModal) {
                const timer = setTimeout(() => {
                    setShowQuizModal(true);
                    setHasShownQuizPopup(true);
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [isLoggedIn, hasShownQuizPopup]);

    const navigateWithCheck = async (label, path, state = {}, e = null) => {
        if (e) e.preventDefault();
        if (propNavClick) {
            propNavClick(label, path, state);
        } else {
            trackAction('nav_click', 'Navigation', {
                route_label: label,
                route_path: path
            });
            await logActivity(`${label} tab clicked`);
            navigate(path, { state });
        }
    };

    const isActive = (path) => location.pathname === path;

    const handleDashboardClick = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error("Please login to access the Research Panel");
            return;
        }
        trackAction('nav_research_panel_click', 'Navigation');
        navigateWithCheck("Research Panel", "/researchpanel");
    };

    const getCachedData = (key) => {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > CACHE_TTL) {
                localStorage.removeItem(key);
                return null;
            }
            return data;
        } catch (err) {
            setError("Failed to parse cached data.");
            console.error("Cache parse error:", err);
            return null;
        }
    };

    const setCachedData = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
        } catch (err) {
            setError("Failed to cache data.");
            console.error("Cache set error:", err);
        }
    };

    const fetchData = async (value) => {
        if (!value || value.length < 2) {
            setResults([]);
            setError(null);
            return;
        }

        const cacheKey = `search_${value.toLowerCase()}`;
        const cachedResults = getCachedData(cacheKey);
        if (cachedResults) {
            setResults(cachedResults);
            return;
        }

        try {
            const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
                params: { prefix: value },
            });
            const filteredResults = response.data.filter((symbol) =>
                symbol?.symbol?.toLowerCase().includes(value.toLowerCase())
            );
            if (filteredResults.length === 0) {
                setError("No matching stocks found.");
            } else {
                setResults(filteredResults);
                setCachedData(cacheKey, filteredResults);
                setError(null);
            }
        } catch (error) {
            setError(error.response?.data?.error || error.message || "Failed to fetch search results.");
            setResults([]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/equityinsights?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
            setResults([]);
            setError(null);
            setIsMobileMenuOpen(false);
        }
    };

    const handleSelectItem = (item) => {
        if (item && item.symbol) {
            setSearchQuery("");
            setResults([]);
            setError(null);
            navigate(`/equityinsights?query=${encodeURIComponent(item.symbol)}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setResults([]);
        setError(null);
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        // ✅ Track login attempt
        trackAction('nav_login_click', 'Navigation');
        if (onLoginClick) {
            onLoginClick('navbar');
        } else {
            trackLogin('navbar');
        }
        navigateWithCheck("Login", "/login", { from: location.pathname });
        setIsMobileMenuOpen(false);
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        // ✅ Track signup attempt
        trackAction('nav_register_click', 'Navigation');
        if (onSignupClick) {
            onSignupClick('navbar');
        } else {
            trackSignup('navbar', 'individual');
        }
        navigateWithCheck("Register", "/IndividualSignUp", { from: location.pathname });
        setIsMobileMenuOpen(false);
    };

    const handleLoginSuccess = () => {
        login();
        setIsLoggedIn(true);
        localStorage.removeItem("hasSeenQuizModal");
        localStorage.removeItem("hasTakenQuiz");
        setHasShownQuizPopup(false);
        fetchProfileImage();
    };

    const handleOpenQuiz = () => {
        setShowQuizModal(true);
        setIsMobileMenuOpen(false);
    };

    const handleDrawerToggle = (e) => {
        const isChecked = e.target.checked;
        setIsDrawerOpen(isChecked);
        if (isChecked) {
            if (profileCollapseRef.current) profileCollapseRef.current.checked = false;
            if (settingsCollapseRef.current) settingsCollapseRef.current.checked = false;
            if (quizCollapseRef.current) quizCollapseRef.current.checked = false;
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navItems = (
        <ul className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-6">
            <li>
                <Link
                    to="/"
                    onClick={(e) => navigateWithCheck("Home", "/", {}, e)}
                    className={`text-base font-medium transition-all duration-300 ease-in-out 
            ${isActive("/") ? "text-sky-500 underline underline-offset-8 font-bold" : "text-gray-800 dark:text-white"} 
            hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
                    data-track="nav_home"
                >
                    Home
                </Link>
            </li>

            {/* Portfolio Dropdown with Financial Calculators */}
            {/* <li
                id="portfolio-dropdown"
                className="relative"
                onMouseEnter={() => setIsPortfolioOpen(true)}
                onMouseLeave={() => {
                    setIsPortfolioOpen(false);
                    setIsFinancialCalculatorsOpen(false);
                }}
            >
                <div className="flex items-center">
                    <Link
                        to="/portfolio"
                        onClick={(e) => navigateWithCheck("Portfolio", "/portfolio", {}, e)}
                        className={`text-base font-medium transition-all duration-300 ease-in-out cursor-pointer 
              ${isActive("/portfolio") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
              hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
                    >
                        Portfolio
                    </Link>
                    {/* Dropdown Icon *
                    <button
                        onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                        className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                        aria-label="Toggle portfolio menu"
                    >
                        <IoMdArrowDropdown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${isPortfolioOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {isPortfolioOpen && (
                    <ul
                        className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-10 lg:mt-0 border border-gray-200 dark:border-gray-700"
                        onMouseEnter={() => setIsPortfolioOpen(true)}
                        onMouseLeave={() => {
                            setIsPortfolioOpen(false);
                            setIsFinancialCalculatorsOpen(false);
                        }}
                    >
                        <li>
                            <Link
                                to="/portfolio"
                                onClick={(e) => {
                                    setIsPortfolioOpen(false);
                                    navigateWithCheck("Upload File", "/portfolio", {}, e);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200"
                            >
                                Upload File
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/portfolio/mysaved-portfolio"
                                onClick={(e) => {
                                    setIsPortfolioOpen(false);
                                    navigateWithCheck("Saved Portfolio", "/portfolio/mysaved-portfolio", {}, e);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200"
                            >
                                Saved Portfolio
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/portfolio/swap"
                                onClick={(e) => {
                                    setIsPortfolioOpen(false);
                                    navigateWithCheck("Recreate Portfolio", "/portfolio/swap", {}, e);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200"
                            >
                                Swap
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/portfolio/paper-trading"
                                onClick={(e) => {
                                    setIsPortfolioOpen(false);
                                    navigateWithCheck("Create own Portfolio", "/portfolio/paper-trading", {}, e);
                                }}
                                className="flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200"
                            >
                                Paper Trading
                            </Link>
                        </li>

                        {/* Financial Calculators Item with Dropdown Icon 
                        {/* In your Navbar component - update the Financial Calculators section *
                        <li
                            className="relative border-t border-gray-200 dark:border-gray-700 mt-2 pt-2"
                            onMouseEnter={() => setIsFinancialCalculatorsOpen(true)}
                            onMouseLeave={(e) => {
                                // Add a small delay to prevent immediate closing when moving to the submenu
                                setTimeout(() => {
                                    if (!e.currentTarget.querySelector(':hover')) {
                                        setIsFinancialCalculatorsOpen(false);
                                    }
                                }, 100);
                            }}
                        >
                            <div
                                className="flex items-center justify-between px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-sky-500 transition-colors duration-200 cursor-pointer group"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsFinancialCalculatorsOpen(!isFinancialCalculatorsOpen);
                                }}
                            >
                                <span>Financial Comparator</span>
                                <IoMdArrowDropdown className={`w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isFinancialCalculatorsOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Financial Calculators Dropdown *
                            {isFinancialCalculatorsOpen && (
                                <div
                                    className="absolute left-full top-0 ml-1"
                                    onMouseEnter={() => setIsFinancialCalculatorsOpen(true)}
                                    onMouseLeave={() => setIsFinancialCalculatorsOpen(false)}
                                >
                                    <FinancialCalculatorsMenu
                                        onItemClick={(calculatorName, e) => {
                                            setIsPortfolioOpen(false);
                                            setIsFinancialCalculatorsOpen(false);
                                            const pathMap = {
                                                'Brokerage Calculator': '/calculators/brokerage-calculator',
                                                'EMI Calculator': '/calculators/emi-calculator',
                                                'Margin Calculator': '/calculators/margin-calculator'
                                            };
                                            navigateWithCheck(calculatorName, pathMap[calculatorName], {}, e);
                                        }}
                                    />
                                </div>
                            )}
                        </li>
                    </ul>
                )}
            </li> */}
            <li>
                <Link
                    to="/portfolio"
                    onClick={(e) => navigateWithCheck("Portfolio", "/portfolio", {}, e)}
                    className={`text-base font-medium transition-all duration-300 ease-in-out 
            ${isActive("/portfolio") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
            hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
                >
                    Portfolio Analysis
                </Link>
            </li>

            <li>
                <Link
                    to="/equityinsights"
                    onClick={(e) => navigateWithCheck("Equity Insights", "/equityinsights", {}, e)}
                    className={`text-base font-medium transition-all duration-300 ease-in-out 
            ${isActive("/equityinsights") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
            hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
                    data-track="nav_equity_insights"
                >
                    Equity Insights
                </Link>
            </li>
            <li>
                <Link
                    to="/researchpanel"
                    onClick={handleDashboardClick}
                    className={`text-base font-medium transition-all duration-300 ease-in-out 
            ${isActive("/researchpanel") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
            hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
                    data-track="nav_research_panel"
                >
                    Research Panel
                </Link>
            </li>

            <li>
                <Link
                    to="/patterns"
                    onClick={(e) => navigateWithCheck("Patterns", "/patterns", {}, e)}
                    className={`text-base font-medium transition-all duration-300 ease-in-out 
            ${isActive("/patterns") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
            hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
                    data-track="nav_patterns"
                >
                    Patterns
                </Link>
            </li>
            <li>
                <Link
                    to="/education"
                    onClick={(e) => navigateWithCheck("Education", "/education", {}, e)}
                    className={`text-base font-medium transition-all duration-300 ease-in-out 
            ${isActive("/education") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
            hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
                    data-track="nav_trade_tech"
                >
                    Education
                </Link>
            </li>
            <li>
                <Link
                    to="/about"
                    onClick={(e) => navigateWithCheck("About", "/about", {}, e)}
                    className={`text-base font-medium transition-all duration-300 ease-in-out 
            ${isActive("/about") ? "text-sky-500 underline underline-offset-8" : "text-gray-800 dark:text-white"} 
            hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
                    data-track="nav_about"
                >
                    About
                </Link>
            </li>
            <li className={isDisabled ? "opacity-50 pointer-events-none" : ""}>
                <Link
                    to="/plan"
                    onClick={(e) => {
                        if (isDisabled) {
                            e.preventDefault();
                            return;
                        }
                        navigateWithCheck("Subscription", "/plan", {}, e);
                    }}
                    className={`text-base font-medium transition-all duration-300 ease-in-out 
            ${isActive('/plan') ? 'text-sky-500 underline underline-offset-8' : 'text-gray-800 dark:text-white'} 
            hover:text-sky-600 hover:underline hover:underline-offset-8 lg:text-lg`}
                    data-tour="subscription-link"
                    data-track="nav_subscription"
                >
                    Subscription
                </Link>
            </li>
        </ul>
    );

    return (
        <>
            <nav
                className={`fixed top-0 left-0 pr-10  right-0 z-50 px-4 sm:px-6 md:px-8 lg:px-10 py-3 transition-all duration-300 ${sticky
                    ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
                    : "bg-transparent shadow-md"
                    }`}
            >
                <div className="max-w-screen-2xl mx-auto flex flex-wrap justify-between items-center gap-y-4">

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:items-center">{navItems}</div>
                    {/* Search Field */}
                    {/* Clean Financial App Style Search (like Groww/Zerodha) */}
                    <div ref={searchRef} className="relative flex-1 max-w-md">
                        {/* The full NavbarSearchList handles input + dropdown */}
                        <NavbarSearchList
                            onSelect={(company) => {
                                trackAction('nav_search_select', 'Navigation', { symbol: company.symbol });
                                navigate(`/equityinsights?query=${encodeURIComponent(company.symbol)}`);
                                setSearchQuery(""); // Clear any old state if needed
                            }}
                            showFilters={false}
                            data-track="nav_search_interaction"
                        />
                    </div>
                    {/* Right Side Items */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110 transition-all duration-200"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <FaSun className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaMoon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>



                        {/* === AUTH BUTTONS: Login & Register === */}
                        {/* {!isLoggedIn && (
                            <div className="flex items-center gap-3">
                                {/* LOGIN BUTTON - Professional Blue Gradient *
                                <Link
                                    to="/login"
                                    onClick={handleLoginClick}
                                    className="group relative flex items-center gap-1.5 px-3 py-1.5 xs:px-4 xs:py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full text-xs xs:text-sm sm:text-base font-semibold hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
                                >
                                    {/* Shimmer effect *
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                                    <span className="flex items-center gap-1">
                                        <span className="hidden sm:inline">Free Login</span>
                                        <span className="sm:hidden">Login</span>
                                        <span className="animate-bounce inline-block">😊</span>
                                    </span>

                                    {/* Hover "Badge" for Free *
                                    <span className="absolute -right-2 top-0 bg-emerald-500 text-[8px] font-bold px-1 rounded-full opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300">
                                        FREE
                                    </span>
                                </Link>
                                

                                {/* REGISTER BUTTON - Sleek Professional Black *
                                <Link
                                    to="/IndividualSignUp"
                                    state={{ from: location.pathname }}
                                    className="group relative flex items-center gap-1.5 px-3 py-1.5 xs:px-4 xs:py-2 bg-gray-900 text-white rounded-full text-xs xs:text-sm sm:text-base font-semibold hover:bg-black transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden border border-gray-700 hover:border-sky-500"
                                >
                                    {/* Animated light line *
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                    <span className="flex items-center gap-1.5">
                                        <span className="hidden sm:inline">Free Register</span>
                                        <span className="sm:hidden">Register</span>
                                        <span className="group-hover:scale-125 transition-transform duration-300">�</span>
                                        <span className="hidden md:inline animate-pulse text-lg" style={{ animationDuration: '2s' }}>�</span>
                                        <span className="hidden lg:inline group-hover:rotate-12 transition-transform">😃</span>
                                    </span>
                                </Link>

                                {/* Desktop Benefit Helper */}
                        {/* <div className="hidden xl:flex flex-col items-start leading-none ml-1">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">100% Free</span>
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                    </div>
                                    <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium">Join 50k+ Users</span>
                                </div> *
                            </div>
                        )} */}

                        {/* {!isLoggedIn && (
                            <div className="flex items-center gap-4 lg:gap-6">


                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        onClick={handleLoginClick}
                                        className="group relative flex items-center gap-1.5 px-3 py-1.5 xs:px-4 xs:py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full text-xs xs:text-sm sm:text-base font-semibold hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
                                    >
                                        {/* Shimmer effect *
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                                        <span className="flex items-center gap-1">
                                            <span className="hidden sm:inline">Login</span>
                                            <span className="sm:hidden">Login</span>
                                            {/* <span className="animate-bounce inline-block">😊</span> *
                                        </span>
                                    </Link>
                                    <Link
                                        to="/IndividualSignUp"
                                        className="group relative flex items-center gap-2 px-5 py-2 bg-neutral-900 text-white rounded-full text-sm sm:text-base font-semibold hover:scale-[1.03] hover:shadow-xl transition-all duration-300"
                                    >
                                        <span>Free Registeration !</span>
                                    </Link>
                                </div>

                            </div>
                        )} */}

                        {!isLoggedIn && (
                            <div className="flex items-center gap-4 lg:gap-6 ml-auto lg:ml-0">
                                <div className="flex items-center gap-4">
                                    <Link
                                        to="/login"
                                        onClick={handleLoginClick}
                                        className="group relative flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full text-xs sm:text-sm font-bold hover:from-sky-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                                        <span className="flex items-center gap-1">
                                            <span>Login</span>
                                        </span>
                                    </Link>

                                    <Link
                                        to="/IndividualSignUp"
                                        className="group relative flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-neutral-300 text-black rounded-full text-xs sm:text-sm font-bold hover:scale-[1.05] hover:shadow-xl transition-all duration-300 border border-transparent hover:border-sky-500 shadow-md"
                                    >
                                        {/* FREE Badge */}
                                        <span className="absolute -top-2 -right-2 bg-neutral-900 dark:bg-white dark:text-gray-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                                            FREE
                                        </span>

                                        <span className="hidden xs:inline">Free Registration!</span>
                                        <span className="xs:hidden">Register </span>
                                    </Link>

                                </div>
                            </div>
                        )}

                        {/* Profile Avatar (Only when logged in) */}
                        {isLoggedIn && (
                            <div className="drawer drawer-end z-50" id="profile-section">
                                <input
                                    id="my-drawer-4"
                                    type="checkbox"
                                    className="drawer-toggle"
                                    ref={drawerCheckboxRef}
                                    onChange={handleDrawerToggle}
                                />
                                <div className="drawer-content">
                                    <label htmlFor="my-drawer-4" className="drawer-button cursor-pointer" data-track="nav_profile_drawer_open">
                                        <div className="avatar">
                                            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-sky-500 ring-offset-2 overflow-hidden shadow-md hover:scale-110 transition-all duration-200">
                                                <img src={profileImage || profile} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.src = profile; }} />
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div className="drawer-side">
                                    <label htmlFor="my-drawer-4" className="drawer-overlay bg-black/60 backdrop-blur-sm"></label>
                                    <div className="menu w-80 min-h-full bg-white dark:bg-gray-800 p-6 shadow-2xl text-gray-800 dark:text-white rounded-l-xl">
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 shadow-md mb-6">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-full border-2 border-sky-400 overflow-hidden shadow-lg">
                                                    <ProfilePicture src={profileImage || profile} />
                                                </div>
                                            </div>
                                            {userType && (
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
                                                    <Username userType={userType} setFullName={setFullName} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="collapse bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
                                                <input type="checkbox" className="peer" ref={profileCollapseRef} />
                                                <div className="collapse-title flex gap-4 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-4 transition-colors duration-200" data-track="nav_profile_view_profile_toggle">
                                                    <AiFillProfile className="text-sky-500 mt-1" />
                                                    View Profile
                                                </div>
                                                <div className="collapse-content px-4 pb-4 text-base bg-white/50 dark:bg-gray-800/50">
                                                    <Profile />
                                                </div>
                                            </div>
                                            <div className="collapse bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
                                                <input type="checkbox" className="peer" ref={settingsCollapseRef} />
                                                <div className="collapse-title flex gap-4 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-4 transition-colors duration-200" data-track="nav_profile_settings_toggle">
                                                    <MdOutlineSettings className="text-sky-500 mt-1" />
                                                    Settings
                                                </div>
                                                <div className="collapse-content px-4 pb-4 text-base bg-white/50 dark:bg-gray-800/50 space-y-2">
                                                    {userType === "individual" ? (
                                                        <div className="flex gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-3 cursor-pointer transition-colors duration-200" data-track="nav_profile_update_individual_profile">
                                                            <CgProfile className="text-sky-500 mt-1" />
                                                            <Link
                                                                to="/updateindividualprofile"
                                                                className="block hover:text-sky-500"
                                                            >
                                                                Update Profile
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-3 cursor-pointer transition-colors duration-200" data-track="nav_profile_update_corporate_profile">
                                                            <CgProfile className="text-sky-500 mt-1" />
                                                            <Link
                                                                to="/updatecorporateprofile"
                                                                className="block hover:text-sky-500"
                                                            >
                                                                Update Corporate Profile
                                                            </Link>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-4 text-base font-medium 
                                                    hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-3 
                                                    cursor-pointer transition-colors duration-200"
                                                        onClick={handleLogout}
                                                        data-track="nav_logout"
                                                    >
                                                        <HiOutlineLogout className="text-sky-500 mt-1" />
                                                        <span className="tracking-wide">Logout</span>
                                                    </div>
                                                    <div className="flex gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-3 cursor-pointer transition-colors duration-200" onClick={() => setShowDeleteModal(true)} data-track="nav_delete_account_open">
                                                        <MdDelete className="text-sky-500 mt-1" />
                                                        <span className="tracking-wide">Delete Account</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
                                                <div
                                                    className="flex gap-4 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-4 cursor-pointer transition-colors duration-200"
                                                    onClick={handleOpenQuiz}
                                                    data-track="nav_take_quiz_open"
                                                >
                                                    <BsQuestionCircle className="text-sky-500 mt-1" />
                                                    <span className="tracking-wide">Take Quiz</span>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
                                                <PointsDashboard />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
                                aria-label="Open menu"
                                data-track="nav_mobile_menu_toggle"
                            >
                                {isMobileMenuOpen ? (
                                    <FaTimes className="w-5 h-5 xs:w-6 xs:h-6" />
                                ) : (
                                    <IoMdMenu className="w-5 h-5 xs:w-6 xs:h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Content - IMPROVED RESPONSIVENESS */}
                <div
                    ref={mobileMenuRef}
                    className={`fixed inset-0 top-[60px] xs:top-[68px] z-40 bg-white dark:bg-gray-900 lg:hidden transform transition-transform duration-500 ease-in-out overflow-y-auto shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        {isLoggedIn && (
                            <div className="mb-4 sm:mb-6">
                                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 shadow-md">
                                    <div className="avatar">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-sky-400 overflow-hidden shadow-lg">
                                            <ProfilePicture src={profileImage || profile} />
                                        </div>
                                    </div>
                                    {userType && (
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
                                            <Username userType={userType} setFullName={setFullName} />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                                    <div className="collapse bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
                                        <input type="checkbox" className="peer" ref={profileCollapseRef} />
                                        <div className="collapse-title flex gap-3 sm:gap-4 text-base sm:text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-3 sm:p-4 transition-colors duration-200" data-track="nav_mobile_profile_view_profile_toggle">
                                            <AiFillProfile className="text-sky-500 mt-0.5 sm:mt-1" /> View Profile
                                        </div>
                                        <div className="collapse-content px-3 sm:px-4 pb-3 sm:pb-4 text-sm sm:text-base bg-white/50 dark:bg-gray-800/50"><Profile /></div>
                                    </div>
                                    <div className="collapse bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
                                        <input type="checkbox" className="peer" ref={settingsCollapseRef} />
                                        <div className="collapse-title flex gap-3 sm:gap-4 text-base sm:text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-3 sm:p-4 transition-colors duration-200" data-track="nav_mobile_profile_settings_toggle">
                                            <MdOutlineSettings className="text-sky-500 mt-0.5 sm:mt-1" /> Settings
                                        </div>
                                        <div className="collapse-content px-3 sm:px-4 pb-3 sm:pb-4 text-sm sm:text-base bg-white/50 dark:bg-gray-800/50 space-y-2">
                                            {userType === "individual" ? (
                                                <div className="flex gap-3 sm:gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-2 sm:p-3 cursor-pointer transition-colors duration-200" data-track="nav_mobile_profile_update_individual_profile">
                                                    <CgProfile className="text-sky-500 mt-0.5 sm:mt-1" />
                                                    <Link to="/updateindividualprofile" className="block hover:text-sky-500" onClick={() => setIsMobileMenuOpen(false)}>Update Profile</Link>
                                                </div>
                                            ) : (
                                                <div className="flex gap-3 sm:gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-2 sm:p-3 cursor-pointer transition-colors duration-200" data-track="nav_mobile_profile_update_corporate_profile">
                                                    <CgProfile className="text-sky-500 mt-0.5 sm:mt-1" />
                                                    <Link to="/updatecorporateprofile" className="block hover:text-sky-500" onClick={() => setIsMobileMenuOpen(false)}>Update Corporate Profile</Link>
                                                </div>
                                            )}
                                            <div className="flex gap-3 sm:gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-2 sm:p-3 cursor-pointer transition-colors duration-200" onClick={handleLogout} data-track="nav_mobile_logout">
                                                <HiOutlineLogout className="text-sky-500 mt-0.5 sm:mt-1" /> <span>Logout</span>
                                            </div>
                                            <div className="flex gap-3 sm:gap-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-2 sm:p-3 cursor-pointer transition-colors duration-200" onClick={() => setShowDeleteModal(true)} data-track="nav_mobile_delete_account_open">
                                                <MdDelete className="text-sky-500 mt-0.5 sm:mt-1" /> <span>Delete Account</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
                                        <div className="flex gap-3 sm:gap-4 text-base sm:text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 p-3 sm:p-4 cursor-pointer transition-colors duration-200" onClick={handleOpenQuiz} data-track="nav_mobile_take_quiz_open">
                                            <BsQuestionCircle className="text-sky-500 mt-0.5 sm:mt-1" /> <span>Take Quiz</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Improved Mobile Navigation with better spacing */}
                        <ul className="space-y-3 sm:space-y-4">
                            <li>
                                <Link to="/" onClick={(e) => { navigateWithCheck("Home", "/", {}, e); setIsMobileMenuOpen(false); }} className={`block py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-base sm:text-lg font-semibold ${isActive("/") ? "bg-sky-100 dark:bg-sky-900 text-sky-500" : "text-gray-800 dark:text-white"} hover:bg-sky-50 dark:hover:bg-sky-800 hover:text-sky-600 transition-all duration-200`} data-track="nav_mobile_home">
                                    Home
                                </Link>
                            </li>




                            {/* Other Mobile Navigation Items */}
                            {[
                                { path: "/portfolio", label: "Portfolio analysis" },
                                { path: "/equityinsights", label: "Equity Insights" },
                                { path: "/researchpanel", label: "Research Panel", onClick: handleDashboardClick },
                                { path: "/patterns", label: "Patterns" },
                                { path: "/education", label: "Education" },
                                { path: "/about", label: "About" },
                                { path: "/plan", label: "Subscription" }
                            ].map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={(e) => {
                                            if (item.onClick) {
                                                item.onClick(e);
                                            } else {
                                                navigateWithCheck(item.label, item.path, {}, e);
                                            }
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`block py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-base sm:text-lg font-semibold ${isActive(item.path) ? "bg-sky-100 dark:bg-sky-900 text-sky-500" : "text-gray-800 dark:text-white"} hover:bg-sky-50 dark:hover:bg-sky-800 hover:text-sky-600 transition-all duration-200`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}

                            {/* Login button for mobile when not logged in */}
                            {!isLoggedIn && (
                                <li className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                                    {/* <Link
                                        to="/login"
                                        onClick={handleLoginClick}
                                        className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2.5 sm:py-3 rounded-full text-base font-medium hover:bg-sky-600 transition-all duration-200 shadow-md hover:shadow-lg block text-center"
                                    >
                                        Login
                                    </Link> */}
                                    <Link
                                        to="/login"
                                        onClick={handleLoginClick}
                                        className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base 
             bg-sky-600 text-white rounded-full font-medium
             hover:bg-sky-700 transition-colors duration-200"
                                    >
                                        Login
                                    </Link>

                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Quiz Modal */}
            <QuizModal
                showModal={showQuizModal}
                setShowModal={setShowQuizModal}
                allQuestions={quizQuestions}
                userId={localStorage.getItem("userId") || null}
                onLoginClick={handleLoginClick}
            />

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:scale-110 transition-all duration-200"
                            data-track="delete_account_modal_close"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Confirm Account Deletion</h2>
                            <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
                                Are you sure you want to delete your account? This action cannot be undone.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                    data-track="delete_account_confirm"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-200 shadow-md"
                                    data-track="delete_account_cancel"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
