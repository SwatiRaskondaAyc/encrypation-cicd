// import React, { useState, useMemo, useEffect } from 'react';
// import { createPortal } from 'react-dom';
// import { Search, X, TrendingUp, Activity, BarChart2, Zap, Layers } from 'lucide-react';

// const INDICATOR_CATEGORIES = {
//     TREND: 'Trend',
//     OSCILLATOR: 'Oscillators',
//     VOLATILITY: 'Volatility',
//     VOLUME: 'Volume',
// };

// export const AVAILABLE_INDICATORS = [
//     // --- TREND ---
//     { id: 'EMA', name: 'Exponential Moving Average', category: INDICATOR_CATEGORIES.TREND, description: 'Reacts more significantly to recent price changes.', defParams: { period: 20 }, presets: [8, 9, 10, 20, 21, 34, 50, 100, 200], color: '#FF6D00' },
//     { id: 'SMA', name: 'Simple Moving Average', category: INDICATOR_CATEGORIES.TREND, description: 'The average of prices over a specific period.', defParams: { period: 20 }, presets: [20, 50, 100, 200], color: '#2962FF' },
//     { id: 'WMA', name: 'Weighted Moving Average', category: INDICATOR_CATEGORIES.TREND, description: 'Assigns more weight to recent data points.', defParams: { period: 20 }, color: '#00E676' },
//     { id: 'MACD', name: 'MACD', category: INDICATOR_CATEGORIES.TREND, description: 'Moving Average Convergence Divergence.', defParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }, color: '#2962FF' },
//     { id: 'SuperTrend', name: 'SuperTrend', category: INDICATOR_CATEGORIES.TREND, description: 'Trend-following indicator like moving averages.', defParams: { period: 10, multiplier: 3 }, color: '#D500F9' },
//     { id: 'Ichimoku', name: 'Ichimoku Cloud', category: INDICATOR_CATEGORIES.TREND, description: 'Collection of indicators showing support/resistance.', defParams: { conversionPeriod: 9, basePeriod: 26, spanPeriod: 52, displacement: 26 }, color: '#FFAB00' },
//     { id: 'PSAR', name: 'Parabolic SAR', category: INDICATOR_CATEGORIES.TREND, description: 'Highlights potential reversals.', defParams: { step: 0.02, max: 0.2 }, color: '#00B0FF' },
//     { id: 'ADX', name: 'Average Directional Index', category: INDICATOR_CATEGORIES.TREND, description: 'Measures trend strength.', defParams: { period: 14 }, color: '#FF6D00' },
//     { id: 'DMI', name: 'Directional Movement Index', category: INDICATOR_CATEGORIES.TREND, description: 'Identifies in which direction the price is moving.', defParams: { period: 14 }, color: '#2979FF' },
//     { id: 'HMA', name: 'Hull Moving Average', category: INDICATOR_CATEGORIES.TREND, description: 'Reduces lag while improving smoothing.', defParams: { period: 9 }, color: '#F50057' },
//     { id: 'TEMA', name: 'Triple EMA', category: INDICATOR_CATEGORIES.TREND, description: 'Triple Exponential Moving Average.', defParams: { period: 20 }, color: '#FFAB00' },
//     { id: 'KAMA', name: 'Kaufman Adaptive MA', category: INDICATOR_CATEGORIES.TREND, description: 'Adjusts to market noise.', defParams: { period: 10, fastPeriod: 2, slowPeriod: 30 }, color: '#651FFF' },
//     { id: 'GMMA', name: 'Guppy Multiple MA', category: INDICATOR_CATEGORIES.TREND, description: 'Identifies changing trends.', defParams: { shortPeriods: [3, 5, 8, 10, 12, 15], longPeriods: [30, 35, 40, 45, 50, 60] }, color: '#00E676' },
//     { id: 'HeikenAshi', name: 'Heiken Ashi', category: INDICATOR_CATEGORIES.TREND, description: 'Modified candles for trend visualization.', defParams: {}, color: '#2962FF' },

//     // --- OSCILLATORS ---
//     { id: 'RSI', name: 'Relative Strength Index', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Momentum oscillator.', defParams: { period: 14 }, presets: [2, 5, 7, 14, 21], color: '#9C27B0' },
//     { id: 'STOCH', name: 'Stochastic Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Momentum indicator.', defParams: { period: 14, signalPeriod: 3 }, presets: ['5-3-3', '14-3-3', '21-9-9'], color: '#2979FF' },
//     { id: 'StochRSI', name: 'Stochastic RSI', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Stochastic applied to RSI.', defParams: { rsiPeriod: 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3 }, color: '#D500F9' },
//     { id: 'CCI', name: 'Commodity Channel Index', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Identifies cyclical turns.', defParams: { period: 20 }, color: '#00E676' },
//     { id: 'WILLR', name: 'Williams %R', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Momentum indicator.', defParams: { period: 14 }, color: '#651FFF' },
//     { id: 'ROC', name: 'Rate of Change', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Percentage change in price.', defParams: { period: 14 }, color: '#FFAB00' },
//     { id: 'UO', name: 'Ultimate Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Combines short, medium, and long-term periods.', defParams: { period1: 7, period2: 14, period3: 28 }, color: '#FF6D00' },
//     { id: 'MFI', name: 'Money Flow Index', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Volume-weighted RSI.', defParams: { period: 14 }, color: '#00B0FF' },
//     { id: 'ChaikinOsc', name: 'Chaikin Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Momentum of the Accumulation/Distribution Line.', defParams: { fastPeriod: 3, slowPeriod: 10 }, color: '#FFAB00' },
//     { id: 'DeM', name: 'DeMarker', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Identifies potential price exhaustion.', defParams: { period: 14 }, color: '#2962FF' },
//     { id: 'AO', name: 'Awesome Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Market momentum.', defParams: { fastPeriod: 5, slowPeriod: 34 }, color: '#FF6D00' },
//     { id: 'Klinger', name: 'Klinger Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Volume-based trend confirmation.', defParams: { fastPeriod: 34, slowPeriod: 55, signalPeriod: 13 }, color: '#651FFF' },
//     { id: 'TRIX', name: 'TRIX', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Triple-smoothed EMA oscillator.', defParams: { period: 18 }, color: '#D500F9' },

//     // --- VOLATILITY ---
//     { id: 'BB', name: 'Bollinger Bands', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Volatility bands.', defParams: { period: 20, stdDev: 2 }, color: '#2979FF' },
//     { id: 'ATR', name: 'Average True Range', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Market volatility.', defParams: { period: 14 }, color: '#F50057' },
//     { id: 'DC', name: 'Donchian Channels', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Highest high and lowest low.', defParams: { period: 20 }, color: '#F50057' },
//     { id: 'KC', name: 'Keltner Channels', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Volatility-based bands.', defParams: { period: 20, multiplier: 1 }, color: '#651FFF' },
//     { id: 'ChaikinVol', name: 'Chaikin Volatility', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Change in spread between high and low.', defParams: { period: 10, rocPeriod: 10 }, color: '#FFAB00' },
//     { id: 'HV', name: 'Historical Volatility', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Statistical measure of dispersion.', defParams: { period: 10 }, color: '#2962FF' },

//     // --- VOLUME ---
//     { id: 'OBV', name: 'On Balance Volume', category: INDICATOR_CATEGORIES.VOLUME, description: 'Volume flow.', defParams: {}, color: '#2962FF' },
//     { id: 'VWAP', name: 'VWAP', category: INDICATOR_CATEGORIES.VOLUME, description: 'Volume Weighted Average Price.', defParams: {}, color: '#FF6D00' },
//     { id: 'AD', name: 'Accumulation/Distribution', category: INDICATOR_CATEGORIES.VOLUME, description: 'Supply and demand.', defParams: {}, color: '#00E676' },
//     { id: 'FI', name: 'Force Index', category: INDICATOR_CATEGORIES.VOLUME, description: 'Power behind a move.', defParams: { period: 13 }, color: '#00E676' },
//     { id: 'CMF', name: 'Chaikin Money Flow', category: INDICATOR_CATEGORIES.VOLUME, description: 'Money Flow Volume over a period.', defParams: { period: 20 }, color: '#00B0FF' },
//     { id: 'EOM', name: 'Ease of Movement', category: INDICATOR_CATEGORIES.VOLUME, description: 'Relationship between price and volume.', defParams: { period: 14 }, color: '#FFAB00' },
//     { id: 'VolOsc', name: 'Volume Oscillator', category: INDICATOR_CATEGORIES.VOLUME, description: 'Difference between two moving averages of volume.', defParams: { shortPeriod: 5, longPeriod: 10 }, color: '#651FFF' },
// ];

// const IndicatorMenu = ({ isOpen, onClose, activeIndicators, onApply }) => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('ALL');
//     const [mounted, setMounted] = useState(false);

//     // Local state for indicators selected in the menu
//     const [tempSelected, setTempSelected] = useState([]);

//     useEffect(() => {
//         setMounted(true);
//         return () => setMounted(false);
//     }, []);

//     // Sync local state with props when opening
//     useEffect(() => {
//         if (isOpen) {
//             setTempSelected(activeIndicators);
//         }
//     }, [isOpen, activeIndicators]);

//     const filteredIndicators = useMemo(() => {
//         return AVAILABLE_INDICATORS.filter(ind => {
//             const matchesSearch = ind.name.toLowerCase().includes(searchQuery.toLowerCase()) || ind.id.toLowerCase().includes(searchQuery.toLowerCase());
//             const matchesCategory = selectedCategory === 'ALL' || ind.category === selectedCategory;
//             return matchesSearch && matchesCategory;
//         });
//     }, [searchQuery, selectedCategory]);

//     const toggleSelection = (indicator, paramOverride = null) => {
//         setTempSelected(prev => {
//             const effectiveParams = paramOverride ? { ...indicator.defParams, ...paramOverride } : indicator.defParams;

//             // Check if ANY instance of this indicator exists
//             const existingIndex = prev.findIndex(i => i.id === indicator.id);

//             if (existingIndex >= 0) {
//                 // If it exists...
//                 if (paramOverride) {
//                     // If we are setting specific params (from dropdown), UPDATE the existing one
//                     // This creates a "Replace" behavior which makes changing ranges easy
//                     const newSelected = [...prev];
//                     newSelected[existingIndex] = {
//                         ...newSelected[existingIndex],
//                         params: effectiveParams,
//                         // Keep same UUID to prevent re-render flicker if possible, or new one? 
//                         // New one ensures chart updates if logic relies on unique ID for new series
//                         uuid: `${indicator.id}-${Date.now()}-${Math.random()}`
//                     };
//                     return newSelected;
//                 } else {
//                     // If no params passed (row click), just TOGGLE OFF
//                     return prev.filter((_, i) => i !== existingIndex);
//                 }
//             } else {
//                 // Add new
//                 return [...prev, {
//                     ...indicator,
//                     params: effectiveParams,
//                     uuid: `${indicator.id}-${Date.now()}-${Math.random()}`
//                 }];
//             }
//         });
//     };

//     const handlePresetChange = (e, indicator) => {
//         e.stopPropagation(); // Prevent toggling the row
//         const value = e.target.value;
//         if (!value) return;

//         if (value === 'REMOVE') {
//             // Remove the indicator
//             toggleSelection(indicator, null);
//             return;
//         }

//         let newParams = {};
//         if (indicator.id === 'STOCH') {
//             const [p, k, d] = value.split('-').map(Number);
//             newParams = { period: p, signalPeriod: k };
//         } else {
//             newParams = { period: Number(value) };
//         }

//         toggleSelection(indicator, newParams);
//     };

//     const getSelectedValue = (indicator) => {
//         const found = tempSelected.find(i => i.id === indicator.id);
//         if (!found) return "";

//         if (indicator.id === 'STOCH') {
//             // Reconstruct string
//             // Assuming default dPeriod=3 for now as it's not in the simple string
//             // The preset strings are like '14-3-3'
//             // We stored period and signalPeriod.
//             // Let's try to match with presets
//             const p = found.params.period;
//             const k = found.params.signalPeriod;
//             // Find preset that starts with "p-k"
//             const match = indicator.presets.find(pre => pre.startsWith(`${p}-${k}`));
//             return match || "";
//         }

//         return found.params.period || "";
//     };

//     const handleApply = () => {
//         onApply(tempSelected);
//     };

//     const isSelected = (indicator) => {
//         return tempSelected.some(i => i.id === indicator.id);
//     };

//     if (!isOpen || !mounted) return null;

//     const categories = [
//         { id: 'ALL', label: 'All Indicators', icon: Layers },
//         { id: INDICATOR_CATEGORIES.TREND, label: 'Trend', icon: TrendingUp },
//         { id: INDICATOR_CATEGORIES.OSCILLATOR, label: 'Oscillators', icon: Activity },
//         { id: INDICATOR_CATEGORIES.VOLATILITY, label: 'Volatility', icon: Zap },
//         { id: INDICATOR_CATEGORIES.VOLUME, label: 'Volume', icon: BarChart2 },
//     ];

//     const content = (
//         <div className="fixed inset-0 flex items-center justify-center bg-transparent p-4 animate-in fade-in duration-200" style={{ zIndex: 9999999 }}>
//             {/* Click outside listener (invisible backdrop) */}
//             <div className="absolute inset-0" onClick={onClose} />

//             {/* Modal Container - Compact Floating Panel */}
//             <div
//                 className="relative bg-white text-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200"
//                 style={{ backgroundColor: '#ffffff', width: '850px', height: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
//             >
//                 <div className="flex flex-1 overflow-hidden">
//                     {/* Left Column: Categories */}
//                     <div className="w-56 bg-gray-50 border-r border-gray-100 flex flex-col py-4" style={{ backgroundColor: '#f9fafb' }}>
//                         <div className="px-5 mb-4">
//                             <h2 className="text-lg font-bold text-gray-900 tracking-tight">Indicators</h2>
//                         </div>

//                         <div className="flex-1 overflow-y-auto px-2 space-y-1">
//                             {categories.map(cat => {
//                                 const Icon = cat.icon;
//                                 const isActive = selectedCategory === cat.id;
//                                 return (
//                                     <button
//                                         key={cat.id}
//                                         onClick={() => setSelectedCategory(cat.id)}
//                                         className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
//                                             ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
//                                             : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
//                                             }`}
//                                     >
//                                         <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
//                                         {cat.label}
//                                     </button>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* Right Column: Search + List */}
//                     <div className="flex-1 flex flex-col bg-white" style={{ backgroundColor: '#ffffff' }}>
//                         {/* Top: Search Bar */}
//                         <div className="p-4 border-b border-gray-100">
//                             <div className="relative group">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search indicators..."
//                                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
//                                     style={{ backgroundColor: '#f9fafb' }}
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     autoFocus
//                                 />
//                             </div>
//                         </div>

//                         {/* Bottom: List of Indicators */}
//                         <div className="flex-1 overflow-y-auto p-2">
//                             <div className="grid grid-cols-1 gap-1">
//                                 {filteredIndicators.map(ind => {
//                                     const active = isSelected(ind); // Simple check for ID match

//                                     return (
//                                         <div
//                                             key={ind.id}
//                                             onClick={() => !ind.presets && toggleSelection(ind)}
//                                             className={`group flex items-center justify-between p-3 mx-1 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${active && !ind.presets
//                                                 ? 'bg-blue-50 border-blue-100'
//                                                 : 'hover:bg-gray-50 hover:border-gray-100'
//                                                 }`}
//                                         >
//                                             <div className="flex items-center gap-3 flex-1">
//                                                 {/* Indicator Icon/Badge */}
//                                                 <div
//                                                     className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors ${active
//                                                         ? 'bg-blue-100 text-blue-700'
//                                                         : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm group-hover:text-blue-600'
//                                                         }`}
//                                                 >
//                                                     {ind.id.substring(0, 2)}
//                                                 </div>

//                                                 <div className="flex-1">
//                                                     <div className="flex items-center gap-2 justify-between">
//                                                         <h3 className={`text-sm font-semibold ${active ? 'text-blue-700' : 'text-gray-900'}`}>
//                                                             {ind.name}
//                                                         </h3>

//                                                         {/* Dropdown for Presets */}
//                                                         {ind.presets && (
//                                                             <select
//                                                                 onClick={(e) => e.stopPropagation()}
//                                                                 onChange={(e) => handlePresetChange(e, ind)}
//                                                                 className="ml-2 text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
//                                                                 value={getSelectedValue(ind)}
//                                                             >
//                                                                 <option value="" disabled>Select Range</option>
//                                                                 <option value="REMOVE" className="text-red-500 font-semibold">Remove</option>
//                                                                 {ind.presets.map(p => (
//                                                                     <option key={p} value={p}>
//                                                                         {p}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         )}
//                                                     </div>
//                                                     <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
//                                                         {ind.description}
//                                                     </p>
//                                                 </div>
//                                             </div>

//                                             {/* Toggle/Status (Only for non-preset indicators or generic check) */}
//                                             {!ind.presets && (
//                                                 <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${active
//                                                     ? 'bg-blue-600 border-blue-600 text-white'
//                                                     : 'border-gray-200 text-transparent group-hover:border-gray-300'
//                                                     }`}>
//                                                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                                                     </svg>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}

//                                 {filteredIndicators.length === 0 && (
//                                     <div className="flex flex-col items-center justify-center h-48 text-center">
//                                         <Search className="w-8 h-8 text-gray-300 mb-3" />
//                                         <h3 className="text-gray-900 font-medium text-sm">No indicators found</h3>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer: Apply Button */}
//                 <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3" style={{ backgroundColor: '#f9fafb' }}>
//                     <button
//                         onClick={onClose}
//                         className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleApply}
//                         className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all active:scale-95"
//                     >
//                         Apply Indicators
//                     </button>
//                 </div>

//             </div>
//         </div>
//     );

//     // Use createPortal to render the modal at the document body level
//     // This ensures it sits on top of all other elements (z-index fix)
//     return createPortal(content, document.body);
// };

// export default IndicatorMenu;


import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, TrendingUp, Activity, BarChart2, Zap, Layers } from 'lucide-react';

const INDICATOR_CATEGORIES = {
    TREND: 'Trend',
    OSCILLATOR: 'Oscillators',
    VOLATILITY: 'Volatility',
    VOLUME: 'Volume',
};

export const AVAILABLE_INDICATORS = [
    // --- TREND ---
    { id: 'EMA', name: 'Exponential Moving Average', category: INDICATOR_CATEGORIES.TREND, description: 'Reacts more significantly to recent price changes.', defParams: { period: 20 }, presets: [8, 9, 10, 20, 21, 34, 50, 100, 200], color: '#FF6D00' },
    { id: 'SMA', name: 'Simple Moving Average', category: INDICATOR_CATEGORIES.TREND, description: 'The average of prices over a specific period.', defParams: { period: 20 }, presets: [20, 50, 100, 200], color: '#2962FF' },
    { id: 'WMA', name: 'Weighted Moving Average', category: INDICATOR_CATEGORIES.TREND, description: 'Assigns more weight to recent data points.', defParams: { period: 20 }, color: '#00E676' },
    { id: 'MACD', name: 'MACD', category: INDICATOR_CATEGORIES.TREND, description: 'Moving Average Convergence Divergence.', defParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 }, color: '#2962FF' },
    { id: 'SuperTrend', name: 'SuperTrend', category: INDICATOR_CATEGORIES.TREND, description: 'Trend-following indicator like moving averages.', defParams: { period: 10, multiplier: 3 }, color: '#D500F9' },
    { id: 'Ichimoku', name: 'Ichimoku Cloud', category: INDICATOR_CATEGORIES.TREND, description: 'Collection of indicators showing support/resistance.', defParams: { conversionPeriod: 9, basePeriod: 26, spanPeriod: 52, displacement: 26 }, color: '#FFAB00' },
    { id: 'PSAR', name: 'Parabolic SAR', category: INDICATOR_CATEGORIES.TREND, description: 'Highlights potential reversals.', defParams: { step: 0.02, max: 0.2 }, color: '#00B0FF' },
    { id: 'ADX', name: 'Average Directional Index', category: INDICATOR_CATEGORIES.TREND, description: 'Measures trend strength.', defParams: { period: 14 }, color: '#FF6D00' },
    { id: 'DMI', name: 'Directional Movement Index', category: INDICATOR_CATEGORIES.TREND, description: 'Identifies in which direction the price is moving.', defParams: { period: 14 }, color: '#2979FF' },
    { id: 'HMA', name: 'Hull Moving Average', category: INDICATOR_CATEGORIES.TREND, description: 'Reduces lag while improving smoothing.', defParams: { period: 9 }, color: '#F50057' },
    { id: 'TEMA', name: 'Triple EMA', category: INDICATOR_CATEGORIES.TREND, description: 'Triple Exponential Moving Average.', defParams: { period: 20 }, color: '#FFAB00' },
    { id: 'KAMA', name: 'Kaufman Adaptive MA', category: INDICATOR_CATEGORIES.TREND, description: 'Adjusts to market noise.', defParams: { period: 10, fastPeriod: 2, slowPeriod: 30 }, color: '#651FFF' },
    { id: 'GMMA', name: 'Guppy Multiple MA', category: INDICATOR_CATEGORIES.TREND, description: 'Identifies changing trends.', defParams: { shortPeriods: [3, 5, 8, 10, 12, 15], longPeriods: [30, 35, 40, 45, 50, 60] }, color: '#00E676' },
    { id: 'HeikenAshi', name: 'Heiken Ashi', category: INDICATOR_CATEGORIES.TREND, description: 'Modified candles for trend visualization.', defParams: {}, color: '#2962FF' },

    // --- OSCILLATORS ---
    { id: 'RSI', name: 'Relative Strength Index', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Momentum oscillator.', defParams: { period: 14 }, presets: [2, 5, 7, 14, 21], color: '#9C27B0' },
    { id: 'STOCH', name: 'Stochastic Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Momentum indicator.', defParams: { period: 14, signalPeriod: 3 }, presets: ['5-3-3', '14-3-3', '21-9-9'], color: '#2979FF' },
    { id: 'StochRSI', name: 'Stochastic RSI', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Stochastic applied to RSI.', defParams: { rsiPeriod: 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3 }, color: '#D500F9' },
    { id: 'CCI', name: 'Commodity Channel Index', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Identifies cyclical turns.', defParams: { period: 20 }, color: '#00E676' },
    { id: 'WILLR', name: 'Williams %R', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Momentum indicator.', defParams: { period: 14 }, color: '#651FFF' },
    { id: 'ROC', name: 'Rate of Change', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Percentage change in price.', defParams: { period: 14 }, color: '#FFAB00' },
    { id: 'UO', name: 'Ultimate Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Combines short, medium, and long-term periods.', defParams: { period1: 7, period2: 14, period3: 28 }, color: '#FF6D00' },
    { id: 'MFI', name: 'Money Flow Index', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Volume-weighted RSI.', defParams: { period: 14 }, color: '#00B0FF' },
    { id: 'ChaikinOsc', name: 'Chaikin Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Momentum of the Accumulation/Distribution Line.', defParams: { fastPeriod: 3, slowPeriod: 10 }, color: '#FFAB00' },
    { id: 'DeM', name: 'DeMarker', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Identifies potential price exhaustion.', defParams: { period: 14 }, color: '#2962FF' },
    { id: 'AO', name: 'Awesome Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Market momentum.', defParams: { fastPeriod: 5, slowPeriod: 34 }, color: '#FF6D00' },
    { id: 'Klinger', name: 'Klinger Oscillator', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Volume-based trend confirmation.', defParams: { fastPeriod: 34, slowPeriod: 55, signalPeriod: 13 }, color: '#651FFF' },
    { id: 'TRIX', name: 'TRIX', category: INDICATOR_CATEGORIES.OSCILLATOR, description: 'Triple-smoothed EMA oscillator.', defParams: { period: 18 }, color: '#D500F9' },

    // --- VOLATILITY ---
    { id: 'BB', name: 'Bollinger Bands', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Volatility bands.', defParams: { period: 20, stdDev: 2 }, color: '#2979FF' },
    { id: 'ATR', name: 'Average True Range', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Market volatility.', defParams: { period: 14 }, color: '#F50057' },
    { id: 'DC', name: 'Donchian Channels', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Highest high and lowest low.', defParams: { period: 20 }, color: '#F50057' },
    { id: 'KC', name: 'Keltner Channels', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Volatility-based bands.', defParams: { period: 20, multiplier: 1 }, color: '#651FFF' },
    { id: 'ChaikinVol', name: 'Chaikin Volatility', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Change in spread between high and low.', defParams: { period: 10, rocPeriod: 10 }, color: '#FFAB00' },
    { id: 'HV', name: 'Historical Volatility', category: INDICATOR_CATEGORIES.VOLATILITY, description: 'Statistical measure of dispersion.', defParams: { period: 10 }, color: '#2962FF' },

    // --- VOLUME ---
    { id: 'OBV', name: 'On Balance Volume', category: INDICATOR_CATEGORIES.VOLUME, description: 'Volume flow.', defParams: {}, color: '#2962FF' },
    { id: 'VWAP', name: 'VWAP', category: INDICATOR_CATEGORIES.VOLUME, description: 'Volume Weighted Average Price.', defParams: {}, color: '#FF6D00' },
    { id: 'AD', name: 'Accumulation/Distribution', category: INDICATOR_CATEGORIES.VOLUME, description: 'Supply and demand.', defParams: {}, color: '#00E676' },
    { id: 'FI', name: 'Force Index', category: INDICATOR_CATEGORIES.VOLUME, description: 'Power behind a move.', defParams: { period: 13 }, color: '#00E676' },
    { id: 'CMF', name: 'Chaikin Money Flow', category: INDICATOR_CATEGORIES.VOLUME, description: 'Money Flow Volume over a period.', defParams: { period: 20 }, color: '#00B0FF' },
    { id: 'EOM', name: 'Ease of Movement', category: INDICATOR_CATEGORIES.VOLUME, description: 'Relationship between price and volume.', defParams: { period: 14 }, color: '#FFAB00' },
    { id: 'VolOsc', name: 'Volume Oscillator', category: INDICATOR_CATEGORIES.VOLUME, description: 'Difference between two moving averages of volume.', defParams: { shortPeriod: 5, longPeriod: 10 }, color: '#651FFF' },
];

const IndicatorMenu = ({ isOpen, onClose, activeIndicators, onApply, portalTarget = null }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [mounted, setMounted] = useState(false);

    // Local state for indicators selected in the menu
    const [tempSelected, setTempSelected] = useState([]);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Sync local state with props when opening
    useEffect(() => {
        if (isOpen) {
            setTempSelected(activeIndicators);
        }
    }, [isOpen, activeIndicators]);

    const filteredIndicators = useMemo(() => {
        return AVAILABLE_INDICATORS.filter(ind => {
            const matchesSearch = ind.name.toLowerCase().includes(searchQuery.toLowerCase()) || ind.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || ind.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const toggleSelection = (indicator, paramOverride = null) => {
        setTempSelected(prev => {
            const effectiveParams = paramOverride ? { ...indicator.defParams, ...paramOverride } : indicator.defParams;

            // Check if ANY instance of this indicator exists
            const existingIndex = prev.findIndex(i => i.id === indicator.id);

            if (existingIndex >= 0) {
                // If it exists...
                if (paramOverride) {
                    // If we are setting specific params (from dropdown), UPDATE the existing one
                    // This creates a "Replace" behavior which makes changing ranges easy
                    const newSelected = [...prev];
                    newSelected[existingIndex] = {
                        ...newSelected[existingIndex],
                        params: effectiveParams,
                        // Keep same UUID to prevent re-render flicker if possible, or new one? 
                        // New one ensures chart updates if logic relies on unique ID for new series
                        uuid: `${indicator.id}-${Date.now()}-${Math.random()}`
                    };
                    return newSelected;
                } else {
                    // If no params passed (row click), just TOGGLE OFF
                    return prev.filter((_, i) => i !== existingIndex);
                }
            } else {
                // Add new
                return [...prev, {
                    ...indicator,
                    params: effectiveParams,
                    uuid: `${indicator.id}-${Date.now()}-${Math.random()}`
                }];
            }
        });
    };

    const handlePresetChange = (e, indicator) => {
        e.stopPropagation(); // Prevent toggling the row
        const value = e.target.value;
        if (!value) return;

        if (value === 'REMOVE') {
            // Remove the indicator
            toggleSelection(indicator, null);
            return;
        }

        let newParams = {};
        if (indicator.id === 'STOCH') {
            const [p, k, d] = value.split('-').map(Number);
            newParams = { period: p, signalPeriod: k };
        } else {
            newParams = { period: Number(value) };
        }

        toggleSelection(indicator, newParams);
    };

    const getSelectedValue = (indicator) => {
        const found = tempSelected.find(i => i.id === indicator.id);
        if (!found) return "";

        if (indicator.id === 'STOCH') {
            // Reconstruct string
            // Assuming default dPeriod=3 for now as it's not in the simple string
            // The preset strings are like '14-3-3'
            // We stored period and signalPeriod.
            // Let's try to match with presets
            const p = found.params.period;
            const k = found.params.signalPeriod;
            // Find preset that starts with "p-k"
            const match = indicator.presets.find(pre => pre.startsWith(`${p}-${k}`));
            return match || "";
        }

        return found.params.period || "";
    };

    const handleApply = () => {
        onApply(tempSelected);
    };

    const isSelected = (indicator) => {
        return tempSelected.some(i => i.id === indicator.id);
    };

    if (!isOpen || !mounted) return null;

    const categories = [
        { id: 'ALL', label: 'All Indicators', icon: Layers },
        { id: INDICATOR_CATEGORIES.TREND, label: 'Trend', icon: TrendingUp },
        { id: INDICATOR_CATEGORIES.OSCILLATOR, label: 'Oscillators', icon: Activity },
        { id: INDICATOR_CATEGORIES.VOLATILITY, label: 'Volatility', icon: Zap },
        { id: INDICATOR_CATEGORIES.VOLUME, label: 'Volume', icon: BarChart2 },
    ];

    const content = (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent p-4 animate-in fade-in duration-200" style={{ zIndex: 9999999 }}>
            {/* Click outside listener (invisible backdrop) */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Container - Compact Floating Panel */}
            <div
                className="relative bg-white text-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200"
                style={{ backgroundColor: '#ffffff', width: '850px', height: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
            >
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Column: Categories */}
                    <div className="w-56 bg-gray-50 border-r border-gray-100 flex flex-col py-4" style={{ backgroundColor: '#f9fafb' }}>
                        <div className="px-5 mb-4">
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Indicators</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 space-y-1">
                            {categories.map(cat => {
                                const Icon = cat.icon;
                                const isActive = selectedCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Search + List */}
                    <div className="flex-1 flex flex-col bg-white" style={{ backgroundColor: '#ffffff' }}>
                        {/* Top: Search Bar */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search indicators..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                                    style={{ backgroundColor: '#f9fafb' }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Bottom: List of Indicators */}
                        <div className="flex-1 overflow-y-auto p-2">
                            <div className="grid grid-cols-1 gap-1">
                                {filteredIndicators.map(ind => {
                                    const active = isSelected(ind); // Simple check for ID match

                                    return (
                                        <div
                                            key={ind.id}
                                            onClick={() => !ind.presets && toggleSelection(ind)}
                                            className={`group flex items-center justify-between p-3 mx-1 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${active && !ind.presets
                                                ? 'bg-blue-50 border-blue-100'
                                                : 'hover:bg-gray-50 hover:border-gray-100'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                {/* Indicator Icon/Badge */}
                                                <div
                                                    className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors ${active
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm group-hover:text-blue-600'
                                                        }`}
                                                >
                                                    {ind.id.substring(0, 2)}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 justify-between">
                                                        <h3 className={`text-sm font-semibold ${active ? 'text-blue-700' : 'text-gray-900'}`}>
                                                            {ind.name}
                                                        </h3>

                                                        {/* Dropdown for Presets */}
                                                        {ind.presets && (
                                                            <select
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => handlePresetChange(e, ind)}
                                                                className="ml-2 text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
                                                                value={getSelectedValue(ind)}
                                                            >
                                                                <option value="" disabled>Select Range</option>
                                                                <option value="REMOVE" className="text-red-500 font-semibold">Remove</option>
                                                                {ind.presets.map(p => (
                                                                    <option key={p} value={p}>
                                                                        {p}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                                                        {ind.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Toggle/Status (Only for non-preset indicators or generic check) */}
                                            {!ind.presets && (
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${active
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'border-gray-200 text-transparent group-hover:border-gray-300'
                                                    }`}>
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {filteredIndicators.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-48 text-center">
                                        <Search className="w-8 h-8 text-gray-300 mb-3" />
                                        <h3 className="text-gray-900 font-medium text-sm">No indicators found</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: Apply Button */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3" style={{ backgroundColor: '#f9fafb' }}>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all active:scale-95"
                    >
                        Apply Indicators
                    </button>
                </div>

            </div>
        </div>
    );

    // Use createPortal to render the modal at the provided target or document body
    // When the chart is fullscreen the app should pass the chart container as the portalTarget
    return createPortal(content, portalTarget || document.body);
};

export default IndicatorMenu;