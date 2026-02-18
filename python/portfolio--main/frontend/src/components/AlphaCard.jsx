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

const API_BASE = "http://localhost:8000";

const AlphaCard = ({ alphaMetrics, currentHoldings }) => {
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
      const response = await axios.post(`${API_BASE}/api/calculate-alpha`, {
        current_holdings: currentHoldings,
        benchmark: newBenchmark,
      });

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
    if (alpha === null || alpha === undefined) return "text-gray-500";
    if (alpha > 0) return "text-emerald-600";
    if (alpha < 0) return "text-rose-600";
    return "text-gray-600";
  };

  const getAlphaBgColor = (alpha) => {
    if (alpha === null || alpha === undefined) return "bg-gray-50";
    if (alpha > 0) return "bg-emerald-50";
    if (alpha < 0) return "bg-rose-50";
    return "bg-gray-50";
  };

  const getAlphaBorderColor = (alpha) => {
    if (alpha === null || alpha === undefined) return "border-gray-200";
    if (alpha > 0) return "border-emerald-200";
    if (alpha < 0) return "border-rose-200";
    return "border-gray-200";
  };

  return (
    <>
      <div
        className={`p-8 rounded-xl shadow-sm border transition-all duration-200 h-full relative ${getAlphaBgColor(
          portfolioAlpha
        )} ${getAlphaBorderColor(portfolioAlpha)} hover:shadow-lg`}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">
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

        <p className="text-sm text-gray-500 mb-4">
          Excess Return vs {currentBenchmark}
        </p>

        <button
          onClick={() => setShowDetails(true)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Eye size={16} />
          View Details
        </button>
      </div>

      {/* Modal for Alpha Details */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[88vh] overflow-hidden relative flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between shrink-0">
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
              <button
                onClick={() => setShowDetails(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Glossary Overlay */}
            {showHelp && (
              <div className="absolute top-[72px] left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-200 rounded-xl p-8">
                  <div className="flex justify-between items-start mb-6 border-b pb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">
                        Understanding Jensen's Alpha
                      </h4>
                      <p className="text-gray-500 mt-1">
                        Measuring "True" Performance
                      </p>
                    </div>
                    <button
                      onClick={() => setShowHelp(false)}
                      className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="font-bold text-emerald-700 mb-3 uppercase text-sm tracking-wide">
                        Concept
                      </h5>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Jensen's Alpha represents the{" "}
                        <strong>excess return</strong> generated by an
                        investment over its theoretical expected return. In
                        simple terms, it answers the question:{" "}
                        <em>
                          "Did this stock beat the market after adjusting for
                          the risk it took?"
                        </em>
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        A positive alpha indicates the manager (or stock) has
                        "added value" beyond simple market exposure. A negative
                        alpha implies underperformance relative to the risk
                        taken.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-emerald-700 mb-3 uppercase text-sm tracking-wide">
                        The Formula
                      </h5>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center mb-4">
                        <div className="font-serif italic text-xl mb-3 text-slate-800">
                          α = R<sub>i</sub> - [ R<sub>f</sub> + β × (R
                          <sub>m</sub> - R<sub>f</sub>) ]
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Alpha = Actual Return - Expected CAPM Return
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t pt-6">
                    <h5 className="font-bold text-emerald-700 mb-4 uppercase text-sm tracking-wide">
                      Key Variables Explained
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="block font-bold text-gray-900 mb-1">
                          R<sub>i</sub> (Actual Return)
                        </span>
                        <span className="text-sm text-gray-600">
                          The realized return of the stock or portfolio over the
                          period.
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="block font-bold text-gray-900 mb-1">
                          R<sub>f</sub> (Risk-Free Rate)
                        </span>
                        <span className="text-sm text-gray-600">
                          Return of a safe asset (e.g., Govt Bond). We use
                          6.62%.
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="block font-bold text-gray-900 mb-1">
                          β (Beta)
                        </span>
                        <span className="text-sm text-gray-600">
                          Measure of volatility/risk relative to the market.
                          High beta = High expected return.
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="block font-bold text-gray-900 mb-1">
                          R<sub>m</sub> (Market Return)
                        </span>
                        <span className="text-sm text-gray-600">
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
            <div className="px-8 py-5 bg-gray-50 border-b border-gray-200 shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Benchmark
              </label>
              <select
                value={selectedBenchmark}
                onChange={(e) => handleBenchmarkChange(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
              >
                {benchmarkOptions.map((benchmark) => (
                  <option key={benchmark} value={benchmark}>
                    {benchmark}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                {loading ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Loader2 size={12} className="animate-spin" />
                    Recalculating Alpha & Beta...
                  </span>
                ) : (
                  "Change benchmark to see how Alpha changes relative to different indices."
                )}
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto grow">
              {/* Portfolio Alpha Summary */}
              <div className="mb-6 p-5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-emerald-900">
                    Portfolio Alpha
                  </h4>
                  <p className="text-sm text-emerald-700 opacity-80 mt-1">
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
                <h4 className="text-sm font-semibold text-gray-700 mb-3 px-1">
                  Individual Stock Analysis (1 Year Lookback)
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                          Symbol
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <ColumnHeaderWithInfo
                            label="Alpha (α)"
                            description="The excess return. (Actual - Expected). Positive is good."
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <ColumnHeaderWithInfo
                            label="Actual Return"
                            description="The simple percentage return of the stock over the last 1 year."
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <ColumnHeaderWithInfo
                            label="Exp. Return"
                            description="Expected return calculated using CAPM: Rf + Beta * (Rm - Rf). This is the 'hurdle' rate."
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <ColumnHeaderWithInfo
                            label="Beta (β)"
                            description="The risk multiplier. If Beta is 1.5, expected excess return is 1.5x the market excess return."
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(individualAlphas).length > 0 ? (
                        Object.entries(individualAlphas).map(
                          ([symbol, data]) => (
                            <tr
                              key={symbol}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm font-bold text-gray-800">
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
                                className={`px-4 py-3 text-sm font-medium ${
                                  data?.actual_return > 0
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                              >
                                {formatPercent(data?.actual_return)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                                {formatPercent(data?.expected_return)}
                              </td>
                              <td
                                className="px-4 py-3 text-sm text-gray-600"
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
                            className="px-4 py-8 text-center text-gray-500 italic"
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

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 shrink-0">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md font-medium text-sm hover:bg-emerald-700 transition-colors shadow-sm"
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
