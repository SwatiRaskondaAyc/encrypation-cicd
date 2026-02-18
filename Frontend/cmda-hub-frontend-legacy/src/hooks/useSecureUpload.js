import { useCallback } from "react";
import { portfolioApi } from "../utils/portfolioApi";
import { generatePortfolioId } from "../utils/dateUtils";
import { generateSessionKey } from "../utils/EncryptionService";
import { MAX_PORTFOLIOS_PER_USER } from "../utils/constants";

const useSecureUpload = (
    setPortfolioData,
    setAnalysisData,
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
    const normalizePortfolio = useCallback(async (
        save,
        selectedFile,
        portfolioName,
        selectedBroker,
        overridePortfolioId = null
    ) => {
        if (!selectedFile) return;
        if (!isAuthenticated()) {
            setError("Please login to upload portfolios.");
            return;
        }

        const portfolioId = overridePortfolioId || generatePortfolioId();
        const brokerId = selectedBroker;

        setLoading(true);
        setUploadProgress(0);

        try {
            const { data, sessionKey } = await portfolioApi.uploadSecureNormalize(selectedFile, {
                save: save.toString(),
                portfolioId,
                portfolioName,
                brokerId,
                brokerName: selectedBroker
            });

            if (data) {
                setPortfolioData(data);
                setUploadProgress(100);
                return { success: true, portfolioId, data, sessionKey };
            }
            return { success: false };
        } catch (e) {
            console.error("Normalization error:", e);
            setError(e.message || "Normalization failed.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, [setPortfolioData, setError, setLoading, setUploadProgress, isAuthenticated]);

    const runSecureAnalysis = useCallback(async (normalizedData, sessionKey, portfolioId, save) => {
        setLoading(true);
        try {
            let keyToUse = sessionKey;
            if (!keyToUse) {
                console.log("Generating fresh session key for analysis...");
                keyToUse = await generateSessionKey();
            }
            const analyzeResult = await portfolioApi.analyzeSecurePortfolio(normalizedData, keyToUse);

            if (analyzeResult) {
                const { transactions, analysis } = analyzeResult;
                const finalTransactions = transactions || [];
                const finalAnalysis = analysis || null;

                setPortfolioData(finalTransactions);
                if (setAnalysisData) setAnalysisData(finalAnalysis);

                return { success: true, data: finalTransactions, analysis: finalAnalysis };
            }
            return { success: false };
        } catch (e) {
            console.error("Analysis error:", e);
            setError(e.message || "Analysis failed.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, [setPortfolioData, setAnalysisData, setError, setLoading]);

    return { normalizePortfolio, runSecureAnalysis };
};

export default useSecureUpload;
