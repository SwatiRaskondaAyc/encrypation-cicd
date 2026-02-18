import React, { useState, useEffect } from "react";
import { Check, X, ArrowRight, Zap, DollarSign, RefreshCw } from "lucide-react";

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

const SimulationBuilder = ({
  sourceStock,
  targetStock,
  onConfirm,
  onCancel,
}) => {
  const [tradeType, setTradeType] = useState("SWAP_ALL");
  const [customQty, setCustomQty] = useState(0); // For partial
  const [customAmt, setCustomAmt] = useState(0); // For ADD_FUNDS

  // Constants
  const sourceValue =
    (sourceStock?.quantity || 0) * (sourceStock?.current_price || 0);
  const targetPrice = targetStock?.current_price || 0;

  // Check if this is "Add New Stock" mode
  const isAddingNew = sourceStock.symbol === "__ADD_NEW__";

  // Derivations
  let calculatedTargetQty = 0;
  let action = "";

  // In Add New mode, force ADD_FUNDS action
  if (isAddingNew) {
    action = "ADD_FUNDS";
    calculatedTargetQty = Math.floor(customAmt / targetPrice);
  } else {
    switch (tradeType) {
      case "SWAP_ALL":
        action = "SWAP_ALL";
        calculatedTargetQty = Math.floor(sourceValue / targetPrice);
        break;

      case "PARTIAL":
        // Sell X shares of Source, Buy Y shares of Target?
        // Or explicitly: "Use Custom Qty of Target"?
        // Usually "Partial" means "Sell X Source".
        // Let's assume input is "Qty of Source to Sell".
        // Let's simplify: "Sell X Source" -> "Buy Y Target".
        // Wait, original logic was "customQty" = qty of target? Or source?
        // Previous file: `calculatedQty = customQty > 0 ? floor(customQty) : 0` for PARTIAL.
        // And `quantity: customQty` in payload.
        // The backend probably interprets `quantity` based on `action`.
        // Let's stick to: "Sell Specific Amount of Source".
        // Wait, the previous UI said "Custom Quantity" input.
        // Let's assume the user inputs "How many Target shares they want"?
        // Or "How many Source shares to sell"?
        // "SWAP_QTY" action usually implies swapping a specific quantity of source.

        // Let's refine UX:
        // Option 1: Swap All (Sell All Source -> Buy Max Target)
        // Option 2: Swap Amount (Sell ₹X of Source -> Buy Max Target)

        // Let's keep it simple as per previous logic for safety, but nicer UI.
        // Previous: `calculatedQty` passed to `quantity` field.
        // Let's assume customQty is TARGET quantity for now?
        // Actually `SWAP_QTY` usually means swapping `quantity` of SOURCE.
        // Let's assume `customQty` is SOURCE SHARES TO SELL.

        action = "SWAP_QTY";
        // If we sell `customQty` source shares:
        const partialSourceValue = customQty * sourceStock.current_price;
        calculatedTargetQty = Math.floor(partialSourceValue / targetPrice);
        break;

      case "REPLACE_SHARES":
        // Replace exact same number of shares, value changes
        action = "REPLACE_SHARES";
        calculatedTargetQty = sourceStock.quantity; // Same quantity
        break;

      default:
        calculatedTargetQty = 0;
    }
  }

  const handleConfirm = () => {
    const config = {
      source_symbol: isAddingNew ? null : sourceStock.symbol,
      target_symbol: targetStock.symbol,
      action: action,
      quantity:
        tradeType === "PARTIAL" && !isAddingNew
          ? customQty
          : isAddingNew
            ? undefined
            : sourceStock.quantity, // Source share count usually
      amount: isAddingNew ? customAmt : undefined,
    };
    onConfirm(config);
  };

  // calculate financial delta
  const estimatedBuyValue = calculatedTargetQty * targetPrice;
  const estimatedSellValue =
    tradeType === "REPLACE_SHARES"
      ? sourceValue
      : tradeType === "SWAP_ALL"
        ? sourceValue
        : customQty * sourceStock.current_price;
  const diff = estimatedBuyValue - estimatedSellValue; // Positive = spending more (or getting more value? No.)
  // If we sell 100k and buy 99k, we have 1k leftover cash (freed up capital).
  // If we buy 100k using 0 sell (Add Funds), we spend 100k.

  // Let's phrase it as "Capital Adjustment".

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-indigo-500/20 dark:shadow-indigo-500/10 border border-slate-100 dark:border-slate-700 overflow-hidden w-full max-w-md animate-in zoom-in-95 duration-200">
      {/* Ticket Header */}
      <div className="bg-slate-800 dark:bg-slate-900 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="font-bold tracking-wide text-sm">
            TRANSACTION TICKET
          </span>
        </div>
        <button
          onClick={onCancel}
          className="hover:bg-white/20 p-1 rounded-full text-slate-400 hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Visual Flow: Source -> Target */}
        <div className="flex items-center justify-between">
          {/* SOURCE */}
          <div className="text-center w-1/3">
            <div className="bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-700 rounded-xl p-2 mb-1">
              <div className="font-bold text-rose-700 dark:text-rose-400">
                {sourceStock.symbol}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              SELLING
            </div>
            <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
              {tradeType === "SWAP_ALL"
                ? sourceStock.quantity
                : tradeType === "PARTIAL"
                  ? customQty
                  : tradeType === "REPLACE_SHARES"
                    ? sourceStock.quantity
                    : 0}{" "}
              shares
            </div>
          </div>

          {/* ARROW */}
          <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* TARGET */}
          <div className="text-center w-1/3">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-700 rounded-xl p-2 mb-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-400">
                {targetStock.symbol}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">BUYING</div>
            <div className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
              {calculatedTargetQty} shares
            </div>
          </div>
        </div>

        {/* TRADE TYPE BUTTONS - Only show when not adding new */}
        {!isAddingNew && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setTradeType("SWAP_ALL")}
              className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${tradeType === "SWAP_ALL"
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg scale-105"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
            >
              Swap All
            </button>
            <button
              onClick={() => setTradeType("PARTIAL")}
              className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${tradeType === "PARTIAL"
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg scale-105"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
            >
              Partial
            </button>
            <button
              onClick={() => setTradeType("REPLACE_SHARES")}
              className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${tradeType === "REPLACE_SHARES"
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg scale-105"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
            >
              Same Shares
            </button>
          </div>
        )}

        {/* Amount Input for Add New Stock */}
        {isAddingNew && (
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
              Investment Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="number"
                value={customAmt}
                onChange={(e) => setCustomAmt(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Enter amount to invest"
              />
            </div>
          </div>
        )}

        {/* Inputs */}
        {tradeType === "PARTIAL" && (
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
              Shares to Sell
            </label>
            <input
              type="number"
              value={customQty}
              onChange={(e) => setCustomQty(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              placeholder="0"
            />
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-right">
              Max: {sourceStock.quantity}
            </div>
          </div>
        )}

        {/* Impact Summary */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400">Value Sold:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {formatCurrency(estimatedSellValue)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-500 dark:text-slate-400">Value Bought:</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              {formatCurrency(estimatedBuyValue)}
            </span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={calculatedTargetQty <= 0}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <RefreshCw
              className={`w-4 h-4 ${tradeType !== "ADD_FUNDS" ? "rotate-90" : ""
                }`}
            />
            Simulate Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationBuilder;
