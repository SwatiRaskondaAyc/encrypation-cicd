



import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { FaChartLine, FaFilter, FaInfoCircle, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { useTooltip } from '@nivo/tooltip';
import * as d3Shape from 'd3-shape';
import { HashLoader } from 'react-spinners';

// Custom tooltip component
const CustomTooltip = ({ point }) => {
  const pt = point.data?.pointData;
  if (!pt) return null;

  return (
    <div style={{
      background: 'white',
      padding: '12px',
      borderRadius: '6px',
      boxShadow: '0 8px 12px -2px rgba(0,0,0,0.05)',
      border: '1px solid rgba(241, 245, 249, 0.8)',
      minWidth: '240px',
      zIndex: 9999
    }}>
      <div style={{
        marginBottom: '8px',
        fontSize: '0.95rem',
        fontWeight: 700,
        color: '#212529'
      }}>
        <strong>{pt.x}</strong>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        fontSize: '0.85rem',
        color: '#495057'
      }}>
        <span>Outcome:</span>
        <span style={{ color: pt.outcomeColor }}>{pt.outcome}</span>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        fontSize: '0.85rem',
        color: '#495057'
      }}>
        <span>Price:</span>
        <span>₹{pt.y.toFixed(2)}</span>
      </div>
      <div style={{
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(226, 232, 240, 0.5)'
      }}>
        <div style={{
          fontWeight: 600,
          marginBottom: '6px',
          color: '#343a40',
          fontSize: '0.85rem'
        }}>Breakdown:</div>
        {pt.breakdown.map((b, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
            fontSize: '0.8rem',
            color: '#495057'
          }}>
            <span>{b.outcome}:</span>
            <span>Qty {b.total_qty}, ₹{b.avg_price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom point component
const CustomPoint = ({ point, borderColor, borderWidth, size, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <g
      transform={`translate(${point.x},${point.y})`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <circle
        r={isHovered ? size * 1.5 : size}
        fill={color}
        stroke={borderColor}
        strokeWidth={isHovered ? borderWidth * 2 : borderWidth}
        style={{ transition: 'all 0.2s ease' }}
      />
      {isHovered && (
        <text
          y={-size * 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: color,
            fontSize: 10,
            fontWeight: 'bold',
            pointerEvents: 'none'
          }}
        >
          {point.data.y.toFixed(2)}
        </text>
      )}
    </g>
  );
};

export default function PnlPlot() {
  const [plotData, setPlotData] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomDomain, setZoomDomain] = useState(null);
  const uploadId = localStorage.getItem("uploadId");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const outcomeColors = {
    'Good buy': '#0da547',
    'Bad buy': '#e72427ff',
    'Good sell': '#2444e6ff',
    'Bad sell': '#e7b027ff'
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/file/create_PNL_plot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ uploadId })
    })
      .then(res => res.json())
      .then(data => {
        setPlotData(data);
        const firstKey = Object.keys(data)[0];
        setSelectedStock(firstKey);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching plot data:', err);
        setIsLoading(false);
      });
  }, []);

  const raw = plotData?.[selectedStock] || {
    dates: [],
    prices: [],
    trend: [],
    maj_dates: [],
    maj_prices: [],
    maj_outcomes: [],
    breakdown: []
  };

  const lineData = useMemo(() => [
    {
      id: 'Price',
      color: '#9943eeff',
      data: raw.dates.map((d, i) => ({
        x: d,
        y: raw.prices[i],
        formattedX: d
      }))
    }
  ], [raw]);

  const scatterPoints = useMemo(() =>
    raw.maj_dates.map((d, i) => ({
      x: d,
      y: raw.maj_prices[i],
      outcome: raw.maj_outcomes[i],
      outcomeColor: outcomeColors[raw.maj_outcomes[i]] || '#888',
      breakdown: raw.breakdown[i] || [],
      formattedX: d
    })).filter(pt => pt.x && pt.y != null && !isNaN(pt.y) && pt.outcome)
  , [raw]);

  const wrapperRef = useRef(null);

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleWheelZoom = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!raw.dates.length) return;

      const [fullStart, fullEnd] = [
        new Date(raw.dates[0]),
        new Date(raw.dates[raw.dates.length - 1])
      ];

      const currMin = zoomDomain ? new Date(zoomDomain[0]) : fullStart;
      const currMax = zoomDomain ? new Date(zoomDomain[1]) : fullEnd;

      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

      const boundingRect = el.getBoundingClientRect();
      const mouseX = e.clientX - boundingRect.left;
      const width = boundingRect.width;

      const domainSpan = currMax.getTime() - currMin.getTime();
      const mouseRatio = mouseX / width;

      const anchorTime = currMin.getTime() + domainSpan * mouseRatio;

      const newSpan = domainSpan * zoomFactor;
      let newMin = new Date(anchorTime - newSpan * mouseRatio);
      let newMax = new Date(anchorTime + newSpan * (1 - mouseRatio));

      if (newMin < fullStart) newMin = fullStart;
      if (newMax > fullEnd) newMax = fullEnd;

      setZoomDomain([
        newMin.toISOString().slice(0, 10),
        newMax.toISOString().slice(0, 10),
      ]);
    };

    el.addEventListener('wheel', handleWheelZoom, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelZoom);
  }, [raw.dates, zoomDomain]);

  if (isLoading) {
    return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <HashLoader color="#0369a1" size={60} />
      <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
        CMDA...
      </p>
    </div>
    );
  }

  if (!plotData || !selectedStock) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '1600px',
        margin: '1rem auto',
        padding: '1.5rem',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)',
        borderRadius: '12px',
        boxShadow: '0 8px 12px -2px rgba(0,0,0,0.05)',
        fontFamily: "'Inter', sans-serif",
        color: '#343a40',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <FaInfoCircle style={{ fontSize: '2.5rem', color: '#ced4da', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#343a40' }}>Data Unavailable</h3>
          <p style={{ color: '#6c757d', maxWidth: '400px' }}>Could not load P&L data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const latestPrice = raw.prices[raw.prices.length - 1] || 0;
  const startPrice = raw.prices[0] || 0;
  const priceChange = latestPrice - startPrice;
  const priceChangePct = startPrice ? (priceChange / startPrice * 100) : 0;

  return (
    <div style={{
      width: '100%',
      maxWidth: '1600px',
      margin: '1rem auto',
      padding: '1.5rem',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafd 100%)',
      borderRadius: '12px',
      boxShadow: '0 8px 12px -2px rgba(0,0,0,0.05)',
      fontFamily: "'Inter', sans-serif",
      color: '#343a40',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        boxShadow: '0 6px 10px -2px rgba(0,0,0,0.05)',
        border: '1px solid rgba(241, 245, 249, 0.6)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          padding: '16px 24px',
          background: 'linear-gradient(120deg, rgba(249, 250, 251, 0.8) 0%, rgba(240, 244, 248, 0.8) 100%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #4361ee 0%, #2a44c4 100%)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1.2rem',
              boxShadow: '0 3px 5px rgba(67, 97, 238, 0.2)'
            }}>
              <FaChartLine />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#212529',
                marginBottom: '4px'
              }}>Profit & Loss Analysis</h2>
              <p style={{
                fontSize: '0.9rem',
                color: '#6c757d',
                fontWeight: 500,
                margin: 0
              }}>Trade performance overview</p>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          margin: '0.8rem 16px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '6px',
            padding: '0.7rem',
            boxShadow: '0 3px 5px rgba(0,0,0,0.04)',
            border: '1px solid #edf2f7'
          }}>
            <div style={{
              fontSize: '0.85rem',
              color: '#6c757d',
              marginBottom: '0.5rem',
              fontWeight: 500
            }}>Current Price</div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#212529',
              marginBottom: '0.2rem'
            }}>₹{latestPrice.toFixed(2)}</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: priceChange >= 0 ? '#10B981' : '#EF4444'
            }}>
              {priceChange >= 0 ? <FaCaretUp /> : <FaCaretDown />}
              {priceChange.toFixed(2)} ({priceChangePct.toFixed(2)}%)
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '6px',
            padding: '1rem',
            boxShadow: '0 3px 5px rgba(0,0,0,0.04)',
            border: '1px solid #edf2f7'
          }}>
            <div style={{
              fontSize: '0.85rem',
              color: '#6c757d',
              marginBottom: '0.5rem',
              fontWeight: 500
            }}>Total Trades</div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#212529',
              marginBottom: '0.25rem'
            }}>{raw.num_trades}</div>
            <div style={{
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#6c757d'
            }}>{raw.num_buys} Buys, {raw.num_sells} Sells</div>
            <div style={{
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#6c757d'
            }}>{scatterPoints.filter(p => p.outcome.includes('Good')).length} profitable</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '6px',
            padding: '1rem',
            boxShadow: '0 3px 5px rgba(0,0,0,0.04)',
            border: '1px solid #edf2f7'
          }}>
            <div style={{
              fontSize: '0.85rem',
              color: '#6c757d',
              marginBottom: '0.5rem',
              fontWeight: 500
            }}>Selected Stock</div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#212529',
              marginBottom: '0.2rem'
            }}>{selectedStock}</div>
            <div style={{
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#6c757d'
            }}>{raw.dates.length} days analyzed</div>
          </div>
        </div>

        <div style={{
          padding: '0 24px 16px',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              {Object.entries(outcomeColors).map(([outcome, color]) => (
                <div key={outcome} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: color
                  }}></div>
                  <span>{outcome}</span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <label style={{
                fontWeight: 500,
                color: '#495057',
                fontSize: '0.9rem'
              }}>Select Stock:</label>
              <select
                value={selectedStock}
                onChange={e => setSelectedStock(e.target.value)}
                style={{
                  padding: '0.4rem 0.8rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: 'white',
                  color: '#343a40',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
                className="premium-select"
              >
                {Object.keys(plotData).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            ref={wrapperRef}
            onDoubleClick={handleResetZoom}
            tabIndex={0}
            style={{
              height: '300px',
              width: '100%',
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              overscrollBehavior: 'contain',
              touchAction: 'none',
              outline: 'none'
            }}
            className="chart-wrapper"
          >
            <ResponsiveLine
              data={lineData}
              lineGenerator={serie =>
                serie.id === 'Market Price'
                  ? d3Shape.line().curve(d3Shape.curveMonotoneX)
                  : d3Shape.line().curve(d3Shape.curveLinear)
              }
              curve="monotoneX"
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
              xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                precision: 'day',
                min: zoomDomain ? zoomDomain[0] : 'auto',
                max: zoomDomain ? zoomDomain[1] : 'auto',
              }}
              xFormat="time:%Y-%m-%d"
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
              axisBottom={{
                orient: 'bottom',
                tickSize: 0,
                tickPadding: 8,
                tickRotation: 0,
                format: (value) => {
                  const date = new Date(value);
                  const month = date.toLocaleString('default', { month: 'short' });
                  const year = date.getFullYear();
                  return `${month}\n${year}`;
                },
                legend: '',
                legendOffset: 30,
                legendPosition: 'middle',
              }}
              axisLeft={{
                format: v => `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
                legend: 'Market Price (₹)',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              enableGridX={false}
              enableGridY={true}
              enablePoints={false}
              useMesh={true}
              colors={d => d.color}
              lineWidth={2}
              pointSize={6}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-10}
              enableSlices="x"
              sliceTooltip={({ slice }) => {
                return <CustomTooltip point={slice.points[0]} />;
              }}
              theme={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                textColor: '#4b5563',
                axis: {
                  domain: {
                    line: {
                      stroke: '#e2e8f0',
                      strokeWidth: 1
                    }
                  },
                  ticks: {
                    line: {
                      stroke: '#e2e8f0',
                      strokeWidth: 1
                    },
                    text: {
                      fill: '#4b5563',
                      fontSize: 10
                    }
                  },
                  legend: {
                    text: {
                      fontSize: 12,
                      fontWeight: 600,
                      fill: '#1f2937'
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: '#f3f4f6',
                    strokeWidth: 1
                  }
                },
                tooltip: {
                  container: {
                    background: 'white',
                    color: '#1f2937',
                    fontSize: '11px',
                    borderRadius: '6px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    padding: '10px',
                    border: '1px solid #f3f4f6'
                  }
                }
              }}
              layers={[
                'grid',
                'markers',
                'areas',
                'lines',
                'slices',
                'points',
                'mesh',
                'legends',
                (props) => {
                  const { showTooltipFromEvent, hideTooltip } = useTooltip();

                  return scatterPoints.map((pt, i) => {
                    const x = props.xScale(new Date(pt.x));
                    const y = props.yScale(pt.y);

                    const pointData = {
                      id: `point-${i}`,
                      x,
                      y,
                      data: {
                        x: pt.x,
                        y: pt.y,
                        pointData: pt
                      },
                      serieId: 'scatter',
                      color: pt.outcomeColor,
                      borderColor: '#fff',
                      size: 6,
                      borderWidth: 2
                    };

                    return (
                      <g
                        key={`scatter-${i}`}
                        transform={`translate(${x},${y})`}
                        onMouseEnter={(e) => showTooltipFromEvent(
                          <CustomTooltip point={pointData} />,
                          e
                        )}
                        onMouseLeave={hideTooltip}
                        style={{ cursor: 'pointer' }}
                      >
                        <circle
                          r={pointData.size}
                          fill={pointData.color}
                          stroke={pointData.borderColor}
                          strokeWidth={pointData.borderWidth}
                        />
                      </g>
                    );
                  });
                },
                'axes',
              ]}
            />
          </div>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .chart-wrapper svg {
              cursor: crosshair;
            }
            .premium-select:hover {
              border-color: #cbd5e0;
            }
            .premium-select:focus {
              outline: none;
              border-color: #4361ee;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
            }
          `}
        </style>
      </div>
    </div>
  );
}


