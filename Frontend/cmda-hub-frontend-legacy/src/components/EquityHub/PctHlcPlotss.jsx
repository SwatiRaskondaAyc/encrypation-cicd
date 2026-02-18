// import React, { useState, useEffect } from "react";
// import Plot from "react-plotly.js";

// const PctHlcPlot = ({symbol}) => {
//   const [plotData, setPlotData] = useState(null);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  
//   useEffect(() => {
//      if (symbol) {
//       //  fetch("http://192.168.1.250:8080/CMDA-3.3.9/api/stocks/pct_hlc_plot", {
//         fetch(`${API_BASE}/api/stocks/pct_hlc_plot`, {

//          method: "POST",
//          headers: {
//            "Content-Type": "application/json",
//          },
//          body: JSON.stringify({ symbol }),
//        })
//          .then((response) => response.json())
//          .then((data) => setPlotData(data))
//          .catch((error) => console.error("Error fetching plot data:", error));
//      }
//    }, [symbol]);

//   const handlePlayVoice = () => {
//     if (plotData && plotData.comment) {
//       const utterance = new SpeechSynthesisUtterance(plotData.comment);
//       utterance.onstart = () => setIsSpeaking(true);
//       utterance.onend = () => setIsSpeaking(false);
//       speechSynthesis.speak(utterance);
//     }
//   };

//   if (!plotData) {
//     return <span className="loading loading-bars loading-lg">Pct_hlc_plot...</span>;
//   }

//   const { scatter_data, layout, comment } = plotData;

//   return (
//     <div>
//       <h2>Percentage High/Low to Close Plot</h2>
//       <Plot
//         data={scatter_data}
//         layout={layout}
//       />
//       <p>{comment}</p>
//       <button onClick={handlePlayVoice} disabled={isSpeaking}>
//         {isSpeaking ? "Speaking..." : "Play Voice"}
//       </button>
//     </div>
//   );
// };

// export default PctHlcPlot;


import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";

const PctHlcPlot = ({ symbol }) => {
  const [plotData, setPlotData] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
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

  useEffect(() => {
    if (!symbol) return;

    const cacheKey = `pct_hlc_plot_${symbol}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setPlotData(cachedData);
      return;
    }

    fetch(`${API_BASE}/api/stocks/pct_hlc_plot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ symbol }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPlotData(data);
        setCachedData(cacheKey, data);
      })
      .catch((error) => console.error("Error fetching plot data:", error));
  }, [symbol]);

  const handlePlayVoice = () => {
    if (plotData && plotData.comment) {
      const utterance = new SpeechSynthesisUtterance(plotData.comment);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  if (!plotData) {
    return  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <HashLoader color="#0369a1" size={60} />
      <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
        CMDA...
      </p>
    </div>;
  }

  const { scatter_data, layout, comment } = plotData;

  return (
    <div>
      <h2>Percentage High/Low to Close Plot</h2>
      <Plot
        data={scatter_data}
        layout={layout}
      />
      <p>{comment}</p>
      <button onClick={handlePlayVoice} disabled={isSpeaking}>
        {isSpeaking ? "Speaking..." : "Play Voice"}
      </button>
    </div>
  );
};

export default PctHlcPlot;