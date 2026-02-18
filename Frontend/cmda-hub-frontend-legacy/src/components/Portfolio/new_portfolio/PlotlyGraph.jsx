import React from 'react';
import Plot from 'react-plotly.js';

const PlotlyGraph = ({ title, graphData, className = "" }) => {
  // 1. Graceful Handling of Loading/Error States
  if (!graphData) {
    return (
      <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-96 flex items-center justify-center ${className}`}>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Loading chart data...</p>
      </div>
    );
  }

  if (graphData.error) {
    return (
      <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-96 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 font-medium mb-1">Chart Error</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs">{graphData.error}</p>
        </div>
      </div>
    );
  }

  // 2. Extract Plotly Data & Layout
  // The backend returns structure like: { figure: { data: [], layout: {} }, config: {} }
  // OR sometimes direct { scatter_data: [], layout: {} } for older graph functions.
  // Let's normalize it here to support both formats seamlessly.

  let plotData = [];
  let plotLayout = {};
  let plotConfig = { responsive: true, displayModeBar: false };

  if (graphData.figure) {
    // Standard Orchestrator Format
    plotData = graphData.figure.data;
    plotLayout = graphData.figure.layout;
    if (graphData.config) plotConfig = { ...plotConfig, ...graphData.config };
  } else if (graphData.scatter_data) {
    // Older Format (e.g., Portfolio Health)
    plotData = graphData.scatter_data;
    plotLayout = graphData.layout;
  } else if (graphData.data && graphData.layout) {
    // Direct Plotly Object
    plotData = graphData.data;
    plotLayout = graphData.layout;
  }

  const isDarkMode = document.documentElement.classList.contains('dark');
  const fontColor = isDarkMode ? '#94a3b8' : '#4b5563'; // slate-400 vs gray-600

  return (
    <div className={`bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow ${className}`}>
      {title && (
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          {title}
        </h3>
      )}
      <div className="w-full h-80 md:h-96 relative">
        <Plot
          data={plotData}
          layout={{
            ...plotLayout,
            autosize: true,
            margin: { t: 20, r: 20, b: 40, l: 50 }, // Cleaner margins
            font: { family: 'Inter, sans-serif', color: fontColor },
            paper_bgcolor: 'rgba(0,0,0,0)', // Transparent bg
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
              ...plotLayout.xaxis,
              gridcolor: isDarkMode ? '#1e293b' : '#f1f5f9', // slate-800 vs slate-100
              zerolinecolor: isDarkMode ? '#334155' : '#e2e8f0', // slate-700 vs slate-200
              tickfont: { color: fontColor }
            },
            yaxis: {
              ...plotLayout.yaxis,
              gridcolor: isDarkMode ? '#1e293b' : '#f1f5f9',
              zerolinecolor: isDarkMode ? '#334155' : '#e2e8f0',
              tickfont: { color: fontColor }
            }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={plotConfig}
        />
      </div>
    </div>
  );
};

export default PlotlyGraph;
