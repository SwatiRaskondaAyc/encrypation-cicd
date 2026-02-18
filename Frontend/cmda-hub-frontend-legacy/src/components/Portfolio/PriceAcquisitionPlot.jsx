// import React, { useEffect, useState } from 'react';
// import Plot from 'react-plotly.js';

// export default function PriceAcquisitionPlot() {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // fetch raw data once
//   useEffect(() => {
//     fetch(`${API_BASE}/file/get_price_aqcuisition_plot`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({ uploadId }),
//     })
//       .then(res => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then(json => setData(json.data))
//       .catch(err => setError(err.toString()));
//   }, []);

//   if (error) {
//     return <div style={{ color:'red' }}>Error: {error}</div>;
//   }
//   if (!data) {
//     return <div>Loading...</div>;
//   }

//   // 1. sort by Invested_Amount descending
//   const sorted = [...data].sort((a, b) =>
//     b.Invested_Amount - a.Invested_Amount
//   );

//   // 2. compute Remaining_Principal & Final_Unrealized_PnL
//   const symbols = sorted.map(d => d.Symbol);
//   const invested = sorted.map(d => d.Invested_Amount);
//   const recovered = sorted.map(d => d.Principal_Recovered);
//   const unreal = sorted.map(d => d.Unrealized_PnL);

//   const remaining = invested.map((inv, i) =>
//     Math.max(inv - recovered[i], 0)
//   );
//   const finalUnreal = unreal.map((u, i) => u + remaining[i]);

//   // 3. prepare traces
//   const traces = [
//     {
//       type: 'bar',
//       x: symbols,
//       y: invested,
//       name: 'Total Invested',
//       marker: { color: 'lightgray' },
//       opacity: 0.4
//     },
//     {
//       type: 'bar',
//       x: symbols,
//       y: recovered,
//       name: 'Principal Recovered',
//       marker: { color: 'green' }
//     },
//     {
//       type: 'bar',
//       x: symbols,
//       y: finalUnreal,
//       name: 'Final Unrealized PnL (Unrealized + Remaining Principal)',
//       marker: { color: 'orange' }
//     }
//   ];

//   // 4. layout entirely in React
//   const layout = {
//     barmode: 'overlay',
//     title: '📊 Principal Recovery vs Unrealized PnL per Stock',
//     xaxis: { title: 'Stock Symbol' },
//     yaxis: { title: 'Amount (INR)' },
//     legend: { orientation: 'h', yanchor: 'bottom', y:1.02, xanchor: 'right', x:1 },
//     height: 600,
//     width: '98vw',
//     hovermode: 'x unified',
//     template: 'plotly_white'
//   };

//   return (
//     <Plot
//       data={traces}
//       layout={layout}
//       useResizeHandler={true}
//       style={{ width:'100%', height:'600px' }}
//       config={{ responsive: true }}
//     />
//   );
// }

import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { FaChartLine, FaInfoCircle, FaCoins, FaExchangeAlt, FaPercentage, 
         FaArrowUp, FaArrowDown, FaIndustry, FaCrown, FaRocket, 
         FaBalanceScale, FaChevronDown, FaChevronUp, FaExpand } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PriceAcquisitionPlot = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_URL;
  const uploadId = localStorage.getItem("uploadId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/file/get_price_acquisition_plot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ uploadId }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        // Validate data structure
        if (!json.data || !json.overall_metrics) {
          throw new Error("Invalid data structure: missing data or overall_metrics");
        }
        setDashboardData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE, uploadId]);

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dashboardData) return null;

  // Extract data for the bar chart
  const sorted = [...dashboardData.data].sort((a, b) => b.Invested_Amount - a.Invested_Amount);
  const nivoData = sorted.map(d => ({
    Symbol: d.Symbol,
    Invested: d.Invested_Amount,
    Recovered: d.Principal_Recovered,
    FinalUnreal: d.Unrealized_PnL + Math.max(d.Invested_Amount - d.Principal_Recovered, 0),
  }));

  // Destructure dashboard data with fallback
  const { 
    overall_metrics = {}, 
    kpi_trends = {}, 
    sector_allocation = [], 
    mcap_allocation = [], 
    top_holdings = [], 
    top_performers = [] 
  } = dashboardData;

  // Format numbers for display
  const formatCurrency = (value) => {
    if (!Number.isFinite(value)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="compact-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Portfolio Performance</h1>
        <div className="header-actions">
          <button className="export-btn">Export</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Column - Main Chart */}
        <div className="main-chart-container">
          <div className="chart-header">
            <h2>Principal Recovery Analysis</h2>
            <button 
              className="expand-btn"
              onClick={() => openModal(
                <div className="modal-chart-container">
                  <h3>Principal Recovery Analysis (Expanded View)</h3>
                  <div className="chart-wrapper">
                    <ResponsiveBar
                      data={nivoData}
                      keys={['Invested', 'Recovered', 'FinalUnreal']}
                      indexBy="Symbol"
                      margin={{ top: 40, right: 150, bottom: 100, left: 90 }}
                      padding={0.4}
                      groupMode="stacked"
                      layout="vertical"
                      colors={({ id }) => {
                        if (id === 'Invested') return 'url(#investedGradient)';
                        if (id === 'Recovered') return 'url(#recoveredGradient)';
                        return 'url(#unrealizedGradient)';
                      }}
                      borderColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickRotation: -45,
                        renderTick: tick => (
                          <g transform={`translate(${tick.x},${tick.y})`}>
                            <text
                              textAnchor="end"
                              dominantBaseline="middle"
                              transform="rotate(-45)"
                              style={{
                                fontSize: 12,
                                fill: '#4a5568',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600
                              }}
                            >
                              {tick.value}
                            </text>
                          </g>
                        )
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        format: v => `₹${Number(v/100000).toFixed(1)}L`,
                        renderTick: tick => (
                          <g transform={`translate(${tick.x},${tick.y})`}>
                            <text
                              textAnchor="end"
                              dominantBaseline="middle"
                              style={{
                                fontSize: 12,
                                fill: '#4a5568',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600
                              }}
                            >
                              ₹{(tick.value/100000).toFixed(1)}L
                            </text>
                          </g>
                        )
                      }}
                      enableLabel={false}
                      tooltip={({ id, value, indexValue }) => (
                        <div className="premium-tooltip">
                          <div className="tooltip-header">{indexValue}</div>
                          <div className="tooltip-value">{formatCurrency(value)}</div>
                          <div className="tooltip-metric">
                            {id === 'FinalUnreal'
                              ? 'Final Unrealized PnL'
                              : id === 'Recovered'
                              ? 'Principal Recovered'
                              : 'Total Invested'}
                          </div>
                        </div>
                      )}
                      legends={[
                        {
                          dataFrom: 'keys',
                          anchor: 'bottom-right',
                          direction: 'column',
                          translateX: 120,
                          translateY: 0,
                          itemWidth: 100,
                          itemHeight: 24,
                          itemsSpacing: 4,
                          symbolSize: 16,
                          symbolShape: 'circle',
                          itemTextColor: '#2d3748',
                          effects: [
                            {
                              on: 'hover',
                              style: {
                                itemTextColor: '#4f6cff',
                              }
                            }
                          ]
                        }
                      ]}
                      role="application"
                      ariaLabel="Principal Recovery vs Unrealized PnL per Stock"
                      animate={true}
                      motionConfig="gentle"
                    />
                  </div>
                </div>
              )}
            >
              <FaExpand />
            </button>
          </div>
          
          <div className="chart-wrapper">
            <ResponsiveBar
              data={nivoData}
              keys={['Invested', 'Recovered', 'FinalUnreal']}
              indexBy="Symbol"
              margin={{ top: 20, right: 0, bottom: 40, left: 60 }}
              padding={0.3}
              groupMode="stacked"
              layout="vertical"
              colors={({ id }) => {
                if (id === 'Invested') return 'url(#investedGradient)';
                if (id === 'Recovered') return 'url(#recoveredGradient)';
                return 'url(#unrealizedGradient)';
              }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickRotation: -45,
                renderTick: tick => (
                  <g transform={`translate(${tick.x},${tick.y})`}>
                    <text
                      textAnchor="end"
                      dominantBaseline="middle"
                      transform="rotate(-45)"
                      style={{
                        fontSize: 10,
                        fill: '#4a5568',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600
                      }}
                    >
                      {tick.value}
                    </text>
                  </g>
                )
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                format: v => `₹${Number(v/100000).toFixed(1)}L`,
                renderTick: tick => (
                  <g transform={`translate(${tick.x},${tick.y})`}>
                    <text
                      textAnchor="end"
                      dominantBaseline="middle"
                      style={{
                        fontSize: 10,
                        fill: '#4a5568',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600
                      }}
                    >
                      ₹{(tick.value/100000).toFixed(1)}L
                    </text>
                  </g>
                )
              }}
              enableLabel={false}
              tooltip={({ id, value, indexValue }) => (
                <div className="compact-tooltip">
                  <div className="tooltip-header">{indexValue}</div>
                  <div className="tooltip-value">{formatCurrency(value)}</div>
                  <div className="tooltip-metric">
                    {id === 'FinalUnreal'
                      ? 'Final Unrealized PnL'
                      : id === 'Recovered'
                      ? 'Principal Recovered'
                      : 'Total Invested'}
                  </div>
                </div>
              )}
              role="application"
              ariaLabel="Principal Recovery vs Unrealized PnL per Stock"
              animate={true}
              motionConfig="gentle"
            />
            
            <svg width="0" height="0">
              <defs>
                <linearGradient id="investedGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a0aec0" />
                  <stop offset="100%" stopColor="#718096" />
                </linearGradient>
                <linearGradient id="recoveredGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0fa968" />
                  <stop offset="100%" stopColor="#0d9a5c" />
                </linearGradient>
                <linearGradient id="unrealizedGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f6ad55" />
                  <stop offset="100%" stopColor="#ed8936" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right Column - Compact Widgets */}
        <div className="widgets-column">
          {/* KPI Cards */}
          <div className="compact-kpis">
            <div className="kpi-card">
              <div className="kpi-icon">
                <FaCoins />
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{formatCurrency(overall_metrics.total_invested || 0)}</div>
                <div className="kpi-title">Invested</div>
              </div>
              <div className="kpi-info">
                <FaInfoCircle className="info-icon" />
                <div className="kpi-tooltip">
                  Total amount invested across all holdings, including purchase costs and fees.
                </div>
              </div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-icon">
                <FaExchangeAlt />
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{formatCurrency(overall_metrics.total_recovered || 0)}</div>
                <div className="kpi-title">Recovered</div>
              </div>
              <div className="kpi-info">
                <FaInfoCircle className="info-icon" />
                <div className="kpi-tooltip">
                  Principal amount recovered from sell transactions, based on cost basis.
                </div>
              </div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-icon">
                <FaPercentage />
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{(overall_metrics.recovery_rate || 0).toFixed(1)}%</div>
                <div className="kpi-title">Recovery</div>
              </div>
              <div className="kpi-info">
                <FaInfoCircle className="info-icon" />
                <div className="kpi-tooltip">
                  Percentage of invested capital recovered through sell transactions.
                </div>
              </div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-icon">
                <FaChartLine />
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{formatCurrency(overall_metrics.current_portfolio_value || 0)}</div>
                <div className="kpi-title">Value</div>
              </div>
              <div className="kpi-info">
                <FaInfoCircle className="info-icon" />
                <div className="kpi-tooltip">
                  Current market value of all holdings based on latest prices.
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="collapsible-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('performance')}
            >
              <h3>Performance Metrics</h3>
              {expandedSection === 'performance' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <AnimatePresence>
              {expandedSection === 'performance' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="section-content"
                >
                  <div className="metric-row">
                    <span>Total Return:</span>
                    <span className={(overall_metrics.return_percentage || 0) >= 0 ? 'positive' : 'negative'}>
                      {(overall_metrics.return_percentage || 0) >= 0 ? '+' : ''}
                      {(overall_metrics.return_percentage || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="metric-row">
                    <span>Realized PnL:</span>
                    <span>{formatCurrency(overall_metrics.total_realized_pnl || 0)}</span>
                  </div>
                  <div className="metric-row">
                    <span>Unrealized PnL:</span>
                    <span>{formatCurrency(overall_metrics.total_unrealized_pnl || 0)}</span>
                  </div>
                  <button 
                    className="view-more-btn"
                    onClick={() => openModal(
                      <div className="modal-performance">
                        <h3>Detailed Performance Metrics</h3>
                        <div className="performance-grid">
                          <div className="performance-metric">
                            <div className="metric-label">Total Return</div>
                            <div className={`metric-value ${(overall_metrics.return_percentage || 0) >= 0 ? 'positive' : 'negative'}`}>
                              {(overall_metrics.return_percentage || 0) >= 0 ? '+' : ''}
                              {(overall_metrics.return_percentage || 0).toFixed(1)}%
                            </div>
                          </div>
                          <div className="performance-metric">
                            <div className="metric-label">Total Realized PnL</div>
                            <div className="metric-value">{formatCurrency(overall_metrics.total_realized_pnl || 0)}</div>
                          </div>
                          <div className="performance-metric">
                            <div className="metric-label">Total Unrealized PnL</div>
                            <div className="metric-value">{formatCurrency(overall_metrics.total_unrealized_pnl || 0)}</div>
                          </div>
                          <div className="performance-metric">
                            <div className="metric-label">Recovery Rate</div>
                            <div className="metric-value">{(overall_metrics.recovery_rate || 0).toFixed(1)}%</div>
                          </div>
                          <div className="performance-metric">
                            <div className="metric-label">Portfolio Volatility</div>
                            <div className="metric-value">{overall_metrics.portfolio_volatility || 'Medium'}</div>
                          </div>
                          <div className="performance-metric">
                            <div className="metric-label">Max Drawdown</div>
                            <div className="metric-value">{Number.isFinite(overall_metrics.max_drawdown) ? `${(overall_metrics.max_drawdown || 0).toFixed(1)}%` : '0.0%'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  >
                    View All Metrics
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="collapsible-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('sectors')}
            >
              <h3><FaIndustry /> Sector Allocation</h3>
              {expandedSection === 'sectors' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <AnimatePresence>
              {expandedSection === 'sectors' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="section-content"
                >
                  {sector_allocation.length ? (
                    sector_allocation.slice(0, 3).map((sector, index) => (
                      <div key={index} className="sector-row">
                        <span>{sector.Sector || 'Unknown'}</span>
                        <span>{(sector.percentage || 0).toFixed(1)}%</span>
                      </div>
                    ))
                  ) : (
                    <div className="sector-row">
                      <span>No sector data available</span>
                    </div>
                  )}
                  {sector_allocation.length > 3 && (
                    <button 
                      className="view-more-btn"
                      onClick={() => openModal(
                        <div className="modal-sectors">
                          <h3>Sector Allocation Details</h3>
                          <div className="sectors-grid">
                            {sector_allocation.map((sector, index) => (
                              <div key={index} className="sector-item">
                                <div className="sector-name">{sector.Sector || 'Unknown'}</div>
                                <div className="sector-bar">
                                  <div 
                                    className="bar-fill" 
                                    style={{ width: `${sector.percentage || 0}%` }}
                                  ></div>
                                </div>
                                <div className="sector-value">{(sector.percentage || 0).toFixed(1)}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    >
                      View All Sectors
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="collapsible-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('holdings')}
            >
              <h3><FaCrown /> Top Holdings</h3>
              {expandedSection === 'holdings' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <AnimatePresence>
              {expandedSection === 'holdings' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="section-content"
                >
                  {top_holdings.length ? (
                    top_holdings.slice(0, 3).map((holding, index) => (
                      <div key={index} className="holding-row">
                        <span>{holding.Symbol || 'Unknown'}</span>
                        <span>{formatCurrency(holding.Current_Holdings_Value || 0)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="holding-row">
                      <span>No holdings data available</span>
                    </div>
                  )}
                  {top_holdings.length > 3 && (
                    <button 
                      className="view-more-btn"
                      onClick={() => openModal(
                        <div className="modal-holdings">
                          <h3>Top Holdings Details</h3>
                          <div className="holdings-grid">
                            {top_holdings.map((holding, index) => (
                              <div key={index} className="holding-item">
                                <div className="holding-symbol">{holding.Symbol || 'Unknown'}</div>
                                <div className="holding-name">{holding.Scrip_Name || 'N/A'}</div>
                                <div className="holding-value">{formatCurrency(holding.Current_Holdings_Value || 0)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    >
                      View All Holdings
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="collapsible-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('performers')}
            >
              <h3><FaRocket /> Top Performers</h3>
              {expandedSection === 'performers' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <AnimatePresence>
              {expandedSection === 'performers' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="section-content"
                >
                  {top_performers.length ? (
                    top_performers.slice(0, 3).map((performer, index) => (
                      <div key={index} className="performer-row">
                        <span>{performer.Symbol || 'Unknown'}</span>
                        <span className={(performer.Performance || 0) >= 0 ? 'positive' : 'negative'}>
                          {(performer.Performance || 0) >= 0 ? '+' : ''}{(performer.Performance || 0).toFixed(1)}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="performer-row">
                      <span>No performers data available</span>
                    </div>
                  )}
                  {top_performers.length > 3 && (
                    <button 
                      className="view-more-btn"
                      onClick={() => openModal(
                        <div className="modal-performers">
                          <h3>Top Performers Details</h3>
                          <div className="performers-grid">
                            {top_performers.map((performer, index) => (
                              <div key={index} className="performer-item">
                                <div className="performer-symbol">{performer.Symbol || 'Unknown'}</div>
                                <div className="performer-name">{performer.Scrip_Name || 'N/A'}</div>
                                <div className={`performer-value ${(performer.Performance || 0) >= 0 ? 'positive' : 'negative'}`}>
                                  {(performer.Performance || 0) >= 0 ? '+' : ''}{(performer.Performance || 0).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    >
                      View All Performers
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal" onClick={closeModal}>×</button>
              {modalContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .compact-dashboard {
          width: 98vw;
          height: 90vh;
          margin: 0 auto;
          padding: 15px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(145deg, #f8fbff 0%, #f0f7ff 100%);
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding: 0 10px;
        }
        
        .dashboard-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .export-btn {
          background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(67, 97, 238, 0.3);
          transition: all 0.2s ease;
        }
        
        .export-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(67, 97, 238, 0.4);
        }
        
        .dashboard-content {
          display: flex;
          flex: 1;
          gap: 15px;
          overflow: hidden;
        }
        
        .main-chart-container {
          flex: 3;
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.4);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .chart-header {
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(226, 232, 240, 0.4);
        }
        
        .chart-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
        }
        
        .expand-btn {
          background: none;
          border: none;
          color: #718096;
          font-size: 1rem;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .expand-btn:hover {
          color: #4f6cff;
          background: rgba(79, 108, 255, 0.1);
        }
        
        .chart-wrapper {
          flex: 1;
          padding: 10px;
          min-height: 0;
        }
        
        .widgets-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 15px;
          overflow-y: auto;
          padding-right: 5px;
        }
        
        .compact-kpis {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        
        .kpi-card {
          background: white;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.4);
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .kpi-info {
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .info-icon:hover {
          color: #4f6cff;
        }

        .kpi-tooltip {
          visibility: hidden;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px;
          font-size: 0.75rem;
          color: #1a202c;
          width: 160px;
          position: absolute;
          top: 20px;
          right: 0;
          z-index: 10;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transition: opacity 0.2s ease, visibility 0.2s ease;
        }

        .kpi-info:hover .kpi-tooltip {
          visibility: visible;
          opacity: 1;
        }
        
        .kpi-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: white;
          background: linear-gradient(135deg, #4f6cff 0%, #3a56e4 100%);
          box-shadow: 0 4px 8px rgba(79, 108, 255, 0.3);
        }
        
        .kpi-content {
          flex: 1;
        }
        
        .kpi-value {
          font-size: 1rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .kpi-title {
          font-size: 0.75rem;
          color: #718096;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .collapsible-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.4);
          overflow: hidden;
        }
        
        .section-header {
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .section-header:hover {
          background: rgba(249, 250, 251, 0.8);
        }
        
        .section-header h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .section-content {
          padding: 0 15px;
          font-size: 0.85rem;
          border-top: 1px solid rgba(226, 232, 240, 0.4);
        }
        
        .metric-row, .sector-row, .holding-row, .performer-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.4);
        }
        
        .metric-row:last-child, 
        .sector-row:last-child, 
        .holding-row:last-child, 
        .performer-row:last-child {
          border-bottom: none;
        }
        
        .positive {
          color: #0d9a5c;
        }
        
        .negative {
          color: #ff5656;
        }
        
        .view-more-btn {
          width: 100%;
          padding: 8px;
          margin: 5px 0 10px;
          background: rgba(79, 108, 255, 0.1);
          color: #4f6cff;
          border: none;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .view-more-btn:hover {
          background: rgba(79, 108, 255, 0.2);
        }
        
        .compact-tooltip {
          padding: 10px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          font-family: 'Inter', sans-serif;
          border: 1px solid rgba(226, 232, 240, 0.6);
          min-width: 180px;
        }
        
        .tooltip-header {
          font-size: 0.9rem;
          font-weight: 600;
          color: #4f6cff;
          margin-bottom: 5px;
        }
        
        .tooltip-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a202c;
          margin: 5px 0;
        }
        
        .tooltip-metric {
          font-size: 0.8rem;
          font-weight: 500;
          color: #718096;
          padding-top: 5px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 25px;
          position: relative;
        }
        
        .close-modal {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #718096;
          cursor: pointer;
          padding: 5px;
          line-height: 1;
        }
        
        .close-modal:hover {
          color: #ff5656;
        }
        
        .modal-chart-container {
          width: 800px;
          height: 600px;
        }
        
        .modal-chart-container h3 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.3rem;
          color: #1a202c;
        }
        
        .modal-performance h3,
        .modal-sectors h3,
        .modal-holdings h3,
        .modal-performers h3 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.3rem;
          color: #1a202c;
        }
        
        .performance-grid,
        .sectors-grid,
        .holdings-grid,
        .performers-grid {
          display: grid;
          gap: 15px;
        }
        
        .performance-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .performance-metric {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        
        .metric-label {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .metric-value {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .sectors-grid,
        .holdings-grid,
        .performers-grid {
          grid-template-columns: 1fr;
        }
        
        .sector-item,
        .holding-item,
        .performer-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        
        .sector-name,
        .holding-symbol,
        .performer-symbol {
          flex: 1;
          font-weight: 600;
        }
        
        .holding-name,
        .performer-name {
          flex: 2;
          color: #6b7280;
        }
        
        .sector-bar {
          flex: 2;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          margin: 0 15px;
          overflow: hidden;
        }
        
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #4f6cff, #3a56e4);
        }
        
        .sector-value,
        .holding-value,
        .performer-value {
          width: 80px;
          text-align: right;
          font-weight: 600;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(226, 232, 240, 0.4);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(113, 128, 150, 0.4);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 128, 150, 0.6);
        }
      `}</style>
    </div>
  );
};

export default PriceAcquisitionPlot;