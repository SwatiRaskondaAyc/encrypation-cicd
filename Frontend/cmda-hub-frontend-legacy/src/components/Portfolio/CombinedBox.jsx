


import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { FaInfoCircle, FaChartBar, FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';
import { HashLoader } from 'react-spinners';

export default function CombinedBoxPlot() {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(null);
  const uploadId = localStorage.getItem("uploadId");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/file/combined_box_plot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ uploadId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API error ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setChartData(data);
      })
      .catch(err => {
        console.error('Failed to load combined-box-data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={40} />
        <p className="mt-3 text-sky-700 dark:text-white font-semibold text-sm animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="w-full max-w-4xl mx-auto p-2 font-sans rounded-xl overflow-hidden">
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <FaInfoCircle className="text-2xl text-gray-400 mb-2" />
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">Data Unavailable</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xs text-xs text-center">
            Could not load financial data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const {
    deployed_amounts,
    deployed_metrics: { min, max, mean, median },
    turnover_by_month,
    turnover_stats: { months, avg, median: medians },
  } = chartData;

  const colors = {
    deployed: '#4361ee',
    turnover: '#10b981',
    min: '#ef4444',
    max: '#3b82f6',
    mean: '#f59e0b',
    median: '#8b5cf6',
    avgLine: '#ef4444',
    medianLine: '#8b5cf6'
  };

  const allYValues = turnover_by_month
    .flatMap(tb => tb.values)
    .filter(v => typeof v === 'number');
  const maxY = Math.max(...allYValues);

  const deployedTraces = [
    {
      type: 'box',
      x: deployed_amounts,
      orientation: 'h',
      name: 'Deployed Amount',
      boxmean: true,
      marker: { color: colors.deployed, opacity: 0.7 },
      line: { color: colors.deployed, width: 1.5 },
      fillcolor: 'rgba(67, 97, 238, 0.2)',
      hoverinfo: 'y+name',
    },
    {
      x: [min],
      y: ['Deployed Amount'],
      mode: 'markers+text',
      name: 'Min',
      text: [`₹${min.toLocaleString('en-IN')}`],
      textposition: 'auto',
      marker: { size: 8, color: colors.min },
      hoverinfo: 'text+name',
      textfont: { size: 8, color: colors.min }
    },
    {
      x: [max],
      y: ['Deployed Amount'],
      mode: 'markers+text',
      name: 'Max',
      text: [`₹${max.toLocaleString('en-IN')}`],
      textposition: 'auto',
      marker: { size: 8, color: colors.max },
      hoverinfo: 'text+name',
      textfont: { size: 8, color: colors.max }
    },
    {
      x: [mean],
      y: ['Deployed Amount'],
      mode: 'markers+text',
      name: 'Mean',
      text: [`₹${mean.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`],
      textposition: 'auto',
      marker: { size: 8, color: colors.mean },
      hoverinfo: 'text+name',
      textfont: { size: 8, color: colors.mean }
    },
    {
      x: [median],
      y: ['Deployed Amount'],
      mode: 'markers+text',
      name: 'Median',
      text: [`₹${median.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`],
      textposition: 'auto',
      marker: { size: 8, color: colors.median },
      hoverinfo: 'text+name',
      textfont: { size: 8, color: colors.median }
    },
  ];

  const turnoverTraces = [
    ...turnover_by_month.map((tb, index) => ({
      type: 'box',
      y: tb.values,
      x: Array(tb.values.length).fill(tb.month),
      name: tb.month,
      showlegend: false,
      marker: { color: colors.turnover, opacity: 0.5 },
      line: { color: colors.turnover, width: 1.5 },
      fillcolor: 'rgba(16, 185, 129, 0.2)',
      hoverinfo: 'y+name',
    })),
    {
      x: months,
      y: avg,
      mode: 'lines+markers',
      name: 'Avg Turnover',
      line: { color: colors.avgLine, width: 1.5, dash: 'solid' },
      marker: { size: 8, color: colors.avgLine },
      hoverinfo: 'text+name',
      hoverlabel: { namelength: -1 },
      text: avg.map(v => `Avg: ₹${v.toLocaleString('en-IN')}`)
    },
    {
      x: months,
      y: medians,
      mode: 'lines+markers',
      name: 'Median Turnover',
      line: { color: colors.medianLine, width: 1.5 },
      marker: { size: 4, color: colors.medianLine, symbol: 'diamond' },
      hoverinfo: 'text+name',
      hoverlabel: { namelength: -1 },
      text: medians.map(v => `Median: ₹${v.toLocaleString('en-IN')}`)
    },
  ];

  return (
    <div className="w-full max-w-8xl mx-auto p-2 font-sans rounded-xl overflow-hidden">
      <div className="relative bg-white/85 dark:bg-gray-800/85 rounded-xl shadow-md border border-gray-100/60 dark:border-gray-700/60 backdrop-blur-sm">
        <div className="p-2 bg-gradient-to-r from-gray-50/70 to-gray-100/70 dark:from-gray-700/70 dark:to-gray-800/70 border-b border-gray-200/50 dark:border-gray-600/50 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg text-white text-xs shadow-md flex items-center justify-center">
              <FaChartBar />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Financial Distribution Analysis</h2>
              <p className="text-[10px] text-gray-600 dark:text-gray-400">Deployed capital distribution and monthly turnover trends</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 m-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-lg p-2 shadow-sm border border-transparent hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs shadow-md flex items-center justify-center">
                <FaMoneyBillWave />
              </div>
              <div className="flex-1 relative">
                <div className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold uppercase">
                  Avg Turnover Amount
                  <div
                    className="absolute bottom-0 right-0 text-[10px] text-gray-500 dark:text-gray-400 cursor-pointer"
                    onMouseEnter={() => setShowTooltip('avg-turnover')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <FaInfoCircle />
                    {showTooltip === 'avg-turnover' && (
                      <div className="absolute bottom-full right-0 mb-1 bg-gray-800 text-white p-1.5 rounded-md w-32 sm:w-40 text-[9px] sm:text-[10px] font-sans shadow-lg z-50">
                        Average capital deployed across portfolio.
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  ₹{mean.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-lg p-2 shadow-sm border border-transparent hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 text-white text-xs shadow-md flex items-center justify-center">
                <FaExchangeAlt />
              </div>
              <div className="flex-1 relative">
                <div className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold uppercase">
                  Avg Monthly Turnover
                  <div
                    className="absolute bottom-0 right-0 text-[10px] text-gray-500 dark:text-gray-400 cursor-pointer"
                    onMouseEnter={() => setShowTooltip('avg-monthly-turnover')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <FaInfoCircle />
                    {showTooltip === 'avg-monthly-turnover' && (
                      <div className="absolute bottom-full right-0 mb-1 bg-gray-800 text-white p-1.5 rounded-md w-32 sm:w-40 text-[9px] sm:text-[10px] font-sans shadow-lg z-50">
                        Average monthly trading turnover.
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  ₹{(avg.reduce((a, b) => a + b, 0) / avg.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50 rounded-lg p-2 shadow-sm border border-transparent hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 text-white text-xs shadow-md flex items-center justify-center">
                <FaChartBar />
              </div>
              <div className="flex-1 relative">
                <div className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold uppercase">
                  Capital Growth
                  <div
                    className="absolute bottom-0 right-0 text-[10px] text-gray-500 dark:text-gray-400 cursor-pointer"
                    onMouseEnter={() => setShowTooltip('capital-growth')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <FaInfoCircle />
                    {showTooltip === 'capital-growth' && (
                      <div className="absolute bottom-full right-0 mb-1 bg-gray-800 text-white p-1.5 rounded-md w-32 sm:w-40 text-[9px] sm:text-[10px] font-sans shadow-lg z-50">
                        Growth from min to max capital.
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  +{(((max - min) / min) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg p-2 shadow-sm border border-transparent hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 text-white text-xs shadow-md flex items-center justify-center">
                <FaInfoCircle />
              </div>
              <div className="flex-1 relative">
                <div className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold uppercase">
                  Turnover Stability
                  <div
                    className="absolute bottom-0 right-0 text-[10px] text-gray-500 dark:text-gray-400 cursor-pointer"
                    onMouseEnter={() => setShowTooltip('turnover-stability')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <FaInfoCircle />
                    {showTooltip === 'turnover-stability' && (
                      <div className="absolute bottom-full right-0 mb-1 bg-gray-800 text-white p-1.5 rounded-md w-32 sm:w-40 text-[9px] sm:text-[10px] font-sans shadow-lg z-50">
                        Stability based on min/max medians.
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {((Math.min(...medians) / Math.max(...medians)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[70vh] sm:h-[60vh] max-h-[500px] overflow-hidden">
          <Plot
            data={[...deployedTraces.map(t => ({ ...t, xaxis: 'x1', yaxis: 'y1' })),
                   ...turnoverTraces.map(t => ({ ...t, xaxis: 'x2', yaxis: 'y2' }))]}
            layout={{
              grid: {
                rows: 2,
                columns: 1,
                roworder: 'top to bottom',
                rowheights: [0.3, 0.7],
                pattern: 'independent'
              },
              autosize: true,
              xaxis1: {
                title: { text: 'Deployed Amount (₹)', font: { size: 10 } },
                gridcolor: '#e2e8f0',
                zeroline: false,
                showline: true,
                linecolor: '#e2e8f0',
                tickfont: { size: 9 },
                titlefont: { size: 10, color: '#4b5563' }
              },
              yaxis1: {
                title: '',
                gridcolor: '#e2e8f0',
                showline: false,
                tickfont: { size: 9 },
                domain: [0.72, 1]
              },
              xaxis2: {
                title: { text: 'Month', font: { size: 10 } },
                gridcolor: '#e2e8f0',
                zeroline: false,
                showline: true,
                linecolor: '#e2e8f0',
                tickfont: { size: 9 },
                titlefont: { size: 12, color: '#4b5563' },
                type: 'date',
                tickformat: '%b %Y',
                dtick: 'M1',
                tickangle: 45
              },
              yaxis2: {
                title: { text: 'Turnover (₹)', font: { size: 10 } },
                gridcolor: '#e2e8f0',
                zeroline: false,
                showline: true,
                linecolor: '#e2e8f0',
                tickfont: { size: 9 },
                titlefont: { size: 12, color: '#4b5563' },
                range: [0, maxY * 1.1],
                tick0: 0,
                dtick: Math.ceil(maxY / 5),
                tickformat: ',.0f',
                domain: [0, 0.65]
              },
              plot_bgcolor: 'rgba(0,0,0,0)',
              paper_bgcolor: 'rgba(0,0,0,0)',
              margin: { t: 30, b: 50, l: 40, r: 40 },
              hovermode: 'closest',
              hoverlabel: {
                bgcolor: 'white',
                bordercolor: '#e2e8f0',
                font: { family: 'Inter', size: 12, color: '#1e293b' },
                borderRadius: 6,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                padding: '6px 8px',
                whiteSpace: 'normal',
                maxWidth: 200,
                minWidth: 120,
                lineHeight: 1.3,
                fontWeight: 500
              },
              legend: {
                orientation: 'h',
                x: 0.5,
                y: 1.1,
                xanchor: 'center',
                font: { size: 8 },
                bgcolor: 'rgba(255,255,255,0.7)',
                bordercolor: '#e2e8f0',
                borderwidth: 1
              },
              annotations: [
                {
                  x: 0.5,
                  y: 1.12,
                  xref: 'paper',
                  yref: 'paper',
                  text: 'Deployed Capital',
                  showarrow: false,
                  font: { size: 12, color: '#1f2937', family: 'Inter' },
                  xanchor: 'center'
                },
                {
                  x: 0.5,
                  y: 0.68,
                  xref: 'paper',
                  yref: 'paper',
                  text: 'Monthly Turnover',
                  showarrow: false,
                  font: { size: 10, color: '#1f2937', family: 'Inter' },
                  xanchor: 'center'
                }
              ]
            }}
            config={{
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: [
                'zoom', 'pan', 'select', 'lasso',
                'zoomIn', 'zoomOut', 'autoScale',
                'hoverClosestCartesian', 'hoverCompareCartesian'
              ],
              toImageButtonOptions: {
                format: 'png',
                filename: 'financial-distribution-analysis',
                height: 300,
                width: 800,
                scale: 2
              },
              responsive: true
            }}
            useResizeHandler={true}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}