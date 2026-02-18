// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import Footer from "../Footer";
// import SearchList from "./SearchList";
// import GraphSlider from "./GraphSlider";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import OpenCloseCards from "./OpenCloseCards";


// const Search = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("query") || "";

//   const [input, setInput] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);

//   useEffect(() => {
//     if (initialQuery) {
//       fetchData(initialQuery);
//     }
//   }, [initialQuery]);

//   const fetchData = async (value) => {
//     if (!value) {
//       setResults([]);
//       return;
//     }
//     try {
//       const response = await axios.get(`${API_BASE}/api/stocks/search?query=${value}`);
//       const filteredResults = response.data.filter((symbol) =>
//         symbol?.symbol?.toLowerCase().includes(value.toLowerCase())
//       );
//       setResults(filteredResults);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const fetchStockDetails = async (symbol) => {
//     if (!symbol) return;
//     try {
//       const response = await axios.get(`${API_BASE}/api/stocks/search?query=${symbol}`);
//       setSelectedItem(response.data[0]);
//     } catch (error) {
//       console.error("Error fetching stock details:", error);
//     }
//   };

//   const handleSelectItem = (item) => {
//     setInput("");
//     setResults([]);
//     fetchStockDetails(item.symbol);
//   };

//   return (
//     <div>
//       <Navbar />
//       <main>
//         <div className="text-center">
//           <h3 className="my-40 text-2xl font-bold mb-4">Search for an NSE Stock</h3>
//         </div>
//         <div className="flex justify-center mt-5">
//           <div className="relative w-full md:w-1/2 max-w-lg m-5">
//             <input
//               type="text"
//               className="w-full px-6 py-3 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               placeholder="Search for insights, data, or trends..."
//               value={input}
//               onChange={(e) => {
//                 setInput(e.target.value);
//                 fetchData(e.target.value);
//               }}
//             />
//             {results.length > 0 && (
//               <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
//                 <SearchList results={results} query={input} onSelectItem={handleSelectItem} />
//               </div>
//             )}

//             {selectedItem && (
//               <div className="flex justify-center mt-4 px-4">
//                 <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-2xl border border-gray-300 dark:border-gray-600">
//                   <h2 className="text-2xl font-bold text-yellow-500">
//                     <span className="text-black">{selectedItem.symbol}</span> - {selectedItem.companyName}
//                   </h2>
//                   <p className="text-gray-700 dark:text-gray-300 mt-2">
//                     <strong>Basic Industry:</strong> {selectedItem.basicIndustry}
//                   </p>
//                 </div>
//               </div>
//             )}


//           </div>
//         </div>
//         <div>
//         <div className="m-25">
//           {selectedItem && <OpenCloseCards symbol={selectedItem.symbol} companyName={selectedItem.companyName} />} </div>

//         </div>
//         <div className="m-25">{selectedItem && <GraphSlider symbol={selectedItem.symbol} />}</div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Search;

// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import Footer from "../Footer";
// import SearchList from "./SearchList";
// import GraphSlider from "./GraphSlider";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import OpenCloseCards from "./OpenCloseCards";

// const Search = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("query") || "";

//   const [input, setInput] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedStocks, setSelectedStocks] = useState([]); // Store multiple stocks

//   useEffect(() => {
//     if (initialQuery) {
//       fetchData(initialQuery);
//     }
//   }, [initialQuery]);

//   const fetchData = async (value) => {
//     if (!value) {
//       setResults([]);
//       return;
//     }
//     try {
//       // const response = await axios.get(`${API_BASE}/api/stocks/search?query=${value}`);
//       // const response = await axios.get(`http://192.168.1.250:8080/CMDA-3.3.9/api/stocks/search?query=${value}`);
//       const response = await axios.get(`${API_BASE}/api/stocks/search?query=${value}`);

//       const filteredResults = response.data.filter((symbol) =>
//         symbol?.symbol?.toLowerCase().includes(value.toLowerCase())
//       );
//       setResults(filteredResults);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleSelectItem = (item) => {
//     setInput("");
//     setResults([]);

//     if (!selectedStocks.some((stock) => stock.symbol === item.symbol)) {
//       fetchStockDetails(item.symbol);
//     }
//   };

//   const fetchStockDetails = async (symbol) => {
//     if (!symbol) return;
//     try {
//       // const response = await axios.get(`${API_BASE}/api/stocks/search?query=${symbol}`);
//       // const response = await axios.get(`http://192.168.1.250:8080/CMDA-3.3.9/api/stocks/search?query=${symbol}`);
//       const response = await axios.get(`${API_BASE}/api/stocks/search?query=${symbol}`);

//       setSelectedStocks((prevStocks) => [...prevStocks, response.data[0]]);
//     } catch (error) {
//       console.error("Error fetching stock details:", error);
//     }
//   };

//   const removeStock = (symbol) => {
//     setSelectedStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div>
//       <Navbar />
//       <main>
//         <div className="text-center">
//           <h3 className="my-40 text-2xl font-bold mb-4">Search and Compare NSE Stocks</h3>
//         </div>
//         <div className="flex justify-center mt-5">
//           <div className="relative w-full md:w-1/2 max-w-lg m-5">
//             {selectedStocks.map((stock) => (
//               <div key={stock.symbol} className="flex items-center bg-gray-100 py-1 rounded-lg">
//                 {stock.symbol}
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//             <input
//               type="text"
//               className="w-full px-6 py-3 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               placeholder="Search for insights, data, or trends..."
//               value={input}
//               onChange={(e) => {
//                 setInput(e.target.value);
//                 fetchData(e.target.value);
//               }}
//             />
//             {results.length > 0 && (
//               <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
//                 <SearchList results={results} query={input} onSelectItem={handleSelectItem} />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Display selected stocks for comparison */}
//         <div className={`grid ${selectedStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4 px-10`}>
//   {selectedStocks.map((stock) => (
//     <div
//       key={stock.symbol}
//       className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 ${
//         selectedStocks.length === 1 ? "w-full" : "w-auto"
//       }`}
//     >
//       <h2 className="text-2xl flex justify-center items-center font-bold text-yellow-500">
//         <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//       </h2>
//       <p className="text-gray-700 flex justify-center items-center dark:text-gray-300 mt-2">
//         <strong>Basic Industry:</strong> {stock.basicIndustry}
//       </p>
//       <OpenCloseCards symbol={stock.symbol} companyName={stock.companyName} />
//       <GraphSlider symbol={stock.symbol} isFullWidth={selectedStocks.length === 1} />
//     </div>
//   ))}
// </div>

//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Search;

// -------------------------shreya working code --------------------------------
// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import Footer from "../Footer";
// import SearchList from "./SearchList";
// import GraphSlider from "./GraphSlider";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import OpenCloseCards from "./OpenCloseCards";
// import { BsQuote } from "react-icons/bs";
// // const API_URL = process.env.REACT_APP_API_URL || "${VITE_URL}";


// const Search = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("query") || "";

//   const [input, setInput] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedStocks, setSelectedStocks] = useState([]); // Store multiple stocks
//   // const VITE_URL  = import.meta.env.VITE_URL 

//   useEffect(() => {
//     if (initialQuery) {
//       fetchData(initialQuery);
//     }
//   }, [initialQuery]);

//   const fetchData = async (value) => {
//     if (!value) {
//       setResults([]);
//       return;
//     }
//     try {
//       const response = await axios.get(`${API_BASE}/api/stocks/search?query=${value}`);
//       const filteredResults = response.data.filter((symbol) =>
//         symbol?.symbol?.toLowerCase().includes(value.toLowerCase())
//       );
//       setResults(filteredResults);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleSelectItem = (item) => {
//     setInput("");
//     setResults([]);

//     if (!selectedStocks.some((stock) => stock.symbol === item.symbol)) {
//       fetchStockDetails(item.symbol);
//     }
//   };

//   const fetchStockDetails = async (symbol) => {
//     if (!symbol) return;
//     try {
//       const response = await axios.get(`localhost:8080/api/stocks/search?query=${symbol}`);
//       setSelectedStocks((prevStocks) => [...prevStocks, response.data[0]]);
//     } catch (error) {
//       console.error("Error fetching stock details:", error);
//     }
//   };

//   const removeStock = (symbol) => {
//     setSelectedStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div>
//       <Navbar />
//       <main>
//         <div className="text-center">

//             {/* Quote Section */}
//                   <div className="mt-40 text-center px-4">
//                     <h3 className="text-xl md:text-2xl font-bold mb-4">
//                       <BsQuote
//                         className="inline-block text-gray-500 dark:text-gray-400 mr-2"
//                         size={40}
//                       />
//                       <span className="text-yellow-500">Franklin Templeton</span> - "Bulls
//                       are <span className="text-yellow-500">born</span> out of pessimism,
//                       grow on skepticism, mature on optimism and{" "}
//                       <span className="text-yellow-500">die</span> in euphoria."
//                     </h3>
//                   </div>
//           <h3 className="my-20 text-2xl font-bold mb-4">Search and Compare NSE Stocks</h3>
//         </div>
//         <div className="flex justify-center mt-5">
//           <div className="relative w-full md:w-1/2 max-w-lg m-5">
//             {selectedStocks.map((stock) => (
//               <div key={stock.symbol} className="flex items-center bg-gray-100 py-1 rounded-lg">
//                 {stock.symbol}
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//             <input
//               type="text"
//               className="w-full px-6 py-3 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               placeholder="Search for insights, data, or trends..."
//               value={input}
//               onChange={(e) => {
//                 setInput(e.target.value);
//                 fetchData(e.target.value);
//               }}
//             />
//             {results.length > 0 && (
//               <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
//                 <SearchList results={results} query={input} onSelectItem={handleSelectItem} />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Display selected stocks for comparison */}
//         <div className={`grid ${selectedStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4 px-10`}>
//   {selectedStocks.map((stock) => (
//     <div
//       key={stock.symbol}
//       className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 ${
//         selectedStocks.length === 1 ? "w-full" : "w-auto"
//       }`}
//     >
//       <h2 className="text-2xl flex justify-center items-center font-bold text-yellow-500">
//         <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//       </h2>
//       <p className="text-gray-700 flex justify-center items-center dark:text-gray-300 mt-2">
//         <strong>Basic Industry:</strong> {stock.basicIndustry}
//       </p>
//       <OpenCloseCards symbol={stock.symbol} companyName={stock.companyName} />
//       <GraphSlider symbol={stock.symbol} isFullWidth={selectedStocks.length === 1} />
//     </div>
//   ))}
// </div>

//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Search;
// -------------------------shreya working code --------------------------------



// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import Footer from "../Footer";
// import SearchList from "./SearchList";
// import GraphSlider from "./GraphSlider";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import OpenCloseCards from "./OpenCloseCards";
// import { BsQuote } from "react-icons/bs";

// const Search = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const initialQuery = queryParams.get("query") || "";

//   const [input, setInput] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedStocks, setSelectedStocks] = useState([]); // Store multiple stocks
//   const [error, setError] = useState(null); // Handle errors

//   useEffect(() => {
//     if (initialQuery) {
//       fetchData(initialQuery, false); // Don't save for initial query
//     }
//   }, [initialQuery]);

//   const fetchData = async (value, shouldSave) => {
//     if (!value) {
//       setResults([]);
//       setError(null);
//       return;
//     }

//     try {
//       // Get JWT token from localStorage (or your auth mechanism)
//       const token = localStorage.getItem("jwtToken");
//       if (!token) {
//         throw new Error("Please log in to search for stocks.");
//       }

//       const response = await axios.get(`${API_BASE}/api/stocks/search`, {
//         params: {
//           query: value,
//           shouldSave: shouldSave,
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const filteredResults = response.data.filter((symbol) =>
//         symbol?.symbol?.toLowerCase().includes(value.toLowerCase())
//       );
//       setResults(filteredResults);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(error.response?.data?.error || error.message || "Failed to fetch search results.");
//       setResults([]);
//     }
//   };

//   const handleSelectItem = async (item) => {
//     setInput("");
//     setResults([]);

//     // Check if stock is already selected
//     if (selectedStocks.some((stock) => stock.symbol === item.symbol)) {
//       return;
//     }

//     // Show confirmation alert
//     const shouldSave = window.confirm(
//       `Would you like to save the stock ${item.symbol} - ${item.companyName} to your database?`
//     );

//     try {
//       // Fetch stock details with shouldSave parameter
//       const token = localStorage.getItem("jwtToken");
//       if (!token) {
//         throw new Error("Please log in to select a stock.");
//       }

//       const response = await axios.get(`${API_BASE}/api/stocks/search`, {
//         params: {
//           query: item.symbol,
//           shouldSave: shouldSave,
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.length > 0) {
//         setSelectedStocks((prevStocks) => [...prevStocks, response.data[0]]);
//         setError(null);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error fetching stock details:", error);
//       setError(error.response?.data?.error || error.message || "Failed to fetch stock details.");
//     }
//   };

//   const removeStock = (symbol) => {
//     setSelectedStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div>
//       <Navbar />
//       <main>
//         <div className="text-center">
//           {/* Quote Section */}
//           <div className="mt-40 text-center px-4">
//             <h3 className="text-xl md:text-2xl font-bold mb-4">
//               <BsQuote
//                 className="inline-block text-gray-500 dark:text-gray-400 mr-2"
//                 size={40}
//               />
//               <span className="text-yellow-500">Franklin Templeton</span> - "Bulls
//               are <span className="text-yellow-500">born</span> out of pessimism,
//               grow on skepticism, mature on optimism and{" "}
//               <span className="text-yellow-500">die</span> in euphoria."
//             </h3>
//           </div>
//           <h3 className="my-20 text-2xl font-bold mb-4">Search and Compare NSE Stocks</h3>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="text-center text-red-500 mb-4">
//             {error}
//           </div>
//         )}

//         <div className="flex justify-center mt-5">
//           <div className="relative w-full md:w-1/2 max-w-lg m-5">
//             {selectedStocks.map((stock) => (
//               <div key={stock.symbol} className="flex items-center bg-gray-100 py-1 rounded-lg mb-2">
//                 <span className="ml-2">{stock.symbol} - {stock.companyName}</span>
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//             <input
//               type="text"
//               className="w-full px-6 py-3 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               placeholder="Search for insights, data, or trends..."
//               value={input}
//               onChange={(e) => {
//                 setInput(e.target.value);
//                 fetchData(e.target.value, false); // Don't save during live search
//               }}
//             />
//             {results.length > 0 && (
//               <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
//                 <SearchList results={results} query={input} onSelectItem={handleSelectItem} />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Display selected stocks for comparison */}
//         <div
//           className={`grid ${
//             selectedStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//           } gap-4 px-10`}
//         >
//           {selectedStocks.map((stock) => (
//             <div
//               key={stock.symbol}
//               className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 ${
//                 selectedStocks.length === 1 ? "w-full" : "w-auto"
//               }`}
//             >
//               <h2 className="text-2xl flex justify-center items-center font-bold text-yellow-500">
//                 <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//               </h2>
//               <p className="text-gray-700 flex justify-center items-center dark:text-gray-300 mt-2">
//                 <strong>Basic Industry:</strong> {stock.basicIndustry}
//               </p>
//               <OpenCloseCards symbol={stock.symbol} companyName={stock.companyName} />
//               <GraphSlider symbol={stock.symbol} isFullWidth={selectedStocks.length === 1} />
//             </div>
//           ))}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Search;



// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import Footer from "../Footer";
// import SearchList from "./SearchList";
// import GraphSlider from "./GraphSlider";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import OpenCloseCards from "./OpenCloseCards";
// import { BsQuote } from "react-icons/bs";

// const Search = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const initialQuery = queryParams.get("query") || "";

//   const [input, setInput] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedStocks, setSelectedStocks] = useState([]);
//   const [error, setError] = useState(null);
//   const [searchedQueries, setSearchedQueries] = useState(new Set()); // Track unique searches

//   useEffect(() => {
//     if (initialQuery) {
//       fetchData(initialQuery, false);
//     }
//   }, [initialQuery]);

// const fetchData = async (value) => {
//   if (!value) {
//     setResults([]);
//     setError(null);
//     return;
//   }

//   const queryLower = value.toLowerCase();
//   const isNewQuery = !searchedQueries.has(queryLower);

//   if (isNewQuery ) {
//     setError("Please log in to search for more stocks.");
//     setResults([]);
//     return;
//   }

//   try {
//     const response = await axios.get(`${API_BASE}/stocks/test/search`, {
//       params: { query: value },
//     });

//     const filteredResults = response.data.filter((symbol) =>
//       symbol?.symbol?.toLowerCase().includes(queryLower) ||
//       symbol?.companyName?.toLowerCase().includes(queryLower)
//     );
//     if (filteredResults.length === 0) {
//       setError("Company or symbol not found. Please check and try again.");
//     } else {
//       setResults(filteredResults);
//       setError(null);
//     }
//     if (isNewQuery) {
//       setSearchedQueries((prev) => new Set(prev).add(queryLower));
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     setError(error.response?.data?.error || error.message || "Failed to fetch search results.");
//     setResults([]);
//   }
// };

//  const handleSelectItem = async (item) => {
//   setInput("");
//   setResults([]);

//   if (selectedStocks.some((stock) => stock.symbol === item.symbol)) {
//     return;
//   }

//   const shouldSave = window.confirm(
//     `Would you like to save the stock ${item.symbol} - ${item.companyName} to your database?`
//   );

//   try {
//     const response = await axios.get(`${API_BASE}/stocks/test/search`, {
//       params: { query: item.symbol },
//     });

//     if (response.data.length > 0) {
//       setSelectedStocks((prevStocks) => [...prevStocks, response.data[0]]);
//       setError(null);
//     } else {
//       setError("No stock details found for the selected symbol.");
//     }
//   } catch (error) {
//     console.error("Error fetching stock details:", error);
//     setError(error.response?.data?.error || error.message || "Failed to fetch stock details.");
//   }
// };

//   const removeStock = (symbol) => {
//     setSelectedStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   return (
//     <div>
//       <Navbar />
//       <main>
//         <div className="text-center">
//           {/* Quote Section */}
//           <div className="mt-40 text-center px-4">
//             <h3 className="text-xl md:text-2xl font-bold mb-4">
//               <BsQuote
//                 className="inline-block text-gray-500 dark:text-gray-400 mr-2"
//                 size={40}
//               />
//               <span className="text-yellow-500">Franklin Templeton</span> - "Bulls
//               are <span className="text-yellow-500">born</span> out of pessimism,
//               grow on skepticism, mature on optimism and{" "}
//               <span className="text-yellow-500">die</span> in euphoria."
//             </h3>
//           </div>
//           <h3 className="my-20 text-2xl font-bold mb-4">Search and Compare NSE Stocks</h3>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="text-center text-red-500 mb-4">
//             {error}
//           </div>
//         )}

//         <div className="flex justify-center mt-5">
//           <div className="relative w-full md:w-1/2 max-w-lg m-5">
//             {selectedStocks.map((stock) => (
//               <div key={stock.symbol} className="flex items-center bg-gray-100 py-1 rounded-lg mb-2">
//                 <span className="ml-2">{stock.symbol} - {stock.companyName}</span>
//                 <button
//                   className="ml-2 text-xl text-red-500 font-bold"
//                   onClick={() => removeStock(stock.symbol)}
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//             <input
//               type="text"
//               className="w-full px-6 py-3 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               placeholder="Search for insights, data, or trends..."
//               value={input}
//               onChange={(e) => {
//                 setInput(e.target.value);
//                 fetchData(e.target.value, false);
//               }}
//             />
//             {results.length > 0 && (
//               <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
//                 <SearchList results={results} query={input} onSelectItem={handleSelectItem} />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Display selected stocks for comparison */}
//         <div
//           className={`grid ${
//             selectedStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//           } gap-4 px-10`}
//         >
//           {selectedStocks.map((stock) => (
//             <div
//               key={stock.symbol}
//               className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 ${
//                 selectedStocks.length === 1 ? "w-full" : "w-auto"
//               }`}
//             >
//               <h2 className="text-2xl flex justify-center items-center font-bold text-yellow-500">
//                 <span className="text-black">{stock.symbol}</span> - {stock.companyName}
//               </h2>
//               <p className="text-gray-700 flex justify-center items-center dark:text-gray-300 mt-2">
//                 <strong>Basic Industry:</strong> {stock.basicIndustry}
//               </p>
//               <OpenCloseCards symbol={stock.symbol} companyName={stock.companyName} />
//               <GraphSlider symbol={stock.symbol} isFullWidth={selectedStocks.length === 1} />
//             </div>
//           ))}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Search;

// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import Footer from "../Footer";
// import SearchList from "./SearchList";
// import GraphSlider from "./GraphSlider";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import OpenCloseCards from "./OpenCloseCards";
// import { BsQuote } from "react-icons/bs";
// import { useAuth } from '../AuthContext';
// import toast from 'react-hot-toast';
// import { FaRegEye } from 'react-icons/fa';

// const Search = () => {
//   const { getAuthToken } = useAuth();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const initialQuery = queryParams.get("query") || "";
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const [input, setInput] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedStocks, setSelectedStocks] = useState([]);
//   const [error, setError] = useState(null);
//   const [searchedQueries, setSearchedQueries] = useState(new Set());
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

//   useEffect(() => {
//     if (initialQuery) {
//       fetchData(initialQuery);
//     }
//   }, [initialQuery]);

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
//       setError("Failed to parse cached data.");
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       setError("Failed to cache data.");
//     }
//   };

//   const fetchData = async (value) => {
//     if (!value) {
//       setResults([]);
//       setError(null);
//       return;
//     }

//     const queryLower = value.toLowerCase();
//     const isNewQuery = !searchedQueries.has(queryLower);
//     const token = getAuthToken();

//     if (isNewQuery && !token) {
//       setError("Please log in to search for stocks.");
//       setResults([]);
//       setIsLoginModalOpen(true);
//       return;
//     }

//     const cacheKey = `search_${queryLower}`;
//     const cachedResults = getCachedData(cacheKey);
//     if (cachedResults) {
//       setResults(cachedResults);
//       setError(null);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//         params: { prefix: value },
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       const filteredResults = response.data;
//       if (filteredResults.length === 0) {
//         setError("Company or symbol not found. Please check and try again.");
//       } else {
//         setResults(filteredResults);
//         setCachedData(cacheKey, filteredResults);
//         setError(null);
//       }
//       if (isNewQuery) {
//         setSearchedQueries((prev) => new Set(prev).add(queryLower));
//       }
//     } catch (error) {
//       console.error("Error fetching data:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 401
//           ? "Unauthorized. Please log in again."
//           : error.response?.status === 404
//           ? "Endpoint not found. Check server configuration."
//           : error.response?.data?.error || error.message || "Failed to fetch search results."
//       );
//       setResults([]);
//     }
//   };

//   const handleSelectItem = async (item) => {
//     setInput("");
//     setResults([]);

//     if (selectedStocks.some((stock) => stock.symbol === item.symbol)) {
//       return;
//     }

//     const token = getAuthToken();
//     if (!token) {
//       setIsLoginModalOpen(true);
//       return;
//     }

//     try {
//       const cacheKey = `stock_${item.symbol}`;
//       const cachedStock = getCachedData(cacheKey);
//       if (cachedStock) {
//         setSelectedStocks((prevStocks) => [...prevStocks, cachedStock]);
//         setError(null);
//         handleSave(cachedStock);
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//         params: { prefix: item.companyName },
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 10000,
//       });

//       if (response.data.length > 0) {
//         const matchedStock = response.data.find(
//           (s) => s.symbol === item.symbol && s.companyName === item.companyName
//         ) || response.data[0];
//         setSelectedStocks((prevStocks) => [...prevStocks, matchedStock]);
//         setCachedData(cacheKey, matchedStock);
//         setError(null);
//         handleSave(matchedStock);
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error fetching stock details:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 401
//           ? "Unauthorized. Please log in again."
//           : error.response?.data?.error || error.message || "Failed to fetch stock details."
//       );
//     }
//   };

//   const handleSave = async (stock) => {
//     const token = getAuthToken();

//     if (!token) {
//       setIsLoginModalOpen(true);
//       return;
//     }

//     if (!stock.symbol || !stock.companyName) {
//       setError("Stock has missing symbol or company name.");
//       return;
//     }

//     try {
//       await axios.post(
//         `${API_BASE}/stocks/test/saveStock`,
//         {
//           symbol: stock.symbol,
//           companyName: stock.companyName,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Stock saved successfully");
//       setError(null);
//       localStorage.removeItem(`saved_stocks_${token}`);
//     } catch (error) {
//       console.error("Save error:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       setError(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to save stock. Please try again."
//       );
//     }
//   };

//   const removeStock = (symbol) => {
//     setSelectedStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   const LoginModal = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 max-w-md w-full">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//           Please Log In
//         </h2>
//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
//           You need to be logged in to search or save stocks.
//         </p>
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => setIsLoginModalOpen(false)}
//             className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 text-sm"
//           >
//             Cancel
//           </button>
//           <a
//             href="/login"
//             className="px-4 py-2 bg-slate-800 text-white border border-white rounded-full text-sm font-medium hover:bg-white hover:text-black"
//           >
//             Login
//           </a>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
//       <Navbar />
//       <main className="flex-1 pt-16 pb-12">
//         <div className="text-center">
//           <div className="mt-40 px-4">
//             <h3 className="text-xl md:text-2xl font-bold mb-4">
//               <BsQuote
//                 className="inline-block text-gray-500 dark:text-gray-400 mr-2"
//                 size={40}
//               />
//               <span className="text-yellow-500">Franklin Templeton</span> - "Bulls
//               are <span className="text-yellow-500">born</span> out of pessimism,
//               grow on skepticism, mature on optimism and{" "}
//               <span className="text-yellow-500">die</span> in euphoria."
//             </h3>
//           </div>
//           <h3 className="my-20 text-2xl font-bold mb-4">Search and Compare NSE Stocks</h3>
//         </div>

//         {error && (
//           <div className="text-center text-red-500 mb-4">
//             {error}
//           </div>
//         )}

//         <div className="flex justify-center mt-5">
//           <div className="relative w-full md:w-1/2 max-w-lg m-5">
//             {selectedStocks.length > 0 && (
//               <div className="mb-4">
//                 {selectedStocks.map((stock) => (
//                   <div key={stock.symbol} className="flex items-center bg-gray-100 dark:bg-slate-700 py-1 rounded-lg mb-2">
//                     <span className="ml-2 text-gray-800 dark:text-gray-200">
//                       {stock.symbol} - {stock.companyName}
//                     </span>
//                     <button
//                       className="ml-2 text-xl text-red-500 font-bold"
//                       onClick={() => removeStock(stock.symbol)}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <input
//               type="text"
//               className="w-full px-6 py-3 text-lg rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               placeholder="Search for insights, data, or trends..."
//               value={input}
//               onChange={(e) => {
//                 setInput(e.target.value);
//                 fetchData(e.target.value);
//               }}
//             />
//             {results.length > 0 && (
//               <div className="absolute mt-2 w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md shadow-lg z-50">
//                 <SearchList results={results} query={input} onSelectItem={handleSelectItem} />
//               </div>
//             )}
//           </div>
//         </div>

//         <div
//           className={`grid ${
//             selectedStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//           } gap-4 px-10`}
//         >
//           {selectedStocks.map((stock) => (
//             <div
//               key={stock.symbol}
//               className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-slate-600 ${
//                 selectedStocks.length === 1 ? "w-full" : "w-auto"
//               }`}
//             >
//               <h2 className="text-2xl flex justify-center items-center font-bold text-yellow-500">
//                 <span className="text-black dark:text-white">{stock.symbol}</span> - {stock.companyName}
//               </h2>
//               <p className="text-gray-700 dark:text-gray-300 flex justify-center items-center mt-2">
//                 <strong>Basic Industry:</strong> {stock.basicIndustry || 'N/A'}
//               </p>
//               <OpenCloseCards symbol={stock.symbol} companyName={stock.companyName} />
//               <GraphSlider symbol={stock.symbol} isFullWidth={selectedStocks.length === 1} />
//             </div>
//           ))}
//         </div>
//       </main>
//       {isLoginModalOpen && <LoginModal />}
//       <Footer />
//     </div>
//   );
// };

// export default Search;

//--------------------prev code---------------

// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import Footer from "../Footer";
// import SearchList from "./SearchList";
// import GraphSlider from "./GraphSlider";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import OpenCloseCards from "./OpenCloseCards";
// import { BsQuote } from "react-icons/bs";
// import { useAuth } from '../AuthContext';
// import toast from 'react-hot-toast';

// const Search = () => {
//   const { getAuthToken } = useAuth();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const initialQuery = queryParams.get("query") || "";
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const [input, setInput] = useState("");
//   const [results, setResults] = useState([]);
//   const [selectedStocks, setSelectedStocks] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

//   useEffect(() => {
//     if (initialQuery) {
//       fetchData(initialQuery);
//     }
//   }, [initialQuery]);

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
//       setError("Failed to parse cached data.");
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       setError("Failed to cache data.");
//     }
//   };

//   const fetchData = async (value) => {
//     if (!value) {
//       setResults([]);
//       setError(null);
//       return;
//     }

//     const queryLower = value.toLowerCase();
//     const cacheKey = `search_${queryLower}`;
//     const cachedResults = getCachedData(cacheKey);
//     if (cachedResults) {
//       setResults(cachedResults);
//       setError(null);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//         params: { prefix: value },
//         timeout: 10000,
//       });

//       const filteredResults = response.data;
//       if (filteredResults.length === 0) {
//         setError("Company or symbol not found. Please check and try again.");
//       } else {
//         setResults(filteredResults);
//         setCachedData(cacheKey, filteredResults);
//         setError(null);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 404
//           ? "Endpoint not found. Check server configuration."
//           : error.response?.data?.error || error.message || "Failed to fetch search results."
//       );
//       setResults([]);
//     }
//   };

//   const handleSelectItem = async (item) => {
//     setInput("");
//     setResults([]);

//     if (selectedStocks.some((stock) => stock.symbol === item.symbol)) {
//       return;
//     }

//     try {
//       const cacheKey = `stock_${item.symbol}`;
//       const cachedStock = getCachedData(cacheKey);
//       if (cachedStock) {
//         setSelectedStocks((prevStocks) => [...prevStocks, cachedStock]);
//         setError(null);
//         const token = getAuthToken();
//         if (token) handleSave(cachedStock); // Save only if authenticated
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
//         params: { prefix: item.companyName },
//         timeout: 10000,
//       });

//       if (response.data.length > 0) {
//         const matchedStock = response.data.find(
//           (s) => s.symbol === item.symbol && s.companyName === item.companyName
//         ) || response.data[0];
//         setSelectedStocks((prevStocks) => [...prevStocks, matchedStock]);
//         setCachedData(cacheKey, matchedStock);
//         setError(null);
//         const token = getAuthToken();
//         if (token) handleSave(matchedStock); // Save only if authenticated
//       } else {
//         setError("No stock details found for the selected symbol.");
//       }
//     } catch (error) {
//       console.error("Error fetching stock details:", {
//         message: error.message,
//         status: error.response?.status,
//         response: error.response?.data,
//       });
//       setError(
//         error.response?.status === 404
//           ? "Endpoint not found. Check server configuration."
//           : error.response?.data?.error || error.message || "Failed to fetch stock details."
//       );
//     }
//   };

//   const handleSave = async (stock) => {
//     const token = getAuthToken();

//     if (!token) {
//       setIsLoginModalOpen(true);
//       return;
//     }

//     if (!stock.symbol || !stock.companyName) {
//       setError("Stock has missing symbol or company name.");
//       return;
//     }

//     try {
//       await axios.post(
//         `${API_BASE}/stocks/test/saveStock`,
//         {
//           symbol: stock.symbol,
//           companyName: stock.companyName,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Stock saved successfully");
//       setError(null);
//       localStorage.removeItem(`saved_stocks_${token}`);
//     } catch (error) {
//       console.error("Save error:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       setError(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to save stock. Please try again."
//       );
//     }
//   };

//   const removeStock = (symbol) => {
//     setSelectedStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
//   };

//   const LoginModal = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 max-w-md w-full">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//           Please Log In
//         </h2>
//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
//           You need to be logged in to save stocks.
//         </p>
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => setIsLoginModalOpen(false)}
//             className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 text-sm"
//           >
//             Cancel
//           </button>
//           <a
//             href="/login"
//             className="px-4 py-2 bg-slate-800 text-white border border-white rounded-full text-sm font-medium hover:bg-white hover:text-black"
//           >
//             Login
//           </a>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
//       <Navbar />
//       <main className="flex-1 pt-16 pb-12">
//         <div className="text-center">
//           <div className="mt-40 px-4">
//             <h3 className="text-xl md:text-2xl font-bold mb-4">
//               <BsQuote
//                 className="inline-block text-gray-500 dark:text-gray-400 mr-2"
//                 size={40}
//               />
//               <span className="text-yellow-500">Franklin Templeton</span> - "Bulls
//               are <span className="text-yellow-500">born</span> out of pessimism,
//               grow on skepticism, mature on optimism and{" "}
//               <span className="text-yellow-500">die</span> in euphoria."
//             </h3>
//           </div>
//           <h3 className="my-20 text-2xl font-bold mb-4">Search and Compare NSE Stocks</h3>
//         </div>

//         {error && (
//           <div className="text-center text-red-500 mb-4">
//             {error}
//           </div>
//         )}

//         <div className="flex justify-center mt-5">
//           <div className="relative w-full md:w-1/2 max-w-lg m-5">
//             {selectedStocks.length > 0 && (
//               <div className="mb-4">
//                 {selectedStocks.map((stock) => (
//                   <div key={stock.symbol} className="flex items-center bg-gray-100 dark:bg-slate-700 py-1 rounded-lg mb-2">
//                     <span className="ml-2 text-gray-800 dark:text-gray-200">
//                       {stock.symbol} - {stock.companyName}
//                     </span>
//                     <button
//                       className="ml-2 text-xl text-red-500 font-bold"
//                       onClick={() => removeStock(stock.symbol)}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <input
//               type="text"
//               className="w-full px-6 py-3 text-lg rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//               placeholder="Search for insights, data, or trends..."
//               value={input}
//               onChange={(e) => {
//                 setInput(e.target.value);
//                 fetchData(e.target.value);
//               }}
//             />
//             {results.length > 0 && (
//               <div className="absolute mt-2 w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md shadow-lg z-50">
//                 <SearchList results={results} query={input} onSelectItem={handleSelectItem} />
//               </div>
//             )}
//           </div>
//         </div>

//         <div
//           className={`grid ${
//             selectedStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//           } gap-4 px-10`}
//         >
//           {selectedStocks.map((stock) => (
//             <div
//               key={stock.symbol}
//               className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-slate-600 ${
//                 selectedStocks.length === 1 ? "w-full" : "w-auto"
//               }`}
//             >
//               <h2 className="text-2xl flex justify-center items-center font-bold text-yellow-500">
//                 <span className="text-black dark:text-white">{stock.symbol}</span> - {stock.companyName}
//               </h2>
//               <p className="text-gray-700 dark:text-gray-300 flex justify-center items-center mt-2">
//                 <strong>Basic Industry:</strong> {stock.basicIndustry || 'N/A'}
//               </p>
//               <OpenCloseCards symbol={stock.symbol} companyName={stock.companyName} />
//               <GraphSlider symbol={stock.symbol} isFullWidth={selectedStocks.length === 1} />
//             </div>
//           ))}
//         </div>
//       </main>
//       {isLoginModalOpen && <LoginModal />}
//       <Footer />
//     </div>
//   );
// };

// export default Search;


//-------------------new code---------------

import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import SearchList from "./SearchList";
import GraphSlider from "./GraphSlider";
import { useLocation } from "react-router-dom";
import axios from "axios";
import OpenCloseCards from "./OpenCloseCards";
import { BsQuote } from "react-icons/bs";
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

const Search = () => {
  const { getAuthToken } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const initialQuery = queryParams.get("query") || "";
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      fetchData(initialQuery);
    }
  }, [initialQuery]);

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
      setError("Failed to parse cached data.");
      return null;
    }
  };

  const setCachedData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (err) {
      setError("Failed to cache data.");
    }
  };

  const fetchData = async (value) => {
    if (!value) {
      setResults([]);
      setError(null);
      return;
    }

    const queryLower = value.toLowerCase();
    const cacheKey = `search_${queryLower}`;
    const cachedResults = getCachedData(cacheKey);
    if (cachedResults) {
      setResults(cachedResults);
      setError(null);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
        params: { prefix: value },

      });

      const filteredResults = response.data;
      if (filteredResults.length === 0) {
        setError("Company or symbol not found. Please check and try again.");
      } else {
        setResults(filteredResults);
        setCachedData(cacheKey, filteredResults);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching data:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      setError(
        error.response?.status === 401
          ? "Unauthorized. Please log in again."
          : error.response?.status === 404
            ? "Endpoint not found. Check server configuration."
            : error.response?.data?.error || error.message || "Failed to fetch search results."
      );

      setResults([]);
    }
  };

  const handleSelectItem = async (item) => {
    setInput("");
    setResults([]);

    if (selectedStocks.some((stock) => stock.symbol === item.symbol)) {
      return;
    }

    try {
      const cacheKey = `stock_${item.symbol}`;
      const cachedStock = getCachedData(cacheKey);
      if (cachedStock) {
        setSelectedStocks((prevStocks) => [...prevStocks, cachedStock]);
        setError(null);
        // handleSave(cachedStock);
        return;
      }

      const response = await axios.get(`${API_BASE}/stocks/test/suggest`, {
        params: { prefix: item.companyName },

      });

      if (response.data.length > 0) {
        const matchedStock = response.data.find(
          (s) => s.symbol === item.symbol && s.companyName === item.companyName
        ) || response.data[0];
        setSelectedStocks((prevStocks) => [...prevStocks, matchedStock]);
        setCachedData(cacheKey, matchedStock);
        setError(null);

        // handleSave(matchedStock);
      } else {
        setError("No stock details found for the selected symbol.");
      }
    } catch (error) {
      console.error("Error fetching stock details:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      setError(
        error.response?.status === 401
          ? "Unauthorized. Please log in again."
          : error.response?.data?.error || error.message || "Failed to fetch stock details."
      );
    }
  };

  const handleSave = async (stock) => {
    const token = getAuthToken();

    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!stock.symbol || !stock.companyName) {
      setError("Stock has missing symbol or company name.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/stocks/test/saveStock`,
        {
          symbol: stock.symbol,
          companyName: stock.companyName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Stock saved successfully");
      setError(null);
      localStorage.removeItem(`saved_stocks_${token}`);
    } catch (error) {
      console.error("Save error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(
        error.response?.data?.error ||
        error.message ||
        "Failed to save stock. Please try again."
      );
    }
  };

  const removeStock = (symbol) => {
    setSelectedStocks((prevStocks) => prevStocks.filter((stock) => stock.symbol !== symbol));
  };

  const LoginModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Please Log In
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          You need to be logged in to search or save stocks.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 text-sm"
          >
            Cancel
          </button>
          <a
            href="/login"
            className="px-4 py-2 bg-slate-800 text-white border border-white rounded-full text-sm font-medium hover:bg-white hover:text-black"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 pb-12">
        <div className="text-center">
          <div className="mt-40 px-4">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              <BsQuote
                className="inline-block text-gray-500 dark:text-gray-400 mr-2"
                size={40}
              />
              <span className="text-yellow-500">Franklin Templeton</span> - "Bulls
              are <span className="text-yellow-500">born</span> out of pessimism,
              grow on skepticism, mature on optimism and{" "}
              <span className="text-yellow-500">die</span> in euphoria."
            </h3>
          </div>
          <h3 className="my-20 text-2xl font-bold mb-4">Search and Compare NSE Stocks</h3>
        </div>

        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center mt-5">
          <div className="relative w-full md:w-1/2 max-w-lg m-5">
            {selectedStocks.length > 0 && (
              <div className="mb-4">
                {selectedStocks.map((stock) => (
                  <div key={stock.symbol} className="flex items-center bg-gray-100 dark:bg-slate-700 py-1 rounded-lg mb-2">
                    <span className="ml-2 text-gray-800 dark:text-gray-200">
                      {stock.symbol} - {stock.companyName}
                    </span>
                    <button
                      className="ml-2 text-xl text-red-500 font-bold"
                      onClick={() => removeStock(stock.symbol)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="text"
              className="w-full px-6 py-3 text-lg rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Search for insights, data, or trends..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                fetchData(e.target.value);
              }}
            />
            {results.length > 0 && (
              <div className="absolute mt-2 w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md shadow-lg z-50">
                <SearchList results={results} query={input} onSelectItem={handleSelectItem} />
              </div>
            )}
          </div>
        </div>

        <div
          className={`grid ${selectedStocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            } gap-4 px-10`}
        >
          {selectedStocks.map((stock) => (
            <div
              key={stock.symbol}
              className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-slate-600 ${selectedStocks.length === 1 ? "w-full" : "w-auto"
                }`}
            >
              <h2 className="text-2xl flex justify-center items-center font-bold text-yellow-500">
                <span className="text-black dark:text-white">{stock.symbol}</span> - {stock.companyName}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 flex justify-center items-center mt-2">
                <strong>Basic Industry:</strong> {stock.basicIndustry || 'N/A'}
              </p>
              <OpenCloseCards symbol={stock.symbol} companyName={stock.companyName} />
              <GraphSlider symbol={stock.symbol} isFullWidth={selectedStocks.length === 1} />
            </div>
          ))}
        </div>
      </main>
      {isLoginModalOpen && <LoginModal />}
      <Footer />
    </div>
  );
};

export default Search;