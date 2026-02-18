import React, { useState } from "react";
import SummaryCard from "./SummaryCard";
import TransactionSheet from "./TransactionSheet";
import NewsSheet from "./NewsSheet";
import GraphCatalog from "./GraphCatalog";
import LoadingScreen from "./LoadingScreen";
import BetaCard from "./BetaCard";
import AlphaCard from "./AlphaCard";
import MetricsCard from "./MetricsCard";
import MetricInfoModal from "./MetricInfoModal";
import WhatIfDashboard from "./WhatIf/WhatIfDashboard";
import {
  LayoutDashboard,
  Receipt,
  Newspaper,
  Target,
  BarChart,
  Zap,
} from "lucide-react";

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
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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

const PortfolioDashboard = ({ data, newsData = null, onNewsDateSelect = null }) => {
  const [activeTab, setActiveTab] = useState("analysis");
  const [activeInfoModal, setActiveInfoModal] = useState(null);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [whatif, setWhatIf] = useState(false);

  // Extract summary safely
  const summary = data?.portfolio_summary || {};

  // Fallback if no data
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
          <p className="text-lg">No portfolio data available.</p>
          <p className="text-sm mt-2">Upload and analyze a portfolio to see insights here.</p>
        </div>
      </div>
    );
  }

  const currentHoldingsConverted = (() => {
    let holdings = data.ledger?.holdings || [];
    if (holdings.length === 0) {
      holdings = data.ledger?.current_holdings || [];
    }
    return holdings.map((h) => ({
      symbol: h.scrip || h.Symbol,
      quantity: h.qty || h.Qty,
      current_price: h.current_price || h.Current_Price || h.Mkt_Price,
    }));
  })();

  if (showWhatIf) {
    return (
      <WhatIfDashboard
        transactionsData={data?.ledger?.current_holdings || data?.ledger?.holdings || []}
        onBack={() => setShowWhatIf(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <LoadingScreen isVisible={false} message="" /> {/* Hidden unless needed externally */}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Global Summary Cards (Snippet 1 style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Deployed Capital" value={summary.total_deployed_amount} isCurrency />
          <SummaryCard title="Current Market Value" value={summary.current_market_value} isCurrency />
          <SummaryCard title="Overall P&L" value={summary.overall_pnl} isCurrency colorScale />
          <SummaryCard title="Total Return" value={summary.overall_return_percentage} suffix="%" colorScale />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <SummaryCard
            title={summary.best_performer?.symbol ? `Best: ${summary.best_performer.symbol}` : "Best Performer"}
            value={summary.best_performer?.unrealized_pnl}
            isCurrency
            highlight
          />
          <SummaryCard
            title={summary.worst_performer?.symbol ? `Worst: ${summary.worst_performer.symbol}` : "Worst Performer"}
            value={summary.worst_performer?.unrealized_pnl}
            isCurrency
            highlight={false}
            colorScale
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 mb-8">
          <nav className="-mb-px flex gap-8 text-sm font-medium">
            <button
              onClick={() => setActiveTab("analysis")}
              className={`inline-flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors ${activeTab === "analysis"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Analysis & Graphs
            </button>

            <button
              onClick={() => setActiveTab("transactions")}
              className={`inline-flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors ${activeTab === "transactions"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
            >
              <Receipt className="w-5 h-5" />
              Holdings & Transactions
            </button>

            <button
              onClick={() => setActiveTab("whatif")}
              className={`inline-flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors ${activeTab === "whatif"
                ? "border-amber-600 text-amber-600 dark:text-amber-400 dark:border-amber-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
            >
              <Zap className="w-5 h-5" />
              What If
            </button>

            <button
              onClick={() => setActiveTab("news")}
              className={`inline-flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors ${activeTab === "news"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
            >
              <Newspaper className="w-5 h-5" />
              News
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "analysis" && (
            <div className="space-y-8">
              {/* Analysis Header Grid (Alpha, Beta, Ratio, Valuations) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Alpha Card */}
                <AlphaCard
                  alphaMetrics={data.alpha_metrics}
                  currentHoldings={currentHoldingsConverted}
                />
                {/* Beta Card */}
                <BetaCard
                  betaMetrics={data.beta_metrics}
                  currentHoldings={currentHoldingsConverted}
                />
                {/* Ratio/Metrics Card */}
                <MetricsCard
                  ratioMetrics={data.ratio_metrics}
                  currentHoldings={currentHoldingsConverted}
                />
              </div>

              {/* Valuation Ratios Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  value={data.valuation_metrics?.portfolio_metrics?.dividend_yield}
                  suffix="%"
                  customColor="amber"
                  onInfoClick={() => setActiveInfoModal("yield")}
                  viewDetails={true}
                />
              </div>

              {/* Primary Plot Content */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/20 overflow-hidden p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100">Visual Insights & Performance</h2>
                <GraphCatalog graphs={data.graphs || {}} />
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/20 p-6 border dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100">Current Holdings & Ledger</h2>
              <TransactionSheet ledgerData={data.ledger} />
            </div>
          )}

          {activeTab === "whatif" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/20 p-6 border dark:border-slate-700">
              <WhatIfDashboard
                transactionsData={data?.ledger?.current_holdings || data?.ledger?.holdings || []}
                onBack={() => setActiveTab("analysis")}
              />
            </div>
          )}

          {activeTab === "news" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/20 p-6 border dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100">Portfolio News</h2>
              <NewsSheet
                newsData={newsData || data.news}
                onDateSelect={onNewsDateSelect}
              />
              {(newsData || data.news) ? null : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  No news available. Select a date range to fetch latest updates.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <MetricInfoModal
        isOpen={!!activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
        title={activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].title : ""}
        concept={activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].concept : ""}
        formula={activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].formula : ""}
        example={activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].example : ""}
        interpretation={activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].interpretation : {}}
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
        columns={activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].columns : []}
        color={activeInfoModal ? METRIC_DEFINITIONS[activeInfoModal].color : "blue"}
      />
    </div>
  );
};

export default PortfolioDashboard;