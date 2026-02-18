import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import ResearchChart from "./CandlePatterns/ResearchChart";
import GraphSlider from "./GraphSlider";
import StockHeader from "./StockHeader";
import MarketSnapshotPanel from "./MarketSnapshotPanel";
import FinancialRatiosSummary from "./FinancialRatiosSummary";
import { useMarketSummary } from "./hooks/useMarketSummary";
import { useRatioSummary } from "./hooks/useRatioSummary";
import { equityInsightsApi } from "../../services/equityInsightsApi";
const parseNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num =
    typeof value === "string" ? Number(value.replace(/,/g, "")) : Number(value);
  return Number.isFinite(num) ? num : null;
};
const pickField = (source, keys) => {
  if (!source) return null;
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
      return source[key];
    }
  }
  const lower = Object.keys(source).reduce((acc, key) => {
    acc[key.toLowerCase()] = source[key];
    return acc;
  }, {});
  for (const key of keys) {
    const val = lower[key.toLowerCase()];
    if (val !== undefined && val !== null && val !== "") return val;
  }
  return null;
};
const normalizeSummary = (summary) => {
  if (!summary) return null;
  return {
    Open: pickField(summary, ["Open", "OpenPrice", "Open_Value", "OpenValue"]),
    High: pickField(summary, ["High", "HighPrice", "High_Value", "HighValue"]),
    Low: pickField(summary, ["Low", "LowPrice", "Low_Value", "LowValue"]),
    Close: pickField(summary, [
      "Close",
      "ClosePrice",
      "Last",
      "LastPrice",
      "LTP",
    ]),
    PrevClose: pickField(summary, [
      "PrevClose",
      "PreviousClose",
      "Prev_Close",
      "PrevClosePrice",
    ]),
    TotalTradedQty: pickField(summary, [
      "TotalTradedQty",
      "TotalTradedQuantity",
      "Total Traded Qty",
      "Total Traded Quantity",
      "Volume",
      "Vol",
    ]),
    DeliveryPct: pickField(summary, [
      "DeliveryPct",
      "DeliveryPercent",
      "Delivery %",
      "Delivery_Percent",
    ]),
  };
};
const formatINR = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  return `₹${num.toFixed(2)}`;
};
const StockDetailCard = ({ stock, timeRange, isFullWidth }) => {
  const fincodeRef = useRef(stock?.fincode ?? stock?.Fincode ?? null);
  const [resolvedFincode, setResolvedFincode] = useState(
    stock?.fincode ?? stock?.Fincode ?? null,
  );
  const resolvedCompanyName =
    stock?.companyName ||
    stock?.Company_ShortName ||
    stock?.name ||
    stock?.companyNameFull ||
    stock?.symbol;
  const { data, loading, error } = useMarketSummary(
    stock?.symbol,
    resolvedCompanyName,
  );
  const { data: ratioData, mode, loading: ratioLoading } = useRatioSummary(
    stock?.symbol,
    "consolidated",
  );
  const summaryRaw =
    data?.raw?.mkt_summary ||
    data?.raw?.MktSummary ||
    data?.mkt_summary ||
    data?.summary ||
    null;
  const summary = normalizeSummary(summaryRaw);
  const companyEq =
    data?.raw?.company_eq || data?.raw?.companyEQ || data?.company_eq || null;
  const fr = data?.raw?.fr || data?.raw?.FR || data?.fr || null;
  const { priceLabel, changeLabel, percentLabel, isUp } = useMemo(() => {
    const close = parseNumber(summary?.Close);
    const prevClose = parseNumber(summary?.PrevClose);
    if (close === null || prevClose === null) {
      return {
        priceLabel: "—",
        changeLabel: "—",
        percentLabel: "",
        isUp: true,
      };
    }
    const change = close - prevClose;
    const percent = prevClose ? (change / prevClose) * 100 : 0;
    return {
      priceLabel: formatINR(close),
      changeLabel: formatINR(change),
      percentLabel: `${percent.toFixed(2)}%`,
      isUp: change >= 0,
    };
  }, [summary]);
  useEffect(() => {
    let mounted = true;
    const resolveFincode = async () => {
      if (fincodeRef.current || !stock?.symbol) return;
      try {
        const options = await equityInsightsApi.getSearchOptions();
        if (!options || !options.Symbol) return;
        const idx = options.Symbol.findIndex(
          (s) => String(s).toLowerCase() === String(stock.symbol).toLowerCase(),
        );
        if (idx === -1) return;
        const fincode =
          options.FINCODE?.[idx] || options.Fincode?.[idx] || null;
        if (mounted && fincode) {
          fincodeRef.current = fincode;
          setResolvedFincode(fincode);
        }
      } catch (err) {
        // silent fail, show fallback
      }
    };
    resolveFincode();
    return () => {
      mounted = false;
    };
  }, [stock?.symbol]);
  const fincode = resolvedFincode;
  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="p-6 space-y-6">
        <StockHeader
          companyName={stock?.companyName}
          priceLabel={priceLabel}
          changeLabel={changeLabel}
          percentLabel={percentLabel}
          isUp={isUp}
          sector={stock?.basicIndustry || stock?.industry}
        />
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">
                Research Chart
              </h4>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              {fincode ? (
                <ResearchChart company={{ ...stock, fincode }} />
              ) : (
                <div className="p-6 text-sm font-semibold text-slate-500">
                  Select a stock with fincode to view the chart.
                </div>
              )}
            </div>
          </div>
          <MarketSnapshotPanel
            summary={summary}
            summaryRaw={summaryRaw}
            companyEq={companyEq}
            loading={loading}
            error={error}
          />
        </div>
        <FinancialRatiosSummary
          latestRatios={ratioData}
          fr={fr}
          companyEq={companyEq}
          price={parseNumber(summary?.Close)}
          mode={mode}
          loading={ratioLoading}
        />

        <GraphSlider
          symbol={stock?.symbol}
          fincode={fincode}
          tabContext="equityHub"
          isFullWidth={isFullWidth}
          timeRange={timeRange}
        />
      </div>
    </motion.div>
  );
};
export default StockDetailCard;

