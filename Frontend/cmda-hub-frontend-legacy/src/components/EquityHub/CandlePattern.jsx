

// import React, { useState, useEffect, useMemo } from 'react';
// import Plot from 'react-plotly.js';
// import { FaChartLine, FaFilter, FaInfoCircle, FaCaretUp, FaCaretDown, FaCalendarAlt, FaArrowUp, FaArrowDown, FaChevronDown, FaChevronRight, FaExpand } from 'react-icons/fa';

// // Pattern symbols mapping
// const PATTERN_SYMBOLS = {
//   'Hammer': 'circle',
//   'Engulfing': 'square',
//   'Doji': 'diamond',
//   'Harami': 'cross',
//   'Shooting Star': 'x',
//   'Morning Star': 'triangle-up',
//   'Evening Star': 'triangle-down',
//   'Piercing': 'pentagon',
//   'Dark Cloud': 'hexagon',
//   'Three White Soldiers': 'star',
//   'Three Black Crows': 'hexagram',
//   'Hanging Man': 'bowtie',
//   'Inverted Hammer': 'hourglass'
// };

// export default function CandlePatternPlot({ symbol }) {
//   const [raw, setRaw] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPatterns, setSelectedPatterns] = useState([]);
//   const [activePattern, setActivePattern] = useState(null);
//   const [isPatternPanelOpen, setIsPatternPanelOpen] = useState(false);
//   const [isPatternPanelExpanded, setIsPatternPanelExpanded] = useState(false);
//   const [dateRange, setDateRange] = useState('3M');
//   const [hoverInfo, setHoverInfo] = useState(null);
//   const [visibleRange, setVisibleRange] = useState(null);
//   const [showStats, setShowStats] = useState(false);
//   const [isHoveringPlot, setIsHoveringPlot] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     fetch(`${API_BASE}/candle-patterns`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then(res => res.json())
//       .then(json => {
//         if (json.error) {
//           setError(json.error);
//           setLoading(false);
//           return;
//         }
//         if (!json.candlestick || !Array.isArray(json.candlestick.x)) {
//           setError('Invalid data format: candlestick data missing or invalid');
//           setLoading(false);
//           return;
//         }
//         setRaw(json);
//         const patterns = [...new Set(json.pattern_markers?.map(trace => trace.name) || [])];
//         setSelectedPatterns(patterns);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError('Failed to fetch data from the server');
//         setLoading(false);
//       });
//   }, [symbol]);

//   const today = new Date();
//   const dateRanges = useMemo(() => {
//     if (!raw || !raw.candlestick || !Array.isArray(raw.candlestick.x)) return {};
//     const allDates = raw.candlestick.x.map(d => new Date(d));
//     const minDate = new Date(Math.min(...allDates));
//     return {
//       '1M': new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
//       '3M': new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
//       '6M': new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
//       '1Y': new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
//       'All': minDate
//     };
//   }, [raw]);

//   const filteredData = raw;

//   if (loading || !raw) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <div className="loading-text">Analyzing candle patterns...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <FaInfoCircle className="error-icon" />
//         <h3>Data Unavailable</h3>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (!raw.candlestick || !Array.isArray(raw.candlestick.x) || !raw.candlestick.x.length) {
//     return (
//       <div className="error-container">
//         <FaInfoCircle className="error-icon" />
//         <h3>No Data Available</h3>
//         <p>No valid candlestick data available</p>
//       </div>
//     );
//   }

//   const data = filteredData || raw;
//   const currentPrice = data.candlestick.close[data.candlestick.close.length - 1] || 0;
//   const initialPrice = data.candlestick.close[0] || 1;
//   const priceChangePct = initialPrice !== 0 ? ((currentPrice - initialPrice) / initialPrice) * 100 : 0;
//   const totalPatterns = data.pattern_markers.reduce((sum, trace) => sum + (trace.x?.length || 0), 0);
//   const priceChangeColor = priceChangePct >= 0 ? '#10B981' : '#EF4444';
//   const priceChangeIcon = priceChangePct >= 0 ? <FaCaretUp /> : <FaCaretDown />;

//   const patternsByDate = {};
//   data.pattern_markers.forEach(patternTrace => {
//     patternTrace.x.forEach((date, i) => {
//       if (!patternsByDate[date]) patternsByDate[date] = [];
//       patternsByDate[date].push({
//         name: patternTrace.name,
//         color: patternTrace.marker.color,
//         hovertext: patternTrace.hovertext[i]
//       });
//     });
//   });

//   const candleData = data.candlestick.x
//     .map((date, i) => ({
//       x: date,
//       open: Number(data.candlestick.open[i]),
//       high: Number(data.candlestick.high[i]),
//       low: Number(data.candlestick.low[i]),
//       close: Number(data.candlestick.close[i]),
//       volume: Number(data.volume.y[i]),
//       patterns: patternsByDate[date] || [],
//     }))
//     .filter(d =>
//       d.x &&
//       !isNaN(d.open) && !isNaN(d.high) &&
//       !isNaN(d.low) && !isNaN(d.close) &&
//       !isNaN(d.volume)
//     );

//   if (!candleData.length) {
//     return (
//       <div className="error-container">
//         <FaInfoCircle className="error-icon" />
//         <h3>Invalid Data</h3>
//         <p>Candlestick data contains invalid values for {symbol}.</p>
//       </div>
//     );
//   }

//   const patternTraces = data.pattern_markers
//     .filter(pattern => selectedPatterns.includes(pattern.name))
//     .map(pattern => {
//       const patternPoints = pattern.x.map((date, i) => {
//         const candleIndex = candleData.findIndex(d => d.x === date);
//         if (candleIndex === -1) return null;
//         const candle = candleData[candleIndex];
//         return {
//           x: date,
//           y: candle.high * 1.02,
//           pattern: pattern.name,
//           color: pattern.marker.color,
//           hovertext: pattern.hovertext?.[i] || `Pattern: ${pattern.name}`
//         };
//       }).filter(Boolean);
//       return {
//         type: 'scatter',
//         mode: 'markers',
//         name: pattern.name,
//         x: patternPoints.map(p => p.x),
//         y: patternPoints.map(p => p.y),
//         hoverinfo: 'text',
//         text: patternPoints.map(p => p.hovertext),
//         marker: {
//           symbol: PATTERN_SYMBOLS[pattern.name] || 'circle',
//           color: pattern.marker.color,
//           size: 12,
//           line: { width: 1, color: pattern.marker.color }
//         },
//         showlegend: true
//       };
//     });

//   const volumeData = candleData.map(d => ({
//     x: d.x,
//     y: d.volume,
//     hovertext: `Volume: ${d.volume.toLocaleString('en-IN')}`,
//     color: d.close >= d.open ? '#10B981' : '#EF4444',
//   }));

//   const minPrice = Math.min(...candleData.map(d => d.low)) * 0.95;
//   const maxPrice = Math.max(...candleData.map(d => d.high)) * 1.05;
//   const minDate = new Date(Math.min(...raw.candlestick.x.map(d => new Date(d))));
//   const maxDate = new Date(Math.max(...raw.candlestick.x.map(d => new Date(d))));

//   const plotlyData = [
//     {
//       type: 'candlestick',
//       name: symbol,
//       x: candleData.map(d => d.x),
//       open: candleData.map(d => d.open),
//       high: candleData.map(d => d.high),
//       low: candleData.map(d => d.low),
//       close: candleData.map(d => d.close),
//       increasing: { line: { color: '#10B981' }, fillcolor: 'rgba(16, 185, 129, 0.3)' },
//       decreasing: { line: { color: '#EF4444' }, fillcolor: 'rgba(239, 68, 68, 0.3)' },
//       hoverinfo: 'none'
//     },
//     ...patternTraces,
//     {
//       type: 'bar',
//       name: 'Volume',
//       x: volumeData.map(d => d.x),
//       y: volumeData.map(d => d.y),
//       marker: { color: volumeData.map(d => d.color), opacity: 0.6 },
//       yaxis: 'y2',
//       hoverinfo: 'text',
//       text: volumeData.map(d => d.hovertext),
//     }
//   ];

//   const plotlyLayout = {
//     dragmode: 'pan',
//     title: { text: `${symbol} Candlestick Chart`, font: { size: 16, color: '#1e293b', family: 'Inter, sans-serif' }, x: 0.05, y: 0.98 },
//     xaxis: {
//       type: 'date',
//       autorange: false,
//       range: [
//         new Date(dateRanges[dateRange]).toISOString(),
//         today.toISOString()
//       ],
//       rangebreaks: [
//         { bounds: [null, minDate.toISOString()], pattern: 'day' },
//         { bounds: [maxDate.toISOString(), null], pattern: 'day' },
//         { bounds: ["sat", "mon"], pattern: 'day' }
//       ],
//       min: minDate.toISOString(),
//       max: maxDate.toISOString(),
//       tickformat: '%b %d',
//       tickformatstops: [
//         { dtickrange: [null, 86400000], value: '%b %d' },
//         { dtickrange: [86400000, 2592000000], value: '%b %d' },
//         { dtickrange: [2592000000, null], value: '%b %Y' }
//       ],
//       nticks: Math.ceil(candleData.length / 5),
//       rangeslider: { visible: false },
//       gridcolor: '#f1f5f9',
//       linecolor: '#cbd5e1',
//       showline: true,
//       zeroline: false,
//       showgrid: true,
//       tickfont: { size: 10, color: '#64748b' },
//       title: { text: 'Date', font: { size: 12, color: '#64748b' } },
//       tickmode: 'auto',
//       showspikes: true,
//       spikecolor: '#94a3b8',
//       spikethickness: 1,
//       spikedash: 'dot'
//     },
//     yaxis: {
//       title: { text: 'Price (₹)', font: { size: 12, color: '#64748b' } },
//       range: [minPrice, maxPrice],
//       gridcolor: '#f1f5f9',
//       linecolor: '#cbd5e1',
//       showline: true,
//       zeroline: false,
//       showgrid: true,
//       tickfont: { size: 10, color: '#64748b' },
//       tickformat: '₹.2f',
//       showspikes: true,
//       spikecolor: '#94a3b8',
//       spikethickness: 1,
//       spikedash: 'dot',
//       domain: [0.25, 1],
//       nticks: 5
//     },
//     yaxis2: {
//       title: { text: 'Volume', font: { size: 12, color: '#64748b' } },
//       gridcolor: '#f1f5f9',
//       showgrid: false,
//       showticklabels: true,
//       tickfont: { size: 9, color: '#64748b' },
//       domain: [0, 0.15]
//     },
//     margin: { l: 50, r: isHoveringPlot ? 150 : 30, t: 40, b: 40 },
//     showlegend: true,
//     legend: {
//       orientation: 'h',
//       x: 0.5,
//       xanchor: 'center',
//       y: 0,
//       bgcolor: 'rgba(255,255,255,0.7)',
//       bordercolor: '#e2e8f0',
//       borderwidth: 1,
//       font: { size: 12, color: '#334155' }
//     },
//     paper_bgcolor: 'rgba(0,0,0,0)',
//     plot_bgcolor: 'rgba(255,255,255,0.8)',
//     hovermode: 'x unified',
//     uirevision: 'true'
//   };

//   const handleHover = (data) => {
//     setIsHoveringPlot(true);
//     if (data.points && data.points[0]) {
//       const point = data.points[0];
//       const hoveredDate = point.x;
//       const candle = candleData.find(d => d.x === hoveredDate);
//       if (candle) {
//         setHoverInfo(candle);
//       }
//     }
//   };

//   const handleUnhover = () => {
//     setIsHoveringPlot(false);
//     setHoverInfo(null);
//   };

//   const getCandleColor = (hover) => {
//     if (!hover) return '';
//     return hover.close > hover.open ? '#16a34a' : '#dc2626';
//   };

//   const handleRelayout = (event) => {
//     if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
//       const start = new Date(event['xaxis.range[0]']);
//       const end = new Date(event['xaxis.range[1]']);
//       setVisibleRange({
//         start: start < minDate ? minDate : start,
//         end: end > maxDate ? maxDate : end
//       });
//     } else if (event['xaxis.range'] && event['xaxis.range'].length === 2) {
//       const start = new Date(event['xaxis.range'][0]);
//       const end = new Date(event['xaxis.range'][1]);
//       setVisibleRange({
//         start: start < minDate ? minDate : start,
//         end: end > maxDate ? maxDate : end
//       });
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <div className="header-left">
//           <div className="header-icon">
//             <FaChartLine />
//           </div>
//           <div>
//             <h2>Professional Candlestick Analysis</h2>
//             <p>Advanced pattern detection for {symbol}</p>
//           </div>
//         </div>
//         <div className="header-controls">
//           <div className="date-range-selector">
//             <FaCalendarAlt />
//             {['1M', '3M', '6M', '1Y', 'All'].map(range => (
//               <button
//                 key={range}
//                 className={dateRange === range ? 'active' : ''}
//                 onClick={() => setDateRange(range)}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//           <button
//             className={`pattern-toggle ${isPatternPanelOpen ? 'active' : ''}`}
//             onClick={() => setIsPatternPanelOpen(!isPatternPanelOpen)}
//           >
//             <FaFilter /> {isPatternPanelOpen ? 'Hide Patterns' : 'Show Patterns'}
//           </button>
//         </div>
//       </div>

//       <div className="stats-row">
//         <div className="stats-toggle" onClick={() => setShowStats(!showStats)}>
//           {showStats ? <FaChevronDown /> : <FaChevronRight />} Market Summary
//         </div>
//         {showStats && (
//           <div className="stats-container">
//             <div className="stat-card">
//               <div className="stat-label">Price</div>
//               <div className="stat-value">₹{currentPrice.toFixed(2)}</div>
//               <div className="stat-change" style={{ color: priceChangeColor }}>
//                 {priceChangeIcon} {priceChangePct.toFixed(2)}%
//               </div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-label">Patterns Detected</div>
//               <div className="stat-value">{totalPatterns}</div>
//               <div className="stat-change">
//                 {data.pattern_markers.length} types
//               </div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-label">Timeframe</div>
//               <div className="stat-value">{candleData.length} days</div>
//               <div className="stat-change">
//                 {new Date(data.candlestick.x[0]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(data.candlestick.x[data.candlestick.x.length - 1]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="main-content">
//         <div className="chart-container">
//           <div className="plot-container" onMouseEnter={() => setIsHoveringPlot(true)} onMouseLeave={() => setIsHoveringPlot(false)}>
//             <Plot
//               data={plotlyData}
//               layout={plotlyLayout}
//               style={{ width: '100%', height: '100%' }}
//               config={{
//                 responsive: true,
//                 displayModeBar: false,
//                 displaylogo: false,
//                 scrollZoom: true
//               }}
//               onHover={handleHover}
//               onUnhover={handleUnhover}
//               onRelayout={handleRelayout}
//             />
//             {isHoveringPlot && (
//               <div className="hover-details">
//                 {hoverInfo ? (
//                   <div className="hover-details-content">
//                     <div className="hover-header">
//                       <span className="hover-date">
//                         {new Date(hoverInfo.x).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
//                       </span>
//                       <span className="hover-price" style={{ color: hoverInfo.close >= hoverInfo.open ? '#16a34a' : '#dc2626' }}>
//                         ₹{hoverInfo.close.toFixed(2)}
//                       </span>
//                       <span className="hover-change" style={{
//                         background: hoverInfo.close > hoverInfo.open ? 'rgba(22, 163, 74, 0.08)' : 'rgba(220, 38, 38, 0.08)',
//                         color: hoverInfo.close > hoverInfo.open ? '#16a34a' : '#dc2626'
//                       }}>
//                         {hoverInfo.close > hoverInfo.open ? (
//                           <FaArrowUp />
//                         ) : (
//                           <FaArrowDown />
//                         )}
//                         {Math.abs(((hoverInfo.close - hoverInfo.open) / hoverInfo.open) * 100).toFixed(2)}%
//                       </span>
//                     </div>
//                     <div className="hover-grid">
//                       <div className="hover-grid-item">
//                         <span>Open:</span>
//                         <span>{hoverInfo.open.toFixed(2)}</span>
//                       </div>
//                       <div className="hover-grid-item">
//                         <span>Close:</span>
//                         <span style={{ color: getCandleColor(hoverInfo) }}>{hoverInfo.close.toFixed(2)}</span>
//                       </div>
//                       <div className="hover-grid-item">
//                         <span>High:</span>
//                         <span>{hoverInfo.high.toFixed(2)}</span>
//                       </div>
//                       <div className="hover-grid-item">
//                         <span>Low:</span>
//                         <span>{hoverInfo.low.toFixed(2)}</span>
//                       </div>
//                       <div className="hover-grid-item">
//                         <span>Volume:</span>
//                         <span>{(hoverInfo.volume / 1000).toFixed(1)}K</span>
//                       </div>
//                     </div>
//                     {hoverInfo.patterns.length > 0 && (
//                       <div className="hover-patterns">
//                         {hoverInfo.patterns.map(p => (
//                           <span
//                             key={p.name}
//                             className="pattern-tag"
//                             style={{ borderColor: p.color }}
//                           >
//                             {p.name}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="hover-details-content">
//                     <div className="hover-header skeleton">
//                       <span className="hover-date skeleton-item"></span>
//                       <span className="hover-price skeleton-item"></span>
//                       <span className="hover-change skeleton-item"></span>
//                     </div>
//                     <div className="hover-grid">
//                       {['Open', 'Close', 'High', 'Low', 'Volume'].map((label, index) => (
//                         <div key={index} className="hover-grid-item skeleton">
//                           <span className="skeleton-item"></span>
//                           <span className="skeleton-item"></span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//         {isPatternPanelOpen && (
//           <div className={`pattern-panel ${isPatternPanelExpanded ? 'expanded' : ''}`}>
//             <div className="pattern-panel-header">
//               <h3>Detected Patterns</h3>
//               <div className="pattern-panel-controls">
//                 <div className="pattern-count">
//                   {selectedPatterns.length} of {data.pattern_markers.length} selected
//                 </div>
//                 <button
//                   className="expand-button"
//                   onClick={() => setIsPatternPanelExpanded(!isPatternPanelExpanded)}
//                   title={isPatternPanelExpanded ? 'Collapse' : 'Expand'}
//                 >
//                   <FaExpand />
//                 </button>
//               </div>
//             </div>
//             <div className="pattern-controls">
//               <button onClick={() => setSelectedPatterns(data.pattern_markers.map(trace => trace.name))}>
//                 Select All
//               </button>
//               <button onClick={() => setSelectedPatterns([])}>
//                 Clear All
//               </button>
//             </div>
//             <div className="pattern-grid">
//               {data.pattern_markers.map((pattern, index) => (
//                 <div
//                   key={index}
//                   className={`pattern-card ${selectedPatterns.includes(pattern.name) ? 'selected' : ''} ${activePattern === pattern.name ? 'active' : ''}`}
//                   style={{
//                     borderColor: pattern.marker.color,
//                     backgroundColor: selectedPatterns.includes(pattern.name) ? `${pattern.marker.color}26` : '#f9fafb'
//                   }}
//                   onClick={() => {
//                     setActivePattern(activePattern === pattern.name ? null : pattern.name);
//                     setSelectedPatterns(prev =>
//                       prev.includes(pattern.name)
//                         ? prev.filter(p => p !== pattern.name)
//                         : [...prev, pattern.name]
//                     );
//                   }}
//                   onMouseEnter={() => setActivePattern(pattern.name)}
//                   onMouseLeave={() => setActivePattern(null)}
//                 >
//                   <div
//                     className="pattern-icon"
//                     style={{
//                       backgroundColor: pattern.marker.color,
//                       backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='${getSymbolPath(PATTERN_SYMBOLS[pattern.name] || 'circle')}' fill='white'/%3E%3C/svg%3E")`
//                     }}
//                   ></div>
//                   <div className="pattern-name">{pattern.name}</div>
//                   <div className="pattern-count">{pattern.x.length}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .dashboard-container {
//           max-width: 100%;
//           width: 100%;
//           height: 100vh;
//           padding: 8px;
//           box-sizing: border-box;
//           font-family: 'Inter', 'Segoe UI', sans-serif;
//           background: rgba(255, 255, 255, 0.9);
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//         }

//         .dashboard-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 6px 8px;
//           margin-bottom: 4px;
//           flex-shrink: 0;
//         }

//         .header-left {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .header-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 32px;
//           height: 32px;
//           background: linear-gradient(135deg, #4361ee 0%, #2a44c4 100%);
//           border-radius: 6px;
//           color: white;
//           font-size: 1rem;
//         }

//         .dashboard-header h2 {
//           font-size: 1rem;
//           font-weight: 700;
//           color: #212529;
//           margin: 0;
//         }

//         .dashboard-header p {
//           font-size: 0.75rem;
//           color: #6c757d;
//           margin: 0;
//         }

//         .header-controls {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .date-range-selector {
//           display: flex;
//           align-items: center;
//           background: white;
//           border: 1px solid #e2e8f0;
//           border-radius: 4px;
//           padding: 3px;
//           margin-right: 6px;
//         }

//         .date-range-selector svg {
//           color: #adb5bd;
//           margin-right: 4px;
//           font-size: 0.8rem;
//         }

//         .date-range-selector button {
//           padding: 3px 6px;
//           border: none;
//           border-radius: 3px;
//           color: #6c757d;
//           font-weight: 500;
//           font-size: 0.7rem;
//           cursor: pointer;
//           background: transparent;
//         }

//         .date-range-selector button.active {
//           background: #4361ee;
//           color: white;
//         }

//         .pattern-toggle {
//           padding: 4px 8px;
//           background: white;
//           border: 1px solid #e2e8f0;
//           border-radius: 4px;
//           color: #6c757d;
//           font-weight: 600;
//           font-size: 0.75rem;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//         }

//         .pattern-toggle.active {
//           background: #4361ee;
//           color: white;
//           border-color: #4361ee;
//         }

//         .stats-row {
//           margin: 0 8px 4px;
//           flex-shrink: 0;
//         }

//         .stats-toggle {
//           font-size: 0.8rem;
//           font-weight: 600;
//           color: #64748b;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           padding: 3px 0;
//         }

//         .stats-container {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 6px;
//           margin-top: 3px;
//         }

//         .stat-card {
//           background: white;
//           border-radius: 4px;
//           padding: 6px;
//           box-shadow: 0 1px 2px rgba(0,0,0,0.05);
//           border: 1px solid #edf2f7;
//           display: flex;
//           flex-direction: row;
//         }

//         .stat-label {
//           font-size: 0.7rem;
//           color: #6c757d;
//           margin-bottom: 3px;
//           font-weight: 500;
//           padding: 4px;
//           margin-right: 8px;
//         }

//         .stat-value {
//           font-size: 1rem;
//           font-weight: 700;
//           color: #212529;
//           margin-bottom: 3px;
//         }

//         .stat-change {
//           font-size: 0.7rem;
//           font-weight: 600;
//           display: flex;
//           align-items: center;
//           gap: 2px;
//           padding-left: 80px;
//         }

//         .main-content {
//           display: flex;
//           flex: 1;
//           overflow: hidden;
//           position: relative;
//         }

//         .chart-container {
//           flex: 1;
//           display: flex;
//           position: relative;
//           overflow: hidden;
//         }

//         .plot-container {
//           flex: 1;
//           border-radius: 4px;
//           overflow: hidden;
//           border: 1px solid #e2e8f0;
//           position: relative;
//         }

//         .hover-details {
//           width: 120px;
//           background: white;
//           border: 1px solid #e2e8f0;
//           border-radius: 4px;
//           padding: 6px;
//           position: absolute;
//           right: 0;
//           top: 0;
//           bottom: 0;
//           display: flex;
//           flex-direction: column;
//           z-index: 10;
//           transition: opacity 0.3s ease;
//           opacity: 1;
//         }

//         .hover-details-content {
//           height: 100%;
//           display: flex;
//           flex-direction: column;
//         }

//         .hover-header {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin-bottom: 4px;
//           padding-bottom: 4px;
//           border-bottom: 1px solid #f1f5f9;
//         }

//         .hover-header.skeleton .skeleton-item {
//           background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
//           background-size: 200% 100%;
//           animation: skeleton-loading 1.5s infinite;
//           border-radius: 3px;
//         }

//         .hover-header.skeleton .skeleton-item:first-child {
//           width: 80px;
//           height: 12px;
//           margin-bottom: 4px;
//         }

//         .hover-header.skeleton .skeleton-item:nth-child(2) {
//           width: 60px;
//           height: 12px;
//           margin-bottom: 4px;
//         }

//         .hover-header.skeleton .skeleton-item:last-child {
//           width: 50px;
//           height: 10px;
//         }

//         .hover-date {
//           font-size: 0.8rem;
//           color: #64748b;
//           font-weight: 500;
//         }

//         .hover-price {
//           font-size: 0.8rem;
//           font-weight: 600;
//         }

//         .hover-change {
//           font-size: 0.7rem;
//           padding: 2px 4px;
//           border-radius: 3px;
//           font-weight: 500;
//           display: flex;
//           align-items: center;
//           gap: 3px;
//         }

//         .hover-grid {
//           display: flex;
//           flex-direction: column;
//           gap: 3px;
//           margin-bottom: 4px;
//           flex: 1;
//         }

//         .hover-grid-item {
//           background: #f1f5f9;
//           border-radius: 3px;
//           padding: 4px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         .hover-grid-item.skeleton span {
//           background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
//           background-size: 200% 100%;
//           animation: skeleton-loading 1.5s infinite;
//           border-radius: 3px;
//         }

//         .hover-grid-item.skeleton span:first-child {
//           width: 50px;
//           height: 10px;
//           margin-bottom: 2px;
//         }

//         .hover-grid-item.skeleton span:last-child {
//           width: 40px;
//           height: 10px;
//         }

//         .hover-grid-item span:first-child {
//           font-size: 0.6rem;
//           font-weight: 600;
//           color: #5b697c;
//           margin-bottom: 2px;
//         }

//         .hover-grid-item span:last-child {
//           font-size: 0.7rem;
//           font-weight: 600;
//           color: #1e293b;
//         }

//         .hover-patterns {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 3px;
//           margin-top: auto;
//         }

//         .pattern-tag {
//           font-size: 0.6rem;
//           font-weight: 600;
//           padding: 2px 4px;
//           border-radius: 3px;
//           background: rgba(99, 102, 241, 0.1);
//           display: flex;
//           gap: 3px;
//         }

//         .pattern-panel {
//           width: 180px;
//           background: white;
//           border-radius: 6px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.05);
//           border: 1px solid #e2e8f0;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//           position: absolute;
//           right: 160px;
//           top: 0;
//           bottom: 0;
//           z-index: 5;
//           transition: width 0.3s ease;
//         }

//         .pattern-panel.expanded {
//           width: 300px;
//         }

//         .pattern-panel-header {
//           padding: 6px 8px;
//           background: linear-gradient(120deg, #4361ee 0%, #3a56e4 100%);
//           border-bottom: 1px solid rgba(226, 232, 240, 0.5);
//           color: white;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .pattern-panel-controls {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .expand-button {
//           background: none;
//           border: none;
//           color: white;
//           cursor: pointer;
//           padding: 4px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .expand-button:hover {
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 4px;
//         }

//         .pattern-panel-header h3 {
//           font-size: 0.9rem;
//           font-weight: 700;
//           margin: 0;
//         }

//         .pattern-count {
//           background: #f0f4fe;
//           color: #2a44c4;
//           padding: 3px 6px;
//           border-radius: 10px;
//           font-size: 0.7rem;
//           font-weight: 600;
//         }

//         .pattern-controls {
//           padding: 4px 8px;
//           display: flex;
//           gap: 4px;
//           background: #f9fafb;
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .pattern-controls button {
//           flex: 1;
//           padding: 4px;
//           background: white;
//           border: 1px solid #dee2e6;
//           border-radius: 3px;
//           color: #495057;
//           font-weight: 600;
//           font-size: 0.7rem;
//           cursor: pointer;
//         }

//         .pattern-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 6px;
//           padding: 6px;
//           overflow-y: auto;
//           flex: 1;
//         }

//         .pattern-panel.expanded .pattern-grid {
//           grid-template-columns: repeat(3, 1fr);
//         }

//         .pattern-card {
//           border-radius: 4px;
//           padding: 6px;
//           font-size: 0.6rem;
//           cursor: pointer;
//           position: relative;
//           overflow: hidden;
//           border: 1px solid;
//           transition: all 0.2s;
//         }

//         .pattern-card.selected {
//           box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
//         }

//         .pattern-card.active {
//           transform: scale(1.02);
//         }

//         .pattern-icon {
//           width: 20px;
//           height: 20px;
//           border-radius: 3px;
//           background-size: 60%;
//           background-repeat: no-repeat;
//           background-position: center;
//           margin: 0 auto 4px;
//           border: 1px solid rgba(0, 0, 0, 0.1);
//         }

//         .pattern-name {
//           font-weight: 700;
//           color: #212529;
//           text-align: center;
//           margin-bottom: 3px;
//           line-height: 1.2;
//           font-size: 0.6rem;
//         }

//         .pattern-count {
//           font-size: 0.6rem;
//           color: #495057;
//           background: #f8f9fa;
//           padding: 2px 4px;
//           border-radius: 6px;
//           text-align: center;
//         }

//         .loading-container {
//           width: 100%;
//           height: 100vh;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           font-family: 'Inter', sans-serif;
//         }

//         .loading-spinner {
//           width: 32px;
//           height: 32px;
//           border: 3px solid rgba(67, 97, 238, 0.2);
//           border-top: 3px solid #4361ee;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 0.8rem;
//         }

//         .loading-text {
//           font-size: 0.9rem;
//           font-weight: 500;
//           color: #495057;
//         }

//         .error-container {
//           width: 100%;
//           height: 100vh;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//           font-family: 'Inter', sans-serif;
//           padding: 16px;
//         }

//         .error-icon {
//           font-size: 2rem;
//           color: #ced4da;
//           margin-bottom: 0.8rem;
//         }

//         .error-container h3 {
//           font-size: 1.1rem;
//           margin-bottom: 0.4rem;
//           color: #343a40;
//         }

//         .error-container p {
//           color: #6c757d;
//           max-width: 400px;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         @keyframes skeleton-loading {
//           0% { background-position: 200% 0; }
//           100% { background-position: -200% 0; }
//         }
//       `}</style>
//     </div>
//   );
// }

// function getSymbolPath(symbol) {
//   const paths = {
//     'circle': 'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z',
//     'square': 'M20,20 L80,20 L80,80 L20,80 Z',
//     'diamond': 'M50,20 L80,50 L50,80 L20,50 Z',
//     'cross': 'M30,30 L70,70 M70,30 L30,70',
//     'x': 'M30,30 L70,70 M70,30 L30,70',
//     'triangle-up': 'M50,20 L80,80 L20,80 Z',
//     'triangle-down': 'M50,80 L20,20 L80,20 Z',
//     'pentagon': 'M50,10 L80,40 L65,80 L35,80 L20,40 Z',
//     'hexagon': 'M30,50 L50,20 L70,50 L70,80 L50,110 L30,80 Z',
//     'star': 'M50,10 L61,40 L95,40 L68,60 L79,90 L50,70 L21,90 L32,60 L5,40 L39,40 Z',
//     'hexagram': 'M50,10 L61,40 L95,40 L68,60 L79,90 L50,70 L21,90 L32,60 L5,40 L39,40 Z M50,90 L39,60 L5,60 L32,40 L21,10 L50,30 L79,10 L68,40 L95,60 L61,60 Z',
//     'bowtie': 'M30,30 L70,30 L30,70 L70,70 Z',
//     'hourglass': 'M30,30 L70,30 L50,50 L70,70 L30,70 L50,50 Z'
//   };
//   return paths[symbol] || paths['circle'];
// }

// ---------------working code(28/10/25)-----------------------------

// import React, { useState, useEffect, useMemo } from 'react';
// import Plot from 'react-plotly.js';
// import { FaChartLine, FaFilter, FaInfoCircle, FaCaretUp, FaCaretDown, FaCalendarAlt, FaArrowUp, FaArrowDown, FaChevronDown, FaChevronRight, FaExpand } from 'react-icons/fa';

// // Pattern symbols mapping
// const PATTERN_SYMBOLS = {
//   'Hammer': 'circle',
//   'Engulfing': 'square',
//   'Doji': 'diamond',
//   'Harami': 'cross',
//   'Shooting Star': 'x',
//   'Morning Star': 'triangle-up',
//   'Evening Star': 'triangle-down',
//   'Piercing': 'pentagon',
//   'Dark Cloud': 'hexagon',
//   'Three White Soldiers': 'star',
//   'Three Black Crows': 'hexagram',
//   'Hanging Man': 'bowtie',
//   'Inverted Hammer': 'hourglass'
// };

// export default function CandlePatternPlot({ symbol }) {
//   const [raw, setRaw] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPatterns, setSelectedPatterns] = useState([]);
//   const [activePattern, setActivePattern] = useState(null);
//   const [isPatternPanelOpen, setIsPatternPanelOpen] = useState(false);
//   const [isPatternPanelExpanded, setIsPatternPanelExpanded] = useState(false);
//   const [dateRange, setDateRange] = useState('3M');
//   const [clickInfo, setClickInfo] = useState(null);
//   const [visibleRange, setVisibleRange] = useState(null);
//   const [showStats, setShowStats] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     fetch(`${API_BASE}/candle-patterns`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then(res => res.json())
//       .then(json => {
//         if (json.error) {
//           setError(json.error);
//           setLoading(false);
//           return;
//         }
//         if (!json.candlestick || !Array.isArray(json.candlestick.x)) {
//           setError('Invalid data format: candlestick data missing or invalid');
//           setLoading(false);
//           return;
//         }
//         setRaw(json);
//         const patterns = [...new Set(json.pattern_markers?.map(trace => trace.name) || [])];
//         setSelectedPatterns(patterns);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError('Failed to fetch data from the server');
//         setLoading(false);
//       });
//   }, [symbol]);

//   const today = new Date();
//   const dateRanges = useMemo(() => {
//     if (!raw || !raw.candlestick || !Array.isArray(raw.candlestick.x)) return {};
//     const allDates = raw.candlestick.x.map(d => new Date(d));
//     const minDate = new Date(Math.min(...allDates));
//     return {
//       '1M': new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
//       '3M': new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
//       '6M': new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
//       '1Y': new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
//       'All': minDate
//     };
//   }, [raw]);

//   const filteredData = raw;

//   if (loading || !raw) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <div className="loading-text">Analyzing candle patterns...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <FaInfoCircle className="error-icon" />
//         <h3>Data Unavailable</h3>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (!raw.candlestick || !Array.isArray(raw.candlestick.x) || !raw.candlestick.x.length) {
//     return (
//       <div className="error-container">
//         <FaInfoCircle className="error-icon" />
//         <h3>No Data Available</h3>
//         <p>No valid candlestick data available</p>
//       </div>
//     );
//   }

//   const data = filteredData || raw;
//   const currentPrice = data.candlestick.close[data.candlestick.close.length - 1] || 0;
//   const initialPrice = data.candlestick.close[0] || 1;
//   const priceChangePct = initialPrice !== 0 ? ((currentPrice - initialPrice) / initialPrice) * 100 : 0;
//   const totalPatterns = data.pattern_markers.reduce((sum, trace) => sum + (trace.x?.length || 0), 0);
//   const priceChangeColor = priceChangePct >= 0 ? '#22c55e' : '#ef4444';
//   const priceChangeIcon = priceChangePct >= 0 ? <FaCaretUp /> : <FaCaretDown />;

//   const patternsByDate = {};
//   data.pattern_markers.forEach(patternTrace => {
//     patternTrace.x.forEach((date, i) => {
//       if (!patternsByDate[date]) patternsByDate[date] = [];
//       patternsByDate[date].push({
//         name: patternTrace.name,
//         color: patternTrace.marker.color,
//         hovertext: patternTrace.hovertext[i]
//       });
//     });
//   });

//   const candleData = data.candlestick.x
//     .map((date, i) => ({
//       x: date,
//       open: Number(data.candlestick.open[i]),
//       high: Number(data.candlestick.high[i]),
//       low: Number(data.candlestick.low[i]),
//       close: Number(data.candlestick.close[i]),
//       volume: Number(data.volume.y[i]),
//       patterns: patternsByDate[date] || [],
//     }))
//     .filter(d =>
//       d.x &&
//       !isNaN(d.open) && !isNaN(d.high) &&
//       !isNaN(d.low) && !isNaN(d.close) &&
//       !isNaN(d.volume)
//     );

//   if (!candleData.length) {
//     return (
//       <div className="error-container">
//         <FaInfoCircle className="error-icon" />
//         <h3>Invalid Data</h3>
//         <p>Candlestick data contains invalid values for {symbol}.</p>
//       </div>
//     );
//   }

//   const patternTraces = data.pattern_markers
//     .filter(pattern => selectedPatterns.includes(pattern.name))
//     .map(pattern => {
//       const patternPoints = pattern.x.map((date, i) => {
//         const candleIndex = candleData.findIndex(d => d.x === date);
//         if (candleIndex === -1) return null;
//         const candle = candleData[candleIndex];
//         return {
//           x: date,
//           y: candle.high * 1.02,
//           pattern: pattern.name,
//           color: pattern.marker.color,
//           hovertext: pattern.hovertext?.[i] || `Pattern: ${pattern.name}`
//         };
//       }).filter(Boolean);
//       return {
//         type: 'scatter',
//         mode: 'markers',
//         name: pattern.name,
//         x: patternPoints.map(p => p.x),
//         y: patternPoints.map(p => p.y),
//         hoverinfo: 'text',
//         text: patternPoints.map(p => p.hovertext),
//         marker: {
//           symbol: PATTERN_SYMBOLS[pattern.name] || 'circle',
//           color: pattern.marker.color,
//           size: 12,
//           line: { width: 1, color: pattern.marker.color }
//         },
//         showlegend: true
//       };
//     });

//   const volumeData = candleData.map(d => ({
//     x: d.x,
//     y: d.volume,
//     hovertext: `Volume: ${d.volume.toLocaleString('en-IN')}`,
//     color: d.close >= d.open ? '#22c55e' : '#ef4444',
//   }));

//   const minPrice = Math.min(...candleData.map(d => d.low)) * 0.95;
//   const maxPrice = Math.max(...candleData.map(d => d.high)) * 1.05;
//   const minDate = new Date(Math.min(...raw.candlestick.x.map(d => new Date(d))));
//   const maxDate = new Date(Math.max(...raw.candlestick.x.map(d => new Date(d))));

//   const plotlyData = [
//     {
//       type: 'candlestick',
//       name: symbol,
//       x: candleData.map(d => d.x),
//       open: candleData.map(d => d.open),
//       high: candleData.map(d => d.high),
//       low: candleData.map(d => d.low),
//       close: candleData.map(d => d.close),
//       increasing: { line: { color: '#22c55e' }, fillcolor: 'rgba(34, 197, 94, 0.3)' },
//       decreasing: { line: { color: '#ef4444' }, fillcolor: 'rgba(239, 68, 68, 0.3)' },
//       hoverinfo: 'none'
//     },
//     ...patternTraces,
//     {
//       type: 'bar',
//       name: 'Volume',
//       x: volumeData.map(d => d.x),
//       y: volumeData.map(d => d.y),
//       marker: { color: volumeData.map(d => d.color), opacity: 0.7 },
//       yaxis: 'y2',
//       hoverinfo: 'text',
//       text: volumeData.map(d => d.hovertext),
//     }
//   ];

//   const plotlyLayout = {
//     dragmode: 'pan',
//     title: { text: `${symbol} Candlestick Chart`, font: { size: 18, color: '#1e293b', family: 'Inter, sans-serif' }, x: 0.05, y: 0.98 },
//     xaxis: {
//       type: 'date',
//       autorange: false,
//       range: [
//         new Date(dateRanges[dateRange]).toISOString(),
//         today.toISOString()
//       ],
//       rangebreaks: [
//         { bounds: [null, minDate.toISOString()], pattern: 'day' },
//         { bounds: [maxDate.toISOString(), null], pattern: 'day' },
//         { bounds: ["sat", "mon"], pattern: 'day' }
//       ],
//       min: minDate.toISOString(),
//       max: maxDate.toISOString(),
//       tickformat: '%b %d',
//       tickformatstops: [
//         { dtickrange: [null, 86400000], value: '%b %d' },
//         { dtickrange: [86400000, 2592000000], value: '%b %d' },
//         { dtickrange: [2592000000, null], value: '%b %Y' }
//       ],
//       nticks: Math.ceil(candleData.length / 5),
//       rangeslider: { visible: false },
//       gridcolor: '#e5e7eb',
//       linecolor: '#d1d5db',
//       showline: true,
//       zeroline: false,
//       showgrid: true,
//       tickfont: { size: 11, color: '#4b5563' },
//       title: { text: 'Date', font: { size: 13, color: '#4b5563' } },
//       tickmode: 'auto',
//       showspikes: true,
//       spikecolor: '#9ca3af',
//       spikethickness: 1,
//       spikedash: 'dot'
//     },
//     yaxis: {
//       title: { text: 'Price (₹)', font: { size: 13, color: '#4b5563' } },
//       range: [minPrice, maxPrice],
//       gridcolor: '#e5e7eb',
//       linecolor: '#d1d5db',
//       showline: true,
//       zeroline: false,
//       showgrid: true,
//       tickfont: { size: 11, color: '#4b5563' },
//       tickformat: '₹.2f',
//       showspikes: true,
//       spikecolor: '#9ca3af',
//       spikethickness: 1,
//       spikedash: 'dot',
//       domain: [0.25, 1],
//       nticks: 5
//     },
//     yaxis2: {
//       title: { text: 'Volume', font: { size: 13, color: '#4b5563' } },
//       gridcolor: '#e5e7eb',
//       showgrid: false,
//       showticklabels: true,
//       tickfont: { size: 10, color: '#4b5563' },
//       domain: [0, 0.15]
//     },
//     margin: { l: 60, r: 30, t: 60, b: 50 },
//     showlegend: true,
//     legend: {
//       orientation: 'h',
//       x: 0.5,
//       xanchor: 'center',
//       y: -0.1,
//       bgcolor: 'rgba(255,255,255,0.9)',
//       bordercolor: '#e5e7eb',
//       borderwidth: 1,
//       font: { size: 12, color: '#1e293b' }
//     },
//     paper_bgcolor: 'rgba(0,0,0,0)',
//     plot_bgcolor: 'rgba(255,255,255,0.95)',
//     hovermode: 'x unified',
//     uirevision: 'true'
//   };

//   const handleClick = (data) => {
//     if (data.points && data.points[0]) {
//       const point = data.points[0];
//       const clickedDate = point.x;
//       const candle = candleData.find(d => d.x === clickedDate);
//       if (candle) {
//         setClickInfo(candle);
//       }
//     } else {
//       setClickInfo(null);
//     }
//   };

//   const getCandleColor = (click) => {
//     if (!click) return '';
//     return click.close > click.open ? '#22c55e' : '#ef4444';
//   };

//   const handleRelayout = (event) => {
//     if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
//       const start = new Date(event['xaxis.range[0]']);
//       const end = new Date(event['xaxis.range[1]']);
//       setVisibleRange({
//         start: start < minDate ? minDate : start,
//         end: end > maxDate ? maxDate : end
//       });
//     } else if (event['xaxis.range'] && event['xaxis.range'].length === 2) {
//       const start = new Date(event['xaxis.range'][0]);
//       const end = new Date(event['xaxis.range'][1]);
//       setVisibleRange({
//         start: start < minDate ? minDate : start,
//         end: end > maxDate ? maxDate : end
//       });
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <div className="header-left">
//           <div className="header-icon">
//             <FaChartLine />
//           </div>
//           <div>
//             <h2>{symbol} Candlestick Analysis</h2>
//             <p>Advanced pattern detection and insights</p>
//           </div>
//         </div>
//         <div className="header-controls">
//           <div className="date-range-selector">
//             <FaCalendarAlt />
//             {['1M', '3M', '6M', '1Y', 'All'].map(range => (
//               <button
//                 key={range}
//                 className={dateRange === range ? 'active' : ''}
//                 onClick={() => setDateRange(range)}
//               >
//                 {range}
//               </button>
//             ))}
//           </div>
//           <button
//             className={`pattern-toggle ${isPatternPanelOpen ? 'active' : ''}`}
//             onClick={() => setIsPatternPanelOpen(!isPatternPanelOpen)}
//           >
//             <FaFilter /> {isPatternPanelOpen ? 'Hide Patterns' : 'Show Patterns'}
//           </button>
//         </div>
//       </div>

//       <div className="stats-row">
//         <div className="stats-toggle" onClick={() => setShowStats(!showStats)}>
//           {showStats ? <FaChevronDown /> : <FaChevronRight />} Market Summary
//         </div>
//         {showStats && (
//           <div className="stats-container">
//             <div className="stat-card">
//               <div className="stat-label">Price</div>
//               <div className="stat-value">₹{currentPrice.toFixed(2)}</div>
//               <div className="stat-change" style={{ color: priceChangeColor }}>
//                 {priceChangeIcon} {priceChangePct.toFixed(2)}%
//               </div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-label">Patterns Detected</div>
//               <div className="stat-value">{totalPatterns}</div>
//               <div className="stat-change">
//                 {data.pattern_markers.length} types
//               </div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-label">Timeframe</div>
//               <div className="stat-value">{candleData.length} days</div>
//               <div className="stat-change">
//                 {new Date(data.candlestick.x[0]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(data.candlestick.x[data.candlestick.x.length - 1]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="main-content">
//         <div className="chart-container">
//           <div className="plot-container">
//             {clickInfo && (
//               <div className="click-details">
//                 <div className="click-details-content">
//                   <div className="click-header">
//                     <span className="click-date">
//                       {new Date(clickInfo.x).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
//                     </span>
//                     <span className="click-price" style={{ color: getCandleColor(clickInfo) }}>
//                       ₹{clickInfo.close.toFixed(2)}
//                     </span>
//                     <span className="click-change" style={{
//                       background: clickInfo.close > clickInfo.open ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
//                       color: clickInfo.close > clickInfo.open ? '#22c55e' : '#ef4444'
//                     }}>
//                       {clickInfo.close > clickInfo.open ? (
//                         <FaArrowUp />
//                       ) : (
//                         <FaArrowDown />
//                       )}
//                       {Math.abs(((clickInfo.close - clickInfo.open) / clickInfo.open) * 100).toFixed(2)}%
//                     </span>
//                   </div>
//                   <div className="click-grid">
//                     <div className="click-grid-item">
//                       <span>Open</span>
//                       <span>₹{clickInfo.open.toFixed(2)}</span>
//                     </div>
//                     <div className="click-grid-item">
//                       <span>Close</span>
//                       <span style={{ color: getCandleColor(clickInfo) }}>₹{clickInfo.close.toFixed(2)}</span>
//                     </div>
//                     <div className="click-grid-item">
//                       <span>High</span>
//                       <span>₹{clickInfo.high.toFixed(2)}</span>
//                     </div>
//                     <div className="click-grid-item">
//                       <span>Low</span>
//                       <span>₹{clickInfo.low.toFixed(2)}</span>
//                     </div>
//                     <div className="click-grid-item">
//                       <span>Volume</span>
//                       <span>{(clickInfo.volume / 1000).toFixed(1)}K</span>
//                     </div>
//                   </div>
//                   {clickInfo.patterns.length > 0 && (
//                     <div className="click-patterns">
//                       {clickInfo.patterns.map(p => (
//                         <span
//                           key={p.name}
//                           className="pattern-tag"
//                           style={{ backgroundColor: `${p.color}20`, color: p.color }}
//                         >
//                           {p.name}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//             <Plot
//               data={plotlyData}
//               layout={plotlyLayout}
//               style={{ width: '100%', height: '100%' }}
//               config={{
//                 responsive: true,
//                 displayModeBar: false,
//                 displaylogo: false,
//                 scrollZoom: true,
//                 maintainAspectRatio: false,
//               }}
//               onClick={handleClick}
//               onRelayout={handleRelayout}
//             />
//           </div>
//         </div>
//         {isPatternPanelOpen && (
//           <div className={`pattern-panel ${isPatternPanelExpanded ? 'expanded' : ''}`}>
//             <div className="pattern-panel-header">
//               <h3>Detected Patterns</h3>
//               <div className="pattern-panel-controls">
//                 <div className="pattern-count">
//                   {selectedPatterns.length} of {data.pattern_markers.length} selected
//                 </div>
//                 <button
//                   className="expand-button"
//                   onClick={() => setIsPatternPanelExpanded(!isPatternPanelExpanded)}
//                   title={isPatternPanelExpanded ? 'Collapse' : 'Expand'}
//                 >
//                   <FaExpand />
//                 </button>
//               </div>
//             </div>
//             <div className="pattern-controls">
//               <button onClick={() => setSelectedPatterns(data.pattern_markers.map(trace => trace.name))}>
//                 Select All
//               </button>
//               <button onClick={() => setSelectedPatterns([])}>
//                 Clear All
//               </button>
//             </div>
//             <div className="pattern-grid">
//               {data.pattern_markers.map((pattern, index) => (
//                 <div
//                   key={index}
//                   className={`pattern-card ${selectedPatterns.includes(pattern.name) ? 'selected' : ''} ${activePattern === pattern.name ? 'active' : ''}`}
//                   style={{
//                     borderColor: pattern.marker.color,
//                     backgroundColor: selectedPatterns.includes(pattern.name) ? `${pattern.marker.color}20` : '#ffffff'
//                   }}
//                   onClick={() => {
//                     setActivePattern(activePattern === pattern.name ? null : pattern.name);
//                     setSelectedPatterns(prev =>
//                       prev.includes(pattern.name)
//                         ? prev.filter(p => p !== pattern.name)
//                         : [...prev, pattern.name]
//                     );
//                   }}
//                   onMouseEnter={() => setActivePattern(pattern.name)}
//                   onMouseLeave={() => setActivePattern(null)}
//                 >
//                   <div
//                     className="pattern-icon"
//                     style={{
//                       backgroundColor: pattern.marker.color,
//                       backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='${getSymbolPath(PATTERN_SYMBOLS[pattern.name] || 'circle')}' fill='white'/%3E%3C/svg%3E")`
//                     }}
//                   ></div>
//                   <div className="pattern-name">{pattern.name}</div>
//                   <div className="pattern-count">{pattern.x.length}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .dashboard-container {
//           max-width: 100%;
//           width: 100%;
//           height: 100vh;
//           padding: 16px;
//           box-sizing: border-box;
//           font-family: 'Inter', 'Segoe UI', sans-serif;
//           background: #f9fafb;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//         }

//         .dashboard-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 12px 16px;
//           background: #ffffff;
//           border-radius: 8px;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//           margin-bottom: 12px;
//           flex-shrink: 0;
//         }

//         .header-left {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .header-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 40px;
//           height: 40px;
//           background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
//           border-radius: 8px;
//           color: white;
//           font-size: 1.2rem;
//         }

//         .dashboard-header h2 {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #1e293b;
//           margin: 0;
//         }

//         .dashboard-header p {
//           font-size: 0.875rem;
//           color: #6b7280;
//           margin: 0;
//         }

//         .header-controls {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .date-range-selector {
//           display: flex;
//           align-items: center;
//           background: #f1f5f9;
//           border-radius: 6px;
//           padding: 4px;
//           border: 1px solid #e5e7eb;
//         }

//         .date-range-selector svg {
//           color: #6b7280;
//           margin: 0 8px;
//           font-size: 1rem;
//         }

//         .date-range-selector button {
//           padding: 6px 12px;
//           border: none;
//           border-radius: 4px;
//           color: #4b5563;
//           font-weight: 600;
//           font-size: 0.875rem;
//           cursor: pointer;
//           background: transparent;
//           transition: all 0.2s;
//         }

//         .date-range-selector button.active {
//           background: #3b82f6;
//           color: white;
//         }

//         .date-range-selector button:hover {
//           background: #e5e7eb;
//         }

//         .pattern-toggle {
//           padding: 8px 16px;
//           background: #ffffff;
//           border: 1px solid #e5e7eb;
//           border-radius: 6px;
//           color: #4b5563;
//           font-weight: 600;
//           font-size: 0.875rem;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           transition: all 0.2s;
//         }

//         .pattern-toggle.active {
//           background: #3b82f6;
//           color: white;
//           border-color: #3b82f6;
//         }

//         .pattern-toggle:hover {
//           background: #f1f5f9;
//         }

//         .stats-row {
//           margin: 0 16px 12px;
//           flex-shrink: 0;
//         }

//         .stats-toggle {
//           font-size: 0.875rem;
//           font-weight: 600;
//           color: #4b5563;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 8px 0;
//         }

//         .stats-container {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 12px;
//           margin-top: 8px;
//         }

//         .stat-card {
//           background: #ffffff;
//           border-radius: 8px;
//           padding: 12px;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//           border: 1px solid #e5e7eb;
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//         }

//         .stat-label {
//           font-size: 0.75rem;
//           color: #6b7280;
//           font-weight: 500;
//           margin-bottom: 4px;
//         }

//         .stat-value {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #1e293b;
//           margin-bottom: 4px;
//         }

//         .stat-change {
//           font-size: 0.75rem;
//           font-weight: 600;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//         }

//         .main-content {
//           display: flex;
//           flex: 1;
//           overflow: hidden;
//           position: relative;
//         }

//         .chart-container {
//           flex: 1;
//           display: flex;
//           position: relative;
//           overflow: hidden;
//         }

//         .plot-container {
//           flex: 1;
//           border-radius: 8px;
//           overflow: hidden;
//           border: 1px solid #e5e7eb;
//           position: relative;
//           background: #ffffff;
//         }

//         .click-details {
//           position: sticky;
//           top: 0;
//           left: 0;
//           right: 0;
//           background: #ffffff;
//           border-bottom: 1px solid #e5e7eb;
//           border-radius: 0 0 8px 8px;
//           padding: 12px 16px;
//           z-index: 10;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .click-details-content {
//           display: flex;
//           align-items: center;
//           gap: 24px;
//           width: 100%;
//         }

//         .click-header {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .click-date {
//           font-size: 0.875rem;
//           color: #4b5563;
//           font-weight: 500;
//         }

//         .click-price {
//           font-size: 1rem;
//           font-weight: 700;
//         }

//         .click-change {
//           font-size: 0.75rem;
//           padding: 4px 8px;
//           border-radius: 4px;
//           font-weight: 600;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//         }

//         .click-grid {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }

//         .click-grid-item {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//         }

//         .click-grid-item span:first-child {
//           font-size: 0.75rem;
//           font-weight: 500;
//           color: #6b7280;
//         }

//         .click-grid-item span:last-child {
//           font-size: 0.875rem;
//           font-weight: 600;
//           color: #1e293b;
//         }

//         .click-patterns {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//           margin-left: auto;
//         }

//         .pattern-tag {
//           font-size: 0.75rem;
//           font-weight: 600;
//           padding: 4px 8px;
//           border-radius: 4px;
//         }

//         .pattern-panel {
//           width: 200px;
//           background: #ffffff;
//           border-radius: 8px;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//           border: 1px solid #e5e7eb;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//           position: absolute;
//           right: 16px;
//           top: 16px;
//           bottom: 16px;
//           z-index: 5;
//           transition: width 0.3s ease;
//         }

//         .pattern-panel.expanded {
//           width: 320px;
//         }

//         .pattern-panel-header {
//           padding: 12px 16px;
//           background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
//           color: white;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .pattern-panel-controls {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .expand-button {
//           background: none;
//           border: none;
//           color: white;
//           cursor: pointer;
//           padding: 4px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: background 0.2s;
//         }

//         .expand-button:hover {
//           background: rgba(255, 255, 255, 0.15);
//           border-radius: 4px;
//         }

//         .pattern-panel-header h3 {
//           font-size: 1rem;
//           font-weight: 700;
//           margin: 0;
//         }

//         .pattern-count {
//           background: #eff6ff;
//           color: #1d4ed8;
//           padding: 4px 8px;
//           border-radius: 12px;
//           font-size: 0.75rem;
//           font-weight: 600;
//         }

//         .pattern-controls {
//           padding: 8px 16px;
//           display: flex;
//           gap: 8px;
//           background: #f9fafb;
//           border-bottom: 1px solid #e5e7eb;
//         }

//         .pattern-controls button {
//           flex: 1;
//           padding: 8px;
//           background: #ffffff;
//           border: 1px solid #d1d5db;
//           border-radius: 6px;
//           color: #1e293b;
//           font-weight: 600;
//           font-size: 0.875rem;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .pattern-controls button:hover {
//           background: #f1f5f9;
//         }

//         .pattern-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 12px;
//           padding: 12px;
//           overflow-y: auto;
//           flex: 1;
//         }

//         .pattern-panel.expanded .pattern-grid {
//           grid-template-columns: repeat(3, 1fr);
//         }

//         .pattern-card {
//           border-radius: 6px;
//           padding: 12px;
//           cursor: pointer;
//           border: 1px solid;
//           transition: all 0.2s;
//           background: #ffffff;
//         }

//         .pattern-card.selected {
//           box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
//         }

//         .pattern-card.active {
//           transform: scale(1.03);
//           box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
//         }

//         .pattern-icon {
//           width: 24px;
//           height: 24px;
//           border-radius: 4px;
//           background-size: 50%;
//           background-repeat: no-repeat;
//           background-position: center;
//           margin: 0 auto 8px;
//           border: 1px solid rgba(0, 0, 0, 0.1);
//         }

//         .pattern-name {
//           font-weight: 700;
//           color: #1e293b;
//           text-align: center;
//           margin-bottom: 4px;
//           line-height: 1.2;
//           font-size: 0.75rem;
//         }

//         .pattern-count {
//           font-size: 0.75rem;
//           color: #4b5563;
//           background: #f1f5f9;
//           padding: 4px 8px;
//           border-radius: 8px;
//           text-align: center;
//         }

//         .loading-container {
//           width: 100%;
//           height: 100vh;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           font-family: 'Inter', sans-serif;
//         }

//         .loading-spinner {
//           width: 40px;
//           height: 40px;
//           border: 4px solid rgba(59, 130, 246, 0.2);
//           border-top: 4px solid #3b82f6;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 1rem;
//         }

//         .loading-text {
//           font-size: 1rem;
//           font-weight: 500;
//           color: #4b5563;
//         }

//         .error-container {
//           width: 100%;
//           height: 100vh;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//           font-family: 'Inter', sans-serif;
//           padding: 24px;
//         }

//         .error-icon {
//           font-size: 2.5rem;
//           color: #d1d5db;
//           margin-bottom: 1rem;
//         }

//         .error-container h3 {
//           font-size: 1.25rem;
//           margin-bottom: 0.5rem;
//           color: #1e293b;
//         }

//         .error-container p {
//           color: #6b7280;
//           max-width: 400px;
//           font-size: 0.875rem;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

// function getSymbolPath(symbol) {
//   const paths = {
//     'circle': 'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z',
//     'square': 'M20,20 L80,20 L80,80 L20,80 Z',
//     'diamond': 'M50,20 L80,50 L50,80 L20,50 Z',
//     'cross': 'M30,30 L70,70 M70,30 L30,70',
//     'x': 'M30,30 L70,70 M70,30 L30,70',
//     'triangle-up': 'M50,20 L80,80 L20,80 Z',
//     'triangle-down': 'M50,80 L20,20 L80,20 Z',
//     'pentagon': 'M50,10 L80,40 L65,80 L35,80 L20,40 Z',
//     'hexagon': 'M30,50 L50,20 L70,50 L70,80 L50,110 L30,80 Z',
//     'star': 'M50,10 L61,40 L95,40 L68,60 L79,90 L50,70 L21,90 L32,60 L5,40 L39,40 Z',
//     'hexagram': 'M50,10 L61,40 L95,40 L68,60 L79,90 L50,70 L21,90 L32,60 L5,40 L39,40 Z M50,90 L39,60 L5,60 L32,40 L21,10 L50,30 L79,10 L68,40 L95,60 L61,60 Z',
//     'bowtie': 'M30,30 L70,30 L30,70 L70,70 Z',
//     'hourglass': 'M30,30 L70,30 L50,50 L70,70 L30,70 L50,50 Z'
//   };
//   return paths[symbol] || paths['circle'];
// }


// ====================swati code-========================



import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { FaChartLine, FaFilter, FaInfoCircle, FaCaretUp, FaCaretDown, FaCalendarAlt, FaArrowUp, FaArrowDown, FaChevronDown, FaChevronRight, FaExpand } from 'react-icons/fa';
import CandlePatternRating from '../RatingFile/CandlePatternRating'; // Adjust path as needed

// Pattern symbols mapping
const PATTERN_SYMBOLS = {
  'Hammer': 'circle',
  'Engulfing': 'square',
  'Doji': 'diamond',
  'Harami': 'cross',
  'Shooting Star': 'x',
  'Morning Star': 'triangle-up',
  'Evening Star': 'triangle-down',
  'Piercing': 'pentagon',
  'Dark Cloud': 'hexagon',
  'Three White Soldiers': 'star',
  'Three Black Crows': 'hexagram',
  'Hanging Man': 'bowtie',
  'Inverted Hammer': 'hourglass'
};

export default function CandlePatternPlot({ symbol }) {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [activePattern, setActivePattern] = useState(null);
  const [isPatternPanelOpen, setIsPatternPanelOpen] = useState(false);
  const [isPatternPanelExpanded, setIsPatternPanelExpanded] = useState(false);
  const [dateRange, setDateRange] = useState('3M');
  const [clickInfo, setClickInfo] = useState(null);
  const [visibleRange, setVisibleRange] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/candle-patterns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          setError(json.error);
          setLoading(false);
          return;
        }
        if (!json.candlestick || !Array.isArray(json.candlestick.x)) {
          setError('Invalid data format: candlestick data missing or invalid');
          setLoading(false);
          return;
        }
        setRaw(json);
        const patterns = [...new Set(json.pattern_markers?.map(trace => trace.name) || [])];
        setSelectedPatterns(patterns);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data from the server');
        setLoading(false);
      });
  }, [symbol]);

  const today = new Date();
  const dateRanges = useMemo(() => {
    if (!raw || !raw.candlestick || !Array.isArray(raw.candlestick.x)) return {};
    const allDates = raw.candlestick.x.map(d => new Date(d));
    const minDate = new Date(Math.min(...allDates));
    return {
      '1M': new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
      '3M': new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
      '6M': new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
      '1Y': new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
      'All': minDate
    };
  }, [raw]);

  const filteredData = raw;

  if (loading || !raw) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Analyzing candle patterns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaInfoCircle className="error-icon" />
        <h3>Data Unavailable</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!raw.candlestick || !Array.isArray(raw.candlestick.x) || !raw.candlestick.x.length) {
    return (
      <div className="error-container">
        <FaInfoCircle className="error-icon" />
        <h3>No Data Available</h3>
        <p>No valid candlestick data available</p>
      </div>
    );
  }

  const data = filteredData || raw;
  const currentPrice = data.candlestick.close[data.candlestick.close.length - 1] || 0;
  const initialPrice = data.candlestick.close[0] || 1;
  const priceChangePct = initialPrice !== 0 ? ((currentPrice - initialPrice) / initialPrice) * 100 : 0;
  const totalPatterns = data.pattern_markers.reduce((sum, trace) => sum + (trace.x?.length || 0), 0);
  const priceChangeColor = priceChangePct >= 0 ? '#22c55e' : '#ef4444';
  const priceChangeIcon = priceChangePct >= 0 ? <FaCaretUp /> : <FaCaretDown />;

  const patternsByDate = {};
  data.pattern_markers.forEach(patternTrace => {
    patternTrace.x.forEach((date, i) => {
      if (!patternsByDate[date]) patternsByDate[date] = [];
      patternsByDate[date].push({
        name: patternTrace.name,
        color: patternTrace.marker.color,
        hovertext: patternTrace.hovertext[i]
      });
    });
  });

  const candleData = data.candlestick.x
    .map((date, i) => ({
      x: date,
      open: Number(data.candlestick.open[i]),
      high: Number(data.candlestick.high[i]),
      low: Number(data.candlestick.low[i]),
      close: Number(data.candlestick.close[i]),
      volume: Number(data.volume.y[i]),
      patterns: patternsByDate[date] || [],
    }))
    .filter(d =>
      d.x &&
      !isNaN(d.open) && !isNaN(d.high) &&
      !isNaN(d.low) && !isNaN(d.close) &&
      !isNaN(d.volume)
    );

  if (!candleData.length) {
    return (
      <div className="error-container">
        <FaInfoCircle className="error-icon" />
        <h3>Invalid Data</h3>
        <p>Candlestick data contains invalid values for {symbol}.</p>
      </div>
    );
  }

  const patternTraces = data.pattern_markers
    .filter(pattern => selectedPatterns.includes(pattern.name))
    .map(pattern => {
      const patternPoints = pattern.x.map((date, i) => {
        const candleIndex = candleData.findIndex(d => d.x === date);
        if (candleIndex === -1) return null;
        const candle = candleData[candleIndex];
        return {
          x: date,
          y: candle.high * 1.02,
          pattern: pattern.name,
          color: pattern.marker.color,
          hovertext: pattern.hovertext?.[i] || `Pattern: ${pattern.name}`
        };
      }).filter(Boolean);
      return {
        type: 'scatter',
        mode: 'markers',
        name: pattern.name,
        x: patternPoints.map(p => p.x),
        y: patternPoints.map(p => p.y),
        hoverinfo: 'text',
        text: patternPoints.map(p => p.hovertext),
        marker: {
          symbol: PATTERN_SYMBOLS[pattern.name] || 'circle',
          color: pattern.marker.color,
          size: 12,
          line: { width: 1, color: pattern.marker.color }
        },
        showlegend: true
      };
    });

  const volumeData = candleData.map(d => ({
    x: d.x,
    y: d.volume,
    hovertext: `Volume: ${d.volume.toLocaleString('en-IN')}`,
    color: d.close >= d.open ? '#22c55e' : '#ef4444',
  }));

  const minPrice = Math.min(...candleData.map(d => d.low)) * 0.95;
  const maxPrice = Math.max(...candleData.map(d => d.high)) * 1.05;
  const minDate = new Date(Math.min(...raw.candlestick.x.map(d => new Date(d))));
  const maxDate = new Date(Math.max(...raw.candlestick.x.map(d => new Date(d))));

  const plotlyData = [
    {
      type: 'candlestick',
      name: symbol,
      x: candleData.map(d => d.x),
      open: candleData.map(d => d.open),
      high: candleData.map(d => d.high),
      low: candleData.map(d => d.low),
      close: candleData.map(d => d.close),
      increasing: { line: { color: '#22c55e' }, fillcolor: 'rgba(34, 197, 94, 0.3)' },
      decreasing: { line: { color: '#ef4444' }, fillcolor: 'rgba(239, 68, 68, 0.3)' },
      hoverinfo: 'none'
    },
    ...patternTraces,
    {
      type: 'bar',
      name: 'Volume',
      x: volumeData.map(d => d.x),
      y: volumeData.map(d => d.y),
      marker: { color: volumeData.map(d => d.color), opacity: 0.7 },
      yaxis: 'y2',
      hoverinfo: 'text',
      text: volumeData.map(d => d.hovertext),
    }
  ];

  const plotlyLayout = {
    dragmode: 'pan',
    title: { text: `${symbol} Candlestick Chart`, font: { size: 18, color: '#1e293b', family: 'Inter, sans-serif' }, x: 0.05, y: 0.98 },
    xaxis: {
      type: 'date',
      autorange: false,
      range: [
        new Date(dateRanges[dateRange]).toISOString(),
        today.toISOString()
      ],
      rangebreaks: [
        { bounds: [null, minDate.toISOString()], pattern: 'day' },
        { bounds: [maxDate.toISOString(), null], pattern: 'day' },
        { bounds: ["sat", "mon"], pattern: 'day' }
      ],
      min: minDate.toISOString(),
      max: maxDate.toISOString(),
      tickformat: '%b %d',
      tickformatstops: [
        { dtickrange: [null, 86400000], value: '%b %d' },
        { dtickrange: [86400000, 2592000000], value: '%b %d' },
        { dtickrange: [2592000000, null], value: '%b %Y' }
      ],
      nticks: Math.ceil(candleData.length / 5),
      rangeslider: { visible: false },
      gridcolor: '#e5e7eb',
      linecolor: '#d1d5db',
      showline: true,
      zeroline: false,
      showgrid: true,
      tickfont: { size: 11, color: '#4b5563' },
      title: { text: 'Date', font: { size: 13, color: '#4b5563' } },
      tickmode: 'auto',
      showspikes: true,
      spikecolor: '#9ca3af',
      spikethickness: 1,
      spikedash: 'dot'
    },
    yaxis: {
      title: { text: 'Price (₹)', font: { size: 13, color: '#4b5563' } },
      range: [minPrice, maxPrice],
      gridcolor: '#e5e7eb',
      linecolor: '#d1d5db',
      showline: true,
      zeroline: false,
      showgrid: true,
      tickfont: { size: 11, color: '#4b5563' },
      tickformat: '₹.2f',
      showspikes: true,
      spikecolor: '#9ca3af',
      spikethickness: 1,
      spikedash: 'dot',
      domain: [0.25, 1],
      nticks: 5
    },
    yaxis2: {
      title: { text: 'Volume', font: { size: 13, color: '#4b5563' } },
      gridcolor: '#e5e7eb',
      showgrid: false,
      showticklabels: true,
      tickfont: { size: 10, color: '#4b5563' },
      domain: [0, 0.15]
    },
    margin: { l: 60, r: 30, t: 60, b: 50 },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: -0.1,
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#e5e7eb',
      borderwidth: 1,
      font: { size: 12, color: '#1e293b' }
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(255,255,255,0.95)',
    hovermode: 'x unified',
    uirevision: 'true'
  };

  const handleClick = (data) => {
    if (data.points && data.points[0]) {
      const point = data.points[0];
      const clickedDate = point.x;
      const candle = candleData.find(d => d.x === clickedDate);
      if (candle) {
        setClickInfo(candle);
      }
    } else {
      setClickInfo(null);
    }
  };

  const getCandleColor = (click) => {
    if (!click) return '';
    return click.close > click.open ? '#22c55e' : '#ef4444';
  };

  const handleRelayout = (event) => {
    if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
      const start = new Date(event['xaxis.range[0]']);
      const end = new Date(event['xaxis.range[1]']);
      setVisibleRange({
        start: start < minDate ? minDate : start,
        end: end > maxDate ? maxDate : end
      });
    } else if (event['xaxis.range'] && event['xaxis.range'].length === 2) {
      const start = new Date(event['xaxis.range'][0]);
      const end = new Date(event['xaxis.range'][1]);
      setVisibleRange({
        start: start < minDate ? minDate : start,
        end: end > maxDate ? maxDate : end
      });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-icon">
            <FaChartLine />
          </div>
          <div>
            <h2>{symbol} Candlestick Analysis</h2>
            <p>Advanced pattern detection and insights</p>
          </div>
        </div>
        <div className="header-controls">
          <div className="date-range-selector">
            <FaCalendarAlt />
            {['1M', '3M', '6M', '1Y', 'All'].map(range => (
              <button
                key={range}
                className={dateRange === range ? 'active' : ''}
                onClick={() => setDateRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            className={`pattern-toggle ${isPatternPanelOpen ? 'active' : ''}`}
            onClick={() => setIsPatternPanelOpen(!isPatternPanelOpen)}
          >
            <FaFilter /> {isPatternPanelOpen ? 'Hide Patterns' : 'Show Patterns'}
          </button>
        </div>
      </div>

      {/* Add Rating Component Here */}
      <div className="rating-section">
        <CandlePatternRating plotType="candle_patterns" />
      </div>

      <div className="stats-row">
        <div className="stats-toggle" onClick={() => setShowStats(!showStats)}>
          {showStats ? <FaChevronDown /> : <FaChevronRight />} Market Summary
        </div>
        {showStats && (
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-label">Price</div>
              <div className="stat-value">₹{currentPrice.toFixed(2)}</div>
              <div className="stat-change" style={{ color: priceChangeColor }}>
                {priceChangeIcon} {priceChangePct.toFixed(2)}%
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Patterns Detected</div>
              <div className="stat-value">{totalPatterns}</div>
              <div className="stat-change">
                {data.pattern_markers.length} types
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Timeframe</div>
              <div className="stat-value">{candleData.length} days</div>
              <div className="stat-change">
                {new Date(data.candlestick.x[0]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(data.candlestick.x[data.candlestick.x.length - 1]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="chart-container">
          <div className="plot-container">
            {clickInfo && (
              <div className="click-details">
                <div className="click-details-content">
                  <div className="click-header">
                    <span className="click-date">
                      {new Date(clickInfo.x).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="click-price" style={{ color: getCandleColor(clickInfo) }}>
                      ₹{clickInfo.close.toFixed(2)}
                    </span>
                    <span className="click-change" style={{
                      background: clickInfo.close > clickInfo.open ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: clickInfo.close > clickInfo.open ? '#22c55e' : '#ef4444'
                    }}>
                      {clickInfo.close > clickInfo.open ? (
                        <FaArrowUp />
                      ) : (
                        <FaArrowDown />
                      )}
                      {Math.abs(((clickInfo.close - clickInfo.open) / clickInfo.open) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="click-grid">
                    <div className="click-grid-item">
                      <span>Open</span>
                      <span>₹{clickInfo.open.toFixed(2)}</span>
                    </div>
                    <div className="click-grid-item">
                      <span>Close</span>
                      <span style={{ color: getCandleColor(clickInfo) }}>₹{clickInfo.close.toFixed(2)}</span>
                    </div>
                    <div className="click-grid-item">
                      <span>High</span>
                      <span>₹{clickInfo.high.toFixed(2)}</span>
                    </div>
                    <div className="click-grid-item">
                      <span>Low</span>
                      <span>₹{clickInfo.low.toFixed(2)}</span>
                    </div>
                    <div className="click-grid-item">
                      <span>Volume</span>
                      <span>{(clickInfo.volume / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                  {clickInfo.patterns.length > 0 && (
                    <div className="click-patterns">
                      {clickInfo.patterns.map(p => (
                        <span
                          key={p.name}
                          className="pattern-tag"
                          style={{ backgroundColor: `${p.color}20`, color: p.color }}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <Plot
              data={plotlyData}
              layout={plotlyLayout}
              style={{ width: '100%', height: '100%' }}
              config={{
                responsive: true,
                displayModeBar: false,
                displaylogo: false,
                scrollZoom: true,
                maintainAspectRatio: false,
              }}
              onClick={handleClick}
              onRelayout={handleRelayout}
            />
          </div>
        </div>
        {isPatternPanelOpen && (
          <div className={`pattern-panel ${isPatternPanelExpanded ? 'expanded' : ''}`}>
            <div className="pattern-panel-header">
              <h3>Detected Patterns</h3>
              <div className="pattern-panel-controls">
                <div className="pattern-count">
                  {selectedPatterns.length} of {data.pattern_markers.length} selected
                </div>
                <button
                  className="expand-button"
                  onClick={() => setIsPatternPanelExpanded(!isPatternPanelExpanded)}
                  title={isPatternPanelExpanded ? 'Collapse' : 'Expand'}
                >
                  <FaExpand />
                </button>
              </div>
            </div>
            <div className="pattern-controls">
              <button onClick={() => setSelectedPatterns(data.pattern_markers.map(trace => trace.name))}>
                Select All
              </button>
              <button onClick={() => setSelectedPatterns([])}>
                Clear All
              </button>
            </div>
            <div className="pattern-grid">
              {data.pattern_markers.map((pattern, index) => (
                <div
                  key={index}
                  className={`pattern-card ${selectedPatterns.includes(pattern.name) ? 'selected' : ''} ${activePattern === pattern.name ? 'active' : ''}`}
                  style={{
                    borderColor: pattern.marker.color,
                    backgroundColor: selectedPatterns.includes(pattern.name) ? `${pattern.marker.color}20` : '#ffffff'
                  }}
                  onClick={() => {
                    setActivePattern(activePattern === pattern.name ? null : pattern.name);
                    setSelectedPatterns(prev =>
                      prev.includes(pattern.name)
                        ? prev.filter(p => p !== pattern.name)
                        : [...prev, pattern.name]
                    );
                  }}
                  onMouseEnter={() => setActivePattern(pattern.name)}
                  onMouseLeave={() => setActivePattern(null)}
                >
                  <div
                    className="pattern-icon"
                    style={{
                      backgroundColor: pattern.marker.color,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='${getSymbolPath(PATTERN_SYMBOLS[pattern.name] || 'circle')}' fill='white'/%3E%3C/svg%3E")`
                    }}
                  ></div>
                  <div className="pattern-name">{pattern.name}</div>
                  <div className="pattern-count">{pattern.x.length}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 100%;
          width: 100%;
          height: 100vh;
          padding: 16px;
          box-sizing: border-box;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 12px;
          flex-shrink: 0;
        }

        .rating-section {
          margin: 0 16px 12px;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 8px;
          color: white;
          font-size: 1.2rem;
        }

        .dashboard-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .dashboard-header p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .date-range-selector {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border-radius: 6px;
          padding: 4px;
          border: 1px solid #e5e7eb;
        }

        .date-range-selector svg {
          color: #6b7280;
          margin: 0 8px;
          font-size: 1rem;
        }

        .date-range-selector button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          color: #4b5563;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          background: transparent;
          transition: all 0.2s;
        }

        .date-range-selector button.active {
          background: #3b82f6;
          color: white;
        }

        .date-range-selector button:hover {
          background: #e5e7eb;
        }

        .pattern-toggle {
          padding: 8px 16px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #4b5563;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .pattern-toggle.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .pattern-toggle:hover {
          background: #f1f5f9;
        }

        .stats-row {
          margin: 0 16px 12px;
          flex-shrink: 0;
        }

        .stats-toggle {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 8px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .main-content {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .chart-container {
          flex: 1;
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .plot-container {
          flex: 1;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          position: relative;
          background: #ffffff;
        }

        .click-details {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0 0 8px 8px;
          padding: 12px 16px;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .click-details-content {
          display: flex;
          align-items: center;
          gap: 24px;
          width: 100%;
        }

        .click-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .click-date {
          font-size: 0.875rem;
          color: #4b5563;
          font-weight: 500;
        }

        .click-price {
          font-size: 1rem;
          font-weight: 700;
        }

        .click-change {
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .click-grid {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .click-grid-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .click-grid-item span:first-child {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
        }

        .click-grid-item span:last-child {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .click-patterns {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-left: auto;
        }

        .pattern-tag {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .pattern-panel {
          width: 200px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: absolute;
          right: 16px;
          top: 16px;
          bottom: 16px;
          z-index: 5;
          transition: width 0.3s ease;
        }

        .pattern-panel.expanded {
          width: 320px;
        }

        .pattern-panel-header {
          padding: 12px 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pattern-panel-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .expand-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .expand-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }

        .pattern-panel-header h3 {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }

        .pattern-count {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .pattern-controls {
          padding: 8px 16px;
          display: flex;
          gap: 8px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .pattern-controls button {
          flex: 1;
          padding: 8px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          color: #1e293b;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pattern-controls button:hover {
          background: #f1f5f9;
        }

        .pattern-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 12px;
          overflow-y: auto;
          flex: 1;
        }

        .pattern-panel.expanded .pattern-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .pattern-card {
          border-radius: 6px;
          padding: 12px;
          cursor: pointer;
          border: 1px solid;
          transition: all 0.2s;
          background: #ffffff;
        }

        .pattern-card.selected {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }

        .pattern-card.active {
          transform: scale(1.03);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .pattern-icon {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background-size: 50%;
          background-repeat: no-repeat;
          background-position: center;
          margin: 0 auto 8px;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .pattern-name {
          font-weight: 700;
          color: #1e293b;
          text-align: center;
          margin-bottom: 4px;
          line-height: 1.2;
          font-size: 0.75rem;
        }

        .pattern-count {
          font-size: 0.75rem;
          color: #4b5563;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 8px;
          text-align: center;
        }

        .loading-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(59, 130, 246, 0.2);
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-text {
          font-size: 1rem;
          font-weight: 500;
          color: #4b5563;
        }

        .error-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: 'Inter', sans-serif;
          padding: 24px;
        }

        .error-icon {
          font-size: 2.5rem;
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .error-container h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: #1e293b;
        }

        .error-container p {
          color: #6b7280;
          max-width: 400px;
          font-size: 0.875rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function getSymbolPath(symbol) {
  const paths = {
    'circle': 'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z',
    'square': 'M20,20 L80,20 L80,80 L20,80 Z',
    'diamond': 'M50,20 L80,50 L50,80 L20,50 Z',
    'cross': 'M30,30 L70,70 M70,30 L30,70',
    'x': 'M30,30 L70,70 M70,30 L30,70',
    'triangle-up': 'M50,20 L80,80 L20,80 Z',
    'triangle-down': 'M50,80 L20,20 L80,20 Z',
    'pentagon': 'M50,10 L80,40 L65,80 L35,80 L20,40 Z',
    'hexagon': 'M30,50 L50,20 L70,50 L70,80 L50,110 L30,80 Z',
    'star': 'M50,10 L61,40 L95,40 L68,60 L79,90 L50,70 L21,90 L32,60 L5,40 L39,40 Z',
    'hexagram': 'M50,10 L61,40 L95,40 L68,60 L79,90 L50,70 L21,90 L32,60 L5,40 L39,40 Z M50,90 L39,60 L5,60 L32,40 L21,10 L50,30 L79,10 L68,40 L95,60 L61,60 Z',
    'bowtie': 'M30,30 L70,30 L30,70 L70,70 Z',
    'hourglass': 'M30,30 L70,30 L50,50 L70,70 L30,70 L50,50 Z'
  };
  return paths[symbol] || paths['circle'];
}