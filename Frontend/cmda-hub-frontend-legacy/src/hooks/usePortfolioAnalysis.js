// src/hooks/usePortfolioAnalysis.js
import { useState } from 'react';
import { API_BASE_URL } from '../components/utils/constants';

const usePortfolioAnalysis = ({ transactions, token }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const analyze = async () => {
    if (!token) {
      const errMsg = 'Authentication token is required for analysis.';
      setError(errMsg);
      return null;
    }

    if (!Array.isArray(transactions) || transactions.length === 0) {
      const errMsg = 'No transactions available for analysis.';
      setError(errMsg);
      return null;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          // Note: Cookie header is typically set by the browser; including it manually may not be necessary or possible for dynamic values.
          // If JSESSIONID is required, it should be managed via browser cookies or adjusted based on your auth setup.
        },
        body: JSON.stringify(transactions),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred during portfolio analysis.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, error, data };
};

export default usePortfolioAnalysis;