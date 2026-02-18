

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Plot from "react-plotly.js";
// import { useGraphData } from "./GraphDataContext";
// import { HashLoader } from "react-spinners";

// const InvAmtPlot = () => {
//   const [graphData, setLocalGraphData] = useState(null); // Renamed to avoid conflict
//   const [error, setError] = useState("");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const { getGraphData, setGraphData } = useGraphData();

//   useEffect(() => {
//     const fetchGraphData = async () => {
//       const uploadId = localStorage.getItem("uploadId");
//       const cacheKey = `invested_amount_plot_${uploadId}`;

//       if (!uploadId) {
//         setError("Please upload a file first.");
//         return;
//       }

//       // Check cache first
//       const cachedData = getGraphData(cacheKey);
//       if (cachedData) {
//         setLocalGraphData(cachedData);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE}/file/create_invested_amount_plot`,
//           new URLSearchParams({ uploadId })
//         );

//         console.log("InvAmtPlot Data:", response.data);

//         if (!response.data || !response.data.figure) {
//           setError("Graph generation failed. Please check the data or try again.");
//           return;
//         }

//         const convertedData = response.data.figure.data.map((trace) => ({
//           ...trace,
//           y: Array.isArray(trace.y)
//             ? trace.y.map((value) => (!isNaN(value) ? parseFloat(value) : value))
//             : trace.y,
//         }));

//         const figure = { ...response.data.figure, data: convertedData };
//         setLocalGraphData(figure);
//         // Cache the data
//         setGraphData(cacheKey, figure);
//       } catch (err) {
//         setError("Graph generation failed. Please check the data or try again.");
//         console.error("Graph InvAmtPlot API Error:", err.response ? err.response.data : err.message);
//       }
//     };

//     fetchGraphData();
//   }, [getGraphData, setGraphData]);

//   return (
//     <div>
//   {!graphData ? (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>
//   ) : (
//     <>
//       {error && <p className="text-red-500">{error}</p>}
//       {graphData && graphData.data && graphData.layout && (
//         <Plot
//           data={graphData.data}
//           layout={{
//             ...graphData.layout,
//             autosize: true,
//             responsive: true,
//             title: graphData.layout?.title || 'Invested Amount Plot',
//             margin: { t: 50, l: 50, r: 30, b: 50 },
//           }}
//           useResizeHandler={true}
//           style={{ width: '100%', height: '100%' }}
//           config={{
//             responsive: true,
//             displaylogo: false,
//             ...(graphData?.config || {}),
//           }}
//         />
//       )}
//     </>
//   )}
// </div>
//   );
// };

// export default InvAmtPlot;

// import React, { useState, useEffect } from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import { FaChartBar, FaInfoCircle, FaCrown } from "react-icons/fa";
// import { useTooltip } from "@nivo/tooltip";

// export default function InvestedAmountPlot() {
//   const [plotData, setPlotData] = useState([]);
//   const [monthIdx, setMonthIdx] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE}/file/create_invested_amount_plot`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({ uploadId }),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch data");
//         return res.json();
//       })
//       .then((json) => {
//         // Validate data structure
//         if (!json.plot_data || !Array.isArray(json.plot_data)) {
//           throw new Error("Invalid data format");
//         }
//         setPlotData(json.plot_data);
//         setIsLoading(false);
//         // Reset monthIdx if data is empty
//         if (json.plot_data.length === 0) {
//           setMonthIdx(0);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to load data:", err);
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, [uploadId]);

//   if (isLoading) {
//     return (
//       <div
//         style={{
//           width: "98vw",
//           maxWidth: "1400px",
//           padding: "20px",
//           boxSizing: "border-box",
//           fontFamily: "'Inter', 'Segoe UI', sans-serif",
//           background: "linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)",
//           borderRadius: "16px",
//           border: "1px solid #e2e8f0",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(255, 255, 255, 0.9)",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 100,
//             borderRadius: "16px",
//           }}
//         >
//           <div
//             style={{
//               width: "50px",
//               height: "50px",
//               border: "4px solid rgba(67, 97, 238, 0.2)",
//               borderTop: "4px solid #4361ee",
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//               marginBottom: "1.5rem",
//             }}
//           ></div>
//           <div
//             style={{
//               fontSize: "1.1rem",
//               fontWeight: 500,
//               color: "#495057",
//             }}
//           >
//             Loading investment data...
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         style={{
//           width: "98vw",
//           maxWidth: "1400px",
//           padding: "20px",
//           boxSizing: "border-box",
//           fontFamily: "'Inter', 'Segoe UI', sans-serif",
//           background: "linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)",
//           borderRadius: "16px",
//           border: "1px solid #e2e8f0",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "3rem",
//             textAlign: "center",
//           }}
//         >
//           <FaInfoCircle
//             style={{ fontSize: "3rem", color: "#ced4da", marginBottom: "1.5rem" }}
//           />
//           <h3
//             style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#343a40" }}
//           >
//             Data Unavailable
//           </h3>
//           <p style={{ color: "#6c757d", maxWidth: "500px" }}>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!plotData.length) {
//     return (
//       <div
//         style={{
//           width: "98vw",
//           maxWidth: "1400px",
//           padding: "20px",
//           boxSizing: "border-box",
//           fontFamily: "'Inter', 'Segoe UI', sans-serif",
//           background: "linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)",
//           borderRadius: "16px",
//           border: "1px solid #e2e8f0",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "3rem",
//             textAlign: "center",
//           }}
//         >
//           <FaInfoCircle
//             style={{ fontSize: "3rem", color: "#ced4da", marginBottom: "1.5rem" }}
//           />
//           <h3
//             style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#343a40" }}
//           >
//             No Data Available
//           </h3>
//           <p style={{ color: "#6c757d", maxWidth: "500px" }}>
//             No investment data found for visualization.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Validate monthIdx
//   const validMonthIdx = Math.min(Math.max(0, monthIdx), plotData.length - 1);
//   const { month, scrips } = plotData[validMonthIdx];
//   const filtered = scrips.filter((d) => d.invested !== 0 || d.turnover !== 0);

//   const totalInvested = filtered.reduce((sum, d) => sum + d.invested, 0);
//   const totalTurnover = filtered.reduce((sum, d) => sum + d.turnover, 0);
//   const topPerformer = filtered.length
//     ? filtered.sort((a, b) => b.turnover - a.turnover)[0].scrip
//     : null;

//   const data = filtered.map((d) => ({
//     scrip: d.scrip,
//     invested: d.invested,
//     turnover: d.turnover,
//   }));

//   const CustomBar = ({ bar }) => {
//     const { showTooltipFromEvent, hideTooltip } = useTooltip();

//     const isTopPerformer = bar.data.indexValue === topPerformer;
//     const isTurnoverBar = bar.data.id === "turnover";
//     const fillColor = isTopPerformer && isTurnoverBar ? "url(#goldGradient)" : bar.color;

//     const tooltipContent = (
//       <div
//         style={{
//           background: "white",
//           padding: "16px",
//           borderRadius: "8px",
//           boxShadow:
//             "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)",
//           border: "1px solid rgba(241, 245, 249, 0.8)",
//           minWidth: "220px",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "8px",
//             fontSize: "1.05rem",
//             fontWeight: 700,
//             color: "#212529",
//           }}
//         >
//           <strong>{bar.data.indexValue}</strong>
//           {isTopPerformer && (
//             <span
//               style={{
//                 background: "#f0f4fe",
//                 color: "white",
//                 padding: "4px 10px",
//                 borderRadius: "20px",
//                 fontSize: "0.8rem",
//                 fontWeight: 700,
//               }}
//             >
//               <FaCrown style={{ color: "#FFD700" }} />
//             </span>
//           )}
//         </div>
//         <div
//           style={{
//             fontSize: "0.95rem",
//             color: "#495057",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <span style={{ color: fillColor }}>
//             {bar.data.id === "invested" ? "Invested:" : "Turnover:"}
//           </span>
//           <span style={{ fontWeight: 700, color: "#4361ee" }}>
//             ₹{Number(bar.data.value).toLocaleString("en-IN")}
//           </span>
//         </div>
//       </div>
//     );

//     return (
//       <g
//         transform={`translate(${bar.x},${bar.y})`}
//         onMouseEnter={(e) => showTooltipFromEvent(tooltipContent, e)}
//         onMouseMove={(e) => showTooltipFromEvent(tooltipContent, e)}
//         onMouseLeave={hideTooltip}
//       >
//         <rect
//           width={bar.width}
//           height={bar.height}
//           fill={fillColor}
//           rx={4}
//           ry={4}
//           style={{
//             transformOrigin: "center bottom",
//             transform: "scaleY(0)",
//             animation: "bar-appear 0.6s ease-out forwards",
//             animationDelay: `${bar.index * 30}ms`,
//             filter: isTopPerformer ? "url(#topPerformerGlow)" : "none",
//           }}
//         />
//         {bar.height > 12 && (
//           <text
//             x={bar.width / 2}
//             y={-6}
//             textAnchor="middle"
//             fill="#ffffff"
//             fontSize={11}
//             fontWeight={500}
//           >
//             {Number(bar.data.value).toFixed(1)}
//           </text>
//         )}
//       </g>
//     );
//   };

//   const isCluttered = data.length > 12;

//   return (
//     <div
//       style={{
//         width: "98vw",
//         maxWidth: "1400px",
//         padding: "20px",
//         boxSizing: "border-box",
//         fontFamily: "'Inter', 'Segoe UI', sans-serif",
//         background: "linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)",
//         borderRadius: "16px",
//         border: "1px solid #e2e8f0",
//       }}
//     >
//       <div
//         style={{
//           position: "relative",
//           background: "rgba(255, 255, 255, 0.85)",
//           borderRadius: "16px",
//           boxShadow:
//             "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)",
//           overflow: "hidden",
//           border: "1px solid rgba(241, 245, 249, 0.6)",
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         <div
//           style={{
//             position: "relative",
//             padding: "24px 32px 16px",
//             background:
//               "linear-gradient(120deg, rgba(249, 250, 251, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%)",
//             borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               marginBottom: "1rem",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "48px",
//                 height: "48px",
//                 background: "linear-gradient(135deg, #4361ee 0%, #3a56e4 100%)",
//                 borderRadius: "12px",
//                 color: "white",
//                 fontSize: "1.5rem",
//                 boxShadow: "0 4px 6px rgba(67, 97, 238, 0.3)",
//               }}
//             >
//               <FaChartBar />
//             </div>
//             <div>
//               <h2
//                 style={{
//                   fontSize: "1.6rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                   marginBottom: "6px",
//                   letterSpacing: "-0.5px",
//                 }}
//               >
//                 Investment Performance
//               </h2>
//               <p
//                 style={{
//                   fontSize: "1rem",
//                   color: "#6c757d",
//                   fontWeight: 500,
//                   margin: 0,
//                 }}
//               >
//                 Invested Amount vs Turnover by Stock
//               </p>
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "1.5rem",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.75rem",
//               }}
//             >
//               <label
//                 htmlFor="month-select"
//                 style={{
//                   fontWeight: 500,
//                   color: "#495057",
//                   fontSize: "0.95rem",
//                 }}
//               >
//                 Select Month:
//               </label>
//               <select
//                 id="month-select"
//                 value={monthIdx}
//                 onChange={(e) => setMonthIdx(Number(e.target.value))}
//                 style={{
//                   padding: "0.75rem 1.25rem",
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "8px",
//                   background: "white",
//                   color: "#343a40",
//                   fontSize: "1rem",
//                   fontWeight: 500,
//                   cursor: "pointer",
//                   boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//                   minWidth: "180px",
//                   backgroundImage:
//                     'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%234361ee\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
//                   backgroundRepeat: "no-repeat",
//                   backgroundPosition: "right 1rem center",
//                   backgroundSize: "12px",
//                   appearance: "none",
//                 }}
//                 className="premium-select"
//               >
//                 {plotData.map((d, i) => (
//                   <option key={d.month} value={i}>
//                     {new Date(`${d.month}-01`).toLocaleDateString("en-US", {
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(4, 1fr)",
//             gap: "1.5rem",
//             margin: "1.5rem 32px",
//           }}
//         >
//           <div
//             style={{
//               background: "white",
//               borderRadius: "15px",
//               padding: "1.25rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               overflow: "visible",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "12px",
//                 background: "#f0f4fe",
//                 color: "#4361ee",
//                 fontSize: "1.25rem",
//               }}
//             >
//               <FaChartBar style={{ color: "#4361ee" }} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.9rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Total Monthly Invested
//               </div>
//               <div
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 ₹{totalInvested.toLocaleString("en-IN")}
//               </div>
//             </div>
//             <div
//               data-tooltip="Sum of all investments across stocks"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "16px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "15px",
//               padding: "1.25rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               overflow: "visible",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "12px",
//                 background: "#f0f4fe",
//                 color: "#efb027ff",
//                 fontSize: "1.25rem",
//               }}
//             >
//               <FaChartBar style={{ color: "#efb027ff" }} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.9rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Total Monthly Turnover
//               </div>
//               <div
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 ₹{totalTurnover.toLocaleString("en-IN")}
//               </div>
//             </div>
//             <div
//               data-tooltip="Total sales value across all stocks"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "16px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "15px",
//               padding: "1.25rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               overflow: "visible",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "12px",
//                 background: "#f0f4fe",
//                 color: "#10b981",
//                 fontSize: "1.25rem",
//               }}
//             >
//               <FaChartBar style={{ color: "#10b981" }} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.9rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Active Stocks
//               </div>
//               <div
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 {filtered.length}
//               </div>
//             </div>
//             <div
//               data-tooltip="Number of stocks with investment or turnover"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "16px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "15px",
//               padding: "1.25rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               overflow: "visible",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "12px",
//                 background: "#f0f4fe",
//                 color: "#FFD700",
//                 fontSize: "1.25rem",
//               }}
//             >
//               <FaCrown style={{ color: "#FFD700" }} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.9rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Top Performer
//               </div>
//               <div
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 {topPerformer || "—"}
//               </div>
//             </div>
//             <div
//               data-tooltip="Stock with highest turnover"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "16px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             padding: "20px 32px",
//             position: "relative",
//             height: "500px",
//           }}
//         >
//           <svg width="0" height="0">
//             <defs>
//               <linearGradient id="investedGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#4A7BFF" />
//                 <stop offset="100%" stopColor="#3A6BEF" />
//               </linearGradient>
//               <linearGradient id="turnoverGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#2ECC71" />
//                 <stop offset="100%" stopColor="#20BC61" />
//               </linearGradient>
//               <linearGradient id="goldGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#FFD700" />
//                 <stop offset="100%" stopColor="#FFA500" />
//               </linearGradient>
//               <linearGradient id="secondaryGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#A663CC" />
//                 <stop offset="100%" stopColor="#9347B8" />
//               </linearGradient>
//               <linearGradient id="accentGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#FF7B7B" />
//                 <stop offset="100%" stopColor="#FF5E5E" />
//               </linearGradient>
//               <filter id="topPerformerGlow" x="-50%" y="-50%" width="200%" height="200%">
//                 <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
//                 <feComponentTransfer>
//                   <feFuncA type="linear" slope="0.5" />
//                 </feComponentTransfer>
//                 <feMerge>
//                   <feMergeNode />
//                   <feMergeNode in="SourceGraphic" />
//                 </feMerge>
//               </filter>
//             </defs>
//           </svg>
//           {filtered.length === 0 ? (
//             <div
//               style={{
//                 height: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "1.2rem",
//                 color: "#adb5bd",
//                 fontWeight: 500,
//               }}
//             >
//               No investment data available for {month}
//             </div>
//           ) : (
//             <ResponsiveBar
//               data={data}
//               keys={["invested", "turnover"]}
//               indexBy="scrip"
//               margin={{ top: 40, right: 30, bottom: 130, left: 100 }}
//               padding={0.4}
//               groupMode="grouped"
//               layout="vertical"
//               colors={({ id }) =>
//                 id === "invested" ? "url(#investedGradient)" : "url(#turnoverGradient)"
//               }
//               borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
//               axisBottom={{
//                 legend: "Stock",
//                 legendPosition: "middle",
//                 legendOffset: isCluttered ? 50 : 60,
//                 renderTick: (tick) => {
//                   const words = tick.value.split(" ");
//                   return (
//                     <g transform={`translate(${tick.x},${tick.y + 10})`}>
//                       <text
//                         textAnchor={isCluttered ? "end" : "middle"}
//                         dominantBaseline="middle"
//                         transform={isCluttered ? "rotate(-40)" : undefined}
//                         style={{
//                           fontSize: 11,
//                           fill: "#4b5563",
//                           fontFamily: "Inter, sans-serif",
//                         }}
//                       >
//                         {isCluttered ? (
//                           tick.value
//                         ) : (
//                           words.map((word, i) => (
//                             <tspan key={i} x={0} dy={i === 0 ? "0" : "1.2em"}>
//                               {word}
//                             </tspan>
//                           ))
//                         )}
//                       </text>
//                     </g>
//                   );
//                 },
//               }}
//               axisLeft={{
//                 format: (v) => `₹${(v / 1000).toFixed(0)}K`,
//                 legend: "Amount (₹)",
//                 legendPosition: "middle",
//                 legendOffset: -70,
//               }}
//               labelFormat={(v) => Number.parseFloat(v).toFixed(1)}
//               labelSkipWidth={16}
//               labelSkipHeight={16}
//               labelTextColor="#fff"
//               motionConfig="gentle"
//               animate={true}
//               motionStiffness={90}
//               motionDamping={20}
//               barComponent={CustomBar}
//               theme={{
//                 axis: {
//                   legend: {
//                     text: {
//                       fontSize: 16,
//                       fontWeight: 500,
//                       fill: "#3e4756ff",
//                     },
//                   },
//                   ticks: {
//                     line: {
//                       stroke: "#e2e8f0",
//                       strokeWidth: 1,
//                     },
//                     text: {
//                       fontSize: 11,
//                       fill: "#718096",
//                     },
//                   },
//                   domain: {
//                     line: {
//                       stroke: "#e2e8f0",
//                       strokeWidth: 2,
//                     },
//                   },
//                 },
//                 grid: {
//                   line: {
//                     stroke: "#edf2f7",
//                     strokeDasharray: "4 4",
//                   },
//                 },
//                 tooltip: {
//                   container: {
//                     background: "white",
//                     color: "#1f2937",
//                     fontSize: "12px",
//                     borderRadius: "8px",
//                     boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//                     padding: "12px",
//                     border: "1px solid #f3f4f6",
//                   },
//                 },
//               }}
//             />
//           )}
//         </div>

//         <div
//           style={{
//             padding: "1.5rem 32px",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             borderTop: "1px solid rgba(226, 232, 240, 0.5)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               gap: "1.25rem",
//               flexWrap: "wrap",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.9rem",
//                 fontWeight: 500,
//               }}
//             >
//               <div
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(90deg, #4361ee, #3a56e4)",
//                 }}
//               ></div>
//               <span>Invested Amount</span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.9rem",
//                 fontWeight: 500,
//               }}
//             >
//               <div
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(90deg, #2ECC71, #20BC61)",
//                 }}
//               ></div>
//               <span>Turnover</span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.9rem",
//                 fontWeight: 500,
//               }}
//             >
//               <div
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(90deg, #FFD700, #FFA500)",
//                 }}
//               ></div>
//               <span>Top Performer</span>
//             </div>
//           </div>
//           <div
//             style={{
//               fontSize: "0.9rem",
//               color: "#6c757d",
//             }}
//           >
//             {month} Performance | {filtered.length} Active Stocks
//           </div>
//         </div>

//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//             @keyframes bar-appear {
//               from {
//                 transform: scaleY(0);
//                 opacity: 0;
//               }
//               to {
//                 transform: scaleY(1);
//                 opacity: 1;
//               }
//             }
//             .premium-select:hover {
//               border-color: #cbd5e0;
//               box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//             }
//             .premium-select:focus {
//               outline: none;
//               border-color: #4361ee;
//               box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
//             }
//             .info-icon:hover::after {
//               content: attr(data-tooltip);
//               position: absolute;
//               bottom: 120%;
//               right: 0;
//               background: #f3f4f6;
//               color: #111827;
//               font-size: 12px;
//               padding: 6px 10px;
//               borderRadius: 6px;
//               box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//               z-index: 9999;
//               width: 180px;
//               white-space: normal;
//               word-wrap: break-word;
//               line-height: 1.4;
//             }
//           `}
//         </style>
//       </div>
//     </div>
//   );
// }






// import React, { useState, useEffect } from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import { FaChartBar, FaInfoCircle, FaCrown } from "react-icons/fa";
// import { useTooltip } from "@nivo/tooltip";
// import { HashLoader } from "react-spinners";

// export default function InvestedAmountPlot() {
//   const [plotData, setPlotData] = useState([]);
//   const [monthIdx, setMonthIdx] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE}/file/create_invested_amount_plot`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({ uploadId }),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch data");
//         return res.json();
//       })
//       .then((json) => {
//         if (!json.plot_data || !Array.isArray(json.plot_data)) {
//           throw new Error("Invalid data format");
//         }
//         setPlotData(json.plot_data);
//         setIsLoading(false);
//         if (json.plot_data.length === 0) {
//           setMonthIdx(0);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to load data:", err);
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, [uploadId]);

//   if (isLoading) {
//     return (
//    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         style={{
//           width: "98vw",
//           maxWidth: "1500px",
//           padding: "20px",
//           boxSizing: "border-box",
//           fontFamily: "'Inter', 'Segoe UI', sans-serif",
//           background: "linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)",
//           borderRadius: "16px",
//           border: "1px solid #e2e8f0",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "3rem",
//             textAlign: "center",
//           }}
//         >
//           <FaInfoCircle
//             style={{ fontSize: "3rem", color: "#ced4da", marginBottom: "1.5rem" }}
//           />
//           <h3
//             style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#343a40" }}
//           >
//             Data Unavailable
//           </h3>
//           <p style={{ color: "#6c757d", maxWidth: "500px" }}>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!plotData.length) {
//     return (
//       <div
//         style={{
//           width: "98vw",
//           maxWidth: "1500px",
//           padding: "20px",
//           boxSizing: "border-box",
//           fontFamily: "'Inter', 'Segoe UI', sans-serif",
//           background: "linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)",
//           borderRadius: "16px",
//           border: "1px solid #e2e8f0",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "3rem",
//             textAlign: "center",
//           }}
//         >
//           <FaInfoCircle
//             style={{ fontSize: "3rem", color: "#ced4da", marginBottom: "1.5rem" }}
//           />
//           <h3
//             style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#343a40" }}
//           >
//             No Data Available
//           </h3>
//           <p style={{ color: "#6c757d", maxWidth: "500px" }}>
//             No investment data found for visualization.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const validMonthIdx = Math.min(Math.max(0, monthIdx), plotData.length - 1);
//   const { month, scrips } = plotData[validMonthIdx];
//   const filtered = scrips.filter((d) => d.invested !== 0 || d.turnover !== 0);

//   const totalInvested = filtered.reduce((sum, d) => sum + d.invested, 0);
//   const totalTurnover = filtered.reduce((sum, d) => sum + d.turnover, 0);
//   const topPerformer = filtered.length
//     ? filtered.sort((a, b) => b.turnover - a.turnover)[0].scrip
//     : null;

//   const data = filtered.map((d) => ({
//     scrip: d.scrip,
//     invested: d.invested,
//     turnover: d.turnover,
//   }));

//   const CustomBar = ({ bar }) => {
//     const { showTooltipFromEvent, hideTooltip } = useTooltip();

//     const isTopPerformer = bar.data.indexValue === topPerformer;
//     const isTurnoverBar = bar.data.id === "turnover";
//     const fillColor = isTopPerformer && isTurnoverBar ? "url(#goldGradient)" : bar.color;

//     const tooltipContent = (
//       <div
//         style={{
//           background: "white",
//           padding: "16px",
//           borderRadius: "8px",
//           boxShadow:
//             "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)",
//           border: "1px solid rgba(241, 245, 249, 0.8)",
//           minWidth: "220px",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "8px",
//             fontSize: "1.05rem",
//             fontWeight: 700,
//             color: "#212529",
//           }}
//         >
//           <strong>{bar.data.indexValue}</strong>
//           {isTopPerformer && (
//             <span
//               style={{
//                 background: "#f0f4fe",
//                 color: "white",
//                 padding: "4px 10px",
//                 borderRadius: "20px",
//                 fontSize: "0.8rem",
//                 fontWeight: 700,
//               }}
//             >
//               <FaCrown style={{ color: "#FFD700" }} />
//             </span>
//           )}
//         </div>
//         <div
//           style={{
//             fontSize: "0.95rem",
//             color: "#495057",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <span style={{ color: fillColor }}>
//             {bar.data.id === "invested" ? "Invested:" : "Turnover:"}
//           </span>
//           <span style={{ fontWeight: 700, color: "#4361ee" }}>
//             ₹{Number(bar.data.value).toLocaleString("en-IN")}
//           </span>
//         </div>
//       </div>
//     );

//     return (
//       <g
//         transform={`translate(${bar.x},${bar.y})`}
//         onMouseEnter={(e) => showTooltipFromEvent(tooltipContent, e)}
//         onMouseMove={(e) => showTooltipFromEvent(tooltipContent, e)}
//         onMouseLeave={hideTooltip}
//       >
//         <rect
//           width={bar.width}
//           height={bar.height}
//           fill={fillColor}
//           rx={4}
//           ry={4}
//           style={{
//             transformOrigin: "center bottom",
//             transform: "scaleY(0)",
//             animation: "bar-appear 0.6s ease-out forwards",
//             animationDelay: `${bar.index * 30}ms`,
//             filter: isTopPerformer ? "url(#topPerformerGlow)" : "none",
//           }}
//         />
//         {bar.height > 12 && (
//           <text
//             x={bar.width / 2}
//             y={-6}
//             textAnchor="middle"
//             fill="#ffffff"
//             fontSize={11}
//             fontWeight={500}
//           >
//             {Number(bar.data.value).toFixed(1)}
//           </text>
//         )}
//       </g>
//     );
//   };

//   const isCluttered = data.length > 12;

//   return (
//     <div
//       style={{
//         width: "98vw",
//         maxWidth: "1500px",
//         padding: "20px",
//         boxSizing: "border-box",
//         fontFamily: "'Inter', 'Segoe UI', sans-serif",
//         background: "linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)",
//         borderRadius: "16px",
//         border: "1px solid #e2e8f0",
//       }}
//     >
//       <div
//         style={{
//           position: "relative",
//           background: "rgba(255, 255, 255, 0.85)",
//           borderRadius: "16px",
//           boxShadow:
//             "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)",
//           overflow: "hidden",
//           border: "1px solid rgba(241, 245, 249, 0.6)",
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         <div
//           style={{
//             position: "relative",
//             padding: "20px 20px 10px",
//             background:
//               "linear-gradient(120deg, rgba(249, 250, 251, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%)",
//             borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               marginBottom: "0.5rem",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "38px",
//                 height: "38px",
//                 background: "linear-gradient(135deg, #4361ee 0%, #3a56e4 100%)",
//                 borderRadius: "12px",
//                 color: "white",
//                 fontSize: "1.4rem",
//                 boxShadow: "0 4px 6px rgba(67, 97, 238, 0.3)",
//               }}
//             >
//               <FaChartBar />
//             </div>
//             <div>
//               <h2
//                 style={{
//                   fontSize: "1.4rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                   marginBottom: "4px",
//                   letterSpacing: "-0.5px",
//                 }}
//               >
//                 Investment Performance
//               </h2>
//               <p
//                 style={{
//                   fontSize: "1rem",
//                   color: "#6c757d",
//                   fontWeight: 500,
//                   margin: 0,
//                 }}
//               >
//                 Invested Amount vs Turnover by Stock
//               </p>
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "1.5rem",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.75rem",
//               }}
//             >
//               <label
//                 htmlFor="month-select"
//                 style={{
//                   fontWeight: 500,
//                   color: "#495057",
//                   fontSize: "0.95rem",
//                 }}
//               >
//                 Select Month:
//               </label>
//               <select
//                 id="month-select"
//                 value={monthIdx}
//                 onChange={(e) => setMonthIdx(Number(e.target.value))}
//                 style={{
//                   padding: "0.75rem 1.25rem",
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "8px",
//                   background: "white",
//                   color: "#343a40",
//                   fontSize: "1rem",
//                   fontWeight: 500,
//                   cursor: "pointer",
//                   boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//                   minWidth: "180px",
//                   backgroundImage:
//                     'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%234361ee\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
//                   backgroundRepeat: "no-repeat",
//                   backgroundPosition: "right 1rem center",
//                   backgroundSize: "12px",
//                   appearance: "none",
//                 }}
//                 className="premium-select"
//               >
//                 {plotData.map((d, i) => (
//                   <option key={d.month} value={i}>
//                     {new Date(`${d.month}-01`).toLocaleDateString("en-US", {
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(4, 1fr)",
//             gap: "1.5rem",
//             margin: "1.5rem 32px",
//           }}
//         >
//           <div
//             style={{
//               background: "white",
//               borderRadius: "15px",
//               padding: "1.25rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               overflow: "visible",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "12px",
//                 background: "#f0f4fe",
//                 color: "#4361ee",
//                 fontSize: "1.25rem",
//               }}
//             >
//               <FaChartBar style={{ color: "#4361ee" }} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.9rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Total Monthly Invested
//               </div>
//               <div
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 ₹{totalInvested.toLocaleString("en-IN")}
//               </div>
//             </div>
//             <div
//               data-tooltip="Sum of all investments across stocks"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "16px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "15px",
//               padding: "1.25rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               overflow: "visible",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "12px",
//                 background: "#f0f4fe",
//                 color: "#efb027ff",
//                 fontSize: "1.25rem",
//               }}
//             >
//               <FaChartBar style={{ color: "#efb027ff" }} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.9rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Total Monthly Turnover
//               </div>
//               <div
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 ₹{totalTurnover.toLocaleString("en-IN")}
//               </div>
//             </div>
//             <div
//               data-tooltip="Total sales value across all stocks"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "16px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "15px",
//               padding: "1.25rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               overflow: "visible",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "12px",
//                 background: "#f0f4fe",
//                 color: "#10b981",
//                 fontSize: "1.25rem",
//               }}
//             >
//               <FaChartBar style={{ color: "#10b981" }} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.9rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Active Stocks
//               </div>
//               <div
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 {filtered.length}
//               </div>
//             </div>
//             <div
//               data-tooltip="Number of stocks with investment or turnover"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "16px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "15px",
//               padding: "1.25rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//               overflow: "visible",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "48px",
//                 height: "48px",
//                 borderRadius: "12px",
//                 background: "#f0f4fe",
//                 color: "#FFD700",
//                 fontSize: "1.25rem",
//               }}
//             >
//               <FaCrown style={{ color: "#FFD700" }} />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.9rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Top Performer
//               </div>
//               <div
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 {topPerformer || "—"}
//               </div>
//             </div>
//             <div
//               data-tooltip="Stock with highest turnover"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "16px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             padding: "20px 32px",
//             position: "relative",
//             height: "330px", // Reduced height to minimize vertical space
//             overflow: "hidden", // Explicitly prevent scrollbar
//           }}
//         >
//           <svg width="0" height="0">
//             <defs>
//               <linearGradient id="investedGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#4A7BFF" />
//                 <stop offset="100%" stopColor="#3A6BEF" />
//               </linearGradient>
//               <linearGradient id="turnoverGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#2ECC71" />
//                 <stop offset="100%" stopColor="#20BC61" />
//               </linearGradient>
//               <linearGradient id="goldGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#FFD700" />
//                 <stop offset="100%" stopColor="#FFA500" />
//               </linearGradient>
//               <linearGradient id="secondaryGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#A663CC" />
//                 <stop offset="100%" stopColor="#9347B8" />
//               </linearGradient>
//               <linearGradient id="accentGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#FF7B7B" />
//                 <stop offset="100%" stopColor="#FF5E5E" />
//               </linearGradient>
//               <filter id="topPerformerGlow" x="-50%" y="-50%" width="200%" height="200%">
//                 <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
//                 <feComponentTransfer>
//                   <feFuncA type="linear" slope="0.5" />
//                 </feComponentTransfer>
//                 <feMerge>
//                   <feMergeNode />
//                   <feMergeNode in="SourceGraphic" />
//                 </feMerge>
//               </filter>
//             </defs>
//           </svg>
//           {filtered.length === 0 ? (
//             <div
//               style={{
//                 height: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "1.2rem",
//                 color: "#adb5bd",
//                 fontWeight: 500,
//               }}
//             >
//               No investment data available for {month}
//             </div>
//           ) : (
//             <ResponsiveBar
//               data={data}
//               keys={["invested", "turnover"]}
//               indexBy="scrip"
//               margin={{ top: 20, right: 30, bottom: 80, left: 80 }} // Reduced margins
//               padding={0.4}
//               groupMode="grouped"
//               layout="vertical"
//               colors={({ id }) =>
//                 id === "invested" ? "url(#investedGradient)" : "url(#turnoverGradient)"
//               }
//               borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
//               axisBottom={{
//                 legend: "Stock",
//                 legendPosition: "middle",
//                 legendOffset: isCluttered ? 40 : 50, // Adjusted for less clutter
//                 renderTick: (tick) => {
//                   const words = tick.value.split(" ");
//                   return (
//                     <g transform={`translate(${tick.x},${tick.y + 10})`}>
//                       <text
//                         textAnchor={isCluttered ? "end" : "middle"}
//                         dominantBaseline="middle"
//                         transform={isCluttered ? "rotate(-40)" : undefined}
//                         style={{
//                           fontSize: 10, // Smaller font size for ticks
//                           fill: "#4b5563",
//                           fontFamily: "Inter, sans-serif",
//                         }}
//                       >
//                         {isCluttered ? (
//                           tick.value
//                         ) : (
//                           words.map((word, i) => (
//                             <tspan key={i} x={0} dy={i === 0 ? "0" : "1.2em"}>
//                               {word}
//                             </tspan>
//                           ))
//                         )}
//                       </text>
//                     </g>
//                   );
//                 },
//               }}
//               axisLeft={{
//                 format: (v) => `₹${(v / 1000).toFixed(0)}K`,
//                 legend: "Amount (₹)",
//                 legendPosition: "middle",
//                 legendOffset: -60, // Reduced offset
//                 tickSize: 5, // Smaller ticks
//                 tickPadding: 5,
//                 tickValues: 5, // Fewer ticks to reduce clutter
//               }}
//               labelFormat={(v) => Number.parseFloat(v).toFixed(1)}
//               labelSkipWidth={16}
//               labelSkipHeight={16}
//               labelTextColor="#fff"
//               motionConfig="gentle"
//               animate={true}
//               motionStiffness={90}
//               motionDamping={20}
//               barComponent={CustomBar}
//               theme={{
//                 axis: {
//                   legend: {
//                     text: {
//                       fontSize: 14, // Smaller legend font
//                       fontWeight: 500,
//                       fill: "#3e4756ff",
//                     },
//                   },
//                   ticks: {
//                     line: {
//                       stroke: "#e2e8f0",
//                       strokeWidth: 1,
//                     },
//                     text: {
//                       fontSize: 10, // Smaller tick font
//                       fill: "#718096",
//                     },
//                   },
//                   domain: {
//                     line: {
//                       stroke: "#e2e8f0",
//                       strokeWidth: 2,
//                     },
//                   },
//                 },
//                 grid: {
//                   line: {
//                     stroke: "#edf2f7",
//                     strokeDasharray: "4 4",
//                   },
//                 },
//                 tooltip: {
//                   container: {
//                     background: "white",
//                     color: "#1f2937",
//                     fontSize: "12px",
//                     borderRadius: "8px",
//                     boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//                     padding: "12px",
//                     border: "1px solid #f3f4f6",
//                   },
//                 },
//               }}
//             />
//           )}
//         </div>

//         <div
//           style={{
//             padding: "1.5rem 32px",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             borderTop: "1px solid rgba(226, 232, 240, 0.5)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               gap: "1.25rem",
//               flexWrap: "wrap",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.9rem",
//                 fontWeight: 500,
//               }}
//             >
//               <div
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(90deg, #4361ee, #3a56e4)",
//                 }}
//               ></div>
//               <span>Invested Amount</span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.9rem",
//                 fontWeight: 500,
//               }}
//             >
//               <div
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(90deg, #2ECC71, #20BC61)",
//                 }}
//               ></div>
//               <span>Turnover</span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.9rem",
//                 fontWeight: 500,
//               }}
//             >
//               <div
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(90deg, #FFD700, #FFA500)",
//                 }}
//               ></div>
//               <span>Top Performer</span>
//             </div>
//           </div>
//           <div
//             style={{
//               fontSize: "0.9rem",
//               color: "#6c757d",
//             }}
//           >
//             {month} Performance | {filtered.length} Active Stocks
//           </div>
//         </div>

//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//             @keyframes bar-appear {
//               from {
//                 transform: scaleY(0);
//                 opacity: 0;
//               }
//               to {
//                 transform: scaleY(1);
//                 opacity: 1;
//               }
//             }
//             .premium-select:hover {
//               border-color: #cbd5e0;
//               box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//             }
//             .premium-select:focus {
//               outline: none;
//               border-color: #4361ee;
//               box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
//             }
//             .info-icon:hover::after {
//               content: attr(data-tooltip);
//               position: absolute;
//               bottom: 120%;
//               right: 0;
//               background: #f3f4f6;
//               color: #111827;
//               font-size: 12px;
//               padding: 6px 10px;
//               borderRadius: 6px;
//               box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//               z-index: 9999;
//               width: 180px;
//               white-space: normal;
//               word-wrap: break-word;
//               line-height: 1.4;
//             }
//           `}
//         </style>
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect } from "react";
// import { ResponsiveBar } from "@nivo/bar";
// import { FaChartBar, FaInfoCircle, FaCrown } from "react-icons/fa";
// import { useTooltip } from "@nivo/tooltip";
// import { HashLoader } from "react-spinners";

// export default function InvestedAmountPlot({uploadId}) {
//   const [plotData, setPlotData] = useState([]);
//   const [monthIdx, setMonthIdx] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE}/file/create_invested_amount_plot`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({ uploadId }),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch data");
//         return res.json();
//       })
//       .then((json) => {
//         if (!json.plot_data || !Array.isArray(json.plot_data)) {
//           throw new Error("Invalid data format");
//         }
//         setPlotData(json.plot_data);
//         setIsLoading(false);
//         if (json.plot_data.length === 0) {
//           setMonthIdx(0);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to load data:", err);
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, [uploadId]);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           CMDA...
//         </p>
//       </div>
//     );
//   }

//   if (error || !plotData.length) {
//     return (
//       <div
//         style={{
//           width: "100%", // Changed to 100% for full responsiveness
//           maxWidth: "1500px",
//           padding: "20px",
//           boxSizing: "border-box",
//           fontFamily: "'Inter', 'Segoe UI', sans-serif",
//           background: "linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)",
//           borderRadius: "16px",
//           border: "1px solid #e2e8f0",
//           margin: "0 auto",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "3rem",
//             textAlign: "center",
//           }}
//         >
//           <FaInfoCircle
//             style={{ fontSize: "3rem", color: "#ced4da", marginBottom: "1.5rem" }}
//           />
//           <h3
//             style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#343a40" }}
//           >
//             {error ? "Data Unavailable" : "No Data Available"}
//           </h3>
//           <p style={{ color: "#6c757d", maxWidth: "500px" }}>
//             {error || "No investment data found for visualization."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const validMonthIdx = Math.min(Math.max(0, monthIdx), plotData.length - 1);
//   const { month, scrips } = plotData[validMonthIdx];
//   const filtered = scrips.filter((d) => d.invested !== 0 || d.turnover !== 0);

//   const totalInvested = filtered.reduce((sum, d) => sum + d.invested, 0);
//   const totalTurnover = filtered.reduce((sum, d) => sum + d.turnover, 0);
//   const topPerformer = filtered.length
//     ? filtered.sort((a, b) => b.turnover - a.turnover)[0].scrip
//     : null;

//   const data = filtered.map((d) => ({
//     scrip: d.scrip,
//     invested: d.invested,
//     turnover: d.turnover,
//   }));

//   const CustomBar = ({ bar }) => {
//     const { showTooltipFromEvent, hideTooltip } = useTooltip();

//     const isTopPerformer = bar.data.indexValue === topPerformer;
//     const isTurnoverBar = bar.data.id === "turnover";
//     const fillColor = isTopPerformer && isTurnoverBar ? "url(#goldGradient)" : bar.color;

//     const tooltipContent = (
//       <div
//         style={{
//           background: "white",
//           padding: "12px", // Reduced padding for smaller screens
//           borderRadius: "8px",
//           boxShadow:
//             "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)",
//           border: "1px solid rgba(241, 245, 249, 0.8)",
//           minWidth: "180px", // Reduced minWidth
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "6px",
//             fontSize: "0.95rem", // Smaller font
//             fontWeight: 700,
//             color: "#212529",
//           }}
//         >
//           <strong>{bar.data.indexValue}</strong>
//           {isTopPerformer && (
//             <span
//               style={{
//                 background: "#f0f4fe",
//                 color: "white",
//                 padding: "3px 8px",
//                 borderRadius: "16px",
//                 fontSize: "0.75rem",
//                 fontWeight: 700,
//               }}
//             >
//               <FaCrown style={{ color: "#FFD700" }} />
//             </span>
//           )}
//         </div>
//         <div
//           style={{
//             fontSize: "0.85rem", // Smaller font
//             color: "#495057",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <span style={{ color: fillColor }}>
//             {bar.data.id === "invested" ? "Invested:" : "Turnover:"}
//           </span>
//           <span style={{ fontWeight: 700, color: "#4361ee" }}>
//             ₹{Number(bar.data.value).toLocaleString("en-IN")}
//           </span>
//         </div>
//       </div>
//     );

//     return (
//       <g
//         transform={`translate(${bar.x},${bar.y})`}
//         onMouseEnter={(e) => showTooltipFromEvent(tooltipContent, e)}
//         onMouseMove={(e) => showTooltipFromEvent(tooltipContent, e)}
//         onMouseLeave={hideTooltip}
//       >
//         <rect
//           width={bar.width}
//           height={bar.height}
//           fill={fillColor}
//           rx={4}
//           ry={4}
//         />
//         {bar.height > 12 && (
//           <text
//             x={bar.width / 2}
//             y={-6}
//             textAnchor="middle"
//             fill="#ffffff"
//             fontSize={10} // Smaller font
//             fontWeight={500}
//           >
//             {Number(bar.data.value).toFixed(1)}
//           </text>
//         )}
//       </g>
//     );
//   };

//   const isCluttered = data.length > 12;

//   return (
//     <div
//       style={{
//         width: "100%", // Full width for responsiveness
//         maxWidth: "1500px",
//         padding: "16px", // Reduced padding
//         boxSizing: "border-box",
//         fontFamily: "'Inter', 'Segoe UI', sans-serif",
//         background: "linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)",
//         borderRadius: "16px",
//         border: "1px solid #e2e8f0",
//         margin: "0 auto",
//       }}
//     >
//       <div
//         style={{
//           position: "relative",
//           background: "rgba(255, 255, 255, 0.85)",
//           borderRadius: "16px",
//           boxShadow:
//             "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)",
//           overflow: "hidden",
//           border: "1px solid rgba(241, 245, 249, 0.6)",
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         <div
//           style={{
//             position: "relative",
//             padding: "16px", // Reduced padding
//             background:
//               "linear-gradient(120deg, rgba(249, 250, 251, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%)",
//             borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center", // Changed to center for better mobile alignment
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               marginBottom: "0.5rem",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "32px", // Smaller icon
//                 height: "32px",
//                 background: "linear-gradient(135deg, #4361ee 0%, #3a56e4 100%)",
//                 borderRadius: "10px",
//                 color: "white",
//                 fontSize: "1.2rem",
//                 boxShadow: "0 4px 6px rgba(67, 97, 238, 0.3)",
//               }}
//             >
//               <FaChartBar />
//             </div>
//             <div>
//               <h2
//                 style={{
//                   fontSize: "1.2rem", // Smaller font
//                   fontWeight: 700,
//                   color: "#212529",
//                   marginBottom: "4px",
//                   letterSpacing: "-0.5px",
//                 }}
//               >
//                 Investment Performance
//               </h2>
//               <p
//                 style={{
//                   fontSize: "0.9rem", // Smaller font
//                   color: "#6c757d",
//                   fontWeight: 500,
//                   margin: 0,
//                 }}
//               >
//                 Invested Amount vs Turnover by Stock
//               </p>
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//               }}
//             >
//               <label
//                 htmlFor="month-select"
//                 style={{
//                   fontWeight: 500,
//                   color: "#495057",
//                   fontSize: "0.85rem", // Smaller font
//                 }}
//               >
//                 Select Month:
//               </label>
//               <select
//                 id="month-select"
//                 value={monthIdx}
//                 onChange={(e) => setMonthIdx(Number(e.target.value))}
//                 style={{
//                   padding: "0.5rem 1rem", // Reduced padding
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "8px",
//                   background: "white",
//                   color: "#343a40",
//                   fontSize: "0.9rem", // Smaller font
//                   fontWeight: 500,
//                   cursor: "pointer",
//                   boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//                   minWidth: "140px", // Smaller minWidth
//                   backgroundImage:
//                     'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%234361ee\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
//                   backgroundRepeat: "no-repeat",
//                   backgroundPosition: "right 0.75rem center",
//                   backgroundSize: "10px",
//                   appearance: "none",
//                 }}
//                 className="premium-select"
//               >
//                 {plotData.map((d, i) => (
//                   <option key={d.month} value={i}>
//                     {new Date(`${d.month}-01`).toLocaleDateString("en-US", {
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Responsive grid
//             gap: "1rem",
//             margin: "1rem 24px", // Reduced margins
//           }}
//         >
//           <div
//             style={{
//               background: "white",
//               borderRadius: "12px",
//               padding: "1rem", // Reduced padding
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 width: "40px", // Smaller icon
//                 height: "40px",
//                 borderRadius: "10px",
//                 background: "#f0f4fe",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#4361ee",
//                 fontSize: "1rem",
//               }}
//             >
//               <FaChartBar />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.8rem", // Smaller font
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Total Monthly Invested
//               </div>
//               <div
//                 style={{
//                   fontSize: "1rem", // Smaller font
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 ₹{totalInvested.toLocaleString("en-IN")}
//               </div>
//             </div>
//             <div
//               data-tooltip="Sum of all investments across stocks"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "14px", // Smaller font
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>

//           {/* Repeat similar adjustments for other stat cards */}
//           <div
//             style={{
//               background: "white",
//               borderRadius: "12px",
//               padding: "1rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "10px",
//                 background: "#f0f4fe",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#efb027ff",
//                 fontSize: "1rem",
//               }}
//             >
//               <FaChartBar />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.8rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Total Monthly Turnover
//               </div>
//               <div
//                 style={{
//                   fontSize: "1rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 ₹{totalTurnover.toLocaleString("en-IN")}
//               </div>
//             </div>
//             <div
//               data-tooltip="Total sales value across all stocks"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "14px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "12px",
//               padding: "1rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "10px",
//                 background: "#f0f4fe",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#10b981",
//                 fontSize: "1rem",
//               }}
//             >
//               <FaChartBar />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.8rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Active Stocks
//               </div>
//               <div
//                 style={{
//                   fontSize: "1rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 {filtered.length}
//               </div>
//             </div>
//             <div
//               data-tooltip="Number of stocks with investment or turnover"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "14px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>

//           <div
//             style={{
//               background: "white",
//               borderRadius: "12px",
//               padding: "1rem",
//               boxShadow:
//                 "0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "10px",
//                 background: "#f0f4fe",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#FFD700",
//                 fontSize: "1rem",
//               }}
//             >
//               <FaCrown />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: "0.8rem",
//                   color: "#6c757d",
//                   marginBottom: "0.25rem",
//                   fontWeight: 500,
//                 }}
//               >
//                 Top Performer
//               </div>
//               <div
//                 style={{
//                   fontSize: "1rem",
//                   fontWeight: 700,
//                   color: "#212529",
//                 }}
//               >
//                 {topPerformer || "—"}
//               </div>
//             </div>
//             <div
//               data-tooltip="Stock with highest turnover"
//               style={{
//                 position: "absolute",
//                 bottom: "6px",
//                 right: "8px",
//                 fontSize: "14px",
//                 color: "#6b7280",
//                 cursor: "pointer",
//               }}
//               className="info-icon"
//             >
//               <FaInfoCircle />
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             padding: "16px 24px", // Reduced padding
//             position: "relative",
//             height: "40vh", // Dynamic height based on viewport
//             minHeight: "250px", // Minimum height to prevent collapse
//             maxHeight: "400px", // Maximum height to avoid excessive growth
//             overflow: "hidden",
//           }}
//         >
//           <svg width="0" height="0">
//             <defs>
//               <linearGradient id="investedGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#4A7BFF" />
//                 <stop offset="100%" stopColor="#3A6BEF" />
//               </linearGradient>
//               <linearGradient id="turnoverGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#2ECC71" />
//                 <stop offset="100%" stopColor="#20BC61" />
//               </linearGradient>
//               <linearGradient id="goldGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#FFD700" />
//                 <stop offset="100%" stopColor="#FFA500" />
//               </linearGradient>
//               <linearGradient id="secondaryGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#A663CC" />
//                 <stop offset="100%" stopColor="#9347B8" />
//               </linearGradient>
//               <linearGradient id="accentGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#FF7B7B" />
//                 <stop offset="100%" stopColor="#FF5E5E" />
//               </linearGradient>
//               <filter id="topPerformerGlow" x="-50%" y="-50%" width="200%" height="200%">
//                 <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
//                 <feComponentTransfer>
//                   <feFuncA type="linear" slope="0.5" />
//                 </feComponentTransfer>
//                 <feMerge>
//                   <feMergeNode />
//                   <feMergeNode in="SourceGraphic" />
//                 </feMerge>
//               </filter>
//             </defs>
//           </svg>
//           {filtered.length === 0 ? (
//             <div
//               style={{
//                 height: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "1rem", // Smaller font
//                 color: "#adb5bd",
//                 fontWeight: 500,
//               }}
//             >
//               No investment data available for {month}
//             </div>
//           ) : (
//             <ResponsiveBar
//               data={data}
//               keys={["invested", "turnover"]}
//               indexBy="scrip"
//               margin={{ top: 20, right: 20, bottom: 60, left: 60 }} // Further reduced margins
//               padding={0.4}
//               groupMode="grouped"
//               layout="vertical"
//               colors={({ id }) =>
//                 id === "invested" ? "url(#investedGradient)" : "url(#turnoverGradient)"
//               }
//               borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
//               axisBottom={{
//                 legend: "Stock",
//                 legendPosition: "middle",
//                 legendOffset: isCluttered ? 40 : 50,
//                 renderTick: (tick) => {
//                   const words = tick.value.split(" ");
//                   return (
//                     <g transform={`translate(${tick.x},${tick.y + 10})`}>
//                       <text
//                         textAnchor={isCluttered ? "end" : "middle"}
//                         dominantBaseline="middle"
//                         transform={isCluttered ? "rotate(-40)" : undefined}
//                         style={{
//                           fontSize: 9, // Smaller font
//                           fill: "#4b5563",
//                           fontFamily: "Inter, sans-serif",
//                         }}
//                       >
//                         {isCluttered ? (
//                           tick.value
//                         ) : (
//                           words.map((word, i) => (
//                             <tspan key={i} x={0} dy={i === 0 ? "0" : "1.1em"}>
//                               {word}
//                             </tspan>
//                           ))
//                         )}
//                       </text>
//                     </g>
//                   );
//                 },
//               }}
//               axisLeft={{
//                 format: (v) => `₹${(v / 1000).toFixed(0)}K`,
//                 legend: "Amount (₹)",
//                 legendPosition: "middle",
//                 legendOffset: -50, // Further reduced
//                 tickSize: 4,
//                 tickPadding: 4,
//                 tickValues: 5,
//               }}
//               labelFormat={(v) => Number.parseFloat(v).toFixed(1)}
//               labelSkipWidth={12} // Adjusted for smaller screens
//               labelSkipHeight={12}
//               labelTextColor="#fff"
//               motionConfig="gentle"
//               animate={true}
//               motionStiffness={90}
//               motionDamping={20}
//               barComponent={CustomBar}
//               theme={{
//                 axis: {
//                   legend: {
//                     text: {
//                       fontSize: 12, // Smaller font
//                       fontWeight: 500,
//                       fill: "#3e4756ff",
//                     },
//                   },
//                   ticks: {
//                     line: {
//                       stroke: "#e2e8f0",
//                       strokeWidth: 1,
//                     },
//                     text: {
//                       fontSize: 9, // Smaller font
//                       fill: "#718096",
//                     },
//                   },
//                   domain: {
//                     line: {
//                       stroke: "#e2e8f0",
//                       strokeWidth: 2,
//                     },
//                   },
//                 },
//                 grid: {
//                   line: {
//                     stroke: "#edf2f7",
//                     strokeDasharray: "4 4",
//                   },
//                 },
//                 tooltip: {
//                   container: {
//                     background: "white",
//                     color: "#1f2937",
//                     fontSize: "11px", // Smaller font
//                     borderRadius: "8px",
//                     boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//                     padding: "10px",
//                     border: "1px solid #f3f4f6",
//                   },
//                 },
//               }}
//             />
//           )}
//         </div>

//         <div
//           style={{
//             padding: "1rem 24px", // Reduced padding
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             borderTop: "1px solid rgba(226, 232, 240, 0.5)",
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               gap: "1rem",
//               flexWrap: "wrap",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.8rem", // Smaller font
//                 fontWeight: 500,
//               }}
//             >
//               <div
//                 style={{
//                   width: "14px", // Smaller square
//                   height: "14px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(90deg, #4361ee, #3a56e4)",
//                 }}
//               ></div>
//               <span>Invested Amount</span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.8rem",
//                 fontWeight: 500,
//               }}
//             >
//               <div
//                 style={{
//                   width: "14px",
//                   height: "14px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(90deg, #2ECC71, #20BC61)",
//                 }}
//               ></div>
//               <span>Turnover</span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 fontSize: "0.8rem",
//                 fontWeight: 500,
//               }}
//             >
//               <div
//                 style={{
//                   width: "14px",
//                   height: "14px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(90deg, #FFD700, #FFA500)",
//                 }}
//               ></div>
//               <span>Top Performer</span>
//             </div>
//           </div>
//           <div
//             style={{
//               fontSize: "0.8rem", // Smaller font
//               color: "#6c757d",
//             }}
//           >
//             {month} Performance | {filtered.length} Active Stocks
//           </div>
//         </div>

//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//             @keyframes bar-appear {
//               from {
//                 transform: scaleY(0);
//                 opacity: 0;
//               }
//               to {
//                 transform: scaleY(1);
//                 opacity: 1;
//               }
//             }
//             .premium-select:hover {
//               border-color: #cbd5e0;
//               box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//             }
//             .premium-select:focus {
//               outline: none;
//               border-color: #4361ee;
//               box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
//             }
//             .info-icon:hover::after {
//               content: attr(data-tooltip);
//               position: absolute;
//               bottom: 120%;
//               right: 0;
//               background: #f3f4f6;
//               color: #111827;
//               font-size: 11px;
//               padding: 5px 8px;
//               borderRadius: 6px;
//               box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//               z-index: 9999;
//               width: 160px;
//               white-space: normal;
//               word-wrap: break-word;
//               line-height: 1.4;
//             }
//             @media (max-width: 768px) {
//               .premium-select {
//                 width: 100% !important;
//                 min-width: unset !important;
//               }
//               .info-icon:hover::after {
//                 width: 120px;
//                 font-size: 10px;
//                 padding: 4px 6px;
//               }
//             }
//             @media (max-width: 480px) {
//               .premium-select {
//                 font-size: 0.8rem !important;
//                 padding: 0.4rem 0.8rem !important;
//               }
//               .info-icon:hover::after {
//                 width: 100px;
//                 font-size: 9px;
//               }
//             }
//           `}
//         </style>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { FaChartBar, FaInfoCircle, FaCrown } from "react-icons/fa";
import { useTooltip } from "@nivo/tooltip";
import { HashLoader } from "react-spinners";

export default function InvestedAmountPlot() {
  const [plotData, setPlotData] = useState([]);
  const [monthIdx, setMonthIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const uploadId = localStorage.getItem("uploadId");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/file/create_invested_amount_plot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ uploadId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((json) => {
        if (!json.plot_data || !Array.isArray(json.plot_data)) {
          throw new Error("Invalid data format");
        }
        setPlotData(json.plot_data);
        setIsLoading(false);
        if (json.plot_data.length === 0) {
          setMonthIdx(0);
        }
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [uploadId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }

  if (error || !plotData.length) {
    return (
      <div className="w-full max-w-[1500px] p-5 box-border font-inter bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 mx-auto">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <FaInfoCircle className="text-5xl text-gray-300 mb-6" />
          <h3 className="text-2xl mb-4 text-gray-800">
            {error ? "Data Unavailable" : "No Data Available"}
          </h3>
          <p className="text-gray-500 max-w-md">
            {error || "No investment data found for visualization."}
          </p>
        </div>
      </div>
    );
  }

  const validMonthIdx = Math.min(Math.max(0, monthIdx), plotData.length - 1);
  const { month, scrips } = plotData[validMonthIdx];
  const filtered = scrips.filter((d) => d.invested !== 0 || d.turnover !== 0);

  const totalInvested = filtered.reduce((sum, d) => sum + d.invested, 0);
  const totalTurnover = filtered.reduce((sum, d) => sum + d.turnover, 0);
  const topPerformer = filtered.length
    ? filtered.sort((a, b) => b.turnover - a.turnover)[0].scrip
    : null;

  const data = filtered.map((d) => ({
    scrip: d.scrip,
    invested: d.invested,
    turnover: d.turnover,
  }));

  const CustomBar = ({ bar }) => {
    const { showTooltipFromEvent, hideTooltip } = useTooltip();

    const isTopPerformer = bar.data.indexValue === topPerformer;
    const isTurnoverBar = bar.data.id === "turnover";
    const fillColor = isTopPerformer && isTurnoverBar ? "url(#goldGradient)" : bar.color;

    const tooltipContent = (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-50 min-w-[180px]">
        <div className="flex justify-between items-center mb-2 text-sm font-bold text-gray-900">
          <strong>{bar.data.indexValue}</strong>
          {isTopPerformer && (
            <span className="bg-blue-50 text-white px-2 py-1 rounded-full text-xs font-bold">
              <FaCrown className="text-yellow-400" />
            </span>
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span style={{ color: fillColor }}>
            {bar.data.id === "invested" ? "Invested:" : "Turnover:"}
          </span>
          <span className="font-bold text-blue-600">
            ₹{Number(bar.data.value).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    );

    return (
      <g
        transform={`translate(${bar.x},${bar.y})`}
        onMouseEnter={(e) => showTooltipFromEvent(tooltipContent, e)}
        onMouseMove={(e) => showTooltipFromEvent(tooltipContent, e)}
        onMouseLeave={hideTooltip}
      >
        <rect
          width={bar.width}
          height={bar.height}
          fill={fillColor}
          rx={4}
          ry={4}
        />
        {bar.height > 12 && (
          <text
            x={bar.width / 2}
            y={-6}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={10}
            fontWeight={500}
          >
            {Number(bar.data.value).toFixed(1)}
          </text>
        )}
      </g>
    );
  };

  const isCluttered = data.length > 12;

  return (
    <div className="w-full max-w-[1500px] p-4 box-border font-inter bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 mx-auto">
      <div className="relative bg-white/90 rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm">
        <div className="p-4 bg-gradient-to-r from-gray-50/70 to-blue-50/70 border-b border-gray-200/50 flex justify-between items-center flex-wrap">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white text-lg shadow-md flex items-center justify-center">
              <FaChartBar />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 -ml-0.5">
                Investment Performance
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Invested Amount vs Turnover by Stock
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="month-select"
              className="font-medium text-gray-600 text-sm"
            >
              Select Month:
            </label>
            <select
              id="month-select"
              value={monthIdx}
              onChange={(e) => setMonthIdx(Number(e.target.value))}
              className="p-2 border border-gray-200 rounded-lg bg-white text-gray-800 text-sm font-medium cursor-pointer shadow-sm min-w-[140px] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2712%27%20height%3D%2712%27%20fill%3D%27%234361ee%27%20viewBox%3D%270%200%2016%2016%27%3E%3Cpath%20d%3D%27M8%2011L3%206h10z%27%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:10px] appearance-none premium-select"
            >
              {plotData.map((d, i) => (
                <option key={d.month} value={i}>
                  {new Date(`${d.month}-01`).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-base">
              <FaChartBar />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1 font-medium">
                Total Monthly Invested
              </div>
              <div className="text-base font-bold text-gray-900">
                ₹{totalInvested.toLocaleString("en-IN")}
              </div>
            </div>
            <div
              data-tooltip="Sum of all investments across stocks"
              className="absolute bottom-1 right-2 text-sm text-gray-500 cursor-pointer info-icon"
            >
              <FaInfoCircle />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-yellow-500 text-base">
              <FaChartBar />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1 font-medium">
                Total Monthly Turnover
              </div>
              <div className="text-base font-bold text-gray-900">
                ₹{totalTurnover.toLocaleString("en-IN")}
              </div>
            </div>
            <div
              data-tooltip="Total sales value across all stocks"
              className="absolute bottom-1 right-2 text-sm text-gray-500 cursor-pointer info-icon"
            >
              <FaInfoCircle />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-green-500 text-base">
              <FaChartBar />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1 font-medium">
                Active Stocks
              </div>
              <div className="text-base font-bold text-gray-900">
                {filtered.length}
              </div>
            </div>
            <div
              data-tooltip="Number of stocks with investment or turnover"
              className="absolute bottom-1 right-2 text-sm text-gray-500 cursor-pointer info-icon"
            >
              <FaInfoCircle />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-yellow-400 text-base">
              <FaCrown />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1 font-medium">
                Top Performer
              </div>
              <div className="text-base font-bold text-gray-900">
                {topPerformer || "—"}
              </div>
            </div>
            <div
              data-tooltip="Stock with highest turnover"
              className="absolute bottom-1 right-2 text-sm text-gray-500 cursor-pointer info-icon"
            >
              <FaInfoCircle />
            </div>
          </div>
        </div>

        <div className="p-6 relative h-[40vh] min-h-[250px] max-h-[400px] overflow-hidden">
          <svg width="0" height="0">
            <defs>
              <linearGradient id="investedGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4A7BFF" />
                <stop offset="100%" stopColor="#3A6BEF" />
              </linearGradient>
              <linearGradient id="turnoverGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2ECC71" />
                <stop offset="100%" stopColor="#20BC61" />
              </linearGradient>
              <linearGradient id="goldGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </linearGradient>
              <linearGradient id="secondaryGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#A663CC" />
                <stop offset="100%" stopColor="#9347B8" />
              </linearGradient>
              <linearGradient id="accentGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FF7B7B" />
                <stop offset="100%" stopColor="#FF5E5E" />
              </linearGradient>
              <filter id="topPerformerGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-base text-gray-400 font-medium">
              No investment data available for {month}
            </div>
          ) : (
            <ResponsiveBar
              data={data}
              keys={["invested", "turnover"]}
              indexBy="scrip"
              margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
              padding={0.4}
              groupMode="grouped"
              layout="vertical"
              colors={({ id }) =>
                id === "invested" ? "url(#investedGradient)" : "url(#turnoverGradient)"
              }
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisBottom={{
                legend: "Stock",
                legendPosition: "middle",
                legendOffset: isCluttered ? 40 : 50,
                renderTick: (tick) => {
                  const words = tick.value.split(" ");
                  return (
                    <g transform={`translate(${tick.x},${tick.y + 10})`}>
                      <text
                        textAnchor={isCluttered ? "end" : "middle"}
                        dominantBaseline="middle"
                        transform={isCluttered ? "rotate(-40)" : undefined}
                        className="text-[9px] text-gray-600 font-inter"
                      >
                        {isCluttered ? (
                          tick.value
                        ) : (
                          words.map((word, i) => (
                            <tspan key={i} x={0} dy={i === 0 ? "0" : "1.1em"}>
                              {word}
                            </tspan>
                          ))
                        )}
                      </text>
                    </g>
                  );
                },
              }}
              axisLeft={{
                format: (v) => `₹${(v / 1000).toFixed(0)}K`,
                legend: "Amount (₹)",
                legendPosition: "middle",
                legendOffset: -50,
                tickSize: 4,
                tickPadding: 4,
                tickValues: 5,
              }}
              labelFormat={(v) => Number.parseFloat(v).toFixed(1)}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="#fff"
              motionConfig="gentle"
              animate={true}
              motionStiffness={90}
              motionDamping={20}
              barComponent={CustomBar}
              theme={{
                axis: {
                  legend: {
                    text: {
                      fontSize: 12,
                      fontWeight: 500,
                      fill: "#3e4756ff",
                    },
                  },
                  ticks: {
                    line: {
                      stroke: "#e2e8f0",
                      strokeWidth: 1,
                    },
                    text: {
                      fontSize: 9,
                      fill: "#718096",
                    },
                  },
                  domain: {
                    line: {
                      stroke: "#e2e8f0",
                      strokeWidth: 2,
                    },
                  },
                },
                grid: {
                  line: {
                    stroke: "#edf2f7",
                    strokeDasharray: "4 4",
                  },
                },
                tooltip: {
                  container: {
                    background: "white",
                    color: "#1f2937",
                    fontSize: "11px",
                    borderRadius: "8px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    padding: "10px",
                    border: "1px solid #f3f4f6",
                  },
                },
              }}
            />
          )}
        </div>

        <div className="p-6 flex justify-between items-center border-t border-gray-200/50 flex-wrap">
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="w-[14px] h-[14px] rounded bg-gradient-to-r from-blue-600 to-blue-700"></div>
              <span>Invested Amount</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="w-[14px] h-[14px] rounded bg-gradient-to-r from-green-500 to-green-600"></div>
              <span>Turnover</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="w-[14px] h-[14px] rounded bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              <span>Top Performer</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {month} Performance | {filtered.length} Active Stocks
          </div>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes bar-appear {
              from {
                transform: scaleY(0);
                opacity: 0;
              }
              to {
                transform: scaleY(1);
                opacity: 1;
              }
            }
            .premium-select:hover {
              border-color: #cbd5e0;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            .premium-select:focus {
              outline: none;
              border-color: #4361ee;
              box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
            }
            .info-icon:hover::after {
              content: attr(data-tooltip);
              position: absolute;
              bottom: 120%;
              right: 0;
              background: #f3f4f6;
              color: #111827;
              font-size: 11px;
              padding: 5px 8px;
              border-radius: 6px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
              z-index: 9999;
              width: 160px;
              white-space: normal;
              word-wrap: break-word;
              line-height: 1.4;
            }
            @media (max-width: 768px) {
              .premium-select {
                width: 100% !important;
                min-width: unset !important;
              }
              .info-icon:hover::after {
                width: 120px;
                font-size: 10px;
                padding: 4px 6px;
              }
            }
            @media (max-width: 480px) {
              .premium-select {
                font-size: 0.8rem !important;
                padding: 0.4rem 0.8rem !important;
              }
              .info-icon:hover::after {
                width: 100px;
                font-size: 9px;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}