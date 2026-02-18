


// //Sesion with GraphDataContext
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Plot from "react-plotly.js";
// import { useGraphData } from "./GraphDataContext";
// import { HashLoader } from "react-spinners";

// const BestTradePlot = () => {
//   const [graphData, setLocalGraphData] = useState(null); // Renamed to setLocalGraphData
//   const [error, setError] = useState("");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const { getGraphData, setGraphData } = useGraphData();

//   useEffect(() => {
//     const fetchGraphData = async () => {
//       const uploadId = localStorage.getItem("uploadId");
//       const cacheKey = `best_trade_plot_${uploadId}`;

//       if (!uploadId) {
//         setError("Please upload a file first.");
//         return;
//       }

//       // Check cache first
//       const cachedData = getGraphData(cacheKey);
//       if (cachedData) {
//         setLocalGraphData(cachedData); // Use renamed setter
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE}/file/create_best_trade_plot`,
//           new URLSearchParams({ uploadId })
//         );

//         if (!response.data || !response.data.figure) {
//           setError("Graph generation failed. Please check the data or try again.");
//           return;
//         }

//         // Convert Y-axis values to float and filter out NaN values
//         const convertedData = response.data.figure.data.map((trace) => ({
//           ...trace,
//           x: trace.x
//             ? trace.x.map((value) => {
//                 const numValue = parseFloat(value);
//                 return isNaN(numValue) ? 0 : numValue;
//               })
//             : trace.x,
//         }));

//         const figure = { ...response.data.figure, data: convertedData };
//         setLocalGraphData(figure); // Use renamed setter
//         // Cache the data
//         setGraphData(cacheKey, figure); // Use context's setGraphData
//       } catch (err) {
//         setError("Graph generation failed. Please check the data or try again.");
//         console.error("Graph BestTradePlot API Error:", err.response ? err.response.data : err.message);
//       }
//     };

//     fetchGraphData();
//   }, [getGraphData, setGraphData]);

//   return (
//    <div>
//       {error && <p className="text-red-500">{error}</p>}
//       {!graphData || !graphData.data || !graphData.layout ? (
//          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>
//       ) : (
//         <Plot
//           data={graphData.data}
//           layout={{
//             ...graphData.layout,
//             autosize: true,
//             responsive: true,
//             title: graphData.layout?.title || "Graph Title",
//             margin: { t: 50, l: 50, r: 30, b: 50 },
//           }}
//           useResizeHandler={true}
//           style={{ width: "100%", height: "100%" }}
//           config={{
//             responsive: true,
//             displaylogo: false,
//             ...(graphData?.config || {}),
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default BestTradePlot;



// import React, { useEffect, useState } from 'react';
// import { ResponsiveBar } from '@nivo/bar';
// import { FaChartBar, FaArrowTrendUp, FaCoins } from 'react-icons/fa6';

// export default function BestTradePlot() {
//   const [data, setData] = useState({ nominal: [], adjusted: [] });
//   const [view, setView] = useState('nominal');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isZeroModalOpen, setIsZeroModalOpen] = useState(false);
//   const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//      fetch(`${API_BASE}/file/create_best_trade_plot`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: new URLSearchParams({ uploadId })
//         })
//       .then(res => {
//         if (!res.ok) throw new Error(`Server responded with ${res.status}`);
//         return res.json();
//       })
//       .then(json => {
//         setData(json);
//         setIsLoading(false);
//       })
//       .catch(err => {
//         console.error('Fetch error:', err);
//         setIsLoading(false);
//       });
//   }, []);

//   // Prepare and sort chart data
//   const chartData = data[view]
//     .map(item => ({ scrip: item.scrip, probability: item.probability }))
//     .sort((a, b) => b.probability - a.probability);

//   // Extract zero‑return stocks
//   const zeroReturnStocks = chartData.filter(item => item.probability > 0);

//   // Theme for Nivo
//   const theme = {
//     background: 'transparent',
//     textColor: '#4B5563',
//     fontSize: 12,
//     fontFamily: "'Inter', 'Segoe UI', sans-serif",
//     axis: {
//       domain: { line: { stroke: '#E5E7EB', strokeWidth: 2 } },
//       ticks: {
//         line: { stroke: '#E5E7EB', strokeWidth: 1 },
//         text: { fill: '#6B7280', fontSize: 11 }
//       },
//       legend: {
//         text: {
//           fontSize: 13,
//           fontWeight: 600,
//           fill: '#374151'
//         }
//       }
//     },
//     grid: {
//       line: {
//         stroke: '#F3F4F6',
//         strokeWidth: 1,
//         strokeDasharray: '4 4'
//       }
//     },
//     tooltip: {
//       container: {
//         background: 'white',
//         color: '#1f3437ff',
//         fontSize: '12px',
//         borderRadius: '8px',
//         boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//         padding: '12px',
//         border: '1px solid #f3f4f6'
//       }
//     }
//   };

//   // Inline styles
//   const styles = {
//     dashboardContainerPremium: {
//       width: '98vw',
//       maxWidth: '1200px',
//       padding: '20px',
//       boxSizing: 'border-box',
//       fontFamily: "'Inter', 'Segoe UI', sans-serif",
//       borderRadius: '16px',
//       margin: '24px auto'
//     },
//     glassCard: {
//       position: 'relative',
//       background: 'rgba(255, 255, 255, 0.85)',
//       borderRadius: '16px',
//       boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//       overflow: 'hidden',
//       border: '1px solid rgba(241, 245, 249, 0.6)',
//       backdropFilter: 'blur(10px)'
//     },
//     dashboardHeader: {
//       position: 'relative',
//       padding: '24px 32px 16px',
//       background: 'linear-gradient(120deg, rgba(249, 250, 251, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%)',
//       borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'flex-start'
//     },
//     headerContent: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '1rem'
//     },
//     headerIcon: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '48px',
//       height: '48px',
//       background: 'linear-gradient(135deg, #4361ee 0%, #2a44c4 100%)',
//       borderRadius: '12px',
//       color: 'white',
//       fontSize: '1.5rem',
//       boxShadow: '0 4px 6px rgba(67, 97, 238, 0.2)'
//     },
//     dashboardTitle: {
//       fontSize: '1.6rem',
//       fontWeight: 700,
//       color: '#212529',
//       marginBottom: '6px',
//       letterSpacing: '-0.5px'
//     },
//     dashboardSubtitle: {
//       fontSize: '1rem',
//       color: '#6c757d',
//       fontWeight: 500,
//       margin: 0
//     },
//     headerControls: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'flex-end',
//       gap: '1rem'
//     },
//     viewButtons: {
//       display: 'flex',
//       gap: '0.75rem'
//     },
//     viewBtn: {
//       padding: '0.5rem 1rem',
//       background: 'white',
//       border: '1px solid #e2e8f0',
//       borderRadius: '8px',
//       color: '#6c757d',
//       fontWeight: 500,
//       fontSize: '0.9rem',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '0.5rem'
//     },
//     activeBtn: {
//       background: '#4361ee',
//       color: 'white',
//       borderColor: '#4361ee',
//       boxShadow: '0 2px 4px rgba(67, 97, 238, 0.2)'
//     },
//     btnIcon: {
//       fontSize: '0.9rem'
//     },
//     chartLoading: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '400px',
//       gap: '20px'
//     },
//     loadingSpinner: {
//       width: '50px',
//       height: '50px',
//       border: '5px solid rgba(224, 231, 255, 0.5)',
//       borderTop: '5px solid #4361ee',
//       borderRadius: '50%',
//       animation: 'spin 1s linear infinite'
//     },
//     loadingText: {
//       fontSize: '1.1rem',
//       color: '#4361ee',
//       fontWeight: 500
//     },
//     noData: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '400px',
//       gap: '16px',
//       background: 'linear-gradient(to right, rgba(240, 249, 255, 0.5) 0%, rgba(253, 242, 248, 0.5) 100%)'
//     },
//     noDataIcon: {
//       fontSize: '3rem',
//       opacity: 0.7
//     },
//     noDataText: {
//       fontSize: '1.1rem',
//       color: '#6c757d',
//       fontWeight: 500
//     },
//     zeroCardWrapper: {
//       display: 'flex',
//       justifyContent: 'flex-end',
//       marginBottom: '12px'
//     },
//     zeroCard: {
//       background: '#f3f4f6',
//       color: '#1f2937',
//       padding: '8px 12px',
//       borderRadius: '8px',
//       fontWeight: 500,
//       cursor: 'pointer',
//       marginBottom: '12px',
//       boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//       display: 'inline-block'
//     },
//     zeroRed: {
//       color: '#dc2626',
//       fontWeight: 600
//     },
//     clickHint: {
//       fontSize: '11px',
//       color: '#6b7280',
//       marginLeft: '4px'
//     },
//     chartContainer: {
//       padding: '10px',
//       position: 'relative',
//       minHeight: '500px',
//       height: '400px'
//     },
//     modalOverlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       backdropFilter: 'blur(4px)',
//       background: 'rgba(0,0,0,0.3)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 999
//     },
//     modal: {
//       background: 'white',
//       padding: '20px',
//       borderRadius: '12px',
//       maxHeight: '80%',
//       overflowY: 'auto',
//       width: '320px',
//       boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
//     },
//     closeBtn: {
//       marginTop: '12px',
//       padding: '6px 14px',
//       background: '#2563eb',
//       color: 'white',
//       border: 'none',
//       borderRadius: '6px',
//       cursor: 'pointer'
//     },
//     chartTooltip: {
//       background: 'white',
//       padding: '16px',
//       borderRadius: '8px',
//       boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//       border: '1px solid rgba(241, 245, 249, 0.8)',
//       minWidth: '220px'
//     },
//     tooltipHeader: {
//       marginBottom: '8px',
//       fontSize: '1.05rem',
//       fontWeight: 700,
//       color: '#212529'
//     },
//     tooltipValue: {
//       fontSize: '0.95rem',
//       color: '#495057',
//       marginBottom: '0.5rem',
//       display: 'flex',
//       justifyContent: 'space-between'
//     },
//     highlight: {
//       fontWeight: 700,
//       color: '#4361ee'
//     }
//   };

//   return (
//     <div style={styles.dashboardContainerPremium}>
//       <div style={styles.glassCard}>
//         {/* Animation styles */}
//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//           `}
//         </style>

//         {/* HEADER */}
//         <div style={styles.dashboardHeader}>
//           <div style={styles.headerContent}>
//             <div style={styles.headerIcon}><FaChartBar /></div>
//             <div>
//               <h2 style={styles.dashboardTitle}>Best Trade Probability Analysis</h2>
//               <p style={styles.dashboardSubtitle}>
//                 Probability of profit for each stock {view === 'adjusted' && '(inflation‑adjusted)'}
//               </p>
//             </div>
//           </div>
//           <div style={styles.headerControls}>
//             <div style={styles.viewButtons}>
//               <button
//                 style={{
//                   ...styles.viewBtn,
//                   ...(view === 'nominal' && styles.activeBtn)
//                 }}
//                 onClick={() => setView('nominal')}
//               >
//                 <FaArrowTrendUp style={styles.btnIcon} /> Nominal Rates
//               </button>
//               <button
//                 style={{
//                   ...styles.viewBtn,
//                   ...(view === 'adjusted' && styles.activeBtn)
//                 }}
//                 onClick={() => setView('adjusted')}
//               >
//                 <FaCoins style={styles.btnIcon} /> Inflation Adjusted
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* LOADING / NO DATA STATES */}
//         {isLoading ? (
//           <div style={styles.chartLoading}>
//             <div style={styles.loadingSpinner} />
//             <div style={styles.loadingText}>Analyzing trade probabilities...</div>
//           </div>
//         ) : chartData.length === 0 ? (
//           <div style={styles.noData}>
//             <div style={styles.noDataIcon}>📊</div>
//             <div style={styles.noDataText}>No trade probability data available</div>
//           </div>
//         ) : (
//           <>
//             {/* ZERO‑RETURN CARD */}
//             {zeroReturnStocks.length > 0 && (
//               <div style={styles.zeroCardWrapper}>
//                 <div style={styles.zeroCard} onClick={() => setIsZeroModalOpen(true)}>
//                    {zeroReturnStocks.length} stocks with <span style={styles.zeroRed}>0 % returns</span>
//                     <span style={styles.clickHint}> (click to view)</span>
//                 </div>
//               </div>
//             )}

//             {/* CHART */}
//             <div style={styles.chartContainer}>
//               <ResponsiveBar
//                 data={zeroReturnStocks}
//                 keys={['probability']}
//                 indexBy="scrip"
//                 layout="horizontal"
//                 margin={{ top: 10, right: 40, bottom: 60, left: 200 }}
//                 padding={0.4}
//                 valueScale={{ type: 'linear' }}
//                 indexScale={{ type: 'band', round: true }}
//                 valueFormat={v => `${(v * 100).toFixed(1)}%`}
//                 theme={theme}
//                 colors={() => view === 'nominal' ? 'url(#nominalGradient)' : 'url(#adjustedGradient)'}
//                 borderWidth={0}
//                 borderRadius={4}
//                 axisTop={null}
//                 axisRight={null}
//                 axisBottom={{
//                   tickSize: 5,
//                   tickPadding: 10,
//                   tickRotation: 0,
//                   legend: 'Probability (%)',
//                   legendPosition: 'middle',
//                   legendOffset: 40,
//                   format: v => `${(v * 100).toFixed(0)}%`
//                 }}
//                 axisLeft={{
//                   tickSize: 0,
//                   tickPadding: 10,
//                   tickRotation: 0,
//                   legend: 'Stocks',
//                   legendPosition: 'middle',
//                   legendOffset: -185,
//                   renderTick: ({ value, x, y }) => (
//                     <g transform={`translate(${x},${y})`}>
//                       <text
//                         x={-10}
//                         y={0}
//                         textAnchor="end"
//                         dominantBaseline="middle"
//                         style={{
//                           fill: '#374151',
//                           fontSize: '12px',
//                           fontWeight: 600
//                         }}
//                       >
//                         {value}
//                       </text>
//                     </g>
//                   )
//                 }}
//                 enableGridY={false}
//                 labelSkipWidth={16}
//                 labelSkipHeight={16}
//                 labelTextColor="#ffffff"
//                 labelFormat={v => `${(v * 100).toFixed(1)}%`}
//                 tooltip={({ value, indexValue }) => (
//                   <div style={styles.chartTooltip}>
//                     <div style={styles.tooltipHeader}><strong>{indexValue}</strong></div>
//                     <div style={styles.tooltipValue}>
//                       <span>Probability: </span>
//                       <span style={styles.highlight}>{(value * 100).toFixed(2)}%</span>
//                     </div>
//                   </div>
//                 )}
//                 animate
//                 motionStiffness={90}
//                 motionDamping={15}
//               />
//               <svg width="0" height="0">
//                 <defs>
//                   <linearGradient id="nominalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                     <stop offset="0%" stopColor="#516debff" />
//                     <stop offset="100%" stopColor="#3a56e4" />
//                   </linearGradient>
//                   <linearGradient id="adjustedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                     <stop offset="0%" stopColor="#10B981" />
//                     <stop offset="100%" stopColor="#059669" />
//                   </linearGradient>
//                 </defs>
//               </svg>
//             </div>

//             {/* ZERO‑RETURN MODAL */}
//             {isZeroModalOpen && (
//               <div
//                 style={styles.modalOverlay}
//                 onClick={() => setIsZeroModalOpen(false)}
//               >
//                 <div
//                   style={styles.modal}
//                   onClick={e => e.stopPropagation()}
//                 >
//                   <h3>Stocks with 0 % Returns</h3>
//                   <ul>
//                     {zeroReturnStocks.map(s => (
//                       <li key={s.scrip}>{s.scrip}</li>
//                     ))}
//                   </ul>
//                   <button
//                     style={styles.closeBtn}
//                     onClick={() => setIsZeroModalOpen(false)}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }








import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import {
  FaChartColumn as FaChartBar,
  FaArrowTrendUp,
  FaCoins,
  FaCircleInfo as FaInfoCircle
} from 'react-icons/fa6';
import { HashLoader } from 'react-spinners';

export default function BestTradePlot() {
  const [data, setData] = useState({ nominal: [], adjusted: [] });
  const [view, setView] = useState('nominal');
  const [isLoading, setIsLoading] = useState(true);
  const [isZeroModalOpen, setIsZeroModalOpen] = useState(false);
  const uploadId = localStorage.getItem("uploadId");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/file/create_best_trade_plot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ uploadId })
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then(json => {
        setData(json);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setIsLoading(false);
      });
  }, []);

  // Prepare and sort chart data
  const chartData = data[view]
    .map(item => ({ scrip: item.scrip, probability: item.probability }))
    .sort((a, b) => b.probability - a.probability);

  // Extract zero-return stocks
  const zeroReturnStocks = chartData.filter(item => item.probability > 0);

  // Theme for Nivo with improved styling
  const theme = {
    background: 'transparent',
    textColor: '#4B5563',
    fontSize: 12,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    axis: {
      domain: { line: { stroke: '#E5E7EB', strokeWidth: 2 } },
      ticks: {
        line: { stroke: '#E5E7EB', strokeWidth: 1 },
        text: { fill: '#6B7280', fontSize: 11 }
      },
      legend: {
        text: {
          fontSize: 13,
          fontWeight: 600,
          fill: '#374151'
        }
      }
    },
    grid: {
      line: {
        stroke: '#F3F4F6',
        strokeWidth: 1,
        strokeDasharray: '4 4'
      }
    },
    tooltip: {
      container: {
        background: 'white',
        color: '#1f3437ff',
        fontSize: '12px',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: '12px',
        border: '1px solid #f3f4f6'
      }
    }
  };

  // Inline styles with improved responsive design
  const styles = {
    dashboardContainer: {
      width: '100%',
      maxWidth: '1500px',
      padding: '16px',
      boxSizing: 'border-box',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      borderRadius: '12px',
      margin: '16px auto'
    },
    glassCard: {
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      border: '1px solid rgba(241, 245, 249, 0.8)',
      backdropFilter: 'blur(8px)'
    },
    dashboardHeader: {
      position: 'relative',
      padding: '20px',
      background: 'linear-gradient(120deg, rgba(249, 250, 251, 0.9) 0%, rgba(240, 244, 248, 0.9) 100%)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    headerIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #4361ee 0%, #2a44c4 100%)',
      borderRadius: '10px',
      color: 'white',
      fontSize: '1.2rem',
      boxShadow: '0 2px 4px rgba(67, 97, 238, 0.2)'
    },
    headerText: {
      display: 'flex',
      flexDirection: 'column'
    },
    dashboardTitle: {
      fontSize: '1.4rem',
      fontWeight: 700,
      color: '#1a1a1a',
      margin: 0,
      lineHeight: '1.3'
    },
    dashboardSubtitle: {
      fontSize: '0.9rem',
      color: '#6c757d',
      fontWeight: 500,
      margin: '4px 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    viewButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    viewBtn: {
      padding: '8px 12px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      color: '#6c757d',
      fontWeight: 500,
      fontSize: '0.85rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease'
    },
    activeBtn: {
      background: '#4361ee',
      color: 'white',
      borderColor: '#4361ee',
      boxShadow: '0 1px 3px rgba(67, 97, 238, 0.2)'
    },
    btnIcon: {
      fontSize: '0.8rem'
    },
    chartLoading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      gap: '16px'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid rgba(224, 231, 255, 0.5)',
      borderTop: '4px solid #4361ee',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loadingText: {
      fontSize: '1rem',
      color: '#4361ee',
      fontWeight: 500
    },
    noData: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      gap: '12px',
      background: 'linear-gradient(to right, rgba(240, 249, 255, 0.5) 0%, rgba(253, 242, 248, 0.5) 100%)'
    },
    noDataIcon: {
      fontSize: '2.5rem',
      opacity: 0.7
    },
    noDataText: {
      fontSize: '1rem',
      color: '#6c757d',
      fontWeight: 500,
      textAlign: 'center',
      padding: '0 16px'
    },
    zeroCardWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '0 16px',
      marginTop: '12px'
    },
    zeroCard: {
      background: '#f8f9fa',
      color: '#1f2937',
      padding: '6px 12px',
      borderRadius: '6px',
      fontWeight: 500,
      cursor: 'pointer',
      fontSize: '0.85rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.2s ease',
      border: '1px solid #e9ecef',
      '&:hover': {
        background: '#f1f3f5'
      }
    },
    zeroRed: {
      color: '#dc2626',
      fontWeight: 600
    },
    clickHint: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    chartContainer: {
      padding: '16px',
      height: 'calc(100vh - 300px)',
      minHeight: '400px',
      maxHeight: '500px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backdropFilter: 'blur(4px)',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999
    },
    modal: {
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      maxHeight: '70vh',
      overflowY: 'auto',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    },
    closeBtn: {
      marginTop: '12px',
      padding: '8px 16px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 500,
      width: '100%',
      transition: 'background 0.2s ease',
      '&:hover': {
        background: '#1d4ed8'
      }
    },
    chartTooltip: {
      background: 'white',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid rgba(241, 245, 249, 0.8)',
      minWidth: '180px'
    },
    tooltipHeader: {
      marginBottom: '6px',
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#212529'
    },
    tooltipValue: {
      fontSize: '0.85rem',
      color: '#495057',
      marginBottom: '0.25rem',
      display: 'flex',
      justifyContent: 'space-between'
    },
    highlight: {
      fontWeight: 700,
      color: '#4361ee'
    },
    infoIcon: {
      color: '#6b7280',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.glassCard}>
        {/* Animation styles */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>

        {/* HEADER */}
        <div style={styles.dashboardHeader}>
          <div style={styles.headerRow}>
            <div style={styles.headerContent}>
              <div style={styles.headerIcon}><FaChartBar /></div>
              <div style={styles.headerText}>
                <h2 style={styles.dashboardTitle}>Best Trade Probability</h2>
                <p style={styles.dashboardSubtitle}>
                  <FaInfoCircle style={styles.infoIcon} />
                  Probability of profit for each stock {view === 'adjusted' && '(inflation-adjusted)'}
                </p>
              </div>
            </div>

            <div style={styles.viewButtons}>
              <button
                style={{
                  ...styles.viewBtn,
                  ...(view === 'nominal' && styles.activeBtn)
                }}
                onClick={() => setView('nominal')}
              >
                <FaArrowTrendUp style={styles.btnIcon} /> Nominal
              </button>
              <button
                style={{
                  ...styles.viewBtn,
                  ...(view === 'adjusted' && styles.activeBtn)
                }}
                onClick={() => setView('adjusted')}
              >
                <FaCoins style={styles.btnIcon} /> Adjusted
              </button>
            </div>
          </div>
        </div>

        {/* LOADING / NO DATA STATES */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
            <HashLoader color="#0369a1" size={60} />
            <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
              CMDA...
            </p>
          </div>
        ) : chartData.length === 0 ? (
          <div style={styles.noData}>
            <div style={styles.noDataIcon}>📊</div>
            <div style={styles.noDataText}>No trade probability data available for analysis</div>
          </div>
        ) : (
          <>
            {/* ZERO-RETURN CARD */}
            {zeroReturnStocks.length > 0 && (
              <div style={styles.zeroCardWrapper}>
                <div
                  style={styles.zeroCard}
                  onClick={() => setIsZeroModalOpen(true)}
                >
                  {zeroReturnStocks.length} stocks with <span style={styles.zeroRed}>0% returns</span>
                  <span style={styles.clickHint}>(click to view)</span>
                </div>
              </div>
            )}

            {/* CHART */}
            <div style={styles.chartContainer}>
              <ResponsiveBar
                data={zeroReturnStocks}
                keys={['probability']}
                indexBy="scrip"
                layout="horizontal"
                margin={{ top: 10, right: 40, bottom: 50, left: 140 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                valueFormat={v => `${(v * 100).toFixed(1)}%`}
                theme={theme}
                colors={() => view === 'nominal' ? 'url(#nominalGradient)' : 'url(#adjustedGradient)'}
                borderWidth={0}
                borderRadius={3}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 8,
                  tickRotation: 0,
                  legend: 'Probability (%)',
                  legendPosition: 'middle',
                  legendOffset: 35,
                  format: v => `${(v * 100).toFixed(0)}%`
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 8,
                  tickRotation: 0,
                  legend: '',
                  legendPosition: 'middle',
                  legendOffset: -60,
                  renderTick: ({ value, x, y }) => (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={-8}
                        y={0}
                        textAnchor="end"
                        dominantBaseline="middle"
                        style={{
                          fill: '#374151',
                          fontSize: '12px',
                          fontWeight: 500
                        }}
                      >
                        {value.length > 15 ? `${value.substring(0, 15)}...` : value}
                      </text>
                    </g>
                  )
                }}
                enableGridY={false}
                labelSkipWidth={16}
                labelSkipHeight={16}
                labelTextColor="#ffffff"
                labelFormat={v => `${(v * 100).toFixed(1)}%`}
                tooltip={({ value, indexValue }) => (
                  <div style={styles.chartTooltip}>
                    <div style={styles.tooltipHeader}>{indexValue}</div>
                    <div style={styles.tooltipValue}>
                      <span>Probability: </span>
                      <span style={styles.highlight}>{(value * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                )}
                animate
                motionStiffness={90}
                motionDamping={15}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="nominalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#516debff" />
                    <stop offset="100%" stopColor="#3a56e4" />
                  </linearGradient>
                  <linearGradient id="adjustedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* ZERO-RETURN MODAL */}
            {isZeroModalOpen && (
              <div
                style={styles.modalOverlay}
                onClick={() => setIsZeroModalOpen(false)}
              >
                <div
                  style={styles.modal}
                  onClick={e => e.stopPropagation()}
                >
                  <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
                    Stocks with 0% Returns ({zeroReturnStocks.length})
                  </h3>
                  <ul style={{
                    paddingLeft: '20px',
                    margin: '0 0 16px',
                    columns: '2',
                    columnGap: '20px'
                  }}>
                    {zeroReturnStocks.map(s => (
                      <li key={s.scrip} style={{
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        breakInside: 'avoid'
                      }}>
                        {s.scrip}
                      </li>
                    ))}
                  </ul>
                  <button
                    style={styles.closeBtn}
                    onClick={() => setIsZeroModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}