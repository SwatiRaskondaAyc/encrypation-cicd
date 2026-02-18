
// import React, { useEffect, useState } from 'react';


// import Slider from 'react-slick';
// import axios from 'axios';
// import IndiceCard from './IndiceCard';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { MdNavigateNext } from 'react-icons/md';
// import { GrFormPrevious } from 'react-icons/gr';
// import { IoMdClose } from 'react-icons/io';
// import { FaSortUp, FaSortDown } from 'react-icons/fa';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { HashLoader } from 'react-spinners';
// import {
//   FaIndustry, FaTruck, FaCar, FaBuilding, FaTshirt, FaHotel, FaFlask, FaCouch,
//   FaLeaf, FaMoneyBillWave, FaChartLine, FaShoppingCart, FaLightbulb, FaBolt,
//   FaHeartbeat, FaStar, FaOilCan, FaBroadcastTower, FaUniversity, FaGem, FaBox,
//   FaExchangeAlt, FaTools, FaFilm, FaLaptop, FaUserTie, FaHardHat, FaShoppingBag,
//   FaFileAlt, FaBoxOpen, FaMountain, FaWineBottle, FaGasPump, FaSubway, FaCog,
//   FaPlane, FaGraduationCap, FaShip, FaShieldAlt, FaCamera, FaPuzzlePiece
// } from 'react-icons/fa';

// let sectorCache = null;

// const metrics = [
//   { key: 'SectorPE_Mode', label: 'PE Ratio', description: 'Price-to-Earnings ratio indicates valuation' },
//   { key: 'SectorCAGR_TTM_YoY', label: '1Y CAGR', description: '1-year compound annual growth rate' },
//   { key: 'SectorEPS', label: 'EPS', description: 'Earnings Per Share for the sector' },
//   { key: 'SectorDividendYield', label: 'DividendYield', description: 'Dividend Yield for the sector' },
//   { key: 'SectorPE_Min', label: 'SectorPE_Min', description: 'Minimum Price-to-Earnings for the sector' },
//   { key: 'SectorPE_Max', label: 'SectorPE_Max', description: 'Maximum Price-to-Earnings for the sector' },
//   { key: 'SectorMarketCap', label: 'Market Cap', description: 'Total market valuation' },
//   { key: 'Total', label: 'Total Companies', description: 'Number of companies in sector' },
// ];

// const SectorIcons = {
//   'Capital Goods': <FaIndustry />,
//   'Logistics': <FaTruck />,
//   'Automobile & Ancillaries': <FaCar />,
//   'Realty': <FaBuilding />,
//   'Textile': <FaTshirt />,
//   'Hospitality': <FaHotel />,
//   'Chemicals': <FaFlask />,
//   'Consumer Durables': <FaCouch />,
//   'Agri': <FaLeaf />,
//   'Finance': <FaMoneyBillWave />,
//   'Diversified': <FaChartLine />,
//   'FMCG': <FaShoppingCart />,
//   'Electricals': <FaLightbulb />,
//   'Power': <FaBolt />,
//   'Healthcare': <FaHeartbeat />,
//   'Ratings': <FaStar />,
//   'Crude Oil': <FaOilCan />,
//   'Telecom': <FaBroadcastTower />,
//   'Bank': <FaUniversity />,
//   'Iron & Steel': <FaCog />,
//   'Diamond & Jewellery': <FaGem />,
//   'Plastic Products': <FaBox />,
//   'Trading': <FaExchangeAlt />,
//   'Infrastructure': <FaTools />,
//   'Media & Entertainment': <FaFilm />,
//   'IT': <FaLaptop />,
//   'Business Services': <FaUserTie />,
//   'Construction Materials': <FaHardHat />,
//   'Retailing': <FaShoppingBag />,
//   'Paper': <FaFileAlt />,
//   'Miscellaneous': <FaBoxOpen />,
//   'Mining': <FaMountain />,
//   'Abrasives': <FaTools />,
//   'Alcohol': <FaWineBottle />,
//   'Inds. Gases & Fuels': <FaGasPump />,
//   'Gas Transmission': <FaSubway />,
//   'Ferro Manganese': <FaCog />,
//   'Aviation': <FaPlane />,
//   'ETF': <FaChartLine />,
//   'Education & Training': <FaGraduationCap />,
//   'Ship Building': <FaShip />,
//   'Insurance': <FaShieldAlt />,
//   'Photographic Product': <FaCamera />,
//   'Others': <FaPuzzlePiece />
// };

// const NextArrow = ({ onClick }) => (
//   <div
//     className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-sky-50 group transition-all duration-200 hover:shadow-lg hover:scale-105"
//     onClick={onClick}
//   >
//     <FaChevronRight className="text-gray-600 text-lg group-hover:text-sky-600 transition-colors" />
//   </div>
// );

// const PrevArrow = ({ onClick }) => (
//   <div
//     className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-sky-50 group transition-all duration-200 hover:shadow-lg hover:scale-105"
//     onClick={onClick}
//   >
//     <FaChevronLeft className="text-gray-600 text-lg group-hover:text-sky-600 transition-colors" />
//   </div>
// );

// const SectorSummary = () => {
//   // const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [sectors, setSectors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showSlider, setShowSlider] = useState(true);
//   const [selectedSector, setSelectedSector] = useState(null);
//   const [selectedMetric, setSelectedMetric] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [sortKey, setSortKey] = useState('PE');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [companyQuery, setCompanyQuery] = useState('');
//   const [sectorQuery, setSectorQuery] = useState('');
//   const [rotationOffset, setRotationOffset] = useState(0);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const selectedSymbol = searchParams.get('symbol');

//   useEffect(() => {
//     const fetchSectors = async () => {
//       try {
//         if (sectorCache) {
//           console.log('Using cached sector data:', sectorCache);
//           const validSectors = sectorCache
//             .filter((sector) => sector && sector.Sector && typeof sector.SectorCAGR_TTM_YoY === 'number')
//             .sort((a, b) => b.SectorCAGR_TTM_YoY - a.SectorCAGR_TTM_YoY);
//           if (validSectors.length === 0) {
//             throw new Error('No valid sectors with CAGR data found in cache');
//           }
//           setSectors(validSectors);
//           setSelectedSector(validSectors[0] || null);
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(`${API_BASE}/landpage/sector-summary`);
//         console.log('API response:', response.data);
//         const validSectors = response.data
//           .filter((sector) => sector && sector.Sector && typeof sector.SectorCAGR_TTM_YoY === 'number')
//           .sort((a, b) => b.SectorCAGR_TTM_YoY - a.SectorCAGR_TTM_YoY);
//         if (validSectors.length === 0) {
//           throw new Error('No valid sectors with CAGR data found');
//         }

//         sectorCache = response.data;
//         setSectors(validSectors);
//         setSelectedSector(validSectors[0] || null);
//       } catch (error) {
//         console.error('Error fetching sector data:', error);
//         setError(error.message || 'Failed to fetch sector data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSectors();
//   }, [API_BASE]);

//   const removeSymbolFromURL = () => {
//     searchParams.delete('symbol');
//     setSearchParams(searchParams);
//   };

//   const onRowClick = (symbol) => {
//     navigate(`/equityhub?symbol=${symbol}`);
//   };

//   const filteredSectors = sectors.filter((sector) =>
//     sector.Sector.toLowerCase().includes(sectorQuery.toLowerCase())
//   );

//   const sliderSettings = {
//     infinite: true,
//     speed: 600,
//     slidesToShow: Math.min(4, filteredSectors.length),
//     slidesToScroll: 1,
//     autoplay: false,
//     pauseOnHover: true,
//     appendDots: dots => (
//       <div style={{ marginTop: "5px", display: "flex", justifyContent: "center" }}>
//         <ul style={{ margin: "0px", padding: "0", display: "flex", gap: "4px" }}>
//           {dots.map((dot, index) => (
//             <li key={index} style={{ margin: "0", padding: "0" }}>
//               {React.cloneElement(dot, { style: { width: "8px", height: "8px", margin: "0" } })}
//             </li>
//           ))}
//         </ul>
//       </div>
//     ),
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       { breakpoint: 1280, settings: { slidesToShow: Math.min(3, filteredSectors.length) } },
//       { breakpoint: 1024, settings: { slidesToShow: Math.min(2, filteredSectors.length) } },
//       { breakpoint: 640, settings: { slidesToShow: 1 } },
//     ],
//   };

//   const handlePrevClick = () => {
//     const newIndex = selectedMetric
//       ? (metrics.findIndex((m) => m.key === selectedMetric.key) - 1 + metrics.length) % metrics.length
//       : 0;
//     setSelectedMetric(metrics[newIndex]);
//     setRotationOffset((prev) => prev + (360 / metrics.length));
//   };

//   const handleNextClick = () => {
//     const newIndex = selectedMetric
//       ? (metrics.findIndex((m) => m.key === selectedMetric.key) + 1) % metrics.length
//       : 0;
//     setSelectedMetric(metrics[newIndex]);
//     setRotationOffset((prev) => prev - (360 / metrics.length));
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCompanyQuery('');
//     setSortKey('PE');
//     setSortOrder('desc');
//   };

//   const formatValue = (value, key) => {
//     if (value === null || value === undefined || !isFinite(value)) return '-';

//     const rupeeFormatter = new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     });

//     if (key.includes('CAGR')) {
//       return `${(value * 100).toFixed(2)}%`;
//     }

//     if (key === 'SectorMarketCap' || key === 'Price' || key === 'MarketCap') {
//       const absValue = Math.abs(value);
//       if (absValue >= 1e7) {
//         const crValue = value / 1e7;
//         return `${rupeeFormatter.format(crValue)} Cr`;
//       }
//       if (absValue >= 1e5) {
//         const lakhValue = value / 1e5;
//         return `${rupeeFormatter.format(lakhValue)} L`;
//       }
//       if (
//         key === 'SectorPE_Mode' ||
//         key === 'SectorEPS' ||
//         key === 'SectorPE_Min' ||
//         key === 'SectorPE_Max'
//       ) 
//         return rupeeFormatter.format(value);
//     }

//     if (key === 'UpDownAmt') {
//       const formatted = rupeeFormatter.format(Math.abs(value));
//       return value > 0 ? `+${formatted}` : `-${formatted}`;
//     }

//     if (typeof value === 'number') {
//       return value.toFixed(2);
//     }

//     return value;
//   };

//   const handleSortClick = (key) => {
//     if (sortKey === key) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortKey(key);
//       setSortOrder('desc');
//     }
//   };

//   const renderCompanyTable = (companies) => {
//     if (!companies) return null;
//     const filtered = companyQuery
//       ? companies.filter((c) => c.Symbol && c.Symbol.toLowerCase().includes(companyQuery.toLowerCase()))
//       : companies;

//     const sorted = [...filtered].sort((a, b) => {
//       if (sortKey === 'Symbol') {
//         return sortOrder === 'asc'
//           ? a.Symbol.localeCompare(b.Symbol)
//           : b.Symbol.localeCompare(a.Symbol);
//       }
//       const bv = Number(b[sortKey]), av = Number(a[sortKey]);
//       const valA = isFinite(av) ? av : -Infinity;
//       const valB = isFinite(bv) ? bv : -Infinity;
//       return sortOrder === 'asc' ? valA - valB : valB - valA;
//     });

//     return sorted.map((c) => (
//       <tr
//         key={c.Symbol}
//         onClick={() => onRowClick(c.Symbol)}
//         className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
//           c.UpDown === 'Up'
//             ? 'text-green-600 dark:text-green-400'
//             : c.UpDown === 'Down'
//             ? 'text-red-600 dark:text-red-400'
//             : ''
//         }`}
//       >
//         <td className="px-4 py-3 whitespace-nowrap">{c.Symbol}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.Price, 'Price')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.PE, 'PE')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.MarketCap, 'MarketCap')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.bookValue, 'bookValue')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.EPS, 'EPS')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.CAGR_TTM_YoY, 'CAGR_1Y')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.UpDownAmt, 'UpDownAmt')}</td>
//       </tr>
//     ));
//   };

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>
//   );

//   if (error) return (
//     <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
//       <h3 className="text-lg font-medium text-red-800">Error loading sector data: {error}</h3>
//       <button
//         onClick={() => window.location.reload()}
//         className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//       >
//         Retry
//       </button>
//     </div>
//   );

//   if (sectors.length === 0) return (
//     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
//       <h3 className="text-lg font-medium text-yellow-800">No Sector Data Available</h3>
//       <p className="text-yellow-600 mt-1">No sectors with valid CAGR data were found.</p>
//     </div>
//   );

//   return (
//     <div className="px-4 py-12 max-w-7xl mx-auto">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Sector Performance Dashboard</h2>
//         <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//           Analyze market trends and performance metrics across all sectors, sorted by 1-year CAGR (highest to lowest)
//         </p>
//         {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
//           <button
//             onClick={() => setShowSlider(!showSlider)}
//             className="bg-gradient-to-r from-sky-700 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transform hover:-translate-y-1"
//           >
//             {showSlider ? 'Hide All Sectors' : 'Show All Sectors'}
//           </button>
//           {showSlider && (
//             <input
//               type="text"
//               placeholder="Search sectors..."
//               value={sectorQuery}
//               onChange={(e) => {
//                 setSectorQuery(e.target.value);
//                 if (selectedSector && !filteredSectors.some(s => s.Sector === selectedSector.Sector)) {
//                   setSelectedSector(filteredSectors[0] || null);
//                 }
//               }}
//               className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500 w-full sm:w-64"
//             />
//           )}
//         </div> */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
//   <input
//     type="text"
//     placeholder="Search sectors..."
//     value={sectorQuery}
//     onChange={(e) => {
//       setSectorQuery(e.target.value);
//       if (selectedSector && !filteredSectors.some(s => s.Sector === selectedSector.Sector)) {
//         setSelectedSector(filteredSectors[0] || null);
//       }
//     }}
//     className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-1 focus:ring-sky-500 w-full sm:w-64"
//   />
// </div>

//       </div>

//       {showSlider && (
//         <div className="mb-16 px-2 sm:px-4">
//           {filteredSectors.length === 0 ? (
//             <div className="text-center text-gray-600 dark:text-gray-300">
//               No sectors match your search.
//             </div>
//           ) : filteredSectors.length === 1 ? (
//             <div className="px-2">
//               <div
//                 className={`cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-lg
//                   ${selectedSector?.Sector === filteredSectors[0].Sector
//                     ? ' ring-opacity-70 transform scale-105'
//                     : 'border border-gray-200 dark:border-gray-700 hover:shadow-xl'}`}
//                 onClick={() => {
//                   setSelectedSector(filteredSectors[0]);
//                   setSelectedMetric(null);
//                 }}
//               >
//                 <IndiceCard
//                   sectorData={filteredSectors[0]}
//                   isSelected={selectedSector?.Sector === filteredSectors[0].Sector}
//                   openModal={openModal}
//                   setSelectedSector={setSelectedSector}
//                 />
//               </div>
//             </div>
//           ) : (
//             <Slider {...sliderSettings}>
//               {filteredSectors.map((sector, index) => (
//                 <div key={index} className="px-2 ">
//                   <div
//                     className={`cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-lg
//                       ${selectedSector?.Sector === sector.Sector
//                         ? 'ring-4 ring-sky-800 ring-opacity-70 transform scale-105'
//                         : 'dark:border-gray-700 hover:shadow-xl'}`}
//                     onClick={() => {
//                       setSelectedSector(sector);
//                       setSelectedMetric(null);
//                     }}
//                   >
//                     <IndiceCard
//                       sectorData={sector}
//                       isSelected={selectedSector?.Sector === sector.Sector}
//                       openModal={openModal}
//                       setSelectedSector={setSelectedSector}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </Slider>
//           )}
//         </div>
//       )}

//       {/* {selectedSector && (
//         <div className="flex flex-col lg:flex-row justify-center items-center px-4 py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
//           <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] lg:w-[540px] lg:h-[540px] rounded-full bg-gradient-to-br from-indigo-950 via-sky-900 to-teal-800 shadow-2xl border-4 border-white/10 flex items-center justify-center overflow-hidden transition-all duration-700 group hover:shadow-[0_0_40px_rgba(56,189,248,0.3)] mb-8 lg:mb-0 lg:mr-8">
//             <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 animate-pulse-slow"></div>
//             {[...Array(10)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute rounded-full bg-sky-50/40 dark:bg-gray-50/20 animate-float"
//                 style={{
//                   width: `${Math.random() * 5 + 3}px`,
//                   height: `${Math.random() * 5 + 3}px`,
//                   left: `${Math.random() * 100}%`,
//                   top: `${Math.random() * 100}%`,
//                   animationDuration: `${Math.random() * 8 + 12}s`,
//                   animationDelay: `${i * 0.2}s`,
//                 }}
//               ></div>
//             ))}
//             <div className="absolute inset-0 rounded-full border-2 border-white/15 group-hover:border-sky-500/40 transition-all duration-1000"></div>
//             <div className="absolute inset-0 rounded-full border-[8px] border-transparent group-hover:border-sky-500/15 transition-all duration-1000"></div>
//             {metrics.map((metric, index) => {
//               const angle = (360 / metrics.length) * index + rotationOffset;
//               const radius = window.innerWidth < 640 ? 120 :
//                             window.innerWidth < 768 ? 150 :
//                             window.innerWidth < 1024 ? 170 : 180;
//               const x = radius * Math.cos((angle * Math.PI) / 180);
//               const y = radius * Math.sin((angle * Math.PI) / 180);
//               return (
//                 <button
//                   key={metric.key}
//                   onClick={() => setSelectedMetric(metric)}
//                   className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer text-xs sm:text-sm font-semibold transition-all duration-300 ease-out
//                     ${selectedMetric?.key === metric.key
//                       ? 'bg-gradient-to-r from-sky-800 to-cyan-500 text-white shadow-xl ring-2 ring-white/80'
//                       : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 hover:bg-gradient-to-r hover:from-sky-200 hover:to-indigo-200 hover:text-indigo-800 dark:hover:text-indigo-300 hover:scale-110 hover:shadow-lg'}
//                     w-20 sm:w-24 md:w-28 h-8 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sky-500 z-20 shadow-md hover:shadow-xl`}
//                   style={{
//                     left: `calc(50% + ${x}px)`,
//                     top: `calc(50% + ${y}px)`,
//                     filter: selectedMetric?.key === metric.key ? 'drop-shadow(0_0_10px_rgba(56,189,248,0.5))' : 'none',
//                   }}
//                   aria-label={`Select ${metric.label} metric`}
//                 >
//                   <span className="relative z-10 font-medium tracking-wide whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%]">{metric.label}</span>
//                   {selectedMetric?.key === metric.key && (
//                     <span className="absolute -inset-1 rounded-full bg-sky-500/30 animate-ping opacity-60"></span>
//                   )}
//                 </button>
//               );
//             })}
//             {/* <div className="absolute w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 bg-white/70 dark:bg-gray-900/70 rounded-full flex flex-col items-center justify-center shadow-2xl border border-white/20 backdrop-blur-xl transition-all duration-500 z-30 hover:scale-105">
//               <div className="absolute -inset-3 rounded-full bg-sky-600/10 blur-lg animate-pulse-slow"></div>
//               <div className="text-center p-4 relative z-10">
//                 {selectedMetric ? (
//                   <div className="space-y-3 animate-fade-in-up">
//                     <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
//                       {selectedMetric.label}
//                     </p>
//                     <p className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
//                       {formatValue(selectedSector[selectedMetric.key], selectedMetric.key)}
//                     </p>
//                     <div className="h-[3px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent w-4/5 mx-auto"></div>
//                     <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium tracking-tight">
//                       {selectedSector.Sector}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="animate-pulse">
//                     <p className="text-sm sm:text-md text-gray-900 dark:text-gray-400 font-bold">
//                       Select a metric
//                     </p>
//                     <div className="mt-3 h-7 w-24 bg-gray-200/40 dark:bg-gray-700/40 rounded-full mx-auto"></div>
//                   </div>
//                 )}
//               </div>
//               <div className="flex gap-4 mt-3 relative z-10">
//                 <button
//                   onClick={handlePrevClick}
//                   className="p-2.5 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sky-500 transform hover:-translate-x-1"
//                   aria-label="Previous metric"
//                 >
//                   <GrFormPrevious className="text-gray-800 dark:text-gray-200 text-lg" />
//                 </button>
//                 <button
//                   onClick={handleNextClick}
//                   className="p-2.5 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sky-500 transform hover:translate-x-1"
//                   aria-label="Next metric"
//                 >
//                   <MdNavigateNext className="text-gray-800 dark:text-gray-200 text-lg" />
//                 </button>
//               </div>
//             </div> *
//          // </div>
//           {/* <div className="w-full max-w-lg bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/10 dark:border-gray-800/20 transition-all duration-700 p-6 md:p-8">
//             {selectedMetric ? (
//               <div>
//                 <div className="flex items-center mb-6">
//                   <span className="text-3xl mr-3 animate-pulse">{SectorIcons[selectedSector.Sector] || '📊'}</span>
//                   <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
//                     {selectedSector.Sector}
//                   </h3>
//                 </div>
//                 <div className="bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-700 dark:to-cyan-800 rounded-xl p-6 mb-6 border border-sky-200 dark:border-sky-700">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
//                       {selectedMetric.label}
//                     </span>
//                     <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">
//                       {formatValue(selectedSector[selectedMetric.key], selectedMetric.key)}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
//                     {selectedMetric.description}
//                   </p>
//                 </div>
//                 <button
//                   onClick={openModal}
//                   className="w-full bg-gradient-to-r from-sky-700 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transform hover:-translate-y-1"
//                 >
//                   View Detailed Analysis
//                 </button>
//               </div>
//             ) : (
//               <div className="p-8 text-center flex flex-col items-center justify-center h-full">
//                 <div className="w-20 h-20 rounded-full bg-gray-100/50 dark:bg-gray-800/50 flex items-center justify-center mb-4 mx-auto">
//                   <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                   </svg>
//                 </div>
//                 <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
//                   Select a metric from the circle to view detailed insights
//                 </p>
//               </div>
//             )}
//           </div> 
//         </div>
//       )} */}

//       {isModalOpen && selectedSector && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4"
//           onClick={(e) => {
//             if (e.target.classList.contains('fixed')) closeModal();
//           }}
//         >
//           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto mt-10">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <span className="text-3xl mr-3">{SectorIcons[selectedSector.Sector] || '📊'}</span>
//                   <h2 className="text-2xl font-bold text-sky-900 dark:text-white">
//                     {selectedSector.Sector} Sector Analysis
//                   </h2>
//                 </div>
//                 <div className="flex gap-3">
//                   {selectedSymbol && (
//                     <button
//                       onClick={removeSymbolFromURL}
//                       className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition focus:ring-2 ring-offset-2 ring-red-500"
//                     >
//                       Clear Selection
//                     </button>
//                   )}
//                   <button
//                     onClick={closeModal}
//                     className="text-sky-700 dark:text-white hover:text-red-600 transition"
//                     aria-label="Close modal"
//                   >
//                     <IoMdClose size={26} />
//                   </button>
//                 </div>
//               </div>
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-sky-800 dark:text-white mb-4">Key Metrics</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
//                     <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Valuation</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">P/E Ratio:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorPE_Mode ?? selectedSector.SectorPE, 'SectorPE_Mode')}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Market Cap:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorMarketCap, 'SectorMarketCap')}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
//                     <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Performance</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">1Y CAGR:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorCAGR_TTM_YoY, 'SectorCAGR_TTM_YoY')}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
//                     <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Market Sentiment</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-green-600 dark:text-green-400">Advancing:</span>
//                         <span className="font-medium">
//                           {selectedSector.Ups || '0'}
//                           {isFinite(selectedSector.Ups / selectedSector.Total)
//                             ? ` (${Math.round((selectedSector.Ups / selectedSector.Total) * 100)}%)`
//                             : ''}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-red-600 dark:text-red-400">Declining:</span>
//                         <span className="font-medium">
//                           {selectedSector.Downs || '0'}
//                           {isFinite(selectedSector.Downs / selectedSector.Total)
//                             ? ` (${Math.round((selectedSector.Downs / selectedSector.Total) * 100)}%)`
//                             : ''}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Total Companies:</span>
//                         <span className="font-medium">{selectedSector.Total || '-'}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
//                     <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Sector</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">EPS:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorEPS, 'SectorEPS')}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Dividend Yield:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorDividendYield, 'SectorDividendYield')}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Min PE:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorPE_Min, 'SectorPE_Min')}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Max PE:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorPE_Max, 'SectorPE_Max')}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {selectedSector.Companies && (
//                 <div>
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//                     <h3 className="text-lg font-semibold text-sky-800 dark:text-white">Constituent Companies</h3>
//                     <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//                       <select
//                         value={sortKey}
//                         onChange={(e) => {
//                           setSortKey(e.target.value);
//                           setSortOrder('desc');
//                         }}
//                         className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500"
//                       >
//                         <option value="PE">Sort by P/E</option>
//                         <option value="MarketCap">Sort by Market Cap</option>
//                         <option value="bookValue">Sort by Book Value</option>
//                         <option value="EPS">Sort by EPS</option>
//                         <option value="CAGR_1Y">Sort by 1Y CAGR</option>
//                         <option value="Symbol">Sort by Symbol</option>
//                         <option value="UpDownAmt">Sort by Change</option>
//                       </select>
//                       <button
//                         onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//                         className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500"
//                       >
//                         {sortOrder === 'asc' ? <FaSortUp size={20} /> : <FaSortDown size={20} />}
//                       </button>
//                       <input
//                         type="text"
//                         placeholder="Search companies..."
//                         value={companyQuery}
//                         onChange={(e) => setCompanyQuery(e.target.value)}
//                         className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500"
//                       />
//                     </div>
//                   </div>
//                   <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
//                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
//                       <thead className="bg-sky-100 dark:bg-sky-900 sticky top-0 z-10">
//                         <tr>
//                           {[
//                             { label: 'Symbol', key: 'Symbol' },
//                             { label: 'Price', key: 'Price' },
//                             { label: 'P/E', key: 'PE' },
//                             { label: 'Market Cap', key: 'MarketCap' },
//                             { label: 'Book Value', key: 'bookValue' },
//                             { label: 'EPS', key: 'EPS' },
//                             { label: '1Y CAGR', key: 'CAGR_1Y' },
//                             { label: 'Change', key: 'UpDownAmt' },
//                           ].map(({ label, key }) => (
//                             <th
//                               key={key}
//                               onClick={() => handleSortClick(key)}
//                               className="px-4 py-3 text-left text-xs font-semibold text-sky-900 dark:text-sky-300 uppercase tracking-wide cursor-pointer hover:text-sky-600"
//                             >
//                               <div className="flex items-center gap-1">
//                                 {label}
//                                 {sortKey === key && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
//                               </div>
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                         {renderCompanyTable(selectedSector.Companies)}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SectorSummary;


// import React, { useEffect, useState } from 'react';
// import Slider from 'react-slick';
// import axios from 'axios';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { FaChevronLeft, FaChevronRight, FaSortUp, FaSortDown } from 'react-icons/fa';
// import { IoMdClose } from 'react-icons/io'; // Import IoMdClose from react-icons/io
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { HashLoader } from 'react-spinners';
// import * as Icons from 'react-icons/fa';
// import IndiceCard from './IndiceCard';

// let sectorCache = null;

// const metrics = [
//   { key: 'SectorPE_Mode', label: 'PE Ratio', description: 'Price-to-Earnings ratio indicates valuation' },
//   { key: 'SectorCAGR_1Y_MCap', label: '1Y CAGR', description: '1-year compound annual growth rate' },
//   { key: 'SectorEPS', label: 'EPS', description: 'Earnings Per Share for the sector' },
//   { key: 'SectorDividendYield', label: 'Dividend Yield', description: 'Dividend Yield for the sector' },
//   { key: 'SectorPE_Min', label: 'Min PE', description: 'Minimum Price-to-Earnings for the sector' },
//   { key: 'SectorPE_Max', label: 'Max PE', description: 'Maximum Price-to-Earnings for the sector' },
//   { key: 'SectorMarketCap', label: 'Market Cap', description: 'Total market valuation' },
//   { key: 'Total', label: 'Total Companies', description: 'Number of companies in sector' },
// ];

// const SectorIcons = {
//   'Capital Goods': <Icons.FaIndustry />,
//   'Logistics': <Icons.FaTruck />,
//   'Automobile & Ancillaries': <Icons.FaCar />,
//   'Realty': <Icons.FaBuilding />,
//   'Textile': <Icons.FaTshirt />,
//   'Hospitality': <Icons.FaHotel />,
//   'Chemicals': <Icons.FaFlask />,
//   'Consumer Durables': <Icons.FaCouch />,
//   'Agri': <Icons.FaLeaf />,
//   'Finance': <Icons.FaMoneyBillWave />,
//   'Diversified': <Icons.FaChartLine />,
//   'FMCG': <Icons.FaShoppingCart />,
//   'Electricals': <Icons.FaLightbulb />,
//   'Power': <Icons.FaBolt />,
//   'Healthcare': <Icons.FaHeartbeat />,
//   'Ratings': <Icons.FaStar />,
//   'Crude Oil': <Icons.FaOilCan />,
//   'Telecom': <Icons.FaBroadcastTower />,
//   'Bank': <Icons.FaUniversity />,
//   'Iron & Steel': <Icons.FaCog />,
//   'Diamond & Jewellery': <Icons.FaGem />,
//   'Plastic Products': <Icons.FaBox />,
//   'Trading': <Icons.FaExchangeAlt />,
//   'Infrastructure': <Icons.FaTools />,
//   'Media & Entertainment': <Icons.FaFilm />,
//   'IT': <Icons.FaLaptop />,
//   'Business Services': <Icons.FaUserTie />,
//   'Construction Materials': <Icons.FaHardHat />,
//   'Retailing': <Icons.FaShoppingBag />,
//   'Paper': <Icons.FaFileAlt />,
//   'Miscellaneous': <Icons.FaBoxOpen />,
//   'Mining': <Icons.FaMountain />,
//   'Abrasives': <Icons.FaTools />,
//   'Alcohol': <Icons.FaWineBottle />,
//   'Inds. Gases & Fuels': <Icons.FaGasPump />,
//   'Gas Transmission': <Icons.FaSubway />,
//   'Ferro Manganese': <Icons.FaCog />,
//   'Aviation': <Icons.FaPlane />,
//   'ETF': <Icons.FaChartLine />,
//   'Education & Training': <Icons.FaGraduationCap />,
//   'Ship Building': <Icons.FaShip />,
//   'Insurance': <Icons.FaShieldAlt />,
//   'Photographic Product': <Icons.FaCamera />,
//   'Others': <Icons.FaPuzzlePiece />,
// };


// const NextArrow = ({ onClick }) => (
//   <div
//     className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-sky-50 group transition-all duration-200 hover:shadow-lg hover:scale-105"
//     onClick={onClick}
//   >
//     <FaChevronRight className="text-gray-600 text-lg group-hover:text-sky-600 transition-colors" />
//   </div>
// );

// const PrevArrow = ({ onClick }) => (
//   <div
//     className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-sky-50 group transition-all duration-200 hover:shadow-lg hover:scale-105"
//     onClick={onClick}
//   >
//     <FaChevronLeft className="text-gray-600 text-lg group-hover:text-sky-600 transition-colors" />
//   </div>
// );

// const formatNumber = (value, decimals = 2) =>
//   Number.isFinite(Number(value)) ? Number(value).toFixed(decimals) : '-';

// const formatINRCrore = (value, decimals = 2) => {
//   if (!Number.isFinite(Number(value))) return '-';
//   const crValue = value / 1e7;
//   return `₹${crValue.toFixed(decimals)} Cr`;
// };

// const formatPercentage = (value, decimals = 2) => {
//   if (!Number.isFinite(Number(value))) return '-';
//   return `${(value * 100).toFixed(decimals)}%`;
// };

// const transformCompanies = (companies) => {
//   if (!companies || !companies.Symbol || !Array.isArray(companies.Symbol)) return [];
//   const keys = Object.keys(companies);
//   const length = companies.Symbol.length;
//   const result = [];

//   for (let i = 0; i < length; i++) {
//     const company = {};
//     keys.forEach((key) => {
//       company[key] = companies[key][i] ?? null; // Ensure null for undefined values
//     });
//     result.push(company);
//   }
//   return result;
// };

// const SectorSummary = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [sectors, setSectors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showSlider, setShowSlider] = useState(true);
//   const [selectedSector, setSelectedSector] = useState(null);
//   const [selectedMetric, setSelectedMetric] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [sortKey, setSortKey] = useState('PE');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [companyQuery, setCompanyQuery] = useState('');
//   const [sectorQuery, setSectorQuery] = useState('');
//   const [rotationOffset, setRotationOffset] = useState(0);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const selectedSymbol = searchParams.get('symbol');

//   // useEffect(() => {
//   //   const fetchSectors = async () => {
//   //     try {
//   //       if (sectorCache) {
//   //         console.log('Using cached sector data:', sectorCache);
//   //         const validSectors = sectorCache.data
//   //           .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorCAGR_1Y_MCap))
//   //           .map((sector) => ({
//   //             ...sector,
//   //             Companies: transformCompanies(sector.Companies),
//   //           }))
//   //           .sort((a, b) => b.SectorCAGR_1Y_MCap - a.SectorCAGR_1Y_MCap);
//   //         if (validSectors.length === 0) {
//   //           throw new Error('No valid sectors with CAGR data found in cache');
//   //         }
//   //         setSectors(validSectors);
//   //         setSelectedSector(validSectors[0] || null);
//   //         setLoading(false);
//   //         return;
//   //       }

//   //       const response = await axios.get(`${API_BASE}/landpage/sector-summary`);
//   //       console.log('API response:', response.data);
//   //       if (response.data.status !== 'success') {
//   //         throw new Error(response.data.message || 'API request failed');
//   //       }
//   //       const validSectors = response.data.data
//   //         .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorCAGR_1Y_MCap))
//   //         .map((sector) => ({
//   //           ...sector,
//   //           Companies: transformCompanies(sector.Companies),
//   //         }))
//   //         .sort((a, b) => b.SectorCAGR_1Y_MCap - a.SectorCAGR_1Y_MCap);
//   //       if (validSectors.length === 0) {
//   //         throw new Error('No valid sectors with CAGR data found');
//   //       }

//   //       sectorCache = response.data;
//   //       setSectors(validSectors);
//   //       setSelectedSector(validSectors[0] || null);
//   //     } catch (error) {
//   //       console.error('Error fetching sector data:', error);
//   //       setError(error.message || 'Failed to fetch sector data');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchSectors();
//   // }, [API_BASE]);
//   useEffect(() => {
//     const fetchSectors = async () => {
//       try {
//         if (sectorCache) {
//           console.log('Using cached sector data:', sectorCache);
//           const validSectors = sectorCache.data
//             .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorCAGR_1Y_MCap))
//             .map((sector) => {
//               if (sector.Sector === 'Finance') {
//                 // console.log('Finance sector companies before transform:', sector.Companies);
//                 console.log('Finance sector companies after transform:', transformCompanies(sector.Companies));
//               }
//               return {
//                 ...sector,
//                 Companies: transformCompanies(sector.Companies),
//               };
//             })
//             .sort((a, b) => b.SectorCAGR_1Y_MCap - a.SectorCAGR_1Y_MCap);
//           if (validSectors.length === 0) {
//             throw new Error('No valid sectors with CAGR data found in cache');
//           }
//           setSectors(validSectors);
//           setSelectedSector(validSectors[0] || null);
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(`${API_BASE}/landpage/sector-summary`);
//         console.log('API response for Finance sector:', response.data.data.find((s) => s.Sector === 'Finance')?.Companies);
//         if (response.data.status !== 'success') {
//           throw new Error(response.data.message || 'API request failed');
//         }
//         const validSectors = response.data.data
//           .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorCAGR_1Y_MCap))
//           .map((sector) => ({
//             ...sector,
//             Companies: transformCompanies(sector.Companies),
//           }))
//           .sort((a, b) => b.SectorCAGR_1Y_MCap - a.SectorCAGR_1Y_MCap);
//         if (validSectors.length === 0) {
//           throw new Error('No valid sectors with CAGR data found');
//         }

//         sectorCache = response.data;
//         setSectors(validSectors);
//         setSelectedSector(validSectors[0] || null);
//       } catch (error) {
//         console.error('Error fetching sector data:', error);
//         setError(error.message || 'Failed to fetch sector data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSectors();
//   }, [API_BASE]);

//   useEffect(() => {
//     // Ensure selectedSector is valid when sectorQuery changes
//     if (sectorQuery && selectedSector && !filteredSectors.some((s) => s.Sector === selectedSector.Sector)) {
//       setSelectedSector(filteredSectors[0] || null);
//     }
//   }, [sectorQuery, selectedSector]);

//   const removeSymbolFromURL = () => {
//     searchParams.delete('symbol');
//     setSearchParams(searchParams);
//   };

//   const onRowClick = (symbol) => {
//     if (symbol) {
//       navigate(`/equityhub?symbol=${symbol}`);
//     }
//   };

//   const filteredSectors = sectors.filter((sector) =>
//     sector?.Sector?.toLowerCase().includes(sectorQuery.toLowerCase())
//   );

//   const sliderSettings = {
//     infinite: true,
//     speed: 500,
//     slidesToShow: Math.min(4, filteredSectors.length),
//     slidesToScroll: 1,
//     autoplay: false,
//     pauseOnHover: true,
//     appendDots: (dots) => (
//       <div className="mt-4 flex justify-center">
//         <ul className="flex gap-2">
//           {dots.map((dot, index) => (
//             <li key={index} className="mx-1">
//               {React.cloneElement(dot, {
//                 className: `w-3 h-3 rounded-full ${index === dots.findIndex((d) => d.props.className?.includes('slick-active'))
//                   ? 'bg-sky-600'
//                   : 'bg-gray-300 dark:bg-gray-600'
//                   }`,
//               })}
//             </li>
//           ))}
//         </ul>
//       </div>
//     ),
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       { breakpoint: 1280, settings: { slidesToShow: Math.min(3, filteredSectors.length) } },
//       { breakpoint: 1024, settings: { slidesToShow: Math.min(2, filteredSectors.length) } },
//       { breakpoint: 640, settings: { slidesToShow: 1 } },
//     ],
//   };

//   const handlePrevClick = () => {
//     const newIndex = selectedMetric
//       ? (metrics.findIndex((m) => m.key === selectedMetric.key) - 1 + metrics.length) % metrics.length
//       : 0;
//     setSelectedMetric(metrics[newIndex]);
//     setRotationOffset((prev) => prev + 360 / metrics.length);
//   };

//   const handleNextClick = () => {
//     const newIndex = selectedMetric
//       ? (metrics.findIndex((m) => m.key === selectedMetric.key) + 1) % metrics.length
//       : 0;
//     setSelectedMetric(metrics[newIndex]);
//     setRotationOffset((prev) => prev - 360 / metrics.length);
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCompanyQuery('');
//     setSortKey('PE');
//     setSortOrder('desc');
//   };

//   // const formatValue = (value, key) => {
//   //   if (value === null || value === undefined || !Number.isFinite(Number(value))) return '-';

//   //   const rupeeFormatter = new Intl.NumberFormat('en-IN', {
//   //     style: 'currency',
//   //     currency: 'INR',
//   //     minimumFractionDigits: 2,
//   //     maximumFractionDigits: 2,
//   //   });

//   //   if (key.includes('CAGR') || key.includes('DividendYield')) {
//   //     return formatPercentage(value);
//   //   }

//   //   if (key.includes('MarketCap') || key === 'Price') {
//   //     return formatINRCrore(value);
//   //   }

//   //   if (key === 'UpDownAmt') {
//   //     const formatted = rupeeFormatter.format(Math.abs(value));
//   //     return value >= 0 ? `+${formatted}` : `-${formatted}`;
//   //   }

//   //   return formatNumber(value);
//   // };

//   const formatValue = (value, key) => {
//     if (value === null || value === undefined || !Number.isFinite(Number(value))) return '-';

//     const rupeeFormatter = new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });

//     if (key.includes('CAGR') || key.includes('DividendYield')) {
//       return formatPercentage(value);
//     }

//     if (key.includes('MarketCap')) {
//       return formatINRCrore(value);
//     }

//     if (key === 'Price') {
//       return rupeeFormatter.format(value); // Display Price in rupees
//     }

//     if (key === 'UpDownAmt') {
//       const formatted = rupeeFormatter.format(Math.abs(value));
//       return value >= 0 ? `+${formatted}` : `-${formatted}`;
//     }

//     return formatNumber(value);
//   };

//   const handleSortClick = (key) => {
//     if (sortKey === key) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortKey(key);
//       setSortOrder('desc');
//     }
//   };

//   // const renderCompanyTable = (companies) => {
//   //   if (!companies || !Array.isArray(companies)) return null;
//   //   const filtered = companyQuery
//   //     ? companies.filter((c) => c.Symbol?.toLowerCase().includes(companyQuery.toLowerCase()))
//   //     : companies;

//   //   const sorted = [...filtered].sort((a, b) => {
//   //     if (sortKey === 'Symbol') {
//   //       return sortOrder === 'asc'
//   //         ? (a.Symbol || '').localeCompare(b.Symbol || '')
//   //         : (b.Symbol || '').localeCompare(a.Symbol || '');
//   //     }
//   //     const av = Number(a[sortKey]);
//   //     const bv = Number(b[sortKey]);
//   //     const valA = Number.isFinite(av) ? av : -Infinity;
//   //     const valB = Number.isFinite(bv) ? bv : -Infinity;
//   //     return sortOrder === 'asc' ? valA - valB : valB - valA;
//   //   });

//   //   return sorted.map((c) => (
//   //     <tr
//   //       key={c.Symbol || Math.random()} // Fallback key for safety
//   //       onClick={() => onRowClick(c.Symbol)}
//   //       className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${c.UpDown === 'Up'
//   //         ? 'text-green-600 dark:text-green-400'
//   //         : c.UpDown === 'Down'
//   //           ? 'text-red-600 dark:text-red-400'
//   //           : ''
//   //         }`}
//   //     >
//   //       <td className="px-4 py-3 whitespace-nowrap">{c.Symbol || '-'}</td>
//   //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.Price, 'Price')}</td>
//   //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.PE, 'PE')}</td>
//   //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.MarketCap, 'MarketCap')}</td>
//   //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.bookValue, 'bookValue')}</td>
//   //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.EPS, 'EPS')}</td>
//   //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.CAGR_1Y_MCap, 'CAGR_1Y_MCap')}</td>
//   //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.UpDownAmt, 'UpDownAmt')}</td>
//   //     </tr>
//   //   ));
//   // };

//   const renderCompanyTable = (companies) => {
//     if (!companies || !Array.isArray(companies)) return null;
//     const filtered = companyQuery
//       ? companies.filter((c) => c.Symbol?.toLowerCase().includes(companyQuery.toLowerCase()))
//       : companies;

//     const sorted = [...filtered].sort((a, b) => {
//       if (sortKey === 'Symbol') {
//         return sortOrder === 'asc'
//           ? (a.Symbol || '').localeCompare(b.Symbol || '')
//           : (b.Symbol || '').localeCompare(a.Symbol || '');
//       }

//       // Convert values to numbers, handling invalid cases
//       const av = a[sortKey] != null ? Number(a[sortKey]) : null;
//       const bv = b[sortKey] != null ? Number(b[sortKey]) : null;

//       // Handle cases where both values are null or invalid
//       if (av === null && bv === null) return 0; // Maintain relative order
//       if (av === null) return sortOrder === 'asc' ? 1 : -1; // Null to end
//       if (bv === null) return sortOrder === 'asc' ? -1 : 1; // Null to end

//       // Sort valid numbers
//       return sortOrder === 'asc' ? av - bv : bv - av;
//     });

//     return sorted.map((c) => (
//       <tr
//         key={c.Symbol || Math.random()} // Fallback key, but duplicates should be resolved
//         onClick={() => onRowClick(c.Symbol)}
//         className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${c.UpDown === 'Up'
//           ? 'text-green-600 dark:text-green-400'
//           : c.UpDown === 'Down'
//             ? 'text-red-600 dark:text-red-400'
//             : ''
//           }`}
//       >
//         <td className="px-4 py-3 whitespace-nowrap">{c.Symbol || '-'}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.Price, 'Price')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.PE, 'PE')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.MarketCap, 'MarketCap')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.bookValue, 'bookValue')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.EPS, 'EPS')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.CAGR_1Y_MCap, 'CAGR_1Y_MCap')}</td>
//         <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.UpDownAmt, 'UpDownAmt')}</td>
//       </tr>
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           Loading...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
//         <h3 className="text-lg font-medium text-red-800">Error loading sector data: {error}</h3>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (sectors.length === 0) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
//         <h3 className="text-lg font-medium text-yellow-800">No Sector Data Available</h3>
//         <p className="text-yellow-600 mt-1">No sectors with valid CAGR data were found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="px-4 py-12 max-w-7xl mx-auto">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Sector Performance Dashboard</h2>
//         <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//           Analyze market trends and performance metrics across all sectors, sorted by 1-year CAGR (highest to lowest)
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
//           <input
//             type="text"
//             placeholder="Search sectors..."
//             value={sectorQuery}
//             onChange={(e) => setSectorQuery(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-1 focus:ring-sky-500 w-full sm:w-64"
//           />
//         </div>
//       </div>

//       {showSlider && (
//         <div className="mb-16 px-2 sm:px-4">
//           {filteredSectors.length === 0 ? (
//             <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
//               <p className="text-gray-600 dark:text-gray-300 font-medium">
//                 No sectors match your search.
//               </p>
//               <button
//                 onClick={() => setSectorQuery('')}
//                 className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
//               >
//                 Clear Search
//               </button>
//             </div>
//           ) : filteredSectors.length === 1 ? (
//             <div className="px-2">
//               <div
//                 className={`cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-md hover:shadow-lg ${selectedSector?.Sector === filteredSectors[0].Sector ? 'ring-2 ring-blue-500 ring-opacity-70 scale-105' : ''
//                   }`}
//                 onClick={() => {
//                   setSelectedSector(filteredSectors[0]);
//                   setSelectedMetric(null);
//                 }}
//               >
//                 <IndiceCard
//                   sectorData={filteredSectors[0]}
//                   isSelected={selectedSector?.Sector === filteredSectors[0].Sector}
//                   openModal={openModal}
//                   setSelectedSector={setSelectedSector}
//                 />
//               </div>
//             </div>
//           ) : (
//             <Slider {...sliderSettings}>
//               {filteredSectors.map((sector, index) => (
//                 <div key={sector.Sector || index} className="m-5 px-2">
//                   <div
//                     className={`cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-md hover:shadow-lg ${selectedSector?.Sector === sector.Sector ? 'ring-2 ring-blue-500 ring-opacity-70 scale-105' : ''
//                       }`}
//                     onClick={() => {
//                       setSelectedSector(sector);
//                       setSelectedMetric(null);
//                     }}
//                   >
//                     <IndiceCard
//                       sectorData={sector}
//                       isSelected={selectedSector?.Sector === sector.Sector}
//                       openModal={openModal}
//                       setSelectedSector={setSelectedSector}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </Slider>
//           )}
//         </div>
//       )}

//       {isModalOpen && selectedSector && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4"
//           onClick={(e) => {
//             if (e.target.classList.contains('fixed')) closeModal();
//           }}
//         >
//           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto mt-10">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <span className="text-3xl mr-3">{SectorIcons[selectedSector.Sector] || '📊'}</span>
//                   <h2 className="text-2xl font-bold text-sky-900 dark:text-white">
//                     {selectedSector.Sector} Sector Analysis
//                   </h2>
//                 </div>
//                 <div className="flex gap-3">
//                   {selectedSymbol && (
//                     <button
//                       onClick={removeSymbolFromURL}
//                       className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition focus:ring-2 ring-offset-2 ring-red-500"
//                     >
//                       Clear Selection
//                     </button>
//                   )}
//                   <button
//                     onClick={closeModal}
//                     className="text-sky-700 dark:text-white hover:text-red-600 dark:hover:text-red-600 transition"
//                     aria-label="Close modal"
//                   >
//                     <IoMdClose size={26} />
//                   </button>
//                 </div>
//               </div>
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-sky-800 dark:text-white mb-4">Key Metrics</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
//                     <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Valuation</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">P/E Ratio:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorPE_Mode, 'SectorPE_Mode')}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Market Cap:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorMarketCap, 'SectorMarketCap')}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
//                     <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Performance</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">1Y CAGR:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorCAGR_1Y_MCap, 'SectorCAGR_1Y_MCap')}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
//                     <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Market Sentiment</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-green-600 dark:text-green-400">Advancing:</span>
//                         <span className="font-medium">
//                           {selectedSector.Ups || '0'}
//                           {Number.isFinite(selectedSector.Ups / selectedSector.Total)
//                             ? ` (${Math.round((selectedSector.Ups / selectedSector.Total) * 100)}%)`
//                             : ''}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-red-600 dark:text-red-400">Declining:</span>
//                         <span className="font-medium">
//                           {selectedSector.Downs || '0'}
//                           {Number.isFinite(selectedSector.Downs / selectedSector.Total)
//                             ? ` (${Math.round((selectedSector.Downs / selectedSector.Total) * 100)}%)`
//                             : ''}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Total Companies:</span>
//                         <span className="font-medium">{selectedSector.Total || '-'}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
//                     <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Sector</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">EPS:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorEPS, 'SectorEPS')}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Dividend Yield:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorDividendYield, 'SectorDividendYield')}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Min PE:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorPE_Min, 'SectorPE_Min')}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sky-700 dark:text-sky-400">Max PE:</span>
//                         <span className="font-medium">{formatValue(selectedSector.SectorPE_Max, 'SectorPE_Max')}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {selectedSector.Companies && (
//                 <div>
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//                     <h3 className="text-lg font-semibold text-sky-800 dark:text-white">Constituent Companies</h3>
//                     <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//                       <select
//                         value={sortKey}
//                         onChange={(e) => {
//                           setSortKey(e.target.value);
//                           setSortOrder('desc');
//                         }}
//                         className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500"
//                       >
//                         <option value="Symbol">Sort by Symbol</option>
//                         <option value="Price">Sort by Price</option>
//                         <option value="PE">Sort by P/E</option>
//                         <option value="MarketCap">Sort by Market Cap</option>
//                         <option value="bookValue">Sort by Book Value</option>
//                         <option value="EPS">Sort by EPS</option>
//                         <option value="CAGR_1Y_MCap">Sort by 1Y CAGR</option>
//                         <option value="UpDownAmt">Sort by Change</option>
//                       </select>
//                       <button
//                         onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//                         className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500"
//                       >
//                         {sortOrder === 'asc' ? <FaSortUp size={20} /> : <FaSortDown size={20} />}
//                       </button>
//                       <input
//                         type="text"
//                         placeholder="Search companies..."
//                         value={companyQuery}
//                         onChange={(e) => setCompanyQuery(e.target.value)}
//                         className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500"
//                       />
//                     </div>
//                   </div>
//                   <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
//                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
//                       <thead className="bg-sky-100 dark:bg-sky-900 sticky top-0 z-10">
//                         <tr>
//                           {[
//                             { label: 'Symbol', key: 'Symbol' },
//                             { label: 'Price', key: 'Price' },
//                             { label: 'P/E', key: 'PE' },
//                             { label: 'Market Cap', key: 'MarketCap' },
//                             { label: 'Book Value', key: 'bookValue' },
//                             { label: 'EPS', key: 'EPS' },
//                             { label: '1Y CAGR', key: 'CAGR_1Y_MCap' },
//                             { label: 'Change', key: 'UpDownAmt' },
//                           ].map(({ label, key }) => (
//                             <th
//                               key={key}
//                               onClick={() => handleSortClick(key)}
//                               className="px-4 py-3 text-left text-xs font-semibold text-sky-900 dark:text-sky-300 uppercase tracking-wide cursor-pointer hover:text-sky-600"
//                             >
//                               <div className="flex items-center gap-1">
//                                 {label}
//                                 {sortKey === key && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
//                               </div>
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                         {renderCompanyTable(selectedSector.Companies)}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SectorSummary;


import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight, FaSortUp, FaSortDown } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io'; // Import IoMdClose from react-icons/io
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import * as Icons from 'react-icons/fa';
import IndiceCard from './IndiceCard';

let sectorCache = null;

const metrics = [
  { key: 'SectorPE_Mode', label: 'PE Ratio', description: 'Price-to-Earnings ratio indicates valuation' },
  { key: 'SectorCAGR_1Y_MCap', label: '1Y CAGR', description: '1-year compound annual growth rate' },
  { key: 'SectorEPS', label: 'EPS', description: 'Earnings Per Share for the sector' },
  { key: 'SectorDividendYield', label: 'Dividend Yield', description: 'Dividend Yield for the sector' },
  { key: 'SectorPE_Min', label: 'Min PE', description: 'Minimum Price-to-Earnings for the sector' },
  { key: 'SectorPE_Max', label: 'Max PE', description: 'Maximum Price-to-Earnings for the sector' },
  { key: 'SectorMarketCap', label: 'Market Cap', description: 'Total market valuation' },
  { key: 'Total', label: 'Total Companies', description: 'Number of companies in sector' },
];

const SectorIcons = {
  'Capital Goods': <Icons.FaIndustry />,
  'Logistics': <Icons.FaTruck />,
  'Automobile & Ancillaries': <Icons.FaCar />,
  'Realty': <Icons.FaBuilding />,
  'Textile': <Icons.FaTshirt />,
  'Hospitality': <Icons.FaHotel />,
  'Chemicals': <Icons.FaFlask />,
  'Consumer Durables': <Icons.FaCouch />,
  'Agri': <Icons.FaLeaf />,
  'Finance': <Icons.FaMoneyBillWave />,
  'Diversified': <Icons.FaChartLine />,
  'FMCG': <Icons.FaShoppingCart />,
  'Electricals': <Icons.FaLightbulb />,
  'Power': <Icons.FaBolt />,
  'Healthcare': <Icons.FaHeartbeat />,
  'Ratings': <Icons.FaStar />,
  'Crude Oil': <Icons.FaOilCan />,
  'Telecom': <Icons.FaBroadcastTower />,
  'Bank': <Icons.FaUniversity />,
  'Iron & Steel': <Icons.FaCog />,
  'Diamond & Jewellery': <Icons.FaGem />,
  'Plastic Products': <Icons.FaBox />,
  'Trading': <Icons.FaExchangeAlt />,
  'Infrastructure': <Icons.FaTools />,
  'Media & Entertainment': <Icons.FaFilm />,
  'IT': <Icons.FaLaptop />,
  'Business Services': <Icons.FaUserTie />,
  'Construction Materials': <Icons.FaHardHat />,
  'Retailing': <Icons.FaShoppingBag />,
  'Paper': <Icons.FaFileAlt />,
  'Miscellaneous': <Icons.FaBoxOpen />,
  'Mining': <Icons.FaMountain />,
  'Abrasives': <Icons.FaTools />,
  'Alcohol': <Icons.FaWineBottle />,
  'Inds. Gases & Fuels': <Icons.FaGasPump />,
  'Gas Transmission': <Icons.FaSubway />,
  'Ferro Manganese': <Icons.FaCog />,
  'Aviation': <Icons.FaPlane />,
  'ETF': <Icons.FaChartLine />,
  'Education & Training': <Icons.FaGraduationCap />,
  'Ship Building': <Icons.FaShip />,
  'Insurance': <Icons.FaShieldAlt />,
  'Photographic Product': <Icons.FaCamera />,
  'Others': <Icons.FaPuzzlePiece />,
};


const NextArrow = ({ onClick }) => (
  <div
    className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-sky-50 group transition-all duration-200 hover:shadow-lg hover:scale-105"
    onClick={onClick}
  >
    <FaChevronRight className="text-gray-600 text-lg group-hover:text-sky-600 transition-colors" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-sky-50 group transition-all duration-200 hover:shadow-lg hover:scale-105"
    onClick={onClick}
  >
    <FaChevronLeft className="text-gray-600 text-lg group-hover:text-sky-600 transition-colors" />
  </div>
);

const formatNumber = (value, decimals = 2) =>
  Number.isFinite(Number(value)) ? Number(value).toFixed(decimals) : '-';

const formatINRCrore = (value, decimals = 2) => {
  if (!Number.isFinite(Number(value))) return '-';
  const crValue = value / 1e7;
  return `₹${crValue.toFixed(decimals)} Cr`;
};

const formatPercentage = (value, decimals = 2) => {
  if (!Number.isFinite(Number(value))) return '-';
  return `${(value * 100).toFixed(decimals)}%`;
};

const transformCompanies = (companies) => {
  if (!companies || !companies.Symbol || !Array.isArray(companies.Symbol)) return [];
  const keys = Object.keys(companies);
  const length = companies.Symbol.length;
  const result = [];

  for (let i = 0; i < length; i++) {
    const company = {};
    keys.forEach((key) => {
      company[key] = companies[key][i] ?? null; // Ensure null for undefined values
    });
    result.push(company);
  }
  return result;
};

const SectorSummary = () => {
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSlider, setShowSlider] = useState(true);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState('PE');
  const [sortOrder, setSortOrder] = useState('desc');
  const [companyQuery, setCompanyQuery] = useState('');
  const [sectorQuery, setSectorQuery] = useState('');
  const [rotationOffset, setRotationOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedSymbol = searchParams.get('symbol');

  // useEffect(() => {
  //   const fetchSectors = async () => {
  //     try {
  //       if (sectorCache) {
  //         console.log('Using cached sector data:', sectorCache);
  //         const validSectors = sectorCache.data
  //           .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorCAGR_1Y_MCap))
  //           .map((sector) => ({
  //             ...sector,
  //             Companies: transformCompanies(sector.Companies),
  //           }))
  //           .sort((a, b) => b.SectorCAGR_1Y_MCap - a.SectorCAGR_1Y_MCap);
  //         if (validSectors.length === 0) {
  //           throw new Error('No valid sectors with CAGR data found in cache');
  //         }
  //         setSectors(validSectors);
  //         setSelectedSector(validSectors[0] || null);
  //         setLoading(false);
  //         return;
  //       }

  //       const response = await axios.get(`${API_BASE}/landpage/sector-summary`);
  //       console.log('API response:', response.data);
  //       if (response.data.status !== 'success') {
  //         throw new Error(response.data.message || 'API request failed');
  //       }
  //       const validSectors = response.data.data
  //         .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorCAGR_1Y_MCap))
  //         .map((sector) => ({
  //           ...sector,
  //           Companies: transformCompanies(sector.Companies),
  //         }))
  //         .sort((a, b) => b.SectorCAGR_1Y_MCap - a.SectorCAGR_1Y_MCap);
  //       if (validSectors.length === 0) {
  //         throw new Error('No valid sectors with CAGR data found');
  //       }

  //       sectorCache = response.data;
  //       setSectors(validSectors);
  //       setSelectedSector(validSectors[0] || null);
  //     } catch (error) {
  //       console.error('Error fetching sector data:', error);
  //       setError(error.message || 'Failed to fetch sector data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSectors();
  // }, [API_BASE]);
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        if (sectorCache) {
          console.log('Using cached sector data:', sectorCache);
          const validSectors = sectorCache.data
            .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorCAGR_1Y_MCap))
            .map((sector) => {
              if (sector.Sector === 'Finance') {
                // console.log('Finance sector companies before transform:', sector.Companies);
                console.log('Finance sector companies after transform:', transformCompanies(sector.Companies));
              }
              return {
                ...sector,
                Companies: transformCompanies(sector.Companies),
              };
            })
            .sort((a, b) => b.SectorCAGR_1Y_MCap - a.SectorCAGR_1Y_MCap);
          if (validSectors.length === 0) {
            throw new Error('No valid sectors with CAGR data found in cache');
          }
          setSectors(validSectors);
          setSelectedSector(validSectors[0] || null);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE}/landpage/sector-summary`);
        console.log('API response for Finance sector:', response.data.data.find((s) => s.Sector === 'Finance')?.Companies);
        if (response.data.status !== 'success') {
          throw new Error(response.data.message || 'API request failed');
        }
        const validSectors = response.data.data
          .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorCAGR_1Y_MCap))
          .map((sector) => ({
            ...sector,
            Companies: transformCompanies(sector.Companies),
          }))
          .sort((a, b) => b.SectorCAGR_1Y_MCap - a.SectorCAGR_1Y_MCap);
        if (validSectors.length === 0) {
          throw new Error('No valid sectors with CAGR data found');
        }

        sectorCache = response.data;
        setSectors(validSectors);
        setSelectedSector(validSectors[0] || null);
      } catch (error) {
        console.error('Error fetching sector data:', error);
        setError(error.message || 'Failed to fetch sector data');
      } finally {
        setLoading(false);
      }
    };

    fetchSectors();
  }, [API_BASE]);

  useEffect(() => {
    // Ensure selectedSector is valid when sectorQuery changes
    if (sectorQuery && selectedSector && !filteredSectors.some((s) => s.Sector === selectedSector.Sector)) {
      setSelectedSector(filteredSectors[0] || null);
    }
  }, [sectorQuery, selectedSector]);

  const removeSymbolFromURL = () => {
    searchParams.delete('symbol');
    setSearchParams(searchParams);
  };

  const onRowClick = (symbol) => {
    if (symbol) {
      navigate(`/equityinsights?symbol=${symbol}`);
    }
  };

  const filteredSectors = sectors.filter((sector) =>
    sector?.Sector?.toLowerCase().includes(sectorQuery.toLowerCase())
  );

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(4, filteredSectors.length),
    slidesToScroll: 1,
    autoplay: false,
    pauseOnHover: true,
    appendDots: (dots) => (
      <div className="mt-4 flex justify-center">
        <ul className="flex gap-2">
          {dots.map((dot, index) => (
            <li key={index} className="mx-1">
              {React.cloneElement(dot, {
                className: `w-3 h-3 rounded-full ${index === dots.findIndex((d) => d.props.className?.includes('slick-active'))
                  ? 'bg-sky-600'
                  : 'bg-gray-300 dark:bg-gray-600'
                  }`,
              })}
            </li>
          ))}
        </ul>
      </div>
    ),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(3, filteredSectors.length) } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(2, filteredSectors.length) } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const handlePrevClick = () => {
    const newIndex = selectedMetric
      ? (metrics.findIndex((m) => m.key === selectedMetric.key) - 1 + metrics.length) % metrics.length
      : 0;
    setSelectedMetric(metrics[newIndex]);
    setRotationOffset((prev) => prev + 360 / metrics.length);
  };

  const handleNextClick = () => {
    const newIndex = selectedMetric
      ? (metrics.findIndex((m) => m.key === selectedMetric.key) + 1) % metrics.length
      : 0;
    setSelectedMetric(metrics[newIndex]);
    setRotationOffset((prev) => prev - 360 / metrics.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCompanyQuery('');
    setSortKey('PE');
    setSortOrder('desc');
  };

  // const formatValue = (value, key) => {
  //   if (value === null || value === undefined || !Number.isFinite(Number(value))) return '-';

  //   const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  //     style: 'currency',
  //     currency: 'INR',
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   });

  //   if (key.includes('CAGR') || key.includes('DividendYield')) {
  //     return formatPercentage(value);
  //   }

  //   if (key.includes('MarketCap') || key === 'Price') {
  //     return formatINRCrore(value);
  //   }

  //   if (key === 'UpDownAmt') {
  //     const formatted = rupeeFormatter.format(Math.abs(value));
  //     return value >= 0 ? `+${formatted}` : `-${formatted}`;
  //   }

  //   return formatNumber(value);
  // };

  const formatValue = (value, key) => {
    if (value === null || value === undefined || !Number.isFinite(Number(value))) return '-';

    const rupeeFormatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (key.includes('CAGR') || key.includes('DividendYield')) {
      return formatPercentage(value);
    }

    if (key.includes('MarketCap')) {
      return formatINRCrore(value);
    }

    if (key === 'Price') {
      return rupeeFormatter.format(value); // Display Price in rupees
    }

    if (key === 'UpDownAmt') {
      const formatted = rupeeFormatter.format(Math.abs(value));
      return value >= 0 ? `+${formatted}` : `-${formatted}`;
    }

    return formatNumber(value);
  };

  const handleSortClick = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  // const renderCompanyTable = (companies) => {
  //   if (!companies || !Array.isArray(companies)) return null;
  //   const filtered = companyQuery
  //     ? companies.filter((c) => c.Symbol?.toLowerCase().includes(companyQuery.toLowerCase()))
  //     : companies;

  //   const sorted = [...filtered].sort((a, b) => {
  //     if (sortKey === 'Symbol') {
  //       return sortOrder === 'asc'
  //         ? (a.Symbol || '').localeCompare(b.Symbol || '')
  //         : (b.Symbol || '').localeCompare(a.Symbol || '');
  //     }
  //     const av = Number(a[sortKey]);
  //     const bv = Number(b[sortKey]);
  //     const valA = Number.isFinite(av) ? av : -Infinity;
  //     const valB = Number.isFinite(bv) ? bv : -Infinity;
  //     return sortOrder === 'asc' ? valA - valB : valB - valA;
  //   });

  //   return sorted.map((c) => (
  //     <tr
  //       key={c.Symbol || Math.random()} // Fallback key for safety
  //       onClick={() => onRowClick(c.Symbol)}
  //       className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${c.UpDown === 'Up'
  //         ? 'text-green-600 dark:text-green-400'
  //         : c.UpDown === 'Down'
  //           ? 'text-red-600 dark:text-red-400'
  //           : ''
  //         }`}
  //     >
  //       <td className="px-4 py-3 whitespace-nowrap">{c.Symbol || '-'}</td>
  //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.Price, 'Price')}</td>
  //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.PE, 'PE')}</td>
  //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.MarketCap, 'MarketCap')}</td>
  //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.bookValue, 'bookValue')}</td>
  //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.EPS, 'EPS')}</td>
  //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.CAGR_1Y_MCap, 'CAGR_1Y_MCap')}</td>
  //       <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.UpDownAmt, 'UpDownAmt')}</td>
  //     </tr>
  //   ));
  // };

  const renderCompanyTable = (companies) => {
    if (!companies || !Array.isArray(companies)) return null;
    const filtered = companyQuery
      ? companies.filter((c) => c.Symbol?.toLowerCase().includes(companyQuery.toLowerCase()))
      : companies;

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'Symbol') {
        return sortOrder === 'asc'
          ? (a.Symbol || '').localeCompare(b.Symbol || '')
          : (b.Symbol || '').localeCompare(a.Symbol || '');
      }

      // Convert values to numbers, handling invalid cases
      const av = a[sortKey] != null ? Number(a[sortKey]) : null;
      const bv = b[sortKey] != null ? Number(b[sortKey]) : null;

      // Handle cases where both values are null or invalid
      if (av === null && bv === null) return 0; // Maintain relative order
      if (av === null) return sortOrder === 'asc' ? 1 : -1; // Null to end
      if (bv === null) return sortOrder === 'asc' ? -1 : 1; // Null to end

      // Sort valid numbers
      return sortOrder === 'asc' ? av - bv : bv - av;
    });

    return sorted.map((c) => (
      <tr
        key={c.Symbol || Math.random()} // Fallback key, but duplicates should be resolved
        onClick={() => onRowClick(c.Symbol)}
        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${c.UpDown === 'Up'
          ? 'text-green-600 dark:text-green-400'
          : c.UpDown === 'Down'
            ? 'text-red-600 dark:text-red-400'
            : ''
          }`}
      >
        <td className="px-4 py-3 whitespace-nowrap">{c.Symbol || '-'}</td>
        <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.Price, 'Price')}</td>
        <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.PE, 'PE')}</td>
        <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.MarketCap, 'MarketCap')}</td>
        <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.bookValue, 'bookValue')}</td>
        <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.EPS, 'EPS')}</td>
        <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.CAGR_1Y_MCap, 'CAGR_1Y_MCap')}</td>
        <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.UpDownAmt, 'UpDownAmt')}</td>
      </tr>
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
        <h3 className="text-lg font-medium text-red-800">Error loading sector data: {error}</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (sectors.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-3xl mx-auto text-center">
        <h3 className="text-lg font-medium text-yellow-800">No Sector Data Available</h3>
        <p className="text-yellow-600 mt-1">No sectors with valid CAGR data were found.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Sector Performance Dashboard</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Analyze market trends and performance metrics across all sectors, sorted by 1-year CAGR (highest to lowest)
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
          <input
            type="text"
            placeholder="Search sectors..."
            value={sectorQuery}
            onChange={(e) => setSectorQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-1 focus:ring-sky-500 w-full sm:w-64"
          />
        </div>
      </div>

      {showSlider && (
        <div className="mb-16 px-2 sm:px-4">
          {filteredSectors.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                No sectors match your search.
              </p>
              <button
                onClick={() => setSectorQuery('')}
                className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : filteredSectors.length === 1 ? (
            <div className="px-2">
              <div
                className={`cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-md hover:shadow-lg ${selectedSector?.Sector === filteredSectors[0].Sector ? 'ring-2 ring-blue-500 ring-opacity-70 scale-105' : ''
                  }`}
                onClick={() => {
                  setSelectedSector(filteredSectors[0]);
                  setSelectedMetric(null);
                }}
              >
                <IndiceCard
                  sectorData={filteredSectors[0]}
                  isSelected={selectedSector?.Sector === filteredSectors[0].Sector}
                  openModal={openModal}
                  setSelectedSector={setSelectedSector}
                />
              </div>
            </div>
          ) : (
            <Slider {...sliderSettings}>
              {filteredSectors.map((sector, index) => (
                <div key={sector.Sector || index} className="m-5 px-2">
                  <div
                    className={`cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-md hover:shadow-lg ${selectedSector?.Sector === sector.Sector ? 'ring-2 ring-blue-500 ring-opacity-70 scale-105' : ''
                      }`}
                    onClick={() => {
                      setSelectedSector(sector);
                      setSelectedMetric(null);
                    }}
                  >
                    <IndiceCard
                      sectorData={sector}
                      isSelected={selectedSector?.Sector === sector.Sector}
                      openModal={openModal}
                      setSelectedSector={setSelectedSector}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      )}

      {isModalOpen && selectedSector && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target.classList.contains('fixed')) closeModal();
          }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto mt-10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{SectorIcons[selectedSector.Sector] || '📊'}</span>
                  <h2 className="text-2xl font-bold text-sky-900 dark:text-white">
                    {selectedSector.Sector} Sector Analysis
                  </h2>
                </div>
                <div className="flex gap-3">
                  {selectedSymbol && (
                    <button
                      onClick={removeSymbolFromURL}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition focus:ring-2 ring-offset-2 ring-red-500"
                    >
                      Clear Selection
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="text-sky-700 dark:text-white hover:text-red-600 dark:hover:text-red-600 transition"
                    aria-label="Close modal"
                  >
                    <IoMdClose size={26} />
                  </button>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-sky-800 dark:text-white mb-4">Key Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Valuation</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sky-700 dark:text-sky-400">P/E Ratio:</span>
                        <span className="font-medium">{formatValue(selectedSector.SectorPE_Mode, 'SectorPE_Mode')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sky-700 dark:text-sky-400">Market Cap:</span>
                        <span className="font-medium">{formatValue(selectedSector.SectorMarketCap, 'SectorMarketCap')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sky-700 dark:text-sky-400">1Y CAGR:</span>
                        <span className="font-medium">{formatValue(selectedSector.SectorCAGR_1Y_MCap, 'SectorCAGR_1Y_MCap')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Market Sentiment</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-600 dark:text-green-400">Advancing:</span>
                        <span className="font-medium">
                          {selectedSector.Ups || '0'}
                          {Number.isFinite(selectedSector.Ups / selectedSector.Total)
                            ? ` (${Math.round((selectedSector.Ups / selectedSector.Total) * 100)}%)`
                            : ''}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600 dark:text-red-400">Declining:</span>
                        <span className="font-medium">
                          {selectedSector.Downs || '0'}
                          {Number.isFinite(selectedSector.Downs / selectedSector.Total)
                            ? ` (${Math.round((selectedSector.Downs / selectedSector.Total) * 100)}%)`
                            : ''}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sky-700 dark:text-sky-400">Total Companies:</span>
                        <span className="font-medium">{selectedSector.Total || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 text-sky-800 dark:text-white p-4 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-sky-900 dark:text-sky-300 mb-3">Sector</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sky-700 dark:text-sky-400">EPS:</span>
                        <span className="font-medium">{formatValue(selectedSector.SectorEPS, 'SectorEPS')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sky-700 dark:text-sky-400">Dividend Yield:</span>
                        <span className="font-medium">{formatValue(selectedSector.SectorDividendYield, 'SectorDividendYield')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sky-700 dark:text-sky-400">Min PE:</span>
                        <span className="font-medium">{formatValue(selectedSector.SectorPE_Min, 'SectorPE_Min')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sky-700 dark:text-sky-400">Max PE:</span>
                        <span className="font-medium">{formatValue(selectedSector.SectorPE_Max, 'SectorPE_Max')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {selectedSector.Companies && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold text-sky-800 dark:text-white">Constituent Companies</h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <select
                        value={sortKey}
                        onChange={(e) => {
                          setSortKey(e.target.value);
                          setSortOrder('desc');
                        }}
                        className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Symbol">Sort by Symbol</option>
                        <option value="Price">Sort by Price</option>
                        <option value="PE">Sort by P/E</option>
                        <option value="MarketCap">Sort by Market Cap</option>
                        <option value="bookValue">Sort by Book Value</option>
                        <option value="EPS">Sort by EPS</option>
                        <option value="CAGR_1Y_MCap">Sort by 1Y CAGR</option>
                        <option value="UpDownAmt">Sort by Change</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500"
                      >
                        {sortOrder === 'asc' ? <FaSortUp size={20} /> : <FaSortDown size={20} />}
                      </button>
                      <input
                        type="text"
                        placeholder="Search companies..."
                        value={companyQuery}
                        onChange={(e) => setCompanyQuery(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <thead className="bg-sky-100 dark:bg-sky-900 sticky top-0 z-10">
                        <tr>
                          {[
                            { label: 'Symbol', key: 'Symbol' },
                            { label: 'Price', key: 'Price' },
                            { label: 'P/E', key: 'PE' },
                            { label: 'Market Cap', key: 'MarketCap' },
                            { label: 'Book Value', key: 'bookValue' },
                            { label: 'EPS', key: 'EPS' },
                            { label: '1Y CAGR', key: 'CAGR_1Y_MCap' },
                            { label: 'Change', key: 'UpDownAmt' },
                          ].map(({ label, key }) => (
                            <th
                              key={key}
                              onClick={() => handleSortClick(key)}
                              className="px-4 py-3 text-left text-xs font-semibold text-sky-900 dark:text-sky-300 uppercase tracking-wide cursor-pointer hover:text-sky-600"
                            >
                              <div className="flex items-center gap-1">
                                {label}
                                {sortKey === key && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {renderCompanyTable(selectedSector.Companies)}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectorSummary;