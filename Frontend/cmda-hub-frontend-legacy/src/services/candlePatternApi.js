/**
 * Candle Pattern API Service
 * Centralized API calls to the Python candle_pattern_ms microservice
 */

const CANDLE_PATTERN_BASE =
  import.meta.env.VITE_CANDLE_PATTERN_URL || "http://localhost:9000";
const API_KEY = import.meta.env.VITE_INTERNAL_API_KEY;

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
 * Candle Pattern API Methods
 */
export const candlePatternApi = {
  /**
   * Get search options
   * @returns {Promise<Array>} Array of stock options
   */
  async getSearchOptions() {
    try {
      const response = await fetch(`${CANDLE_PATTERN_BASE}/search`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await handleResponse(response);
      return data.options || data || [];
    } catch (error) {
      console.error("Failed to fetch search options:", error);
      throw error;
    }
  },

  /**
   * Scan for patterns across stocks
   * @param {Array<number>} patternIds - Array of pattern IDs to scan for
   * @param {number} lookUpDays - Number of days to look back
   * @returns {Promise<Object>} Scanned pattern data
   */
  async scanPatterns(patternIds, lookUpDays) {
    try {
      const response = await fetch(`${CANDLE_PATTERN_BASE}/patterns/scan`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          pattern_ids: patternIds,
          lookUp_days: lookUpDays,
        }),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to scan patterns:", error);
      throw error;
    }
  },

  /**
   * Get price action for multiple stocks in batch
   * @param {Array<number>} fincodes - Array of stock financial codes
   * @returns {Promise<Object>} Batch price action data
   */
  async getPriceActionBatch(fincodes) {
    try {
      const response = await fetch(
        `${CANDLE_PATTERN_BASE}/price-action/batch`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            fincodes: fincodes,
          }),
        },
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch batch price action:", error);
      throw error;
    }
  },
};

export default candlePatternApi;
