// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { HashLoader } from "react-spinners";

// const CandlePatternRating = ({plotType}) => {
//  const [rating, setRating] = useState(null);
//     const [userRating, setUserRating] = useState(null);
//     const [averageRating, setAverageRating] = useState(null);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isFetchingRating, setIsFetchingRating] = useState(true);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [hasFetchError, setHasFetchError] = useState(false);
//  const validPlotTypes = [
//         "candle_patterns"
//     ];
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}`;
//     const RATING_CACHE_KEY = `candle-patterns_rating_cache_candle-patterns`;

//     // Validate plotType
//     useEffect(() => {
//         if (!validPlotTypes.includes(plotType)) {
//             console.error(`Invalid plotType: candle_patterns. Must be one of ${validPlotTypes.join(", ")}`);
//             setHasFetchError(true);
//             setIsFetchingRating(false);
//             return;
//         }
//         setHasFetchError(false);
//         console.log("PlotType validated:", plotType);
//     }, [plotType]);

//     // Check authentication status
//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         setIsAuthenticated(!!token);
//         console.log("Authentication status:", !!token);
//     }, []);

//     // Load cached rating
//     useEffect(() => {
//         if (hasFetchError) return;
//         const cached = localStorage.getItem(RATING_CACHE_KEY);
//         if (cached) {
//             try {
//                 const parsed = parseInt(cached);
//                 if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
//                     setRating(parsed);
//                     setUserRating(parsed);
//                     setIsSubmitted(true);
//                     console.log("Loaded cached rating:", parsed);
//                 } else {
//                     console.warn("Invalid cached rating:", cached);
//                     localStorage.removeItem(RATING_CACHE_KEY);
//                 }
//             } catch (error) {
//                 console.error("Error parsing cached rating:", error);
//                 localStorage.removeItem(RATING_CACHE_KEY);
//             }
//         }
//     }, [RATING_CACHE_KEY, hasFetchError]);

//     // Fetch ratings from API
//     const fetchRatings = useCallback(async () => {
//         if (hasFetchError || !validPlotTypes.includes(plotType)) return;

//         setIsFetchingRating(true);
//         const token = localStorage.getItem("authToken");

//         // Timeout to prevent infinite loading
//         const timeout = setTimeout(() => {
//             setHasFetchError(true);
//             setIsFetchingRating(false);
//             toast.error("Rating fetch timed out. Please try again.");
//         }, 10000);

//         try {
//             // Fetch user rating if authenticated
//             if (token) {
//                 const userResponse = await fetch(`${API_BASE}/candle-patterns/ratings/candle_patterns/user`, {
//                     method: "GET",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 if (userResponse.status === 401) {
//                     localStorage.removeItem("authToken");
//                     localStorage.removeItem(RATING_CACHE_KEY);
//                     setIsAuthenticated(false);
//                     // toast.error("Session expired. Redirecting to login...");
//                     setTimeout(() => (window.location.href = "/login"), 2000);
//                     clearTimeout(timeout);
//                     return;
//                 }

//                 if (userResponse.status === 404) {
//                     setUserRating(null);
//                     setRating(null);
//                     setIsSubmitted(false);
//                     clearTimeout(timeout);
//                     return;
//                 }

//                 if (!userResponse.ok) {
//                     throw new Error(`User rating fetch failed: ${userResponse.status} ${userResponse.statusText}`);
//                 }

//                 const userText = await userResponse.text();
//                 let ratingValue;
//                 try {
//                     const userData = JSON.parse(userText);
//                     ratingValue = userData.rating || userData;
//                 } catch {
//                     ratingValue = parseInt(userText);
//                 }

//                 if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 5) {
//                     setUserRating(ratingValue);
//                     setRating(ratingValue);
//                     setIsSubmitted(true);
//                     localStorage.removeItem(RATING_CACHE_KEY);
//                     console.log("User rating response:", ratingValue);
//                 }
//             }

//             // Fetch average rating
//             const avgResponse = await fetch(`${API_BASE}/candle-patterns/ratings/candle_patterns/average`, {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (!avgResponse.ok) {
//                 throw new Error(`Average rating fetch failed: ${avgResponse.status} ${avgResponse.statusText}`);
//             }

//             const avgText = await avgResponse.text();
//             let avgValue;
//             try {
//                 const avgData = JSON.parse(avgText);
//                 avgValue = avgData.average_rating || avgData;
//             } catch {
//                 avgValue = parseFloat(avgText);
//             }

//             if (!isNaN(avgValue) && avgValue >= 1 && avgValue <= 5) {
//                 setAverageRating(avgValue);
//                 console.log("Average rating response:", avgValue);
//             }
//         } catch (error) {
//             console.error("Rating fetch error:", error.message);
//             setHasFetchError(true);
//             toast.error(`Failed to load ratings: ${error.message}`);
//         } finally {
//             clearTimeout(timeout);
//             setIsFetchingRating(false);
//         }
//     }, [plotType, hasFetchError, API_BASE, RATING_CACHE_KEY]);

//     // Fetch ratings on mount
//     useEffect(() => {
//         fetchRatings();
//     }, [fetchRatings]);

//     // Submit rating to backend
//     const submitRatingToDB = useCallback(async (newRating) => {
//         const token = localStorage.getItem("authToken");
//         if (!token || newRating < 1 || newRating > 5) return false;

//         setIsLoading(true);
//         try {
//             const response = await fetch(`${API_BASE}/candle-patterns/ratings/candle_patterns`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ rating: newRating }),
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem("authToken");
//                 localStorage.removeItem(RATING_CACHE_KEY);
//                 setIsAuthenticated(false);
//                 // toast.error("Session expired. Redirecting to login...");
//                 setTimeout(() => (window.location.href = "/login"), 2000);
//                 return false;
//             }

//             if (!response.ok) {
//                 throw new Error(`Rating submission failed: ${response.status} ${response.statusText}`);
//             }

//             await response.json();
//             localStorage.removeItem(RATING_CACHE_KEY);
//             setUserRating(newRating);
//             console.log("Rating submitted:", newRating);
//             return true;
//         } catch (error) {
//             console.error("Rating submission error:", error.message);
//             //   toast.error("Failed to submit rating. Please try again.");
//             return false;
//         } finally {
//             setIsLoading(false);
//         }
//     }, [ API_BASE, RATING_CACHE_KEY]);

//     // Handle rating selection
//     const handleRatingChange = useCallback(
//         async (value) => {
//             if (value < 1 || value > 5) return;

//             setRating(value);
//             localStorage.setItem(RATING_CACHE_KEY, value.toString());
//             setIsSubmitted(true);
//             toast.success("Awesome! Thanks for the rating! 😊");

//             if (isAuthenticated) {
//                 setTimeout(() => submitRatingToDB(value), 500);
//             }
//         },
//         [isAuthenticated, submitRatingToDB, RATING_CACHE_KEY]
//     );

//     // Handle authentication changes
//     useEffect(() => {
//         const handleStorageChange = async (e) => {
//             if (e.key === "authToken") {
//                 const token = localStorage.getItem("authToken");
//                 setIsAuthenticated(!!token);

//                 if (token) {
//                     const cached = localStorage.getItem(RATING_CACHE_KEY);
//                     if (cached) {
//                         const cachedRating = parseInt(cached);
//                         if (!isNaN(cachedRating) && cachedRating >= 1 && cachedRating <= 5) {
//                             await submitRatingToDB(cachedRating);
//                         }
//                     }
//                     fetchRatings();
//                 }
//             }
//         };

//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, [fetchRatings, submitRatingToDB, RATING_CACHE_KEY]);

//     // Star rendering utility
//     const renderStars = useMemo(
//         () => (ratingValue, size = "text-xl") => {
//             if (ratingValue === null || ratingValue === undefined) return null;
//             return (
//                 <div className={`flex ${size}`}>
//                     {[1, 2, 3, 4, 5].map((value) => (
//                         <span
//                             key={value}
//                             className={value <= ratingValue ? "text-yellow-400" : "text-gray-300"}
//                         >
//                             ★
//                         </span>
//                     ))}
//                 </div>
//             );
//         },
//         []
//     );

//     // Interactive star rating component
//     const renderInteractiveStars = useMemo(
//         () => (currentRating, size = "text-2xl") => {
//             return (
//                 <div className={`flex ${size}`}>
//                     {[1, 2, 3, 4, 5].map((value) => (
//                         <button
//                             key={value}
//                             onClick={() => handleRatingChange(value)}
//                             className={`transition-transform hover:scale-110 ${value <= currentRating ? "text-yellow-400" : "text-gray-300"
//                                 } hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50`}
//                             disabled={isLoading}
//                             aria-label={`Rate ${value} out of 5 stars`}
//                         >
//                             ★
//                         </button>
//                     ))}
//                 </div>
//             );
//         },
//         [handleRatingChange, isLoading]
//     );

//     if (isFetchingRating) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[100px] w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                 <HashLoader color="#0369a1" size={30} />
//                 <p className="mt-2 text-sky-700 dark:text-sky-300 font-medium text-xs">
//                     Loading Ratings...
//                 </p>
//             </div>
//         );
//     }

//     if (hasFetchError) {
//         return (
//             <div className="flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                 <p className="text-red-700 dark:text-red-300 text-sm">
//                     Unable to load ratings.{" "}
//                     <button
//                         onClick={() => {
//                             setHasFetchError(false);
//                             setIsFetchingRating(true);
//                             fetchRatings();
//                         }}
//                         className="underline text-blue-600 hover:text-blue-800"
//                     >
//                         Try again
//                     </button>
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
//             <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//                     Rate this chart:
//                 </span>
//                 {renderInteractiveStars(rating)}
//             </div>
//             {!isAuthenticated && (
//                 <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
//                     Please login to save your rating permanently.
//                 </div>
//             )}
//             {isSubmitted && userRating && (
//                 <div className="text-xs text-gray-600 dark:text-gray-400">
//                     Your Rating: {userRating}/5
//                 </div>
//             )}
//             {averageRating !== null && (
//                 <div className="flex flex-col gap-2 border-t pt-3">
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//                             Average Rating:
//                         </span>
//                         {renderStars(averageRating, "text-xl")}
//                     </div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400">
//                         {averageRating.toFixed(1)}/5 from all users
//                     </div>
//                 </div>
//             )}
//             {isLoading && (
//                 <div className="absolute inset-0 bg-white dark:bg-slate-900 bg-opacity-70 flex items-center justify-center rounded-lg">
//                     <HashLoader color="#0369a1" size={30} />
//                 </div>
//             )}
//         </div>
//     );
// };
// export default CandlePatternRating


// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { HashLoader } from "react-spinners";

// const CandlePatternRating = ({ plotType }) => {
//     const [rating, setRating] = useState(null);
//     const [userRating, setUserRating] = useState(null);
//     const [averageRating, setAverageRating] = useState(null);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isFetchingRating, setIsFetchingRating] = useState(true);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [hasFetchError, setHasFetchError] = useState(false);

//     const validPlotTypes = ["candle_patterns"];
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const RATING_CACHE_KEY = `candle_patterns_rating_cache`;

//     // Validate plotType
//     useEffect(() => {
//         if (!validPlotTypes.includes(plotType)) {
//             console.error(`Invalid plotType: ${plotType}. Must be one of ${validPlotTypes.join(", ")}`);
//             setHasFetchError(true);
//             setIsFetchingRating(false);
//             return;
//         }
//         setHasFetchError(false);
//     }, [plotType]);

//     // Check authentication status
//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         setIsAuthenticated(!!token);
//     }, []);

//     // Load cached rating
//     useEffect(() => {
//         if (hasFetchError) return;
//         const cached = localStorage.getItem(RATING_CACHE_KEY);
//         if (cached) {
//             try {
//                 const parsed = parseInt(cached);
//                 if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
//                     setRating(parsed);
//                     setUserRating(parsed);
//                     setIsSubmitted(true);
//                 } else {
//                     localStorage.removeItem(RATING_CACHE_KEY);
//                 }
//             } catch (error) {
//                 localStorage.removeItem(RATING_CACHE_KEY);
//             }
//         }
//     }, [RATING_CACHE_KEY, hasFetchError]);

//     // Fetch ratings from API
//     const fetchRatings = useCallback(async () => {
//         if (hasFetchError || !validPlotTypes.includes(plotType)) return;

//         setIsFetchingRating(true);
//         const token = localStorage.getItem("authToken");

//         const timeout = setTimeout(() => {
//             setHasFetchError(true);
//             setIsFetchingRating(false);
//             toast.error("Rating fetch timed out. Please try again.");
//         }, 10000);

//         try {
//             // Fetch user rating if authenticated
//             if (token) {
//                 const userResponse = await fetch(`${API_BASE}/candle-patterns/ratings/candle_patterns/user`, {
//                     method: "GET",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 if (userResponse.status === 401) {
//                     localStorage.removeItem("authToken");
//                     localStorage.removeItem(RATING_CACHE_KEY);
//                     setIsAuthenticated(false);
//                     clearTimeout(timeout);
//                     return;
//                 }

//                 if (userResponse.status === 404) {
//                     setUserRating(null);
//                     setRating(null);
//                     setIsSubmitted(false);
//                     clearTimeout(timeout);
//                     return;
//                 }

//                 if (!userResponse.ok) {
//                     throw new Error(`User rating fetch failed: ${userResponse.status}`);
//                 }

//                 const userData = await userResponse.json();
//                 const ratingValue = userData.rating;

//                 if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 5) {
//                     setUserRating(ratingValue);
//                     setRating(ratingValue);
//                     setIsSubmitted(true);
//                     localStorage.removeItem(RATING_CACHE_KEY);
//                 }
//             }

//             // Fetch average rating
//             const avgResponse = await fetch(`${API_BASE}/candle-patterns/ratings/candle_patterns/average`, {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (!avgResponse.ok) {
//                 throw new Error(`Average rating fetch failed: ${avgResponse.status}`);
//             }

//             const avgData = await avgResponse.json();
//             const avgValue = avgData.average_rating;

//             if (!isNaN(avgValue) && avgValue >= 0 && avgValue <= 5) {
//                 setAverageRating(avgValue);
//             } else {
//                 setAverageRating(0);
//             }
//         } catch (error) {
//             console.error("Rating fetch error:", error.message);
//             setHasFetchError(true);
//         } finally {
//             clearTimeout(timeout);
//             setIsFetchingRating(false);
//         }
//     }, [plotType, hasFetchError, API_BASE]);

//     // Fetch ratings on mount
//     useEffect(() => {
//         fetchRatings();
//     }, [fetchRatings]);

//     // Submit rating to backend
//     const submitRatingToDB = useCallback(async (newRating) => {
//         const token = localStorage.getItem("authToken");
//         if (!token || newRating < 1 || newRating > 5) return false;

//         setIsLoading(true);
//         try {
//             const response = await fetch(`${API_BASE}/candle-patterns/ratings/candle_patterns`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ rating: newRating }),
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem("authToken");
//                 localStorage.removeItem(RATING_CACHE_KEY);
//                 setIsAuthenticated(false);
//                 return false;
//             }

//             if (!response.ok) {
//                 throw new Error(`Rating submission failed: ${response.status}`);
//             }

//             await response.json();
//             localStorage.removeItem(RATING_CACHE_KEY);
//             setUserRating(newRating);
//             return true;
//         } catch (error) {
//             console.error("Rating submission error:", error.message);
//             return false;
//         } finally {
//             setIsLoading(false);
//         }
//     }, [API_BASE]);

//     // Handle rating selection
//     const handleRatingChange = useCallback(
//         async (value) => {
//             if (value < 1 || value > 5) return;

//             setRating(value);
//             localStorage.setItem(RATING_CACHE_KEY, value.toString());
//             setIsSubmitted(true);
//             toast.success("Awesome! Thanks for the rating! 😊");

//             if (isAuthenticated) {
//                 const success = await submitRatingToDB(value);
//                 if (!success) {
//                     toast.error("Failed to save rating. Please try again.");
//                 }
//             }
//         },
//         [isAuthenticated, submitRatingToDB, RATING_CACHE_KEY]
//     );

//     // Handle authentication changes
//     useEffect(() => {
//         const handleStorageChange = (e) => {
//             if (e.key === "authToken") {
//                 const token = localStorage.getItem("authToken");
//                 setIsAuthenticated(!!token);
//                 if (token) {
//                     fetchRatings();
//                 }
//             }
//         };

//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, [fetchRatings]);

//     // Star rendering utility
//     const renderStars = useMemo(
//         () => (ratingValue, size = "text-xl") => {
//             if (ratingValue === null || ratingValue === undefined) return null;
//             return (
//                 <div className={`flex ${size}`}>
//                     {[1, 2, 3, 4, 5].map((value) => (
//                         <span
//                             key={value}
//                             className={value <= ratingValue ? "text-yellow-400" : "text-gray-300"}
//                         >
//                             ★
//                         </span>
//                     ))}
//                 </div>
//             );
//         },
//         []
//     );

//     // Interactive star rating component
//     const renderInteractiveStars = useMemo(
//         () => (currentRating, size = "text-2xl") => {
//             return (
//                 <div className={`flex ${size}`}>
//                     {[1, 2, 3, 4, 5].map((value) => (
//                         <button
//                             key={value}
//                             onClick={() => handleRatingChange(value)}
//                             className={`transition-transform hover:scale-110 ${value <= (currentRating || 0) ? "text-yellow-400" : "text-gray-300"
//                                 } hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50`}
//                             disabled={isLoading}
//                             aria-label={`Rate ${value} out of 5 stars`}
//                         >
//                             ★
//                         </button>
//                     ))}
//                 </div>
//             );
//         },
//         [handleRatingChange, isLoading]
//     );

//     if (isFetchingRating) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[100px] w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                 <HashLoader color="#0369a1" size={30} />
//                 <p className="mt-2 text-sky-700 dark:text-sky-300 font-medium text-xs">
//                     Loading Ratings...
//                 </p>
//             </div>
//         );
//     }

//     if (hasFetchError) {
//         return (
//             <div className="flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                 <p className="text-red-700 dark:text-red-300 text-sm">
//                     Unable to load ratings.{" "}
//                     <button
//                         onClick={() => {
//                             setHasFetchError(false);
//                             setIsFetchingRating(true);
//                             fetchRatings();
//                         }}
//                         className="underline text-blue-600 hover:text-blue-800"
//                     >
//                         Try again
//                     </button>
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 relative">
//             <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//                     Rate this chart:
//                 </span>
//                 {renderInteractiveStars(rating)}
//             </div>

//             {!isAuthenticated && (
//                 <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
//                     Please login to save your rating permanently.
//                 </div>
//             )}

//             {isSubmitted && userRating && (
//                 <div className="text-xs text-gray-600 dark:text-gray-400">
//                     Your Rating: {userRating}/5
//                 </div>
//             )}

//             {averageRating !== null && averageRating > 0 && (
//                 <div className="flex flex-col gap-2 border-t pt-3">
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//                             Average Rating:
//                         </span>
//                         {renderStars(averageRating, "text-xl")}
//                     </div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400">
//                         {averageRating.toFixed(1)}/5 from all users
//                     </div>
//                 </div>
//             )}

//             {isLoading && (
//                 <div className="absolute inset-0 bg-white dark:bg-slate-900 bg-opacity-70 flex items-center justify-center rounded-lg">
//                     <HashLoader color="#0369a1" size={30} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CandlePatternRating;









import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashLoader } from "react-spinners";

const CandlePatternRating = ({ plotType }) => {
    const [rating, setRating] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [averageRating, setAverageRating] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingRating, setIsFetchingRating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasFetchError, setHasFetchError] = useState(false);

    const validPlotTypes = ["candle_patterns"];
    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
    const RATING_CACHE_KEY = `candle_patterns_rating_cache`;
    const PENDING_RATINGS_KEY = `candle_patterns_pending_ratings`;

    // Validate plotType
    useEffect(() => {
        if (!validPlotTypes.includes(plotType)) {
            console.error(`Invalid plotType: ${plotType}. Must be one of ${validPlotTypes.join(", ")}`);
            setHasFetchError(true);
            setIsFetchingRating(false);
            return;
        }
        setHasFetchError(false);
    }, [plotType]);

    // Check authentication status
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
    }, []);

    // Load cached rating and pending ratings
    useEffect(() => {
        if (hasFetchError) return;

        // Load current cached rating
        const cached = localStorage.getItem(RATING_CACHE_KEY);
        if (cached) {
            try {
                const parsed = parseInt(cached);
                if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
                    setRating(parsed);
                    setUserRating(parsed);
                    setIsSubmitted(true);
                } else {
                    localStorage.removeItem(RATING_CACHE_KEY);
                }
            } catch (error) {
                localStorage.removeItem(RATING_CACHE_KEY);
            }
        }

        // Load pending ratings (for sync on logout)
        const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
        if (pendingRatings) {
            try {
                const parsed = JSON.parse(pendingRatings);
                // We don't set state for pending ratings, just keep them in storage
            } catch (error) {
                localStorage.removeItem(PENDING_RATINGS_KEY);
            }
        }
    }, [RATING_CACHE_KEY, PENDING_RATINGS_KEY, hasFetchError]);

    // Fetch ratings from API
    const fetchRatings = useCallback(async () => {
        if (hasFetchError || !validPlotTypes.includes(plotType)) return;

        setIsFetchingRating(true);
        const token = localStorage.getItem("authToken");

        const timeout = setTimeout(() => {
            setHasFetchError(true);
            setIsFetchingRating(false);
            toast.error("Rating fetch timed out. Please try again.");
        }, 10000);

        try {
            // Fetch user rating if authenticated
            if (token) {
                const userResponse = await fetch(`${API_BASE}/candle-patterns/ratings/candle_patterns/user`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (userResponse.status === 401) {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem(RATING_CACHE_KEY);
                    setIsAuthenticated(false);
                    clearTimeout(timeout);
                    return;
                }

                if (userResponse.status === 404) {
                    setUserRating(null);
                    setRating(null);
                    setIsSubmitted(false);
                    clearTimeout(timeout);
                    return;
                }

                if (!userResponse.ok) {
                    throw new Error(`User rating fetch failed: ${userResponse.status}`);
                }

                const userData = await userResponse.json();
                const ratingValue = userData.rating;

                if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 5) {
                    setUserRating(ratingValue);
                    setRating(ratingValue);
                    setIsSubmitted(true);
                    localStorage.removeItem(RATING_CACHE_KEY);
                }
            }

            // Fetch average rating
            const avgResponse = await fetch(`${API_BASE}/candle-patterns/ratings/candle_patterns/average`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!avgResponse.ok) {
                throw new Error(`Average rating fetch failed: ${avgResponse.status}`);
            }

            const avgData = await avgResponse.json();
            const avgValue = avgData.average_rating;

            if (!isNaN(avgValue) && avgValue >= 0 && avgValue <= 5) {
                setAverageRating(avgValue);
            } else {
                setAverageRating(0);
            }
        } catch (error) {
            console.error("Rating fetch error:", error.message);
            setHasFetchError(true);
        } finally {
            clearTimeout(timeout);
            setIsFetchingRating(false);
        }
    }, [plotType, hasFetchError, API_BASE]);

    // Submit ALL pending ratings to backend (called on logout)
    const submitPendingRatingsToDB = useCallback(async () => {
        const token = localStorage.getItem("authToken");
        const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);

        if (!token || !pendingRatings) return false;

        setIsLoading(true);
        try {
            const ratings = JSON.parse(pendingRatings);

            // Submit the most recent rating
            const mostRecentRating = ratings[ratings.length - 1];

            const response = await fetch(`${API_BASE}/candle-patterns/ratings/candle_patterns`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rating: mostRecentRating }),
            });

            if (response.status === 401) {
                localStorage.removeItem("authToken");
                setIsAuthenticated(false);
                return false;
            }

            if (!response.ok) {
                throw new Error(`Rating submission failed: ${response.status}`);
            }

            await response.json();

            // Clear pending ratings after successful submission
            localStorage.removeItem(PENDING_RATINGS_KEY);
            setUserRating(mostRecentRating);

            return true;
        } catch (error) {
            console.error("Pending ratings submission error:", error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE]);

    // Handle rating selection - PURE CACHE FIRST
    const handleRatingChange = useCallback(
        async (value) => {
            if (value < 1 || value > 5) return;

            // 1. Immediately update UI state
            setRating(value);
            setIsSubmitted(true);

            // 2. Always save to cache first
            localStorage.setItem(RATING_CACHE_KEY, value.toString());

            // 3. Store in pending ratings (for sync on logout)
            const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
            let ratingsArray = [];

            if (pendingRatings) {
                try {
                    ratingsArray = JSON.parse(pendingRatings);
                } catch (error) {
                    ratingsArray = [];
                }
            }

            ratingsArray.push(value);
            localStorage.setItem(PENDING_RATINGS_KEY, JSON.stringify(ratingsArray));

            toast.success("Your feedback has been captured.");

            // 4. DO NOT hit the database here - wait for logout
        },
        [RATING_CACHE_KEY, PENDING_RATINGS_KEY]
    );

    // Handle authentication changes - SYNC ON LOGOUT
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "authToken") {
                const token = localStorage.getItem("authToken");
                const wasAuthenticated = isAuthenticated;
                setIsAuthenticated(!!token);

                if (!token && wasAuthenticated) {
                    // User logged out - SYNC PENDING RATINGS TO DATABASE
                    const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
                    if (pendingRatings) {
                        // Re-authenticate temporarily to submit ratings
                        const authToken = localStorage.getItem("authToken");
                        if (!authToken) {
                            console.log("User logged out, but we have pending ratings to sync");
                            // Here you might want to show a message or queue for next login
                            toast("Ratings will be synced when you next login", { icon: "💾" });
                        }
                    }
                } else if (token && !wasAuthenticated) {
                    // User logged in - fetch ratings and sync any pending ratings
                    fetchRatings();

                    // Sync pending ratings on login (if any)
                    const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
                    if (pendingRatings) {
                        submitPendingRatingsToDB();
                    }
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [isAuthenticated, fetchRatings, submitPendingRatingsToDB]);

    // Sync pending ratings when component unmounts or user logs out
    useEffect(() => {
        return () => {
            // This runs when component unmounts - sync if user is authenticated
            if (isAuthenticated) {
                const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
                if (pendingRatings) {
                    submitPendingRatingsToDB();
                }
            }
        };
    }, [isAuthenticated, submitPendingRatingsToDB]);

    // Fetch ratings on mount
    useEffect(() => {
        fetchRatings();
    }, [fetchRatings]);

    // Star rendering utility
    const renderStars = useMemo(
        () => (ratingValue, size = "text-xl") => {
            if (ratingValue === null || ratingValue === undefined) return null;
            return (
                <div className={`flex ${size}`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                        <span
                            key={value}
                            className={value <= ratingValue ? "text-yellow-400" : "text-gray-300"}
                        >
                            ★
                        </span>
                    ))}
                </div>
            );
        },
        []
    );

    // Interactive star rating component
    const renderInteractiveStars = useMemo(
        () => (currentRating, size = "text-2xl") => {
            return (
                <div className={`flex ${size}`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            onClick={() => handleRatingChange(value)}
                            className={`transition-transform hover:scale-110 ${value <= (currentRating || 0) ? "text-yellow-400" : "text-gray-300"
                                } hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50`}
                            disabled={isLoading}
                            aria-label={`Rate ${value} out of 5 stars`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            );
        },
        [handleRatingChange, isLoading]
    );

    if (isFetchingRating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[100px] w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <HashLoader color="#0369a1" size={30} />
                <p className="mt-2 text-sky-700 dark:text-sky-300 font-medium text-xs">
                    Loading Ratings...
                </p>
            </div>
        );
    }

    if (hasFetchError) {
        return (
            <div className="flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                    Unable to load ratings.{" "}
                    <button
                        onClick={() => {
                            setHasFetchError(false);
                            setIsFetchingRating(true);
                            fetchRatings();
                        }}
                        className="underline text-blue-600 hover:text-blue-800"
                    >
                        Try again
                    </button>
                </p>
            </div>
        );
    }

    const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
    const hasPendingSync = !!pendingRatings;

    // return (
    //     <div className="flex flex-col gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 relative">
    //         <div className="flex items-center gap-2">
    //             <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
    //                 Rate this chart:
    //             </span>
    //             {renderInteractiveStars(rating)}
    //         </div>

    //         {!isAuthenticated && (
    //             <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
    //                 {hasPendingSync
    //                     ? "Rating saved temporarily. Log in to preserve it."
    //                     : "Please login to save your rating permanently."}
    //             </div>
    //         )}

    //         {isSubmitted && rating && (
    //             <div className="text-xs text-gray-600 dark:text-gray-400">
    //                 Your Rating: {rating}/5
    //                 {hasPendingSync && !isAuthenticated && " (Saved locally)"}
    //                 {hasPendingSync && isAuthenticated && " (Updating...)"}
    //             </div>
    //         )}

    //         {averageRating !== null && averageRating > 0 && (
    //             <div className="flex flex-col gap-2 border-t pt-3">
    //                 <div className="flex items-center gap-2">
    //                     <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
    //                         Average Rating:
    //                     </span>
    //                     {renderStars(averageRating, "text-xl")}
    //                 </div>
    //                 <div className="text-xs text-gray-600 dark:text-gray-400">
    //                     {averageRating.toFixed(1)}/5 from all users
    //                 </div>
    //             </div>
    //         )}

    //         {isLoading && (
    //             <div className="absolute inset-0 bg-white dark:bg-slate-900 bg-opacity-70 flex items-center justify-center rounded-lg">
    //                 <HashLoader color="#0369a1" size={30} />
    //             </div>
    //         )}
    //     </div>
    // );
    return (
        // <div className="flex flex-col gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
        //     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        //         <div className="flex items-center gap-3">
        //             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rate this chart:</span>
        //             <div className="flex items-center gap-1">
        //                 {renderStars(rating, "text-base", true, handleRatingChange)}
        //                 {rating > 0 && (
        //                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
        //                         {rating}/5
        //                     </span>
        //                 )}
        //             </div>
        //         </div>

        //         {averageRating !== null && averageRating > 0 && (
        //             <div className="flex items-center gap-2">
        //                 <span className="text-xs text-gray-600 dark:text-gray-400">Average:</span>
        //                 <div className="flex items-center gap-1">
        //                     {renderStars(averageRating, "text-sm")}
        //                     <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
        //                         {averageRating.toFixed(1)}
        //                     </span>
        //                 </div>
        //             </div>
        //         )}
        //     </div>

        //     {/* Status Messages */}
        //     {!isAuthenticated && rating > 0 && (
        //         <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
        //             Log in to back up your data
        //         </div>
        //     )}

        //     {/* {hasPendingSync && isAuthenticated && (
        //         <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
        //             Your rating has been saved.
        //         </div>
        //     )} */}

        //     {!isAuthenticated && !rating && (
        //         <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
        //             How helpful was this analysis? Click to rate.
        //         </div>
        //     )}

        //     {isSubmitted && rating && (
        //         <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
        //             Your Rating: {rating}/5
        //             {hasPendingSync && !isAuthenticated && " (Saved successfully!)"}
        //             {hasPendingSync && isAuthenticated && " (Updating...)"}
        //         </div>
        //     )}

        //     {averageRating !== null && averageRating > 0 && (
        //         <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
        //             {averageRating.toFixed(1)}/5 from all users
        //         </div>
        //     )}

        //     {isLoading && (
        //         <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        //             <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg flex items-center gap-2">
        //                 <HashLoader color="#3B82F6" size={16} />
        //                 <span className="text-sm text-gray-700 dark:text-gray-300">Updating</span>
        //             </div>
        //         </div>
        //     )}
        // </div>
        <div className="flex flex-col gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* User Rating Section */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rate this chart:
                    </span>
                    <div className="flex items-center gap-1">
                        {renderInteractiveStars(rating)}
                        {rating > 0 && (
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
                                {rating}/5
                            </span>
                        )}
                    </div>
                </div>

                {/* Average Rating Section */}
                {averageRating !== null && averageRating > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Average:</span>
                        <div className="flex items-center gap-1">
                            {renderStars(averageRating, "text-sm")}
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                {averageRating.toFixed(1)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Messages */}
            {!isAuthenticated && rating > 0 && (
                <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                    {hasPendingSync
                        ? "Rating saved temporarily. Log in to preserve it."
                        : "Log in to back up your data"}
                </div>
            )}

            {!isAuthenticated && !rating && (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    How helpful was this analysis? Click to rate.
                </div>
            )}

            {isSubmitted && rating && (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    Your Rating: {rating}/5
                    {hasPendingSync && !isAuthenticated && " (Saved successfully!)"}
                    {hasPendingSync && isAuthenticated && " (Updating...)"}
                </div>
            )}

            {averageRating !== null && averageRating > 0 && (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    {averageRating.toFixed(1)}/5 from all users
                </div>
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg flex items-center gap-2">
                        <HashLoader color="#3B82F6" size={16} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Updating
                        </span>
                    </div>
                </div>
            )}
        </div>

    );
};


export default CandlePatternRating;