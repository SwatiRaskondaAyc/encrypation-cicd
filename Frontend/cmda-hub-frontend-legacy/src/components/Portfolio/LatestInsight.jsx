
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

// const LatestInsights = () => {
//   const [insights, setInsights] = useState({});
//   const [error, setError] = useState("");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const fetchLatestInsights = async () => {
//       const uploadId = localStorage.getItem("uploadId");
//       if (!uploadId) {
//         setError("Missing uploadId. Please upload a file first.");
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE}/api/file/latest_insights`,
//           new URLSearchParams({ uploadId })
//         );
//         console.log("LatestInsights Data:", response.data);
//         setInsights(response.data);
//       } catch (err) {
//         setError("Error fetching latest portfolio insights.");
//         console.error("Error:", err);
//       }
//     };
//     fetchLatestInsights();
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition-all">
//       <h2 className="text-center text-2xl font-bold mb-6 text-cyan-600 dark:text-cyan-300">
//         Latest Portfolio Insights
//         {insights.latest_date && (
//           <span className="block text-3xl mt-1 text-gray-800 dark:text-white">
//             {insights.latest_date}
//           </span>
//         )}
//       </h2>

//       {error && <p className="text-red-500 text-center">{error}</p>}

//       {Object.keys(insights).length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <InsightItem label="Current Value" value={insights.current_value} />
//           <InsightItem label="Deployed Amount" value={insights.deployed_amount} />
//           <InsightItem label="Percent Change" value={`${insights.percent_change}`} />
//           <InsightItem label="Brokerage Amount" value={insights.brokerage_amount} />
//           <PNLItem label="Unrealized PNL" value={insights.unrealized_pnl} />
//           <PNLItem label="Realized PNL" value={insights.realized_pnl} />
//         </div>
//       ) : (
//         <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
//           No insights available.
//         </p>
//       )}
//     </div>
//   );
// };

// // Utility: Returns text color class based on numeric value
// const getTextColorClass = (value) => {
//   if (value > 0) return "text-green-600 dark:text-green-400";
//   if (value < 0) return "text-red-600 dark:text-red-400";
//   // return "text-gray-600 dark:text-gray-300";
// };

// /** Component for Regular Insights */
// const InsightItem = ({ label, value }) => (
//   <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
//     <span className="text-gray-700 dark:text-gray-300 font-medium">{label}:</span>
//     <span className={`font-semibold ${getTextColorClass(Number(value))}`}>
//       {value}
//     </span>
//   </div>
// );

// /** Component for PNL Insights with background color + arrow */
// const PNLItem = ({ label, value }) => {
//   const isPositive = value > 0;
//   const percentageColor = isPositive ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800";

//   return (
//     <div
//       className={`flex justify-between items-center p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300
//         ${percentageColor}
//       `}
//     >
//       <span className="text-gray-700 dark:text-gray-300 font-medium">{label}:</span>
//       <span
//         className={`flex items-center gap-2 text-lg font-semibold ${getTextColorClass(Number(value))}`}
//       >
      
//         {value}
//       </span>
//     </div>
//   );
// };

// export default LatestInsights;







// -----------------before code-----------------


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
// import { useGraphData } from "./GraphDataContext";

// const LatestInsights = () => {
//   const [insights, setInsights] = useState({});
//   const [error, setError] = useState("");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const { getGraphData, setGraphData } = useGraphData();

//   useEffect(() => {
//     const fetchLatestInsights = async () => {
//       const uploadId = localStorage.getItem("uploadId");
//       const cacheKey = `latest_insights_${uploadId}`;

//       if (!uploadId) {
//         setError(" Please upload a file first.");
//         return;
//       }

//       // Check cache first
//       const cachedData = getGraphData(cacheKey);
//       if (cachedData) {
//         setInsights(cachedData);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE}/file/latest_insights`,
//           new URLSearchParams({ uploadId })
//         );

//         console.log("LatestInsights Data:", response.data);

//         setInsights(response.data);
//         // Cache the data
//         setGraphData(cacheKey, response.data);
//       } catch (err) {
//         setError("Error fetching latest portfolio insights.");
//         console.error("Error:", err);
//       }
//     };

//     fetchLatestInsights();
//   }, [getGraphData, setGraphData]);

//    return (
//     <div className="max-w-4xl mx-auto p-6 bg-white  dark:bg-gray-900 dark:border-gray-700 transition-all">
//       <h2 className="text-center text-2xl font-bold mb-6 text-cyan-600 dark:text-cyan-300">
//         Latest Portfolio Insights
//         {insights.latest_date && (
//           <span className="block text-3xl mt-1 text-gray-800 dark:text-white">
//             {insights.latest_date}
//           </span>
//         )}
//       </h2>

//       {error && <p className="text-red-500 text-center">{error}</p>}

//       {Object.keys(insights).length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <InsightItem label="Current Value" value={insights.current_value} />
//           <InsightItem label="Deployed Amount" value={insights.deployed_amount} />
//           {/* <InsightItem label="Percent Change" value={`${insights.percent_change.toFixed(2)}%`} /> */}
//          <InsightItem 
//             label="Percent Change" 
//             value={`${Math.round((insights.percent_change || 0) * 100) / 100}%`} 
//           />
//           <InsightItem label="Brokerage Amount" value={insights.brokerage_amount} />
//           <PNLItem label="Unrealized PNL" value={insights.unrealized_pnl} />
//           <PNLItem label="Realized PNL" value={insights.realized_pnl} />
//         </div>
//       ) : (
//         <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
//           No insights available.
//         </p>
//       )}
//     </div>
//   );
// };

// // Utility: Returns text color class based on numeric value
// const getTextColorClass = (value) => {
//   if (value > 0) return "text-green-600 dark:text-green-400";
//   if (value < 0) return "text-red-600 dark:text-red-400";
//   // return "text-gray-600 dark:text-gray-300";
// };

// // Component for Regular Insights
// const InsightItem = ({ label, value }) => (
//   <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
//     <span className="text-gray-700 dark:text-gray-300 font-medium">{label}:</span>
//     <span className={`font-semibold ${getTextColorClass(Number(value))}`}>
//       {value}
//     </span>
//   </div>
// );


// // Component for PNL Insights with background color + arrow
// const PNLItem = ({ label, value }) => {
//   const isPositive = value > 0;
//   const percentageColor = isPositive ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800";

//   return (
//     <div
//       className={`flex justify-between items-center p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300
//         ${percentageColor}
//       `}
//     >
//       <span className="text-gray-700 dark:text-gray-300 font-medium">{label}:</span>
//       <span
//         className={`flex items-center gap-2 text-lg font-semibold ${getTextColorClass(Number(value))}`}
//       >
      
//         {value}
//       </span>
//     </div>
//   );
// };


// export default LatestInsights;











import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { useGraphData } from "./GraphDataContext";

const LatestInsights = () => {
  const [insights, setInsights] = useState({});
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const { getGraphData, setGraphData } = useGraphData();

  useEffect(() => {
    const fetchLatestInsights = async () => {
      const uploadId = localStorage.getItem("uploadId");
      const cacheKey = `latest_insights_${uploadId}`;

      if (!uploadId) {
        setError(" Please upload a file first.");
        return;
      }

      // Check cache first
      const cachedData = getGraphData(cacheKey);
      if (cachedData) {
        setInsights(cachedData);
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE}/file/latest_insights`,
          new URLSearchParams({ uploadId })
        );

        // console.log("LatestInsights Data:", response.data);

        setInsights(response.data);
        // Cache the data
        setGraphData(cacheKey, response.data);
      } catch (err) {
        setError("Error fetching latest portfolio insights.");
        console.error("Error:", err);
      }
    };

    fetchLatestInsights();
  }, [getGraphData, setGraphData]);

   return (
    <div className="max-w-4xl mx-auto p-6 bg-white  dark:bg-gray-900 dark:text-white dark:border-gray-700 transition-all">
      <h2 className="text-center text-2xl font-bold mb-6 text-cyan-600 dark:text-cyan-300">
        Latest Portfolio Insights
        {insights.latest_date && (
          <span className="block text-3xl mt-1 text-gray-800 dark:text-white">
            {insights.latest_date}
          </span>
        )}
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {Object.keys(insights).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InsightItem label="Current Value" className='bg-white  dark:bg-gray-900 dark:text-white dark:border-gray-700 ' value={insights.current_value} />
          <InsightItem label="Deployed Amount" className='bg-white  dark:bg-gray-900 dark:text-white dark:border-gray-700 ' value={insights.deployed_amount} />
          {/* <InsightItem label="Percent Change" value={`${insights.percent_change.toFixed(2)}%`} /> */}
         <InsightItem 
            label="Percent Change" 
            value={`${Math.round((insights.percent_change || 0) * 100) / 100}%`} 
            className='bg-white  dark:bg-gray-900 dark:text-white dark:border-gray-700 '
          />
          <InsightItem label="Brokerage Amount" className='bg-white  dark:bg-gray-900 dark:text-white dark:border-gray-700 ' 
          value={insights.brokerage_amount} />
          <PNLItem label="Unrealized PNL" className='bg-white  dark:bg-gray-900 dark:text-white dark:border-gray-700 ' value={insights.unrealized_pnl} />
          <PNLItem label="Realized PNL" className='bg-white  dark:bg-gray-900 dark:text-white dark:border-gray-700 ' value={insights.realized_pnl} />
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          No insights available.
        </p>
      )}
    </div>
  );
};

// Utility: Returns text color class based on numeric value
const getTextColorClass = (value) => {
  if (value > 0) return "text-green-600 dark:text-green-400";
  if (value < 0) return "text-red-600 dark:text-red-400";
  // return "text-gray-600 dark:text-gray-300";
};

// Component for Regular Insights
const InsightItem = ({ label, value }) => (
<div className="flex justify-between items-center p-4 bg-gray-100 dark:text-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
    <span className="text-gray-700 dark:text-white font-medium">{label}:</span>
    <span className={`font-semibold ${getTextColorClass(Number(value))}`}>
      {value}
    </span>
  </div>
);


// Component for PNL Insights with background color + arrow
const PNLItem = ({ label, value }) => {
  const isPositive = value > 0;
  const percentageColor = isPositive ? "bg-green-100 dark:bg-green-900 dark:text-white" : "bg-gray-100 dark:bg-gray-800 dark:text-white";

  return (
    <div
      className={`flex justify-between items-center p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300
        ${percentageColor}
      `}
    >
      <span className="text-gray-700 dark:text-gray-300 font-medium">{label}:</span>
      <span
        className={`flex items-center gap-2 text-lg font-semibold dark:text-white ${getTextColorClass(Number(value))}`}
      >
      
        {value}
      </span>
    </div>
  );
};


export default LatestInsights;