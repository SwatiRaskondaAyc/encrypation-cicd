// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { HashLoader } from "react-spinners";

// const RatingSystem = ({ plotType, onRatingUpdate }) => {
//   const [rating, setRating] = useState(null);
//   const [userRating, setUserRating] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetchingRating, setIsFetchingRating] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [hasFetchError, setHasFetchError] = useState(false);

//   const API_BASE = import.meta.env.VITE_URL;
//   const RATING_CACHE_KEY = `rating_cache_${plotType}`;

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
//       setIsFetchingRating(false);
//       return;
//     }
//     setIsAuthenticated(true);
//   }, []);

//   // Fetch user rating
//   useEffect(() => {
//     if (!isAuthenticated || hasFetchError) return;

//     const fetchUserRating = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token) return;

//       try {
//         const response = await fetch(`${API_BASE}/stocks/test/ratings/${plotType}/user`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         });

//         if (response.status === 401) {
//           localStorage.removeItem("authToken");
//           localStorage.removeItem(RATING_CACHE_KEY);
//           setIsAuthenticated(false);
//           setHasFetchError(true);
//           toast.error("Session expired. Please login again.");
//           return;
//         }

//         if (response.status === 404) {
//           setUserRating(null);
//           setRating(null);
//           setIsSubmitted(false);
//           setIsFetchingRating(false);
//           return;
//         }

//         if (!response.ok) throw new Error(`HTTP ${response.status}`);

//         const responseText = await response.text();
//         let ratingValue;
//         try {
//           const data = JSON.parse(responseText);
//           ratingValue = data.rating || data;
//         } catch {
//           ratingValue = parseInt(responseText);
//         }

//         if (ratingValue >= 1 && ratingValue <= 5) {
//           setUserRating(ratingValue);
//           setRating(ratingValue);
//           setIsSubmitted(true);
//           onRatingUpdate?.(ratingValue);
//           localStorage.setItem(RATING_CACHE_KEY, ratingValue.toString());
//         } else {
//           setUserRating(null);
//           setRating(null);
//           setIsSubmitted(false);
//         }
//       } catch (err) {
//         console.error("Rating fetch error:", err);
//         setUserRating(null);
//         setRating(null);
//         setIsSubmitted(false);
//         setHasFetchError(true);
//       } finally {
//         setIsFetchingRating(false);
//       }
//     };

//     fetchUserRating();
//   }, [plotType, isAuthenticated, hasFetchError]);

//   // Submit cached rating to DB on logout
//   const submitRatingToDB = useCallback(async (newRating) => {
//     const token = localStorage.getItem("authToken");
//     if (!token || newRating < 1 || newRating > 5) return;

//     try {
//       const response = await fetch(`${API_BASE}/stocks/test/ratings/${plotType}`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify({ rating: newRating }),
//       });

//       if (response.status === 401) {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem(RATING_CACHE_KEY);
//         setIsAuthenticated(false);
//         setHasFetchError(true);
//         return;
//       }

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const responseText = await response.text();
//       let message = "Rating submitted successfully";
//       try {
//         const data = JSON.parse(responseText);
//         message = data.message || data;
//       } catch { }

//       console.log("DB submission on logout:", message); // Silent log
//       localStorage.removeItem(RATING_CACHE_KEY); // Clear after success
//       setUserRating(newRating); // Update UI state if still mounted
//       onRatingUpdate?.(newRating);
//     } catch (err) {
//       console.error("Rating submission error on logout:", err);
//       // Keep cache on failure—retry next time
//     }
//   }, [plotType, onRatingUpdate]);

//   // Listen for authChange event (triggered on logout)
//   useEffect(() => {
//     const handleAuthChange = async () => {
//       setIsLoading(true);
//       const cached = localStorage.getItem(RATING_CACHE_KEY);
//       if (cached) {
//         const lastRating = parseInt(cached);
//         if (lastRating >= 1 && lastRating <= 5) {
//           await submitRatingToDB(lastRating); // Submit before session clears
//         }
//       }
//       setIsLoading(false); // Ensure loading state resets
//       setIsAuthenticated(false); // Sync with auth state
//     };

//     window.addEventListener("authChange", handleAuthChange);
//     return () => window.removeEventListener("authChange", handleAuthChange);
//   }, [submitRatingToDB]);

//   // const handleRatingChange = useCallback((value) => {
//   //   setRating(value);
//   //   localStorage.setItem(RATING_CACHE_KEY, value.toString()); // Cache immediately
//   //   setIsSubmitted(true);
//   //   toast.success('Awesome! Thanks for the rating! 😊');
//   //   onRatingUpdate?.(value);
//   // }, [onRatingUpdate]);

//   const handleRatingChange = useCallback(async (value) => {
//     setRating(value);
//     localStorage.setItem(RATING_CACHE_KEY, value.toString()); // Cache immediately
//     setIsSubmitted(true);
//     toast.success('Awesome! Thanks for the rating! 😊');

//     // Submit to backend
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`${API_BASE}/stocks/test/ratings/${plotType}`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//           body: JSON.stringify({ rating: value }),
//         });
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//         onRatingUpdate?.(value); // Notify parent component
//         // Optionally refetch average rating here or let parent handle it
//       } catch (err) {
//         console.error("Rating submission error:", err);
//         toast.error("Failed to submit rating. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   }, [plotType, onRatingUpdate]);

//   // Memoized star renderers
//   const renderStars = useMemo(() => (ratingValue, size = "text-xl") => {
//     if (!ratingValue) return null;
//     return (
//       <div className={`flex ${size}`}>
//         {[1, 2, 3, 4, 5].map((value) => (
//           <span key={value} className={value <= ratingValue ? "text-yellow-400" : "text-gray-300"}>
//             ★
//           </span>
//         ))}
//       </div>
//     );
//   }, []);

//   const renderInteractiveStars = useMemo(() => (currentRating, size = "text-2xl") => {
//     return (
//       <div className={`flex ${size}`}>
//         {[1, 2, 3, 4, 5].map((value) => (
//           <button
//             key={value}
//             onClick={() => handleRatingChange(value)}
//             className={`transition-transform hover:scale-110 ${value <= currentRating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}
//             disabled={isLoading}
//           >
//             ★
//           </button>
//         ))}
//       </div>
//     );
//   }, [handleRatingChange, isLoading]);

//   if (isFetchingRating) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           CMDA...
//         </p>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
//         <span className="text-sm text-yellow-800 dark:text-yellow-300">Please login to rate this chart</span>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
//           Rate this chart:
//         </span>
//         {renderInteractiveStars(rating)}
//       </div>
//       {isSubmitted && userRating && (
//         <div className="text-xs text-gray-600 dark:text-gray-400">
//           Current: {userRating}/5
//         </div>
//       )}
//     </div>
//   );
// };

// export default RatingSystem;









import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashLoader } from "react-spinners";

const RatingSystem = ({ plotType, onRatingUpdate }) => {
  const [rating, setRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRating, setIsFetchingRating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasFetchError, setHasFetchError] = useState(false);

  const API_BASE = import.meta.env.VITE_URL;
  const RATING_CACHE_KEY = `rating_cache_${plotType}`;
  const PENDING_RATINGS_KEY = `pending_ratings_${plotType}`;

  // Load cached rating and pending ratings on mount
  useEffect(() => {
    const cached = localStorage.getItem(RATING_CACHE_KEY);
    if (cached) {
      const parsed = parseInt(cached);
      if (parsed >= 1 && parsed <= 5) {
        setRating(parsed);
        setUserRating(parsed);
        setIsSubmitted(true);
      }
    }

    // Load pending ratings for potential sync
    const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
    if (pendingRatings) {
      try {
        const parsed = JSON.parse(pendingRatings);
        // We have pending ratings that need to be synced
      } catch (error) {
        localStorage.removeItem(PENDING_RATINGS_KEY);
      }
    }
  }, [RATING_CACHE_KEY, PENDING_RATINGS_KEY]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setIsFetchingRating(false);
      return;
    }
    setIsAuthenticated(true);
  }, []);

  // Fetch user rating
  useEffect(() => {
    if (!isAuthenticated || hasFetchError) return;

    const fetchUserRating = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE}/stocks/test/ratings/${plotType}/user`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem(RATING_CACHE_KEY);
          setIsAuthenticated(false);
          setHasFetchError(true);
          return;
        }

        if (response.status === 404) {
          setUserRating(null);
          setRating(null);
          setIsSubmitted(false);
          setIsFetchingRating(false);
          return;
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const responseText = await response.text();
        let ratingValue;
        try {
          const data = JSON.parse(responseText);
          ratingValue = data.rating || data;
        } catch {
          ratingValue = parseInt(responseText);
        }

        if (ratingValue >= 1 && ratingValue <= 5) {
          setUserRating(ratingValue);
          setRating(ratingValue);
          setIsSubmitted(true);
          onRatingUpdate?.(ratingValue);
          localStorage.setItem(RATING_CACHE_KEY, ratingValue.toString());

          // Clear pending ratings since we have the latest from DB
          localStorage.removeItem(PENDING_RATINGS_KEY);
        } else {
          setUserRating(null);
          setRating(null);
          setIsSubmitted(false);
        }
      } catch (err) {
        console.error("Rating fetch error:", err);
        setUserRating(null);
        setRating(null);
        setIsSubmitted(false);
        setHasFetchError(true);
      } finally {
        setIsFetchingRating(false);
      }
    };

    fetchUserRating();
  }, [plotType, isAuthenticated, hasFetchError, onRatingUpdate]);

  // Submit cached rating to DB on logout
  const submitRatingToDB = useCallback(async (newRating) => {
    const token = localStorage.getItem("authToken");
    if (!token || newRating < 1 || newRating > 5) return;

    try {
      const response = await fetch(`${API_BASE}/stocks/test/ratings/${plotType}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ rating: newRating }),
      });

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem(RATING_CACHE_KEY);
        setIsAuthenticated(false);
        setHasFetchError(true);
        return;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const responseText = await response.text();
      let message = "Rating submitted successfully";
      try {
        const data = JSON.parse(responseText);
        message = data.message || data;
      } catch { }

      console.log("DB submission on logout:", message); // Silent log
      localStorage.removeItem(RATING_CACHE_KEY); // Clear after success
      localStorage.removeItem(PENDING_RATINGS_KEY); // Clear pending ratings
      setUserRating(newRating); // Update UI state if still mounted
      onRatingUpdate?.(newRating);
    } catch (err) {
      console.error("Rating submission error on logout:", err);
      // Keep cache on failure—retry next time
    }
  }, [plotType, onRatingUpdate]);

  // Submit all pending ratings to DB
  const submitPendingRatings = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);

    if (!token || !pendingRatings) return;

    try {
      const ratings = JSON.parse(pendingRatings);
      // Submit only the most recent rating
      const mostRecentRating = ratings[ratings.length - 1];

      if (mostRecentRating >= 1 && mostRecentRating <= 5) {
        const response = await fetch(`${API_BASE}/stocks/test/ratings/${plotType}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ rating: mostRecentRating }),
        });

        if (response.ok) {
          console.log("Pending ratings synced successfully");
          localStorage.removeItem(PENDING_RATINGS_KEY);
          setUserRating(mostRecentRating);
          onRatingUpdate?.(mostRecentRating);
        }
      }
    } catch (err) {
      console.error("Pending ratings submission error:", err);
    }
  }, [plotType, onRatingUpdate]);

  // Listen for authChange event (triggered on logout) - SYNC ON LOGOUT
  useEffect(() => {
    const handleAuthChange = async () => {
      setIsLoading(true);
      const cached = localStorage.getItem(RATING_CACHE_KEY);
      if (cached) {
        const lastRating = parseInt(cached);
        if (lastRating >= 1 && lastRating <= 5) {
          await submitRatingToDB(lastRating); // Submit before session clears
        }
      }

      // Also sync any pending ratings
      const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
      if (pendingRatings) {
        try {
          const ratings = JSON.parse(pendingRatings);
          const mostRecentRating = ratings[ratings.length - 1];
          if (mostRecentRating >= 1 && mostRecentRating <= 5) {
            await submitRatingToDB(mostRecentRating);
          }
        } catch (error) {
          console.error("Error processing pending ratings on logout:", error);
        }
      }

      setIsLoading(false); // Ensure loading state resets
      setIsAuthenticated(false); // Sync with auth state
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, [submitRatingToDB]);

  // Handle rating change - CACHE FIRST APPROACH
  const handleRatingChange = useCallback((value) => {
    if (value < 1 || value > 5) return;

    // 1. Update UI state immediately
    setRating(value);
    setIsSubmitted(true);

    // 2. Save to cache
    localStorage.setItem(RATING_CACHE_KEY, value.toString());

    // 3. Add to pending ratings queue
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

    // 4. Show success message (local storage only)
    toast.success('Your feedback has been captured.');
    onRatingUpdate?.(value);

    // 5. DO NOT submit to database here - wait for logout
  }, [RATING_CACHE_KEY, PENDING_RATINGS_KEY, onRatingUpdate]);

  // Sync pending ratings when user logs in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && isAuthenticated) {
      const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
      if (pendingRatings) {
        // Sync pending ratings when user is authenticated
        submitPendingRatings();
      }
    }
  }, [isAuthenticated, submitPendingRatings]);

  // Memoized star renderers
  const renderStars = useMemo(() => (ratingValue, size = "text-xl") => {
    if (!ratingValue) return null;
    return (
      <div className={`flex ${size}`}>
        {[1, 2, 3, 4, 5].map((value) => (
          <span key={value} className={value <= ratingValue ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  }, []);

  const renderInteractiveStars = useMemo(() => (currentRating, size = "text-2xl") => {
    return (
      <div className={`flex ${size}`}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleRatingChange(value)}
            className={`transition-transform hover:scale-110 ${value <= (currentRating || 0) ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}
            disabled={isLoading}
          >
            ★
          </button>
        ))}
      </div>
    );
  }, [handleRatingChange, isLoading]);

  // Check if we have pending ratings that need sync
  const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
  const hasPendingSync = !!pendingRatings;

  if (isFetchingRating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
        <span className="text-sm text-yellow-800 dark:text-yellow-300">
          {hasPendingSync
            ? "Rating saved temporarily. Log in to preserve it."
            : "Please login to rate this analysis."}
        </span>
      </div>
    );
  }

  return (
    // <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
    //   <div className="flex items-center gap-2">
    //     <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
    //       Rate this chart:
    //     </span>
    //     {renderInteractiveStars(rating)}
    //   </div>
    //   {isSubmitted && rating && (
    //     <div className="text-xs text-gray-600 dark:text-gray-400">
    //       Current: {rating}/5
    //       {hasPendingSync && " (Pending sync)"}
    //     </div>
    //   )}
    //   {isLoading && (
    //     <div className="absolute inset-0 bg-white dark:bg-slate-900 bg-opacity-70 flex items-center justify-center rounded-xl">
    //       <HashLoader color="#0369a1" size={30} />
    //     </div>
    //   )}
    // </div>
    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Rating Section */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Rate this analysis
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



      {/* Status Messages */}
      {!isAuthenticated && rating > 0 && (
        <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
          {hasPendingSync
            ? "Rating saved temporarily. Log in to preserve it."
            : "Log in to back up your data"}
        </div>
      )}

      {/* {hasPendingSync && isAuthenticated && (
        <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
          Thank you for your rating!
        </div>
      )} */}

      {!isAuthenticated && !rating && (
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center sm:text-left">
          How helpful was this analysis? Click to rate.
        </div>
      )}

      {/* {isSubmitted && rating && isAuthenticated && !hasPendingSync && (
        <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
          ✓ Rating updated successfully
        </div>
      )} */}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
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

export default RatingSystem;