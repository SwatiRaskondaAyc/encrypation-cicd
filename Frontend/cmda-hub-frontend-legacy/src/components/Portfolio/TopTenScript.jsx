


// //Session with GraphDataContext
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Plot from "react-plotly.js";
// import { useGraphData } from "./GraphDataContext";
// import { HashLoader } from "react-spinners";

// const TopTenScript = () => {
//   const [scatterData, setScatterData] = useState(null);
//   const [layout, setLayout] = useState(null);
//   const [config, setConfig] = useState(null);
//   const [error, setError] = useState("");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const { getGraphData, setGraphData } = useGraphData();

//   useEffect(() => {
//     const fetchGraphData = async () => {
//       const uploadId = localStorage.getItem("uploadId");
//       const cacheKey = `top_ten_script_${uploadId}`;

//       if (!uploadId) {
//         setError(" Please upload a file first.");
//         return;
//       }

//       // Check cache first
//       const cachedData = getGraphData(cacheKey);
//       if (cachedData) {
//         setScatterData(cachedData.scatter_data);
//         setLayout(cachedData.layout);
//         setConfig(cachedData.config);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE}/file/top_ten_script`,
//           new URLSearchParams({ uploadId })
//         );

//         const { scatter_data, layout, config: plotConfig } = response.data;

//         if (!scatter_data || !layout) {
//           setError("Graph generation failed. Please check the data or try again.");
//         } else {
//           setScatterData(scatter_data);
//           setLayout(layout);
//           setConfig(plotConfig);
//           // Cache the data
//           setGraphData(cacheKey, { scatter_data, layout, config: plotConfig });
//         }
//       } catch (error) {
//         console.error("TopTenScript Error:", error.response || error);
//         setError("Failed to load graph data.");
//       }
//     };

//     fetchGraphData();
//   }, [getGraphData, setGraphData]);

//   return (
//        <div >
//       {error && <p className="text-red-500">{error}</p>}
//       {!scatterData || !layout ? (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>
//       ) : (
//        <Plot
//               key={JSON.stringify(scatterData)}
//               data={scatterData}
//               layout={{
//                 ...layout,
//                 autosize: true,
//                 responsive: true,
//                 title: layout?.title || "Scatter Plot",
//                 font: { size: 14 },
//                 margin: { t: 50, l: 50, r: 30, b: 50 },
//               }}
//               useResizeHandler={true}
//               style={{ width: "100%", height: "100%" }}
//               config={config || { responsive: true }}
//             />

//       )}
//     </div>
//   );
// };

// export default TopTenScript;


// import React, { useEffect, useState } from 'react';
// import { ResponsiveBar } from '@nivo/bar';
// import { FaCrown, FaChartLine, FaInfoCircle, FaExchangeAlt, FaMoneyBillWave } from 'react-icons/fa';

// export default function Top10Scrips() {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeMetric, setActiveMetric] = useState('realized');
//   const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE}/file/top_ten_script`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: new URLSearchParams({ uploadId })
//         })
//       .then(res => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//         return res.json();
//       })
//       .then(json => {
//         const { scrips, brokerage, realized, unrealized } = json;
//         if (!Array.isArray(scrips) || scrips.length === 0) {
//           setData([]);
//           return;
//         }
//         const nivoData = scrips.map((scrip, i) => ({
//           scrip,
//           brokerage: Array.isArray(brokerage) ? Number(brokerage[i]) : 0,
//           realized: Array.isArray(realized) ? Number(realized[i]) : 0,
//           unrealized: Array.isArray(unrealized) ? Number(unrealized[i]) : 0,
//         }));
//         setData(nivoData);
//       })
//       .catch(err => {
//         console.error('Failed to load Top‑10 data:', err);
//         setData([]);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, []);

//   if (isLoading) {
//     return (
//       <div style={{
//         width: '98vw',
//         maxWidth: '1400px',
//         padding: '20px',
//         boxSizing: 'border-box',
//         fontFamily: "'Inter', 'Segoe UI', sans-serif",
//         borderRadius: '16px',
//         margin: '24px auto'
//       }}>
//         <div style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(255, 255, 255, 0.9)',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 100,
//           borderRadius: '16px'
//         }}>
//           <div style={{
//             width: '50px',
//             height: '50px',
//             border: '4px solid rgba(67, 97, 238, 0.2)',
//             borderTop: '4px solid #4361ee',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             marginBottom: '1.5rem'
//           }}></div>
//           <div style={{
//             fontSize: '1.1rem',
//             fontWeight: 500,
//             color: '#495057'
//           }}>Analyzing top performers...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!isLoading && data.length === 0) {
//     return (
//       <div style={{
//         width: '98vw',
//         maxWidth: '1400px',
//         padding: '20px',
//         boxSizing: 'border-box',
//         fontFamily: "'Inter', 'Segoe UI', sans-serif",
//         borderRadius: '16px',
//         margin: '24px auto'
//       }}>
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: '3rem',
//           textAlign: 'center'
//         }}>
//           <FaInfoCircle style={{ fontSize: '3rem', color: '#ced4da', marginBottom: '1.5rem' }} />
//           <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#343a40' }}>No data available</h3>
//           <p style={{ color: '#6c757d', maxWidth: '500px' }}>Could not load top scrips data. Please try again later.</p>
//         </div>
//       </div>
//     );
//   }

//   const sortedData = [...data].sort((a, b) => b[activeMetric] - a[activeMetric]);

//   const formatValue = (value) => {
//     if (value == null || isNaN(value)) {
//       return '—';
//     }
//     if (value >= 10000000) {
//       return `₹${(value / 10000000).toFixed(2)} Cr`;
//     } else if (value >= 100000) {
//       return `₹${(value / 100000).toFixed(2)} L`;
//     }
//     return `₹${value.toLocaleString('en-IN')}`;
//   };

//   return (
//     <div style={{
//       width: '98vw',
//       maxWidth: '1400px',
//       padding: '20px',
//       boxSizing: 'border-box',
//       fontFamily: "'Inter', 'Segoe UI', sans-serif",
//       borderRadius: '16px',
//       margin: '24px auto'
//     }}>
//       <div style={{
//         position: 'relative',
//         background: 'rgba(255, 255, 255, 0.85)',
//         borderRadius: '16px',
//         boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//         overflow: 'hidden',
//         border: '1px solid rgba(241, 245, 249, 0.6)',
//         backdropFilter: 'blur(10px)',
//         transition: 'transform 0.3s ease, box-shadow 0.3s ease'
//       }}>
//         <div style={{
//           position: 'relative',
//           padding: '24px 32px 16px',
//           background: 'linear-gradient(120deg, rgba(249, 250, 251, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%)',
//           borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'flex-start',
//           flexWrap: 'wrap'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '1rem',
//             marginBottom: '1rem'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: '48px',
//               height: '48px',
//               background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
//               borderRadius: '12px',
//               color: 'white',
//               fontSize: '1.5rem',
//               boxShadow: '0 4px 6px rgba(255, 215, 0, 0.3)'
//             }}>
//               <FaCrown />
//             </div>
//             <div>
//               <h2 style={{
//                 fontSize: '1.6rem',
//                 fontWeight: 700,
//                 color: '#212529',
//                 marginBottom: '6px',
//                 letterSpacing: '-0.5px'
//               }}>
//                 {activeMetric === 'realized'
//                   ? 'Top Scrips by Realized PNL'
//                   : activeMetric === 'unrealized'
//                   ? 'Top Scrips by Unrealized PNL'
//                   : 'Top Scrips by Brokerage'}
//               </h2>
//               <p style={{
//                 fontSize: '1rem',
//                 color: '#6c757d',
//                 fontWeight: 500,
//                 margin: 0
//               }}>
//                 Best performing stocks by {
//                   activeMetric === 'realized' ? 'Realized PNL'
//                   : activeMetric === 'unrealized' ? 'Unrealized PNL'
//                   : 'Brokerage'
//                 }
//               </p>
//             </div>
//           </div>
//           <div style={{
//             display: 'flex',
//             gap: '1rem',
//             marginTop: '0.5rem',
//             flexWrap: 'wrap'
//           }}>
//             <button
//               style={{
//                 padding: '0.75rem 1.5rem',
//                 background: 'white',
//                 border: '1px solid #e2e8f0',
//                 borderRadius: '8px',
//                 color: '#6c757d',
//                 fontWeight: 600,
//                 fontSize: '0.95rem',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s ease',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.75rem',
//                 ...(activeMetric === 'realized' && {
//                   background: '#4361ee',
//                   color: 'white',
//                   borderColor: '#4361ee',
//                   boxShadow: '0 2px 4px rgba(67, 97, 238, 0.2)'
//                 })
//               }}
//               onClick={() => setActiveMetric('realized')}
//             >
//               <FaChartLine style={{ fontSize: '1rem' }} /> Realized PNL
//             </button>
//             <button
//               style={{
//                 padding: '0.75rem 1.5rem',
//                 background: 'white',
//                 border: '1px solid #e2e8f0',
//                 borderRadius: '8px',
//                 color: '#6c757d',
//                 fontWeight: 600,
//                 fontSize: '0.95rem',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s ease',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.75rem',
//                 ...(activeMetric === 'unrealized' && {
//                   background: '#4361ee',
//                   color: 'white',
//                   borderColor: '#4361ee',
//                   boxShadow: '0 2px 4px rgba(67, 97, 238, 0.2)'
//                 })
//               }}
//               onClick={() => setActiveMetric('unrealized')}
//             >
//               <FaExchangeAlt style={{ fontSize: '1rem' }} /> Unrealized PNL
//             </button>
//             <button
//               style={{
//                 padding: '0.75rem 1.5rem',
//                 background: 'white',
//                 border: '1px solid #e2e8f0',
//                 borderRadius: '8px',
//                 color: '#6c757d',
//                 fontWeight: 600,
//                 fontSize: '0.95rem',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s ease',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.75rem',
//                 ...(activeMetric === 'brokerage' && {
//                   background: '#4361ee',
//                   color: 'white',
//                   borderColor: '#4361ee',
//                   boxShadow: '0 2px 4px rgba(67, 97, 238, 0.2)'
//                 })
//               }}
//               onClick={() => setActiveMetric('brokerage')}
//             >
//               <FaMoneyBillWave style={{ fontSize: '1rem' }} /> Brokerage
//             </button>
//           </div>
//         </div>
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(4, 1fr)',
//           gap: '1.5rem',
//           margin: '1.5rem 32px'
//         }}>
//           <div style={{
//             background: 'white',
//             borderRadius: '8px',
//             padding: '1.25rem',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//             border: '1px solid #edf2f7',
//             transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '1rem',
//             overflow: 'visible',
//             position: 'relative'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: '48px',
//               height: '48px',
//               borderRadius: '12px',
//               background: '#f0f4fe',
//               color: '#FFD700',
//               fontSize: '1.25rem'
//             }}>
//               <FaCrown />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div style={{
//                 fontSize: '0.9rem',
//                 color: '#6c757d',
//                 marginBottom: '0.25rem',
//                 fontWeight: 500
//               }}>Top Performer</div>
//               <div style={{
//                 fontSize: '1.2rem',
//                 fontWeight: 700,
//                 color: '#212529'
//               }}>{sortedData[0].scrip}</div>
//             </div>
//             <div style={{
//               position: 'absolute',
//               bottom: '6px',
//               right: '8px',
//               fontSize: '16px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}
//               data-tooltip="This shows the best performing stock among top 10."
//             >
//               <FaInfoCircle />
//             </div>
//           </div>
//           <div style={{
//             background: 'white',
//             borderRadius: '8px',
//             padding: '1.25rem',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//             border: '1px solid #edf2f7',
//             transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '1rem',
//             overflow: 'visible',
//             position: 'relative'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: '48px',
//               height: '48px',
//               borderRadius: '12px',
//               background: '#f0f4fe',
//               color: '#4361ee',
//               fontSize: '1.25rem'
//             }}>
//               <FaChartLine />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div style={{
//                 fontSize: '0.9rem',
//                 color: '#6c757d',
//                 marginBottom: '0.25rem',
//                 fontWeight: 500
//               }}>
//                 {activeMetric === 'realized'
//                   ? 'Highest Realized PNL'
//                   : activeMetric === 'unrealized'
//                   ? 'Highest Unrealized PNL'
//                   : 'Highest Brokerage'}
//               </div>
//               <div style={{
//                 fontSize: '1.2rem',
//                 fontWeight: 700,
//                 color: '#212529'
//               }}>
//                 {formatValue(sortedData[0][activeMetric])}
//               </div>
//             </div>
//             <div style={{
//               position: 'absolute',
//               bottom: '6px',
//               right: '8px',
//               fontSize: '16px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}
//               data-tooltip={
//                 activeMetric === 'realized'
//                   ? 'This shows the stock with the highest realized PNL among top 10.'
//                   : activeMetric === 'unrealized'
//                   ? 'This shows the stock with the highest unrealized PNL among top 10.'
//                   : 'This shows the stock with the highest brokerage contribution among top 10.'
//               }
//             >
//               <FaInfoCircle />
//             </div>
//           </div>
//           <div style={{
//             background: 'white',
//             borderRadius: '8px',
//             padding: '1.25rem',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//             border: '1px solid #edf2f7',
//             transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '1rem',
//             overflow: 'visible',
//             position: 'relative'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: '48px',
//               height: '48px',
//               borderRadius: '12px',
//               background: '#f0f4fe',
//               color: '#10b981',
//               fontSize: '1.25rem'
//             }}>
//               <FaExchangeAlt />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div style={{
//                 fontSize: '0.9rem',
//                 color: '#6c757d',
//                 marginBottom: '0.25rem',
//                 fontWeight: 500
//               }}>
//                 {activeMetric === 'realized'
//                   ? 'Avg Realized PNL'
//                   : activeMetric === 'unrealized'
//                   ? 'Avg Unrealized PNL'
//                   : 'Avg Brokerage'}
//               </div>
//               <div style={{
//                 fontSize: '1.2rem',
//                 fontWeight: 700,
//                 color: '#212529'
//               }}>
//                 {formatValue(
//                   sortedData.reduce((sum, item) => sum + item[activeMetric], 0) / sortedData.length
//                 )}
//               </div>
//             </div>
//             <div style={{
//               position: 'absolute',
//               bottom: '6px',
//               right: '8px',
//               fontSize: '16px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}
//               data-tooltip={
//                 activeMetric === 'realized'
//                   ? 'This shows the average realized PNL across the top 10 stocks.'
//                   : activeMetric === 'unrealized'
//                   ? 'This shows the average unrealized PNL across the top 10 stocks.'
//                   : 'This shows the average brokerage generated by the top 10 stocks.'
//               }
//             >
//               <FaInfoCircle />
//             </div>
//           </div>
//           <div style={{
//             background: 'white',
//             borderRadius: '8px',
//             padding: '1.25rem',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//             border: '1px solid #edf2f7',
//             transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '1rem',
//             overflow: 'visible',
//             position: 'relative'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: '48px',
//               height: '48px',
//               borderRadius: '12px',
//               background: '#f0f4fe',
//               color: '#8b5cf6',
//               fontSize: '1.25rem'
//             }}>
//               <FaInfoCircle />
//             </div>
//             <div style={{ flex: 1 }}>
//               <div style={{
//                 fontSize: '0.9rem',
//                 color: '#6c757d',
//                 marginBottom: '0.25rem',
//                 fontWeight: 500
//               }}>Performance Gap</div>
//               <div style={{
//                 fontSize: '1.2rem',
//                 fontWeight: 700,
//                 color: '#212529'
//               }}>
//                 {sortedData[sortedData.length - 1][activeMetric] === 0
//                   ? '-'
//                   : `${(
//                       (sortedData[0][activeMetric] / sortedData[sortedData.length - 1][activeMetric] - 1) * 100
//                     ).toFixed(1)}%`}
//               </div>
//             </div>
//             <div style={{
//               position: 'absolute',
//               bottom: '6px',
//               right: '8px',
//               fontSize: '16px',
//               color: '#6b7280',
//               cursor: 'pointer'
//             }}
//               data-tooltip={
//                 activeMetric === 'realized'
//                   ? 'This shows how much more the best stock earned in realized PNL compared to the average of top 10.'
//                   : activeMetric === 'unrealized'
//                   ? 'This shows how much higher the best stock’s unrealized PNL is compared to the top 10 average.'
//                   : 'This shows how much more brokerage the top stock generated compared to the top 10 average.'
//               }
//             >
//               <FaInfoCircle />
//             </div>
//           </div>
//         </div>
//         <div style={{
//           padding: '20px 32px',
//           position: 'relative',
//           height: '500px'
//         }}>
//           <ResponsiveBar
//             data={sortedData}
//             keys={[activeMetric]}
//             layout="vertical"
//             defs={[
//               {
//                 id: 'goldGradient',
//                 type: 'linearGradient',
//                 colors: [
//                   { offset: 0, color: '#FFD700' },
//                   { offset: 100, color: '#FFA500' },
//                 ]
//               },
//               {
//                 id: 'blueGradient',
//                 type: 'linearGradient',
//                 colors: [
//                   { offset: 0, color: '#4361ee' },
//                   { offset: 100, color: '#3a56e4' },
//                 ]
//               },
//               {
//                 id: 'greenGradient',
//                 type: 'linearGradient',
//                 colors: [
//                   { offset: 0, color: '#10B981' },
//                   { offset: 100, color: '#059669' },
//                 ]
//               },
//               {
//                 id: 'redGradient',
//                 type: 'linearGradient',
//                 colors: [
//                   { offset: 0, color: '#b91c1c' },
//                   { offset: 50, color: '#dc2626' },
//                 ]
//               }
//             ]}
//             indexBy="scrip"
//             margin={{ top: 30, right: 40, bottom: 100, left: 100 }}
//             padding={0.4}
//             valueScale={{ type: 'linear' }}
//             indexScale={{ type: 'band', round: true }}
//             colors={({ index }) =>
//               index === 0
//                 ? 'url(#goldGradient)'
//                 : activeMetric === 'realized'
//                   ? 'url(#greenGradient)'
//                   : activeMetric === 'unrealized'
//                     ? 'url(#blueGradient)'
//                     : 'url(#redGradient)'
//             }
//             borderWidth={0}
//             borderRadius={4}
//             axisBottom={{
//               tickSize: 0,
//               tickPadding: 12,
//               tickRotation: 0,
//               legend: 'Scrips',
//               legendPosition: 'middle',
//               legendOffset: 80,
//               renderTick: tick => {
//                 const words = tick.value.split(' ');
//                 return (
//                   <g transform={`translate(${tick.x},${tick.y + 10})`}>
//                     {words.map((word, i) => (
//                       <text
//                         key={i}
//                         x={0}
//                         y={i * 12}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                         style={{
//                           fontSize: 11,
//                           fill: '#555',
//                           fontFamily: 'sans-serif'
//                         }}
//                       >
//                         {word}
//                       </text>
//                     ))}
//                   </g>
//                 );
//               }
//             }}
//             axisLeft={{
//               tickSize: 5,
//               tickPadding: 10,
//               tickRotation: 0,
//               legend: activeMetric === 'realized' ? 'Realized PNL (₹)'
//                     : activeMetric === 'unrealized' ? 'Unrealized PNL (₹)'
//                     : 'Brokerage (₹)',
//               legendPosition: 'middle',
//               legendOffset: -85,
//               format: value => formatValue(value)
//             }}
//             enableGridY={true}
//             tooltip={({ id, value, indexValue }) => (
//               <div style={{
//                 background: 'white',
//                 padding: '16px',
//                 borderRadius: '8px',
//                 boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//                 border: '1px solid rgba(241, 245, 249, 0.8)',
//                 minWidth: '220px'
//               }}>
//                 <div style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: '8px',
//                   fontSize: '1.05rem',
//                   fontWeight: 700,
//                   color: '#212529'
//                 }}>
//                   <strong>{indexValue}</strong>
//                   <span style={{
//                     background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
//                     color: 'white',
//                     padding: '4px 10px',
//                     borderRadius: '20px',
//                     fontSize: '0.8rem',
//                     fontWeight: 700
//                   }}>
//                     #{sortedData.findIndex(d => d.scrip === indexValue) + 1}
//                   </span>
//                 </div>
//                 <div style={{
//                   fontSize: '0.95rem',
//                   color: '#495057',
//                   display: 'flex',
//                   justifyContent: 'space-between'
//                 }}>
//                   <span>{activeMetric === 'pnl' ? 'Profit & Loss:' : 'Turnover:'} </span>
//                   <span style={{ fontWeight: 700, color: '#4361ee' }}>{formatValue(value)}</span>
//                 </div>
//               </div>
//             )}
//             label={({ value }) => Math.round(value).toLocaleString('en-IN')}
//             enableLabel={true}
//             labelFormat={v =>
//               v != null && !isNaN(v)
//                 ? `${Math.round(Number.parseFloat(v))}`
//                 : ''
//             }
//             labelSkipWidth={16}
//             labelSkipHeight={16}
//             labelTextColor="#ffffff"
//             animate={true}
//             motionStiffness={90}
//             motionConfig="gentle"
//             motionDamping={20}
//             theme={{
//               fontFamily: 'Inter, sans-serif',
//               fontSize: 14,
//               textColor: '#4b5563',
//               axis: {
//                 domain: { line: { stroke: '#e2e8f0', strokeWidth: 2 } },
//                 ticks: { line: { stroke: '#e2e8f0', strokeWidth: 1 }, text: { fill: '#4b5563', fontSize: 12 } },
//                 legend: { text: { fontSize: 13, fontWeight: 600, fill: '#1f2937' } }
//               },
//               grid: { line: { stroke: '#f3f4f6', strokeWidth: 1 } },
//               labels: { text: { fontSize: 12, fontWeight: 500, fill: '#ffffff', fontFamily: 'Inter, sans-serif' } },
//               tooltip: { container: { background: 'white', color: '#1f2937', fontSize: '12px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px', border: '1px solid #f3f4f6' } }
//             }}
//           />
//         </div>
//         <div style={{
//           padding: '1.5rem 32px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           borderTop: '1px solid rgba(226, 232, 240, 0.5)'
//         }}>
//           <div style={{
//             display: 'flex',
//             gap: '1.25rem',
//             flexWrap: 'wrap'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               fontSize: '0.9rem',
//               fontWeight: 500
//             }}>
//               <div style={{
//                 width: '16px',
//                 height: '16px',
//                 borderRadius: '4px',
//                 background: 'linear-gradient(90deg, #FFD700, #FFA500)'
//               }}></div>
//               <span>Top Performer</span>
//             </div>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem',
//               fontSize: '0.9rem',
//               fontWeight: 500
//             }}>
//               <div style={{
//                 width: '16px',
//                 height: '16px',
//                 borderRadius: '4px',
//                 background: activeMetric === 'realized'
//                   ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
//                   : activeMetric === 'unrealized'
//                   ? 'linear-gradient(90deg, #4361ee 0%, #3a56e4 100%)'
//                   : 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)'
//               }}></div>
//               <span>
//                 {activeMetric === 'realized' ? 'Realized PNL'
//                   : activeMetric === 'unrealized' ? 'Unrealized PNL'
//                   : 'Brokerage'}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { FaCrown, FaChartLine, FaInfoCircle, FaExchangeAlt, FaMoneyBillWave } from 'react-icons/fa';
import { HashLoader } from 'react-spinners';

const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <>
          <div style={{
            position: 'absolute',
            bottom: '120%',
            right: 0,
            background: '#f3f4f6',
            color: '#111827',
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '4px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
            zIndex: 9999,
            width: '160px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: 1.3
          }}>
            {content}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '90%',
            right: '8px',
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: 'transparent transparent #1f2937 transparent'
          }}></div>
        </>
      )}
    </div>
  );
};

export default function Top10Scrips() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uploadId = localStorage.getItem("uploadId");
  const [activeMetric, setActiveMetric] = useState('realized');
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/file/top_ten_script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ uploadId })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(json => {
        const { scrips, brokerage, realized, unrealized } = json;
        if (!Array.isArray(scrips) || scrips.length === 0) {
          setData([]);
          return;
        }
        const nivoData = scrips.map((scrip, i) => ({
          scrip,
          brokerage: Array.isArray(brokerage) ? Number(brokerage[i]) : 0,
          realized: Array.isArray(realized) ? Number(realized[i]) : 0,
          unrealized: Array.isArray(unrealized) ? Number(unrealized[i]) : 0,
        }));
        setData(nivoData);
      })
      .catch(err => {
        console.error('Failed to load Top‑10 data:', err);
        setData([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col  items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '1500px',
        padding: '10px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        borderRadius: '8px',
        margin: '12px auto'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <FaInfoCircle style={{ fontSize: '2rem', color: '#ced4da', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#343a40' }}>
            No data available
          </h3>
          <p style={{ color: '#6c757d', maxWidth: '400px', fontSize: '0.9rem' }}>
            Could not load top scrips data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b[activeMetric] - a[activeMetric]);

  const formatValue = (value) => {
    if (value == null || isNaN(value)) return '—';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1500px',
      padding: '10px',
      boxSizing: 'border-box',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      borderRadius: '8px',
      margin: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '8px',
        border: '1px solid rgba(241, 245, 249, 0.6)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '12px 16px',
          background: 'linear-gradient(120deg, rgba(249, 250, 251, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaCrown />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#212529',
                marginBottom: '4px'
              }}>
                {activeMetric === 'realized'
                  ? 'Top Scrips by Realized PNL'
                  : activeMetric === 'unrealized'
                    ? 'Top Scrips by Unrealized PNL'
                    : 'Top Scrips by Brokerage'}
              </h2>
              <p style={{
                fontSize: '0.8rem',
                color: '#6c757d',
                fontWeight: 500,
                margin: 0
              }}>
                Best performing stocks by {
                  activeMetric === 'realized' ? 'Realized PNL'
                    : activeMetric === 'unrealized' ? 'Unrealized PNL'
                      : 'Brokerage'
                }
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {['realized', 'unrealized', 'brokerage'].map(metric => (
              <button
                key={metric}
                style={{
                  padding: '0.5rem 1rem',
                  background: activeMetric === metric ? '#4361ee' : 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  color: activeMetric === metric ? 'white' : '#6c757d',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => setActiveMetric(metric)}
              >
                {metric === 'realized' && <FaChartLine style={{ fontSize: '0.9rem' }} />}
                {metric === 'unrealized' && <FaExchangeAlt style={{ fontSize: '0.9rem' }} />}
                {metric === 'brokerage' && <FaMoneyBillWave style={{ fontSize: '0.9rem' }} />}
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          margin: '1rem 16px'
        }}>
          {[
            {
              icon: <FaCrown />,
              title: 'Top Performer',
              value: sortedData[0].scrip,
              tooltip: 'This shows the best performing stock among top 10.',
              color: '#FFD700'
            },
            {
              icon: <FaChartLine />,
              title: activeMetric === 'realized' ? 'Highest Realized PNL'
                : activeMetric === 'unrealized' ? 'Highest Unrealized PNL'
                  : 'Highest Brokerage',
              value: formatValue(sortedData[0][activeMetric]),
              tooltip: `This shows the stock with the highest ${activeMetric} among top 10.`,
              color: '#4361ee'
            },
            {
              icon: <FaExchangeAlt />,
              title: activeMetric === 'realized' ? 'Avg Realized PNL'
                : activeMetric === 'unrealized' ? 'Avg Unrealized PNL'
                  : 'Avg Brokerage',
              value: formatValue(
                sortedData.reduce((sum, item) => sum + item[activeMetric], 0) / sortedData.length
              ),
              tooltip: `This shows the average ${activeMetric} across the top 10 stocks.`,
              color: '#10b981'
            },
            {
              icon: <FaInfoCircle />,
              title: 'Performance Gap',
              value: sortedData[sortedData.length - 1][activeMetric] === 0
                ? '-'
                : `${((sortedData[0][activeMetric] / sortedData[sortedData.length - 1][activeMetric] - 1) * 100).toFixed(1)}%`,
              tooltip: `This shows how much more the best stock’s ${activeMetric} is compared to the top 10 average.`,
              color: '#8b5cf6'
            }
          ].map(({ icon, title, value, tooltip, color }, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '6px',
              padding: '0.75rem',
              border: '1px solid #edf2f7',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              position: 'relative'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#f0f4fe',
                color,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1rem',
                  color: '#6c757d',
                  marginBottom: '0.2rem',
                  fontWeight: 500
                }}>{title}</div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#212529'
                }}>{value}</div>
              </div>
              <Tooltip content={tooltip}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '4px',
                  fontSize: '16px',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}>
                  <FaInfoCircle />
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
        <div style={{
          padding: '10px 16px',
          height: '400px',
          overflow: 'hidden'
        }}>
          <ResponsiveBar
            data={sortedData}
            keys={[activeMetric]}
            layout="vertical"
            indexBy="scrip"
            margin={{ top: 20, right: 20, bottom: 80, left: 80 }}
            padding={0.4}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={({ index }) =>
              index === 0
                ? 'url(#goldGradient)'
                : activeMetric === 'realized'
                  ? 'url(#greenGradient)'
                  : activeMetric === 'unrealized'
                    ? 'url(#blueGradient)'
                    : 'url(#redGradient)'
            }
            defs={[
              { id: 'goldGradient', type: 'linearGradient', colors: [{ offset: 0, color: '#FFD700' }, { offset: 100, color: '#FFA500' }] },
              { id: 'blueGradient', type: 'linearGradient', colors: [{ offset: 0, color: '#4361ee' }, { offset: 100, color: '#3a56e4' }] },
              { id: 'greenGradient', type: 'linearGradient', colors: [{ offset: 0, color: '#10B981' }, { offset: 100, color: '#059669' }] },
              { id: 'redGradient', type: 'linearGradient', colors: [{ offset: 0, color: '#b91c1c' }, { offset: 50, color: '#dc2626' }] }
            ]}
            borderRadius={4}
            axisBottom={{
              tickSize: 0,
              tickPadding: 8,
              tickRotation: 45,
              legend: 'Scrips',
              legendPosition: 'middle',
              legendOffset: 60,
              renderTick: tick => {
                const words = tick.value.split(' ');
                return (
                  <g transform={`translate(${tick.x},${tick.y + 10})`}>
                    {words.map((word, i) => (
                      <text
                        key={i}
                        x={0}
                        y={i * 12}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontSize: 11,
                          fill: '#555',
                          fontFamily: 'sans-serif'
                        }}
                      >
                        {word}
                      </text>
                    ))}
                  </g>
                );
              }
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 8,
              tickRotation: 0,
              legend: activeMetric === 'realized' ? 'Realized PNL (₹)'
                : activeMetric === 'unrealized' ? 'Unrealized PNL (₹)'
                  : 'Brokerage (₹)',
              legendPosition: 'middle',
              legendOffset: -70,
              format: formatValue
            }}
            enableGridY={true}
            tooltip={({ id, value, indexValue }) => (
              <div style={{
                background: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
                border: '1px solid rgba(241, 245, 249, 0.8)',
                minWidth: '220px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#212529'
                }}>
                  <strong>{indexValue}</strong>
                  <span style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    #{sortedData.findIndex(d => d.scrip === indexValue) + 1}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  color: '#495057',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{activeMetric === 'pnl' ? 'Profit & Loss:' : 'Turnover:'} </span>
                  <span style={{ fontWeight: 700, color: '#4361ee' }}>{formatValue(value)}</span>
                </div>
              </div>
            )}
            label={({ value }) => Math.round(value).toLocaleString('en-IN')}
            enableLabel={true}
            labelFormat={v => v != null && !isNaN(v) ? `${Math.round(Number.parseFloat(v))}` : ''}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#ffffff"
            animate={true}
            motionConfig="gentle"
            theme={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              textColor: '#4b5563',
              axis: {
                domain: { line: { stroke: '#e2e8f0', strokeWidth: 1 } },
                ticks: { line: { stroke: '#e2e8f0', strokeWidth: 1 }, text: { fill: '#4b5563', fontSize: 10 } },
                legend: { text: { fontSize: 11, fontWeight: 600, fill: '#1f2937' } }
              },
              grid: { line: { stroke: '#f3f4f6', strokeWidth: 1 } },
              labels: { text: { fontSize: 10, fontWeight: 500, fill: '#ffffff' } },
              tooltip: { container: { background: 'white', color: '#1f2937', fontSize: '10px', borderRadius: '6px', padding: '8px', border: '1px solid #f3f4f6' } }
            }}
          />
        </div>
        <div style={{
          padding: '1rem 16px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          borderTop: '1px solid rgba(226, 232, 240, 0.5)',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #FFD700, #FFA500)'
              }}></div>
              <span>Top Performer</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: activeMetric === 'realized'
                  ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                  : activeMetric === 'unrealized'
                    ? 'linear-gradient(90deg, #4361ee 0%, #3a56e4 100%)'
                    : 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)'
              }}></div>
              <span>{activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}