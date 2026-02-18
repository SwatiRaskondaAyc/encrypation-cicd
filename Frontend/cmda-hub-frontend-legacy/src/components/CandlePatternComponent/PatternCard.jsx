
// import { useEffect, useRef } from 'react';
// import { createChart } from 'lightweight-charts';

// // Enhanced color scheme
// const BIAS_CONFIG = {
//   bullish: {
//     background: 'bg-gradient-to-br from-green-50 to-emerald-50',
//     border: 'border-green-200',
//     selectedBorder: 'border-green-500',
//     chartColor: '#10B981'
//   },
//   bearish: {
//     background: 'bg-gradient-to-br from-red-50 to-rose-50', 
//     border: 'border-red-200',
//     selectedBorder: 'border-red-500',
//     chartColor: '#EF4444'
//   },
//   neutral: {
//     background: 'bg-gradient-to-br from-blue-50 to-cyan-50',
//     border: 'border-blue-200',
//     selectedBorder: 'border-blue-500',
//     chartColor: '#3B82F6'
//   },
// };

// // Pattern annotations mapping
// const PATTERN_ANNOTATIONS = {
//   // Single Candlestick Patterns
//   "MICRO-S-001": [null, null, null, null, null, "BM", null, null, null, null, null], // Bullish Marubozu
//   "MICRO-S-002": [null, null, null, null, null, "BM", null, null, null, null, null], // Bearish Marubozu
//   "MICRO-S-003": [null, null, null, null, null, "DJ", null, null, null, null, null], // Doji
//   "MICRO-S-004": [null, null, null, null, null, "ST", null, null, null, null, null], // Spinning Top
//   "MICRO-S-005": [null, null, null, null, null, "HM", null, null, null, null, null], // Hammer
//   "MICRO-S-006": [null, null, null, null, null, "HGM", null, null, null, null, null], // Hanging Man
//   "MICRO-S-007": [null, null, null, null, null, "SS", null, null, null, null, null], // Shooting Star
//   "MICRO-S-008": [null, null, null, null, null, "IH", null, null, null, null, null], // Inverted Hammer
//   "MICRO-S-009": [null, null, null, null, null, "DD", null, null, null, null, null], // Dragonfly Doji
//   "MICRO-S-010": [null, null, null, null, null, "GD", null, null, null, null, null], // Gravestone Doji

//   // Two-Candlestick Patterns
//   "MICRO-D-001": [null, null, null, null, null, null, "BE", null, null, null, null], // Bullish Engulfing
//   "MICRO-D-002": [null, null, null, null, null, null, "BrE", null, null, null, null], // Bearish Engulfing
//   "MICRO-D-003": [null, null, null, null, null, null, "BH", null, null, null, null], // Bullish Harami
//   "MICRO-D-004": [null, null, null, null, null, null, "BrH", null, null, null, null], // Bearish Harami
//   "MICRO-D-005": [null, null, null, null, null, null, "PP", null, null, null, null], // Piercing Pattern
//   "MICRO-D-006": [null, null, null, null, null, null, "DCC", null, null, null, null], // Dark Cloud Cover
//   "MICRO-D-007": [null, null, null, null, null, null, "TB", null, null, null, null], // Tweezer Bottom
//   "MICRO-D-008": [null, null, null, null, null, null, "TT", null, null, null, null], // Tweezer Top

//   // Three-Candlestick Patterns
//   "MICRO-T-001": [null, null, null, null, null, null, null, "MS", null, null, null], // Morning Star
//   "MICRO-T-002": [null, null, null, null, null, null, null, "ES", null, null, null], // Evening Star
//   "MICRO-T-003": [null, null, null, null, null, null, null, "TWS", null, null, null], // Three White Soldiers
//   "MICRO-T-004": [null, null, null, null, null, null, null, "TBC", null, null, null], // Three Black Crows
//   "MICRO-T-005": [null, null, null, null, null, null, null, "TIU", null, null, null], // Three Inside Up
//   "MICRO-T-006": [null, null, null, null, null, null, null, "TID", null, null, null], // Three Inside Down
//   "MICRO-T-007": [null, null, null, null, null, null, null, "ABB", null, null, null], // Abandoned Baby Bottom
//   "MICRO-T-008": [null, null, null, null, null, null, null, "ABT", null, null, null], // Abandoned Baby Top
// };

// // Completely unique candle patterns for each pattern type - 12 candles each
// const PATTERN_OHLC_DATA = {
//   "MICRO-S-001": [ // Bullish Marubozu - Strong uptrend with long green candle
//     { time: '2024-01-01', open: 85, high: 87, low: 84, close: 86.5 },
//     { time: '2024-01-02', open: 86.5, high: 88, low: 85, close: 87 },
//     { time: '2024-01-03', open: 87, high: 89, low: 86, close: 88.5 },
//     { time: '2024-01-04', open: 88.5, high: 90, low: 87, close: 89 },
//     { time: '2024-01-05', open: 89, high: 91, low: 88, close: 90.5 },
//     { time: '2024-01-06', open: 90.5, high: 105, low: 90.5, close: 105 }, // Bullish Marubozu
//     { time: '2024-01-07', open: 105, high: 107, low: 103, close: 106 },
//     { time: '2024-01-08', open: 106, high: 108, low: 104, close: 107.5 },
//     { time: '2024-01-09', open: 107.5, high: 109, low: 106, close: 108 },
//     { time: '2024-01-10', open: 108, high: 110, low: 107, close: 109.5 },
//     { time: '2024-01-11', open: 109.5, high: 111, low: 108, close: 110 },
//     { time: '2024-01-12', open: 110, high: 112, low: 109, close: 111.5 }
//   ],
//   "MICRO-S-002": [ // Bearish Marubozu - Strong downtrend with long red candle
//     { time: '2024-01-01', open: 112, high: 114, low: 111, close: 113.5 },
//     { time: '2024-01-02', open: 113.5, high: 115, low: 112, close: 114 },
//     { time: '2024-01-03', open: 114, high: 116, low: 113, close: 115.5 },
//     { time: '2024-01-04', open: 115.5, high: 117, low: 114, close: 116 },
//     { time: '2024-01-05', open: 116, high: 118, low: 115, close: 117.5 },
//     { time: '2024-01-06', open: 117.5, high: 117.5, low: 100, close: 100 }, // Bearish Marubozu
//     { time: '2024-01-07', open: 100, high: 102, low: 98, close: 99 },
//     { time: '2024-01-08', open: 99, high: 101, low: 97, close: 98.5 },
//     { time: '2024-01-09', open: 98.5, high: 100, low: 96, close: 97 },
//     { time: '2024-01-10', open: 97, high: 99, low: 95, close: 96.5 },
//     { time: '2024-01-11', open: 96.5, high: 98, low: 94, close: 95 },
//     { time: '2024-01-12', open: 95, high: 97, low: 93, close: 94.5 }
//   ],
//   "MICRO-S-003": [ // Doji - Sideways movement with perfect doji
//     { time: '2024-01-01', open: 75, high: 77, low: 74, close: 76.5 },
//     { time: '2024-01-02', open: 76.5, high: 78, low: 75, close: 77 },
//     { time: '2024-01-03', open: 77, high: 79, low: 76, close: 78.5 },
//     { time: '2024-01-04', open: 78.5, high: 80, low: 77, close: 79 },
//     { time: '2024-01-05', open: 79, high: 81, low: 78, close: 80.5 },
//     { time: '2024-01-06', open: 80.5, high: 81.5, low: 79.5, close: 80.5 }, // Doji
//     { time: '2024-01-07', open: 80.5, high: 82, low: 79, close: 81.5 },
//     { time: '2024-01-08', open: 81.5, high: 83, low: 80, close: 82 },
//     { time: '2024-01-09', open: 82, high: 84, low: 81, close: 83.5 },
//     { time: '2024-01-10', open: 83.5, high: 85, low: 82, close: 84 },
//     { time: '2024-01-11', open: 84, high: 86, low: 83, close: 85.5 },
//     { time: '2024-01-12', open: 85.5, high: 87, low: 84, close: 86 }
//   ],
//   "MICRO-S-004": [ // Spinning Top - Small body with wicks
//     { time: '2024-01-01', open: 65, high: 67, low: 64, close: 66.5 },
//     { time: '2024-01-02', open: 66.5, high: 68, low: 65, close: 67 },
//     { time: '2024-01-03', open: 67, high: 69, low: 66, close: 68.5 },
//     { time: '2024-01-04', open: 68.5, high: 70, low: 67, close: 69 },
//     { time: '2024-01-05', open: 69, high: 71, low: 68, close: 70.5 },
//     { time: '2024-01-06', open: 70.5, high: 72, low: 68, close: 70.5 }, // Spinning Top
//     { time: '2024-01-07', open: 70.5, high: 72, low: 69, close: 71.5 },
//     { time: '2024-01-08', open: 71.5, high: 73, low: 70, close: 72 },
//     { time: '2024-01-09', open: 72, high: 74, low: 71, close: 73.5 },
//     { time: '2024-01-10', open: 73.5, high: 75, low: 72, close: 74 },
//     { time: '2024-01-11', open: 74, high: 76, low: 73, close: 75.5 },
//     { time: '2024-01-12', open: 75.5, high: 77, low: 74, close: 76 }
//   ],
//   "MICRO-S-005": [ // Hammer - Downtrend reversal with long lower wick
//     { time: '2024-01-01', open: 95, high: 97, low: 94, close: 93.5 },
//     { time: '2024-01-02', open: 93.5, high: 95, low: 92, close: 91 },
//     { time: '2024-01-03', open: 91, high: 93, low: 90, close: 89.5 },
//     { time: '2024-01-04', open: 89.5, high: 91, low: 88, close: 87 },
//     { time: '2024-01-05', open: 87, high: 89, low: 86, close: 85.5 },
//     { time: '2024-01-06', open: 85.5, high: 87, low: 75, close: 86 }, // Hammer
//     { time: '2024-01-07', open: 86, high: 90, low: 85, close: 89.5 },
//     { time: '2024-01-08', open: 89.5, high: 93, low: 88, close: 92 },
//     { time: '2024-01-09', open: 92, high: 96, low: 91, close: 95.5 },
//     { time: '2024-01-10', open: 95.5, high: 99, low: 94, close: 98 },
//     { time: '2024-01-11', open: 98, high: 102, low: 97, close: 101.5 },
//     { time: '2024-01-12', open: 101.5, high: 105, low: 100, close: 104 }
//   ],
//   "MICRO-S-006": [ // Hanging Man - Uptrend reversal with long lower wick
//     { time: '2024-01-01', open: 104, high: 106, low: 103, close: 105.5 },
//     { time: '2024-01-02', open: 105.5, high: 108, low: 104, close: 107 },
//     { time: '2024-01-03', open: 107, high: 110, low: 106, close: 109.5 },
//     { time: '2024-01-04', open: 109.5, high: 112, low: 108, close: 111 },
//     { time: '2024-01-05', open: 111, high: 114, low: 110, close: 113.5 },
//     { time: '2024-01-06', open: 113.5, high: 115, low: 105, close: 114 }, // Hanging Man
//     { time: '2024-01-07', open: 114, high: 115, low: 110, close: 111.5 },
//     { time: '2024-01-08', open: 111.5, high: 112, low: 107, close: 109 },
//     { time: '2024-01-09', open: 109, high: 110, low: 105, close: 106.5 },
//     { time: '2024-01-10', open: 106.5, high: 107, low: 102, close: 104 },
//     { time: '2024-01-11', open: 104, high: 105, low: 100, close: 101.5 },
//     { time: '2024-01-12', open: 101.5, high: 102, low: 97, close: 99 }
//   ],
//   "MICRO-S-007": [ // Shooting Star - Uptrend reversal with long upper wick
//     { time: '2024-01-01', open: 55, high: 57, low: 54, close: 56.5 },
//     { time: '2024-01-02', open: 56.5, high: 59, low: 55, close: 58 },
//     { time: '2024-01-03', open: 58, high: 61, low: 57, close: 60.5 },
//     { time: '2024-01-04', open: 60.5, high: 63, low: 59, close: 62 },
//     { time: '2024-01-05', open: 62, high: 65, low: 61, close: 64.5 },
//     { time: '2024-01-06', open: 64.5, high: 75, low: 63, close: 65 }, // Shooting Star
//     { time: '2024-01-07', open: 65, high: 66, low: 62, close: 63.5 },
//     { time: '2024-01-08', open: 63.5, high: 64, low: 60, close: 61 },
//     { time: '2024-01-09', open: 61, high: 62, low: 58, close: 59.5 },
//     { time: '2024-01-10', open: 59.5, high: 60, low: 56, close: 57 },
//     { time: '2024-01-11', open: 57, high: 58, low: 54, close: 55.5 },
//     { time: '2024-01-12', open: 55.5, high: 56, low: 52, close: 53 }
//   ],
//   "MICRO-S-008": [ // Inverted Hammer - Downtrend reversal with long upper wick
//     { time: '2024-01-01', open: 53, high: 55, low: 52, close: 51.5 },
//     { time: '2024-01-02', open: 51.5, high: 53, low: 50, close: 49 },
//     { time: '2024-01-03', open: 49, high: 51, low: 48, close: 47.5 },
//     { time: '2024-01-04', open: 47.5, high: 49, low: 46, close: 45 },
//     { time: '2024-01-05', open: 45, high: 47, low: 44, close: 43.5 },
//     { time: '2024-01-06', open: 43.5, high: 53, low: 43.5, close: 44.5 }, // Inverted Hammer
//     { time: '2024-01-07', open: 44.5, high: 48, low: 44, close: 47.5 },
//     { time: '2024-01-08', open: 47.5, high: 51, low: 47, close: 50 },
//     { time: '2024-01-09', open: 50, high: 54, low: 49, close: 53.5 },
//     { time: '2024-01-10', open: 53.5, high: 57, low: 52, close: 56 },
//     { time: '2024-01-11', open: 56, high: 60, low: 55, close: 59.5 },
//     { time: '2024-01-12', open: 59.5, high: 63, low: 58, close: 62 }
//   ],
//   "MICRO-S-009": [ // Dragonfly Doji - T-shaped doji with long lower wick
//     { time: '2024-01-01', open: 62, high: 64, low: 61, close: 63.5 },
//     { time: '2024-01-02', open: 63.5, high: 66, low: 62, close: 65 },
//     { time: '2024-01-03', open: 65, high: 68, low: 64, close: 67.5 },
//     { time: '2024-01-04', open: 67.5, high: 70, low: 66, close: 69 },
//     { time: '2024-01-05', open: 69, high: 72, low: 68, close: 71.5 },
//     { time: '2024-01-06', open: 71.5, high: 72, low: 60, close: 71.5 }, // Dragonfly Doji
//     { time: '2024-01-07', open: 71.5, high: 75, low: 70, close: 74 },
//     { time: '2024-01-08', open: 74, high: 78, low: 73, close: 77.5 },
//     { time: '2024-01-09', open: 77.5, high: 81, low: 76, close: 80 },
//     { time: '2024-01-10', open: 80, high: 84, low: 79, close: 83.5 },
//     { time: '2024-01-11', open: 83.5, high: 87, low: 82, close: 86 },
//     { time: '2024-01-12', open: 86, high: 90, low: 85, close: 89.5 }
//   ],
//   "MICRO-S-010": [ // Gravestone Doji - Inverted T-shaped doji with long upper wick
//     { time: '2024-01-01', open: 89.5, high: 91, low: 88, close: 90.5 },
//     { time: '2024-01-02', open: 90.5, high: 93, low: 89, close: 92 },
//     { time: '2024-01-03', open: 92, high: 95, low: 91, close: 94.5 },
//     { time: '2024-01-04', open: 94.5, high: 97, low: 93, close: 96 },
//     { time: '2024-01-05', open: 96, high: 99, low: 95, close: 98.5 },
//     { time: '2024-01-06', open: 98.5, high: 108, low: 98.5, close: 98.5 }, // Gravestone Doji
//     { time: '2024-01-07', open: 98.5, high: 99, low: 96, close: 97 },
//     { time: '2024-01-08', open: 97, high: 98, low: 94, close: 95.5 },
//     { time: '2024-01-09', open: 95.5, high: 96, low: 92, close: 93 },
//     { time: '2024-01-10', open: 93, high: 94, low: 90, close: 91.5 },
//     { time: '2024-01-11', open: 91.5, high: 92, low: 88, close: 89 },
//     { time: '2024-01-12', open: 89, high: 90, low: 86, close: 87.5 }
//   ],
//   "MICRO-D-001": [ // Bullish Engulfing - Small red candle followed by large green engulfing
//     { time: '2024-01-01', open: 87.5, high: 89, low: 86, close: 85 },
//     { time: '2024-01-02', open: 85, high: 87, low: 84, close: 83.5 },
//     { time: '2024-01-03', open: 83.5, high: 85, low: 82, close: 81 },
//     { time: '2024-01-04', open: 81, high: 83, low: 80, close: 79.5 },
//     { time: '2024-01-05', open: 79.5, high: 81, low: 78, close: 77 },
//     { time: '2024-01-06', open: 77, high: 79, low: 76, close: 75.5 }, // Small red
//     { time: '2024-01-07', open: 74, high: 85, low: 73, close: 84.5 }, // Bullish engulfing
//     { time: '2024-01-08', open: 84.5, high: 88, low: 83, close: 87 },
//     { time: '2024-01-09', open: 87, high: 91, low: 86, close: 90.5 },
//     { time: '2024-01-10', open: 90.5, high: 94, low: 89, close: 93 },
//     { time: '2024-01-11', open: 93, high: 97, low: 92, close: 96.5 },
//     { time: '2024-01-12', open: 96.5, high: 100, low: 95, close: 99 }
//   ],
//   "MICRO-D-002": [ // Bearish Engulfing - Small green candle followed by large red engulfing
//     { time: '2024-01-01', open: 99, high: 101, low: 98, close: 100.5 },
//     { time: '2024-01-02', open: 100.5, high: 103, low: 99, close: 102 },
//     { time: '2024-01-03', open: 102, high: 105, low: 101, close: 104.5 },
//     { time: '2024-01-04', open: 104.5, high: 107, low: 103, close: 106 },
//     { time: '2024-01-05', open: 106, high: 109, low: 105, close: 108.5 },
//     { time: '2024-01-06', open: 108.5, high: 110, low: 107, close: 109 }, // Small green
//     { time: '2024-01-07', open: 111, high: 111, low: 95, close: 96.5 }, // Bearish engulfing
//     { time: '2024-01-08', open: 96.5, high: 98, low: 94, close: 95 },
//     { time: '2024-01-09', open: 95, high: 97, low: 93, close: 92.5 },
//     { time: '2024-01-10', open: 92.5, high: 94, low: 90, close: 91 },
//     { time: '2024-01-11', open: 91, high: 93, low: 89, close: 88.5 },
//     { time: '2024-01-12', open: 88.5, high: 90, low: 86, close: 87 }
//   ],
//   "MICRO-D-003": [ // Bullish Harami - Large red candle followed by small green inside
//     { time: '2024-01-01', open: 120, high: 122, low: 119, close: 121.5 },
//     { time: '2024-01-02', open: 121.5, high: 124, low: 120, close: 123 },
//     { time: '2024-01-03', open: 123, high: 126, low: 122, close: 125.5 },
//     { time: '2024-01-04', open: 125.5, high: 128, low: 124, close: 127 },
//     { time: '2024-01-05', open: 127, high: 130, low: 126, close: 129.5 },
//     { time: '2024-01-06', open: 129.5, high: 130, low: 115, close: 116 }, // Large red
//     { time: '2024-01-07', open: 117, high: 119, low: 116, close: 118.5 }, // Bullish harami
//     { time: '2024-01-08', open: 118.5, high: 122, low: 117, close: 121 },
//     { time: '2024-01-09', open: 121, high: 125, low: 120, close: 124.5 },
//     { time: '2024-01-10', open: 124.5, high: 128, low: 123, close: 127 },
//     { time: '2024-01-11', open: 127, high: 131, low: 126, close: 130.5 },
//     { time: '2024-01-12', open: 130.5, high: 134, low: 129, close: 133 }
//   ],
//   "MICRO-D-004": [ // Bearish Harami - Large green candle followed by small red inside
//     { time: '2024-01-01', open: 70, high: 72, low: 69, close: 71.5 },
//     { time: '2024-01-02', open: 71.5, high: 74, low: 70, close: 73 },
//     { time: '2024-01-03', open: 73, high: 76, low: 72, close: 75.5 },
//     { time: '2024-01-04', open: 75.5, high: 78, low: 74, close: 77 },
//     { time: '2024-01-05', open: 77, high: 80, low: 76, close: 79.5 },
//     { time: '2024-01-06', open: 79.5, high: 90, low: 79.5, close: 90 }, // Large green
//     { time: '2024-01-07', open: 89, high: 91, low: 88, close: 88.5 }, // Bearish harami
//     { time: '2024-01-08', open: 88.5, high: 90, low: 87, close: 86 },
//     { time: '2024-01-09', open: 86, high: 88, low: 85, close: 83.5 },
//     { time: '2024-01-10', open: 83.5, high: 85, low: 82, close: 81 },
//     { time: '2024-01-11', open: 81, high: 83, low: 80, close: 78.5 },
//     { time: '2024-01-12', open: 78.5, high: 80, low: 77, close: 76 }
//   ],
//   "MICRO-D-005": [ // Piercing Pattern - Downtrend with piercing green candle
//     { time: '2024-01-01', open: 110, high: 112, low: 109, close: 108 },
//     { time: '2024-01-02', open: 108, high: 110, low: 107, close: 106 },
//     { time: '2024-01-03', open: 106, high: 108, low: 105, close: 104 },
//     { time: '2024-01-04', open: 104, high: 106, low: 103, close: 102 },
//     { time: '2024-01-05', open: 102, high: 104, low: 101, close: 100 },
//     { time: '2024-01-06', open: 100, high: 102, low: 98, close: 99 }, // Red candle
//     { time: '2024-01-07', open: 95, high: 105, low: 94, close: 104 }, // Piercing green
//     { time: '2024-01-08', open: 104, high: 108, low: 103, close: 107 },
//     { time: '2024-01-09', open: 107, high: 111, low: 106, close: 110 },
//     { time: '2024-01-10', open: 110, high: 114, low: 109, close: 113 },
//     { time: '2024-01-11', open: 113, high: 117, low: 112, close: 116 },
//     { time: '2024-01-12', open: 116, high: 120, low: 115, close: 119 }
//   ],
//   "MICRO-D-006": [ // Dark Cloud Cover - Uptrend with covering red candle
//     { time: '2024-01-01', open: 80, high: 82, low: 79, close: 81.5 },
//     { time: '2024-01-02', open: 81.5, high: 84, low: 80, close: 83 },
//     { time: '2024-01-03', open: 83, high: 86, low: 82, close: 85.5 },
//     { time: '2024-01-04', open: 85.5, high: 88, low: 84, close: 87 },
//     { time: '2024-01-05', open: 87, high: 90, low: 86, close: 89.5 },
//     { time: '2024-01-06', open: 89.5, high: 92, low: 88, close: 91 }, // Green candle
//     { time: '2024-01-07', open: 93, high: 93, low: 85, close: 86 }, // Dark cloud
//     { time: '2024-01-08', open: 86, high: 88, low: 84, close: 85 },
//     { time: '2024-01-09', open: 85, high: 87, low: 83, close: 84 },
//     { time: '2024-01-10', open: 84, high: 86, low: 82, close: 83 },
//     { time: '2024-01-11', open: 83, high: 85, low: 81, close: 82 },
//     { time: '2024-01-12', open: 82, high: 84, low: 80, close: 81 }
//   ],
//   "MICRO-D-007": [ // Tweezer Bottom - Double bottom with matching lows
//     { time: '2024-01-01', open: 95, high: 97, low: 94, close: 93 },
//     { time: '2024-01-02', open: 93, high: 95, low: 92, close: 91 },
//     { time: '2024-01-03', open: 91, high: 93, low: 90, close: 89 },
//     { time: '2024-01-04', open: 89, high: 91, low: 88, close: 87 },
//     { time: '2024-01-05', open: 87, high: 89, low: 86, close: 85 },
//     { time: '2024-01-06', open: 85, high: 87, low: 80, close: 82 }, // First bottom
//     { time: '2024-01-07', open: 83, high: 85, low: 80, close: 84 }, // Tweezer bottom
//     { time: '2024-01-08', open: 84, high: 88, low: 83, close: 87 },
//     { time: '2024-01-09', open: 87, high: 91, low: 86, close: 90 },
//     { time: '2024-01-10', open: 90, high: 94, low: 89, close: 93 },
//     { time: '2024-01-11', open: 93, high: 97, low: 92, close: 96 },
//     { time: '2024-01-12', open: 96, high: 100, low: 95, close: 99 }
//   ],
//   "MICRO-D-008": [ // Tweezer Top - Double top with matching highs
//     { time: '2024-01-01', open: 105, high: 107, low: 104, close: 106 },
//     { time: '2024-01-02', open: 106, high: 109, low: 105, close: 108 },
//     { time: '2024-01-03', open: 108, high: 111, low: 107, close: 110 },
//     { time: '2024-01-04', open: 110, high: 113, low: 109, close: 112 },
//     { time: '2024-01-05', open: 112, high: 115, low: 111, close: 114 },
//     { time: '2024-01-06', open: 114, high: 120, low: 113, close: 115 }, // First top
//     { time: '2024-01-07', open: 116, high: 120, low: 115, close: 117 }, // Tweezer top
//     { time: '2024-01-08', open: 117, high: 119, low: 114, close: 116 },
//     { time: '2024-01-09', open: 116, high: 118, low: 113, close: 115 },
//     { time: '2024-01-10', open: 115, high: 117, low: 112, close: 114 },
//     { time: '2024-01-11', open: 114, high: 116, low: 111, close: 113 },
//     { time: '2024-01-12', open: 113, high: 115, low: 110, close: 112 }
//   ],
//   "MICRO-T-001": [ // Morning Star - Downtrend reversal pattern
//     { time: '2024-01-01', open: 100, high: 102, low: 99, close: 98 },
//     { time: '2024-01-02', open: 98, high: 100, low: 97, close: 96 },
//     { time: '2024-01-03', open: 96, high: 98, low: 95, close: 94 },
//     { time: '2024-01-04', open: 94, high: 96, low: 93, close: 92 },
//     { time: '2024-01-05', open: 92, high: 94, low: 91, close: 90 },
//     { time: '2024-01-06', open: 90, high: 92, low: 88, close: 89 }, // Long red
//     { time: '2024-01-07', open: 87, high: 89, low: 86, close: 88 }, // Small doji/star
//     { time: '2024-01-08', open: 90, high: 96, low: 89, close: 95 }, // Long green
//     { time: '2024-01-09', open: 95, high: 99, low: 94, close: 98 },
//     { time: '2024-01-10', open: 98, high: 102, low: 97, close: 101 },
//     { time: '2024-01-11', open: 101, high: 105, low: 100, close: 104 },
//     { time: '2024-01-12', open: 104, high: 108, low: 103, close: 107 }
//   ],
//   "MICRO-T-002": [ // Evening Star - Uptrend reversal pattern
//     { time: '2024-01-01', open: 107, high: 109, low: 106, close: 108 },
//     { time: '2024-01-02', open: 108, high: 111, low: 107, close: 110 },
//     { time: '2024-01-03', open: 110, high: 113, low: 109, close: 112 },
//     { time: '2024-01-04', open: 112, high: 115, low: 111, close: 114 },
//     { time: '2024-01-05', open: 114, high: 117, low: 113, close: 116 },
//     { time: '2024-01-06', open: 116, high: 120, low: 115, close: 119 }, // Long green
//     { time: '2024-01-07', open: 119, high: 121, low: 118, close: 120 }, // Small doji/star
//     { time: '2024-01-08', open: 118, high: 119, low: 110, close: 111 }, // Long red
//     { time: '2024-01-09', open: 111, high: 113, low: 109, close: 110 },
//     { time: '2024-01-10', open: 110, high: 112, low: 108, close: 109 },
//     { time: '2024-01-11', open: 109, high: 111, low: 107, close: 108 },
//     { time: '2024-01-12', open: 108, high: 110, low: 106, close: 107 }
//   ],
//   "MICRO-T-003": [ // Three White Soldiers - Strong uptrend
//     { time: '2024-01-01', open: 60, high: 62, low: 59, close: 61 },
//     { time: '2024-01-02', open: 61, high: 63, low: 60, close: 62 },
//     { time: '2024-01-03', open: 62, high: 64, low: 61, close: 63 },
//     { time: '2024-01-04', open: 63, high: 65, low: 62, close: 64 },
//     { time: '2024-01-05', open: 64, high: 66, low: 63, close: 65 },
//     { time: '2024-01-06', open: 65, high: 68, low: 64, close: 67 }, // First soldier
//     { time: '2024-01-07', open: 67, high: 70, low: 66, close: 69 }, // Second soldier
//     { time: '2024-01-08', open: 69, high: 72, low: 68, close: 71 }, // Third soldier
//     { time: '2024-01-09', open: 71, high: 74, low: 70, close: 73 },
//     { time: '2024-01-10', open: 73, high: 76, low: 72, close: 75 },
//     { time: '2024-01-11', open: 75, high: 78, low: 74, close: 77 },
//     { time: '2024-01-12', open: 77, high: 80, low: 76, close: 79 }
//   ],
//   "MICRO-T-004": [ // Three Black Crows - Strong downtrend
//     { time: '2024-01-01', open: 79, high: 81, low: 78, close: 80 },
//     { time: '2024-01-02', open: 80, high: 82, low: 79, close: 81 },
//     { time: '2024-01-03', open: 81, high: 83, low: 80, close: 82 },
//     { time: '2024-01-04', open: 82, high: 84, low: 81, close: 83 },
//     { time: '2024-01-05', open: 83, high: 85, low: 82, close: 84 },
//     { time: '2024-01-06', open: 84, high: 85, low: 80, close: 81 }, // First crow
//     { time: '2024-01-07', open: 81, high: 82, low: 77, close: 78 }, // Second crow
//     { time: '2024-01-08', open: 78, high: 79, low: 74, close: 75 }, // Third crow
//     { time: '2024-01-09', open: 75, high: 76, low: 72, close: 73 },
//     { time: '2024-01-10', open: 73, high: 74, low: 70, close: 71 },
//     { time: '2024-01-11', open: 71, high: 72, low: 68, close: 69 },
//     { time: '2024-01-12', open: 69, high: 70, low: 66, close: 67 }
//   ]
// };

// const StaticCandleChart = ({ patternId, bias, type }) => {
//   const chartContainerRef = useRef(null);
//   const chartRef = useRef(null);
//   const annotationsContainerRef = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     const initializeChart = () => {
//       const container = chartContainerRef.current;
//       if (!container) return;

//       // Clean up previous chart
//       if (chartRef.current) {
//         chartRef.current.remove();
//         chartRef.current = null;
//       }

//       // Clear previous annotations
//       if (annotationsContainerRef.current) {
//         annotationsContainerRef.current.innerHTML = '';
//       }

//       const width = container.clientWidth;
//       const height = 70;

//       const chart = createChart(container, {
//         width: width,
//         height: height,
//         layout: {
//           background: { color: 'transparent' },
//           textColor: 'transparent',
//           attributionLogo: false,
//         },
//         grid: { 
//           vertLines: { visible: false }, 
//           horzLines: { visible: false } 
//         },
//         crosshair: { 
//           mode: 0,
//           vertLine: {
//             visible: false,
//             labelVisible: false,
//             style: 0,
//             width: 0
//           },
//           horzLine: {
//             visible: false,
//             labelVisible: false,
//             style: 0,
//             width: 0
//           }
//         },
//         handleScroll: false,
//         handleScale: false,
//         timeScale: { 
//           visible: false,
//           borderVisible: false,
//           timeVisible: false,
//           secondsVisible: false,
//           fixLeftEdge: true,
//           fixRightEdge: true,
//           borderColor: 'transparent',
//           barSpacing: 0.4,
//           minBarSpacing: 0.2,
//         },
//         rightPriceScale: { 
//           visible: false,
//           borderVisible: false,
//           scaleMargins: {
//             top: 0.05,
//             bottom: 0.05,
//           },
//           borderColor: 'transparent',
//           entireTextOnly: true
//         },
//         leftPriceScale: {
//           visible: false,
//           borderColor: 'transparent',
//         }
//       });

//       // Use standard green/red colors for all candles with thinner candles
//       const candleSeries = chart.addCandlestickSeries({
//         upColor: '#10B981',
//         downColor: '#EF4444',
//         borderUpColor: '#10B981',
//         borderDownColor: '#EF4444',
//         wickUpColor: '#10B981',
//         wickDownColor: '#EF4444',
//         wickVisible: true,
//         borderVisible: true,
//         thinBars: true,
//          priceLineVisible: false,   // 🚀 this removes green/red dashed line
//   baseLineVisible: false,
//       });

//       const ohlcData = PATTERN_OHLC_DATA[patternId] || PATTERN_OHLC_DATA["MICRO-S-003"];
//       candleSeries.setData(ohlcData);
      
//       // Fit content with tighter spacing for thinner candles
//       chart.timeScale().fitContent();

//       // Enhanced function to remove ALL dashed lines and unwanted elements
//       const removeAllUnwantedElements = () => {
//         if (!container) return;
        
//         // Remove all lines (including dashed ones)
//         const lines = container.querySelectorAll('line');
//         lines.forEach(line => {
//           // Remove ALL lines regardless of attributes
//           line.remove();
//         });
        
//         // Remove all paths that could be dashed lines or grid elements
//         const paths = container.querySelectorAll('path');
//         paths.forEach(path => {
//           const d = path.getAttribute('d') || '';
//           const strokeDasharray = path.getAttribute('stroke-dasharray');
//           const stroke = path.getAttribute('stroke');
          
//           // Remove if it has dasharray OR if it's a straight line path (grid-like)
//           // OR if it has green color that might be crosshair
//           const hasDashArray = !!strokeDasharray;
//           const isStraightLine = d.includes('M') && (d.includes('V') || d.includes('H'));
//           const isGreenLine = stroke && (stroke.includes('#10B981') || stroke.includes('#059669'));
          
//           if (hasDashArray || isStraightLine || isGreenLine) {
//             path.remove();
//           }
//         });
        
//         // Remove any polyline elements
//         const polylines = container.querySelectorAll('polyline');
//         polylines.forEach(polyline => polyline.remove());
//       };

//       // Remove unwanted elements multiple times to catch any that render later
//       setTimeout(removeAllUnwantedElements, 100);
//       setTimeout(removeAllUnwantedElements, 300);
//       setTimeout(removeAllUnwantedElements, 500);

//       // Add annotations after chart is rendered
//       setTimeout(() => {
//         addPatternAnnotations(chart, patternId, ohlcData);
//       }, 600);
      
//       chartRef.current = chart;
//     };

//     const addPatternAnnotations = (chart, patternId, ohlcData) => {
//       const annotations = PATTERN_ANNOTATIONS[patternId];
//       if (!annotations || !annotationsContainerRef.current) return;

//       const timeScale = chart.timeScale();
      
//       annotations.forEach((annotation, index) => {
//         if (!annotation || index >= ohlcData.length) return;

//         const candle = ohlcData[index];
//         const coordinate = timeScale.timeToCoordinate(candle.time);
        
//         if (coordinate === null) return;

//         const annotationEl = document.createElement('div');
//         annotationEl.className = 'absolute text-xs font-bold pointer-events-none z-10';
//         annotationEl.style.left = `${coordinate - 6}px`;
//         annotationEl.style.top = '2px';
//         annotationEl.style.color = bias === 'bearish' ? '#DC2626' : '#059669';
//         annotationEl.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
//         annotationEl.style.padding = '1px 2px';
//         annotationEl.style.borderRadius = '2px';
//         annotationEl.style.border = `1px solid ${bias === 'bearish' ? '#DC2626' : '#059669'}`;
//         annotationEl.style.fontSize = '7px';
//         annotationEl.style.fontWeight = 'bold';
//         annotationEl.style.lineHeight = '1';
//         annotationEl.style.minWidth = '12px';
//         annotationEl.style.textAlign = 'center';
//         annotationEl.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
//         annotationEl.textContent = annotation;

//         annotationsContainerRef.current.appendChild(annotationEl);
//       });
//     };

//     const timer = setTimeout(initializeChart, 50);

//     return () => {
//       clearTimeout(timer);
//       if (chartRef.current) {
//         chartRef.current.remove();
//         chartRef.current = null;
//       }
//     };
//   }, [patternId, bias, type]);

//   return (
//     <div className="bg-white rounded-md border border-gray-500 shadow-sm w-full overflow-hidden relative dark:bg-gray-800 dark:border-gray-600">
//       <div ref={chartContainerRef} className="w-full h-[70px]" />
//       <div 
//         ref={annotationsContainerRef} 
//         className="absolute inset-0 pointer-events-none z-10"
//       />
//     </div>
//   );
// };

// export default function PatternCard({ 
//   patternId, 
//   name, 
//   bias, 
//   type,
//   isSelected, 
//   onSelect, 
//   isSelectionDisabled 
// }) {
//   const biasStyle = BIAS_CONFIG[bias] || BIAS_CONFIG.neutral;

//   const handleClick = () => {
//     if (!isSelectionDisabled || isSelected) {
//       onSelect(patternId);
//     }
//   };

//   return (
//     <div 
//       className={`
//         relative rounded-md border-2 transition-all duration-300 cursor-pointer
//         w-full max-w-[140px] h-[120px] flex flex-col p-2 mx-auto
//         ${isSelected 
//           ? `${biasStyle.selectedBorder} bg-green-50 shadow-lg scale-105` 
//           : `${biasStyle.border} ${biasStyle.background} shadow-sm hover:shadow-md`
//         }
//         ${isSelectionDisabled && !isSelected 
//           ? 'opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-sm' 
//           : 'hover:scale-105'
//         }
//       `}
//       onClick={handleClick}
//     >
//       {isSelected && (
//         <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
//           <span className="text-white text-xs font-bold">✓</span>
//         </div>
//       )}

//       <div className="flex-1 flex flex-col items-center justify-center w-full">
//         <StaticCandleChart patternId={patternId} bias={bias} type={type} />
//         <h3 className="font-semibold text-gray-900 text-xs mt-2 text-center leading-tight px-1 line-clamp-2">
//           {name}
//         </h3>
//       </div>

//       {isSelectionDisabled && !isSelected && (
//         <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
//           <span className="text-white text-xs font-bold text-center px-2">
//             Maximum 5 Patterns
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }





import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

// Enhanced color scheme
const BIAS_CONFIG = {
  bullish: {
    background: 'bg-gradient-to-br from-green-50 to-emerald-50',
    border: 'border-green-200',
    selectedBorder: 'border-green-500',
    chartColor: '#10B981'
  },
  bearish: {
    background: 'bg-gradient-to-br from-red-50 to-rose-50',
    border: 'border-red-200',
    selectedBorder: 'border-red-500',
    chartColor: '#EF4444'
  },
  neutral: {
    background: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    border: 'border-blue-200',
    selectedBorder: 'border-blue-500',
    chartColor: '#3B82F6'
  },
};

// Pattern annotations mapping
const PATTERN_ANNOTATIONS = {
  // Single Candlestick Patterns
  "MICRO-S-001": [null, null, null, null, null, "BM", null, null, null, null, null], // Bullish Marubozu
  "MICRO-S-002": [null, null, null, null, null, "BM", null, null, null, null, null], // Bearish Marubozu
  "MICRO-S-003": [null, null, null, null, null, "DJ", null, null, null, null, null], // Doji
  "MICRO-S-004": [null, null, null, null, null, "ST", null, null, null, null, null], // Spinning Top
  "MICRO-S-005": [null, null, null, null, null, "HM", null, null, null, null, null], // Hammer
  "MICRO-S-006": [null, null, null, null, null, "HGM", null, null, null, null, null], // Hanging Man
  "MICRO-S-007": [null, null, null, null, null, "SS", null, null, null, null, null], // Shooting Star
  "MICRO-S-008": [null, null, null, null, null, "IH", null, null, null, null, null], // Inverted Hammer
  "MICRO-S-009": [null, null, null, null, null, "DD", null, null, null, null, null], // Dragonfly Doji
  "MICRO-S-010": [null, null, null, null, null, "GD", null, null, null, null, null], // Gravestone Doji

  // Two-Candlestick Patterns
  "MICRO-D-001": [null, null, null, null, null, null, "BE", null, null, null, null], // Bullish Engulfing
  "MICRO-D-002": [null, null, null, null, null, null, "BrE", null, null, null, null], // Bearish Engulfing
  "MICRO-D-003": [null, null, null, null, null, null, "BH", null, null, null, null], // Bullish Harami
  "MICRO-D-004": [null, null, null, null, null, null, "BrH", null, null, null, null], // Bearish Harami
  "MICRO-D-005": [null, null, null, null, null, null, "PP", null, null, null, null], // Piercing Pattern
  "MICRO-D-006": [null, null, null, null, null, null, "DCC", null, null, null, null], // Dark Cloud Cover
  "MICRO-D-007": [null, null, null, null, null, null, "TB", null, null, null, null], // Tweezer Bottom
  "MICRO-D-008": [null, null, null, null, null, null, "TT", null, null, null, null], // Tweezer Top

  // Three-Candlestick Patterns
  "MICRO-T-001": [null, null, null, null, null, null, null, "MS", null, null, null], // Morning Star
  "MICRO-T-002": [null, null, null, null, null, null, null, "ES", null, null, null], // Evening Star
  "MICRO-T-003": [null, null, null, null, null, null, null, "TWS", null, null, null], // Three White Soldiers
  "MICRO-T-004": [null, null, null, null, null, null, null, "TBC", null, null, null], // Three Black Crows
  "MICRO-T-005": [null, null, null, null, null, null, null, "TIU", null, null, null], // Three Inside Up
  "MICRO-T-006": [null, null, null, null, null, null, null, "TID", null, null, null], // Three Inside Down
  "MICRO-T-007": [null, null, null, null, null, null, null, "ABB", null, null, null], // Abandoned Baby Bottom
  "MICRO-T-008": [null, null, null, null, null, null, null, "ABT", null, null, null], // Abandoned Baby Top
};

// Completely unique candle patterns for each pattern type - 12 candles each
const PATTERN_OHLC_DATA = {
  "MICRO-S-001": [ // Bullish Marubozu - Strong uptrend with long green candle
    { time: '2024-01-01', open: 85, high: 87, low: 84, close: 86.5 },
    { time: '2024-01-02', open: 86.5, high: 88, low: 85, close: 87 },
    { time: '2024-01-03', open: 87, high: 89, low: 86, close: 88.5 },
    { time: '2024-01-04', open: 88.5, high: 90, low: 87, close: 89 },
    { time: '2024-01-05', open: 89, high: 91, low: 88, close: 90.5 },
    { time: '2024-01-06', open: 90.5, high: 105, low: 90.5, close: 105 }, // Bullish Marubozu
    { time: '2024-01-07', open: 105, high: 107, low: 103, close: 106 },
    { time: '2024-01-08', open: 106, high: 108, low: 104, close: 107.5 },
    { time: '2024-01-09', open: 107.5, high: 109, low: 106, close: 108 },
    { time: '2024-01-10', open: 108, high: 110, low: 107, close: 109.5 },
    { time: '2024-01-11', open: 109.5, high: 111, low: 108, close: 110 },
    { time: '2024-01-12', open: 110, high: 112, low: 109, close: 111.5 }
  ],
  "MICRO-S-002": [ // Bearish Marubozu - Strong downtrend with long red candle
    { time: '2024-01-01', open: 112, high: 114, low: 111, close: 113.5 },
    { time: '2024-01-02', open: 113.5, high: 115, low: 112, close: 114 },
    { time: '2024-01-03', open: 114, high: 116, low: 113, close: 115.5 },
    { time: '2024-01-04', open: 115.5, high: 117, low: 114, close: 116 },
    { time: '2024-01-05', open: 116, high: 118, low: 115, close: 117.5 },
    { time: '2024-01-06', open: 117.5, high: 117.5, low: 100, close: 100 }, // Bearish Marubozu
    { time: '2024-01-07', open: 100, high: 102, low: 98, close: 99 },
    { time: '2024-01-08', open: 99, high: 101, low: 97, close: 98.5 },
    { time: '2024-01-09', open: 98.5, high: 100, low: 96, close: 97 },
    { time: '2024-01-10', open: 97, high: 99, low: 95, close: 96.5 },
    { time: '2024-01-11', open: 96.5, high: 98, low: 94, close: 95 },
    { time: '2024-01-12', open: 95, high: 97, low: 93, close: 94.5 }
  ],
  "MICRO-S-003": [ // Doji - Sideways movement with perfect doji
    { time: '2024-01-01', open: 75, high: 77, low: 74, close: 76.5 },
    { time: '2024-01-02', open: 76.5, high: 78, low: 75, close: 77 },
    { time: '2024-01-03', open: 77, high: 79, low: 76, close: 78.5 },
    { time: '2024-01-04', open: 78.5, high: 80, low: 77, close: 79 },
    { time: '2024-01-05', open: 79, high: 81, low: 78, close: 80.5 },
    { time: '2024-01-06', open: 80.5, high: 81.5, low: 79.5, close: 80.5 }, // Doji
    { time: '2024-01-07', open: 80.5, high: 82, low: 79, close: 81.5 },
    { time: '2024-01-08', open: 81.5, high: 83, low: 80, close: 82 },
    { time: '2024-01-09', open: 82, high: 84, low: 81, close: 83.5 },
    { time: '2024-01-10', open: 83.5, high: 85, low: 82, close: 84 },
    { time: '2024-01-11', open: 84, high: 86, low: 83, close: 85.5 },
    { time: '2024-01-12', open: 85.5, high: 87, low: 84, close: 86 }
  ],
  "MICRO-S-004": [ // Spinning Top - Small body with wicks
    { time: '2024-01-01', open: 65, high: 67, low: 64, close: 66.5 },
    { time: '2024-01-02', open: 66.5, high: 68, low: 65, close: 67 },
    { time: '2024-01-03', open: 67, high: 69, low: 66, close: 68.5 },
    { time: '2024-01-04', open: 68.5, high: 70, low: 67, close: 69 },
    { time: '2024-01-05', open: 69, high: 71, low: 68, close: 70.5 },
    { time: '2024-01-06', open: 70.5, high: 72, low: 68, close: 70.5 }, // Spinning Top
    { time: '2024-01-07', open: 70.5, high: 72, low: 69, close: 71.5 },
    { time: '2024-01-08', open: 71.5, high: 73, low: 70, close: 72 },
    { time: '2024-01-09', open: 72, high: 74, low: 71, close: 73.5 },
    { time: '2024-01-10', open: 73.5, high: 75, low: 72, close: 74 },
    { time: '2024-01-11', open: 74, high: 76, low: 73, close: 75.5 },
    { time: '2024-01-12', open: 75.5, high: 77, low: 74, close: 76 }
  ],
  "MICRO-S-005": [ // Hammer - Downtrend reversal with long lower wick
    { time: '2024-01-01', open: 95, high: 97, low: 94, close: 93.5 },
    { time: '2024-01-02', open: 93.5, high: 95, low: 92, close: 91 },
    { time: '2024-01-03', open: 91, high: 93, low: 90, close: 89.5 },
    { time: '2024-01-04', open: 89.5, high: 91, low: 88, close: 87 },
    { time: '2024-01-05', open: 87, high: 89, low: 86, close: 85.5 },
    { time: '2024-01-06', open: 85.5, high: 87, low: 75, close: 86 }, // Hammer
    { time: '2024-01-07', open: 86, high: 90, low: 85, close: 89.5 },
    { time: '2024-01-08', open: 89.5, high: 93, low: 88, close: 92 },
    { time: '2024-01-09', open: 92, high: 96, low: 91, close: 95.5 },
    { time: '2024-01-10', open: 95.5, high: 99, low: 94, close: 98 },
    { time: '2024-01-11', open: 98, high: 102, low: 97, close: 101.5 },
    { time: '2024-01-12', open: 101.5, high: 105, low: 100, close: 104 }
  ],
  "MICRO-S-006": [ // Hanging Man - Uptrend reversal with long lower wick
    { time: '2024-01-01', open: 104, high: 106, low: 103, close: 105.5 },
    { time: '2024-01-02', open: 105.5, high: 108, low: 104, close: 107 },
    { time: '2024-01-03', open: 107, high: 110, low: 106, close: 109.5 },
    { time: '2024-01-04', open: 109.5, high: 112, low: 108, close: 111 },
    { time: '2024-01-05', open: 111, high: 114, low: 110, close: 113.5 },
    { time: '2024-01-06', open: 113.5, high: 115, low: 105, close: 114 }, // Hanging Man
    { time: '2024-01-07', open: 114, high: 115, low: 110, close: 111.5 },
    { time: '2024-01-08', open: 111.5, high: 112, low: 107, close: 109 },
    { time: '2024-01-09', open: 109, high: 110, low: 105, close: 106.5 },
    { time: '2024-01-10', open: 106.5, high: 107, low: 102, close: 104 },
    { time: '2024-01-11', open: 104, high: 105, low: 100, close: 101.5 },
    { time: '2024-01-12', open: 101.5, high: 102, low: 97, close: 99 }
  ],
  "MICRO-S-007": [ // Shooting Star - Uptrend reversal with long upper wick
    { time: '2024-01-01', open: 55, high: 57, low: 54, close: 56.5 },
    { time: '2024-01-02', open: 56.5, high: 59, low: 55, close: 58 },
    { time: '2024-01-03', open: 58, high: 61, low: 57, close: 60.5 },
    { time: '2024-01-04', open: 60.5, high: 63, low: 59, close: 62 },
    { time: '2024-01-05', open: 62, high: 65, low: 61, close: 64.5 },
    { time: '2024-01-06', open: 64.5, high: 75, low: 63, close: 65 }, // Shooting Star
    { time: '2024-01-07', open: 65, high: 66, low: 62, close: 63.5 },
    { time: '2024-01-08', open: 63.5, high: 64, low: 60, close: 61 },
    { time: '2024-01-09', open: 61, high: 62, low: 58, close: 59.5 },
    { time: '2024-01-10', open: 59.5, high: 60, low: 56, close: 57 },
    { time: '2024-01-11', open: 57, high: 58, low: 54, close: 55.5 },
    { time: '2024-01-12', open: 55.5, high: 56, low: 52, close: 53 }
  ],
  "MICRO-S-008": [ // Inverted Hammer - Downtrend reversal with long upper wick
    { time: '2024-01-01', open: 53, high: 55, low: 52, close: 51.5 },
    { time: '2024-01-02', open: 51.5, high: 53, low: 50, close: 49 },
    { time: '2024-01-03', open: 49, high: 51, low: 48, close: 47.5 },
    { time: '2024-01-04', open: 47.5, high: 49, low: 46, close: 45 },
    { time: '2024-01-05', open: 45, high: 47, low: 44, close: 43.5 },
    { time: '2024-01-06', open: 43.5, high: 53, low: 43.5, close: 44.5 }, // Inverted Hammer
    { time: '2024-01-07', open: 44.5, high: 48, low: 44, close: 47.5 },
    { time: '2024-01-08', open: 47.5, high: 51, low: 47, close: 50 },
    { time: '2024-01-09', open: 50, high: 54, low: 49, close: 53.5 },
    { time: '2024-01-10', open: 53.5, high: 57, low: 52, close: 56 },
    { time: '2024-01-11', open: 56, high: 60, low: 55, close: 59.5 },
    { time: '2024-01-12', open: 59.5, high: 63, low: 58, close: 62 }
  ],
  "MICRO-S-009": [ // Dragonfly Doji - T-shaped doji with long lower wick
    { time: '2024-01-01', open: 62, high: 64, low: 61, close: 63.5 },
    { time: '2024-01-02', open: 63.5, high: 66, low: 62, close: 65 },
    { time: '2024-01-03', open: 65, high: 68, low: 64, close: 67.5 },
    { time: '2024-01-04', open: 67.5, high: 70, low: 66, close: 69 },
    { time: '2024-01-05', open: 69, high: 72, low: 68, close: 71.5 },
    { time: '2024-01-06', open: 71.5, high: 72, low: 60, close: 71.5 }, // Dragonfly Doji
    { time: '2024-01-07', open: 71.5, high: 75, low: 70, close: 74 },
    { time: '2024-01-08', open: 74, high: 78, low: 73, close: 77.5 },
    { time: '2024-01-09', open: 77.5, high: 81, low: 76, close: 80 },
    { time: '2024-01-10', open: 80, high: 84, low: 79, close: 83.5 },
    { time: '2024-01-11', open: 83.5, high: 87, low: 82, close: 86 },
    { time: '2024-01-12', open: 86, high: 90, low: 85, close: 89.5 }
  ],
  "MICRO-S-010": [ // Gravestone Doji - Inverted T-shaped doji with long upper wick
    { time: '2024-01-01', open: 89.5, high: 91, low: 88, close: 90.5 },
    { time: '2024-01-02', open: 90.5, high: 93, low: 89, close: 92 },
    { time: '2024-01-03', open: 92, high: 95, low: 91, close: 94.5 },
    { time: '2024-01-04', open: 94.5, high: 97, low: 93, close: 96 },
    { time: '2024-01-05', open: 96, high: 99, low: 95, close: 98.5 },
    { time: '2024-01-06', open: 98.5, high: 108, low: 98.5, close: 98.5 }, // Gravestone Doji
    { time: '2024-01-07', open: 98.5, high: 99, low: 96, close: 97 },
    { time: '2024-01-08', open: 97, high: 98, low: 94, close: 95.5 },
    { time: '2024-01-09', open: 95.5, high: 96, low: 92, close: 93 },
    { time: '2024-01-10', open: 93, high: 94, low: 90, close: 91.5 },
    { time: '2024-01-11', open: 91.5, high: 92, low: 88, close: 89 },
    { time: '2024-01-12', open: 89, high: 90, low: 86, close: 87.5 }
  ],
  "MICRO-D-001": [ // Bullish Engulfing - Small red candle followed by large green engulfing
    { time: '2024-01-01', open: 87.5, high: 89, low: 86, close: 85 },
    { time: '2024-01-02', open: 85, high: 87, low: 84, close: 83.5 },
    { time: '2024-01-03', open: 83.5, high: 85, low: 82, close: 81 },
    { time: '2024-01-04', open: 81, high: 83, low: 80, close: 79.5 },
    { time: '2024-01-05', open: 79.5, high: 81, low: 78, close: 77 },
    { time: '2024-01-06', open: 77, high: 79, low: 76, close: 75.5 }, // Small red
    { time: '2024-01-07', open: 74, high: 85, low: 73, close: 84.5 }, // Bullish engulfing
    { time: '2024-01-08', open: 84.5, high: 88, low: 83, close: 87 },
    { time: '2024-01-09', open: 87, high: 91, low: 86, close: 90.5 },
    { time: '2024-01-10', open: 90.5, high: 94, low: 89, close: 93 },
    { time: '2024-01-11', open: 93, high: 97, low: 92, close: 96.5 },
    { time: '2024-01-12', open: 96.5, high: 100, low: 95, close: 99 }
  ],
  "MICRO-D-002": [ // Bearish Engulfing - Small green candle followed by large red engulfing
    { time: '2024-01-01', open: 99, high: 101, low: 98, close: 100.5 },
    { time: '2024-01-02', open: 100.5, high: 103, low: 99, close: 102 },
    { time: '2024-01-03', open: 102, high: 105, low: 101, close: 104.5 },
    { time: '2024-01-04', open: 104.5, high: 107, low: 103, close: 106 },
    { time: '2024-01-05', open: 106, high: 109, low: 105, close: 108.5 },
    { time: '2024-01-06', open: 108.5, high: 110, low: 107, close: 109 }, // Small green
    { time: '2024-01-07', open: 111, high: 111, low: 95, close: 96.5 }, // Bearish engulfing
    { time: '2024-01-08', open: 96.5, high: 98, low: 94, close: 95 },
    { time: '2024-01-09', open: 95, high: 97, low: 93, close: 92.5 },
    { time: '2024-01-10', open: 92.5, high: 94, low: 90, close: 91 },
    { time: '2024-01-11', open: 91, high: 93, low: 89, close: 88.5 },
    { time: '2024-01-12', open: 88.5, high: 90, low: 86, close: 87 }
  ],
  "MICRO-D-003": [ // Bullish Harami - Large red candle followed by small green inside
    { time: '2024-01-01', open: 120, high: 122, low: 119, close: 121.5 },
    { time: '2024-01-02', open: 121.5, high: 124, low: 120, close: 123 },
    { time: '2024-01-03', open: 123, high: 126, low: 122, close: 125.5 },
    { time: '2024-01-04', open: 125.5, high: 128, low: 124, close: 127 },
    { time: '2024-01-05', open: 127, high: 130, low: 126, close: 129.5 },
    { time: '2024-01-06', open: 129.5, high: 130, low: 115, close: 116 }, // Large red
    { time: '2024-01-07', open: 117, high: 119, low: 116, close: 118.5 }, // Bullish harami
    { time: '2024-01-08', open: 118.5, high: 122, low: 117, close: 121 },
    { time: '2024-01-09', open: 121, high: 125, low: 120, close: 124.5 },
    { time: '2024-01-10', open: 124.5, high: 128, low: 123, close: 127 },
    { time: '2024-01-11', open: 127, high: 131, low: 126, close: 130.5 },
    { time: '2024-01-12', open: 130.5, high: 134, low: 129, close: 133 }
  ],
  "MICRO-D-004": [ // Bearish Harami - Large green candle followed by small red inside
    { time: '2024-01-01', open: 70, high: 72, low: 69, close: 71.5 },
    { time: '2024-01-02', open: 71.5, high: 74, low: 70, close: 73 },
    { time: '2024-01-03', open: 73, high: 76, low: 72, close: 75.5 },
    { time: '2024-01-04', open: 75.5, high: 78, low: 74, close: 77 },
    { time: '2024-01-05', open: 77, high: 80, low: 76, close: 79.5 },
    { time: '2024-01-06', open: 79.5, high: 90, low: 79.5, close: 90 }, // Large green
    { time: '2024-01-07', open: 89, high: 91, low: 88, close: 88.5 }, // Bearish harami
    { time: '2024-01-08', open: 88.5, high: 90, low: 87, close: 86 },
    { time: '2024-01-09', open: 86, high: 88, low: 85, close: 83.5 },
    { time: '2024-01-10', open: 83.5, high: 85, low: 82, close: 81 },
    { time: '2024-01-11', open: 81, high: 83, low: 80, close: 78.5 },
    { time: '2024-01-12', open: 78.5, high: 80, low: 77, close: 76 }
  ],
  "MICRO-D-005": [ // Piercing Pattern - Downtrend with piercing green candle
    { time: '2024-01-01', open: 110, high: 112, low: 109, close: 108 },
    { time: '2024-01-02', open: 108, high: 110, low: 107, close: 106 },
    { time: '2024-01-03', open: 106, high: 108, low: 105, close: 104 },
    { time: '2024-01-04', open: 104, high: 106, low: 103, close: 102 },
    { time: '2024-01-05', open: 102, high: 104, low: 101, close: 100 },
    { time: '2024-01-06', open: 100, high: 102, low: 98, close: 99 }, // Red candle
    { time: '2024-01-07', open: 95, high: 105, low: 94, close: 104 }, // Piercing green
    { time: '2024-01-08', open: 104, high: 108, low: 103, close: 107 },
    { time: '2024-01-09', open: 107, high: 111, low: 106, close: 110 },
    { time: '2024-01-10', open: 110, high: 114, low: 109, close: 113 },
    { time: '2024-01-11', open: 113, high: 117, low: 112, close: 116 },
    { time: '2024-01-12', open: 116, high: 120, low: 115, close: 119 }
  ],
  "MICRO-D-006": [ // Dark Cloud Cover - Uptrend with covering red candle
    { time: '2024-01-01', open: 80, high: 82, low: 79, close: 81.5 },
    { time: '2024-01-02', open: 81.5, high: 84, low: 80, close: 83 },
    { time: '2024-01-03', open: 83, high: 86, low: 82, close: 85.5 },
    { time: '2024-01-04', open: 85.5, high: 88, low: 84, close: 87 },
    { time: '2024-01-05', open: 87, high: 90, low: 86, close: 89.5 },
    { time: '2024-01-06', open: 89.5, high: 92, low: 88, close: 91 }, // Green candle
    { time: '2024-01-07', open: 93, high: 93, low: 85, close: 86 }, // Dark cloud
    { time: '2024-01-08', open: 86, high: 88, low: 84, close: 85 },
    { time: '2024-01-09', open: 85, high: 87, low: 83, close: 84 },
    { time: '2024-01-10', open: 84, high: 86, low: 82, close: 83 },
    { time: '2024-01-11', open: 83, high: 85, low: 81, close: 82 },
    { time: '2024-01-12', open: 82, high: 84, low: 80, close: 81 }
  ],
  "MICRO-D-007": [ // Tweezer Bottom - Double bottom with matching lows
    { time: '2024-01-01', open: 95, high: 97, low: 94, close: 93 },
    { time: '2024-01-02', open: 93, high: 95, low: 92, close: 91 },
    { time: '2024-01-03', open: 91, high: 93, low: 90, close: 89 },
    { time: '2024-01-04', open: 89, high: 91, low: 88, close: 87 },
    { time: '2024-01-05', open: 87, high: 89, low: 86, close: 85 },
    { time: '2024-01-06', open: 85, high: 87, low: 80, close: 82 }, // First bottom
    { time: '2024-01-07', open: 83, high: 85, low: 80, close: 84 }, // Tweezer bottom
    { time: '2024-01-08', open: 84, high: 88, low: 83, close: 87 },
    { time: '2024-01-09', open: 87, high: 91, low: 86, close: 90 },
    { time: '2024-01-10', open: 90, high: 94, low: 89, close: 93 },
    { time: '2024-01-11', open: 93, high: 97, low: 92, close: 96 },
    { time: '2024-01-12', open: 96, high: 100, low: 95, close: 99 }
  ],
  "MICRO-D-008": [ // Tweezer Top - Double top with matching highs
    { time: '2024-01-01', open: 105, high: 107, low: 104, close: 106 },
    { time: '2024-01-02', open: 106, high: 109, low: 105, close: 108 },
    { time: '2024-01-03', open: 108, high: 111, low: 107, close: 110 },
    { time: '2024-01-04', open: 110, high: 113, low: 109, close: 112 },
    { time: '2024-01-05', open: 112, high: 115, low: 111, close: 114 },
    { time: '2024-01-06', open: 114, high: 120, low: 113, close: 115 }, // First top
    { time: '2024-01-07', open: 116, high: 120, low: 115, close: 117 }, // Tweezer top
    { time: '2024-01-08', open: 117, high: 119, low: 114, close: 116 },
    { time: '2024-01-09', open: 116, high: 118, low: 113, close: 115 },
    { time: '2024-01-10', open: 115, high: 117, low: 112, close: 114 },
    { time: '2024-01-11', open: 114, high: 116, low: 111, close: 113 },
    { time: '2024-01-12', open: 113, high: 115, low: 110, close: 112 }
  ],
  "MICRO-T-001": [ // Morning Star - Downtrend reversal pattern
    { time: '2024-01-01', open: 100, high: 102, low: 99, close: 98 },
    { time: '2024-01-02', open: 98, high: 100, low: 97, close: 96 },
    { time: '2024-01-03', open: 96, high: 98, low: 95, close: 94 },
    { time: '2024-01-04', open: 94, high: 96, low: 93, close: 92 },
    { time: '2024-01-05', open: 92, high: 94, low: 91, close: 90 },
    { time: '2024-01-06', open: 90, high: 92, low: 88, close: 89 }, // Long red
    { time: '2024-01-07', open: 87, high: 89, low: 86, close: 88 }, // Small doji/star
    { time: '2024-01-08', open: 90, high: 96, low: 89, close: 95 }, // Long green
    { time: '2024-01-09', open: 95, high: 99, low: 94, close: 98 },
    { time: '2024-01-10', open: 98, high: 102, low: 97, close: 101 },
    { time: '2024-01-11', open: 101, high: 105, low: 100, close: 104 },
    { time: '2024-01-12', open: 104, high: 108, low: 103, close: 107 }
  ],
  "MICRO-T-002": [ // Evening Star - Uptrend reversal pattern
    { time: '2024-01-01', open: 107, high: 109, low: 106, close: 108 },
    { time: '2024-01-02', open: 108, high: 111, low: 107, close: 110 },
    { time: '2024-01-03', open: 110, high: 113, low: 109, close: 112 },
    { time: '2024-01-04', open: 112, high: 115, low: 111, close: 114 },
    { time: '2024-01-05', open: 114, high: 117, low: 113, close: 116 },
    { time: '2024-01-06', open: 116, high: 120, low: 115, close: 119 }, // Long green
    { time: '2024-01-07', open: 119, high: 121, low: 118, close: 120 }, // Small doji/star
    { time: '2024-01-08', open: 118, high: 119, low: 110, close: 111 }, // Long red
    { time: '2024-01-09', open: 111, high: 113, low: 109, close: 110 },
    { time: '2024-01-10', open: 110, high: 112, low: 108, close: 109 },
    { time: '2024-01-11', open: 109, high: 111, low: 107, close: 108 },
    { time: '2024-01-12', open: 108, high: 110, low: 106, close: 107 }
  ],
  "MICRO-T-003": [ // Three White Soldiers - Strong uptrend
    { time: '2024-01-01', open: 60, high: 62, low: 59, close: 61 },
    { time: '2024-01-02', open: 61, high: 63, low: 60, close: 62 },
    { time: '2024-01-03', open: 62, high: 64, low: 61, close: 63 },
    { time: '2024-01-04', open: 63, high: 65, low: 62, close: 64 },
    { time: '2024-01-05', open: 64, high: 66, low: 63, close: 65 },
    { time: '2024-01-06', open: 65, high: 68, low: 64, close: 67 }, // First soldier
    { time: '2024-01-07', open: 67, high: 70, low: 66, close: 69 }, // Second soldier
    { time: '2024-01-08', open: 69, high: 72, low: 68, close: 71 }, // Third soldier
    { time: '2024-01-09', open: 71, high: 74, low: 70, close: 73 },
    { time: '2024-01-10', open: 73, high: 76, low: 72, close: 75 },
    { time: '2024-01-11', open: 75, high: 78, low: 74, close: 77 },
    { time: '2024-01-12', open: 77, high: 80, low: 76, close: 79 }
  ],
  "MICRO-T-004": [ // Three Black Crows - Strong downtrend
    { time: '2024-01-01', open: 79, high: 81, low: 78, close: 80 },
    { time: '2024-01-02', open: 80, high: 82, low: 79, close: 81 },
    { time: '2024-01-03', open: 81, high: 83, low: 80, close: 82 },
    { time: '2024-01-04', open: 82, high: 84, low: 81, close: 83 },
    { time: '2024-01-05', open: 83, high: 85, low: 82, close: 84 },
    { time: '2024-01-06', open: 84, high: 85, low: 80, close: 81 }, // First crow
    { time: '2024-01-07', open: 81, high: 82, low: 77, close: 78 }, // Second crow
    { time: '2024-01-08', open: 78, high: 79, low: 74, close: 75 }, // Third crow
    { time: '2024-01-09', open: 75, high: 76, low: 72, close: 73 },
    { time: '2024-01-10', open: 73, high: 74, low: 70, close: 71 },
    { time: '2024-01-11', open: 71, high: 72, low: 68, close: 69 },
    { time: '2024-01-12', open: 69, high: 70, low: 66, close: 67 }
  ]
};

const StaticCandleChart = ({ patternId, bias, type }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const annotationsContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const initializeChart = () => {
      const container = chartContainerRef.current;
      if (!container) return;

      // Clean up previous chart
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      // Clear previous annotations
      if (annotationsContainerRef.current) {
        annotationsContainerRef.current.innerHTML = '';
      }

      const width = container.clientWidth;
      const height = 70;

      const chart = createChart(container, {
        width: width,
        height: height,
        layout: {
          background: { color: 'transparent' },
          textColor: 'transparent',
          attributionLogo: false,
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false }
        },
        crosshair: {
          mode: 0,
          vertLine: {
            visible: false,
            labelVisible: false,
            style: 0,
            width: 0
          },
          horzLine: {
            visible: false,
            labelVisible: false,
            style: 0,
            width: 0
          }
        },
        handleScroll: false,
        handleScale: false,
        timeScale: {
          visible: false,
          borderVisible: false,
          timeVisible: false,
          secondsVisible: false,
          fixLeftEdge: true,
          fixRightEdge: true,
          borderColor: 'transparent',
          barSpacing: 0.4,
          minBarSpacing: 0.2,
        },
        rightPriceScale: {
          visible: false,
          borderVisible: false,
          scaleMargins: {
            top: 0.05,
            bottom: 0.05,
          },
          borderColor: 'transparent',
          entireTextOnly: true
        },
        leftPriceScale: {
          visible: false,
          borderColor: 'transparent',
        }
      });

      // Use standard green/red colors for all candles with thinner candles
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10B981',
        downColor: '#EF4444',
        borderUpColor: '#10B981',
        borderDownColor: '#EF4444',
        wickUpColor: '#10B981',
        wickDownColor: '#EF4444',
        wickVisible: true,
        borderVisible: true,
        thinBars: true,
        priceLineVisible: false,   // 🚀 this removes green/red dashed line
        baseLineVisible: false,
      });

      const ohlcData = PATTERN_OHLC_DATA[patternId] || PATTERN_OHLC_DATA["MICRO-S-003"];
      candleSeries.setData(ohlcData);

      // Fit content with tighter spacing for thinner candles
      chart.timeScale().fitContent();

      // Enhanced function to remove ALL dashed lines and unwanted elements
      const removeAllUnwantedElements = () => {
        if (!container) return;

        // Remove all lines (including dashed ones)
        const lines = container.querySelectorAll('line');
        lines.forEach(line => {
          // Remove ALL lines regardless of attributes
          line.remove();
        });

        // Remove all paths that could be dashed lines or grid elements
        const paths = container.querySelectorAll('path');
        paths.forEach(path => {
          const d = path.getAttribute('d') || '';
          const strokeDasharray = path.getAttribute('stroke-dasharray');
          const stroke = path.getAttribute('stroke');

          // Remove if it has dasharray OR if it's a straight line path (grid-like)
          // OR if it has green color that might be crosshair
          const hasDashArray = !!strokeDasharray;
          const isStraightLine = d.includes('M') && (d.includes('V') || d.includes('H'));
          const isGreenLine = stroke && (stroke.includes('#10B981') || stroke.includes('#059669'));

          if (hasDashArray || isStraightLine || isGreenLine) {
            path.remove();
          }
        });

        // Remove any polyline elements
        const polylines = container.querySelectorAll('polyline');
        polylines.forEach(polyline => polyline.remove());
      };

      // Remove unwanted elements multiple times to catch any that render later
      setTimeout(removeAllUnwantedElements, 100);
      setTimeout(removeAllUnwantedElements, 300);
      setTimeout(removeAllUnwantedElements, 500);

      // Add annotations after chart is rendered
      setTimeout(() => {
        addPatternAnnotations(chart, patternId, ohlcData);
      }, 600);

      chartRef.current = chart;
    };

    const addPatternAnnotations = (chart, patternId, ohlcData) => {
      const annotations = PATTERN_ANNOTATIONS[patternId];
      if (!annotations || !annotationsContainerRef.current) return;

      const timeScale = chart.timeScale();

      annotations.forEach((annotation, index) => {
        if (!annotation || index >= ohlcData.length) return;

        const candle = ohlcData[index];
        const coordinate = timeScale.timeToCoordinate(candle.time);

        if (coordinate === null) return;

        const annotationEl = document.createElement('div');
        annotationEl.className = 'absolute text-xs font-bold pointer-events-none z-10';
        annotationEl.style.left = `${coordinate - 6}px`;
        annotationEl.style.top = '2px';
        annotationEl.style.color = bias === 'bearish' ? '#DC2626' : '#059669';
        annotationEl.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        annotationEl.style.padding = '1px 2px';
        annotationEl.style.borderRadius = '2px';
        annotationEl.style.border = `1px solid ${bias === 'bearish' ? '#DC2626' : '#059669'}`;
        annotationEl.style.fontSize = '7px';
        annotationEl.style.fontWeight = 'bold';
        annotationEl.style.lineHeight = '1';
        annotationEl.style.minWidth = '12px';
        annotationEl.style.textAlign = 'center';
        annotationEl.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        annotationEl.textContent = annotation;

        annotationsContainerRef.current.appendChild(annotationEl);
      });
    };

    const timer = setTimeout(initializeChart, 50);

    return () => {
      clearTimeout(timer);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [patternId, bias, type]);

  return (
    <div className="bg-white rounded-md border border-gray-500 shadow-sm w-full overflow-hidden relative dark:bg-gray-800 dark:border-gray-600">
      <div ref={chartContainerRef} className="w-full h-[70px]" />
      <div
        ref={annotationsContainerRef}
        className="absolute inset-0 pointer-events-none z-10"
      />
    </div>
  );
};

export default function PatternCard({
  patternId,
  name,
  bias,
  type,
  isSelected,
  onSelect,
  isSelectionDisabled
}) {
  const biasStyle = BIAS_CONFIG[bias] || BIAS_CONFIG.neutral;

  const handleClick = () => {
    if (!isSelectionDisabled || isSelected) {
      onSelect(patternId);
    }
  };

  return (
    <div
      className={`
        relative rounded-md border-2 transition-all duration-300 cursor-pointer
        w-full max-w-[140px] h-[120px] flex flex-col p-2 mx-auto
        ${isSelected
          ? `${biasStyle.selectedBorder} bg-green-50 shadow-lg scale-105`
          : `${biasStyle.border} ${biasStyle.background} shadow-sm hover:shadow-md`
        }
        ${isSelectionDisabled && !isSelected
          ? 'opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-sm'
          : 'hover:scale-105'
        }
      `}
      onClick={handleClick}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <StaticCandleChart patternId={patternId} bias={bias} type={type} />
        <h3 className="font-semibold text-gray-900 text-xs mt-2 text-center leading-tight px-1 line-clamp-2">
          {name}
        </h3>
      </div>

      {isSelectionDisabled && !isSelected && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <span className="text-white text-xs font-bold text-center px-2">
            Maximum 5 Patterns
          </span>
        </div>
      )}
    </div>
  );
}
