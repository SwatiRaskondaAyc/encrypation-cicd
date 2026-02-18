// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Plot from "react-plotly.js";

// const UserSunburstDrop = () => {
//     const [graphData, setGraphData] = useState(null);
//     const [error, setError] = useState("");
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     useEffect(() => {
//             // if (!uploadId) return;
//         const fetchGraphData = async () => {
//             const uploadId = localStorage.getItem("uploadId"); // ✅ Get from localStorage or props

//             if (!uploadId) {
//                 setError("Missing uploadId. Please upload a file first.");
//                 return;
//             }

//             try {
//                 // const response = await axios.post("http://localhost:8080/api/file/create_user_sunburst_with_dropdown");
//                 const response = await axios.post(`${API_BASE}/api/file/create_user_sunburst_with_dropdown`,
//                     new URLSearchParams({ uploadId }), // use form format
//                );
//                 console.log("UserSunburstDrop Data:", response.data); // Log response
//                 if (!response.data || !response.data.figure) {
//                     setError("Graph generation failed: Invalid response format.");
//                     return;
//                 }
//                 setGraphData(response.data.figure);
//             } catch (err) {
//                 setError("Error fetching graph data.");
//                 console.error("Graph UserSunburstDrop API Error:", err.response ? err.response.data : err.message);
//             }
//         };
//         fetchGraphData();
//     }, []);
//  const config = graphData?.config;
//     return (
//         <div className="w-full flex justify-center items-center">
//             {error && <p className="text-red-500">{error}</p>}
//             {graphData && graphData.data && graphData.layout && (
//                  <Plot
//                                  data={graphData.data}
//                                  layout={{
//                                    ...graphData.layout,
//                                    autosize: true,
//                                    responsive: true,
//                                    title: graphData.layout?.title || 'Graph Title',
//                                    margin: { t: 50, l: 50, r: 30, b: 50 },
//                                  }}
//                                  useResizeHandler={true}
//                                  style={{ width: '100%', height: '100%' }}
//                                     config={{
//   responsive: true,
//   displaylogo: false, // ⛔ Hides the Plotly logo
//   ...(graphData?.config || {}),
// }}
//                                />
//             )}
//         </div>
//     );
// };

// export default UserSunburstDrop;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { useGraphData } from "./GraphDataContext";
import { HashLoader } from "react-spinners";

const UserSunburstDrop = () => {
  const [graphData, setLocalGraphData] = useState(null); // Renamed to avoid conflict
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const { getGraphData, setGraphData } = useGraphData();

  useEffect(() => {
    const fetchGraphData = async () => {
      const uploadId = localStorage.getItem("uploadId");
      const cacheKey = `user_sunburst_dropdown_${uploadId}`;

      if (!uploadId) {
        setError("Please upload a file first.");
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
          `${API_BASE}/file/create_user_sunburst_with_dropdown`,
          new URLSearchParams({ uploadId })
        );

        console.log("UserSunburstDrop Data:", response.data);

        if (!response.data || !response.data.figure) {
          setError("Graph generation failed. Please check the data or try again.");
          return;
        }

        setLocalGraphData(response.data.figure);
        // Cache the data
        setGraphData(cacheKey, response.data.figure);
      } catch (err) {
        setError("Graph generation failed. Please check the data or try again");
        console.error("Graph UserSunburstDrop API Error:", err.response ? err.response.data : err.message);
      }
    };

    fetchGraphData();
  }, [getGraphData, setGraphData]);

  return (
    <div className="w-full flex justify-center items-center">
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
                title: graphData.layout?.title || 'User Sunburst with Dropdown',
                margin: { t: 50, l: 50, r: 30, b: 50 },
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
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

export default UserSunburstDrop;