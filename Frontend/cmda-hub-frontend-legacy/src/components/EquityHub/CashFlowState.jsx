// import React, { useEffect, useState } from "react";
// import {
//   ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";

// const CashFlowState = ({ symbol, API_BASE, mainTab }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     if (!symbol) return;

//     const endpoint =
//       mainTab === "consolidated"
//         ? `${API_BASE}/consolidate/CashFlow_state/${symbol}`
//         : `${API_BASE}/financial/CashFlow_state/${symbol}`;

//     fetch(endpoint)
//       .then((res) => res.json())
//       .then((json) => {
//         const formatted = json.map((item) => ({
//           ...item,
//           Year: item.Year_end.toString().slice(0, 4),
//         }));
//         setData(formatted);
//       })
//       .catch((err) => console.error("Cash Flow error:", err));
//   }, [symbol, API_BASE, mainTab]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h3 style={{ textAlign: "center" }}>{symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Cash Flow</h3>

//       <div style={{ overflowX: "auto", marginTop: "20px" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
//           <thead style={{ backgroundColor: "#f2f2f2" }}>
//             <tr>
//               <th>Year</th>
//               <th>Operating Activities</th>
//               <th>Investing Activities</th>
//               <th>Financing Activities</th>
//               <th>Net Cash Flow</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, idx) => (
//               <tr key={idx} style={{ borderBottom: "1px solid #ccc" }}>
//                 <td>{row.Year}</td>
//                 <td>₹{row.Operating_Activities?.toLocaleString()}</td>
//                 <td>₹{row.Investing_Activities?.toLocaleString()}</td>
//                 <td>₹{row.Financing_Activities?.toLocaleString()}</td>
//                 <td><b>₹{row.Net_Cash_Flow?.toLocaleString()}</b></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{ width: "100%", height: 400, marginTop: "40px" }}>
//         <ResponsiveContainer>
//           <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="Year" />
//             <YAxis />
//             <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
//             <Legend />
//             <Bar dataKey="Operating_Activities" fill="#8884d8" />
//             <Bar dataKey="Investing_Activities" fill="#82ca9d" />
//             <Bar dataKey="Financing_Activities" fill="#ffc658" />
//             <Line type="monotone" dataKey="Net_Cash_Flow" stroke="#ff7300" strokeWidth={2} />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default CashFlowState;


import React, { useEffect, useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import FinancialRatingSystem from "../RatingFile/FinancialRatingSystem";

const CashFlowState = ({ symbol, API_BASE, mainTab }) => {
  const [data, setData] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (!symbol) return;

    const endpoint =
      mainTab === "consolidated"
        ? `${API_BASE}/consolidate/CashFlow_state/${symbol}`
        : `${API_BASE}/financial/CashFlow_state/${symbol}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((json) => {
        const formatted = json.map((item) => ({
          ...item,
          Year: item.Year_end.toString().slice(0, 4),
        }));
        setData(formatted);
      })
      .catch((err) => console.error("Cash Flow error:", err));
  }, [symbol, API_BASE, mainTab]);

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
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
          <FinancialRatingSystem plotType="cash_flow_statement" mainTab={mainTab} />
        </div>
      </div>
      <h2 style={{ textAlign: "center", fontWeight: 600, marginBottom: "24px" }}>
        {symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Cash Flow Statement
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
          textAlign: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}
          className="dark:bg-slate-800 dark:text-white">
          <thead style={{ backgroundColor: "#f9fafb" }} className="dark:bg-slate-800 dark:text-white">
            <tr style={{ borderBottom: "1px solid #ddd" }} className="dark:bg-slate-800 dark:text-white">
              <th onClick={toggleSort} style={{ cursor: "pointer", padding: "12px", fontWeight: 600 }} className="dark:bg-slate-800 dark:text-white">
                Year {sortArrow}
              </th>
              <th className="dark:bg-slate-800 dark:text-white">Operating Activities</th>
              <th className="dark:bg-slate-800 dark:text-white">Investing Activities</th>
              <th className="dark:bg-slate-800 dark:text-white">Financing Activities</th>
              <th className="dark:bg-slate-800 dark:text-white">Net Cash Flow</th>
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
              >
                <td style={{ padding: "10px" }} className="dark:bg-slate-800 dark:text-white">{row.Year}</td>
                <td className="dark:bg-slate-800 dark:text-white">₹{row.Operating_Activities?.toLocaleString() ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">₹{row.Investing_Activities?.toLocaleString() ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">₹{row.Financing_Activities?.toLocaleString() ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white"><strong>₹{row.Net_Cash_Flow?.toLocaleString() ?? "-"}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ width: "100%", height: 400, marginTop: "40px" }}>
        <ResponsiveContainer>
          <ComposedChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Year" />
            <YAxis />
            <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Operating_Activities" fill="#8884d8" />
            <Bar dataKey="Investing_Activities" fill="#82ca9d" />
            <Bar dataKey="Financing_Activities" fill="#ffc658" />
            <Line type="monotone" dataKey="Net_Cash_Flow" stroke="#ff7300" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowState;