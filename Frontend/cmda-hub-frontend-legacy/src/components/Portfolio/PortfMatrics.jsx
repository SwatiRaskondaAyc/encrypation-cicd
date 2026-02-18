// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Plot from "react-plotly.js";

// const PortfMatrics = () => {
//     const [portfolioData, setPortfolioData] = useState(null);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchPortfolioMetrics = async () => {
//             try {
//                 const response = await axios.post("http://localhost:8080/api/file/calculate_portfolio_metrics");

//                 console.log("Portfolio Data:", response.data); // Debugging

//                 if (!response.data || typeof response.data !== "object") {
//                     setError("Invalid response format.");
//                     return;
//                 }

//                 setPortfolioData(response.data); // Store received JSON data
//             } catch (err) {
//                 setError("Error fetching portfolio data.");
//                 console.error("API Error:", err.response ? err.response.data : err.message);
//             }
//         };

//         fetchPortfolioMetrics();
//     }, []);

//     return (
//         <div className="w-full flex flex-col items-center space-y-6 p-4">
//             {error && <p className="text-red-500">{error}</p>}

//             {portfolioData && (
//                 <>
//                     <div className="bg-gray-100 p-4 rounded shadow">
//                         <h2 className="text-lg font-semibold">Portfolio Metrics</h2>
//                         <p><strong>EPS:</strong> {portfolioData["Portfolio EPS"]}</p>
//                         <p><strong>PE Ratio:</strong> {portfolioData["Portfolio PE"]}</p>
//                         <p><strong>Book Value:</strong> {portfolioData["Portfolio BV"]}</p>
//                     </div>

//                     {/* Sector Allocation Pie Chart */}
//                     {portfolioData["Sector Allocation"] && (
//                         <Plot
//                             data={[
//                                 {
//                                     labels: Object.keys(portfolioData["Sector Allocation"]),
//                                     values: Object.values(portfolioData["Sector Allocation"]),
//                                     type: "pie",
//                                 },
//                             ]}
//                             layout={{ title: "Sector Allocation" }}
//                         />
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default PortfMatrics;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PortfMatrics = () => {
//     const [portfolioData, setPortfolioData] = useState(null);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchPortfolioMetrics = async () => {
//             try {
//                 const response = await axios.post("http://localhost:8080/api/file/calculate_portfolio_metrics");

//                 console.log("Portfolio Data:", response.data); // Debugging

//                 if (!response.data || typeof response.data !== "object") {
//                     setError("Invalid response format.");
//                     return;
//                 }

//                 setPortfolioData(response.data); // Store received JSON data
//             } catch (err) {
//                 setError("Error fetching portfolio data.");
//                 console.error("API Error:", err.response ? err.response.data : err.message);
//             }
//         };

//         fetchPortfolioMetrics();
//     }, []);

//     return (
//         <div className="w-full flex flex-col items-center space-y-6 p-4">
//             {error && <p className="text-red-500">{error}</p>}

//             {portfolioData && (
//                 <>
//                     <div className="bg-gray-100 p-4 rounded shadow w-full max-w-lg">
//                         <h2 className="text-lg font-semibold">Portfolio Metrics</h2>
//                         <p><strong>EPS:</strong> {portfolioData["Portfolio EPS"]}</p>
//                         <p><strong>PE Ratio:</strong> {portfolioData["Portfolio PE"]}</p>
//                         <p><strong>Book Value:</strong> {portfolioData["Portfolio BV"]}</p>
//                     </div>

//                     {/* Sector Allocation Table */}
//                     {portfolioData["Sector Allocation"] && (
//                         <div className="w-full max-w-lg bg-white shadow rounded p-4">
//                             <h2 className="text-lg font-semibold mb-2">Sector Allocation</h2>
//                             <table className="w-full border border-gray-300">
//                                 <thead>
//                                     <tr className="bg-gray-200">
//                                         <th className="border border-gray-300 p-2">Sector</th>
//                                         <th className="border border-gray-300 p-2">Allocation (%)</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {Object.entries(portfolioData["Sector Allocation"]).map(([sector, allocation]) => (
//                                         <tr key={sector} className="text-center border border-gray-300">
//                                             <td className="border border-gray-300 p-2">{sector}</td>
//                                             <td className="border border-gray-300 p-2">{allocation.toFixed(2)}%</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default PortfMatrics;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PortfMatrics = () => {
//     const [portfolioData, setPortfolioData] = useState(null);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchPortfolioMetrics = async () => {
//             try {
//                 const response = await axios.post("http://localhost:8080/api/file/calculate_portfolio_metrics");

//                 console.log("Portfolio Data:", response.data); // Debugging

//                 if (!response.data || typeof response.data !== "object") {
//                     setError("Invalid response format.");
//                     return;
//                 }

//                 setPortfolioData(response.data); // Store received JSON data
//             } catch (err) {
//                 setError("Error fetching portfolio data.");
//                 console.error("API Error:", err.response ? err.response.data : err.message);
//             }
//         };

//         fetchPortfolioMetrics();
//     }, []);

//     return (
//         <div className="w-full bg-gray-100 flex flex-col items-center space-y-4 p-4  mx-auto">
//             {error && <p className="text-red-500 font-semibold">{error}</p>}

//             {portfolioData && (
//                 <>

//                 <div className="max-w-lg flex flex-row ">
//                 {/* <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Metrics</h2> */}
//                         <div className="m-2 mb-2 mb-6 p-4 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 "><strong>EPS:</strong> {portfolioData["Portfolio EPS"]}</div>
//                         <div className="m-2 mb-2 mb-6 p-4 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4  border-cyan-500"><strong>PE Ratio:</strong> {portfolioData["Portfolio PE"]}</div>
//                         <div  className="m-2 mb-2 mb-6 p-4 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4  border-cyan-500 "><strong>Book Value:</strong> {portfolioData["Portfolio BV"]}</div>
                   
//                 </div>
                    
//                     {/* Sector Allocation Table */}
//                     {portfolioData["Sector Allocation"] && (
//                         <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-4 border border-gray-200 overflow-hidden">
//                             <h2 className="text-lg font-bold text-gray-900 mb-3">Sector Allocation BreakDown</h2>
//                             <div className="overflow-y-auto max-h-60">
                               
//                                 <table className="w-full border-collapse text-gray-700 shadow-lg rounded-lg overflow-hidden">
//     <thead>
//         <tr className="bg-gray-800 text-white text-left">
//             <th className="p-4 border-b font-semibold">Sector</th>
//             <th className="p-4 border-b font-semibold">Allocation (%)</th>
//         </tr>
//     </thead>
//     <tbody>
//         {Object.entries(portfolioData["Sector Allocation"]).map(([sector, allocation]) => (
//             <tr key={sector} className="hover:bg-gray-100">
//                 <td className="p-4 border-b text-gray-900">{sector}</td>
//                 <td className="p-4 border-b text-gray-900">{allocation.toFixed(2)}%</td>
//             </tr>
//         ))}
//     </tbody>
// </table>

//                             </div>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default PortfMatrics;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PortfMatrics = ({ uploadId }) => {
//     const [portfolioData, setPortfolioData] = useState(null);
//     const [error, setError] = useState("");
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     useEffect(() => {
//         const fetchPortfolioMetrics = async () => {
//             try {
//                 const response = await axios.post(`${API_BASE}/api/file/calculate_portfolio_metrics`,null,{
//                     params: { uploadId },
//                 });
//                 console.log("Portfolio Data:", response.data); // Debugging

//                 if (!response.data || typeof response.data !== "object") {
//                     setError("Invalid response format.");
//                     return;
//                 }

//                 setPortfolioData(response.data); // Store received JSON data
//             } catch (err) {
//                 setError("Error fetching portfolio data.");
//                 console.error("API Error:", err.response ? err.response.data : err.message);
//             }
//         };

//         fetchPortfolioMetrics();
//     }, [uploadId]);

//     return (
//         <div className="w-full bg-gray-50 flex flex-col items-center space-y-6 p-6 mx-auto">
//             {error && <p className="text-red-500 font-semibold">{error}</p>}

//             {portfolioData && (
//                 <>
//                     <div className="max-w-3xl w-full flex flex-wrap justify-center items-center space-x-6 space-y-4">
//                     <div className="w-full flex justify-between space-x-6">
//                     <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//                         <strong className="text-lg">EPS</strong>
//                         <div className="text-xl font-semibold text-gray-900">{portfolioData["Portfolio EPS"]}</div>
//                     </div>
//                     <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//                         <strong className="text-lg">PE Ratio</strong>
//                         <div className="text-xl font-semibold text-gray-900">{portfolioData["Portfolio PE"]}</div>
//                     </div>
//                     <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//                         <strong className="text-lg">Book Value</strong>
//                         <div className="text-xl font-semibold text-gray-900">{portfolioData["Portfolio BV"]}</div>
//                     </div>
//                 </div>

//                     </div>

//                     {/* Sector Allocation Table */}
//                     {portfolioData["Sector Allocation"] && (
//                         <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 border border-gray-200 overflow-hidden">
//                             <h2 className="text-xl font-bold text-gray-900 mb-4">Sector Allocation Breakdown</h2>
//                             <div className="overflow-y-auto max-h-80">
//                                 <table className="w-full border-collapse text-gray-700 shadow-lg rounded-lg overflow-hidden">
//                                     <thead>
//                                         <tr className="bg-gray-800 text-white text-left">
//                                             <th className="p-4 border-b font-semibold">Sector</th>
//                                             <th className="p-4 border-b font-semibold">Allocation (%)</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {Object.entries(portfolioData["Sector Allocation"]).map(([sector, allocation]) => (
//                                             <tr key={sector} className="hover:bg-gray-100">
//                                                 <td className="p-4 border-b text-gray-900">{sector}</td>
//                                                 <td className="p-4 border-b text-gray-900">{allocation}%</td>
//                                             </tr>
//                                         ))}

//                                             {/* {Object.entries(portfolioData["Sector Allocation"]).map(([sector, allocation]) => (
//                                                 <tr key={sector} className="hover:bg-gray-100">
//                                                     <td className="p-4 border-b text-gray-900">{sector}</td>
//                                                     <td className="p-4 border-b text-gray-900">
//                                                         {typeof allocation === 'number' && !isNaN(allocation)
//                                                             ? allocation.toFixed(2)
//                                                             : 'N/A'} %
//                                                     </td>
//                                                 </tr>
//                                             ))} */}

//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}

//                     <div className="w-full flex justify-between space-x-6">
//                         <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg  border-cyan-500 shadow-lg flex-1">
//                             <strong className="text-lg flex justify-center items-center ">🔍 Key Insights</strong>
//                             <div className="text-l font-semibold text-gray-900"><span className="text-cyan-900 dark:text-white ">⚠️ High Concentration in Capital Goods</span>

//                                 <br />
//                             <span className="text-black-900 dark:text-white ">Your portfolio has 80.1% exposure to the Capital Goods sector. Overconcentration increases risk if the sector underperforms due to economic cycles or industry-specific challenges.</span></div>
//                         </div>
//                         <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg  border-cyan-500 shadow-lg flex-1">
//                             <strong className="text-lg  flex justify-center items-center ">💡 Recommended Actions</strong>
//                             <div className="text-l font-semibold text-gray-900"><span className="text-cyan-900 dark:text-white ">👉 Diversify from Capital Goods Sector</span>

//                                 <br />
//                             <span className="text-black-900 dark:text-white ">Consider rebalancing by adding stocks from sectors that perform well in different economic conditions to reduce risk.</span></div>
//                         </div>
                        
//                     </div>

//                 </>
//             )}
//         </div>
//     );
// };

// export default PortfMatrics;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PortfMatrics = (  ) => {
//     const [portfolioData, setPortfolioData] = useState(null);
//     const [error, setError] = useState("");
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;


//     useEffect(() => {
//     const fetchPortfolioMetrics = async () => {
//         const uploadId = localStorage.getItem("uploadId"); // ✅ Get from localStorage or props
    
//         if (!uploadId) {
//             setError("Missing uploadId. Please upload a file first.");
//             return;
//         }

//         try {
//             const response = await axios.post(`${API_BASE}/api/file/calculate_portfolio_metrics`,
//                 new URLSearchParams({ uploadId }), // use form format
//            );

//             console.log("Portfolio Data:", response.data); // Debugging

//             if (!response.data || typeof response.data !== "object") {
//                 setError("Invalid response format.");
//                 return;
//             }

//             setPortfolioData(response.data); // Store received JSON data
//         } catch (err) {
//             setError("Error fetching portfolio data.");
//             console.error("API Error:", err.response ? err.response.data : err.message);
//         }
//     };

//     fetchPortfolioMetrics();
// }, []);


//     return (
//         <div className="w-full bg-gray-50 flex flex-col items-center space-y-6 p-6 mx-auto">
//             {error && <p className="text-red-500 font-semibold">{error}</p>}

//             {portfolioData && (
//                 <>
//                     <div className="max-w-3xl w-full flex flex-wrap justify-center items-center space-x-6 space-y-4">
//                     <div className="w-full flex justify-between space-x-6">
//                     <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//                         <strong className="text-lg">EPS</strong>
//                         <div className="text-xl font-semibold text-gray-900">{portfolioData["Portfolio EPS"]}</div>
//                     </div>
//                     <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//                         <strong className="text-lg">PE Ratio</strong>
//                         <div className="text-xl font-semibold text-gray-900">{portfolioData["Portfolio PE"]}</div>
//                     </div>
//                     <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//                         <strong className="text-lg">Book Value</strong>
//                         <div className="text-xl font-semibold text-gray-900">{portfolioData["Portfolio BV"]}</div>
//                     </div>
//                 </div>

//                     </div>

//                     {/* Sector Allocation Table */}
//                     {portfolioData["Sector Allocation"] && (
//                         <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 border border-gray-200 overflow-hidden">
//                             <h2 className="text-xl font-bold text-gray-900 mb-4">Sector Allocation Breakdown</h2>
//                             <div className="overflow-y-auto max-h-80">
//                                 <table className="w-full border-collapse text-gray-700 shadow-lg rounded-lg overflow-hidden">
//                                     <thead>
//                                         <tr className="bg-gray-800 text-white text-left">
//                                             <th className="p-4 border-b font-semibold">Sector</th>
//                                             <th className="p-4 border-b font-semibold">Allocation (%)</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {Object.entries(portfolioData["Sector Allocation"]).map(([sector, allocation]) => (
//                                             <tr key={sector} className="hover:bg-gray-100">
//                                                 <td className="p-4 border-b text-gray-900">{sector}</td>
//                                                 <td className="p-4 border-b text-gray-900">{allocation}%</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}

//                     <div className="w-full flex justify-between space-x-6">
//                         <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg  border-cyan-500 shadow-lg flex-1">
//                             <strong className="text-lg flex justify-center items-center ">🔍 Key Insights</strong>
//                             <div className="text-l font-semibold text-gray-900"><span className="text-cyan-900 dark:text-white ">⚠️ High Concentration in Capital Goods</span>

//                                 <br />
//                             <span className="text-black-900 dark:text-white ">Your portfolio has 80.1% exposure to the Capital Goods sector. Overconcentration increases risk if the sector underperforms due to economic cycles or industry-specific challenges.</span></div>
//                         </div>
//                         <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg  border-cyan-500 shadow-lg flex-1">
//                             <strong className="text-lg  flex justify-center items-center ">💡 Recommended Actions</strong>
//                             <div className="text-l font-semibold text-gray-900"><span className="text-cyan-900 dark:text-white ">👉 Diversify from Capital Goods Sector</span>

//                                 <br />
//                             <span className="text-black-900 dark:text-white ">Consider rebalancing by adding stocks from sectors that perform well in different economic conditions to reduce risk.</span></div>
//                         </div>
                        
//                     </div>

//                 </>
//             )}
//         </div>
//     );
// };

// export default PortfMatrics;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useGraphData } from "./GraphDataContext";

// const PortfMatrics = () => {
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [error, setError] = useState("");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const { getGraphData, setGraphData } = useGraphData();

//   useEffect(() => {
//     const fetchPortfolioMetrics = async () => {
//       const uploadId = localStorage.getItem("uploadId");
//       const cacheKey = `portfolio_metrics_${uploadId}`;

//       if (!uploadId) {
//         setError("Missing uploadId. Please upload a file first.");
//         return;
//       }

//       // Check cache first
//       const cachedData = getGraphData(cacheKey);
//       if (cachedData) {
//         setPortfolioData(cachedData);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE}/api/file/calculate_portfolio_metrics`,
//           new URLSearchParams({ uploadId })
//         );

//         console.log("Portfolio Data:", response.data);

//         if (!response.data || typeof response.data !== "object") {
//           setError("Invalid response format.");
//           return;
//         }

//         setPortfolioData(response.data);
//         // Cache the data
//         setGraphData(cacheKey, response.data);
//       } catch (err) {
//         setError("Error fetching portfolio data.");
//         console.error("API Error:", err.response ? err.response.data : err.message);
//       }
//     };

//     fetchPortfolioMetrics();
//   }, [getGraphData, setGraphData]);

//   return (
//     <div className="w-full bg-gray-50 flex flex-col items-center space-y-6 p-6 mx-auto">
//       {error && <p className="text-red-500 font-semibold">{error}</p>}
//       {portfolioData && (
//         <>
//           <div className="max-w-3xl w-full flex flex-wrap justify-center items-center space-x-6 space-y-4">
//             <div className="w-full flex justify-between space-x-6">
//               <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//                 <strong className="text-lg">EPS</strong>
//                 <div className="text-xl font-semibold text-gray-900">{portfolioData["Portfolio EPS"]}</div>
//               </div>
//               <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//                 <strong className="text-lg">PE Ratio</strong>
//                 <div className="text-xl font-semibold text-gray-900">{portfolioData["Portfolio PE"]}</div>
//               </div>
//               <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//                 <strong className="text-lg">Book Value</strong>
//                 <div className="text-xl font-semibold text-gray-900">{portfolioData["Portfolio BV"]}</div>
//               </div>
//             </div>
//           </div>
//           {portfolioData["Sector Allocation"] && (
//             <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 border border-gray-200 overflow-hidden">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Sector Allocation Breakdown</h2>
//               <div className="overflow-y-auto max-h-80">
//                 <table className="w-full border-collapse text-gray-700 shadow-lg rounded-lg overflow-hidden">
//                   <thead>
//                     <tr className="bg-gray-800 text-white text-left">
//                       <th className="p-4 border-b font-semibold">Sector</th>
//                       <th className="p-4 border-b font-semibold">Allocation (%)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Object.entries(portfolioData["Sector Allocation"]).map(([sector, allocation]) => (
//                       <tr key={sector} className="hover:bg-gray-100">
//                         <td className="p-4 border-b text-gray-900">{sector}</td>
//                         <td className="p-4 border-b text-gray-900">{allocation}%</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//           <div className="w-full flex justify-between space-x-6">
//             <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//               <strong className="text-lg flex justify-center items-center">🔍 Key Insights</strong>
//               <div className="text-l font-semibold text-gray-900">
//                 <span className="text-cyan-900 dark:text-white">⚠️ High Concentration in Capital Goods</span>
//                 <br />
//                 <span className="text-black-900 dark:text-white">
//                   Your portfolio has 80.1% exposure to the Capital Goods sector. Overconcentration increases risk if the
//                   sector underperforms due to economic cycles or industry-specific challenges.
//                 </span>
//               </div>
//             </div>
//             <div className="p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg flex-1">
//               <strong className="text-lg flex justify-center items-center">💡 Recommended Actions</strong>
//               <div className="text-l font-semibold text-gray-900">
//                 <span className="text-cyan-900 dark:text-white">👉 Diversify from Capital Goods Sector</span>
//                 <br />
//                 <span className="text-black-900 dark:text-white">
//                   Consider rebalancing by adding stocks from sectors that perform well in different economic conditions to
//                   reduce risk.
//                 </span>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PortfMatrics;




import React, { useEffect, useState } from "react";
import axios from "axios";

const PortfMatrics = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    const fetchPortfolioMetrics = async () => {
      const uploadId = localStorage.getItem("uploadId");

      if (!uploadId) {
        setError(" Please upload a file first.");
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE}/file/calculate_portfolio_metrics`,
          new URLSearchParams({ uploadId })
        );

        if (!response.data || typeof response.data !== "object") {
          setError("Invalid response format.");
          return;
        }

        setPortfolioData(response.data);
      } catch (err) {
        setError("Error fetching portfolio data.");
        console.error("API Error:", err.response ? err.response.data : err.message);
      }
    };

    fetchPortfolioMetrics();
  }, []);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-4 md:p-6 space-y-6">
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {portfolioData && (
        <>
          {/* Top Metrics */}
          <div className="w-full max-w-5xl flex flex-col md:flex-row md:justify-between gap-4">
            {[
              ["EPS", portfolioData["Portfolio EPS"]],
              ["PE Ratio", portfolioData["Portfolio PE"]],
              ["Book Value", portfolioData["Portfolio BV"]],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex-1 p-4 bg-cyan-100 dark:bg-cyan-900 rounded-lg border-l-4 border-cyan-500 shadow-lg dark:text-white"
              >
                <strong className="text-lg dark:text-white">{label}</strong>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">{value}</div>
              </div>
            ))}
          </div>

          {/* Sector Allocation Table */}
          {portfolioData["Sector Allocation"] && (
            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 overflow-hidden">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sector Allocation Breakdown</h2>
              <div className="overflow-y-auto max-h-80">
                <table className="w-full border-collapse text-gray-700 dark:text-gray-100">
                  <thead>
                    <tr className="bg-gray-800 text-white text-left">
                      <th className="p-4 border-b font-semibold">Sector</th>
                      <th className="p-4 border-b font-semibold">Allocation (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(portfolioData["Sector Allocation"]).map(([sector, allocation]) => (
                      <tr key={sector} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="p-4 border-b">{sector}</td>
                        <td className="p-4 border-b">{allocation}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Key Insights & Actions */}
          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4">
            {/* Key Insights */}
            <div className="flex-1 p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg shadow-lg">
              <strong className="text-lg flex justify-center mb-2 dark:text-white">🔍 Key Insights</strong>
              <div className="text-gray-900 dark:text-white text-sm font-medium ">
                ⚠️ High Concentration in Capital Goods
                <br />
                <span>
                  Your portfolio has 80.1% exposure to the Capital Goods sector.
                  Overconcentration increases risk if the sector underperforms due to economic cycles or industry-specific challenges.
                </span>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="flex-1 p-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg shadow-lg">
              <strong className="text-lg flex justify-center mb-2 dark:text-white">💡 Recommended Actions</strong>
              <div className="text-gray-900 dark:text-white text-sm font-medium">
                👉 Diversify from Capital Goods Sector
                <br />
                <span>
                  Consider rebalancing by adding stocks from sectors that perform well in different economic conditions to reduce risk.
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PortfMatrics;