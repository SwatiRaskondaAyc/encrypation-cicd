// import React, { useState, useEffect } from "react";
// import { RiInformation2Fill } from "react-icons/ri";
// import Plot from "react-plotly.js";

// const LastTraded = ({ symbol }) => {
//   const [plotData, setPlotData] = useState(null);
//    const [showComment, setShowComment] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//   if (!symbol) return;

//   fetch(`${API_BASE}/api/stocks/last_traded_price`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ symbol }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Received plotData:", data);
//       setPlotData(data);
//     })
//     .catch((error) => {
//       console.error("Error fetching plot data:", error);
//     });
// }, [symbol]);

//   if (!plotData || !plotData.figure || !plotData.figure.data) {
//   return <span className="loading loading-bars loading-lg"></span>;
// }

//   return (
//     <div className="relative mb-3">
//       <Plot
//         data={plotData.figure.data}
//         layout={{
//   ...plotData.figure.layout,
//   autosize: true,
//   responsive: true,
//   margin: { t: 50, l: 50, r: 30, b: 50 },
//   font: { family: "Arial", size: 12, color: "black" },
//   xaxis: {
//     ...plotData.figure.layout?.xaxis,
//     title: { text: "", font: { size: 14 } },
//     tickfont: { size: 17 },
//   },
//   yaxis: {
//     ...plotData.figure.layout?.yaxis,
//     title: { text: "Traded Price", font: { size: 14 } },
//     tickfont: { size: 17 },
//   },
//   showlegend: true,
// }}

//         useResizeHandler={true}
//         style={{ width: "100%", height: "100%" }}
//         config={plotData.config}
//       />

//       <div className="bg-gray-200 p-4 dark:bg-slate-500 dark:text-white">
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
//             <p
//               className="text-l font-bold"
//               dangerouslySetInnerHTML={{ __html: plotData.comment }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LastTraded;

// import React, { useState, useEffect } from "react";
// // import { RiInformation2Fill } from "react-icons/ri";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";

// const LastTraded = ({ symbol }) => {
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

//     const cacheKey = `last_traded_${symbol}`;
//     const cachedData = getCachedData(cacheKey);
//     if (cachedData) {
//       setPlotData(cachedData);
//       return;
//     }

//     fetch(`${API_BASE}/stocks/test/box_plot`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Received plotData:", data);
//         setPlotData(data);
//         setCachedData(cacheKey, data);
//       })
//       .catch((error) => {
//         console.error("Error fetching plot data:", error);
//       });
//   }, [symbol]);

//   if (!plotData || !plotData.figure || !plotData.figure.data) {
//     return <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>;
//   }

//   return (
//     // <div className="relative mb-3">
//     //   <Plot
//     //     data={plotData.figure.data}
//     //     layout={{
//     //       ...plotData.figure.layout,
//     //       autosize: true,
//     //       responsive: true,
//     //       margin: { t: 50, l: 50, r: 30, b: 50 },
//     //       font: { family: "Arial", size: 12, color: "black" },
//     //       xaxis: {
//     //         ...plotData.figure.layout?.xaxis,
//     //         title: { text: "", font: { size: 14 } },
//     //         tickfont: { size: 17 },
//     //       },
//     //       yaxis: {
//     //         ...plotData.figure.layout?.yaxis,
//     //         title: { text: "Traded Price", font: { size: 14 } },
//     //         tickfont: { size: 17 },
//     //       },
//     //       showlegend: true,
//     //     }}
//     //     useResizeHandler={true}
//     //     style={{ width: "100%", height: "100%" }}
//     //     config={plotData.config}
//     //   />

//     // </div>
//     <div className="relative mb-6 px-4"> {/* Added horizontal padding */}
//       <Plot
//         data={plotData.figure.data}
//         layout={{
//           ...plotData.figure.layout,
//           autosize: true,
//           responsive: true,
//           margin: { t: 40, l: 60, r: 40, b: 60 }, // more breathing space
//           font: { family: "Arial, sans-serif", size: 13, color: "#111" },
//           xaxis: {
//             ...plotData.figure.layout?.xaxis,
//             title: { text: "", font: { size: 15 } },
//             tickfont: { size: 15 },
//             automargin: true,
//           },
//           yaxis: {
//             ...plotData.figure.layout?.yaxis,
//             title: { text: "Traded Price", font: { size: 15 } },
//             tickfont: { size: 15 },
//             automargin: true,
//           },
//           showlegend: true,
//           legend: {
//             orientation: "h",
//             yanchor: "bottom",
//             y: -0.25,
//             xanchor: "center",
//             x: 0.5,
//           },
//         }}
//         useResizeHandler={true}
//         style={{ width: "100%", height: "100%", minHeight: "450px" }}
//         config={plotData.config}
//       />

//       {/* Info Section */}

//     </div>

//   );
// };

// export default LastTraded;

// import React, { useState, useEffect } from "react";
// import Plot from "react-plotly.js";

// import { HashLoader } from "react-spinners";
// import RatingSystem from "../RatingFile/RatingSystem";

// const LastTraded = ({ symbol }) => {
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

//     const cacheKey = `last_traded_${symbol}`;
//     const cachedData = getCachedData(cacheKey);
//     if (cachedData) {
//       setPlotData(cachedData);
//       return;
//     }

//     fetch(`${API_BASE}/stocks/test/box_plot`, {
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
//       .catch((error) => {
//         console.error("Error fetching plot data:", error);
//       });
//   }, [symbol]);

//   if (!plotData || !plotData.figure || !plotData.figure.data) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           CMDA...
//         </p>
//       </div>
//     );
//   }

//   const handleRatingUpdate = (newRating) => {
//     console.log("box plot:", newRating);
//   };

//   // return (
//   //   <div className="relative w-full min-h-[600px] max-w-[900px] mx-auto p-4 sm:p-2">
//   //     {/* Reusable Rating Component */}
//   //     <div className="flex items-center justify-end pb-4 border-b border-gray-200">
//   //       <div className="text-right">
//   //         {/* <p className="text-sm font-medium text-gray-700 mb-2"></p> */}
//   //         <RatingSystem
//   //           plotType="box-plot"
//   //           onRatingUpdate={handleRatingUpdate}
//   //         />
//   //       </div>
//   //     </div>
//   //     <Plot
//   //       data={plotData.figure.data}
//   //       layout={{
//   //         ...plotData.figure.layout,
//   //         autosize: true,
//   //         margin: { t: 40, l: 60, r: 40, b: 60 },
//   //         font: { family: "Arial, sans-serif", size: 13 },
//   //         xaxis: {
//   //           ...plotData.figure.layout?.xaxis,
//   //           title: { text: "", font: { size: 15 } },
//   //           tickfont: { size: 15 },
//   //           automargin: true,
//   //         },
//   //         yaxis: {
//   //           ...plotData.figure.layout?.yaxis,
//   //           title: { text: "Traded Price", font: { size: 15 } },
//   //           tickfont: { size: 15 },
//   //           automargin: true,
//   //         },
//   //         showlegend: true,
//   //         legend: {
//   //           orientation: "h",
//   //           yanchor: "bottom",
//   //           y: -0.25,
//   //           xanchor: "center",
//   //           x: 0.5,
//   //         },
//   //       }}
//   //       useResizeHandler={true}
//   //       config={{
//   //         displaylogo: false,
//   //         responsive: true,
//   //         ...plotData.config,
//   //       }}
//   //       className="w-full h-[600px] sm:h-[500px]"
//   //     />
//   //   </div>
//   // );
//   return (
//     <div className="w-full  mx-auto p-4 sm:p-6 lg:p-8">
//       {/* Card Container */}
//       <div className="bg-white dark:bg-gray-800 ">

//         {/* Rating Section */}
//         <div className="flex justify-end p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">

//             </span>
//             <RatingSystem
//               plotType="box_plot"
//               onRatingUpdate={handleRatingUpdate}
//               className="flex items-center"
//               aria-label="Rate box plot analysis"
//             />
//           </div>
//         </div>

//         {/* Plot Section */}
//         <div className="p-4 sm:p-6 animate-fade-in">
//           <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
//             <Plot
//               data={plotData.figure.data}
//               layout={{
//                 ...plotData.figure.layout,
//                 autosize: true,
//                 margin: { t: 50, l: 100, r: 100, b: 120 },
//                 font: { family: "Inter, sans-serif", size: 14, color: "#1f2937" },
//                 xaxis: {
//                   ...plotData.figure.layout?.xaxis,
//                   title: { text: "Time", font: { size: 16 } },
//                   tickfont: { size: 14 },
//                   automargin: true,
//                   gridcolor: "#e5e7eb",
//                   zerolinecolor: "#d1d5db",
//                 },
//                 yaxis: {
//                   ...plotData.figure.layout?.yaxis,
//                   title: { text: "Traded Price (₹)", font: { size: 16 } },
//                   tickfont: { size: 14 },
//                   automargin: true,
//                   gridcolor: "#e5e7eb",
//                   zerolinecolor: "#d1d5db",
//                 },
//                 showlegend: true,
//                 legend: {
//                   orientation: "h",
//                   yanchor: "bottom",
//                   y: -0.4,
//                   xanchor: "center",
//                   x: 0.5,
//                   font: { size: 12 },
//                   bgcolor: "rgba(255, 255, 255, 0.8)",
//                   bordercolor: "#e5e7eb",
//                   borderwidth: 1,
//                 },
//                 paper_bgcolor: "rgba(0,0,0,0)",
//                 plot_bgcolor: "rgba(0,0,0,0)",
//                 hovermode: "closest",
//               }}
//               config={{
//                 displaylogo: false,
//                 responsive: true,
//                 displayModeBar: true,
//                 modeBarButtonsToRemove: ["toImage"],
//                 ...plotData.config,
//               }}
//               useResizeHandler={true}
//               className="w-full h-full"
//               style={{ width: "100%", height: "100%" }}
//             />
//           </div>
//         </div>

//         {/* Info/Note Section */}
//         <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300">
//           <p>
//             This box plot visualizes the distribution of traded prices over time. Each box shows the interquartile range (IQR), whiskers indicate the full range, and outliers are marked as points. Data is dynamically fetched based on selected stock fundamentals.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LastTraded;

import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";
import RatingSystem from "../RatingFile/RatingSystem";
import { generatePlot } from "../../services/mtmApi";

const LastTraded = ({ symbol }) => {
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const CACHE_TTL = 60 * 60 * 1000;

  const getCachedData = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  };

  const setCachedData = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  useEffect(() => {
    if (!symbol) return;

    const cacheKey = `last_traded_${symbol}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setPlotData(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Use MTM API service
    generatePlot(symbol, "box_plot")
      .then((data) => {
        setPlotData(data);
        setCachedData(cacheKey, data);
      })
      .catch((error) => {
        console.error("Error fetching plot data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [symbol]);

  const handleRatingUpdate = (newRating) => {
    console.log("box plot:", newRating);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-2xl p-6">
        <HashLoader color="#0369a1" size={50} />
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
          Loading Price Distribution...
        </p>
      </div>
    );
  }

  if (!plotData || !plotData.figure || !plotData.figure.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
        <div className="text-yellow-500 text-4xl mb-4">📊</div>
        <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mb-2">
          No Data Available
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Unable to load box plot data for {symbol}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Compact Card Container */}
      <div className="bg-white dark:bg-gray-800   overflow-hidden">
        {/* Header with Title and Rating */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              Price Distribution Analysis
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Box plot showing traded price ranges over time for {symbol}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RatingSystem
              plotType="box_plot"
              onRatingUpdate={handleRatingUpdate}
              compact={true}
              aria-label="Rate box plot analysis"
            />
          </div>
        </div>

        {/* Plot Section - No Scroll */}
        <div className="p-4 sm:p-6">
          <div className="relative w-full h-[350px] sm:h-[400px]">
            <Plot
              data={plotData.figure.data}
              layout={{
                ...plotData.figure.layout,
                autosize: true,
                margin: { t: 40, l: 70, r: 40, b: 70 },
                font: {
                  family: "Inter, sans-serif",
                  size: 12,
                  color: "#374151",
                },
                xaxis: {
                  ...plotData.figure.layout?.xaxis,
                  title: {
                    text: "Time Period",
                    font: { size: 13, weight: "bold" },
                    standoff: 10,
                  },
                  tickfont: { size: 11 },
                  automargin: true,
                  gridcolor: "#f3f4f6",
                  zerolinecolor: "#d1d5db",
                  zerolinewidth: 1,
                },
                yaxis: {
                  ...plotData.figure.layout?.yaxis,
                  title: {
                    text: "Traded Price (₹)",
                    font: { size: 13, weight: "bold" },
                    standoff: 10,
                  },
                  tickfont: { size: 11 },
                  automargin: true,
                  gridcolor: "#f3f4f6",
                  zerolinecolor: "#d1d5db",
                  zerolinewidth: 1,
                },
                showlegend: true,
                legend: {
                  orientation: "h",
                  yanchor: "top",
                  y: -0.15,
                  xanchor: "center",
                  x: 0.5,
                  font: { size: 11 },
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  bordercolor: "#e5e7eb",
                  borderwidth: 1,
                  itemclick: "toggle",
                  itemdoubleclick: "toggleothers",
                },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                hovermode: "closest",
                hoverlabel: {
                  bgcolor: "#1f2937",
                  font: { color: "white", size: 11 },
                },
              }}
              config={{
                displaylogo: false,
                responsive: true,
                displayModeBar: true,
                modeBarButtonsToRemove: [
                  "pan2d",
                  "lasso2d",
                  "select2d",
                  "toImage",
                  "autoScale2d",
                ],
                modeBarButtonsToAdd: [],
                displayModeBar: "hover",
                ...plotData.config,
              }}
              useResizeHandler={true}
              style={{
                width: "100%",
                height: "100%",
                minHeight: "300px",
              }}
            />
          </div>
        </div>

        {/* Quick Stats & Info */}
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box Plot Explanation */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                <span className="text-blue-500">📊</span>
                Understanding the Box Plot
              </h3>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <span>
                    <strong>Box:</strong> Interquartile Range (IQR) - Middle 50%
                    of data
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-gray-400"></div>
                  <span>
                    <strong>Line in box:</strong> Median value
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-gray-600 border-t border-b border-gray-600"></div>
                  <span>
                    <strong>Whiskers:</strong> Range of typical values
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>
                    <strong>Points:</strong> Outliers - unusual price movements
                  </span>
                </div>
              </div>
            </div>

            {/* Data Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                <span className="text-green-500">💡</span>
                Key Insights
              </h3>
              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
                <p>• Shows price volatility and distribution patterns</p>
                <p>• Helps identify support and resistance levels</p>
                <p>• Reveals unusual trading activity (outliers)</p>
                <p>• Compares price behavior across time periods</p>
              </div>
            </div>
          </div>

          {/* Data Source Note */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Data dynamically fetched based on {symbol} fundamentals. Chart
              updates reflect latest market conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastTraded;
