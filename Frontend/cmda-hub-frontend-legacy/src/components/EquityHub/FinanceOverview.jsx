// import React, { useEffect, useState } from "react";
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// } from "recharts";

// const FinanceOverview = ({ symbol, API_BASE, mainTab }) => {
//   const [data, setData] = useState([]);
//   const [selectedMetric, setSelectedMetric] = useState("Revenue");

//   const COLORS = {
//     Revenue: "#8884d8",
//     EPS: "#82ca9d",
//     ROE: "#ffc658",
//   };

//   useEffect(() => {
//     if (!symbol) return;

//     const endpoint =
//       mainTab === "consolidated"
//         ? `${API_BASE}/consolidate/overview/${symbol}`
//         : `${API_BASE}/financial/fin_ov/${symbol}`;

//     fetch(endpoint)
//       .then((res) => res.json())
//       .then((json) => {
//         const formatted = json.map(item => ({
//           ...item,
//           Year: item.Year_end?.toString().slice(0, 4)
//         }));
//         setData(formatted);
//       })
//       .catch(err => console.error("Error loading financial overview:", err));
//   }, [symbol, API_BASE, mainTab]);

//   return (
//     <div style={{ width: "100%", height: 420, padding: "20px" }}>
//       <h3 style={{ textAlign: "center" }}>{symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Overview</h3>

//       <div style={{ textAlign: "center", marginBottom: "20px" }}>
//         <label htmlFor="metric" style={{ marginRight: "10px", fontWeight: "bold" }}>
//           Select Metric:
//         </label>
//         <select
//           id="metric"
//           value={selectedMetric}
//           onChange={(e) => setSelectedMetric(e.target.value)}
//           style={{ padding: "6px 12px", borderRadius: "6px" }}
//         >
//           <option value="Revenue">Revenue</option>
//           <option value="EPS">EPS</option>
//           <option value="ROE">ROE</option>
//         </select>
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <AreaChart
//           data={data}
//           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//         >
//           <defs>
//             <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor={COLORS[selectedMetric]} stopOpacity={0.8} />
//               <stop offset="95%" stopColor={COLORS[selectedMetric]} stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <XAxis dataKey="Year" />
//           <YAxis />
//           <CartesianGrid strokeDasharray="3 3" />
//           <Tooltip formatter={(value) => value?.toLocaleString?.()} />
//           <Area
//             type="monotone"
//             dataKey={selectedMetric}
//             stroke={COLORS[selectedMetric]}
//             fillOpacity={1}
//             fill="url(#metricGradient)"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default FinanceOverview;




// import React, { useEffect, useState } from "react";
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// } from "recharts";
// import FinancialRatingSystem from "../RatingFile /FinancialRatingSystem"

// const FinanceOverview = ({ symbol, API_BASE, mainTab }) => {
//   const [data, setData] = useState([]);
//   const [selectedMetric, setSelectedMetric] = useState("Revenue");

//   const COLORS = {
//     Revenue: "#8884d8",
//     EPS: "#82ca9d",
//     ROE: "#ffc658",
//   };

//   useEffect(() => {
//     if (!symbol) return;

//     const endpoint =
//       mainTab === "consolidated"
//         ? `${API_BASE}/consolidate/overview/${symbol}`
//         : `${API_BASE}/financial/fin_ov/${symbol}`;

//     fetch(endpoint)
//       .then((res) => res.json())
//       .then((json) => {
//         const formatted = json.map(item => ({
//           ...item,
//           Year: item.Year_end?.toString().slice(0, 4)
//         }));
//         setData(formatted);
//       })
//       .catch(err => console.error("Error loading financial overview:", err));
//   }, [symbol, API_BASE, mainTab]);

//   return (
//     <div style={{ width: "100%", height: 420, padding: "5px" }}>
//       <div className="w-80 bg-white dark:bg-slate-800 ">
//         <FinancialRatingSystem plotType="financial_overview" mainTab={mainTab} />
//       </div>
//       <h3 style={{ textAlign: "center" }}>{symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Overview</h3>
//       {/* <div style={{ marginTop: "20px" }}>
//         <FinancialRatingSystem plotType={`${symbol}_${mainTab}_overview`} />
//       </div> */}

//       <div style={{ textAlign: "center", marginBottom: "20px" }}>
//         <label htmlFor="metric" style={{ marginRight: "10px", fontWeight: "bold" }}>
//           Select Metric:
//         </label>
//         <select
//           id="metric"
//           value={selectedMetric}
//           onChange={(e) => setSelectedMetric(e.target.value)}
//           style={{ padding: "6px 12px", borderRadius: "6px" }}
//         >
//           <option value="Revenue">Revenue</option>
//           <option value="EPS">EPS</option>
//           <option value="ROE">ROE</option>
//         </select>
//       </div>

//       <ResponsiveContainer width="100%" height={300}>
//         <AreaChart
//           data={data}
//           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//         >
//           <defs>
//             <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor={COLORS[selectedMetric]} stopOpacity={0.8} />
//               <stop offset="95%" stopColor={COLORS[selectedMetric]} stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <XAxis dataKey="Year" />
//           <YAxis />
//           <CartesianGrid strokeDasharray="3 3" />
//           <Tooltip formatter={(value) => value?.toLocaleString?.()} />
//           <Area
//             type="monotone"
//             dataKey={selectedMetric}
//             stroke={COLORS[selectedMetric]}
//             fillOpacity={1}
//             fill="url(#metricGradient)"
//           />
//         </AreaChart>
//       </ResponsiveContainer>


//     </div>
//   );
// };

// export default FinanceOverview;

import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import FinancialRatingSystem from "../RatingFile/FinancialRatingSystem";

const FinanceOverview = ({ symbol, API_BASE, mainTab }) => {
  const [data, setData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("Revenue");

  const COLORS = {
    Revenue: "#8884d8",
    EPS: "#82ca9d",
    ROE: "#ffc658",
  };

  useEffect(() => {
    if (!symbol) return;

    const endpoint =
      mainTab === "consolidated"
        ? `${API_BASE}/consolidate/overview/${symbol}`
        : `${API_BASE}/financial/fin_ov/${symbol}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((json) => {
        const formatted = json.map(item => ({
          ...item,
          Year: item.Year_end?.toString().slice(0, 4)
        }));
        setData(formatted);
      })
      .catch(err => console.error("FinanceOverview: Error loading financial overview:", err));
  }, [symbol, API_BASE, mainTab]);

  return (
        <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f7f9fc' }}>


          <div >


        {/* Right side - FinancialRatingSystem */}
        <div style={{ width: "300px", marginTop: "5px" }}>
         <FinancialRatingSystem plotType="financial_overview" />
        </div>
      </div>

      {/* <div className="w-[320px] mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
        <FinancialRatingSystem plotType="financial_overview" />
      </div> */}
      <h3 style={{ textAlign: "center" }}>{symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Overview</h3>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label htmlFor="metric" style={{ marginRight: "10px", fontWeight: "bold" }}>
          Select Metric:
        </label>
        <select
          id="metric"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          style={{ padding: "6px 12px", borderRadius: "6px" }}
        >
          <option value="Revenue">Revenue</option>
          <option value="EPS">EPS</option>
          <option value="ROE">ROE</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[selectedMetric]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLORS[selectedMetric]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="Year" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value) => value?.toLocaleString?.()} />
          <Area
            type="monotone"
            dataKey={selectedMetric}
            stroke={COLORS[selectedMetric]}
            fillOpacity={1}
            fill="url(#metricGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceOverview;