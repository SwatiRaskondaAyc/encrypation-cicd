// import React, { useState, useEffect, useCallback, useMemo } from "react";

// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { HashLoader } from "react-spinners";

// const FinancialRatingSystem = ({ plotType, onRatingUpdate }) => {
//     const [rating, setRating] = useState(null);
//     const [userRating, setUserRating] = useState(null);
//     const [averageRating, setAverageRating] = useState(null);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isFetchingRating, setIsFetchingRating] = useState(true);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [hasFetchError, setHasFetchError] = useState(false);

//     const validPlotTypes = ["financial_overview", "balance_sheet", "income_statement", "cash_flow_statement", "financial_ratios"];
//     const API_BASE = import.meta.env.VITE_URL;
//     const RATING_CACHE_KEY = `financial_rating_cache_${plotType}`;

//     // Validate plotType on mount and when plotType changes
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

//     // Load cached rating on mount
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

//         try {
//             // Fetch user rating if authenticated
//             if (token) {
//                 try {
//                     const userResponse = await fetch(`${API_BASE}/financial/ratings/${plotType}/user`, {
//                         method: "GET",
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             "Content-Type": "application/json"
//                         },
//                     });

//                     if (userResponse.status === 401) {
//                         localStorage.removeItem("authToken");
//                         localStorage.removeItem(RATING_CACHE_KEY);
//                         setIsAuthenticated(false);
//                         throw new Error("Authentication failed");
//                     }

//                     if (userResponse.ok) {
//                         const userData = await userResponse.json();
//                         const ratingValue = userData.rating || userData;
//                         const numericRating = typeof ratingValue === 'number' ? ratingValue : parseInt(ratingValue);

//                         if (!isNaN(numericRating) && numericRating >= 1 && numericRating <= 5) {
//                             setUserRating(numericRating);
//                             setRating(numericRating);
//                             setIsSubmitted(true);
//                             localStorage.removeItem(RATING_CACHE_KEY);
//                         }
//                     }
//                 } catch (error) {
//                     console.warn("Failed to fetch user rating:", error);
//                 }
//             }

//             // Fetch average rating
//             try {
//                 const avgResponse = await fetch(`${API_BASE}/financial/ratings/${plotType}/average`, {
//                     method: "GET",
//                     headers: { "Content-Type": "application/json" },
//                 });

//                 if (avgResponse.ok) {
//                     const avgData = await avgResponse.json();
//                     const avgValue = avgData.average_rating || avgData;
//                     const numericAvg = typeof avgValue === 'number' ? avgValue : parseFloat(avgValue);

//                     if (!isNaN(numericAvg) && numericAvg >= 1 && numericAvg <= 5) {
//                         setAverageRating(numericAvg);
//                     }
//                 }
//             } catch (error) {
//                 console.warn("Failed to fetch average rating:", error);
//             }

//         } catch (error) {
//             console.error("Rating fetch error:", error);
//             setHasFetchError(true);
//         } finally {
//             setIsFetchingRating(false);
//         }
//     }, [plotType, hasFetchError, API_BASE]);

//     // Fetch ratings when component mounts or dependencies change
//     useEffect(() => {
//         fetchRatings();
//     }, [fetchRatings]);

//     // Submit rating to backend
//     const submitRatingToDB = useCallback(async (newRating) => {
//         const token = localStorage.getItem("authToken");
//         if (!token || newRating < 1 || newRating > 5) return false;

//         setIsLoading(true);
//         try {
//             const response = await fetch(`${API_BASE}/financial/ratings/${plotType}`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ rating: newRating }),
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem("authToken");
//                 localStorage.removeItem(RATING_CACHE_KEY);
//                 setIsAuthenticated(false);
//                 toast.error("Session expired. Please login again.");
//                 return false;
//             }

//             if (!response.ok) {
//                 throw new Error(`HTTP ${response.status}`);
//             }

//             await response.json();
//             localStorage.removeItem(RATING_CACHE_KEY);
//             setUserRating(newRating);
//             onRatingUpdate?.(newRating);
//             return true;
//         } catch (error) {
//             console.error("Rating submission error:", error);
//             toast.error("Failed to submit rating. Please try again.");
//             return false;
//         } finally {
//             setIsLoading(false);
//         }
//     }, [plotType, onRatingUpdate, API_BASE]);

//     // Handle rating selection
//     const handleRatingChange = useCallback(async (value) => {
//         if (value < 1 || value > 5) return;

//         setRating(value);
//         localStorage.setItem(RATING_CACHE_KEY, value.toString());
//         setIsSubmitted(true);

//         // Show immediate feedback
//         toast.success("Awesome! Thanks for the rating! 😊");

//         // Submit to backend (fire and forget)
//         if (isAuthenticated) {
//             submitRatingToDB(value);
//         }

//         onRatingUpdate?.(value);
//     }, [isAuthenticated, submitRatingToDB, onRatingUpdate]);

//     // Handle authentication changes
//     useEffect(() => {
//         const handleStorageChange = (e) => {
//             if (e.key === "authToken") {
//                 const token = localStorage.getItem("authToken");
//                 setIsAuthenticated(!!token);

//                 // If user just logged in and has cached rating, submit it
//                 if (token) {
//                     const cached = localStorage.getItem(RATING_CACHE_KEY);
//                     if (cached) {
//                         const cachedRating = parseInt(cached);
//                         if (!isNaN(cachedRating) && cachedRating >= 1 && cachedRating <= 5) {
//                             submitRatingToDB(cachedRating);
//                         }
//                     }
//                     // Refresh ratings data
//                     fetchRatings();
//                 }
//             }
//         };

//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, [submitRatingToDB, fetchRatings]);

//     // Star rendering utility
//     const renderStars = useCallback((ratingValue, size = "text-xl", interactive = false, onStarClick = null) => {
//         if (ratingValue === null || ratingValue === undefined) return null;

//         const fullStars = Math.floor(ratingValue);
//         const hasHalfStar = ratingValue % 1 >= 0.5;
//         const stars = [];

//         for (let i = 1; i <= 5; i++) {
//             let starComponent;

//             if (i <= fullStars) {
//                 starComponent = <FaStar key={i} className="text-yellow-400" />;
//             } else if (i === fullStars + 1 && hasHalfStar) {
//                 starComponent = <FaStarHalfAlt key={i} className="text-yellow-400" />;
//             } else {
//                 starComponent = <FaRegStar key={i} className="text-gray-300" />;
//             }

//             if (interactive && onStarClick) {
//                 stars.push(
//                     <button
//                         key={i}
//                         onClick={() => onStarClick(i)}
//                         className={`transition-all duration-200 hover:scale-110 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 ${size === "text-2xl" ? "p-1" : "p-0.5"
//                             }`}
//                         disabled={isLoading}
//                         aria-label={`Rate ${i} out of 5 stars`}
//                     >
//                         {starComponent}
//                     </button>
//                 );
//             } else {
//                 stars.push(
//                     <span key={i} className={size === "text-2xl" ? "p-1" : "p-0.5"}>
//                         {starComponent}
//                     </span>
//                 );
//             }
//         }

//         return (
//             <div className={`flex ${size} ${interactive ? 'cursor-pointer' : ''}`}>
//                 {stars}
//             </div>
//         );
//     }, [isLoading]);

//     // Interactive star rating component
//     const InteractiveStarRating = useMemo(() => (
//         <div className="flex flex-col gap-2">
//             <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//                     Rate this chart:
//                 </span>
//                 {renderStars(rating, "text-2xl", true, handleRatingChange)}
//             </div>
//             {isSubmitted && userRating && (
//                 <div className="text-xs text-green-600 dark:text-green-400 font-medium">
//                     Your Rating: {userRating}/5 {!isAuthenticated && "(Cached - will sync when logged in)"}
//                 </div>
//             )}
//         </div>
//     ), [rating, userRating, isSubmitted, isAuthenticated, renderStars, handleRatingChange]);

//     if (isFetchingRating) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[200px] w-full bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-blue-800">
//                 <HashLoader color="#0369a1" size={50} />
//                 <p className="mt-3 text-sky-700 dark:text-sky-300 font-medium text-sm">
//                     Loading Ratings...
//                 </p>
//             </div>
//         );
//     }

//     if (hasFetchError) {
//         return (
//             <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                 <p className="text-red-700 dark:text-red-300 text-sm">
//                     Unable to load ratings. Please try refreshing the page.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-blue-50 flex flex-row sm:flex-row sm:items-center gap-6 bg-blue-50 dark:bg-blue-900/20 ">
//             {/* User Rating Section */}
//             <div className="flex-">
//                 {isAuthenticated ? (
//                     InteractiveStarRating
//                 ) : (
//                     <div className="bg-blue-50 flex flex-col gap-2">
//                         <div className="flex items-center gap-2">
//                             <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//                                 Rate this chart:
//                             </span>
//                             {renderStars(rating, "text-2xl", true, handleRatingChange)}
//                         </div>
//                         <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
//                             Please login to save your rating permanently.
//                         </p>
//                         {isSubmitted && userRating && (
//                             <div className="text-xs text-amber-600 dark:text-amber-400">
//                                 Rating : {userRating}/5
//                             </div>
//                         )}
//                     </div>
//                 )}

//             </div>

//             {/* Average Rating Section */}
//             {averageRating !== null && (
//                 <div className="flex-2 bg-blue-50 border-t sm:border-t-0 sm:border-l border-blue-200 dark:border-blue-700 pt-4 sm:pt-0 sm:pl-6">
//                     <div className="flex flex-col gap-2">
//                         <div className="flex items-center gap-2">
//                             <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//                                 Average Rating:
//                             </span>
//                             {renderStars(averageRating, "text-xl")}
//                         </div>
//                         <div className="bg-blue-50 text-xs text-gray-600 dark:text-gray-400">
//                             {averageRating.toFixed(1)}/5 from all users
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Loading Overlay */}
//             {isLoading && (
//                 <div className="absolute inset-0 bg-white dark:bg-slate-900 bg-opacity-70 flex items-center justify-center rounded-xl">
//                     <HashLoader color="#0369a1" size={40} />
//                 </div>
//             )}

//         </div>
//     );
// };

// export default FinancialRatingSystem;


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashLoader } from "react-spinners";

const FinancialRatingSystem = ({ plotType }) => {
    const [rating, setRating] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [averageRating, setAverageRating] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingRating, setIsFetchingRating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasFetchError, setHasFetchError] = useState(false);

    const validPlotTypes = [
        "financial_overview",
        "balance_sheet",
        "income_statement",
        "cash_flow_statement",
        "financial_ratios"
    ];
    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
    const RATING_CACHE_KEY = `financial_rating_cache_${plotType}`;
    const PENDING_RATINGS_KEY = `financial_pending_ratings_${plotType}`;

    useEffect(() => {
        if (!validPlotTypes.includes(plotType)) {
            console.error(`FinancialRatingSystem: Invalid plotType: ${plotType}. Must be one of ${validPlotTypes.join(", ")}`);
            setHasFetchError(true);
            setIsFetchingRating(false);
            return;
        }
        setHasFetchError(false);
    }, [plotType]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        if (hasFetchError) return;

        // Load cached rating
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

        // Load pending ratings for sync
        const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
        if (pendingRatings) {
            try {
                JSON.parse(pendingRatings);
            } catch (error) {
                localStorage.removeItem(PENDING_RATINGS_KEY);
            }
        }
    }, [RATING_CACHE_KEY, PENDING_RATINGS_KEY, hasFetchError]);

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
            if (token) {
                try {
                    const userResponse = await fetch(`${API_BASE}/financial/ratings/${plotType}/user`, {
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
                    const ratingValue = userData.rating || userData;
                    const numericRating = typeof ratingValue === "number" ? ratingValue : parseInt(ratingValue);

                    if (!isNaN(numericRating) && numericRating >= 1 && numericRating <= 5) {
                        setUserRating(numericRating);
                        setRating(numericRating);
                        setIsSubmitted(true);
                        localStorage.removeItem(RATING_CACHE_KEY);
                        localStorage.removeItem(PENDING_RATINGS_KEY);
                    }
                } catch (error) {
                    console.warn("Failed to fetch user rating:", error);
                }
            }

            try {
                const avgResponse = await fetch(`${API_BASE}/financial/ratings/${plotType}/average`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!avgResponse.ok) {
                    setAverageRating(null);
                } else {
                    const avgData = await avgResponse.json();
                    const avgValue = avgData.average_rating || avgData;
                    const numericAvg = typeof avgValue === "number" ? avgValue : parseFloat(avgValue);

                    if (!isNaN(numericAvg) && numericAvg >= 1 && numericAvg <= 5) {
                        setAverageRating(numericAvg);
                    } else {
                        setAverageRating(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching average rating:", error.message);
                setAverageRating(null);
            }
        } catch (error) {
            console.error("Rating fetch error:", error.message);
            setHasFetchError(true);
        } finally {
            clearTimeout(timeout);
            setIsFetchingRating(false);
        }
    }, [plotType, hasFetchError, API_BASE, RATING_CACHE_KEY, PENDING_RATINGS_KEY]);

    useEffect(() => {
        fetchRatings();
    }, [fetchRatings]);

    const submitPendingRatingsToDB = useCallback(async () => {
        const token = localStorage.getItem("authToken");
        const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);

        if (!token || !pendingRatings) return false;

        setIsLoading(true);
        try {
            const ratings = JSON.parse(pendingRatings);
            const mostRecentRating = ratings[ratings.length - 1];

            const response = await fetch(`${API_BASE}/financial/ratings/${plotType}`, {
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
            localStorage.removeItem(PENDING_RATINGS_KEY);
            setUserRating(mostRecentRating);
            return true;
        } catch (error) {
            console.error("Pending ratings submission error:", error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [plotType, API_BASE]);

    const handleRatingChange = useCallback(
        async (value) => {
            if (value < 1 || value > 5) return;

            // 1. Immediately update UI state
            setRating(value);
            setIsSubmitted(true);

            // 2. Always save to cache first
            localStorage.setItem(RATING_CACHE_KEY, value.toString());

            // 3. Store in pending ratings for sync
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

            // 4. DO NOT hit the database here - wait for logout/login
        },
        [RATING_CACHE_KEY, PENDING_RATINGS_KEY]
    );

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "authToken") {
                const token = localStorage.getItem("authToken");
                const wasAuthenticated = isAuthenticated;
                setIsAuthenticated(!!token);

                if (token && !wasAuthenticated) {
                    // User logged in - sync pending ratings
                    fetchRatings();
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

    // Sync pending ratings when component unmounts
    useEffect(() => {
        return () => {
            if (isAuthenticated) {
                const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
                if (pendingRatings) {
                    submitPendingRatingsToDB();
                }
            }
        };
    }, [isAuthenticated, submitPendingRatingsToDB]);

    const renderStars = useCallback(
        (ratingValue, size = "text-xl", interactive = false, onStarClick = null) => {
            const fullStars = ratingValue !== null ? Math.floor(ratingValue) : 0;
            const hasHalfStar = ratingValue !== null && ratingValue % 1 >= 0.5;
            const stars = [];

            for (let i = 1; i <= 5; i++) {
                let starComponent;

                if (i <= fullStars) {
                    starComponent = <FaStar key={i} className="text-yellow-400" />;
                } else if (i === fullStars + 1 && hasHalfStar) {
                    starComponent = <FaStarHalfAlt key={i} className="text-yellow-400" />;
                } else {
                    starComponent = <FaRegStar key={i} className="text-gray-400" />;
                }

                if (interactive && onStarClick) {
                    stars.push(
                        <button
                            key={i}
                            onClick={() => onStarClick(i)}
                            className={`transition-all duration-200 hover:scale-125 hover:text-yellow-500 focus:outline-none ${size === "text-2xl" ? "p-1" : "p-0.5"
                                }`}
                            disabled={isLoading}
                            aria-label={`Rate ${i} out of 5 stars`}
                        >
                            {starComponent}
                        </button>
                    );
                } else {
                    stars.push(
                        <span key={i} className={size === "text-2xl" ? "p-1" : "p-0.5"}>
                            {starComponent}
                        </span>
                    );
                }
            }

            return (
                <div className={`flex ${size} ${interactive ? "cursor-pointer" : ""}`}>
                    {stars}
                </div>
            );
        },
        [isLoading]
    );

    const InteractiveStarRating = useMemo(
        () => (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    {renderStars(rating, "text-lg", true, handleRatingChange)}
                </div>
                {isSubmitted && userRating && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Your Rating: {userRating}/5
                    </div>
                )}
            </div>
        ),
        [rating, userRating, isSubmitted, renderStars, handleRatingChange]
    );

    if (isFetchingRating) {
        return (
            <div className="flex items-center justify-center p-4">
                <HashLoader color="#3B82F6" size={25} />
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">Loading ratings...</span>
            </div>
        );
    }

    if (hasFetchError) {
        return (
            <div className="flex items-center justify-center p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">
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
    //     <div className="flex flex-col gap-6 p-4">
    //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

    //             {/* User Rating Section */}
    //             <div className="flex items-center gap-4">
    //                 <div className="min-w-[80px]">
    //                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Rating</span>
    //                 </div>
    //                 <div className="flex items-center gap-3">
    //                     {renderStars(rating, "text-xl", true, handleRatingChange)}
    //                     {rating > 0 && (
    //                         <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
    //                             {rating}/5
    //                         </span>
    //                     )}
    //                 </div>
    //             </div>

    //             {/* Divider - Hidden on mobile */}
    //             <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

    //             {/* Average Rating Section */}
    //             <div className="flex items-center gap-4">
    //                 <div className="min-w-[80px]">
    //                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average</span>
    //                 </div>
    //                 <div className="flex items-center gap-3">
    //                     {averageRating !== null ? (
    //                         <>
    //                             {renderStars(averageRating, "text-xl")}
    //                             <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
    //                                 {averageRating.toFixed(1)}/5
    //                             </span>
    //                         </>
    //                     ) : (
    //                         <span className="text-sm text-gray-500 dark:text-gray-400 italic">No ratings yet</span>
    //                     )}
    //                 </div>
    //             </div>
    //         </div>

    //         {/* Status Messages */}
    //         <div className="space-y-2">
    //             {!isAuthenticated && rating > 0 && (
    //                 <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
    //                     ⭐ Rating saved locally - <span className="font-medium">Login to sync permanently</span>
    //                 </div>
    //             )}

    //             {hasPendingSync && isAuthenticated && (
    //                 <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
    //                     🔄 Syncing your rating...
    //                 </div>
    //             )}

    //             {!isAuthenticated && !rating && (
    //                 <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
    //                     How helpful was this analysis? Click to rate.
    //                 </div>
    //             )}
    //         </div>

    //         {isLoading && (
    //             <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
    //                 <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg flex items-center gap-3">
    //                     <HashLoader color="#3B82F6" size={20} />
    //                     <span className="text-sm text-gray-700 dark:text-gray-300">Saving your rating…</span>
    //                 </div>
    //             </div>
    //         )}
    //     </div>
    // );
    return (
        <div className="fixed top-4 right-4 flex flex-col gap-3 p-3 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* User Rating Section */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your Rating:
                    </span>
                    <div className="flex items-center gap-1">
                        {renderStars(rating, "text-base", true, handleRatingChange)}
                        {rating > 0 && (
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
                                {rating}/5
                            </span>
                        )}
                    </div>
                </div>

                {/* Average Rating Section */}
                {averageRating !== null && (
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
                    Log in to back up your data
                </div>
            )}

            {hasPendingSync && isAuthenticated && (
                <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    Thank you for your rating!
                </div>
            )}

            {!isAuthenticated && !rating && (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    How helpful was this analysis? Click to rate.
                </div>
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg flex items-center gap-2">
                        <HashLoader color="#3B82F6" size={16} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Saving your rating…
                        </span>
                    </div>
                </div>
            )}
        </div>

    );
};

export default FinancialRatingSystem;