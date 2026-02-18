// MTM (Mark-to-Market) API Service
// Centralized service for plot generation, equity data, and analytics

const MTM_BASE = import.meta.env.VITE_MTM_URL || "http://localhost:9002";

/**
 * Load initial equity data including market summary and financial ratios
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Market summary, financial ratios, and company equity data
 */
export const loadEquityData = async (symbol) => {
  try {
    const response = await fetch(
      `${MTM_BASE}/load_data?symbol=${encodeURIComponent(symbol)}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to load equity data: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to load equity data");
    }
  } catch (error) {
    console.error("MTM API - Load Equity Data Error:", error);
    throw error;
  }
};

/**
 * Generate a single plot for a stock symbol
 * @param {string} symbol - Stock symbol
 * @param {string} plotType - Type of plot (e.g., 'price_trend', 'macd', 'box_plot')
 * @param {Object} options - Additional options (period, fig, etc.)
 * @returns {Promise<Object>} Plot data
 */
export const generatePlot = async (symbol, plotType, options = {}) => {
  try {
    const params = new URLSearchParams({
      symbol: symbol,
      plot_type: plotType,
      ...options,
    });

    const response = await fetch(`${MTM_BASE}/plot_generation?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to generate plot: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to generate plot");
    }
  } catch (error) {
    console.error(`MTM API - Generate Plot Error (${plotType}):`, error);
    throw error;
  }
};

/**
 * Generate all plots for a stock symbol at once
 * @param {string} symbol - Stock symbol
 * @param {Object} options - Additional options (period, fig)
 * @returns {Promise<Object>} All plot data
 */
export const generateAllPlots = async (symbol, options = {}) => {
  try {
    const params = new URLSearchParams({
      symbol: symbol,
      ...options,
    });

    const response = await fetch(`${MTM_BASE}/all_plot_generation?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to generate all plots: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to generate all plots");
    }
  } catch (error) {
    console.error("MTM API - Generate All Plots Error:", error);
    throw error;
  }
};

/**
 * Get equity sectoral analysis summary
 * @returns {Promise<Object>} Sector summary data
 */
export const getSectoralAnalysis = async () => {
  try {
    const response = await fetch(`${MTM_BASE}/equity_sectoral_analysis`);

    if (!response.ok) {
      throw new Error(`Failed to get sectoral analysis: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to get sectoral analysis");
    }
  } catch (error) {
    console.error("MTM API - Sectoral Analysis Error:", error);
    throw error;
  }
};

/**
 * Get industry dividend yield data
 * @returns {Promise<Array>} Industry dividend summary
 */
export const getIndustryDividendYield = async () => {
  try {
    const response = await fetch(`${MTM_BASE}/industry_dividend_yield`);

    if (!response.ok) {
      throw new Error(
        `Failed to get industry dividend yield: ${response.status}`,
      );
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error(
        result.message || "Failed to get industry dividend yield",
      );
    }
  } catch (error) {
    console.error("MTM API - Industry Dividend Yield Error:", error);
    throw error;
  }
};

/**
 * Get industry dividend details for specific industry
 * @param {string} industryName - Industry name (partial or full)
 * @returns {Promise<Array>} Company dividend details
 */
export const getIndustryDividendDetails = async (industryName) => {
  try {
    const response = await fetch(
      `${MTM_BASE}/industry_dividend_details?industry_name=${encodeURIComponent(industryName)}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get industry dividend details: ${response.status}`,
      );
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error(
        result.message || "Failed to get industry dividend details",
      );
    }
  } catch (error) {
    console.error("MTM API - Industry Dividend Details Error:", error);
    throw error;
  }
};

/**
 * Get index data including constituents and metrics
 * @param {string} indexName - Index name (e.g., 'NIFTY 50', 'BSE SENSEX')
 * @returns {Promise<Object>} Index data and constituents
 */
export const getIndexData = async (indexName) => {
  try {
    const response = await fetch(
      `${MTM_BASE}/index_data?index_name=${encodeURIComponent(indexName)}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to get index data: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to get index data");
    }
  } catch (error) {
    console.error("MTM API - Index Data Error:", error);
    throw error;
  }
};

/**
 * Calculate brokerage charges for a trade
 * @param {Object} tradeParams - Trade parameters
 * @param {string} tradeParams.exchange - 'NSE' or 'BSE'
 * @param {number} tradeParams.buy_price - Entry price
 * @param {number} tradeParams.sell_price - Exit price
 * @param {string} tradeParams.gender - 'MALE' or 'FEMALE'
 * @param {number} tradeParams.quantity - Number of shares
 * @param {string} tradeParams.broker - Broker name (e.g., 'GROWW', 'ZERODHA')
 * @param {string} tradeParams.timeframe - 'Delivery' or 'Intraday'
 * @returns {Promise<Object>} Brokerage breakdown
 */
export const calculateBrokerage = async (tradeParams) => {
  try {
    const params = new URLSearchParams(tradeParams);

    const response = await fetch(`${MTM_BASE}/calculate_brokerage?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to calculate brokerage: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to calculate brokerage");
    }
  } catch (error) {
    console.error("MTM API - Calculate Brokerage Error:", error);
    throw error;
  }
};

/**
 * Search news articles
 * @param {string} query - Search query
 * @returns {Promise<Array>} News articles
 */
export const searchNews = async (query) => {
  try {
    const response = await fetch(
      `${MTM_BASE}/news/search?query=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to search news: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("MTM API - Search News Error:", error);
    throw error;
  }
};

/**
 * Get news by category
 * @param {string} category - 'business' or 'commodity'
 * @returns {Promise<Array>} News articles
 */
export const getNewsByCategory = async (category) => {
  try {
    const response = await fetch(
      `${MTM_BASE}/news/category?category=${encodeURIComponent(category)}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to get news by category: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("MTM API - Get News By Category Error:", error);
    throw error;
  }
};

/**
 * Scrape Reddit for stock discussions
 * @param {Object} params - Scraping parameters
 * @param {string} params.keyword - Stock keyword/symbol
 * @param {string} params.timeframe - '1_month', '3_months', or '1_year'
 * @param {string} params.subreddits - Comma-separated subreddit list (optional)
 * @param {number} params.posts_per_category - Posts per category (optional)
 * @param {number} params.comments_per_category - Comments per category (optional)
 * @returns {Promise<Object>} Reddit scrape results
 */
export const scrapeReddit = async (params) => {
  try {
    const queryParams = new URLSearchParams(params);

    const response = await fetch(`${MTM_BASE}/reddit_scrape?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to scrape Reddit: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error(result.message || "Failed to scrape Reddit");
    }
  } catch (error) {
    console.error("MTM API - Reddit Scrape Error:", error);
    throw error;
  }
};

// Export a default object with all methods
export default {
  loadEquityData,
  generatePlot,
  generateAllPlots,
  getSectoralAnalysis,
  getIndustryDividendYield,
  getIndustryDividendDetails,
  getIndexData,
  calculateBrokerage,
  searchNews,
  getNewsByCategory,
  scrapeReddit,
};
