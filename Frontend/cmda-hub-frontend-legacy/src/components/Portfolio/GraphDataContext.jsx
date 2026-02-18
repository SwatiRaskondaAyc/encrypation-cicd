import React, { createContext, useContext, useState, useCallback } from "react";

const GraphDataContext = createContext();

export const GraphDataProvider = ({ children }) => {
  const [graphDataCache, setGraphDataCache] = useState({});

  const getGraphData = useCallback((key) => {
    return graphDataCache[key];
  }, [graphDataCache]);

  const setGraphData = useCallback((key, data) => {
    setGraphDataCache((prev) => ({ ...prev, [key]: data }));
  }, []);

  return (
    <GraphDataContext.Provider value={{ getGraphData, setGraphData }}>
      {children}
    </GraphDataContext.Provider>
  );
};

export const useGraphData = () => useContext(GraphDataContext);