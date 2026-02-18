// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const PortfolioResults = () => {
//     const [portfolioData, setPortfolioData] = useState([]);
//     const [error, setError] = useState("");
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//     useEffect(() => {
//         const fetchPortfolioResults = async () => {
//             const uploadId = localStorage.getItem("uploadId");
//             console.log("uploadId:", uploadId);

//             if (!uploadId) {
//                 setError("Missing uploadId. Please upload a file first.");
//                 return;
//             }

//             try {
//                 const response = await axios.post(
//                     `${API_BASE}/file/portfolio_fifo_results`,
//                     new URLSearchParams({ uploadId }),
//                     {
//                         headers: {
//                             "Content-Type": "application/x-www-form-urlencoded",
//                         },
//                     }
//                 );

//                 const rawData = response.data.portfolio_fifo_results || [];

//                 if (rawData.length > 0) {
//                     const latestDate = Math.max(
//                         ...rawData.map((item) => new Date(item.Date).getTime())
//                     );

//                     const filteredData = rawData.filter(
//                         (item) =>
//                             new Date(item.Date).getTime() === latestDate &&
//                             Number(item.Remaining_Qty) > 90
//                     );

//                     const formattedData = filteredData.map((row) => ({
//                         ...row,
//                         Remaining_Qty: parseInt(row.Remaining_Qty, 10),
//                         Deployed_Amount: parseFloat(row.Deployed_Amount),
//                         Market_Value: parseFloat(row.Market_Value) ,
//                         Realized_PNL: parseFloat(row.Realized_PNL) ,
//                         Unrealized_PNL: parseFloat(row.Unrealized_PNL) ,
//                         Brokerage_Amount: parseFloat(row.Brokerage_Amount) ,
//                         Invested_Amount: parseFloat(row.Invested_Amount) ,
//                         Turn_Over_Amount: parseFloat(row.Turn_Over_Amount) ,
//                     }));

//                     setPortfolioData(formattedData);
//                 } else {
//                     setPortfolioData([]);
//                 }
//             } catch (err) {
//                 setError("Error fetching portfolio results. Please check uploadId or server logs.");
//                 console.error("Error fetching portfolio results:", err);
//             }
//         };

//         fetchPortfolioResults();
//     }, []);

//     const hiddenKeys = ["id", "RowHash"];

//     return (
//         <div className="container mx-auto px-6 py-8">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">Portfolio FIFO Results</h2>

//             {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

//             {portfolioData.length > 0 ? (
//                 <div className="overflow-x-auto shadow-md rounded-lg">
//                     <table className="min-w-full bg-white border border-gray-300 rounded-lg">
//                         <thead className="sticky top-0 bg-gray-100 text-gray-700 text-sm font-bold">
//                             <tr>
//                                 {Object.keys(portfolioData[0])
//                                     .filter((key) => !hiddenKeys.includes(key))
//                                     .map((key) => (
//                                         <th key={key} className="px-4 py-3 border-b border-gray-300 text-left">
//                                             {key.replace(/_/g, " ")}
//                                         </th>
//                                     ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {portfolioData.map((row, index) => (
//                                 <tr
//                                     key={index}
//                                     className="even:bg-gray-50 hover:bg-blue-50 transition duration-200"
//                                 >
//                                     {Object.entries(row)
//                                         .filter(([key]) => !hiddenKeys.includes(key))
//                                         .map(([key, value], i) => (
//                                             <td
//                                                 key={i}
//                                                 className={`px-4 py-2 border-b border-gray-200 text-sm whitespace-nowrap ${
//                                                     key === "Unrealized_PNL" || key === "Realized_PNL"
//                                                         ? Number(value) < 0
//                                                             ? "text-red-600 font-medium"
//                                                             : "text-green-600 font-medium"
//                                                         : "text-gray-700"
//                                                 }`}
//                                             >
//                                                 {value}
//                                             </td>
//                                         ))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 !error && <p className="text-gray-600 mt-4">No data available.</p>
//             )}
//         </div>
//     );
// };

// export default PortfolioResults;





import React, { useState, useEffect } from "react";
import axios from "axios";

const PortfolioResults = () => {
    const [portfolioData, setPortfolioData] = useState([]);
    const [error, setError] = useState("");
    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

    useEffect(() => {
        const fetchPortfolioResults = async () => {
            const uploadId = localStorage.getItem("uploadId");
            console.log("uploadId:", uploadId);

            if (!uploadId) {
                setError("No file uploaded. Please upload a file before continuing.");
                return;
            }

            try {
                const response = await axios.post(
                    `${API_BASE}/file/portfolio_fifo_results`,
                    new URLSearchParams({ uploadId }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );

                const rawData = response.data.portfolio_fifo_results || [];

                if (rawData.length > 0) {
                    const latestDate = Math.max(
                        ...rawData.map((item) => new Date(item.Date).getTime())
                    );

                    const filteredData = rawData.filter(
                        (item) =>
                            new Date(item.Date).getTime() === latestDate &&
                            Number(item.Remaining_Qty) > 90
                    );

                    const formattedData = filteredData.map((row) => ({
                        ...row,
                        Remaining_Qty: parseInt(row.Remaining_Qty, 10),
                        Deployed_Amount: parseFloat(row.Deployed_Amount).toFixed(2),
                        Market_Value: parseFloat(row.Market_Value).toFixed(2),
                        Realized_PNL: parseFloat(row.Realized_PNL).toFixed(2),
                        Unrealized_PNL: parseFloat(row.Unrealized_PNL).toFixed(2),
                        Brokerage_Amount: parseFloat(row.Brokerage_Amount).toFixed(2),
                        Invested_Amount: parseFloat(row.Invested_Amount).toFixed(2),
                        Turn_Over_Amount: parseFloat(row.Turn_Over_Amount).toFixed(2),
                    }));

                    setPortfolioData(formattedData);
                } else {
                    setPortfolioData([]);
                }
            } catch (err) {
                setError("Portfolio not saved. Save it to view the results.");
                console.error("Error fetching portfolio results:", err);
            }
        };

        fetchPortfolioResults();
    }, []);

    const hiddenKeys = ["id", "RowHash"];

    return (
        <div className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Current Holdings</h2>

            {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

            {portfolioData.length > 0 ? (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead className="sticky top-0 bg-gray-100 text-gray-700 text-sm font-bold">
                            <tr>
                                {Object.keys(portfolioData[0])
                                    .filter((key) => !hiddenKeys.includes(key))
                                    .map((key) => (
                                        <th key={key} className="px-4 py-3 border-b border-gray-300 text-left">
                                            {key.replace(/_/g, " ")}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {portfolioData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="even:bg-gray-50 hover:bg-blue-50 transition duration-200"
                                >
                                    {Object.entries(row)
                                        .filter(([key]) => !hiddenKeys.includes(key))
                                        .map(([key, value], i) => (
                                            <td
                                                key={i}
                                                className={`px-4 py-2 border-b border-gray-200 text-sm whitespace-nowrap ${key === "Unrealized_PNL" || key === "Realized_PNL"
                                                    ? Number(value) < 0
                                                        ? "text-red-600 font-medium"
                                                        : "text-green-600 font-medium"
                                                    : "text-gray-700"
                                                    }`}
                                            >
                                                {value}
                                            </td>
                                        ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && <p className="text-gray-600 mt-4">No data available.</p>
            )}
        </div>
    );
};

export default PortfolioResults;