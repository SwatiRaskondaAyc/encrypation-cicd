//     console.debug('ResearchChart company prop:', company);
//     // Base URL for backend API (adjust via env var or fallback)
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     // Search options from backend (GET /api/equity-insights/search/options)
//     const [searchOptions, setSearchOptions] = useState([]);
//     const chartContainerRef = useRef(null);
//     const chartRef = useRef(null);
//     const seriesRef = useRef(null);
//     const canvasRef = useRef(null);
//     const indicatorSeriesRef = useRef({});
//     const isFitRef = useRef(false);

//     // Data State
//     const [data, setData] = useState([]);
//     const [priceData, setPriceData] = useState({ Date: [], Open: [], High: [], Low: [], Close: [] });
//     const [oldestAvailableDate, setOldestAvailableDate] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isFullyLoaded, setIsFullyLoaded] = useState(false);
//     const [startDate, setStartDate] = useState(null);
//     const [chartReady, setChartReady] = useState(false);
//     const [patterns, setPatterns] = useState([]); // Pattern state

//     const [currentOHLC, setCurrentOHLC] = useState(null);

//     // Indicators State
//     const [activeIndicators, setActiveIndicators] = useState([]);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     // Patterns State
//     const [activePatternIds, setActivePatternIds] = useState([]);
//     const [isPatternMenuOpen, setIsPatternMenuOpen] = useState(false);

//     // Annotation State
//     const [activeTool, setActiveTool] = useState(null);
//     const [drawings, setDrawings] = useState([]);
//     const [isAnnotationMenuOpen, setIsAnnotationMenuOpen] = useState(false);

//     // Full Screen State
//     const [isFullScreen, setIsFullScreen] = useState(false);

//     // Toggle body scroll when in full screen
//     useEffect(() => {
//         if (isFullScreen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = '';
//         }
//         return () => {
//             document.body.style.overflow = '';
//         };
//     }, [isFullScreen]);

//     // Export ALL available indicators to CSV (User requirement: "download all the indicator data")
//     const exportIndicatorCSV = useCallback((chartData, filename) => {
//         if (!chartData || chartData.length === 0) return;

//         console.log(`Calculating indicators for ${filename}...`);

//         const indicatorMap = new Map();

//         // 1. Initialize with OHLCV
//         chartData.forEach(d => {
//             indicatorMap.set(d.time, { date: d.time, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume || 0 });
//         });

//         // 2. Iterate ALL Available Indicators
//         AVAILABLE_INDICATORS.forEach(ind => {
//             try {
//                 // Helper to add data to map
//                 const addDataToMap = (prefix, dataObj) => {
//                     if (!dataObj) return;
//                     dataObj.forEach(d => {
//                         if (indicatorMap.has(d.time)) {
//                             const row = indicatorMap.get(d.time);

//                             // Specific Field Handling
//                             if (ind.id === 'BB') {
//                                 // Only Upper/Lower
//                                 if (d.upper !== undefined) row[`${prefix}_upper`] = d.upper;
//                                 if (d.lower !== undefined) row[`${prefix}_lower`] = d.lower;
//                             } else if (ind.id === 'GMMA') {
//                                 Object.keys(d).forEach(k => { if (k !== 'time') row[`${prefix}_${k}`] = d[k]; });
//                             } else if (ind.id === 'Ichimoku') {
//                                 row[`${prefix}_conversion`] = d.conversion;
//                                 row[`${prefix}_base`] = d.base;
//                                 row[`${prefix}_spanA`] = d.spanA;
//                                 row[`${prefix}_spanB`] = d.spanB;
//                                 row[`${prefix}_lagging`] = d.lagging;
//                             } else if (ind.id === 'HeikenAshi') {
//                                 row[`${prefix}_open`] = d.open;
//                                 row[`${prefix}_high`] = d.high;
//                                 row[`${prefix}_low`] = d.low;
//                                 row[`${prefix}_close`] = d.close;
//                             } else if (ind.id === 'DMI') {
//                                 row[`${prefix}_pdi`] = d.pdi;
//                                 row[`${prefix}_mdi`] = d.mdi;
//                                 row[`${prefix}_adx`] = d.adx;
//                             } else if (ind.id === 'MACD') {
//                                 row[`${prefix}_MACD`] = d.value;
//                                 row[`${prefix}_signal`] = d.signal;
//                                 row[`${prefix}_hist`] = d.histogram;
//                             } else if (ind.id === 'STOCH' || ind.id === 'StochRSI') {
//                                 row[`${prefix}_k`] = d.k || d.value; // library sometimes uses value for k
//                                 row[`${prefix}_d`] = d.d;
//                             } else {
//                                 // Standard single value or generic fields
//                                 if (d.value !== undefined) row[prefix] = d.value;
//                                 if (d.signal !== undefined && ind.id !== 'MACD') row[`${prefix}_signal`] = d.signal;
//                                 if (d.upper !== undefined && ind.id !== 'BB') row[`${prefix}_upper`] = d.upper;
//                                 if (d.lower !== undefined && ind.id !== 'BB') row[`${prefix}_lower`] = d.lower;
//                             }
//                         }
//                     });
//                 };

//                 // Case A: Indicator has PRESETS (EMA, SMA, RSI, etc.)
//                 if (ind.presets && ind.presets.length > 0) {
//                     ind.presets.forEach(preset => {
//                         let params = { ...ind.defParams };
//                         let label = `${ind.id}_${preset}`;

//                         // Handle parsing logic if preset is string (like '14-3-3')
//                         if (typeof preset === 'string' && preset.includes('-')) {
//                             // Logic matching IndicatorMenu
//                             if (ind.id === 'STOCH') {
//                                 const [p, k, d] = preset.split('-').map(Number);
//                                 params = { ...params, period: p, signalPeriod: k };
//                             } else {
//                                 // Fallback
//                                 params.period = parseInt(preset);
//                             }
//                         } else {
//                             params.period = Number(preset);
//                         }

//                         // Calculate
//                         const data = calculateIndicatorData(ind.id, chartData, params);
//                         addDataToMap(label, data);
//                     });
//                 }
//                 // Case B: No Presets, just default params
//                 else {
//                     const data = calculateIndicatorData(ind.id, chartData, ind.defParams);
//                     addDataToMap(ind.id, data);
//                 }

//             } catch (err) {
//                 console.warn(`Failed to export ${ind.id}`, err);
//             }
//         });

//         // 3. Flatten and Sort
//         const rows = Array.from(indicatorMap.values()).sort((a, b) => a.date.localeCompare(b.date));
//         if (rows.length === 0) return;

//         // 4. Collect Headers Dynamically
//         const allKeys = new Set(['date', 'open', 'high', 'low', 'close', 'volume']);
//         rows.forEach(r => Object.keys(r).forEach(k => allKeys.add(k)));
//         const headers = Array.from(allKeys);

//         // 5. Generate CSV
//         let csv = headers.join(',') + '\n';
//         rows.forEach(row => {
//             const values = headers.map(h => {
//                 const val = row[h];
//                 if (val === undefined || val === null) return '';
//                 if (typeof val === 'number') return val.toFixed(4);
//                 return val;
//             });
//             csv += values.join(',') + '\n';
//         });

//         const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = filename;
//         link.click();
//         URL.revokeObjectURL(link.href);

//     }, []);
//     const formatDate = (date) => date.toISOString().split('T')[0];

//     // Fetch search options once on mount (simple helper — used by search/UIs)
//     useEffect(() => {
//         let mounted = true;
//         const fetchSearchOptions = async () => {
//             try {
//                 const url = `${API_BASE}/equity-insights/search/options`;
//                 const resp = await fetch(url, { method: 'GET' });
//                 const json = await resp.json();
//                 if (!mounted) return;
//                 if (json && json.status === 'success') {
//                     // backend may return { data: { options: [...] } } or direct array
//                     const opts = (json.data && (json.data.options || json.data)) || [];
//                     setSearchOptions(Array.isArray(opts) ? opts : []);
//                 } else {
//                     setSearchOptions([]);
//                 }
//             } catch (err) {
//                 console.error('Failed to fetch search options:', err);
//                 if (mounted) setSearchOptions([]);
//             }
//         };
//         fetchSearchOptions();
//         return () => { mounted = false; };
//     }, []);

//     // Fetch Data
//     const fetchData = useCallback(async (start, end, isInitial = false) => {
//         if (!company?.fincode || isLoading || (isFullyLoaded && !isInitial)) return;
//         setIsLoading(true);

//         try {
//             // Updated to GET + query params
//             const url = new URL(`${API_BASE}/equity-insights/price-action-history/${company.fincode}`);
//             if (start) url.searchParams.append("start_date", start);
//             if (end) url.searchParams.append("end_date", end);

//             const response = await fetch(url.toString(), { method: 'GET' });
//             const raw = await response.text();
//             let result = null;
//             try {
//                 result = raw ? JSON.parse(raw) : null;
//             } catch (parseErr) {
//                 console.error('Invalid JSON received from price-action-history (raw response):', raw);
//                 throw parseErr;
//             }

//             if (result && result.status === 'success' && result.data) {
//                 const newPriceData = result.data.price_data || {};

//                 if (isInitial) {
//                     setPriceData(newPriceData);
//                 }

//                 const transformedData = [];
//                 if (newPriceData.Date) {
//                     for (let i = 0; i < newPriceData.Date.length; i++) {
//                         transformedData.push({
//                             time: newPriceData.Date[i],
//                             open: newPriceData.Open[i],
//                             high: newPriceData.High[i],
//                             low: newPriceData.Low[i],
//                             close: newPriceData.Close[i],
//                             volume: newPriceData.TotalTradedQty ? newPriceData.TotalTradedQty[i] : 0,
//                         });
//                     }
//                 }

//                 const uniqueTransformedData = [];
//                 const seenDates = new Set();
//                 for (const item of transformedData) {
//                     if (!seenDates.has(item.time)) {
//                         seenDates.add(item.time);
//                         uniqueTransformedData.push(item);
//                     }
//                 }
//                 uniqueTransformedData.sort((a, b) => (a.time > b.time ? 1 : -1));

//                 if (isInitial) {
//                     setData(uniqueTransformedData);
//                     setOldestAvailableDate(result.data.oldest_available_date);
//                     if (uniqueTransformedData.length > 0) setStartDate(uniqueTransformedData[0].time);

//                     // Auto-export indicator CSV for the symbol (use fincode as filename)
//                     if (uniqueTransformedData.length > 0 && company?.fincode) {
//                         const filename = `${company.fincode}_indicator.csv`;
//                         setTimeout(() => exportIndicatorCSV(uniqueTransformedData, filename), 500);
//                     }
//                 } else {
//                     setData(prev => {
//                         const combined = [...uniqueTransformedData, ...prev];
//                         const uniqueMap = new Map();
//                         combined.forEach(item => uniqueMap.set(item.time, item));
//                         const unique = Array.from(uniqueMap.values());
//                         unique.sort((a, b) => (a.time > b.time ? 1 : -1));
//                         return unique;
//                     });
//                     if (uniqueTransformedData.length > 0) setStartDate(uniqueTransformedData[0].time);
//                 }

//                 if (result.data.oldest_available_date && uniqueTransformedData.length > 0) {
//                     if (new Date(uniqueTransformedData[0].time) <= new Date(result.data.oldest_available_date)) {
//                         setIsFullyLoaded(true);
//                     }
//                 } else if (uniqueTransformedData.length === 0) {
//                     setIsFullyLoaded(true);
//                 }
//             } else {
//                 if (isInitial) {
//                     setData([]);
//                     setPriceData({ Date: [], Open: [], High: [], Low: [], Close: [] });
//                     setIsFullyLoaded(true);
//                 }
//             }
//         } catch (error) {
//             console.error("Failed to fetch price action:", error);
//             setIsFullyLoaded(true);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [company?.fincode, isLoading, isFullyLoaded]);

//     // Initial Load - MOCK PATTERNS FOR DEMO
//     useEffect(() => {
//         if (!company?.fincode) {
//             setData([]);
//             setPatterns([]);
//             if (seriesRef.current) seriesRef.current.setData([]);
//             return;
//         }
//         setData([]);
//         setPatterns([]); // Reset patterns
//         setDrawings([]); // Reset drawings
//         setActiveTool(null); // Reset annotation tool
//         setOldestAvailableDate(null);
//         setIsFullyLoaded(false);
//         setStartDate(null);
//         setActiveIndicators([]);
//         isFitRef.current = false;

//         if (seriesRef.current) seriesRef.current.setData([]);
//         Object.values(indicatorSeriesRef.current).forEach(s => {
//             if (Array.isArray(s)) s.forEach(sub => chartRef.current?.removeSeries(sub));
//             else chartRef.current?.removeSeries(s);
//         });
//         indicatorSeriesRef.current = {};

//         const today = new Date();
//         const oneYearAgo = new Date();
//         oneYearAgo.setFullYear(today.getFullYear() - 1);
//         fetchData(formatDate(oneYearAgo), formatDate(today), true);
//     }, [company?.fincode]);

//     // Fetch patterns from backend ONLY when PatternMenu opens
//     const [patternsFetched, setPatternsFetched] = useState(false);

//     useEffect(() => {
//         // Only fetch when menu opens and we haven't fetched yet for this company
//         if (!isPatternMenuOpen || !company?.fincode || patternsFetched) {
//             return;
//         }

//         const fetchPatterns = async () => {
//             try {
//                 // Updated to GET + correct endpoint
//                 const url = new URL(`${API_BASE}/equity-insights/micro-patterns/${company.fincode}`);
//                 // if (lookUpDays) url.searchParams.append("lookUp_days", lookUpDays); // Example if needed

//                 const response = await fetch(url.toString(), { method: 'GET' });
//                 const raw = await response.text();
//                 let result = null;
//                 try {
//                     result = raw ? JSON.parse(raw) : null;
//                 } catch (parseErr) {
//                     console.error('Invalid JSON received from micro-patterns endpoint (raw response):', raw);
//                     throw parseErr;
//                 }

//                 if (result && result.status === 'success' && result.data) {
//                     const patternData = result.data;
//                     const transformedPatterns = [];

//                     // Transform colwise_dict format to array of pattern objects
//                     if (patternData.Pattern_ID && patternData.Pattern_ID.length > 0) {
//                         for (let i = 0; i < patternData.Pattern_ID.length; i++) {
//                             // Use endDate or startDate as the pattern date for chart display
//                             const patternDate = patternData.endDate?.[i] || patternData.startDate?.[i];
//                             if (patternDate) {
//                                 transformedPatterns.push({
//                                     patternId: patternData.Pattern_ID[i],
//                                     date: patternDate.split('T')[0], // Format as YYYY-MM-DD
//                                     score: patternData.final_confidence?.[i] || 0
//                                 });
//                             }
//                         }
//                     }
//                     setPatterns(transformedPatterns);
//                 } else {
//                     setPatterns([]);
//                 }
//                 setPatternsFetched(true);
//             } catch (error) {
//                 console.error("Failed to fetch patterns:", error);
//                 setPatterns([]);
//             }
//         };

//         fetchPatterns();
//     }, [isPatternMenuOpen, company?.fincode, patternsFetched]);

//     // Reset patternsFetched when company changes
//     useEffect(() => {
//         setPatternsFetched(false);
//         setPatterns([]);
//     }, [company?.fincode]);

//     // --- CHART & OVERLAY REFACTOR ---
//     // Use refs for data/patterns to access latest values in event handlers without re-subscribing
//     const dataRef = useRef(data);
//     const patternsRef = useRef(patterns);
//     const activePatternIdsRef = useRef(activePatternIds);

//     useEffect(() => {
//         dataRef.current = data;
//         patternsRef.current = patterns;
//         activePatternIdsRef.current = activePatternIds;
//     }, [data, patterns, activePatternIds]);

//     // Robust Highlights Drawing Function (Stable Reference)
//     const drawHighlights = useCallback(() => {
//         const chart = chartRef.current;
//         const series = seriesRef.current;
//         const canvas = canvasRef.current;
//         const container = chartContainerRef.current;

//         if (!chart || !series || !canvas || !container) return;

//         // Handle retina displays
//         const dpr = window.devicePixelRatio || 1;
//         const height = container.clientHeight;
//         canvas.width = container.clientWidth * dpr;
//         canvas.height = height * dpr;
//         const ctx = canvas.getContext('2d');
//         ctx.scale(dpr, dpr);
//         ctx.clearRect(0, 0, container.clientWidth, height);

//         const timeScale = chart.timeScale();
//         const barSpacing = timeScale.options().barSpacing;
//         const PADDING = 4;
//         const BORDER_RADIUS = 4;

//         // Get price scale widths for clipping
//         const leftPriceScaleWidth = chart.priceScale('left').width();
//         const rightPriceScaleWidth = chart.priceScale('right').width();
//         const chartAreaLeft = leftPriceScaleWidth;
//         const chartAreaRight = container.clientWidth - rightPriceScaleWidth;
//         const chartAreaWidth = chartAreaRight - chartAreaLeft;

//         // Clip to chart area only (excludes Y-axis scales)
//         ctx.save();
//         ctx.beginPath();
//         ctx.rect(chartAreaLeft, 0, chartAreaWidth, height);
//         ctx.clip();

//         // Use Refs for latest data
//         const currentPatterns = patternsRef.current;
//         const currentData = dataRef.current;
//         const currentActiveIds = activePatternIdsRef.current;

//         currentPatterns.forEach(p => {
//             if (!currentActiveIds.includes(p.patternId)) return;

//             const meta = PatternRegistry.getPattern(p.patternId);
//             const bias = meta.bias || 'neutral';
//             const colorMap = {
//                 bullish: { fill: 'rgba(16, 185, 129, 0.2)', stroke: '#10b981' },
//                 bearish: { fill: 'rgba(239, 68, 68, 0.2)', stroke: '#ef4444' },
//                 neutral: { fill: 'rgba(139, 92, 246, 0.2)', stroke: '#8b5cf6' }
//             };
//             const style = colorMap[bias] || colorMap.neutral;

//             const xCoord = timeScale.timeToCoordinate(p.date);
//             if (xCoord === null) return;
//             const x = Math.round(xCoord + leftPriceScaleWidth);

//             const candleIndex = currentData.findIndex(d => d.time === p.date);
//             if (candleIndex === -1) return;
//             const candle = currentData[candleIndex];

//             const highY = Math.round(series.priceToCoordinate(candle.high));
//             const lowY = Math.round(series.priceToCoordinate(candle.low));

//             if (highY === null || lowY === null) return;

//             // Use 80% of bar spacing for candle width (matches chart's candle rendering)
//             const candleWidth = Math.max(3, Math.round(barSpacing * 0.8));
//             const rectX = x - (candleWidth / 2) - PADDING;
//             const rectY = highY - PADDING;
//             const rectW = candleWidth + (PADDING * 2);
//             const rectH = (lowY - highY) + (PADDING * 2);

//             ctx.fillStyle = style.fill;
//             ctx.strokeStyle = style.stroke;
//             ctx.lineWidth = 1;

//             ctx.beginPath();
//             ctx.roundRect(rectX, rectY, rectW, rectH, BORDER_RADIUS);
//             ctx.fill();
//             ctx.stroke();

//             // Label
//             const labelText = meta.shortName || "PAT";
//             const badgeY = rectY - 18;

//             ctx.fillStyle = style.stroke;
//             ctx.font = 'bold 10px sans-serif';
//             const textMetrics = ctx.measureText(labelText);
//             const badgeW = textMetrics.width + 8;
//             const badgeX = x - (badgeW / 2);

//             ctx.beginPath();
//             ctx.roundRect(badgeX, badgeY, badgeW, 14, 2);
//             ctx.fill();

//             ctx.fillStyle = '#ffffff';
//             ctx.textAlign = 'center';
//             ctx.textBaseline = 'middle';
//             ctx.fillText(labelText, x, badgeY + 7);
//         });

//         // Restore canvas state (remove clipping)
//         ctx.restore();
//     }, []); // Empty dependency mainly because we use refs

//     // Initialize Chart (Once per company)
//     useEffect(() => {
//         if (!chartContainerRef.current) return;

//         const container = chartContainerRef.current;
//         container.innerHTML = '';

//         const chart = createChart(container, {
//             width: container.clientWidth,
//             height: 500,
//             layout: {
//                 background: { type: ColorType.Solid, color: '#ffffff' },
//                 textColor: '#334155',
//                 fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//                 attributionLogo: false
//             },
//             grid: {
//                 vertLines: { color: '#f1f5f9' },
//                 horzLines: { color: '#f1f5f9' }
//             },
//             rightPriceScale: {
//                 borderColor: '#e2e8f0',
//                 scaleMargins: { top: 0.1, bottom: 0.1 }
//             },
//             leftPriceScale: {
//                 visible: true,
//                 borderColor: '#e2e8f0',
//             },
//             timeScale: {
//                 borderColor: '#e2e8f0',
//                 timeVisible: true,
//                 secondsVisible: false,
//                 tickMarkFormatter: (time) => {
//                     const date = new Date(time);
//                     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//                 }
//             },
//             crosshair: {
//                 mode: CrosshairMode.Magnet,
//                 vertLine: { color: '#64748b', width: 1, style: 2 },
//                 horzLine: { color: '#64748b', width: 1, style: 2 }
//             },
//             handleScroll: { mouseWheel: true, pressedMouseMove: true },
//             handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
//         });

//         chartRef.current = chart;

//         if (typeof chart.addCandlestickSeries !== 'function') {
//             console.error('lightweight-charts createChart returned object without addCandlestickSeries. Chart object:', chart);
//             // Prevent further errors by aborting initialization
//             setChartReady(false);
//             return;
//         }

//         const candlestickSeries = chart.addCandlestickSeries({
//             upColor: '#10b981',
//             downColor: '#ef4444',
//             borderVisible: false,
//             wickUpColor: '#10b981',
//             wickDownColor: '#ef4444',
//             priceFormat: { type: 'price', precision: 2, minMove: 0.01 }
//         });
//         seriesRef.current = candlestickSeries;

//         // --- OVERLAY CANVAS SETUP ---
//         const canvas = document.createElement('canvas');
//         canvas.style.position = 'absolute';
//         canvas.style.top = '0';
//         canvas.style.left = '0';
//         canvas.style.width = '100%';
//         canvas.style.height = '100%';
//         canvas.style.pointerEvents = 'none';
//         canvas.style.zIndex = '10';
//         container.appendChild(canvas);
//         canvasRef.current = canvas;

//         setChartReady(true);

//         // Sync Handlers
//         const handleTimeScaleChange = () => requestAnimationFrame(drawHighlights);
//         chart.timeScale().subscribeVisibleLogicalRangeChange(handleTimeScaleChange);

//         const resizeObserver = new ResizeObserver(entries => {
//             if (entries.length === 0 || !entries[0].contentRect) return;
//             const newRect = entries[0].contentRect;
//             chart.applyOptions({ width: newRect.width, height: newRect.height });
//             // Defer drawing to ensure chart has updated its internal layout/scales
//             requestAnimationFrame(drawHighlights);
//         });
//         resizeObserver.observe(container);

//         chart.subscribeCrosshairMove(param => {
//             if (param.time) {
//                 const candleData = param.seriesData.get(candlestickSeries);
//                 if (candleData) setCurrentOHLC(candleData);
//             } else {
//                 // Safe access via Ref or state if available
//                 const currentData = dataRef.current;
//                 if (currentData && currentData.length > 0) {
//                     setCurrentOHLC(currentData[currentData.length - 1]);
//                 }
//             }
//         });

//         if (!isFitRef.current) {
//             chart.timeScale().fitContent();
//             isFitRef.current = true;
//         }

//         return () => {
//             resizeObserver.disconnect();
//             chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleTimeScaleChange);
//             chart.remove();
//             setChartReady(false);
//             if (canvas) canvas.remove();
//         };
//     }, [company?.fincode]);

//     // Update Data efficiently without destroying chart
//     useEffect(() => {
//         if (seriesRef.current && data.length > 0) {
//             seriesRef.current.setData(data);
//             drawHighlights();
//         }
//     }, [data, drawHighlights]);

//     // Redraw highlights when patterns/selection change
//     useEffect(() => {
//         requestAnimationFrame(drawHighlights);
//     }, [activePatternIds, patterns, drawHighlights]);

//     // Manage Indicators Rendering
//     useEffect(() => {
//         if (!chartRef.current || data.length === 0 || !chartReady) return;

//         try {
//             const currentIds = new Set(activeIndicators.map(i => i.uuid));

//             // Remove unselected series
//             Object.keys(indicatorSeriesRef.current).forEach(uuid => {
//                 if (!currentIds.has(uuid)) {
//                     const s = indicatorSeriesRef.current[uuid];
//                     if (Array.isArray(s)) s.forEach(sub => chartRef.current.removeSeries(sub));
//                     else chartRef.current.removeSeries(s);
//                     delete indicatorSeriesRef.current[uuid];
//                 }
//             });

//             // Add/Update selected
//             activeIndicators.forEach(ind => {
//                 try {
//                     const calculatedData = calculateIndicatorData(ind.id, data, ind.params || ind.defParams);
//                     if (!calculatedData || calculatedData.length === 0) return;

//                     // Init series if not exists
//                     if (!indicatorSeriesRef.current[ind.uuid]) {

//                         // --- Helper to add simple line ---
//                         const addLine = (title, color, lineWidth = 1, priceScaleId = 'right') =>
//                             chartRef.current.addLineSeries({ title, color, lineWidth, priceScaleId, crosshairMarkerVisible: false });

//                         // --- BB ---
//                         if (ind.id === 'BB') {
//                             indicatorSeriesRef.current[ind.uuid] = [
//                                 addLine('BB Upper', ind.color, 1),
//                                 addLine('BB Lower', ind.color, 1) // No fill (area) requested, just lines
//                             ];
//                         }
//                         // --- MACD ---
//                         else if (ind.id === 'MACD') {
//                             const macd = addLine('MACD', ind.color, 2, 'left');
//                             const signal = addLine('Signal', '#FF5252', 1, 'left');
//                             const hist = chartRef.current.addHistogramSeries({
//                                 title: 'Hist', priceScaleId: 'left', color: '#26a69a'
//                             });
//                             indicatorSeriesRef.current[ind.uuid] = [macd, signal, hist];
//                         }
//                         // --- GMMA (Guppy) ---
//                         else if (ind.id === 'GMMA') {
//                             // 6 Short (Blue/Cyan), 6 Long (Red/Orange)
//                             const seriesArr = [];
//                             // Shorts
//                             const shortPeriods = ind.params?.shortPeriods || ind.defParams.shortPeriods;
//                             shortPeriods.forEach((p, i) => seriesArr.push(addLine(`GMMA Short ${p}`, '#00bcd4', 1)));
//                             // Longs
//                             const longPeriods = ind.params?.longPeriods || ind.defParams.longPeriods;
//                             longPeriods.forEach((p, i) => seriesArr.push(addLine(`GMMA Long ${p}`, '#ff5722', 1)));

//                             indicatorSeriesRef.current[ind.uuid] = seriesArr;
//                         }
//                         // --- Ichimoku ---
//                         else if (ind.id === 'Ichimoku') {
//                             indicatorSeriesRef.current[ind.uuid] = [
//                                 addLine('Tenkan', '#0496FF', 1),   // Conversion
//                                 addLine('Kijun', '#99154E', 1),    // Base
//                                 addLine('Span A', '#4CAF50', 1),
//                                 addLine('Span B', '#F44336', 1),
//                                 addLine('Lagging', '#808080', 1)
//                             ];
//                         }
//                         // --- Heiken Ashi ---
//                         else if (ind.id === 'HeikenAshi') {
//                             // Overlay candles
//                             const haSeries = chartRef.current.addCandlestickSeries({
//                                 upColor: ind.color, downColor: '#000000', borderVisible: false,
//                                 wickUpColor: ind.color, wickDownColor: '#000000'
//                             });
//                             indicatorSeriesRef.current[ind.uuid] = haSeries;
//                         }
//                         // --- DMI ---
//                         else if (ind.id === 'DMI') {
//                             // 3 lines: PDI, MDI, ADX
//                             indicatorSeriesRef.current[ind.uuid] = [
//                                 addLine('+DI', '#4CAF50', 1, 'left'),
//                                 addLine('-DI', '#F44336', 1, 'left'),
//                                 addLine('ADX', '#FF9800', 1, 'left')
//                             ];
//                         }
//                         // --- Volume Oscillator ---
//                         else if (ind.id === 'VolOsc') {
//                             indicatorSeriesRef.current[ind.uuid] = addLine('Vol Osc', ind.color, 1, 'left');
//                         }
//                         // --- Generic Line Series ---
//                         else {
//                             const OVERLAY_IDS = new Set(['SMA', 'EMA', 'WMA', 'WEMA', 'BB', 'DC', 'KC', 'PSAR', 'SuperTrend', 'HMA', 'TEMA', 'VWAP']);
//                             const isOverlay = OVERLAY_IDS.has(ind.id);
//                             indicatorSeriesRef.current[ind.uuid] = addLine(ind.name, ind.color, 2, isOverlay ? 'right' : 'left');
//                         }
//                     }

//                     // Set Data
//                     const series = indicatorSeriesRef.current[ind.uuid];

//                     if (ind.id === 'BB') {
//                         series[0].setData(calculatedData.map(d => ({ time: d.time, value: d.value }))); // Upper (value is upper in calc map)
//                         series[1].setData(calculatedData.map(d => ({ time: d.time, value: d.lower })));
//                     }
//                     else if (ind.id === 'MACD') {
//                         series[0].setData(calculatedData.map(d => ({ time: d.time, value: d.value })));
//                         series[1].setData(calculatedData.map(d => ({ time: d.time, value: d.signal })));
//                         series[2].setData(calculatedData.map(d => ({
//                             time: d.time, value: d.histogram,
//                             color: d.histogram >= 0 ? '#26a69a' : '#ef5350'
//                         }))); // Hist
//                     }
//                     else if (ind.id === 'GMMA') {
//                         const shortPeriods = ind.params?.shortPeriods || ind.defParams.shortPeriods;
//                         const longPeriods = ind.params?.longPeriods || ind.defParams.longPeriods;
//                         // calculatedData[i] has properties short3, short5... long30...
//                         // series array order matches logic above: [short1...shortN, long1...longN]
//                         let sIdx = 0;
//                         shortPeriods.forEach(p => {
//                             series[sIdx++].setData(calculatedData.map(d => ({ time: d.time, value: d[`short${p}`] })));
//                         });
//                         longPeriods.forEach(p => {
//                             series[sIdx++].setData(calculatedData.map(d => ({ time: d.time, value: d[`long${p}`] })));
//                         });
//                     }
//                     else if (ind.id === 'Ichimoku') {
//                         // [conv, base, spanA, spanB, lagging]
//                         series[0].setData(calculatedData.map(d => ({ time: d.time, value: d.conversion })));
//                         series[1].setData(calculatedData.map(d => ({ time: d.time, value: d.base })));
//                         series[2].setData(calculatedData.map(d => ({ time: d.time, value: d.spanA })));
//                         series[3].setData(calculatedData.map(d => ({ time: d.time, value: d.spanB })));
//                         series[4].setData(calculatedData.map(d => ({ time: d.time, value: d.lagging })));
//                     }
//                     else if (ind.id === 'HeikenAshi') {
//                         series.setData(calculatedData); // Already { time, open, high, low, close }
//                     }
//                     else if (ind.id === 'DMI') {
//                         series[0].setData(calculatedData.map(d => ({ time: d.time, value: d.pdi })));
//                         series[1].setData(calculatedData.map(d => ({ time: d.time, value: d.mdi })));
//                         series[2].setData(calculatedData.map(d => ({ time: d.time, value: d.adx })));
//                     }
//                     else if (ind.id === 'StochRSI' || ind.id === 'STOCH') {
//                         // Create 2 lines if we want K and D? Current logic supports 1 line generic?
//                         // Wait, Stoch returns k and d.
//                         // I need to add support for 2 lines for Stoch in creation above?
//                         // My generic creation makes ONE line.
//                         // Let's rely on generic for 'value' (k) for now or update generic?
//                         // If generic, it uses d.value. Stoch returns value=k.
//                         series.setData(calculatedData);
//                     }
//                     else {
//                         series.setData(calculatedData);
//                     }

//                 } catch (indErr) {
//                     console.error(`Error updating indicator ${ind.name}:`, indErr);
//                 }
//             });
//         } catch (err) {
//             console.error("Error in indicator management:", err);
//         }
//     }, [activeIndicators, data, chartReady]);

//     // Infinite Scroll
//     const stateRef = useRef({ startDate, isLoading, isFullyLoaded, oldestAvailableDate });
//     useEffect(() => {
//         stateRef.current = { startDate, isLoading, isFullyLoaded, oldestAvailableDate };
//     }, [startDate, isLoading, isFullyLoaded, oldestAvailableDate]);

//     useEffect(() => {
//         if (!chartRef.current) return;
//         const chart = chartRef.current;
//         const onVisibleLogicalRangeChanged = (newVisibleLogicalRange) => {
//             if (newVisibleLogicalRange === null) return;
//             const { startDate, isLoading, isFullyLoaded } = stateRef.current;
//             if (newVisibleLogicalRange.from < 10 && !isLoading && !isFullyLoaded && startDate) {
//                 const currentStart = new Date(startDate);
//                 const newEnd = new Date(currentStart);
//                 newEnd.setDate(newEnd.getDate() - 1);
//                 const newStart = new Date(newEnd);
//                 newStart.setMonth(newStart.getMonth() - 12);
//                 fetchData(formatDate(newStart), formatDate(newEnd), false);
//             }
//         };
//         chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
//         return () => {
//             chart.timeScale().unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
//         };
//     }, [fetchData]);

//     const handleApplyIndicators = (newIndicators) => {
//         setActiveIndicators(newIndicators);
//         setIsMenuOpen(false);
//     };

//     const handleApplyPatterns = (newPatternIds) => {
//         setActivePatternIds(newPatternIds);
//         setIsPatternMenuOpen(false);
//     };

//     const OHLCItem = ({ label, value, color = "text-slate-700" }) => (
//         <div className="flex flex-col items-center">
//             <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
//             <span className={`text-sm font-bold ${color}`}>{value}</span>
//         </div>
//     );

//     return (
//         <div className={`bg-white shadow-lg border border-slate-200 overflow-hidden flex flex-col ${isFullScreen ? 'fixed inset-0 z-50 w-full h-full m-0 rounded-none' : 'rounded-2xl relative'}`}>
//             {/* Chart Header */}
//             <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-6">
//                         <div className="flex items-center gap-4">
//                             <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
//                                 <BarChart3 className="w-6 h-6 text-slate-700" />
//                             </div>
//                             <div>
//                                 <h3 className="text-xl font-bold text-slate-800">
//                                     {company?.symbol || 'Select Company'}
//                                 </h3>
//                                 <p className="text-slate-600 text-sm font-medium">
//                                     {company?.companyName || 'Please select a company'}
//                                 </p>
//                             </div>
//                         </div>

//                         {currentOHLC && (
//                             <div className="flex items-center gap-6 bg-white rounded-lg px-4 py-3 border border-slate-200 shadow-sm">
//                                 <OHLCItem label="Open" value={currentOHLC.open?.toFixed(2) || '—'} />
//                                 <div className="h-8 w-px bg-slate-300"></div>
//                                 <OHLCItem label="High" value={currentOHLC.high?.toFixed(2) || '—'} color="text-green-600" />
//                                 <div className="h-8 w-px bg-slate-300"></div>
//                                 <OHLCItem label="Low" value={currentOHLC.low?.toFixed(2) || '—'} color="text-red-600" />
//                                 <div className="h-8 w-px bg-slate-300"></div>
//                                 <OHLCItem
//                                     label="Close"
//                                     value={currentOHLC.close?.toFixed(2) || '—'}
//                                     color={currentOHLC.close >= currentOHLC.open ? "text-green-600" : "text-red-600"}
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-3">
//                         {data.length > 0 && (
//                             <>
//                                 <button
//                                     onClick={() => setIsAnnotationMenuOpen(true)}
//                                     className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium shadow-sm ${activeTool
//                                         ? 'bg-teal-50 text-teal-700 border-teal-200'
//                                         : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
//                                         }`}
//                                 >
//                                     <PenTool className="w-4 h-4" />
//                                     <span>Drawing</span>
//                                     {drawings.length > 0 && (
//                                         <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
//                                             {drawings.length}
//                                         </span>
//                                     )}
//                                     <ChevronDown className="w-4 h-4" />
//                                 </button>

//                                 <button
//                                     onClick={() => setIsMenuOpen(true)}
//                                     className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all text-sm font-medium shadow-sm"
//                                 >
//                                     <Layers className="w-4 h-4" />
//                                     <span>Indicators</span>
//                                     {activeIndicators.length > 0 && (
//                                         <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
//                                             {activeIndicators.length}
//                                         </span>
//                                     )}
//                                     <ChevronDown className="w-4 h-4" />
//                                 </button>

//                                 <button
//                                     onClick={() => setIsPatternMenuOpen(true)}
//                                     className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all text-sm font-medium shadow-sm"
//                                 >
//                                     <CandlestickChart className="w-4 h-4" />
//                                     <span>Patterns</span>
//                                     {activePatternIds.length > 0 && (
//                                         <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
//                                             {activePatternIds.length}
//                                         </span>
//                                     )}
//                                     <ChevronDown className="w-4 h-4" />
//                                 </button>
//                             </>
//                         )}

//                         <div className="h-6 w-px bg-slate-200 mx-1"></div>

//                         <button
//                             onClick={() => setIsFullScreen(!isFullScreen)}
//                             className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
//                             title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
//                         >
//                             {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Chart Container */}
//             <div className={`p-6 ${isFullScreen ? 'flex-1 p-0' : ''}`}>
//                 <div className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-white" style={{ height: isFullScreen ? '100%' : '500px', border: isFullScreen ? 'none' : undefined, borderRadius: isFullScreen ? '0' : undefined }}>
//                     {!isLoading && isFullyLoaded && data.length === 0 && company && (
//                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
//                             <div className="p-4 rounded-full bg-gray-100 mb-4">
//                                 <AlertCircle className="w-8 h-8 text-gray-400" />
//                             </div>
//                             <h3 className="text-lg font-semibold text-gray-900">No Price Data Available</h3>
//                             <p className="text-sm text-gray-500 mt-1">We couldn't find any trading history for this symbol.</p>
//                         </div>
//                     )}

//                     {/* Loading Overlay */}
//                     {isLoading && (
//                         data.length === 0 ? (
//                             // Initial Load: Centered with backdrop
//                             <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
//                                 <CandleLoader />
//                             </div>
//                         ) : (
//                             // Subsequent Load: Small icon top-left (inside grid, clearing left axis)
//                             <div className="absolute top-6 left-20 z-50 transform scale-[0.4] origin-top-left pointer-events-none">
//                                 <CandleLoader />
//                             </div>
//                         )
//                     )}

//                     {/* Active Drawing Tool Indicator */}
//                     {data.length > 0 && (activeTool || drawings.length > 0) && (
//                         <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2">
//                             {activeTool ? (
//                                 <>
//                                     <PenTool className="w-4 h-4 text-teal-600" />
//                                     <span className="text-xs font-medium text-slate-700 capitalize">{activeTool.replace(/([A-Z])/g, ' $1').trim()}</span>
//                                     <button
//                                         onClick={() => setActiveTool(null)}
//                                         className="p-1 hover:bg-slate-100 rounded transition-colors"
//                                         title="Exit drawing mode"
//                                     >
//                                         <X className="w-3 h-3 text-slate-500" />
//                                     </button>
//                                 </>
//                             ) : (
//                                 <span className="text-xs text-slate-500">{drawings.length} drawing{drawings.length !== 1 ? 's' : ''}</span>
//                             )}
//                             {drawings.length > 0 && (
//                                 <>
//                                     <div className="w-px h-4 bg-slate-200" />
//                                     <button
//                                         onClick={() => setActiveTool('eraser')}
//                                         className={`p-1 rounded transition-colors ${activeTool === 'eraser' ? 'bg-red-100 text-red-600' : 'hover:bg-slate-100 text-slate-500'}`}
//                                         title="Eraser"
//                                     >
//                                         <Eraser className="w-3.5 h-3.5" />
//                                     </button>
//                                     <button
//                                         onClick={() => setDrawings([])}
//                                         className="text-xs text-red-500 hover:text-red-600 font-medium"
//                                     >
//                                         Clear
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     )}

//                     <div ref={chartContainerRef} className="w-full h-full" />

//                     {/* Chart Annotations Layer */}
//                     {chartReady && data.length > 0 && (
//                         <ChartAnnotations
//                             chart={chartRef.current}
//                             series={seriesRef.current}
//                             data={data}
//                             activeTool={activeTool}
//                             onDrawingComplete={() => { }}
//                             drawings={drawings}
//                             setDrawings={setDrawings}
//                         />
//                     )}
//                 </div>
//             </div>

//             {/* Active Indicators Legend */}
//             {activeIndicators.length > 0 && (
//                 <div className="absolute top-[140px] left-10 flex flex-col gap-1 pointer-events-none z-50">
//                     {activeIndicators.map(ind => (
//                         <div key={ind.uuid} className="flex items-center gap-2 text-xs font-medium bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm border border-gray-200 pointer-events-auto w-fit">
//                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ind.color }} />
//                             <span className="text-gray-700">{ind.name}</span>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <IndicatorMenu
//                 isOpen={isMenuOpen}
//                 onClose={() => setIsMenuOpen(false)}
//                 activeIndicators={activeIndicators}
//                 onApply={handleApplyIndicators}
//             />

//             <PatternMenu
//                 isOpen={isPatternMenuOpen}
//                 onClose={() => setIsPatternMenuOpen(false)}
//                 activePatterns={activePatternIds}
//                 onApply={handleApplyPatterns}
//             />

//             <AnnotationMenu
//                 isOpen={isAnnotationMenuOpen}
//                 onClose={() => setIsAnnotationMenuOpen(false)}
//                 activeTool={activeTool}
//                 onSelectTool={setActiveTool}
//             />
//         </div>
//     );
// }

// export default ResearchChart;
// --------------------------------------------

// import { useEffect, useRef, useState, useCallback } from 'react';
// // import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
// import {
//   createChart,
//   ColorType,
//   CrosshairMode,
//   CandlestickSeries,
//   LineSeries,
//   HistogramSeries,
// } from 'lightweight-charts';

// // import IndicatorMenu, { AVAILABLE_INDICATORS } from './IndicatorMenu';
// // import PatternMenu from './PatternMenu';
// // import AnnotationMenu from './AnnotationMenu';
// // import ChartAnnotations from './ChartAnnotations';
// import { BarChart3, Layers, ChevronDown, AlertCircle, CandlestickChart, PenTool, Eraser, MousePointer, X, Maximize2, Minimize2 } from 'lucide-react';
// import { calculateIndicatorData } from './IndicatorCalculations';
// import { PatternRegistry } from './Data/PatternRegistry';
// import CandleLoader from './CandleLoader';
// // import config from '../config';
// import PatternMenu from './PatternMenu';
// import IndicatorMenu , { AVAILABLE_INDICATORS } from './IndicatorMenu';
// import AnnotationMenu from './AnnotationMenu';
// import ChartAnnotations from './ChartAnnotations';

// function ResearchChart({ company }) {
//     console.debug('ResearchChart company prop:', company);
//     // Base URL for backend API (adjust via env var or fallback)
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     // Search options from backend (GET /api/equity-insights/search/options)
//     const [searchOptions, setSearchOptions] = useState([]);
//     const chartContainerRef = useRef(null);
//     const chartRef = useRef(null);
//     const seriesRef = useRef(null);
//     const canvasRef = useRef(null);
//     const indicatorSeriesRef = useRef({});
//     const isFitRef = useRef(false);

//     // Data State
//     const [data, setData] = useState([]);
//     const [priceData, setPriceData] = useState({ Date: [], Open: [], High: [], Low: [], Close: [] });
//     const [oldestAvailableDate, setOldestAvailableDate] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isFullyLoaded, setIsFullyLoaded] = useState(false);
//     const [startDate, setStartDate] = useState(null);
//     const [chartReady, setChartReady] = useState(false);
//     const [patterns, setPatterns] = useState([]); // Pattern state
//     const [year, month, day] = newPriceData.Date[i].split('-').map(Number);
//     const [y, m, d] = p.date.split('-').map(Number);
// const bd = { year: y, month: m, day: d };

//     const [currentOHLC, setCurrentOHLC] = useState(null);

//     // Indicators State
//     const [activeIndicators, setActiveIndicators] = useState([]);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     // Patterns State
//     const [activePatternIds, setActivePatternIds] = useState([]);
//     const [isPatternMenuOpen, setIsPatternMenuOpen] = useState(false);

//     // Annotation State
//     const [activeTool, setActiveTool] = useState(null);
//     const [drawings, setDrawings] = useState([]);
//     const [isAnnotationMenuOpen, setIsAnnotationMenuOpen] = useState(false);

//     // Full Screen State
//     const [isFullScreen, setIsFullScreen] = useState(false);

//     // Toggle body scroll when in full screen
//     useEffect(() => {
//         if (isFullScreen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = '';
//         }
//         return () => {
//             document.body.style.overflow = '';
//         };
//     }, [isFullScreen]);

//     // Export ALL available indicators to CSV (User requirement: "download all the indicator data")
//     const exportIndicatorCSV = useCallback((chartData, filename) => {
//         if (!chartData || chartData.length === 0) return;

//         console.log(`Calculating indicators for ${filename}...`);

//         const indicatorMap = new Map();

//         // 1. Initialize with OHLCV
//         chartData.forEach(d => {
//             indicatorMap.set(d.time, { date: d.time, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume || 0 });
//         });

//         // 2. Iterate ALL Available Indicators
//         AVAILABLE_INDICATORS.forEach(ind => {
//             try {
//                 // Helper to add data to map
//                 const addDataToMap = (prefix, dataObj) => {
//                     if (!dataObj) return;
//                     dataObj.forEach(d => {
//                         if (indicatorMap.has(d.time)) {
//                             const row = indicatorMap.get(d.time);

//                             // Specific Field Handling
//                             if (ind.id === 'BB') {
//                                 // Only Upper/Lower
//                                 if (d.upper !== undefined) row[`${prefix}_upper`] = d.upper;
//                                 if (d.lower !== undefined) row[`${prefix}_lower`] = d.lower;
//                             } else if (ind.id === 'GMMA') {
//                                 Object.keys(d).forEach(k => { if (k !== 'time') row[`${prefix}_${k}`] = d[k]; });
//                             } else if (ind.id === 'Ichimoku') {
//                                 row[`${prefix}_conversion`] = d.conversion;
//                                 row[`${prefix}_base`] = d.base;
//                                 row[`${prefix}_spanA`] = d.spanA;
//                                 row[`${prefix}_spanB`] = d.spanB;
//                                 row[`${prefix}_lagging`] = d.lagging;
//                             } else if (ind.id === 'HeikenAshi') {
//                                 row[`${prefix}_open`] = d.open;
//                                 row[`${prefix}_high`] = d.high;
//                                 row[`${prefix}_low`] = d.low;
//                                 row[`${prefix}_close`] = d.close;
//                             } else if (ind.id === 'DMI') {
//                                 row[`${prefix}_pdi`] = d.pdi;
//                                 row[`${prefix}_mdi`] = d.mdi;
//                                 row[`${prefix}_adx`] = d.adx;
//                             } else if (ind.id === 'MACD') {
//                                 row[`${prefix}_MACD`] = d.value;
//                                 row[`${prefix}_signal`] = d.signal;
//                                 row[`${prefix}_hist`] = d.histogram;
//                             } else if (ind.id === 'STOCH' || ind.id === 'StochRSI') {
//                                 row[`${prefix}_k`] = d.k || d.value; // library sometimes uses value for k
//                                 row[`${prefix}_d`] = d.d;
//                             } else {
//                                 // Standard single value or generic fields
//                                 if (d.value !== undefined) row[prefix] = d.value;
//                                 if (d.signal !== undefined && ind.id !== 'MACD') row[`${prefix}_signal`] = d.signal;
//                                 if (d.upper !== undefined && ind.id !== 'BB') row[`${prefix}_upper`] = d.upper;
//                                 if (d.lower !== undefined && ind.id !== 'BB') row[`${prefix}_lower`] = d.lower;
//                             }
//                         }
//                     });
//                 };

//                 // Case A: Indicator has PRESETS (EMA, SMA, RSI, etc.)
//                 if (ind.presets && ind.presets.length > 0) {
//                     ind.presets.forEach(preset => {
//                         let params = { ...ind.defParams };
//                         let label = `${ind.id}_${preset}`;

//                         // Handle parsing logic if preset is string (like '14-3-3')
//                         if (typeof preset === 'string' && preset.includes('-')) {
//                             // Logic matching IndicatorMenu
//                             if (ind.id === 'STOCH') {
//                                 const [p, k, d] = preset.split('-').map(Number);
//                                 params = { ...params, period: p, signalPeriod: k };
//                             } else {
//                                 // Fallback
//                                 params.period = parseInt(preset);
//                             }
//                         } else {
//                             params.period = Number(preset);
//                         }

//                         // Calculate
//                         const data = calculateIndicatorData(ind.id, chartData, params);
//                         addDataToMap(label, data);
//                     });
//                 }
//                 // Case B: No Presets, just default params
//                 else {
//                     const data = calculateIndicatorData(ind.id, chartData, ind.defParams);
//                     addDataToMap(ind.id, data);
//                 }

//             } catch (err) {
//                 console.warn(`Failed to export ${ind.id}`, err);
//             }
//         });

//         // 3. Flatten and Sort
//         const rows = Array.from(indicatorMap.values()).sort((a, b) => a.date.localeCompare(b.date));
//         if (rows.length === 0) return;

//         // 4. Collect Headers Dynamically
//         const allKeys = new Set(['date', 'open', 'high', 'low', 'close', 'volume']);
//         rows.forEach(r => Object.keys(r).forEach(k => allKeys.add(k)));
//         const headers = Array.from(allKeys);

//         // 5. Generate CSV
//         let csv = headers.join(',') + '\n';
//         rows.forEach(row => {
//             const values = headers.map(h => {
//                 const val = row[h];
//                 if (val === undefined || val === null) return '';
//                 if (typeof val === 'number') return val.toFixed(4);
//                 return val;
//             });
//             csv += values.join(',') + '\n';
//         });

//         const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = filename;
//         link.click();
//         URL.revokeObjectURL(link.href);

//     }, []);
//     const formatDate = (date) => date.toISOString().split('T')[0];

//     // Fetch search options once on mount (simple helper — used by search/UIs)
//     useEffect(() => {
//         let mounted = true;
//         const fetchSearchOptions = async () => {
//             try {
//                 const url = `${API_BASE}/equity-insights/search/options`;
//                 const resp = await fetch(url, { method: 'GET' });
//                 const json = await resp.json();
//                 if (!mounted) return;
//                 if (json && json.status === 'success') {
//                     // backend may return { data: { options: [...] } } or direct array
//                     const opts = (json.data && (json.data.options || json.data)) || [];
//                     setSearchOptions(Array.isArray(opts) ? opts : []);
//                 } else {
//                     setSearchOptions([]);
//                 }
//             } catch (err) {
//                 console.error('Failed to fetch search options:', err);
//                 if (mounted) setSearchOptions([]);
//             }
//         };
//         fetchSearchOptions();
//         return () => { mounted = false; };
//     }, []);

//     // Fetch Data
//     const fetchData = useCallback(async (start, end, isInitial = false) => {
//         if (!company?.fincode || isLoading || (isFullyLoaded && !isInitial)) return;
//         setIsLoading(true);

//         try {
//             // Updated to GET + query params
//             const url = new URL(`${API_BASE}/equity-insights/price-action-history/${company.fincode}`);
//             if (start) url.searchParams.append("start_date", start);
//             if (end) url.searchParams.append("end_date", end);

//             const response = await fetch(url.toString(), { method: 'GET' });
//             const raw = await response.text();
//             let result = null;
//             try {
//                 result = raw ? JSON.parse(raw) : null;
//             } catch (parseErr) {
//                 console.error('Invalid JSON received from price-action-history (raw response):', raw);
//                 throw parseErr;
//             }

//             if (result && result.status === 'success' && result.data) {
//                 const newPriceData = result.data.price_data || {};

//                 if (isInitial) {
//                     setPriceData(newPriceData);
//                 }

//                 const transformedData = [];
//                 if (newPriceData.Date) {
//                     for (let i = 0; i < newPriceData.Date.length; i++) {
//                         // transformedData.push({
//                         //     time: newPriceData.Date[i],
//                         //     open: newPriceData.Open[i],
//                         //     high: newPriceData.High[i],
//                         //     low: newPriceData.Low[i],
//                         //     close: newPriceData.Close[i],
//                         //     volume: newPriceData.TotalTradedQty ? newPriceData.TotalTradedQty[i] : 0,
//                         // });
//                         transformedData.push({
//         time: { year, month, day }, // BusinessDay
//         open: Number(newPriceData.Open[i]),
//         high: Number(newPriceData.High[i]),
//         low: Number(newPriceData.Low[i]),
//         close: Number(newPriceData.Close[i]),
//         volume: Number(newPriceData.TotalTradedQty?.[i] ?? 0),
//     });
//                     }
//                 }

//                 const uniqueTransformedData = [];
//                 const seenDates = new Set();
//                 for (const item of transformedData) {
//                     if (!seenDates.has(item.time)) {
//                         seenDates.add(item.time);
//                         uniqueTransformedData.push(item);
//                     }
//                 }
//                 uniqueTransformedData.sort((a, b) => (a.time > b.time ? 1 : -1));

//                 if (isInitial) {
//                     setData(uniqueTransformedData);
//                     setOldestAvailableDate(result.data.oldest_available_date);
//                     if (uniqueTransformedData.length > 0) setStartDate(uniqueTransformedData[0].time);

//                     // Auto-export indicator CSV for the symbol (use fincode as filename)
//                     if (uniqueTransformedData.length > 0 && company?.fincode) {
//                         const filename = `${company.fincode}_indicator.csv`;
//                         setTimeout(() => exportIndicatorCSV(uniqueTransformedData, filename), 500);
//                     }
//                 } else {
//                     setData(prev => {
//                         const combined = [...uniqueTransformedData, ...prev];
//                         const uniqueMap = new Map();
//                         combined.forEach(item => uniqueMap.set(item.time, item));
//                         const unique = Array.from(uniqueMap.values());
//                         unique.sort((a, b) => (a.time > b.time ? 1 : -1));
//                         return unique;
//                     });
//                     if (uniqueTransformedData.length > 0) setStartDate(uniqueTransformedData[0].time);
//                 }

//                 if (result.data.oldest_available_date && uniqueTransformedData.length > 0) {
//                     if (new Date(uniqueTransformedData[0].time) <= new Date(result.data.oldest_available_date)) {
//                         setIsFullyLoaded(true);
//                     }
//                 } else if (uniqueTransformedData.length === 0) {
//                     setIsFullyLoaded(true);
//                 }
//             } else {
//                 if (isInitial) {
//                     setData([]);
//                     setPriceData({ Date: [], Open: [], High: [], Low: [], Close: [] });
//                     setIsFullyLoaded(true);
//                 }
//             }
//         } catch (error) {
//             console.error("Failed to fetch price action:", error);
//             setIsFullyLoaded(true);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [company?.fincode, isLoading, isFullyLoaded]);

//     // Initial Load - MOCK PATTERNS FOR DEMO
//     useEffect(() => {
//         if (!company?.fincode) {
//             setData([]);
//             setPatterns([]);
//             if (seriesRef.current) seriesRef.current.setData([]);
//             return;
//         }
//         setData([]);
//         setPatterns([]); // Reset patterns
//         setDrawings([]); // Reset drawings
//         setActiveTool(null); // Reset annotation tool
//         setOldestAvailableDate(null);
//         setIsFullyLoaded(false);
//         setStartDate(null);
//         setActiveIndicators([]);
//         isFitRef.current = false;

//         if (seriesRef.current) seriesRef.current.setData([]);
//         Object.values(indicatorSeriesRef.current).forEach(s => {
//             if (Array.isArray(s)) s.forEach(sub => chartRef.current?.removeSeries(sub));
//             else chartRef.current?.removeSeries(s);
//         });
//         indicatorSeriesRef.current = {};

//         const today = new Date();
//         const oneYearAgo = new Date();
//         oneYearAgo.setFullYear(today.getFullYear() - 1);
//         fetchData(formatDate(oneYearAgo), formatDate(today), true);
//     }, [company?.fincode]);

//     // Fetch patterns from backend ONLY when PatternMenu opens
//     const [patternsFetched, setPatternsFetched] = useState(false);

//     useEffect(() => {
//         // Only fetch when menu opens and we haven't fetched yet for this company
//         if (!isPatternMenuOpen || !company?.fincode || patternsFetched) {
//             return;
//         }

//         const fetchPatterns = async () => {
//             try {
//                 // Updated to GET + correct endpoint
//                 const url = new URL(`${API_BASE}/equity-insights/micro-patterns/${company.fincode}`);
//                 // if (lookUpDays) url.searchParams.append("lookUp_days", lookUpDays); // Example if needed

//                 const response = await fetch(url.toString(), { method: 'GET' });
//                 const raw = await response.text();
//                 let result = null;
//                 try {
//                     result = raw ? JSON.parse(raw) : null;
//                 } catch (parseErr) {
//                     console.error('Invalid JSON received from micro-patterns endpoint (raw response):', raw);
//                     throw parseErr;
//                 }

//                 if (result && result.status === 'success' && result.data) {
//                     const patternData = result.data;
//                     const transformedPatterns = [];

//                     // Transform colwise_dict format to array of pattern objects
//                     if (patternData.Pattern_ID && patternData.Pattern_ID.length > 0) {
//                         for (let i = 0; i < patternData.Pattern_ID.length; i++) {
//                             // Use endDate or startDate as the pattern date for chart display
//                             const patternDate = patternData.endDate?.[i] || patternData.startDate?.[i];
//                             if (patternDate) {
//                                 transformedPatterns.push({
//                                     patternId: patternData.Pattern_ID[i],
//                                     date: patternDate.split('T')[0], // Format as YYYY-MM-DD
//                                     score: patternData.final_confidence?.[i] || 0
//                                 });
//                             }
//                         }
//                     }
//                     setPatterns(transformedPatterns);
//                 } else {
//                     setPatterns([]);
//                 }
//                 setPatternsFetched(true);
//             } catch (error) {
//                 console.error("Failed to fetch patterns:", error);
//                 setPatterns([]);
//             }
//         };

//         fetchPatterns();
//     }, [isPatternMenuOpen, company?.fincode, patternsFetched]);

//     // Reset patternsFetched when company changes
//     useEffect(() => {
//         setPatternsFetched(false);
//         setPatterns([]);
//     }, [company?.fincode]);

//     // --- CHART & OVERLAY REFACTOR ---
//     // Use refs for data/patterns to access latest values in event handlers without re-subscribing
//     const dataRef = useRef(data);
//     const patternsRef = useRef(patterns);
//     const activePatternIdsRef = useRef(activePatternIds);

//     useEffect(() => {
//         dataRef.current = data;
//         patternsRef.current = patterns;
//         activePatternIdsRef.current = activePatternIds;
//     }, [data, patterns, activePatternIds]);

//     // Robust Highlights Drawing Function (Stable Reference)
//     const drawHighlights = useCallback(() => {
//         const chart = chartRef.current;
//         const series = seriesRef.current;
//         const canvas = canvasRef.current;
//         const container = chartContainerRef.current;

//         if (!chart || !series || !canvas || !container) return;

//         // Handle retina displays
//         const dpr = window.devicePixelRatio || 1;
//         const height = container.clientHeight;
//         canvas.width = container.clientWidth * dpr;
//         canvas.height = height * dpr;
//         const ctx = canvas.getContext('2d');
//         ctx.scale(dpr, dpr);
//         ctx.clearRect(0, 0, container.clientWidth, height);

//         const timeScale = chart.timeScale();
//         const barSpacing = timeScale.options().barSpacing;
//         const PADDING = 4;
//         const BORDER_RADIUS = 4;

//         // Get price scale widths for clipping
//         const leftPriceScaleWidth = chart.priceScale('left').width();
//         const rightPriceScaleWidth = chart.priceScale('right').width();
//         const chartAreaLeft = leftPriceScaleWidth;
//         const chartAreaRight = container.clientWidth - rightPriceScaleWidth;
//         const chartAreaWidth = chartAreaRight - chartAreaLeft;

//         // Clip to chart area only (excludes Y-axis scales)
//         ctx.save();
//         ctx.beginPath();
//         ctx.rect(chartAreaLeft, 0, chartAreaWidth, height);
//         ctx.clip();

//         // Use Refs for latest data
//         const currentPatterns = patternsRef.current;
//         const currentData = dataRef.current;
//         const currentActiveIds = activePatternIdsRef.current;

//         currentPatterns.forEach(p => {
//             if (!currentActiveIds.includes(p.patternId)) return;

//             const meta = PatternRegistry.getPattern(p.patternId);
//             const bias = meta.bias || 'neutral';
//             const colorMap = {
//                 bullish: { fill: 'rgba(16, 185, 129, 0.2)', stroke: '#10b981' },
//                 bearish: { fill: 'rgba(239, 68, 68, 0.2)', stroke: '#ef4444' },
//                 neutral: { fill: 'rgba(139, 92, 246, 0.2)', stroke: '#8b5cf6' }
//             };
//             const style = colorMap[bias] || colorMap.neutral;

//             // const xCoord = timeScale.timeToCoordinate(p.date);
//             // if (xCoord === null) return;
//             // const x = Math.round(xCoord + leftPriceScaleWidth);

//             // const candleIndex = currentData.findIndex(d => d.time === p.date);
//             // if (candleIndex === -1) return;
//             // const candle = currentData[candleIndex];
//             const xCoord = timeScale.timeToCoordinate(bd);

// const candleIndex = currentData.findIndex(
//     c =>
//         c.time.year === y &&
//         c.time.month === m &&
//         c.time.day === d
// );

//             const highY = Math.round(series.priceToCoordinate(candle.high));
//             const lowY = Math.round(series.priceToCoordinate(candle.low));

//             if (highY === null || lowY === null) return;

//             // Use 80% of bar spacing for candle width (matches chart's candle rendering)
//             const candleWidth = Math.max(3, Math.round(barSpacing * 0.8));
//             const rectX = x - (candleWidth / 2) - PADDING;
//             const rectY = highY - PADDING;
//             const rectW = candleWidth + (PADDING * 2);
//             const rectH = (lowY - highY) + (PADDING * 2);

//             ctx.fillStyle = style.fill;
//             ctx.strokeStyle = style.stroke;
//             ctx.lineWidth = 1;

//             ctx.beginPath();
//             ctx.roundRect(rectX, rectY, rectW, rectH, BORDER_RADIUS);
//             ctx.fill();
//             ctx.stroke();

//             // Label
//             const labelText = meta.shortName || "PAT";
//             const badgeY = rectY - 18;

//             ctx.fillStyle = style.stroke;
//             ctx.font = 'bold 10px sans-serif';
//             const textMetrics = ctx.measureText(labelText);
//             const badgeW = textMetrics.width + 8;
//             const badgeX = x - (badgeW / 2);

//             ctx.beginPath();
//             ctx.roundRect(badgeX, badgeY, badgeW, 14, 2);
//             ctx.fill();

//             ctx.fillStyle = '#ffffff';
//             ctx.textAlign = 'center';
//             ctx.textBaseline = 'middle';
//             ctx.fillText(labelText, x, badgeY + 7);
//         });

//         // Restore canvas state (remove clipping)
//         ctx.restore();
//     }, []); // Empty dependency mainly because we use refs

//     // Initialize Chart (Once per company)
//     useEffect(() => {
//         if (!chartContainerRef.current) return;

//         const container = chartContainerRef.current;
//         container.innerHTML = '';

//         const chart = createChart(container, {
//             width: container.clientWidth,
//             height: 500,
//             layout: {
//                 background: { type: ColorType.Solid, color: '#ffffff' },
//                 textColor: '#334155',
//                 fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//                 attributionLogo: false
//             },
//             grid: {
//                 vertLines: { color: '#f1f5f9' },
//                 horzLines: { color: '#f1f5f9' }
//             },
//             rightPriceScale: {
//                 borderColor: '#e2e8f0',
//                 scaleMargins: { top: 0.1, bottom: 0.1 }
//             },
//             leftPriceScale: {
//                 visible: true,
//                 borderColor: '#e2e8f0',
//             },
//             timeScale: {
//                 borderColor: '#e2e8f0',
//                 timeVisible: true,
//                 secondsVisible: false,
//                 tickMarkFormatter: (time) => {
//                     const date = new Date(time);
//                     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//                 }
//             },
//             crosshair: {
//                 mode: CrosshairMode.Magnet,
//                 vertLine: { color: '#64748b', width: 1, style: 2 },
//                 horzLine: { color: '#64748b', width: 1, style: 2 }
//             },
//             handleScroll: { mouseWheel: true, pressedMouseMove: true },
//             handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
//         });

//         chartRef.current = chart;

//         if (typeof chart.addCandlestickSeries !== 'function') {
//             console.error('lightweight-charts createChart returned object without addCandlestickSeries. Chart object:', chart);
//             // Prevent further errors by aborting initialization
//             setChartReady(false);
//             return;
//         }

//         // const candlestickSeries = chart.addCandlestickSeries({
//         //     upColor: '#10b981',
//         //     downColor: '#ef4444',
//         //     borderVisible: false,
//         //     wickUpColor: '#10b981',
//         //     wickDownColor: '#ef4444',
//         //     priceFormat: { type: 'price', precision: 2, minMove: 0.01 }
//         // });
//         // seriesRef.current = candlestickSeries;
//         const candlestickSeries = chart.addSeries(CandlestickSeries, {
//     upColor: '#10b981',
//     downColor: '#ef4444',
//     borderVisible: false,
//     wickUpColor: '#10b981',
//     wickDownColor: '#ef4444',
//     priceFormat: { type: 'price', precision: 2, minMove: 0.01 }
// });
// seriesRef.current = candlestickSeries;

//         // --- OVERLAY CANVAS SETUP ---
//         const canvas = document.createElement('canvas');
//         canvas.style.position = 'absolute';
//         canvas.style.top = '0';
//         canvas.style.left = '0';
//         canvas.style.width = '100%';
//         canvas.style.height = '100%';
//         canvas.style.pointerEvents = 'none';
//         canvas.style.zIndex = '10';
//         container.appendChild(canvas);
//         canvasRef.current = canvas;

//         setChartReady(true);

//         // Sync Handlers
//         const handleTimeScaleChange = () => requestAnimationFrame(drawHighlights);
//         chart.timeScale().subscribeVisibleLogicalRangeChange(handleTimeScaleChange);

//         const resizeObserver = new ResizeObserver(entries => {
//             if (entries.length === 0 || !entries[0].contentRect) return;
//             const newRect = entries[0].contentRect;
//             chart.applyOptions({ width: newRect.width, height: newRect.height });
//             // Defer drawing to ensure chart has updated its internal layout/scales
//             requestAnimationFrame(drawHighlights);
//         });
//         resizeObserver.observe(container);

//         // chart.subscribeCrosshairMove(param => {
//         //     if (param.time) {
//         //         const candleData = param.seriesData.get(candlestickSeries);
//         //         if (candleData) setCurrentOHLC(candleData);
//         chart.subscribeCrosshairMove(param => {
//     const price = param.seriesPrices?.get(candlestickSeries);
//     if (price) {
//         setCurrentOHLC(price);
//             } else {
//                 // Safe access via Ref or state if available
//                 const currentData = dataRef.current;
//                 if (currentData && currentData.length > 0) {
//                     setCurrentOHLC(currentData[currentData.length - 1]);
//                 }
//             }
//         });

//         if (!isFitRef.current) {
//             chart.timeScale().fitContent();
//             isFitRef.current = true;
//         }

//         return () => {
//             resizeObserver.disconnect();
//             chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleTimeScaleChange);
//             chart.remove();
//             setChartReady(false);
//             if (canvas) canvas.remove();
//         };
//     }, [company?.fincode]);

//     // Update Data efficiently without destroying chart
//     useEffect(() => {
//         if (seriesRef.current && data.length > 0) {
//             seriesRef.current.setData(data);
//             drawHighlights();
//         }
//     }, [data, drawHighlights]);

//     // Redraw highlights when patterns/selection change
//     useEffect(() => {
//         requestAnimationFrame(drawHighlights);
//     }, [activePatternIds, patterns, drawHighlights]);

//     // Manage Indicators Rendering
//     useEffect(() => {
//         if (!chartRef.current || data.length === 0 || !chartReady) return;

//         try {
//             const currentIds = new Set(activeIndicators.map(i => i.uuid));

//             // Remove unselected series
//             Object.keys(indicatorSeriesRef.current).forEach(uuid => {
//                 if (!currentIds.has(uuid)) {
//                     const s = indicatorSeriesRef.current[uuid];
//                     if (Array.isArray(s)) s.forEach(sub => chartRef.current.removeSeries(sub));
//                     else chartRef.current.removeSeries(s);
//                     delete indicatorSeriesRef.current[uuid];
//                 }
//             });

//             // Add/Update selected
//             activeIndicators.forEach(ind => {
//                 try {
//                     const calculatedData = calculateIndicatorData(ind.id, data, ind.params || ind.defParams);
//                     if (!calculatedData || calculatedData.length === 0) return;

//                     // Init series if not exists
//                     if (!indicatorSeriesRef.current[ind.uuid]) {

//                         // --- Helper to add simple line ---
//                         // const addLine = (title, color, lineWidth = 1, priceScaleId = 'right') =>
//                         //     chartRef.current.addLineSeries({ title, color, lineWidth, priceScaleId, crosshairMarkerVisible: false });
//                         const addLine = (title, color, lineWidth = 1, priceScaleId = 'right') =>
//     chartRef.current.addSeries(LineSeries, {
//         title,
//         color,
//         lineWidth,
//         priceScaleId,
//         crosshairMarkerVisible: false,
//     });

//                         // --- BB ---
//                         if (ind.id === 'BB') {
//                             indicatorSeriesRef.current[ind.uuid] = [
//                                 addLine('BB Upper', ind.color, 1),
//                                 addLine('BB Lower', ind.color, 1) // No fill (area) requested, just lines
//                             ];
//                         }
//                         // --- MACD ---
//                         else if (ind.id === 'MACD') {
//                             const macd = addLine('MACD', ind.color, 2, 'left');
//                             const signal = addLine('Signal', '#FF5252', 1, 'left');
//                             // const hist = chartRef.current.addHistogramSeries({
//                             //     title: 'Hist', priceScaleId: 'left', color: '#26a69a'
//                             // });
//                             const hist = chartRef.current.addSeries(HistogramSeries, {
//     title: 'Hist',
//     priceScaleId: 'left',
// });

//                             indicatorSeriesRef.current[ind.uuid] = [macd, signal, hist];
//                         }
//                         // --- GMMA (Guppy) ---
//                         else if (ind.id === 'GMMA') {
//                             // 6 Short (Blue/Cyan), 6 Long (Red/Orange)
//                             const seriesArr = [];
//                             // Shorts
//                             const shortPeriods = ind.params?.shortPeriods || ind.defParams.shortPeriods;
//                             shortPeriods.forEach((p, i) => seriesArr.push(addLine(`GMMA Short ${p}`, '#00bcd4', 1)));
//                             // Longs
//                             const longPeriods = ind.params?.longPeriods || ind.defParams.longPeriods;
//                             longPeriods.forEach((p, i) => seriesArr.push(addLine(`GMMA Long ${p}`, '#ff5722', 1)));

//                             indicatorSeriesRef.current[ind.uuid] = seriesArr;
//                         }
//                         // --- Ichimoku ---
//                         else if (ind.id === 'Ichimoku') {
//                             indicatorSeriesRef.current[ind.uuid] = [
//                                 addLine('Tenkan', '#0496FF', 1),   // Conversion
//                                 addLine('Kijun', '#99154E', 1),    // Base
//                                 addLine('Span A', '#4CAF50', 1),
//                                 addLine('Span B', '#F44336', 1),
//                                 addLine('Lagging', '#808080', 1)
//                             ];
//                         }
//                         // --- Heiken Ashi ---
//                         else if (ind.id === 'HeikenAshi') {
//                             // Overlay candles
//                             const haSeries = chartRef.current.addSeries(CandlestickSeries, {
//                                 upColor: ind.color, downColor: '#000000', borderVisible: false,
//                                 wickUpColor: ind.color, wickDownColor: '#000000'
//                             });
//                             indicatorSeriesRef.current[ind.uuid] = haSeries;
//                         }
//                         // --- DMI ---
//                         else if (ind.id === 'DMI') {
//                             // 3 lines: PDI, MDI, ADX
//                             indicatorSeriesRef.current[ind.uuid] = [
//                                 addLine('+DI', '#4CAF50', 1, 'left'),
//                                 addLine('-DI', '#F44336', 1, 'left'),
//                                 addLine('ADX', '#FF9800', 1, 'left')
//                             ];
//                         }
//                         // --- Volume Oscillator ---
//                         else if (ind.id === 'VolOsc') {
//                             indicatorSeriesRef.current[ind.uuid] = addLine('Vol Osc', ind.color, 1, 'left');
//                         }
//                         // --- Generic Line Series ---
//                         else {
//                             const OVERLAY_IDS = new Set(['SMA', 'EMA', 'WMA', 'WEMA', 'BB', 'DC', 'KC', 'PSAR', 'SuperTrend', 'HMA', 'TEMA', 'VWAP']);
//                             const isOverlay = OVERLAY_IDS.has(ind.id);
//                             indicatorSeriesRef.current[ind.uuid] = addLine(ind.name, ind.color, 2, isOverlay ? 'right' : 'left');
//                         }
//                     }

//                     // Set Data
//                     const series = indicatorSeriesRef.current[ind.uuid];

//                     if (ind.id === 'BB') {
//                         series[0].setData(calculatedData.map(d => ({ time: d.time, value: d.value }))); // Upper (value is upper in calc map)
//                         series[1].setData(calculatedData.map(d => ({ time: d.time, value: d.lower })));
//                     }
//                     else if (ind.id === 'MACD') {
//                         series[0].setData(calculatedData.map(d => ({ time: d.time, value: d.value })));
//                         series[1].setData(calculatedData.map(d => ({ time: d.time, value: d.signal })));
//                         series[2].setData(calculatedData.map(d => ({
//                             time: d.time, value: d.histogram,
//                             color: d.histogram >= 0 ? '#26a69a' : '#ef5350'
//                         }))); // Hist
//                     }
//                     else if (ind.id === 'GMMA') {
//                         const shortPeriods = ind.params?.shortPeriods || ind.defParams.shortPeriods;
//                         const longPeriods = ind.params?.longPeriods || ind.defParams.longPeriods;
//                         // calculatedData[i] has properties short3, short5... long30...
//                         // series array order matches logic above: [short1...shortN, long1...longN]
//                         let sIdx = 0;
//                         shortPeriods.forEach(p => {
//                             series[sIdx++].setData(calculatedData.map(d => ({ time: d.time, value: d[`short${p}`] })));
//                         });
//                         longPeriods.forEach(p => {
//                             series[sIdx++].setData(calculatedData.map(d => ({ time: d.time, value: d[`long${p}`] })));
//                         });
//                     }
//                     else if (ind.id === 'Ichimoku') {
//                         // [conv, base, spanA, spanB, lagging]
//                         series[0].setData(calculatedData.map(d => ({ time: d.time, value: d.conversion })));
//                         series[1].setData(calculatedData.map(d => ({ time: d.time, value: d.base })));
//                         series[2].setData(calculatedData.map(d => ({ time: d.time, value: d.spanA })));
//                         series[3].setData(calculatedData.map(d => ({ time: d.time, value: d.spanB })));
//                         series[4].setData(calculatedData.map(d => ({ time: d.time, value: d.lagging })));
//                     }
//                     else if (ind.id === 'HeikenAshi') {
//                         series.setData(calculatedData); // Already { time, open, high, low, close }
//                     }
//                     else if (ind.id === 'DMI') {
//                         series[0].setData(calculatedData.map(d => ({ time: d.time, value: d.pdi })));
//                         series[1].setData(calculatedData.map(d => ({ time: d.time, value: d.mdi })));
//                         series[2].setData(calculatedData.map(d => ({ time: d.time, value: d.adx })));
//                     }
//                     else if (ind.id === 'StochRSI' || ind.id === 'STOCH') {
//                         // Create 2 lines if we want K and D? Current logic supports 1 line generic?
//                         // Wait, Stoch returns k and d.
//                         // I need to add support for 2 lines for Stoch in creation above?
//                         // My generic creation makes ONE line.
//                         // Let's rely on generic for 'value' (k) for now or update generic?
//                         // If generic, it uses d.value. Stoch returns value=k.
//                         series.setData(calculatedData);
//                     }
//                     else {
//                         series.setData(calculatedData);
//                     }

//                 } catch (indErr) {
//                     console.error(`Error updating indicator ${ind.name}:`, indErr);
//                 }
//             });
//         } catch (err) {
//             console.error("Error in indicator management:", err);
//         }
//     }, [activeIndicators, data, chartReady]);

//     // Infinite Scroll
//     const stateRef = useRef({ startDate, isLoading, isFullyLoaded, oldestAvailableDate });
//     useEffect(() => {
//         stateRef.current = { startDate, isLoading, isFullyLoaded, oldestAvailableDate };
//     }, [startDate, isLoading, isFullyLoaded, oldestAvailableDate]);

//     useEffect(() => {
//         if (!chartRef.current) return;
//         const chart = chartRef.current;
//         const onVisibleLogicalRangeChanged = (newVisibleLogicalRange) => {
//             if (newVisibleLogicalRange === null) return;
//             const { startDate, isLoading, isFullyLoaded } = stateRef.current;
//             if (newVisibleLogicalRange.from < 10 && !isLoading && !isFullyLoaded && startDate) {
//                 const currentStart = new Date(startDate);
//                 const newEnd = new Date(currentStart);
//                 newEnd.setDate(newEnd.getDate() - 1);
//                 const newStart = new Date(newEnd);
//                 newStart.setMonth(newStart.getMonth() - 12);
//                 fetchData(formatDate(newStart), formatDate(newEnd), false);
//             }
//         };
//         chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
//         return () => {
//             chart.timeScale().unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
//         };
//     }, [fetchData]);

//     const handleApplyIndicators = (newIndicators) => {
//         setActiveIndicators(newIndicators);
//         setIsMenuOpen(false);
//     };

//     const handleApplyPatterns = (newPatternIds) => {
//         setActivePatternIds(newPatternIds);
//         setIsPatternMenuOpen(false);
//     };

//     const OHLCItem = ({ label, value, color = "text-slate-700" }) => (
//         <div className="flex flex-col items-center">
//             <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
//             <span className={`text-sm font-bold ${color}`}>{value}</span>
//         </div>
//     );

//     return (
//         <div className={`bg-white shadow-lg border border-slate-200 overflow-hidden flex flex-col ${isFullScreen ? 'fixed inset-0 z-50 w-full h-full m-0 rounded-none' : 'rounded-2xl relative'}`}>
//             {/* Chart Header */}
//             <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-6">
//                         <div className="flex items-center gap-4">
//                             <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
//                                 <BarChart3 className="w-6 h-6 text-slate-700" />
//                             </div>
//                             <div>
//                                 <h3 className="text-xl font-bold text-slate-800">
//                                     {company?.symbol || 'Select Company'}
//                                 </h3>
//                                 <p className="text-slate-600 text-sm font-medium">
//                                     {company?.companyName || 'Please select a company'}
//                                 </p>
//                             </div>
//                         </div>

//                         {currentOHLC && (
//                             <div className="flex items-center gap-6 bg-white rounded-lg px-4 py-3 border border-slate-200 shadow-sm">
//                                 <OHLCItem label="Open" value={currentOHLC.open?.toFixed(2) || '—'} />
//                                 <div className="h-8 w-px bg-slate-300"></div>
//                                 <OHLCItem label="High" value={currentOHLC.high?.toFixed(2) || '—'} color="text-green-600" />
//                                 <div className="h-8 w-px bg-slate-300"></div>
//                                 <OHLCItem label="Low" value={currentOHLC.low?.toFixed(2) || '—'} color="text-red-600" />
//                                 <div className="h-8 w-px bg-slate-300"></div>
//                                 <OHLCItem
//                                     label="Close"
//                                     value={currentOHLC.close?.toFixed(2) || '—'}
//                                     color={currentOHLC.close >= currentOHLC.open ? "text-green-600" : "text-red-600"}
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-3">
//                         {data.length > 0 && (
//                             <>
//                                 <button
//                                     onClick={() => setIsAnnotationMenuOpen(true)}
//                                     className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium shadow-sm ${activeTool
//                                         ? 'bg-teal-50 text-teal-700 border-teal-200'
//                                         : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
//                                         }`}
//                                 >
//                                     <PenTool className="w-4 h-4" />
//                                     <span>Drawing</span>
//                                     {drawings.length > 0 && (
//                                         <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
//                                             {drawings.length}
//                                         </span>
//                                     )}
//                                     <ChevronDown className="w-4 h-4" />
//                                 </button>

//                                 <button
//                                     onClick={() => setIsMenuOpen(true)}
//                                     className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all text-sm font-medium shadow-sm"
//                                 >
//                                     <Layers className="w-4 h-4" />
//                                     <span>Indicators</span>
//                                     {activeIndicators.length > 0 && (
//                                         <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
//                                             {activeIndicators.length}
//                                         </span>
//                                     )}
//                                     <ChevronDown className="w-4 h-4" />
//                                 </button>

//                                 <button
//                                     onClick={() => setIsPatternMenuOpen(true)}
//                                     className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all text-sm font-medium shadow-sm"
//                                 >
//                                     <CandlestickChart className="w-4 h-4" />
//                                     <span>Patterns</span>
//                                     {activePatternIds.length > 0 && (
//                                         <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
//                                             {activePatternIds.length}
//                                         </span>
//                                     )}
//                                     <ChevronDown className="w-4 h-4" />
//                                 </button>
//                             </>
//                         )}

//                         <div className="h-6 w-px bg-slate-200 mx-1"></div>

//                         <button
//                             onClick={() => setIsFullScreen(!isFullScreen)}
//                             className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
//                             title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
//                         >
//                             {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Chart Container */}
//             <div className={`p-6 ${isFullScreen ? 'flex-1 p-0' : ''}`}>
//                 <div className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-white" style={{ height: isFullScreen ? '100%' : '500px', border: isFullScreen ? 'none' : undefined, borderRadius: isFullScreen ? '0' : undefined }}>
//                     {!isLoading && isFullyLoaded && data.length === 0 && company && (
//                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
//                             <div className="p-4 rounded-full bg-gray-100 mb-4">
//                                 <AlertCircle className="w-8 h-8 text-gray-400" />
//                             </div>
//                             <h3 className="text-lg font-semibold text-gray-900">No Price Data Available</h3>
//                             <p className="text-sm text-gray-500 mt-1">We couldn't find any trading history for this symbol.</p>
//                         </div>
//                     )}

//                     {/* Loading Overlay */}
//                     {isLoading && (
//                         data.length === 0 ? (
//                             // Initial Load: Centered with backdrop
//                             <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
//                                 <CandleLoader />
//                             </div>
//                         ) : (
//                             // Subsequent Load: Small icon top-left (inside grid, clearing left axis)
//                             <div className="absolute top-6 left-20 z-50 transform scale-[0.4] origin-top-left pointer-events-none">
//                                 <CandleLoader />
//                             </div>
//                         )
//                     )}

//                     {/* Active Drawing Tool Indicator */}
//                     {data.length > 0 && (activeTool || drawings.length > 0) && (
//                         <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2">
//                             {activeTool ? (
//                                 <>
//                                     <PenTool className="w-4 h-4 text-teal-600" />
//                                     <span className="text-xs font-medium text-slate-700 capitalize">{activeTool.replace(/([A-Z])/g, ' $1').trim()}</span>
//                                     <button
//                                         onClick={() => setActiveTool(null)}
//                                         className="p-1 hover:bg-slate-100 rounded transition-colors"
//                                         title="Exit drawing mode"
//                                     >
//                                         <X className="w-3 h-3 text-slate-500" />
//                                     </button>
//                                 </>
//                             ) : (
//                                 <span className="text-xs text-slate-500">{drawings.length} drawing{drawings.length !== 1 ? 's' : ''}</span>
//                             )}
//                             {drawings.length > 0 && (
//                                 <>
//                                     <div className="w-px h-4 bg-slate-200" />
//                                     <button
//                                         onClick={() => setActiveTool('eraser')}
//                                         className={`p-1 rounded transition-colors ${activeTool === 'eraser' ? 'bg-red-100 text-red-600' : 'hover:bg-slate-100 text-slate-500'}`}
//                                         title="Eraser"
//                                     >
//                                         <Eraser className="w-3.5 h-3.5" />
//                                     </button>
//                                     <button
//                                         onClick={() => setDrawings([])}
//                                         className="text-xs text-red-500 hover:text-red-600 font-medium"
//                                     >
//                                         Clear
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     )}

//                     <div ref={chartContainerRef} className="w-full h-full" />

//                     {/* Chart Annotations Layer */}
//                     {chartReady && data.length > 0 && (
//                         <ChartAnnotations
//                             chart={chartRef.current}
//                             series={seriesRef.current}
//                             data={data}
//                             activeTool={activeTool}
//                             onDrawingComplete={() => { }}
//                             drawings={drawings}
//                             setDrawings={setDrawings}
//                         />
//                     )}
//                 </div>
//             </div>

//             {/* Active Indicators Legend */}
//             {activeIndicators.length > 0 && (
//                 <div className="absolute top-[140px] left-10 flex flex-col gap-1 pointer-events-none z-50">
//                     {activeIndicators.map(ind => (
//                         <div key={ind.uuid} className="flex items-center gap-2 text-xs font-medium bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm border border-gray-200 pointer-events-auto w-fit">
//                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ind.color }} />
//                             <span className="text-gray-700">{ind.name}</span>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <IndicatorMenu
//                 isOpen={isMenuOpen}
//                 onClose={() => setIsMenuOpen(false)}
//                 activeIndicators={activeIndicators}
//                 onApply={handleApplyIndicators}
//             />

//             <PatternMenu
//                 isOpen={isPatternMenuOpen}
//                 onClose={() => setIsPatternMenuOpen(false)}
//                 activePatterns={activePatternIds}
//                 onApply={handleApplyPatterns}
//             />

//             <AnnotationMenu
//                 isOpen={isAnnotationMenuOpen}
//                 onClose={() => setIsAnnotationMenuOpen(false)}
//                 activeTool={activeTool}
//                 onSelectTool={setActiveTool}
//             />
//         </div>
//     );
// }

// export default ResearchChart;

// ========================================

// import { useEffect, useRef, useState, useCallback } from 'react';
// // import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
// import {
//   createChart,
//   ColorType,
//   CrosshairMode,
//   CandlestickSeries,
// } from 'lightweight-charts';
// import {
//   BarChart3,
//   Layers,
//   ChevronDown,
//   AlertCircle,
//   CandlestickChart,
//   PenTool,
//   Eraser,
//   X,
//   Maximize2,
//   Minimize2,
// } from 'lucide-react';

// import { calculateIndicatorData } from './IndicatorCalculations';
// import { PatternRegistry } from './Data/PatternRegistry';
// import CandleLoader from './CandleLoader';
// import PatternMenu from './PatternMenu';
// import IndicatorMenu, { AVAILABLE_INDICATORS } from './IndicatorMenu';
// import AnnotationMenu from './AnnotationMenu';
// import ChartAnnotations from './ChartAnnotations';

// /* -------------------------------------------------
//    Utilities
// ------------------------------------------------- */
// const toBusinessDay = (yyyyMMdd) => {
//   if (!yyyyMMdd) return null;
//   const [year, month, day] = yyyyMMdd.split('-').map(Number);
//   return { year, month, day };
// };

// const formatDate = (date) => date.toISOString().split('T')[0];

// /* -------------------------------------------------
//    Component
// ------------------------------------------------- */
// function ResearchChart({ company }) {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const chartContainerRef = useRef(null);
//   const chartRef = useRef(null);
//   const seriesRef = useRef(null);
//   const canvasRef = useRef(null);
//   const indicatorSeriesRef = useRef({});
//   const isFitRef = useRef(false);

//   const dataRef = useRef([]);
//   const patternsRef = useRef([]);
//   const activePatternIdsRef = useRef([]);

//   const [data, setData] = useState([]);
//   const [patterns, setPatterns] = useState([]);
//   const [activePatternIds, setActivePatternIds] = useState([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isFullyLoaded, setIsFullyLoaded] = useState(false);
//   const [startDate, setStartDate] = useState(null);

//   const [activeIndicators, setActiveIndicators] = useState([]);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isPatternMenuOpen, setIsPatternMenuOpen] = useState(false);
//   const [isAnnotationMenuOpen, setIsAnnotationMenuOpen] = useState(false);

//   const [activeTool, setActiveTool] = useState(null);
//   const [drawings, setDrawings] = useState([]);

//   const [chartReady, setChartReady] = useState(false);
//   const [currentOHLC, setCurrentOHLC] = useState(null);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   /* -------------------------------------------------
//      Sync refs
//   ------------------------------------------------- */
//   useEffect(() => {
//     dataRef.current = data;
//     patternsRef.current = patterns;
//     activePatternIdsRef.current = activePatternIds;
//   }, [data, patterns, activePatternIds]);

//   /* -------------------------------------------------
//      Fetch price data (FIXED TIME FORMAT)
//   ------------------------------------------------- */
//   const fetchData = useCallback(async (start, end, isInitial) => {
//     if (!company?.fincode || isLoading || (isFullyLoaded && !isInitial)) return;
//     setIsLoading(true);

//     try {
//       const url = new URL(`${API_BASE}/equity-insights/price-action-history/${company.fincode}`);
//       if (start) url.searchParams.append('start_date', start);
//       if (end) url.searchParams.append('end_date', end);

//       const response = await fetch(url);
//       const result = await response.json();

//       if (result?.status !== 'success') throw new Error('API failed');

//       const pd = result.data.price_data;
//       const rows = [];

//       for (let i = 0; i < pd.Date.length; i++) {
//         rows.push({
//           time: toBusinessDay(pd.Date[i]), // ✅ REQUIRED
//           open: Number(pd.Open[i]),
//           high: Number(pd.High[i]),
//           low: Number(pd.Low[i]),
//           close: Number(pd.Close[i]),
//           volume: Number(pd.TotalTradedQty?.[i] ?? 0),
//         });
//       }

//       rows.sort((a, b) =>
//         new Date(`${a.time.year}-${a.time.month}-${a.time.day}`) -
//         new Date(`${b.time.year}-${b.time.month}-${b.time.day}`)
//       );

//       if (isInitial) {
//         setData(rows);
//         setStartDate(pd.Date[0]);
//       } else {
//         setData((prev) => [...rows, ...prev]);
//       }

//       if (rows.length === 0) setIsFullyLoaded(true);
//     } catch (err) {
//       console.error(err);
//       setIsFullyLoaded(true);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [company?.fincode, isLoading, isFullyLoaded]);

//   /* -------------------------------------------------
//      Initial load
//   ------------------------------------------------- */
//   useEffect(() => {
//     if (!company?.fincode) return;

//     setData([]);
//     setPatterns([]);
//     setActiveIndicators([]);
//     isFitRef.current = false;

//     const today = new Date();
//     const oneYearAgo = new Date();
//     oneYearAgo.setFullYear(today.getFullYear() - 1);

//     fetchData(formatDate(oneYearAgo), formatDate(today), true);
//   }, [company?.fincode]);

//   /* -------------------------------------------------
//      Chart init
//   ------------------------------------------------- */
//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     const container = chartContainerRef.current;
//     container.innerHTML = '';

//     const chart = createChart(container, {
//       width: container.clientWidth,
//       height: 500,
//       layout: {
//         background: { type: ColorType.Solid, color: '#ffffff' },
//         textColor: '#334155',
//         attributionLogo: false,
//       },
//       rightPriceScale: { scaleMargins: { top: 0.1, bottom: 0.1 } },
//       leftPriceScale: { visible: true },
//       timeScale: { timeVisible: true },
//       crosshair: { mode: CrosshairMode.Magnet },
//     });

//     // const candleSeries = chart.addCandlestickSeries({
//     //   upColor: '#10b981',
//     //   downColor: '#ef4444',
//     //   borderVisible: false,
//     //   wickUpColor: '#10b981',
//     //   wickDownColor: '#ef4444',
//     // });
//     const candleSeries = chart.addSeries(CandlestickSeries, {
//   upColor: '#10b981',
//   downColor: '#ef4444',
//   borderVisible: false,
//   wickUpColor: '#10b981',
//   wickDownColor: '#ef4444',
// });

//     chartRef.current = chart;
//     seriesRef.current = candleSeries;

//     chart.subscribeCrosshairMove((param) => {
//       const price = param.seriesPrices?.get(seriesRef.current);
//       if (price) setCurrentOHLC(price);
//     });

//     setChartReady(true);

//     return () => chart.remove();
//   }, [company?.fincode]);

//   /* -------------------------------------------------
//      Update candles
//   ------------------------------------------------- */
//   useEffect(() => {
//     if (seriesRef.current && data.length > 0) {
//       seriesRef.current.setData(data);
//       if (!isFitRef.current) {
//         chartRef.current.timeScale().fitContent();
//         isFitRef.current = true;
//       }
//     }
//   }, [data]);

//   /* -------------------------------------------------
//      UI
//   ------------------------------------------------- */
//   return (
//     <div className={`bg-white border rounded-2xl flex flex-col ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
//       <div className="flex items-center justify-between px-6 py-4 border-b">
//         <div className="flex items-center gap-4">
//           <BarChart3 />
//           <div>
//             <div className="font-bold">{company?.symbol}</div>
//             <div className="text-sm text-gray-500">{company?.companyName}</div>
//           </div>
//         </div>
//         <button onClick={() => setIsFullScreen(!isFullScreen)}>
//           {isFullScreen ? <Minimize2 /> : <Maximize2 />}
//         </button>
//       </div>

//       <div className="relative flex-1">
//         {isLoading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
//             <CandleLoader />
//           </div>
//         )}

//         <div ref={chartContainerRef} className="w-full h-full" />

//         {chartReady && data.length > 0 && (
//           <ChartAnnotations
//             chart={chartRef.current}
//             series={seriesRef.current}
//             data={data}
//             activeTool={activeTool}
//             drawings={drawings}
//             setDrawings={setDrawings}
//           />
//         )}
//       </div>

//       <IndicatorMenu
//         isOpen={isMenuOpen}
//         onClose={() => setIsMenuOpen(false)}
//         activeIndicators={activeIndicators}
//         onApply={setActiveIndicators}
//       />

//       <PatternMenu
//         isOpen={isPatternMenuOpen}
//         onClose={() => setIsPatternMenuOpen(false)}
//         activePatterns={activePatternIds}
//         onApply={setActivePatternIds}
//       />

//       <AnnotationMenu
//         isOpen={isAnnotationMenuOpen}
//         onClose={() => setIsAnnotationMenuOpen(false)}
//         activeTool={activeTool}
//         onSelectTool={setActiveTool}
//       />
//     </div>
//   );
// }

// export default ResearchChart;
// =============ghgjghj==========================

// import { useEffect, useRef, useState, useCallback } from 'react';
// import {
//   createChart,
//   ColorType,
//   CrosshairMode,
//   CandlestickSeries,
// } from 'lightweight-charts';
// import {
//   BarChart3,
//   Layers,
//   ChevronDown,
//   AlertCircle,
//   CandlestickChart,
//   PenTool,
//   Eraser,
//   X,
//   Maximize2,
//   Minimize2,
// } from 'lucide-react';

// import { calculateIndicatorData } from './IndicatorCalculations';
// import { PatternRegistry } from './Data/PatternRegistry';
// import CandleLoader from './CandleLoader';
// import PatternMenu from './PatternMenu';
// import IndicatorMenu, { AVAILABLE_INDICATORS } from './IndicatorMenu';
// import AnnotationMenu from './AnnotationMenu';
// import ChartAnnotations from './ChartAnnotations';

// /* -------------------------------------------------
//    Utilities
// ------------------------------------------------- */
// const toBusinessDay = (yyyyMMdd) => {
//   if (!yyyyMMdd) return null;
//   const [year, month, day] = yyyyMMdd.split('-').map(Number);
//   return { year, month, day };
// };

// const formatDate = (date) => date.toISOString().split('T')[0];

// /* -------------------------------------------------
//    Component
// ------------------------------------------------- */
// function ResearchChart({ company }) {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const chartContainerRef = useRef(null);
//   const chartRef = useRef(null);
//   const seriesRef = useRef(null);
//   const canvasRef = useRef(null);
//   const indicatorSeriesRef = useRef({});
//   const isFitRef = useRef(false);

//   const dataRef = useRef([]);
//   const patternsRef = useRef([]);
//   const activePatternIdsRef = useRef([]);

//   const [data, setData] = useState([]);
//   const [patterns, setPatterns] = useState([]);
//   const [activePatternIds, setActivePatternIds] = useState([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isFullyLoaded, setIsFullyLoaded] = useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [oldestAvailableDate, setOldestAvailableDate] = useState(null);

//   const [activeIndicators, setActiveIndicators] = useState([]);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isPatternMenuOpen, setIsPatternMenuOpen] = useState(false);
//   const [isAnnotationMenuOpen, setIsAnnotationMenuOpen] = useState(false);

//   const [activeTool, setActiveTool] = useState(null);
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  PriceScaleMode,
  LineSeries,
  createSeriesMarkers,
  HistogramSeries,
  CandlestickSeries,
  AreaSeries, // Added for Line Chart view (using Area for better aesthetics)
} from "lightweight-charts";
import {
  BarChart3,
  Layers,
  ChevronDown,
  AlertCircle,
  CandlestickChart,
  PenTool,
  Eraser,
  X,
  Maximize2,
  Minimize2,
  RotateCcw, // For Undo button
  Move,
  MousePointer,
  TrendingUp,
  Ruler,
  Type,
  Activity,
  Box,
  GitBranch,
  Minus,
  Circle,
  Square,
  Grid3X3,
  Target,
  Waves,
  TriangleRight,
  Zap,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { calculateIndicatorData } from "./IndicatorCalculations";
import { PatternRegistry } from "./Data/PatternRegistry";
import CandleLoader from "./CandleLoader";
import PatternMenu from "./PatternMenu";
import IndicatorMenu, { AVAILABLE_INDICATORS } from "./IndicatorMenu";
import AnnotationMenu from "./AnnotationMenu";
import ChartLegend from "./ChartLegend"; // TradingView-style Legend
import RadialMenu from "./RadialMenu"; // New Component
import ChartAnnotations from "./ChartAnnotations";
import { CustomCandleSeries } from "./CustomCandleSeries";
import FavoritesToolbar from "./FavoritesToolbar"; // New Component
import { Star, GripVertical, Check } from "lucide-react";
import { equityInsightsApi } from "../../../services/equityInsightsApi";

/* -------------------------------------------------
   Utilities
------------------------------------------------- */
const toBusinessDay = (yyyyMMdd) => {
  if (!yyyyMMdd) return null;
  const [year, month, day] = yyyyMMdd.split("-").map(Number);
  return { year, month, day };
};

const formatDate = (date) => date.toISOString().split("T")[0];

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const aggregateData = (data, interval) => {
  if (!data || data.length === 0 || interval === "1D") return data;

  const aggregated = [];
  let currentCandle = null;

  const getPeriodKey = (d) => {
    const date = new Date(d.time.year, d.time.month - 1, d.time.day);
    if (interval === "1W") {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      const monday = new Date(date.setDate(diff));
      return `${monday.getFullYear()}-${monday.getMonth()}-${monday.getDate()}`;
    } else if (interval === "1M") {
      return `${date.getFullYear()}-${date.getMonth()}`;
    } else if (interval === "3M") {
      return `${date.getFullYear()}-${Math.floor(date.getMonth() / 3)}`;
    } else if (interval === "6M") {
      return `${date.getFullYear()}-${Math.floor(date.getMonth() / 6)}`;
    } else if (interval === "1Y" || interval === "12M") {
      return `${date.getFullYear()}`;
    }
    return null;
  };

  data.forEach((d) => {
    const key = getPeriodKey(d);

    if (!currentCandle) {
      currentCandle = {
        ...d,
        _key: key,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume || 0,
      };
    } else if (currentCandle._key !== key) {
      aggregated.push({
        time: currentCandle.time, // Using the time of the *first* day of the period or last? TradingView usually uses start time.
        open: currentCandle.open,
        high: currentCandle.high,
        low: currentCandle.low,
        close: currentCandle.close,
        volume: currentCandle.volume,
      });
      currentCandle = {
        ...d,
        _key: key,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume || 0,
      };
    } else {
      // Accumulate
      currentCandle.high = Math.max(currentCandle.high, d.high);
      currentCandle.low = Math.min(currentCandle.low, d.low);
      currentCandle.close = d.close;
      currentCandle.volume += d.volume || 0;
      // Time usually updates to the latest date if we want the candle to be plotted at end,
      // but typically weekly candles are plotted at start of week.
      // Let's keep the start 'time' property from the first candle initiated.
    }
  });

  if (currentCandle) {
    aggregated.push({
      time: currentCandle.time,
      open: currentCandle.open,
      high: currentCandle.high,
      low: currentCandle.low,
      close: currentCandle.close,
      volume: currentCandle.volume,
    });
  }

  return aggregated;
};

/* -------------------------------------------------
   Component
------------------------------------------------- */
function ResearchChart({ company }) {
  // Using centralized API service instead of direct fetch calls

  const chartContainerRef = useRef(null);
  const chartWrapperRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const markerSeriesRef = useRef(null);
  const markerPrimitiveRef = useRef(null);
  const pendingMarkersRef = useRef(null);
  const announcementItemsRef = useRef([]);
  const updateAnnouncementOverlaysRef = useRef(() => {});
  const canvasRef = useRef(null);
  const indicatorSeriesRef = useRef({});
  const candleSettingsRef = useRef(null);
  const magnetEnabledRef = useRef(true);
  const isFitRef = useRef(false);
  const currentSeriesTypeRef = useRef("candle");
  const lockedPriceRangeRef = useRef(null);
  const seriesDataRef = useRef([]);

  const dataRef = useRef([]);
  const rawDataRef = useRef([]);
  const patternsRef = useRef([]);
  const activePatternIdsRef = useRef([]);
  const savedLogicalRange = useRef(null);
  const prevFincode = useRef(null);
  const activeIndicatorsRef = useRef([]);

  const [data, setData] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [activePatternIds, setActivePatternIds] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [startDate, setStartDate] = useState(null);

  const [activeIndicators, setActiveIndicators] = useState([]);
  const [indicatorValues, setIndicatorValues] = useState({}); // Stores current values for Legend
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPatternMenuOpen, setIsPatternMenuOpen] = useState(false);
  const [isAnnotationMenuOpen, setIsAnnotationMenuOpen] = useState(false);

  const [activeTool, setActiveTool] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [patternConstraintMode, setPatternConstraintMode] =
    useState("optional");

  const [chartReady, setChartReady] = useState(false);
  const [currentOHLC, setCurrentOHLC] = useState(null);
  const [magnetEnabled, setMagnetEnabled] = useState(true);

  const DEFAULT_CANDLE_SETTINGS = useMemo(
    () => ({
      candleType: "candles",
      colorBy: "closeOpen",
      upColor: "#26a69a",
      downColor: "#ef5350",
      bodyOpacity: 1,
      bodyWidthScale: 0.8,
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      borderVisible: false,
      borderOpacity: 1,
      borderThicknessScale: 0.15,
      borderFadeOnZoom: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      wickVisible: true,
      wickOpacity: 1,
      wickThicknessScale: 0.045,
      minBodyHeight: 0,
      wickExaggeration: 0,
      barSpacingMode: "normal", // tight | normal | wide | custom
      barSpacing: 6,
      crosshairType: "cross",
      crosshairColor: "#64748b",
      crosshairLineStyle: "dashed",
      magnetMode: "ohlc", // ohlc | close | free
      showVertGrid: true,
      showHorzGrid: true,
      gridColor: "#f1f5f9",
      gridOpacity: 1,
      backgroundType: "solid",
      backgroundColor: "#ffffff",
      backgroundTopColor: "#ffffff",
      backgroundBottomColor: "#f8fafc",
      priceScaleMode: "linear",
      autoScale: true,
      lockScale: false,
      invertScale: false,
      pricePrecisionMode: "auto",
      pricePrecision: 2,
      showLastPrice: true,
      priceLineColor: "#2962FF",
      priceLineWidth: 1,
      priceLineStyle: "dashed",
      lastValueVisible: true,
    }),
    [],
  );
  // Load candle settings from localStorage on mount
  const [candleSettings, setCandleSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("chartCandleSettings");
      if (saved) {
        return { ...DEFAULT_CANDLE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to load candle settings:", e);
    }
    return DEFAULT_CANDLE_SETTINGS;
  });

  // Persist candle settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "chartCandleSettings",
        JSON.stringify(candleSettings),
      );
    } catch (e) {
      console.warn("Failed to save candle settings:", e);
    }
  }, [candleSettings]);
  const [isCandleSettingsOpen, setIsCandleSettingsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [patternsFetched, setPatternsFetched] = useState(false);
  const [announcements, setAnnouncements] = useState({
    dividends: [],
    splits: [],
    earnings: [],
  });
  const [announcementOverlays, setAnnouncementOverlays] = useState([]);
  const [hoverAnnouncement, setHoverAnnouncement] = useState(null);
  const hoverClearTimeoutRef = useRef(null);

  // --- Global Undo/Actions History ---
  // Stack of actions: [{ type: 'drawing' | 'pattern' | 'indicator', id: <timestamp/uuid> }]
  const [actionHistory, setActionHistory] = useState([]);

  // Sync Ref with State (Fix for temporal dead zone)
  useEffect(() => {
    activeIndicatorsRef.current = activeIndicators;
  }, [activeIndicators]);

  // --- Chart Controls State ---
  const [chartType, setChartType] = useState("candle"); // 'candle' | 'line'

  useEffect(() => {
    const nextType = candleSettings.candleType === "line" ? "line" : "candle";
    if (nextType !== chartType) setChartType(nextType);
  }, [candleSettings.candleType, chartType]);

  useEffect(() => {
    candleSettingsRef.current = candleSettings;
  }, [candleSettings]);

  useEffect(() => {
    magnetEnabledRef.current = magnetEnabled;
  }, [magnetEnabled]);

  const resolvePricePrecision = useCallback((settings) => {
    if (!settings) return null;
    if (settings.pricePrecisionMode !== "fixed") return null;
    const raw = Number(settings.pricePrecision);
    if (!Number.isFinite(raw)) return null;
    return Math.max(0, Math.min(8, Math.floor(raw)));
  }, []);

  const formatPriceValue = useCallback(
    (value, settings) => {
      if (value === null || value === undefined || Number.isNaN(value))
        return "—";
      const precision = resolvePricePrecision(settings);
      if (precision === null) return Number(value).toFixed(2);
      return Number(value).toFixed(precision);
    },
    [resolvePricePrecision],
  );

  const computePriceRangeForData = useCallback((rows) => {
    if (!rows || rows.length === 0) return null;
    let minValue = Number.POSITIVE_INFINITY;
    let maxValue = Number.NEGATIVE_INFINITY;
    rows.forEach((row) => {
      const high = row.high ?? row.close ?? row.value ?? row.open;
      const low = row.low ?? row.close ?? row.value ?? row.open;
      if (typeof high === "number" && high > maxValue) maxValue = high;
      if (typeof low === "number" && low < minValue) minValue = low;
    });
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return null;
    return { minValue, maxValue };
  }, []);

  const parseSplitRatio = useCallback((ratio) => {
    if (!ratio) return null;
    const text = String(ratio).toLowerCase();
    const match = text.match(/(\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const a = parseFloat(match[1]);
    const b = parseFloat(match[2]);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
    // For split A:B (e.g., 5:1), prices before the split should be divided by (A/B)
    return a / b;
  }, []);

  const adjustForSplits = useCallback(
    (rows, splits) => {
      if (!Array.isArray(rows) || rows.length === 0) return rows;
      if (!Array.isArray(splits) || splits.length === 0) return rows;
      const events = splits
        .map((s) => {
          const dateStr = s?.Ex_date || s?.Announcement_Date;
          if (!dateStr) return null;
          const ratioText =
            s?.Ratio ||
            s?.Split_Ratio ||
            s?.ratio ||
            s?.Announcement_text ||
            "";
          const ratio = parseSplitRatio(ratioText);
          if (!ratio) return null;
          return { date: dateStr.split("T")[0], ratio };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (events.length === 0) return rows;
      return rows.map((row) => {
        const rowDate = `${row.time.year}-${String(row.time.month).padStart(
          2,
          "0",
        )}-${String(row.time.day).padStart(2, "0")}`;
        let factor = 1;
        events.forEach((ev) => {
          if (rowDate < ev.date) {
            factor *= ev.ratio;
          }
        });
        if (factor === 1) return row;
        return {
          ...row,
          open: row.open / factor,
          high: row.high / factor,
          low: row.low / factor,
          close: row.close / factor,
          volume: row.volume ? row.volume * factor : row.volume,
        };
      });
    },
    [parseSplitRatio],
  );

  const computeVisiblePriceRange = useCallback(() => {
    const chart = chartRef.current;
    if (!chart || !Array.isArray(seriesDataRef.current)) return null;
    const range = chart.timeScale().getVisibleLogicalRange();
    if (!range) return null;
    const from = Math.max(0, Math.floor(range.from));
    const to = Math.min(seriesDataRef.current.length - 1, Math.ceil(range.to));
    if (to < from) return null;
    const slice = seriesDataRef.current.slice(from, to + 1);
    return computePriceRangeForData(slice);
  }, [computePriceRangeForData]);

  const toRgba = useCallback((color, alpha = 1) => {
    if (!color) return color;
    if (color.startsWith("rgba") || color.startsWith("rgb")) return color;
    if (!color.startsWith("#")) return color;
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }, []);

  const mapLineStyle = useCallback((style) => {
    if (style === "dotted") return LineStyle.Dotted;
    if (style === "dashed") return LineStyle.Dashed;
    return LineStyle.Solid;
  }, []);

  const mapPriceScaleMode = useCallback((mode) => {
    if (mode === "log") return PriceScaleMode.Logarithmic;
    if (mode === "percentage") return PriceScaleMode.Percentage;
    if (mode === "indexed") return PriceScaleMode.IndexedTo100;
    return PriceScaleMode.Normal;
  }, []);

  const resolveBarSpacing = useCallback((settings) => {
    if (!settings) return undefined;
    if (settings.barSpacingMode === "tight") return 5;
    if (settings.barSpacingMode === "wide") return 9;
    if (settings.barSpacingMode === "custom") {
      const val = Number(settings.barSpacing);
      return Number.isFinite(val) ? Math.max(2, Math.min(val, 50)) : undefined;
    }
    // keep spacing consistent (no auto)
    return 6;
  }, []);

  const buildCustomCandleOptions = useCallback((settings) => {
    return {
      candleType: settings.candleType,
      colorBy: settings.colorBy,
      upColor: settings.upColor,
      downColor: settings.downColor,
      bodyOpacity: settings.bodyOpacity,
      // Map old bodyWidthScale to new bodyWidthRatio (default 0.45 for larger gaps)
      bodyWidthRatio: settings.bodyWidthScale ?? 0.45,
      minGapPx: 1,
      borderUpColor: settings.borderUpColor,
      borderDownColor: settings.borderDownColor,
      borderVisible: settings.borderVisible,
      borderOpacity: settings.borderOpacity,
      borderWidthPx: settings.borderThicknessScale
        ? Math.max(1, Math.round(settings.borderThicknessScale * 10))
        : 1,
      wickUpColor: settings.wickUpColor,
      wickDownColor: settings.wickDownColor,
      wickVisible: settings.wickVisible,
      wickOpacity: settings.wickOpacity,
      wickWidthPx: 1,
      minBodyHeight: settings.minBodyHeight ?? 1,
    };
  }, []);

  const classifyDividend = useCallback((item) => {
    const text = `${item?.Purpose || ""} ${item?.Announcement_text || ""}`
      .toLowerCase()
      .trim();
    if (text.includes("special")) {
      return { color: "#7c3aed", label: "Special Dividend", code: "D" };
    }
    if (text.includes("interim")) {
      return { color: "#2563eb", label: "Interim Dividend", code: "D" };
    }
    if (text.includes("final")) {
      return { color: "#16a34a", label: "Final Dividend", code: "D" };
    }
    return { color: "#0f766e", label: "Dividend", code: "D" };
  }, []);

  const classifyEarning = useCallback((item) => {
    const headline = `${item?.Headline || ""}`.toLowerCase();
    if (headline.includes("board meeting outcome")) {
      return { color: "#f59e0b", label: "Board Meeting Outcome", code: "E" };
    }
    if (headline.includes("board meeting intimation")) {
      return { color: "#a855f7", label: "Board Meeting Intimation", code: "E" };
    }
    if (headline.includes("unaudited")) {
      return { color: "#0ea5e9", label: "Unaudited Results", code: "E" };
    }
    if (headline.includes("audited")) {
      return { color: "#16a34a", label: "Audited Results", code: "E" };
    }
    if (headline.includes("result")) {
      return { color: "#ef4444", label: "Results", code: "E" };
    }
    return { color: "#94a3b8", label: "Earnings", code: "E" };
  }, []);

  const buildAnnouncementItems = useCallback(() => {
    const items = [];
    const seen = new Set();
    announcements.dividends.forEach((d, idx) => {
      const exRaw = d?.Ex_date || null;
      const announceRaw = d?.Announcement_Date || null;
      const exDate = exRaw ? exRaw.split("T")[0] : null;
      const rdDate = announceRaw ? announceRaw.split("T")[0] : null;
      const amount =
        typeof d?.Dividend_Amount === "number" && d.Dividend_Amount > 0
          ? d.Dividend_Amount
          : null;
      const style = classifyDividend(d);

      if (exDate) {
        const day = toBusinessDay(exDate);
        if (day) {
          const key = `div-ex-${exDate}-${amount ?? ""}-${d?.Purpose || ""}`;
          if (!seen.has(key)) {
            seen.add(key);
            items.push({
              id: `div-ex-${idx}-${exDate}`,
              type: "dividend",
              time: day,
              color: style.color,
              bubbleText: `${style.code}${amount ? ` ${amount}` : ""}`,
              label: `${style.label} (Ex)`,
              exDate,
              rdDate,
              announcementDate: rdDate,
              purpose: d?.Purpose || "",
              amount,
              ratio: null,
              headline: null,
              pdfUrl: null,
            });
          }
        }
      }

      if (rdDate && rdDate !== exDate) {
        const day = toBusinessDay(rdDate);
        if (day) {
          const key = `div-rd-${rdDate}-${amount ?? ""}-${d?.Purpose || ""}`;
          if (!seen.has(key)) {
            seen.add(key);
            items.push({
              id: `div-rd-${idx}-${rdDate}`,
              type: "dividend",
              time: day,
              color: style.color,
              bubbleText: `${style.code}${amount ? ` ${amount}` : ""}`,
              label: `${style.label} (Announcement)`,
              exDate,
              rdDate,
              announcementDate: rdDate,
              purpose: d?.Purpose || "",
              amount,
              ratio: null,
              headline: null,
              pdfUrl: null,
            });
          }
        }
      }
    });

    announcements.splits.forEach((s, idx) => {
      const exDate = s?.Ex_date || s?.Announcement_Date;
      if (!exDate) return;
      const day = toBusinessDay(exDate.split("T")[0]);
      if (!day) return;
      const ratio = s?.Ratio ? String(s.Ratio) : "";
      const key = `split-${exDate}-${ratio}-${s?.Announcement_text || ""}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({
        id: `split-${idx}-${exDate}`,
        type: "split",
        time: day,
        color: "#f97316",
        bubbleText: `S${ratio ? ` ${ratio}` : ""}`,
        label: "Split",
        exDate: exDate.split("T")[0],
        announcementDate: s?.Announcement_Date
          ? s.Announcement_Date.split("T")[0]
          : null,
        purpose: s?.Announcement_text || "",
        amount: null,
        ratio,
        headline: null,
        pdfUrl: null,
      });
    });

    announcements.earnings.forEach((e, idx) => {
      const date = e?.Date;
      if (!date) return;
      const day = toBusinessDay(date.split("T")[0]);
      if (!day) return;
      const style = classifyEarning(e);
      const key = `earn-${date}-${e?.Headline || ""}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({
        id: `earn-${idx}-${date}`,
        type: "earnings",
        time: day,
        color: style.color,
        bubbleText: style.code,
        label: style.label,
        exDate: date.split("T")[0],
        announcementDate: e?.Date ? e.Date.split("T")[0] : null,
        purpose: null,
        amount: null,
        ratio: null,
        headline: e?.Headline || "",
        pdfUrl: e?.PDF_URL || "",
      });
    });

    return items;
  }, [announcements, classifyDividend, classifyEarning]);

  const updateAnnouncementOverlays = useCallback(() => {
    const chart = chartRef.current;
    const container = chartContainerRef.current;
    if (!chart || !container) {
      setAnnouncementOverlays([]);
      return;
    }
    const items = announcementItemsRef.current || [];
    if (!items.length) {
      setAnnouncementOverlays([]);
      return;
    }
    const sorted = [...items].sort((a, b) => {
      const aKey = `${a.time.year}-${String(a.time.month).padStart(
        2,
        "0",
      )}-${String(a.time.day).padStart(2, "0")}`;
      const bKey = `${b.time.year}-${String(b.time.month).padStart(
        2,
        "0",
      )}-${String(b.time.day).padStart(2, "0")}`;
      return aKey.localeCompare(bKey);
    });
    const width = container.clientWidth;
    const baseBottom = 10;
    const stackGap = 18;
    const stackCounts = {};
    const overlays = [];

    sorted.forEach((item) => {
      const x = chart.timeScale().timeToCoordinate(item.time);
      if (x === null || x === undefined) return;
      if (x < -40 || x > width + 40) return;
      const key = `${item.time.year}-${item.time.month}-${item.time.day}`;
      const stackIndex = stackCounts[key] || 0;
      stackCounts[key] = stackIndex + 1;
      const clampedX = Math.max(8, Math.min(width - 8, x));
      overlays.push({
        ...item,
        x: clampedX,
        bottom: baseBottom + stackIndex * stackGap,
        stackIndex,
      });
    });

    setAnnouncementOverlays(overlays);
  }, []);

  const cancelHoverClear = useCallback(() => {
    if (hoverClearTimeoutRef.current) {
      clearTimeout(hoverClearTimeoutRef.current);
      hoverClearTimeoutRef.current = null;
    }
  }, []);

  const scheduleHoverClear = useCallback(() => {
    cancelHoverClear();
    hoverClearTimeoutRef.current = setTimeout(() => {
      setHoverAnnouncement(null);
    }, 150);
  }, [cancelHoverClear]);

  useEffect(() => {
    announcementItemsRef.current = buildAnnouncementItems();
    updateAnnouncementOverlays();
  }, [buildAnnouncementItems, updateAnnouncementOverlays]);

  useEffect(() => {
    updateAnnouncementOverlaysRef.current = updateAnnouncementOverlays;
  }, [updateAnnouncementOverlays]);

  useEffect(() => {
    if (!hoverAnnouncement) return;
    const stillVisible = announcementOverlays.find(
      (item) => item.id === hoverAnnouncement.id,
    );
    if (!stillVisible) setHoverAnnouncement(null);
  }, [announcementOverlays, hoverAnnouncement]);

  useEffect(() => {
    return () => {
      if (hoverClearTimeoutRef.current) {
        clearTimeout(hoverClearTimeoutRef.current);
        hoverClearTimeoutRef.current = null;
      }
    };
  }, []);

  const updateCandleSetting = useCallback((key, value) => {
    setCandleSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const buildHeikinAshi = useCallback((sourceData) => {
    if (!Array.isArray(sourceData) || sourceData.length === 0) return [];
    const result = [];
    let prevHaOpen = null;
    let prevHaClose = null;

    sourceData.forEach((bar, idx) => {
      const haClose = (bar.open + bar.high + bar.low + bar.close) / 4;
      const haOpen =
        idx === 0 ? (bar.open + bar.close) / 2 : (prevHaOpen + prevHaClose) / 2;
      const haHigh = Math.max(bar.high, haOpen, haClose);
      const haLow = Math.min(bar.low, haOpen, haClose);

      prevHaOpen = haOpen;
      prevHaClose = haClose;

      result.push({
        ...bar,
        open: haOpen,
        high: haHigh,
        low: haLow,
        close: haClose,
      });
    });

    return result;
  }, []);
  const [activeInterval, setActiveInterval] = useState("1D"); // Default interval

  // --- Radial Menu State ---
  const [isRadialOpen, setIsRadialOpen] = useState(false);
  const [radialPosition, setRadialPosition] = useState({ x: 0, y: 0 });
  // Icon mapping for hydration
  const ICON_MAP = {
    TrendingUp,
    Box,
    Activity,
    Type,
    X,

    CandlestickChart,
    BarChart3,
    Layers,
    PenTool,
    Eraser,
    Maximize2,
    Minimize2,
    Move,
    Ruler,
    Star,
    GripVertical,
    Check,
    GitBranch,
    Minus,
    Circle,
    Square,
    Grid3X3,
    Target,
    Waves,
    TriangleRight,
    MousePointer,

    Zap,
    // Add missing ones if needed, e.g. Zap/BarChart2 if imported, else fallback
  };

  // Load favorites from local storage or use defaults
  const [favorites, setFavorites] = useState(() => {
    const defaults = [
      {
        id: "tool-line",
        type: "tool",
        payload: "line",
        label: "Trend Line",
        iconName: "TrendingUp",
        icon: TrendingUp,
      },
      {
        id: "tool-horizontal",
        type: "tool",
        payload: "horizontalLine",
        label: "Horz Line",
        iconName: "Minus",
        icon: Minus,
      },
      {
        id: "tool-fib",
        type: "tool",
        payload: "fibRetracement",
        label: "Fib Retrace",
        iconName: "GitBranch",
        icon: GitBranch,
      },
      {
        id: "tool-text",
        type: "tool",
        payload: "text",
        label: "Text",
        iconName: "Type",
        icon: Type,
      },
      {
        id: "ind-ema20",
        type: "indicator",
        payload: { id: "EMA", params: { period: 20 }, color: "#2962FF" },
        label: "EMA 20",
        iconName: "Activity",
        icon: Activity,
      },
      {
        id: "ind-rsi",
        type: "indicator",
        payload: { id: "RSI", params: { period: 14 }, color: "#7c3aed" },
        label: "RSI",
        iconName: "Activity",
        icon: Activity,
      },
      {
        id: "tool-eraser",
        type: "tool",
        payload: "eraser",
        label: "Eraser",
        iconName: "X",
        icon: X,
      },
      {
        id: "tool-cursor",
        type: "tool",
        payload: null,
        label: "Cursor",
        iconName: "MousePointer",
        icon: MousePointer,
      },
    ];

    try {
      const saved = localStorage.getItem("chartFavorites");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Re-hydrate and AUTO-REPAIR icons
          // Re-hydrate and AUTO-REPAIR icons
          return parsed.map((f) => {
            let Icon = ICON_MAP[f.iconName] || Activity;

            // Unify IDs for checking
            const pid = String(f.payload || "").toLowerCase();
            const fid = String(f.id || "").toLowerCase();
            const type = f.type;

            // 1. Force Cursor Fix
            if (fid === "tool-cursor" || pid === "null") {
              // 'null' string check for legacy payload
              Icon = MousePointer;
            }
            // 2. Fix Patterns
            else if (type === "pattern") {
              const pData = PatternRegistry.getPattern(f.payload || "");
              if (pData) {
                f.subtitle = pData.shortName;
                f.bias = pData.bias;
              }
              if (pid.includes("elliott")) Icon = Waves;
              else Icon = CandlestickChart;
            }
            // 3. Fix Indicators
            else if (type === "indicator") {
              const pName = (f.payload?.id || f.label || "").toUpperCase();
              f.subtitle = pName.substring(0, 2);

              if (
                ["EMA", "SMA", "WMA", "TMA", "LINEARREG"].some((k) =>
                  pName.includes(k),
                )
              )
                Icon = TrendingUp;
              else if (
                ["RSI", "CCI", "STOCH", "ADX", "MFI"].some((k) =>
                  pName.includes(k),
                )
              )
                Icon = Activity;
              else if (["BB", "ATR", "STDDEV"].some((k) => pName.includes(k)))
                Icon = Zap;
              else if (["VOL", "OBV"].some((k) => pName.includes(k)))
                Icon = BarChart3;
              // Default indicator icon logic already handled by initial hydration or fallback
            }
            // 4. Fix Tools (Legacy IDs)
            else if (type === "tool") {
              if (pid.includes("fib") || fid.includes("fib")) Icon = GitBranch;
              else if (pid.includes("horizontal") || pid.includes("vertical"))
                Icon = Minus;
              else if (pid.includes("text")) Icon = Type;
              else if (pid.includes("eraser")) Icon = Eraser;
              else if (pid.includes("gann")) Icon = Grid3X3;
              else if (pid.includes("line")) Icon = TrendingUp;
            }

            return {
              ...f,
              icon: Icon,
            };
          });
        }
      }
    } catch (e) {
      console.warn("Failed to load favorites", e);
    }
    return defaults;
  });

  // Save favorites to local storage (strip icons)
  useEffect(() => {
    try {
      const toSave = favorites.map(({ icon, ...rest }) => rest);
      localStorage.setItem("chartFavorites", JSON.stringify(toSave));
    } catch (e) {
      console.warn("Failed to save favorites", e);
    }
  }, [favorites]);

  /* -------------------------------------------------
     Drawings Persistence (Per Stock)
  ------------------------------------------------- */
  useEffect(() => {
    if (!company?.fincode) return;
    const key = `chartDrawings_${company.fincode}`;

    // Load
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setDrawings(JSON.parse(saved));
      } else {
        setDrawings([]);
      }
    } catch (e) {
      console.warn("Failed to load drawings", e);
      setDrawings([]);
    }
  }, [company?.fincode]);

  useEffect(() => {
    if (!company?.fincode) return;
    const key = `chartDrawings_${company.fincode}`;
    localStorage.setItem(key, JSON.stringify(drawings));
  }, [drawings, company?.fincode]);

  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);

  /* -------------------------------------------------
     Fullscreen Event Listener (Sync State)
  ------------------------------------------------- */
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = document.fullscreenElement === chartWrapperRef.current;
      setIsFullScreen(isFull);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = async () => {
    if (!chartWrapperRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await chartWrapperRef.current.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen not supported or denied:", err);
      }
    } else {
      await document.exitFullscreen();
    }
  };

  /* -------------------------------------------------
     Favorites Management
  ------------------------------------------------- */
  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      }
      return [...prev, item];
    });
  };

  /* -------------------------------------------------
     Global Undo
  ------------------------------------------------- */
  const addToHistory = (type, id = Date.now()) => {
    setActionHistory((prev) => [...prev, { type, id }]);
  };

  const handleGlobalUndo = () => {
    if (actionHistory.length === 0) return;

    const lastAction = actionHistory[actionHistory.length - 1];
    const newHistory = actionHistory.slice(0, -1);
    setActionHistory(newHistory);

    if (lastAction.type === "drawing") {
      setDrawings((prev) => {
        if (prev.length === 0) return prev;
        return prev.slice(0, -1);
      });
    } else if (lastAction.type === "pattern") {
      setActivePatternIds((prev) => {
        if (prev.length === 0) return prev;
        return prev.slice(0, -1); // Removes last added pattern ID
      });
    }
    // Future: Undo indicators?
  };

  /* -------------------------------------------------
     Sync refs
  ------------------------------------------------- */
  useEffect(() => {
    dataRef.current = data;
    patternsRef.current = patterns;
    activePatternIdsRef.current = activePatternIds;
  }, [data, patterns, activePatternIds]);

  /* -------------------------------------------------
     Fullscreen scroll lock
  ------------------------------------------------- */
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullScreen]);

  /* -------------------------------------------------
     Fetch corporate announcements
  ------------------------------------------------- */
  useEffect(() => {
    let active = true;
    const fetchAnnouncements = async () => {
      if (!company?.fincode) return;
      try {
        const result = await equityInsightsApi.getCorporateAnnouncements(
          company.fincode,
        );
        const payload =
          result && typeof result === "object"
            ? result.data && typeof result.data === "object"
              ? result.data
              : result
            : null;
        if (!active) return;
        setAnnouncements({
          dividends: payload?.dividends || [],
          splits: payload?.splits || [],
          earnings: payload?.earnings || [],
        });
      } catch (error) {
        if (!active) return;
        console.error("Failed to load announcements:", error);
        setAnnouncements({ dividends: [], splits: [], earnings: [] });
      }
    };
    fetchAnnouncements();
    return () => {
      active = false;
    };
  }, [company?.fincode]);

  useEffect(() => {
    if (!rawDataRef.current.length) return;
    if (!announcements.splits || announcements.splits.length === 0) return;
    const adjusted = adjustForSplits(rawDataRef.current, announcements.splits);
    setData(adjusted);
  }, [announcements.splits, adjustForSplits]);

  /* -------------------------------------------------
     Fetch price data
  ------------------------------------------------- */
  const fetchData = useCallback(
    async (start, end, isInitial = false, isBackground = false) => {
      if (!company?.fincode || isFetching || (isFullyLoaded && !isInitial))
        return;
      setIsFetching(true);
      if (!isBackground) setIsLoading(true);

      try {
        // Use centralized API service
        const result = await equityInsightsApi.getPriceActionHistory(
          company.fincode,
          start,
          end,
        );

        const pd = result.price_data;
        const rows = [];

        for (let i = 0; i < pd.Date.length; i++) {
          rows.push({
            time: toBusinessDay(pd.Date[i]),
            open: Number(pd.Open[i]),
            high: Number(pd.High[i]),
            low: Number(pd.Low[i]),
            close: Number(pd.Close[i]),
            volume: Number(pd.TotalTradedQty?.[i] ?? 0),
          });
        }

        rows.sort((a, b) => {
          const da = new Date(`${a.time.year}-${a.time.month}-${a.time.day}`);
          const db = new Date(`${b.time.year}-${b.time.month}-${b.time.day}`);
          return da - db;
        });

        rawDataRef.current = rows;
        const adjustedRows = adjustForSplits(rows, announcements.splits);

        if (isInitial) {
          setData(adjustedRows);
          if (adjustedRows.length > 0) {
            const oldest = adjustedRows[0].time;
            setStartDate(
              `${oldest.year}-${String(oldest.month).padStart(2, "0")}-${String(oldest.day).padStart(2, "0")}`,
            );
          }
          setHasInitialLoaded(true);
        } else {
          setData((prev) => {
            const combined = [...adjustedRows, ...prev];
            const map = new Map();
            combined.forEach((item) => {
              const key = `${item.time.year}-${item.time.month}-${item.time.day}`;
              map.set(key, item);
            });
            return Array.from(map.values()).sort((a, b) => {
              const da = new Date(
                `${a.time.year}-${a.time.month}-${a.time.day}`,
              );
              const db = new Date(
                `${b.time.year}-${b.time.month}-${b.time.day}`,
              );
              return da - db;
            });
          });
        }

        if (rows.length === 0) {
          setIsFullyLoaded(true);
        }

        if (result.oldest_available_date) {
          // Assuming setOldestAvailableDate is defined elsewhere or needs to be added
          // setOldestAvailableDate(result.oldest_available_date);
        }

        setStartDate(start);
        setHasInitialLoaded(true);
      } catch (err) {
        console.error("Error fetching candlestick data:", err);
      } finally {
        // CRITICAL FIX: Always set loading/fetching to false
        setIsFetching(false);
        setIsLoading(false);
      }
    },
    [
      company?.fincode,
      isFetching,
      isFullyLoaded,
      announcements.splits,
      adjustForSplits,
    ], // CRITICAL FIX: Removed fetchData from dependencies to prevent infinite loop
  );

  /* -------------------------------------------------
     Initial load & reset
  ------------------------------------------------- */

  const undoLastDrawing = () => {
    setDrawings((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setRadialPosition({ x: e.clientX, y: e.clientY });
    setIsRadialOpen(true);
  };

  const handleRadialSelect = (item) => {
    if (item.type === "tool") {
      setActiveTool(item.payload);
      toast.success(`Selected Tool: ${item.label}`);
    } else if (item.type === "indicator") {
      setActiveIndicators((prev) => {
        const exists = prev.find((i) => i.id === item.payload.id);
        if (exists) {
          toast.success(`Removed Indicator: ${item.label}`);
          return prev.filter((i) => i.id !== item.payload.id);
        }
        // Add new
        const newInd = {
          ...item.payload,
          uuid: crypto.randomUUID(),
          name: item.payload.id,
        };
        toast.success(`Added Indicator: ${item.label}`);
        return [...prev, newInd];
      });
    } else if (item.type === "pattern") {
      setActivePatternIds((prev) => {
        // Toggle pattern
        const exists = prev.includes(item.payload);
        if (exists) {
          toast.success(`Removed Pattern: ${item.label}`);
          // Should we add history for removal? Maybe not, undo should revert addition.
          // Usually undo is for destructive actions or additions.
          return prev.filter((id) => id !== item.payload);
        } else {
          toast.success(`Added Pattern: ${item.label}`);
          addToHistory("pattern"); // Add history for undo
          return [...prev, item.payload];
        }
      });
    }
  };
  useEffect(() => {
    if (!company?.fincode) {
      setData([]);
      setPatterns([]);
      setDrawings([]);
      setActiveIndicators([]);
      return;
    }

    setData([]);
    setPatterns([]);
    // drawings managed by persistence effect now
    // setDrawings([]);
    setActiveTool(null);
    setActiveIndicators([]);
    setIsFullyLoaded(false);
    setActionHistory([]); // Reset undo history on symbol switch
    setStartDate(null);
    setHasInitialLoaded(false);
    isFitRef.current = false;

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    fetchData(formatDate(oneYearAgo), formatDate(today), true);
  }, [company?.fincode]); // CRITICAL FIX: Removed fetchData from dependencies to prevent infinite loop

  /* -------------------------------------------------
     Fetch patterns when menu opens
  ------------------------------------------------- */
  useEffect(() => {
    if (!isPatternMenuOpen || !company?.fincode || patternsFetched) return;

    const fetchPatterns = async () => {
      try {
        // Use centralized API service
        const result = await equityInsightsApi.getMicroPatterns(
          company.fincode,
        );

        const pd = result;
        const transformed = [];
        for (let i = 0; i < (pd.Pattern_ID?.length || 0); i++) {
          const date = pd.endDate?.[i] || pd.startDate?.[i];
          if (date) {
            transformed.push({
              patternId: pd.Pattern_ID[i],
              date: date.split("T")[0],
              score: pd.final_confidence?.[i] || 0,
            });
          }
        }
        setPatterns(transformed);
        setPatternsFetched(true);
      } catch (err) {
        console.error("Failed to fetch patterns:", err);
        setPatterns([]);
        setPatternsFetched(true);
      }
    };

    fetchPatterns();
  }, [isPatternMenuOpen, company?.fincode, patternsFetched]);

  // --- Range Selection Handler ---
  const handleRangeSelect = (range) => {
    setActiveRange(range);

    // Calculate start date based on range
    const today = new Date();
    let startDate = new Date();

    switch (range) {
      case "1W":
        startDate.setDate(today.getDate() - 7);
        break;
      case "1M":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "6M":
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "12M":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setFullYear(today.getFullYear() - 1); // Default
    }

    fetchData(formatDate(startDate), formatDate(today), true);
  };

  useEffect(() => {
    setPatternsFetched(false);
    setPatterns([]);
  }, [company?.fincode]);

  /* -------------------------------------------------
     Pattern highlight drawing on canvas
  ------------------------------------------------- */
  const drawHighlights = useCallback(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    const canvas = canvasRef.current;
    const container = chartContainerRef.current;

    if (!chart || !series || !canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const height = container.clientHeight;
    const targetWidth = container.clientWidth * dpr;
    const targetHeight = height * dpr;

    // Optimization: Only resize if dimensions changed to prevent stutter
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${height}px`;
    }

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.lineCap = "square";
    ctx.clearRect(0, 0, container.clientWidth, height);

    const timeScale = chart.timeScale();
    const barSpacing = timeScale.options().barSpacing;
    const PADDING = 4;
    const BORDER_RADIUS = 4;

    const leftPriceScaleWidth = chart.priceScale("left").width();
    const rightPriceScaleWidth = chart.priceScale("right").width();
    const chartAreaLeft = leftPriceScaleWidth;
    const chartAreaRight = container.clientWidth - rightPriceScaleWidth;
    const chartAreaWidth = chartAreaRight - chartAreaLeft;

    ctx.save();
    ctx.beginPath();
    ctx.rect(chartAreaLeft, 0, chartAreaWidth, height);
    ctx.clip();

    const currentPatterns = patternsRef.current;
    const currentData = dataRef.current;
    const currentActiveIds = activePatternIdsRef.current;

    currentPatterns.forEach((p) => {
      if (!currentActiveIds.includes(p.patternId)) return;

      const meta = PatternRegistry.getPattern(p.patternId);
      const bias = meta?.bias || "neutral";
      const colorMap = {
        bullish: { fill: "rgba(16, 185, 129, 0.2)", stroke: "#10b981" },
        bearish: { fill: "rgba(239, 68, 68, 0.2)", stroke: "#ef4444" },
        neutral: { fill: "rgba(139, 92, 246, 0.2)", stroke: "#8b5cf6" },
      };
      const style = colorMap[bias] || colorMap.neutral;

      const xCoord = timeScale.timeToCoordinate(toBusinessDay(p.date));
      if (xCoord === null) return;
      const x = Math.round(xCoord + leftPriceScaleWidth);

      const candleIndex = currentData.findIndex(
        (d) =>
          `${d.time.year}-${String(d.time.month).padStart(2, "0")}-${String(d.time.day).padStart(2, "0")}` ===
          p.date,
      );
      if (candleIndex === -1) return;
      const candle = currentData[candleIndex];

      const highY = series.priceToCoordinate(candle.high);
      const lowY = series.priceToCoordinate(candle.low);
      if (highY === null || lowY === null) return;

      const candleWidth = Math.max(3, Math.round(barSpacing * 0.8));
      const rectX = x - candleWidth / 2 - PADDING;
      const rectY = highY - PADDING;
      const rectW = candleWidth + PADDING * 2;
      const rectH = lowY - highY + PADDING * 2;

      ctx.fillStyle = style.fill;
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(rectX, rectY, rectW, rectH, BORDER_RADIUS);
      ctx.fill();
      ctx.stroke();

      // Label badge
      const labelText = meta?.shortName || "PAT";
      const badgeY = rectY - 18;
      ctx.fillStyle = style.stroke;
      ctx.font = "bold 10px sans-serif";
      const tm = ctx.measureText(labelText);
      const badgeW = tm.width + 8;
      const badgeX = x - badgeW / 2;

      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, 14, 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, x, badgeY + 7);
    });

    ctx.restore();
  }, []);

  /* -------------------------------------------------
     Chart initialization
  ------------------------------------------------- */
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    container.innerHTML = "";
    const initialSettings = candleSettingsRef.current || candleSettings;
    const initialChartType =
      initialSettings.candleType === "line" ? "line" : "candle";
    const initialMagnet =
      magnetEnabledRef.current !== null
        ? magnetEnabledRef.current
        : magnetEnabled;
    const gridColor = toRgba(
      initialSettings.gridColor,
      initialSettings.gridOpacity,
    );
    const crosshairMode =
      initialMagnet && initialSettings.magnetMode !== "free"
        ? CrosshairMode.Magnet
        : CrosshairMode.Normal;
    const barSpacing = resolveBarSpacing(initialSettings);
    const crosshairVertVisible =
      initialSettings.crosshairType === "cross" ||
      initialSettings.crosshairType === "vertical";
    const crosshairHorzVisible =
      initialSettings.crosshairType === "cross" ||
      initialSettings.crosshairType === "horizontal";
    const background = {
      type: ColorType.Solid,
      color: initialSettings.backgroundColor,
    };

    const chart = createChart(container, {
      width: container.clientWidth,
      height: isFullScreen ? window.innerHeight : 500, // Dynamic height on init
      autoSize: true,
      layout: {
        background,
        textColor: "#334155",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        attributionLogo: false,
      },
      grid: {
        vertLines: {
          color: gridColor,
          visible: initialSettings.showVertGrid !== false,
        },
        horzLines: {
          color: gridColor,
          visible: initialSettings.showHorzGrid !== false,
        },
      },
      rightPriceScale: {
        borderColor: "#e2e8f0",
        scaleMargins: { top: 0.1, bottom: 0.1 },
        mode: mapPriceScaleMode(initialSettings.priceScaleMode),
        autoScale: initialSettings.lockScale
          ? false
          : initialSettings.autoScale !== false,
        invertScale: initialSettings.invertScale === true,
      },
      leftPriceScale: { visible: true, borderColor: "#e2e8f0" },
      timeScale: {
        borderColor: "#e2e8f0",
        timeVisible: true,
        minBarSpacing: 1,
        ...(typeof barSpacing === "number" ? { barSpacing } : {}),
      },
      kineticScroll: {
        touch: true,
        mouse: true,
      },
      crosshair: {
        mode: crosshairMode,
        vertLine: {
          visible: crosshairVertVisible,
          color: initialSettings.crosshairColor,
          style: mapLineStyle(initialSettings.crosshairLineStyle),
          width: 1,
        },
        horzLine: {
          visible: crosshairHorzVisible,
          color: initialSettings.crosshairColor,
          style: mapLineStyle(initialSettings.crosshairLineStyle),
          width: 1,
        },
      },
    });

    chartRef.current = chart;

    // Overlay canvas for patterns
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "10";
    container.appendChild(canvas);
    canvasRef.current = canvas;

    setChartReady(true);

    const handleChange = () => {
      const range = chart.timeScale().getVisibleLogicalRange();
      if (range) savedLogicalRange.current = range;
      requestAnimationFrame(drawHighlights);
      updateAnnouncementOverlaysRef.current();
    };
    // Initialize Main Series
    const series =
      initialChartType === "line"
        ? chart.addSeries(AreaSeries, {
            lineColor: "#2962FF",
            topColor: "rgba(41, 98, 255, 0.3)",
            bottomColor: "rgba(41, 98, 255, 0)",
            lineWidth: 2,
            crosshairMarkerVisible:
              initialSettings.crosshairType === "dot" ||
              initialSettings.crosshairType === "cross",
            lastValueVisible: initialSettings.showLastPrice,
            priceLineVisible: initialSettings.showLastPrice,
            priceLineColor: initialSettings.priceLineColor,
            priceLineWidth: initialSettings.priceLineWidth,
            priceLineStyle: mapLineStyle(initialSettings.priceLineStyle),
          })
        : chart.addCustomSeries(
            new CustomCandleSeries(),
            {
              ...buildCustomCandleOptions(initialSettings),
              crosshairMarkerVisible:
                initialSettings.crosshairType === "dot" ||
                initialSettings.crosshairType === "cross",
              lastValueVisible: initialSettings.lastValueVisible,
              priceLineVisible: initialSettings.showLastPrice,
              priceLineColor: initialSettings.priceLineColor,
              priceLineWidth: initialSettings.priceLineWidth,
              priceLineStyle: mapLineStyle(initialSettings.priceLineStyle),
            },
            0,
          );
    seriesRef.current = series;
    currentSeriesTypeRef.current = initialChartType;
    // Dedicated series for markers (announcements) to ensure setMarkers exists
    let markerSeries = null;
    if (
      typeof chart.addSeries === "function" &&
      typeof LineSeries !== "undefined"
    ) {
      markerSeries = chart.addSeries(LineSeries, {
        color: "transparent",
        lineWidth: 0,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        priceScaleId: "right",
      });
    } else if (typeof chart.addLineSeries === "function") {
      markerSeries = chart.addLineSeries({
        color: "transparent",
        lineWidth: 0,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        priceScaleId: "right",
      });
    }
    markerSeriesRef.current = markerSeries || null;
    markerPrimitiveRef.current = null;
    if (markerSeries && typeof createSeriesMarkers === "function") {
      const primitive = createSeriesMarkers(markerSeries);
      markerPrimitiveRef.current = primitive;
      if (pendingMarkersRef.current) {
        primitive.setMarkers(pendingMarkersRef.current);
      }
    } else if (markerSeries && typeof markerSeries.setMarkers === "function") {
      if (pendingMarkersRef.current) {
        markerSeries.setMarkers(pendingMarkersRef.current);
      }
    }

    // Crosshair Handler (OHLC + Indicators)
    chart.subscribeCrosshairMove((param) => {
      if (
        !param.time ||
        !param.point ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
      ) {
        setCurrentOHLC(null);
        setIndicatorValues({});
        return;
      }

      // 1. Set OHLC
      const ohlc = param.seriesData.get(seriesRef.current);
      if (ohlc) setCurrentOHLC(ohlc);

      // 2. Set Indicator Values
      const newIndValues = {};
      const visibleInds = activeIndicatorsRef.current;

      visibleInds.forEach((ind) => {
        const sObj = indicatorSeriesRef.current[ind.uuid];
        if (!sObj) return;

        if (Array.isArray(sObj)) {
          newIndValues[ind.uuid] = sObj.map((s) => {
            const v = param.seriesData.get(s);
            // Handle histogram/line value structure
            return v?.value !== undefined ? v.value : v?.close;
          });
        } else {
          const v = param.seriesData.get(sObj);
          newIndValues[ind.uuid] = v?.value !== undefined ? v.value : v?.close;
        }
      });

      setIndicatorValues(newIndValues);
    });

    chart.timeScale().subscribeVisibleLogicalRangeChange(handleChange);

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
      requestAnimationFrame(drawHighlights);
      updateAnnouncementOverlaysRef.current();
    });
    resizeObserver.observe(container);

    // Removed initial fitContent here; handled in Data Effect
    // if (!isFitRef.current) {
    //   chart.timeScale().fitContent();
    //   isFitRef.current = true;
    // }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (chart) {
        const range = chart.timeScale().getVisibleLogicalRange();
        if (range) savedLogicalRange.current = range;

        chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleChange);
        chart.remove();
      }
      if (canvas) canvas.remove();
    };
  }, [company?.fincode, drawHighlights]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !seriesRef.current) return;
    const nextType = chartType;
    if (nextType === currentSeriesTypeRef.current) return;

    const currentRange = chart.timeScale().getVisibleLogicalRange();
    const storedRange = currentRange || savedLogicalRange.current;
    if (storedRange) savedLogicalRange.current = storedRange;
    const prevSeries = seriesRef.current;
    if (typeof chart.removeSeries === "function") {
      chart.removeSeries(prevSeries);
    }

    const baseOptions = {
      lastValueVisible: candleSettings.lastValueVisible,
      priceLineVisible: candleSettings.showLastPrice,
      priceLineColor: candleSettings.priceLineColor,
      priceLineWidth: candleSettings.priceLineWidth,
      priceLineStyle: mapLineStyle(candleSettings.priceLineStyle),
      crosshairMarkerVisible:
        candleSettings.crosshairType === "dot" ||
        candleSettings.crosshairType === "cross",
    };

    const precision = resolvePricePrecision(candleSettings);
    const priceFormat =
      precision !== null
        ? {
            type: "price",
            precision,
            minMove: Math.pow(10, -precision),
          }
        : undefined;

    let nextSeries;
    if (nextType === "line") {
      nextSeries = chart.addSeries(AreaSeries, {
        lineColor: "#2962FF",
        topColor: "rgba(41, 98, 255, 0.3)",
        bottomColor: "rgba(41, 98, 255, 0)",
        lineWidth: 2,
        ...baseOptions,
        ...(priceFormat ? { priceFormat } : {}),
      });
      const lineData = (
        Array.isArray(seriesDataRef.current) ? seriesDataRef.current : []
      ).map((d) => ({
        time: d.time,
        value: d.close ?? d.value ?? d.open ?? d.high ?? d.low,
      }));
      nextSeries.setData(lineData);
    } else {
      nextSeries = chart.addCustomSeries(
        new CustomCandleSeries(),
        {
          ...buildCustomCandleOptions(candleSettings),
          ...baseOptions,
          ...(priceFormat ? { priceFormat } : {}),
        },
        0,
      );
      const candleData =
        candleSettings.candleType === "heikinAshi"
          ? buildHeikinAshi(
              Array.isArray(seriesDataRef.current) ? seriesDataRef.current : [],
            )
          : Array.isArray(seriesDataRef.current)
            ? seriesDataRef.current
            : [];
      nextSeries.setData(candleData);
    }

    seriesRef.current = nextSeries;
    currentSeriesTypeRef.current = nextType;

    if (storedRange) {
      chart.timeScale().setVisibleLogicalRange(storedRange);
    }
  }, [
    chartType,
    candleSettings,
    resolvePricePrecision,
    buildCustomCandleOptions,
    buildHeikinAshi,
  ]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    const currentRange = chart.timeScale().getVisibleLogicalRange();
    const gridColor = toRgba(
      candleSettings.gridColor,
      candleSettings.gridOpacity,
    );
    const crosshairMode =
      magnetEnabled && candleSettings.magnetMode !== "free"
        ? CrosshairMode.Magnet
        : CrosshairMode.Normal;
    const crosshairVertVisible =
      candleSettings.crosshairType === "cross" ||
      candleSettings.crosshairType === "vertical";
    const crosshairHorzVisible =
      candleSettings.crosshairType === "cross" ||
      candleSettings.crosshairType === "horizontal";
    const background = {
      type: ColorType.Solid,
      color: candleSettings.backgroundColor,
    };
    const barSpacing = resolveBarSpacing(candleSettings);

    chart.applyOptions({
      layout: {
        background,
      },
      grid: {
        vertLines: {
          color: gridColor,
          visible: candleSettings.showVertGrid !== false,
        },
        horzLines: {
          color: gridColor,
          visible: candleSettings.showHorzGrid !== false,
        },
      },
      crosshair: {
        mode: crosshairMode,
        vertLine: {
          visible: crosshairVertVisible,
          color: candleSettings.crosshairColor,
          style: mapLineStyle(candleSettings.crosshairLineStyle),
          width: 1,
        },
        horzLine: {
          visible: crosshairHorzVisible,
          color: candleSettings.crosshairColor,
          style: mapLineStyle(candleSettings.crosshairLineStyle),
          width: 1,
        },
      },
    });
    chart
      .timeScale()
      .applyOptions(
        typeof barSpacing === "number"
          ? { barSpacing, timeVisible: true }
          : { timeVisible: true },
      );

    chart.priceScale("right").applyOptions({
      mode: mapPriceScaleMode(candleSettings.priceScaleMode),
      autoScale: candleSettings.lockScale
        ? false
        : candleSettings.autoScale !== false,
      invertScale: candleSettings.invertScale === true,
    });

    if (currentRange) {
      chart.timeScale().setVisibleLogicalRange(currentRange);
    }

    if (candleSettings.lockScale) {
      const nextRange =
        lockedPriceRangeRef.current || computeVisiblePriceRange();
      if (nextRange) lockedPriceRangeRef.current = nextRange;
    } else {
      lockedPriceRangeRef.current = null;
    }

    if (seriesRef.current) {
      const baseOptions = {
        lastValueVisible: candleSettings.lastValueVisible,
        priceLineVisible: candleSettings.showLastPrice,
        priceLineColor: candleSettings.priceLineColor,
        priceLineWidth: candleSettings.priceLineWidth,
        priceLineStyle: mapLineStyle(candleSettings.priceLineStyle),
      };
      const precision = resolvePricePrecision(candleSettings);
      const priceFormat =
        precision !== null
          ? {
              type: "price",
              precision,
              minMove: Math.pow(10, -precision),
            }
          : undefined;
      const crosshairMarkerVisible =
        candleSettings.crosshairType === "dot" ||
        candleSettings.crosshairType === "cross";
      const autoscaleInfoProvider = () => {
        if (candleSettings.lockScale && lockedPriceRangeRef.current) {
          return { priceRange: lockedPriceRangeRef.current };
        }
        return null;
      };
      if (chartType === "line") {
        seriesRef.current.applyOptions({
          ...baseOptions,
          crosshairMarkerVisible,
          autoscaleInfoProvider,
          ...(priceFormat ? { priceFormat } : {}),
        });
      } else {
        seriesRef.current.applyOptions({
          ...baseOptions,
          ...buildCustomCandleOptions(candleSettings),
          crosshairMarkerVisible,
          autoscaleInfoProvider,
          ...(priceFormat ? { priceFormat } : {}),
        });
      }
    }
  }, [
    candleSettings,
    magnetEnabled,
    chartType,
    resolvePricePrecision,
    computeVisiblePriceRange,
    toRgba,
    mapLineStyle,
    mapPriceScaleMode,
    buildCustomCandleOptions,
    resolveBarSpacing,
  ]);

  /* -------------------------------------------------
     Update candles & redraw highlights
  ------------------------------------------------- */
  /* -------------------------------------------------
     Aggregation Logic
     ------------------------------------------------- */
  const aggregatedData = useMemo(() => {
    return aggregateData(data, activeInterval);
  }, [data, activeInterval]);

  /* -------------------------------------------------
     Update candles with Aggregated Data
  ------------------------------------------------- */
  useEffect(() => {
    if (seriesRef.current && aggregatedData.length > 0) {
      // 1. DEDUPLICATE DATA (Critical Fix for HDFCBANK Assertion Failure)
      const uniqueData = [];
      const seenTimes = new Set();

      for (const item of aggregatedData) {
        let tKey;
        // Handle both BusinessDay objects and Timestamps
        if (typeof item.time === "object" && item.time !== null) {
          tKey = `${item.time.year}-${item.time.month}-${item.time.day}`;
        } else {
          tKey = item.time;
        }

        if (!seenTimes.has(tKey)) {
          seenTimes.add(tKey);
          uniqueData.push(item);
        }
      }

      // 2. Set Data
      if (chartType === "line") {
        const lineData = uniqueData.map((d) => ({
          time: d.time,
          value: d.close,
        }));
        seriesRef.current.setData(lineData);
        seriesDataRef.current = lineData;
        if (markerSeriesRef.current?.setData) {
          markerSeriesRef.current.setData(lineData);
        }
      } else {
        const candleData =
          candleSettings.candleType === "heikinAshi"
            ? buildHeikinAshi(uniqueData)
            : uniqueData;
        seriesRef.current.setData(candleData);
        seriesDataRef.current = candleData;
        if (markerSeriesRef.current?.setData) {
          const markerData = candleData.map((d) => ({
            time: d.time,
            value: d.close ?? d.value ?? d.open ?? d.high ?? d.low,
          }));
          markerSeriesRef.current.setData(markerData);
        }
      }

      if (candleSettings.lockScale && seriesRef.current) {
        const nextRange =
          lockedPriceRangeRef.current ||
          computePriceRangeForData(seriesDataRef.current);
        if (nextRange) {
          lockedPriceRangeRef.current = nextRange;
          seriesRef.current.applyOptions({
            autoscaleInfoProvider: () => ({ priceRange: nextRange }),
          });
        }
      }

      // 3. Seamless Switching & Auto-Fit Logic
      if (prevFincode.current !== (company?.fincode || null)) {
        // Symbol Just Changed: preserve range if any, never auto-reset
        prevFincode.current = company?.fincode || null;
      }
      if (savedLogicalRange.current) {
        // Same Symbol (Likely Chart Type Switch): Restore Range
        if (chartRef.current)
          chartRef.current
            .timeScale()
            .setVisibleLogicalRange(savedLogicalRange.current);
      }

      drawHighlights();
    }
  }, [
    aggregatedData,
    drawHighlights,
    chartType,
    chartReady,
    candleSettings.candleType,
    candleSettings.lockScale,
    buildHeikinAshi,
    computePriceRangeForData,
  ]);

  useEffect(() => {
    requestAnimationFrame(drawHighlights);
  }, [activePatternIds, patterns, drawHighlights]);

  useEffect(() => {
    const series = seriesRef.current;
    const markerSeries = markerSeriesRef.current;
    const markerPrimitive = markerPrimitiveRef.current;
    if (!series && !markerSeries && !markerPrimitive) return;
    const targetSeries =
      markerPrimitive && typeof markerPrimitive.setMarkers === "function"
        ? markerPrimitive
        : series && typeof series.setMarkers === "function"
          ? series
          : markerSeries && typeof markerSeries.setMarkers === "function"
            ? markerSeries
            : null;
    pendingMarkersRef.current = [];
    if (targetSeries) targetSeries.setMarkers([]);
  }, [announcements]);

  /* -------------------------------------------------
     Full Indicator Management (creation + setData)
  ------------------------------------------------- */
  /* -------------------------------------------------
     Constants for Reference Levels
  ------------------------------------------------- */
  const INDICATOR_LEVELS = {
    RSI: [30, 70],
    CCI: [-100, 100],
    WILLR: [-20, -80],
    STOCH: [20, 80],
    StochRSI: [20, 80],
    DeM: [0.3, 0.7],
    UO: [30, 50, 70],
    MFI: [20, 80],
    ROC: [0],
    AO: [0],
    TRIX: [0],
  };

  /* -------------------------------------------------
     Full Indicator Management (creation + setData)
  ------------------------------------------------- */
  useEffect(() => {
    if (!chartRef.current || aggregatedData.length === 0 || !chartReady) return;

    const currentIds = new Set(activeIndicators.map((i) => i.uuid));

    // Remove deselected indicators
    Object.keys(indicatorSeriesRef.current).forEach((uuid) => {
      if (!currentIds.has(uuid)) {
        const s = indicatorSeriesRef.current[uuid];
        if (Array.isArray(s))
          s.forEach((sub) => chartRef.current.removeSeries(sub));
        else chartRef.current.removeSeries(s);
        delete indicatorSeriesRef.current[uuid];
      }
    });

    // Add or update active indicators
    activeIndicators.forEach((ind) => {
      const calculatedData = calculateIndicatorData(
        ind.id,
        aggregatedData, // USE AGGREGATED DATA
        ind.params || ind.defParams,
      );
      if (!calculatedData || calculatedData.length === 0) return;

      // Create series if not exists
      if (!indicatorSeriesRef.current[ind.uuid]) {
        const isOverlay = OVERLAY_IDS.has(ind.id);
        const indicatorPaneIndex =
          ind.paneIndex !== undefined ? ind.paneIndex : isOverlay ? 0 : 1;

        const addLine = (
          title,
          color,
          lineWidth = 1,
          paneIdx = indicatorPaneIndex,
        ) => {
          const chart = chartRef.current;
          if (!chart) throw new Error("Chart not initialized");

          // Debug pane index
          // console.log(`Adding series ${title} to pane ${paneIdx}`);

          // Use addSeries with paneIndex for v5+
          if (
            typeof chart.addSeries === "function" &&
            typeof LineSeries !== "undefined"
          ) {
            return chart.addSeries(LineSeries, {
              title,
              color,
              lineWidth,
              paneIndex: paneIdx,
              priceScaleId: "right", // Always use right axis for proper pane placement
              crosshairMarkerVisible: false,
              lastValueVisible: paneIdx > 0, // Show last value for oscillators
              priceLineVisible: false,
            });
          }
          // Fallback for older API
          if (typeof chart.addLineSeries === "function") {
            return chart.addLineSeries({
              title,
              color,
              lineWidth,
              priceScaleId: paneIdx === 0 ? "right" : "left", // Fallback logic
              crosshairMarkerVisible: false,
            });
          }
          throw new Error("No supported API to create line series on chart");
        };

        if (ind.id === "BB") {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine("BB Upper", ind.color, 1, 0),
            addLine("BB Middle", "#9e9e9e", 1, 0),
            addLine("BB Lower", ind.color, 1, 0),
          ];
        } else if (ind.id === "DC") {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine("DC Upper", ind.color, 1, 0),
            addLine("DC Middle", "#9e9e9e", 1, 0),
            addLine("DC Lower", ind.color, 1, 0),
          ];
        } else if (ind.id === "KC") {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine("KC Upper", ind.color, 1, 0),
            addLine("KC Middle", "#9e9e9e", 1, 0),
            addLine("KC Lower", ind.color, 1, 0),
          ];
        } else if (ind.id === "STOCH") {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine("%K", ind.color, 2, indicatorPaneIndex),
            addLine("%D", "#FF5252", 1, indicatorPaneIndex),
          ];
        } else if (ind.id === "StochRSI") {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine("StochRSI %K", ind.color, 2, indicatorPaneIndex),
            addLine("StochRSI %D", "#FF5252", 1, indicatorPaneIndex),
          ];
        } else if (ind.id === "SuperTrend") {
          indicatorSeriesRef.current[ind.uuid] = addLine(
            "SuperTrend",
            ind.color,
            2,
            0, // Overlay on price chart
          );
        } else if (ind.id === "MACD") {
          const macd = addLine("MACD", ind.color, 2, indicatorPaneIndex);
          const signal = addLine("Signal", "#FF5252", 1, indicatorPaneIndex);
          const hist = chartRef.current.addSeries(HistogramSeries, {
            title: "Histogram",
            paneIndex: indicatorPaneIndex, // Separate pane
            priceScaleId: "right", // Right axis on pane 1
            color: "#26a69a",
          });
          indicatorSeriesRef.current[ind.uuid] = [macd, signal, hist];
        } else if (ind.id === "GMMA") {
          const seriesArr = [];
          const shortPeriods =
            ind.params?.shortPeriods || ind.defParams.shortPeriods;
          const longPeriods =
            ind.params?.longPeriods || ind.defParams.longPeriods;
          shortPeriods.forEach(() =>
            seriesArr.push(addLine(`GMMA Short`, "#00bcd4", 1, 0)),
          );
          longPeriods.forEach(() =>
            seriesArr.push(addLine(`GMMA Long`, "#ff5722", 1, 0)),
          );
          indicatorSeriesRef.current[ind.uuid] = seriesArr;
        } else if (ind.id === "Ichimoku") {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine("Tenkan", "#0496FF", 1, 0),
            addLine("Kijun", "#99154E", 1, 0),
            addLine("Span A", "#4CAF50", 1, 0),
            addLine("Span B", "#F44336", 1, 0),
            addLine("Lagging", "#808080", 1, 0),
          ];
        } else if (ind.id === "HeikenAshi") {
          const haSeries = chartRef.current.addSeries(CandlestickSeries, {
            upColor: ind.color,
            downColor: "#000000",
            borderVisible: false,
            wickUpColor: ind.color,
            wickDownColor: "#000000",
            paneIndex: 0, // On main price chart
          });
          indicatorSeriesRef.current[ind.uuid] = haSeries;
        } else if (ind.id === "DMI") {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine("+DI", "#4CAF50", 1, indicatorPaneIndex),
            addLine("-DI", "#F44336", 1, indicatorPaneIndex),
            addLine("ADX", "#FF9800", 1, indicatorPaneIndex),
          ];
        } else {
          // Use the default paneIndex computed above based on OVERLAY_IDS
          indicatorSeriesRef.current[ind.uuid] = addLine(
            ind.name,
            ind.color,
            2,
            indicatorPaneIndex, // 0 for overlays, 1 for oscillators
          );
        }
      }

      // Ensure series is in correct pane (for drag/drop or updates)
      const seriesOrArray = indicatorSeriesRef.current[ind.uuid];
      if (seriesOrArray) {
        const currentPaneIndex =
          ind.paneIndex !== undefined
            ? ind.paneIndex
            : OVERLAY_IDS.has(ind.id)
              ? 0
              : 1;

        const seriesList = Array.isArray(seriesOrArray)
          ? seriesOrArray
          : [seriesOrArray];
        seriesList.forEach((s) => {
          // Only move if function exists and if needed (optimization: we can't easily check current pane, so just correct it)
          if (s && typeof s.moveToPane === "function") {
            // Prevent error if already deleted or invalid
            try {
              s.moveToPane(currentPaneIndex);
            } catch (e) {}
          }
        });
      }

      // Update data
      const series = indicatorSeriesRef.current[ind.uuid];

      // --- Apply Reference Levels (PriceLines) ---
      // Check if levels defined in params or defaults
      const levelConfig = ind.params?.levels || INDICATOR_LEVELS[ind.id];
      if (series && levelConfig && Array.isArray(levelConfig)) {
        const mainSeries = Array.isArray(series) ? series[0] : series;
        // Clean up old lines (we attach them to the series object to track)
        if (mainSeries._customPriceLines) {
          mainSeries._customPriceLines.forEach((l) =>
            mainSeries.removePriceLine(l),
          );
        }
        mainSeries._customPriceLines = [];

        levelConfig.forEach((lvl) => {
          // Check if lvl is number or obj? Assuming number for now or simple obj
          const val = typeof lvl === "object" ? lvl.value : Number(lvl);
          if (!isNaN(val)) {
            mainSeries._customPriceLines.push(
              mainSeries.createPriceLine({
                price: val,
                color: "#9ca3af", // gray-400
                lineWidth: 1,
                lineStyle: 2, // Dashed
                axisLabelVisible: false,
                title: "",
              }),
            );
          }
        });
      }

      // --- Apply Generic Line Width ---
      if (series && ind.lineWidth) {
        const lw = ind.lineWidth;
        const seriesList = Array.isArray(series) ? series : [series];
        seriesList.forEach((s) => {
          if (s && typeof s.applyOptions === "function") {
            try {
              s.applyOptions({ lineWidth: lw });
            } catch (e) {
              // Ignore if series type doesn't support lineWidth
            }
          }
        });
      }

      if (ind.id === "BB") {
        series[0].applyOptions({ color: ind.color });
        series[2].applyOptions({ color: ind.color });
        series[0].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.value })),
        );
        series[1].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.middle })),
        );
        series[2].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.lower })),
        );
      } else if (ind.id === "DC" || ind.id === "KC") {
        series[0].applyOptions({ color: ind.color });
        series[2].applyOptions({ color: ind.color });
        series[0].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.value })),
        );
        series[1].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.middle })),
        );
        series[2].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.lower })),
        );
      } else if (ind.id === "STOCH") {
        series[0].applyOptions({ color: ind.color });
        series[0].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.k || d.value })),
        );
        series[1].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.d })),
        );
      } else if (ind.id === "StochRSI") {
        series[0].applyOptions({ color: ind.color });
        series[0].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.k || d.value })),
        );
        series[1].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.d })),
        );
      } else if (ind.id === "MACD") {
        series[0].applyOptions({ color: ind.color });
        series[0].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.value })),
        );
        series[1].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.signal })),
        );
        series[2].setData(
          calculatedData.map((d) => ({
            time: d.time,
            value: d.histogram,
            color: d.histogram >= 0 ? "#26a69a" : "#ef5350",
          })),
        );
      } else if (ind.id === "GMMA") {
        // GMMA has fixed colors usually, or complex overrides.
        // Skipping dynamic color update for GMMA for now or assuming defaults.
        const shortPeriods =
          ind.params?.shortPeriods || ind.defParams.shortPeriods;
        const longPeriods =
          ind.params?.longPeriods || ind.defParams.longPeriods;
        let sIdx = 0;
        shortPeriods.forEach((p) => {
          if (series[sIdx]) {
            series[sIdx].setData(
              calculatedData.map((d) => ({
                time: d.time,
                value: d[`short${p}`],
              })),
            );
            sIdx++;
          }
        });
        longPeriods.forEach((p) => {
          if (series[sIdx]) {
            series[sIdx].setData(
              calculatedData.map((d) => ({
                time: d.time,
                value: d[`long${p}`],
              })),
            );
            sIdx++;
          }
        });
      } else if (ind.id === "Ichimoku") {
        series[0].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.conversion })),
        );
        series[1].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.base })),
        );
        series[2].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.spanA })),
        );
        series[3].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.spanB })),
        );
        series[4].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.lagging })),
        );
      } else if (ind.id === "HeikenAshi") {
        series.applyOptions({
          upColor: ind.color,
          wickUpColor: ind.color,
        });
        series.setData(calculatedData);
      } else if (ind.id === "DMI") {
        // DMI has fixed colors usually (+DI Green, -DI Red, ADX Orange)
        // We can allow ADX color change? Or main color?
        // Let's assume ind.color applies to ADX (series[2])
        series[2].applyOptions({ color: ind.color });
        series[0].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.pdi })),
        );
        series[1].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.mdi })),
        );
        series[2].setData(
          calculatedData.map((d) => ({ time: d.time, value: d.adx })),
        );
      } else if (ind.id === "SuperTrend") {
        series.setData(
          calculatedData.map((d) => ({
            time: d.time,
            value: d.value,
            color: d.trend === 1 ? "#26a69a" : "#ef5350",
          })),
        );
      } else {
        series.applyOptions({ color: ind.color });
        series.setData(calculatedData);
      }
    });
  }, [activeIndicators, aggregatedData, chartReady]);

  /* -------------------------------------------------
     Infinite scroll loading with debounce
  ------------------------------------------------- */
  const stateRef = useRef({ startDate, isLoading, isFullyLoaded });
  useEffect(() => {
    stateRef.current = { startDate, isLoading, isFullyLoaded };
  }, [startDate, isLoading, isFullyLoaded]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    const onVisibleLogicalRangeChanged = (newVisibleLogicalRange) => {
      if (newVisibleLogicalRange === null) return;
      const { startDate, isLoading, isFullyLoaded } = stateRef.current;
      if (
        newVisibleLogicalRange.from < 10 &&
        !isLoading &&
        !isFullyLoaded &&
        startDate
      ) {
        const currentStart = new Date(startDate);
        const newEnd = new Date(currentStart);
        newEnd.setDate(newEnd.getDate() - 1);
        const newStart = new Date(newEnd);
        newStart.setFullYear(newStart.getFullYear() - 5); // Fetch 5 years at a time
        fetchData(formatDate(newStart), formatDate(newEnd), false, true);
      }
    };
    const debouncedRangeChanged = debounce(onVisibleLogicalRangeChanged, 300); // Debounce to prevent rapid calls
    chart.timeScale().subscribeVisibleLogicalRangeChange(debouncedRangeChanged);
    return () => {
      chart
        .timeScale()
        .unsubscribeVisibleLogicalRangeChange(debouncedRangeChanged);
    };
  }, [fetchData]);

  /* -------------------------------------------------
   Constants
------------------------------------------------- */
  const OVERLAY_IDS = new Set([
    // Moving Averages
    "SMA",
    "EMA",
    "WMA",
    "WEMA",
    "HMA",
    "TEMA",
    "KAMA",
    // Multi-line overlays
    "GMMA",
    "Ichimoku",
    // Trend overlays
    "SuperTrend",
    "PSAR",
    // Channel/Band overlays
    "BB",
    "DC",
    "KC",
    // Special
    "HeikenAshi",
  ]);

  /* -------------------------------------------------
   UX Improvements: Undo & Auto-Close
------------------------------------------------- */
  const handleApplyIndicators = (newIndicators) => {
    const prev = activeIndicators;

    // Calculate next available pane index (start at 1)
    // Find max used pane index in existing (preserving current layouts)
    // Actually, we should check `newIndicators` to see what's being added.
    // We need to process `newIndicators` to ensure every oscillator has a unique paneIndex.

    // Create a map of existing assignments to preserve them if possible?
    // Or just re-calculate for all? Re-calculating might shuffle things if I change order.
    // Better: Assign paneIndex to items that don't have one.

    let maxPaneIndex = 0;
    newIndicators.forEach((ind) => {
      if (ind.paneIndex !== undefined) {
        maxPaneIndex = Math.max(maxPaneIndex, ind.paneIndex);
      }
    });

    const processedIndicators = newIndicators.map((ind) => {
      // If overlay, force pane 0
      if (OVERLAY_IDS.has(ind.id)) {
        return { ...ind, paneIndex: 0 };
      }

      // If oscillator and has valid pane > 0, keep it
      if (ind.paneIndex !== undefined && ind.paneIndex > 0) {
        return ind;
      }

      // If oscillator needs assignment
      maxPaneIndex++;
      return { ...ind, paneIndex: maxPaneIndex };
    });

    // Add history for newly added indicators
    const addedCount = processedIndicators.length - prev.length;
    if (addedCount > 0) {
      for (let i = 0; i < addedCount; i++) {
        addActionToHistory("indicator");
      }
    }

    setActiveIndicators(processedIndicators);
    setIsMenuOpen(false); // Auto-close

    toast.success(
      (t) => (
        <div className="flex items-center gap-2">
          <span>Indicators applied</span>
          <button
            onClick={() => {
              setActiveIndicators(prev);
              toast.dismiss(t.id);
            }}
            className="px-2 py-1 bg-slate-700 text-white text-xs rounded hover:bg-slate-600 border border-slate-600"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 4000 },
    );
  };

  const handleApplyPatterns = (newPatternIds) => {
    // Determine added patterns to push to history
    const addedCount = newPatternIds.length - activePatternIds.length;
    if (addedCount > 0) {
      // Push 'pattern' action for each new pattern so we can undo them one by one
      // OR push once? The undo logic removes ONE id.
      // So if we added 3, we should ideally allow undoing 3 times?
      // Or maybe just push one 'pattern-batch' action?
      // Given existing undo logic removes one slice, let's push N times if we want granular undo,
      // or just once if we assume the user treats the batch as one.
      // But the existing undo logic `prev.slice(0, -1)` implies removing the *last* item.
      // So if I add 3 items, and push 1 history event, undo removes 1 item.
      // The history event matches the action.
      // Let's push 'pattern' for each added item.
      for (let i = 0; i < addedCount; i++) {
        addActionToHistory("pattern");
      }
    }

    setActivePatternIds(newPatternIds);
    setIsPatternMenuOpen(false); // Auto-close
  };

  /* -------------------------------------------------
     UI Components
  ------------------------------------------------- */
  /* -------------------------------------------------
     Object Management Handlers
  ------------------------------------------------- */
  const handleRemoveDrawing = (index) => {
    setDrawings((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveIndicator = (identifier) => {
    setActiveIndicators((prev) => {
      if (typeof identifier === "number") {
        return prev.filter((_, i) => i !== identifier);
      }
      return prev.filter((i) => i.uuid !== identifier);
    });
  };

  const handleRemovePattern = (patternId) => {
    setActivePatternIds((prev) => prev.filter((id) => id !== patternId));
  };

  const handleUpdateIndicator = (updatedIndicator) => {
    setActiveIndicators((prev) =>
      prev.map((ind) =>
        ind.uuid === updatedIndicator.uuid
          ? { ...ind, ...updatedIndicator }
          : ind,
      ),
    );
  };

  const handleUpdateDrawing = (updatedDrawing, index) => {
    setDrawings((prev) => {
      const newDrawings = [...prev];
      if (index >= 0 && index < newDrawings.length) {
        newDrawings[index] = updatedDrawing;
      }
      return newDrawings;
    });
  };

  const handleClearAll = () => {
    setDrawings([]);
    setActivePatternIds([]);
    setActiveIndicators([]);
    setActionHistory([]);
  };

  /* -------------------------------------------------
     Robust Undo System
  ------------------------------------------------- */
  const addActionToHistory = (type) => {
    setActionHistory((prev) => [...prev, { type, timestamp: Date.now() }]);
  };

  const handleRobustUndo = useCallback(() => {
    setActionHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop();
      const type = typeof last === "string" ? last : last.type;

      if (type === "drawing") {
        setDrawings((curr) => {
          if (curr.length === 0) return curr;
          return curr.slice(0, -1);
        });
      } else if (type === "pattern") {
        setActivePatternIds((curr) => {
          if (curr.length === 0) return curr;
          return curr.slice(0, -1);
        });
      } else if (type === "indicator") {
        setActiveIndicators((curr) => {
          if (curr.length === 0) return curr;
          return curr.slice(0, -1);
        });
      }
      return newHistory;
    });
  }, []);

  /* -------------------------------------------------
     UI Components
  ------------------------------------------------- */
  const shortenNumber = (num) => {
    if (!num) return "—";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
  };

  const OHLCItem = ({ label, value, color = "text-slate-700" }) => (
    <div className="flex flex-col items-center">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );

  return (
    <div
      ref={chartWrapperRef}
      className={`bg-white shadow-lg border border-slate-200 overflow-hidden flex flex-col ${
        isFullScreen
          ? "fixed inset-0 z-[100] w-full h-full m-0 rounded-none bg-white"
          : "rounded-2xl"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <select
                value={activeInterval}
                onChange={(e) => setActiveInterval(e.target.value)}
                className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 pl-3 pr-8 rounded-lg cursor-pointer transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="1D">1 Day</option>
                <option value="1W">1 Week</option>
                <option value="1M">1 Month</option>
                <option value="3M">3 Months</option>
                <option value="6M">6 Months</option>
                <option value="12M">1 Year</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={() => setMagnetEnabled((prev) => !prev)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                magnetEnabled
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
              title="Magnet Snap"
              type="button"
            >
              <Target className="w-4 h-4" />
              Magnet
            </button>

            {/* Chart Type Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() =>
                  setCandleSettings((prev) => ({
                    ...prev,
                    candleType: "candles",
                  }))
                }
                className={`p-1.5 rounded-md transition-all ${
                  chartType === "candle"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Candlestick"
                type="button"
              >
                <CandlestickChart className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCandleSettings((prev) => ({
                    ...prev,
                    candleType: "line",
                  }))
                }
                className={`p-1.5 rounded-md transition-all ${
                  chartType === "line"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Line"
                type="button"
              >
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsCandleSettingsOpen((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                type="button"
                title="Candle Settings"
              >
                <Grid3X3 className="w-4 h-4" />
                Candle
              </button>

              {isCandleSettingsOpen && (
                <div className="absolute right-0 mt-2 w-[360px] bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 max-h-[70vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Candle Settings
                    </h4>
                    <button
                      className="text-slate-400 hover:text-slate-600"
                      onClick={() => setIsCandleSettingsOpen(false)}
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <label className="flex flex-col gap-1">
                      Type
                      <select
                        value={candleSettings.candleType}
                        onChange={(e) =>
                          updateCandleSetting("candleType", e.target.value)
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      >
                        <option value="candles">Candles</option>
                        <option value="hollow">Hollow</option>
                        <option value="heikinAshi">Heikin Ashi</option>
                        <option value="bar">Bar</option>
                        <option value="line">Line</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Price Scale
                      <select
                        value={candleSettings.priceScaleMode}
                        onChange={(e) =>
                          updateCandleSetting("priceScaleMode", e.target.value)
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      >
                        <option value="linear">Linear</option>
                        <option value="log">Log</option>
                        <option value="percentage">Percentage</option>
                        <option value="indexed">Indexed</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Color By
                      <select
                        value={candleSettings.colorBy}
                        onChange={(e) =>
                          updateCandleSetting("colorBy", e.target.value)
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      >
                        <option value="closeOpen">Close vs Open</option>
                        <option value="prevClose">Previous Close</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Bar Spacing
                      <select
                        value={candleSettings.barSpacingMode}
                        onChange={(e) =>
                          updateCandleSetting("barSpacingMode", e.target.value)
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      >
                        <option value="tight">Tight</option>
                        <option value="normal">Normal</option>
                        <option value="wide">Wide</option>
                        <option value="custom">Custom</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Custom Spacing
                      <input
                        type="number"
                        min="2"
                        max="50"
                        step="1"
                        value={candleSettings.barSpacing}
                        onChange={(e) =>
                          updateCandleSetting(
                            "barSpacing",
                            parseFloat(e.target.value),
                          )
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Up Color
                      <input
                        type="color"
                        value={candleSettings.upColor}
                        onChange={(e) =>
                          updateCandleSetting("upColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Down Color
                      <input
                        type="color"
                        value={candleSettings.downColor}
                        onChange={(e) =>
                          updateCandleSetting("downColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Wick Up
                      <input
                        type="color"
                        value={candleSettings.wickUpColor}
                        onChange={(e) =>
                          updateCandleSetting("wickUpColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Wick Down
                      <input
                        type="color"
                        value={candleSettings.wickDownColor}
                        onChange={(e) =>
                          updateCandleSetting("wickDownColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Border Up
                      <input
                        type="color"
                        value={candleSettings.borderUpColor}
                        onChange={(e) =>
                          updateCandleSetting("borderUpColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Border Down
                      <input
                        type="color"
                        value={candleSettings.borderDownColor}
                        onChange={(e) =>
                          updateCandleSetting("borderDownColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>

                    <label className="flex flex-col gap-1 col-span-2">
                      Body Width
                      <input
                        type="range"
                        min="0.3"
                        max="1"
                        step="0.05"
                        value={candleSettings.bodyWidthScale}
                        onChange={(e) =>
                          updateCandleSetting(
                            "bodyWidthScale",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </label>
                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.borderVisible}
                        onChange={(e) =>
                          updateCandleSetting("borderVisible", e.target.checked)
                        }
                      />
                      Border Visible
                    </label>
                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.borderFadeOnZoom}
                        onChange={(e) =>
                          updateCandleSetting(
                            "borderFadeOnZoom",
                            e.target.checked,
                          )
                        }
                      />
                      Border Fade on Zoom
                    </label>
                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.wickVisible}
                        onChange={(e) =>
                          updateCandleSetting("wickVisible", e.target.checked)
                        }
                      />
                      Wick Visible
                    </label>

                    <label className="flex flex-col gap-1 col-span-2">
                      Border Thickness
                      <input
                        type="range"
                        min="0.05"
                        max="0.4"
                        step="0.01"
                        value={candleSettings.borderThicknessScale}
                        onChange={(e) =>
                          updateCandleSetting(
                            "borderThicknessScale",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1 col-span-2">
                      Wick Thickness
                      <input
                        type="range"
                        min="0.02"
                        max="0.2"
                        step="0.01"
                        value={candleSettings.wickThicknessScale}
                        onChange={(e) =>
                          updateCandleSetting(
                            "wickThicknessScale",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Min Body (px)
                      <input
                        type="number"
                        min="0"
                        max="12"
                        step="1"
                        value={candleSettings.minBodyHeight}
                        onChange={(e) =>
                          updateCandleSetting(
                            "minBodyHeight",
                            parseFloat(e.target.value),
                          )
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Wick Boost (px)
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        value={candleSettings.wickExaggeration}
                        onChange={(e) =>
                          updateCandleSetting(
                            "wickExaggeration",
                            parseFloat(e.target.value),
                          )
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      />
                    </label>

                    <label className="flex flex-col gap-1">
                      Body Opacity
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={candleSettings.bodyOpacity}
                        onChange={(e) =>
                          updateCandleSetting(
                            "bodyOpacity",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Wick Opacity
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={candleSettings.wickOpacity}
                        onChange={(e) =>
                          updateCandleSetting(
                            "wickOpacity",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Border Opacity
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={candleSettings.borderOpacity}
                        onChange={(e) =>
                          updateCandleSetting(
                            "borderOpacity",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Grid Opacity
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={candleSettings.gridOpacity}
                        onChange={(e) =>
                          updateCandleSetting(
                            "gridOpacity",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </label>

                    <label className="flex flex-col gap-1">
                      Grid Color
                      <input
                        type="color"
                        value={candleSettings.gridColor}
                        onChange={(e) =>
                          updateCandleSetting("gridColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Background
                      <input
                        type="color"
                        value={candleSettings.backgroundColor}
                        onChange={(e) =>
                          updateCandleSetting("backgroundColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>

                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.showVertGrid}
                        onChange={(e) =>
                          updateCandleSetting("showVertGrid", e.target.checked)
                        }
                      />
                      Vertical Grid
                    </label>
                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.showHorzGrid}
                        onChange={(e) =>
                          updateCandleSetting("showHorzGrid", e.target.checked)
                        }
                      />
                      Horizontal Grid
                    </label>

                    <label className="flex flex-col gap-1">
                      Crosshair Type
                      <select
                        value={candleSettings.crosshairType}
                        onChange={(e) =>
                          updateCandleSetting("crosshairType", e.target.value)
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      >
                        <option value="cross">Cross</option>
                        <option value="dot">Dot</option>
                        <option value="vertical">Vertical</option>
                        <option value="horizontal">Horizontal</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Magnet Mode
                      <select
                        value={candleSettings.magnetMode}
                        onChange={(e) =>
                          updateCandleSetting("magnetMode", e.target.value)
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      >
                        <option value="ohlc">OHLC</option>
                        <option value="close">Close</option>
                        <option value="free">Free</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Crosshair Style
                      <select
                        value={candleSettings.crosshairLineStyle}
                        onChange={(e) =>
                          updateCandleSetting(
                            "crosshairLineStyle",
                            e.target.value,
                          )
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Precision
                      <select
                        value={candleSettings.pricePrecisionMode}
                        onChange={(e) =>
                          updateCandleSetting(
                            "pricePrecisionMode",
                            e.target.value,
                          )
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      >
                        <option value="auto">Auto</option>
                        <option value="fixed">Fixed</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Decimals
                      <input
                        type="number"
                        min="0"
                        max="8"
                        step="1"
                        value={candleSettings.pricePrecision}
                        onChange={(e) =>
                          updateCandleSetting(
                            "pricePrecision",
                            parseFloat(e.target.value),
                          )
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Crosshair Color
                      <input
                        type="color"
                        value={candleSettings.crosshairColor}
                        onChange={(e) =>
                          updateCandleSetting("crosshairColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Price Line Color
                      <input
                        type="color"
                        value={candleSettings.priceLineColor}
                        onChange={(e) =>
                          updateCandleSetting("priceLineColor", e.target.value)
                        }
                        className="h-8 w-full"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Price Line Style
                      <select
                        value={candleSettings.priceLineStyle}
                        onChange={(e) =>
                          updateCandleSetting("priceLineStyle", e.target.value)
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Price Line Width
                      <input
                        type="number"
                        min="1"
                        max="4"
                        value={candleSettings.priceLineWidth}
                        onChange={(e) =>
                          updateCandleSetting(
                            "priceLineWidth",
                            Number(e.target.value || 1),
                          )
                        }
                        className="border border-slate-200 rounded-md px-2 py-1"
                      />
                    </label>

                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.showLastPrice}
                        onChange={(e) =>
                          updateCandleSetting("showLastPrice", e.target.checked)
                        }
                      />
                      Show Last Price
                    </label>
                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.lastValueVisible}
                        onChange={(e) =>
                          updateCandleSetting(
                            "lastValueVisible",
                            e.target.checked,
                          )
                        }
                      />
                      Show Last Price Label
                    </label>
                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.autoScale}
                        onChange={(e) =>
                          updateCandleSetting("autoScale", e.target.checked)
                        }
                      />
                      Auto Scale
                    </label>
                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.lockScale}
                        onChange={(e) =>
                          updateCandleSetting("lockScale", e.target.checked)
                        }
                      />
                      Lock Scale
                    </label>
                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={candleSettings.invertScale}
                        onChange={(e) =>
                          updateCandleSetting("invertScale", e.target.checked)
                        }
                      />
                      Invert Scale
                    </label>
                  </div>
                </div>
              )}
            </div>

            {data.length > 0 && (
              <>
                <button
                  onClick={handleClearAll}
                  className="p-2 mr-2 rounded-lg border transition-all shadow-sm bg-white hover:bg-gray-50 text-slate-700 border-slate-200"
                  title="Reset (Clear All)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAnnotationMenuOpen(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium shadow-sm ${
                    activeTool
                      ? "bg-teal-50 text-teal-700 border-teal-200"
                      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Drawing</span>
                  {drawings.length > 0 && (
                    <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {drawings.length}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all text-sm font-medium shadow-sm"
                >
                  <Layers className="w-4 h-4" />
                  <span>Indicators</span>
                  {activeIndicators.length > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {activeIndicators.length}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPatternMenuOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all text-sm font-medium shadow-sm"
                >
                  <CandlestickChart className="w-4 h-4" />
                  <span>Patterns</span>
                  {activePatternIds.length > 0 && (
                    <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {activePatternIds.length}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </>
            )}

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {/* <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button> */}
            <button
              onClick={toggleFullScreen}
              className="p-3 hover:bg-slate-200 rounded-lg transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div
        className={`flex-1 ${isFullScreen ? "p-0" : "p-6"}`}
        onContextMenu={handleContextMenu}
      >
        <div
          className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-white"
          style={{
            height: isFullScreen ? "100%" : "500px",
            border: isFullScreen ? "none" : undefined,
            borderRadius: isFullScreen ? "0" : undefined,
          }}
        >
          {!isLoading && isFullyLoaded && data.length === 0 && company && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
              <div className="p-4 rounded-full bg-gray-100 mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No Price Data Available
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                We couldn't find any trading history for this symbol.
              </p>
            </div>
          )}

          {isLoading && (
            <div
              className={`absolute z-50 flex items-center justify-center ${
                data.length === 0
                  ? "inset-0 bg-white/80 backdrop-blur-sm"
                  : "top-6 left-20 scale-[0.4] origin-top-left"
              }`}
            >
              <CandleLoader />
            </div>
          )}

          {/* Favorites Toolbar - Centered Inside Chart */}
          <FavoritesToolbar
            favorites={favorites}
            onSelect={handleRadialSelect}
            activeToolId={activeTool}
            onOpenToolSettings={(toolId) => {
              // TODO: Open tool-specific settings modal
              // For now, just select the tool
              setActiveTool(toolId);
            }}
          />

          {/* OHLC Overlay (Top Right) */}
          {currentOHLC && (
            <div className="absolute top-2 right-14 z-20 flex items-center gap-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm border border-slate-200 pointer-events-none">
              <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                <span className="text-slate-400">O</span>
                <span>
                  {formatPriceValue(currentOHLC.open, candleSettings)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                <span className="text-slate-400">H</span>
                <span className="text-green-600">
                  {formatPriceValue(currentOHLC.high, candleSettings)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                <span className="text-slate-400">L</span>
                <span className="text-red-600">
                  {formatPriceValue(currentOHLC.low, candleSettings)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                <span className="text-slate-400">C</span>
                <span
                  className={
                    currentOHLC.close >= currentOHLC.open
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {formatPriceValue(currentOHLC.close, candleSettings)}
                </span>
              </div>
            </div>
          )}

          {/* Legend Overlay */}
          {/* Legend Overlay */}
          <ChartLegend
            activeIndicators={activeIndicators}
            currentValues={indicatorValues}
            onRemove={handleRemoveIndicator}
            onUpdateIndicator={handleUpdateIndicator}
            drawings={drawings}
            patterns={activePatternIds}
            onRemoveDrawing={handleRemoveDrawing}
            onUpdateDrawing={handleUpdateDrawing}
            onRemovePattern={handleRemovePattern}
            onUndo={handleRobustUndo}
            onClearAll={handleClearAll}
          />

          <div className="relative w-full h-full">
            <div ref={chartContainerRef} className="w-full h-full" />

            {/* TradingView-style announcement bubbles over time axis */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {announcementOverlays.map((item) => (
                <div
                  key={item.id}
                  className="absolute"
                  style={{
                    left: `${item.x}px`,
                    bottom: `${item.bottom}px`,
                    transform: "translateX(-50%)",
                    pointerEvents: "auto",
                  }}
                  onMouseEnter={() => {
                    cancelHoverClear();
                    setHoverAnnouncement(item);
                  }}
                  onMouseLeave={scheduleHoverClear}
                >
                  <div
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold shadow-md border border-white/40"
                    style={{
                      backgroundColor: item.color,
                      color: "#fff",
                    }}
                  >
                    <span>{item.bubbleText}</span>
                    {item.announcementDate ? (
                      <sup className="ml-0.5 text-[9px] font-semibold text-white/90">
                        a
                      </sup>
                    ) : null}
                  </div>
                </div>
              ))}

              {hoverAnnouncement && (
                <div
                  className="absolute z-30 pointer-events-auto"
                  style={{
                    left: `${hoverAnnouncement.x}px`,
                    bottom: `${hoverAnnouncement.bottom + 28}px`,
                    transform: "translateX(-50%)",
                  }}
                  onMouseEnter={cancelHoverClear}
                  onMouseLeave={scheduleHoverClear}
                >
                  <div className="max-w-[320px] rounded-lg bg-white text-slate-900 text-xs shadow-xl border border-slate-300 px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-flex h-2 w-2 rounded-full"
                        style={{ backgroundColor: hoverAnnouncement.color }}
                      />
                      <span className="font-semibold">
                        {hoverAnnouncement.label}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div>
                        <span className="text-slate-500 font-medium">
                          Date:
                        </span>{" "}
                        {hoverAnnouncement.exDate}
                      </div>
                      {hoverAnnouncement.rdDate && (
                        <div>
                          <span className="text-slate-500 font-medium">
                            RD:
                          </span>{" "}
                          {hoverAnnouncement.rdDate}
                        </div>
                      )}
                      {hoverAnnouncement.announcementDate && (
                        <div>
                          <span className="text-slate-500 font-medium">
                            Announcement:
                          </span>{" "}
                          {hoverAnnouncement.announcementDate}
                        </div>
                      )}
                      {hoverAnnouncement.amount !== null && (
                        <div>
                          <span className="text-slate-500 font-medium">
                            Amount:
                          </span>{" "}
                          {hoverAnnouncement.amount}
                        </div>
                      )}
                      {hoverAnnouncement.ratio && (
                        <div>
                          <span className="text-slate-500 font-medium">
                            Ratio:
                          </span>{" "}
                          {hoverAnnouncement.ratio}
                        </div>
                      )}
                      {hoverAnnouncement.purpose && (
                        <div className="text-slate-700 leading-snug">
                          {hoverAnnouncement.purpose}
                        </div>
                      )}
                      {hoverAnnouncement.headline && (
                        <div className="text-slate-700 leading-snug">
                          {hoverAnnouncement.headline}
                        </div>
                      )}
                      {hoverAnnouncement.pdfUrl && (
                        <a
                          href={hoverAnnouncement.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium underline inline-block mt-1"
                        >
                          Open PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {hasInitialLoaded && data && data.length > 0 && (
              <ChartAnnotations
                chart={chartRef.current}
                series={seriesRef.current}
                data={data}
                activeTool={activeTool}
                drawings={drawings}
                setDrawings={setDrawings}
                patternConstraintMode={patternConstraintMode}
                magnetEnabled={magnetEnabled}
                magnetMode={candleSettings.magnetMode}
                onDrawingComplete={() => {
                  addActionToHistory("drawing");
                  setActiveTool("select"); // Return to selection mode after drawing
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Favorites Toolbar moved inside chart area */}

      {/* Menus */}
      <IndicatorMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeIndicators={activeIndicators}
        onApply={handleApplyIndicators}
        portalTarget={isFullScreen ? chartWrapperRef.current : null}
        onToggleFavorite={toggleFavorite}
        favorites={favorites}
        onOpenSettings={(id) => {
          console.log("Opening indicator settings:", id);
          // For now, toggle the menu
          setIsMenuOpen(false);
        }}
      />

      <PatternMenu
        isOpen={isPatternMenuOpen}
        onClose={() => setIsPatternMenuOpen(false)}
        activePatterns={activePatternIds}
        onApply={handleApplyPatterns}
        portalTarget={isFullScreen ? chartWrapperRef.current : null}
        onToggleFavorite={toggleFavorite}
        favorites={favorites}
      />

      <AnnotationMenu
        isOpen={isAnnotationMenuOpen}
        onClose={() => setIsAnnotationMenuOpen(false)}
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        patternConstraintMode={patternConstraintMode}
        onChangePatternConstraintMode={setPatternConstraintMode}
        portalTarget={isFullScreen ? chartWrapperRef.current : null}
        onToggleFavorite={toggleFavorite}
        favorites={favorites}
        onOpenSettings={(id) => {
          console.log("Opening tool settings:", id);
          setActiveTool(id);
          setIsAnnotationMenuOpen(false);
        }}
      />

      {/* Radial Menu */}
      <RadialMenu
        isOpen={isRadialOpen}
        onClose={() => setIsRadialOpen(false)}
        position={radialPosition}
        items={favorites.filter((f) => f.type === "tool")}
        onSelect={handleRadialSelect}
      />
    </div>
  );
}

export default ResearchChart;

