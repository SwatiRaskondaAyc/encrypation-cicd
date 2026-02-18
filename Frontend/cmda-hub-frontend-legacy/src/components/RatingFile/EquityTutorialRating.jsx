import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashLoader } from "react-spinners";

const EquityTutorialRating = ({ tutorialId, tutorialTitle }) => {
  const [rating, setRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRating, setIsFetchingRating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasFetchError, setHasFetchError] = useState(false);

  // Video name mapping based on tutorial title
  const videoNames = {
    "Introduction to Search Features": "Introduction to Search Features",
    "Market Mood: Delivery Trends and Trading Sentiments": "Market Mood",
    "Box Plot Analysis in Different Markets": "Box Plot",
    "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends": "Trend Tapestry",
    "Sensex & Stock Fluctuation": "Sensex & Stock Fluctuation",
    "Sensex Impact Calculator": "Sensex Impact Calculator",
    "MACD Indicator Explained": "MACD Indicator",
    "Sensex Symphony Harmonizing Stock Correlation Trends (TTM)": "Sensex Symphony",
    "Breach Busters_ Analyzing High and Low Breaches (TTM)": "Breach Busters",
    "PE vs EPS vs Book Value_ Gladiators in the Industry Arena": "PE vs EPS vs Book Value",
    "Performance HeatMap Visualizing Stock Performance Across Time": "Performance HeatMap",
    "Price Spread Over Time Analysis": "Price Spread Over Time"
  };

  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const RATING_CACHE_KEY = `tutorial_rating_cache_${tutorialId}`;
  const PENDING_RATINGS_KEY = `tutorial_pending_ratings_${tutorialId}`;

  // Get video name for API calls
  const getVideoName = useCallback(() => {
    return videoNames[tutorialTitle] || tutorialTitle;
  }, [tutorialTitle]);

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
    if (hasFetchError) return;

    setIsFetchingRating(true);
    const token = localStorage.getItem("authToken");
    const videoName = getVideoName();

    const timeout = setTimeout(() => {
      setHasFetchError(true);
      setIsFetchingRating(false);
    }, 10000);

    try {
      // Fetch user rating if authenticated
      if (token) {
        try {
          const userResponse = await fetch(`${API_BASE}/ratings/${encodeURIComponent(videoName)}/user`, {
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

      // Fetch average rating
      try {
        const avgResponse = await fetch(`${API_BASE}/ratings/${encodeURIComponent(videoName)}/average`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!avgResponse.ok) {
          setAverageRating(null);
        } else {
          const avgData = await avgResponse.json();
          const avgValue = avgData.average_rating || avgData;
          const numericAvg = typeof avgValue === "number" ? avgValue : parseFloat(avgValue);

          if (!isNaN(numericAvg) && numericAvg >= 0 && numericAvg <= 5) {
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
  }, [tutorialId, hasFetchError, API_BASE, RATING_CACHE_KEY, PENDING_RATINGS_KEY, getVideoName]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const submitPendingRatingsToDB = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
    const videoName = getVideoName();

    if (!token || !pendingRatings) return false;

    setIsLoading(true);
    try {
      const ratings = JSON.parse(pendingRatings);
      const mostRecentRating = ratings[ratings.length - 1];

      const response = await fetch(`${API_BASE}/ratings/${encodeURIComponent(videoName)}`, {
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
  }, [tutorialId, API_BASE, getVideoName]);

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

      toast.success("Thank you for your feedback!");

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
    (ratingValue, size = "text-lg", interactive = false, onStarClick = null) => {
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

  if (isFetchingRating) {
    return (
      <div className="flex items-center justify-center p-2">
        <HashLoader color="#3B82F6" size={20} />
        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Loading ratings...</span>
      </div>
    );
  }

  if (hasFetchError) {
    return (
      <div className="flex items-center justify-center p-2">
        <p className="text-red-600 dark:text-red-400 text-xs">
          Unable to load ratings
        </p>
      </div>
    );
  }

  const pendingRatings = localStorage.getItem(PENDING_RATINGS_KEY);
  const hasPendingSync = !!pendingRatings;

  return (
    <div className="flex flex-col gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rate this tutorial:</span>
          <div className="flex items-center gap-1">
            {renderStars(rating, "text-base", true, handleRatingChange)}
            {rating > 0 && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
                {rating}/5
              </span>
            )}
          </div>
        </div>

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
          Your rating has been saved.
        </div>
      )}

      {!isAuthenticated && !rating && (
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
          Evaluate this tutorial by selecting your rating.
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg flex items-center gap-2">
            <HashLoader color="#3B82F6" size={16} />
            <span className="text-sm text-gray-700 dark:text-gray-300">Updating</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquityTutorialRating;