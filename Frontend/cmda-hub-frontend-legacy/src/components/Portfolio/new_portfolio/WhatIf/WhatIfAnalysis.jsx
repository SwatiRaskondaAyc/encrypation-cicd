import React, { useMemo, useState } from "react";
import {
  Zap,
  TrendingUp,
  Activity,
  ArrowRight,
  PieChart as PieChartIcon,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Color Scheme for Sectors - Vibrant and distinct
const COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#f43f5e", // Rose
  "#64748b", // Slate
];

// --- SUB-COMPONENTS ---
const MetricCard = ({
  label,
  subtitle,
  oldVal,
  newVal,
  suffix = "",
  prefix = "",
  decimals = 2,
}) => {
  if (oldVal === undefined || newVal === undefined) return null;

  const diff = newVal - oldVal;
  const pct = oldVal !== 0 ? (diff / Math.abs(oldVal)) * 100 : 0;
  const isPositive = diff > 0;
  // Small threshold for neutrality to avoid tiny float diffs showing as change
  const isNeutral = Math.abs(diff) < 0.001;

  const lowerIsBetter = [
    "concentration",
    "volatility",
    "beta",
    "hhi",
    "risk",
  ].some((k) => label.toLowerCase().includes(k));

  let isGood = null;
  if (!isNeutral) {
    if (lowerIsBetter) {
      isGood = !isPositive;
    } else {
      isGood = isPositive;
    }
  }

  const indicatorColor = isNeutral
    ? "text-slate-400 dark:text-gray-500"
    : isGood
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/50"
      : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800/50";

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-1">
        <div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
            {label}
          </span>
          {subtitle && (
            <span className="text-[9px] font-medium text-slate-400 dark:text-gray-500 block -mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
        {!isNeutral && (
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${indicatorColor}`}
          >
            {isPositive ? "+" : ""}
            {pct.toFixed(1)}%
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {prefix}
          {newVal.toFixed(decimals)}
          {suffix}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 dark:text-gray-500 font-medium">
        <span>
          Was: {prefix}
          {oldVal.toFixed(decimals)}
          {suffix}
        </span>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const WhatIfAnalysis = ({ result, initialHoldings }) => {
  const { comparison, conclusion, modified_holdings } = result;

  // State for collapsible detailed metrics
  const [showDeepDive, setShowDeepDive] = useState(false);

  // Data Prep for Pie Charts
  const prepareSectorData = (holdings) => {
    if (!holdings || holdings.length === 0) return [];

    const sectorMap = {};
    let totalValue = 0;

    holdings.forEach((h) => {
      const sector = h.Sector || h.sector || "Other";
      const value = (h.quantity || 0) * (h.current_price || 0);
      if (value > 0) {
        sectorMap[sector] = (sectorMap[sector] || 0) + value;
        totalValue += value;
      }
    });

    return Object.keys(sectorMap)
      .map((sector) => ({
        name: sector,
        value: sectorMap[sector],
        percent: ((sectorMap[sector] / totalValue) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);
  };

  const currentSectorData = useMemo(
    () => prepareSectorData(initialHoldings),
    [initialHoldings]
  );
  const newSectorData = useMemo(
    () => prepareSectorData(modified_holdings),
    [modified_holdings]
  );

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 dark:bg-slate-900 text-white p-2 rounded-lg shadow-xl text-xs border border-slate-700 dark:border-slate-600">
          <p className="font-bold mb-1">{payload[0].name}</p>
          <div className="flex justify-between gap-4">
            <span className="opacity-70">Alloc:</span>
            <span className="font-bold text-yellow-400">
              {payload[0].payload.percent}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
      {/* 1. COMPACT HEADER: Verdict + Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
        {/* Dynamic Background Glow */}
        <div
          className={`absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none opacity-20
            ${conclusion?.verdict === "POSITIVE"
              ? "bg-emerald-400"
              : conclusion?.verdict === "NEGATIVE"
                ? "bg-rose-400"
                : "bg-slate-400"
            }
            `}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {conclusion?.verdict === "POSITIVE" ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" /> Thumbs Up
                  </span>
                ) : conclusion?.verdict === "NEGATIVE" ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 text-[10px] font-bold tracking-wider uppercase border border-rose-200 dark:border-rose-800">
                    <AlertTriangle className="w-3.5 h-3.5" /> Caution
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold tracking-wider uppercase border border-slate-200 dark:border-slate-600">
                    <Info className="w-3.5 h-3.5" /> Neutral
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                  Verdict
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2">
                {conclusion?.summary || "Analysis Complete"}
              </h2>
            </div>
          </div>

          {/* Key Insights (All) */}
          {conclusion?.insights && conclusion.insights.length > 0 && (
            <div className="mt-4 grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {conclusion.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 
                                ${insight.type === "risk"
                        ? "bg-rose-500 dark:bg-rose-400"
                        : insight.type === "return"
                          ? "bg-emerald-500 dark:bg-emerald-400"
                          : "bg-slate-500 dark:bg-slate-400"
                      }
                             `}
                  />
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {insight.insight}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. SPLIT VIEW: Key Metrics vs Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT: Simplified Key Metrics */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest px-1">
            Primary Indicators
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Sharpe Ratio"
              subtitle="Efficiency"
              oldVal={comparison?.sharpe_ratio?.old}
              newVal={comparison?.sharpe_ratio?.new}
            />
            <MetricCard
              label="Sortino Ratio"
              subtitle="Safety"
              oldVal={comparison?.sortino_ratio?.old}
              newVal={comparison?.sortino_ratio?.new}
            />
            <MetricCard
              label="Alpha"
              subtitle="Outperformance"
              oldVal={
                comparison?.jensens_alpha?.old != null
                  ? comparison.jensens_alpha.old * 100
                  : undefined
              }
              newVal={
                comparison?.jensens_alpha?.new != null
                  ? comparison.jensens_alpha.new * 100
                  : undefined
              }
              suffix="%"
              decimals={2}
            />
            <MetricCard
              label="Beta"
              subtitle="Volatility"
              oldVal={comparison?.beta_daily?.old}
              newVal={comparison?.beta_daily?.new}
            />
            <MetricCard
              label="Capital"
              subtitle="Deployed"
              oldVal={comparison?.deployed_capital?.old}
              newVal={comparison?.deployed_capital?.new}
              prefix="₹"
            />
          </div>
        </div>

        {/* RIGHT: Compact Charts */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Allocation Shift
            </span>
          </div>

          <div className="flex items-center justify-around relative">
            {/* BEFORE */}
            <div className="w-[140px] h-[160px] relative flex flex-col items-center">
              <ResponsiveContainer
                width="100%"
                height={120}
                minWidth={0}
                minHeight={0}
              >
                <PieChart>
                  <Pie
                    data={currentSectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    dataKey="value"
                    stroke="none"
                  >
                    {currentSectorData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <span className="text-[9px] font-bold text-slate-400 dark:text-gray-500 mt-1 uppercase">
                WAS
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />

            {/* AFTER */}
            <div className="w-[140px] h-[160px] relative flex flex-col items-center">
              <ResponsiveContainer
                width="100%"
                height={120}
                minWidth={0}
                minHeight={0}
              >
                <PieChart>
                  <Pie
                    data={newSectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    dataKey="value"
                    stroke="none"
                  >
                    {newSectorData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 mt-1 uppercase">
                NOW
              </span>
            </div>
          </div>

          {/* Common Legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 px-2">
            {currentSectorData.slice(0, 5).map((entry, index) => (
              <div
                key={`legend-${index}`}
                className="flex items-center gap-1.5"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span
                  className="text-[9px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[80px]"
                  title={entry.name}
                >
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. COLLAPSIBLE DEEP DIVE */}
      <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
        <button
          onClick={() => setShowDeepDive(!showDeepDive)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-500 dark:text-slate-400 rounded-xl transition-all text-xs font-bold uppercase tracking-wide border border-slate-200 dark:border-slate-700 border-dashed"
        >
          {showDeepDive
            ? "Hide Advanced Metrics"
            : "See Detailed Metrics Deep Dive"}
          {showDeepDive ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showDeepDive && (
          <div className="mt-4 animate-in slide-in-from-top-4 duration-300 space-y-6">
            {/* Advanced Risk */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-2">
                Advanced Risk Metrics
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <MetricCard
                  label="Treynor Ratio"
                  subtitle="Mkt Efficiency"
                  oldVal={comparison?.treynor_ratio?.old}
                  newVal={comparison?.treynor_ratio?.new}
                />
                <MetricCard
                  label="Omega Ratio"
                  subtitle="Win Probability"
                  oldVal={comparison?.omega_ratio?.old}
                  newVal={comparison?.omega_ratio?.new}
                />
                <MetricCard
                  label="Info Ratio"
                  subtitle="Consistency"
                  oldVal={comparison?.information_ratio?.old}
                  newVal={comparison?.information_ratio?.new}
                />
                <MetricCard
                  label="Beta (Monthly)"
                  subtitle="Long-term Risk"
                  oldVal={comparison?.beta_monthly?.old}
                  newVal={comparison?.beta_monthly?.new}
                />
              </div>
            </div>

            {/* Valuation */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest px-1 mb-2">
                Valuation & Structure
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <MetricCard
                  label="P/E Ratio"
                  subtitle="Earnings Mult."
                  oldVal={comparison?.pe?.old}
                  newVal={comparison?.pe?.new}
                />
                <MetricCard
                  label="P/B Ratio"
                  subtitle="Book Value"
                  oldVal={comparison?.pb?.old}
                  newVal={comparison?.pb?.new}
                />
                <MetricCard
                  label="Div Yield"
                  subtitle="Income"
                  oldVal={comparison?.dividend_yield?.old}
                  newVal={comparison?.dividend_yield?.new}
                  suffix="%"
                />
                <MetricCard
                  label="HHI"
                  subtitle="Concentration"
                  oldVal={comparison?.hhi?.old}
                  newVal={comparison?.hhi?.new}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfAnalysis;
