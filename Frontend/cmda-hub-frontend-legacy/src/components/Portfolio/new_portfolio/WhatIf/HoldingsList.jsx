import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, ArrowRightLeft } from "lucide-react";
import SimulationBuilder from "./SimulationBuilder";

const HoldingsList = ({
  holdings,
  initialHoldings,
  onInitiateSwap,
  selectedStock,
  onCancelSelection,
  onConfirmSimulation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter holdings
  const filteredHoldings = holdings.filter(
    (h) =>
      h.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitial = (symbol) => {
    return initialHoldings.find((h) => h.symbol === symbol);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl  overflow-hidden flex flex-col max-h-[85vh] transition-all">
      {/* Header & Search */}
      <div className="p-6 border-b border-indigo-50 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Your Holdings
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              Select an asset to simulate changes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800 shadow-sm">
              {holdings.length} Assets
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {filteredHoldings.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
            No assets matching "{searchTerm}"
          </div>
        ) : (
          filteredHoldings.map((stock) => {
            const initial = getInitial(stock.symbol);
            const isSelected = selectedStock?.symbol === stock.symbol;

            const isDrafting = isSelected && selectedStock?.preSelectedTarget;
            const qtyChanged = initial && stock.quantity !== initial.quantity;
            const isNew = !initial;

            return (
              <div
                key={stock.symbol}
                className={`transition-all duration-500 ${isSelected ? "scale-[1.01]" : ""
                  }`}
              >
                {/* CARD FOR STOCK */}
                <div
                  onClick={() => {
                    if (isSelected) {
                      onCancelSelection();
                    } else {
                      onInitiateSwap(stock);
                    }
                  }}
                  className={`
                    relative p-5 rounded-2xl border transition-all duration-300 group cursor-pointer
                    ${isSelected
                      ? "bg-gradient-to-r from-indigo-50 via-white to-blue-50 dark:from-indigo-900/40 dark:via-slate-800 dark:to-blue-900/40 border-indigo-200 dark:border-indigo-800 shadow-xl shadow-indigo-500/20 dark:shadow-none ring-4 ring-indigo-50 dark:ring-indigo-900/20"
                      : "bg-white/50 dark:bg-slate-800/50 border-white dark:border-slate-700/50 hover:border-indigo-100 dark:hover:border-indigo-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-indigo-100/40 dark:hover:shadow-none hover:-translate-y-0.5"
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    {/* Left: Info */}
                    <div className="flex items-center gap-4">
                      {/* Logo/Icon Placeholder */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-inner transition-colors ${isSelected
                            ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-indigo-700/50 dark:shadow-none"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                          }`}
                      >
                        {stock.symbol.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-lg ${isSelected ? "text-indigo-900 dark:text-indigo-100" : "text-slate-800 dark:text-slate-200"
                              }`}
                          >
                            {stock.symbol}
                          </span>
                          {isNew && (
                            <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 mb-1">
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md uppercase tracking-wide">
                            {stock.Sector ||
                              stock.sector ||
                              stock.industry ||
                              stock.Industry ||
                              "Equity"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px] font-medium opacity-80">
                          {stock.name || stock.symbol}
                        </div>
                      </div>
                    </div>

                    {/* Right: Value */}
                    <div className="text-right">
                      <div className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight">
                        {formatCurrency(stock.quantity * stock.current_price)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {stock.quantity}
                        </span>{" "}
                        shares @ {formatCurrency(stock.current_price)}
                      </div>
                    </div>
                  </div>

                  {/* Qty Change Indicator */}
                  {qtyChanged && (
                    <div className="mt-2 pt-2 border-t border-slate-100/50 dark:border-slate-700/50 flex items-center gap-2 text-xs">
                      <span className="text-slate-400 dark:text-slate-500">Qty Change:</span>
                      <div className="flex items-center gap-1">
                        <span className="line-through text-slate-400 dark:text-slate-500 decoration-slate-400 dark:decoration-slate-500">
                          {initial?.quantity}
                        </span>
                        <ArrowRightLeft className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                        <span
                          className={
                            stock.quantity > (initial?.quantity || 0)
                              ? "text-emerald-600 font-bold"
                              : "text-rose-600 font-bold"
                          }
                        >
                          {stock.quantity.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions (Only visible on hover or if selected) */}
                  {/* If NOT selecting target yet, show "Swap" button */}
                  {!isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInitiateSwap(stock);
                        }}
                        className="transform scale-70 group-hover:scale-100 transition-transform bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-1"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                        Swap / Adjust
                      </button>
                    </div>
                  )}

                  {/* If Selected but NO Target yet (Opening Modal...) */}
                  {isSelected && !selectedStock.preSelectedTarget && (
                    <div className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">
                      Selecting target asset...
                    </div>
                  )}
                </div>

                {/* SIMULATION SIMULATOR FORM (If stock has target) */}
                {isDrafting && (
                  <div className="mt-3 ml-4 relative z-10 animate-in slide-in-from-left-4 duration-300">
                    {/* Connecting Line */}
                    <div className="absolute top-[-10px] left-[-16px] w-[16px] h-[40px] border-b-2 border-l-2 border-indigo-200 dark:border-indigo-800 rounded-bl-xl" />

                    <SimulationBuilder
                      sourceStock={stock}
                      targetStock={selectedStock.preSelectedTarget}
                      onConfirm={onConfirmSimulation}
                      onCancel={onCancelSelection}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HoldingsList;
