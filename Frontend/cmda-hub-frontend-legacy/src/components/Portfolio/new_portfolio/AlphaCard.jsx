import React, { useState } from "react";
import axios from "axios";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  X,
  Info,
  Loader2,
  HelpCircle,
} from "lucide-react";
import ColumnHeaderWithInfo from "./ColumnHeaderWithInfo";

// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = `${import.meta.env.VITE_URL}/portfolio`;

const AlphaCard = ({ alphaMetrics, currentHoldings, isExporting, className = "" }) => {
  const token = localStorage.getItem("authToken");
  const [showDetails, setShowDetails] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // State for dynamic calculation
  const [alphaData, setAlphaData] = useState(alphaMetrics);
  const [selectedBenchmark, setSelectedBenchmark] = useState("Nifty 50");
  const [loading, setLoading] = useState(false);

  // Benchmarks List (Same as Beta)
  const benchmarkOptions = [
    "Nifty 50",
    "Nifty Auto",
    "Nifty Bank",
    "Nifty Media",
    "Nifty CPSE",
    "Nifty IT",
    "Nifty Commodities",
    "Nifty Energy",
    "Nifty Pharma",
    "Nifty Next 50",
    "Nifty Smallcap 50",
    "Nifty Midcap 100",
  ];

  const portfolioAlpha = alphaData?.portfolio_alpha;
  const individualAlphas = alphaData?.individual_alphas || {};
  const riskFreeRate = alphaData?.risk_free_rate || 0.0662;
  const currentBenchmark = alphaData?.benchmark || "Nifty 50";

  const handleBenchmarkChange = async (newBenchmark) => {
    setSelectedBenchmark(newBenchmark);
    setLoading(true);

    if (!currentHoldings || currentHoldings.length === 0) {
      alert("No holdings data available.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/metrics/alpha`,
        {
          current_holdings: currentHoldings,
          benchmark: newBenchmark,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.status === "success") {
        setAlphaData(response.data.alpha_metrics);
      }
    } catch (error) {
      console.error("Failed to recalculate alpha:", error);
      alert("Failed to update benchmark. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "-";
    return val.toFixed(4);
  };

  const formatPercent = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "-";
    return (val * 100).toFixed(2) + "%";
  };

  const getAlphaColor = (alpha) => {
    if (alpha === null || alpha === undefined) return "text-gray-500 dark:text-gray-400";
    if (alpha > 0) return "text-emerald-600 dark:text-emerald-400";
    if (alpha < 0) return "text-rose-600 dark:text-rose-400";
    return "text-gray-600 dark:text-gray-300";
  };

  const getAlphaBgColor = (alpha) => {
    if (alpha === null || alpha === undefined) return "bg-gray-50 dark:bg-slate-800";
    if (alpha > 0) return "bg-emerald-50 dark:bg-emerald-900/30";
    if (alpha < 0) return "bg-rose-50 dark:bg-rose-900/30";
    return "bg-gray-50 dark:bg-slate-800";
  };

  const getAlphaBorderColor = (alpha) => {
    if (alpha === null || alpha === undefined) return "border-gray-200 dark:border-slate-600";
    if (alpha > 0) return "border-emerald-200 dark:border-emerald-700";
    if (alpha < 0) return "border-rose-200 dark:border-rose-700";
    return "border-gray-200 dark:border-slate-600";
  };

  return (
    <>
      <div
        className={`p-8 rounded-xl shadow-sm border transition-all duration-200 h-full relative ${getAlphaBgColor(
          portfolioAlpha
        )} ${getAlphaBorderColor(portfolioAlpha)} hover:shadow-lg ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Jensen's Alpha
          </p>
          <div
            className={`text-3xl font-bold ${getAlphaColor(portfolioAlpha)}`}
          >
            α
          </div>
        </div>

        <h2
          className={`text-4xl font-bold mb-2 ${getAlphaColor(portfolioAlpha)}`}
        >
          {formatValue(portfolioAlpha)}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Excess Return vs {currentBenchmark}
        </p>

        <button
          onClick={() => setShowDetails(true)}
          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <Eye size={16} />
          View Details
        </button>
      </div>


      {showDetails && (
        <div className={isExporting ? "pdf-section-container mt-12 bg-white" : "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"} data-pdf-section="alpha-card-details">
          <div className={isExporting ? "bg-white rounded-none border-0 w-full relative" : "bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[88vh] overflow-hidden relative flex flex-col"}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Alpha Analysis
                    <button
                      onClick={() => setShowHelp(!showHelp)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-full p-1 transition-colors"
                      title="Learn about Alpha"
                    >
                      <Info size={14} />
                    </button>
                  </h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Benchmark: {currentBenchmark} • Rf:{" "}
                    {formatPercent(riskFreeRate)}
                  </p>
                </div>
              </div>
              {!isExporting && (
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Glossary Overlay */}
            {showHelp && (
              <div className={`${isExporting ? 'relative' : 'absolute top-[72px] left-0 right-0 bottom-0 z-40'} bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-slate-600 p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200`}>
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-600 rounded-xl p-8">
                  <div className="flex justify-between items-start mb-6 border-b dark:border-slate-600 pb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Understanding Jensen's Alpha
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Measuring "True" Performance
                      </p>
                    </div>
                    <button
                      onClick={() => setShowHelp(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className={`grid gap-8 ${isExporting ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                    <div>
                      <h5 className="font-bold text-emerald-700 dark:text-emerald-400 mb-3 uppercase text-sm tracking-wide">
                        Concept
                      </h5>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Jensen's Alpha represents the{" "}
                        <strong>excess return</strong> generated by an
                        investment over its theoretical expected return. In
                        simple terms, it answers the question:{" "}
                        <em>
                          "Did this stock beat the market after adjusting for
                          the risk it took?"
                        </em>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        A positive alpha indicates the manager (or stock) has
                        "added value" beyond simple market exposure. A negative
                        alpha implies underperformance relative to the risk
                        taken.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-emerald-700 dark:text-emerald-400 mb-3 uppercase text-sm tracking-wide">
                        The Formula
                      </h5>
                      <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg p-6 text-center mb-4">
                        <div className="font-serif italic text-xl mb-3 text-slate-800 dark:text-slate-200">
                          α = R<sub>i</sub> - [ R<sub>f</sub> + β × (R
                          <sub>m</sub> - R<sub>f</sub>) ]
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Alpha = Actual Return - Expected CAPM Return
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t dark:border-slate-600 pt-6">
                    <h5 className="font-bold text-emerald-700 dark:text-emerald-400 mb-4 uppercase text-sm tracking-wide">
                      Key Variables Explained
                    </h5>
                    <div className={`grid gap-4 ${isExporting ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                      <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                        <span className="block font-bold text-gray-900 dark:text-gray-100 mb-1">
                          R<sub>i</sub> (Actual Return)
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          The realized return of the stock or portfolio over the
                          period.
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                        <span className="block font-bold text-gray-900 dark:text-gray-100 mb-1">
                          R<sub>f</sub> (Risk-Free Rate)
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Return of a safe asset (e.g., Govt Bond). We use
                          6.62%.
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                        <span className="block font-bold text-gray-900 dark:text-gray-100 mb-1">
                          β (Beta)
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Measure of volatility/risk relative to the market.
                          High beta = High expected return.
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                        <span className="block font-bold text-gray-900 dark:text-gray-100 mb-1">
                          R<sub>m</sub> (Market Return)
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Return of the benchmark (e.g., Nifty 50) over the same
                          period.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Benchmark Selector */}
            <div className="px-8 py-5 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600 shrink-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Benchmark
              </label>
              <select
                value={selectedBenchmark}
                onChange={(e) => handleBenchmarkChange(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-slate-600 bg-white dark:bg-slate-800 dark:text-gray-100"
              >
                {benchmarkOptions.map((benchmark) => (
                  <option key={benchmark} value={benchmark}>
                    {benchmark}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {loading ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Loader2 size={12} className="animate-spin" />
                    Recalculating Alpha & Beta...
                  </span>
                ) : (
                  "Change benchmark to see how Alpha changes relative to different indices."
                )}
              </p>
            </div>

            {/* Content */}
            <div className={`px-6 py-4 grow ${isExporting ? '' : 'overflow-y-auto'}`}>
              {/* Portfolio Alpha Summary */}
              <div className={`mb-6 p-5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-700 flex items-center justify-between ${isExporting ? 'flex-col gap-4 text-center' : ''}`}>
                <div>
                  <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300">
                    Portfolio Alpha
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 opacity-80 mt-1">
                    Weighted average based on current composition
                  </p>
                </div>
                <div
                  className={`text-4xl font-bold ${getAlphaColor(
                    portfolioAlpha
                  )}`}
                >
                  {formatValue(portfolioAlpha)}
                </div>
              </div>

              {/* Individual Stock Alphas */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-1">
                  Individual Stock Analysis (1 Year Lookback)
                </h4>
                <div className="overflow-x-auto border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-32">
                          Symbol
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          <ColumnHeaderWithInfo
                            label="Alpha (α)"
                            description="The excess return. (Actual - Expected). Positive is good."
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          <ColumnHeaderWithInfo
                            label="Actual Return"
                            description="The simple percentage return of the stock over the last 1 year."
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          <ColumnHeaderWithInfo
                            label="Exp. Return"
                            description="Expected return calculated using CAPM: Rf + Beta * (Rm - Rf). This is the 'hurdle' rate."
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          <ColumnHeaderWithInfo
                            label="Beta (β)"
                            description="The risk multiplier. If Beta is 1.5, expected excess return is 1.5x the market excess return."
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                      {Object.entries(individualAlphas).length > 0 ? (
                        Object.entries(individualAlphas).map(
                          ([symbol, data]) => (
                            <tr
                              key={symbol}
                              className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm font-bold text-gray-800 dark:text-gray-100">
                                {symbol}
                              </td>
                              <td
                                className={`px-4 py-3 text-sm font-bold ${getAlphaColor(
                                  data?.alpha
                                )}`}
                              >
                                {formatValue(data?.alpha)}
                              </td>
                              <td
                                className={`px-4 py-3 text-sm font-medium ${data?.actual_return > 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-500 dark:text-red-400"
                                  }`}
                              >
                                {formatPercent(data?.actual_return)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-mono">
                                {formatPercent(data?.expected_return)}
                              </td>
                              <td
                                className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300"
                                title="Beta used for calculation"
                              >
                                {data?.beta_used
                                  ? data.beta_used.toFixed(2)
                                  : "-"}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 italic"
                          >
                            No calculation data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600 shrink-0">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-md font-medium text-sm hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-sm"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlphaCard;
