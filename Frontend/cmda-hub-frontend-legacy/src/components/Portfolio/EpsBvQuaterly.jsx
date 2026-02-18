// import React, { useEffect, useState } from 'react';
// import Plot from 'react-plotly.js';
// import axios from 'axios';

// const EPSQuarterlyChart = ({ userId, platform }) => {
//   const [graphData, setGraphData] = useState([]);
//   const [layout, setLayout] = useState({});
//   const [config, setConfig] = useState({});
//   const [error, setError] = useState('');
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const fetchEPSData = async () => {
//       const uploadId = localStorage.getItem("uploadId");

//       if (!uploadId) {
//         setError("Missing uploadId. Please upload a file first.");
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE}/api/file/plot_portfolio_eps_bv_quarterly_all_entries`,
//           new URLSearchParams({ uploadId })
//         );

//         console.log("Full response from backend:", response.data);

//         const { figure, config } = response.data;

//         if (!figure || !Array.isArray(figure.data) || typeof figure.layout !== 'object') {
//           throw new Error('Invalid response format');
//         }

//         setGraphData(figure.data);
//         setLayout(figure.layout);
//         setConfig({
//           ...config,
//           displaylogo: false,
//           displayModeBar: false,
//           responsive: true
//         });
//         setError('');
//       } catch (err) {
//         console.error('Graph generation failed:', err);
//         setError('Graph generation failed: Invalid response format.');
//       }
//     };

//     fetchEPSData();
//   }, [userId, platform]);

//   return (
//     <div>
//       {error ? (
//         <p style={{ color: 'red' }}>{error}</p>
//       ) : (
//         <Plot
//           data={graphData}
//           layout={{
//             ...layout,
//             autosize: true,
//             responsive: true,
//             title: layout?.title || 'EPS Quarterly Data',
//             margin: { t: 50, l: 50, r: 30, b: 50 },
//           }}
//           useResizeHandler={true}
//           style={{ width: '100%', height: '100%' }}
//           config={config}
//         />
//       )}
//     </div>
//   );
// };

// export default EPSQuarterlyChart;

import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { useGraphData } from './GraphDataContext';
import { HashLoader } from 'react-spinners';

const EPSQuarterlyChart = ({ userId,platform }) => {
  const [graphData, setLocalGraphData] = useState([]);
  const [layout, setLayout] = useState(null);
  const [config, setConfig] = useState({});
  const [error, setError] = useState('');
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const { getGraphData, setGraphData } = useGraphData();

  useEffect(() => {
    const fetchEPSData = async () => {
      const uploadId = localStorage.getItem("uploadId");
      const cacheKey = `eps_quarterly_${uploadId}_${userId}_${platform}`;

      if (!uploadId) {
        setError("Please upload a file first.");
        return;
      }

      // Check cache first
      const cachedData = getGraphData(cacheKey);
      if (cachedData) {
        setLocalGraphData(cachedData.data || []);
        setLayout(cachedData.layout || {});
        setConfig(cachedData.config || {});
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE}/file/plot_portfolio_eps_bv_quarterly_all_entries`,
          new URLSearchParams({ uploadId })
        );

        console.log("EPS QuarterlyChart Data:", response.data);

        // Handle both response structures
        let data, layout, config;
        if (response.data.figure) {
          // Expected structure: { figure: { data: [], layout: {} }, config: {} }
          ({ figure: { data, layout }, config } = response.data);
        } else {
          // Actual structure: { data: [], layout: {} }
          ({ data, layout, config } = response.data);
        }

        if (!data || !Array.isArray(data) || typeof layout !== 'object') {
          console.error("Invalid response structure:", response.data);
          throw new Error('Invalid data or layout format from server');
        }

        const newConfig = {
          ...(config || {}),
          displaylogo: false,
          displayModeBar: false,
          responsive: true,
        };

        setLocalGraphData(data);
        setLayout(layout);
        setConfig(newConfig);
        setError('');
        // Cache the data
        setGraphData(cacheKey, { data, layout: layout, config: newConfig });
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
        console.error('Graph EPS QuarterlyChart Error:', errorMsg, err.response?.data);
        setError(`Graph generation failed: ${errorMsg}`);
      }
    };

    fetchEPSData();
  }, [userId, platform, getGraphData, setGraphData]);

  return (
    <div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : graphData.length === 0 && !layout ? (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <HashLoader color="#0369a1" size={60} />
      <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
        CMDA...
      </p>
    </div>

    



      ) : (
        <Plot
          data={graphData}
          layout={{
            ...(layout || {}),
            autosize: true,
            responsive: true,
            title: layout?.title || 'EPS Quarterly Data',
            margin: { t: 50, l: 50, r: 30, b: 50 },
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={config}
        />
      )}
    </div>
  );
};

export default EPSQuarterlyChart;