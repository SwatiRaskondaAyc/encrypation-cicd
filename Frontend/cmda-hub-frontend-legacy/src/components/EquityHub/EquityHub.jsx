// import React, { useEffect, useState, useRef } from 'react';
// import Navbar from "../Navbar";
// // import Footer from "../Footer";
// import SearchList from "./SearchList";
// import GraphSlider from "./GraphSlider";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { BsQuote } from "react-icons/bs";
// import { FaChartLine, FaEye, FaVideo, FaSearch, FaTimes, FaSave } from "react-icons/fa";
// import { FiMenu, FiX, FiChevronLeft, FiChevronRight, FiBarChart2 } from "react-icons/fi";
// import SearchTutorial from './SearchTutorial';
// import Mysearch from './Mysearch';
// import OpenCloseCards from './OpenCloseCards';
// import { useAuth } from '../AuthContext';
// import toast from 'react-hot-toast';
// import { FaCodeCompare } from 'react-icons/fa6';
// import { Helmet } from 'react-helmet-async';



// const EquityHub = () => {


//   const { getAuthToken, isLoggedIn } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("symbol") || queryParams.get("query") || "";

//   // State management
//   const [input, setInput] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedStocks, setSelectedStocks] = useState([]);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("hub");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [compareMode, setCompareMode] = useState(false);
//   const [graphMode, setGraphMode] = useState("side-by-side");
//   const [timeRange, setTimeRange] = useState("1Y");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const stockRefs = useRef({});
//   const inactivityTimer = useRef(null); // Ref to track inactivity timer
//   const API_BASE = import.meta.env.VITE_URL || "http://168.231.121.219:8080";
//   const CACHE_TTL = 60 * 60 * 1000;

//   // Navigation tabs configuration
//   const navigationTabs = [
//     {
//       key: 'hub',
//       label: 'Equity Insights',
//       icon: <FiBarChart2 size={20} />,
//       description: 'Search and analyze stocks'
//     },
//     {
//       key: 'search',
//       label: 'Watchlist',
//       icon: <FaEye size={18} />,
//       description: 'Manage your saved stocks'
//     },
//     {
//       key: 'videos',
//       label: 'Tutorials',
//       icon: <FaVideo size={18} />,
//       description: 'Learn how to use the platform'
//     },
//   ];

//   useEffect(() => {
//     if (initialQuery) {
//       setInput(initialQuery);
//       fetchData(initialQuery);
//     }
//   }, [initialQuery]);

//   // Auto-collapse sidebar after 20 seconds of inactivity
//   useEffect(() => {
//     const resetTimer = () => {
//       // Clear existing timer
//       if (inactivityTimer.current) {
//         clearTimeout(inactivityTimer.current);
//       }
//       // Only set timer if sidebar is open (mobile) or not collapsed (desktop)
//       if ((window.innerWidth < 1024 && isSidebarOpen) || (window.innerWidth >= 1024 && !isSidebarCollapsed)) {
//         inactivityTimer.current = setTimeout(() => {
//           if (window.innerWidth < 1024) {
//             setIsSidebarOpen(false); // Close sidebar on mobile
//           } else {
//             setIsSidebarCollapsed(true); // Collapse sidebar on desktop
//           }
//         }, 10000); // 20 seconds
//       }
//     };

//     // Handle user interactions
//     const handleInteraction = () => {
//       resetTimer();
//     };

//     // Set up event listeners for sidebar interactions
//     const sidebarElement = document.querySelector('[aria-label="Sidebar Navigation"]');
//     if (sidebarElement) {
//       sidebarElement.addEventListener('mousemove', handleInteraction);
//       sidebarElement.addEventListener('click', handleInteraction);
//       sidebarElement.addEventListener('touchstart', handleInteraction); // Add touch support for mobile
//     }

//     // Start timer based on initial conditions
//     resetTimer();

//     // Cleanup: Clear timer and remove event listeners
//     return () => {
//       if (inactivityTimer.current) {
//         clearTimeout(inactivityTimer.current);
//       }
//       if (sidebarElement) {
//         sidebarElement.removeEventListener('mousemove', handleInteraction);
//         sidebarElement.removeEventListener('click', handleInteraction);
//         sidebarElement.removeEventListener('touchstart', handleInteraction);
//       }
//     };
//   }, [isSidebarOpen, isSidebarCollapsed]);

//   // Cache utilities
//   const getCachedData = (key) => {
//     try {
//       const cached = localStorage.getItem(key);
//       if (!cached) return null;

//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > CACHE_TTL) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({
//         data,
//         timestamp: Date.now()
//       }));
//     } catch (err) {
//       console.error("Cache storage failed:", err);
//     }
//   };

//   // API calls
//   const fetchData = async (value) => {
//     if (!value.trim()) {
//       setResults([]);
//       setError(null);
//       setHasSearched(false);
//       return;
//     }

//     setHasSearched(true);
//     setIsLoading(true);

//     const cacheKey = `search_${value.toLowerCase()}`;
//     const cachedResults = getCachedData(cacheKey);

//     if (cachedResults) {
//       setResults(cachedResults);
//       setError(null);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//         params: { prefix: value },
//         timeout: 10000,
//       });

//       const filteredResults = response.data;
//       if (filteredResults.length === 0) {
//         setError("No companies found matching your search. Please try a different term.");
//       } else {
//         setResults(filteredResults);
//         setCachedData(cacheKey, filteredResults);
//         setError(null);
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//       setError(
//         error.response?.status === 404
//           ? "Service temporarily unavailable. Please try again later."
//           : "Unable to fetch search results. Check your connection and try again."
//       );
//       setResults([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSelectItem = async (item) => {
//     setInput("");
//     setResults([]);

//     if (selectedStocks.some(stock => stock.symbol === item.symbol)) {
//       scrollToStock(item.symbol);
//       return;
//     }

//     if (selectedStocks.length >= 2) {
//       setError("Maximum 2 stocks can be selected for comparison. Remove one to add another.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const cacheKey = `stock_${item.symbol}`;
//       const cachedStock = getCachedData(cacheKey);

//       if (cachedStock) {
//         addStockToSelection(cachedStock);
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//         params: { prefix: item.companyName },
//         timeout: 10000,
//       });

//       if (response.data.length > 0) {
//         const matchedStock = response.data.find(
//           s => s.symbol === item.symbol && s.companyName === item.companyName
//         ) || response.data[0];

//         setCachedData(cacheKey, matchedStock);
//         addStockToSelection(matchedStock);
//       } else {
//         setError("Detailed information not available for this stock.");
//       }
//     } catch (error) {
//       console.error("Stock details error:", error);
//       setError("Failed to load stock details. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addStockToSelection = (stock) => {
//     setSelectedStocks(prev => {
//       const updated = [...prev, stock];
//       setTimeout(() => scrollToStock(stock.symbol), 100);
//       return updated;
//     });
//     setError(null);
//   };

//   const scrollToStock = (symbol) => {
//     const stockDiv = stockRefs.current[symbol];
//     if (stockDiv) {
//       stockDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   const removeStock = (symbol) => {
//     setSelectedStocks(prev => prev.filter(stock => stock.symbol !== symbol));
//     setCompareMode(false);
//     setError(null);
//   };

//   const handleSave = async () => {
//     const token = getAuthToken();

//     if (!token) {
//       navigate('/login', { state: { from: location.pathname } });
//       return;
//     }

//     if (selectedStocks.length === 0) {
//       setError("No stocks selected to save.");
//       return;
//     }

//     const invalidStocks = selectedStocks.filter(
//       stock => !stock.symbol || !stock.companyName
//     );

//     if (invalidStocks.length > 0) {
//       setError("Some selected stocks have missing information.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await Promise.all(
//         selectedStocks.map(stock =>
//           axios.post(
//             `${API_BASE}/stocks/test/saveStock`,
//             {
//               symbol: stock.symbol,
//               companyName: stock.companyName,
//             },
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           )
//         )
//       );

//       toast.success("Stocks added to watchlist successfully!");
//       localStorage.removeItem(`saved_stocks_${token}`);
//     } catch (error) {
//       console.error("Save error:", error);
//       setError(
//         error.response?.data?.error ||
//         "Failed to save stocks. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleCompareMode = () => {
//     if (selectedStocks.length !== 2) {
//       setError("Please select exactly two stocks to enable comparison.");
//       return;
//     }
//     setCompareMode(true);
//     setError(null);
//   };

//   const clearAllStocks = () => {
//     setSelectedStocks([]);
//     setCompareMode(false);
//     setError(null);
//   };

//   // UI handlers
//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

//   const handleTabChange = (tabKey) => {
//     setActiveTab(tabKey);
//     setIsSidebarOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
//    <Helmet>
//         <title>Equity Insights – Real-Time Market Insights & Data Visualizations | CMDA
//         </title>
//         <meta
//           name="description"
//           content="Get powerful equity market insights with CMDA’s real-time data analytics, visualizations, and 
// trend analysis tools designed for analysts and active traders."
//         />
//         <meta
//           name="keywords"
//           content="equity insights, stock market analysis, CMDA Hub, share market data, market trends, investment insights, Accord Fintech"
//         />
//         <meta property="og:title" content="Equity Insights | CMDA Hub" />
//         <meta
//           property="og:description"
//           content="Get powerful equity insights with CMDA Hub — your trusted source for real-time stock data, performance analytics, and expert market intelligence."
//         />
//         <meta property="og:url" content="https://cmdahub.com/equityinsights" />
//         <meta property="og:type" content="website" />
//         <meta property="og:site_name" content="CMDA Hub" />
//         <link rel="canonical" href="https://cmdahub.com/equityinsights" />
//       </Helmet>

//       <Navbar />
//       <main className="flex-1 flex pt-16">
//         {/* Mobile Sidebar Toggle */}
//         <button
//           className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
//           onClick={toggleSidebar}
//           aria-label={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
//         >
//           {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
//         </button>

//         {/* Sidebar */}
//         <div
//           className={`fixed lg:sticky lg:top-16 h-[calc(100vh-4rem)] z-40 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
//             } ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-80'} shadow-xl`}
//           aria-label="Sidebar Navigation"
//         >
//           <div className="flex flex-col h-full p-4">
//             {/* Sidebar Header */}
//             <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-6 border-b border-gray-200 dark:border-slate-700 pb-4`}>
//               {!isSidebarCollapsed && (
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
//                     <FiBarChart2 className="text-white" size={24} />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-800 dark:text-white">Equity Insights</h2>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Market Intelligence</p>
//                   </div>
//                 </div>
//               )}
//               <button
//                 onClick={toggleSidebarCollapse}
//                 className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//                 aria-label={isSidebarCollapsed ? 'Expand' : 'Collapse'}
//               >
//                 {isSidebarCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
//               </button>
//             </div>

//             {/* Navigation Tabs */}
//             <nav className="space-y-2 flex-1">
//               {navigationTabs.map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => handleTabChange(tab.key)}
//                   className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${activeTab === tab.key
//                     ? 'bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 shadow-md'
//                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400'
//                     } ${isSidebarCollapsed ? 'justify-center' : ''}`}
//                 >
//                   <span className={`transition-transform duration-200 ${activeTab === tab.key ? 'scale-110' : 'group-hover:scale-105'}`}>
//                     {tab.icon}
//                   </span>
//                   {!isSidebarCollapsed && (
//                     <div className="text-left flex-1">
//                       <div className="font-medium">{tab.label}</div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400">{tab.description}</div>
//                     </div>
//                   )}
//                 </button>
//               ))}
//             </nav>

//             {/* Sidebar Footer */}
//             {!isSidebarCollapsed && (
//               <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700">
//                 <div className="text-center text-sm text-gray-500 dark:text-gray-400">
//                   <div className="font-medium">EquityInsights Pro</div>
//                   <div>© 2025 All rights reserved</div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile Overlay */}
//         {isSidebarOpen && (
//           <div
//             className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm transition-opacity duration-300"
//             onClick={toggleSidebar}
//           />
//         )}

//         {/* Main Content Area */}
//         <div className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-1'}`}>
//           <div className="p-4 sm:p-6 lg:p-8 w-full max-w-9xl mx-auto">
//             {/* Equity Hub Tab */}
//             {activeTab === "hub" && (
//               <div className="w-full max-w-9xl mx-auto">
//                 {/* Search Section */}
//                 <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Stock Analysis Hub</h1>
//                       <p className="text-gray-600 dark:text-gray-400">Search and analyze NSE stocks with advanced tools</p>
//                     </div>
//                     {selectedStocks.length > 0 && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={clearAllStocks}
//                           className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
//                         >
//                           Clear All
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Error/Success Messages */}
//                   {error && (
//                     <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
//                       <div className="w-2 h-8 bg-red-500 rounded-full"></div>
//                       <div className="text-red-700 dark:text-red-300 text-sm">{error}</div>
//                     </div>
//                   )}

//                   {/* Search Input */}
//                   {/* <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <FaSearch className="text-gray-400" size={18} />
//                     </div>
//                     <input
//                       type="text"
//                       className="w-full pl-10 pr-12 py-4 text-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
//                       placeholder="Search for stocks by symbol or company name..."
//                       value={input}
//                       onChange={(e) => {
//                         setInput(e.target.value);
//                         fetchData(e.target.value);
//                       }}
//                     />
//                     {input && (
//                       <button
//                         onClick={() => setInput("")}
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       >
//                         <FaTimes className="text-gray-400 hover:text-gray-600 transition-colors" />
//                       </button>
//                     )}
//                   </div> */}

//                   {/* Search Results */}
//                   {/* {results.length > 0 && (
//                     <div className="mt-2 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg">
//                       <SearchList
//                         results={results}
//                         query={input}
//                         onSelectItem={handleSelectItem}
//                       />
//                     </div>
//                   )} */}

//                   <div className="mt-2">
//   <SearchList onSelect={handleSelectItem} />
// </div>


//                   {/* Selected Stocks */}
//                   {selectedStocks.length > 0 && (
//                     <div className="mt-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//                           Selected Stocks ({selectedStocks.length}/2)
//                         </h3>
//                         <div className="flex gap-2">
//                           {selectedStocks.length === 2 && (
//                             <button
//                               onClick={toggleCompareMode}
//                               className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
//                             >
//                               <FaCodeCompare size={14} />
//                               Compare
//                             </button>
//                           )}
//                           <button
//                             onClick={handleSave}
//                             disabled={isLoading}
//                             className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
//                           >
//                             <FaSave size={14} />
//                             {isLoading ? 'Saving...' : 'Save to Watchlist'}
//                           </button>
//                         </div>
//                       </div>
//                       <div className="flex flex-wrap gap-3">
//                         {selectedStocks.map((stock) => (
//                           <div
//                             key={stock.symbol}
//                             className="flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl px-4 py-3"
//                           >
//                             <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
//                             <div>
//                               <div className="font-semibold text-gray-800 dark:text-white">
//                                 {stock.symbol}
//                               </div>
//                               <div className="text-sm text-gray-600 dark:text-gray-400">
//                                 {stock.companyName}
//                               </div>
//                             </div>
//                             <button
//                               onClick={() => removeStock(stock.symbol)}
//                               className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
//                             >
//                               <FaTimes size={14} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Inspirational Quote */}
//                   <div className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50/80 via-blue-50/60 to-indigo-50/80 dark:from-cyan-900/30 dark:via-blue-900/20 dark:to-indigo-900/30 border border-cyan-200/50 dark:border-cyan-700/30 backdrop-blur-sm">
//                     {/* Animated Background */}
//                     <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-400/3 to-purple-400/5 animate-pulse"></div>

//                     {/* Floating Elements */}
//                     <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400/20 rounded-full animate-bounce"></div>
//                     <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>

//                     <div className="relative p-6">
//                       {/* Header */}
//                       <div className="flex items-center gap-2 mb-4">
//                         <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
//                           <BsQuote className="text-white" size={16} />
//                         </div>
//                         <span className="text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
//                           WORDS OF WISDOM
//                         </span>
//                       </div>

//                       {/* Quotes Container */}
//                       <div className="relative h-20 overflow-hidden">
//                         {/* Quote 1 */}
//                         <div className="absolute inset-0 animate-float-quote-1">
//                           <div className="flex items-start gap-3">
//                             <BsQuote className="text-cyan-500 dark:text-cyan-400 mt-1 flex-shrink-0 transform rotate-180" size={24} />
//                             <div>
//                               <p className="text-gray-800 dark:text-gray-200 italic text-sm leading-6 font-medium">
//                                 "Bulls are born out of pessimism, grow on skepticism, mature on optimism, and die in euphoria."
//                               </p>
//                               <p className="text-cyan-600 dark:text-cyan-400 font-semibold text-xs mt-3 flex items-center gap-2">
//                                 <span className="w-2 h-0.5 bg-cyan-400 rounded-full"></span>
//                                 Franklin Templeton
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                         {/* Quote 2 */}
//                         <div className="absolute inset-0 animate-float-quote-2">
//                           <div className="flex items-start gap-3">
//                             <BsQuote className="text-cyan-500 dark:text-cyan-400 mt-1 flex-shrink-0 transform rotate-180" size={24} />
//                             <div>
//                               <p className="text-gray-800 dark:text-gray-200 italic text-sm leading-6 font-medium">
//                                 "The stock market is filled with individuals who know the price of everything, but the value of nothing."
//                               </p>
//                               <p className="text-cyan-600 dark:text-cyan-400 font-semibold text-xs mt-3 flex items-center gap-2">
//                                 <span className="w-2 h-0.5 bg-cyan-400 rounded-full"></span>
//                                 Philip Fisher
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                         {/* Quote 3 */}
//                         <div className="absolute inset-0 animate-float-quote-3">
//                           <div className="flex items-start gap-3">
//                             <BsQuote className="text-blue-500 dark:text-blue-400 mt-1 flex-shrip-0 transform rotate-180" size={24} />
//                             <div>
//                               <p className="text-gray-800 dark:text-gray-200 italic text-sm leading-6 font-medium">
//                                 "Risk comes from not knowing what you're doing. The stock market is a device for transferring money from the impatient to the patient."
//                               </p>
//                               <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs mt-3 flex items-center gap-2">
//                                 <span className="w-2 h-0.5 bg-blue-400 rounded-full"></span>
//                                 Warren Buffett
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Quote 4 */}
//                         <div className="absolute inset-0 animate-float-quote-4">
//                           <div className="flex items-start gap-3">
//                             <BsQuote className="text-indigo-500 dark:text-indigo-400 mt-1 flex-shrink-0 transform rotate-180" size={24} />
//                             <div>
//                               <p className="text-gray-800 dark:text-gray-200 italic text-sm leading-6 font-medium">
//                                 "In the short run, the market is a voting machine. In the long run, it is a weighing machine."
//                               </p>
//                               <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs mt-3 flex items-center gap-2">
//                                 <span className="w-2 h-0.5 bg-indigo-400 rounded-full"></span>
//                                 Benjamin Graham
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Quote 5 */}
//                         <div className="absolute inset-0 animate-float-quote-5">
//                           <div className="flex items-start gap-3">
//                             <BsQuote className="text-purple-500 dark:text-purple-400 mt-1 flex-shrink-0 transform rotate-180" size={24} />
//                             <div>
//                               <p className="text-gray-800 dark:text-gray-200 italic text-sm leading-6 font-medium">
//                                 "The four most dangerous words in investing are: 'This time it's different.'"
//                               </p>
//                               <p className="text-purple-600 dark:text-purple-400 font-semibold text-xs mt-3 flex items-center gap-2">
//                                 <span className="w-2 h-0.5 bg-purple-400 rounded-full"></span>
//                                 Sir John Templeton
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Navigation Dots */}
//                       <div className="flex justify-center gap-2 mt-4">
//                         {[1, 2, 3, 4].map((dot) => (
//                           <button
//                             key={dot}
//                             className={`w-2 h-2 rounded-full transition-all duration-300 ${dot === 1
//                               ? 'bg-cyan-500 w-6'
//                               : 'bg-cyan-300/50 hover:bg-cyan-400'
//                               }`}
//                             aria-label={`Go to quote ${dot}`}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Add these custom animations to your Tailwind config */}
//                   <style jsx>{`
//   @keyframes float-quote-1 {
//     0%, 16% { opacity: 1; transform: translateY(0); }
//     20%, 100% { opacity: 0; transform: translateY(-20px); }
//   }
//   @keyframes float-quote-2 {
//     0%, 16% { opacity: 0; transform: translateY(20px); }
//     20%, 36% { opacity: 1; transform: translateY(0); }
//     40%, 100% { opacity: 0; transform: translateY(-20px); }
//   }
//   @keyframes float-quote-3 {
//     0%, 36% { opacity: 0; transform: translateY(20px); }
//     40%, 56% { opacity: 1; transform: translateY(0); }
//     60%, 100% { opacity: 0; transform: translateY(-20px); }
//   }
//   @keyframes float-quote-4 {
//     0%, 56% { opacity: 0; transform: translateY(20px); }
//     60%, 76% { opacity: 1; transform: translateY(0); }
//     80%, 100% { opacity: 0; transform: translateY(-20px); }
//   }
//   @keyframes float-quote-5 {
//     0%, 76% { opacity: 0; transform: translateY(20px); }
//     80%, 96% { opacity: 1; transform: translateY(0); }
//     100% { opacity: 0; transform: translateY(-20px); }
//   }
//   .animate-float-quote-1 {
//     animation: float-quote-1 20s infinite;
//   }
//   .animate-float-quote-2 {
//     animation: float-quote-2 20s infinite;
//   }
//   .animate-float-quote-3 {
//     animation: float-quote-3 20s infinite;
//   }
//   .animate-float-quote-4 {
//     animation: float-quote-4 20s infinite;
//   }
//   .animate-float-quote-5 {
//     animation: float-quote-5 20s infinite;
//   }
// `}</style>
//                 </div>

//                 {/* Stock Analysis Section */}
//                 {!compareMode && selectedStocks.length > 0 && (
//                   <div className="space-y-6 mt-6">
//                     {/* Stock Cards */}
//                     <div className={`grid gap-6 ${selectedStocks.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} w-full`}>
//                       {selectedStocks.map((stock) => (
//                         <div
//                           key={stock.symbol}
//                           ref={(el) => (stockRefs.current[stock.symbol] = el)}
//                           className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden"
//                         >
//                           {/* Stock Header */}
//                           <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <h3 className="text-lg font-bold text-gray-800 dark:text-white">
//                                   {stock.symbol}
//                                 </h3>
//                                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                                   {stock.companyName}
//                                 </p>
//                               </div>
//                               <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-xs font-medium rounded-full">
//                                 {stock.basicIndustry || 'N/A'}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Stock Content */}
//                           <div className="p-6 space-y-6">
//                             <OpenCloseCards
//                               symbol={stock.symbol}
//                               companyName={stock.companyName}
//                             />
//                             <GraphSlider
//                               symbol={stock.symbol}
//                               tabContext="equityHub"
//                               isFullWidth={selectedStocks.length === 1}
//                               timeRange={timeRange}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Comparison Mode */}
//                 {compareMode && selectedStocks.length === 2 && (
//                   <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
//                     {/* Comparison Header */}
//                     <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
//                       <div>
//                         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//                           Stock Comparison
//                         </h2>
//                         <p className="text-gray-600 dark:text-gray-400">
//                           {selectedStocks[0].symbol} vs {selectedStocks[1].symbol}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <select
//                           className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                           value={graphMode}
//                           onChange={(e) => setGraphMode(e.target.value)}
//                         >
//                           <option value="side-by-side">Side by Side</option>
//                           <option value="overlay">Overlay View</option>
//                         </select>
//                         <button
//                           onClick={() => setCompareMode(false)}
//                           className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//                         >
//                           Close Comparison
//                         </button>
//                       </div>
//                     </div>

//                     {/* Comparison Content */}
//                     <div className="flex-1 p-6 overflow-auto">
//                       {graphMode === "side-by-side" ? (
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl mx-auto">
//                           {selectedStocks.map((stock) => (
//                             <div key={stock.symbol} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6">
//                               <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                                 {stock.symbol} - {stock.companyName}
//                               </h3>
//                               <GraphSlider
//                                 symbol={stock.symbol}
//                                 isFullWidth={true}
//                                 timeRange={timeRange}
//                                 normalize={true}
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-7xl mx-auto">
//                           <div className="grid gap-6">
//                             {selectedStocks.map((stock) => (
//                               <div key={stock.symbol}>
//                                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//                                   {stock.symbol} - {stock.companyName}
//                                 </h3>
                               

//                                   <GraphSlider
//                                     symbol={stock.symbol}
//                                     isFullWidth={true}
//                                     timeRange={timeRange}
//                                     normalize={true}
//                                     overlay={true}
//                                     getAuthToken={getAuthToken}
//                                   />
                              
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Watchlist Tab */}
//             {activeTab === "search" && (
//               <div className="w-full max-w-9xl mx-auto">
//                 <Mysearch API_BASE={API_BASE} getAuthToken={getAuthToken} />
//               </div>
//             )}

//             {/* Tutorials Tab */}
//             {activeTab === "videos" && (
//               <div className="w-full max-w-9xl mx-auto">
//                 <div className=" dark:bg-slate-800 dark:border-slate-700 p-6">
//                   <SearchTutorial />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default EquityHub;




import React, { useEffect, useState, useRef } from 'react';
import Navbar from "../Navbar";
// import Footer from "../Footer";
import SearchList from "./SearchList";
import GraphSlider from "./GraphSlider";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsQuote } from "react-icons/bs";
import { FaChartLine, FaEye, FaVideo, FaSave } from "react-icons/fa";
import { FiMenu, FiX, FiChevronLeft, FiChevronRight, FiBarChart2 } from "react-icons/fi";
import SearchTutorial from './SearchTutorial';
import Mysearch from './Mysearch';
import StockDetailCard from './StockDetailCard';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';
import { FaCodeCompare } from 'react-icons/fa6';
import { Helmet } from 'react-helmet-async';

const EquityHub = () => {
  const { getAuthToken, isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || queryParams.get("symbol") || "";
  // State management
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("hub");
  const [hasSearched, setHasSearched] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [graphMode, setGraphMode] = useState("side-by-side");
  const [timeRange, setTimeRange] = useState("1Y");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const stockRefs = useRef({});
  const inactivityTimer = useRef(null); // Ref to track inactivity timer
  const API_BASE = import.meta.env.VITE_URL || "http://168.231.121.219:8080";
  const CACHE_TTL = 60 * 60 * 1000;
  // Navigation tabs configuration
  const navigationTabs = [
    {
      key: 'hub',
      label: 'Equity Insights',
      icon: <FiBarChart2 size={20} />,
      description: 'Search and analyze stocks'
    },
    {
      key: 'search',
      label: 'Watchlist',
      icon: <FaEye size={18} />,
      description: 'Manage your saved stocks'
    },
    {
      key: 'videos',
      label: 'Tutorials',
      icon: <FaVideo size={18} />,
      description: 'Learn how to use the platform'
    },
  ];
  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      fetchData(initialQuery);
    }
  }, [initialQuery]);
  // Add this useEffect right after the existing one that handles initialQuery
useEffect(() => {
  if (initialQuery) {
    // Trim and uppercase the symbol (common format)
    const symbol = initialQuery.trim().toUpperCase();

    if (symbol && selectedStocks.length === 0) {
      // Prevent duplicate loading if already selected
      if (selectedStocks.some(s => s.symbol === symbol)) return;

      // Fetch full stock details and auto-select it
      const loadStockFromQuery = async () => {
        setIsLoading(true);
        try {
          const cacheKey = `stock_${symbol}`;
          const cachedStock = getCachedData(cacheKey);

          if (cachedStock && cachedStock.symbol === symbol) {
            addStockToSelection(cachedStock);
            setIsLoading(false);
            return;
          }

          // Call the same endpoint used in suggestions
          const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
            params: { prefix: symbol },
            timeout: 10000,
          });

          const matchedStock = response.data.find(
            s => s.symbol.toUpperCase() === symbol
          );

          if (matchedStock) {
            setCachedData(cacheKey, matchedStock);
            addStockToSelection(matchedStock);
          } else {
            setError(`No data found for symbol: ${symbol}`);
          }
        } catch (error) {
          console.error("Auto-load stock error:", error);
          setError("Failed to load stock data. Please search manually.");
        } finally {
          setIsLoading(false);
        }
      };

      loadStockFromQuery();
    }
  }
}, [initialQuery]); // Only run when initialQuery changes (on page load or navigation)
  // Auto-collapse sidebar after 20 seconds of inactivity
  useEffect(() => {
    const resetTimer = () => {
      // Clear existing timer
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      // Only set timer if sidebar is open (mobile) or not collapsed (desktop)
      if ((window.innerWidth < 1024 && isSidebarOpen) || (window.innerWidth >= 1024 && !isSidebarCollapsed)) {
        inactivityTimer.current = setTimeout(() => {
          if (window.innerWidth < 1024) {
            setIsSidebarOpen(false); // Close sidebar on mobile
          } else {
            setIsSidebarCollapsed(true); // Collapse sidebar on desktop
          }
        }, 10000); // 20 seconds
      }
    };
    // Handle user interactions
    const handleInteraction = () => {
      resetTimer();
    };
    // Set up event listeners for sidebar interactions
    const sidebarElement = document.querySelector('[aria-label="Sidebar Navigation"]');
    if (sidebarElement) {
      sidebarElement.addEventListener('mousemove', handleInteraction);
      sidebarElement.addEventListener('click', handleInteraction);
      sidebarElement.addEventListener('touchstart', handleInteraction); // Add touch support for mobile
    }
    // Start timer based on initial conditions
    resetTimer();
    // Cleanup: Clear timer and remove event listeners
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (sidebarElement) {
        sidebarElement.removeEventListener('mousemove', handleInteraction);
        sidebarElement.removeEventListener('click', handleInteraction);
        sidebarElement.removeEventListener('touchstart', handleInteraction);
      }
    };
  }, [isSidebarOpen, isSidebarCollapsed]);
  // Cache utilities
  const getCachedData = (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (err) {
      return null;
    }
  };
  const setCachedData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error("Cache storage failed:", err);
    }
  };
  // API calls
  const fetchData = async (value) => {
    if (!value.trim()) {
      setResults([]);
      setError(null);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setIsLoading(true);
    const cacheKey = `search_${value.toLowerCase()}`;
    const cachedResults = getCachedData(cacheKey);
    if (cachedResults) {
      setResults(cachedResults);
      setError(null);
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
        params: { prefix: value },
        timeout: 10000,
      });
      const filteredResults = response.data;
      if (filteredResults.length === 0) {
        setError("No companies found matching your search. Please try a different term.");
      } else {
        setResults(filteredResults);
        setCachedData(cacheKey, filteredResults);
        setError(null);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError(
        error.response?.status === 404
          ? "Service temporarily unavailable. Please try again later."
          : "Unable to fetch search results. Check your connection and try again."
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectItem = async (item) => {
    setInput("");
    setResults([]);
    if (selectedStocks.some(stock => stock.symbol === item.symbol)) {
      scrollToStock(item.symbol);
      return;
    }
    if (selectedStocks.length >= 2) {
      setError("Maximum 2 stocks can be selected for comparison. Remove one to add another.");
      return;
    }
    setIsLoading(true);
    try {
      const cacheKey = `stock_${item.symbol}`;
      const cachedStock = getCachedData(cacheKey);
      if (cachedStock) {
        addStockToSelection(cachedStock);
        return;
      }
      const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
        params: { prefix: item.companyName },
        timeout: 10000,
      });
      if (response.data.length > 0) {
        const matchedStock = response.data.find(
          s => s.symbol === item.symbol && s.companyName === item.companyName
        ) || response.data[0];
        setCachedData(cacheKey, matchedStock);
        addStockToSelection(matchedStock);
      } else {
        setError("Detailed information not available for this stock.");
      }
    } catch (error) {
      console.error("Stock details error:", error);
      setError("Failed to load stock details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // const addStockToSelection = (stock) => {
  //   setSelectedStocks(prev => {
  //     const updated = [...prev, stock];
  //     setTimeout(() => scrollToStock(stock.symbol), 100);
  //     return updated;
  //   });
  //   setError(null);
  // };

  const addStockToSelection = (stock) => {
  setSelectedStocks(prev => {
    const updated = [...prev, stock];
    setTimeout(() => scrollToStock(stock.symbol), 100);
    return updated;
  });

  setInput("");        // ← Add this line here
  setError(null);      // ← Keep this (clears any previous errors)
};
  const scrollToStock = (symbol) => {
    const stockDiv = stockRefs.current[symbol];
    if (stockDiv) {
      stockDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const removeStock = (symbol) => {
    setSelectedStocks(prev => prev.filter(stock => stock.symbol !== symbol));
    setCompareMode(false);
    setError(null);
  };
  const handleSave = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (selectedStocks.length === 0) {
      setError("No stocks selected to save.");
      return;
    }
    const invalidStocks = selectedStocks.filter(
      stock => !stock.symbol || !stock.companyName
    );
    if (invalidStocks.length > 0) {
      setError("Some selected stocks have missing information.");
      return;
    }
    setIsLoading(true);
    try {
      await Promise.all(
        selectedStocks.map(stock =>
          axios.post(
            `${API_BASE}/stocks/test/saveStock`,
            {
              symbol: stock.symbol,
              companyName: stock.companyName,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );
      toast.success("Stocks added to watchlist successfully!");
      localStorage.removeItem(`saved_stocks_${token}`);
    } catch (error) {
      console.error("Save error:", error);
      setError(
        error.response?.data?.error ||
        "Failed to save stocks. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const toggleCompareMode = () => {
    if (selectedStocks.length !== 2) {
      setError("Please select exactly two stocks to enable comparison.");
      return;
    }
    setCompareMode(true);
    setError(null);
  };
  const clearAllStocks = () => {
    setSelectedStocks([]);
    setCompareMode(false);
    setError(null);
  };
  // UI handlers
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setIsSidebarOpen(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex flex-col font-sans antialiased">
      <Helmet>
        <title>Equity Insights – Real-Time Market Insights & Data Visualizations | CMDA</title>
        <meta
          name="description"
          content="Get powerful equity market insights with CMDA’s real-time data analytics, visualizations, and trend analysis tools designed for analysts and active traders."
        />
        <meta
          name="keywords"
          content="equity insights, stock market analysis, CMDA Hub, share market data, market trends, investment insights, Accord Fintech"
        />
        <meta property="og:title" content="Equity Insights | CMDA Hub" />
        <meta
          property="og:description"
          content="Get powerful equity insights with CMDA Hub — your trusted source for real-time stock data, performance analytics, and expert market intelligence."
        />
        <meta property="og:url" content="https://cmdahub.com/equityinsights" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CMDA Hub" />
        <link rel="canonical" href="https://cmdahub.com/equityinsights" />
      </Helmet>
      <Navbar />
      <main className="flex-1 flex pt-16">
        {/* Mobile Sidebar Toggle */}
        <button
          className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        {/* Sidebar */}
        <div
          className={`fixed lg:sticky lg:top-16 h-[calc(100vh-4rem)] z-40 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
            } ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-80'} shadow-xl`}
          aria-label="Sidebar Navigation"
        >
          <div className="flex flex-col h-full p-4">
            {/* Sidebar Header */}
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-6 border-b border-gray-200 dark:border-slate-700 pb-4`}>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                    <FiBarChart2 className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Equity Insights</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Market Intelligence</p>
                  </div>
                </div>
              )}
              <button
                onClick={toggleSidebarCollapse}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label={isSidebarCollapsed ? 'Expand' : 'Collapse'}
              >
                {isSidebarCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
              </button>
            </div>
            {/* Navigation Tabs */}
            <nav className="space-y-2 flex-1">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${activeTab === tab.key
                    ? 'bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400'
                    } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <span className={`transition-transform duration-200 ${activeTab === tab.key ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {tab.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <div className="text-left flex-1">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{tab.description}</div>
                    </div>
                  )}
                </button>
              ))}
            </nav>
            {/* Sidebar Footer */}
            {!isSidebarCollapsed && (
              <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="font-medium">EquityInsights Pro</div>
                  <div>© 2025 All rights reserved</div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm transition-opacity duration-300"
            onClick={toggleSidebar}
          />
        )}
        {/* Main Content Area */}
        <div className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-1'}`}>
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-9xl mx-auto">
            <div className="relative py-8 bg-gradient-to-r from-primary/5 via-primary/8 to-accent/5 border-b border-base-300/50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex items-center justify-center gap-6">
      {/* Left Quote Icon */}
      <BsQuote className="text-primary/60" size={22} />

      {/* Marquee Container */}
      <div className="relative overflow-hidden flex-1">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* Duplicate content for seamless loop */}
          {[
            { quote: "Bulls are born out of pessimism, grow on skepticism, mature on optimism, and die in euphoria.", author: "Franklin Templeton" },
            { quote: "The stock market is filled with individuals who know the price of everything, but the value of nothing.", author: "Philip Fisher" },
            { quote: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
            { quote: "In the short run, the market is a voting machine. In the long run, it is a weighing machine.", author: "Benjamin Graham" },
            { quote: "The four most dangerous words in investing are: 'This time it's different.'", author: "Sir John Templeton" },
            // Duplicate for infinite loop
            { quote: "Bulls are born out of pessimism, grow on skepticism, mature on optimism, and die in euphoria.", author: "Franklin Templeton" },
            { quote: "The stock market is filled with individuals who know the price of everything, but the value of nothing.", author: "Philip Fisher" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-8 px-8">
              <span className="text-base-content/90 font-medium text-lg">
                “{item.quote}”
              </span>
              <span className="text-primary font-semibold text-sm tracking-wider">
                — {item.author}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Quote Icon */}
      <BsQuote className="text-primary/60 rotate-180" size={22} />
    </div>
  </div>
</div>
            {/* Equity Hub Tab */}
            {activeTab === "hub" && (
              <div className="w-full max-w-9xl mx-auto space-y-8">
                {/* Search Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Stock Analysis Hub</h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Advanced tools for NSE stock search and analysis</p>
                    </div>
                     {/* Inspirational Quote */}
                  {/* Premium Continuous Quote Banner – Pure Tailwind */}

                    {selectedStocks.length > 0 && (
                      <div className="flex gap-3">
                        <button
                          onClick={clearAllStocks}
                          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Error/Success Messages */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                      <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                      <div className="text-red-700 dark:text-red-300 text-sm">{error}</div>
                    </div>
                  )}
                  {/* Integrated SearchList */}
                  <div className="mt-2">
                    <SearchList onSelect={handleSelectItem} />
                  </div>
                  {/* Selected Stocks */}
                  {selectedStocks.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Selected Stocks ({selectedStocks.length}/2)
                        </h3>
                        <div className="flex gap-3">
                          {selectedStocks.length === 2 && (
                            <button
                              onClick={toggleCompareMode}
                              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                            >
                              <FaCodeCompare size={14} />
                              Compare
                            </button>
                          )}
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 font-medium"
                          >
                            <FaSave size={14} />
                            {isLoading ? 'Saving...' : 'Save to Watchlist'}
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {selectedStocks.map((stock) => (
                          <div
                            key={stock.symbol}
                            className="flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl px-4 py-3 shadow-sm"
                          >
                            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                            <div>
                              <div className="font-semibold text-gray-800 dark:text-white">
                                {stock.symbol}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stock.companyName}
                              </div>
                            </div>
                            <button
                              onClick={() => removeStock(stock.symbol)}
                              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                 
                </div>
                {/* Stock Analysis Section */}
                {!compareMode && selectedStocks.length > 0 && (
                  <div className="space-y-8">
                    {/* Stock Cards */}
                    <div className={`grid gap-8 ${selectedStocks.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} w-full`}>
                      {selectedStocks.map((stock) => (
                        <div
                          key={stock.symbol}
                          ref={(el) => (stockRefs.current[stock.symbol] = el)}
                          className="w-full"
                        >
                          <StockDetailCard
                            stock={stock}
                            timeRange={timeRange}
                            isFullWidth={selectedStocks.length === 1}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Comparison Mode */}
                {compareMode && selectedStocks.length === 2 && (
                  <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
                    {/* Comparison Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                          Stock Comparison
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {selectedStocks[0].symbol} vs {selectedStocks[1].symbol}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <select
                          className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                          value={graphMode}
                          onChange={(e) => setGraphMode(e.target.value)}
                        >
                          <option value="side-by-side">Side by Side</option>
                          <option value="overlay">Overlay View</option>
                        </select>
                        <button
                          onClick={() => setCompareMode(false)}
                          className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
                        >
                          Close Comparison
                        </button>
                      </div>
                    </div>
                    {/* Comparison Content */}
                    <div className="flex-1 p-6 overflow-auto">
                      {graphMode === "side-by-side" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl mx-auto">
                          {selectedStocks.map((stock) => (
                            <div key={stock.symbol} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
                                {stock.symbol} - {stock.companyName}
                              </h3>
                              <GraphSlider
                                symbol={stock.symbol}
                                fincode={stock.fincode}
                                isFullWidth={true}
                                timeRange={timeRange}
                                normalize={true}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-7xl mx-auto shadow-md">
                          <div className="grid gap-6">
                            {selectedStocks.map((stock) => (
                              <div key={stock.symbol}>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
                                  {stock.symbol} - {stock.companyName}
                                </h3>
                                <GraphSlider
                                  symbol={stock.symbol}
                                  fincode={stock.fincode}
                                  isFullWidth={true}
                                  timeRange={timeRange}
                                  normalize={true}
                                  overlay={true}
                                  getAuthToken={getAuthToken}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Watchlist Tab */}
            {activeTab === "search" && (
              <div className="w-full max-w-9xl mx-auto">
                <Mysearch API_BASE={API_BASE} getAuthToken={getAuthToken} />
              </div>
            )}
            {/* Tutorials Tab */}
            {activeTab === "videos" && (
              <div className="w-full max-w-9xl mx-auto">
                <div className=" dark:bg-slate-800 dark:border-slate-700 p-6">
                  <SearchTutorial />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};
export default EquityHub;
