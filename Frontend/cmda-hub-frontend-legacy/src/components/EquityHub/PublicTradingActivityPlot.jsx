

// import React, { useEffect, useState, useMemo } from 'react';
// import { ResponsiveBar } from '@nivo/bar';
// import { FaChartBar, FaInfoCircle, FaArrowUp, FaArrowDown, FaChartLine, FaPercentage, FaExchangeAlt } from 'react-icons/fa';
// import { useTooltip } from '@nivo/tooltip';

// const PublicTradingActivityPlot = ({ symbol }) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE}/api/stocks/compute_public_trading_activity`, {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((res) => res.json())
//       .then((json) => {
//         const sortedData = json.sort((a, b) => new Date(a.Date) - new Date(b.Date));
//         setData(sortedData);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching data:', err);
//         setIsLoading(false);
//       });
//   }, []);

//   const insights = useMemo(() => {
//     if (data.length === 0) return null;

//     const latest = data[data.length - 1];
//     const previous = data.length > 1 ? data[data.length - 2] : null;

//     const avgTraded = data.reduce((sum, d) => sum + d.pct_public_traded, 0) / data.length;
//     const maxTraded = Math.max(...data.map(d => d.pct_public_traded));
//     const minTraded = Math.min(...data.map(d => d.pct_public_traded));

//     const tradedChange = previous ? 
//       ((latest.pct_public_traded - previous.pct_public_traded) / previous.pct_public_traded) * 100 : 0;
//     const deliveredChange = previous ? 
//       ((latest.pct_public_delivered - previous.pct_public_delivered) / previous.pct_public_delivered) * 100 : 0;

//     return {
//       latestTraded: latest.pct_public_traded,
//       latestDelivered: latest.pct_public_delivered,
//       avgTraded,
//       maxTraded,
//       minTraded,
//       tradedChange,
//       deliveredChange
//     };
//   }, [data]);

//   const nivoData = useMemo(() => {
//     return data.map(d => ({
//       date: d.Date,
//       '% Public Traded': d.pct_public_traded,
//       '% Public Delivered': d.pct_public_delivered
//     }));
//   }, [data]);

//   const CustomBar = ({ bar }) => {
//     const { showTooltipFromEvent, hideTooltip } = useTooltip();
//     const fillColor = bar.data.id === '% Public Traded' ? 'url(#tradedGradient)' : 'url(#deliveredGradient)';

//     const tooltipContent = (
//       <div className="premium-tooltip">
//         <div className="tooltip-header">{bar.data.id}</div>
//         <div className="tooltip-value">{bar.data.value.toFixed(2)}%</div>
//         <div className="tooltip-date">{bar.data.indexValue}</div>
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
//           rx={6}
//           ry={6}
//           className="bar-animation"
//           style={{
//             animationDelay: `${bar.index * 30}ms`
//           }}
//         />
//         {bar.height > 12 && (
//           <text
//             x={bar.width / 2}
//             y={-6}
//             textAnchor="middle"
//             fill="#ffffff"
//             fontSize={11}
//             fontWeight={600}
//             className="bar-label"
//           >
//             {bar.data.value.toFixed(1)}
//           </text>
//         )}
//       </g>
//     );
//   };

//   if (isLoading) return (
//     <div className="premium-container">
//       <div className="premium-card loading-state">
//         <div className="loading-spinner"></div>
//         <div className="loading-text">Loading trading activity data...</div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="premium-container">
//       <div className="premium-dashboard">
//         <div className="dashboard-header">
//           <div className="header-content">
//             <div className="header-icon">
//               <FaChartBar />
//             </div>
//             <div className="header-text">
//               <h2>Public Trading Activity - UNIVCABLES</h2>
//               <p>Percentage of Public Shares Traded vs. Delivered</p>
//             </div>
//           </div>
//         </div>

//         <div className="dashboard-insights">
//         <div className="insight-card traded">
//             <div className="card-icon">
//             <FaPercentage />
//             </div>
//             <div className="card-content">
//             <div className="card-value">{insights.latestTraded.toFixed(2)}%</div>
//             <div className="card-label">Current Traded</div>
//             <div className={`card-change ${insights.tradedChange >= 0 ? 'positive' : 'negative'}`}>
//                 {insights.tradedChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
//                 {Math.abs(insights.tradedChange).toFixed(2)}%
//             </div>
//             </div>
//             <div className="info-badge">
//             <FaInfoCircle />
//             <span className="badge-tooltip">The percentage of publicly available shares that were traded on the most recent trading day.</span>
//             </div>
//             <div className="card-wave"></div>
//         </div>

//         <div className="insight-card delivered">
//             <div className="card-icon">
//             <FaExchangeAlt />
//             </div>
//             <div className="card-content">
//             <div className="card-value">{insights.latestDelivered.toFixed(2)}%</div>
//             <div className="card-label">Current Delivered</div>
//             <div className={`card-change ${insights.deliveredChange >= 0 ? 'positive' : 'negative'}`}>
//                 {insights.deliveredChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
//                 {Math.abs(insights.deliveredChange).toFixed(2)}%
//             </div>
//             </div>
//             <div className="info-badge">
//             <FaInfoCircle />
//             <span className="badge-tooltip">The percentage of publicly traded shares that were actually delivered (settled) on the most recent day.</span>
//             </div>
//             <div className="card-wave"></div>
//         </div>

//         <div className="insight-card stats">
//             <div className="card-icon">
//             <FaChartLine />
//             </div>
//             <div className="card-content">
//             <div className="card-value">{insights.avgTraded.toFixed(2)}%</div>
//             <div className="card-label">Average Traded</div>
//             <div className="card-stats">
//                 <div className="stat-item max">↑ {insights.maxTraded.toFixed(2)}%</div>
//                 <div className="stat-item min">↓ {insights.minTraded.toFixed(2)}%</div>
//             </div>
//             </div>
//             <div className="info-badge">
//             <FaInfoCircle />
//             <span className="badge-tooltip">The average percentage of public shares traded over the last 30 days.</span>
//             </div>
//             <div className="card-wave"></div>
//         </div>
//         </div>

//         <div className="dashboard-chart">
//           <svg width="0" height="0">
//             <defs>
//               <linearGradient id="tradedGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#4f6cff" />
//                 <stop offset="100%" stopColor="#4361ee" />
//               </linearGradient>
//               <linearGradient id="deliveredGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#00d9b1" />
//                 <stop offset="100%" stopColor="#00c9a1" />
//               </linearGradient>
//             </defs>
//           </svg>
//           <ResponsiveBar
//             data={nivoData}
//             keys={['% Public Traded', '% Public Delivered']}
//             indexBy="date"
//             margin={{ top: 20, right: 30, bottom: 120, left: 60 }}
//             padding={0.3}
//             groupMode="grouped"
//             colors={({ id }) =>
//               id === '% Public Traded' ? 'url(#tradedGradient)' : 'url(#deliveredGradient)'
//             }
//             theme={{
//               textColor: '#4a5568',
//               fontSize: 12,
//               fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//               axis: {
//                 ticks: {
//                   line: {
//                     stroke: '#e2e8f0',
//                     strokeWidth: 1
//                   },
//                   text: {
//                     fill: '#718096',
//                     fontSize: 11,
//                     fontWeight: 500
//                   }
//                 },
//                 legend: {
//                   text: {
//                     fill: '#2d3748',
//                     fontSize: 13,
//                     fontWeight: 600,
//                     letterSpacing: '0.3px'
//                   }
//                 },
//                 domain: {
//                   line: {
//                     stroke: '#e2e8f0',
//                     strokeWidth: 2
//                   }
//                 }
//               },
//               grid: {
//                 line: {
//                   stroke: '#edf2f7',
//                   strokeDasharray: '3 4'
//                 }
//               },
//               legends: {
//                 text: {
//                   fill: '#2d3748',
//                   fontSize: 12,
//                   fontWeight: 600
//                 }
//               },
//               tooltip: {
//                 container: {
//                   display: 'none'
//                 }
//               }
//             }}
//             axisBottom={{
//               tickRotation: -45,
//               legend: 'Date',
//               legendPosition: 'middle',
//               legendOffset: 100,
//               renderTick: tick => (
//                 <g transform={`translate(${tick.x},${tick.y + 10})`}>
//                   <text
//                     textAnchor="end"
//                     dominantBaseline="middle"
//                     transform="rotate(-45)"
//                     style={{
//                       fontSize: 11,
//                       fill: '#4a5568',
//                       fontFamily: "'Inter', sans-serif",
//                       fontWeight: 500
//                     }}
//                   >
//                     {tick.value}
//                   </text>
//                 </g>
//               )
//             }}
//             axisLeft={{
//               legend: '% of Public Shares',
//               legendPosition: 'middle',
//               legendOffset: -50,
//               format: v => `${v.toFixed(0)}%`,
//               tickValues: 5
//             }}

//             enableLabel={false}
//             barComponent={CustomBar}
//             role="application"
//             ariaLabel="Public Trading Activity Bar Chart"
//             animate={true}
//             motionConfig="gentle"
//             motionStiffness={90}
//             motionDamping={15}
//           />
//         </div>

//         <div className="dashboard-footer">
//           <div className="footer-legend">
//             <div className="legend-item">
//               <div className="legend-color traded"></div>
//               <span>% Public Traded</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color delivered"></div>
//               <span>% Public Delivered</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .premium-container {
//           width: 98vw;
//           max-width: 1400px;
//           margin: 24px auto;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//         }

//         .premium-dashboard {
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 24px;
//           overflow: hidden;
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.1);
//           position: relative;
//           z-index: 1;
//         }

//         .premium-dashboard::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 180px;
//           background: linear-gradient(120deg, #f9fcff 0%, #f0f7ff 100%);
//           z-index: -1;
//         }

//         .dashboard-header {
//           padding: 32px 40px 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           position: relative;
//         }

//         .header-content {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           z-index: 1;
//         }

//         .header-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 60px;
//           height: 60px;
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           border-radius: 18px;
//           color: white;
//           font-size: 1.8rem;
//           box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
//           transition: all 0.3s ease;
//         }

//         .header-icon:hover {
//           transform: scale(1.05) rotate(5deg);
//           box-shadow: 0 15px 25px rgba(67, 97, 238, 0.4);
//         }

//         .header-text h2 {
//           font-size: 2rem;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -0.8px;
//           background: linear-gradient(90deg, #2d3748 0%, #4a5568 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .header-text p {
//           font-size: 1.1rem;
//           color: #718096;
//           font-weight: 500;
//           margin: 0;
//           max-width: 500px;
//         }

//         .insight-card .info-badge {
//         position: absolute;
//         bottom: 16px;
//         right: 16px;
//         width: 32px;
//         height: 32px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: rgba(113, 128, 150, 0.1);
//         border-radius: 50%;
//         color: #718096;
//         cursor: pointer;
//         transition: all 0.3s ease;
//         z-index: 3;
//         }

//         .insight-card .info-badge:hover {
//         background: rgba(79, 108, 255, 0.15);
//         color: #4f6cff;
//         }

//         .insight-card .badge-tooltip {
//             position: absolute;
//             bottom: 120%; /* Changed from bottom: 120% */
//             right: 0;
//             width: 240px;
//             padding: 12px 16px;
//             background: white;
//             border-radius: 12px;
//             box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
//             font-size: 0.85rem;
//             font-weight: 500;
//             color: #4a5568;
//             opacity: 0;
//             transform: translateY(10px); /* Changed to move upward initially */
//             transition: all 0.3s ease;
//             visibility: hidden;
//             z-index: 10;
//             border: 1px solid rgba(226, 232, 240, 0.8);
//             }

//         .insight-card .info-badge:hover .badge-tooltip {
//         opacity: 1;
//         transform: translateY(0); /* Smoothly moves to its final position */
//         visibility: visible;
//         }



//         .dashboard-insights {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 24px;
//           padding: 0 40px 30px;
//           position: relative;
//           z-index: 2;
//         }

//         .insight-card {
//           background: white;
//           border-radius: 20px;
//           padding: 24px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
//           position: relative;
//           overflow: hidden;
//           backdrop-filter: blur(10px);
//         }

//         .insight-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
//         }

//         .insight-card.traded {
//           background: linear-gradient(135deg, rgba(79, 108, 255, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.delivered {
//           background: linear-gradient(135deg, rgba(0, 217, 177, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.stats {
//           background: linear-gradient(135deg, rgba(113, 128, 150, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .card-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 20px;
//           font-size: 1.4rem;
//           color: white;
//         }

//         .traded .card-icon {
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           box-shadow: 0 8px 20px rgba(79, 108, 255, 0.3);
//         }

//         .delivered .card-icon {
//           background: linear-gradient(135deg, #00d9b1 0%, #00c9a1 100%);
//           box-shadow: 0 8px 20px rgba(0, 217, 177, 0.3);
//         }

//         .stats .card-icon {
//           background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
//           box-shadow: 0 8px 20px rgba(113, 128, 150, 0.3);
//         }

//         .card-content {
//           position: relative;
//           z-index: 2;
//         }

//         .card-value {
//           font-size: 32px;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -1px;
//         }

//         .card-label {
//           font-size: 15px;
//           color: #718096;
//           font-weight: 600;
//           margin-bottom: 16px;
//         }

//         .card-change {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 15px;
//           font-weight: 700;
//           padding: 6px 14px;
//           border-radius: 24px;
//         }

//         .card-change.positive {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .card-change.negative {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-stats {
//           display: flex;
//           gap: 12px;
//         }

//         .stat-item {
//           font-size: 13px;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 12px;
//         }

//         .stat-item.max {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .stat-item.min {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-wave {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 4px;
//           background: linear-gradient(90deg, #4f6cff, #00d9b1);
//           opacity: 0.8;
//         }

//         .traded .card-wave {
//           background: #4f6cff;
//         }

//         .delivered .card-wave {
//           background: #00d9b1;
//         }

//         .stats .card-wave {
//           background: #718096;
//         }

//         .dashboard-chart {
//           padding: 20px 40px 40px;
//           position: relative;
//           height: 500px;
//           background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0V0zm30 30h30v30H30V30z' fill='%23f0f7ff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
//         }

//         .dashboard-footer {
//           padding: 20px 40px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-top: 1px solid rgba(226, 232, 240, 0.4);
//           background: rgba(249, 252, 255, 0.7);
//         }

//         .footer-legend {
//           display: flex;
//           gap: 1.5rem;
//         }

//         .legend-item {
//           display: flex;
//           align-items: center;
//           gap: 0.8rem;
//           font-size: 0.95rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .legend-color {
//           width: 20px;
//           height: 20px;
//           border-radius: 6px;
//         }

//         .legend-color.traded {
//           background: linear-gradient(90deg, #4f6cff, #4361ee);
//           box-shadow: 0 2px 6px rgba(67, 97, 238, 0.3);
//         }

//         .legend-color.delivered {
//           background: linear-gradient(90deg, #00d9b1, #00c9a1);
//           box-shadow: 0 2px 6px rgba(0, 217, 177, 0.3);
//         }

//         .footer-timestamp {
//           font-size: 13px;
//           color: #718096;
//           font-weight: 500;
//         }

//         .premium-tooltip {
//           padding: 18px;
//           background: white;
//           border-radius: 14px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//           font-family: 'Inter', sans-serif;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//           min-width: 200px;
//           backdrop-filter: blur(10px);
//         }

//         .tooltip-header {
//           font-size: 14px;
//           font-weight: 700;
//           color: #4f6cff;
//           margin-bottom: 8px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .tooltip-value {
//           font-size: 26px;
//           font-weight: 800;
//           color: #1a202c;
//           letter-spacing: -0.5px;
//           margin: 8px 0;
//         }

//         .tooltip-date {
//           font-size: 13px;
//           font-weight: 500;
//           color: #718096;
//           padding-top: 6px;
//           border-top: 1px solid rgba(226, 232, 240, 0.6);
//         }

//         .loading-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 500px;
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 20px;
//           overflow: hidden;
//         }

//         .loading-spinner {
//           width: 70px;
//           height: 70px;
//           border: 6px solid rgba(79, 108, 255, 0.1);
//           border-top: 6px solid #4f6cff;
//           border-radius: 50%;
//           animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
//           margin-bottom: 2rem;
//         }

//         .loading-text {
//           font-size: 1.2rem;
//           font-weight: 500;
//           color: #4a5568;
//           letter-spacing: 0.3px;
//         }

//         .bar-animation {
//           transform-origin: center bottom;
//           transform: scaleY(0);
//           animation: bar-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }

//         .bar-label {
//           text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
//           opacity: 0;
//           animation: label-appear 0.3s ease-out forwards;
//           animation-delay: 0.4s;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         @keyframes bar-appear {
//           from {
//             transform: scaleY(0);
//             opacity: 0;
//           }
//           to {
//             transform: scaleY(1);
//             opacity: 1;
//           }
//         }

//         @keyframes label-appear {
//           from {
//             opacity: 0;
//             transform: translateY(5px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PublicTradingActivityPlot;


// import React, { useEffect, useState, useMemo } from 'react';
// import { ResponsiveBar } from '@nivo/bar';
// import { FaChartBar, FaInfoCircle, FaArrowUp, FaArrowDown, FaChartLine, FaPercentage, FaExchangeAlt } from 'react-icons/fa';
// import { useTooltip } from '@nivo/tooltip';

// const PublicTradingActivityPlot = ({ symbol }) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     setError(null);
//     fetch(`${API_BASE}/stocks/test/compute_public_trading_activity`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         // Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! Status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((json) => {
//         // Access the 'data' array and sort it
//         const sortedData = Array.isArray(json.data)
//           ? json.data.sort((a, b) => new Date(a.Date) - new Date(b.Date))
//           : [];
//         setData(sortedData);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching data:', err);
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, [symbol]); // Add 'symbol' to dependency array to refetch on symbol change

//   const insights = useMemo(() => {
//     if (data.length === 0) return null;

//     const latest = data[data.length - 1];
//     const previous = data.length > 1 ? data[data.length - 2] : null;

//     const avgTraded = data.reduce((sum, d) => sum + d.pct_public_traded, 0) / data.length;
//     const maxTraded = Math.max(...data.map((d) => d.pct_public_traded));
//     const minTraded = Math.min(...data.map((d) => d.pct_public_traded));

//     const tradedChange = previous
//       ? ((latest.pct_public_traded - previous.pct_public_traded) / previous.pct_public_traded) * 100
//       : 0;
//     const deliveredChange = previous
//       ? ((latest.pct_public_delivered - previous.pct_public_delivered) / previous.pct_public_delivered) * 100
//       : 0;

//     return {
//       latestTraded: latest.pct_public_traded,
//       latestDelivered: latest.pct_public_delivered,
//       avgTraded,
//       maxTraded,
//       minTraded,
//       tradedChange,
//       deliveredChange,
//     };
//   }, [data]);

//   const nivoData = useMemo(() => {
//     return data.map((d) => ({
//       date: d.Date,
//       '% Public Traded': d.pct_public_traded,
//       '% Public Delivered': d.pct_public_delivered,
//     }));
//   }, [data]);

//   const CustomBar = ({ bar }) => {
//     const { showTooltipFromEvent, hideTooltip } = useTooltip();
//     const fillColor = bar.data.id === '% Public Traded' ? 'url(#tradedGradient)' : 'url(#deliveredGradient)';

//     const tooltipContent = (
//       <div className="premium-tooltip">
//         <div className="tooltip-header">{bar.data.id}</div>
//         <div className="tooltip-value">{bar.data.value.toFixed(2)}%</div>
//         <div className="tooltip-date">{bar.data.indexValue}</div>
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
//           rx={6}
//           ry={6}
//           className="bar-animation"
//           style={{
//             animationDelay: `${bar.index * 30}ms`,
//           }}
//         />
//         {bar.height > 12 && (
//           <text
//             x={bar.width / 2}
//             y={-6}
//             textAnchor="middle"
//             fill="#ffffff"
//             fontSize={11}
//             fontWeight={600}
//             className="bar-label"
//           >
//             {bar.data.value.toFixed(1)}
//           </text>
//         )}
//       </g>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="premium-container">
//         <div className="premium-card loading-state">
//           <div className="loading-spinner"></div>
//           <div className="loading-text">Loading trading activity data...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="premium-container">
//         <div className="premium-card error-state">
//           <div className="error-text">Error: {error}</div>
//         </div>
//       </div>
//     );
//   }

//   if (!insights) {
//     return (
//       <div className="premium-container">
//         <div className="premium-card no-data-state">
//           <div className="no-data-text">No trading activity data available for {symbol}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="premium-container">
//       <div className="premium-dashboard">
//         <div className="dashboard-header">
//           <div className="header-content">
//             <div className="header-icon">
//               <FaChartBar />
//             </div>
//             <div className="header-text">
//               <h2>Public Trading Activity - {symbol}</h2>
//               <p>Percentage of Public Shares Traded vs. Delivered</p>
//             </div>
//           </div>
//         </div>

//         <div className="dashboard-insights">
//           <div className="insight-card traded">
//             <div className="card-icon">
//               <FaPercentage />
//             </div>
//             <div className="card-content">
//               <div className="card-value">{insights.latestTraded.toFixed(2)}%</div>
//               <div className="card-label">Current Traded</div>
//               <div className={`card-change ${insights.tradedChange >= 0 ? 'positive' : 'negative'}`}>
//                 {insights.tradedChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
//                 {Math.abs(insights.tradedChange).toFixed(2)}%
//               </div>
//             </div>
//             <div className="info-badge">
//               <FaInfoCircle />
//               <span className="badge-tooltip">
//                 The percentage of publicly available shares that were traded on the most recent trading day.
//               </span>
//             </div>
//             <div className="card-wave"></div>
//           </div>

//           <div className="insight-card delivered">
//             <div className="card-icon">
//               <FaExchangeAlt />
//             </div>
//             <div className="card-content">
//               <div className="card-value">{insights.latestDelivered.toFixed(2)}%</div>
//               <div className="card-label">Current Delivered</div>
//               <div className={`card-change ${insights.deliveredChange >= 0 ? 'positive' : 'negative'}`}>
//                 {insights.deliveredChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
//                 {Math.abs(insights.deliveredChange).toFixed(2)}%
//               </div>
//             </div>
//             <div className="info-badge">
//               <FaInfoCircle />
//               <span className="badge-tooltip">
//                 The percentage of publicly traded shares that were actually delivered (settled) on the most recent day.
//               </span>
//             </div>
//             <div className="card-wave"></div>
//           </div>

//           <div className="insight-card stats">
//             <div className="card-icon">
//               <FaChartLine />
//             </div>
//             <div className="card-content">
//               <div className="card-value">{insights.avgTraded.toFixed(2)}%</div>
//               <div className="card-label">Average Traded</div>
//               <div className="card-stats">
//                 <div className="stat-item max">↑ {insights.maxTraded.toFixed(2)}%</div>
//                 <div className="stat-item min">↓ {insights.minTraded.toFixed(2)}%</div>
//               </div>
//             </div>
//             <div className="info-badge">
//               <FaInfoCircle />
//               <span className="badge-tooltip">
//                 The average percentage of public shares traded over the last 30 days.
//               </span>
//             </div>
//             <div className="card-wave"></div>
//           </div>
//         </div>

//         <div className="dashboard-chart">
//           <svg width="0" height="0">
//             <defs>
//               <linearGradient id="tradedGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#4f6cff" />
//                 <stop offset="100%" stopColor="#4361ee" />
//               </linearGradient>
//               <linearGradient id="deliveredGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#00d9b1" />
//                 <stop offset="100%" stopColor="#00c9a1" />
//               </linearGradient>
//             </defs>
//           </svg>
//           <ResponsiveBar
//             data={nivoData}
//             keys={['% Public Traded', '% Public Delivered']}
//             indexBy="date"
//             margin={{ top: 20, right: 30, bottom: 120, left: 60 }}
//             padding={0.3}
//             groupMode="grouped"
//             colors={({ id }) =>
//               id === '% Public Traded' ? 'url(#tradedGradient)' : 'url(#deliveredGradient)'
//             }
//             theme={{
//               textColor: '#4a5568',
//               fontSize: 12,
//               fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//               axis: {
//                 ticks: {
//                   line: {
//                     stroke: '#e2e8f0',
//                     strokeWidth: 1,
//                   },
//                   text: {
//                     fill: '#718096',
//                     fontSize: 11,
//                     fontWeight: 500,
//                   },
//                 },
//                 legend: {
//                   text: {
//                     fill: '#2d3748',
//                     fontSize: 13,
//                     fontWeight: 600,
//                     letterSpacing: '0.3px',
//                   },
//                 },
//                 domain: {
//                   line: {
//                     stroke: '#e2e8f0',
//                     strokeWidth: 2,
//                   },
//                 },
//               },
//               grid: {
//                 line: {
//                   stroke: '#edf2f7',
//                   strokeDasharray: '3 4',
//                 },
//               },
//               legends: {
//                 text: {
//                   fill: '#2d3748',
//                   fontSize: 12,
//                   fontWeight: 600,
//                 },
//               },
//               tooltip: {
//                 container: {
//                   display: 'none',
//                 },
//               },
//             }}
//             axisBottom={{
//               tickRotation: -45,
//               legend: 'Date',
//               legendPosition: 'middle',
//               legendOffset: 100,
//               renderTick: (tick) => (
//                 <g transform={`translate(${tick.x},${tick.y + 10})`}>
//                   <text
//                     textAnchor="end"
//                     dominantBaseline="middle"
//                     transform="rotate(-45)"
//                     style={{
//                       fontSize: 11,
//                       fill: '#4a5568',
//                       fontFamily: "'Inter', sans-serif",
//                       fontWeight: 500,
//                     }}
//                   >
//                     {tick.value}
//                   </text>
//                 </g>
//               ),
//             }}
//             axisLeft={{
//               legend: '% of Public Shares',
//               legendPosition: 'middle',
//               legendOffset: -50,
//               format: (v) => `${v.toFixed(0)}%`,
//               tickValues: 5,
//             }}
//             enableLabel={false}
//             barComponent={CustomBar}
//             role="application"
//             ariaLabel="Public Trading Activity Bar Chart"
//             animate={true}
//             motionConfig="gentle"
//             motionStiffness={90}
//             motionDamping={15}
//           />
//         </div>

//         <div className="dashboard-footer">
//           <div className="footer-legend">
//             <div className="legend-item">
//               <div className="legend-color traded"></div>
//               <span>% Public Traded</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color delivered"></div>
//               <span>% Public Delivered</span>
//             </div>
//           </div>
//         </div>
//       </div>

//             <style jsx>{`
//         .premium-container {
//           width: 98vw;
//           max-width: 1400px;
//           margin: 24px auto;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//         }

//         .premium-dashboard {
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 24px;
//           overflow: hidden;
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.1);
//           position: relative;
//           z-index: 1;
//         }

//         .premium-dashboard::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 180px;
//           background: linear-gradient(120deg, #f9fcff 0%, #f0f7ff 100%);
//           z-index: -1;
//         }

//         .dashboard-header {
//           padding: 32px 40px 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           position: relative;
//         }

//         .header-content {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           z-index: 1;
//         }

//         .header-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 60px;
//           height: 60px;
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           border-radius: 18px;
//           color: white;
//           font-size: 1.8rem;
//           box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
//           transition: all 0.3s ease;
//         }

//         .header-icon:hover {
//           transform: scale(1.05) rotate(5deg);
//           box-shadow: 0 15px 25px rgba(67, 97, 238, 0.4);
//         }

//         .header-text h2 {
//           font-size: 2rem;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -0.8px;
//           background: linear-gradient(90deg, #2d3748 0%, #4a5568 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .header-text p {
//           font-size: 1.1rem;
//           color: #718096;
//           font-weight: 500;
//           margin: 0;
//           max-width: 500px;
//         }

//         .insight-card .info-badge {
//         position: absolute;
//         bottom: 16px;
//         right: 16px;
//         width: 32px;
//         height: 32px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: rgba(113, 128, 150, 0.1);
//         border-radius: 50%;
//         color: #718096;
//         cursor: pointer;
//         transition: all 0.3s ease;
//         z-index: 3;
//         }

//         .insight-card .info-badge:hover {
//         background: rgba(79, 108, 255, 0.15);
//         color: #4f6cff;
//         }

//         .insight-card .badge-tooltip {
//             position: absolute;
//             bottom: 120%; /* Changed from bottom: 120% */
//             right: 0;
//             width: 240px;
//             padding: 12px 16px;
//             background: white;
//             border-radius: 12px;
//             box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
//             font-size: 0.85rem;
//             font-weight: 500;
//             color: #4a5568;
//             opacity: 0;
//             transform: translateY(10px); /* Changed to move upward initially */
//             transition: all 0.3s ease;
//             visibility: hidden;
//             z-index: 10;
//             border: 1px solid rgba(226, 232, 240, 0.8);
//             }

//         .insight-card .info-badge:hover .badge-tooltip {
//         opacity: 1;
//         transform: translateY(0); /* Smoothly moves to its final position */
//         visibility: visible;
//         }



//         .dashboard-insights {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 24px;
//           padding: 0 40px 30px;
//           position: relative;
//           z-index: 2;
//         }

//         .insight-card {
//           background: white;
//           border-radius: 20px;
//           padding: 24px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
//           position: relative;
//           overflow: hidden;
//           backdrop-filter: blur(10px);
//         }

//         .insight-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
//         }

//         .insight-card.traded {
//           background: linear-gradient(135deg, rgba(79, 108, 255, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.delivered {
//           background: linear-gradient(135deg, rgba(0, 217, 177, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.stats {
//           background: linear-gradient(135deg, rgba(113, 128, 150, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .card-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 20px;
//           font-size: 1.4rem;
//           color: white;
//         }

//         .traded .card-icon {
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           box-shadow: 0 8px 20px rgba(79, 108, 255, 0.3);
//         }

//         .delivered .card-icon {
//           background: linear-gradient(135deg, #00d9b1 0%, #00c9a1 100%);
//           box-shadow: 0 8px 20px rgba(0, 217, 177, 0.3);
//         }

//         .stats .card-icon {
//           background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
//           box-shadow: 0 8px 20px rgba(113, 128, 150, 0.3);
//         }

//         .card-content {
//           position: relative;
//           z-index: 2;
//         }

//         .card-value {
//           font-size: 32px;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -1px;
//         }

//         .card-label {
//           font-size: 15px;
//           color: #718096;
//           font-weight: 600;
//           margin-bottom: 16px;
//         }

//         .card-change {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 15px;
//           font-weight: 700;
//           padding: 6px 14px;
//           border-radius: 24px;
//         }

//         .card-change.positive {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .card-change.negative {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-stats {
//           display: flex;
//           gap: 12px;
//         }

//         .stat-item {
//           font-size: 13px;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 12px;
//         }

//         .stat-item.max {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .stat-item.min {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-wave {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 4px;
//           background: linear-gradient(90deg, #4f6cff, #00d9b1);
//           opacity: 0.8;
//         }

//         .traded .card-wave {
//           background: #4f6cff;
//         }

//         .delivered .card-wave {
//           background: #00d9b1;
//         }

//         .stats .card-wave {
//           background: #718096;
//         }

//         .dashboard-chart {
//           padding: 20px 40px 40px;
//           position: relative;
//           height: 500px;
//           background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0V0zm30 30h30v30H30V30z' fill='%23f0f7ff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
//         }

//         .dashboard-footer {
//           padding: 20px 40px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-top: 1px solid rgba(226, 232, 240, 0.4);
//           background: rgba(249, 252, 255, 0.7);
//         }

//         .footer-legend {
//           display: flex;
//           gap: 1.5rem;
//         }

//         .legend-item {
//           display: flex;
//           align-items: center;
//           gap: 0.8rem;
//           font-size: 0.95rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .legend-color {
//           width: 20px;
//           height: 20px;
//           border-radius: 6px;
//         }

//         .legend-color.traded {
//           background: linear-gradient(90deg, #4f6cff, #4361ee);
//           box-shadow: 0 2px 6px rgba(67, 97, 238, 0.3);
//         }

//         .legend-color.delivered {
//           background: linear-gradient(90deg, #00d9b1, #00c9a1);
//           box-shadow: 0 2px 6px rgba(0, 217, 177, 0.3);
//         }

//         .footer-timestamp {
//           font-size: 13px;
//           color: #718096;
//           font-weight: 500;
//         }

//         .premium-tooltip {
//           padding: 18px;
//           background: white;
//           border-radius: 14px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//           font-family: 'Inter', sans-serif;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//           min-width: 200px;
//           backdrop-filter: blur(10px);
//         }

//         .tooltip-header {
//           font-size: 14px;
//           font-weight: 700;
//           color: #4f6cff;
//           margin-bottom: 8px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .tooltip-value {
//           font-size: 26px;
//           font-weight: 800;
//           color: #1a202c;
//           letter-spacing: -0.5px;
//           margin: 8px 0;
//         }

//         .tooltip-date {
//           font-size: 13px;
//           font-weight: 500;
//           color: #718096;
//           padding-top: 6px;
//           border-top: 1px solid rgba(226, 232, 240, 0.6);
//         }

//         .loading-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 500px;
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 20px;
//           overflow: hidden;
//         }

//         .loading-spinner {
//           width: 70px;
//           height: 70px;
//           border: 6px solid rgba(79, 108, 255, 0.1);
//           border-top: 6px solid #4f6cff;
//           border-radius: 50%;
//           animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
//           margin-bottom: 2rem;
//         }

//         .loading-text {
//           font-size: 1.2rem;
//           font-weight: 500;
//           color: #4a5568;
//           letter-spacing: 0.3px;
//         }

//         .bar-animation {
//           transform-origin: center bottom;
//           transform: scaleY(0);
//           animation: bar-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }

//         .bar-label {
//           text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
//           opacity: 0;
//           animation: label-appear 0.3s ease-out forwards;
//           animation-delay: 0.4s;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         @keyframes bar-appear {
//           from {
//             transform: scaleY(0);
//             opacity: 0;
//           }
//           to {
//             transform: scaleY(1);
//             opacity: 1;
//           }
//         }

//         @keyframes label-appear {
//           from {
//             opacity: 0;
//             transform: translateY(5px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>

//       {/* <style jsx>{`
//         .premium-container {
//           width: 98vw;
//           max-width: 1400px;
//           margin: 24px auto;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//         }

//         .premium-dashboard {
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 24px;
//           overflow: hidden;
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.1);
//           position: relative;
//           z-index: 1;
//         }

//         .premium-dashboard::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 180px;
//           background: linear-gradient(120deg, #f9fcff 0%, #f0f7ff 100%);
//           z-index: -1;
//         }

//         .dashboard-header {
//           padding: 32px 40px 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           position: relative;
//         }

//         .header-content {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           z-index: 1;
//         }

//         .header-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 60px;
//           height: 60px;
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           border-radius: 18px;
//           color: white;
//           font-size: 1.8rem;
//           box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
//           transition: all 0.3s ease;
//         }

//         .header-icon:hover {
//           transform: scale(1.05) rotate(5deg);
//           box-shadow: 0 15px 25px rgba(67, 97, 238, 0.4);
//         }

//         .header-text h2 {
//           font-size: 2rem;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -0.8px;
//           background: linear-gradient(90deg, #2d3748 0%, #4a5568 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .header-text p {
//           font-size: 1.1rem;
//           color: #718096;
//           font-weight: 500;
//           margin: 0;
//           max-width: 500px;
//         }

//         .insight-card .info-badge {
//           position: absolute;
//           bottom: 16px;
//           right: 16px;
//           width: 32px;
//           height: 32px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: rgba(113, 128, 150, 0.1);
//           border-radius: 50%;
//           color: #718096;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           z-index: 3;
//         }

//         .insight-card .info-badge:hover {
//           background: rgba(79, 108, 255, 0.15);
//           color: #4f6cff;
//         }

//         .insight-card .badge-tooltip {
//           position: absolute;
//           bottom: 120%;
//           right: 0;
//           width: 240px;
//           padding: 12px 16px;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
//           font-size: 0.85rem;
//           font-weight: 500;
//           color: #4a5568;
//           opacity: 0;
//           transform: translateY(10px);
//           transition: all 0.3s ease;
//           visibility: hidden;
//           z-index: 10;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//         }

//         .insight-card .info-badge:hover .badge-tooltip {
//           opacity: 1;
//           transform: translateY(0);
//           visibility: visible;
//         }

//         .dashboard-insights {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 24px;
//           padding: 0 40px 30px;
//           position: relative;
//           z-index: 2;
//         }

//         .insight-card {
//           background: white;
//           border-radius: 20px;
//           padding: 24px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
//           position: relative;
//           overflow: hidden;
//           backdrop-filter: blur(10px);
//         }

//         .insight-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
//         }

//         .insight-card.traded {
//           background: linear-gradient(135deg, rgba(79, 108, 255, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.delivered {
//           background: linear-gradient(135deg, rgba(0, 217, 177, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.stats {
//           background: linear-gradient(135deg, rgba(113, 128, 150, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .card-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 20px;
//           font-size: 1.4rem;
//           color: white;
//         }

//         .traded .card-icon {
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           box-shadow: 0 8px 20px rgba(79, 108, 255, 0.3);
//         }

//         .delivered .card-icon {
//           background: linear-gradient(135deg, #00d9b1 0%, #00c9a1 100%);
//           box-shadow: 0 8px 20px rgba(0, 217, 177, 0.3);
//         }

//         .stats .card-icon {
//           background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
//           box-shadow: 0 8px 20px rgba(113, 128, 150, 0.3);
//         }

//         .card-content {
//           position: relative;
//           z-index: 2;
//         }

//         .card-value {
//           font-size: 32px;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -1px;
//         }

//         .card-label {
//           font-size: 15px;
//           color: #718096;
//           font-weight: 600;
//           margin-bottom: 16px;
//         }

//         .card-change {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 15px;
//           font-weight: 700;
//           padding: 6px 14px;
//           border-radius: 24px;
//         }

//         .card-change.positive {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .card-change.negative {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-stats {
//           display: flex;
//           gap: 12px;
//         }

//         .stat-item {
//           font-size: 13px;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 12px;
//         }

//         .stat-item.max {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .stat-item.min {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-wave {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 4px;
//           background: linear-gradient(90deg, #4f6cff, #00d9b1);
//           opacity: 0.8;
//         }

//         .traded .card-wave {
//           background: #4f6cff;
//         }

//         .delivered .card-wave {
//           background: #00d9b1;
//         }

//         .stats .card-wave {
//           background: #718096;
//         }

//         .dashboard-chart {
//           padding: 20px 40px 40px;
//           position: relative;
//           height: 500px;
//           background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0V0zm30 30h30v30H30V30z' fill='%23f0f7ff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
//         }

//         .dashboard-footer {
//           padding: 20px 40px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-top: 1px solid rgba(226, 232, 240, 0.4);
//           background: rgba(249, 252, 255, 0.7);
//         }

//         .footer-legend {
//           display: flex;
//           gap: 1.5rem;
//         }

//         .legend-item {
//           display: flex;
//           align-items: center;
//           gap: 0.8rem;
//           font-size: 0.95rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .legend-color {
//           width: 20px;
//           height: 20px;
//           border-radius: 6px;
//         }

//         .legend-color.traded {
//           background: linear-gradient(90deg, #4f6cff, #4361ee);
//           box-shadow: 0 2px 6px rgba(67, 97, 238, 0.3);
//         }

//         .legend-color.delivered {
//           background: linear-gradient(90deg, #00d9b1, #00c9a1);
//           box-shadow: 0 2px 6px rgba(0, 217, 177, 0.3);
//         }

//         .footer-timestamp {
//           font-size: 13px;
//           color: #718096;
//           font-weight: 500;
//         }

//         .premium-tooltip {
//           padding: 18px;
//           background: white;
//           border-radius: 14px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//           font-family: 'Inter', sans-serif;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//           min-width: 200px;
//           backdrop-filter: blur(10px);
//         }

//         .tooltip-header {
//           font-size: 14px;
//           font-weight: 700;
//           color: #4f6cff;
//           margin-bottom: 8px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .tooltip-value {
//           font-size: 26px;
//           font-weight: 800;
//           color: #1a202c;
//           letter-spacing: -0.5px;
//           margin: 8px 0;
//         }

//         .tooltip-date {
//           font-size: 13px;
//           font-weight: 500;
//           color: #718096;
//           padding-top: 6px;
//           border-top: 1px solid rgba(226, 232, 240, 0.6);
//         }

//         .loading-state,
//         .error-state,
//         .no-data-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 500px;
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 20px;
//           overflow: hidden;
//         }

//         .loading-spinner {
//           width: 70px;
//           height: 70px;
//           border: 6px solid rgba(79, 108, 255, 0.1);
//           border-top: 6px solid #4f6cff;
//           border-radius: 50%;
//           animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
//           margin-bottom: 2rem;
//         }

//         .loading-text,
//         .error-text,
//         .no-data-text {
//           font-size: 1.2rem;
//           font-weight: 500;
//           color: #4a5568;
//           letter-spacing: 0.3px;
//         }

//         .bar-animation {
//           transform-origin: center bottom;
//           transform: scaleY(0);
//           animation: bar-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }

//         .bar-label {
//           text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
//           opacity: 0;
//           animation: label-appear 0.3s ease-out forwards;
//           animation-delay: 0.4s;
//         }

//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         @keyframes bar-appear {
//           from {
//             transform: scaleY(0);
//             opacity: 0;
//           }
//           to {
//             transform: scaleY(1);
//             opacity: 1;
//           }
//         }

//         @keyframes label-appear {
//           from {
//             opacity: 0;
//             transform: translateY(5px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style> */}
//     </div>
//   );
// };

// export default PublicTradingActivityPlot;

//Shreya Code

// import React, { useEffect, useState, useMemo } from 'react';
// import { ResponsiveBar } from '@nivo/bar';
// import { FaChartBar, FaInfoCircle, FaArrowUp, FaArrowDown, FaChartLine, FaPercentage, FaExchangeAlt } from 'react-icons/fa';
// import { useTooltip } from '@nivo/tooltip';
// import RatingSystem from '../RatingFile/RatingSystem';

// const PublicTradingActivityPlot = ({ symbol }) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     setError(null);
//     fetch(`${API_BASE}/stocks/test/compute_public_trading_activity`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         // Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! Status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((json) => {
//         // Access the 'data' array and sort it
//         const sortedData = Array.isArray(json.data)
//           ? json.data.sort((a, b) => new Date(a.Date) - new Date(b.Date))
//           : [];
//         setData(sortedData);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching data:', err);
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, [symbol]); // Add 'symbol' to dependency array to refetch on symbol change

//   const insights = useMemo(() => {
//     if (data.length === 0) return null;

//     const latest = data[data.length - 1];
//     const previous = data.length > 1 ? data[data.length - 2] : null;

//     const avgTraded = data.reduce((sum, d) => sum + d.pct_public_traded, 0) / data.length;
//     const maxTraded = Math.max(...data.map((d) => d.pct_public_traded));
//     const minTraded = Math.min(...data.map((d) => d.pct_public_traded));

//     const tradedChange = previous
//       ? ((latest.pct_public_traded - previous.pct_public_traded) / previous.pct_public_traded) * 100
//       : 0;
//     const deliveredChange = previous
//       ? ((latest.pct_public_delivered - previous.pct_public_delivered) / previous.pct_public_delivered) * 100
//       : 0;

//     return {
//       latestTraded: latest.pct_public_traded,
//       latestDelivered: latest.pct_public_delivered,
//       avgTraded,
//       maxTraded,
//       minTraded,
//       tradedChange,
//       deliveredChange,
//     };
//   }, [data]);

//   const nivoData = useMemo(() => {
//     return data.map((d) => ({
//       date: d.Date,
//       '% Public Traded': d.pct_public_traded,
//       '% Public Delivered': d.pct_public_delivered,
//     }));
//   }, [data]);

//   const CustomBar = ({ bar }) => {
//     const { showTooltipFromEvent, hideTooltip } = useTooltip();
//     const fillColor = bar.data.id === '% Public Traded' ? 'url(#tradedGradient)' : 'url(#deliveredGradient)';

//     const tooltipContent = (
//       <div className="premium-tooltip">
//         <div className="tooltip-header">{bar.data.id}</div>
//         <div className="tooltip-value">{bar.data.value.toFixed(2)}%</div>
//         <div className="tooltip-date">{bar.data.indexValue}</div>
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
//           rx={6}
//           ry={6}
//         // className="bar-animation"
//         // style={{
//         //   animationDelay: `${bar.index * 30}ms`,
//         // }}
//         />
//         {bar.height > 12 && (
//           <text
//             x={bar.width / 2}
//             y={-6}
//             textAnchor="middle"
//             fill="#ffffff"
//             fontSize={11}
//             fontWeight={600}
//             className="bar-label"
//           >
//             {bar.data.value.toFixed(1)}
//           </text>
//         )}
//       </g>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="premium-container">
//         <div className="premium-card loading-state">
//           <div className="loading-spinner"></div>
//           <div className="loading-text">Loading trading activity data...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="premium-container">
//         <div className="premium-card error-state">
//           <div className="error-text">Error: {error}</div>
//         </div>
//       </div>
//     );
//   }

//   if (!insights) {
//     return (
//       <div className="premium-container">
//         <div className="premium-card no-data-state">
//           <div className="no-data-text">No trading activity data available for {symbol}</div>
//         </div>
//       </div>
//     );
//   }

//   const handleRatingUpdate = (newRating) => {
//     console.log(`New rating for ${symbol} trading activity:`, newRating);
//     // Here you can send the new rating to your backend or analytics service
//   }

//   return (
//     <div className="premium-container">
//       <div className="premium-dashboard">
//         <div className="dashboard-header">
//           <div className="header-content">
//             <div className="header-icon">
//               <FaChartBar />
//             </div>
//             <div className="header-text">
//               <h2>Public Trading Activity - {symbol}</h2>
//               <p>Percentage of Public Shares Traded vs. Delivered</p>
//             </div>
//           </div>
//         </div>


//         {/* Reusable Rating Component */}
//         <div className="flex items-center justify-end pb-4 border-b border-gray-200">
//           <div className="text-right">
//             {/* <p className="text-sm font-medium text-gray-700 mb-2"></p> */}
//             <RatingSystem
//               plotType="compute_public_trading_activity"
//               onRatingUpdate={handleRatingUpdate}
//             />
//           </div>
//         </div>
//         <div className="dashboard-insights">
//           <div className="insight-card traded">
//             <div className="card-icon">
//               <FaPercentage />
//             </div>
//             <div className="card-content">
//               <div className="card-value">{insights.latestTraded.toFixed(2)}%</div>
//               <div className="card-label">Current Traded</div>
//               <div className={`card-change ${insights.tradedChange >= 0 ? 'positive' : 'negative'}`}>
//                 {insights.tradedChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
//                 {Math.abs(insights.tradedChange).toFixed(2)}%
//               </div>
//             </div>
//             <div className="info-badge">
//               <FaInfoCircle />
//               <span className="badge-tooltip">
//                 The percentage of publicly available shares that were traded on the most recent trading day.
//               </span>
//             </div>
//             <div className="card-wave"></div>
//           </div>

//           <div className="insight-card delivered">
//             <div className="card-icon">
//               <FaExchangeAlt />
//             </div>
//             <div className="card-content">
//               <div className="card-value">{insights.latestDelivered.toFixed(2)}%</div>
//               <div className="card-label">Current Delivered</div>
//               <div className={`card-change ${insights.deliveredChange >= 0 ? 'positive' : 'negative'}`}>
//                 {insights.deliveredChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
//                 {Math.abs(insights.deliveredChange).toFixed(2)}%
//               </div>
//             </div>
//             <div className="info-badge">
//               <FaInfoCircle />
//               <span className="badge-tooltip">
//                 The percentage of publicly traded shares that were actually delivered (settled) on the most recent day.
//               </span>
//             </div>
//             <div className="card-wave"></div>
//           </div>

//           <div className="insight-card stats">
//             <div className="card-icon">
//               <FaChartLine />
//             </div>
//             <div className="card-content">
//               <div className="card-value">{insights.avgTraded.toFixed(2)}%</div>
//               <div className="card-label">Average Traded</div>
//               <div className="card-stats">
//                 <div className="stat-item max">↑ {insights.maxTraded.toFixed(2)}%</div>
//                 <div className="stat-item min">↓ {insights.minTraded.toFixed(2)}%</div>
//               </div>
//             </div>
//             <div className="info-badge">
//               <FaInfoCircle />
//               <span className="badge-tooltip">
//                 The average percentage of public shares traded over the last 30 days.
//               </span>
//             </div>
//             <div className="card-wave"></div>
//           </div>
//         </div>

//         <div className="dashboard-chart">
//           <svg width="0" height="0">
//             <defs>
//               <linearGradient id="tradedGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#4f6cff" />
//                 <stop offset="100%" stopColor="#4361ee" />
//               </linearGradient>
//               <linearGradient id="deliveredGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#00d9b1" />
//                 <stop offset="100%" stopColor="#00c9a1" />
//               </linearGradient>
//             </defs>
//           </svg>
//           <ResponsiveBar
//             data={nivoData}
//             keys={['% Public Traded', '% Public Delivered']}
//             indexBy="date"
//             margin={{ top: 20, right: 30, bottom: 120, left: 60 }}
//             padding={0.3}
//             groupMode="grouped"
//             colors={({ id }) =>
//               id === '% Public Traded' ? 'url(#tradedGradient)' : 'url(#deliveredGradient)'
//             }
//             theme={{
//               textColor: '#4a5568',
//               fontSize: 12,
//               fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//               axis: {
//                 ticks: {
//                   line: {
//                     stroke: '#e2e8f0',
//                     strokeWidth: 1,
//                   },
//                   text: {
//                     fill: '#718096',
//                     fontSize: 11,
//                     fontWeight: 500,
//                   },
//                 },
//                 legend: {
//                   text: {
//                     fill: '#2d3748',
//                     fontSize: 13,
//                     fontWeight: 600,
//                     letterSpacing: '0.3px',
//                   },
//                 },
//                 domain: {
//                   line: {
//                     stroke: '#e2e8f0',
//                     strokeWidth: 2,
//                   },
//                 },
//               },
//               grid: {
//                 line: {
//                   stroke: '#edf2f7',
//                   strokeDasharray: '3 4',
//                 },
//               },
//               legends: {
//                 text: {
//                   fill: '#2d3748',
//                   fontSize: 12,
//                   fontWeight: 600,
//                 },
//               },
//               tooltip: {
//                 container: {
//                   display: 'none',
//                 },
//               },
//             }}
//             axisBottom={{
//               tickRotation: -45,
//               legend: 'Date',
//               legendPosition: 'middle',
//               legendOffset: 100,
//               renderTick: (tick) => (
//                 <g transform={`translate(${tick.x},${tick.y + 10})`}>
//                   <text
//                     textAnchor="end"
//                     dominantBaseline="middle"
//                     transform="rotate(-45)"
//                     style={{
//                       fontSize: 11,
//                       fill: '#4a5568',
//                       fontFamily: "'Inter', sans-serif",
//                       fontWeight: 500,
//                     }}
//                   >
//                     {tick.value}
//                   </text>
//                 </g>
//               ),
//             }}
//             axisLeft={{
//               legend: '% of Public Shares',
//               legendPosition: 'middle',
//               legendOffset: -50,
//               format: (v) => `${v.toFixed(0)}%`,
//               tickValues: 5,
//             }}
//             enableLabel={false}
//             barComponent={CustomBar}
//             role="application"
//             ariaLabel="Public Trading Activity Bar Chart"
//             animate={true}
//             motionConfig="gentle"
//             motionStiffness={90}
//             motionDamping={15}
//           />
//         </div>

//         <div className="dashboard-footer">
//           <div className="footer-legend">
//             <div className="legend-item">
//               <div className="legend-color traded"></div>
//               <span>% Public Traded</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color delivered"></div>
//               <span>% Public Delivered</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .premium-container {
//           width: 98vw;
//           max-width: 1400px;
//           margin: 24px auto;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//         }

//         .premium-dashboard {
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 24px;
//           overflow: hidden;
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.1);
//           position: relative;
//           z-index: 1;
//         }

//         .premium-dashboard::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 180px;
//           background: linear-gradient(120deg, #f9fcff 0%, #f0f7ff 100%);
//           z-index: -1;
//         }

//         .dashboard-header {
//           padding: 32px 40px 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           position: relative;
//         }

//         .header-content {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           z-index: 1;
//         }

//         .header-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 60px;
//           height: 60px;
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           border-radius: 18px;
//           color: white;
//           font-size: 1.8rem;
//           box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
//           transition: all 0.3s ease;
//         }

//         .header-icon:hover {
//           transform: scale(1.05) rotate(5deg);
//           box-shadow: 0 15px 25px rgba(67, 97, 238, 0.4);
//         }

//         .header-text h2 {
//           font-size: 2rem;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -0.8px;
//           background: linear-gradient(90deg, #2d3748 0%, #4a5568 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .header-text p {
//           font-size: 1.1rem;
//           color: #718096;
//           font-weight: 500;
//           margin: 0;
//           max-width: 500px;
//         }

//         .insight-card .info-badge {
//         position: absolute;
//         bottom: 16px;
//         right: 16px;
//         width: 32px;
//         height: 32px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: rgba(113, 128, 150, 0.1);
//         border-radius: 50%;
//         color: #718096;
//         cursor: pointer;
//         transition: all 0.3s ease;
//         z-index: 3;
//         }

//         .insight-card .info-badge:hover {
//         background: rgba(79, 108, 255, 0.15);
//         color: #4f6cff;
//         }

//         .insight-card .badge-tooltip {
//             position: absolute;
//             bottom: 120%; /* Changed from bottom: 120% */
//             right: 0;
//             width: 240px;
//             padding: 12px 16px;
//             background: white;
//             border-radius: 12px;
//             box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
//             font-size: 0.85rem;
//             font-weight: 500;
//             color: #4a5568;
//             opacity: 0;
//             transform: translateY(10px); /* Changed to move upward initially */
//             transition: all 0.3s ease;
//             visibility: hidden;
//             z-index: 10;
//             border: 1px solid rgba(226, 232, 240, 0.8);
//             }

//         .insight-card .info-badge:hover .badge-tooltip {
//         opacity: 1;
//         transform: translateY(0); /* Smoothly moves to its final position */
//         visibility: visible;
//         }



//         .dashboard-insights {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 24px;
//           padding: 0 40px 30px;
//           position: relative;
//           z-index: 2;
//         }

//         .insight-card {
//           background: white;
//           border-radius: 20px;
//           padding: 24px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
//           position: relative;
//           overflow: hidden;
//           backdrop-filter: blur(10px);
//         }

//         .insight-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
//         }

//         .insight-card.traded {
//           background: linear-gradient(135deg, rgba(79, 108, 255, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.delivered {
//           background: linear-gradient(135deg, rgba(0, 217, 177, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.stats {
//           background: linear-gradient(135deg, rgba(113, 128, 150, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .card-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 20px;
//           font-size: 1.4rem;
//           color: white;
//         }

//         .traded .card-icon {
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           box-shadow: 0 8px 20px rgba(79, 108, 255, 0.3);
//         }

//         .delivered .card-icon {
//           background: linear-gradient(135deg, #00d9b1 0%, #00c9a1 100%);
//           box-shadow: 0 8px 20px rgba(0, 217, 177, 0.3);
//         }

//         .stats .card-icon {
//           background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
//           box-shadow: 0 8px 20px rgba(113, 128, 150, 0.3);
//         }

//         .card-content {
//           position: relative;
//           z-index: 2;
//         }

//         .card-value {
//           font-size: 32px;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -1px;
//         }

//         .card-label {
//           font-size: 15px;
//           color: #718096;
//           font-weight: 600;
//           margin-bottom: 16px;
//         }

//         .card-change {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 15px;
//           font-weight: 700;
//           padding: 6px 14px;
//           border-radius: 24px;
//         }

//         .card-change.positive {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .card-change.negative {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-stats {
//           display: flex;
//           gap: 12px;
//         }

//         .stat-item {
//           font-size: 13px;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 12px;
//         }

//         .stat-item.max {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .stat-item.min {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-wave {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 4px;
//           background: linear-gradient(90deg, #4f6cff, #00d9b1);
//           opacity: 0.8;
//         }

//         .traded .card-wave {
//           background: #4f6cff;
//         }

//         .delivered .card-wave {
//           background: #00d9b1;
//         }

//         .stats .card-wave {
//           background: #718096;
//         }

//         .dashboard-chart {
//           padding: 20px 40px 40px;
//           position: relative;
//           height: 500px;
//           background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0V0zm30 30h30v30H30V30z' fill='%23f0f7ff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
//         }

//         .dashboard-footer {
//           padding: 20px 40px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-top: 1px solid rgba(226, 232, 240, 0.4);
//           background: rgba(249, 252, 255, 0.7);
//         }

//         .footer-legend {
//           display: flex;
//           gap: 1.5rem;
//         }

//         .legend-item {
//           display: flex;
//           align-items: center;
//           gap: 0.8rem;
//           font-size: 0.95rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .legend-color {
//           width: 20px;
//           height: 20px;
//           border-radius: 6px;
//         }

//         .legend-color.traded {
//           background: linear-gradient(90deg, #4f6cff, #4361ee);
//           box-shadow: 0 2px 6px rgba(67, 97, 238, 0.3);
//         }

//         .legend-color.delivered {
//           background: linear-gradient(90deg, #00d9b1, #00c9a1);
//           box-shadow: 0 2px 6px rgba(0, 217, 177, 0.3);
//         }

//         .footer-timestamp {
//           font-size: 13px;
//           color: #718096;
//           font-weight: 500;
//         }

//         .premium-tooltip {
//           padding: 18px;
//           background: white;
//           border-radius: 14px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//           font-family: 'Inter', sans-serif;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//           min-width: 200px;
//           backdrop-filter: blur(10px);
//         }

//         .tooltip-header {
//           font-size: 14px;
//           font-weight: 700;
//           color: #4f6cff;
//           margin-bottom: 8px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .tooltip-value {
//           font-size: 26px;
//           font-weight: 800;
//           color: #1a202c;
//           letter-spacing: -0.5px;
//           margin: 8px 0;
//         }

//         .tooltip-date {
//           font-size: 13px;
//           font-weight: 500;
//           color: #718096;
//           padding-top: 6px;
//           border-top: 1px solid rgba(226, 232, 240, 0.6);
//         }

//         .loading-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 500px;
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 20px;
//           overflow: hidden;
//         }

//         .loading-spinner {
//           width: 70px;
//           height: 70px;
//           border: 6px solid rgba(79, 108, 255, 0.1);
//           border-top: 6px solid #4f6cff;
//           border-radius: 50%;
//           animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
//           margin-bottom: 2rem;
//         }

//         .loading-text {
//           font-size: 1.2rem;
//           font-weight: 500;
//           color: #4a5568;
//           letter-spacing: 0.3px;
//         }


//         .bar-label {
//           text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
//           opacity: 0;
//           animation: label-appear 0.3s ease-out forwards;
//           animation-delay: 0.4s;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         @keyframes bar-appear {
//           from {
//             transform: scaleY(0);
//             opacity: 0;
//           }
//           to {
//             transform: scaleY(1);
//             opacity: 1;
//           }
//         }

//         @keyframes label-appear {
//           from {
//             opacity: 0;
//             transform: translateY(5px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>

//       {/* <style jsx>{`
//         .premium-container {
//           width: 98vw;
//           max-width: 1400px;
//           margin: 24px auto;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//         }

//         .premium-dashboard {
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 24px;
//           overflow: hidden;
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.1);
//           position: relative;
//           z-index: 1;
//         }

//         .premium-dashboard::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 180px;
//           background: linear-gradient(120deg, #f9fcff 0%, #f0f7ff 100%);
//           z-index: -1;
//         }

//         .dashboard-header {
//           padding: 32px 40px 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           position: relative;
//         }

//         .header-content {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           z-index: 1;
//         }

//         .header-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 60px;
//           height: 60px;
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           border-radius: 18px;
//           color: white;
//           font-size: 1.8rem;
//           box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
//           transition: all 0.3s ease;
//         }

//         .header-icon:hover {
//           transform: scale(1.05) rotate(5deg);
//           box-shadow: 0 15px 25px rgba(67, 97, 238, 0.4);
//         }

//         .header-text h2 {
//           font-size: 2rem;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -0.8px;
//           background: linear-gradient(90deg, #2d3748 0%, #4a5568 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .header-text p {
//           font-size: 1.1rem;
//           color: #718096;
//           font-weight: 500;
//           margin: 0;
//           max-width: 500px;
//         }

//         .insight-card .info-badge {
//           position: absolute;
//           bottom: 16px;
//           right: 16px;
//           width: 32px;
//           height: 32px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: rgba(113, 128, 150, 0.1);
//           border-radius: 50%;
//           color: #718096;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           z-index: 3;
//         }

//         .insight-card .info-badge:hover {
//           background: rgba(79, 108, 255, 0.15);
//           color: #4f6cff;
//         }

//         .insight-card .badge-tooltip {
//           position: absolute;
//           bottom: 120%;
//           right: 0;
//           width: 240px;
//           padding: 12px 16px;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
//           font-size: 0.85rem;
//           font-weight: 500;
//           color: #4a5568;
//           opacity: 0;
//           transform: translateY(10px);
//           transition: all 0.3s ease;
//           visibility: hidden;
//           z-index: 10;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//         }

//         .insight-card .info-badge:hover .badge-tooltip {
//           opacity: 1;
//           transform: translateY(0);
//           visibility: visible;
//         }

//         .dashboard-insights {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 24px;
//           padding: 0 40px 30px;
//           position: relative;
//           z-index: 2;
//         }

//         .insight-card {
//           background: white;
//           border-radius: 20px;
//           padding: 24px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
//           position: relative;
//           overflow: hidden;
//           backdrop-filter: blur(10px);
//         }

//         .insight-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
//         }

//         .insight-card.traded {
//           background: linear-gradient(135deg, rgba(79, 108, 255, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.delivered {
//           background: linear-gradient(135deg, rgba(0, 217, 177, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.stats {
//           background: linear-gradient(135deg, rgba(113, 128, 150, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .card-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 20px;
//           font-size: 1.4rem;
//           color: white;
//         }

//         .traded .card-icon {
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           box-shadow: 0 8px 20px rgba(79, 108, 255, 0.3);
//         }

//         .delivered .card-icon {
//           background: linear-gradient(135deg, #00d9b1 0%, #00c9a1 100%);
//           box-shadow: 0 8px 20px rgba(0, 217, 177, 0.3);
//         }

//         .stats .card-icon {
//           background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
//           box-shadow: 0 8px 20px rgba(113, 128, 150, 0.3);
//         }

//         .card-content {
//           position: relative;
//           z-index: 2;
//         }

//         .card-value {
//           font-size: 32px;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -1px;
//         }

//         .card-label {
//           font-size: 15px;
//           color: #718096;
//           font-weight: 600;
//           margin-bottom: 16px;
//         }

//         .card-change {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 15px;
//           font-weight: 700;
//           padding: 6px 14px;
//           border-radius: 24px;
//         }

//         .card-change.positive {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .card-change.negative {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-stats {
//           display: flex;
//           gap: 12px;
//         }

//         .stat-item {
//           font-size: 13px;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 12px;
//         }

//         .stat-item.max {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .stat-item.min {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-wave {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 4px;
//           background: linear-gradient(90deg, #4f6cff, #00d9b1);
//           opacity: 0.8;
//         }

//         .traded .card-wave {
//           background: #4f6cff;
//         }

//         .delivered .card-wave {
//           background: #00d9b1;
//         }

//         .stats .card-wave {
//           background: #718096;
//         }

//         .dashboard-chart {
//           padding: 20px 40px 40px;
//           position: relative;
//           height: 500px;
//           background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0V0zm30 30h30v30H30V30z' fill='%23f0f7ff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
//         }

//         .dashboard-footer {
//           padding: 20px 40px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-top: 1px solid rgba(226, 232, 240, 0.4);
//           background: rgba(249, 252, 255, 0.7);
//         }

//         .footer-legend {
//           display: flex;
//           gap: 1.5rem;
//         }

//         .legend-item {
//           display: flex;
//           align-items: center;
//           gap: 0.8rem;
//           font-size: 0.95rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .legend-color {
//           width: 20px;
//           height: 20px;
//           border-radius: 6px;
//         }

//         .legend-color.traded {
//           background: linear-gradient(90deg, #4f6cff, #4361ee);
//           box-shadow: 0 2px 6px rgba(67, 97, 238, 0.3);
//         }

//         .legend-color.delivered {
//           background: linear-gradient(90deg, #00d9b1, #00c9a1);
//           box-shadow: 0 2px 6px rgba(0, 217, 177, 0.3);
//         }

//         .footer-timestamp {
//           font-size: 13px;
//           color: #718096;
//           font-weight: 500;
//         }

//         .premium-tooltip {
//           padding: 18px;
//           background: white;
//           border-radius: 14px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//           font-family: 'Inter', sans-serif;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//           min-width: 200px;
//           backdrop-filter: blur(10px);
//         }

//         .tooltip-header {
//           font-size: 14px;
//           font-weight: 700;
//           color: #4f6cff;
//           margin-bottom: 8px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .tooltip-value {
//           font-size: 26px;
//           font-weight: 800;
//           color: #1a202c;
//           letter-spacing: -0.5px;
//           margin: 8px 0;
//         }

//         .tooltip-date {
//           font-size: 13px;
//           font-weight: 500;
//           color: #718096;
//           padding-top: 6px;
//           border-top: 1px solid rgba(226, 232, 240, 0.6);
//         }

//         .loading-state,
//         .error-state,
//         .no-data-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 500px;
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 20px;
//           overflow: hidden;
//         }

//         .loading-spinner {
//           width: 70px;
//           height: 70px;
//           border: 6px solid rgba(79, 108, 255, 0.1);
//           border-top: 6px solid #4f6cff;
//           border-radius: 50%;
//           animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
//           margin-bottom: 2rem;
//         }

//         .loading-text,
//         .error-text,
//         .no-data-text {
//           font-size: 1.2rem;
//           font-weight: 500;
//           color: #4a5568;
//           letter-spacing: 0.3px;
//         }

//         .bar-animation {
//           transform-origin: center bottom;
//           transform: scaleY(0);
//           animation: bar-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }

//         .bar-label {
//           text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
//           opacity: 0;
//           animation: label-appear 0.3s ease-out forwards;
//           animation-delay: 0.4s;
//         }

//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         @keyframes bar-appear {
//           from {
//             transform: scaleY(0);
//             opacity: 0;
//           }
//           to {
//             transform: scaleY(1);
//             opacity: 1;
//           }
//         }

//         @keyframes label-appear {
//           from {
//             opacity: 0;
//             transform: translateY(5px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style> */}
//     </div>
//   );
// };

// export default PublicTradingActivityPlot;

// ----------------before code -------------------

// import React, { useEffect, useState, useMemo } from 'react';

// import { ResponsiveBar } from '@nivo/bar';
// import { FaChartBar, FaInfoCircle, FaArrowUp, FaArrowDown, FaChartLine, FaPercentage, FaExchangeAlt } from 'react-icons/fa';
// import { useTooltip } from '@nivo/tooltip';

// const PublicTradingActivityPlot = ({ symbol }) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     setError(null);
//     fetch(`${API_BASE}/stocks/test/compute_public_trading_activity`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         // Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! Status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((json) => {
//         // Access the 'data' array and sort it
//         const sortedData = Array.isArray(json.data)
//           ? json.data.sort((a, b) => new Date(a.Date) - new Date(b.Date))
//           : [];
//         setData(sortedData);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching data:', err);
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, [symbol]); // Add 'symbol' to dependency array to refetch on symbol change

//   const insights = useMemo(() => {
//     if (data.length === 0) return null;

//     const latest = data[data.length - 1];
//     const previous = data.length > 1 ? data[data.length - 2] : null;

//     const avgTraded = data.reduce((sum, d) => sum + d.pct_public_traded, 0) / data.length;
//     const maxTraded = Math.max(...data.map((d) => d.pct_public_traded));
//     const minTraded = Math.min(...data.map((d) => d.pct_public_traded));

//     const tradedChange = previous
//       ? ((latest.pct_public_traded - previous.pct_public_traded) / previous.pct_public_traded) * 100
//       : 0;
//     const deliveredChange = previous
//       ? ((latest.pct_public_delivered - previous.pct_public_delivered) / previous.pct_public_delivered) * 100
//       : 0;

//     return {
//       latestTraded: latest.pct_public_traded,
//       latestDelivered: latest.pct_public_delivered,
//       avgTraded,
//       maxTraded,
//       minTraded,
//       tradedChange,
//       deliveredChange,
//     };
//   }, [data]);

//   const nivoData = useMemo(() => {
//     return data.map((d) => ({
//       date: d.Date,
//       '% Public Traded': d.pct_public_traded,
//       '% Public Delivered': d.pct_public_delivered,
//     }));
//   }, [data]);

//   const CustomBar = ({ bar }) => {
//     const { showTooltipFromEvent, hideTooltip } = useTooltip();
//     const fillColor = bar.data.id === '% Public Traded' ? 'url(#tradedGradient)' : 'url(#deliveredGradient)';

//     const tooltipContent = (
//       <div className="premium-tooltip">
//         <div className="tooltip-header">{bar.data.id}</div>
//         <div className="tooltip-value">{bar.data.value.toFixed(2)}%</div>
//         <div className="tooltip-date">{bar.data.indexValue}</div>
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
//           rx={6}
//           ry={6}
//         // className="bar-animation"
//         // style={{
//         //   animationDelay: `${bar.index * 30}ms`,
//         // }}
//         />
//         {bar.height > 12 && (
//           <text
//             x={bar.width / 2}
//             y={-6}
//             textAnchor="middle"
//             fill="#ffffff"
//             fontSize={11}
//             fontWeight={600}
//             className="bar-label"
//           >
//             {bar.data.value.toFixed(1)}
//           </text>
//         )}
//       </g>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="premium-container">
//         <div className="premium-card loading-state">
//           <div className="loading-spinner"></div>
//           <div className="loading-text">Loading trading activity data...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="premium-container">
//         <div className="premium-card error-state">
//           <div className="error-text">Error: {error}</div>
//         </div>
//       </div>
//     );
//   }

//   if (!insights) {
//     return (
//       <div className="premium-container">
//         <div className="premium-card no-data-state">
//           <div className="no-data-text">No trading activity data available for {symbol}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="premium-container">
//       <div className="premium-dashboard">
//         <div className="dashboard-header">
//           <div className="header-content">
//             <div className="header-icon">
//               <FaChartBar />
//             </div>
//             <div className="header-text">
//               <h2>Public Trading Activity - {symbol}</h2>
//               <p>Percentage of Public Shares Traded vs. Delivered</p>
//             </div>
//           </div>
//         </div>

//         <div className="dashboard-insights">
//           <div className="insight-card traded">
//             <div className="card-icon">
//               <FaPercentage />
//             </div>
//             <div className="card-content">
//               <div className="card-value">{insights.latestTraded.toFixed(2)}%</div>
//               <div className="card-label">Current Traded</div>
//               <div className={`card-change ${insights.tradedChange >= 0 ? 'positive' : 'negative'}`}>
//                 {insights.tradedChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
//                 {Math.abs(insights.tradedChange).toFixed(2)}%
//               </div>
//             </div>
//             <div className="info-badge">
//               <FaInfoCircle />
//               <span className="badge-tooltip">
//                 The percentage of publicly available shares that were traded on the most recent trading day.
//               </span>
//             </div>
//             <div className="card-wave"></div>
//           </div>

//           <div className="insight-card delivered">
//             <div className="card-icon">
//               <FaExchangeAlt />
//             </div>
//             <div className="card-content">
//               <div className="card-value">{insights.latestDelivered.toFixed(2)}%</div>
//               <div className="card-label">Current Delivered</div>
//               <div className={`card-change ${insights.deliveredChange >= 0 ? 'positive' : 'negative'}`}>
//                 {insights.deliveredChange >= 0 ? <FaArrowUp /> : <FaArrowDown />}
//                 {Math.abs(insights.deliveredChange).toFixed(2)}%
//               </div>
//             </div>
//             <div className="info-badge">
//               <FaInfoCircle />
//               <span className="badge-tooltip">
//                 The percentage of publicly traded shares that were actually delivered (settled) on the most recent day.
//               </span>
//             </div>
//             <div className="card-wave"></div>
//           </div>

//           <div className="insight-card stats">
//             <div className="card-icon">
//               <FaChartLine />
//             </div>
//             <div className="card-content">
//               <div className="card-value">{insights.avgTraded.toFixed(2)}%</div>
//               <div className="card-label">Average Traded</div>
//               <div className="card-stats">
//                 <div className="stat-item max">↑ {insights.maxTraded.toFixed(2)}%</div>
//                 <div className="stat-item min">↓ {insights.minTraded.toFixed(2)}%</div>
//               </div>
//             </div>
//             <div className="info-badge">
//               <FaInfoCircle />
//               <span className="badge-tooltip">
//                 The average percentage of public shares traded over the last 30 days.
//               </span>
//             </div>
//             <div className="card-wave"></div>
//           </div>
//         </div>

//         <div className="dashboard-chart">
//           <svg width="0" height="0">
//             <defs>
//               <linearGradient id="tradedGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#4f6cff" />
//                 <stop offset="100%" stopColor="#4361ee" />
//               </linearGradient>
//               <linearGradient id="deliveredGradient" x1="0" x2="0" y1="0" y2="1">
//                 <stop offset="0%" stopColor="#00d9b1" />
//                 <stop offset="100%" stopColor="#00c9a1" />
//               </linearGradient>
//             </defs>
//           </svg>
//           <ResponsiveBar
//             data={nivoData}
//             keys={['% Public Traded', '% Public Delivered']}
//             indexBy="date"
//             margin={{ top: 20, right: 30, bottom: 120, left: 60 }}
//             padding={0.3}
//             groupMode="grouped"
//             colors={({ id }) =>
//               id === '% Public Traded' ? 'url(#tradedGradient)' : 'url(#deliveredGradient)'
//             }
//             theme={{
//               textColor: '#4a5568',
//               fontSize: 12,
//               fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//               axis: {
//                 ticks: {
//                   line: {
//                     stroke: '#e2e8f0',
//                     strokeWidth: 1,
//                   },
//                   text: {
//                     fill: '#718096',
//                     fontSize: 11,
//                     fontWeight: 500,
//                   },
//                 },
//                 legend: {
//                   text: {
//                     fill: '#2d3748',
//                     fontSize: 13,
//                     fontWeight: 600,
//                     letterSpacing: '0.3px',
//                   },
//                 },
//                 domain: {
//                   line: {
//                     stroke: '#e2e8f0',
//                     strokeWidth: 2,
//                   },
//                 },
//               },
//               grid: {
//                 line: {
//                   stroke: '#edf2f7',
//                   strokeDasharray: '3 4',
//                 },
//               },
//               legends: {
//                 text: {
//                   fill: '#2d3748',
//                   fontSize: 12,
//                   fontWeight: 600,
//                 },
//               },
//               tooltip: {
//                 container: {
//                   display: 'none',
//                 },
//               },
//             }}
//             axisBottom={{
//               tickRotation: -45,
//               legend: 'Date',
//               legendPosition: 'middle',
//               legendOffset: 100,
//               renderTick: (tick) => (
//                 <g transform={`translate(${tick.x},${tick.y + 10})`}>
//                   <text
//                     textAnchor="end"
//                     dominantBaseline="middle"
//                     transform="rotate(-45)"
//                     style={{
//                       fontSize: 11,
//                       fill: '#4a5568',
//                       fontFamily: "'Inter', sans-serif",
//                       fontWeight: 500,
//                     }}
//                   >
//                     {tick.value}
//                   </text>
//                 </g>
//               ),
//             }}
//             axisLeft={{
//               legend: '% of Public Shares',
//               legendPosition: 'middle',
//               legendOffset: -50,
//               format: (v) => `${v.toFixed(0)}%`,
//               tickValues: 5,
//             }}
//             enableLabel={false}
//             barComponent={CustomBar}
//             role="application"
//             ariaLabel="Public Trading Activity Bar Chart"
//             animate={true}
//             motionConfig="gentle"
//             motionStiffness={90}
//             motionDamping={15}
//           />
//         </div>

//         <div className="dashboard-footer">
//           <div className="footer-legend">
//             <div className="legend-item">
//               <div className="legend-color traded"></div>
//               <span>% Public Traded</span>
//             </div>
//             <div className="legend-item">
//               <div className="legend-color delivered"></div>
//               <span>% Public Delivered</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .premium-container {
//           width: 98vw;
//           max-width: 1400px;
//           margin: 24px auto;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//         }

//         .premium-dashboard {
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 24px;
//           overflow: hidden;
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.1);
//           position: relative;
//           z-index: 1;
//         }

//         .premium-dashboard::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 180px;
//           background: linear-gradient(120deg, #f9fcff 0%, #f0f7ff 100%);
//           z-index: -1;
//         }

//         .dashboard-header {
//           padding: 32px 40px 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           position: relative;
//         }

//         .header-content {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           z-index: 1;
//         }

//         .header-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 60px;
//           height: 60px;
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           border-radius: 18px;
//           color: white;
//           font-size: 1.8rem;
//           box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
//           transition: all 0.3s ease;
//         }

//         .header-icon:hover {
//           transform: scale(1.05) rotate(5deg);
//           box-shadow: 0 15px 25px rgba(67, 97, 238, 0.4);
//         }

//         .header-text h2 {
//           font-size: 2rem;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -0.8px;
//           background: linear-gradient(90deg, #2d3748 0%, #4a5568 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .header-text p {
//           font-size: 1.1rem;
//           color: #718096;
//           font-weight: 500;
//           margin: 0;
//           max-width: 500px;
//         }

//         .insight-card .info-badge {
//         position: absolute;
//         bottom: 16px;
//         right: 16px;
//         width: 32px;
//         height: 32px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: rgba(113, 128, 150, 0.1);
//         border-radius: 50%;
//         color: #718096;
//         cursor: pointer;
//         transition: all 0.3s ease;
//         z-index: 3;
//         }

//         .insight-card .info-badge:hover {
//         background: rgba(79, 108, 255, 0.15);
//         color: #4f6cff;
//         }

//         .insight-card .badge-tooltip {
//             position: absolute;
//             bottom: 120%; /* Changed from bottom: 120% */
//             right: 0;
//             width: 240px;
//             padding: 12px 16px;
//             background: white;
//             border-radius: 12px;
//             box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
//             font-size: 0.85rem;
//             font-weight: 500;
//             color: #4a5568;
//             opacity: 0;
//             transform: translateY(10px); /* Changed to move upward initially */
//             transition: all 0.3s ease;
//             visibility: hidden;
//             z-index: 10;
//             border: 1px solid rgba(226, 232, 240, 0.8);
//             }

//         .insight-card .info-badge:hover .badge-tooltip {
//         opacity: 1;
//         transform: translateY(0); /* Smoothly moves to its final position */
//         visibility: visible;
//         }



//         .dashboard-insights {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 24px;
//           padding: 0 40px 30px;
//           position: relative;
//           z-index: 2;
//         }

//         .insight-card {
//           background: white;
//           border-radius: 20px;
//           padding: 24px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
//           position: relative;
//           overflow: hidden;
//           backdrop-filter: blur(10px);
//         }

//         .insight-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
//         }

//         .insight-card.traded {
//           background: linear-gradient(135deg, rgba(79, 108, 255, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.delivered {
//           background: linear-gradient(135deg, rgba(0, 217, 177, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.stats {
//           background: linear-gradient(135deg, rgba(113, 128, 150, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .card-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 20px;
//           font-size: 1.4rem;
//           color: white;
//         }

//         .traded .card-icon {
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           box-shadow: 0 8px 20px rgba(79, 108, 255, 0.3);
//         }

//         .delivered .card-icon {
//           background: linear-gradient(135deg, #00d9b1 0%, #00c9a1 100%);
//           box-shadow: 0 8px 20px rgba(0, 217, 177, 0.3);
//         }

//         .stats .card-icon {
//           background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
//           box-shadow: 0 8px 20px rgba(113, 128, 150, 0.3);
//         }

//         .card-content {
//           position: relative;
//           z-index: 2;
//         }

//         .card-value {
//           font-size: 32px;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -1px;
//         }

//         .card-label {
//           font-size: 15px;
//           color: #718096;
//           font-weight: 600;
//           margin-bottom: 16px;
//         }

//         .card-change {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 15px;
//           font-weight: 700;
//           padding: 6px 14px;
//           border-radius: 24px;
//         }

//         .card-change.positive {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .card-change.negative {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-stats {
//           display: flex;
//           gap: 12px;
//         }

//         .stat-item {
//           font-size: 13px;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 12px;
//         }

//         .stat-item.max {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .stat-item.min {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-wave {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 4px;
//           background: linear-gradient(90deg, #4f6cff, #00d9b1);
//           opacity: 0.8;
//         }

//         .traded .card-wave {
//           background: #4f6cff;
//         }

//         .delivered .card-wave {
//           background: #00d9b1;
//         }

//         .stats .card-wave {
//           background: #718096;
//         }

//         .dashboard-chart {
//           padding: 20px 40px 40px;
//           position: relative;
//           height: 500px;
//           background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0V0zm30 30h30v30H30V30z' fill='%23f0f7ff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
//         }

//         .dashboard-footer {
//           padding: 20px 40px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-top: 1px solid rgba(226, 232, 240, 0.4);
//           background: rgba(249, 252, 255, 0.7);
//         }

//         .footer-legend {
//           display: flex;
//           gap: 1.5rem;
//         }

//         .legend-item {
//           display: flex;
//           align-items: center;
//           gap: 0.8rem;
//           font-size: 0.95rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .legend-color {
//           width: 20px;
//           height: 20px;
//           border-radius: 6px;
//         }

//         .legend-color.traded {
//           background: linear-gradient(90deg, #4f6cff, #4361ee);
//           box-shadow: 0 2px 6px rgba(67, 97, 238, 0.3);
//         }

//         .legend-color.delivered {
//           background: linear-gradient(90deg, #00d9b1, #00c9a1);
//           box-shadow: 0 2px 6px rgba(0, 217, 177, 0.3);
//         }

//         .footer-timestamp {
//           font-size: 13px;
//           color: #718096;
//           font-weight: 500;
//         }

//         .premium-tooltip {
//           padding: 18px;
//           background: white;
//           border-radius: 14px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//           font-family: 'Inter', sans-serif;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//           min-width: 200px;
//           backdrop-filter: blur(10px);
//         }

//         .tooltip-header {
//           font-size: 14px;
//           font-weight: 700;
//           color: #4f6cff;
//           margin-bottom: 8px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .tooltip-value {
//           font-size: 26px;
//           font-weight: 800;
//           color: #1a202c;
//           letter-spacing: -0.5px;
//           margin: 8px 0;
//         }

//         .tooltip-date {
//           font-size: 13px;
//           font-weight: 500;
//           color: #718096;
//           padding-top: 6px;
//           border-top: 1px solid rgba(226, 232, 240, 0.6);
//         }

//         .loading-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 500px;
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 20px;
//           overflow: hidden;
//         }

//         .loading-spinner {
//           width: 70px;
//           height: 70px;
//           border: 6px solid rgba(79, 108, 255, 0.1);
//           border-top: 6px solid #4f6cff;
//           border-radius: 50%;
//           animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
//           margin-bottom: 2rem;
//         }

//         .loading-text {
//           font-size: 1.2rem;
//           font-weight: 500;
//           color: #4a5568;
//           letter-spacing: 0.3px;
//         }


//         .bar-label {
//           text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
//           opacity: 0;
//           animation: label-appear 0.3s ease-out forwards;
//           animation-delay: 0.4s;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         @keyframes bar-appear {
//           from {
//             transform: scaleY(0);
//             opacity: 0;
//           }
//           to {
//             transform: scaleY(1);
//             opacity: 1;
//           }
//         }

//         @keyframes label-appear {
//           from {
//             opacity: 0;
//             transform: translateY(5px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>

//       {/* <style jsx>{`
//         .premium-container {
//           width: 98vw;
//           max-width: 1400px;
//           margin: 24px auto;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//         }

//         .premium-dashboard {
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 24px;
//           overflow: hidden;
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.1);
//           position: relative;
//           z-index: 1;
//         }

//         .premium-dashboard::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 180px;
//           background: linear-gradient(120deg, #f9fcff 0%, #f0f7ff 100%);
//           z-index: -1;
//         }

//         .dashboard-header {
//           padding: 32px 40px 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           position: relative;
//         }

//         .header-content {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           z-index: 1;
//         }

//         .header-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 60px;
//           height: 60px;
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           border-radius: 18px;
//           color: white;
//           font-size: 1.8rem;
//           box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
//           transition: all 0.3s ease;
//         }

//         .header-icon:hover {
//           transform: scale(1.05) rotate(5deg);
//           box-shadow: 0 15px 25px rgba(67, 97, 238, 0.4);
//         }

//         .header-text h2 {
//           font-size: 2rem;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -0.8px;
//           background: linear-gradient(90deg, #2d3748 0%, #4a5568 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .header-text p {
//           font-size: 1.1rem;
//           color: #718096;
//           font-weight: 500;
//           margin: 0;
//           max-width: 500px;
//         }

//         .insight-card .info-badge {
//           position: absolute;
//           bottom: 16px;
//           right: 16px;
//           width: 32px;
//           height: 32px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: rgba(113, 128, 150, 0.1);
//           border-radius: 50%;
//           color: #718096;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           z-index: 3;
//         }

//         .insight-card .info-badge:hover {
//           background: rgba(79, 108, 255, 0.15);
//           color: #4f6cff;
//         }

//         .insight-card .badge-tooltip {
//           position: absolute;
//           bottom: 120%;
//           right: 0;
//           width: 240px;
//           padding: 12px 16px;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
//           font-size: 0.85rem;
//           font-weight: 500;
//           color: #4a5568;
//           opacity: 0;
//           transform: translateY(10px);
//           transition: all 0.3s ease;
//           visibility: hidden;
//           z-index: 10;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//         }

//         .insight-card .info-badge:hover .badge-tooltip {
//           opacity: 1;
//           transform: translateY(0);
//           visibility: visible;
//         }

//         .dashboard-insights {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 24px;
//           padding: 0 40px 30px;
//           position: relative;
//           z-index: 2;
//         }

//         .insight-card {
//           background: white;
//           border-radius: 20px;
//           padding: 24px;
//           box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
//           border: 1px solid rgba(226, 232, 240, 0.6);
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
//           position: relative;
//           overflow: hidden;
//           backdrop-filter: blur(10px);
//         }

//         .insight-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
//         }

//         .insight-card.traded {
//           background: linear-gradient(135deg, rgba(79, 108, 255, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.delivered {
//           background: linear-gradient(135deg, rgba(0, 217, 177, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .insight-card.stats {
//           background: linear-gradient(135deg, rgba(113, 128, 150, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         }

//         .card-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 20px;
//           font-size: 1.4rem;
//           color: white;
//         }

//         .traded .card-icon {
//           background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
//           box-shadow: 0 8px 20px rgba(79, 108, 255, 0.3);
//         }

//         .delivered .card-icon {
//           background: linear-gradient(135deg, #00d9b1 0%, #00c9a1 100%);
//           box-shadow: 0 8px 20px rgba(0, 217, 177, 0.3);
//         }

//         .stats .card-icon {
//           background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
//           box-shadow: 0 8px 20px rgba(113, 128, 150, 0.3);
//         }

//         .card-content {
//           position: relative;
//           z-index: 2;
//         }

//         .card-value {
//           font-size: 32px;
//           font-weight: 800;
//           color: #1a202c;
//           margin-bottom: 8px;
//           letter-spacing: -1px;
//         }

//         .card-label {
//           font-size: 15px;
//           color: #718096;
//           font-weight: 600;
//           margin-bottom: 16px;
//         }

//         .card-change {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 15px;
//           font-weight: 700;
//           padding: 6px 14px;
//           border-radius: 24px;
//         }

//         .card-change.positive {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .card-change.negative {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-stats {
//           display: flex;
//           gap: 12px;
//         }

//         .stat-item {
//           font-size: 13px;
//           font-weight: 600;
//           padding: 4px 10px;
//           border-radius: 12px;
//         }

//         .stat-item.max {
//           background: rgba(0, 217, 177, 0.1);
//           color: #00a37a;
//         }

//         .stat-item.min {
//           background: rgba(255, 86, 86, 0.1);
//           color: #ff5656;
//         }

//         .card-wave {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 4px;
//           background: linear-gradient(90deg, #4f6cff, #00d9b1);
//           opacity: 0.8;
//         }

//         .traded .card-wave {
//           background: #4f6cff;
//         }

//         .delivered .card-wave {
//           background: #00d9b1;
//         }

//         .stats .card-wave {
//           background: #718096;
//         }

//         .dashboard-chart {
//           padding: 20px 40px 40px;
//           position: relative;
//           height: 500px;
//           background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0V0zm30 30h30v30H30V30z' fill='%23f0f7ff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
//         }

//         .dashboard-footer {
//           padding: 20px 40px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-top: 1px solid rgba(226, 232, 240, 0.4);
//           background: rgba(249, 252, 255, 0.7);
//         }

//         .footer-legend {
//           display: flex;
//           gap: 1.5rem;
//         }

//         .legend-item {
//           display: flex;
//           align-items: center;
//           gap: 0.8rem;
//           font-size: 0.95rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .legend-color {
//           width: 20px;
//           height: 20px;
//           border-radius: 6px;
//         }

//         .legend-color.traded {
//           background: linear-gradient(90deg, #4f6cff, #4361ee);
//           box-shadow: 0 2px 6px rgba(67, 97, 238, 0.3);
//         }

//         .legend-color.delivered {
//           background: linear-gradient(90deg, #00d9b1, #00c9a1);
//           box-shadow: 0 2px 6px rgba(0, 217, 177, 0.3);
//         }

//         .footer-timestamp {
//           font-size: 13px;
//           color: #718096;
//           font-weight: 500;
//         }

//         .premium-tooltip {
//           padding: 18px;
//           background: white;
//           border-radius: 14px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//           font-family: 'Inter', sans-serif;
//           border: 1px solid rgba(226, 232, 240, 0.8);
//           min-width: 200px;
//           backdrop-filter: blur(10px);
//         }

//         .tooltip-header {
//           font-size: 14px;
//           font-weight: 700;
//           color: #4f6cff;
//           margin-bottom: 8px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .tooltip-value {
//           font-size: 26px;
//           font-weight: 800;
//           color: #1a202c;
//           letter-spacing: -0.5px;
//           margin: 8px 0;
//         }

//         .tooltip-date {
//           font-size: 13px;
//           font-weight: 500;
//           color: #718096;
//           padding-top: 6px;
//           border-top: 1px solid rgba(226, 232, 240, 0.6);
//         }

//         .loading-state,
//         .error-state,
//         .no-data-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 500px;
//           background: linear-gradient(145deg, #ffffff 0%, #f9fcff 100%);
//           border-radius: 20px;
//           overflow: hidden;
//         }

//         .loading-spinner {
//           width: 70px;
//           height: 70px;
//           border: 6px solid rgba(79, 108, 255, 0.1);
//           border-top: 6px solid #4f6cff;
//           border-radius: 50%;
//           animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
//           margin-bottom: 2rem;
//         }

//         .loading-text,
//         .error-text,
//         .no-data-text {
//           font-size: 1.2rem;
//           font-weight: 500;
//           color: #4a5568;
//           letter-spacing: 0.3px;
//         }

//         .bar-animation {
//           transform-origin: center bottom;
//           transform: scaleY(0);
//           animation: bar-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }

//         .bar-label {
//           text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
//           opacity: 0;
//           animation: label-appear 0.3s ease-out forwards;
//           animation-delay: 0.4s;
//         }

//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         @keyframes bar-appear {
//           from {
//             transform: scaleY(0);
//             opacity: 0;
//           }
//           to {
//             transform: scaleY(1);
//             opacity: 1;
//           }
//         }

//         @keyframes label-appear {
//           from {
//             opacity: 0;
//             transform: translateY(5px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style> */}
//     </div>
//   );
// };

// export default PublicTradingActivityPlot;

import React, { useEffect, useState, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import {
  FaChartBar,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaPercentage,
  FaExchangeAlt,
} from 'react-icons/fa';
import { useTooltip } from '@nivo/tooltip';
import RatingSystem from '../RatingFile/RatingSystem';

const PublicTradingActivityPlot = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const handleRatingUpdate = (newRating) => {
    console.log('Public Trading Activity rating updated:', newRating);
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`${API_BASE}/stocks/test/compute_public_trading_activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            console.error('Backend error response:', text);
            throw new Error(`HTTP ${res.status}: ${text}`);
          });
        }
        return res.json();
      })
      .then((json) => {
        const raw = json.data || [];
        if (!Array.isArray(raw)) {
          throw new Error("Expected 'data' to be an array");
        }

        const sorted = raw
          .filter(
            (d) =>
              d.Date &&
              typeof d.pct_public_traded === 'number' &&
              typeof d.pct_public_delivered === 'number'
          )
          .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

        setData(sorted);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [symbol, API_BASE]);

  const insights = useMemo(() => {
    if (data.length === 0) return null;

    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;

    const avgTraded =
      data.reduce((sum, d) => sum + d.pct_public_traded, 0) / data.length;
    const maxTraded = Math.max(...data.map((d) => d.pct_public_traded));
    const minTraded = Math.min(...data.map((d) => d.pct_public_traded));

    const tradedChange = previous
      ? ((latest.pct_public_traded - previous.pct_public_traded) /
        previous.pct_public_traded) *
      100
      : 0;
    const deliveredChange = previous
      ? ((latest.pct_public_delivered - previous.pct_public_delivered) /
        previous.pct_public_delivered) *
      100
      : 0;

    return {
      latestTraded: latest.pct_public_traded,
      latestDelivered: latest.pct_public_delivered,
      avgTraded,
      maxTraded,
      minTraded,
      tradedChange,
      deliveredChange,
    };
  }, [data]);

  const nivoData = useMemo(() => {
    return data.map((d) => ({
      date: d.Date,
      '% Public Traded': d.pct_public_traded,
      '% Public Delivered': d.pct_public_delivered,
    }));
  }, [data]);

  const CustomBar = ({ bar }) => {
    const { showTooltipFromEvent, hideTooltip } = useTooltip();
    const fillColor =
      bar.data.id === '% Public Traded'
        ? 'url(#tradedGradient)'
        : 'url(#deliveredGradient)';

    const tooltipContent = (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700 min-w-[140px]">
        <div className="font-semibold text-sm text-blue-300">{bar.data.id}</div>
        <div className="text-lg font-bold mt-1">{bar.data.value.toFixed(2)}%</div>
        <div className="text-xs text-gray-300 mt-1">{bar.data.indexValue}</div>
      </div>
    );

    return (
      <g
        transform={`translate(${bar.x},${bar.y})`}
        onMouseEnter={(e) => showTooltipFromEvent(tooltipContent, e)}
        onMouseMove={(e) => showTooltipFromEvent(tooltipContent, e)}
        onMouseLeave={hideTooltip}
      >
        <rect width={bar.width} height={bar.height} fill={fillColor} rx={6} ry={6} />
        {bar.height > 12 && (
          <text
            x={bar.width / 2}
            y={-6}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={11}
            fontWeight={600}
            className="bar-label"
          >
            {bar.data.value.toFixed(1)}
          </text>
        )}
      </g>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">Loading trading activity data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
        <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <div className="font-semibold text-lg mb-2">Error Loading Data</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
        <div className="text-center text-gray-600 bg-white border border-gray-200 rounded-xl p-6 max-w-md">
          <div className="font-semibold text-lg mb-2">No Data Available</div>
          <div className="text-sm">No trading activity data available for {symbol}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 m-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-xl text-white">
              <FaChartBar className="text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Public Trading Activity - {symbol}
              </h2>
              <p className="text-gray-600 text-sm">
                Percentage of Public Shares Traded vs. Delivered
              </p>
            </div>
          </div>

          <RatingSystem
            plotType="compute_public_trading_activity"
            onRatingUpdate={handleRatingUpdate}
            className="flex items-center"
            aria-label="Rate public trading activity analysis"
          />
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {/* Traded Card */}
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <FaPercentage className="text-2xl" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold mb-1">
                {insights.latestTraded.toFixed(2)}%
              </div>
              <div className="text-blue-100 text-sm font-medium mb-2">
                Current Traded
              </div>
              <div className={`flex items-center text-sm font-semibold ${insights.tradedChange >= 0 ? 'text-green-300' : 'text-red-300'
                }`}>
                {insights.tradedChange >= 0 ? (
                  <FaArrowUp className="mr-1" />
                ) : (
                  <FaArrowDown className="mr-1" />
                )}
                {Math.abs(insights.tradedChange).toFixed(2)}%
              </div>
            </div>
            <div className="absolute top-3 right-3 group">
              <FaInfoCircle className="text-blue-200 cursor-help text-sm" />
              <div className="absolute top-6 right-0 w-48 bg-gray-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                The percentage of publicly available shares that were traded on the most recent trading day.
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </div>

          {/* Delivered Card */}
          <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <FaExchangeAlt className="text-2xl" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold mb-1">
                {insights.latestDelivered.toFixed(2)}%
              </div>
              <div className="text-green-100 text-sm font-medium mb-2">
                Current Delivered
              </div>
              <div className={`flex items-center text-sm font-semibold ${insights.deliveredChange >= 0 ? 'text-green-300' : 'text-red-300'
                }`}>
                {insights.deliveredChange >= 0 ? (
                  <FaArrowUp className="mr-1" />
                ) : (
                  <FaArrowDown className="mr-1" />
                )}
                {Math.abs(insights.deliveredChange).toFixed(2)}%
              </div>
            </div>
            <div className="absolute top-3 right-3 group">
              <FaInfoCircle className="text-green-200 cursor-help text-sm" />
              <div className="absolute top-6 right-0 w-48 bg-gray-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                The percentage of publicly traded shares that were actually delivered (settled) on the most recent day.
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </div>

          {/* Stats Card */}
          <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <FaChartLine className="text-2xl" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold mb-1">
                {insights.avgTraded.toFixed(2)}%
              </div>
              <div className="text-purple-100 text-sm font-medium mb-3">
                Average Traded
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-purple-200">High</span>
                  <span className="font-semibold text-green-300">
                    {insights.maxTraded.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-purple-200">Low</span>
                  <span className="font-semibold text-red-300">
                    {insights.minTraded.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 group">
              <FaInfoCircle className="text-purple-200 cursor-help text-sm" />
              <div className="absolute top-6 right-0 w-48 bg-gray-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                The average percentage of public shares traded over the last 30 days.
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 h-80">
            <svg width="0" height="0">
              <defs>
                <linearGradient id="tradedGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4f6cff" />
                  <stop offset="100%" stopColor="#4361ee" />
                </linearGradient>
                <linearGradient id="deliveredGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00d9b1" />
                  <stop offset="100%" stopColor="#00c9a1" />
                </linearGradient>
              </defs>
            </svg>

            <ResponsiveBar
              data={nivoData}
              keys={['% Public Traded', '% Public Delivered']}
              indexBy="date"
              margin={{ top: 20, right: 30, bottom: 120, left: 60 }}
              padding={0.3}
              groupMode="grouped"
              colors={({ id }) =>
                id === '% Public Traded' ? 'url(#tradedGradient)' : 'url(#deliveredGradient)'
              }
              theme={{
                textColor: '#4a5568',
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
                axis: {
                  ticks: {
                    line: { stroke: '#e2e8f0', strokeWidth: 1 },
                    text: { fill: '#718096', fontSize: 11, fontWeight: 500 },
                  },
                  legend: {
                    text: { fill: '#2d3748', fontSize: 13, fontWeight: 600 },
                  },
                  domain: { line: { stroke: '#e2e8f0', strokeWidth: 2 } },
                },
                grid: { line: { stroke: '#edf2f7', strokeDasharray: '3 4' } },
                legends: { text: { fill: '#2d3748', fontSize: 12, fontWeight: 600 } },
                tooltip: { container: { display: 'none' } },
              }}
              axisBottom={{
                tickRotation: -45,
                legend: 'Date',
                legendPosition: 'middle',
                legendOffset: 100,
              }}
              axisLeft={{
                legend: '% of Public Shares',
                legendPosition: 'middle',
                legendOffset: -50,
                format: (v) => `${v.toFixed(0)}%`,
                tickValues: 5,
              }}
              enableLabel={false}
              barComponent={CustomBar}
              role="application"
              ariaLabel="Public Trading Activity Bar Chart"
              animate={true}
              motionConfig="gentle"
            />
          </div>
        </div>

        {/* Footer Legend */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <span className="text-sm font-medium text-gray-700">% Public Traded</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-green-600"></div>
              <span className="text-sm font-medium text-gray-700">% Public Delivered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTradingActivityPlot;