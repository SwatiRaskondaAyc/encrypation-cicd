import { useCallback } from "react";
import { API_BASE_URL, MAX_PORTFOLIOS_PER_USER } from "../components/utils/constants.js";
import { generatePortfolioId } from "../components/utils/dateUtils.js";

const useUpload = (
  setPortfolioData,
  setSavedPortfolios,
  saveLocalPortfolios,
  setError,
  setLoading,
  setUploadProgress,
  setSelectedBroker,
  setBrokerStep,
  setBrokerFile,
  setSelectedFile,
  isAuthenticated,
  setShowSaveModal,
  fetchMyPortfolios
) => {
  const uploadPortfolio = useCallback(async (
    save,
    selectedFile,
    portfolioName,
    selectedBroker,
    savedPortfolios,
    overridePortfolioId = null) => {
    if (!selectedFile) return;

    // Check authentication
    if (!isAuthenticated()) {
      setError("Please login to upload portfolios.");
      return;
    }

    // Check portfolio limit for saving
    if (save && savedPortfolios.length >= MAX_PORTFOLIOS_PER_USER) {
      setError(`Cannot save: Maximum ${MAX_PORTFOLIOS_PER_USER} portfolios allowed per user. Please delete one first.`);
      setShowSaveModal(false);
      return;
    }

    // Use override ID if provided (for Add More Trades), else generate new
    const portfolioId = overridePortfolioId || generatePortfolioId();
    const token = localStorage.getItem("authToken");
    const brokerId = selectedBroker;

    setLoading(true);
    setUploadProgress(0);
    setShowSaveModal(false);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("save", save.toString());
    formData.append("portfolioId", portfolioId);
    formData.append("portfolioName", portfolioName);
    formData.append("brokerId", brokerId);
    formData.append("brokerName", selectedBroker);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // STEP 1: Normalize via /normalized endpoint
      const normalizeRes = await fetch(`${API_BASE_URL}/normalized`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!normalizeRes.ok) {
        if (normalizeRes.status === 401) {
          throw new Error("Session expired. Please login again.");
        } else if (normalizeRes.status === 403) {
          throw new Error("Portfolio limit reached. Please delete a portfolio first.");
        } else if (normalizeRes.status === 400) {
          const errorData = await normalizeRes.json();
          throw new Error(errorData.message || "Invalid file format or data.");
        }
        throw new Error(`Upload failed: ${normalizeRes.status}`);
      }

      const normalizeResult = await normalizeRes.json();
      const transactions = normalizeResult.data; // Assuming normalized transactions are in result.data (array of objects)

      if (!Array.isArray(transactions) || transactions.length === 0) {
        throw new Error("No transactions returned after normalization.");
      }

      // STEP 2: After successful normalization, hit the analyze-json endpoint
      setUploadProgress(0); // Reset progress for analysis step
      const analyzeInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(analyzeInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const analyzeResponse = await fetch(`${API_BASE_URL}/analyze-json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactions), // Send normalized transactions as JSON array
      });

      clearInterval(analyzeInterval);
      setUploadProgress(100);

      if (!analyzeResponse.ok) {
        if (analyzeResponse.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }

        let errorMessage = "Failed to analyze portfolio.";
        try {
          const errorJson = await analyzeResponse.json();
          console.error("Analysis Error Response:", errorJson);
          if (errorJson?.message) {
            errorMessage = errorJson.message;
          } else if (typeof errorJson === 'string') {
            errorMessage = errorJson;
          } else {
            errorMessage = `Server Error: ${JSON.stringify(errorJson)}`;
          }
        } catch (err) {
          const text = await analyzeResponse.text().catch(() => "");
          console.error("Analysis Error Text:", text);
          errorMessage = `Failed to analyze portfolio (${analyzeResponse.status}): ${text || analyzeResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const analyzeResult = await analyzeResponse.json();

      if (analyzeResult) {
        setPortfolioData(analyzeResult); // Set the full analysis response to portfolioData (includes graphs, summary, etc.)

        if (save && normalizeResult.success) {
          if (!overridePortfolioId) {
            const newPortfolio = {
              portfolioId,
              brokerId,
              broker: selectedBroker,
              portfolioName,
              data: analyzeResult, // Save analyzed data instead of just normalized
              createdAt: new Date().toISOString()
            };

            const updated = [...savedPortfolios, newPortfolio];
            setSavedPortfolios(updated);
            saveLocalPortfolios(updated);
          } else {
            // If override (add more), we accept the latency risk to get the merged state from server
            await fetchMyPortfolios();
          }

          setSelectedBroker("");
          setBrokerStep(1);
          setBrokerFile(null);
          setSelectedFile(null);

          // alert(overridePortfolioId ? "Trades added successfully!" : "Portfolio saved successfully!");
          return { success: true, portfolioId, data: analyzeResult };
        }
        return { success: true, portfolioId: null, data: analyzeResult };
      } else {
        setError("Analysis completed but no data returned.");
        return { success: false };
      }
    } catch (e) {
      console.error("Upload/Analysis error:", e);
      setError(e.message || "Upload/Analysis failed. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, [
    setPortfolioData,
    setSavedPortfolios,
    saveLocalPortfolios,
    setError,
    setLoading,
    setUploadProgress,
    setSelectedBroker,
    setBrokerStep,
    setBrokerFile,
    setSelectedFile,
    isAuthenticated,
    setShowSaveModal,
    fetchMyPortfolios
  ]);

  return { uploadPortfolio };
};

export default useUpload;