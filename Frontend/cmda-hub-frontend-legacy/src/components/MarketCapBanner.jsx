

// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import { motion, useInView, AnimatePresence } from 'framer-motion';
// import {
//     Sparkles, TrendingUp, BarChart2, PieChart,
//     Factory, FlaskConical, DollarSign, Car, Code, HeartPulse,
//     Scissors, ShoppingBag, Building2, Hammer, ChevronDown, ChevronUp,
//     ArrowUpRight, Info, RotateCcw, ArrowUp, ArrowDown,
//     ArrowRight
// } from 'lucide-react';
// import { Typewriter } from 'react-simple-typewriter';
// import axios from 'axios';
// import { ResponsivePie } from '@nivo/pie';
// import { ResponsiveBar } from '@nivo/bar';

// const MarketCapBanner = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const ref = useRef(null);
//     const isInView = useInView(ref, { once: true, margin: '-50px' });
//     const [sectors, setSectors] = useState([]);
//     const [selectedSector, setSelectedSector] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [highlightedSector, setHighlightedSector] = useState(null);
//     const [sortOrder, setSortOrder] = useState('desc');
//     const [maxPELessThan10Sector, setMaxPELessThan10Sector] = useState(null);
//     const [minPELessThan10Sector, setMinPELessThan10Sector] = useState(null);
//     const [isDark, setIsDark] = useState(
//         localStorage.getItem('theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
//     );
//     const [viewMode, setViewMode] = useState('bar');

//     const colorPalette = [
//         'rgba(54, 162, 235, 0.8)',  // Blue
//         'rgba(75, 192, 192, 0.8)',  // Teal
//         'rgba(255, 159, 64, 0.8)',  // Orange
//         'rgba(153, 102, 255, 0.8)', // Purple
//         'rgba(255, 205, 86, 0.8)',  // Yellow
//         'rgba(255, 99, 132, 0.8)',  // Red
//         'rgba(100, 181, 246, 0.8)', // Light Blue
//         'rgba(77, 182, 172, 0.8)',  // Green
//         'rgba(186, 104, 200, 0.8)', // Light Purple
//         'rgba(246, 178, 107, 0.8)', // Light Orange
//     ];

//     const highlightColorPalette = colorPalette.map(color =>
//         color.replace('0.8', '1').replace(/,\s*\d+\.\d+\)/, ', 1)')
//     );

//     const sectorIcons = {
//         'Capital Goods': Factory,
//         'Chemicals': FlaskConical,
//         'Finance': DollarSign,
//         'Automobile & Ancillaries': Car,
//         'IT': Code,
//         'Healthcare': HeartPulse,
//         'Textile': Scissors,
//         'FMCG': ShoppingBag,
//         'Infrastructure': Building2,
//         'Iron & Steel': Hammer
//     };

//     const formatDecimal = (num) => {
//         if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//         return Math.round(num * 100) / 100;
//     };

//     useEffect(() => {
//         const handleThemeChange = () => {
//             const storedTheme = localStorage.getItem('theme');
//             const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
//             setIsDark(storedTheme === 'dark' || (storedTheme !== 'light' && systemDark));
//         };

//         handleThemeChange();
//         window.addEventListener('storage', handleThemeChange);
//         const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//         mediaQuery.addEventListener('change', handleThemeChange);

//         return () => {
//             window.removeEventListener('storage', handleThemeChange);
//             mediaQuery.removeEventListener('change', handleThemeChange);
//         };
//     }, []);

//     useEffect(() => {
//         const controller = new AbortController();
//         const cacheDuration = 60 * 60 * 1000;
//         const fetchSectors = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 setSectors([]);

//                 const cachedData = localStorage.getItem('sectorData');
//                 const cacheTimestamp = localStorage.getItem('sectorDataTimestamp');
//                 let validSectors = [];

//                 if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//                     const parsedData = JSON.parse(cachedData);
//                     validSectors = parsedData.data
//                         .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorMarketCap) && Number.isFinite(sector.SectorCAGR_1Y_MCap) && Array.isArray(sector.Companies?.Symbol))
//                         .map((sector, index) => {
//                             const peLessThan10Count = sector.Companies.Symbol.filter((_, i) => {
//                                 const pe = sector.Companies.PE?.[i];
//                                 return pe != null && !isNaN(pe) && pe < 10;
//                             }).length;
//                             return {
//                                 ...sector,
//                                 color: colorPalette[index % colorPalette.length],
//                                 highlightColor: highlightColorPalette[index % highlightColorPalette.length],
//                                 PELessThan10Count: peLessThan10Count,
//                                 TotalCompanies: sector.Companies.Symbol.length
//                             };
//                         });
//                 } else {
//                     const response = await axios.get(`${API_BASE}/landpage/sector-summary`, { signal: controller.signal });
//                     if (response.data.status !== 'success' || !Array.isArray(response.data.data)) {
//                         throw new Error(response.data.message || 'API response is not valid');
//                     }
//                     validSectors = response.data.data
//                         .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorMarketCap) && Number.isFinite(sector.SectorCAGR_1Y_MCap) && Array.isArray(sector.Companies?.Symbol))
//                         .map((sector, index) => {
//                             const peLessThan10Count = sector.Companies.Symbol.filter((_, i) => {
//                                 const pe = sector.Companies.PE?.[i];
//                                 return pe != null && !isNaN(pe) && pe < 10;
//                             }).length;
//                             return {
//                                 ...sector,
//                                 color: colorPalette[index % colorPalette.length],
//                                 highlightColor: highlightColorPalette[index % highlightColorPalette.length],
//                                 PELessThan10Count: peLessThan10Count,
//                                 TotalCompanies: sector.Companies.Symbol.length
//                             };
//                         });
//                     localStorage.setItem('sectorData', JSON.stringify(response.data));
//                     localStorage.setItem('sectorDataTimestamp', Date.now().toString());
//                 }

//                 if (validSectors.length === 0) {
//                     setSectors([]);
//                     setSelectedSector(null);
//                     setMaxPELessThan10Sector(null);
//                     setMinPELessThan10Sector(null);
//                     setLoading(false);
//                     return;
//                 }

//                 const sortedSectors = [...validSectors].sort((a, b) => {
//                     return sortOrder === 'desc' ? b.SectorMarketCap - a.SectorMarketCap : a.SectorMarketCap - b.SectorMarketCap;
//                 }).slice(0, 10);

//                 setSectors(sortedSectors);

//                 const maxPELessThan10Sector = validSectors.reduce((max, sector) => {
//                     if (!max) return sector;
//                     if (sector.PELessThan10Count === max.PELessThan10Count) {
//                         return sector.TotalCompanies < max.TotalCompanies ? sector : max;
//                     }
//                     return sector.PELessThan10Count > max.PELessThan10Count ? sector : max;
//                 }, validSectors[0]);

//                 const minPELessThan10Sector = validSectors.reduce((min, sector) => {
//                     if (!min) return sector;
//                     if (sector.PELessThan10Count === min.PELessThan10Count) {
//                         return sector.TotalCompanies < min.TotalCompanies ? sector : min;
//                     }
//                     return sector.PELessThan10Count < min.PELessThan10Count ? sector : min;
//                 }, validSectors[0]);

//                 setMaxPELessThan10Sector(maxPELessThan10Sector);
//                 setMinPELessThan10Sector(minPELessThan10Sector);

//                 if (sortedSectors.length > 0) {
//                     setSelectedSector(sortedSectors[0]);
//                     setHighlightedSector(0);
//                 } else {
//                     setSelectedSector(null);
//                     setHighlightedSector(null);
//                 }
//                 setLoading(false);
//             } catch (error) {
//                 if (error.name === 'AbortError') return;
//                 setError(error.message || 'Failed to fetch sector data');
//                 console.error('Error fetching sector data:', error, error.response?.data);
//                 setSectors([]);
//                 setSelectedSector(null);
//                 setMaxPELessThan10Sector(null);
//                 setMinPELessThan10Sector(null);
//                 setLoading(false);
//             }
//         };

//         const debounceFetch = setTimeout(() => fetchSectors(), 100);
//         return () => {
//             controller.abort();
//             clearTimeout(debounceFetch);
//         };
//     }, [API_BASE, sortOrder]);

//     const formatNumber = useCallback((num) => {
//         if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
//         const absNum = Math.abs(num);
//         const sign = num < 0 ? '-' : '';
//         if (absNum >= 1e7) {
//             const value = absNum / 1e7;
//             return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} Cr`;
//         }
//         if (absNum >= 1e5) {
//             const value = absNum / 1e5;
//             return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} L`;
//         }
//         return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//     }, []);

//     const totalMarketCap = useMemo(() => {
//         return sectors.reduce((sum, sector) => sum + (sector.SectorMarketCap || 0), 0);
//     }, [sectors]);

//     // Prepare data for bar chart - different structure than pie chart
//     const barChartData = useMemo(() => {
//         if (!Array.isArray(sectors) || sectors.length === 0) {
//             return [{ id: 'No Data', value: 1 }];
//         }

//         // Sort sectors by market cap for bar chart display
//         const sortedSectors = [...sectors].sort((a, b) => b.SectorMarketCap - a.SectorMarketCap);

//         return sortedSectors.map((sector, index) => ({
//             id: sector.Sector || 'Unknown',
//             value: sector.SectorMarketCap || 0,
//             color: highlightedSector === index ? sector.highlightColor : sector.color,
//             originalIndex: sortedSectors.findIndex(s => s.Sector === sector.Sector) // Keep track of original index
//         }));
//     }, [sectors, highlightedSector]);

//     const pieChartData = useMemo(() => {
//         if (!Array.isArray(sectors) || sectors.length === 0) {
//             return [{ id: 'No Data', value: 1, color: isDark ? 'rgba(50, 50, 50, 0.5)' : 'rgba(200, 200, 200, 0.5)' }];
//         }
//         return sectors.map((sector, index) => ({
//             id: sector.Sector || 'Unknown',
//             value: sector.SectorMarketCap || 0,
//             color: highlightedSector === index ? sector.highlightColor : sector.color,
//         }));
//     }, [sectors, highlightedSector, isDark]);

//     const loaderChartData = useMemo(() => [
//         { id: 'Loading...', value: 1, color: isDark ? 'rgba(50, 50, 50, 0.5)' : 'rgba(200, 200, 200, 0.5)' },
//         { id: 'Loading...', value: 1, color: isDark ? 'rgba(60, 60, 60, 0.5)' : 'rgba(180, 180, 180, 0.5)' },
//         { id: 'Loading...', value: 1, color: isDark ? 'rgba(70, 70, 70, 0.5)' : 'rgba(160, 160, 160, 0.5)' },
//     ], [isDark]);

//     const chartTheme = useMemo(() => ({
//         textColor: isDark ? '#e5e5e5' : '#3d3a3aff',
//         fontSize: 12,
//         labels: {
//             text: {
//                 fill: isDark ? '#ffffff' : '#3638ceff',
//             },
//         },
//         tooltip: {
//             container: {
//                 background: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(190, 50, 50, 0.9)',
//                 color: isDark ? '#ffffff' : '#2c41b9ff',
//                 fontSize: 12,
//             },
//         },
//         legends: {
//             text: {
//                 fill: isDark ? '#ffffff' : '#494bdbff',
//                 fontSize: 13,
//             },
//         },
//         axis: {
//             ticks: {
//                 text: {
//                     fill: isDark ? '#e5e5e5' : '#1973c7ff',
//                 },
//             },
//             legend: {
//                 text: {
//                     fill: isDark ? '#e5e5e5' : '#3165a1ff',
//                 },
//             },
//         },
//         grid: {
//             line: {
//                 stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
//             },
//         },
//     }), [isDark]);

//     const toggleSortOrder = () => {
//         setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
//     };

//     const toggleViewMode = () => {
//         setViewMode(prev => prev === 'bar' ? 'pie' : 'bar');
//     };

//     // Fixed click handler for bar chart
//     const handleBarClick = (datum) => {
//         if (!loading && sectors.length > 0 && datum && datum.indexValue) {
//             const sectorName = datum.indexValue;
//             const clickedSectorIndex = sectors.findIndex(s => s.Sector === sectorName);

//             if (clickedSectorIndex >= 0) {
//                 setSelectedSector(sectors[clickedSectorIndex]);
//                 setHighlightedSector(clickedSectorIndex);

//                 // Add visual feedback
//                 const clickedElement = document.querySelector(`[data-id="${sectorName}"]`);
//                 if (clickedElement) {
//                     clickedElement.style.transform = 'scale(1.05)';
//                     setTimeout(() => {
//                         clickedElement.style.transform = 'scale(1)';
//                     }, 200);
//                 }
//             }
//         }
//     };

//     // Fixed click handler for pie chart
//     const handlePieClick = (datum) => {
//         if (!loading && sectors.length > 0 && datum) {
//             const sectorName = datum.id;
//             const clickedSectorIndex = sectors.findIndex(s => s.Sector === sectorName);

//             if (clickedSectorIndex >= 0) {
//                 setSelectedSector(sectors[clickedSectorIndex]);
//                 setHighlightedSector(clickedSectorIndex);
//             }
//         }
//     };

//     const CustomTooltip = ({ datum, isPie = true }) => {
//         if (!datum) return null;

//         let id, value;

//         if (isPie) {
//             id = datum.id;
//             value = datum.value;
//         } else {
//             id = datum.indexValue || datum.id;
//             value = datum.value;
//         }

//         const percentage = totalMarketCap > 0 ? ((value / totalMarketCap) * 100).toFixed(1) : 0;

//         return (
//             <div
//                 style={{
//                     background: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
//                     padding: '8px 12px',
//                     borderRadius: '6px',
//                     color: isDark ? '#ffffff' : '#000000',
//                     border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                 }}
//             >
//                 <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
//                     {id}
//                 </strong>
//                 <div style={{ fontSize: '12px' }}>
//                     {formatNumber(value)} ({percentage}%)
//                 </div>
//                 <div style={{ fontSize: '10px', color: isDark ? '#cccccc' : '#666666', marginTop: '2px' }}>
//                     Click to select
//                 </div>
//             </div>
//         );
//     };

//     const CustomArcLinkLabel = ({ x, y, dx, dy, rotation, label, textAnchor, textColor, linkColor }) => {
//         const lines = label.includes('&') ? label.split(' & ') : [label];
//         return (
//             <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
//                 <line
//                     x1={0}
//                     x2={dx}
//                     y1={0}
//                     y2={dy}
//                     stroke={linkColor}
//                     strokeWidth={1}
//                     fill="none"
//                 />
//                 <text
//                     dy=".35em"
//                     dx={textAnchor === 'end' ? -8 : 8}
//                     textAnchor={textAnchor}
//                     style={{ fill: textColor, fontSize: 12 }}
//                 >
//                     {lines.map((line, i) => (
//                         <tspan key={i} x={0} dy={i > 0 ? '1.2em' : 0}>
//                             {line}
//                         </tspan>
//                     ))}
//                 </text>
//             </g>
//         );
//     };

//     return (
//         <div className="relative px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 flex items-center justify-center dark:via-gray-800 dark:to-gray-900  ">
//             <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 z-10">
//                 {/* Left Section: Title and Selected Sector Card */}
//                 <div className="w-full lg:w-1/2 text-gray-800 dark:text-gray-100 text-center lg:text-left">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={isInView ? { opacity: 1, y: 0 } : {}}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <div className="flex items-center justify-center lg:justify-start text-slate-700 dark:text-indigo-300 text-sm sm:text-base font-medium">
//                             <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
//                             <span>Sector Analytics Platform</span>
//                         </div>
//                         <h1 className="mt-2 sm:mt-4 text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-center lg:text-left">
//                             Capital Market{" "}
//                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300">
//                                 Data Analytics
//                             </span>
//                             <span className="z-10 align-right inline-block -rotate-6 bg-white text-sky-600 dark:bg-slate-800 font-semibold text-xs sm:text-sm px-2 py-1 rounded-md border border-sky-300 dark:border-sky-600 shadow-sm">
//                                 BETA
//                             </span>
//                         </h1>

//                         <p className="mt-2 sm:mt-5 text-base sm:text-l text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 text-center lg:text-left min-h-[80px] sm:min-h-[100px]">
//                             <Typewriter
//                                 words={[
//                                     'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                                     'Vijay Kedia  - "Only two people can BUY at BOTTOM and SELL at TOP one is GOD and other is a LIAR."',
//                                     'Ray Dalio - "If you are not aggressive you will not make money; if you are not defensive you will not keep money."',
//                                     'Rakesh Jhunjhunwala - "Trading is for creating capital and investment is for growth of capital."',
//                                     'Ray Dalio - " There are two main drivers of asset class returns - inflation and growth."',
//                                 ]}
//                                 loop={0}
//                                 cursor
//                                 cursorStyle="|"
//                                 typeSpeed={60}
//                                 deleteSpeed={30}
//                                 delaySpeed={1500}
//                             />
//                         </p>

//                         <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
//                             <button
//                                 onClick={toggleSortOrder}
//                                 disabled={loading}
//                                 className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-600 text-white rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-700"
//                                 aria-label={`Sort by Market Cap: ${sortOrder === 'desc' ? 'High to Low' : 'Low to High'}`}
//                             >
//                                 {sortOrder === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
//                                 Sort: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
//                             </button>

//                             <button
//                                 onClick={toggleViewMode}
//                                 disabled={loading}
//                                 className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700"
//                                 aria-label={`Switch to ${viewMode === 'bar' ? 'Pie' : 'Bar'} Chart view`}
//                             >
//                                 {viewMode === 'bar' ? <BarChart2 size={16} /> : <PieChart size={16} />}
//                                 Switch to {viewMode === 'bar' ? 'Pie Chart' : 'Bar Chart'}
//                             </button>
//                         </div>
//                     </motion.div>

//                     {/* <AnimatePresence mode="wait">
//                         {loading ? (
//                             <motion.div
//                                 key="loading"
//                                 className="sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-sm sm:max-w-md mx-auto p-4 sm:p-5"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 <div className="animate-pulse flex flex-col items-center space-y-3 sm:space-y-4">
//                                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
//                                     <div className="w-3/4 h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                                     <div className="w-1/2 h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                                     <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
//                                         {[...Array(4)].map((_, i) => (
//                                             <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-lg flex flex-col space-y-1">
//                                                 <div className="w-1/2 h-2 sm:h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                                                 <div className="w-3/4 h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         ) : !selectedSector || sectors.length === 0 ? (
//                             <motion.div
//                                 key="no-data"
//                                 className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-sm sm:max-w-md mx-auto p-4 sm:p-5 text-center"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
//                                     No sector data available
//                                 </p>
//                                 <button
//                                     onClick={() => window.location.reload()}
//                                     className="mt-3 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm sm:text-base transition-colors duration-200"
//                                 >
//                                     Retry
//                                 </button>
//                             </motion.div>
//                         ) : (
//                             <motion.div
//                                 key="data"
//                                 className="mt-3 sm:mt-8 flex flex-col gap-5 w-full max-w-sm sm:max-w-md mx-auto lg:mx-0"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 <motion.div
//                                     className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full p-4 sm:p-5"
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     transition={{ delay: 0.1, duration: 0.3 }}
//                                 >
//                                     <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5">
//                                         <motion.div
//                                             className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center shadow-md"
//                                             style={{
//                                                 backgroundColor: selectedSector.highlightColor || selectedSector.color || '#3b82f6',
//                                                 color: 'white',
//                                             }}
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.95 }}
//                                             transition={{ type: "spring", stiffness: 300, damping: 10 }}
//                                         >
//                                             {sectorIcons[selectedSector.Sector] ? (
//                                                 React.createElement(sectorIcons[selectedSector.Sector], {
//                                                     className: "w-5 sm:w-6 h-5 sm:h-6",
//                                                     strokeWidth: 1.5,
//                                                 })
//                                             ) : (
//                                                 <PieChart className="w-5 sm:w-6 h-5 sm:h-6" strokeWidth={1.5} />
//                                             )}
//                                         </motion.div>
//                                         <div>
//                                             <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
//                                                 {selectedSector.Sector}
//                                             </h3>
//                                             <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
//                                                 {selectedSector.description || 'Sector performance overview'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                                         <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-600">
//                                             <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
//                                                 <PieChart className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
//                                                 Market Cap
//                                             </div>
//                                             <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
//                                                 {formatNumber(selectedSector.SectorMarketCap)}
//                                             </p>
//                                         </div>
//                                         <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-green-100 dark:border-gray-600">
//                                             <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
//                                                 <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
//                                                 TTM Revenue (%Chng)
//                                             </div>
//                                             <p
//                                                 className={`text-base sm:text-lg font-medium ${selectedSector.SectorCAGR_1Y_MCap >= 0
//                                                     ? 'text-green-600 dark:text-green-400'
//                                                     : 'text-red-600 dark:text-red-400'
//                                                     }`}
//                                             >
//                                                 {selectedSector.SectorCAGR_1Y_MCap
//                                                     ? `${formatDecimal(selectedSector.SectorCAGR_1Y_MCap * 100)}%`
//                                                     : 'N/A'}
//                                             </p>
//                                         </div>
//                                         <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-purple-100 dark:border-gray-600">
//                                             <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
//                                                 <BarChart2 className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
//                                                 PE Ratio
//                                             </div>
//                                             <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
//                                                 {formatDecimal(selectedSector.SectorPE_Mode || 'N/A')}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence> */}

//                     <AnimatePresence mode="wait">
//                         {loading ? (
//                             <motion.div
//                                 key="loading"
//                                 className="sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-sm sm:max-w-md mx-auto p-3 sm:p-5"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 <div className="animate-pulse flex flex-col items-center space-y-3 sm:space-y-4">
//                                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
//                                     <div className="w-3/4 h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                                     <div className="w-1/2 h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                                     <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
//                                         {[...Array(4)].map((_, i) => (
//                                             <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-lg flex flex-col space-y-1">
//                                                 <div className="w-1/2 h-2 sm:h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                                                 <div className="w-3/4 h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         ) : !selectedSector || sectors.length === 0 ? (
//                             <motion.div
//                                 key="no-data"
//                                 className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-sm sm:max-w-md mx-auto p-4  sm:p-5 text-center"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
//                                     No sector data available
//                                 </p>
//                                 <button
//                                     onClick={() => window.location.reload()}
//                                     className="mt-3 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm sm:text-base transition-colors duration-200"
//                                 >
//                                     Retry
//                                 </button>
//                             </motion.div>
//                         ) : (
//                             <motion.div
//                                 key="data"
//                                 className="mt-3 sm:mt-8 bg-gradient-to-br from-slate-400 via-blue-50/30 to-slate-100 dark:from-gray-800 dark:via-slate-800/60 rounded-lg dark:to-gray-900 flex flex-col gap-5 w-full max-w-sm sm:max-w-md mx-auto shadow-xl lg:mx-0 relative"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 {/* View More Button - Top Right Corner */}
//                                 <motion.div
//                                     className=" border border-gray-100 dark:border-gray-200 overflow-hidden w-full p-4 sm:p-5 relative"
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     transition={{ delay: 0.1, duration: 0.3 }}
//                                 >


//                                     {/* Card Content */}
//                                     <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5 mt-6 sm:mt-8">
//                                         <motion.div
//                                             className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center shadow-md"
//                                             style={{
//                                                 backgroundColor: selectedSector.highlightColor || selectedSector.color || '#3b82f6',
//                                                 color: 'white',
//                                             }}
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.95 }}
//                                             transition={{ type: 'spring', stiffness: 300, damping: 10 }}
//                                         >
//                                             {sectorIcons[selectedSector.Sector] ? (
//                                                 React.createElement(sectorIcons[selectedSector.Sector], {
//                                                     className: 'w-5 sm:w-6 h-5 sm:h-6',
//                                                     strokeWidth: 1.5,
//                                                 })
//                                             ) : (
//                                                 <PieChart className="w-5 sm:w-6 h-5 sm:h-6" strokeWidth={1.5} />
//                                             )}
//                                         </motion.div>

//                                         <div >
//                                             <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
//                                                 {selectedSector.Sector}
//                                             </h3>
//                                             <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
//                                                 {selectedSector.description || 'Sector performance overview'}
//                                             </p>
//                                         </div>
//                                         {/* ✅ View More Button — Top Right */}
//                                         <div className="absolute top-4 right-4">
//                                             <motion.button
//                                                 onClick={() => {
//                                                     const element = document.getElementById('sector-details');
//                                                     if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                                                 }}
//                                                 className="group flex items-center gap-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200"
//                                                 whileTap={{ scale: 0.97 }}
//                                             >
//                                                 <span className="relative">
//                                                     View More
//                                                     <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
//                                                 </span>
//                                                 <motion.div
//                                                     initial={{ x: 0 }}
//                                                     whileHover={{ x: 4 }}
//                                                     transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//                                                 >
//                                                     <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-blue-400 ml-1" />
//                                                 </motion.div>
//                                             </motion.button>
//                                         </div>
//                                     </div>

//                                     {/* Stat Grid (same as before) */}
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-300 dark:bg-gray-800 p-2 rounded-xl sm:gap-3 mb-2 sm:mb-2">
//                                         <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-600">
//                                             <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
//                                                 <PieChart className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
//                                                 Market Cap
//                                             </div>
//                                             <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
//                                                 {formatNumber(selectedSector.SectorMarketCap)}
//                                             </p>
//                                         </div>

//                                         <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-green-100 dark:border-gray-600">
//                                             <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
//                                                 <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
//                                                 TTM Revenue (%Chng)
//                                             </div>
//                                             <p
//                                                 className={`text-base sm:text-lg font-medium ${selectedSector.SectorCAGR_1Y_MCap >= 0
//                                                     ? 'text-green-600 dark:text-green-400'
//                                                     : 'text-red-600 dark:text-red-400'
//                                                     }`}
//                                             >
//                                                 {selectedSector.SectorCAGR_1Y_MCap
//                                                     ? `${formatDecimal(selectedSector.SectorCAGR_1Y_MCap * 100)}%`
//                                                     : 'N/A'}
//                                             </p>
//                                         </div>

//                                         <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-purple-100 dark:border-gray-600 sm:col-span-2">
//                                             <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
//                                                 <BarChart2 className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
//                                                 PE Ratio
//                                             </div>
//                                             <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
//                                                 {formatDecimal(selectedSector.SectorPE_Mode || 'N/A')}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </motion.div>




//                                 {/* <motion.div
//                                     className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full p-4 sm:p-5"
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     transition={{ delay: 0.1, duration: 0.3 }}
//                                 >
//                                     <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5">
//                                         <motion.div
//                                             className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center shadow-md"
//                                             style={{
//                                                 backgroundColor: selectedSector.highlightColor || selectedSector.color || '#3b82f6',
//                                                 color: 'white',
//                                             }}
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.95 }}
//                                             transition={{ type: "spring", stiffness: 300, damping: 10 }}
//                                         >
//                                             {sectorIcons[selectedSector.Sector] ? (
//                                                 React.createElement(sectorIcons[selectedSector.Sector], {
//                                                     className: "w-5 sm:w-6 h-5 sm:h-6",
//                                                     strokeWidth: 1.5,
//                                                 })
//                                             ) : (
//                                                 <PieChart className="w-5 sm:w-6 h-5 sm:h-6" strokeWidth={1.5} />
//                                             )}
//                                         </motion.div>
//                                         <div>
//                                             <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
//                                                 {selectedSector.Sector}
//                                             </h3>
//                                             <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
//                                                 {selectedSector.description || 'Sector performance overview'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                                         <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-600">
//                                             <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
//                                                 <PieChart className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
//                                                 Market Cap
//                                             </div>
//                                             <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
//                                                 {formatNumber(selectedSector.SectorMarketCap)}
//                                             </p>
//                                         </div>
//                                         <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-green-100 dark:border-gray-600">
//                                             <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
//                                                 <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
//                                                 TTM Revenue (%Chng)
//                                             </div>
//                                             <p
//                                                 className={`text-base sm:text-lg font-medium ${selectedSector.SectorCAGR_1Y_MCap >= 0
//                                                     ? 'text-green-600 dark:text-green-400'
//                                                     : 'text-red-600 dark:text-red-400'
//                                                     }`}
//                                             >
//                                                 {selectedSector.SectorCAGR_1Y_MCap
//                                                     ? `${formatDecimal(selectedSector.SectorCAGR_1Y_MCap * 100)}%`
//                                                     : 'N/A'}
//                                             </p>
//                                         </div>
//                                         <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-purple-100 dark:border-gray-600">
//                                             <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
//                                                 <BarChart2 className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
//                                                 PE Ratio
//                                             </div>
//                                             <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
//                                                 {formatDecimal(selectedSector.SectorPE_Mode || 'N/A')}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </motion.div> */}
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>

//                 {/* Right Section: Chart */}
//                 <div className="w-full lg:w-1/2 mt-6 sm:mt-8 lg:mt-0 relative">
//                     {error ? (
//                         <div className="text-center px-4 py-3 sm:py-4 text-gray-500 dark:bg-gray-800 dark:text-gray-300 text-sm sm:text-base">
//                             Could not load sector visualization: {error}
//                         </div>
//                     ) : (
//                         // <div className="mt-20 w-full h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[70vh] min-h-[300px] relative">
//                         //     {viewMode === 'bar' ? (
//                         //         <ResponsiveBar
//                         //             data={loading ? loaderChartData : barChartData}
//                         //             keys={["value"]}
//                         //             indexBy="id"
//                         //             layout="horizontal"
//                         //             margin={{ top: 50, right: 90, bottom: 20, left: 120 }}
//                         //             padding={0.4}
//                         //             valueScale={{ type: "linear", min: 0, nice: true }}
//                         //             indexScale={{ type: "band", round: true, padding: 0.2 }}
//                         //             colors={({ data }) => data.color || "#cccccc"}
//                         //             borderWidth={2}
//                         //             borderRadius={4}
//                         //             enableGridX={true}
//                         //             enableGridY={false}
//                         //             gridXValues={5}
//                         //             axisTop={null}
//                         //             axisRight={null}
//                         //             axisBottom={{
//                         //                 format: (v) => formatNumber(v),
//                         //                 tickSize: 6,
//                         //                 tickPadding: 10,
//                         //                 tickRotation: -45,
//                         //                 legend: "Market Cap",
//                         //                 legendPosition: "middle",
//                         //                 legendOffset: 50,
//                         //                 tickTextColor: isDark ? "#e0e0e0" : "#333333",
//                         //                 legendTextColor: isDark ? "#e0e0e0" : "#333333",
//                         //             }}
//                         //             axisLeft={{
//                         //                 tickSize: 6,
//                         //                 tickPadding: 10,
//                         //                 tickRotation: 0,
//                         //                 legend: "Sectors",
//                         //                 legendPosition: "middle",
//                         //                 legendOffset: -70,
//                         //                 tickTextColor: isDark ? "#e0e0e0" : "#333333",
//                         //                 legendTextColor: isDark ? "#e0e0e0" : "#333333",
//                         //             }}
//                         //             labelSkipWidth={15}
//                         //             labelSkipHeight={15}
//                         //             labelTextColor={{
//                         //                 from: "color",
//                         //                 modifiers: [["darker", 2.5]],
//                         //             }}
//                         //             label={(d) => formatNumber(d.value)}
//                         //             enableLabel={true}
//                         //             animate={true}
//                         //             motionStiffness={90}
//                         //             motionDamping={15}
//                         //             theme={chartTheme}
//                         //             tooltip={({ indexValue, value }) => (
//                         //                 <CustomTooltip datum={{ indexValue, value }} isPie={false} />
//                         //             )}
//                         //             onClick={handleBarClick}
//                         //             isInteractive={true}
//                         //         />
//                         //     ) : (
//                         //         <ResponsivePie
//                         //             data={loading ? loaderChartData : pieChartData}
//                         //             key={isDark ? 'dark' : 'light'}
//                         //             margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//                         //             innerRadius={0.5}
//                         //             padAngle={0.7}
//                         //             cornerRadius={3}
//                         //             colors={{ datum: 'data.color' }}
//                         //             borderWidth={1}
//                         //             enableArcLinkLabels={true}
//                         //             arcLinkLabelsSkipAngle={12}
//                         //             arcLinkLabelsTextColor={isDark ? '#ffffff' : '#686565ff'}
//                         //             arcLinkLabelsThickness={2}
//                         //             arcLinkLabelsDiagonalLength={16}
//                         //             arcLinkLabelsStraightLength={24}
//                         //             arcLinkLabelsColor={{ from: 'color' }}
//                         //             arcLinkLabelsComponent={CustomArcLinkLabel}
//                         //             enableArcLabels={false}
//                         //             animate={true}
//                         //             motionStiffness={90}
//                         //             motionDamping={15}
//                         //             tooltip={({ datum }) => <CustomTooltip datum={datum} isPie={true} />}
//                         //             theme={chartTheme}
//                         //             onClick={handlePieClick}
//                         //             isInteractive={true}
//                         //         />
//                         //     )}
//                         // </div>
//                         <div
//                             className="
//                         w-full relative
//                         h-[45vh] sm:h-[50vh] md:h-[55vh]
//                         max-h-[500px] min-h-[600px]
//                     "
//                         >
//                             {viewMode === "bar" ? (
//                                 <ResponsiveBar
//                                     data={loading ? loaderChartData : barChartData}
//                                     keys={["value"]}
//                                     indexBy="id"
//                                     layout="horizontal"
//                                     margin={{ top: 50, right: 90, bottom: 80, left: 120 }}
//                                     padding={0.4}
//                                     valueScale={{ type: "linear", min: 0, nice: true }}
//                                     indexScale={{ type: "band", round: true, padding: 0.2 }}
//                                     colors={({ data }) => data.color || "#cccccc"}
//                                     borderWidth={2}
//                                     borderRadius={4}
//                                     enableGridX={true}
//                                     enableGridY={false}
//                                     gridXValues={5}
//                                     axisTop={null}
//                                     axisRight={null}
//                                     axisBottom={{
//                                         format: (v) => formatNumber(v),
//                                         tickSize: 6,
//                                         tickPadding: 10,
//                                         tickRotation: -45,
//                                         legend: "Market Cap",
//                                         legendPosition: "middle",
//                                         legendOffset: 50,
//                                         tickTextColor: isDark ? "#e0e0e0" : "#333333",
//                                         legendTextColor: isDark ? "#e0e0e0" : "#333333",
//                                     }}
//                                     axisLeft={{
//                                         tickSize: 6,
//                                         tickPadding: 10,
//                                         tickRotation: 0,
//                                         legend: "Sectors",
//                                         legendPosition: "middle",
//                                         legendOffset: -70,
//                                         tickTextColor: isDark ? "#e0e0e0" : "#333333",
//                                         legendTextColor: isDark ? "#e0e0e0" : "#333333",
//                                     }}
//                                     labelSkipWidth={15}
//                                     labelSkipHeight={15}
//                                     labelTextColor={{
//                                         from: "color",
//                                         modifiers: [["darker", 2.5]],
//                                     }}
//                                     label={(d) => formatNumber(d.value)}
//                                     enableLabel={true}
//                                     animate={true}
//                                     motionStiffness={90}
//                                     motionDamping={15}
//                                     theme={chartTheme}
//                                     tooltip={({ indexValue, value }) => (
//                                         <CustomTooltip datum={{ indexValue, value }} isPie={false} />
//                                     )}
//                                     onClick={handleBarClick}
//                                     isInteractive={true}
//                                 />
//                             ) : (
//                                 <ResponsivePie
//                                     data={loading ? loaderChartData : pieChartData}
//                                     key={isDark ? "dark" : "light"}
//                                     margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//                                     innerRadius={0.5}
//                                     padAngle={0.7}
//                                     cornerRadius={3}
//                                     colors={{ datum: "data.color" }}
//                                     borderWidth={1}
//                                     enableArcLinkLabels={true}
//                                     arcLinkLabelsSkipAngle={12}
//                                     arcLinkLabelsTextColor={isDark ? "#ffffff" : "#686565ff"}
//                                     arcLinkLabelsThickness={2}
//                                     arcLinkLabelsDiagonalLength={16}
//                                     arcLinkLabelsStraightLength={24}
//                                     arcLinkLabelsColor={{ from: "color" }}
//                                     arcLinkLabelsComponent={CustomArcLinkLabel}
//                                     enableArcLabels={false}
//                                     animate={true}
//                                     motionStiffness={90}
//                                     motionDamping={15}
//                                     tooltip={({ datum }) => (
//                                         <CustomTooltip datum={datum} isPie={true} />
//                                     )}
//                                     theme={chartTheme}
//                                     onClick={handlePieClick}
//                                     isInteractive={true}
//                                 />
//                             )}
//                         </div>

//                     )}
//                     <div className="text-center mt-2 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
//                         <p className="text-sky-600 dark:text-sky-300 font-medium">
//                             Showing top 10 sectors by Market Cap ({sortOrder === 'desc' ? 'highest to lowest' : 'lowest to highest'})
//                         </p>
//                         <p className="text-gray-500 dark:text-gray-400 mt-1">
//                             Total Market Cap: {formatNumber(totalMarketCap)}
//                         </p>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MarketCapBanner;


import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
    Sparkles, TrendingUp, BarChart2, PieChart,
    Factory, FlaskConical, DollarSign, Car, Code, HeartPulse,
    Scissors, ShoppingBag, Building2, Hammer, ChevronDown, ChevronUp,
    ArrowUpRight, Info, RotateCcw, ArrowUp, ArrowDown,
    ArrowRight
} from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

const MarketCapBanner = () => {
    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [sectors, setSectors] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [highlightedSector, setHighlightedSector] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');
    const [maxPELessThan10Sector, setMaxPELessThan10Sector] = useState(null);
    const [minPELessThan10Sector, setMinPELessThan10Sector] = useState(null);
    const [isDark, setIsDark] = useState(
        localStorage.getItem('theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    const [viewMode, setViewMode] = useState('bar');

    const colorPalette = [
        'rgba(54, 162, 235, 0.8)',  // Blue
        'rgba(75, 192, 192, 0.8)',  // Teal
        'rgba(255, 159, 64, 0.8)',  // Orange
        'rgba(153, 102, 255, 0.8)', // Purple
        'rgba(255, 205, 86, 0.8)',  // Yellow
        'rgba(255, 99, 132, 0.8)',  // Red
        'rgba(100, 181, 246, 0.8)', // Light Blue
        'rgba(77, 182, 172, 0.8)',  // Green
        'rgba(186, 104, 200, 0.8)', // Light Purple
        'rgba(246, 178, 107, 0.8)', // Light Orange
    ];

    const highlightColorPalette = colorPalette.map(color =>
        color.replace('0.8', '1').replace(/,\s*\d+\.\d+\)/, ', 1)')
    );

    const sectorIcons = {
        'Capital Goods': Factory,
        'Chemicals': FlaskConical,
        'Finance': DollarSign,
        'Automobile & Ancillaries': Car,
        'IT': Code,
        'Healthcare': HeartPulse,
        'Textile': Scissors,
        'FMCG': ShoppingBag,
        'Infrastructure': Building2,
        'Iron & Steel': Hammer
    };

    const formatDecimal = (num) => {
        if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
        return Math.round(num * 100) / 100;
    };

    useEffect(() => {
        const handleThemeChange = () => {
            const storedTheme = localStorage.getItem('theme');
            const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(storedTheme === 'dark' || (storedTheme !== 'light' && systemDark));
        };

        handleThemeChange();
        window.addEventListener('storage', handleThemeChange);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleThemeChange);

        return () => {
            window.removeEventListener('storage', handleThemeChange);
            mediaQuery.removeEventListener('change', handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const fetchSectors = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${API_BASE}/landpage/sector-summary`,
                    { signal: controller.signal }
                );

                if (
                    response.data?.status !== "success" ||
                    !Array.isArray(response.data.data)
                ) {
                    throw new Error(response.data?.message || "Invalid API response");
                }

                const validSectors = response.data.data
                    .filter(
                        (sector) =>
                            sector?.Sector &&
                            Number.isFinite(sector.SectorMarketCap) &&
                            Number.isFinite(sector.SectorCAGR_1Y_MCap) &&
                            Array.isArray(sector.Companies?.Symbol)
                    )
                    .map((sector, index) => {
                        const peLessThan10Count = sector.Companies.Symbol.filter((_, i) => {
                            const pe = sector.Companies.PE?.[i];
                            return pe != null && !isNaN(pe) && pe < 10;
                        }).length;

                        return {
                            ...sector,
                            color: colorPalette[index % colorPalette.length],
                            highlightColor:
                                highlightColorPalette[index % highlightColorPalette.length],
                            PELessThan10Count: peLessThan10Count,
                            TotalCompanies: sector.Companies.Symbol.length,
                        };
                    });

                if (validSectors.length === 0) {
                    setSectors([]);
                    setSelectedSector(null);
                    setMaxPELessThan10Sector(null);
                    setMinPELessThan10Sector(null);
                    return;
                }

                const sortedSectors = [...validSectors]
                    .sort((a, b) =>
                        sortOrder === "desc"
                            ? b.SectorMarketCap - a.SectorMarketCap
                            : a.SectorMarketCap - b.SectorMarketCap
                    )
                    .slice(0, 10);

                setSectors(sortedSectors);

                const maxPELessThan10Sector = validSectors.reduce((max, sector) => {
                    if (!max) return sector;
                    if (sector.PELessThan10Count === max.PELessThan10Count) {
                        return sector.TotalCompanies < max.TotalCompanies ? sector : max;
                    }
                    return sector.PELessThan10Count > max.PELessThan10Count ? sector : max;
                }, null);

                const minPELessThan10Sector = validSectors.reduce((min, sector) => {
                    if (!min) return sector;
                    if (sector.PELessThan10Count === min.PELessThan10Count) {
                        return sector.TotalCompanies < min.TotalCompanies ? sector : min;
                    }
                    return sector.PELessThan10Count < min.PELessThan10Count ? sector : min;
                }, null);

                setMaxPELessThan10Sector(maxPELessThan10Sector);
                setMinPELessThan10Sector(minPELessThan10Sector);

                if (sortedSectors.length > 0) {
                    setSelectedSector(sortedSectors[0]);
                    setHighlightedSector(0);
                } else {
                    setSelectedSector(null);
                    setHighlightedSector(null);
                }

            } catch (error) {
                if (axios.isCancel(error)) return;

                console.error("Error fetching sector data:", error);
                setError(error.message || "Failed to fetch sector data");
                setSectors([]);
                setSelectedSector(null);
                setMaxPELessThan10Sector(null);
                setMinPELessThan10Sector(null);
            } finally {
                setLoading(false);
            }
        };

        const debounceId = setTimeout(fetchSectors, 100);

        return () => {
            controller.abort();
            clearTimeout(debounceId);
        };
    }, [API_BASE, sortOrder]);


    const formatNumber = useCallback((num) => {
        if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
        const absNum = Math.abs(num);
        const sign = num < 0 ? '-' : '';
        if (absNum >= 1e7) {
            const value = absNum / 1e7;
            return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} Cr`;
        }
        if (absNum >= 1e5) {
            const value = absNum / 1e5;
            return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} L`;
        }
        return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
    }, []);

    const totalMarketCap = useMemo(() => {
        return sectors.reduce((sum, sector) => sum + (sector.SectorMarketCap || 0), 0);
    }, [sectors]);

    // Prepare data for bar chart - different structure than pie chart
    const barChartData = useMemo(() => {
        if (!Array.isArray(sectors) || sectors.length === 0) {
            return [{ id: 'No Data', value: 1 }];
        }

        // Sort sectors by market cap for bar chart display
        const sortedSectors = [...sectors].sort((a, b) => b.SectorMarketCap - a.SectorMarketCap);

        return sortedSectors.map((sector, index) => ({
            id: sector.Sector || 'Unknown',
            value: sector.SectorMarketCap || 0,
            color: highlightedSector === index ? sector.highlightColor : sector.color,
            originalIndex: sortedSectors.findIndex(s => s.Sector === sector.Sector) // Keep track of original index
        }));
    }, [sectors, highlightedSector]);

    const pieChartData = useMemo(() => {
        if (!Array.isArray(sectors) || sectors.length === 0) {
            return [{ id: 'No Data', value: 1, color: isDark ? 'rgba(50, 50, 50, 0.5)' : 'rgba(200, 200, 200, 0.5)' }];
        }
        return sectors.map((sector, index) => ({
            id: sector.Sector || 'Unknown',
            value: sector.SectorMarketCap || 0,
            color: highlightedSector === index ? sector.highlightColor : sector.color,
        }));
    }, [sectors, highlightedSector, isDark]);

    const loaderChartData = useMemo(() => [
        { id: 'Loading...', value: 1, color: isDark ? 'rgba(50, 50, 50, 0.5)' : 'rgba(200, 200, 200, 0.5)' },
        { id: 'Loading...', value: 1, color: isDark ? 'rgba(60, 60, 60, 0.5)' : 'rgba(180, 180, 180, 0.5)' },
        { id: 'Loading...', value: 1, color: isDark ? 'rgba(70, 70, 70, 0.5)' : 'rgba(160, 160, 160, 0.5)' },
    ], [isDark]);

    const chartTheme = useMemo(() => ({
        textColor: isDark ? '#e5e5e5' : '#3d3a3aff',
        fontSize: 12,
        labels: {
            text: {
                fill: isDark ? '#ffffff' : '#3638ceff',
            },
        },
        tooltip: {
            container: {
                background: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(190, 50, 50, 0.9)',
                color: isDark ? '#ffffff' : '#2c41b9ff',
                fontSize: 12,
            },
        },
        legends: {
            text: {
                fill: isDark ? '#ffffff' : '#494bdbff',
                fontSize: 13,
            },
        },
        axis: {
            ticks: {
                text: {
                    fill: isDark ? '#e5e5e5' : '#1973c7ff',
                },
            },
            legend: {
                text: {
                    fill: isDark ? '#e5e5e5' : '#3165a1ff',
                },
            },
        },
        grid: {
            line: {
                stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
        },
    }), [isDark]);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'bar' ? 'pie' : 'bar');
    };

    // Fixed click handler for bar chart
    const handleBarClick = (datum) => {
        if (!loading && sectors.length > 0 && datum && datum.indexValue) {
            const sectorName = datum.indexValue;
            const clickedSectorIndex = sectors.findIndex(s => s.Sector === sectorName);

            if (clickedSectorIndex >= 0) {
                setSelectedSector(sectors[clickedSectorIndex]);
                setHighlightedSector(clickedSectorIndex);

                // Add visual feedback
                const clickedElement = document.querySelector(`[data-id="${sectorName}"]`);
                if (clickedElement) {
                    clickedElement.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        clickedElement.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        }
    };

    // Fixed click handler for pie chart
    const handlePieClick = (datum) => {
        if (!loading && sectors.length > 0 && datum) {
            const sectorName = datum.id;
            const clickedSectorIndex = sectors.findIndex(s => s.Sector === sectorName);

            if (clickedSectorIndex >= 0) {
                setSelectedSector(sectors[clickedSectorIndex]);
                setHighlightedSector(clickedSectorIndex);
            }
        }
    };

    const CustomTooltip = ({ datum, isPie = true }) => {
        if (!datum) return null;

        let id, value;

        if (isPie) {
            id = datum.id;
            value = datum.value;
        } else {
            id = datum.indexValue || datum.id;
            value = datum.value;
        }

        const percentage = totalMarketCap > 0 ? ((value / totalMarketCap) * 100).toFixed(1) : 0;

        return (
            <div
                style={{
                    background: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    color: isDark ? '#ffffff' : '#000000',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
            >
                <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    {id}
                </strong>
                <div style={{ fontSize: '12px' }}>
                    {formatNumber(value)} ({percentage}%)
                </div>
                <div style={{ fontSize: '10px', color: isDark ? '#cccccc' : '#666666', marginTop: '2px' }}>
                    Click to select
                </div>
            </div>
        );
    };

    const CustomArcLinkLabel = ({ x, y, dx, dy, rotation, label, textAnchor, textColor, linkColor }) => {
        const lines = label.includes('&') ? label.split(' & ') : [label];
        return (
            <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
                <line
                    x1={0}
                    x2={dx}
                    y1={0}
                    y2={dy}
                    stroke={linkColor}
                    strokeWidth={1}
                    fill="none"
                />
                <text
                    dy=".35em"
                    dx={textAnchor === 'end' ? -8 : 8}
                    textAnchor={textAnchor}
                    style={{ fill: textColor, fontSize: 12 }}
                >
                    {lines.map((line, i) => (
                        <tspan key={i} x={0} dy={i > 0 ? '1.2em' : 0}>
                            {line}
                        </tspan>
                    ))}
                </text>
            </g>
        );
    };

    return (
        <div className="relative px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 flex items-center justify-center dark:via-gray-800 dark:to-gray-900  ">
            <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 z-10">
                {/* Left Section: Title and Selected Sector Card */}
                <div className="w-full lg:w-1/2 text-gray-800 dark:text-gray-100 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-center lg:justify-start text-slate-700 dark:text-indigo-300 text-sm sm:text-base font-medium">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Sector Analytics Platform</span>
                        </div>
                        <h1 className="mt-2 sm:mt-4 text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-center lg:text-left">
                            Capital Market{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300">
                                Data Analytics
                            </span>
                            <span className="z-10 align-right inline-block -rotate-6 bg-white text-sky-600 dark:bg-slate-800 font-semibold text-xs sm:text-sm px-2 py-1 rounded-md border border-sky-300 dark:border-sky-600 shadow-sm">
                                BETA
                            </span>
                        </h1>

                        <p className="mt-2 sm:mt-5 text-base sm:text-l text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 text-center lg:text-left min-h-[80px] sm:min-h-[100px]">
                            <Typewriter
                                words={[
                                    'Warren Buffett - "Best Chance to deploy capital are when things are down"',
                                    'Vijay Kedia  - "Only two people can BUY at BOTTOM and SELL at TOP one is GOD and other is a LIAR."',
                                    'Ray Dalio - "If you are not aggressive you will not make money; if you are not defensive you will not keep money."',
                                    'Rakesh Jhunjhunwala - "Trading is for creating capital and investment is for growth of capital."',
                                    'Ray Dalio - " There are two main drivers of asset class returns - inflation and growth."',
                                ]}
                                loop={0}
                                cursor
                                cursorStyle="|"
                                typeSpeed={60}
                                deleteSpeed={30}
                                delaySpeed={1500}
                            />
                        </p>

                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                            <button
                                onClick={toggleSortOrder}
                                disabled={loading}
                                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-600 text-white rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-700"
                                aria-label={`Sort by Market Cap: ${sortOrder === 'desc' ? 'High to Low' : 'Low to High'}`}
                            >
                                {sortOrder === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                                Sort: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                            </button>

                            <button
                                onClick={toggleViewMode}
                                disabled={loading}
                                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700"
                                aria-label={`Switch to ${viewMode === 'bar' ? 'Pie' : 'Bar'} Chart view`}
                            >
                                {viewMode === 'bar' ? <BarChart2 size={16} /> : <PieChart size={16} />}
                                Switch to {viewMode === 'bar' ? 'Pie Chart' : 'Bar Chart'}
                            </button>
                        </div>
                    </motion.div>
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                className="sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-sm sm:max-w-md mx-auto p-3 sm:p-5"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="animate-pulse flex flex-col items-center space-y-3 sm:space-y-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                    <div className="w-3/4 h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="w-1/2 h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-lg flex flex-col space-y-1">
                                                <div className="w-1/2 h-2 sm:h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                <div className="w-3/4 h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : !selectedSector || sectors.length === 0 ? (
                            <motion.div
                                key="no-data"
                                className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-sm sm:max-w-md mx-auto p-4  sm:p-5 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
                                    No sector data available
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-3 px-4 sm:px-5 py-2 sm:py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm sm:text-base transition-colors duration-200"
                                >
                                    Retry
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="data"
                                className="mt-3 sm:mt-8 bg-gradient-to-br from-slate-400 via-blue-50/30 to-slate-100 dark:from-gray-800 dark:via-slate-800/60 rounded-lg dark:to-gray-900 flex flex-col gap-5 w-full max-w-sm sm:max-w-md mx-auto shadow-xl lg:mx-0 relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* View More Button - Top Right Corner */}
                                <motion.div
                                    className=" border border-gray-100 dark:border-gray-200 overflow-hidden w-full p-4 sm:p-5 relative"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                >


                                    {/* Card Content */}
                                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5 mt-6 sm:mt-8">
                                        <motion.div
                                            className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center shadow-md"
                                            style={{
                                                backgroundColor: selectedSector.highlightColor || selectedSector.color || '#3b82f6',
                                                color: 'white',
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                                        >
                                            {sectorIcons[selectedSector.Sector] ? (
                                                React.createElement(sectorIcons[selectedSector.Sector], {
                                                    className: 'w-5 sm:w-6 h-5 sm:h-6',
                                                    strokeWidth: 1.5,
                                                })
                                            ) : (
                                                <PieChart className="w-5 sm:w-6 h-5 sm:h-6" strokeWidth={1.5} />
                                            )}
                                        </motion.div>

                                        <div >
                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                {selectedSector.Sector}
                                            </h3>
                                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                                {selectedSector.description || 'Sector performance overview'}
                                            </p>
                                        </div>
                                        {/* ✅ View More Button — Top Right */}
                                        <div className="absolute top-4 right-4">
                                            <motion.button
                                                onClick={() => {
                                                    const element = document.getElementById('sector-details');
                                                    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }}
                                                className="group flex items-center gap-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200"
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <span className="relative">
                                                    View More
                                                    <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                                </span>
                                                <motion.div
                                                    initial={{ x: 0 }}
                                                    whileHover={{ x: 4 }}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                >
                                                    <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-blue-400 ml-1" />
                                                </motion.div>
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Stat Grid (same as before) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-300 dark:bg-gray-800 p-2 rounded-xl sm:gap-3 mb-2 sm:mb-2">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-600">
                                            <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
                                                <PieChart className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
                                                Market Cap
                                            </div>
                                            <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                                                {formatNumber(selectedSector.SectorMarketCap)}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-green-100 dark:border-gray-600">
                                            <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
                                                <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
                                                TTM Revenue (%Chng)
                                            </div>
                                            <p
                                                className={`text-base sm:text-lg font-medium ${selectedSector.SectorCAGR_1Y_MCap >= 0
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                                    }`}
                                            >
                                                {selectedSector.SectorCAGR_1Y_MCap
                                                    ? `${formatDecimal(selectedSector.SectorCAGR_1Y_MCap * 100)}%`
                                                    : 'N/A'}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-purple-100 dark:border-gray-600 sm:col-span-2">
                                            <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
                                                <BarChart2 className="w-4 sm:w-5 h-4 sm:h-5 opacity-70" />
                                                PE Ratio
                                            </div>
                                            <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                                                {formatDecimal(selectedSector.SectorPE_Mode || 'N/A')}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Section: Chart */}
                <div className="w-full lg:w-1/2 mt-6 sm:mt-8 lg:mt-0 relative">
                    {error ? (
                        <div className="text-center px-4 py-3 sm:py-4 text-gray-500 dark:bg-gray-800 dark:text-gray-300 text-sm sm:text-base">
                            Could not load sector visualization: {error}
                        </div>
                    ) : (

                        <div
                            className="
                        w-full relative
                        h-[45vh] sm:h-[50vh] md:h-[55vh]
                        max-h-[500px] min-h-[600px]
                    "
                        >
                            {viewMode === "bar" ? (
                                <ResponsiveBar
                                    data={loading ? loaderChartData : barChartData}
                                    keys={["value"]}
                                    indexBy="id"
                                    layout="horizontal"
                                    margin={{ top: 50, right: 90, bottom: 80, left: 120 }}
                                    padding={0.4}
                                    valueScale={{ type: "linear", min: 0, nice: true }}
                                    indexScale={{ type: "band", round: true, padding: 0.2 }}
                                    colors={({ data }) => data.color || "#cccccc"}
                                    borderWidth={2}
                                    borderRadius={4}
                                    enableGridX={true}
                                    enableGridY={false}
                                    gridXValues={5}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        format: (v) => formatNumber(v),
                                        tickSize: 6,
                                        tickPadding: 10,
                                        tickRotation: -45,
                                        legend: "Market Cap",
                                        legendPosition: "middle",
                                        legendOffset: 50,
                                        tickTextColor: isDark ? "#e0e0e0" : "#333333",
                                        legendTextColor: isDark ? "#e0e0e0" : "#333333",
                                    }}
                                    axisLeft={{
                                        tickSize: 6,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        legend: "Sectors",
                                        legendPosition: "middle",
                                        legendOffset: -70,
                                        tickTextColor: isDark ? "#e0e0e0" : "#333333",
                                        legendTextColor: isDark ? "#e0e0e0" : "#333333",
                                    }}
                                    labelSkipWidth={15}
                                    labelSkipHeight={15}
                                    labelTextColor={{
                                        from: "color",
                                        modifiers: [["darker", 2.5]],
                                    }}
                                    label={(d) => formatNumber(d.value)}
                                    enableLabel={true}
                                    animate={true}
                                    motionStiffness={90}
                                    motionDamping={15}
                                    theme={chartTheme}
                                    tooltip={({ indexValue, value }) => (
                                        <CustomTooltip datum={{ indexValue, value }} isPie={false} />
                                    )}
                                    onClick={handleBarClick}
                                    isInteractive={true}
                                />
                            ) : (
                                <ResponsivePie
                                    data={loading ? loaderChartData : pieChartData}
                                    key={isDark ? "dark" : "light"}
                                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                    innerRadius={0.5}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    colors={{ datum: "data.color" }}
                                    borderWidth={1}
                                    enableArcLinkLabels={true}
                                    arcLinkLabelsSkipAngle={12}
                                    arcLinkLabelsTextColor={isDark ? "#ffffff" : "#686565ff"}
                                    arcLinkLabelsThickness={2}
                                    arcLinkLabelsDiagonalLength={16}
                                    arcLinkLabelsStraightLength={24}
                                    arcLinkLabelsColor={{ from: "color" }}
                                    arcLinkLabelsComponent={CustomArcLinkLabel}
                                    enableArcLabels={false}
                                    animate={true}
                                    motionStiffness={90}
                                    motionDamping={15}
                                    tooltip={({ datum }) => (
                                        <CustomTooltip datum={datum} isPie={true} />
                                    )}
                                    theme={chartTheme}
                                    onClick={handlePieClick}
                                    isInteractive={true}
                                />
                            )}
                        </div>

                    )}
                    <div className="text-center mt-2 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        <p className="text-sky-600 dark:text-sky-300 font-medium">
                            Showing top 10 sectors by Market Cap ({sortOrder === 'desc' ? 'highest to lowest' : 'lowest to highest'})
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Total Market Cap: {formatNumber(totalMarketCap)}
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketCapBanner;






