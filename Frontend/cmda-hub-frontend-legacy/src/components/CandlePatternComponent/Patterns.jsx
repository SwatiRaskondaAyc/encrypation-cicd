// import { useState, useMemo, useEffect } from 'react';
// import { TrendingUp, Filter, X, ChevronDown, Search, TrendingUp as UpIcon, TrendingDown as DownIcon, Minus, BarChart3, Zap, Target, Calendar } from 'lucide-react';
// import PatternGrid from './PatternGrid';
// import ResearchChart from './ResearchChart';
// import { PatternRegistry } from './data/patternRegistry';
// import Navbar from '../Navbar';
// import { useNavigate } from 'react-router-dom';

// function Patterns() {
//   const [activeView, setActiveView] = useState('category');
//   const [selectedPatterns, setSelectedPatterns] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [detectedPatterns, setDetectedPatterns] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [showResearchPanel, setShowResearchPanel] = useState(false);
//   const [researchData, setResearchData] = useState({});
//   const [missingCount, setMissingCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Filter states
//   const [sectorFilter, setSectorFilter] = useState([]);
//   const [industryFilter, setIndustryFilter] = useState([]);
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [volumeRange, setVolumeRange] = useState({ min: '', max: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [expandedSectors, setExpandedSectors] = useState({});
//   const navigate = useNavigate();

//   // const API_BASE_URL = 'http://localhost:9000';
  // const API_BASE_URL = 'https://cmdahub.com';
  // const API_KEY = 'answer-ur-curosity-2-3-5-7-11-13';

//   const extractScore = (desc) => {
//     if (!desc) return 0.0;
//     const match = desc.match(/(?:confidence|score)[:\s]*([0-9]*\.?[0-9]+)/i) ||
//                   desc.match(/([0-9]*\.?[0-9]+)\s*\/\s*10/) ||
//                   desc.match(/final score[:\s]*([0-9]*\.?[0-9]+)/i);
//     if (match) {
//       const score = parseFloat(match[1]);
//       return score > 1 ? score / 10 : score;
//     }
//     return 0.0;
//   };

//   const fetchPriceDataBatch = async (fincodes) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/price-action/batch`, {
//         method: 'POST',
//         headers: {
//           'x-api-key': API_KEY,
//           // 'Origin': 'http://localhost:5173',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           fincodes: fincodes
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch price data for batch: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching batch price data:', error);
//       return null;
//     }
//   };

//   const handleScanMarket = async (patterns, days) => {
//     if (patterns.length === 0) return;

//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/patterns/scan`, {
//         method: 'POST',
//         headers: {
//           'x-api-key': API_KEY,
//           // 'Origin': 'http://localhost:5173',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           pattern_ids: patterns,
//           lookUp_days: days
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }

//       const apiData = await response.json();
      
//       // Process the API response
//       const rows = [];
//       let skipped = 0;

//       if (!apiData.data) {
//         throw new Error('Invalid API response format: missing data field');
//       }

//       const responseData = apiData.data;
//       const patternCount = responseData.Pattern_ID?.length || 0;

//       console.log('API Response received:', apiData);
//       console.log(`Processing ${patternCount} patterns`);

//       // Extract unique fincodes for batch request
//       const uniqueFincodes = [...new Set(responseData.FINCODE.slice(0, patternCount))];
//       console.log('Unique fincodes for batch request:', uniqueFincodes);

//       // Fetch price data for all fincodes in batch
//       const batchPriceData = await fetchPriceDataBatch(uniqueFincodes);
//       console.log('Batch price data response:', batchPriceData);

//       // Process each pattern in the response arrays
//       for (let i = 0; i < patternCount; i++) {
//         const patternId = responseData.Pattern_ID[i];
//         const patternName = responseData.Pattern_Name[i];
//         const fincode = responseData.FINCODE[i];
//         const symbol = responseData.Symbol[i];
//         const date = responseData.Created_On[i] || responseData.startDate[i] || '—';
//         const description = responseData.final_interpretation[i] || '';
//         const industry = responseData.Industry[i] || '—';
//         const sector = responseData.Sector[i] || '—';
//         const closePrice = responseData.ClosePrice[i];
//         const volume = responseData.Volume_PerTrade[i];
//         const structureScore = responseData.structure_score[i];
//         const trendScore = responseData.trend_score[i];
//         const volumeScore = responseData.volume_score[i];
//         const volatilityScore = responseData.volatility_score[i];
//         const finalConfidence = responseData.final_confidence[i];
        
//         // Use final_confidence as the main score, fallback to extracted score
//         const score = finalConfidence !== undefined ? finalConfidence : extractScore(description);
        
//         // Get pattern direction from PatternRegistry
//         const patternMeta = PatternRegistry.getPattern(patternId);
//         const direction = patternMeta?.bias || 'neutral';
        
//         // Get price data from batch response
//         let priceData = null;
//         if (batchPriceData && batchPriceData.data) {
//           priceData = batchPriceData.data[fincode] || batchPriceData.data[String(fincode)];
//         }

//         if (!priceData) {
//           console.warn(`No price data found for fincode: ${fincode}`);
//           skipped++;
//           continue;
//         }

//         rows.push({
//           pid: patternId,
//           fincode,
//           symbol,
//           date: typeof date === 'string' ? date.split('T')[0] : '—',
//           score,
//           description,
//           industry,
//           sector,
//           direction,
//           closePrice,
//           volume,
//           structureScore,
//           trendScore,
//           volumeScore,
//           volatilityScore,
//           finalConfidence,
//           hasPriceData: true,
//           priceData
//         });
//       }

//       if (rows.length === 0) {
//         alert('No matching patterns found with price data.');
//         return;
//       }

//       setDetectedPatterns(rows);
//       setShowTable(true);
//       setSelectedRows([]);
//       setShowResearchPanel(false);
//       setMissingCount(skipped);

//       // Reset filters when new data loads
//       setSectorFilter([]);
//       setIndustryFilter([]);
//       setPriceRange({ min: '', max: '' });
//       setVolumeRange({ min: '', max: '' });
//       setSearchTerm('');
//       setExpandedSectors({});

//       setTimeout(() => {
//         document.getElementById('results-table')?.scrollIntoView({ behavior: 'smooth' });
//       }, 100);

//     } catch (err) {
//       setError(`Failed to scan market: ${err.message}`);
//       console.error('API Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewChart = () => {
//     if (selectedRows.length === 0) return alert('Select at least one row');

//     const researchCharts = [];
    
//     selectedRows.forEach(i => {
//       const row = filteredPatterns[i];
//       if (!row.hasPriceData || !row.priceData) return;

//       researchCharts.push({
//         fincode: row.fincode,
//         priceData: row.priceData,
//         patterns: [{
//           date: row.date,
//           patternId: row.pid,
//           score: row.score
//         }],
//         symbol: row.symbol,
//         companyName: row.symbol
//       });
//     });

//     if (researchCharts.length === 0) return alert('No price data for selected symbols');

//     // Store research data for dashboard
//     const researchDataForDashboard = {
//       researchCharts: researchCharts,
//       timestamp: Date.now()
//     };

//     localStorage.setItem('researchChartData', JSON.stringify(researchDataForDashboard));
    
//     navigate('/researchpanel', { 
//       state: { 
//         fromPatternScanner: true,
//         researchData: researchDataForDashboard
//       } 
//     });
//   };

//   const handleSelectAllRows = (e) => {
//     if (e.target.checked) {
//       setSelectedRows(filteredPatterns.map((_, index) => index));
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   const handleSelectRow = (index) => {
//     setSelectedRows(prev => 
//       prev.includes(index) 
//         ? prev.filter(x => x !== index) 
//         : [...prev, index]
//     );
//   };

//   // Calculate min and max values for sliders
//   const minMaxPrices = useMemo(() => {
//     if (detectedPatterns.length === 0) return { min: 0, max: 1000 };
    
//     const prices = detectedPatterns
//       .map(row => row.closePrice)
//       .filter(price => price != null && !isNaN(price));
    
//     if (prices.length === 0) return { min: 0, max: 1000 };
    
//     return {
//       min: Math.floor(Math.min(...prices)),
//       max: Math.ceil(Math.max(...prices))
//     };
//   }, [detectedPatterns]);

//   const minMaxVolumes = useMemo(() => {
//     if (detectedPatterns.length === 0) return { min: 0, max: 1000000 };
    
//     const volumes = detectedPatterns
//       .map(row => row.volume)
//       .filter(volume => volume != null && !isNaN(volume));
    
//     if (volumes.length === 0) return { min: 0, max: 1000000 };
    
//     return {
//       min: Math.floor(Math.min(...volumes)),
//       max: Math.ceil(Math.max(...volumes))
//     };
//   }, [detectedPatterns]);

//   // Initialize ranges when data loads
//   useEffect(() => {
//     if (detectedPatterns.length > 0) {
//       setPriceRange({
//         min: minMaxPrices.min,
//         max: minMaxPrices.max
//       });
//       setVolumeRange({
//         min: minMaxVolumes.min,
//         max: minMaxVolumes.max
//       });
//     }
//   }, [detectedPatterns.length, minMaxPrices, minMaxVolumes]);

//   // Filter logic
//   const filteredPatterns = useMemo(() => {
//     return detectedPatterns.filter(row => {
//       // Search filter
//       if (searchTerm && !row.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !row.pid.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }

//       // Sector filter (multi-select)
//       if (sectorFilter.length > 0 && !sectorFilter.includes(row.sector)) {
//         return false;
//       }

//       // Industry filter (multi-select)
//       if (industryFilter.length > 0 && !industryFilter.includes(row.industry)) {
//         return false;
//       }

//       // Price range filter
//       if (priceRange.min !== '' && row.closePrice < parseFloat(priceRange.min)) {
//         return false;
//       }
//       if (priceRange.max !== '' && row.closePrice > parseFloat(priceRange.max)) {
//         return false;
//       }

//       // Volume range filter
//       if (volumeRange.min !== '' && row.volume < parseFloat(volumeRange.min)) {
//         return false;
//       }
//       if (volumeRange.max !== '' && row.volume > parseFloat(volumeRange.max)) {
//         return false;
//       }

//       return true;
//     });
//   }, [detectedPatterns, searchTerm, sectorFilter, industryFilter, priceRange, volumeRange]);

//   // Get grouped sector and industry data for filters
//   const sectorIndustryData = useMemo(() => {
//     const grouped = {};
    
//     detectedPatterns.forEach(row => {
//       if (!row.sector || !row.industry) return;
      
//       if (!grouped[row.sector]) {
//         grouped[row.sector] = {
//           industries: new Set(),
//           count: 0
//         };
//       }
      
//       grouped[row.sector].industries.add(row.industry);
//       grouped[row.sector].count++;
//     });

//     // Convert Sets to Arrays and sort
//     Object.keys(grouped).forEach(sector => {
//       grouped[sector].industries = [...grouped[sector].industries].filter(Boolean).sort();
//     });

//     return grouped;
//   }, [detectedPatterns]);

//   const sectors = Object.keys(sectorIndustryData).sort();

//   const isAllSelected = filteredPatterns.length > 0 && selectedRows.length === filteredPatterns.length;

//   const clearFilters = () => {
//     setSectorFilter([]);
//     setIndustryFilter([]);
//     setPriceRange({ 
//       min: minMaxPrices.min, 
//       max: minMaxPrices.max 
//     });
//     setVolumeRange({ 
//       min: minMaxVolumes.min, 
//       max: minMaxVolumes.max 
//     });
//     setSearchTerm('');
//     setExpandedSectors({});
//   };

//   const hasActiveFilters = sectorFilter.length > 0 || 
//     industryFilter.length > 0 || 
//     priceRange.min !== minMaxPrices.min || 
//     priceRange.max !== minMaxPrices.max || 
//     volumeRange.min !== minMaxVolumes.min || 
//     volumeRange.max !== minMaxVolumes.max || 
//     searchTerm;

//   // Handle sector checkbox change
//   const handleSectorChange = (sector) => {
//     setSectorFilter(prev => 
//       prev.includes(sector) 
//         ? prev.filter(s => s !== sector)
//         : [...prev, sector]
//     );
//   };

//   // Handle industry checkbox change
//   const handleIndustryChange = (industry) => {
//     setIndustryFilter(prev => 
//       prev.includes(industry) 
//         ? prev.filter(i => i !== industry)
//         : [...prev, industry]
//     );
//   };

//   // Toggle sector expansion
//   const toggleSectorExpansion = (sector) => {
//     setExpandedSectors(prev => ({
//       ...prev,
//       [sector]: !prev[sector]
//     }));
//   };

//   // Select all industries in a sector
//   const selectAllIndustriesInSector = (sector) => {
//     const industries = sectorIndustryData[sector]?.industries || [];
//     setIndustryFilter(prev => {
//       const newIndustries = [...prev];
//       industries.forEach(industry => {
//         if (!newIndustries.includes(industry)) {
//           newIndustries.push(industry);
//         }
//       });
//       return newIndustries;
//     });
//   };

//   // Clear all industries in a sector
//   const clearAllIndustriesInSector = (sector) => {
//     const industries = sectorIndustryData[sector]?.industries || [];
//     setIndustryFilter(prev => prev.filter(industry => !industries.includes(industry)));
//   };

//   // Handle price range changes
//   const handlePriceRangeChange = (type, value) => {
//     setPriceRange(prev => ({
//       ...prev,
//       [type]: value === '' ? '' : parseFloat(value)
//     }));
//   };

//   // Handle volume range changes
//   const handleVolumeRangeChange = (type, value) => {
//     setVolumeRange(prev => ({
//       ...prev,
//       [type]: value === '' ? '' : parseFloat(value)
//     }));
//   };

//   // Direction display component
//   const DirectionBadge = ({ direction }) => {
//     const getDirectionConfig = (dir) => {
//       switch (dir) {
//         case 'bullish':
//           return {
//             icon: <UpIcon className="w-3 h-3" />,
//             bgColor: 'bg-emerald-50',
//             textColor: 'text-emerald-700',
//             borderColor: 'border-emerald-200',
//             dotColor: 'bg-emerald-500'
//           };
//         case 'bearish':
//           return {
//             icon: <DownIcon className="w-3 h-3" />,
//             bgColor: 'bg-rose-50',
//             textColor: 'text-rose-700',
//             borderColor: 'border-rose-200',
//             dotColor: 'bg-rose-500'
//           };
//         default:
//           return {
//             icon: <Minus className="w-3 h-3" />,
//             bgColor: 'bg-slate-50',
//             textColor: 'text-slate-700',
//             borderColor: 'border-slate-200',
//             dotColor: 'bg-slate-500'
//           };
//       }
//     };

//     const config = getDirectionConfig(direction);

//     return (
//       <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
//         <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
//         <span className="text-sm font-medium capitalize">{direction}</span>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
        
//         {/* Header */}
//         <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 dark:bg-gray-800/80 dark:border-gray-700">
//           <div className="max-w-9xl mx-auto px-8 py-8">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-6">
//                 <div className="p-3 bg-gradient-to-br from-sky-600 via-cyan-600 to-sky-700 rounded-2xl shadow-lg">
//                   <TrendingUp className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
//                     Candle Pattern Scanner 
//                   </h1>
//                   <p className="text-slate-600 mt-1 font-medium dark:text-slate-400">Advanced candlestick pattern detection</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//                   <Zap className="w-5 h-5 text-amber-500" />
//                   <span className="font-medium">Real-time Analysis</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Error Display */}
//         {error && (
//           <div className="max-w-9xl mx-auto px-8 pt-6">
//             <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm dark:bg-red-900/20 dark:border-red-800">
//               <div className="flex items-center gap-3">
//                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                 <div>
//                   <p className="text-red-800 font-medium dark:text-red-300">{error}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation */}
//         <nav className="top-20 z-40 bg-white/60 backdrop-blur-md border-b border-slate-200/60 dark:bg-gray-800/60 dark:border-gray-700">
//           <div className="max-w-2xl mx-auto px-8 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 dark:bg-gray-700">
//                 {[{ id: 'category', label: 'By Category', icon: Filter }, { id: 'bias', label: 'By Market Bias', icon: Target }].map(v => (
//                   <button 
//                     key={v.id} 
//                     onClick={() => setActiveView(v.id)}
//                     className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
//                       activeView === v.id 
//                         ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm dark:bg-gray-600 dark:text-white' 
//                         : 'text-slate-600 hover:text-slate-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600/50'
//                     }`}
//                   >
//                     <v.icon className="w-4 h-4" />
//                     {v.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Main Content */}
//         <main className="max-w-9xl mx-auto px-8 py-8">
//           {/* Pattern Grid Section */}
//           <section className="mb-12">
//             <PatternGrid
//               viewType={activeView}
//               selectedPatterns={selectedPatterns}
//               onPatternSelect={setSelectedPatterns}
//               onScanMarket={handleScanMarket}
//               loading={loading}
//             />
//           </section>

//           {/* Loading State */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center py-16">
//               <div className="relative">
//                 <div className="w-16 h-16 border-4 border-sky-200 rounded-full animate-spin dark:border-blue-800"></div>
//                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                   <div className="w-8 h-8 border-4 border-sky-600 rounded-full animate-ping dark:border-blue-400"></div>
//                 </div>
//               </div>
//               <p className="mt-6 text-slate-600 font-medium dark:text-gray-300">Scanning market for patterns...</p>
//               <p className="text-slate-500 text-sm mt-2 dark:text-gray-400">Analyzing real-time data across multiple timeframes</p>
//             </div>
//           )}

//           {/* Results Table */}
//           {showTable && (
//             <section id="results-table" className="mb-16">
//               <div className="flex gap-6">
//                 {/* Enhanced Filters Sidebar */}
//                 {showFilters && (
//                   <div className="w-80 flex-shrink-0">
//                     <div className="bg-white rounded-xl border border-slate-200 dark:bg-gray-800 dark:border-gray-700 h-[calc(100vh-12rem)] sticky top-28 flex flex-col overflow-hidden">
//                       {/* Header */}
//                       <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
//                         <div className="flex items-center gap-2">
//                           <Filter className="w-4 h-4 text-slate-600 dark:text-gray-300" />
//                           <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
//                         </div>
//                         <button
//                           onClick={() => setShowFilters(false)}
//                           className="p-1 hover:bg-slate-200 dark:hover:bg-gray-600 rounded transition-colors"
//                         >
//                           <X className="w-4 h-4 text-slate-500 dark:text-gray-400" />
//                         </button>
//                       </div>

//                       {/* Scrollable Filter Content */}
//                       <div className="flex-1 overflow-y-auto p-4 space-y-6">
//                         {/* Search Filter */}
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-gray-300">
//                             Search Symbols & Patterns
//                           </label>
//                           <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
//                             <input
//                               type="text"
//                               value={searchTerm}
//                               onChange={(e) => setSearchTerm(e.target.value)}
//                               placeholder="Search symbol or pattern..."
//                               className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                             />
//                           </div>
//                         </div>

//                         {/* Sector & Industry Filter - Grouped */}
//                         <div>
//                           <div className="flex items-center justify-between mb-2">
//                             <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
//                               Sector & Industry
//                             </label>
//                             <div className="flex gap-1">
//                               <button
//                                 onClick={() => {
//                                   const allSectors = Object.keys(sectorIndustryData);
//                                   setSectorFilter(allSectors);
//                                   const allIndustries = allSectors.flatMap(sector => 
//                                     sectorIndustryData[sector]?.industries || []
//                                   );
//                                   setIndustryFilter(allIndustries);
//                                 }}
//                                 className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
//                               >
//                                 Select All
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSectorFilter([]);
//                                   setIndustryFilter([]);
//                                 }}
//                                 className="text-xs text-slate-600 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors dark:text-gray-400 dark:hover:bg-gray-600"
//                               >
//                                 Clear All
//                               </button>
//                             </div>
//                           </div>
                          
//                           <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 dark:bg-gray-700 dark:border-gray-600">
//                             {sectors.length === 0 ? (
//                               <div className="text-center py-4 text-sm text-slate-500 dark:text-gray-400">
//                                 No sectors available
//                               </div>
//                             ) : (
//                               sectors.map(sector => {
//                                 const sectorData = sectorIndustryData[sector];
//                                 const isExpanded = expandedSectors[sector];
//                                 const sectorIndustries = sectorData?.industries || [];
//                                 const isSectorSelected = sectorFilter.includes(sector);

//                                 return (
//                                   <div key={sector} className="border-b border-slate-200 last:border-b-0 dark:border-gray-600">
//                                     {/* Sector Header */}
//                                     <div className={`flex items-center justify-between p-3 ${
//                                       isSectorSelected 
//                                         ? 'bg-blue-50 dark:bg-blue-900/20' 
//                                         : 'hover:bg-slate-100 dark:hover:bg-gray-600'
//                                     }`}>
//                                       <div className="flex items-center gap-3 flex-1">
//                                         <input
//                                           type="checkbox"
//                                           checked={isSectorSelected}
//                                           onChange={() => handleSectorChange(sector)}
//                                           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-600"
//                                         />
//                                         <div className="flex-1">
//                                           <label 
//                                             className="text-sm font-medium text-slate-700 dark:text-gray-300 cursor-pointer"
//                                             onClick={() => handleSectorChange(sector)}
//                                           >
//                                             {sector}
//                                           </label>
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <span className="text-xs text-slate-500 dark:text-gray-400">
//                                               {sectorData.count} patterns
//                                             </span>
//                                             {sectorIndustries.length > 0 && (
//                                               <span className="text-xs text-slate-400 dark:text-gray-500">
//                                                 • {sectorIndustries.length} industries
//                                               </span>
//                                             )}
//                                           </div>
//                                         </div>
//                                       </div>
//                                       {sectorIndustries.length > 0 && (
//                                         <button
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             toggleSectorExpansion(sector);
//                                           }}
//                                           className="p-1 hover:bg-slate-200 rounded transition-colors dark:hover:bg-gray-500"
//                                         >
//                                           <ChevronDown 
//                                             className={`w-4 h-4 text-slate-500 transition-transform ${
//                                               isExpanded ? 'rotate-180' : ''
//                                             }`} 
//                                           />
//                                         </button>
//                                       )}
//                                     </div>

//                                     {/* Industries List with rounded borders */}
//                                     {isExpanded && sectorIndustries.length > 0 && (
//                                       <div className="bg-white border-t border-slate-200 dark:bg-gray-600 dark:border-gray-500">
//                                         <div className="pl-8 pr-3 py-2 space-y-1">
//                                           {sectorIndustries.map((industry, index) => (
//                                             <div 
//                                               key={industry} 
//                                               className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
//                                                 industryFilter.includes(industry) 
//                                                   ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700' 
//                                                   : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500'
//                                               } ${
//                                                 index === 0 ? 'rounded-t-lg' : ''
//                                               } ${
//                                                 index === sectorIndustries.length - 1 ? 'rounded-b-lg' : ''
//                                               }`}
//                                             >
//                                               <input
//                                                 type="checkbox"
//                                                 id={`industry-${sector}-${industry}`}
//                                                 checked={industryFilter.includes(industry)}
//                                                 onChange={() => handleIndustryChange(industry)}
//                                                 className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-500"
//                                               />
//                                               <label 
//                                                 htmlFor={`industry-${sector}-${industry}`}
//                                                 className="text-sm text-slate-700 dark:text-gray-300 cursor-pointer flex-1"
//                                               >
//                                                 {industry}
//                                               </label>
//                                             </div>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 );
//                               })
//                             )}
//                           </div>
//                         </div>

//                         {/* Price Range Filter with Slider */}
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-gray-300">
//                             Close Price Range
//                           </label>
//                           <div className="space-y-4">
//                             {/* Slider */}
//                             <div className="px-2">
//                               <input
//                                 type="range"
//                                 min={minMaxPrices.min}
//                                 max={minMaxPrices.max}
//                                 value={priceRange.max}
//                                 onChange={(e) => handlePriceRangeChange('max', e.target.value)}
//                                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb dark:bg-gray-600"
//                                 style={{
//                                   background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((priceRange.max - minMaxPrices.min) / (minMaxPrices.max - minMaxPrices.min)) * 100}%, #e2e8f0 ${((priceRange.max - minMaxPrices.min) / (minMaxPrices.max - minMaxPrices.min)) * 100}%, #e2e8f0 100%)`
//                                 }}
//                               />
//                               <div className="flex justify-between text-xs text-slate-500 mt-2 dark:text-gray-400">
//                                 <span>₹{minMaxPrices.min.toLocaleString()}</span>
//                                 <span>₹{minMaxPrices.max.toLocaleString()}</span>
//                               </div>
//                             </div>
                            
//                             {/* Input Fields */}
//                             <div className="grid grid-cols-2 gap-3">
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Min Price</label>
//                                 <input
//                                   type="number"
//                                   value={priceRange.min}
//                                   onChange={(e) => handlePriceRangeChange('min', e.target.value)}
//                                   placeholder="Min"
//                                   min={minMaxPrices.min}
//                                   max={priceRange.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Max Price</label>
//                                 <input
//                                   type="number"
//                                   value={priceRange.max}
//                                   onChange={(e) => handlePriceRangeChange('max', e.target.value)}
//                                   placeholder="Max"
//                                   min={priceRange.min}
//                                   max={minMaxPrices.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                             </div>
                            
//                             {/* Selected Range Display */}
//                             <div className="text-center">
//                               <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 px-3 py-1.5 rounded-full dark:bg-blue-900/20">
//                                 ₹{priceRange.min.toLocaleString()} - ₹{priceRange.max.toLocaleString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Volume Range Filter with Slider */}
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-gray-300">
//                             Volume Per Trade
//                           </label>
//                           <div className="space-y-4">
//                             {/* Slider */}
//                             <div className="px-2">
//                               <input
//                                 type="range"
//                                 min={minMaxVolumes.min}
//                                 max={minMaxVolumes.max}
//                                 value={volumeRange.max}
//                                 onChange={(e) => handleVolumeRangeChange('max', e.target.value)}
//                                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb dark:bg-gray-600"
//                                 style={{
//                                   background: `linear-gradient(to right, #10b981 0%, #10b981 ${((volumeRange.max - minMaxVolumes.min) / (minMaxVolumes.max - minMaxVolumes.min)) * 100}%, #e2e8f0 ${((volumeRange.max - minMaxVolumes.min) / (minMaxVolumes.max - minMaxVolumes.min)) * 100}%, #e2e8f0 100%)`
//                                 }}
//                               />
//                               <div className="flex justify-between text-xs text-slate-500 mt-2 dark:text-gray-400">
//                                 <span>{minMaxVolumes.min.toLocaleString()}</span>
//                                 <span>{minMaxVolumes.max.toLocaleString()}</span>
//                               </div>
//                             </div>
                            
//                             {/* Input Fields */}
//                             <div className="grid grid-cols-2 gap-3">
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Min Volume</label>
//                                 <input
//                                   type="number"
//                                   value={volumeRange.min}
//                                   onChange={(e) => handleVolumeRangeChange('min', e.target.value)}
//                                   placeholder="Min"
//                                   min={minMaxVolumes.min}
//                                   max={volumeRange.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Max Volume</label>
//                                 <input
//                                   type="number"
//                                   value={volumeRange.max}
//                                   onChange={(e) => handleVolumeRangeChange('max', e.target.value)}
//                                   placeholder="Max"
//                                   min={volumeRange.min}
//                                   max={minMaxVolumes.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                             </div>
                            
//                             {/* Selected Range Display */}
//                             <div className="text-center">
//                               <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 px-3 py-1.5 rounded-full dark:bg-green-900/20">
//                                 {volumeRange.min.toLocaleString()} - {volumeRange.max.toLocaleString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Footer Actions */}
//                       <div className="border-t border-slate-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
//                         <div className="flex flex-col gap-2">
//                           <button
//                             onClick={() => {/* Filters are applied automatically */}}
//                             className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//                           >
//                             Apply Filters
//                           </button>
//                           {hasActiveFilters && (
//                             <button
//                               onClick={clearFilters}
//                               className="flex items-center justify-center gap-1 w-full px-4 py-2 text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-700"
//                             >
//                               <X className="w-3 h-3" />
//                               Clear All Filters
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Table Content */}
//                 <div className={`${showFilters ? 'flex-1 min-w-0' : 'flex-1 max-w-7xl mx-auto'}`}>
//                   <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
               
//                     <div className="bg-slate-800 px-6 py-4 dark:bg-gray-900">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h2 className="text-lg font-bold text-white flex items-center gap-2">
//                             <BarChart3 className="w-5 h-5" />
//                             Scan Results
//                           </h2>
//                           <div className="flex items-center gap-3 mt-1 text-slate-300 text-sm">
//                             <span>{filteredPatterns.length} patterns detected</span>
//                             {missingCount > 0 && (
//                               <span>• {missingCount} without price data</span>
//                             )}
//                             {hasActiveFilters && (
//                               <span>• Filtered from {detectedPatterns.length} total</span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <button
//                             onClick={() => setShowFilters(!showFilters)}
//                             className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors text-sm"
//                           >
//                             <Filter className="w-4 h-4" />
//                             {showFilters ? 'Hide Filters' : 'Show Filters'}
//                             {hasActiveFilters && (
//                               <div className="w-1.5 h-1.5 bg-red-400 rounded-full ml-1"></div>
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Section */}
//                     {selectedRows.length > 0 && (
//                       <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 dark:bg-gray-700 dark:border-gray-600">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-semibold text-slate-800 dark:text-gray-300">
//                               {selectedRows.length} pattern{selectedRows.length !== 1 ? 's' : ''} selected
//                             </p>
//                           </div>
//                           <button 
//                             onClick={handleViewChart} 
//                             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"
//                           >
//                             <div className="flex items-center gap-2">
//                               <BarChart3 className="w-4 h-4" />
//                               View Analysis
//                             </div>
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     {/* Table */}
//                     <div className="overflow-x-auto">
//                       <table className="w-full min-w-[800px]">
//                         <thead className="bg-slate-50 border-b border-slate-200 dark:bg-gray-700 dark:border-gray-600">
//                           <tr>
//                             <th className="px-4 py-3 text-left">
//                               <input 
//                                 type="checkbox" 
//                                 checked={isAllSelected}
//                                 onChange={handleSelectAllRows}
//                                 className="w-4 h-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
//                               />
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300">Pattern</th>
//                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300">Symbol</th>
//                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300">Date</th>
//                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300">Direction</th>
//                             {!showFilters && (
//                               <>
//                                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300">Sector</th>
//                                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300">Industry</th>
//                               </>
//                             )}
//                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300">Price</th>
//                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300">Volume</th>
//                             <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300">Confidence</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-200 dark:divide-gray-600">
//                           {filteredPatterns.map((row, index) => (
//                             <tr 
//                               key={`${row.pid}-${row.fincode}-${index}`} 
//                               className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-600/50 ${
//                                 selectedRows.includes(index) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
//                               }`}
//                               onClick={() => handleSelectRow(index)}
//                             >
//                               <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
//                                 <input 
//                                   type="checkbox" 
//                                   checked={selectedRows.includes(index)} 
//                                   onChange={() => handleSelectRow(index)}
//                                   className="w-4 h-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
//                                 />
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="font-medium text-slate-800 dark:text-gray-100 text-sm">
//                                   {PatternRegistry.getPattern(row.pid)?.name || PatternRegistry.getPattern(row.pid)?.shortName || row.pid}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="font-bold text-blue-600 text-sm dark:text-blue-400">
//                                   {row.symbol}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-slate-700 font-medium dark:text-gray-300 text-sm">
//                                 {row.date}
//                               </td>
//                               <td className="px-4 py-3">
//                                 <DirectionBadge direction={row.direction} />
//                               </td>
//                               {!showFilters && (
//                                 <>
//                                   <td className="px-4 py-3">
//                                     <span className="text-xs text-slate-600 dark:text-gray-400">
//                                       {row.sector}
//                                     </span>
//                                   </td>
//                                   <td className="px-4 py-3">
//                                     <span className="text-xs text-slate-600 dark:text-gray-400 max-w-[120px] truncate block">
//                                       {row.industry}
//                                     </span>
//                                   </td>
//                                 </>
//                               )}
//                               <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-300 text-sm">
//                                 {row.closePrice ? `₹${row.closePrice.toFixed(2)}` : '—'}
//                               </td>
//                               <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-300 text-sm">
//                                 {row.volume ? row.volume.toLocaleString() : '—'}
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`inline-flex items-center justify-center px-2 py-1 rounded font-semibold text-xs ${
//                                   row.score >= 0.8 
//                                     ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
//                                     : row.score >= 0.6 
//                                     ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
//                                     : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
//                                 }`}>
//                                   {(row.score * 10).toFixed(1)}/10
//                                 </span>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>

//                       {/* Empty State */}
//                       {filteredPatterns.length === 0 && (
//                         <div className="text-center py-12">
//                           <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center dark:bg-gray-700">
//                             <BarChart3 className="w-6 h-6 text-slate-400 dark:text-gray-500" />
//                           </div>
//                           <p className="text-slate-600 font-medium dark:text-gray-400 text-sm">
//                             {hasActiveFilters ? 'No patterns match your filters' : 'No patterns detected'}
//                           </p>
//                           {hasActiveFilters && (
//                             <button
//                               onClick={clearFilters}
//                               className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm dark:text-blue-400"
//                             >
//                               Clear filters
//                             </button>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           )}

//           {/* Research Panel */}
//           {showResearchPanel && (
//             <section id="research-panel" className="mb-16">
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-slate-800 mb-2 dark:text-white">
//                   Advanced Research Panel
//                 </h2>
//                 <p className="text-slate-600 dark:text-gray-400">
//                   Comprehensive technical analysis with multi-timeframe pattern recognition
//                 </p>
//               </div>
//               {Object.entries(researchData).map(([fincode, { priceData, patterns }]) => (
//                 <div key={fincode} className="mb-8 last:mb-0">
//                   <ResearchChart fincode={fincode} priceData={priceData} patterns={patterns} />
//                 </div>
//               ))}
//             </section>
//           )}
//         </main>
//       </div>

//       {/* Add custom styles for range slider */}
//       <style jsx>{`
//         .slider-thumb::-webkit-slider-thumb {
//           appearance: none;
//           height: 18px;
//           width: 18px;
//           border-radius: 50%;
//           background: #3b82f6;
//           cursor: pointer;
//           border: 2px solid #ffffff;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//         }
        
//         .slider-thumb::-moz-range-thumb {
//           height: 18px;
//           width: 18px;
//           border-radius: 50%;
//           background: #3b82f6;
//           cursor: pointer;
//           border: 2px solid #ffffff;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//         }
        
//         .slider-thumb:focus::-webkit-slider-thumb {
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
//         }
//       `}</style>
//     </>
//   );
// }

// export default Patterns;




// import { useState, useMemo, useEffect } from 'react';
// import { TrendingUp, Filter, X, ChevronDown, Search, TrendingUp as UpIcon, TrendingDown as DownIcon, Minus, BarChart3, Zap, Target, Calendar } from 'lucide-react';
// import PatternGrid from './PatternGrid';
// import ResearchChart from './ResearchChart';
// import { PatternRegistry } from './data/patternRegistry';
// import Navbar from '../Navbar';
// import { useNavigate } from 'react-router-dom';

// function Patterns() {
//   const [activeView, setActiveView] = useState('category');
//   const [selectedPatterns, setSelectedPatterns] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [detectedPatterns, setDetectedPatterns] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [showResearchPanel, setShowResearchPanel] = useState(false);
//   const [researchData, setResearchData] = useState({});
//   const [missingCount, setMissingCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Filter states
//   const [sectorFilter, setSectorFilter] = useState([]);
//   const [industryFilter, setIndustryFilter] = useState([]);
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [volumeRange, setVolumeRange] = useState({ min: '', max: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [expandedSectors, setExpandedSectors] = useState({});
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const navigate = useNavigate();

//   // Constants
//    const API_BASE_URL = 'https://cmdahub.com';
//   const API_KEY = 'answer-ur-curosity-2-3-5-7-11-13';
//   const MAX_SELECTED_ROWS = 3; // Maximum 3 rows can be selected

//   // Compression utility functions
//   const compressData = (data) => {
//     try {
//       const jsonString = JSON.stringify(data);
//       return btoa(unescape(encodeURIComponent(jsonString)));
//     } catch (error) {
//       console.error('Compression error:', error);
//       return null;
//     }
//   };

//   const extractScore = (desc) => {
//     if (!desc) return 0.0;
//     const match = desc.match(/(?:confidence|score)[:\s]*([0-9]*\.?[0-9]+)/i) ||
//                   desc.match(/([0-9]*\.?[0-9]+)\s*\/\s*10/) ||
//                   desc.match(/final score[:\s]*([0-9]*\.?[0-9]+)/i);
//     if (match) {
//       const score = parseFloat(match[1]);
//       return score > 1 ? score / 10 : score;
//     }
//     return 0.0;
//   };

//   const fetchPriceDataBatch = async (fincodes) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/price-action/batch`, {
//         method: 'POST',
//         headers: {
//           'x-api-key': API_KEY,
//           'Origin': 'http://localhost:5173',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           fincodes: fincodes
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch price data for batch: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching batch price data:', error);
//       return null;
//     }
//   };

//   const handleScanMarket = async (patterns, days) => {
//     if (patterns.length === 0) return;

//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/patterns/scan`, {
//         method: 'POST',
//         headers: {
//           'x-api-key': API_KEY,
//           'Origin': 'http://localhost:5173',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           pattern_ids: patterns,
//           lookUp_days: days
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }

//       const apiData = await response.json();
      
//       // Process the API response
//       const rows = [];
//       let skipped = 0;

//       if (!apiData.data) {
//         throw new Error('Invalid API response format: missing data field');
//       }

//       const responseData = apiData.data;
//       const patternCount = responseData.Pattern_ID?.length || 0;

//       console.log('API Response received:', apiData);
//       console.log(`Processing ${patternCount} patterns`);

//       // Extract unique fincodes for batch request
//       const uniqueFincodes = [...new Set(responseData.FINCODE.slice(0, patternCount))];
//       console.log('Unique fincodes for batch request:', uniqueFincodes);

//       // Fetch price data for all fincodes in batch
//       const batchPriceData = await fetchPriceDataBatch(uniqueFincodes);
//       console.log('Batch price data response:', batchPriceData);

//       // Process each pattern in the response arrays
//       for (let i = 0; i < patternCount; i++) {
//         const patternId = responseData.Pattern_ID[i];
//         const patternName = responseData.Pattern_Name[i];
//         const fincode = responseData.FINCODE[i];
//         const symbol = responseData.Symbol[i];
//         const date = responseData.Created_On[i] || responseData.startDate[i] || '—';
//         const description = responseData.final_interpretation[i] || '';
//         const industry = responseData.Industry[i] || '—';
//         const sector = responseData.Sector[i] || '—';
//         const closePrice = responseData.ClosePrice[i];
//         const volume = responseData.Volume_PerTrade[i];
//         const structureScore = responseData.structure_score[i];
//         const trendScore = responseData.trend_score[i];
//         const volumeScore = responseData.volume_score[i];
//         const volatilityScore = responseData.volatility_score[i];
//         const finalConfidence = responseData.final_confidence[i];
        
//         // Use final_confidence as the main score, fallback to extracted score
//         const score = finalConfidence !== undefined ? finalConfidence : extractScore(description);
        
//         // Get pattern direction from PatternRegistry
//         const patternMeta = PatternRegistry.getPattern(patternId);
//         const direction = patternMeta?.bias || 'neutral';
        
//         // Get price data from batch response
//         let priceData = null;
//         if (batchPriceData && batchPriceData.data) {
//           priceData = batchPriceData.data[fincode] || batchPriceData.data[String(fincode)];
//         }

//         if (!priceData) {
//           console.warn(`No price data found for fincode: ${fincode}`);
//           skipped++;
//           continue;
//         }

//         rows.push({
//           pid: patternId,
//           fincode,
//           symbol,
//           date: typeof date === 'string' ? date.split('T')[0] : '—',
//           score,
//           description,
//           industry,
//           sector,
//           direction,
//           closePrice,
//           volume,
//           structureScore,
//           trendScore,
//           volumeScore,
//           volatilityScore,
//           finalConfidence,
//           hasPriceData: true,
//           priceData
//         });
//       }

//       if (rows.length === 0) {
//         alert('No matching patterns found with price data.');
//         return;
//       }

//       setDetectedPatterns(rows);
//       setShowTable(true);
//       setSelectedRows([]); // Reset selection when new data loads
//       setShowResearchPanel(false);
//       setMissingCount(skipped);

//       // Reset filters when new data loads
//       setSectorFilter([]);
//       setIndustryFilter([]);
//       setPriceRange({ min: '', max: '' });
//       setVolumeRange({ min: '', max: '' });
//       setSearchTerm('');
//       setExpandedSectors({});

//       setTimeout(() => {
//         document.getElementById('results-table')?.scrollIntoView({ behavior: 'smooth' });
//       }, 100);

//     } catch (err) {
//       setError(`Failed to scan market: ${err.message}`);
//       console.error('API Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewChart = () => {
//     if (selectedRows.length === 0) return alert('Select at least one row');

//     const researchCharts = [];
    
//     selectedRows.forEach(i => {
//       const row = filteredPatterns[i];
//       if (!row.hasPriceData || !row.priceData) return;

//       researchCharts.push({
//         fincode: row.fincode,
//         priceData: row.priceData,
//         patterns: [{
//           date: row.date,
//           patternId: row.pid,
//           score: row.score
//         }],
//         symbol: row.symbol,
//         companyName: row.symbol
//       });
//     });

//     if (researchCharts.length === 0) return alert('No price data for selected symbols');

//     // Store research data for dashboard with compression
//     const researchDataForDashboard = {
//       researchCharts: researchCharts,
//       timestamp: Date.now()
//     };

//     try {
//       const compressedData = compressData(researchDataForDashboard);
//       if (compressedData && compressedData.length < 5 * 1024 * 1024) { // 5MB limit
//         localStorage.setItem('researchChartData', compressedData);
//       } else {
//         throw new Error('Data too large after compression');
//       }
//     } catch (error) {
//       console.error('Storage error:', error);
//       // Store only essential data
//       const essentialData = {
//         symbols: researchCharts.map(chart => chart.symbol),
//         patternCount: researchCharts.length,
//         timestamp: Date.now()
//       };
//       localStorage.setItem('researchChartData', JSON.stringify(essentialData));
//     }
    
//     navigate('/researchpanel', { 
//       state: { 
//         fromPatternScanner: true,
//         researchData: researchDataForDashboard
//       } 
//     });
//   };

//   // Updated selection handlers with MAX_SELECTED_ROWS limit
//   const handleSelectAllRows = (e) => {
//     if (e.target.checked) {
//       // Only select first MAX_SELECTED_ROWS
//       const limitedSelection = filteredPatterns
//         .slice(0, MAX_SELECTED_ROWS)
//         .map((_, index) => index);
//       setSelectedRows(limitedSelection);
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   const handleSelectRow = (index) => {
//     setSelectedRows(prev => {
//       if (prev.includes(index)) {
//         return prev.filter(x => x !== index);
//       } else {
//         if (prev.length >= MAX_SELECTED_ROWS) {
//           alert(`Maximum ${MAX_SELECTED_ROWS} patterns can be selected for analysis`);
//           return prev;
//         }
//         return [...prev, index];
//       }
//     });
//   };

//   // Sort functionality
//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return <ChevronDown className="w-3 h-3 text-slate-400 opacity-50" />;
//     }
//     return sortConfig.direction === 'asc' 
//       ? <UpIcon className="w-3 h-3 text-blue-600" />
//       : <DownIcon className="w-3 h-3 text-blue-600" />;
//   };

//   // Calculate min and max values for sliders
//   const minMaxPrices = useMemo(() => {
//     if (detectedPatterns.length === 0) return { min: 0, max: 1000 };
    
//     const prices = detectedPatterns
//       .map(row => row.closePrice)
//       .filter(price => price != null && !isNaN(price));
    
//     if (prices.length === 0) return { min: 0, max: 1000 };
    
//     return {
//       min: Math.floor(Math.min(...prices)),
//       max: Math.ceil(Math.max(...prices))
//     };
//   }, [detectedPatterns]);

//   const minMaxVolumes = useMemo(() => {
//     if (detectedPatterns.length === 0) return { min: 0, max: 1000000 };
    
//     const volumes = detectedPatterns
//       .map(row => row.volume)
//       .filter(volume => volume != null && !isNaN(volume));
    
//     if (volumes.length === 0) return { min: 0, max: 1000000 };
    
//     return {
//       min: Math.floor(Math.min(...volumes)),
//       max: Math.ceil(Math.max(...volumes))
//     };
//   }, [detectedPatterns]);

//   // Initialize ranges when data loads
//   useEffect(() => {
//     if (detectedPatterns.length > 0) {
//       setPriceRange({
//         min: minMaxPrices.min,
//         max: minMaxPrices.max
//       });
//       setVolumeRange({
//         min: minMaxVolumes.min,
//         max: minMaxVolumes.max
//       });
//     }
//   }, [detectedPatterns.length, minMaxPrices, minMaxVolumes]);

//   // Filter and sort logic
//   const filteredPatterns = useMemo(() => {
//     let filtered = detectedPatterns.filter(row => {
//       // Search filter
//       if (searchTerm && !row.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !row.pid.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }

//       // Sector filter (multi-select)
//       if (sectorFilter.length > 0 && !sectorFilter.includes(row.sector)) {
//         return false;
//       }

//       // Industry filter (multi-select)
//       if (industryFilter.length > 0 && !industryFilter.includes(row.industry)) {
//         return false;
//       }

//       // Price range filter
//       if (priceRange.min !== '' && row.closePrice < parseFloat(priceRange.min)) {
//         return false;
//       }
//       if (priceRange.max !== '' && row.closePrice > parseFloat(priceRange.max)) {
//         return false;
//       }

//       // Volume range filter
//       if (volumeRange.min !== '' && row.volume < parseFloat(volumeRange.min)) {
//         return false;
//       }
//       if (volumeRange.max !== '' && row.volume > parseFloat(volumeRange.max)) {
//         return false;
//       }

//       return true;
//     });

//     // Apply sorting
//     if (sortConfig.key) {
//       filtered = [...filtered].sort((a, b) => {
//         let aValue = a[sortConfig.key];
//         let bValue = b[sortConfig.key];

//         // Handle string comparison
//         if (typeof aValue === 'string') {
//           aValue = aValue.toLowerCase();
//           bValue = bValue.toLowerCase();
//         }

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     return filtered;
//   }, [detectedPatterns, searchTerm, sectorFilter, industryFilter, priceRange, volumeRange, sortConfig]);

//   // Get grouped sector and industry data for filters
//   const sectorIndustryData = useMemo(() => {
//     const grouped = {};
    
//     detectedPatterns.forEach(row => {
//       if (!row.sector || !row.industry) return;
      
//       if (!grouped[row.sector]) {
//         grouped[row.sector] = {
//           industries: new Set(),
//           count: 0
//         };
//       }
      
//       grouped[row.sector].industries.add(row.industry);
//       grouped[row.sector].count++;
//     });

//     // Convert Sets to Arrays and sort
//     Object.keys(grouped).forEach(sector => {
//       grouped[sector].industries = [...grouped[sector].industries].filter(Boolean).sort();
//     });

//     return grouped;
//   }, [detectedPatterns]);

//   const sectors = Object.keys(sectorIndustryData).sort();

//   const isAllSelected = filteredPatterns.length > 0 && selectedRows.length === Math.min(filteredPatterns.length, MAX_SELECTED_ROWS);

//   const clearFilters = () => {
//     setSectorFilter([]);
//     setIndustryFilter([]);
//     setPriceRange({ 
//       min: minMaxPrices.min, 
//       max: minMaxPrices.max 
//     });
//     setVolumeRange({ 
//       min: minMaxVolumes.min, 
//       max: minMaxVolumes.max 
//     });
//     setSearchTerm('');
//     setExpandedSectors({});
//   };

//   const hasActiveFilters = sectorFilter.length > 0 || 
//     industryFilter.length > 0 || 
//     priceRange.min !== minMaxPrices.min || 
//     priceRange.max !== minMaxPrices.max || 
//     volumeRange.min !== minMaxVolumes.min || 
//     volumeRange.max !== minMaxVolumes.max || 
//     searchTerm;

//   // Handle sector checkbox change with 3 limit
//   const handleSectorChange = (sector) => {
//     setSectorFilter(prev => {
//       if (prev.includes(sector)) {
//         return prev.filter(s => s !== sector);
//       } else {
//         if (prev.length >= 3) {
//           alert('You can select maximum 3 sectors');
//           return prev;
//         }
//         return [...prev, sector];
//       }
//     });
//   };

//   // Handle industry checkbox change with 3 limit
//   const handleIndustryChange = (industry) => {
//     setIndustryFilter(prev => {
//       if (prev.includes(industry)) {
//         return prev.filter(i => i !== industry);
//       } else {
//         if (prev.length >= 3) {
//           alert('You can select maximum 3 industries');
//           return prev;
//         }
//         return [...prev, industry];
//       }
//     });
//   };

//   // Toggle sector expansion
//   const toggleSectorExpansion = (sector) => {
//     setExpandedSectors(prev => ({
//       ...prev,
//       [sector]: !prev[sector]
//     }));
//   };

//   // Select all industries in a sector with 3 limit
//   const selectAllIndustriesInSector = (sector) => {
//     const industries = sectorIndustryData[sector]?.industries || [];
//     const currentCount = industryFilter.length;
//     const availableSlots = 3 - currentCount;
    
//     if (availableSlots <= 0) {
//       alert('You can select maximum 3 industries');
//       return;
//     }

//     const industriesToAdd = industries.slice(0, availableSlots);
    
//     setIndustryFilter(prev => {
//       const newIndustries = [...prev];
//       industriesToAdd.forEach(industry => {
//         if (!newIndustries.includes(industry)) {
//           newIndustries.push(industry);
//         }
//       });
//       return newIndustries;
//     });
//   };

//   // Clear all industries in a sector
//   const clearAllIndustriesInSector = (sector) => {
//     const industries = sectorIndustryData[sector]?.industries || [];
//     setIndustryFilter(prev => prev.filter(industry => !industries.includes(industry)));
//   };

//   // Handle price range changes
//   const handlePriceRangeChange = (type, value) => {
//     setPriceRange(prev => ({
//       ...prev,
//       [type]: value === '' ? '' : parseFloat(value)
//     }));
//   };

//   // Handle volume range changes
//   const handleVolumeRangeChange = (type, value) => {
//     setVolumeRange(prev => ({
//       ...prev,
//       [type]: value === '' ? '' : parseFloat(value)
//     }));
//   };

//   // Direction display component
//   const DirectionBadge = ({ direction }) => {
//     const getDirectionConfig = (dir) => {
//       switch (dir) {
//         case 'bullish':
//           return {
//             icon: <UpIcon className="w-3 h-3" />,
//             bgColor: 'bg-emerald-50',
//             textColor: 'text-emerald-700',
//             borderColor: 'border-emerald-200',
//             dotColor: 'bg-emerald-500'
//           };
//         case 'bearish':
//           return {
//             icon: <DownIcon className="w-3 h-3" />,
//             bgColor: 'bg-rose-50',
//             textColor: 'text-rose-700',
//             borderColor: 'border-rose-200',
//             dotColor: 'bg-rose-500'
//           };
//         default:
//           return {
//             icon: <Minus className="w-3 h-3" />,
//             bgColor: 'bg-slate-50',
//             textColor: 'text-slate-700',
//             borderColor: 'border-slate-200',
//             dotColor: 'bg-slate-500'
//           };
//       }
//     };

//     const config = getDirectionConfig(direction);

//     return (
//       <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
//         <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
//         <span className="text-sm font-medium capitalize">{direction}</span>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
        
//         {/* Header */}
//         <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 dark:bg-gray-800/80 dark:border-gray-700">
//           <div className="max-w-9xl mx-auto px-8 py-8">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-6">
//                 <div className="p-3 bg-gradient-to-br from-sky-600 via-cyan-600 to-sky-700 rounded-2xl shadow-lg">
//                   <TrendingUp className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
//                     Candle Pattern Scanner 
//                   </h1>
//                   <p className="text-slate-600 mt-1 font-medium dark:text-slate-400">Advanced candlestick pattern detection</p>
//                   {/* <div className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg inline-flex items-center gap-1">
//                     <Zap className="w-3 h-3" />
//                     <span>Only bullish marubozu data available</span>
//                   </div> */}
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//                   <Zap className="w-5 h-5 text-amber-500" />
//                   <span className="font-medium">Real-time Analysis</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Error Display */}
//         {error && (
//           <div className="max-w-9xl mx-auto px-8 pt-6">
//             <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm dark:bg-red-900/20 dark:border-red-800">
//               <div className="flex items-center gap-3">
//                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                 <div>
//                   <p className="text-red-800 font-medium dark:text-red-300">{error}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation */}
//         <nav className="top-20 z-40 bg-white/60 backdrop-blur-md border-b border-slate-200/60 dark:bg-gray-800/60 dark:border-gray-700">
//           <div className="max-w-2xl mx-auto px-8 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 dark:bg-gray-700">
//                 {[{ id: 'category', label: 'By Category', icon: Filter }, { id: 'bias', label: 'By Market Bias', icon: Target }].map(v => (
//                   <button 
//                     key={v.id} 
//                     onClick={() => setActiveView(v.id)}
//                     className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
//                       activeView === v.id 
//                         ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm dark:bg-gray-600 dark:text-white' 
//                         : 'text-slate-600 hover:text-slate-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600/50'
//                     }`}
//                   >
//                     <v.icon className="w-4 h-4" />
//                     {v.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Main Content */}
//         <main className="max-w-9xl mx-auto px-8 py-8">
//           {/* Pattern Grid Section */}
//           <section className="mb-12">
//             <PatternGrid
//               viewType={activeView}
//               selectedPatterns={selectedPatterns}
//               onPatternSelect={setSelectedPatterns}
//               onScanMarket={handleScanMarket}
//               loading={loading}
//             />
//           </section>

//           {/* Loading State */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center py-16">
//               <div className="relative">
//                 <div className="w-16 h-16 border-4 border-sky-200 rounded-full animate-spin dark:border-blue-800"></div>
//                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                   <div className="w-8 h-8 border-4 border-sky-600 rounded-full animate-ping dark:border-blue-400"></div>
//                 </div>
//               </div>
//               <p className="mt-6 text-slate-600 font-medium dark:text-gray-300">Scanning market for patterns...</p>
//               <p className="text-slate-500 text-sm mt-2 dark:text-gray-400">Analyzing real-time data across multiple timeframes</p>
//             </div>
//           )}

//           {/* Results Table */}
//           {showTable && (
//             <section id="results-table" className="mb-16">
//               <div className="flex gap-6">
//                 {/* Enhanced Filters Sidebar */}
//                 {showFilters && (
//                   <div className="w-80 flex-shrink-0">
//                     <div className="bg-white rounded-xl border border-slate-200 dark:bg-gray-800 dark:border-gray-700 h-[calc(100vh-12rem)] sticky top-28 flex flex-col overflow-hidden">
//                       {/* Header */}
//                       <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
//                         <div className="flex items-center gap-2">
//                           <Filter className="w-4 h-4 text-slate-600 dark:text-gray-300" />
//                           <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
//                           <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
//                             Max 3
//                           </span>
//                         </div>
//                         <button
//                           onClick={() => setShowFilters(false)}
//                           className="p-1 hover:bg-slate-200 dark:hover:bg-gray-600 rounded transition-colors"
//                         >
//                           <X className="w-4 h-4 text-slate-500 dark:text-gray-400" />
//                         </button>
//                       </div>

//                       {/* Scrollable Filter Content */}
//                       <div className="flex-1 overflow-y-auto p-4 space-y-6">
//                         {/* Search Filter */}
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-gray-300">
//                             Search Symbols & Patterns
//                           </label>
//                           <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
//                             <input
//                               type="text"
//                               value={searchTerm}
//                               onChange={(e) => setSearchTerm(e.target.value)}
//                               placeholder="Search symbol or pattern..."
//                               className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                             />
//                           </div>
//                         </div>

//                         {/* Sector & Industry Filter - Grouped */}
//                         <div>
//                           <div className="flex items-center justify-between mb-2">
//                             <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
//                               Sector & Industry
//                             </label>
//                             <div className="flex gap-1">
//                               <button
//                                 onClick={() => {
//                                   const allSectors = Object.keys(sectorIndustryData).slice(0, 3);
//                                   setSectorFilter(allSectors);
//                                   const allIndustries = allSectors.flatMap(sector => 
//                                     sectorIndustryData[sector]?.industries || []
//                                   ).slice(0, 3);
//                                   setIndustryFilter(allIndustries);
//                                 }}
//                                 className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
//                               >
//                                 Select Top 3
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSectorFilter([]);
//                                   setIndustryFilter([]);
//                                 }}
//                                 className="text-xs text-slate-600 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors dark:text-gray-400 dark:hover:bg-gray-600"
//                               >
//                                 Clear All
//                               </button>
//                             </div>
//                           </div>
                          
//                           <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 dark:bg-gray-700 dark:border-gray-600">
//                             {sectors.length === 0 ? (
//                               <div className="text-center py-4 text-sm text-slate-500 dark:text-gray-400">
//                                 No sectors available
//                               </div>
//                             ) : (
//                               sectors.map(sector => {
//                                 const sectorData = sectorIndustryData[sector];
//                                 const isExpanded = expandedSectors[sector];
//                                 const sectorIndustries = sectorData?.industries || [];
//                                 const isSectorSelected = sectorFilter.includes(sector);

//                                 return (
//                                   <div key={sector} className="border-b border-slate-200 last:border-b-0 dark:border-gray-600">
//                                     {/* Sector Header */}
//                                     <div className={`flex items-center justify-between p-3 ${
//                                       isSectorSelected 
//                                         ? 'bg-blue-50 dark:bg-blue-900/20' 
//                                         : 'hover:bg-slate-100 dark:hover:bg-gray-600'
//                                     }`}>
//                                       <div className="flex items-center gap-3 flex-1">
//                                         <input
//                                           type="checkbox"
//                                           checked={isSectorSelected}
//                                           onChange={() => handleSectorChange(sector)}
//                                           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-600"
//                                         />
//                                         <div className="flex-1">
//                                           <label 
//                                             className="text-sm font-medium text-slate-700 dark:text-gray-300 cursor-pointer"
//                                             onClick={() => handleSectorChange(sector)}
//                                           >
//                                             {sector}
//                                           </label>
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <span className="text-xs text-slate-500 dark:text-gray-400">
//                                               {sectorData.count} patterns
//                                             </span>
//                                             {sectorIndustries.length > 0 && (
//                                               <span className="text-xs text-slate-400 dark:text-gray-500">
//                                                 • {sectorIndustries.length} industries
//                                               </span>
//                                             )}
//                                           </div>
//                                         </div>
//                                       </div>
//                                       {sectorIndustries.length > 0 && (
//                                         <button
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             toggleSectorExpansion(sector);
//                                           }}
//                                           className="p-1 hover:bg-slate-200 rounded transition-colors dark:hover:bg-gray-500"
//                                         >
//                                           <ChevronDown 
//                                             className={`w-4 h-4 text-slate-500 transition-transform ${
//                                               isExpanded ? 'rotate-180' : ''
//                                             }`} 
//                                           />
//                                         </button>
//                                       )}
//                                     </div>

//                                     {/* Industries List with rounded borders */}
//                                     {isExpanded && sectorIndustries.length > 0 && (
//                                       <div className="bg-white border-t border-slate-200 dark:bg-gray-600 dark:border-gray-500">
//                                         <div className="pl-8 pr-3 py-2 space-y-1">
//                                           {sectorIndustries.map((industry, index) => (
//                                             <div 
//                                               key={industry} 
//                                               className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
//                                                 industryFilter.includes(industry) 
//                                                   ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700' 
//                                                   : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500'
//                                               } ${
//                                                 index === 0 ? 'rounded-t-lg' : ''
//                                               } ${
//                                                 index === sectorIndustries.length - 1 ? 'rounded-b-lg' : ''
//                                               }`}
//                                             >
//                                               <input
//                                                 type="checkbox"
//                                                 id={`industry-${sector}-${industry}`}
//                                                 checked={industryFilter.includes(industry)}
//                                                 onChange={() => handleIndustryChange(industry)}
//                                                 className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-500"
//                                               />
//                                               <label 
//                                                 htmlFor={`industry-${sector}-${industry}`}
//                                                 className="text-sm text-slate-700 dark:text-gray-300 cursor-pointer flex-1"
//                                               >
//                                                 {industry}
//                                               </label>
//                                             </div>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 );
//                               })
//                             )}
//                           </div>
//                         </div>

//                         {/* Price Range Filter with Slider */}
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-gray-300">
//                             Close Price Range
//                           </label>
//                           <div className="space-y-4">
//                             {/* Slider */}
//                             <div className="px-2">
//                               <input
//                                 type="range"
//                                 min={minMaxPrices.min}
//                                 max={minMaxPrices.max}
//                                 value={priceRange.max}
//                                 onChange={(e) => handlePriceRangeChange('max', e.target.value)}
//                                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb dark:bg-gray-600"
//                                 style={{
//                                   background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((priceRange.max - minMaxPrices.min) / (minMaxPrices.max - minMaxPrices.min)) * 100}%, #e2e8f0 ${((priceRange.max - minMaxPrices.min) / (minMaxPrices.max - minMaxPrices.min)) * 100}%, #e2e8f0 100%)`
//                                 }}
//                               />
//                               <div className="flex justify-between text-xs text-slate-500 mt-2 dark:text-gray-400">
//                                 <span>₹{minMaxPrices.min.toLocaleString()}</span>
//                                 <span>₹{minMaxPrices.max.toLocaleString()}</span>
//                               </div>
//                             </div>
                            
//                             {/* Input Fields */}
//                             <div className="grid grid-cols-2 gap-3">
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Min Price</label>
//                                 <input
//                                   type="number"
//                                   value={priceRange.min}
//                                   onChange={(e) => handlePriceRangeChange('min', e.target.value)}
//                                   placeholder="Min"
//                                   min={minMaxPrices.min}
//                                   max={priceRange.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Max Price</label>
//                                 <input
//                                   type="number"
//                                   value={priceRange.max}
//                                   onChange={(e) => handlePriceRangeChange('max', e.target.value)}
//                                   placeholder="Max"
//                                   min={priceRange.min}
//                                   max={minMaxPrices.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                             </div>
                            
//                             {/* Selected Range Display */}
//                             <div className="text-center">
//                               <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 px-3 py-1.5 rounded-full dark:bg-blue-900/20">
//                                 ₹{priceRange.min.toLocaleString()} - ₹{priceRange.max.toLocaleString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Volume Range Filter with Slider */}
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-gray-300">
//                             Volume Per Trade
//                           </label>
//                           <div className="space-y-4">
//                             {/* Slider */}
//                             <div className="px-2">
//                               <input
//                                 type="range"
//                                 min={minMaxVolumes.min}
//                                 max={minMaxVolumes.max}
//                                 value={volumeRange.max}
//                                 onChange={(e) => handleVolumeRangeChange('max', e.target.value)}
//                                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb dark:bg-gray-600"
//                                 style={{
//                                   background: `linear-gradient(to right, #10b981 0%, #10b981 ${((volumeRange.max - minMaxVolumes.min) / (minMaxVolumes.max - minMaxVolumes.min)) * 100}%, #e2e8f0 ${((volumeRange.max - minMaxVolumes.min) / (minMaxVolumes.max - minMaxVolumes.min)) * 100}%, #e2e8f0 100%)`
//                                 }}
//                               />
//                               <div className="flex justify-between text-xs text-slate-500 mt-2 dark:text-gray-400">
//                                 <span>{minMaxVolumes.min.toLocaleString()}</span>
//                                 <span>{minMaxVolumes.max.toLocaleString()}</span>
//                               </div>
//                             </div>
                            
//                             {/* Input Fields */}
//                             <div className="grid grid-cols-2 gap-3">
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Min Volume</label>
//                                 <input
//                                   type="number"
//                                   value={volumeRange.min}
//                                   onChange={(e) => handleVolumeRangeChange('min', e.target.value)}
//                                   placeholder="Min"
//                                   min={minMaxVolumes.min}
//                                   max={volumeRange.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Max Volume</label>
//                                 <input
//                                   type="number"
//                                   value={volumeRange.max}
//                                   onChange={(e) => handleVolumeRangeChange('max', e.target.value)}
//                                   placeholder="Max"
//                                   min={volumeRange.min}
//                                   max={minMaxVolumes.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                             </div>
                            
//                             {/* Selected Range Display */}
//                             <div className="text-center">
//                               <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 px-3 py-1.5 rounded-full dark:bg-green-900/20">
//                                 {volumeRange.min.toLocaleString()} - {volumeRange.max.toLocaleString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Footer Actions */}
//                       <div className="border-t border-slate-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
//                         <div className="flex flex-col gap-2">
//                           <button
//                             onClick={() => {/* Filters are applied automatically */}}
//                             className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//                           >
//                             Apply Filters
//                           </button>
//                           {hasActiveFilters && (
//                             <button
//                               onClick={clearFilters}
//                               className="flex items-center justify-center gap-1 w-full px-4 py-2 text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-700"
//                             >
//                               <X className="w-3 h-3" />
//                               Clear All Filters
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Table Content */}
//                 <div className={`${showFilters ? 'flex-1 min-w-0' : 'flex-1 max-w-7xl mx-auto'}`}>
//                   <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
               
//                     <div className="bg-slate-800 px-6 py-4 dark:bg-gray-900">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h2 className="text-lg font-bold text-white flex items-center gap-2">
//                             <BarChart3 className="w-5 h-5" />
//                             Scan Results
//                           </h2>
//                           <div className="flex items-center gap-3 mt-1 text-slate-300 text-sm">
//                             <span>{filteredPatterns.length} patterns detected</span>
//                             {missingCount > 0 && (
//                               <span>• {missingCount} without price data</span>
//                             )}
//                             {hasActiveFilters && (
//                               <span>• Filtered from {detectedPatterns.length} total</span>
//                             )}
//                             <span className="bg-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
//                               Max {MAX_SELECTED_ROWS} selections
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <button
//                             onClick={() => setShowFilters(!showFilters)}
//                             className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors text-sm"
//                           >
//                             <Filter className="w-4 h-4" />
//                             {showFilters ? 'Hide Filters' : 'Show Filters'}
//                             {hasActiveFilters && (
//                               <div className="w-1.5 h-1.5 bg-red-400 rounded-full ml-1"></div>
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Section */}
//                     {selectedRows.length > 0 && (
//                       <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 dark:bg-gray-700 dark:border-gray-600">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-semibold text-slate-800 dark:text-gray-300">
//                               {selectedRows.length} pattern{selectedRows.length !== 1 ? 's' : ''} selected
//                               {selectedRows.length >= MAX_SELECTED_ROWS && (
//                                 <span className="ml-2 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
//                                   Maximum reached
//                                 </span>
//                               )}
//                             </p>
//                           </div>
//                           <button 
//                             onClick={handleViewChart} 
//                             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"
//                           >
//                             <div className="flex items-center gap-2">
//                               <BarChart3 className="w-4 h-4" />
//                               View Analysis
//                             </div>
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     {/* Table */}
//                     <div className="overflow-x-auto">
//                       <table className="w-full min-w-[800px]">
//                         <thead className="bg-slate-50 border-b border-slate-200 dark:bg-gray-700 dark:border-gray-600">
//                           <tr>
//                             <th className="px-4 py-3 text-left">
//                               <input 
//                                 type="checkbox" 
//                                 checked={isAllSelected}
//                                 onChange={handleSelectAllRows}
//                                 className="w-4 h-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
//                               />
//                             </th>
//                             <th 
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('pid')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Pattern
//                                 {getSortIcon('pid')}
//                               </div>
//                             </th>
//                             <th 
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('symbol')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Symbol
//                                 {getSortIcon('symbol')}
//                               </div>
//                             </th>
//                             <th 
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('date')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Date
//                                 {getSortIcon('date')}
//                               </div>
//                             </th>
//                             <th 
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('direction')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Direction
//                                 {getSortIcon('direction')}
//                               </div>
//                             </th>
//                             {!showFilters && (
//                               <>
//                                 <th 
//                                   className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                                   onClick={() => handleSort('sector')}
//                                 >
//                                   <div className="flex items-center gap-1">
//                                     Sector
//                                     {getSortIcon('sector')}
//                                   </div>
//                                 </th>
//                                 <th 
//                                   className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                                   onClick={() => handleSort('industry')}
//                                 >
//                                   <div className="flex items-center gap-1">
//                                     Industry
//                                     {getSortIcon('industry')}
//                                   </div>
//                                 </th>
//                               </>
//                             )}
//                             <th 
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('closePrice')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Price
//                                 {getSortIcon('closePrice')}
//                               </div>
//                             </th>
//                             <th 
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('volume')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Volume
//                                 {getSortIcon('volume')}
//                               </div>
//                             </th>
//                             <th 
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('score')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Confidence
//                                 {getSortIcon('score')}
//                               </div>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-200 dark:divide-gray-600">
//                           {filteredPatterns.map((row, index) => (
//                             <tr 
//                               key={`${row.pid}-${row.fincode}-${index}`} 
//                               className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-600/50 ${
//                                 selectedRows.includes(index) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
//                               } ${
//                                 selectedRows.length >= MAX_SELECTED_ROWS && !selectedRows.includes(index) 
//                                   ? 'opacity-50 cursor-not-allowed' 
//                                   : ''
//                               }`}
//                               onClick={() => {
//                                 if (selectedRows.length < MAX_SELECTED_ROWS || selectedRows.includes(index)) {
//                                   handleSelectRow(index);
//                                 }
//                               }}
//                             >
//                               <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
//                                 <input 
//                                   type="checkbox" 
//                                   checked={selectedRows.includes(index)} 
//                                   onChange={() => handleSelectRow(index)}
//                                   disabled={selectedRows.length >= MAX_SELECTED_ROWS && !selectedRows.includes(index)}
//                                   className={`w-4 h-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-600 ${
//                                     selectedRows.length >= MAX_SELECTED_ROWS && !selectedRows.includes(index) 
//                                       ? 'cursor-not-allowed opacity-50' 
//                                       : ''
//                                   }`}
//                                 />
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="font-medium text-slate-800 dark:text-gray-100 text-sm">
//                                   {PatternRegistry.getPattern(row.pid)?.name || PatternRegistry.getPattern(row.pid)?.shortName || row.pid}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="font-bold text-blue-600 text-sm dark:text-blue-400">
//                                   {row.symbol}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-slate-700 font-medium dark:text-gray-300 text-sm">
//                                 {row.date}
//                               </td>
//                               <td className="px-4 py-3">
//                                 <DirectionBadge direction={row.direction} />
//                               </td>
//                               {!showFilters && (
//                                 <>
//                                   <td className="px-4 py-3">
//                                     <span className="text-xs text-slate-600 dark:text-gray-400">
//                                       {row.sector}
//                                     </span>
//                                   </td>
//                                   <td className="px-4 py-3">
//                                     <span className="text-xs text-slate-600 dark:text-gray-400 max-w-[120px] truncate block">
//                                       {row.industry}
//                                     </span>
//                                   </td>
//                                 </>
//                               )}
//                               <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-300 text-sm">
//                                 {row.closePrice ? `₹${row.closePrice.toFixed(2)}` : '—'}
//                               </td>
//                               <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-300 text-sm">
//                                 {row.volume ? row.volume.toLocaleString() : '—'}
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`inline-flex items-center justify-center px-2 py-1 rounded font-semibold text-xs ${
//                                   row.score >= 0.8 
//                                     ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
//                                     : row.score >= 0.6 
//                                     ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
//                                     : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
//                                 }`}>
//                                   {row.score.toFixed(2)}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>

//                       {/* Empty State */}
//                       {filteredPatterns.length === 0 && (
//                         <div className="text-center py-12">
//                           <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center dark:bg-gray-700">
//                             <BarChart3 className="w-6 h-6 text-slate-400 dark:text-gray-500" />
//                           </div>
//                           <p className="text-slate-600 font-medium dark:text-gray-400 text-sm">
//                             {hasActiveFilters ? 'No patterns match your filters' : 'No patterns detected'}
//                           </p>
//                           {hasActiveFilters && (
//                             <button
//                               onClick={clearFilters}
//                               className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm dark:text-blue-400"
//                             >
//                               Clear filters
//                             </button>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           )}

//           {/* Research Panel */}
//           {showResearchPanel && (
//             <section id="research-panel" className="mb-16">
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-slate-800 mb-2 dark:text-white">
//                   Advanced Research Panel
//                 </h2>
//                 <p className="text-slate-600 dark:text-gray-400">
//                   Comprehensive technical analysis with multi-timeframe pattern recognition
//                 </p>
//               </div>
//               {Object.entries(researchData).map(([fincode, { priceData, patterns }]) => (
//                 <div key={fincode} className="mb-8 last:mb-0">
//                   <ResearchChart fincode={fincode} priceData={priceData} patterns={patterns} />
//                 </div>
//               ))}
//             </section>
//           )}
//         </main>
//       </div>

//       {/* Add custom styles for range slider */}
//       <style jsx>{`
//         .slider-thumb::-webkit-slider-thumb {
//           appearance: none;
//           height: 18px;
//           width: 18px;
//           border-radius: 50%;
//           background: #3b82f6;
//           cursor: pointer;
//           border: 2px solid #ffffff;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//         }
        
//         .slider-thumb::-moz-range-thumb {
//           height: 18px;
//           width: 18px;
//           border-radius: 50%;
//           background: #3b82f6;
//           cursor: pointer;
//           border: 2px solid #ffffff;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//         }
        
//         .slider-thumb:focus::-webkit-slider-thumb {
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
//         }
//       `}</style>
//     </>
//   );
// }

// export default Patterns;


// --------------------new pattern --------------------------



// import { useState, useMemo, useEffect } from 'react';
// import { TrendingUp, Filter, X, ChevronDown, Search, TrendingUp as UpIcon, TrendingDown as DownIcon, Minus, BarChart3, Zap, Target, Calendar } from 'lucide-react';
// import PatternGrid from './PatternGrid';
// import ResearchChart from './ResearchChart';
// import { PatternRegistry } from './data/patternRegistry';
// import Navbar from '../Navbar';
// import { useNavigate } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';

// function Patterns() {
//   const [activeView, setActiveView] = useState('category');
//   const [selectedPatterns, setSelectedPatterns] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [detectedPatterns, setDetectedPatterns] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [showResearchPanel, setShowResearchPanel] = useState(false);
//   const [researchData, setResearchData] = useState({});
//   const [missingCount, setMissingCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Filter states
//   const [sectorFilter, setSectorFilter] = useState([]);
//   const [industryFilter, setIndustryFilter] = useState([]);
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [volumeRange, setVolumeRange] = useState({ min: '', max: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showFilters, setShowFilters] = useState(true);
//   const [expandedSectors, setExpandedSectors] = useState({});
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const navigate = useNavigate();

//   // Constants
//   // const API_BASE_URL = 'http://localhost:9000';
//   // const API_KEY = 'answer-ur-curosity-2-3-5-7-11-13';
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const MAX_SELECTED_ROWS = 3; // Maximum 3 rows can be selected

//   // Compression utility functions
//   const compressData = (data) => {
//     try {
//       const jsonString = JSON.stringify(data);
//       return btoa(unescape(encodeURIComponent(jsonString)));
//     } catch (error) {
//       console.error('Compression error:', error);
//       return null;
//     }
//   };

//   const extractScore = (desc) => {
//     if (!desc) return 0.0;
//     const match = desc.match(/(?:confidence|score)[:\s]*([0-9]*\.?[0-9]+)/i) ||
//       desc.match(/([0-9]*\.?[0-9]+)\s*\/\s*10/) ||
//       desc.match(/final score[:\s]*([0-9]*\.?[0-9]+)/i);
//     if (match) {
//       const score = parseFloat(match[1]);
//       return score > 1 ? score / 10 : score;
//     }
//     return 0.0;
//   };


//   const fetchPriceDataBatch = async (fincodes) => {
//   try {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 15000);

//     const response = await fetch(`${API_BASE}/price-action/one-year`, {
//       method: 'POST',
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ fincodes }),
//       signal: controller.signal
//     });

//     clearTimeout(timeout);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch price data for batch: ${response.status}`);
//     }

//     let data;
//     try {
//       data = await response.json();
//     } catch (jsonErr) {
//       throw new Error("Invalid JSON received from price data API");
//     }

//     if (!data || typeof data !== "object") {
//       throw new Error("Price data API returned empty or invalid response");
//     }

//     return data;

//   } catch (error) {
//     if (error.name === "AbortError") {
//       console.error("Batch price API timeout");
//       return null;
//     }

//     console.error("Error fetching batch price data:", error);
//     return null;
//   }
// };




//   const handleScanMarket = async (patterns, days) => {
//     if (patterns.length === 0) return;

//     setLoading(true);
//     setError('');

//     try {
//       const controller = new AbortController();
//       const timeout = setTimeout(() => controller.abort(), 15000);

//       const response = await fetch(`${API_BASE}/patterns/scan`, {
//         method: 'POST',
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           pattern_ids: patterns,
//           lookUp_days: days
//         }),
//         signal: controller.signal
//       });

//       clearTimeout(timeout);

//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }

//       let apiData;
//       try {
//         apiData = await response.json();
//       } catch (jsonErr) {
//         throw new Error("Invalid JSON returned from scan API");
//       }

//       if (!apiData || !apiData.data) {
//         throw new Error("Invalid API response format: missing data field");
//       }

//       // Process the API response
//       const rows = [];
//       let skipped = 0;

//       const responseData = apiData.data;
//       const patternCount = responseData.Pattern_ID?.length || 0;

//       console.log('API Response received:', apiData);
//       console.log(`Processing ${patternCount} patterns`);

//       // Extract unique fincodes for batch request
//       const uniqueFincodes = [...new Set(responseData.FINCODE.slice(0, patternCount))];
//       console.log('Unique fincodes for batch request:', uniqueFincodes);

//       // Fetch price data for all fincodes in batch
//       const batchPriceData = await fetchPriceDataBatch(uniqueFincodes);
//       console.log('Batch price data response:', batchPriceData);

//       if (!batchPriceData || !batchPriceData.data) {
//         throw new Error("Failed to load price data for patterns");
//       }

//       // Process each pattern in the response arrays
//       for (let i = 0; i < patternCount; i++) {
//         const patternId = responseData.Pattern_ID[i];
//         const patternName = responseData.Pattern_Name[i];
//         const fincode = responseData.FINCODE[i];
//         const symbol = responseData.Symbol[i];
//         const date = responseData.Created_On[i] || responseData.startDate[i] || '—';
//         const description = responseData.final_interpretation[i] || '';
//         const industry = responseData.Industry[i] || '—';
//         const sector = responseData.Sector[i] || '—';
//         const closePrice = responseData.ClosePrice[i];
//         const volume = responseData.Volume_PerTrade[i];
//         const structureScore = responseData.structure_score[i];
//         const trendScore = responseData.trend_score[i];
//         const volumeScore = responseData.volume_score[i];
//         const volatilityScore = responseData.volatility_score[i];
//         const finalConfidence = responseData.final_confidence[i];

//         // Use final_confidence as the main score, fallback to extracted score
//         const score = finalConfidence !== undefined ? finalConfidence : extractScore(description);

//         // Get pattern direction from PatternRegistry
//         const patternMeta = PatternRegistry.getPattern(patternId);
//         const direction = patternMeta?.bias || 'neutral';

//         // Get price data from batch response
//         let priceData = null;
//         if (batchPriceData && batchPriceData.data) {
//           priceData = batchPriceData.data[fincode] || batchPriceData.data[String(fincode)];
//         }

//         if (!priceData) {
//           console.warn(`No price data found for fincode: ${fincode}`);
//           skipped++;
//           continue;
//         }

//         rows.push({
//           pid: patternId,
//           fincode,
//           symbol,
//           date: typeof date === 'string' ? date.split('T')[0] : '—',
//           score,
//           description,
//           industry,
//           sector,
//           direction,
//           closePrice,
//           volume,
//           structureScore,
//           trendScore,
//           volumeScore,
//           volatilityScore,
//           finalConfidence,
//           hasPriceData: true,
//           priceData
//         });
//       }

//       if (rows.length === 0) {
//         alert('No matching patterns found with price data.');
//         return;
//       }

//       setDetectedPatterns(rows);
//       setShowTable(true);
//       setSelectedRows([]); // Reset selection when new data loads
//       setShowResearchPanel(false);
//       setMissingCount(skipped);

//       // Reset filters when new data loads
//       setSectorFilter([]);
//       setIndustryFilter([]);
//       setPriceRange({ min: '', max: '' });
//       setVolumeRange({ min: '', max: '' });
//       setSearchTerm('');
//       setExpandedSectors({});

//       setTimeout(() => {
//         document.getElementById('results-table')?.scrollIntoView({ behavior: 'smooth' });
//       }, 100);

//     } catch (err) {
//       const message =
//         err.name === "AbortError"
//           ? "The request timed out. Please try again."
//           : err.message;

//       setError(`Failed to scan market: ${message}`);
//       console.error("API Error:", err);

//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewChart = () => {
//     if (selectedRows.length === 0) return alert('Select at least one row');

//     const researchCharts = [];

//     selectedRows.forEach(i => {
//       const row = filteredPatterns[i];
//       if (!row.hasPriceData || !row.priceData) return;

//       researchCharts.push({
//         fincode: row.fincode,
//         priceData: row.priceData,
//         patterns: [{
//           date: row.date,
//           patternId: row.pid,
//           score: row.score
//         }],
//         symbol: row.symbol,
//         companyName: row.symbol
//       });
//     });

//     if (researchCharts.length === 0) return alert('No price data for selected symbols');

//     // Store research data for dashboard with compression
//     const researchDataForDashboard = {
//       researchCharts: researchCharts,
//       timestamp: Date.now()
//     };

//     try {
//       const compressedData = compressData(researchDataForDashboard);
//       if (compressedData && compressedData.length < 5 * 1024 * 1024) { // 5MB limit
//         localStorage.setItem('researchChartData', compressedData);
//       } else {
//         throw new Error('Data too large after compression');
//       }
//     } catch (error) {
//       console.error('Storage error:', error);
//       // Store only essential data
//       const essentialData = {
//         symbols: researchCharts.map(chart => chart.symbol),
//         patternCount: researchCharts.length,
//         timestamp: Date.now()
//       };
//       localStorage.setItem('researchChartData', JSON.stringify(essentialData));
//     }

//     navigate('/researchpanel', {
//       state: {
//         fromPatternScanner: true,
//         researchData: researchDataForDashboard
//       }
//     });
//   };

//   // Updated selection handlers with MAX_SELECTED_ROWS limit
//   const handleSelectAllRows = (e) => {
//     if (e.target.checked) {
//       // Only select first MAX_SELECTED_ROWS
//       const limitedSelection = filteredPatterns
//         .slice(0, MAX_SELECTED_ROWS)
//         .map((_, index) => index);
//       setSelectedRows(limitedSelection);
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   const handleSelectRow = (index) => {
//     setSelectedRows(prev => {
//       if (prev.includes(index)) {
//         return prev.filter(x => x !== index);
//       } else {
//         if (prev.length >= MAX_SELECTED_ROWS) {
//           alert(`Maximum ${MAX_SELECTED_ROWS} patterns can be selected for analysis`);
//           return prev;
//         }
//         return [...prev, index];
//       }
//     });
//   };

//   // Sort functionality
//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return <ChevronDown className="w-3 h-3 text-slate-400 opacity-50" />;
//     }
//     return sortConfig.direction === 'asc'
//       ? <UpIcon className="w-3 h-3 text-blue-600" />
//       : <DownIcon className="w-3 h-3 text-blue-600" />;
//   };

//   // Calculate min and max values for sliders
//   const minMaxPrices = useMemo(() => {
//     if (detectedPatterns.length === 0) return { min: 0, max: 1000 };

//     const prices = detectedPatterns
//       .map(row => row.closePrice)
//       .filter(price => price != null && !isNaN(price));

//     if (prices.length === 0) return { min: 0, max: 1000 };

//     return {
//       min: Math.floor(Math.min(...prices)),
//       max: Math.ceil(Math.max(...prices))
//     };
//   }, [detectedPatterns]);

//   const minMaxVolumes = useMemo(() => {
//     if (detectedPatterns.length === 0) return { min: 0, max: 1000000 };

//     const volumes = detectedPatterns
//       .map(row => row.volume)
//       .filter(volume => volume != null && !isNaN(volume));

//     if (volumes.length === 0) return { min: 0, max: 1000000 };

//     return {
//       min: Math.floor(Math.min(...volumes)),
//       max: Math.ceil(Math.max(...volumes))
//     };
//   }, [detectedPatterns]);

//   // Initialize ranges when data loads
//   useEffect(() => {
//     if (detectedPatterns.length > 0) {
//       setPriceRange({
//         min: minMaxPrices.min,
//         max: minMaxPrices.max
//       });
//       setVolumeRange({
//         min: minMaxVolumes.min,
//         max: minMaxVolumes.max
//       });
//     }
//   }, [detectedPatterns.length, minMaxPrices, minMaxVolumes]);

//   // Filter and sort logic
//   const filteredPatterns = useMemo(() => {
//     let filtered = detectedPatterns.filter(row => {
//       // Search filter
//       if (searchTerm && !row.symbol.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         !row.pid.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }

//       // Sector filter (multi-select)
//       if (sectorFilter.length > 0 && !sectorFilter.includes(row.sector)) {
//         return false;
//       }

//       // Industry filter (multi-select)
//       if (industryFilter.length > 0 && !industryFilter.includes(row.industry)) {
//         return false;
//       }

//       // Price range filter
//       if (priceRange.min !== '' && row.closePrice < parseFloat(priceRange.min)) {
//         return false;
//       }
//       if (priceRange.max !== '' && row.closePrice > parseFloat(priceRange.max)) {
//         return false;
//       }

//       // Volume range filter
//       if (volumeRange.min !== '' && row.volume < parseFloat(volumeRange.min)) {
//         return false;
//       }
//       if (volumeRange.max !== '' && row.volume > parseFloat(volumeRange.max)) {
//         return false;
//       }

//       return true;
//     });

//     // Apply sorting
//     if (sortConfig.key) {
//       filtered = [...filtered].sort((a, b) => {
//         let aValue = a[sortConfig.key];
//         let bValue = b[sortConfig.key];

//         // Handle string comparison
//         if (typeof aValue === 'string') {
//           aValue = aValue.toLowerCase();
//           bValue = bValue.toLowerCase();
//         }

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     return filtered;
//   }, [detectedPatterns, searchTerm, sectorFilter, industryFilter, priceRange, volumeRange, sortConfig]);

//   // Get grouped sector and industry data for filters
//   const sectorIndustryData = useMemo(() => {
//     const grouped = {};

//     detectedPatterns.forEach(row => {
//       if (!row.sector || !row.industry) return;

//       if (!grouped[row.sector]) {
//         grouped[row.sector] = {
//           industries: new Set(),
//           count: 0
//         };
//       }

//       grouped[row.sector].industries.add(row.industry);
//       grouped[row.sector].count++;
//     });

//     // Convert Sets to Arrays and sort
//     Object.keys(grouped).forEach(sector => {
//       grouped[sector].industries = [...grouped[sector].industries].filter(Boolean).sort();
//     });

//     return grouped;
//   }, [detectedPatterns]);

//   const sectors = Object.keys(sectorIndustryData).sort();

//   const isAllSelected = filteredPatterns.length > 0 && selectedRows.length === Math.min(filteredPatterns.length, MAX_SELECTED_ROWS);

//   const clearFilters = () => {
//     setSectorFilter([]);
//     setIndustryFilter([]);
//     setPriceRange({
//       min: minMaxPrices.min,
//       max: minMaxPrices.max
//     });
//     setVolumeRange({
//       min: minMaxVolumes.min,
//       max: minMaxVolumes.max
//     });
//     setSearchTerm('');
//     setExpandedSectors({});
//   };

//   const hasActiveFilters = sectorFilter.length > 0 ||
//     industryFilter.length > 0 ||
//     priceRange.min !== minMaxPrices.min ||
//     priceRange.max !== minMaxPrices.max ||
//     volumeRange.min !== minMaxVolumes.min ||
//     volumeRange.max !== minMaxVolumes.max ||
//     searchTerm;

//   // Handle sector checkbox change with 3 limit
//   const handleSectorChange = (sector) => {
//     setSectorFilter(prev => {
//       if (prev.includes(sector)) {
//         return prev.filter(s => s !== sector);
//       } else {
//         if (prev.length >= 3) {
//           alert('You can select maximum 3 sectors');
//           return prev;
//         }
//         return [...prev, sector];
//       }
//     });
//   };

//   // Handle industry checkbox change with 3 limit
//   const handleIndustryChange = (industry) => {
//     setIndustryFilter(prev => {
//       if (prev.includes(industry)) {
//         return prev.filter(i => i !== industry);
//       } else {
//         if (prev.length >= 3) {
//           alert('You can select maximum 3 industries');
//           return prev;
//         }
//         return [...prev, industry];
//       }
//     });
//   };

//   // Toggle sector expansion
//   const toggleSectorExpansion = (sector) => {
//     setExpandedSectors(prev => ({
//       ...prev,
//       [sector]: !prev[sector]
//     }));
//   };

//   // Select all industries in a sector with 3 limit
//   const selectAllIndustriesInSector = (sector) => {
//     const industries = sectorIndustryData[sector]?.industries || [];
//     const currentCount = industryFilter.length;
//     const availableSlots = 3 - currentCount;

//     if (availableSlots <= 0) {
//       alert('You can select maximum 3 industries');
//       return;
//     }

//     const industriesToAdd = industries.slice(0, availableSlots);

//     setIndustryFilter(prev => {
//       const newIndustries = [...prev];
//       industriesToAdd.forEach(industry => {
//         if (!newIndustries.includes(industry)) {
//           newIndustries.push(industry);
//         }
//       });
//       return newIndustries;
//     });
//   };

//   // Clear all industries in a sector
//   const clearAllIndustriesInSector = (sector) => {
//     const industries = sectorIndustryData[sector]?.industries || [];
//     setIndustryFilter(prev => prev.filter(industry => !industries.includes(industry)));
//   };

//   // Handle price range changes
//   const handlePriceRangeChange = (type, value) => {
//     setPriceRange(prev => ({
//       ...prev,
//       [type]: value === '' ? '' : parseFloat(value)
//     }));
//   };

//   // Handle volume range changes
//   const handleVolumeRangeChange = (type, value) => {
//     setVolumeRange(prev => ({
//       ...prev,
//       [type]: value === '' ? '' : parseFloat(value)
//     }));
//   };

//   // Direction display component
//   const DirectionBadge = ({ direction }) => {
//     const getDirectionConfig = (dir) => {
//       switch (dir) {
//         case 'bullish':
//           return {
//             icon: <UpIcon className="w-3 h-3" />,
//             bgColor: 'bg-emerald-50',
//             textColor: 'text-emerald-700',
//             borderColor: 'border-emerald-200',
//             dotColor: 'bg-emerald-500'
//           };
//         case 'bearish':
//           return {
//             icon: <DownIcon className="w-3 h-3" />,
//             bgColor: 'bg-rose-50',
//             textColor: 'text-rose-700',
//             borderColor: 'border-rose-200',
//             dotColor: 'bg-rose-500'
//           };
//         default:
//           return {
//             icon: <Minus className="w-3 h-3" />,
//             bgColor: 'bg-slate-50',
//             textColor: 'text-slate-700',
//             borderColor: 'border-slate-200',
//             dotColor: 'bg-slate-500'
//           };
//       }
//     };

//     const config = getDirectionConfig(direction);

//     return (
//       <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
//         <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
//         <span className="text-sm font-medium capitalize">{direction}</span>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Market Patterns – Technical Pattern Recognition & Trend Signals | CMDA
//         </title>
//         <meta
//           name="description"
//           content="Identify market patterns with CMDA’s advanced pattern recognition engine. Track trend signals, 
// chart formations, and technical insights with real-time data analytics."
//         />
//         <meta
//           name="keywords"
//           content="market patterns, technical pattern recognition, trend signals, chart patterns, candlestick patterns, trading patterns, technical analysis, pattern detection, real-time market patterns, CMDA patterns, stock trend analysis, chart formations, market trend signals, technical insights, price pattern analysis, automated pattern recognition"
//         />
//         <meta property="og:title" content="Patterns | CMDA Hub" />
//         <meta
//           property="og:description"
//           content="Get powerful equity insights with CMDA Hub — your trusted source for real-time stock data, performance analytics, and expert market intelligence."
//         />
//         <meta property="og:url" content="https://cmdahub.com/patterns" />
//         <meta property="og:type" content="website" />
//         <meta property="og:site_name" content="CMDA Hub" />
//         <link rel="canonical" href="https://cmdahub.com/patterns" />
//       </Helmet>
//       <Navbar />
//       <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">

//         {/* Header */}
//         <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 dark:bg-gray-800/80 dark:border-gray-700">
//           <div className="max-w-9xl mx-auto px-8 py-8">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-6">
//                 <div className="p-3 bg-gradient-to-br from-sky-600 via-cyan-600 to-sky-700 rounded-2xl shadow-lg">
//                   <TrendingUp className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
//                     Candle Pattern Scanner
//                   </h1>
//                   <p className="text-slate-600 mt-1 font-medium dark:text-slate-400">Advanced candlestick pattern detection</p>

//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//                   <Zap className="w-5 h-5 text-amber-500" />
//                   <span className="font-medium">Real-time Analysis</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Error Display */}
//         {error && (
//           <div className="max-w-9xl mx-auto px-8 pt-6">
//             <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm dark:bg-red-900/20 dark:border-red-800">
//               <div className="flex items-center gap-3">
//                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                 <div>
//                   <p className="text-red-800 font-medium dark:text-red-300">{error}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation */}
//         <nav className="top-20 z-40 bg-white/60 backdrop-blur-md border-b border-slate-200/60 dark:bg-gray-800/60 dark:border-gray-700">
//           <div className="max-w-2xl mx-auto px-8 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 dark:bg-gray-700">
//                 {[{ id: 'category', label: 'By Category', icon: Filter }, { id: 'bias', label: 'By Market Bias', icon: Target }].map(v => (
//                   <button
//                     key={v.id}
//                     onClick={() => setActiveView(v.id)}
//                     className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${activeView === v.id
//                       ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm dark:bg-gray-600 dark:text-white'
//                       : 'text-slate-600 hover:text-slate-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600/50'
//                       }`}
//                   >
//                     <v.icon className="w-4 h-4" />
//                     {v.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Main Content */}
//         <main className="max-w-9xl mx-auto px-8 py-8">
//           {/* Pattern Grid Section */}
//           <section className="mb-12">
//             <PatternGrid
//               viewType={activeView}
//               selectedPatterns={selectedPatterns}
//               onPatternSelect={setSelectedPatterns}
//               onScanMarket={handleScanMarket}
//               loading={loading}
//             />
//           </section>

//           {/* Loading State */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center py-16">
//               <div className="relative">
//                 <div className="w-16 h-16 border-4 border-sky-200 rounded-full animate-spin dark:border-blue-800"></div>
//                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                   <div className="w-8 h-8 border-4 border-sky-600 rounded-full animate-ping dark:border-blue-400"></div>
//                 </div>
//               </div>
//               <p className="mt-6 text-slate-600 font-medium dark:text-gray-300">Scanning market for patterns...</p>
//               <p className="text-slate-500 text-sm mt-2 dark:text-gray-400">Analyzing real-time data across multiple timeframes</p>
//             </div>
//           )}

//           {/* Results Table */}
//           {showTable && (
//             <section id="results-table" className="mb-16">
//               <div className="flex gap-6">
//                 {/* Enhanced Filters Sidebar */}
//                 {showFilters && (
//                   <div className="w-80 flex-shrink-0">
//                     <div className="bg-white rounded-xl border border-slate-200 dark:bg-gray-800 dark:border-gray-700 h-[calc(100vh-12rem)] sticky top-28 flex flex-col overflow-hidden">
//                       {/* Header */}
//                       <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
//                         <div className="flex items-center gap-2">
//                           <Filter className="w-4 h-4 text-slate-600 dark:text-gray-300" />
//                           <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
//                           <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
//                             Max 3
//                           </span>
//                         </div>
//                         <button
//                           onClick={() => setShowFilters(false)}
//                           className="p-1 hover:bg-slate-200 dark:hover:bg-gray-600 rounded transition-colors"
//                         >
//                           <X className="w-4 h-4 text-slate-500 dark:text-gray-400" />
//                         </button>
//                       </div>

//                       {/* Scrollable Filter Content */}
//                       <div className="flex-1 overflow-y-auto p-4 space-y-6">
//                         {/* Search Filter */}
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-gray-300">
//                             Search Symbols & Patterns
//                           </label>
//                           <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
//                             <input
//                               type="text"
//                               value={searchTerm}
//                               onChange={(e) => setSearchTerm(e.target.value)}
//                               placeholder="Search symbol or pattern..."
//                               className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                             />
//                           </div>
//                         </div>

//                         {/* Sector & Industry Filter - Grouped */}
//                         <div>
//                           <div className="flex items-center justify-between mb-2">
//                             <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
//                               Sector & Industry
//                             </label>
//                             <div className="flex gap-1">
//                               <button
//                                 onClick={() => {
//                                   const allSectors = Object.keys(sectorIndustryData).slice(0, 3);
//                                   setSectorFilter(allSectors);
//                                   const allIndustries = allSectors.flatMap(sector =>
//                                     sectorIndustryData[sector]?.industries || []
//                                   ).slice(0, 3);
//                                   setIndustryFilter(allIndustries);
//                                 }}
//                                 className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
//                               >
//                                 Select Top 3
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSectorFilter([]);
//                                   setIndustryFilter([]);
//                                 }}
//                                 className="text-xs text-slate-600 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors dark:text-gray-400 dark:hover:bg-gray-600"
//                               >
//                                 Clear All
//                               </button>
//                             </div>
//                           </div>

//                           <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 dark:bg-gray-700 dark:border-gray-600">
//                             {sectors.length === 0 ? (
//                               <div className="text-center py-4 text-sm text-slate-500 dark:text-gray-400">
//                                 No sectors available
//                               </div>
//                             ) : (
//                               sectors.map(sector => {
//                                 const sectorData = sectorIndustryData[sector];
//                                 const isExpanded = expandedSectors[sector];
//                                 const sectorIndustries = sectorData?.industries || [];
//                                 const isSectorSelected = sectorFilter.includes(sector);

//                                 return (
//                                   <div key={sector} className="border-b border-slate-200 last:border-b-0 dark:border-gray-600">
//                                     {/* Sector Header */}
//                                     <div className={`flex items-center justify-between p-3 ${isSectorSelected
//                                       ? 'bg-blue-50 dark:bg-blue-900/20'
//                                       : 'hover:bg-slate-100 dark:hover:bg-gray-600'
//                                       }`}>
//                                       <div className="flex items-center gap-3 flex-1">
//                                         <input
//                                           type="checkbox"
//                                           checked={isSectorSelected}
//                                           onChange={() => handleSectorChange(sector)}
//                                           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-600"
//                                         />
//                                         <div className="flex-1">
//                                           <label
//                                             className="text-sm font-medium text-slate-700 dark:text-gray-300 cursor-pointer"
//                                             onClick={() => handleSectorChange(sector)}
//                                           >
//                                             {sector}
//                                           </label>
//                                           <div className="flex items-center gap-2 mt-1">
//                                             <span className="text-xs text-slate-500 dark:text-gray-400">
//                                               {sectorData.count} patterns
//                                             </span>
//                                             {sectorIndustries.length > 0 && (
//                                               <span className="text-xs text-slate-400 dark:text-gray-500">
//                                                 • {sectorIndustries.length} industries
//                                               </span>
//                                             )}
//                                           </div>
//                                         </div>
//                                       </div>
//                                       {sectorIndustries.length > 0 && (
//                                         <button
//                                           onClick={(e) => {
//                                             e.stopPropagation();
//                                             toggleSectorExpansion(sector);
//                                           }}
//                                           className="p-1 hover:bg-slate-200 rounded transition-colors dark:hover:bg-gray-500"
//                                         >
//                                           <ChevronDown
//                                             className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''
//                                               }`}
//                                           />
//                                         </button>
//                                       )}
//                                     </div>

//                                     {/* Industries List with rounded borders */}
//                                     {isExpanded && sectorIndustries.length > 0 && (
//                                       <div className="bg-white border-t border-slate-200 dark:bg-gray-600 dark:border-gray-500">
//                                         <div className="pl-8 pr-3 py-2 space-y-1">
//                                           {sectorIndustries.map((industry, index) => (
//                                             <div
//                                               key={industry}
//                                               className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${industryFilter.includes(industry)
//                                                 ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700'
//                                                 : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500'
//                                                 } ${index === 0 ? 'rounded-t-lg' : ''
//                                                 } ${index === sectorIndustries.length - 1 ? 'rounded-b-lg' : ''
//                                                 }`}
//                                             >
//                                               <input
//                                                 type="checkbox"
//                                                 id={`industry-${sector}-${industry}`}
//                                                 checked={industryFilter.includes(industry)}
//                                                 onChange={() => handleIndustryChange(industry)}
//                                                 className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-500"
//                                               />
//                                               <label
//                                                 htmlFor={`industry-${sector}-${industry}`}
//                                                 className="text-sm text-slate-700 dark:text-gray-300 cursor-pointer flex-1"
//                                               >
//                                                 {industry}
//                                               </label>
//                                             </div>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 );
//                               })
//                             )}
//                           </div>
//                         </div>

//                         {/* Price Range Filter with Slider */}
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-gray-300">
//                             Close Price Range
//                           </label>
//                           <div className="space-y-4">
//                             {/* Slider */}
//                             <div className="px-2">
//                               <input
//                                 type="range"
//                                 min={minMaxPrices.min}
//                                 max={minMaxPrices.max}
//                                 value={priceRange.max}
//                                 onChange={(e) => handlePriceRangeChange('max', e.target.value)}
//                                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb dark:bg-gray-600"
//                                 style={{
//                                   background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((priceRange.max - minMaxPrices.min) / (minMaxPrices.max - minMaxPrices.min)) * 100}%, #e2e8f0 ${((priceRange.max - minMaxPrices.min) / (minMaxPrices.max - minMaxPrices.min)) * 100}%, #e2e8f0 100%)`
//                                 }}
//                               />
//                               <div className="flex justify-between text-xs text-slate-500 mt-2 dark:text-gray-400">
//                                 <span>₹{minMaxPrices.min.toLocaleString()}</span>
//                                 <span>₹{minMaxPrices.max.toLocaleString()}</span>
//                               </div>
//                             </div>

//                             {/* Input Fields */}
//                             <div className="grid grid-cols-2 gap-3">
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Min Price</label>
//                                 <input
//                                   type="number"
//                                   value={priceRange.min}
//                                   onChange={(e) => handlePriceRangeChange('min', e.target.value)}
//                                   placeholder="Min"
//                                   min={minMaxPrices.min}
//                                   max={priceRange.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Max Price</label>
//                                 <input
//                                   type="number"
//                                   value={priceRange.max}
//                                   onChange={(e) => handlePriceRangeChange('max', e.target.value)}
//                                   placeholder="Max"
//                                   min={priceRange.min}
//                                   max={minMaxPrices.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                             </div>

//                             {/* Selected Range Display */}
//                             <div className="text-center">
//                               <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 px-3 py-1.5 rounded-full dark:bg-blue-900/20">
//                                 ₹{priceRange.min.toLocaleString()} - ₹{priceRange.max.toLocaleString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Volume Range Filter with Slider */}
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-gray-300">
//                             Volume Per Trade
//                           </label>
//                           <div className="space-y-4">
//                             {/* Slider */}
//                             <div className="px-2">
//                               <input
//                                 type="range"
//                                 min={minMaxVolumes.min}
//                                 max={minMaxVolumes.max}
//                                 value={volumeRange.max}
//                                 onChange={(e) => handleVolumeRangeChange('max', e.target.value)}
//                                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb dark:bg-gray-600"
//                                 style={{
//                                   background: `linear-gradient(to right, #10b981 0%, #10b981 ${((volumeRange.max - minMaxVolumes.min) / (minMaxVolumes.max - minMaxVolumes.min)) * 100}%, #e2e8f0 ${((volumeRange.max - minMaxVolumes.min) / (minMaxVolumes.max - minMaxVolumes.min)) * 100}%, #e2e8f0 100%)`
//                                 }}
//                               />
//                               <div className="flex justify-between text-xs text-slate-500 mt-2 dark:text-gray-400">
//                                 <span>{minMaxVolumes.min.toLocaleString()}</span>
//                                 <span>{minMaxVolumes.max.toLocaleString()}</span>
//                               </div>
//                             </div>

//                             {/* Input Fields */}
//                             <div className="grid grid-cols-2 gap-3">
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Min Volume</label>
//                                 <input
//                                   type="number"
//                                   value={volumeRange.min}
//                                   onChange={(e) => handleVolumeRangeChange('min', e.target.value)}
//                                   placeholder="Min"
//                                   min={minMaxVolumes.min}
//                                   max={volumeRange.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Max Volume</label>
//                                 <input
//                                   type="number"
//                                   value={volumeRange.max}
//                                   onChange={(e) => handleVolumeRangeChange('max', e.target.value)}
//                                   placeholder="Max"
//                                   min={volumeRange.min}
//                                   max={minMaxVolumes.max}
//                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
//                                 />
//                               </div>
//                             </div>

//                             {/* Selected Range Display */}
//                             <div className="text-center">
//                               <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 px-3 py-1.5 rounded-full dark:bg-green-900/20">
//                                 {volumeRange.min.toLocaleString()} - {volumeRange.max.toLocaleString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Footer Actions */}
//                       <div className="border-t border-slate-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
//                         <div className="flex flex-col gap-2">
//                           <button
//                             onClick={() => {/* Filters are applied automatically */ }}
//                             className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//                           >
//                             Apply Filters
//                           </button>
//                           {hasActiveFilters && (
//                             <button
//                               onClick={clearFilters}
//                               className="flex items-center justify-center gap-1 w-full px-4 py-2 text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-700"
//                             >
//                               <X className="w-3 h-3" />
//                               Clear All Filters
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Table Content */}
//                 <div className={`${showFilters ? 'flex-1 min-w-0' : 'flex-1 max-w-7xl mx-auto'}`}>
//                   <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">

//                     <div className="bg-slate-800 px-6 py-4 dark:bg-gray-900">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h2 className="text-lg font-bold text-white flex items-center gap-2">
//                             <BarChart3 className="w-5 h-5" />
//                             Scan Results
//                           </h2>
//                           <div className="flex items-center gap-3 mt-1 text-slate-300 text-sm">
//                             <span>{filteredPatterns.length} patterns detected</span>
//                             {missingCount > 0 && (
//                               <span>• {missingCount} without price data</span>
//                             )}
//                             {hasActiveFilters && (
//                               <span>• Filtered from {detectedPatterns.length} total</span>
//                             )}
//                             <span className="bg-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
//                               Max {MAX_SELECTED_ROWS} selections
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <button
//                             onClick={() => setShowFilters(!showFilters)}
//                             className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors text-sm"
//                           >
//                             <Filter className="w-4 h-4" />
//                             {showFilters ? 'Hide Filters' : 'Show Filters'}
//                             {hasActiveFilters && (
//                               <div className="w-1.5 h-1.5 bg-red-400 rounded-full ml-1"></div>
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Section */}
//                     {selectedRows.length > 0 && (
//                       <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 dark:bg-gray-700 dark:border-gray-600">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-semibold text-slate-800 dark:text-gray-300">
//                               {selectedRows.length} pattern{selectedRows.length !== 1 ? 's' : ''} selected
//                               {selectedRows.length >= MAX_SELECTED_ROWS && (
//                                 <span className="ml-2 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
//                                   Maximum reached
//                                 </span>
//                               )}
//                             </p>
//                           </div>
//                           <button
//                             onClick={handleViewChart}
//                             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"
//                           >
//                             <div className="flex items-center gap-2">
//                               <BarChart3 className="w-4 h-4" />
//                               View Analysis
//                             </div>
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     {/* Table */}
//                     <div className="overflow-x-auto">
//                       <table className="w-full min-w-[800px]">
//                         <thead className="bg-slate-50 border-b border-slate-200 dark:bg-gray-700 dark:border-gray-600">
//                           <tr>
//                             <th className="px-4 py-3 text-left">
//                               <input
//                                 type="checkbox"
//                                 checked={isAllSelected}
//                                 onChange={handleSelectAllRows}
//                                 className="w-4 h-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
//                               />
//                             </th>
//                             <th
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('pid')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Pattern
//                                 {getSortIcon('pid')}
//                               </div>
//                             </th>
//                             <th
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('symbol')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Symbol
//                                 {getSortIcon('symbol')}
//                               </div>
//                             </th>
//                             <th
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('date')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Date
//                                 {getSortIcon('date')}
//                               </div>
//                             </th>
//                             <th
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('direction')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Direction
//                                 {getSortIcon('direction')}
//                               </div>
//                             </th>
//                             {!showFilters && (
//                               <>
//                                 <th
//                                   className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                                   onClick={() => handleSort('sector')}
//                                 >
//                                   <div className="flex items-center gap-1">
//                                     Sector
//                                     {getSortIcon('sector')}
//                                   </div>
//                                 </th>
//                                 <th
//                                   className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                                   onClick={() => handleSort('industry')}
//                                 >
//                                   <div className="flex items-center gap-1">
//                                     Industry
//                                     {getSortIcon('industry')}
//                                   </div>
//                                 </th>
//                               </>
//                             )}
//                             <th
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('closePrice')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Price
//                                 {getSortIcon('closePrice')}
//                               </div>
//                             </th>
//                             <th
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('volume')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Volume
//                                 {getSortIcon('volume')}
//                               </div>
//                             </th>
//                             <th
//                               className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
//                               onClick={() => handleSort('score')}
//                             >
//                               <div className="flex items-center gap-1">
//                                 Confidence
//                                 {getSortIcon('score')}
//                               </div>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-200 dark:divide-gray-600">
//                           {filteredPatterns.map((row, index) => (
//                             <tr
//                               key={`${row.pid}-${row.fincode}-${index}`}
//                               className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-600/50 ${selectedRows.includes(index) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
//                                 } ${selectedRows.length >= MAX_SELECTED_ROWS && !selectedRows.includes(index)
//                                   ? 'opacity-50 cursor-not-allowed'
//                                   : ''
//                                 }`}
//                               onClick={() => {
//                                 if (selectedRows.length < MAX_SELECTED_ROWS || selectedRows.includes(index)) {
//                                   handleSelectRow(index);
//                                 }
//                               }}
//                             >
//                               <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
//                                 <input
//                                   type="checkbox"
//                                   checked={selectedRows.includes(index)}
//                                   onChange={() => handleSelectRow(index)}
//                                   disabled={selectedRows.length >= MAX_SELECTED_ROWS && !selectedRows.includes(index)}
//                                   className={`w-4 h-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-600 ${selectedRows.length >= MAX_SELECTED_ROWS && !selectedRows.includes(index)
//                                     ? 'cursor-not-allowed opacity-50'
//                                     : ''
//                                     }`}
//                                 />
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="font-medium text-slate-800 dark:text-gray-100 text-sm">
//                                   {PatternRegistry.getPattern(row.pid)?.name || PatternRegistry.getPattern(row.pid)?.shortName || row.pid}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3">
//                                 <div className="font-bold text-blue-600 text-sm dark:text-blue-400">
//                                   {row.symbol}
//                                 </div>
//                               </td>
//                               <td className="px-4 py-3 text-slate-700 font-medium dark:text-gray-300 text-sm">
//                                 {row.date}
//                               </td>
//                               <td className="px-4 py-3">
//                                 <DirectionBadge direction={row.direction} />
//                               </td>
//                               {!showFilters && (
//                                 <>
//                                   <td className="px-4 py-3">
//                                     <span className="text-xs text-slate-600 dark:text-gray-400">
//                                       {row.sector}
//                                     </span>
//                                   </td>
//                                   <td className="px-4 py-3">
//                                     <span className="text-xs text-slate-600 dark:text-gray-400 max-w-[120px] truncate block">
//                                       {row.industry}
//                                     </span>
//                                   </td>
//                                 </>
//                               )}
//                               <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-300 text-sm">
//                                 {row.closePrice ? `₹${row.closePrice.toFixed(2)}` : '—'}
//                               </td>
//                               <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-300 text-sm">
//                                 {row.volume ? row.volume.toLocaleString() : '—'}
//                               </td>
//                               <td className="px-4 py-3">
//                                 <span className={`inline-flex items-center justify-center px-2 py-1 rounded font-semibold text-xs ${row.score >= 0.8
//                                   ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
//                                   : row.score >= 0.6
//                                     ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
//                                     : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
//                                   }`}>
//                                   {row.score.toFixed(2)}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>

//                       {/* Empty State */}
//                       {filteredPatterns.length === 0 && (
//                         <div className="text-center py-12">
//                           <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center dark:bg-gray-700">
//                             <BarChart3 className="w-6 h-6 text-slate-400 dark:text-gray-500" />
//                           </div>
//                           <p className="text-slate-600 font-medium dark:text-gray-400 text-sm">
//                             {hasActiveFilters ? 'No patterns match your filters' : 'No patterns detected'}
//                           </p>
//                           {hasActiveFilters && (
//                             <button
//                               onClick={clearFilters}
//                               className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm dark:text-blue-400"
//                             >
//                               Clear filters
//                             </button>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           )}

//           {/* Research Panel */}
//           {showResearchPanel && (
//             <section id="research-panel" className="mb-16">
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-slate-800 mb-2 dark:text-white">
//                   Advanced Research Panel
//                 </h2>
//                 <p className="text-slate-600 dark:text-gray-400">
//                   Comprehensive technical analysis with multi-timeframe pattern recognition
//                 </p>
//               </div>
//               {Object.entries(researchData).map(([fincode, { priceData, patterns }]) => (
//                 <div key={fincode} className="mb-8 last:mb-0">
//                   <ResearchChart fincode={fincode} priceData={priceData} patterns={patterns} />
//                 </div>
//               ))}
//             </section>
//           )}
//         </main>
//       </div>

//       {/* Add custom styles for range slider */}
//       <style jsx>{`
//         .slider-thumb::-webkit-slider-thumb {
//           appearance: none;
//           height: 18px;
//           width: 18px;
//           border-radius: 50%;
//           background: #3b82f6;
//           cursor: pointer;
//           border: 2px solid #ffffff;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//         }
        
//         .slider-thumb::-moz-range-thumb {
//           height: 18px;
//           width: 18px;
//           border-radius: 50%;
//           background: #3b82f6;
//           cursor: pointer;
//           border: 2px solid #ffffff;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//         }
        
//         .slider-thumb:focus::-webkit-slider-thumb {
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
//         }
//       `}</style>
//     </>
//   );
// }

// export default Patterns;




import { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Filter, X, ChevronDown, Search, TrendingUp as UpIcon, TrendingDown as DownIcon, Minus, BarChart3, Zap, Target, Calendar } from 'lucide-react';
import PatternGrid from './PatternGrid';
import ResearchChart from './ResearchChart';
import { PatternRegistry } from './data/patternRegistry';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Patterns() {
  const [activeView, setActiveView] = useState('category');
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [detectedPatterns, setDetectedPatterns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showResearchPanel, setShowResearchPanel] = useState(false);
  const [researchData, setResearchData] = useState({});
  const [missingCount, setMissingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter states
  const [sectorFilter, setSectorFilter] = useState([]);
  const [industryFilter, setIndustryFilter] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [volumeRange, setVolumeRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSectors, setExpandedSectors] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  // Constants
  // const API_BASE_URL = 'http://localhost:9000';
  // const API_KEY = 'answer-ur-curosity-2-3-5-7-11-13';
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const MAX_SELECTED_ROWS = 3; // Maximum 3 rows can be selected

  // Compression utility functions
  const compressData = (data) => {
    try {
      const jsonString = JSON.stringify(data);
      return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (error) {
      console.error('Compression error:', error);
      return null;
    }
  };

  const extractScore = (desc) => {
    if (!desc) return 0.0;
    const match = desc.match(/(?:confidence|score)[:\s]*([0-9]*\.?[0-9]+)/i) ||
      desc.match(/([0-9]*\.?[0-9]+)\s*\/\s*10/) ||
      desc.match(/final score[:\s]*([0-9]*\.?[0-9]+)/i);
    if (match) {
      const score = parseFloat(match[1]);
      return score > 1 ? score / 10 : score;
    }
    return 0.0;
  };


  const fetchPriceDataBatch = async (fincodes) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE}/price-action/one-year`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fincodes }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to fetch price data for batch: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error("Invalid JSON received from price data API");
      }

      if (!data || typeof data !== "object") {
        throw new Error("Price data API returned empty or invalid response");
      }

      return data;

    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Batch price API timeout");
        return null;
      }

      console.error("Error fetching batch price data:", error);
      return null;
    }
  };




  const handleScanMarket = async (patterns, days) => {
    if (patterns.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE}/patterns/scan`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pattern_ids: patterns,
          lookUp_days: days
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      let apiData;
      try {
        apiData = await response.json();
      } catch (jsonErr) {
        throw new Error("Invalid JSON returned from scan API");
      }

      if (!apiData || !apiData.data) {
        throw new Error("Invalid API response format: missing data field");
      }

      // Process the API response
      const rows = [];
      let skipped = 0;

      const responseData = apiData.data;
      const patternCount = responseData.Pattern_ID?.length || 0;


      // Safety check for response format
      if (!responseData || !responseData.FINCODE) {
        console.warn("Invalid response data format or no patterns found", responseData);
        setDetectedPatterns([]);
        setMissingCount(0);
        setLoading(false);
        return;
      }


      console.log('API Response received:', apiData);
      console.log(`Processing ${patternCount} patterns`);

      // Extract unique fincodes for batch request
      const uniqueFincodes = [...new Set(responseData.FINCODE.slice(0, patternCount))];
      console.log('Unique fincodes for batch request:', uniqueFincodes);

      // Fetch price data for all fincodes in batch
      const batchPriceData = await fetchPriceDataBatch(uniqueFincodes);
      console.log('Batch price data response:', batchPriceData);

      if (!batchPriceData || !batchPriceData.data) {
        throw new Error("Failed to load price data for patterns");
      }

      // Process each pattern in the response arrays
      for (let i = 0; i < patternCount; i++) {
        const patternId = responseData.Pattern_ID[i];
        const patternName = responseData.Pattern_Name[i];
        const fincode = responseData.FINCODE[i];
        const symbol = responseData.Symbol[i];
        const date = responseData.Created_On[i] || responseData.startDate[i] || '—';
        const description = responseData.final_interpretation[i] || '';
        const industry = responseData.Industry[i] || '—';
        const sector = responseData.Sector[i] || '—';
        const closePrice = responseData.ClosePrice[i];
        const volume = responseData.Volume_PerTrade[i];
        const structureScore = responseData.structure_score[i];
        const trendScore = responseData.trend_score[i];
        const volumeScore = responseData.volume_score[i];
        const volatilityScore = responseData.volatility_score[i];
        const finalConfidence = responseData.final_confidence[i];

        // Use final_confidence as the main score, fallback to extracted score
        const score = finalConfidence !== undefined ? finalConfidence : extractScore(description);

        // Get pattern direction from PatternRegistry
        const patternMeta = PatternRegistry.getPattern(patternId);
        const direction = patternMeta?.bias || 'neutral';

        // Get price data from batch response
        let priceData = null;
        if (batchPriceData && batchPriceData.data) {
          priceData = batchPriceData.data[fincode] || batchPriceData.data[String(fincode)];
        }

        if (!priceData) {
          console.warn(`No price data found for fincode: ${fincode}`);
          skipped++;
          continue;
        }

        rows.push({
          pid: patternId,
          fincode,
          symbol,
          date: typeof date === 'string' ? date.split('T')[0] : '—',
          score,
          description,
          industry,
          sector,
          direction,
          closePrice,
          volume,
          structureScore,
          trendScore,
          volumeScore,
          volatilityScore,
          finalConfidence,
          hasPriceData: true,
          priceData
        });
      }

      if (rows.length === 0) {
        alert('No matching patterns found with price data.');
        return;
      }

      setDetectedPatterns(rows);
      setShowTable(true);
      setSelectedRows([]); // Reset selection when new data loads
      setShowResearchPanel(false);
      setMissingCount(skipped);

      // Reset filters when new data loads
      setSectorFilter([]);
      setIndustryFilter([]);
      setPriceRange({ min: '', max: '' });
      setVolumeRange({ min: '', max: '' });
      setSearchTerm('');
      setExpandedSectors({});

      setTimeout(() => {
        document.getElementById('results-table')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      const message =
        err.name === "AbortError"
          ? "The request timed out. Please try again."
          : err.message;

      setError(`Failed to scan market: ${message}`);
      console.error("API Error:", err);

    } finally {
      setLoading(false);
    }
  };

  const handleViewChart = () => {
    if (selectedRows.length === 0) return alert('Select at least one row');

    const researchCharts = [];

    selectedRows.forEach(i => {
      const row = filteredPatterns[i];
      if (!row.hasPriceData || !row.priceData) return;

      researchCharts.push({
        fincode: row.fincode,
        priceData: row.priceData,
        patterns: [{
          date: row.date,
          patternId: row.pid,
          score: row.score
        }],
        symbol: row.symbol,
        companyName: row.symbol
      });
    });

    if (researchCharts.length === 0) return alert('No price data for selected symbols');

    // Store research data for dashboard with compression
    const researchDataForDashboard = {
      researchCharts: researchCharts,
      timestamp: Date.now()
    };

    try {
      const compressedData = compressData(researchDataForDashboard);
      if (compressedData && compressedData.length < 5 * 1024 * 1024) { // 5MB limit
        localStorage.setItem('researchChartData', compressedData);
      } else {
        throw new Error('Data too large after compression');
      }
    } catch (error) {
      console.error('Storage error:', error);
      // Store only essential data
      const essentialData = {
        symbols: researchCharts.map(chart => chart.symbol),
        patternCount: researchCharts.length,
        timestamp: Date.now()
      };
      localStorage.setItem('researchChartData', JSON.stringify(essentialData));
    }

    navigate('/researchpanel', {
      state: {
        fromPatternScanner: true,
        researchData: researchDataForDashboard
      }
    });
  };

  // Updated selection handlers with MAX_SELECTED_ROWS limit
  const handleSelectAllRows = (e) => {
    if (e.target.checked) {
      // Only select first MAX_SELECTED_ROWS
      const limitedSelection = filteredPatterns
        .slice(0, MAX_SELECTED_ROWS)
        .map((_, index) => index);
      setSelectedRows(limitedSelection);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(x => x !== index);
      } else {
        if (prev.length >= MAX_SELECTED_ROWS) {
          alert(`Maximum ${MAX_SELECTED_ROWS} patterns can be selected for analysis`);
          return prev;
        }
        return [...prev, index];
      }
    });
  };

  // Sort functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="w-3 h-3 text-slate-400 opacity-50" />;
    }
    return sortConfig.direction === 'asc'
      ? <UpIcon className="w-3 h-3 text-blue-600" />
      : <DownIcon className="w-3 h-3 text-blue-600" />;
  };

  // Calculate min and max values for sliders
  const minMaxPrices = useMemo(() => {
    if (detectedPatterns.length === 0) return { min: 0, max: 1000 };

    const prices = detectedPatterns
      .map(row => row.closePrice)
      .filter(price => price != null && !isNaN(price));

    if (prices.length === 0) return { min: 0, max: 1000 };

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [detectedPatterns]);

  const minMaxVolumes = useMemo(() => {
    if (detectedPatterns.length === 0) return { min: 0, max: 1000000 };

    const volumes = detectedPatterns
      .map(row => row.volume)
      .filter(volume => volume != null && !isNaN(volume));

    if (volumes.length === 0) return { min: 0, max: 1000000 };

    return {
      min: Math.floor(Math.min(...volumes)),
      max: Math.ceil(Math.max(...volumes))
    };
  }, [detectedPatterns]);

  // Initialize ranges when data loads
  useEffect(() => {
    if (detectedPatterns.length > 0) {
      setPriceRange({
        min: minMaxPrices.min,
        max: minMaxPrices.max
      });
      setVolumeRange({
        min: minMaxVolumes.min,
        max: minMaxVolumes.max
      });
    }
  }, [detectedPatterns.length, minMaxPrices, minMaxVolumes]);

  // Filter and sort logic
  const filteredPatterns = useMemo(() => {
    let filtered = detectedPatterns.filter(row => {
      // Search filter
      if (searchTerm && !row.symbol.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !row.pid.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Sector filter (multi-select)
      if (sectorFilter.length > 0 && !sectorFilter.includes(row.sector)) {
        return false;
      }

      // Industry filter (multi-select)
      if (industryFilter.length > 0 && !industryFilter.includes(row.industry)) {
        return false;
      }

      // Price range filter
      if (priceRange.min !== '' && row.closePrice < parseFloat(priceRange.min)) {
        return false;
      }
      if (priceRange.max !== '' && row.closePrice > parseFloat(priceRange.max)) {
        return false;
      }

      // Volume range filter
      if (volumeRange.min !== '' && row.volume < parseFloat(volumeRange.min)) {
        return false;
      }
      if (volumeRange.max !== '' && row.volume > parseFloat(volumeRange.max)) {
        return false;
      }

      return true;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle string comparison
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [detectedPatterns, searchTerm, sectorFilter, industryFilter, priceRange, volumeRange, sortConfig]);

  // Get grouped sector and industry data for filters
  const sectorIndustryData = useMemo(() => {
    const grouped = {};

    detectedPatterns.forEach(row => {
      if (!row.sector || !row.industry) return;

      if (!grouped[row.sector]) {
        grouped[row.sector] = {
          industries: new Set(),
          count: 0
        };
      }

      grouped[row.sector].industries.add(row.industry);
      grouped[row.sector].count++;
    });

    // Convert Sets to Arrays and sort
    Object.keys(grouped).forEach(sector => {
      grouped[sector].industries = [...grouped[sector].industries].filter(Boolean).sort();
    });

    return grouped;
  }, [detectedPatterns]);

  const sectors = Object.keys(sectorIndustryData).sort();

  const isAllSelected = filteredPatterns.length > 0 && selectedRows.length === Math.min(filteredPatterns.length, MAX_SELECTED_ROWS);

  const clearFilters = () => {
    setSectorFilter([]);
    setIndustryFilter([]);
    setPriceRange({
      min: minMaxPrices.min,
      max: minMaxPrices.max
    });
    setVolumeRange({
      min: minMaxVolumes.min,
      max: minMaxVolumes.max
    });
    setSearchTerm('');
    setExpandedSectors({});
  };

  const hasActiveFilters = sectorFilter.length > 0 ||
    industryFilter.length > 0 ||
    priceRange.min !== minMaxPrices.min ||
    priceRange.max !== minMaxPrices.max ||
    volumeRange.min !== minMaxVolumes.min ||
    volumeRange.max !== minMaxVolumes.max ||
    searchTerm;

  // Handle sector checkbox change with 3 limit
  const handleSectorChange = (sector) => {
    setSectorFilter(prev => {
      if (prev.includes(sector)) {
        return prev.filter(s => s !== sector);
      } else {
        if (prev.length >= 3) {
          alert('You can select maximum 3 sectors');
          return prev;
        }
        return [...prev, sector];
      }
    });
  };

  // Handle industry checkbox change with 3 limit
  const handleIndustryChange = (industry) => {
    setIndustryFilter(prev => {
      if (prev.includes(industry)) {
        return prev.filter(i => i !== industry);
      } else {
        if (prev.length >= 3) {
          alert('You can select maximum 3 industries');
          return prev;
        }
        return [...prev, industry];
      }
    });
  };

  // Toggle sector expansion
  const toggleSectorExpansion = (sector) => {
    setExpandedSectors(prev => ({
      ...prev,
      [sector]: !prev[sector]
    }));
  };

  // Select all industries in a sector with 3 limit
  const selectAllIndustriesInSector = (sector) => {
    const industries = sectorIndustryData[sector]?.industries || [];
    const currentCount = industryFilter.length;
    const availableSlots = 3 - currentCount;

    if (availableSlots <= 0) {
      alert('You can select maximum 3 industries');
      return;
    }

    const industriesToAdd = industries.slice(0, availableSlots);

    setIndustryFilter(prev => {
      const newIndustries = [...prev];
      industriesToAdd.forEach(industry => {
        if (!newIndustries.includes(industry)) {
          newIndustries.push(industry);
        }
      });
      return newIndustries;
    });
  };

  // Clear all industries in a sector
  const clearAllIndustriesInSector = (sector) => {
    const industries = sectorIndustryData[sector]?.industries || [];
    setIndustryFilter(prev => prev.filter(industry => !industries.includes(industry)));
  };

  // Handle price range changes
  const handlePriceRangeChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value === '' ? '' : parseFloat(value)
    }));
  };

  // Handle volume range changes
  const handleVolumeRangeChange = (type, value) => {
    setVolumeRange(prev => ({
      ...prev,
      [type]: value === '' ? '' : parseFloat(value)
    }));
  };

  // Direction display component
  const DirectionBadge = ({ direction }) => {
    const getDirectionConfig = (dir) => {
      switch (dir) {
        case 'bullish':
          return {
            icon: <UpIcon className="w-3 h-3" />,
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700',
            borderColor: 'border-emerald-200',
            dotColor: 'bg-emerald-500'
          };
        case 'bearish':
          return {
            icon: <DownIcon className="w-3 h-3" />,
            bgColor: 'bg-rose-50',
            textColor: 'text-rose-700',
            borderColor: 'border-rose-200',
            dotColor: 'bg-rose-500'
          };
        default:
          return {
            icon: <Minus className="w-3 h-3" />,
            bgColor: 'bg-slate-50',
            textColor: 'text-slate-700',
            borderColor: 'border-slate-200',
            dotColor: 'bg-slate-500'
          };
      }
    };

    const config = getDirectionConfig(direction);

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
        <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
        <span className="text-sm font-medium capitalize">{direction}</span>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Market Patterns – Technical Pattern Recognition & Trend Signals | CMDA
        </title>
        <meta
          name="description"
          content="Identify market patterns with CMDA’s advanced pattern recognition engine. Track trend signals, 
chart formations, and technical insights with real-time data analytics."
        />
        <meta
          name="keywords"
          content="market patterns, technical pattern recognition, trend signals, chart patterns, candlestick patterns, trading patterns, technical analysis, pattern detection, real-time market patterns, CMDA patterns, stock trend analysis, chart formations, market trend signals, technical insights, price pattern analysis, automated pattern recognition"
        />
        <meta property="og:title" content="Patterns | CMDA Hub" />
        <meta
          property="og:description"
          content="Get powerful equity insights with CMDA Hub — your trusted source for real-time stock data, performance analytics, and expert market intelligence."
        />
        <meta property="og:url" content="https://cmdahub.com/patterns" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CMDA Hub" />
        <link rel="canonical" href="https://cmdahub.com/patterns" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 dark:bg-gray-800/80 dark:border-gray-700">
          <div className="max-w-9xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-gradient-to-br from-sky-600 via-cyan-600 to-sky-700 rounded-2xl shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
                    Candle Pattern Scanner
                  </h1>
                  <p className="text-slate-600 mt-1 font-medium dark:text-slate-400">Advanced candlestick pattern detection</p>

                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Real-time Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="max-w-9xl mx-auto px-8 pt-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-red-800 font-medium dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="top-20 z-40 bg-white/60 backdrop-blur-md border-b border-slate-200/60 dark:bg-gray-800/60 dark:border-gray-700">
          <div className="max-w-2xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 dark:bg-gray-700">
                {[{ id: 'category', label: 'By Category', icon: Filter }, { id: 'bias', label: 'By Market Bias', icon: Target }].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${activeView === v.id
                      ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm dark:bg-gray-600 dark:text-white'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600/50'
                      }`}
                  >
                    <v.icon className="w-4 h-4" />
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-9xl mx-auto px-8 py-8">
          {/* Pattern Grid Section */}
          <section className="mb-12">
            <PatternGrid
              viewType={activeView}
              selectedPatterns={selectedPatterns}
              onPatternSelect={setSelectedPatterns}
              onScanMarket={handleScanMarket}
              loading={loading}
            />
          </section>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-sky-200 rounded-full animate-spin dark:border-blue-800"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 border-4 border-sky-600 rounded-full animate-ping dark:border-blue-400"></div>
                </div>
              </div>
              <p className="mt-6 text-slate-600 font-medium dark:text-gray-300">Scanning market for patterns...</p>
              <p className="text-slate-500 text-sm mt-2 dark:text-gray-400">Analyzing real-time data across multiple timeframes</p>
            </div>
          )}

          {/* Results Table */}
          {showTable && (
            <section id="results-table" className="mb-16">
              <div className="flex gap-6">
                {/* Enhanced Filters Sidebar */}
                {showFilters && (
                  <div className="w-80 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 dark:bg-gray-800 dark:border-gray-700 h-[calc(100vh-12rem)] sticky top-28 flex flex-col overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                          <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Max 3
                          </span>
                        </div>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                        </button>
                      </div>

                      {/* Scrollable Filter Content */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Search Filter */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-gray-300">
                            Search Symbols & Patterns
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search symbol or pattern..."
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Sector & Industry Filter - Grouped */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                              Sector & Industry
                            </label>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  const allSectors = Object.keys(sectorIndustryData).slice(0, 3);
                                  setSectorFilter(allSectors);
                                  const allIndustries = allSectors.flatMap(sector =>
                                    sectorIndustryData[sector]?.industries || []
                                  ).slice(0, 3);
                                  setIndustryFilter(allIndustries);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                              >
                                Select Top 3
                              </button>
                              <button
                                onClick={() => {
                                  setSectorFilter([]);
                                  setIndustryFilter([]);
                                }}
                                className="text-xs text-slate-600 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors dark:text-gray-400 dark:hover:bg-gray-600"
                              >
                                Clear All
                              </button>
                            </div>
                          </div>

                          <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 dark:bg-gray-700 dark:border-gray-600">
                            {sectors.length === 0 ? (
                              <div className="text-center py-4 text-sm text-slate-500 dark:text-gray-400">
                                No sectors available
                              </div>
                            ) : (
                              sectors.map(sector => {
                                const sectorData = sectorIndustryData[sector];
                                const isExpanded = expandedSectors[sector];
                                const sectorIndustries = sectorData?.industries || [];
                                const isSectorSelected = sectorFilter.includes(sector);

                                return (
                                  <div key={sector} className="border-b border-slate-200 last:border-b-0 dark:border-gray-600">
                                    {/* Sector Header */}
                                    <div className={`flex items-center justify-between p-3 ${isSectorSelected
                                      ? 'bg-blue-50 dark:bg-blue-900/20'
                                      : 'hover:bg-slate-100 dark:hover:bg-gray-600'
                                      }`}>
                                      <div className="flex items-center gap-3 flex-1">
                                        <input
                                          type="checkbox"
                                          checked={isSectorSelected}
                                          onChange={() => handleSectorChange(sector)}
                                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-600"
                                        />
                                        <div className="flex-1">
                                          <label
                                            className="text-sm font-medium text-slate-700 dark:text-gray-300 cursor-pointer"
                                            onClick={() => handleSectorChange(sector)}
                                          >
                                            {sector}
                                          </label>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500 dark:text-gray-400">
                                              {sectorData.count} patterns
                                            </span>
                                            {sectorIndustries.length > 0 && (
                                              <span className="text-xs text-slate-400 dark:text-gray-500">
                                                • {sectorIndustries.length} industries
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {sectorIndustries.length > 0 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSectorExpansion(sector);
                                          }}
                                          className="p-1 hover:bg-slate-200 rounded transition-colors dark:hover:bg-gray-500"
                                        >
                                          <ChevronDown
                                            className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''
                                              }`}
                                          />
                                        </button>
                                      )}
                                    </div>

                                    {/* Industries List with rounded borders */}
                                    {isExpanded && sectorIndustries.length > 0 && (
                                      <div className="bg-white border-t border-slate-200 dark:bg-gray-600 dark:border-gray-500">
                                        <div className="pl-8 pr-3 py-2 space-y-1">
                                          {sectorIndustries.map((industry, index) => (
                                            <div
                                              key={industry}
                                              className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${industryFilter.includes(industry)
                                                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700'
                                                : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500'
                                                } ${index === 0 ? 'rounded-t-lg' : ''
                                                } ${index === sectorIndustries.length - 1 ? 'rounded-b-lg' : ''
                                                }`}
                                            >
                                              <input
                                                type="checkbox"
                                                id={`industry-${sector}-${industry}`}
                                                checked={industryFilter.includes(industry)}
                                                onChange={() => handleIndustryChange(industry)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-500"
                                              />
                                              <label
                                                htmlFor={`industry-${sector}-${industry}`}
                                                className="text-sm text-slate-700 dark:text-gray-300 cursor-pointer flex-1"
                                              >
                                                {industry}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Price Range Filter with Slider */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-gray-300">
                            Close Price Range
                          </label>
                          <div className="space-y-4">
                            {/* Slider */}
                            <div className="px-2">
                              <input
                                type="range"
                                min={minMaxPrices.min}
                                max={minMaxPrices.max}
                                value={priceRange.max}
                                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb dark:bg-gray-600"
                                style={{
                                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((priceRange.max - minMaxPrices.min) / (minMaxPrices.max - minMaxPrices.min)) * 100}%, #e2e8f0 ${((priceRange.max - minMaxPrices.min) / (minMaxPrices.max - minMaxPrices.min)) * 100}%, #e2e8f0 100%)`
                                }}
                              />
                              <div className="flex justify-between text-xs text-slate-500 mt-2 dark:text-gray-400">
                                <span>₹{minMaxPrices.min.toLocaleString()}</span>
                                <span>₹{minMaxPrices.max.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Input Fields */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Min Price</label>
                                <input
                                  type="number"
                                  value={priceRange.min}
                                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                                  placeholder="Min"
                                  min={minMaxPrices.min}
                                  max={priceRange.max}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Max Price</label>
                                <input
                                  type="number"
                                  value={priceRange.max}
                                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                                  placeholder="Max"
                                  min={priceRange.min}
                                  max={minMaxPrices.max}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                />
                              </div>
                            </div>

                            {/* Selected Range Display */}
                            <div className="text-center">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 px-3 py-1.5 rounded-full dark:bg-blue-900/20">
                                ₹{priceRange.min.toLocaleString()} - ₹{priceRange.max.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Volume Range Filter with Slider */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-3 dark:text-gray-300">
                            Volume Per Trade
                          </label>
                          <div className="space-y-4">
                            {/* Slider */}
                            <div className="px-2">
                              <input
                                type="range"
                                min={minMaxVolumes.min}
                                max={minMaxVolumes.max}
                                value={volumeRange.max}
                                onChange={(e) => handleVolumeRangeChange('max', e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb dark:bg-gray-600"
                                style={{
                                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((volumeRange.max - minMaxVolumes.min) / (minMaxVolumes.max - minMaxVolumes.min)) * 100}%, #e2e8f0 ${((volumeRange.max - minMaxVolumes.min) / (minMaxVolumes.max - minMaxVolumes.min)) * 100}%, #e2e8f0 100%)`
                                }}
                              />
                              <div className="flex justify-between text-xs text-slate-500 mt-2 dark:text-gray-400">
                                <span>{minMaxVolumes.min.toLocaleString()}</span>
                                <span>{minMaxVolumes.max.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Input Fields */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Min Volume</label>
                                <input
                                  type="number"
                                  value={volumeRange.min}
                                  onChange={(e) => handleVolumeRangeChange('min', e.target.value)}
                                  placeholder="Min"
                                  min={minMaxVolumes.min}
                                  max={volumeRange.max}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1 dark:text-gray-400">Max Volume</label>
                                <input
                                  type="number"
                                  value={volumeRange.max}
                                  onChange={(e) => handleVolumeRangeChange('max', e.target.value)}
                                  placeholder="Max"
                                  min={volumeRange.min}
                                  max={minMaxVolumes.max}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                />
                              </div>
                            </div>

                            {/* Selected Range Display */}
                            <div className="text-center">
                              <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 px-3 py-1.5 rounded-full dark:bg-green-900/20">
                                {volumeRange.min.toLocaleString()} - {volumeRange.max.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="border-t border-slate-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {/* Filters are applied automatically */ }}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                          >
                            Apply Filters
                          </button>
                          {hasActiveFilters && (
                            <button
                              onClick={clearFilters}
                              className="flex items-center justify-center gap-1 w-full px-4 py-2 text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                              <X className="w-3 h-3" />
                              Clear All Filters
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Table Content */}
                <div className={`${showFilters ? 'flex-1 min-w-0' : 'flex-1 max-w-7xl mx-auto'}`}>
                  <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">

                    <div className="bg-slate-800 px-6 py-4 dark:bg-gray-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Scan Results
                          </h2>
                          <div className="flex items-center gap-3 mt-1 text-slate-300 text-sm">
                            <span>{filteredPatterns.length} patterns detected</span>
                            {missingCount > 0 && (
                              <span>• {missingCount} without price data</span>
                            )}
                            {hasActiveFilters && (
                              <span>• Filtered from {detectedPatterns.length} total</span>
                            )}
                            <span className="bg-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                              Max {MAX_SELECTED_ROWS} selections
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors text-sm"
                          >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                            {hasActiveFilters && (
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full ml-1"></div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Section */}
                    {selectedRows.length > 0 && (
                      <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 dark:bg-gray-700 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-gray-300">
                              {selectedRows.length} pattern{selectedRows.length !== 1 ? 's' : ''} selected
                              {selectedRows.length >= MAX_SELECTED_ROWS && (
                                <span className="ml-2 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                  Maximum reached
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={handleViewChart}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              View Analysis
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[800px]">
                        <thead className="bg-slate-50 border-b border-slate-200 dark:bg-gray-700 dark:border-gray-600">
                          <tr>
                            <th className="px-4 py-3 text-left">
                              <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={handleSelectAllRows}
                                className="w-4 h-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-600"
                              />
                            </th>
                            <th
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                              onClick={() => handleSort('pid')}
                            >
                              <div className="flex items-center gap-1">
                                Pattern
                                {getSortIcon('pid')}
                              </div>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                              onClick={() => handleSort('symbol')}
                            >
                              <div className="flex items-center gap-1">
                                Symbol
                                {getSortIcon('symbol')}
                              </div>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                              onClick={() => handleSort('date')}
                            >
                              <div className="flex items-center gap-1">
                                Date
                                {getSortIcon('date')}
                              </div>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                              onClick={() => handleSort('direction')}
                            >
                              <div className="flex items-center gap-1">
                                Direction
                                {getSortIcon('direction')}
                              </div>
                            </th>
                            {!showFilters && (
                              <>
                                <th
                                  className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                                  onClick={() => handleSort('sector')}
                                >
                                  <div className="flex items-center gap-1">
                                    Sector
                                    {getSortIcon('sector')}
                                  </div>
                                </th>
                                <th
                                  className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                                  onClick={() => handleSort('industry')}
                                >
                                  <div className="flex items-center gap-1">
                                    Industry
                                    {getSortIcon('industry')}
                                  </div>
                                </th>
                              </>
                            )}
                            <th
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                              onClick={() => handleSort('closePrice')}
                            >
                              <div className="flex items-center gap-1">
                                Price
                                {getSortIcon('closePrice')}
                              </div>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                              onClick={() => handleSort('volume')}
                            >
                              <div className="flex items-center gap-1">
                                Volume
                                {getSortIcon('volume')}
                              </div>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-300 cursor-pointer"
                              onClick={() => handleSort('score')}
                            >
                              <div className="flex items-center gap-1">
                                Confidence
                                {getSortIcon('score')}
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-gray-600">
                          {filteredPatterns.map((row, index) => (
                            <tr
                              key={`${row.pid}-${row.fincode}-${index}`}
                              className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-600/50 ${selectedRows.includes(index) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                } ${selectedRows.length >= MAX_SELECTED_ROWS && !selectedRows.includes(index)
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                                }`}
                              onClick={() => {
                                if (selectedRows.length < MAX_SELECTED_ROWS || selectedRows.includes(index)) {
                                  handleSelectRow(index);
                                }
                              }}
                            >
                              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(index)}
                                  onChange={() => handleSelectRow(index)}
                                  disabled={selectedRows.length >= MAX_SELECTED_ROWS && !selectedRows.includes(index)}
                                  className={`w-4 h-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-600 ${selectedRows.length >= MAX_SELECTED_ROWS && !selectedRows.includes(index)
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                                    }`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-slate-800 dark:text-gray-100 text-sm">
                                  {PatternRegistry.getPattern(row.pid)?.name || PatternRegistry.getPattern(row.pid)?.shortName || row.pid}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-blue-600 text-sm dark:text-blue-400">
                                  {row.symbol}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-700 font-medium dark:text-gray-300 text-sm">
                                {row.date}
                              </td>
                              <td className="px-4 py-3">
                                <DirectionBadge direction={row.direction} />
                              </td>
                              {!showFilters && (
                                <>
                                  <td className="px-4 py-3">
                                    <span className="text-xs text-slate-600 dark:text-gray-400">
                                      {row.sector}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="text-xs text-slate-600 dark:text-gray-400 max-w-[120px] truncate block">
                                      {row.industry}
                                    </span>
                                  </td>
                                </>
                              )}
                              <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-300 text-sm">
                                {row.closePrice ? `₹${row.closePrice.toFixed(2)}` : '—'}
                              </td>
                              <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-300 text-sm">
                                {row.volume ? row.volume.toLocaleString() : '—'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center justify-center px-2 py-1 rounded font-semibold text-xs ${row.score >= 0.8
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                  : row.score >= 0.6
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                                  }`}>
                                  {row.score.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Empty State */}
                      {filteredPatterns.length === 0 && (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center dark:bg-gray-700">
                            <BarChart3 className="w-6 h-6 text-slate-400 dark:text-gray-500" />
                          </div>
                          <p className="text-slate-600 font-medium dark:text-gray-400 text-sm">
                            {hasActiveFilters ? 'No patterns match your filters' : 'No patterns detected'}
                          </p>
                          {hasActiveFilters && (
                            <button
                              onClick={clearFilters}
                              className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm dark:text-blue-400"
                            >
                              Clear filters
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Research Panel */}
          {showResearchPanel && (
            <section id="research-panel" className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 dark:text-white">
                  Advanced Research Panel
                </h2>
                <p className="text-slate-600 dark:text-gray-400">
                  Comprehensive technical analysis with multi-timeframe pattern recognition
                </p>
              </div>
              {Object.entries(researchData).map(([fincode, { priceData, patterns }]) => (
                <div key={fincode} className="mb-8 last:mb-0">
                  <ResearchChart fincode={fincode} priceData={priceData} patterns={patterns} />
                </div>
              ))}
            </section>
          )}
        </main>
      </div>

      {/* Add custom styles for range slider */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </>
  );
}

export default Patterns;