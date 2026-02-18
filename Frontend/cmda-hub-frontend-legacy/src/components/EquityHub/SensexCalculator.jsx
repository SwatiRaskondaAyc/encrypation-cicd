// import React, { useState } from "react";
// import { RiInformationLine, RiLightbulbFlashLine } from "react-icons/ri";
// import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

// const SensexCalculator = () => {
//   const [sensexChange, setSensexChange] = useState("");
//   const [result, setResult] = useState(null);
//   const [showInfo, setShowInfo] = useState(false);

//   const calculateStockChange = (percentChangeSensex) => {
//     const beta = 1.2;
//     const medianDispersion = 0.5;
//     const lowDispersion = 0.3;
//     const highDispersion = 0.7;
//     const recentStockPrice = 1000;
//     const adjustmentRise = 10;
//     const adjustmentFall = 8;

//     const betaEffectiveLow = beta / (1 + lowDispersion);
//     const betaEffectiveHigh = beta / (1 + highDispersion);
//     const betaEffectiveMedian = beta / (1 + medianDispersion);

//     const percentChangeStockMedian = betaEffectiveMedian * percentChangeSensex;
//     const percentChangeStockLow = betaEffectiveLow * percentChangeSensex;
//     const percentChangeStockHigh = betaEffectiveHigh * percentChangeSensex;

//     const priceLowRise =
//       recentStockPrice * (1 + percentChangeStockLow / 100) + adjustmentRise;
//     const priceHighRise =
//       recentStockPrice * (1 + percentChangeStockHigh / 100) - adjustmentRise;

//     const priceLowFall =
//       recentStockPrice * (1 - percentChangeStockLow / 100) + adjustmentFall;
//     const priceHighFall =
//       recentStockPrice * (1 - percentChangeStockHigh / 100) - adjustmentFall;

//     return {
//       low: percentChangeStockLow,
//       high: percentChangeStockHigh,
//       priceLowRise,
//       priceHighRise,
//       priceLowFall,
//       priceHighFall,
//     };
//   };

//   const handleInputChange = (event) => {
//     const value = parseFloat(event.target.value);
//     setSensexChange(event.target.value);

//     if (!isNaN(value)) {
//       const stockChangeResult = calculateStockChange(value);
//       setResult(stockChangeResult);
//     } else {
//       setResult(null);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-50 to-slate-50 p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-sky-600 to-slate-700 p-6 text-white">
//             <div className="flex justify-between items-center">
//               <h2 className="text-2xl font-bold">Sensex Impact Calculator</h2>
//               <button
//                 onClick={() => setShowInfo(!showInfo)}
//                 className="p-2 rounded-full hover:bg-sky-700 transition-colors"
//                 aria-label="Information"
//               >
//                 <RiInformationLine size={20} />
//               </button>
//             </div>
//             <p className="text-sky-100 mt-1">
//               Estimate how Sensex changes affect individual stocks
//             </p>
//           </div>

//           {/* Info Panel */}
//           {showInfo && (
//             <div className="bg-yellow-50 p-4 border-b border-yellow-200">
//               <div className="flex items-start">
//                 <RiLightbulbFlashLine className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
//                 <p className="text-sm text-yellow-800">
//                   This calculator estimates stock price movements based on Sensex changes.
//                   Results are indicative and may vary based on individual stock fundamentals.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Input Section */}
//           <div className="p-6">
//             <div className="mb-6">
//               <label htmlFor="sensexChange" className="block text-sm font-medium text-gray-700 mb-1">
//                 Enter Sensex Percentage Change
//               </label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   id="sensexChange"
//                   placeholder="e.g. 2.5 or -1.8"
//                   step="0.01"
//                   value={sensexChange}
//                   onChange={handleInputChange}
//                   className="w-full p-4 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-lg"
//                 />
//                 <span className="absolute right-4 top-4 text-gray-500">%</span>
//               </div>
//             </div>

//             {/* Results Section */}
//             {result && (
//               <div className="space-y-6">
//                 <div className="bg-gray-50 rounded-xl p-5">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                     <FiTrendingUp className="text-green-500 mr-2" />
//                     Potential Upside
//                   </h3>
//                   <div className="space-y-2">
//                     <ResultItem
//                       label="Stock Change Range"
//                       value={`${result.low.toFixed(2)}% to ${result.high.toFixed(2)}%`}
//                     />
//                     <ResultItem
//                       label="Price Range"
//                       value={`₹${result.priceLowRise.toFixed(2)} - ₹${result.priceHighRise.toFixed(2)}`}
//                       highlight
//                     />
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 rounded-xl p-5">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                     <FiTrendingDown className="text-red-500 mr-2" />
//                     Potential Downside
//                   </h3>
//                   <div className="space-y-2">
//                     <ResultItem
//                       label="Stock Change Range"
//                       value={`-${result.high.toFixed(2)}% to -${result.low.toFixed(2)}%`}
//                     />
//                     <ResultItem
//                       label="Price Range"
//                       value={`₹${result.priceLowFall.toFixed(2)} - ₹${result.priceHighFall.toFixed(2)}`}
//                       highlight
//                     />
//                   </div>
//                 </div>

//                 <div className="text-xs text-gray-500 p-3 bg-sky-50 rounded-lg">
//                   <p>
//                     Note: Calculations assume a base stock price of ₹1000 with beta=1.2.
//                     Actual results may vary based on market conditions and individual stock factors.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper component for consistent result items
// const ResultItem = ({ label, value, highlight = false }) => (
//   <div className="flex justify-between">
//     <span className={`text-sm ${highlight ? 'font-medium text-gray-700' : 'text-gray-600'}`}>
//       {label}
//     </span>
//     <span className={`text-sm ${highlight ? 'font-bold text-sky-600' : 'font-medium text-gray-800'}`}>
//       {value}
//     </span>
//   </div>
// );

// export default SensexCalculator;

import React, { useState } from "react";
import { RiInformationLine, RiLightbulbFlashLine } from "react-icons/ri";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import axios from "axios";
import RatingSystem from "../RatingFile/RatingSystem";
import { generatePlot } from "../../services/mtmApi";

const SensexCalculator = ({ symbol }) => {
  const [sensexChange, setSensexChange] = useState("");
  const [result, setResult] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [apiData, setApiData] = useState(null);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const calculateStockChange = (percentChangeSensex, data) => {
    const {
      beta_effective_low,
      beta_effective_median,
      beta_effective_high,
      recent_stock_price,
      adjustment_rise,
      adjustment_fall,
    } = data;

    const percentChangeStockLow = beta_effective_low * percentChangeSensex;
    const percentChangeStockMedian =
      beta_effective_median * percentChangeSensex;
    const percentChangeStockHigh = beta_effective_high * percentChangeSensex;

    const priceLowRise =
      recent_stock_price * (1 + percentChangeStockLow / 100) + adjustment_rise;
    const priceHighRise =
      recent_stock_price * (1 + percentChangeStockHigh / 100) - adjustment_rise;

    const priceLowFall =
      recent_stock_price * (1 - percentChangeStockLow / 100) + adjustment_fall;
    const priceHighFall =
      recent_stock_price * (1 - percentChangeStockHigh / 100) - adjustment_fall;

    return {
      low: percentChangeStockLow,
      high: percentChangeStockHigh,
      priceLowRise,
      priceHighRise,
      priceLowFall,
      priceHighFall,
    };
  };

  const handleInputChange = async (event) => {
    const value = parseFloat(event.target.value);
    setSensexChange(event.target.value);

    if (!symbol) {
      console.warn("Symbol prop is missing.");
      return;
    }

    if (!isNaN(value)) {
      try {
        if (!apiData) {
          // Use MTM API service
          const data = await generatePlot(
            symbol,
            "sensex_movement_corr_calculator",
          );
          setApiData(data);

          const stockChangeResult = calculateStockChange(value, data);
          setResult(stockChangeResult);
        } else {
          const stockChangeResult = calculateStockChange(value, apiData);
          setResult(stockChangeResult);
        }
      } catch (error) {
        console.error("API error:", error);
        setResult(null);
      }
    } else {
      setResult(null);
    }
  };

  const handleRatingUpdate = (newRating) => {
    console.log("sensex_calculator:", newRating);
  };

  return (
    // <div className="flex justify-center items-center  p-4 sm:p-6 lg:p-8">

    //   <RatingSystem
    //     plotType="sensex_movement_corr_calculator"
    //     onRatingUpdate={handleRatingUpdate}
    //     className="flex items-center"
    //     aria-label="Rate Sensex Impact Calculator"
    //   />

    //   <div className="w-full max-w-lg">
    //     {/* Card Container */}
    //     <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
    //       {/* Header */}
    //       <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-5 sm:p-6">
    //         <div className="flex justify-between items-center">
    //           <h2 className="text-xl sm:text-2xl font-bold text-white">
    //             Sensex Impact Calculator
    //           </h2>
    //           <button
    //             onClick={() => setShowInfo(!showInfo)}
    //             className="p-2 rounded-full hover:bg-sky-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
    //             aria-label={showInfo ? "Hide information" : "Show information"}
    //           >
    //             <RiInformationLine size={20} className="text-white" />
    //           </button>
    //         </div>
    //         <p className="text-sky-100 text-sm mt-1">
    //           Estimate how Sensex changes affect individual stocks
    //         </p>
    //       </div>

    //       {/* Info Section */}
    //       {showInfo && (
    //         <div className="bg-amber-50 dark:bg-amber-900/20 p-4 sm:p-5 border-b border-amber-200 dark:border-amber-800">
    //           <div className="flex items-start gap-3">
    //             <RiLightbulbFlashLine className="text-amber-500 dark:text-amber-400 mt-1 flex-shrink-0" size={20} />
    //             <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
    //               This calculator estimates stock price movements based on Sensex changes. Results are indicative and may vary based on individual stock fundamentals.
    //             </p>
    //           </div>
    //         </div>
    //       )}

    //       {/* Input and Results Section */}
    //       <div className="p-5 sm:p-6">
    //         {/* Input Field */}
    //         <div className="mb-6">
    //           <label
    //             htmlFor="sensexChange"
    //             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    //           >
    //             Sensex Percentage Change
    //           </label>
    //           <div className="relative">
    //             <input
    //               type="number"
    //               id="sensexChange"
    //               placeholder="e.g. 2.5 or -1.8"
    //               step="0.01"
    //               value={sensexChange}
    //               onChange={handleInputChange}
    //               className="w-full p-3 sm:p-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors"
    //               aria-describedby="sensexChangeHelp"
    //             />
    //             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
    //               %
    //             </span>
    //           </div>
    //           <p id="sensexChangeHelp" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
    //             Enter a positive or negative percentage (e.g., 2.5 or -1.8).
    //           </p>
    //         </div>

    //         {/* Results */}
    //         {result && (
    //           <div className="space-y-5">
    //             {/* Upside Card */}
    //             <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
    //               <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
    //                 <FiTrendingUp className="text-green-500 mr-2" size={20} />
    //                 Potential Upside
    //               </h3>
    //               <div className="space-y-3">
    //                 <ResultItem
    //                   label="Stock Change Range"
    //                   value={`${result.low.toFixed(2)}% to ${result.high.toFixed(2)}%`}
    //                   className="text-gray-700 dark:text-gray-300"
    //                 />
    //                 <ResultItem
    //                   label="Price Range"
    //                   value={`₹${result.priceLowRise.toFixed(2)} - ₹${result.priceHighRise.toFixed(2)}`}
    //                   highlight
    //                   className="text-gray-800 dark:text-gray-200 font-medium"
    //                 />
    //               </div>
    //             </div>

    //             {/* Downside Card */}
    //             <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
    //               <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
    //                 <FiTrendingDown className="text-red-500 mr-2" size={20} />
    //                 Potential Downside
    //               </h3>
    //               <div className="space-y-3">
    //                 <ResultItem
    //                   label="Stock Change Range"
    //                   value={`-${result.high.toFixed(2)}% to -${result.low.toFixed(2)}%`}
    //                   className="text-gray-700 dark:text-gray-300"
    //                 />
    //                 <ResultItem
    //                   label="Price Range"
    //                   value={`₹${result.priceLowFall.toFixed(2)} - ₹${result.priceHighFall.toFixed(2)}`}
    //                   highlight
    //                   className="text-gray-800 dark:text-gray-200 font-medium"
    //                 />
    //               </div>
    //             </div>

    //             {/* Note */}
    //             <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-sky-50 dark:bg-sky-900/30 rounded-lg">
    //               <p>
    //                 Note: Data dynamically fetched from backend based on{" "}
    //                 <strong className="text-gray-700 dark:text-gray-200">{symbol}</strong>{" "}
    //                 fundamentals. Results may vary based on real-time market and stock behavior.
    //               </p>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="flex justify-center items-start p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl relative">
        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-sky-600 to-indigo-700 p-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Sensex Impact Calculator
                </h2>
                <p className="text-sky-100 text-sm mt-1">
                  Estimate how Sensex changes affect individual stocks
                </p>
              </div>

              {/* Info + Rating Section */}
              <div className="flex items-center gap-1">
                {/* Rating Top-Right */}
                <div className="hidden sm:flex items-center gap-2 ">
                  {/* <span className="text-xs text-white font-medium">Rate this analysis:</span> */}
                  <RatingSystem
                    plotType="sensex_movement_corr_calculator"
                    onRatingUpdate={handleRatingUpdate}
                    className="flex items-center"
                    aria-label="Rate Sensex Impact Calculator"
                  />
                </div>

                {/* Info Button */}
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 rounded-full hover:bg-sky-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  aria-label={
                    showInfo ? "Hide information" : "Show information"
                  }
                >
                  <RiInformationLine size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
          {showInfo && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 sm:p-5 border-b border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <RiLightbulbFlashLine
                  className="text-amber-500 dark:text-amber-400 mt-1 flex-shrink-0"
                  size={20}
                />
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  This calculator estimates stock price movements based on
                  Sensex changes. Results are indicative and may vary based on
                  individual stock fundamentals.
                </p>
              </div>
            </div>
          )}

          {/* Input and Results Section */}
          <div className="p-5 sm:p-6 space-y-6">
            {/* Input Field */}
            <div>
              <label
                htmlFor="sensexChange"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Sensex Percentage Change
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="sensexChange"
                  placeholder="e.g. 2.5 or -1.8"
                  step="0.01"
                  value={sensexChange}
                  onChange={handleInputChange}
                  className="w-full p-3 sm:p-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors"
                  aria-describedby="sensexChangeHelp"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
              <p
                id="sensexChangeHelp"
                className="mt-1 text-xs text-gray-500 dark:text-gray-400"
              >
                Enter a positive or negative percentage (e.g., 2.5 or -1.8).
              </p>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-5">
                {/* Upside Card */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <FiTrendingUp className="text-green-500 mr-2" size={20} />
                    Potential Upside
                  </h3>
                  <div className="space-y-3">
                    <ResultItem
                      label="Stock Change Range"
                      value={`${result.low.toFixed(2)}% to ${result.high.toFixed(2)}%`}
                      className="text-gray-700 dark:text-gray-300"
                    />
                    <ResultItem
                      label="Price Range"
                      value={`₹${result.priceLowRise.toFixed(2)} - ₹${result.priceHighRise.toFixed(2)}`}
                      highlight
                      className="text-gray-800 dark:text-gray-200 font-medium"
                    />
                  </div>
                </div>

                {/* Downside Card */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <FiTrendingDown className="text-red-500 mr-2" size={20} />
                    Potential Downside
                  </h3>
                  <div className="space-y-3">
                    <ResultItem
                      label="Stock Change Range"
                      value={`-${result.high.toFixed(2)}% to -${result.low.toFixed(2)}%`}
                      className="text-gray-700 dark:text-gray-300"
                    />
                    <ResultItem
                      label="Price Range"
                      value={`₹${result.priceLowFall.toFixed(2)} - ₹${result.priceHighFall.toFixed(2)}`}
                      highlight
                      className="text-gray-800 dark:text-gray-200 font-medium"
                    />
                  </div>
                </div>

                {/* Note */}
                <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-sky-50 dark:bg-sky-900/30 rounded-lg">
                  <p>
                    Note: Data dynamically fetched from backend based on{" "}
                    <strong className="text-gray-700 dark:text-gray-200">
                      {symbol}
                    </strong>{" "}
                    fundamentals. Results may vary based on real-time market and
                    stock behavior.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ label, value, highlight = false }) => (
  <div className="flex justify-between">
    <span
      className={`text-sm ${highlight ? "font-medium text-gray-700" : "text-gray-600"}`}
    >
      {label}
    </span>
    <span
      className={`text-sm ${highlight ? "font-bold text-sky-600" : "font-medium text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

export default SensexCalculator;
