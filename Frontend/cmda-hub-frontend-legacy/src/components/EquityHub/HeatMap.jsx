// import React, { useState, useEffect } from "react";
// // import { IoIosPlay } from "react-icons/io";
// // import { RiInformation2Fill } from "react-icons/ri";
// // import { TbPlayerPauseFilled } from "react-icons/tb";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";

// const Heatmap = ({ symbol }) => {
//   const [heatmapData, setHeatmapData] = useState(null);
//   const [layout, setLayout] = useState({});
//   const [config, setConfig] = useState({});
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(true);
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

//     const cacheKey = `corr_heatmap_${symbol}`;
//     const cachedData = getCachedData(cacheKey);
//     if (cachedData) {
//       setHeatmapData(cachedData.heatmap_data || null);
//       setLayout(cachedData.layout || {});
//       setConfig(cachedData.config || {});
//       setComment(cachedData.comment || "");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     fetch(`${API_BASE}/stocks/test/performance_heatmap`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((result) => {
//         setHeatmapData(result.heatmap_data || null);
//         setLayout(result.layout || {});
//         setConfig(result.config || {});
//         setComment(result.comment || "");
//         setCachedData(cacheKey, result);
//       })
//       .catch((error) => {
//         console.error("Error fetching heatmap data:", error);
//         setHeatmapData(null);
//       })
//       .finally(() => setLoading(false));
//   }, [symbol]);

//   if (loading) {
//     return  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>;
//   }
//   if (!heatmapData) {
//     return <p>No data available</p>;
//   }

//   return (
//     <div>
//       <Plot
//         data={heatmapData}
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
//           ...(config || {}),
//         }}
//       />
//       {/* <div className="bg-gray-200 p-4 dark:bg-slate-500 dark:text-white">
//         <div className="bg-white flex justify-center items-center space-x-4 p-3 rounded-lg shadow-md dark:bg-slate-800 dark:text-white">
//           <button
//             className="px-6 text-xl font-bold"
//             onClick={() => setShowComment(!showComment)}
//           >
//             {showComment ? "Hide info" : <RiInformation2Fill />}
//           </button>
//         </div>
//         {showComment && (
//           <div className="flex justify-center items-center mt-4 p-4 border rounded bg-gray-100 dark:bg-slate-800 dark:text-white">
//             <p className="text-l font-bold">{comment}</p>
//           </div>
//         )}
//       </div> */}
//     </div>
//   );
// };

// export default Heatmap;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";
import RatingSystem from "../RatingFile/RatingSystem";
import { generatePlot } from "../../services/mtmApi";

const Heatmap = ({ symbol }) => {
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

  // Fetch heatmap data
  const fetchHeatmapData = useCallback(
    async (symbol) => {
      if (!symbol) return;

      const cacheKey = `corr_heatmap_${symbol}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setPlotData(cachedData);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await generatePlot(symbol, "performance_heatmap");
        setPlotData(result);
        setCachedData(cacheKey, result);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
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
      fetchHeatmapData(symbol);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(handler); // Cleanup on unmount or symbol change
  }, [symbol, fetchHeatmapData]);

  const handleRatingUpdate = (newRating) => {
    console.log("heatmap:", newRating);
  };

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
      data: plotData.heatmap_data || null,
      layout: {
        ...plotData.layout,
        autosize: true,
        responsive: true,
        margin: {
          t: window.innerWidth < 640 ? 40 : 50,
          l: window.innerWidth < 640 ? 40 : 50,
          r: window.innerWidth < 640 ? 20 : 30,
          b: window.innerWidth < 640 ? 40 : 50,
          pad: 4, // Add padding for small screens
        },
        xaxis: {
          ...plotData.layout.xaxis,
          automargin: true, // Automatically adjust margins for labels
          tickangle: window.innerWidth < 640 ? 45 : 0, // Rotate ticks on small screens
          tickfont: { size: window.innerWidth < 640 ? 10 : 12 },
        },
        yaxis: {
          ...plotData.layout.yaxis,
          automargin: true,
          tickfont: { size: window.innerWidth < 640 ? 10 : 12 },
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

  // return (
  //   <div className="relative w-full h-[calc(100vh-12rem)] sm:h-[calc(100vh-8rem)] md:h-[600px] max-h-[800px]">
  //     {isLoading && (
  //       <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300 z-10">
  //         <HashLoader color="#0369a1" size={window.innerWidth < 640 ? 40 : 60} />
  //         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-sm sm:text-lg animate-pulse">
  //           CMDA...
  //         </p>
  //       </div>
  //     )}
  //     {/* Reusable Rating Component */}
  //     <div className="flex items-center justify-end pb-4 border-b border-gray-200">
  //       <div className="text-right">
  //         {/* <p className="text-sm font-medium text-gray-700 mb-2"></p> */}
  //         <RatingSystem
  //           plotType="performance_heatmap"
  //           onRatingUpdate={handleRatingUpdate}
  //         />
  //       </div>
  //     </div>
  //     {memoizedData && (
  //       <Plot
  //         data={memoizedData}
  //         layout={memoizedLayout}
  //         useResizeHandler={true}
  //         style={{ width: "100%", height: "600px", opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease" }}
  //         config={memoizedConfig}
  //       />
  //     )}

  //   </div>
  // );

  return (
    // <div className="w-full mx-auto p-4 sm:p-6 lg:p-8">
    //   {/* Card Container */}
    //   <div className="bg-white dark:bg-gray-800  overflow-hidden transition-all duration-300 ">
    //     {/* Header */}
    //     <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
    //       <div className="flex justify-between items-center">

    //       </div>
    //     </div>

    //     {/* Rating Section */}
    //     <div className="flex justify-end p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
    //       <div className="flex items-center gap-2">
    //         <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">

    //         </span>
    //         <RatingSystem
    //           plotType="performance_heatmap"
    //           onRatingUpdate={handleRatingUpdate}
    //           className="flex items-center"
    //           aria-label="Rate performance heatmap analysis"
    //         />
    //       </div>
    //     </div>

    //     {/* Plot Section */}
    //     <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] max-h-[800px]">
    //       {isLoading && (
    //         <div
    //           className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-opacity duration-300 z-10"
    //           aria-live="polite"
    //           aria-busy="true"
    //         >
    //           <HashLoader
    //             color="#0369a1"
    //             size={window.innerWidth < 640 ? 40 : 60}
    //             aria-label="Loading performance heatmap"
    //           />
    //           <p className="mt-4 text-sky-700 dark:text-gray-200 font-semibold text-sm sm:text-base animate-pulse">
    //             Loading Heatmap...
    //           </p>
    //         </div>
    //       )}
    //       {memoizedData && (
    //         <Plot
    //           data={memoizedData}
    //           layout={{
    //             ...memoizedLayout,
    //             autosize: true,
    //             margin: { t: 40, l: 50, r: 50, b: 60 },
    //             font: { family: "Inter, sans-serif", color: "#1f2937" },
    //             paper_bgcolor: "rgba(0,0,0,0)",
    //             plot_bgcolor: "rgba(0,0,0,0)",
    //           }}
    //           config={{
    //             ...memoizedConfig,
    //             responsive: true,
    //             displaylogo: false,
    //             displayModeBar: false, // This completely hides the toolbar
    //             scrollZoom: false,
    //             doubleClick: false,
    //             showTips: false,
    //             staticPlot: true
    //           }}
    //           useResizeHandler={true}
    //           className="w-full h-full transition-opacity duration-300"
    //           style={{ width: "100%", height: "100%", opacity: isLoading ? 0 : 1 }}
    //         />
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Card Container */}
      <div
        className="bg-white dark:bg-gray-800  
    overflow-hidden transition-all duration-300 "
      >
        {/* Header (optional future use) */}
        <div className="px-5 sm:px-6  flex justify-between items-center">
          {/* You can add a title or date info here later */}
        </div>

        {/* Rating Section */}
        <div className="flex justify-end px-5 sm:px-6   ">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              Rate this analysis:
            </span>
            <RatingSystem
              plotType="performance_heatmap"
              onRatingUpdate={handleRatingUpdate}
              className="flex items-center"
              aria-label="Rate performance heatmap analysis"
            />
          </div>
        </div>

        {/* Plot Section */}
        <div className="relative w-full">
          <div
            className="relative w-full 
        h-[320px] sm:h-[400px] md:h-[480px] lg:h-[540px] xl:h-[600px] 
        overflow-hidden flex items-center justify-center"
          >
            {isLoading && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center 
            bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 
            transition-opacity duration-300 z-10"
                aria-live="polite"
                aria-busy="true"
              >
                <HashLoader
                  color="#0369a1"
                  size={window.innerWidth < 640 ? 40 : 60}
                  aria-label="Loading performance heatmap"
                />
                <p className="mt-4 text-sky-700 dark:text-gray-200 font-semibold text-sm sm:text-base animate-pulse">
                  Loading Heatmap...
                </p>
              </div>
            )}

            {memoizedData && (
              <Plot
                data={memoizedData}
                layout={{
                  ...memoizedLayout,
                  autosize: true,
                  margin: { t: 10, l: 60, r: 60, b: 60 },
                  font: { family: "Inter, sans-serif", color: "#1f2937" },
                  paper_bgcolor: "rgba(0,0,0,0)",
                  plot_bgcolor: "rgba(0,0,0,0)",
                }}
                config={{
                  ...memoizedConfig,
                  responsive: true,
                  displaylogo: false,
                  displayModeBar: false, // hide toolbar
                  scrollZoom: false, // disable zoom scroll
                  doubleClick: false, // prevent reset zoom
                  staticPlot: true, // no user interaction
                }}
                useResizeHandler={true}
                className="w-full h-full transition-opacity duration-500 ease-in-out"
                style={{
                  width: "100%",
                  height: "100%",
                  opacity: isLoading ? 0 : 1,
                  overflow: "hidden",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
