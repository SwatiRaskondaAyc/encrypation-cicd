import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "chartToolSettings";

/**
 * Hook for managing persistent per-tool default settings
 * Settings are stored in localStorage and survive page refreshes
 */
export function useToolSettings() {
  const [toolSettings, setToolSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toolSettings));
    } catch (e) {
      console.warn("Failed to save tool settings:", e);
    }
  }, [toolSettings]);

  /**
   * Get default settings for a specific tool
   * @param {string} toolId - The tool identifier (e.g., 'line', 'fib', 'rectangle')
   * @param {object} fallback - Fallback defaults if no saved settings exist
   * @returns {object} - The merged settings (saved + fallback)
   */
  const getToolDefaults = useCallback(
    (toolId, fallback = {}) => {
      const saved = toolSettings[toolId] || {};
      return { ...fallback, ...saved };
    },
    [toolSettings],
  );

  /**
   * Update default settings for a specific tool
   * @param {string} toolId - The tool identifier
   * @param {object} settings - The settings to save (will be merged with existing)
   */
  const setToolDefaults = useCallback((toolId, settings) => {
    setToolSettings((prev) => ({
      ...prev,
      [toolId]: { ...(prev[toolId] || {}), ...settings },
    }));
  }, []);

  /**
   * Reset settings for a specific tool to defaults
   * @param {string} toolId - The tool identifier to reset
   */
  const resetToolDefaults = useCallback((toolId) => {
    setToolSettings((prev) => {
      const next = { ...prev };
      delete next[toolId];
      return next;
    });
  }, []);

  /**
   * Reset all tool settings
   */
  const resetAllToolSettings = useCallback(() => {
    setToolSettings({});
  }, []);

  return {
    toolSettings,
    getToolDefaults,
    setToolDefaults,
    resetToolDefaults,
    resetAllToolSettings,
  };
}

export default useToolSettings;
