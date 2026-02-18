import React, { useState, useRef, useEffect } from "react";
import SummaryCard from "./new_portfolio/SummaryCard";
import TransactionSheet from "./new_portfolio/TransactionSheet";
import NewsSheet from "./new_portfolio/NewsSheet";
import GraphCatalog from "./new_portfolio/GraphCatalog";
import LoadingScreen from "./new_portfolio/LoadingScreen";
import BetaCard from "./new_portfolio/BetaCard";
import AlphaCard from "./new_portfolio/AlphaCard";
import MetricsCard from "./new_portfolio/MetricsCard";
import MetricInfoModal from "./new_portfolio/MetricInfoModal";
import WhatIfDashboard from "./new_portfolio/WhatIf/WhatIfDashboard";
import {
  LayoutDashboard,
  Receipt,
  Newspaper,
  Target,
  BarChart,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import "./new_portfolio/pdfStyles.css";

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
      { key: "symbol", label: "Stock" },
      { key: "weight", label: "Weight", format: (v) => `${(v * 100).toFixed(2)}%` },
      { key: "dividend_yield", label: "Yield", format: (v) => `${v}%` },
      { key: "price", label: "Price", format: (v) => `₹${v?.toFixed(2)}` },
      { key: "dividend_per_share", label: "DPS", format: (v) => `₹${v?.toFixed(2)}` },
    ],
  },
  alpha: {
    title: "Jensen's Alpha Analysis",
    color: "emerald",
    concept: "Jensen's Alpha represents the excess return generated by an investment over its theoretical expected return. It answers: 'Did this stock beat the market after adjusting for the risk it took?' A positive alpha indicates 'added value' beyond simple market exposure, while negative indicates underperformance relative to risk.",
    formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem; text-align: center;\">α = R<sub>i</sub> - [ R<sub>f</sub> + β × (R<sub>m</sub> - R<sub>f</sub>) ]</div>`,
    interpretation: {
      low: "Negative Alpha: Underperformance after adjusting for risk. High costs or poor stock selection.",
      high: "Positive Alpha: Skillful selection or exposure to factors not captured by Beta. Delivering return above risk-adjusted expectations."
    },
    columns: [
      { key: "symbol", label: "Stock" },
      { key: "alpha", label: "Alpha (α)", format: (v) => v?.toFixed(4) },
      { key: "actual_return", label: "Actual Ret.", format: (v) => (v * 100).toFixed(2) + "%" },
      { key: "expected_return", label: "Exp. Ret.", format: (v) => (v * 100).toFixed(2) + "%" },
      { key: "beta_used", label: "Beta (β)", format: (v) => v?.toFixed(2) }
    ]
  },
  beta: {
    title: "Beta & Market Correlation",
    color: "blue",
    concept: "Beta measures sensitivity to market moves. β = 1.0 means moving identical to market. β > 1.0 amplifies market volatility (aggressive), and β < 1.0 dampens it (defensive).",
    formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem; text-align: center;\">β = Cov(r<sub>s</sub>, r<sub>m</sub>) / Var(r<sub>m</sub>)</div>`,
    interpretation: {
      low: "Defensive profile. Historically falls less than the market during crashes.",
      high: "Aggressive profile. Expect larger swings. High sensitivity to general market sentiment."
    },
    columns: [
      { key: "symbol", label: "Stock" },
      { key: "beta", label: "Beta (β)", format: (v) => v?.toFixed(2) },
      { key: "correlation", label: "Correlation", format: (v) => v?.toFixed(2) },
      { key: "stock_volatility", label: "Stock Vol.", format: (v) => (v * 100).toFixed(2) + "%" },
      { key: "market_volatility", label: "Mkt Vol.", format: (v) => (v * 100).toFixed(2) + "%" }
    ]
  },
  sharpe: {
    title: "Sharpe Ratio (Efficiency)",
    color: "indigo",
    concept: "Measures return per unit of TOTAL risk (volatility). It reveals if you are being adequately compensated for the 'bumpiness' of the ride.",
    formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem; text-align: center;\">Sharpe = (R<sub>p</sub> - R<sub>f</sub>) / σ<sub>p</sub></div>`,
    interpretation: {
      low: "Low Efficiency: Taking high risk for meager returns.",
      high: "High Efficiency: Sharpe > 1.0 is good; > 2.0 is exceptional. Means you're squeezing maximum return from every bit of risk."
    },
    columns: [
      { key: "symbol", label: "Stock" },
      { key: "sharpe_ratio", label: "Sharpe", format: (v) => v?.toFixed(2) },
      { key: "daily_return", label: "Ann. Ret.", format: (v) => (v * 100 * 252).toFixed(2) + "%" },
      { key: "volatility", label: "Volatility", format: (v) => (v * 100 * Math.sqrt(252)).toFixed(2) + "%" }
    ]
  },
  sortino: {
    title: "Sortino Ratio (Downside Risk)",
    color: "rose",
    concept: "Similar to Sharpe, but only penalizes WRONG volatility (price drops). Upward swings are not 'risk'.",
    formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem; text-align: center;\">Sortino = (R<sub>p</sub> - R<sub>f</sub>) / σ<sub>downside</sub></div>`,
    interpretation: {
      low: "Poor Downside Protection: Portfolio falls hard during dips.",
      high: "Superior Downside Adjusted Ret: Sortino > Sharpe indicates most of your volatility is actually to the upside."
    },
    columns: [
      { key: "symbol", label: "Stock" },
      { key: "sortino_ratio", label: "Sortino", format: (v) => v?.toFixed(2) },
      { key: "downside_volatility", label: "Downside Vol.", format: (v) => (v * 100 * Math.sqrt(252)).toFixed(2) + "%" }
    ]
  },
  treynor: {
    title: "Treynor Ratio (Systematic Risk)",
    color: "cyan",
    concept: "Treynor measures return per unit of MARKET RISK (Beta), not total risk. It assumes you've diversified away company-specific risks and only care about how sensitive your portfolio is to overall market moves.",
    formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem; text-align: center;\">Treynor = (R<sub>p</sub> - R<sub>f</sub>) / β</div>`,
    interpretation: {
      low: "Inefficient market exposure. Taking on too much systematic risk for the return generated.",
      high: "Superior systematic efficiency. Delivering high excess returns relative to the portfolio's Beta."
    },
    columns: [
      { key: "symbol", label: "Stock" },
      { key: "treynor_ratio", label: "Treynor", format: (v) => v?.toFixed(2) },
      { key: "beta", label: "Beta", format: (v) => v?.toFixed(2) }
    ]
  },
  information: {
    title: "Information Ratio (Consistency)",
    color: "blue",
    concept: "IR measures how consistently you beat the benchmark relative to tracking error. It's not enough to beat the market once - IR asks: 'Do you beat it RELIABLY?'",
    formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem; text-align: center;\">IR = (R<sub>p</sub> - R<sub>m</sub>) / Tracking Error</div>`,
    interpretation: {
      low: "Inconsistent behavior or underperformance relative to the benchmark.",
      high: "Consistent outperformance. IR > 0.5 is good; > 1.0 is exceptional managed performance."
    },
    columns: [
      { key: "symbol", label: "Stock" },
      { key: "information_ratio", label: "Info ratio", format: (v) => v?.toFixed(2) },
      { key: "tracking_error", label: "Tracking Error", format: (v) => (v * 100).toFixed(2) + "%" }
    ]
  },
  omega: {
    title: "Omega Ratio (Loss Protection)",
    color: "orange",
    concept: "Omega compares the probability-weighted magnitude of gains to losses relative to a threshold. It accounts for tail risks and the shape of return distribution.",
    formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem; text-align: center;\">Omega = Σ(Gains) / Σ(Losses)</div>`,
    interpretation: {
      low: "Losses likely outweigh gains or distribution is negatively skewed.",
      high: "Gains outweigh losses significantly. Omega > 1.0 is the minimum requirement."
    },
    columns: [
      { key: "symbol", label: "Stock" },
      { key: "omega_ratio", label: "Omega", format: (v) => v?.toFixed(2) }
    ]
  },
  hhi: {
    title: "HHI (Concentration Index)",
    color: "slate",
    concept: "HHI measures portfolio concentration - how dependent you are on a few stocks. Lower HHI means better diversification across the portfolio components.",
    formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem; text-align: center;\">HHI = Σ w<sub>i</sub>²</div>`,
    interpretation: {
      low: "Well-Diversified. HHI < 0.15 is generally considered a healthy spread.",
      high: "Concentrated Risk. HHI > 0.25 signals heavy dependency on a few top holdings."
    },
    columns: [
      { key: "symbol", label: "Stock" },
      { key: "weight", label: "Weight", format: (v) => `${(v * 100).toFixed(2)}%` },
      { key: "hhi_contribution", label: "HHI Contrib.", format: (v) => v?.toFixed(4) }
    ]
  },
  volatility: {
    title: "Volatility & Downside Risk",
    color: "rose",
    concept: "Volatility (σ) measures total variance in returns - the 'bumpiness' of your investment journey. High volatility means wild price swings. Downside Volatility isolates ONLY negative deviations, revealing the true risk of capital loss.",
    formula: `<div style=\"font-family: 'Times New Roman', serif; font-size: 1.1rem; font-style: italic; padding: 0.5rem; text-align: center;\">σ = √[ Σ(R<sub>i</sub> - R̄)² / n ]</div>`,
    interpretation: {
      low: "Low: < 15%. This is a stable, conservative profile. Typical for large-cap value and debt-heavy portfolios.",
      high: "High: > 25%. Aggressive profile with significant price swings. Expect high emotional stress but potential for higher rewards."
    },
    columns: [
      { key: "symbol", label: "Stock" },
      { key: "volatility", label: "Total Vol.", format: (v) => (v * 100 * Math.sqrt(252)).toFixed(2) + "%" },
      { key: "downside_volatility", label: "Downside Vol.", format: (v) => (v * 100 * Math.sqrt(252)).toFixed(2) + "%" }
    ]
  }
};

const PortfolioDashboard = ({ data, portfolioName, newsData = null, onNewsDateSelect = null }) => {
  const [activeTab, setActiveTab] = useState("analysis");
  const [activeInfoModal, setActiveInfoModal] = useState(null);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [whatif, setWhatIf] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ message: "", percent: 0 });
  const dashboardRef = useRef(null);

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;

    setIsExporting(true);
    setExportProgress({ message: "Initializing export...", percent: 0 });

    const updateProgress = (message, percent) => {
      setExportProgress({ message, percent: Math.round(percent) });
    };

    try {
      updateProgress("Preparing dashboard for export...", 5);

      // Extended wait for all charts to fully render
      await new Promise(resolve => setTimeout(resolve, 5000));

      updateProgress("Importing PDF utility...", 15);
      const { exportPortfolioToPDF } = await import('../../utils/pdfExportUtil');

      updateProgress("Capturing dashboard content...", 25);

      // Get portfolio name from data or use default
      const finalPortfolioName = portfolioName ||
        data?.portfolio_summary?.portfolio_name ||
        data?.ledger?.portfolio_name ||
        "My Portfolio";

      // Company logo - you can set this to your company logo path/base64
      // Example: const companyLogo = "/path/to/logo.png" or base64 string
      const companyLogo = "/cmda_logo1.png"; // Set your company logo here

      const result = await exportPortfolioToPDF({
        element: dashboardRef.current,
        data: data,
        portfolioName: finalPortfolioName,
        companyLogo: companyLogo,
        onProgress: (message, percent) => {
          console.log('PDF Progress:', message, percent);
          updateProgress(message, percent);
        }
      });

      updateProgress("PDF generated successfully!", 100);
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success(`✓ PDF exported successfully!`);
    } catch (error) {
      console.error("PDF Export failed:", error);
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress({ message: "", percent: 0 });
      }, 500);
    }
  };


  // Extract summary safely
  const summary = data?.portfolio_summary || {};

  // Fallback if no data
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Export Loader Modal */}
      {isExporting && exportProgress.percent > 0 && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center transform transition-all">
            {/* Spinning Loader */}
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-gray-100 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Generating PDF Report</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Please wait while we prepare your comprehensive portfolio report...</p>

            {/* Progress Bar Container */}
            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${Math.round(exportProgress.percent)}%` }}
              ></div>
            </div>

            {/* Progress Status Box */}
            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {exportProgress.message}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-mono">
                {Math.round(exportProgress.percent)}% Complete
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #portfolio-report-container {
          background-color: transparent;
        }
        
        /* PDF specific styling */
        .pdf-page-break {
          page-break-before: always;
          break-before: page;
          padding-top: 4rem;
          margin-top: 2rem;
        }
        
        .pdf-avoid-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        /* Visibility control for export */
        .pdf-only { display: none; }
        .is-exporting .pdf-only { display: block !important; }
        .is-exporting .no-pdf { display: none !important; }

        /* Fix overlapping and layout during export */
        .is-exporting .sticky,
        .is-exporting .fixed {
          position: static !important;
          transform: none !important;
        }

        .is-exporting {
          background-color: white !important;
          color: #1f2937 !important;
        }

        @media print {
          .no-pdf { display: none !important; }
          .pdf-only { display: block !important; }
          #portfolio-report-container {
            background-color: white !important;
            color: #0f172a !important;
            padding: 0 !important;
          }
          .dark #portfolio-report-container {
            background-color: white !important;
            color: #0f172a !important;
          }
          .dark #portfolio-report-container * {
            border-color: #e2e8f0 !important;
            color: #0f172a !important;
          }
        }

        /* Prevent charts from being cut */
        .pdf-chart-container {
          min-height: 400px;
          page-break-inside: avoid;
        }
        
        canvas, svg {
          max-width: 100% !important;
          height: auto !important;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          shape-rendering: geometricPrecision;
        }

        /* Metric Detail Tables for PDF */
        .pdf-detail-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1.5rem;
          font-size: 0.65rem;
          background: white;
        }
        .pdf-detail-table th, .pdf-detail-table td {
          border: 1px solid #e2e8f0;
          padding: 8px;
          text-align: left;
        }
        .pdf-detail-table th {
          background-color: #f8fafc;
          font-weight: 600;
        }

        /* Ensure new pages start cleanly */
        .is-exporting .pdf-section-container {
          display: block !important;
          width: 100% !important;
          margin-bottom: 3rem !important;
          clear: both !important;
          position: relative !important;
          background: white !important;
          z-index: 1;
          page-break-inside: avoid !important;
          break-inside: avoid-page !important;
        }

        .is-exporting .pdf-row {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          gap: 1rem !important;
          width: 100% !important;
          align-items: stretch !important;
          justify-content: space-between !important;
        }

        .is-exporting .pdf-row > * {
          flex: 1 1 0px !important;
          min-width: 0 !important;
          width: auto !important;
          max-width: none !important;
        }

        .is-exporting .pdf-detail-table th, 
        .is-exporting .pdf-detail-table td {
          font-size: 14px !important;
          padding: 12px 8px !important;
        }

        .is-exporting h2, .is-exporting h3 {
          font-size: 28px !important;
          margin-bottom: 1.5rem !important;
        }

        .is-exporting p, .is-exporting span, .is-exporting td {
          font-size: 14px !important;
        }

        .pdf-page-break {
          page-break-before: always !important;
          break-before: page !important;
          margin-top: 2rem !important;
        }

        /* Force high resolution images to show up */
        .is-exporting img, .is-exporting svg {
           max-width: none !important;
        }
      `}</style>
      {/* <LoadingScreen isVisible={false} message="" /> Hidden unless needed externally */}

      <div ref={dashboardRef} id="portfolio-report-container" className={`max-w-6xl mx-auto px-4 py-8 bg-transparent dark:bg-transparent ${isExporting ? 'is-exporting' : ''}`}>
        {/* Header with Export Button */}
        <div className="flex justify-between items-center mb-8 no-pdf">

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <LayoutDashboard className="w-5 h-5" />
                Export PDF Report
              </>
            )}
          </button>
        </div>

        {/* Global Summary Cards - Section 1 (Hidden in PDF as it's included in Section 2) */}
        {!isExporting && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <SummaryCard title="Deployed Capital" value={summary.total_deployed_amount} isCurrency />
            <SummaryCard title="Current Market Value" value={summary.current_market_value} isCurrency />
            <SummaryCard title="Overall P&L" value={summary.overall_pnl} isCurrency colorScale />
            <SummaryCard title="Total Return" value={summary.overall_return_percentage} suffix="%" colorScale />
          </div>
        )}

        {!isExporting && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
        )}

        {/* Tabs - Hidden in PDF */}
        {!isExporting && (
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex gap-8 text-sm font-medium">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`inline-flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors ${activeTab === "analysis"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Analysis & Graphs
              </button>

              <button
                onClick={() => setActiveTab("transactions")}
                className={`inline-flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors ${activeTab === "transactions"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                <Receipt className="w-5 h-5" />
                Holdings & Transactions
              </button>

              <button
                onClick={() => setActiveTab("whatif")}
                className={`inline-flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors ${activeTab === "whatif"
                  ? "border-amber-600 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                <Zap className="w-5 h-5" />
                What If
              </button>

              <button
                onClick={() => setActiveTab("news")}
                className={`inline-flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors ${activeTab === "news"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                <Newspaper className="w-5 h-5" />
                News
              </button>
            </nav>
          </div>
        )}

        {/* Tab Content */}
        <div className={`space-y-8  ${isExporting ? 'pdf-page-break' : ''}`}>
          {(activeTab === "analysis" || isExporting) && (
            <div className="space-y-8">

              {/* ============================================ */}
              {/* PDF EXPORT STRUCTURE - Proper Order          */}
              {/* ============================================ */}

              {/* PAGE 1: Current Holdings Overview */}
              {isExporting && (
                <div className="pdf-page-break bg-white p-8 overflow-visible" data-pdf-section="1">
                  <div className="pdf-section-container flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">1</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Current Holdings Overview</h2>
                      <p className="text-sm text-gray-500">Complete list of your portfolio holdings</p>
                    </div>
                  </div>
                  <TransactionSheet ledgerData={data.ledger} isExporting={isExporting} />
                </div>
              )}

              {/* PAGE 2: Portfolio Performance Summary */}
              {isExporting && (
                <div className="pdf-page-break bg-white p-8 overflow-visible" data-pdf-section="2">
                  <div className="pdf-section-container flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">2</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Portfolio Performance Summary</h2>
                      <p className="text-sm text-gray-500">Key performance metrics and returns</p>
                    </div>
                  </div>
                  <div className="pdf-section-container grid grid-cols-2 lg:grid-cols-3 gap-6">
                    <SummaryCard title="Deployed Capital" value={summary.total_deployed_amount} isCurrency isExporting={isExporting} />
                    <SummaryCard title="Current Market Value" value={summary.current_market_value} isCurrency isExporting={isExporting} />
                    <SummaryCard title="Overall P&L" value={summary.overall_pnl} isCurrency colorScale isExporting={isExporting} />
                    <SummaryCard title="Total Return" value={summary.overall_return_percentage} suffix="%" colorScale isExporting={isExporting} />
                    <SummaryCard
                      title={summary.best_performer?.symbol ? `Best: ${summary.best_performer.symbol}` : "Best Performer"}
                      value={summary.best_performer?.unrealized_pnl}
                      isCurrency
                      highlight
                      isExporting={isExporting}
                    />
                    <SummaryCard
                      title={summary.worst_performer?.symbol ? `Worst: ${summary.worst_performer.symbol}` : "Worst Performer"}
                      value={summary.worst_performer?.unrealized_pnl}
                      isCurrency
                      highlight={false}
                      colorScale
                      isExporting={isExporting}
                    />
                  </div>
                </div>
              )}

              {/* PAGE 3: Alpha Metrics Analysis */}
              {isExporting && (
                <div className="pdf-page-break bg-white p-8 overflow-visible" data-pdf-section="3">
                  <div className="pdf-section-container flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">3</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Alpha Metrics Analysis</h2>
                      <p className="text-sm text-gray-500">Excess returns over benchmark</p>
                    </div>
                  </div>
                  <div className="pdf-section-container">
                    <AlphaCard
                      alphaMetrics={data.alpha_metrics}
                      currentHoldings={currentHoldingsConverted}
                      isExporting={isExporting}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* PAGE 4: Beta Metrics & Risk Assessment */}
              {isExporting && (
                <div className="pdf-page-break bg-white p-8 overflow-visible" data-pdf-section="4">
                  <div className="pdf-section-container flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">4</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Beta Metrics & Risk Assessment</h2>
                      <p className="text-sm text-gray-500">Market volatility and risk measures</p>
                    </div>
                  </div>
                  <div className="pdf-section-container">
                    <BetaCard
                      betaMetrics={data.beta_metrics}
                      currentHoldings={currentHoldingsConverted}
                      isExporting={isExporting}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* PAGE 5: Valuation Ratios & Metrics */}
              {isExporting && (
                <div className="pdf-page-break bg-white p-8 overflow-visible" data-pdf-section="5">
                  <div className="pdf-section-container flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">5</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Valuation Ratios & Metrics</h2>
                      <p className="text-sm text-gray-500">P/E, P/B, and dividend yield analysis</p>
                    </div>
                  </div>
                  <div className="pdf-section-container grid grid-cols-3 gap-6 mb-8">
                    <SummaryCard
                      title="Portfolio P/E"
                      value={data.valuation_metrics?.portfolio_metrics?.pe}
                      customIcon={Target}
                      customColor="violet"
                      onInfoClick={() => setActiveInfoModal("pe")}
                      viewDetails={true}
                      isExporting={isExporting}
                    />
                    <SummaryCard
                      title="Portfolio P/B"
                      value={data.valuation_metrics?.portfolio_metrics?.pb}
                      customIcon={BarChart}
                      customColor="emerald"
                      onInfoClick={() => setActiveInfoModal("pb")}
                      viewDetails={true}
                      isExporting={isExporting}
                    />
                    <SummaryCard
                      title="Dividend Yield"
                      value={data.valuation_metrics?.portfolio_metrics?.dividend_yield}
                      suffix="%"
                      customColor="amber"
                      onInfoClick={() => setActiveInfoModal("yield")}
                      viewDetails={true}
                      isExporting={isExporting}
                    />
                  </div>
                  <div className="pdf-section-container">
                    <MetricsCard
                      ratioMetrics={data.ratio_metrics}
                      currentHoldings={currentHoldingsConverted}
                      isExporting={isExporting}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* PAGE 6: Visual Insights & Charts */}
              {isExporting && (
                <div className="pdf-page-break bg-white p-8 overflow-visible" data-pdf-section="6">
                  <div className="pdf-section-container flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                    <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">6</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Visual Performance Catalog</h2>
                      <p className="text-sm text-gray-500">Interactive graphical representation and performance health</p>
                    </div>
                  </div>
                  <div className="pdf-chart-container">
                    <GraphCatalog graphs={data.graphs || {}} isExporting={isExporting} />
                  </div>
                </div>
              )}

              {/* PAGE 7: Glossary & Detailed Analysis */}
              {isExporting && (
                <div className="pdf-page-break bg-white p-8 overflow-visible" data-pdf-section="7">
                  <div className="pdf-section-container flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">7</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Glossary & Detailed Analysis</h2>
                      <p className="text-sm text-gray-500">Metric definitions, formulas, and interpretation guides</p>
                    </div>
                  </div>

                  {/* Modal Details Content */}
                  <div className="space-y-8">
                    {Object.entries(METRIC_DEFINITIONS).map(([key, def]) => {
                      let tableDataSource = [];
                      if (key === 'alpha') {
                        tableDataSource = Object.entries(data?.alpha_metrics?.individual_alphas || {}).map(([s, m]) => ({ symbol: s, ...m }));
                      } else if (key === 'beta') {
                        tableDataSource = Object.entries(data?.beta_metrics?.individual_betas || {}).map(([s, m]) => ({ symbol: s, ...m }));
                      } else if (['sharpe', 'sortino', 'treynor', 'information', 'omega', 'hhi', 'volatility'].includes(key)) {
                        tableDataSource = Object.entries(data?.ratio_metrics?.individual_metrics || {}).map(([s, m]) => ({ symbol: s, ...m }));
                      } else {
                        tableDataSource = Object.entries(data?.valuation_metrics?.individual_metrics || {}).map(([s, m]) => ({ symbol: s, ...m }));
                      }

                      if (tableDataSource.length === 0) return null;

                      return (
                        <div key={key} data-pdf-section="7" className="pdf-section-container pdf-avoid-break bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                          <h3 className={`text-xl font-bold mb-3 text-${def.color}-700 flex items-center gap-2`}>
                            {def.title}
                          </h3>

                          {/* Concept - with orphan prevention */}
                          <div className="pdf-avoid-break bg-white p-4 rounded-lg mb-4 text-sm text-gray-700 leading-relaxed shadow-sm">
                            <p className="mb-2 font-semibold text-gray-900 border-b pb-1">Concept:</p>
                            <p style={{ orphans: 3, widows: 3 }}>{def.concept}</p>
                          </div>

                          {/* Formula */}
                          <div className="pdf-avoid-break mb-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Calculation Formula:</p>
                            <div className="bg-white p-3 rounded-lg border border-slate-100 overflow-x-auto shadow-sm" dangerouslySetInnerHTML={{ __html: def.formula }} />
                          </div>

                          {/* Detailed Breakdown Table */}
                          <div className="pdf-avoid-break mb-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Detailed Breakdown:</p>
                            <div className="overflow-x-auto bg-white rounded-lg border border-slate-100 shadow-sm">
                              <table className="pdf-detail-table w-full">
                                <thead>
                                  <tr>
                                    {def.columns.map(col => (
                                      <th key={col.key} className="text-xs py-2 px-3 bg-gray-100 font-semibold text-left">{col.label}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {tableDataSource.map((item) => (
                                    <tr key={item.symbol} className="border-t border-gray-100">
                                      {def.columns.map(col => (
                                        <td key={col.key} className="text-xs py-2 px-3">
                                          {col.format ? col.format(item[col.key]) : item[col.key]}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Interpretation Guide - with orphan prevention */}
                          {def.interpretation && (
                            <div className={`pdf-avoid-break mt-4 p-4 rounded-lg bg-${def.color}-50 border-l-4 border-${def.color}-400 text-xs text-slate-700`} style={{ orphans: 3, widows: 3 }}>
                              <p className="font-bold mb-2 uppercase tracking-tight">Interpretation Guide:</p>
                              <p className="mb-2"><strong>Low Values:</strong> {def.interpretation.low}</p>
                              <p><strong>High Values:</strong> {def.interpretation.high}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Important Note at end */}
                  <div data-pdf-section="7" className="pdf-section-container pdf-avoid-break mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="font-bold text-blue-900 mb-2">Important Note</h4>
                    <p className="text-sm text-blue-800" style={{ orphans: 3, widows: 3 }}>
                      All metrics and calculations in this report are based on the latest available financial data.
                      Portfolio metrics are weighted averages where each stock's impact is proportional to its market value.
                      Past performance is not indicative of future results. Please consult with a financial advisor before making investment decisions.
                    </p>
                  </div>
                </div>
              )}

              {/* ============================================ */}
              {/* REGULAR SCREEN VIEW (Not Exporting)         */}
              {/* ============================================ */}

              {/* Analysis Header Grid (Alpha, Beta, Ratio, Valuations) - Screen Only */}
              {!isExporting && (
                <>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <AlphaCard
                      alphaMetrics={data.alpha_metrics}
                      currentHoldings={currentHoldingsConverted}
                      isExporting={isExporting}
                    />
                    <BetaCard
                      betaMetrics={data.beta_metrics}
                      currentHoldings={currentHoldingsConverted}
                      isExporting={isExporting}
                    />
                    <MetricsCard
                      ratioMetrics={data.ratio_metrics}
                      currentHoldings={currentHoldingsConverted}
                      isExporting={isExporting}
                    />
                  </div>

                  {/* Valuation Section - Screen Only */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <SummaryCard
                      title="Portfolio P/E"
                      value={data.valuation_metrics?.portfolio_metrics?.pe}
                      customIcon={Target}
                      customColor="violet"
                      onInfoClick={() => setActiveInfoModal("pe")}
                      viewDetails={true}
                      isExporting={isExporting}
                    />
                    <SummaryCard
                      title="Portfolio P/B"
                      value={data.valuation_metrics?.portfolio_metrics?.pb}
                      customIcon={BarChart}
                      customColor="emerald"
                      onInfoClick={() => setActiveInfoModal("pb")}
                      viewDetails={true}
                      isExporting={isExporting}
                    />
                    <SummaryCard
                      title="Dividend Yield"
                      value={data.valuation_metrics?.portfolio_metrics?.dividend_yield}
                      suffix="%"
                      customColor="amber"
                      onInfoClick={() => setActiveInfoModal("yield")}
                      viewDetails={true}
                      isExporting={isExporting}
                    />
                  </div>

                  {/* Primary Plot Content - Screen Only */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Visual Insights & Performance</h2>
                    <div className="pdf-chart-container">
                      <GraphCatalog graphs={data.graphs || {}} isExporting={isExporting} />
                    </div>
                  </div>
                </>
              )}

            </div>
          )}

          {/* Regular Transactions Tab (Hidden for export as it's now integrated above for proper sequencing) */}
          {(activeTab === "transactions" && !isExporting) && (
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-6 pdf-section-container`}>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Current Holdings & Ledger</h2>
              <TransactionSheet ledgerData={data.ledger} isExporting={isExporting} />
            </div>
          )}

          {(activeTab === "whatif") && (
            <div className={`bg-white dark:bg-gray-800 p-6 ${isExporting ? 'pdf-page-break' : ''}`}>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Scenario Analysis (What-If)</h2>
              <WhatIfDashboard
                transactionsData={data?.ledger?.current_holdings || data?.ledger?.holdings || []}
                onBack={() => setActiveTab("analysis")}
              />
            </div>
          )}

          {(activeTab === "news") && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Portfolio News Updates</h2>
              <NewsSheet
                newsData={newsData || data.news}
                onDateSelect={onNewsDateSelect}
              />
              {!(newsData || data.news) && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No news updates found for the selected period.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <MetricInfoModal
        isOpen={!!activeInfoModal && !isExporting}
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
                weight: data.holdings_raw?.[symbol]?.weight || 0
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