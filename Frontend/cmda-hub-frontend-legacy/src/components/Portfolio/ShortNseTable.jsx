// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ShortNseTable = ({ uploadId }) => {
//     const [data, setData] = useState({ nonNseScript: [], shrtQtytable: [] });
//     const [error, setError] = useState("");
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//      useEffect(() => {
//             if (!uploadId) return;

//     const fetchShortNseData = async () => {
//         try {
//             // const response = await axios.post("http://localhost:8080/api/file/short_nse_table");
//             const response = await axios.post(`${API_BASE}/api/file/short_nse_table`,null,{
//                 params: { uploadId },
//             });

//             console.log("ShortNseTable Data:", response.data); // Debug log

//             setData(response.data);
//         } catch (err) {
//             setError("Error fetching short NSE table data.");
//             console.error("Error:", err);
//         }
//     };
//         fetchShortNseData();
//     }, [uploadId]);

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
//             <h2 className="text-center text-xl font-bold mb-4">Short NSE Table</h2>

//             {error && <p className="text-red-500 text-center">{error}</p>}

//             {/* Non NSE Scripts */}
//             {data.nonNseScript.length > 0 && (
//                 <div className="mb-4">
//                     <h3 className="text-lg font-semibold">Non NSE Scripts</h3>
//                     <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
//                         {data.nonNseScript.map((script, index) => (
//                             <li key={index}>{script}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {/* Short Quantity Table */}
//             {data.shrtQtytable.length > 0 && (
//                 <div className="mt-4">
//                     <h3 className="text-lg font-semibold mb-2">Short Quantity Table</h3>
//                     <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
//                         <thead>
//                             <tr className="bg-gray-200 dark:bg-gray-800">
//                                 <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Scrip Name</th>
//                                 <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">Short Quantity</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {data.shrtQtytable.map((item, index) => (
//                                 <tr key={index} className="border-t border-gray-300 dark:border-gray-700">
//                                     <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item["Scrip Name"]}</td>
//                                     <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item["Short Quantity"]}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {data.nonNseScript.length === 0 && data.shrtQtytable.length === 0 && (
//                 <p className="text-center text-gray-600 dark:text-gray-400">No data available.</p>
//             )}
//         </div>
//     );
// };

// export default ShortNseTable;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Loader2 } from "lucide-react";

// const ShortNseTable = () => {
//     const [data, setData] = useState({ nonNseScript: [], shrtQtytable: [] });
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(true);
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     // useEffect(() => {
//         // if (!uploadId) return;

//     // const fetchShortNseData = async () => {
//     //     try {
//     //         const response = await axios.post(`${API_BASE}/api/file/short_nse_table`);
//     //         setData(response.data);
//     //     } catch (err) {
//     //         setError("Error fetching short NSE table data.");
//     //         console.error("Error:", err);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//     // fetchShortNseData();




//     // }, []);
//     const fetchShortNseData = async () => {
//         try {
//             const response = await axios.post(`${API_BASE}/api/file/short_nse_table`);
//             const safeData = {
//                 nonNseScript: response.data.nonNseScript || [],
//                 shrtQtytable: response.data.shrtQtytable || [],
//             };
//             setData(safeData);
//             console.log("Short NSE Data Response:", response.data);

//         } catch (err) {
//             setError("Error fetching short NSE table data.");
//             console.error("Error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };
//     fetchShortNseData();

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8 dark:bg-gray-900 dark: mb-8">
//             {/* <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">Short NSE Table</h2> */}

//             {loading && (
//                 <div className="flex justify-center items-center py-6">
//                     <Loader2 className="animate-spin text-gray-600 dark:text-gray-300 w-8 h-8" />
//                 </div>
//             )}

//             {error && <p className="text-red-500 text-center text-lg font-medium">{error}</p>}

//             {/* Non NSE Scripts */}
//             {data.nonNseScript.length > 0 && (
//                 <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border-l-4 border-yellow-500">
//                     <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Currently Data Not Available For</h3>
//                     <ul className="list-disc list-inside text-gray-800 dark:text-gray-200 mt-2">
//                         {data.nonNseScript.map((script, index) => (
//                             <p key={index}>{script}</p>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {/* Short Quantity Table */}
//             {data.shrtQtytable.length > 0 && (
//                 <div className="mt-4 overflow-x-auto">
//                     {/* <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Short Quantity Table</h3> */}
//                     <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border-l-4 border-yellow-500">
//                     <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Below are your short positions. The prices from the last date of the previous financial year were used to calculate the square-off value for each scrip, providing an accurate basis for this review.</h3>

//                 </div>
//                 <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">
//     <thead>
//         <tr className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white">
//             <th className="border px-6 py-3 text-left font-semibold">Scrip Name</th>
//             <th className="border px-6 py-3 text-left font-semibold">Short Quantity</th>
//         </tr>
//     </thead>
//     <tbody>
//         {data.shrtQtytable.map((item, index) => (
//             <tr key={index} 
//                 className={`border-t transition-all ${
//                     index % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-700"
//                 } hover:bg-yellow-200 dark:hover:bg-yellow-500`}
//             >
//                 <td className="border px-6 py-3 text-gray-900 dark:text-gray-100 font-medium">{item["Scrip Name"]}</td>
//                 <td className="border px-6 py-3 text-gray-900 dark:text-gray-100 font-medium">{item["Short Quantity"]}</td>
//             </tr>
//         ))}
//     </tbody>
// </table>

//                 </div>
//             )}

//             {!loading && data.nonNseScript.length === 0 && data.shrtQtytable.length === 0 && (
//                 <p className="text-center text-gray-600 dark:text-gray-400 text-lg mt-4">No data available.</p>
//             )}
//         </div>
//     );
// };

// export default ShortNseTable;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Loader2 } from "lucide-react";
// import { HashLoader } from "react-spinners";

// const ShortNseTable = () => {
//     const [data, setData] = useState({ nonNseScript: [], shrtQtytable: [] });
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(true);
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     useEffect(() => {
//     const fetchShortNseData = async () => {
//         const uploadId = localStorage.getItem("uploadId"); // ✅ Get from localStorage or props

//         if (!uploadId) {
//             setError("Missing uploadId. Please upload a file first.");
//             return;
//         }

//         try {
//             const response = await axios.post(`${API_BASE}/file/short_nse_table`,
//                      new URLSearchParams({ uploadId }), // use form format  
//                 );
//             const safeData = {
//                 nonNseScript: response.data.nonNseScript || [],
//                 shrtQtytable: response.data.shrtQtytable || [],
//             };
//             setData(safeData);
//             console.log("Short NSE Data Response:", response.data);

//         } catch (err) {
//             setError("Error fetching short NSE table data.");
//             console.error("Error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchShortNseData();
// }, []);

//     // const fetchShortNseData = async () => {
//     //     try {
//     //         const response = await axios.post(`${API_BASE}/api/file/short_nse_table`);
//     //         setData(response.data);
//     //     } catch (err) {
//     //         setError("Error fetching short NSE table data.");
//     //         console.error("Error:", err);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//     // fetchShortNseData();



//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8 dark:bg-gray-900 dark: mb-8">
//             {/* <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">Short NSE Table</h2> */}

//             {loading && (
//                  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>
//             )}

//             {error && <p className="text-red-500 text-center text-lg font-medium">{error}</p>}

//             {/* Non NSE Scripts */}
//             {data.nonNseScript.length > 0 && (
//                 <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border-l-4 border-yellow-500">
//                     <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Currently Data Not Available For</h3>
//                     <ul className="list-disc list-inside text-gray-800 dark:text-gray-200 mt-2">
//                         {data.nonNseScript.map((script, index) => (
//                             <p key={index}>{script}</p>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {/* Short Quantity Table */}
//             {data.shrtQtytable.length > 0 && (
//                 <div className="mt-4 overflow-x-auto">
//                     {/* <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Short Quantity Table</h3> */}
//                     <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border-l-4 border-yellow-500">
//                     <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Below are your short positions. The prices from the last date of the previous financial year were used to calculate the square-off value for each scrip, providing an accurate basis for this review.</h3>

//                 </div>
//                 <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">
//     <thead>
//         <tr className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white">
//             <th className="border px-6 py-3 text-left font-semibold">Scrip Name</th>
//             <th className="border px-6 py-3 text-left font-semibold">Short Quantity</th>
//         </tr>
//     </thead>
//     <tbody>
//         {data.shrtQtytable.map((item, index) => (
//             <tr key={index} 
//                 className={`border-t transition-all ${
//                     index % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-700"
//                 } hover:bg-yellow-200 dark:hover:bg-yellow-500`}
//             >
//                 <td className="border px-6 py-3 text-gray-900 dark:text-gray-100 font-medium">{item["Scrip Name"]}</td>
//                 <td className="border px-6 py-3 text-gray-900 dark:text-gray-100 font-medium">{item["Short Quantity"]}</td>
//             </tr>
//         ))}
//     </tbody>
// </table>

//                 </div>
//             )}

//             {!loading && data.nonNseScript.length === 0 && data.shrtQtytable.length === 0 && (
//                 <p className="text-center text-gray-600 dark:text-gray-400 text-lg mt-4">No data available.</p>
//             )}
//         </div>
//     );
// };

// export default ShortNseTable;





import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { HashLoader } from "react-spinners";

const ShortNseTable = () => {
    const [data, setData] = useState({ nonNseScript: [], shrtQtytable: [] });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

    useEffect(() => {
        const fetchShortNseData = async () => {
            const uploadId = localStorage.getItem("uploadId"); // ✅ Get from localStorage or props

            if (!uploadId) {
                setError("Please upload a file first.");
                return;
            }

            try {
                const response = await axios.post(`${API_BASE}/file/short_nse_table`,
                    new URLSearchParams({ uploadId }), // use form format  
                );
                const safeData = {
                    nonNseScript: response.data.nonNseScript || [],
                    shrtQtytable: response.data.shrtQtytable || [],
                };
                setData(safeData);
                // console.log("Short NSE Data Response:", response.data);

            } catch (err) {
                setError("Error fetching NSE short table data. Please try again later.");
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchShortNseData();
    }, []);

    // const fetchShortNseData = async () => {
    //     try {
    //         const response = await axios.post(`${API_BASE}/api/file/short_nse_table`);
    //         setData(response.data);
    //     } catch (err) {
    //         setError("Error fetching short NSE table data.");
    //         console.error("Error:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // fetchShortNseData();



    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8 dark:bg-gray-900 dark: mb-8">
            {/* <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">Short NSE Table</h2> */}

            {loading && (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
                    <HashLoader color="#0369a1" size={60} />
                    <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
                        CMDA...
                    </p>
                </div>
            )}

            {error && <p className="text-red-500 text-center text-lg font-medium">{error}</p>}

            {/* Non NSE Scripts */}
            {data.nonNseScript.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Currently Data Not Available For</h3>
                    <ul className="list-disc list-inside text-gray-800 dark:text-gray-200 mt-2">
                        {data.nonNseScript.map((script, index) => (
                            <p key={index}>{script}</p>
                        ))}
                    </ul>
                </div>
            )}

            {/* Short Quantity Table */}
            {data.shrtQtytable.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                    {/* <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Short Quantity Table</h3> */}
                    <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border-l-4 border-yellow-500">
                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Below are your short positions. The prices from the last date of the previous financial year were used to calculate the square-off value for each scrip, providing an accurate basis for this review.</h3>

                    </div>
                    <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                        <thead>
                            <tr className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white">
                                <th className="border px-6 py-3 text-left font-semibold">Scrip Name</th>
                                <th className="border px-6 py-3 text-left font-semibold">Short Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.shrtQtytable.map((item, index) => (
                                <tr key={index}
                                    className={`border-t transition-all ${index % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-700"
                                        } hover:bg-yellow-200 dark:hover:bg-yellow-500`}
                                >
                                    <td className="border px-6 py-3 text-gray-900 dark:text-gray-100 font-medium">{item["Scrip Name"]}</td>
                                    <td className="border px-6 py-3 text-gray-900 dark:text-gray-100 font-medium">{item["Short Quantity"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}

            {!loading && data.nonNseScript.length === 0 && data.shrtQtytable.length === 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 text-lg mt-4">Short Quantity data is not available on your portfolio .</p>
            )}
        </div>
    );
};

export default ShortNseTable;
