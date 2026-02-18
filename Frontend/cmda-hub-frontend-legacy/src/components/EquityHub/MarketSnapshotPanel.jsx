import React, { useEffect, useMemo, useState } from "react";

const formatINR = (value) => {
  if (value === null || value === undefined || value === "" || isNaN(value))
    return "—";
  const num =
    typeof value === "string" ? Number(value.replace(/,/g, "")) : Number(value);
  if (isNaN(num)) return "—";
  if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)} Cr`;
  if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)} L`;
  if (num >= 1e3) return `₹${(num / 1e3).toFixed(2)} K`;
  return `₹${num.toFixed(2)}`;
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const raw =
    typeof value === "string" ? value.replace(/,/g, "") : String(value);
  const num = Number(raw);
  return Number.isFinite(num) ? num.toLocaleString("en-IN") : "—";
};

const useCountUp = (value, duration = 600) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      setDisplay(value);
      return;
    }
    let frame;
    const start = performance.now();
    const startValue =
      typeof display === "number" && !Number.isNaN(display) ? display : value;
    const delta = value - startValue;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(startValue + delta * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return display;
};

const SnapshotRow = ({ label, value, format }) => {
  const numericValue =
    typeof value === "number" && !Number.isNaN(value) ? value : null;
  const animatedValue = useCountUp(numericValue ?? value);
  const formatted = useMemo(() => {
    if (format === "currency") return formatINR(animatedValue);
    if (format === "number") return formatNumber(animatedValue);
    if (format === "percent")
      return animatedValue === "—" || animatedValue == null
        ? "—"
        : `${animatedValue}%`;
    return animatedValue ?? "—";
  }, [animatedValue, format]);

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-900">{formatted}</span>
    </div>
  );
};

const SkeletonRow = () => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100">
    <div className="h-3 w-20 bg-slate-200/80 rounded-full animate-pulse" />
    <div className="h-3 w-16 bg-slate-200/80 rounded-full animate-pulse" />
  </div>
);

const MarketSnapshotPanel = ({
  summary,
  summaryRaw,
  companyEq,
  loading,
  error,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold text-slate-900">
          Key Market Snapshot
        </h4>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Live
        </span>
      </div>

      {error && (
        <div className="text-sm text-rose-600 font-bold mb-3">{error}</div>
      )}

      {loading && (
        <>
          {Array.from({ length: 9 }).map((_, idx) => (
            <SkeletonRow key={idx} />
          ))}
        </>
      )}

      {!loading && (
        <>
          <SnapshotRow label="Open" value={summary?.Open} format="currency" />
          <SnapshotRow label="High" value={summary?.High} format="currency" />
          <SnapshotRow label="Low" value={summary?.Low} format="currency" />
          <SnapshotRow
            label="Open"
            value={summary?.Open ?? summaryRaw?.Open ?? summaryRaw?.open}
            format="currency"
          />
          <SnapshotRow
            label="High"
            value={summary?.High ?? summaryRaw?.High ?? summaryRaw?.high}
            format="currency"
          />
          <SnapshotRow
            label="Low"
            value={summary?.Low ?? summaryRaw?.Low ?? summaryRaw?.low}
            format="currency"
          />
          <SnapshotRow
            label="Close"
            value={
              summary?.Close ??
              summaryRaw?.Close ??
              summaryRaw?.LastPrice ??
              summaryRaw?.close ??
              summaryRaw?.lastPrice
            }
            format="currency"
          />
          <SnapshotRow
            label="Volume"
            value={
              summary?.TotalTradedQty ??
              summaryRaw?.TotalTradedQty ??
              summaryRaw?.totalTradedQty ??
              summaryRaw?.TotalTradedQuantity ??
              summaryRaw?.totalTradedQuantity ??
              summaryRaw?.Volume ??
              summaryRaw?.volume
            }
            format="number"
          />
          <SnapshotRow
            label="Delivery %"
            value={
              summary?.DeliveryPct !== undefined && summary?.DeliveryPct !== null
                ? Number(String(summary.DeliveryPct).replace("%", ""))
                : null
            }
            format="percent"
          />
          <SnapshotRow
            label="Dividend %"
            value={
              companyEq?.YIELD !== undefined && companyEq?.YIELD !== null
                ? Number(String(companyEq.YIELD).replace("%", ""))
                : null
            }
            format="percent"
          />
          <SnapshotRow label="Face Value" value={companyEq?.FV} format="currency" />
          <SnapshotRow label="Market Cap" value={companyEq?.MCAP} format="currency" />
        </>
      )}
    </div>
  );
};

export default MarketSnapshotPanel;
