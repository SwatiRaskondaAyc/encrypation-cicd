// import React, { useEffect, useState, useMemo } from "react";
// import Plot from "react-plotly.js";
// // import { RiInformation2Fill } from "react-icons/ri";
// import { HashLoader } from "react-spinners";

// const CandleSpread = ({ symbol }) => {
//   const [payload, setPayload] = useState(null);
//   const [error, setError] = useState(null);
//   const [mode, setMode] = useState("OC"); 


//   const API_BASE = import.meta.env.VITE_URL;

//   // Fetch plot data
//   useEffect(() => {
//     if (!symbol ) return;
//     fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         symbol: symbol.toLowerCase(), // Ensure lowercase for consistency
//         companyName:symbol,
//         fig_type: mode, // Use mode as fig_type
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         if (data.status !== "success") throw new Error(data.message || "Failed to fetch plot");
//         setPayload(data.data); // Store data.figure directly
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Error fetching plot data:", err);
//         setError(err.message);
//       });
//   }, [symbol,mode, API_BASE]);

//   const selectedFig = useMemo(() => {
//     if (!payload?.figure) return null;
//     const figure = { ...payload.figure };

//     // Decode base64 data if present
//     figure.data = figure.data.map((trace) => {
//       if (trace.x?.bdata) {
//         try {
//           const decoded = atob(trace.x.bdata); // Decode base64
//           const array = new Float64Array(
//             new Uint8Array(decoded.split("").map((c) => c.charCodeAt(0))).buffer
//           );
//           return { ...trace, x: Array.from(array) }; // Convert to array
//         } catch (e) {
//           console.error("Error decoding base64 data:", e);
//           return trace;
//         }
//       }
//       return trace;
//     });

//     return figure;
//   }, [payload]);


//   if (error) {
//     return <div className="text-red-500 text-center">Error: {error}</div>;
//   }
//   if (!payload || !selectedFig) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           CMDA...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative mb-3">
//       {/* Controls: Mode & Period selectors */}
//       <div className="flex space-x-4 mb-4">
//         <select
//           value={mode}
//           onChange={(e) => {
//             setMode(e.target.value);

//           }}
//           className="p-2 border rounded"
//         >
//           <option value="OC">Open-Close (OC)</option>
//           <option value="HL">High-Low (HL)</option>
//         </select>


//       </div>



//           <Plot
//             data={selectedFig.data}
//             layout={{
//               ...selectedFig.layout,
//               autosize: true,
//               margin: { t: 20, l: 20, r: 20, b: 20 }, // optional, improve responsiveness
//             }}
//             config={{
//               displaylogo: false,
//               responsive: true,
//               ...payload.config,
//             }}
//             useResizeHandler={true}
//             style={{ width: "100%", height: "100%" }}
//           />


//     </div>
//   );
// };

// export default CandleSpread;

// ------------------wc--------------------

// import React, { useEffect, useState, useMemo } from "react";
// import Plot from "react-plotly.js";
// // import { RiInformation2Fill } from "react-icons/ri";
// import { HashLoader } from "react-spinners";

// const CandleSpread = ({ symbol }) => {
//   const [payload, setPayload] = useState(null);
//   const [error, setError] = useState(null);
//   const [mode, setMode] = useState("OC");


//   const API_BASE = import.meta.env.VITE_URL;

//   // Fetch plot data
//   useEffect(() => {
//     if (!symbol) return;
//     fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         symbol: symbol.toLowerCase(), // Ensure lowercase for consistency
//         companyName: symbol,
//         fig_type: mode, // Use mode as fig_type
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         if (data.status !== "success") throw new Error(data.message || "Failed to fetch plot");
//         setPayload(data.data); // Store data.figure directly
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Error fetching plot data:", err);
//         setError(err.message);
//       });
//   }, [symbol, mode, API_BASE]);

//   const selectedFig = useMemo(() => {
//     if (!payload?.figure) return null;
//     const figure = { ...payload.figure };

//     // Decode base64 data if present
//     figure.data = figure.data.map((trace) => {
//       if (trace.x?.bdata) {
//         try {
//           const decoded = atob(trace.x.bdata); // Decode base64
//           const array = new Float64Array(
//             new Uint8Array(decoded.split("").map((c) => c.charCodeAt(0))).buffer
//           );
//           return { ...trace, x: Array.from(array) }; // Convert to array
//         } catch (e) {
//           console.error("Error decoding base64 data:", e);
//           return trace;
//         }
//       }
//       return trace;
//     });

//     return figure;
//   }, [payload]);


//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md border border-red-200 dark:border-red-800/50">
//         <p className="text-red-500 font-medium">Error: {error}</p>
//         <button
//           onClick={() => setPayload(null)} // Trigger re-fetch
//           className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }
//   if (!payload || !selectedFig) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           CMDA...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative mb-3">
//       {/* Controls: Mode & Period selectors */}
//       <div className="flex space-x-4 mb-4">
//         <select
//           value={mode}
//           onChange={(e) => {
//             setMode(e.target.value);

//           }}
//           className="p-2 border rounded"
//         >
//           <option value="OC">Open-Close (OC)</option>
//           <option value="HL">High-Low (HL)</option>
//         </select>


//       </div>

//       {/* Plotly component 
//       <Plot
//         data={selectedFig.data}
//         layout={{ ...selectedFig.layout, autosize: true }}
//         config={payload.config || {}}
//         useResizeHandler={true}
//         style={{ width: "100%", height: "100%" }}
//       />
// */}

//       <Plot
//         data={selectedFig.data}
//         layout={{
//           ...selectedFig.layout,
//           autosize: true,
//           margin: { t: 20, l: 20, r: 20, b: 20 },
//           height: 600, // Set minimum height
//         }}
//         config={{
//           displaylogo: false,
//           responsive: true,
//           ...payload.config,
//         }}
//         useResizeHandler={true}
//         style={{ width: '100%', minHeight: '600px' }}
//       />


//     </div>
//   );
// };

// export default CandleSpread;

// -------------rating is working------------------

// import React, { useEffect, useState, useMemo } from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";

// const CandleSpread = ({ symbol }) => {
//   /* ------------------------------------------------------------------
//    *  State
//    * ------------------------------------------------------------------ */
//   const [payload, setPayload] = useState(null);
//   const [error, setError] = useState(null);
//   const [mode, setMode] = useState("OC");
//   const [rating, setRating] = useState(null); // Current UI-selected rating
//   const [userRating, setUserRating] = useState(null); // Persisted user-submitted or fetched rating
//   const [ratingResponse, setRatingResponse] = useState(null);
//   const [ratingError, setRatingError] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false); // Track if rating is submitted

//   const API_BASE = import.meta.env.VITE_URL;

//   /* ------------------------------------------------------------------
//    *  Logging (keep for debugging)
//    * ------------------------------------------------------------------ */
//   // console.log("API_BASE:", API_BASE);
//   // console.log("Symbol:", symbol);
//   // console.log("authToken from localStorage:", localStorage.getItem("authToken"));

//   /* ------------------------------------------------------------------
//    *  Fetch plot data
//    * ------------------------------------------------------------------ */
//   useEffect(() => {
//     if (!symbol) return;

//     const body = {
//       symbol: symbol.toLowerCase(),
//       companyName: symbol,
//       fig_type: mode,
//     };

//     console.log("Fetching plot →", body);
//     fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     })
//       .then((res) => {
//         console.log("Plot response status:", res.status);
//         if (!res.ok) return res.text().then((txt) => Promise.reject(`HTTP ${res.status}: ${txt}`));
//         return res.json();
//       })
//       .then((data) => {
//         if (!data || data.status !== "success") throw new Error(data?.message || "Failed");
//         setPayload(data.data);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Plot error:", err);
//         setError(err.message);
//       });
//   }, [symbol, mode, API_BASE]);

//   /* ------------------------------------------------------------------
//    *  Fetch user rating
//    * ------------------------------------------------------------------ */
//   useEffect(() => {
//     const fetchUserRating = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.warn("No authentication token available for fetching user rating");
//         setUserRating(null);
//         setRating(null);
//         return;
//       }

//       console.log("Fetching user rating for mode:", mode);
//       try {
//         const response = await fetch(`${API_BASE}/stocks/test/ratings/candle_chronicle/user`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("User rating response status:", response.status);
//         const responseText = await response.text();
//         console.log("User rating response body:", responseText);

//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${responseText || "Failed to fetch rating"}`);
//         }

//         const data = responseText ? JSON.parse(responseText) : {};
//         if (data.rating !== undefined && data.rating >= 1 && data.rating <= 5) {
//           setUserRating(data.rating); // Persist fetched rating
//           setRating(data.rating); // Update UI on login
//           toast.success("User rating loaded successfully!");
//         } else {
//           setUserRating(null);
//           setRating(null);
//         }
//       } catch (err) {
//         console.error("User rating error:", err);
//         toast.error("Failed to load user rating.");
//         setUserRating(null);
//         setRating(null);
//       }
//     };

//     fetchUserRating();
//   }, [mode, localStorage.getItem("authToken")]); // Re-fetch on mode or token change

//   /* ------------------------------------------------------------------
//    *  Submit rating
//    * ------------------------------------------------------------------ */
//   const submitRating = async () => {
//     if (rating === null || rating < 1 || rating > 5) {
//       toast.error("Please select a rating (1-5 stars) first.");
//       return;
//     }

//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       toast.error("Authentication token missing.");
//       return;
//     }

//     console.log("Submitting rating →", { rating });
//     try {
//       const response = await fetch(`${API_BASE}/stocks/test/ratings/candle_chronicle`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ rating }),
//       });

//       const responseText = await response.text();
//       console.log("Response body:", responseText);

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${responseText || "Bad Request"}`);
//       }

//       let data;
//       try {
//         data = responseText ? JSON.parse(responseText) : {};
//       } catch (parseErr) {
//         data = { message: responseText || "Rating submitted successfully" };
//       }
//       setUserRating(rating); // Persist the submitted rating
//       setRating(rating); // Sync UI
//       toast.success(data.message || "Rating submitted successfully!");
//       setRatingResponse(data.message || "Rating saved.");
//       setRatingError(null);
//       setIsSubmitted(true); // Mark as submitted
//     } catch (err) {
//       console.error("Rating error:", err);
//       if (err.message.includes("HTTP 400") || err.message.includes("HTTP 500")) {
//         toast.error(err.message || "Failed to submit rating due to server error.");
//       } else {
//         toast.error("Failed to submit rating. Please try again.");
//       }
//       setRatingError(err.message);
//       setRatingResponse(null);
//     }
//   };

//   // Auto-submit rating when tab is switched
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && rating !== null && rating !== userRating && !isSubmitted) {
//         submitRating();
//       } else if (document.hidden && rating === userRating && isSubmitted) {
//         setIsSubmitted(true); // Maintain submitted state
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, [rating, userRating, isSubmitted]);

//   /* ------------------------------------------------------------------
//    *  Plotly figure preparation
//    * ------------------------------------------------------------------ */
//   const selectedFig = useMemo(() => {
//     if (!payload?.figure) return null;
//     const figure = { ...payload.figure };

//     figure.data = figure.data.map((trace) => {
//       if (trace.x?.bdata) {
//         try {
//           const decoded = atob(trace.x.bdata);
//           const array = new Float64Array(
//             new Uint8Array(decoded.split("").map((c) => c.charCodeAt(0))).buffer
//           );
//           return { ...trace, x: Array.from(array) };
//         } catch (e) {
//           console.error("Base64 decode error:", e);
//           return trace;
//         }
//       }
//       return trace;
//     });

//     return figure;
//   }, [payload]);

//   /* ------------------------------------------------------------------
//    *  Render – error / loading
//    * ------------------------------------------------------------------ */
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md border border-red-200 dark:border-red-800/50">
//         <p className="text-red-500 font-medium">Error: {error}</p>
//         <button
//           onClick={() => setPayload(null)}
//           className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!payload || !selectedFig) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           CMDA...
//         </p>
//       </div>
//     );
//   }

//   /* ------------------------------------------------------------------
//    *  Render – main UI
//    * ------------------------------------------------------------------ */
//   return (
//     <div className="relative mb-3">
//       {/* ---------- Controls (mode + rating) ---------- */}
//       <div className="flex flex-wrap items-center gap-4 mb-4">
//         {/* Mode selector */}
//         <select
//           value={mode}
//           onChange={(e) => setMode(e.target.value)}
//           className="p-2 border rounded"
//         >
//           <option value="OC">Open-Close (OC)</option>
//           <option value="HL">High-Low (HL)</option>
//         </select>

//         {/* ---- Star rating picker ---- */}
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium">Rate this chart:</span>
//           <div className="flex">
//             {[1, 2, 3, 4, 5].map((value) => (
//               <button
//                 key={value}
//                 type="button"
//                 onClick={() => {
//                   setRating(value);
//                   setIsSubmitted(false); // Allow auto-submit on new selection
//                 }}
//                 className={`text-2xl focus:outline-none transition-colors ${userRating >= value || (rating && rating >= value) ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}
//                 title={`${value} star${value > 1 ? "s" : ""}`}
//               >
//                 ★
//               </button>
//             ))}
//           </div>
//           <div className={`text-2xl ${userRating ? `text-yellow-400` : "text-gray-300"}`}>
//             {userRating && Array(userRating).fill("★")}
//           </div>
//           {/* Submit button only if not submitted */}
//           {!isSubmitted && (
//             <button
//               onClick={submitRating}
//               className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
//             >
//               Submit Rating
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ---------- Rating messages (optional fallback) ---------- */}
//       {ratingResponse && <p className="text-green-600 mb-2">{ratingResponse}</p>}
//       {ratingError && <p className="text-red-600 mb-2">{ratingError}</p>}

//       {/* ---------- Plotly ---------- */}
//       <Plot
//         data={selectedFig.data}
//         layout={{
//           ...selectedFig.layout,
//           autosize: true,
//           margin: { t: 20, l: 20, r: 20, b: 20 },
//           height: 600,
//         }}
//         config={{
//           displaylogo: false,
//           responsive: true,
//           ...payload.config,
//         }}
//         useResizeHandler={true}
//         style={{ width: "100%", minHeight: "600px" }}
//       />
//     </div>
//   );
// };

// export default CandleSpread;





// import React, { useEffect, useState, useMemo } from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";

// const CandleSpread = ({ symbol }) => {
//   /* ------------------------------------------------------------------
//    *  State
//    * ------------------------------------------------------------------ */
//   const [payload, setPayload] = useState(null);
//   const [error, setError] = useState(null);
//   const [mode, setMode] = useState("OC");
//   const [rating, setRating] = useState(null);
//   const [userRating, setUserRating] = useState(null);
//   const [ratingResponse, setRatingResponse] = useState(null);
//   const [ratingError, setRatingError] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [showRatingModal, setShowRatingModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false); // New state for edit mode

//   const API_BASE = import.meta.env.VITE_URL;

//   /* ------------------------------------------------------------------
//    *  Fetch plot data
//    * ------------------------------------------------------------------ */
//   useEffect(() => {
//     if (!symbol) return;

//     const body = {
//       symbol: symbol.toLowerCase(),
//       companyName: symbol,
//       fig_type: mode,
//     };

//     console.log("Fetching plot →", body);
//     fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     })
//       .then((res) => {
//         console.log("Plot response status:", res.status);
//         if (!res.ok) return res.text().then((txt) => Promise.reject(`HTTP ${res.status}: ${txt}`));
//         return res.json();
//       })
//       .then((data) => {
//         if (!data || data.status !== "success") throw new Error(data?.message || "Failed");
//         setPayload(data.data);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Plot error:", err);
//         setError(err.message);
//       });
//   }, [symbol, mode, API_BASE]);

//   /* ------------------------------------------------------------------
//    *  Fetch user rating
//    * ------------------------------------------------------------------ */
//   useEffect(() => {
//     const fetchUserRating = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.warn("No authentication token available for fetching user rating");
//         setUserRating(null);
//         setRating(null);
//         setIsSubmitted(false);
//         return;
//       }

//       console.log("Fetching user rating for mode:", mode);
//       try {
//         const response = await fetch(`${API_BASE}/stocks/test/ratings/candle_chronicle/user`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("User rating response status:", response.status);
//         const responseText = await response.text();
//         console.log("User rating response body:", responseText);

//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${responseText || "Failed to fetch rating"}`);
//         }

//         const data = responseText ? JSON.parse(responseText) : {};
//         if (data.rating !== undefined && data.rating >= 1 && data.rating <= 5) {
//           setUserRating(data.rating);
//           setRating(data.rating);
//           setIsSubmitted(true);
//           // Auto-open modal if user has already rated
//           setShowRatingModal(true);
//         } else {
//           setUserRating(null);
//           setRating(null);
//           setIsSubmitted(false);
//         }
//       } catch (err) {
//         console.error("User rating error:", err);
//         setUserRating(null);
//         setRating(null);
//         setIsSubmitted(false);
//       }
//     };

//     fetchUserRating();
//   }, [mode, API_BASE]);

//   /* ------------------------------------------------------------------
//    *  Submit rating
//    * ------------------------------------------------------------------ */
//   const submitRating = async (newRating = rating) => {
//     if (newRating === null || newRating < 1 || newRating > 5) {
//       toast.error("Please select a rating (1-5 stars) first.");
//       return;
//     }

//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       toast.error("Please log in to submit a rating.");
//       return;
//     }

//     setIsLoading(true);
//     console.log("Submitting rating →", { rating: newRating });
//     try {
//       const response = await fetch(`${API_BASE}/stocks/test/ratings/candle_chronicle`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ rating: newRating }),
//       });

//       const responseText = await response.text();
//       console.log("Response body:", responseText);

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${responseText || "Bad Request"}`);
//       }

//       let data;
//       try {
//         data = responseText ? JSON.parse(responseText) : {};
//       } catch (parseErr) {
//         data = { message: responseText || "Rating submitted successfully" };
//       }

//       setUserRating(newRating);
//       setRating(newRating);
//       setIsSubmitted(true);
//       setIsEditing(false); // Exit edit mode
//       setShowRatingModal(false);
//       toast.success(`Rating submitted: ${newRating} stars!`);
//       setRatingResponse(data.message || "Rating saved successfully.");
//       setRatingError(null);
//     } catch (err) {
//       console.error("Rating error:", err);
//       toast.error("Failed to submit rating. Please try again.");
//       setRatingError(err.message);
//       setRatingResponse(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* ------------------------------------------------------------------
//    *  Handle Edit Rating
//    * ------------------------------------------------------------------ */
//   const handleEditRating = () => {
//     setIsEditing(true);
//     setRating(userRating); // Set current rating for editing
//   };

//   /* ------------------------------------------------------------------
//    *  Handle Cancel Edit
//    * ------------------------------------------------------------------ */
//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setRating(userRating); // Reset to original rating
//   };

//   /* ------------------------------------------------------------------
//    *  Plotly figure preparation
//    * ------------------------------------------------------------------ */
//   const selectedFig = useMemo(() => {
//     if (!payload?.figure) return null;
//     const figure = { ...payload.figure };

//     figure.data = figure.data.map((trace) => {
//       if (trace.x?.bdata) {
//         try {
//           const decoded = atob(trace.x.bdata);
//           const array = new Float64Array(
//             new Uint8Array(decoded.split("").map((c) => c.charCodeAt(0))).buffer
//           );
//           return { ...trace, x: Array.from(array) };
//         } catch (e) {
//           console.error("Base64 decode error:", e);
//           return trace;
//         }
//       }
//       return trace;
//     });

//     return figure;
//   }, [payload]);

//   /* ------------------------------------------------------------------
//    *  Render – error / loading
//    * ------------------------------------------------------------------ */
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-red-200 dark:border-red-800">
//         <div className="text-red-500 text-4xl mb-4">⚠️</div>
//         <p className="text-red-600 dark:text-red-400 font-medium text-lg mb-2">Error Loading Chart</p>
//         <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
//         <button
//           onClick={() => setPayload(null)}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!payload || !selectedFig) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
//         <HashLoader color="#3b82f6" size={80} />
//         <p className="mt-6 text-blue-600 dark:text-blue-400 font-semibold text-xl animate-pulse">
//           Loading Chart Data...
//         </p>
//       </div>
//     );
//   }

//   /* ------------------------------------------------------------------
//    *  Render – main UI
//    * ------------------------------------------------------------------ */

//   return (
//     <div className="relative mb-6">
//       {/* Rating Modal - Shows automatically when user has already rated */}
//       {showRatingModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto">
//             <div className="text-center">
//               {/* Header */}
//               <div className="mb-4">
//                 <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <span className="text-2xl">⭐</span>
//                 </div>
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">
//                   You've Already Rated
//                 </h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                   Your rating has been saved.
//                 </p>
//               </div>

//               {/* Current Rating Display */}
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Your Current Rating</p>
//                 <div className="flex justify-center text-2xl mb-1">
//                   {Array.from({ length: 5 }, (_, i) => (
//                     <span
//                       key={i}
//                       className={i < (userRating || 0) ? "text-yellow-400" : "text-gray-300"}
//                     >
//                       ★
//                     </span>
//                   ))}
//                 </div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   {userRating || 0} out of 5 stars
//                 </p>
//               </div>

//               {/* Small Edit Option */}
//               <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
//                   Want to change your rating?
//                 </p>
//                 <button
//                   onClick={() => {
//                     setRating(userRating); // Set initial rating for editing
//                   }}
//                   className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
//                 >
//                   Edit Rating
//                 </button>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 justify-center mt-4">
//                 <button
//                   onClick={() => setShowRatingModal(false)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex-1"
//                 >
//                   Continue
//                 </button>
//               </div>
//             </div>

//             {/* Edit Rating Section - Controlled by a separate state */}
//             {rating !== null && (
//               <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
//                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
//                   Update Your Rating
//                 </p>

//                 {/* Star Rating */}
//                 <div className="flex justify-center gap-1 mb-4">
//                   {[1, 2, 3, 4, 5].map((value) => (
//                     <button
//                       key={value}
//                       onClick={() => setRating(value)}
//                       className={`text-3xl transition-transform hover:scale-110 ${rating >= value ? "text-yellow-400" : "text-gray-300"
//                         }`}
//                     >
//                       ★
//                     </button>
//                   ))}
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       setRating(userRating);
//                       setShowRatingModal(false);
//                     }}
//                     className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm flex-1"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => submitRating(rating)}
//                     disabled={isLoading || rating === userRating}
//                     className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex-1 flex items-center justify-center gap-1"
//                   >
//                     {isLoading ? (
//                       <>
//                         <HashLoader color="#ffffff" size={12} />
//                         Updating...
//                       </>
//                     ) : (
//                       "Update"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           {/* Mode Selector */}
//           <div className="flex items-center gap-3">
//             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               Chart Type:
//             </label>
//             <select
//               value={mode}
//               onChange={(e) => setMode(e.target.value)}
//               className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             >
//               <option value="OC">Open-Close (OC)</option>
//               <option value="HL">High-Low (HL)</option>
//             </select>
//           </div>

//           {/* Rating Section - Compact version when already submitted */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//             {isSubmitted && userRating ? (
//               <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-medium text-green-800 dark:text-green-300">
//                     Rated:
//                   </span>
//                   <div className="flex text-lg">
//                     {Array.from({ length: 5 }, (_, i) => (
//                       <span
//                         key={i}
//                         className={i < (userRating || 0) ? "text-yellow-400" : "text-gray-300"}
//                       >
//                         ★
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowRatingModal(true)}
//                   className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
//                 >
//                   Edit
//                 </button>
//               </div>
//             ) : (
//               <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//                     Rate this chart:
//                   </span>
//                   <div className="flex">
//                     {[1, 2, 3, 4, 5].map((value) => (
//                       <button
//                         key={value}
//                         onClick={() => setRating(value)}
//                         className={`text-2xl transition-transform hover:scale-110 ${rating >= value ? "text-yellow-400" : "text-gray-300"
//                           } hover:text-yellow-400`}
//                       >
//                         ★
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => submitRating()}
//                   disabled={isLoading || !rating}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 text-sm"
//                 >
//                   {isLoading ? (
//                     <>
//                       <HashLoader color="#ffffff" size={20} />
//                       Submitting...
//                     </>
//                   ) : (
//                     "Submit Rating"
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Rating Messages */}
//         {ratingResponse && (
//           <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
//             <p className="text-green-700 dark:text-green-300 font-medium text-sm">
//               ✅ {ratingResponse}
//             </p>
//           </div>
//         )}
//         {ratingError && (
//           <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//             <p className="text-red-700 dark:text-red-300 font-medium text-sm">
//               ❌ {ratingError}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Chart Container */}
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 relative">
//         <Plot
//           data={selectedFig.data}
//           layout={{
//             ...selectedFig.layout,
//             autosize: true,
//             margin: { t: 40, l: 60, r: 40, b: 60 },
//             height: 600,
//             paper_bgcolor: 'transparent',
//             plot_bgcolor: 'transparent',
//             font: { color: '#374151', family: 'Inter' },
//           }}
//           config={{
//             displaylogo: false,
//             responsive: true,
//             ...payload.config,
//           }}
//           useResizeHandler={true}
//           style={{ width: "100%", minHeight: "600px" }}
//         />

//         {/* Small Rating Badge on Chart */}
//         {isSubmitted && userRating && (
//           <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-yellow-200 dark:border-yellow-800">
//             <div className="text-center">
//               <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Your Rating
//               </p>
//               <div className="flex justify-center text-lg mb-1">
//                 {Array.from({ length: 5 }, (_, i) => (
//                   <span
//                     key={i}
//                     className={i < (userRating || 0) ? "text-yellow-400" : "text-gray-300"}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
//   export default CandleSpread;

// CandleSpread.jsx (simplified)
// CandleSpread.jsx
// ------------------------------------------------------------------
// import React, { useEffect, useState, useMemo } from "react";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";
// import RatingSystem from "../RatingFile/RatingSystem";


// const CandleSpread = ({ symbol }) => {
//   const [payload, setPayload] = useState(null);
//   const [error, setError] = useState(null);
//   const [mode, setMode] = useState("OC");

//   const API_BASE = import.meta.env.VITE_URL;

//   const handleRatingUpdate = (newRating) => {
//     console.log("Candle Chronicle rating updated:", newRating);
//   };

//   // Process figure data (your existing logic)
//   const processFigure = (figure) => {
//     const processedFigure = { ...figure };
//     processedFigure.data = figure.data.map((trace) => {
//       if (trace.x?.bdata) {
//         try {
//           const decoded = atob(trace.x.bdata);
//           const array = new Float64Array(
//             new Uint8Array(decoded.split("").map((c) => c.charCodeAt(0))).buffer
//           );
//           return { ...trace, x: Array.from(array) };
//         } catch (e) {
//           console.error("Base64 decode error:", e);
//           return trace;
//         }
//       }
//       return trace;
//     });
//     return processedFigure;
//   };

//   // Fetch plot data
//   useEffect(() => {
//     if (!symbol) return;

//     const body = {
//       symbol: symbol.toLowerCase(),
//       companyName: symbol,
//       fig_type: mode,
//     };

//     console.log("Fetching plot →", body);
//     fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     })
//       .then((res) => {
//         console.log("Plot response status:", res.status);
//         if (!res.ok) return res.text().then((txt) => Promise.reject(`HTTP ${res.status}: ${txt}`));
//         return res.json();
//       })
//       .then((data) => {
//         if (!data || data.status !== "success") throw new Error(data?.message || "Failed");
//         setPayload(data.data);
//         setError(null);
//       })
//       .catch((err) => {
//         console.error("Plot error:", err);
//         setError(err.message);
//       });
//   }, [symbol, mode, API_BASE]);

//   const selectedFig = useMemo(() => {
//     if (!payload?.figure) return null;
//     return processFigure(payload.figure);
//   }, [payload]);

//   // Error component (defined inside)
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-red-200 dark:border-red-800">
//         <div className="text-red-500 text-4xl mb-4">⚠️</div>
//         <p className="text-red-600 dark:text-red-400 font-medium text-lg mb-2">Error Loading Chart</p>
//         <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
//         <button
//           onClick={() => setPayload(null)}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // Loading component (defined inside)
//   if (!payload || !selectedFig) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           CMDA...
//         </p>
//       </div>
//     );
//   }



//   return (
//     <div className="relative mb-6">
//       {/* Header Section */}
//       <div className="bg-white dark:bg-gray-800 ">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           {/* Mode Selector */}
//           {/* <div className="flex items-center gap-3">
//             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               Chart Type:
//             </label>
//             <select
//               value={mode}
//               onChange={(e) => setMode(e.target.value)}
//               className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             >
//               <option value="OC">Open-Close (OC)</option>
//               <option value="HL">High-Low (HL)</option>
//             </select>
//           </div> */}


//           {/* Reusable Rating Component */}
//           <RatingSystem
//             plotType="candle_chronicle"

//             onRatingUpdate={handleRatingUpdate}
//           />
//         </div>
//       </div>

//       {/* Chart Container */}
//       <div className="bg-white dark:bg-gray-800 ">
//         <Plot
//           data={selectedFig.data}
//           layout={{
//             ...selectedFig.layout,
//             autosize: true,
//             margin: { t: 40, l: 60, r: 40, b: 60 },
//             height: 600,
//             paper_bgcolor: 'transparent',
//             plot_bgcolor: 'transparent',
//             font: { color: '#374151', family: 'Inter' },
//           }}
//           config={{
//             displaylogo: false,
//             responsive: true,
//           }}
//           useResizeHandler={true}
//           style={{ width: "100%", minHeight: "600px" }}
//         />
//         <div
//           className="text-gray-700 dark:text-gray-300"
//           style={{
//             marginTop: 12,
//             whiteSpace: "pre-line",
//             minHeight: "20px",
//             padding: "8px",
//             border: "1px solid #e5e7eb",
//             borderRadius: "4px",
//           }}
//         >
//           {payload?.comment ? payload.comment : "No comments available."}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CandleSpread;
// ---------------------  use memo----------------------------------------


// import React, { useEffect, useState, useMemo } from "react";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";
// import RatingSystem from "../RatingFile/RatingSystem";

// const CandleSpread = ({ symbol }) => {
//   const [payload, setPayload] = useState(null);
//   const [error, setError] = useState(null);
//   const [mode, setMode] = useState("OC");
//   const [period, setPeriod] = useState("TTM");
//   const [loading, setLoading] = useState(false);

//   const API_BASE = import.meta.env.VITE_URL;

//   const handleRatingUpdate = (newRating) => {
//     console.log("Candle Chronicle rating updated:", newRating);
//   };

//   // Memoized processFigure function
//   const processFigure = useMemo(() => {
//     return (figure) => {
//       if (!figure?.data) return figure;

//       const processedFigure = { ...figure };
//       processedFigure.data = figure.data.map((trace) => {
//         if (trace.x?.bdata) {
//           try {
//             const decoded = atob(trace.x.bdata);
//             const array = new Float64Array(
//               new Uint8Array(decoded.split("").map((c) => c.charCodeAt(0))).buffer
//             );
//             return { ...trace, x: Array.from(array) };
//           } catch (e) {
//             console.error("Base64 decode error:", e);
//             return trace;
//           }
//         }
//         return trace;
//       });
//       return processedFigure;
//     };
//   }, []);

//   // Memoized request body
//   const requestBody = useMemo(() => {
//     if (!symbol) return null;

//     return {
//       symbol: symbol.toLowerCase(),
//       companyName: symbol,
//       fig_type: mode,
//       period: period,
//     };
//   }, [symbol, mode, period]);

//   // Memoized API URL
//   const apiUrl = useMemo(() => {
//     return `${API_BASE}/stocks/test/candle_chronicle`;
//   }, [API_BASE]);

//   // Fetch plot data
//   useEffect(() => {
//     if (!requestBody) return;

//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       setPayload(null); // Clear previous data immediately

//       console.log("Fetching plot →", requestBody);

//       try {
//         const response = await fetch(apiUrl, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(requestBody),
//         });

//         console.log("Plot response status:", response.status);

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`HTTP ${response.status}: ${errorText}`);
//         }

//         const data = await response.json();
//         console.log("API Response:", data);

//         if (!data || data.status !== "success") {
//           throw new Error(data?.message || "Failed to fetch data");
//         }

//         setPayload(data.data);
//       } catch (err) {
//         console.error("Plot error:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [requestBody, apiUrl]);

//   // Memoized processed figure
//   const selectedFig = useMemo(() => {
//     if (!payload?.figure) return null;
//     return processFigure(payload.figure);
//   }, [payload, processFigure]);

//   // Memoized comment
//   const currentComment = useMemo(() => {
//     return payload?.comment || "No comments available.";
//   }, [payload?.comment]); // Only depend on comment specifically

//   // Memoized plot layout configuration
//   const plotLayout = useMemo(() => {
//     if (!selectedFig?.layout) return null;

//     return {
//       ...selectedFig.layout,
//       autosize: true,
//       margin: { t: 40, l: 60, r: 40, b: 60 },
//       height: 600,
//       paper_bgcolor: "transparent",
//       plot_bgcolor: "transparent",
//       font: { color: "#374151", family: "Inter" },
//     };
//   }, [selectedFig]);

//   // Memoized error component
//   const errorComponent = useMemo(() => {
//     if (!error) return null;

//     return (
//       <div className="flex flex-col items-center justify-center min-h-[600px] bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-red-200 dark:border-red-800">
//         <div className="text-red-500 text-4xl mb-4">⚠️</div>
//         <p className="text-red-600 dark:text-red-400 font-medium text-lg mb-2">Error Loading Chart</p>
//         <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
//         <button
//           onClick={() => {
//             setError(null);
//             setPayload(null);
//           }}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }, [error]);

//   // Memoized loading component
//   const loadingComponent = useMemo(() => {
//     if (!loading && payload) return null;

//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           CMDA...
//         </p>
//       </div>
//     );
//   }, [loading, payload]);

//   // Memoized header section
//   const headerSection = useMemo(() => (
//     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         {/* Mode Selector */}
//         <div className="flex items-center gap-3">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             Chart Type:
//           </label>
//           <select
//             value={mode}
//             onChange={(e) => setMode(e.target.value)}
//             className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//           >
//             <option value="OC">Open-Close (OC)</option>
//             <option value="HL">High-Low (HL)</option>
//           </select>
//         </div>

//         {/* Period Selector */}
//         <div className="flex items-center gap-3">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             Period:
//           </label>
//           <select
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//             className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//           >
//             <option value="TTM">TTM</option>
//             <option value="1W">Last 1W</option>
//             <option value="1M">Last 1M</option>
//             <option value="3M">Last 3M</option>
//             <option value="6M">Last 6M</option>
//           </select>
//         </div>

//         {/* Reusable Rating Component */}
//         <RatingSystem
//           plotType="candle_chronicle"
//           onRatingUpdate={handleRatingUpdate}
//         />
//       </div>
//     </div>
//   ), [mode, period]);

//   // Memoized chart section
//   const chartSection = useMemo(() => {
//     if (!selectedFig || !plotLayout) return null;

//     return (
//       <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">

//         {/* <Plot
//           data={selectedFig.data}
//           layout={plotLayout}
//           config={{
//             displaylogo: false,
//             responsive: true,
//           }}
//           useResizeHandler={true}
//           style={{ width: "100%", minHeight: "800px" }}
//         /> */}
//         <Plot
//           data={selectedFig.data}
//           layout={{
//             ...plotLayout,
//             autosize: true,
//             height: null, // Let Plotly handle height responsively
//           }}
//           config={{
//             displaylogo: false,
//             responsive: true,
//             displayModeBar: true,
//             modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
//           }}
//           useResizeHandler={true}
//           style={{
//             width: "100%",
//             height: "100%",
//             minHeight: "60vh" // Uses viewport height for better responsiveness
//           }}
//         />


//         {/* Comment Section */}
//         <div className="mt-4 min-h-[20px] p-3 rounded-lg border text-sm leading-relaxed bg-amber-50 border-amber-200 text-amber-800 whitespace-pre-line dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200">
//           {currentComment}
//         </div>


//       </div>
//     );
//   }, [selectedFig, plotLayout, currentComment]);

//   // Early returns for error and loading states
//   if (errorComponent) return errorComponent;
//   if (loadingComponent) return loadingComponent;

//   return (
//     <div className="relative mb-6">
//       {headerSection}
//       {chartSection}
//     </div>
//   );
// };

// export default CandleSpread;


import React, { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";
import RatingSystem from "../RatingFile/RatingSystem";

const CandleSpread = ({ symbol }) => {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("OC");
  const [period, setPeriod] = useState("TTM");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_URL;

  const handleRatingUpdate = (newRating) => {
    console.log("Candle Chronicle rating updated:", newRating);
  };

  // Memoized processFigure function
  const processFigure = useMemo(() => {
    return (figure) => {
      if (!figure?.data) return figure;

      const processedFigure = { ...figure };
      processedFigure.data = figure.data.map((trace) => {
        if (trace.x?.bdata) {
          try {
            const decoded = atob(trace.x.bdata);
            const array = new Float64Array(
              new Uint8Array(decoded.split("").map((c) => c.charCodeAt(0))).buffer
            );
            return { ...trace, x: Array.from(array) };
          } catch (e) {
            console.error("Base64 decode error:", e);
            return trace;
          }
        }
        return trace;
      });
      return processedFigure;
    };
  }, []);

  // Memoized request body
  const requestBody = useMemo(() => {
    if (!symbol) return null;

    return {
      symbol: symbol.toLowerCase(),
      companyName: symbol,
      fig_type: mode,
      period: period,
    };
  }, [symbol, mode, period]);

  // Memoized API URL
  const apiUrl = useMemo(() => {
    return `${API_BASE}/stocks/test/candle_chronicle`;
  }, [API_BASE]);

  // Fetch plot data
  useEffect(() => {
    if (!requestBody) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setPayload(null);

      console.log("Fetching plot →", requestBody);

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        console.log("Plot response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (!data || data.status !== "success") {
          throw new Error(data?.message || "Failed to fetch data");
        }

        setPayload(data.data);
      } catch (err) {
        console.error("Plot error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestBody, apiUrl]);

  // Memoized processed figure
  const selectedFig = useMemo(() => {
    if (!payload?.figure) return null;
    return processFigure(payload.figure);
  }, [payload, processFigure]);

  // Memoized comment
  const currentComment = useMemo(() => {
    return payload?.comment || "No comments available.";
  }, [payload?.comment]);

  // Memoized plot layout configuration with responsive settings
  const plotLayout = useMemo(() => {
    if (!selectedFig?.layout) return null;

    return {
      ...selectedFig.layout,
      autosize: true,
      margin: { t: 30, l: 50, r: 30, b: 50, pad: 4 },
      height: null, // Let Plotly handle height
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: "#374151", family: "Inter", size: 12 },
      xaxis: {
        ...selectedFig.layout.xaxis,
        tickfont: { size: 10 }
      },
      yaxis: {
        ...selectedFig.layout.yaxis,
        tickfont: { size: 10 }
      }
    };
  }, [selectedFig]);

  // Error component
  const errorComponent = useMemo(() => {
    if (!error) return null;

    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white dark:bg-gray-900 p-4 rounded-xl border border-red-200 dark:border-red-800">
        <div className="text-red-500 text-3xl mb-3">⚠️</div>
        <p className="text-red-600 dark:text-red-400 font-medium text-base mb-2 text-center">
          Error Loading Chart
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-center text-sm mb-4 max-w-md">
          {error}
        </p>
        <button
          onClick={() => {
            setError(null);
            setPayload(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }, [error]);

  // Loading component
  const loadingComponent = useMemo(() => {
    if (!loading && payload) return null;

    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }, [loading, payload]);

  // Header section with compact controls
  const headerSection = useMemo(() => (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-3">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {/* Left controls - Chart type and period */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Chart Type */}
          <div className="flex items-center ">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Chart Type:
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="OC">Open-Close</option>
              <option value="HL">High-Low</option>
            </select>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Period:
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="TTM">TTM</option>
              <option value="1W">1W</option>
              <option value="1M">1M</option>
              <option value="3M">3M</option>
              <option value="6M">6M</option>
            </select>
          </div>
        </div>

        {/* Rating System - Right aligned */}
        <div className="w-full sm:w-auto">
          <RatingSystem
            plotType="candle_chronicle"
            onRatingUpdate={handleRatingUpdate}
            compact={true}
          />
        </div>
      </div>
    </div>
  ), [mode, period]);

  // Chart section with responsive height
  const chartSection = useMemo(() => {
    if (!selectedFig || !plotLayout) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex flex-col h-full">
        {/* Plot Container with responsive height */}
        <div className="flex-1 min-h-[50vh] max-h-[65vh]">
          <Plot
            data={selectedFig.data}
            layout={plotLayout}
            config={{
              displaylogo: false,
              responsive: true,
              displayModeBar: false, // This completely hides the toolbar
              scrollZoom: false,
              doubleClick: false,
              showTips: false,
              staticPlot: true // This removes all interactive elements
            }}
            useResizeHandler={true}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "400px"
            }}
          />
        </div>

        {/* Comment Section - Auto height */}
        <div className="mt-3 p-3 rounded-lg border text-sm leading-relaxed bg-amber-50 border-amber-200 text-amber-800 whitespace-pre-line dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200">
          {currentComment}
        </div>
      </div>
    );
  }, [selectedFig, plotLayout, currentComment]);

  // Main container with responsive height
  return (
    <div className="relative w-full h-full flex flex-col">
      {errorComponent || loadingComponent ? (
        <div className="flex-1 flex items-center justify-center">
          {errorComponent || loadingComponent}
        </div>
      ) : (
        <>
          {headerSection}
          <div className="flex-1 flex flex-col min-h-0"> {/* min-h-0 allows flex shrinking */}
            {chartSection}
          </div>
        </>
      )}
    </div>
  );
};

export default CandleSpread;