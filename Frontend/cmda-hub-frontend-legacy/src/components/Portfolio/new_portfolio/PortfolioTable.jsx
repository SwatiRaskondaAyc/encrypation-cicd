import React from "react";
import { motion } from "framer-motion";

const PortfolioTable = ({
  portfolioData,
  formatTradeExecutionTime,
  formatINR,
}) => {
  return (
    <div className="w-full">
      <table className="w-full min-w-[800px] border-collapse">
        <thead className="bg-gray-50/50 dark:bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            {[
              // "Symbol",
              "Scrip Name",
              "Trade Execution Time",
              "Order Type",
              "Qty",
              "Mkt Price",
              "Amount",
              "Exchange",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-100 dark:border-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {portfolioData.map((row, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }} // Faster stagger
              className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-150 group"
            >
              {/* <td className="px-6 py-4 text-gray-900 dark:text-white font-medium text-sm whitespace-nowrap">
                {row.Symbol}
              </td> */}
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm max-w-xs truncate">
                {row.Scrip_Name || "-"}
              </td>
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap font-mono">
                {formatTradeExecutionTime(row.Trade_execution_time)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${row.Order_Type === "B"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"
                    }`}
                >
                  {row.Order_Type === "B" ? "BUY" : "SELL"}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-gray-200 text-sm font-mono text-right">
                {row.Qty?.toFixed(2) || 0}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-gray-200 text-sm font-mono text-right">
                {row.Mkt_Price?.toFixed(2) || 0}
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white font-bold text-sm font-mono text-right">
                ₹{formatINR(row.Amount, 2) || 0}
              </td>
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                {row.Exchange || "-"}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Footer / Stats (Optional, could be empty) */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 text-right">
        End of list
      </div>
    </div>
  );
};

export default PortfolioTable;