


import { useEffect, useState } from "react";
import ResearchChart from "./ResearchChart";

// CandlePatternPlot.jsx - Update to handle pattern data
function PriceActionPattern({ symbol, patternData }) {
  // Use patternData if provided, otherwise fetch data normally
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (patternData) {
      // Use the pattern data passed from Patterns page
      setChartData({
        priceData: patternData.priceData,
        patterns: patternData.patterns,
        symbol: patternData.patternInfo.symbol
      });
    } else if (symbol) {
      // Normal data fetching logic for manual additions
      fetchCandlePatternData(symbol);
    }
  }, [symbol, patternData]);

  // Your existing chart rendering logic
  return (
    <div className="price-action-attern">
      {/* Your chart rendering code */}
      {chartData && (
        <ResearchChart 
          fincode={chartData.fincode}
          priceData={chartData.priceData}
          patterns={chartData.patterns}
          symbol={chartData.symbol}
        />
      )}
    </div>
  );
}