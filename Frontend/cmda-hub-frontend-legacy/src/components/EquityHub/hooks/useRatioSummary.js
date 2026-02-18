import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

const coerceArray = (value) => (Array.isArray(value) ? value : []);

const pickLatest = (rows) => {
  if (!rows || rows.length === 0) return null;
  return rows.reduce((latest, row) => {
    const latestDate = latest?.Year_end ? new Date(latest.Year_end) : null;
    const rowDate = row?.Year_end ? new Date(row.Year_end) : null;
    if (!latestDate || (rowDate && rowDate > latestDate)) return row;
    return latest;
  }, rows[0]);
};

export const useRatioSummary = (symbol, defaultMode = "consolidated") => {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;
    const controller = new AbortController();

    const fetchRatios = async () => {
      try {
        setLoading(true);
        setError(null);
        const primaryEndpoint =
          defaultMode === "consolidated"
            ? `${API_BASE}/consolidate/financial_ratios/${symbol}`
            : `${API_BASE}/financial/financial_ratios/${symbol}`;
        const fallbackEndpoint =
          defaultMode === "consolidated"
            ? `${API_BASE}/financial/financial_ratios/${symbol}`
            : `${API_BASE}/consolidate/financial_ratios/${symbol}`;

        const primaryRes = await fetch(primaryEndpoint, {
          signal: controller.signal,
        });
        const primaryJson = primaryRes.ok ? await primaryRes.json() : [];
        const primaryRows = coerceArray(primaryJson);

        if (primaryRows.length > 0) {
          setData(pickLatest(primaryRows));
          setMode(defaultMode);
          return;
        }

        const fallbackRes = await fetch(fallbackEndpoint, {
          signal: controller.signal,
        });
        const fallbackJson = fallbackRes.ok ? await fallbackRes.json() : [];
        const fallbackRows = coerceArray(fallbackJson);

        setData(pickLatest(fallbackRows));
        setMode(defaultMode === "consolidated" ? "standalone" : "consolidated");
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Financial ratios error:", err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRatios();
    return () => controller.abort();
  }, [symbol, defaultMode]);

  return { data, mode, loading, error };
};

