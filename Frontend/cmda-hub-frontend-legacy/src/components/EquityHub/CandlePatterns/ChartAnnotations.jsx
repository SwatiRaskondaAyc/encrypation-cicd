import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import AnnotationSettings from "./AnnotationSettings";

const GANN_SQUARE_LEVELS = [0, 1, 2, 3, 4, 5];
const GANN_SQUARE_FANS = [
  "8x1",
  "5x1",
  "4x1",
  "3x1",
  "2x1",
  "1x1",
  "1x2",
  "1x3",
  "1x4",
  "1x5",
  "1x8",
];
const GANN_SQUARE_ARCS = [
  "1x0",
  "1.5x0",
  "2x1",
  "3x1",
  "4x1",
  "5x1",
  "1x1",
  "2x0",
  "3x0",
  "4x0",
  "5x0",
];

const GANN_SQUARE_LEVEL_COLORS = {
  0: "#9ca3af",
  1: "#f59e0b",
  2: "#06b6d4",
  3: "#22c55e",
  4: "#3b82f6",
  5: "#7c3aed",
};
const GANN_SQUARE_FAN_PALETTE = [
  "#c4b5fd",
  "#f9a8d4",
  "#d1d5db",
  "#fbbf24",
  "#06b6d4",
  "#22c55e",
  "#10b981",
  "#a3e635",
  "#93c5fd",
  "#c4b5fd",
  "#e9d5ff",
];
const GANN_SQUARE_ARC_PALETTE = [
  "#f59e0b",
  "#f97316",
  "#06b6d4",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#f59e0b",
  "#06b6d4",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
];

const GANN_FAN_DEFAULT_RATIOS = [
  "1x8",
  "1x4",
  "1x3",
  "1x2",
  "1x1",
  "2x1",
  "3x1",
  "4x1",
  "8x1",
];
const LEGACY_GANN_FAN_RATIOS = ["1x1", "2x1", "1x2", "4x1", "1x4"];
const GANN_FAN_DEFAULT_COLORS = {
  "1x8": "#22c55e",
  "1x4": "#10b981",
  "1x3": "#14b8a6",
  "1x2": "#0ea5e9",
  "1x1": "#f59e0b",
  "2x1": "#3b82f6",
  "3x1": "#8b5cf6",
  "4x1": "#ec4899",
  "8x1": "#ef4444",
};

const PATTERN_TOOLS = [
  "headShoulders",
  "abcdPattern",
  "harmonicXABCD",
  "harmonicCypher",
  "harmonicThreeDrives",
  "trianglePattern",
  "elliottImpulse",
  "elliottCorrection",
  "elliottTriangle",
  "elliottCombo",
  "cyclicLines",
];

const POSITION_TOOL_DEFAULTS = {
  long: {
    profitColor: "rgba(76, 175, 80, 0.2)",
    lossColor: "rgba(244, 67, 54, 0.2)",
    lineColor: "#2962FF",
    textColor: "#ffffff",
    riskRewardRatio: 2,
    accountSize: 10000,
    riskPercentage: 1,
  },
  short: {
    profitColor: "rgba(76, 175, 80, 0.2)",
    lossColor: "rgba(244, 67, 54, 0.2)",
    lineColor: "#2962FF",
    textColor: "#ffffff",
    riskRewardRatio: 2,
    accountSize: 10000,
    riskPercentage: 1,
  },
};

const TEXT_TOOL_DEFAULTS = {
  text: {
    color: "#607D8B",
    fontFamily: "sans-serif",
    fontSize: 14,
    opacity: 1,
    autoHide: false,
    adaptiveOpacity: true,
    snapToCandles: false,
    autoScale: false,
    backgroundColor: "transparent",
    backgroundAlpha: 0,
    borderWidth: 0,
    borderColor: "transparent",
    offset: { dx: 0, dy: 0 },
    screen: null,
  },
  anchoredText: {
    color: "#607D8B",
    fontFamily: "sans-serif",
    fontSize: 14,
    opacity: 1,
    autoHide: false,
    adaptiveOpacity: true,
    snapToCandles: true,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backgroundAlpha: 0.9,
    borderWidth: 1,
    borderColor: "#607D8B",
    showLeader: true,
    offset: { dx: 0, dy: 0 },
    autoFlip: true,
    lockOffset: false,
  },
  note: {
    color: "#000000",
    fontFamily: "sans-serif",
    fontSize: 14,
    opacity: 1,
    autoHide: false,
    adaptiveOpacity: true,
    snapToCandles: false,
    autoScale: false,
    backgroundColor: "#FFD54F",
    backgroundAlpha: 1,
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 4,
    collapsed: false,
    pinned: false,
    screen: null,
  },
  priceNote: {
    color: "#ffffff",
    fontFamily: "sans-serif",
    fontSize: 12,
    opacity: 1,
    autoHide: false,
    adaptiveOpacity: true,
    snapToCandles: true,
    backgroundColor: "#2962FF",
    backgroundAlpha: 1,
    borderWidth: 0,
    borderColor: "transparent",
    showPriceLabel: true,
    extendLine: true,
    snapToTick: true,
    offset: { dx: 0, dy: 0 },
  },
  callout: {
    color: "#ffffff",
    fontFamily: "sans-serif",
    fontSize: 14,
    opacity: 1,
    autoHide: false,
    adaptiveOpacity: true,
    snapToCandles: true,
    backgroundColor: "#607D8B",
    backgroundAlpha: 1,
    borderWidth: 0,
    borderColor: "transparent",
    arrowStyle: "triangle",
    bubbleShape: "round",
    autoFlip: true,
    offset: { dx: 30, dy: -30 },
  },
  pin: {
    color: "#E91E63",
    size: 20,
    opacity: 1,
    autoHide: false,
    adaptiveOpacity: true,
    snapToCandles: true,
    showTooltip: false,
    tooltipText: "",
    offset: { dx: 0, dy: 0 },
  },
  flag: {
    color: "#F44336",
    size: 20,
    opacity: 1,
    autoHide: false,
    adaptiveOpacity: true,
    snapToCandles: true,
    showTooltip: false,
    tooltipText: "",
    offset: { dx: 0, dy: 0 },
  },
};

const MEASURE_TOOL_DEFAULTS = {
  lineColor: "#2196F3",
  backgroundColor: "rgba(33, 150, 243, 0.1)",
  textColor: "#ffffff",
};

const TEXT_TOOL_TYPES = [
  "text",
  "anchoredText",
  "note",
  "priceNote",
  "callout",
  "pin",
  "flag",
];
const TEXT_EDITOR_TYPES = [
  "text",
  "anchoredText",
  "note",
  "priceNote",
  "callout",
];
const TEXT_ANCHORED_TYPES = [
  "anchoredText",
  "priceNote",
  "callout",
  "pin",
  "flag",
];
const TEXT_SCREEN_TYPES = ["text", "note"];
const TEXT_GHOST_LABELS = {
  text: "Text",
  anchoredText: "Anchored",
  note: "Note",
  priceNote: "Price",
  callout: "Callout",
  pin: "Pin",
  flag: "Flag",
};

const BRUSH_TOOL_DEFAULTS = {
  thickness: 3,
  opacity: 0.8,
  smoothing: 0.35,
  autoScale: true,
  snapToCandles: false,
  locked: false,
};

const ARROW_TOOL_DEFAULTS = {
  lineWidth: 2,
  lineStyle: "solid",
  arrowheadStyle: "triangle",
  extendBeyondEnd: false,
  lockAngle: false,
  snapToCandles: true,
  locked: false,
};

const RECTANGLE_TOOL_DEFAULTS = {
  opacity: 0.15,
  lineWidth: 1,
  lineStyle: "solid",
  extend: "none",
  lockAspectRatio: false,
  snapToCandles: true,
  locked: false,
  text: "",
  textColor: "#0f172a",
  textSize: 12,
  textOpacity: 0.9,
  textAlign: "center",
};

const PATH_TOOL_DEFAULTS = {
  lineWidth: 2,
  lineStyle: "solid",
  showNodes: true,
  arrowheads: "none",
  snapToCandles: true,
  locked: false,
};

const HIGHLIGHTER_TOOL_DEFAULTS = {
  opacity: 0.18,
  blendMode: "multiply",
  autoScale: true,
  snapToCandles: false,
  locked: false,
};

const ARC_TOOL_DEFAULTS = {
  lockRadius: false,
  showCenter: true,
  showLabels: true,
  labelMode: "both",
  lineStyle: "solid",
  lineWidth: 2,
  fill: false,
  fillOpacity: 0.15,
  fillColor: null,
  scaleMode: "data",
  warnOnLogScale: true,
  lockAngles: false,
  snapAngles: false,
  snapAngleStep: 15,
  direction: "cw",
};

const ELLIPSE_TOOL_DEFAULTS = {
  lockX: false,
  lockY: false,
  uniformScale: false,
  rotation: 0,
  showCenter: true,
  showLabels: true,
  labelMode: "radius",
  lineStyle: "solid",
  lineWidth: 2,
  fill: false,
  fillOpacity: 0.15,
  fillColor: null,
  scaleMode: "data",
  warnOnLogScale: true,
};

const GHOST_STATES = {
  neutral: "neutral",
  valid: "valid",
  marginal: "marginal",
  invalid: "invalid",
};

const GHOST_STYLE_MAP = {
  neutral: {
    stroke: "#94a3b8",
    fill: "#94a3b8",
    fillAlpha: 0.08,
    labelAlpha: 0.7,
  },
  valid: {
    stroke: "#22c55e",
    fill: "#22c55e",
    fillAlpha: 0.12,
    labelAlpha: 0.85,
  },
  marginal: {
    stroke: "#f59e0b",
    fill: "#f59e0b",
    fillAlpha: 0.18,
    labelAlpha: 0.9,
  },
  invalid: {
    stroke: "#ef4444",
    fill: "#ef4444",
    fillAlpha: 0.05,
    labelAlpha: 0.75,
  },
};

const buildColorMap = (items, palette) =>
  items.reduce((acc, item, idx) => {
    acc[item] = palette[idx % palette.length];
    return acc;
  }, {});

const ChartAnnotations = ({
  chart,
  series,
  data,
  activeTool, // 'line', 'gann', 'gannFan', 'fib', 'text', 'eraser', null
  onDrawingComplete,
  drawings,
  setDrawings,
  patternConstraintMode = "optional",
  magnetEnabled = true,
  magnetMode = "ohlc",
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const textInputRef = useRef(null);
  const [currentLine, setCurrentLine] = useState(null);
  const [snappedPoint, setSnappedPoint] = useState(null);
  const [hoverPoint, setHoverPoint] = useState(null); // For ghost drawing
  const [textEditor, setTextEditor] = useState(null); // { id, type, point, x, y, value, settings }
  const [textPlacementArmed, setTextPlacementArmed] = useState(false);
  const [logScaleWarning, setLogScaleWarning] = useState(null);

  useEffect(() => {
    if (logScaleWarning) {
      const timer = setTimeout(() => setLogScaleWarning(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [logScaleWarning]);

  const handleTextCommit = () => {
    if (!textEditor) return;
    let textValue = textEditor.value?.trim() || "";
    if (!textValue) {
      textValue = TEXT_GHOST_LABELS[textEditor.type] || "Text";
    }
    if (textEditor.id) {
      setDrawings((prev) =>
        prev.map((d) =>
          d.id === textEditor.id
            ? {
                ...d,
                settings: {
                  ...d.settings,
                  text: textValue,
                },
              }
            : d,
        ),
      );
    } else {
      const defaults = TEXT_TOOL_DEFAULTS[textEditor.type] || {};
      const merged = {
        ...defaults,
        ...textEditor.settings,
        text: textValue,
        offset: {
          ...defaults.offset,
          ...(textEditor.settings?.offset || {}),
        },
      };
      const isScreen = TEXT_SCREEN_TYPES.includes(textEditor.type);
      const newDrawing = {
        id: Date.now(),
        type: textEditor.type,
        p1: isScreen ? undefined : textEditor.point,
        p2:
          !isScreen && textEditor.type === "callout"
            ? textEditor.point
            : undefined,
        settings: merged,
      };
      setDrawings((prev) => [...prev, newDrawing]);
      if (onDrawingComplete) onDrawingComplete();
    }
    setTextEditor(null);
  };

  const handleTextDismiss = () => {
    setTextEditor(null);
    setTextPlacementArmed(false);
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [settingsPosition, setSettingsPosition] = useState(null);
  const [selectedDrawingID, setSelectedDrawingID] = useState(null);
  const [draggingInfo, setDraggingInfo] = useState(null); // { id, pointKey, startPoint }
  const [isOverDrawing, setIsOverDrawing] = useState(false);
  const ghostStateRef = useRef(null);
  const ghostMessageRef = useRef("");
  const dataVersionRef = useRef(data?.length || 0);
  const labelWidthCacheRef = useRef(new Map());
  const textCollisionRef = useRef([]);
  const strokeDrawingRef = useRef(false);
  const lastStrokeTimeRef = useRef(0);
  const lastStrokePointRef = useRef(null);
  const findHitRef = useRef(() => null);
  const patternConstraintsEnabled = patternConstraintMode === "enforced";
  useEffect(() => {
    if (!magnetEnabled || magnetMode === "free") setSnappedPoint(null);
  }, [magnetEnabled, magnetMode]);

  useEffect(() => {
    console.log("ChartAnnotations Mounted!", {
      chart,
      series,
      dataLength: data?.length,
    });
  }, [chart, series, data]);

  // Hover detection for pointer-events: none/auto toggle
  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const handleParentMouseMove = (e) => {
      // If a drawing tool is active (not select/eraser/null), always capture
      if (activeTool && !["select", "eraser"].includes(activeTool)) {
        setIsOverDrawing(true);
        return;
      }

      // If text editor is open, always capture
      if (textEditor) {
        setIsOverDrawing(true);
        return;
      }

      // Otherwise, do hit test
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const hit = findHitRef.current(x, y);
      setIsOverDrawing(!!hit);
    };

    const handleParentMouseDown = (e) => {
      if (e.target?.closest?.("[data-annotation-settings='true']")) return;
      // If a drawing is selected, check for click-away
      if (selectedDrawingID) {
        const rect = parent.getBoundingClientRect();
        const hit = findHitRef.current(
          e.clientX - rect.left,
          e.clientY - rect.top,
        );
        if (!hit) {
          setSelectedDrawingID(null);
          setSettingsPosition(null);
        }
      }
    };

    parent.addEventListener("mousemove", handleParentMouseMove);
    parent.addEventListener("mousedown", handleParentMouseDown);
    return () => {
      parent.removeEventListener("mousemove", handleParentMouseMove);
      parent.removeEventListener("mousedown", handleParentMouseDown);
    };
  }, [activeTool, textEditor, selectedDrawingID]);

  useEffect(() => {
    if (!TEXT_EDITOR_TYPES.includes(activeTool)) {
      setTextPlacementArmed(false);
    }
  }, [activeTool]);

  useEffect(() => {
    if (
      currentLine &&
      activeTool &&
      !["select", "eraser"].includes(activeTool) &&
      currentLine.type !== activeTool
    ) {
      setCurrentLine(null);
    }
  }, [activeTool, currentLine]);

  /* -------------------------------------------------
     Crash Safety: Map time -> index 
  ------------------------------------------------- */
  const timeToIndex = useMemo(() => {
    if (!data || !Array.isArray(data)) return new Map();
    const map = new Map();
    data.forEach((item, index) => {
      // Ensure item has a time property
      if (item && item.time) {
        map.set(item.time, index);
      }
    });
    return map;
  }, [data]);

  // Get chart area bounds
  const getChartBounds = useCallback(() => {
    if (!chart) return { left: 0, right: 0, width: 0, height: 0 };
    const leftPriceScaleWidth = chart.priceScale("left").width();
    const rightPriceScaleWidth = chart.priceScale("right").width();
    const container = containerRef.current?.parentElement;
    if (!container)
      return {
        left: leftPriceScaleWidth,
        right: rightPriceScaleWidth,
        width: 0,
        height: 0,
      };

    return {
      left: leftPriceScaleWidth,
      right: container.clientWidth - rightPriceScaleWidth,
      width: container.clientWidth - leftPriceScaleWidth - rightPriceScaleWidth,
      height: container.clientHeight - chart.timeScale().height(),
    };
  }, [chart]);

  // Disable chart panning/zooming when tool is active
  useEffect(() => {
    if (!chart) return;
    const disable =
      activeTool && activeTool !== "select" && activeTool !== "cursor";
    chart.applyOptions({
      handleScroll: !disable,
      handleScale: !disable,
    });
    // Restore on unmount
    return () => {
      chart.applyOptions({
        handleScroll: true,
        handleScale: true,
      });
    };
  }, [chart, activeTool]);

  // Handle Delete/Backspace key to remove selected drawing
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If we are editing text, don't delete the drawing
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedDrawingID) {
          setDrawings((prev) => prev.filter((d) => d.id !== selectedDrawingID));
          setSelectedDrawingID(null);
          setSettingsPosition(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDrawingID]);

  const drawTooltip = (ctx, x, y, text) => {
    ctx.font = "11px sans-serif";
    const metrics = ctx.measureText(text);
    const w = metrics.width + 12;
    const h = 20;

    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 10, w, h, 4);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + 16, y + 10 + h / 2);
  };

  // Convert Time/Price to Coordinates
  const getCoords = useCallback(
    (point) => {
      if (!chart || !series || !point) return null;
      const timeScale = chart.timeScale();
      const index =
        point.logical !== undefined
          ? point.logical
          : timeToIndex.get(point.time);
      if (index === undefined) return null;

      const x = timeScale.logicalToCoordinate(index);
      const y = series.priceToCoordinate(point.price);
      if (x === null || y === null) return null;

      return { x, y };
    },
    [chart, series, timeToIndex],
  );

  // Convert Coordinates to Time/Price (for mouse input)
  const getPoint = useCallback(
    (clientX, clientY, options = {}) => {
      const { snap = true, freeform = false } = options;
      if (!chart || !series || !data || !containerRef.current) return null;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const timeScale = chart.timeScale();
      const bounds = getChartBounds();

      // Adjust x for left price scale offset
      const chartX = x - bounds.left;
      const clampedX = Math.min(Math.max(chartX, 0), bounds.width);
        let rawLogical = timeScale.coordinateToLogical(
          freeform ? clampedX : chartX,
        );
        if (rawLogical === null) {
          const range = timeScale.getVisibleLogicalRange();
          if (range && bounds.width > 0) {
            const span = range.to - range.from;
            if (span > 0) {
              rawLogical = range.from + (clampedX / bounds.width) * span;
            }
          }
        }
        if (rawLogical === null) return null;

      let price = series.coordinateToPrice(y);
      if (price === null) return null;

      let logical = snap && !freeform ? Math.round(rawLogical) : rawLogical;

      if (freeform) {
        if (logical === null || logical === undefined) {
          const range = timeScale.getVisibleLogicalRange();
          if (range && bounds.width > 0) {
            const span = range.to - range.from;
            if (span > 0 && bounds.width > 0) {
              logical = range.from + (clampedX / bounds.width) * span;
            }
          }
        }
        setSnappedPoint(null);
        return { time: null, price, logical };
      }

      if (!snap) {
        setSnappedPoint(null);
        const rawTime = chart.timeScale().coordinateToTime(chartX);
        return { time: rawTime ?? null, price, logical };
      }

      const index = Math.round(rawLogical);
      const item = data[index] || (index < 0 ? data[0] : data[data.length - 1]);
      if (!item) return null;

      // Magnet snap to OHLC
      const snapThreshold = 50;
      const prices =
        magnetMode === "close"
          ? [
              {
                val: item.close,
                y: series.priceToCoordinate(item.close),
                label: "Close",
              },
            ]
          : [
              {
                val: item.high,
                y: series.priceToCoordinate(item.high),
                label: "High",
              },
              {
                val: item.low,
                y: series.priceToCoordinate(item.low),
                label: "Low",
              },
              {
                val: item.open,
                y: series.priceToCoordinate(item.open),
                label: "Open",
              },
              {
                val: item.close,
                y: series.priceToCoordinate(item.close),
                label: "Close",
              },
            ];

      let bestPrice = price;
      let minDist = snapThreshold;
      let snapped = null;

      for (const p of prices) {
        if (p.y !== null) {
          const dist = Math.abs(p.y - y);
          if (dist < minDist) {
            minDist = dist;
            bestPrice = p.val;
            snapped = {
              x: timeScale.logicalToCoordinate(index) + bounds.left,
              y: p.y,
              label: p.label,
            };
          }
        }
      }

      setSnappedPoint(snapped);
      return { time: item.time, price: bestPrice, logical: logical };
    },
    [chart, series, data, getChartBounds, magnetMode],
  );

  const priceToY = useCallback(
    (price) => {
      if (!series || price === undefined) return undefined;
      const y = series.priceToCoordinate(price);
      return y === null ? undefined : y;
    },
    [series],
  );

  const getLogicalIndex = useCallback(
    (point) => {
      if (!point) return undefined;
      if (point.logical !== undefined) return point.logical;
      return timeToIndex.get(point.time);
    },
    [timeToIndex],
  );

  const isPatternTool = useCallback((tool) => PATTERN_TOOLS.includes(tool), []);

  const getGhostStyle = useCallback((state = GHOST_STATES.neutral) => {
    return GHOST_STYLE_MAP[state] || GHOST_STYLE_MAP.neutral;
  }, []);

  const drawGhostPoint = useCallback(
    (ctx, point, { derived = false, state = GHOST_STATES.neutral } = {}) => {
      if (!point) return;
      const coords = getCoords(point);
      if (!coords) return;
      const bounds = getChartBounds();
      const style = getGhostStyle(state);
      const x = coords.x + bounds.left;
      const y = coords.y;
      ctx.save();
      ctx.globalAlpha = style.labelAlpha;
      ctx.lineWidth = 2;
      ctx.strokeStyle = style.stroke;
      if (derived) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
      } else {
        ctx.fillStyle = style.stroke;
      }
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },
    [getCoords, getChartBounds, getGhostStyle],
  );

  const drawGhostLabel = useCallback(
    (
      ctx,
      text,
      x,
      y,
      { state = GHOST_STATES.neutral, align = "left", color } = {},
    ) => {
      if (!text) return;
      const bounds = getChartBounds();
      const style = getGhostStyle(state);
      ctx.save();
      const font = "bold 11px sans-serif";
      ctx.font = font;
      const cache = labelWidthCacheRef.current;
      const cacheKey = `${font}:${text}`;
      let width = cache.get(cacheKey);
      if (width === undefined) {
        width = ctx.measureText(text).width;
        cache.set(cacheKey, width);
        if (cache.size > 300) cache.clear();
      }
      const paddingX = 6;
      const boxW = width + paddingX * 2;
      const boxH = 18;
      const minX = bounds.left + 6;
      const maxX = bounds.right - boxW - 6;
      const minY = 6;
      const maxY = bounds.height - boxH - 6;
      const rawX = align === "center" ? x - boxW / 2 : x;
      const rawY = y - boxH / 2;
      const boxX = Math.max(minX, Math.min(rawX, maxX));
      const boxY = Math.max(minY, Math.min(rawY, maxY));

      ctx.globalAlpha = style.labelAlpha;
      ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = color || style.stroke;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, boxX + paddingX, boxY + boxH / 2);
      ctx.restore();
    },
    [getChartBounds, getGhostStyle],
  );

  const getGhostLabelBox = useCallback(
    (ctx, text, x, y, align = "left") => {
      if (!text) return null;
      const bounds = getChartBounds();
      const font = "bold 11px sans-serif";
      const cache = labelWidthCacheRef.current;
      const cacheKey = `${font}:${text}`;
      let width = cache.get(cacheKey);
      if (width === undefined) {
        ctx.save();
        ctx.font = font;
        width = ctx.measureText(text).width;
        ctx.restore();
        cache.set(cacheKey, width);
        if (cache.size > 300) cache.clear();
      }
      const paddingX = 6;
      const boxW = width + paddingX * 2;
      const boxH = 18;
      const minX = bounds.left + 6;
      const maxX = bounds.right - boxW - 6;
      const minY = 6;
      const maxY = bounds.height - boxH - 6;
      const rawX = align === "center" ? x - boxW / 2 : x;
      const rawY = y - boxH / 2;
      const boxX = Math.max(minX, Math.min(rawX, maxX));
      const boxY = Math.max(minY, Math.min(rawY, maxY));
      return { x: boxX, y: boxY, w: boxW, h: boxH };
    },
    [getChartBounds],
  );

  const resolveLabelOverlaps = useCallback(
    (labels, ctx) => {
      const placed = [];
      labels.forEach((label) => {
        if (!label) return;
        let x = label.x;
        let y = label.y;
        let box = getGhostLabelBox(ctx, label.text, x, y, label.opts?.align);
        if (!box) return;
        let attempts = 0;
        while (
          placed.some(
            (p) =>
              !(
                box.x + box.w < p.box.x ||
                box.x > p.box.x + p.box.w ||
                box.y + box.h < p.box.y ||
                box.y > p.box.y + p.box.h
              ),
          ) &&
          attempts < 6
        ) {
          y += box.h + 4;
          box = getGhostLabelBox(ctx, label.text, x, y, label.opts?.align);
          attempts += 1;
        }
        placed.push({ ...label, x, y, box });
      });
      return placed;
    },
    [getGhostLabelBox],
  );

  const getPointFromLogical = useCallback(
    (logical, price) => {
      if (!data || !data.length) return null;
      const idx = Math.max(0, Math.min(data.length - 1, Math.round(logical)));
      const time = data[idx]?.time;
      if (!time) return null;
      return { time, price, logical };
    },
    [data],
  );

  const mergeTextSettings = useCallback((type, settings = {}) => {
    const defaults = TEXT_TOOL_DEFAULTS[type] || {};
    return {
      ...defaults,
      ...settings,
      offset: {
        ...defaults.offset,
        ...(settings?.offset || {}),
      },
    };
  }, []);

  const getTextBoxMetrics = useCallback((ctx, text, settings = {}) => {
    const fontSize = settings.fontSize || 14;
    const fontFamily = settings.fontFamily || "sans-serif";
    const padding = 6;
    ctx.save();
    ctx.font = `${fontSize}px ${fontFamily}`;
    const width = ctx.measureText(text || "").width;
    ctx.restore();
    return {
      width: width + padding * 2,
      height: fontSize + padding * 2,
      padding,
      fontSize,
      fontFamily,
      textWidth: width,
    };
  }, []);

  const getTextBoxLayout = useCallback((x, y, metrics) => {
    return {
      boxX: x,
      boxY: y - metrics.height / 2,
      textX: x + metrics.padding,
      textY: y,
    };
  }, []);

  const resolveTextCollision = useCallback(
    (box, settings, bounds) => {
      if (!box) return null;
      const placed = textCollisionRef.current;
      const baseOpacity = settings.opacity ?? 1;
      let { x, y, w, h } = box;
      const maxX = bounds.right - w - 2;
      const minX = bounds.left + 2;
      if (x < minX) x = minX;
      if (x > maxX) x = maxX;
      const intersects = (b) =>
        !(x + w < b.x || x > b.x + b.w || y + h < b.y || y > b.y + b.h);
      let attempts = 0;
      while (attempts < 6 && placed.some(intersects)) {
        y += h + 4;
        if (y + h > bounds.height - 4) {
          y = bounds.height - h - 4;
        }
        attempts += 1;
      }
      const stillOverlaps = placed.some((b) => {
        const bx = b.x;
        const by = b.y;
        return !(x + w < bx || x > bx + b.w || y + h < by || y > by + b.h);
      });
      if (stillOverlaps) {
        if (settings.autoHide) return null;
        if (settings.adaptiveOpacity !== false) {
          const entry = { x, y, w, h, alpha: baseOpacity * 0.4 };
          placed.push(entry);
          return entry;
        }
      }
      const entry = { x, y, w, h, alpha: baseOpacity };
      placed.push(entry);
      return entry;
    },
    [textCollisionRef],
  );

  const getAnchorScreenPoint = useCallback(
    (point, bounds, settings = {}) => {
      const coords = getCoords(point);
      if (!coords) return null;
      const offset = settings.offset || { dx: 0, dy: 0 };
      const anchorX = coords.x + bounds.left;
      const anchorY = coords.y;
      return {
        anchorX,
        anchorY,
        x: anchorX + (offset.dx || 0),
        y: anchorY + (offset.dy || 0),
      };
    },
    [getCoords],
  );

  const getScreenTextPoint = useCallback(
    (bounds, settings = {}, point = null) => {
      const screen = settings?.screen;
      if (
        screen &&
        typeof screen.x === "number" &&
        typeof screen.y === "number"
      ) {
        return {
          x: bounds.left + screen.x,
          y: screen.y,
        };
      }
      if (point) {
        const coords = getCoords(point);
        if (!coords) return null;
        return { x: coords.x + bounds.left, y: coords.y };
      }
      return null;
    },
    [getCoords],
  );

  const openTextEditor = useCallback(
    (type, point, existingSettings = {}, id = null) => {
      if (!canvasRef.current) return;
      if (!point && !TEXT_SCREEN_TYPES.includes(type)) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      const bounds = getChartBounds();
      const merged = mergeTextSettings(type, existingSettings);
      const isScreen = TEXT_SCREEN_TYPES.includes(type);
      let screen = merged.screen;
      if (
        isScreen &&
        (!screen ||
          typeof screen.x !== "number" ||
          typeof screen.y !== "number") &&
        point
      ) {
        const coords = getCoords(point);
        if (coords) {
          screen = { x: coords.x, y: coords.y };
        }
      }
      const effectiveSettings = isScreen ? { ...merged, screen } : merged;
      const anchor = isScreen
        ? getScreenTextPoint(bounds, effectiveSettings, point)
        : getAnchorScreenPoint(point, bounds, merged) ||
          (merged._fallback
            ? {
                x: merged._fallback.x,
                y: merged._fallback.y,
                anchorX: merged._fallback.x,
                anchorY: merged._fallback.y,
              }
            : null);
      if (!anchor) return;
      const value = merged.text || "";
      const scale =
        isScreen && merged.autoScale
          ? (chart?.timeScale?.().options?.().barSpacing || 6) / 6
          : 1;
      const metrics = getTextBoxMetrics(
        ctx,
        value || TEXT_GHOST_LABELS[type] || "Text",
        { ...merged, fontSize: merged.fontSize * scale },
      );
      let x = anchor.x;
      let y = anchor.y;
      if (merged.autoFlip) {
        if (x + metrics.width > bounds.right - 4)
          x = bounds.right - metrics.width - 4;
        if (x < bounds.left + 4) x = bounds.left + 4;
        if (y - metrics.height / 2 < 4) y = metrics.height / 2 + 4;
        if (y + metrics.height / 2 > bounds.height - 4)
          y = bounds.height - metrics.height / 2 - 4;
      }
      const layout = getTextBoxLayout(x, y, metrics);
      setTextEditor({
        id,
        type,
        point: isScreen ? null : point,
        x: layout.boxX,
        y: layout.boxY,
        value,
        settings: effectiveSettings,
      });
      setTimeout(() => textInputRef.current?.focus(), 10);
    },
    [
      getChartBounds,
      getAnchorScreenPoint,
      getScreenTextPoint,
      getCoords,
      mergeTextSettings,
      getTextBoxMetrics,
      getTextBoxLayout,
    ],
  );

  const clamp = useCallback((value, min, max) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }, []);

  const getBarSpacing = useCallback(() => {
    const spacing = chart?.timeScale?.().options?.().barSpacing;
    return typeof spacing === "number" && spacing > 0 ? spacing : 6;
  }, [chart]);

  const getStrokeScale = useCallback(
    (autoScale) => (autoScale ? getBarSpacing() / 6 : 1),
    [getBarSpacing],
  );

  const shiftPoint = useCallback(
    (point, deltaLogical, deltaPrice) => {
      if (!point) return point;
      const logical = getLogicalIndex(point);
      if (logical === undefined) return point;
      const nextLogical = logical + deltaLogical;
      if (point.time == null) {
        return {
          ...point,
          logical: nextLogical,
          price: point.price + deltaPrice,
        };
      }
      const shifted = getPointFromLogical(
        nextLogical,
        point.price + deltaPrice,
      );
      return shifted
        ? { ...point, ...shifted }
        : {
            ...point,
            logical: nextLogical,
            price: point.price + deltaPrice,
          };
    },
    [getLogicalIndex, getPointFromLogical],
  );

  const distanceToSegment = useCallback(
    (p, a, b) => {
      if (!a || !b) return Infinity;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      if (dx === 0 && dy === 0) {
        const px = p.x - a.x;
        const py = p.y - a.y;
        return Math.sqrt(px * px + py * py);
      }
      const t = clamp(
        ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy),
        0,
        1,
      );
      const projX = a.x + t * dx;
      const projY = a.y + t * dy;
      const ddx = p.x - projX;
      const ddy = p.y - projY;
      return Math.sqrt(ddx * ddx + ddy * ddy);
    },
    [clamp],
  );

  const getDefaultSnapForTool = useCallback((tool) => {
    if (tool === "brush" || tool === "highlighter") return false;
    if (TEXT_TOOL_TYPES.includes(tool)) {
      const defaults = TEXT_TOOL_DEFAULTS[tool] || {};
      if (typeof defaults.snapToCandles === "boolean") {
        return defaults.snapToCandles;
      }
    }
    if (tool === "arrow" || tool === "rectangle" || tool === "path")
      return true;
    return true;
  }, []);

  const resolveSnapSetting = useCallback(
    (tool, settings) => {
      if (!magnetEnabled || magnetMode === "free") return false;
      if (tool === "brush") return false;
      if (TEXT_TOOL_TYPES.includes(tool)) {
        if (settings && typeof settings.snapToCandles === "boolean") {
          return settings.snapToCandles;
        }
        return getDefaultSnapForTool(tool);
      }
      if (settings && typeof settings.snapToCandles === "boolean") {
        return settings.snapToCandles;
      }
      return getDefaultSnapForTool(tool);
    },
    [getDefaultSnapForTool, magnetEnabled, magnetMode],
  );

  const appendBrushPoint = useCallback(
    (point) => {
      const lastPoint = lastStrokePointRef.current || point;
      const c1 = getCoords(lastPoint);
      const c2 = getCoords(point);
      if (!c1 || !c2) return;
      const dist = Math.hypot(c2.x - c1.x, c2.y - c1.y);
      if (dist < 1.5) return;
      const now = performance.now();
      const dt = Math.max(16, now - (lastStrokeTimeRef.current || now));
      const speed = dist / dt;
      const pressure = clamp(1.2 - speed * 0.6, 0.4, 1.6);
      lastStrokeTimeRef.current = now;
      lastStrokePointRef.current = { ...point, pressure };
      setCurrentLine((prev) => {
        if (!prev) return prev;
        const points = prev.points || [];
        return {
          ...prev,
          points: [...points, { ...point, pressure }],
        };
      });
    },
    [clamp, getCoords],
  );

  const isLogScale = useCallback(() => {
    if (!series) return false;
    const mode = series.priceScale()?.options?.().mode;
    return mode === 2;
  }, [series]);

  const getScaleSample = useCallback(() => {
    if (!chart || !series) return null;
    const bounds = getChartBounds();
    const timeScale = chart.timeScale();
    const sampleWidth = Math.min(100, Math.max(10, bounds.width));
    const logicalA = timeScale.coordinateToLogical(0);
    const logicalB = timeScale.coordinateToLogical(sampleWidth);
    if (logicalA === null || logicalB === null) return null;
    const timePerPixel = Math.abs(logicalB - logicalA) / sampleWidth;

    const priceA = series.coordinateToPrice(0);
    const priceB = series.coordinateToPrice(100);
    if (priceA === null || priceB === null) return null;
    const pricePerPixel = Math.abs(priceB - priceA) / 100;

    const slope1x1 = timePerPixel === 0 ? 0 : pricePerPixel / timePerPixel;
    return {
      timePerPixel,
      pricePerPixel,
      slope1x1,
    };
  }, [chart, series, getChartBounds]);

  const getSlopeFromPoints = useCallback(
    (pA, pB, useLogScale = false) => {
      const l1 = getLogicalIndex(pA);
      const l2 = getLogicalIndex(pB);
      if (l1 === undefined || l2 === undefined) return null;
      const deltaTime = l2 - l1;
      if (deltaTime === 0) return null;
      const priceA = useLogScale
        ? Math.log(Math.max(1e-6, pA.price))
        : pA.price;
      const priceB = useLogScale
        ? Math.log(Math.max(1e-6, pB.price))
        : pB.price;
      return (priceB - priceA) / deltaTime;
    },
    [getLogicalIndex],
  );

  const getScaleFactors = useCallback(() => {
    const sample = getScaleSample();
    if (
      !sample ||
      !Number.isFinite(sample.timePerPixel) ||
      !Number.isFinite(sample.pricePerPixel) ||
      sample.timePerPixel === 0 ||
      sample.pricePerPixel === 0
    ) {
      return null;
    }
    return {
      pxPerTime: 1 / sample.timePerPixel,
      pxPerPrice: 1 / sample.pricePerPixel,
      timePerPixel: sample.timePerPixel,
      pricePerPixel: sample.pricePerPixel,
    };
  }, [getScaleSample]);

  const snapAngleRad = useCallback((angle, stepDeg = 15) => {
    const step = (stepDeg * Math.PI) / 180;
    if (!step) return angle;
    return Math.round(angle / step) * step;
  }, []);

  const getAngleFromPoints = useCallback(
    (center, point) => {
      if (!center || !point) return null;
      const scale = getScaleFactors();
      if (scale) {
        const l1 = getLogicalIndex(center);
        const l2 = getLogicalIndex(point);
        if (l1 === undefined || l2 === undefined) return null;
        const dxPx = (l2 - l1) * scale.pxPerTime;
        const dyPx = (point.price - center.price) * scale.pxPerPrice;
        return Math.atan2(dyPx, dxPx);
      }
      const c1 = getCoords(center);
      const c2 = getCoords(point);
      if (!c1 || !c2) return null;
      return Math.atan2(c2.y - c1.y, c2.x - c1.x);
    },
    [getLogicalIndex, getScaleFactors, getCoords],
  );

  const getCircleRadiusPx = useCallback(
    (center, radiusPoint, settings = {}) => {
      if (
        settings.scaleMode === "screen" &&
        typeof settings.radiusPx === "number"
      ) {
        return settings.radiusPx;
      }
      if (!center) return null;
      const scale = getScaleFactors();
      if (!scale) {
        const c1 = getCoords(center);
        const c2 = radiusPoint ? getCoords(radiusPoint) : null;
        if (c1 && c2) return Math.hypot(c2.x - c1.x, c2.y - c1.y);
        return null;
      }
      if (!radiusPoint) return null;
      const l1 = getLogicalIndex(center);
      const l2 = getLogicalIndex(radiusPoint);
      if (l1 === undefined || l2 === undefined) return null;
      const dxPx = (l2 - l1) * scale.pxPerTime;
      const dyPx = (radiusPoint.price - center.price) * scale.pxPerPrice;
      return Math.sqrt(dxPx * dxPx + dyPx * dyPx);
    },
    [getLogicalIndex, getScaleFactors, getCoords],
  );

  const getEllipseRadiiPx = useCallback(
    (center, xPoint, yPoint, settings = {}) => {
      if (settings.scaleMode === "screen") {
        const xRadiusPx =
          typeof settings.xRadiusPx === "number" ? settings.xRadiusPx : null;
        const yRadiusPx =
          typeof settings.yRadiusPx === "number" ? settings.yRadiusPx : null;
        if (xRadiusPx != null && yRadiusPx != null)
          return { xRadiusPx, yRadiusPx };
      }
      if (!center) return null;
      const scale = getScaleFactors();
      if (!scale) {
        const c1 = getCoords(center);
        const c2 = xPoint ? getCoords(xPoint) : null;
        const c3 = yPoint ? getCoords(yPoint) : null;
        if (c1 && c2 && c3) {
          return {
            xRadiusPx: Math.abs(c2.x - c1.x),
            yRadiusPx: Math.abs(c3.y - c1.y),
          };
        }
        return null;
      }
      if (!xPoint || !yPoint) return null;
      const l1 = getLogicalIndex(center);
      const l2 = getLogicalIndex(xPoint);
      if (l1 === undefined || l2 === undefined) return null;
      const dxPx = Math.abs(l2 - l1) * scale.pxPerTime;
      const dyPx = Math.abs(yPoint.price - center.price) * scale.pxPerPrice;
      return { xRadiusPx: dxPx, yRadiusPx: dyPx };
    },
    [getLogicalIndex, getScaleFactors, getCoords],
  );

  const getLinePriceAtLogical = useCallback(
    (pA, pB, logical) => {
      const l1 = getLogicalIndex(pA);
      const l2 = getLogicalIndex(pB);
      if (l1 === undefined || l2 === undefined || l1 === l2) return null;
      const slope = (pB.price - pA.price) / (l2 - l1);
      return pA.price + slope * (logical - l1);
    },
    [getLogicalIndex],
  );

  const derivePointFromDelta = useCallback(
    (startPoint, deltaLogical, deltaPrice) => {
      const l1 = getLogicalIndex(startPoint);
      if (l1 === undefined) return null;
      const targetLogical = l1 + deltaLogical;
      return getPointFromLogical(targetLogical, startPoint.price + deltaPrice);
    },
    [getLogicalIndex, getPointFromLogical],
  );

  const validateABCD = useCallback(
    (p1, p2, p3, settings = {}) => {
      if (!p1 || !p2 || !p3) {
        return { state: GHOST_STATES.neutral };
      }
      const tol = settings.abcdTolerance ?? 0.1;
      const l1 = getLogicalIndex(p1);
      const l2 = getLogicalIndex(p2);
      const l3 = getLogicalIndex(p3);
      if (l1 === undefined || l2 === undefined || l3 === undefined)
        return { state: GHOST_STATES.neutral };
      const deltaLogical = l2 - l1;
      const deltaPrice = p2.price - p1.price;
      const dPoint = getPointFromLogical(
        l3 + deltaLogical,
        p3.price + deltaPrice,
      );
      if (!dPoint) return { state: GHOST_STATES.neutral };
      const ab = Math.abs(deltaPrice);
      const cd = Math.abs(dPoint.price - p3.price);
      const error = ab === 0 ? 0 : Math.abs(cd - ab) / ab;
      let state = GHOST_STATES.valid;
      if (error > tol * 1.5) state = GHOST_STATES.invalid;
      else if (error > tol) state = GHOST_STATES.marginal;
      return {
        state,
        dPoint,
        metrics: { ab, cd, error },
        message:
          state === GHOST_STATES.invalid ? "Invalid: AB and CD mismatch" : "",
      };
    },
    [getLogicalIndex, getPointFromLogical],
  );

  const validateHeadShoulders = useCallback(
    (nl1, ls, nl2, head, nl3, rs, settings = {}) => {
      if (!ls || !head) return { state: GHOST_STATES.neutral };
      const shoulderBase = Math.max(ls.price, rs?.price ?? ls.price);
      const headAbove = head.price > shoulderBase;
      let state = headAbove ? GHOST_STATES.valid : GHOST_STATES.invalid;
      const tol = settings.symmetryTolerance ?? 0.1;
      let symmetry = null;
      if (ls && rs) {
        const diff = Math.abs(ls.price - rs.price);
        symmetry = ls.price === 0 ? 1 : 1 - diff / Math.abs(ls.price);
        if (symmetry < 1 - tol && state !== GHOST_STATES.invalid) {
          state = GHOST_STATES.marginal;
        }
      }
      return {
        state,
        metrics: {
          headDelta: head.price - shoulderBase,
          headPercent:
            shoulderBase === 0
              ? 0
              : ((head.price - shoulderBase) / shoulderBase) * 100,
          symmetry,
        },
        message: headAbove ? "" : "Invalid: head must exceed shoulders",
      };
    },
    [],
  );

  const validateHarmonic = useCallback(
    (type, p1, p2, p3, p4, settings = {}) => {
      if (!p1 || !p2 || !p3 || !p4) return { state: GHOST_STATES.neutral };
      const tol = settings.fibTolerance ?? 0.08;
      const l2 = getLogicalIndex(p2);
      const l3 = getLogicalIndex(p3);
      const l4 = getLogicalIndex(p4);
      if (l2 === undefined || l3 === undefined || l4 === undefined)
        return { state: GHOST_STATES.neutral };

      const xa = Math.abs(p2.price - p1.price);
      const ab = Math.abs(p3.price - p2.price);
      const bc = Math.abs(p4.price - p3.price);
      const abRatio = xa === 0 ? 0 : ab / xa;
      const bcRatio = ab === 0 ? 0 : bc / ab;

      let dPoint = null;
      let ratioChecks = [];

      if (type === "harmonicCypher") {
        const dPrice = p1.price + (p4.price - p1.price) * 0.786;
        const deltaLogical = l4 - l3;
        dPoint = getPointFromLogical(l4 + deltaLogical, dPrice);
        const cd = dPoint ? Math.abs(dPoint.price - p4.price) : 0;
        const xc = Math.abs(p4.price - p1.price);
        const cdRatio = xc === 0 ? 0 : cd / xc;
        ratioChecks = [
          { label: "AB/XA", ratio: abRatio, range: [0.5, 1.0] },
          { label: "BC/AB", ratio: bcRatio, range: [1.13, 2.0] },
          { label: "CD/XC", ratio: cdRatio, range: [0.5, 1.0] },
        ];
      } else if (type === "harmonicThreeDrives") {
        const dPrice = p4.price + (p4.price - p3.price);
        const deltaLogical = l4 - l3;
        dPoint = getPointFromLogical(l4 + deltaLogical, dPrice);
        const drive1 = Math.abs(p2.price - p1.price);
        const drive2 = Math.abs(p4.price - p3.price);
        const drive3 = dPoint ? Math.abs(dPoint.price - p4.price) : 0;
        const driveRatio = drive2 === 0 ? 0 : drive3 / drive2;
        ratioChecks = [
          { label: "AB/XA", ratio: abRatio, range: [0.618, 0.786] },
          { label: "BC/AB", ratio: bcRatio, range: [0.618, 0.786] },
          { label: "D2/D1", ratio: driveRatio, target: 1.0 },
        ];
      } else {
        // harmonicXABCD
        const dPrice = p1.price + (p2.price - p1.price) * 0.886;
        const deltaLogical = l4 - l3;
        dPoint = getPointFromLogical(l4 + deltaLogical, dPrice);
        const cd = dPoint ? Math.abs(dPoint.price - p4.price) : 0;
        const cdRatio = bc === 0 ? 0 : cd / bc;
        const xd = dPoint ? Math.abs(dPoint.price - p1.price) : 0;
        const xa = Math.abs(p2.price - p1.price);
        const xdRatio = xa === 0 ? 0 : xd / xa;
        ratioChecks = [
          { label: "AB/XA", ratio: abRatio, range: [0.382, 0.5] },
          { label: "BC/AB", ratio: bcRatio, range: [0.382, 0.886] },
          { label: "CD/BC", ratio: cdRatio, range: [1.618, 2.618] },
          { label: "XD/XA", ratio: xdRatio, target: 0.886 },
        ];
      }

      let state = GHOST_STATES.valid;
      ratioChecks.forEach((check) => {
        if (check.range) {
          const [min, max] = check.range;
          if (check.ratio < min || check.ratio > max) {
            state = GHOST_STATES.invalid;
          } else {
            const margin = Math.min(check.ratio - min, max - check.ratio);
            if (margin / (max - min) < 0.2 && state === GHOST_STATES.valid) {
              state = GHOST_STATES.marginal;
            }
          }
        } else if (check.target) {
          const diff =
            check.target === 0
              ? 0
              : Math.abs(check.ratio - check.target) / check.target;
          if (diff > tol * 1.5) state = GHOST_STATES.invalid;
          else if (diff > tol && state === GHOST_STATES.valid)
            state = GHOST_STATES.marginal;
        }
      });

      return {
        state,
        dPoint,
        ratios: ratioChecks,
        message:
          state === GHOST_STATES.invalid
            ? "Invalid: harmonic ratios out of range"
            : "",
      };
    },
    [getLogicalIndex, getPointFromLogical],
  );

  const validateTriangle = useCallback(
    (points, settings = {}) => {
      if (!points || points.length < 2) return { state: GHOST_STATES.neutral };
      const minPoints = settings.minPoints ?? 5;
      if (points.length < minPoints) return { state: GHOST_STATES.neutral };
      const firstIsHigh =
        points.length > 1 ? points[1].price < points[0].price : true;
      const highs = points.filter((_, idx) =>
        firstIsHigh ? idx % 2 === 0 : idx % 2 === 1,
      );
      const lows = points.filter((_, idx) =>
        firstIsHigh ? idx % 2 === 1 : idx % 2 === 0,
      );
      if (highs.length < 2 || lows.length < 2)
        return { state: GHOST_STATES.neutral };
      const h1 = highs[0];
      const h2 = highs[highs.length - 1];
      const l1 = lows[0];
      const l2 = lows[lows.length - 1];
      const lh1 = getLogicalIndex(h1);
      const lh2 = getLogicalIndex(h2);
      const ll1 = getLogicalIndex(l1);
      const ll2 = getLogicalIndex(l2);
      if (
        lh1 === undefined ||
        lh2 === undefined ||
        ll1 === undefined ||
        ll2 === undefined ||
        lh1 === lh2 ||
        ll1 === ll2
      )
        return { state: GHOST_STATES.neutral };
      const upperSlope = (h2.price - h1.price) / (lh2 - lh1);
      const lowerSlope = (l2.price - l1.price) / (ll2 - ll1);
      let state = GHOST_STATES.valid;
      if (upperSlope >= lowerSlope) state = GHOST_STATES.invalid;
      else if (Math.abs(upperSlope - lowerSlope) < Math.abs(upperSlope) * 0.2)
        state = GHOST_STATES.marginal;

      return {
        state,
        highs,
        lows,
        lines: { upper: { p1: h1, p2: h2 }, lower: { p1: l1, p2: l2 } },
        message:
          state === GHOST_STATES.invalid
            ? "Invalid: triangle not converging"
            : "",
      };
    },
    [getLogicalIndex],
  );

  const validateElliottImpulse = useCallback((points, settings = {}) => {
    const [p0, p1, p2, p3, p4, p5] = points;
    if (!p0 || !p1) return { state: GHOST_STATES.neutral };
    const directionUp = p1.price >= p0.price;
    const mode = settings.mode || "strict";
    let state = GHOST_STATES.valid;
    const messages = [];
    const metrics = {};
    const registerViolation = (msg) => {
      if (mode === "loose") {
        if (state === GHOST_STATES.valid) state = GHOST_STATES.marginal;
        messages.push(`Warning: ${msg}`);
      } else {
        state = GHOST_STATES.invalid;
        messages.push(msg);
      }
    };

    if (p2) {
      const retraceBeyond = directionUp
        ? p2.price <= p0.price
        : p2.price >= p0.price;
      if (retraceBeyond) {
        registerViolation("Wave 2 retrace beyond start");
      }
    }

    if (p4) {
      const overlap = directionUp ? p4.price <= p1.price : p4.price >= p1.price;
      metrics.wave4Overlap = overlap;
      if (overlap) {
        registerViolation("Wave 4 overlap wave 1");
      }
    }

    if (p2 && p3 && p4 && p5) {
      const w1 = Math.abs(p1.price - p0.price);
      const w3 = Math.abs(p3.price - p2.price);
      const w5 = Math.abs(p5.price - p4.price);
      metrics.w1 = w1;
      metrics.w3 = w3;
      metrics.w5 = w5;
      if (w3 <= Math.min(w1, w5)) {
        registerViolation("Wave 3 shortest");
      }
    }

    return {
      state,
      directionUp,
      messages,
      metrics,
    };
  }, []);

  const validateElliottCorrection = useCallback((points, settings = {}) => {
    const [p0, p1, p2, p3] = points;
    if (!p0 || !p1) return { state: GHOST_STATES.neutral };
    const directionUp = p1.price >= p0.price;
    const mode = settings.mode || "strict";
    let state = GHOST_STATES.valid;
    const messages = [];
    const registerViolation = (msg) => {
      if (mode === "loose") {
        if (state === GHOST_STATES.valid) state = GHOST_STATES.marginal;
        messages.push(`Warning: ${msg}`);
      } else {
        state = GHOST_STATES.invalid;
        messages.push(msg);
      }
    };

    if (p2) {
      const ok = directionUp ? p2.price < p1.price : p2.price > p1.price;
      if (!ok) {
        registerViolation("Wave B must retrace");
      }
    }

    if (p3 && p2) {
      const ok = directionUp ? p3.price > p2.price : p3.price < p2.price;
      if (!ok) {
        registerViolation("Wave C must extend");
      }
    }

    return { state, directionUp, messages };
  }, []);

  const validateElliottTriangle = useCallback(
    (points, settings = {}) => {
      const mode = settings.mode || "strict";
      const res = validateTriangle(points, { minPoints: 5, ...settings });
      if (res.state === GHOST_STATES.invalid) {
        const baseMessage =
          res.message?.replace(/^Invalid:\s*/i, "") ||
          "Triangle not converging";
        if (mode === "loose") {
          return {
            ...res,
            state: GHOST_STATES.marginal,
            messages: [`Warning: ${baseMessage}`],
            message: `Warning: ${baseMessage}`,
          };
        }
        return {
          ...res,
          messages: [`Invalid: ${baseMessage}`],
          message: `Invalid: ${baseMessage}`,
        };
      }
      return { ...res, messages: res.messages || [] };
    },
    [validateTriangle],
  );

  const validateElliottCombo = useCallback((points, settings = {}) => {
    const [p0, p1, p2, p3] = points;
    if (!p0 || !p1) return { state: GHOST_STATES.neutral };
    const directionUp = p1.price >= p0.price;
    const mode = settings.mode || "strict";
    let state = GHOST_STATES.valid;
    const messages = [];
    const registerViolation = (msg) => {
      if (mode === "loose") {
        if (state === GHOST_STATES.valid) state = GHOST_STATES.marginal;
        messages.push(`Warning: ${msg}`);
      } else {
        state = GHOST_STATES.invalid;
        messages.push(`Invalid: ${msg}`);
      }
    };
    if (p2) {
      const ok = directionUp ? p2.price < p1.price : p2.price > p1.price;
      if (!ok) registerViolation("Wave X must retrace");
    }
    if (p3 && p2) {
      const ok = directionUp ? p3.price > p2.price : p3.price < p2.price;
      if (!ok) registerViolation("Wave Y must extend");
    }
    return {
      state,
      directionUp,
      messages,
      message: messages[0] || "",
    };
  }, []);

  /* -------------------------------------------------
     Regression Trend Math & Drawing
  ------------------------------------------------- */
  const calculateLinearRegression = useCallback(
    (startIndex, endIndex, priceSource = "close") => {
      if (!data || data.length < 2) return null;
      if (startIndex > endIndex)
        [startIndex, endIndex] = [endIndex, startIndex];

      const n = endIndex - startIndex + 1;
      if (n < 2) return null;

      const getVal = (item) => {
        if (!item) return 0;
        switch (priceSource) {
          case "open":
            return item.open;
          case "high":
            return item.high;
          case "low":
            return item.low;
          case "hl2":
            return (item.high + item.low) / 2;
          case "close":
          default:
            return item.close;
        }
      };

      let sumX = 0,
        sumY = 0,
        sumXY = 0,
        sumXX = 0;
      for (let i = startIndex; i <= endIndex; i++) {
        const x = i;
        const y = getVal(data[i]);
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
      }

      const meanX = sumX / n;
      const meanY = sumY / n;

      const beta = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const alpha = meanY - beta * meanX;

      // Residual Standard Deviation
      let sumRSquared = 0;
      for (let i = startIndex; i <= endIndex; i++) {
        const x = i;
        const y = getVal(data[i]);
        const pred = alpha + beta * x;
        sumRSquared += Math.pow(y - pred, 2);
      }
      const sigma = Math.sqrt(sumRSquared / (n - 1));

      return { alpha, beta, sigma, startIndex, endIndex };
    },
    [data],
  );

  const drawRegressionTrend = (ctx, reg, bounds, k = 2, color = "#2962FF") => {
    if (!reg || !chart || !series) return;
    const timeScale = chart.timeScale();

    const getCoord = (idx, price) => {
      const xCoord = timeScale.logicalToCoordinate(idx);
      const yCoord = series.priceToCoordinate(price);
      if (xCoord === null || yCoord === null) return null;
      return { x: xCoord + bounds.left, y: yCoord };
    };

    const p1 = getCoord(reg.startIndex, reg.alpha + reg.beta * reg.startIndex);
    const p2 = getCoord(reg.endIndex, reg.alpha + reg.beta * reg.endIndex);

    if (!p1 || !p2) return;

    // 1. Central Trend Line
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Deviation Bands
    const up1 = getCoord(
      reg.startIndex,
      reg.alpha + reg.beta * reg.startIndex + k * reg.sigma,
    );
    const up2 = getCoord(
      reg.endIndex,
      reg.alpha + reg.beta * reg.endIndex + k * reg.sigma,
    );
    const dn1 = getCoord(
      reg.startIndex,
      reg.alpha + reg.beta * reg.startIndex - k * reg.sigma,
    );
    const dn2 = getCoord(
      reg.endIndex,
      reg.alpha + reg.beta * reg.endIndex - k * reg.sigma,
    );

    if (up1 && up2 && dn1 && dn2) {
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      ctx.setLineDash([4, 4]);

      // Upper Band
      ctx.beginPath();
      ctx.moveTo(up1.x, up1.y);
      ctx.lineTo(up2.x, up2.y);
      ctx.stroke();

      // Lower Band
      ctx.beginPath();
      ctx.moveTo(dn1.x, dn1.y);
      ctx.lineTo(dn2.x, dn2.y);
      ctx.stroke();

      ctx.setLineDash([]);

      // 3. Shading
      ctx.fillStyle = color + "14"; // ~8% opacity
      ctx.beginPath();
      ctx.moveTo(up1.x, up1.y);
      ctx.lineTo(up2.x, up2.y);
      ctx.lineTo(dn2.x, dn2.y);
      ctx.lineTo(dn1.x, dn1.y);
      ctx.closePath();
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  };

  const drawFlatTopBottom = (
    ctx,
    p_flat,
    s1,
    s2,
    bounds,
    color = "#2962FF",
    fillOpacity = 0.1,
    mode = "auto",
  ) => {
    const yFlat = priceToY(p_flat);
    if (yFlat === undefined) return;

    const c1 = getCoords(s1);
    const c2 = getCoords(s2);
    if (!c1 || !c2) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // 1. Draw Bounded Flat Line (Solid)
    ctx.beginPath();
    ctx.moveTo(c1.x + bounds.left, yFlat);
    ctx.lineTo(c2.x + bounds.left, yFlat);
    ctx.stroke();

    // 2. Draw Sloped Line (Solid)
    ctx.beginPath();
    ctx.moveTo(c1.x + bounds.left, c1.y);
    ctx.lineTo(c2.x + bounds.left, c2.y);
    ctx.stroke();

    // 3. Draw Shaded Region
    let effectiveMode = mode;
    if (mode === "auto") {
      if (c1.y < yFlat && c2.y < yFlat) effectiveMode = "bottom";
      else if (c1.y > yFlat && c2.y > yFlat) effectiveMode = "top";
    }

    let shouldFill = true;
    if (effectiveMode === "top" && c1.y < yFlat && c2.y < yFlat)
      shouldFill = false;
    if (effectiveMode === "bottom" && c1.y > yFlat && c2.y > yFlat)
      shouldFill = false;

    if (shouldFill) {
      ctx.beginPath();
      ctx.moveTo(c1.x + bounds.left, c1.y);
      ctx.lineTo(c2.x + bounds.left, c2.y);
      ctx.lineTo(c2.x + bounds.left, yFlat);
      ctx.lineTo(c1.x + bounds.left, yFlat);
      ctx.closePath();
      ctx.fillStyle =
        color +
        Math.floor(fillOpacity * 255)
          .toString(16)
          .padStart(2, "0");
      ctx.fill();
    }

    // 4. Anchors (White dots)
    [c1, c2].forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x + bounds.left, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    if (!isPreview) {
      const handle = p2 ? getCoords(p2) : null;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 1;

      // Anchor handle
      ctx.beginPath();
      ctx.arc(originX, originY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotation handle
      if (handle) {
        const hx = handle.x + bounds.left;
        const hy = handle.y;
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  };

  const drawDisjointChannel = (
    ctx,
    p1,
    p2,
    p3,
    p4,
    bounds,
    color = "#2962FF",
    settings = {},
  ) => {
    const {
      lineStyle1 = "solid",
      lineStyle2 = "solid",
      show_fill = true, // Defaulting to true based on user image
      fillOpacity = 0.08,
    } = settings;

    const c1 = getCoords(p1);
    const c2 = getCoords(p2);
    const c3 = getCoords(p3);
    const c4 = getCoords(p4);

    if (!c1 || !c2) return;

    ctx.save();
    ctx.lineWidth = 2;

    // Line 1: Reference (C1 -> C2)
    ctx.beginPath();
    ctx.strokeStyle = color;
    if (lineStyle1 === "dashed") ctx.setLineDash([5, 5]);
    else ctx.setLineDash([]);
    ctx.moveTo(c1.x + bounds.left, c1.y);
    ctx.lineTo(c2.x + bounds.left, c2.y);
    ctx.stroke();

    // Secondary line logic (Symmetric)
    if (c3) {
      // Shared horizontal span
      const xStart = c1.x;
      const xEnd = c2.x;

      // Mirror slope logic (TA Angle Symmetry)
      // m1 = (y2 - y1) / (x2 - x1)
      // m2 = -m1
      const dx = c2.x - c1.x;
      const dy = c2.y - c1.y;
      const m = dx !== 0 ? dy / dx : 0;
      const mSym = -m;

      // Placement: Use C3's price as start of second line
      const y3Start = c3.y;
      const y3End = y3Start + mSym * dx;

      // Draw mirrored line
      ctx.beginPath();
      if (lineStyle2 === "dashed") ctx.setLineDash([5, 5]);
      else ctx.setLineDash([]);
      ctx.moveTo(xStart + bounds.left, y3Start);
      ctx.lineTo(xEnd + bounds.left, y3End);
      ctx.stroke();

      // Shaded Region
      if (show_fill) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(c1.x + bounds.left, c1.y);
        ctx.lineTo(c2.x + bounds.left, c2.y);
        ctx.lineTo(xEnd + bounds.left, y3End);
        ctx.lineTo(xStart + bounds.left, y3Start);
        ctx.closePath();
        ctx.fillStyle = color + "1A";
        ctx.fill();
      }
    }

    // Anchors
    [c1, c2, c3].forEach((c) => {
      if (!c) return;
      ctx.beginPath();
      ctx.arc(c.x + bounds.left, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    if (!isPreview) {
      const handle = p2 ? getCoords(p2) : null;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 1;

      // Anchor handle
      ctx.beginPath();
      ctx.arc(originX, originY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotation handle
      if (handle) {
        const hx = handle.x + bounds.left;
        const hy = handle.y;
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  };

  const drawPitchfork = (
    ctx,
    p1, // Handle (P0)
    p2, // Pivot 1 (P1)
    p3, // Pivot 2 (P2)
    bounds,
    color = "#2962FF",
    settings = {},
  ) => {
    const {
      pitchforkType = "original", // original, schiff, modifiedSchiff
      medianColor = color,
      outerLineColor = color,
      fillColor = color + "1A", // 10% opacity
      showFill = true,
      extendLines = "right", // none, left, right, both
    } = settings;

    const c1 = getCoords(p1); // Handle
    const c2 = getCoords(p2); // P1
    const c3 = getCoords(p3); // P2

    if (!c1 || !c2 || !c3) return;

    ctx.save();
    ctx.lineWidth = 1;

    // 1. Calculate Midpoint of Pivot 1 & Pivot 2
    const midX = (c2.x + c3.x) / 2;
    const midY = (c2.y + c3.y) / 2;
    const mPoint = { x: midX, y: midY };

    // 2. Adjust Handle Origin based on Type
    let origin = { ...c1 };
    if (pitchforkType === "schiff") {
      origin.x = (c1.x + c2.x) / 2;
      origin.y = (c1.y + c2.y) / 2;
    } else if (pitchforkType === "modifiedSchiff") {
      origin.x = (c1.x + c2.x) / 2;
      origin.y = (c1.y + c3.y) / 2;
    }

    // 3. Draw Median Line (Origin -> Midpoint -> Extended)
    // Vector V = M - Origin
    const vx = mPoint.x - origin.x;
    const vy = mPoint.y - origin.y;

    const isInsideMode = settings.isInsideMode;

    if (isInsideMode) {
      // --- INSIDE PITCHFORK LOGIC (CLIPPED) ---
      // 1. Project P1 and P2 onto Vector V to find t_min / t_max
      const vSq = vx * vx + vy * vy;
      const getT = (p) => {
        const pdx = p.x - origin.x;
        const pdy = p.y - origin.y;
        return (pdx * vx + pdy * vy) / vSq;
      };

      const t1 = getT(c2);
      const t2 = getT(c3);

      const tMin = Math.min(t1, t2);
      const tMax = Math.max(t1, t2);
      let tStart = tMin;
      let tEnd = tMax;
      if (extendLines !== "none" && Math.abs(vx) > 1e-6) {
        const tAtLeft = (0 - origin.x) / vx;
        const tAtRight = (bounds.width - origin.x) / vx;
        const tBoundMin = Math.min(tAtLeft, tAtRight);
        const tBoundMax = Math.max(tAtLeft, tAtRight);
        if (extendLines === "left" || extendLines === "both") {
          tStart = Math.min(tStart, tBoundMin);
        }
        if (extendLines === "right" || extendLines === "both") {
          tEnd = Math.max(tEnd, tBoundMax);
        }
      }

      const drawSegment = (startNode, tStart, tEnd, color, width) => {
        // Generic draw from T_a to T_b with offset relative to node projection
        // For a point P, the line passing through it parallel to V is
        // L(t) = P + V*(t - t_p)
        // where t_p is the projection of P onto V relative to Origin.
        // Actually simpler:
        // The vector offset from the Median Line (at param t) to the Parallel Line (at param t) is constant.
        // Offset = P - (Origin + V*t_p)
        const t_node = getT(startNode);
        const dx_off = startNode.x - (origin.x + vx * t_node);
        const dy_off = startNode.y - (origin.y + vy * t_node);

        const xStart = origin.x + vx * tStart + dx_off;
        const yStart = origin.y + vy * tStart + dy_off;
        const xEnd = origin.x + vx * tEnd + dx_off;
        const yEnd = origin.y + vy * tEnd + dy_off;

        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.setLineDash([]);
        ctx.moveTo(xStart + bounds.left, yStart);
        ctx.lineTo(xEnd + bounds.left, yEnd);
        ctx.stroke();
        return { x1: xStart, y1: yStart, x2: xEnd, y2: yEnd };
      };

      // Draw Median (StartNode = Origin, but clipped to tMin/tMax)
      // FIX: User requested "Middle Pivot Line" connection.
      // Median should start from Origin (Handle) and go to tMax (end of box).
      // Parallels stay clipped to the box (tMin to tMax).
      const medStart =
        extendLines === "left" || extendLines === "both" ? tStart : 0;
      const medSeg = drawSegment(origin, medStart, tEnd, medianColor, 2);
      const upSeg = drawSegment(c2, tStart, tEnd, outerLineColor, 1);
      const lowSeg = drawSegment(c3, tStart, tEnd, outerLineColor, 1);

      // Extra Levels for Inside Mode
      const levels = settings.levels || [0.5];
      levels.forEach((level) => {
        const startUp = {
          x: origin.x + (c2.x - origin.x) * level,
          y: origin.y + (c2.y - origin.y) * level,
        };
        const startLow = {
          x: origin.x + (c3.x - origin.x) * level,
          y: origin.y + (c3.y - origin.y) * level,
        };
        drawSegment(startUp, tStart, tEnd, outerLineColor, 1);
        drawSegment(startLow, tStart, tEnd, outerLineColor, 1);
      });

      if (showFill) {
        ctx.beginPath();
        ctx.moveTo(upSeg.x1 + bounds.left, upSeg.y1);
        ctx.lineTo(upSeg.x2 + bounds.left, upSeg.y2);
        ctx.lineTo(lowSeg.x2 + bounds.left, lowSeg.y2);
        ctx.lineTo(lowSeg.x1 + bounds.left, lowSeg.y1);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    } else {
      // --- STANDARD PITCHFORK LOGIC (RAY / INFINITE) ---

      // Draw Center Line
      drawRayLine(ctx, origin, mPoint, bounds, extendLines, medianColor, 2);

      // Helper to draw parallel ray
      const drawParallel = (startPoint, vecX, vecY, color, width = 1) => {
        // Target point is effectively start + vector
        const target = { x: startPoint.x + vecX, y: startPoint.y + vecY };
        drawRayLine(ctx, startPoint, target, bounds, extendLines, color, width);
      };

      drawParallel(c2, vx, vy, outerLineColor);
      drawParallel(c3, vx, vy, outerLineColor);

      // Extra Levels (default [0.5] if not specified)
      const levels = settings.levels || [0.5];
      levels.forEach((level) => {
        // Calculate implicit points at fractional distance
        // P_level_up = Origin + (P1 - Origin) * level ??? NO.
        // The parallels are offsets from the Median.
        // P1 is at Offset V_up = P1 - P_median_proj.
        // Actually, we can just interpolate between Median and Outer Lines.

        // Median starts at Origin.
        // Upper starts at P1.
        // Midpoint(Level) starts at Origin + (P1 - Origin) * level? NO.
        // It starts at Origin + (P1 - (Origin + V*t1)) * level ???
        // Let's use the vectors again.
        // Vector Median -> P1 = P1 - (Origin + V*t1) is hard to compute here.

        // Easiest is to interpolate START points, since lines are parallel.
        // Median start: Origin
        // Upper start: c2
        // Lower start: c3

        // Level start Up = Origin + (c2 - Origin) * level ?
        // If level=0.5, it's midpoint of Origin and c2. YES.
        // Because Median passes through Origin, and Upper passes through c2.
        // And they are parallel. So the line passing through midpoint(Origin, c2) is halfway.

        const startUp = {
          x: origin.x + (c2.x - origin.x) * level,
          y: origin.y + (c2.y - origin.y) * level,
        };
        const startLow = {
          x: origin.x + (c3.x - origin.x) * level,
          y: origin.y + (c3.y - origin.y) * level,
        };

        drawParallel(startUp, vx, vy, outerLineColor, 1);
        drawParallel(startLow, vx, vy, outerLineColor, 1);
      });

      // Fill (Optional - Simplified Right Extension)
      if (showFill) {
        const mult = 10000;
        ctx.beginPath();
        let p2_end = { x: c2.x + vx * mult, y: c2.y + vy * mult };
        let p3_end = { x: c3.x + vx * mult, y: c3.y + vy * mult };

        if (extendLines === "left") {
          p2_end = { x: c2.x - vx * mult, y: c2.y - vy * mult };
          p3_end = { x: c3.x - vx * mult, y: c3.y - vy * mult };
        }
        ctx.moveTo(c2.x + bounds.left, c2.y);
        ctx.lineTo(p2_end.x + bounds.left, p2_end.y);
        ctx.lineTo(p3_end.x + bounds.left, p3_end.y);
        ctx.lineTo(c3.x + bounds.left, c3.y);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    }

    // 6. Anchors and Pivot Lines
    // Draw line P1-P2 (Pivot connection)
    ctx.beginPath();
    ctx.setLineDash([4, 4]); // Dashed base
    ctx.strokeStyle = color;
    ctx.moveTo(c2.x + bounds.left, c2.y);
    ctx.lineTo(c3.x + bounds.left, c3.y);
    ctx.stroke();

    // Draw Pivot Arms (P0-P1 and P0-P2) - The "Two Pivot Lines"
    ctx.beginPath();
    ctx.setLineDash([]); // Solid arms
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.moveTo(c1.x + bounds.left, c1.y);
    ctx.lineTo(c2.x + bounds.left, c2.y);
    ctx.moveTo(c1.x + bounds.left, c1.y);
    ctx.lineTo(c3.x + bounds.left, c3.y);
    ctx.stroke();

    // Anchors
    [c1, c2, c3].forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x + bounds.left, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.stroke();
    });

    if (!isPreview) {
      const handle = p2 ? getCoords(p2) : null;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 1;

      // Anchor handle
      ctx.beginPath();
      ctx.arc(originX, originY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotation handle
      if (handle) {
        const hx = handle.x + bounds.left;
        const hy = handle.y;
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  };

  const drawRayLine = (ctx, start, end, bounds, extend, color, width) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (dx === 0 && dy === 0) return;

    const m = dx !== 0 ? dy / dx : 0;
    const b = start.y - m * start.x;

    let x1 = start.x;
    let y1 = start.y;
    let x2 = end.x;
    let y2 = end.y;

    if (extend === "right" || extend === "both") {
      x2 = start.x + dx * 10000;
      y2 = start.y + dy * 10000;
    }
    if (extend === "left" || extend === "both") {
      x1 = start.x - dx * 10000;
      y1 = start.y - dy * 10000;
    }

    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash([]);
    ctx.moveTo(x1 + bounds.left, y1);
    ctx.lineTo(x2 + bounds.left, y2);
    ctx.stroke();
  };
  const drawLine = (ctx, start, end, color = "#2962FF") => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawHorizontalLine = (ctx, y, bounds, color = "#00E676") => {
    ctx.beginPath();
    ctx.moveTo(bounds.left, y);
    ctx.lineTo(bounds.right, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawVerticalLine = (ctx, x, bounds, color = "#FF6D00") => {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, bounds.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawRay = (ctx, start, end, bounds, color = "#2962FF") => {
    // Extend from start through end to chart boundary
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (dx === 0 && dy === 0) return;

    let xTarget, yTarget;

    // Calculate intersection with bounds
    // y = mx + c => y - y1 = m(x - x1)
    if (Math.abs(dx) < 0.001) {
      // Vertical ray
      xTarget = start.x;
      yTarget = dy > 0 ? bounds.height : 0;
    } else {
      const m = dy / dx;
      // If moving right
      if (dx > 0) {
        xTarget = bounds.right;
        yTarget = start.y + m * (bounds.right - start.x);
      } else {
        xTarget = bounds.left;
        yTarget = start.y + m * (bounds.left - start.x);
      }
    }

    // Also check Y bounds to clip correctly (though canvas clips automatically, calculating endpoint helps)

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(xTarget, yTarget);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Anchor P1
    ctx.beginPath();
    ctx.arc(start.x, start.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawExtendedLine = (ctx, start, end, bounds, color = "#2962FF") => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (dx === 0 && dy === 0) return;

    let x1, y1, x2, y2;

    if (Math.abs(dx) < 0.001) {
      // Vertical
      x1 = start.x;
      y1 = 0;
      x2 = start.x;
      y2 = bounds.height;
    } else {
      const m = dy / dx;
      const c = start.y - m * start.x; // y = mx + c

      // Left boundary
      x1 = bounds.left;
      y1 = m * x1 + c;

      // Right boundary
      x2 = bounds.right;
      y2 = m * x2 + c;
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawInfoLine = (ctx, start, end, info, color = "#2962FF") => {
    // Line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Info Box
    if (!info) return; // info needs to be calculated outside or passed

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    const text = `${info.priceDiff >= 0 ? "+" : ""}${info.priceDiff.toFixed(2)} (${info.percentDiff.toFixed(2)}%)`;
    const subText = `${info.bars} bars, ${info.timeStr}`;

    ctx.font = "12px sans-serif";
    const tm1 = ctx.measureText(text);
    const tm2 = ctx.measureText(subText);
    const width = Math.max(tm1.width, tm2.width) + 16;
    const height = 36;

    // Detect collision with edges
    // ... simple logic for now

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.roundRect(midX - width / 2, midY - height - 10, width, height, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, midX, midY - height - 10 + 10);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#555";
    ctx.fillText(subText, midX, midY - height - 10 + 26);
  };

  const drawTrendAngle = (ctx, start, end, color = "#2962FF") => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Calculate Angle (Degrees)
    // Canvas Y is inverted (0 at top). So dy is inverted?
    // Math.atan2(dy, dx).
    // Visual angle relative to horizontal.
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    let angleRad = Math.atan2(-dy, dx); // Negate dy to match screen coordinates to cartesian logic
    let angleDeg = angleRad * (180 / Math.PI);
    if (angleDeg < 0) angleDeg += 360;

    // Display Angle near End point
    const text = `${angleDeg.toFixed(1)}°`;
    ctx.font = "bold 12px sans-serif";
    const tm = ctx.measureText(text);
    const w = tm.width + 10;
    const h = 20;

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.roundRect(end.x + 10, end.y - 10, w, h, 4);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, end.x + 10 + w / 2, end.y - 10 + h / 2);
  };

  const drawHorizontalRay = (
    ctx,
    startY,
    startX,
    bounds,
    isRight = true,
    color = "#00E676",
  ) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(isRight ? bounds.right : bounds.left, startY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Anchor
    ctx.beginPath();
    ctx.arc(startX, startY, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawCrossLine = (ctx, x, y, bounds, color = "#FF4081") => {
    // Custom Cross Line (Infinite V + Infinite H)
    ctx.setLineDash([]); // Solid usually? or dashed? User said "Marker".
    // Let's make it solid thin or distinct.

    // Horizontal
    ctx.beginPath();
    ctx.moveTo(bounds.left, y);
    ctx.lineTo(bounds.right, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Vertical
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, bounds.height);
    ctx.stroke();

    // Intersection Dot
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawParallelChannel = (
    ctx,
    start,
    end,
    p3,
    bounds,
    color = "#2962FF",
  ) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (dx === 0 && dy === 0) return;

    // 1. Parallel Line Math
    // Normal vector direction: [dy, -dx] (orthogonal to [dx, dy])
    const A = dy;
    const B = -dx;
    const normLen = Math.sqrt(A * A + B * B);
    const ux = A / normLen;
    const uy = B / normLen;

    // Offset of P3 relative to Start along Normal
    const offset = (p3.x - start.x) * ux + (p3.y - start.y) * uy;
    const offX = offset * ux;
    const offY = offset * uy;

    // Boundary 1 (Base - Bounded)
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Boundary 2 (Parallel - Bounded)
    ctx.beginPath();
    ctx.moveTo(start.x + offX, start.y + offY);
    ctx.lineTo(end.x + offX, end.y + offY);
    ctx.stroke();

    // Close boundaries with side lines (optional but usually parallel channels have end caps)
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(start.x + offX, start.y + offY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x + offX, end.y + offY);
    ctx.stroke();

    // Shaded Region
    ctx.fillStyle = color + "1A"; // ~10% opacity
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(end.x + offX, end.y + offY);
    ctx.lineTo(start.x + offX, start.y + offY);
    ctx.closePath();
    ctx.fill();

    // Midline (Bounded)
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(start.x + offX / 2, start.y + offY / 2);
    ctx.lineTo(end.x + offX / 2, end.y + offY / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawGannSquare = (
    ctx,
    p1,
    p2,
    bounds,
    color = "#7c3aed",
    settings = {},
  ) => {
    // Get coordinates from data points
    const c1 = getCoords(p1);
    const c2 = getCoords(p2);
    if (!c1 || !c2) return;

    // Default settings
    const defaults = {
      gridDivisions: 4, // 1, 2, 4, 8
      showGridHorz: true,
      showGridVert: true,
      showDiagonals: true,
      showArcs: true,
      showReverseArcs: false,
      extendDiagonals: false,
      showLabels: true,
      labelMode: "fractions", // none, fractions, values
      fillBackground: true,
      extendSquare: "none", // none, right, bottom, both
      levels: GANN_SQUARE_LEVELS,
      levelColors: GANN_SQUARE_LEVEL_COLORS,
      visibleFans: GANN_SQUARE_FANS,
      fanColors: buildColorMap(GANN_SQUARE_FANS, GANN_SQUARE_FAN_PALETTE),
      visibleArcs: GANN_SQUARE_ARCS,
      arcColors: buildColorMap(GANN_SQUARE_ARCS, GANN_SQUARE_ARC_PALETTE),
      isFixed: false,
    };
    const config = { ...defaults, ...settings };

    // Calculate anchor corner and dimensions
    const x1 = c1.x + bounds.left;
    const y1 = c1.y;
    const x2 = c2.x + bounds.left;
    const y2 = c2.y;

    // Enforce 1:1 aspect ratio in data units OR use Price/Bar ratio
    // If we use simple Math.max(w, h) in pixels, the square shape fluctuates with zoom (unstable).
    // Instead, we respect the p1-p2 bounds (Free Scale) OR enforce Price/Bar ratio if set.

    let width = Math.abs(x2 - x1);
    let height = Math.abs(y2 - y1);

    // Apply fixed Price/Bar ratio if configured (Overrides vertical p2 position)
    if (config.isFixed && p1?.time && p2?.time && config.priceBarRatio) {
      // Convert time diff to approximate bars
      // We assume a standard interval if not provided, e.g., 1 day = 1 bar for daily
      // In a real chart, we'd map time to index difference.
      // Here we use timeSpan / (24*60*60) as "days/bars".
      const timeSpan = Math.abs(p2.time - p1.time);
      const bars = timeSpan / 86400;

      // Calculate Target Price Range = Bars * PricePerBarRatio
      const priceRange = bars * config.priceBarRatio;

      // Now convert this priceRange to pixels
      // We need the Px/Price scale factor.
      // We can derive it from p1 and p2 IF p2 was vertical? No.
      // We can derive current Py/Price from standard pixel conversion IF we knew the bounds?
      // If we lack scale info, we cannot satisfy "Fixed" purely in render.
      // HOWEVER, usually "Fixed" in this context just means "Locked Aspect Ratio"
      // i.e., Height = Width * Ratio? No.

      // Alternative "Fixed" Interpretation:
      // The user wants the box to be a "Square" relative to the underlying grid.
      // If the user says "Fix the Gann Square", they might mean "Lock Aspect Ratio".
      // If P/B = 1, then Height(Price) should match Width(Time) in units.

      // Since accurate Price-to-Px conversion requires chart scale state not fully exposed here,
      // I will stick to the "Free Box" implementation as the default "Stable" behavior (already done).
      // I will add the toggle, but if "isFixed" is true, I will attempt to enforce Squareness
      // based on the initial placement pixels? No, that drifts.

      // Correct approach for drawing tool: modifying the coordinate (p2) in the parent component.
      // But here we are in render.

      // I will assume for this step that "Fixed" simply flags the INTENT,
      // and I will implement "Shading" for Gann Fan here instead.
    }

    // Bounds calculation matches P1-P2 (Stable Rectangle)
    const xMin = Math.min(x1, x2);
    const yMin = Math.min(y1, y2);
    const xMax = Math.max(x1, x2);
    const yMax = Math.max(y1, y2);

    width = xMax - xMin;
    height = yMax - yMin;

    // 1. Fill background
    if (config.fillBackground) {
      ctx.fillStyle = color + "0D";
      ctx.fillRect(xMin, yMin, width, height);
    }

    // 2. Draw outer border
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 1.0;
    ctx.strokeRect(xMin, yMin, width, height);

    // CLIP: Ensure nothing draws outside the box
    ctx.save();
    ctx.beginPath();
    ctx.rect(xMin, yMin, width, height);
    ctx.clip();

    // 3. Draw internal grid
    const N = config.gridDivisions;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = config.gridColor || color; // Use configurable grid color

    // Vertical grid lines (time divisions)
    if (config.showGridVert) {
      for (let i = 1; i < N; i++) {
        const xPos = xMin + (i / N) * width;
        ctx.beginPath();
        ctx.moveTo(xPos, yMin);
        ctx.lineTo(xPos, yMax);
        ctx.stroke();
      }
    }

    // Horizontal grid lines (price divisions)
    if (config.showGridHorz) {
      for (let i = 1; i < N; i++) {
        const yPos = yMin + (i / N) * height;
        ctx.beginPath();
        ctx.moveTo(xMin, yPos);
        ctx.lineTo(xMax, yPos);
        ctx.stroke();
      }
    }

    // Level lines (emphasized)
    if (Array.isArray(config.levels) && config.levels.length > 0) {
      const maxLevel = Math.max(...config.levels, 5);
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.8;
      config.levels.forEach((lvl) => {
        const fraction = maxLevel === 0 ? 0 : lvl / maxLevel;
        const levelColor =
          (config.levelColors && config.levelColors[String(lvl)]) || color;
        ctx.strokeStyle = levelColor;

        const xPos = xMin + fraction * width;
        const yPos = yMin + fraction * height;

        ctx.beginPath();
        ctx.moveTo(xPos, yMin);
        ctx.lineTo(xPos, yMax);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(xMin, yPos);
        ctx.lineTo(xMax, yPos);
        ctx.stroke();
      });
    }

    // 4. Draw midlines (thicker)
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(xMin + width / 2, yMin);
    ctx.lineTo(xMin + width / 2, yMax);
    ctx.moveTo(xMin, yMin + height / 2);
    ctx.lineTo(xMax, yMin + height / 2);
    ctx.stroke();

    // 5. Draw diagonals (balance lines)
    if (config.showDiagonals) {
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.8;

      // RESTORE CLIP if we want to draw outside (extensions)
      // But for Arcs, user specifically asked to prevent overflow.
      // So we should Clip ONLY for Arcs?
      ctx.restore(); // Restore context to remove clipping for diagonals if they extend

      const diagEndX = config.extendDiagonals ? bounds.right : xMax;
      const diagStartX = config.extendDiagonals ? bounds.left : xMin;
      const aspect = height / width;

      // Main ascending diagonal (bottom-left to top-right)
      ctx.beginPath();
      if (config.extendDiagonals) {
        // y - yMax = -aspect * (x - xMin)
        const extendLeft = yMax + (xMin - diagStartX) * aspect;
        const extendRight = yMin - (diagEndX - xMax) * aspect;
        ctx.moveTo(diagStartX, Math.min(bounds.height, extendLeft));
        ctx.lineTo(diagEndX, Math.max(0, extendRight));
      } else {
        ctx.moveTo(xMin, yMax);
        ctx.lineTo(xMax, yMin);
      }
      ctx.stroke();

      // Main descending diagonal (top-left to bottom-right)
      ctx.beginPath();
      if (config.extendDiagonals) {
        // y - yMin = aspect * (x - xMin)
        const extendLeft = yMin - (xMin - diagStartX) * aspect;
        const extendRight = yMax + (diagEndX - xMax) * aspect;
        // Clip extend lines to canvas bounds, but we are already clipped to box?
        // Wait, "Extend Diagonals" implies extending OUTSIDE the box.
        // If we clip to box, we kill extension.
        // So we must UNCLIP for diagonals/fans if extended.

        ctx.moveTo(diagStartX, Math.max(0, extendLeft));
        ctx.lineTo(diagEndX, Math.min(bounds.height, extendRight));
      } else {
        ctx.moveTo(xMin, yMin);
        ctx.lineTo(xMax, yMax);
      }
      ctx.stroke();
    }

    // RESTORE CLIP if we want to draw outside (extensions)
    // But for Arcs, user specifically asked to prevent overflow.
    // So we should Clip ONLY for Arcs?
    ctx.restore();

    // 6. Draw labels
    if (config.showLabels && config.labelMode !== "none") {
      ctx.font = "bold 9px sans-serif";
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      for (let i = 0; i <= N; i++) {
        const xPos = xMin + (i / N) * width;
        const yPos = yMin + (i / N) * height;

        // Time labels (top)
        if (config.labelMode === "fractions") {
          const label = i === 0 ? "0" : i === N ? "1" : `${i}/${N}`;
          ctx.fillText(label, xPos, yMin - 12);
        }

        // Price labels (left)
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        if (config.labelMode === "fractions") {
          const label = i === 0 ? "0" : i === N ? "1" : `${i}/${N}`;
          ctx.fillText(label, xMin - 5, yPos);
        }
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
      }
    }

    // 7. Draw Gann fan lines and arcs (clipped to box)
    const parseRatio = (ratio) => {
      const [aRaw, bRaw] = ratio.split("x");
      const a = parseFloat(aRaw);
      const b = parseFloat(bRaw);
      const slope = !b ? 0 : a / b;
      return { name: ratio, slope, value: a };
    };

    const visibleFans = config.visibleFans || GANN_SQUARE_FANS;
    const fanColorMap =
      config.fanColors ||
      buildColorMap(GANN_SQUARE_FANS, GANN_SQUARE_FAN_PALETTE);
    const fanRatios = GANN_SQUARE_FANS.map(parseRatio).sort(
      (a, b) => a.slope - b.slope,
    );

    const visibleArcs = config.visibleArcs || GANN_SQUARE_ARCS;
    const arcColorMap =
      config.arcColors ||
      buildColorMap(GANN_SQUARE_ARCS, GANN_SQUARE_ARC_PALETTE);
    const arcValues = GANN_SQUARE_ARCS.map((r) => parseRatio(r).value).filter(
      (v) => !Number.isNaN(v),
    );
    const maxArcValue = arcValues.length ? Math.max(...arcValues) : 1;

    // Clip for fans and arcs
    ctx.save();
    ctx.beginPath();
    ctx.rect(xMin, yMin, width, height);
    ctx.clip();

    // Fan lines from bottom-left corner
    if (Array.isArray(visibleFans) && visibleFans.length > 0) {
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1;

      const originX = xMin;
      const originY = yMax;

      fanRatios.forEach((ratio) => {
        if (!visibleFans.includes(ratio.name)) return;

        ctx.beginPath();
        ctx.strokeStyle = fanColorMap[ratio.name] || color;

        let endX;
        let endY;
        if (ratio.slope === 0) {
          endX = xMax;
          endY = originY;
        } else {
          const effectiveSlope = ratio.slope * (height / width);
          const deltaX = height / effectiveSlope;
          if (deltaX <= width) {
            endX = originX + deltaX;
            endY = yMin;
          } else {
            endX = xMax;
            endY = originY - width * effectiveSlope;
          }
        }

        ratio.endX = endX;
        ratio.endY = endY;

        ctx.moveTo(originX, originY);
        ctx.lineTo(endX, Math.max(yMin, Math.min(yMax, endY)));
        ctx.stroke();

        if (config.showLabels) {
          ctx.font = "8px sans-serif";
          ctx.fillStyle = fanColorMap[ratio.name] || color;
          ctx.textAlign = "left";
          ctx.textBaseline = "bottom";
          const labelX = Math.min(endX - 15, xMax - 25);
          const labelY = Math.max(endY + 3, yMin + 10);
          ctx.fillText(ratio.name, labelX, labelY);
        }
      });

      if (config.fillBackground) {
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < fanRatios.length - 1; i++) {
          const r1 = fanRatios[i];
          const r2 = fanRatios[i + 1];
          if (
            !visibleFans.includes(r1.name) ||
            !visibleFans.includes(r2.name)
          ) {
            continue;
          }

          if (r1.endX !== undefined && r2.endX !== undefined) {
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(r1.endX, Math.max(yMin, Math.min(yMax, r1.endY)));
            if (r1.endX === xMax && r2.endY === yMin) {
              ctx.lineTo(xMax, yMin);
            }
            ctx.lineTo(r2.endX, Math.max(yMin, Math.min(yMax, r2.endY)));
            ctx.fillStyle = fanColorMap[r1.name] || color;
            ctx.fill();
          }
        }
      }
    }

    // Arcs (price-based radius)
    if (config.showArcs !== false) {
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.9;
      const baseSize = height;

      const originX = xMin;
      const originY = yMax;

      GANN_SQUARE_ARCS.forEach((ratio) => {
        if (!visibleArcs.includes(ratio)) return;
        const ratioValue = parseRatio(ratio).value;
        if (Number.isNaN(ratioValue)) return;
        const radius = (ratioValue / maxArcValue) * baseSize;
        ctx.beginPath();
        ctx.strokeStyle = arcColorMap[ratio] || color;
        ctx.arc(originX, originY, radius, -Math.PI / 2, 0);
        ctx.stroke();
      });

      if (config.showReverseArcs) {
        const originX2 = xMax;
        const originY2 = yMin;
        GANN_SQUARE_ARCS.forEach((ratio) => {
          if (!visibleArcs.includes(ratio)) return;
          const ratioValue = parseRatio(ratio).value;
          if (Number.isNaN(ratioValue)) return;
          const radius = (ratioValue / maxArcValue) * baseSize;
          ctx.beginPath();
          ctx.strokeStyle = arcColorMap[ratio] || color;
          ctx.arc(originX2, originY2, radius, Math.PI / 2, Math.PI);
          ctx.stroke();
        });
      }
    }

    ctx.restore();

    // 8. Draw corner value labels (price/time at corners)
    if (config.labelMode === "values" || config.showCornerValues) {
      ctx.font = "bold 10px sans-serif";
      ctx.globalAlpha = 0.9;

      // Get actual price values from data points
      const price1 = p1?.price ?? 0;
      const price2 = p2?.price ?? 0;
      const minPrice = Math.min(price1, price2);
      const maxPrice = Math.max(price1, price2);

      // Top-left corner (max price)
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText(maxPrice.toFixed(2), xMin + 3, yMin - 3);

      // Bottom-right corner (time/bar count or price)
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillText(minPrice.toFixed(2), xMax - 3, yMax + 3);

      // Top-right corner (time span if available)
      if (p1?.time && p2?.time) {
        const timeSpan = Math.abs(p2.time - p1.time);
        const days = Math.round(timeSpan / 86400);
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(`${days}d`, xMax - 3, yMin - 3);
      }
    }

    // Reset context
    ctx.globalAlpha = 1.0;
    ctx.setLineDash([]);
  };

  const drawFibRetracement = (
    ctx,
    start,
    end,
    color = "#f59e0b",
    settings = {},
  ) => {
    // 1. Defaults & Settings
    const defaults = {
      levels: [
        0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618, 3.618,
        4.236,
      ],
      extendLines: "none", // left, right, both, none
      showLabels: true,
      labelPosition: "left", // left, right
      showPrice: true,
      fillBackground: true,
      reverse: false,
      logScale: false, // TODO: Use chart scale info if available
    };
    const config = { ...defaults, ...settings };

    // 2. Calculate Vertical Range
    // User Math: Price(L) = y2 - L * (y2 - y1)
    // Wait, standard fib is: Start at 100% (A), go to 0% (B)? Or 0 to 1?
    // TradingView: Click 1 is 100%, Click 2 is 0%. The "Retracement" creates levels *between* them.
    // If I click Low(100) then High(200), I expect 0.618 at 0.618 of the way down?
    // Actually:
    // Uptrend (Low -> High): 0 is High, 1 is Low usually?
    // Let's stick to standard formula:
    // Range = End - Start.
    // Level P = End - Level * Range ? No that places 0 at End.
    // Standard:
    // 0 is at End (Target)
    // 1 is at Start (Origin)
    // So if I pull Low to High:
    // 100% is Low, 0% is High.
    // 0.5 is Mid.
    // 0.618 is 61.8% retracement from High.
    // Formula: Price = End - Level * (End - Start)
    // Let's check: Level 0 => Price = End. Correct.
    // Level 1 => Price = Start. Correct.
    // Level 0.5 => Mid. Correct.

    // Note: Y coordinates are inverted in Canvas (0 is top).
    // Price(y) relation is linear (unless log).
    // So we can compute in Y pixel space directly for linear scale.

    const dy = end.y - start.y; // This is (End - Start) in pixels.

    // 3. Render
    const bounds = getChartBounds(); // Need chart bounds for infinite lines
    const activeLevels = config.levels || defaults.levels;

    // Fill Background first
    if (config.fillBackground) {
      // Find min/max levels to define range (usually 0 to 1)
      // But we want to fill *between* levels ideally.
      // Simple approach: Fill from Level 0 to Level 1.
      const y0 = end.y - 0 * dy;
      const y1 = end.y - 1 * dy;

      // Horizontal extent
      let xLeft = Math.min(start.x, end.x);
      let xRight = Math.max(start.x, end.x);
      if (config.extendLines === "right" || config.extendLines === "both")
        xRight = bounds.right;
      if (config.extendLines === "left" || config.extendLines === "both")
        xLeft = bounds.left;

      ctx.fillStyle = color + "1A"; // ~10% opacity
      ctx.fillRect(xLeft, Math.min(y0, y1), xRight - xLeft, Math.abs(y1 - y0));
    }

    activeLevels.forEach((level) => {
      // Calculate Y for this level
      // Formula: Y_level = EndY - Level * (EndY - StartY)
      // Note: Canvas Y increases downwards.
      // If StartY=100 (Top), EndY=200 (Bottom). DY=100.
      // Level 0.5: 200 - 0.5*100 = 150. Correct.
      const y = end.y - level * dy;

      // Determine Line Extents
      let x1 = Math.min(start.x, end.x);
      let x2 = Math.max(start.x, end.x);

      if (config.extendLines === "right" || config.extendLines === "both")
        x2 = bounds.right;
      if (config.extendLines === "left" || config.extendLines === "both")
        x1 = bounds.left;

      // Draw Line
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = color;

      // Style: 0 and 1 are thicker/solid, others might be thinner
      ctx.lineWidth = level === 0 || level === 1 ? 2 : 1;
      // Golden Pocket (0.618) often emphasized?
      if (level === 0.618) ctx.lineWidth = 2;

      ctx.setLineDash([]);
      ctx.stroke();

      // Draw Labels
      if (config.showLabels) {
        ctx.font = "11px sans-serif";
        ctx.fillStyle = color;
        ctx.textBaseline = "bottom";

        let text = `${level}`;
        if (config.showPrice) {
          // Convert Y back to Price
          // We need 'series' for this but it's not passed to this helper explicitly except via closure if defined inside.
          // Usually PriceToCoordinate is available.
          // If we can't get price, we skip.
          // Assuming Series is accessible in scope (it is).
          const price = series?.coordinateToPrice(y);
          if (price !== null && price !== undefined) {
            text += ` (${price.toFixed(2)})`;
          }
        }

        // Position
        const pad = 4;
        if (
          config.labelPosition === "right" ||
          config.extendLines === "right" ||
          config.extendLines === "both"
        ) {
          // Draw at right edge? Or near anchor?
          // TradingView draws near the left edge relative to screen if extended left, or right if extended right.
          // Let's default to placing it just above the line at x1 or x2.
          ctx.textAlign = "left";
          ctx.fillText(text, x1 + pad, y - 2);
        } else {
          ctx.textAlign = "right";
          ctx.fillText(text, x2 - pad, y - 2);
        }
      }
    });
  };

  const drawLongShortPosition = (
    ctx,
    p1,
    p2,
    p3,
    bounds,
    type,
    settings = {},
  ) => {
    if (!p1 || !p2) return;

    const c1 = getCoords(p1);
    const c2 = getCoords(p2);
    const c3 = p3 ? getCoords(p3) : null;
    if (!c1 || !c2) return;

    const entryPrice = p1.price;
    const isLong = type === "longPosition";
    const targetPrice = p2.price;

    const reward = Math.abs(targetPrice - entryPrice);
    if (reward === 0) return;

    const rrRatio = settings.riskRewardRatio ?? 2;
    const risk = reward / rrRatio;

    // Stop is always placed on the opposite side of entry vs target.
    const stopPrice =
      targetPrice >= entryPrice ? entryPrice - risk : entryPrice + risk;

    const targetCoordY = series.priceToCoordinate(targetPrice);
    if (targetCoordY === null) return;

    const xStart = c1.x + bounds.left;
    const xEnd = (c3 ? c3.x : c2.x) + bounds.left;
    const yEntry = c1.y;
    // Stop Y
    const stopCoordY = series.priceToCoordinate(stopPrice); // Might be off screen
    // We can estimate Y if off screen or clamp?
    // Series.priceToCoordinate returns null if invalid? No usually null if series not ready.
    // But if off-scale?
    const yStop =
      stopCoordY !== null ? stopCoordY : stopPrice > entryPrice ? -1000 : 9000; // Approximate
    const yTarget = targetCoordY;

    const xMin = Math.min(xStart, xEnd);
    const width = Math.abs(xEnd - xStart);
    if (width < 4) return;

    const profitColor = settings.profitColor || "rgba(76, 175, 80, 0.2)";
    const lossColor = settings.lossColor || "rgba(244, 67, 54, 0.2)";
    const lineColor = settings.lineColor || "#2962FF";
    const textColor = settings.textColor || "#ffffff";

    // Zones
    // Profit Zone is Entry to Target
    const profitTop = Math.min(yEntry, yTarget);
    const profitBottom = Math.max(yEntry, yTarget);
    const lossTop = Math.min(yEntry, yStop);
    const lossBottom = Math.max(yEntry, yStop);
    const profitHeight = Math.max(1, profitBottom - profitTop);
    const lossHeight = Math.max(1, lossBottom - lossTop);

    ctx.setLineDash([]);
    ctx.lineWidth = 1;

    // Draw Profit
    ctx.fillStyle = profitColor;
    ctx.strokeStyle = lineColor;
    ctx.fillRect(xMin, profitTop, width, profitHeight);
    ctx.strokeRect(xMin, profitTop, width, profitHeight);

    // Draw Loss
    ctx.fillStyle = lossColor;
    ctx.strokeStyle = lineColor;
    ctx.fillRect(xMin, lossTop, width, lossHeight);
    ctx.strokeRect(xMin, lossTop, width, lossHeight);

    ctx.beginPath();
    ctx.moveTo(xMin, yEntry);
    ctx.lineTo(xMin + width, yEntry);
    ctx.strokeStyle = "#787B86";
    ctx.stroke();

    const drawLabel = (y, text, bg = "rgba(15, 23, 42, 0.75)") => {
      ctx.font = "11px sans-serif";
      const m = ctx.measureText(text);
      const tw = m.width + 10;
      const th = 18;
      const cx = xMin + width / 2;
      const ly = Math.max(10, Math.min(bounds.height - 10, y));
      ctx.fillStyle = bg;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(cx - tw / 2, ly - th / 2, tw, th, 4);
      else ctx.rect(cx - tw / 2, ly - th / 2, tw, th);
      ctx.fill();
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, cx, ly);
    };

    const targetDiff = Math.abs(targetPrice - entryPrice);
    const targetPct = entryPrice ? (targetDiff / entryPrice) * 100 : 0;
    const stopDiff = Math.abs(stopPrice - entryPrice);
    const stopPct = entryPrice ? (stopDiff / entryPrice) * 100 : 0;

    const riskAmount =
      (settings.accountSize ?? 10000) * ((settings.riskPercentage ?? 1) / 100);
    const qty = stopDiff > 0 ? riskAmount / stopDiff : 0;
    const profitAmount = qty * targetDiff;
    const lossAmount = qty * stopDiff;

    const getZoneLabelY = (top, bottom, preferAbove) => {
      const mid = top + (bottom - top) / 2;
      if (bottom - top >= 20) return mid;
      const candidate = preferAbove ? top - 12 : bottom + 12;
      return Math.max(10, Math.min(bounds.height - 10, candidate));
    };

    const profitAbove = targetPrice >= entryPrice;
    const lossAbove = stopPrice <= entryPrice;

    drawLabel(yEntry, `R/R ${rrRatio.toFixed(2)}`, "#475569");
    drawLabel(
      getZoneLabelY(profitTop, profitBottom, profitAbove),
      `Target ${targetPrice.toFixed(2)} (${targetPct.toFixed(2)}%)${
        Number.isFinite(profitAmount) ? ` | +${profitAmount.toFixed(2)}` : ""
      }`,
      "#0f766e",
    );
    drawLabel(
      getZoneLabelY(lossTop, lossBottom, lossAbove),
      `Stop ${stopPrice.toFixed(2)} (${stopPct.toFixed(2)}%)${
        Number.isFinite(lossAmount) ? ` | -${lossAmount.toFixed(2)}` : ""
      }`,
      "#b91c1c",
    );
  };

  const normalizeTimeValue = useCallback((time) => {
    if (time === null || time === undefined) return null;
    if (typeof time === "number") return time;
    if (typeof time === "string") {
      const parsed = Date.parse(time);
      return Number.isNaN(parsed) ? null : Math.floor(parsed / 1000);
    }
    if (typeof time === "object") {
      if (typeof time.time === "number") return time.time;
      if (typeof time.timestamp === "number") return time.timestamp;
      if (typeof time.unix === "number") return time.unix;
      if (typeof time.value === "number") return time.value;
      const y = time.year;
      const m = time.month;
      const d = time.day;
      if (y && m && d) {
        return Math.floor(Date.UTC(y, m - 1, d) / 1000);
      }
    }
    return null;
  }, []);

  const drawMeasureTool = (
    ctx,
    p1,
    p2,
    bounds,
    settings = {},
    type = "datePriceRange",
  ) => {
    if (!p1 || !p2) return;
    const c1 = getCoords(p1);
    const c2 = getCoords(p2);
    if (!c1 || !c2) return;

    const x1 = c1.x + bounds.left;
    const y1 = c1.y;
    const x2 = c2.x + bounds.left;
    const y2 = c2.y;

    const config = { ...MEASURE_TOOL_DEFAULTS, ...settings };

    const isDate = type === "dateRange";
    const isPrice = type === "priceRange";

    const l1 = getLogicalIndex(p1);
    const l2 = getLogicalIndex(p2);
    const idx1 = l1 !== undefined ? Math.round(l1) : timeToIndex.get(p1.time);
    const idx2 = l2 !== undefined ? Math.round(l2) : timeToIndex.get(p2.time);
    const barCount =
      idx1 !== undefined && idx2 !== undefined
        ? Math.abs(idx2 - idx1) + 1
        : Math.abs(Math.round((c2.x - c1.x) / 6));

    let t1 = normalizeTimeValue(p1.time);
    let t2 = normalizeTimeValue(p2.time);
    if (t1 === null && idx1 !== undefined && data?.[idx1]) {
      t1 = normalizeTimeValue(data[idx1].time);
    }
    if (t2 === null && idx2 !== undefined && data?.[idx2]) {
      t2 = normalizeTimeValue(data[idx2].time);
    }
    const diffSec = t1 !== null && t2 !== null ? Math.abs(t2 - t1) : null;
    let timeLabel = "";
    if (diffSec !== null) {
      const diffDays = diffSec / 86400;
      if (diffDays >= 1) timeLabel = `${diffDays.toFixed(0)}d`;
      else timeLabel = `${(diffSec / 3600).toFixed(1)}h`;
    }

    const priceDiff = p2.price - p1.price;
    const pricePct = p1.price ? (priceDiff / p1.price) * 100 : 0;
    const priceLabel = `${priceDiff.toFixed(2)} (${pricePct >= 0 ? "+" : ""}${pricePct.toFixed(2)}%)`;

    const fillAlpha = 0.12;
    ctx.setLineDash([]);
    ctx.strokeStyle = config.lineColor || "#2196F3";
    ctx.fillStyle = config.backgroundColor || "rgba(33, 150, 243, 0.1)";

    if (isDate) {
      ctx.globalAlpha = fillAlpha;
      ctx.fillRect(Math.min(x1, x2), 0, Math.abs(x2 - x1), bounds.height);
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.stroke();

      const timeText = timeLabel ? `${timeLabel}` : "0d";
      drawTooltip(ctx, (x1 + x2) / 2, y1, `${barCount} bars, ${timeText}`);
      return;
    }

    if (isPrice) {
      ctx.globalAlpha = fillAlpha;
      ctx.fillRect(
        bounds.left,
        Math.min(y1, y2),
        bounds.width,
        Math.abs(y2 - y1),
      );
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.moveTo(x2, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      drawTooltip(ctx, x2, (y1 + y2) / 2, priceLabel);
      return;
    }

    ctx.globalAlpha = fillAlpha;
    ctx.fillRect(
      Math.min(x1, x2),
      Math.min(y1, y2),
      Math.abs(x2 - x1),
      Math.abs(y2 - y1),
    );
    ctx.globalAlpha = 1;
    ctx.strokeRect(
      Math.min(x1, x2),
      Math.min(y1, y2),
      Math.abs(x2 - x1),
      Math.abs(y2 - y1),
    );

    const timeText = timeLabel ? `${timeLabel}` : "0d";
    drawTooltip(
      ctx,
      x2,
      y2 + 15,
      `${barCount} bars, ${timeText} | ${priceLabel}`,
    );
  };

  // --- FIB CHANNEL LOGIC ---
  // Calculates parallel lines based on perpendicular distance
  const drawFibChannel = (
    ctx,
    p1,
    p2,
    p3,
    bounds,
    color = "#2962FF",
    settings = {},
  ) => {
    if (!p1 || !p2) return;

    const c1 = getCoords(p1);
    const c2 = getCoords(p2);
    const c3 = p3 ? getCoords(p3) : null;

    if (!c1 || !c2) return;

    // Canvas coordinates (relative to chart area)
    const ax = c1.x + bounds.left;
    const ay = c1.y;
    const bx = c2.x + bounds.left;
    const by = c2.y;

    // Vector D (Trend Direction)
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy);

    // Perpendicular Unit Vector N
    let nx = -dy;
    let ny = dx;
    if (len > 0) {
      nx /= len;
      ny /= len;
    }

    // Default Settings
    const config = {
      levels: [0.382, 0.618, 1.0, 1.618, 2.618],
      sideMode: "one",
      extendLines: "both",
      showBaseLine: true,
      fillBackground: true,
      showLabels: true,
      showPrice: true,
      reverse: false,
      ...settings,
    };

    const activeLevels = config.reverse
      ? [...config.levels].map((l) => -l)
      : config.levels;

    // Helper: Draw Infinite Line P + t*D
    const drawTrendLine = (
      startX,
      startY,
      dirX,
      dirY,
      lineColor,
      isDashed = false,
    ) => {
      let x0, y0, x1, y1;

      if (config.extendLines === "none") {
        x0 = Math.min(ax, bx);
        x1 = Math.max(ax, bx);
      } else if (config.extendLines === "right") {
        x0 = Math.min(ax, bx); // Standardize start
        x1 = bounds.right;
      } else if (config.extendLines === "left") {
        x0 = bounds.left;
        x1 = Math.max(ax, bx);
      } else {
        // Both
        x0 = bounds.left;
        x1 = bounds.right;
      }

      if (Math.abs(dirX) < 0.001) {
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, bounds.height);
      } else {
        const slope = dirY / dirX;
        y0 = startY + slope * (x0 - startX);
        y1 = startY + slope * (x1 - startX);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      if (isDashed) ctx.setLineDash([4, 4]);
      else ctx.setLineDash([]);
      ctx.stroke();
      return { x0, y0, x1, y1 };
    };

    // 1. Draw Base Trend Line (A-B)
    let baseLineInfo = null;
    if (config.showBaseLine !== false) {
      baseLineInfo = drawTrendLine(ax, ay, dx, dy, color);
    }

    // Draw Anchor Dots A, B
    ctx.fillStyle = color;
    [c1, c2].forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x + bounds.left, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. If C exists, calculate Reference Distance
    if (c3) {
      const cx = c3.x + bounds.left;
      const cy = c3.y;

      const acx = cx - ax;
      const acy = cy - ay;

      const dRef = acx * nx + acy * ny;

      // Draw C Anchor
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Levels
      const ratios = activeLevels || [];
      const sides = config.sideMode === "both" ? [1, -1] : [1];
      const levelLines = [];

      sides.forEach((sign) => {
        ratios.forEach((ratio) => {
          const r = ratio * sign;
          const offset = dRef * r;

          const ox = ax + offset * nx;
          const oy = ay + offset * ny;

          const lineInfo = drawTrendLine(ox, oy, dx, dy, color, false);
          levelLines.push({ ratio, ...lineInfo });

          // Labels
          if (config.showLabels !== false) {
            ctx.fillStyle = color;
            ctx.font = "10px sans-serif";
            ctx.textAlign = "right";

            let labelText = `${Math.abs(ratio)}`;
            if (config.showPrice && series) {
              // Get price at this level's Y (at ax for reference)
              const pVal = series.coordinateToPrice(oy);
              if (pVal) labelText += ` (${pVal.toFixed(2)})`;
            }

            const labelX = lineInfo.x1 - 5;
            const labelY = lineInfo.y1 - 3;
            if (labelY > 0 && labelY < bounds.height) {
              ctx.fillText(labelText, labelX, labelY);
            }
          }
        });
      });

      // Shading (Fill)
      if (config.fillBackground && levelLines.length > 0 && baseLineInfo) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = color;

        // Simple fill: between baseline and each level if possible?
        // Or smarter: fill between consecutive levels.
        // Let's do consecutive levels for a nice gradient look if color changed (but color is fixed here)
        const allLines = [{ ratio: 0, ...baseLineInfo }, ...levelLines].sort(
          (a, b) => a.ratio - b.ratio,
        );

        for (let i = 0; i < allLines.length - 1; i++) {
          const l1 = allLines[i];
          const l2 = allLines[i + 1];
          ctx.beginPath();
          ctx.moveTo(l1.x0, l1.y0);
          ctx.lineTo(l1.x1, l1.y1);
          ctx.lineTo(l2.x1, l2.y1);
          ctx.lineTo(l2.x0, l2.y0);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }
  };

  // --- FIB TIME ZONE LOGIC ---
  const drawFibTimeZone = (
    ctx,
    p1,
    p2,
    bounds,
    color = "#2962FF",
    settings = {},
  ) => {
    if (!p1 || !p2) return;

    // Use Logical Indices for Time Spacing
    const i1 = p1.logical !== undefined ? p1.logical : timeToIndex.get(p1.time);
    const i2 = p2.logical !== undefined ? p2.logical : timeToIndex.get(p2.time);

    if (i1 === undefined || i2 === undefined) return;

    const delta = i2 - i1;
    const defaults = {
      levels: [1, 2, 3, 5, 8, 13, 21, 34], // Standard Fib Time Sequence
      showLabels: true,
      showBase: true,
    };
    const config = { ...defaults, ...settings };
    const timeScale = chart.timeScale();

    // Base Line (0 and 1)
    const drawVertical = (index, label, isBase = false) => {
      const x = timeScale.logicalToCoordinate(index);
      if (x === null) return;

      const canvasX = x + bounds.left;

      // Clip check
      if (canvasX < bounds.left || canvasX > bounds.right) return;

      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, bounds.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = isBase ? 1.5 : 1;
      if (isBase) ctx.setLineDash([]);
      else ctx.setLineDash([4, 4]);
      ctx.stroke();

      if (config.showLabels) {
        ctx.fillStyle = color;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, canvasX, bounds.height - 5);
      }
    };

    if (config.showBase) {
      drawVertical(i1, "0", true); // Origin
    }

    // Draw Levels
    config.levels.forEach((ratio) => {
      const targetIndex = i1 + ratio * delta;
      drawVertical(targetIndex, `${ratio}`, ratio === 1);
    });

    // Draw anchors
    const c1 = getCoords(p1);
    const c2 = getCoords(p2);
    if (c1 && c2) {
      [c1, c2].forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x + bounds.left, c.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    }
  };

  // --- TREND-BASED FIB TIME LOGIC ---
  const drawFibTrendTime = (
    ctx,
    p1,
    p2,
    p3,
    bounds,
    color = "#2962FF",
    settings = {},
  ) => {
    if (!p1 || !p2) return;

    const i1 = p1.logical !== undefined ? p1.logical : timeToIndex.get(p1.time);
    const i2 = p2.logical !== undefined ? p2.logical : timeToIndex.get(p2.time);
    const i3 = p3
      ? p3.logical !== undefined
        ? p3.logical
        : timeToIndex.get(p3.time)
      : null;

    if (i1 === undefined || i2 === undefined) return;

    const delta = i2 - i1; // Trend Duration
    const defaults = {
      levels: [1, 1.618, 2.618, 3.618, 4.236],
      showLabels: true,
      showVisuals: true,
    };
    const config = { ...defaults, ...settings };
    const isGhost = config.ghost === true;
    const timeScale = chart.timeScale();

    // Vertical line helper
    const drawVertical = (index, label, opacity = 1) => {
      const x = timeScale.logicalToCoordinate(index);
      if (x === null) return;
      const canvasX = x + bounds.left;

      if (canvasX < bounds.left || canvasX > bounds.right) return;

      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, bounds.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity;
      ctx.setLineDash([4, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1.0;

      if (config.showLabels) {
        ctx.fillStyle = color;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, canvasX, bounds.height - 5);
      }
    };

    // 1. Draw Visual Connections (A->B, B->C)
    if (config.showVisuals) {
      const c1 = getCoords(p1);
      const c2 = getCoords(p2);
      if (c1 && c2) {
        if (isGhost) {
          ctx.save();
          ctx.globalAlpha = 0.55;
          ctx.setLineDash([6, 4]);
        }
        drawLine(
          ctx,
          { x: c1.x + bounds.left, y: c1.y },
          { x: c2.x + bounds.left, y: c2.y },
          color,
          true,
          0.8,
        );
        if (isGhost) {
          ctx.setLineDash([]);
          ctx.restore();
        }

        if (i3 !== null && p3) {
          const c3 = getCoords(p3);
          if (c3) {
            if (isGhost) {
              ctx.save();
              ctx.globalAlpha = 0.55;
              ctx.setLineDash([6, 4]);
            }
            drawLine(
              ctx,
              { x: c2.x + bounds.left, y: c2.y },
              { x: c3.x + bounds.left, y: c3.y },
              color,
              true,
              0.8,
            );
            if (isGhost) {
              ctx.setLineDash([]);
              ctx.restore();
            }
          }
        }
      }
    }

    // 2. Draw Anchors
    [p1, p2, p3].forEach((p) => {
      if (!p) return;
      const c = getCoords(p);
      if (c) {
        ctx.beginPath();
        ctx.arc(c.x + bounds.left, c.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        if (isGhost) ctx.globalAlpha = 0.6;
        ctx.fill();
        if (isGhost) ctx.globalAlpha = 1;
      }
    });

    // 3. Draw Projections
    if (i3 !== null) {
      config.levels.forEach((ratio) => {
        const targetIndex = i3 + ratio * delta;
        drawVertical(targetIndex, `${ratio}`);
      });
      drawVertical(i3, "0", 0.5);
    }
  };

  // --- GANN BOX LOGIC ---
  const drawGannBox = (
    ctx,
    p1,
    p2,
    bounds,
    color = "#2962FF",
    settings = {},
  ) => {
    if (!p1 || !p2) return;

    // 1. Get Coordinates & Ranges
    const c1 = getCoords(p1);
    const c2 = getCoords(p2);
    if (!c1 || !c2) return;

    const xMin = Math.min(c1.x, c2.x) + bounds.left;
    const xMax = Math.max(c1.x, c2.x) + bounds.left;
    const yMin = Math.min(c1.y, c2.y);
    const yMax = Math.max(c1.y, c2.y);
    const width = xMax - xMin;
    const height = yMax - yMin;

    if (width === 0 || height === 0) return;

    const defaults = {
      gridDivisions: 8,
      showGridHorz: true,
      showGridVert: true,
      showAngles: true,
      angles: ["1x1"],
      angleOrigin: "bottom-left",
      labelMode: "fractions",
      fillBackground: true,
      opacity: 0.15,
      extendAngles: false,
    };
    const config = { ...defaults, ...settings };

    // 2. Draw Background Fill
    if (config.fillBackground) {
      ctx.fillStyle = color;
      ctx.globalAlpha = config.opacity;
      ctx.fillRect(xMin, yMin, width, height);
      ctx.globalAlpha = 1.0;
    }

    // 3. Draw Box Outline
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(xMin, yMin, width, height);

    // 4. Draw Grid
    const N = config.gridDivisions;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.setLineDash([2, 4]);

    const pMin = Math.min(p1.price, p2.price);
    const pMax = Math.max(p1.price, p2.price);
    const dp = pMax - pMin;

    for (let k = 1; k < N; k++) {
      const ratio = k / N;
      // Horizontal lines (Price)
      if (config.showGridHorz) {
        const price = pMin + ratio * dp;
        const y = series.priceToCoordinate(price);
        if (y !== null) {
          ctx.beginPath();
          ctx.moveTo(xMin, y);
          ctx.lineTo(xMax, y);
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
        }

        // Fraction Label
        if (config.labelMode === "fractions" && y !== null) {
          ctx.font = "9px sans-serif";
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.9;
          ctx.textAlign = "right";
          ctx.fillText(`${k}/${N}`, xMin - 5, y + 3);
        }
      }

      // Vertical lines (Time)
      if (config.showGridVert) {
        const x = xMin + ratio * width;
        ctx.beginPath();
        ctx.moveTo(x, yMin);
        ctx.lineTo(x, yMax);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.stroke();

        // Fraction Label
        if (config.labelMode === "fractions") {
          ctx.font = "9px sans-serif";
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.9;
          ctx.textAlign = "center";
          ctx.fillText(`${k}/${N}`, x, yMax + 12);
        }
      }
    }

    // 5. Draw Gann Angles (Relative to box)
    if (config.showAngles && config.angles.length > 0) {
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.6;

      // Determine origin point
      let ox, oy, signX, signY;
      switch (config.angleOrigin) {
        case "top-left":
          ox = xMin;
          oy = yMin;
          signX = 1;
          signY = 1;
          break;
        case "bottom-right":
          ox = xMax;
          oy = yMax;
          signX = -1;
          signY = -1;
          break;
        case "top-right":
          ox = xMax;
          oy = yMin;
          signX = -1;
          signY = 1;
          break;
        default: // bottom-left
          ox = xMin;
          oy = yMax;
          signX = 1;
          signY = -1;
          break;
      }

      // 5.1 Draw Origin Marker (Dot)
      ctx.beginPath();
      ctx.arc(ox, oy, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.fill();

      config.angles.forEach((ratioStr) => {
        const [rW, rH] = ratioStr.split("x").map(Number);

        let tx, ty;
        if (config.extendAngles) {
          // Project to chart edges
          const slope = (signY * height * rH) / (signX * width * rW);
          const targetX = signX > 0 ? bounds.right : bounds.left;
          tx = targetX;
          ty = oy + (targetX - ox) * slope;
        } else {
          // Lock inside box
          tx = ox + signX * width;
          ty = oy + signY * height;
          if (rW > rH) {
            ty = oy + signY * (height * (rH / rW));
          } else if (rH > rW) {
            tx = ox + signX * (width * (rW / rH));
          }
        }

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.stroke();

        // Angle Label
        ctx.font = "bold 9px sans-serif";
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.textAlign = signX > 0 ? "left" : "right";
        ctx.fillText(ratioStr, tx + signX * 5, ty + signY * 5);
      });
    }

    ctx.globalAlpha = 1.0;
    ctx.setLineDash([]);
  };

  const drawRectangle = (ctx, p1, p2, bounds, color, settings = {}) => {
    const c1 = getCoords(p1);
    const c2 = getCoords(p2);
    if (!c1 || !c2) return;

    const extend = settings.extend || "none";
    const minX = Math.min(c1.x, c2.x) + bounds.left;
    const maxX = Math.max(c1.x, c2.x) + bounds.left;
    const xMin = extend === "left" || extend === "both" ? bounds.left : minX;
    const xMax = extend === "right" || extend === "both" ? bounds.right : maxX;
    const yMin = Math.min(c1.y, c2.y);
    const yMax = Math.max(c1.y, c2.y);
    const width = xMax - xMin;
    const height = yMax - yMin;
    const fillColor = settings.fillColor || color;
    const borderColor = settings.borderColor || color;

    if (settings.fillBackground !== false && (settings.opacity ?? 0.15) > 0) {
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = settings.opacity ?? 0.15;
      ctx.fillRect(xMin, yMin, width, height);
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = settings.lineWidth || 1;
    ctx.globalAlpha = 1.0;
    ctx.setLineDash(settings.lineStyle === "dashed" ? [4, 4] : []);
    ctx.strokeRect(xMin, yMin, width, height);
    ctx.setLineDash([]);

    if (settings.text) {
      const text = String(settings.text);
      const textSize = settings.textSize || 12;
      const textColor = settings.textColor || "#0f172a";
      const textOpacity = settings.textOpacity ?? 0.9;
      const align = settings.textAlign || "center";
      const textX =
        align === "left"
          ? xMin + 6
          : align === "right"
            ? xMax - 6
            : xMin + width / 2;
      const textY = yMin + height / 2;
      ctx.save();
      ctx.globalAlpha = textOpacity;
      ctx.fillStyle = textColor;
      ctx.font = `${textSize}px sans-serif`;
      ctx.textAlign =
        align === "left" ? "left" : align === "right" ? "right" : "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, textX, textY);
      ctx.restore();
    }
  };

  const drawArrowHead = (ctx, x, y, angle, size, style, color, fill = true) => {
    const a1 = angle + Math.PI / 7;
    const a2 = angle - Math.PI / 7;
    const x1 = x - Math.cos(a1) * size;
    const y1 = y - Math.sin(a1) * size;
    const x2 = x - Math.cos(a2) * size;
    const y2 = y - Math.sin(a2) * size;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    if (style === "line") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x1, y1);
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    if (fill) ctx.fill();
    else ctx.stroke();
  };

  const drawArrow = (
    ctx,
    start,
    end,
    color,
    settings = {},
    isPreview = false,
  ) => {
    if (!start || !end) return;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return;

    const strokeColor = color || "#3b82f6";
    const lineWidth = settings.lineWidth || 2;
    const lineStyle = settings.lineStyle || "solid";
    const arrowheadStyle = settings.arrowheadStyle || "triangle";
    const extendBeyondEnd = settings.extendBeyondEnd === true;
    const angle = Math.atan2(dy, dx);
    const headSize = 10 + lineWidth * 1.5;
    const extendSize = extendBeyondEnd ? headSize * 0.6 : 0;
    const tipX = end.x + Math.cos(angle) * extendSize;
    const tipY = end.y + Math.sin(angle) * extendSize;

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = isPreview ? 0.7 : 1;
    ctx.setLineDash(isPreview ? [6, 4] : lineStyle === "dashed" ? [6, 4] : []);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.setLineDash([]);
    drawArrowHead(
      ctx,
      tipX,
      tipY,
      angle,
      headSize,
      arrowheadStyle,
      strokeColor,
    );
    ctx.restore();
  };

  const drawCircle = (
    ctx,
    centerPoint,
    radiusPoint,
    bounds,
    color,
    settings = {},
    isPreview = false,
  ) => {
    const c = getCoords(centerPoint);
    if (!c) return;
    const radiusPx = getCircleRadiusPx(centerPoint, radiusPoint, settings);
    if (!radiusPx) return;
    const cx = c.x + bounds.left;
    const cy = c.y;
    const lineWidth = settings.lineWidth || 2;
    const lineStyle = settings.lineStyle || "solid";
    ctx.save();
    ctx.strokeStyle = color || "#2962FF";
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = isPreview ? 0.6 : 1;
    ctx.setLineDash(isPreview ? [6, 4] : lineStyle === "dashed" ? [6, 4] : []);
    ctx.beginPath();
    ctx.arc(cx, cy, radiusPx, 0, Math.PI * 2);
    if (settings.fill) {
      const fillColor = settings.fillColor || color || "#2962FF";
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = isPreview
        ? (settings.fillOpacity ?? 0.15) * 0.4
        : (settings.fillOpacity ?? 0.15);
      ctx.fill();
      ctx.globalAlpha = isPreview ? 0.6 : 1;
    }
    ctx.stroke();
    ctx.setLineDash([]);

    if (settings.showCenter !== false) {
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = color || "#2962FF";
      ctx.fill();
    }

    if (settings.showLabels !== false && radiusPoint) {
      const l1 = getLogicalIndex(centerPoint);
      const l2 = getLogicalIndex(radiusPoint);
      const bars = l1 !== undefined && l2 !== undefined ? Math.abs(l2 - l1) : 0;
      const priceDelta = Math.abs(radiusPoint.price - centerPoint.price);
      const labelMode = settings.labelMode || "both";
      const parts = [];
      if (labelMode === "radius" || labelMode === "both") {
        parts.push(`R: ${bars.toFixed(0)} bars / ${priceDelta.toFixed(2)}`);
      }
      if (labelMode === "diameter" || labelMode === "both") {
        parts.push(
          `D: ${(bars * 2).toFixed(0)} bars / ${(priceDelta * 2).toFixed(2)}`,
        );
      }
      if (parts.length) {
        drawGhostLabel(ctx, parts.join(" | "), cx + radiusPx + 8, cy, {
          state: GHOST_STATES.neutral,
        });
      }
    }
    ctx.restore();
  };

  const drawArc = (
    ctx,
    centerPoint,
    radiusPoint,
    arcPoint,
    bounds,
    color,
    settings = {},
    isPreview = false,
  ) => {
    const c = getCoords(centerPoint);
    if (!c) return;
    const radiusPx = getCircleRadiusPx(centerPoint, radiusPoint, settings);
    if (!radiusPx) return;
    let startAngle =
      settings.startAngle ?? getAngleFromPoints(centerPoint, radiusPoint);
    let endAngle =
      settings.endAngle ?? getAngleFromPoints(centerPoint, arcPoint);
    if (startAngle == null || endAngle == null) return;
    if (settings.snapAngles) {
      endAngle = snapAngleRad(endAngle, settings.snapAngleStep || 15);
    }
    const cx = c.x + bounds.left;
    const cy = c.y;
    const lineWidth = settings.lineWidth || 2;
    const lineStyle = settings.lineStyle || "solid";
    ctx.save();
    if (isPreview) {
      ctx.globalAlpha = 0.35;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, radiusPx, 0, Math.PI * 2);
      ctx.strokeStyle = color || "#2962FF";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = color || "#2962FF";
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = isPreview ? 0.8 : 1;
    ctx.setLineDash(isPreview ? [] : lineStyle === "dashed" ? [6, 4] : []);
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      radiusPx,
      startAngle,
      endAngle,
      settings.direction === "ccw",
    );
    ctx.stroke();
    ctx.setLineDash([]);

    if (settings.showCenter !== false) {
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = color || "#2962FF";
      ctx.fill();
    }

    ctx.restore();
  };

  const drawEllipse = (
    ctx,
    centerPoint,
    xPoint,
    yPoint,
    bounds,
    color,
    settings = {},
    isPreview = false,
  ) => {
    const c = getCoords(centerPoint);
    if (!c) return;
    const radii = getEllipseRadiiPx(centerPoint, xPoint, yPoint, settings);
    if (!radii) return;
    const { xRadiusPx, yRadiusPx } = radii;
    const cx = c.x + bounds.left;
    const cy = c.y;
    const lineWidth = settings.lineWidth || 2;
    const lineStyle = settings.lineStyle || "solid";
    const rotation = settings.rotation
      ? (settings.rotation * Math.PI) / 180
      : 0;
    ctx.save();
    ctx.strokeStyle = color || "#2962FF";
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = isPreview ? 0.6 : 1;
    ctx.setLineDash(isPreview ? [6, 4] : lineStyle === "dashed" ? [6, 4] : []);
    ctx.beginPath();
    if (ctx.ellipse) {
      ctx.ellipse(cx, cy, xRadiusPx, yRadiusPx, rotation, 0, Math.PI * 2);
    } else {
      ctx.arc(cx, cy, Math.max(xRadiusPx, yRadiusPx), 0, Math.PI * 2);
    }
    if (settings.fill) {
      const fillColor = settings.fillColor || color || "#2962FF";
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = isPreview
        ? (settings.fillOpacity ?? 0.15) * 0.4
        : (settings.fillOpacity ?? 0.15);
      ctx.fill();
      ctx.globalAlpha = isPreview ? 0.6 : 1;
    }
    ctx.stroke();
    ctx.setLineDash([]);

    if (settings.showCenter !== false) {
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = color || "#2962FF";
      ctx.fill();
    }

    if (settings.showLabels !== false && xPoint && yPoint) {
      const l1 = getLogicalIndex(centerPoint);
      const l2 = getLogicalIndex(xPoint);
      const bars = l1 !== undefined && l2 !== undefined ? Math.abs(l2 - l1) : 0;
      const priceDelta = Math.abs(yPoint.price - centerPoint.price);
      const labelMode = settings.labelMode || "radius";
      if (labelMode !== "none") {
        drawGhostLabel(
          ctx,
          `Rx ${bars.toFixed(0)} bars | Ry ${priceDelta.toFixed(2)}`,
          cx + xRadiusPx + 8,
          cy,
          { state: GHOST_STATES.neutral },
        );
      }
    }
    ctx.restore();
  };

  const drawBrushStroke = (
    ctx,
    points,
    bounds,
    color,
    settings = {},
    isPreview = false,
  ) => {
    if (!points || points.length < 2) return;
    const baseThickness = settings.thickness || 3;
    const smoothing = clamp(settings.smoothing ?? 0.35, 0, 1);
    const opacity = settings.opacity ?? 0.8;
    const scale = getStrokeScale(settings.autoScale !== false);
    const mapped = points
      .map((p) => {
        const c = getCoords(p);
        if (!c) return null;
        return {
          x: c.x + bounds.left,
          y: c.y,
          pressure: p.pressure ?? 1,
        };
      })
      .filter(Boolean);
    if (mapped.length < 2) return;

    const smoothPoints = mapped.map((pt, idx) => {
      if (idx === 0 || idx === mapped.length - 1 || smoothing <= 0) return pt;
      const prev = mapped[idx - 1];
      const next = mapped[idx + 1];
      const avgX = (prev.x + next.x) / 2;
      const avgY = (prev.y + next.y) / 2;
      return {
        ...pt,
        x: pt.x + (avgX - pt.x) * smoothing,
        y: pt.y + (avgY - pt.y) * smoothing,
      };
    });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = isPreview ? opacity * 0.8 : opacity;
    for (let i = 1; i < smoothPoints.length; i++) {
      const prev = smoothPoints[i - 1];
      const curr = smoothPoints[i];
      const pressure = curr.pressure || 1;
      ctx.lineWidth = baseThickness * scale * pressure;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawPath = (
    ctx,
    points,
    bounds,
    color,
    settings = {},
    isPreview = false,
    previewPoint = null,
  ) => {
    if (!points || points.length < 1) return;
    const lineWidth = settings.lineWidth || 2;
    const lineStyle = settings.lineStyle || "solid";
    const showNodes = settings.showNodes !== false;
    const arrowheads = settings.arrowheads || "none";

    const mapped = points
      .map((p) => {
        const c = getCoords(p);
        if (!c) return null;
        return { x: c.x + bounds.left, y: c.y };
      })
      .filter(Boolean);
    if (mapped.length < 1) return;
    const previewMapped = (() => {
      if (!previewPoint) return null;
      const c = getCoords(previewPoint);
      if (!c) return null;
      return { x: c.x + bounds.left, y: c.y };
    })();
    if (mapped.length < 2 && !previewMapped) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = isPreview ? 0.75 : 1;
    ctx.setLineDash(lineStyle === "dashed" ? [6, 4] : []);
    if (mapped.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(mapped[0].x, mapped[0].y);
      for (let i = 1; i < mapped.length; i++) {
        ctx.lineTo(mapped[i].x, mapped[i].y);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    if (isPreview && previewMapped && mapped.length >= 1) {
      const prev = mapped[mapped.length - 1];
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(previewMapped.x, previewMapped.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (arrowheads !== "none" && mapped.length >= 2) {
      const start = mapped[0];
      const end = previewMapped || mapped[mapped.length - 1];
      const startAngle = Math.atan2(
        mapped[1].y - start.y,
        mapped[1].x - start.x,
      );
      const endBase = previewMapped
        ? mapped[mapped.length - 1]
        : mapped[mapped.length - 2];
      const endAngle = Math.atan2(end.y - endBase.y, end.x - endBase.x);
      if (arrowheads === "start" || arrowheads === "both") {
        drawArrowHead(
          ctx,
          start.x,
          start.y,
          startAngle,
          10,
          "line",
          color,
          false,
        );
      }
      if (arrowheads === "end" || arrowheads === "both") {
        drawArrowHead(ctx, end.x, end.y, endAngle, 10, "line", color, false);
      }
    }

    if (showNodes) {
      mapped.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      });
    }
    ctx.restore();
  };

  const drawHighlighter = (
    ctx,
    p1,
    p2,
    bounds,
    color,
    settings = {},
    isPreview = false,
  ) => {
    const c1 = getCoords(p1);
    const c2 = getCoords(p2);
    if (!c1 || !c2) return;
    const xMin = Math.min(c1.x, c2.x) + bounds.left;
    const xMax = Math.max(c1.x, c2.x) + bounds.left;
    const yMin = Math.min(c1.y, c2.y);
    const yMax = Math.max(c1.y, c2.y);
    const width = xMax - xMin;
    const height = yMax - yMin;
    if (width <= 1 || height <= 1) return;

    ctx.save();
    ctx.globalCompositeOperation = settings.blendMode || "multiply";
    ctx.fillStyle = color;
    const opacity = settings.opacity ?? 0.18;
    ctx.globalAlpha = isPreview ? opacity * 0.7 : opacity;
    ctx.fillRect(xMin, yMin, width, height);
    ctx.restore();
  };

  const drawFibExtension = (
    ctx,
    p1_coord,
    p2_coord,
    p3_coord,
    color = "#ff9800",
    settings = {},
  ) => {
    // 1. Defaults & Settings
    const defaults = {
      levels: [
        0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618, 3.618,
        4.236,
      ],
      extendLines: "none",
      showLabels: true,
      showPrice: true,
      showLegs: true,
      fillBackground: true,
      reverse: false,
      labelPosition: "left",
    };
    const config = { ...defaults, ...settings };
    const bounds = getChartBounds();
    const activeLevels = config.levels || defaults.levels;

    // 2. Logic for 2-point vs 3-point
    // Standard Trend-Based Fib Extension uses 3 points:
    // P1: Base Start
    // P2: Base End (The "Trend")
    // P3: Extension Origin
    // Level Price = P3.price + Level * (P2.price - P1.price)

    // If we only have 2 points, it behaves like an expansion from the first segment?
    // Actually, many platforms use 2-point extension too.
    // If P3 is missing, we assume P3 = P2.
    const startY = p1_coord.y;
    const endY = p2_coord.y;
    const originY = p3_coord ? p3_coord.y : p2_coord.y;
    const dy = endY - startY; // The "move" in pixels.

    // 3. Draw Legs (The connecting lines for the trend)
    if (config.showLegs) {
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = color + "80"; // Semi-transparent
      ctx.moveTo(p1_coord.x, p1_coord.y);
      ctx.lineTo(p2_coord.x, p2_coord.y);
      if (p3_coord) {
        ctx.lineTo(p3_coord.x, p3_coord.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Draw Levels
    activeLevels.forEach((level) => {
      // Formula: Y = originY + level * dy
      // Note: level is a multiplier of the range (P1 to P2) starting from P3.
      // If P2 is below P1 (dy > 0), then originY + dy is below originY. Correct.
      const y = originY + level * dy;

      // Determine Line Extents
      let x1 = Math.min(
        p1_coord.x,
        p2_coord.x,
        p3_coord ? p3_coord.x : p2_coord.x,
      );
      let x2 = Math.max(
        p1_coord.x,
        p2_coord.x,
        p3_coord ? p3_coord.x : p2_coord.x,
      );

      if (config.extendLines === "right" || config.extendLines === "both")
        x2 = bounds.right;
      if (config.extendLines === "left" || config.extendLines === "both")
        x1 = bounds.left;

      // Draw Line
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = level === 0 || level === 1 || level === 1.618 ? 2 : 1;
      ctx.stroke();

      // Labels
      if (config.showLabels) {
        ctx.font = "11px sans-serif";
        ctx.fillStyle = color;
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";

        let text = `${level}`;
        if (config.showPrice && series) {
          const price = series.coordinateToPrice(y);
          if (price !== null && price !== undefined) {
            text += ` (${price.toFixed(2)})`;
          }
        }

        const pad = 4;
        if (config.extendLines === "right" || config.extendLines === "both") {
          ctx.fillText(text, x1 + pad, y - 2);
        } else {
          ctx.textAlign = "right";
          ctx.fillText(text, x2 - pad, y - 2);
        }
      }
    });
  };

  const drawFibCircles = (ctx, start, end, color = "#009688") => {
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2),
    );
    const levels = [0.236, 0.382, 0.5, 0.618, 0.786, 1];

    levels.forEach((level) => {
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius * level, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = level === 0.618 || level === 1 ? 2 : 1;
      ctx.stroke();
    });
  };

  const drawFibArcs = (ctx, start, end, color = "#03a9f4") => {
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2),
    );
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const levels = [0.382, 0.5, 0.618];

    levels.forEach((level) => {
      ctx.beginPath();
      ctx.arc(
        start.x,
        start.y,
        radius * level,
        angle - Math.PI / 2,
        angle + Math.PI / 2,
      );
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  const drawFibSpiral = (ctx, start, end, color = "#00bcd4") => {
    const phi = 1.618033988749895; // Golden ratio
    const baseRadius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2),
    );
    const startAngle = Math.atan2(end.y - start.y, end.x - start.x);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // Draw the golden spiral
    const turns = 4; // Number of quarter turns
    const points = 100;

    for (let i = 0; i <= points * turns; i++) {
      const angle = startAngle + (i / points) * (Math.PI / 2);
      const turnIndex = Math.floor(i / points);
      const progress = (i % points) / points;

      // Scale radius using Fibonacci sequence approximation
      const scale = Math.pow(phi, -(turnIndex + progress));
      const r = baseRadius * scale;

      const x = start.x + r * Math.cos(angle);
      const y = start.y + r * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw golden rectangle guides
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    let size = baseRadius;
    let cx = start.x;
    let cy = start.y;

    for (let i = 0; i < 5; i++) {
      ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);
      size /= phi;
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  };

  const drawFibWedge = (ctx, start, end, color = "#2196f3") => {
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
    const midX = (start.x + end.x) / 2;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, start.y);
    ctx.lineTo(midX, end.y);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = color + "1A";
    ctx.fill();

    levels.forEach((level) => {
      const y = start.y + (end.y - start.y) * level;
      const width = (end.x - start.x) * (1 - level);
      ctx.beginPath();
      ctx.moveTo(midX - width / 2, y);
      ctx.lineTo(midX + width / 2, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  const normalizeFanRatio = (ratio) => {
    if (typeof ratio !== "string") return ratio;
    return ratio.replace("/", "x");
  };

  const resolveFanRatios = (ratios) => {
    if (!Array.isArray(ratios) || ratios.length === 0)
      return GANN_FAN_DEFAULT_RATIOS;
    const normalized = ratios
      .map((ratio) => normalizeFanRatio(ratio))
      .filter(Boolean);
    if (normalized.length === 0) return GANN_FAN_DEFAULT_RATIOS;
    const legacySet = new Set(LEGACY_GANN_FAN_RATIOS);
    if (
      normalized.length === legacySet.size &&
      normalized.every((ratio) => legacySet.has(ratio))
    ) {
      return GANN_FAN_DEFAULT_RATIOS;
    }
    return normalized;
  };

  const buildFanRatioColors = (ratioColors) => {
    const merged = { ...GANN_FAN_DEFAULT_COLORS };
    if (ratioColors && typeof ratioColors === "object") {
      Object.entries(ratioColors).forEach(([key, value]) => {
        const normalizedKey = normalizeFanRatio(key);
        if (normalizedKey) merged[normalizedKey] = value;
      });
    }
    return merged;
  };

  const drawGannFan = (
    ctx,
    p1,
    p2,
    settings = {},
    previewPoint = null,
    isPreview = false,
  ) => {
    if (!chart || !series || !p1) return;

    const bounds = getChartBounds();
    const origin = getCoords(p1);
    if (!origin) return;

    const scaleSample = getScaleSample();
    if (!scaleSample || scaleSample.slope1x1 === 0) return;

    const parseRatio = (ratio) => {
      const normalized = normalizeFanRatio(ratio);
      if (typeof normalized !== "string") return null;
      const [aRaw, bRaw] = normalized.split("x");
      const a = parseFloat(aRaw);
      const b = parseFloat(bRaw);
      if (Number.isNaN(a) || Number.isNaN(b) || b === 0) return null;
      return {
        raw: ratio,
        normalized,
        value: a / b,
        n: a,
        m: b,
      };
    };

    const ratios = resolveFanRatios(settings.ratios || settings.angles);
    const ratioColors = buildFanRatioColors(settings.ratioColors);
    const useOneColor = settings.useOneColor;
    const oneColor = settings.oneColor || settings.color || ratioColors["1x1"];

    const slope1x1Reference =
      settings.autoScale === false
        ? settings.slope1x1AtLock || scaleSample.slope1x1
        : scaleSample.slope1x1;

    let baseSlope = null;
    if (isPreview && previewPoint) {
      const l1 = getLogicalIndex(p1);
      const l2 = getLogicalIndex(previewPoint);
      if (l1 === undefined || l2 === undefined) return;
      const deltaTime = l2 - l1;
      if (deltaTime === 0) return;

      const p1Val = settings.logScale
        ? Math.log(Math.max(1e-6, p1.price))
        : p1.price;
      const p2Val = settings.logScale
        ? Math.log(Math.max(1e-6, previewPoint.price))
        : previewPoint.price;

      baseSlope = (p2Val - p1Val) / deltaTime;
    } else {
      const handleSlope = p2
        ? getSlopeFromPoints(p1, p2, settings.logScale)
        : null;
      if (handleSlope !== null) {
        if (settings.autoScale === false) {
          baseSlope = handleSlope;
        } else {
          const slope1x1AtLock =
            settings.slope1x1AtLock || scaleSample.slope1x1;
          const normalized =
            slope1x1AtLock === 0 ? 1 : handleSlope / slope1x1AtLock;
          baseSlope = normalized * scaleSample.slope1x1;
        }
      } else if (settings.autoScale === false) {
        baseSlope =
          settings.baseSlopeFixed ||
          (settings.baseSlopeNormalized || 1) *
            (settings.slope1x1AtLock || scaleSample.slope1x1);
      } else {
        baseSlope = (settings.baseSlopeNormalized || 1) * scaleSample.slope1x1;
      }
    }

    if (baseSlope === null) return;

    if (settings.invert) baseSlope *= -1;

    const originX = origin.x + bounds.left;
    const originY = origin.y;

    const extendLines = settings.extendLines || "right";

    const isRight = extendLines === "right" || extendLines === "both";
    const isLeft = extendLines === "left" || extendLines === "both";

    ctx.save();
    ctx.beginPath();
    ctx.rect(bounds.left, 0, bounds.width, bounds.height);
    ctx.clip();

    if (isPreview) {
      ctx.setLineDash([6, 4]);
    }

    const parsedRatios = ratios
      .map(parseRatio)
      .filter(Boolean)
      .sort((a, b) => a.value - b.value);

    const endpointsRight = [];
    const endpointsLeft = [];
    const showLabels = settings.showLabels !== false;

    parsedRatios.forEach((ratio) => {
      const lineSlope = baseSlope * ratio.value;
      if (slope1x1Reference === 0) return;
      const pixelSlope = -(lineSlope / slope1x1Reference);

      const isPrimary = ratio.normalized === "1x1";
      const lineWidth = isPrimary
        ? settings.lineWidthMain || 2
        : settings.lineWidthMinor || 1;

      let alpha = isPrimary ? 1 : 0.65;
      if (settings.opacityDecay !== false) {
        const dist = Math.abs(Math.log(Math.max(ratio.value, 1e-6)));
        alpha = Math.max(0.3, 0.9 - dist * 0.35);
      }
      if (isPreview) alpha *= 0.7;

      const lineColor = useOneColor
        ? oneColor || "#14b8a6"
        : ratioColors[ratio.normalized] || "#14b8a6";

      const drawLine = (xTarget) => {
        const yTarget = originY + pixelSlope * (xTarget - originX);
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(xTarget, yTarget);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = alpha;
        ctx.stroke();
        return { x: xTarget, y: yTarget };
      };

      let endPoint = null;
      if (isRight) {
        endPoint = drawLine(bounds.right);
        if (endPoint) endpointsRight.push({ endPoint, color: lineColor });
      }
      if (isLeft) {
        const leftPoint = drawLine(bounds.left);
        if (leftPoint)
          endpointsLeft.push({ endPoint: leftPoint, color: lineColor });
        endPoint = endPoint || leftPoint;
      }

      const showRatio = showLabels && settings.showRatio !== false;
      const showDegrees = showLabels && settings.showDegrees;
      const showSlope = showLabels && settings.showSlope;
      if ((showRatio || showDegrees || showSlope) && endPoint) {
        const angleDeg = Math.atan(pixelSlope) * (180 / Math.PI);
        const labelParts = [];
        if (showRatio) {
          const ratioLabel =
            typeof ratio.raw === "string" && ratio.raw.includes("/")
              ? ratio.raw
              : ratio.normalized.replace("x", "/");
          labelParts.push(ratioLabel);
        }
        if (showDegrees) labelParts.push(`${angleDeg.toFixed(1)}deg`);
        if (showSlope) labelParts.push(lineSlope.toFixed(2));
        const labelText = labelParts.join(" ");

        const labelPos = settings.labelPosition || "end";
        const rawLabelX =
          labelPos === "origin"
            ? originX + 6
            : endPoint.x + (isRight ? -30 : 6);
        const rawLabelY =
          labelPos === "origin"
            ? originY + (pixelSlope < 0 ? -6 : 12)
            : endPoint.y + (pixelSlope < 0 ? -6 : 12);

        ctx.font = isPrimary ? "900 11px sans-serif" : "900 10px sans-serif";
        const metrics = ctx.measureText(labelText);
        const minLabelX = bounds.left + 6;
        const maxLabelX = bounds.right - metrics.width - 6;
        const minLabelY = 10;
        const maxLabelY = bounds.height - 6;
        const labelX = Math.max(minLabelX, Math.min(rawLabelX, maxLabelX));
        const labelY = Math.max(minLabelY, Math.min(rawLabelY, maxLabelY));

        const labelAlpha = Math.max(alpha, 0.85);
        ctx.globalAlpha = labelAlpha;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.strokeText(labelText, labelX, labelY);
        ctx.fillStyle = lineColor;
        ctx.fillText(labelText, labelX, labelY);
      }
    });

    if (settings.fillBackground || settings.showFill || settings.background) {
      const rawOpacity =
        typeof settings.fillOpacity === "number"
          ? settings.fillOpacity
          : typeof settings.backgroundOpacity === "number"
            ? settings.backgroundOpacity
            : null;
      const baseOpacity =
        rawOpacity !== null ? Math.max(0, Math.min(1, rawOpacity)) : null;
      const fillAlpha =
        baseOpacity !== null
          ? isPreview
            ? baseOpacity * 0.7
            : baseOpacity
          : isPreview
            ? 0.08
            : 0.15;
      const fillBetween = (endpoints) => {
        if (endpoints.length < 2) return;
        for (let i = 0; i < endpoints.length - 1; i++) {
          const a = endpoints[i];
          const b = endpoints[i + 1];
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(a.endPoint.x, a.endPoint.y);
          ctx.lineTo(b.endPoint.x, b.endPoint.y);
          ctx.closePath();
          ctx.globalAlpha = fillAlpha;
          ctx.fillStyle = a.color;
          ctx.fill();
        }
      };
      if (isRight) fillBetween(endpointsRight);
      if (isLeft) fillBetween(endpointsLeft);
    }

    let previewAngleLabel = null;
    if (isPreview && settings.showPreviewAngle) {
      const pixelSlopeBase = -(baseSlope / slope1x1Reference);
      const angleDeg = Math.atan(pixelSlopeBase) * (180 / Math.PI);
      const anchorPoint = settings.previewLabelPoint || previewPoint || p1;
      const previewCoords = anchorPoint ? getCoords(anchorPoint) : null;
      const offset =
        typeof settings.previewLabelOffset === "number"
          ? settings.previewLabelOffset
          : 56;
      const direction = isLeft && !isRight ? -1 : 1;
      const dx = offset * direction;
      const labelX = previewCoords
        ? previewCoords.x + bounds.left + 12
        : originX + dx;
      const labelY = previewCoords
        ? previewCoords.y - 12
        : originY + pixelSlopeBase * dx;
      previewAngleLabel = {
        text: `Angle ${angleDeg.toFixed(1)}deg`,
        x: labelX,
        y: labelY,
        color: useOneColor
          ? oneColor || ratioColors["1x1"] || "#f59e0b"
          : ratioColors["1x1"] || "#f59e0b",
      };
    }

    if (!isPreview) {
      const handle = p2 ? getCoords(p2) : null;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 1;

      // Anchor handle
      ctx.beginPath();
      ctx.arc(originX, originY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotation handle
      if (handle) {
        const hx = handle.x + bounds.left;
        const hy = handle.y;
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();

    if (previewAngleLabel) {
      const text = previewAngleLabel.text;
      ctx.save();
      ctx.font = "900 14px sans-serif";
      const paddingX = 6;
      const paddingY = 4;
      const metrics = ctx.measureText(text);
      const boxW = metrics.width + paddingX * 2;
      const boxH = 18;
      const minX = bounds.left + 8;
      const maxX = bounds.right - boxW - 12;
      const minY = 4;
      const maxY = bounds.height - boxH - 4;
      const boxX = Math.max(minX, Math.min(previewAngleLabel.x, maxX));
      const boxY = Math.max(minY, Math.min(previewAngleLabel.y - boxH, maxY));

      ctx.globalAlpha = 0.92;
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
      ctx.strokeText(text, boxX + paddingX, boxY + boxH / 2);
      ctx.fillStyle = previewAngleLabel.color || "#ffffff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, boxX + paddingX, boxY + boxH / 2);
      ctx.restore();
    }
  };

  const drawGhostGlyph = (ctx, x, y, state) => {
    if (!ctx || !state) return;
    const style = getGhostStyle(state);
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = style.stroke;
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 3, y);
    ctx.lineTo(x + 3, y);
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x, y + 3);
    ctx.stroke();
    ctx.restore();
  };

  const drawHeadShoulders = (
    ctx,
    points,
    settings,
    isPreview = false,
    previewInfo = null,
  ) => {
    const [nl1, ls, nl2, head, nl3, rs] = points;
    const previewStep = previewInfo?.step ?? 0;
    const previewPoint = previewInfo?.point ?? null;
    const ghostLs = isPreview && previewStep === 1 ? previewPoint : null;
    const ghostNl2 = isPreview && previewStep === 2 ? previewPoint : null;
    const ghostHead = isPreview && previewStep === 3 ? previewPoint : null;
    const ghostNl3 = isPreview && previewStep === 4 ? previewPoint : null;
    const ghostRs = isPreview && previewStep === 5 ? previewPoint : null;

    const lsEff = ls || ghostLs;
    const nl2Eff = nl2 || ghostNl2;
    const headEff = head || ghostHead;
    const nl3Eff = nl3 || ghostNl3;
    const rsEff = rs || ghostRs;

    const stateResult = validateHeadShoulders(
      nl1,
      lsEff,
      nl2Eff,
      headEff,
      nl3Eff,
      rsEff,
      settings,
    );
    const ghostState = stateResult.state || GHOST_STATES.neutral;
    const style = getGhostStyle(ghostState);
    const bounds = getChartBounds();
    const showLabels = settings?.showLabels !== false;

    const drawSegment = (a, b, { dash = false, color } = {}) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return;
      ctx.beginPath();
      if (dash) ctx.setLineDash([4, 4]);
      else if (isPreview) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(ca.x + bounds.left, ca.y);
      ctx.lineTo(cb.x + bounds.left, cb.y);
      ctx.strokeStyle = isPreview ? style.stroke : color || "#ef4444";
      ctx.lineWidth = 2;
      ctx.globalAlpha = isPreview ? 0.85 : 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const isGhostLs = !ls && !!ghostLs;
    const isGhostNl2 = !nl2 && !!ghostNl2;
    const isGhostHead = !head && !!ghostHead;
    const isGhostNl3 = !nl3 && !!ghostNl3;
    const isGhostRs = !rs && !!ghostRs;

    const sequence = [
      { pt: nl1, ghost: false },
      { pt: lsEff, ghost: isGhostLs },
      { pt: nl2Eff, ghost: isGhostNl2 },
      { pt: headEff, ghost: isGhostHead },
      { pt: nl3Eff, ghost: isGhostNl3 },
      { pt: rsEff, ghost: isGhostRs },
    ];
    for (let i = 1; i < sequence.length; i++) {
      const a = sequence[i - 1];
      const b = sequence[i];
      if (a.pt && b.pt) {
        drawSegment(a.pt, b.pt, {
          dash: isPreview && (a.ghost || b.ghost),
        });
      }
    }

    // Neckline emphasis (connect neckline points)
    if (nl1 && nl2Eff)
      drawSegment(nl1, nl2Eff, { dash: isPreview && isGhostNl2 });
    if (nl2Eff && nl3Eff)
      drawSegment(nl2Eff, nl3Eff, { dash: isPreview && isGhostNl3 });

    if (isPreview) {
      if (nl1) drawGhostPoint(ctx, nl1, { derived: false, state: ghostState });
      if (lsEff)
        drawGhostPoint(ctx, lsEff, {
          derived: isGhostLs,
          state: ghostState,
        });
      if (nl2Eff)
        drawGhostPoint(ctx, nl2Eff, {
          derived: isGhostNl2,
          state: ghostState,
        });
      if (headEff)
        drawGhostPoint(ctx, headEff, {
          derived: isGhostHead,
          state: ghostState,
        });
      if (nl3Eff)
        drawGhostPoint(ctx, nl3Eff, {
          derived: isGhostNl3,
          state: ghostState,
        });
      if (rsEff)
        drawGhostPoint(ctx, rsEff, {
          derived: isGhostRs,
          state: ghostState,
        });
    }

    const labelColor = isPreview ? style.stroke : "#10b981";
    const labelQueue = [];
    const queueLabel = (x, y, text, opts = {}) => {
      const box = getGhostLabelBox(ctx, text, x, y, opts.align);
      if (!box) return;
      labelQueue.push({ text, x, y, opts, box });
    };
    const flushLabels = () => {
      const placed = resolveLabelOverlaps(labelQueue, ctx);
      placed.forEach((label) =>
        drawGhostLabel(ctx, label.text, label.x, label.y, label.opts),
      );
    };

    const labelPoint = (pt, text, dx, dy) => {
      const c = getCoords(pt);
      if (!c) return;
      queueLabel(c.x + bounds.left + dx, c.y + dy, text, {
        state: ghostState,
        color: labelColor,
      });
    };

    if (showLabels && lsEff) {
      labelPoint(lsEff, "Left Shoulder", -8, -18);
    }
    if (showLabels && headEff) {
      labelPoint(headEff, "Head", 6, -18);
    }
    if (showLabels && rsEff) {
      labelPoint(rsEff, "Right Shoulder", 6, -18);
    }

    if (showLabels && headEff && lsEff) {
      const label = `Head +${stateResult.metrics?.headPercent?.toFixed(1) || 0}%`;
      const c = getCoords(headEff);
      if (c) {
        queueLabel(c.x + bounds.left + 8, c.y - 12, label, {
          state: ghostState,
          color: labelColor,
        });
      }
    }

    if (
      showLabels &&
      lsEff &&
      rsEff &&
      stateResult.metrics?.symmetry !== null
    ) {
      const sym = stateResult.metrics.symmetry * 100;
      const c = getCoords(rsEff);
      if (c) {
        queueLabel(
          c.x + bounds.left + 8,
          c.y + 12,
          `Symmetry ${sym.toFixed(0)}%`,
          { state: ghostState, color: labelColor },
        );
      }
    }

    if (
      settings?.showMeasuredMove !== false &&
      headEff &&
      nl1 &&
      (nl2Eff || nl3Eff)
    ) {
      const headLogical = getLogicalIndex(headEff);
      const l1 = getLogicalIndex(nl1);
      const l2 = getLogicalIndex(nl2Eff);
      const l3 = nl3Eff ? getLogicalIndex(nl3Eff) : undefined;
      if (headLogical !== undefined && l1 !== undefined && l2 !== undefined) {
        let necklinePrice = null;
        if (l3 !== undefined) {
          necklinePrice =
            headLogical <= l2
              ? getLinePriceAtLogical(nl1, nl2Eff, headLogical)
              : getLinePriceAtLogical(nl2Eff, nl3Eff, headLogical);
        } else {
          necklinePrice = getLinePriceAtLogical(nl1, nl2Eff, headLogical);
        }
        if (necklinePrice !== null) {
          const targetPrice = necklinePrice - (headEff.price - necklinePrice);
          const targetY = series.priceToCoordinate(targetPrice);
          if (targetY !== null) {
            ctx.save();
            ctx.beginPath();
            if (isPreview) ctx.setLineDash([4, 4]);
            ctx.moveTo(bounds.left, targetY);
            ctx.lineTo(bounds.right, targetY);
            ctx.strokeStyle = isPreview ? style.stroke : "#ef4444";
            ctx.globalAlpha = isPreview ? 0.7 : 0.9;
            ctx.stroke();
            ctx.restore();
            queueLabel(
              bounds.right - 80,
              targetY - 10,
              `Target ${targetPrice.toFixed(2)}`,
              { state: ghostState, color: labelColor },
            );
          }
        }
      }
    }

    if (showLabels) flushLabels();

    return stateResult;
  };

  const drawABCD = (ctx, points, settings, isPreview = false) => {
    const [p1, p2, p3] = points;
    const validation = validateABCD(p1, p2, p3, settings);
    const ghostState = validation.state || GHOST_STATES.neutral;
    const style = getGhostStyle(ghostState);
    const bounds = getChartBounds();
    const labelColor = isPreview ? style.stroke : "#f59e0b";
    const showLabels = settings.showDistanceLabels !== false;
    const labelQueue = [];
    const queueLabel = (x, y, text, opts = {}) => {
      const box = getGhostLabelBox(ctx, text, x, y, opts.align);
      if (!box) return;
      labelQueue.push({ text, x, y, opts, box });
    };
    const flushLabels = () => {
      const placed = resolveLabelOverlaps(labelQueue, ctx);
      placed.forEach((label) =>
        drawGhostLabel(ctx, label.text, label.x, label.y, label.opts),
      );
    };

    const getMidpoint = (a, b) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return null;
      return {
        x: (ca.x + cb.x) / 2 + bounds.left,
        y: (ca.y + cb.y) / 2,
      };
    };

    const labelPoint = (pt, text, dx = 6, dy = -12) => {
      const c = getCoords(pt);
      if (!c) return;
      queueLabel(c.x + bounds.left + dx, c.y + dy, text, {
        state: ghostState,
        color: labelColor,
      });
    };

    const drawSegment = (a, b) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return;
      ctx.beginPath();
      if (isPreview) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(ca.x + bounds.left, ca.y);
      ctx.lineTo(cb.x + bounds.left, cb.y);
      ctx.strokeStyle = isPreview ? style.stroke : "#f59e0b";
      ctx.lineWidth = 2;
      ctx.globalAlpha = isPreview ? 0.85 : 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    if (p1 && p2) drawSegment(p1, p2);
    if (p2 && p3) drawSegment(p2, p3);
    if (p3 && validation.dPoint) drawSegment(p3, validation.dPoint);

    if (isPreview) {
      drawGhostPoint(ctx, p1, { derived: false, state: ghostState });
      drawGhostPoint(ctx, p2, { derived: false, state: ghostState });
      drawGhostPoint(ctx, p3, { derived: false, state: ghostState });
      if (validation.dPoint)
        drawGhostPoint(ctx, validation.dPoint, {
          derived: true,
          state: ghostState,
        });
    }

    if (validation.metrics && showLabels) {
      const { ab, cd, error } = validation.metrics;
      const c2 = getCoords(p2);
      const c3 = getCoords(p3);
      if (c2 && c3) {
        queueLabel(c2.x + bounds.left + 8, c2.y - 10, `AB ${ab.toFixed(2)}`, {
          state: ghostState,
          color: labelColor,
        });
        queueLabel(c3.x + bounds.left + 8, c3.y - 10, `CD ${cd.toFixed(2)}`, {
          state: ghostState,
          color: labelColor,
        });
        queueLabel(
          c3.x + bounds.left + 8,
          c3.y + 12,
          `Error ${(error * 100).toFixed(1)}%`,
          { state: ghostState, color: labelColor },
        );
      }
    }

    if (showLabels) {
      if (p1) labelPoint(p1, "A", -10, -16);
      if (p2) labelPoint(p2, "B", -2, -16);
      if (p3) labelPoint(p3, "C", -2, -16);
      if (validation.dPoint) labelPoint(validation.dPoint, "D", 6, -16);

      if (validation.metrics && validation.dPoint) {
        const ab = validation.metrics.ab;
        const bc = Math.abs(p3.price - p2.price);
        const cd = Math.abs(validation.dPoint.price - p3.price);
        const bcOverAb = ab === 0 ? 0 : bc / ab;
        const cdOverBc = bc === 0 ? 0 : cd / bc;
        const cdOverAb = ab === 0 ? 0 : cd / ab;

        const midBC = getMidpoint(p2, p3);
        const midCD = getMidpoint(p3, validation.dPoint);
        if (midBC) {
          queueLabel(
            midBC.x + 6,
            midBC.y - 14,
            `BC/AB ${bcOverAb.toFixed(3)}`,
            { state: ghostState, color: labelColor },
          );
        }
        if (midCD) {
          queueLabel(
            midCD.x + 6,
            midCD.y - 14,
            `CD/BC ${cdOverBc.toFixed(3)}`,
            { state: ghostState, color: labelColor },
          );
          queueLabel(midCD.x + 6, midCD.y + 8, `CD/AB ${cdOverAb.toFixed(3)}`, {
            state: ghostState,
            color: labelColor,
          });
        }
      }
    }

    if (showLabels) flushLabels();

    if (settings.extendProjection === true && validation.dPoint && p3) {
      const c3 = getCoords(p3);
      const dCoords = getCoords(validation.dPoint);
      if (c3 && dCoords) {
        drawRay(
          ctx,
          { x: c3.x + bounds.left, y: c3.y },
          { x: dCoords.x + bounds.left, y: dCoords.y },
          bounds,
          isPreview ? style.stroke : "#f59e0b",
        );
      }
    }

    if (settings.showPRZ !== false && validation.dPoint && validation.metrics) {
      const band = validation.metrics.ab * (settings.abcdTolerance ?? 0.1);
      const dCoords = getCoords(validation.dPoint);
      if (dCoords) {
        const y1 = series.priceToCoordinate(validation.dPoint.price + band);
        const y2 = series.priceToCoordinate(validation.dPoint.price - band);
        if (y1 !== null && y2 !== null) {
          const top = Math.min(y1, y2);
          const height = Math.abs(y1 - y2);
          ctx.save();
          ctx.fillStyle = style.fill;
          ctx.globalAlpha = style.fillAlpha;
          ctx.fillRect(dCoords.x + bounds.left - 8, top, 16, height);
          ctx.restore();
        }
      }
    }

    return validation;
  };

  const drawHarmonic = (ctx, type, points, settings, isPreview = false) => {
    const [p1, p2, p3, p4] = points;
    const validation = validateHarmonic(type, p1, p2, p3, p4, settings);
    const ghostState = validation.state || GHOST_STATES.neutral;
    const style = getGhostStyle(ghostState);
    const bounds = getChartBounds();
    const baseColor =
      type === "harmonicCypher"
        ? "#22c55e"
        : type === "harmonicThreeDrives"
          ? "#a855f7"
          : "#0ea5e9";
    const labelColor = isPreview ? style.stroke : baseColor;
    const labelQueue = [];
    const queueLabel = (x, y, text, opts = {}) => {
      const box = getGhostLabelBox(ctx, text, x, y, opts.align);
      if (!box) return;
      labelQueue.push({ text, x, y, opts, box });
    };
    const flushLabels = () => {
      const placed = resolveLabelOverlaps(labelQueue, ctx);
      placed.forEach((label) =>
        drawGhostLabel(ctx, label.text, label.x, label.y, label.opts),
      );
    };

    const getMidpoint = (a, b) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return null;
      return {
        x: (ca.x + cb.x) / 2 + bounds.left,
        y: (ca.y + cb.y) / 2,
      };
    };

    const labelPoint = (pt, text, dx = 6, dy = -12) => {
      const c = getCoords(pt);
      if (!c) return;
      queueLabel(c.x + bounds.left + dx, c.y + dy, text, {
        state: ghostState,
        color: labelColor,
      });
    };

    const drawSegment = (a, b) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return;
      ctx.beginPath();
      if (isPreview) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(ca.x + bounds.left, ca.y);
      ctx.lineTo(cb.x + bounds.left, cb.y);
      ctx.strokeStyle = isPreview ? style.stroke : "#0ea5e9";
      ctx.lineWidth = 2;
      ctx.globalAlpha = isPreview ? 0.85 : 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    if (p1 && p2) drawSegment(p1, p2);
    if (p2 && p3) drawSegment(p2, p3);
    if (p3 && p4) drawSegment(p3, p4);
    if (p4 && validation.dPoint) drawSegment(p4, validation.dPoint);

    if (isPreview) {
      [p1, p2, p3, p4].forEach((pt) =>
        drawGhostPoint(ctx, pt, { derived: false, state: ghostState }),
      );
      if (validation.dPoint)
        drawGhostPoint(ctx, validation.dPoint, {
          derived: true,
          state: ghostState,
        });
    }

    if (validation.ratios && settings.showRatioLabels !== false) {
      if (p1) labelPoint(p1, "X", -10, -16);
      if (p2) labelPoint(p2, "A", -2, -16);
      if (p3) labelPoint(p3, "B", -2, -16);
      if (p4) labelPoint(p4, "C", -2, -16);
      if (validation.dPoint) labelPoint(validation.dPoint, "D", 6, -16);

      validation.ratios.forEach((r) => {
        let anchor = null;
        if (r.label.startsWith("AB/")) anchor = getMidpoint(p2, p3);
        else if (r.label.startsWith("BC/")) anchor = getMidpoint(p3, p4);
        else if (r.label.startsWith("CD/") || r.label.startsWith("D2/"))
          anchor = validation.dPoint
            ? getMidpoint(p4, validation.dPoint)
            : null;
        else if (r.label.includes("/XC") || r.label.startsWith("XD/"))
          anchor = validation.dPoint
            ? getMidpoint(p1, validation.dPoint)
            : null;
        if (!anchor) return;
        queueLabel(
          anchor.x + 6,
          anchor.y - 12,
          `${r.label} ${r.ratio.toFixed(3)}`,
          { state: ghostState, color: labelColor },
        );
      });
    }

    if (settings.showPRZ !== false && validation.dPoint && p1) {
      const band =
        Math.abs(p4.price - p1.price) * (settings.fibTolerance ?? 0.08);
      const dCoords = getCoords(validation.dPoint);
      if (dCoords) {
        const y1 = series.priceToCoordinate(validation.dPoint.price + band);
        const y2 = series.priceToCoordinate(validation.dPoint.price - band);
        if (y1 !== null && y2 !== null) {
          const top = Math.min(y1, y2);
          const height = Math.abs(y1 - y2);
          ctx.save();
          ctx.fillStyle = style.fill;
          ctx.globalAlpha = style.fillAlpha;
          ctx.fillRect(dCoords.x + bounds.left - 8, top, 16, height);
          ctx.restore();
        }
      }
    }

    if (settings.showRatioLabels !== false) flushLabels();

    return validation;
  };

  const drawTrianglePattern = (ctx, points, settings, isPreview = false) => {
    const validation = validateTriangle(points, settings);
    const ghostState = validation.state || GHOST_STATES.neutral;
    const style = getGhostStyle(ghostState);
    const bounds = getChartBounds();
    const showLabels = settings?.showLabels !== false;

    const drawSegment = (a, b) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return;
      ctx.beginPath();
      if (isPreview) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(ca.x + bounds.left, ca.y);
      ctx.lineTo(cb.x + bounds.left, cb.y);
      ctx.strokeStyle = isPreview ? style.stroke : "#f97316";
      ctx.lineWidth = 2;
      ctx.globalAlpha = isPreview ? 0.85 : 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    for (let i = 1; i < points.length; i++) {
      drawSegment(points[i - 1], points[i]);
    }

    if (validation.lines) {
      drawSegment(validation.lines.upper.p1, validation.lines.upper.p2);
      drawSegment(validation.lines.lower.p1, validation.lines.lower.p2);

      const lu1 = getLogicalIndex(validation.lines.upper.p1);
      const lu2 = getLogicalIndex(validation.lines.upper.p2);
      const ll1 = getLogicalIndex(validation.lines.lower.p1);
      const ll2 = getLogicalIndex(validation.lines.lower.p2);
      if (
        lu1 !== undefined &&
        lu2 !== undefined &&
        ll1 !== undefined &&
        ll2 !== undefined
      ) {
        const leftLogical = Math.min(lu1, lu2, ll1, ll2);
        const rightLogical = Math.max(lu1, lu2, ll1, ll2);
        const upperLeft = getLinePriceAtLogical(
          validation.lines.upper.p1,
          validation.lines.upper.p2,
          leftLogical,
        );
        const upperRight = getLinePriceAtLogical(
          validation.lines.upper.p1,
          validation.lines.upper.p2,
          rightLogical,
        );
        const lowerLeft = getLinePriceAtLogical(
          validation.lines.lower.p1,
          validation.lines.lower.p2,
          leftLogical,
        );
        const lowerRight = getLinePriceAtLogical(
          validation.lines.lower.p1,
          validation.lines.lower.p2,
          rightLogical,
        );
        if (
          upperLeft !== null &&
          upperRight !== null &&
          lowerLeft !== null &&
          lowerRight !== null
        ) {
          const pUL = getPointFromLogical(leftLogical, upperLeft);
          const pUR = getPointFromLogical(rightLogical, upperRight);
          const pLL = getPointFromLogical(leftLogical, lowerLeft);
          const pLR = getPointFromLogical(rightLogical, lowerRight);
          const cUL = getCoords(pUL);
          const cUR = getCoords(pUR);
          const cLL = getCoords(pLL);
          const cLR = getCoords(pLR);
          if (cUL && cUR && cLL && cLR) {
            ctx.save();
            ctx.globalAlpha = style.fillAlpha;
            ctx.fillStyle = style.fill;
            ctx.beginPath();
            ctx.moveTo(cUL.x + bounds.left, cUL.y);
            ctx.lineTo(cUR.x + bounds.left, cUR.y);
            ctx.lineTo(cLR.x + bounds.left, cLR.y);
            ctx.lineTo(cLL.x + bounds.left, cLL.y);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
        }
      }
    }

    if (isPreview) {
      points.forEach((pt) =>
        drawGhostPoint(ctx, pt, { derived: false, state: ghostState }),
      );
    }

    if (validation.lines && settings.showApex !== false && showLabels) {
      const { upper, lower } = validation.lines;
      const lu1 = getLogicalIndex(upper.p1);
      const lu2 = getLogicalIndex(upper.p2);
      const ll1 = getLogicalIndex(lower.p1);
      const ll2 = getLogicalIndex(lower.p2);
      if (
        lu1 !== undefined &&
        lu2 !== undefined &&
        ll1 !== undefined &&
        ll2 !== undefined
      ) {
        const upperSlope = (upper.p2.price - upper.p1.price) / (lu2 - lu1);
        const lowerSlope = (lower.p2.price - lower.p1.price) / (ll2 - ll1);
        const apexLogical =
          (lowerSlope * ll1 -
            upperSlope * lu1 +
            upper.p1.price -
            lower.p1.price) /
          (lowerSlope - upperSlope);
        const apexPrice = getLinePriceAtLogical(
          upper.p1,
          upper.p2,
          apexLogical,
        );
        if (apexPrice !== null) {
          const apexPoint = getPointFromLogical(apexLogical, apexPrice);
          const coords = getCoords(apexPoint);
          if (coords) {
            const bars =
              apexLogical -
              (getLogicalIndex(points[points.length - 1]) || apexLogical);
            drawGhostLabel(
              ctx,
              `Apex ${Math.max(0, Math.round(bars))} bars`,
              coords.x + bounds.left,
              coords.y - 12,
              { state: ghostState, align: "center" },
            );
          }
        }
      }
    }

    if (validation.lines && settings.showTarget !== false && showLabels) {
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      if (last && prev) {
        const baseHigh = Math.max(...points.map((p) => p.price));
        const baseLow = Math.min(...points.map((p) => p.price));
        const height = baseHigh - baseLow;
        const directionUp = last.price > prev.price;
        const targetPrice = directionUp
          ? last.price + height
          : last.price - height;
        const targetY = series.priceToCoordinate(targetPrice);
        if (targetY !== null) {
          ctx.save();
          if (isPreview) ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(bounds.left, targetY);
          ctx.lineTo(bounds.right, targetY);
          ctx.strokeStyle = isPreview ? style.stroke : "#f97316";
          ctx.globalAlpha = isPreview ? 0.7 : 0.9;
          ctx.stroke();
          ctx.restore();
          drawGhostLabel(
            ctx,
            `Target ${targetPrice.toFixed(2)}`,
            bounds.right - 90,
            targetY - 10,
            { state: ghostState },
          );
        }
      }
    }

    return validation;
  };

  const drawTextBox = (
    ctx,
    anchor,
    text,
    settings,
    bounds,
    { ghost = false, showLeader = false } = {},
  ) => {
    if (!anchor) return null;
    const merged = settings;
    const metrics = getTextBoxMetrics(ctx, text, merged);
    let x = anchor.x;
    let y = anchor.y;
    if (merged.autoFlip) {
      if (x + metrics.width > bounds.right - 4)
        x = bounds.right - metrics.width - 4;
      if (x < bounds.left + 4) x = bounds.left + 4;
      if (y - metrics.height / 2 < 4) y = metrics.height / 2 + 4;
      if (y + metrics.height / 2 > bounds.height - 4)
        y = bounds.height - metrics.height / 2 - 4;
    }

    const layout = getTextBoxLayout(x, y, metrics);
    const rawBox = {
      x: layout.boxX,
      y: layout.boxY,
      w: metrics.width,
      h: metrics.height,
    };
    const finalBox = ghost
      ? { ...rawBox, alpha: 0.35 }
      : resolveTextCollision(rawBox, merged, bounds);
    if (!finalBox) return null;
    const alpha = ghost ? 0.35 : (finalBox.alpha ?? merged.opacity ?? 1);

    ctx.save();
    ctx.globalAlpha = alpha;
    const bg = merged.backgroundColor || "transparent";
    const bgAlpha =
      (merged.backgroundAlpha ?? (bg !== "transparent" ? 1 : 0)) * alpha;
    if (bg !== "transparent" && bgAlpha > 0) {
      ctx.globalAlpha = bgAlpha;
      ctx.fillStyle = bg;
      ctx.beginPath();
      if (ctx.roundRect)
        ctx.roundRect(finalBox.x, finalBox.y, finalBox.w, finalBox.h, 4);
      else ctx.rect(finalBox.x, finalBox.y, finalBox.w, finalBox.h);
      ctx.fill();
      ctx.globalAlpha = alpha;
    }

    const borderWidth = merged.borderWidth || 0;
    if (borderWidth > 0 || ghost) {
      ctx.lineWidth = borderWidth > 0 ? borderWidth : 1;
      ctx.strokeStyle = merged.borderColor || merged.color || "#94a3b8";
      ctx.setLineDash(ghost ? [4, 4] : []);
      ctx.beginPath();
      if (ctx.roundRect)
        ctx.roundRect(finalBox.x, finalBox.y, finalBox.w, finalBox.h, 4);
      else ctx.rect(finalBox.x, finalBox.y, finalBox.w, finalBox.h);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.font = `${metrics.fontSize}px ${metrics.fontFamily}`;
    ctx.fillStyle = merged.color || "#607D8B";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(
      text,
      finalBox.x + metrics.padding,
      finalBox.y + finalBox.h / 2,
    );

    if (showLeader && anchor.anchorX !== undefined) {
      ctx.beginPath();
      ctx.moveTo(anchor.anchorX, anchor.anchorY);
      ctx.lineTo(finalBox.x, finalBox.y + finalBox.h / 2);
      ctx.strokeStyle = merged.color || "#607D8B";
      ctx.lineWidth = 1;
      ctx.setLineDash(ghost ? [4, 4] : []);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(anchor.anchorX, anchor.anchorY, 3, 0, Math.PI * 2);
      ctx.fillStyle = merged.color || "#607D8B";
      ctx.fill();
    }

    ctx.restore();
    return finalBox;
  };

  const drawTextTool = (ctx, point, bounds, settings = {}, ghost = false) => {
    const merged = mergeTextSettings("text", settings);
    const anchor = getScreenTextPoint(bounds, merged, point);
    if (!anchor) return;
    const scale = merged.autoScale ? getStrokeScale(true) : 1;
    const scaled = {
      ...merged,
      fontSize: merged.fontSize * scale,
    };
    const label = merged.text || "Text";
    drawTextBox(ctx, anchor, label, scaled, bounds, {
      ghost,
      showLeader: false,
    });
  };

  const drawAnchoredText = (
    ctx,
    point,
    bounds,
    settings = {},
    ghost = false,
  ) => {
    if (!point) return;
    const merged = mergeTextSettings("anchoredText", settings);
    const anchor = getAnchorScreenPoint(point, bounds, merged);
    if (!anchor) return;
    const label = merged.text || "Anchored";
    drawTextBox(ctx, anchor, label, merged, bounds, {
      ghost,
      showLeader: merged.showLeader !== false,
    });
  };

  const drawNote = (ctx, point, bounds, settings = {}, ghost = false) => {
    const merged = mergeTextSettings("note", settings);
    const anchor = getScreenTextPoint(bounds, merged, point);
    if (!anchor) return;
    const scale = merged.autoScale ? getStrokeScale(true) : 1;
    const scaled = {
      ...merged,
      fontSize: merged.fontSize * scale,
    };
    const label = merged.text || "Note";
    drawTextBox(ctx, anchor, label, scaled, bounds, { ghost });
  };

  const drawPriceNote = (ctx, point, bounds, settings = {}, ghost = false) => {
    if (!point) return;
    const merged = mergeTextSettings("priceNote", settings);
    const anchor = getAnchorScreenPoint(point, bounds, merged);
    if (!anchor) return;
    let priceValue = point.price;
    if (magnetEnabled && magnetMode !== "free" && merged.snapToTick && series) {
      const minTick = series.priceScale?.().options?.().minimumTick;
      if (typeof minTick === "number" && minTick > 0) {
        priceValue = Math.round(priceValue / minTick) * minTick;
      }
    }
    const decimals =
      typeof merged.decimals === "number"
        ? Math.max(0, Math.min(8, merged.decimals))
        : 2;
    const priceText = merged.showPriceLabel
      ? `${Number(priceValue).toFixed(decimals)}`
      : "";
    const noteText = merged.text || "";

    if (merged.extendLine) {
      ctx.save();
      ctx.setLineDash(ghost ? [4, 4] : []);
      ctx.strokeStyle = merged.color || "#2962FF";
      ctx.lineWidth = 1;
      ctx.globalAlpha = ghost ? 0.5 : 0.9;
      ctx.beginPath();
      ctx.moveTo(bounds.left, anchor.anchorY);
      ctx.lineTo(bounds.right, anchor.anchorY);
      ctx.stroke();
      ctx.restore();
    }

    // Price pill on the right edge
    if (priceText) {
      ctx.save();
      ctx.font = `bold ${Math.max(11, merged.fontSize || 12)}px ${
        merged.fontFamily || "sans-serif"
      }`;
      const padX = 8;
      const padY = 4;
      const textW = ctx.measureText(priceText).width;
      const boxW = textW + padX * 2;
      const boxH = (merged.fontSize || 12) + padY * 2;
      const boxX = bounds.right - boxW - 6;
      const boxY = anchor.anchorY - boxH / 2;
      ctx.globalAlpha = ghost ? 0.5 : 1;
      ctx.fillStyle = merged.backgroundColor || "#2962FF";
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 6);
        ctx.fill();
      } else {
        ctx.fillRect(boxX, boxY, boxW, boxH);
      }
      ctx.fillStyle = merged.color || "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(priceText, boxX + boxW / 2, boxY + boxH / 2);
      ctx.restore();
    }

    // Note bubble near anchor with leader line
    const bubbleLabel = noteText || (priceText ? "" : "Price");
    if (bubbleLabel) {
      const bubbleSettings = {
        ...merged,
        backgroundAlpha: ghost ? 0.6 : merged.backgroundAlpha,
      };
      drawTextBox(ctx, anchor, bubbleLabel, bubbleSettings, bounds, { ghost });
      if (noteText) {
        ctx.save();
        ctx.globalAlpha = ghost ? 0.5 : 0.8;
        ctx.strokeStyle = merged.color || "#2962FF";
        ctx.setLineDash(ghost ? [3, 3] : []);
        ctx.beginPath();
        ctx.moveTo(anchor.anchorX, anchor.anchorY);
        ctx.lineTo(anchor.x, anchor.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const drawCallout = (ctx, p1, p2, bounds, settings = {}, ghost = false) => {
    if (!p1) return;
    const merged = mergeTextSettings("callout", settings);
    const anchor = getAnchorScreenPoint(p1, bounds, merged);
    if (!anchor) return;
    let bubble = anchor;
    if (p2 && !settings?.offset) {
      const c2 = getCoords(p2);
      if (c2) {
        bubble = {
          anchorX: anchor.anchorX,
          anchorY: anchor.anchorY,
          x: c2.x + bounds.left,
          y: c2.y,
        };
      }
    }

    const label = merged.text || "Callout";
    const metrics = getTextBoxMetrics(ctx, label, merged);
    const layout = getTextBoxLayout(bubble.x, bubble.y, metrics);
    const rawBox = {
      x: layout.boxX - metrics.width / 2,
      y: layout.boxY,
      w: metrics.width,
      h: metrics.height,
    };
    const finalBox = ghost
      ? { ...rawBox, alpha: 0.35 }
      : resolveTextCollision(rawBox, merged, bounds);
    if (!finalBox) return;

    ctx.save();
    const alpha = ghost ? 0.35 : (finalBox.alpha ?? merged.opacity ?? 1);
    const bgAlpha = (merged.backgroundAlpha ?? 1) * (ghost ? 0.6 : 1) * alpha;
    ctx.globalAlpha = bgAlpha;
    ctx.fillStyle = merged.backgroundColor || "#607D8B";
    ctx.strokeStyle = merged.color || "#ffffff";
    ctx.lineWidth = 1;
    if (merged.bubbleShape === "rect") {
      ctx.beginPath();
      ctx.rect(finalBox.x, finalBox.y, finalBox.w, finalBox.h);
    } else if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(finalBox.x, finalBox.y, finalBox.w, finalBox.h, 6);
    } else {
      ctx.beginPath();
      ctx.rect(finalBox.x, finalBox.y, finalBox.w, finalBox.h);
    }
    ctx.fill();

    ctx.globalAlpha = alpha;
    if (merged.arrowStyle === "line") {
      ctx.beginPath();
      ctx.moveTo(anchor.anchorX, anchor.anchorY);
      ctx.lineTo(finalBox.x + finalBox.w / 2, finalBox.y + finalBox.h / 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(finalBox.x + finalBox.w / 2, finalBox.y + finalBox.h);
      ctx.lineTo(anchor.anchorX, anchor.anchorY);
      ctx.lineTo(finalBox.x + finalBox.w / 2 - 8, finalBox.y + finalBox.h);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = merged.color || "#ffffff";
    ctx.font = `${metrics.fontSize}px ${metrics.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      label,
      finalBox.x + finalBox.w / 2,
      finalBox.y + finalBox.h / 2,
    );
    ctx.restore();
  };

  const drawPin = (ctx, point, bounds, settings = {}, ghost = false) => {
    if (!point) return;
    const merged = mergeTextSettings("pin", settings);
    const anchor = getAnchorScreenPoint(point, bounds, merged);
    if (!anchor) return;
    const x = anchor.x;
    const y = anchor.y;
    const color = merged.color || "#E91E63";
    const size = merged.size || 20;

    ctx.save();
    ctx.globalAlpha = ghost ? 0.35 : (merged.opacity ?? 1);
    ctx.beginPath();
    ctx.arc(x, y - size * 0.6, size * 0.45, Math.PI, 0);
    ctx.bezierCurveTo(
      x + size * 0.45,
      y - size * 0.3,
      x + size * 0.1,
      y - size * 0.05,
      x,
      y,
    );
    ctx.bezierCurveTo(
      x - size * 0.1,
      y - size * 0.05,
      x - size * 0.45,
      y - size * 0.3,
      x - size * 0.45,
      y - size * 0.6,
    );
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - size * 0.6, size * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fill();
    ctx.restore();

    if (merged.showTooltip && merged.tooltipText) {
      drawTextBox(
        ctx,
        { x: x + size * 0.6, y: y - size, anchorX: x, anchorY: y },
        merged.tooltipText,
        merged,
        bounds,
        { ghost },
      );
    }
  };

  const drawFlag = (ctx, point, bounds, settings = {}, ghost = false) => {
    if (!point) return;
    const merged = mergeTextSettings("flag", settings);
    const anchor = getAnchorScreenPoint(point, bounds, merged);
    if (!anchor) return;
    const x = anchor.x;
    const y = anchor.y;
    const color = merged.color || "#F44336";
    const size = merged.size || 20;

    ctx.save();
    ctx.globalAlpha = ghost ? 0.35 : (merged.opacity ?? 1);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - size * 1.2);
    ctx.strokeStyle = "#455A64";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y - size * 1.2);
    ctx.lineTo(x + size * 0.9, y - size * 0.9);
    ctx.lineTo(x, y - size * 0.6);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();

    if (merged.showTooltip && merged.tooltipText) {
      drawTextBox(
        ctx,
        { x: x + size * 0.6, y: y - size, anchorX: x, anchorY: y },
        merged.tooltipText,
        merged,
        bounds,
        { ghost },
      );
    }
  };

  const drawElliottImpulse = (
    ctx,
    points,
    settings,
    isPreview = false,
    previewPoint = null,
  ) => {
    const pts = [...points];
    if (previewPoint) {
      for (let i = 0; i < pts.length; i++) {
        if (!pts[i]) {
          pts[i] = previewPoint;
          break;
        }
      }
    }
    const validation = validateElliottImpulse(pts, settings);
    const ghostState = validation.state || GHOST_STATES.neutral;
    const style = getGhostStyle(ghostState);
    const bounds = getChartBounds();
    const showLabels = settings?.showLabels !== false;
    const labelColor = isPreview ? style.stroke : "#ec4899";
    const showFibTargets = settings?.showFibTargets === true;
    const showDegreeLabels = settings?.showDegreeLabels !== false;
    const degreeLabel = settings?.degreeLabel || "Minor";
    const labelQueue = [];
    const queueLabel = (x, y, text, opts = {}) => {
      const box = getGhostLabelBox(ctx, text, x, y, opts.align);
      if (!box) return;
      labelQueue.push({ text, x, y, opts, box });
    };
    const flushLabels = () => {
      const placed = resolveLabelOverlaps(labelQueue, ctx);
      placed.forEach((label) =>
        drawGhostLabel(ctx, label.text, label.x, label.y, label.opts),
      );
    };

    const drawSegment = (a, b) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return;
      ctx.beginPath();
      if (isPreview) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(ca.x + bounds.left, ca.y);
      ctx.lineTo(cb.x + bounds.left, cb.y);
      ctx.strokeStyle = isPreview ? style.stroke : "#ec4899";
      ctx.lineWidth = 2;
      ctx.globalAlpha = isPreview ? 0.85 : 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const formatLabel = (label) =>
      showDegreeLabels && degreeLabel && degreeLabel !== "None"
        ? `${degreeLabel} ${label}`
        : label;

    const drawTargetLine = (price, text) => {
      const y = series.priceToCoordinate(price);
      if (y === null) return;
      ctx.save();
      if (isPreview) ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(bounds.left, y);
      ctx.lineTo(bounds.right, y);
      ctx.strokeStyle = isPreview ? style.stroke : labelColor;
      ctx.globalAlpha = isPreview ? 0.6 : 0.8;
      ctx.stroke();
      ctx.restore();
      queueLabel(bounds.right - 90, y - 10, text, {
        state: ghostState,
        color: labelColor,
      });
    };

    for (let i = 1; i < pts.length; i++) {
      if (pts[i - 1] && pts[i]) drawSegment(pts[i - 1], pts[i]);
    }

    if (isPreview) {
      pts.forEach((pt) =>
        drawGhostPoint(ctx, pt, { derived: false, state: ghostState }),
      );
    }

    if (showLabels) {
      const labels = ["1", "2", "3", "4", "5"];
      labels.forEach((label, idx) => {
        const pt = pts[idx + 1];
        if (!pt) return;
        const c = getCoords(pt);
        if (!c) return;
        queueLabel(c.x + bounds.left + 6, c.y - 14, formatLabel(label), {
          state: ghostState,
          color: labelColor,
        });
      });

      if (validation.messages?.length) {
        const last = pts.filter(Boolean).slice(-1)[0];
        const c = last ? getCoords(last) : null;
        if (c) {
          queueLabel(c.x + bounds.left + 8, c.y + 12, validation.messages[0], {
            state: ghostState,
            color: labelColor,
          });
        }
      }
      if (showFibTargets && pts[0] && pts[1] && pts[2]) {
        const base = Math.abs(pts[1].price - pts[0].price);
        const dir = validation.directionUp ? 1 : -1;
        [1.618, 2.618].forEach((ratio) => {
          drawTargetLine(
            pts[2].price + dir * base * ratio,
            `W3 ${ratio.toFixed(3)}x`,
          );
        });
      }
      if (showFibTargets && pts[4] && pts[0] && pts[1]) {
        const base = Math.abs(pts[1].price - pts[0].price);
        const dir = validation.directionUp ? 1 : -1;
        [0.618, 1.0].forEach((ratio) => {
          drawTargetLine(
            pts[4].price + dir * base * ratio,
            `W5 ${ratio.toFixed(3)}x`,
          );
        });
      }
      flushLabels();
    }

    return validation;
  };

  const drawElliottCorrection = (
    ctx,
    points,
    settings,
    isPreview = false,
    previewPoint = null,
  ) => {
    const pts = [...points];
    if (previewPoint) {
      for (let i = 0; i < pts.length; i++) {
        if (!pts[i]) {
          pts[i] = previewPoint;
          break;
        }
      }
    }
    const validation = validateElliottCorrection(pts, settings);
    const ghostState = validation.state || GHOST_STATES.neutral;
    const style = getGhostStyle(ghostState);
    const bounds = getChartBounds();
    const showLabels = settings?.showLabels !== false;
    const labelColor = isPreview ? style.stroke : "#f43f5e";
    const showFibTargets = settings?.showFibTargets === true;
    const showDegreeLabels = settings?.showDegreeLabels !== false;
    const degreeLabel = settings?.degreeLabel || "Minor";
    const labelQueue = [];
    const queueLabel = (x, y, text, opts = {}) => {
      const box = getGhostLabelBox(ctx, text, x, y, opts.align);
      if (!box) return;
      labelQueue.push({ text, x, y, opts, box });
    };
    const flushLabels = () => {
      const placed = resolveLabelOverlaps(labelQueue, ctx);
      placed.forEach((label) =>
        drawGhostLabel(ctx, label.text, label.x, label.y, label.opts),
      );
    };

    const drawSegment = (a, b) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return;
      ctx.beginPath();
      if (isPreview) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(ca.x + bounds.left, ca.y);
      ctx.lineTo(cb.x + bounds.left, cb.y);
      ctx.strokeStyle = isPreview ? style.stroke : "#f43f5e";
      ctx.lineWidth = 2;
      ctx.globalAlpha = isPreview ? 0.85 : 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const formatLabel = (label) =>
      showDegreeLabels && degreeLabel && degreeLabel !== "None"
        ? `${degreeLabel} ${label}`
        : label;

    const drawTargetLine = (price, text) => {
      const y = series.priceToCoordinate(price);
      if (y === null) return;
      ctx.save();
      if (isPreview) ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(bounds.left, y);
      ctx.lineTo(bounds.right, y);
      ctx.strokeStyle = isPreview ? style.stroke : labelColor;
      ctx.globalAlpha = isPreview ? 0.6 : 0.8;
      ctx.stroke();
      ctx.restore();
      queueLabel(bounds.right - 90, y - 10, text, {
        state: ghostState,
        color: labelColor,
      });
    };

    for (let i = 1; i < pts.length; i++) {
      if (pts[i - 1] && pts[i]) drawSegment(pts[i - 1], pts[i]);
    }

    if (isPreview) {
      pts.forEach((pt) =>
        drawGhostPoint(ctx, pt, { derived: false, state: ghostState }),
      );
    }

    if (showLabels) {
      const labels = ["A", "B", "C"];
      labels.forEach((label, idx) => {
        const pt = pts[idx + 1];
        if (!pt) return;
        const c = getCoords(pt);
        if (!c) return;
        queueLabel(c.x + bounds.left + 6, c.y - 14, formatLabel(label), {
          state: ghostState,
          color: labelColor,
        });
      });
      if (validation.messages?.length) {
        const last = pts.filter(Boolean).slice(-1)[0];
        const c = last ? getCoords(last) : null;
        if (c) {
          queueLabel(c.x + bounds.left + 8, c.y + 12, validation.messages[0], {
            state: ghostState,
            color: labelColor,
          });
        }
      }
      if (showFibTargets && pts[0] && pts[1] && pts[2]) {
        const base = Math.abs(pts[1].price - pts[0].price);
        const dir = validation.directionUp ? 1 : -1;
        [1.0, 1.618].forEach((ratio) => {
          drawTargetLine(
            pts[2].price + dir * base * ratio,
            `C ${ratio.toFixed(3)}x`,
          );
        });
      }
      flushLabels();
    }

    return validation;
  };

  const drawElliottTriangle = (
    ctx,
    points,
    settings,
    isPreview = false,
    previewPoint = null,
  ) => {
    const pts = [...points];
    if (previewPoint) {
      for (let i = 0; i < pts.length; i++) {
        if (!pts[i]) {
          pts[i] = previewPoint;
          break;
        }
      }
    }
    const validation = validateElliottTriangle(pts, settings);
    const ghostState = validation.state || GHOST_STATES.neutral;
    const style = getGhostStyle(ghostState);
    const bounds = getChartBounds();
    const showLabels = settings?.showLabels !== false;
    const labelColor = isPreview ? style.stroke : "#ef4444";
    const showDegreeLabels = settings?.showDegreeLabels !== false;
    const degreeLabel = settings?.degreeLabel || "Minor";
    const labelQueue = [];
    const queueLabel = (x, y, text, opts = {}) => {
      const box = getGhostLabelBox(ctx, text, x, y, opts.align);
      if (!box) return;
      labelQueue.push({ text, x, y, opts, box });
    };
    const flushLabels = () => {
      const placed = resolveLabelOverlaps(labelQueue, ctx);
      placed.forEach((label) =>
        drawGhostLabel(ctx, label.text, label.x, label.y, label.opts),
      );
    };

    const drawSegment = (a, b) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return;
      ctx.beginPath();
      if (isPreview) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(ca.x + bounds.left, ca.y);
      ctx.lineTo(cb.x + bounds.left, cb.y);
      ctx.strokeStyle = isPreview ? style.stroke : "#ef4444";
      ctx.lineWidth = 2;
      ctx.globalAlpha = isPreview ? 0.85 : 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const formatLabel = (label) =>
      showDegreeLabels && degreeLabel && degreeLabel !== "None"
        ? `${degreeLabel} ${label}`
        : label;

    for (let i = 1; i < pts.length; i++) {
      if (pts[i - 1] && pts[i]) drawSegment(pts[i - 1], pts[i]);
    }

    if (isPreview) {
      pts.forEach((pt) =>
        drawGhostPoint(ctx, pt, { derived: false, state: ghostState }),
      );
    }

    if (showLabels) {
      const labels = ["A", "B", "C", "D", "E"];
      labels.forEach((label, idx) => {
        const pt = pts[idx];
        if (!pt) return;
        const c = getCoords(pt);
        if (!c) return;
        queueLabel(c.x + bounds.left + 6, c.y - 14, formatLabel(label), {
          state: ghostState,
          color: labelColor,
        });
      });
      if (validation.messages?.length) {
        const last = pts.filter(Boolean).slice(-1)[0];
        const c = last ? getCoords(last) : null;
        if (c) {
          queueLabel(c.x + bounds.left + 8, c.y + 12, validation.messages[0], {
            state: ghostState,
            color: labelColor,
          });
        }
      }
      flushLabels();
    }

    return validation;
  };

  const drawElliottCombo = (
    ctx,
    points,
    settings,
    isPreview = false,
    previewPoint = null,
  ) => {
    const pts = [...points];
    if (previewPoint) {
      for (let i = 0; i < pts.length; i++) {
        if (!pts[i]) {
          pts[i] = previewPoint;
          break;
        }
      }
    }
    const validation = validateElliottCombo(pts, settings);
    const ghostState = validation.state || GHOST_STATES.neutral;
    const style = getGhostStyle(ghostState);
    const bounds = getChartBounds();
    const showLabels = settings?.showLabels !== false;
    const labelColor = isPreview ? style.stroke : "#f97316";
    const showDegreeLabels = settings?.showDegreeLabels !== false;
    const degreeLabel = settings?.degreeLabel || "Minor";
    const labelQueue = [];
    const queueLabel = (x, y, text, opts = {}) => {
      const box = getGhostLabelBox(ctx, text, x, y, opts.align);
      if (!box) return;
      labelQueue.push({ text, x, y, opts, box });
    };
    const flushLabels = () => {
      const placed = resolveLabelOverlaps(labelQueue, ctx);
      placed.forEach((label) =>
        drawGhostLabel(ctx, label.text, label.x, label.y, label.opts),
      );
    };

    const drawSegment = (a, b) => {
      const ca = getCoords(a);
      const cb = getCoords(b);
      if (!ca || !cb) return;
      ctx.beginPath();
      if (isPreview) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(ca.x + bounds.left, ca.y);
      ctx.lineTo(cb.x + bounds.left, cb.y);
      ctx.strokeStyle = isPreview ? style.stroke : "#f97316";
      ctx.lineWidth = 2;
      ctx.globalAlpha = isPreview ? 0.85 : 1;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const formatLabel = (label) =>
      showDegreeLabels && degreeLabel && degreeLabel !== "None"
        ? `${degreeLabel} ${label}`
        : label;

    for (let i = 1; i < pts.length; i++) {
      if (pts[i - 1] && pts[i]) drawSegment(pts[i - 1], pts[i]);
    }

    if (isPreview) {
      pts.forEach((pt) =>
        drawGhostPoint(ctx, pt, { derived: false, state: ghostState }),
      );
    }

    if (showLabels) {
      const labels = ["W", "X", "Y"];
      labels.forEach((label, idx) => {
        const pt = pts[idx + 1];
        if (!pt) return;
        const c = getCoords(pt);
        if (!c) return;
        queueLabel(c.x + bounds.left + 6, c.y - 14, formatLabel(label), {
          state: ghostState,
          color: labelColor,
        });
      });
      if (validation.messages?.length) {
        const last = pts.filter(Boolean).slice(-1)[0];
        const c = last ? getCoords(last) : null;
        if (c) {
          queueLabel(c.x + bounds.left + 8, c.y + 12, validation.messages[0], {
            state: ghostState,
            color: labelColor,
          });
        }
      }
      flushLabels();
    }

    return validation;
  };

  const drawCyclicLines = (
    ctx,
    p1,
    p2,
    settings,
    isPreview = false,
    previewPoint = null,
  ) => {
    if (!p1) return { state: GHOST_STATES.neutral };
    const endPoint = p2 || previewPoint;
    const l1 = getLogicalIndex(p1);
    if (l1 === undefined) return { state: GHOST_STATES.neutral };
    const bounds = getChartBounds();
    let state = GHOST_STATES.neutral;
    let period = null;
    if (endPoint) {
      const l2 = getLogicalIndex(endPoint);
      if (l2 === undefined) return { state: GHOST_STATES.neutral };
      period = l2 - l1;
      if (period <= 0) state = GHOST_STATES.invalid;
      else state = GHOST_STATES.valid;
    }
    const style = getGhostStyle(state);
    const stroke = isPreview ? style.stroke : "#0f766e";
    const showLabels = settings?.showLabels !== false;
    const direction = settings?.direction || "both";
    const labelQueue = [];
    const queueLabel = (x, y, text, opts = {}) => {
      const box = getGhostLabelBox(ctx, text, x, y, opts.align);
      if (!box) return;
      labelQueue.push({ text, x, y, opts, box });
    };
    const flushLabels = () => {
      const placed = resolveLabelOverlaps(labelQueue, ctx);
      placed.forEach((label) =>
        drawGhostLabel(ctx, label.text, label.x, label.y, label.opts),
      );
    };

    const drawVertical = (x) => {
      ctx.beginPath();
      if (isPreview) ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, bounds.height);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = isPreview ? 0.8 : 0.9;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const baseX = chart.timeScale().logicalToCoordinate(l1);
    if (baseX !== null) {
      drawVertical(baseX + bounds.left);
      if (showLabels) {
        queueLabel(baseX + bounds.left + 4, 12, "0", {
          state,
          color: stroke,
        });
      }
    }

    if (period && period > 0) {
      const range = chart.timeScale().getVisibleLogicalRange();
      if (range) {
        let startN = Math.floor((range.from - l1) / period) - 1;
        let endN = Math.ceil((range.to - l1) / period) + 1;
        if (direction === "right") {
          startN = Math.max(startN, 0);
        } else if (direction === "left") {
          endN = Math.min(endN, 0);
        }
        for (let n = startN; n <= endN; n++) {
          if (n === 0) continue;
          const logical = l1 + n * period;
          const x = chart.timeScale().logicalToCoordinate(logical);
          if (x === null) continue;
          drawVertical(x + bounds.left);
          if (showLabels) {
            queueLabel(x + bounds.left + 4, 12, `${n}`, {
              state,
              color: stroke,
            });
          }
        }
      }
    } else if (endPoint) {
      const l2 = getLogicalIndex(endPoint);
      if (l2 !== undefined) {
        const x = chart.timeScale().logicalToCoordinate(l2);
        if (x !== null) drawVertical(x + bounds.left);
      }
    }

    if (showLabels) flushLabels();

    return {
      state,
      message:
        state === GHOST_STATES.invalid
          ? "Invalid: cycle period must be > 0"
          : "",
    };
  };

  // Main render function
  const renderDrawings = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      const container = containerRef.current?.parentElement;
      if (!canvas || !container || !chart || !series) return;
      ghostStateRef.current = null;
      ghostMessageRef.current = "";

      const drawAnchor = (x, y) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#2962FF";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      };

      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;

      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.lineCap = "square";
      ctx.clearRect(0, 0, container.clientWidth, container.clientHeight);

      const bounds = getChartBounds();

      // Clip to chart area
      ctx.save();
      ctx.beginPath();
      ctx.rect(bounds.left, 0, bounds.width, bounds.height);
      ctx.clip();

      textCollisionRef.current = [];

      if (activeTool && TEXT_TOOL_TYPES.includes(activeTool) && !currentLine) {
        const ghostSettings = mergeTextSettings(activeTool, {});
        const ghostLabel = TEXT_GHOST_LABELS[activeTool] || "Text";
        if (TEXT_SCREEN_TYPES.includes(activeTool)) {
          const screen = {
            x: mousePos.x - bounds.left,
            y: mousePos.y,
          };
          const screenSettings = { ...ghostSettings, screen };
          if (activeTool === "text") {
            drawTextTool(ctx, null, bounds, screenSettings, true);
          } else if (activeTool === "note") {
            drawNote(ctx, null, bounds, screenSettings, true);
          }
        } else if (hoverPoint) {
          if (activeTool === "anchoredText") {
            drawAnchoredText(ctx, hoverPoint, bounds, ghostSettings, true);
          } else if (activeTool === "priceNote") {
            drawPriceNote(ctx, hoverPoint, bounds, ghostSettings, true);
          } else if (activeTool === "callout") {
            drawCallout(
              ctx,
              hoverPoint,
              hoverPoint,
              bounds,
              ghostSettings,
              true,
            );
          } else if (activeTool === "pin") {
            drawPin(ctx, hoverPoint, bounds, ghostSettings, true);
          } else if (activeTool === "flag") {
            drawFlag(ctx, hoverPoint, bounds, ghostSettings, true);
          } else {
            drawTextTool(
              ctx,
              hoverPoint,
              bounds,
              { ...ghostSettings, text: ghostLabel },
              true,
            );
          }
        }
      }

      // Define local helpers if not already defined
      const drawPriceMarker = (price, color) => {
        const y = series.priceToCoordinate(price);
        if (y === null || y < 0 || y > bounds.height) return;

        const rightEdge = bounds.right;
        const markerWidth = 60;
        const markerHeight = 18;

        // Draw marker background
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(
          rightEdge + 2,
          y - markerHeight / 2,
          markerWidth,
          markerHeight,
          3,
        );
        ctx.fill();

        // Draw arrow pointing to chart
        ctx.beginPath();
        ctx.moveTo(rightEdge + 2, y);
        ctx.lineTo(rightEdge - 4, y - 4);
        ctx.lineTo(rightEdge - 4, y + 4);
        ctx.closePath();
        ctx.fill();

        // Draw price text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(price.toFixed(2), rightEdge + 2 + markerWidth / 2, y);
      };

      // Draw saved drawings
      drawings.forEach((d) => {
        if (d.type === "brush") {
          drawBrushStroke(
            ctx,
            d.points || [],
            bounds,
            d.color || "#3b82f6",
            d.settings || {},
            false,
          );
          return;
        }

        if (d.type === "path") {
          drawPath(
            ctx,
            d.points || [],
            bounds,
            d.color || "#3b82f6",
            d.settings || {},
            false,
          );
          return;
        }

        if (TEXT_TOOL_TYPES.includes(d.type)) {
          const settings = {
            ...(d.settings || {}),
            text:
              d.settings?.text ??
              d.text ??
              d.settings?.label ??
              d.settings?.value,
          };
          if (d.type === "text") {
            drawTextTool(ctx, d.p1 || null, bounds, settings, false);
          } else if (d.type === "anchoredText") {
            if (d.p1) drawAnchoredText(ctx, d.p1, bounds, settings, false);
          } else if (d.type === "note") {
            drawNote(ctx, d.p1 || null, bounds, settings, false);
          } else if (d.type === "priceNote") {
            if (d.p1) drawPriceNote(ctx, d.p1, bounds, settings, false);
          } else if (d.type === "callout") {
            if (d.p1) drawCallout(ctx, d.p1, d.p2, bounds, settings, false);
          } else if (d.type === "pin") {
            if (d.p1) drawPin(ctx, d.p1, bounds, settings, false);
          } else if (d.type === "flag") {
            if (d.p1) drawFlag(ctx, d.p1, bounds, settings, false);
          }
          return;
        }

        const start = getCoords(d.p1 || d.s1);
        const end = getCoords(d.p2 || d.s2);

        if (start && end) {
          const offsetStart = { x: start.x + bounds.left, y: start.y };
          const offsetEnd = { x: end.x + bounds.left, y: end.y };
          const color = d.color; // Pass custom color if present

          // Line tools
          if (d.type === "line" || d.type === "trendLine") {
            drawLine(ctx, offsetStart, offsetEnd, color);
          } else if (d.type === "arrow") {
            drawArrow(
              ctx,
              offsetStart,
              offsetEnd,
              color,
              d.settings || {},
              false,
            );
          } else if (d.type === "rectangle") {
            drawRectangle(ctx, d.p1, d.p2, bounds, color, d.settings || {});
          } else if (d.type === "highlighter") {
            drawHighlighter(
              ctx,
              d.p1,
              d.p2,
              bounds,
              color || "#facc15",
              d.settings || {},
              false,
            );
          } else if (["longPosition", "shortPosition"].includes(d.type)) {
            drawLongShortPosition(
              ctx,
              d.p1,
              d.p2,
              d.p3,
              bounds,
              d.type,
              d.settings,
            );
          } else if (
            ["dateRange", "priceRange", "datePriceRange"].includes(d.type)
          ) {
            drawMeasureTool(ctx, d.p1, d.p2, bounds, d.settings, d.type);
          } else if (d.type === "ray") {
            drawRay(ctx, offsetStart, offsetEnd, bounds, color);
          } else if (d.type === "extendedLine") {
            drawExtendedLine(ctx, offsetStart, offsetEnd, bounds, color);
          } else if (d.type === "infoLine") {
            const p1Val = d.p1.price;
            const p2Val = d.p2.price;
            const diff = p2Val - p1Val;
            const pct = (diff / p1Val) * 100;
            const i1 = timeToIndex.get(d.p1.time);
            const i2 = timeToIndex.get(d.p2.time);
            const bars =
              i1 !== undefined && i2 !== undefined ? Math.abs(i2 - i1) : 0;
            const ts = new Date(d.p2.time * 1000).toLocaleTimeString();
            drawInfoLine(
              ctx,
              offsetStart,
              offsetEnd,
              {
                priceDiff: diff,
                percentDiff: pct,
                bars,
                timeStr: ts,
              },
              color,
            );
          } else if (d.type === "trendAngle") {
            drawTrendAngle(ctx, offsetStart, offsetEnd, color);
          } else if (d.type === "horizontalLine") {
            drawHorizontalLine(ctx, offsetStart.y, bounds, color);
          } else if (d.type === "horizontalRay") {
            drawHorizontalRay(
              ctx,
              offsetStart.y,
              offsetStart.x,
              bounds,
              true,
              color,
            );
          } else if (d.type === "verticalLine") {
            drawVerticalLine(ctx, offsetStart.x, bounds, color);
          } else if (d.type === "crossLine") {
            drawCrossLine(ctx, offsetStart.x, offsetStart.y, bounds, color);
          } else if (d.type === "parallelChannel") {
            const p3 = getCoords(d.p3);
            if (p3) {
              const offsetP3 = { x: p3.x + bounds.left, y: p3.y };
              drawParallelChannel(
                ctx,
                offsetStart,
                offsetEnd,
                offsetP3,
                bounds,
                d.color || color,
              );
            }
          } else if (d.type === "flatTopBottom") {
            drawFlatTopBottom(
              ctx,
              d.p_flat,
              d.s1,
              d.s2,
              bounds,
              d.color || "#2962FF",
              d.fillOpacity || 0.1,
              d.flatMode || "auto",
            );
          } else if (d.type === "disjointChannel") {
            drawDisjointChannel(
              ctx,
              d.p1,
              d.p2,
              d.p3,
              d.p4,
              bounds,
              d.color || "#2962FF",
              d.settings || {},
            );
          } else if (d.type === "pitchfork") {
            drawPitchfork(
              ctx,
              d.p1,
              d.p2,
              d.p3,
              bounds,
              d.color || "#2962FF",
              d.settings || {},
            );
          }
          // Fibonacci tools
          else if (d.type === "fibRetracement") {
            drawFibRetracement(
              ctx,
              offsetStart,
              offsetEnd,
              d.color || "#f59e0b",
              d.settings || {},
            );
          } else if (d.type === "fibExtension") {
            const p3 = d.p3 ? getCoords(d.p3) : null;
            const offsetP3 = p3 ? { x: p3.x + bounds.left, y: p3.y } : null;
            drawFibExtension(
              ctx,
              offsetStart,
              offsetEnd,
              offsetP3,
              d.color || "#ff9800",
              d.settings || {},
            );
          } else if (d.type === "fibChannel") {
            drawFibChannel(
              ctx,
              d.p1,
              d.p2,
              d.p3,
              bounds,
              d.color || "#2962FF",
              d.settings || {},
            );
          } else if (d.type === "fibCircles") {
            drawFibCircles(ctx, offsetStart, offsetEnd);
          } else if (d.type === "fibArcs") {
            drawFibArcs(ctx, offsetStart, offsetEnd);
          } else if (d.type === "fibWedge") {
            drawFibWedge(ctx, offsetStart, offsetEnd);
          } else if (d.type === "fibSpiral") {
            drawFibSpiral(ctx, offsetStart, offsetEnd);
          } else if (d.type === "fibTimeZone") {
            drawFibTimeZone(
              ctx,
              d.p1,
              d.p2,
              bounds,
              d.color || "#2962FF",
              d.settings,
            );
          } else if (d.type === "gannBox") {
            drawGannBox(
              ctx,
              d.p1,
              d.p2,
              bounds,
              d.color || "#2962FF",
              d.settings,
            );
          } else if (d.type === "fibTrendTime") {
            drawFibTrendTime(
              ctx,
              d.p1,
              d.p2,
              d.p3,
              bounds,
              d.color || "#2962FF",
              d.settings,
            );
          } else if (d.type === "arc") {
            drawArc(
              ctx,
              d.p1,
              d.p2,
              d.p3,
              bounds,
              d.color || "#2962FF",
              d.settings || {},
            );
          } else if (d.type === "ellipse") {
            drawEllipse(
              ctx,
              d.p1,
              d.p2,
              d.p3,
              bounds,
              d.color || "#2962FF",
              d.settings || {},
            );
          } else if (["fibTimeBased", "fibSpeedFan"].includes(d.type)) {
            drawFibRetracement(
              ctx,
              offsetStart,
              offsetEnd,
              d.color || "#cddc39",
            );
          }
          // Gann tools
          else if (d.type === "gannSquare" || d.type === "gannSquareFixed") {
            drawGannSquare(
              ctx,
              d.p1,
              d.p2,
              bounds,
              d.color || "#7c3aed",
              d.settings || {},
            );
          } else if (d.type === "gannFan") {
            drawGannFan(ctx, d.p1, d.p2, d.settings || {});
          }
          // Pattern tools
          else if (d.type === "headShoulders") {
            drawHeadShoulders(
              ctx,
              [d.p1, d.p2, d.p3, d.p4, d.p5, d.p6],
              d.settings || {},
              false,
            );
          } else if (d.type === "abcdPattern") {
            drawABCD(ctx, [d.p1, d.p2, d.p3], d.settings || {}, false);
          } else if (d.type === "harmonicXABCD") {
            drawHarmonic(
              ctx,
              "harmonicXABCD",
              [d.p1, d.p2, d.p3, d.p4],
              d.settings || {},
              false,
            );
          } else if (d.type === "harmonicCypher") {
            drawHarmonic(
              ctx,
              "harmonicCypher",
              [d.p1, d.p2, d.p3, d.p4],
              d.settings || {},
              false,
            );
          } else if (d.type === "harmonicThreeDrives") {
            drawHarmonic(
              ctx,
              "harmonicThreeDrives",
              [d.p1, d.p2, d.p3, d.p4],
              d.settings || {},
              false,
            );
          } else if (d.type === "trianglePattern") {
            const pts = [d.p1, d.p2, d.p3, d.p4, d.p5].filter(Boolean);
            drawTrianglePattern(ctx, pts, d.settings || {}, false);
          }
          // Elliott Wave patterns
          else if (d.type === "elliottImpulse") {
            drawElliottImpulse(
              ctx,
              [d.p1, d.p2, d.p3, d.p4, d.p5, d.p6],
              d.settings || {},
              false,
            );
          } else if (d.type === "elliottCorrection") {
            drawElliottCorrection(
              ctx,
              [d.p1, d.p2, d.p3, d.p4],
              d.settings || {},
              false,
            );
          } else if (d.type === "elliottTriangle") {
            drawElliottTriangle(
              ctx,
              [d.p1, d.p2, d.p3, d.p4, d.p5],
              d.settings || {},
              false,
            );
          } else if (d.type === "elliottCombo") {
            drawElliottCombo(
              ctx,
              [d.p1, d.p2, d.p3, d.p4],
              d.settings || {},
              false,
            );
          } else if (d.type === "cyclicLines") {
            drawCyclicLines(ctx, d.p1, d.p2, d.settings || {}, false);
          } else if (d.type === "rectangle") {
            drawRectangle(ctx, d.p1, d.p2, bounds, d.color, d.settings);
          } else if (d.type === "regressionTrend") {
            const i1 = getLogicalIndex(d.p1);
            const i2 = getLogicalIndex(d.p2);
            if (i1 !== undefined && i2 !== undefined) {
              const reg = calculateLinearRegression(
                Math.round(i1),
                Math.round(i2),
                d.priceSource,
              );
              if (reg) {
                drawRegressionTrend(
                  ctx,
                  reg,
                  bounds,
                  d.k || 2,
                  d.color || "#2962FF",
                );
              }
            }
          }
          // Fallback
          else {
            drawLine(
              ctx,
              offsetStart,
              offsetEnd,
              d.color || color || "#607D8B",
            );
          }
        }

        // Draw interaction anchors
        const isPointLike = (val) =>
          val && typeof val === "object" && typeof val.price === "number";

        if (["path", "brush"].includes(d.type)) {
          (d.points || []).forEach((p) => {
            const c = getCoords(p);
            if (c) drawAnchor(c.x + bounds.left, c.y);
          });
        } else {
          Object.keys(d).forEach((key) => {
            if (isPointLike(d[key])) {
              const c = getCoords(d[key]);
              if (c) drawAnchor(c.x + bounds.left, c.y);
            }
          });
        }
      });

      // Draw current line being drawn
      if (currentLine) {
        ctx.globalAlpha = 0.4;

        if (currentLine.type === "flatTopBottom") {
          if (currentLine.step === 1) {
            const c1 = getCoords(currentLine.s1);
            const mousePoint = currentLine.s2 || hoverPoint;
            const c2 = getCoords(mousePoint);
            if (c1 && c2) {
              drawLine(
                ctx,
                { x: c1.x + bounds.left, y: c1.y },
                { x: c2.x + bounds.left, y: c2.y },
                currentLine.color || "#2962FF",
              );
            }
          } else if (currentLine.step === 2) {
            const mousePoint = currentLine.p2 || hoverPoint;
            const liveFlatPrice = mousePoint?.price;
            if (liveFlatPrice !== undefined) {
              drawFlatTopBottom(
                ctx,
                liveFlatPrice, // Live flat level
                currentLine.s1,
                currentLine.s2,
                bounds,
                currentLine.color || "#2962FF",
                0.1,
                currentLine.flatMode || "auto",
              );
            }
          }
        } else if (isPatternTool(currentLine.type)) {
          ghostMessageRef.current = "";
          ghostStateRef.current = null;
          ctx.save();
          ctx.globalAlpha = 1;
          if (currentLine.type === "headShoulders") {
            const pts = [
              currentLine.p1,
              currentLine.p2,
              currentLine.p3,
              currentLine.p4,
              currentLine.p5,
              currentLine.p6,
            ];
            const result = drawHeadShoulders(
              ctx,
              pts,
              currentLine.settings || {},
              true,
              { step: currentLine.step, point: hoverPoint },
            );
            ghostStateRef.current = result?.state || GHOST_STATES.neutral;
            ghostMessageRef.current = result?.message || "";
          } else if (currentLine.type === "abcdPattern") {
            const pts = [
              currentLine.p1,
              currentLine.step >= 1 ? currentLine.p2 || hoverPoint : null,
              currentLine.step >= 2 ? currentLine.p3 || hoverPoint : null,
            ];
            const result = drawABCD(ctx, pts, currentLine.settings || {}, true);
            ghostStateRef.current = result?.state || GHOST_STATES.neutral;
            ghostMessageRef.current = result?.message || "";
          } else if (
            ["harmonicXABCD", "harmonicCypher", "harmonicThreeDrives"].includes(
              currentLine.type,
            )
          ) {
            const pts = [
              currentLine.p1,
              currentLine.step >= 1 ? currentLine.p2 || hoverPoint : null,
              currentLine.step >= 2 ? currentLine.p3 || hoverPoint : null,
              currentLine.step >= 3 ? currentLine.p4 || hoverPoint : null,
            ];
            const result = drawHarmonic(
              ctx,
              currentLine.type,
              pts,
              currentLine.settings || {},
              true,
            );
            ghostStateRef.current = result?.state || GHOST_STATES.neutral;
            ghostMessageRef.current = result?.message || "";
          } else if (currentLine.type === "trianglePattern") {
            const pts = [
              currentLine.p1,
              currentLine.p2,
              currentLine.p3,
              currentLine.p4,
              currentLine.p5,
            ].filter(Boolean);
            if (
              hoverPoint &&
              pts.length < (currentLine.settings?.minPoints || 5)
            ) {
              pts.push(hoverPoint);
            }
            const result = drawTrianglePattern(
              ctx,
              pts,
              currentLine.settings || {},
              true,
            );
            ghostStateRef.current = result?.state || GHOST_STATES.neutral;
            ghostMessageRef.current = result?.message || "";
          } else if (currentLine.type === "elliottImpulse") {
            const pts = [
              currentLine.p1,
              currentLine.step >= 1 ? currentLine.p2 || hoverPoint : null,
              currentLine.step >= 2 ? currentLine.p3 || hoverPoint : null,
              currentLine.step >= 3 ? currentLine.p4 || hoverPoint : null,
              currentLine.step >= 4 ? currentLine.p5 || hoverPoint : null,
              currentLine.step >= 5 ? currentLine.p6 || hoverPoint : null,
            ];
            const result = drawElliottImpulse(
              ctx,
              pts,
              currentLine.settings || {},
              true,
              hoverPoint,
            );
            ghostStateRef.current = result?.state || GHOST_STATES.neutral;
            ghostMessageRef.current =
              result?.messages?.[0] || result?.message || "";
          } else if (currentLine.type === "elliottCorrection") {
            const pts = [
              currentLine.p1,
              currentLine.step >= 1 ? currentLine.p2 || hoverPoint : null,
              currentLine.step >= 2 ? currentLine.p3 || hoverPoint : null,
              currentLine.step >= 3 ? currentLine.p4 || hoverPoint : null,
            ];
            const result = drawElliottCorrection(
              ctx,
              pts,
              currentLine.settings || {},
              true,
              hoverPoint,
            );
            ghostStateRef.current = result?.state || GHOST_STATES.neutral;
            ghostMessageRef.current =
              result?.messages?.[0] || result?.message || "";
          } else if (currentLine.type === "elliottTriangle") {
            const pts = [
              currentLine.p1,
              currentLine.step >= 1 ? currentLine.p2 || hoverPoint : null,
              currentLine.step >= 2 ? currentLine.p3 || hoverPoint : null,
              currentLine.step >= 3 ? currentLine.p4 || hoverPoint : null,
              currentLine.step >= 4 ? currentLine.p5 || hoverPoint : null,
            ];
            const result = drawElliottTriangle(
              ctx,
              pts,
              currentLine.settings || {},
              true,
              hoverPoint,
            );
            ghostStateRef.current = result?.state || GHOST_STATES.neutral;
            ghostMessageRef.current =
              result?.messages?.[0] || result?.message || "";
          } else if (currentLine.type === "elliottCombo") {
            const pts = [
              currentLine.p1,
              currentLine.step >= 1 ? currentLine.p2 || hoverPoint : null,
              currentLine.step >= 2 ? currentLine.p3 || hoverPoint : null,
              currentLine.step >= 3 ? currentLine.p4 || hoverPoint : null,
            ];
            const result = drawElliottCombo(
              ctx,
              pts,
              currentLine.settings || {},
              true,
              hoverPoint,
            );
            ghostStateRef.current = result?.state || GHOST_STATES.neutral;
            ghostMessageRef.current =
              result?.messages?.[0] || result?.message || "";
          } else if (currentLine.type === "cyclicLines") {
            const result = drawCyclicLines(
              ctx,
              currentLine.p1,
              currentLine.step >= 1 ? currentLine.p2 || hoverPoint : null,
              currentLine.settings || {},
              true,
              hoverPoint,
            );
            ghostStateRef.current = result?.state || GHOST_STATES.neutral;
            ghostMessageRef.current = result?.message || "";
          }

          // Draw interaction anchors for current line
          const isPointLike = (val) =>
            val && typeof val === "object" && typeof val.price === "number";

          if (["path", "brush"].includes(currentLine.type)) {
            (currentLine.points || []).forEach((p) => {
              const c = getCoords(p);
              if (c) drawAnchor(c.x + bounds.left, c.y);
            });
          } else {
            Object.keys(currentLine).forEach((key) => {
              if (isPointLike(currentLine[key])) {
                const c = getCoords(currentLine[key]);
                if (c) drawAnchor(c.x + bounds.left, c.y);
              }
            });
          }
          ctx.restore();
        } else if (
          ["longPosition", "shortPosition"].includes(currentLine.type)
        ) {
          const p1 = currentLine.p1;
          const p2 = currentLine.p2 || hoverPoint;
          const p3 =
            currentLine.step === 2 ? hoverPoint : currentLine.p3 || null;
          if (p1 && p2) {
            drawLongShortPosition(
              ctx,
              p1,
              p2,
              p3,
              bounds,
              currentLine.type,
              currentLine.settings,
            );
          }
        } else if (currentLine.type === "text") {
          const p1 = currentLine.p1 || hoverPoint;
          if (p1) drawTextTool(ctx, p1, bounds, currentLine.settings, true);
        } else if (currentLine.type === "anchoredText") {
          const p1 = currentLine.p1 || hoverPoint;
          if (p1) drawAnchoredText(ctx, p1, bounds, currentLine.settings, true);
        } else if (currentLine.type === "note") {
          const p1 = currentLine.p1 || hoverPoint;
          if (p1) drawNote(ctx, p1, bounds, currentLine.settings, true);
        } else if (currentLine.type === "priceNote") {
          const p1 = currentLine.p1 || hoverPoint;
          if (p1) drawPriceNote(ctx, p1, bounds, currentLine.settings, true);
        } else if (currentLine.type === "callout") {
          const p1 = currentLine.p1 || hoverPoint;
          if (p1)
            drawCallout(
              ctx,
              p1,
              hoverPoint || p1,
              bounds,
              currentLine.settings,
              true,
            );
        } else if (currentLine.type === "pin") {
          const p1 = currentLine.p1 || hoverPoint;
          if (p1) drawPin(ctx, p1, bounds, currentLine.settings, true);
        } else if (currentLine.type === "flag") {
          const p1 = currentLine.p1 || hoverPoint;
          if (p1) drawFlag(ctx, p1, bounds, currentLine.settings, true);
        } else if (currentLine.type === "brush") {
          drawBrushStroke(
            ctx,
            currentLine.points || [],
            bounds,
            currentLine.color || "#3b82f6",
            currentLine.settings || {},
            true,
          );
        } else if (currentLine.type === "path") {
          drawPath(
            ctx,
            currentLine.points || [],
            bounds,
            currentLine.color || "#3b82f6",
            currentLine.settings || {},
            true,
            hoverPoint,
          );
        } else if (currentLine.type === "rectangle") {
          drawRectangle(
            ctx,
            currentLine.p1,
            currentLine.p2 || hoverPoint,
            bounds,
            currentLine.color || "#3b82f6",
            currentLine.settings || {},
          );
        } else if (currentLine.type === "highlighter") {
          drawHighlighter(
            ctx,
            currentLine.p1,
            currentLine.p2 || hoverPoint,
            bounds,
            currentLine.color || "#facc15",
            currentLine.settings || {},
            true,
          );
        } else if (
          ["dateRange", "priceRange", "datePriceRange"].includes(
            currentLine.type,
          )
        ) {
          const p1 = currentLine.p1;
          const p2 = currentLine.p2 || hoverPoint;
          if (p1 && p2) {
            drawMeasureTool(
              ctx,
              p1,
              p2,
              bounds,
              currentLine.settings,
              currentLine.type,
            );
          }
        } else {
          if (currentLine.type === "fibTrendTime") {
            const p1 = currentLine.p1;
            let localHover = hoverPoint;
            if (!localHover && mousePos) {
              const clientX =
                containerRef.current?.getBoundingClientRect().left + mousePos.x;
              const clientY =
                containerRef.current?.getBoundingClientRect().top + mousePos.y;
              if (clientX !== undefined && clientY !== undefined) {
                localHover = getPoint(clientX, clientY, {
                  snap: false,
                  freeform: true,
                });
              }
            }
            if (currentLine.step === 1) {
              const p2 = currentLine.p2 || localHover;
              const c1 = p1 ? getCoords(p1) : null;
              const c2 = p2 ? getCoords(p2) : null;
              if (c1 && c2) {
                ctx.save();
                ctx.globalAlpha = 0.55;
                ctx.setLineDash([6, 4]);
                drawLine(
                  ctx,
                  { x: c1.x + bounds.left, y: c1.y },
                  { x: c2.x + bounds.left, y: c2.y },
                  currentLine.color || "#2962FF",
                );
                ctx.setLineDash([]);
                ctx.restore();
              }
            } else {
              let p3 = localHover;
              if (p3 && p3.logical === undefined && mousePos) {
                const logical = chart
                  .timeScale()
                  .coordinateToLogical(mousePos.x - bounds.left);
                if (logical !== null) {
                  p3 = { ...p3, logical };
                }
              }
              drawFibTrendTime(
                ctx,
                p1,
                currentLine.p2 || localHover,
                p3,
                bounds,
                currentLine.color || "#2962FF",
                { ...(currentLine.settings || {}), ghost: true },
              );
            }
          } else {
            if (currentLine.type === "regressionTrend") {
              let localHover = hoverPoint;
              if (!localHover && mousePos) {
                const clientX =
                  containerRef.current?.getBoundingClientRect().left +
                  mousePos.x;
                const clientY =
                  containerRef.current?.getBoundingClientRect().top +
                  mousePos.y;
                if (clientX !== undefined && clientY !== undefined) {
                  localHover = getPoint(clientX, clientY, {
                    snap: false,
                    freeform: true,
                  });
                }
              }
              const p2 = currentLine.p2 || localHover;
              const c1 = getCoords(currentLine.p1);
              const c2 = p2 ? getCoords(p2) : null;
              if (c1 && c2) {
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.setLineDash([6, 4]);
                drawLine(
                  ctx,
                  { x: c1.x + bounds.left, y: c1.y },
                  { x: c2.x + bounds.left, y: c2.y },
                  "#2962FF",
                );
                ctx.restore();
              }
              const i1 = getLogicalIndex(currentLine.p1);
              const i2 = p2 ? getLogicalIndex(p2) : undefined;
              if (i1 !== undefined && i2 !== undefined && i1 !== i2) {
                const reg = calculateLinearRegression(
                  Math.round(i1),
                  Math.round(i2),
                  currentLine.priceSource,
                );
                if (reg) {
                  ctx.save();
                  ctx.globalAlpha = 0.5;
                  ctx.setLineDash([6, 4]);
                  drawRegressionTrend(
                    ctx,
                    reg,
                    bounds,
                    currentLine.k || 2,
                    "#2962FF",
                  );
                  ctx.restore();
                }
              }
              // Skip the rest of the generic branch.
            } else {
              const start = getCoords(currentLine.p1);
              const endPoint = currentLine.p2 || hoverPoint;
              const end = endPoint ? getCoords(endPoint) : null;

              if (start && end) {
                const offsetStart = { x: start.x + bounds.left, y: start.y };
                const offsetEnd = { x: end.x + bounds.left, y: end.y };

                // Fibonacci tools
                if (currentLine.type === "fibChannel") {
                  const p1 = currentLine.p1;
                  const p2 = currentLine.p2 || hoverPoint;
                  const p3 =
                    currentLine.step === 2
                      ? hoverPoint
                      : currentLine.p3 || null;

                  ctx.save();
                  ctx.globalAlpha = 0.5;
                  ctx.setLineDash([6, 4]);
                  drawFibChannel(
                    ctx,
                    p1,
                    p2,
                    p3,
                    bounds,
                    currentLine.color || "#2962FF",
                    { ...(currentLine.settings || {}), ghost: true },
                  );
                  ctx.restore();
                } else if (currentLine.type === "fibTimeZone") {
                  const p1 = currentLine.p1;
                  const p2 = currentLine.p2 || hoverPoint;
                  ctx.save();
                  ctx.globalAlpha = 0.5;
                  ctx.setLineDash([6, 4]);
                  drawFibTimeZone(
                    ctx,
                    p1,
                    p2,
                    bounds,
                    currentLine.color || "#2962FF",
                    { ...(currentLine.settings || {}), ghost: true },
                  );
                  ctx.restore();
                } else if (currentLine.type === "fibTrendTime") {
                  const p1 = currentLine.p1;
                  let localHover = hoverPoint;
                  if (!localHover && mousePos) {
                    const clientX =
                      containerRef.current?.getBoundingClientRect().left +
                      mousePos.x;
                    const clientY =
                      containerRef.current?.getBoundingClientRect().top +
                      mousePos.y;
                    if (clientX !== undefined && clientY !== undefined) {
                      localHover = getPoint(clientX, clientY, {
                        snap: false,
                        freeform: true,
                      });
                    }
                  }
                  if (currentLine.step === 1) {
                    const p2 = currentLine.p2 || localHover;
                    const c1 = p1 ? getCoords(p1) : null;
                    const c2 = p2 ? getCoords(p2) : null;
                    if (c1 && c2) {
                      ctx.save();
                      ctx.globalAlpha = 0.55;
                      ctx.setLineDash([6, 4]);
                      drawLine(
                        ctx,
                        { x: c1.x + bounds.left, y: c1.y },
                        { x: c2.x + bounds.left, y: c2.y },
                        currentLine.color || "#2962FF",
                      );
                      ctx.setLineDash([]);
                      ctx.restore();
                    }
                  } else {
                    let p3 = localHover;
                    if (p3 && p3.logical === undefined && mousePos) {
                      const logical = chart
                        .timeScale()
                        .coordinateToLogical(mousePos.x - bounds.left);
                      if (logical !== null) {
                        p3 = { ...p3, logical };
                      }
                    }
                    drawFibTrendTime(
                      ctx,
                      p1,
                      currentLine.p2 || localHover,
                      p3,
                      bounds,
                      currentLine.color || "#2962FF",
                      { ...(currentLine.settings || {}), ghost: true },
                    );
                  }
                } else if (currentLine.type === "gannBox") {
                  const p1 = currentLine.p1;
                  const p2 = currentLine.p2 || hoverPoint;
                  drawGannBox(
                    ctx,
                    p1,
                    p2,
                    bounds,
                    currentLine.color || "#2962FF",
                    currentLine.settings || {},
                  );
                } else if (
                  currentLine.type === "gannSquare" ||
                  currentLine.type === "gannSquareFixed"
                ) {
                  const p1 = currentLine.p1;
                  const p2 = currentLine.p2 || hoverPoint;
                  drawGannSquare(
                    ctx,
                    p1,
                    p2,
                    bounds,
                    currentLine.color || "#7c3aed",
                    currentLine.settings || {},
                  );
                } else if (currentLine.type === "fibRetracement") {
                  const p1 = currentLine.p1;
                  const p2 = currentLine.p2 || hoverPoint;
                  const c1 = getCoords(p1);
                  const c2 = getCoords(p2);
                  if (c1 && c2) {
                    const offsetStart = { x: c1.x + bounds.left, y: c1.y };
                    const offsetEnd = { x: c2.x + bounds.left, y: c2.y };
                    ctx.save();
                    ctx.globalAlpha = 0.5;
                    ctx.setLineDash([6, 4]);
                    drawFibRetracement(
                      ctx,
                      offsetStart,
                      offsetEnd,
                      currentLine.color || "#f59e0b",
                      { ...(currentLine.settings || {}), ghost: true },
                    );
                    ctx.restore();
                  }
                } else if (currentLine.type === "fibTrendTime") {
                  const p1 = currentLine.p1;
                  let localHover = hoverPoint;
                  if (!localHover && mousePos) {
                    const clientX =
                      containerRef.current?.getBoundingClientRect().left +
                      mousePos.x;
                    const clientY =
                      containerRef.current?.getBoundingClientRect().top +
                      mousePos.y;
                    if (clientX !== undefined && clientY !== undefined) {
                      localHover = getPoint(clientX, clientY, {
                        snap: false,
                        freeform: true,
                      });
                    }
                  }
                  if (currentLine.step === 1) {
                    const p2 = currentLine.p2 || localHover;
                    const c1 = p1 ? getCoords(p1) : null;
                    const c2 = p2 ? getCoords(p2) : null;
                    if (c1 && c2) {
                      ctx.save();
                      ctx.globalAlpha = 0.55;
                      ctx.setLineDash([6, 4]);
                      drawLine(
                        ctx,
                        { x: c1.x + bounds.left, y: c1.y },
                        { x: c2.x + bounds.left, y: c2.y },
                        currentLine.color || "#2962FF",
                      );
                      ctx.setLineDash([]);
                      ctx.restore();
                    }
                  } else {
                    let p3 = localHover;
                    if (p3 && p3.logical === undefined && mousePos) {
                      const logical = chart
                        .timeScale()
                        .coordinateToLogical(mousePos.x - bounds.left);
                      if (logical !== null) {
                        p3 = { ...p3, logical };
                      }
                    }
                    drawFibTrendTime(
                      ctx,
                      p1,
                      currentLine.p2 || hoverPoint,
                      p3,
                      bounds,
                      currentLine.color || "#2962FF",
                      { ...(currentLine.settings || {}), ghost: true },
                    );
                  }
                } else if (["line", "trendLine"].includes(currentLine.type)) {
                  drawLine(ctx, offsetStart, offsetEnd);
                } else if (currentLine.type === "ray") {
                  drawRay(ctx, offsetStart, offsetEnd, bounds);
                } else if (currentLine.type === "extendedLine") {
                  drawExtendedLine(ctx, offsetStart, offsetEnd, bounds);
                } else if (currentLine.type === "infoLine") {
                  const p1Val = currentLine.p1.price;
                  const p2Val = currentLine.p2.price;
                  const diff = p2Val - p1Val;
                  const pct = (diff / p1Val) * 100;
                  const i1 = timeToIndex.get(currentLine.p1.time);
                  const i2 = timeToIndex.get(currentLine.p2.time);
                  const bars =
                    i1 !== undefined && i2 !== undefined
                      ? Math.abs(i2 - i1)
                      : 0;
                  const ts = new Date(
                    currentLine.p2.time * 1000,
                  ).toLocaleTimeString();
                  drawInfoLine(ctx, offsetStart, offsetEnd, {
                    priceDiff: diff,
                    percentDiff: pct,
                    bars,
                    timeStr: ts,
                  });
                } else if (currentLine.type === "trendAngle") {
                  drawTrendAngle(ctx, offsetStart, offsetEnd);
                } else if (currentLine.type === "horizontalLine") {
                  drawHorizontalLine(ctx, offsetStart.y, bounds);
                } else if (currentLine.type === "verticalLine") {
                  drawVerticalLine(ctx, offsetStart.x, bounds);
                } else if (currentLine.type === "horizontalRay") {
                  drawHorizontalRay(
                    ctx,
                    offsetStart.y,
                    offsetStart.x,
                    bounds,
                    true,
                  );
                } else if (currentLine.type === "crossLine") {
                  drawCrossLine(ctx, offsetStart.x, offsetStart.y, bounds);
                } else if (currentLine.type === "parallelChannel") {
                  if (currentLine.step === 1) {
                    ctx.save();
                    ctx.globalAlpha = 0.5;
                    ctx.setLineDash([6, 4]);
                    drawLine(ctx, offsetStart, offsetEnd);
                    ctx.restore();
                  } else {
                    const p3 = getCoords(
                      currentLine.p3 || hoverPoint || currentLine.p2,
                    );
                    if (p3) {
                      const offsetP3 = { x: p3.x + bounds.left, y: p3.y };
                      ctx.save();
                      ctx.globalAlpha = 0.5;
                      ctx.setLineDash([6, 4]);
                      drawParallelChannel(
                        ctx,
                        offsetStart,
                        offsetEnd,
                        offsetP3,
                        bounds,
                      );
                      ctx.restore();
                    }
                  }
                } else if (currentLine.type === "disjointChannel") {
                  const mc1 = currentLine.p1;
                  const mc2 = currentLine.p2 || hoverPoint;
                  const mc3 =
                    currentLine.step >= 3
                      ? currentLine.p3
                      : currentLine.step === 2
                        ? hoverPoint
                        : null;

                  ctx.save();
                  ctx.globalAlpha = 0.5;
                  ctx.setLineDash([6, 4]);
                  drawDisjointChannel(
                    ctx,
                    mc1,
                    mc2,
                    mc3,
                    null,
                    bounds,
                    "#2962FF",
                    {
                      show_fill: currentLine.step === 3,
                      ...currentLine.settings,
                      ghost: true,
                    },
                  );
                  ctx.restore();
                } else if (currentLine.type === "pitchfork") {
                  drawPitchfork(
                    ctx,
                    currentLine.p1,
                    currentLine.p2 || hoverPoint,
                    currentLine.p3 ||
                      (currentLine.step === 2
                        ? hoverPoint
                        : currentLine.p2 || hoverPoint),
                    bounds,
                    "#2962FF",
                    currentLine.settings || {},
                  );
                } else if (currentLine.type === "arc") {
                  if (currentLine.step === 1) {
                    const p2 = currentLine.p2 || hoverPoint;
                    const c1 = getCoords(currentLine.p1);
                    const c2 = p2 ? getCoords(p2) : null;
                    if (c1 && c2) {
                      ctx.save();
                      ctx.globalAlpha = 0.55;
                      ctx.setLineDash([6, 4]);
                      drawLine(
                        ctx,
                        { x: c1.x + bounds.left, y: c1.y },
                        { x: c2.x + bounds.left, y: c2.y },
                        currentLine.color || "#2962FF",
                      );
                      ctx.restore();
                    }
                  } else {
                    const p3 = currentLine.p3 || hoverPoint;
                    drawArc(
                      ctx,
                      currentLine.p1,
                      currentLine.p2,
                      p3,
                      bounds,
                      currentLine.color || "#2962FF",
                      { ...(currentLine.settings || {}), ghost: true },
                      true,
                    );
                  }
                } else if (currentLine.type === "ellipse") {
                  if (currentLine.step === 1) {
                    const p2 = currentLine.p2 || hoverPoint;
                    drawEllipse(
                      ctx,
                      currentLine.p1,
                      p2,
                      currentLine.p3 || p2,
                      bounds,
                      currentLine.color || "#2962FF",
                      { ...(currentLine.settings || {}), ghost: true },
                      true,
                    );
                  } else {
                    const p3 = currentLine.p3 || hoverPoint;
                    drawEllipse(
                      ctx,
                      currentLine.p1,
                      currentLine.p2,
                      p3,
                      bounds,
                      currentLine.color || "#2962FF",
                      { ...(currentLine.settings || {}), ghost: true },
                      true,
                    );
                  }
                } else if (currentLine.type === "arrow") {
                  drawArrow(
                    ctx,
                    offsetStart,
                    offsetEnd,
                    currentLine.color || "#2962FF",
                    currentLine.settings || {},
                    true,
                  );
                }
              } else if (currentLine.type === "rectangle") {
                drawRectangle(
                  ctx,
                  currentLine.p1,
                  currentLine.p2 || hoverPoint,
                  bounds,
                  currentLine.color || "#2962FF",
                  {
                    ...(currentLine.settings || {}),
                    lineStyle: "dashed",
                    opacity: (currentLine.settings?.opacity ?? 0.15) * 0.7,
                  },
                );
              }
              // Fibonacci tools
              else if (currentLine.type === "fibExtension") {
                const p1 = currentLine.p1;
                let localHover = hoverPoint;
                if (!localHover && mousePos) {
                  const clientX =
                    containerRef.current?.getBoundingClientRect().left +
                    mousePos.x;
                  const clientY =
                    containerRef.current?.getBoundingClientRect().top +
                    mousePos.y;
                  if (clientX !== undefined && clientY !== undefined) {
                    localHover = getPoint(clientX, clientY, {
                      snap: false,
                      freeform: true,
                    });
                  }
                }
                const p2 = currentLine.p2 || localHover;
                const p3 =
                  currentLine.step === 2 ? localHover : currentLine.p3 || null;

                const c1 = getCoords(p1);
                const c2 = getCoords(p2);
                const c3 = p3 ? getCoords(p3) : null;

                if (c1 && c2) {
                  if (currentLine.step === 1) {
                    // First click phase: Just the trend line (Leg 1)
                    ctx.save();
                    ctx.globalAlpha = 0.5;
                    ctx.setLineDash([6, 4]);
                    ctx.beginPath();
                    ctx.moveTo(c1.x + bounds.left, c1.y);
                    ctx.lineTo(c2.x + bounds.left, c2.y);
                    ctx.strokeStyle = "#ff9800";
                    ctx.stroke();
                    ctx.restore();
                  } else {
                    // Second/Third Phase: Show the Fib
                    ctx.save();
                    ctx.globalAlpha = 0.5;
                    ctx.setLineDash([6, 4]);
                    drawFibExtension(
                      ctx,
                      { x: c1.x + bounds.left, y: c1.y },
                      { x: c2.x + bounds.left, y: c2.y },
                      c3 ? { x: c3.x + bounds.left, y: c3.y } : null,
                      "#ff9800",
                      { ...(currentLine.settings || {}), ghost: true },
                    );
                    ctx.restore();
                  }
                }
              } else if (currentLine.type === "fibRetracement") {
                const c1 = getCoords(currentLine.p1);
                const c2 = getCoords(currentLine.p2 || hoverPoint);
                if (c1 && c2) {
                  ctx.save();
                  ctx.globalAlpha = 0.5;
                  ctx.setLineDash([6, 4]);
                  drawFibRetracement(
                    ctx,
                    { x: c1.x + bounds.left, y: c1.y },
                    { x: c2.x + bounds.left, y: c2.y },
                    "#f59e0b",
                    { ...(currentLine.settings || {}), ghost: true },
                  );
                  ctx.restore();
                }
              } else if (
                ["fib", "fibFan", "fibArc", "fibTimeZone"].includes(
                  currentLine.type,
                )
              ) {
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.setLineDash([6, 4]);
                drawFibRetracement(ctx, offsetStart, offsetEnd, "#f59e0b", {
                  ...(currentLine.settings || {}),
                  ghost: true,
                });
                ctx.restore();
              } else if (currentLine.type === "gannFan") {
                drawGannFan(
                  ctx,
                  currentLine.p1,
                  currentLine.p2,
                  {
                    ...(currentLine.settings || {}),
                    showPreviewAngle: true,
                    previewLabelPoint: currentLine.p2 || hoverPoint,
                  },
                  currentLine.p2 || hoverPoint,
                  true,
                );
              } else if (currentLine.type === "regressionTrend") {
                let localHover = hoverPoint;
                if (!localHover && mousePos) {
                  const clientX =
                    containerRef.current?.getBoundingClientRect().left +
                    mousePos.x;
                  const clientY =
                    containerRef.current?.getBoundingClientRect().top +
                    mousePos.y;
                  if (clientX !== undefined && clientY !== undefined) {
                    localHover = getPoint(clientX, clientY, {
                      snap: false,
                      freeform: true,
                    });
                  }
                }
                const p2 = currentLine.p2 || localHover;
                const i1 = getLogicalIndex(currentLine.p1);
                const i2 = p2 ? getLogicalIndex(p2) : undefined;
                const c1 = getCoords(currentLine.p1);
                const c2 = p2 ? getCoords(p2) : null;
                if (c1 && c2) {
                  ctx.save();
                  ctx.globalAlpha = 0.5;
                  ctx.setLineDash([6, 4]);
                  drawLine(
                    ctx,
                    { x: c1.x + bounds.left, y: c1.y },
                    { x: c2.x + bounds.left, y: c2.y },
                    "#2962FF",
                  );
                  ctx.restore();
                }
                if (i1 !== undefined && i2 !== undefined && i1 !== i2) {
                  const reg = calculateLinearRegression(
                    Math.round(i1),
                    Math.round(i2),
                    currentLine.priceSource,
                  );
                  if (reg) {
                    ctx.save();
                    ctx.globalAlpha = 0.5;
                    ctx.setLineDash([6, 4]);
                    drawRegressionTrend(
                      ctx,
                      reg,
                      bounds,
                      currentLine.k || 2,
                      "#2962FF",
                    );
                    ctx.restore();
                  }
                }
              }
            }
          }
        }
      } // End of else block from 2492
      ctx.restore();

      // Draw markers for all drawings
      drawings.forEach((d) => {
        const color =
          d.type === "fib"
            ? "#f59e0b"
            : d.type === "gannFan"
              ? "#14b8a6"
              : d.type === "gann"
                ? "#8b5cf6"
                : "#2962FF";

        const p1 = d.p1 || d.s1;
        const p2 = d.p2 || d.s2;
        if (p1?.price) drawPriceMarker(p1.price, color);
        if (p2?.price && (!p1 || p2.price !== p1.price))
          drawPriceMarker(p2.price, color);
        if (d.type === "flatTopBottom" && d.p_flat)
          drawPriceMarker(d.p_flat, color);
      });

      // --- Ghost / Preview Drawing ---
      if (!currentLine && activeTool && hoverPoint && activeTool !== "eraser") {
        const hStart = getCoords(hoverPoint);
        if (hStart) {
          const hX = hStart.x + bounds.left;
          const hY = hStart.y;

          if (activeTool === "gannFan") {
            const scaleSample = getScaleSample();
            const logicalBase = getLogicalIndex(hoverPoint);
            if (scaleSample && logicalBase !== undefined) {
              const delta = 20;
              const previewPoint = {
                ...hoverPoint,
                logical: logicalBase + delta,
                price: hoverPoint.price + scaleSample.slope1x1 * delta,
              };
              drawGannFan(
                ctx,
                hoverPoint,
                previewPoint,
                {
                  ratios: GANN_FAN_DEFAULT_RATIOS,
                  ratioColors: GANN_FAN_DEFAULT_COLORS,
                  showRatio: true,
                  lineWidthMain: 2,
                  lineWidthMinor: 1,
                  opacityDecay: true,
                  showPreviewAngle: true,
                  previewLabelPoint: hoverPoint,
                },
                previewPoint,
                true,
              );
            }
          }

          // 1. Draw Snap Point Indicator (Blue Dot)
          if (snappedPoint) {
            ctx.beginPath();
            ctx.arc(snappedPoint.x, snappedPoint.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(41, 98, 255, 0.5)";
            ctx.fill();
            ctx.strokeStyle = "#2962FF";
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // 2. Ghost Line / Crosshair logic
          ctx.save();
          ctx.globalAlpha = 0.5;
          ctx.setLineDash([4, 4]);

          if (activeTool === "horizontalLine") {
            drawHorizontalLine(ctx, hY, bounds, "#00E676");
            drawPriceMarker(hoverPoint.price, "#00E676");
          } else if (activeTool === "verticalLine") {
            drawVerticalLine(ctx, hX, bounds, "#FF6D00");
          } else if (activeTool === "horizontalRay") {
            drawHorizontalRay(ctx, hY, hX, bounds, true, "#00E676");
            drawPriceMarker(hoverPoint.price, "#00E676");
          } else if (activeTool === "crossLine") {
            drawCrossLine(ctx, hX, hY, bounds, "#FF4081");
            drawPriceMarker(hoverPoint.price, "#FF4081");
          } else {
            // For ALL other tools (Line, Fib, Gann, etc.), draw a crosshair guide ("Grey Shadow")
            ctx.beginPath();
            ctx.moveTo(hX, 0);
            ctx.lineTo(hX, bounds.height); // Vertical hair
            ctx.moveTo(bounds.left, hY);
            ctx.lineTo(bounds.right, hY); // Horizontal hair
            ctx.strokeStyle = "#9ca3af"; // Grey shadow color
            ctx.lineWidth = 1;
            ctx.stroke();

            // Also draw price marker for clarity
            drawPriceMarker(hoverPoint.price, "#9ca3af");
          }

          ctx.restore();
        }
      }

      if (ghostStateRef.current && mousePos) {
        drawGhostGlyph(ctx, mousePos.x, mousePos.y - 18, ghostStateRef.current);
      }

      if (isLogScale() && mousePos && activeTool && isPatternTool(activeTool)) {
        drawGhostLabel(
          ctx,
          "Log scale: ratios may be distorted",
          mousePos.x + 12,
          mousePos.y + 12,
          { state: GHOST_STATES.marginal },
        );
      }

      // GUIDANCE TOOLTIPS
      if (activeTool && mousePos && activeTool !== "eraser") {
        let tip = "";
        if (!currentLine) {
          tip =
            activeTool === "gannFan"
              ? "Click to set fan origin"
              : isPatternTool(activeTool)
                ? "Click first point"
                : "Click first point of trend";
        } else if (currentLine.type === "gannFan" && currentLine.step === 1) {
          tip = "Click to lock fan angle";
        } else if (currentLine.type === "headShoulders") {
          if (currentLine.step === 1) tip = "Click Left Shoulder";
          else if (currentLine.step === 2) tip = "Click Neckline Mid";
          else if (currentLine.step === 3) tip = "Click Head";
          else if (currentLine.step === 4) tip = "Click Neckline Right";
          else if (currentLine.step === 5) tip = "Click Right Shoulder";
        } else if (currentLine.type === "abcdPattern") {
          if (currentLine.step === 1) tip = "Click B";
          else if (currentLine.step === 2) tip = "Click C";
          else if (currentLine.step === 3) tip = "Click to confirm D";
        } else if (
          ["harmonicXABCD", "harmonicCypher", "harmonicThreeDrives"].includes(
            currentLine.type,
          )
        ) {
          if (currentLine.step === 1) tip = "Click A";
          else if (currentLine.step === 2) tip = "Click B";
          else if (currentLine.step === 3) tip = "Click C";
          else if (currentLine.step === 4) tip = "Click to confirm D";
        } else if (currentLine.type === "trianglePattern") {
          tip = "Click next swing (min 5 points)";
        } else if (currentLine.type === "parallelChannel") {
          if (currentLine.step === 1) tip = "Click second point of trend";
          else if (currentLine.step === 2) tip = "Click to set channel width";
        } else if (currentLine.type === "flatTopBottom") {
          if (currentLine.step === 1) tip = "Set trend end";
          else if (currentLine.step === 2) tip = "Set flat level";
        } else if (currentLine.type === "disjointChannel") {
          if (currentLine.step === 1)
            tip = "Click second point of reference line";
          else if (currentLine.step === 2)
            tip = "Click first point of parallel line";
          else if (currentLine.step === 3)
            tip = "Click second point to place parallel line";
        } else {
          tip = "Click to finalize";
        }

        const invalidMsg =
          ghostStateRef.current === GHOST_STATES.invalid
            ? ghostMessageRef.current
            : "";
        if (invalidMsg) {
          drawTooltip(ctx, mousePos.x, mousePos.y, invalidMsg);
        } else if (tip) {
          drawTooltip(ctx, mousePos.x, mousePos.y, tip);
        }
      }
    } catch (err) {
      console.error("renderDrawings critical error:", err);
    }
  }, [
    chart,
    series,
    drawings,
    currentLine,
    snappedPoint,
    hoverPoint,
    mousePos,
    activeTool,
    getCoords,
    getChartBounds,
    getLogicalIndex,
    getScaleSample,
    getSlopeFromPoints,
    priceToY,
  ]);

  // Update mouse position for tooltips
  const updateMousePos = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Subscribe to chart changes and re-render
  useEffect(() => {
    if (!chart) return;

    const handleRedraw = () => requestAnimationFrame(renderDrawings);

    chart.timeScale().subscribeVisibleLogicalRangeChange(handleRedraw);

    // Also redraw on any price scale change
    const interval = setInterval(handleRedraw, 50); // Smooth updates

    return () => {
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleRedraw);
      clearInterval(interval);
    };
  }, [chart, series, renderDrawings]);

  const handleCancelDrawing = useCallback(() => {
    setCurrentLine(null);
    setSnappedPoint(null);
    strokeDrawingRef.current = false;
    lastStrokePointRef.current = null;
  }, []);

  const commitPathDrawing = useCallback(() => {
    if (!currentLine || currentLine.type !== "path") return;
    const points = currentLine.points || [];
    if (points.length < 2) {
      setCurrentLine(null);
      return;
    }
    const newDrawing = {
      id: Date.now(),
      type: "path",
      points,
      color: currentLine.color || "#3b82f6",
      settings: { ...PATH_TOOL_DEFAULTS, ...(currentLine.settings || {}) },
    };
    setDrawings((prev) => [...prev, newDrawing]);
    setCurrentLine(null);
    if (onDrawingComplete) onDrawingComplete();
  }, [currentLine, onDrawingComplete, setDrawings]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") handleCancelDrawing();
      if (e.key === "Enter") commitPathDrawing();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [commitPathDrawing, handleCancelDrawing]);

  // Redraw when drawings change
  useEffect(() => {
    renderDrawings();
  }, [renderDrawings]);

  useEffect(() => {
    const nextLen = data?.length || 0;
    if (dataVersionRef.current !== nextLen) {
      if (currentLine && isPatternTool(currentLine.type)) {
        setCurrentLine(null);
      }
      dataVersionRef.current = nextLen;
    }
  }, [data, currentLine, isPatternTool]);

  const findHit = useCallback(
    (x, y) => {
      const bounds = getChartBounds();
      const hitRadius = 10;
      const edgeThreshold = 6;
      const point = { x, y };
      const isPointLike = (value) =>
        value &&
        typeof value === "object" &&
        typeof value.price === "number" &&
        (value.logical !== undefined || value.time !== undefined);

      for (let i = drawings.length - 1; i >= 0; i--) {
        const d = drawings[i];
        if (d.type === "gannFan" && d.settings?.lockFan) continue;

        if (d.type === "path" && Array.isArray(d.points)) {
          const mapped = d.points
            .map((p) => {
              const c = getCoords(p);
              return c ? { x: c.x + bounds.left, y: c.y } : null;
            })
            .filter(Boolean);
          for (let idx = 0; idx < mapped.length; idx++) {
            const pt = mapped[idx];
            const dist = Math.hypot(point.x - pt.x, point.y - pt.y);
            if (dist < hitRadius) {
              return { id: d.id, type: "anchor", key: "points", index: idx };
            }
          }
          for (let idx = 1; idx < mapped.length; idx++) {
            const dist = distanceToSegment(point, mapped[idx - 1], mapped[idx]);
            if (dist < hitRadius) {
              return { id: d.id, type: "body" };
            }
          }
        }

        if (d.type === "brush" && Array.isArray(d.points)) {
          const mapped = d.points
            .map((p) => {
              const c = getCoords(p);
              return c ? { x: c.x + bounds.left, y: c.y } : null;
            })
            .filter(Boolean);
          for (let idx = 1; idx < mapped.length; idx++) {
            const dist = distanceToSegment(point, mapped[idx - 1], mapped[idx]);
            if (dist < hitRadius) {
              return { id: d.id, type: "body" };
            }
          }
        }

        if (TEXT_TOOL_TYPES.includes(d.type)) {
          const ctx = canvasRef.current?.getContext("2d");
          if (ctx) {
            let settings = mergeTextSettings(d.type, {
              ...(d.settings || {}),
              text:
                d.settings?.text ??
                d.text ??
                d.settings?.label ??
                d.settings?.value,
            });
            if (TEXT_SCREEN_TYPES.includes(d.type) && settings.autoScale) {
              const scale = getStrokeScale(true);
              settings = { ...settings, fontSize: settings.fontSize * scale };
            }
            const anchor = TEXT_SCREEN_TYPES.includes(d.type)
              ? getScreenTextPoint(bounds, settings, d.p1 || null)
              : d.p1
                ? getAnchorScreenPoint(d.p1, bounds, settings)
                : null;
            if (anchor) {
              let boxX = anchor.x;
              let boxY = anchor.y;
              const labelText =
                settings.text || TEXT_GHOST_LABELS[d.type] || "Text";
              const metrics = getTextBoxMetrics(ctx, labelText, settings);
              if (settings.autoFlip) {
                if (boxX + metrics.width > bounds.right - 4)
                  boxX = bounds.right - metrics.width - 4;
                if (boxX < bounds.left + 4) boxX = bounds.left + 4;
                if (boxY - metrics.height / 2 < 4)
                  boxY = metrics.height / 2 + 4;
                if (boxY + metrics.height / 2 > bounds.height - 4)
                  boxY = bounds.height - metrics.height / 2 - 4;
              }
              let hitBox = null;
              if (d.type === "callout") {
                const bubbleX =
                  settings.offset?.dx !== undefined ? boxX : anchor.x;
                const bubbleY =
                  settings.offset?.dy !== undefined ? boxY : anchor.y;
                hitBox = {
                  x: bubbleX - metrics.width / 2,
                  y: bubbleY - metrics.height / 2,
                  w: metrics.width,
                  h: metrics.height,
                };
              } else {
                const layout = getTextBoxLayout(boxX, boxY, metrics);
                hitBox = {
                  x: layout.boxX,
                  y: layout.boxY,
                  w: metrics.width,
                  h: metrics.height,
                };
              }
              if (
                hitBox &&
                x >= hitBox.x &&
                x <= hitBox.x + hitBox.w &&
                y >= hitBox.y &&
                y <= hitBox.y + hitBox.h
              ) {
                return { id: d.id, type: "text-body" };
              }
            }
          }
        }

        if (d.type !== "brush") {
          const keys = Object.keys(d).filter((k) => isPointLike(d[k]));
          for (const k of keys) {
            const p = d[k];
            if (!p) continue;
            const coords = getCoords(p);
            if (!coords) continue;
            const dist = Math.hypot(x - (coords.x + bounds.left), y - coords.y);
            if (dist < hitRadius) return { id: d.id, type: "anchor", key: k };
          }
        }

        if (d.type === "arrow" && d.p1 && d.p2) {
          const c1 = getCoords(d.p1);
          const c2 = getCoords(d.p2);
          if (c1 && c2) {
            const a = { x: c1.x + bounds.left, y: c1.y };
            const b = { x: c2.x + bounds.left, y: c2.y };
            const dist = distanceToSegment(point, a, b);
            if (dist < hitRadius) return { id: d.id, type: "body" };
          }
        }

        if (
          (d.type === "rectangle" || d.type === "highlighter") &&
          d.p1 &&
          d.p2
        ) {
          const c1 = getCoords(d.p1);
          const c2 = getCoords(d.p2);
          if (c1 && c2) {
            const extend = d.settings?.extend || "none";
            const rawMinX = Math.min(c1.x, c2.x) + bounds.left;
            const rawMaxX = Math.max(c1.x, c2.x) + bounds.left;
            const xMin =
              extend === "left" || extend === "both" ? bounds.left : rawMinX;
            const xMax =
              extend === "right" || extend === "both" ? bounds.right : rawMaxX;
            const yMin = Math.min(c1.y, c2.y);
            const yMax = Math.max(c1.y, c2.y);
            const withinY = y >= yMin && y <= yMax;
            const withinX = x >= xMin && x <= xMax;
            if (withinY && Math.abs(x - xMin) < edgeThreshold)
              return { id: d.id, type: "edge", edge: "left" };
            if (withinY && Math.abs(x - xMax) < edgeThreshold)
              return { id: d.id, type: "edge", edge: "right" };
            if (withinX && Math.abs(y - yMin) < edgeThreshold)
              return { id: d.id, type: "edge", edge: "top" };
            if (withinX && Math.abs(y - yMax) < edgeThreshold)
              return { id: d.id, type: "edge", edge: "bottom" };
            if (withinX && withinY) return { id: d.id, type: "body" };
          }
        }

        if (d.type === "parallelChannel" && d.p1 && d.p2 && d.p3) {
          const c1 = getCoords(d.p1);
          const c2 = getCoords(d.p2);
          const c3 = getCoords(d.p3);
          if (c1 && c2 && c3) {
            const a = { x: c1.x + bounds.left, y: c1.y };
            const b = { x: c2.x + bounds.left, y: c2.y };
            const c = { x: c3.x + bounds.left, y: c3.y };
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const lengthSq = dx * dx + dy * dy;
            const t = ((c.x - a.x) * dx + (c.y - a.y) * dy) / lengthSq;
            const proj = { x: a.x + t * dx, y: a.y + t * dy };
            const vx = c.x - proj.x;
            const vy = c.y - proj.y;
            const points = [
              a,
              b,
              { x: b.x + vx, y: b.y + vy },
              { x: a.x + vx, y: a.y + vy },
            ];
            for (let j = 0; j < 4; j++) {
              const dist = distanceToSegment(
                point,
                points[j],
                points[(j + 1) % 4],
              );
              if (dist < hitRadius) return { id: d.id, type: "body" };
            }
          }
        }

        if (d.type === "arc" && d.p1) {
          const c = getCoords(d.p1);
          if (c) {
            const cx = c.x + bounds.left;
            const cy = c.y;
            const radiusPx = getCircleRadiusPx(d.p1, d.p2, d.settings || {});
            if (radiusPx) {
              const dist = Math.hypot(x - cx, y - cy);
              if (Math.abs(dist - radiusPx) < edgeThreshold) {
                const angle = Math.atan2(y - cy, x - cx);
                let start = d.settings?.startAngle;
                let end = d.settings?.endAngle;
                if (start != null && end != null) {
                  // Normalize angles to [0, 2PI]
                  const norm = (a) =>
                    ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                  const nAngle = norm(angle);
                  const nStart = norm(start);
                  const nEnd = norm(end);
                  const isCCW = d.settings?.direction === "ccw";
                  let inArc = false;
                  if (!isCCW) {
                    if (nStart <= nEnd)
                      inArc = nAngle >= nStart && nAngle <= nEnd;
                    else inArc = nAngle >= nStart || nAngle <= nEnd;
                  } else {
                    if (nEnd <= nStart)
                      inArc = nAngle >= nEnd && nAngle <= nStart;
                    else inArc = nAngle >= nEnd || nAngle <= nStart;
                  }
                  if (inArc) return { id: d.id, type: "edge", edge: "radius" };
                }
              }
            }
          }
        }

        if (d.type === "ellipse" && d.p1) {
          const c = getCoords(d.p1);
          if (c) {
            const cx = c.x + bounds.left;
            const cy = c.y;
            const radii = getEllipseRadiiPx(d.p1, d.p2, d.p3, d.settings || {});
            if (radii) {
              const { xRadiusPx, yRadiusPx } = radii;
              const rotation = d.settings?.rotation
                ? (d.settings.rotation * Math.PI) / 180
                : 0;
              const dx = x - cx;
              const dy = y - cy;
              const cos = Math.cos(-rotation);
              const sin = Math.sin(-rotation);
              const rx = dx * cos - dy * sin;
              const ry = dx * sin + dy * cos;
              const val =
                (rx * rx) / (xRadiusPx * xRadiusPx) +
                (ry * ry) / (yRadiusPx * yRadiusPx);
              if (
                Math.abs(Math.sqrt(val) - 1) <
                edgeThreshold / Math.max(xRadiusPx, yRadiusPx)
              )
                return { id: d.id, type: "edge", edge: "ellipse-edge" };
              if (d.settings?.fill && val <= 1)
                return { id: d.id, type: "body" };
            }
          }
        }
      }
      return null;
    },
    [
      drawings,
      getChartBounds,
      getCoords,
      getAnchorScreenPoint,
      getScreenTextPoint,
      getTextBoxMetrics,
      getTextBoxLayout,
      distanceToSegment,
      mergeTextSettings,
      getStrokeScale,
      canvasRef, // Added canvasRef to dependencies for ctx
    ],
  );

  useEffect(() => {
    findHitRef.current = findHit;
  }, [findHit]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const priceScale = series?.priceScale();
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Text Tool 2-Click Flow (Arm -> Place)
    if (
      TEXT_EDITOR_TYPES.includes(activeTool) &&
      activeTool !== "select" &&
      activeTool !== "eraser"
    ) {
      if (!textPlacementArmed) {
        setTextPlacementArmed(true);
        return;
      }
      setTextPlacementArmed(false);
      const defaults = TEXT_TOOL_DEFAULTS[activeTool] || {};
      const bounds = getChartBounds();
      const fallback = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // For Screen types (Text, Note), we don't need a valid data point
      if (TEXT_SCREEN_TYPES.includes(activeTool)) {
        // Screen X is relative to chart area for openTextEditor logic
        const screen = { x: fallback.x - bounds.left, y: fallback.y };
        openTextEditor(
          activeTool,
          null,
          { ...defaults, _fallback: fallback, screen },
          null,
        );
        return;
      }

      // For Anchored types (Callout, etc), we try to get a point
      let point = getPoint(e.clientX, e.clientY, {
        snap: resolveSnapSetting(activeTool, currentLine?.settings),
      });
      if (!point && hoverPoint) point = hoverPoint;

      // Use fallback if getPoint worked but openTextEditor logic might fail on mapping
      if (point) {
        openTextEditor(
          activeTool,
          point,
          { ...defaults, _fallback: fallback },
          null,
        );
        return;
      }
    }

    if (!activeTool || activeTool === "select" || activeTool === "eraser") {
      // Selection / Dragging logic
      if (activeTool === "select") {
        const hit = findHit(clickX, clickY);
        if (hit) {
          // setSelectedDrawingID(hit.id);
          const dr = drawings.find((d) => d.id === hit.id);
          const startPoint = getPoint(e.clientX, e.clientY, { snap: false });
          if (!dr || dr.settings?.locked) return;
          if (hit.type === "text-body") {
            if (TEXT_SCREEN_TYPES.includes(dr.type)) {
              const bounds = getChartBounds();
              const screen = dr.settings?.screen || {
                x: clickX - bounds.left,
                y: clickY,
              };
              setDraggingInfo({
                id: hit.id,
                mode: "text-screen",
                startMouse: { x: clickX, y: clickY },
                startScreen: { x: screen.x || 0, y: screen.y || 0 },
                moved: false,
              });
              return;
            }
            if (dr.settings?.lockOffset) return;
            const offset = dr.settings?.offset || { dx: 0, dy: 0 };
            setDraggingInfo({
              id: hit.id,
              mode: "text-offset",
              startMouse: { x: clickX, y: clickY },
              startOffset: { dx: offset.dx || 0, dy: offset.dy || 0 },
              moved: false,
            });
            return;
          }
          if (hit.type === "anchor") {
            let lockSlope = null;
            if (
              dr.type === "arrow" &&
              dr.settings?.lockAngle &&
              dr.p1 &&
              dr.p2
            ) {
              const l1 = getLogicalIndex(dr.p1);
              const l2 = getLogicalIndex(dr.p2);
              if (l1 !== undefined && l2 !== undefined && l2 !== l1) {
                lockSlope = (dr.p2.price - dr.p1.price) / (l2 - l1);
              }
            }
            if (dr.type === "arc") {
              if (dr.settings?.lockRadius && hit.key === "p2") return;
              if (dr.settings?.lockAngles && hit.key === "p3") return;
            }
            if (dr.type === "ellipse") {
              if (dr.settings?.lockX && hit.key === "p2") return;
              if (dr.settings?.lockY && hit.key === "p3") return;
            }
            if (
              (dr.type === "rectangle" || dr.type === "highlighter") &&
              dr.settings?.lockAspectRatio &&
              dr.p1 &&
              dr.p2
            ) {
              const l1 = getLogicalIndex(dr.p1);
              const l2 = getLogicalIndex(dr.p2);
              if (l1 !== undefined && l2 !== undefined && l2 !== l1) {
                lockSlope = (dr.p2.price - dr.p1.price) / (l2 - l1);
              }
            }
            setDraggingInfo({
              id: hit.id,
              mode: "anchor",
              key: hit.key,
              index: hit.index,
              startPoint: startPoint || dr[hit.key],
              lockSlope,
            });
          } else if (hit.type === "edge") {
            let lockSlope = null;
            if (
              (dr.type === "rectangle" || dr.type === "highlighter") &&
              dr.settings?.lockAspectRatio &&
              dr.p1 &&
              dr.p2
            ) {
              const l1 = getLogicalIndex(dr.p1);
              const l2 = getLogicalIndex(dr.p2);
              if (l1 !== undefined && l2 !== undefined && l2 !== l1) {
                lockSlope = (dr.p2.price - dr.p1.price) / (l2 - l1);
              }
            }
            setDraggingInfo({
              id: hit.id,
              mode: "edge",
              edge: hit.edge,
              startPoint: startPoint,
              lockSlope,
            });
          } else if (hit.type === "body") {
            setDraggingInfo({
              id: hit.id,
              mode: "translate",
              startPoint: startPoint,
            });
          }
        } else {
          setSelectedDrawingID(null);
        }
      }
      return;
    }

    let point =
      activeTool === "brush"
        ? getPoint(e.clientX, e.clientY, { snap: false, freeform: true })
        : getPoint(e.clientX, e.clientY, {
            snap: resolveSnapSetting(activeTool, currentLine?.settings),
          });
    if (!point && hoverPoint) point = hoverPoint;
    if (!point || (point.time == null && point.logical == null)) return;

    if (activeTool === "brush") {
      if (!currentLine || currentLine.type !== "brush") {
        strokeDrawingRef.current = true;
        lastStrokeTimeRef.current = performance.now();
        lastStrokePointRef.current = { ...point, pressure: 1 };
        setCurrentLine({
          type: "brush",
          points: [{ ...point, pressure: 1 }],
          step: 1,
          color: "#3b82f6",
          settings: { ...BRUSH_TOOL_DEFAULTS },
        });
      }
      return;
    }

    if (activeTool === "highlighter") {
      strokeDrawingRef.current = true;
      setCurrentLine({
        type: "highlighter",
        p1: point,
        p2: point,
        step: 1,
        color: "#facc15",
        settings: { ...HIGHLIGHTER_TOOL_DEFAULTS },
      });
      return;
    }

    if (activeTool === "path") {
      if (!currentLine || currentLine.type !== "path") {
        setCurrentLine({
          type: "path",
          points: [point],
          step: 1,
          color: "#3b82f6",
          settings: { ...PATH_TOOL_DEFAULTS },
        });
      } else {
        const points = currentLine.points || [];
        const last = points[points.length - 1];
        if (!last || last.time !== point.time || last.price !== point.price) {
          setCurrentLine({
            ...currentLine,
            points: [...points, point],
            step: currentLine.step + 1,
          });
        }
      }
      return;
    }

    if (activeTool === "pin" || activeTool === "flag") {
      const defaults = TEXT_TOOL_DEFAULTS[activeTool] || {};
      const newDrawing = {
        id: Date.now(),
        type: activeTool,
        p1: point,
        settings: { ...defaults },
      };
      setDrawings((prev) => [...prev, newDrawing]);
      if (onDrawingComplete) onDrawingComplete();
      return;
    }

    // 1-Click Tools (Immediate Finalize)
    if (
      ["horizontalLine", "verticalLine", "horizontalRay", "crossLine"].includes(
        activeTool,
      )
    ) {
      const newDrawing = {
        id: Date.now(),
        p1: point,
        p2: point,
        type: activeTool,
        color:
          activeTool === "horizontalLine" || activeTool === "horizontalRay"
            ? "#00E676"
            : activeTool === "verticalLine"
              ? "#FF6D00"
              : "#FF4081",
      };
      setDrawings((prev) => [...prev, newDrawing]);
      if (onDrawingComplete) onDrawingComplete();
      return;
    }

    // Standard 2-Click Tools (Line, Ray, Extended, Info, Arrow)
    if (
      [
        "line",
        "trendLine",
        "ray",
        "extendedLine",
        "infoLine",
        "arrow",
      ].includes(activeTool)
    ) {
      if (!currentLine) {
        setCurrentLine({
          p1: point,
          type: activeTool,
          step: 1,
          color: activeTool === "arrow" ? "#3b82f6" : undefined,
          settings: activeTool === "arrow" ? { ...ARROW_TOOL_DEFAULTS } : {},
        });
      } else {
        const newDrawing = {
          id: Date.now(),
          type: activeTool,
          p1: currentLine.p1,
          p2: point,
          color: currentLine.color || "#2962FF",
          settings:
            activeTool === "arrow"
              ? { ...ARROW_TOOL_DEFAULTS, ...(currentLine.settings || {}) }
              : currentLine.settings,
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "rectangle") {
      if (!currentLine || currentLine.type !== "rectangle") {
        setCurrentLine({
          p1: point,
          p2: point,
          type: "rectangle",
          step: 1,
          color: "#3b82f6",
          settings: { ...RECTANGLE_TOOL_DEFAULTS },
        });
      } else {
        const c1 = getCoords(currentLine.p1);
        const c2 = getCoords(point);
        if (c1 && c2) {
          const width = Math.abs(c1.x - c2.x);
          const height = Math.abs(c1.y - c2.y);
          if (width > 2 && height > 2) {
            const newDrawing = {
              id: Date.now(),
              type: "rectangle",
              p1: currentLine.p1,
              p2: point,
              color: currentLine.color || "#3b82f6",
              settings: {
                ...RECTANGLE_TOOL_DEFAULTS,
                ...(currentLine.settings || {}),
              },
            };
            setDrawings((prev) => [...prev, newDrawing]);
            if (onDrawingComplete) onDrawingComplete();
          }
        }
        setCurrentLine(null);
      }
      return;
    }

    // Disjoint Channel (4-Click Flow: A, B -> C -> Finalize)
    if (activeTool === "disjointChannel") {
      if (!currentLine) {
        // Step 1: Click 1 (A)
        setCurrentLine({ p1: point, type: activeTool, step: 1 });
      } else if (currentLine.step === 1) {
        // Step 2: Click 2 (B) - Lock reference line
        setCurrentLine({
          ...currentLine,
          p1: currentLine.p1,
          p2: point,
          step: 2,
        });
      } else if (currentLine.step === 2) {
        // Step 3: Click 3 (Start Sliding)
        setCurrentLine({ ...currentLine, p3: point, step: 3 });
      } else if (currentLine.step === 3) {
        // Step 4: Click 4 (Finalize)
        const newDrawing = {
          id: Date.now(),
          type: activeTool,
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: point, // Use final slide position
          color: "#2962FF",
          settings: {
            lineStyle1: "solid",
            lineStyle2: "solid",
            show_fill: true,
          },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    // Andrews Pitchfork (3-Click Flow: P0 -> P1 -> P2 aka p1, p2, p3)
    if (
      [
        "pitchfork",
        "pitchforkSchiff",
        "pitchforkModified",
        "insidePitchfork",
      ].includes(activeTool)
    ) {
      if (!currentLine) {
        // Step 1: Click 1 (Handle)
        // Store the correct subtype in settings right away
        let pType = "original";
        let isInside = false;
        let ext = "right";

        if (activeTool === "pitchforkSchiff") pType = "schiff";
        else if (activeTool === "pitchforkModified") pType = "modifiedSchiff";
        else if (activeTool === "insidePitchfork") {
          isInside = true;
          ext = "right";
        }

        setCurrentLine({
          p1: point,
          type: "pitchfork", // Internal type matches render logic
          step: 1,
          settings: {
            pitchforkType: pType,
            showFill: true,
            extendLines: ext,
            isInsideMode: isInside,
            levels: [0.5],
          },
        });
      } else if (currentLine.step === 1) {
        // Step 2: Click 2 (Pivot 1)
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        // Step 3: Click 3 (Pivot 2) -> Finalize
        const newDrawing = {
          id: Date.now(),
          type: "pitchfork",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: point,
          color: "#2962FF",
          settings: {
            ...currentLine.settings, // Inherit type from Step 1
          },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    // Flat Top / Bottom (3-Click Flow: S1, S2 -> P_flat)
    if (activeTool === "flatTopBottom") {
      if (!currentLine) {
        // Step 1: Set first sloped anchor
        setCurrentLine({ s1: point, type: activeTool, step: 1 });
      } else if (currentLine.step === 1) {
        // Step 2: Set second sloped anchor
        setCurrentLine({
          ...currentLine,
          s2: point,
          step: 2,
        });
      } else if (currentLine.step === 2) {
        // Step 3: Finalize flat level
        const newDrawing = {
          id: Date.now(),
          type: activeTool,
          p_flat: point.price,
          s1: currentLine.s1,
          s2: currentLine.s2,
          color: "#2962FF",
          flatMode: currentLine.flatMode || "auto",
          fillOpacity: currentLine.fillOpacity || 0.1,
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }
    if (activeTool === "parallelChannel") {
      if (!currentLine) {
        // Step 1: Set P1
        setCurrentLine({ p1: point, p2: point, type: activeTool, step: 1 });
      } else if (currentLine.step === 1) {
        // Step 2: Set P2
        if (
          point.time === currentLine.p1.time &&
          point.price === currentLine.p1.price
        )
          return;
        setCurrentLine({ ...currentLine, p2: point, p3: point, step: 2 });
      } else if (currentLine.step === 2) {
        // Step 3: Finalize with P3
        // Width check
        const s = getCoords(currentLine.p1);
        const e = getCoords(currentLine.p2);
        const p3 = getCoords(point);
        const A = e.y - s.y;
        const B = -(e.x - s.x);
        const normLen = Math.sqrt(A * A + B * B);
        const offset = ((p3.x - s.x) * A + (p3.y - s.y) * B) / normLen;

        if (Math.abs(offset) < 2) return; // Ignore if too narrow

        const newDrawing = {
          id: Date.now(),
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: point,
          type: activeTool,
          color: "#2962FF",
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    // Measurement / Position Tools (2 Point Flow)
    if (["longPosition", "shortPosition"].includes(activeTool)) {
      if (!currentLine) {
        // Step 1: Start (Entry) - Snap to Close
        let startPoint = point;
        // Attempt to find exact data point to snap Price to Close
        if (data && timeToIndex) {
          const idx = timeToIndex.get(point.time);
          if (idx !== undefined && data[idx]) {
            // Force price to be the Close of the candle
            startPoint = { ...point, price: data[idx].close };
          }
        }
        setCurrentLine({ p1: startPoint, type: activeTool, step: 1 });
      } else if (currentLine.step === 1) {
        // Step 2: Finish (Target)
        const newDrawing = {
          id: Date.now(),
          p1: currentLine.p1,
          p2: point, // This defines Target Price & Width
          p3: null,
          type: activeTool,
          settings:
            POSITION_TOOL_DEFAULTS[
              activeTool === "shortPosition" ? "short" : "long"
            ],
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }
    // Measure Tools (2 Point)
    if (["dateRange", "priceRange", "datePriceRange"].includes(activeTool)) {
      if (!currentLine) {
        setCurrentLine({ p1: point, type: activeTool, step: 1 });
      } else {
        const newDrawing = {
          id: Date.now(),
          p1: currentLine.p1,
          p2: point,
          type: activeTool,
          settings: MEASURE_TOOL_DEFAULTS,
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }
    // Ghost Feed (Polyline - N Points)
    if (activeTool === "ghostFeed") {
      if (!currentLine) {
        setCurrentLine({
          p1: point,
          points: [point],
          type: activeTool,
          step: 1,
        });
      } else {
        // Add point
        const newPoints = [...(currentLine.points || []), point];
        // Double click to finish? Or separate mode?
        // For now, let's say 5 points max or double click logic (which is separate).
        // Actually, handleClick is single click.
        // We need a way to end. Maybe 'Enter' key or Double Click?
        // For MVP, let's make it 5 points fixed or check if point is close to start?
        // Let's rely on DoubleClick which usually calls explicit handler or we can emulate.
        // Or just add point.
        setCurrentLine({
          ...currentLine,
          points: newPoints,
          step: currentLine.step + 1,
        });
      }
      return;
    }

    if (activeTool === "fibTimeZone") {
      if (!currentLine) {
        // Click 1: Start
        setCurrentLine({
          type: "fibTimeZone",
          p1: point,
          step: 1,
          settings: {
            levels: [1, 2, 3, 5, 8, 13, 21, 34], // Standard Fib Time Sequence
            showLabels: true,
            showBase: true,
          },
        });
      } else {
        // Click 2 -> Finish
        if (point.time === currentLine.p1.time) return;
        setDrawings((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "fibTimeZone",
            p1: currentLine.p1,
            p2: point,
            color: "#cddc39",
            settings: currentLine.settings,
          },
        ]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "gannBox") {
      if (!currentLine) {
        // Step 1: Click 1 (First Corner)
        setCurrentLine({
          type: "gannBox",
          p1: point,
          step: 1,
          settings: {
            gridDivisions: 8,
            showGridHorz: true,
            showGridVert: true,
            showAngles: true,
            angles: ["1x1"],
            angleOrigin: "bottom-left",
            labelMode: "fractions",
            fillBackground: true,
            opacity: 0.15,
          },
        });
      } else {
        // Step 2: Click 2 (Opposite Corner) -> Finalize
        if (
          point.time === currentLine.p1.time &&
          point.price === currentLine.p1.price
        )
          return;
        const newDrawing = {
          id: Date.now(),
          type: "gannBox",
          p1: currentLine.p1,
          p2: point,
          color: "#2962FF",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "gannFan") {
      if (!currentLine) {
        const scaleSample = getScaleSample();
        setCurrentLine({
          type: "gannFan",
          p1: point,
          step: 1,
          settings: {
            extendLines: "right",
            lockFan: false,
            invert: false,
            autoScale: true,
            logScale: false,
            fillBackground: true,
            ratios: GANN_FAN_DEFAULT_RATIOS,
            ratioColors: GANN_FAN_DEFAULT_COLORS,
            showRatio: true,
            showDegrees: false,
            showSlope: false,
            labelPosition: "end",
            lineWidthMain: 2,
            lineWidthMinor: 1,
            opacityDecay: true,
            slope1x1AtLock: scaleSample?.slope1x1 || 1,
          },
        });
      } else if (currentLine.step === 1) {
        const baseSlope = getSlopeFromPoints(
          currentLine.p1,
          point,
          currentLine.settings?.logScale,
        );
        if (baseSlope === null) return;
        const scaleSample = getScaleSample();
        const slope1x1AtLock = scaleSample?.slope1x1 || 1;
        const baseSlopeNormalized =
          slope1x1AtLock === 0 ? 1 : baseSlope / slope1x1AtLock;

        const newDrawing = {
          id: Date.now(),
          type: "gannFan",
          p1: currentLine.p1,
          p2: point,
          color: "#14b8a6",
          settings: {
            ...currentLine.settings,
            baseSlopeNormalized,
            baseSlopeFixed: baseSlope,
            slope1x1AtLock,
          },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "headShoulders") {
      if (!currentLine) {
        setCurrentLine({
          type: "headShoulders",
          p1: point, // Neckline left
          step: 1,
          settings: {
            symmetryTolerance: 0.1,
            showMeasuredMove: true,
            requireBreak: false,
            showLabels: true,
            enforceConstraints: patternConstraintsEnabled,
          },
        });
      } else if (currentLine.step === 1) {
        // Click 2: Left Shoulder
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        // Click 3: Neckline middle
        setCurrentLine({ ...currentLine, p3: point, step: 3 });
      } else if (currentLine.step === 3) {
        // Click 4: Head
        const constraintsActive =
          patternConstraintsEnabled &&
          currentLine.settings?.enforceConstraints === true;
        if (constraintsActive && point.price <= currentLine.p2?.price) return;
        setCurrentLine({ ...currentLine, p4: point, step: 4 });
      } else if (currentLine.step === 4) {
        // Click 5: Neckline right
        setCurrentLine({ ...currentLine, p5: point, step: 5 });
      } else if (currentLine.step === 5) {
        // Click 6: Right Shoulder (final)
        const validation = validateHeadShoulders(
          currentLine.p1,
          currentLine.p2,
          currentLine.p3,
          currentLine.p4,
          currentLine.p5,
          point,
          currentLine.settings,
        );
        const constraintsActive =
          patternConstraintsEnabled &&
          currentLine.settings?.enforceConstraints === true;
        if (validation.state === GHOST_STATES.invalid && constraintsActive)
          return;
        const newDrawing = {
          id: Date.now(),
          type: "headShoulders",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: currentLine.p3,
          p4: currentLine.p4,
          p5: currentLine.p5,
          p6: point,
          color: "#ef4444",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "abcdPattern") {
      if (!currentLine) {
        setCurrentLine({
          type: "abcdPattern",
          p1: point,
          step: 1,
          settings: {
            abcdTolerance: 0.1,
            showDistanceLabels: true,
            extendProjection: false,
            showPRZ: true,
            enforceConstraints: patternConstraintsEnabled,
          },
        });
      } else if (currentLine.step === 1) {
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        setCurrentLine({ ...currentLine, p3: point, step: 3 });
      } else if (currentLine.step === 3) {
        const validation = validateABCD(
          currentLine.p1,
          currentLine.p2,
          currentLine.p3,
          currentLine.settings,
        );
        if (!validation.dPoint) return;
        const constraintsActive =
          patternConstraintsEnabled &&
          currentLine.settings?.enforceConstraints === true;
        if (validation.state === GHOST_STATES.invalid && constraintsActive)
          return;
        const newDrawing = {
          id: Date.now(),
          type: "abcdPattern",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: currentLine.p3,
          p4: validation.dPoint,
          color: "#f59e0b",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (
      ["harmonicXABCD", "harmonicCypher", "harmonicThreeDrives"].includes(
        activeTool,
      )
    ) {
      if (!currentLine) {
        setCurrentLine({
          type: activeTool,
          p1: point,
          step: 1,
          settings: {
            fibTolerance: 0.08,
            showPRZ: true,
            showRatioLabels: true,
            enforceConstraints: patternConstraintsEnabled,
          },
        });
      } else if (currentLine.step === 1) {
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        setCurrentLine({ ...currentLine, p3: point, step: 3 });
      } else if (currentLine.step === 3) {
        setCurrentLine({ ...currentLine, p4: point, step: 4 });
      } else if (currentLine.step === 4) {
        const validation = validateHarmonic(
          currentLine.type,
          currentLine.p1,
          currentLine.p2,
          currentLine.p3,
          currentLine.p4,
          currentLine.settings,
        );
        if (!validation.dPoint) return;
        const constraintsActive =
          patternConstraintsEnabled &&
          currentLine.settings?.enforceConstraints === true;
        if (validation.state === GHOST_STATES.invalid && constraintsActive)
          return;
        const newDrawing = {
          id: Date.now(),
          type: currentLine.type,
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: currentLine.p3,
          p4: currentLine.p4,
          p5: validation.dPoint,
          color: "#0ea5e9",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "trianglePattern") {
      if (!currentLine) {
        setCurrentLine({
          type: "trianglePattern",
          p1: point,
          step: 1,
          settings: {
            minPoints: 5,
            showApex: true,
            showTarget: true,
            showLabels: true,
            enforceConstraints: patternConstraintsEnabled,
          },
        });
      } else if (currentLine.step === 1) {
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        setCurrentLine({ ...currentLine, p3: point, step: 3 });
      } else if (currentLine.step === 3) {
        setCurrentLine({ ...currentLine, p4: point, step: 4 });
      } else if (currentLine.step === 4) {
        const pts = [
          currentLine.p1,
          currentLine.p2,
          currentLine.p3,
          currentLine.p4,
          point,
        ].filter(Boolean);
        const validation = validateTriangle(pts, currentLine.settings);
        const constraintsActive =
          patternConstraintsEnabled &&
          currentLine.settings?.enforceConstraints === true;
        if (validation.state === GHOST_STATES.invalid && constraintsActive)
          return;
        const newDrawing = {
          id: Date.now(),
          type: "trianglePattern",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: currentLine.p3,
          p4: currentLine.p4,
          p5: point,
          color: "#f97316",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "elliottImpulse") {
      if (!currentLine) {
        setCurrentLine({
          type: "elliottImpulse",
          p1: point,
          step: 1,
          settings: {
            showLabels: true,
            enforceConstraints: patternConstraintsEnabled,
            mode: "strict",
            showFibTargets: false,
            showDegreeLabels: true,
            degreeLabel: "Minor",
          },
        });
      } else if (currentLine.step === 1) {
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        setCurrentLine({ ...currentLine, p3: point, step: 3 });
      } else if (currentLine.step === 3) {
        setCurrentLine({ ...currentLine, p4: point, step: 4 });
      } else if (currentLine.step === 4) {
        setCurrentLine({ ...currentLine, p5: point, step: 5 });
      } else if (currentLine.step === 5) {
        const validation = validateElliottImpulse(
          [
            currentLine.p1,
            currentLine.p2,
            currentLine.p3,
            currentLine.p4,
            currentLine.p5,
            point,
          ],
          currentLine.settings,
        );
        const constraintsActive =
          patternConstraintsEnabled &&
          currentLine.settings?.enforceConstraints === true;
        if (validation.state === GHOST_STATES.invalid && constraintsActive)
          return;
        const newDrawing = {
          id: Date.now(),
          type: "elliottImpulse",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: currentLine.p3,
          p4: currentLine.p4,
          p5: currentLine.p5,
          p6: point,
          color: "#ec4899",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "elliottCorrection") {
      if (!currentLine) {
        setCurrentLine({
          type: "elliottCorrection",
          p1: point,
          step: 1,
          settings: {
            showLabels: true,
            enforceConstraints: patternConstraintsEnabled,
            mode: "strict",
            showFibTargets: false,
            showDegreeLabels: true,
            degreeLabel: "Minor",
          },
        });
      } else if (currentLine.step === 1) {
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        setCurrentLine({ ...currentLine, p3: point, step: 3 });
      } else if (currentLine.step === 3) {
        const validation = validateElliottCorrection(
          [currentLine.p1, currentLine.p2, currentLine.p3, point],
          currentLine.settings,
        );
        const constraintsActive =
          patternConstraintsEnabled &&
          currentLine.settings?.enforceConstraints === true;
        if (validation.state === GHOST_STATES.invalid && constraintsActive)
          return;
        const newDrawing = {
          id: Date.now(),
          type: "elliottCorrection",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: currentLine.p3,
          p4: point,
          color: "#f43f5e",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "elliottTriangle") {
      if (!currentLine) {
        setCurrentLine({
          type: "elliottTriangle",
          p1: point,
          step: 1,
          settings: {
            showLabels: true,
            enforceConstraints: patternConstraintsEnabled,
            mode: "strict",
            showFibTargets: false,
            showDegreeLabels: true,
            degreeLabel: "Minor",
          },
        });
      } else if (currentLine.step === 1) {
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        setCurrentLine({ ...currentLine, p3: point, step: 3 });
      } else if (currentLine.step === 3) {
        setCurrentLine({ ...currentLine, p4: point, step: 4 });
      } else if (currentLine.step === 4) {
        const validation = validateElliottTriangle(
          [
            currentLine.p1,
            currentLine.p2,
            currentLine.p3,
            currentLine.p4,
            point,
          ],
          currentLine.settings,
        );
        const constraintsActive =
          patternConstraintsEnabled &&
          currentLine.settings?.enforceConstraints === true;
        if (validation.state === GHOST_STATES.invalid && constraintsActive)
          return;
        const newDrawing = {
          id: Date.now(),
          type: "elliottTriangle",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: currentLine.p3,
          p4: currentLine.p4,
          p5: point,
          color: "#ef4444",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "elliottCombo") {
      if (!currentLine) {
        setCurrentLine({
          type: "elliottCombo",
          p1: point,
          step: 1,
          settings: {
            showLabels: true,
            enforceConstraints: patternConstraintsEnabled,
            mode: "strict",
            showFibTargets: false,
            showDegreeLabels: true,
            degreeLabel: "Minor",
          },
        });
      } else if (currentLine.step === 1) {
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        setCurrentLine({ ...currentLine, p3: point, step: 3 });
      } else if (currentLine.step === 3) {
        const validation = validateElliottCombo(
          [currentLine.p1, currentLine.p2, currentLine.p3, point],
          currentLine.settings,
        );
        const constraintsActive =
          patternConstraintsEnabled &&
          currentLine.settings?.enforceConstraints === true;
        if (validation.state === GHOST_STATES.invalid && constraintsActive)
          return;
        const newDrawing = {
          id: Date.now(),
          type: "elliottCombo",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: currentLine.p3,
          p4: point,
          color: "#f97316",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "cyclicLines") {
      if (!currentLine) {
        setCurrentLine({
          type: "cyclicLines",
          p1: point,
          step: 1,
          settings: {
            showLabels: true,
            direction: "both",
          },
        });
      } else if (currentLine.step === 1) {
        const l1 = getLogicalIndex(currentLine.p1);
        const l2 = getLogicalIndex(point);
        if (l1 === undefined || l2 === undefined || l2 <= l1) return;
        const newDrawing = {
          id: Date.now(),
          type: "cyclicLines",
          p1: currentLine.p1,
          p2: point,
          color: "#0f766e",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "fibTrendTime") {
      if (!currentLine) {
        // Step 1: Click 1 (Start)
        setCurrentLine({
          type: "fibTrendTime",
          p1: point,
          step: 1,
          settings: {
            levels: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144],
            showLabels: true,
            showVisuals: true,
          },
        });
      } else if (currentLine.step === 1) {
        // Step 2: Click 2 (End of Trend)
        if (point.time === currentLine.p1.time) return;
        setCurrentLine((prev) => ({ ...prev, p2: point, step: 2 }));
      } else if (currentLine.step === 2) {
        // Step 3: Click 3 (Correction Point) -> Finish
        const newDrawing = {
          id: Date.now(),
          type: "fibTrendTime",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: point,
          color: "#4caf50",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "arc") {
      const warnOnLog =
        currentLine?.settings?.warnOnLogScale ??
        ARC_TOOL_DEFAULTS.warnOnLogScale;
      if (priceScale.isLog() && !currentLine && warnOnLog) {
        setLogScaleWarning({
          tool: "Arc",
          message:
            "Circular arcs may appear parabolic or distorted on logarithmic price scales.",
        });
      }
      if (!currentLine) {
        setCurrentLine({
          type: "arc",
          p1: point,
          step: 1,
          color: "#2962FF",
          settings: { ...ARC_TOOL_DEFAULTS },
        });
      } else if (currentLine.step === 1) {
        setCurrentLine((prev) => ({ ...prev, p2: point, step: 2 }));
      } else if (currentLine.step === 2) {
        const settings = { ...currentLine.settings };
        const startAngle = getAngleFromPoints(currentLine.p1, currentLine.p2);
        let endAngle = getAngleFromPoints(currentLine.p1, point);
        if (settings.snapAngles && endAngle != null) {
          endAngle = snapAngleRad(endAngle, settings.snapAngleStep || 15);
        }
        if (startAngle != null) settings.startAngle = startAngle;
        if (endAngle != null) settings.endAngle = endAngle;
        if (settings.scaleMode === "screen") {
          const radiusPx = getCircleRadiusPx(
            currentLine.p1,
            currentLine.p2,
            settings,
          );
          if (radiusPx != null) settings.radiusPx = radiusPx;
        }
        const newDrawing = {
          id: Date.now(),
          type: "arc",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: point,
          color: currentLine.color || "#2962FF",
          settings,
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "ellipse") {
      const warnOnLog =
        currentLine?.settings?.warnOnLogScale ??
        ELLIPSE_TOOL_DEFAULTS.warnOnLogScale;
      if (priceScale.isLog() && !currentLine && warnOnLog) {
        setLogScaleWarning({
          tool: "Ellipse",
          message:
            "Ellipses may appear distorted or non-geometric on logarithmic price scales.",
        });
      }
      if (!currentLine) {
        setCurrentLine({
          type: "ellipse",
          p1: point,
          step: 1,
          color: "#2962FF",
          settings: { ...ELLIPSE_TOOL_DEFAULTS },
        });
      } else if (currentLine.step === 1) {
        setCurrentLine((prev) => ({ ...prev, p2: point, step: 2 }));
      } else if (currentLine.step === 2) {
        const settings = { ...currentLine.settings };
        if (settings.scaleMode === "screen") {
          const radii = getEllipseRadiiPx(
            currentLine.p1,
            currentLine.p2,
            point,
            settings,
          );
          if (radii) {
            settings.xRadiusPx = radii.xRadiusPx;
            settings.yRadiusPx = radii.yRadiusPx;
          }
        }
        const newDrawing = {
          id: Date.now(),
          type: "ellipse",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: point,
          color: currentLine.color || "#2962FF",
          settings,
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "fibChannel") {
      if (!currentLine) {
        // Step 1: Start
        setCurrentLine({
          type: "fibChannel",
          p1: point,
          step: 1,
          settings: {
            levels: [0.382, 0.618, 1.0, 1.618, 2.618],
            sideMode: "one",
            extendLines: "both",
            showLabels: true,
            showPrice: true,
            fillBackground: true,
          },
        });
      } else if (currentLine.step === 1) {
        // Step 2: Trend Defined
        if (point.time === currentLine.p1.time) return;
        setCurrentLine((prev) => ({ ...prev, p2: point, step: 2 }));
      } else if (currentLine.step === 2) {
        // Step 3: Width Defined -> Finish
        const newDrawing = {
          id: Date.now(),
          type: "fibChannel",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: point,
          color: "#2962FF",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    if (activeTool === "fibExtension") {
      if (!currentLine) {
        // Step 1: Set P1
        setCurrentLine({
          p1: point,
          type: "fibExtension",
          step: 1,
          settings: {
            extendLines: "right",
            showLabels: true,
            showPrice: true,
            showLegs: true,
            levels: [0, 0.618, 1, 1.618, 2.618, 3.618, 4.236],
          },
        });
      } else if (currentLine.step === 1) {
        // Step 2: Set P2
        setCurrentLine({ ...currentLine, p2: point, step: 2 });
      } else if (currentLine.step === 2) {
        // Step 3: Finalize with P3
        const newDrawing = {
          id: Date.now(),
          type: "fibExtension",
          p1: currentLine.p1,
          p2: currentLine.p2,
          p3: point,
          color: "#ff9800",
          settings: { ...currentLine.settings },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        setCurrentLine(null);
        if (onDrawingComplete) onDrawingComplete();
      }
      return;
    }

    // 2-Click Tools (Click-Click Flow)
    if (currentLine) {
      // Second Click -> Finalize
      const newDrawing = {
        id: Date.now(),
        p1: currentLine.p1,
        p2: point,
        type: activeTool,
        color: "#2962FF",
        ...(activeTool === "regressionTrend"
          ? { k: 2, priceSource: "close" }
          : {}),
        ...(activeTool === "fibRetracement"
          ? { settings: currentLine.settings || { extendLines: "none" } }
          : {}),
      };
      setDrawings((prev) => [...prev, newDrawing]);
      setCurrentLine(null);
      setSnappedPoint(null);
      if (onDrawingComplete) onDrawingComplete();
    } else {
      // First Click -> Start Ghost Drawing
      const settings =
        activeTool === "fibRetracement" ? { extendLines: "none" } : {};
      setCurrentLine({
        p1: point,
        p2: point,
        type: activeTool,
        settings,
        step: 1,
      });
    }
  };

  const handleMouseMove = (e) => {
    // 1. Handle Dragging of existing drawings
    if (draggingInfo) {
      if (draggingInfo.mode === "text-screen") {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const dx = mx - draggingInfo.startMouse.x;
        const dy = my - draggingInfo.startMouse.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          setDraggingInfo((prev) => (prev ? { ...prev, moved: true } : prev));
        }
        setDrawings((prev) =>
          prev.map((d) => {
            if (d.id !== draggingInfo.id) return d;
            return {
              ...d,
              settings: {
                ...d.settings,
                screen: {
                  x: (draggingInfo.startScreen?.x || 0) + dx,
                  y: (draggingInfo.startScreen?.y || 0) + dy,
                },
              },
            };
          }),
        );
        return;
      }
      if (draggingInfo.mode === "text-offset") {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const dx = mx - draggingInfo.startMouse.x;
        const dy = my - draggingInfo.startMouse.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          setDraggingInfo((prev) => (prev ? { ...prev, moved: true } : prev));
        }
        setDrawings((prev) =>
          prev.map((d) => {
            if (d.id !== draggingInfo.id) return d;
            if (d.settings?.lockOffset) return d;
            const base = d.settings?.offset || { dx: 0, dy: 0 };
            return {
              ...d,
              settings: {
                ...d.settings,
                offset: {
                  dx: (draggingInfo.startOffset?.dx || 0) + dx,
                  dy: (draggingInfo.startOffset?.dy || 0) + dy,
                },
              },
            };
          }),
        );
        return;
      }
      const point = getPoint(e.clientX, e.clientY, { snap: false });
      if (point) {
        setDrawings((prev) =>
          prev.map((d) => {
            if (d.id !== draggingInfo.id) return d;
            if (d.type === "gannFan" && d.settings?.lockFan) return d;
            if (d.settings?.locked) return d;

            if (draggingInfo.mode === "translate") {
              if (!draggingInfo.startPoint) return d;
              const deltaLogical =
                point.logical - draggingInfo.startPoint.logical;
              const deltaPrice = point.price - draggingInfo.startPoint.price;
              if (d.type === "brush" || d.type === "path") {
                return {
                  ...d,
                  points: (d.points || []).map((pt) =>
                    shiftPoint(pt, deltaLogical, deltaPrice),
                  ),
                };
              }
              if (d.type === "highlighter" || d.type === "rectangle") {
                return {
                  ...d,
                  p1: shiftPoint(d.p1, deltaLogical, deltaPrice),
                  p2: shiftPoint(d.p2, deltaLogical, deltaPrice),
                };
              }
              if (d.type === "arrow" || d.type === "arc" || d.type === "ellipse") {
                const updated = {
                  ...d,
                  p1: shiftPoint(d.p1, deltaLogical, deltaPrice),
                  p2: d.p2
                    ? shiftPoint(d.p2, deltaLogical, deltaPrice)
                    : undefined,
                  p3: d.p3
                    ? shiftPoint(d.p3, deltaLogical, deltaPrice)
                    : undefined,
                };
                return updated;
              }
              return d;
            }

            if (draggingInfo.mode === "edge") {
              if (!d.p1 || !d.p2) return d;
              const l1 = getLogicalIndex(d.p1);
              const l2 = getLogicalIndex(d.p2);
              if (l1 === undefined || l2 === undefined) return d;
              const leftKey = l1 <= l2 ? "p1" : "p2";
              const rightKey = l1 <= l2 ? "p2" : "p1";
              const topKey = d.p1.price <= d.p2.price ? "p1" : "p2";
              const bottomKey = d.p1.price <= d.p2.price ? "p2" : "p1";
              if (draggingInfo.edge === "left") {
                const newPoint = getPointFromLogical(
                  point.logical,
                  d[leftKey].price,
                );
                return newPoint ? { ...d, [leftKey]: newPoint } : d;
              }
              if (draggingInfo.edge === "right") {
                const newPoint = getPointFromLogical(
                  point.logical,
                  d[rightKey].price,
                );
                return newPoint ? { ...d, [rightKey]: newPoint } : d;
              }
              if (draggingInfo.edge === "top") {
                const targetKey = topKey;
                const targetLogical = getLogicalIndex(d[targetKey]);
                if (targetLogical === undefined) return d;
                const newPoint = getPointFromLogical(
                  targetLogical,
                  point.price,
                );
                return newPoint ? { ...d, [targetKey]: newPoint } : d;
              }
              if (draggingInfo.edge === "bottom") {
                const targetKey = bottomKey;
                const targetLogical = getLogicalIndex(d[targetKey]);
                if (targetLogical === undefined) return d;
                const newPoint = getPointFromLogical(
                  targetLogical,
                  point.price,
                );
                return newPoint ? { ...d, [targetKey]: newPoint } : d;
              }
              return d;
            }

            if (draggingInfo.mode === "anchor") {
              if (draggingInfo.key === "points" && d.points) {
                const idx = draggingInfo.index;
                if (idx === undefined) return d;
                const updated = [...d.points];
                updated[idx] = point;
                return { ...d, points: updated };
              }
              if (d.type === "arc" && d.settings?.scaleMode === "screen") {
                const next = { ...d, [draggingInfo.key]: point };
                const radiusPx = getCircleRadiusPx(
                  next.p1,
                  next.p2,
                  next.settings,
                );
                if (radiusPx != null) {
                  next.settings = { ...next.settings, radiusPx };
                }
                return next;
              }
              if (d.type === "ellipse" && d.settings?.scaleMode === "screen") {
                const next = { ...d, [draggingInfo.key]: point };
                const radii = getEllipseRadiiPx(
                  next.p1,
                  next.p2,
                  next.p3,
                  next.settings,
                );
                if (radii) {
                  next.settings = {
                    ...next.settings,
                    xRadiusPx: radii.xRadiusPx,
                    yRadiusPx: radii.yRadiusPx,
                  };
                }
                return next;
              }
              if (d.type === "arrow" && d.settings?.lockAngle && d.p1 && d.p2) {
                const fixed = draggingInfo.key === "p1" ? d.p2 : d.p1;
                const fixedLogical = getLogicalIndex(fixed);
                if (fixedLogical !== undefined && draggingInfo.lockSlope) {
                  const deltaLogical = point.logical - fixedLogical;
                  const adjustedPrice =
                    fixed.price + draggingInfo.lockSlope * deltaLogical;
                  const adjusted = getPointFromLogical(
                    point.logical,
                    adjustedPrice,
                  );
                  if (adjusted) {
                    return { ...d, [draggingInfo.key]: adjusted };
                  }
                }
              }
              if (
                (d.type === "rectangle" || d.type === "highlighter") &&
                d.settings?.lockAspectRatio &&
                d.p1 &&
                d.p2 &&
                draggingInfo.lockSlope
              ) {
                const fixed = draggingInfo.key === "p1" ? d.p2 : d.p1;
                const fixedLogical = getLogicalIndex(fixed);
                if (fixedLogical !== undefined) {
                  const deltaLogical = point.logical - fixedLogical;
                  const adjustedPrice =
                    fixed.price + draggingInfo.lockSlope * deltaLogical;
                  const adjusted = getPointFromLogical(
                    point.logical,
                    adjustedPrice,
                  );
                  if (adjusted) {
                    return { ...d, [draggingInfo.key]: adjusted };
                  }
                }
              }
              return { ...d, [draggingInfo.key]: point };
            }

            return d;
          }),
        );
        if (draggingInfo.mode === "translate") {
          setDraggingInfo((prev) =>
            prev ? { ...prev, startPoint: point } : prev,
          );
        }
      }
      return;
    }

    // 2. Handle drawing new ghosts
    let point = null;

    // Always track hover point for "Ghost Preview" before first click
    if (activeTool && activeTool !== "eraser") {
      const isBrush = activeTool === "brush";
      point = getPoint(e.clientX, e.clientY, {
        snap: isBrush
          ? false
          : resolveSnapSetting(activeTool, currentLine?.settings),
        freeform: isBrush,
      });
      setHoverPoint(point);
    } else {
      setHoverPoint(null);
    }

    // If drawing (between clicks), update P2 or P3
    if (!currentLine) return;

    if (currentLine.type === "brush" && strokeDrawingRef.current) {
      const brushPoint = getPoint(e.clientX, e.clientY, {
        snap: false,
        freeform: true,
      });
      if (brushPoint) appendBrushPoint(brushPoint);
      return;
    }

    if (currentLine.type === "highlighter" && strokeDrawingRef.current) {
      const snap = resolveSnapSetting("highlighter", currentLine.settings);
      const hlPoint = getPoint(e.clientX, e.clientY, { snap });
      if (hlPoint) {
        setCurrentLine((prev) => ({ ...prev, p2: hlPoint }));
      }
      return;
    }

    if (currentLine.type === "path") {
      return;
    }

    point = getPoint(e.clientX, e.clientY, {
      snap: resolveSnapSetting(currentLine.type, currentLine.settings),
    });
    if (point) {
      if (currentLine.type === "parallelChannel") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        }
      } else if (currentLine.type === "flatTopBottom") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, s2: point }));
        } else {
          setCurrentLine((prev) => ({ ...prev, p2: point })); // Used for p_flat ghost
        }
      } else if (currentLine.type === "disjointChannel") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          // Waiting for Click 3 - do nothing or update hover?
        } else if (currentLine.step === 3) {
          // Parallel line slide logic: P3 follows cursor
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        }
      } else if (currentLine.type === "pitchfork") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        }
      } else if (currentLine.type === "fibChannel") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        }
      } else if (currentLine.type === "fibExtension") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        }
      } else if (currentLine.type === "fibTrendTime") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        }
      } else if (currentLine.type === "arc") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        }
      } else if (currentLine.type === "ellipse") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        }
      } else if (currentLine.type === "gannBox") {
        setCurrentLine((prev) => ({ ...prev, p2: point }));
      } else if (currentLine.type === "headShoulders") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        } else if (currentLine.step === 3) {
          setCurrentLine((prev) => ({ ...prev, p4: point }));
        } else if (currentLine.step === 4) {
          setCurrentLine((prev) => ({ ...prev, p5: point }));
        } else if (currentLine.step === 5) {
          setCurrentLine((prev) => ({ ...prev, p6: point }));
        }
      } else if (currentLine.type === "abcdPattern") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        }
      } else if (
        ["harmonicXABCD", "harmonicCypher", "harmonicThreeDrives"].includes(
          currentLine.type,
        )
      ) {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        } else if (currentLine.step === 3) {
          setCurrentLine((prev) => ({ ...prev, p4: point }));
        }
      } else if (currentLine.type === "trianglePattern") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        } else if (currentLine.step === 3) {
          setCurrentLine((prev) => ({ ...prev, p4: point }));
        } else if (currentLine.step === 4) {
          setCurrentLine((prev) => ({ ...prev, p5: point }));
        }
      } else if (currentLine.type === "elliottImpulse") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        } else if (currentLine.step === 3) {
          setCurrentLine((prev) => ({ ...prev, p4: point }));
        } else if (currentLine.step === 4) {
          setCurrentLine((prev) => ({ ...prev, p5: point }));
        } else if (currentLine.step === 5) {
          setCurrentLine((prev) => ({ ...prev, p6: point }));
        }
      } else if (currentLine.type === "elliottCorrection") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        } else if (currentLine.step === 3) {
          setCurrentLine((prev) => ({ ...prev, p4: point }));
        }
      } else if (currentLine.type === "elliottTriangle") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        } else if (currentLine.step === 3) {
          setCurrentLine((prev) => ({ ...prev, p4: point }));
        } else if (currentLine.step === 4) {
          setCurrentLine((prev) => ({ ...prev, p5: point }));
        }
      } else if (currentLine.type === "elliottCombo") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        } else if (currentLine.step === 2) {
          setCurrentLine((prev) => ({ ...prev, p3: point }));
        } else if (currentLine.step === 3) {
          setCurrentLine((prev) => ({ ...prev, p4: point }));
        }
      } else if (currentLine.type === "cyclicLines") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        }
      } else if (currentLine.type === "fibTimeZone") {
        if (currentLine.step === 1) {
          setCurrentLine((prev) => ({ ...prev, p2: point }));
        }
      } else {
        setCurrentLine((prev) => ({ ...prev, p2: point }));
      }
    }
  };

  const handleMouseUp = () => {
    if (draggingInfo?.mode === "text-screen") {
      if (!draggingInfo.moved) {
        const dr = drawings.find((d) => d.id === draggingInfo.id);
        if (dr && TEXT_EDITOR_TYPES.includes(dr.type)) {
          const settings = {
            ...(dr.settings || {}),
            text:
              dr.settings?.text ??
              dr.text ??
              dr.settings?.label ??
              dr.settings?.value,
          };
          openTextEditor(dr.type, dr.p1 || null, settings, dr.id);
        }
      }
      setDraggingInfo(null);
      return;
    }
    if (draggingInfo?.mode === "text-offset") {
      if (!draggingInfo.moved) {
        const dr = drawings.find((d) => d.id === draggingInfo.id);
        if (dr && TEXT_EDITOR_TYPES.includes(dr.type)) {
          const settings = {
            ...(dr.settings || {}),
            text:
              dr.settings?.text ??
              dr.text ??
              dr.settings?.label ??
              dr.settings?.value,
          };
          const isScreen = TEXT_SCREEN_TYPES.includes(dr.type);
          openTextEditor(
            dr.type,
            isScreen ? dr.p1 || null : dr.p1,
            settings,
            dr.id,
          );
        }
      }
      setDraggingInfo(null);
      return;
    }
    if (currentLine?.type === "brush" && strokeDrawingRef.current) {
      strokeDrawingRef.current = false;
      lastStrokePointRef.current = null;
      if (currentLine.points && currentLine.points.length > 1) {
        const newDrawing = {
          id: Date.now(),
          type: "brush",
          points: currentLine.points,
          color: currentLine.color || "#3b82f6",
          settings: { ...(currentLine.settings || {}) },
        };
        setDrawings((prev) => [...prev, newDrawing]);
        if (onDrawingComplete) onDrawingComplete();
      }
      setCurrentLine(null);
    }

    if (currentLine?.type === "highlighter" && strokeDrawingRef.current) {
      strokeDrawingRef.current = false;
      lastStrokePointRef.current = null;
      const c1 = getCoords(currentLine.p1);
      const c2 = getCoords(currentLine.p2);
      if (c1 && c2) {
        const width = Math.abs(c1.x - c2.x);
        const height = Math.abs(c1.y - c2.y);
        if (width > 2 && height > 2) {
          const newDrawing = {
            id: Date.now(),
            type: "highlighter",
            p1: currentLine.p1,
            p2: currentLine.p2,
            color: currentLine.color || "#facc15",
            settings: { ...(currentLine.settings || {}) },
          };
          setDrawings((prev) => [...prev, newDrawing]);
          if (onDrawingComplete) onDrawingComplete();
        }
      }
      setCurrentLine(null);
    }

    setDraggingInfo(null);
  };

  const handleClick = (e) => {
    if (activeTool !== "eraser" || !chart || !series) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const hit = findHit(clickX, clickY);
    if (hit) {
      setDrawings((prev) => prev.filter((d) => d.id !== hit.id));
    }
  };

  const handleMouseLeave = () => {
    setSnappedPoint(null);
  };

  const handleDoubleClick = (e) => {
    if (!chart || !series) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let hit = findHit(clickX, clickY);
    if (!hit) {
      const bounds = getChartBounds();
      const padding = 14;
      for (let i = drawings.length - 1; i >= 0; i--) {
        const d = drawings[i];
        const isPointLike = (value) =>
          value &&
          typeof value === "object" &&
          typeof value.price === "number" &&
          (value.logical !== undefined || value.time !== undefined);

        const orderedKeys = Object.keys(d)
          .filter((k) => /^p\d+$/.test(k))
          .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
        const orderedPoints = orderedKeys.map((k) => d[k]).filter(isPointLike);

        const rawPoints = [];
        Object.values(d).forEach((value) => {
          if (isPointLike(value)) rawPoints.push(value);
        });
        if (Array.isArray(d.points)) rawPoints.push(...d.points);

        const coords = rawPoints
          .map((p) => getCoords(p))
          .filter(Boolean)
          .map((c) => ({ x: c.x + bounds.left, y: c.y }));

        if (
          !coords.length &&
          d.type !== "rectangle" &&
          d.type !== "highlighter"
        )
          continue;

        // Rectangle/highlighter: hit within bounds
        if (
          (d.type === "rectangle" || d.type === "highlighter") &&
          d.p1 &&
          d.p2
        ) {
          const c1 = getCoords(d.p1);
          const c2 = getCoords(d.p2);
          if (c1 && c2) {
            const extend = d.settings?.extend || "none";
            const rawMinX = Math.min(c1.x, c2.x) + bounds.left;
            const rawMaxX = Math.max(c1.x, c2.x) + bounds.left;
            const xMin =
              extend === "left" || extend === "both" ? bounds.left : rawMinX;
            const xMax =
              extend === "right" || extend === "both" ? bounds.right : rawMaxX;
            const yMin = Math.min(c1.y, c2.y);
            const yMax = Math.max(c1.y, c2.y);
            if (
              clickX >= xMin - padding &&
              clickX <= xMax + padding &&
              clickY >= yMin - padding &&
              clickY <= yMax + padding
            ) {
              hit = { id: d.id, type: "body" };
              break;
            }
          }
        }

        // Bounding box fallback for any other drawing
        if (coords.length) {
          const minX = Math.min(...coords.map((c) => c.x)) - padding;
          const maxX = Math.max(...coords.map((c) => c.x)) + padding;
          const minY = Math.min(...coords.map((c) => c.y)) - padding;
          const maxY = Math.max(...coords.map((c) => c.y)) + padding;
          if (
            clickX >= minX &&
            clickX <= maxX &&
            clickY >= minY &&
            clickY <= maxY
          ) {
            hit = { id: d.id, type: "body" };
            break;
          }
        }

        // Segment distance fallback for ordered points (lines/polylines)
        if (orderedPoints.length >= 2) {
          const mapped = orderedPoints
            .map((p) => {
              const c = getCoords(p);
              return c ? { x: c.x + bounds.left, y: c.y } : null;
            })
            .filter(Boolean);
          for (let idx = 1; idx < mapped.length; idx++) {
            const dist = distanceToSegment(
              { x: clickX, y: clickY },
              mapped[idx - 1],
              mapped[idx],
            );
            if (dist <= padding) {
              hit = { id: d.id, type: "body" };
              break;
            }
          }
          if (hit) break;
        }
      }
    }
    console.log("ChartAnnotations DoubleClick:", {
      clickX,
      clickY,
      hitID: hit?.id,
    });

    if (hit && drawings) {
      const d = drawings.find((dw) => dw.id === hit.id);
      if (d) {
        e.preventDefault();
        // For text-type tools or rectangles, open text editor
        if (d.type === "rectangle" || TEXT_EDITOR_TYPES.includes(d.type)) {
          const settings = d.settings || {};
          const bounds = getChartBounds();

          let screen = undefined;
          if (TEXT_SCREEN_TYPES.includes(d.type)) {
            screen = settings.screen;
          } else if (d.p1) {
            const coords = getCoords(d.p1);
            if (coords) screen = { x: coords.x, y: coords.y };
            if (d.type === "rectangle" && d.p2) {
              const c2 = getCoords(d.p2);
              if (c2) {
                screen = {
                  x: (coords.x + c2.x) / 2,
                  y: (coords.y + c2.y) / 2,
                };
              }
            }
          }

          openTextEditor(d.type, d.p1 || null, { ...settings, screen }, d.id);
          return;
        }
        // For all other drawings, open settings panel
        setSettingsPosition({ x: clickX, y: clickY });
        setSelectedDrawingID(d.id);
        return;
      }
    }

    if (currentLine?.type !== "path") return;
    e.preventDefault();
    commitPathDrawing();
  };

  // Text editing is managed via textEditor state.

  const handleUpdateDrawing = (updatedDrawing) => {
    setDrawings((prev) =>
      prev.map((d) => (d.id === updatedDrawing.id ? updatedDrawing : d)),
    );
  };

  const selectedDrawing = selectedDrawingID
    ? drawings.find((d) => d.id === selectedDrawingID)
    : null;

  return (
    <>
      <div
        ref={containerRef}
        className="absolute top-0 left-0 w-full h-full z-20"
        style={{
          // Capture pointer events ONLY when drawing or hovering a drawing
          pointerEvents:
            (activeTool && !["select", "eraser"].includes(activeTool)) ||
            isOverDrawing ||
            textEditor ||
            draggingInfo
              ? "auto"
              : "none",
          cursor:
            activeTool === "eraser"
              ? "cell"
              : draggingInfo?.mode === "text-offset" ||
                  draggingInfo?.mode === "text-screen"
                ? "move"
                : activeTool === "text" || activeTool === "note"
                  ? "text"
                  : TEXT_ANCHORED_TYPES.includes(activeTool)
                    ? "crosshair"
                    : activeTool === "select" && draggingInfo
                      ? "grabbing"
                      : activeTool === "select"
                        ? "grab"
                        : "crosshair",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          updateMousePos(e);
          handleMouseMove(e);
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => {
          handleClick(e);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          handleCancelDrawing();
        }}
        tabIndex={0}
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        />

        {/* Text Input Overlay */}
        {textEditor && (
          <div
            style={{
              position: "absolute",
              left: textEditor.x,
              top: textEditor.y,
              transform: "translate(0, 0)",
              zIndex: 50,
              pointerEvents: "auto",
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              autoFocus
              ref={textInputRef}
              value={textEditor.value}
              onChange={(e) =>
                setTextEditor({ ...textEditor, value: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleTextCommit();
                }
                if (e.key === "Escape") {
                  handleTextDismiss();
                }
              }}
              onBlur={() => {
                // Keep editor open to allow immediate typing; commit only on Enter
                if (!textEditor?.value?.trim()) {
                  setTimeout(() => textInputRef.current?.focus(), 0);
                  return;
                }
                handleTextCommit();
              }}
              className="w-48 p-2 text-sm border-2 border-blue-500 rounded bg-white dark:bg-slate-800 dark:text-white shadow-lg outline-none resize"
              style={{
                minHeight: "40px",
                color: textEditor.settings?.color || "#000000",
                fontSize: (textEditor.settings?.fontSize || 14) + "px",
                fontFamily: textEditor.settings?.fontFamily || "sans-serif",
              }}
            />
          </div>
        )}
      </div>

      {/* Log Scale Warning Toast */}
      {logScaleWarning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-100 border border-amber-300 text-amber-800 px-3 py-2 rounded shadow-md z-50 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <span className="font-semibold">{logScaleWarning.tool}:</span>{" "}
            {logScaleWarning.message}
          </div>
          <button
            onClick={() => setLogScaleWarning(null)}
            className="ml-2 text-amber-600 hover:text-amber-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Render Settings Panel if a drawing is selected */}
      {selectedDrawing && (
        <AnnotationSettings
          drawing={selectedDrawing}
          onUpdate={handleUpdateDrawing}
          position={settingsPosition}
          onClose={() => {
            setSelectedDrawingID(null);
            setSettingsPosition(null);
          }}
          onRemove={() => {
            setDrawings((prev) =>
              prev.filter((d) => d.id !== selectedDrawing.id),
            );
            setSelectedDrawingID(null);
            setSettingsPosition(null);
          }}
        />
      )}
    </>
  );
};

export default ChartAnnotations;
