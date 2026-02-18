// import React from 'react';  

// const Mysearch=() =>
// {

//     return(

//         <>

//         <div>
//             <h1>Search</h1>
//         </div>
//         </>
//     )
// };

// export default Mysearch;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Mysearch = ({ API_BASE, getAuthToken, selectedStocks, setSelectedStocks, scrollToStock, setActiveTab }) => {
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch saved stocks on mount
//   useEffect(() => {
//     const fetchSavedStocks = async () => {
//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error("Please log in to view saved stocks.");
//         }

//         const response = await axios.get(`${API_BASE}/api/stocks/saved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setSavedStocks(response.data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching saved stocks:", error);
//         setError(error.response?.data?.error || error.message || "Failed to fetch saved stocks.");
//         setSavedStocks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSavedStocks();
//   }, [API_BASE, getAuthToken]);

//   // Handle search button click
//   const handleSearchStock = async (stock) => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         throw new Error("Please log in to search for stocks.");
//       }

//       // Check if stock is already selected
//       if (selectedStocks.some((s) => s.symbol === stock.symbol)) {
//         setActiveTab("hub"); // Switch to Equity Hub
//         scrollToStock(stock.symbol);
//         return;
//       }

//       // Fetch stock details with shouldSave=true to update database
//       const response = await axios.get(`${API_BASE}/api/stocks/search`, {
//         params: { query: stock.symbol, shouldSave: true },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.length > 0) {
//         const newStock = response.data[0];
//         setSelectedStocks((prevStocks) => {
//           const updatedStocks = [...prevStocks, newStock];
//           setTimeout(() => {
//             setActiveTab("hub"); // Switch to Equity Hub
//             scrollToStock(newStock.symbol);
//           }, 100);
//           return updatedStocks;
//         });
//         setError(null);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error searching stock:", error);
//       setError(error.response?.data?.error || error.message || "Failed to search stock.");
//     }
//   };

//   return (
//     <>
//       <div className="px-4 md:px-10 py-10">
//         <h1 className="text-lg md:text-2xl font-bold mb-6 text-center">Search</h1>

//         {error && (
//           <div className="text-center text-red-500 mb-4">{error}</div>
//         )}

//         {loading ? (
//           <div className="text-center">
//             <span className="loading loading-spinner loading-lg"></span>
//           </div>
//         ) : savedStocks.length === 0 ? (
//           <div className="text-center text-gray-500">
//             No saved stocks found. Save stocks from the Equity Hub tab.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="table w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600">
//               <thead>
//                 <tr className="bg-gray-100 dark:bg-slate-700">
//                   <th className="px-4 py-2 text-left">User ID</th>
//                   <th className="px-4 py-2 text-left">User Type</th>
//                   <th className="px-4 py-2 text-left">Symbol</th>
//                   <th className="px-4 py-2 text-left">Company Name</th>
//                   <th className="px-4 py-2 text-left">Updated At</th>
//                   <th className="px-4 py-2 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {savedStocks.map((stock, index) => (
//                   <tr key={index} className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700">
//                     <td className="px-4 py-2">{stock.userID}</td>
//                     <td className="px-4 py-2">{stock.userType}</td>
//                     <td className="px-4 py-2">{stock.symbol}</td>
//                     <td className="px-4 py-2">{stock.companyName}</td>
//                     <td className="px-4 py-2">{stock.updatedAt}</td>
//                     <td className="px-4 py-2">
//                       <button
//                         className="btn btn-sm btn-primary"
//                         onClick={() => handleSearchStock(stock)}
//                       >
//                         Search
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Mysearch;

// .....................taking time --------------------------
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import GraphSlider from './GraphSlider';
// import OpenCloseCards from './OpenCloseCards';

// const Mysearch = ({ API_BASE, getAuthToken }) => {
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [displayStocks, setDisplayStocks] = useState(() => {
//     // Load from localStorage on mount
//     const saved = localStorage.getItem('mysearchDisplayStocks');
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Save displayStocks to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('mysearchDisplayStocks', JSON.stringify(displayStocks));
//   }, [displayStocks]);

//   // Fetch saved stocks on mount
//   useEffect(() => {
//     const fetchSavedStocks = async () => {
//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error("Please log in to view saved stocks.");
//         }

//         const response = await axios.get(`${API_BASE}/api/stocks/saved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setSavedStocks(response.data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching saved stocks:", error);
//         setError(error.response?.data?.error || error.message || "Failed to fetch saved stocks.");
//         setSavedStocks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSavedStocks();
//   }, [API_BASE, getAuthToken]);

//   // Handle search button click
//   const handleSearchStock = async (stock) => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         throw new Error("Please log in to search for stocks.");
//       }

//       // Check if stock is already in displayStocks
//       if (displayStocks.some((s) => s.symbol === stock.symbol)) {
//         setError("Stock already displayed.");
//         return;
//       }

//       // Fetch stock details with shouldSave=true to ensure it’s saved
//       const response = await axios.get(`${API_BASE}/api/stocks/search`, {
//         params: { query: stock.symbol, shouldSave: true },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.length > 0) {
//         const newStock = response.data[0];
//         setDisplayStocks((prevStocks) => [...prevStocks, newStock]); // Add to displayStocks
//         setError(null);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error searching stock:", error);
//       setError(error.response?.data?.error || error.message || "Failed to search stock.");
//     }
//   };

//   // Remove a stock from displayStocks
//   const removeStock = (symbol) => {
//     setDisplayStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div className="px-4 md:px-10 py-10">
//       <h1 className="text-lg md:text-2xl font-bold mb-6 text-center">Search</h1>

//       {error && (
//         <div className="text-center text-red-500 mb-4">{error}</div>
//       )}

//       {loading ? (
//         <div className="text-center">
//           <span className="loading loading-spinner loading-lg"></span>
//         </div>
//       ) : savedStocks.length === 0 ? (
//         <div className="text-center text-gray-500">
//           No saved stocks found. Save stocks from the Equity Hub tab.
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="table w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600">
//             <thead>
//               <tr className="bg-gray-100 dark:bg-slate-700">
//                 <th className="px-4 py-2 text-left">User ID</th>
//                 <th className="px-4 py-2 text-left">User Type</th>
//                 <th className="px-4 py-2 text-left">Symbol</th>
//                 <th className="px-4 py-2 text-left">Company Name</th>
//                 <th className="px-4 py-2 text-left">Updated At</th>
//                 <th className="px-4 py-2 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {savedStocks.map((stock, index) => (
//                 <tr key={index} className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700">
//                   <td className="px-4 py-2">{stock.userID}</td>
//                   <td className="px-4 py-2">{stock.userType}</td>
//                   <td className="px-4 py-2">{stock.symbol}</td>
//                   <td className="px-4 py-2">{stock.companyName}</td>
//                   <td className="px-4 py-2">{stock.updatedAt}</td>
//                   <td className="px-4 py-2">
//                     <button
//                       className="btn btn-sm btn-primary"
//                       onClick={() => handleSearchStock(stock)}
//                     >
//                       Search
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Display selected stocks comparatively */}
//       {displayStocks.length > 0 && (
//         <div className="mt-10 px-4 md:px-10">
//           <h2 className="text-lg md:text-2xl font-bold text-cyan-700 text-center mb-6">
//             Selected Stocks
//           </h2>
//           {/* Tags for selected stocks */}
//           <div className="flex flex-wrap gap-2 mb-6 justify-center">
//             {displayStocks.map((stock) => (
//               <span
//                 key={stock.symbol}
//                 className="flex items-center m-1 bg-gray-600 text-xl text-white p-1 rounded-lg"
//               >
//                 {stock.symbol} - {stock.companyName}
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           {/* Grid for GraphSlider and OpenCloseCards */}
//           <div
//             className={`grid w-full ${
//               displayStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//             } gap-4`}
//           >
//             {displayStocks.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className={`dark:bg-slate-800 p-6 dark:border-gray-600 ${
//                   displayStocks.length === 1 ? "w-full" : "w-auto"
//                 }`}
//               >
//                 <h2 className="text-lg md:text-2xl font-bold text-cyan-700 mb-4">
//                   <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//                 </h2>
//                 <div className="mt-4">
//                   <OpenCloseCards
//                     symbol={stock.symbol}
//                     companyName={stock.companyName}
//                   />
//                 </div>
//                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
//                   <GraphSlider
//                     symbol={stock.symbol}
//                     isFullWidth={displayStocks.length === 1}
//                   />
//                 </div>

//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Mysearch;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import GraphSlider from './GraphSlider';
// import OpenCloseCards from './OpenCloseCards';

// const Mysearch = ({ API_BASE, getAuthToken }) => {
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [displayStocks, setDisplayStocks] = useState(() => {
//     const saved = localStorage.getItem('mysearchDisplayStocks');
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     localStorage.setItem('mysearchDisplayStocks', JSON.stringify(displayStocks));
//   }, [displayStocks]);

//   useEffect(() => {
//     const fetchSavedStocks = async () => {
//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error("Please log in to view saved stocks.");
//         }

//         const response = await axios.get(`${API_BASE}/api/stocks/saved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setSavedStocks(response.data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching saved stocks:", error);
//         setError(error.response?.data?.error || error.message || "Failed to fetch saved stocks.");
//         setSavedStocks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSavedStocks();
//   }, [API_BASE, getAuthToken]);

//   const handleSearchStock = async (stock) => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         throw new Error("Please log in to search for stocks.");
//       }

//       if (displayStocks.some((s) => s.symbol === stock.symbol)) {
//         setError("Stock already displayed.");
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/api/stocks/search`, {
//         params: { query: stock.symbol, shouldSave: true },
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       if (response.data.length > 0) {
//         const newStock = response.data[0];
//         setDisplayStocks((prevStocks) => [...prevStocks, newStock]);
//         setError(null);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error searching stock:", error);
//       setError(error.response?.data?.error || error.message || "Failed to search stock.");
//     }
//   };

//   const handleDeleteStock = async (stock) => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         throw new Error("Please log in to delete stocks.");
//       }

//       const response = await axios.delete(`${API_BASE}/api/stocks/delete`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         data: {
//           symbol: stock.symbol,
//           companyName: stock.companyName,
//         },
//         timeout: 10000,
//       });

//       setSavedStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol || s.companyName !== stock.companyName)
//       );

//       setDisplayStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol || s.companyName !== stock.companyName)
//       );

//       setError(null);
//     } catch (error) {
//       console.error("Error deleting stock:", error);
//       setError(error.response?.data?.error || error.message || "Failed to delete stock.");
//     }
//   };

//   const removeStock = (symbol) => {
//     setDisplayStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div className="px-4 md:px-10 py-10">
//       <h1 className="text-lg md:text-2xl font-bold mb-6 text-center">Search</h1>

//    {error && (
//   <div
//     role="alert"
//     className="max-w-md mx-auto mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-400 text-red-700 shadow-sm text-center font-medium"
//   >
//     {error}
//   </div>
// )}


//       {loading ? (
//         <div className="text-center">
//           <span className="loading loading-spinner loading-lg"></span>
//         </div>
//       ) : savedStocks.length === 0 ? (
//         <div className="text-center text-gray-500">
//           No saved stocks found. Save stocks from the Equity Hub tab.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {savedStocks.map((stock, index) => (
//             <div
//               key={index}
//               className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl shadow-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
//             >
//               <div className="flex flex-col space-y-2">
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
//                     {stock.symbol}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-300">{stock.companyName}</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     className="btn btn-sm btn-primary"
//                     onClick={() => handleSearchStock(stock)}
//                   >
//                     Search
//                   </button>
//                   <button
//                     className="btn btn-sm btn-error text-white"
//                     onClick={() => handleDeleteStock(stock)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {displayStocks.length > 0 && (
//         <div className="mt-10 px-4 md:px-10">
//           <h2 className="text-lg md:text-2xl font-bold text-cyan-700 text-center mb-6">
//             Selected Stocks
//           </h2>
//           <div className="flex flex-wrap gap-2 mb-6 justify-center">
//             {displayStocks.map((stock) => (
//               <span
//                 key={stock.symbol}
//                 className="flex items-center m-1 bg-gray-600 text-xl text-white p-1 rounded-lg"
//               >
//                 {stock.symbol} - {stock.companyName}
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           <div
//             className={`grid w-full ${
//               displayStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//             } gap-4`}
//           >
//             {displayStocks.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className={`dark:bg-slate-800 p-6 dark:border-gray-600 ${
//                   displayStocks.length === 1 ? "w-full" : "w-auto"
//                 }`}
//               >
//                 <h2 className="text-lg md:text-2xl font-bold text-cyan-700 mb-4">
//                   <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//                 </h2>
//                 <div className="mt-4">
//                   <OpenCloseCards
//                     symbol={stock.symbol}
//                     companyName={stock.companyName}
//                   />
//                 </div>
//                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
//                   <GraphSlider
//                     symbol={stock.symbol}
//                     isFullWidth={displayStocks.length === 1}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Mysearch;

// ++++++++++++++++++++workking code++++++++++++++++++++++++++++++++

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import GraphSlider from './GraphSlider';
// import OpenCloseCards from './OpenCloseCards';

// const Mysearch = ({ API_BASE, getAuthToken }) => {
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [displayStocks, setDisplayStocks] = useState(() => {
//     const saved = localStorage.getItem('mysearchDisplayStocks');
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     const { data, timestamp } = JSON.parse(cached);
//     if (Date.now() - timestamp > CACHE_TTL) {
//       localStorage.removeItem(key);
//       return null;
//     }
//     return data;
//   };

//   const setCachedData = (key, data) => {
//     localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//   };

//   useEffect(() => {
//     localStorage.setItem('mysearchDisplayStocks', JSON.stringify(displayStocks));
//   }, [displayStocks]);

//   useEffect(() => {
//     const fetchSavedStocks = async () => {
//       const cacheKey = `saved_stocks_${getAuthToken() || 'guest'}`;
//       const cachedStocks = getCachedData(cacheKey);
//       if (cachedStocks) {
//         setSavedStocks(cachedStocks);
//         setLoading(false);
//         return;
//       }

//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error("Please log in to view saved stocks.");
//         }

//         const response = await axios.get(`${API_BASE}/stocks/saved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setSavedStocks(response.data);
//         setCachedData(cacheKey, response.data);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching saved stocks:", error);
//         setError(error.response?.data?.error || error.message || "Failed to fetch saved stocks.");
//         setSavedStocks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSavedStocks();
//   }, [API_BASE, getAuthToken]);

//   const handleSearchStock = async (stock) => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         throw new Error("Please log in to search for stocks.");
//       }

//       if (displayStocks.some((s) => s.symbol === stock.symbol)) {
//         setError("Stock already displayed.");
//         return;
//       }

//       const cacheKey = `stock_${stock.symbol}`;
//       const cachedStock = getCachedData(cacheKey);
//       if (cachedStock) {
//         setDisplayStocks((prevStocks) => [...prevStocks, cachedStock]);
//         setError(null);
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/stocks/search`, {
//         params: { query: stock.symbol, shouldSave: true },
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       if (response.data.length > 0) {
//         const newStock = response.data[0];
//         setDisplayStocks((prevStocks) => [...prevStocks, newStock]);
//         setCachedData(cacheKey, newStock);
//         setError(null);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error searching stock:", error);
//       setError(error.response?.data?.error || error.message || "Failed to search stock.");
//     }
//   };

//   const handleDeleteStock = async (stock) => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         throw new Error("Please log in to delete stocks.");
//       }

//       const response = await axios.delete(`${API_BASE}/stocks/delete`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         data: {
//           symbol: stock.symbol,
//           companyName: stock.companyName,
//         },
//         timeout: 10000,
//       });

//       setSavedStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol || s.companyName !== stock.companyName)
//       );
//       setDisplayStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol || s.companyName !== stock.companyName)
//       );

//       // Invalidate cache
//       const cacheKey = `saved_stocks_${token}`;
//       localStorage.removeItem(cacheKey);
//       setError(null);
//     } catch (error) {
//       console.error("Error deleting stock:", error);
//       setError(error.response?.data?.error || error.message || "Failed to delete stock.");
//     }
//   };

//   const removeStock = (symbol) => {
//     setDisplayStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div className="px-4 md:px-10 py-10">
//       <h1 className="text-lg md:text-2xl font-bold mb-6 text-center">Search</h1>
//       {error && (
//         <div
//           role="alert"
//           className="max-w-md mx-auto mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-400 text-red-700 shadow-sm text-center font-medium"
//         >
//           {error}
//         </div>
//       )}
//       {loading ? (
//         <div className="text-center">
//           <span className="loading loading-spinner loading-lg"></span>
//         </div>
//       ) : savedStocks.length === 0 ? (
//         <div className="text-center text-gray-500">
//           No saved stocks found. Save stocks from the Equity Hub tab.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {savedStocks.map((stock, index) => (
//             <div
//               key={index}
//               className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl shadow-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
//             >
//               <div className="flex flex-col space-y-2">
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
//                     {stock.symbol}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-300">{stock.companyName}</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     className="btn btn-sm btn-primary"
//                     onClick={() => handleSearchStock(stock)}
//                   >
//                     Search
//                   </button>
//                   <button
//                     className="btn btn-sm btn-error text-white"
//                     onClick={() => handleDeleteStock(stock)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       {displayStocks.length > 0 && (
//         <div className="mt-10 px-4 md:px-10">
//           <h2 className="text-lg md:text-2xl font-bold text-cyan-700 text-center mb-6">
//             Selected Stocks
//           </h2>
//           <div className="flex flex-wrap gap-2 mb-6 justify-center">
//             {displayStocks.map((stock) => (
//               <span
//                 key={stock.symbol}
//                 className="flex items-center m-1 bg-gray-600 text-xl text-white p-1 rounded-lg"
//               >
//                 {stock.symbol} - {stock.companyName}
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           <div
//             className={`grid w-full ${
//               displayStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//             } gap-4`}
//           >
//             {displayStocks.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className={`dark:bg-slate-800 p-6 dark:border-gray-600 ${
//                   displayStocks.length === 1 ? "w-full" : "w-auto"
//                 }`}
//               >
//                 <h2 className="text-lg md:text-2xl font-bold text-cyan-700 mb-4">
//                   <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//                 </h2>
//                 <div className="mt-4">
//                   <OpenCloseCards
//                     symbol={stock.symbol}
//                     companyName={stock.companyName}
//                   />
//                 </div>
//                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
//                   <GraphSlider
//                     symbol={stock.symbol}
//                     isFullWidth={displayStocks.length === 1}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Mysearch;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import GraphSlider from './GraphSlider';
// import OpenCloseCards from './OpenCloseCards';
// import { HashLoader } from 'react-spinners';

// const Mysearch = ({ API_BASE, getAuthToken }) => {
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [displayStocks, setDisplayStocks] = useState(() => {
//     const saved = localStorage.getItem('mysearchDisplayStocks');
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > CACHE_TTL) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       console.error("Failed to parse cached data:", err);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       console.error("Failed to cache data:", err);
//       setError("Failed to cache data.");
//     }
//   };

//   useEffect(() => {
//     localStorage.setItem('mysearchDisplayStocks', JSON.stringify(displayStocks));
//   }, [displayStocks]);

//   const fetchSavedStocks = async () => {
//     setLoading(true);
//     const token = getAuthToken ? getAuthToken() : null;
//     const cacheKey = `saved_stocks_${token || 'guest'}`;
//     const cachedStocks = getCachedData(cacheKey);

//     if (cachedStocks) {
//       setSavedStocks(cachedStocks);
//       setLoading(false);
//       return;
//     }

//     if (!token) {
//       setError("Please log in to view saved stocks.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/stocks/test/saved`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       const stocks = Array.isArray(response.data) ? response.data : response.data.stocks || [];
//       if (stocks.length > 0) {
//         setSavedStocks(stocks);
//         setCachedData(cacheKey, stocks);
//         setError(null);
//       } else {
//         // setError("No saved stocks found on the server.");
//       }
//     } catch (error) {
//       console.error("Error fetching saved stocks:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 401
//           ? "Unauthorized. Please log in again."
//           : error.response?.status === 404
//           ? "Endpoint not found. Check server configuration."
//           : error.response?.data?.error || error.message || "Failed to fetch saved stocks."
//       );
//       setSavedStocks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSavedStocks();
//   }, [API_BASE, getAuthToken]);

//   const handleSearchStock = async (stock) => {
//     try {
//       const token = getAuthToken ? getAuthToken() : null;
//       if (!token) {
//         throw new Error("Please log in to search for stocks.");
//       }

//       if (displayStocks.some((s) => s.symbol === stock.symbol)) {
//         setError("Stock already displayed.");
//         return;
//       }

//       const cacheKey = `stock_${stock.symbol}`;
//       const cachedStock = getCachedData(cacheKey);
//       if (cachedStock) {
//         setDisplayStocks((prevStocks) => [...prevStocks, cachedStock]);
//         setError(null);
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/stocks/test/search`, {
//         params: { query: stock.symbol },
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       if (response.data.length > 0) {
//         const newStock = response.data[0];
//         setDisplayStocks((prevStocks) => [...prevStocks, newStock]);
//         setCachedData(cacheKey, newStock);
//         setError(null);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error searching stock:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.data?.error || error.message || "Failed to search stock."
//       );
//     }
//   };

//   const handleDeleteStock = async (stock) => {
//     try {
//       const token = getAuthToken ? getAuthToken() : null;
//       if (!token) {
//         throw new Error("Please log in to delete stocks.");
//       }

//       await axios.delete(`${API_BASE}/stocks/test/delete`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         data: {
//           symbol: stock.symbol,
//           companyName: stock.companyName,
//         },
//         timeout: 10000,
//       });

//       setSavedStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol)
//       );
//       setDisplayStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol)
//       );

//       // Invalidate cache and refresh
//       const cacheKey = `saved_stocks_${token}`;
//       localStorage.removeItem(cacheKey);
//       await fetchSavedStocks();
//       setError(null);
//     } catch (error) {
//       console.error("Error deleting stock:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.data?.error || error.message || "Failed to delete stock."
//       );
//     }
//   };

//   const removeStock = (symbol) => {
//     setDisplayStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div className="px-4 md:px-10 py-10">
//       <h1 className="text-lg md:text-2xl font-bold mb-6 text-center">Search</h1>
//       {error && (
//         <div
//           role="alert"
//           className="max-w-md mx-auto mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-400 text-red-700 shadow-sm text-center font-medium"
//         >
//           {error}
//         </div>
//       )}
//       {/* <button
//         className="btn btn-sm btn-primary mb-4 mx-auto block"
//         onClick={fetchSavedStocks}
//         disabled={loading}
//       >
//         Refresh Saved Stocks
//       </button> */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//           <HashLoader color="#0369a1" size={60} />
//           <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//             CMDA...
//           </p>
//         </div>
//       ) : savedStocks.length === 0 ? (
//         <div className="text-center text-gray-500">
//           No saved stocks found. Save stocks from the Equity Hub tab.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {savedStocks.map((stock, index) => (
//             <div
//               key={`${stock.symbol}-${index}`}
//               className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl shadow-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
//             >
//               <div className="flex flex-col space-y-2">
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
//                     {stock.symbol}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-300">{stock.companyName}</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     className="btn btn-sm btn-primary"
//                     onClick={() => handleSearchStock(stock)}
//                     disabled={loading}
//                   >
//                     Search
//                   </button>
//                   <button
//                     className="btn btn-sm btn-error text-white"
//                     onClick={() => handleDeleteStock(stock)}
//                     disabled={loading}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       {displayStocks.length > 0 && (
//         <div className="mt-10 px-4 md:px-10">
//           <h2 className="text-lg md:text-2xl font-bold text-cyan-700 text-center mb-6">
//             Selected Stocks
//           </h2>
//           <div className="flex flex-wrap gap-2 mb-6 justify-center">
//             {displayStocks.map((stock) => (
//               <span
//                 key={stock.symbol}
//                 className="flex items-center m-1 bg-gray-600 text-xl text-white p-1 rounded-lg"
//               >
//                 {stock.symbol} - {stock.companyName}
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           <div
//             className={`grid w-full ${
//               displayStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//             } gap-4`}
//           >
//             {displayStocks.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className={`dark:bg-slate-800 p-6 dark:border-gray-600 ${
//                   displayStocks.length === 1 ? "w-full" : "w-auto"
//                 }`}
//               >
//                 <h2 className="text-lg md:text-2xl font-bold text-cyan-700 mb-4">
//                   <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//                 </h2>
//                 <div className="mt-4">
//                   <OpenCloseCards
//                     symbol={stock.symbol}
//                     companyName={stock.companyName}
//                   />
//                 </div>
//                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
//                   <GraphSlider
//                     symbol={stock.symbol}
//                     isFullWidth={displayStocks.length === 1}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Mysearch;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import GraphSlider from './GraphSlider';
// import OpenCloseCards from './OpenCloseCards';
// import { HashLoader } from 'react-spinners';

// const Mysearch = ({ API_BASE, getAuthToken }) => {
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [displayStocks, setDisplayStocks] = useState(() => {
//     const saved = localStorage.getItem('mysearchDisplayStocks');
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > CACHE_TTL) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       console.error("Failed to parse cached data:", err);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       console.error("Failed to cache data:", err);
//       setError("Failed to cache data.");
//     }
//   };

//   useEffect(() => {
//     localStorage.setItem('mysearchDisplayStocks', JSON.stringify(displayStocks));
//   }, [displayStocks]);

//   const fetchSavedStocks = async () => {
//     setLoading(true);
//     const token = getAuthToken ? getAuthToken() : null;
//     const cacheKey = `saved_stocks_${token || 'guest'}`;
//     const cachedStocks = getCachedData(cacheKey);

//     if (cachedStocks) {
//       setSavedStocks(cachedStocks);
//       setLoading(false);
//       return;
//     }

//     if (!token) {
//       setError("Please log in to view saved stocks.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/stocks/test/saved`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       const stocks = Array.isArray(response.data) ? response.data : response.data.stocks || [];
//       if (stocks.length > 0) {
//         setSavedStocks(stocks);
//         setCachedData(cacheKey, stocks);
//         setError(null);
//       } else {
//         // setError("No saved stocks found on the server.");
//       }
//     } catch (error) {
//       console.error("Error fetching saved stocks:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 401
//           ? "Unauthorized. Please log in again."
//           : error.response?.status === 404
//           ? "Endpoint not found. Check server configuration."
//           : error.response?.data?.error || error.message || "Failed to fetch saved stocks."
//       );
//       setSavedStocks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSavedStocks();
//   }, [API_BASE, getAuthToken]);

//   useEffect(() => {
//     fetchSavedStocks();
//   }, [API_BASE]);

//   const handleSearchStock = async (stock) => {
//     try {
//       const token = getAuthToken ? getAuthToken() : null;
//       if (!token) {
//         throw new Error("Please log in to search for stocks.");
//       }

//       if (displayStocks.some((s) => s.symbol === stock.symbol)) {
//         setError("Stock already displayed.");
//         return;
//       }

//       const cacheKey = `stock_${stock.symbol}`;
//       const cachedStock = getCachedData(cacheKey);
//       if (cachedStock) {
//         setDisplayStocks((prevStocks) => [...prevStocks, cachedStock]);
//         setError(null);
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//         params: { prefix: stock.companyName }, // Use companyName as prefix
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       if (response.data.length > 0) {
//         // Find the exact match for the symbol, if available
//         const matchedStock = response.data.find(
//           (s) => s.symbol === stock.symbol && s.companyName === stock.companyName
//         ) || response.data[0]; // Fallback to first result if no exact match
//         setDisplayStocks((prevStocks) => [...prevStocks, matchedStock]);
//         setCachedData(cacheKey, matchedStock);
//         setError(null);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error searching stock:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.data?.error || error.message || "Failed to search stock."
//       );
//     }
//   };

//   const handleDeleteStock = async (stock) => {
//     try {
//       const token = getAuthToken ? getAuthToken() : null;
//       if (!token) {
//         throw new Error("Please log in to delete stocks.");
//       }

//       await axios.delete(`${API_BASE}/stocks/test/delete`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         data: {
//           symbol: stock.symbol,
//           companyName: stock.companyName,
//         },
//         timeout: 10000,
//       });

//       setSavedStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol)
//       );
//       setDisplayStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol)
//       );

//       const cacheKey = `saved_stocks_${token}`;
//       localStorage.removeItem(cacheKey);
//       await fetchSavedStocks();
//       setError(null);
//     } catch (error) {
//       console.error("Error deleting stock:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.data?.error || error.message || "Failed to delete stock."
//       );
//     }
//   };

//   const removeStock = (symbol) => {
//     setDisplayStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div className="px-4 md:px-10 py-10">
//       <h1 className="text-lg md:text-2xl font-bold mb-6 text-center">Search</h1>
//       {error && (
//         <div
//           role="alert"
//           className="max-w-md mx-auto mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-400 text-red-700 shadow-sm text-center font-medium"
//         >
//           {error}
//         </div>
//       )}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//           <HashLoader color="#0369a1" size={60} />
//           <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//             CMDA...
//           </p>
//         </div>
//       ) : savedStocks.length === 0 ? (
//         <div className="text-center text-gray-500">
//           No saved stocks found. Save stocks from the Equity Hub tab.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {savedStocks.map((stock, index) => (
//             <div
//               key={`${stock.symbol}-${index}`}
//               className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl shadow-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
//             >
//               <div className="flex flex-col space-y-2">
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
//                     {stock.symbol}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-300">{stock.companyName}</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     className="btn btn-sm btn-primary"
//                     onClick={() => handleSearchStock(stock)}
//                     disabled={loading}
//                   >
//                     Search
//                   </button>
//                   <button
//                     className="btn btn-sm btn-error text-white"
//                     onClick={() => handleDeleteStock(stock)}
//                     disabled={loading}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       {displayStocks.length > 0 && (
//         <div className="mt-10 px-4 md:px-10">
//           <h2 className="text-lg md:text-2xl font-bold text-cyan-700 text-center mb-6">
//             Selected Stocks
//           </h2>
//           <div className="flex flex-wrap gap-2 mb-6 justify-center">
//             {displayStocks.map((stock) => (
//               <span
//                 key={stock.symbol}
//                 className="flex items-center m-1 bg-gray-600 text-xl text-white p-1 rounded-lg"
//               >
//                 {stock.symbol} - {stock.companyName}
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           <div
//             className={`grid w-full ${
//               displayStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//             } gap-4`}
//           >
//             {displayStocks.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className={`dark:bg-slate-800 p-6 dark:border-gray-600 ${
//                   displayStocks.length === 1 ? "w-full" : "w-auto"
//                 }`}
//               >
//                 <h2 className="text-lg md:text-2xl font-bold text-cyan-700 mb-4">
//                   <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//                 </h2>
//                 <div className="mt-4">
//                   <OpenCloseCards
//                     symbol={stock.symbol}
//                     companyName={stock.companyName}
//                   />
//                 </div>
//                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
//                   <GraphSlider
//                     symbol={stock.symbol}
//                     isFullWidth={displayStocks.length === 1}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Mysearch;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import GraphSlider from './GraphSlider';
// import OpenCloseCards from './OpenCloseCards';
// import { HashLoader } from 'react-spinners';

// const Mysearch = ({ API_BASE, getAuthToken }) => {
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [displayStocks, setDisplayStocks] = useState(() => {
//     const saved = localStorage.getItem('mysearchDisplayStocks');
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > CACHE_TTL) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       console.error("Failed to parse cached data:", err);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       console.error("Failed to cache data:", err);
//       setError("Failed to cache data.");
//     }
//   };

//   useEffect(() => {
//     localStorage.setItem('mysearchDisplayStocks', JSON.stringify(displayStocks));
//   }, [displayStocks]);

//   const fetchSavedStocks = async () => {
//     setLoading(true);
//     const token = getAuthToken ? getAuthToken() : null;
//     const cacheKey = `saved_stocks_${token || 'guest'}`;
//     const cachedStocks = getCachedData(cacheKey);

//     if (cachedStocks) {
//       setSavedStocks(cachedStocks);
//       setLoading(false);
//       return;
//     }

//     if (!token) {
//       setError("Please log in to view saved stocks.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/stocks/test/saved`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       const stocks = Array.isArray(response.data) ? response.data : response.data.stocks || [];
//       if (stocks.length > 0) {
//         setSavedStocks(stocks);
//         setCachedData(cacheKey, stocks);
//         setError(null);
//       }
//     } catch (error) {
//       console.error("Error fetching saved stocks:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 401
//           ? "Unauthorized. Please log in again."
//           : error.response?.status === 404
//           ? "Endpoint not found. Check server configuration."
//           : error.response?.data?.error || error.message || "Failed to fetch saved stocks."
//       );
//       setSavedStocks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSavedStocks();
//   }, [API_BASE, getAuthToken]);

//   const handleSearchStock = async (stock) => {
//     try {
//       if (displayStocks.some((s) => s.symbol === stock.symbol)) {
//         setError("Stock already displayed.");
//         return;
//       }

//       const cacheKey = `stock_${stock.symbol}`;
//       const cachedStock = getCachedData(cacheKey);
//       if (cachedStock) {
//         setDisplayStocks((prevStocks) => [...prevStocks, cachedStock]);
//         setError(null);
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//         params: { prefix: stock.companyName },
//         timeout: 10000,
//       });

//       if (response.data.length > 0) {
//         const matchedStock = response.data.find(
//           (s) => s.symbol === stock.symbol && s.companyName === stock.companyName
//         ) || response.data[0];
//         setDisplayStocks((prevStocks) => [...prevStocks, matchedStock]);
//         setCachedData(cacheKey, matchedStock);
//         setError(null);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error searching stock:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 404
//           ? "Endpoint not found. Check server configuration."
//           : error.response?.data?.error || error.message || "Failed to search stock."
//       );
//     }
//   };

//   const handleDeleteStock = async (stock) => {
//     try {
//       const token = getAuthToken ? getAuthToken() : null;
//       if (!token) {
//         throw new Error("Please log in to delete stocks.");
//       }

//       await axios.delete(`${API_BASE}/stocks/test/delete`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         data: {
//           symbol: stock.symbol,
//           companyName: stock.companyName,
//         },
//         timeout: 10000,
//       });

//       setSavedStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol)
//       );
//       setDisplayStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol)
//       );

//       const cacheKey = `saved_stocks_${token}`;
//       localStorage.removeItem(cacheKey);
//       await fetchSavedStocks();
//       setError(null);
//     } catch (error) {
//       console.error("Error deleting stock:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.data?.error || error.message || "Failed to delete stock."
//       );
//     }
//   };

//   const removeStock = (symbol) => {
//     setDisplayStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div className="px-4 md:px-10 py-10">
//       <h1 className="text-lg md:text-2xl font-bold mb-6 text-center">Search</h1>
//       {error && (
//         <div
//           role="alert"
//           className="max-w-md mx-auto mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-400 text-red-700 shadow-sm text-center font-medium"
//         >
//           {error}
//         </div>
//       )}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//           <HashLoader color="#0369a1" size={60} />
//           <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//             CMDA...
//           </p>
//         </div>
//       ) : savedStocks.length === 0 ? (
//         <div className="text-center text-gray-500">
//           No saved stocks found. Save stocks from the Equity Hub tab.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {savedStocks.map((stock, index) => (
//             <div
//               key={`${stock.symbol}-${index}`}
//               className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl shadow-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
//             >
//               <div className="flex flex-col space-y-2">
//                 <div>
//                   <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
//                     {stock.symbol}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-300">{stock.companyName}</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     className="btn btn-sm btn-primary"
//                     onClick={() => handleSearchStock(stock)}
//                     disabled={loading}
//                   >
//                     Search
//                   </button>
//                   <button
//                     className="btn btn-sm btn-error text-white"
//                     onClick={() => handleDeleteStock(stock)}
//                     disabled={loading}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       {displayStocks.length > 0 && (
//         <div className="mt-10 px-4 md:px-10">
//           <h2 className="text-lg md:text-2xl font-bold text-cyan-700 text-center mb-6">
//             Selected Stocks
//           </h2>
//           <div className="flex flex-wrap gap-2 mb-6 justify-center">
//             {displayStocks.map((stock) => (
//               <span
//                 key={stock.symbol}
//                 className="flex items-center m-1 bg-gray-600 text-xl text-white p-1 rounded-lg"
//               >
//                 {stock.symbol} - {stock.companyName}
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           <div
//             className={`grid w-full ${
//               displayStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//             } gap-4`}
//           >
//             {displayStocks.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className={`dark:bg-slate-800 p-6 dark:border-gray-600 ${
//                   displayStocks.length === 1 ? "w-full" : "w-auto"
//                 }`}
//               >
//                 <h2 className="text-lg md:text-2xl font-bold text-cyan-700 mb-4">
//                   <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//                 </h2>
//                 <div className="mt-4">
//                   <OpenCloseCards
//                     symbol={stock.symbol}
//                     companyName={stock.companyName}
//                   />
//                 </div>
//                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
//                   <GraphSlider
//                     symbol={stock.symbol}
//                     isFullWidth={displayStocks.length === 1}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Mysearch;





// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import GraphSlider from './GraphSlider';
// import OpenCloseCards from './OpenCloseCards';
// import { HashLoader } from 'react-spinners';

// const Mysearch = ({ API_BASE, getAuthToken }) => {
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [displayStocks, setDisplayStocks] = useState(() => {
//     const saved = localStorage.getItem('mysearchDisplayStocks');
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > CACHE_TTL) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       console.error("Failed to parse cached data:", err);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       console.error("Failed to cache data:", err);
//       setError("Failed to cache data.");
//     }
//   };

//   useEffect(() => {
//     localStorage.setItem('mysearchDisplayStocks', JSON.stringify(displayStocks));
//   }, [displayStocks]);

//   const fetchSavedStocks = async () => {
//     setLoading(true);
//     const token = getAuthToken ? getAuthToken() : null;
//     const cacheKey = `saved_stocks_${token || 'guest'}`;
//     const cachedStocks = getCachedData(cacheKey);

//     if (cachedStocks) {
//       setSavedStocks(cachedStocks);
//       setLoading(false);
//       return;
//     }

//     if (!token) {
//       setError("Please log in to view saved stocks.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/stocks/test/saved`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       const stocks = Array.isArray(response.data) ? response.data : response.data.stocks || [];
//       if (stocks.length > 0) {
//         setSavedStocks(stocks);
//         setCachedData(cacheKey, stocks);
//         setError(null);
//       }
//     } catch (error) {
//       console.error("Error fetching saved stocks:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 401
//           ? "Unauthorized. Please log in again."
//           : error.response?.status === 404
//             ? "Endpoint not found. Check server configuration."
//             : error.response?.data?.error || error.message || "Failed to fetch saved stocks."
//       );
//       setSavedStocks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSavedStocks();
//   }, [API_BASE, getAuthToken]);

//   const handleSearchStock = async (stock) => {
//     try {
//       if (displayStocks.some((s) => s.symbol === stock.symbol)) {
//         setError("Stock already displayed.");
//         return;
//       }

//       const cacheKey = `stock_${stock.symbol}`;
//       const cachedStock = getCachedData(cacheKey);
//       if (cachedStock) {
//         setDisplayStocks((prevStocks) => [...prevStocks, cachedStock]);
//         setError(null);
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//         params: { prefix: stock.companyName },
//         timeout: 10000,
//       });

//       if (response.data.length > 0) {
//         const matchedStock = response.data.find(
//           (s) => s.symbol === stock.symbol && s.companyName === stock.companyName
//         ) || response.data[0];
//         setDisplayStocks((prevStocks) => [...prevStocks, matchedStock]);
//         setCachedData(cacheKey, matchedStock);
//         setError(null);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error searching stock:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 404
//           ? "Endpoint not found. Check server configuration."
//           : error.response?.data?.error || error.message || "Failed to search stock."
//       );
//     }
//   };

//   const handleDeleteStock = async (stock) => {
//     try {
//       const token = getAuthToken ? getAuthToken() : null;
//       if (!token) {
//         throw new Error("Please log in to delete stocks.");
//       }

//       await axios.delete(`${API_BASE}/stocks/test/delete`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         data: {
//           symbol: stock.symbol,
//           companyName: stock.companyName,
//         },
//         timeout: 10000,
//       });

//       setSavedStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol)
//       );
//       setDisplayStocks((prevStocks) =>
//         prevStocks.filter((s) => s.symbol !== stock.symbol)
//       );

//       const cacheKey = `saved_stocks_${token}`;
//       localStorage.removeItem(cacheKey);
//       await fetchSavedStocks();
//       setError(null);
//     } catch (error) {
//       console.error("Error deleting stock:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.data?.error || error.message || "Failed to delete stock."
//       );
//     }
//   };

//   const removeStock = (symbol) => {
//     setDisplayStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div className="px-3 sm:px-4 md:px-8 py-6 sm:py-8 min-h-screen">
//       <style>
//         {`
//           .no-scrollbar::-webkit-scrollbar {
//             display: none;
//           }
//           .no-scrollbar {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//           .stock-card {
//             width: 100%;
//           }
//           @media (max-width: 640px) {
//             .stock-card {
//               max-width: 100%;
//             }
//           }
//         `}
//       </style>
//       <header className="mb-6 sm:mb-8 text-center">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-900 dark:text-sky-400 mb-2 sm:mb-3 tracking-tight">
//           Watchlist
//         </h1>
//         <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-200 font-medium">
//           Explore your saved stocks and get detailed insights with ease.
//         </p>
//       </header>
//       {error && (
//         <div
//           role="alert"
//           className="flex justify-center w-full max-w-md mx-auto mb-4 sm:mb-6 px-3 sm:px-4 py-2 rounded-md bg-red-50 border border-red-400 text-red-700 shadow-sm text-xs sm:text-sm font-medium"
//         >
//           {error}
//         </div>
//       )}
//       {loading ? (
//         <div className="flex flex-col justify-center items-center min-h-[50vh] bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//           <HashLoader color="#0369a1" size={40} sm:size={60} />
//           <p className="mt-3 sm:mt-4 text-sky-700 dark:text-white font-semibold text-sm sm:text-lg animate-pulse">
//             Loading...
//           </p>
//         </div>
//       ) : savedStocks.length === 0 ? (
//         <div className="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
//           No saved stocks found. Save stocks from the Equity Hub tab.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//           {savedStocks.map((stock, index) => (
//             <div
//               key={`${stock.symbol}-${index}`}
//               className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition stock-card"
//             >
//               <div className="flex flex-col space-y-2 sm:space-y-3">
//                 <div>
//                   <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate">
//                     {stock.symbol}
//                   </h3>
//                   <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
//                     {stock.companyName}
//                   </p>
//                 </div>
//                 <div className="flex space-x-2 sm:space-x-3">
//                   <button
//                     className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-xs sm:text-sm font-medium min-w-[80px] disabled:opacity-50"
//                     onClick={() => handleSearchStock(stock)}
//                     disabled={loading}
//                   >
//                     Search
//                   </button>
//                   <button
//                     className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm font-medium min-w-[80px] disabled:opacity-50"
//                     onClick={() => handleDeleteStock(stock)}
//                     disabled={loading}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       {displayStocks.length > 0 && (
//         <div className="mt-6 sm:mt-8 px-2 sm:px-4 md:px-8">
//           <h2 className="text-base sm:text-lg md:text-xl font-bold text-cyan-700 dark:text-cyan-400 text-center mb-4 sm:mb-6">
//             Selected Stocks
//           </h2>
//           <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center">
//             {displayStocks.map((stock) => (
//               <span
//                 key={stock.symbol}
//                 className="flex items-center bg-gray-600 text-white text-sm sm:text-base px-2 sm:px-3 py-1 rounded-lg"
//               >
//                 {stock.symbol} - {stock.companyName}
//                 <button
//                   className="ml-1 sm:ml-2 text-red-500 hover:text-red-400 text-base sm:text-lg font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//           <div
//             className={`grid w-full max-w-[100vw] ${displayStocks.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
//               } gap-3 sm:gap-4`}
//           >
//             {displayStocks.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className="bg-white dark:bg-slate-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-300 dark:border-gray-600 stock-card"
//               >
//                 <h2 className="text-base sm:text-lg md:text-xl font-bold text-cyan-700 dark:text-cyan-400 mb-3 sm:mb-4 truncate">
//                   <span className="text-black dark:text-white">{stock.symbol}</span> - {stock.companyName}
//                 </h2>
//                 <div className="mt-3 sm:mt-4">
//                   <OpenCloseCards
//                     symbol={stock.symbol}
//                     companyName={stock.companyName}
//                     responsive={true} // Added to ensure responsiveness
//                   />
//                 </div>
//                 <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
//                   <GraphSlider
//                     symbol={stock.symbol}
//                     isFullWidth={displayStocks.length === 1}
//                     responsive={true} // Added to ensure responsiveness
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Mysearch;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GraphSlider from './GraphSlider';
import OpenCloseCards from './OpenCloseCards';
import { HashLoader } from 'react-spinners';

const Mysearch = ({ API_BASE, getAuthToken }) => {
  const [savedStocks, setSavedStocks] = useState([]);
  const [displayStocks, setDisplayStocks] = useState(() => {
    const saved = localStorage.getItem('mysearchDisplayStocks');
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  const getCachedData = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Failed to parse cached data:", err);
      return null;
    }
  };

  const setCachedData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (err) {
      console.error("Failed to cache data:", err);
      setError("Failed to cache data.");
    }
  };

  useEffect(() => {
    localStorage.setItem('mysearchDisplayStocks', JSON.stringify(displayStocks));
  }, [displayStocks]);

  const fetchSavedStocks = async () => {
    setLoading(true);
    const token = getAuthToken ? getAuthToken() : null;
    const cacheKey = `saved_stocks_${token || 'guest'}`;
    const cachedStocks = getCachedData(cacheKey);

    if (cachedStocks) {
      setSavedStocks(cachedStocks);
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Please log in to view saved stocks.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/stocks/test/saved`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      const stocks = Array.isArray(response.data) ? response.data : response.data.stocks || [];
      if (stocks.length > 0) {
        setSavedStocks(stocks);
        setCachedData(cacheKey, stocks);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching saved stocks:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      setError(
        error.response?.status === 401
          ? "Unauthorized. Please log in again."
          : error.response?.status === 404
            ? "Endpoint not found. Check server configuration."
            : error.response?.data?.error || error.message || "Failed to fetch saved stocks."
      );
      setSavedStocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedStocks();
  }, [API_BASE, getAuthToken]);

  const handleSearchStock = async (stock) => {
    try {
      if (displayStocks.some((s) => s.symbol === stock.symbol)) {
        setError("Stock already displayed.");
        return;
      }

      const cacheKey = `stock_${stock.symbol}`;
      const cachedStock = getCachedData(cacheKey);
      if (cachedStock) {
        setDisplayStocks((prevStocks) => [...prevStocks, cachedStock]);
        setError(null);
        return;
      }

      const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
        params: { prefix: stock.companyName },
        timeout: 10000,
      });

      if (response.data.length > 0) {
        const matchedStock = response.data.find(
          (s) => s.symbol === stock.symbol && s.companyName === stock.companyName
        ) || response.data[0];
        setDisplayStocks((prevStocks) => [...prevStocks, matchedStock]);
        setCachedData(cacheKey, matchedStock);
        setError(null);
      } else {
        setError("No stock details found for the selected symbol.");
      }
    } catch (error) {
      console.error("Error searching stock:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      setError(
        error.response?.status === 404
          ? "Endpoint not found. Check server configuration."
          : error.response?.data?.error || error.message || "Failed to search stock."
      );
    }
  };

  const handleDeleteStock = async (stock) => {
    try {
      const token = getAuthToken ? getAuthToken() : null;
      if (!token) {
        throw new Error("Please log in to delete stocks.");
      }

      await axios.delete(`${API_BASE}/stocks/test/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          symbol: stock.symbol,
          companyName: stock.companyName,
        },
        timeout: 10000,
      });

      setSavedStocks((prevStocks) =>
        prevStocks.filter((s) => s.symbol !== stock.symbol)
      );
      setDisplayStocks((prevStocks) =>
        prevStocks.filter((s) => s.symbol !== stock.symbol)
      );

      const cacheKey = `saved_stocks_${token}`;
      localStorage.removeItem(cacheKey);
      await fetchSavedStocks();
      setError(null);
    } catch (error) {
      console.error("Error deleting stock:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      setError(
        error.response?.data?.error || error.message || "Failed to delete stock."
      );
    }
  };

  const removeStock = (symbol) => {
    setDisplayStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
  };

  return (
    <div className="px-3 sm:px-4 md:px-8 py-6 sm:py-8 min-h-screen">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .stock-card {
            width: 100%;
          }
          @media (max-width: 640px) {
            .stock-card {
              max-width: 100%;
            }
          }
        `}
      </style>
      <header className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-900 dark:text-sky-400 mb-2 sm:mb-3 tracking-tight">
          Watchlist
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-200 font-medium">
          Explore your saved stocks and get detailed insights with ease.
        </p>
      </header>
      {error && (
        <div
          role="alert"
          className="flex justify-center w-full max-w-md mx-auto mb-4 sm:mb-6 px-3 sm:px-4 py-2 rounded-md bg-red-50 border border-red-400 text-red-700 shadow-sm text-xs sm:text-sm font-medium"
        >
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[50vh] bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
          <HashLoader color="#0369a1" size={40} sm:size={60} />
          <p className="mt-3 sm:mt-4 text-sky-700 dark:text-white font-semibold text-sm sm:text-lg animate-pulse">
            Loading...
          </p>
        </div>
      ) : savedStocks.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          No saved stocks found. Save stocks from the Equity Hub tab.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {savedStocks.map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition stock-card"
            >
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate">
                    {stock.symbol}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                    {stock.companyName}
                  </p>
                </div>
                <div className="flex space-x-2 sm:space-x-3">
                  <button
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-xs sm:text-sm font-medium min-w-[80px] disabled:opacity-50"
                    onClick={() => handleSearchStock(stock)}
                    disabled={loading}
                  >
                    Search
                  </button>
                  <button
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm font-medium min-w-[80px] disabled:opacity-50"
                    onClick={() => handleDeleteStock(stock)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {displayStocks.length > 0 && (
        <div className="mt-6 sm:mt-8 px-2 sm:px-4 md:px-8">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-cyan-700 dark:text-cyan-400 text-center mb-4 sm:mb-6">
            Selected Stocks
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center">
            {displayStocks.map((stock) => (
              <span
                key={stock.symbol}
                className="flex items-center bg-gray-600 text-white text-sm sm:text-base px-2 sm:px-3 py-1 rounded-lg"
              >
                {stock.symbol} - {stock.companyName}
                <button
                  className="ml-1 sm:ml-2 text-red-500 hover:text-red-400 text-base sm:text-lg font-bold"
                  onClick={() => removeStock(stock.symbol)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div
            className={`grid w-full max-w-[100vw] ${displayStocks.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
              } gap-3 sm:gap-4`}
          >
            {displayStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="bg-white dark:bg-slate-800 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-300 dark:border-gray-600 stock-card"
              >
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-cyan-700 dark:text-cyan-400 mb-3 sm:mb-4 truncate">
                  <span className="text-black dark:text-white">{stock.symbol}</span> - {stock.companyName}
                </h2>
                <div className="mt-3 sm:mt-4">
                  <OpenCloseCards
                    symbol={stock.symbol}
                    companyName={stock.companyName}
                    responsive={true} // Added to ensure responsiveness
                  />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
                  <GraphSlider
                    symbol={stock.symbol}
                    isFullWidth={displayStocks.length === 1}
                    responsive={true} // Added to ensure responsiveness
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Mysearch;