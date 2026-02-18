
import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { useGraphData } from "./GraphDataContext";
import { HashLoader } from "react-spinners";

const ClassifyStockRisk = () => {
  const [graphData, setLocalGraphData] = useState(null); // Renamed to avoid conflict
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const { getGraphData, setGraphData } = useGraphData();

  useEffect(() => {
    const fetchGraphData = async () => {
      const uploadId = localStorage.getItem("uploadId");
      const cacheKey = `classify_stock_risk_${uploadId}`;

      if (!uploadId) {
        setError(" Please upload a file first.");
        return;
      }

      // Check cache first
      const cachedData = getGraphData(cacheKey);
      if (cachedData) {
        setLocalGraphData(cachedData);
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE}/file/classify_stocks_risk_return`,
          new URLSearchParams({ uploadId })
        );

        console.log("ClassifyStockRisk Graph Data:", response.data);

        if (!response.data || !response.data.figure) {
          setError("Graph generation failed. Please check the data or try again.");
          return;
        }

        const convertedData = response.data.figure.data.map((trace) => ({
          ...trace,
          y: Array.isArray(trace.y)
            ? trace.y.map((value) => {
                const numValue = parseFloat(value);
                return isNaN(numValue) ? 0 : numValue;
              })
            : trace.y,
        }));

        const figure = {
          data: convertedData,
          layout: {
            ...response.data.figure.layout,
            autosize: true,
          },
        };

        setLocalGraphData(figure);
        // Cache the data
        setGraphData(cacheKey, figure);
      } catch (err) {
        setError("Graph generation failed. Please check the data or try again.");
        console.error("Graph ClassifyStockRisk API Error:", err.response ? err.response.data : err.message);
      }
    };

    fetchGraphData();
  }, [getGraphData, setGraphData]);

  return (
    <div>
  {!graphData ? (
     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <HashLoader color="#0369a1" size={60} />
      <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
       CMDA...
      </p>
    </div>
  ) : (
    <>
      {error && <p className="text-red-500">{error}</p>}
      {graphData && graphData.data && graphData.layout && (
        <Plot
          data={graphData.data}
          layout={{
            ...graphData.layout,
            autosize: true,
            responsive: true,
            title: graphData.layout?.title || "Graph Title",
            margin: { t: 50, l: 50, r: 30, b: 50 },
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
          config={{
            responsive: true,
            displaylogo: false,
            ...(graphData?.config || {}),
          }}
        />
      )}
    </>
  )}
</div>
  );
};

export default ClassifyStockRisk;