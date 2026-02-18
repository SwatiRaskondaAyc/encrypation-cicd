
// // src/Components/Patterns/PatternGrid.jsx
// import { useMemo, useState } from 'react';
// import PatternCard from './PatternCard';
// // import SectionHeader from './Components/SectionHeader';
// import { PatternRegistry } from '../data/patternRegistry';
// import SectionHeader from './SectionHeader';
// // import SectionHeader from '../SectionHeader';
// // import { PatternRegistry } from './data/patternRegistry';

// // === ICONS ===
// const TrendingUp = () => (
//   <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
//     <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
//   </svg>
// );

// const TrendingDown = () => (
//   <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
//     <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
//   </svg>
// );

// const ReversalIcon = () => <div className="flex"><TrendingDown /><TrendingUp className="ml-1" /></div>;
// const ContinuationIcon = () => <div className="flex text-green-600"><TrendingUp /><TrendingUp className="ml-1" /></div>;
// const BearishContinuationIcon = () => <div className="flex text-red-600"><TrendingDown /><TrendingDown className="ml-1" /></div>;
// // const IndecisionIcon = () => (
// //   <div className="w-10 h-10 border-4 border-blue-600 rounded-full flex items-center justify-center">
// //     <span className="text-blue-700 text-2xl font-bold">?</span>
// //   </div>
// // );

// const NeutralIndecisionIcon = ({ className = "" }) => (
//   <div className="relative flex items-center justify-center text-blue-600">
//     <div className="relative">
//       <svg className="w-6 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
//       </svg>
//       <svg className="absolute -top-2 -right-2 w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
//       </svg>
//       <svg className="absolute -bottom-2 -right-3 w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
//       </svg>
//     </div>
//   </div>
// );
// const IndecisionIcon = ({ className = "" }) => (
//   <div className="relative flex items-center justify-center">
//     <svg
//       className={`${className} w-6 h-6 text-green-600`}
//       fill="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
//     </svg>
//     <svg
//       className="absolute w-4 h-4 text-red-600 -bottom-2 right-0"
//       fill="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
//     </svg>
//   </div>
// );

// const BullishIcon = () =>  <div className="flex"><TrendingDown /><TrendingUp className="ml-1" /></div>;
// const BullishReversalIcon = () => <div className="flex"><TrendingUp /><TrendingDown className="ml-1" /></div>;
// // const BearishContinuationIcon = () => <div className="flex"><TrendingDown /><TrendingDown className="ml-1" /></div>

// const BullishContinuationIcon = () => <div className="flex"><TrendingUp /><TrendingUp className="ml-1" /></div>;
// const BearishIcon = () => <div className="flex"><TrendingUp /><TrendingDown className="ml-1" /></div>;;
// const NeutralIcon = () => <NeutralIndecisionIcon />;

// export default function PatternGrid({ 
//   viewType = 'category', 
//   selectedPatterns: parentSelected = [], 
//   onPatternSelect: parentOnSelect,
//   onScanMarket,
//   loading = false 
// }) {
//   const [localSelected, setLocalSelected] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [days, setDays] = useState(7);

//   const selected = parentSelected.length > 0 ? parentSelected : localSelected;
//   const setSelected = parentOnSelect || setLocalSelected;
//   const max = 5;
//   const disabled = selected.length >= max;

//   const byType = useMemo(() => PatternRegistry.buildByType?.() || {}, []);
//   const byBias = useMemo(() => PatternRegistry.buildByBias?.() || {}, []);

//   const toggle = (pid) => {
//     setSelected(prev => {
//       if (prev.includes(pid)) return prev.filter(p => p !== pid);
//       if (prev.length >= max) {
//         setShowPopup(true);
//         setTimeout(() => setShowPopup(false), 3000);
//         return prev;
//       }
//       return [...prev, pid];
//     });
//   };

//   const handleScan = () => {
//     if (selected.length === 0) {
//       alert('Please select at least one pattern.');
//       return;
//     }
//     onScanMarket(selected, days);
//   };

// const InfoBar = () => (
//   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-sky-600 p-4 rounded-2xl mb-10 shadow-xl dark:from-gray-800 dark:to-gray-900 dark:border-blue-400">
//     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//       <div>
//         <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Selected Patterns: {selected.length}/5</h3>
//         <p className="text-gray-600 mt-1 dark:text-gray-300">Click to select/deselect • Max 5 allowed</p>
//       </div>

//       {selected.length > 0 && (
//         <div className="flex flex-col sm:flex-row items-center gap-5">
//           <div className="bg-white px-6 py-3 rounded-xl border-2 border-sky-200 shadow-md flex items-center gap-4 dark:bg-gray-800 dark:border-blue-400">
//             <span className="font-medium text-gray-700 dark:text-gray-200">Scan Past</span>
//             <span className="font-bold text-blue-600 text-2xl dark:text-blue-300">{days}</span>
//             <span className="text-gray-600 dark:text-gray-200">Days</span>
//             <input 
//               type="range" 
//               min="8" 
//               max="21" 
//               value={days} 
//               onChange={e => setDays(+e.target.value)} 
//               className="w-40 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//               style={{ 
//                 background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((days-8)/13)*100}%, #E5E7EB ${((days-8)/13)*100}%, #E5E7EB 100%)` 
//               }}
//             />
//             <div className="text-xs text-gray-500 dark:text-gray-400">
//               8-21 days
//             </div>
//           </div>

//           <button 
//             onClick={handleScan}
//             disabled={loading}
//             className={`px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl transition transform flex items-center gap-3 ${
//               loading 
//                 ? 'opacity-50 cursor-not-allowed' 
//                 : 'hover:shadow-green-300/50 hover:scale-105'
//             }`}
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
//                 SCANNING...
//               </>
//             ) : (
//               <>
//                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 SCAN MARKET NOW
//               </>
//             )}
//           </button>
//         </div>
//       )}

//       {selected.length > 0 && (
//         <div className="flex flex-wrap gap-3">
//           {selected.map(pid => {
//             const m = PatternRegistry.getPattern(pid);
//             return (
//               <span key={pid} className="px-5 py-3 bg-blue-100 text-blue-800 rounded-full text-sm font-bold flex items-center gap-3 shadow-lg">
//                 {m?.name || pid}
//                 <button 
//                   onClick={() => toggle(pid)} 
//                   disabled={loading}
//                   className={`hover:text-red-600 text-lg font-bold ${
//                     loading ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   ×
//                 </button>
//               </span>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   </div>
// );

//   const LimitPopup = () => (
//     <div className={`fixed top-6 right-6 bg-red-600 text-white px-8 py-5 rounded-2xl shadow-2xl z-50 transition-all duration-300 ${showPopup ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
//       <p className="font-bold text-xl">Maximum 5 Patterns!</p>
//       <p className="text-sm opacity-90">Deselect one to add another</p>
//     </div>
//   );

//   const SectionLabel = ({ title, count, icon: Icon, level = 1 }) => (
//     <div className={`flex items-center gap-4 mb-6 ${level === 1 ? 'text-3xl font-bold border-b-4 border-gray-300 pb-3' : 'text-xl font-semibold'}`}>
//       {Icon && <Icon />}
//       <span className='dark:text-white'>{title} <span className="text-lg text-gray-500 font-normal dark:text-gray-300">({count})</span></span>
//     </div>
//   );

//   const PatternCardWrapper = ({ pid, name, shortName, bias, type }) => (
//     <PatternCard 
//       key={pid} 
//       patternId={pid} 
//       name={name} 
//       shortName={shortName} 
//       bias={bias} 
//       type={type} 
//       isSelected={selected.includes(pid)} 
//       onSelect={toggle} 
//       isSelectionDisabled={(disabled && !selected.includes(pid)) || loading}
//     />
//   );

//   const renderCategoryView = () => {
//     const rev = byType.reversal || {};
//     const cont = byType.continuation || {};
//     const ind = byType.indecision || {};

//     return (
//       <div className="space-y-12">
//         <SectionHeader title="Patterns by Category" description="Reversal • Continuation • Indecision" />
//         <InfoBar />
//         <LimitPopup />

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//           {/* REVERSAL */}
//           <div className="bg-white rounded-3xl border-2 border-purple-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-purple-400">
//             <SectionLabel title="Reversal" count={Object.values(rev).flatMap(Object.keys).length}  />
//             {rev.bullish && Object.keys(rev.bullish).length > 0 && (
//               <div className="mb-8">
//                 <SectionLabel title="Bullish" count={Object.keys(rev.bullish).length} icon={BullishIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(rev.bullish).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//             {rev.bearish && Object.keys(rev.bearish).length > 0 && (
//               <div className="mb-8">
//                 <SectionLabel title="Bearish" count={Object.keys(rev.bearish).length} icon={BearishIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(rev.bearish).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//             {rev.neutral && Object.keys(rev.neutral).length > 0 && (
//               <div>
//                 <SectionLabel title="Neutral" count={Object.keys(rev.neutral).length} icon={NeutralIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(rev.neutral).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* CONTINUATION */}
//           <div className="bg-white rounded-3xl border-2 border-green-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-green-400">
//             <SectionLabel title="Continuation" count={Object.values(cont).flatMap(Object.keys).length}  />
//             {cont.bullish && Object.keys(cont.bullish).length > 0 && (
//               <div className="mb-8">
//                 <SectionLabel title="Bullish" count={Object.keys(cont.bullish).length} icon={BullishContinuationIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(cont.bullish).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//             {cont.bearish && Object.keys(cont.bearish).length > 0 && (
//               <div>
//                 <SectionLabel title="Bearish" count={Object.keys(cont.bearish).length} icon={BearishContinuationIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(cont.bearish).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* INDECISION */}
//           <div className="bg-white rounded-3xl border-2 border-blue-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-blue-400">
//             <SectionLabel title="Indecision" count={Object.values(ind).flatMap(Object.keys).length}  />
//             {ind.neutral && Object.keys(ind.neutral).length > 0 && (
//               <div>
//                 <SectionLabel title="Neutral" count={Object.keys(ind.neutral).length} icon={NeutralIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(ind.neutral).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderBiasView = () => {
//     const bull = byBias.bullish || {};
//     const bear = byBias.bearish || {};
//     const neut = byBias.neutral || {};

//     return (
//       <div className="space-y-12">
//         <SectionHeader title="Patterns by Market Bias" description="Bullish • Bearish • Neutral" />
//         <InfoBar />
//         <LimitPopup />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//           {/* BULLISH */}
//           <div className="bg-white rounded-3xl border-2 border-green-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-green-400">
//             <SectionLabel title="Bullish" count={Object.values(bull).flatMap(Object.keys).length}  />
//             {bull.reversal && Object.keys(bull.reversal).length > 0 && (
//               <div className="mb-8">
//                 <SectionLabel title="Reversal" count={Object.keys(bull.reversal).length} icon={ReversalIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(bull.reversal).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//             {bull.continuation && Object.keys(bull.continuation).length > 0 && (
//               <div>
//                 <SectionLabel title="Continuation" count={Object.keys(bull.continuation).length} icon={ContinuationIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(bull.continuation).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* BEARISH */}
//           <div className="bg-white rounded-3xl border-2 border-red-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-red-400">
//             <SectionLabel title="Bearish" count={Object.values(bear).flatMap(Object.keys).length}  />
//             {bear.reversal && Object.keys(bear.reversal).length > 0 && (
//               <div className="mb-8">
//                 <SectionLabel title="Reversal" count={Object.keys(bear.reversal).length} icon={BullishReversalIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(bear.reversal).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//             {bear.continuation && Object.keys(bear.continuation).length > 0 && (
//               <div>
//                 <SectionLabel title="Continuation" count={Object.keys(bear.continuation).length} icon={BearishContinuationIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(bear.continuation).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* NEUTRAL */}
//           <div className="bg-white rounded-3xl border-2 border-blue-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-blue-400">
//             <SectionLabel title="Neutral" count={Object.values(neut).flatMap(Object.keys).length} />
//             {neut.reversal && Object.keys(neut.reversal).length > 0 && (
//               <div className="mb-8">
//                 <SectionLabel title="Reversal" count={Object.keys(neut.reversal).length} icon={ReversalIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(neut.reversal).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//             {neut.indecision && Object.keys(neut.indecision).length > 0 && (
//               <div>
//                 <SectionLabel title="Indecision" count={Object.keys(neut.indecision).length} icon={NeutralIndecisionIcon} level={2} />
//                 <div className="grid grid-cols-3 gap-5">
//                   {Object.entries(neut.indecision).map(([pid, name]) => {
//                     const m = PatternRegistry.getPattern(pid);
//                     return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return viewType === 'category' ? renderCategoryView() : renderBiasView();
// }



// src/Components/Patterns/PatternGrid.jsx
import { useMemo, useState } from 'react';
import PatternCard from './PatternCard';
// import SectionHeader from './Components/SectionHeader';
import { PatternRegistry } from '../data/patternRegistry';
import SectionHeader from './SectionHeader';
// import SectionHeader from '../SectionHeader';
// import { PatternRegistry } from './data/patternRegistry';

// === ICONS ===
const TrendingUp = () => (
  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
  </svg>
);

const TrendingDown = () => (
  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
  </svg>
);

const ReversalIcon = () => <div className="flex"><TrendingDown /><TrendingUp className="ml-1" /></div>;
const ContinuationIcon = () => <div className="flex text-green-600"><TrendingUp /><TrendingUp className="ml-1" /></div>;
const BearishContinuationIcon = () => <div className="flex text-red-600"><TrendingDown /><TrendingDown className="ml-1" /></div>;
// const IndecisionIcon = () => (
//   <div className="w-10 h-10 border-4 border-blue-600 rounded-full flex items-center justify-center">
//     <span className="text-blue-700 text-2xl font-bold">?</span>
//   </div>
// );

const NeutralIndecisionIcon = ({ className = "" }) => (
  <div className="relative flex items-center justify-center text-blue-600">
    <div className="relative">
      <svg className="w-6 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
      </svg>
      <svg className="absolute -top-2 -right-2 w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
      <svg className="absolute -bottom-2 -right-3 w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
      </svg>
    </div>
  </div>
);
const IndecisionIcon = ({ className = "" }) => (
  <div className="relative flex items-center justify-center">
    <svg
      className={`${className} w-6 h-6 text-green-600`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
    </svg>
    <svg
      className="absolute w-4 h-4 text-red-600 -bottom-2 right-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
    </svg>
  </div>
);

const BullishIcon = () =>  <div className="flex"><TrendingDown /><TrendingUp className="ml-1" /></div>;
const BullishReversalIcon = () => <div className="flex"><TrendingUp /><TrendingDown className="ml-1" /></div>;
// const BearishContinuationIcon = () => <div className="flex"><TrendingDown /><TrendingDown className="ml-1" /></div>

const BullishContinuationIcon = () => <div className="flex"><TrendingUp /><TrendingUp className="ml-1" /></div>;
const BearishIcon = () => <div className="flex"><TrendingUp /><TrendingDown className="ml-1" /></div>;;
const NeutralIcon = () => <NeutralIndecisionIcon />;

export default function PatternGrid({ 
  viewType = 'category', 
  selectedPatterns: parentSelected = [], 
  onPatternSelect: parentOnSelect,
  onScanMarket,
  loading = false 
}) {
  const [localSelected, setLocalSelected] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [days, setDays] = useState(7);

  const selected = parentSelected.length > 0 ? parentSelected : localSelected;
  const setSelected = parentOnSelect || setLocalSelected;
  const max = 5;
  const disabled = selected.length >= max;

  const byType = useMemo(() => PatternRegistry.buildByType?.() || {}, []);
  const byBias = useMemo(() => PatternRegistry.buildByBias?.() || {}, []);

  const toggle = (pid) => {
    setSelected(prev => {
      if (prev.includes(pid)) return prev.filter(p => p !== pid);
      if (prev.length >= max) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        return prev;
      }
      return [...prev, pid];
    });
  };

  const handleScan = () => {
    if (selected.length === 0) {
      alert('Please select at least one pattern.');
      return;
    }
    onScanMarket(selected, days);
  };

const InfoBar = () => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-sky-600 p-4 rounded-2xl mb-10 shadow-xl dark:from-gray-800 dark:to-gray-900 dark:border-blue-400">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Selected Patterns: {selected.length}/5</h3>
        <p className="text-gray-600 mt-1 dark:text-gray-300">Click to select/deselect • Max 5 allowed</p>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="bg-white px-6 py-3 rounded-xl border-2 border-sky-200 shadow-md flex items-center gap-4 dark:bg-gray-800 dark:border-blue-400">
            <span className="font-medium text-gray-700 dark:text-gray-200">Scan Past</span>
            <span className="font-bold text-blue-600 text-2xl dark:text-blue-300">{days}</span>
            <span className="text-gray-600 dark:text-gray-200">Days</span>
            <input 
              type="range" 
              min="8" 
              max="21" 
              value={days} 
              onChange={e => setDays(+e.target.value)} 
              className="w-40 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{ 
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((days-8)/13)*100}%, #E5E7EB ${((days-8)/13)*100}%, #E5E7EB 100%)` 
              }}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400">
              8-21 days
            </div>
          </div>

          <button 
            onClick={handleScan}
            disabled={loading}
            className={`px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl transition transform flex items-center gap-3 ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-green-300/50 hover:scale-105'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                SCANNING...
              </>
            ) : (
              <>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                SCAN MARKET NOW
              </>
            )}
          </button>
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {selected.map(pid => {
            const m = PatternRegistry.getPattern(pid);
            return (
              <span key={pid} className="px-5 py-3 bg-blue-100 text-blue-800 rounded-full text-sm font-bold flex items-center gap-3 shadow-lg">
                {m?.name || pid}
                <button 
                  onClick={() => toggle(pid)} 
                  disabled={loading}
                  className={`hover:text-red-600 text-lg font-bold ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

  const LimitPopup = () => (
    <div className={`fixed top-6 right-6 bg-red-600 text-white px-8 py-5 rounded-2xl shadow-2xl z-50 transition-all duration-300 ${showPopup ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <p className="font-bold text-xl">Maximum 5 Patterns!</p>
      <p className="text-sm opacity-90">Deselect one to add another</p>
    </div>
  );

  const SectionLabel = ({ title, count, icon: Icon, level = 1 }) => (
    <div className={`flex items-center gap-4 mb-6 ${level === 1 ? 'text-3xl font-bold border-b-4 border-gray-300 pb-3' : 'text-xl font-semibold'}`}>
      {Icon && <Icon />}
      <span className='dark:text-white'>{title} <span className="text-lg text-gray-500 font-normal dark:text-gray-300">({count})</span></span>
    </div>
  );

  const PatternCardWrapper = ({ pid, name, shortName, bias, type }) => (
    <PatternCard 
      key={pid} 
      patternId={pid} 
      name={name} 
      shortName={shortName} 
      bias={bias} 
      type={type} 
      isSelected={selected.includes(pid)} 
      onSelect={toggle} 
      isSelectionDisabled={(disabled && !selected.includes(pid)) || loading}
    />
  );

  const renderCategoryView = () => {
    const rev = byType.reversal || {};
    const cont = byType.continuation || {};
    const ind = byType.indecision || {};

    return (
      <div className="space-y-12">
        <SectionHeader title="Patterns by Category" description="Reversal • Continuation • Indecision" />
        <InfoBar />
        <LimitPopup />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* REVERSAL */}
          <div className="bg-white rounded-3xl border-2 border-purple-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-purple-400">
            <SectionLabel title="Reversal" count={Object.values(rev).flatMap(Object.keys).length}  />
            {rev.bullish && Object.keys(rev.bullish).length > 0 && (
              <div className="mb-8">
                <SectionLabel title="Bullish" count={Object.keys(rev.bullish).length} icon={BullishIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(rev.bullish).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
            {rev.bearish && Object.keys(rev.bearish).length > 0 && (
              <div className="mb-8">
                <SectionLabel title="Bearish" count={Object.keys(rev.bearish).length} icon={BearishIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(rev.bearish).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
            {rev.neutral && Object.keys(rev.neutral).length > 0 && (
              <div>
                <SectionLabel title="Neutral" count={Object.keys(rev.neutral).length} icon={NeutralIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(rev.neutral).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* CONTINUATION */}
          <div className="bg-white rounded-3xl border-2 border-green-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-green-400">
            <SectionLabel title="Continuation" count={Object.values(cont).flatMap(Object.keys).length}  />
            {cont.bullish && Object.keys(cont.bullish).length > 0 && (
              <div className="mb-8">
                <SectionLabel title="Bullish" count={Object.keys(cont.bullish).length} icon={BullishContinuationIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(cont.bullish).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
            {cont.bearish && Object.keys(cont.bearish).length > 0 && (
              <div>
                <SectionLabel title="Bearish" count={Object.keys(cont.bearish).length} icon={BearishContinuationIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(cont.bearish).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* INDECISION */}
          <div className="bg-white rounded-3xl border-2 border-blue-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-blue-400">
            <SectionLabel title="Indecision" count={Object.values(ind).flatMap(Object.keys).length}  />
            {ind.neutral && Object.keys(ind.neutral).length > 0 && (
              <div>
                <SectionLabel title="Neutral" count={Object.keys(ind.neutral).length} icon={NeutralIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(ind.neutral).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBiasView = () => {
    const bull = byBias.bullish || {};
    const bear = byBias.bearish || {};
    const neut = byBias.neutral || {};

    return (
      <div className="space-y-12">
        <SectionHeader title="Patterns by Market Bias" description="Bullish • Bearish • Neutral" />
        <InfoBar />
        <LimitPopup />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* BULLISH */}
          <div className="bg-white rounded-3xl border-2 border-green-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-green-400">
            <SectionLabel title="Bullish" count={Object.values(bull).flatMap(Object.keys).length}  />
            {bull.reversal && Object.keys(bull.reversal).length > 0 && (
              <div className="mb-8">
                <SectionLabel title="Reversal" count={Object.keys(bull.reversal).length} icon={ReversalIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(bull.reversal).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
            {bull.continuation && Object.keys(bull.continuation).length > 0 && (
              <div>
                <SectionLabel title="Continuation" count={Object.keys(bull.continuation).length} icon={ContinuationIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(bull.continuation).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* BEARISH */}
          <div className="bg-white rounded-3xl border-2 border-red-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-red-400">
            <SectionLabel title="Bearish" count={Object.values(bear).flatMap(Object.keys).length}  />
            {bear.reversal && Object.keys(bear.reversal).length > 0 && (
              <div className="mb-8">
                <SectionLabel title="Reversal" count={Object.keys(bear.reversal).length} icon={BullishReversalIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(bear.reversal).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
            {bear.continuation && Object.keys(bear.continuation).length > 0 && (
              <div>
                <SectionLabel title="Continuation" count={Object.keys(bear.continuation).length} icon={BearishContinuationIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(bear.continuation).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* NEUTRAL */}
          <div className="bg-white rounded-3xl border-2 border-blue-200 p-10 shadow-2xl dark:bg-gray-800 dark:border-blue-400">
            <SectionLabel title="Neutral" count={Object.values(neut).flatMap(Object.keys).length} />
            {neut.reversal && Object.keys(neut.reversal).length > 0 && (
              <div className="mb-8">
                <SectionLabel title="Reversal" count={Object.keys(neut.reversal).length} icon={ReversalIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(neut.reversal).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
            {neut.indecision && Object.keys(neut.indecision).length > 0 && (
              <div>
                <SectionLabel title="Indecision" count={Object.keys(neut.indecision).length} icon={NeutralIndecisionIcon} level={2} />
                <div className="grid grid-cols-3 gap-5">
                  {Object.entries(neut.indecision).map(([pid, name]) => {
                    const m = PatternRegistry.getPattern(pid);
                    return <PatternCardWrapper key={pid} pid={pid} name={m.name} shortName={name} bias={m.bias} type={m.type} />;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return viewType === 'category' ? renderCategoryView() : renderBiasView();
}