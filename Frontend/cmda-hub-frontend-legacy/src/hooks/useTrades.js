// // src/hooks/useTrades.js (New: Separate API for trades)
// import { useCallback } from "react";
// import { API_BASE_URL } from "../components/utils/constants";
// import { format, isAfter } from "date-fns";

// const useTrades = (setError, setTradesData) => {
//   const fetchTradesInRange = useCallback(async (portfolioId, startDate, endDate) => {
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
//         // return [];}
//     }
//     return trades || [];
//   }, []);

//   const deleteTradesInRange = useCallback(async (portfolioId, startDate, endDate) => {
//    const token = localStorage.getItem("authToken");
//     if (!token) {
//       setError("Please login to delete trades.");
//       return false;
//     }

//     // Validate date range
//     if (isAfter(new Date(startDate), new Date(endDate))) {
//       setError("Start date cannot be after end date.");
//       return false;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/delete_trades?portfolioId=${portfolioId}&startDate=${startDate}&endDate=${endDate}`,
//         {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Delete trades failed: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         return true;
//       } else {
//         setError(data.message || "Failed to delete trades");
//         return false;
//       }
//     } catch (error) {
//       console.error('Error deleting trades:', error);
//       setError(`Failed to delete trades: ${error.message}`);
//     //   return false;
//     }

//     return success;
//   }, []);

//   return { fetchTradesInRange, deleteTradesInRange };
// };

// export default useTrades;

// src/hooks/useTrades.js (Updated: Full implementation)
import { useCallback } from "react";
import { API_BASE_URL } from "../components/utils/constants";
import { isAfter } from "date-fns";

const useTrades = (setError, setTradesData) => {
  const fetchTradesInRange = useCallback(async (portfolioId, startDate, endDate) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to view trades.");
      return [];
    }

    // Validate date range
    if (isAfter(new Date(startDate), new Date(endDate))) {
      setError("Start date cannot be after end date.");
      return [];
    }

    try {
      const url = `${API_BASE_URL}/get_trades_inrange?portfolioId=${portfolioId}&startDate=${startDate}&endDate=${endDate}`;
      console.log("Fetching trades from:", url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("No trades found for the selected range");
          return [];
        }
        throw new Error(`Failed to fetch trades: ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse trades response:", text);
        // Let the AuthContext handle session expiry instead of removing token here
        if (text.includes("This session") || text.includes("expired") || text.includes("Unauthori")) {
          setError("Session expired. Please login again.");
          return [];
        }
        throw new Error(`Server returned invalid data: ${text.substring(0, 50)}...`);
      }

      console.log("Trades data received:", data);

      // Handle different response formats
      if (data.success === false) {
        console.warn("API returned error:", data.message);
        return [];
      }

      if (Array.isArray(data)) {
        setTradesData(data);
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        setTradesData(data.data);
        return data.data;
      } else {
        console.warn("Unexpected trades data format:", data);
        setTradesData([]);
        return [];
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
      setError(`Failed to fetch trades: ${error.message}`);
      setTradesData([]);
      return [];
    }
  }, [setError, setTradesData]);

  const deleteTradesInRange = useCallback(async (portfolioId, startDate, endDate) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to delete trades.");
      return false;
    }

    // Validate date range
    if (isAfter(new Date(startDate), new Date(endDate))) {
      setError("Start date cannot be after end date.");
      return false;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/delete_trades?portfolioId=${portfolioId}&startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Delete trades failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        setError(data.message || "Failed to delete trades");
        return false;
      }
    } catch (error) {
      console.error('Error deleting trades:', error);
      setError(`Failed to delete trades: ${error.message}`);
      return false;
    }
  }, [setError]);

  return { fetchTradesInRange, deleteTradesInRange };
};

export default useTrades;