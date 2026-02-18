// // src/hooks/usePortfolioRange.js (New: Separate API for range)
// import { useCallback } from "react";
// import { API_BASE_URL } from "../components/utils/constants";
// import { formatArrayToDateString } from "../components/utils/dateUtils";

// const usePortfolioRange = (setError) => {
//   const fetchPortfolioRange = useCallback(async (portfolioId) => {
//       const token = localStorage.getItem("authToken");
//     if (!token) {
//       setError("Please login to view trades.");
//       return [];
//     }

//     // Validate date range
//     if (isAfter(new Date(startDate), new Date(endDate))) {
//       setError("Start date cannot be after end date.");
//       return [];
//     }

//     try {
//       const url = `${API_BASE_URL}/get_trades_inrange?portfolioId=${portfolioId}&startDate=${startDate}&endDate=${endDate}`;
//       console.log("Fetching trades from:", url);
     
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         if (response.status === 404) {
//           console.log("No trades found for the selected range");
//           return [];
//         }
//         throw new Error(`Failed to fetch trades: ${response.status}`);
//       }
     
//       const data = await response.json();
//       console.log("Trades data received:", data);
     
//       // Handle different response formats
//       if (data.success === false) {
//         console.warn("API returned error:", data.message);
//         return [];
//       }
     
//       if (Array.isArray(data)) {
//         return data;
//       } else if (data.data && Array.isArray(data.data)) {
//         return data.data;
//       } else {
//         console.warn("Unexpected trades data format:", data);
//         return [];
//       }
//     } catch (error) {
//       console.error('Error fetching trades:', error);
//       setError(`Failed to fetch trades: ${error.message}`);
//       return [];
//     }

//     return { minDate: minDateStr, maxDate: maxDateStr };
//   }, []);

//   return { fetchPortfolioRange };
// };

// export default usePortfolioRange;

// src/hooks/usePortfolioRange.js (Updated: Full implementation)
import { useCallback } from "react";
import { API_BASE_URL } from "../components/utils/constants";
import { formatArrayToDateString } from "../components/utils/dateUtils";
import { isAfter } from "date-fns";

const usePortfolioRange = (setError) => {
  const fetchPortfolioRange = useCallback(async (portfolioId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to view trades.");
      return { minDate: null, maxDate: null };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/range?portfolioId=${portfolioId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // If server returns non-OK, try to read body safely for a useful error message
      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let serverMsg = `Range fetch failed: ${response.status}`;
        try {
          if (contentType.includes('application/json')) {
            const errJson = await response.json();
            serverMsg = errJson?.message || JSON.stringify(errJson);
          } else {
            const text = await response.text();
            serverMsg = text || serverMsg;
          }
        } catch (e) {
          // fallback if parsing fails
          console.warn('Failed to parse error body for range fetch', e);
        }

        if (response.status === 404) {
          console.warn('No range data found for portfolio');
          return { minDate: null, maxDate: null };
        }

        throw new Error(serverMsg);
      }

      // Response is OK — parse based on content-type to avoid JSON parse errors
      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          // JSON parse failed — read as text to surface message
          const text = await response.text();
          throw new Error(text || 'Invalid JSON received from server');
        }
      } else {
        // Non-JSON but OK — try to read text and treat as error message
        const text = await response.text();
        console.warn('Unexpected non-JSON response for range:', text);
        throw new Error(text || 'Unexpected response format');
      }

      console.log('Portfolio range data:', data);
     
      let minDateStr = null;
      let maxDateStr = null;
     
      // Handle different response formats
      if (data.data) {
        // Format from your Postman example
        if (data.data.minDate && Array.isArray(data.data.minDate)) {
          minDateStr = formatArrayToDateString(data.data.minDate);
        }
        if (data.data.maxDate && Array.isArray(data.data.maxDate)) {
          maxDateStr = formatArrayToDateString(data.data.maxDate);
        }
      } else if (data.minDate && data.maxDate) {
        // Direct string format
        minDateStr = data.minDate.split('T')[0];
        maxDateStr = data.maxDate.split('T')[0];
      }
     
      return { minDate: minDateStr, maxDate: maxDateStr };
    } catch (error) {
      console.error('Error fetching portfolio range:', error);
      // If backend returned a textual message like 'This session expired...', show it directly
      setError(error.message || `Failed to fetch portfolio range`);
      return { minDate: null, maxDate: null };
    }
  }, [setError]);

  return { fetchPortfolioRange };
};

export default usePortfolioRange;