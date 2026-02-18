import React from "react";
import { motion } from "framer-motion";

const StockHeader = ({
  companyName,
  symbol,
  priceLabel,
  changeLabel,
  percentLabel,
  isUp,
  sector,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm"
    >
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
            {companyName || "Company"}
            <span className="text-slate-500 font-bold"> ({symbol || "--"})</span>
          </h3>
          {sector && (
            <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-700 bg-white/70 border border-slate-200 shadow-sm">
              {sector}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="text-2xl md:text-3xl font-bold text-slate-900">
            {priceLabel || "—"}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              isUp
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {changeLabel || "—"} {percentLabel ? `(${percentLabel})` : ""}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StockHeader;
