// src/services/pointsService.js
import api from './api'; // Import your shared axios instance
import { getAuthToken } from './api'; // Import the token helper

const POINTS_API_URL = `${import.meta.env.VITE_URL || `${window.location.origin}/api`}/points`;

const pointsService = {
  /**
   * Get user points summary using JWT token
   */
  getUserPointsSummary: async () => {
    try {
      const response = await api.get('/points/summary/my-points');
      return response.data;
    } catch (error) {
      console.error('Error fetching points summary:', error);

      // Handle specific error cases following your pattern
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to fetch points data');
      }
    }
  },

  /**
   * Get plot points per user
   */
  getPlotPoints: async () => {
    try {
      const response = await api.get('/points/plot');
      return response.data;
    } catch (error) {
      console.error('Error fetching plot points:', error);
      throw new Error('Failed to fetch plot points');
    }
  },

  /**
   * Get portfolio points per user
   */
  getPortfolioPoints: async () => {
    try {
      const response = await api.get('/points/portfolio');
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio points:', error);
      throw new Error('Failed to fetch portfolio points');
    }
  },

  /**
   * Get tutorial points per user
   */
  getTutorialPoints: async () => {
    try {
      const response = await api.get('/points/tutorial');
      return response.data;
    } catch (error) {
      console.error('Error fetching tutorial points:', error);
      throw new Error('Failed to fetch tutorial points');
    }
  },

  /**
   * Get points status
   */
  getPointsStatus: async () => {
    try {
      const response = await api.get('/points/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching points status:', error);
      throw new Error('Failed to fetch points status');
    }
  },

  /**
   * Get user points summary by user ID (admin function)
   */
  getUserPointsSummaryById: async (userId) => {
    try {
      const response = await api.get(`/points/summary/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching points summary for user ${userId}:`, error);
      throw new Error(`Failed to fetch points for user ${userId}`);
    }
  }
};

export default pointsService;