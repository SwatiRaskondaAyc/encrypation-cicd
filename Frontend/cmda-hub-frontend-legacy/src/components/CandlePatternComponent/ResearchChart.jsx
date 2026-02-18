// import { useEffect, useRef } from 'react';
// import { createChart } from 'lightweight-charts';
// import { PatternRegistry } from './data/patternRegistry';
// import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// function ResearchChart({ priceData, patterns, fincode }) {
//   const chartContainerRef = useRef(null);
//   const chartRef = useRef(null);
//   const seriesRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current || !priceData?.Date?.length) return;

//     const container = chartContainerRef.current;
//     container.innerHTML = '';

//     const chart = createChart(container, {
//       width: container.clientWidth,
//       height: 500,
//       layout: { 
//         background: { color: '#ffffff' }, 
//         textColor: '#334155',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         attributionLogo:false
//       },
//       grid: { 
//         vertLines: { color: '#f1f5f9' }, 
//         horzLines: { color: '#f1f5f9' } 
//       },
//       rightPriceScale: { 
//         borderColor: '#e2e8f0',
//         scaleMargins: {
//           top: 0.1,
//           bottom: 0.1,
//         }
//       },
//       timeScale: { 
//         borderColor: '#e2e8f0', 
//         timeVisible: true, 
//         secondsVisible: false,
//         tickMarkFormatter: (time) => {
//           const date = new Date(time);
//           return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         }
//       },
//       crosshair: { 
//         mode: 1,
//         vertLine: {
//           color: '#64748b',
//           width: 1,
//           style: 2,
//         },
//         horzLine: {
//           color: '#64748b',
//           width: 1,
//           style: 2,
//         }
//       },
//       handleScroll: {
//         mouseWheel: true,
//         pressedMouseMove: true,
//       },
//       handleScale: {
//         axisPressedMouseMove: true,
//         mouseWheel: true,
//         pinch: true,
//       },
//     });
//     chartRef.current = chart;

//     // === OHLC DATA ===
//     const ohlc = priceData.Date.map((date, i) => ({
//       time: date,
//       open: Number(priceData.Open[i]),
//       high: Number(priceData.High[i]),
//       low: Number(priceData.Low[i]),
//       close: Number(priceData.Close[i]),
//     })).filter(d => d.time && /^\d{4}-\d{2}-\d{2}$/.test(d.time));

//     if (ohlc.length === 0) {
//       container.innerHTML = `
//         <div class="flex flex-col items-center justify-center h-full text-slate-500">
//           <BarChart3 class="w-16 h-16 mb-4 opacity-50" />
//           <p class="text-lg font-medium">No valid price data available</p>
//           <p class="text-sm mt-1">Please check the data source</p>
//         </div>
//       `;
//       return;
//     }

//     const candlestickSeries = chart.addCandlestickSeries({
//       upColor: '#10b981',
//       downColor: '#ef4444',
//       borderVisible: false,
//       wickUpColor: '#10b981',
//       wickDownColor: '#ef4444',
//       priceFormat: {
//         type: 'price',
//         precision: 2,
//         minMove: 0.01,
//       }
//     });
//     candlestickSeries.setData(ohlc);
//     seriesRef.current = candlestickSeries;

//     // === MARKERS (Arrows + Score) ===
//     const markers = patterns.map(p => {
//       const meta = PatternRegistry.getPattern(p.patternId);
//       const shortName = meta?.shortName || p.patternId;
//       const bias = meta?.bias || 'neutral';
//       const color = bias === 'bullish' ? '#10b981' : bias === 'bearish' ? '#ef4444' : '#8b5cf6';

//       return {
//         time: p.date,
//         position: bias === 'bearish' ? 'aboveBar' : 'belowBar',
//         color,
//         shape: bias === 'bearish' ? 'arrowDown' : 'arrowUp',
//         text: `${shortName}\nScore: ${(p.score * 10).toFixed(1)}`,
//         size: 1.8,
//       };
//     });
//     candlestickSeries.setMarkers(markers);

//     // === HIGHLIGHT CANVAS (Background + Badge + Score) ===
//     const canvas = document.createElement('canvas');
//     canvas.width = container.clientWidth;
//     canvas.height = 500;
//     canvas.style.cssText = 'position:absolute;left:0;top:0;z-index:1;pointer-events:none;';
//     container.appendChild(canvas);
//     canvasRef.current = canvas;
//     const ctx = canvas.getContext('2d');

//     const drawHighlights = () => {
//       if (!seriesRef.current) return;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const timeScale = chart.timeScale();

//       patterns.forEach(p => {
//         const meta = PatternRegistry.getPattern(p.patternId);
//         const shortName = meta?.shortName || p.patternId;
//         const bias = meta?.bias || 'neutral';

//         const bgColor = bias === 'bullish' ? 'rgba(16, 185, 129, 0.15)' :
//                         bias === 'bearish' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)';
//         const badgeColor = bias === 'bullish' ? '#10b981' :
//                            bias === 'bearish' ? '#ef4444' : '#8b5cf6';
//         const annotation = shortName.slice(0, 3).toUpperCase();

//         const x = timeScale.timeToCoordinate(p.date);
//         if (x === null) return;

//         const index = ohlc.findIndex(d => d.time === p.date);
//         if (index === -1) return;

//         const candle = ohlc[index];

//         // CORRECT FOR lightweight-charts 4.2.0
//         const highY = candlestickSeries.priceToCoordinate(candle.high);
//         const lowY = candlestickSeries.priceToCoordinate(candle.low);

//         if (highY === null || lowY === null) return;

//         const padding = Math.abs(lowY - highY) * 0.4;

//         const boxX = x - 42;
//         const boxY = highY - padding;
//         const boxWidth = 84;
//         const boxHeight = lowY - highY + padding * 2;

//         // Background highlight
//         ctx.fillStyle = bgColor;
//         ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

//         // Badge
//         const badgeSize = 36;
//         const badgeX = boxX + boxWidth / 2 - badgeSize / 2;
//         const badgeY = boxY - badgeSize - 12;

//         ctx.fillStyle = badgeColor;
//         ctx.beginPath();
//         ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 8);
//         ctx.fill();

//         ctx.fillStyle = '#ffffff';
//         ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';
//         ctx.fillText(annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);

//         // Score badge below candle
//         const scoreText = (p.score * 10).toFixed(1);
//         ctx.fillStyle = badgeColor;
//         ctx.beginPath();
//         ctx.roundRect(x - 20, boxY + boxHeight + 8, 40, 20, 10);
//         ctx.fill();

//         ctx.fillStyle = '#ffffff';
//         ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
//         ctx.fillText(scoreText, x, boxY + boxHeight + 20);
//       });
//     };

//     // Initial draw
//     drawHighlights();

//     // Redraw on ANY change
//     const redraw = () => requestAnimationFrame(drawHighlights);
//     chart.timeScale().subscribeVisibleLogicalRangeChange(redraw);

//     // Resize handler
//     const handleResize = () => {
//       chart.applyOptions({ width: container.clientWidth });
//       canvas.width = container.clientWidth;
//       drawHighlights();
//     };
//     window.addEventListener('resize', handleResize);

//     // Fit content
//     chart.timeScale().fitContent();

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       chart.remove();
//     };
//   }, [priceData, patterns, fincode]);

//   // Calculate pattern statistics
//   const patternStats = patterns.reduce((acc, pattern) => {
//     const meta = PatternRegistry.getPattern(pattern.patternId);
//     const bias = meta?.bias || 'neutral';
//     acc[bias] = (acc[bias] || 0) + 1;
//     acc.totalScore += pattern.score;
//     return acc;
//   }, { totalScore: 0 });

//   const averageScore = patterns.length > 0 ? (patternStats.totalScore / patterns.length) * 10 : 0;

//   const getBiasIcon = (bias) => {
//     switch (bias) {
//       case 'bullish': return <TrendingUp className="w-4 h-4" />;
//       case 'bearish': return <TrendingDown className="w-4 h-4" />;
//       default: return <Minus className="w-4 h-4" />;
//     }
//   };

//   const getBiasColor = (bias) => {
//     switch (bias) {
//       case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
//       case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
//       default: return 'text-purple-600 bg-purple-50 border-purple-200';
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//       {/* Chart Header */}
//       <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
//               <BarChart3 className="w-6 h-6 text-slate-700" />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-slate-800">
//                 {priceData.Symbol || 'Unknown Symbol'}
//               </h3>
//               <p className="text-slate-600 text-sm font-medium">
//                 FINCODE: {fincode} • {patterns.length} Pattern{patterns.length !== 1 ? 's' : ''} Detected
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="bg-white rounded-lg px-3 py-2 border border-slate-200 shadow-sm">
//               <span className="text-sm font-semibold text-slate-700">
//                 Avg Score: <span className="text-blue-600">{averageScore.toFixed(1)}/10</span>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pattern Statistics */}
//       <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
//         <div className="flex items-center gap-6">
//           {['bullish', 'bearish', 'neutral'].map(bias => (
//             patternStats[bias] > 0 && (
//               <div key={bias} className="flex items-center gap-2">
//                 <div className={`p-1 rounded border ${getBiasColor(bias)}`}>
//                   {getBiasIcon(bias)}
//                 </div>
//                 <span className="text-sm font-medium text-slate-700">
//                   {patternStats[bias]} {bias}
//                 </span>
//               </div>
//             )
//           ))}
//         </div>
//       </div>

//       {/* Chart Container */}
//       <div className="p-6">
//         <div 
//           ref={chartContainerRef} 
//           className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-white"
//           style={{ height: '500px' }}
//         />
//       </div>

//       {/* Pattern Legend */}
//       <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <span className="text-sm font-semibold text-slate-700">Pattern Legend:</span>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-green-500 rounded"></div>
//                 <span className="text-xs text-slate-600">Bullish</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded"></div>
//                 <span className="text-xs text-slate-600">Bearish</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-purple-500 rounded"></div>
//                 <span className="text-xs text-slate-600">Neutral</span>
//               </div>
//             </div>
//           </div>
//           <div className="text-xs text-slate-500">
//             Scores shown below candles • Hover for details
//           </div>
//         </div>
//       </div>

//       {/* Detected Patterns List */}
//       <div className="border-t border-slate-200">
//         <div className="px-6 py-4">
//           <h4 className="text-sm font-semibold text-slate-700 mb-3">Detected Patterns:</h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {patterns.map((pattern, index) => {
//               const meta = PatternRegistry.getPattern(pattern.patternId);
//               const bias = meta?.bias || 'neutral';
              
//               return (
//                 <div 
//                   key={index}
//                   className={`p-3 rounded-lg border ${
//                     bias === 'bullish' ? 'bg-green-50 border-green-200' :
//                     bias === 'bearish' ? 'bg-red-50 border-red-200' :
//                     'bg-purple-50 border-purple-200'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-semibold text-slate-800 text-sm">
//                         {meta?.name || pattern.patternId}
//                       </div>
//                       <div className="text-xs text-slate-600 mt-1">
//                         {pattern.date}
//                       </div>
//                     </div>
//                     <div className={`px-2 py-1 rounded text-xs font-bold ${
//                       bias === 'bullish' ? 'bg-green-100 text-green-800' :
//                       bias === 'bearish' ? 'bg-red-100 text-red-800' :
//                       'bg-purple-100 text-purple-800'
//                     }`}>
//                       {(pattern.score * 10).toFixed(1)}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ResearchChart;




// import { useEffect, useRef } from 'react';
// import { createChart } from 'lightweight-charts';
// import { PatternRegistry } from './data/patternRegistry';
// import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// function ResearchChart({ priceData, patterns, fincode }) {
//   const chartContainerRef = useRef(null);
//   const chartRef = useRef(null);
//   const seriesRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current || !priceData?.Date?.length) return;

//     const container = chartContainerRef.current;
//     container.innerHTML = '';

//     const chart = createChart(container, {
//       width: container.clientWidth,
//       height: 500,
//       layout: { 
//         background: { color: '#ffffff' }, 
//         textColor: '#334155',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         attributionLogo:false
//       },
//       grid: { 
//         vertLines: { color: '#f1f5f9' }, 
//         horzLines: { color: '#f1f5f9' } 
//       },
//       rightPriceScale: { 
//         borderColor: '#e2e8f0',
//         scaleMargins: {
//           top: 0.1,
//           bottom: 0.1,
//         }
//       },
//       timeScale: { 
//         borderColor: '#e2e8f0', 
//         timeVisible: true, 
//         secondsVisible: false,
//         tickMarkFormatter: (time) => {
//           const date = new Date(time);
//           return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         }
//       },
//       crosshair: { 
//         mode: 1,
//         vertLine: {
//           color: '#64748b',
//           width: 1,
//           style: 2,
//         },
//         horzLine: {
//           color: '#64748b',
//           width: 1,
//           style: 2,
//         }
//       },
//       handleScroll: {
//         mouseWheel: true,
//         pressedMouseMove: true,
//       },
//       handleScale: {
//         axisPressedMouseMove: true,
//         mouseWheel: true,
//         pinch: true,
//       },
//     });
//     chartRef.current = chart;

//     // === OHLC DATA ===
//     const ohlc = priceData.Date.map((date, i) => ({
//       time: date,
//       open: Number(priceData.Open[i]),
//       high: Number(priceData.High[i]),
//       low: Number(priceData.Low[i]),
//       close: Number(priceData.Close[i]),
//     })).filter(d => d.time && /^\d{4}-\d{2}-\d{2}$/.test(d.time));

//     if (ohlc.length === 0) {
//       container.innerHTML = `
//         <div class="flex flex-col items-center justify-center h-full text-slate-500">
//           <BarChart3 class="w-16 h-16 mb-4 opacity-50" />
//           <p class="text-lg font-medium">No valid price data available</p>
//           <p class="text-sm mt-1">Please check the data source</p>
//         </div>
//       `;
//       return;
//     }

//     const candlestickSeries = chart.addCandlestickSeries({
//       upColor: '#10b981',
//       downColor: '#ef4444',
//       borderVisible: false,
//       wickUpColor: '#10b981',
//       wickDownColor: '#ef4444',
//       priceFormat: {
//         type: 'price',
//         precision: 2,
//         minMove: 0.01,
//       }
//     });
//     candlestickSeries.setData(ohlc);
//     seriesRef.current = candlestickSeries;

//     // === MARKERS (Arrows + Score) ===
//     const markers = patterns.map(p => {
//       const meta = PatternRegistry.getPattern(p.patternId);
//       const shortName = meta?.shortName || p.patternId || 'PAT';
//       const bias = meta?.bias || 'neutral';
//       const color = bias === 'bullish' ? '#10b981' : bias === 'bearish' ? '#ef4444' : '#8b5cf6';

//       return {
//         time: p.date,
//         position: bias === 'bearish' ? 'aboveBar' : 'belowBar',
//         color,
//         shape: bias === 'bearish' ? 'arrowDown' : 'arrowUp',
//         text: `${shortName}\nScore: ${(p.score * 10).toFixed(1)}`,
//         size: 1.8,
//       };
//     });
//     candlestickSeries.setMarkers(markers);

//     // === HIGHLIGHT CANVAS (Background + Badge + Score) ===
//     const canvas = document.createElement('canvas');
//     canvas.width = container.clientWidth;
//     canvas.height = 500;
//     canvas.style.cssText = 'position:absolute;left:0;top:0;z-index:1;pointer-events:none;';
//     container.appendChild(canvas);
//     canvasRef.current = canvas;
//     const ctx = canvas.getContext('2d');

//     const drawHighlights = () => {
//       if (!seriesRef.current) return;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const timeScale = chart.timeScale();

//       patterns.forEach(p => {
//         const meta = PatternRegistry.getPattern(p.patternId);
//         const shortName = meta?.shortName || p.patternId || 'PAT'; // ✅ FIX: Provide default value
//         const bias = meta?.bias || 'neutral';

//         const bgColor = bias === 'bullish' ? 'rgba(16, 185, 129, 0.15)' :
//                         bias === 'bearish' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)';
//         const badgeColor = bias === 'bullish' ? '#10b981' :
//                            bias === 'bearish' ? '#ef4444' : '#8b5cf6';
        
//         // ✅ FIX: Safe annotation extraction with fallback
//         const annotation = shortName && typeof shortName === 'string' 
//           ? shortName.slice(0, 3).toUpperCase() 
//           : 'PAT';

//         const x = timeScale.timeToCoordinate(p.date);
//         if (x === null) return;

//         const index = ohlc.findIndex(d => d.time === p.date);
//         if (index === -1) return;

//         const candle = ohlc[index];

//         // CORRECT FOR lightweight-charts 4.2.0
//         const highY = candlestickSeries.priceToCoordinate(candle.high);
//         const lowY = candlestickSeries.priceToCoordinate(candle.low);

//         if (highY === null || lowY === null) return;

//         const padding = Math.abs(lowY - highY) * 0.4;

//         const boxX = x - 42;
//         const boxY = highY - padding;
//         const boxWidth = 84;
//         const boxHeight = lowY - highY + padding * 2;

//         // Background highlight
//         ctx.fillStyle = bgColor;
//         ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

//         // Badge
//         const badgeSize = 36;
//         const badgeX = boxX + boxWidth / 2 - badgeSize / 2;
//         const badgeY = boxY - badgeSize - 12;

//         ctx.fillStyle = badgeColor;
//         ctx.beginPath();
//         ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 8);
//         ctx.fill();

//         ctx.fillStyle = '#ffffff';
//         ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';
//         ctx.fillText(annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);

//         // Score badge below candle
//         const scoreText = ((p.score || 0) * 10).toFixed(1); // ✅ FIX: Handle undefined score
//         ctx.fillStyle = badgeColor;
//         ctx.beginPath();
//         ctx.roundRect(x - 20, boxY + boxHeight + 8, 40, 20, 10);
//         ctx.fill();

//         ctx.fillStyle = '#ffffff';
//         ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
//         ctx.fillText(scoreText, x, boxY + boxHeight + 20);
//       });
//     };

//     // Initial draw
//     drawHighlights();

//     // Redraw on ANY change
//     const redraw = () => requestAnimationFrame(drawHighlights);
//     chart.timeScale().subscribeVisibleLogicalRangeChange(redraw);

//     // Resize handler
//     const handleResize = () => {
//       chart.applyOptions({ width: container.clientWidth });
//       canvas.width = container.clientWidth;
//       drawHighlights();
//     };
//     window.addEventListener('resize', handleResize);

//     // Fit content
//     chart.timeScale().fitContent();

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       chart.remove();
//     };
//   }, [priceData, patterns, fincode]);

//   // Calculate pattern statistics with safety checks
//   const patternStats = patterns.reduce((acc, pattern) => {
//     const meta = PatternRegistry.getPattern(pattern.patternId);
//     const bias = meta?.bias || 'neutral';
//     acc[bias] = (acc[bias] || 0) + 1;
//     acc.totalScore += pattern.score || 0; // ✅ FIX: Handle undefined score
//     return acc;
//   }, { totalScore: 0 });

//   const averageScore = patterns.length > 0 ? (patternStats.totalScore / patterns.length) * 10 : 0;

//   const getBiasIcon = (bias) => {
//     switch (bias) {
//       case 'bullish': return <TrendingUp className="w-4 h-4" />;
//       case 'bearish': return <TrendingDown className="w-4 h-4" />;
//       default: return <Minus className="w-4 h-4" />;
//     }
//   };

//   const getBiasColor = (bias) => {
//     switch (bias) {
//       case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
//       case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
//       default: return 'text-purple-600 bg-purple-50 border-purple-200';
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//       {/* Chart Header */}
//       <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
//               <BarChart3 className="w-6 h-6 text-slate-700" />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-slate-800">
//                 {priceData?.Symbol || 'Unknown Symbol'} {/* ✅ FIX: Handle undefined priceData */}
//               </h3>
//               <p className="text-slate-600 text-sm font-medium">
//                 FINCODE: {fincode} • {patterns?.length || 0} Pattern{patterns?.length !== 1 ? 's' : ''} Detected {/* ✅ FIX: Handle undefined patterns */}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="bg-white rounded-lg px-3 py-2 border border-slate-200 shadow-sm">
//               <span className="text-sm font-semibold text-slate-700">
//                 Avg Score: <span className="text-blue-600">{averageScore.toFixed(1)}/10</span>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pattern Statistics */}
//       <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
//         <div className="flex items-center gap-6">
//           {['bullish', 'bearish', 'neutral'].map(bias => (
//             patternStats[bias] > 0 && (
//               <div key={bias} className="flex items-center gap-2">
//                 <div className={`p-1 rounded border ${getBiasColor(bias)}`}>
//                   {getBiasIcon(bias)}
//                 </div>
//                 <span className="text-sm font-medium text-slate-700">
//                   {patternStats[bias]} {bias}
//                 </span>
//               </div>
//             )
//           ))}
//         </div>
//       </div>

//       {/* Chart Container */}
//       <div className="p-6">
//         <div 
//           ref={chartContainerRef} 
//           className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-white"
//           style={{ height: '500px' }}
//         />
//       </div>

//       {/* Pattern Legend */}
//       <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <span className="text-sm font-semibold text-slate-700">Pattern Legend:</span>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-green-500 rounded"></div>
//                 <span className="text-xs text-slate-600">Bullish</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded"></div>
//                 <span className="text-xs text-slate-600">Bearish</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-purple-500 rounded"></div>
//                 <span className="text-xs text-slate-600">Neutral</span>
//               </div>
//             </div>
//           </div>
//           <div className="text-xs text-slate-500">
//             Scores shown below candles • Hover for details
//           </div>
//         </div>
//       </div>

//       {/* Detected Patterns List */}
//       <div className="border-t border-slate-200">
//         <div className="px-6 py-4">
//           <h4 className="text-sm font-semibold text-slate-700 mb-3">Detected Patterns:</h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {patterns?.map((pattern, index) => { // ✅ FIX: Handle undefined patterns
//               const meta = PatternRegistry.getPattern(pattern.patternId);
//               const bias = meta?.bias || 'neutral';
              
//               return (
//                 <div 
//                   key={index}
//                   className={`p-3 rounded-lg border ${
//                     bias === 'bullish' ? 'bg-green-50 border-green-200' :
//                     bias === 'bearish' ? 'bg-red-50 border-red-200' :
//                     'bg-purple-50 border-purple-200'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-semibold text-slate-800 text-sm">
//                         {meta?.name || pattern.patternId || 'Unknown Pattern'} {/* ✅ FIX: Handle undefined patternId */}
//                       </div>
//                       <div className="text-xs text-slate-600 mt-1">
//                         {pattern.date || 'Unknown Date'} {/* ✅ FIX: Handle undefined date */}
//                       </div>
//                     </div>
//                     <div className={`px-2 py-1 rounded text-xs font-bold ${
//                       bias === 'bullish' ? 'bg-green-100 text-green-800' :
//                       bias === 'bearish' ? 'bg-red-100 text-red-800' :
//                       'bg-purple-100 text-purple-800'
//                     }`}>
//                       {((pattern.score || 0) * 10).toFixed(1)} {/* ✅ FIX: Handle undefined score */}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ResearchChart;



// // import { useEffect, useRef, useState } from 'react';
// // import { createChart } from 'lightweight-charts';
// // import { PatternRegistry } from './data/patternRegistry';
// // import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// // function ResearchChart({ priceData, patterns, fincode }) {
// //   const chartContainerRef = useRef(null);
// //   const chartRef = useRef(null);
// //   const seriesRef = useRef(null);
// //   const canvasRef = useRef(null);
// //   const [currentOHLC, setCurrentOHLC] = useState(null);

// //   useEffect(() => {
// //     if (!chartContainerRef.current || !priceData?.Date?.length) return;

// //     const container = chartContainerRef.current;
// //     container.innerHTML = '';

// //     const chart = createChart(container, {
// //       width: container.clientWidth,
// //       height: 500,
// //       layout: { 
// //         background: { color: '#ffffff' }, 
// //         textColor: '#334155',
// //         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
// //         attributionLogo:false
// //       },
// //       grid: { 
// //         vertLines: { color: '#f1f5f9' }, 
// //         horzLines: { color: '#f1f5f9' } 
// //       },
// //       rightPriceScale: { 
// //         borderColor: '#e2e8f0',
// //         scaleMargins: {
// //           top: 0.1,
// //           bottom: 0.1,
// //         }
// //       },
// //       timeScale: { 
// //         borderColor: '#e2e8f0', 
// //         timeVisible: true, 
// //         secondsVisible: false,
// //         tickMarkFormatter: (time) => {
// //           const date = new Date(time);
// //           return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// //         }
// //       },
// //       crosshair: { 
// //         mode: 1,
// //         vertLine: {
// //           color: '#64748b',
// //           width: 1,
// //           style: 2,
// //         },
// //         horzLine: {
// //           color: '#64748b',
// //           width: 1,
// //           style: 2,
// //         }
// //       },
// //       handleScroll: {
// //         mouseWheel: true,
// //         pressedMouseMove: true,
// //       },
// //       handleScale: {
// //         axisPressedMouseMove: true,
// //         mouseWheel: true,
// //         pinch: true,
// //       },
// //     });
// //     chartRef.current = chart;

// //     // === OHLC DATA ===
// //     const ohlc = priceData.Date.map((date, i) => ({
// //       time: date,
// //       open: Number(priceData.Open[i]),
// //       high: Number(priceData.High[i]),
// //       low: Number(priceData.Low[i]),
// //       close: Number(priceData.Close[i]),
// //     })).filter(d => d.time && /^\d{4}-\d{2}-\d{2}$/.test(d.time));

// //     if (ohlc.length === 0) {
// //       container.innerHTML = `
// //         <div class="flex flex-col items-center justify-center h-full text-slate-500">
// //           <BarChart3 class="w-16 h-16 mb-4 opacity-50" />
// //           <p class="text-lg font-medium">No valid price data available</p>
// //           <p class="text-sm mt-1">Please check the data source</p>
// //         </div>
// //       `;
// //       return;
// //     }

// //     const candlestickSeries = chart.addCandlestickSeries({
// //       upColor: '#10b981',
// //       downColor: '#ef4444',
// //       borderVisible: false,
// //       wickUpColor: '#10b981',
// //       wickDownColor: '#ef4444',
// //       priceFormat: {
// //         type: 'price',
// //         precision: 2,
// //         minMove: 0.01,
// //       }
// //     });
// //     candlestickSeries.setData(ohlc);
// //     seriesRef.current = candlestickSeries;

// //     // Set initial OHLC values to the latest candle
// //     setCurrentOHLC(ohlc[ohlc.length - 1]);

// //     // === MARKERS (Arrows + Score) ===
// //     const markers = patterns.map(p => {
// //       const meta = PatternRegistry.getPattern(p.patternId);
// //       const shortName = meta?.shortName || p.patternId;
// //       const bias = meta?.bias || 'neutral';
// //       const color = bias === 'bullish' ? '#10b981' : bias === 'bearish' ? '#ef4444' : '#8b5cf6';

// //       return {
// //         time: p.date,
// //         position: bias === 'bearish' ? 'aboveBar' : 'belowBar',
// //         color,
// //         shape: bias === 'bearish' ? 'arrowDown' : 'arrowUp',
// //         text: `${shortName}\nScore: ${(p.score * 10).toFixed(1)}`,
// //         size: 1.8,
// //       };
// //     });
// //     candlestickSeries.setMarkers(markers);

// //     // === HIGHLIGHT CANVAS (Background + Badge + Score) ===
// //     const canvas = document.createElement('canvas');
// //     canvas.width = container.clientWidth;
// //     canvas.height = 500;
// //     canvas.style.cssText = 'position:absolute;left:0;top:0;z-index:1;pointer-events:none;';
// //     container.appendChild(canvas);
// //     canvasRef.current = canvas;
// //     const ctx = canvas.getContext('2d');

// //     const drawHighlights = () => {
// //       if (!seriesRef.current) return;
// //       ctx.clearRect(0, 0, canvas.width, canvas.height);

// //       const timeScale = chart.timeScale();

// //       patterns.forEach(p => {
// //         const meta = PatternRegistry.getPattern(p.patternId);
// //         const shortName = meta?.shortName || p.patternId;
// //         const bias = meta?.bias || 'neutral';

// //         const bgColor = bias === 'bullish' ? 'rgba(16, 185, 129, 0.15)' :
// //                         bias === 'bearish' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)';
// //         const badgeColor = bias === 'bullish' ? '#10b981' :
// //                            bias === 'bearish' ? '#ef4444' : '#8b5cf6';
// //         const annotation = shortName.slice(0, 3).toUpperCase();

// //         const x = timeScale.timeToCoordinate(p.date);
// //         if (x === null) return;

// //         const index = ohlc.findIndex(d => d.time === p.date);
// //         if (index === -1) return;

// //         const candle = ohlc[index];

// //         // CORRECT FOR lightweight-charts 4.2.0
// //         const highY = candlestickSeries.priceToCoordinate(candle.high);
// //         const lowY = candlestickSeries.priceToCoordinate(candle.low);

// //         if (highY === null || lowY === null) return;

// //         const padding = Math.abs(lowY - highY) * 0.4;

// //         const boxX = x - 42;
// //         const boxY = highY - padding;
// //         const boxWidth = 84;
// //         const boxHeight = lowY - highY + padding * 2;

// //         // Background highlight
// //         ctx.fillStyle = bgColor;
// //         ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

// //         // Badge
// //         const badgeSize = 36;
// //         const badgeX = boxX + boxWidth / 2 - badgeSize / 2;
// //         const badgeY = boxY - badgeSize - 12;

// //         ctx.fillStyle = badgeColor;
// //         ctx.beginPath();
// //         ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 8);
// //         ctx.fill();

// //         ctx.fillStyle = '#ffffff';
// //         ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
// //         ctx.textAlign = 'center';
// //         ctx.textBaseline = 'middle';
// //         ctx.fillText(annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);

// //         // Score badge below candle
// //         const scoreText = (p.score * 10).toFixed(1);
// //         ctx.fillStyle = badgeColor;
// //         ctx.beginPath();
// //         ctx.roundRect(x - 20, boxY + boxHeight + 8, 40, 20, 10);
// //         ctx.fill();

// //         ctx.fillStyle = '#ffffff';
// //         ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
// //         ctx.fillText(scoreText, x, boxY + boxHeight + 20);
// //       });
// //     };

// //     // Crosshair move handler to update OHLC values
// //     chart.subscribeCrosshairMove(param => {
// //       if (param.time) {
// //         const data = param.seriesData.get(candlestickSeries);
// //         if (data) {
// //           setCurrentOHLC(data);
// //         }
// //       } else {
// //         // If no crosshair position, show the latest candle
// //         setCurrentOHLC(ohlc[ohlc.length - 1]);
// //       }
// //     });

// //     // Initial draw
// //     drawHighlights();

// //     // Redraw on ANY change
// //     const redraw = () => requestAnimationFrame(drawHighlights);
// //     chart.timeScale().subscribeVisibleLogicalRangeChange(redraw);

// //     // Resize handler
// //     const handleResize = () => {
// //       chart.applyOptions({ width: container.clientWidth });
// //       canvas.width = container.clientWidth;
// //       drawHighlights();
// //     };
// //     window.addEventListener('resize', handleResize);

// //     // Fit content
// //     chart.timeScale().fitContent();

// //     return () => {
// //       window.removeEventListener('resize', handleResize);
// //       chart.remove();
// //     };
// //   }, [priceData, patterns, fincode]);

// //   // Calculate pattern statistics
// //   const patternStats = patterns.reduce((acc, pattern) => {
// //     const meta = PatternRegistry.getPattern(pattern.patternId);
// //     const bias = meta?.bias || 'neutral';
// //     acc[bias] = (acc[bias] || 0) + 1;
// //     acc.totalScore += pattern.score;
// //     return acc;
// //   }, { totalScore: 0 });

// //   const averageScore = patterns.length > 0 ? (patternStats.totalScore / patterns.length) * 10 : 0;

// //   const getBiasIcon = (bias) => {
// //     switch (bias) {
// //       case 'bullish': return <TrendingUp className="w-4 h-4" />;
// //       case 'bearish': return <TrendingDown className="w-4 h-4" />;
// //       default: return <Minus className="w-4 h-4" />;
// //     }
// //   };

// //   const getBiasColor = (bias) => {
// //     switch (bias) {
// //       case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
// //       case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
// //       default: return 'text-purple-600 bg-purple-50 border-purple-200';
// //     }
// //   };

// //   const OHLCItem = ({ label, value, color = "text-slate-700" }) => (
// //     <div className="flex flex-col items-center">
// //       <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
// //       <span className={`text-sm font-bold ${color}`}>{value}</span>
// //     </div>
// //   );

// //   return (
// //     <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
// //       {/* Chart Header */}
// //       <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-6">
// //             <div className="flex items-center gap-4">
// //               <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
// //                 <BarChart3 className="w-6 h-6 text-slate-700" />
// //               </div>
// //               <div>
// //                 <h3 className="text-xl font-bold text-slate-800">
// //                   {priceData.Symbol || 'Unknown Symbol'}
// //                 </h3>
// //                 <p className="text-slate-600 text-sm font-medium">
// //                   FINCODE: {fincode} • {patterns.length} Pattern{patterns.length !== 1 ? 's' : ''} Detected
// //                 </p>
// //               </div>
// //             </div>
            
// //             {/* OHLC Values - Horizontal Display */}
// //             {currentOHLC && (
// //               <div className="flex items-center gap-6 bg-white rounded-lg px-4 py-3 border border-slate-200 shadow-sm">
// //                 <OHLCItem label="Open" value={currentOHLC.open?.toFixed(2) || '—'} />
// //                 <div className="h-8 w-px bg-slate-300"></div>
// //                 <OHLCItem label="High" value={currentOHLC.high?.toFixed(2) || '—'} color="text-green-600" />
// //                 <div className="h-8 w-px bg-slate-300"></div>
// //                 <OHLCItem label="Low" value={currentOHLC.low?.toFixed(2) || '—'} color="text-red-600" />
// //                 <div className="h-8 w-px bg-slate-300"></div>
// //                 <OHLCItem 
// //                   label="Close" 
// //                   value={currentOHLC.close?.toFixed(2) || '—'} 
// //                   color={currentOHLC.close >= currentOHLC.open ? "text-green-600" : "text-red-600"} 
// //                 />
// //                 {currentOHLC.time && (
// //                   <>
// //                     <div className="h-8 w-px bg-slate-300"></div>
// //                     <div className="flex flex-col items-center">
// //                       <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date</span>
// //                       <span className="text-sm font-bold text-slate-700">
// //                         {new Date(currentOHLC.time).toLocaleDateString('en-US', { 
// //                           month: 'short', 
// //                           day: 'numeric',
// //                           year: 'numeric'
// //                         })}
// //                       </span>
// //                     </div>
// //                   </>
// //                 )}
// //               </div>
// //             )}
// //           </div>
          
// //           <div className="flex items-center gap-3">
// //             <div className="bg-white rounded-lg px-3 py-2 border border-slate-200 shadow-sm">
// //               <span className="text-sm font-semibold text-slate-700">
// //                 Avg Score: <span className="text-blue-600">{averageScore.toFixed(1)}/10</span>
// //               </span>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Pattern Statistics */}
// //       <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
// //         <div className="flex items-center gap-6">
// //           {['bullish', 'bearish', 'neutral'].map(bias => (
// //             patternStats[bias] > 0 && (
// //               <div key={bias} className="flex items-center gap-2">
// //                 <div className={`p-1 rounded border ${getBiasColor(bias)}`}>
// //                   {getBiasIcon(bias)}
// //                 </div>
// //                 <span className="text-sm font-medium text-slate-700">
// //                   {patternStats[bias]} {bias}
// //                 </span>
// //               </div>
// //             )
// //           ))}
// //         </div>
// //       </div>

// //       {/* Chart Container */}
// //       <div className="p-6">
// //         <div 
// //           ref={chartContainerRef} 
// //           className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-white"
// //           style={{ height: '500px' }}
// //         />
// //       </div>

// //       {/* Pattern Legend */}
// //       <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <span className="text-sm font-semibold text-slate-700">Pattern Legend:</span>
// //             <div className="flex items-center gap-3">
// //               <div className="flex items-center gap-2">
// //                 <div className="w-3 h-3 bg-green-500 rounded"></div>
// //                 <span className="text-xs text-slate-600">Bullish</span>
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <div className="w-3 h-3 bg-red-500 rounded"></div>
// //                 <span className="text-xs text-slate-600">Bearish</span>
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <div className="w-3 h-3 bg-purple-500 rounded"></div>
// //                 <span className="text-xs text-slate-600">Neutral</span>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="text-xs text-slate-500">
// //             Scores shown below candles • Hover for details
// //           </div>
// //         </div>
// //       </div>

// //       {/* Detected Patterns List */}
// //       <div className="border-t border-slate-200">
// //         <div className="px-6 py-4">
// //           <h4 className="text-sm font-semibold text-slate-700 mb-3">Detected Patterns:</h4>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
// //             {patterns.map((pattern, index) => {
// //               const meta = PatternRegistry.getPattern(pattern.patternId);
// //               const bias = meta?.bias || 'neutral';
              
// //               return (
// //                 <div 
// //                   key={index}
// //                   className={`p-3 rounded-lg border ${
// //                     bias === 'bullish' ? 'bg-green-50 border-green-200' :
// //                     bias === 'bearish' ? 'bg-red-50 border-red-200' :
// //                     'bg-purple-50 border-purple-200'
// //                   }`}
// //                 >
// //                   <div className="flex items-center justify-between">
// //                     <div>
// //                       <div className="font-semibold text-slate-800 text-sm">
// //                         {meta?.name || pattern.patternId}
// //                       </div>
// //                       <div className="text-xs text-slate-600 mt-1">
// //                         {pattern.date}
// //                       </div>
// //                     </div>
// //                     <div className={`px-2 py-1 rounded text-xs font-bold ${
// //                       bias === 'bullish' ? 'bg-green-100 text-green-800' :
// //                       bias === 'bearish' ? 'bg-red-100 text-red-800' :
// //                       'bg-purple-100 text-purple-800'
// //                     }`}>
// //                       {(pattern.score * 10).toFixed(1)}
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default ResearchChart;





// import { useEffect, useRef, useState } from 'react';
// import { createChart } from 'lightweight-charts';
// import { PatternRegistry } from './data/patternRegistry';
// import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// function ResearchChart({ priceData, patterns, fincode }) {
//   const chartContainerRef = useRef(null);
//   const chartRef = useRef(null);
//   const seriesRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [currentOHLC, setCurrentOHLC] = useState(null);

//   useEffect(() => {
//     if (!chartContainerRef.current || !priceData?.Date?.length) return;

//     const container = chartContainerRef.current;
//     container.innerHTML = '';

//     const chart = createChart(container, {
//       width: container.clientWidth,
//       height: 500,
//       layout: {
//         background: { color: '#ffffff' },
//         textColor: '#334155',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         attributionLogo: false
//       },
//       grid: {
//         vertLines: { color: '#f1f5f9' },
//         horzLines: { color: '#f1f5f9' }
//       },
//       rightPriceScale: {
//         borderColor: '#e2e8f0',
//         scaleMargins: {
//           top: 0.1,
//           bottom: 0.1,
//         }
//       },
//       timeScale: {
//         borderColor: '#e2e8f0',
//         timeVisible: true,
//         secondsVisible: false,
//         tickMarkFormatter: (time) => {
//           const date = new Date(time);
//           return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         }
//       },
//       crosshair: {
//         mode: 1,
//         vertLine: {
//           color: '#64748b',
//           width: 1,
//           style: 2,
//         },
//         horzLine: {
//           color: '#64748b',
//           width: 1,
//           style: 2,
//         }
//       },
//       handleScroll: {
//         mouseWheel: true,
//         pressedMouseMove: true,
//       },
//       handleScale: {
//         axisPressedMouseMove: true,
//         mouseWheel: true,
//         pinch: true,
//       },
//     });
//     chartRef.current = chart;

//     // === OHLC DATA ===
//     const ohlc = priceData.Date.map((date, i) => ({
//       time: date,
//       open: Number(priceData.Open[i]),
//       high: Number(priceData.High[i]),
//       low: Number(priceData.Low[i]),
//       close: Number(priceData.Close[i]),
//     })).filter(d => d.time && /^\d{4}-\d{2}-\d{2}$/.test(d.time));

//     if (ohlc.length === 0) {
//       container.innerHTML = `
//         <div class="flex flex-col items-center justify-center h-full text-slate-500">
//           <BarChart3 class="w-16 h-16 mb-4 opacity-50" />
//           <p class="text-lg font-medium">No valid price data available</p>
//           <p class="text-sm mt-1">Please check the data source</p>
//         </div>
//       `;
//       return;
//     }

//     const candlestickSeries = chart.addCandlestickSeries({
//       upColor: '#10b981',
//       downColor: '#ef4444',
//       borderVisible: false,
//       wickUpColor: '#10b981',
//       wickDownColor: '#ef4444',
//       priceFormat: {
//         type: 'price',
//         precision: 2,
//         minMove: 0.01,
//       }
//     });
//     candlestickSeries.setData(ohlc);
//     seriesRef.current = candlestickSeries;

//     // Set initial OHLC values to the latest candle
//     setCurrentOHLC(ohlc[ohlc.length - 1]);

//     // === MARKERS (Arrows + Score) ===
//     const markers = patterns.map(p => {
//       const meta = PatternRegistry.getPattern(p.patternId);
//       const shortName = meta?.shortName || p.patternId;
//       const bias = meta?.bias || 'neutral';
//       const color = bias === 'bullish' ? '#10b981' : bias === 'bearish' ? '#ef4444' : '#8b5cf6';

//       return {
//         time: p.date,
//         position: bias === 'bearish' ? 'aboveBar' : 'belowBar',
//         color,
//         shape: bias === 'bearish' ? 'arrowDown' : 'arrowUp',
//         text: `${shortName}\nScore: ${(p.score * 10).toFixed(1)}`,
//         size: 1.8,
//       };
//     });
//     candlestickSeries.setMarkers(markers);

//     // === HIGHLIGHT CANVAS (Background + Badge + Score) ===
//     const canvas = document.createElement('canvas');
//     canvas.width = container.clientWidth;
//     canvas.height = 500;
//     canvas.style.cssText = 'position:absolute;left:0;top:0;z-index:1;pointer-events:none;';
//     container.appendChild(canvas);
//     canvasRef.current = canvas;
//     const ctx = canvas.getContext('2d');

//     // const drawHighlights = () => {
//     //   if (!seriesRef.current) return;
//     //   ctx.clearRect(0, 0, canvas.width, canvas.height);

//     //   const timeScale = chart.timeScale();

//     //   patterns.forEach(p => {
//     //     const meta = PatternRegistry.getPattern(p.patternId);
//     //     const shortName = meta?.shortName || p.patternId;
//     //     const bias = meta?.bias || 'neutral';

//     //     const bgColor = bias === 'bullish' ? 'rgba(16, 185, 129, 0.15)' :
//     //                     bias === 'bearish' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)';
//     //     const badgeColor = bias === 'bullish' ? '#10b981' :
//     //                        bias === 'bearish' ? '#ef4444' : '#8b5cf6';
//     //     const annotation = shortName.slice(0, 3).toUpperCase();

//     //     const x = timeScale.timeToCoordinate(p.date);
//     //     if (x === null) return;

//     //     const index = ohlc.findIndex(d => d.time === p.date);
//     //     if (index === -1) return;

//     //     const candle = ohlc[index];

//     //     // CORRECT FOR lightweight-charts 4.2.0
//     //     const highY = candlestickSeries.priceToCoordinate(candle.high);
//     //     const lowY = candlestickSeries.priceToCoordinate(candle.low);

//     //     if (highY === null || lowY === null) return;

//     //     const padding = Math.abs(lowY - highY) * 0.4;

//     //     const boxX = x - 42;
//     //     const boxY = highY - padding;
//     //     const boxWidth = 84;
//     //     const boxHeight = lowY - highY + padding * 2;

//     //     // Background highlight
//     //     ctx.fillStyle = bgColor;
//     //     ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

//     //     // Badge
//     //     const badgeSize = 36;
//     //     const badgeX = boxX + boxWidth / 2 - badgeSize / 2;
//     //     const badgeY = boxY - badgeSize - 12;

//     //     ctx.fillStyle = badgeColor;
//     //     ctx.beginPath();
//     //     ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 8);
//     //     ctx.fill();

//     //     ctx.fillStyle = '#ffffff';
//     //     ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
//     //     ctx.textAlign = 'center';
//     //     ctx.textBaseline = 'middle';
//     //     ctx.fillText(annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);

//     //     // Score badge below candle
//     //     const scoreText = (p.score * 10).toFixed(1);
//     //     ctx.fillStyle = badgeColor;
//     //     ctx.beginPath();
//     //     ctx.roundRect(x - 20, boxY + boxHeight + 8, 40, 20, 10);
//     //     ctx.fill();

//     //     ctx.fillStyle = '#ffffff';
//     //     ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
//     //     ctx.fillText(scoreText, x, boxY + boxHeight + 20);
//     //   });
//     // };

//     // const drawHighlights = () => {
//     //   if (!seriesRef.current) return;
//     //   ctx.clearRect(0, 0, canvas.width, canvas.height);

//     //   const timeScale = chart.timeScale();
//     //   const priceScale = seriesRef.current.priceScale();

//     //   // Get candle width based on zoom level
//     //   const barSpacing = timeScale.options().barSpacing || 3;  // default candle width

//     //   patterns.forEach((p) => {
//     //     const meta = PatternRegistry.getPattern(p.patternId);
//     //     const shortName = meta?.shortName || p.patternId;
//     //     const bias = meta?.bias || "neutral";

//     //     const bgColor =
//     //       bias === "bullish"
//     //         ? "rgba(16,185,129,0.20)"
//     //         : bias === "bearish"
//     //           ? "rgba(239,68,68,0.20)"
//     //           : "rgba(139,92,246,0.20)";

//     //     const badgeColor =
//     //       bias === "bullish"
//     //         ? "#10b981"
//     //         : bias === "bearish"
//     //           ? "#ef4444"
//     //           : "#8b5cf6";

//     //     const annotation = shortName.slice(0, 3).toUpperCase();

//     //     // Convert time → X coordinate
//     //     const x = timeScale.timeToCoordinate(p.date);
//     //     if (x === null) return;

//     //     // Find candle OHLC
//     //     const index = ohlc.findIndex((d) => d.time === p.date);
//     //     if (index === -1) return;

//     //     const candle = ohlc[index];

//     //     // Convert prices → Y coordinates
//     //     const highY = seriesRef.current.priceToCoordinate(candle.high);
//     //     const lowY = seriesRef.current.priceToCoordinate(candle.low);

//     //     if (highY === null || lowY === null) return;

//     //     // Candle height on screen
//     //     const candleHeight = Math.abs(lowY - highY);
//     //     const paddingY = candleHeight * 0.4;

//     //     // ⭐ FIX: Highlight width = EXACT candle width (never more)
//     //     const boxWidth = barSpacing * 0.9; // make it slightly slimmer than bar itself
//     //     const boxX = x - boxWidth / 2;

//     //     const boxY = highY - paddingY;
//     //     const boxHeight = candleHeight + paddingY * 2;

//     //     // Background highlight tightly on that candle
//     //     ctx.fillStyle = bgColor;
//     //     ctx.beginPath();
//     //     ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6);
//     //     ctx.fill();

//     //     // ===== Annotation badge above candle =====
//     //     const badgeSize = Math.max(26, candleHeight * 0.8);
//     //     const badgeX = x - badgeSize / 2;
//     //     const badgeY = boxY - badgeSize - 6;

//     //     ctx.fillStyle = badgeColor;
//     //     ctx.beginPath();
//     //     ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 6);
//     //     ctx.fill();

//     //     ctx.fillStyle = "#ffffff";
//     //     ctx.font = `600 ${badgeSize * 0.32}px -apple-system, BlinkMacSystemFont, Segoe UI`;
//     //     ctx.textAlign = "center";
//     //     ctx.textBaseline = "middle";
//     //     ctx.fillText(annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);

//     //     // ===== Score badge BELOW candle =====
//     //     const scoreText = (p.score * 10).toFixed(1);
//     //     const scoreW = badgeSize * 1.2;
//     //     const scoreH = badgeSize * 0.5;

//     //     const scoreX = x - scoreW / 2;
//     //     const scoreY = boxY + boxHeight + 6;

//     //     ctx.fillStyle = badgeColor;
//     //     ctx.beginPath();
//     //     ctx.roundRect(scoreX, scoreY, scoreW, scoreH, 6);
//     //     ctx.fill();

//     //     ctx.fillStyle = "#ffffff";
//     //     ctx.font = `600 ${scoreH * 0.55}px -apple-system, BlinkMacSystemFont, Segoe UI`;
//     //     ctx.fillText(scoreText, scoreX + scoreW / 2, scoreY + scoreH / 2);
//     //   });
//     // };


//     const drawHighlights = () => {
//       if (!seriesRef.current) return;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const timeScale = chart.timeScale();
//       const priceScale = seriesRef.current.priceScale();

//       // Get candle width based on zoom level
//       const barSpacing = timeScale.options().barSpacing || 6;

//       patterns.forEach((p) => {
//         const meta = PatternRegistry.getPattern(p.patternId);
//         const shortName = meta?.shortName || p.patternId;
//         const bias = meta?.bias || "neutral";

//         // Enhanced color scheme with gradients
//         const biasColors = {
//           bullish: {
//             bg: "rgba(16,185,129,0.25)",
//             badge: "#10b981",
//             glow: "rgba(16,185,129,0.4)"
//           },
//           bearish: {
//             bg: "rgba(239,68,68,0.25)",
//             badge: "#ef4444",
//             glow: "rgba(239,68,68,0.4)"
//           },
//           neutral: {
//             bg: "rgba(139,92,246,0.25)",
//             badge: "#8b5cf6",
//             glow: "rgba(139,92,246,0.4)"
//           }
//         };

//         const colors = biasColors[bias];
//         const annotation = shortName.slice(0, 3).toUpperCase();

//         // Convert time → X coordinate
//         const x = timeScale.timeToCoordinate(p.date);
//         if (x === null) return;

//         // Find candle OHLC
//         const index = ohlc.findIndex((d) => d.time === p.date);
//         if (index === -1) return;

//         const candle = ohlc[index];

//         // Convert prices → Y coordinates
//         const highY = seriesRef.current.priceToCoordinate(candle.high);
//         const lowY = seriesRef.current.priceToCoordinate(candle.low);

//         if (highY === null || lowY === null) return;

//         // Candle height on screen
//         const candleHeight = Math.abs(lowY - highY);
//         const paddingY = candleHeight * 0.5; // Increased padding

//         // ⭐ WIDER highlight area - covers more space
//         const boxWidth = barSpacing * 1.8; // Increased from 0.9 to 1.8
//         const boxX = x - boxWidth / 2;

//         const boxY = highY - paddingY;
//         const boxHeight = candleHeight + paddingY * 2;

//         // Add subtle glow effect
//         ctx.shadowColor = colors.glow;
//         ctx.shadowBlur = 8;
//         ctx.shadowOffsetX = 0;
//         ctx.shadowOffsetY = 0;

//         // Background highlight with gradient
//         const gradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
//         gradient.addColorStop(0, colors.bg.replace('0.25', '0.3'));
//         gradient.addColorStop(1, colors.bg.replace('0.25', '0.15'));

//         ctx.fillStyle = gradient;
//         ctx.beginPath();
//         ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8); // Increased border radius
//         ctx.fill();

//         // Reset shadow for other elements
//         ctx.shadowBlur = 0;

//         // ===== Enhanced annotation badge =====
//         const badgeSize = Math.max(28, candleHeight * 0.9); // Slightly larger
//         const badgeX = x - badgeSize / 2;
//         const badgeY = boxY - badgeSize - 8; // More spacing

//         // Badge with subtle shadow
//         ctx.shadowColor = "rgba(0,0,0,0.2)";
//         ctx.shadowBlur = 4;
//         ctx.shadowOffsetY = 2;

//         ctx.fillStyle = colors.badge;
//         ctx.beginPath();
//         ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 8);
//         ctx.fill();

//         ctx.shadowBlur = 0;

//         // Badge text with better styling
//         ctx.fillStyle = "#ffffff";
//         ctx.font = `600 ${badgeSize * 0.36}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";

//         // Text shadow for better readability
//         ctx.shadowColor = "rgba(0,0,0,0.3)";
//         ctx.shadowBlur = 2;
//         ctx.shadowOffsetY = 1;

//         ctx.fillText(annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);
//         ctx.shadowBlur = 0;

//         // ===== Enhanced score badge =====
//         const scoreText = (p.score * 10).toFixed(1);
//         const scoreW = badgeSize * 1.4; // Wider
//         const scoreH = badgeSize * 0.6; // Taller

//         const scoreX = x - scoreW / 2;
//         const scoreY = boxY + boxHeight + 8; // More spacing

//         // Score badge with shadow
//         ctx.shadowColor = "rgba(0,0,0,0.2)";
//         ctx.shadowBlur = 4;
//         ctx.shadowOffsetY = 2;

//         ctx.fillStyle = colors.badge;
//         ctx.beginPath();
//         ctx.roundRect(scoreX, scoreY, scoreW, scoreH, 8);
//         ctx.fill();

//         ctx.shadowBlur = 0;

//         // Score text with better styling
//         ctx.fillStyle = "#ffffff";
//         ctx.font = `600 ${scoreH * 0.6}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";

//         // Text shadow
//         ctx.shadowColor = "rgba(0,0,0,0.3)";
//         ctx.shadowBlur = 2;
//         ctx.shadowOffsetY = 1;

//         ctx.fillText(scoreText, scoreX + scoreW / 2, scoreY + scoreH / 2);
//         ctx.shadowBlur = 0;

//         // ===== Optional: Add connecting line between badges =====
//         ctx.strokeStyle = colors.badge;
//         ctx.lineWidth = 1.5;
//         ctx.setLineDash([3, 2]);
//         ctx.beginPath();
//         ctx.moveTo(x, badgeY + badgeSize); // Bottom of top badge
//         ctx.lineTo(x, scoreY); // Top of bottom badge
//         ctx.stroke();
//         ctx.setLineDash([]);
//       });
//     };

//     // Crosshair move handler to update OHLC values
//     chart.subscribeCrosshairMove(param => {
//       if (param.time) {
//         const data = param.seriesData.get(candlestickSeries);
//         if (data) {
//           setCurrentOHLC(data);
//         }
//       } else {
//         // If no crosshair position, show the latest candle
//         setCurrentOHLC(ohlc[ohlc.length - 1]);
//       }
//     });

//     // Initial draw
//     drawHighlights();

//     // Redraw on ANY change
//     const redraw = () => requestAnimationFrame(drawHighlights);
//     chart.timeScale().subscribeVisibleLogicalRangeChange(redraw);

//     // Resize handler
//     const handleResize = () => {
//       chart.applyOptions({ width: container.clientWidth });
//       canvas.width = container.clientWidth;
//       drawHighlights();
//     };
//     window.addEventListener('resize', handleResize);

//     // Fit content
//     chart.timeScale().fitContent();

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       chart.remove();
//     };
//   }, [priceData, patterns, fincode]);

//   // Calculate pattern statistics
//   const patternStats = patterns.reduce((acc, pattern) => {
//     const meta = PatternRegistry.getPattern(pattern.patternId);
//     const bias = meta?.bias || 'neutral';
//     acc[bias] = (acc[bias] || 0) + 1;
//     acc.totalScore += pattern.score;
//     return acc;
//   }, { totalScore: 0 });

//   const averageScore = patterns.length > 0 ? (patternStats.totalScore / patterns.length) * 10 : 0;

//   const getBiasIcon = (bias) => {
//     switch (bias) {
//       case 'bullish': return <TrendingUp className="w-4 h-4" />;
//       case 'bearish': return <TrendingDown className="w-4 h-4" />;
//       default: return <Minus className="w-4 h-4" />;
//     }
//   };

//   const getBiasColor = (bias) => {
//     switch (bias) {
//       case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
//       case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
//       default: return 'text-purple-600 bg-purple-50 border-purple-200';
//     }
//   };

//   const OHLCItem = ({ label, value, color = "text-slate-700" }) => (
//     <div className="flex flex-col items-center">
//       <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
//       <span className={`text-sm font-bold ${color}`}>{value}</span>
//     </div>
//   );

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//       {/* Chart Header */}
//       <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
//                 <BarChart3 className="w-6 h-6 text-slate-700" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-slate-800">
//                   {priceData.Symbol || 'Unknown Symbol'}
//                 </h3>
//                 <p className="text-slate-600 text-sm font-medium">
//                   FINCODE: {fincode} • {patterns.length} Pattern{patterns.length !== 1 ? 's' : ''} Detected
//                 </p>
//               </div>
//             </div>

//             {/* OHLC Values - Horizontal Display */}
//             {currentOHLC && (
//               <div className="flex items-center gap-6 bg-white rounded-lg px-4 py-3 border border-slate-200 shadow-sm">
//                 <OHLCItem label="Open" value={currentOHLC.open?.toFixed(2) || '—'} />
//                 <div className="h-8 w-px bg-slate-300"></div>
//                 <OHLCItem label="High" value={currentOHLC.high?.toFixed(2) || '—'} color="text-green-600" />
//                 <div className="h-8 w-px bg-slate-300"></div>
//                 <OHLCItem label="Low" value={currentOHLC.low?.toFixed(2) || '—'} color="text-red-600" />
//                 <div className="h-8 w-px bg-slate-300"></div>
//                 <OHLCItem
//                   label="Close"
//                   value={currentOHLC.close?.toFixed(2) || '—'}
//                   color={currentOHLC.close >= currentOHLC.open ? "text-green-600" : "text-red-600"}
//                 />
//                 {currentOHLC.time && (
//                   <>
//                     <div className="h-8 w-px bg-slate-300"></div>
//                     <div className="flex flex-col items-center">
//                       <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date</span>
//                       <span className="text-sm font-bold text-slate-700">
//                         {new Date(currentOHLC.time).toLocaleDateString('en-US', {
//                           month: 'short',
//                           day: 'numeric',
//                           year: 'numeric'
//                         })}
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
// {/* 
//           <div className="flex items-center gap-3">
//             <div className="bg-white rounded-lg px-3 py-2 border border-slate-200 shadow-sm">
//               <span className="text-sm font-semibold text-slate-700">
//                 Avg Score: <span className="text-blue-600">{averageScore.toFixed(1)}/10</span>
//               </span>
//             </div>
//           </div> */}
//         </div>
//       </div>

//       {/* Pattern Statistics */}
//       {/* <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
//         <div className="flex items-center gap-6">
//           {['bullish', 'bearish', 'neutral'].map(bias => (
//             patternStats[bias] > 0 && (
//               <div key={bias} className="flex items-center gap-2">
//                 <div className={`p-1 rounded border ${getBiasColor(bias)}`}>
//                   {getBiasIcon(bias)}
//                 </div>
//                 <span className="text-sm font-medium text-slate-700">
//                   {patternStats[bias]} {bias}
//                 </span>
//               </div>
//             )
//           ))}
//         </div>
//       </div> */}

//       {/* Chart Container */}
//       <div className="p-6">
//         <div
//           ref={chartContainerRef}
//           className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-white"
//           style={{ height: '500px' }}
//         />
//       </div>

//       {/* Pattern Legend */}
//       <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <span className="text-sm font-semibold text-slate-700">Pattern Legend:</span>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-green-500 rounded"></div>
//                 <span className="text-xs text-slate-600">Bullish</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded"></div>
//                 <span className="text-xs text-slate-600">Bearish</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-purple-500 rounded"></div>
//                 <span className="text-xs text-slate-600">Neutral</span>
//               </div>
//             </div>
//           </div>
//           <div className="text-xs text-slate-500">
//             Scores shown below candles • Hover for details
//           </div>
//         </div>
//       </div>

//       {/* Detected Patterns List */}
//       {/* <div className="border-t border-slate-200">
//         <div className="px-6 py-4">
//           <h4 className="text-sm font-semibold text-slate-700 mb-3">Detected Patterns:</h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {patterns.map((pattern, index) => {
//               const meta = PatternRegistry.getPattern(pattern.patternId);
//               const bias = meta?.bias || 'neutral';

//               return (
//                 <div
//                   key={index}
//                   className={`p-3 rounded-lg border ${bias === 'bullish' ? 'bg-green-50 border-green-200' :
//                     bias === 'bearish' ? 'bg-red-50 border-red-200' :
//                       'bg-purple-50 border-purple-200'
//                     }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-semibold text-slate-800 text-sm">
//                         {meta?.name || pattern.patternId}
//                       </div>
//                       <div className="text-xs text-slate-600 mt-1">
//                         {pattern.date}
//                       </div>
//                     </div>
//                     <div className={`px-2 py-1 rounded text-xs font-bold ${bias === 'bullish' ? 'bg-green-100 text-green-800' :
//                       bias === 'bearish' ? 'bg-red-100 text-red-800' :
//                         'bg-purple-100 text-purple-800'
//                       }`}>
//                       {(pattern.score * 10).toFixed(1)}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// }

// export default ResearchChart;






import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { PatternRegistry } from './data/patternRegistry';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

function ResearchChart({ priceData, patterns, fincode }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentOHLC, setCurrentOHLC] = useState(null);

  useEffect(() => {
    if (!chartContainerRef.current || !priceData?.Date?.length) return;

    const container = chartContainerRef.current;
    container.innerHTML = '';

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 500,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#334155',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        attributionLogo: false
      },
      grid: {
        vertLines: { color: '#f1f5f9' },
        horzLines: { color: '#f1f5f9' }
      },
      rightPriceScale: {
        borderColor: '#e2e8f0',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        }
      },
      timeScale: {
        borderColor: '#e2e8f0',
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time) => {
          const date = new Date(time);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#64748b',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: '#64748b',
          width: 1,
          style: 2,
        }
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });
    chartRef.current = chart;

    // === OHLC DATA ===
    const ohlc = priceData.Date.map((date, i) => ({
      time: date,
      open: Number(priceData.Open[i]),
      high: Number(priceData.High[i]),
      low: Number(priceData.Low[i]),
      close: Number(priceData.Close[i]),
    })).filter(d => d.time && /^\d{4}-\d{2}-\d{2}$/.test(d.time));

    if (ohlc.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-slate-500">
          <BarChart3 class="w-16 h-16 mb-4 opacity-50" />
          <p class="text-lg font-medium">No valid price data available</p>
          <p class="text-sm mt-1">Please check the data source</p>
        </div>
      `;
      return;
    }

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      }
    });
    candlestickSeries.setData(ohlc);
    seriesRef.current = candlestickSeries;

    // Set initial OHLC values to the latest candle
    setCurrentOHLC(ohlc[ohlc.length - 1]);

    // === MARKERS (Arrows + Score) ===
    const markers = patterns.map(p => {
      const meta = PatternRegistry.getPattern(p.patternId);
      const shortName = meta?.shortName || p.patternId;
      const bias = meta?.bias || 'neutral';
      const color = bias === 'bullish' ? '#10b981' : bias === 'bearish' ? '#ef4444' : '#8b5cf6';

      return {
        time: p.date,
        position: bias === 'bearish' ? 'aboveBar' : 'belowBar',
        color,
        shape: bias === 'bearish' ? 'arrowDown' : 'arrowUp',
        text: `${shortName}\nScore: ${(p.score * 10).toFixed(1)}`,
        size: 1.8,
      };
    });
    console.log('CandlestickSeries object:', candlestickSeries);
    console.log('Available methods:', Object.keys(candlestickSeries));
    // candlestickSeries.setMarkers(markers);

    // === HIGHLIGHT CANVAS (Background + Badge + Score) ===
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = 500;
    canvas.style.cssText = 'position:absolute;left:0;top:0;z-index:1;pointer-events:none;';
    container.appendChild(canvas);
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    // const drawHighlights = () => {
    //   if (!seriesRef.current) return;
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);

    //   const timeScale = chart.timeScale();

    //   patterns.forEach(p => {
    //     const meta = PatternRegistry.getPattern(p.patternId);
    //     const shortName = meta?.shortName || p.patternId;
    //     const bias = meta?.bias || 'neutral';

    //     const bgColor = bias === 'bullish' ? 'rgba(16, 185, 129, 0.15)' :
    //                     bias === 'bearish' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)';
    //     const badgeColor = bias === 'bullish' ? '#10b981' :
    //                        bias === 'bearish' ? '#ef4444' : '#8b5cf6';
    //     const annotation = shortName.slice(0, 3).toUpperCase();

    //     const x = timeScale.timeToCoordinate(p.date);
    //     if (x === null) return;

    //     const index = ohlc.findIndex(d => d.time === p.date);
    //     if (index === -1) return;

    //     const candle = ohlc[index];

    //     // CORRECT FOR lightweight-charts 4.2.0
    //     const highY = candlestickSeries.priceToCoordinate(candle.high);
    //     const lowY = candlestickSeries.priceToCoordinate(candle.low);

    //     if (highY === null || lowY === null) return;

    //     const padding = Math.abs(lowY - highY) * 0.4;

    //     const boxX = x - 42;
    //     const boxY = highY - padding;
    //     const boxWidth = 84;
    //     const boxHeight = lowY - highY + padding * 2;

    //     // Background highlight
    //     ctx.fillStyle = bgColor;
    //     ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    //     // Badge
    //     const badgeSize = 36;
    //     const badgeX = boxX + boxWidth / 2 - badgeSize / 2;
    //     const badgeY = boxY - badgeSize - 12;

    //     ctx.fillStyle = badgeColor;
    //     ctx.beginPath();
    //     ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 8);
    //     ctx.fill();

    //     ctx.fillStyle = '#ffffff';
    //     ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    //     ctx.textAlign = 'center';
    //     ctx.textBaseline = 'middle';
    //     ctx.fillText(annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);

    //     // Score badge below candle
    //     const scoreText = (p.score * 10).toFixed(1);
    //     ctx.fillStyle = badgeColor;
    //     ctx.beginPath();
    //     ctx.roundRect(x - 20, boxY + boxHeight + 8, 40, 20, 10);
    //     ctx.fill();

    //     ctx.fillStyle = '#ffffff';
    //     ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    //     ctx.fillText(scoreText, x, boxY + boxHeight + 20);
    //   });
    // };

    // const drawHighlights = () => {
    //   if (!seriesRef.current) return;
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);

    //   const timeScale = chart.timeScale();
    //   const priceScale = seriesRef.current.priceScale();

    //   // Get candle width based on zoom level
    //   const barSpacing = timeScale.options().barSpacing || 3;  // default candle width

    //   patterns.forEach((p) => {
    //     const meta = PatternRegistry.getPattern(p.patternId);
    //     const shortName = meta?.shortName || p.patternId;
    //     const bias = meta?.bias || "neutral";

    //     const bgColor =
    //       bias === "bullish"
    //         ? "rgba(16,185,129,0.20)"
    //         : bias === "bearish"
    //           ? "rgba(239,68,68,0.20)"
    //           : "rgba(139,92,246,0.20)";

    //     const badgeColor =
    //       bias === "bullish"
    //         ? "#10b981"
    //         : bias === "bearish"
    //           ? "#ef4444"
    //           : "#8b5cf6";

    //     const annotation = shortName.slice(0, 3).toUpperCase();

    //     // Convert time → X coordinate
    //     const x = timeScale.timeToCoordinate(p.date);
    //     if (x === null) return;

    //     // Find candle OHLC
    //     const index = ohlc.findIndex((d) => d.time === p.date);
    //     if (index === -1) return;

    //     const candle = ohlc[index];

    //     // Convert prices → Y coordinates
    //     const highY = seriesRef.current.priceToCoordinate(candle.high);
    //     const lowY = seriesRef.current.priceToCoordinate(candle.low);

    //     if (highY === null || lowY === null) return;

    //     // Candle height on screen
    //     const candleHeight = Math.abs(lowY - highY);
    //     const paddingY = candleHeight * 0.4;

    //     // ⭐ FIX: Highlight width = EXACT candle width (never more)
    //     const boxWidth = barSpacing * 0.9; // make it slightly slimmer than bar itself
    //     const boxX = x - boxWidth / 2;

    //     const boxY = highY - paddingY;
    //     const boxHeight = candleHeight + paddingY * 2;

    //     // Background highlight tightly on that candle
    //     ctx.fillStyle = bgColor;
    //     ctx.beginPath();
    //     ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6);
    //     ctx.fill();

    //     // ===== Annotation badge above candle =====
    //     const badgeSize = Math.max(26, candleHeight * 0.8);
    //     const badgeX = x - badgeSize / 2;
    //     const badgeY = boxY - badgeSize - 6;

    //     ctx.fillStyle = badgeColor;
    //     ctx.beginPath();
    //     ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 6);
    //     ctx.fill();

    //     ctx.fillStyle = "#ffffff";
    //     ctx.font = `600 ${badgeSize * 0.32}px -apple-system, BlinkMacSystemFont, Segoe UI`;
    //     ctx.textAlign = "center";
    //     ctx.textBaseline = "middle";
    //     ctx.fillText(annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);

    //     // ===== Score badge BELOW candle =====
    //     const scoreText = (p.score * 10).toFixed(1);
    //     const scoreW = badgeSize * 1.2;
    //     const scoreH = badgeSize * 0.5;

    //     const scoreX = x - scoreW / 2;
    //     const scoreY = boxY + boxHeight + 6;

    //     ctx.fillStyle = badgeColor;
    //     ctx.beginPath();
    //     ctx.roundRect(scoreX, scoreY, scoreW, scoreH, 6);
    //     ctx.fill();

    //     ctx.fillStyle = "#ffffff";
    //     ctx.font = `600 ${scoreH * 0.55}px -apple-system, BlinkMacSystemFont, Segoe UI`;
    //     ctx.fillText(scoreText, scoreX + scoreW / 2, scoreY + scoreH / 2);
    //   });
    // };


    const drawHighlights = () => {
      if (!seriesRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const timeScale = chart.timeScale();
      const priceScale = seriesRef.current.priceScale();

      // Get candle width based on zoom level
      const barSpacing = timeScale.options().barSpacing || 6;

      patterns.forEach((p) => {
        const meta = PatternRegistry.getPattern(p.patternId);
        const shortName = meta?.shortName || p.patternId;
        const bias = meta?.bias || "neutral";

        // Enhanced color scheme with gradients
        const biasColors = {
          bullish: {
            bg: "rgba(16,185,129,0.25)",
            badge: "#10b981",
            glow: "rgba(16,185,129,0.4)"
          },
          bearish: {
            bg: "rgba(239,68,68,0.25)",
            badge: "#ef4444",
            glow: "rgba(239,68,68,0.4)"
          },
          neutral: {
            bg: "rgba(139,92,246,0.25)",
            badge: "#8b5cf6",
            glow: "rgba(139,92,246,0.4)"
          }
        };

        const colors = biasColors[bias];
        const annotation = shortName.slice(0, 3).toUpperCase();

        // Convert time → X coordinate
        const x = timeScale.timeToCoordinate(p.date);
        if (x === null) return;

        // Find candle OHLC
        const index = ohlc.findIndex((d) => d.time === p.date);
        if (index === -1) return;

        const candle = ohlc[index];

        // Convert prices → Y coordinates
        const highY = seriesRef.current.priceToCoordinate(candle.high);
        const lowY = seriesRef.current.priceToCoordinate(candle.low);

        if (highY === null || lowY === null) return;

        // Candle height on screen
        const candleHeight = Math.abs(lowY - highY);
        const paddingY = candleHeight * 0.5; // Increased padding

        // ⭐ WIDER highlight area - covers more space
        const boxWidth = barSpacing * 1.8; // Increased from 0.9 to 1.8
        const boxX = x - boxWidth / 2;

        const boxY = highY - paddingY;
        const boxHeight = candleHeight + paddingY * 2;

        // Add subtle glow effect
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Background highlight with gradient
        const gradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
        gradient.addColorStop(0, colors.bg.replace('0.25', '0.3'));
        gradient.addColorStop(1, colors.bg.replace('0.25', '0.15'));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8); // Increased border radius
        ctx.fill();

        // Reset shadow for other elements
        ctx.shadowBlur = 0;

        // ===== Enhanced annotation badge =====
        const badgeSize = Math.max(28, candleHeight * 0.9); // Slightly larger
        const badgeX = x - badgeSize / 2;
        const badgeY = boxY - badgeSize - 8; // More spacing

        // Badge with subtle shadow
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = colors.badge;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 8);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Badge text with better styling
        ctx.fillStyle = "#ffffff";
        ctx.font = `600 ${badgeSize * 0.36}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Text shadow for better readability
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetY = 1;

        ctx.fillText(annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);
        ctx.shadowBlur = 0;

        // ===== Enhanced score badge =====
        const scoreText = (p.score * 10).toFixed(1);
        const scoreW = badgeSize * 1.4; // Wider
        const scoreH = badgeSize * 0.6; // Taller

        const scoreX = x - scoreW / 2;
        const scoreY = boxY + boxHeight + 8; // More spacing

        // Score badge with shadow
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = colors.badge;
        ctx.beginPath();
        ctx.roundRect(scoreX, scoreY, scoreW, scoreH, 8);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Score text with better styling
        ctx.fillStyle = "#ffffff";
        ctx.font = `600 ${scoreH * 0.6}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Text shadow
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetY = 1;

        ctx.fillText(scoreText, scoreX + scoreW / 2, scoreY + scoreH / 2);
        ctx.shadowBlur = 0;

        // ===== Optional: Add connecting line between badges =====
        ctx.strokeStyle = colors.badge;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(x, badgeY + badgeSize); // Bottom of top badge
        ctx.lineTo(x, scoreY); // Top of bottom badge
        ctx.stroke();
        ctx.setLineDash([]);
      });
    };

    // Crosshair move handler to update OHLC values
    chart.subscribeCrosshairMove(param => {
      if (param.time) {
        const data = param.seriesData.get(candlestickSeries);
        if (data) {
          setCurrentOHLC(data);
        }
      } else {
        // If no crosshair position, show the latest candle
        setCurrentOHLC(ohlc[ohlc.length - 1]);
      }
    });

    // Initial draw
    drawHighlights();

    // Redraw on ANY change
    const redraw = () => requestAnimationFrame(drawHighlights);
    chart.timeScale().subscribeVisibleLogicalRangeChange(redraw);

    // Resize handler
    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
      canvas.width = container.clientWidth;
      drawHighlights();
    };
    window.addEventListener('resize', handleResize);

    // Fit content
    chart.timeScale().fitContent();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [priceData, patterns, fincode]);

  // Calculate pattern statistics
  const patternStats = patterns.reduce((acc, pattern) => {
    const meta = PatternRegistry.getPattern(pattern.patternId);
    const bias = meta?.bias || 'neutral';
    acc[bias] = (acc[bias] || 0) + 1;
    acc.totalScore += pattern.score;
    return acc;
  }, { totalScore: 0 });

  const averageScore = patterns.length > 0 ? (patternStats.totalScore / patterns.length) * 10 : 0;

  const getBiasIcon = (bias) => {
    switch (bias) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />;
      case 'bearish': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getBiasColor = (bias) => {
    switch (bias) {
      case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
      case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };

  const OHLCItem = ({ label, value, color = "text-slate-700" }) => (
    <div className="flex flex-col items-center">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Chart Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                <BarChart3 className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {priceData.Symbol || 'Unknown Symbol'}
                </h3>
                <p className="text-slate-600 text-sm font-medium">
                  FINCODE: {fincode} • {patterns.length} Pattern{patterns.length !== 1 ? 's' : ''} Detected
                </p>
              </div>
            </div>

            {/* OHLC Values - Horizontal Display */}
            {currentOHLC && (
              <div className="flex items-center gap-6 bg-white rounded-lg px-4 py-3 border border-slate-200 shadow-sm">
                <OHLCItem label="Open" value={currentOHLC.open?.toFixed(2) || '—'} />
                <div className="h-8 w-px bg-slate-300"></div>
                <OHLCItem label="High" value={currentOHLC.high?.toFixed(2) || '—'} color="text-green-600" />
                <div className="h-8 w-px bg-slate-300"></div>
                <OHLCItem label="Low" value={currentOHLC.low?.toFixed(2) || '—'} color="text-red-600" />
                <div className="h-8 w-px bg-slate-300"></div>
                <OHLCItem
                  label="Close"
                  value={currentOHLC.close?.toFixed(2) || '—'}
                  color={currentOHLC.close >= currentOHLC.open ? "text-green-600" : "text-red-600"}
                />
                {currentOHLC.time && (
                  <>
                    <div className="h-8 w-px bg-slate-300"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date</span>
                      <span className="text-sm font-bold text-slate-700">
                        {new Date(currentOHLC.time).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {/* 
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg px-3 py-2 border border-slate-200 shadow-sm">
              <span className="text-sm font-semibold text-slate-700">
                Avg Score: <span className="text-blue-600">{averageScore.toFixed(1)}/10</span>
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Pattern Statistics */}
      {/* <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-6">
          {['bullish', 'bearish', 'neutral'].map(bias => (
            patternStats[bias] > 0 && (
              <div key={bias} className="flex items-center gap-2">
                <div className={`p-1 rounded border ${getBiasColor(bias)}`}>
                  {getBiasIcon(bias)}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {patternStats[bias]} {bias}
                </span>
              </div>
            )
          ))}
        </div>
      </div> */}

      {/* Chart Container */}
      <div className="p-6">
        <div
          ref={chartContainerRef}
          className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-white"
          style={{ height: '500px' }}
        />
      </div>

      {/* Pattern Legend */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">Pattern Legend:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-slate-600">Bullish</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-slate-600">Bearish</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-xs text-slate-600">Neutral</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Scores shown below candles • Hover for details
          </div>
        </div>
      </div>

      {/* Detected Patterns List */}
      {/* <div className="border-t border-slate-200">
        <div className="px-6 py-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Detected Patterns:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {patterns.map((pattern, index) => {
              const meta = PatternRegistry.getPattern(pattern.patternId);
              const bias = meta?.bias || 'neutral';

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${bias === 'bullish' ? 'bg-green-50 border-green-200' :
                    bias === 'bearish' ? 'bg-red-50 border-red-200' :
                      'bg-purple-50 border-purple-200'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">
                        {meta?.name || pattern.patternId}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {pattern.date}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${bias === 'bullish' ? 'bg-green-100 text-green-800' :
                      bias === 'bearish' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                      {(pattern.score * 10).toFixed(1)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default ResearchChart;