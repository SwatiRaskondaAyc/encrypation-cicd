// src/components/Modals/TradesModal.jsx (Fixed: Import isAfter from date-fns)
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCalendarLine, RiRefreshLine, RiFileTextLine, RiErrorWarningLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { HashLoader } from "react-spinners";
import { isAfter } from "date-fns";

const TradesModal = ({
  show,
  onClose,
  portfolioName,
  selectedPortfolioId,
  portfolioRange,
  dateRange,
  setDateRange,
  tradesData,
  loadingTrades,
  isAuthenticated,
  onRefreshTrades,
  onDeleteTrades,
  formatTradeExecutionTime,
  formatINR,
  formatTradeDateOnly,
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-4 sm:p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Trades for {portfolioName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                Portfolio ID: {selectedPortfolioId}
              </p>
              {portfolioRange.minDate && portfolioRange.maxDate && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Available date range: {portfolioRange.minDate} to {portfolioRange.maxDate}
                </p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <IoClose className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Date Range Warning (responsive) */}
          {isAfter(new Date(dateRange.startDate), new Date(dateRange.endDate)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <RiErrorWarningLine className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300 text-sm">
                    Invalid Date Range
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Start date is after end date. Please adjust.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Date Range Selector (grid responsive) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <RiCalendarLine className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 flex-shrink-0" />
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Select Date Range
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  max={dateRange.endDate}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  min={dateRange.startDate}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={onRefreshTrades}
                disabled={loadingTrades || isAfter(new Date(dateRange.startDate), new Date(dateRange.endDate))}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                <RiRefreshLine className="w-4 h-4" />
                {loadingTrades ? 'Loading...' : 'Refresh Trades'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={onDeleteTrades}
                disabled={!isAuthenticated || isAfter(new Date(dateRange.startDate), new Date(dateRange.endDate))}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Delete Trades in Range
              </motion.button>
            </div>
          </motion.div>

          {/* Trades Table (responsive, scrollable) */}
          {loadingTrades ? (
            <div className="flex flex-col items-center justify-center py-12">
              <HashLoader color="#3b82f6" size={50} />
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">Loading trades...</p>
            </div>
          ) : tradesData.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 mb-6">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {[
                      "Trade Execution Time",
                      // "Symbol", 
                      "Scrip Name", "Order Type", "Qty",
                      "Mkt Price", "Amount", "Exchange"
                    ].map((header) => (
                      <th key={header} className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tradesData.map((trade, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-3 text-gray-900 dark:text-white text-sm">{formatTradeExecutionTime(trade.Trade_execution_time)}</td>
                      {/* <td className="px-3 sm:px-6 py-3 text-gray-900 dark:text-white font-medium text-sm">{trade.Symbol}</td> */}
                      <td className="px-3 sm:px-6 py-3 text-gray-900 dark:text-white text-sm">{trade.Scrip_Name || '-'}</td>
                      <td className="px-3 sm:px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${trade.Order_Type === "B"
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                          {trade.Order_Type === "B" ? "BUY" : "SELL"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-900 dark:text-white text-sm">{trade.Qty?.toFixed(2) || 0}</td>
                      <td className="px-3 sm:px-6 py-3 text-gray-900 dark:text-white text-sm">₹{trade.Mkt_Price?.toFixed(2) || 0}</td>
                      <td className="px-3 sm:px-6 py-3 text-gray-900 dark:text-white font-medium text-sm">₹{formatINR(trade.Amount, 2) || 0}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-900 dark:text-white text-xs sm:text-sm">{trade.Exchange || '-'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 text-gray-500 dark:text-gray-400"
            >
              <RiFileTextLine className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 opacity-30" />
              <p className="text-base sm:text-lg">No trades found in the selected date range</p>
              <p className="text-sm text-gray-400 mt-2">
                Date Range: {dateRange.startDate} to {dateRange.endDate}
              </p>
            </motion.div>
          )}

          <div className="mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Showing {tradesData.length} trades between {dateRange.startDate} and {dateRange.endDate}
            </p>
            {!isAuthenticated() && (
              <p className="text-xs sm:text-sm text-amber-600 mt-2">
                Login required to delete trades
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default TradesModal;