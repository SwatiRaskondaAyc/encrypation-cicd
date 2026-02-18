// import React, { useEffect, useState } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";

// const BalanceSheet = ({ symbol, API_BASE, mainTab }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     if (!symbol) return;

//     const endpoint =
//       mainTab === "consolidated"
//         ? `${API_BASE}/consolidate/balance_sheet/${symbol}`
//         : `${API_BASE}/financial/balance_sheet/${symbol}`;

//     fetch(endpoint)
//       .then((res) => res.json())
//       .then((json) => {
//         const formatted = json.map((item) => ({
//           ...item,
//           Year: item.Year_end.toString().slice(0, 4),
//         }));
//         setData(formatted);
//       })
//       .catch((err) => console.error("Balance Sheet error:", err));
//   }, [symbol, API_BASE, mainTab]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h3 style={{ textAlign: "center" }}>{symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Balance Sheet</h3>

//       <div style={{ overflowX: "auto", marginTop: "20px" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
//           <thead style={{ backgroundColor: "#f2f2f2" }}>
//             <tr>
//               <th>Year</th>
//               <th>Share Capital</th>
//               <th>Reserve</th>
//               <th>Current Liability</th>
//               <th>Current Assets</th>
//               <th>Total Liabilities</th>
//               <th>Contingent Liabilities</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, idx) => (
//               <tr key={idx} style={{ borderBottom: "1px solid #ccc" }}>
//                 <td>{row.Year}</td>
//                 <td>₹{row.Share_Capital?.toLocaleString()}</td>
//                 <td>₹{row.Reserve?.toLocaleString()}</td>
//                 <td>₹{row.Current_Liability?.toLocaleString()}</td>
//                 <td>₹{row.Current_Assets?.toLocaleString()}</td>
//                 <td>₹{row.Total_Liabilities?.toLocaleString()}</td>
//                 <td>₹{row.Contingent_liabilities?.toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{ width: "100%", height: 400, marginTop: "40px" }}>
//         <ResponsiveContainer>
//           <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="Year" />
//             <YAxis />
//             <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
//             <Legend />
//             <Bar dataKey="Share_Capital" stackId="a" fill="#8884d8" />
//             <Bar dataKey="Reserve" stackId="a" fill="#82ca9d" />
//             <Bar dataKey="Current_Liability" stackId="a" fill="#ffc658" />
//             <Bar dataKey="Current_Assets" stackId="b" fill="#ff8042" name="Current Assets" />
//             <Bar dataKey="Total_Liabilities" stackId="c" fill="#a4de6c" name="Total Liabilities" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BalanceSheet;


import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import FinancialRatingSystem from "../RatingFile/FinancialRatingSystem";

const BalanceSheet = ({ symbol, API_BASE, mainTab }) => {
  const [data, setData] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (!symbol) return;

    const endpoint =
      mainTab === "consolidated"
        ? `${API_BASE}/consolidate/balance_sheet/${symbol}`
        : `${API_BASE}/financial/balance_sheet/${symbol}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((json) => {
        const formatted = json.map((item) => ({
          ...item,
          Year: item.Year_end.toString().slice(0, 4),
        }));
        setData(formatted);
      })
      .catch((err) => console.error("Balance Sheet error:", err));
  }, [symbol, API_BASE, mainTab]);

  const toggleSort = () => {
    setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedData = [...data].sort((a, b) => {
    const yearA = parseInt(a.Year);
    const yearB = parseInt(b.Year);
    return sortDirection === "asc" ? yearA - yearB : yearB - yearA;
  });

  const sortArrow = sortDirection === "asc" ? "↑" : "↓";

  return (
    <div style={{ padding: "24px", fontFamily: "Segoe UI, sans-serif" }}>
      <div >


        {/* Right side - FinancialRatingSystem */}
        <div style={{ width: "300px", marginTop: "5px" }}>
          <FinancialRatingSystem plotType="balance_sheet" mainTab={mainTab} />
        </div>
      </div>
      <h2 style={{ textAlign: "center", fontWeight: 600, marginBottom: "24px" }}>
        {symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Balance Sheet
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
          textAlign: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}>
          <thead style={{ backgroundColor: "#f9fafb" }} className="dark:bg-slate-800 dark:text-white">
            <tr style={{ borderBottom: "1px solid #ddd" }} className="dark:bg-slate-800 dark:text-white">
              <th onClick={toggleSort} style={{ cursor: "pointer", padding: "12px", fontWeight: 600 }} className="dark:bg-slate-800 dark:text-white">
                Year {sortArrow}
              </th>
              <th className="dark:bg-slate-800 dark:text-white">Share Capital</th>
              <th className="dark:bg-slate-800 dark:text-white">Reserve</th>
              <th className="dark:bg-slate-800 dark:text-white">Current Liability</th>
              <th className="dark:bg-slate-800 dark:text-white">Current Assets</th>
              <th className="dark:bg-slate-800 dark:text-white">Total Liabilities</th>
              <th className="dark:bg-slate-800 dark:text-white">Contingent Liabilities</th>
            </tr>
          </thead>
          <tbody className="dark:bg-slate-800 dark:text-white">
            {sortedData.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#fff" : "#f7f9fa",
                  borderBottom: "1px solid #eee"
                }}
                className="dark:bg-slate-800 dark:text-white"
              >
                <td style={{ padding: "10px" }} className="dark:bg-slate-800 dark:text-white">{row.Year}</td>
                <td className="dark:bg-slate-800 dark:text-white">₹{row.Share_Capital?.toLocaleString() ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">₹{row.Reserve?.toLocaleString() ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">₹{row.Current_Liability?.toLocaleString() ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">₹{row.Current_Assets?.toLocaleString() ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">₹{row.Total_Liabilities?.toLocaleString() ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">₹{row.Contingent_liabilities?.toLocaleString() ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ width: "100%", height: 400, marginTop: "40px" }}>
        <ResponsiveContainer>
          <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Year" />
            <YAxis />
            <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Share_Capital" stackId="a" fill="#8884d8" />
            <Bar dataKey="Reserve" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Current_Liability" stackId="a" fill="#ffc658" />
            <Bar dataKey="Current_Assets" stackId="b" fill="#ff8042" name="Current Assets" />
            <Bar dataKey="Total_Liabilities" stackId="c" fill="#a4de6c" name="Total Liabilities" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceSheet;
