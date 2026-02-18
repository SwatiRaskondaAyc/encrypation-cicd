import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

/**
 * Trade Behavior Chart Component (P&L Timeline)
 *
 * Displays a daily bar graph of unrealized P/L for each stock.
 * Special coloring for Sell Days based on Candle Analysis.
 */
const TradeBehaviorChart = ({ data }) => {
  const [selectedStock, setSelectedStock] = useState(null);

  // Extract data
  const graphData = useMemo(() => {
    if (!data) return null;
    if (data.graph_data) return data.graph_data;
    if (data.stocks) return data;
    return null; // Handle loading/error states
  }, [data]);

  const stocks = graphData?.stocks || {};
  const stockList = Object.keys(stocks);

  // Auto-select first stock
  React.useEffect(() => {
    if (stockList.length > 0 && !selectedStock) {
      setSelectedStock(stockList[0]);
    }
  }, [stockList, selectedStock]);

  const currentStockData = selectedStock ? stocks[selectedStock] : null;
  const bars = currentStockData?.bars || [];
  const summary = currentStockData?.summary || {};

  // Prepare chart data
  const chartData = useMemo(() => {
    return bars.map((bar) => ({
      ...bar,
      // Format date for display
      displayDate: new Date(bar.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
    }));
  }, [bars]);

  if (!graphData || stockList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10">
        <TrendingUp className="w-10 h-10 mb-2 opacity-50" />
        <p>No trade behavior data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;

    let statusColor = "text-slate-600";
    if (data.type === "good_sell") statusColor = "text-green-600 font-bold";
    if (data.type === "bad_sell") statusColor = "text-red-600 font-bold";

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-sm">
        <p className="border-b border-slate-100 pb-1 mb-2 font-medium text-slate-700">
          {label}
        </p>
        <p className="flex justify-between gap-4">
          <span className="text-slate-500">Unrealized P/L:</span>
          <span
            className={`font-medium ${
              data.pnl >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{data.pnl.toLocaleString()}
          </span>
        </p>
        <p className="flex justify-between gap-4 mt-1">
          <span className="text-slate-500">Classification:</span>
          <span className={statusColor}>{data.classification}</span>
        </p>
        {data.reason && (
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Analysis:</p>
            <p className="text-xs font-semibold text-slate-700">
              {data.reason}
            </p>
          </div>
        )}
        {data.missed_profit && (
          <div className="mt-2 text-xs bg-amber-50 border border-amber-100 p-2 rounded text-amber-700 font-medium flex items-start gap-1">
            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>{data.missed_profit}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Header / Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Stock:</label>
          <select
            value={selectedStock || ""}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-[150px]"
          >
            {stockList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Summary Stats for Selected Stock */}
        {currentStockData && (
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                Held:{" "}
                <span className="font-semibold text-slate-800">
                  {summary.days_held} Days
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span>
                Total P/L:{" "}
                <span
                  className={`font-semibold ${
                    summary.final_pnl >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{summary.final_pnl?.toLocaleString()}
                </span>
              </span>
            </div>
            <div
              className={`px-2 py-1 rounded text-xs font-medium border ${
                summary.is_active
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {summary.is_active ? "Active" : "Closed"}
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />
            <XAxis
              dataKey="displayDate"
              stroke="#94A3B8"
              fontSize={11}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />

            <ReferenceLine y={0} stroke="#CBD5E1" />

            <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => {
                // Default Color: Based on P/L (Green/Red) or Neutral Blue?
                // Prompt: "Use normal coloring... Height = Profit"
                // Usually P/L charts are Green (>0) / Red (<0).
                // BUT Sell Days override this.

                let color = entry.pnl >= 0 ? "#4ADE80" : "#F87171"; // Default Green/Red
                let opacity = 1;

                // Special Sell Logic
                if (entry.type === "good_sell") color = "#15803D"; // Dark Green
                if (entry.type === "bad_sell") color = "#B91C1C"; // Dark Red
                if (entry.type === "hold")
                  color = entry.pnl >= 0 ? "#86EFAC" : "#FCA5A5"; // Lighter for hold

                // Ghost Bars (Hypothetical - Gray)
                if (
                  entry.type === "post_exit_good" ||
                  entry.type === "post_exit_bad"
                ) {
                  color = "#94A3B8"; // Slate 400 (Gray)
                  opacity = 0.6;
                }

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={color}
                    fillOpacity={opacity}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-green-300 rounded-sm"></span> Holding
          (Profit)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-red-300 rounded-sm"></span> Holding (Loss)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-green-700 rounded-sm"></span>{" "}
          <CheckCircle className="w-3 h-3" /> Good Sell
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-red-700 rounded-sm"></span>{" "}
          <AlertCircle className="w-3 h-3" /> Bad Sell
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-slate-400 rounded-sm opacity-60"></span>{" "}
          Post-Exit (Hypothetical)
        </div>
      </div>

      {/* Detailed Summary */}
      {currentStockData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500">First Purchase</p>
            <p className="font-medium text-slate-700">{summary.first_buy}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500">Last Activity</p>
            <p className="font-medium text-slate-700">
              {summary.last_activity}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeBehaviorChart;
