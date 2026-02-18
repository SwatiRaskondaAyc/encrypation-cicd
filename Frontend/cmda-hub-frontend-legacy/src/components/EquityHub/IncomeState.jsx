// import React, { useEffect, useState } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";

// const IncomeState = ({ symbol, API_BASE, mainTab }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     if (!symbol) return;

//     const endpoint =
//       mainTab === "consolidated"
//         ? `${API_BASE}/consolidate/income_state/${symbol}`
//         : `${API_BASE}/financial/income_state/${symbol}`;

//     fetch(endpoint)
//       .then(res => res.json())
//       .then(json => {
//         const formatted = json.map(item => ({
//           ...item,
//           Year: item.Year_end.toString().slice(0, 4)
//         }));
//         setData(formatted);
//       })
//       .catch(err => console.error("Error:", err));
//   }, [symbol, API_BASE, mainTab]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h3 style={{ textAlign: "center" }}>{symbol} - {mainTab === "consolidated" ? "Consolidated" : "Standalone"} Income Statement</h3>

//       <div style={{ overflowX: "auto", marginTop: "20px" }}>
//         <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
//           <thead style={{ backgroundColor: "#f0f0f0" }}>
//             <tr>
//               <th>Year</th>
//               <th>Sales</th>
//               <th>Other Income</th>
//               <th>Total Income</th>
//               <th>Expenditure</th>
//               <th>Interest</th>
//               <th>Tax</th>
//               <th>Net Profit</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, idx) => (
//               <tr key={idx} style={{ borderBottom: "1px solid #ccc" }}>
//                 <td>{row.Year}</td>
//                 <td>₹{row.Sales?.toLocaleString() ?? "-"}</td>
//                 <td>₹{row.Other_Income?.toLocaleString() ?? "-"}</td>
//                 <td>₹{row.Total_Income?.toLocaleString() ?? "-"}</td>
//                 <td>₹{row.Total_Expenditure?.toLocaleString() ?? "-"}</td>
//                 <td>₹{row.Interest?.toLocaleString() ?? "-"}</td>
//                 <td>₹{row.Tax?.toLocaleString() ?? "-"}</td>
//                 <td><b>₹{row.Net_Profit?.toLocaleString() ?? "-"}</b></td>
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
//             <Tooltip formatter={(value) => value ? `₹${value.toLocaleString()}` : "-"} />
//             <Legend />
//             <Bar dataKey="Sales" fill="#8884d8" />
//             <Bar dataKey="Total_Expenditure" fill="#82ca9d" />
//             <Bar dataKey="Net_Profit" fill="#ffc658" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default IncomeState;



import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import FinancialRatingSystem from "../RatingFile/FinancialRatingSystem";


const IncomeState = ({ symbol, API_BASE }) => {
  const [data, setData] = useState([]);
  const [mainTab, setMainTab] = useState("standalone");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) {
      setError("No symbol provided");
      return;
    }

    const endpoint =
      mainTab === "consolidated"
        ? `${API_BASE}/consolidate/income_state/${symbol}`
        : `${API_BASE}/financial/income_state/${symbol}`;

    setError(null); // Reset error state
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!Array.isArray(json) || json.length === 0) {
          throw new Error("No data returned from API");
        }
        const formatted = json.map((item) => ({
          ...item,
          Year: item.Year_end?.toString().slice(0, 4) || "N/A",
        }));
        formatted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        setData(formatted);
      })
      .catch((err) => {
        console.error("Income Statement Error:", err);
        setError(err.message);
        setData([]); // Ensure data is cleared on error
      });
  }, [symbol, API_BASE, mainTab]);

  // Fallback data for testing
  const fallbackData = useMemo(() => {
    if (data.length > 0) return data;
    return error ? [] : [{ Year: "2023", Sales: 1000, Total_Expenditure: 700, Net_Profit: 300 }];
  }, [data, error]);

  return (
    <div className="p-6 font-sans">
      <div >
        <div style={{ flex: 1 }}>
          {/* Your existing left side content */}
        </div>
        <div style={{ width: "300px", marginTop: "5px" }}>
          <FinancialRatingSystem plotType="income_statement" mainTab={mainTab} />
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{symbol} - Income Statement</h3>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-blue-100 text-gray-700 sticky top-0 z-10">
            <tr>
              {["Year", "Sales", "Other Income", "Total Income", "Expenditure", "Interest", "Tax", "Net Profit"].map((col) => (
                <th key={col} className="px-4 py-2 border">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fallbackData.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50"}>
                <td className="px-4 py-2 border dark:text-white dark:bg-slate-800">{row.Year}</td>
                <td className="px-4 py-2 border dark:text-white dark:bg-slate-800">
                  ₹{row.Sales?.toLocaleString() ?? "-"}
                </td>
                <td className="px-4 py-2 border dark:text-white dark:bg-slate-800">
                  ₹{row.Other_Income?.toLocaleString() ?? "-"}
                </td>
                <td className="px-4 py-2 border dark:text-white dark:bg-slate-800">
                  ₹{row.Total_Income?.toLocaleString() ?? "-"}
                </td>
                <td className="px-4 py-2 border dark:text-white dark:bg-slate-800">
                  ₹{row.Total_Expenditure?.toLocaleString() ?? "-"}
                </td>
                <td className="px-4 py-2 border dark:text-white dark:bg-slate-800">
                  ₹{row.Interest?.toLocaleString() ?? "-"}
                </td>
                <td className="px-4 py-2 border dark:text-white dark:bg-slate-800">
                  ₹{row.Tax?.toLocaleString() ?? "-"}
                </td>
                <td className="px-4 py-2 border font-semibold text-green-700 dark:bg-slate-800">
                  ₹{row.Net_Profit?.toLocaleString() ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </div>

      <div className="w-full h-96 mt-10" style={{ minHeight: "300px" }}>
        <ResponsiveContainer>
          <BarChart data={fallbackData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Year" />
            <YAxis />
            <Tooltip formatter={(value) => (value ? `₹${value.toLocaleString()}` : "-")} />
            <Legend />
            <Bar dataKey="Sales" fill="#3b82f6" name="Sales" />
            <Bar dataKey="Total_Expenditure" fill="#10b981" name="Expenditure" />
            <Bar dataKey="Net_Profit" fill="#f59e0b" name="Net Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeState;