
// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';

// const PortfolioReplacement = () => {
//   const [uploadId, setUploadId]           = useState(null);
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [loading, setLoading]             = useState(false);
//   const [errorMsg, setErrorMsg]           = useState('');
//   const [mode, setMode]                   = useState('current');
//   const [replacedHoldings, setReplacedHoldings] = useState({});

//   /*───────────────────────────────────────────
//     1.  Fetch upload‑id once
//   ───────────────────────────────────────────*/
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get('http://localhost:8080/api/file/saved', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         data.length ? setUploadId(data[0].uploadId)
//                     : setErrorMsg('No uploaded files found.');
//       } catch (err) {
//         console.error(err);
//        setErrorMsg('Failed to fetch data. You are not logged in. Please log in and try again.');

//       } finally { setLoading(false); }
//     })();
//   }, []);
//   /*───────────────────────────────────────────
//     2.  Fetch both “current” & “actual” data
//   ───────────────────────────────────────────*/
// useEffect(() => {
//     if (!uploadId) return;

//     (async () => {
//       setLoading(true);
//       try {
//  const [portfolioRes, actualDateRes] = await Promise.all([
//   axios.post('http://localhost:8080/api/file/portfolio_replacements', null, { params: { uploadId } }),
//           axios.post('http://localhost:8080/api/file/actual_date_replacements', null, { params: { uploadId } })
//         ]);
//         console.log('Portfolio replacements:', portfolioRes.data);
//         console.log('Actual date replacements:', actualDateRes.data); 
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally { setLoading(false); }
//     })();
//   }, [uploadId]);

//   /*───────────────────────────────────────────
//     3.  Helpers
//   ───────────────────────────────────────────*/
//   const selectedData = mode === 'current' ? portfolioData : actualDateData;
//   const holdings     = selectedData?.current_holdings ?? [];
//   const replacements = selectedData?.replacement_options ?? {};

//   /** return array of holdings reflecting any user replacements */
//  const displayedHoldings = useMemo(() => (
//     holdings.map(h => {
//       const replaced  = replacedHoldings[h.base_symbol];
//       const baseValue = h.base_value ?? h.value ?? 0;
//       const marketVal = replaced ? replaced.marketValue : (h.value ?? 0);

//       // use backend numbers if present, else derive
//       const capitalGain   = ('capital_gain'   in h && h.capital_gain   != null)
//                             ? h.capital_gain
//                             : (marketVal - baseValue);
//       const percentReturn = ('percent_return' in h && h.percent_return != null)
//                             ? h.percent_return
//                             : (baseValue ? (capitalGain / baseValue) * 100 : 0);

//       return replaced ? replaced : {
//         ...h,
//         marketValue      : marketVal,
//         replacementValue : marketVal,
//         extraAmount      : h.extra,
//         pnl              : capitalGain,
//         returnPercentage : percentReturn,
//       };
//     })
//   ), [holdings, replacedHoldings]);



//   /** portfolio‑level EPS / PE / BV (from backend) + locally‑calculated PNL / %Return */
//   const portfolioMetrics = useMemo(() => {
//     if (!selectedData) return {};
//     const { eps, pe, bv } = selectedData.current_metrics ?? {};

//     const totalGain = displayedHoldings.reduce((s,h)=> s + (h.pnl ?? 0), 0);
//     const totalCost = displayedHoldings.reduce((s,h)=> s + (h.base_value ?? h.value ?? 0), 0);
//     const totalPct  = totalCost ? (totalGain / totalCost) * 100 : 0;

//     return { eps, pe, bv, pnl: totalGain, returnPct: totalPct };
//   }, [selectedData, displayedHoldings]);

//   /*───────────────────────────────────────────
//     4.  Actions
//   ───────────────────────────────────────────*/
//   const handleReplacement = (baseSymbol, pickedSymbol, mode) => {
//   const replacement = replacements[baseSymbol]?.find(r => r.symbol === pickedSymbol);
//   const original = holdings.find(h => h.base_symbol === baseSymbol);

//   if (!replacement || !original) return;

//   const qty        = original.qty;
//   const marketVal  = qty * replacement.price;
//   const baseValue  = original.base_value ?? original.value ?? 0;
//   const capitalGain   = marketVal - baseValue;
//   const percentReturn = baseValue ? (capitalGain / baseValue) * 100 : 0;

//   setReplacedHoldings(prev => ({
//     ...prev,
//     [baseSymbol]: {
//       ...original,
//       symbol          : replacement.symbol,
//       marketValue     : marketVal,
//       replacementValue: marketVal,
//       extraAmount     : 0,
//       pnl             : capitalGain,
//       returnPercentage: percentReturn,
//     }
//   }));
// };


//   const resetAll = () => setReplacedHoldings({});

//   /*───────────────────────────────────────────
//     5.  Render
//   ───────────────────────────────────────────*/
//   return (
//     <div style={{ fontFamily:'Arial, sans-serif', padding:'20px' }}>
//       <h1>Reimagine Your Portfolio</h1>

//       {/* mode toggle */}
//       <div style={{ margin:'20px 0' }}>
//         {['current','actual'].map(m => (
//           <button key={m}
//             onClick={()=>setMode(m)}
//             style={{
//               padding:'10px',
//               marginRight:'10px',
//               backgroundColor: mode===m ? '#007bff' : '#ccc',
//               color:'#fff', border:'none', borderRadius:'5px'
//             }}>
//             {m==='current' ? 'Current Price' : 'Actual Price'}
//           </button>
//         ))}
//       </div>

//       {/* states */}
//       {loading && <p>Loading data…</p>}
//  {errorMsg && (
//   <div
//     className="flex items-start gap-3 px-4 py-3 mb-4 border border-red-300 bg-red-50 text-red-700 rounded-lg shadow-sm animate-fade-in"
//     role="alert"
//   >
//     <svg
//       className="w-5 h-5 mt-1 text-red-500"
//       fill="currentColor"
//       viewBox="0 0 20 20"
//     >
//       <path
//         fillRule="evenodd"
//         d="M8.257 3.099c.764-1.36 2.722-1.36 3.486 0l6.518 11.614c.75 1.336-.213 2.987-1.742 2.987H3.48c-1.53 0-2.492-1.651-1.743-2.987L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z"
//         clipRule="evenodd"
//       />
//     </svg>
//     <span className="text-sm font-medium">{errorMsg}</span>
//   </div>
// )}



//       {selectedData && !loading && !errorMsg && (
//         <>
//           {/* portfolio metrics */}
// <section className="mb-6 border-t-4 border-b-4 border-gray-200 dark:border-gray-700 py-6 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950"> 
//   {/* EPS Card */}
//   <div className="p-4 h-32 w-full bg-gradient-to-br from-cyan-200/80 to-blue-200/80 text-black text-center rounded-2xl shadow-lg border-l-4 border-r-4 border-cyan-700/60 dark:border-indigo-400/50 hover:scale-105 transition-transform">
//     <h4 className="text-lg  mb-1">EPS</h4>
//     <p className="text-xl font-bold font-sans">{portfolioMetrics.eps != null ? portfolioMetrics.eps.toFixed(2) : '-'}</p>
//   </div>

//   {/* PE Card */}
//   <div className="p-4 h-32 w-full bg-gradient-to-br from-cyan-200/80 to-blue-200/80 text-black text-center rounded-2xl shadow-lg border-l-4 border-r-4 border-cyan-700/60 dark:border-rose-400/50 hover:scale-105 transition-transform">
//     <h4 className="text-lg  mb-1">PE</h4>
//     <p className="text-xl font-bold font-sans">{portfolioMetrics.pe != null ? portfolioMetrics.pe.toFixed(2) : '-'}</p>
//   </div>

//   {/* BV Card */}
//   <div className="p-4 h-32 w-full bg-gradient-to-br from-cyan-200/80 to-blue-200/80 text-black text-center rounded-2xl shadow-lg border-l-4 border-r-4 border-cyan-700/60 dark:border-amber-300/50 hover:scale-105 transition-transform">
//     <h4 className="text-lg  mb-1 ">BV</h4>
//     <p className="text-xl font-bold font-sans">{portfolioMetrics.bv != null ? portfolioMetrics.bv.toFixed(2) : '-'}</p>
//   </div>

//   {/* Unrealized PNL Card */}
//   <div className="p-4 h-32 w-full bg-gradient-to-br from-cyan-200/80 to-blue-200/80 text-black text-center rounded-2xl shadow-lg border-l-4 border-r-4 border-cyan-700/60 dark:border-blue-400/50 hover:scale-105 transition-transform">
//     <h4 className="text-lg  mb-1">Unrealized PNL</h4>
//     <p className="text-xl font-bold font-sans">{portfolioMetrics.pnl != null ? portfolioMetrics.pnl.toFixed(2) : '-'}</p>
//   </div>

//   {/* % Return Card */}
//   <div
//     className={`p-4 h-32 w-full rounded-2xl shadow-lg border-l-4 border-r-4 hover:scale-105 transition-transform text-black text-center ${
//       portfolioMetrics.returnPct >= 0
//         ? 'bg-gradient-to-br from-cyan-200/80 to-blue-200/80 border-cyan-700/60 dark:border-emerald-400/50'
//         : 'bg-gradient-to-br from-cyan-200/80 to-blue-200/80 border-cyan-700/60 dark:border-rose-400/50'
//     }`}
//   >
//     <h4 className="text-lg  mb-1">% Return</h4>
//     <p className="text-xl font-bold font-sans">{portfolioMetrics.returnPct != null ? portfolioMetrics.returnPct.toFixed(2) : '-'}%</p>
//   </div>
// </section>






//           {/* table */}
//     <h2 className="text-3xl font-bold my-6 text-gray-800 dark:text-gray-100">Holdings</h2>
// <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
//   <table className="min-w-full bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 rounded-2xl">
//     <thead className="bg-gradient-to-r from-cyan-700 to-cyan-700 text-white text-lg rounded-t-2xl">
//       <tr>
//         <th className="px-6 py-4 text-left">Symbol</th>
//         <th className="px-6 py-4 text-left">Qty</th>
//         <th className="px-6 py-4 text-left">Market Value</th>
//         <th className="px-6 py-4 text-left">Replacement Value</th>
//         <th className="px-6 py-4 text-left">Extra</th>
//         <th className="px-6 py-4 text-left">Unrealized PNL</th>
//         <th className="px-6 py-4 text-left">% Return</th>
//       </tr>
//     </thead>
//     <tbody>
//       {displayedHoldings.map((h, idx) => (
//         <tr key={idx} className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
//           <td className="px-6 py-4 flex items-center gap-2">
//             <span className="font-semibold">{h.symbol}</span>
//      {replacements[h.base_symbol] ? (
//   <select
//     className="..."
//     onChange={e => handleReplacement(h.base_symbol, e.target.value)}
//   >
//     <option value="">🔽 Replace</option>
//     {replacements[h.base_symbol].map(opt => (
//       <option key={opt.symbol} value={opt.symbol}>{opt.symbol}</option>
//     ))}
//   </select>
// ) : (
//   <select
//     className="..."
//     onChange={e => handleReplacement(h.base_symbol, e.target.value)}
//   >
//     <option value="">🔽 Replace</option>
//     {replacements[h.symbol]?.map(opt => (  // ✅ FIXED KEY
//       <option key={opt.symbol} value={opt.symbol}>{opt.symbol}</option>
//     )) ?? []}
//   </select>
// )}



//           </td>
//           <td className="text-lg px-6 py-4 font-semibold font-sans">{h.qty}</td>
//           <td className="text-lg px-6 py-4 font-semibold font-sans">{h.marketValue.toFixed(2)}</td>
//           <td className="text-lg px-6 py-4 font-semibold font-sans">{h.replacementValue === '-' ? '-' : h.replacementValue.toFixed(2)}</td>
//           <td className="text-lg px-6 py-4 font-semibold font-sans">{h.extraAmount}</td>
//           <td className="text-lg px-6 py-4 font-semibold font-sans">{h.pnl.toFixed(2)}</td>
//           <td className="text-lg px-6 py-4 font-semibold font-sans">{h.returnPercentage.toFixed(2)}%</td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>



//           <button onClick={resetAll}
//             style={{ marginTop:'20px', padding:'10px 20px',
//                      backgroundColor:'#dc3545', color:'#fff',
//                      border:'none', borderRadius:'5px' }}>
//             Reset All to Original
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default PortfolioReplacement;




// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';

// const PortfolioReplacement = () => {
//   const [uploadId, setUploadId] = useState(null);
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [mode, setMode] = useState('current');
//   const [replacedHoldings, setReplacedHoldings] = useState({});

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get('http://localhost:8080/api/file/saved', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         data.length ? setUploadId(data[0].uploadId) : setErrorMsg('No uploaded files found.');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch data. You are not logged in. Please log in and try again.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!uploadId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const [portfolioRes, actualDateRes] = await Promise.all([
//           axios.post('http://localhost:8080/api/file/portfolio_replacements', null, { params: { uploadId } }),
//           axios.post('http://localhost:8080/api/file/actual_date_replacements', null, { params: { uploadId } })
//         ]);
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [uploadId]);

//   const selectedData = mode === 'current' ? portfolioData : actualDateData;
//   const holdings = selectedData?.current_holdings ?? [];
//   const replacements = selectedData?.replacement_options ?? {};



//   const displayedHoldings = useMemo(() => (
//     holdings.map(h => {
//       const replaced = replacedHoldings[h.base_symbol];
//       const baseValue = h.base_value ?? h.value ?? 0;
//       const marketVal = replaced ? replaced.marketValue : (h.value ?? 0);
//       const capitalGain = ('capital_gain' in h && h.capital_gain != null) ? h.capital_gain : (marketVal - baseValue);
//       const percentReturn = ('percent_return' in h && h.percent_return != null) ? h.percent_return : (baseValue ? (capitalGain / baseValue) * 100 : 0);

//       return replaced ? replaced : {
//         ...h,
//         marketValue      : marketVal,
//         replacementValue: marketVal,
//         extraAmount: h.extra,
//         pnl: capitalGain,
//         returnPercentage: percentReturn,
//       };
//     })
//   ), [holdings, replacedHoldings]);

//   const portfolioMetrics = useMemo(() => {
//     if (!selectedData) return {};
//     const { eps, pe, bv } = selectedData.current_metrics ?? {};
//     const totalGain = displayedHoldings.reduce((s, h) => s + (h.pnl ?? 0), 0);
//     const totalCost = displayedHoldings.reduce((s, h) => s + (h.base_value ?? h.value ?? 0), 0);
//     const totalPct = totalCost ? (totalGain / totalCost) * 100 : 0;


//     return { eps, pe, bv, pnl: totalGain, returnPct: totalPct };
//   }, [selectedData, displayedHoldings]);

//   // const handleReplacement = (baseSymbol, pickedSymbol) => {
//   //   const replacement = replacements[baseSymbol]?.find(r => r.symbol === pickedSymbol);
//   //   const original = holdings.find(h => h.base_symbol === baseSymbol);
//   //   if (!replacement || !original) return;

//   //   const qty = original.qty;
//   //   const marketVal = qty * replacement.price;
//   //   const baseValue = original.base_value ?? original.value ?? 0;
//   //   const capitalGain = marketVal - baseValue;
//   //   const percentReturn = baseValue ? (capitalGain / baseValue) * 100 : 0;

//   //   setReplacedHoldings(prev => ({
//   //     ...prev,
//   //     [baseSymbol]: {
//   //       ...original,
//   //       symbol: replacement.symbol,
//   //      marketValue      : marketVal,
//   //       replacementValue: marketVal,
//   //       extraAmount: 0,
//   //       pnl: capitalGain,
//   //       returnPercentage: percentReturn,
//   //     }
//   //   }));
//   // };

// const handleReplacement = (baseSymbol, replacementSymbol) => {
//     const selected = options.find(s => s.symbol === replacementSymbol);
//   if (!holdings || !replacements) return;

//   const h = holdings.find(item => item.base_symbol === baseSymbol || item.symbol === baseSymbol);
//   if (!h) {
//     console.error(`Original holding not found for ${baseSymbol}`);
//     return;
//   }

//   const options = replacements[baseSymbol] || replacements[h.symbol] || [];
//   const selected = options.find(s => s.symbol === replacementSymbol);
//   if (!selected) {
//     console.error(`Replacement symbol ${replacementSymbol} not found`);
//     return;
//   }

//   const newQuantity = h.investedValue / selected.current_price;

//   const newHolding = {
//     ...h,
//     symbol: selected.symbol,
//     name: selected.name,
//     current_price: selected.current_price,
//     quantity: newQuantity,
//     replacementValue: selected.current_price * newQuantity,
//     pnl: selected.current_price * newQuantity - h.investedValue,
//     returnPercentage:
//       ((selected.current_price * newQuantity - h.investedValue) / h.investedValue) * 100,
//     extraAmount: h.extra,
//   };

//   setReplacedHoldings(prev => ({
//     ...prev,
//     [baseSymbol]: newHolding,
//   }));
// };


//   const resetAll = () => setReplacedHoldings({});

//   return (
//     <div className="p-6 font-sans">
//       <h1 className="text-3xl font-bold mb-4">Reimagine Your Portfolio</h1>

//       <div className="flex gap-4 mb-6">
//         {['current', 'actual'].map(m => (
//           <button
//             key={m}
//             onClick={() => setMode(m)}
//             className={`px-4 py-2 rounded-lg shadow-md transition font-semibold ${mode === m ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'}`}
//           >
//             {m === 'current' ? 'Current Price' : 'Actual Price'}
//           </button>
//         ))}
//       </div>

//       {loading && <p>Loading data…</p>}

//       {errorMsg && (
//         <div className="px-4 py-3 mb-4 border border-red-300 bg-red-50 text-red-700 rounded-lg shadow-sm">
//           <p className="text-sm font-medium">{errorMsg}</p>
//         </div>
//       )}

//       {selectedData && !loading && !errorMsg && (
//         <>
//           {/* Portfolio Metrics */}
//           <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
//             {['eps', 'pe', 'bv', 'pnl', 'returnPct'].map((key, i) => (
//               <div
//                 key={i}
//                 className={`p-4 h-32 rounded-2xl shadow-lg text-center transition-transform transform hover:scale-105 bg-gradient-to-br from-cyan-200/80 to-blue-200/80 border-l-4 border-r-4 ${
//                   key === 'returnPct'
//                     ? portfolioMetrics.returnPct >= 0
//                       ? 'border-emerald-400/50'
//                       : 'border-rose-400/50'
//                     : 'border-cyan-700/60'
//                 }`}
//               >
//                 <h4 className="text-lg mb-1 font-semibold capitalize">{key.replace('Pct', ' %')}</h4>
//                 <p className="text-xl font-bold">
//                   {portfolioMetrics[key] != null ? portfolioMetrics[key].toFixed(2) : '-'}{key === 'returnPct' ? '%' : ''}
//                 </p>
//               </div>
//             ))}
//           </section>

//           {/* Holdings Table */}
//           <h2 className="text-2xl font-bold mb-4">Holdings</h2>
//           <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
//             <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-100">
//               <thead className="bg-cyan-700 text-white text-lg">
//                 <tr>
//                   <th className="px-6 py-4">Symbol</th>
//                   <th className="px-6 py-4">Qty</th>
//                   <th className="px-6 py-4">Market Value</th>
//                   <th className="px-6 py-4">Replacement Value</th>
//                   <th className="px-6 py-4">Extra</th>
//                   <th className="px-6 py-4">Unrealized PNL</th>
//                   <th className="px-6 py-4">% Return</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayedHoldings.map((h, idx) => (
//                   <tr
//                     key={idx}
//                     className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
//                   >
//                     <td className="px-6 py-4 flex gap-2 items-center">
//                       <span className="font-semibold">{h.symbol}</span>
//                       <select
//                         onChange={e => handleReplacement(h.base_symbol, e.target.value)}
//                         className="ml-2 px-2 py-1 text-sm rounded border border-gray-300 bg-white dark:bg-gray-800"
//                       >
//                         <option value="">🔽 Replace</option>
//                         {(replacements[h.base_symbol] || replacements[h.symbol] || []).map(opt => (
//                           <option key={opt.symbol} value={opt.symbol}>{opt.symbol}</option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-6 py-4 font-semibold">{h.qty}</td>
//                     <td className="px-6 py-4 font-semibold">{h.marketValue.toFixed(2)}</td>
//                     <td className="px-6 py-4 font-semibold">{h.replacementValue === '-' ? '-' : h.replacementValue.toFixed(2)}</td>
//                     <td className="px-6 py-4 font-semibold">{h.extraAmount}</td>
//                     <td className="px-6 py-4 font-semibold">{h.pnl.toFixed(2)}</td>
//                     <td className="px-6 py-4 font-semibold">{h.returnPercentage.toFixed(2)}%</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <button
//             onClick={resetAll}
//             className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
//           >
//             Reset All to Original
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default PortfolioReplacement;

























// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';

// const PortfolioReplacement = () => {
//   const [uploadId, setUploadId] = useState(null);
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [mode, setMode] = useState('current'); // toggle: current vs actual price
//   const [replacedHoldings, setReplacedHoldings] = useState({});

//   // 1. Fetch uploadId
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get('http://localhost:8080/api/file/saved', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (data.length) setUploadId(data[0].uploadId);
//         else setErrorMsg('No uploaded files found.');
//       } catch (err) {
//         setErrorMsg('Failed to fetch data. Please log in and try again.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // 2. Fetch both current and actual date replacement data
//   useEffect(() => {
//     if (!uploadId) return;

//     (async () => {
//       setLoading(true);
//       try {
//         const [portfolioRes, actualDateRes] = await Promise.all([
//           axios.post('http://localhost:8080/api/file/portfolio_replacements', null, { params: { uploadId } }),
//           axios.post('http://localhost:8080/api/file/actual_date_replacements', null, { params: { uploadId } })
//         ]);
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [uploadId]);

//   // 3. Derived state
//   const selectedData = mode === 'current' ? portfolioData : actualDateData;
//   const holdings = selectedData?.current_holdings ?? [];
//   const replacements = selectedData?.replacement_options ?? {};

//   // 4. Calculate updated holdings (with replacements)
//   const displayedHoldings = useMemo(() => (
//     holdings.map(h => {
//       const replaced = replacedHoldings[h.base_symbol];
//       const baseValue = h.base_value ?? h.value ?? 0;
//       const marketVal = replaced ? replaced.marketValue : (h.value ?? 0);

//       const capitalGain = replaced ? replaced.pnl : (marketVal - baseValue);
//       const percentReturn = replaced
//         ? replaced.returnPercentage
//         : (baseValue ? (capitalGain / baseValue) * 100 : 0);

//       return replaced || {
//         ...h,
//        marketValue      : marketVal,
//         replacementValue: marketVal,
//         extraAmount: h.extra,
//         pnl: capitalGain,
//         returnPercentage: percentReturn,
//       };
//     })
//   ), [holdings, replacedHoldings]);

//   // 5. Portfolio-level recalculated metrics
//   const portfolioMetrics = useMemo(() => {
//     if (!selectedData) return {};
//     const { eps, pe, bv } = selectedData.current_metrics ?? {};

//     const totalGain = displayedHoldings.reduce((sum, h) => sum + (h.pnl ?? 0), 0);
//     const totalCost = displayedHoldings.reduce((sum, h) => sum + (h.base_value ?? h.value ?? 0), 0);
//     const returnPct = totalCost ? (totalGain / totalCost) * 100 : 0;

//     return { eps, pe, bv, pnl: totalGain, returnPct };
//   }, [selectedData, displayedHoldings]);

//   // 6. Handle replacement
//   const handleReplacement = (baseSymbol, pickedSymbol) => {
//     const replacement = replacements[baseSymbol]?.find(r => r.symbol === pickedSymbol);
//     const original = holdings.find(h => h.base_symbol === baseSymbol);
//     if (!replacement || !original) return;

//     const qty = original.qty;
//     const marketVal = qty * replacement.price;
//     const baseValue = original.base_value ?? original.value ?? 0;
//     const capitalGain = marketVal - baseValue;
//     const percentReturn = baseValue ? (capitalGain / baseValue) * 100 : 0;

//     setReplacedHoldings(prev => ({
//       ...prev,
//       [baseSymbol]: {
//         ...original,
//         symbol: replacement.symbol,
//        marketValue      : marketVal,
//         replacementValue: marketVal,
//         extraAmount: 0,
//         pnl: capitalGain,
//         returnPercentage: percentReturn,
//       }
//     }));
//   };

//   // 7. Reset
//   const resetAll = () => setReplacedHoldings({});

//   return (
//     <div className="p-6 font-sans">
//       <h1 className="text-3xl font-bold mb-4">Reimagine Your Portfolio</h1>

//       {/* Mode toggle */}
//       <div className="mb-4">
//         {['current', 'actual'].map(m => (
//           <button key={m}
//             onClick={() => setMode(m)}
//             className={`px-4 py-2 mr-2 rounded ${mode === m ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}>
//             {m === 'current' ? 'Current Price' : 'Actual Price'}
//           </button>
//         ))}
//       </div>

//       {loading && <p>Loading…</p>}
//       {errorMsg && <p className="text-red-600">{errorMsg}</p>}

//       {/* Metrics */}
//       {selectedData && !loading && !errorMsg && (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//             {['EPS', 'PE', 'BV', 'PNL', '% Return'].map((metric, i) => (
//               <div key={i} className="bg-gray-100 p-4 rounded shadow text-center">
//                 <h4 className="text-lg font-semibold">{metric}</h4>
//                 <p className="text-2xl font-bold mt-2">
//                   {{
//                     EPS: portfolioMetrics.eps?.toFixed(2) ?? '-',
//                     PE: portfolioMetrics.pe?.toFixed(2) ?? '-',
//                     BV: portfolioMetrics.bv?.toFixed(2) ?? '-',
//                     PNL: portfolioMetrics.pnl?.toFixed(2) ?? '-',
//                     '% Return': portfolioMetrics.returnPct?.toFixed(2) + '%' ?? '-'
//                   }[metric]}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Holdings Table */}
//           <table className="w-full text-left border border-gray-300 rounded">
//             <thead className="bg-blue-600 text-white">
//               <tr>
//                 <th className="p-2">Symbol</th>
//                 <th className="p-2">Qty</th>
//                 <th className="p-2">Market Value</th>
//                 <th className="p-2">Replacement Value</th>
//                 <th className="p-2">Extra</th>
//                 <th className="p-2">PNL</th>
//                 <th className="p-2">% Return</th>
//               </tr>
//             </thead>
//             <tbody>
//               {displayedHoldings.map((h, idx) => (
//                 <tr key={idx} className="border-t">
//                   <td className="p-2">
//                     <strong>{h.symbol}</strong>
//                     <select className="ml-2 px-1" onChange={e => handleReplacement(h.base_symbol, e.target.value)}>
//                       <option value="">🔽 Replace</option>
//                       {(replacements[h.base_symbol] || []).map(opt => (
//                         <option key={opt.symbol} value={opt.symbol}>{opt.symbol}</option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="p-2">{h.qty}</td>
//                   <td className="p-2">{h.marketValue.toFixed(2)}</td>
//                   <td className="p-2">{h.replacementValue?.toFixed(2) ?? '-'}</td>
//                   <td className="p-2">{h.extraAmount}</td>
//                   <td className="p-2">{h.pnl.toFixed(2)}</td>
//                   <td className="p-2">{h.returnPercentage.toFixed(2)}%</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Actions */}
//           <div className="mt-6">
//             <button
//               onClick={resetAll}
//               className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
//             >
//               Reset All
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PortfolioReplacement;


// import React, { useState, useEffect } from 'react';

// export default function PortfolioReplacement({ currentData, actualData }) {
//   const [viewMode, setViewMode] = useState('current'); // 'current' or 'actual'
//   const [originalHoldings, setOriginalHoldings] = useState([]);
//   const [updatedHoldings, setUpdatedHoldings] = useState([]);

//   // Initialize holdings based on current view
//   useEffect(() => {
//     const selectedData = viewMode === 'current' ? currentData : actualData;
//     if (!selectedData) return;

//     const holdings = selectedData.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: typeof stock.value === 'number' ? stock.value : stock.qty * stock.price ?? 0,
//       current_price: stock.value / stock.qty,
//       extra: stock.extra ?? 0,
//       capital_gain: 0,
//       percent_return: 0,
//     }));

//     setOriginalHoldings(holdings);
//     setUpdatedHoldings(holdings);
//   }, [viewMode, currentData, actualData]);

//   const recalculateMetrics = () => {
//     const totalValue = updatedHoldings.reduce((acc, s) => acc + (s.value || 0), 0);
//     let weightedEPS = 0, weightedPE = 0, weightedBV = 0;

//     updatedHoldings.forEach(s => {
//       const v = s.value || 0;
//       const w = totalValue > 0 ? v / totalValue : 0;
//       weightedEPS += (s.eps || 0) * w;
//       weightedPE += (s.pe || 0) * w;
//       weightedBV += (s.bv || 0) * w;
//     });

//     const totalGain = updatedHoldings.reduce((acc, s) => acc + (s.capital_gain || 0), 0);
//     const totalInvested = updatedHoldings.reduce((acc, s) => acc + ((s.value || 0) - (s.capital_gain || 0)), 0);
//     const totalPct = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0;

//     return {
//       weightedEPS, weightedPE, weightedBV,
//       totalGain, totalPct
//     };
//   };

//   const handleReplacementChange = (index, chosenSymbol) => {
//     const holding = updatedHoldings[index];
//     if (!chosenSymbol) return;

//     const selectedData = viewMode === 'current' ? currentData : actualData;

//     if (chosenSymbol === holding.base_symbol) {
//       const orig = originalHoldings.find(o => o.base_symbol === holding.base_symbol);
//       const updated = [...updatedHoldings];
//       updated[index] = { ...orig };
//       setUpdatedHoldings(updated);
//     } else {
//       const candidate = selectedData.replacement_options[holding.base_symbol]?.find(r => r.symbol === chosenSymbol);
//       if (!candidate) return;

//       const newQty = Math.floor(holding.base_value / candidate.price);
//       const newExtra = holding.base_value - newQty * candidate.price;
//       const marketValue = newQty * candidate.price;
//       const capitalGain = marketValue - holding.base_value;
//       const percentReturn = holding.base_value > 0 ? (capitalGain / holding.base_value * 100) : 0;

//       const updated = [...updatedHoldings];
//       updated[index] = {
//         symbol: candidate.symbol,
//         qty: newQty,
//         value: holding.base_value,
//         eps: candidate.eps,
//         pe: candidate.pe,
//         bv: candidate.bv,
//         base_symbol: holding.base_symbol,
//         base_value: holding.base_value,
//         extra: newExtra,
//         capital_gain: capitalGain,
//         percent_return: percentReturn,
//       };
//       setUpdatedHoldings(updated);
//     }
//   };

//   const handleResetAll = () => {
//     setUpdatedHoldings([...originalHoldings]);
//   };

//   const selectedData = viewMode === 'current' ? currentData : actualData;
//   const metrics = recalculateMetrics();

//   return (
//     <div>
//       {/* Toggle Buttons */}
//       <div className="flex gap-4 mb-4">
//         <button
//           onClick={() => setViewMode('current')}
//           className={`px-4 py-2 rounded ${viewMode === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         >
//           Current Values
//         </button>
//         <button
//           onClick={() => setViewMode('actual')}
//           className={`px-4 py-2 rounded ${viewMode === 'actual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         >
//           Actual-Date Values
//         </button>
//       </div>

//       {/* Metric Cards */}
//       <div className="metrics-grid">
//         <Metric label="EPS" value={metrics.weightedEPS} status={metrics.weightedEPS > 0 ? 'positive' : (metrics.weightedEPS === 0 ? 'neutral' : 'negative')} />
//         <Metric label="PE" value={metrics.weightedPE} status={metrics.weightedPE < 15 ? 'positive' : (metrics.weightedPE > 25 ? 'negative' : 'neutral')} />
//         <Metric label="BV" value={metrics.weightedBV} status={metrics.weightedBV > 50 ? 'positive' : (metrics.weightedBV < 20 ? 'negative' : 'neutral')} />
//         <Metric label="Gain" value={`₹${metrics.totalGain.toFixed(2)}`} status={metrics.totalGain > 0 ? 'positive' : (metrics.totalGain === 0 ? 'neutral' : 'negative')} />
//         <Metric label="Return" value={`${metrics.totalPct.toFixed(2)}%`} status={metrics.totalPct > 0 ? 'positive' : (metrics.totalPct === 0 ? 'neutral' : 'negative')} />
//       </div>

//       <button onClick={handleResetAll} className="mt-2 mb-4 px-4 py-2 bg-red-500 text-white rounded">Reset All</button>

//       {/* Holdings Table */}
//       <table className="table w-full">
//         <thead>
//           <tr>
//             <th>Symbol</th>
//             <th>Qty</th>
//             <th>Value (Base)</th>
//             <th>Adjusted</th>
//             <th>Extra</th>
//             <th>Gain</th>
//             <th>Return</th>
//           </tr>
//         </thead>
//         <tbody>
//           {updatedHoldings.map((stock, index) => {
//             const replacements = selectedData.replacement_options[stock.base_symbol] || [];
//             return (
//               <tr key={index}>
//                 <td>
//                   <select
//                     value={stock.symbol}
//                     onChange={(e) => handleReplacementChange(index, e.target.value)}
//                   >
//                     <option value="">--Select Replacement--</option>
//                     <option value={stock.base_symbol}>Reset to Original ({stock.base_symbol})</option>
//                     <option disabled>──────── Stocks from same Industry ────────</option>
//                     {replacements.map(rep => (
//                       <option key={rep.symbol} value={rep.symbol}>
//                         {rep.symbol} (PE:{rep.pe.toFixed(2)}, EPS:{rep.eps.toFixed(2)}, BV:{rep.bv.toFixed(2)})
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td>{stock.qty}</td>
//                 <td>₹{stock.base_value.toFixed(2)} ({stock.base_symbol})</td>
//                 <td>₹{stock.value.toFixed(2)}</td>
//                 <td>₹{stock.extra.toFixed(2)}</td>
//                 <td>₹{stock.capital_gain.toFixed(2)}</td>
//                 <td>{stock.percent_return.toFixed(2)}%</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function Metric({ label, value, status }) {
//   return (
//     <div className={`metric-card ${status}`} id={`metric-${label.toLowerCase()}`}>
//       <div className="metric-label">{label}</div>
//       <div className="mp-metric-value">{typeof value === 'number' ? value.toFixed(2) : value}</div>
//     </div>
//   );
// }



//_______________________________________working for hardcode____________________

// import  { useState, useEffect } from 'react';

// const portfolioReplacements = {
//   current_holdings: [
//     { symbol: "RELIANCE", qty: 100, value: 250000, eps: 98.5, pe: 25.5, bv: 1200, capital_gain: 50000, percent_return: 25 },
//     { symbol: "TCS", qty: 50, value: 175000, eps: 120.3, pe: 30.2, bv: 900, capital_gain: 25000, percent_return: 16.67 }
//   ],
//   current_metrics: { eps: 105.2, pe: 27.3, bv: 1050 },
//   replacement_options: {
//     RELIANCE: [
//       { symbol: "HDFC", price: 1500, eps: 85.2, pe: 20.1, bv: 1100 },
//       { symbol: "INFY", price: 1400, eps: 60.5, pe: 22.5, bv: 850 }
//     ],
//     TCS: [
//       { symbol: "WIPRO", price: 500, eps: 20.5, pe: 18.5, bv: 400 },
//       { symbol: "HCLTECH", price: 1100, eps: 45.3, pe: 21.0, bv: 700 }
//     ]
//   }
// };

// const portfolioActualDateReplacements = {
//   current_holdings: [
//     { symbol: "RELIANCE", qty: 100, value: 250000, eps: 98.5, pe: 25.5, bv: 1200, capital_gain: 0, percent_return: 0 },
//     { symbol: "TCS", qty: 50, value: 175000, eps: 120.3, pe: 30.2, bv: 900, capital_gain: 0, percent_return: 0 }
//   ],
//   current_metrics: { eps: 105.2, pe: 27.3, bv: 1050 },
//   replacement_options: {
//     RELIANCE: [
//       { symbol: "HDFC", current_price: 1550, new_qty: 166, eps: 85.2, pe: 20.1, bv: 1100, capital_gain: 7500, percent_return: 3, extra: 100 },
//       { symbol: "INFY", current_price: 1450, new_qty: 172, eps: 60.5, pe: 22.5, bv: 850, capital_gain: 5000, percent_return: 2, extra: 50 }
//     ],
//     TCS: [
//       { symbol: "WIPRO", current_price: 520, new_qty: 336, eps: 20.5, pe: 18.5, bv: 400, capital_gain: 3000, percent_return: 1.7, extra: 80 },
//       { symbol: "HCLTECH", current_price: 1150, new_qty: 152, eps: 45.3, pe: 21.0, bv: 700, capital_gain: 4000, percent_return: 2.3, extra: 90 }
//     ]
//   }
// };

// const PortfolioReplacement = () => {
//   const [mode, setMode] = useState('current');
//   const [originalHoldings, setOriginalHoldings] = useState([]);
//   const [updatedHoldings, setUpdatedHoldings] = useState([]);
//   const [metrics, setMetrics] = useState({ eps: 0, pe: 0, bv: 0, gain: 0, return: 0 });
//   const [openDropdown, setOpenDropdown] = useState(null);

//   useEffect(() => {
//     if (mode === 'current') {
//       initializeCurrentVersion();
//     } else {
//       initializeActualVersion();
//     }
//   }, [mode]);

//   const initializeCurrentVersion = () => {
//     const original = portfolioReplacements.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       extra: stock.extra ?? 0
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const initializeActualVersion = () => {
//     const original = portfolioActualDateReplacements.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       current_price: 0,
//       extra: stock.extra ?? 0,
//       capital_gain: 0,
//       percent_return: 0
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const recalculateMetrics = (holdings) => {
//     const totalValue = holdings.reduce((acc, stock) => acc + (stock.value || 0), 0);
//     let weightedEPS = 0, weightedPE = 0, weightedBV = 0;
//     holdings.forEach(stock => {
//       const value = stock.value || 0;
//       const weight = totalValue > 0 ? value / totalValue : 0;
//       weightedEPS += (stock.eps || 0) * weight;
//       weightedPE += (stock.pe || 0) * weight;
//       weightedBV += (stock.bv || 0) * weight;
//     });

//     const totalGain = holdings.reduce((acc, stock) => acc + (stock.capital_gain || 0), 0);
//     const totalInvested = holdings.reduce(
//       (acc, stock) => acc + ((stock.value || 0) - (stock.capital_gain || 0)),
//       0
//     );
//     const totalPct = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0;

//     setMetrics({
//       eps: weightedEPS.toFixed(2),
//       pe: weightedPE.toFixed(2),
//       bv: weightedBV.toFixed(2),
//       gain: totalGain.toFixed(2),
//       return: totalPct.toFixed(2)
//     });
//   };

//   const handleReplacement = (index, value) => {
//     const holding = updatedHoldings[index];
//     let newHoldings = [...updatedHoldings];

//     if (!value) return;

//     const data = mode === 'current' ? portfolioReplacements : portfolioActualDateReplacements;

//     if (value === holding.base_symbol) {
//       const original = originalHoldings.find(s => s.symbol === holding.base_symbol);
//       newHoldings[index] = { ...original };
//     } else {
//       const replacements = data.replacement_options[holding.base_symbol] || [];
//       const candidate = replacements.find(r => r.symbol === value);
//       if (!candidate) return;

//       if (mode === 'current') {
//         const newQty = Math.floor(holding.base_value / candidate.price);
//         const newExtra = holding.base_value - (newQty * candidate.price);
//         const marketValue = newQty * candidate.price;
//         const capitalGain = marketValue - holding.base_value;
//         const percentReturn = holding.base_value > 0 ? (capitalGain / holding.base_value * 100) : 0;

//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: newQty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: newExtra,
//           capital_gain: capitalGain,
//           percent_return: percentReturn
//         };
//       } else {
//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: candidate.new_qty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: candidate.extra,
//           capital_gain: candidate.capital_gain,
//           percent_return: candidate.percent_return,
//           current_price: candidate.current_price
//         };
//       }
//     }

//     setUpdatedHoldings(newHoldings);
//     recalculateMetrics(newHoldings);
//   };

//   const resetAll = () => {
//     setUpdatedHoldings([...originalHoldings]);
//     recalculateMetrics([...originalHoldings]);
//   };

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.replacement-dropdown') && !e.target.closest('.symbol-text')) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">
//         Reimagine Your Portfolio: What's Your Best Mix?
//       </h1>

//       <div className="flex justify-center mb-4">
//         <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
//           <button
//             className={`px-4 py-2 rounded-md ${mode === 'current' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
//             onClick={() => setMode('current')}
//           >
//             Current Price Mode
//           </button>
//           <button
//             className={`px-4 py-2 rounded-md ${mode === 'actual' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
//             onClick={() => setMode('actual')}
//           >
//             Acquisition Price Mode
//           </button>
//         </div>
//       </div>

//       {/* Metrics */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="flex space-x-4">
//           <MetricCard label="EPS" value={metrics.eps} />
//           <MetricCard label="PE" value={metrics.pe} />
//           <MetricCard label="BV" value={metrics.bv} />
//         </div>
//         <div className="flex space-x-4">
//           <MetricCard label="Unrealized PNL" value={`₹${metrics.gain}`} />
//           <MetricCard label="% Unrealized Return" value={`${metrics.return}%`} />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Holdings</h2>
//         <table className="w-full table-auto text-left">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2">Symbol</th>
//               <th className="px-4 py-2">Quantity</th>
//               <th className="px-4 py-2">Market Value</th>
//               <th className="px-4 py-2">Replacement Value</th>
//               <th className="px-4 py-2">Extra</th>
//               <th className="px-4 py-2">PNL</th>
//               <th className="px-4 py-2">% Return</th>
//             </tr>
//           </thead>
//           <tbody>
//             {updatedHoldings.map((stock, index) => {
//               const replacements = (mode === 'current' ? portfolioReplacements : portfolioActualDateReplacements).replacement_options[stock.base_symbol] || [];
//               return (
//                 <tr key={index} className="border-t">
//                   <td className="px-4 py-2 relative">
//                     <span
//                       className="symbol-text cursor-pointer"
//                       onClick={() => toggleDropdown(index)}
//                     >
//                       {stock.symbol} ⏷
//                     </span>
//                     {openDropdown === index && (
//                       <select
//                         className="replacement-dropdown absolute z-10 bg-white border rounded shadow left-full top-0 ml-2"
//                         onChange={(e) => handleReplacement(index, e.target.value)}
//                       >
//                         <option value="">-- Select --</option>
//                         <option value={stock.base_symbol}>Reset ({stock.base_symbol})</option>
//                         {replacements.map(rep => (
//                           <option key={rep.symbol} value={rep.symbol}>
//                             {rep.symbol}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </td>
//                   <td className="px-4 py-2">{stock.qty}</td>
//                   <td className="px-4 py-2">₹{(stock.base_value).toFixed(2)}</td>
//                   <td className="px-4 py-2">
//                     ₹{(mode === 'current'
//                       ? (stock.value - (stock.extra || 0))
//                       : (stock.qty * (stock.current_price || 0))).toFixed(2)}
//                   </td>
//                   <td className="px-4 py-2">₹{(stock.extra || 0).toFixed(2)}</td>
//                   <td className="px-4 py-2">₹{(stock.capital_gain || 0).toFixed(2)}</td>
//                   <td className="px-4 py-2">{(stock.percent_return || 0).toFixed(2)}%</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//         <button
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           onClick={resetAll}
//         >
//           Reset All to Original
//         </button>
//       </div>
//     </div>
//   );
// };

// const MetricCard = ({ label, value }) => (
//   <div className="p-4 bg-white rounded-lg shadow w-full">
//     <span className="font-semibold">{label}: </span>
//     <span>{value}</span>
//   </div>
// );

// export default PortfolioReplacement;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ToggleGroup from './ToggleGroup';


// const PortfolioReplacement = () => {
//   const [uploadId, setUploadId] = useState(null);
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const [mode, setMode] = useState('current');
//   const [originalHoldings, setOriginalHoldings] = useState([]);
//   const [updatedHoldings, setUpdatedHoldings] = useState([]);
//   const [metrics, setMetrics] = useState({ base: 0, current: 0, gain: 0 });
//    const [replacedHoldings, setReplacedHoldings] = useState({});
//   const [viewMode, setViewMode] = useState('current');

//   const toggleOptions = [
//     { value: 'current', label: 'Current' },
//     { value: 'actual', label: 'Actual' },
//   ];


//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get('http://localhost:8080/api/file/saved', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         data.length ? setUploadId(data[0].uploadId)
//                     : setErrorMsg('No uploaded files found.');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch data. You are not logged in. Please log in and try again.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!uploadId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const [portfolioRes, actualDateRes] = await Promise.all([
//           axios.post('http://localhost:8080/api/file/portfolio_replacements', null, {
//             params: { uploadId },
//           }),
//           axios.post('http://localhost:8080/api/file/actual_date_replacements', null, {
//             params: { uploadId },
//           })
//         ]);
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [uploadId]);

//   useEffect(() => {
//     if (mode === 'current') initializeCurrentVersion();
//     else initializeActualVersion();
//   }, [mode, portfolioData, actualDateData]);

//   const initializeCurrentVersion = () => {
//     if (!portfolioData) return;
//     const original = portfolioData.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       extra: stock.extra ?? 0
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const initializeActualVersion = () => {
//     if (!actualDateData) return;
//     const original = actualDateData.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       current_price: 0,
//       extra: stock.extra ?? 0,
//       capital_gain: 0,
//       percent_return: 0
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const recalculateMetrics = (holdings) => {
//     const base = holdings.reduce((sum, h) => sum + h.base_value, 0);
//     const current = holdings.reduce((sum, h) => sum + (h.current_price || 0), 0);
//     const gain = current - base;
//     setMetrics({ base, current, gain });
//   };

//   const handleReplacement = (index, replacementSymbol) => {
//     const updated = [...updatedHoldings];
//     const holding = updated[index];
//     const data = mode === 'current' ? portfolioData : actualDateData;
//     const replacements = data?.replacement_options[holding.base_symbol] || [];
//     const replacement = replacements.find(r => r.symbol === replacementSymbol);
//     if (replacement) {
//       holding.symbol = replacement.symbol;
//       holding.current_price = replacement.current_price;
//       holding.capital_gain = replacement.capital_gain;
//       holding.percent_return = replacement.percent_return;
//       updated[index] = { ...holding };
//       setUpdatedHoldings(updated);
//       recalculateMetrics(updated);
//     }
//   };

//   if (loading) return <div className="text-center p-4">Loading...</div>;
//   if (errorMsg) return <div className="text-center text-red-500 p-4">{errorMsg}</div>;
//   if (!portfolioData || !actualDateData) return null;

//   const data = mode === 'current' ? portfolioData : actualDateData;

//   const resetAll = () => setReplacedHoldings({});


//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//        <ToggleGroup 
//   options={toggleOptions}
//   value={mode}
//   onChange={setMode}
// />

//         <div className="space-x-4">
//           <span>Base: ₹{metrics.base.toFixed(2)}</span>
//           <span>Current: ₹{metrics.current.toFixed(2)}</span>
//           <span>Gain: ₹{metrics.gain.toFixed(2)}</span>
//         </div>
//       </div>
//       <table className="w-full table-auto border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Stock</th>
//             <th className="border p-2">Value</th>
//             <th className="border p-2">Current Price</th>
//             <th className="border p-2">Gain</th>
//             <th className="border p-2">Return %</th>
//             <th className="border p-2">Replace</th>
//           </tr>
//         </thead>
//         <tbody>
//           {updatedHoldings.map((holding, i) => (
//             <tr key={i} className="text-center">
//               <td className="border p-2">{holding.symbol}</td>
//               <td className="border p-2">₹{holding.base_value}</td>
//               <td className="border p-2">₹{holding.current_price}</td>
//               <td className="border p-2">₹{holding.capital_gain}</td>
//               <td className="border p-2">{holding.percent_return}%</td>
//               <td className="border p-2">
//                 <select
//                   value={holding.symbol}
//                   onChange={(e) => handleReplacement(i, e.target.value)}
//                   className="border rounded px-2 py-1"
//                 >
//                   <option value={holding.base_symbol}>-- Select --</option>
//                   {(data?.replacement_options[holding.base_symbol] || []).map((opt, idx) => (
//                     <option key={idx} value={opt.symbol}>{opt.symbol}</option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PortfolioReplacement;




// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const PortfolioReplacement = () => {
//   const [uploadId, setUploadId] = useState(null);
//   const [mode, setMode] = useState('current');
//   const [originalHoldings, setOriginalHoldings] = useState([]);
//   const [updatedHoldings, setUpdatedHoldings] = useState([]);
//   const [metrics, setMetrics] = useState({ eps: 0, pe: 0, bv: 0, gain: 0, return: 0 });
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Fetch uploadId from saved file
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get('http://localhost:8080/api/file/saved', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (data.length) {
//           setUploadId(data[0].uploadId);
//         } else {
//           setErrorMsg('No uploaded files found.');
//         }
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch upload ID. Please log in.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Fetch portfolio and actual date data after getting uploadId
//   useEffect(() => {
//     if (!uploadId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const [portfolioRes, actualDateRes] = await Promise.all([
//           axios.post('http://localhost:8080/api/file/portfolio_replacements', null, { params: { uploadId } }),
//           axios.post('http://localhost:8080/api/file/actual_date_replacements', null, { params: { uploadId } })
//         ]);
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         console.log(portfolioRes.data)
//         console.log(actualDateRes.data)
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [uploadId]);

//   // Re-initialize data when mode or data changes
//   useEffect(() => {
//     if (mode === 'current' && portfolioData) {
//       initializeVersion(portfolioData);
//     } else if (mode === 'actual' && actualDateData) {
//       initializeVersion(actualDateData);
//     }
//   }, [mode, portfolioData, actualDateData]);

//   const initializeVersion = (data) => {
//     const original = data.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       current_price: stock.current_price || 0,
//       extra: stock.extra || 0,
//       capital_gain: stock.capital_gain || 0,
//       percent_return: stock.percent_return || 0,
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const recalculateMetrics = (holdings) => {
//     const totalValue = holdings.reduce((acc, stock) => acc + (stock.value || 0), 0);
//     let weightedEPS = 0, weightedPE = 0, weightedBV = 0;
//     holdings.forEach(stock => {
//       const value = stock.value || 0;
//       const weight = totalValue > 0 ? value / totalValue : 0;
//       weightedEPS += (stock.eps || 0) * weight;
//       weightedPE += (stock.pe || 0) * weight;
//       weightedBV += (stock.bv || 0) * weight;
//     });

//     const totalGain = holdings.reduce((acc, stock) => acc + (stock.capital_gain || 0), 0);
//     const totalInvested = holdings.reduce(
//       (acc, stock) => acc + ((stock.value || 0) - (stock.capital_gain || 0)),
//       0
//     );
//     const totalPct = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0;

//     setMetrics({
//       eps: weightedEPS.toFixed(2),
//       pe: weightedPE.toFixed(2),
//       bv: weightedBV.toFixed(2),
//       gain: totalGain.toFixed(2),
//       return: totalPct.toFixed(2)
//     });
//   };

//   const handleReplacement = (index, value) => {
//     const holding = updatedHoldings[index];
//     let newHoldings = [...updatedHoldings];

//     if (!value) return;

//     const data = mode === 'current' ? portfolioData : actualDateData;

//     if (value === holding.base_symbol) {
//       const original = originalHoldings.find(s => s.symbol === holding.base_symbol);
//       newHoldings[index] = { ...original };
//     } else {
//       const replacements = data.replacement_options[holding.base_symbol] || [];
//       const candidate = replacements.find(r => r.symbol === value);
//       if (!candidate) return;

//       if (mode === 'current') {
//         const newQty = Math.floor(holding.base_value / candidate.price);
//         const newExtra = holding.base_value - (newQty * candidate.price);
//         const marketValue = newQty * candidate.price;
//         const capitalGain = marketValue - holding.base_value;
//         const percentReturn = holding.base_value > 0 ? (capitalGain / holding.base_value * 100) : 0;

//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: newQty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: newExtra,
//           capital_gain: capitalGain,
//           percent_return: percentReturn
//         };
//       } else {
//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: candidate.new_qty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: candidate.extra,
//           capital_gain: candidate.capital_gain,
//           percent_return: candidate.percent_return,
//           current_price: candidate.current_price
//         };
//       }
//     }

//     setUpdatedHoldings(newHoldings);
//     recalculateMetrics(newHoldings);
//   };

//   const resetAll = () => {
//     setUpdatedHoldings([...originalHoldings]);
//     recalculateMetrics([...originalHoldings]);
//   };

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.replacement-dropdown') && !e.target.closest('.symbol-text')) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   if (loading) return <div className="p-6 text-center">Loading...</div>;
//   if (errorMsg) return <div className="p-6 text-center text-red-500">{errorMsg}</div>;

//   const dataSource = mode === 'current' ? portfolioData : actualDateData;

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Reimagine Your Portfolio: What's Your Best Mix?</h1>

//       <div className="flex justify-center mb-4">
//         <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
//           <button
//             className={`px-4 py-2 rounded-md ${mode === 'current' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
//             onClick={() => setMode('current')}
//           >
//             Current Price Mode
//           </button>
//           <button
//             className={`px-4 py-2 rounded-md ${mode === 'actual' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
//             onClick={() => setMode('actual')}
//           >
//             Acquisition Price Mode
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="flex space-x-4">
//           <MetricCard label="EPS" value={metrics.eps} />
//           <MetricCard label="PE" value={metrics.pe} />
//           <MetricCard label="BV" value={metrics.bv} />
//         </div>
//         <div className="flex space-x-4">
//           <MetricCard label="Unrealized PNL" value={`₹${metrics.gain}`} />
//           <MetricCard label="% Unrealized Return" value={`${metrics.return}%`} />
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Holdings</h2>
//         <table className="w-full table-auto text-left">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2">Symbol</th>
//               <th className="px-4 py-2">Quantity</th>
//               <th className="px-4 py-2">Market Value</th>
//               <th className="px-4 py-2">Replacement Value</th>
//               <th className="px-4 py-2">Extra</th>
//               <th className="px-4 py-2">PNL</th>
//               <th className="px-4 py-2">% Return</th>
//             </tr>
//           </thead>
//           <tbody>
//             {updatedHoldings.map((stock, index) => {
//               const replacements = dataSource?.replacement_options[stock.base_symbol] || [];
//               return (
//                 <tr key={index} className="border-t">
//                   <td className="px-4 py-2 relative">
//                     <span className="symbol-text cursor-pointer" onClick={() => toggleDropdown(index)}>
//                       {stock.symbol} ⏷
//                     </span>
//                     {openDropdown === index && (
//                       <select
//                         className="replacement-dropdown absolute z-10 bg-white border rounded shadow left-full top-0 ml-2"
//                         onChange={(e) => handleReplacement(index, e.target.value)}
//                       >
//                         <option value="">-- Select --</option>
//                         <option value={stock.base_symbol}>Reset ({stock.base_symbol})</option>
//                         {replacements.map(rep => (
//                           <option key={rep.symbol} value={rep.symbol}>{rep.symbol}</option>
//                         ))}
//                       </select>
//                     )}
//                   </td>
//                   <td className="px-4 py-2">{stock.qty}</td>
//                   <td className="px-4 py-2">₹{stock.base_value.toFixed(2)}</td>
//                   <td className="px-4 py-2">
//                     ₹{(mode === 'current'
//                       ? (stock.value - (stock.extra || 0))
//                       : (stock.qty * (stock.current_price || 0))).toFixed(2)}
//                   </td>
//                   <td className="px-4 py-2">₹{(stock.extra || 0).toFixed(2)}</td>
//                   <td className="px-4 py-2">₹{(stock.capital_gain || 0).toFixed(2)}</td>
//                   <td className="px-4 py-2">{(stock.percent_return || 0).toFixed(2)}%</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//         <button
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           onClick={resetAll}
//         >
//           Reset All to Original
//         </button>
//       </div>
//     </div>
//   );
// };

// const MetricCard = ({ label, value }) => (
//   <div className="p-4 bg-white rounded-lg shadow w-full">
//     <span className="font-semibold">{label}: </span>
//     <span>{value}</span>
//   </div>
// );

// export default PortfolioReplacement;




// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { RiResetLeftFill } from 'react-icons/ri';
// import { SiShutterstock } from 'react-icons/si';

// const PortfolioReplacement = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [uploadId, setUploadId] = useState(null);
//   const [mode, setMode] = useState('current');
//   const [originalHoldings, setOriginalHoldings] = useState([]);
//   const [updatedHoldings, setUpdatedHoldings] = useState([]);
//   const [metrics, setMetrics] = useState({ eps: 0, pe: 0, bv: 0, gain: 0, return: 0 });
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const getTextColorClass = (value) => {
//   if (value > 0) return 'text-green-600';
//   if (value < 0) return 'text-red-600';
//   return ''; // Default color
// };

//   // Fetch uploadId
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get(`${API_BASE}/file/saved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (data.length) setUploadId(data[0].uploadId);
//         else setErrorMsg('No uploaded files found.');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch upload ID. Please log in.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!uploadId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const [portfolioRes, actualDateRes] = await Promise.all([
//           axios.post(`${API_BASE}/file/portfolio_replacements`, null, { params: { uploadId } }),
//           axios.post(`${API_BASE}/file/actual_date_replacements`, null, { params: { uploadId } })
//         ]);
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [uploadId]);

//   useEffect(() => {
//     if (mode === 'current' && portfolioData) initializeVersion(portfolioData);
//     else if (mode === 'actual' && actualDateData) initializeVersion(actualDateData);
//   }, [mode, portfolioData, actualDateData]);

//   const initializeVersion = (data) => {
//     const original = data.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       current_price: stock.current_price || 0,
//       extra: stock.extra || 0,
//       capital_gain: stock.capital_gain || 0,
//       percent_return: stock.percent_return || 0,
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const recalculateMetrics = (holdings) => {
//     const totalValue = holdings.reduce((acc, stock) => acc + (stock.value || 0), 0);
//     let weightedEPS = 0, weightedPE = 0, weightedBV = 0;
//     holdings.forEach(stock => {
//       const value = stock.value || 0;
//       const weight = totalValue > 0 ? value / totalValue : 0;
//       weightedEPS += (stock.eps || 0) * weight;
//       weightedPE += (stock.pe || 0) * weight;
//       weightedBV += (stock.bv || 0) * weight;
//     });

//     const totalGain = holdings.reduce((acc, stock) => acc + (stock.capital_gain || 0), 0);
//     const totalInvested = holdings.reduce(
//       (acc, stock) => acc + ((stock.value || 0) - (stock.capital_gain || 0)),
//       0
//     );
//     const totalPct = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0;

//     setMetrics({
//       eps: weightedEPS.toFixed(2),
//       pe: weightedPE.toFixed(2),
//       bv: weightedBV.toFixed(2),
//       gain: totalGain.toFixed(2),
//       return: totalPct.toFixed(2)
//     });
//   };

//   const handleReplacement = (index, value) => {
//     const holding = updatedHoldings[index];
//     let newHoldings = [...updatedHoldings];
//     if (!value) return;

//     const data = mode === 'current' ? portfolioData : actualDateData;
//     if (value === holding.base_symbol) {
//       const original = originalHoldings.find(s => s.symbol === holding.base_symbol);
//       newHoldings[index] = { ...original };
//     } else {
//       const replacements = data.replacement_options[holding.base_symbol] || [];
//       const candidate = replacements.find(r => r.symbol === value);
//       if (!candidate) return;

//       if (mode === 'current') {
//         const newQty = Math.floor(holding.base_value / candidate.price);
//         const newExtra = holding.base_value - (newQty * candidate.price);
//         const marketValue = newQty * candidate.price;
//         const capitalGain = marketValue - holding.base_value;
//         const percentReturn = holding.base_value > 0 ? (capitalGain / holding.base_value * 100) : 0;

//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: newQty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: newExtra,
//           capital_gain: capitalGain,
//           percent_return: percentReturn
//         };
//       } else {
//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: candidate.new_qty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: candidate.extra,
//           capital_gain: candidate.capital_gain,
//           percent_return: candidate.percent_return,
//           current_price: candidate.current_price
//         };
//       }
//     }
//     setUpdatedHoldings(newHoldings);
//     recalculateMetrics(newHoldings);
//   };

//   const resetAll = () => {
//     setUpdatedHoldings([...originalHoldings]);
//     recalculateMetrics([...originalHoldings]);
//   };

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.replacement-dropdown') && !e.target.closest('.symbol-text')) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-center px-4">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4s border-b-4 border-blue-500"></div>

//           <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
//         Your portfolio is getting ready...
//       </h2>
//       <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//         Sit tight! We’re analyzing your stocks and preparing insights.
//       </p>
//       </div>
//     );
//   }

//   if (errorMsg) {
//     return <div className="p-6 text-center text-red-500 font-medium">{errorMsg}</div>;
//   }

//   const dataSource = mode === 'current' ? portfolioData : actualDateData;

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
//         Reimagine Your Portfolio: <span className="text-blue-500">What’s Your Best Mix?</span>
//       </h1>

//       <div className="flex justify-center mb-6">
//         <div className="flex space-x-3 bg-gray-100 p-1 rounded-full shadow-inner">
//           <button
//             className={`px-6 py-2 rounded-full transition text-sm font-semibold ${
//               mode === 'current'
//                 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                 : 'text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setMode('current')}
//           >
//             Current Price Mode
//           </button>
//           <button
//             className={`px-6 py-2 rounded-full transition text-sm font-semibold ${
//               mode === 'actual'
//                 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                 : 'text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setMode('actual')}
//           >
//             Acquisition Price Mode
//           </button>
//         </div>
//       </div>

//      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//   <div className="flex gap-4">
//     <MetricCard label="EPS" value={metrics.eps} />
//     <MetricCard label="PE" value={metrics.pe} />
//     <MetricCard label="BV" value={metrics.bv} />
//   </div>
//   <div className="flex gap-4">
//     <MetricCard
//       label="Unrealized PNL"
//       value={`₹${metrics.gain}`}
//       textColorClass={getTextColorClass(metrics.gain)}
//     />
//     <MetricCard
//       label="% Return"
//       value={`${metrics.return}%`}
//       textColorClass={getTextColorClass(metrics.return)}
//     />
//   </div>
// </div>


//       <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-700">Holdings</h2>
//         <table className="w-full table-auto text-sm">
//           <thead className="bg-gray-100 text-gray-600">
//             <tr>
//               <th className="px-4 py-2 text-left">Symbol</th>
//               <th className="px-4 py-2 text-left">Quantity</th>
//               <th className="px-4 py-2 text-left">Market Value</th>
//               <th className="px-4 py-2 text-left">Replacement Value</th>
//               <th className="px-4 py-2 text-left">Extra</th>
//               <th className="px-4 py-2 text-left">PNL</th>
//               <th className="px-4 py-2 text-left">% Return</th>
//             </tr>
//           </thead>
//           <tbody>
//             {updatedHoldings.map((stock, index) => {
//               const replacements = dataSource?.replacement_options[stock.base_symbol] || [];
//               return (
//                 <tr key={index} className="border-t hover:bg-gray-50">
//   <td className="px-4 py-2 relative">
//     <span className="symbol-text cursor-pointer text-blue-600" onClick={() => toggleDropdown(index)}>
//       {stock.symbol} ⏷
//     </span>
//     {openDropdown === index && (
//       <select
//         className="replacement-dropdown absolute z-10 bg-white border rounded shadow top-0 ml-2 w-20"
//         onChange={(e) => handleReplacement(index, e.target.value)}
//       >
//         <option value="">-- Select --</option>
//         <option value={stock.base_symbol}>Reset ({stock.base_symbol})</option>
//         {replacements.map(rep => (
//           <option key={rep.symbol} value={rep.symbol}>{rep.symbol}</option>
//         ))}
//       </select>
//     )}
//   </td>
//         <td className="px-4 py-2">{stock.qty}</td>
//        <td className="px-4 py-2">
//   ₹{stock.base_value.toFixed(2)} ({stock.base_symbol})
// </td>
//        <td className="px-4 py-2">
//   ₹{(mode === 'current'
//       ? (stock.value - (stock.extra || 0))
//       : (stock.qty * (stock.current_price || 0))
//     ).toFixed(2)} ({stock.symbol})
// </td>
//       <td className={`px-4 py-2 ${getTextColorClass(stock.extra)}`}>
//         ₹{(stock.extra || 0).toFixed(2)}
//       </td>
//       <td className={`px-4 py-2 ${getTextColorClass(stock.capital_gain)}`}>
//         ₹{(stock.capital_gain || 0).toFixed(2)}
//       </td>
//       <td className={`px-4 py-2 ${getTextColorClass(stock.percent_return)}`}>
//         {(stock.percent_return || 0).toFixed(2)}%
//       </td>
//       </tr>

//               );
//             })}
//           </tbody>
//         </table>
//         <div className="text-center">
//   <button
//     className="mt-6 inline-flex items-center gap-2 px-6 py-2 text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
//     onClick={resetAll}
//   >
//     <RiResetLeftFill className="text-lg" />
//     <span>Reset All to Original</span>
//   </button>
// </div>
//       </div>
//     </div>
//   );
// };

// const MetricCard = ({ label, value, textColorClass = "" }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 w-full dark:bg-slate-800">
//       <h4 className="text-gray-600 text-sm dark:text-gray-300">{label}</h4>
//       <p className={`text-2xl font-bold ${textColorClass}`}>
//         {value}
//       </p>
//     </div>
//   );
// };


// export default PortfolioReplacement;


// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { RiErrorWarningLine, RiResetLeftFill } from 'react-icons/ri';
// import { SiShutterstock } from 'react-icons/si';
// import { HashLoader } from 'react-spinners';

// const PortfolioReplacement = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [uploadId, setUploadId] = useState(null);
//   const [mode, setMode] = useState('current');
//   const [originalHoldings, setOriginalHoldings] = useState([]);
//   const [updatedHoldings, setUpdatedHoldings] = useState([]);
//   const [metrics, setMetrics] = useState({ eps: 0, pe: 0, bv: 0, gain: 0, return: 0 });
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const getTextColorClass = (value) => {
//   if (value > 0) return 'text-green-600';
//   if (value < 0) return 'text-red-600';
//   return ''; // Default color
// };

//   // Fetch uploadId
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get(`${API_BASE}/file/saved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (data.length) setUploadId(data[0].uploadId);
//         else setErrorMsg('No uploaded files found.');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg(' Please log in to check.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!uploadId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const [portfolioRes, actualDateRes] = await Promise.all([
//           axios.post(`${API_BASE}/file/portfolio_replacements`, null, { params: { uploadId } }),
//           axios.post(`${API_BASE}/file/actual_date_replacements`, null, { params: { uploadId } })
//         ]);
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [uploadId]);

//   useEffect(() => {
//     if (mode === 'current' && portfolioData) initializeVersion(portfolioData);
//     else if (mode === 'actual' && actualDateData) initializeVersion(actualDateData);
//   }, [mode, portfolioData, actualDateData]);

//   const initializeVersion = (data) => {
//     const original = data.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       current_price: stock.current_price || 0,
//       extra: stock.extra || 0,
//       capital_gain: stock.capital_gain || 0,
//       percent_return: stock.percent_return || 0,
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const recalculateMetrics = (holdings) => {
//     const totalValue = holdings.reduce((acc, stock) => acc + (stock.value || 0), 0);
//     let weightedEPS = 0, weightedPE = 0, weightedBV = 0;
//     holdings.forEach(stock => {
//       const value = stock.value || 0;
//       const weight = totalValue > 0 ? value / totalValue : 0;
//       weightedEPS += (stock.eps || 0) * weight;
//       weightedPE += (stock.pe || 0) * weight;
//       weightedBV += (stock.bv || 0) * weight;
//     });

//     const totalGain = holdings.reduce((acc, stock) => acc + (stock.capital_gain || 0), 0);
//     const totalInvested = holdings.reduce(
//       (acc, stock) => acc + ((stock.value || 0) - (stock.capital_gain || 0)),
//       0
//     );
//     const totalPct = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0;

//     setMetrics({
//       eps: weightedEPS.toFixed(2),
//       pe: weightedPE.toFixed(2),
//       bv: weightedBV.toFixed(2),
//       gain: totalGain.toFixed(2),
//       return: totalPct.toFixed(2)
//     });
//   };

//   const handleReplacement = (index, value) => {
//     const holding = updatedHoldings[index];
//     let newHoldings = [...updatedHoldings];
//     if (!value) return;

//     const data = mode === 'current' ? portfolioData : actualDateData;
//     if (value === holding.base_symbol) {
//       const original = originalHoldings.find(s => s.symbol === holding.base_symbol);
//       newHoldings[index] = { ...original };
//     } else {
//       const replacements = data.replacement_options[holding.base_symbol] || [];
//       const candidate = replacements.find(r => r.symbol === value);
//       if (!candidate) return;

//       if (mode === 'current') {
//         const newQty = Math.floor(holding.base_value / candidate.price);
//         const newExtra = holding.base_value - (newQty * candidate.price);
//         const marketValue = newQty * candidate.price;
//         const capitalGain = marketValue - holding.base_value;
//         const percentReturn = holding.base_value > 0 ? (capitalGain / holding.base_value * 100) : 0;

//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: newQty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: newExtra,
//           capital_gain: capitalGain,
//           percent_return: percentReturn
//         };
//       } else {
//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: candidate.new_qty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: candidate.extra,
//           capital_gain: candidate.capital_gain,
//           percent_return: candidate.percent_return,
//           current_price: candidate.current_price
//         };
//       }
//     }
//     setUpdatedHoldings(newHoldings);
//     recalculateMetrics(newHoldings);
//   };

//   const resetAll = () => {
//     setUpdatedHoldings([...originalHoldings]);
//     recalculateMetrics([...originalHoldings]);
//   };

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.replacement-dropdown') && !e.target.closest('.symbol-text')) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           Your portfolio is getting ready...
//       </p>
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-sm animate-pulse">
//            Sit tight! We are analyzing your stocks and preparing insights.
//       </p>
//     </div>
//     );
//   }

//   if (errorMsg) {
//     return  <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg flex items-center gap-2">
//                 <RiErrorWarningLine className="text-red-500 text-lg" />
//                 <p className="text-red-600 dark:text-red-300 text-sm">{errorMsg}</p>
//               </div>
//   }

//   const dataSource = mode === 'current' ? portfolioData : actualDateData;

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
//         Reimagine Your Portfolio: <span className="text-blue-500">What’s Your Best Mix?</span>
//       </h1>

//       <div className="flex justify-center mb-6">
//         <div className="flex space-x-3 bg-gray-100 p-1 rounded-full shadow-inner dark:bg-slate-800 dark:text-white">
//           <button
//             className={`px-6 py-2 rounded-full transition text-sm font-semibold ${
//               mode === 'current'
//                 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                 : 'text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setMode('current')}
//           >
//             Current Price Mode
//           </button>
//           <button
//             className={`px-6 py-2 rounded-full transition text-sm font-semibold ${
//               mode === 'actual'
//                 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                 : 'text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setMode('actual')}
//           >
//             Acquisition Price Mode
//           </button>
//         </div>
//       </div>

//      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//   <div className="flex gap-4">
//     <MetricCard label="EPS" value={metrics.eps} />
//     <MetricCard label="PE" value={metrics.pe} />
//     <MetricCard label="BV" value={metrics.bv} />
//   </div>
//   <div className="flex gap-4">
//     <MetricCard
//       label="Unrealized PNL"
//       value={`₹${metrics.gain}`}
//       textColorClass={getTextColorClass(metrics.gain)}
//     />
//     <MetricCard
//       label="% Return"
//       value={`${metrics.return}%`}
//       textColorClass={getTextColorClass(metrics.return)}
//     />
//   </div>
// </div>


//       <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto dark:bg-slate-800 dark:text-white">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:bg-slate-800 dark:text-white">Holdings</h2>
//         <table className="w-full table-auto text-sm dark:bg-slate-800 dark:text-white">
//           <thead className="bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-white">
//             <tr>
//               <th className="px-4 py-2 text-left">Symbol</th>
//               <th className="px-4 py-2 text-left">Quantity</th>
//               <th className="px-4 py-2 text-left">Market Value</th>
//               <th className="px-4 py-2 text-left">Replacement Value</th>
//               <th className="px-4 py-2 text-left">Extra</th>
//               <th className="px-4 py-2 text-left">PNL</th>
//               <th className="px-4 py-2 text-left">% Return</th>
//             </tr>
//           </thead>
//           <tbody>
//             {updatedHoldings.map((stock, index) => {
//               const replacements = dataSource?.replacement_options[stock.base_symbol] || [];
//               return (
//                 <tr key={index} className="border-t hover:bg-gray-50 dark:bg-slate-800 dark:text-white">
//   <td className="px-4 py-2 relative dark:bg-slate-800 dark:text-white">
//     <span className="symbol-text cursor-pointer text-blue-600" onClick={() => toggleDropdown(index)}>
//       {stock.symbol} ⏷
//     </span>
//     {openDropdown === index && (
//       <select
//         className="replacement-dropdown absolute z-10 bg-white border rounded shadow top-0 ml-2 w-20 dark:bg-slate-800 dark:text-white"
//         onChange={(e) => handleReplacement(index, e.target.value)}
//       >
//         <option value="">-- Select --</option>
//         <option value={stock.base_symbol}>Reset ({stock.base_symbol})</option>
//         {replacements.map(rep => (
//           <option key={rep.symbol} value={rep.symbol}>{rep.symbol}</option>
//         ))}
//       </select>
//     )}
//   </td>
//         <td className="px-4 py-2">{stock.qty}</td>
//        <td className="px-4 py-2">
//   ₹{stock.base_value.toFixed(2)} ({stock.base_symbol})
// </td>
//        <td className="px-4 py-2">
//   ₹{(mode === 'current'
//       ? (stock.value - (stock.extra || 0))
//       : (stock.qty * (stock.current_price || 0))
//     ).toFixed(2)} ({stock.symbol})
// </td>
//       <td className={`px-4 py-2 ${getTextColorClass(stock.extra)}`}>
//         ₹{(stock.extra || 0).toFixed(2)}
//       </td>
//       <td className={`px-4 py-2 ${getTextColorClass(stock.capital_gain)}`}>
//         ₹{(stock.capital_gain || 0).toFixed(2)}
//       </td>
//       <td className={`px-4 py-2 ${getTextColorClass(stock.percent_return)}`}>
//         {(stock.percent_return || 0).toFixed(2)}%
//       </td>
//       </tr>

//               );
//             })}
//           </tbody>
//         </table>
//         <div className="text-center">
//   <button
//     className="mt-6 inline-flex items-center gap-2 px-6 py-2 text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
//     onClick={resetAll}
//   >
//     <RiResetLeftFill className="text-lg" />
//     <span>Reset All to Original</span>
//   </button>
// </div>
//       </div>
//     </div>
//   );
// };

// const MetricCard = ({ label, value, textColorClass = "" }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 w-full dark:bg-slate-800 ">
//       <h4 className="text-gray-600 text-sm dark:text-gray-300">{label}</h4>
//       <p className={`text-2xl font-bold ${textColorClass}`}>
//         {value}
//       </p>
//     </div>
//   );
// };


// export default PortfolioReplacement;

// ----------------working code---------------


// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { RiErrorWarningLine, RiResetLeftFill } from 'react-icons/ri';
// import { SiShutterstock } from 'react-icons/si';
// import { HashLoader } from 'react-spinners';
// import Navbar from "../Navbar"

// const formatNumberWithCommas = (number) => {
//   return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// const PortfolioReplacement = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [uploadId, setUploadId] = useState(null);
//   const [mode, setMode] = useState('current');
//   const [originalHoldings, setOriginalHoldings] = useState([]);
//   const [updatedHoldings, setUpdatedHoldings] = useState([]);
//   const [metrics, setMetrics] = useState({ eps: 0, pe: 0, bv: 0, gain: 0, return: 0 });
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const getTextColorClass = (value) => {
//   if (value > 0) return 'text-green-600';
//   if (value < 0) return 'text-red-600';
//   return ''; // Default color
// };

//   // Fetch uploadId
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get(`${API_BASE}/file/saved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (data.length) setUploadId(data[0].uploadId);
//         else setErrorMsg('No uploaded files found, Please upload a file before continuing.');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg(' Please log in to check.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!uploadId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const [portfolioRes, actualDateRes] = await Promise.all([
//           axios.post(`${API_BASE}/file/portfolio_replacements`, null, { params: { uploadId } }),
//           axios.post(`${API_BASE}/file/actual_date_replacements`, null, { params: { uploadId } })
//         ]);
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [uploadId]);

//   useEffect(() => {
//     if (mode === 'current' && portfolioData) initializeVersion(portfolioData);
//     else if (mode === 'actual' && actualDateData) initializeVersion(actualDateData);
//   }, [mode, portfolioData, actualDateData]);

//   const initializeVersion = (data) => {
//     const original = data.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       current_price: stock.current_price || 0,
//       extra: stock.extra || 0,
//       capital_gain: stock.capital_gain || 0,
//       percent_return: stock.percent_return || 0,
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const recalculateMetrics = (holdings) => {
//     const totalValue = holdings.reduce((acc, stock) => acc + (stock.value || 0), 0);
//     let weightedEPS = 0, weightedPE = 0, weightedBV = 0;
//     holdings.forEach(stock => {
//       const value = stock.value || 0;
//       const weight = totalValue > 0 ? value / totalValue : 0;
//       weightedEPS += (stock.eps || 0) * weight;
//       weightedPE += (stock.pe || 0) * weight;
//       weightedBV += (stock.bv || 0) * weight;
//     });

//     const totalGain = holdings.reduce((acc, stock) => acc + (stock.capital_gain || 0), 0);
//     const totalInvested = holdings.reduce(
//       (acc, stock) => acc + ((stock.value || 0) - (stock.capital_gain || 0)),
//       0
//     );
//     const totalPct = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0;

//     setMetrics({
//       eps: weightedEPS.toFixed(2),
//       pe: weightedPE.toFixed(2),
//       bv: weightedBV.toFixed(2),
//       gain: totalGain.toFixed(2),
//       return: totalPct.toFixed(2)
//     });
//   };

//   const handleReplacement = (index, value) => {
//     const holding = updatedHoldings[index];
//     let newHoldings = [...updatedHoldings];
//     if (!value) return;

//     const data = mode === 'current' ? portfolioData : actualDateData;
//     if (value === holding.base_symbol) {
//       const original = originalHoldings.find(s => s.symbol === holding.base_symbol);
//       newHoldings[index] = { ...original };
//     } else {
//       const replacements = data.replacement_options[holding.base_symbol] || [];
//       const candidate = replacements.find(r => r.symbol === value);
//       if (!candidate) return;

//       if (mode === 'current') {
//         const newQty = Math.floor(holding.base_value / candidate.price);
//         const newExtra = holding.base_value - (newQty * candidate.price);
//         const marketValue = newQty * candidate.price;
//         const capitalGain = marketValue - holding.base_value;
//         const percentReturn = holding.base_value > 0 ? (capitalGain / holding.base_value * 100) : 0;

//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: newQty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: newExtra,
//           capital_gain: capitalGain,
//           percent_return: percentReturn
//         };
//       } else {
//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: candidate.new_qty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: candidate.extra,
//           capital_gain: candidate.capital_gain,
//           percent_return: candidate.percent_return,
//           current_price: candidate.current_price
//         };
//       }
//     }
//     setUpdatedHoldings(newHoldings);
//     recalculateMetrics(newHoldings);
//   };

//   const resetAll = () => {
//     setUpdatedHoldings([...originalHoldings]);
//     recalculateMetrics([...originalHoldings]);
//   };

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.replacement-dropdown') && !e.target.closest('.symbol-text')) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   if (loading) {
//     return (

//   <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           Your portfolio is getting ready...
//       </p>
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-sm animate-pulse">
//            Sit tight! We are analyzing your stocks and preparing insights.
//       </p>
//     </div>
//     );
//   }

//   if (errorMsg) {
//     return  <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg flex items-center gap-2">
//                 <RiErrorWarningLine className="text-red-500 text-lg" />
//                 <p className="text-red-600 dark:text-red-300 text-sm">{errorMsg}</p>
//               </div>
//   }

//   const dataSource = mode === 'current' ? portfolioData : actualDateData;

//   return (
//      <div className="min-h-screen bg-white p-6 dark:bg-slate-800 dark:text-white">
//           <Navbar />
//     <div className="max-w-7xl mt-16 mx-auto p-6">
//       <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
//         Reimagine Your Portfolio: <span className="text-blue-500">What’s Your Best Mix?</span>
//       </h1>

//       <div className="flex justify-center mb-6">
//         <div className="flex space-x-3 bg-gray-100 p-1 rounded-full shadow-inner dark:bg-slate-800 dark:text-white">
//           <button
//             className={`px-6 py-2 rounded-full transition text-sm font-semibold ${
//               mode === 'current'
//                 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                 : 'text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setMode('current')}
//           >
//             Current Price Mode
//           </button>
//           <button
//             className={`px-6 py-2 rounded-full transition text-sm font-semibold ${
//               mode === 'actual'
//                 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                 : 'text-gray-700 hover:bg-gray-200'
//             }`}
//             onClick={() => setMode('actual')}
//           >
//             Acquisition Price Mode
//           </button>
//         </div>
//       </div>

//      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-sans">
//   <div className="flex gap-4 font-sans">
//     <MetricCard label="EPS" value={metrics.eps} />
//     <MetricCard label="PE" value={metrics.pe} />
//     <MetricCard label="BV" value={metrics.bv} />
//   </div>
//   <div className="flex gap-4 font-sans">
//     <MetricCard
//       label="Unrealized PNL"
//       value={`₹${metrics.gain}`}
//       textColorClass={getTextColorClass(metrics.gain)}
//     />
//     <MetricCard
//       label="% Return"
//       value={`${metrics.return}%`}
//       textColorClass={getTextColorClass(metrics.return)}
//     />
//   </div>
// </div>


//       <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto dark:bg-slate-800 dark:text-white">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:bg-slate-800 dark:text-white">Holdings</h2>
//         <table className="w-full table-auto text-sm dark:bg-slate-800 dark:text-white">
//           <thead className="bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-white">
//             <tr>
//               <th className="px-4 py-2 text-left">Symbol</th>
//               <th className="px-4 py-2 text-left">Quantity</th>
//               <th className="px-4 py-2 text-left">Market Value</th>
//               <th className="px-4 py-2 text-left">Replacement Value</th>
//               <th className="px-4 py-2 text-left">Extra</th>
//               <th className="px-4 py-2 text-left">PNL</th>
//               <th className="px-4 py-2 text-left">% Return</th>
//             </tr>
//           </thead>
//           <tbody>
//   {updatedHoldings.map((stock, index) => {
//     const replacements = dataSource?.replacement_options[stock.base_symbol] || [];
//     return (
//       <tr key={index} className="border-t hover:bg-gray-50 dark:bg-slate-800 dark:text-white font-sans">
//         <td className="px-4 py-2 relative dark:bg-slate-800 dark:text-white">
//           <span className="symbol-text cursor-pointer  text-blue-600" onClick={() => toggleDropdown(index)}>
//             {stock.symbol} ⏷
//           </span>
//           {openDropdown === index && (
//             <select
//               className="replacement-dropdown absolute z-10 bg-white border rounded shadow top-0 ml-2 w-20 dark:bg-slate-800 dark:text-white"
//               onChange={(e) => handleReplacement(index, e.target.value)}
//             >
//               <option value="">-- Select --</option>
//               <option value={stock.base_symbol}>Reset ({stock.base_symbol})</option>
//               {replacements.map(rep => (
//                 <option key={rep.symbol} value={rep.symbol}>{rep.symbol}</option>
//               ))}
//             </select>
//           )}
//         </td>
//         <td className="px-4 py-2 font-sans">{stock.qty}</td>
//         <td className="px-4 py-2 font-sans">
//           ₹{formatNumberWithCommas(stock.base_value)} ({stock.base_symbol})
//         </td>
//         <td className="px-4 py-2 font-sans">
//           ₹{formatNumberWithCommas(
//             mode === 'current'
//               ? stock.value - (stock.extra || 0)
//               : stock.qty * (stock.current_price || 0)
//           )} ({stock.symbol})
//         </td>
//         <td className={`px-4 py-2 font-sans text-black dark:text-white`}>
//           ₹{formatNumberWithCommas(stock.extra || 0)}
//         </td>
//         <td className={`px-4 font-sans py-2 ${getTextColorClass(stock.capital_gain)}`}>
//           ₹{formatNumberWithCommas(stock.capital_gain || 0)}
//         </td>
//         <td className={`px-4 font-sans py-2 ${getTextColorClass(stock.percent_return)}`}>
//           {formatNumberWithCommas(stock.percent_return || 0)}%
//         </td>
//       </tr>
//     );
//   })}
// </tbody>
//         </table>
//         <div className="text-center">
//   <button
//     className="mt-6 inline-flex items-center gap-2 px-6 py-2 text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
//     onClick={resetAll}
//   >
//     <RiResetLeftFill className="text-lg" />
//     <span>Reset All to Original</span>
//   </button>
// </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// const MetricCard = ({ label, value, textColorClass = "" }) => {
//   // Handle cases where value includes currency or percentage
//   const formattedValue = typeof value === 'string' && value.startsWith('₹')
//     ? `₹${formatNumberWithCommas(parseFloat(value.replace('₹', '')))}`
//     : typeof value === 'string' && value.endsWith('%')
//     ? `${formatNumberWithCommas(parseFloat(value.replace('%', '')))}%`
//     : formatNumberWithCommas(parseFloat(value));

//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 w-full dark:bg-slate-800 ">
//       <h4 className="text-gray-600 text-sm dark:text-gray-300">{label}</h4>
//       <p className={`text-2xl font-bold ${textColorClass}`}>
//         {formattedValue}
//       </p>
//     </div>
//   );
// };


// export default PortfolioReplacement;



// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { RiErrorWarningLine, RiResetLeftFill } from 'react-icons/ri';
// import { HashLoader } from 'react-spinners';
// import Navbar from '../Navbar';

// const formatNumberWithCommas = (number) => {
//   return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// const PortfolioReplacement = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [uploadId, setUploadId] = useState(null);
//   const [portfolios, setPortfolios] = useState([]); // New state for portfolio list
//   const [mode, setMode] = useState('current');
//   const [originalHoldings, setOriginalHoldings] = useState([]);
//   const [updatedHoldings, setUpdatedHoldings] = useState([]);
//   const [metrics, setMetrics] = useState({ eps: 0, pe: 0, bv: 0, gain: 0, return: 0 });
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const getTextColorClass = (value) => {
//     if (value > 0) return 'text-green-600';
//     if (value < 0) return 'text-red-600';
//     return '';
//   };

//   // Fetch saved portfolios
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get(`${API_BASE}/file/saved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (data.length) {
//           setPortfolios(data); // Store all portfolios
//           setUploadId(data[0].uploadId); // Set default to first portfolio
//         } else {
//           setErrorMsg('No uploaded files found. Please upload a file before continuing.');
//         }
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Please log in to continue.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Fetch portfolio data when uploadId changes
//   useEffect(() => {
//     if (!uploadId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const [portfolioRes, actualDateRes] = await Promise.all([
//           axios.post(`${API_BASE}/file/portfolio_replacements`, null, { params: { uploadId } }),
//           axios.post(`${API_BASE}/file/actual_date_replacements`, null, { params: { uploadId } })
//         ]);
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [uploadId]);

//   useEffect(() => {
//     if (mode === 'current' && portfolioData) initializeVersion(portfolioData);
//     else if (mode === 'actual' && actualDateData) initializeVersion(actualDateData);
//   }, [mode, portfolioData, actualDateData]);

//   const initializeVersion = (data) => {
//     const original = data.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       current_price: stock.current_price || 0,
//       extra: stock.extra || 0,
//       capital_gain: stock.capital_gain || 0,
//       percent_return: stock.percent_return || 0,
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const recalculateMetrics = (holdings) => {
//     const totalValue = holdings.reduce((acc, stock) => acc + (stock.value || 0), 0);
//     let weightedEPS = 0, weightedPE = 0, weightedBV = 0;
//     holdings.forEach(stock => {
//       const value = stock.value || 0;
//       const weight = totalValue > 0 ? value / totalValue : 0;
//       weightedEPS += (stock.eps || 0) * weight;
//       weightedPE += (stock.pe || 0) * weight;
//       weightedBV += (stock.bv || 0) * weight;
//     });

//     const totalGain = holdings.reduce((acc, stock) => acc + (stock.capital_gain || 0), 0);
//     const totalInvested = holdings.reduce(
//       (acc, stock) => acc + ((stock.value || 0) - (stock.capital_gain || 0)),
//       0
//     );
//     const totalPct = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0;

//     setMetrics({
//       eps: weightedEPS.toFixed(2),
//       pe: weightedPE.toFixed(2),
//       bv: weightedBV.toFixed(2),
//       gain: totalGain.toFixed(2),
//       return: totalPct.toFixed(2)
//     });
//   };

//   const handleReplacement = (index, value) => {
//     const holding = updatedHoldings[index];
//     let newHoldings = [...updatedHoldings];
//     if (!value) return;

//     const data = mode === 'current' ? portfolioData : actualDateData;
//     if (value === holding.base_symbol) {
//       const original = originalHoldings.find(s => s.symbol === holding.base_symbol);
//       newHoldings[index] = { ...original };
//     } else {
//       const replacements = data.replacement_options[holding.base_symbol] || [];
//       const candidate = replacements.find(r => r.symbol === value);
//       if (!candidate) return;

//       if (mode === 'current') {
//         const newQty = Math.floor(holding.base_value / candidate.price);
//         const newExtra = holding.base_value - (newQty * candidate.price);
//         const marketValue = newQty * candidate.price;
//         const capitalGain = marketValue - holding.base_value;
//         const percentReturn = holding.base_value > 0 ? (capitalGain / holding.base_value * 100) : 0;

//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: newQty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: newExtra,
//           capital_gain: capitalGain,
//           percent_return: percentReturn
//         };
//       } else {
//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: candidate.new_qty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: candidate.extra,
//           capital_gain: candidate.capital_gain,
//           percent_return: candidate.percent_return,
//           current_price: candidate.current_price
//         };
//       }
//     }
//     setUpdatedHoldings(newHoldings);
//     recalculateMetrics(newHoldings);
//   };

//   const resetAll = () => {
//     setUpdatedHoldings([...originalHoldings]);
//     recalculateMetrics([...originalHoldings]);
//   };

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   const handlePortfolioChange = (e) => {
//     setUploadId(e.target.value);
//     setOpenDropdown(null); // Close any open replacement dropdown
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.replacement-dropdown') && !e.target.closest('.symbol-text') && !e.target.closest('#portfolio-select')) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           Your portfolio is getting ready...
//         </p>
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-sm animate-pulse">
//           Sit tight! We are analyzing your stocks and preparing insights.
//         </p>
//       </div>
//     );
//   }

//   if (errorMsg) {
//     return (
//       <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg flex items-center gap-2">
//         <RiErrorWarningLine className="text-red-500 text-lg" />
//         <p className="text-red-600 dark:text-red-300 text-sm">{errorMsg}</p>
//       </div>
//     );
//   }

//   const dataSource = mode === 'current' ? portfolioData : actualDateData;

//   return (
//     <div className="min-h-screen bg-white p-6 dark:bg-slate-800 dark:text-white">
//       <Navbar />
//       <div className="max-w-7xl mx-auto mt-16 p-6">
//         <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
//           Reimagine Your Portfolio: <span className="text-blue-500">What’s Your Best Mix?</span>
//         </h1>

//         {/* Portfolio Selection Dropdown */}
//         <div className="flex justify-center mb-6">
//           <select
//             id="portfolio-select"
//             className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={uploadId || ''}
//             onChange={handlePortfolioChange}
//           >
//             <option value="" disabled>Select Portfolio</option>
//             {portfolios.map((portfolio) => (
//               <option key={portfolio.uploadId} value={portfolio.uploadId}>
//                     {portfolio.PortfolioName} ({portfolio.platform}){/* Adjust based on API response */}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-center mb-6">
//           <div className="flex space-x-3 bg-gray-100 p-1 rounded-full shadow-inner dark:bg-slate-800 dark:text-white">
//             <button
//               className={`px-6 py-2 rounded-full transition text-sm font-semibold ${
//                 mode === 'current'
//                   ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                   : 'text-gray-700 hover:bg-gray-200 dark:text-white'
//               }`}
//               onClick={() => setMode('current')}
//             >
//               Current Price Mode
//             </button>
//             <button
//               className={`px-6 py-2 rounded-full transition text-sm font-semibold ${
//                 mode === 'actual'
//                   ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                   : 'text-gray-700 hover:bg-gray-200 dark:text-white'
//               }`}
//               onClick={() => setMode('actual')}
//             >
//               Acquisition Price Mode
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-sans">
//           <div className="flex gap-4 font-sans">
//             <MetricCard label="EPS" value={metrics.eps} />
//             <MetricCard label="PE" value={metrics.pe} />
//             <MetricCard label="BV" value={metrics.bv} />
//           </div>
//           <div className="flex gap-4 font-sans">
//             <MetricCard
//               label="Unrealized PNL"
//               value={`₹${metrics.gain}`}
//               textColorClass={getTextColorClass(metrics.gain)}
//             />
//             <MetricCard
//               label="% Return"
//               value={`${metrics.return}%`}
//               textColorClass={getTextColorClass(metrics.return)}
//             />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto dark:bg-slate-800 dark:text-white">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:bg-slate-800 dark:text-white">Holdings</h2>
//           <table className="w-full table-auto text-sm dark:bg-slate-800 dark:text-white">
//             <thead className="bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-white">
//               <tr>
//                 <th className="px-4 py-2 text-left">Symbol</th>
//                 <th className="px-4 py-2 text-left">Quantity</th>
//                 <th className="px-4 py-2 text-left">Market Value</th>
//                 <th className="px-4 py-2 text-left">Replacement Value</th>
//                 <th className="px-4 py-2 text-left">Extra</th>
//                 <th className="px-4 py-2 text-left">PNL</th>
//                 <th className="px-4 py-2 text-left">% Return</th>
//               </tr>
//             </thead>
//             <tbody>
//               {updatedHoldings.map((stock, index) => {
//                 const replacements = dataSource?.replacement_options[stock.base_symbol] || [];
//                 return (
//                   <tr key={index} className="border-t hover:bg-gray-50 dark:bg-slate-800 dark:text-white font-sans">
//                     <td className="px-4 py-2 relative dark:bg-slate-800 dark:text-white">
//                       <span className="symbol-text cursor-pointer text-blue-600" onClick={() => toggleDropdown(index)}>
//                         {stock.symbol} ⏷
//                       </span>
//                       {openDropdown === index && (
//                         <select
//                           className="replacement-dropdown absolute z-10 bg-white border rounded shadow top-0 ml-2 w-20 dark:bg-slate-800 dark:text-white"
//                           onChange={(e) => handleReplacement(index, e.target.value)}
//                         >
//                           <option value="">-- Select --</option>
//                           <option value={stock.base_symbol}>Reset ({stock.base_symbol})</option>
//                           {replacements.map(rep => (
//                             <option key={rep.symbol} value={rep.symbol}>{rep.symbol}</option>
//                           ))}
//                         </select>
//                       )}
//                     </td>
//                     <td className="px-4 py-2 font-sans">{stock.qty}</td>
//                     <td className="px-4 py-2 font-sans">
//                       ₹{formatNumberWithCommas(stock.base_value)} ({stock.base_symbol})
//                     </td>
//                     <td className="px-4 py-2 font-sans">
//                       ₹{formatNumberWithCommas(
//                         mode === 'current'
//                           ? stock.value - (stock.extra || 0)
//                           : stock.qty * (stock.current_price || 0)
//                       )} ({stock.symbol})
//                     </td>
//                     <td className={`px-4 py-2 font-sans text-black dark:text-white`}>
//                       ₹{formatNumberWithCommas(stock.extra || 0)}
//                     </td>
//                     <td className={`px-4 font-sans py-2 ${getTextColorClass(stock.capital_gain)}`}>
//                       ₹{formatNumberWithCommas(stock.capital_gain || 0)}
//                     </td>
//                     <td className={`px-4 font-sans py-2 ${getTextColorClass(stock.percent_return)}`}>
//                       {formatNumberWithCommas(stock.percent_return || 0)}%
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//           <div className="text-center">
//             <button
//               className="mt-6 inline-flex items-center gap-2 px-6 py-2 text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
//               onClick={resetAll}
//             >
//               <RiResetLeftFill className="text-lg" />
//               <span>Reset All to Original</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MetricCard = ({ label, value, textColorClass = "" }) => {
//   const formattedValue = typeof value === 'string' && value.startsWith('₹')
//     ? `₹${formatNumberWithCommas(parseFloat(value.replace('₹', '')))}`
//     : typeof value === 'string' && value.endsWith('%')
//     ? `${formatNumberWithCommas(parseFloat(value.replace('%', '')))}%`
//     : formatNumberWithCommas(parseFloat(value));

//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 w-full dark:bg-slate-800">
//       <h4 className="text-gray-600 text-sm dark:text-gray-300">{label}</h4>
//       <p className={`text-2xl font-bold ${textColorClass}`}>
//         {formattedValue}
//       </p>
//     </div>
//   );
// };

// export default PortfolioReplacement;





























// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { RiErrorWarningLine, RiResetLeftFill } from 'react-icons/ri';
// import { HashLoader } from 'react-spinners';
// import Navbar from '../Navbar';

// const formatNumberWithCommas = (number) => {
//   return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// const ErrorCard = ({ message, actionText, actionUrl, onActionClick }) => {
//   return (
//     <div
//       role="alert"
//       aria-live="assertive"
//       className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg flex flex-col items-center gap-4 max-w-md mx-auto border border-red-200 dark:border-red-800 shadow-md"
//     >
//       <div className="flex items-center gap-3">
//         <RiErrorWarningLine className="text-red-500 text-2xl" />
//         <p className="text-red-600 dark:text-red-300 text-base font-medium text-center">
//           {message}
//         </p>
//       </div>
//       {actionText && (
//         <button
//           onClick={onActionClick || (() => window.location.href = actionUrl)}
//           className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
//         >
//           {actionText}
//         </button>
//       )}
//     </div>
//   );
// };

// const PortfolioReplacement = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [uploadId, setUploadId] = useState(null);
//   const [portfolios, setPortfolios] = useState([]); // New state for portfolio list
//   const [mode, setMode] = useState('current');
//   const [originalHoldings, setOriginalHoldings] = useState([]);
//   const [updatedHoldings, setUpdatedHoldings] = useState([]);
//   const [metrics, setMetrics] = useState({ eps: 0, pe: 0, bv: 0, gain: 0, return: 0 });
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [actualDateData, setActualDateData] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const getTextColorClass = (value) => {
//     if (value > 0) return 'text-green-600';
//     if (value < 0) return 'text-red-600';
//     return '';
//   };

//   // Fetch saved portfolios
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('authToken');
//         const { data } = await axios.get(`${API_BASE}/file/saved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (data.length) {
//           setPortfolios(data); // Store all portfolios
//           setUploadId(data[0].uploadId); // Set default to first portfolio
//         } else {
//           setErrorMsg('No uploaded files found. Please upload a file before continuing.');
//         }
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Please log in to continue.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // Fetch portfolio data when uploadId changes
//   useEffect(() => {
//     if (!uploadId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const [portfolioRes, actualDateRes] = await Promise.all([
//           axios.post(`${API_BASE}/file/portfolio_replacements`, null, { params: { uploadId } }),
//           axios.post(`${API_BASE}/file/actual_date_replacements`, null, { params: { uploadId } })
//         ]);
//         setPortfolioData(portfolioRes.data);
//         setActualDateData(actualDateRes.data);
//         setErrorMsg('');
//       } catch (err) {
//         console.error(err);
//         setErrorMsg('Failed to fetch portfolio data.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [uploadId]);

//   useEffect(() => {
//     if (mode === 'current' && portfolioData) initializeVersion(portfolioData);
//     else if (mode === 'actual' && actualDateData) initializeVersion(actualDateData);
//   }, [mode, portfolioData, actualDateData]);

//   const initializeVersion = (data) => {
//     const original = data.current_holdings.map(stock => ({
//       ...stock,
//       base_symbol: stock.symbol,
//       base_value: stock.value,
//       current_price: stock.current_price || 0,
//       extra: stock.extra || 0,
//       capital_gain: stock.capital_gain || 0,
//       percent_return: stock.percent_return || 0,
//     }));
//     setOriginalHoldings(original);
//     setUpdatedHoldings([...original]);
//     recalculateMetrics([...original]);
//   };

//   const recalculateMetrics = (holdings) => {
//     const totalValue = holdings.reduce((acc, stock) => acc + (stock.value || 0), 0);
//     let weightedEPS = 0, weightedPE = 0, weightedBV = 0;
//     holdings.forEach(stock => {
//       const value = stock.value || 0;
//       const weight = totalValue > 0 ? value / totalValue : 0;
//       weightedEPS += (stock.eps || 0) * weight;
//       weightedPE += (stock.pe || 0) * weight;
//       weightedBV += (stock.bv || 0) * weight;
//     });

//     const totalGain = holdings.reduce((acc, stock) => acc + (stock.capital_gain || 0), 0);
//     const totalInvested = holdings.reduce(
//       (acc, stock) => acc + ((stock.value || 0) - (stock.capital_gain || 0)),
//       0
//     );
//     const totalPct = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0;

//     setMetrics({
//       eps: weightedEPS.toFixed(2),
//       pe: weightedPE.toFixed(2),
//       bv: weightedBV.toFixed(2),
//       gain: totalGain.toFixed(2),
//       return: totalPct.toFixed(2)
//     });
//   };

//   const handleReplacement = (index, value) => {
//     const holding = updatedHoldings[index];
//     let newHoldings = [...updatedHoldings];
//     if (!value) return;

//     const data = mode === 'current' ? portfolioData : actualDateData;
//     if (value === holding.base_symbol) {
//       const original = originalHoldings.find(s => s.symbol === holding.base_symbol);
//       newHoldings[index] = { ...original };
//     } else {
//       const replacements = data.replacement_options[holding.base_symbol] || [];
//       const candidate = replacements.find(r => r.symbol === value);
//       if (!candidate) return;

//       if (mode === 'current') {
//         const newQty = Math.floor(holding.base_value / candidate.price);
//         const newExtra = holding.base_value - (newQty * candidate.price);
//         const marketValue = newQty * candidate.price;
//         const capitalGain = marketValue - holding.base_value;
//         const percentReturn = holding.base_value > 0 ? (capitalGain / holding.base_value * 100) : 0;

//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: newQty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: newExtra,
//           capital_gain: capitalGain,
//           percent_return: percentReturn
//         };
//       } else {
//         newHoldings[index] = {
//           ...holding,
//           symbol: candidate.symbol,
//           qty: candidate.new_qty,
//           value: holding.base_value,
//           eps: candidate.eps,
//           pe: candidate.pe,
//           bv: candidate.bv,
//           extra: candidate.extra,
//           capital_gain: candidate.capital_gain,
//           percent_return: candidate.percent_return,
//           current_price: candidate.current_price
//         };
//       }
//     }
//     setUpdatedHoldings(newHoldings);
//     recalculateMetrics(newHoldings);
//   };

//   const resetAll = () => {
//     setUpdatedHoldings([...originalHoldings]);
//     recalculateMetrics([...originalHoldings]);
//   };

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   const handlePortfolioChange = (e) => {
//     setUploadId(e.target.value);
//     setOpenDropdown(null); // Close any open replacement dropdown
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest('.replacement-dropdown') && !e.target.closest('.symbol-text') && !e.target.closest('#portfolio-select')) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   if (loading) {
//     return (
//       <div className="relative min-h-screen bg-white  dark:bg-slate-800 transition-colors duration-300">
//         <Navbar className="fixed top-0 left-0 right-0 z-50" />
//         <div className="flex flex-col items-center justify-center min-h-screen">
//           <div className="relative z-10 flex flex-col items-center">
//             <HashLoader color="#0369a1" size={60} />
//             <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//               Your portfolio is getting ready...
//             </p>
//             <p className="mt-4 text-sky-700 dark:text-white font-semibold text-sm animate-pulse">
//               Sit tight! We are analyzing your stocks and preparing insights.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (errorMsg) {
//     const isLoginError = errorMsg.includes('log in');
//     const isNoFilesError = errorMsg.includes('No uploaded files');
//     const isFetchError = errorMsg.includes('Failed to fetch');

//     const getFriendlyErrorMessage = (errorMsg) => {
//       switch (errorMsg) {
//         case 'Failed to fetch portfolio data.':
//           return 'We couldn’t load your portfolio. Please try again or contact support.';
//         case 'Please log in to continue.':
//           return 'You need to log in to access your portfolio.';
//         case 'No uploaded files found. Please upload a file before continuing.':
//           return 'No portfolios found. Upload a file to get started.';
//         default:
//           return errorMsg;
//       }
//     };

//     const handleRetry = () => {
//       if (isFetchError) {
//         window.location.reload();
//       }
//     };

//     return (
//       <div className="relative min-h-screen bg-white dark:bg-slate-800 transition-colors duration-300">
//         <Navbar className="fixed top-0 left-0 right-0 z-50" />
//         <div className="flex items-center justify-center min-h-screen">
//           <ErrorCard
//             message={getFriendlyErrorMessage(errorMsg)}
//             actionText={

//               // isNoFilesError ? 'Upload a File' :
//                 isFetchError ? 'Try Again' : null
//             }
//             // actionUrl={isNoFilesError ? '/portDash' : null}
//             onActionClick={handleRetry}
//           />
//         </div>
//       </div>
//     );
//   }

//   const dataSource = mode === 'current' ? portfolioData : actualDateData;

//   return (
//     <div className="min-h-screen bg-white p-6 dark:bg-slate-800 dark:text-white">
//       <Navbar className="fixed top-0 left-0 right-0 z-50" />
//       <div className="max-w-7xl mx-auto mt-16 p-6">
//         <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
//           Reimagine Your Portfolio: <span className="text-blue-500">What’s Your Best Mix?</span>
//         </h1>

//         {/* Portfolio Selection Dropdown */}
//         <div className="flex justify-center mb-6">
//           <select
//             id="portfolio-select"
//             className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={uploadId || ''}
//             onChange={handlePortfolioChange}
//           >
//             <option value="" disabled>Select Portfolio</option>
//             {portfolios.map((portfolio) => (
//               <option key={portfolio.uploadId} value={portfolio.uploadId}>
//                 {portfolio.PortfolioName} ({portfolio.platform}){/* Adjust based on API response */}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-center mb-6">
//           <div className="flex space-x-3 bg-gray-100 p-1 rounded-full shadow-inner dark:bg-slate-800 dark:text-white">
//             <button
//               className={`px-6 py-2 rounded-full transition text-sm font-semibold ${mode === 'current'
//                   ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                   : 'text-gray-700 hover:bg-gray-200 dark:text-white'
//                 }`}
//               onClick={() => setMode('current')}
//             >
//               Current Price Mode
//             </button>
//             <button
//               className={`px-6 py-2 rounded-full transition text-sm font-semibold ${mode === 'actual'
//                   ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
//                   : 'text-gray-700 hover:bg-gray-200 dark:text-white'
//                 }`}
//               onClick={() => setMode('actual')}
//             >
//               Acquisition Price Mode
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-sans">
//           <div className="flex gap-4 font-sans">
//             <MetricCard label="EPS" value={metrics.eps} />
//             <MetricCard label="PE" value={metrics.pe} />
//             <MetricCard label="BV" value={metrics.bv} />
//           </div>
//           <div className="flex gap-4 font-sans">
//             <MetricCard
//               label="Unrealized PNL"
//               value={`₹${metrics.gain}`}
//               textColorClass={getTextColorClass(metrics.gain)}
//             />
//             <MetricCard
//               label="% Return"
//               value={`${metrics.return}%`}
//               textColorClass={getTextColorClass(metrics.return)}
//             />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto dark:bg-slate-800 dark:text-white">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:bg-slate-800 dark:text-white">Holdings</h2>
//           <table className="w-full table-auto text-sm dark:bg-slate-800 dark:text-white">
//             <thead className="bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-white">
//               <tr>
//                 <th className="px-4 py-2 text-left">Symbol</th>
//                 <th className="px-4 py-2 text-left">Quantity</th>
//                 <th className="px-4 py-2 text-left">Market Value</th>
//                 <th className="px-4 py-2 text-left">Replacement Value</th>
//                 <th className="px-4 py-2 text-left">Extra</th>
//                 <th className="px-4 py-2 text-left">PNL</th>
//                 <th className="px-4 py-2 text-left">% Return</th>
//               </tr>
//             </thead>
//             <tbody>
//               {updatedHoldings.map((stock, index) => {
//                 const replacements = dataSource?.replacement_options[stock.base_symbol] || [];
//                 return (
//                   <tr key={index} className="border-t hover:bg-gray-50 dark:bg-slate-800 dark:text-white font-sans">
//                     <td className="px-4 py-2 relative dark:bg-slate-800 dark:text-white">
//                       <span className="symbol-text cursor-pointer text-blue-600" onClick={() => toggleDropdown(index)}>
//                         {stock.symbol} ⏷
//                       </span>
//                       {openDropdown === index && (
//                         <select
//                           className="replacement-dropdown absolute z-10 bg-white border rounded shadow top-0 ml-2 w-20 dark:bg-slate-800 dark:text-white"
//                           onChange={(e) => handleReplacement(index, e.target.value)}
//                         >
//                           <option value="">-- Select --</option>
//                           <option value={stock.base_symbol}>Reset ({stock.base_symbol})</option>
//                           {replacements.map(rep => (
//                             <option key={rep.symbol} value={rep.symbol}>{rep.symbol}</option>
//                           ))}
//                         </select>
//                       )}
//                     </td>
//                     <td className="px-4 py-2 font-sans">{stock.qty}</td>
//                     <td className="px-4 py-2 font-sans">
//                       ₹{formatNumberWithCommas(stock.base_value)} ({stock.base_symbol})
//                     </td>
//                     <td className="px-4 py-2 font-sans">
//                       ₹{formatNumberWithCommas(
//                         mode === 'current'
//                           ? stock.value - (stock.extra || 0)
//                           : stock.qty * (stock.current_price || 0)
//                       )} ({stock.symbol})
//                     </td>
//                     <td className={`px-4 py-2 font-sans text-black dark:text-white`}>
//                       ₹{formatNumberWithCommas(stock.extra || 0)}
//                     </td>
//                     <td className={`px-4 font-sans py-2 ${getTextColorClass(stock.capital_gain)}`}>
//                       ₹{formatNumberWithCommas(stock.capital_gain || 0)}
//                     </td>
//                     <td className={`px-4 font-sans py-2 ${getTextColorClass(stock.percent_return)}`}>
//                       {formatNumberWithCommas(stock.percent_return || 0)}%
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//           <div className="text-center">
//             <button
//               className="mt-6 inline-flex items-center gap-2 px-6 py-2 text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
//               onClick={resetAll}
//             >
//               <RiResetLeftFill className="text-lg" />
//               <span>Reset All to Original</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MetricCard = ({ label, value, textColorClass = "" }) => {
//   const formattedValue = typeof value === 'string' && value.startsWith('₹')
//     ? `₹${formatNumberWithCommas(parseFloat(value.replace('₹', '')))}`
//     : typeof value === 'string' && value.endsWith('%')
//       ? `${formatNumberWithCommas(parseFloat(value.replace('%', '')))}%`
//       : formatNumberWithCommas(parseFloat(value));

//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 w-full dark:bg-slate-800">
//       <h4 className="text-gray-600 text-sm dark:text-gray-300">{label}</h4>
//       <p className={`text-2xl font-bold ${textColorClass}`}>
//         {formattedValue}
//       </p>
//     </div>
//   );
// };

// export default PortfolioReplacement;



import { useState, useEffect } from 'react';
import axios from 'axios';
import { RiErrorWarningLine, RiResetLeftFill } from 'react-icons/ri';
import { HashLoader } from 'react-spinners';
import Navbar from '../Navbar';
import { Helmet } from 'react-helmet-async';

const formatNumberWithCommas = (number) => {
  return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const PortfolioReplacement = () => {
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const [uploadId, setUploadId] = useState(null);
  const [portfolios, setPortfolios] = useState([]); // New state for portfolio list
  const [mode, setMode] = useState('current');
  const [originalHoldings, setOriginalHoldings] = useState([]);
  const [updatedHoldings, setUpdatedHoldings] = useState([]);
  const [metrics, setMetrics] = useState({ eps: 0, pe: 0, bv: 0, gain: 0, return: 0 });
  const [portfolioData, setPortfolioData] = useState(null);
  const [actualDateData, setActualDateData] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const getTextColorClass = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return '';
  };

  // Fetch saved portfolios
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.get(`${API_BASE}/file/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.length) {
          setPortfolios(data); // Store all portfolios
          setUploadId(data[0].uploadId); // Set default to first portfolio
        } else {
          setErrorMsg('No uploaded files found. Please upload a file before continuing.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Please log in to continue.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch portfolio data when uploadId changes
  useEffect(() => {
    if (!uploadId) return;
    (async () => {
      setLoading(true);
      try {
        const [portfolioRes, actualDateRes] = await Promise.all([
          axios.post(`${API_BASE}/file/portfolio_replacements`, null, { params: { uploadId } }),
          axios.post(`${API_BASE}/file/actual_date_replacements`, null, { params: { uploadId } })
        ]);
        setPortfolioData(portfolioRes.data);
        setActualDateData(actualDateRes.data);
        setErrorMsg('');
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to fetch portfolio data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [uploadId]);

  useEffect(() => {
    if (mode === 'current' && portfolioData) initializeVersion(portfolioData);
    else if (mode === 'actual' && actualDateData) initializeVersion(actualDateData);
  }, [mode, portfolioData, actualDateData]);

  const initializeVersion = (data) => {
    const original = data.current_holdings.map(stock => ({
      ...stock,
      base_symbol: stock.symbol,
      base_value: stock.value,
      current_price: stock.current_price || 0,
      extra: stock.extra || 0,
      capital_gain: stock.capital_gain || 0,
      percent_return: stock.percent_return || 0,
    }));
    setOriginalHoldings(original);
    setUpdatedHoldings([...original]);
    recalculateMetrics([...original]);
  };

  const recalculateMetrics = (holdings) => {
    const totalValue = holdings.reduce((acc, stock) => acc + (stock.value || 0), 0);
    let weightedEPS = 0, weightedPE = 0, weightedBV = 0;
    holdings.forEach(stock => {
      const value = stock.value || 0;
      const weight = totalValue > 0 ? value / totalValue : 0;
      weightedEPS += (stock.eps || 0) * weight;
      weightedPE += (stock.pe || 0) * weight;
      weightedBV += (stock.bv || 0) * weight;
    });

    const totalGain = holdings.reduce((acc, stock) => acc + (stock.capital_gain || 0), 0);
    const totalInvested = holdings.reduce(
      (acc, stock) => acc + ((stock.value || 0) - (stock.capital_gain || 0)),
      0
    );
    const totalPct = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0;

    setMetrics({
      eps: weightedEPS.toFixed(2),
      pe: weightedPE.toFixed(2),
      bv: weightedBV.toFixed(2),
      gain: totalGain.toFixed(2),
      return: totalPct.toFixed(2)
    });
  };

  const handleReplacement = (index, value) => {
    const holding = updatedHoldings[index];
    let newHoldings = [...updatedHoldings];
    if (!value) return;

    const data = mode === 'current' ? portfolioData : actualDateData;
    if (value === holding.base_symbol) {
      const original = originalHoldings.find(s => s.symbol === holding.base_symbol);
      newHoldings[index] = { ...original };
    } else {
      const replacements = data.replacement_options[holding.base_symbol] || [];
      const candidate = replacements.find(r => r.symbol === value);
      if (!candidate) return;

      if (mode === 'current') {
        const newQty = Math.floor(holding.base_value / candidate.price);
        const newExtra = holding.base_value - (newQty * candidate.price);
        const marketValue = newQty * candidate.price;
        const capitalGain = marketValue - holding.base_value;
        const percentReturn = holding.base_value > 0 ? (capitalGain / holding.base_value * 100) : 0;

        newHoldings[index] = {
          ...holding,
          symbol: candidate.symbol,
          qty: newQty,
          value: holding.base_value,
          eps: candidate.eps,
          pe: candidate.pe,
          bv: candidate.bv,
          extra: newExtra,
          capital_gain: capitalGain,
          percent_return: percentReturn
        };
      } else {
        newHoldings[index] = {
          ...holding,
          symbol: candidate.symbol,
          qty: candidate.new_qty,
          value: holding.base_value,
          eps: candidate.eps,
          pe: candidate.pe,
          bv: candidate.bv,
          extra: candidate.extra,
          capital_gain: candidate.capital_gain,
          percent_return: candidate.percent_return,
          current_price: candidate.current_price
        };
      }
    }
    setUpdatedHoldings(newHoldings);
    recalculateMetrics(newHoldings);
  };

  const resetAll = () => {
    setUpdatedHoldings([...originalHoldings]);
    recalculateMetrics([...originalHoldings]);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handlePortfolioChange = (e) => {
    setUploadId(e.target.value);
    setOpenDropdown(null); // Close any open replacement dropdown
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.replacement-dropdown') && !e.target.closest('.symbol-text') && !e.target.closest('#portfolio-select')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          Your portfolio is getting ready...
        </p>
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-sm animate-pulse">
          Sit tight! We are analyzing your stocks and preparing insights.
        </p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg flex items-center gap-2">
        <RiErrorWarningLine className="text-red-500 text-lg" />
        <p className="text-red-600 dark:text-red-300 text-sm">{errorMsg}</p>
      </div>
    );
  }

  const dataSource = mode === 'current' ? portfolioData : actualDateData;

  return (
    <div className="min-h-screen bg-white p-6 dark:bg-slate-800 dark:text-white">
      {/* ✅ Canonical tag for SEO */}
      <Helmet>
        <title>Portfolio Swap | CMDA Hub – Optimize & Compare Your Investments</title>
        <meta
          name="description"
          content="Use CMDA Hub’s Portfolio Swap tool to compare, rebalance, and optimize your investments instantly. Analyze portfolio performance and discover smarter allocation strategies."
        />
        <meta
          name="keywords"
          content="portfolio swap, CMDA Hub, investment comparison, portfolio optimization, equity portfolio, financial analytics, Accord Fintech"
        />
        <meta property="og:title" content="Portfolio Swap | CMDA Hub" />
        <meta
          property="og:description"
          content="Easily compare and optimize your investments with CMDA Hub’s Portfolio Swap tool — empowering data-driven decisions and smarter portfolio strategies."
        />
        <meta property="og:url" content="https://cmdahub.com/portfolio/swap" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CMDA Hub" />
        <link rel="canonical" href="https://cmdahub.com/portfolio/swap" />
      </Helmet>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-16 p-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Reimagine Your Portfolio: <span className="text-blue-500">What’s Your Best Mix?</span>
        </h1>

        {/* Portfolio Selection Dropdown */}
        <div className="flex justify-center mb-6">
          <select
            id="portfolio-select"
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-white border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={uploadId || ''}
            onChange={handlePortfolioChange}
          >
            <option value="" disabled>Select Portfolio</option>
            {portfolios.map((portfolio) => (
              <option key={portfolio.uploadId} value={portfolio.uploadId}>
                {portfolio.PortfolioName} ({portfolio.platform}){/* Adjust based on API response */}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex space-x-3 bg-gray-100 p-1 rounded-full shadow-inner dark:bg-slate-800 dark:text-white">
            <button
              className={`px-6 py-2 rounded-full transition text-sm font-semibold ${mode === 'current'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-white'
                }`}
              onClick={() => setMode('current')}
            >
              Current Price Mode
            </button>
            <button
              className={`px-6 py-2 rounded-full transition text-sm font-semibold ${mode === 'actual'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-white'
                }`}
              onClick={() => setMode('actual')}
            >
              Acquisition Price Mode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-sans">
          <div className="flex gap-4 font-sans">
            <MetricCard label="EPS" value={metrics.eps} />
            <MetricCard label="PE" value={metrics.pe} />
            <MetricCard label="BV" value={metrics.bv} />
          </div>
          <div className="flex gap-4 font-sans">
            <MetricCard
              label="Unrealized PNL"
              value={`₹${metrics.gain}`}
              textColorClass={getTextColorClass(metrics.gain)}
            />
            <MetricCard
              label="% Return"
              value={`${metrics.return}%`}
              textColorClass={getTextColorClass(metrics.return)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto dark:bg-slate-800 dark:text-white">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:bg-slate-800 dark:text-white">Holdings</h2>
          <table className="w-full table-auto text-sm dark:bg-slate-800 dark:text-white">
            <thead className="bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-white">
              <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Market Value</th>
                <th className="px-4 py-2 text-left">Replacement Value</th>
                <th className="px-4 py-2 text-left">Extra</th>
                <th className="px-4 py-2 text-left">PNL</th>
                <th className="px-4 py-2 text-left">% Return</th>
              </tr>
            </thead>
            <tbody>
              {updatedHoldings.map((stock, index) => {
                const replacements = dataSource?.replacement_options[stock.base_symbol] || [];
                return (
                  <tr key={index} className="border-t hover:bg-gray-50 dark:bg-slate-800 dark:text-white font-sans">
                    <td className="px-4 py-2 relative dark:bg-slate-800 dark:text-white">
                      <span className="symbol-text cursor-pointer text-blue-600" onClick={() => toggleDropdown(index)}>
                        {stock.symbol} ⏷
                      </span>
                      {openDropdown === index && (
                        <select
                          className="replacement-dropdown absolute z-10 bg-white border rounded shadow top-0 ml-2 w-20 dark:bg-slate-800 dark:text-white"
                          onChange={(e) => handleReplacement(index, e.target.value)}
                        >
                          <option value="">-- Select --</option>
                          <option value={stock.base_symbol}>Reset ({stock.base_symbol})</option>
                          {replacements.map(rep => (
                            <option key={rep.symbol} value={rep.symbol}>{rep.symbol}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-2 font-sans">{stock.qty}</td>
                    <td className="px-4 py-2 font-sans">
                      ₹{formatNumberWithCommas(stock.base_value)} ({stock.base_symbol})
                    </td>
                    <td className="px-4 py-2 font-sans">
                      ₹{formatNumberWithCommas(
                        mode === 'current'
                          ? stock.value - (stock.extra || 0)
                          : stock.qty * (stock.current_price || 0)
                      )} ({stock.symbol})
                    </td>
                    <td className={`px-4 py-2 font-sans text-black dark:text-white`}>
                      ₹{formatNumberWithCommas(stock.extra || 0)}
                    </td>
                    <td className={`px-4 font-sans py-2 ${getTextColorClass(stock.capital_gain)}`}>
                      ₹{formatNumberWithCommas(stock.capital_gain || 0)}
                    </td>
                    <td className={`px-4 font-sans py-2 ${getTextColorClass(stock.percent_return)}`}>
                      {formatNumberWithCommas(stock.percent_return || 0)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-center">
            <button
              className="mt-6 inline-flex items-center gap-2 px-6 py-2 text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
              onClick={resetAll}
            >
              <RiResetLeftFill className="text-lg" />
              <span>Reset All to Original</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, textColorClass = "" }) => {
  const formattedValue = typeof value === 'string' && value.startsWith('₹')
    ? `₹${formatNumberWithCommas(parseFloat(value.replace('₹', '')))}`
    : typeof value === 'string' && value.endsWith('%')
      ? `${formatNumberWithCommas(parseFloat(value.replace('%', '')))}%`
      : formatNumberWithCommas(parseFloat(value));

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full dark:bg-slate-800">
      <h4 className="text-gray-600 text-sm dark:text-gray-300">{label}</h4>
      <p className={`text-2xl font-bold ${textColorClass}`}>
        {formattedValue}
      </p>
    </div>
  );
};

export default PortfolioReplacement;