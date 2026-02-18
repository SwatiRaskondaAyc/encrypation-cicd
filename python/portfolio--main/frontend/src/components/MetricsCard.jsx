import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Activity,
  Eye,
  X,
  Info,
  Loader2,
  HelpCircle,
  BarChart2,
  PieChart,
  BookOpen,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import ColumnHeaderWithInfo from "./ColumnHeaderWithInfo";

const API_BASE = "http://localhost:8000";

const GLOSSARY_CONTENT = [
  {
    title: "Sharpe Ratio",
    concept:
      "The Sharpe Ratio is the gold standard for measuring risk-adjusted returns. It answers a fundamental question: 'Am I being adequately compensated for the risk I'm taking?' Think of it as 'return per unit of risk.' A higher Sharpe means you're earning more return for each unit of volatility you endure.",
    example:
      "Example: Imagine two investments. Stock A returns 20% with 15% volatility (Sharpe = 0.89). Stock B returns 15% with 8% volatility (Sharpe = 1.05). Even though A has higher returns, B is MORE EFFICIENT because it delivers better returns per unit of risk. You're getting more 'bang for your buck' in terms of risk tolerance.",
    formula: `<div class="formula-latex">Sharpe = <span class="frac"><span class="num">R<sub>p</sub> − R<sub>f</sub></span><span class="den">σ<sub>p</sub></span></span></div>`,
    variables: [
      {
        name: "R<sub>p</sub>",
        desc: "Portfolio Return (Annualized)",
        detail: "What you actually earned on your investment over the year",
      },
      {
        name: "R<sub>f</sub>",
        desc: "Risk-Free Rate (~6.6%)",
        detail:
          "Return on 10-Year Government Bonds - the baseline you'd get with zero risk",
      },
      {
        name: "σ<sub>p</sub>",
        desc: "Portfolio Volatility (Std Dev)",
        detail:
          "How much your returns bounce around - the 'bumpiness' of the ride",
      },
    ],
    interpretation:
      "Sharpe > 1.0 is good (earning more than 1% excess return per 1% risk). Sharpe > 2.0 is excellent (very efficient). Sharpe < 0 means you're not even beating the risk-free rate.",
    thresholds:
      "<strong>Good:</strong> > 1.0  |  <strong>Excellent:</strong> > 2.0  |  <strong>Warning:</strong> < 0",
  },
  {
    title: "Sortino Ratio",
    concept:
      "The Sortino Ratio is Sharpe's smarter cousin. It only penalizes DOWNSIDE volatility. Why? Because upward price swings are good! If your stock jumps 10% up one day, Sharpe treats that as 'risk.' Sortino doesn't - it only counts drops as risky. This makes it perfect for evaluating growth stocks with high upside potential.",
    example:
      "Example: A tech stock has 30% annualized volatility with 15% returns. Sharpe might give it 0.5 (looks mediocre). But if 20% of that volatility is UPWARD swings, Sortino only penalizes the 10% downside vol, giving it 1.5 (looks great). This reveals the stock's true risk-adjusted quality.",
    formula: `<div class="formula-latex">Sortino = <span class="frac"><span class="num">R<sub>p</sub> − R<sub>f</sub></span><span class="den">σ<sub>d</sub></span></span></div>`,
    variables: [
      {
        name: "σ<sub>d</sub>",
        desc: "Downside Deviation",
        detail:
          "Standard deviation of ONLY the negative returns - ignores upside volatility",
      },
    ],
    interpretation:
      "Use Sortino for high-growth volatile stocks. Sortino > 1.0 indicates good downside-adjusted returns. Compare it with Sharpe: if Sortino >> Sharpe, most volatility is positive (good sign!).",
    thresholds:
      "<strong>Target:</strong> > 1.0  |  <strong>Excellence:</strong> > 1.5",
  },
  {
    title: "Treynor Ratio",
    concept:
      "Treynor measures return per unit of MARKET RISK (Beta), not total risk. It assumes you've diversified away company-specific risks and only care about how sensitive your portfolio is to overall market moves. This is the metric professional fund managers obsess over.",
    example:
      "Example: You hold a well-diversified portfolio with Beta = 1.2 (20% more volatile than the market) earning 18% returns. Risk-free rate is 6.6%. Treynor = (18% - 6.6%) / 1.2 = 9.5. This means for every 1 unit of market risk you take, you earn 9.5% excess return. Compare this across funds to see who's best at managing market exposure.",
    formula: `<div class="formula-latex">Treynor = <span class="frac"><span class="num">R<sub>p</sub> − R<sub>f</sub></span><span class="den">β</span></span></div>`,
    variables: [
      {
        name: "β (Beta)",
        desc: "Market Sensitivity",
        detail:
          "β = 1 moves with market. β > 1 amplifies market moves. β < 1 dampens them.",
      },
    ],
    interpretation:
      "Higher is better. Use for diversified portfolios. If you're holding 20+ stocks across sectors, Treynor is often more relevant than Sharpe because unsystematic risk is diversified away.",
    thresholds:
      "<strong>No fixed threshold -</strong> Compare relative to benchmark",
  },
  {
    title: "Information Ratio (IR)",
    concept:
      "The Active Manager's Report Card. IR measures how consistently you beat the benchmark relative to tracking error. It's not enough to beat Nifty 50 once - IR asks: 'Do you beat it RELIABLY?' High IR means you're adding alpha consistently, not getting lucky occasionally.",
    example:
      "Example: Fund A beats Nifty by 5% but with erratic 8% tracking error (IR = 0.625). Fund B beats Nifty by only 3% but with tight 2% tracking error (IR = 1.5). Fund B is the better active manager - its outperformance is more CONSISTENT and PREDICTABLE.",
    formula: `<div class="formula-latex">IR = <span class="frac"><span class="num">R<sub>p</sub> − R<sub>m</sub></span><span class="den">Tracking Error</span></span></div>`,
    variables: [
      {
        name: "R<sub>m</sub>",
        desc: "Benchmark Return (Nifty 50)",
        detail: "What you'd earn by passively holding the index",
      },
      {
        name: "Tracking Error",
        desc: "Volatility of (Portfolio - Benchmark)",
        detail: "How wildly your returns diverge from the index path",
      },
    ],
    interpretation:
      "IR > 0.5 is good. IR > 1.0 is exceptional (you're a skilled active manager). IR < 0 means you're underperforming AND being inconsistent - time to go passive!",
    thresholds:
      "<strong>Good:</strong> > 0.5  |  <strong>Exceptional:</strong> > 1.0",
  },
  {
    title: "Omega Ratio",
    concept:
      "Omega is a probability-weighted ratio that compares the MAGNITUDE of gains to losses. Unlike Sharpe (which uses standard deviation), Omega directly accounts for tail risks and skewness. It's perfect for capturing 'Black Swan' events and understanding the SHAPE of your return distribution.",
    example:
      "Example: Two portfolios both average 12% returns. Portfolio A has an Omega of 1.2 (₹1.20 of gains for every ₹1.00 of losses). Portfolio B has Omega of 1.8 (₹1.80 of gains per ₹1.00 of losses). Even with same average, B has a MUCH BETTER distribution - its upside potential dwarfs its downside.",
    formula: `<div class="formula-latex">Omega = <span class="frac"><span class="num">Σ(Gains above threshold)</span><span class="den">Σ(Losses below threshold)</span></span></div>`,
    variables: [
      {
        name: "Gains",
        desc: "Upside Mass",
        detail: "Sum of all returns above the risk-free rate",
      },
      {
        name: "Losses",
        desc: "Downside Mass",
        detail: "Sum of all returns below the risk-free rate",
      },
    ],
    interpretation:
      "Omega > 1.0 means your gains outweigh losses. Omega = 1.5 means for every ₹1 of potential loss, you have ₹1.50 of potential gain. If you're loss-averse, maximize Omega.",
    thresholds:
      "<strong>Minimum:</strong> > 1.0  |  <strong>Preferred:</strong> > 1.3",
  },
  {
    title: "HHI (Concentration Index)",
    concept:
      "HHI measures portfolio concentration - how dependent you are on a few stocks. It's the 'Sleep Well at Night' metric. A perfectly equal 10-stock portfolio has HHI = 0.10. If 90% of your money is in one stock, HHI = 0.81 (very risky!). Lower HHI = better diversification.",
    example:
      "Example: You hold 20 stocks but TCS makes up 40% of your portfolio, while the other 19 stocks split the remaining 60% evenly. HHI = 0.40² + 19×(0.0316)² ≈ 0.18. This signals moderate concentration risk - you're heavily dependent on TCS's performance despite holding 20 names.",
    formula: `<div class="formula-latex">HHI = Σ w<sub>i</sub><sup>2</sup></div>`,
    variables: [
      {
        name: "w<sub>i</sub>",
        desc: "Weight of Stock i",
        detail: "Decimal form (0.25 = 25%). Squaring amplifies large weights.",
      },
    ],
    interpretation:
      "HHI < 0.15 means well-diversified. HHI > 0.25 signals concentration risk. HHI = 1.0 means 100% in one stock (maximum risk).",
    thresholds:
      "<strong>Diversified:</strong> < 0.15  |  <strong>Concentrated:</strong> > 0.25  |  <strong>Very Risky:</strong> > 0.50",
  },
  {
    title: "Volatility & Downside Vol",
    concept:
      "Volatility (σ) measures total variance in returns - the 'bumpiness' of your investment journey. High volatility = wild price swings. Downside Volatility isolates ONLY negative deviations. Comparing the two reveals if your volatility is 'good' (upside) or 'bad' (downside).",
    example:
      "Example: Portfolio A has 20% total volatility with 15% downside vol (most swings are negative - bad). Portfolio B has 25% total volatility with only 8% downside vol (most swings are POSITIVE - good!). B is actually less risky than A despite higher total volatility.",
    formula: `<div class="formula-latex">σ = √(<span class="frac"><span class="num">Σ(R<sub>i</sub> − R̄)<sup>2</sup></span><span class="den">n</span></span>)</div>`,
    variables: [],
    interpretation:
      "If Total Vol / Downside Vol > 2, most volatility is upside (bullish sign). If ratio is ~1, equally volatile in both directions (neutral).",
    thresholds:
      "<strong>Low:</strong> < 15%  |  <strong>Moderate:</strong> 15-25%  |  <strong>High:</strong> > 25%",
  },
];

const MetricsCard = ({ ratioMetrics, currentHoldings }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [metricsData, setMetricsData] = useState(ratioMetrics);
  const [selectedBenchmark, setSelectedBenchmark] = useState("Nifty 50");
  const [loading, setLoading] = useState(false);

  // Tooltip State
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (ratioMetrics) {
      setMetricsData(ratioMetrics);
    }
  }, [ratioMetrics]);

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

  const pMetrics = metricsData?.portfolio_metrics || {};
  const individual = metricsData?.individual_metrics || {};
  const riskFreeRate = metricsData?.risk_free_rate || 0.0662;
  const currentBenchmark = metricsData?.benchmark || selectedBenchmark;

  const handleBenchmarkChange = async (newBenchmark) => {
    setSelectedBenchmark(newBenchmark);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/calculate-ratios`, {
        current_holdings: currentHoldings || [],
        benchmark: newBenchmark,
      });

      if (response.data && response.data.status === "success") {
        setMetricsData(response.data.ratio_metrics);
      }
    } catch (error) {
      console.error("Failed to recalculate ratios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (e, data, metricType) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipData({ data, metricType, rf: riskFreeRate });

    const spaceRight = window.innerWidth - rect.right;
    const x = spaceRight > 350 ? rect.right + 10 : rect.left - 330;

    const spaceBottom = window.innerHeight - rect.bottom;
    const tooltipHeight = 250;
    let y = rect.top - 50;

    if (spaceBottom < tooltipHeight) {
      y = rect.bottom - tooltipHeight + 20;
    }

    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const formatValue = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "-";
    return val.toFixed(2);
  };

  const formatPercent = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "-";
    return (val * 100).toFixed(2) + "%";
  };

  const getColor = (val, type = "high_good") => {
    if (val === null || val === undefined) return "text-gray-400";
    if (type === "high_good") {
      if (val > 2) return "text-emerald-700";
      if (val > 1) return "text-emerald-600";
      if (val > 0) return "text-blue-600";
      return "text-rose-600";
    }
    if (type === "low_good") {
      if (val < 0.15) return "text-emerald-700";
      if (val < 0.25) return "text-blue-600";
      return "text-amber-600";
    }
    return "text-gray-700";
  };

  const getBgColor = (val) => {
    if (val === null || val === undefined) return "bg-gray-50";
    if (val > 1) return "bg-emerald-50";
    if (val > 0) return "bg-blue-50";
    if (val < 0) return "bg-rose-50";
    return "bg-gray-50";
  };

  const getBorderColor = (val) => {
    if (val === null || val === undefined) return "border-gray-200";
    if (val > 1) return "border-emerald-200";
    if (val > 0) return "border-blue-200";
    if (val < 0) return "border-rose-200";
    return "border-gray-200";
  };

  const ColumnHeaderWithInfo = ({ label, description }) => (
    <div className="flex items-center gap-1 group cursor-help">
      {label}
      <HelpCircle
        size={12}
        className="text-gray-400 group-hover:text-blue-500 transition-colors"
        onMouseEnter={(e) =>
          handleMouseEnter(e, { label, description }, "header")
        }
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );

  return (
    <>
      <div
        className={`p-6 rounded-xl shadow-sm border transition-all duration-200 h-full relative ${getBgColor(
          pMetrics?.sharpe_ratio
        )} ${getBorderColor(pMetrics?.sharpe_ratio)} hover:shadow-lg`}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 size={16} /> Portfolio Metrics
          </p>
          {loading && (
            <Loader2 size={16} className="animate-spin text-blue-600" />
          )}
        </div>

        {/* 2x2 Grid of Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Sharpe Ratio */}
          <div className="p-4 bg-white/70 rounded-lg border border-gray-200 flex flex-col">
            <span
              className={`text-2xl font-bold mb-1 ${getColor(
                pMetrics?.sharpe_ratio
              )}`}
            >
              {formatValue(pMetrics?.sharpe_ratio)}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              Sharpe Ratio
            </span>
          </div>

          {/* Treynor Ratio */}
          <div className="p-4 bg-white/70 rounded-lg border border-gray-200 flex flex-col">
            <span
              className={`text-2xl font-bold mb-1 ${getColor(
                pMetrics?.treynor_ratio
              )}`}
            >
              {formatValue(pMetrics?.treynor_ratio)}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              Treynor Ratio
            </span>
          </div>

          {/* Omega Ratio */}
          <div className="p-4 bg-white/70 rounded-lg border border-gray-200 flex flex-col">
            <span
              className={`text-2xl font-bold mb-1 ${getColor(
                pMetrics?.omega_ratio
              )}`}
            >
              {formatValue(pMetrics?.omega_ratio)}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              Omega Ratio
            </span>
          </div>

          {/* HHI */}
          <div className="p-4 bg-white/70 rounded-lg border border-gray-200 flex flex-col">
            <span
              className={`text-2xl font-bold mb-1 ${getColor(
                pMetrics?.hhi,
                "low_good"
              )}`}
            >
              {formatValue(pMetrics?.hhi)}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              HHI (Conc.)
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(true)}
          className="w-full py-2 flex items-center justify-center gap-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md font-medium transition-colors"
        >
          <Eye size={16} />
          See All Metrics
        </button>
      </div>

      {/* Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden relative flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-emerald-400" />
                    Advanced Portfolio Analytics
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Benchmark:{" "}
                    <span className="text-white font-medium">
                      {currentBenchmark}
                    </span>{" "}
                    • Rf: {formatPercent(riskFreeRate)}
                  </p>
                </div>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="bg-slate-800 hover:bg-slate-700 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 border border-slate-700"
                >
                  <BookOpen size={14} /> Metric Definitions
                </button>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Glossary Full Screen Overlay */}
            {showHelp && (
              <div className="absolute inset-0 z-50 bg-white flex flex-col">
                {/* Overlay Header */}
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Financial Metrics Glossary
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Deep Dive into Theory & Application
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHelp(false);
                    }}
                    className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full p-2 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scrollable Glossary Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                  {/* Add CSS for formula styling */}
                  <style>{`
                    .formula-latex {
                      font-family: 'Times New Roman', serif;
                      font-size: 1.1rem;
                      font-style: italic;
                      /* color: inherit; - let parent control color */
                      text-align: center;
                      padding: 0.5rem;
                    }
                    .frac {
                      display: inline-flex;
                      flex-direction: column;
                      align-items: center;
                      vertical-align: middle;
                      margin: 0 0.2rem;
                    }
                    .frac .num {
                      border-bottom: 1px solid currentColor; /* Use current text color for fraction line */
                      padding: 0 0.3rem 0.1rem;
                    }
                    .frac .den {
                      padding: 0.1rem 0.3rem 0;
                    }
                  `}</style>

                  <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col gap-6">
                      {GLOSSARY_CONTENT.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <h5 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-bold">
                                {idx + 1}
                              </div>
                              {item.title}
                            </h5>
                            {item.thresholds && (
                              <span
                                className="text-xs font-mono text-blue-800 bg-blue-50 px-3 py-1.5 rounded border border-blue-100"
                                dangerouslySetInnerHTML={{
                                  __html: item.thresholds,
                                }}
                              />
                            )}
                          </div>

                          {/* Concept */}
                          <p className="text-slate-700 mb-4 leading-relaxed border-b border-slate-100 pb-4">
                            {item.concept}
                          </p>

                          {/* Example Section - NEW */}
                          {item.example && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-400">
                              <div className="flex items-start gap-2">
                                <Lightbulb
                                  size={18}
                                  className="text-amber-600 mt-0.5 flex-shrink-0"
                                />
                                <div>
                                  <p className="text-sm font-bold text-amber-900 mb-1">
                                    Practical Example
                                  </p>
                                  <p className="text-sm text-amber-800 leading-relaxed">
                                    {item.example}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                The Formula
                              </p>
                              <div className="bg-slate-900 text-blue-300 p-5 rounded-lg font-mono text-center mb-4 shadow-inner border border-slate-800">
                                {/* Render HTML formula */}
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.formula,
                                  }}
                                />
                              </div>
                              {item.variables && item.variables.length > 0 && (
                                <div className="space-y-3">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Variables
                                  </p>
                                  {item.variables.map((v, vIdx) => (
                                    <div
                                      key={vIdx}
                                      className="text-sm bg-slate-50 p-3 rounded border border-slate-200"
                                    >
                                      <div
                                        className="font-bold text-slate-700 font-mono mb-1"
                                        dangerouslySetInnerHTML={{
                                          __html: v.name,
                                        }}
                                      />
                                      <div className="text-slate-600 font-semibold text-xs">
                                        {v.desc}
                                      </div>
                                      <div className="text-slate-500 text-xs mt-1">
                                        {v.detail}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                                <Info size={14} /> Interpretation
                              </p>
                              <p className="text-sm text-blue-900 leading-relaxed">
                                {item.interpretation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Benchmark Selector */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 shrink-0 flex items-center gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Benchmark
                </label>
                <select
                  value={selectedBenchmark}
                  onChange={(e) => handleBenchmarkChange(e.target.value)}
                  disabled={loading}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                >
                  {benchmarkOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto grow bg-gray-50/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Sharpe
                  </p>
                  <p
                    className={`text-2xl font-bold ${getColor(
                      pMetrics?.sharpe_ratio
                    )}`}
                  >
                    {formatValue(pMetrics?.sharpe_ratio)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Omega
                  </p>
                  <p
                    className={`text-2xl font-bold ${getColor(
                      pMetrics?.omega_ratio
                    )}`}
                  >
                    {formatValue(pMetrics?.omega_ratio)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Treynor
                  </p>
                  <p
                    className={`text-2xl font-bold ${getColor(
                      pMetrics?.treynor_ratio
                    )}`}
                  >
                    {formatValue(pMetrics?.treynor_ratio)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    HHI (Conc.)
                  </p>
                  <p
                    className={`text-2xl font-bold ${getColor(
                      pMetrics?.hhi,
                      "low_good"
                    )}`}
                  >
                    {formatValue(pMetrics?.hhi)}
                  </p>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 border-r border-gray-200 z-10 w-32">
                          Symbol
                        </th>
                        <th className="px-4 py-3">
                          <ColumnHeaderWithInfo
                            label="Sharpe"
                            description="Excess Return / Total Volatility. > 1 is good."
                          />
                        </th>
                        <th className="px-4 py-3">
                          <ColumnHeaderWithInfo
                            label="Sortino"
                            description="Excess Return / Downside Vol."
                          />
                        </th>
                        <th className="px-4 py-3">
                          <ColumnHeaderWithInfo
                            label="Treynor"
                            description="Excess Return / Beta."
                          />
                        </th>
                        <th className="px-4 py-3">
                          <ColumnHeaderWithInfo
                            label="Info Ratio"
                            description="Active Return / Tracking Error."
                          />
                        </th>
                        <th className="px-4 py-3 bg-blue-50/50">
                          <ColumnHeaderWithInfo
                            label="Active Ret."
                            description="Return vs Benchmark."
                          />
                        </th>
                        <th className="px-4 py-3">
                          <ColumnHeaderWithInfo
                            label="Downside Vol"
                            description="Volatility of negative returns."
                          />
                        </th>
                        <th className="px-4 py-3">
                          <ColumnHeaderWithInfo
                            label="Beta (1Y)"
                            description="Sensitivity to market."
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {Object.entries(individual).length > 0 ? (
                        Object.entries(individual).map(([symbol, data]) => (
                          <tr key={symbol} className="hover:bg-gray-50 group">
                            <td className="px-4 py-3 font-bold text-gray-900 sticky left-0 bg-white group-hover:bg-gray-50 border-r border-gray-100">
                              {symbol}
                            </td>

                            {/* Sharpe Cell */}
                            <td
                              className={`px-4 py-3 font-medium ${getColor(
                                data?.sharpe_ratio
                              )}`}
                            >
                              <div className="flex items-center gap-1">
                                {formatValue(data?.sharpe_ratio)}
                                <Info
                                  size={12}
                                  className="text-gray-300 hover:text-blue-500 cursor-help transition-colors"
                                  onMouseEnter={(e) =>
                                    handleMouseEnter(e, data, "sharpe")
                                  }
                                  onMouseLeave={handleMouseLeave}
                                />
                              </div>
                            </td>

                            {/* Sortino Cell */}
                            <td className="px-4 py-3 text-gray-600">
                              <div className="flex items-center gap-1">
                                {formatValue(data?.sortino_ratio)}
                                <Info
                                  size={12}
                                  className="text-gray-300 hover:text-blue-500 cursor-help transition-colors"
                                  onMouseEnter={(e) =>
                                    handleMouseEnter(e, data, "sortino")
                                  }
                                  onMouseLeave={handleMouseLeave}
                                />
                              </div>
                            </td>

                            {/* Treynor Cell */}
                            <td className="px-4 py-3 text-gray-600">
                              <div className="flex items-center gap-1">
                                {formatValue(data?.treynor_ratio)}
                                <Info
                                  size={12}
                                  className="text-gray-300 hover:text-blue-500 cursor-help transition-colors"
                                  onMouseEnter={(e) =>
                                    handleMouseEnter(e, data, "treynor")
                                  }
                                  onMouseLeave={handleMouseLeave}
                                />
                              </div>
                            </td>

                            {/* Info Ratio Cell */}
                            <td className="px-4 py-3 text-gray-600">
                              <div className="flex items-center gap-1">
                                {formatValue(data?.information_ratio)}
                                <Info
                                  size={12}
                                  className="text-gray-300 hover:text-blue-500 cursor-help transition-colors"
                                  onMouseEnter={(e) =>
                                    handleMouseEnter(e, data, "info")
                                  }
                                  onMouseLeave={handleMouseLeave}
                                />
                              </div>
                            </td>

                            {/* Active Return */}
                            <td
                              className={`px-4 py-3 font-medium bg-blue-50/30 ${
                                data?.active_return > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                {formatPercent(data?.active_return)}
                                <Info
                                  size={12}
                                  className="text-gray-300 hover:text-blue-500 cursor-help transition-colors"
                                  onMouseEnter={(e) =>
                                    handleMouseEnter(e, data, "active")
                                  }
                                  onMouseLeave={handleMouseLeave}
                                />
                              </div>
                            </td>

                            {/* Downside Vol */}
                            <td className="px-4 py-3 text-gray-500 font-mono">
                              <div className="flex items-center gap-1">
                                {formatPercent(data?.downside_volatility)}
                                <Info
                                  size={12}
                                  className="text-gray-300 hover:text-blue-500 cursor-help transition-colors"
                                  onMouseEnter={(e) =>
                                    handleMouseEnter(e, data, "downside")
                                  }
                                  onMouseLeave={handleMouseLeave}
                                />
                              </div>
                            </td>

                            {/* Beta */}
                            <td className="px-4 py-3 text-gray-500">
                              {formatValue(data?.beta_calc)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-4 py-8 text-center text-gray-400 italic"
                          >
                            No data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-gray-200 shrink-0">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded-md font-medium text-sm hover:bg-slate-700 transition-colors shadow-sm"
              >
                Close Metrics Dashboard
              </button>
            </div>

            {/* Custom Floating Interactive Tooltip */}
            {tooltipData && (
              <div
                className="fixed z-[9999] w-80 p-4 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-2xl pointer-events-none transition-opacity duration-200 ease-in-out"
                style={{
                  top: tooltipPos.y,
                  left: tooltipPos.x,
                }}
              >
                <div className="font-bold text-gray-900 mb-2 border-b pb-1 font-serif text-lg capitalize">
                  {tooltipData.metricType === "info"
                    ? "Information Ratio"
                    : tooltipData.metricType === "header"
                    ? tooltipData.data.label
                    : tooltipData.metricType
                        .replace("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>

                {/* Formula Display with Values */}
                <div className="mb-4 text-center p-3 bg-gray-50 rounded border border-gray-100">
                  {tooltipData.metricType === "sharpe" && (
                    <div className="font-serif italic text-base">
                      <span className="text-blue-700">
                        ({formatPercent(tooltipData.data.annual_return)} -{" "}
                        {formatPercent(tooltipData.rf)})
                      </span>
                      <div className="border-t border-black w-full my-1"></div>
                      <span className="text-red-700">
                        {formatPercent(tooltipData.data.annual_volatility)}{" "}
                        (Vol)
                      </span>
                    </div>
                  )}
                  {tooltipData.metricType === "sortino" && (
                    <div className="font-serif italic text-base">
                      <span className="text-blue-700">
                        ({formatPercent(tooltipData.data.annual_return)} -{" "}
                        {formatPercent(tooltipData.rf)})
                      </span>
                      <div className="border-t border-black w-full my-1"></div>
                      <span className="text-red-700">
                        {formatPercent(tooltipData.data.downside_volatility)}{" "}
                        (Downside Vol)
                      </span>
                    </div>
                  )}
                  {tooltipData.metricType === "treynor" && (
                    <div className="font-serif italic text-base">
                      <span className="text-blue-700">
                        ({formatPercent(tooltipData.data.annual_return)} -{" "}
                        {formatPercent(tooltipData.rf)})
                      </span>
                      <div className="border-t border-black w-full my-1"></div>
                      <span className="text-purple-700">
                        {formatValue(tooltipData.data.beta_calc)} (Beta)
                      </span>
                    </div>
                  )}
                  {tooltipData.metricType === "info" && (
                    <div className="font-serif italic text-base">
                      <span className="text-green-700">
                        {formatPercent(tooltipData.data.active_return)} (Active
                        Ret)
                      </span>
                      <div className="border-t border-black w-full my-1"></div>
                      <span className="text-orange-700">
                        {formatPercent(tooltipData.data.tracking_error)}{" "}
                        (Tracking Err)
                      </span>
                    </div>
                  )}
                  {/* New Tooltips for Volatility/Active */}
                  {tooltipData.metricType === "downside" && (
                    <div className="text-sm font-sans text-gray-700">
                      Standard Deviation of negative returns only.
                      <div className="font-mono font-bold mt-2 text-red-700">
                        {formatPercent(tooltipData.data.downside_volatility)}
                      </div>
                    </div>
                  )}
                  {tooltipData.metricType === "active" && (
                    <div className="font-serif italic text-base">
                      <span className="text-blue-700">
                        {formatPercent(tooltipData.data.annual_return)} (Stock)
                      </span>
                      <span className="mx-2">-</span>
                      <span className="text-gray-700">
                        {(
                          tooltipData.data.annual_return -
                          tooltipData.data.active_return
                        ).toFixed(2)}
                        % (Bench)
                      </span>
                    </div>
                  )}
                  {tooltipData.metricType === "header" && (
                    <div className="text-sm font-sans text-gray-700">
                      {tooltipData.data.description}
                    </div>
                  )}
                </div>

                <div className="space-y-2 font-sans text-xs">
                  {tooltipData.metricType !== "active" &&
                    tooltipData.metricType !== "downside" && (
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-500">
                          Risk-Free Rate Used:
                        </span>
                        <span className="font-mono">
                          {formatPercent(tooltipData.rf)}
                        </span>
                      </div>
                    )}
                  {(tooltipData.metricType === "sharpe" ||
                    tooltipData.metricType === "sortino" ||
                    tooltipData.metricType === "treynor") && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Annual Return:</span>
                      <span className="font-mono font-bold text-blue-700">
                        {formatPercent(tooltipData.data.annual_return)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MetricsCard;
