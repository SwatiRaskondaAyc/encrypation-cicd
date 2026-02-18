// const API_BASE_URL = `${import.meta.env.VITE_URL}/portfolio`;

// class ApiClient {
//   constructor() {
//     this.csrfToken = null;
//   }

//   async getHeaders(contentType = 'application/json') {
//     const token = localStorage.getItem("authToken");
//     const headers = {
//       'Accept': 'application/json',
//     };

//     if (contentType) {
//       headers['Content-Type'] = contentType;
//     }

//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     // Add CSRF token if available
//     if (this.csrfToken) {
//       headers['X-CSRF-TOKEN'] = this.csrfToken;
//     }

//     return headers;
//   }

//   async handleResponse(response) {
//     // Check content type
//     const contentType = response.headers.get("content-type");

//     if (!contentType || !contentType.includes("application/json")) {
//       const text = await response.text();

//       // Handle common error pages
//       if (text.includes("session expired") || 
//           text.includes("login required") || 
//           text.includes("invalid token")) {
//         throw new Error("SESSION_EXPIRED");
//       }

//       if (response.status === 401 || response.status === 403) {
//         throw new Error("UNAUTHORIZED");
//       }

//       throw new Error(`Invalid response: ${text.substring(0, 200)}`);
//     }

//     if (response.status === 401 || response.status === 403) {
//       throw new Error("UNAUTHORIZED");
//     }

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || `HTTP ${response.status}`);
//     }

//     return response.json();
//   }

//   async get(url, options = {}) {
//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         ...options,
//         headers: await this.getHeaders(),
//         // credentials: "include",
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       if (error.message === "SESSION_EXPIRED" || error.message === "UNAUTHORIZED") {
//         localStorage.removeItem("authToken");
//         sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
//         throw new Error("Your session has expired. Please login again.");
//       }
//       throw error;
//     }
//   }

//   async post(url, data, contentType = 'application/json') {
//     try {
//       const body = contentType === 'application/json' 
//         ? JSON.stringify(data) 
//         : data;

//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         method: 'POST',
//         headers: await this.getHeaders(contentType),
//         body: body,
//         // credentials: "include",
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       if (error.message === "SESSION_EXPIRED" || error.message === "UNAUTHORIZED") {
//         localStorage.removeItem("authToken");
//         sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
//         throw new Error("Your session has expired. Please login again.");
//       }
//       throw error;
//     }
//   }

//   async put(url, data) {
//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         method: 'PUT',
//         headers: await this.getHeaders(),
//         body: JSON.stringify(data),
//         // credentials: "include",
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       if (error.message === "SESSION_EXPIRED" || error.message === "UNAUTHORIZED") {
//         localStorage.removeItem("authToken");
//         sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
//         throw new Error("Your session has expired. Please login again.");
//       }
//       throw error;
//     }
//   }

//   async delete(url) {
//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         method: 'DELETE',
//         headers: await this.getHeaders(),
//         // credentials: "include",
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       if (error.message === "SESSION_EXPIRED" || error.message === "UNAUTHORIZED") {
//         localStorage.removeItem("authToken");
//         sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
//         throw new Error("Your session has expired. Please login again.");
//       }
//       throw error;
//     }
//   }

//   async uploadFile(url, formData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: formData,
//         // credentials: "include",
//       });

//       return await this.handleResponse(response);
//     } catch (error) {
//       if (error.message === "SESSION_EXPIRED" || error.message === "UNAUTHORIZED") {
//         localStorage.removeItem("authToken");
//         sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
//         throw new Error("Your session has expired. Please login again.");
//       }
//       throw error;
//     }
//   }
// }

// export const apiClient = new ApiClient();

// class ApiClient {
//   constructor() {
//     const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

//     // In production, we always want to use the same host's /api
//     // This prevents hardcoded 'localhost' from .env files from breaking the production build
//     this.baseURL = isProduction
//       ? `${window.location.origin}/api`
//       : (import.meta.env.VITE_URL || `${window.location.origin}/api`);

//     // Remove trailing slash if present to avoid double slashes in requests
//     if (this.baseURL.endsWith('/')) {
//       this.baseURL = this.baseURL.slice(0, -1);
//     }

//     this.csrfToken = null;
//     console.log(`ApiClient initialized with baseURL: ${this.baseURL} (Mode: ${isProduction ? 'Production' : 'Development'})`);
//   }

//   async getHeaders(contentType = 'application/json') {
//     const token = localStorage.getItem("authToken");
//     const headers = {
//       'Accept': 'application/json',
//     };

//     if (contentType) {
//       headers['Content-Type'] = contentType;
//     }

//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     if (this.csrfToken) {
//       headers['X-CSRF-TOKEN'] = this.csrfToken;
//     }

//     return headers;
//   }

//   async handleResponse(response) {
//     // First check if response is okay for non-JSON responses
//     if (!response.ok) {
//       // Try to get error message from response
//       const errorText = await response.text();
//       try {
//         const errorData = JSON.parse(errorText);
//         throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
//       } catch (e) {
//         // If JSON parse fails or specific fields missing, check if we threw the error above
//         if (e.message && e.message !== "Unexpected token" && !e.message.includes("JSON")) {
//           throw e;
//         }
//         // Fallback to text
//         throw new Error(errorText || `HTTP ${response.status}`);
//       }
//     }

//     // Check content type for JSON responses
//     const contentType = response.headers.get("content-type");

//     // If it's a 204 No Content or similar
//     if (response.status === 204 || response.status === 205) {
//       return null;
//     }

//     // If content type is not JSON, handle appropriately
//     if (!contentType || !contentType.includes("application/json")) {
//       const text = await response.text();

//       // Handle common error pages/tokens
//       if (text.includes("session expired") ||
//         text.includes("login required") ||
//         text.includes("invalid token") ||
//         response.status === 401 ||
//         response.status === 403) {
//         throw new Error("UNAUTHORIZED");
//       }

//       // Check if we got an HTML response instead of JSON (common with SPA fallbacks)
//       if (text.trim().startsWith("<!DOCTYPE") || text.includes("<html") || text.includes("<body")) {
//         console.error("API Error: Received HTML instead of JSON from", response.url);
//         throw new Error(`The server returned an HTML page instead of JSON. This often happens when the API path (${new URL(response.url).pathname}) is incorrect or the backend proxy is not configured correctly on the server.`);
//       }

//       // For non-JSON successful responses, return the text
//       return text;
//     }

//     try {
//       return await response.json();
//     } catch (e) {
//       console.error("JSON Parse Error:", e);
//       throw new Error("Failed to parse server response as JSON.");
//     }
//   }

//   async request(method, endpoint, data = null, contentType = 'application/json') {
//     try {
//       const url = `${this.baseURL}${endpoint}`;
//       console.log(`${method} Request to: ${url}`);

//       const options = {
//         method: method,
//         headers: await this.getHeaders(contentType),
//       };

//       if (data) {
//         if (contentType === 'application/json') {
//           options.body = JSON.stringify(data);
//         } else if (contentType === 'multipart/form-data') {
//           // Remove Content-Type header for FormData, browser will set it with boundary
//           delete options.headers['Content-Type'];
//           options.body = data;
//         } else {
//           options.body = data;
//         }
//       }

//       const response = await fetch(url, options);
//       return await this.handleResponse(response);
//     } catch (error) {
//       console.error(`${method} Request failed for ${endpoint}:`, error);

//       if (error.message === "UNAUTHORIZED" || error.message.includes("401") || error.message.includes("403")) {
//         localStorage.removeItem("authToken");
//         sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
//         throw new Error("Your session has expired. Please login again.");
//       }

//       if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
//         throw new Error(`Cannot connect to server. Please check your internet connection and ensure the backend is running at ${this.baseURL}`);
//       }

//       throw error;
//     }
//   }

//   // Convenience methods
//   async get(endpoint, options = {}) {
//     return this.request('GET', endpoint);
//   }

//   async post(endpoint, data, contentType = 'application/json') {
//     return this.request('POST', endpoint, data, contentType);
//   }

//   async put(endpoint, data) {
//     return this.request('PUT', endpoint, data);
//   }

//   async delete(endpoint) {
//     return this.request('DELETE', endpoint);
//   }

//   // Specialized method for file uploads
//   async uploadFile(endpoint, formData) {
//     return this.request('POST', endpoint, formData, 'multipart/form-data');
//   }
// }

// export const apiClient = new ApiClient();


class ApiClient {
  constructor() {
    let envUrl = import.meta.env.VITE_URL;
    if (envUrl) {
      envUrl = envUrl.trim();
      envUrl = envUrl.replace(/^["']|["']$/g, ''); // Remove quotes
      envUrl = envUrl.replace(/\/$/, ''); // Remove trailing slash
    }
    this.baseURL = envUrl || '/api';
    this.csrfToken = null;
  }

  async getHeaders(contentType = 'application/json') {
    const token = localStorage.getItem("authToken");
    const headers = {
      'Accept': 'application/json',
    };

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (this.csrfToken) {
      headers['X-CSRF-TOKEN'] = this.csrfToken;
    }

    return headers;
  }

  async handleResponse(response) {
    // First check if response is okay for non-JSON responses
    if (!response.ok) {
      // Try to get error message from response
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      } catch (e) {
        // If JSON parse fails or specific fields missing, check if we threw the error above
        if (e.message && e.message !== "Unexpected token" && !e.message.includes("JSON")) {
          throw e;
        }
        // Fallback to text
        throw new Error(errorText || `HTTP ${response.status}`);
      }
    }

    // Check content type for JSON responses
    const contentType = response.headers.get("content-type");

    // If it's a 204 No Content or similar
    if (response.status === 204 || response.status === 205) {
      return null;
    }

    // If content type is not JSON, handle appropriately
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();

      // Handle common error pages
      if (text.includes("session expired") ||
        text.includes("login required") ||
        text.includes("invalid token")) {
        throw new Error("UNAUTHORIZED");
      }

      // For non-JSON successful responses, return the text
      return text;
    }

    return response.json();
  }

  async request(method, endpoint, data = null, contentType = 'application/json') {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`${method} Request to: ${url}`);

      const options = {
        method: method,
        headers: await this.getHeaders(contentType),
      };

      if (data) {
        if (contentType === 'application/json') {
          options.body = JSON.stringify(data);
        } else if (contentType === 'multipart/form-data') {
          // Remove Content-Type header for FormData, browser will set it with boundary
          delete options.headers['Content-Type'];
          options.body = data;
        } else {
          options.body = data;
        }
      }

      const response = await fetch(url, options);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`${method} Request failed for ${endpoint}:`, error);

      if (error.message === "UNAUTHORIZED" || error.message.includes("401") || error.message.includes("403")) {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
        throw new Error("Your session has expired. Please login again.");
      }

      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        throw new Error(`Cannot connect to server. Please check your internet connection and ensure the backend is running at ${this.baseURL}`);
      }

      throw error;
    }
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint);
  }

  async post(endpoint, data, contentType = 'application/json') {
    return this.request('POST', endpoint, data, contentType);
  }

  async put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  }

  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }

  // Specialized method for file uploads
  async uploadFile(endpoint, formData) {
    return this.request('POST', endpoint, formData, 'multipart/form-data');
  }
}

export const apiClient = new ApiClient();