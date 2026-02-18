// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const IndustryDividendModal = ({ selectedIndustryFromBanner = null, onClose }) => {
//   const [dividendData, setDividendData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedYear, setSelectedYear] = useState('all');
//   const [industryName, setIndustryName] = useState(selectedIndustryFromBanner || '');
//   const [currentScroll, setCurrentScroll] = useState(0);
//   const navigate = useNavigate();

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const commonIndustries = [
//     'Bearings', 'Automobile', 'Banking', 'IT', 'Pharmaceuticals',
//     'Steel', 'Cement', 'FMCG', 'Oil & Gas', 'Telecom', 'Real Estate',
//     'Chemicals', 'Power', 'Textiles', 'Aviation', 'Retail', 'Insurance'
//   ];

//   // Update industry name when banner selection changes
//   useEffect(() => {
//     if (selectedIndustryFromBanner) {
//       setIndustryName(selectedIndustryFromBanner);
//     }
//   }, [selectedIndustryFromBanner]);

//   // Fetch data when component mounts or industry changes
//   useEffect(() => {
//     if (industryName) {
//       fetchDividendData();
//     }
//   }, [industryName]);

//   const fetchDividendData = async () => {
//     if (!industryName) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(`${API_BASE}/industries/dividend?name=${encodeURIComponent(industryName)}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       if (result.status === 'success') {
//         setDividendData(result.data || []);
//       } else {
//         throw new Error(result.message || 'Failed to fetch data');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching dividend data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleIndustryChange = (newIndustry) => {
//     setIndustryName(newIndustry);
//     setCurrentScroll(0);
//   };

//   const handleCompanyClick = (symbol) => {
//     navigate(`/equityinsights?symbol=${encodeURIComponent(symbol)}`);
//     onClose(); // Close modal when navigating to company details
//   };

//   const scrollLeft = () => {
//     const container = document.getElementById('industries-scroll-container');
//     if (container) {
//       const newScroll = Math.max(0, currentScroll - 300);
//       container.scrollTo({ left: newScroll, behavior: 'smooth' });
//       setCurrentScroll(newScroll);
//     }
//   };

//   const scrollRight = () => {
//     const container = document.getElementById('industries-scroll-container');
//     if (container) {
//       const maxScroll = container.scrollWidth - container.clientWidth;
//       const newScroll = Math.min(maxScroll, currentScroll + 300);
//       container.scrollTo({ left: newScroll, behavior: 'smooth' });
//       setCurrentScroll(newScroll);
//     }
//   };

//   // Get unique years for filter
//   const uniqueYears = [...new Set(dividendData.map(item => item.Year_end))].sort((a, b) => b - a);

//   // Filter data based on selected year
//   const filteredData = selectedYear === 'all'
//     ? dividendData
//     : dividendData.filter(item => item.Year_end === parseInt(selectedYear));

//   // Group data by company symbol and get latest year data for each company
//   const companiesMap = filteredData.reduce((acc, item) => {
//     if (!acc[item.SYMBOL] || item.Year_end > acc[item.SYMBOL].Year_end) {
//       acc[item.SYMBOL] = item;
//     }
//     return acc;
//   }, {});

//   // Convert to array and sort by MarketCap (descending)
//   const companies = Object.values(companiesMap)
//     .sort((a, b) => (b.MarketCap || 0) - (a.MarketCap || 0));

//   if (loading) {
//     return (
//       <div className="min-h-96 flex items-center justify-center p-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 dark:text-gray-300">
//             Loading {industryName || 'industry'} dividend data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-96 flex items-center justify-center p-8">
//         <div className="text-center max-w-md mx-auto">
//           <div className="relative mb-8">
//             <div className="w-24 h-24 mx-auto mb-4 relative">
//               <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl animate-pulse"></div>
//               <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
//                 <div className="relative">
//                   <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
//                 Data Not Available
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Unable to load {industryName} dividend information.
//               </p>
//             </div>

//             <div className="flex flex-col space-y-3">
//               <button
//                 onClick={fetchDividendData}
//                 className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transform hover:scale-105 active:scale-95"
//               >
//                 <span className="flex items-center justify-center space-x-2">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   <span>Retry Loading</span>
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Industry Selector with Horizontal Scroll */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//             {industryName || 'Select Industry'}
//           </h2>
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             {companies.length} companies
//           </span>
//         </div>

//         <div className="relative">
//           {/* Scroll Buttons */}
//           <button
//             onClick={scrollLeft}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
//           >
//             <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
//           </button>

//           <button
//             onClick={scrollRight}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
//           >
//             <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
//           </button>

//           {/* Industries Scroll Container */}
//           <div
//             id="industries-scroll-container"
//             className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-2 -mx-2 scroll-smooth"
//             style={{ scrollBehavior: 'smooth' }}
//           >
//             {commonIndustries.map(industry => (
//               <button
//                 key={industry}
//                 className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${industryName === industry
//                   ? 'bg-sky-600 text-white shadow-md'
//                   : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   }`}
//                 onClick={() => handleIndustryChange(industry)}
//               >
//                 {industry}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Year Filter */}
//       <div className="flex items-center gap-4 mb-6">
//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//           className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
//         >
//           <option value="all">All Years</option>
//           {uniqueYears.map(year => (
//             <option key={year} value={year}>{year}</option>
//           ))}
//         </select>

//         <div className="text-sm text-gray-500 dark:text-gray-400">
//           Showing {companies.length} companies
//         </div>
//       </div>

//       {/* Companies Grid */}
//       {companies.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
//           {companies.map((company, index) => (
//             <CompanyCard
//               key={`${company.SYMBOL}-${index}`}
//               company={company}
//               onClick={() => handleCompanyClick(company.SYMBOL)}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
//           <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
//             No Data Available
//           </h3>
//           <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
//             No dividend data found for {industryName}. Try selecting a different industry or year.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// const CompanyCard = ({ company, onClick }) => {
//   const formatNumber = (num) => {
//     if (num === null || num === undefined) return 'N/A';
//     if (num >= 1000000000) return `₹${(num / 1000000000).toFixed(1)}B`;
//     if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
//     if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
//     return `₹${num?.toLocaleString('en-IN')}`;
//   };

//   const formatPercentage = (num) => {
//     if (num === null || num === undefined) return 'N/A';
//     return `${num.toFixed(1)}%`;
//   };

//   const formatCurrency = (num) => {
//     if (num === null || num === undefined) return 'N/A';
//     return `₹${num.toFixed(1)}`;
//   };

//   return (
//     <div
//       onClick={onClick}
//       className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700  hover:shadow-xl transition-all cursor-pointer group"
//     >
//       {/* Header */}
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-1">
//             <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
//               {company.SYMBOL}
//             </h3>
//             <span className="px-2 py-1 text-xs bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded">
//               FY {company.Year_end}
//             </span>
//           </div>
//           <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
//             {company.COMPNAME}
//           </p>
//         </div>
//       </div>

//       {/* Main Metric */}
//       <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
//         <div className="text-center">
//           <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Dividend Yield</div>
//           <div className="text-xl font-bold text-green-600 dark:text-green-400">
//             {formatPercentage(company.DividendYield)}
//           </div>
//         </div>
//       </div>

//       {/* Secondary Metrics */}
//       <div className="grid grid-cols-2 gap-3">
//         <div className="text-center">
//           <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">DPS</div>
//           <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//             {formatCurrency(company.DPS)}
//           </div>
//         </div>
//         <div className="text-center">
//           <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</div>
//           <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//             {formatCurrency(company.Price)}
//           </div>
//         </div>
//         <div className="text-center col-span-2">
//           <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
//           <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//             {formatNumber(company.MarketCap)}
//           </div>
//         </div>
//       </div>

//       {/* View Details Hint */}
//       <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-center gap-1 text-xs text-sky-600 dark:text-sky-400 group-hover:gap-2 transition-all">
//           <span>View details</span>
//           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IndustryDividendModal;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const IndustryDividendModal = ({ selectedIndustryFromBanner = null, onClose }) => {
//   const [dividendData, setDividendData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedYear, setSelectedYear] = useState('all');
//   const [industryName, setIndustryName] = useState(selectedIndustryFromBanner || '');
//   const [currentScroll, setCurrentScroll] = useState(0);
//   const navigate = useNavigate();

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const commonIndustries = [
//     'Bearings', 'Automobile', 'Bank', 'IT', 'Pharmaceuticals & Drugs', 'Auto Ancillary',
//     'Steel', 'Cement', 'Telecom', 'Real Estate',
//     'Chemicals', 'Power', 'Textile', 'Retail', 'Insurance'
//   ];


//   const formatPeriod = (periodString) => {
//     if (periodString.length === 6) {
//       const year = periodString.substring(0, 4);
//       const month = periodString.substring(4, 6);
//       const monthNames = ['Mar', 'Jun', 'Sep', 'Dec']; // Common financial periods
//       const monthIndex = ['03', '06', '09', '12'].indexOf(month);
//       return monthIndex !== -1 ? `${monthNames[monthIndex]} ${year}` : `Mar ${year}`;
//     }
//     return periodString;

//   };
//   // Update industry name when banner selection changes
//   useEffect(() => {
//     if (selectedIndustryFromBanner) {
//       setIndustryName(selectedIndustryFromBanner);
//     }
//   }, [selectedIndustryFromBanner]);

//   // Fetch data when component mounts or industry changes
//   useEffect(() => {
//     if (industryName) {
//       fetchDividendData();
//     }
//   }, [industryName]);

//   const fetchDividendData = async () => {
//     if (!industryName) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(`${API_BASE}/industries/dividend?name=${encodeURIComponent(industryName)}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       if (result.status === 'success') {
//         setDividendData(result.data || []);
//       } else {
//         throw new Error(result.message || 'Failed to fetch data');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching dividend data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleIndustryChange = (newIndustry) => {
//     setIndustryName(newIndustry);
//     setCurrentScroll(0);
//   };

//   const handleCompanyClick = (symbol) => {
//     navigate(`/equityinsights?symbol=${encodeURIComponent(symbol)}`);
//     onClose(); // Close modal when navigating to company details
//   };

//   const scrollLeft = () => {
//     const container = document.getElementById('industries-scroll-container');
//     if (container) {
//       const newScroll = Math.max(0, currentScroll - 300);
//       container.scrollTo({ left: newScroll, behavior: 'smooth' });
//       setCurrentScroll(newScroll);
//     }
//   };

//   const scrollRight = () => {
//     const container = document.getElementById('industries-scroll-container');
//     if (container) {
//       const maxScroll = container.scrollWidth - container.clientWidth;
//       const newScroll = Math.min(maxScroll, currentScroll + 300);
//       container.scrollTo({ left: newScroll, behavior: 'smooth' });
//       setCurrentScroll(newScroll);
//     }
//   };

//   // Get unique years for filter
//   // const uniqueYears = [...new Set(dividendData.map(item => item.Year_end))].sort((a, b) => b - a);

//   // // Filter data based on selected year
//   // const filteredData = selectedYear === 'all'
//   //   ? dividendData
//   //   : dividendData.filter(item => item.Year_end === parseInt(selectedYear));

//   // // Group data by company symbol and get latest year data for each company
//   // const companiesMap = filteredData.reduce((acc, item) => {
//   //   if (!acc[item.SYMBOL] || item.Year_end > acc[item.SYMBOL].Year_end) {
//   //     acc[item.SYMBOL] = item;
//   //   }
//   //   return acc;
//   // }, {});



//   const uniqueYears = [...new Set(dividendData.map(item => item.Year_end))].sort((a, b) => b - a);

//   // Filter data based on selected year
//   const filteredData = selectedYear === 'all'
//     ? dividendData
//     : dividendData.filter(item => item.Year_end.toString() === selectedYear.toString());

//   // Group data by company symbol and get latest year data for each company
//   const companiesMap = filteredData.reduce((acc, item) => {
//     if (!acc[item.SYMBOL] || item.Year_end > acc[item.SYMBOL].Year_end) {
//       acc[item.SYMBOL] = item;
//     }
//     return acc;
//   }, {});


//   // Convert to array and sort by MarketCap (descending)
//   const companies = Object.values(companiesMap)
//     .sort((a, b) => (b.MarketCap || 0) - (a.MarketCap || 0));

//   if (loading) {
//     return (
//       <div className="min-h-96 flex items-center justify-center p-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 dark:text-gray-300">
//             Loading {industryName || 'industry'} dividend data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-96 flex items-center justify-center p-8">
//         <div className="text-center max-w-md mx-auto">
//           <div className="relative mb-8">
//             <div className="w-24 h-24 mx-auto mb-4 relative">
//               <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl animate-pulse"></div>
//               <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
//                 <div className="relative">
//                   <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
//                 Data Not Available
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Unable to load {industryName} dividend information.
//               </p>
//             </div>

//             <div className="flex flex-col space-y-3">
//               <button
//                 onClick={fetchDividendData}
//                 className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transform hover:scale-105 active:scale-95"
//               >
//                 <span className="flex items-center justify-center space-x-2">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   <span>Retry Loading</span>
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Industry Selector with Horizontal Scroll */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//             {industryName || 'Select Industry'}
//           </h2>
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             {companies.length} companies
//           </span>
//         </div>

//         <div className="relative">
//           {/* Scroll Buttons */}
//           <button
//             onClick={scrollLeft}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
//           >
//             <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
//           </button>

//           <button
//             onClick={scrollRight}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
//           >
//             <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
//           </button>

//           {/* Industries Scroll Container */}
//           <div
//             id="industries-scroll-container"
//             className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-2 -mx-2 scroll-smooth"
//             style={{ scrollBehavior: 'smooth' }}
//           >
//             {commonIndustries.map(industry => (
//               <button
//                 key={industry}
//                 className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${industryName === industry
//                   ? 'bg-sky-600 text-white shadow-md'
//                   : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
//                   }`}
//                 onClick={() => handleIndustryChange(industry)}
//               >
//                 {industry}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Year Filter */}
//       {/* <div className="flex items-center gap-4 mb-6">
//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//           className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
//         >
//           <option value="all">All Years</option>
//           {uniqueYears.map(year => (
//             <option key={year} value={year}>{year}</option>
//           ))}
//         </select>

//         <div className="text-sm text-gray-500 dark:text-gray-400">
//           Showing {companies.length} companies
//         </div>
//       </div> */}


//       <div className="flex items-center gap-4 mb-6">
//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//           className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
//         >
//           <option value="all">All Financial Years</option>
//           {uniqueYears.map(year => (
//             <option key={year} value={year}>
//               {formatPeriod(year.toString())}
//             </option>
//           ))}
//         </select>

//         <div className="text-sm text-gray-500 dark:text-gray-400">
//           Showing {companies.length} companies
//         </div>
//       </div>

//       {/* Companies Grid */}
//       {companies.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
//           {companies.map((company, index) => (
//             <CompanyCard
//               key={`${company.SYMBOL}-${index}`}
//               company={company}
//               onClick={() => handleCompanyClick(company.SYMBOL)}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
//           <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
//             No Data Available
//           </h3>
//           <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
//             No dividend data found for {industryName}. Try selecting a different industry or year.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// const CompanyCard = ({ company, onClick }) => {
//   const formatNumber = (num) => {
//     if (num === null || num === undefined) return 'N/A';
//     if (num >= 1000000000) return `₹${(num / 1000000000).toFixed(1)}B`;
//     if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
//     if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
//     return `₹${num?.toLocaleString('en-IN')}`;
//   };

//   const formatPercentage = (num) => {
//     if (num === null || num === undefined) return 'N/A';
//     return `${num.toFixed(1)}%`;
//   };

//   const formatCurrency = (num) => {
//     if (num === null || num === undefined) return 'N/A';
//     return `₹${num.toFixed(1)}`;
//   };

//   const formatPeriod = (periodString) => {
//     if (periodString && periodString.length === 6) {
//       const year = periodString.substring(0, 4);
//       const month = periodString.substring(4, 6);
//       const monthNames = ['Mar', 'Jun', 'Sep', 'Dec'];
//       const monthIndex = ['03', '06', '09', '12'].indexOf(month);
//       return monthIndex !== -1 ? `${monthNames[monthIndex]} ${year}` : `Mar ${year}`;
//     }
//     return periodString;
//   };

//   return (
//     <div
//       onClick={onClick}
//       className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-sky-200 dark:hover:border-sky-600 transition-all duration-300 cursor-pointer group"
//     >
//       {/* Header */}
//       <div className="p-4 pb-3">
//         <div className="flex items-start justify-between mb-2">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 mb-1">
//               <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
//                 {company.SYMBOL}
//               </h3>
//               {/* <span className="px-2 py-1 text-xs bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded-full font-medium shrink-0">
//                 FY {company.Year_end}
//               </span> */}
//               <span className="px-2 py-1 text-xs bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded-full font-medium shrink-0">
//                 {formatPeriod(company.Year_end.toString())}
//               </span>
//             </div>
//             <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-tight">
//               {company.COMPNAME}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Metric - Dividend Yield */}
//       {/* <div className="px-4 mb-4">
//         <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 group-hover:shadow-md transition-shadow">
//           <div className="text-center">
//             <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Dividend Yield</div>
//             <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//               {formatPercentage(company.DividendYield)}
//             </div>
//           </div>
//         </div>
//       </div> */}
//       <div className="px-4 mb-4">
//         <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-green-900 group-hover:shadow-md transition-all duration-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
//                 Dividend Yield
//               </div>
//             </div>
//             <div className="text-base font-bold text-gray-900 dark:text-white">
//               {formatPercentage(company.DividendYield)}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Financial Metrics Grid */}
//       <div className="px-4 mb-4">
//         <div className="grid grid-cols-3 gap-3">
//           {/* DPS */}
//           <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//             <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">DPS</div>
//             <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//               {formatCurrency(company.DPS)}
//             </div>
//           </div>

//           {/* EPS */}
//           <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//             <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">EPS</div>
//             <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//               {formatCurrency(company.EPS)}
//             </div>
//           </div>

//           {/* Price */}
//           <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//             <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Price</div>
//             <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//               {formatCurrency(company.Price)}
//             </div>
//           </div>

//           {/* Price Change */}
//           <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//             <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Change</div>
//             <div className={`text-sm font-semibold ${company.PriceChange >= 0
//               ? "text-green-600 dark:text-green-400"
//               : "text-red-600 dark:text-red-400"
//               }`}>
//               {company.PriceChange >= 0 ? '+' : ''}{formatCurrency(company.PriceChange)}
//             </div>
//           </div>

//           {/* Market Cap - Full Width */}
//           <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg col-span-2">
//             <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
//             <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//               {formatNumber(company.MarketCap)}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer with CTA */}
//       <div className="px-4 pt-3 pb-4 border-t border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-center gap-2 text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
//           <span className="text-sm font-medium">View details</span>
//           <svg
//             className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IndustryDividendModal;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IndustryDividendModal = ({ selectedIndustryFromBanner = null, onClose }) => {
  const [dividendData, setDividendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [industryName, setIndustryName] = useState(selectedIndustryFromBanner || '');
  const [currentScroll, setCurrentScroll] = useState(0);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const commonIndustries = [
    'Bearings', 'Automobile', 'Bank', 'IT', 'Pharmaceuticals & Drugs', 'Auto Ancillary',
    'Steel', 'Cement', 'Telecom', 'Real Estate',
    'Chemicals', 'Power', 'Textile', 'Retail', 'Insurance'
  ];

  const formatPeriod = (periodString) => {
    if (periodString.length === 6) {
      const year = periodString.substring(0, 4);
      const month = periodString.substring(4, 6);
      const monthNames = ['Mar', 'Jun', 'Sep', 'Dec'];
      const monthIndex = ['03', '06', '09', '12'].indexOf(month);
      return monthIndex !== -1 ? `${monthNames[monthIndex]} ${year}` : `Mar ${year}`;
    }
    return periodString;
  };

  // Update industry name when banner selection changes
  useEffect(() => {
    if (selectedIndustryFromBanner) {
      setIndustryName(selectedIndustryFromBanner);
    }
  }, [selectedIndustryFromBanner]);

  // Fetch data when component mounts or industry changes
  useEffect(() => {
    if (industryName) {
      fetchDividendData();
    }
  }, [industryName]);

  const fetchDividendData = async () => {
    if (!industryName) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/industries/dividend?name=${encodeURIComponent(industryName)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        setDividendData(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dividend data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryChange = (newIndustry) => {
    setIndustryName(newIndustry);
    setCurrentScroll(0);
  };

  const handleCompanyClick = (symbol) => {
    navigate(`/equityinsights?symbol=${encodeURIComponent(symbol)}`);
    onClose();
  };

  const scrollLeft = () => {
    const container = document.getElementById('industries-scroll-container');
    if (container) {
      const newScroll = Math.max(0, currentScroll - 300);
      container.scrollTo({ left: newScroll, behavior: 'smooth' });
      setCurrentScroll(newScroll);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('industries-scroll-container');
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newScroll = Math.min(maxScroll, currentScroll + 300);
      container.scrollTo({ left: newScroll, behavior: 'smooth' });
      setCurrentScroll(newScroll);
    }
  };

  const uniqueYears = [...new Set(dividendData.map(item => item.Year_end))].sort((a, b) => b - a);

  // Filter data based on selected year
  const filteredData = selectedYear === 'all'
    ? dividendData
    : dividendData.filter(item => item.Year_end.toString() === selectedYear.toString());

  // Group data by company symbol and get latest year data for each company
  const companiesMap = filteredData.reduce((acc, item) => {
    if (!acc[item.SYMBOL] || item.Year_end > acc[item.SYMBOL].Year_end) {
      acc[item.SYMBOL] = item;
    }
    return acc;
  }, {});

  // Convert to array and sort by MarketCap (descending)
  const companies = Object.values(companiesMap)
    .sort((a, b) => (b.MarketCap || 0) - (a.MarketCap || 0));

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading {industryName || 'industry'} dividend data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Data Not Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Unable to load {industryName} dividend information.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={fetchDividendData}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Retry Loading</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Industry Selector with Horizontal Scroll */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {industryName || 'Select Industry'}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {companies.length} companies
          </span>
        </div>

        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          {/* Industries Scroll Container */}
          <div
            id="industries-scroll-container"
            className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-2 -mx-2 scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {commonIndustries.map(industry => (
              <button
                key={industry}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${industryName === industry
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                onClick={() => handleIndustryChange(industry)}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        >
          <option value="all">All Financial Years</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>
              {formatPeriod(year.toString())}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {companies.length} companies
        </div>
      </div>

      {/* Companies Grid */}
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {companies.map((company, index) => (
            <CompanyCard
              key={`${company.SYMBOL}-${index}`}
              company={company}
              onClick={() => handleCompanyClick(company.SYMBOL)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            No dividend data found for {industryName}. Try selecting a different industry or year.
          </p>
        </div>
      )}
    </div>
  );
};

const CompanyCard = ({ company, onClick }) => {
  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1000000000) return `₹${(num / 1000000000).toFixed(1)}B`;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num?.toLocaleString('en-IN')}`;
  };

  const formatPercentage = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return `${num.toFixed(1)}%`;
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return `₹${num.toFixed(1)}`;
  };

  const formatPeriod = (periodString) => {
    if (periodString && periodString.length === 6) {
      const year = periodString.substring(0, 4);
      const month = periodString.substring(4, 6);
      const monthNames = ['Mar', 'Jun', 'Sep', 'Dec'];
      const monthIndex = ['03', '06', '09', '12'].indexOf(month);
      return monthIndex !== -1 ? `${monthNames[monthIndex]} ${year}` : `Mar ${year}`;
    }
    return periodString;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-sky-200 dark:hover:border-sky-600 transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                {company.SYMBOL}
              </h3>
              <span className="px-2 py-1 text-xs bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded-full font-medium shrink-0">
                {formatPeriod(company.Year_end.toString())}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-tight">
              {company.COMPNAME}
            </p>
          </div>
        </div>
      </div>

      {/* Dividend Yield */}
      <div className="px-4 mb-4">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 group-hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                Dividend Yield
              </div>
            </div>
            <div className="text-base font-bold text-gray-900 dark:text-white">
              {formatPercentage(company.DividendYield)}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metrics Grid */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          {/* DPS */}
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">DPS</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(company.DPS)}
            </div>
          </div>

          {/* EPS */}
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">EPS</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(company.EPS)}
            </div>
          </div>

          {/* Price */}
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Price</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(company.Price)}
            </div>
          </div>

          {/* Price Change */}
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Change</div>
            <div className={`text-sm font-semibold ${company.PriceChange >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
              }`}>
              {company.PriceChange >= 0 ? '+' : ''}{formatCurrency(company.PriceChange)}
            </div>
          </div>

          {/* Market Cap - Full Width */}
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg col-span-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatNumber(company.MarketCap)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with CTA */}
      <div className="px-4 pt-3 pb-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
          <span className="text-sm font-medium">View details</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default IndustryDividendModal;