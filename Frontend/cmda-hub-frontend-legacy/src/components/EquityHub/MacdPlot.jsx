// import React, { useState, useEffect } from "react";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";

// const MacdPlot = ({ symbol }) => {
//   const [plotData, setPlotData] = useState(null);
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

//     const cacheKey = `macd_plot_${symbol}`;
//     const cachedData = getCachedData(cacheKey);
//     if (cachedData) {
//       setPlotData(cachedData);
//       return;
//     }

//     fetch(`${API_BASE}/stocks/test/macd`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Preprocess dates to ensure ISO format
//         const processedData = data.macd_plot_data.map(trace => ({
//           ...trace,
//           x: trace.x.map(date => new Date(date).toISOString())
//         }));
//         setPlotData({ ...data, macd_plot_data: processedData });
//         setCachedData(cacheKey, { ...data, macd_plot_data: processedData });
//       })
//       .catch((error) => console.error("Error fetching plot data:", error));
//   }, [symbol]);

//   if (!plotData) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           CMDAH...
//         </p>
//       </div>
//     );
//   }

//   const { macd_plot_data, layout, config } = plotData;

//   return (
//     <div>
//       <Plot
//         data={macd_plot_data}
//         layout={{
//           ...layout,
//           autosize: true,
//           responsive: true,
//           margin: { t: 10, l: 20, r: 20, b: 20 },
//           xaxis: {
//             ...layout.xaxis,
//             type: 'date',
//             tickformat: '%Y-%m-%d',
//             autorange: true
//           }
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

// export default MacdPlot;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";

// const MacdPlot = ({ symbol }) => {
//   const [plotData, setPlotData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL;
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   // Get cached data from localStorage
//   const getCachedData = useCallback((key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     const { data, timestamp } = JSON.parse(cached);
//     if (Date.now() - timestamp > CACHE_TTL) {
//       localStorage.removeItem(key);
//       return null;
//     }
//     return data;
//   }, []);

//   // Set cached data in localStorage
//   const setCachedData = useCallback((key, data) => {
//     localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//   }, []);

//   // Fetch MACD plot data
//   const fetchPlotData = useCallback(async (symbol) => {
//     if (!symbol) return;

//     const cacheKey = `macd_plot_${symbol}`;
//     const cachedData = getCachedData(cacheKey);
//     if (cachedData) {
//       setPlotData(cachedData);
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_BASE}/stocks/test/macd`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: JSON.stringify({ symbol }),
//       });
//       const data = await response.json();
//       // Preprocess dates to ensure ISO format
//       const processedData = data.macd_plot_data.map((trace) => ({
//         ...trace,
//         x: trace.x.map((date) => new Date(date).toISOString()),
//       }));
//       const finalData = { ...data, macd_plot_data: processedData };
//       setPlotData(finalData);
//       setCachedData(cacheKey, finalData);
//     } catch (error) {
//       console.error("Error fetching plot data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [API_BASE, getCachedData, setCachedData]);

//   // Debounce symbol changes to prevent rapid fetches
//   useEffect(() => {
//     if (!symbol) return;

//     const handler = setTimeout(() => {
//       fetchPlotData(symbol);
//     }, 300); // Debounce for 300ms

//     return () => clearTimeout(handler); // Cleanup on unmount or symbol change
//   }, [symbol, fetchPlotData]);

//   // Memoize plot data, layout, and config to prevent unnecessary re-renders
//   const { data: memoizedData, layout: memoizedLayout, config: memoizedConfig } = useMemo(() => {
//     if (!plotData) return { data: [], layout: {}, config: {} };
//     return {
//       data: plotData.macd_plot_data,
//       layout: {
//         ...plotData.layout,
//         autosize: true,
//         responsive: true,
//         margin: { t: 10, l: 20, r: 20, b: 20 },
//         xaxis: {
//           ...plotData.layout.xaxis,
//           type: "date",
//           tickformat: "%Y-%m-%d",
//           autorange: true,
//         },
//       },
//       config: {
//         responsive: true,
//         ...(plotData.config || {}),
//       },
//     };
//   }, [plotData]);

//   return (
//     <div className="relative w-full h-full min-h-[400px]">
//       {isLoading && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300 z-10">
//           <HashLoader color="#0369a1" size={60} />
//           <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//             CMDA...
//           </p>
//         </div>
//       )}
//       {plotData && (
//         <Plot
//           data={memoizedData}
//           layout={memoizedLayout}
//           useResizeHandler={true}
//           style={{ width: "100%", height: "100%", opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease" }}
//           config={memoizedConfig}
//         />
//       )}
//     </div>
//   );
// };

// export default MacdPlot;
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";
import RatingSystem from "../RatingFile/RatingSystem";
import { generatePlot } from "../../services/mtmApi";

const MacdPlot = ({ symbol }) => {
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

  // Fetch MACD plot data
  const fetchPlotData = useCallback(
    async (symbol) => {
      if (!symbol) return;

      const cacheKey = `macd_plot_${symbol}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setPlotData(cachedData);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await generatePlot(symbol, "macd");
        // Preprocess dates to ensure ISO format
        const processedData = data.macd_plot_data.map((trace) => ({
          ...trace,
          x: trace.x.map((date) => new Date(date).toISOString()),
        }));
        const finalData = { ...data, macd_plot_data: processedData };
        setPlotData(finalData);
        setCachedData(cacheKey, finalData);
      } catch (error) {
        console.error("Error fetching plot data:", error);
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
    if (!plotData) return { data: [], layout: {}, config: {} };
    return {
      data: plotData.macd_plot_data,
      layout: {
        ...plotData.layout,
        autosize: true,
        responsive: true,
        margin: { t: 10, l: 20, r: 20, b: 20 },
        xaxis: {
          ...plotData.layout.xaxis,
          type: "date",
          tickformat: "%Y-%m-%d",
          autorange: true,
        },
      },
      config: {
        responsive: true,
        ...(plotData.config || {}),
      },
    };
  }, [plotData]);
  const handleRatingUpdate = (newRating) => {
    console.log("macd:", newRating);
  };

  return (
    <div className="relative w-full  min-h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300 z-10">
          <HashLoader color="#0369a1" size={60} />
          <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
            CMDA...
          </p>
        </div>
      )}

      {/* Reusable Rating Component */}
      <div className="flex items-center justify-end pb-4 border-b border-gray-200">
        <div className="text-right">
          {/* <p className="text-sm font-medium text-gray-700 mb-2"></p> */}
          <RatingSystem plotType="macd" onRatingUpdate={handleRatingUpdate} />
        </div>
      </div>
      {plotData && (
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

export default MacdPlot;
