// import React, { useState, useEffect } from 'react';
// import { Clock, ChevronDown, Eye, MessageCircle, ExternalLink } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function GoogleNews({ symbol }) {
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowDisclaimer(false);
//     }, 20000);

//     return () => clearTimeout(timer);
//   }, []);

//   const toggleDisclaimer = () => {
//     setShowDisclaimer(!showDisclaimer);
//   };

//   const timeOptions = [
//     { value: '1 Week', label: '1 Week' },
//     { value: '1 Month', label: '1 Month' },
//     { value: '3 Months', label: '3 Months' },
//     { value: '6 Months', label: '6 Months' },
//     { value: '1 Year', label: '1 Year' },
//     { value: 'All Time', label: 'All Time' }
//   ];

//   const sortOptions = [
//     { value: 'Recent', label: 'Most Recent' },
//     { value: 'Top', label: 'Top Voted' },
//     { value: 'Controversial', label: 'Most Controversial' },
//     { value: 'Most Discussed', label: 'Most Discussed' },
//     { value: 'New', label: 'Newest' },
//     { value: 'Old', label: 'Oldest' }
//   ];

//   return (
//     <div className="max-w-6xl mx-auto">

//       {/* Coming Soon Message */}
//    <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-24 text-center">
//   <div className="max-w-md mx-auto">
//     <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
//       <MessageCircle className="w-8 h-8 text-sky-600 dark:text-sky-400" />
//     </div>

//     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//        News Integration Coming Soon
//     </h3>

//     <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
//       We're working on integrating  News to bring you the latest articles, trends, 
//       and market sentiment. Soon, you'll be able to see real-time news updates about {symbol || 'this stock'} 
//       directly from trusted sources.
//     </p>
//   </div>
// </div>


      
//     </div>
//   );
// }

// export default GoogleNews;



import React, { useState, useEffect, useMemo } from 'react';
import { Clock, ChevronDown, Eye, ExternalLink, Calendar } from 'lucide-react';
import { IoWarning } from 'react-icons/io5';

function GoogleNews({ symbol }) {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timeFilter, setTimeFilter] = useState('1 Month');
  const [sortFilter, setSortFilter] = useState('Recent');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const API_URL = `${API_BASE}/news/search?query=${symbol}&useNlp=true`;

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-trigger')) {
        setShowTimeDropdown(false);
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto hide disclaimer
  useEffect(() => {
    const t = setTimeout(() => setShowDisclaimer(false), 20000);
    return () => clearTimeout(t);
  }, []);

  // ========== DATE FORMATTER ==========
  const formatDateTime = (timestamp) => {
    if (!timestamp) return { relative: 'Unknown time', full: 'Date not available' };

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return { relative: 'Invalid date', full: 'Invalid date' };

      const now = new Date();
      const diff = Math.floor((now - date) / 1000);

      let relative;
      if (diff < 60) relative = 'just now';
      else if (diff < 3600) relative = `${Math.floor(diff / 60)}m ago`;
      else if (diff < 86400) relative = `${Math.floor(diff / 3600)}h ago`;
      else if (diff < 2592000) relative = `${Math.floor(diff / 86400)}d ago`;
      else if (diff < 31536000) relative = `${Math.floor(diff / 2592000)}mo ago`;
      else relative = `${Math.floor(diff / 31536000)}y ago`;

      const full = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const dateOnly = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const timeOnly = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return { relative, full, date: dateOnly, time: timeOnly };
    } catch {
      return { relative: 'Invalid time', full: 'Invalid time' };
    }
  };

  // Fetch Google News
  useEffect(() => {
    if (!symbol) return;
    
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        const text = await response.text();

        let json;
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error("INVALID_JSON");
        }

        if (json.error) {
          const backendError = json.error.toLowerCase();

          if (backendError.includes("unable to reach fastapi")) {
            throw new Error("SERVICE_UNREACHABLE");
          }

          if (backendError.includes("fastapi returned an error response")) {
            throw new Error("PROVIDER_ERROR");
          }

          throw new Error("BACKEND_FAILURE");
        }

        if (!Array.isArray(json)) {
          throw new Error("INVALID_FORMAT");
        }

        setNewsData(json);

      } catch (err) {
        let userMessage;

        switch (err.message) {
          case "SERVICE_UNREACHABLE":
            userMessage =
              "We're having trouble connecting to the news service. Please check your connection or try again in a moment.";
            break;

          case "PROVIDER_ERROR":
            userMessage =
              "The news provider returned an unexpected response. Our team has been notified. Please try again shortly.";
            break;

          case "INVALID_JSON":
            userMessage =
              "The news data could not be processed. Please try again in a few moments.";
            break;

          case "INVALID_FORMAT":
            userMessage =
              "We received an unexpected format from the news feed. Please try again later.";
            break;

          case "BACKEND_FAILURE":
          default:
            userMessage =
              "Unable to load news at the moment. Please try again shortly.";
            break;
        }

        setError(userMessage);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  // TIME RANGE FILTER LOGIC
  const filterByTimeRange = (articles) => {
    if (timeFilter === 'All Time') return articles;

    const now = new Date();
    const ranges = {
      '1 Week': 7,
      '1 Month': 30,
      '3 Months': 90,
      '6 Months': 180,
      '1 Year': 365
    };

    const days = ranges[timeFilter] || 30;

    return articles.filter((a) => {
      const date = new Date(a.date);
      const diffDays = (now - date) / (1000 * 3600 * 24);
      return diffDays <= days;
    });
  };

  // SORTING LOGIC
  const sortedNews = useMemo(() => {
    let filtered = filterByTimeRange(newsData);

    let sorted = [...filtered];

    switch (sortFilter) {
      case 'Recent':
      case 'New':
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;

      case 'Old':
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
    }

    return sorted;
  }, [newsData, timeFilter, sortFilter]);

  // TIME & SORT OPTIONS
  const timeOptions = ['1 Week', '1 Month', '3 Months', '6 Months', '1 Year', 'All Time'];
  const sortOptions = ['Recent', 'New', 'Old'];

  // LOADING UI
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          {/* Header skeleton */}
          <div className="p-4 border-b border-gray-700">
            <div className="h-6 bg-gray-600 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-1/4 animate-pulse"></div>
          </div>
          
          {/* Filters skeleton */}
          <div className="p-4 border-b border-gray-700 flex gap-4">
            <div className="h-10 bg-gray-600 rounded w-40 animate-pulse"></div>
            <div className="h-10 bg-gray-600 rounded w-40 animate-pulse"></div>
          </div>
          
          {/* Articles skeleton */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 border-b border-gray-700 last:border-b-0">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="h-5 bg-gray-600 rounded w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="w-28 h-20 bg-gray-600 rounded ml-4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ERROR UI
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-6 rounded-xl shadow text-center">
          <IoWarning className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-red-800 dark:text-red-300 mb-2">
            {error}
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 
                       text-white text-sm font-medium rounded-lg shadow-sm transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // EMPTY STATE
  if (!loading && sortedNews.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No News Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No news articles found for {symbol} in the selected time range.
          </p>
          <button
            onClick={() => setTimeFilter('All Time')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Show All Time
          </button>
        </div>
      </div>
    );
  }

  

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Latest News for {symbol}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Showing {sortedNews.length} article{sortedNews.length !== 1 ? 's' : ''} • Time: {timeFilter} • Sort: {sortFilter}
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-gray-800 p-4 mb-6 border border-gray-700 rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* TIME RANGE */}
            <div className="relative dropdown-trigger">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Time Range
              </label>
              <button
                onClick={() => { setShowTimeDropdown(!showTimeDropdown); setShowSortDropdown(false); }}
                className="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-between w-40 text-sm hover:border-gray-500 transition"
              >
                <span>{timeFilter}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showTimeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-600 rounded-lg shadow-lg w-40 z-20 py-1">
                  {timeOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setTimeFilter(opt);
                        setShowTimeDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition ${
                        timeFilter === opt ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SORT */}
            <div className="relative dropdown-trigger">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Sort By
              </label>
              <button
                onClick={() => { setShowSortDropdown(!showSortDropdown); setShowTimeDropdown(false); }}
                className="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-between w-40 text-sm hover:border-gray-500 transition"
              >
                <span>{sortFilter}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-600 rounded-lg shadow-lg w-40 z-20 py-1">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortFilter(opt);
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition ${
                        sortFilter === opt ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Results count */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {sortedNews.length} article{sortedNews.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ARTICLES */}
      <div className="space-y-4">
        {sortedNews.map((article, idx) => {
          const dt = formatDateTime(article.date);

          return (
            <div
              key={idx}
              className="group bg-white dark:bg-gray-800 p-6 border border-gray-700 rounded-xl hover:shadow-lg hover:border-gray-600 transition-all duration-200"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {article.headline}
                  </h3>
                  
                  <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span title={dt.full}>{dt.relative}</span>
                    </div>
                    
                    {article.author && (
                      <>
                        <span>•</span>
                        <span className="italic">{article.author}</span>
                      </>
                    )}
                    
                    {article.source && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                        {article.source}
                      </span>
                    )}
                  </div>

                  {article.subtitle && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {article.subtitle}
                    </p>
                  )}
                  
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group/link transition"
                  >
                    Read Full Article 
                    <ExternalLink className="w-4 h-4 ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                </div>

                {article.image_url && (
                  <div className="flex-shrink-0">
                    <img
                      src={article.image_url}
                      alt="news"
                      className="w-28 h-20 rounded-lg object-cover cursor-pointer border border-gray-700 hover:border-gray-500 transition group-hover:scale-105"
                      onClick={() => window.open(article.image_url, '_blank')}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      {showDisclaimer && (
        <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-300 dark:border-orange-800 rounded-lg flex items-start space-x-3">
          <IoWarning className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300">
              Disclaimer
            </h4>
            <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
              News articles are automatically collected from public sources.  
              Always verify important information before making financial decisions.
            </p>
          </div>

          <button
            onClick={() => setShowDisclaimer(false)}
            className="text-orange-700 dark:text-orange-400 hover:underline text-xs flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add CSS for line clamping - include this in your global CSS */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default GoogleNews;