// import React, { useEffect, useState } from "react";

// import axios from "axios";
// import {
//   PieChart, Pie, Cell, Tooltip as RechartsTooltip,
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
// } from "recharts";
// import ShareHoldingRating from "../RatingFile /ShareHoldingRating";

// const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];
// const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

// const allowedCategories = {
//   Promoter: "Promoter",
//   FII: "FII",
//   DII: "DII",
//   Public: "Public",
//   Others: "Others",
//   Mutual_Funds: "Mutual Funds"
// };

// const formatDecimal = (num) => {
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(Number(num));
// };


// const Shareholding = ({ symbol }) => {
//   const [summaryData, setSummaryData] = useState([]);
//   const [overallData, setOverallData] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("Promoter");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const summaryRes = await axios.get(`${API_BASE}/Shareholding/summary/${symbol}`);
//         const overallRes = await axios.get(`${API_BASE}/Shareholding/Overall/${symbol}`);
//         setSummaryData(summaryRes.data);
//         setOverallData(overallRes.data);
//       } catch (error) {
//         console.error("Error fetching shareholding data", error);
//       }
//     };

//     fetchData();
//   }, [symbol]);

//   const preparePieData = () => {
//     if (summaryData.length === 0) return [];
//     const entry = summaryData[0];
//     return Object.keys(allowedCategories).map((key) => ({
//       name: allowedCategories[key],
//       value: entry[key]
//       // value: formatDecimal(entry[key])
//     }));
//   };

//   const renderCustomLabel = ({ name, value, percent }) => {
//     return `${name}: ${formatDecimal(value)}%`;
//   };



//   const formatDate = (dateNum) => {
//     const dateStr = dateNum.toString();
//     const year = dateStr.slice(0, 4);
//     const month = dateStr.slice(4, 6);

//     const monthMap = {
//       "03": "March",
//       "06": "June",
//       "09": "Sep",
//       "12": "Dec"
//     };

//     return `${monthMap[month] || month} ${year}`;
//   };

//   const prepareLineData = () => {
//     return overallData.map(item => ({
//       //   Quarter: item.DATE_END.toString().replace(/(\d{4})(\d{2})/, "$2/$1"),
//       Quarter: formatDate(item.DATE_END),
//       //   Value: item[selectedCategory]
//       Value: formatDecimal(item[selectedCategory])
//     })).reverse();
//   };

//   const renderTable = () => {
//     if (overallData.length === 0) return null;

//     const rows = overallData.map((row) => {
//       return {
//         // Quarter: row.DATE_END.toString().replace(/(\d{4})(\d{2})/, "$2/$1"),
//         Quarter: formatDate(row.DATE_END),
//         Promoter: row.Promoter,
//         FII: row.FII,
//         DII: row.DII,
//         Public: row.Public,
//         Others: row.Others,
//         Mutual_Funds: row.Mutual_Funds,
//       };
//     });




//     return (

//       <div style={{ overflowX: "auto", marginTop: "2rem", backgroundColor: "#fff", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>



//         <h3 className="dark:bg-slate-800 dark:text-white">Shareholding – Last 5 Quarters</h3>
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }} className="dark:bg-slate-800 dark:text-white">
//           <thead className="dark:bg-slate-800 dark:text-white" >
//             <tr style={{ backgroundColor: "#f0f2f5" }} className="dark:bg-slate-800 dark:text-white">
//               <th style={thStyle} className="dark:bg-slate-800 dark:text-white">Quarter</th>
//               {Object.keys(allowedCategories).map((key) => (
//                 <th key={key} style={thStyle} className="dark:bg-slate-800 dark:text-white">{allowedCategories[key]}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="dark:bg-slate-800 dark:text-white">
//             {rows.map((r, i) => (
//               <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #eee" }} className="dark:bg-slate-800 dark:text-white">
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Quarter}</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Promoter}%</td>
//                 {/* <td style={tdStyle}>{r.FII}%</td> */}
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.FII)}%</td>
//                 {/* <td style={tdStyle}>{r.DII}%</td> */}
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.DII)}%</td>
//                 {/* <td style={tdStyle}>{r.Public}%</td> */}
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Public)}%</td>
//                 {/* <td style={tdStyle}>{r.Others}%</td> */}
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Others)}%</td>
//                 {/* <td style={tdStyle}>{r.Mutual_Funds}%</td> */}
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Mutual_Funds)}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const thStyle = {
//     padding: "10px",
//     fontWeight: "bold",
//     textAlign: "center",
//     borderBottom: "2px solid #ccc",
//   };

//   const tdStyle = {
//     padding: "8px",
//   };

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f7f9fc' }}>
//         <div style={{ width: "300px", marginTop: "5px" }}>
//           <ShareHoldingRating />
//         </div>
//       <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
//         Shareholding Dashboard - {symbol}
//       </h2>

//       {/* Graphs Row */}
//       <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
//         {/* Pie Chart */}
//         <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
//           <h3 style={{ textAlign: 'center' }} className=" dark:text-black">Shareholding Summary</h3>
//           <PieChart width={400} height={400}>
//             <Pie
//               data={preparePieData()}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={120}
//               label={renderCustomLabel} // 👈 Add this
//             >
//               {preparePieData().map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>

//             <RechartsTooltip formatter={(value) => `${formatDecimal(value)}%`} />

//           </PieChart>
//           <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
//             {preparePieData().map((entry, i) => (
//               <div key={i} style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
//                 <div style={{ width: 10, height: 10, backgroundColor: COLORS[i % COLORS.length], marginRight: 5 }}></div>
//                 <span>{entry.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Line Chart */}
//         <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
//           <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h3 style={{ margin: 0 }}>5 Quarter Trend</h3>
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '6px' }}
//             >
//               {Object.entries(allowedCategories).map(([key, label]) => (
//                 <option key={key} value={key}>{label}</option>
//               ))}
//             </select>
//           </div>

//           <LineChart
//             width={500}
//             height={350}
//             data={prepareLineData()}
//             margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="Quarter" />
//             <YAxis unit="%" />
//             <RechartsTooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="Value"
//               stroke="#8884d8"
//               activeDot={{ r: 8 }}
//               name={allowedCategories[selectedCategory]}
//             />
//           </LineChart>
//         </div>
//       </div>

//       {/* Table */}
//       {renderTable()}
//     </div>
//   );
// };

// export default Shareholding;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip as RechartsTooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend
// } from "recharts";
// import ShareHoldingRating from "../RatingFile /ShareHoldingRating";


// const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];
// const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

// const allowedCategories = {
//   Promoter: "Promoter",
//   FII: "FII",
//   DII: "DII",
//   Public: "Public",
//   Others: "Others",
//   Mutual_Funds: "Mutual Funds"
// };

// const formatDecimal = (num) => {
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(Number(num));
// };

// const Shareholding = ({ symbol }) => {
//   const [summaryData, setSummaryData] = useState([]);
//   const [overallData, setOverallData] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("Promoter");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const summaryRes = await axios.get(`${API_BASE}/Shareholding/summary/${symbol}`);
//         const overallRes = await axios.get(`${API_BASE}/Shareholding/Overall/${symbol}`);
//         setSummaryData(summaryRes.data);
//         setOverallData(overallRes.data);
//       } catch (error) {
//         console.error("Error fetching shareholding data", error);
//       }
//     };

//     fetchData();
//   }, [symbol]);

//   const preparePieData = () => {
//     if (summaryData.length === 0) return [];
//     const entry = summaryData[0];
//     return Object.keys(allowedCategories).map((key) => ({
//       name: allowedCategories[key],
//       value: entry[key]
//     }));
//   };

//   const renderCustomLabel = ({ name, value }) => {
//     return `${name}: ${formatDecimal(value)}%`;
//   };

//   const formatDate = (dateNum) => {
//     const dateStr = dateNum.toString();
//     const year = dateStr.slice(0, 4);
//     const month = dateStr.slice(4, 6);

//     const monthMap = {
//       "03": "March",
//       "06": "June",
//       "09": "Sep",
//       "12": "Dec"
//     };

//     return `${monthMap[month] || month} ${year}`;
//   };

//   const prepareLineData = () => {
//     return overallData.map(item => ({
//       Quarter: formatDate(item.DATE_END),
//       Value: formatDecimal(item[selectedCategory])
//     })).reverse();
//   };

//   const renderTable = () => {
//     if (overallData.length === 0) return null;

//     const rows = overallData.map((row) => {
//       return {
//         Quarter: formatDate(row.DATE_END),
//         Promoter: row.Promoter,
//         FII: row.FII,
//         DII: row.DII,
//         Public: row.Public,
//         Others: row.Others,
//         Mutual_Funds: row.Mutual_Funds
//       };
//     });

//     return (
//       <div style={{ overflowX: "auto", marginTop: "2rem", backgroundColor: "#fff", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
//         <h3 className="dark:bg-slate-800 dark:text-white">Shareholding – Last 5 Quarters</h3>
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }} className="dark:bg-slate-800 dark:text-white">
//           <thead className="dark:bg-slate-800 dark:text-white">
//             <tr style={{ backgroundColor: "#f0f2f5" }} className="dark:bg-slate-800 dark:text-white">
//               <th style={thStyle} className="dark:bg-slate-800 dark:text-white">Quarter</th>
//               {Object.keys(allowedCategories).map((key) => (
//                 <th key={key} style={thStyle} className="dark:bg-slate-800 dark:text-white">{allowedCategories[key]}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="dark:bg-slate-800 dark:text-white">
//             {rows.map((r, i) => (
//               <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #eee" }} className="dark:bg-slate-800 dark:text-white">
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Quarter}</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Promoter)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.FII)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.DII)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Public)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Others)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Mutual_Funds)}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const thStyle = {
//     padding: "10px",
//     fontWeight: "bold",
//     textAlign: "center",
//     borderBottom: "2px solid #ccc"
//   };

//   const tdStyle = {
//     padding: "8px"
//   };

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f7f9fc' }}>
//       <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
//         Shareholding Dashboard - {symbol}
//       </h2>
//       <div className="w-[300px] mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
//         <ShareHoldingRating plotType="shareholding_summary" />
//       </div>
//       <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
//         <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
//           <h3 style={{ textAlign: 'center' }} className="dark:text-black">Shareholding Summary</h3>
//           <PieChart width={400} height={400}>
//             <Pie
//               data={preparePieData()}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={120}
//               label={renderCustomLabel}
//             >
//               {preparePieData().map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <RechartsTooltip formatter={(value) => `${formatDecimal(value)}%`} />
//           </PieChart>
//           <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
//             {preparePieData().map((entry, i) => (
//               <div key={i} style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
//                 <div style={{ width: 10, height: 10, backgroundColor: COLORS[i % COLORS.length], marginRight: 5 }}></div>
//                 <span>{entry.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
//           <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h3 style={{ margin: 0 }}>5 Quarter Trend</h3>
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '6px' }}
//             >
//               {Object.entries(allowedCategories).map(([key, label]) => (
//                 <option key={key} value={key}>{label}</option>
//               ))}
//             </select>
//           </div>
//           <LineChart
//             width={500}
//             height={350}
//             data={prepareLineData()}
//             margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="Quarter" />
//             <YAxis unit="%" />
//             <RechartsTooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="Value"
//               stroke="#8884d8"
//               activeDot={{ r: 8 }}
//               name={allowedCategories[selectedCategory]}
//             />
//           </LineChart>
//         </div>
//       </div>
//       {renderTable()}
//     </div>
//   );
// };

// export default Shareholding;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip as RechartsTooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend
// } from "recharts";
// import ShareHoldingRating from "../RatingFile /ShareHoldingRating";


// const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];
// const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

// const allowedCategories = {
//   Promoter: "Promoter",
//   FII: "FII",
//   DII: "DII",
//   Public: "Public",
//   Others: "Others",
//   Mutual_Funds: "Mutual Funds"
// };

// const formatDecimal = (num) => {
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(Number(num));
// };

// const Shareholding = ({ symbol }) => {
//   const [summaryData, setSummaryData] = useState([]);
//   const [overallData, setOverallData] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("Promoter");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const summaryRes = await axios.get(`${API_BASE}/Shareholding/summary/${symbol}`);
//         const overallRes = await axios.get(`${API_BASE}/Shareholding/Overall/${symbol}`);
//         setSummaryData(summaryRes.data);
//         setOverallData(overallRes.data);
//       } catch (error) {
//         console.error("Error fetching shareholding data", error);
//       }
//     };

//     fetchData();
//   }, [symbol]);

//   const preparePieData = () => {
//     if (summaryData.length === 0) return [];
//     const entry = summaryData[0];
//     return Object.keys(allowedCategories).map((key) => ({
//       name: allowedCategories[key],
//       value: entry[key]
//     }));
//   };

//   const renderCustomLabel = ({ name, value }) => {
//     return `${name}: ${formatDecimal(value)}%`;
//   };

//   const formatDate = (dateNum) => {
//     const dateStr = dateNum.toString();
//     const year = dateStr.slice(0, 4);
//     const month = dateStr.slice(4, 6);

//     const monthMap = {
//       "03": "March",
//       "06": "June",
//       "09": "Sep",
//       "12": "Dec"
//     };

//     return `${monthMap[month] || month} ${year}`;
//   };

//   const prepareLineData = () => {
//     return overallData.map(item => ({
//       Quarter: formatDate(item.DATE_END),
//       Value: formatDecimal(item[selectedCategory])
//     })).reverse();
//   };

//   const renderTable = () => {
//     if (overallData.length === 0) return null;

//     const rows = overallData.map((row) => {
//       return {
//         Quarter: formatDate(row.DATE_END),
//         Promoter: row.Promoter,
//         FII: row.FII,
//         DII: row.DII,
//         Public: row.Public,
//         Others: row.Others,
//         Mutual_Funds: row.Mutual_Funds
//       };
//     });

//     return (
//       <div style={{ overflowX: "auto", marginTop: "2rem", backgroundColor: "#fff", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
//         <h3 className="dark:bg-slate-800 dark:text-white">Shareholding – Last 5 Quarters</h3>
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }} className="dark:bg-slate-800 dark:text-white">
//           <thead className="dark:bg-slate-800 dark:text-white">
//             <tr style={{ backgroundColor: "#f0f2f5" }} className="dark:bg-slate-800 dark:text-white">
//               <th style={thStyle} className="dark:bg-slate-800 dark:text-white">Quarter</th>
//               {Object.keys(allowedCategories).map((key) => (
//                 <th key={key} style={thStyle} className="dark:bg-slate-800 dark:text-white">{allowedCategories[key]}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="dark:bg-slate-800 dark:text-white">
//             {rows.map((r, i) => (
//               <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #eee" }} className="dark:bg-slate-800 dark:text-white">
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Quarter}</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Promoter)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.FII)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.DII)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Public)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Others)}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Mutual_Funds)}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const thStyle = {
//     padding: "10px",
//     fontWeight: "bold",
//     textAlign: "center",
//     borderBottom: "2px solid #ccc"
//   };

//   const tdStyle = {
//     padding: "8px"
//   };

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f7f9fc' }}>
//             <div >


//         {/* Right side - FinancialRatingSystem */}
//         <div style={{ width: "300px", marginTop: "5px" }}>
//            <ShareHoldingRating plotType="shareholding_summary" />
//         </div>
//       </div>
//       <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
//         Shareholding Dashboard - {symbol}
//       </h2>
//       {/* <div className="w-[300px] mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
//         <ShareHoldingRating plotType="shareholding_summary" />
//       </div> */}
//       <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
//         <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
//           <h3 style={{ textAlign: 'center' }} className="dark:text-black">Shareholding Summary</h3>
//           <PieChart width={400} height={400}>
//             <Pie
//               data={preparePieData()}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={120}
//               label={renderCustomLabel}
//             >
//               {preparePieData().map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <RechartsTooltip formatter={(value) => `${formatDecimal(value)}%`} />
//           </PieChart>
//           <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
//             {preparePieData().map((entry, i) => (
//               <div key={i} style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
//                 <div style={{ width: 10, height: 10, backgroundColor: COLORS[i % COLORS.length], marginRight: 5 }}></div>
//                 <span>{entry.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
//           <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h3 style={{ margin: 0 }}>5 Quarter Trend</h3>
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '6px' }}
//             >
//               {Object.entries(allowedCategories).map(([key, label]) => (
//                 <option key={key} value={key}>{label}</option>
//               ))}
//             </select>
//           </div>
//           <LineChart
//             width={500}
//             height={350}
//             data={prepareLineData()}
//             margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="Quarter" />
//             <YAxis unit="%" />
//             <RechartsTooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="Value"
//               stroke="#8884d8"
//               activeDot={{ r: 8 }}
//               name={allowedCategories[selectedCategory]}
//             />
//           </LineChart>
//         </div>
//       </div>
//       {renderTable()}
//     </div>
//   );
// };

// export default Shareholding;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import ShareHoldingRating from "../RatingFile/ShareHoldingRating";


const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];
const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

const allowedCategories = {
  Promoter: "Promoter",
  FII: "FII",
  DII: "DII",
  Public: "Public",
  Others: "Others",
  Mutual_Funds: "Mutual Funds"
};

const formatDecimal = (num) => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(num));
};

const Shareholding = ({ symbol }) => {
  const [summaryData, setSummaryData] = useState([]);
  const [overallData, setOverallData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Promoter");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await axios.get(`${API_BASE}/Shareholding/summary/${symbol}`);
        const overallRes = await axios.get(`${API_BASE}/Shareholding/Overall/${symbol}`);
        setSummaryData(summaryRes.data);
        setOverallData(overallRes.data);
      } catch (error) {
        console.error("Error fetching shareholding data", error);
      }
    };

    fetchData();
  }, [symbol]);

  const preparePieData = () => {
    if (summaryData.length === 0) return [];
    const entry = summaryData[0];
    return Object.keys(allowedCategories).map((key) => ({
      name: allowedCategories[key],
      value: entry[key]
    }));
  };

  const renderCustomLabel = ({ name, value, percent }) => {
    return `${name}: ${formatDecimal(value)}%`;
  };

  const formatDate = (dateNum) => {
    const dateStr = dateNum.toString();
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);

    const monthMap = {
      "03": "March",
      "06": "June",
      "09": "Sep",
      "12": "Dec"
    };

    return `${monthMap[month] || month} ${year}`;
  };

  const prepareLineData = () => {
    return overallData.map(item => ({
      Quarter: formatDate(item.DATE_END),
      Value: formatDecimal(item[selectedCategory])
    })).reverse();
  };

  const renderTable = () => {
    if (overallData.length === 0) return null;

    const rows = overallData.map((row) => {
      return {
        Quarter: formatDate(row.DATE_END),
        Promoter: row.Promoter,
        FII: row.FII,
        DII: row.DII,
        Public: row.Public,
        Others: row.Others,
        Mutual_Funds: row.Mutual_Funds,
      };
    });

    return (
      <div style={{ overflowX: "auto", marginTop: "2rem", backgroundColor: "#fff", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3 className="dark:bg-slate-800 dark:text-white">Shareholding – Last 5 Quarters</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }} className="dark:bg-slate-800 dark:text-white">
          <thead className="dark:bg-slate-800 dark:text-white">
            <tr style={{ backgroundColor: "#f0f2f5" }} className="dark:bg-slate-800 dark:text-white">
              <th style={thStyle} className="dark:bg-slate-800 dark:text-white">Quarter</th>
              {Object.keys(allowedCategories).map((key) => (
                <th key={key} style={thStyle} className="dark:bg-slate-800 dark:text-white">{allowedCategories[key]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="dark:bg-slate-800 dark:text-white">
            {rows.map((r, i) => (
              <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #eee" }} className="dark:bg-slate-800 dark:text-white">
                <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Quarter}</td>
                <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Promoter}%</td>
                <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.FII)}%</td>
                <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.DII)}%</td>
                <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Public)}%</td>
                <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Others)}%</td>
                <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{formatDecimal(r.Mutual_Funds)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const thStyle = {
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center",
    borderBottom: "2px solid #ccc"
  };

  const tdStyle = {
    padding: "8px"
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f7f9fc' }}>
      <div >


        {/* Right side - FinancialRatingSystem */}
        <div style={{ width: "300px", marginTop: "5px" }}>
          <ShareHoldingRating plotType="shareholding_summary" />
        </div>
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }} className="mt-5">
        Shareholding Dashboard - {symbol}
      </h2>
      {/* <div className="w-[300px] mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
        <ShareHoldingRating plotType="shareholding_summary" />
      </div> */}
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ textAlign: 'center' }} className="dark:text-black">Shareholding Summary</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={preparePieData()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              label={renderCustomLabel}
            >
              {preparePieData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(value) => `${formatDecimal(value)}%`} />
          </PieChart>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
            {preparePieData().map((entry, i) => (
              <div key={i} style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
                <div style={{ width: 10, height: 10, backgroundColor: COLORS[i % COLORS.length], marginRight: 5 }}></div>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>5 Quarter Trend</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '6px' }}
            >
              {Object.entries(allowedCategories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <LineChart
            width={500}
            height={350}
            data={prepareLineData()}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Quarter" />
            <YAxis unit="%" />
            <RechartsTooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name={allowedCategories[selectedCategory]}
            />
          </LineChart>
        </div>
      </div>
      {renderTable()}
    </div>
  );
};

export default Shareholding;






// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import axios from "axios";
// import {
//   PieChart, Pie, Cell, Tooltip as RechartsTooltip,
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
// } from "recharts";
// import { FaStar, FaStarHalfAlt } from "react-icons/fa"; // For rating stars

// const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];
// const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

// const allowedCategories = {
//   Promoter: "Promoter",
//   FII: "FII",
//   DII: "DII",
//   Public: "Public",
//   Others: "Others",
//   Mutual_Funds: "Mutual Funds"
// };

// const formatDecimal = (num) => {
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(Number(num));
// };

// const Shareholding = ({ symbol }) => {
//   const [summaryData, setSummaryData] = useState([]);
//   const [overallData, setOverallData] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("Promoter");
//   const [rating, setRating] = useState(null);
//   const [userRating, setUserRating] = useState(null);
//   const [averageRating, setAverageRating] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetchingRating, setIsFetchingRating] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [hasFetchError, setHasFetchError] = useState(false);

//   const RATING_CACHE_KEY = `shareholding_rating_cache_${symbol}`;

//   // Load cached rating on mount
//   useEffect(() => {
//     const cached = localStorage.getItem(RATING_CACHE_KEY);
//     if (cached) {
//       const parsed = parseInt(cached);
//       if (parsed >= 1 && parsed <= 5) {
//         setRating(parsed);
//         setUserRating(parsed);
//         setIsSubmitted(true);
//       }
//     }
//   }, [RATING_CACHE_KEY]);

//   // Check authentication
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       setIsAuthenticated(false);
//       return;
//     }
//     setIsAuthenticated(true);
//   }, []);

//   // Fetch shareholding data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const summaryRes = await axios.get(`${API_BASE}/Shareholding/summary/${symbol}`);
//         const overallRes = await axios.get(`${API_BASE}/Shareholding/Overall/${symbol}`);
//         setSummaryData(summaryRes.data);
//         setOverallData(overallRes.data);
//       } catch (error) {
//         console.error("Error fetching shareholding data", error);
//       }
//     };

//     fetchData();
//   }, [symbol]);

//   // Fetch user rating and average rating
//   useEffect(() => {
//     if (hasFetchError) return;

//     const fetchRatings = async () => {
//       const token = localStorage.getItem("authToken");

//       try {
//         let userFetched = false;

//         if (isAuthenticated && token) {
//           const userResponse = await axios.get(`${API_BASE}/financial/ratings/${symbol}/user`, {
//             headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//           });

//           if (userResponse.status === 401) {
//             localStorage.removeItem("authToken");
//             localStorage.removeItem(RATING_CACHE_KEY);
//             setIsAuthenticated(false);
//             setHasFetchError(true);
//             return;
//           }

//           if (userResponse.status === 404) {
//             // Do not override if cache exists
//           } else if (!userResponse.ok) {
//             throw new Error(`HTTP ${userResponse.status}`);
//           } else {
//             const ratingValue = userResponse.data.rating || parseInt(userResponse.data);
//             if (ratingValue >= 1 && ratingValue <= 5) {
//               setUserRating(ratingValue);
//               setRating(ratingValue);
//               setIsSubmitted(true);
//               localStorage.removeItem(RATING_CACHE_KEY);
//               userFetched = true;
//             }
//           }
//         }

//         const avgResponse = await axios.get(`${API_BASE}/financial/ratings/${symbol}/average`, {
//           headers: { "Content-Type": "application/json" },
//         });

//         if (avgResponse.status === 401) {
//           localStorage.removeItem("authToken");
//           setIsAuthenticated(false);
//           setHasFetchError(true);
//           return;
//         }

//         if (avgResponse.ok) {
//           const avgValue = avgResponse.data.average_rating || parseFloat(avgResponse.data);
//           if (avgValue >= 1 && avgValue <= 5) {
//             setAverageRating(avgValue);
//           }
//         }
//       } catch (err) {
//         console.error("Rating fetch error:", err);
//         setHasFetchError(true);
//       } finally {
//         setIsFetchingRating(false);
//       }
//     };

//     fetchRatings();
//   }, [symbol, isAuthenticated, hasFetchError]);

//   // Submit rating to DB
//   const submitRatingToDB = useCallback(
//     async (newRating) => {
//       const token = localStorage.getItem("authToken");
//       if (!token || newRating < 1 || newRating > 5) return;

//       try {
//         const response = await axios.post(`${API_BASE}/financial/ratings/${symbol}`, { rating: newRating }, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         });

//         if (response.status === 401) {
//           localStorage.removeItem("authToken");
//           localStorage.removeItem(RATING_CACHE_KEY);
//           setIsAuthenticated(false);
//           setHasFetchError(true);
//           return;
//         }

//         if (!response.ok) throw new Error(`HTTP ${response.status}`);

//         console.log("Rating submission:", response.data.message || "Rating submitted successfully");
//         localStorage.removeItem(RATING_CACHE_KEY);
//         setUserRating(newRating);
//         onRatingUpdate?.(newRating);
//       } catch (err) {
//         console.error("Rating submission error:", err);
//       }
//     },
//     [symbol, onRatingUpdate]
//   );

//   // Handle auth change (e.g., logout)
//   useEffect(() => {
//     const handleAuthChange = async () => {
//       setIsLoading(true);
//       const cached = localStorage.getItem(RATING_CACHE_KEY);
//       if (cached) {
//         const lastRating = parseInt(cached);
//         if (lastRating >= 1 && lastRating <= 5) {
//           await submitRatingToDB(lastRating);
//         }
//       }
//       setIsLoading(false);
//       setIsAuthenticated(false);
//     };

//     window.addEventListener("authChange", handleAuthChange);
//     return () => window.removeEventListener("authChange", handleAuthChange);
//   }, [submitRatingToDB]);

//   const handleRatingChange = useCallback(
//     (value) => {
//       setRating(value);
//       setUserRating(value);
//       localStorage.setItem(RATING_CACHE_KEY, value.toString());
//       setIsSubmitted(true);
//       submitRatingToDB(value);
//     },
//     [submitRatingToDB]
//   );

//   // Memoized star renderers
//   const renderStars = useMemo(
//     () => (ratingValue, size = "text-xl", interactive = false) => {
//       if (!ratingValue) return null;
//       const fullStars = Math.floor(ratingValue);
//       const hasHalfStar = ratingValue % 1 >= 0.5;
//       const stars = [];

//       for (let i = 1; i <= 5; i++) {
//         if (i <= fullStars) {
//           stars.push(<FaStar key={i} className="text-yellow-400" size={size === "text-2xl" ? 24 : 20} />);
//         } else if (i === fullStars + 1 && hasHalfStar) {
//           stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" size={size === "text-2xl" ? 24 : 20} />);
//           i++; // Skip the next full star since half is used
//         } else {
//           stars.push(<FaStar key={i} className="text-gray-300" size={size === "text-2xl" ? 24 : 20} />);
//         }
//       }

//       if (interactive) {
//         return (
//           <div className={`flex ${size} cursor-pointer`}>
//             {stars.map((star, index) => (
//               <span
//                 key={index}
//                 onClick={() => handleRatingChange(index + 1)}
//                 className="transition-transform hover:scale-110"
//               >
//                 {star}
//               </span>
//             ))}
//           </div>
//         );
//       }

//       return <div className={`flex ${size}`}>{stars}</div>;
//     },
//     [handleRatingChange]
//   );

//   const preparePieData = () => {
//     if (summaryData.length === 0) return [];
//     const entry = summaryData[0];
//     return Object.keys(allowedCategories).map((key) => ({
//       name: allowedCategories[key],
//       value: formatDecimal(entry[key])
//     }));
//   };

//   const renderCustomLabel = ({ name, value, percent }) => {
//     return `${name}: ${value}%`;
//   };

//   const formatDate = (dateNum) => {
//     const dateStr = dateNum.toString();
//     const year = dateStr.slice(0, 4);
//     const month = dateStr.slice(4, 6);
//     const monthMap = {
//       "03": "March",
//       "06": "June",
//       "09": "Sep",
//       "12": "Dec"
//     };
//     return `${monthMap[month] || month} ${year}`;
//   };

//   const prepareLineData = () => {
//     return overallData.map(item => ({
//       Quarter: formatDate(item.DATE_END),
//       Value: formatDecimal(item[selectedCategory])
//     })).reverse();
//   };

//   const renderTable = () => {
//     if (overallData.length === 0) return null;

//     const rows = overallData.map((row) => ({
//       Quarter: formatDate(row.DATE_END),
//       Promoter: formatDecimal(row.Promoter),
//       FII: formatDecimal(row.FII),
//       DII: formatDecimal(row.DII),
//       Public: formatDecimal(row.Public),
//       Others: formatDecimal(row.Others),
//       Mutual_Funds: formatDecimal(row.Mutual_Funds),
//     }));

//     return (
//       <div style={{ overflowX: "auto", marginTop: "2rem", backgroundColor: "#fff", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
//         <h3 className="dark:bg-slate-800 dark:text-white">Shareholding – Last 5 Quarters</h3>
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }} className="dark:bg-slate-800 dark:text-white">
//           <thead className="dark:bg-slate-800 dark:text-white">
//             <tr style={{ backgroundColor: "#f0f2f5" }} className="dark:bg-slate-800 dark:text-white">
//               <th style={thStyle} className="dark:bg-slate-800 dark:text-white">Quarter</th>
//               {Object.keys(allowedCategories).map((key) => (
//                 <th key={key} style={thStyle} className="dark:bg-slate-800 dark:text-white">{allowedCategories[key]}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="dark:bg-slate-800 dark:text-white">
//             {rows.map((r, i) => (
//               <tr key={i} style={{ textAlign: "center", borderBottom: "1px solid #eee" }} className="dark:bg-slate-800 dark:text-white">
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Quarter}</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Promoter}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.FII}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.DII}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Public}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Others}%</td>
//                 <td style={tdStyle} className="dark:bg-slate-800 dark:text-white">{r.Mutual_Funds}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const thStyle = {
//     padding: "10px",
//     fontWeight: "bold",
//     textAlign: "center",
//     borderBottom: "2px solid #ccc",
//   };

//   const tdStyle = {
//     padding: "8px",
//   };

//   if (isFetchingRating) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           Loading Ratings...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f7f9fc' }}>
//       <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
//         Shareholding Dashboard - {symbol}
//       </h2>

//       {/* Rating Section */}
//       <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//               Rate this chart:
//             </span>
//             {isAuthenticated ? (
//               renderStars(rating, "text-2xl", true)
//             ) : (
//               <span className="text-sm text-yellow-800 dark:text-yellow-300">
//                 Please login to rate.
//               </span>
//             )}
//           </div>
//           {isAuthenticated && isSubmitted && userRating && (
//             <div className="text-xs text-gray-600 dark:text-gray-400">
//               Your Rating: {userRating}/5
//             </div>
//           )}
//         </div>
//         {averageRating && (
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//               Average Rating:
//             </span>
//             {renderStars(averageRating, "text-xl")}
//             <span className="text-xs text-gray-600 dark:text-gray-400">
//               ({averageRating.toFixed(1)}/5)
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Graphs Row */}
//       <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
//         {/* Pie Chart */}
//         <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
//           <h3 style={{ textAlign: 'center' }} className="dark:text-black">Shareholding Summary</h3>
//           <PieChart width={400} height={400}>
//             <Pie
//               data={preparePieData()}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={120}
//               label={renderCustomLabel}
//             >
//               {preparePieData().map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <RechartsTooltip formatter={(value) => `${value}%`} />
//           </PieChart>
//           <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
//             {preparePieData().map((entry, i) => (
//               <div key={i} style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
//                 <div style={{ width: 10, height: 10, backgroundColor: COLORS[i % COLORS.length], marginRight: 5 }}></div>
//                 <span>{entry.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Line Chart */}
//         <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
//           <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h3 style={{ margin: 0 }}>5 Quarter Trend</h3>
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '6px' }}
//             >
//               {Object.entries(allowedCategories).map(([key, label]) => (
//                 <option key={key} value={key}>{label}</option>
//               ))}
//             </select>
//           </div>
//           <LineChart
//             width={500}
//             height={350}
//             data={prepareLineData()}
//             margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="Quarter" />
//             <YAxis unit="%" />
//             <RechartsTooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="Value"
//               stroke="#8884d8"
//               activeDot={{ r: 8 }}
//               name={allowedCategories[selectedCategory]}
//             />
//           </LineChart>
//         </div>
//       </div>

//       {/* Table */}
//       {renderTable()}
//     </div>
//   );
// };

// export default Shareholding;