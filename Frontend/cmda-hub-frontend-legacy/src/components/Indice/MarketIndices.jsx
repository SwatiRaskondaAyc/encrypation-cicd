

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const MarketIndices = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     const [indices, setIndices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedIndex, setSelectedIndex] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDark, setIsDark] = useState(false);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [showAllIndices, setShowAllIndices] = useState(false);
//     const navigate = useNavigate();
//     const [searchParams, setSearchParams] = useSearchParams();
//     const selectedSymbol = searchParams.get('symbol');
//     const itemsPerPage = 10;
//     const cardsPerSlide = 4;

//     const indexNames = [...new Set([
//         "NIFTY 50",
//         "NIFTY NEXT 50",
//         "NIFTY BANK",
//         "NIFTY MIDCAP 100",
//         "NIFTY SMALLCAP 250",
//         "NIFTY ALPHA 50",
//         "NIFTY100 QUALITY 30",
//         "NIFTY 50 VALUE 20",
//         "NIFTY 100 LOW VOLATILITY 30",
//         "NIFTY CPSE",
//         "NIFTY ENERGY",
//         "NIFTY COMMODITIES",
//         "NIFTY SMALLCAP250 MOMENTUM QUALITY 100",
//         "NIFTY200 ALPHA 30",
//         "NIFTY MICROCAP 250",
//         "NIFTY MIDCAP 150",
//         "NIFTY AUTO",
//         "NIFTY MEDIA",
//         "NIFTY MIDCAP LIQUID 15",
//         "NIFTY PRIVATE BANK",
//         "NIFTY HEALTHCARE INDEX",
//         "NIFTY INDIA CORPORATE GROUP INDEX - TATA GROUP 25% CAP",
//         "NIFTY 200",
//         "NIFTY MIDSMALLCAP400 MOMENTUM QUALITY 100",
//         "NIFTY CAPITAL MARKETS",
//         "NIFTY LARGEMIDCAP 250",
//         "NIFTY MIDSMALLCAP 400",
//         "NIFTY 100",
//         "NIFTY SMALLCAP 50",
//         "NIFTY500 MOMENTUM 50",
//         "NIFTY SMALLCAP 100",
//         "NIFTY INDIA DEFENCE",
//         "NIFTY PSE",
//         "NIFTY GROWTH SECTORS 15",
//         "NIFTY100 EQUAL WEIGHT",
//         "NIFTY INDIA CONSUMPTION",
//         "NIFTY SERVICES SECTOR",
//         "NIFTY100 LIQUID 15",
//         "NIFTY MNC",
//         "NIFTY DIVIDEND OPPORTUNITIES 50",
//         "NIFTY MIDCAP 50",
//         "NIFTY500 MULTICAP 50 3A25 3A25",
//         "NIFTY TOP 10 EQUAL WEIGHT",
//         "NIFTY CONSUMER DURABLES",
//         "NIFTY FINANCIAL SERVICES 25 2F50",
//         "NIFTY TOTAL MARKET",
//         "NIFTY50 EQUAL WEIGHT",
//         "NIFTY REALTY",
//         "NIFTY 500",
//         "NIFTY INDIA MANUFACTURING",
//         "NIFTY MIDCAP150 QUALITY 50",
//         "NIFTYINFRASTRUCTURE",
//         "NIFTY200 QUALITY 30",
//         "NIFTY PHARMA",
//         "NIFTY INDIA DIGITAL",
//         "NIFTY200 MOMENTUM 30",
//         "NIFTY FINANCIAL SERVICES",
//         "NIFTY500 MULTICAP INFRASTRUCTURE 50 3A30 3A20",
//         "NIFTY PSU BANK",
//         "NIFTY OIL & GAS",
//         "NIFTY MIDCAP150 MOMENTUM 50",
//         "NIFTY MIDSMALL HEALTHCARE",
//         "NIFTY ALPHA LOW-VOLATILITY 30",
//         "NIFTY IT",
//         "NIFTY INDIA TOURISM",
//         "NIFTY MIDCAP SELECT",
//         "NIFTY FMCG",
//         "NIFTY METAL",
//     ])];

//     const colorPalette = [
//         'rgba(31, 119, 180, 0.8)', 'rgba(255, 127, 14, 0.8)', 'rgba(13, 84, 105, 0.8)',
//         'rgba(214, 39, 40, 0.8)', 'rgba(148, 103, 189, 0.8)', 'rgba(23, 190, 207, 0.8)',
//         'rgba(227, 119, 194, 0.8)', 'rgba(188, 189, 34, 0.8)', 'rgba(127, 127, 127, 0.8)',
//         'rgba(70, 130, 180, 0.8)',
//     ];

//     const removeSymbolFromURL = () => {
//         searchParams.delete('symbol');
//         setSearchParams(searchParams);
//     };


//     const onRowClick = (symbol) => {
//         if (symbol) {
//             navigate(`/equityhub?symbol=${encodeURIComponent(symbol)}`);
//         }
//     };

//     const formatDecimal = (num) => {
//         if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//         return Math.round(num * 100) / 100;
//     };

//     const formatNumber = useCallback((num) => {
//         if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
//         const absNum = Math.abs(num);
//         const sign = num < 0 ? '-' : '';
//         if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: absNum % 1 === 0 ? 0 : 2 })}cr`;
//         if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: absNum % 1 === 0 ? 0 : 2 })}L`;
//         return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//     }, []);

//     useEffect(() => {
//         const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//         setIsDark(mediaQuery.matches);
//         const handleChange = (e) => setIsDark(e.matches);
//         mediaQuery.addEventListener('change', handleChange);
//         return () => mediaQuery.removeEventListener('change', handleChange);
//     }, []);

//     useEffect(() => {
//         const controller = new AbortController();
//         const cacheDuration = 60 * 60 * 1000; // 1 hour

//         const fetchIndices = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 const cachedData = localStorage.getItem('indicesData');
//                 const cacheTimestamp = localStorage.getItem('indicesDataTimestamp');
//                 let validIndices = [];

//                 if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//                     validIndices = JSON.parse(cachedData).filter(
//                         (index) => index?.index_name && Number.isFinite(index.free_float_mcap) && Number.isFinite(index.pe)
//                     );
//                     console.log('Using cached data:', validIndices);
//                 } else {
//                     for (let i = 0; i < indexNames.length; i++) {
//                         try {
//                             const indexResponse = await axios.get(`${API_BASE}/indices`, {
//                                 params: { name: indexNames[i] },
//                                 signal: controller.signal,
//                             });
//                             console.log(`Response for ${indexNames[i]}:`, indexResponse.data);

//                             if (indexResponse.data.status === 'success') {
//                                 const indexData = indexResponse.data.data;
//                                 if (indexData && indexData.index_name && Number.isFinite(indexData.free_float_mcap) && Number.isFinite(indexData.pe)) {
//                                     validIndices.push({
//                                         ...indexData,
//                                         requestedName: indexNames[i],
//                                         color: colorPalette[i % colorPalette.length],
//                                         highlightColor: colorPalette[i % colorPalette.length].replace('0.8)', '1)'),
//                                     });
//                                 } else {
//                                     console.warn(`Invalid data for ${indexNames[i]}:`, indexData);
//                                 }
//                             } else {
//                                 console.warn(`API error for ${indexNames[i]}:`, indexResponse.data);
//                             }
//                         } catch (e) {
//                             console.error(`Error fetching data for ${indexNames[i]}:`, e.response?.data || e.message);
//                             continue;
//                         }
//                     }

//                     if (validIndices.length > 0) {
//                         localStorage.setItem('indicesData', JSON.stringify(validIndices));
//                         localStorage.setItem('indicesDataTimestamp', Date.now().toString());
//                     }
//                 }

//                 if (validIndices.length === 0) {
//                     setError('No valid index data available. Please verify the index names or API response.');
//                     setIndices([]);
//                 } else {
//                     setIndices(validIndices);
//                 }
//                 setLoading(false);
//             } catch (error) {
//                 if (error.name === 'AbortError') return;
//                 setError('Failed to fetch index data. Please check the network, CORS settings, or API base URL.');
//                 console.error('Error fetching index data:', error);
//                 setIndices([]);
//                 setLoading(false);
//             }
//         };

//         fetchIndices();

//         return () => controller.abort();
//     }, [API_BASE]);

//     const handleViewDetails = (index) => {
//         setSelectedIndex(index);
//         setIsModalOpen(true);
//         setSearchTerm('');
//         setCurrentPage(1);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedIndex(null);
//         setSearchTerm('');
//         setCurrentPage(1);
//     };

//     const handleViewAllIndices = () => {
//         setShowAllIndices(true);
//         setCurrentSlide(0);
//     };

//     const chunkArray = (array, size) => {
//         const result = [];
//         for (let i = 0; i < array.length; i += size) {
//             result.push(array.slice(i, i + size));
//         }
//         return result;
//     };

//     const filteredConstituents = selectedIndex?.constituents?.filter(
//         (constituent) =>
//             constituent.Symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             constituent.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())
//     ) || [];

//     const totalPages = Math.ceil(filteredConstituents.length / itemsPerPage);
//     const currentConstituents = filteredConstituents.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     const handlePrevSlide = () => {
//         setCurrentSlide((prev) => (prev === 0 ? chunkArray(displayIndices, cardsPerSlide).length - 1 : prev - 1));
//     };

//     const handleNextSlide = () => {
//         setCurrentSlide((prev) => (prev === chunkArray(displayIndices, cardsPerSlide).length - 1 ? 0 : prev + 1));
//     };

//     const goToSlide = (index) => {
//         setCurrentSlide(index);
//     };

//     const viewAllCard = {
//         index_name: 'View All Indices',
//         isViewAll: true,
//         color: 'rgba(100, 100, 100, 0.8)',
//         highlightColor: 'rgba(100, 100, 100, 1)',
//     };
//     const displayIndices = showAllIndices ? indices : [...indices.slice(0, 10), viewAllCard];

//     // return (
//     //     <div className="px-4 py-3 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
//     //         <div className="pl-10 pr-10 max-w-8xl mx-auto">
//     //             <div className="">
//     //                 <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
//     //                     Market Indices Overview
//     //                 </h2>
//     //                 <p className="text-gray-600 dark:text-gray-400">
//     //                     Explore the top indices with their performance metrics
//     //                 </p>
//     //             </div>

//     //             {loading ? (
//     //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//     //                     {[...Array(cardsPerSlide)].map((_, i) => (
//     //                         <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-64 animate-pulse">
//     //                             <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
//     //                             <div className="space-y-3">
//     //                                 <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
//     //                                 <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
//     //                                 <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
//     //                                 <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mt-6"></div>
//     //                             </div>
//     //                         </div>
//     //                     ))}
//     //                 </div>
//     //             ) : error && indices.length === 0 ? (
//     //                 <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
//     //                     <div className="text-red-600 dark:text-red-400 text-xl mb-4">{error}</div>
//     //                     <button
//     //                         onClick={() => window.location.reload()}
//     //                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//     //                     >
//     //                         Retry
//     //                     </button>
//     //                 </div>
//     //             ) : (
//     //                 <>
//     //                     {/* <div className="relative w-full overflow-hidden rounded-xl">
//     //                         <div
//     //                             className="flex transition-transform duration-300 ease-in-out"
//     //                             style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//     //                         >
//     //                             {chunkArray(displayIndices, cardsPerSlide).map((slideIndices, slideIndex) => (
//     //                                 <div key={slideIndex} className="w-full flex-shrink-0">
//     //                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//     //                                         {slideIndices.map((index, i) => (
//     //                                             <motion.div
//     //                                                 key={index.isViewAll ? 'view-all' : i}
//     //                                                 initial={{ opacity: 0, y: 20 }}
//     //                                                 animate={{ opacity: 1, y: 0 }}
//     //                                                 transition={{ duration: 0.3, delay: (i % cardsPerSlide) * 0.1 }}
//     //                                                 className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${index.isViewAll ? 'border-2 border-blue-500' : ''}`}
//     //                                             >
//     //                                                 <div
//     //                                                     className="h-2 w-full"
//     //                                                     style={{ backgroundColor: index.color || colorPalette[i % colorPalette.length] }}
//     //                                                 ></div>
//     //                                                 <div className="pb-10 p-5">
//     //                                                     <h4 className="text-x pb-6 font-semibold text-gray-900 dark:text-gray-100 mb-4">
//     //                                                         {index.index_name}
//     //                                                     </h4>
//     //                                                     {index.isViewAll ? (
//     //                                                         <div className="text-center p-6">
//     //                                                             <p className="text-gray-600 dark:text-gray-400 mb-4">
//     //                                                                 Explore all {indexNames.length} market indices
//     //                                                             </p>
//     //                                                             <button
//     //                                                                 onClick={handleViewAllIndices}
//     //                                                                 className="p-5 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//     //                                                             >
//     //                                                                 View All Indices
//     //                                                             </button>
//     //                                                         </div>
//     //                                                     ) : (
//     //                                                         <>
//     //                                                             <div className="space-y-3">
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">Market Cap:</span>
//     //                                                                     <span className="font-medium text-gray-900 dark:text-gray-100">
//     //                                                                         {formatNumber(index.free_float_mcap)}
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">1Y Return:</span>
//     //                                                                     <span
//     //                                                                         className={`font-medium ${index.return_1y >= 0
//     //                                                                             ? 'text-green-600 dark:text-green-400'
//     //                                                                             : 'text-red-600 dark:text-red-400'
//     //                                                                             }`}
//     //                                                                     >
//     //                                                                         {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">P/E Ratio:</span>
//     //                                                                     <span className="font-medium text-gray-900 dark:text-gray-100">
//     //                                                                         {formatDecimal(index.pe)}
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">P/B Ratio:</span>
//     //                                                                     <span className="font-medium text-gray-900 dark:text-gray-100">
//     //                                                                         {formatDecimal(index.pb)}
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">Dividend Yield:</span>
//     //                                                                     <span className="font-medium text-gray-900 dark:text-gray-100">
//     //                                                                         {formatDecimal(index.dividend_yield * 100)}%
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                             </div>
//     //                                                             <button
//     //                                                                 onClick={() => handleViewDetails(index)}
//     //                                                                 className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//     //                                                             >
//     //                                                                 View Details
//     //                                                             </button>
//     //                                                         </>
//     //                                                     )}
//     //                                                 </div>
//     //                                             </motion.div>
//     //                                         ))}
//     //                                     </div>
//     //                                 </div>
//     //                             ))}
//     //                         </div>

//     //                         <button
//     //                             onClick={handlePrevSlide}
//     //                             disabled={currentSlide === 0}
//     //                             className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md transition-colors ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
//     //                         >
//     //                             <svg
//     //                                 xmlns="http://www.w3.org/2000/svg"
//     //                                 className="h-6 w-6"
//     //                                 fill="none"
//     //                                 viewBox="0 0 24 24"
//     //                                 stroke="currentColor"
//     //                             >
//     //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//     //                             </svg>
//     //                         </button>
//     //                         <button
//     //                             onClick={handleNextSlide}
//     //                             disabled={currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1}
//     //                             className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md transition-colors ${currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
//     //                         >
//     //                             <svg
//     //                                 xmlns="http://www.w3.org/2000/svg"
//     //                                 className="h-6 w-6"
//     //                                 fill="none"
//     //                                 viewBox="0 0 24 24"
//     //                                 stroke="currentColor"
//     //                             >
//     //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//     //                             </svg>
//     //                         </button>

//     //                         <div className="flex justify-center mt-2 space-x-2">
//     //                             {chunkArray(displayIndices, cardsPerSlide).map((_, index) => (
//     //                                 <button
//     //                                     key={index}
//     //                                     onClick={() => goToSlide(index)}
//     //                                     className={`h-3 w-3 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
//     //                                     aria-label={`Go to slide ${index + 1}`}
//     //                                 />
//     //                             ))}
//     //                         </div>
//     //                     </div> */}
//     //                     <div className="m-5 relative w-full rounded-xl px-12"> {/* Added px-12 to prevent clipping */}
//     //                         <div
//     //                             className="flex transition-transform duration-300 ease-in-out"
//     //                             style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//     //                         >
//     //                             {chunkArray(displayIndices, cardsPerSlide).map((slideIndices, slideIndex) => (
//     //                                 <div key={slideIndex} className="w-full flex-shrink-0">
//     //                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//     //                                         {slideIndices.map((index, i) => (
//     //                                             <motion.div
//     //                                                 key={index.isViewAll ? 'view-all' : i}
//     //                                                 initial={{ opacity: 0, y: 20 }}
//     //                                                 animate={{ opacity: 1, y: 0 }}
//     //                                                 transition={{ duration: 0.3, delay: (i % cardsPerSlide) * 0.1 }}
//     //                                                 className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${index.isViewAll ? 'border-2 border-blue-500' : ''}`}
//     //                                             >
//     //                                                 <div
//     //                                                     className="h-2 w-full"
//     //                                                     style={{ backgroundColor: index.color || colorPalette[i % colorPalette.length] }}
//     //                                                 ></div>
//     //                                                 <div className="pb-10 p-5">
//     //                                                     <h4 className="text-x pb-6 font-semibold text-gray-900 dark:text-gray-100 mb-4">
//     //                                                         {index.index_name}
//     //                                                     </h4>
//     //                                                     {index.isViewAll ? (
//     //                                                         <div className="text-center p-6">
//     //                                                             <p className="text-gray-600 dark:text-gray-400 mb-4">
//     //                                                                 Explore all {indexNames.length} market indices
//     //                                                             </p>
//     //                                                             <button
//     //                                                                 onClick={handleViewAllIndices}
//     //                                                                 className="p-5 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//     //                                                             >
//     //                                                                 View All Indices
//     //                                                             </button>
//     //                                                         </div>
//     //                                                     ) : (
//     //                                                         <>
//     //                                                             <div className="space-y-3">
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">Market Cap:</span>
//     //                                                                     <span className="font-medium text-gray-900 dark:text-gray-100">
//     //                                                                         {formatNumber(index.free_float_mcap)}
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">1Y Return:</span>
//     //                                                                     <span
//     //                                                                         className={`font-medium ${index.return_1y >= 0
//     //                                                                             ? 'text-green-600 dark:text-green-400'
//     //                                                                             : 'text-red-600 dark:text-red-400'
//     //                                                                             }`}
//     //                                                                     >
//     //                                                                         {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">P/E Ratio:</span>
//     //                                                                     <span className="font-medium text-gray-900 dark:text-gray-100">
//     //                                                                         {formatDecimal(index.pe)}
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">P/B Ratio:</span>
//     //                                                                     <span className="font-medium text-gray-900 dark:text-gray-100">
//     //                                                                         {formatDecimal(index.pb)}
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                                 <div className="flex justify-between">
//     //                                                                     <span className="text-gray-600 dark:text-gray-400">Dividend Yield:</span>
//     //                                                                     <span className="font-medium text-gray-900 dark:text-gray-100">
//     //                                                                         {formatDecimal(index.dividend_yield * 100)}%
//     //                                                                     </span>
//     //                                                                 </div>
//     //                                                             </div>
//     //                                                             <button
//     //                                                                 onClick={() => handleViewDetails(index)}
//     //                                                                 className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//     //                                                             >
//     //                                                                 View Details
//     //                                                             </button>
//     //                                                         </>
//     //                                                     )}
//     //                                                 </div>
//     //                                             </motion.div>
//     //                                         ))}
//     //                                     </div>
//     //                                 </div>
//     //                             ))}
//     //                         </div>

//     //                         <button
//     //                             onClick={handlePrevSlide}
//     //                             disabled={currentSlide === 0}
//     //                             className={`absolute left-[-48px] top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md transition-colors z-10 ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
//     //                         >
//     //                             <svg
//     //                                 xmlns="http://www.w3.org/2000/svg"
//     //                                 className="h-6 w-6"
//     //                                 fill="none"
//     //                                 viewBox="0 0 24 24"
//     //                                 stroke="currentColor"
//     //                             >
//     //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//     //                             </svg>
//     //                         </button>
//     //                         <button
//     //                             onClick={handleNextSlide}
//     //                             disabled={currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1}
//     //                             className={`absolute right-[-48px] top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md transition-colors z-10 ${currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
//     //                         >
//     //                             <svg
//     //                                 xmlns="http://www.w3.org/2000/svg"
//     //                                 className="h-6 w-6"
//     //                                 fill="none"
//     //                                 viewBox="0 0 24 24"
//     //                                 stroke="currentColor"
//     //                             >
//     //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//     //                             </svg>
//     //                         </button>

//     //                         <div className="flex justify-center mt-2 space-x-2">
//     //                             {chunkArray(displayIndices, cardsPerSlide).map((_, index) => (
//     //                                 <button
//     //                                     key={index}
//     //                                     onClick={() => goToSlide(index)}
//     //                                     className={`h-3 w-3 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
//     //                                     aria-label={`Go to slide ${index + 1}`}
//     //                                 />
//     //                             ))}
//     //                         </div>
//     //                     </div>
//     //                 </>
//     //             )}

//     //             <AnimatePresence>
//     //                 {isModalOpen && selectedIndex && (
//     //                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
//     //                         <motion.div
//     //                             initial={{ opacity: 0, scale: 0.9 }}
//     //                             animate={{ opacity: 1, scale: 1 }}
//     //                             exit={{ opacity: 0, scale: 0.9 }}
//     //                             className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
//     //                         >
//     //                             <div
//     //                                 className="h-2 w-full"
//     //                                 style={{ backgroundColor: selectedIndex.color || colorPalette[0] }}
//     //                             ></div>
//     //                             <div className="p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
//     //                                 <div className="flex justify-between items-start">
//     //                                     <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//     //                                         {selectedIndex.index_name} Constituents
//     //                                     </h3>
//     //                                     <button
//     //                                         onClick={closeModal}
//     //                                         className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//     //                                     >
//     //                                         <svg
//     //                                             xmlns="http://www.w3.org/2000/svg"
//     //                                             className="h-6 w-6"
//     //                                             fill="none"
//     //                                             viewBox="0 0 24 24"
//     //                                             stroke="currentColor"
//     //                                         >
//     //                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//     //                                         </svg>
//     //                                     </button>
//     //                                 </div>

//     //                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
//     //                                     <div>
//     //                                         <p className="text-sm text-gray-600 dark:text-gray-400">Market Cap</p>
//     //                                         <p className="font-semibold text-gray-900 dark:text-gray-100">
//     //                                             {formatNumber(selectedIndex.free_float_mcap)}
//     //                                         </p>
//     //                                     </div>
//     //                                     <div>
//     //                                         <p className="text-sm text-gray-600 dark:text-gray-400">P/E Ratio</p>
//     //                                         <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDecimal(selectedIndex.pe)}</p>
//     //                                     </div>
//     //                                     <div>
//     //                                         <p className="text-sm text-gray-600 dark:text-gray-400">P/B Ratio</p>
//     //                                         <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDecimal(selectedIndex.pb)}</p>
//     //                                     </div>
//     //                                     <div>
//     //                                         <p className="text-sm text-gray-600 dark:text-gray-400">Div Yield</p>
//     //                                         <p className="font-semibold text-gray-900 dark:text-gray-100">
//     //                                             {formatDecimal(selectedIndex.dividend_yield * 100)}%
//     //                                         </p>
//     //                                     </div>
//     //                                 </div>

//     //                                 <div className="mb-4">
//     //                                     <input
//     //                                         type="text"
//     //                                         placeholder="Search by symbol or company name..."
//     //                                         value={searchTerm}
//     //                                         onChange={(e) => {
//     //                                             setSearchTerm(e.target.value);
//     //                                             setCurrentPage(1);
//     //                                         }}
//     //                                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//     //                                     />
//     //                                 </div>

//     //                                 <div className="overflow-x-auto">
//     //                                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//     //                                         <thead className="bg-gray-50 dark:bg-gray-700">
//     //                                             <tr>
//     //                                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//     //                                                     Symbol
//     //                                                 </th>
//     //                                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//     //                                                     Company
//     //                                                 </th>
//     //                                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//     //                                                     Price (₹)
//     //                                                 </th>
//     //                                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//     //                                                     P/E
//     //                                                 </th>
//     //                                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//     //                                                     Weight (%)
//     //                                                 </th>
//     //                                             </tr>
//     //                                         </thead>
//     //                                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//     //                                             {currentConstituents.length > 0 ? (
//     //                                                 currentConstituents.map((constituent, idx) => (
//     //                                                     <tr
//     //                                                         key={idx || constituent.Symbol}
//     //                                                         onClick={() => onRowClick(constituent.Symbol)}
//     //                                                         className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
//     //                                                     >
//     //                                                         <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
//     //                                                             {constituent.Symbol}
//     //                                                         </td>
//     //                                                         <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
//     //                                                             {constituent.CompanyName}
//     //                                                         </td>
//     //                                                         <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
//     //                                                             {formatDecimal(constituent.Price)}
//     //                                                         </td>
//     //                                                         <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
//     //                                                             {formatDecimal(constituent.PE)}
//     //                                                         </td>
//     //                                                         <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
//     //                                                             {formatDecimal(constituent.WeightPct)}
//     //                                                         </td>
//     //                                                     </tr>
//     //                                                 ))
//     //                                             ) : (
//     //                                                 <tr>
//     //                                                     <td
//     //                                                         colSpan="5"
//     //                                                         className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
//     //                                                     >
//     //                                                         No constituents found matching your search.
//     //                                                     </td>
//     //                                                 </tr>
//     //                                             )}
//     //                                         </tbody>
//     //                                     </table>
//     //                                 </div>

//     //                                 {filteredConstituents.length > itemsPerPage && (
//     //                                     <div className="flex justify-between items-center mt-4">
//     //                                         <div className="text-sm text-gray-500 dark:text-gray-400">
//     //                                             Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
//     //                                             {Math.min(currentPage * itemsPerPage, filteredConstituents.length)} of{' '}
//     //                                             {filteredConstituents.length} constituents
//     //                                         </div>
//     //                                         <div className="flex space-x-2">
//     //                                             <button
//     //                                                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//     //                                                 disabled={currentPage === 1}
//     //                                                 className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
//     //                                             >
//     //                                                 Previous
//     //                                             </button>
//     //                                             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//     //                                                 let pageNum;
//     //                                                 if (totalPages <= 5) {
//     //                                                     pageNum = i + 1;
//     //                                                 } else if (currentPage <= 3) {
//     //                                                     pageNum = i + 1;
//     //                                                 } else if (currentPage >= totalPages - 2) {
//     //                                                     pageNum = totalPages - 4 + i;
//     //                                                 } else {
//     //                                                     pageNum = currentPage - 2 + i;
//     //                                                 }
//     //                                                 return (
//     //                                                     <button
//     //                                                         key={i}
//     //                                                         onClick={() => setCurrentPage(pageNum)}
//     //                                                         className={`px-3 py-1 rounded-md ${currentPage === pageNum
//     //                                                             ? 'bg-blue-600 text-white'
//     //                                                             : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//     //                                                             }`}
//     //                                                     >
//     //                                                         {pageNum}
//     //                                                     </button>
//     //                                                 );
//     //                                             })}
//     //                                             <button
//     //                                                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//     //                                                 disabled={currentPage === totalPages}
//     //                                                 className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
//     //                                             >
//     //                                                 Next
//     //                                             </button>
//     //                                         </div>
//     //                                     </div>
//     //                                 )}
//     //                             </div>
//     //                         </motion.div>
//     //                     </div>
//     //                 )}
//     //             </AnimatePresence>
//     //         </div>
//     //     </div>
//     // );
//     return (
//         <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
//             <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//                 <div className="pl-2 pr-2 sm:pl-4 sm:pr-4 lg:pl-6 lg:pr-6 max-w-8xl mx-auto">
//                     {/* Enhanced Header - Responsive */}
//                     <div className="text-center mb-8 sm:mb-10 lg:mb-12">
//                         <motion.div
//                             initial={{ opacity: 0, y: -20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6 }}
//                         >
//                             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
//                                 Market Indices Overview
//                             </h1>
//                             <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
//                                 Discover comprehensive performance metrics and insights across major market indices
//                             </p>
//                         </motion.div>
//                     </div>

//                     {loading ? (
//                         <div className="grid grid-cols-1 xs:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
//                             {[...Array(cardsPerSlide)].map((_, i) => (
//                                 <motion.div
//                                     key={i}
//                                     initial={{ opacity: 0, scale: 0.9 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     transition={{ delay: i * 0.1 }}
//                                     className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 h-60 sm:h-72 animate-pulse border border-white/20"
//                                 >
//                                     <div className="h-5 sm:h-7 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 sm:mb-6"></div>
//                                     <div className="space-y-3 sm:space-y-4">
//                                         <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
//                                         <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
//                                         <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
//                                         <div className="h-8 sm:h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl mt-6 sm:mt-8"></div>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </div>
//                     ) : error && indices.length === 0 ? (
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="text-center py-12 sm:py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-red-200 dark:border-red-800 mx-2 sm:mx-0"
//                         >
//                             <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center">
//                                 <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                                 </svg>
//                             </div>
//                             <div className="text-red-600 dark:text-red-400 text-lg sm:text-xl font-semibold mb-3 sm:mb-4 px-4">{error}</div>
//                             <button
//                                 onClick={() => window.location.reload()}
//                                 className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
//                             >
//                                 <div className="flex items-center gap-2">
//                                     <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                     </svg>
//                                     Refresh Data
//                                 </div>
//                             </button>
//                         </motion.div>
//                     ) : (
//                         <>
//                             <div className="relative w-full rounded-2xl sm:rounded-3xl px-2 sm:px-4 lg:px-8 xl:px-12">
//                                 {/* Mobile Cards Layout */}
//                                 {/* <div className="block lg:hidden">
//                                     <div className="space-y-4 sm:space-y-6">
//                                         {displayIndices.map((index, i) => (
//                                             <motion.div
//                                                 key={index.isViewAll ? 'view-all' : i}
//                                                 initial={{ opacity: 0, y: 20 }}
//                                                 animate={{ opacity: 1, y: 0 }}
//                                                 transition={{ duration: 0.4, delay: i * 0.1 }}
//                                                 whileHover={{ y: -4 }}
//                                                 className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 ${index.isViewAll
//                                                     ? 'border-2 border-dashed border-blue-400 dark:border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
//                                                     : ''
//                                                     }`}
//                                             >
//                                                 <div
//                                                     className="h-2 w-full bg-gradient-to-r"
//                                                     style={{
//                                                         background: index.isViewAll
//                                                             ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
//                                                             : `linear-gradient(90deg, ${index.color || colorPalette[i % colorPalette.length]}, ${index.color || colorPalette[(i + 1) % colorPalette.length]}99)`
//                                                     }}
//                                                 ></div>

//                                                 <div className="p-4 sm:p-6">
//                                                     <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2">
//                                                         {index.isViewAll && (
//                                                             <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                             </svg>
//                                                         )}
//                                                         {index.index_name}
//                                                     </h4>

//                                                     {index.isViewAll ? (
//                                                         <div className="text-center py-2 sm:py-4">
//                                                             <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full flex items-center justify-center">
//                                                                 <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                                                 </svg>
//                                                             </div>
//                                                             <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
//                                                                 Explore all {indexNames.length} market indices
//                                                             </p>
//                                                             <button
//                                                                 onClick={handleViewAllIndices}
//                                                                 className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
//                                                             >
//                                                                 View All Indices
//                                                             </button>
//                                                         </div>
//                                                     ) : (
//                                                         <>
//                                                             <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
//                                                                 {/* Market Cap 
//                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
//                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Market Cap</span>
//                                                                     <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base block truncate">
//                                                                         {formatNumber(index.free_float_mcap)}
//                                                                     </span>
//                                                                 </div>

//                                                                 {/* 1Y Return 
//                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
//                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">1Y Return</span>
//                                                                     <span
//                                                                         className={`font-bold text-sm sm:text-base block ${index.return_1y >= 0
//                                                                             ? 'text-green-600 dark:text-green-400'
//                                                                             : 'text-red-600 dark:text-red-400'
//                                                                             }`}
//                                                                     >
//                                                                         {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
//                                                                     </span>
//                                                                 </div>

//                                                                 {/* P/E Ratio 
//                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
//                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">P/E Ratio</span>
//                                                                     <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
//                                                                         {formatDecimal(index.pe)}
//                                                                     </span>
//                                                                 </div>

//                                                                 {/* P/B Ratio 
//                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
//                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">P/B Ratio</span>
//                                                                     <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
//                                                                         {formatDecimal(index.pb)}
//                                                                     </span>
//                                                                 </div>
//                                                             </div>

//                                                             <button
//                                                                 onClick={() => handleViewDetails(index)}
//                                                                 className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
//                                                             >
//                                                                 <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                                 </svg>
//                                                                 View Details
//                                                             </button>
//                                                         </>
//                                                     )}
//                                                 </div>
//                                             </motion.div>
//                                         ))}
//                                     </div>
//                                 </div> */}

//                                 {/* Mobile & Tablet Carousel Layout */}
//                                 <div className="block lg:hidden">
//                                     <div className="relative w-full rounded-2xl overflow-hidden">
//                                         <div
//                                             className="flex transition-transform duration-500 ease-out"
//                                             style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                                         >
//                                             {chunkArray(displayIndices, 1).map((slideIndices, slideIndex) => ( // Changed to 1 card per slide
//                                                 <div key={slideIndex} className="w-full flex-shrink-0 px-2"> {/* Added px-2 for spacing */}
//                                                     <div className="grid grid-cols-1 gap-4"> {/* Single column */}
//                                                         {slideIndices.map((index, i) => (
//                                                             <motion.div
//                                                                 key={index.isViewAll ? 'view-all' : i}
//                                                                 initial={{ opacity: 0, y: 20 }}
//                                                                 animate={{ opacity: 1, y: 0 }}
//                                                                 transition={{ duration: 0.4, delay: i * 0.1 }}
//                                                                 whileHover={{ y: -4 }}
//                                                                 className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 ${index.isViewAll
//                                                                     ? 'border-2 border-dashed border-blue-400 dark:border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
//                                                                     : ''
//                                                                     }`}
//                                                             >
//                                                                 <div
//                                                                     className="h-2 w-full bg-gradient-to-r"
//                                                                     style={{
//                                                                         background: index.isViewAll
//                                                                             ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
//                                                                             : `linear-gradient(90deg, ${index.color || colorPalette[i % colorPalette.length]}, ${index.color || colorPalette[(i + 1) % colorPalette.length]}99)`
//                                                                     }}
//                                                                 ></div>

//                                                                 <div className="p-4 sm:p-6">
//                                                                     <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
//                                                                         {index.isViewAll && (
//                                                                             <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                                             </svg>
//                                                                         )}
//                                                                         {index.index_name}
//                                                                     </h4>

//                                                                     {index.isViewAll ? (
//                                                                         <div className="text-center py-4">
//                                                                             <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                                                                                 <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                                                                 </svg>
//                                                                             </div>
//                                                                             <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
//                                                                                 Explore all {indexNames.length} market indices
//                                                                             </p>
//                                                                             <button
//                                                                                 onClick={handleViewAllIndices}
//                                                                                 className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
//                                                                             >
//                                                                                 View All Indices
//                                                                             </button>
//                                                                         </div>
//                                                                     ) : (
//                                                                         <>
//                                                                             <div className="grid grid-cols-2 gap-3 mb-4">
//                                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3">
//                                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Market Cap</span>
//                                                                                     <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
//                                                                                         {formatNumber(index.free_float_mcap)}
//                                                                                     </span>
//                                                                                 </div>
//                                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3">
//                                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">1Y Return</span>
//                                                                                     <span className={`font-bold text-sm sm:text-base ${index.return_1y >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
//                                                                                         }`}>
//                                                                                         {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
//                                                                                     </span>
//                                                                                 </div>
//                                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3">
//                                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">P/E Ratio</span>
//                                                                                     <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
//                                                                                         {formatDecimal(index.pe)}
//                                                                                     </span>
//                                                                                 </div>
//                                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3">
//                                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">P/B Ratio</span>
//                                                                                     <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
//                                                                                         {formatDecimal(index.pb)}
//                                                                                     </span>
//                                                                                 </div>
//                                                                             </div>

//                                                                             <button
//                                                                                 onClick={() => handleViewDetails(index)}
//                                                                                 className="w-full px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-lg hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
//                                                                             >
//                                                                                 <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                                                 </svg>
//                                                                                 View Details
//                                                                             </button>
//                                                                         </>
//                                                                     )}
//                                                                 </div>
//                                                             </motion.div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Mobile Navigation Buttons */}
//                                         <button
//                                             onClick={handlePrevSlide}
//                                             disabled={currentSlide === 0}
//                                             className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-xl transition-all duration-300 z-10 border border-gray-200 dark:border-gray-600 ${currentSlide === 0
//                                                 ? 'opacity-30 cursor-not-allowed'
//                                                 : 'hover:bg-white hover:scale-110 dark:hover:bg-gray-700'
//                                                 }`}
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-4 w-4 text-gray-700 dark:text-gray-300"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                             </svg>
//                                         </button>
//                                         <button
//                                             onClick={handleNextSlide}
//                                             disabled={currentSlide === chunkArray(displayIndices, 1).length - 1} // Changed to 1
//                                             className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-xl transition-all duration-300 z-10 border border-gray-200 dark:border-gray-600 ${currentSlide === chunkArray(displayIndices, 1).length - 1 // Changed to 1
//                                                 ? 'opacity-30 cursor-not-allowed'
//                                                 : 'hover:bg-white hover:scale-110 dark:hover:bg-gray-700'
//                                                 }`}
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-4 w-4 text-gray-700 dark:text-gray-300"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                             </svg>
//                                         </button>

//                                         {/* Mobile Pagination Dots */}
//                                         <div className="flex justify-center mt-4 space-x-2">
//                                             {chunkArray(displayIndices, 1).map((_, index) => ( // Changed to 1
//                                                 <button
//                                                     key={index}
//                                                     onClick={() => goToSlide(index)}
//                                                     className={`relative transition-all duration-300 ${currentSlide === index
//                                                         ? 'w-6 bg-gradient-to-r from-blue-500 to-purple-600'
//                                                         : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
//                                                         } h-2 rounded-full`}
//                                                     aria-label={`Go to slide ${index + 1}`}
//                                                 />
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* Desktop Carousel Layout */}
//                                 <div className="hidden lg:block">
//                                     <div
//                                         className="flex transition-transform duration-500 ease-out"
//                                         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                                     >
//                                         {chunkArray(displayIndices, cardsPerSlide).map((slideIndices, slideIndex) => (
//                                             <div key={slideIndex} className="w-full flex-shrink-0">
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ">
//                                                     {slideIndices.map((index, i) => (
//                                                         <motion.div
//                                                             key={index.isViewAll ? 'view-all' : i}
//                                                             initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                                                             animate={{ opacity: 1, y: 0, scale: 1 }}
//                                                             transition={{
//                                                                 duration: 0.5,
//                                                                 delay: (i % cardsPerSlide) * 0.1,
//                                                                 type: "spring",
//                                                                 stiffness: 100
//                                                             }}
//                                                             whileHover={{
//                                                                 y: -8,
//                                                                 scale: 1.02,
//                                                                 transition: { duration: 0.2 }
//                                                             }}
//                                                             className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 ${index.isViewAll
//                                                                 ? 'border-2 border-dashed border-blue-400 dark:border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
//                                                                 : ''
//                                                                 }`}
//                                                         >
//                                                             <div
//                                                                 className="h-2 w-full bg-gradient-to-r"
//                                                                 style={{
//                                                                     background: index.isViewAll
//                                                                         ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
//                                                                         : `linear-gradient(90deg, ${index.color || colorPalette[i % colorPalette.length]}, ${index.color || colorPalette[(i + 1) % colorPalette.length]}99)`
//                                                                 }}
//                                                             ></div>

//                                                             <div className="p-6 pb-8">
//                                                                 <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100  flex items-center gap-2">
//                                                                     {index.isViewAll && (
//                                                                         <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                                         </svg>
//                                                                     )}
//                                                                     {index.index_name}
//                                                                 </h4>

//                                                                 {index.isViewAll ? (
//                                                                     <div className="text-center py-4">
//                                                                         <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full flex items-center justify-center">
//                                                                             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                                                             </svg>
//                                                                         </div>
//                                                                         <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
//                                                                             Explore all {indexNames.length} market indices
//                                                                         </p>
//                                                                         <button
//                                                                             onClick={handleViewAllIndices}
//                                                                             className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
//                                                                         >
//                                                                             View All Indices
//                                                                         </button>
//                                                                     </div>
//                                                                 ) : (
//                                                                     <>
//                                                                         <div className="space-y-4 mb-6">
//                                                                             {/* Market Cap */}
//                                                                             <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
//                                                                                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Cap</span>
//                                                                                 <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">
//                                                                                     {formatNumber(index.free_float_mcap)}
//                                                                                 </span>
//                                                                             </div>

//                                                                             {/* 1Y Return */}
//                                                                             <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
//                                                                                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">1Y Return</span>
//                                                                                 <span
//                                                                                     className={`font-bold text-lg ${index.return_1y >= 0
//                                                                                         ? 'text-green-600 dark:text-green-400'
//                                                                                         : 'text-red-600 dark:text-red-400'
//                                                                                         }`}
//                                                                                 >
//                                                                                     {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
//                                                                                 </span>
//                                                                             </div>

//                                                                             {/* P/E Ratio */}
//                                                                             <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
//                                                                                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">P/E Ratio</span>
//                                                                                 <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">
//                                                                                     {formatDecimal(index.pe)}
//                                                                                 </span>
//                                                                             </div>

//                                                                             {/* P/B Ratio */}
//                                                                             <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
//                                                                                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">P/B Ratio</span>
//                                                                                 <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">
//                                                                                     {formatDecimal(index.pb)}
//                                                                                 </span>
//                                                                             </div>
//                                                                         </div>

//                                                                         <button
//                                                                             onClick={() => handleViewDetails(index)}
//                                                                             className="w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2"
//                                                                         >
//                                                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                                             </svg>
//                                                                             View Details
//                                                                         </button>
//                                                                     </>
//                                                                 )}
//                                                             </div>
//                                                         </motion.div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Desktop Navigation Buttons */}
//                                     <button
//                                         onClick={handlePrevSlide}
//                                         disabled={currentSlide === 0}
//                                         className={`absolute left-[-52px] top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 shadow-2xl transition-all duration-300 z-10 border border-gray-200 dark:border-gray-600 ${currentSlide === 0
//                                             ? 'opacity-30 cursor-not-allowed'
//                                             : 'hover:bg-white hover:scale-110 hover:shadow-2xl dark:hover:bg-gray-700'
//                                             }`}
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-6 w-6 text-gray-700 dark:text-gray-300"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                         </svg>
//                                     </button>
//                                     <button
//                                         onClick={handleNextSlide}
//                                         disabled={currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1}
//                                         className={`absolute right-[-52px] top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 shadow-2xl transition-all duration-300 z-10 border border-gray-200 dark:border-gray-600 ${currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1
//                                             ? 'opacity-30 cursor-not-allowed'
//                                             : 'hover:bg-white hover:scale-110 hover:shadow-2xl dark:hover:bg-gray-700'
//                                             }`}
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-6 w-6 text-gray-700 dark:text-gray-300"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                         </svg>
//                                     </button>

//                                     {/* Desktop Pagination Dots */}
//                                     <div className="flex justify-center mt-6 lg:mt-8 space-x-2 lg:space-x-3">
//                                         {chunkArray(displayIndices, cardsPerSlide).map((_, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => goToSlide(index)}
//                                                 className={`relative transition-all duration-300 ${currentSlide === index
//                                                     ? 'w-6 lg:w-8 bg-gradient-to-r from-blue-500 to-sky-600'
//                                                     : 'w-2 lg:w-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
//                                                     } h-2 lg:h-3 rounded-full`}
//                                                 aria-label={`Go to slide ${index + 1}`}
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     {/* Enhanced Modal - Responsive */}
//                     <AnimatePresence>
//                         {isModalOpen && selectedIndex && (
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
//                             >
//                                 <motion.div
//                                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                                     exit={{ opacity: 0, scale: 0.9, y: 20 }}
//                                     className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-4xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20 mx-2 sm:mx-0"
//                                 >
//                                     {/* Modal Header Gradient */}
//                                     <div
//                                         className="h-2 w-full bg-gradient-to-r"
//                                         style={{
//                                             background: `linear-gradient(90deg, ${selectedIndex.color || colorPalette[0]}, ${selectedIndex.color || colorPalette[1]}99)`
//                                         }}
//                                     ></div>

//                                     <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-2rem)] sm:max-h-[calc(90vh-2rem)]">
//                                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
//                                             <div className="flex-1">
//                                                 <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-gray-100 dark:to-blue-400 bg-clip-text text-transparent">
//                                                     {selectedIndex.index_name} Constituents
//                                                 </h3>
//                                                 <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
//                                                     Detailed breakdown of index components and performance metrics
//                                                 </p>
//                                             </div>
//                                             <button
//                                                 onClick={closeModal}
//                                                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg sm:rounded-xl transition-colors duration-200 group self-start sm:self-auto"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                     stroke="currentColor"
//                                                 >
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                                 </svg>
//                                             </button>
//                                         </div>

//                                         {/* Enhanced Stats Grid - Responsive */}
//                                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 border border-gray-200 dark:border-gray-600">
//                                             {[
//                                                 { label: 'Market Cap', value: formatNumber(selectedIndex.free_float_mcap) },
//                                                 { label: 'P/E Ratio', value: formatDecimal(selectedIndex.pe) },
//                                                 { label: 'P/B Ratio', value: formatDecimal(selectedIndex.pb) },
//                                                 { label: 'Div Yield', value: `${formatDecimal(selectedIndex.dividend_yield * 100)}%` }
//                                             ].map((stat, index) => (
//                                                 <div key={index} className="text-center">
//                                                     <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">{stat.label}</p>
//                                                     <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
//                                                         {stat.value}
//                                                     </p>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Enhanced Search */}
//                                         <div className="relative mb-4 sm:mb-6">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                 <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                 </svg>
//                                             </div>
//                                             <input
//                                                 type="text"
//                                                 placeholder="Search by symbol or company name..."
//                                                 value={searchTerm}
//                                                 onChange={(e) => {
//                                                     setSearchTerm(e.target.value);
//                                                     setCurrentPage(1);
//                                                 }}
//                                                 className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                             />
//                                         </div>

//                                         {/* Enhanced Table - Responsive */}
//                                         <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
//                                             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                                                 <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
//                                                     <tr>
//                                                         {['Symbol', 'Company', 'Price (₹)', 'P/E', 'Weight (%)'].map((header, index) => (
//                                                             <th
//                                                                 key={header}
//                                                                 className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
//                                                             >
//                                                                 {header}
//                                                             </th>
//                                                         ))}
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                                                     {currentConstituents.length > 0 ? (
//                                                         currentConstituents.map((constituent, idx) => (
//                                                             <motion.tr
//                                                                 key={idx || constituent.Symbol}
//                                                                 initial={{ opacity: 0 }}
//                                                                 animate={{ opacity: 1 }}
//                                                                 transition={{ delay: idx * 0.05 }}
//                                                                 onClick={() => onRowClick(constituent.Symbol)}
//                                                                 className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 cursor-pointer transition-all duration-200 group"
//                                                             >
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                                                                         {constituent.Symbol}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
//                                                                         {constituent.CompanyName}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
//                                                                         {formatNumber(constituent.Price)}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">
//                                                                         {formatDecimal(constituent.PE)}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
//                                                                         {formatDecimal(constituent.WeightPct)}
//                                                                     </div>
//                                                                 </td>
//                                                             </motion.tr>
//                                                         ))
//                                                     ) : (
//                                                         <tr>
//                                                             <td colSpan="5" className="px-3 sm:px-6 py-6 sm:py-8 text-center">
//                                                                 <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
//                                                                     <svg className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                                     </svg>
//                                                                     <p className="text-sm sm:text-lg font-medium">No constituents found</p>
//                                                                     <p className="text-xs sm:text-sm">Try adjusting your search terms</p>
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     )}
//                                                 </tbody>
//                                             </table>
//                                         </div>

//                                         {/* Enhanced Pagination - Responsive */}
//                                         {filteredConstituents.length > itemsPerPage && (
//                                             <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-3 sm:gap-4">
//                                                 <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium text-center sm:text-left">
//                                                     Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
//                                                     {Math.min(currentPage * itemsPerPage, filteredConstituents.length)} of{' '}
//                                                     {filteredConstituents.length} constituents
//                                                 </div>
//                                                 <div className="flex items-center gap-1 sm:gap-2">
//                                                     <button
//                                                         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                                                         disabled={currentPage === 1}
//                                                         className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                                                     >
//                                                         <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                                         </svg>
//                                                         <span className="hidden sm:inline">Previous</span>
//                                                     </button>

//                                                     <div className="flex gap-1">
//                                                         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                                                             let pageNum;
//                                                             if (totalPages <= 5) {
//                                                                 pageNum = i + 1;
//                                                             } else if (currentPage <= 3) {
//                                                                 pageNum = i + 1;
//                                                             } else if (currentPage >= totalPages - 2) {
//                                                                 pageNum = totalPages - 4 + i;
//                                                             } else {
//                                                                 pageNum = currentPage - 2 + i;
//                                                             }
//                                                             return (
//                                                                 <button
//                                                                     key={i}
//                                                                     onClick={() => setCurrentPage(pageNum)}
//                                                                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${currentPage === pageNum
//                                                                         ? 'bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-lg'
//                                                                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
//                                                                         }`}
//                                                                 >
//                                                                     {pageNum}
//                                                                 </button>
//                                                             );
//                                                         })}
//                                                     </div>

//                                                     <button
//                                                         onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                                                         disabled={currentPage === totalPages}
//                                                         className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                                                     >
//                                                         <span className="hidden sm:inline">Next</span>
//                                                         <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                                         </svg>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </motion.div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MarketIndices;


// -------------------30/09/2025--------------------




// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const MarketIndices = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     const [indices, setIndices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedIndex, setSelectedIndex] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDark, setIsDark] = useState(false);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [showAllIndices, setShowAllIndices] = useState(false);
//     const navigate = useNavigate();
//     const [searchParams, setSearchParams] = useSearchParams();
//     const selectedSymbol = searchParams.get('symbol');
//     const itemsPerPage = 10;
//     const cardsPerSlide = 4;

//     const indexNames = [...new Set([
//         "NIFTY 50",
//         "NIFTY NEXT 50",
//         "NIFTY BANK",
//         "NIFTY MIDCAP 100",
//         "NIFTY SMALLCAP 250",
//         "NIFTY ALPHA 50",
//         "NIFTY100 QUALITY 30",
//         "NIFTY 50 VALUE 20",
//         "NIFTY 100 LOW VOLATILITY 30",
//         "NIFTY CPSE",
//         "NIFTY ENERGY",
//         "NIFTY COMMODITIES",
//         "NIFTY SMALLCAP250 MOMENTUM QUALITY 100",
//         "NIFTY200 ALPHA 30",
//         "NIFTY MICROCAP 250",
//         "NIFTY MIDCAP 150",
//         "NIFTY AUTO",
//         "NIFTY MEDIA",
//         "NIFTY MIDCAP LIQUID 15",
//         "NIFTY PRIVATE BANK",
//         "NIFTY HEALTHCARE INDEX",
//         "NIFTY INDIA CORPORATE GROUP INDEX - TATA GROUP 25% CAP",
//         "NIFTY 200",
//         "NIFTY MIDSMALLCAP400 MOMENTUM QUALITY 100",
//         "NIFTY CAPITAL MARKETS",
//         "NIFTY LARGEMIDCAP 250",
//         "NIFTY MIDSMALLCAP 400",
//         "NIFTY 100",
//         "NIFTY SMALLCAP 50",
//         "NIFTY500 MOMENTUM 50",
//         "NIFTY SMALLCAP 100",
//         "NIFTY INDIA DEFENCE",
//         "NIFTY PSE",
//         "NIFTY GROWTH SECTORS 15",
//         "NIFTY100 EQUAL WEIGHT",
//         "NIFTY INDIA CONSUMPTION",
//         "NIFTY SERVICES SECTOR",
//         "NIFTY100 LIQUID 15",
//         "NIFTY MNC",
//         "NIFTY DIVIDEND OPPORTUNITIES 50",
//         "NIFTY MIDCAP 50",
//         "NIFTY500 MULTICAP 50 3A25 3A25",
//         "NIFTY TOP 10 EQUAL WEIGHT",
//         "NIFTY CONSUMER DURABLES",
//         "NIFTY FINANCIAL SERVICES 25 2F50",
//         "NIFTY TOTAL MARKET",
//         "NIFTY50 EQUAL WEIGHT",
//         "NIFTY REALTY",
//         "NIFTY 500",
//         "NIFTY INDIA MANUFACTURING",
//         "NIFTY MIDCAP150 QUALITY 50",
//         "NIFTYINFRASTRUCTURE",
//         "NIFTY200 QUALITY 30",
//         "NIFTY PHARMA",
//         "NIFTY INDIA DIGITAL",
//         "NIFTY200 MOMENTUM 30",
//         "NIFTY FINANCIAL SERVICES",
//         "NIFTY500 MULTICAP INFRASTRUCTURE 50 3A30 3A20",
//         "NIFTY PSU BANK",
//         "NIFTY OIL & GAS",
//         "NIFTY MIDCAP150 MOMENTUM 50",
//         "NIFTY MIDSMALL HEALTHCARE",
//         "NIFTY ALPHA LOW-VOLATILITY 30",
//         "NIFTY IT",
//         "NIFTY INDIA TOURISM",
//         "NIFTY MIDCAP SELECT",
//         "NIFTY FMCG",
//         "NIFTY METAL",
//     ])];

//     const colorPalette = [
//         'rgba(31, 119, 180, 0.8)', 'rgba(255, 127, 14, 0.8)', 'rgba(13, 84, 105, 0.8)',
//         'rgba(214, 39, 40, 0.8)', 'rgba(148, 103, 189, 0.8)', 'rgba(23, 190, 207, 0.8)',
//         'rgba(227, 119, 194, 0.8)', 'rgba(188, 189, 34, 0.8)', 'rgba(127, 127, 127, 0.8)',
//         'rgba(70, 130, 180, 0.8)',
//     ];

//     const removeSymbolFromURL = () => {
//         searchParams.delete('symbol');
//         setSearchParams(searchParams);
//     };

//     const onRowClick = (symbol) => {
//         if (symbol) {
//             navigate(`/equityhub?symbol=${encodeURIComponent(symbol)}`);
//         }
//     };

//     const formatDecimal = (num) => {
//         if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//         return Math.round(num * 100) / 100;
//     };

//     const formatNumber = useCallback((num) => {
//         if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
//         const absNum = Math.abs(num);
//         const sign = num < 0 ? '-' : '';
//         if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: absNum % 1 === 0 ? 0 : 2 })}cr`;
//         if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: absNum % 1 === 0 ? 0 : 2 })}L`;
//         return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//     }, []);

//     useEffect(() => {
//         const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//         setIsDark(mediaQuery.matches);
//         const handleChange = (e) => setIsDark(e.matches);
//         mediaQuery.addEventListener('change', handleChange);
//         return () => mediaQuery.removeEventListener('change', handleChange);
//     }, []);

//     useEffect(() => {
//         const controller = new AbortController();
//         const cacheDuration = 60 * 60 * 1000; // 1 hour

//         const fetchIndices = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 const cachedData = localStorage.getItem('indicesData');
//                 const cacheTimestamp = localStorage.getItem('indicesDataTimestamp');
//                 let validIndices = [];

//                 if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//                     validIndices = JSON.parse(cachedData).filter(
//                         (index) => index?.index_name && Number.isFinite(index.free_float_mcap) && Number.isFinite(index.pe)
//                     );
//                     console.log('Using cached data:', validIndices);
//                 } else {
//                     for (let i = 0; i < indexNames.length; i++) {
//                         try {
//                             const indexResponse = await axios.get(`${API_BASE}/indices`, {
//                                 params: { name: indexNames[i] },
//                                 signal: controller.signal,
//                             });
//                             console.log(`Response for ${indexNames[i]}:`, indexResponse.data);

//                             if (indexResponse.data.status === 'success') {
//                                 const indexData = indexResponse.data.data;
//                                 if (indexData && indexData.index_name && Number.isFinite(indexData.free_float_mcap) && Number.isFinite(indexData.pe)) {
//                                     validIndices.push({
//                                         ...indexData,
//                                         requestedName: indexNames[i],
//                                         color: colorPalette[i % colorPalette.length],
//                                         highlightColor: colorPalette[i % colorPalette.length].replace('0.8)', '1)'),
//                                     });
//                                 } else {
//                                     console.warn(`Invalid data for ${indexNames[i]}:`, indexData);
//                                 }
//                             } else {
//                                 console.warn(`API error for ${indexNames[i]}:`, indexResponse.data);
//                             }
//                         } catch (e) {
//                             console.error(`Error fetching data for ${indexNames[i]}:`, e.response?.data || e.message);
//                             continue;
//                         }
//                     }

//                     if (validIndices.length > 0) {
//                         localStorage.setItem('indicesData', JSON.stringify(validIndices));
//                         localStorage.setItem('indicesDataTimestamp', Date.now().toString());
//                     }
//                 }

//                 if (validIndices.length === 0) {
//                     setError('No valid index data available. Please verify the index names or API response.');
//                     setIndices([]);
//                 } else {
//                     setIndices(validIndices);
//                 }
//                 setLoading(false);
//             } catch (error) {
//                 if (error.name === 'AbortError') return;
//                 setError('Failed to fetch index data. Please check the network, CORS settings, or API base URL.');
//                 console.error('Error fetching index data:', error);
//                 setIndices([]);
//                 setLoading(false);
//             }
//         };

//         fetchIndices();

//         return () => controller.abort();
//     }, [API_BASE]);

//     const handleViewDetails = (index) => {
//         setSelectedIndex(index);
//         setIsModalOpen(true);
//         setSearchTerm('');
//         setCurrentPage(1);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedIndex(null);
//         setSearchTerm('');
//         setCurrentPage(1);
//     };

//     const handleViewAllIndices = () => {
//         setShowAllIndices(true);
//         setCurrentSlide(0);
//     };

//     const chunkArray = (array, size) => {
//         const result = [];
//         for (let i = 0; i < array.length; i += size) {
//             result.push(array.slice(i, i + size));
//         }
//         return result;
//     };

//     const filteredConstituents = selectedIndex?.constituents?.filter(
//         (constituent) =>
//             constituent.Symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             constituent.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())
//     ) || [];

//     const totalPages = Math.ceil(filteredConstituents.length / itemsPerPage);
//     const currentConstituents = filteredConstituents.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     const handlePrevSlide = () => {
//         setCurrentSlide((prev) => (prev === 0 ? chunkArray(displayIndices, cardsPerSlide).length - 1 : prev - 1));
//     };

//     const handleNextSlide = () => {
//         setCurrentSlide((prev) => (prev === chunkArray(displayIndices, cardsPerSlide).length - 1 ? 0 : prev + 1));
//     };

//     const goToSlide = (index) => {
//         setCurrentSlide(index);
//     };

//     const viewAllCard = {
//         index_name: 'View All Indices',
//         isViewAll: true,
//         color: 'rgba(100, 100, 100, 0.8)',
//         highlightColor: 'rgba(100, 100, 100, 1)',
//     };
//     const displayIndices = showAllIndices ? indices : [...indices.slice(0, 10), viewAllCard];

//     return (
//         <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
//             <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
//                 <div className="pl-2 pr-2 sm:pl-4 sm:pr-4 lg:pl-6 lg:pr-6 max-w-8xl mx-auto">
//                     {/* Header */}
//                     <div className="text-center mb-8 sm:mb-10 lg:mb-12">
//                         <motion.div
//                             initial={{ opacity: 0, y: -20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6 }}
//                         >
//                             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
//                                 Market Indices Overview
//                             </h1>
//                             <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
//                                 Discover comprehensive performance metrics and insights across major market indices
//                             </p>
//                         </motion.div>
//                     </div>

//                     {loading ? (
//                         <div className="grid grid-cols-1 xs:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
//                             {[...Array(cardsPerSlide)].map((_, i) => (
//                                 <motion.div
//                                     key={i}
//                                     initial={{ opacity: 0, scale: 0.9 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     transition={{ delay: i * 0.1 }}
//                                     className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 h-60 sm:h-72 animate-pulse border border-white/20"
//                                 >
//                                     <div className="h-5 sm:h-7 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 sm:mb-6"></div>
//                                     <div className="space-y-3 sm:space-y-4">
//                                         <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
//                                         <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
//                                         <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
//                                         <div className="h-8 sm:h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl mt-6 sm:mt-8"></div>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </div>
//                     ) : error && indices.length === 0 ? (
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="text-center py-12 sm:py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-red-200 dark:border-red-800 mx-2 sm:mx-0"
//                         >
//                             <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center">
//                                 <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                                 </svg>
//                             </div>
//                             <div className="text-red-600 dark:text-red-400 text-lg sm:text-xl font-semibold mb-3 sm:mb-4 px-4">{error}</div>
//                             <button
//                                 onClick={() => window.location.reload()}
//                                 className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
//                             >
//                                 <div className="flex items-center gap-2">
//                                     <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                     </svg>
//                                     Refresh Data
//                                 </div>
//                             </button>
//                         </motion.div>
//                     ) : (
//                         <>
//                             <div className="relative w-full max-w-full overflow-x-hidden rounded-lg px-0">
//                                 {/* Mobile & Tablet Carousel */}
//                                 <div className="block lg:hidden">
//                                     <div className="relative w-full max-w-full overflow-x-hidden rounded-lg">
//                                         <div
//                                             className="flex transition-transform duration-500 ease-out"
//                                             style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                                         >
//                                             {chunkArray(displayIndices, 1).map((slideIndices, slideIndex) => (
//                                                 <div key={slideIndex} className="w-full flex-shrink-0">
//                                                     <div className="grid grid-cols-1 gap-3 px-2">
//                                                         {slideIndices.map((index, i) => (
//                                                             <motion.div
//                                                                 key={index.isViewAll ? 'view-all' : i}
//                                                                 initial={{ opacity: 0, y: 20 }}
//                                                                 animate={{ opacity: 1, y: 0 }}
//                                                                 transition={{ duration: 0.4, delay: i * 0.1 }}
//                                                                 className={`bg-white dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${index.isViewAll ? 'border border-blue-300 dark:border-blue-600' : ''
//                                                                     }`}
//                                                             >
//                                                                 <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
//                                                                     {index.isViewAll && (
//                                                                         <svg className="w-4 h-4 inline-block mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                                         </svg>
//                                                                     )}
//                                                                     {index.index_name}
//                                                                 </h4>

//                                                                 {index.isViewAll ? (
//                                                                     <div className="text-center py-3">
//                                                                         <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
//                                                                             Explore all {indexNames.length} market indices
//                                                                         </p>
//                                                                         <button
//                                                                             onClick={handleViewAllIndices}
//                                                                             className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
//                                                                         >
//                                                                             View All Indices
//                                                                         </button>
//                                                                     </div>
//                                                                 ) : (
//                                                                     <>
//                                                                         <div className="grid grid-cols-2 gap-2 mb-3">
//                                                                             <div>
//                                                                                 <span className="text-xs text-gray-600 dark:text-gray-400 block">Market Cap</span>
//                                                                                 <span className="text-base text-gray-900 dark:text-gray-100">
//                                                                                     {formatNumber(index.free_float_mcap)}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div>
//                                                                                 <span className="text-xs text-gray-600 dark:text-gray-400 block">1Y Return</span>
//                                                                                 <span
//                                                                                     className={`text-base ${index.return_1y >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
//                                                                                         }`}
//                                                                                 >
//                                                                                     {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div>
//                                                                                 <span className="text-xs text-gray-600 dark:text-gray-400 block">P/E Ratio</span>
//                                                                                 <span className="text-base text-gray-900 dark:text-gray-100">
//                                                                                     {formatDecimal(index.pe)}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div>
//                                                                                 <span className="text-xs text-gray-600 dark:text-gray-400 block">P/B Ratio</span>
//                                                                                 <span className="text-base text-gray-900 dark:text-gray-100">
//                                                                                     {formatDecimal(index.pb)}
//                                                                                 </span>
//                                                                             </div>
//                                                                         </div>

//                                                                         <button
//                                                                             onClick={() => handleViewDetails(index)}
//                                                                             className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
//                                                                         >
//                                                                             View Details
//                                                                         </button>
//                                                                     </>
//                                                                 )}
//                                                             </motion.div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Mobile Navigation Buttons */}
//                                         <button
//                                             onClick={handlePrevSlide}
//                                             disabled={currentSlide === 0}
//                                             className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 transition-colors duration-200 ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                                                 }`}
//                                         >
//                                             <svg className="h-4 w-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                             </svg>
//                                         </button>
//                                         <button
//                                             onClick={handleNextSlide}
//                                             disabled={currentSlide === chunkArray(displayIndices, 1).length - 1}
//                                             className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 transition-colors duration-200 ${currentSlide === chunkArray(displayIndices, 1).length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                                                 }`}
//                                         >
//                                             <svg className="h-4 w-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                             </svg>
//                                         </button>

//                                         {/* Mobile Pagination Dots */}
//                                         <div className="flex justify-center mt-3 space-x-2">
//                                             {chunkArray(displayIndices, 1).map((_, index) => (
//                                                 <button
//                                                     key={index}
//                                                     onClick={() => goToSlide(index)}
//                                                     className={`w-2 h-2 rounded-full transition-colors duration-200 ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
//                                                         }`}
//                                                     aria-label={`Go to slide ${index + 1}`}
//                                                 />
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* Desktop Carousel */}
//                                 <div className="hidden lg:block">
//                                     <div className="relative w-full max-w-full overflow-x-hidden rounded-lg">
//                                         <div
//                                             className="flex transition-transform duration-500 ease-out"
//                                             style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                                         >
//                                             {chunkArray(displayIndices, cardsPerSlide).map((slideIndices, slideIndex) => (
//                                                 <div key={slideIndex} className="w-full flex-shrink-0">
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 px-2">
//                                                         {slideIndices.map((index, i) => (
//                                                             <motion.div
//                                                                 key={index.isViewAll ? 'view-all' : i}
//                                                                 initial={{ opacity: 0, y: 20 }}
//                                                                 animate={{ opacity: 1, y: 0 }}
//                                                                 transition={{ duration: 0.4, delay: (i % cardsPerSlide) * 0.1 }}
//                                                                 className={`bg-white dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${index.isViewAll ? 'border border-blue-300 dark:border-blue-600' : ''
//                                                                     }`}
//                                                             >
//                                                                 <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
//                                                                     {index.isViewAll && (
//                                                                         <svg className="w-4 h-4 inline-block mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                                         </svg>
//                                                                     )}
//                                                                     {index.index_name}
//                                                                 </h4>

//                                                                 {index.isViewAll ? (
//                                                                     <div className="text-center py-3">
//                                                                         <p className="text-gray-600 dark:text-gray-400 mb-3 text-base">
//                                                                             Explore all {indexNames.length} market indices
//                                                                         </p>
//                                                                         <button
//                                                                             onClick={handleViewAllIndices}
//                                                                             className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-base"
//                                                                         >
//                                                                             View All Indices
//                                                                         </button>
//                                                                     </div>
//                                                                 ) : (
//                                                                     <>
//                                                                         <div className="space-y-2 mb-3">
//                                                                             <div className="flex justify-between">
//                                                                                 <span className="text-xs text-gray-600 dark:text-gray-400">Market Cap</span>
//                                                                                 <span className="text-base text-gray-900 dark:text-gray-100">
//                                                                                     {formatNumber(index.free_float_mcap)}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div className="flex justify-between">
//                                                                                 <span className="text-xs text-gray-600 dark:text-gray-400">1Y Return</span>
//                                                                                 <span
//                                                                                     className={`text-base ${index.return_1y >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
//                                                                                         }`}
//                                                                                 >
//                                                                                     {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div className="flex justify-between">
//                                                                                 <span className="text-xs text-gray-600 dark:text-gray-400">P/E Ratio</span>
//                                                                                 <span className="text-base text-gray-900 dark:text-gray-100">
//                                                                                     {formatDecimal(index.pe)}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div className="flex justify-between">
//                                                                                 <span className="text-xs text-gray-600 dark:text-gray-400">P/B Ratio</span>
//                                                                                 <span className="text-base text-gray-900 dark:text-gray-100">
//                                                                                     {formatDecimal(index.pb)}
//                                                                                 </span>
//                                                                             </div>
//                                                                         </div>

//                                                                         <button
//                                                                             onClick={() => handleViewDetails(index)}
//                                                                             className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-base"
//                                                                         >
//                                                                             View Details
//                                                                         </button>
//                                                                     </>
//                                                                 )}
//                                                             </motion.div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Desktop Navigation Buttons */}
//                                         <button
//                                             onClick={handlePrevSlide}
//                                             disabled={currentSlide === 0}
//                                             className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 transition-colors duration-200 ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                                                 }`}
//                                         >
//                                             <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                             </svg>
//                                         </button>
//                                         <button
//                                             onClick={handleNextSlide}
//                                             disabled={currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1}
//                                             className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 transition-colors duration-200 ${currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                                                 }`}
//                                         >
//                                             <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                             </svg>
//                                         </button>

//                                         {/* Desktop Pagination Dots */}
//                                         <div className="flex justify-center mt-4 space-x-2">
//                                             {chunkArray(displayIndices, cardsPerSlide).map((_, index) => (
//                                                 <button
//                                                     key={index}
//                                                     onClick={() => goToSlide(index)}
//                                                     className={`w-2 h-2 rounded-full transition-colors duration-200 ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
//                                                         }`}
//                                                     aria-label={`Go to slide ${index + 1}`}
//                                                 />
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     {/* Modal */}
//                     <AnimatePresence>
//                         {isModalOpen && selectedIndex && (
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
//                             >
//                                 <motion.div
//                                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                                     exit={{ opacity: 0, scale: 0.9, y: 20 }}
//                                     className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-4xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20 mx-2 sm:mx-0"
//                                 >
//                                     <div
//                                         className="h-2 w-full bg-gradient-to-r"
//                                         style={{
//                                             background: `linear-gradient(90deg, ${selectedIndex.color || colorPalette[0]}, ${selectedIndex.color || colorPalette[1]}99)`
//                                         }}
//                                     ></div>

//                                     <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-2rem)] sm:max-h-[calc(90vh-2rem)]">
//                                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
//                                             <div className="flex-1">
//                                                 <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-gray-100 dark:to-blue-400 bg-clip-text text-transparent">
//                                                     {selectedIndex.index_name} Constituents
//                                                 </h3>
//                                                 <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
//                                                     Detailed breakdown of index components and performance metrics
//                                                 </p>
//                                             </div>
//                                             <button
//                                                 onClick={closeModal}
//                                                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg sm:rounded-xl transition-colors duration-200 group self-start sm:self-auto"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                     stroke="currentColor"
//                                                 >
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                                 </svg>
//                                             </button>
//                                         </div>

//                                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 border border-gray-200 dark:border-gray-600">
//                                             {[
//                                                 { label: 'Market Cap', value: formatNumber(selectedIndex.free_float_mcap) },
//                                                 { label: 'P/E Ratio', value: formatDecimal(selectedIndex.pe) },
//                                                 { label: 'P/B Ratio', value: formatDecimal(selectedIndex.pb) },
//                                                 { label: 'Div Yield', value: `${formatDecimal(selectedIndex.dividend_yield * 100)}%` }
//                                             ].map((stat, index) => (
//                                                 <div key={index} className="text-center">
//                                                     <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">{stat.label}</p>
//                                                     <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
//                                                         {stat.value}
//                                                     </p>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         <div className="relative mb-4 sm:mb-6">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                 <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                 </svg>
//                                             </div>
//                                             <input
//                                                 type="text"
//                                                 placeholder="Search by symbol or company name..."
//                                                 value={searchTerm}
//                                                 onChange={(e) => {
//                                                     setSearchTerm(e.target.value);
//                                                     setCurrentPage(1);
//                                                 }}
//                                                 className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                             />
//                                         </div>

//                                         <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
//                                             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                                                 <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
//                                                     <tr>
//                                                         {['Symbol', 'Company', 'Price (₹)', 'P/E', 'Weight (%)'].map((header, index) => (
//                                                             <th
//                                                                 key={header}
//                                                                 className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
//                                                             >
//                                                                 {header}
//                                                             </th>
//                                                         ))}
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                                                     {currentConstituents.length > 0 ? (
//                                                         currentConstituents.map((constituent, idx) => (
//                                                             <motion.tr
//                                                                 key={idx || constituent.Symbol}
//                                                                 initial={{ opacity: 0 }}
//                                                                 animate={{ opacity: 1 }}
//                                                                 transition={{ delay: idx * 0.05 }}
//                                                                 onClick={() => onRowClick(constituent.Symbol)}
//                                                                 className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 cursor-pointer transition-all duration-200 group"
//                                                             >
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                                                                         {constituent.Symbol}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
//                                                                         {constituent.CompanyName}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
//                                                                         {formatNumber(constituent.Price)}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">
//                                                                         {formatDecimal(constituent.PE)}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
//                                                                         {formatDecimal(constituent.WeightPct)}
//                                                                     </div>
//                                                                 </td>
//                                                             </motion.tr>
//                                                         ))
//                                                     ) : (
//                                                         <tr>
//                                                             <td colSpan="5" className="px-3 sm:px-6 py-6 sm:py-8 text-center">
//                                                                 <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
//                                                                     <svg className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                                     </svg>
//                                                                     <p className="text-sm sm:text-lg font-medium">No constituents found</p>
//                                                                     <p className="text-xs sm:text-sm">Try adjusting your search terms</p>
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     )}
//                                                 </tbody>
//                                             </table>
//                                         </div>

//                                         {filteredConstituents.length > itemsPerPage && (
//                                             <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-3 sm:gap-4">
//                                                 <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium text-center sm:text-left">
//                                                     Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredConstituents.length)} of {filteredConstituents.length} constituents
//                                                 </div>
//                                                 <div className="flex items-center gap-1 sm:gap-2">
//                                                     <button
//                                                         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                                                         disabled={currentPage === 1}
//                                                         className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                                                     >
//                                                         <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                                         </svg>
//                                                         <span className="hidden sm:inline">Previous</span>
//                                                     </button>

//                                                     <div className="flex gap-1">
//                                                         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                                                             let pageNum;
//                                                             if (totalPages <= 5) {
//                                                                 pageNum = i + 1;
//                                                             } else if (currentPage <= 3) {
//                                                                 pageNum = i + 1;
//                                                             } else if (currentPage >= totalPages - 2) {
//                                                                 pageNum = totalPages - 4 + i;
//                                                             } else {
//                                                                 pageNum = currentPage - 2 + i;
//                                                             }
//                                                             return (
//                                                                 <button
//                                                                     key={i}
//                                                                     onClick={() => setCurrentPage(pageNum)}
//                                                                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${currentPage === pageNum
//                                                                         ? 'bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-lg'
//                                                                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
//                                                                         }`}
//                                                                 >
//                                                                     {pageNum}
//                                                                 </button>
//                                                             );
//                                                         })}
//                                                     </div>

//                                                     <button
//                                                         onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                                                         disabled={currentPage === totalPages}
//                                                         className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                                                     >
//                                                         <span className="hidden sm:inline">Next</span>
//                                                         <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                                         </svg>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </motion.div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MarketIndices;

// ----------------------01/10/2025---------------

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Fallback data to ensure immediate display if API or cache fails
const fallbackIndices = [
    {
        index_name: 'NIFTY 50',
        free_float_mcap: 123456789,
        pe: 25.5,
        pb: 4.2,
        dividend_yield: 0.015,
        return_1y: 0.12,
        constituents: [
            { Symbol: 'RELIANCE', CompanyName: 'Reliance Industries Ltd', Price: 2950.25, PE: 28.7, WeightPct: 10.5 },
            { Symbol: 'TCS', CompanyName: 'Tata Consultancy Services Ltd', Price: 4200.75, PE: 32.4, WeightPct: 8.2 },
        ],
        color: 'rgba(31, 119, 180, 0.8)',
        highlightColor: 'rgba(31, 119, 180, 1)',
    },
    // Add more fallback indices as needed
];

const MarketIndices = () => {
    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

    const [indices, setIndices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showAllIndices, setShowAllIndices] = useState(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedSymbol = searchParams.get('symbol');
    const itemsPerPage = 10;
    const cardsPerSlide = 4;

    const indexNames = [...new Set([
        "NIFTY 50",
        "NIFTY NEXT 50",
        "NIFTY BANK",
        "NIFTY MIDCAP 100",
        "NIFTY SMALLCAP 250",
        "NIFTY ALPHA 50",
        "NIFTY100 QUALITY 30",
        "NIFTY CPSE",
        "NIFTY ENERGY",
        "NIFTY COMMODITIES",
        "NIFTY SMALLCAP250 MOMENTUM QUALITY 100",
        "NIFTY200 ALPHA 30",
        "NIFTY MICROCAP 250",
        "NIFTY MIDCAP 150",
        "NIFTY AUTO",
        "NIFTY MEDIA",
        "NIFTY MIDCAP LIQUID 15",
        "NIFTY PRIVATE BANK",
        "NIFTY HEALTHCARE INDEX",
        "NIFTY INDIA CORPORATE GROUP INDEX - TATA GROUP 25% CAP",
        "NIFTY 200",
        "NIFTY MIDSMALLCAP400 MOMENTUM QUALITY 100",
        "NIFTY CAPITAL MARKETS",
        "NIFTY LARGEMIDCAP 250",
        "NIFTY MIDSMALLCAP 400",
        "NIFTY 100",
        "NIFTY SMALLCAP 50",
        "NIFTY500 MOMENTUM 50",
        "NIFTY SMALLCAP 100",
        "NIFTY INDIA DEFENCE",
        "NIFTY PSE",
        "NIFTY GROWTH SECTORS 15",
        "NIFTY100 EQUAL WEIGHT",
        "NIFTY INDIA CONSUMPTION",
        "NIFTY SERVICES SECTOR",
        "NIFTY100 LIQUID 15",
        "NIFTY MNC",
        "NIFTY DIVIDEND OPPORTUNITIES 50",
        "NIFTY MIDCAP 50",
        "NIFTY500 MULTICAP 50 3A25 3A25",
        "NIFTY TOP 10 EQUAL WEIGHT",
        "NIFTY CONSUMER DURABLES",
        "NIFTY FINANCIAL SERVICES 25 2F50",
        "NIFTY TOTAL MARKET",
        "NIFTY50 EQUAL WEIGHT",
        "NIFTY REALTY",
        "NIFTY 500",
        "NIFTY INDIA MANUFACTURING",
        "NIFTY MIDCAP150 QUALITY 50",
        "NIFTYINFRASTRUCTURE",
        "NIFTY200 QUALITY 30",
        "NIFTY PHARMA",
        "NIFTY INDIA DIGITAL",
        "NIFTY200 MOMENTUM 30",
        "NIFTY FINANCIAL SERVICES",
        "NIFTY500 MULTICAP INFRASTRUCTURE 50 3A30 3A20",
        "NIFTY PSU BANK",
        "NIFTY OIL & GAS",
        "NIFTY MIDCAP150 MOMENTUM 50",
        "NIFTY MIDSMALL HEALTHCARE",
        "NIFTY ALPHA LOW-VOLATILITY 30",
        "NIFTY IT",
        "NIFTY INDIA TOURISM",
        "NIFTY MIDCAP SELECT",
        "NIFTY FMCG",
        "NIFTY METAL",
    ])];

    const colorPalette = [
        'rgba(31, 119, 180, 0.8)', 'rgba(255, 127, 14, 0.8)', 'rgba(13, 84, 105, 0.8)',
        'rgba(214, 39, 40, 0.8)', 'rgba(148, 103, 189, 0.8)', 'rgba(23, 190, 207, 0.8)',
        'rgba(227, 119, 194, 0.8)', 'rgba(188, 189, 34, 0.8)', 'rgba(127, 127, 127, 0.8)',
        'rgba(70, 130, 180, 0.8)',
    ];

    const removeSymbolFromURL = () => {
        searchParams.delete('symbol');
        setSearchParams(searchParams);
    };

    const onRowClick = (symbol) => {
        if (symbol) {
            navigate(`/equityinsights?symbol=${encodeURIComponent(symbol)}`);
        }
    };

    const formatDecimal = (num) => {
        if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
        return Math.round(num * 100) / 100;
    };

    const formatNumber = useCallback((num) => {
        if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
        const absNum = Math.abs(num);
        const sign = num < 0 ? '-' : '';
        if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: absNum % 1 === 0 ? 0 : 2 })}cr`;
        if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: absNum % 1 === 0 ? 0 : 2 })}L`;
        return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);
        const handleChange = (e) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const cacheDuration = 60 * 60 * 1000; // 1 hour

        const fetchIndices = async () => {
            try {
                // Check cache first
                const cachedData = localStorage.getItem('indicesData');
                const cacheTimestamp = localStorage.getItem('indicesDataTimestamp');
                let validIndices = [];

                if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
                    validIndices = JSON.parse(cachedData).filter(
                        (index) => index?.index_name && Number.isFinite(index.free_float_mcap) && Number.isFinite(index.pe)
                    );
                    // Set cached data immediately to avoid loading state
                    if (validIndices.length > 0) {
                        setIndices(validIndices);
                        setLoading(false);
                    } else {
                        // Fallback to default data if cache is invalid
                        setIndices(fallbackIndices);
                        setLoading(false);
                    }
                } else {
                    // Show fallback data immediately while fetching new data
                    setIndices(fallbackIndices);
                    setLoading(false);

                    // Fetch new data
                    for (let i = 0; i < indexNames.length; i++) {
                        try {
                            const indexResponse = await axios.get(`${API_BASE}/indices`, {
                                params: { name: indexNames[i] },
                                signal: controller.signal,
                            });

                            if (indexResponse.data.status === 'success') {
                                const indexData = indexResponse.data.data;
                                if (indexData && indexData.index_name && Number.isFinite(indexData.free_float_mcap) && Number.isFinite(indexData.pe)) {
                                    validIndices.push({
                                        ...indexData,
                                        requestedName: indexNames[i],
                                        color: colorPalette[i % colorPalette.length],
                                        highlightColor: colorPalette[i % colorPalette.length].replace('0.8)', '1)'),
                                    });
                                } else {
                                    console.warn(`Invalid data for ${indexNames[i]}:`, indexData);
                                }
                            } else {
                                console.warn(`API error for ${indexNames[i]}:`, indexResponse.data);
                            }
                        } catch (e) {
                            if (e.name === 'AbortError') return;
                            console.error(`Error fetching data for ${indexNames[i]}:`, e.response?.data || e.message);
                            continue;
                        }
                    }

                    if (validIndices.length > 0) {
                        localStorage.setItem('indicesData', JSON.stringify(validIndices));
                        localStorage.setItem('indicesDataTimestamp', Date.now().toString());
                        setIndices(validIndices);
                    } else {
                        setError('No valid index data available. Showing fallback data.');
                        setIndices(fallbackIndices);
                    }
                }
            } catch (error) {
                if (error.name === 'AbortError') return;
                setError('Failed to fetch index data. Showing fallback data.');
                setIndices(fallbackIndices);
                console.error('Error fetching index data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIndices();

        return () => controller.abort();
    }, [API_BASE]);

    const handleViewDetails = (index) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
        setSearchTerm('');
        setCurrentPage(1);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedIndex(null);
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleViewAllIndices = () => {
        setShowAllIndices(true);
        setCurrentSlide(0);
    };

    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const filteredConstituents = selectedIndex?.constituents?.filter(
        (constituent) =>
            constituent.Symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            constituent.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredConstituents.length / itemsPerPage);
    const currentConstituents = filteredConstituents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? chunkArray(displayIndices, cardsPerSlide).length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev === chunkArray(displayIndices, cardsPerSlide).length - 1 ? 0 : prev + 1));
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const viewAllCard = {
        index_name: 'View All Indices',
        isViewAll: true,
        color: 'rgba(100, 100, 100, 0.8)',
        highlightColor: 'rgba(100, 100, 100, 1)',
    };
    const displayIndices = showAllIndices ? indices : [...indices.slice(0, 10), viewAllCard];

    return (
        <div id="market-indices" className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
            <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                <div className="pl-2 pr-2 sm:pl-4 sm:pr-4 lg:pl-6 lg:pr-6 max-w-8xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
                                Market Indices Overview
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
                                Discover comprehensive performance metrics and insights across major market indices
                            </p>
                        </motion.div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 xs:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
                            {[...Array(cardsPerSlide)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 h-60 sm:h-72 animate-pulse border border-white/20"
                                >
                                    <div className="h-5 sm:h-7 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 sm:mb-6"></div>
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
                                        <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
                                        <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
                                        <div className="h-8 sm:h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl mt-6 sm:mt-8"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : error && indices.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 sm:py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-red-200 dark:border-red-800 mx-2 sm:mx-0"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="text-red-600 dark:text-red-400 text-lg sm:text-xl font-semibold mb-3 sm:mb-4 px-4">{error}</div>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh Data
                                </div>
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            <div className="relative w-full max-w-full overflow-x-hidden rounded-lg px-0">
                                {/* Mobile & Tablet Carousel */}
                                <div className="block lg:hidden">
                                    <div className="relative w-full max-w-full overflow-x-hidden rounded-lg">
                                        <div
                                            className="flex transition-transform duration-500 ease-out"
                                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                        >
                                            {chunkArray(displayIndices, 1).map((slideIndices, slideIndex) => (
                                                <div key={slideIndex} className="w-full flex-shrink-0">
                                                    <div className="grid grid-cols-1 gap-3 px-2">
                                                        {slideIndices.map((index, i) => (
                                                            <motion.div
                                                                key={index.isViewAll ? 'view-all' : i}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                                                className={`bg-white dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${index.isViewAll ? 'border border-blue-300 dark:border-blue-600' : ''
                                                                    }`}
                                                            >
                                                                <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                                    {index.isViewAll && (
                                                                        <svg className="w-4 h-4 inline-block mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                        </svg>
                                                                    )}
                                                                    {index.index_name}
                                                                </h4>

                                                                {index.isViewAll ? (
                                                                    <div className="text-center py-3">
                                                                        <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                                                                            Explore all {indexNames.length} market indices
                                                                        </p>
                                                                        <button
                                                                            onClick={handleViewAllIndices}
                                                                            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                                                                        >
                                                                            View All Indices
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                                                            <div>
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400 block">Market Cap</span>
                                                                                <span className="text-base text-gray-900 dark:text-gray-100">
                                                                                    {formatNumber(index.free_float_mcap)}
                                                                                </span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400 block">TTM Revenue (%Chng)</span>
                                                                                <span
                                                                                    className={`text-base ${index.return_1y >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                                                        }`}
                                                                                >
                                                                                    {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
                                                                                </span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400 block">P/E Ratio</span>
                                                                                <span className="text-base text-gray-900 dark:text-gray-100">
                                                                                    {formatDecimal(index.pe)}
                                                                                </span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400 block">P/B Ratio</span>
                                                                                <span className="text-base text-gray-900 dark:text-gray-100">
                                                                                    {formatDecimal(index.pb)}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <button
                                                                            onClick={() => handleViewDetails(index)}
                                                                            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                                                                        >
                                                                            View Details
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Mobile Navigation Buttons */}
                                        <button
                                            onClick={handlePrevSlide}
                                            disabled={currentSlide === 0}
                                            className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 transition-colors duration-200 ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <svg className="h-4 w-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={handleNextSlide}
                                            disabled={currentSlide === chunkArray(displayIndices, 1).length - 1}
                                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 transition-colors duration-200 ${currentSlide === chunkArray(displayIndices, 1).length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <svg className="h-4 w-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        {/* Mobile Pagination Dots */}
                                        <div className="flex justify-center mt-3 space-x-2">
                                            {chunkArray(displayIndices, 1).map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => goToSlide(index)}
                                                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                                        }`}
                                                    aria-label={`Go to slide ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Desktop Carousel */}
                                <div className="hidden lg:block">
                                    <div className="relative w-full max-w-full overflow-x-hidden rounded-lg">
                                        <div
                                            className="flex transition-transform duration-500 ease-out"
                                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                        >
                                            {chunkArray(displayIndices, cardsPerSlide).map((slideIndices, slideIndex) => (
                                                <div key={slideIndex} className="w-full flex-shrink-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 px-2">
                                                        {slideIndices.map((index, i) => (
                                                            <motion.div
                                                                key={index.isViewAll ? 'view-all' : i}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.4, delay: (i % cardsPerSlide) * 0.1 }}
                                                                className={`bg-white dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${index.isViewAll ? 'border border-blue-300 dark:border-blue-600' : ''
                                                                    }`}
                                                            >
                                                                <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                                    {index.isViewAll && (
                                                                        <svg className="w-4 h-4 inline-block mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                        </svg>
                                                                    )}
                                                                    {index.index_name}
                                                                </h4>

                                                                {index.isViewAll ? (
                                                                    <div className="text-center py-3">
                                                                        <p className="text-gray-600 dark:text-gray-400 mb-3 text-base">
                                                                            Explore all {indexNames.length} market indices
                                                                        </p>
                                                                        <button
                                                                            onClick={handleViewAllIndices}
                                                                            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-base"
                                                                        >
                                                                            View All Indices
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="space-y-2 mb-3">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400">Market Cap</span>
                                                                                <span className="text-base text-gray-900 dark:text-gray-100">
                                                                                    {formatNumber(index.free_float_mcap)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400">TTM Revenue (%Chng)</span>
                                                                                <span
                                                                                    className={`text-base ${index.return_1y >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                                                        }`}
                                                                                >
                                                                                    {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400">P/E Ratio</span>
                                                                                <span className="text-base text-gray-900 dark:text-gray-100">
                                                                                    {formatDecimal(index.pe)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-xs text-gray-600 dark:text-gray-400">P/B Ratio</span>
                                                                                <span className="text-base text-gray-900 dark:text-gray-100">
                                                                                    {formatDecimal(index.pb)}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <button
                                                                            onClick={() => handleViewDetails(index)}
                                                                            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-base"
                                                                        >
                                                                            View Details
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Desktop Navigation Buttons */}
                                        <button
                                            onClick={handlePrevSlide}
                                            disabled={currentSlide === 0}
                                            className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 transition-colors duration-200 ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={handleNextSlide}
                                            disabled={currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1}
                                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 transition-colors duration-200 ${currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        {/* Desktop Pagination Dots */}
                                        <div className="flex justify-center mt-4 space-x-2">
                                            {chunkArray(displayIndices, cardsPerSlide).map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => goToSlide(index)}
                                                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                                        }`}
                                                    aria-label={`Go to slide ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Modal */}
                    <AnimatePresence>
                        {isModalOpen && selectedIndex && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-4xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20 mx-2 sm:mx-0"
                                >
                                    <div
                                        className="h-2 w-full bg-gradient-to-r"
                                        style={{
                                            background: `linear-gradient(90deg, ${selectedIndex.color || colorPalette[0]}, ${selectedIndex.color || colorPalette[1]}99)`
                                        }}
                                    ></div>

                                    <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-2rem)] sm:max-h-[calc(90vh-2rem)]">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
                                            <div className="flex-1">
                                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-gray-100 dark:to-blue-400 bg-clip-text text-transparent">
                                                    {selectedIndex.index_name} Constituents
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                                                    Detailed breakdown of index components and performance metrics
                                                </p>
                                            </div>
                                            <button
                                                onClick={closeModal}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg sm:rounded-xl transition-colors duration-200 group self-start sm:self-auto"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 border border-gray-200 dark:border-gray-600">
                                            {[
                                                { label: 'Market Cap', value: formatNumber(selectedIndex.free_float_mcap) },
                                                { label: 'P/E Ratio', value: formatDecimal(selectedIndex.pe) },
                                                { label: 'P/B Ratio', value: formatDecimal(selectedIndex.pb) },
                                                { label: 'Div Yield', value: `${formatDecimal(selectedIndex.dividend_yield * 100)}%` }
                                            ].map((stat, index) => (
                                                <div key={index} className="text-center">
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">{stat.label}</p>
                                                    <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
                                                        {stat.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="relative mb-4 sm:mb-6">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search by symbol or company name..."
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                                                    <tr>
                                                        {['Symbol', 'Company', 'Price (₹)', 'P/E', 'Weight (%)'].map((header, index) => (
                                                            <th
                                                                key={header}
                                                                className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                                            >
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {currentConstituents.length > 0 ? (
                                                        currentConstituents.map((constituent, idx) => (
                                                            <motion.tr
                                                                key={idx || constituent.Symbol}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                onClick={() => onRowClick(constituent.Symbol)}
                                                                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 cursor-pointer transition-all duration-200 group"
                                                            >
                                                                <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
                                                                    <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                        {constituent.Symbol}
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
                                                                    <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
                                                                        {constituent.CompanyName}
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
                                                                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                        {formatNumber(constituent.Price)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
                                                                    <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                                                                        {formatDecimal(constituent.PE)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
                                                                    <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                        {formatDecimal(constituent.WeightPct)}
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="px-3 sm:px-6 py-6 sm:py-8 text-center">
                                                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                                                    <svg className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    <p className="text-sm sm:text-lg font-medium">No constituents found</p>
                                                                    <p className="text-xs sm:text-sm">Try adjusting your search terms</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {filteredConstituents.length > itemsPerPage && (
                                            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-3 sm:gap-4">
                                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium text-center sm:text-left">
                                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredConstituents.length)} of {filteredConstituents.length} constituents
                                                </div>
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <button
                                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                                    >
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                        <span className="hidden sm:inline">Previous</span>
                                                    </button>

                                                    <div className="flex gap-1">
                                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                            let pageNum;
                                                            if (totalPages <= 5) {
                                                                pageNum = i + 1;
                                                            } else if (currentPage <= 3) {
                                                                pageNum = i + 1;
                                                            } else if (currentPage >= totalPages - 2) {
                                                                pageNum = totalPages - 4 + i;
                                                            } else {
                                                                pageNum = currentPage - 2 + i;
                                                            }
                                                            return (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => setCurrentPage(pageNum)}
                                                                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${currentPage === pageNum
                                                                        ? 'bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-lg'
                                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                                        }`}
                                                                >
                                                                    {pageNum}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    <button
                                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages}
                                                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                                    >
                                                        <span className="hidden sm:inline">Next</span>
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MarketIndices;









// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useSwipeable } from 'react-swipeable'; // Added for swipe gestures

// const MarketIndices = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     const [indices, setIndices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedIndex, setSelectedIndex] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDark, setIsDark] = useState(false);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [showAllIndices, setShowAllIndices] = useState(false);
//     const navigate = useNavigate();
//     const [searchParams, setSearchParams] = useSearchParams();
//     const selectedSymbol = searchParams.get('symbol');
//     const itemsPerPage = 10;
//     const cardsPerSlide = 4; // Desktop cards per slide
//     const mobileCardsPerSlide = 1; // Mobile cards per slide

//     const indexNames = [...new Set([
//         "NIFTY 50",
//         "NIFTY NEXT 50",
//         "NIFTY BANK",
//         "NIFTY MIDCAP 100",
//         "NIFTY SMALLCAP 250",
//         "NIFTY ALPHA 50",
//         "NIFTY100 QUALITY 30",
//         "NIFTY 50 VALUE 20",
//         "NIFTY 100 LOW VOLATILITY 30",
//         "NIFTY CPSE",
//         "NIFTY ENERGY",
//         "NIFTY COMMODITIES",
//         "NIFTY SMALLCAP250 MOMENTUM QUALITY 100",
//         "NIFTY200 ALPHA 30",
//         "NIFTY MICROCAP 250",
//         "NIFTY MIDCAP 150",
//         "NIFTY AUTO",
//         "NIFTY MEDIA",
//         "NIFTY MIDCAP LIQUID 15",
//         "NIFTY PRIVATE BANK",
//         "NIFTY HEALTHCARE INDEX",
//         "NIFTY INDIA CORPORATE GROUP INDEX - TATA GROUP 25% CAP",
//         "NIFTY 200",
//         "NIFTY MIDSMALLCAP400 MOMENTUM QUALITY 100",
//         "NIFTY CAPITAL MARKETS",
//         "NIFTY LARGEMIDCAP 250",
//         "NIFTY MIDSMALLCAP 400",
//         "NIFTY 100",
//         "NIFTY SMALLCAP 50",
//         "NIFTY500 MOMENTUM 50",
//         "NIFTY SMALLCAP 100",
//         "NIFTY INDIA DEFENCE",
//         "NIFTY PSE",
//         "NIFTY GROWTH SECTORS 15",
//         "NIFTY100 EQUAL WEIGHT",
//         "NIFTY INDIA CONSUMPTION",
//         "NIFTY SERVICES SECTOR",
//         "NIFTY100 LIQUID 15",
//         "NIFTY MNC",
//         "NIFTY DIVIDEND OPPORTUNITIES 50",
//         "NIFTY MIDCAP 50",
//         "NIFTY500 MULTICAP 50 3A25 3A25",
//         "NIFTY TOP 10 EQUAL WEIGHT",
//         "NIFTY CONSUMER DURABLES",
//         "NIFTY FINANCIAL SERVICES 25 2F50",
//         "NIFTY TOTAL MARKET",
//         "NIFTY50 EQUAL WEIGHT",
//         "NIFTY REALTY",
//         "NIFTY 500",
//         "NIFTY INDIA MANUFACTURING",
//         "NIFTY MIDCAP150 QUALITY 50",
//         "NIFTYINFRASTRUCTURE",
//         "NIFTY200 QUALITY 30",
//         "NIFTY PHARMA",
//         "NIFTY INDIA DIGITAL",
//         "NIFTY200 MOMENTUM 30",
//         "NIFTY FINANCIAL SERVICES",
//         "NIFTY500 MULTICAP INFRASTRUCTURE 50 3A30 3A20",
//         "NIFTY PSU BANK",
//         "NIFTY OIL & GAS",
//         "NIFTY MIDCAP150 MOMENTUM 50",
//         "NIFTY MIDSMALL HEALTHCARE",
//         "NIFTY ALPHA LOW-VOLATILITY 30",
//         "NIFTY IT",
//         "NIFTY INDIA TOURISM",
//         "NIFTY MIDCAP SELECT",
//         "NIFTY FMCG",
//         "NIFTY METAL",
//     ])];

//     const colorPalette = [
//         'rgba(31, 119, 180, 0.8)', 'rgba(255, 127, 14, 0.8)', 'rgba(13, 84, 105, 0.8)',
//         'rgba(214, 39, 40, 0.8)', 'rgba(148, 103, 189, 0.8)', 'rgba(23, 190, 207, 0.8)',
//         'rgba(227, 119, 194, 0.8)', 'rgba(188, 189, 34, 0.8)', 'rgba(127, 127, 127, 0.8)',
//         'rgba(70, 130, 180, 0.8)',
//     ];

//     const removeSymbolFromURL = () => {
//         searchParams.delete('symbol');
//         setSearchParams(searchParams);
//     };

//     const onRowClick = (symbol) => {
//         if (symbol) {
//             navigate(`/equityhub?symbol=${encodeURIComponent(symbol)}`);
//         }
//     };

//     const formatDecimal = (num) => {
//         if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//         return Math.round(num * 100) / 100;
//     };

//     const formatNumber = useCallback((num) => {
//         if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
//         const absNum = Math.abs(num);
//         const sign = num < 0 ? '-' : '';
//         if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: absNum % 1 === 0 ? 0 : 2 })}cr`;
//         if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: absNum % 1 === 0 ? 0 : 2 })}L`;
//         return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//     }, []);

//     useEffect(() => {
//         const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//         setIsDark(mediaQuery.matches);
//         const handleChange = (e) => setIsDark(e.matches);
//         mediaQuery.addEventListener('change', handleChange);
//         return () => mediaQuery.removeEventListener('change', handleChange);
//     }, []);

//     useEffect(() => {
//         const controller = new AbortController();
//         const cacheDuration = 60 * 60 * 1000; // 1 hour

//         const fetchIndices = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 const cachedData = localStorage.getItem('indicesData');
//                 const cacheTimestamp = localStorage.getItem('indicesDataTimestamp');
//                 let validIndices = [];

//                 if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//                     validIndices = JSON.parse(cachedData).filter(
//                         (index) => index?.index_name && Number.isFinite(index.free_float_mcap) && Number.isFinite(index.pe)
//                     );
//                 } else {
//                     for (let i = 0; i < indexNames.length; i++) {
//                         try {
//                             const indexResponse = await axios.get(`${API_BASE}/indices`, {
//                                 params: { name: indexNames[i] },
//                                 signal: controller.signal,
//                             });
//                             if (indexResponse.data.status === 'success') {
//                                 const indexData = indexResponse.data.data;
//                                 if (indexData && indexData.index_name && Number.isFinite(indexData.free_float_mcap) && Number.isFinite(indexData.pe)) {
//                                     validIndices.push({
//                                         ...indexData,
//                                         requestedName: indexNames[i],
//                                         color: colorPalette[i % colorPalette.length],
//                                         highlightColor: colorPalette[i % colorPalette.length].replace('0.8)', '1)'),
//                                     });
//                                 }
//                             }
//                         } catch (e) {
//                             console.error(`Error fetching data for ${indexNames[i]}:`, e.response?.data || e.message);
//                             continue;
//                         }
//                     }
//                     if (validIndices.length > 0) {
//                         localStorage.setItem('indicesData', JSON.stringify(validIndices));
//                         localStorage.setItem('indicesDataTimestamp', Date.now().toString());
//                     }
//                 }

//                 if (validIndices.length === 0) {
//                     setError('No valid index data available. Please verify the index names or API response.');
//                     setIndices([]);
//                 } else {
//                     setIndices(validIndices);
//                 }
//                 setLoading(false);
//             } catch (error) {
//                 if (error.name === 'AbortError') return;
//                 setError('Failed to fetch index data. Please check the network, CORS settings, or API base URL.');
//                 setIndices([]);
//                 setLoading(false);
//             }
//         };

//         fetchIndices();
//         return () => controller.abort();
//     }, [API_BASE]);

//     const handleViewDetails = (index) => {
//         setSelectedIndex(index);
//         setIsModalOpen(true);
//         setSearchTerm('');
//         setCurrentPage(1);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedIndex(null);
//         setSearchTerm('');
//         setCurrentPage(1);
//     };

//     const handleViewAllIndices = () => {
//         setShowAllIndices(true);
//         setCurrentSlide(0);
//     };

//     const chunkArray = (array, size) => {
//         const result = [];
//         for (let i = 0; i < array.length; i += size) {
//             result.push(array.slice(i, i + size));
//         }
//         return result;
//     };

//     const filteredConstituents = selectedIndex?.constituents?.filter(
//         (constituent) =>
//             constituent.Symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             constituent.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())
//     ) || [];

//     const totalPages = Math.ceil(filteredConstituents.length / itemsPerPage);
//     const currentConstituents = filteredConstituents.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     const handlePrevSlide = () => {
//         setCurrentSlide((prev) => (prev === 0 ? chunkArray(displayIndices, isMobile() ? mobileCardsPerSlide : cardsPerSlide).length - 1 : prev - 1));
//     };

//     const handleNextSlide = () => {
//         setCurrentSlide((prev) => (prev === chunkArray(displayIndices, isMobile() ? mobileCardsPerSlide : cardsPerSlide).length - 1 ? 0 : prev + 1));
//     };

//     const goToSlide = (index) => {
//         setCurrentSlide(index);
//     };

//     // Helper to determine if mobile view
//     const isMobile = () => window.innerWidth < 1024; // lg breakpoint

//     // Swipe handlers for mobile
//     const swipeHandlers = useSwipeable({
//         onSwipedLeft: () => handleNextSlide(),
//         onSwipedRight: () => handlePrevSlide(),
//         trackMouse: true, // Allow mouse dragging for testing
//         delta: 10, // Minimum swipe distance
//     });

//     const viewAllCard = {
//         index_name: 'View All Indices',
//         isViewAll: true,
//         color: 'rgba(100, 100, 100, 0.8)',
//         highlightColor: 'rgba(100, 100, 100, 1)',
//     };
//     const displayIndices = showAllIndices ? indices : [...indices.slice(0, 10), viewAllCard];

//     return (
//         <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 min-h-screen">
//             <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 md:py-8 lg:py-10">
//                 <div className="max-w-8xl mx-auto">
//                     {/* Header */}
//                     <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
//                         <motion.div
//                             initial={{ opacity: 0, y: -20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6 }}
//                         >
//                             <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 px-2">
//                                 Market Indices Overview
//                             </h1>
//                             <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
//                                 Discover comprehensive performance metrics and insights across major market indices
//                             </p>
//                         </motion.div>
//                     </div>

//                     {loading ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
//                             {[...Array(isMobile() ? mobileCardsPerSlide : cardsPerSlide)].map((_, i) => (
//                                 <motion.div
//                                     key={i}
//                                     initial={{ opacity: 0, scale: 0.9 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     transition={{ delay: i * 0.1 }}
//                                     className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 h-56 sm:h-64 md:h-72 animate-pulse border border-white/20"
//                                 >
//                                     <div className="h-4 sm:h-5 md:h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-4 sm:mb-5 md:mb-6"></div>
//                                     <div className="space-y-2 sm:space-y-3 md:space-y-4">
//                                         <div className="h-3 sm:h-3.5 md:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
//                                         <div className="h-3 sm:h-3.5 md:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
//                                         <div className="h-3 sm:h-3.5 md:h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
//                                         <div className="h-8 sm:h-10 md:h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg md:rounded-xl mt-4 sm:mt-6 md:mt-8"></div>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </div>
//                     ) : error && indices.length === 0 ? (
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="text-center py-8 sm:py-12 md:py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl border border-red-200 dark:border-red-800 mx-2 sm:mx-4"
//                         >
//                             <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center">
//                                 <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                                 </svg>
//                             </div>
//                             <div className="text-red-600 dark:text-red-400 text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 px-2 sm:px-4">{error}</div>
//                             <button
//                                 onClick={() => window.location.reload()}
//                                 className="px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-xs sm:text-sm md:text-base"
//                             >
//                                 <div className="flex items-center gap-1 sm:gap-2">
//                                     <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                     </svg>
//                                     Refresh Data
//                                 </div>
//                             </button>
//                         </motion.div>
//                     ) : (
//                         <>
//                             <div className="relative w-full rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 contain-strict">
//                                 {/* Mobile & Tablet Carousel Layout */}
//                                 <div className="block lg:hidden" {...swipeHandlers}>
//                                     <div className="relative w-full rounded-lg sm:rounded-xl overflow-hidden">
//                                         <div
//                                             className="flex transition-transform duration-500 ease-out"
//                                             style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                                         >
//                                             {chunkArray(displayIndices, mobileCardsPerSlide).map((slideIndices, slideIndex) => (
//                                                 <div key={slideIndex} className="w-full flex-shrink-0 px-2 sm:px-3 md:px-4">
//                                                     <div className="grid grid-cols-1 gap-4 sm:gap-6">
//                                                         {slideIndices.map((index, i) => (
//                                                             <motion.div
//                                                                 key={index.isViewAll ? 'view-all' : i}
//                                                                 initial={{ opacity: 0, y: 20 }}
//                                                                 animate={{ opacity: 1, y: 0 }}
//                                                                 transition={{ duration: 0.4, delay: i * 0.1 }}
//                                                                 whileHover={{ y: -4 }}
//                                                                 className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 ${index.isViewAll
//                                                                     ? 'border-2 border-dashed border-blue-400 dark:border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
//                                                                     : ''
//                                                                     }`}
//                                                             >
//                                                                 <div
//                                                                     className="h-1.5 sm:h-2 w-full bg-gradient-to-r"
//                                                                     style={{
//                                                                         background: index.isViewAll
//                                                                             ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
//                                                                             : `linear-gradient(90deg, ${index.color || colorPalette[i % colorPalette.length]}, ${index.color || colorPalette[(i + 1) % colorPalette.length]}99)`
//                                                                     }}
//                                                                 ></div>
//                                                                 <div className="p-4 sm:p-5 md:p-6">
//                                                                     <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1 sm:gap-2">
//                                                                         {index.isViewAll && (
//                                                                             <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                                             </svg>
//                                                                         )}
//                                                                         {index.index_name}
//                                                                     </h4>
//                                                                     {index.isViewAll ? (
//                                                                         <div className="text-center py-2 sm:py-4">
//                                                                             <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                                                                                 <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                                                                 </svg>
//                                                                             </div>
//                                                                             <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
//                                                                                 Explore all {indexNames.length} market indices
//                                                                             </p>
//                                                                             <button
//                                                                                 onClick={handleViewAllIndices}
//                                                                                 className="w-full px-4 sm:px-6 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-xs sm:text-sm md:text-base"
//                                                                                 aria-label="View all market indices"
//                                                                             >
//                                                                                 View All Indices
//                                                                             </button>
//                                                                         </div>
//                                                                     ) : (
//                                                                         <>
//                                                                             <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
//                                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
//                                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-0.5 sm:mb-1">Market Cap</span>
//                                                                                     <span className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm md:text-base">
//                                                                                         {formatNumber(index.free_float_mcap)}
//                                                                                     </span>
//                                                                                 </div>
//                                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
//                                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-0.5 sm:mb-1">1Y Return</span>
//                                                                                     <span
//                                                                                         className={`font-bold text-xs sm:text-sm md:text-base ${index.return_1y >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
//                                                                                             }`}
//                                                                                     >
//                                                                                         {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
//                                                                                     </span>
//                                                                                 </div>
//                                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
//                                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-0.5 sm:mb-1">P/E Ratio</span>
//                                                                                     <span className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm md:text-base">
//                                                                                         {formatDecimal(index.pe)}
//                                                                                     </span>
//                                                                                 </div>
//                                                                                 <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3">
//                                                                                     <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-0.5 sm:mb-1">P/B Ratio</span>
//                                                                                     <span className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm md:text-base">
//                                                                                         {formatDecimal(index.pb)}
//                                                                                     </span>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <button
//                                                                                 onClick={() => handleViewDetails(index)}
//                                                                                 className="w-full px-4 sm:px-6 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1 sm:gap-2"
//                                                                                 aria-label={`View details for ${index.index_name}`}
//                                                                             >
//                                                                                 <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                                                 </svg>
//                                                                                 View Details
//                                                                             </button>
//                                                                         </>
//                                                                     )}
//                                                                 </div>
//                                                             </motion.div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                         {/* Mobile Navigation Buttons */}
//                                         <button
//                                             onClick={handlePrevSlide}
//                                             disabled={currentSlide === 0}
//                                             className={`absolute left-1 sm:left-2 md:left-3 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-xl transition-all duration-300 z-10 border border-gray-200 dark:border-gray-600 min-w-[44px] min-h-[44px] ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:scale-110 dark:hover:bg-gray-700'
//                                                 }`}
//                                             aria-label="Previous slide"
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-700 dark:text-gray-300"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                             </svg>
//                                         </button>
//                                         <button
//                                             onClick={handleNextSlide}
//                                             disabled={currentSlide === chunkArray(displayIndices, mobileCardsPerSlide).length - 1}
//                                             className={`absolute right-1 sm:right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-xl transition-all duration-300 z-10 border border-gray-200 dark:border-gray-600 min-w-[44px] min-h-[44px] ${currentSlide === chunkArray(displayIndices, mobileCardsPerSlide).length - 1
//                                                 ? 'opacity-30 cursor-not-allowed'
//                                                 : 'hover:bg-white hover:scale-110 dark:hover:bg-gray-700'
//                                                 }`}
//                                             aria-label="Next slide"
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-700 dark:text-gray-300"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                             </svg>
//                                         </button>
//                                         {/* Mobile Pagination Dots */}
//                                         <div className="flex justify-center mt-3 sm:mt-4 md:mt-6 space-x-1 sm:space-x-2">
//                                             {chunkArray(displayIndices, mobileCardsPerSlide).map((_, index) => (
//                                                 <button
//                                                     key={index}
//                                                     onClick={() => goToSlide(index)}
//                                                     className={`relative transition-all duration-300 ${currentSlide === index
//                                                         ? 'w-5 sm:w-6 bg-gradient-to-r from-blue-500 to-purple-600'
//                                                         : 'w-2 sm:w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
//                                                         } h-2 sm:h-2.5 rounded-full min-w-[24px] min-h-[24px]`}
//                                                     aria-label={`Go to slide ${index + 1}`}
//                                                 />
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* Desktop Carousel Layout */}
//                                 <div className="hidden lg:block">
//                                     <div
//                                         className="flex transition-transform duration-500 ease-out"
//                                         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                                     >
//                                         {chunkArray(displayIndices, cardsPerSlide).map((slideIndices, slideIndex) => (
//                                             <div key={slideIndex} className="w-full flex-shrink-0">
//                                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//                                                     {slideIndices.map((index, i) => (
//                                                         <motion.div
//                                                             key={index.isViewAll ? 'view-all' : i}
//                                                             initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                                                             animate={{ opacity: 1, y: 0, scale: 1 }}
//                                                             transition={{
//                                                                 duration: 0.5,
//                                                                 delay: (i % cardsPerSlide) * 0.1,
//                                                                 type: 'spring',
//                                                                 stiffness: 100,
//                                                             }}
//                                                             whileHover={{
//                                                                 y: -8,
//                                                                 scale: 1.02,
//                                                                 transition: { duration: 0.2 },
//                                                             }}
//                                                             className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 ${index.isViewAll
//                                                                 ? 'border-2 border-dashed border-blue-400 dark:border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
//                                                                 : ''
//                                                                 }`}
//                                                         >
//                                                             <div
//                                                                 className="h-2 w-full bg-gradient-to-r"
//                                                                 style={{
//                                                                     background: index.isViewAll
//                                                                         ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
//                                                                         : `linear-gradient(90deg, ${index.color || colorPalette[i % colorPalette.length]}, ${index.color || colorPalette[(i + 1) % colorPalette.length]}99)`
//                                                                 }}
//                                                             ></div>
//                                                             <div className="p-4 sm:p-5 lg:p-6 pb-6 sm:pb-8">
//                                                                 <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-1 sm:gap-2">
//                                                                     {index.isViewAll && (
//                                                                         <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                                         </svg>
//                                                                     )}
//                                                                     {index.index_name}
//                                                                 </h4>
//                                                                 {index.isViewAll ? (
//                                                                     <div className="text-center py-4 sm:py-6">
//                                                                         <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full flex items-center justify-center">
//                                                                             <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                                                             </svg>
//                                                                         </div>
//                                                                         <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
//                                                                             Explore all {indexNames.length} market indices
//                                                                         </p>
//                                                                         <button
//                                                                             onClick={handleViewAllIndices}
//                                                                             className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
//                                                                             aria-label="View all market indices"
//                                                                         >
//                                                                             View All Indices
//                                                                         </button>
//                                                                     </div>
//                                                                 ) : (
//                                                                     <>
//                                                                         <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
//                                                                             <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
//                                                                                 <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Market Cap</span>
//                                                                                 <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base lg:text-lg">
//                                                                                     {formatNumber(index.free_float_mcap)}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
//                                                                                 <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">1Y Return</span>
//                                                                                 <span
//                                                                                     className={`font-bold text-sm sm:text-base lg:text-lg ${index.return_1y >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
//                                                                                         }`}
//                                                                                 >
//                                                                                     {index.return_1y ? `${formatDecimal(index.return_1y * 100)}%` : 'N/A'}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
//                                                                                 <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">P/E Ratio</span>
//                                                                                 <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base lg:text-lg">
//                                                                                     {formatDecimal(index.pe)}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
//                                                                                 <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">P/B Ratio</span>
//                                                                                 <span className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base lg:text-lg">
//                                                                                     {formatDecimal(index.pb)}
//                                                                                 </span>
//                                                                             </div>
//                                                                         </div>
//                                                                         <button
//                                                                             onClick={() => handleViewDetails(index)}
//                                                                             className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-1 sm:gap-2"
//                                                                             aria-label={`View details for ${index.index_name}`}
//                                                                         >
//                                                                             <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                                             </svg>
//                                                                             View Details
//                                                                         </button>
//                                                                     </>
//                                                                 )}
//                                                             </div>
//                                                         </motion.div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                     {/* Desktop Navigation Buttons */}
//                                     <button
//                                         onClick={handlePrevSlide}
//                                         disabled={currentSlide === 0}
//                                         className={`absolute left-[-40px] sm:left-[-48px] lg:left-[-52px] top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 sm:p-3 lg:p-4 shadow-2xl transition-all duration-300 z-10 border border-gray-200 dark:border-gray-600 min-w-[44px] min-h-[44px] ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:scale-110 hover:shadow-2xl dark:hover:bg-gray-700'
//                                             }`}
//                                         aria-label="Previous slide"
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-700 dark:text-gray-300"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                         </svg>
//                                     </button>
//                                     <button
//                                         onClick={handleNextSlide}
//                                         disabled={currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1}
//                                         className={`absolute right-[-40px] sm:right-[-48px] lg:right-[-52px] top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 sm:p-3 lg:p-4 shadow-2xl transition-all duration-300 z-10 border border-gray-200 dark:border-gray-600 min-w-[44px] min-h-[44px] ${currentSlide === chunkArray(displayIndices, cardsPerSlide).length - 1
//                                             ? 'opacity-30 cursor-not-allowed'
//                                             : 'hover:bg-white hover:scale-110 hover:shadow-2xl dark:hover:bg-gray-700'
//                                             }`}
//                                         aria-label="Next slide"
//                                     >
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-700 dark:text-gray-300"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                         </svg>
//                                     </button>
//                                     {/* Desktop Pagination Dots */}
//                                     <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8 space-x-1 sm:space-x-2 lg:space-x-3">
//                                         {chunkArray(displayIndices, cardsPerSlide).map((_, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => goToSlide(index)}
//                                                 className={`relative transition-all duration-300 ${currentSlide === index
//                                                     ? 'w-5 sm:w-6 lg:w-8 bg-gradient-to-r from-blue-500 to-sky-600'
//                                                     : 'w-2 sm:w-2.5 lg:w-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
//                                                     } h-2 sm:h-2.5 lg:h-3 rounded-full min-w-[24px] min-h-[24px]`}
//                                                 aria-label={`Go to slide ${index + 1}`}
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     {/* Modal */}
//                     <AnimatePresence>
//                         {isModalOpen && selectedIndex && (
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 bg-black/60 backdrop-blur-sm"
//                                 role="dialog"
//                                 aria-modal="true"
//                                 aria-labelledby="modal-title"
//                             >
//                                 <motion.div
//                                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                                     exit={{ opacity: 0, scale: 0.9, y: 20 }}
//                                     className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[95vh] overflow-hidden border border-white/20 mx-2 sm:mx-0"
//                                 >
//                                     <div
//                                         className="h-1.5 sm:h-2 w-full bg-gradient-to-r"
//                                         style={{
//                                             background: `linear-gradient(90deg, ${selectedIndex.color || colorPalette[0]}, ${selectedIndex.color || colorPalette[1]}99)`,
//                                         }}
//                                     ></div>
//                                     <div className="p-4 sm:p-5 md:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-2rem)] sm:max-h-[calc(90vh-2rem)]">
//                                         <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
//                                             <div className="flex-1">
//                                                 <h3 id="modal-title" className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-gray-100 dark:to-blue-400 bg-clip-text text-transparent">
//                                                     {selectedIndex.index_name} Constituents
//                                                 </h3>
//                                                 <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
//                                                     Detailed breakdown of index components and performance metrics
//                                                 </p>
//                                             </div>
//                                             <button
//                                                 onClick={closeModal}
//                                                 className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg sm:rounded-xl transition-colors duration-200 group min-w-[44px] min-h-[44px]"
//                                                 aria-label="Close modal"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors"
//                                                     fill="none"
//                                                     viewBox="0 0 24 24"
//                                                     stroke="currentColor"
//                                                 >
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                                 </svg>
//                                             </button>
//                                         </div>
//                                         {/* Stats Grid */}
//                                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-lg sm:rounded-xl mb-4 sm:mb-6 md:mb-8 border border-gray-200 dark:border-gray-600">
//                                             {[
//                                                 { label: 'Market Cap', value: formatNumber(selectedIndex.free_float_mcap) },
//                                                 { label: 'P/E Ratio', value: formatDecimal(selectedIndex.pe) },
//                                                 { label: 'P/B Ratio', value: formatDecimal(selectedIndex.pb) },
//                                                 { label: 'Div Yield', value: `${formatDecimal(selectedIndex.dividend_yield * 100)}%` },
//                                             ].map((stat, index) => (
//                                                 <div key={index} className="text-center">
//                                                     <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1 md:mb-2">{stat.label}</p>
//                                                     <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
//                                                         {stat.value}
//                                                     </p>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                         {/* Search */}
//                                         <div className="relative mb-4 sm:mb-6">
//                                             <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
//                                                 <svg className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                                 </svg>
//                                             </div>
//                                             <input
//                                                 type="text"
//                                                 placeholder="Search by symbol or company name..."
//                                                 value={searchTerm}
//                                                 onChange={(e) => {
//                                                     setSearchTerm(e.target.value);
//                                                     setCurrentPage(1);
//                                                 }}
//                                                 className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                             />
//                                         </div>
//                                         {/* Table */}
//                                         <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
//                                             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                                                 <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
//                                                     <tr>
//                                                         {['Symbol', 'Company', 'Price (₹)', 'P/E', 'Weight (%)'].map((header) => (
//                                                             <th
//                                                                 key={header}
//                                                                 className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
//                                                             >
//                                                                 {header}
//                                                             </th>
//                                                         ))}
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                                                     {currentConstituents.length > 0 ? (
//                                                         currentConstituents.map((constituent, idx) => (
//                                                             <motion.tr
//                                                                 key={idx || constituent.Symbol}
//                                                                 initial={{ opacity: 0 }}
//                                                                 animate={{ opacity: 1 }}
//                                                                 transition={{ delay: idx * 0.05 }}
//                                                                 onClick={() => onRowClick(constituent.Symbol)}
//                                                                 className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 cursor-pointer transition-all duration-200 group"
//                                                                 role="button"
//                                                                 tabIndex={0}
//                                                                 onKeyPress={(e) => e.key === 'Enter' && onRowClick(constituent.Symbol)}
//                                                             >
//                                                                 <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                                                                         {constituent.Symbol}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-none">
//                                                                         {constituent.CompanyName}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
//                                                                         {formatDecimal(constituent.Price)}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">
//                                                                         {formatDecimal(constituent.PE)}
//                                                                     </div>
//                                                                 </td>
//                                                                 <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 whitespace-nowrap">
//                                                                     <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
//                                                                         {formatDecimal(constituent.WeightPct)}
//                                                                     </div>
//                                                                 </td>
//                                                             </motion.tr>
//                                                         ))
//                                                     ) : (
//                                                         <tr>
//                                                             <td colSpan="5" className="px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 text-center">
//                                                                 <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
//                                                                     <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 mb-2 sm:mb-3 md:mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                                     </svg>
//                                                                     <p className="text-xs sm:text-sm md:text-lg font-medium">No constituents found</p>
//                                                                     <p className="text-xs sm:text-sm">Try adjusting your search terms</p>
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     )}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                         {/* Pagination */}
//                                         {filteredConstituents.length > itemsPerPage && (
//                                             <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4 md:mt-6 gap-2 sm:gap-3 md:gap-4">
//                                                 <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium text-center sm:text-left">
//                                                     Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredConstituents.length)} of {filteredConstituents.length} constituents
//                                                 </div>
//                                                 <div className="flex items-center gap-1 sm:gap-2">
//                                                     <button
//                                                         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                                                         disabled={currentPage === 1}
//                                                         className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-1 text-xs sm:text-sm min-w-[44px] min-h-[44px]"
//                                                         aria-label="Previous page"
//                                                     >
//                                                         <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                                         </svg>
//                                                         <span className="hidden sm:inline">Previous</span>
//                                                     </button>
//                                                     <div className="flex gap-1 sm:gap-2">
//                                                         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                                                             let pageNum;
//                                                             if (totalPages <= 5) {
//                                                                 pageNum = i + 1;
//                                                             } else if (currentPage <= 3) {
//                                                                 pageNum = i + 1;
//                                                             } else if (currentPage >= totalPages - 2) {
//                                                                 pageNum = totalPages - 4 + i;
//                                                             } else {
//                                                                 pageNum = currentPage - 2 + i;
//                                                             }
//                                                             return (
//                                                                 <button
//                                                                     key={i}
//                                                                     onClick={() => setCurrentPage(pageNum)}
//                                                                     className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm min-w-[36px] min-h-[36px] ${currentPage === pageNum
//                                                                         ? 'bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-lg'
//                                                                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
//                                                                         }`}
//                                                                     aria-label={`Go to page ${pageNum}`}
//                                                                 >
//                                                                     {pageNum}
//                                                                 </button>
//                                                             );
//                                                         })}
//                                                     </div>
//                                                     <button
//                                                         onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                                                         disabled={currentPage === totalPages}
//                                                         className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center gap-1 text-xs sm:text-sm min-w-[44px] min-h-[44px]"
//                                                         aria-label="Next page"
//                                                     >
//                                                         <span className="hidden sm:inline">Next</span>
//                                                         <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                                         </svg>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </motion.div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MarketIndices;