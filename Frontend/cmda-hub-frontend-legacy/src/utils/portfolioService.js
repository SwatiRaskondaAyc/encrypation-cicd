import { apiClient } from './apiClient';

export const portfolioService = {
  // Get all saved portfolios
  async getMyPortfolios() {
    try {
      return await apiClient.get('/my_portfolios');
    } catch (error) {
      console.warn("Failed to fetch portfolios:", error.message);
      // Return empty array for auth errors or when no portfolios exist
      if (error.message.includes("expired") ||
        error.message.includes("login") ||
        error.message.includes("404")) {
        return [];
      }
      throw error;
    }
  },

  // Get specific portfolio by ID
  async getPortfolioById(portfolioId) {
    try {
      return await apiClient.get(`/all_trades?portfolioId=${portfolioId}`);
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
      throw error;
    }
  },

  // Update portfolio name
  async updatePortfolioName(portfolioId, newName) {
    try {
      return await apiClient.put(`/update_name?portfolioId=${portfolioId}&newPortfolioName=${encodeURIComponent(newName)}`);
    } catch (error) {
      console.error("Failed to update portfolio name:", error);
      throw error;
    }
  },

  // Delete portfolio
  async deletePortfolio(portfolioId) {
    try {
      return await apiClient.delete(`/full_delete?portfolioId=${portfolioId}`);
    } catch (error) {
      console.error("Failed to delete portfolio:", error);
      throw error;
    }
  },

  // Upload and normalize portfolio file
  async uploadPortfolioFile(formData) {
    try {
      return await apiClient.uploadFile('/normalized', formData);
    } catch (error) {
      console.error("Failed to upload portfolio:", error);
      throw error;
    }
  },

  // Analyze portfolio
  async analyzePortfolio(transactions) {
    try {
      return await apiClient.post('/analyze-json', transactions);
    } catch (error) {
      console.warn("Analysis failed:", error.message);
      // Don't throw error for analysis failure, just return null
      return null;
    }
  },
};