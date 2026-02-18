import React, { useState } from "react";
import {
  Target,
  Activity,
  Shield,
  Scale,
  BarChart2,
  TrendingUp,
  Box,
  Zap,
  Layers,
  PieChart,
  Clock,
  ArrowRight,
  TrendingDown,
  X,
  CandlestickChart,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import CandleLoader from "./CandleLoader";

// --- Components ---

/**
 * Rolling Graph Modal
 * Visualizes the time-series data for a specific metric.
 */
const RollingGraphModal = ({ isOpen, onClose, title, data, color }) => {
  if (!isOpen || !data || data.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              {title} History
            </h3>
            <p className="text-sm text-gray-500">Rolling 30-day analysis</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color || "#3b82f6"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/**
 * Metric Cube Component
 * Lean, space-efficient, interactive.
 */
const MetricCube = ({
  title,
  value,
  subvalue,
  icon: Icon,
  colorClass,
  textColor,
  rollingData,
  onViewGraph,
}) => {
  return (
    <div
      className={`relative group p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-gray-100`}
    >
      {/* Background Blob for aesthetic */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 blur-2xl -mr-6 -mt-6 transition-colors ${colorClass.replace(
          "bg-",
          "bg-"
        )}`}
      ></div>

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div
          className={`p-2.5 rounded-xl ${colorClass} ${textColor} bg-opacity-20`}
        >
          <Icon size={20} />
        </div>
        {rollingData && (
          <button
            onClick={() => onViewGraph(title, rollingData, textColor)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded-lg text-xs text-gray-500 flex items-center gap-1"
          >
            <Activity size={12} /> Graph
          </button>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
          {subvalue && (
            <span className="text-xs font-medium text-gray-500">
              {subvalue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const PortfolioMetrics = ({ metrics, onBack, isLoading }) => {
  const [graphState, setGraphState] = useState({
    isOpen: false,
    title: "",
    data: [],
    color: "",
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex justify-center">
        <CandleLoader message="Computing Alpha, Beta, and Rolling History..." />
      </div>
    );
  }

  if (!metrics) return null;

  // Unwrap aggregate data
  // Fix: 'metrics' prop is likely already the aggregate object from Dashboard
  const agg = metrics.portfolio_metrics || metrics;
  const rolling = agg.rolling || {};
  const valuation = metrics.valuation || {};

  // Define Cubes Configuration
  const cubes = [
    // 1. Core Returns & Vol
    {
      title: "Ann. Return",
      value: agg.Annualized_Return
        ? (agg.Annualized_Return * 100).toFixed(1) + "%"
        : "-",
      icon: TrendingUp,
      color: "bg-emerald-100",
      text: "text-emerald-600",
    },
    {
      title: "Ann. Volatility",
      value: agg.Annualized_Volatility
        ? (agg.Annualized_Volatility * 100).toFixed(1) + "%"
        : "-",
      icon: Activity,
      color: "bg-rose-100",
      text: "text-rose-600",
      rolling: rolling.rolling_volatility,
    },
    {
      title: "Max Drawdown",
      value: agg.Max_Drawdown ? (agg.Max_Drawdown * 100).toFixed(1) + "%" : "-",
      icon: TrendingDown,
      color: "bg-red-100",
      text: "text-red-600",
      // Rolling DD not implemented yet
    },

    // 2. Ratios (The Big Ones)
    {
      title: "Sharpe Ratio",
      value: agg.Sharpe_Ratio ? agg.Sharpe_Ratio.toFixed(2) : "-",
      subvalue: "> 1.0 is Good",
      icon: Zap,
      color: "bg-violet-100",
      text: "text-violet-600",
      rolling: rolling.rolling_sharpe,
    },
    {
      title: "Sortino Ratio",
      value: agg.Sortino_Ratio ? agg.Sortino_Ratio.toFixed(2) : "-",
      icon: Shield,
      color: "bg-teal-100",
      text: "text-teal-600",
    },
    {
      title: "Omega Ratio",
      value: agg.Omega_Ratio ? agg.Omega_Ratio.toFixed(2) : "-",
      icon: PieChart,
      color: "bg-cyan-100",
      text: "text-cyan-600",
    },

    // 3. Alpha & Beta (CAPM)
    {
      title: "Alpha α",
      value: agg.Alpha_Pct ? (agg.Alpha_Pct * 100).toFixed(2) + "%" : "-",
      icon: Target,
      color: "bg-blue-100",
      text: "text-blue-600",
      rolling: rolling.rolling_alpha,
    },
    {
      title: "Beta β",
      value: agg.Beta ? agg.Beta.toFixed(2) : "-",
      subvalue: "vs Nifty 50",
      icon: Scale,
      color: "bg-amber-100",
      text: "text-amber-600",
      rolling: rolling.rolling_beta,
    },
    {
      title: "Treynor Ratio",
      value: agg.Treynor_Ratio ? agg.Treynor_Ratio.toFixed(2) : "-",
      icon: BarChart2,
      color: "bg-lime-100",
      text: "text-lime-700",
    },

    // 4. Fama-French & Smart Beta
    {
      title: "SMB β (Small Cap)",
      value: agg.SMB_Beta ? agg.SMB_Beta.toFixed(2) : "-",
      icon: Box,
      color: "bg-indigo-100",
      text: "text-indigo-600",
    },
    {
      title: "HML β (Value)",
      value: agg.HML_Beta ? agg.HML_Beta.toFixed(2) : "-",
      icon: Layers,
      color: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      title: "MOM β (Momentum)",
      value: agg.MOM_Beta ? agg.MOM_Beta.toFixed(2) : "-",
      icon: TrendingUp,
      color: "bg-pink-100",
      text: "text-pink-600",
    },

    // 5. Structure & Valuation
    {
      title: "HHI (Concentration)",
      value: agg.HHI ? agg.HHI.toFixed(2) : "-",
      subvalue: agg.HHI < 0.15 ? "Low" : "High",
      icon: PieChart,
      color: "bg-gray-100",
      text: "text-gray-600",
    },
    {
      title: "Tracking Error",
      value: agg.Tracking_Error
        ? (agg.Tracking_Error * 100).toFixed(1) + "%"
        : "-",
      icon: Activity,
      color: "bg-orange-100",
      text: "text-orange-600",
    },
    {
      title: "Information Ratio",
      value: agg.Information_Ratio ? agg.Information_Ratio.toFixed(2) : "-",
      icon: Target,
      color: "bg-sky-100",
      text: "text-sky-600",
    },
  ];

  const handleOpenGraph = (title, data, textColorClass) => {
    // Extract hex color from class or map?
    // Simplified mapping for recharts
    const colorMap = {
      "text-blue-600": "#2563eb",
      "text-violet-600": "#7c3aed",
      "text-emerald-600": "#059669",
      "text-rose-600": "#e11d48",
      "text-amber-600": "#d97706",
    };
    setGraphState({
      isOpen: true,
      title,
      data,
      color: colorMap[textColorClass] || "#3b82f6",
    });
  };

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <RollingGraphModal
        isOpen={graphState.isOpen}
        onClose={() => setGraphState({ ...graphState, isOpen: false })}
        title={graphState.title}
        data={graphState.data}
        color={graphState.color}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="block">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-yellow-500 fill-yellow-500" size={24} />
            Advanced Portfolio Metrics
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Comprehensive risk, return, and factor analysis.
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-all shadow-sm text-sm"
        >
          <ArrowRight className="rotate-180" size={16} />
          Back to Dashboard
        </button>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {cubes.map((metric, idx) => (
          <MetricCube
            key={idx}
            {...metric}
            colorClass={metric.color}
            textColor={metric.text}
            onViewGraph={handleOpenGraph}
            rollingData={metric.rolling}
          />
        ))}
      </div>
    </div>
  );
};

export default PortfolioMetrics;
