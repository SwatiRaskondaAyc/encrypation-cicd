import React, { useEffect, useState, useMemo, useCallback, useRef, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoClose, IoAdd, IoCalendar, IoArrowBack, IoFilter, IoStatsChart } from "react-icons/io5";
import { format, isValid, subMonths, parseISO } from "date-fns";
import { toast } from "react-toastify";

import { useAuth } from "../AuthContext";
// Import BrokerSelection normally - users need to see this immediately
import BrokerSelection from "./BrokerSelection";
import useSecureUpload from "../../hooks/useSecureUpload";
// import { portfolioApi } from '../utils/portfolioApi';

/* ==============================
   CODE SPLITTING: Lazy load heavy components
   Only lazy load PortfolioDashboard since it's a secondary view
   BrokerSelection is loaded normally so users see it immediately
================================ */
const PortfolioDashboard = lazy(() => import("./PortfolioDashboard"));

/* ==============================
   DEBOUNCE UTILITY
   Delays function execution until after wait milliseconds
   Useful for: search inputs, form field changes, filter updates
================================ */
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/* ==============================
   THROTTLE UTILITY
   Limits function execution to once per wait milliseconds
   Useful for: scroll events, resize events, API calls
================================ */
const throttle = (func, limit) => {
  let inThrottle;
  let lastFunc;
  let lastRan;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

/* ==============================
   LOADING FALLBACK COMPONENT
   Shown while lazy-loaded components are loading
================================ */
const LazyLoadFallback = () => (
  <div className="flex items-center justify-center p-8">
    <HashLoader color="#6366f1" size={50} />
    <span className="ml-4 text-gray-600 dark:text-gray-400">Loading component...</span>
  </div>
);

/* ==============================
   CONFIG
================================ */
const API_BASE_URL = `${import.meta.env.VITE_URL}/portfolio`;
const ITEMS_PER_PAGE = 10;


/* ==============================
   UTILS
================================ */
const generatePortfolioId = () => `Cmdapf_${Date.now()}`;
const isAuthenticated = () => !!localStorage.getItem("authToken");

/* ==============================
   ANALYSIS MEMOIZATION CACHE
   Stores analysis results to avoid redundant API calls
   Key: hash of transaction data, Value: analysis result
================================ */
const analysisCache = new Map();
const CACHE_MAX_SIZE = 10; // Max number of cached analyses
const CACHE_TTL_MS = 5 * 60 * 1000; // Cache expires after 5 minutes

/**
 * Generate a fast hash from transaction data for cache key
 * Uses a simple but effective string-based hash for performance
 */
const generateDataHash = (data) => {
  if (!data || data.length === 0) return 'empty';

  // Create hash from summary of data to avoid hashing entire large dataset
  const summary = {
    length: data.length,
    firstItem: data[0] ? JSON.stringify(data[0]).slice(0, 100) : '',
    lastItem: data[data.length - 1] ? JSON.stringify(data[data.length - 1]).slice(0, 100) : '',
    // Sample middle items for better uniqueness
    midItem: data[Math.floor(data.length / 2)] ? JSON.stringify(data[Math.floor(data.length / 2)]).slice(0, 50) : '',
  };

  const str = JSON.stringify(summary);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `h_${Math.abs(hash)}_${data.length}`;
};

/**
 * Get cached analysis if available and not expired
 */
const getCachedAnalysis = (hash) => {
  const cached = analysisCache.get(hash);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    console.log('📦 Using cached analysis result');
    return cached.data;
  }
  // Remove expired cache entry
  if (cached) {
    analysisCache.delete(hash);
  }
  return null;
};

/**
 * Store analysis result in cache with LRU eviction
 */
const setCachedAnalysis = (hash, data) => {
  // LRU eviction: remove oldest entry if cache is full
  if (analysisCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = analysisCache.keys().next().value;
    analysisCache.delete(oldestKey);
    console.log('🗑️ Evicted oldest cache entry');
  }

  analysisCache.set(hash, {
    data,
    timestamp: Date.now()
  });
  console.log(`💾 Cached analysis result (key: ${hash})`);
};

const normalizeBroker = (broker) => {
  if (!broker) return null;

  const value = broker.toString().toLowerCase().replace(/\s+/g, "");

  if (value.includes("axis")) return "AxisSecurities";
  if (value.includes("groww")) return "Groww";
  if (value.includes("zerodha")) return "Zerodha";
  if (value.includes("upstox")) return "Upstox";

  return broker; // fallback
};


/* ==============================
   COMPONENT
================================ */
const PortLandPage = ({ activePortfolioId, activePortfolioBroker, onPortfolioLoaded }) => {
  const { isLoggedIn } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [portfolioName, setPortfolioName] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("null");

  const [portfolioData, setPortfolioData] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [rangeData, setRangeData] = useState(null);
  const [newlyAddedRows, setNewlyAddedRows] = useState([]);

  const [step, setStep] = useState(1);
  const [brokerFile, setBrokerFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [showRangeFilter, setShowRangeFilter] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [portfolioId, setPortfolioId] = useState(activePortfolioId);
  const [showAnalysis, setShowAnalysis] = useState(false); // New state for showing analysis screen
  const [portfolioBroker, setPortfolioBroker] = useState(activePortfolioBroker || "");
  const [isFiltered, setIsFiltered] = useState(false);
  // const [isFiltered, setIsFiltered] = useState(filteredData.length > 0);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  /* RANGE FILTER STATE */
  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  /* ==============================
     REFS FOR THROTTLE/DEBOUNCE TRACKING
  ================================ */
  const lastApiCallRef = useRef(0);
  const pendingApiCallRef = useRef(null);
  const API_THROTTLE_MS = 1000; // Minimum 1 second between API calls

  /* ==============================
     DEBOUNCED DATE RANGE SETTER
     Prevents rapid state updates when user is typing dates
  ================================ */
  const debouncedSetDateRange = useMemo(
    () => debounce((newRange) => {
      setDateRange(newRange);
    }, 300),
    []
  );

  /* ==============================
     THROTTLED API CALLER
     Prevents too many API calls in quick succession
  ================================ */
  const throttledApiCall = useCallback(async (apiFunction, ...args) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallRef.current;

    if (timeSinceLastCall < API_THROTTLE_MS) {
      // Cancel any pending call
      if (pendingApiCallRef.current) {
        clearTimeout(pendingApiCallRef.current);
      }

      // Schedule the call for later
      return new Promise((resolve) => {
        pendingApiCallRef.current = setTimeout(async () => {
          lastApiCallRef.current = Date.now();
          const result = await apiFunction(...args);
          resolve(result);
        }, API_THROTTLE_MS - timeSinceLastCall);
      });
    }

    // Execute immediately
    lastApiCallRef.current = now;
    return await apiFunction(...args);
  }, []);

  /* PAGINATION */
  const totalPages = Math.ceil(portfolioData.length / ITEMS_PER_PAGE);
  const filteredTotalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Determine which data to show for pagination
  //  isFiltered = filteredData.length > 0;
  // setIsFiltered(filteredData.length > 0);
  // const paginatedData = isFiltered 
  //   ? filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  //   : portfolioData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  useEffect(() => {
    setIsFiltered(filteredData.length > 0);
  }, [filteredData]);
  const currentIsFiltered = filteredData.length > 0;
  const paginatedData = currentIsFiltered
    ? filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : portfolioData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);



  useEffect(() => {
    if (activePortfolioId && activePortfolioBroker) {
      setPortfolioBroker(activePortfolioBroker);
      setSelectedBroker(activePortfolioBroker); // Also set the selected broker
    }
  }, [activePortfolioId, activePortfolioBroker]);

  /* ==============================
     CLEANUP: Cancel pending throttle timeouts on unmount
  ================================ */
  useEffect(() => {
    return () => {
      if (pendingApiCallRef.current) {
        clearTimeout(pendingApiCallRef.current);
      }
    };
  }, []);


  /* ==============================
    INITIAL LOAD
 ================================ */
  useEffect(() => {
    if (activePortfolioId) {
      loadSavedPortfolio(activePortfolioId);
      setPortfolioId(activePortfolioId);
    } else {
      resetToInitialState();
    }
  }, [activePortfolioId]);

  const resetToInitialState = () => {
    setPortfolioData([]);
    setFilteredData([]);
    setAnalysisData(null);
    setPortfolioName("");
    setSelectedFile(null);
    setBrokerFile(null);
    setStep(1);
    setCurrentPage(1);
    setShowRangeFilter(false);
    setShowAddMore(false);
    setShowFilterPanel(false);
    setShowAnalysis(false);
  };


  // Helper function to analyze portfolio data with memoization
  const standardAnalyze = async (transactionsData, forceRefresh = false) => {
    const token = localStorage.getItem("authToken");
    if (!token || !transactionsData || transactionsData.length === 0) {
      return null;
    }

    // Generate hash for cache lookup
    const dataHash = generateDataHash(transactionsData);

    // Check cache first (unless force refresh is requested)
    if (!forceRefresh) {
      const cachedResult = getCachedAnalysis(dataHash);
      if (cachedResult) {
        setAnalysisData(cachedResult);
        return cachedResult;
      }
    }

    try {
      console.log(`🔄 Fetching analysis from API (${transactionsData.length} transactions)...`);
      const analyzeRes = await fetch(`${API_BASE_URL}/analyze-json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionsData),
      });

      if (analyzeRes.ok) {
        const analysis = await analyzeRes.json();

        // Cache the result for future use
        setCachedAnalysis(dataHash, analysis);

        setAnalysisData(analysis);
        console.log("✅ Analysis completed and cached");
        return analysis;
      } else {
        console.warn("Analysis failed");
        return null;
      }
    } catch (err) {
      console.warn("Could not analyze portfolio:", err);
      return null;
    }
  };

  const loadSavedPortfolio = async (portfolioId) => {
    try {
      setLoading(true);
      setError("");
      setPortfolioData([]);
      setAnalysisData(null);
      setIsFiltered(false); // Reset filter state
      setFilteredData([]); // Reset filtered data
      setShowFilterPanel(false); // Close filter panel

      const token = localStorage.getItem("authToken");
      if (!isLoggedIn || !token) {
        toast.info("Kindly log in before proceeding to your portfolio.");

        setError("Please login to view saved portfolios");
        if (onPortfolioLoaded) onPortfolioLoaded();
        return;
      }

      // ========================================
      // LOAD BALANCER: Parallel API calls using Promise.allSettled
      // This drastically improves loading speed by making all independent
      // API calls concurrently instead of sequentially
      // Added timeout to prevent hanging on slow/unresponsive backend
      // ========================================

      // Create abort controller with 15 second timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const [portfoliosResult, tradesResult, rangeResult] = await Promise.allSettled([
          // API 1: Get all portfolios list
          fetch(`${API_BASE_URL}/my_portfolios`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }).then(res => res.ok ? res.json() : null),

          // API 2: Get specific portfolio trades
          fetch(`${API_BASE_URL}/all_trades?portfolioId=${portfolioId}`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }).then(res => res.ok ? res.json() : null),

          // API 3: Get portfolio date range
          fetch(`${API_BASE_URL}/range?portfolioId=${portfolioId}`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }).then(res => res.ok ? res.json() : null),
        ]);

        clearTimeout(timeoutId); // Clear timeout if completed successfully

        // Process portfolios list result
        let myPortfolios = null;
        if (portfoliosResult.status === 'fulfilled' && portfoliosResult.value) {
          const portfoliosJson = portfoliosResult.value;
          // Robust extraction of portfolios list
          if (Array.isArray(portfoliosJson)) {
            myPortfolios = portfoliosJson;
          } else if (portfoliosJson.success && Array.isArray(portfoliosJson.data)) {
            myPortfolios = portfoliosJson.data;
          } else if (portfoliosJson.portfolios && Array.isArray(portfoliosJson.portfolios)) {
            myPortfolios = portfoliosJson.portfolios;
          } else if (portfoliosJson.data && Array.isArray(portfoliosJson.data)) {
            myPortfolios = portfoliosJson.data;
          } else {
            myPortfolios = portfoliosJson;
          }
          console.log("Portfolios response (parallel):", myPortfolios);
        }

        // Process trades result
        let portfolioDataResult = null;
        if (tradesResult.status === 'fulfilled' && tradesResult.value) {
          portfolioDataResult = tradesResult.value;
          console.log("Specific portfolio data (parallel):", portfolioDataResult);
        }

        // Process date range result
        if (rangeResult.status === 'fulfilled' && rangeResult.value) {
          const rangeData = rangeResult.value;
          console.log("Portfolio Date Range (parallel):", rangeData);
          if (rangeData.startDate && rangeData.endDate) {
            setDateRange({
              startDate: rangeData.startDate,
              endDate: rangeData.endDate
            });
          }
        } else {
          // Set default date range if API fails
          const today = format(new Date(), 'yyyy-MM-dd');
          const threeMonthsAgo = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
          setDateRange({
            startDate: threeMonthsAgo,
            endDate: today
          });
        }

        // If we have myPortfolios array, find the specific portfolio
        let portfolioInfo = null;
        if (Array.isArray(myPortfolios) && myPortfolios.length > 0) {
          portfolioInfo = myPortfolios.find(p =>
            p.portfolioId === portfolioId ||
            p.id === portfolioId ||
            p._id === portfolioId ||
            p.portfolioID === portfolioId ||
            p.pid === portfolioId ||
            p.id?.toString() === portfolioId?.toString()
          );
        }

        let transactions = [];
        let name = portfolioDataResult?.portfolioName || portfolioDataResult?.name || "";
        let broker = "";

        // NEW: Always try to get metadata from portfolioInfo if found
        if (portfolioInfo) {
          name = portfolioInfo.portfolioName || portfolioInfo.name || portfolioInfo.portfolio_name || name;
          broker = portfolioInfo.brokerId || portfolioInfo.broker || portfolioInfo.brokerName || "";
          console.log("Found portfolio metadata from my_portfolios:", { name, broker });
        }

        // Final fallback for name
        if (!name) name = "My Portfolio";

        // Extract data from portfolioDataResult response
        if (portfolioDataResult) {
          if (Array.isArray(portfolioDataResult)) {
            transactions = portfolioDataResult;
          } else if (portfolioDataResult.transactions && Array.isArray(portfolioDataResult.transactions)) {
            transactions = portfolioDataResult.transactions;
            name = portfolioDataResult.portfolioName || portfolioDataResult.name || portfolioDataResult.portfolio_name || name;
            broker = portfolioDataResult.broker || portfolioDataResult.brokerName || broker;
          } else if (portfolioDataResult.data && Array.isArray(portfolioDataResult.data)) {
            transactions = portfolioDataResult.data;
            name = portfolioDataResult.portfolioName || portfolioDataResult.name || portfolioDataResult.portfolio_name || name;
            broker = portfolioDataResult.broker || portfolioDataResult.brokerName || broker;
          } else {
            // Try to get name from other properties
            name = portfolioDataResult.portfolioName || portfolioDataResult.name || portfolioDataResult.portfolio_name || name;
            broker = portfolioDataResult.broker || portfolioDataResult.brokerName || broker;
          }
        }

        // Fallback to portfolioInfo transactions if we didn't get data from specific endpoint
        if (transactions.length === 0 && portfolioInfo) {
          if (Array.isArray(portfolioInfo)) {
            transactions = portfolioInfo;
          } else if (portfolioInfo.transactions && Array.isArray(portfolioInfo.transactions)) {
            transactions = portfolioInfo.transactions;
          }
        }

        // If we still have no transactions, show error
        if (transactions.length === 0) {
          setError("No transaction data found for this portfolio");
          setStep(1); // Go back to broker selection
          return;
        }

        // Set portfolio data immediately so UI loads faster
        setPortfolioName(name);
        setPortfolioData(transactions);
        if (broker) {
          setSelectedBroker(broker);
          setPortfolioBroker(broker); // Also set the portfolioBroker state
        }
        setPortfolioId(portfolioId);
        setStep(4); // Go to normalized table view

        // Mark loading as complete - UI will show now
        setLoading(false);
        if (onPortfolioLoaded) onPortfolioLoaded();

      } catch (innerErr) {
        // Handle timeout or abort errors from the inner try
        clearTimeout(timeoutId);
        if (innerErr.name === 'AbortError') {
          throw new Error('Request timed out. The server is taking too long to respond.');
        }
        throw innerErr; // Re-throw other errors to be caught by outer catch
      }

    } catch (err) {
      console.error("Load portfolio error:", err);
      let errorMessage = "Failed to load portfolio";

      if (err.name === 'AbortError' || err.message.includes('timed out')) {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (err.message.includes("401") || err.message.includes("403")) {
        errorMessage = "Authentication failed. Please login again.";
        localStorage.removeItem("authToken");
      } else if (err.message.includes("404")) {
        errorMessage = "Portfolio not found. It may have been deleted.";
      } else if (err.message.includes("session") || err.message.includes("login")) {
        errorMessage = "Your session has expired. Please login again.";
        localStorage.removeItem("authToken");
      }

      setError(errorMessage);
      setStep(1); // Go back to broker selection
    } finally {
      setLoading(false);
    }
  };
  /* ==============================
  //      GET TRADES IN RANGE
  //   ================================ */
  const handleGetTradesInRange = async () => {
    if (!portfolioId) {
      setError("No active portfolio");
      return;
    }

    try {
      if (!isLoggedIn) {
        toast.info("Kindly log in before proceeding to your portfolio.");


        return;
      }
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.info("Kindly log in before proceeding to your portfolio.");


        setLoading(false);
        return;
      }

      const url = new URL(`${API_BASE_URL}/get_trades_inrange`);
      url.searchParams.append("portfolioId", portfolioId);
      url.searchParams.append("startDate", dateRange.startDate);
      url.searchParams.append("endDate", dateRange.endDate);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trades in range");
      }

      const data = await response.json();
      setRangeData(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleAddMoreData = async (newFile) => {
    if (!portfolioId || !newFile) {
      setError("Please select a file to add");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(10);

      const token = localStorage.getItem("authToken");
      if (!isLoggedIn || !token) {
        toast.info("Kindly log in before proceeding to your portfolio.");

        setError("Please login first");
        setLoading(false);
        return;
      }

      console.log("Adding file to portfolio:", {
        portfolioId,
        portfolioName,
        portfolioBroker,
      });

      const actualPortfolioName = portfolioName;
      // ADDED: Fetch current broker if not already set
      // let currentBroker = selectedBroker;
      let currentBroker = portfolioBroker || selectedBroker;

      if (!currentBroker) {
        // console.warn("selectedBroker is empty, trying to fetch from portfolio");

        try {
          // Method 1: Use direct API call to get portfolio info
          const response = await fetch(`${API_BASE_URL}/my_portfolios`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          //       if (response.ok) {
          //         const data = await response.json();
          //         console.log("Direct API portfolio data:", data);

          //         // Handle different response formats
          //         let portfoliosArray = [];
          //         if (Array.isArray(data)) {
          //           portfoliosArray = data;
          //         } else if (data?.portfolios && Array.isArray(data.portfolios)) {
          //           portfoliosArray = data.portfolios;
          //         } else if (data?.data && Array.isArray(data.data)) {
          //           portfoliosArray = data.data;
          //         }

          //         console.log("Portfolios array:", portfoliosArray);

          //         // Find the specific portfolio
          //         const currentPortfolio = portfoliosArray.find(p => {
          //           console.log("Checking portfolio:", p);
          //           return (
          //             p.id === portfolioId || 
          //             p.portfolioId === portfolioId ||
          //             p._id === portfolioId ||
          //             p.portfolioID === portfolioId
          //           );
          //         });

          //         console.log("Found portfolio:", currentPortfolio);

          //         // if (currentPortfolio?.brokerId) {
          //         //   currentBroker = currentPortfolio.brokerId;
          //         //   setSelectedBroker(currentBroker);
          //         if (currentPortfolio?.brokerId || currentPortfolio?.broker) {
          // currentBroker = normalizeBroker(
          //   currentPortfolio.brokerId || currentPortfolio.broker
          // );
          // setSelectedBroker(currentBroker);
          //           console.log("Set selectedBroker from brokerId:", currentBroker);
          //         } else if (currentPortfolio?.broker) {
          //           currentBroker = currentPortfolio.broker;
          //           setSelectedBroker(currentBroker);
          //           console.log("Set selectedBroker from broker:", currentBroker);
          //         } else if (currentPortfolio?.brokerName) {
          //           currentBroker = currentPortfolio.brokerName;
          //           setSelectedBroker(currentBroker);
          //           console.log("Set selectedBroker from brokerName:", currentBroker);
          //         } else {
          //           console.warn("No broker info found in portfolio");
          //         }
          //       }
          if (response.ok) {
            const portfolioInfo = await response.json();
            currentBroker = portfolioInfo.brokerId || portfolioInfo.broker || portfolioInfo.brokerName;
            console.log("Fetched broker from portfolio info:", currentBroker);
          }
        } catch (err) {
          console.error("Error fetching broker:", err);
        }
      }

      // If we still don't have a broker, show an error
      if (!currentBroker || currentBroker === "Unknown") {
        throw new Error("Cannot determine the broker for this portfolio. Please check that the portfolio was properly created with a broker.");
      }
      // Step 1: Upload to normalized API
      const formData = new FormData();
      formData.append('file', newFile);
      formData.append('save', 'true');
      formData.append('portfolioId', portfolioId);
      formData.append('portfolioName', actualPortfolioName);



      // Use the fetched broker - DO NOT default to "Groww"
      formData.append('brokerId', currentBroker);
      formData.append('brokerName', currentBroker);

      // console.log("Sending with broker:", currentBroker);
      console.log("Sending with broker:", currentBroker, "and portfolio name:", actualPortfolioName);

      setUploadProgress(30);

      const normalizedResponse = await fetch(`${API_BASE_URL}/normalized`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      setUploadProgress(60);

      if (!normalizedResponse.ok) {
        const errorText = await normalizedResponse.text();
        console.error("Normalized API error:", errorText);

        let errorMessage = `Upload failed: ${normalizedResponse.status}`;

        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.includes("Broker mismatch")) {
            // Extract the expected broker from the error message
            const expectedBroker = errorJson.error.match(/Expected: (.+)$/)?.[1] || "Unknown";
            errorMessage = `❌ Broker Conflict!\n\nThis portfolio is configured for broker: ${expectedBroker}\n\nYour file must be from the same broker (${expectedBroker}).\n\nPlease: \n1. Upload a file from ${expectedBroker}\n2. Or create a new portfolio for this broker.`;
          }
        } catch {
          // If not JSON, use the raw error text
        }

        throw new Error(errorMessage);
      }

      const normalizedResult = await normalizedResponse.json();
      console.log("Normalized result:", normalizedResult);

      setUploadProgress(70);

      // Step 2: Get updated portfolio data
      const tradesResponse = await fetch(`${API_BASE_URL}/all_trades?portfolioId=${portfolioId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (tradesResponse.ok) {
        const tradesData = await tradesResponse.json();
        console.log("Trades response:", tradesData);

        let allTrades = [];
        if (Array.isArray(tradesData)) {
          allTrades = tradesData;
        } else if (tradesData?.data && Array.isArray(tradesData.data)) {
          allTrades = tradesData.data;
        } else if (tradesData?.trades && Array.isArray(tradesData.trades)) {
          allTrades = tradesData.trades;
        }

        console.log("All trades after merge:", allTrades.length);

        // Highlight newly added rows
        const newRowIds = allTrades.slice(portfolioData.length).map((_, index) => `new_${Date.now()}_${index}`);
        setNewlyAddedRows(newRowIds);

        // Update the portfolio data with ALL trades
        setPortfolioData(allTrades);
        setCurrentPage(1);
      }

      setUploadProgress(80);


      setUploadProgress(100);

      // Show success
      setError("✅ File added successfully! Portfolio has been updated.");
      setShowAddMore(false);

      setTimeout(() => setError(""), 3000);

    } catch (err) {
      console.error("Error adding data:", err);
      setError(err.message);

      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };
  /* ==============================
     PERSIST BROKER ON TAB SWITCH
  =============================== */
  useEffect(() => {
    // When portfolioId changes, try to get broker info
    if (portfolioId && !selectedBroker) {

      const fetchBrokerForPortfolio = async () => {
        if (!portfolioId) return;

        try {
          const token = localStorage.getItem("authToken");
          if (!token) return;

          const response = await fetch(`${API_BASE_URL}/my_portfolios`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) return;

          const data = await response.json();

          // Handle different response formats
          let portfolios = [];
          if (Array.isArray(data)) {
            portfolios = data;
          } else if (data.portfolios && Array.isArray(data.portfolios)) {
            portfolios = data.portfolios;
          } else if (data.data && Array.isArray(data.data)) {
            portfolios = data.data;
          }

          if (Array.isArray(portfolios)) {
            const portfolio = portfolios.find(p =>
              p.portfolioId === portfolioId ||
              p.id === portfolioId ||
              p._id === portfolioId
            );

            if (portfolio && portfolio.broker) {
              setSelectedBroker(portfolio.broker);
            }
          }
        } catch (err) {
          console.warn("Could not fetch broker on tab switch:", err);
        }
      };
      fetchBrokerForPortfolio();
    }
  }, [portfolioId]);
  /* ==============================
     GO BACK FUNCTION
  =============================== */
  const handleGoBack = () => {
    if (showRangeFilter) {
      // If showing analysis dashboard, go back to transactions
      setShowRangeFilter(false);
    } else if (step === 4) {
      // If showing transactions table, go back to broker selection
      setStep(1);
      resetToInitialState();
    } else if (step > 1) {
      // If in broker selection steps, go back one step
      setStep(step - 1);
    }
  };



  // * ==============================
  //    RENDER FILTER PANEL
  // =============================== */
  const renderFilterPanel = () => {
    if (!showFilterPanel) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-4 mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Filter Transactions</h3>
          <button
            onClick={() => setShowFilterPanel(false)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <IoClose size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGetTradesInRange}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <IoFilter size={16} /> Apply Filter
            </button>
          </div>
        </div>

        {rangeData && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Filtered Results: {rangeData.length || Object.keys(rangeData).length} records found
            </div>
          </div>
        )}
      </motion.div>
    );
  };


  const renderAddMoreSection = () => {
    if (!showAddMore) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 max-w-md w-full"
        >
          <h3 className="text-xl font-bold mb-4">Add More Data</h3>
          <p className="text-gray-600 mb-4">
            Select a {selectedBroker} file to add to your portfolio
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <HashLoader color="#2563eb" size={40} />
              <p className="mt-4 text-sm text-gray-600">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleAddMoreData(file);
                  }
                }}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg mb-4 cursor-pointer hover:border-blue-400 transition-colors"
              />

              <button
                onClick={() => setShowAddMore(false)}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            </>
          )}

          {error && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${error.includes("✅")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
              }`}>
              {error}
            </div>
          )}
        </motion.div>
      </div>
    );
  };
  /* ==============================
     RENDER BACK BUTTON
  =============================== */
  // const renderBackButton = () => {
  //   if (showRangeFilter || step === 4 || step > 1) {
  //     return (
  //       <button
  //         onClick={handleGoBack}
  //         className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
  //       >
  //         <IoArrowBack /> {showRangeFilter ? "Back to Transactions" : "Back"}
  //       </button>
  //     );
  //   }
  //   return null;
  // };

  const handleUploadNew = () => {
    setStep(1);           // Go back to upload step
    setShowRangeFilter(false);
    resetToInitialState(); // Clear normalization data
  };

  // const renderBackButton = () => {
  //   // Normalize screen → show Upload New instead of Back
  //   if (step === 4) {
  //     return (
  //       <button
  //         onClick={handleUploadNew}
  //         className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2"
  //       >
  //         Upload New
  //       </button>
  //     );
  //   }

  //   // Existing back button logic
  //   if (showRangeFilter || step > 1) {
  //     return (
  //       <button
  //         onClick={handleGoBack}
  //         className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
  //       >
  //         <IoArrowBack />
  //         {showRangeFilter ? "Back to Transactions" : "Back"}
  //       </button>
  //     );
  //   }

  //   return null;
  // };


  const renderBackButton = () => {
    // Normalize screen → show Upload New instead of Back
    if (step === 4) {
      return (
        <button
          onClick={handleUploadNew}
          className="
          px-5 py-2.5
          rounded-lg
          text-sm font-semibold
          text-blue-600
          bg-blue-50
          hover:bg-blue-100
          hover:text-blue-700
          transition-all duration-200
          flex items-center gap-2
          shadow-sm hover:shadow-md
          ring-1 ring-blue-200
        "
        >
          Upload New
        </button>
      );
    }

    // Existing back button logic
    if (showRangeFilter || step > 1) {
      return (
        <button
          onClick={handleGoBack}
          className="
          px-5 py-2.5
          rounded-lg
          text-sm font-medium
          text-gray-700
          bg-gray-100
          hover:bg-gray-200
          hover:text-gray-900
          transition-all duration-200
          flex items-center gap-2
          shadow-sm hover:shadow-md
          ring-1 ring-gray-200
        "
        >
          <IoArrowBack className="text-base" />
          {showRangeFilter ? "Back to Transactions" : "Back"}
        </button>
      );
    }

    return null;
  };


  /* ==============================
     FILTER TRADES BY DATE RANGE (Client-side)
 
  ================================ */

  const fetchPortfolioDateRange = async () => {
    if (!portfolioId) {
      setError("No active portfolio");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/range?portfolioId=${portfolioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio range: ${response.status}`);
      }

      const data = await response.json();
      console.log("Portfolio Date Range:", data);

      // Update date range with actual portfolio dates if available
      if (data.startDate && data.endDate) {
        setDateRange({
          startDate: data.startDate,
          endDate: data.endDate
        });
        setError("✅ Portfolio date range loaded!");
        setTimeout(() => setError(""), 3000);
      } else {
        // If API doesn't return dates, calculate from portfolio data
        if (portfolioData.length > 0) {
          const dates = portfolioData
            .map(trade => new Date(trade.Trade_execution_time || trade.tradeDate || trade.date))
            .filter(date => isValid(date));

          if (dates.length > 0) {
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));

            setDateRange({
              startDate: format(minDate, 'yyyy-MM-dd'),
              endDate: format(maxDate, 'yyyy-MM-dd')
            });
            setError("✅ Portfolio date range calculated!");
            setTimeout(() => setError(""), 3000);
          }
        }
      }

      return data;
    } catch (err) {
      console.error("Error fetching portfolio range:", err);
      setError("⚠️ Could not load portfolio range. Using default range.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };
  const validateFilterDates = () => {
    if (portfolioData.length === 0) return true;

    const filterStart = parseISO(dateRange.startDate);
    const filterEnd = parseISO(dateRange.endDate);

    // Get portfolio date range
    const dates = portfolioData
      .map(trade => new Date(trade.Trade_execution_time || trade.tradeDate || trade.date))
      .filter(date => isValid(date));

    if (dates.length === 0) return true;

    const portfolioStart = new Date(Math.min(...dates));
    const portfolioEnd = new Date(Math.max(...dates));

    return filterStart >= portfolioStart && filterEnd <= portfolioEnd;
  };
  // const handleFilterTrades = () => {
  //   try {
  //     if (!dateRange.startDate || !dateRange.endDate) {
  //       setError("Please select both start and end dates");
  //       return;
  //     }

  //     const startDate = parseISO(dateRange.startDate);
  //     const endDate = parseISO(dateRange.endDate);

  //     if (startDate > endDate) {
  //       setError("Start date must be before end date");
  //       return;
  //     }

  //     const filtered = portfolioData.filter(trade => {
  //       const tradeDate = getTradeDate(trade);
  //       if (!tradeDate) return false;

  //       const tradeDateObj = parseISO(tradeDate);
  //       return tradeDateObj >= startDate && tradeDateObj <= endDate;
  //     });

  //     setFilteredData(filtered);
  //     setCurrentPage(1); // Reset to first page
  //     setShowFilterPanel(false); // Close filter panel

  //     if (filtered.length === 0) {
  //       setError("No trades found in the selected date range");
  //     } else {
  //       setError(""); // Clear any previous errors
  //     }

  //   } catch (err) {
  //     setError("Error filtering trades: " + err.message);
  //   }
  // };

  const handleFilterTrades = async () => {
    try {
      if (!dateRange.startDate || !dateRange.endDate) {
        setError("Please select both start and end dates");
        return;
      }

      // Validate dates
      const startDate = parseISO(dateRange.startDate);
      const endDate = parseISO(dateRange.endDate);

      if (startDate > endDate) {
        setError("Start date must be before end date");
        return;
      }
      if (!validateFilterDates()) {
        setError("⚠️ Filter dates are outside portfolio range. Applying anyway...");
        setTimeout(() => setError(""), 2000);
      }

      if (!portfolioId) {
        setError("No active portfolio");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!isLoggedIn) {
        toast.info("Kindly log in before proceeding to your portfolio.");

        setError("Please login first");
        setLoading(false);
        return;
      }

      // Fetch filtered trades from backend API
      const url = new URL(`${API_BASE_URL}/get_trades_inrange`);
      url.searchParams.append("portfolioId", portfolioId);
      url.searchParams.append("startDate", dateRange.startDate);
      url.searchParams.append("endDate", dateRange.endDate);

      console.log("Fetching filtered trades from:", url.toString());

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Try to get error message
        let errorMessage = `Failed to fetch filtered trades: ${response.status}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (e) {
          // Ignore if can't parse error text
        }
        throw new Error(errorMessage);
      }

      const filteredTrades = await response.json();
      console.log("Filtered trades response:", filteredTrades);

      // Process the response data
      let tradesArray = [];
      if (Array.isArray(filteredTrades)) {
        tradesArray = filteredTrades;
      } else if (filteredTrades?.data && Array.isArray(filteredTrades.data)) {
        tradesArray = filteredTrades.data;
      } else if (filteredTrades?.trades && Array.isArray(filteredTrades.trades)) {
        tradesArray = filteredTrades.trades;
      } else if (filteredTrades?.transactions && Array.isArray(filteredTrades.transactions)) {
        tradesArray = filteredTrades.transactions;
      } else {
        console.warn("Unexpected response format:", filteredTrades);
        // If it's a single object with dates, extract the trades
        if (filteredTrades && typeof filteredTrades === 'object') {
          Object.values(filteredTrades).forEach(value => {
            if (Array.isArray(value)) {
              tradesArray = tradesArray.concat(value);
            }
          });
        }
      }

      setFilteredData(tradesArray);
      setCurrentPage(1); // Reset to first page
      setShowFilterPanel(false); // Close filter panel
      setIsFiltered(true);

      if (tradesArray.length === 0) {
        setError("No trades found in the selected date range");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(""); // Clear any previous errors
      }

    } catch (err) {
      console.error("Error filtering trades:", err);

      // More user-friendly error messages
      let errorMessage = err.message;
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err.message.includes("401") || err.message.includes("403")) {
        errorMessage = "Session expired. Please login again.";
        localStorage.removeItem("authToken");
        window.location.reload();
      }

      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     THROTTLED FILTER HANDLER
     Prevents rapid API calls when user clicks filter button multiple times
  ================================ */
  const throttledHandleFilterTrades = useMemo(
    () => throttle(handleFilterTrades, 1000),
    [portfolioId, dateRange, isLoggedIn]
  );

  const handleClearFilter = () => {
    setFilteredData([]);
    setIsFiltered(false);
    setCurrentPage(1);
    setShowFilterPanel(false);

    // Optional: Reset to original date range or portfolio range
    if (portfolioId) {
      fetchPortfolioDateRange(); // This will reset dates to portfolio range
    }
  };

  /* ==============================
     HOOK: USE SECURE UPLOAD
  ================================ */
  /* ==============================
     HOOK: USE SECURE UPLOAD
  ================================ */
  const [currentSessionKey, setCurrentSessionKey] = useState(null);

  const { normalizePortfolio, runSecureAnalysis } = useSecureUpload(
    setPortfolioData,
    setAnalysisData,
    () => { }, // setSavedPortfolios (managed differently here)
    () => { }, // saveLocalPortfolios (managed differently here)
    setError,
    setLoading,
    setUploadProgress,
    setSelectedBroker,     // setSelectedBroker
    () => { }, // setBrokerStep (dummy to prevent reset to 1)
    setBrokerFile,         // setBrokerFile
    setSelectedFile,       // setSelectedFile
    () => isLoggedIn,      // isAuthenticated wrapper
    () => { }, // setShowSaveModal (dummy)
    () => { } // fetchMyPortfolios (dummy)
  );

  const handleUploadChoice = async (save = false) => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    const result = await normalizePortfolio(
      save,
      selectedFile,
      portfolioName,
      selectedBroker,
      null // overridePortfolioId
    );

    if (result && result.success) {
      setCurrentSessionKey(result.sessionKey);
      if (save && result.portfolioId) {
        setPortfolioId(result.portfolioId);
        sessionStorage.setItem("ACTIVE_PORTFOLIO_ID", result.portfolioId);
        window.dispatchEvent(new Event("portfolioUpdated"));
      }

      setStep(4);
      setTimeout(() => setUploadProgress(0), 800);
    }
  };

  /* ==============================
   OLD UPLOAD FUNCTION (DEPRECATED)
================================ */
  // The old uploadPortfolio function is replaced by handleUploadChoice using useSecureUpload hook.
  // Keeping this comment for reference if needed, but the hook handles the logic now.
  const uploadPortfolio = async (save) => {
    console.warn("Using deprecated uploadPortfolio function. Please use handleUploadChoice.");
    await handleUploadChoice(save);
  };


  /* ==============================
     UTILITY: GET TRADE DATE
  ================================ */
  const getTradeDate = (trade) => {
    const dateStr = trade.Trade_execution_time || trade.tradeDate || trade.date || trade.timestamp;
    if (!dateStr) return null;

    try {
      // Try to parse the date string
      const date = new Date(dateStr);
      if (isValid(date)) {
        return format(date, 'yyyy-MM-dd');
      }
    } catch (e) {
      console.warn("Could not parse date:", dateStr);
    }
    return null;
  };


  const handleGetPortfolioRange = async () => {
    if (!portfolioId) {
      setError("No active portfolio");
      return;
    }

    try {
      if (!isLoggedIn) {
        toast.info("Kindly log in before proceeding to your portfolio.");

        setError("Please login first");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/range?portfolioId=${portfolioId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Portfolio range:", data);

        // Just show the add more modal
        setShowAddMore(true);
      } else {
        setError("Failed to get portfolio info");
      }
    } catch (err) {
      console.error("Error getting portfolio range:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     ANALYZE FILTERED DATA - Uses memoized analyzePortfolio
  ================================ */
  const handleAnalyzeFiltered = async () => {
    try {
      // Use filtered data if available, otherwise use all data
      const dataToAnalyze = isFiltered ? filteredData : portfolioData;

      if (dataToAnalyze.length === 0) {
        setError("No data to analyze");
        return;
      }

      // Check cache first for instant results
      const dataHash = generateDataHash(dataToAnalyze);
      const cachedResult = getCachedAnalysis(dataHash);

      if (cachedResult) {
        // 🚀 Instant result from cache - no loading needed!
        setAnalysisData(cachedResult);
        setShowAnalysis(true);
        setShowRangeFilter(false);
        setShowFilterPanel(false);
        console.log('⚡ Instant analysis from cache!');
        return;
      }

      // Not in cache - show loading and fetch from API
      setLoading(true);

      // Use runSecureAnalysis function
      const result = await runSecureAnalysis(dataToAnalyze, currentSessionKey, portfolioId, false);

      if (result && result.success) {
        setShowAnalysis(true);
        setShowRangeFilter(false);
        setShowFilterPanel(false);
      } else {
        throw new Error("Analysis failed");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     GO BACK TO TRANSACTIONS
  ================================ */
  const handleBackToTransactions = () => {
    setShowAnalysis(false);
    setAnalysisData(null);
  };

  /* ==============================
     RENDER NORMALIZED TABLE
  ================================ */
  const renderNormalizedTable = () => {
    // Determine which data count to show
    const dataCount = isFiltered ? filteredData.length : portfolioData.length;
    const showingText = isFiltered
      ? `Showing ${filteredData.length} filtered trades out of ${portfolioData.length} total`
      : `Showing all ${portfolioData.length} trades`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-[calc(100vh-200px)] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Portfolio Transactions</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{portfolioName}</p>
          </div>
          <div className="flex gap-4">
            {!activePortfolioId && (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2 transition-colors"
              >
                <IoArrowBack /> Back
              </button>
            )}
            <button
              onClick={handleAnalyzeFiltered}
              disabled={dataCount === 0}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${dataCount === 0
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
            >
              <IoStatsChart size={20} />
              {isFiltered ? 'Analyze Filtered Data' : 'Analyze Portfolio'}
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{portfolioData.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Currently Showing</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{filteredData.length > 0 ? filteredData.length : portfolioData.length}</div>
            {rangeData && (
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Filtered View</div>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Date Range</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {portfolioData.length > 0 ? (
                getDateRangeText()
              ) : (
                "No data"
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">Actions</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm flex items-center gap-1 transition-colors"
              >
                <IoFilter size={14} /> Filter
              </button>
              <button
                onClick={handleGetPortfolioRange}
                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg text-sm flex items-center gap-1 transition-colors"
              >
                <IoAdd size={14} /> Add More
              </button>
            </div>
          </div>
        </div>

        {/* Render filter panel */}
        {/* {renderFilterPanel()} */}

        {/* Render back button in header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {showRangeFilter ? 'Portfolio Analysis' : 'Portfolio Transactions'}
          </h2>
          <div className="flex gap-4">
            {renderBackButton()}
          </div>
        </div>


        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-4 rounded-xl shadow dark:shadow-gray-900/50 mb-6 border border-blue-100 dark:border-gray-700"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IoFilter className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">Filter by Date Range</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Portfolio range: {getDateRangeText()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchPortfolioDateRange}
                    className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 flex items-center gap-1 transition-colors"
                    title="Load portfolio date range"
                  >
                    <IoCalendar size={14} /> Load Range
                  </button>
                  <button
                    onClick={() => setShowFilterPanel(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </div>



              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex flex-col md:flex-row gap-4 flex-grow">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Filter Start Date
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(within portfolio range)</span>
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                      max={dateRange.endDate}
                      title="Select start date within portfolio range"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Filter End Date
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(within portfolio range)</span>
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                      min={dateRange.startDate}
                      title="Select end date within portfolio range"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={throttledHandleFilterTrades}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 flex items-center gap-2 font-medium disabled:opacity-50 transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Filtering...
                      </>
                    ) : (
                      <>
                        <IoFilter /> Apply Filter
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClearFilter}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Help text */}
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">
                💡 Tip: The "Load Range" button sets the filter to match your entire portfolio date range.
                You can then adjust the dates to filter specific periods within your portfolio.
              </div>

              {isFiltered && (
                <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                  <div>
                    Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredData.length}</span> of{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{portfolioData.length}</span> transactions
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                      ({((filteredData.length / portfolioData.length) * 100).toFixed(1)}% of portfolio)
                    </span>
                  </div>
                  <button
                    onClick={handleClearFilter}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <IoClose size={14} /> Clear filter
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
        {/* Transaction Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden flex-grow flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Transaction Details</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{showingText}</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {isFiltered ? filteredTotalPages : totalPages}
              </div>
            </div>
          </div>

          {dataCount === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <div className="text-xl font-medium mb-2">No transaction data available</div>
              <p className="text-gray-600">Upload a portfolio file or load a saved portfolio to get started</p>
            </div>
          ) : (
            <div className="flex-grow overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Symbol</th>
                    <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Qty</th>
                    <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Price</th>
                    <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Amount</th>
                    <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Date</th>
                    <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((r, i) => {
                    const isNew = newlyAddedRows.includes(`new_${i}`);
                    const originalIndex = portfolioData.findIndex(item =>
                      JSON.stringify(item) === JSON.stringify(r)
                    );
                    const isFilteredRow = isFiltered && originalIndex !== -1;

                    return (
                      <tr
                        key={i}
                        className={`border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isNew ? 'bg-yellow-50 dark:bg-yellow-900/20 animate-pulse' : ''
                          } ${isFilteredRow ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      >
                        <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{r.Symbol || r.symbol || "-"}</td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">{r.Qty || r.quantity || r.qty || "-"}</td>
                        {/* <td className="p-4 text-gray-700">₹{r.Mkt_Price || r.price || r.mkt_price || "0.00"}</td> */}
                        <td className="p-4 text-gray-700 dark:text-gray-300">
                          ₹{Number(r.Mkt_Price ?? r.price ?? r.mkt_price ?? 0).toFixed(2)}
                        </td>
                        <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">
                          ₹{Number(r.Amount ?? r.amount ?? 0).toFixed(2)}
                        </td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">
                          {formatTradeDate(r.Trade_execution_time || r.tradeDate || r.date)}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${(r.Order_Type === 'B' || r.type === 'BUY' || r.orderType === 'B')
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                            }`}>
                            {(r.Order_Type === 'B' || r.type === 'BUY' || r.orderType === 'B') ? 'BUY' : 'SELL'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {dataCount > ITEMS_PER_PAGE && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, dataCount)} of{" "}
                {dataCount} transactions
                {isFiltered && " (filtered)"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm dark:text-gray-300  disabled:opacity-50 hover:bg-gray-100 font-medium transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, isFiltered ? filteredTotalPages : totalPages) }, (_, i) => {
                    let pageNum;
                    if (isFiltered ? filteredTotalPages <= 5 : totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= (isFiltered ? filteredTotalPages : totalPages) - 2) {
                      pageNum = (isFiltered ? filteredTotalPages : totalPages) - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 mx-1 rounded text-sm transition-colors ${currentPage === pageNum
                          ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, isFiltered ? filteredTotalPages : totalPages))}
                  disabled={currentPage === (isFiltered ? filteredTotalPages : totalPages)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  /* ==============================
     RENDER ANALYSIS SCREEN
  ================================ */
  const renderAnalysisScreen = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className=""
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">Portfolio Analysis</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isFiltered ? 'Analyzing filtered data' : 'Complete portfolio analysis'}
              {isFiltered && ` (${filteredData.length} transactions)`}
            </p>
          </div>
          <button
            onClick={handleBackToTransactions}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors hover:bg-gray-100 rounded-lg"
          >
            <IoArrowBack /> Back to Transactions
          </button>
        </div>

        {/* Dashboard Container */}
        <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {/* <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <IoStatsChart className="text-white" size={24} />
              </div> */}
              {/* <div>
                <h3 className="text-xl font-bold text-gray-800">Performance Dashboard</h3>
                <p className="text-gray-600">Detailed analysis of your portfolio performance</p>
              </div> */}
            </div>

            {isFiltered && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <IoFilter />
                  <span className="font-medium">Filtered Analysis</span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  This analysis is based on {filteredData.length} filtered transactions from the original {portfolioData.length} transactions.
                </p>
              </div>
            )}
          </div>

          {/* Dashboard Component - Code Split with Suspense */}
          <Suspense fallback={<LazyLoadFallback />}>
            <PortfolioDashboard data={analysisData} portfolioId={portfolioId} portfolioName={portfolioName} />
          </Suspense>
        </div>

        {/* Additional Actions */}
        {/* <div className="mt-8 flex justify-center">
          <button
            onClick={handleBackToTransactions}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <IoArrowBack /> Return to Transaction View
          </button>
        </div> */}
        <div className="mt-8 flex justify-start">
          <button
            onClick={handleBackToTransactions}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <IoArrowBack /> Return to Transaction View
          </button>
        </div>

      </motion.div>
    );
  };

  /* ==============================
     UTILITY FUNCTIONS
  ================================ */
  const formatTradeDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return isValid(d) ? format(d, "dd MMM yyyy") : "-";
  };

  const getDateRangeText = () => {
    if (portfolioData.length === 0) return "No data";

    const dates = portfolioData
      .map(trade => new Date(trade.Trade_execution_time || trade.tradeDate || trade.date))
      .filter(date => isValid(date));

    if (dates.length === 0) return "Invalid dates";

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    return `${format(minDate, 'dd MMM yyyy')} - ${format(maxDate, 'dd MMM yyyy')}`;
  };

  /* ==============================
     MAIN RENDER
  ================================ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto h-full">
        {/* ERROR */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-300 dark:border-amber-700 rounded-xl text-amber-800 dark:text-amber-200 flex justify-between items-center shadow-lg"
          >
            <div className="flex gap-3 items-center">
              <RiErrorWarningLine className="text-amber-600 dark:text-amber-400" size={20} />
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 p-1 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded transition-colors"
            >
              <IoClose size={20} />
            </button>
          </motion.div>
        )}

        {/* LOADING - Only show during processing (step 4+) or when uploading, NOT during broker selection */}
        {loading && (step >= 4 || uploadProgress > 0) && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
            >
              <HashLoader color="#6366f1" size={80} />
              <p className="mt-6 text-lg font-medium text-gray-800 dark:text-gray-200">
                {uploadProgress > 0 ? `Processing... ${uploadProgress}%` : 'Loading...'}
              </p>
              {uploadProgress > 0 && (
                <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 h-2.5 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}


        {/* BROKER SELECTION (Steps 1-3) - Loaded immediately for instant UX */}
        {step < 4 && (
          <div className="h-[calc(100vh-200px)] flex items-center justify-center">
            <BrokerSelection
              step={step}
              platform={selectedBroker}
              file={brokerFile}
              onPlatformSelect={setSelectedBroker}
              onFileSelect={(file) => {
                setSelectedFile(file);
                setBrokerFile(file);
                setPortfolioName(file.name.replace(/\.[^/.]+$/, ""));
              }}
              onStepChange={setStep}
              onUploadChoice={handleUploadChoice}
              isAddMore={showAddMore}
              isLoggedIn={isLoggedIn}
            />
          </div>
        )}

        {/* NORMALIZED TABLE (Step 4) */}
        {step === 4 && !showAnalysis && portfolioData.length > 0 && renderNormalizedTable()}

        {/* ANALYSIS SCREEN */}
        {showAnalysis && analysisData && renderAnalysisScreen()}
        {/* ADD MORE MODAL */}
        {renderAddMoreSection()}
      </div>
    </div>
  );
};

export default PortLandPage;