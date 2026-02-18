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
    id: "trade_pnl_plot",
    title: "P&L Timeline",
    description: "Chronological view of all realized profits and losses",
    icon: DollarSign,
    color: "green",
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

const GraphCatalog = ({ graphs, file, currentHoldings }) => {
  const [selectedGraphId, setSelectedGraphId] = useState(null);
  const [lazyData, setLazyData] = useState(null);
  const [lazyLoading, setLazyLoading] = useState(false);
  const [lazyError, setLazyError] = useState(null);

  // SWOT Specific State
  const [swotRates, setSwotRates] = useState({ fd: 7, mf: 15, inflation: 6 });
  const [showSwotGuide, setShowSwotGuide] = useState(false);

  // Correlation Plot Specific State
  const [showCorrelationInfo, setShowCorrelationInfo] = useState(false);

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

  const loadGraph = async (graphId, forceRefresh = false) => {
    setSelectedGraphId(graphId);
    setLazyError(null);
    if (forceRefresh) setLazyData(null); // Clear old data on force refresh

    // Use cached data if available and not forcing refresh
    if (!forceRefresh && graphs && graphs[graphId] && !graphs[graphId].error)
      return;

    // Regular file-based graph loading
    if (!file) {
      setLazyError("No file available.");
      return;
    }

    setLazyLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Pass user-defined rates for SWOT analysis
      if (graphId === "swot_analysis") {
        formData.append("fd_rate", (swotRates.fd / 100).toString());
        formData.append("mf_rate", (swotRates.mf / 100).toString());
        formData.append(
          "inflation_rate",
          (swotRates.inflation / 100).toString()
        );
      }

      const [response] = await Promise.all([
        axios.post(`http://localhost:8000/api/graph/${graphId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        new Promise((resolve) => setTimeout(resolve, 1500)), // UX delay
      ]);

      if (response.data.status === "success") {
        setLazyData(response.data);
      } else {
        setLazyError("Failed to generate analysis.");
      }
    } catch (err) {
      console.error(err);
      setLazyError(
        err.response?.data?.detail || "Failed to generate analysis."
      );
    } finally {
      setLazyLoading(false);
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
        border: "border-emerald-100",
        bg: "bg-emerald-50/50",
        text: "text-emerald-700",
        hover: "hover:bg-emerald-50 hover:border-emerald-200",
        icon: "text-emerald-600",
      },
      blue: {
        border: "border-blue-100",
        bg: "bg-blue-50/50",
        text: "text-blue-700",
        hover: "hover:bg-blue-50 hover:border-blue-200",
        icon: "text-blue-600",
      },
      violet: {
        border: "border-violet-100",
        bg: "bg-violet-50/50",
        text: "text-violet-700",
        hover: "hover:bg-violet-50 hover:border-violet-200",
        icon: "text-violet-600",
      },
      rose: {
        border: "border-rose-100",
        bg: "bg-rose-50/50",
        text: "text-rose-700",
        hover: "hover:bg-rose-50 hover:border-rose-200",
        icon: "text-rose-600",
      },
      amber: {
        border: "border-amber-100",
        bg: "bg-amber-50/50",
        text: "text-amber-700",
        hover: "hover:bg-amber-50 hover:border-amber-200",
        icon: "text-amber-600",
      },
      cyan: {
        border: "border-cyan-100",
        bg: "bg-cyan-50/50",
        text: "text-cyan-700",
        hover: "hover:bg-cyan-50 hover:border-cyan-200",
        icon: "text-cyan-600",
      },
      green: {
        border: "border-green-100",
        bg: "bg-green-50/50",
        text: "text-green-700",
        hover: "hover:bg-green-50 hover:border-green-200",
        icon: "text-green-600",
      },
      indigo: {
        border: "border-indigo-100",
        bg: "bg-indigo-50/50",
        text: "text-indigo-700",
        hover: "hover:bg-indigo-50 hover:border-indigo-200",
        icon: "text-indigo-600",
      },
    };
    return map[color] || map.blue;
  };

  const transformData = (graphId, rawData) => {
    if (!rawData) return null;
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

          return {
            x: d.x,
            y: d.y,
            text: d.text.map((t) => t.split(" ")[0]),
            customdata: d.text.map((t, i) => [
              t,
              d.x[i].toFixed(2),
              d.y[i].toFixed(2),
            ]),
            marker: {
              color: colors,
              size: 18,
              opacity: 0.8,
              line: { width: 1.5, color: "white" },
            },
          };
        };

        const initial = getTraceData("FD", "real");

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
              text: "Real Returns vs FD Rate (" + swotRates.fd + "%)",
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
            updatemenus: [
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
            margin: { t: 40, b: 40, l: 60, r: 40 },
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
            updatemenus: [
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
            margin: { t: 80, b: 40, l: 60, r: 20 },
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
              text: `${visibleScrip} Performance`,
              font: {
                family: "Inter, sans-serif",
                size: 20,
                weight: 600,
                color: "#1e293b",
              },
            },
            updatemenus: [
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
            margin: { t: 80, b: 40, l: 60, r: 80 },
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
            margin: { t: 80, b: 60, l: 60, r: 60 },
            hovermode: "closest",
            showlegend: true,
            legend: { orientation: "h", y: -0.15 },
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
          const isVisible = idx === 0;
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
            updatemenus,
            hovermode: "closest",
            showlegend: true,
            legend: { orientation: "h", y: -0.2 },
            template: "plotly_white",
            margin: { t: 80, b: 40, l: 60, r: 80 },
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
                outlinecolor: "white",
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
              dropdownButtons.length > 1
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
                : [],
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
            plot_bgcolor: "white",
            paper_bgcolor: "white",
            margin: { t: 100, b: 100, l: 140, r: 80 },
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

  const processedData = transformData(selectedGraphId, activeRawData);

  return (
    <div className="space-y-6 font-sans">
      <LoadingScreen isVisible={lazyLoading} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {GRAPH_METADATA.filter((graph) => {
          // Include lazy-loaded graphs (they don't have backend data initially)
          if (graph.lazyLoad) return true;
          // Include graphs that came from backend with success status
          const backendGraph = graphs?.[graph.id];
          return backendGraph && backendGraph.status === "success";
        }).map((graph) => {
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
                  className={`p-3 rounded-xl bg-white shadow-sm ${styles.icon} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`font-bold text-base ${styles.text}`}>
                  {graph.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {graph.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* FULL SCREEN OVERLAY */}
      {selectedGraphId && !lazyLoading && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-white flex flex-col animate-fade-in">
          <div className="flex-1 flex flex-col lg:flex-row w-full h-full bg-slate-50 overflow-hidden animate-slide-up">
            <div className="lg:hidden flex-none border-b px-4 py-3 flex items-center justify-between">
              <button
                onClick={closePage}
                className="flex items-center gap-2 text-slate-600 font-semibold"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            </div>

            <div className="flex-1 flex flex-col relative bg-white p-2">
              <div className="hidden lg:flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={closePage}
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    {
                      GRAPH_METADATA.find((g) => g.id === selectedGraphId)
                        ?.title
                    }
                  </h2>
                </div>

                {/* SWOT CONTROL BAR */}
                {selectedGraphId === "swot_analysis" && (
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 px-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        FD
                      </label>
                      <input
                        type="number"
                        value={swotRates.fd}
                        onChange={(e) =>
                          setSwotRates((prev) => ({
                            ...prev,
                            fd: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-12 p-1 text-sm border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-violet-400"
                      />
                      <span className="text-sm text-slate-600">%</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="flex items-center gap-2 px-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        MF
                      </label>
                      <input
                        type="number"
                        value={swotRates.mf}
                        onChange={(e) =>
                          setSwotRates((prev) => ({
                            ...prev,
                            mf: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-12 p-1 text-sm border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-violet-400"
                      />
                      <span className="text-sm text-slate-600">%</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="flex items-center gap-2 px-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        INFL
                      </label>
                      <input
                        type="number"
                        value={swotRates.inflation}
                        onChange={(e) =>
                          setSwotRates((prev) => ({
                            ...prev,
                            inflation: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-12 p-1 text-sm border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-violet-400"
                      />
                      <span className="text-sm text-slate-600">%</span>
                    </div>
                    <button
                      onClick={() => loadGraph("swot_analysis", true)}
                      className="ml-2 p-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <RefreshCw className="w-4 h-4" /> Calc
                    </button>
                    <button
                      onClick={() => setShowSwotGuide(!showSwotGuide)}
                      className="ml-1 p-1.5 text-slate-400 hover:bg-slate-100 rounded-md transition-colors"
                      title="How to read this graph"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* CORRELATION PLOT INFO BUTTON */}
                {selectedGraphId === "correlation_plot" && (
                  <button
                    onClick={() => setShowCorrelationInfo(!showCorrelationInfo)}
                    className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md transition-colors"
                    title="How to read this correlation heatmap"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* SWOT GUIDE MODAL */}
              {showSwotGuide && selectedGraphId === "swot_analysis" && (
                <div className="absolute top-16 right-4 z-50 w-80 bg-white/95 backdrop-blur shadow-xl rounded-2xl border border-slate-200 p-5 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">
                      S.W.O.T Matrix Guide
                    </h4>
                    <button onClick={() => setShowSwotGuide(false)}>
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-lg">🟦</span>
                      </div>
                      <div>
                        <strong className="block text-blue-700">
                          Strengths
                        </strong>
                        High Return & Low Risk. Beating your MF target (
                        {swotRates.mf}%). Winners you should consider holding or
                        adding to.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <span className="text-lg">🟩</span>
                      </div>
                      <div>
                        <strong className="block text-emerald-700">
                          Opportunities
                        </strong>
                        Positive returns beating FDs ({swotRates.fd}%) but not
                        MFs. Potential breakout candidates.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <span className="text-lg">🟧</span>
                      </div>
                      <div>
                        <strong className="block text-amber-700">
                          Weaknesses
                        </strong>
                        Making money, but LESS than a Bank FD (Safety). High
                        opportunity cost to hold these.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                        <span className="text-lg">🟥</span>
                      </div>
                      <div>
                        <strong className="block text-red-700">Threats</strong>
                        Negative Returns. Capital erosion. Review stop-losses
                        immediately.
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="mb-2 italic text-slate-500">
                        <strong>Nominal vs Real:</strong> "Real" returns
                        subtract Inflation ({swotRates.inflation}%) to show your
                        true purchasing power gain/loss.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CORRELATION INFO MODAL */}
              {showCorrelationInfo &&
                selectedGraphId === "correlation_plot" && (
                  <div className="absolute top-16 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur shadow-2xl rounded-2xl border border-cyan-200 p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-cyan-900 text-lg">
                        📊 Correlation Heatmap Guide
                      </h4>
                      <button onClick={() => setShowCorrelationInfo(false)}>
                        <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                      </button>
                    </div>

                    <div className="space-y-4 text-sm">
                      {/* What this shows */}
                      <div className="bg-cyan-50 p-3 rounded-lg">
                        <p className="text-cyan-900 font-medium">
                          "This chart shows how closely different stocks move
                          together, or how closely they move with the market."
                        </p>
                      </div>

                      {/* What correlation means */}
                      <div>
                        <p className="text-slate-700 font-semibold mb-1">
                          Correlation answers one simple question:
                        </p>
                        <p className="text-slate-600 italic">
                          When one price moves, does the other usually move in
                          the same way?
                        </p>
                      </div>

                      {/* Color guide */}
                      <div>
                        <p className="text-slate-700 font-semibold mb-2">
                          How to read the colors:
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-4 rounded"
                              style={{
                                background:
                                  "linear-gradient(to right, #6366f1, #60a5fa)",
                              }}
                            ></div>
                            <span className="text-slate-600">
                              Darker/warmer → Stocks move very similarly
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-4 rounded bg-gray-300"></div>
                            <span className="text-slate-600">
                              Lighter/cooler → Stocks move independently
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-4 rounded"
                              style={{
                                background:
                                  "linear-gradient(to right, #f87171, #fb923c)",
                              }}
                            ></div>
                            <span className="text-slate-600">
                              Opposite colors → Stocks move in opposite
                              directions
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Two views */}
                      <div className="border-t border-slate-200 pt-4">
                        <p className="text-slate-700 font-semibold mb-3">
                          Two ways to view this chart:
                        </p>

                        {/* Stock vs Benchmark */}
                        <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                          <p className="font-semibold text-blue-900 mb-1">
                            1️⃣ Stock vs Benchmark view
                          </p>
                          <p className="text-blue-800 text-sm mb-2 italic">
                            "This view shows how much each stock follows the
                            market or a market index."
                          </p>
                          <ul className="text-slate-600 text-xs space-y-1 ml-4 list-disc">
                            <li>
                              A high value means the stock usually rises and
                              falls with the benchmark
                            </li>
                            <li>
                              A low value means the stock behaves independently
                              of the market
                            </li>
                          </ul>
                          <p className="mt-2 text-xs text-blue-700">
                            <strong>💡 Why this matters:</strong> Stocks that
                            closely follow the market do not protect you much
                            during market falls, while independent stocks can
                            help reduce overall risk.
                          </p>
                        </div>

                        {/* Stock vs Stock */}
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="font-semibold text-purple-900 mb-1">
                            2️⃣ Stock vs Stock view
                          </p>
                          <p className="text-purple-800 text-sm mb-2 italic">
                            "This view shows how similar your stocks are to each
                            other, regardless of the market."
                          </p>
                          <ul className="text-slate-600 text-xs space-y-1 ml-4 list-disc">
                            <li>
                              Stocks with high correlation tend to move together
                            </li>
                            <li>
                              Stocks with low correlation move differently
                            </li>
                          </ul>
                          <p className="mt-2 text-xs text-purple-700">
                            <strong>💡 Why this matters:</strong> Owning many
                            stocks that move together does not truly diversify
                            your portfolio, even if they are different
                            companies.
                          </p>
                        </div>
                      </div>

                      {/* How this affects portfolio */}
                      <div className="border-t border-slate-200 pt-4">
                        <p className="text-slate-700 font-semibold mb-2">
                          How this affects your portfolio:
                        </p>
                        <ul className="text-slate-600 text-xs space-y-1.5 ml-4 list-disc">
                          <li>
                            High correlation across many stocks means hidden
                            concentration risk
                          </li>
                          <li>
                            Low correlation improves stability and downside
                            protection
                          </li>
                          <li>
                            A good portfolio balances returns and independence
                          </li>
                        </ul>
                      </div>

                      {/* Important note */}
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-amber-900 font-semibold mb-1 text-xs">
                          ⚠️ Important note:
                        </p>
                        <p className="text-amber-800 text-xs italic">
                          "Correlation does not predict future returns — it only
                          shows how prices have moved together in the past."
                        </p>
                        <p className="text-amber-700 text-xs mt-1">
                          This data is calculated using daily price changes over
                          the selected lookback period.
                        </p>
                      </div>

                      {/* Quick takeaway */}
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-emerald-900 font-semibold mb-1 text-xs">
                          ✨ Quick takeaway:
                        </p>
                        <p className="text-emerald-800 text-sm italic">
                          "The fewer stocks that move the same way at the same
                          time, the more balanced your portfolio tends to be."
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              <div className="flex-1 bg-white relative overflow-hidden graph-container">
                {activeError || processedData?.error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-sm p-6 bg-rose-50 rounded-2xl border border-rose-100">
                      <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                      <p className="text-rose-600 font-medium">
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
                          minHeight: "500px",
                        }}
                        useResizeHandler={true}
                        className="plotly-chart"
                      />
                    </ErrorBoundary>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300 font-medium">
                    No Data
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[400px] xl:w-[450px] bg-slate-50 border-l border-slate-100 overflow-y-auto p-6 lg:p-10 animate-slide-left">
              {activeInsights &&
              (Array.isArray(activeInsights)
                ? activeInsights.length > 0
                : activeInsights.key_takeaways?.length > 0 ||
                  activeInsights.recommendations?.length > 0) ? (
                <div className="space-y-8">
                  {/* Handle array of insights (Risk-Return Matrix format) */}
                  {Array.isArray(activeInsights) &&
                    activeInsights.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Risk Analysis
                          Insights
                        </h3>
                        {activeInsights.map((item, idx) => {
                          const isGuide = item.type === "guide";
                          return (
                            <div
                              key={idx}
                              className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md animate-slide-up ${
                                isGuide
                                  ? "bg-blue-50/50 border-blue-100"
                                  : "bg-white border-slate-100"
                              }`}
                              style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                              {isGuide && (
                                <Info className="float-right w-4 h-4 text-blue-400 ml-2" />
                              )}
                              <h4
                                className={`font-bold mb-2 text-sm ${
                                  isGuide ? "text-blue-800" : "text-slate-800"
                                }`}
                              >
                                {item.title}
                              </h4>
                              <div
                                className="text-sm font-medium text-slate-700 mb-2 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: item.text?.replace(
                                    /\*\*(.*?)\*\*/g,
                                    "<strong>$1</strong>"
                                  ),
                                }}
                              />
                              {item.reasoning && (
                                <div
                                  className={`text-xs leading-relaxed ${
                                    isGuide ? "text-blue-600" : "text-slate-500"
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
                        <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
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
                                className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${
                                  item.type === "guide"
                                    ? "bg-blue-50/50 border-blue-100"
                                    : "bg-white border-slate-100"
                                }`}
                              >
                                {title && (
                                  <div
                                    className={`font-bold mb-2 text-sm ${
                                      item.type === "guide"
                                        ? "text-blue-800"
                                        : "text-slate-800"
                                    }`}
                                  >
                                    {title}
                                  </div>
                                )}
                                <div
                                  className="text-sm text-slate-600 leading-relaxed mb-3"
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
                                    className={`text-xs p-3 rounded-lg italic ${
                                      item.type === "guide"
                                        ? "text-blue-600 bg-blue-100/50"
                                        : "text-slate-400 bg-slate-50"
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
                        <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2">
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
                                className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                              >
                                {title && (
                                  <div className="font-bold text-slate-800 mb-2 text-sm">
                                    {title}
                                  </div>
                                )}
                                <div
                                  className="text-sm text-slate-600 leading-relaxed mb-3"
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
                                  <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg italic">
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
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-medium">No insights generated</p>
                </div>
              )}
            </div>
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
