// // src/hooks/usePortfolios.js (New: Separate API for portfolios)
// import { useState, useCallback } from "react";
// import { API_BASE_URL, MAX_PORTFOLIOS_PER_USER } from "../components/utils/constants";
// import { formatUploadedAt } from "../components/utils/dateUtils";
// import useLocalStorage from "./useLocalStorage";

// const usePortfolios = (setSavedPortfolios, setError) => {
//   const [savedPortfolios, setInternalSavedPortfolios] = useState([]);
//   const { getLocalPortfolios, saveLocalPortfolios } = useLocalStorage();

//   const fetchMyPortfolios = useCallback(async () => {
//       const token = localStorage.getItem("authToken");
//   if (!token) {
//     setError("Please login to access your portfolios.");
//     setSavedPortfolios(getLocalPortfolios());
//     return;
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}/my_portfolios`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//       credentials: "include", // Important for JSESSIONID if used
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         setError("Session expired. Please login again.");
//         localStorage.removeItem("authToken");
//         setSavedPortfolios(getLocalPortfolios());
//         return;
//       }
//       throw new Error(`HTTP ${response.status}`);
//     }

//     const result = await response.json();

//     // Your API returns: { success: true, data: [ ...portfolios ] }
//     if (!result.success || !Array.isArray(result.data)) {
//       console.warn("Unexpected response format:", result);
//       setSavedPortfolios(getLocalPortfolios());
//       return;
//     }

//     const transformedData = result.data.map((portfolio) => ({
//       portfolioId: portfolio.pid,                    // ← "pf_1766660358874"
//       brokerId: portfolio.brokerId,                  // ← "Groww"
//       broker: portfolio.brokerId,                    // ← same as brokerId (string like "Groww")
//       portfolioName: portfolio.portfolioName,        // ← "CMDA_Groww"
//       createdAt: formatUploadedAt(portfolio.uploadedAt), // ← convert array to readable date
//       // Note: holdings/trades not included here — fetched separately later
//     }));

//     setSavedPortfolios(transformedData);
//     saveLocalPortfolios(transformedData);
//     setError(""); // Clear any previous errors

//     // Optional limit warning
//     if (transformedData.length >= MAX_PORTFOLIOS_PER_USER) {
//       setError(`You have reached the limit of ${MAX_PORTFOLIOS_PER_USER} portfolios. Delete one to upload new.`);
//     }

//   } catch (error) {
//     console.error("Error fetching portfolios:", error);
//     if (error.name === "SyntaxError") {
//       setError("Invalid session. Please login again.");
//       localStorage.removeItem("authToken");
//     } else {
//       setError("Failed to load portfolios. Please try again.");
//     }
//     setSavedPortfolios(getLocalPortfolios());
//   }


//   }, []);

//   const deletePortfolioFromBackend = useCallback(async (portfolioId) => {
//  const token = localStorage.getItem("authToken");
//     if (!token) {
//       setError("Please login to delete portfolios.");
//       return false;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/full_delete?portfolioId=${portfolioId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           setError("Session expired. Please login again.");
//           return false;
//         }
//         throw new Error(`Delete failed: ${response.status}`);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error deleting portfolio:', error);
//       setError(`Failed to delete portfolio: ${error.message}`);
//       return false;
//     }

//   }, []);

//   return { savedPortfolios, fetchMyPortfolios, deletePortfolioFromBackend };
// };

// export default usePortfolios;

// src/hooks/useUpload.js (Updated: uploadPortfolio accepts params from caller)
// import { useCallback } from "react";
// import { API_BASE_URL, MAX_PORTFOLIOS_PER_USER } from "../components/utils/constants.js";
// import { generatePortfolioId } from "../components/utils/dateUtils.js";

// const useUpload = (
//   setPortfolioData, 
//   setSavedPortfolios, 
//   saveLocalPortfolios,
//   setError, 
//   setLoading, 
//   setUploadProgress, 
//   setSelectedBroker, 
//   setBrokerStep, 
//   setBrokerFile, 
//   setSelectedFile,
//   isAuthenticated,
//   setShowSaveModal,
//   fetchMyPortfolios
// ) => {
//   const uploadPortfolio = useCallback(async (save, selectedFile, portfolioName, selectedBroker, savedPortfolios) => {
//     if (!selectedFile) return;

//     // Check authentication
//     if (!isAuthenticated()) {
//       setError("Please login to upload portfolios.");
//       return;
//     }

//     // Check portfolio limit for saving
//     if (save && savedPortfolios.length >= MAX_PORTFOLIOS_PER_USER) {
//       setError(`Cannot save: Maximum ${MAX_PORTFOLIOS_PER_USER} portfolios allowed per user. Please delete one first.`);
//       setShowSaveModal(false);
//       return;
//     }

//     const portfolioId = generatePortfolioId();
//     const token = localStorage.getItem("authToken");
//     const brokerId = selectedBroker;

//     setLoading(true);
//     setUploadProgress(0);
//     setShowSaveModal(false);

//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     formData.append("save", save.toString());
//     formData.append("portfolioId", portfolioId);
//     formData.append("portfolioName", portfolioName);
//     formData.append("brokerId", brokerId);
//     formData.append("brokerName", selectedBroker);

//     const interval = setInterval(() => {
//       setUploadProgress((prev) => {
//         if (prev >= 90) {
//           clearInterval(interval);
//           return 90;
//         }
//         return prev + 10;
//       });
//     }, 300);

//     try {
//       const res = await fetch(`${API_BASE_URL}/normalized`, {
//         method: "POST",
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       clearInterval(interval);
//       setUploadProgress(100);

//       if (!res.ok) {
//         if (res.status === 401) {
//           throw new Error("Session expired. Please login again.");
//         } else if (res.status === 403) {
//           throw new Error("Portfolio limit reached. Please delete a portfolio first.");
//         } else if (res.status === 400) {
//           const errorData = await res.json();
//           throw new Error(errorData.message || "Invalid file format or data.");
//         }
//         throw new Error(`Upload failed: ${res.status}`);
//       }

//       const result = await res.json();

//       if (result?.data) {
//         setPortfolioData(result.data);

//         if (save && result.success) {
//           const newPortfolio = {
//             portfolioId,
//             brokerId,
//             broker: selectedBroker,
//             portfolioName,
//             data: result.data,
//             createdAt: new Date().toISOString()
//           };

//           const updated = [...savedPortfolios, newPortfolio];
//           setSavedPortfolios(updated);
//           saveLocalPortfolios(updated);

//           await fetchMyPortfolios();

//           setSelectedBroker("");
//           setBrokerStep(1);
//           setBrokerFile(null);
//           setSelectedFile(null);

//           alert("Portfolio saved successfully!");
//         }
//       }
//     } catch (e) {
//       console.error("Upload error:", e);
//       setError(e.message || "Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//       setUploadProgress(0);
//     }
//   }, [
//     setPortfolioData, 
//     setSavedPortfolios, 
//     saveLocalPortfolios,
//     setError, 
//     setLoading, 
//     setUploadProgress, 
//     setSelectedBroker, 
//     setBrokerStep, 
//     setBrokerFile, 
//     setSelectedFile,
//     isAuthenticated,
//     setShowSaveModal,
//     fetchMyPortfolios
//   ]);

//   return { uploadPortfolio };
// };

// export default useUpload;

// src/hooks/usePortfolios.js (Fixed: Accept getLocalPortfolios as param)
import { useCallback } from "react";
import { API_BASE_URL, MAX_PORTFOLIOS_PER_USER } from "../components/utils/constants";
import { formatUploadedAt } from "../components/utils/dateUtils";

const usePortfolios = (setSavedPortfolios, saveLocalPortfolios, setError, getLocalPortfolios) => {
  const fetchMyPortfolios = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to access your portfolios.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/my_portfolios`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
          // Do not aggressively remove token here; let higher-level auth handlers decide.
          // localStorage.removeItem("authToken");
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      // Parse response text first, then try JSON
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse portfolios response:", text);
        if (text.includes("session") || text.includes("expired") || text.includes("Unauthori")) {
          setError("Session expired. Please login again.");
          return;
        }
        throw new Error(`Server returned invalid data`);
      }

      if (!result.success || !Array.isArray(result.data)) {
        console.warn("Unexpected response format:", result);
        return;
      }

      const transformedData = result.data.map((portfolio) => ({
        portfolioId: portfolio.pid,
        brokerId: portfolio.brokerId,
        broker: portfolio.brokerId,
        portfolioName: portfolio.portfolioName,
        createdAt: formatUploadedAt(portfolio.uploadedAt),
      }));

      setSavedPortfolios(transformedData);
      saveLocalPortfolios(transformedData);
      setError("");

      if (transformedData.length >= MAX_PORTFOLIOS_PER_USER) {
        setError(`You have reached the limit of ${MAX_PORTFOLIOS_PER_USER} portfolios. Delete one to upload new.`);
      }

    } catch (error) {
      console.error("Error fetching portfolios:", error);
      // Avoid clearing auth token on generic errors to prevent accidental logouts.
      if (error.name === "SyntaxError") {
        setError("Invalid session. Please login again.");
        // Do not remove token here; let the AuthContext handle session clearing.
        // localStorage.removeItem("authToken");
      } else {
        setError("Failed to load portfolios. Please try again.");
      }
      setSavedPortfolios(getLocalPortfolios());
    }
  }, [setSavedPortfolios, saveLocalPortfolios, setError, getLocalPortfolios]);

  const deletePortfolioFromBackend = useCallback(async (portfolioId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to delete portfolios.");
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/full_delete?portfolioId=${portfolioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
          return false;
        }
        throw new Error(`Delete failed: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      setError(`Failed to delete portfolio: ${error.message}`);
      return false;
    }
  }, [setError]);

  return { fetchMyPortfolios, deletePortfolioFromBackend };
};

export default usePortfolios;