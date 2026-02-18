

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Plot from "react-plotly.js";
// import { useGraphData } from "./GraphDataContext";
// import { HashLoader } from "react-spinners";

// const StockDepAmtOverTime = () => {
//   const [graphData, setLocalGraphData] = useState(null);
//   const [layout, setLayout] = useState(null);
//   const [error, setError] = useState("");
//   const [config, setConfig] = useState(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const { getGraphData, setGraphData } = useGraphData();

//   useEffect(() => {
//     const fetchGraphData = async () => {
//       const uploadId = localStorage.getItem("uploadId");
//       const cacheKey = `stock_deployed_amt_over_time_${uploadId}`;

//       if (!uploadId) {
//         setError("Please upload a file first.");
//         return;
//       }

//       // Check cache first
//       const cachedData = getGraphData(cacheKey);
//       if (cachedData) {
//         setLocalGraphData(cachedData.scatter_data);
//         setLayout(cachedData.layout);
//         setConfig(cachedData.config);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE}/file/stock_deployed_amt_over_time`,
//           new URLSearchParams({ uploadId })
//         );

//         const { scatter_data, layout, config } = response.data;

//         if (!scatter_data || !layout) {
//           setError("Graph generation failed. Please check the data or try again.");
//           return;
//         }

//         // Convert x (ISO dates or timestamps) to YYYY-MM-DD format
//         const parsedData = scatter_data.map((trace, traceIndex) => {
//           const xValues = Array.isArray(trace.x)
//             ? trace.x.map((val, index) => {
//                 if (val == null) {
//                   console.warn(`Null x value at trace ${traceIndex}, index ${index}:`, val);
//                   return null;
//                 }
//                 // Check if val is a numeric timestamp
//                 if (!isNaN(Number(val))) {
//                   const ms = String(val).length > 13 ? Math.floor(Number(val) / 1e6) : Number(val);
//                   const date = new Date(ms);
//                   if (!isNaN(date.getTime())) {
//                     return date.toISOString().split('T')[0];
//                   }
//                 }
//                 // Try parsing as ISO date string
//                 const date = new Date(val);
//                 if (!isNaN(date.getTime())) {
//                   return date.toISOString().split('T')[0];
//                 }
//                 console.warn(`Invalid x value at trace ${traceIndex}, index ${index}:`, val);
//                 return null;
//               }).filter((val) => val !== null)
//             : [];

//           const yValues = Array.isArray(trace.y)
//             ? trace.y.map((val) => parseFloat(val)).filter((val) => !isNaN(val))
//             : [];

//           return {
//             ...trace,
//             x: xValues,
//             y: yValues,
//           };
//         });

//         // Check if any trace has valid data
//         if (parsedData.every((trace) => trace.x.length === 0 || trace.y.length === 0)) {
//           console.error("All traces have empty x or y arrays:", parsedData);
//           setError("No valid data available to render the graph.");
//           return;
//         }

//         const newLayout = {
//           ...layout,
//           title: {
//             text: layout?.title?.text || "Stock Deployed Amount Over Time",
//             font: { size: 20 },
//           },
//           margin: { t: 50, l: 70, r: 30, b: 80 },
//           xaxis: {
//             title: {
//               text: "Date",
//               font: { size: 16 },
//             },
//             tickangle: -45,
//             type: "category",
//             tickfont: { size: 12 },
//           },
//           yaxis: {
//             title: {
//               text: "Amount (₹)",
//               font: { size: 16 },
//             },
//             tickprefix: "₹",
//             tickformat: ",.2r",
//             tickfont: { size: 12 },
//           },
//         };

//         const newConfig = {
//           ...config,
//           displayModeBar: false,
//           displaylogo: false,
//           responsive: true,
//         };

//         setLocalGraphData(parsedData);
//         setLayout(newLayout);
//         setConfig(newConfig);
//         // Cache the data
//         setGraphData(cacheKey, { scatter_data: parsedData, layout: newLayout, config: newConfig });
//       } catch (err) {
//         setError("Error fetching graph data: " + (err.response?.data?.message || err.message));
//         console.error("Graph StockDepAmtOverTime API Error:", err.response?.data || err.message);
//       }
//     };

//     fetchGraphData();
//   }, [getGraphData, setGraphData]);

//   return (
//      <div className="relative w-full max-w-full overflow-x-auto">
//       {error && <p className="text-red-500 text-center">{error}</p>}
//       {!error && (!graphData || !layout || !config) && (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>
//       )}
//       {graphData && layout && config && (
//         <Plot
//           data={graphData}
//           layout={layout}
//           config={config}
//           useResizeHandler={true}
//           style={{ width: "100%", height: "100%" }}
//         />
//       )}
//     </div>
//   );
// };

// export default StockDepAmtOverTime;


// import React, { useEffect, useState } from 'react';
// import { ResponsiveLine } from '@nivo/line';
// import { animated } from '@react-spring/web';
// import { useTooltip, Tooltip } from '@nivo/tooltip';
// import { FaChartLine, FaInfoCircle, FaCaretUp, FaCaretDown } from 'react-icons/fa';

// const LABELS = {
//   deployed: 'Deployed Amount',
//   marketValue: 'Market Value',
//   realizedPNL: 'Realized PNL'
// };

// // Custom Tooltip component for inline hover tooltips
// const CustomTooltip = ({ content, children }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   return (
//     <div style={{ display: 'inline-block' }}
//          onMouseEnter={() => setIsVisible(true)}
//          onMouseLeave={() => setIsVisible(false)}
//     >
//       {children}
//       {isVisible && (
//         <div style={{
//           position: 'absolute',
//           bottom: 'calc(100% + 8px)',
//           right: 0,
//           background: '#1f2937',
//           color: 'white',
//           padding: '10px 12px',
//           borderRadius: '8px',
//           whiteSpace: 'normal',
//           width: '220px',
//           maxWidth: '260px',
//           zIndex: 9999,
//           fontSize: '14px',
//           fontFamily: "'Inter', sans-serif",
//           boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
//           lineHeight: 1.4
//         }}>
//           {content}
//         </div>
//       )}
//     </div>
//   );
// };

// // Custom layer for rendering bars (market value) with native tooltips
// const barsLayer = ({ series, xScale, yScale }) => {
//   const { showTooltipFromEvent, hideTooltip } = useTooltip();
//   const marketValueSeries = series.find(s => s.id === 'marketValue');
//   if (!marketValueSeries) return null;
//   const barWidthMs = 20 * 24 * 60 * 60 * 1000; // 20 days

//   return (
//     <g>
//       {marketValueSeries.data.map((point, index) => {
//         const xDate = point.data.x;
//         if (!(xDate instanceof Date) || isNaN(xDate) || typeof point.data.y !== 'number' || isNaN(point.data.y)) {
//           return null;
//         }

//         const startDate = new Date(xDate.getTime() - barWidthMs / 2);
//         const endDate = new Date(xDate.getTime() + barWidthMs / 2);
//         const barStart = xScale(startDate);
//         const barEnd = xScale(endDate);
//         const barWidth = Math.max(barEnd - barStart, 0);

//         if (isNaN(barStart) || isNaN(barEnd) || isNaN(barWidth)) return null;

//         const yPoint = yScale(point.data.y);
//         const yZero = yScale(0);
//         const handleMouse = e => {
//           showTooltipFromEvent(
//             <Tooltip>
//               <div style={{
//                 background: 'white',
//                 padding: '0.75rem 1rem',
//                 borderRadius: '8px',
//                 boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//                 border: '1px solid #e2e8f0',
//                 fontSize: '0.95rem',
//                 minWidth: '180px',
//                 maxWidth: '280px',
//                 whiteSpace: 'normal'
//               }}>
//                 <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#343a40', fontWeight: 600 }}>
//                   {xDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
//                 </strong>
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <span style={{ color: '#ff7f0e' }}>Market Value:</span>
//                   <span>₹{point.data.y.toLocaleString('en-IN')}</span>
//                 </div>
//               </div>
//             </Tooltip>,
//             e
//           );
//         };

//         return (
//           <animated.rect
//             key={index}
//             x={barStart}
//             y={Math.min(yPoint, yZero)}
//             width={barWidth}
//             height={Math.abs(yPoint - yZero)}
//             fill="url(#barGradient)"
//             opacity={0.8}
//             style={{
//               borderRadius: '4px',
//               transformOrigin: 'center',
//               transform: 'scaleY(0)',
//               animation: 'bar-appear 0.6s ease-out forwards',
//               animationDelay: `${index * 50}ms`,
//               pointerEvents: 'all'
//             }}
//             onMouseEnter={handleMouse}
//             onMouseMove={handleMouse}
//             onMouseLeave={hideTooltip}
//           />
//         );
//       })}
//     </g>
//   );
// };

// // Custom layer for rendering scatter points (realized PNL) with native tooltips
// const scatterLayer = ({ series, xScale, yScale }) => {
//   const { showTooltipFromEvent, hideTooltip } = useTooltip();
//   const pnlSeries = series.find(s => s.id === 'realizedPNL');
//   if (!pnlSeries) return null;

//   return (
//     <g>
//       {pnlSeries.data.map((point, index) => {
//         const xDate = point.data.x;
//         const yVal = point.data.y;
//         if (!(xDate instanceof Date) || isNaN(xDate) || typeof yVal !== 'number' || isNaN(yVal)) return null;
//         if (yVal === 0) return null;

//         const color = yVal > 0 ? '#2ca02c' : '#d62728';
//         const handleMouse = e => {
//           showTooltipFromEvent(
//             <Tooltip>
//               <div style={{
//                 background: 'white',
//                 padding: '0.75rem 1rem',
//                 borderRadius: '8px',
//                 boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//                 border: '1px solid #e2e8f0',
//                 fontSize: '0.95rem',
//                 minWidth: '180px',
//                 maxWidth: '280px',
//                 whiteSpace: 'normal'
//               }}>
//                 <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#343a40', fontWeight: 600 }}>
//                   {xDate.toLocaleDateString('en-IN')}
//                 </strong>
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <span style={{ color }}>{yVal > 0 ? 'Profit' : 'Loss'}:</span>
//                   <span>₹{Math.abs(yVal).toLocaleString('en-IN')}</span>
//                 </div>
//               </div>
//             </Tooltip>,
//             e
//           );
//         };

//         return (
//           <animated.circle
//             key={index}
//             cx={xScale(xDate)}
//             cy={yScale(yVal)}
//             r={6}
//             fill={color}
//             stroke="#ffffff"
//             strokeWidth={1.5}
//             style={{
//               transformOrigin: 'center',
//               transform: 'scale(0)',
//               animation: 'point-appear 0.6s ease-out forwards',
//               animationDelay: `${index * 50}ms`,
//               pointerEvents: 'all',
//               filter: 'url(#pointShadow)'
//             }}
//             onMouseEnter={handleMouse}
//             onMouseMove={handleMouse}
//             onMouseLeave={hideTooltip}
//           />
//         );
//       })}
//     </g>
//   );
// };

// // Custom layer for rendering line (only deployed series) with animation
// const deployedLineLayer = ({ series, lineGenerator, xScale, yScale }) => {
//   const deployedSeries = series.find(s => s.id === 'deployed');
//   if (!deployedSeries) return null;

//   const validPoints = deployedSeries.data
//     .filter(pt => pt.data.x instanceof Date && !isNaN(pt.data.x) && typeof pt.data.y === 'number' && !isNaN(pt.data.y));

//   return (
//     <animated.g style={{ transformOrigin: 'center', animation: 'line-appear 0.8s ease-out forwards' }}>
//       <path
//         d={lineGenerator(validPoints.map(p => ({
//           x: xScale(p.data.x),
//           y: yScale(p.data.y)
//         })))}
//         stroke={deployedSeries.color}
//         strokeWidth={2}
//         fill="none"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         style={{ filter: 'url(#lineShadow)' }}
//       />
//       {validPoints.map((p, i) => (
//         <circle
//           key={i}
//           cx={xScale(p.data.x)}
//           cy={yScale(p.data.y)}
//           r={3}
//           fill={deployedSeries.color}
//           style={{ pointerEvents: 'none' }}
//         />
//       ))}
//     </animated.g>
//   );
// };

// export default function StockDeployedAmtOverTimeNivo() {
//   const [dataByScrip, setDataByScrip] = useState(null);
//   const [selected, setSelected] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//    fetch(`${API_BASE}/file/stock_deployed_amt_over_time`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: new URLSearchParams({ uploadId })
//         })
//       .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
//       .then(json => {
//         const processed = Object.fromEntries(Object.entries(json).map(([key, val]) => [key,
//           {
//             deployed: val.deployed.map(pt => ({ x: new Date(pt.x), y: +pt.y || 0 })),
//             marketValue: val.marketValue.map(pt => ({ x: new Date(pt.x), y: +pt.y || 0 })),
//             realizedPNL: val.realizedPNL.map(pt => ({ x: new Date(pt.x), y: +pt.y || 0 })),
//             lastBuyDate: val.lastBuyDate ? new Date(val.lastBuyDate) : null
//           }
//         ]));
//         setDataByScrip(processed);
//         setSelected(Object.keys(processed)[0] || null);
//       })
//       .catch(console.error)
//       .finally(() => setIsLoading(false));
//   }, []);

//   if (isLoading) return (
//     <div style={{
//       maxWidth: '1400px',
//       margin: '2rem auto',
//       padding: '2rem',
//       background: 'linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)',
//       borderRadius: '16px',
//       boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//       fontFamily: "'Inter', sans-serif",
//       color: '#343a40',
//       position: 'relative',
//       overflow: 'hidden',
//       width: '98vw',
//       border: '1px solid #e2e8f0'
//     }}>
//       <div style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'rgba(255, 255, 255, 0.9)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 100
//       }}>
//         <div style={{
//           width: '50px',
//           height: '50px',
//           border: '4px solid rgba(67, 97, 238, 0.2)',
//           borderTop: '4px solid #4361ee',
//           borderRadius: '50%',
//           animation: 'spin 1s linear infinite',
//           marginBottom: '1.5rem'
//         }}></div>
//         <div style={{
//           fontSize: '1.1rem',
//           fontWeight: 500,
//           color: '#495057'
//         }}>Loading financial data...</div>
//       </div>
//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );

//   if (!dataByScrip || !selected) return (
//     <div style={{
//       maxWidth: '1400px',
//       margin: '2rem auto',
//       padding: '2rem',
//       background: 'linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)',
//       borderRadius: '16px',
//       boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//       fontFamily: "'Inter', sans-serif",
//       color: '#343a40',
//       position: 'relative',
//       overflow: 'hidden',
//       width: '98vw',
//       border: '1px solid #e2e8f0'
//     }}>
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '3rem',
//         textAlign: 'center'
//       }}>
//         <FaInfoCircle style={{ fontSize: '3rem', color: '#ced4da', marginBottom: '1.5rem' }} />
//         <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#343a40' }}>Data Unavailable</h3>
//         <p style={{ color: '#6c757d', maxWidth: '500px' }}>Could not load stock deployment data. Please try again later.</p>
//       </div>
//     </div>
//   );

//   const { deployed, marketValue, realizedPNL, lastBuyDate } = dataByScrip[selected];

//   // Calculate metrics for the performance cards
//   const latestDeployed = deployed[deployed.length - 1]?.y || 0;
//   const latestMarketValue = marketValue[marketValue.length - 1]?.y || 0;
//   const totalRealizedPNL = realizedPNL.reduce((sum, pt) => sum + (typeof pt.y === 'number' ? pt.y : 0), 0);

//   // Calculate days since last buy
//   const currentDate = new Date('2025-07-20');
//   const daysSinceLastBuy = lastBuyDate
//     ? Math.floor((currentDate - lastBuyDate) / (1000 * 60 * 60 * 24))
//     : '—';

//   const series = [
//     { id: 'deployed', data: deployed, color: '#4361ee' },
//     { id: 'marketValue', data: marketValue, color: '#efb027ff' },
//     { id: 'realizedPNL', data: realizedPNL, color: '#2ca02c' }
//   ];

//   return (
//     <div style={{
//       maxWidth: '1400px',
//       margin: '2rem auto',
//       padding: '2rem',
//       background: 'linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)',
//       borderRadius: '16px',
//       boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//       fontFamily: "'Inter', sans-serif",
//       color: '#343a40',
//       position: 'relative',
//       overflow: 'hidden',
//       width: '98vw',
//       border: '1px solid #e2e8f0'
//     }}>
//       <svg width="0" height="0">
//         <defs>
//           <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
//             <stop offset="0%" stopColor="#efb027ff" />
//             <stop offset="100%" stopColor="#dc8f23ff" />
//           </linearGradient>
//           <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
//             <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0, 0, 0, 0.1)" floodOpacity="0.1" />
//           </filter>
//           <filter id="pointShadow" x="-50%" y="-50%" width="200%" height="200%">
//             <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.2)" />
//           </filter>
//         </defs>
//       </svg>

//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '2rem',
//         paddingBottom: '1.5rem',
//         borderBottom: '1px solid #edf2f7'
//       }}>
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '1rem'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '48px',
//             height: '48px',
//             background: 'linear-gradient(135deg, #4361ee 0%, #2a44c4 100%)',
//             borderRadius: '12px',
//             color: 'white',
//             fontSize: '1.5rem',
//             boxShadow: '0 4px 6px rgba(67, 97, 238, 0.2)'
//           }}>
//             <FaChartLine />
//           </div>
//           <div>
//             <h2 style={{
//               margin: 0,
//               fontSize: '1.8rem',
//               fontWeight: 700,
//               color: '#212529',
//               letterSpacing: '-0.02em'
//             }}>Stock Deployment Overview</h2>
//             <p style={{
//               margin: '0.25rem 0 0',
//               fontSize: '1rem',
//               color: '#6c757d',
//               fontWeight: 400
//             }}>Deployed, Market Value & Realized PNL Over Time</p>
//           </div>
//         </div>
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '1.5rem'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.75rem'
//           }}>
//             <label htmlFor="stock-select" style={{
//               fontWeight: 500,
//               color: '#495057',
//               fontSize: '0.95rem'
//             }}>Select Stock:</label>
//             <select
//               id="stock-select"
//               value={selected}
//               onChange={e => setSelected(e.target.value)}
//               style={{
//                 padding: '0.75rem 1.25rem',
//                 border: '1px solid #e2e8f0',
//                 borderRadius: '8px',
//                 background: 'white',
//                 color: '#343a40',
//                 fontSize: '1rem',
//                 fontWeight: 500,
//                 cursor: 'pointer',
//                 boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
//                 minWidth: '180px',
//                 backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%234361ee\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
//                 backgroundRepeat: 'no-repeat',
//                 backgroundPosition: 'right 1rem center',
//                 backgroundSize: '12px',
//                 appearance: 'none'
//               }}
//             >
//               {Object.keys(dataByScrip).map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </div>
//         </div>
//       </div>

//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(4, 1fr)',
//         gap: '1.5rem',
//         marginBottom: '2rem'
//       }}>
//         {/* Deployed Amount */}
//         <div style={{
//           background: 'white',
//           borderRadius: '8px',
//           padding: '1.5rem',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//           border: '1px solid #edf2f7',
//           position: 'relative',
//           overflow: 'hidden',
//           display: 'block'
//         }}>
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '4px',
//             background: '#4361ee'
//           }}></div>
//           <div style={{
//             fontSize: '0.95rem',
//             color: '#6c757d',
//             marginBottom: '0.5rem',
//             fontWeight: 500,
//             display: 'block'
//           }}>
//             Deployed Amount
//             <div style={{
//               position: 'absolute',
//               bottom: '4px',
//               right: '4px',
//               fontSize: '16px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}>
//               <CustomTooltip content="Total money you've invested so far in this stock.">
//                 <FaInfoCircle />
//               </CustomTooltip>
//             </div>
//           </div>
//           <div style={{
//             fontSize: '1.8rem',
//             fontWeight: 700,
//             color: '#212529',
//             marginBottom: '0.5rem',
//             letterSpacing: '-0.01em',
//             display: 'block'
//           }}>₹{latestDeployed.toLocaleString('en-IN')}</div>
//         </div>

//         {/* Market Value */}
//         <div style={{
//           background: 'white',
//           borderRadius: '8px',
//           padding: '1.5rem',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//           border: '1px solid #edf2f7',
//           position: 'relative',
//           overflow: 'hidden',
//           display: 'block'
//         }}>
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '4px',
//             background: '#4361ee'
//           }}></div>
//           <div style={{
//             fontSize: '0.95rem',
//             color: '#6c757d',
//             marginBottom: '0.5rem',
//             fontWeight: 500,
//             display: 'block'
//           }}>
//             Current Market Value <br /> in your portfolio
//             <div style={{
//               position: 'absolute',
//               bottom: '4px',
//               right: '4px',
//               fontSize: '16px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}>
//               <CustomTooltip content="Present market worth of your holdings in this stock.">
//                 <FaInfoCircle />
//               </CustomTooltip>
//             </div>
//           </div>
//           <div style={{
//             fontSize: '1.8rem',
//             fontWeight: 700,
//             color: '#212529',
//             marginBottom: '0.5rem',
//             letterSpacing: '-0.01em',
//             display: 'block'
//           }}>₹{latestMarketValue.toLocaleString('en-IN')}</div>
//         </div>

//         {/* Realized PNL */}
//         <div style={{
//           background: 'white',
//           borderRadius: '8px',
//           padding: '1.5rem',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//           border: '1px solid #edf2f7',
//           position: 'relative',
//           overflow: 'hidden',
//           display: 'block'
//         }}>
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '4px',
//             background: '#4361ee'
//           }}></div>
//           <div style={{
//             fontSize: '0.95rem',
//             color: '#6c757d',
//             marginBottom: '0.5rem',
//             fontWeight: 500,
//             display: 'block'
//           }}>
//             Realized Profit / Loss
//             <div style={{
//               position: 'absolute',
//               bottom: '4px',
//               right: '4px',
//               fontSize: '16px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}>
//               <CustomTooltip content="Profit or loss you've actually made by selling the stock.">
//                 <FaInfoCircle />
//               </CustomTooltip>
//             </div>
//           </div>
//           <div style={{
//             fontSize: '1.8rem',
//             fontWeight: 700,
//             color: totalRealizedPNL >= 0 ? '#2ca02c' : '#ef1f1f',
//             marginBottom: '0.5rem',
//             letterSpacing: '-0.01em',
//             display: 'block'
//           }}>
//             ₹{Number(Math.abs(totalRealizedPNL).toFixed(2)).toLocaleString('en-IN')}
//           </div>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.25rem',
//             fontWeight: 600,
//             fontSize: '0.95rem',
//             color: totalRealizedPNL >= 0 ? '#2ca02c' : '#ef1f1f',
//             display: 'block'
//           }}>
//             {totalRealizedPNL >= 0 ? <FaCaretUp /> : <FaCaretDown />}
//             {totalRealizedPNL >= 0 ? 'Total Profit' : 'Total Loss'}
//           </div>
//         </div>

//         {/* Unrealized Gain */}
//         <div style={{
//           background: 'white',
//           borderRadius: '8px',
//           padding: '1.5rem',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//           border: '1px solid #edf2f7',
//           position: 'relative',
//           overflow: 'hidden',
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '2rem',
//           alignItems: 'flex-end'
//         }}>
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '4px',
//             background: '#4361ee'
//           }}></div>
//           <div style={{
//             fontSize: '0.95rem',
//             color: '#6c757d',
//             marginBottom: '0.5rem',
//             fontWeight: 500,
//             display: 'block'
//           }}>
//             Unrealized Gain
//             <div style={{
//               position: 'absolute',
//               bottom: '4px',
//               right: '4px',
//               fontSize: '16px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}>
//               <CustomTooltip content="Estimated profit/loss if you sold your holdings now.">
//                 <FaInfoCircle />
//               </CustomTooltip>
//             </div>
//           </div>
//           <div style={{
//             fontSize: '1.8rem',
//             fontWeight: 700,
//             color: '#212529',
//             marginBottom: '0.5rem',
//             letterSpacing: '-0.01em',
//             display: 'inline-block',
//             marginRight: '1rem'
//           }}>
//             ₹{(latestMarketValue - latestDeployed).toLocaleString('en-IN')}
//           </div>
//           <div style={{
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: '0.25rem',
//             fontWeight: 600,
//             fontSize: '0.95rem',
//             color: '#2ca02c',
//             verticalAlign: 'middle'
//           }}>
//             <FaCaretUp />
//             {latestDeployed > 0
//               ? `${(((latestMarketValue - latestDeployed) / latestDeployed) * 100).toFixed(2)}%`
//               : '—'}
//           </div>
//           {(latestMarketValue - latestDeployed) !== 0 && (
//             <div style={{
//               display: 'inline-block',
//               marginLeft: '1rem',
//               verticalAlign: 'bottom',
//               fontSize: '0.95rem',
//               color: '#6c757d',
//               fontWeight: 500
//             }}>
//               {daysSinceLastBuy} {daysSinceLastBuy === 1 ? 'day' : 'days'} since last Buy
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={{
//         background: 'white',
//         borderRadius: '12px',
//         padding: '1.5rem',
//         border: '1px solid #e2e8f0',
//         boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
//         marginBottom: '2rem',
//         position: 'relative'
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '1.5rem'
//         }}>
//           <h3 style={{
//             fontSize: '1.4rem',
//             fontWeight: 700,
//             color: '#212529',
//             margin: 0,
//             letterSpacing: '-0.01em'
//           }}>{selected}</h3>
//           <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '1.5rem'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               fontSize: '0.99rem',
//               fontWeight: 500,
//               color: '#212529'
//             }}>
//               <div style={{
//                 width: '12px',
//                 height: '12px',
//                 borderRadius: '50%',
//                 background: '#4361ee'
//               }}></div>
//               <span>Deployed Amount</span>
//             </div>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               fontSize: '0.99rem',
//               fontWeight: 500,
//               color: '#212529'
//             }}>
//               <div style={{
//                 width: '12px',
//                 height: '12px',
//                 borderRadius: '50%',
//                 background: '#efb027ff'
//               }}></div>
//               <span>Market Value</span>
//             </div>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               fontSize: '0.99rem',
//               fontWeight: 500,
//               color: '#212529'
//             }}>
//               <div style={{
//                 width: '12px',
//                 height: '12px',
//                 borderRadius: '50%',
//                 background: '#2ca02c'
//               }}></div>
//               <span>Profit</span>
//             </div>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               fontSize: '0.99rem',
//               fontWeight: 500,
//               color: '#212529'
//             }}>
//               <div style={{
//                 width: '12px',
//                 height: '12px',
//                 borderRadius: '50%',
//                 background: '#d62728'
//               }}></div>
//               <span>Loss</span>
//             </div>
//           </div>
//         </div>
//         <div style={{ height: '500px', position: 'relative' }}>
//           <ResponsiveLine
//             data={series}
//             margin={{ top: 40, right: 40, bottom: 70, left: 70 }}
//             xScale={{ type: 'time', format: 'native', precision: 'day' }}
//             yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
//             curve="catmullRom"
//             axisBottom={{
//               format: '%b %Y',
//               tickValues: 'every 2 months',
//               tickPadding: 10,
//               tickRotation: 0,
//               legend: 'Date',
//               legendOffset: 40,
//               legendPosition: 'middle'
//             }}
//             axisLeft={{
//               legend: 'Amount (₹)',
//               legendPosition: 'middle',
//               legendOffset: -60,
//               format: v => `${(v/1000).toFixed(0)}K`,
//               tickPadding: 10
//             }}
//             colors={{ datum: 'color' }}
//             lineWidth={3}
//             pointSize={0}
//             pointBorderWidth={0}
//             enableSlices={false}
//             tooltip={({ point }) => {
//               const date = new Date(point.data.x);
//               const formattedDate = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
//               const roundedValue = Number(point.data.yFormatted).toFixed(2);
//               const label = LABELS[point.seriesId] || point.seriesId;

//               return (
//                 <div style={{
//                   background: 'white',
//                   padding: '0.75rem 1rem',
//                   borderRadius: '8px',
//                   boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//                   border: '1px solid #e2e8f0',
//                   fontSize: '0.95rem',
//                   minWidth: '180px',
//                   maxWidth: '280px',
//                   whiteSpace: 'normal'
//                 }}>
//                   <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#343a40', fontWeight: 600 }}>
//                     {formattedDate}
//                   </strong>
//                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <span style={{ color: point.seriesColor }}>{label}</span>
//                     <span>₹{Number(roundedValue).toLocaleString('en-IN')}</span>
//                   </div>
//                 </div>
//               );
//             }}
//             layers={['grid', 'axes', barsLayer, deployedLineLayer, scatterLayer, 'mesh', 'legends']}
//             motionConfig="gentle"
//             useMesh
//             theme={{
//               axis: {
//                 legend: { text: { fontSize: 16, fontWeight: 500, fill: '#3e4756ff' } },
//                 ticks: { text: { fontSize: 11, fill: '#718096' }, line: { stroke: '#e2e8f0', strokeWidth: 1 } },
//                 domain: { stroke: '#e2e8f0', strokeWidth: 2 }
//               },
//               fontFamily: 'Inter, sans-serif',
//               fontSize: 13,
//               textColor: '#363e4bff',
//               grid: { line: { stroke: '#edf2f7', strokeDasharray: '4 4' } },
//               legends: { text: { fontSize: 12, fill: '#333b48ff' } }
//             }}
//           />
//         </div>
//       </div>
//       <style>
//         {`
//           @keyframes bar-appear {
//             from { transform: scaleY(0); opacity: 0; }
//             to { transform: scaleY(1); opacity: 0.8; }
//           }
//           @keyframes point-appear {
//             from { transform: scale(0); opacity: 0; }
//             to { transform: scale(1); opacity: 1; }
//           }
//           @keyframes line-appear {
//             from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
//             to { stroke-dashoffset: 0; }
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// }




// import React, { useEffect, useState } from 'react';
// import { ResponsiveLine } from '@nivo/line';
// import { animated } from '@react-spring/web';
// import { useTooltip, Tooltip } from '@nivo/tooltip';
// import { FaChartLine, FaInfoCircle, FaCaretUp, FaCaretDown } from 'react-icons/fa';
// import { HashLoader } from 'react-spinners';

// const LABELS = {
//   deployed: 'Deployed Amount',
//   marketValue: 'Market Value',
//   realizedPNL: 'Realized PNL'
// };

// // Custom Tooltip component for inline hover tooltips
// const CustomTooltip = ({ content, children }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   return (
//     <div style={{ display: 'inline-block', position: 'relative' }}
//          onMouseEnter={() => setIsVisible(true)}
//          onMouseLeave={() => setIsVisible(false)}
//     >
//       {children}
//       {isVisible && (
//         <div style={{
//           position: 'absolute',
//           bottom: 'calc(100% + 8px)',
//           right: 0,
//           background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
//           color: 'white',
//           padding: '8px 12px',
//           borderRadius: '6px',
//           whiteSpace: 'normal',
//           width: '200px',
//           zIndex: 9999,
//           fontSize: '13px',
//           fontFamily: "'Inter', sans-serif",
//           boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
//           lineHeight: 1.5
//         }}>
//           {content}
//         </div>
//       )}
//     </div>
//   );
// };

// // Custom layer for rendering bars (market value) with native tooltips
// const barsLayer = ({ series, xScale, yScale }) => {
//   const { showTooltipFromEvent, hideTooltip } = useTooltip();
//   const marketValueSeries = series.find(s => s.id === 'marketValue');
//   if (!marketValueSeries) return null;
//   const barWidthMs = 20 * 24 * 60 * 60 * 1000; // 20 days

//   return (
//     <g>
//       {marketValueSeries.data.map((point, index) => {
//         const xDate = point.data.x;
//         if (!(xDate instanceof Date) || isNaN(xDate) || typeof point.data.y !== 'number' || isNaN(point.data.y)) {
//           return null;
//         }

//         const startDate = new Date(xDate.getTime() - barWidthMs / 2);
//         const endDate = new Date(xDate.getTime() + barWidthMs / 2);
//         const barStart = xScale(startDate);
//         const barEnd = xScale(endDate);
//         const barWidth = Math.max(barEnd - barStart, 0);

//         if (isNaN(barStart) || isNaN(barEnd) || isNaN(barWidth)) return null;

//         const yPoint = yScale(point.data.y);
//         const yZero = yScale(0);
//         const handleMouse = e => {
//           showTooltipFromEvent(
//             <Tooltip>
//               <div style={{
//                 background: 'white',
//                 padding: '0.6rem 1rem',
//                 borderRadius: '6px',
//                 boxShadow: '0 8px 12px rgba(0,0,0,0.1)',
//                 border: '1px solid #e5e7eb',
//                 fontSize: '0.9rem',
//                 minWidth: '160px',
//                 maxWidth: '240px',
//                 whiteSpace: 'normal'
//               }}>
//                 <strong style={{ display: 'block', marginBottom: '0.4rem', color: '#1f2937', fontWeight: 600 }}>
//                   {xDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
//                 </strong>
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <span style={{ color: '#f59e0b' }}>Market Value:</span>
//                   <span>₹{point.data.y.toLocaleString('en-IN')}</span>
//                 </div>
//               </div>
//             </Tooltip>,
//             e
//           );
//         };

//         return (
//           <animated.rect
//             key={index}
//             x={barStart}
//             y={Math.min(yPoint, yZero)}
//             width={barWidth}
//             height={Math.abs(yPoint - yZero)}
//             fill="url(#barGradient)"
//             opacity={0.85}
//             style={{
//               borderRadius: '3px',
//               transformOrigin: 'center',
//               transform: 'scaleY(0)',
//               animation: 'bar-appear 0.5s ease-out forwards',
//               animationDelay: `${index * 40}ms`,
//               pointerEvents: 'all'
//             }}
//             onMouseEnter={handleMouse}
//             onMouseMove={handleMouse}
//             onMouseLeave={hideTooltip}
//           />
//         );
//       })}
//     </g>
//   );
// };

// // Custom layer for rendering scatter points (realized PNL) with native tooltips
// const scatterLayer = ({ series, xScale, yScale }) => {
//   const { showTooltipFromEvent, hideTooltip } = useTooltip();
//   const pnlSeries = series.find(s => s.id === 'realizedPNL');
//   if (!pnlSeries) return null;

//   return (
//     <g>
//       {pnlSeries.data.map((point, index) => {
//         const xDate = point.data.x;
//         const yVal = point.data.y;
//         if (!(xDate instanceof Date) || isNaN(xDate) || typeof yVal !== 'number' || isNaN(yVal)) return null;
//         if (yVal === 0) return null;

//         const color = yVal > 0 ? '#22c55e' : '#ef4444';
//         const handleMouse = e => {
//           showTooltipFromEvent(
//             <Tooltip>
//               <div style={{
//                 background: 'white',
//                 padding: '0.6rem 1rem',
//                 borderRadius: '6px',
//                 boxShadow: '0 8px 12px rgba(0,0,0,0.1)',
//                 border: '1px solid #e5e7eb',
//                 fontSize: '0.5rem',
//                 minWidth: '160px',
//                 maxWidth: '240px',
//                 whiteSpace: 'normal'
//               }}>
//                 <strong style={{ display: 'block', marginBottom: '0.4rem', color: '#1f2937', fontWeight: 600 }}>
//                   {xDate.toLocaleDateString('en-IN')}
//                 </strong>
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <span style={{ color }}>{yVal > 0 ? 'Profit' : 'Loss'}:</span>
//                   <span>₹{Math.abs(yVal).toLocaleString('en-IN')}</span>
//                 </div>
//               </div>
//             </Tooltip>,
//             e
//           );
//         };

//         return (
//           <animated.circle
//             key={index}
//             cx={xScale(xDate)}
//             cy={yScale(yVal)}
//             r={5}
//             fill={color}
//             stroke="#ffffff"
//             strokeWidth={1.2}
//             style={{
//               transformOrigin: 'center',
//               transform: 'scale(0)',
//               animation: 'point-appear 0.5s ease-out forwards',
//               animationDelay: `${index * 40}ms`,
//               pointerEvents: 'all',
//               filter: 'url(#pointShadow)'
//             }}
//             onMouseEnter={handleMouse}
//             onMouseMove={handleMouse}
//             onMouseLeave={hideTooltip}
//           />
//         );
//       })}
//     </g>
//   );
// };

// // Custom layer for rendering line (only deployed series) with animation
// const deployedLineLayer = ({ series, lineGenerator, xScale, yScale }) => {
//   const deployedSeries = series.find(s => s.id === 'deployed');
//   if (!deployedSeries) return null;

//   const validPoints = deployedSeries.data
//     .filter(pt => pt.data.x instanceof Date && !isNaN(pt.data.x) && typeof pt.data.y === 'number' && !isNaN(pt.data.y));

//   return (
//     <animated.g style={{ transformOrigin: 'center', animation: 'line-appear 0.7s ease-out forwards' }}>
//       <path
//         d={lineGenerator(validPoints.map(p => ({
//           x: xScale(p.data.x),
//           y: yScale(p.data.y)
//         })))}
//         stroke={deployedSeries.color}
//         strokeWidth={2.5}
//         fill="none"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         style={{ filter: 'url(#lineShadow)' }}
//       />
//       {validPoints.map((p, i) => (
//         <circle
//           key={i}
//           cx={xScale(p.data.x)}
//           cy={yScale(p.data.y)}
//           r={2.5}
//           fill={deployedSeries.color}
//           style={{ pointerEvents: 'none' }}
//         />
//       ))}
//     </animated.g>
//   );
// };

// export default function StockDeployedAmtOverTimeNivo() {
//   const [dataByScrip, setDataByScrip] = useState(null);
//   const [selected, setSelected] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE}/file/stock_deployed_amt_over_time`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: new URLSearchParams({ uploadId })
//     })
//       .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
//       .then(json => {
//         const processed = Object.fromEntries(Object.entries(json).map(([key, val]) => [key,
//           {
//             deployed: val.deployed.map(pt => ({ x: new Date(pt.x), y: +pt.y || 0 })),
//             marketValue: val.marketValue.map(pt => ({ x: new Date(pt.x), y: +pt.y || 0 })),
//             realizedPNL: val.realizedPNL.map(pt => ({ x: new Date(pt.x), y: +pt.y || 0 })),
//             lastBuyDate: val.lastBuyDate ? new Date(val.lastBuyDate) : null
//           }
//         ]));
//         setDataByScrip(processed);
//         setSelected(Object.keys(processed)[0] || null);
//       })
//       .catch(console.error)
//       .finally(() => setIsLoading(false));
//   }, []);

//   if (isLoading) return (
//    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>
//   );

//   if (!dataByScrip || !selected) return (
//     <div style={{
//       maxWidth: '1500px',
//       margin: '1.5rem auto',
//       padding: '1.5rem',
//       background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
//       borderRadius: '12px',
//       boxShadow: '0 8px 12px rgba(0,0,0,0.05)',
//       fontFamily: "'Inter', sans-serif",
//       color: '#1f2937',
//       width: '95vw',
//       border: '1px solid #e5e7eb',
//       overflow: 'hidden'
//     }}>
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '2rem',
//         textAlign: 'center'
//       }}>
//         <FaInfoCircle style={{ fontSize: '2.5rem', color: '#d1d5db', marginBottom: '1rem' }} />
//         <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: '#1f2937' }}>Data Unavailable</h3>
//         <p style={{ color: '#6b7280', maxWidth: '400px' }}>Could not load stock deployment data. Please try again later.</p>
//       </div>
//     </div>
//   );

//   const { deployed, marketValue, realizedPNL, lastBuyDate } = dataByScrip[selected];

//   // Calculate metrics for the performance cards
//   const latestDeployed = deployed[deployed.length - 1]?.y || 0;
//   const latestMarketValue = marketValue[marketValue.length - 1]?.y || 0;
//   const totalRealizedPNL = realizedPNL.reduce((sum, pt) => sum + (typeof pt.y === 'number' ? pt.y : 0), 0);

//   // Calculate days since last buy
//   const currentDate = new Date('2025-07-20');
//   const daysSinceLastBuy = lastBuyDate
//     ? Math.floor((currentDate - lastBuyDate) / (1000 * 60 * 60 * 24))
//     : '—';

//   const series = [
//     { id: 'deployed', data: deployed, color: '#3b82f6' },
//     { id: 'marketValue', data: marketValue, color: '#f59e0b' },
//     { id: 'realizedPNL', data: realizedPNL, color: '#22c55e' }
//   ];

//   return (
//     <div style={{
//       maxWidth: '1500px',
//       margin: '1rem auto',
//       padding: '1rem',
//       background: 'linear-gradient(145deg, #ffffff 0%,0deg #f9fafb 100%)',
//       borderRadius: '10px',
//       boxShadow: '0 6px 10px rgba(0,0,0,0.05)',
//       fontFamily: "'Inter', sans-serif",
//       color: '#1f2937',
//       width: '90vw',
//       border: '1px solid #e5e7eb',
//       overflow: 'hidden'
//     }}>
//       <svg width="0" height="0">
//         <defs>
//           <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
//             <stop offset="0%" stopColor="#f59e0b" />
//             <stop offset="100%" stopColor="#d97706" />
//           </linearGradient>
//           <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
//             <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.1)" floodOpacity="0.15" />
//           </filter>
//           <filter id="pointShadow" x="-50%" y="-50%" width="200%" height="200%">
//             <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0, 0, 0, 0.2)" />
//           </filter>
//         </defs>
//       </svg>

//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '1rem',
//         paddingBottom: '0.8rem',
//         borderBottom: '1px solid #e5e7eb'
//       }}>
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '0.75rem'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '30px',
//             height: '30px',
//             background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//             borderRadius: '8px',
//             color: 'white',
//             fontSize: '1rem',
//             boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
//           }}>
//             <FaChartLine />
//           </div>
//           <div>
//             <h2 style={{
//               margin: 0,
//               fontSize: '1.3rem',
//               fontWeight: 700,
//               color: '#1f2937',
//               letterSpacing: '-0.01em'
//             }}>Stock Deployment Overview</h2>
//             <p style={{
//               margin: '0.1rem 0 0',
//               fontSize: '0.7rem',
//               color: '#6b7280',
//               fontWeight: 400
//             }}>Deployed, Market Value & Realized PNL Over Time</p>
//           </div>
//         </div>
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '0.8rem'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.4rem'
//           }}>
//             <label htmlFor="stock-select" style={{
//               fontWeight: 500,
//               color: '#4b5563',
//               fontSize: '0.7rem'
//             }}>Select Stock:</label>
//             <select
//               id="stock-select"
//               value={selected}
//               onChange={e => setSelected(e.target.value)}
//               style={{
//                 padding: '0.4rem 2rem 0.4rem 0.8rem',
//                 border: '1px solid #e5e7eb',
//                 borderRadius: '4px',
//                 background: 'white',
//                 color: '#1f2937',
//                 fontSize: '0.8rem',
//                 fontWeight: 500,
//                 cursor: 'pointer',
//                 boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//                 minWidth: '120px',
//                 backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' fill=\'%233b82f6\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
//                 backgroundRepeat: 'no-repeat',
//                 backgroundPosition: 'right 0.6rem center',
//                 backgroundSize: '8px',
//                 appearance: 'none'
//               }}
//             >
//               {Object.keys(dataByScrip).map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </div>
//         </div>
//       </div>

//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
//         gap: '0.8rem',
//         marginBottom: '1rem'
//       }}>
//         {/* Deployed Amount */}
//         <div style={{
//           background: 'white',
//           borderRadius: '6px',
//           padding: '0.8rem',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
//           border: '1px solid #e5e7eb',
//           position: 'relative'
//         }}>
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '2px',
//             background: '#3b82f6'
//           }}></div>
//           <div style={{
//             fontSize: '0.7rem',
//             color: '#6b7280',
//             marginBottom: '0.3rem',
//             fontWeight: 500
//           }}>
//             Deployed Amount
//             <div style={{
//               position: 'absolute',
//               bottom: '3px',
//               right: '3px',
//               fontSize: '12px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}>
//               <CustomTooltip content="Total money you've invested so far in this stock.">
//                 <FaInfoCircle />
//               </CustomTooltip>
//             </div>
//           </div>
//           <div style={{
//             fontSize: '1.3rem',
//             fontWeight: 700,
//             color: '#1f2937',
//             marginBottom: '0.3rem',
//             letterSpacing: '-0.01em'
//           }}>₹{latestDeployed.toLocaleString('en-IN')}</div>
//         </div>

//         {/* Market Value */}
//         <div style={{
//           background: 'white',
//           borderRadius: '6px',
//           padding: '0.8rem',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
//           border: '1px solid #e5e7eb',
//           position: 'relative'
//         }}>
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '2px',
//             background: '#3b82f6'
//           }}></div>
//           <div style={{
//             fontSize: '0.7rem',
//             color: '#6b7280',
//             marginBottom: '0.3rem',
//             fontWeight: 500
//           }}>
//             Current Market Value
//             <div style={{
//               position: 'absolute',
//               bottom: '3px',
//               right: '3px',
//               fontSize: '12px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}>
//               <CustomTooltip content="Present market worth of your holdings in this stock.">
//                 <FaInfoCircle />
//               </CustomTooltip>
//             </div>
//           </div>
//           <div style={{
//             fontSize: '1.3rem',
//             fontWeight: 700,
//             color: '#1f2937',
//             marginBottom: '0.3rem',
//             letterSpacing: '-0.01em'
//           }}>₹{latestMarketValue.toLocaleString('en-IN')}</div>
//         </div>

//         {/* Realized PNL */}
//         <div style={{
//           background: 'white',
//           borderRadius: '6px',
//           padding: '0.8rem',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
//           border: '1px solid #e5e7eb',
//           position: 'relative'
//         }}>
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '2px',
//             background: '#3b82f6'
//           }}></div>
//           <div style={{
//             fontSize: '0.7rem',
//             color: '#6b7280',
//             marginBottom: '0.3rem',
//             fontWeight: 500
//           }}>
//             Realized Profit / Loss
//             <div style={{
//               position: 'absolute',
//               bottom: '3px',
//               right: '3px',
//               fontSize: '12px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}>
//               <CustomTooltip content="Profit or loss you've actually made by selling the stock.">
//                 <FaInfoCircle />
//               </CustomTooltip>
//             </div>
//           </div>
//           <div style={{
//             fontSize: '1.3rem',
//             fontWeight: 700,
//             color: totalRealizedPNL >= 0 ? '#22c55e' : '#ef4444',
//             marginBottom: '0.3rem',
//             letterSpacing: '-0.01em'
//           }}>
//             ₹{Number(Math.abs(totalRealizedPNL).toFixed(2)).toLocaleString('en-IN')}
//           </div>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.1rem',
//             fontWeight: 600,
//             fontSize: '0.7rem',
//             color: totalRealizedPNL >= 0 ? '#22c55e' : '#ef4444'
//           }}>
//             {totalRealizedPNL >= 0 ? <FaCaretUp /> : <FaCaretDown />}
//             {totalRealizedPNL >= 0 ? 'Total Profit' : 'Total Loss'}
//           </div>
//         </div>

//         {/* Unrealized Gain */}
//         <div style={{
//           background: 'white',
//           borderRadius: '6px',
//           padding: '0.8rem',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
//           border: '1px solid #e5e7eb',
//           position: 'relative'
//         }}>
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '2px',
//             background: '#3b82f6'
//           }}></div>
//           <div style={{
//             fontSize: '0.7rem',
//             color: '#6b7280',
//             marginBottom: '0.3rem',
//             fontWeight: 500
//           }}>
//             Unrealized Gain
//             <div style={{
//               position: 'absolute',
//               bottom: '3px',
//               right: '3px',
//               fontSize: '12px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}>
//               <CustomTooltip content="Estimated profit/loss if you sold your holdings now.">
//                 <FaInfoCircle />
//               </CustomTooltip>
//             </div>
//           </div>
//           <div style={{
//             fontSize: '1.3rem',
//             fontWeight: 700,
//             color: '#1f2937',
//             marginBottom: '0.3rem',
//             letterSpacing: '-0.01em',
//             display: 'inline-block',
//             marginRight: '0.5rem'
//           }}>
//             ₹{(latestMarketValue - latestDeployed).toLocaleString('en-IN')}
//           </div>
//           <div style={{
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: '0.1rem',
//             fontWeight: 600,
//             fontSize: '0.7rem',
//             color: '#22c55e',
//             verticalAlign: 'middle'
//           }}>
//             <FaCaretUp />
//             {latestDeployed > 0
//               ? `${(((latestMarketValue - latestDeployed) / latestDeployed) * 100).toFixed(2)}%`
//               : '—'}
//           </div>
//           {(latestMarketValue - latestDeployed) !== 0 && (
//             <div style={{
//               fontSize: '0.7rem',
//               color: '#6b7280',
//               fontWeight: 500,
//               marginTop: '0.3rem'
//             }}>
//               {daysSinceLastBuy} {daysSinceLastBuy === 1 ? 'day' : 'days'} since last Buy
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={{
//         background: 'white',
//         borderRadius: '8px',
//         padding: '0.8rem',
//         border: '1px solid #e5e7eb',
//         boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//         overflow: 'hidden'
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '0.8rem'
//         }}>
//           <h3 style={{
//             fontSize: '1.1rem',
//             fontWeight: 700,
//             color: '#1f2937',
//             margin: 0,
//             letterSpacing: '-0.01em'
//           }}>{selected}</h3>
//           <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '0.8rem',
//             flexWrap: 'wrap'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.3rem',
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               color: '#1f2937'
//             }}>
//               <div style={{
//                 width: '8px',
//                 height: '8px',
//                 borderRadius: '50%',
//                 background: '#3b82f6'
//               }}></div>
//               <span>Deployed Amount</span>
//             </div>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.3rem',
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               color: '#1f2937'
//             }}>
//               <div style={{
//                 width: '8px',
//                 height: '8px',
//                 borderRadius: '50%',
//                 background: '#f59e0b'
//               }}></div>
//               <span>Market Value</span>
//             </div>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.3rem',
//               fontSize: '0.7rem',
//               fontWeight: 500,
//               color: '#1f2937'
//             }}>
//               <div style={{
//                 width: '8px',
//                 height: '8px',
//                 borderRadius: '50%',
//                 background: '#22c55e'
//               }}></div>
//               <span>Profit</span>
//             </div>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.3rem',
//               fontSize: '0.3rem',
//               fontWeight: 500,
//               color: '#1f2937'
//             }}>
//               <div style={{
//                 width: '8px',
//                 height: '8px',
//                 borderRadius: '50%',
//                 background: '#ef4444'
//               }}></div>
//               <span>Loss</span>
//             </div>
//           </div>
//         </div>
//         <div style={{ height: '370px', position: 'relative' }}>
//           <ResponsiveLine
//             data={series}
//             margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
//             xScale={{ type: 'time', format: 'native', precision: 'day' }}
//             yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
//             curve="catmullRom"
//             axisBottom={{
//               format: '%b %Y',
//               tickValues: 'every 2 months',
//               tickPadding: 6,
//               tickRotation: 0,
//               legend: 'Date',
//               legendOffset: 30,
//               legendPosition: 'middle'
//             }}
//             axisLeft={{
//               legend: 'Amount (₹)',
//               legendPosition: 'middle',
//               legendOffset: -40,
//               format: v => `${(v/1000).toFixed(0)}K`,
//               tickPadding: 6
//             }}
//             colors={{ datum: 'color' }}
//             lineWidth={2}
//             pointSize={0}
//             pointBorderWidth={0}
//             enableSlices={false}
//             tooltip={({ point }) => {
//               const date = new Date(point.data.x);
//               const formattedDate = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
//               const roundedValue = Number(point.data.yFormatted).toFixed(2);
//               const label = LABELS[point.seriesId] || point.seriesId;

//               return (
//                 <div style={{
//                   background: 'white',
//                   padding: '0.4rem 0.8rem',
//                   borderRadius: '4px',
//                   boxShadow: '0 6px 8px rgba(0,0,0,0.1)',
//                   border: '1px solid #e5e7eb',
//                   fontSize: '0.7rem',
//                   minWidth: '120px',
//                   maxWidth: '180px',
//                   whiteSpace: 'normal'
//                 }}>
//                   <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1f2937', fontWeight: 600 }}>
//                     {formattedDate}
//                   </strong>
//                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <span style={{ color: point.seriesColor }}>{label}</span>
//                     <span>₹{Number(roundedValue).toLocaleString('en-IN')}</span>
//                   </div>
//                 </div>
//               );
//             }}
//             layers={['grid', 'axes', barsLayer, deployedLineLayer, scatterLayer, 'mesh', 'legends']}
//             motionConfig="gentle"
//             useMesh
//             theme={{
//               axis: {
//                 legend: { text: { fontSize: 12, fontWeight: 500, fill: '#1f2937' } },
//                 ticks: { text: { fontSize: 11, fill: '#6b7280' }, line: { stroke: '#e5e7eb', strokeWidth: 1 } },
//                 domain: { stroke: '#e5e7eb', strokeWidth: 1 }
//               },
//               fontFamily: 'Inter, sans-serif',
//               fontSize: 10,
//               textColor: '#1f2937',
//               grid: { line: { stroke: '#f3f4f6', strokeDasharray: '3 3' } },
//               legends: { text: { fontSize: 9, fill: '#1f2937' } }
//             }}
//           />
//         </div>
//       </div>
//       <style>
//         {`
//           @keyframes bar-appear {
//             from { transform: scaleY(0); opacity: 0; }
//             to { transform: scaleY(1); opacity: 0.85; }
//           }
//           @keyframes point-appear {
//             from { transform: scale(0); opacity: 0; }
//             to { transform: scale(1); opacity: 1; }
//           }
//           @keyframes line-appear {
//             from { stroke-dasharray: 800; stroke-dashoffset: 800; }
//             to { stroke-dashoffset: 0; }
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// }




import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { animated } from '@react-spring/web';
import { useTooltip, Tooltip } from '@nivo/tooltip';
import { FaChartLine, FaInfoCircle, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { HashLoader } from 'react-spinners';

const LABELS = {
  deployed: 'Deployed Amount',
  marketValue: 'Market Value',
  realizedPNL: 'Realized PNL'
};

// Custom Tooltip component for inline hover tooltips
const CustomTooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)', // Reduced spacing
          right: 0,
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          color: 'white',
          padding: '6px 10px', // Reduced padding
          borderRadius: '6px',
          whiteSpace: 'normal',
          width: '160px', // Smaller width
          zIndex: 9999,
          fontSize: '12px', // Smaller font
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          lineHeight: 1.4
        }}>
          {content}
        </div>
      )}
    </div>
  );
};

// Custom layer for rendering bars (market value) with native tooltips
const barsLayer = ({ series, xScale, yScale }) => {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();
  const marketValueSeries = series.find(s => s.id === 'marketValue');
  if (!marketValueSeries) return null;
  const barWidthMs = 20 * 24 * 60 * 60 * 1000; // 20 days

  return (
    <g>
      {marketValueSeries.data.map((point, index) => {
        const xDate = point.data.x;
        if (!(xDate instanceof Date) || isNaN(xDate) || typeof point.data.y !== 'number' || isNaN(point.data.y)) {
          return null;
        }

        const startDate = new Date(xDate.getTime() - barWidthMs / 2);
        const endDate = new Date(xDate.getTime() + barWidthMs / 2);
        const barStart = xScale(startDate);
        const barEnd = xScale(endDate);
        const barWidth = Math.max(barEnd - barStart, 0);

        if (isNaN(barStart) || isNaN(barEnd) || isNaN(barWidth)) return null;

        const yPoint = yScale(point.data.y);
        const yZero = yScale(0);
        const handleMouse = e => {
          showTooltipFromEvent(
            <Tooltip>
              <div style={{
                background: 'white',
                padding: '0.5rem 0.8rem', // Reduced padding
                borderRadius: '6px',
                boxShadow: '0 6px 10px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                fontSize: '0.8rem', // Smaller font
                minWidth: '140px', // Smaller width
                maxWidth: '200px',
                whiteSpace: 'normal'
              }}>
                <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1f2937', fontWeight: 600 }}>
                  {xDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </strong>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#f59e0b' }}>Market Value:</span>
                  <span>₹{point.data.y.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Tooltip>,
            e
          );
        };

        return (
          <animated.rect
            key={index}
            x={barStart}
            y={Math.min(yPoint, yZero)}
            width={barWidth}
            height={Math.abs(yPoint - yZero)}
            fill="url(#barGradient)"
            opacity={0.85}
            style={{
              borderRadius: '3px',
              transformOrigin: 'center',
              transform: 'scaleY(0)',
              animation: 'bar-appear 0.5s ease-out forwards',
              animationDelay: `${index * 40}ms`,
              pointerEvents: 'all'
            }}
            onMouseEnter={handleMouse}
            onMouseMove={handleMouse}
            onMouseLeave={hideTooltip}
          />
        );
      })}
    </g>
  );
};

// Custom layer for rendering scatter points (realized PNL) with native tooltips
const scatterLayer = ({ series, xScale, yScale }) => {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();
  const pnlSeries = series.find(s => s.id === 'realizedPNL');
  if (!pnlSeries) return null;

  return (
    <g>
      {pnlSeries.data.map((point, index) => {
        const xDate = point.data.x;
        const yVal = point.data.y;
        if (!(xDate instanceof Date) || isNaN(xDate) || typeof yVal !== 'number' || isNaN(yVal)) return null;
        if (yVal === 0) return null;

        const color = yVal > 0 ? '#22c55e' : '#ef4444';
        const handleMouse = e => {
          showTooltipFromEvent(
            <Tooltip>
              <div style={{
                background: 'white',
                padding: '0.5rem 0.8rem', // Reduced padding
                borderRadius: '6px',
                boxShadow: '0 6px 10px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                fontSize: '0.8rem', // Smaller font
                minWidth: '140px',
                maxWidth: '200px',
                whiteSpace: 'normal'
              }}>
                <strong style={{ display: 'block', marginBottom: '0.3rem', color: '#1f2937', fontWeight: 600 }}>
                  {xDate.toLocaleDateString('en-IN')}
                </strong>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color }}>{yVal > 0 ? 'Profit' : 'Loss'}:</span>
                  <span>₹{Math.abs(yVal).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Tooltip>,
            e
          );
        };

        return (
          <animated.circle
            key={index}
            cx={xScale(xDate)}
            cy={yScale(yVal)}
            r={4} // Smaller radius
            fill={color}
            stroke="#ffffff"
            strokeWidth={1}
            style={{
              transformOrigin: 'center',
              transform: 'scale(0)',
              animation: 'point-appear 0.5s ease-out forwards',
              animationDelay: `${index * 40}ms`,
              pointerEvents: 'all',
              filter: 'url(#pointShadow)'
            }}
            onMouseEnter={handleMouse}
            onMouseMove={handleMouse}
            onMouseLeave={hideTooltip}
          />
        );
      })}
    </g>
  );
};

// Custom layer for rendering line (only deployed series) with animation
const deployedLineLayer = ({ series, lineGenerator, xScale, yScale }) => {
  const deployedSeries = series.find(s => s.id === 'deployed');
  if (!deployedSeries) return null;

  const validPoints = deployedSeries.data
    .filter(pt => pt.data.x instanceof Date && !isNaN(pt.data.x) && typeof pt.data.y === 'number' && !isNaN(pt.data.y));

  return (
    <animated.g style={{ transformOrigin: 'center', animation: 'line-appear 0.7s ease-out forwards' }}>
      <path
        d={lineGenerator(validPoints.map(p => ({
          x: xScale(p.data.x),
          y: yScale(p.data.y)
        })))}
        stroke={deployedSeries.color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'url(#lineShadow)' }}
      />
      {validPoints.map((p, i) => (
        <circle
          key={i}
          cx={xScale(p.data.x)}
          cy={yScale(p.data.y)}
          r={2}
          fill={deployedSeries.color}
          style={{ pointerEvents: 'none' }}
        />
      ))}
    </animated.g>
  );
};

export default function StockDeployedAmtOverTimeNivo() {
  const [dataByScrip, setDataByScrip] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const uploadId = localStorage.getItem("uploadId");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/file/stock_deployed_amt_over_time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ uploadId })
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(json => {
        const processed = Object.fromEntries(Object.entries(json).map(([key, val]) => [key,
          {
            deployed: val.deployed.map(pt => ({ x: new Date(pt.x), y: +pt.y || 0 })),
            marketValue: val.marketValue.map(pt => ({ x: new Date(pt.x), y: +pt.y || 0 })),
            realizedPNL: val.realizedPNL.map(pt => ({ x: new Date(pt.x), y: +pt.y || 0 })),
            lastBuyDate: val.lastBuyDate ? new Date(val.lastBuyDate) : null
          }
        ]));
        setDataByScrip(processed);
        setSelected(Object.keys(processed)[0] || null);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <HashLoader color="#0369a1" size={50} /> {/* Smaller spinner */}
      <p className="mt-4 text-sky-700 dark:text-white font-semibold text-base animate-pulse">
        CMDA...
      </p>
    </div>
  );

  if (!dataByScrip || !selected) return (
    <div style={{
      width: '100%', // Full width
      maxWidth: '1500px',
      margin: '1rem auto',
      padding: '1rem', // Reduced padding
      background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
      borderRadius: '12px',
      boxShadow: '0 6px 10px rgba(0,0,0,0.05)',
      fontFamily: "'Inter', sans-serif",
      color: '#1f2937',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem', // Reduced padding
        textAlign: 'center'
      }}>
        <FaInfoCircle style={{ fontSize: '2rem', color: '#d1d5db', marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1f2937' }}>Data Unavailable</h3>
        <p style={{ color: '#6b7280', maxWidth: '400px', fontSize: '0.9rem' }}>
          Could not load stock deployment data. Please try again later.
        </p>
      </div>
    </div>
  );

  const { deployed, marketValue, realizedPNL, lastBuyDate } = dataByScrip[selected];

  // Calculate metrics for the performance cards
  const latestDeployed = deployed[deployed.length - 1]?.y || 0;
  const latestMarketValue = marketValue[marketValue.length - 1]?.y || 0;
  const totalRealizedPNL = realizedPNL.reduce((sum, pt) => sum + (typeof pt.y === 'number' ? pt.y : 0), 0);

  // Calculate days since last buy
  const currentDate = new Date('2025-07-20');
  const daysSinceLastBuy = lastBuyDate
    ? Math.floor((currentDate - lastBuyDate) / (1000 * 60 * 60 * 24))
    : '—';

  const series = [
    { id: 'deployed', data: deployed, color: '#3b82f6' },
    { id: 'marketValue', data: marketValue, color: '#f59e0b' },
    { id: 'realizedPNL', data: realizedPNL, color: '#22c55e' }
  ];

  return (
    <div style={{
      width: '100%', // Full width
      maxWidth: '1500px',
      margin: '0.8rem auto', // Reduced margin
      padding: '0.8rem', // Reduced padding
      background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
      borderRadius: '10px',
      boxShadow: '0 6px 10px rgba(0,0,0,0.05)',
      fontFamily: "'Inter', sans-serif",
      color: '#1f2937',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.1)" floodOpacity="0.15" />
          </filter>
          <filter id="pointShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0, 0, 0, 0.2)" />
          </filter>
        </defs>
      </svg>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.8rem',
        paddingBottom: '0.6rem',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap' // Allow wrapping for small screens
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px', // Smaller icon
            height: '24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '0.9rem',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
          }}>
            <FaChartLine />
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.1rem', // Smaller font
              fontWeight: 700,
              color: '#1f2937',
              letterSpacing: '-0.01em'
            }}>Stock Deployment Overview</h2>
            <p style={{
              margin: '0.1rem 0 0',
              fontSize: '0.6rem', // Smaller font
              color: '#6b7280',
              fontWeight: 400
            }}>Deployed, Market Value & Realized PNL Over Time</p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <label htmlFor="stock-select" style={{
              fontWeight: 500,
              color: '#4b5563',
              fontSize: '0.8rem' // Smaller font
            }}>Select Stock:</label>
            <select
              id="stock-select"
              value={selected}
              onChange={e => setSelected(e.target.value)}
              style={{
                padding: '0.3rem 1.5rem 0.3rem 0.6rem', // Reduced padding
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: 'white',
                color: '#1f2937',
                fontSize: '0.7rem', // Smaller font
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                minWidth: '100px', // Smaller width
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%233b82f6\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '7px',
                appearance: 'none'
              }}
            >
              {Object.keys(dataByScrip).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', // Smaller min width
        gap: '0.6rem', // Reduced gap
        marginBottom: '0.8rem'
      }}>
        {/* Deployed Amount */}
        <div style={{
          background: 'white',
          borderRadius: '6px',
          padding: '0.6rem', // Reduced padding
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: '#3b82f6'
          }}></div>
          <div style={{
            fontSize: '0.9rem', // Smaller font
            color: '#6b7280',
            marginBottom: '0.2rem',
            fontWeight: 500
          }}>
            Deployed Amount
            <div style={{
              position: 'absolute',
              bottom: '3px',
              right: '3px',
              fontSize: '10px', // Smaller font
              color: '#6b7280',
              cursor: 'pointer'
            }}>
              <CustomTooltip content="Total money you've invested so far in this stock.">
                <FaInfoCircle />
              </CustomTooltip>
            </div>
          </div>
          <div style={{
            fontSize: '1.1rem', // Smaller font
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.2rem',
            letterSpacing: '-0.01em'
          }}>₹{latestDeployed.toLocaleString('en-IN')}</div>
        </div>

        {/* Market Value */}
        <div style={{
          background: 'white',
          borderRadius: '6px',
          padding: '0.9rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: '#3b82f6'
          }}></div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            marginBottom: '0.2rem',
            fontWeight: 500
          }}>
            Current Market Value
            <div style={{
              position: 'absolute',
              bottom: '3px',
              right: '3px',
              fontSize: '10px',
              color: '#6b7280',
              cursor: 'pointer'
            }}>
              <CustomTooltip content="Present market worth of your holdings in this stock.">
                <FaInfoCircle />
              </CustomTooltip>
            </div>
          </div>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.2rem',
            letterSpacing: '-0.01em'
          }}>₹{latestMarketValue.toLocaleString('en-IN')}</div>
        </div>

        {/* Realized PNL */}
        <div style={{
          background: 'white',
          borderRadius: '6px',
          padding: '0.6rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: '#3b82f6'
          }}></div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            marginBottom: '0.2rem',
            fontWeight: 500
          }}>
            Realized Profit / Loss
            <div style={{
              position: 'absolute',
              bottom: '3px',
              right: '3px',
              fontSize: '10px',
              color: '#6b7280',
              cursor: 'pointer'
            }}>
              <CustomTooltip content="Profit or loss you've actually made by selling the stock.">
                <FaInfoCircle />
              </CustomTooltip>
            </div>
          </div>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: totalRealizedPNL >= 0 ? '#22c55e' : '#ef4444',
            marginBottom: '0.2rem',
            letterSpacing: '-0.01em'
          }}>
            ₹{Number(Math.abs(totalRealizedPNL).toFixed(2)).toLocaleString('en-IN')}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.1rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: totalRealizedPNL >= 0 ? '#22c55e' : '#ef4444'
          }}>
            {totalRealizedPNL >= 0 ? <FaCaretUp /> : <FaCaretDown />}
            {totalRealizedPNL >= 0 ? 'Total Profit' : 'Total Loss'}
          </div>
        </div>

        {/* Unrealized Gain */}
        <div style={{
          background: 'white',
          borderRadius: '6px',
          padding: '0.6rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: '#3b82f6'
          }}></div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            marginBottom: '0.2rem',
            fontWeight: 500
          }}>
            Unrealized Gain
            <div style={{
              position: 'absolute',
              bottom: '3px',
              right: '3px',
              fontSize: '10px',
              color: '#6b7280',
              cursor: 'pointer'
            }}>
              <CustomTooltip content="Estimated profit/loss if you sold your holdings now.">
                <FaInfoCircle />
              </CustomTooltip>
            </div>
          </div>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.2rem',
            letterSpacing: '-0.01em',
            display: 'inline-block',
            marginRight: '0.4rem'
          }}>
            ₹{(latestMarketValue - latestDeployed).toLocaleString('en-IN')}
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.1rem',
            fontWeight: 600,
            fontSize: '0.6rem',
            color: '#22c55e',
            verticalAlign: 'middle'
          }}>
            <FaCaretUp />
            {latestDeployed > 0
              ? `${(((latestMarketValue - latestDeployed) / latestDeployed) * 100).toFixed(2)}%`
              : '—'}
          </div>
          {(latestMarketValue - latestDeployed) !== 0 && (
            <div style={{
              fontSize: '0.6rem',
              color: '#6b7280',
              fontWeight: 500,
              marginTop: '0.2rem'
            }}>
              {daysSinceLastBuy} {daysSinceLastBuy === 1 ? 'day' : 'days'} since last Buy
            </div>
          )}
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '0.6rem', // Reduced padding
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.6rem',
          flexWrap: 'wrap'
        }}>
          <h3 style={{
            fontSize: '1rem', // Smaller font
            fontWeight: 700,
            color: '#1f2937',
            margin: 0,
            letterSpacing: '-0.01em'
          }}>{selected}</h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.6rem', // Smaller font
              fontWeight: 500,
              color: '#1f2937'
            }}>
              <div style={{
                width: '7px', // Smaller dot
                height: '7px',
                borderRadius: '50%',
                background: '#3b82f6'
              }}></div>
              <span>Deployed Amount</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.6rem',
              fontWeight: 500,
              color: '#1f2937'
            }}>
              <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#f59e0b'
              }}></div>
              <span>Market Value</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.6rem',
              fontWeight: 500,
              color: '#1f2937'
            }}>
              <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#22c55e'
              }}></div>
              <span>Profit</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.6rem',
              fontWeight: 500,
              color: '#1f2937'
            }}>
              <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#ef4444'
              }}></div>
              <span>Loss</span>
            </div>
          </div>
        </div>
        <div style={{
          height: '40vh', // Dynamic height
          minHeight: '350px', // Minimum height
          maxHeight: '450px', // Maximum height
          position: 'relative'
        }}>
          <ResponsiveLine
            data={series}
            margin={{ top: 15, right: 15, bottom: 40, left: 40 }} // Reduced margins
            xScale={{ type: 'time', format: 'native', precision: 'day' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
            curve="catmullRom"
            axisBottom={{
              format: '%b %Y',
              tickValues: 'every 2 months',
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Date',
              legendOffset: 25, // Reduced offset
              legendPosition: 'middle'
            }}
            axisLeft={{
              legend: 'Amount (₹)',
              legendPosition: 'middle',
              legendOffset: -35, // Reduced offset
              format: v => `${(v / 1000).toFixed(0)}K`,
              tickPadding: 5,
              tickSize: 4 // Smaller ticks
            }}
            colors={{ datum: 'color' }}
            lineWidth={2}
            pointSize={0}
            pointBorderWidth={0}
            enableSlices={false}
            tooltip={({ point }) => {
              const date = new Date(point.data.x);
              const formattedDate = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
              const roundedValue = Number(point.data.yFormatted).toFixed(2);
              const label = LABELS[point.seriesId] || point.seriesId;

              return (
                <div style={{
                  background: 'white',
                  padding: '0.3rem 0.6rem', // Reduced padding
                  borderRadius: '4px',
                  boxShadow: '0 6px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.6rem', // Smaller font
                  minWidth: '100px',
                  maxWidth: '160px',
                  whiteSpace: 'normal'
                }}>
                  <strong style={{ display: 'block', marginBottom: '0.2rem', color: '#1f2937', fontWeight: 600 }}>
                    {formattedDate}
                  </strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: point.seriesColor }}>{label}</span>
                    <span>₹{Number(roundedValue).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            }}
            layers={['grid', 'axes', barsLayer, deployedLineLayer, scatterLayer, 'mesh', 'legends']}
            motionConfig="gentle"
            useMesh
            theme={{
              axis: {
                legend: { text: { fontSize: 13, fontWeight: 500, fill: '#1f2937' } },
                ticks: { text: { fontSize: 9, fill: '#6b7280' }, line: { stroke: '#e5e7eb', strokeWidth: 1 } },
                domain: { line: { stroke: '#e5e7eb', strokeWidth: 1 } }
              },
              fontFamily: 'Inter, sans-serif',
              fontSize: 9, // Smaller font
              textColor: '#1f2937',
              grid: { line: { stroke: '#f3f4f6', strokeDasharray: '3 3' } },
              legends: { text: { fontSize: 8, fill: '#1f2937' } }
            }}
          />
        </div>
      </div>
      <style>
        {`
          @keyframes bar-appear {
            from { transform: scaleY(0); opacity: 0; }
            to { transform: scaleY(1); opacity: 0.85; }
          }
          @keyframes point-appear {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes line-appear {
            from { stroke-dasharray: 800; stroke-dashoffset: 800; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            select#stock-select {
              width: 100% !important;
              min-width: unset !important;
              font-size: 0.65rem !important;
              padding: 0.25rem 1rem 0.25rem 0.5rem !important;
            }
            .CustomTooltip > div {
              width: 120px !important;
              font-size: 11px !important;
              padding: 5px 8px !important;
            }
          }
          @media (max-width: 480px) {
            select#stock-select {
              font-size: 0.6rem !important;
              padding: 0.2rem 0.8rem 0.2rem 0.4rem !important;
              background-size: 6px !important;
            }
            .CustomTooltip > div {
              width: 100px !important;
              font-size: 10px !important;
              padding: 4px 6px !important;
            }
          }
        `}
      </style>
    </div>
  );
}
