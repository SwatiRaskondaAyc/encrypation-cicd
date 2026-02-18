import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import RatingSystem from "../RatingFile/RatingSystem";
import { HashLoader } from "react-spinners";
import { generatePlot } from "../../services/mtmApi";

const CandleBreach = ({ symbol }) => {
  const [plotData, setPlotData] = useState(null);

  const [config, setConfig] = useState({});
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  const getCachedData = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  };

  const setCachedData = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  const handleRatingUpdate = (newRating) => {
    console.log("Box Plot Data rating updated:", newRating);
  };
  useEffect(() => {
    if (!symbol) return;

    const cacheKey = `candle_breach_${symbol}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setPlotData(cachedData.figure);
      setConfig(cachedData.config || {});
      return;
    }

    // Use MTM API service
    generatePlot(symbol, "breach_busters")
      .then((data) => {
        setPlotData(data.figure);
        setConfig(data.config || {});
        setCachedData(cacheKey, data);
      })
      .catch((err) => console.error("Error fetching plot data:", err));
  }, [symbol]);

  if (!plotData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }

  const layout = {
    autosize: true,
    responsive: true,
    margin: { t: 50, l: 50, r: 30, b: 50 },
  };

  //   return (
  //     <div className="space-y-6">
  //       <Plot
  //         data={plotData.data}
  //         layout={{
  //           ...layout,
  //           autosize: true,
  //           responsive: true,
  //           margin: { t: 50, l: 50, r: 30, b: 50 },
  //         }}
  //         useResizeHandler={true}
  //         style={{ width: "100%", height: "100%" }}
  //         config={config}
  //       />

  //     </div>
  //   );
  // };

  return (
    <div className="space-y-4">
      {/* Reusable Rating Component */}
      <div className="flex items-center justify-end pb-4 border-b border-gray-200">
        <div className="text-right">
          {/* <p className="text-sm font-medium text-gray-700 mb-2"></p> */}
          <RatingSystem
            plotType="breach_busters"
            onRatingUpdate={handleRatingUpdate}
          />
        </div>
      </div>
      <Plot
        data={plotData.data}
        layout={{
          ...(plotData.layout || {}),
          autosize: true,
          responsive: true,
          margin: { t: 100, l: 50, r: 30, b: 50 },
          height: 600,
        }}
        useResizeHandler={true}
        style={{ width: "100%", minHeight: "600px" }}
        config={{
          responsive: true,
          ...(config || {}),
        }}
      />
    </div>
  );
};

export default CandleBreach;
