import React, { useMemo, useState } from "react";
import { Info } from "lucide-react";

const formatValue = (value, decimals = 2) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  return num.toFixed(decimals);
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const raw =
    typeof value === "string" ? value.replace(/,/g, "") : String(value);
  const num = Number(raw);
  return Number.isFinite(num) ? num.toLocaleString("en-IN") : "—";
};

const RatioItem = ({ label, value, tooltip }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
      <span>{label}</span>
      {tooltip && (
        <span className="inline-flex items-center group relative">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span className="pointer-events-none absolute left-1/2 top-full mt-1 w-52 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            {tooltip}
          </span>
        </span>
      )}
    </div>
    <span className="text-lg font-bold text-slate-900">{value}</span>
  </div>
);

const SkeletonBlock = () => (
  <div className="h-8 w-24 bg-slate-200/80 rounded-lg animate-pulse" />
);

const STORAGE_KEY = "cmda_financial_ratio_columns";

const META = {
  PER: { label: "P/E", group: "Valuation", tooltip: "Price to Earnings ratio" },
  Adj_PE: { label: "Adj P/E", group: "Valuation", tooltip: "Adjusted Price to Earnings" },
  Price_Book: { label: "P/B", group: "Valuation", tooltip: "Price to Book" },
  Price_BV: { label: "P/B", group: "Valuation", tooltip: "Price to Book Value" },
  PriceSalesRatio: { label: "P/S", group: "Valuation", tooltip: "Price to Sales" },
  EV: { label: "Enterprise Value", group: "Valuation", tooltip: "Enterprise Value" },
  EV_Net_Sales: { label: "EV/Sales", group: "Valuation", tooltip: "Enterprise Value to Net Sales" },
  EV_Core_EBITDA: { label: "EV/EBITDA", group: "Valuation", tooltip: "Enterprise Value to EBITDA" },
  EV_EBIT: { label: "EV/EBIT", group: "Valuation", tooltip: "Enterprise Value to EBIT" },
  EV_CE: { label: "EV/Capital Employed", group: "Valuation", tooltip: "Enterprise Value to Capital Employed" },
  EV_EBITA: { label: "EV/EBITA", group: "Valuation", tooltip: "Enterprise Value to EBITA" },
  MCAP: { label: "Market Cap", group: "Valuation", tooltip: "Market Capitalization" },
  MCap_Sales: { label: "MCap/Sales", group: "Valuation", tooltip: "Market Cap to Sales" },
  Price_Sales: { label: "Price/Sales", group: "Valuation", tooltip: "Price to Sales" },
  TTMPE: { label: "TTM P/E", group: "Valuation", tooltip: "Trailing Twelve Month P/E" },
  
  Reported_EPS: { label: "EPS", group: "Profitability", tooltip: "Reported Earnings Per Share" },
  Adjusted_EPS: { label: "Adj EPS", group: "Profitability", tooltip: "Adjusted Earnings Per Share" },
  CEPS: { label: "CEPS", group: "Profitability", tooltip: "Cash Earnings Per Share" },
  DPS: { label: "DPS", group: "Profitability", tooltip: "Dividend Per Share" },
  Book_NAV_Share: { label: "Book Value", group: "Profitability", tooltip: "Book Value Per Share" },
  BookValue: { label: "Book Value", group: "Profitability", tooltip: "Book Value Per Share" },
  TTMEPS: { label: "TTM EPS", group: "Profitability", tooltip: "Trailing Twelve Month EPS" },
  Yield: { label: "Dividend Yield", group: "Profitability", tooltip: "Dividend Yield" },
  YIELD: { label: "Dividend Yield", group: "Profitability", tooltip: "Dividend Yield" },
  GPM: { label: "Gross Profit Margin", group: "Profitability", tooltip: "Gross Profit Margin" },
  Core_EBITDA_Margin: { label: "EBITDA Margin", group: "Profitability", tooltip: "Core EBITDA Margin" },
  EBIT_Margin: { label: "EBIT Margin", group: "Profitability", tooltip: "EBIT Margin" },
  Pre_Tax_Margin: { label: "Pre-Tax Margin", group: "Profitability", tooltip: "Pre-Tax Margin" },
  PAT_Margin: { label: "PAT Margin", group: "Profitability", tooltip: "Profit After Tax Margin" },
  Cash_Profit_Margin: { label: "Cash Profit Margin", group: "Profitability", tooltip: "Cash Profit Margin" },
  ROA: { label: "ROA", group: "Returns", tooltip: "Return on Assets" },
  ROE: { label: "ROE", group: "Returns", tooltip: "Return on Equity" },
  ROCE: { label: "ROCE", group: "Returns", tooltip: "Return on Capital Employed" },
  ROIC: { label: "ROIC", group: "Returns", tooltip: "Return on Invested Capital" },
  Return_On_Assets: { label: "ROA (Alt)", group: "Returns", tooltip: "Return on Assets (Alt)" },
  Return_On_Equity: { label: "ROE (Alt)", group: "Returns", tooltip: "Return on Equity (Alt)" },
  ROE_After_Interest: { label: "ROE After Interest", group: "Returns", tooltip: "ROE after Interest" },
  ROA_After_Interest: { label: "ROA After Interest", group: "Returns", tooltip: "ROA after Interest" },

  Total_Debt_Equity: { label: "Debt/Equity", group: "Leverage", tooltip: "Total Debt to Equity" },
  Current_Ratio: { label: "Current Ratio", group: "Leverage", tooltip: "Current Ratio" },
  Quick_Ratio: { label: "Quick Ratio", group: "Leverage", tooltip: "Quick Ratio" },
  Interest_Cover: { label: "Interest Cover", group: "Leverage", tooltip: "Interest Coverage Ratio" },
  Debt_TA: { label: "Debt/Assets", group: "Leverage", tooltip: "Debt to Assets" },
  Assets_To_Equity: { label: "Assets/Equity", group: "Leverage", tooltip: "Assets to Equity" },

  SalesToTotalAssets: { label: "Sales/Total Assets", group: "Efficiency", tooltip: "Sales to Total Assets" },
  SalesToCurrentAssets: { label: "Sales/Current Assets", group: "Efficiency", tooltip: "Sales to Current Assets" },
  Asset_Turnover: { label: "Asset Turnover", group: "Efficiency", tooltip: "Asset Turnover" },
  Receivable_days: { label: "Receivable Days", group: "Efficiency", tooltip: "Receivable Days" },
  Inventory_Days: { label: "Inventory Days", group: "Efficiency", tooltip: "Inventory Days" },
  Payable_days: { label: "Payable Days", group: "Efficiency", tooltip: "Payable Days" },

  Net_Sales_Growth: { label: "Net Sales Growth", group: "Growth", tooltip: "Net Sales Growth" },
  Core_EBITDA_Growth: { label: "EBITDA Growth", group: "Growth", tooltip: "Core EBITDA Growth" },
  EBIT_Growth: { label: "EBIT Growth", group: "Growth", tooltip: "EBIT Growth" },
  PAT_Growth: { label: "PAT Growth", group: "Growth", tooltip: "PAT Growth" },
  Adj_EPS_Growth: { label: "Adj EPS Growth", group: "Growth", tooltip: "Adjusted EPS Growth" },
  Reported_EPS_Growth: { label: "EPS Growth", group: "Growth", tooltip: "Reported EPS Growth" },
  Networth_Growth: { label: "Networth Growth", group: "Growth", tooltip: "Networth Growth" },
  MCap_Growth: { label: "MCap Growth", group: "Growth", tooltip: "Market Cap Growth" },
};

const EXCLUDE_KEYS = new Set([
  "SYMBOL",
  "Year_end",
  "YEAR_END",
  "TTM_YEAREND",
  "PRICE",
  "Flag",
  "FLAG",
  "FINCODE",
  "TYPE",
  "SCRIPCODE",
  "SCRIP_NAME",
  "SCRIP_GROUP",
  "COMPNAME",
  "IND_CODE",
  "industry",
  "HSE_CODE",
  "house",
  "SERIES",
  "ISIN",
  "S_NAME",
  "RFORMAT",
  "FFORMAT",
  "CHAIRMAN",
  "MDIR",
  "COSEC",
  "INC_MONTH",
  "INC_YEAR",
  "Status",
  "Sublisting",
  "Bse_Scrip_ID",
  "securitytoken",
  "CIN",
  "Bse_sublisting",
  "Nse_sublisting",
]);

const DEFAULT_KEYS = ["PER", "Reported_EPS", "Price_Book", "Book_NAV_Share"];

const humanizeKey = (key) => META[key]?.label || key.replace(/_/g, " ");
const tooltipFor = (key) => META[key]?.tooltip || null;
const groupFor = (key) => META[key]?.group || "Other";

const toDisplayValue = (value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return "—";
    const num = Number(trimmed.replace(/,/g, ""));
    if (Number.isFinite(num)) return formatValue(num);
    return trimmed;
  }
  if (typeof value === "number") return formatValue(value);
  return "—";
};

const FinancialRatiosSummary = ({ latestRatios, fr, companyEq, mode, loading }) => {
  const combined = useMemo(() => {
    return {
      ...(companyEq || {}),
      ...(latestRatios || {}),
      ...(fr || {}),
    };
  }, [companyEq, latestRatios, fr]);

  const availableKeys = useMemo(() => {
    return Object.keys(combined || {})
      .filter((key) => !EXCLUDE_KEYS.has(key))
      .filter((key) => combined[key] !== null && combined[key] !== undefined && combined[key] !== "")
      .sort((a, b) => humanizeKey(a).localeCompare(humanizeKey(b)));
  }, [combined]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {
        // ignore
      }
    }
    return DEFAULT_KEYS;
  });

  const visibleKeys = useMemo(() => {
    const filtered = selectedKeys.filter((key) => availableKeys.includes(key));
    return filtered.length > 0 ? filtered : availableKeys.slice(0, 8);
  }, [selectedKeys, availableKeys]);

  const groupedKeys = useMemo(() => {
    return visibleKeys.reduce((acc, key) => {
      const group = groupFor(key);
      acc[group] = acc[group] || [];
      acc[group].push(key);
      return acc;
    }, {});
  }, [visibleKeys]);

  const toggleKey = (key) => {
    setSelectedKeys((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold text-slate-900">Financial Ratios</h4>
        <button
          className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
        >
          Edit / Customize
        </button>
      </div>

      <div className="text-xs font-bold text-slate-400 mb-4">
        {mode === "consolidated" ? "Consolidated" : "Standalone"}
      </div>

      {isOpen && (
        <div className="mb-4 border border-slate-200 rounded-xl p-3 max-h-72 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 mb-2">
            Select columns
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableKeys.map((key) => (
              <label key={key} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(key)}
                  onChange={() => toggleKey(key)}
                />
                {humanizeKey(key)}
              </label>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonBlock key={idx} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedKeys).map(([group, keys]) => (
            <div key={group}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                {group}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {keys.map((key) => (
                  <RatioItem
                    key={key}
                    label={humanizeKey(key)}
                    value={toDisplayValue(combined[key])}
                    tooltip={tooltipFor(key)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancialRatiosSummary;
