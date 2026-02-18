import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";

const TransactionCard = ({ data, isParent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const isProfit = (data.pnl_perc ?? 0) >= 0;
  const pnlColor = isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
  const pnlBg = isProfit ? "bg-emerald-50 dark:bg-emerald-900/30" : "bg-red-50 dark:bg-red-900/30";

  const isSold = data.type === "Sold";
  const borderClass = isSold ? "border-l-amber-400" : "border-l-blue-500";
  const badgeClass = isSold
    ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"
    : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400";
  const shadowClass = isSold
    ? "shadow-[0_8px_30px_rgb(251,191,36,0.15)] hover:shadow-[0_8px_30px_rgb(251,191,36,0.25)] dark:shadow-none"
    : "shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.25)] dark:shadow-none";

  const containerClasses = `bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 border-l-8 ${borderClass} ${shadowClass} transition-all duration-300 ease-out mb-4 hover:scale-[1.005] hover:-translate-y-0.5`;

  const InfoTooltip = ({ id, title, children, align = "center" }) => {
    const isActive = activeTooltip === id;
    let posClass = "left-1/2 -translate-x-1/2";
    let arrowClass = "left-1/2 -translate-x-1/2";
    if (align === "right") {
      posClass = "right-0";
      arrowClass = "right-4";
    } else if (align === "left") {
      posClass = "left-0";
      arrowClass = "left-4";
    }

    return (
      <div className="relative inline-block z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTooltip(isActive ? null : id);
          }}
          onMouseEnter={() => setActiveTooltip(id)}
          onMouseLeave={() => setActiveTooltip(null)}
          className="ml-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 cursor-help hover:scale-110"
        >
          <Info size={15} strokeWidth={2.5} />
        </button>
        {isActive && (
          <div
            className={`absolute bottom-full mb-2 w-72 bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-4 shadow-2xl ${posClass} animate-in fade-in zoom-in-95 duration-200`}
          >
            <div className="font-bold text-sm text-blue-300 mb-2 border-b border-gray-700 pb-2">
              {title}
            </div>
            <div className="space-y-2 leading-relaxed text-gray-300">
              {children}
            </div>
            <div
              className={`absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700 ${arrowClass} -mt-px`}
            ></div>
          </div>
        )}
      </div>
    );
  };

  // Helper for Breakdown Table
  const BreakdownTable = ({ items }) =>
    items && Object.keys(items).length > 0 ? (
      <table className="w-full text-left">
        <tbody>
          {Object.entries(items).map(
            ([k, v]) =>
              v > 0 && (
                <tr key={k} className="border-b border-gray-700 last:border-0">
                  <td className="py-1 pr-2 text-gray-400">{k}</td>
                  <td className="py-1 text-right font-mono text-white">
                    ₹{v.toFixed(2)}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-400 italic">No itemized data available.</p>
    );
  // Format Helper
  const formatCost = (val) =>
    val && Number(val) > 0 ? `₹${Number(val).toFixed(2)}` : "-";

  return (
    <div className={`${containerClasses} pdf-section-container pdf-avoid-break`} data-pdf-section="1">
      <div className="p-4">
        {/* --- TOP ROW: HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 tracking-tight">
              {data.scrip}
            </h3>
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${badgeClass}`}
            >
              {data.type}
            </span>
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
              {data.qty} Qty
            </span>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Date</p>
              <p className="font-bold text-gray-700 dark:text-gray-300">
                {isSold ? data.sell_date : data.date}
              </p>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${pnlBg}`}
            >
              {isProfit ? (
                <TrendingUp size={20} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
              )}
              <div className="text-right relative">
                <div
                  className={`text-lg font-black leading-none ${pnlColor} flex items-center`}
                >
                  {data.pnl_perc}%
                  <InfoTooltip
                    id={`pnl-${data.id}`}
                    title="Return Calculation"
                    align="right"
                  >
                    {isSold ? (
                      <>
                        <p className="font-semibold text-white">
                          Realized Profit/Loss
                        </p>
                        <p>
                          Exit:{" "}
                          <span className="font-mono text-white">
                            ₹{data.avg_sell_price}
                          </span>
                        </p>
                        <p>
                          Entry:{" "}
                          <span className="font-mono text-white">
                            ₹{data.avg_buy_price}
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-white">
                          Unrealized Profit/Loss
                        </p>
                        <p>
                          Current:{" "}
                          <span className="font-mono text-white">
                            ₹{data.current_price}
                          </span>
                        </p>
                        <p>
                          Avg Cost:{" "}
                          <span className="font-mono text-white">
                            ₹{data.price}
                          </span>
                        </p>
                      </>
                    )}
                  </InfoTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM ROW: METRICS --- */}
        <div className="flex flex-wrap items-end justify-between gap-4 pt-3 border-t border-gray-100 dark:border-slate-700">
          <div className="flex gap-6 md:gap-10 text-sm">
            {/* Price */}
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5">
                {isSold ? "Avg Sell Price" : "Avg Buy Price"}
              </p>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-base hover:text-blue-600 transition-colors cursor-pointer">
                ₹{isSold ? data.avg_sell_price : data.price}
              </p>
            </div>

            {/* Current/Buy Price */}
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5">
                {isSold ? "Avg Buy Price" : "LTP"}
              </p>
              <p
                className={`font-bold text-base hover:text-blue-600 transition-colors cursor-pointer ${isSold ? "text-gray-800 dark:text-gray-200" : "text-blue-600 dark:text-blue-400"
                  }`}
              >
                ₹{isSold ? data.avg_buy_price : data.current_price}
              </p>
            </div>

            {/* Buy vs Sell Costs */}
            {isSold ? (
              <>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5">
                    Total Sell Brok.
                  </p>
                  <p className="font-medium text-gray-600 dark:text-gray-400 text-base hover:text-orange-600 transition-colors cursor-pointer">
                    {formatCost(data.total_sell_brokerage)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5 flex items-center">
                    Total Sell Taxes
                    <InfoTooltip
                      id={`tax-sell-${data.id}`}
                      title="Sell Tax Breakdown"
                      align="left"
                    >
                      <BreakdownTable items={data.sell_tax_breakdown} />
                    </InfoTooltip>
                  </p>
                  <p className="font-medium text-gray-600 dark:text-gray-400 text-base hover:text-red-600 transition-colors cursor-pointer">
                    {formatCost(data.total_sell_taxes)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5">
                    Buy Brokerage
                  </p>
                  <p className="font-medium text-gray-600 dark:text-gray-400 text-base hover:text-orange-600 transition-colors cursor-pointer">
                    {formatCost(data.buy_brokerage)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5 flex items-center">
                    Buy Taxes
                    {/* NEW: Tax breakdown for Current Holdings */}
                    <InfoTooltip
                      id={`tax-buy-${data.id}`}
                      title="Buy Tax Breakdown"
                      align="left"
                    >
                      <BreakdownTable items={data.tax_breakdown} />
                    </InfoTooltip>
                  </p>
                  <p className="font-medium text-gray-600 dark:text-gray-400 text-base hover:text-red-600 transition-colors cursor-pointer">
                    {formatCost(data.buy_taxes)}
                  </p>
                </div>
              </>
            )}
          </div>

          {isParent && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isOpen
                ? "bg-gray-800 dark:bg-slate-700 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
            >
              {isOpen ? "Hide Legs" : "View Legs"}
              <span
                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                  }`}
              >
                <ChevronDown size={16} />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* --- DROPDOWN LEGS --- */}
      {isParent && isOpen && data.buy_legs && (
        <div className="bg-gray-50/70 dark:bg-slate-900/50 border-t-2 border-gray-100 dark:border-slate-700 p-3">
          <div className="space-y-2">
            {data.buy_legs.map((leg, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-2 rounded-lg shadow-sm"
              >
                <div className="col-span-3 flex items-center gap-2">
                  <div className="h-6 w-1 rounded bg-amber-400 shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {leg.qty} Qty
                    </p>
                    <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      @ ₹{leg.buy_price}
                    </p>
                  </div>
                </div>
                <div className="col-span-9 grid grid-cols-5 gap-2 text-[11px]">
                  <div className="text-right">
                    <span className="block font-bold text-gray-300 dark:text-gray-600 text-[8px] uppercase">
                      Buy Date
                    </span>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {leg.buy_date}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-gray-300 dark:text-gray-600 text-[8px] uppercase">
                      Buy Brok
                    </span>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {formatCost(leg.buy_brokerage)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-gray-300 dark:text-gray-600 text-[8px] uppercase">
                      Buy Tax
                    </span>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {formatCost(leg.buy_taxes)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-gray-300 dark:text-gray-600 text-[8px] uppercase">
                      Sell Brok
                    </span>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {formatCost(leg.sell_brokerage)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-gray-300 dark:text-gray-600 text-[8px] uppercase">
                      Sell Tax
                    </span>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {formatCost(leg.sell_taxes)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
