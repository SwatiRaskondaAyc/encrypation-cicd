// const API_BASE_URL = `${import.meta.env.VITE_URL}/portfolio`;

// export const portfolioApi = {
//   // Get all saved portfolios
//   async getMyPortfolios() {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(`${API_BASE_URL}/my_portfolios`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: "include",
//     });

//     if (!response.ok) throw new Error("Failed to fetch portfolios");
//     return await response.json();
//   },

//   // Get specific portfolio by ID
//   async getPortfolioById(portfolioId) {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(`${API_BASE_URL}/my_portfolio`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: "include",
//     });

//     if (!response.ok) throw new Error("Failed to fetch portfolio");
//     return await response.json();
//   },

//   // Update portfolio name
//   async updatePortfolioName(portfolioId, newName) {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(
//       `${API_BASE_URL}/update_name?portfolioId=${portfolioId}&newPortfolioName=${encodeURIComponent(newName)}`,
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) throw new Error("Failed to update portfolio name");
//     return await response.json();
//   },

//   // Delete portfolio
//   async deletePortfolio(portfolioId) {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(
//       `${API_BASE_URL}/full_delete?portfolioId=${portfolioId}`,
//       {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       }
//     );

//     if (!response.ok) throw new Error("Failed to delete portfolio");
//     return await response.json();
//   },

//   // Get trades in date range
//   async getTradesInRange(portfolioId, startDate, endDate) {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(
//       `${API_BASE_URL}/get_trades_inrange?portfolioId=${portfolioId}&startDate=${startDate}&endDate=${endDate}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       }
//     );

//     if (!response.ok) throw new Error("Failed to fetch trades");
//     return await response.json();
//   },

//   // Get portfolio date range
//   async getPortfolioRange(portfolioId) {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(
//       `${API_BASE_URL}/range?portfolioId=${portfolioId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       }
//     );

//     if (!response.ok) throw new Error("Failed to fetch portfolio range");
//     return await response.json();
//   },
// };

// const API_BASE_URL = `${import.meta.env.VITE_URL}/portfolio`;



// export const portfolioApi = {
//   // Get all saved portfolios
//   async getMyPortfolios() {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(`${API_BASE_URL}/my_portfolios`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       // credentials: "include",
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to fetch portfolios: ${response.status} ${errorText}`);
//     }

//     // Check if response is JSON
//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       const text = await response.text();
//       throw new Error(`Server returned non-JSON: ${text.substring(0, 100)}`);
//     }

//     return await response.json();
//   },


//   // Get specific portfolio by ID
//   async getPortfolioById(portfolioId) {
//     const token = localStorage.getItem("authToken");
//     console.log(`Fetching portfolio ${portfolioId} from: ${API_BASE_URL}/my_portfolio?portfolioId=${portfolioId}`);

//     const response = await fetch(
//       `${API_BASE_URL}/my_portfolio?portfolioId=${portfolioId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       }
//     );

//     console.log(`Response status for portfolio ${portfolioId}:`, response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`Failed to fetch portfolio ${portfolioId}:`, response.status, errorText);
//       throw new Error(`Failed to fetch portfolio: ${response.status} ${errorText.substring(0, 200)}`);
//     }

//     // Check if response is JSON
//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       const text = await response.text();
//       console.error(`Non-JSON response for portfolio ${portfolioId}:`, text.substring(0, 200));
//       throw new Error(`Server returned non-JSON: ${text.substring(0, 100)}`);
//     }

//     return await response.json();
//   },

//   // Update portfolio name
//   async updatePortfolioName(portfolioId, newName) {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(
//       `${API_BASE_URL}/update_name?portfolioId=${portfolioId}&newPortfolioName=${encodeURIComponent(newName)}`,
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to update portfolio name: ${response.status} ${errorText}`);
//     }

//     return await response.json();
//   },

//   // Delete portfolio
//   async deletePortfolio(portfolioId) {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(
//       `${API_BASE_URL}/full_delete?portfolioId=${portfolioId}`,
//       {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         // credentials: "include",
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to delete portfolio: ${response.status} ${errorText}`);
//     }

//     return await response.json();
//   },

//   // Get trades in date range
//   async getTradesInRange(portfolioId, startDate, endDate) {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(
//       `${API_BASE_URL}/get_trades_inrange?portfolioId=${portfolioId}&startDate=${startDate}&endDate=${endDate}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         // credentials: "include",
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to fetch trades: ${response.status} ${errorText}`);
//     }

//     return await response.json();
//   },

//   // Get portfolio date range
//   async getPortfolioRange(portfolioId) {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(
//       `${API_BASE_URL}/range?portfolioId=${portfolioId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         // credentials: "include",
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to fetch portfolio range: ${response.status} ${errorText}`);
//     }

//     return await response.json();
//   },

//   //get all trades for a portfolio
//   //  getAllTrades: async (portfolioId) => {
//   //   const token = localStorage.getItem("authToken");
//   //   if (!token) {
//   //     throw new Error("Authentication token not found");
//   //   }

//   //   const response = await fetch(
//   //     `${import.meta.env.VITE_URL}/portfolio/all_trades?portfolioId=${portfolioId}`,
//   //     {
//   //       method: 'GET',
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`,
//   //         'Content-Type': 'application/json'
//   //       }
//   //     }
//   //   );

//   //   if (!response.ok) {
//   //     const error = await response.text();
//   //     throw new Error(`Failed to fetch trades: ${error}`);
//   //   }

//   //   return await response.json();
//   // }
//    getAllTrades: async (portfolioId) => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       throw new Error("Authentication token not found");
//     }

//     const response = await fetch(
//       `${import.meta.env.VITE_URL}/all_trades?portfolioId=${portfolioId}`,
//       {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(`Failed to fetch trades: ${error}`);
//     }

//     const data = await response.json();

//     // Log the raw response for debugging
//     console.log(`getAllTrades raw response for ${portfolioId}:`, data);

//     // Return the data in a consistent format
//     return data;
//   }
// };

import { apiClient } from './apiClient';
import { generateSessionKey, encryptFile, encryptSessionKey, arrayBufferToBase64, decryptData, base64ToArrayBuffer } from './EncryptionService';



export const portfolioApi = {
  // Get all saved portfolios
  async getMyPortfolios() {
    return apiClient.get('/portfolio/my_portfolios');
  },

  // Get specific portfolio by ID
  async getPortfolioById(portfolioId) {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    try {
      const data = await apiClient.get(`/portfolio/my_portfolio?portfolioId=${encodeURIComponent(portfolioId)}`);

      // Transform the data if needed
      console.log('Portfolio API Response:', {
        portfolioId,
        data,
        isArray: Array.isArray(data),
        keys: data ? Object.keys(data) : 'No data'
      });

      return data;
    } catch (error) {
      console.error(`Failed to load portfolio ${portfolioId}:`, error);
      throw error;
    }
  },

  // Update portfolio name
  async updatePortfolioName(portfolioId, newName) {
    if (!portfolioId || !newName) {
      throw new Error('Portfolio ID and new name are required');
    }

    const encodedName = encodeURIComponent(newName);
    return apiClient.put(`/portfolio/update_name?portfolioId=${encodeURIComponent(portfolioId)}&newPortfolioName=${encodedName}`);
  },

  // Delete portfolio
  async deletePortfolio(portfolioId) {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    return apiClient.delete(`/portfolio/full_delete?portfolioId=${encodeURIComponent(portfolioId)}`);
  },

  // Get trades in date range
  async getTradesInRange(portfolioId, startDate, endDate) {
    if (!portfolioId || !startDate || !endDate) {
      throw new Error('Portfolio ID, start date, and end date are required');
    }

    return apiClient.get(
      `/portfolio/get_trades_inrange?portfolioId=${encodeURIComponent(portfolioId)}&startDate=${startDate}&endDate=${endDate}`
    );
  },

  // Get portfolio date range
  async getPortfolioRange(portfolioId) {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    return apiClient.get(`/portfolio/range?portfolioId=${encodeURIComponent(portfolioId)}`);
  },

  // Get all trades for a portfolio
  async getAllTrades(portfolioId) {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    try {
      const data = await apiClient.get(`/portfolio/all_trades?portfolioId=${encodeURIComponent(portfolioId)}`);

      console.log(`All trades for ${portfolioId}:`, {
        dataType: typeof data,
        isArray: Array.isArray(data),
        data
      });

      return data;
    } catch (error) {
      console.error(`Failed to get all trades for ${portfolioId}:`, error);
      throw error;
    }
  },

  // Upload and normalize file
  async uploadAndNormalizeFile(formData) {
    if (!formData || !(formData instanceof FormData)) {
      throw new Error('FormData is required');
    }

    return apiClient.uploadFile('/portfolio/normalized', formData);
  },

  // Analyze portfolio
  async analyzePortfolio(portfolioData) {
    if (!portfolioData || !Array.isArray(portfolioData)) {
      throw new Error('Portfolio data array is required');
    }

    return apiClient.post('/portfolio/analyze-json', portfolioData);
  },

  // Get portfolio health/status
  async getPortfolioHealth(portfolioId) {
    if (!portfolioId) {
      throw new Error('Portfolio ID is required');
    }

    return apiClient.get(`/portfolio/health/${encodeURIComponent(portfolioId)}`);
  },

  // Search portfolios
  async searchPortfolios(query) {
    return apiClient.get(`/portfolio/search?q=${encodeURIComponent(query)}`);
  },

  // --- Secure Upload Implementation ---

  // async getPublicKey() {
  //   const response = await apiClient.get('/portfolio/public-key');
  //   return response.publicKey || response; // Support both old raw string (if cached/bypass) and new JSON
  // },

  async uploadSecureNormalize(file, additionalParams = {}) {
    try {
      const sessionKey = await generateSessionKey();
      const { encryptedContent, iv } = await encryptFile(file, sessionKey);

      // Instead of encrypting with public key here, we send the raw session key
      // The backend will handle the RSA encryption to the Node service
      const sessionKeyRaw = await window.crypto.subtle.exportKey("raw", sessionKey);
      const sessionKeyBase64 = arrayBufferToBase64(sessionKeyRaw);

      const formData = new FormData();
      const encryptedFileBlob = new Blob([encryptedContent], { type: 'application/octet-stream' });
      formData.append('file', encryptedFileBlob, file.name + '.enc');
      formData.append('encryptedKey', sessionKeyBase64); // Sending as "encryptedKey" param name for compatibility
      formData.append('iv', arrayBufferToBase64(new Uint8Array(iv)));

      Object.keys(additionalParams).forEach(key => {
        formData.append(key, additionalParams[key]);
      });

      const response = await apiClient.uploadFile('/portfolio/secure-normalize', formData);

      if (!response.encryptedData || !response.iv) {
        throw new Error("Invalid encrypted response from server");
      }

      const decryptedResponse = await decryptData(
        base64ToArrayBuffer(response.encryptedData),
        base64ToArrayBuffer(response.iv),
        sessionKey
      );

      return { data: decryptedResponse, sessionKey }; // Return key for next step
    } catch (error) {
      console.error("Secure Normalize Failed:", error);
      throw error;
    }
  },

  async analyzeSecurePortfolio(normalizedData, sessionKey) {
    try {
      // 1. Encrypt the JSON data using AES
      const jsonString = JSON.stringify(normalizedData);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        sessionKey,
        dataBuffer
      );

      // 2. Export session key for server (Backend will RSA encrypt it)
      const sessionKeyRaw = await window.crypto.subtle.exportKey("raw", sessionKey);
      const sessionKeyBase64 = arrayBufferToBase64(sessionKeyRaw);

      // 3. Prepare Payload
      const payload = {
        encryptedData: arrayBufferToBase64(encryptedContent),
        encryptedKey: sessionKeyBase64,
        iv: arrayBufferToBase64(iv)
      };

      // 4. Send to Secure Endpoint
      const response = await apiClient.post('/portfolio/secure-analyze', payload);

      if (!response.encryptedData || !response.iv) {
        throw new Error("Invalid encrypted response from server");
      }

      // 5. Decrypt the Response
      const decryptedResponse = await decryptData(
        base64ToArrayBuffer(response.encryptedData),
        base64ToArrayBuffer(response.iv),
        sessionKey
      );

      return decryptedResponse;
    } catch (error) {
      console.error("Secure Analysis Failed:", error);
      throw error;
    }
  }


};