import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { Layers, ChevronDown, X, PenTool, TrendingUp, Grid, Percent, Eraser, MousePointer2, AlertCircle } from 'lucide-react';
import IndicatorMenu from './IndicatorMenu';
import { calculateIndicatorData } from './IndicatorCalculations';
import ChartAnnotations from './ChartAnnotations';
import config from '../config';


const PriceActionChart = ({ company }) => {
    // if (!company) return null;

    const chartContainerRef = useRef();
    const chartRef = useRef();
    const seriesRef = useRef();

    const isFitRef = useRef(false);

    // Map to store indicator series instances: { [indicatorId]: ISeriesApi }
    // For complex indicators like BB, it might store an array or object of series.
    const indicatorSeriesRef = useRef({});

    // State
    const [data, setData] = useState([]);
    const [oldestAvailableDate, setOldestAvailableDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFullyLoaded, setIsFullyLoaded] = useState(false);
    const [startDate, setStartDate] = useState(null);

    // Indicators State
    const [activeIndicators, setActiveIndicators] = useState([]); // Array of { id, name, params, color, uuid }
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const canvasRef = useRef(null);
    const highlightRectsRef = useRef([]);

    // Drawing State
    const [activeTool, setActiveTool] = useState(null); // 'line', 'gann', 'fib', 'eraser', null
    const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);
    const [drawings, setDrawings] = useState([]);

    const tools = [
        { id: 'line', name: 'Trend Line', icon: TrendingUp },
        { id: 'gann', name: 'Gann Box', icon: Grid },
        { id: 'gannFan', name: 'Gann Fan', icon: Grid },
        { id: 'fib', name: 'Fib Retracement', icon: Percent },
        { id: 'eraser', name: 'Eraser', icon: Eraser },
    ];


    // ... (skipping unchanged parts) ...

    // ... inside render ...

    // ... (skipping unchanged parts) ...

    // ... inside render ...


    const formatDate = (date) => date.toISOString().split('T')[0];

    // Fetch Data
    const fetchData = useCallback(async (start, end, isInitial = false) => {
        if (!company?.fincode || isLoading || (isFullyLoaded && !isInitial)) return;
        setIsLoading(true);

        try {

            // Updated to GET + query params
            const url = new URL(`${config.API_BASE_URL}/candle-chart/price-action-history/${company.fincode}`);
            if (start) url.searchParams.append("start_date", start);
            if (end) url.searchParams.append("end_date", end);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': config.API_KEY
                }
            });

            const result = await response.json();

            if (result && result.status === 'success' && result.data) {
                const newData = result.data.price_data || {};
                const transformedData = [];
                if (newData.Date) {
                    for (let i = 0; i < newData.Date.length; i++) {
                        transformedData.push({
                            time: newData.Date[i],
                            open: newData.Open[i],
                            high: newData.High[i],
                            low: newData.Low[i],
                            close: newData.Close[i],
                            volume: newData.TotalTradedQty ? newData.TotalTradedQty[i] : 0,
                        });
                    }
                }

                // Deduplicate data based on time
                const uniqueTransformedData = [];
                const seenDates = new Set();
                for (const item of transformedData) {
                    if (!seenDates.has(item.time)) {
                        seenDates.add(item.time);
                        uniqueTransformedData.push(item);
                    }
                }

                // Optimize sort: String comparison is faster for ISO dates than new Date()
                uniqueTransformedData.sort((a, b) => (a.time > b.time ? 1 : -1));

                if (isInitial) {
                    setData(uniqueTransformedData);
                    setOldestAvailableDate(result.data.oldest_available_date);
                    if (uniqueTransformedData.length > 0) setStartDate(uniqueTransformedData[0].time);
                } else {
                    setData(prev => {
                        const combined = [...uniqueTransformedData, ...prev];
                        // Optimize deduplication: Use Map for O(N) instead of O(N^2) filter/findIndex
                        const uniqueMap = new Map();
                        combined.forEach(item => uniqueMap.set(item.time, item));
                        const unique = Array.from(uniqueMap.values());

                        // Optimize sort
                        unique.sort((a, b) => (a.time > b.time ? 1 : -1));
                        return unique;
                    });
                    if (uniqueTransformedData.length > 0) setStartDate(uniqueTransformedData[0].time);
                }

                if (result.data.oldest_available_date && uniqueTransformedData.length > 0) {
                    if (new Date(uniqueTransformedData[0].time) <= new Date(result.data.oldest_available_date)) {
                        setIsFullyLoaded(true);
                    }
                } else if (uniqueTransformedData.length === 0) {
                    setIsFullyLoaded(true);
                }
            } else {
                if (isInitial) {
                    setData([]);
                    setIsFullyLoaded(true);
                }
            }
        } catch (error) {
            console.error("Failed to fetch price action:", error);
            setIsFullyLoaded(true);
        } finally {
            setIsLoading(false);
        }
    }, [company?.fincode, isLoading, isFullyLoaded]);

    // Initial Load
    useEffect(() => {
        if (!company?.fincode) {
            setData([]);
            if (seriesRef.current) seriesRef.current.setData([]);
            return;
        }
        setData([]);
        setOldestAvailableDate(null);
        setIsFullyLoaded(false);
        setStartDate(null);
        setActiveIndicators([]); // Reset indicators on company change? Or keep them? Let's reset for safety.
        isFitRef.current = false;

        // Clear chart
        if (seriesRef.current) seriesRef.current.setData([]);
        // Clear indicators
        Object.values(indicatorSeriesRef.current).forEach(s => {
            if (Array.isArray(s)) s.forEach(sub => chartRef.current.removeSeries(sub));
            else chartRef.current.removeSeries(s);
        });
        indicatorSeriesRef.current = {};

        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        fetchData(formatDate(oneYearAgo), formatDate(today), true);
    }, [company?.fincode]);

    const [chartReady, setChartReady] = useState(false);

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#ffffff' },
                textColor: '#333333',
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
            crosshair: {
                mode: CrosshairMode.Magnet,
            },
            rightPriceScale: {
                visible: true,
                borderColor: '#f0f0f0',
            },
            leftPriceScale: {
                visible: true,
                borderColor: '#f0f0f0',
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        // Hide TradingView Logo via CSS injection
        const style = document.createElement('style');
        style.innerHTML = `
            #tv-attr-logo { display: none !important; }
            .tv-lightweight-charts-attribution { display: none !important; }
        `;
        chartContainerRef.current.appendChild(style);

        console.log('Chart instance:', chart);
        console.log('Available methods:', Object.getPrototypeOf(chart));
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        seriesRef.current = candlestickSeries;
        chartRef.current = chart;
        setChartReady(true);

        // Optimize Resize: Use ResizeObserver instead of window 'resize' event
        const resizeObserver = new ResizeObserver(entries => {
            if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
            const newRect = entries[0].contentRect;
            chart.applyOptions({ width: newRect.width });
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
            setChartReady(false);
        };
    }, []);

    // Sync Data to Chart
    useEffect(() => {
        if (chartReady && seriesRef.current && data.length > 0) {
            try {
                seriesRef.current.setData(data);
                if (chartRef.current && !isFitRef.current) {
                    chartRef.current.timeScale().fitContent();
                    isFitRef.current = true;
                }
            } catch (err) {
                console.error("Error setting chart data:", err);
            }
        }
    }, [data, chartReady]);



    // Cleanup canvas on unmount
    useEffect(() => {
        return () => {
            if (canvasRef.current) {
                canvasRef.current.remove();
                canvasRef.current = null;
            }
        }
    }, []);

    // Manage Indicators
    useEffect(() => {
        if (!chartRef.current || data.length === 0) return;

        try {
            const currentIds = new Set(activeIndicators.map(i => i.uuid));

            // 1. Remove series that are no longer active
            Object.keys(indicatorSeriesRef.current).forEach(uuid => {
                if (!currentIds.has(uuid)) {
                    const s = indicatorSeriesRef.current[uuid];
                    if (Array.isArray(s)) {
                        s.forEach(sub => chartRef.current.removeSeries(sub));
                    } else {
                        chartRef.current.removeSeries(s);
                    }
                    delete indicatorSeriesRef.current[uuid];
                }
            });

            // 2. Add/Update series
            activeIndicators.forEach(ind => {
                try {
                    const calculatedData = calculateIndicatorData(ind.id, data, ind.params || ind.defParams);

                    if (!indicatorSeriesRef.current[ind.uuid]) {
                        // Create new series
                        if (ind.id === 'BB') {
                            // Bollinger Bands needs 2 lines
                            const upper = chartRef.current.addLineSeries({
                                color: ind.color,
                                lineWidth: 1,
                                title: `${ind.name} Upper`
                            });
                            const lower = chartRef.current.addLineSeries({
                                color: ind.color,
                                lineWidth: 1,
                                title: `${ind.name} Lower`
                            });
                            indicatorSeriesRef.current[ind.uuid] = [upper, lower];
                        } else if (ind.id === 'MACD') {
                            // MACD needs separate pane ideally, but we put on left scale for now
                            // Actually MACD has MACD line, Signal line, Histogram.
                            // Simplifying to just MACD and Signal lines on Left Scale
                            const macdLine = chartRef.current.addLineSeries({
                                color: ind.color,
                                lineWidth: 2,
                                priceScaleId: 'left',
                                title: 'MACD'
                            });
                            const signalLine = chartRef.current.addLineSeries({
                                color: '#FF5252',
                                lineWidth: 1,
                                priceScaleId: 'left',
                                title: 'Signal'
                            });
                            indicatorSeriesRef.current[ind.uuid] = [macdLine, signalLine];
                        } else if (ind.id === 'StochRSI' || ind.id === 'STOCH') {
                            const kLine = chartRef.current.addLineSeries({
                                color: ind.color,
                                lineWidth: 2,
                                priceScaleId: 'left',
                                title: '%K'
                            });
                            const dLine = chartRef.current.addLineSeries({
                                color: '#FF5252',
                                lineWidth: 1,
                                priceScaleId: 'left',
                                title: '%D'
                            });
                            indicatorSeriesRef.current[ind.uuid] = [kLine, dLine];
                        } else if (ind.id === 'DC' || ind.id === 'KC') {
                            // Similar to BB
                            const upper = chartRef.current.addLineSeries({ color: ind.color, lineWidth: 1, title: 'Upper' });
                            const lower = chartRef.current.addLineSeries({ color: ind.color, lineWidth: 1, title: 'Lower' });
                            const middle = chartRef.current.addLineSeries({ color: ind.color, lineWidth: 1, lineStyle: 2, title: 'Middle' });
                            indicatorSeriesRef.current[ind.uuid] = [upper, lower, middle];
                        } else if (ind.id === 'SuperTrend') {
                            const series = chartRef.current.addLineSeries({
                                lineWidth: 2,
                                title: ind.name,
                            });
                            indicatorSeriesRef.current[ind.uuid] = series;
                        } else if (ind.id === 'Ichimoku') {
                            const conversion = chartRef.current.addLineSeries({ color: '#2962FF', lineWidth: 1, title: 'Conversion' });
                            const base = chartRef.current.addLineSeries({ color: '#B71C1C', lineWidth: 1, title: 'Base' });
                            const lagging = chartRef.current.addLineSeries({ color: '#43A047', lineWidth: 1, title: 'Lagging' });
                            const spanA = chartRef.current.addLineSeries({ color: '#A5D6A7', lineWidth: 1, title: 'Span A' });
                            const spanB = chartRef.current.addLineSeries({ color: '#EF9A9A', lineWidth: 1, title: 'Span B' });
                            indicatorSeriesRef.current[ind.uuid] = [conversion, base, lagging, spanA, spanB];
                        } else if (ind.id === 'HeikenAshi') {
                            const series = chartRef.current.addCandlestickSeries({
                                upColor: '#26a69a',
                                downColor: '#ef5350',
                                wickUpColor: '#26a69a',
                                wickDownColor: '#ef5350',
                                borderVisible: false,
                            });
                            indicatorSeriesRef.current[ind.uuid] = series;
                        } else if (ind.id === 'DMI') {
                            const adx = chartRef.current.addLineSeries({ color: '#FF6D00', lineWidth: 2, priceScaleId: 'left', title: 'ADX' });
                            const pdi = chartRef.current.addLineSeries({ color: '#00E676', lineWidth: 1, priceScaleId: 'left', title: '+DI' });
                            const mdi = chartRef.current.addLineSeries({ color: '#FF5252', lineWidth: 1, priceScaleId: 'left', title: '-DI' });
                            indicatorSeriesRef.current[ind.uuid] = [adx, pdi, mdi];
                        } else {
                            // Standard Line
                            // Determine scale based on ID
                            const OVERLAY_IDS = new Set(['SMA', 'EMA', 'WMA', 'WEMA', 'BB', 'DC', 'KC', 'PSAR', 'SuperTrend', 'Ichimoku', 'HMA', 'TEMA', 'HeikenAshi', 'VWAP']);
                            const isOverlay = OVERLAY_IDS.has(ind.id);

                            const series = chartRef.current.addLineSeries({
                                color: ind.color,
                                lineWidth: 2,
                                priceScaleId: isOverlay ? 'right' : 'left',
                                title: ind.name,
                            });
                            indicatorSeriesRef.current[ind.uuid] = series;
                        }
                    }

                    // Update Data
                    const series = indicatorSeriesRef.current[ind.uuid];
                    if (ind.id === 'BB') {
                        const [upper, lower] = series;
                        upper.setData(calculatedData.map(d => ({ time: d.time, value: d.value })));
                        lower.setData(calculatedData.map(d => ({ time: d.time, value: d.lower })));
                    } else if (ind.id === 'DC' || ind.id === 'KC') {
                        const [upper, lower, middle] = series;
                        upper.setData(calculatedData.map(d => ({ time: d.time, value: d.value })));
                        lower.setData(calculatedData.map(d => ({ time: d.time, value: d.lower })));
                        middle.setData(calculatedData.map(d => ({ time: d.time, value: d.middle })));
                    } else if (ind.id === 'MACD') {
                        const [macd, signal] = series;
                        macd.setData(calculatedData.map(d => ({ time: d.time, value: d.value })));
                        signal.setData(calculatedData.map(d => ({ time: d.time, value: d.signal })));
                    } else if (ind.id === 'StochRSI' || ind.id === 'STOCH') {
                        const [k, d] = series;
                        k.setData(calculatedData.map(d => ({ time: d.time, value: d.value })));
                        d.setData(calculatedData.map(d => ({ time: d.time, value: d.d })));
                    } else if (ind.id === 'SuperTrend') {
                        // Map color based on trend
                        series.setData(calculatedData.map(d => ({
                            time: d.time,
                            value: d.value,
                            color: d.trend === 1 ? '#00E676' : '#FF5252'
                        })));
                    } else if (ind.id === 'Ichimoku') {
                        const [conversion, base, lagging, spanA, spanB] = series;
                        conversion.setData(calculatedData.map(d => ({ time: d.time, value: d.conversion })));
                        base.setData(calculatedData.map(d => ({ time: d.time, value: d.base })));
                        lagging.setData(calculatedData.map(d => ({ time: d.time, value: d.lagging })));
                        spanA.setData(calculatedData.map(d => ({ time: d.time, value: d.spanA })));
                        spanB.setData(calculatedData.map(d => ({ time: d.time, value: d.spanB })));
                    } else if (ind.id === 'DMI') {
                        const [adx, pdi, mdi] = series;
                        adx.setData(calculatedData.map(d => ({ time: d.time, value: d.adx })));
                        pdi.setData(calculatedData.map(d => ({ time: d.time, value: d.pdi })));
                        mdi.setData(calculatedData.map(d => ({ time: d.time, value: d.mdi })));
                    } else if (ind.id === 'HeikenAshi') {
                        series.setData(calculatedData);
                    } else {
                        // Standard
                        series.setData(calculatedData);
                    }
                } catch (indErr) {
                    console.error(`Error updating indicator ${ind.name}:`, indErr);
                }
            });
        } catch (err) {
            console.error("Error in indicator management:", err);
        }

    }, [activeIndicators, data]);

    // Infinite Scroll
    const stateRef = useRef({ startDate, isLoading, isFullyLoaded, oldestAvailableDate });
    useEffect(() => {
        stateRef.current = { startDate, isLoading, isFullyLoaded, oldestAvailableDate };
    }, [startDate, isLoading, isFullyLoaded, oldestAvailableDate]);

    useEffect(() => {
        if (!chartRef.current) return;
        const chart = chartRef.current;
        const onVisibleLogicalRangeChanged = (newVisibleLogicalRange) => {
            if (newVisibleLogicalRange === null) return;
            const { startDate, isLoading, isFullyLoaded, oldestAvailableDate } = stateRef.current;
            if (newVisibleLogicalRange.from < 10 && !isLoading && !isFullyLoaded && startDate) {
                const currentStart = new Date(startDate);
                const newEnd = new Date(currentStart);
                newEnd.setDate(newEnd.getDate() - 1);
                const newStart = new Date(newEnd);
                newStart.setMonth(newStart.getMonth() - 12);
                if (oldestAvailableDate && newStart < new Date(oldestAvailableDate)) {
                    // Handle oldest date
                }
                fetchData(formatDate(newStart), formatDate(newEnd), false);
            }
        };
        chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
        return () => {
            chart.timeScale().unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
        }
    }, [fetchData]);

    const removeIndicator = (indicatorUuid) => {
        setActiveIndicators(prev => prev.filter(i => i.uuid !== indicatorUuid));
    };

    const handleApplyIndicators = (newIndicators) => {
        setActiveIndicators(newIndicators);
        setIsMenuOpen(false);
    };

    return (
        <div className="w-full h-full p-4 bg-white rounded-lg shadow-lg border border-gray-200 relative">
            <div className="mb-4 flex justify-between items-start text-gray-900">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{company ? company.symbol : 'Select Company'}</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">{company ? company.companyName : 'Please select a company from the list'}</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Tool Menu */}
                    {/* <div className="relative">
                        <button
                            onClick={() => setIsToolMenuOpen(!isToolMenuOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium shadow-sm active:scale-95 ${activeTool ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'}`}
                        >
                            {activeTool ? (
                                <>
                                    {React.createElement(tools.find(t => t.id === activeTool)?.icon || PenTool, { className: "w-4 h-4" })}
                                    <span>{tools.find(t => t.id === activeTool)?.name || 'Tools'}</span>
                                </>
                            ) : (
                                <>
                                    <PenTool className="w-4 h-4" />
                                    <span>Tools</span>
                                </>
                            )}
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {isToolMenuOpen && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <button
                                    onClick={() => { setActiveTool(null); setIsToolMenuOpen(false); }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <MousePointer2 className="w-4 h-4" />
                                    <span>Cursor (None)</span>
                                </button>
                                {tools.map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => { setActiveTool(tool.id); setIsToolMenuOpen(false); }}
                                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 ${activeTool === tool.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    >
                                        <tool.icon className="w-4 h-4" />
                                        <span>{tool.name}</span>
                                    </button>
                                ))}
                                <div className="border-t my-1"></div>
                                <button
                                    onClick={() => { setDrawings([]); setIsToolMenuOpen(false); }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <Eraser className="w-4 h-4" />
                                    <span>Clear All</span>
                                </button>
                            </div>
                        )}
                    </div> */}

                    {data.length > 0 && (
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition-all text-sm font-medium shadow-sm active:scale-95"
                        >
                            <Layers className="w-4 h-4" />
                            <span>Indicators</span>
                            {activeIndicators.length > 0 && (
                                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                    {activeIndicators.length}
                                </span>
                            )}
                            <ChevronDown className="w-4 h-4" />
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    )}


                    {isLoading && <span className="text-sm text-blue-600 animate-pulse font-medium">Loading...</span>}
                </div>
            </div>

            <div className="relative w-full h-[500px]">
                {!isLoading && isFullyLoaded && data.length === 0 && company && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                        <div className="p-4 rounded-full bg-gray-100 mb-4">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No Price Data Available</h3>
                        <p className="text-sm text-gray-500 mt-1">We couldn't find any trading history for this symbol.</p>
                    </div>
                )}
                <div ref={chartContainerRef} className="w-full h-full" />
                {/* <ChartAnnotations
                    chart={chartRef.current}
                    series={seriesRef.current}
                    data={data}
                    activeTool={activeTool}
                    onDrawingComplete={() => setIsDrawing(false)}
                    drawings={drawings}
                    setDrawings={setDrawings}
                /> */}
            </div>

            {/* Active Indicators Legend/List */}
            {activeIndicators.length > 0 && (
                <div className="absolute top-20 left-6 flex flex-col gap-1 pointer-events-none z-50">
                    {activeIndicators.map(ind => (
                        <div key={ind.uuid} className="flex items-center gap-2 text-xs font-medium bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm border border-gray-200 pointer-events-auto w-fit transition-all hover:shadow-md">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ind.color }} />
                            <span className="text-gray-700">{ind.name}</span>
                        </div>
                    ))}
                </div>
            )}

            <IndicatorMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                activeIndicators={activeIndicators}
                onApply={handleApplyIndicators}
            />
        </div>
    );
};

export default PriceActionChart;