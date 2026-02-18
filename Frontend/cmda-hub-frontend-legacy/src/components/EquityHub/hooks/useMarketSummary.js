import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

export const useMarketSummary = (symbol, companyName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;
    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/stocks/test/generate_values`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbol: symbol.toUpperCase(),
            companyName: companyName || symbol,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch market data`);
        }

        const result = await response.json();
        if (!result?.raw?.mkt_summary) {
          throw new Error("Invalid market data structure");
        }
        setData(result);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Market summary error:", err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();

    return () => controller.abort();
  }, [symbol, companyName]);

  return { data, loading, error };
};
