/**
 * Equity Insights API Service
 * Centralized API calls to the Python equity_insights_ms microservice
 */

const EQUITY_INSIGHTS_BASE =
  import.meta.env.VITE_EQUITY_INSIGHTS_URL || "http://localhost:9001";
const API_KEY = import.meta.env.VITE_INTERNAL_API_KEY;

// Simple URL validation
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Build headers with optional API key authentication
 */
const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }

  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "API request failed" }));
    throw new Error(
      error.message || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (data.status !== "success") {
    throw new Error(data.message || "API returned error status");
  }

  return data.data;
};

/**
 * Equity Insights API Methods
 */
export const equityInsightsApi = {
  /**
   * Get search autocomplete options
   * @returns {Promise<Array>} Array of stock options
   */
  async getSearchOptions() {
    try {
      if (!isValidUrl(EQUITY_INSIGHTS_BASE)) {
        throw new Error(
          `Invalid EQUITY_INSIGHTS_BASE: ${EQUITY_INSIGHTS_BASE}`,
        );
      }

      const response = await fetch(
        `${EQUITY_INSIGHTS_BASE}/api/v1/equity-insights/search/options`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );

      const data = await handleResponse(response);
      return data.options || data || [];
    } catch (error) {
      console.error("Failed to fetch search options:", error);
      throw error;
    }
  },

  /**
   * Get price action history for a stock
   * @param {number} fincode - Stock financial code
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Price action data
   */
  async getPriceActionHistory(fincode, startDate, endDate) {
    try {
      if (!fincode) {
        throw new Error("fincode is required for getPriceActionHistory");
      }
      if (!isValidUrl(EQUITY_INSIGHTS_BASE)) {
        throw new Error(
          `Invalid EQUITY_INSIGHTS_BASE: ${EQUITY_INSIGHTS_BASE}`,
        );
      }

      const url = new URL(
        `${EQUITY_INSIGHTS_BASE}/api/v1/equity-insights/candle-chart/price-action-history/${fincode}`,
      );

      if (startDate) url.searchParams.append("start_date", startDate);
      if (endDate) url.searchParams.append("end_date", endDate);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: getHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(
        `Failed to fetch price action for fincode ${fincode}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Get detected micro-patterns for a stock
   * @param {number} fincode - Stock financial code
   * @param {number} lookUpDays - Optional number of days to look back
   * @returns {Promise<Object>} Pattern data
   */
  async getMicroPatterns(fincode, lookUpDays = null) {
    try {
      if (!fincode) {
        throw new Error("fincode is required for getMicroPatterns");
      }
      if (!isValidUrl(EQUITY_INSIGHTS_BASE)) {
        throw new Error(
          `Invalid EQUITY_INSIGHTS_BASE: ${EQUITY_INSIGHTS_BASE}`,
        );
      }

      const url = new URL(
        `${EQUITY_INSIGHTS_BASE}/api/v1/equity-insights/candle-chart/micro-patterns/${fincode}`,
      );

      if (lookUpDays) url.searchParams.append("lookUp_days", lookUpDays);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: getHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch patterns for fincode ${fincode}:`, error);
      throw error;
    }
  },

  /**
   * Get corporate announcements (dividends, splits, earnings) for a stock
   * @param {number} fincode - Stock financial code
   * @returns {Promise<Object>} Announcement data
   */
  async getCorporateAnnouncements(fincode) {
    try {
      if (!fincode) {
        throw new Error("fincode is required for getCorporateAnnouncements");
      }
      if (!isValidUrl(EQUITY_INSIGHTS_BASE)) {
        throw new Error(
          `Invalid EQUITY_INSIGHTS_BASE: ${EQUITY_INSIGHTS_BASE}`,
        );
      }

      const response = await fetch(
        `${EQUITY_INSIGHTS_BASE}/api/v1/equity-insights/announcements/${fincode}`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );

      return await handleResponse(response);
    } catch (error) {
      console.error(
        `Failed to fetch announcements for fincode ${fincode}:`,
        error,
      );
      throw error;
    }
  },
};

export default equityInsightsApi;
