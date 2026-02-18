// // components/PatternAnalysis/PatternAnalysisRegistry.js
// // import PatternAnalysis from './PatternAnalysis';

import PatternAnalysis from "../CandlePatternComponent/PatternAnalysis";

// import PatternAnalysis from "../CandlePatternComponent/PatternAnalysis";

// export const patternAnalysisMap = {
//   "PatternAnalysis": PatternAnalysis,
//   // You can add more pattern analysis components here
// };

// export const createPatternAnalysisItem = (patternData, uniqueId) => ({
//   label: 'PatternAnalysis',
//   graphType: 'PatternAnalysis',
//   id: uniqueId,
//   type: 'pattern-analysis', // New type to distinguish from equity/portfolio
//   sortableId: uniqueId,
//   patternData: patternData
// });



// import PatternAnalysis from './PatternAnalysis';

// ✅ Export the pattern analysis map
export const patternAnalysisMap = {
  "PatternAnalysis": PatternAnalysis,
  // You can add more pattern analysis components here in the future
};

// ✅ Export the creation function
export const createPatternAnalysisItem = (patternData, uniqueId) => ({
  label: 'PatternAnalysis',
  graphType: 'PatternAnalysis',
  id: uniqueId,
  type: 'pattern-analysis',
  sortableId: uniqueId,
  patternData: patternData,
  // Add symbol and companyName for display purposes
  symbol: patternData.patterns?.[0]?.symbol || 'Multiple',
  companyName: patternData.patterns?.[0]?.companyName || 'Pattern Analysis'
});

// ✅ Optional: Export a helper to check if component is pattern analysis
export const isPatternAnalysis = (type) => type === 'pattern-analysis';