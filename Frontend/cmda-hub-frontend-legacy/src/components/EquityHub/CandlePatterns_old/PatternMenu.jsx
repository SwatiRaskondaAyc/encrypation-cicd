// import React, { useState, useMemo, useEffect } from 'react';
// import { createPortal } from 'react-dom';
// import { Search, X, TrendingUp, Activity, BarChart2, Layers, CandlestickChart } from 'lucide-react';
// import { PatternRegistry } from './Data/PatternRegistry';

// const PatternMenu = ({ isOpen, onClose, activePatterns = [], onApply }) => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedBias, setSelectedBias] = useState('ALL');
//     const [mounted, setMounted] = useState(false);

//     // Patterns from Registry
//     // Convert object to array for mapping
//     const availablePatterns = Object.entries(PatternRegistry.patterns).map(([id, meta]) => ({
//         id: id,
//         ...meta
//     }));

//     // Local state for patterns selected in the menu
//     // We store just the IDs for simplicity in checking, or full objects?
//     // activePatterns prop should probably be an array of IDs or objects.
//     // Let's assume onApply expects an array of pattern IDs strings.
//     const [tempSelected, setTempSelected] = useState([]);

//     useEffect(() => {
//         setMounted(true);
//         return () => setMounted(false);
//     }, []);

//     useEffect(() => {
//         if (isOpen) {
//             setTempSelected(activePatterns);
//         }
//     }, [isOpen, activePatterns]);

//     const filteredPatterns = useMemo(() => {
//         return availablePatterns.filter(pat => {
//             const matchesSearch = pat.name.toLowerCase().includes(searchQuery.toLowerCase()) || pat.shortName.toLowerCase().includes(searchQuery.toLowerCase());
//             const matchesBias = selectedBias === 'ALL' || pat.bias === selectedBias;
//             return matchesSearch && matchesBias;
//         });
//     }, [searchQuery, selectedBias, availablePatterns]);

//     const toggleSelection = (patternId) => {
//         setTempSelected(prev => {
//             if (prev.includes(patternId)) {
//                 return prev.filter(id => id !== patternId);
//             } else {
//                 return [...prev, patternId];
//             }
//         });
//     };

//     const handleApply = () => {
//         onApply(tempSelected);
//     };

//     if (!isOpen || !mounted) return null;

//     const categories = [
//         { id: 'ALL', label: 'All Patterns', icon: Layers },
//         { id: 'bullish', label: 'Bullish', icon: TrendingUp },
//         { id: 'bearish', label: 'Bearish', icon: TrendingUp, className: 'rotate-180' },
//         { id: 'neutral', label: 'Neutral', icon: Activity },
//     ];

//     const content = (
//         <div className="fixed inset-0 flex items-center justify-center bg-transparent p-4 animate-in fade-in duration-200" style={{ zIndex: 9999999 }}>
//             {/* Click outside listener */}
//             <div className="absolute inset-0" onClick={onClose} />

//             {/* Modal Container */}
//             <div
//                 className="relative bg-white text-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200"
//                 style={{ backgroundColor: '#ffffff', width: '850px', height: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
//             >
//                 <div className="flex flex-1 overflow-hidden">
//                     {/* Left Column: Categories */}
//                     <div className="w-56 bg-gray-50 border-r border-gray-100 flex flex-col py-4" style={{ backgroundColor: '#f9fafb' }}>
//                         <div className="px-5 mb-4">
//                             <h2 className="text-lg font-bold text-gray-900 tracking-tight">Patterns</h2>
//                         </div>

//                         <div className="flex-1 overflow-y-auto px-2 space-y-1">
//                             {categories.map(cat => {
//                                 const Icon = cat.icon;
//                                 const isActive = selectedBias === cat.id;
//                                 return (
//                                     <button
//                                         key={cat.id}
//                                         onClick={() => setSelectedBias(cat.id)}
//                                         className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
//                                             ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
//                                             : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
//                                             }`}
//                                     >
//                                         <Icon className={`w-4 h-4 ${cat.className || ''} ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
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
//                                     placeholder="Search patterns..."
//                                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
//                                     style={{ backgroundColor: '#f9fafb' }}
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     autoFocus
//                                 />
//                             </div>
//                         </div>

//                         {/* Bottom: List of Patterns */}
//                         <div className="flex-1 overflow-y-auto p-2">
//                             <div className="grid grid-cols-1 gap-1">
//                                 {filteredPatterns.map(pat => {
//                                     const active = tempSelected.includes(pat.id);

//                                     // Color badge based on bias
//                                     const badgeColors = {
//                                         bullish: 'bg-green-100 text-green-700',
//                                         bearish: 'bg-red-100 text-red-700',
//                                         neutral: 'bg-purple-100 text-purple-700'
//                                     };
//                                     const badgeClass = badgeColors[pat.bias] || 'bg-gray-100 text-gray-500';

//                                     return (
//                                         <div
//                                             key={pat.id}
//                                             onClick={() => toggleSelection(pat.id)}
//                                             className={`group flex items-center justify-between p-3 mx-1 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${active
//                                                 ? 'bg-blue-50 border-blue-100'
//                                                 : 'hover:bg-gray-50 hover:border-gray-100'
//                                                 }`}
//                                         >
//                                             <div className="flex items-center gap-3 flex-1">
//                                                 {/* Pattern Badge */}
//                                                 <div
//                                                     className={`w-10 h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors ${badgeClass}`}
//                                                 >
//                                                     {pat.shortName}
//                                                 </div>

//                                                 <div className="flex-1">
//                                                     <div className="flex items-center gap-2 justify-between">
//                                                         <h3 className={`text-sm font-semibold ${active ? 'text-blue-700' : 'text-gray-900'}`}>
//                                                             {pat.name}
//                                                         </h3>
//                                                     </div>
//                                                     <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
//                                                         {pat.bias}
//                                                     </p>
//                                                 </div>
//                                             </div>

//                                             {/* Toggle/Status */}
//                                             <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${active
//                                                 ? 'bg-blue-600 border-blue-600 text-white'
//                                                 : 'border-gray-200 text-transparent group-hover:border-gray-300'
//                                                 }`}>
//                                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}

//                                 {filteredPatterns.length === 0 && (
//                                     <div className="flex flex-col items-center justify-center h-48 text-center">
//                                         <CandlestickChart className="w-8 h-8 text-gray-300 mb-3" />
//                                         <h3 className="text-gray-900 font-medium text-sm">No patterns found</h3>
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
//                         Apply Patterns
//                     </button>
//                 </div>

//             </div>
//         </div>
//     );

//     return createPortal(content, document.body);
// };

// export default PatternMenu;


import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, TrendingUp, Activity, BarChart2, Layers, CandlestickChart } from 'lucide-react';
import { PatternRegistry } from './Data/PatternRegistry';

const PatternMenu = ({ isOpen, onClose, activePatterns = [], onApply, portalTarget = null }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBias, setSelectedBias] = useState('ALL');
    const [mounted, setMounted] = useState(false);

    // Patterns from Registry
    // Convert object to array for mapping
    const availablePatterns = Object.entries(PatternRegistry.patterns).map(([id, meta]) => ({
        id: id,
        ...meta
    }));

    // Local state for patterns selected in the menu
    // We store just the IDs for simplicity in checking, or full objects?
    // activePatterns prop should probably be an array of IDs or objects.
    // Let's assume onApply expects an array of pattern IDs strings.
    const [tempSelected, setTempSelected] = useState([]);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTempSelected(activePatterns);
        }
    }, [isOpen, activePatterns]);

    const filteredPatterns = useMemo(() => {
        return availablePatterns.filter(pat => {
            const matchesSearch = pat.name.toLowerCase().includes(searchQuery.toLowerCase()) || pat.shortName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBias = selectedBias === 'ALL' || pat.bias === selectedBias;
            return matchesSearch && matchesBias;
        });
    }, [searchQuery, selectedBias, availablePatterns]);

    const toggleSelection = (patternId) => {
        setTempSelected(prev => {
            if (prev.includes(patternId)) {
                return prev.filter(id => id !== patternId);
            } else {
                return [...prev, patternId];
            }
        });
    };

    const handleApply = () => {
        onApply(tempSelected);
    };

    if (!isOpen || !mounted) return null;

    const categories = [
        { id: 'ALL', label: 'All Patterns', icon: Layers },
        { id: 'bullish', label: 'Bullish', icon: TrendingUp },
        { id: 'bearish', label: 'Bearish', icon: TrendingUp, className: 'rotate-180' },
        { id: 'neutral', label: 'Neutral', icon: Activity },
    ];

    const content = (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent p-4 animate-in fade-in duration-200" style={{ zIndex: 9999999 }}>
            {/* Click outside listener */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Container */}
            <div
                className="relative bg-white text-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200"
                style={{ backgroundColor: '#ffffff', width: '850px', height: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
            >
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Column: Categories */}
                    <div className="w-56 bg-gray-50 border-r border-gray-100 flex flex-col py-4" style={{ backgroundColor: '#f9fafb' }}>
                        <div className="px-5 mb-4">
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Patterns</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 space-y-1">
                            {categories.map(cat => {
                                const Icon = cat.icon;
                                const isActive = selectedBias === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedBias(cat.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${cat.className || ''} ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
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
                                    placeholder="Search patterns..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                                    style={{ backgroundColor: '#f9fafb' }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Bottom: List of Patterns */}
                        <div className="flex-1 overflow-y-auto p-2">
                            <div className="grid grid-cols-1 gap-1">
                                {filteredPatterns.map(pat => {
                                    const active = tempSelected.includes(pat.id);

                                    // Color badge based on bias
                                    const badgeColors = {
                                        bullish: 'bg-green-100 text-green-700',
                                        bearish: 'bg-red-100 text-red-700',
                                        neutral: 'bg-purple-100 text-purple-700'
                                    };
                                    const badgeClass = badgeColors[pat.bias] || 'bg-gray-100 text-gray-500';

                                    return (
                                        <div
                                            key={pat.id}
                                            onClick={() => toggleSelection(pat.id)}
                                            className={`group flex items-center justify-between p-3 mx-1 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${active
                                                ? 'bg-blue-50 border-blue-100'
                                                : 'hover:bg-gray-50 hover:border-gray-100'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                {/* Pattern Badge */}
                                                <div
                                                    className={`w-10 h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors ${badgeClass}`}
                                                >
                                                    {pat.shortName}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 justify-between">
                                                        <h3 className={`text-sm font-semibold ${active ? 'text-blue-700' : 'text-gray-900'}`}>
                                                            {pat.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
                                                        {pat.bias}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Toggle/Status */}
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${active
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'border-gray-200 text-transparent group-hover:border-gray-300'
                                                }`}>
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    );
                                })}

                                {filteredPatterns.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-48 text-center">
                                        <CandlestickChart className="w-8 h-8 text-gray-300 mb-3" />
                                        <h3 className="text-gray-900 font-medium text-sm">No patterns found</h3>
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
                        Apply Patterns
                    </button>
                </div>

            </div>
        </div>
    );

    return createPortal(content, portalTarget || document.body);
};

export default PatternMenu;