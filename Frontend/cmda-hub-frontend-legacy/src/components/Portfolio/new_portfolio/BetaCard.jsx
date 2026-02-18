import React, { useState } from "react";
import axios from "axios";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = `${import.meta.env.VITE_URL}/portfolio`;

// Rolling Beta Chart Component with Color-Coded Zones

const BetaCard = ({ betaMetrics, currentHoldings, onBenchmarkChange, isExporting, className = "" }) => {
  const token = localStorage.getItem("authToken");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBenchmark, setSelectedBenchmark] = useState("Nifty 50");
  const [betaData, setBetaData] = useState(betaMetrics);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [showHelp, setShowHelp] = useState(false);

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

  // Use selected period data
  const periodData =
    selectedPeriod === "daily"
      ? betaData?.daily_betas
      : betaData?.monthly_betas;

  const portfolioBeta = periodData?.portfolio_beta;
  const individualBetas = periodData?.individual || {};
  const currentBenchmark = betaData?.benchmark || "Nifty 50";

  // Debug logging
  console.log("BetaCard - betaMetrics prop:", betaMetrics);
  console.log("BetaCard - currentHoldings prop:", currentHoldings);
  console.log("BetaCard - betaData state:", betaData);
  console.log("BetaCard - selectedPeriod:", selectedPeriod);
  console.log("BetaCard - periodData:", periodData);
  console.log("BetaCard - portfolioBeta:", portfolioBeta);

  const formatBeta = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "-";
    return val.toFixed(2);
  };

  const getBetaColor = (beta) => {
    if (beta === null || beta === undefined) return "text-gray-500 dark:text-gray-400";
    if (beta > 1.2) return "text-rose-600 dark:text-rose-400";
    if (beta > 0.8) return "text-amber-600 dark:text-amber-400";
    return "text-emerald-600 dark:text-emerald-400";
  };

  const getBetaBgColor = (beta) => {
    if (beta === null || beta === undefined) return "bg-gray-50 dark:bg-slate-800";
    if (beta > 1.2) return "bg-rose-50 dark:bg-rose-900/30";
    if (beta > 0.8) return "bg-amber-50 dark:bg-amber-900/30";
    return "bg-emerald-50 dark:bg-emerald-900/30";
  };

  const getBetaBorderColor = (beta) => {
    if (beta === null || beta === undefined) return "border-gray-200 dark:border-slate-600";
    if (beta > 1.2) return "border-rose-200 dark:border-rose-700";
    if (beta > 0.8) return "border-amber-200 dark:border-amber-700";
    return "border-emerald-200 dark:border-emerald-700";
  };

  const getBetaIcon = (beta) => {
    if (beta === null || beta === undefined) return Activity;
    if (beta > 1) return TrendingUp;
    return TrendingDown;
  };

  const Icon = getBetaIcon(portfolioBeta);

  const handleBenchmarkChange = async (newBenchmark) => {
    setSelectedBenchmark(newBenchmark);
    setLoading(true);

    // Debug logging
    console.log("Benchmark changed to:", newBenchmark);
    console.log("Current holdings available:", currentHoldings);
    console.log("Current holdings length:", currentHoldings?.length);

    // Validate we have holdings
    if (!currentHoldings || currentHoldings.length === 0) {
      console.error("No current holdings available for recalculation!");
      setLoading(false);
      alert(
        "Cannot recalculate: No holdings data available. Please reload the portfolio."
      );
      return;
    }

    try {
      console.log("Sending API request to:", `${API_BASE_URL}/metrics/beta`);
      console.log("Payload:", {
        current_holdings: currentHoldings,
        benchmark: newBenchmark,
      });

      const response = await axios.post(`${API_BASE_URL}/metrics/beta`, {
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
      console.log("API Response:", response.data);

      if (response.data && response.data.status === "success") {
        console.log("Successfully recalculated beta, updating state...");
        setBetaData(response.data.beta_metrics);
        if (onBenchmarkChange) {
          onBenchmarkChange(newBenchmark, response.data.beta_metrics);
        }
      } else {
        console.error("API returned non-success status:", response.data);
      }
    } catch (error) {
      console.error("Failed to recalculate beta:", error);
      console.error("Error details:", error.response?.data);
      alert(`Failed to recalculate beta: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Tooltip state
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e, data) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipData(data);

    // Position tooltip to the right of the cell if space allows, otherwise left
    const spaceRight = window.innerWidth - rect.right;
    const x = spaceRight > 350 ? rect.right + 10 : rect.left - 330;

    // Smart vertical positioning: Flip up if too close to bottom
    const spaceBottom = window.innerHeight - rect.bottom;
    const tooltipHeight = 300; // Approx height
    let y = rect.top - 50; // Default: align somewhat with top

    if (spaceBottom < tooltipHeight) {
      // Not enough space below, flip up
      y = rect.bottom - tooltipHeight + 20;
    }

    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  return (
    <>
      <div
        className={`p-8 rounded-xl shadow-sm border transition-all duration-200 h-full relative ${getBetaBgColor(
          portfolioBeta
        )} ${getBetaBorderColor(portfolioBeta)} hover:shadow-lg ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Beta ({selectedPeriod})
          </p>
          {/* Beta Symbol instead of icon */}
          <div className={`text-3xl font-bold ${getBetaColor(portfolioBeta)}`}>
            β
          </div>
        </div>

        <h2
          className={`text-4xl font-bold mb-2 ${getBetaColor(portfolioBeta)}`}
        >
          {formatBeta(portfolioBeta)}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">vs {currentBenchmark}</p>

        <button
          onClick={() => setShowDetails(true)}
          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <Eye size={16} />
          View Details
        </button>
      </div>


      {showDetails && (
        <div className={isExporting ? "pdf-section-container mt-12 bg-white" : "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"} data-pdf-section="beta-card-details">
          <div className={isExporting ? "bg-white rounded-none border-0 w-full relative" : "bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[88vh] overflow-hidden relative flex flex-col"}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Beta Analysis
                    <button
                      onClick={() => setShowHelp(!showHelp)}
                      className="bg-blue-500 hover:bg-blue-400 text-white rounded-full p-1 transition-colors"
                      title="Comparison of volatility"
                    >
                      <Info size={14} />
                    </button>
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    {currentBenchmark} {loading && "• Calculating..."}
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
            {/* Glossary Overlay - Always visible for PDF if isExporting is true */}
            {showHelp && (
              <div className={`${isExporting ? 'relative' : 'absolute top-[72px] left-0 right-0 z-40'} bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600 shadow-lg p-6 animate-in slide-in-from-top-2`}>
                <div className="max-w-4xl mx-auto">
                  <div className="flex justify-between items-start mb-4 border-b dark:border-slate-600 pb-2">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      Understanding Beta & Risk Metrics
                    </h4>
                    {!isExporting && (
                      <button
                        onClick={() => setShowHelp(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {/* What is Beta */}
                    <div>
                      <h5 className="font-bold text-blue-700 dark:text-blue-400 mb-2">
                        What is Beta?
                      </h5>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                        Beta measures the volatility of a security or portfolio
                        in comparison to the market as a whole. It is used to
                        assess{" "}
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          systematic risk
                        </span>
                        .
                      </p>
                      <ul className="space-y-1.5 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md border border-blue-100 dark:border-blue-700">
                        <li className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 dark:text-gray-200 w-12">
                            &gt; 1.0
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            High Volatility. Theoretically more volatile than
                            the market.
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 dark:text-gray-200 w-12">
                            = 1.0
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            Market Correlation. Moves in sync with the
                            benchmark.
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 dark:text-gray-200 w-12">
                            &lt; 1.0
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            Low Volatility. Theoretically less volatile than the
                            market.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Key Terms */}
                    <div>
                      <h5 className="font-bold text-blue-700 dark:text-blue-400 mb-2">
                        Key Metrics
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                            Covariance
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            Measures the directional relationship between two
                            assets. A positive covariance means assets generally
                            move together.
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                            Volatility
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            A statistical measure of the dispersion of returns.
                            Higher volatility implies a wider range of price
                            fluctuations and higher risk.
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                            Correlation
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            Indicates the strength and direction of a linear
                            relationship between two variables, ranging from -1
                            (perfect inverse) to +1 (perfect direct).
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Color Scheme Explanation */}
                    <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-600">
                      <h5 className="font-bold text-blue-700 dark:text-blue-400 mb-2">
                        Color Coding Guide
                      </h5>
                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div className="p-2 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 rounded">
                          <span className="block font-bold text-rose-700 dark:text-rose-400">
                            Red (&gt; 1.2)
                          </span>
                          <span className="dark:text-gray-300">High Risk / High Sensitivity</span>
                        </div>
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded">
                          <span className="block font-bold text-amber-700 dark:text-amber-400">
                            Amber (0.8 - 1.2)
                          </span>
                          <span className="dark:text-gray-300">Moderate Risk / Market Standard</span>
                        </div>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded">
                          <span className="block font-bold text-emerald-700 dark:text-emerald-400">
                            Green (&lt; 0.8)
                          </span>
                          <span className="dark:text-gray-300">Low Risk / Defensive</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Period Selector */}
            <div className="px-8 py-4 bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPeriod("daily")}
                  className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${selectedPeriod === "daily"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-500"
                    }`}
                >
                  Daily Beta
                </button>
                <button
                  onClick={() => setSelectedPeriod("monthly")}
                  className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${selectedPeriod === "monthly"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-500"
                    }`}
                >
                  Monthly Beta
                </button>
              </div>
            </div>
            {/* Benchmark Selector */}
            <div className="px-8 py-5 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Benchmark
              </label>
              <select
                value={selectedBenchmark}
                onChange={(e) => handleBenchmarkChange(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-slate-600 bg-white dark:bg-slate-800 dark:text-gray-100"
              >
                {benchmarkOptions.map((benchmark) => (
                  <option key={benchmark} value={benchmark}>
                    {benchmark}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {loading ? (
                  <span className="flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin" />
                    Recalculating beta values...
                  </span>
                ) : (
                  "Change benchmark to recalculate beta values"
                )}
              </p>
            </div>
            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(88vh-16rem)]">
              {/* Portfolio Beta Summary */}
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Portfolio Beta ({selectedPeriod})
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Weighted average
                    </p>
                  </div>
                  <div
                    className={`text-3xl font-bold ${getBetaColor(
                      portfolioBeta
                    )}`}
                  >
                    {formatBeta(portfolioBeta)}
                  </div>
                </div>
              </div>

              {/* Individual Stock Betas */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Individual Stock Betas ({selectedPeriod})
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Beta (β)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group relative">
                          <div className="flex items-center gap-1">
                            Correlation
                            <Info
                              size={12}
                              className="text-gray-400 cursor-help"
                            />
                          </div>
                          <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 text-xs font-normal normal-case bg-gray-900 dark:bg-slate-900 border dark:border-slate-700 text-white rounded shadow-lg">
                            How closely stock and market move together. Range:
                            -1 to +1. Higher = more reliable beta.
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group relative">
                          <div className="flex items-center gap-1">
                            Stock Vol.
                            <Info
                              size={12}
                              className="text-gray-400 cursor-help"
                            />
                          </div>
                          <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 text-xs font-normal normal-case bg-gray-900 dark:bg-slate-900 border dark:border-slate-700 text-white rounded shadow-lg right-0">
                            Standard deviation of stock returns. Higher % =
                            Higher Risk.
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group relative">
                          <div className="flex items-center gap-1">
                            Mkt Vol.
                            <Info
                              size={12}
                              className="text-gray-400 cursor-help"
                            />
                          </div>
                          <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 text-xs font-normal normal-case bg-gray-900 dark:bg-slate-900 border dark:border-slate-700 text-white rounded shadow-lg right-0">
                            Standard deviation of benchmark returns. Reference
                            baseline.
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                      {Object.entries(individualBetas).length > 0 ? (
                        Object.entries(individualBetas).map(
                          ([symbol, data]) => (
                            <tr key={symbol} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {symbol}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold">
                                <div className="flex items-center gap-2">
                                  <span className={getBetaColor(data?.beta)}>
                                    {formatBeta(data?.beta)}
                                  </span>
                                  {/* Info Icon Trigger */}
                                  <div
                                    className="cursor-help text-gray-400 hover:text-blue-600 transition-colors"
                                    onMouseEnter={(e) =>
                                      handleMouseEnter(e, data)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                  >
                                    <Info size={14} />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                                {data?.correlation
                                  ? data.correlation.toFixed(2)
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 font-mono">
                                {data?.stock_volatility
                                  ? (data.stock_volatility * 100).toFixed(2) +
                                  "%"
                                  : "-"}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 font-mono">
                                {data?.market_volatility
                                  ? (data.market_volatility * 100).toFixed(2) +
                                  "%"
                                  : "-"}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                          >
                            No beta data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
            {/* Custom Floating Tooltip */}
            {tooltipData && (
              <div
                className="fixed z-[9999] w-80 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-2xl pointer-events-none transition-opacity duration-200 ease-in-out"
                style={{
                  top: tooltipPos.y,
                  left: tooltipPos.x,
                }}
              >
                <h5 className="font-bold text-gray-900 dark:text-white mb-2 border-b dark:border-slate-700 pb-1 font-serif text-lg">
                  Beta Calculation
                </h5>

                {/* LaTeX-style Formula */}
                <div className="mb-4 text-center p-2 bg-gray-50 dark:bg-slate-900/50 rounded border border-gray-100 dark:border-slate-700">
                  <div className="font-serif italic text-lg leading-relaxed dark:text-blue-300">
                    β ={" "}
                    <span className="inline-block text-center align-middle">
                      <div className="border-b border-black dark:border-blue-300 mb-0.5">
                        Cov(r<sub>s</sub>, r<sub>m</sub>)
                      </div>
                      <div>
                        Var(r<sub>m</sub>)
                      </div>
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-sans">
                    Covariance / Market Variance
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  {/* Covariance */}
                  <div>
                    <div className="flex justify-between font-semibold">
                      <span>Covariance:</span>
                      <span className="font-mono">
                        {tooltipData?.covariance?.toFixed(8) || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Market Variance */}
                  <div>
                    <div className="flex justify-between font-semibold">
                      <span>Market Variance:</span>
                      <span className="font-mono">
                        {tooltipData?.market_variance?.toFixed(8) || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Correlation */}
                  <div>
                    <div className="flex justify-between font-semibold">
                      <span>Correlation:</span>
                      <span className="font-mono">
                        {tooltipData?.correlation?.toFixed(2) || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Volatility */}
                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="font-semibold block">
                        Stock Volatility
                      </span>
                    </div>
                    <span className="font-mono font-medium">
                      {tooltipData?.stock_volatility !== undefined
                        ? (tooltipData.stock_volatility * 100).toFixed(2) + "%"
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BetaCard;
