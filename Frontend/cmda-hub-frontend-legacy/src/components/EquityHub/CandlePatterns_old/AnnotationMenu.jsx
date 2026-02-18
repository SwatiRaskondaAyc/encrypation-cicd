// import React, { useState, useMemo, useEffect } from 'react';
// import { createPortal } from 'react-dom';
// import {
//     Search, X, TrendingUp, Minus, Circle, Square,
//     GitBranch, Grid3X3, BarChart3, Target, Waves,
//     PenTool, Type, Eraser, MousePointer, TriangleRight
// } from 'lucide-react';

// const ANNOTATION_CATEGORIES = {
//     LINES: 'Lines',
//     FIBONACCI: 'Fibonacci',
//     GANN: 'Gann',
//     PATTERNS: 'Patterns',
//     TOOLS: 'Tools',
// };

// export const AVAILABLE_ANNOTATIONS = [
//     // --- LINES ---
//     { id: 'line', name: 'Trend Line', category: ANNOTATION_CATEGORIES.LINES, description: 'Draw a straight line between two points.', icon: TrendingUp, color: '#2962FF' },
//     { id: 'horizontalLine', name: 'Horizontal Line', category: ANNOTATION_CATEGORIES.LINES, description: 'Horizontal support/resistance line.', icon: Minus, color: '#00E676' },
//     { id: 'verticalLine', name: 'Vertical Line', category: ANNOTATION_CATEGORIES.LINES, description: 'Mark specific time points.', icon: Minus, color: '#FF6D00' },

//     // --- FIBONACCI ---
//     { id: 'fibRetracement', name: 'Fib Retracement', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Key retracement levels (23.6%, 38.2%, 50%, 61.8%).', icon: GitBranch, color: '#f59e0b' },
//     { id: 'fibExtension', name: 'Trend-Based Fib Extension', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Project price targets beyond the move.', icon: GitBranch, color: '#ff9800' },
//     { id: 'fibChannel', name: 'Fib Channel', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Parallel channels at Fibonacci distances.', icon: GitBranch, color: '#ffc107' },
//     { id: 'fibTimeZone', name: 'Fib Time Zone', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Vertical lines at Fibonacci time intervals.', icon: GitBranch, color: '#cddc39' },
//     { id: 'fibSpeedFan', name: 'Fib Speed Resistance Fan', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Fan lines combining price and time.', icon: GitBranch, color: '#8bc34a' },
//     { id: 'fibTimeBased', name: 'Trend-Based Fib Time', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Time-based Fibonacci projections.', icon: GitBranch, color: '#4caf50' },
//     { id: 'fibCircles', name: 'Fib Circles', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Circular support/resistance at Fib ratios.', icon: Circle, color: '#009688' },
//     { id: 'fibSpiral', name: 'Fib Spiral', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Golden spiral pattern overlay.', icon: Circle, color: '#00bcd4' },
//     { id: 'fibArcs', name: 'Fib Speed Resistance Arcs', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Arc-based support/resistance zones.', icon: Circle, color: '#03a9f4' },
//     { id: 'fibWedge', name: 'Fib Wedge', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Wedge pattern with Fib levels.', icon: TriangleRight, color: '#2196f3' },

//     // --- GANN ---
//     { id: 'pitchfan', name: 'Pitchfan', category: ANNOTATION_CATEGORIES.GANN, description: 'Andrew\'s Pitchfork variation with fan lines.', icon: BarChart3, color: '#9c27b0' },
//     { id: 'gannBox', name: 'Gann Box', category: ANNOTATION_CATEGORIES.GANN, description: 'Grid with Gann angles and divisions.', icon: Grid3X3, color: '#8b5cf6' },
//     { id: 'gannSquareFixed', name: 'Gann Square Fixed', category: ANNOTATION_CATEGORIES.GANN, description: 'Fixed-size Gann Square grid.', icon: Square, color: '#a855f7' },
//     { id: 'gannSquare', name: 'Gann Square', category: ANNOTATION_CATEGORIES.GANN, description: 'Scalable Gann Square analysis.', icon: Square, color: '#7c3aed' },
//     { id: 'gannFan', name: 'Gann Fan', category: ANNOTATION_CATEGORIES.GANN, description: 'Fan lines at Gann angles (1x1, 2x1, etc.).', icon: BarChart3, color: '#14b8a6' },

//     // --- PATTERNS ---
//     { id: 'elliottImpulse', name: 'Elliott Impulse Wave (12345)', category: ANNOTATION_CATEGORIES.PATTERNS, description: '5-wave impulse pattern markup.', icon: Waves, color: '#ec4899' },
//     { id: 'elliottCorrection', name: 'Elliott Correction Wave (ABC)', category: ANNOTATION_CATEGORIES.PATTERNS, description: '3-wave correction pattern markup.', icon: Waves, color: '#f43f5e' },
//     { id: 'elliottTriangle', name: 'Elliott Triangle (ABCDE)', category: ANNOTATION_CATEGORIES.PATTERNS, description: 'Triangle correction pattern.', icon: Waves, color: '#ef4444' },
//     { id: 'elliottCombo', name: 'Elliott Combination (WXY)', category: ANNOTATION_CATEGORIES.PATTERNS, description: 'Complex correction pattern.', icon: Waves, color: '#f97316' },

//     // --- TOOLS ---
//     { id: 'text', name: 'Text Note', category: ANNOTATION_CATEGORIES.TOOLS, description: 'Add text labels to the chart.', icon: Type, color: '#607D8B' },
//     { id: 'eraser', name: 'Eraser', category: ANNOTATION_CATEGORIES.TOOLS, description: 'Click on drawings to delete them.', icon: Eraser, color: '#ef4444' },
// ];

// const AnnotationMenu = ({ isOpen, onClose, activeTool, onSelectTool }) => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('ALL');
//     const [mounted, setMounted] = useState(false);

//     useEffect(() => {
//         setMounted(true);
//         return () => setMounted(false);
//     }, []);

//     const filteredAnnotations = useMemo(() => {
//         return AVAILABLE_ANNOTATIONS.filter(ann => {
//             const matchesSearch = ann.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 ann.id.toLowerCase().includes(searchQuery.toLowerCase());
//             const matchesCategory = selectedCategory === 'ALL' || ann.category === selectedCategory;
//             return matchesSearch && matchesCategory;
//         });
//     }, [searchQuery, selectedCategory]);

//     const handleSelect = (annotation) => {
//         onSelectTool(annotation.id === activeTool ? null : annotation.id);
//         onClose();
//     };

//     if (!isOpen || !mounted) return null;

//     const categories = [
//         { id: 'ALL', label: 'All Tools', icon: PenTool },
//         { id: ANNOTATION_CATEGORIES.LINES, label: 'Lines', icon: TrendingUp },
//         { id: ANNOTATION_CATEGORIES.FIBONACCI, label: 'Fibonacci', icon: GitBranch },
//         { id: ANNOTATION_CATEGORIES.GANN, label: 'Gann', icon: Grid3X3 },
//         { id: ANNOTATION_CATEGORIES.PATTERNS, label: 'Patterns', icon: Waves },
//         { id: ANNOTATION_CATEGORIES.TOOLS, label: 'Tools', icon: Target },
//     ];

//     const content = (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/20 p-4 animate-in fade-in duration-200" style={{ zIndex: 9999999 }}>
//             <div className="absolute inset-0" onClick={onClose} />

//             <div
//                 className="relative bg-white text-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200"
//                 style={{ width: '900px', maxWidth: '95vw', height: '600px', maxHeight: '90vh' }}
//             >
//                 <div className="flex flex-1 overflow-hidden">
//                     {/* Left Column: Categories */}
//                     <div className="w-56 bg-gray-50 border-r border-gray-100 flex flex-col py-4">
//                         <div className="px-5 mb-4">
//                             <h2 className="text-lg font-bold text-gray-900 tracking-tight">Drawing Tools</h2>
//                             <p className="text-xs text-gray-500 mt-1">Select a tool to annotate the chart</p>
//                         </div>

//                         <div className="flex-1 overflow-y-auto px-2 space-y-1">
//                             {categories.map(cat => {
//                                 const Icon = cat.icon;
//                                 const isActive = selectedCategory === cat.id;
//                                 const count = cat.id === 'ALL'
//                                     ? AVAILABLE_ANNOTATIONS.length
//                                     : AVAILABLE_ANNOTATIONS.filter(a => a.category === cat.id).length;

//                                 return (
//                                     <button
//                                         key={cat.id}
//                                         onClick={() => setSelectedCategory(cat.id)}
//                                         className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
//                                             ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
//                                             : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
//                                             }`}
//                                     >
//                                         <div className="flex items-center gap-3">
//                                             <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
//                                             {cat.label}
//                                         </div>
//                                         <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
//                                             {count}
//                                         </span>
//                                     </button>
//                                 );
//                             })}
//                         </div>

//                         <div className="px-3 pt-3 border-t border-gray-200 mt-2">
//                             <button
//                                 onClick={() => { onSelectTool(null); onClose(); }}
//                                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${activeTool === null
//                                         ? 'bg-slate-800 text-white'
//                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                             >
//                                 <MousePointer className="w-4 h-4" />
//                                 Selection Mode
//                             </button>
//                         </div>
//                     </div>

//                     {/* Right Column */}
//                     <div className="flex-1 flex flex-col bg-white">
//                         <div className="p-4 border-b border-gray-100">
//                             <div className="relative group">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search drawing tools..."
//                                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     autoFocus
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex-1 overflow-y-auto p-3">
//                             <div className="grid grid-cols-2 gap-2">
//                                 {filteredAnnotations.map(ann => {
//                                     const active = activeTool === ann.id;
//                                     const Icon = ann.icon;

//                                     return (
//                                         <div
//                                             key={ann.id}
//                                             onClick={() => handleSelect(ann)}
//                                             className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${active
//                                                 ? 'bg-blue-50 border-blue-200 shadow-sm'
//                                                 : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
//                                                 }`}
//                                         >
//                                             <div
//                                                 className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${active
//                                                     ? 'bg-blue-100'
//                                                     : 'bg-gray-100 group-hover:bg-white group-hover:shadow-sm'
//                                                     }`}
//                                                 style={{ color: ann.color }}
//                                             >
//                                                 <Icon className="w-5 h-5" />
//                                             </div>

//                                             <div className="flex-1 min-w-0">
//                                                 <h3 className={`text-sm font-semibold truncate ${active ? 'text-blue-700' : 'text-gray-900'}`}>
//                                                     {ann.name}
//                                                 </h3>
//                                                 <p className="text-[10px] text-gray-500 truncate">
//                                                     {ann.description}
//                                                 </p>
//                                             </div>

//                                             {active && <div className="w-2 h-2 rounded-full bg-blue-500" />}
//                                         </div>
//                                     );
//                                 })}

//                                 {filteredAnnotations.length === 0 && (
//                                     <div className="col-span-2 flex flex-col items-center justify-center h-48 text-center">
//                                         <Search className="w-8 h-8 text-gray-300 mb-3" />
//                                         <h3 className="text-gray-900 font-medium text-sm">No tools found</h3>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
//                     <p className="text-xs text-gray-500">
//                         {activeTool ? (
//                             <span>Active: <span className="font-semibold text-blue-600">{AVAILABLE_ANNOTATIONS.find(a => a.id === activeTool)?.name || 'None'}</span></span>
//                         ) : (
//                             <span>Click and drag on chart to draw</span>
//                         )}
//                     </p>
//                     <button
//                         onClick={onClose}
//                         className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );

//     return createPortal(content, document.body);
// };

// export default AnnotationMenu;

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Search, X, TrendingUp, Minus, Circle, Square,
    GitBranch, Grid3X3, BarChart3, Target, Waves,
    PenTool, Type, Eraser, MousePointer, TriangleRight
} from 'lucide-react';

const ANNOTATION_CATEGORIES = {
    LINES: 'Lines',
    FIBONACCI: 'Fibonacci',
    GANN: 'Gann',
    PATTERNS: 'Patterns',
    TOOLS: 'Tools',
};

export const AVAILABLE_ANNOTATIONS = [
    // --- LINES ---
    { id: 'line', name: 'Trend Line', category: ANNOTATION_CATEGORIES.LINES, description: 'Draw a straight line between two points.', icon: TrendingUp, color: '#2962FF' },
    { id: 'horizontalLine', name: 'Horizontal Line', category: ANNOTATION_CATEGORIES.LINES, description: 'Horizontal support/resistance line.', icon: Minus, color: '#00E676' },
    { id: 'verticalLine', name: 'Vertical Line', category: ANNOTATION_CATEGORIES.LINES, description: 'Mark specific time points.', icon: Minus, color: '#FF6D00' },

    // --- FIBONACCI ---
    { id: 'fibRetracement', name: 'Fib Retracement', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Key retracement levels (23.6%, 38.2%, 50%, 61.8%).', icon: GitBranch, color: '#f59e0b' },
    { id: 'fibExtension', name: 'Trend-Based Fib Extension', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Project price targets beyond the move.', icon: GitBranch, color: '#ff9800' },
    { id: 'fibChannel', name: 'Fib Channel', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Parallel channels at Fibonacci distances.', icon: GitBranch, color: '#ffc107' },
    { id: 'fibTimeZone', name: 'Fib Time Zone', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Vertical lines at Fibonacci time intervals.', icon: GitBranch, color: '#cddc39' },
    { id: 'fibSpeedFan', name: 'Fib Speed Resistance Fan', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Fan lines combining price and time.', icon: GitBranch, color: '#8bc34a' },
    { id: 'fibTimeBased', name: 'Trend-Based Fib Time', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Time-based Fibonacci projections.', icon: GitBranch, color: '#4caf50' },
    { id: 'fibCircles', name: 'Fib Circles', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Circular support/resistance at Fib ratios.', icon: Circle, color: '#009688' },
    { id: 'fibSpiral', name: 'Fib Spiral', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Golden spiral pattern overlay.', icon: Circle, color: '#00bcd4' },
    { id: 'fibArcs', name: 'Fib Speed Resistance Arcs', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Arc-based support/resistance zones.', icon: Circle, color: '#03a9f4' },
    { id: 'fibWedge', name: 'Fib Wedge', category: ANNOTATION_CATEGORIES.FIBONACCI, description: 'Wedge pattern with Fib levels.', icon: TriangleRight, color: '#2196f3' },

    // --- GANN ---
    { id: 'pitchfan', name: 'Pitchfan', category: ANNOTATION_CATEGORIES.GANN, description: 'Andrew\'s Pitchfork variation with fan lines.', icon: BarChart3, color: '#9c27b0' },
    { id: 'gannBox', name: 'Gann Box', category: ANNOTATION_CATEGORIES.GANN, description: 'Grid with Gann angles and divisions.', icon: Grid3X3, color: '#8b5cf6' },
    { id: 'gannSquareFixed', name: 'Gann Square Fixed', category: ANNOTATION_CATEGORIES.GANN, description: 'Fixed-size Gann Square grid.', icon: Square, color: '#a855f7' },
    { id: 'gannSquare', name: 'Gann Square', category: ANNOTATION_CATEGORIES.GANN, description: 'Scalable Gann Square analysis.', icon: Square, color: '#7c3aed' },
    { id: 'gannFan', name: 'Gann Fan', category: ANNOTATION_CATEGORIES.GANN, description: 'Fan lines at Gann angles (1x1, 2x1, etc.).', icon: BarChart3, color: '#14b8a6' },

    // --- PATTERNS ---
    { id: 'elliottImpulse', name: 'Elliott Impulse Wave (12345)', category: ANNOTATION_CATEGORIES.PATTERNS, description: '5-wave impulse pattern markup.', icon: Waves, color: '#ec4899' },
    { id: 'elliottCorrection', name: 'Elliott Correction Wave (ABC)', category: ANNOTATION_CATEGORIES.PATTERNS, description: '3-wave correction pattern markup.', icon: Waves, color: '#f43f5e' },
    { id: 'elliottTriangle', name: 'Elliott Triangle (ABCDE)', category: ANNOTATION_CATEGORIES.PATTERNS, description: 'Triangle correction pattern.', icon: Waves, color: '#ef4444' },
    { id: 'elliottCombo', name: 'Elliott Combination (WXY)', category: ANNOTATION_CATEGORIES.PATTERNS, description: 'Complex correction pattern.', icon: Waves, color: '#f97316' },

    // --- TOOLS ---
    { id: 'text', name: 'Text Note', category: ANNOTATION_CATEGORIES.TOOLS, description: 'Add text labels to the chart.', icon: Type, color: '#607D8B' },
    { id: 'eraser', name: 'Eraser', category: ANNOTATION_CATEGORIES.TOOLS, description: 'Click on drawings to delete them.', icon: Eraser, color: '#ef4444' },
];

const AnnotationMenu = ({ isOpen, onClose, activeTool, onSelectTool, portalTarget = null }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const filteredAnnotations = useMemo(() => {
        return AVAILABLE_ANNOTATIONS.filter(ann => {
            const matchesSearch = ann.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ann.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || ann.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const handleSelect = (annotation) => {
        onSelectTool(annotation.id === activeTool ? null : annotation.id);
        onClose();
    };

    if (!isOpen || !mounted) return null;

    const categories = [
        { id: 'ALL', label: 'All Tools', icon: PenTool },
        { id: ANNOTATION_CATEGORIES.LINES, label: 'Lines', icon: TrendingUp },
        { id: ANNOTATION_CATEGORIES.FIBONACCI, label: 'Fibonacci', icon: GitBranch },
        { id: ANNOTATION_CATEGORIES.GANN, label: 'Gann', icon: Grid3X3 },
        { id: ANNOTATION_CATEGORIES.PATTERNS, label: 'Patterns', icon: Waves },
        { id: ANNOTATION_CATEGORIES.TOOLS, label: 'Tools', icon: Target },
    ];

    const content = (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 p-4 animate-in fade-in duration-200" style={{ zIndex: 9999999 }}>
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className="relative bg-white text-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200"
                style={{ width: '900px', maxWidth: '95vw', height: '600px', maxHeight: '90vh' }}
            >
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Column: Categories */}
                    <div className="w-56 bg-gray-50 border-r border-gray-100 flex flex-col py-4">
                        <div className="px-5 mb-4">
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Drawing Tools</h2>
                            <p className="text-xs text-gray-500 mt-1">Select a tool to annotate the chart</p>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 space-y-1">
                            {categories.map(cat => {
                                const Icon = cat.icon;
                                const isActive = selectedCategory === cat.id;
                                const count = cat.id === 'ALL'
                                    ? AVAILABLE_ANNOTATIONS.length
                                    : AVAILABLE_ANNOTATIONS.filter(a => a.category === cat.id).length;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                                            {cat.label}
                                        </div>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="px-3 pt-3 border-t border-gray-200 mt-2">
                            <button
                                onClick={() => { onSelectTool(null); onClose(); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${activeTool === null
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <MousePointer className="w-4 h-4" />
                                Selection Mode
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 flex flex-col bg-white">
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search drawing tools..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3">
                            <div className="grid grid-cols-2 gap-2">
                                {filteredAnnotations.map(ann => {
                                    const active = activeTool === ann.id;
                                    const Icon = ann.icon;

                                    return (
                                        <div
                                            key={ann.id}
                                            onClick={() => handleSelect(ann)}
                                            className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${active
                                                ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                                                }`}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${active
                                                    ? 'bg-blue-100'
                                                    : 'bg-gray-100 group-hover:bg-white group-hover:shadow-sm'
                                                    }`}
                                                style={{ color: ann.color }}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-sm font-semibold truncate ${active ? 'text-blue-700' : 'text-gray-900'}`}>
                                                    {ann.name}
                                                </h3>
                                                <p className="text-[10px] text-gray-500 truncate">
                                                    {ann.description}
                                                </p>
                                            </div>

                                            {active && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                        </div>
                                    );
                                })}

                                {filteredAnnotations.length === 0 && (
                                    <div className="col-span-2 flex flex-col items-center justify-center h-48 text-center">
                                        <Search className="w-8 h-8 text-gray-300 mb-3" />
                                        <h3 className="text-gray-900 font-medium text-sm">No tools found</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        {activeTool ? (
                            <span>Active: <span className="font-semibold text-blue-600">{AVAILABLE_ANNOTATIONS.find(a => a.id === activeTool)?.name || 'None'}</span></span>
                        ) : (
                            <span>Click and drag on chart to draw</span>
                        )}
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(content, portalTarget || document.body);
};

export default AnnotationMenu;