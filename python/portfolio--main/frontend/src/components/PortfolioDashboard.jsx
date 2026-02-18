import React, { useState } from "react";
import axios from "axios";
import PlotlyGraph from "./PlotlyGraph";
import SummaryCard from "./SummaryCard";
import BetaCard from "./BetaCard";
import AlphaCard from "./AlphaCard";
import MetricsCard from "./MetricsCard";
import TransactionSheet from "./TransactionSheet";
import NewsSheet from "./NewsSheet";
import GraphCatalog from "./GraphCatalog";
import LoadingScreen from "./LoadingScreen";
import HoldingsTable from "./HoldingsTable";
import MetricInfoModal from "./MetricInfoModal";
import WhatIfDashboard from "./WhatIf/WhatIfDashboard";

import {
  UploadCloud,
  Loader2,
  FileSpreadsheet,
  LayoutDashboard,
  Receipt,
  Newspaper,
  ChevronRight,
  ArrowRight,
  Target,
  Activity,
  BarChart,
  Zap,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

const PortfolioDashboard = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("analysis");
  const [activeInfoModal, setActiveInfoModal] = useState(null);
  const [showWhatIf, setShowWhatIf] = useState(false);

  const METRIC_DEFINITIONS = {
    pe: {
      title: "Portfolio P/E Ratio",
      color: "violet",
      concept:
        "The Price-to-Earnings (P/E) ratio answers the question: 'How many rupees am I paying for each rupee of annual earnings?' It's the most widely used valuation metric globally. A P/E of 25 means you're paying ₹25 for every ₹1 the company earns annually. For portfolios, we calculate a weighted average where each stock's impact is proportional to its market value, ensuring your largest holdings drive the overall P/E.",
      example:
        "Example: Imagine TCS trades at ₹3,500 with EPS of ₹100 (P/E = 35). This means TCS needs to earn ₹100 per share every year to justify its ₹3,500 price. At this rate, it would take 35 years of earnings to 'pay back' the share price. Compare this to an FMCG stock at ₹200 with EPS of ₹20 (P/E = 10) - only 10 years of earnings to justify the price. The FMCG stock is CHEAPER relative to earnings, even if its absolute price is lower.",
      formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem;\">P/E<sub>portfolio</sub> = <span style=\"display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 0.3rem;\"><span style=\"border-bottom: 1px solid #334155; padding: 0 0.4rem 0.1rem;\">Σ(w<sub>i</sub> × P<sub>i</sub>)</span><span style=\"padding: 0.1rem 0.4rem 0;\">Σ(w<sub>i</sub> × EPS<sub>i</sub>)</span></span></div>`,
      interpretation: {
        low: "Value stocks, potential bargains, or companies with declining growth. P/E < 15 often indicates mature industries (banks, utilities, manufacturing) or temporary distress. May signal buying opportunity if fundamentals are strong.",
        high: "High growth expectations or potential overvaluation. P/E > 30 common in technology, pharma, and consumer discretionary. Investors are betting on aggressive future earnings growth. Higher risk if growth doesn't materialize.",
      },
      columns: [
        {
          key: "symbol",
          label: "Stock",
          description: "The stock ticker symbol in your portfolio.",
        },
        {
          key: "weight",
          label: "Weight",
          format: (v) => `${v}%`,
          subLabel: "% of Portfolio",
          description:
            "Percentage of total portfolio value. Calculated as (Stock Value / Total Portfolio Value) × 100.",
        },
        {
          key: "pe",
          label: "P/E",
          subLabel: "Ratio",
          description:
            "Price-to-Earnings ratio (Current Price ÷ EPS). Shows how much you pay for each rupee of earnings.",
        },
        {
          key: "price",
          label: "Price",
          format: (v) => `₹${v}`,
          description: "Current market price of the stock in Indian Rupees.",
        },
        {
          key: "eps",
          label: "EPS",
          subLabel: "₹ per share",
          description:
            "Earnings Per Share from the latest financial results. Represents the portion of company's profit allocated to each outstanding share.",
        },
        {
          key: "quarter",
          label: "Data Period",
          format: (v) => {
            if (!v) return "—";
            const str = String(v);
            if (str.length === 6) {
              const year = str.substring(0, 4);
              const month = str.substring(4, 6);
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              return `${monthNames[parseInt(month) - 1]} ${year}`;
            }
            return str;
          },
          description:
            "Period end date for the financial data used in EPS calculations.",
        },
      ],
    },
    pb: {
      title: "Portfolio P/B Ratio",
      color: "emerald",
      concept:
        "The Price-to-Book (P/B) ratio tells you: 'Am I paying more or less than the company's net asset value?' Book value is Total Assets minus Total Liabilities - basically what shareholders would get if the company sold everything and paid all debts. P/B < 1.0 means you're buying at a DISCOUNT to net assets. P/B > 1.0 means the market values intangibles (brand, IP, management quality, future growth) beyond just the balance sheet.",
      example:
        "Example: A bank has ₹10,000 crore in assets and ₹7,000 crore in liabilities. Book value = ₹3,000 crore. If it has 100 crore shares, Book Value Per Share = ₹30. If the stock trades at ₹24 (P/B = 0.8), you're buying at 20% BELOW liquidation value - potentially undervalued! If an IT company with same book value trades at ₹90 (P/B = 3.0), the market values its software IP, talent, and growth potential at 3× its net assets.",
      formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem;\">P/B<sub>portfolio</sub> = <span style=\"display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 0.3rem;\"><span style=\"border-bottom: 1px solid #334155; padding: 0 0.4rem 0.1rem;\">Σ(w<sub>i</sub> × P<sub>i</sub>)</span><span style=\"padding: 0.1rem 0.4rem 0;\">Σ(w<sub>i</sub> × BV<sub>i</sub>)</span></span></div>`,
      interpretation: {
        low: "Asset-heavy companies (manufacturing, banks, real estate) or value opportunities. P/B < 1.0 may signal deep value or fundamental problems. Banks typically trade at P/B 0.5-2.0.",
        high: "Asset-light businesses (Tech, FMCG, Services) with strong intangibles. P/B > 5.0 common for companies with high ROE, strong brands, or IP. Indicates market confidence in future profitability exceeding asset base.",
      },
      columns: [
        {
          key: "symbol",
          label: "Stock",
          description: "The stock ticker symbol in your portfolio.",
        },
        {
          key: "weight",
          label: "Weight",
          format: (v) => `${v}%`,
          subLabel: "% of Portfolio",
          description:
            "Percentage of total portfolio value. Calculated as (Stock Value / Total Portfolio Value) × 100.",
        },
        {
          key: "pe",
          label: "P/E",
          subLabel: "TTM",
          description:
            "Price-to-Earnings ratio using TTM EPS (Current Price ÷ TTM EPS). Shows how much you pay for each rupee of trailing twelve months earnings.",
        },
        {
          key: "price",
          label: "Price",
          format: (v) => `₹${v}`,
          description: "Current market price of the stock in Indian Rupees.",
        },
        {
          key: "eps",
          label: "EPS",
          subLabel: "TTM",
          description:
            "Trailing Twelve Months Earnings Per Share. Annualized net income ÷ outstanding shares over the last 12 months.",
        },
        {
          key: "quarter",
          label: "Data Period",
          format: (v) => {
            if (!v) return "—";
            const str = String(v);
            if (str.length === 6) {
              const year = str.substring(0, 4);
              const month = str.substring(4, 6);
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              return `${monthNames[parseInt(month) - 1]} ${year}`;
            }
            return str;
          },
          description:
            "Period end date for the TTM financial data. Shows the most recent quarter for which TTM calculations are based.",
        },
      ],
    },
    yield: {
      title: "Dividend Yield",
      color: "amber",
      concept:
        "Dividend Yield measures how much cash flow your portfolio generates relative to its price. It's the 'interest rate' you earn just for holding the stocks, separate from price appreciation. High yields typically come from mature, stable companies (utilities, PSU banks, oil & gas) that distribute profits rather than reinvesting them. Low yields often indicate growth companies that plow profits back into expansion.",
      example:
        "Example: You buy a stock for ₹500 that pays ₹25 in dividends annually. Your Yield = 5%. This is like earning 5% interest in a savings account, plus any gain in the stock price. If the stock falls to ₹400 but still pays ₹25, the yield RISES to 6.25% (buying income cheaper). Conversely, if price zooms to ₹1,000, yield drops to 2.5%. High yield can sometimes signify distress (price crashing), so check payout sustainability.",
      formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem;\">Yield<sub>portfolio</sub> = <span style=\"display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; margin: 0 0.3rem;\"><span style=\"border-bottom: 1px solid #334155; padding: 0 0.4rem 0.1rem;\">Σ(w<sub>i</sub> × Yield<sub>i</sub>)</span><span style=\"padding: 0.1rem 0.4rem 0;\">100</span></span></div>`,
      interpretation: {
        low: "Growth-focused portfolio. Tech, retail, and biotech often pay 0-1% dividends because they reinvest for growth. Not necessarily bad if capital appreciation is high.",
        high: "Income-focused strategy. Yields > 4% are attractive for passive income. Watch out for 'Yield Traps' where high yield is due to collapsing stock price rather than generous payouts.",
      },
      columns: [
        {
          key: "symbol",
          label: "Stock",
          description: "The stock ticker symbol in your portfolio.",
        },
        {
          key: "weight",
          label: "Weight",
          format: (v) => `${v}%`,
          description:
            "Percentage of total portfolio value this stock represents.",
        },
        {
          key: "dividend_yield",
          label: "Yield",
          format: (v) => `${v}%`,
          description:
            "Annual dividend yield % (Annual DPS ÷ Price × 100). Shows annual dividend income per rupee invested.",
        },
        {
          key: "price",
          label: "Price",
          format: (v) => `₹${v}`,
          description: "Current market price in Indian Rupees.",
        },
        {
          key: "dps",
          label: "DPS",
          subLabel: "Div Per Share",
          description:
            "Dividend Per Share - total annual dividend paid for each share you hold.",
        },
        {
          key: "quarter",
          label: "Data Period",
          format: (v) => {
            if (!v) return "—";
            const str = String(v);
            if (str.length === 6) {
              const year = str.substring(0, 4);
              const month = str.substring(4, 6);
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              return `${monthNames[parseInt(month) - 1]} ${year}`;
            }
            return str;
          },
          description:
            "Period end date for the fundamental data used in calculations.",
        },
      ],
    },
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // STEP 1: Normalize
      const normalizeRes = await axios.post(
        `${API_BASE}/api/normalize-portfolio`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const normalizedData = normalizeRes.data;

      // STEP 2: Analyze
      const analysisPayload = { transactions: normalizedData };

      const response = await axios.post(
        `${API_BASE}/api/portfolio-analysis`,
        analysisPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.status === "success") {
        console.log("Full API Response:", response.data); // DEBUG
        console.log("Ledger data:", response.data.ledger); // DEBUG

        setData({ ...response.data, transactions: normalizedData });

        // Fetch news (keep existing logic)
        const currentHoldings = response.data.ledger?.holdings || [];
        let activeSymbols = [];
        if (currentHoldings.length > 0) {
          activeSymbols = currentHoldings.map((h) => h.Symbol);
        } else if (normalizedData.length > 0) {
          activeSymbols = [...new Set(normalizedData.map((t) => t.Symbol))];
        }

        if (response.data.news && !response.data.news.message) {
          setNewsData(response.data.news);
        } else {
          if (activeSymbols.length > 0) {
            await fetchNewsForDate(null, activeSymbols);
          }
        }
      } else {
        setError(response.data?.message || "Analysis failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server or process file.");
    } finally {
      setLoading(false);
    }
  };

  // Portfolio metrics functionality removed - metrics endpoint deleted

  const toDDMMYYYY = (isoDate) => {
    if (!isoDate) return null;
    const parts = isoDate.split("-");
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const fetchNewsForDate = async (dateString, explicitSymbols = null) => {
    let symbolsToFetch = explicitSymbols;

    if (!symbolsToFetch && data) {
      const currentHoldings = data.ledger?.holdings || [];
      if (currentHoldings.length > 0) {
        symbolsToFetch = currentHoldings.map((h) => h.Symbol);
      } else if (data.transactions) {
        symbolsToFetch = [...new Set(data.transactions.map((t) => t.Symbol))];
      }
    }

    if (!symbolsToFetch || symbolsToFetch.length === 0) {
      return;
    }

    setError(null);

    const payload = {
      symbols: symbolsToFetch,
      date: dateString ? toDDMMYYYY(dateString) : null,
      max_articles: 60,
    };

    try {
      const newsRes = await axios.post(
        `${API_BASE}/api/news/portfolio-news`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (newsRes.data) {
        setNewsData(newsRes.data);
      }
    } catch (err) {
      console.warn("News date-fetch failed:", err);
      setError("Failed to fetch news.");
    }
  };

  const summary = data?.portfolio_summary || {};
  const metrics = data?.portfolio_metrics || {};

  if (showWhatIf) {
    return (
      <WhatIfDashboard
        transactionsData={data?.ledger?.holdings || data?.transactions || []}
        onBack={() => setShowWhatIf(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <LoadingScreen isVisible={loading} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-blue-600" />
                Portfolio Analytics
              </h1>
              <p className="text-sm text-slate-500">
                Advanced insights for your stock holdings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
                <UploadCloud className="w-4 h-4 text-slate-600" />
                <span className="text-sm">
                  {file ? file.name : "Upload portfolio file"}
                </span>
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 disabled:bg-blue-300 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </button>

              {data && <div />}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {!data && !loading && (
            <div className="mt-8 text-center text-slate-500 text-sm">
              Upload a portfolio file to see insights, graphs, transactions, and
              news.
            </div>
          )}

          {data && (
            <>
              {/* Summary cards with Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 align-stretch">
                {/* Row 1: Financials + Valuation */}
                <SummaryCard
                  title="Deployed Capital"
                  value={summary.total_deployed_amount}
                  isCurrency
                />
                <SummaryCard
                  title="Current Market Value"
                  value={summary.current_market_value}
                  isCurrency
                />
                <SummaryCard
                  title="Unrealized P&L"
                  value={summary.total_unrealized_pnl}
                  isCurrency
                  colorScale
                />
                <SummaryCard
                  title="Realized P&L"
                  value={summary.total_realized_pnl}
                  isCurrency
                  colorScale
                />

                {/* Row 2: Valuation Metrics */}
                <SummaryCard
                  title="Portfolio P/E"
                  value={data.valuation_metrics?.portfolio_metrics?.pe}
                  customIcon={Target}
                  customColor="violet"
                  onInfoClick={() => setActiveInfoModal("pe")}
                  viewDetails={true}
                />
                <SummaryCard
                  title="Portfolio P/B"
                  value={data.valuation_metrics?.portfolio_metrics?.pb}
                  customIcon={BarChart}
                  customColor="emerald"
                  onInfoClick={() => setActiveInfoModal("pb")}
                  viewDetails={true}
                />
                <SummaryCard
                  title="Dividend Yield"
                  value={
                    data.valuation_metrics?.portfolio_metrics?.dividend_yield
                  }
                  suffix="%"
                  customColor="amber"
                  onInfoClick={() => setActiveInfoModal("yield")}
                  viewDetails={true}
                />

                {/* Row 3: Performance & Risk */}
                <SummaryCard
                  title={
                    summary.best_performer?.symbol
                      ? `Best Trade: ${summary.best_performer.symbol}`
                      : "Best Trade"
                  }
                  value={summary.best_performer?.unrealized_pnl} // Value key is 'unrealized_pnl' in backend dict, but represents PnL
                  isCurrency
                  highlight
                  customColor="emerald"
                />
                <SummaryCard
                  title={
                    summary.worst_performer?.symbol
                      ? `Worst Trade: ${summary.worst_performer.symbol}`
                      : "Worst Trade"
                  }
                  value={summary.worst_performer?.unrealized_pnl}
                  isCurrency
                  highlight={false}
                  colorScale
                  customColor="rose"
                />
                {/* Alpha (New Rich Card) */}
                <AlphaCard
                  alphaMetrics={data.alpha_metrics}
                  currentHoldings={(() => {
                    let holdings = data.ledger?.holdings || [];

                    if (holdings.length === 0) {
                      holdings = data.ledger?.current_holdings || [];
                    }

                    return holdings.map((h) => ({
                      symbol: h.scrip || h.Symbol,
                      quantity: h.qty || h.Qty,
                      current_price:
                        h.current_price || h.Current_Price || h.Mkt_Price,
                    }));
                  })()}
                />

                {/* Beta (with dynamic recalculation) */}
                <BetaCard
                  betaMetrics={data.beta_metrics}
                  currentHoldings={
                    // Reuse logic or pass same data
                    (() => {
                      let holdings = data.ledger?.holdings || [];

                      if (holdings.length === 0) {
                        holdings = data.ledger?.current_holdings || [];
                      }

                      return holdings.map((h) => ({
                        symbol: h.scrip || h.Symbol,
                        quantity: h.qty || h.Qty,
                        current_price:
                          h.current_price || h.Current_Price || h.Mkt_Price,
                      }));
                    })()
                  }
                  onBenchmarkChange={(benchmark, newMetrics) => {
                    setData((prevData) => ({
                      ...prevData,
                      beta_metrics: newMetrics,
                    }));
                  }}
                />

                {/* Portfolio Metrics Card */}
                <MetricsCard
                  ratioMetrics={data.ratio_metrics}
                  currentHoldings={(() => {
                    let holdings = data.ledger?.holdings || [];
                    if (holdings.length === 0) {
                      holdings = data.ledger?.current_holdings || [];
                    }
                    return holdings.map((h) => ({
                      symbol: h.scrip || h.Symbol,
                      quantity: h.qty || h.Qty,
                      current_price:
                        h.current_price || h.Current_Price || h.Mkt_Price,
                    }));
                  })()}
                />
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-200 mb-4">
                <nav className="-mb-px flex gap-4 text-sm">
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className={`inline-flex items-center gap-1 border-b-2 px-3 py-2 ${
                      activeTab === "analysis"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab("transactions")}
                    className={`inline-flex items-center gap-1 border-b-2 px-3 py-2 ${
                      activeTab === "transactions"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                    Transactions
                  </button>
                  <button
                    onClick={() => setActiveTab("news")}
                    className={`inline-flex items-center gap-1 border-b-2 px-3 py-2 ${
                      activeTab === "news"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Newspaper className="w-4 h-4" />
                    News
                  </button>
                  <button
                    onClick={() => setActiveTab("whatif")}
                    className={`inline-flex items-center gap-1 border-b-2 px-3 py-2 ${
                      activeTab === "whatif"
                        ? "border-amber-600 text-amber-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    What If
                  </button>
                </nav>
              </div>
              {activeTab === "analysis" && data && (
                <div className="space-y-6">
                  {/* Graph Catalog */}
                  <GraphCatalog
                    graphs={data?.graphs}
                    file={file}
                    currentHoldings={data?.ledger?.current_holdings}
                  />
                </div>
              )}

              {activeTab === "graphs" && (
                <GraphCatalog
                  graphs={data?.graphs}
                  file={file}
                  currentHoldings={data?.ledger?.current_holdings}
                />
              )}

              {activeTab === "holdings" && (
                <div className="bg-white rounded-md shadow-sm p-4">
                  {/* Holdings content will go here */}
                  <p className="text-slate-500">Holdings table coming soon!</p>
                </div>
              )}

              {activeTab === "transactions" && (
                <div className="bg-white rounded-md shadow-sm p-4">
                  <TransactionSheet ledgerData={data.ledger} />
                </div>
              )}

              {activeTab === "news" && (
                <div className="bg-white rounded-md shadow-sm p-4">
                  <NewsSheet
                    newsData={newsData}
                    onDateSelect={fetchNewsForDate}
                  />
                </div>
              )}

              {activeTab === "whatif" && (
                <WhatIfDashboard
                  transactionsData={data?.ledger?.current_holdings || []}
                  onBack={() => setActiveTab("analysis")}
                />
              )}
            </>
          )}
        </>
      </div>

      <MetricInfoModal
        isOpen={!!activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
        title={activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].title : ""}
        concept={
          activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].concept : ""
        }
        formula={
          activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].formula : ""
        }
        example={
          activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].example : ""
        }
        interpretation={
          activeInfoModal
            ? METRIC_DEFINITIONS[activeInfoModal].interpretation
            : {}
        }
        tableData={
          activeInfoModal && data?.valuation_metrics?.individual_metrics
            ? Object.entries(data.valuation_metrics.individual_metrics).map(
                ([symbol, metrics]) => ({
                  symbol,
                  ...metrics,
                })
              )
            : []
        }
        columns={
          activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].columns : []
        }
        color={
          activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].color : "blue"
        }
      />
    </div>
  );
};

export default PortfolioDashboard;
