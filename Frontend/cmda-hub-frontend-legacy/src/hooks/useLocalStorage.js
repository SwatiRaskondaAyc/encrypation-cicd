// // src/hooks/useLocalStorage.js (New: Separate for local ops)
// import { useState, useCallback } from "react";

// const useLocalStorage = () => {
//   const [savedPortfolios, setSavedPortfolios] = useState([]);

//   const getLocalPortfolios = useCallback(() => JSON.parse(localStorage.getItem("savedPortfolios") || "[]"), []);
//   const saveLocalPortfolios = useCallback((list) => localStorage.setItem("savedPortfolios", JSON.stringify(list)), []);

//   return { savedPortfolios, getLocalPortfolios, saveLocalPortfolios, setSavedPortfolios };
// };

// export default useLocalStorage;

// src/hooks/useLocalStorage.js (Updated: Utils only, no internal state)
import { useCallback } from "react";

const useLocalStorage = () => {
  const getLocalPortfolios = useCallback(() => JSON.parse(localStorage.getItem("savedPortfolios") || "[]"), []);
  const saveLocalPortfolios = useCallback((list) => {
    localStorage.setItem("savedPortfolios", JSON.stringify(list));
  }, []);

  return { getLocalPortfolios, saveLocalPortfolios };
};

export default useLocalStorage;