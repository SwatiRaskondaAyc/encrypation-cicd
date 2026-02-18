
import { useEffect, useRef, useState, useCallback } from 'react';
// import {
//   createChart,
//   ColorType,
//   CrosshairMode,
//   CandlestickSeries,
// } from 'lightweight-charts';

import { createChart, ColorType, CrosshairMode, LineSeries, HistogramSeries, CandlestickSeries } from 'lightweight-charts';
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
} from 'lucide-react';

import { calculateIndicatorData } from './IndicatorCalculations';
import { PatternRegistry } from './Data/PatternRegistry';
import CandleLoader from './CandleLoader';
import PatternMenu from './PatternMenu';
import IndicatorMenu from './IndicatorMenu';
import AnnotationMenu from './AnnotationMenu';
import ChartAnnotations from './ChartAnnotations';

/* -------------------------------------------------
   Utilities
------------------------------------------------- */
const toBusinessDay = (yyyyMMdd) => {
  if (!yyyyMMdd) return null;
  const [year, month, day] = yyyyMMdd.split('-').map(Number);
  return { year, month, day };
};

const formatDate = (date) => date.toISOString().split('T')[0];

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

/* -------------------------------------------------
   Component
------------------------------------------------- */
function ResearchChart({ company }) {
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const canvasRef = useRef(null);
  const indicatorSeriesRef = useRef({});
  const isFitRef = useRef(false);

  const dataRef = useRef([]);
  const patternsRef = useRef([]);
  const activePatternIdsRef = useRef([]);

  const [data, setData] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [activePatternIds, setActivePatternIds] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [startDate, setStartDate] = useState(null);

  const [activeIndicators, setActiveIndicators] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPatternMenuOpen, setIsPatternMenuOpen] = useState(false);
  const [isAnnotationMenuOpen, setIsAnnotationMenuOpen] = useState(false);

  const [activeTool, setActiveTool] = useState(null);
  const [drawings, setDrawings] = useState([]);

  const [chartReady, setChartReady] = useState(false);
  const [currentOHLC, setCurrentOHLC] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [patternsFetched, setPatternsFetched] = useState(false);
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);

  const chartWrapperRef = useRef(null);
  const toggleFullScreen = async () => {
  if (!chartWrapperRef.current) return;

  if (!document.fullscreenElement) {
    try {
      await chartWrapperRef.current.requestFullscreen();
    } catch (err) {
      console.warn('Fullscreen not supported or denied:', err);
    }
  } else {
    await document.exitFullscreen();
  }
};

useEffect(() => {
  const handleChange = () => {
    setIsFullScreen(!!document.fullscreenElement);
  };
  document.addEventListener('fullscreenchange', handleChange);
  return () => document.removeEventListener('fullscreenchange', handleChange);
}, []);

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  /* -------------------------------------------------
     Fetch price data
  ------------------------------------------------- */
  const fetchData = useCallback(
    async (start, end, isInitial = false) => {
      if (!company?.fincode || isLoading || (isFullyLoaded && !isInitial)) return;
      setIsLoading(true);

      try {
        const url = new URL(`${API_BASE}/equity-insights/price-action-history/${company.fincode}`);
        if (start) url.searchParams.append('start_date', start);
        if (end) url.searchParams.append('end_date', end);

        const response = await fetch(url);
        const result = await response.json();

        if (result?.status !== 'success') throw new Error('API failed');

        const pd = result.data.price_data;
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

        if (isInitial) {
          setData(rows);
          if (rows.length > 0) {
            const oldest = rows[0].time;
            setStartDate(`${oldest.year}-${String(oldest.month).padStart(2, '0')}-${String(oldest.day).padStart(2, '0')}`);
          }
          setHasInitialLoaded(true);
        } else {
          setData((prev) => {
            const combined = [...rows, ...prev];
            const map = new Map();
            combined.forEach((item) => {
              const key = `${item.time.year}-${item.time.month}-${item.time.day}`;
              map.set(key, item);
            });
            return Array.from(map.values()).sort((a, b) => {
              const da = new Date(`${a.time.year}-${a.time.month}-${a.time.day}`);
              const db = new Date(`${b.time.year}-${b.time.month}-${b.time.day}`);
              return da - db;
            });
          });
        }

        if (rows.length === 0) {
          setIsFullyLoaded(true);
        }
      } catch (err) {
        console.error(err);
        setIsFullyLoaded(true);
      } finally {
        setIsLoading(false);
      }
    },
    [company?.fincode]
  );

  /* -------------------------------------------------
     Initial load & reset
  ------------------------------------------------- */
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
    setDrawings([]);
    setActiveTool(null);
    setActiveIndicators([]);
    setIsFullyLoaded(false);
    setStartDate(null);
    setHasInitialLoaded(false);
    isFitRef.current = false;

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    fetchData(formatDate(oneYearAgo), formatDate(today), true);
  }, [company?.fincode, fetchData]);

  /* -------------------------------------------------
     Fetch patterns when menu opens
  ------------------------------------------------- */
  useEffect(() => {
    if (!isPatternMenuOpen || !company?.fincode || patternsFetched) return;

    const fetchPatterns = async () => {
      try {
        const url = new URL(`${API_BASE}/equity-insights/micro-patterns/${company.fincode}`);
        const response = await fetch(url);
        const result = await response.json();

        if (result?.status === 'success' && result.data) {
          const pd = result.data;
          const transformed = [];
          for (let i = 0; i < (pd.Pattern_ID?.length || 0); i++) {
            const date = pd.endDate?.[i] || pd.startDate?.[i];
            if (date) {
              transformed.push({
                patternId: pd.Pattern_ID[i],
                date: date.split('T')[0],
                score: pd.final_confidence?.[i] || 0,
              });
            }
          }
          setPatterns(transformed);
        } else {
          setPatterns([]);
        }
        setPatternsFetched(true);
      } catch (err) {
        console.error('Failed to fetch patterns:', err);
        setPatterns([]);
        setPatternsFetched(true);
      }
    };

    fetchPatterns();
  }, [isPatternMenuOpen, company?.fincode, patternsFetched]);

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
    canvas.width = container.clientWidth * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, container.clientWidth, height);

    const timeScale = chart.timeScale();
    const barSpacing = timeScale.options().barSpacing;
    const PADDING = 4;
    const BORDER_RADIUS = 4;

    const leftPriceScaleWidth = chart.priceScale('left').width();
    const rightPriceScaleWidth = chart.priceScale('right').width();
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
      const bias = meta?.bias || 'neutral';
      const colorMap = {
        bullish: { fill: 'rgba(16, 185, 129, 0.2)', stroke: '#10b981' },
        bearish: { fill: 'rgba(239, 68, 68, 0.2)', stroke: '#ef4444' },
        neutral: { fill: 'rgba(139, 92, 246, 0.2)', stroke: '#8b5cf6' },
      };
      const style = colorMap[bias] || colorMap.neutral;

      const xCoord = timeScale.timeToCoordinate(toBusinessDay(p.date));
      if (xCoord === null) return;
      const x = Math.round(xCoord + leftPriceScaleWidth);

      const candleIndex = currentData.findIndex(
        (d) =>
          `${d.time.year}-${String(d.time.month).padStart(2, '0')}-${String(d.time.day).padStart(2, '0')}` === p.date
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
      const labelText = meta?.shortName || 'PAT';
      const badgeY = rectY - 18;
      ctx.fillStyle = style.stroke;
      ctx.font = 'bold 10px sans-serif';
      const tm = ctx.measureText(labelText);
      const badgeW = tm.width + 8;
      const badgeX = x - badgeW / 2;

      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, 14, 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
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
    container.innerHTML = '';

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 500,
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#334155',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        attributionLogo: false,
      },
      grid: { vertLines: { color: '#f1f5f9' }, horzLines: { color: '#f1f5f9' } },
      rightPriceScale: { borderColor: '#e2e8f0', scaleMargins: { top: 0.1, bottom: 0.1 } },
      leftPriceScale: { visible: true, borderColor: '#e2e8f0' },
      timeScale: { borderColor: '#e2e8f0', timeVisible: true },
      crosshair: { mode: CrosshairMode.Magnet },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    // Overlay canvas for patterns
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    setChartReady(true);

    chart.subscribeCrosshairMove((param) => {
      const price = param.seriesPrices?.get(candleSeries);
      if (price) setCurrentOHLC(price);
    });

    const handleChange = () => requestAnimationFrame(drawHighlights);
    chart.timeScale().subscribeVisibleLogicalRangeChange(handleChange);

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth, height: container.clientHeight });
      requestAnimationFrame(drawHighlights);
    });
    resizeObserver.observe(container);

    if (!isFitRef.current) {
      chart.timeScale().fitContent();
      isFitRef.current = true;
    }

    return () => {
      resizeObserver.disconnect();
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleChange);
      chart.remove();
      if (canvas) canvas.remove();
    };
  }, [company?.fincode, drawHighlights]);

  /* -------------------------------------------------
     Update candles & redraw highlights
  ------------------------------------------------- */
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
      drawHighlights();
    }
  }, [data, drawHighlights]);

  useEffect(() => {
    requestAnimationFrame(drawHighlights);
  }, [activePatternIds, patterns, drawHighlights]);

  /* -------------------------------------------------
     Full Indicator Management (creation + setData)
  ------------------------------------------------- */
  useEffect(() => {
    if (!chartRef.current || data.length === 0 || !chartReady) return;

    const currentIds = new Set(activeIndicators.map((i) => i.uuid));

    // Remove deselected indicators
    Object.keys(indicatorSeriesRef.current).forEach((uuid) => {
      if (!currentIds.has(uuid)) {
        const s = indicatorSeriesRef.current[uuid];
        if (Array.isArray(s)) s.forEach((sub) => chartRef.current.removeSeries(sub));
        else chartRef.current.removeSeries(s);
        delete indicatorSeriesRef.current[uuid];
      }
    });

    // Add or update active indicators
    activeIndicators.forEach((ind) => {
      const calculatedData = calculateIndicatorData(ind.id, data, ind.params || ind.defParams);
      if (!calculatedData || calculatedData.length === 0) return;

      // Create series if not exists
      if (!indicatorSeriesRef.current[ind.uuid]) {
        const addLine = (title, color, lineWidth = 1, priceScaleId = 'right') => {
          const chart = chartRef.current;
          if (!chart) throw new Error('Chart not initialized');
          if (typeof chart.addLineSeries === 'function') {
            return chart.addLineSeries({ title, color, lineWidth, priceScaleId, crosshairMarkerVisible: false });
          }
          if (typeof chart.addSeries === 'function' && typeof LineSeries !== 'undefined') {
            return chart.addSeries(LineSeries, { title, color, lineWidth, priceScaleId, crosshairMarkerVisible: false });
          }
          throw new Error('No supported API to create line series on chart');
        };

        if (ind.id === 'BB') {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine('BB Upper', ind.color, 1),
            addLine('BB Lower', ind.color, 1),
          ];
        } else if (ind.id === 'MACD') {
          const macd = addLine('MACD', ind.color, 2, 'left');
          const signal = addLine('Signal', '#FF5252', 1, 'left');
          const hist = (typeof chartRef.current.addHistogramSeries === 'function')
            ? chartRef.current.addHistogramSeries({ title: 'Histogram', priceScaleId: 'left', color: '#26a69a' })
            : chartRef.current.addSeries(HistogramSeries, { title: 'Histogram', priceScaleId: 'left', color: '#26a69a' });
          indicatorSeriesRef.current[ind.uuid] = [macd, signal, hist];
        } else if (ind.id === 'GMMA') {
          const seriesArr = [];
          const shortPeriods = ind.params?.shortPeriods || ind.defParams.shortPeriods;
          const longPeriods = ind.params?.longPeriods || ind.defParams.longPeriods;
          shortPeriods.forEach(() => seriesArr.push(addLine(`GMMA Short`, '#00bcd4', 1)));
          longPeriods.forEach(() => seriesArr.push(addLine(`GMMA Long`, '#ff5722', 1)));
          indicatorSeriesRef.current[ind.uuid] = seriesArr;
        } else if (ind.id === 'Ichimoku') {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine('Tenkan', '#0496FF', 1),
            addLine('Kijun', '#99154E', 1),
            addLine('Span A', '#4CAF50', 1),
            addLine('Span B', '#F44336', 1),
            addLine('Lagging', '#808080', 1),
          ];
        } else if (ind.id === 'HeikenAshi') {
          const haSeries = (typeof chartRef.current.addCandlestickSeries === 'function')
            ? chartRef.current.addCandlestickSeries({ upColor: ind.color, downColor: '#000000', borderVisible: false, wickUpColor: ind.color, wickDownColor: '#000000' })
            : chartRef.current.addSeries(CandlestickSeries, { upColor: ind.color, downColor: '#000000', borderVisible: false, wickUpColor: ind.color, wickDownColor: '#000000' });
          indicatorSeriesRef.current[ind.uuid] = haSeries;
        } else if (ind.id === 'DMI') {
          indicatorSeriesRef.current[ind.uuid] = [
            addLine('+DI', '#4CAF50', 1, 'left'),
            addLine('-DI', '#F44336', 1, 'left'),
            addLine('ADX', '#FF9800', 1, 'left'),
          ];
        } else if (ind.id === 'VolOsc') {
          indicatorSeriesRef.current[ind.uuid] = addLine('Vol Osc', ind.color, 1, 'left');
        } else {
          const OVERLAY_IDS = new Set(['SMA', 'EMA', 'WMA', 'WEMA', 'BB', 'DC', 'KC', 'PSAR', 'SuperTrend', 'HMA', 'TEMA', 'VWAP']);
          const isOverlay = OVERLAY_IDS.has(ind.id);
          indicatorSeriesRef.current[ind.uuid] = addLine(ind.name, ind.color, 2, isOverlay ? 'right' : 'left');
        }
      }

      // Update data
      const series = indicatorSeriesRef.current[ind.uuid];

      if (ind.id === 'BB') {
        series[0].setData(calculatedData.map((d) => ({ time: d.time, value: d.upper })));
        series[1].setData(calculatedData.map((d) => ({ time: d.time, value: d.lower })));
      } else if (ind.id === 'MACD') {
        series[0].setData(calculatedData.map((d) => ({ time: d.time, value: d.value })));
        series[1].setData(calculatedData.map((d) => ({ time: d.time, value: d.signal })));
        series[2].setData(
          calculatedData.map((d) => ({
            time: d.time,
            value: d.histogram,
            color: d.histogram >= 0 ? '#26a69a' : '#ef5350',
          }))
        );
      } else if (ind.id === 'GMMA') {
        const shortPeriods = ind.params?.shortPeriods || ind.defParams.shortPeriods;
        const longPeriods = ind.params?.longPeriods || ind.defParams.longPeriods;
        let sIdx = 0;
        shortPeriods.forEach((p) => {
          series[sIdx++].setData(calculatedData.map((d) => ({ time: d.time, value: d[`short${p}`] })));
        });
        longPeriods.forEach((p) => {
          series[sIdx++].setData(calculatedData.map((d) => ({ time: d.time, value: d[`long${p}`] })));
        });
      } else if (ind.id === 'Ichimoku') {
        series[0].setData(calculatedData.map((d) => ({ time: d.time, value: d.conversion })));
        series[1].setData(calculatedData.map((d) => ({ time: d.time, value: d.base })));
        series[2].setData(calculatedData.map((d) => ({ time: d.time, value: d.spanA })));
        series[3].setData(calculatedData.map((d) => ({ time: d.time, value: d.spanB })));
        series[4].setData(calculatedData.map((d) => ({ time: d.time, value: d.lagging })));
      } else if (ind.id === 'HeikenAshi') {
        series.setData(calculatedData);
      } else if (ind.id === 'DMI') {
        series[0].setData(calculatedData.map((d) => ({ time: d.time, value: d.pdi })));
        series[1].setData(calculatedData.map((d) => ({ time: d.time, value: d.mdi })));
        series[2].setData(calculatedData.map((d) => ({ time: d.time, value: d.adx })));
      } else if (ind.id === 'STOCH' || ind.id === 'StochRSI') {
        series.setData(calculatedData.map((d) => ({ time: d.time, value: d.k || d.value })));
      } else {
        series.setData(calculatedData);
      }
    });
  }, [activeIndicators, data, chartReady]);

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
      if (newVisibleLogicalRange.from < 10 && !isLoading && !isFullyLoaded && startDate) {
        const currentStart = new Date(startDate);
        const newEnd = new Date(currentStart);
        newEnd.setDate(newEnd.getDate() - 1);
        const newStart = new Date(newEnd);
        newStart.setMonth(newStart.getMonth() - 12);
        fetchData(formatDate(newStart), formatDate(newEnd), false);
      }
    };
    const debouncedRangeChanged = debounce(onVisibleLogicalRangeChanged, 300); // Debounce to prevent rapid calls
    chart.timeScale().subscribeVisibleLogicalRangeChange(debouncedRangeChanged);
    return () => {
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(debouncedRangeChanged);
    };
  }, [fetchData]);

  /* -------------------------------------------------
     UI Components
  ------------------------------------------------- */
  const OHLCItem = ({ label, value, color = 'text-slate-700' }) => (
    <div className="flex flex-col items-center">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );

  return (
    <div ref={chartWrapperRef}
      className={`bg-white shadow-lg border border-slate-200 overflow-hidden flex flex-col ${
        isFullScreen ? 'fixed inset-0 z-50 w-full h-full m-0 rounded-none' : 'rounded-2xl'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                <BarChart3 className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{company?.symbol || 'Select Company'}</h3>
                <p className="text-slate-600 text-sm font-medium">{company?.companyName || 'Please select a company'}</p>
              </div>
            </div>

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
                  color={currentOHLC.close >= currentOHLC.open ? 'text-green-600' : 'text-red-600'}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {data.length > 0 && (
              <>
                <button
                  onClick={() => setIsAnnotationMenuOpen(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium shadow-sm ${
                    activeTool
                      ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Drawing</span>
                  {drawings.length > 0 && (
                    <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{drawings.length}</span>
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
      <div className={`flex-1 ${isFullScreen ? 'p-0' : 'p-6'}`}>
        <div
          className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-white"
          style={{ height: isFullScreen ? '100%' : '500px', border: isFullScreen ? 'none' : undefined, borderRadius: isFullScreen ? '0' : undefined }}
        >
          {!isLoading && isFullyLoaded && data.length === 0 && company && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
              <div className="p-4 rounded-full bg-gray-100 mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No Price Data Available</h3>
              <p className="text-sm text-gray-500 mt-1">We couldn't find any trading history for this symbol.</p>
            </div>
          )}

          {isLoading && (
            <div
              className={`absolute z-50 flex items-center justify-center ${
                data.length === 0 ? 'inset-0 bg-white/80 backdrop-blur-sm' : 'top-6 left-20 scale-[0.4] origin-top-left'
              }`}
            >
              <CandleLoader />
            </div>
          )}

          {data.length > 0 && (activeTool || drawings.length > 0) && (
            <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-3 py-2">
              {activeTool ? (
                <>
                  <PenTool className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-medium text-slate-700 capitalize">{activeTool.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <button
                    onClick={() => setActiveTool(null)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                    title="Exit drawing mode"
                  >
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                </>
              ) : (
                <span className="text-xs text-slate-500">{drawings.length} drawing{drawings.length !== 1 ? 's' : ''}</span>
              )}
              {drawings.length > 0 && (
                <>
                  <div className="w-px h-4 bg-slate-200" />
                  <button
                    onClick={() => setActiveTool('eraser')}
                    className={`p-1 rounded transition-colors ${activeTool === 'eraser' ? 'bg-red-100 text-red-600' : 'hover:bg-slate-100 text-slate-500'}`}
                    title="Eraser"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDrawings([])}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          )}

          <div ref={chartContainerRef} className="w-full h-full" />

          {chartReady && data.length > 0 && (
            <ChartAnnotations
              chart={chartRef.current}
              series={seriesRef.current}
              data={data}
              activeTool={activeTool}
              drawings={drawings}
              setDrawings={setDrawings}
            />
          )}
        </div>
      </div>

      {/* Menus */}
      <IndicatorMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeIndicators={activeIndicators}
        onApply={setActiveIndicators}
      />

      <PatternMenu
        isOpen={isPatternMenuOpen}
        onClose={() => setIsPatternMenuOpen(false)}
        activePatterns={activePatternIds}
        onApply={setActivePatternIds}
      />

      <AnnotationMenu
        isOpen={isAnnotationMenuOpen}
        onClose={() => setIsAnnotationMenuOpen(false)}
        activeTool={activeTool}
        onSelectTool={setActiveTool}
      />
    </div>
  );
}

export default ResearchChart;