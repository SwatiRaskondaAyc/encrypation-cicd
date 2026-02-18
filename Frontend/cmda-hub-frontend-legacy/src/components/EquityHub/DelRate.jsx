// import React, { useEffect, useState } from "react";
// import { IoIosPlay } from "react-icons/io";
// import { RiInformation2Fill } from "react-icons/ri";
// import { TbPlayerPauseFilled } from "react-icons/tb";
// import Plot from "react-plotly.js";

// const DelRate = ({ symbol }) => {
//   const [gaugeData, setGaugeData] = useState(null);

//   const [loading, setLoading] = useState(true);
//    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const [showComment,setShowComment]=useState(false)
//      const [isSpeaking, setIsSpeaking] = useState(false);
//      const [utterance, setUtterance] = useState(null);

//   // useEffect(() => {
//   //   if (symbol) {
//   //     fetch("http://localhost:8080/api/stocks/delivrey_rate_gauge", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ symbol }),
//   //     })
//   //       .then((response) => {
//   //         if (!response.ok) {
//   //           throw new Error(`HTTP error! status: ${response.status}`);
//   //         }
//   //         return response.json();
//   //       })
//   //       .then((result) => {
//   //         console.log("Gauge Data:", result); // Debugging: Check fetched data
//   //         setGaugeData(result || null);
//   //         setComment(result.comment || "");
//   //       })
//   //       .catch((error) => console.error("Error fetching gauge data:", error))
//   //       .finally(() => setLoading(false));
//   //   }
//   // }, [symbol]); // Fetch data when symbol changes

//   const handlePlayVoice = () => {
//     if (isSpeaking) {
//       // If speaking, stop the speech and store the position
//       speechSynthesis.cancel();
//       setIsSpeaking(false);
//     } else if (plotData && plotData.comment) {
//       // If not speaking, start the speech from the last position or from the start
//       const newUtterance = new SpeechSynthesisUtterance(plotData.comment);
//       newUtterance.onstart = () => setIsSpeaking(true);
//       newUtterance.onend = () => setIsSpeaking(false);
//       newUtterance.onboundary = (event) => {
//         if (event.name === "word") {
//           // Store the position in words
//           setSpeechPosition(event.charIndex);
//         }
//       };

//       // If we already have a speech position, start from there
//       if (speechPosition > 0) {
//         newUtterance.text = plotData.comment.substring(speechPosition);
//       }

//       speechSynthesis.speak(newUtterance);
//       setUtterance(newUtterance); // Store the utterance for future control
//     }
//   };
//   useEffect(() => {
//     if (symbol) {
//       fetch(`${API_BASE}/api/stocks/delivrey_rate_gauge`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ symbol }),
//       })
//         .then((response) => response.json())
//         .then((result) => {
//           console.log("Full Gauge Data:", result); // Debugging: Check full JSON response
//           console.log("Annotations:", result.layout.annotations); // Check if annotations exist
//           setGaugeData(result || null);
//           setComment(result.comment || "");
//         })
//         .catch((error) => console.error("Error fetching gauge data:", error))
//         .finally(() => setLoading(false));
//     }
//   }, [symbol]);

//   if (!gaugeData) return <span className="loading loading-bars loading-lg"></span>;

//   const { avg_delivery_rate_1Y, avg_delivery_rate_Xperiod } = gaugeData;

//   return (
//     <div>
//       <h3>Market Mood: Delivery Trends & Trading Sentiment</h3>
//       <Plot
//         data={[
//           {
//             type: "indicator",
//             mode: "gauge+number",
//             value: avg_delivery_rate_Xperiod,
//             title: { text: "Delivery Rate", font: { size: 24 } },
//             gauge: {
//               axis: { range: [0, 100], tickwidth: 1, tickcolor: "darkblue" },
//               bar: { color: avg_delivery_rate_Xperiod > avg_delivery_rate_1Y ? "green" : "red" },
//               steps: [
//                 { range: [0, 50], color: "lightgray" },
//                 { range: [50, 100], color: "gray" },
//               ],
//               threshold: {
//                 line: { color: "black", width: 4 },
//                 thickness: 0.75,
//                 value: avg_delivery_rate_1Y,
//               },
//             },
//           },
//         ]}
//         layout={{
//           // ...layout,
//            autosize: true,
//         responsive: true,
//         margin: { t: 50, l: 50, r: 30, b: 50 },
//         }}
//          useResizeHandler={true}
//       style={{ width: '100%', height: '100%' }}
//       config={{ responsive: true }}
//       />
//       <div className="bg-gray-200 p-4 dark:bg-slate-500 dark:text-white">
//              {/* Button container with background */}
//              <div className="bg-white flex justify-center items-center space-x-4 p-3 rounded-lg shadow-md dark:bg-slate-800 dark:text-white">
//                <button
//                  className="px-6 text-xl font-bold"
//                  onClick={() => setShowComment(!showComment)}
//                >
//                  {showComment ? 'Hide info' : <RiInformation2Fill />}
//                </button>

//                <button
//                  className="text-xl font-bold"
//                  onClick={handlePlayVoice}
//                  disabled={isSpeaking && !speechSynthesis.speaking}
//                >
//                  {isSpeaking ? <TbPlayerPauseFilled /> : <IoIosPlay />}
//                </button>
//              </div>

//              {/* Comments section */}
//              {showComment && (
//                <div className="flex justify-center items-center mt-4 p-4 border rounded bg-gray-100 dark:bg-slate-800 dark:text-white">
//                  <p className="text-l font-bold">{plotData.comment}</p>
//                </div>
//              )}
//            </div>
//     </div>
//   );
// };

// export default DelRate;

// import React, { useEffect, useState } from "react";
// import { IoIosPlay } from "react-icons/io";
// import { RiInformation2Fill } from "react-icons/ri";
// import { TbPlayerPauseFilled } from "react-icons/tb";
// import Plot from "react-plotly.js";

// const DelRate = ({ symbol }) => {
//   const [gaugeData, setGaugeData] = useState(null);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showComment, setShowComment] = useState(false);
//   // const [isSpeaking, setIsSpeaking] = useState(false);
//   // const [utterance, setUtterance] = useState(null);
//   // const [speechPosition, setSpeechPosition] = useState(0);

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     if (symbol) {
//       fetch(`${API_BASE}/api/stocks/delivrey_rate_gauge`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ symbol }),
//       })
//         .then((res) => res.json())
//         .then((result) => {
//           setGaugeData(result || null);
//           setComment(result.comment || "");
//         })
//         .catch((err) => console.error("Error fetching gauge data:", err))
//         .finally(() => setLoading(false));
//     }
//   }, [symbol]);

//   // const handlePlayVoice = () => {
//   //   if (isSpeaking) {
//   //     speechSynthesis.cancel();
//   //     setIsSpeaking(false);
//   //   } else if (comment) {
//   //     const newUtterance = new SpeechSynthesisUtterance(comment.substring(speechPosition));
//   //     newUtterance.onstart = () => setIsSpeaking(true);
//   //     newUtterance.onend = () => {
//   //       setIsSpeaking(false);
//   //       setSpeechPosition(0);
//   //     };
//   //     newUtterance.onboundary = (event) => {
//   //       if (event.name === "word") {
//   //         setSpeechPosition(event.charIndex);
//   //       }
//   //     };
//   //     speechSynthesis.speak(newUtterance);
//   //     setUtterance(newUtterance);
//   //   }
//   // };

//   if (loading) return <span className="loading loading-bars loading-lg"></span>;
//   if (!gaugeData) return <p>No gauge data available.</p>;

//   const { avg_delivery_rate_1Y, avg_delivery_rate_Xperiod,config } = gaugeData;

//   const layout = {
//     autosize: true,
//     responsive: true,
//     margin: { t: 50, l: 50, r: 30, b: 50 },
//   };

//   return (
//     <div className="space-y-6">
//       <h3 className="text-lg font-semibold">Market Mood: Delivery Trends & Trading Sentiment</h3>

//       <Plot
//         data={[
//           {
//             type: "indicator",
//             mode: "gauge+number",
//             value: avg_delivery_rate_Xperiod,
//             title: { text: "Delivery Rate", font: { size: 24 } },
//             gauge: {
//               axis: { range: [0, 100], tickwidth: 1, tickcolor: "darkblue" },
//               bar: {
//                 color: avg_delivery_rate_Xperiod > avg_delivery_rate_1Y ? "green" : "red",
//               },
//               steps: [
//                 { range: [0, 50], color: "lightgray" },
//                 { range: [50, 100], color: "gray" },
//               ],
//               threshold: {
//                 line: { color: "black", width: 4 },
//                 thickness: 0.75,
//                 value: avg_delivery_rate_1Y,
//               },
//             },
//           },
//         ]}
//         layout={layout}
//         useResizeHandler={true}
//         style={{ width: "100%", height: "100%" }}
//         config={{
//     responsive: true,
//     ...(config || {})  // Merge backend config safely
//   }}
//       />

//       <div className="bg-gray-200 p-4 dark:bg-slate-500 dark:text-white">
//         <div className="bg-white dark:bg-slate-800 flex justify-center items-center space-x-4 p-3 rounded-lg shadow-md">
//           <button className="px-6 text-xl font-bold" onClick={() => setShowComment(!showComment)}>
//             {showComment ? "Hide info" : <RiInformation2Fill />}
//           </button>
//           {/* <button
//             className="text-xl font-bold"
//             onClick={handlePlayVoice}
//             disabled={isSpeaking && !speechSynthesis.speaking}
//           >
//             {isSpeaking ? <TbPlayerPauseFilled /> : <IoIosPlay />}
//           </button> */}
//         </div>

//         {showComment && (
//           <div className="flex justify-center items-center mt-4 p-4 border rounded bg-gray-100 dark:bg-slate-800 dark:text-white">
//             <p className="text-l font-bold">{comment}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DelRate;

// import React, { useEffect, useState } from "react";
// // import { IoIosPlay } from "react-icons/io";
// // import { RiInformation2Fill } from "react-icons/ri";
// // import { TbPlayerPauseFilled } from "react-icons/tb";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";

// const DelRate = ({ symbol }) => {
//   const [gaugeData, setGaugeData] = useState(null);

//   const [loading, setLoading] = useState(true);

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

//     const cacheKey = `delivrey_rate_${symbol}`;
//     const cachedData = getCachedData(cacheKey);
//     if (cachedData) {
//       setGaugeData(cachedData);

//       setLoading(false);
//       return;
//     }

//     fetch(`${API_BASE}/stocks/test/market_mood`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((res) => res.json())
//       .then((result) => {
//         setGaugeData(result || null);

//         setCachedData(cacheKey, result);
//       })
//       .catch((err) => console.error("Error fetching gauge data:", err))
//       .finally(() => setLoading(false));
//   }, [symbol]);

//   if (loading) return <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//     <HashLoader color="#0369a1" size={60} />
//     <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//       CMDA...
//     </p>
//   </div>;
//   if (!gaugeData) return <p>No gauge data available.</p>;

//   const { avg_delivery_rate_1Y, avg_delivery_rate_Xperiod, config } = gaugeData;

//   const layout = {
//     autosize: true,
//     responsive: true,
//     margin: { t: 50, l: 50, r: 30, b: 50 },
//   };

//   return (
//     <div className="space-y-6">
//       {/* <h3 className="text-lg font-semibold">Market Mood: Delivery Trends & Trading Sentiment</h3> */}
//       <Plot
//         data={[
//           {
//             type: "indicator",
//             mode: "gauge+number",
//             value: avg_delivery_rate_Xperiod,
//             title: { text: "Delivery Rate", font: { size: 24 } },
//             gauge: {
//               axis: { range: [0, 100], tickwidth: 1, tickcolor: "darkblue" },
//               bar: {
//                 color: avg_delivery_rate_Xperiod > avg_delivery_rate_1Y ? "green" : "red",
//               },
//               steps: [
//                 { range: [0, 50], color: "lightgray" },
//                 { range: [50, 100], color: "gray" },
//               ],
//               threshold: {
//                 line: { color: "black", width: 4 },
//                 thickness: 0.75,
//                 value: avg_delivery_rate_1Y,
//               },
//             },
//           },
//         ]}
//         layout={layout}
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

// export default DelRate;

// import React, { useEffect, useState } from "react";
// // import { IoIosPlay } from "react-icons/io";
// // import { RiInformation2Fill } from "react-icons/ri";
// // import { TbPlayerPauseFilled } from "react-icons/tb";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";
// import RatingSystem from "../RatingFile/RatingSystem";

// const DelRate = ({ symbol }) => {
//   const [gaugeData, setGaugeData] = useState(null);

//   const [loading, setLoading] = useState(true);

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

//   const handleRatingUpdate = (newRating) => {
//     console.log("delrate:", newRating);
//   };

//   const setCachedData = (key, data) => {
//     localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//   };

//   useEffect(() => {
//     if (!symbol) return;

//     const cacheKey = `delivrey_rate_${symbol}`;
//     const cachedData = getCachedData(cacheKey);
//     if (cachedData) {
//       setGaugeData(cachedData);

//       setLoading(false);
//       return;
//     }

//     fetch(`${API_BASE}/stocks/test/market_mood`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((res) => res.json())
//       .then((result) => {
//         setGaugeData(result || null);

//         setCachedData(cacheKey, result);
//       })
//       .catch((err) => console.error("Error fetching gauge data:", err))
//       .finally(() => setLoading(false));
//   }, [symbol]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[300px]">
//         <HashLoader color="#0369a1" size={60} />
//         <p>Loading Delivery Rate...</p>
//       </div>
//     );
//   }
//   if (!gaugeData) {
//     return (
//       <div className="error-container">
//         <p>No gauge data available for {symbol}.</p>
//         <button onClick={() => setLoading(true)}>Retry</button>
//       </div>
//     );
//   }
//   const { avg_delivery_rate_1Y, avg_delivery_rate_Xperiod, config } = gaugeData;

//   const layout = {
//     autosize: true,
//     responsive: true,
//     margin: { t: 50, l: 50, r: 30, b: 50 },
//     height: 300,
//   };

//   // return (
//   //   <div className="space-y-6">
//   //     {/* <h3 className="text-lg font-semibold">Market Mood: Delivery Trends & Trading Sentiment</h3> */}
//   //     {/* Reusable Rating Component */}
//   //     <div className="flex items-center justify-end pb-4 border-b border-gray-200">
//   //       <div className="text-right">
//   //         {/* <p className="text-sm font-medium text-gray-700 mb-2"></p> */}
//   //         <RatingSystem
//   //           plotType="market_mood"
//   //           onRatingUpdate={handleRatingUpdate}
//   //         />
//   //       </div>
//   //     </div>
//   //     <Plot
//   //       data={[
//   //         {
//   //           type: "indicator",
//   //           mode: "gauge+number",
//   //           value: avg_delivery_rate_Xperiod,
//   //           title: { text: "Delivery Rate", font: { size: 24 } },
//   //           gauge: {
//   //             axis: { range: [0, 100], tickwidth: 1, tickcolor: "darkblue" },
//   //             bar: {
//   //               color: avg_delivery_rate_Xperiod > avg_delivery_rate_1Y ? "green" : "red",
//   //             },
//   //             steps: [
//   //               { range: [0, 50], color: "lightgray" },
//   //               { range: [50, 100], color: "gray" },
//   //             ],
//   //             threshold: {
//   //               line: { color: "black", width: 4 },
//   //               thickness: 0.75,
//   //               value: avg_delivery_rate_1Y,
//   //             },
//   //           },
//   //         },
//   //       ]}
//   //       layout={{
//   //         autosize: true,
//   //         responsive: true,
//   //         margin: { t: 50, l: 50, r: 30, b: 50 },
//   //         height: 600, // Set minimum height
//   //       }}
//   //       useResizeHandler={true}
//   //       style={{ width: '100%', minHeight: '600px' }}
//   //       config={{
//   //         responsive: true,
//   //         ...(config || {})
//   //       }}
//   //     />

//   //   </div>
//   // );

//   return (
//     <div className="w-full  mx-auto p-4 sm:p-6 lg:p-8">
//       {/* Card Container */}
//       <div className="bg-white dark:bg-gray-800  overflow-hidden transition-all duration-300 ">
//         {/* Header */}
//         <div className="p-4 sm:p-6 ">
//           {/* <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
//             Gauge showing delivery rate compared to 1-year average
//           </h3> */}
//           <div className="flex justify-end p-4 sm:p-5 ">
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">

//               </span>
//               <RatingSystem
//                 plotType="market_mood"
//                 onRatingUpdate={handleRatingUpdate}
//                 className="flex items-center"
//                 aria-label="Rate market mood analysis"
//               />
//             </div>
//           </div>
//           {/* <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Gauge showing delivery rate compared to 1-year average
//           </p> */}
//         </div>

//         {/* Rating Section */}
//         {/* <div className="flex justify-end p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">

//             </span>
//             <RatingSystem
//               plotType="market_mood"
//               onRatingUpdate={handleRatingUpdate}
//               className="flex items-center"
//               aria-label="Rate market mood analysis"
//             />
//           </div>
//         </div> */}

//         {/* Gauge Plot */}
//         <div className="p-4 sm:p-6">
//           <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
//             <Plot
//               data={[
//                 {
//                   type: "indicator",
//                   mode: "gauge+number",
//                   value: avg_delivery_rate_Xperiod,
//                   title: {
//                     text: "Delivery Rate (%)",
//                     font: { size: 20, family: "Inter, sans-serif", color: "#1f2937" },
//                   },
//                   number: { suffix: "%", font: { size: 28, color: "#1f2937" } },
//                   gauge: {
//                     axis: {
//                       range: [0, 100],
//                       tickwidth: 2,
//                       tickcolor: "#1e3a8a",
//                       tickfont: { size: 14, family: "Inter, sans-serif" },
//                     },
//                     bar: {
//                       color: avg_delivery_rate_Xperiod > avg_delivery_rate_1Y ? "#22c55e" : "#ef4444",
//                       thickness: 0.2,
//                     },
//                     bgcolor: "#f3f4f6",
//                     bordercolor: "#d1d5db",
//                     steps: [
//                       { range: [0, 50], color: "#e5e7eb" },
//                       { range: [50, 100], color: "#d1d5db" },
//                     ],
//                     threshold: {
//                       line: { color: "#1e3a8a", width: 4 },
//                       thickness: 0.8,
//                       value: avg_delivery_rate_1Y,
//                     },
//                   },
//                 },
//               ]}
//               layout={{
//                 autosize: true,
//                 margin: { t: 60, l: 40, r: 40, b: 60 },
//                 font: { family: "Inter, sans-serif", color: "#1f2937" },
//                 paper_bgcolor: "rgba(0,0,0,0)",
//                 plot_bgcolor: "rgba(0,0,0,0)",
//               }}
//               config={{
//                 responsive: true,
//                 displayModeBar: true,
//                 displaylogo: false,
//                 ...config,
//               }}
//               useResizeHandler={true}
//               className="w-full h-full"
//               style={{ width: "100%", height: "100%" }}
//             />
//           </div>
//         </div>

//         {/* Legend/Info */}
//         <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300">
//           <div className="flex flex-col sm:flex-row justify-between gap-2">
//             <div className="flex items-center gap-2">
//               <span className="w-4 h-4 rounded-full bg-green-500"></span>
//               <span>Higher than 1-year average ({avg_delivery_rate_1Y.toFixed(1)}%)</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="w-4 h-4 rounded-full bg-red-500"></span>
//               <span>Lower than 1-year average ({avg_delivery_rate_1Y.toFixed(1)}%)</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DelRate;

import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";
import RatingSystem from "../RatingFile/RatingSystem";
import { generatePlot } from "../../services/mtmApi";

const DelRate = ({ symbol }) => {
  const [gaugeData, setGaugeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour

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

  const handleRatingUpdate = (newRating) => {
    console.log("delrate:", newRating);
  };

  useEffect(() => {
    if (!symbol) return;
    const cacheKey = `delivery_rate_${symbol}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      setGaugeData(cached);
      setLoading(false);
      return;
    }

    // Use MTM API service
    generatePlot(symbol, "market_mood")
      .then((result) => {
        setGaugeData(result || null);
        setCachedData(cacheKey, result);
      })
      .catch((err) => console.error("Error fetching gauge data:", err))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ">
        <HashLoader color="#0ea5e9" size={60} />
        <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm">
          Loading Delivery Rate...
        </p>
      </div>
    );
  }

  if (!gaugeData) {
    return (
      <div className="text-center p-8  bg-white dark:bg-gray-800">
        <p className="text-gray-700 dark:text-gray-300">
          No gauge data available for <strong>{symbol}</strong>.
        </p>
        <button
          onClick={() => setLoading(true)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium  hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const { avg_delivery_rate_1Y, avg_delivery_rate_Xperiod, config } = gaugeData;

  return (
    <div className="w-full bg-transparent">
      <div
        className="relative bg-white dark:bg-gray-800  
       duration-300 overflow-hidden"
      >
        {/* Rating Header */}
        <div className="flex justify-end  ">
          <RatingSystem
            plotType="market_mood"
            onRatingUpdate={handleRatingUpdate}
            aria-label="Rate market mood analysis"
          />
        </div>

        {/* Gauge Section */}
        <div className=" flex items-center justify-center">
          <div className="w-full max-w-[700px] h-[380px] sm:h-[420px] md:h-[450px] lg:h-[480px] overflow-hidden">
            <Plot
              data={[
                {
                  type: "indicator",
                  mode: "gauge+number",
                  value: avg_delivery_rate_Xperiod,
                  title: {
                    text: "Delivery Rate",
                    font: {
                      size: 22,
                      family: "Inter, sans-serif",
                      color: "#111827",
                    },
                  },
                  number: { suffix: "%", font: { size: 30, color: "#1e293b" } },
                  gauge: {
                    axis: {
                      range: [0, 100],
                      tickwidth: 2,
                      tickcolor: "#1e3a8a",
                      tickfont: { size: 14, family: "Inter, sans-serif" },
                    },
                    bar: {
                      color:
                        avg_delivery_rate_Xperiod > avg_delivery_rate_1Y
                          ? "#22c55e"
                          : "#ef4444",
                      thickness: 0.25,
                    },
                    bgcolor: "transparent",
                    bordercolor: "#d1d5db",
                    steps: [
                      { range: [0, 50], color: "#e5e7eb" },
                      { range: [50, 100], color: "#d1d5db" },
                    ],
                    threshold: {
                      line: { color: "#1e3a8a", width: 4 },
                      thickness: 0.8,
                      value: avg_delivery_rate_1Y,
                    },
                  },
                },
              ]}
              layout={{
                autosize: true,
                margin: { t: 40, l: 30, r: 30, b: 40 },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
              }}
              config={{
                responsive: true,
                displayModeBar: false, // removes toolbar
                displaylogo: false,
                scrollZoom: false, // disables scroll zoom
                staticPlot: true, // completely disables interactions
                ...config,
              }}
              useResizeHandler
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
              className="overflow-hidden pointer-events-none select-none"
            />
          </div>
        </div>

        {/* Legend Section */}
        <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-700 ">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4  bg-green-500"></span>
              <span>
                Above 1Y Average ({avg_delivery_rate_1Y?.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4  bg-red-500"></span>
              <span>
                Below 1Y Average ({avg_delivery_rate_1Y?.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelRate;
