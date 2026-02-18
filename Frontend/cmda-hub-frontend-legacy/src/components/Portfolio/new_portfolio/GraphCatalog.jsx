// //solve the fiicker or initial state issue 

// import React, { useState, useEffect } from "react";
// import {
//   BarChart2,
//   Activity,
//   PieChart,
//   Target,
//   BarChart3,
//   Clock,
//   DollarSign,
//   Layers,
//   Sparkles,
//   AlertCircle,
//   ArrowLeft,
//   RefreshCw,
//   Info,
//   X,
//   ChevronDown,
//   ChevronRight,
//   RefreshCcw,
//   TrendingUp,
//   TrendingDown,
//   ArrowRight,
// } from "lucide-react";
// import PlotlyReact from "react-plotly.js";
// const Plot = PlotlyReact.default || PlotlyReact;
// import axios from "axios";
// import LoadingScreen from "./LoadingScreen";

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Graph Error Boundary caught error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="flex items-center justify-center h-full max-h-[500px]">
//           <div className="text-center p-6 bg-rose-50 rounded-2xl border border-rose-100 max-w-sm mx-auto">
//             <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
//             <h3 className="text-rose-700 font-bold mb-1">Rendering Error</h3>
//             <p className="text-rose-600 text-sm mb-2">
//               Something went wrong while displaying this graph.
//             </p>
//             <p className="text-xs text-rose-400 font-mono bg-rose-100 p-2 rounded break-all">
//               {this.state.error?.message}
//             </p>
//             <button
//               onClick={() => this.setState({ hasError: false, error: null })}
//               className="mt-4 px-4 py-2 bg-white border border-rose-200 text-rose-600 text-xs font-semibold rounded-lg hover:bg-rose-50 transition-colors shadow-sm"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// // SwapsDashboard merged into this file below

// const GRAPH_METADATA = [
//   {
//     id: "top_performing",
//     title: "Top Performers",
//     description: "Identifies your best and worst performing stocks by returns",
//     icon: BarChart2,
//     color: "emerald",
//   },
//   {
//     id: "portfolio_health",
//     title: "Portfolio Health",
//     description: "Tracks deployed capital and value evolution over time",
//     icon: Activity,
//     color: "blue",
//   },
//   {
//     id: "swot_analysis",
//     title: "SWOT Analysis",
//     description:
//       "Strategic analysis of portfolio strengths, weaknesses, opportunities, and threats",
//     icon: Target,
//     color: "violet",
//   },
//   {
//     id: "risk_return",
//     title: "Risk-Return Matrix",
//     description: "Classifies stocks into risk quadrants for rebalancing",
//     icon: PieChart,
//     color: "rose",
//   },
//   {
//     id: "combined_box_plot",
//     title: "Turnover Analysis",
//     description: "Statistical view of holding periods and trading patterns",
//     icon: BarChart3,
//     color: "amber",
//   },

//   {
//     id: "trade_pnl_plot",
//     title: "P&L Timeline",
//     description: "Chronological view of all realized profits and losses",
//     icon: DollarSign,
//     color: "green",
//   },

//   {
//     id: "user_sunburst",
//     title: "Interactive Sunburst",
//     description: "Hierarchical portfolio view with drill-down",
//     icon: Layers,
//     color: "indigo",
//   },
//   {
//     id: "underwater_plot",
//     title: "Underwater Plot",
//     description:
//       "Visualizes portfolio drawdown from peaks and identifies major contributors",
//     icon: TrendingDown,
//     color: "rose",
//   },
// ];

// // ===========================================
// // MERGED SWAPS DASHBOARD COMPONENT
// // ===========================================

// const GraphCatalog = ({ graphs, file }) => {
//   const [selectedGraphId, setSelectedGraphId] = useState(null);
//   const [lazyData, setLazyData] = useState(null);
//   const [lazyLoading, setLazyLoading] = useState(false);
//   const [lazyError, setLazyError] = useState(null);

//   // SWOT Specific State
//   const [swotRates, setSwotRates] = useState({ fd: 7, mf: 15, inflation: 6 });
//   const [appliedRates, setAppliedRates] = useState({ fd: 7, mf: 15, inflation: 6 });
//   const [showSwotGuide, setShowSwotGuide] = useState(false);
//   const [swotMode, setSwotMode] = useState("real"); // "nominal" | "real"
//   const [swotBench, setSwotBench] = useState("FD"); // "FD" | "MF"

//   // Sidebar Visibility
//   const [showSidebar, setShowSidebar] = useState(true);

//   // Trade P&L Selection State
//   const [selectedStockIdx, setSelectedStockIdx] = useState(0);

//   // Lock body scroll when loading screen or graph overlay is active
//   useEffect(() => {
//     const shouldLock = selectedGraphId || lazyLoading;
//     document.body.style.overflow = shouldLock ? "hidden" : "unset";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [selectedGraphId, lazyLoading]);

//   // Force resize on graph load to fix Plotly rendering issues
//   useEffect(() => {
//     if (selectedGraphId && !lazyLoading) {
//       // Trigger a resize event to ensure Plotly calculates dimensions correctly
//       // inside the flex container
//       setTimeout(() => {
//         window.dispatchEvent(new Event("resize"));
//       }, 100);
//     }
//   }, [selectedGraphId, lazyLoading, lazyData]);

//   // Generic unwrapping: normalize backend responses into { graph_data, insights }
//   const unwrapResponse = (data) => {
//     if (!data || typeof data !== "object") {
//       return { graph_data: null, insights: null };
//     }

//     // 1. Check for standard envelope { status, graph_data, insights }
//     let rawGraph = data.graph_data;
//     let rawInsights = data.insights;

//     // 2. recursive unwrap if 'graph_data' is nested inside 'graph_data'
//     // This happens if the backend returns { graph_data: { graph_data: ... } }
//     if (rawGraph && rawGraph.graph_data) {
//       rawInsights = rawGraph.insights || rawInsights;
//       rawGraph = rawGraph.graph_data;
//     }

//     // 3. Fallback: if data itself is the graph payload (legacy)
//     if (!rawGraph && !data.status) {
//       rawGraph = data;
//     }

//     return { graph_data: rawGraph || data, insights: rawInsights || null };
//   };

//   const preLoaded = selectedGraphId ? graphs?.[selectedGraphId] : null;
//   const activeSource = lazyData || preLoaded;
//   const { graph_data: activeRawData, insights: activeInsights } =
//     unwrapResponse(activeSource);

//   // Debug log (can be removed later)
//   // console.log("GraphID:", selectedGraphId, "Processed Data:", activeRawData);

//   const activeError = lazyError || preLoaded?.error;

//   const loadGraph = (graphId, forceRefresh = false) => {
//     setSelectedGraphId(graphId);
//     setLazyError(null);
//     if (forceRefresh) setLazyData(null); // Clear old data on force refresh

//     // Use cached data if available and not forcing refresh
//     if (!forceRefresh && graphs && graphs[graphId] && !graphs[graphId].error)
//       return;

//     // Reset selections when switching graphs
//     if (graphId === "trade_pnl_plot") setSelectedStockIdx(0);
//     if (graphId === "swot_analysis") {
//       setSwotMode("real");
//       setSwotBench("FD");
//       setSwotRates({ fd: 7, mf: 15, inflation: 6 });
//       setAppliedRates({ fd: 7, mf: 15, inflation: 6 });
//     }
//     setShowSidebar(true);

//     if (!graphs || !graphs[graphId]) {
//       // If data is missing and we're not allowed to fetch anymore:
//       if (!file) {
//         // setLazyError("No file available.");
//         // return;
//       }
//       // Note: User says we don't require axios.post anymore as backend handles it via analyze-json
//       // So we just hope it's there or show an error.
//       if (!graphs || !graphs[graphId]) {
//         // setLazyError("Graph data not found in analysis.");
//       }
//     }
//   };

//   const closePage = () => {
//     setSelectedGraphId(null);
//     setLazyData(null);
//     setLazyError(null);
//     setLazyLoading(false);
//     setShowSwotGuide(false);
//   };

//   const getColorStyles = (color) => {
//     const map = {
//       emerald: {
//         border: "border-emerald-100",
//         bg: "bg-emerald-50/50",
//         text: "text-emerald-700",
//         hover: "hover:bg-emerald-50 hover:border-emerald-200",
//         icon: "text-emerald-600",
//       },
//       blue: {
//         border: "border-blue-100",
//         bg: "bg-blue-50/50",
//         text: "text-blue-700",
//         hover: "hover:bg-blue-50 hover:border-blue-200",
//         icon: "text-blue-600",
//       },
//       violet: {
//         border: "border-violet-100",
//         bg: "bg-violet-50/50",
//         text: "text-violet-700",
//         hover: "hover:bg-violet-50 hover:border-violet-200",
//         icon: "text-violet-600",
//       },
//       rose: {
//         border: "border-rose-100",
//         bg: "bg-rose-50/50",
//         text: "text-rose-700",
//         hover: "hover:bg-rose-50 hover:border-rose-200",
//         icon: "text-rose-600",
//       },
//       amber: {
//         border: "border-amber-100",
//         bg: "bg-amber-50/50",
//         text: "text-amber-700",
//         hover: "hover:bg-amber-50 hover:border-amber-200",
//         icon: "text-amber-600",
//       },
//       cyan: {
//         border: "border-cyan-100",
//         bg: "bg-cyan-50/50",
//         text: "text-cyan-700",
//         hover: "hover:bg-cyan-50 hover:border-cyan-200",
//         icon: "text-cyan-600",
//       },
//       green: {
//         border: "border-green-100",
//         bg: "bg-green-50/50",
//         text: "text-green-700",
//         hover: "hover:bg-green-50 hover:border-green-200",
//         icon: "text-green-600",
//       },
//       indigo: {
//         border: "border-indigo-100",
//         bg: "bg-indigo-50/50",
//         text: "text-indigo-700",
//         hover: "hover:bg-indigo-50 hover:border-indigo-200",
//         icon: "text-indigo-600",
//       },
//     };
//     return map[color] || map.blue;
//   };

//   const transformData = (graphId, rawData) => {
//     if (!rawData) return null;
//     try {
//       // ----------------- CASE: UNDERWATER PLOT (Custom Dual-Axis) -----------------
//       // ----------------- CASE: UNDERWATER PLOT (Custom Dual-Axis Subplots) -----------------
//       if (graphId === "underwater_plot") {
//         const { dates, drawdown_pct, portfolio_value, invested_value } =
//           rawData;
//         if (!dates || !drawdown_pct) return null;

//         const x = dates;
//         const y = drawdown_pct;
//         const invested = invested_value;

//         // Colors (Pastel & Modern)
//         // Value: Indigo-500 (#6366f1)
//         // Invested: Slate-500 (#64748b) - Dashed
//         // Drawdown: Rose-500 (#f43f5e) - Filled Area

//         return {
//           data: [
//             // Top Chart: Portfolio Value vs Invested
//             {
//               x: x,
//               y: portfolio_value,
//               type: "scatter",
//               mode: "lines",
//               name: "Portfolio Value",
//               line: { color: "#6366f1", width: 2 },
//               hovertemplate: "<b>Value</b>: ₹%{y:,.0f}<extra></extra>",
//               xaxis: "x",
//               yaxis: "y",
//             },
//             {
//               x: x,
//               y: invested || [], // Handle missing if old backend
//               type: "scatter",
//               mode: "lines",
//               name: "Invested Capital (Cost Basis)",
//               line: { color: "#334155", width: 2.5, dash: "dash" }, // Slate-700, Thicker Dash
//               hovertemplate: "<b>Invested</b>: ₹%{y:,.0f}<extra></extra>",
//               xaxis: "x",
//               yaxis: "y",
//             },
//             // Bottom Chart: Drawdown %
//             {
//               x: x,
//               y: y,
//               type: "scatter",
//               mode: "lines",
//               fill: "tozeroy",
//               name: "Drawdown from Peak %",
//               line: { color: "#dc2626", width: 1.5 }, // Red-600
//               fillcolor: "rgba(220, 38, 38, 0.15)", // Slightly darker fill for visibility
//               hovertemplate: "<b>Drawdown</b>: %{y:.2f}%<extra></extra>",
//               xaxis: "x2",
//               yaxis: "y2",
//             },
//           ],
//           layout: {
//             title: {
//               text: "Portfolio Performance & Drawdown",
//               font: {
//                 family: "Inter, system-ui, sans-serif",
//                 size: 20,
//                 color: "#0f172a",
//                 weight: 600,
//               },
//               y: 0.98,
//               x: 0.05, // Align left for modern feel
//               xanchor: "left",
//             },
//             hovermode: "x unified",
//             plot_bgcolor: "white",
//             paper_bgcolor: "white",
//             margin: { t: 80, b: 50, l: 60, r: 40 }, // Increased Top Margin
//             grid: {
//               rows: 2,
//               columns: 1,
//               pattern: "independent",
//               roworder: "top to bottom",
//             },

//             // Top Axis (Value) - Takes 65% height
//             xaxis: {
//               showticklabels: false, // Clean look, share x-axis
//               anchor: "y",
//               domain: [0, 1],
//               zeroline: false,
//               showgrid: true,
//               gridcolor: "#f1f5f9",
//               linecolor: "#e2e8f0", // Subtle axis line
//               linewidth: 1,
//             },
//             yaxis: {
//               title: "<b>Portfolio Value (₹)</b>",
//               titlefont: {
//                 color: "#6366f1",
//                 family: "Inter, sans-serif",
//                 size: 12,
//                 weight: 600,
//               },
//               tickfont: {
//                 color: "#64748b",
//                 family: "Inter, sans-serif",
//                 size: 11,
//               }, // Muted tick color
//               gridcolor: "#f1f5f9",
//               domain: [0.45, 1], // Condensed top chart slightly
//               zeroline: false,
//               autorange: true,
//             },

//             // Bottom Axis (Drawdown) - Takes 35% height
//             xaxis2: {
//               anchor: "y2",
//               title: "<b>Date</b>",
//               titlefont: {
//                 family: "Inter, sans-serif",
//                 size: 12,
//                 color: "#94a3b8",
//                 weight: 600,
//               },
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#94a3b8",
//                 size: 11,
//               },
//               gridcolor: "#f1f5f9",
//               domain: [0, 1],
//               showgrid: false,
//             },
//             yaxis2: {
//               title: "<b>Drawdown %</b>",
//               titlefont: { color: "#f43f5e", family: "Inter", size: 14 },
//               tickfont: { color: "#f43f5e", family: "Inter", size: 12 },
//               gridcolor: "#f1f5f9",
//               domain: [0, 0.35], // Increased Bottom Height (35%)
//               zeroline: true,
//               zerolinecolor: "#e2e8f0",
//             },

//             legend: {
//               orientation: "h",
//               y: 1.05,
//               x: 0.5,
//               xanchor: "center",
//               bgcolor: "rgba(255,255,255,0.8)",
//             },
//           },
//         };
//       }

//       // Case 1: Backend Wrapper (Risk Matrix & others)
//       // If rawData has 'figure', it's the standard Plotly JSON
//       if (rawData.figure) {
//         // Deep copy
//         const figure = JSON.parse(JSON.stringify(rawData.figure));
//         // Ensure layout exists
//         if (!figure.layout) figure.layout = {};

//         // Client-Side Theme Enforcement (to ensure style updates apply)
//         const pastelColors = {
//           "High Return, Low Risk": "#34d399", // Pastel Emerald
//           "High Return, High Risk": "#fbbf24", // Pastel Amber
//           "Low Return, Low Risk": "#60a5fa", // Pastel Blue
//           "Low Return, High Risk": "#f87171", // Pastel Rose
//         };

//         if (figure.data && Array.isArray(figure.data)) {
//           figure.data.forEach((trace) => {
//             if (pastelColors[trace.name]) {
//               trace.marker = {
//                 ...trace.marker,
//                 color: pastelColors[trace.name],
//                 size: 18,
//                 line: { width: 2, color: "white" },
//                 opacity: 0.9,
//               };
//             }
//           });
//         }

//         // Enforce Clean Layout
//         figure.layout = {
//           ...figure.layout,
//           font: { family: "Inter, sans-serif", size: 12, color: "#64748b" },
//           plot_bgcolor: "white",
//           paper_bgcolor: "white",
//           margin: { t: 60, b: 40, l: 60, r: 40 },
//           xaxis: {
//             ...figure.layout.xaxis,
//             gridcolor: "#f1f5f9",
//             zeroline: true,
//             zerolinecolor: "#cbd5e1",
//             gridwidth: 1,
//             griddash: "dot",
//           },
//           yaxis: {
//             ...figure.layout.yaxis,
//             gridcolor: "#f1f5f9",
//             zeroline: true,
//             zerolinecolor: "#cbd5e1",
//             gridwidth: 1,
//             griddash: "dot",
//           },
//           legend: {
//             orientation: "h",
//             yanchor: "bottom",
//             y: 1.02,
//             xanchor: "center",
//             x: 0.5,
//           },
//         };

//         return figure;
//       }

//       // Case 2: Direct Plotly Object
//       if (rawData.data && rawData.layout) return rawData;

//       // ----------------- CASE: SWOT ANALYSIS -----------------
//       if (graphId === "swot_analysis") {
//         // Check if data is nested inside 'graph_data' key unexpectedly
//         const data = rawData.graph_data || rawData;

//         if (!data.FD || !data.MF) return null;

//         const getTraceData = (bench, mode) => {
//           const d = data[bench][mode];
//           if (!d)
//             return {
//               x: [],
//               y: [],
//               text: [],
//               customdata: [],
//               marker: { color: [] },
//             };

//           const colors = d.x.map((xVal, i) => {
//             const yVal = d.y[i];
//             if (xVal < 0 && yVal > 0) return "#3b82f6"; // Strength
//             if (xVal > 0 && yVal > 0) return "#10b981"; // Opportunity
//             if (xVal < 0 && yVal < 0) return "#f59e0b"; // Weakness
//             return "#ef4444"; // Threat
//           });

//           const BASE_RATES = { fd: 7.0, mf: 15.0, inflation: 6.0 };
//           const curBenchId = swotBench.toLowerCase();
//           const targetBenchRate = appliedRates[curBenchId];
//           const targetInfl = appliedRates.inflation;

//           const baseBenchRate = BASE_RATES[curBenchId];
//           const baseInfl = BASE_RATES.inflation;

//           const adjustedY = d.y.map((yVal) => {
//             if (swotMode === "nominal") {
//               // nominal_rel = (return - targetBench) = (y_old + baseBench) - targetBench
//               return yVal + (baseBenchRate - targetBenchRate);
//             } else {
//               // real_rel = (return - targetInfl - targetBench) = (y_old + baseInfl + baseBench) - targetInfl - targetBench
//               return yVal + (baseInfl + baseBenchRate) - (targetInfl + targetBenchRate);
//             }
//           });

//           // const colors = d.x.map((xVal, i) => {
//           //   const yVal = adjustedY[i];
//           //   if (xVal < 0 && yVal > 0) return "#3b82f6"; // Strength
//           //   if (xVal > 0 && yVal > 0) return "#10b981"; // Opportunity
//           //   if (xVal < 0 && yVal < 0) return "#f59e0b"; // Weakness
//           //   return "#ef4444"; // Threat
//           // });

//           return {
//             x: d.x,
//             y: adjustedY,
//             text: d.text.map((t) => t.split(" ")[0]),
//             customdata: d.text.map((t, i) => [
//               t,
//               d.x[i].toFixed(2),
//               adjustedY[i].toFixed(2),
//             ]),
//             marker: {
//               color: colors,
//               size: 18,
//               opacity: 0.8,
//               line: { width: 1.5, color: "white" },
//             },
//           };
//         };

//         const initial = getTraceData(swotBench, swotMode);

//         return {
//           data: [
//             {
//               x: initial.x,
//               y: initial.y,
//               mode: "markers",
//               type: "scatter",
//               marker: initial.marker,
//               customdata: initial.customdata,
//               hovertemplate:
//                 "<b>%{customdata[0]}</b><br>" +
//                 "Rel Risk: %{customdata[1]}%<br>" +
//                 "Rel Return: %{customdata[2]}%<br>" +
//                 "<extra></extra>",
//             },
//           ],
//           layout: {
//             title: {
//               text: `${swotMode === "real" ? "Real" : "Nominal"} Returns vs ${swotBench} (${appliedRates[swotBench.toLowerCase()]}%)`,
//               font: {
//                 family: "Inter, sans-serif",
//                 size: 24,
//                 color: "#1e293b",
//                 weight: 700,
//               },
//               y: 0.95,
//             },
//             autosize: true,
//             xaxis: {
//               title: "Relative Risk (Lower is Better)",
//               zeroline: true,
//               zerolinecolor: "#334155",
//               zerolinewidth: 2,
//               showgrid: true,
//               gridcolor: "#f1f5f9",
//               tickfont: { family: "Inter", color: "#64748b" },
//             },
//             yaxis: {
//               title: "Real Return % (Inflation Adjusted)",
//               zeroline: true,
//               zerolinecolor: "#334155",
//               zerolinewidth: 2,
//               showgrid: true,
//               gridcolor: "#f1f5f9",
//               tickfont: { family: "Inter", color: "#64748b" },
//             },
//             annotations: [
//               {
//                 x: 0.02,
//                 y: 0.98,
//                 xref: "paper",
//                 yref: "paper",
//                 text: "STRENGTHS",
//                 xanchor: "left",
//                 yanchor: "top",
//                 showarrow: false,
//                 font: {
//                   size: 24,
//                   color: "rgba(59, 130, 246, 0.1)",
//                   weight: 900,
//                 },
//               },
//               {
//                 x: 0.98,
//                 y: 0.98,
//                 xref: "paper",
//                 yref: "paper",
//                 text: "OPPORTUNITIES",
//                 xanchor: "right",
//                 yanchor: "top",
//                 showarrow: false,
//                 font: {
//                   size: 24,
//                   color: "rgba(16, 185, 129, 0.1)",
//                   weight: 900,
//                 },
//               },
//               {
//                 x: 0.02,
//                 y: 0.02,
//                 xref: "paper",
//                 yref: "paper",
//                 text: "WEAKNESSES",
//                 xanchor: "left",
//                 yanchor: "bottom",
//                 showarrow: false,
//                 font: {
//                   size: 24,
//                   color: "rgba(245, 158, 11, 0.1)",
//                   weight: 900,
//                 },
//               },
//               {
//                 x: 0.98,
//                 y: 0.02,
//                 xref: "paper",
//                 yref: "paper",
//                 text: "THREATS",
//                 xanchor: "right",
//                 yanchor: "bottom",
//                 showarrow: false,
//                 font: {
//                   size: 24,
//                   color: "rgba(239, 68, 68, 0.1)",
//                   weight: 900,
//                 },
//               },
//             ],
//             updatemenus: [],
//             hovermode: "closest",
//             template: "plotly_white",
//             margin: { t: 40, b: 40, l: 60, r: 40 },
//           },
//         };
//       }

//       // ----------------- CASE: TOP PERFORMING -----------------
//       if (graphId === "top_performing") {
//         if (!rawData.unrealized_gainers && !rawData.realized_gainers)
//           return null;
//         const {
//           unrealized_gainers,
//           realized_gainers,
//           unrealized_losers,
//           brokerage_highest,
//           has_brokerage,
//         } = rawData;
//         const colors = {
//           profit: "#10b981",
//           loss: "#ef4444",
//           brokerage: "#f59e0b",
//         };
//         const traces = [];

//         const addTrace = (d, name, color, visible) => {
//           if (d?.values?.length > 0) {
//             traces.push({
//               type: "bar",
//               x: d.labels,
//               y: d.values,
//               name,
//               marker: {
//                 color,
//                 line: { color: "rgba(255,255,255,0.5)", width: 0 },
//                 opacity: 0.85,
//                 cornerradius: 8,
//               },
//               text: d.values.map(
//                 (v) => `₹${Math.round(v).toLocaleString("en-IN")}`
//               ),
//               textposition: "auto",
//               textfont: {
//                 family: "Inter, sans-serif",
//                 size: 12,
//                 color: "white",
//               },
//               visible,
//             });
//           }
//         };

//         addTrace(unrealized_gainers, "Unrealized Gains", colors.profit, true);
//         addTrace(realized_gainers, "Realized Gains", "#059669", false);
//         addTrace(
//           unrealized_losers,
//           "Top Unrealized Losses",
//           colors.loss,
//           false
//         );
//         if (has_brokerage)
//           addTrace(
//             brokerage_highest,
//             "Brokerage Paid",
//             colors.brokerage,
//             false
//           );

//         const buttons = traces.map((t, i) => ({
//           label: t.name,
//           method: "update",
//           args: [
//             { visible: traces.map((_, j) => i === j) },
//             { title: `Top 10 Stocks by ${t.name}` },
//           ],
//         }));

//         return {
//           data: traces,
//           layout: {
//             title: {
//               text: "Top 10 Scrips",
//               font: {
//                 family: "Inter, sans-serif",
//                 size: 20,
//                 weight: 600,
//                 color: "#1e293b",
//               },
//             },
//             updatemenus: [
//               {
//                 buttons,
//                 direction: "down",
//                 showactive: true,
//                 x: 1,
//                 y: 1.15,
//                 bgcolor: "white",
//                 bordercolor: "#e2e8f0",
//                 font: { family: "Inter, sans-serif" },
//               },
//             ],
//             xaxis: {
//               title: "",
//               automargin: true,
//               showgrid: false,
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#64748b",
//                 size: 11,
//               },
//             },
//             yaxis: {
//               title: "",
//               automargin: true,
//               showgrid: true,
//               gridcolor: "#f1f5f9",
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#64748b",
//                 size: 11,
//               },
//             },
//             template: "plotly_white",
//             margin: { t: 80, b: 40, l: 60, r: 20 },
//             hovermode: "x",
//             font: { family: "Inter, sans-serif" },
//           },
//         };
//       }

//       // ----------------- CASE: PORTFOLIO HEALTH -----------------
//       if (graphId === "portfolio_health") {
//         const scrips = Object.keys(rawData || {});
//         if (scrips.length === 0) return null;
//         const traces = [];
//         const visibleScrip = scrips[0];

//         scrips.forEach((scrip) => {
//           const d = rawData[scrip];
//           if (!d) return;
//           const isVisible = scrip === visibleScrip;

//           if (d.deployed && d.deployed.length > 0) {
//             traces.push({
//               x: d.deployed.map((p) => p.x),
//               y: d.deployed.map((p) => p.y),
//               name: "Deployed",
//               type: "scatter",
//               fill: "tozeroy",
//               fillcolor: "rgba(59, 130, 246, 0.1)",
//               line: { color: "#3b82f6", width: 2 },
//               visible: isVisible,
//               legendgroup: scrip,
//             });
//           }
//           if (d.marketValue && d.marketValue.length > 0) {
//             traces.push({
//               x: d.marketValue.map((p) => p.x),
//               y: d.marketValue.map((p) => p.y),
//               name: "Market Value",
//               type: "scatter",
//               line: { color: "#10b981", width: 2 },
//               visible: isVisible,
//               legendgroup: scrip,
//             });
//           }
//           if (d.lastBuyDate) {
//             const buyY =
//               d.deployed.find((p) =>
//                 p.x.startsWith(d.lastBuyDate.split("T")[0])
//               )?.y || 0;
//             traces.push({
//               x: [d.lastBuyDate],
//               y: [buyY],
//               mode: "markers",
//               name: "Last Buy",
//               marker: {
//                 symbol: "star",
//                 size: 14,
//                 color: "#f59e0b",
//                 line: { width: 1, color: "white" },
//               },
//               visible: isVisible,
//               legendgroup: scrip,
//             });
//           }
//         });

//         const buttons = scrips.map((scrip) => {
//           const visibility = traces.map((t) => t.legendgroup === scrip);
//           return {
//             label: scrip,
//             method: "update",
//             args: [{ visible: visibility }, { title: `${scrip} Performance` }],
//           };
//         });

//         return {
//           data: traces,
//           layout: {
//             title: {
//               text: `${visibleScrip} Performance`,
//               font: {
//                 family: "Inter, sans-serif",
//                 size: 20,
//                 weight: 600,
//                 color: "#1e293b",
//               },
//             },
//             updatemenus: [
//               {
//                 buttons,
//                 direction: "down",
//                 showactive: true,
//                 x: 1.15,
//                 y: 1.15,
//                 xanchor: "right",
//                 yanchor: "top",
//                 bgcolor: "white",
//                 bordercolor: "#e2e8f0",
//                 font: { family: "Inter, sans-serif" },
//               },
//             ],
//             xaxis: {
//               title: "",
//               automargin: true,
//               showgrid: false,
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#64748b",
//                 size: 11,
//               },
//             },
//             yaxis: {
//               title: "Amount (₹)",
//               automargin: true,
//               showgrid: true,
//               gridcolor: "#f1f5f9",
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#64748b",
//                 size: 11,
//               },
//             },
//             template: "plotly_white",
//             margin: { t: 80, b: 40, l: 60, r: 80 },
//             hovermode: "x unified",
//             font: { family: "Inter, sans-serif" },
//           },
//         };
//       }

//       // ----------------- CASE: TURNOVER ANALYSIS -----------------
//       if (graphId === "combined_box_plot") {
//         if (!rawData.turnover_by_month || !rawData.turnover_stats) return null;
//         const boxTraces = rawData.turnover_by_month.map((m) => ({
//           y: m.values,
//           type: "box",
//           name: m.month,
//           marker: { color: "#f59e0b", size: 4 },
//           boxpoints: "outliers",
//           line: { width: 1.5 },
//           fillcolor: "rgba(251, 191, 36, 0.2)",
//           showlegend: false,
//           hoverinfo: "y+name",
//         }));
//         const avgTrace = {
//           x: rawData.turnover_stats.months,
//           y: rawData.turnover_stats.avg,
//           type: "scatter",
//           mode: "lines+markers",
//           name: "Avg Turnover",
//           line: { color: "#3b82f6", width: 3 },
//           marker: {
//             size: 6,
//             color: "white",
//             line: { width: 2, color: "#3b82f6" },
//           },
//         };
//         const countTrace = {
//           x: rawData.turnover_stats.months,
//           y: rawData.turnover_stats.trade_count,
//           type: "bar",
//           name: "Trade Count",
//           yaxis: "y2",
//           marker: { color: "#e2e8f0", opacity: 0.5 },
//           hoverinfo: "y+name",
//         };
//         return {
//           data: [...boxTraces, countTrace, avgTrace],
//           layout: {
//             title: {
//               text: "Monthly Turnover Distribution",
//               font: {
//                 family: "Inter, sans-serif",
//                 size: 20,
//                 weight: 600,
//                 color: "#1e293b",
//               },
//             },
//             xaxis: {
//               title: "",
//               automargin: true,
//               showgrid: false,
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#64748b",
//                 size: 11,
//               },
//             },
//             yaxis: {
//               title: "Turnover Value (₹)",
//               automargin: true,
//               showgrid: true,
//               gridcolor: "#f1f5f9",
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#64748b",
//                 size: 11,
//               },
//             },
//             yaxis2: {
//               title: "Trade Count",
//               overlaying: "y",
//               side: "right",
//               showgrid: false,
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#94a3b8",
//                 size: 10,
//               },
//             },
//             template: "plotly_white",
//             margin: { t: 80, b: 60, l: 60, r: 60 },
//             hovermode: "closest",
//             showlegend: true,
//             legend: { orientation: "h", y: -0.15 },
//             font: { family: "Inter, sans-serif" },
//           },
//         };
//       }

//       // ----------------- CASE: TRADE PNL PLOT -----------------
//       if (graphId === "trade_pnl_plot") {
//         let root = rawData;
//         if (root.graph_data) root = root.graph_data;
//         const stockMap = root.stock_data || root;
//         const validStockNames = Object.keys(stockMap || {}).filter((key) => {
//           const val = stockMap[key];
//           if (!val || typeof val !== "object") return false;
//           if (!Array.isArray(val.dates)) return false;
//           return true;
//         });
//         if (validStockNames.length === 0)
//           return {
//             data: [],
//             layout: { title: { text: "No Trade Data Available" } },
//           };

//         const traces = [];
//         validStockNames.forEach((stockName, idx) => {
//           const d = stockMap[stockName];
//           const isVisible = idx === selectedStockIdx;
//           traces.push({
//             x: d.dates,
//             y: d.prices,
//             name: "Price",
//             type: "scatter",
//             mode: "lines",
//             line: { color: "#007bff", width: 2 },
//             fill: "tozeroy",
//             fillcolor: "rgba(0, 123, 255, 0.05)",
//             visible: isVisible,
//             legendgroup: stockName,
//           });
//           traces.push({
//             x: d.dates,
//             y: d.trend,
//             name: "5-Day Trend",
//             type: "scatter",
//             mode: "lines",
//             line: { color: "#ffa500", width: 2, dash: "dash" },
//             visible: isVisible,
//             legendgroup: stockName,
//           });
//           const markerColors = d.maj_outcomes.map((o) =>
//             (o || "").toLowerCase().includes("good") ? "#28a745" : "#dc3545"
//           );
//           traces.push({
//             x: d.maj_dates,
//             y: d.maj_prices,
//             mode: "markers",
//             name: "Trades",
//             text: d.maj_outcomes,
//             marker: {
//               size: 10,
//               color: markerColors,
//               line: { color: "white", width: 1.5 },
//             },
//             visible: isVisible,
//             legendgroup: stockName,
//             hovertemplate:
//               "<b>%{text}</b><br>Date: %{x}<br>Price: ₹%{y:.2f}<extra></extra>",
//           });
//         });

//         const updatemenus = [];

//         return {
//           data: traces,
//           layout: {
//             title: {
//               text: "Trade P&L Analysis",
//               font: {
//                 family: "Inter, sans-serif",
//                 size: 20,
//                 weight: 600,
//                 color: "#1e293b",
//               },
//             },
//             xaxis: {
//               title: "Date",
//               showgrid: false,
//               zeroline: false,
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#64748b",
//                 size: 11,
//               },
//             },
//             yaxis: {
//               title: "Price (₹)",
//               showgrid: true,
//               zeroline: false,
//               gridcolor: "#f1f5f9",
//               tickfont: {
//                 family: "Inter, sans-serif",
//                 color: "#64748b",
//                 size: 11,
//               },
//             },
//             updatemenus,
//             hovermode: "closest",
//             showlegend: true,
//             legend: { orientation: "h", y: -0.2 },
//             template: "plotly_white",
//             margin: { t: 80, b: 40, l: 60, r: 80 },
//             font: { family: "Inter, sans-serif" },
//           },
//         };
//       }
//       return null;
//     } catch (err) {
//       console.error("Graph transformation error:", err);
//       return { error: "Failed to render graph. Data may be incomplete." };
//     }
//   };

//   const processedData = React.useMemo(() => {
//     return transformData(selectedGraphId, activeRawData);
//   }, [selectedGraphId, activeRawData, swotMode, swotBench, selectedStockIdx, appliedRates]);

//   return (
//     <div className="space-y-6 font-sans">
//       <LoadingScreen isVisible={lazyLoading} />

//       {/* MAIN GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {GRAPH_METADATA.map((graph) => {
//           const Icon = graph.icon;
//           const styles = getColorStyles(graph.color);
//           return (
//             <button
//               key={graph.id}
//               onClick={() => loadGraph(graph.id)}
//               className={`group relative p-6 rounded-2xl border text-left w-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 ${styles.border} ${styles.bg} ${styles.hover}`}
//             >
//               <div className="flex items-center gap-4 mb-4">
//                 <div
//                   className={`p-3 rounded-xl bg-white shadow-sm ${styles.icon} transition-transform duration-300 group-hover:scale-110`}
//                 >
//                   <Icon className="w-6 h-6" />
//                 </div>
//                 <h3 className={`font-bold text-base ${styles.text}`}>
//                   {graph.title}
//                 </h3>
//               </div>
//               <p className="text-xs text-slate-500 leading-relaxed font-medium">
//                 {graph.description}
//               </p>
//             </button>
//           );
//         })}
//       </div>

//       {/* FULL SCREEN OVERLAY */}
//       {selectedGraphId && !lazyLoading && (
//         <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-white flex flex-col animate-fade-in">
//           {/* TOP NAV BAR (Responsive) */}
//           <div className="flex-none border-b bg-white px-4 py-3 flex items-center justify-between shadow-sm z-10">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={closePage}
//                 className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
//                 title="Back to Catalog"
//               >
//                 <ArrowLeft className="w-6 h-6" />
//               </button>
//               <div>
//                 <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-none">
//                   {GRAPH_METADATA.find((g) => g.id === selectedGraphId)?.title}
//                 </h2>
//                 <p className="hidden md:block text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
//                   Interactive Portfolio Analysis
//                 </p>
//               </div>
//             </div>

//             {/* <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setShowSidebar(!showSidebar)}
//                 className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold ${showSidebar
//                   ? "bg-slate-100 text-slate-700"
//                   : "bg-blue-600 text-white shadow-lg shadow-blue-200"
//                   }`}
//               >
//                 {showSidebar ? (
//                   <>
//                     <X className="w-4 h-4" />
//                     <span className="hidden sm:inline">Normal View</span>
//                   </>
//                 ) : (
//                   <>
//                     <Layers className="w-4 h-4" />
//                     <span className="hidden sm:inline">Expand Plot</span>
//                   </>
//                 )}
//               </button>
//             </div> */}
//           </div>

//           <div className="flex-1 flex flex-col lg:flex-row w-full h-full bg-slate-50 overflow-hidden animate-slide-up">
//             <div className="flex-1 flex flex-col relative bg-white border-r border-slate-100">
//               {/* CONTROL BAR (Responsive Contextual Controls) */}
//               <div className="flex-none border-b bg-slate-50/50 p-2 md:p-3 overflow-x-auto">
//                 <div className="flex items-center gap-3 min-w-min">
//                   {/* SWOT CONTROLS */}
//                   {selectedGraphId === "swot_analysis" && (
//                     <div className="flex items-center gap-2 md:gap-4 shrink-0">
//                       <div className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-lg border border-slate-200 shadow-sm">
//                         <select
//                           value={swotBench}
//                           onChange={(e) => setSwotBench(e.target.value)}
//                           className="bg-transparent text-xs md:text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
//                         >
//                           <option value="FD">vs FD</option>
//                           <option value="MF">vs MF</option>
//                         </select>
//                         <div className="w-px h-4 bg-slate-200"></div>
//                         <select
//                           value={swotMode}
//                           onChange={(e) => setSwotMode(e.target.value)}
//                           className="bg-transparent text-xs md:text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
//                         >
//                           <option value="nominal">Nominal</option>
//                           <option value="real">Real</option>
//                         </select>
//                       </div>

//                       <div className="flex items-center gap-2 md:gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
//                         {[
//                           { label: "FD", key: "fd" },
//                           { label: "MF", key: "mf" },
//                           { label: "INF", key: "inflation" },
//                         ].map((rate) => (
//                           <div
//                             key={rate.key}
//                             className="flex items-center gap-1"
//                           >
//                             <label className="text-[10px] font-black text-slate-400 uppercase">
//                               {rate.label}
//                             </label>
//                             <input
//                               type="number"
//                               value={swotRates[rate.key]}
//                               onChange={(e) =>
//                                 setSwotRates((prev) => ({
//                                   ...prev,
//                                   [rate.key]:
//                                     parseFloat(e.target.value) || 0,
//                                 }))
//                               }
//                               className="w-10 md:w-12 p-0.5 text-xs md:text-sm font-bold text-slate-700 text-center focus:outline-none border-b border-transparent focus:border-blue-500"
//                             />
//                             <span className="text-xs text-slate-400">%</span>
//                           </div>
//                         ))}
//                       </div>

//                       <button
//                         onClick={() => setAppliedRates({ ...swotRates })}
//                         className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 text-xs md:text-sm font-bold"
//                       >
//                         <RefreshCw className="w-4 h-4" />
//                         <span>Calc</span>
//                       </button>

//                       <button
//                         onClick={() => setShowSwotGuide(!showSwotGuide)}
//                         className={`p-2 rounded-lg transition-colors ${showSwotGuide
//                           ? "bg-amber-100 text-amber-700"
//                           : "text-slate-400 hover:bg-slate-100"
//                           }`}
//                         title="How to read this graph"
//                       >
//                         <Info className="w-5 h-5" />
//                       </button>
//                     </div>
//                   )}

//                   {/* TRADE PNL PLOT STOCK SELECTOR */}
//                   {selectedGraphId === "trade_pnl_plot" && (
//                     <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm shrink-0">
//                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                         Selected Asset
//                       </span>
//                       <select
//                         value={selectedStockIdx}
//                         onChange={(e) =>
//                           setSelectedStockIdx(parseInt(e.target.value))
//                         }
//                         className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
//                       >
//                         {(() => {
//                           let root = activeRawData;
//                           if (root.graph_data) root = root.graph_data;
//                           const stockMap = root.stock_data || root;
//                           const validNames = Object.keys(stockMap || {}).filter(
//                             (key) => {
//                               const val = stockMap[key];
//                               return (
//                                 val &&
//                                 typeof val === "object" &&
//                                 Array.isArray(val.dates)
//                               );
//                             }
//                           );
//                           return validNames.map((name, i) => (
//                             <option key={name} value={i}>
//                               {name}
//                             </option>
//                           ));
//                         })()}
//                       </select>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* SWOT GUIDE MODAL (Absolute Overlay) */}
//               {showSwotGuide && selectedGraphId === "swot_analysis" && (
//                 <div className="absolute top-16 right-4 z-50 w-72 md:w-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-slate-200 p-6 animate-scale-in">
//                   <div className="flex justify-between items-center mb-6">
//                     <div>
//                       <h4 className="font-bold text-slate-900">
//                         Interpret Matrix
//                       </h4>
//                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                         Strategic Quadrants
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => setShowSwotGuide(false)}
//                       className="p-1 hover:bg-slate-100 rounded-full"
//                     >
//                       <X className="w-4 h-4 text-slate-400" />
//                     </button>
//                   </div>
//                   <div className="space-y-4 text-xs font-medium">
//                     {[
//                       {
//                         label: "Strengths",
//                         col: "blue",
//                         emoji: "🟦",
//                         desc: `Beating MF (${appliedRates.mf}%). High-alpha winners to hold.`,
//                       },
//                       {
//                         label: "Opportunities",
//                         col: "emerald",
//                         emoji: "🟩",
//                         desc: `Beating FD (${appliedRates.fd}%) but below MF. Growing potential.`,
//                       },
//                       {
//                         label: "Weaknesses",
//                         col: "amber",
//                         emoji: "🟧",
//                         desc: `Returns below FD. High opportunity cost.`,
//                       },
//                       {
//                         label: "Threats",
//                         col: "rose",
//                         emoji: "🟥",
//                         desc: `Negative returns. Capital erosion risk.`,
//                       },
//                     ].map((item) => (
//                       <div key={item.label} className="flex gap-4">
//                         <div
//                           className={`w-10 h-10 rounded-xl bg-${item.col}-50 flex items-center justify-center shrink-0 border border-${item.col}-100`}
//                         >
//                           <span className="text-xl">{item.emoji}</span>
//                         </div>
//                         <div>
//                           <strong className={`block text-${item.col}-700 mb-0.5`}>
//                             {item.label}
//                           </strong>
//                           <span className="text-slate-500 leading-tight">
//                             {item.desc}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="flex-1 bg-white relative overflow-hidden graph-container">
//                 {activeError || processedData?.error ? (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center max-w-sm p-6 bg-rose-50 rounded-2xl border border-rose-100">
//                       <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
//                       <p className="text-rose-600 font-medium">
//                         {activeError || processedData?.error}
//                       </p>
//                     </div>
//                   </div>
//                 ) : processedData ? (
//                   <div className="w-full h-full relative">
//                     <ErrorBoundary>
//                       <Plot
//                         data={processedData.data}
//                         layout={{ ...processedData.layout }}
//                         config={{ responsive: true, displayModeBar: false }}
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           minHeight: "500px",
//                         }}
//                         useResizeHandler={true}
//                         className="plotly-chart"
//                       />
//                     </ErrorBoundary>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full text-slate-300 font-medium">
//                     No Data
//                   </div>
//                 )}
//               </div>
//             </div>

//             {showSidebar && (
//               <div className="w-full lg:w-[380px] xl:w-[420px] bg-slate-50 border-l border-slate-100 overflow-y-auto p-4 md:p-8 animate-slide-left shrink-0">
//                 {activeInsights &&
//                   (Array.isArray(activeInsights)
//                     ? activeInsights.length > 0
//                     : activeInsights.key_takeaways?.length > 0 ||
//                     activeInsights.recommendations?.length > 0) ? (
//                   <div className="space-y-6">
//                     {/* Handle array of insights (Risk-Return Matrix format) */}
//                     {Array.isArray(activeInsights) &&
//                       activeInsights.length > 0 && (
//                         <div className="space-y-4">
//                           <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-4 flex items-center gap-2">
//                             <Sparkles className="w-4 h-4" /> Risk Analysis
//                             Insights
//                           </h3>
//                           {activeInsights.map((item, idx) => {
//                             const isGuide = item.type === "guide";
//                             return (
//                               <div
//                                 key={idx}
//                                 className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md animate-slide-up ${isGuide
//                                   ? "bg-blue-50/50 border-blue-100"
//                                   : "bg-white border-slate-100"
//                                   }`}
//                                 style={{ animationDelay: `${idx * 0.1}s` }}
//                               >
//                                 {isGuide && (
//                                   <Info className="float-right w-4 h-4 text-blue-400 ml-2" />
//                                 )}
//                                 <h4
//                                   className={`font-bold mb-2 text-sm ${isGuide ? "text-blue-800" : "text-slate-800"
//                                     }`}
//                                 >
//                                   {item.title}
//                                 </h4>
//                                 <div
//                                   className="text-sm font-medium text-slate-700 mb-2 leading-relaxed"
//                                   dangerouslySetInnerHTML={{
//                                     __html: item.text?.replace(
//                                       /\*\*(.*?)\*\*/g,
//                                       "<strong>$1</strong>"
//                                     ),
//                                   }}
//                                 />
//                                 {item.reasoning && (
//                                   <div
//                                     className={`text-xs leading-relaxed ${isGuide ? "text-blue-600" : "text-slate-500"
//                                       }`}
//                                   >
//                                     <div
//                                       dangerouslySetInnerHTML={{
//                                         __html: item.reasoning
//                                           ?.replace(/\n/g, "<br/>")
//                                           .replace(
//                                             /\*\*(.*?)\*\*/g,
//                                             "<strong>$1</strong>"
//                                           ),
//                                       }}
//                                     />
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       )}

//                     {/* Handle legacy object format (key_takeaways/recommendations) */}
//                     {!Array.isArray(activeInsights) &&
//                       activeInsights.key_takeaways?.length > 0 && (
//                         <div
//                           className="animate-slide-up"
//                           style={{ animationDelay: "0.1s" }}
//                         >
//                           <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
//                             <Sparkles className="w-4 h-4" /> Key Insights
//                           </h3>
//                           <ul className="space-y-4">
//                             {activeInsights.key_takeaways.map((item, idx) => {
//                               const isStr = typeof item === "string";
//                               const title = isStr ? null : item?.title;
//                               const text = isStr ? item : item?.text || "";
//                               const reasoning = isStr ? null : item?.reasoning;
//                               return (
//                                 <li
//                                   key={idx}
//                                   className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${item.type === "guide"
//                                     ? "bg-blue-50/50 border-blue-100"
//                                     : "bg-white border-slate-100"
//                                     }`}
//                                 >
//                                   {title && (
//                                     <div
//                                       className={`font-bold mb-2 text-sm ${item.type === "guide"
//                                         ? "text-blue-800"
//                                         : "text-slate-800"
//                                         }`}
//                                     >
//                                       {title}
//                                     </div>
//                                   )}
//                                   <div
//                                     className="text-sm text-slate-600 leading-relaxed mb-3"
//                                     dangerouslySetInnerHTML={{
//                                       __html: (text && typeof text === "string"
//                                         ? text
//                                         : ""
//                                       )
//                                         .replace(
//                                           /\*\*(.*?)\*\*/g,
//                                           "<strong>$1</strong>"
//                                         )
//                                         .replace(/\n/g, "<br/>"),
//                                     }}
//                                   />
//                                   {reasoning && (
//                                     <div
//                                       className={`text-xs p-3 rounded-lg italic ${item.type === "guide"
//                                         ? "text-blue-600 bg-blue-100/50"
//                                         : "text-slate-400 bg-slate-50"
//                                         }`}
//                                     >
//                                       {item.type === "guide" ? "ℹ️ " : "💡 "}
//                                       {reasoning}
//                                     </div>
//                                   )}
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         </div>
//                       )}

//                     {!Array.isArray(activeInsights) &&
//                       activeInsights.recommendations?.length > 0 && (
//                         <div
//                           className="animate-slide-up"
//                           style={{ animationDelay: "0.2s" }}
//                         >
//                           <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2">
//                             <Target className="w-4 h-4" /> Action Plan
//                           </h3>
//                           <ul className="space-y-4">
//                             {activeInsights.recommendations.map((item, idx) => {
//                               const isStr = typeof item === "string";
//                               const title = isStr ? null : item?.title;
//                               const text = isStr ? item : item?.text || "";
//                               const reasoning = isStr ? null : item?.reasoning;
//                               return (
//                                 <li
//                                   key={idx}
//                                   className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
//                                 >
//                                   {title && (
//                                     <div className="font-bold text-slate-800 mb-2 text-sm">
//                                       {title}
//                                     </div>
//                                   )}
//                                   <div
//                                     className="text-sm text-slate-600 leading-relaxed mb-3"
//                                     dangerouslySetInnerHTML={{
//                                       __html: (text && typeof text === "string"
//                                         ? text
//                                         : ""
//                                       )
//                                         .replace(
//                                           /\*\*(.*?)\*\*/g,
//                                           "<strong>$1</strong>"
//                                         )
//                                         .replace(/\n/g, "<br/>"),
//                                     }}
//                                   />
//                                   {reasoning && (
//                                     <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg italic">
//                                       🎯 {reasoning}
//                                     </div>
//                                   )}
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         </div>
//                       )}
//                   </div>
//                 ) : (
//                   <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8">
//                     <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
//                       <Sparkles className="w-8 h-8 text-slate-300" />
//                     </div>
//                     <p className="font-medium">No insights generated</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <style>{`
//         .plotly-chart .cursor-crosshair { cursor: default !important; }
//         .js-plotly-plot .plotly .cursor-crosshair { cursor: default !important; }

//         @keyframes fadeIn { 
//           from { opacity: 0; } 
//           to { opacity: 1; } 
//         }

//         @keyframes slideUp { 
//           from { opacity: 0; transform: translateY(20px); } 
//           to { opacity: 1; transform: translateY(0); } 
//         }

//         @keyframes slideLeft { 
//           from { opacity: 0; transform: translateX(30px); } 
//           to { opacity: 1; transform: translateX(0); } 
//         }

//         @keyframes scaleIn { 
//           from { opacity: 0; transform: scale(0.95); } 
//           to { opacity: 1; transform: scale(1); } 
//         }

//         .animate-fade-in { 
//           animation: fadeIn 0.3s ease-out forwards; 
//         }

//         .animate-slide-up { 
//           animation: slideUp 0.5s ease-out forwards; 
//           opacity: 0; 
//         }

//         .animate-slide-left { 
//           animation: slideLeft 0.4s ease-out forwards; 
//         }

//         .animate-scale-in { 
//           animation: scaleIn 0.4s ease-out forwards; 
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GraphCatalog;



import React, { useState, useEffect } from "react";
import {
  BarChart2,
  Activity,
  PieChart,
  Target,
  BarChart3,
  Clock,
  DollarSign,
  Layers,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Info,
  X,
  ChevronDown,
  ChevronRight,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Network,
} from "lucide-react";
import PlotlyReact from "react-plotly.js";
const Plot = PlotlyReact.default || PlotlyReact;
import axios from "axios";
import LoadingScreen from "./LoadingScreen";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Graph Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full max-h-[500px]">
          <div className="text-center p-6 bg-rose-50 rounded-2xl border border-rose-100 max-w-sm mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-rose-700 font-bold mb-1">Rendering Error</h3>
            <p className="text-rose-600 text-sm mb-2">
              Something went wrong while displaying this graph.
            </p>
            <p className="text-xs text-rose-400 font-mono bg-rose-100 p-2 rounded break-all">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 px-4 py-2 bg-white border border-rose-200 text-rose-600 text-xs font-semibold rounded-lg hover:bg-rose-50 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// SwapsDashboard merged into this file below

const GRAPH_METADATA = [
  {
    id: "top_performing",
    title: "Top Performers",
    description: "Identifies your best and worst performing stocks by returns",
    icon: BarChart2,
    color: "emerald",
  },
  {
    id: "portfolio_health",
    title: "Portfolio Health",
    description: "Tracks deployed capital and value evolution over time",
    icon: Activity,
    color: "blue",
  },
  {
    id: "swot_analysis",
    title: "SWOT Analysis",
    description:
      "Strategic analysis of portfolio strengths, weaknesses, opportunities, and threats",
    icon: Target,
    color: "violet",
  },
  {
    id: "risk_return",
    title: "Risk-Return Matrix",
    description: "Classifies stocks into risk quadrants for rebalancing",
    icon: PieChart,
    color: "rose",
  },
  {
    id: "combined_box_plot",
    title: "Turnover Analysis",
    description: "Statistical view of holding periods and trading patterns",
    icon: BarChart3,
    color: "amber",
  },

  {
    id: "underwater_plot",
    title: "Underwater Plot",
    description:
      "Visualizes portfolio drawdown from peaks and identifies major contributors",
    icon: TrendingDown,
    color: "rose",
  },
  {
    id: "trade_pnl_plot",
    title: "P&L Timeline",
    description: "Chronological view of all realized profits and losses",
    icon: DollarSign,
    color: "green",
  },


  {
    id: "correlation_plot",
    title: "Correlation Analysis",
    description:
      "Visualize price correlations with benchmarks and between stocks",
    icon: Network,
    color: "cyan",
  },
];

// ===========================================
// MERGED SWAPS DASHBOARD COMPONENT
// ===========================================

const GraphCatalog = ({ graphs, file, isExporting = false }) => {
  const [selectedGraphId, setSelectedGraphId] = useState(null);
  const [lazyData, setLazyData] = useState(null);
  const [lazyLoading, setLazyLoading] = useState(false);
  const [lazyError, setLazyError] = useState(null);

  // SWOT Specific State
  const [swotRates, setSwotRates] = useState({ fd: 7, mf: 15, inflation: 6 });
  const [appliedRates, setAppliedRates] = useState({ fd: 7, mf: 15, inflation: 6 });
  const [showSwotGuide, setShowSwotGuide] = useState(false);
  const [swotMode, setSwotMode] = useState("real"); // "nominal" | "real"
  const [swotBench, setSwotBench] = useState("FD"); // "FD" | "MF"

  // Sidebar Visibility
  const [showSidebar, setShowSidebar] = useState(true);
  // Correlation Plot Specific State
  const [showCorrelationInfo, setShowCorrelationInfo] = useState(false);
  // Trade P&L Selection State
  const [selectedStockIdx, setSelectedStockIdx] = useState(0);

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setTheme(isDark ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when loading screen or graph overlay is active
  useEffect(() => {
    const shouldLock = selectedGraphId || lazyLoading;
    document.body.style.overflow = shouldLock ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedGraphId, lazyLoading]);

  // Force resize on graph load to fix Plotly rendering issues
  useEffect(() => {
    if (selectedGraphId && !lazyLoading) {
      // Trigger a resize event to ensure Plotly calculates dimensions correctly
      // inside the flex container
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }
  }, [selectedGraphId, lazyLoading, lazyData]);

  // Generic unwrapping: normalize backend responses into { graph_data, insights }
  const unwrapResponse = (data) => {
    if (!data || typeof data !== "object") {
      return { graph_data: null, insights: null };
    }

    // 1. Check for standard envelope { status, graph_data, insights }
    let rawGraph = data.graph_data;
    let rawInsights = data.insights;

    // 1.5. If insights are inside graph_data (lazy-loaded graphs like correlation_plot)
    if (rawGraph && rawGraph.insights && !rawInsights) {
      rawInsights = rawGraph.insights;
    }

    // 2. recursive unwrap if 'graph_data' is nested inside 'graph_data'
    // This happens if the backend returns { graph_data: { graph_data: ... } }
    if (rawGraph && rawGraph.graph_data) {
      rawInsights = rawGraph.insights || rawInsights;
      rawGraph = rawGraph.graph_data;
    }

    // 3. Fallback: if data itself is the graph payload (legacy)
    if (!rawGraph && !data.status) {
      rawGraph = data;
    }

    return { graph_data: rawGraph || data, insights: rawInsights || null };
  };

  const preLoaded = selectedGraphId ? graphs?.[selectedGraphId] : null;
  const activeSource = lazyData || preLoaded;
  const { graph_data: activeRawData, insights: activeInsights } =
    unwrapResponse(activeSource);

  // Debug insights for correlation plot
  if (selectedGraphId === "correlation_plot") {
    console.log("=== CORRELATION PLOT DEBUG ===");
    console.log("activeSource:", activeSource);
    console.log("activeRawData:", activeRawData);
    console.log("activeInsights:", activeInsights);
    console.log("==============================");
  }

  const activeError = lazyError || preLoaded?.error;

  const loadGraph = (graphId, forceRefresh = false) => {
    setSelectedGraphId(graphId);
    setLazyError(null);
    if (forceRefresh) setLazyData(null); // Clear old data on force refresh

    // Use cached data if available and not forcing refresh
    if (!forceRefresh && graphs && graphs[graphId] && !graphs[graphId].error)
      return;

    // Reset selections when switching graphs
    if (graphId === "trade_pnl_plot") setSelectedStockIdx(0);
    if (graphId === "swot_analysis") {
      setSwotMode("real");
      setSwotBench("FD");
      setSwotRates({ fd: 7, mf: 15, inflation: 6 });
      setAppliedRates({ fd: 7, mf: 15, inflation: 6 });
    }
    setShowSidebar(true);

    if (!graphs || !graphs[graphId]) {
      // If data is missing and we're not allowed to fetch anymore:
      if (!file) {
        // setLazyError("No file available.");
        // return;
      }
      // Note: User says we don't require axios.post anymore as backend handles it via analyze-json
      // So we just hope it's there or show an error.
      if (!graphs || !graphs[graphId]) {
        // setLazyError("Graph data not found in analysis.");
      }
    }
  };

  const closePage = () => {
    setSelectedGraphId(null);
    setLazyData(null);
    setLazyError(null);
    setLazyLoading(false);
    setShowSwotGuide(false);
  };

  const getColorStyles = (color) => {
    const map = {
      emerald: {
        border: "border-emerald-100 dark:border-emerald-900/30",
        bg: "bg-emerald-50/50 dark:bg-emerald-900/10",
        text: "text-emerald-700 dark:text-emerald-400",
        hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800",
        icon: "text-emerald-600 dark:text-emerald-400",
      },
      blue: {
        border: "border-blue-100 dark:border-blue-900/30",
        bg: "bg-blue-50/50 dark:bg-blue-900/10",
        text: "text-blue-700 dark:text-blue-400",
        hover: "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800",
        icon: "text-blue-600 dark:text-blue-400",
      },
      violet: {
        border: "border-violet-100 dark:border-violet-900/30",
        bg: "bg-violet-50/50 dark:bg-violet-900/10",
        text: "text-violet-700 dark:text-violet-400",
        hover: "hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-200 dark:hover:border-violet-800",
        icon: "text-violet-600 dark:text-violet-400",
      },
      rose: {
        border: "border-rose-100 dark:border-rose-900/30",
        bg: "bg-rose-50/50 dark:bg-rose-900/10",
        text: "text-rose-700 dark:text-rose-400",
        hover: "hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 dark:hover:border-rose-800",
        icon: "text-rose-600 dark:text-rose-400",
      },
      amber: {
        border: "border-amber-100 dark:border-amber-900/30",
        bg: "bg-amber-50/50 dark:bg-amber-900/10",
        text: "text-amber-700 dark:text-amber-400",
        hover: "hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-200 dark:hover:border-amber-800",
        icon: "text-amber-600 dark:text-amber-400",
      },
      cyan: {
        border: "border-cyan-100 dark:border-cyan-900/30",
        bg: "bg-cyan-50/50 dark:bg-cyan-900/10",
        text: "text-cyan-700 dark:text-cyan-400",
        hover: "hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-200 dark:hover:border-cyan-800",
        icon: "text-cyan-600 dark:text-cyan-400",
      },
      green: {
        border: "border-green-100 dark:border-green-900/30",
        bg: "bg-green-50/50 dark:bg-green-900/10",
        text: "text-green-700 dark:text-green-400",
        hover: "hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800",
        icon: "text-green-600 dark:text-green-400",
      },
      indigo: {
        border: "border-indigo-100 dark:border-indigo-900/30",
        bg: "bg-indigo-50/50 dark:bg-indigo-900/10",
        text: "text-indigo-700 dark:text-indigo-400",
        hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800",
        icon: "text-indigo-600 dark:text-indigo-400",
      },
    };
    return map[color] || map.blue;
  };

  const transformData = (graphId, rawData, exportItemKey = null) => {
    if (!rawData) return null;
    const isExportMode = isExporting || exportItemKey !== null;
    try {
      // ----------------- CASE: UNDERWATER PLOT (Custom Dual-Axis) -----------------
      // ----------------- CASE: UNDERWATER PLOT (Custom Dual-Axis Subplots) -----------------
      if (graphId === "underwater_plot") {
        const { dates, drawdown_pct, portfolio_value, invested_value } =
          rawData;
        if (!dates || !drawdown_pct) return null;

        const x = dates;
        const y = drawdown_pct;
        const invested = invested_value;

        // Colors (Pastel & Modern)
        // Value: Indigo-500 (#6366f1)
        // Invested: Slate-500 (#64748b) - Dashed
        // Drawdown: Rose-500 (#f43f5e) - Filled Area

        return {
          data: [
            // Top Chart: Portfolio Value vs Invested
            {
              x: x,
              y: portfolio_value,
              type: "scatter",
              mode: "lines",
              name: "Portfolio Value",
              line: { color: "#6366f1", width: 2 },
              hovertemplate: "<b>Value</b>: ₹%{y:,.0f}<extra></extra>",
              xaxis: "x",
              yaxis: "y",
            },
            {
              x: x,
              y: invested || [], // Handle missing if old backend
              type: "scatter",
              mode: "lines",
              name: "Invested Capital (Cost Basis)",
              line: { color: "#334155", width: 2.5, dash: "dash" }, // Slate-700, Thicker Dash
              hovertemplate: "<b>Invested</b>: ₹%{y:,.0f}<extra></extra>",
              xaxis: "x",
              yaxis: "y",
            },
            // Bottom Chart: Drawdown %
            {
              x: x,
              y: y,
              type: "scatter",
              mode: "lines",
              fill: "tozeroy",
              name: "Drawdown from Peak %",
              line: { color: "#dc2626", width: 1.5 }, // Red-600
              fillcolor: "rgba(220, 38, 38, 0.15)", // Slightly darker fill for visibility
              hovertemplate: "<b>Drawdown</b>: %{y:.2f}%<extra></extra>",
              xaxis: "x2",
              yaxis: "y2",
            },
          ],
          layout: {
            title: {
              text: "Portfolio Performance & Drawdown",
              font: {
                family: "Inter, system-ui, sans-serif",
                size: 20,
                color: "#0f172a",
                weight: 600,
              },
              y: 0.98,
              x: 0.05, // Align left for modern feel
              xanchor: "left",
            },
            hovermode: "x unified",
            plot_bgcolor: "white",
            paper_bgcolor: "white",
            margin: { t: 80, b: 50, l: 60, r: 40 }, // Increased Top Margin
            grid: {
              rows: 2,
              columns: 1,
              pattern: "independent",
              roworder: "top to bottom",
            },

            // Top Axis (Value) - Takes 65% height
            xaxis: {
              showticklabels: false, // Clean look, share x-axis
              anchor: "y",
              domain: [0, 1],
              zeroline: false,
              showgrid: true,
              gridcolor: "#f1f5f9",
              linecolor: "#e2e8f0", // Subtle axis line
              linewidth: 1,
            },
            yaxis: {
              title: "<b>Portfolio Value (₹)</b>",
              titlefont: {
                color: "#6366f1",
                family: "Inter, sans-serif",
                size: 12,
                weight: 600,
              },
              tickfont: {
                color: "#64748b",
                family: "Inter, sans-serif",
                size: 11,
              }, // Muted tick color
              gridcolor: "#f1f5f9",
              domain: [0.45, 1], // Condensed top chart slightly
              zeroline: false,
              autorange: true,
            },

            // Bottom Axis (Drawdown) - Takes 35% height
            xaxis2: {
              anchor: "y2",
              title: "<b>Date</b>",
              titlefont: {
                family: "Inter, sans-serif",
                size: 12,
                color: "#94a3b8",
                weight: 600,
              },
              tickfont: {
                family: "Inter, sans-serif",
                color: "#94a3b8",
                size: 11,
              },
              gridcolor: "#f1f5f9",
              domain: [0, 1],
              showgrid: false,
            },
            yaxis2: {
              title: "<b>Drawdown %</b>",
              titlefont: { color: "#f43f5e", family: "Inter", size: 14 },
              tickfont: { color: "#f43f5e", family: "Inter", size: 12 },
              gridcolor: "#f1f5f9",
              domain: [0, 0.35], // Increased Bottom Height (35%)
              zeroline: true,
              zerolinecolor: "#e2e8f0",
            },

            legend: {
              orientation: "h",
              y: 1.05,
              x: 0.5,
              xanchor: "center",
              bgcolor: "rgba(255,255,255,0.8)",
            },
          },
        };
      }

      // Case 1: Backend Wrapper (Risk Matrix & others)
      // If rawData has 'figure', it's the standard Plotly JSON
      if (rawData.figure) {
        // Deep copy
        const figure = JSON.parse(JSON.stringify(rawData.figure));
        // Ensure layout exists
        if (!figure.layout) figure.layout = {};

        // Client-Side Theme Enforcement (to ensure style updates apply)
        const pastelColors = {
          "High Return, Low Risk": "#34d399", // Pastel Emerald
          "High Return, High Risk": "#fbbf24", // Pastel Amber
          "Low Return, Low Risk": "#60a5fa", // Pastel Blue
          "Low Return, High Risk": "#f87171", // Pastel Rose
        };

        if (figure.data && Array.isArray(figure.data)) {
          figure.data.forEach((trace) => {
            if (pastelColors[trace.name]) {
              trace.marker = {
                ...trace.marker,
                color: pastelColors[trace.name],
                size: 18,
                line: { width: 2, color: "white" },
                opacity: 0.9,
              };
            }
          });
        }

        // Enforce Clean Layout
        figure.layout = {
          ...figure.layout,
          font: { family: "Inter, sans-serif", size: 12, color: "#64748b" },
          plot_bgcolor: "white",
          paper_bgcolor: "white",
          margin: { t: 60, b: 40, l: 60, r: 40 },
          xaxis: {
            ...figure.layout.xaxis,
            gridcolor: "#f1f5f9",
            zeroline: true,
            zerolinecolor: "#cbd5e1",
            gridwidth: 1,
            griddash: "dot",
          },
          yaxis: {
            ...figure.layout.yaxis,
            gridcolor: "#f1f5f9",
            zeroline: true,
            zerolinecolor: "#cbd5e1",
            gridwidth: 1,
            griddash: "dot",
          },
          legend: {
            orientation: "h",
            yanchor: "bottom",
            y: 1.02,
            xanchor: "center",
            x: 0.5,
          },
        };

        return figure;
      }

      // Case 2: Direct Plotly Object
      if (rawData.data && rawData.layout) return rawData;

      // ----------------- CASE: SWOT ANALYSIS -----------------
      if (graphId === "swot_analysis") {
        // Check if data is nested inside 'graph_data' key unexpectedly
        const data = rawData.graph_data || rawData;

        if (!data.FD || !data.MF) return null;

        const getTraceData = (bench, mode) => {
          const d = data[bench][mode];
          if (!d)
            return {
              x: [],
              y: [],
              text: [],
              customdata: [],
              marker: { color: [] },
            };

          const colors = d.x.map((xVal, i) => {
            const yVal = d.y[i];
            if (xVal < 0 && yVal > 0) return "#3b82f6"; // Strength
            if (xVal > 0 && yVal > 0) return "#10b981"; // Opportunity
            if (xVal < 0 && yVal < 0) return "#f59e0b"; // Weakness
            return "#ef4444"; // Threat
          });

          const BASE_RATES = { fd: 7.0, mf: 15.0, inflation: 6.0 };
          const curBenchId = swotBench.toLowerCase();
          const targetBenchRate = appliedRates[curBenchId];
          const targetInfl = appliedRates.inflation;

          const baseBenchRate = BASE_RATES[curBenchId];
          const baseInfl = BASE_RATES.inflation;

          const adjustedY = d.y.map((yVal) => {
            if (swotMode === "nominal") {
              // nominal_rel = (return - targetBench) = (y_old + baseBench) - targetBench
              return yVal + (baseBenchRate - targetBenchRate);
            } else {
              // real_rel = (return - targetInfl - targetBench) = (y_old + baseInfl + baseBench) - targetInfl - targetBench
              return yVal + (baseInfl + baseBenchRate) - (targetInfl + targetBenchRate);
            }
          });

          // const colors = d.x.map((xVal, i) => {
          //   const yVal = adjustedY[i];
          //   if (xVal < 0 && yVal > 0) return "#3b82f6"; // Strength
          //   if (xVal > 0 && yVal > 0) return "#10b981"; // Opportunity
          //   if (xVal < 0 && yVal < 0) return "#f59e0b"; // Weakness
          //   return "#ef4444"; // Threat
          // });

          return {
            x: d.x,
            y: adjustedY,
            text: d.text.map((t) => t.split(" ")[0]),
            customdata: d.text.map((t, i) => [
              t,
              d.x[i].toFixed(2),
              adjustedY[i].toFixed(2),
            ]),
            marker: {
              color: colors,
              size: 18,
              opacity: 0.8,
              line: { width: 1.5, color: "white" },
            },
          };
        };

        const initial = getTraceData(swotBench, swotMode);

        return {
          data: [
            {
              x: initial.x,
              y: initial.y,
              mode: "markers",
              type: "scatter",
              marker: initial.marker,
              customdata: initial.customdata,
              hovertemplate:
                "<b>%{customdata[0]}</b><br>" +
                "Rel Risk: %{customdata[1]}%<br>" +
                "Rel Return: %{customdata[2]}%<br>" +
                "<extra></extra>",
            },
          ],
          layout: {
            title: {
              text: `${swotMode === "real" ? "Real" : "Nominal"} Returns vs ${swotBench} (${appliedRates[swotBench.toLowerCase()]}%)`,
              font: {
                family: "Inter, sans-serif",
                size: 24,
                color: "#1e293b",
                weight: 700,
              },
              y: 0.95,
            },
            autosize: true,
            xaxis: {
              title: "Relative Risk (Lower is Better)",
              zeroline: true,
              zerolinecolor: "#334155",
              zerolinewidth: 2,
              showgrid: true,
              gridcolor: "#f1f5f9",
              tickfont: { family: "Inter", color: "#64748b" },
            },
            yaxis: {
              title: "Real Return % (Inflation Adjusted)",
              zeroline: true,
              zerolinecolor: "#334155",
              zerolinewidth: 2,
              showgrid: true,
              gridcolor: "#f1f5f9",
              tickfont: { family: "Inter", color: "#64748b" },
            },
            annotations: [
              {
                x: 0.02,
                y: 0.98,
                xref: "paper",
                yref: "paper",
                text: "STRENGTHS",
                xanchor: "left",
                yanchor: "top",
                showarrow: false,
                font: {
                  size: 24,
                  color: "rgba(59, 130, 246, 0.1)",
                  weight: 900,
                },
              },
              {
                x: 0.98,
                y: 0.98,
                xref: "paper",
                yref: "paper",
                text: "OPPORTUNITIES",
                xanchor: "right",
                yanchor: "top",
                showarrow: false,
                font: {
                  size: 24,
                  color: "rgba(16, 185, 129, 0.1)",
                  weight: 900,
                },
              },
              {
                x: 0.02,
                y: 0.02,
                xref: "paper",
                yref: "paper",
                text: "WEAKNESSES",
                xanchor: "left",
                yanchor: "bottom",
                showarrow: false,
                font: {
                  size: 24,
                  color: "rgba(245, 158, 11, 0.1)",
                  weight: 900,
                },
              },
              {
                x: 0.98,
                y: 0.02,
                xref: "paper",
                yref: "paper",
                text: "THREATS",
                xanchor: "right",
                yanchor: "bottom",
                showarrow: false,
                font: {
                  size: 24,
                  color: "rgba(239, 68, 68, 0.1)",
                  weight: 900,
                },
              },
            ],
            updatemenus: isExportMode ? [] : [
              {
                buttons: [
                  {
                    method: "update",
                    args: [
                      {
                        x: [getTraceData("FD", "nominal").x],
                        y: [getTraceData("FD", "nominal").y],
                        text: [getTraceData("FD", "nominal").text],
                        customdata: [getTraceData("FD", "nominal").customdata],
                        marker: [getTraceData("FD", "nominal").marker],
                      },
                      { title: { text: "" } },
                    ],
                    label: "Nominal (vs FD)",
                  },
                  {
                    method: "update",
                    args: [
                      {
                        x: [getTraceData("FD", "real").x],
                        y: [getTraceData("FD", "real").y],
                        text: [getTraceData("FD", "real").text],
                        customdata: [getTraceData("FD", "real").customdata],
                        marker: [getTraceData("FD", "real").marker],
                      },
                      { title: { text: "" } },
                    ],
                    label: "Real (vs FD)",
                  },
                  {
                    method: "update",
                    args: [
                      {
                        x: [getTraceData("MF", "nominal").x],
                        y: [getTraceData("MF", "nominal").y],
                        text: [getTraceData("MF", "nominal").text],
                        customdata: [getTraceData("MF", "nominal").customdata],
                        marker: [getTraceData("MF", "nominal").marker],
                      },
                      { title: { text: "" } },
                    ],
                    label: "Nominal (vs MF)",
                  },
                  {
                    method: "update",
                    args: [
                      {
                        x: [getTraceData("MF", "real").x],
                        y: [getTraceData("MF", "real").y],
                        text: [getTraceData("MF", "real").text],
                        customdata: [getTraceData("MF", "real").customdata],
                        marker: [getTraceData("MF", "real").marker],
                      },
                      { title: { text: "" } },
                    ],
                    label: "Real (vs MF)",
                  },
                ],
                type: "dropdown",
                direction: "down",
                showactive: true,
                x: 0,
                y: 1.15,
                xanchor: "left",
                yanchor: "top",
                bgcolor: "white",
                bordercolor: "#cbd5e1",
                font: { family: "Inter, sans-serif", size: 12 },
              },
            ],
            hovermode: "closest",
            template: "plotly_white",
            margin: { t: 40, b: 120, l: 60, r: 40 },
          },
        };
      }

      // ----------------- CASE: TOP PERFORMING -----------------
      if (graphId === "top_performing") {
        if (!rawData.unrealized_gainers && !rawData.realized_gainers)
          return null;
        const {
          unrealized_gainers,
          realized_gainers,
          unrealized_losers,
          brokerage_highest,
          has_brokerage,
        } = rawData;
        const colors = {
          profit: "#10b981",
          loss: "#ef4444",
          brokerage: "#f59e0b",
        };
        const traces = [];

        const addTrace = (d, name, color, visible) => {
          if (d?.values?.length > 0) {
            traces.push({
              type: "bar",
              x: d.labels,
              y: d.values,
              name,
              marker: {
                color,
                line: { color: "rgba(255,255,255,0.5)", width: 0 },
                opacity: 0.85,
                cornerradius: 8,
              },
              text: d.values.map(
                (v) => `₹${Math.round(v).toLocaleString("en-IN")}`
              ),
              textposition: "auto",
              textfont: {
                family: "Inter, sans-serif",
                size: 12,
                color: "white",
              },
              visible,
            });
          }
        };

        addTrace(unrealized_gainers, "Unrealized Gains", colors.profit, true);
        addTrace(realized_gainers, "Realized Gains", "#059669", false);
        addTrace(
          unrealized_losers,
          "Top Unrealized Losses",
          colors.loss,
          false
        );
        if (has_brokerage)
          addTrace(
            brokerage_highest,
            "Brokerage Paid",
            colors.brokerage,
            false
          );

        const buttons = traces.map((t, i) => ({
          label: t.name,
          method: "update",
          args: [
            { visible: traces.map((_, j) => i === j) },
            { title: `Top 10 Stocks by ${t.name}` },
          ],
        }));

        return {
          data: traces,
          layout: {
            title: {
              text: "Top 10 Scrips",
              font: {
                family: "Inter, sans-serif",
                size: 20,
                weight: 600,
                color: "#1e293b",
              },
            },
            updatemenus: isExportMode ? [] : [
              {
                buttons,
                direction: "down",
                showactive: true,
                x: 1,
                y: 1.15,
                bgcolor: "white",
                bordercolor: "#e2e8f0",
                font: { family: "Inter, sans-serif" },
              },
            ],
            xaxis: {
              title: "",
              automargin: true,
              showgrid: false,
              tickfont: {
                family: "Inter, sans-serif",
                color: "#64748b",
                size: 11,
              },
            },
            yaxis: {
              title: "",
              automargin: true,
              showgrid: true,
              gridcolor: "#f1f5f9",
              tickfont: {
                family: "Inter, sans-serif",
                color: "#64748b",
                size: 11,
              },
            },
            template: "plotly_white",
            margin: { t: 80, b: 160, l: 60, r: 20 },
            hovermode: "x",
            font: { family: "Inter, sans-serif" },
          },
        };
      }

      // ----------------- CASE: PORTFOLIO HEALTH -----------------
      if (graphId === "portfolio_health") {
        const scrips = Object.keys(rawData || {});
        if (scrips.length === 0) return null;
        const traces = [];
        const visibleScrip = scrips[0];

        scrips.forEach((scrip) => {
          const d = rawData[scrip];
          if (!d) return;
          const isVisible = scrip === visibleScrip;

          if (d.deployed && d.deployed.length > 0) {
            traces.push({
              x: d.deployed.map((p) => p.x),
              y: d.deployed.map((p) => p.y),
              name: "Deployed",
              type: "scatter",
              fill: "tozeroy",
              fillcolor: "rgba(59, 130, 246, 0.1)",
              line: { color: "#3b82f6", width: 2 },
              visible: isVisible,
              legendgroup: scrip,
            });
          }
          if (d.marketValue && d.marketValue.length > 0) {
            traces.push({
              x: d.marketValue.map((p) => p.x),
              y: d.marketValue.map((p) => p.y),
              name: "Market Value",
              type: "scatter",
              line: { color: "#10b981", width: 2 },
              visible: isVisible,
              legendgroup: scrip,
            });
          }
          if (d.lastBuyDate) {
            const buyY =
              d.deployed.find((p) =>
                p.x.startsWith(d.lastBuyDate.split("T")[0])
              )?.y || 0;
            traces.push({
              x: [d.lastBuyDate],
              y: [buyY],
              mode: "markers",
              name: "Last Buy",
              marker: {
                symbol: "star",
                size: 14,
                color: "#f59e0b",
                line: { width: 1, color: "white" },
              },
              visible: isVisible,
              legendgroup: scrip,
            });
          }
        });

        const buttons = scrips.map((scrip) => {
          const visibility = traces.map((t) => t.legendgroup === scrip);
          return {
            label: scrip,
            method: "update",
            args: [{ visible: visibility }, { title: `${scrip} Performance` }],
          };
        });

        return {
          data: traces,
          layout: {
            title: {
              text: isExportMode && exportItemKey ? `${exportItemKey} Performance` : `${visibleScrip} Performance`,
              font: {
                family: "Inter, sans-serif",
                size: 20,
                weight: 600,
                color: "#1e293b",
              },
            },
            updatemenus: isExportMode ? [] : [
              {
                buttons,
                direction: "down",
                showactive: true,
                x: 1.15,
                y: 1.15,
                xanchor: "right",
                yanchor: "top",
                bgcolor: "white",
                bordercolor: "#e2e8f0",
                font: { family: "Inter, sans-serif" },
              },
            ],
            xaxis: {
              title: "",
              automargin: true,
              showgrid: false,
              tickfont: {
                family: "Inter, sans-serif",
                color: "#64748b",
                size: 11,
              },
            },
            yaxis: {
              title: "Amount (₹)",
              automargin: true,
              showgrid: true,
              gridcolor: "#f1f5f9",
              tickfont: {
                family: "Inter, sans-serif",
                color: "#64748b",
                size: 11,
              },
            },
            template: "plotly_white",
            margin: { t: 80, b: 120, l: 60, r: 80 },
            hovermode: "x unified",
            font: { family: "Inter, sans-serif" },
          },
        };
      }

      // ----------------- CASE: TURNOVER ANALYSIS -----------------
      if (graphId === "combined_box_plot") {
        if (!rawData.turnover_by_month || !rawData.turnover_stats) return null;
        const boxTraces = rawData.turnover_by_month.map((m) => ({
          y: m.values,
          type: "box",
          name: m.month,
          marker: { color: "#f59e0b", size: 4 },
          boxpoints: "outliers",
          line: { width: 1.5 },
          fillcolor: "rgba(251, 191, 36, 0.2)",
          showlegend: false,
          hoverinfo: "y+name",
        }));
        const avgTrace = {
          x: rawData.turnover_stats.months,
          y: rawData.turnover_stats.avg,
          type: "scatter",
          mode: "lines+markers",
          name: "Avg Turnover",
          line: { color: "#3b82f6", width: 3 },
          marker: {
            size: 6,
            color: "white",
            line: { width: 2, color: "#3b82f6" },
          },
        };
        const countTrace = {
          x: rawData.turnover_stats.months,
          y: rawData.turnover_stats.trade_count,
          type: "bar",
          name: "Trade Count",
          yaxis: "y2",
          marker: { color: "#e2e8f0", opacity: 0.5 },
          hoverinfo: "y+name",
        };
        return {
          data: [...boxTraces, countTrace, avgTrace],
          layout: {
            title: {
              text: "Monthly Turnover Distribution",
              font: {
                family: "Inter, sans-serif",
                size: 20,
                weight: 600,
                color: "#1e293b",
              },
            },
            xaxis: {
              title: "",
              automargin: true,
              showgrid: false,
              tickfont: {
                family: "Inter, sans-serif",
                color: "#64748b",
                size: 11,
              },
            },
            yaxis: {
              title: "Turnover Value (₹)",
              automargin: true,
              showgrid: true,
              gridcolor: "#f1f5f9",
              tickfont: {
                family: "Inter, sans-serif",
                color: "#64748b",
                size: 11,
              },
            },
            yaxis2: {
              title: "Trade Count",
              overlaying: "y",
              side: "right",
              showgrid: false,
              tickfont: {
                family: "Inter, sans-serif",
                color: "#94a3b8",
                size: 10,
              },
            },
            template: "plotly_white",
            margin: { t: 80, b: 160, l: 60, r: 60 },
            hovermode: "closest",
            showlegend: true,
            legend: { orientation: "h", y: -0.2 },
            font: { family: "Inter, sans-serif" },
          },
        };
      }

      // ----------------- CASE: TRADE PNL PLOT -----------------
      if (graphId === "trade_pnl_plot") {
        let root = rawData;
        if (root.graph_data) root = root.graph_data;
        const stockMap = root.stock_data || root;
        const validStockNames = Object.keys(stockMap || {}).filter((key) => {
          const val = stockMap[key];
          if (!val || typeof val !== "object") return false;
          if (!Array.isArray(val.dates)) return false;
          return true;
        });
        if (validStockNames.length === 0)
          return {
            data: [],
            layout: { title: { text: "No Trade Data Available" } },
          };

        const traces = [];
        validStockNames.forEach((stockName, idx) => {
          const d = stockMap[stockName];
          const isVisible = exportItemKey ? (stockName === exportItemKey) : (idx === selectedStockIdx);
          traces.push({
            x: d.dates,
            y: d.prices,
            name: "Price",
            type: "scatter",
            mode: "lines",
            line: { color: "#007bff", width: 2 },
            fill: "tozeroy",
            fillcolor: "rgba(0, 123, 255, 0.05)",
            visible: isVisible,
            legendgroup: stockName,
          });
          traces.push({
            x: d.dates,
            y: d.trend,
            name: "5-Day Trend",
            type: "scatter",
            mode: "lines",
            line: { color: "#ffa500", width: 2, dash: "dash" },
            visible: isVisible,
            legendgroup: stockName,
          });
          const markerColors = d.maj_outcomes.map((o) =>
            (o || "").toLowerCase().includes("good") ? "#28a745" : "#dc3545"
          );
          traces.push({
            x: d.maj_dates,
            y: d.maj_prices,
            mode: "markers",
            name: "Trades",
            text: d.maj_outcomes,
            marker: {
              size: 10,
              color: markerColors,
              line: { color: "white", width: 1.5 },
            },
            visible: isVisible,
            legendgroup: stockName,
            hovertemplate:
              "<b>%{text}</b><br>Date: %{x}<br>Price: ₹%{y:.2f}<extra></extra>",
          });
        });

        const updatemenus = [
          {
            buttons: validStockNames.map((name, i) => {
              const visibility = new Array(traces.length).fill(false);
              visibility[i * 3] = true;
              visibility[i * 3 + 1] = true;
              visibility[i * 3 + 2] = true;
              return {
                method: "restyle",
                args: ["visible", visibility],
                label: name,
              };
            }),
            direction: "down",
            showactive: true,
            x: 0.0,
            xanchor: "left",
            y: 1.15,
            yanchor: "top",
            bgcolor: "#f8f9fa",
            bordercolor: "#dee2e6",
          },
        ];

        return {
          data: traces,
          layout: {
            title: {
              text: "Trade P&L Analysis",
              font: {
                family: "Inter, sans-serif",
                size: 20,
                weight: 600,
                color: "#1e293b",
              },
            },
            xaxis: {
              title: "Date",
              showgrid: false,
              zeroline: false,
              tickfont: {
                family: "Inter, sans-serif",
                color: "#64748b",
                size: 11,
              },
            },
            yaxis: {
              title: "Price (₹)",
              showgrid: true,
              zeroline: false,
              gridcolor: "#f1f5f9",
              tickfont: {
                family: "Inter, sans-serif",
                color: "#64748b",
                size: 11,
              },
            },
            updatemenus: isExportMode ? [] : updatemenus,
            hovermode: "closest",
            showlegend: true,
            legend: { orientation: "w", y: 1 },
            template: "plotly_white",
            margin: { t: 80, b: 80, l: 60, r: 80 },
            font: { family: "Inter, sans-serif" },
          },
        };
      }

      // ----------------- CASE: CORRELATION PLOT -----------------
      if (graphId === "correlation_plot") {
        const benchmarkData = rawData?.benchmark_correlations;
        const interStockData = rawData?.inter_stock_correlations;
        const insights = rawData?.insights;

        if (!benchmarkData && !interStockData) return null;

        // Create dropdown buttons data
        const dropdownButtons = [];

        // Add benchmark views
        if (benchmarkData?.benchmarks) {
          benchmarkData.benchmarks.forEach((benchmark) => {
            const z = [];
            const y = benchmarkData.symbols || [];
            const x = [benchmark];
            const customdata = [];

            benchmarkData.correlations?.forEach((stockData) => {
              const corr = stockData[benchmark];
              z.push([corr !== null ? corr : 0]);
              customdata.push([corr]);
            });

            dropdownButtons.push({
              method: "update",
              args: [
                {
                  z: [z],
                  x: [x],
                  y: [y],
                  customdata: [customdata],
                },
                {
                  "title.text": `Correlations with ${benchmark}`,
                },
              ],
              label: benchmark,
            });
          });
        }

        // Add inter-stock view
        if (interStockData?.symbols && interStockData.correlations) {
          const symbols = interStockData.symbols;
          const z = [];
          const customdata = [];

          interStockData.correlations.forEach((row) => {
            const rowVals = [];
            const rowCustom = [];
            symbols.forEach((sym) => {
              const corr = row[sym];
              rowVals.push(corr !== null ? corr : 0);
              rowCustom.push(corr);
            });
            z.push(rowVals);
            customdata.push(rowCustom);
          });

          dropdownButtons.push({
            method: "update",
            args: [
              {
                z: [z],
                x: [symbols],
                y: [symbols],
                customdata: [customdata],
              },
              {
                "title.text": "Inter-Stock Correlation Matrix",
              },
            ],
            label: "Inter-Stock",
          });
        }

        // Default view - use first benchmark or inter-stock
        let defaultZ, defaultX, defaultY, defaultCustomdata, defaultTitle;

        if (benchmarkData?.benchmarks && benchmarkData.benchmarks.length > 0) {
          const firstBenchmark = benchmarkData.benchmarks[0];
          defaultZ = [];
          defaultY = benchmarkData.symbols || [];
          defaultX = [firstBenchmark];
          defaultCustomdata = [];

          benchmarkData.correlations?.forEach((stockData) => {
            const corr = stockData[firstBenchmark];
            defaultZ.push([corr !== null ? corr : 0]);
            defaultCustomdata.push([corr]);
          });

          defaultTitle = `Correlations with ${firstBenchmark}`;
        } else if (interStockData?.symbols) {
          defaultZ = [];
          defaultX = interStockData.symbols;
          defaultY = interStockData.symbols;
          defaultCustomdata = [];

          interStockData.correlations.forEach((row) => {
            const rowVals = [];
            const rowCustom = [];
            interStockData.symbols.forEach((sym) => {
              const corr = row[sym];
              rowVals.push(corr !== null ? corr : 0);
              rowCustom.push(corr);
            });
            defaultZ.push(rowVals);
            defaultCustomdata.push(rowCustom);
          });

          defaultTitle = "Inter-Stock Correlation Matrix";
        }

        const plotData = {
          data: [
            {
              type: "heatmap",
              z: defaultZ,
              x: defaultX,
              y: defaultY,
              customdata: defaultCustomdata,
              hovertemplate:
                "<b>%{y} vs %{x}</b><br>Correlation: %{customdata:.3f}<extra></extra>",
              xgap: 2,
              ygap: 2,
              colorscale: [
                [0, "#ef4444"], // -1.0: Red-500
                [0.2, "#f87171"], // -0.6: Red-400
                [0.4, "#fb923c"], // -0.2: Orange-400
                [0.5, "#f8fafc"], // 0.0: Slate-50 (White-ish)
                [0.6, "#60a5fa"], // +0.2: Blue-400
                [0.8, "#6366f1"], // +0.6: Indigo-500
                [1, "#4f46e5"], // +1.0: Indigo-600
              ],
              zmin: -1,
              zmax: 1,
              colorbar: {
                title: {
                  text: "Correlation",
                  side: "right",
                  font: { size: 12, family: "Inter, sans-serif" },
                },
                titleside: "right",
                tickmode: "array",
                tickvals: [-1, -0.5, 0, 0.5, 1],
                ticktext: ["-1.0", "-0.5", "0.0", "0.5", "1.0"],
                len: 0.6,
                thickness: 12,
                x: 1.02,
                outlinecolor: theme === "dark" ? "#1e293b" : "white",
                outlinewidth: 0,
                tickfont: {
                  size: 10,
                  family: "Inter, sans-serif",
                  color: "#64748b",
                },
              },
              showscale: true,
            },
          ],
          layout: {
            title: {
              text: defaultTitle,
              font: {
                family: "Inter, sans-serif",
                size: 20,
                color: "#1e293b",
                weight: 700,
              },
              x: 0.5,
              xanchor: "center",
              y: 0.96,
            },
            updatemenus:
              isExportMode ? [] : (dropdownButtons.length > 1
                ? [
                  {
                    buttons: dropdownButtons,
                    direction: "down",
                    showactive: true,
                    active: 0,
                    x: 0.0,
                    xanchor: "left",
                    y: 1.15,
                    yanchor: "top",
                    bgcolor: "white",
                    bordercolor: "#e2e8f0",
                    borderwidth: 1,
                    font: {
                      family: "Inter, sans-serif",
                      size: 13,
                      color: "#334155",
                    },
                    pad: { t: 8, b: 8, l: 12, r: 12 },
                  },
                ]
                : []),
            xaxis: {
              side: "bottom",
              tickangle: -45,
              tickfont: {
                family: "Inter, sans-serif",
                size: 11,
                color: "#64748b",
              },
              gridcolor: "transparent",
              showgrid: false,
              zeroline: false,
            },
            yaxis: {
              tickfont: {
                family: "Inter, sans-serif",
                size: 11,
                color: "#64748b",
              },
              gridcolor: "transparent",
              showgrid: false,
              zeroline: false,
              autorange: "reversed",
            },
            plot_bgcolor: theme === "dark" ? "#0f172a" : "white",
            paper_bgcolor: theme === "dark" ? "#0f172a" : "white",
            margin: { t: 100, b: 150, l: 140, r: 80 },
            font: {
              family: "Inter, sans-serif",
              size: 12,
              color: "#64748b",
            },
            height: Math.max(550, (defaultY?.length || 0) * 40 + 200),
            hoverlabel: {
              bgcolor: "white",
              bordercolor: "#e2e8f0",
              font: { family: "Inter, sans-serif", size: 13, color: "#1e293b" },
            },
          },
        };

        // Add insights if available
        if (insights) {
          plotData.insights = insights;
        }

        return plotData;
      }

      return null;
    } catch (err) {
      console.error("Graph transformation error:", err);
      return { error: "Failed to render graph. Data may be incomplete." };
    }
  };

  const processedData = React.useMemo(() => {
    const data = transformData(selectedGraphId, activeRawData);
    if (data && data.layout) {
      const isDark = theme === "dark";
      const bgColor = isDark ? "#0f172a" : "white";
      const textColor = isDark ? "#f8fafc" : "#1e293b";
      const mutedTextColor = isDark ? "#94a3b8" : "#64748b";
      const gridColor = isDark ? "#334155" : "#f1f5f9";

      data.layout.paper_bgcolor = bgColor;
      data.layout.plot_bgcolor = bgColor;

      if (data.layout.title) {
        data.layout.title.font = {
          ...data.layout.title.font,
          color: textColor
        };
      }

      const updateAxis = (axis) => {
        if (!axis) return;
        if (axis.title && axis.title.font) axis.title.font.color = mutedTextColor;
        if (axis.tickfont) axis.tickfont.color = mutedTextColor;
        if (axis.gridcolor) axis.gridcolor = gridColor;
        if (axis.zerolinecolor) axis.zerolinecolor = isDark ? "#475569" : "#cbd5e1";
      };

      updateAxis(data.layout.xaxis);
      updateAxis(data.layout.yaxis);
      updateAxis(data.layout.xaxis2);
      updateAxis(data.layout.yaxis2);

      if (data.layout.legend) {
        data.layout.legend.bgcolor = isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)";
        if (data.layout.legend.font) data.layout.legend.font.color = textColor;
        // Fix for legend clicks making plots disappear
        data.layout.legend.itemclick = false;
        data.layout.legend.itemdoubleclick = false;
      }

      if (data.layout.updatemenus) {
        data.layout.updatemenus.forEach(menu => {
          menu.bgcolor = isDark ? "#1e293b" : "#ffffff";
          menu.bordercolor = isDark ? "#475569" : "#e2e8f0";
          menu.borderwidth = 1;
          if (!menu.font) menu.font = {};
          menu.font.color = isDark ? "#f8fafc" : "#1e293b";
          menu.font.family = "Inter, sans-serif";
          menu.font.size = 12;
        });
      }

      // Special case for SWOT annotations
      if (data.layout.annotations) {
        data.layout.annotations.forEach(anno => {
          if (anno.font && anno.font.color && anno.font.color.includes("rgba")) {
            // Keep the faint colored background text
          } else if (anno.font) {
            anno.font.color = textColor;
          }
        });
      }
    }
    return data;
  }, [selectedGraphId, activeRawData, swotMode, swotBench, selectedStockIdx, appliedRates, theme]);

  return (
    <div className="space-y-6 font-sans">
      <LoadingScreen isVisible={lazyLoading} />

      {/* MAIN GRID - Hidden during export if we show all */}
      {!isExporting && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {GRAPH_METADATA.map((graph) => {
            const Icon = graph.icon;
            const styles = getColorStyles(graph.color);
            return (
              <button
                key={graph.id}
                onClick={() => loadGraph(graph.id)}
                className={`group relative p-6 rounded-2xl border text-left w-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 ${styles.border} ${styles.bg} ${styles.hover}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${styles.icon} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`font-bold text-base ${styles.text}`}>
                    {graph.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {graph.description}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* EXPORT VIEW - Renders all graphs in sequence */}
      {isExporting && (
        <div className="flex flex-col gap-12 mb-20">
          {GRAPH_METADATA.map((graphMeta) => {
            const source = graphs?.[graphMeta.id];
            if (!source || source.error) return null;

            const { graph_data: rawData, insights } = unwrapResponse(source);

            // Special handling for multi-plot graphs during export (Portfolio Health & P&L Timeline)
            if (graphMeta.id === 'portfolio_health' || graphMeta.id === 'trade_pnl_plot') {
              const stockMap = graphMeta.id === 'portfolio_health' ? rawData : (rawData.stock_data || rawData);
              const items = Object.keys(stockMap || {}).filter(key => {
                const val = stockMap[key];
                return val && typeof val === 'object' && (val.dates || val.deployed);
              });

              return (
                <div key={graphMeta.id} className="space-y-8">
                  <div className="pdf-section-container pdf-page-break flex items-center gap-3 mb-6 border-b-2 border-slate-100 pb-4">
                    <div className={`p-2 rounded-lg ${getColorStyles(graphMeta.color).bg} ${getColorStyles(graphMeta.color).icon}`}>
                      <graphMeta.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{graphMeta.title} (All Holdings)</h3>
                  </div>

                  {/* Use 1-column layout for PDF export to ensure each chart gets its own page */}
                  <div className={`grid ${isExporting ? 'grid-cols-1' : 'grid-cols-1'} gap-6 mb-8`}>
                    {isExporting ? (
                      // PDF Logic: Render 1 item per page
                      items.map((itemName) => {
                        const pData = transformData(graphMeta.id, rawData, itemName);
                        if (!pData || !pData.data) return null;

                        pData.layout.paper_bgcolor = "white";
                        pData.layout.plot_bgcolor = "white";
                        pData.layout.margin = { t: 60, b: 50, l: 60, r: 40 };
                        if (pData.layout.title) pData.layout.title.font = { size: 18, color: "#1e293b", weight: 'bold' };

                        // Adjust legend for better visibility on full page
                        pData.layout.showlegend = true;
                        pData.layout.legend = { orientation: 'h', y: -0.15, font: { size: 12 } };

                        return (
                          <div key={itemName} className="pdf-page-break pdf-section-container min-h-[500px] bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                            <h4 className="text-xl font-bold text-slate-800 mb-6 px-4 border-l-8 border-blue-600 bg-slate-50 py-2 rounded-r-lg">{itemName} Performance</h4>
                            <div className="h-[400px] w-full">
                              <Plot
                                data={pData.data}
                                layout={{ ...pData.layout, autosize: true }}
                                config={{ responsive: true, displayModeBar: false }}
                                style={{ width: "100%", height: "100%" }}
                                useResizeHandler={true}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // Regular screen view: Single column list
                      <div className="grid grid-cols-1 gap-12">
                        {items.map((itemName) => {
                          const pData = transformData(graphMeta.id, rawData, itemName);
                          if (!pData || !pData.data) return null;

                          pData.layout.paper_bgcolor = "white";
                          pData.layout.plot_bgcolor = "white";
                          pData.layout.margin = { t: 60, b: 50, l: 60, r: 40 };
                          if (pData.layout.title) pData.layout.title.font = { size: 18, color: "#1e293b", weight: 'bold' };

                          return (
                            <div key={itemName} className="pdf-section-container pdf-page-break bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col">
                              <h4 className="text-xl font-bold text-slate-800 mb-6 px-4 border-l-8 border-blue-600 bg-slate-50 py-2 rounded-r-lg">{itemName} Performance Analysis</h4>
                              <div className="h-[450px] w-full">
                                <Plot
                                  data={pData.data}
                                  layout={{ ...pData.layout, autosize: true }}
                                  config={{ responsive: true, displayModeBar: false }}
                                  style={{ width: "100%", height: "100%" }}
                                  useResizeHandler={true}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* Global Insights for this section */}
                  {insights && (
                    <div className="pdf-section-container pdf-page-break bg-slate-50 p-6 rounded-xl border border-slate-100 mt-6">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Overall {graphMeta.title} Insights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.isArray(insights) ? (
                          insights.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                              <p className="font-bold text-slate-800 text-sm mb-1">{item.title}</p>
                              <p className="text-xs text-slate-600 leading-relaxed">{item.text?.replace(/\*\*(.*?)\*\*/g, "$1")}</p>
                            </div>
                          ))
                        ) : (
                          insights.key_takeaways?.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {typeof item === 'string' ? item : item.text?.replace(/\*\*(.*?)\*\*/g, "$1")}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const pData = transformData(graphMeta.id, rawData);

            if (!pData || !pData.data) return null;

            // Apply theme colors for PDF (force light mode themes for best print quality)
            if (pData.layout) {
              pData.layout.paper_bgcolor = "white";
              pData.layout.plot_bgcolor = "white";
              if (pData.layout.title) {
                if (!pData.layout.title.font) pData.layout.title.font = {};
                pData.layout.title.font.color = "#1e293b";
              }
              const updateAxis = (axis) => {
                if (!axis) return;
                if (axis.title?.font) axis.title.font.color = "#64748b";
                if (axis.tickfont) axis.tickfont.color = "#64748b";
                if (axis.gridcolor !== undefined) axis.gridcolor = "#f1f5f9";
                if (axis.zerolinecolor !== undefined) axis.zerolinecolor = "#cbd5e1";
              };
              updateAxis(pData.layout.xaxis);
              updateAxis(pData.layout.yaxis);
              updateAxis(pData.layout.xaxis2);
              updateAxis(pData.layout.yaxis2);
            }

            return (
              <div key={graphMeta.id} data-pdf-section="6" className={`pdf-section-container pdf-page-break bg-white p-8 rounded-2xl border border-slate-200 shadow-sm ${isExporting ? 'mb-12' : ''}`}>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                  <div className={`p-2 rounded-lg ${getColorStyles(graphMeta.color).bg} ${getColorStyles(graphMeta.color).icon}`}>
                    <graphMeta.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{graphMeta.title}</h3>
                </div>

                <div className={`grid gap-6 ${isExporting ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-3'}`}>
                  <div className={`${isExporting ? 'min-h-[500px]' : 'xl:col-span-2 min-h-[450px]'} border border-slate-50 rounded-xl overflow-hidden`}>
                    <ErrorBoundary>
                      <Plot
                        data={pData.data}
                        layout={{ ...pData.layout, autosize: true }}
                        config={{ responsive: true, displayModeBar: false }}
                        style={{ width: "100%", height: "400px" }}
                        useResizeHandler={true}
                      />
                    </ErrorBoundary>
                  </div>

                  <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Insights & Analysis</h4>
                    {insights ? (
                      <div className="space-y-4">
                        {Array.isArray(insights) ? (
                          insights.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                              <p className="font-bold text-slate-800 text-sm mb-1">{item.title}</p>
                              <p className="text-xs text-slate-600 leading-relaxed">{item.text?.replace(/\*\*(.*?)\*\*/g, "$1")}</p>
                            </div>
                          ))
                        ) : (
                          <>
                            {insights.key_takeaways?.map((item, idx) => (
                              <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {typeof item === 'string' ? item : item.text?.replace(/\*\*(.*?)\*\*/g, "$1")}
                                </p>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No automated insights available for this dataset.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL SCREEN OVERLAY - Hidden during export */}
      {selectedGraphId && !lazyLoading && !isExporting && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-white dark:bg-slate-900 flex flex-col animate-fade-in">

          {/* TOP NAV BAR (Responsive) */}
          <div className="flex-none border-b dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={closePage}
                className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Back to Catalog"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                  {GRAPH_METADATA.find((g) => g.id === selectedGraphId)?.title}
                </h2>
                <p className="hidden md:block text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Interactive Portfolio Analysis
                </p>
              </div>
            </div>

            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold ${showSidebar
                  ? "bg-slate-100 text-slate-700"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  }`}
              >
                {showSidebar ? (
                  <>
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Normal View</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span className="hidden sm:inline">Expand Plot</span>
                  </>
                )}
              </button>
            </div> */}
          </div>

          <div className="flex-1 flex flex-col lg:flex-row w-full h-full bg-slate-50 dark:bg-slate-950 overflow-hidden animate-slide-up">
            <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
              {/* CONTROL BAR (Responsive Contextual Controls) */}
              <div className="flex-none border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-2 md:p-3 overflow-x-auto">
                <div className="flex items-center gap-3 min-w-min">
                  {/* SWOT CONTROLS */}
                  {selectedGraphId === "swot_analysis" && (
                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <select
                          value={swotBench}
                          onChange={(e) => setSwotBench(e.target.value)}
                          className="bg-transparent text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                        >
                          <option value="FD">vs FD</option>
                          <option value="MF">vs MF</option>
                        </select>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                        <select
                          value={swotMode}
                          onChange={(e) => setSwotMode(e.target.value)}
                          className="bg-transparent text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                        >
                          <option value="nominal">Nominal</option>
                          <option value="real">Real</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        {[
                          { label: "FD", key: "fd" },
                          { label: "MF", key: "mf" },
                          { label: "INF", key: "inflation" },
                        ].map((rate) => (
                          <div
                            key={rate.key}
                            className="flex items-center gap-1"
                          >
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">
                              {rate.label}
                            </label>
                            <input
                              type="number"
                              value={swotRates[rate.key]}
                              onChange={(e) =>
                                setSwotRates((prev) => ({
                                  ...prev,
                                  [rate.key]:
                                    parseFloat(e.target.value) || 0,
                                }))
                              }
                              className="w-10 md:w-12 p-0.5 text-xs md:text-sm font-bold text-slate-700 text-center focus:outline-none border-b border-transparent focus:border-blue-500"
                            />
                            <span className="text-xs text-slate-400">%</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setAppliedRates({ ...swotRates })}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 text-xs md:text-sm font-bold"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Calc</span>
                      </button>

                      <button
                        onClick={() => setShowSwotGuide(!showSwotGuide)}
                        className={`p-2 rounded-lg transition-colors ${showSwotGuide
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        title="How to read this graph"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* TRADE PNL PLOT STOCK SELECTOR
                  {selectedGraphId === "trade_pnl_plot" && (
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Selected Asset
                      </span>
                      <select
                        value={selectedStockIdx}
                        onChange={(e) =>
                          setSelectedStockIdx(parseInt(e.target.value))
                        }
                        className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                      >
                        {(() => {
                          let root = activeRawData;
                          if (root.graph_data) root = root.graph_data;
                          const stockMap = root.stock_data || root;
                          const validNames = Object.keys(stockMap || {}).filter(
                            (key) => {
                              const val = stockMap[key];
                              return (
                                val &&
                                typeof val === "object" &&
                                Array.isArray(val.dates)
                              );
                            }
                          );
                          return validNames.map((name, i) => (
                            <option key={name} value={i}>
                              {name}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>
                  )} */}
                </div>
              </div>

              {/* SWOT GUIDE MODAL (Absolute Overlay) */}
              {showSwotGuide && selectedGraphId === "swot_analysis" && (
                <div className="absolute top-16 right-4 z-50 w-72 md:w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">
                        Interpret Matrix
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Strategic Quadrants
                      </p>
                    </div>
                    <button
                      onClick={() => setShowSwotGuide(false)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="space-y-4 text-xs font-medium">
                    {[
                      {
                        label: "Strengths",
                        col: "blue",
                        emoji: "🟦",
                        desc: `Beating MF (${appliedRates.mf}%). High-alpha winners to hold.`,
                      },
                      {
                        label: "Opportunities",
                        col: "emerald",
                        emoji: "🟩",
                        desc: `Beating FD (${appliedRates.fd}%) but below MF. Growing potential.`,
                      },
                      {
                        label: "Weaknesses",
                        col: "amber",
                        emoji: "🟧",
                        desc: `Returns below FD. High opportunity cost.`,
                      },
                      {
                        label: "Threats",
                        col: "rose",
                        emoji: "🟥",
                        desc: `Negative returns. Capital erosion risk.`,
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl bg-${item.col}-50 dark:bg-${item.col}-900/20 flex items-center justify-center shrink-0 border border-${item.col}-100 dark:border-${item.col}-800`}
                        >
                          <span className="text-xl">{item.emoji}</span>
                        </div>
                        <div>
                          <strong className={`block text-${item.col}-700 dark:text-${item.col}-400 mb-0.5`}>
                            {item.label}
                          </strong>
                          <span className="text-slate-500 dark:text-slate-400 leading-tight">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex-1 bg-white dark:bg-slate-900 relative overflow-hidden graph-container">
                {activeError || processedData?.error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-sm p-6 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                      <AlertCircle className="w-10 h-10 text-rose-400 dark:text-rose-500 mx-auto mb-3" />
                      <p className="text-rose-600 dark:text-rose-400 font-medium">
                        {activeError || processedData?.error}
                      </p>
                    </div>
                  </div>
                ) : processedData ? (
                  <div className="w-full h-full relative">
                    <ErrorBoundary>
                      <Plot
                        data={processedData.data}
                        layout={{ ...processedData.layout }}
                        config={{ responsive: true, displayModeBar: false }}
                        style={{
                          width: "100%",
                          height: "100%",
                          minHeight: "600px",
                        }}
                        useResizeHandler={true}
                        className="plotly-chart"
                      />
                    </ErrorBoundary>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300 dark:text-slate-700 font-medium">
                    No Data
                  </div>
                )}
              </div>
            </div>

            {showSidebar && (
              <div className="w-full lg:w-[380px] xl:w-[420px] bg-slate-50 dark:bg-slate-950 border-l border-slate-100 dark:border-slate-800 overflow-y-auto p-4 md:p-8 animate-slide-left shrink-0">
                {activeInsights &&
                  (Array.isArray(activeInsights)
                    ? activeInsights.length > 0
                    : activeInsights.key_takeaways?.length > 0 ||
                    activeInsights.recommendations?.length > 0) ? (
                  <div className="space-y-6">
                    {/* Handle array of insights (Risk-Return Matrix format) */}
                    {Array.isArray(activeInsights) &&
                      activeInsights.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Risk Analysis
                            Insights
                          </h3>
                          {activeInsights.map((item, idx) => {
                            const isGuide = item.type === "guide";
                            return (
                              <div
                                key={idx}
                                className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md animate-slide-up ${isGuide
                                  ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30"
                                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                                  }`}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                              >
                                {isGuide && (
                                  <Info className="float-right w-4 h-4 text-blue-400 dark:text-blue-500 ml-2" />
                                )}
                                <h4
                                  className={`font-bold mb-2 text-sm ${isGuide ? "text-blue-800 dark:text-blue-200" : "text-slate-800 dark:text-slate-100"
                                    }`}
                                >
                                  {item.title}
                                </h4>
                                <div
                                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: item.text?.replace(
                                      /\*\*(.*?)\*\*/g,
                                      "<strong>$1</strong>"
                                    ),
                                  }}
                                />
                                {item.reasoning && (
                                  <div
                                    className={`text-xs leading-relaxed ${isGuide ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-500"
                                      }`}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: item.reasoning
                                          ?.replace(/\n/g, "<br/>")
                                          .replace(
                                            /\*\*(.*?)\*\*/g,
                                            "<strong>$1</strong>"
                                          ),
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                    {/* Handle legacy object format (key_takeaways/recommendations) */}
                    {!Array.isArray(activeInsights) &&
                      activeInsights.key_takeaways?.length > 0 && (
                        <div
                          className="animate-slide-up"
                          style={{ animationDelay: "0.1s" }}
                        >
                          <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Key Insights
                          </h3>
                          <ul className="space-y-4">
                            {activeInsights.key_takeaways.map((item, idx) => {
                              const isStr = typeof item === "string";
                              const title = isStr ? null : item?.title;
                              const text = isStr ? item : item?.text || "";
                              const reasoning = isStr ? null : item?.reasoning;
                              return (
                                <li
                                  key={idx}
                                  className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${item.type === "guide"
                                    ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                                    }`}
                                >
                                  {title && (
                                    <div
                                      className={`font-bold mb-2 text-sm ${item.type === "guide"
                                        ? "text-blue-800 dark:text-blue-200"
                                        : "text-slate-800 dark:text-slate-100"
                                        }`}
                                    >
                                      {title}
                                    </div>
                                  )}
                                  <div
                                    className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3"
                                    dangerouslySetInnerHTML={{
                                      __html: (text && typeof text === "string"
                                        ? text
                                        : ""
                                      )
                                        .replace(
                                          /\*\*(.*?)\*\*/g,
                                          "<strong>$1</strong>"
                                        )
                                        .replace(/\n/g, "<br/>"),
                                    }}
                                  />
                                  {reasoning && (
                                    <div
                                      className={`text-xs p-3 rounded-lg italic ${item.type === "guide"
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/20"
                                        : "text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50"
                                        }`}
                                    >
                                      {item.type === "guide" ? "ℹ️ " : "💡 "}
                                      {reasoning}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                    {!Array.isArray(activeInsights) &&
                      activeInsights.recommendations?.length > 0 && (
                        <div
                          className="animate-slide-up"
                          style={{ animationDelay: "0.2s" }}
                        >
                          <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Action Plan
                          </h3>
                          <ul className="space-y-4">
                            {activeInsights.recommendations.map((item, idx) => {
                              const isStr = typeof item === "string";
                              const title = isStr ? null : item?.title;
                              const text = isStr ? item : item?.text || "";
                              const reasoning = isStr ? null : item?.reasoning;
                              return (
                                <li
                                  key={idx}
                                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                                >
                                  {title && (
                                    <div className="font-bold text-slate-800 dark:text-slate-100 mb-2 text-sm">
                                      {title}
                                    </div>
                                  )}
                                  <div
                                    className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3"
                                    dangerouslySetInnerHTML={{
                                      __html: (text && typeof text === "string"
                                        ? text
                                        : ""
                                      )
                                        .replace(
                                          /\*\*(.*?)\*\*/g,
                                          "<strong>$1</strong>"
                                        )
                                        .replace(/\n/g, "<br/>"),
                                    }}
                                  />
                                  {reasoning && (
                                    <div className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg italic">
                                      🎯 {reasoning}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-600 p-8">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                    </div>
                    <p className="font-medium">No insights generated</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .plotly-chart .cursor-crosshair { cursor: default !important; }
        .js-plotly-plot .plotly .cursor-crosshair { cursor: default !important; }
        
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        @keyframes slideLeft { 
          from { opacity: 0; transform: translateX(30px); } 
          to { opacity: 1; transform: translateX(0); } 
        }
        
        @keyframes scaleIn { 
          from { opacity: 0; transform: scale(0.95); } 
          to { opacity: 1; transform: scale(1); } 
        }
        
        .animate-fade-in { 
          animation: fadeIn 0.3s ease-out forwards; 
        }
        
        .animate-slide-up { 
          animation: slideUp 0.5s ease-out forwards; 
          opacity: 0; 
        }
        
        .animate-slide-left { 
          animation: slideLeft 0.4s ease-out forwards; 
        }
        
        .animate-scale-in { 
          animation: scaleIn 0.4s ease-out forwards; 
        }
      `}</style>
    </div>
  );
};

export default GraphCatalog;
