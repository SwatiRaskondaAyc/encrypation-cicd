import React, { useEffect, useState } from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";

const formatINR = (value) => {
  if (!value || (typeof value !== "string" && isNaN(value))) return "₹0.00";
  const num =
    typeof value === "string" ? Number(value.replace(/,/g, "")) : Number(value);
  if (isNaN(num)) return "₹0.00";
  if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)} Cr`;
  if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)} L`;
  if (num >= 1e3) return `₹${(num / 1e3).toFixed(2)} K`;
  return `₹${num.toFixed(2)}`;
};

const formatNumber = (value) => {
  if (!value || (typeof value !== "string" && isNaN(value))) return "0";
  const num =
    typeof value === "string" ? Number(value.replace(/,/g, "")) : Number(value);
  return isNaN(num) ? "0" : num.toLocaleString("en-IN");
};

const OpenCloseCards = ({ symbol, companyName }) => {
  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    if (!symbol || !companyName) return;

    const fetchData = async () => {
      try {
        setMarketData(null);
        setError(null);

        const marketRes = await fetch(
          `${API_BASE}/stocks/test/generate_values`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              symbol: symbol.toUpperCase(),
              companyName,
            }),
          },
        );

        if (!marketRes.ok) {
          throw new Error(
            `HTTP ${marketRes.status}: Failed to fetch market data`,
          );
        }

        const market = await marketRes.json();

        if (!market.raw?.mkt_summary) {
          throw new Error("Invalid market data structure");
        }

        setMarketData(market);
      } catch (err) {
        console.error("Error fetching market data:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [symbol, companyName, API_BASE]);

  if (error) {
    return (
      <motion.div
        className="text-center mt-12 text-red-500 font-medium text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.div>
    );
  }

  if (!marketData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }

  const { raw } = marketData;
  const { mkt_summary } = raw;

  const prevClose = Number(mkt_summary.PrevClose?.replace(/,/g, "") || 0);
  const close = Number(mkt_summary.Close?.replace(/,/g, "") || 0);

  const change_from_prev_close = (close - prevClose).toFixed(2);
  const percent_change = prevClose
    ? ((change_from_prev_close / prevClose) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          {companyName}
          <span className="text-cyan-600 dark:text-cyan-400"> ({symbol})</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          {mkt_summary.date_string || "Date not available"} (
          {mkt_summary.week_day || "N/A"})
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className={`flex items-center gap-3 text-2xl sm:text-xl font-bold ${
            Number(change_from_prev_close) >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {Number(change_from_prev_close) >= 0 ? (
            <FaArrowTrendUp className="text-xl sm:text-4xl" />
          ) : (
            <FaArrowTrendDown className="text-xl sm:text-4xl" />
          )}
          {formatINR(mkt_summary.Close)}
        </div>

        <div
          className={`text-sm sm:text-base px-4 py-2 rounded-full font-semibold shadow-sm ${
            Number(change_from_prev_close) >= 0
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {formatINR(change_from_prev_close)} ({percent_change}%)
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <GroupedCard
          title="Price Summary"
          colorFrom="from-cyan-500"
          colorTo="to-blue-600"
          data={[
            {
              label: "Previous Close",
              value: formatINR(mkt_summary.PrevClose),
            },
            { label: "Open", value: formatINR(mkt_summary.Open) },
            { label: "Close", value: formatINR(mkt_summary.Close) },
            { label: "High", value: formatINR(mkt_summary.High) },
            { label: "Low", value: formatINR(mkt_summary.Low) },
          ]}
        />

        <GroupedCard
          title="Trading Summary"
          colorFrom="from-orange-400"
          colorTo="to-red-500"
          data={[
            {
              label: "Total Traded Qty",
              value: formatNumber(mkt_summary.TotalTradedQty),
            },
            {
              label: "Traded Value",
              value: formatINR(mkt_summary.TurnoverInRs),
            },
            {
              label: "Total Trades",
              value: formatNumber(mkt_summary.TotalTrades),
            },
            {
              label: "Deliverable Qty",
              value: formatNumber(mkt_summary.DeliverableQty || "N/A"),
            },
            {
              label: "Delivery %",
              value: mkt_summary.DeliveryPct
                ? `${mkt_summary.DeliveryPct}%`
                : "N/A",
            },
          ]}
        />

        <GroupedCard
          title="Stock Details"
          colorFrom="from-purple-500"
          colorTo="to-indigo-600"
          data={[
            {
              label: "Face Value",
              value: formatINR(raw.company_eq?.FV || "N/A"),
            },
            {
              label: "Dividend Yield",
              value: raw.company_eq?.YIELD ? `${raw.company_eq.YIELD}%` : "N/A",
            },
            {
              label: "Market Cap",
              value: formatINR(raw.company_eq?.MCAP || "N/A"),
            },
            { label: "Symbol", value: mkt_summary.symbol || symbol },
          ]}
        />
      </div>
    </div>
  );
};

const GroupedCard = ({ title, data, colorFrom, colorTo }) => (
  <motion.div
    className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div
      className={`absolute top-0 left-0 w-full h-1.5 rounded-t-2xl bg-gradient-to-r ${colorFrom} ${colorTo}`}
    ></div>
    <h3 className="text-center text-xl font-semibold text-gray-800 dark:text-white mt-4 mb-5">
      {title}
    </h3>
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex justify-between items-center px-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.label}
          </p>
          <p className="text-base font-medium text-gray-800 dark:text-cyan-400">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  </motion.div>
);

export default OpenCloseCards;
