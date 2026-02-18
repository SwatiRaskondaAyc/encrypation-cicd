// // components/PatternAnalysis/PatternAnalysis.jsx
// import { useEffect, useState } from 'react';
// // import ResearchChart from '../Patterns/ResearchChart';
// import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
// import ResearchChart from './ResearchChart';

// function PatternAnalysis({ patternData, onRemove }) {
//   const [analysisData, setAnalysisData] = useState(null);

//   useEffect(() => {
//     if (patternData) {
//       // Transform the pattern data for ResearchChart component
//       const transformedData = transformPatternData(patternData);
//       setAnalysisData(transformedData);
//     }
//   }, [patternData]);

//   const transformPatternData = (patternData) => {
//     // Group patterns by fincode (similar to how ResearchChart expects)
//     const groupedData = {};
    
//     patternData.patterns.forEach(pattern => {
//       if (!groupedData[pattern.fincode]) {
//         groupedData[pattern.fincode] = {
//           priceData: pattern.priceData,
//           patterns: []
//         };
//       }
      
//       groupedData[pattern.fincode].patterns.push({
//         date: pattern.date,
//         patternId: pattern.pid,
//         score: pattern.score
//       });
//     });

//     return groupedData;
//   };

//   if (!analysisData) {
//     return (
//       <div className="flex items-center justify-center py-8 text-gray-500">
//         Loading pattern analysis...
//       </div>
//     );
//   }

//   return (
//     <div className="pattern-analysis-container">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//           Pattern Analysis
//         </h3>
//         {onRemove && (
//           <button
//             onClick={onRemove}
//             className="p-1 text-gray-400 hover:text-red-500 transition-colors"
//             title="Remove analysis"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>

//       {Object.entries(analysisData).map(([fincode, { priceData, patterns }]) => (
//         <div key={fincode} className="mb-6">
//           <ResearchChart 
//             fincode={fincode} 
//             priceData={priceData} 
//             patterns={patterns} 
//           />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default PatternAnalysis;


// components/PatternAnalysis/PatternAnalysis.jsx
import { useEffect, useState } from 'react';
import ResearchChart from './ResearchChart';
// import ResearchChart from '../Patterns/ResearchChart';

function PatternAnalysis({ patternData }) {
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    if (patternData) {
      // Handle both direct patternData and nested pattern_data from saved dashboards
      const actualPatternData = patternData.pattern_data || patternData;
      const transformedData = transformPatternData(actualPatternData);
      setAnalysisData(transformedData);
    }
  }, [patternData]);

  const transformPatternData = (patternData) => {
    if (!patternData?.patterns) return {};
    
    const groupedData = {};
    
    patternData.patterns.forEach(pattern => {
      if (!groupedData[pattern.fincode]) {
        groupedData[pattern.fincode] = {
          priceData: pattern.priceData,
          patterns: []
        };
      }
      
      groupedData[pattern.fincode].patterns.push({
        date: pattern.date,
        patternId: pattern.patternId,
        score: pattern.score
      });
    });

    return groupedData;
  };

  if (!analysisData || Object.keys(analysisData).length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        No pattern analysis data available
      </div>
    );
  }

  return (
    <div className="pattern-analysis-container">
      {Object.entries(analysisData).map(([fincode, { priceData, patterns }]) => (
        <div key={fincode} className="mb-6">
          <ResearchChart
            fincode={fincode} 
            priceData={priceData} 
            patterns={patterns} 
          />
        </div>
      ))}
    </div>
  );
}

export default PatternAnalysis;