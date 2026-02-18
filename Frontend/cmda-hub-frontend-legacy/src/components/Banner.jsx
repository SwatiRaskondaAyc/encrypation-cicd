




import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Sparkles, TrendingUp, BarChart2, PieChart, Factory, FlaskConical, DollarSign, Car, Code,
  HeartPulse, Scissors, ShoppingBag, Building2, Hammer, Wheat, Ship, Briefcase, Battery,
  Cpu, Droplets, Home, Banknote, Smartphone, Plane, Utensils, Zap, Recycle, Trees, Radio,
  Globe2, Microscope, Film, Beaker, Wrench, Shield, Truck, Satellite, Package, Server, Coins, BookOpen,
  ArrowRight, X
} from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import IndustryDividendModal from './Indice/IndustryDividendModal';

const Banner = ({ onIndustrySelect }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedIndustry, setHighlightedIndustry] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  // Industry icons mapping
  const industryIcons = {
    "Pharmaceuticals & Drugs": HeartPulse,
    "Refineries": Factory,
    "Chemicals": FlaskConical,
    "Finance - NBFC": DollarSign,
    "Automobiles - Passenger Cars": Car,
    "IT - Software": Code,
    "Healthcare": HeartPulse,
    "Textile": Scissors,
    "Household & Personal Products": ShoppingBag,
    "Cement & Construction Materials": Building2,
    "Auto Ancillary": Hammer,
    "Electrodes & Welding Equipment": Hammer,
    "Pesticides & Agrochemicals": Wheat,
    "Shipping": Ship,
    "Finance - Investment": Banknote,
    "Insurance": Shield,
    "Telecom": Radio,
    "Media & Entertainment": Film,
    "Education": BookOpen,
    "Energy": Zap,
    "Power Generation & Distribution": Battery,
    "Diesel Engines": Droplets,
    "Aviation": Plane,
    "Hospitality": Utensils,
    "Real Estate": Home,
    "Automobile Two & Three Wheelers": Truck,
    "Defence": Shield,
    "Mining": Hammer,
    "Electric Equipment": Cpu,
    "Electronics": Smartphone,
    "Environment & Sustainability": Recycle,
    "Forestry & Paper": Trees,
    "Research & Development": Microscope,
    "Global Trade": Globe2,
    "Logistics": Package,
    "Engineering - Industrial Equipments": Server,
    "Finance - Asset Management": Coins,
    "Construction": Wrench,
    "Aerospace": Satellite,
    "Consulting": Briefcase,
  };

  // Parse dividend bracket
  const parseDividendBracket = (bracket) => {
    if (!bracket || typeof bracket !== 'string') return 0;
    const cleaned = bracket.replace(/[()[\]]/g, '').replace(/\s+/g, '');
    const parts = cleaned.split(',').map(Number);
    if (parts.length < 2) return 0;
    return (parts[0] + parts[1]) / 2;
  };

  // Get green shade based on intensity
  const getGreenShade = (intensity) => {
    if (intensity === 0) return "rgb(212,244,226)";
    const normalizedIntensity = Math.min(1, Math.max(0, intensity));
    const r = Math.round(212 - (212 - 6) * normalizedIntensity);
    const g = Math.round(244 - (244 - 95) * normalizedIntensity);
    const b = Math.round(226 - (226 - 70) * normalizedIntensity);
    return `rgb(${r},${g},${b})`;
  };

  // Format dividend bracket for display
  const formatDividendBracket = (bracket) => {
    if (!bracket || typeof bracket !== "string") return "N/A";

    let cleaned = bracket.replace(/[()[\]]/g, "").replace(/\s+/g, "");

    if (cleaned.endsWith("+")) {
      const num = parseFloat(cleaned.replace("+", ""));
      return isNaN(num) ? "N/A" : `${(num * 100).toFixed(2)}%+`;
    }

    const parts = cleaned.split(/[-,]/).map(n => parseFloat(n)).filter(n => !isNaN(n));

    if (parts.length === 2) {
      return `${(parts[0] * 100).toFixed(2)}% - ${(parts[1] * 100).toFixed(2)}%`;
    }

    if (parts.length === 1) {
      return `${(parts[0] * 100).toFixed(2)}%`;
    }

    return "N/A";
  };

  // Handle industry selection
  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    
    // Map the detailed industry name to common industry name for the IndustryDividend component
    const industryMapping = {
      "Pharmaceuticals & Drugs": "Pharmaceuticals",
      "Automobiles - Passenger Cars": "Automobile",
      "IT - Software": "IT",
      "Finance - NBFC": "Banking",
      "Finance - Investment": "Banking",
      "Finance - Asset Management": "Banking",
      "Cement & Construction Materials": "Cement",
      "Household & Personal Products": "FMCG",
      "Oil & Gas": "Oil & Gas",
      "Real Estate": "Real Estate",
      "Chemicals": "Chemicals",
      "Power Generation & Distribution": "Power",
      "Textile": "Textiles",
      "Aviation": "Aviation",
      "Retail": "Retail",
      "Insurance": "Insurance",
      "Telecom": "Telecom",
      "Auto Ancillary": "Bearings",
      "Steel": "Steel"
    };

    // Find the matching common industry or use the first part of the industry name
    let commonIndustry = industryMapping[industry.industry];
    if (!commonIndustry) {
      // Fallback: use the first word of the industry name
      commonIndustry = industry.industry.split(' ')[0];
    }

    // Notify parent component about the industry selection
    if (onIndustrySelect) {
      onIndustrySelect(commonIndustry);
    }
  };

  // Handle view more click - open modal
  const handleViewMore = () => {
    setShowIndustryModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowIndustryModal(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (showIndustryModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showIndustryModal]);

  // Detect dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Fetch industry data
  useEffect(() => {
    const controller = new AbortController();
    const cacheDuration = 60 * 60 * 1000; // 1 hour

    const fetchIndustries = async () => {
      try {
        setLoading(true);
        setError(null);
        setIndustries([]);

        const cachedData = localStorage.getItem('industryDividendData');
        const cacheTimestamp = localStorage.getItem('industryDividendDataTimestamp');
        let validIndustries = [];

        if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
          const parsedData = JSON.parse(cachedData);
          validIndustries = parsedData.data
            .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
            .map((industry) => ({
              ...industry,
              bracketAvg: parseDividendBracket(industry.DividendBracket),
            }));
        } else {
          const response = await axios.get(`${API_BASE}/landpage/industry-dividend-yield`, { signal: controller.signal });
          if (response.data.status !== 'success' || !Array.isArray(response.data.data)) {
            throw new Error(response.data.message || 'API response is not valid');
          }
          validIndustries = response.data.data
            .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
            .map((industry) => ({
              ...industry,
              bracketAvg: parseDividendBracket(industry.DividendBracket),
            }));
          localStorage.setItem('industryDividendData', JSON.stringify(response.data));
          localStorage.setItem('industryDividendDataTimestamp', Date.now().toString());
        }

        if (validIndustries.length === 0) {
          setIndustries([]);
          setSelectedIndustry(null);
          setLoading(false);
          return;
        }

        setIndustries(validIndustries.slice(0, 25));
        if (validIndustries.length > 0) {
          const firstIndustry = validIndustries[0];
          setSelectedIndustry(firstIndustry);
          // Auto-select the first industry when data loads
          handleIndustrySelect(firstIndustry);
        } else {
          setSelectedIndustry(null);
        }
        setLoading(false);
      } catch (error) {
        if (error.name === 'AbortError') return;
        setError(error.message || 'Failed to fetch industry data');
        setIndustries([]);
        setSelectedIndustry(null);
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => fetchIndustries(), 100);
    return () => {
      controller.abort();
      clearTimeout(debounceFetch);
    };
  }, []);

  // Format numbers for display
  const formatNumber = useCallback((num) => {
    if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}cr`;
    if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: 2 })}L`;
    return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
  }, []);

  // Calculate max bracket average
  const maxBracketAvg = useMemo(() => {
    if (industries.length === 0) return 1;
    const max = Math.max(...industries.map((industry) => industry.bracketAvg || 0));
    return max > 0 ? max : 1;
  }, [industries]);

  // Prepare heatmap data
  const heatmapData = useMemo(() => {
    if (!Array.isArray(industries) || industries.length === 0) return [];
    return industries.map((industry, index) => ({
      ...industry,
      intensity: industry.bracketAvg / maxBracketAvg,
      index,
    }));
  }, [industries, maxBracketAvg]);

  return (
    <>
      <div className="relative px-4 py-8 sm:py-12 lg:py-16 flex items-center justify-center">
        <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start justify-between gap-2 lg:gap-10 z-10">

          {/* Left Section: Title and Selected Industry Card */}
          <div className="w-full lg:w-1/2 text-gray-800 dark:text-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start text-sky-600 dark:text-indigo-300 text-sm font-medium mb-1">
                <div className="flex items-center bg-sky-100 dark:bg-indigo-900/30 px-3 rounded-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Advanced Analytics Platform</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight">
                Capital Market{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300">
                  Data Analytics
                </span>
                <span className="ml-2 align-middle inline-block -rotate-6 bg-white text-sky-600 dark:bg-slate-800 font-semibold text-xs sm:text-sm px-2 py-1 rounded-md border border-sky-300 dark:border-sky-600 shadow-sm">
                  BETA
                </span>
              </h1>

              <div className="sm:mt-4 min-h-[80px] flex items-center justify-center lg:justify-start">
                <p className="text-lg sm:text-l text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  <Typewriter
                    words={[
                      'Ratan Tata - "I do not believe in taking right decisions, I take decisions and then make them RIGHT."',
                      'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
                      'Charlie Munger - "People calculate too much and think too little"',
                      'Mentor - "Value of money is determined by how it protects against uncertainties"',
                      'Charlie Munger - "Big money is in waiting when to buy and when to sell"',
                    ]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={60}
                    deleteSpeed={30}
                    delaySpeed={1500}
                  />
                </p>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  className="mt-9 w-full max-w-md mx-auto lg:mx-0 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="animate-pulse space-y-5">
                    <div className="w-12 h-12 mx-auto bg-gray-500 dark:bg-gray-700 rounded-xl" />
                    <div className="space-y-3">
                      <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
                      <div className="w-1/2 h-3 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 space-y-2"
                        >
                          <div className="w-1/2 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          <div className="w-3/4 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : !selectedIndustry || industries.length === 0 ? (
                <motion.div
                  key="no-data"
                  className="mt-8 w-full max-w-md mx-auto lg:mx-0 text-center rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm font-medium">
                    No industry data available
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Retry
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="data"
                  className="mt-8 w-full max-w-md mx-auto lg:mx-0 relative rounded-2xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-slate-300 via-blue-50/30 to-slate-100 dark:from-gray-800 dark:via-slate-800/60 dark:to-gray-900 shadow-xl p-6 sm:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-7 right-5">
                    <motion.button
                      onClick={handleViewMore}
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

                  <div className="flex items-center gap-4 mb-6 mt-6 sm:mt-8">
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                      style={{
                        backgroundColor: getGreenShade(selectedIndustry.intensity || 0),
                      }}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 12 }}
                    >
                      {industryIcons[selectedIndustry.industry] ? (
                        React.createElement(industryIcons[selectedIndustry.industry], {
                          className: 'w-6 h-6',
                          strokeWidth: 1.5,
                          color: isDark ? '#222' : '#374151',
                        })
                      ) : (
                        <PieChart className="w-6 h-6" strokeWidth={1.5} color="#374151" />
                      )}
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {selectedIndustry.industry}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Industry dividend overview
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-300 dark:bg-gray-800 p-2 rounded-xl">
                    {[
                      {
                        title: 'Dividend Range',
                        icon: BarChart2,
                        color: 'from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800',
                        value: formatDividendBracket(selectedIndustry.DividendBracket),
                      },
                      {
                        title: 'Avg Dividend Yield',
                        icon: PieChart,
                        color: 'from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800',
                        value: `${(selectedIndustry.AvgDividendYield * 100).toFixed(2)}%`,
                      },
                      {
                        title: 'Range Frequency',
                        icon: TrendingUp,
                        color: 'from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800',
                        value: selectedIndustry.CountInBracket,
                      },
                      {
                        title: 'Company Count',
                        icon: BarChart2,
                        color: 'from-sky-50 to-purple-100 dark:from-gray-700 dark:to-gray-800',
                        value: selectedIndustry.CompanyCount,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`bg-gradient-to-br ${item.color} p-4 rounded-xl border border-gray-200/50 dark:border-gray-600`}
                      >
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
                          <item.icon className="w-4 h-4 opacity-70" />
                          {item.title}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Section: Heatmap */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0" data-tour="home-hero">
            {error ? (
              <div className="text-center px-6 py-8 text-gray-600 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                Could not load industry visualization: {error}
              </div>
            ) : loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-pulse">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg h-20 sm:h-24"
                    style={{ backgroundColor: getGreenShade(0.5) }}
                  ></div>
                ))}
              </div>
            ) : heatmapData.length === 0 ? (
              <div className="text-center px-6 py-8 text-gray-500 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                No industry data available
              </div>
            ) : (
              <div className="relative w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
                  {heatmapData.map((industry, index) => (
                    <motion.div
                      key={industry.industry}
                      className={`relative rounded-md cursor-pointer flex items-center justify-center p-2 sm:p-3 bg-opacity-90 shadow-sm hover:shadow-md transition-all duration-200 min-h-[90px] sm:min-h-[100px] border-2 ${
                        selectedIndustry?.industry === industry.industry
                          ? 'border-sky-500 dark:border-sky-400 shadow-lg ring-2 ring-sky-200 dark:ring-sky-800'
                          : 'border-transparent'
                      }`}
                      style={{
                        backgroundColor: getGreenShade(industry.intensity),
                      }}
                      whileHover={{
                        scale: 1.04,
                        y: -6,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        transition: {
                          type: "tween",
                          ease: "easeOut",
                          duration: 0.08
                        }
                      }}
                      whileTap={{
                        scale: 0.98,
                        transition: { type: "spring", stiffness: 600, damping: 30 }
                      }}
                      animate={{
                        borderColor: selectedIndustry?.industry === industry.industry ? 'rgba(25, 52, 65, 1)' : 'transparent',
                        boxShadow: selectedIndustry?.industry === industry.industry ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        borderColor: { duration: 0.2 },
                        boxShadow: { duration: 0.2 }
                      }}
                      onClick={() => handleIndustrySelect(industry)}
                      onMouseEnter={() => setHighlightedIndustry(index)}
                      onMouseLeave={() => setHighlightedIndustry(null)}
                    >
                      <div className="flex flex-col items-center justify-center text-center w-full space-y-1">
                        {industryIcons[industry.industry] ? (
                          React.createElement(industryIcons[industry.industry], {
                            className: 'w-4 h-4 sm:w-5 sm:h-5 mb-1',
                            strokeWidth: 1.5,
                            color: industry.intensity > 0.7 ? '#ffffff' : (isDark ? '#000000' : '#374151'),
                          })
                        ) : (
                          <PieChart
                            className="w-4 h-4 sm:w-5 sm:h-5 mb-1"
                            strokeWidth={1.5}
                            color={industry.intensity > 0.7 ? '#ffffff' : (isDark ? '#000000' : '#374151')}
                          />
                        )}

                        <p
                          className={`text-[10px] sm:text-xs font-medium leading-tight w-full break-words line-clamp-2 ${
                            industry.intensity > 0.7 ? 'text-white' : 'text-gray-900'
                          }`}
                          style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                          }}
                        >
                          {industry.industry}
                        </p>

                        <p className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${
                          industry.intensity > 0.7 ? 'text-white' : 'text-gray-700'
                        }`}>
                          {formatDividendBracket(industry.DividendBracket)}
                        </p>
                      </div>

                      {highlightedIndustry === index && (
                        <div className="absolute z-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md text-xs -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{industry.industry}</p>
                          <p className="text-gray-600 dark:text-gray-300">
                            Dividend Bracket Avg: {(industry.bracketAvg * 100).toFixed(2)}%
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col items-center">
                  <div className="mt-2 flex flex-col items-center">
                    <p className="text-sm text-sky-600 dark:text-sky-300 font-medium mb-2">
                      Dividend Bracket Average Heatmap (Top 25 Industries)
                    </p>
                    <div className="w-full max-w-md flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">0.00%</span>
                      <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 to-green-900"></div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {Math.max(...heatmapData.map(i => i.bracketAvg * 100)).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Industry Details Modal - Only shown when View More is clicked */}
      <AnimatePresence>
        {showIndustryModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Industry Dividend Details
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Explore detailed dividend information across industries
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
                <IndustryDividendModal 
                  selectedIndustryFromBanner={selectedIndustry ? selectedIndustry.industry.split(' ')[0] : null}
                  onClose={handleCloseModal}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Banner;


// -----------------------without localstorage--------------------

// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import { motion, useInView, AnimatePresence } from 'framer-motion';
// import {
//   Sparkles, TrendingUp, BarChart2, PieChart, Factory, FlaskConical, DollarSign, Car, Code,
//   HeartPulse, Scissors, ShoppingBag, Building2, Hammer, Wheat, Ship, Briefcase, Battery,
//   Cpu, Droplets, Home, Banknote, Smartphone, Plane, Utensils, Zap, Recycle, Trees, Radio,
//   Globe2, Microscope, Film, Beaker, Wrench, Shield, Truck, Satellite, Package, Server, Coins, BookOpen,
//   ArrowRight, X
// } from 'lucide-react';
// import { Typewriter } from 'react-simple-typewriter';
// import axios from 'axios';
// import IndustryDividendModal from './Indice/IndustryDividendModal';

// const Banner = ({ onIndustrySelect }) => {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: '-50px' });
//   const [industries, setIndustries] = useState([]);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightedIndustry, setHighlightedIndustry] = useState(null);
//   const [isDark, setIsDark] = useState(false);
//   const [showIndustryModal, setShowIndustryModal] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // Industry icons mapping
//   const industryIcons = {
//     "Pharmaceuticals & Drugs": HeartPulse,
//     "Refineries": Factory,
//     "Chemicals": FlaskConical,
//     "Finance - NBFC": DollarSign,
//     "Automobiles - Passenger Cars": Car,
//     "IT - Software": Code,
//     "Healthcare": HeartPulse,
//     "Textile": Scissors,
//     "Household & Personal Products": ShoppingBag,
//     "Cement & Construction Materials": Building2,
//     "Auto Ancillary": Hammer,
//     "Electrodes & Welding Equipment": Hammer,
//     "Pesticides & Agrochemicals": Wheat,
//     "Shipping": Ship,
//     "Finance - Investment": Banknote,
//     "Insurance": Shield,
//     "Telecom": Radio,
//     "Media & Entertainment": Film,
//     "Education": BookOpen,
//     "Energy": Zap,
//     "Power Generation & Distribution": Battery,
//     "Diesel Engines": Droplets,
//     "Aviation": Plane,
//     "Hospitality": Utensils,
//     "Real Estate": Home,
//     "Automobile Two & Three Wheelers": Truck,
//     "Defence": Shield,
//     "Mining": Hammer,
//     "Electric Equipment": Cpu,
//     "Electronics": Smartphone,
//     "Environment & Sustainability": Recycle,
//     "Forestry & Paper": Trees,
//     "Research & Development": Microscope,
//     "Global Trade": Globe2,
//     "Logistics": Package,
//     "Engineering - Industrial Equipments": Server,
//     "Finance - Asset Management": Coins,
//     "Construction": Wrench,
//     "Aerospace": Satellite,
//     "Consulting": Briefcase,
//   };

//   // Parse dividend bracket
//   const parseDividendBracket = (bracket) => {
//     if (!bracket || typeof bracket !== 'string') return 0;
//     const cleaned = bracket.replace(/[()[\]]/g, '').replace(/\s+/g, '');
//     const parts = cleaned.split(',').map(Number);
//     if (parts.length < 2) return 0;
//     return (parts[0] + parts[1]) / 2;
//   };

//   // Get green shade based on intensity
//   const getGreenShade = (intensity) => {
//     if (intensity === 0) return "rgb(212,244,226)";
//     const normalizedIntensity = Math.min(1, Math.max(0, intensity));
//     const r = Math.round(212 - (212 - 6) * normalizedIntensity);
//     const g = Math.round(244 - (244 - 95) * normalizedIntensity);
//     const b = Math.round(226 - (226 - 70) * normalizedIntensity);
//     return `rgb(${r},${g},${b})`;
//   };

//   // Format dividend bracket for display
//   const formatDividendBracket = (bracket) => {
//     if (!bracket || typeof bracket !== "string") return "N/A";

//     let cleaned = bracket.replace(/[()[\]]/g, "").replace(/\s+/g, "");

//     if (cleaned.endsWith("+")) {
//       const num = parseFloat(cleaned.replace("+", ""));
//       return isNaN(num) ? "N/A" : `${(num * 100).toFixed(2)}%+`;
//     }

//     const parts = cleaned.split(/[-,]/).map(n => parseFloat(n)).filter(n => !isNaN(n));

//     if (parts.length === 2) {
//       return `${(parts[0] * 100).toFixed(2)}% - ${(parts[1] * 100).toFixed(2)}%`;
//     }

//     if (parts.length === 1) {
//       return `${(parts[0] * 100).toFixed(2)}%`;
//     }

//     return "N/A";
//   };

//   // Handle industry selection
//   const handleIndustrySelect = (industry) => {
//     setSelectedIndustry(industry);

//     // Map the detailed industry name to common industry name for the IndustryDividend component
//     const industryMapping = {
//       "Pharmaceuticals & Drugs": "Pharmaceuticals",
//       "Automobiles - Passenger Cars": "Automobile",
//       "IT - Software": "IT",
//       "Finance - NBFC": "Banking",
//       "Finance - Investment": "Banking",
//       "Finance - Asset Management": "Banking",
//       "Cement & Construction Materials": "Cement",
//       "Household & Personal Products": "FMCG",
//       "Oil & Gas": "Oil & Gas",
//       "Real Estate": "Real Estate",
//       "Chemicals": "Chemicals",
//       "Power Generation & Distribution": "Power",
//       "Textile": "Textiles",
//       "Aviation": "Aviation",
//       "Retail": "Retail",
//       "Insurance": "Insurance",
//       "Telecom": "Telecom",
//       "Auto Ancillary": "Bearings",
//       "Steel": "Steel"
//     };

//     // Find the matching common industry or use the first part of the industry name
//     let commonIndustry = industryMapping[industry.industry];
//     if (!commonIndustry) {
//       // Fallback: use the first word of the industry name
//       commonIndustry = industry.industry.split(' ')[0];
//     }

//     // Notify parent component about the industry selection
//     if (onIndustrySelect) {
//       onIndustrySelect(commonIndustry);
//     }
//   };

//   // Handle view more click - open modal
//   const handleViewMore = () => {
//     setShowIndustryModal(true);
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
//   };

//   // Handle modal close
//   const handleCloseModal = () => {
//     setShowIndustryModal(false);
//     // Restore body scroll
//     document.body.style.overflow = 'unset';
//   };

//   // Close modal on escape key
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         handleCloseModal();
//       }
//     };

//     if (showIndustryModal) {
//       document.addEventListener('keydown', handleEscape);
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//     };
//   }, [showIndustryModal]);

//   // Detect dark mode preference
//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     setIsDark(mediaQuery.matches);

//     const handleChange = (e) => setIsDark(e.matches);
//     mediaQuery.addEventListener('change', handleChange);
//     return () => mediaQuery.removeEventListener('change', handleChange);
//   }, []);

//   // Fetch industry data
//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchIndustries = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await axios.get(
//           `${API_BASE}/landpage/industry-dividend-yield`,
//           {
//             signal: controller.signal, // Axios >=1.x
//           }
//         );

//         if (
//           response.data?.status !== "success" ||
//           !Array.isArray(response.data.data)
//         ) {
//           throw new Error(response.data?.message || "Invalid API response");
//         }

//         const validIndustries = response.data.data
//           .filter(
//             (industry) =>
//               industry?.industry &&
//               Number.isFinite(industry.CountInBracket) &&
//               industry.DividendBracket
//           )
//           .map((industry) => ({
//             ...industry,
//             bracketAvg: parseDividendBracket(industry.DividendBracket),
//           }));

//         if (validIndustries.length === 0) {
//           setIndustries([]);
//           setSelectedIndustry(null);
//           return;
//         }

//         const slicedIndustries = validIndustries.slice(0, 25);
//         setIndustries(slicedIndustries);

//         const firstIndustry = slicedIndustries[0];
//         setSelectedIndustry(firstIndustry);
//         handleIndustrySelect(firstIndustry);

//       } catch (err) {
//         if (axios.isCancel(err)) return;

//         console.error("Industry fetch failed:", err);
//         setError(err.message || "Failed to fetch industry data");
//         setIndustries([]);
//         setSelectedIndustry(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounceId = setTimeout(fetchIndustries, 100);

//     return () => {
//       controller.abort();
//       clearTimeout(debounceId);
//     };
//   }, [API_BASE, handleIndustrySelect]);


//   // Format numbers for display
//   const formatNumber = useCallback((num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
//     const absNum = Math.abs(num);
//     const sign = num < 0 ? '-' : '';
//     if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}cr`;
//     if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: 2 })}L`;
//     return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//   }, []);

//   // Calculate max bracket average
//   const maxBracketAvg = useMemo(() => {
//     if (industries.length === 0) return 1;
//     const max = Math.max(...industries.map((industry) => industry.bracketAvg || 0));
//     return max > 0 ? max : 1;
//   }, [industries]);

//   // Prepare heatmap data
//   const heatmapData = useMemo(() => {
//     if (!Array.isArray(industries) || industries.length === 0) return [];
//     return industries.map((industry, index) => ({
//       ...industry,
//       intensity: industry.bracketAvg / maxBracketAvg,
//       index,
//     }));
//   }, [industries, maxBracketAvg]);

//   return (
//     <>
//       <div className="relative px-4 py-8 sm:py-12 lg:py-16 flex items-center justify-center">
//         <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start justify-between gap-2 lg:gap-10 z-10">

//           {/* Left Section: Title and Selected Industry Card */}
//           <div className="w-full lg:w-1/2 text-gray-800 dark:text-gray-100">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={isInView ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.5 }}
//               className="text-center lg:text-left"
//             >
//               <div className="flex items-center justify-center lg:justify-start text-sky-600 dark:text-indigo-300 text-sm font-medium mb-1">
//                 <div className="flex items-center bg-sky-100 dark:bg-indigo-900/30 px-3 rounded-full">
//                   <Sparkles className="w-4 h-4 mr-2" />
//                   <span>Advanced Analytics Platform</span>
//                 </div>
//               </div>

//               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight">
//                 Capital Market{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300">
//                   Data Analytics
//                 </span>
//                 <span className="ml-2 align-middle inline-block -rotate-6 bg-white text-sky-600 dark:bg-slate-800 font-semibold text-xs sm:text-sm px-2 py-1 rounded-md border border-sky-300 dark:border-sky-600 shadow-sm">
//                   BETA
//                 </span>
//               </h1>

//               <div className="sm:mt-4 min-h-[80px] flex items-center justify-center lg:justify-start">
//                 <p className="text-lg sm:text-l text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
//                   <Typewriter
//                     words={[
//                       'Ratan Tata - "I do not believe in taking right decisions, I take decisions and then make them RIGHT."',
//                       'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                       'Charlie Munger - "People calculate too much and think too little"',
//                       'Mentor - "Value of money is determined by how it protects against uncertainties"',
//                       'Charlie Munger - "Big money is in waiting when to buy and when to sell"',
//                     ]}
//                     loop={0}
//                     cursor
//                     cursorStyle="|"
//                     typeSpeed={60}
//                     deleteSpeed={30}
//                     delaySpeed={1500}
//                   />
//                 </p>
//               </div>
//             </motion.div>

//             <AnimatePresence mode="wait">
//               {loading ? (
//                 <motion.div
//                   key="loading"
//                   className="mt-9 w-full max-w-md mx-auto lg:mx-0 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 shadow-lg"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="animate-pulse space-y-5">
//                     <div className="w-12 h-12 mx-auto bg-gray-500 dark:bg-gray-700 rounded-xl" />
//                     <div className="space-y-3">
//                       <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
//                       <div className="w-1/2 h-3 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 pt-2">
//                       {[...Array(4)].map((_, i) => (
//                         <div
//                           key={i}
//                           className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 space-y-2"
//                         >
//                           <div className="w-1/2 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
//                           <div className="w-3/4 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </motion.div>
//               ) : !selectedIndustry || industries.length === 0 ? (
//                 <motion.div
//                   key="no-data"
//                   className="mt-8 w-full max-w-md mx-auto lg:mx-0 text-center rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-900"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm font-medium">
//                     No industry data available
//                   </p>
//                   <button
//                     onClick={() => window.location.reload()}
//                     className="px-6 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
//                   >
//                     Retry
//                   </button>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="data"
//                   className="mt-8 w-full max-w-md mx-auto lg:mx-0 relative rounded-2xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-slate-300 via-blue-50/30 to-slate-100 dark:from-gray-800 dark:via-slate-800/60 dark:to-gray-900 shadow-xl p-6 sm:p-8"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="absolute top-7 right-5">
//                     <motion.button
//                       onClick={handleViewMore}
//                       className="group flex items-center gap-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200"
//                       whileTap={{ scale: 0.97 }}
//                     >
//                       <span className="relative">
//                         View More
//                         <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
//                       </span>
//                       <motion.div
//                         initial={{ x: 0 }}
//                         whileHover={{ x: 4 }}
//                         transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//                       >
//                         <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-blue-400 ml-1" />
//                       </motion.div>
//                     </motion.button>
//                   </div>

//                   <div className="flex items-center gap-4 mb-6 mt-6 sm:mt-8">
//                     <motion.div
//                       className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
//                       style={{
//                         backgroundColor: getGreenShade(selectedIndustry.intensity || 0),
//                       }}
//                       whileHover={{ scale: 1.05, rotate: 3 }}
//                       transition={{ type: 'spring', stiffness: 250, damping: 12 }}
//                     >
//                       {industryIcons[selectedIndustry.industry] ? (
//                         React.createElement(industryIcons[selectedIndustry.industry], {
//                           className: 'w-6 h-6',
//                           strokeWidth: 1.5,
//                           color: isDark ? '#222' : '#374151',
//                         })
//                       ) : (
//                         <PieChart className="w-6 h-6" strokeWidth={1.5} color="#374151" />
//                       )}
//                     </motion.div>

//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
//                         {selectedIndustry.industry}
//                       </h3>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         Industry dividend overview
//                       </p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-2 bg-slate-300 dark:bg-gray-800 p-2 rounded-xl">
//                     {[
//                       {
//                         title: 'Dividend Range',
//                         icon: BarChart2,
//                         color: 'from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800',
//                         value: formatDividendBracket(selectedIndustry.DividendBracket),
//                       },
//                       {
//                         title: 'Avg Dividend Yield',
//                         icon: PieChart,
//                         color: 'from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800',
//                         value: `${(selectedIndustry.AvgDividendYield * 100).toFixed(2)}%`,
//                       },
//                       {
//                         title: 'Range Frequency',
//                         icon: TrendingUp,
//                         color: 'from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800',
//                         value: selectedIndustry.CountInBracket,
//                       },
//                       {
//                         title: 'Company Count',
//                         icon: BarChart2,
//                         color: 'from-sky-50 to-purple-100 dark:from-gray-700 dark:to-gray-800',
//                         value: selectedIndustry.CompanyCount,
//                       },
//                     ].map((item, idx) => (
//                       <div
//                         key={idx}
//                         className={`bg-gradient-to-br ${item.color} p-4 rounded-xl border border-gray-200/50 dark:border-gray-600`}
//                       >
//                         <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                           <item.icon className="w-4 h-4 opacity-70" />
//                           {item.title}
//                         </div>
//                         <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                           {item.value}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Right Section: Heatmap */}
//           <div className="w-full lg:w-1/2 mt-8 lg:mt-0" data-tour="home-hero">
//             {error ? (
//               <div className="text-center px-6 py-8 text-gray-600 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
//                 Could not load industry visualization: {error}
//               </div>
//             ) : loading ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-pulse">
//                 {[...Array(25)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="rounded-lg h-20 sm:h-24"
//                     style={{ backgroundColor: getGreenShade(0.5) }}
//                   ></div>
//                 ))}
//               </div>
//             ) : heatmapData.length === 0 ? (
//               <div className="text-center px-6 py-8 text-gray-500 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
//                 No industry data available
//               </div>
//             ) : (
//               <div className="relative w-full">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
//                   {heatmapData.map((industry, index) => (
//                     <motion.div
//                       key={industry.industry}
//                       className={`relative rounded-md cursor-pointer flex items-center justify-center p-2 sm:p-3 bg-opacity-90 shadow-sm hover:shadow-md transition-all duration-200 min-h-[90px] sm:min-h-[100px] border-2 ${selectedIndustry?.industry === industry.industry
//                         ? 'border-sky-500 dark:border-sky-400 shadow-lg ring-2 ring-sky-200 dark:ring-sky-800'
//                         : 'border-transparent'
//                         }`}
//                       style={{
//                         backgroundColor: getGreenShade(industry.intensity),
//                       }}
//                       whileHover={{
//                         scale: 1.04,
//                         y: -6,
//                         boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//                         transition: {
//                           type: "tween",
//                           ease: "easeOut",
//                           duration: 0.08
//                         }
//                       }}
//                       whileTap={{
//                         scale: 0.98,
//                         transition: { type: "spring", stiffness: 600, damping: 30 }
//                       }}
//                       animate={{
//                         borderColor: selectedIndustry?.industry === industry.industry ? 'rgba(25, 52, 65, 1)' : 'transparent',
//                         boxShadow: selectedIndustry?.industry === industry.industry ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                       }}
//                       transition={{
//                         type: "spring",
//                         stiffness: 300,
//                         damping: 20,
//                         borderColor: { duration: 0.2 },
//                         boxShadow: { duration: 0.2 }
//                       }}
//                       onClick={() => handleIndustrySelect(industry)}
//                       onMouseEnter={() => setHighlightedIndustry(index)}
//                       onMouseLeave={() => setHighlightedIndustry(null)}
//                     >
//                       <div className="flex flex-col items-center justify-center text-center w-full space-y-1">
//                         {industryIcons[industry.industry] ? (
//                           React.createElement(industryIcons[industry.industry], {
//                             className: 'w-4 h-4 sm:w-5 sm:h-5 mb-1',
//                             strokeWidth: 1.5,
//                             color: industry.intensity > 0.7 ? '#ffffff' : (isDark ? '#000000' : '#374151'),
//                           })
//                         ) : (
//                           <PieChart
//                             className="w-4 h-4 sm:w-5 sm:h-5 mb-1"
//                             strokeWidth={1.5}
//                             color={industry.intensity > 0.7 ? '#ffffff' : (isDark ? '#000000' : '#374151')}
//                           />
//                         )}

//                         <p
//                           className={`text-[10px] sm:text-xs font-medium leading-tight w-full break-words line-clamp-2 ${industry.intensity > 0.7 ? 'text-white' : 'text-gray-900'
//                             }`}
//                           style={{
//                             wordBreak: 'break-word',
//                             overflowWrap: 'break-word',
//                           }}
//                         >
//                           {industry.industry}
//                         </p>

//                         <p className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${industry.intensity > 0.7 ? 'text-white' : 'text-gray-700'
//                           }`}>
//                           {formatDividendBracket(industry.DividendBracket)}
//                         </p>
//                       </div>

//                       {highlightedIndustry === index && (
//                         <div className="absolute z-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md text-xs -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
//                           <p className="font-semibold text-gray-900 dark:text-gray-100">{industry.industry}</p>
//                           <p className="text-gray-600 dark:text-gray-300">
//                             Dividend Bracket Avg: {(industry.bracketAvg * 100).toFixed(2)}%
//                           </p>
//                         </div>
//                       )}
//                     </motion.div>
//                   ))}
//                 </div>

//                 <div className="mt-6 sm:mt-8 flex flex-col items-center">
//                   <div className="mt-2 flex flex-col items-center">
//                     <p className="text-sm text-sky-600 dark:text-sky-300 font-medium mb-2">
//                       Dividend Bracket Average Heatmap (Top 25 Industries)
//                     </p>
//                     <div className="w-full max-w-md flex items-center gap-2">
//                       <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">0.00%</span>
//                       <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 to-green-900"></div>
//                       <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
//                         {Math.max(...heatmapData.map(i => i.bracketAvg * 100)).toFixed(2)}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Industry Details Modal - Only shown when View More is clicked */}
//       <AnimatePresence>
//         {showIndustryModal && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={handleCloseModal}
//           >
//             <motion.div
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
//               initial={{ scale: 0.9, opacity: 0, y: 50 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 50 }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Modal Header */}
//               <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     Industry Dividend Details
//                   </h2>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                     Explore detailed dividend information across industries
//                   </p>
//                 </div>
//                 <button
//                   onClick={handleCloseModal}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
//                 >
//                   <X className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
//                 </button>
//               </div>

//               {/* Modal Content */}
//               <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
//                 <IndustryDividendModal
//                   selectedIndustryFromBanner={selectedIndustry ? selectedIndustry.industry.split(' ')[0] : null}
//                   onClose={handleCloseModal}
//                 />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Banner;