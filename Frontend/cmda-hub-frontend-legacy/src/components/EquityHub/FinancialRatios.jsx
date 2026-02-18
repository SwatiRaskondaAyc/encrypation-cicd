// import React, { useEffect, useState } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";

// const FinancialRatios = ({ symbol, API_BASE, mainTab }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     if (!symbol) return;

//     const endpoint =
//       mainTab === "consolidated"
//         ? `${API_BASE}/consolidate/financial_ratios/${symbol}`
//         : `${API_BASE}/financial/financial_ratios/${symbol}`;

//     fetch(endpoint)
//       .then((res) => res.json())
//       .then((json) => {
//         const formatted = json.map((item) => ({
//           ...item,
//           Year: item.Year_end.toString().slice(0, 4),
//         }));
//         setData(formatted);
//       })
//       .catch((err) => console.error("Error loading financial ratios:", err));
//   }, [symbol, API_BASE, mainTab]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h3 style={{ textAlign: "center" }}>{symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Financial Ratios</h3>

//       <div style={{ overflowX: "auto", marginTop: "20px" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
//           <thead style={{ backgroundColor: "#f2f2f2" }}>
//             <tr>
//               <th>Year</th>
//               <th>EPS</th>
//               <th>Book Value</th>
//               <th>Dividend/Share</th>
//               <th>Net Profit Margin (%)</th>
//               <th>Gross Profit Margin (%)</th>
//               <th>Current Ratio</th>
//               <th>Quick Ratio</th>
//               <th>EBITDA (%)</th>
//               <th>Asset Turnover</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, idx) => (
//               <tr key={idx} style={{ borderBottom: "1px solid #ccc" }}>
//                 <td>{row.Year}</td>
//                 <td>{row.Basic_EPS?.toFixed(2) ?? "-"}</td>
//                 <td>{row.Book_Value?.toFixed(2) ?? "-"}</td>
//                 <td>{row.Dividend_Per_Share?.toFixed(2) ?? "-"}</td>
//                 <td>{row.Net_Profit_Margin?.toFixed(2) ?? "-"}</td>
//                 <td>{row.Gross_Profit_Margin?.toFixed(2) ?? "-"}</td>
//                 <td>{row.Current_Ratio?.toFixed(2) ?? "-"}</td>
//                 <td>{row.Quick_Ratio?.toFixed(2) ?? "-"}</td>
//                 <td>{row.EBITDA?.toFixed(2) ?? "-"}</td>
//                 <td>{row.Asset_Turnover_Ratio?.toFixed(2) ?? "-"}</td>
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
//             <Tooltip formatter={(value) => parseFloat(value).toFixed(2)} />
//             <Legend />
//             <Bar dataKey="Basic_EPS" name="EPS" fill="#8884d8" />
//             <Bar dataKey="Book_Value" name="Book Value" fill="#82ca9d" />
//             <Bar dataKey="Net_Profit_Margin" name="Net Profit Margin (%)" fill="#ffc658" />
//             <Bar dataKey="EBITDA" name="EBITDA (%)" fill="#ff7300" />
//             <Bar dataKey="Asset_Turnover_Ratio" name="Asset Turnover" fill="#003f5c" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default FinancialRatios;


import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import FinancialRatingSystem from "../RatingFile/FinancialRatingSystem";

const FinancialRatios = ({ symbol, API_BASE, mainTab }) => {
  const [data, setData] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (!symbol) return;

    const endpoint =
      mainTab === "consolidated"
        ? `${API_BASE}/consolidate/financial_ratios/${symbol}`
        : `${API_BASE}/financial/financial_ratios/${symbol}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((json) => {
        const formatted = json.map((item) => ({
          ...item,
          Year: item.Year_end.toString().slice(0, 4),
        }));
        setData(formatted);
      })
      .catch((err) => console.error("Error loading financial ratios:", err));
  }, [symbol, API_BASE, mainTab]);

  const toggleYearSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
  };

  const sortedData = [...data].sort((a, b) => {
    const aYear = parseInt(a.Year);
    const bYear = parseInt(b.Year);
    return sortDirection === "asc" ? aYear - bYear : bYear - aYear;
  });

  const getArrow = () => (sortDirection === "asc" ? "↑" : "↓");

  return (
    <div style={{ padding: "24px", fontFamily: "Segoe UI, sans-serif" }}>
      <div >


        {/* Right side - FinancialRatingSystem */}
        <div style={{ width: "300px", marginTop: "5px" }}>
          <FinancialRatingSystem plotType="financial_ratios" mainTab={mainTab} />
        </div>
      </div>
      <h2 className="p-8" style={{ textAlign: "center", fontWeight: 600, marginBottom: "24px" }}>
        {symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Financial Ratios
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
          fontSize: "14px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}
          className="dark:bg-slate-800 dark:text-white">
          <thead style={{ backgroundColor: "#f9fafb" }} className="dark:bg-slate-800 dark:text-white">
            <tr style={{ borderBottom: "1px solid #ddd" }} className="dark:bg-slate-800 dark:text-white">
              <th onClick={toggleYearSort} style={{ cursor: "pointer", padding: "12px", fontWeight: 600 }} className="dark:bg-slate-800 dark:text-white">
                Year {getArrow()}
              </th>
              <th className="dark:bg-slate-800 dark:text-white">EPS</th>
              <th className="dark:bg-slate-800 dark:text-white">Book Value</th>
              <th className="dark:bg-slate-800 dark:text-white">Dividend/Share</th>
              <th className="dark:bg-slate-800 dark:text-white">Net Profit Margin (%)</th>
              <th className="dark:bg-slate-800 dark:text-white">Gross Profit Margin (%)</th>
              <th className="dark:bg-slate-800 dark:text-white">Current Ratio</th>
              <th className="dark:bg-slate-800 dark:text-white">Quick Ratio</th>
              <th className="dark:bg-slate-800 dark:text-white">EBITDA (%)</th>
              <th className="dark:bg-slate-800 dark:text-white">Asset Turnover</th>
            </tr>
          </thead>
          <tbody className="dark:bg-slate-800 dark:text-white">
            {sortedData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #eee", backgroundColor: idx % 2 === 0 ? "#fff" : "#f7f9fa" }} className="dark:bg-slate-800 dark:text-white">
                <td style={{ padding: "10px" }} className="dark:bg-slate-800 dark:text-white">{row.Year}</td>
                <td className="dark:bg-slate-800 dark:text-white">{row.Basic_EPS?.toFixed(2) ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">{row.Book_Value?.toFixed(2) ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">{row.Dividend_Per_Share?.toFixed(2) ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">{row.Net_Profit_Margin?.toFixed(2) ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">{row.Gross_Profit_Margin?.toFixed(2) ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">{row.Current_Ratio?.toFixed(2) ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">{row.Quick_Ratio?.toFixed(2) ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">{row.EBITDA?.toFixed(2) ?? "-"}</td>
                <td className="dark:bg-slate-800 dark:text-white">{row.Asset_Turnover_Ratio?.toFixed(2) ?? "-"}</td>
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
            <Tooltip formatter={(value) => parseFloat(value).toFixed(2)} />
            <Legend />
            <Bar dataKey="Basic_EPS" name="EPS" fill="#8884d8" />
            <Bar dataKey="Book_Value" name="Book Value" fill="#6dacc5ff" />
            <Bar dataKey="Net_Profit_Margin" name="Net Profit Margin (%)" fill="#ffc658" />
            <Bar dataKey="EBITDA" name="EBITDA (%)" fill="#ff7300" />
            <Bar dataKey="Asset_Turnover_Ratio" name="Asset Turnover" fill="#003f5c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialRatios;