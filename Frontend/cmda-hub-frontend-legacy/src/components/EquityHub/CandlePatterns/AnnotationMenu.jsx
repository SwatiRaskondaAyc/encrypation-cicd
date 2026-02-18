import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  X,
  TrendingUp,
  Minus,
  Circle,
  Square,
  GitBranch,
  GitMerge,
  Grid3X3,
  BarChart3,
  Activity,
  Ruler,
  Target,
  Waves,
  PenTool,
  Type,
  Eraser,
  MousePointer,
  TriangleRight,
  Star,
  Clock,
  History,
  StickyNote,
  MapPin,
  MessageSquare,
  Flag,
  Tag,
} from "lucide-react";

const ANNOTATION_CATEGORIES = {
  LINES: "Lines",
  FIBONACCI: "Fibonacci",
  GANN: "Gann",
  PATTERNS: "Patterns",
  PREDICTION: "Prediction & Measurement",
  TEXT_NOTES: "Text & Notes",
  TOOLS: "Tools",
};

export const AVAILABLE_ANNOTATIONS = [
  // --- LINES ---
  {
    id: "line",
    name: "Trend Line",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Draw a straight line between two points.",
    icon: TrendingUp,
    iconName: "TrendingUp",
    color: "#2962FF",
  },
  {
    id: "parallelChannel",
    name: "Parallel Channel",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Draw parallel boundaries to show a trend corridor.",
    icon: TrendingUp,
    iconName: "TrendingUp",
    color: "#2962FF",
  },
  {
    id: "disjointChannel",
    name: "Disjoint Channel",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Two independent parallel trend lines.",
    icon: GitBranch,
    iconName: "GitBranch",
    color: "#2962FF",
  },
  {
    id: "regressionTrend",
    name: "Regression Trend",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Linear regression best-fit trend line with deviation bands.",
    icon: TrendingUp,
    iconName: "TrendingUp",
    color: "#2962FF",
  },
  {
    id: "flatTopBottom",
    name: "Flat Top / Bottom",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Horizontal boundary with a converging/sloped trend boundary.",
    icon: TrendingUp,
    iconName: "TrendingUp",
    color: "#2962FF",
  },
  {
    id: "ray",
    name: "Ray",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Line starting at a point and extending infinitely.",
    icon: TrendingUp,
    iconName: "TrendingUp",
    color: "#2962FF",
  },
  {
    id: "infoLine",
    name: "Info Line",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Line displaying price/time range stats.",
    icon: TrendingUp,
    iconName: "TrendingUp",
    color: "#2962FF",
  },
  {
    id: "extendedLine",
    name: "Extended Line",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Line extending infinitely in both directions.",
    icon: TrendingUp,
    iconName: "TrendingUp",
    color: "#2962FF",
  },
  {
    id: "trendAngle",
    name: "Trend Angle",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Trend line with angle display.",
    icon: TrendingUp,
    iconName: "TrendingUp",
    color: "#2962FF",
  },
  {
    id: "horizontalLine",
    name: "Horizontal Line",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Horizontal support/resistance line.",
    icon: Minus,
    iconName: "Minus",
    color: "#00E676",
  },
  {
    id: "horizontalRay",
    name: "Horizontal Ray",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Horizontal line extending one way.",
    icon: Minus,
    iconName: "Minus",
    color: "#00E676",
  },
  {
    id: "verticalLine",
    name: "Vertical Line",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Mark specific time points.",
    icon: Minus,
    iconName: "Minus",
    color: "#FF6D00",
  },
  {
    id: "crossLine",
    name: "Cross Line",
    category: ANNOTATION_CATEGORIES.LINES,
    description: "Crosshair intersection.",
    icon: Target,
    iconName: "Target",
    color: "#F50057",
  },

  // --- FIBONACCI ---
  {
    id: "fibRetracement",
    name: "Fib Retracement",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Key retracement levels (23.6%, 38.2%, 50%, 61.8%).",
    icon: GitBranch,
    iconName: "GitBranch",
    color: "#f59e0b",
  },
  {
    id: "fibExtension",
    name: "Trend-Based Fib Extension",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Project price targets beyond the move.",
    icon: GitBranch,
    iconName: "GitBranch",
    color: "#ff9800",
  },
  {
    id: "fibChannel",
    name: "Fib Channel",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Parallel channels at Fibonacci distances.",
    icon: GitBranch,
    iconName: "GitBranch",
    color: "#ffc107",
  },
  {
    id: "fibTimeZone",
    name: "Fib Time Zone",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Vertical lines projecting Fibonacci time intervals.",
    icon: Clock,
    iconName: "Clock",
    color: "#cddc39",
  },
  {
    id: "fibSpeedFan",
    name: "Fib Speed Resistance Fan",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Fan lines combining price and time.",
    icon: GitBranch,
    iconName: "GitBranch",
    color: "#8bc34a",
  },
  {
    id: "fibTrendTime",
    name: "Trend-Based Fib Time",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Project time windows from trend duration (3 clicks).",
    icon: History,
    iconName: "History",
    color: "#4caf50",
  },
  {
    id: "fibCircles",
    name: "Fib Circles",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Circular support/resistance at Fib ratios.",
    icon: Circle,
    iconName: "Circle",
    color: "#009688",
  },
  {
    id: "fibSpiral",
    name: "Fib Spiral",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Golden spiral pattern overlay.",
    icon: Circle,
    iconName: "Circle",
    color: "#00bcd4",
  },
  {
    id: "fibArcs",
    name: "Fib Speed Resistance Arcs",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Arc-based support/resistance zones.",
    icon: Circle,
    iconName: "Circle",
    color: "#03a9f4",
  },
  {
    id: "fibWedge",
    name: "Fib Wedge",
    category: ANNOTATION_CATEGORIES.FIBONACCI,
    description: "Wedge pattern with Fib levels.",
    icon: TriangleRight,
    iconName: "TriangleRight",
    color: "#2196f3",
  },

  // --- GANN ---
  {
    id: "gannBox",
    name: "Gann Box",
    category: ANNOTATION_CATEGORIES.GANN,
    description: "Grid with Gann angles and divisions.",
    icon: Grid3X3,
    iconName: "Grid3X3",
    color: "#8b5cf6",
  },
  {
    id: "gannSquare",
    name: "Gann Square",
    category: ANNOTATION_CATEGORIES.GANN,
    description: "Scalable Gann Square analysis.",
    icon: Square,
    iconName: "Square",
    color: "#7c3aed",
  },
  {
    id: "gannFan",
    name: "Gann Fan",
    category: ANNOTATION_CATEGORIES.GANN,
    description: "Fan lines at Gann angles (1x1, 2x1, etc.).",
    icon: BarChart3,
    iconName: "BarChart3",
    color: "#14b8a6",
  },
  {
    id: "pitchfork",
    name: "Andrews Pitchfork",
    category: ANNOTATION_CATEGORIES.GANN,
    description: "Standard Andrews Pitchfork.",
    icon: GitMerge,
    iconName: "GitMerge",
    color: "#0d9488",
  },
  {
    id: "pitchforkSchiff",
    name: "Schiff Pitchfork",
    category: ANNOTATION_CATEGORIES.GANN,
    description: "Schiff variation (Origin at P0-P1 midpoint).",
    icon: GitMerge,
    iconName: "GitMerge",
    color: "#0f766e",
  },
  {
    id: "pitchforkModified",
    name: "Modified Schiff",
    category: ANNOTATION_CATEGORIES.GANN,
    description: "Modified Schiff (adjusted steepness).",
    icon: GitMerge,
    iconName: "GitMerge",
    color: "#115e59",
  },
  {
    id: "insidePitchfork",
    name: "Inside Pitchfork",
    category: ANNOTATION_CATEGORIES.GANN,
    description: "Pitchfork contained within pivot range.",
    icon: GitMerge,
    iconName: "GitMerge",
    color: "#134e4a",
  },

  // --- PATTERNS ---
  {
    id: "headShoulders",
    name: "Head & Shoulders",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "Symmetric distribution with neckline & target.",
    icon: Activity,
    iconName: "Activity",
    color: "#ef4444",
  },
  {
    id: "abcdPattern",
    name: "ABCD Pattern",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "AB=CD harmonic projection with PRZ.",
    icon: Ruler,
    iconName: "Ruler",
    color: "#f59e0b",
  },
  {
    id: "harmonicXABCD",
    name: "Bat",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "Bat harmonic pattern (XABCD ratios).",
    icon: Waves,
    iconName: "Waves",
    color: "#0ea5e9",
  },
  {
    id: "harmonicCypher",
    name: "Harmonic Cypher",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "Cypher harmonic with PRZ.",
    icon: Waves,
    iconName: "Waves",
    color: "#22c55e",
  },
  {
    id: "harmonicThreeDrives",
    name: "Harmonic Three Drives",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "Three-drive harmonic structure.",
    icon: Waves,
    iconName: "Waves",
    color: "#a855f7",
  },
  {
    id: "trianglePattern",
    name: "Triangle Pattern",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "Converging triangle with apex target.",
    icon: TriangleRight,
    iconName: "TriangleRight",
    color: "#f97316",
  },
  {
    id: "elliottImpulse",
    name: "Elliott Impulse Wave (12345)",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "5-wave impulse pattern markup.",
    icon: Waves,
    iconName: "Waves",
    color: "#ec4899",
  },
  {
    id: "elliottCorrection",
    name: "Elliott Correction Wave (ABC)",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "3-wave correction pattern markup.",
    icon: Waves,
    iconName: "Waves",
    color: "#f43f5e",
  },
  {
    id: "elliottTriangle",
    name: "Elliott Triangle (ABCDE)",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "Triangle correction pattern.",
    icon: Waves,
    iconName: "Waves",
    color: "#ef4444",
  },
  {
    id: "elliottCombo",
    name: "Elliott Combination (WXY)",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "Complex correction pattern.",
    icon: Waves,
    iconName: "Waves",
    color: "#f97316",
  },
  {
    id: "cyclicLines",
    name: "Cyclic Lines",
    category: ANNOTATION_CATEGORIES.PATTERNS,
    description: "Repeating time-cycle verticals.",
    icon: Clock,
    iconName: "Clock",
    color: "#0f766e",
  },

  // --- PREDICTION & MEASUREMENT ---
  {
    id: "longPosition",
    name: "Long Position",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Plan a long trade with entry, stop loss, and take profit.",
    icon: Target,
    iconName: "Target",
    color: "#4CAF50",
  },
  {
    id: "shortPosition",
    name: "Short Position",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Plan a short trade with entry, stop loss, and take profit.",
    icon: Target,
    iconName: "Target",
    color: "#F44336",
  },

  {
    id: "dateRange",
    name: "Date Range",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Measure the time between two points.",
    icon: Ruler,
    iconName: "Ruler",
    color: "#2196F3",
  },
  {
    id: "priceRange",
    name: "Price Range",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Measure the price difference between two points.",
    icon: Ruler,
    iconName: "Ruler",
    color: "#2196F3",
  },
  {
    id: "datePriceRange",
    name: "Date & Price Range",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Measure both time and price difference.",
    icon: Ruler,
    iconName: "Ruler",
    color: "#2196F3",
  },

  // --- TEXT & NOTES ---
  {
    id: "text",
    name: "Text",
    category: ANNOTATION_CATEGORIES.TEXT_NOTES,
    description: "Free-floating text note (Screen Space).",
    icon: Type,
    iconName: "Type",
    color: "#607D8B",
  },
  {
    id: "anchoredText",
    name: "Anchored Text",
    category: ANNOTATION_CATEGORIES.TEXT_NOTES,
    description: "Text tied to a specific price and time.",
    icon: Type,
    iconName: "Type",
    color: "#607D8B",
  },
  {
    id: "note",
    name: "Note",
    category: ANNOTATION_CATEGORIES.TEXT_NOTES,
    description: "Sticky note for analysis.",
    icon: StickyNote,
    iconName: "StickyNote",
    color: "#FFD54F",
  },
  {
    id: "priceNote",
    name: "Price Note",
    category: ANNOTATION_CATEGORIES.TEXT_NOTES,
    description: "Comment attached to a specific price level.",
    icon: Tag,
    iconName: "Tag",
    color: "#607D8B",
  },
  {
    id: "callout",
    name: "Callout",
    category: ANNOTATION_CATEGORIES.TEXT_NOTES,
    description: "Speech bubble with an arrow pointing to a specific point.",
    icon: MessageSquare,
    iconName: "MessageSquare",
    color: "#607D8B",
  },
  {
    id: "pin",
    name: "Pin",
    category: ANNOTATION_CATEGORIES.TEXT_NOTES,
    description: "Mark a specific location with a pin.",
    icon: MapPin,
    iconName: "MapPin",
    color: "#E91E63",
  },
  {
    id: "flag",
    name: "Flag",
    category: ANNOTATION_CATEGORIES.TEXT_NOTES,
    description: "Mark a point with a flag.",
    icon: Flag,
    iconName: "Flag",
    color: "#F44336",
  },
  // --- TOOLS ---

  {
    id: "brush",
    name: "Brush",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Freeform brush stroke on the chart.",
    icon: PenTool,
    iconName: "PenTool",
    color: "#3b82f6",
  },
  {
    id: "arrow",
    name: "Arrow",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Point from one location to another.",
    icon: TriangleRight,
    iconName: "TriangleRight",
    color: "#3b82f6",
  },
  {
    id: "rectangle",
    name: "Rectangle",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Mark a rectangular price/time zone.",
    icon: Square,
    iconName: "Square",
    color: "#3b82f6",
  },
  {
    id: "path",
    name: "Path",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Multi-segment line with editable nodes.",
    icon: GitBranch,
    iconName: "GitBranch",
    color: "#3b82f6",
  },
  {
    id: "highlighter",
    name: "Highlighter",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Highlight a zone without hiding candles.",
    icon: PenTool,
    iconName: "PenTool",
    color: "#facc15",
  },
  {
    id: "eraser",
    name: "Eraser",
    category: ANNOTATION_CATEGORIES.TOOLS,
    description: "Click on drawings to delete them.",
    icon: Eraser,
    iconName: "Eraser",
    color: "#ef4444",
  },
];

const ENABLED_TOOLS = [
  "fibRetracement",
  "fibExtension",
  "fibChannel",
  "fibTimeZone",
  "fibTrendTime",
  "gannBox",
  "select", // Keep selection mode enabled for UX
];

const AnnotationMenu = ({
  isOpen,
  onClose,
  activeTool,
  onSelectTool,
  patternConstraintMode = "optional",
  onChangePatternConstraintMode,
  portalTarget = null,
  onToggleFavorite,
  favorites = [],
  onOpenSettings,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const filteredAnnotations = useMemo(() => {
    return AVAILABLE_ANNOTATIONS.filter((ann) => {
      const matchesSearch =
        ann.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "ALL" || ann.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelect = (annotation) => {
    const isEnabled =
      annotation.category !== ANNOTATION_CATEGORIES.FIBONACCI ||
      ENABLED_TOOLS.includes(annotation.id);
    if (!isEnabled) return;
    onSelectTool(annotation.id === activeTool ? null : annotation.id);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const categories = [
    { id: "ALL", label: "All Tools", icon: PenTool },
    { id: ANNOTATION_CATEGORIES.LINES, label: "Lines", icon: TrendingUp },
    {
      id: ANNOTATION_CATEGORIES.FIBONACCI,
      label: "Fibonacci",
      icon: GitBranch,
    },
    { id: ANNOTATION_CATEGORIES.GANN, label: "Gann", icon: Grid3X3 },
    { id: ANNOTATION_CATEGORIES.PATTERNS, label: "Patterns", icon: Waves },
    {
      id: ANNOTATION_CATEGORIES.TEXT_NOTES,
      label: "Text & Notes",
      icon: Type,
    },
    { id: ANNOTATION_CATEGORIES.TOOLS, label: "Tools", icon: Target },
  ];

  const content = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 p-4 animate-in fade-in duration-200"
      style={{ zIndex: 9999999 }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative bg-white text-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200"
        style={{
          width: "900px",
          maxWidth: "95vw",
          height: "600px",
          maxHeight: "90vh",
        }}
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column: Categories */}
          <div className="w-56 bg-gray-50 border-r border-gray-100 flex flex-col py-4">
            <div className="px-5 mb-4">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Drawing Tools
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Select a tool to annotate the chart
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                const count =
                  cat.id === "ALL"
                    ? AVAILABLE_ANNOTATIONS.length
                    : AVAILABLE_ANNOTATIONS.filter((a) => a.category === cat.id)
                        .length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-blue-500" : "text-gray-400"}`}
                      />
                      {cat.label}
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="px-3 pt-3 border-t border-gray-200 mt-2">
              <button
                onClick={() => {
                  onSelectTool("select");
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  activeTool === "select"
                    ? "bg-slate-800 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <MousePointer className="w-4 h-4" />
                Selection Mode
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search drawing tools..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              {(selectedCategory === "ALL" ||
                selectedCategory === ANNOTATION_CATEGORIES.PATTERNS) && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[11px] font-medium text-gray-500">
                    Pattern Constraints
                  </span>
                  <select
                    value={patternConstraintMode}
                    onChange={(e) =>
                      onChangePatternConstraintMode?.(e.target.value)
                    }
                    className="text-[11px] border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="optional">Optional</option>
                    <option value="enforced">Enforced</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-2">
                {filteredAnnotations.map((ann) => {
                  const active = activeTool === ann.id;
                  const Icon = ann.icon;
                  const isGannSquare = ann.id === "gannSquare";

                  const isEnabled =
                    ann.category !== ANNOTATION_CATEGORIES.FIBONACCI ||
                    ENABLED_TOOLS.includes(ann.id);

                  return (
                    <div
                      key={ann.id}
                      onClick={() => isEnabled && handleSelect(ann)}
                      className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border ${
                        isEnabled
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-40 grayscale"
                      } ${
                        active
                          ? "bg-blue-50 border-blue-200 shadow-sm"
                          : "border-transparent hover:bg-gray-50 hover:border-gray-100"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          active
                            ? "bg-blue-100"
                            : "bg-gray-100 group-hover:bg-white group-hover:shadow-sm"
                        }`}
                        style={{ color: ann.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm font-semibold truncate flex items-center gap-1.5 ${active ? "text-blue-700" : "text-gray-900"}`}
                        >
                          {ann.name}
                          {!isEnabled && (
                            <span className="text-[8px] font-normal text-amber-600 bg-amber-50 px-1 rounded border border-amber-100 italic shrink-0">
                              *coming soon*
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] text-gray-500 truncate">
                            {ann.description}
                          </p>
                          {isGannSquare && isEnabled && (
                            <select
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const nextTool =
                                  e.target.value === "fixed"
                                    ? "gannSquareFixed"
                                    : "gannSquare";
                                onSelectTool(nextTool);
                                onClose();
                              }}
                              className="ml-2 text-[10px] border border-gray-200 rounded px-2 py-0.5 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
                              value={
                                activeTool === "gannSquareFixed"
                                  ? "fixed"
                                  : "dynamic"
                              }
                            >
                              <option value="dynamic">Dynamic</option>
                              <option value="fixed">Fixed</option>
                            </select>
                          )}
                        </div>
                      </div>

                      {active && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}

                      {isEnabled && (
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite({
                                id: `tool-${ann.id}`,
                                type: "tool",
                                payload: ann.id,
                                label: ann.name,
                                icon: ann.icon,
                                iconName: ann.iconName || "Activity",
                              });
                            }}
                            className={`p-1.5 rounded-full hover:bg-yellow-50 transition-colors z-10 ${
                              favorites.some((f) => f.payload === ann.id)
                                ? "text-yellow-500"
                                : "text-gray-300 hover:text-yellow-400"
                            }`}
                            title={
                              favorites.some((f) => f.payload === ann.id)
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            <Star
                              className={`w-4 h-4 ${favorites.some((f) => f.payload === ann.id) ? "fill-current" : ""}`}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredAnnotations.length === 0 && (
                  <div className="col-span-2 flex flex-col items-center justify-center h-48 text-center">
                    <Search className="w-8 h-8 text-gray-300 mb-3" />
                    <h3 className="text-gray-900 font-medium text-sm">
                      No tools found
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {activeTool ? (
              <span>
                Active:{" "}
                <span className="font-semibold text-blue-600">
                  {AVAILABLE_ANNOTATIONS.find((a) => a.id === activeTool)
                    ?.name || "None"}
                </span>
              </span>
            ) : (
              <span>Click and drag on chart to draw</span>
            )}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalTarget || document.body);
};

export default AnnotationMenu;
