// import React, { useState, useEffect } from "react";
// // import { IoIosPlay } from "react-icons/io";
// // import { RiInformation2Fill } from "react-icons/ri";
// // import { TbPlayerPauseFilled } from "react-icons/tb";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";

// const SensexVsStockCorr = ({ symbol }) => {
//   const [plotData, setPlotData] = useState(null);
//   // const [isSpeaking, setIsSpeaking] = useState(false);
//   // const [utterance, setUtterance] = useState(null);
//   // const [speechPosition, setSpeechPosition] = useState(0);
//   // const [showComment, setShowComment] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     const { data, timestamp } = JSON.parse(cached);
//     if (Date.now() - timestamp > CACHE_TTL) {
//       localStorage.removeItem(key);
//       return null;
//     }
//     return data;
//   };

//   const setCachedData = (key, data) => {
//     localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//   };

//   useEffect(() => {
//     if (!symbol) return;

//     const cacheKey = `sensex_vs_stock_corr_${symbol}`;
//     const cachedData = getCachedData(cacheKey);
//     if (cachedData) {
//       setPlotData(cachedData);
//       return;
//     }

//     fetch(`${API_BASE}/stocks/test/sensex_symphony`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setPlotData(data);
//         setCachedData(cacheKey, data);
//       })
//       .catch((error) => console.error("Error fetching plot data:", error));
//   }, [symbol]);

//   if (!plotData) {
//     return  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>;
//   }

//   const { scatter_data, layout, config } = plotData;

//   return (
//     <div>
//       <Plot
//         data={scatter_data}
//         layout={{
//           ...layout,
//           autosize: true,
//           responsive: true,
//           margin: { t: 50, l: 50, r: 30, b: 50 },
//         }}
//         useResizeHandler={true}
//         style={{ width: "100%", height: "100%" }}
//         config={{
//           responsive: true,
//           ...(config || {})
//         }}
//       />

//     </div>
//   );
// };

// export default SensexVsStockCorr;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";
import RatingSystem from "../RatingFile/RatingSystem";
import { generatePlot } from "../../services/mtmApi";

const SensexVsStockCorr = ({ symbol }) => {
  const [plotData, setPlotData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_URL;
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  // Get cached data from localStorage
  const getCachedData = useCallback((key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  }, []);

  // Set cached data in localStorage
  const setCachedData = useCallback((key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  }, []);

  // Fetch scatter plot data
  const fetchPlotData = useCallback(
    async (symbol) => {
      if (!symbol) return;

      const cacheKey = `sensex_vs_stock_corr_${symbol}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setPlotData(cachedData);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await generatePlot(symbol, "sensex_symphony");
        setPlotData(data);
        setCachedData(cacheKey, data);
      } catch (error) {
        console.error("Error fetching plot data:", error);
        setPlotData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [getCachedData, setCachedData],
  );

  // Debounce symbol changes to prevent rapid fetches
  useEffect(() => {
    if (!symbol) return;

    const handler = setTimeout(() => {
      fetchPlotData(symbol);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(handler); // Cleanup on unmount or symbol change
  }, [symbol, fetchPlotData]);

  // Memoize plot data, layout, and config to prevent unnecessary re-renders
  const {
    data: memoizedData,
    layout: memoizedLayout,
    config: memoizedConfig,
  } = useMemo(() => {
    if (!plotData) {
      return { data: null, layout: {}, config: {} };
    }
    return {
      data: plotData.scatter_data || null,
      layout: {
        ...plotData.layout,
        autosize: true,
        responsive: true,
        margin: {
          t: 50,
          l: 50,
          r: 30,
          b: 50,
          pad: 4, // Add padding for small screens
        },
        xaxis: {
          ...plotData.layout.xaxis,
          automargin: true, // Automatically adjust margins for labels
          tickangle: window.innerWidth < 640 ? 45 : 0, // Rotate ticks on small screens
        },
        yaxis: {
          ...plotData.layout.yaxis,
          automargin: true,
        },
        font: {
          size: window.innerWidth < 640 ? 10 : 12, // Smaller font on mobile
        },
      },
      config: {
        responsive: true,
        displayModeBar: window.innerWidth >= 768, // Show mode bar only on larger screens
        scrollZoom: false, // Disable scroll zoom for better mobile experience
        ...(plotData.config || {}),
      },
    };
  }, [plotData]);

  const handleRatingUpdate = (newRating) => {
    console.log("sensex_symphony:", newRating);
  };

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] sm:h-[calc(100vh-8rem)] md:h-[600px] max-h-[800px]">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300 z-10">
          <HashLoader
            color="#0369a1"
            size={window.innerWidth < 640 ? 40 : 60}
          />
          <p className="mt-4 text-sky-700 dark:text-white font-semibold text-sm sm:text-lg animate-pulse">
            CMDA...
          </p>
        </div>
      )}
      {/* Reusable Rating Component */}
      <div className="flex items-center justify-end pb-4 border-b border-gray-200">
        <div className="text-right">
          {/* <p className="text-sm font-medium text-gray-700 mb-2"></p> */}
          <RatingSystem
            plotType="sensex_symphony"
            onRatingUpdate={handleRatingUpdate}
          />
        </div>
      </div>
      {memoizedData && (
        <Plot
          data={memoizedData}
          layout={memoizedLayout}
          useResizeHandler={true}
          style={{
            width: "100%",
            height: "600px",
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
          config={memoizedConfig}
        />
      )}
    </div>
  );
};

export default SensexVsStockCorr;
