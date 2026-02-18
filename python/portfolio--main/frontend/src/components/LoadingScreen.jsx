import React from "react";
import CandleLoader from "./CandleLoader";

const LoadingScreen = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-50/90 backdrop-blur-sm flex items-center justify-center">
      <CandleLoader message="Analyzing Portfolio Logic..." />
    </div>
  );
};

export default LoadingScreen;
