// import React, { useState, useMemo } from "react";
// import TransactionCard from "./TransactionCard";
// import MonthlyPnlGrid from "./MonthlyPnlGrid";
// import { AlertTriangle, Calendar } from "lucide-react";

// const TransactionSheet = ({ ledgerData }) => {
//   const currentYear = new Date().getFullYear();
//   const [selectedYear, setSelectedYear] = useState(currentYear);

//   // Generate years from current back to 2020
//   const yearOptions = Array.from(
//     { length: currentYear - 2019 },
//     (_, i) => currentYear - i
//   );

//   const closedPositions = ledgerData?.closed_positions || [];

//   // Use year-based logic instead of just "last 12 months"
//   const monthlyPnl = useMemo(
//     () => buildMonthlyPnl(closedPositions, selectedYear),
//     [closedPositions, selectedYear]
//   );

//   if (
//     !ledgerData ||
//     !ledgerData.current_holdings ||
//     !ledgerData.closed_positions
//   ) {
//     return (
//       <div className="p-10 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
//         <p className="text-xl font-bold text-gray-400">No Ledger Data Found</p>
//         <p className="text-gray-500 mt-2">
//           Please upload a valid transaction file.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-3 lg:px-6 py-4">
//       {/* --- ZERODHA WARNING BOX (Preserved) --- */}
//       <div className="bg-amber-50 border-l-8 border-amber-500 rounded-r-xl p-4 shadow-sm flex gap-4 items-start mb-6">
//         <div className="bg-amber-100 p-2.5 rounded-full shrink-0 text-amber-600">
//           <AlertTriangle size={24} strokeWidth={2.5} />
//         </div>
//         <div>
//           <h3 className="text-base font-bold text-amber-900 mb-1">
//             Analysis Limitation: Zerodha & Broker Data
//           </h3>
//           <p className="text-sm text-amber-800 font-medium leading-relaxed">
//             Most brokers (like Zerodha) provide "Net Prices" in their reports,
//             meaning
//             <strong>
//               {" "}
//               Brokerage and Taxes are hidden inside the trade price
//             </strong>
//             .
//             <br />
//             Because of this, the <em>Brokerage</em> and <em>Taxes</em> fields
//             below are estimates or blank.
//             <span className="underline decoration-amber-500/50 decoration-2 underline-offset-2">
//               {" "}
//               Do not use this for official tax filing.
//             </span>
//           </p>
//         </div>
//       </div>

//       {/* Main 2-Column Layout */}
//       <div className="grid grid-cols-12 gap-6">
//         {/* LEFT COLUMN: Transaction Cards */}
//         <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8">
//           {/* --- Section 1: Current Holdings (Blue Theme) --- */}
//           <div className="space-y-3">
//             <div className="flex items-center gap-3 border-b-2 border-blue-100 pb-2">
//               <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-xs tracking-wide uppercase">
//                 Live
//               </div>
//               <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
//                 Current Holdings
//               </h2>
//             </div>

//             {ledgerData.current_holdings.length === 0 ? (
//               <p className="text-gray-400 italic p-3 text-center bg-gray-50 rounded-xl text-sm">
//                 No active positions.
//               </p>
//             ) : (
//               ledgerData.current_holdings.map((item, index) => (
//                 <TransactionCard key={index} data={item} isParent={false} />
//               ))
//             )}
//           </div>

//           {/* --- Section 2: Closed Positions (Amber Theme) --- */}
//           <div className="space-y-3">
//             <div className="flex items-center gap-3 border-b-2 border-amber-200 pb-2">
//               <div className="bg-amber-400 text-white px-3 py-1 rounded-lg font-bold text-xs tracking-wide uppercase">
//                 History
//               </div>
//               <h2 className="text-xl font-extrabold text-amber-900 tracking-tight">
//                 Closed Positions
//               </h2>
//             </div>

//             {ledgerData.closed_positions.length === 0 ? (
//               <p className="text-amber-700/60 italic p-3 text-center bg-amber-50 rounded-xl border border-amber-100 text-sm">
//                 No closed trades yet.
//               </p>
//             ) : (
//               ledgerData.closed_positions.map((item, index) => (
//                 <TransactionCard key={index} data={item} isParent={true} />
//               ))
//             )}
//           </div>

//           {/* --- Section 3: Incomplete / Data Gap Positions (Red Theme) --- */}
//           {ledgerData.incomplete_positions &&
//             ledgerData.incomplete_positions.length > 0 && (
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3 border-b-2 border-red-200 pb-2">
//                   <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-xs tracking-wide uppercase">
//                     Action Required
//                   </div>
//                   <h2 className="text-xl font-extrabold text-red-900 tracking-tight">
//                     Incomplete Records
//                   </h2>
//                 </div>

//                 <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
//                   <p className="text-sm text-red-800 font-medium leading-relaxed">
//                     The following sell transactions could not be matched with a
//                     corresponding buy record.
//                     <br />
//                     <span className="font-bold">
//                       Why is this happening?
//                     </span>{" "}
//                     This usually occurs when the uploaded file only covers a
//                     recent period (e.g., this year) but you sold shares bought
//                     in previous years.
//                     <br />
//                     <span className="font-bold">Action Required:</span> Please
//                     download and upload a{" "}
//                     <strong>"Global" or "All Time"</strong> transaction
//                     statement from your broker to see accurate P&L for these
//                     stocks.
//                   </p>
//                 </div>

//                 {ledgerData.incomplete_positions.map((item, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-xl border border-gray-200 border-l-8 border-l-red-400 shadow-sm p-4 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//                       {/* Header Info */}
//                       <div className="flex items-center gap-3">
//                         <h3 className="text-lg font-black text-gray-800 tracking-tight">
//                           {item.Symbol}
//                         </h3>
//                         <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700">
//                           Incomplete
//                         </span>
//                         <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                           {item.Qty} Qty
//                         </span>
//                       </div>

//                       {/* Date & Value */}
//                       <div className="flex items-center gap-6">
//                         <div className="text-right">
//                           <p className="text-xs font-bold text-gray-400 uppercase">
//                             Date
//                           </p>
//                           <p className="font-bold text-gray-700">
//                             {item.Trade_Date
//                               ? new Date(item.Trade_Date).toLocaleDateString(
//                                   "en-GB"
//                                 )
//                               : "N/A"}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-xs font-bold text-gray-400 uppercase">
//                             Amount
//                           </p>
//                           <p className="font-bold text-gray-700">
//                             ₹{item.Amount}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Warning Message */}
//                     <div className="mt-3 pt-3 border-t border-red-50">
//                       <p className="text-xs font-bold text-red-400 uppercase mb-1">
//                         Issue
//                       </p>
//                       <p className="text-sm font-medium text-red-600 flex items-center gap-2">
//                         <AlertTriangle size={16} />
//                         {item.Remarks || "Missing Buy History"}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//         </div>

//         {/* RIGHT COLUMN: Monthly PNL Grid (Sticky) */}
//         <div className="col-span-12 lg:col-span-4 xl:col-span-3">
//           <div className="sticky top-4 space-y-4">
//             {/* Year Selector */}
//             <div className="relative">
//               <select
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                 className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-sm font-semibold text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {yearOptions.map((year) => (
//                   <option key={year} value={year}>
//                     {year} PNL
//                   </option>
//                 ))}
//               </select>
//               <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//             </div>
//             <MonthlyPnlGrid data={monthlyPnl} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper: Aggregate PnL by Specific Year (Jan-Dec)
// function buildMonthlyPnl(closedPositions, year) {
//   // Create 12 months for the selected year
//   const months = Array.from({ length: 12 }, (_, i) => {
//     const d = new Date(year, i, 1);
//     return {
//       key: `${year}-${String(i + 1).padStart(2, "0")}`,
//       label: d.toLocaleString("default", { month: "short" }),
//       year: year,
//       value: 0,
//     };
//   });

//   const indexByKey = Object.fromEntries(months.map((m, idx) => [m.key, idx]));

//   closedPositions.forEach((cp) => {
//     // Parse DD-MM-YYYY format from backend
//     const dateStr = cp.sell_date || cp.date || "";
//     const [dd, mm, yyyy] = dateStr.split("-");

//     if (!dd || !mm || !yyyy) return;
//     if (parseInt(yyyy) !== year) return; // Filter by selected year

//     const key = `${yyyy}-${mm}`;
//     const idx = indexByKey[key];

//     if (idx !== undefined) {
//       const pnl = Number(cp.realized_pnl || 0);
//       months[idx].value += isNaN(pnl) ? 0 : pnl;
//     }
//   });

//   return months;
// }

// export default TransactionSheet;


import React, { useState, useMemo } from "react";
import TransactionCard from "./TransactionCard";
import MonthlyPnlGrid from "./MonthlyPnlGrid";
import SectorAllocationChart from "./SectorAllocationChart";
import { AlertTriangle, Calendar } from "lucide-react";

const TransactionSheet = ({ ledgerData, isExporting = false }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generate years from current back to 2020
  const yearOptions = Array.from(
    { length: currentYear - 2019 },
    (_, i) => currentYear - i
  );

  const closedPositions = ledgerData?.closed_positions || [];

  // Use year-based logic instead of just "last 12 months"
  const monthlyPnl = useMemo(
    () => buildMonthlyPnl(closedPositions, selectedYear),
    [closedPositions, selectedYear]
  );

  if (
    !ledgerData ||
    !ledgerData.current_holdings ||
    !ledgerData.closed_positions
  ) {
    return (
      <div className="p-10 text-center bg-gray-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-300 dark:border-slate-700">
        <p className="text-xl font-bold text-gray-400 dark:text-gray-500">No Ledger Data Found</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Please upload a valid transaction file.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-3 lg:px-6 py-4">
      {/* --- ZERODHA WARNING BOX (Preserved) --- */}
      {!isExporting && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-8 border-amber-500 rounded-r-xl p-4 shadow-sm flex gap-4 items-start mb-6">
          <div className="bg-amber-100 dark:bg-amber-900/50 p-2.5 rounded-full shrink-0 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-900 dark:text-amber-200 mb-1">
              Analysis Limitation: Zerodha & Broker Data
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
              Most brokers (like Zerodha) provide "Net Prices" in their reports,
              meaning
              <strong>
                {" "}
                Brokerage and Taxes are hidden inside the trade price
              </strong>
              .
              <br />
              Because of this, the <em>Brokerage</em> and <em>Taxes</em> fields
              below are estimates or blank.
              <span className="underline decoration-amber-500/50 decoration-2 underline-offset-2">
                {" "}
                Do not use this for official tax filing.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className={`grid grid-cols-12 gap-6 ${isExporting ? 'block' : ''}`}>
        {/* LEFT COLUMN: Transaction Cards */}
        <div className={`${isExporting ? 'col-span-12' : 'col-span-12 lg:col-span-8 xl:col-span-9'} space-y-8`}>
          {/* --- Section 1: Current Holdings (Blue Theme) --- */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b-2 border-blue-100 dark:border-blue-900/30 pb-2">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-xs tracking-wide uppercase">
                Live
              </div>
              <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
                Current Holdings
              </h2>
            </div>

            {ledgerData.current_holdings.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 italic p-3 text-center bg-gray-50 dark:bg-slate-800/50 rounded-xl text-sm">
                No active positions.
              </p>
            ) : (
              ledgerData.current_holdings.map((item, index) => (
                <TransactionCard key={index} data={item} isParent={false} />
              ))
            )}
          </div>

          {/* --- Section 2: Closed Positions (Amber Theme) --- */}
          {!isExporting && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 border-b-2 border-amber-200 dark:border-amber-900/30 pb-2">
                <div className="bg-amber-400 text-white px-3 py-1 rounded-lg font-bold text-xs tracking-wide uppercase">
                  History
                </div>
                <h2 className="text-xl font-extrabold text-amber-900 dark:text-amber-200 tracking-tight">
                  Closed Positions
                </h2>
              </div>

              {ledgerData.closed_positions.length === 0 ? (
                <p className="text-amber-700/60 dark:text-amber-500/60 italic p-3 text-center bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 text-sm">
                  No closed trades yet.
                </p>
              ) : (
                ledgerData.closed_positions.map((item, index) => (
                  <TransactionCard key={index} data={item} isParent={true} />
                ))
              )}
            </div>
          )}

          {/* --- Section 3: Incomplete / Data Gap Positions (Red Theme) --- */}
          {!isExporting && ledgerData.incomplete_positions &&
            ledgerData.incomplete_positions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 border-b-2 border-red-200 dark:border-red-900/30 pb-2">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-xs tracking-wide uppercase">
                    Action Required
                  </div>
                  <h2 className="text-xl font-extrabold text-red-900 dark:text-red-200 tracking-tight">
                    Incomplete Records
                  </h2>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 mb-4">
                  <p className="text-sm text-red-800 dark:text-red-400 font-medium leading-relaxed">
                    The following sell transactions could not be matched with a
                    corresponding buy record.
                    <br />
                    <span className="font-bold">
                      Why is this happening?
                    </span>{" "}
                    This usually occurs when the uploaded file only covers a
                    recent period (e.g., this year) but you sold shares bought
                    in previous years.
                    <br />
                    <span className="font-bold">Action Required:</span> Please
                    download and upload a{" "}
                    <strong>"Global" or "All Time"</strong> transaction
                    statement from your broker to see accurate P&L for these
                    stocks.
                  </p>
                </div>

                {ledgerData.incomplete_positions.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 border-l-8 border-l-red-400 shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      {/* Header Info */}
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 tracking-tight">
                          {item.Symbol}
                        </h3>
                        <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400">
                          Incomplete
                        </span>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                          {item.Qty} Qty
                        </span>
                      </div>

                      {/* Date & Value */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                            Date
                          </p>
                          <p className="font-bold text-gray-700 dark:text-gray-300">
                            {item.Trade_Date
                              ? new Date(item.Trade_Date).toLocaleDateString(
                                "en-GB"
                              )
                              : "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                            Amount
                          </p>
                          <p className="font-bold text-gray-700 dark:text-gray-300">
                            ₹{item.Amount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Warning Message */}
                    <div className="mt-3 pt-3 border-t border-red-50 dark:border-red-900/30">
                      <p className="text-xs font-bold text-red-400 uppercase mb-1">
                        Issue
                      </p>
                      <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        {item.Remarks || "Missing Buy History"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* RIGHT COLUMN / PDF ANALYSIS SECTIONS */}
        <div className={isExporting ? 'col-span-12 space-y-16 mt-12' : 'col-span-12 lg:col-span-4 xl:col-span-3'}>
          <div className={isExporting ? 'flex flex-col gap-20' : 'sticky top-4 space-y-4'}>
            {!isExporting && (
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full appearance-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg py-2 pl-3 pr-8 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year} PNL
                    </option>
                  ))}
                </select>
                <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            )}

            <div className={isExporting ? 'bg-white p-10 rounded-3xl border border-gray-100 shadow-xl pdf-section-container w-full overflow-visible' : ''}>
              {isExporting && (
                <div className="mb-8 border-b-4 border-emerald-500 pb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Monthly P&L Analytics Overview</h3>
                  <p className="text-gray-500 text-sm mt-1 italic">Consolidated profit and loss distribution for the year {selectedYear}</p>
                </div>
              )}
              <MonthlyPnlGrid data={monthlyPnl} isExporting={isExporting} />
            </div>

            <div className={isExporting ? 'bg-white p-10 rounded-3xl border border-gray-100 shadow-xl pdf-section-container w-full overflow-visible' : ''}>
              {isExporting && (
                <div className="mb-8 border-b-4 border-blue-500 pb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Portfolio Sector Distribution</h3>
                  <p className="text-gray-500 text-sm mt-1 italic">Diversification across industrial sectors based on current holdings</p>
                </div>
              )}
              <SectorAllocationChart holdings={ledgerData.current_holdings} isExporting={isExporting} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper: Aggregate PnL by Specific Year (Jan-Dec)
function buildMonthlyPnl(closedPositions, year) {
  // Create 12 months for the selected year
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(year, i, 1);
    return {
      key: `${year}-${String(i + 1).padStart(2, "0")}`,
      label: d.toLocaleString("default", { month: "short" }),
      year: year,
      value: 0,
    };
  });

  const indexByKey = Object.fromEntries(months.map((m, idx) => [m.key, idx]));

  closedPositions.forEach((cp) => {
    // Parse DD-MM-YYYY format from backend
    const dateStr = cp.sell_date || cp.date || "";
    const [dd, mm, yyyy] = dateStr.split("-");

    if (!dd || !mm || !yyyy) return;
    if (parseInt(yyyy) !== year) return; // Filter by selected year

    const key = `${yyyy}-${mm}`;
    const idx = indexByKey[key];

    if (idx !== undefined) {
      const pnl = Number(cp.realized_pnl || 0);
      months[idx].value += isNaN(pnl) ? 0 : pnl;
    }
  });

  return months;
}

export default TransactionSheet;
