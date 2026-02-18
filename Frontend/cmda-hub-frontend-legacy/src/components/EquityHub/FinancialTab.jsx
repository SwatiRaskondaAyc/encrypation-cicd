// import React, { useState } from "react";
// import FinanceOverview from "./FinanceOverview";
// import IncomeState from "./IncomeState";
// import BalanceSheet from "./BalanceSheet";
// import CashFlowState from "./CashFlowState";
// import FinancialRatios from "./FinancialRatios";

// const subTabs = [
//   { key: "overview", label: "Overview" },
//   { key: "income", label: "Income Statement" },
//   { key: "balance", label: "Balance Sheet" },
//   { key: "cashflow", label: "Cash Flow" },
//   { key: "ratios", label: "Financial Ratios" },
// ];

// const mainTabs = [
//   { key: "standalone", label: "Standalone" },
//   { key: "consolidated", label: "Consolidated" },
// ];

// const FinancialTabs = ({ symbol }) => {
//   const [mainTab, setMainTab] = useState("standalone");
//   const [activeSubTab, setActiveSubTab] = useState("overview");

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const renderTabContent = () => {
//     const commonProps = { symbol, API_BASE, mainTab };

//     switch (activeSubTab) {
//       case "overview":
//         return <FinanceOverview {...commonProps} />;
//       case "income":
//         return <IncomeState {...commonProps} />;
//       case "balance":
//         return <BalanceSheet {...commonProps} />;
//       case "cashflow":
//         return <CashFlowState {...commonProps} />;
//       case "ratios":
//         return <FinancialRatios {...commonProps} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Financial Data</h2>

//       {/* Main Tabs */}
//       <div style={styles.mainTabContainer}>
//         {mainTabs.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => {
//               setMainTab(tab.key);
//               setActiveSubTab("overview"); // Reset sub-tab when switching
//             }}
//             style={{
//               ...styles.mainTabButton,
//               ...(mainTab === tab.key ? styles.activeMainTab : {}),
//             }}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Sub Tabs */}
//       <div style={styles.tabContainer}>
//         {subTabs.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveSubTab(tab.key)}
//             style={{
//               ...styles.tabButton,
//               ...(activeSubTab === tab.key ? styles.activeTab : {}),
//             }}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Content */}
//       <div style={{ marginTop: "30px" }}>
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   mainTabContainer: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "20px",
//     marginBottom: "20px",
//   },
//   mainTabButton: {
//     padding: "10px 25px",
//     fontSize: "15px",
//     border: "1px solid #ccc",
//     backgroundColor: "#f8f8f8",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   activeMainTab: {
//     backgroundColor: "#007bff",
//     color: "#fff",
//     fontWeight: "bold",
//     borderColor: "#007bff",
//   },
//   tabContainer: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "10px",
//     borderBottom: "2px solid #ddd",
//     paddingBottom: "10px",
//   },
//   tabButton: {
//     padding: "8px 20px",
//     fontSize: "14px",
//     border: "none",
//     backgroundColor: "transparent",
//     borderBottom: "2px solid transparent",
//     cursor: "pointer",
//   },
//   activeTab: {
//     borderBottom: "2px solid #007bff",
//     fontWeight: "bold",
//     color: "#007bff",
//   },
// };

// export default FinancialTabs;



// import React, { useState, useMemo } from "react";
// import FinanceOverview from "./FinanceOverview";
// import IncomeState from "./IncomeState";
// import BalanceSheet from "./BalanceSheet";
// import CashFlowState from "./CashFlowState";
// import FinancialRatios from "./FinancialRatios";
// // import FinancialRatingSystem from "../RatingFile /FinancialRatingSystem";

// const subTabs = [
//   { key: "overview", label: "Overview" },
//   { key: "income", label: "Income Statement" },
//   { key: "balance", label: "Balance Sheet" },
//   { key: "cashflow", label: "Cash Flow" },
//   { key: "ratios", label: "Financial Ratios" },
// ];

// const mainTabs = [
//   { key: "standalone", label: "Standalone" },
//   { key: "consolidated", label: "Consolidated" },
// ];

// const FinancialTab = ({ symbol }) => {
//   const [mainTab, setMainTab] = useState("standalone");
//   const [activeSubTab, setActiveSubTab] = useState("overview");

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const renderTabContent = useMemo(() => {
//     const commonProps = { symbol, API_BASE, mainTab };

//     switch (activeSubTab) {
//       case "overview":
//         return <FinanceOverview {...commonProps} />;
//       case "income":
//         return <IncomeState {...commonProps} />;
//       case "balance":
//         return <BalanceSheet {...commonProps} />;
//       case "cashflow":
//         return <CashFlowState {...commonProps} />;
//       case "ratios":
//         return <FinancialRatios {...commonProps} />;
//       default:
//         return null;
//     }
//   }, [activeSubTab, symbol, API_BASE, mainTab]);

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       {/* Main Tabs */}

//       <div
//         className="flex justify-center gap-4 mb-6 flex-wrap"
//         role="tablist"
//         aria-label="Financial Data Tabs"
//       >
//         {mainTabs.map((tab) => (
//           <button
//             key={tab.key}
//             role="tab"
//             aria-selected={mainTab === tab.key}
//             onClick={() => {
//               setMainTab(tab.key);
//               setActiveSubTab("overview");
//             }}
//             className={`px-5 py-2 rounded-full text-lg font-medium transition-all duration-300 shadow-sm
//               ${mainTab === tab.key
//                 ? "bg-gradient-to-r from-sky-700 to-cyan-800 text-white shadow-lg scale-105"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
//               }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Sub Tabs */}
//       <div
//         className="flex justify-center gap-3  border-b border-gray-200 dark:border-slate-700 flex-wrap overflow-x-auto"
//         role="tablist"
//         aria-label="Financial Sub Tabs"
//       >
//         {subTabs.map((tab) => (
//           <button
//             key={tab.key}
//             role="tab"
//             aria-selected={activeSubTab === tab.key}
//             onClick={() => setActiveSubTab(tab.key)}
//             className={`relative px-4 py-2 text-sm font-medium transition-all duration-300
//               ${activeSubTab === tab.key
//                 ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400"
//                 : "text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
//               }`}
//           >
//             {tab.label}
//             {activeSubTab === tab.key && (
//               <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-slide-in"></span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Content */}
//       <div
//         className="rounded-xl shadow-md bg-white dark:bg-slate-800 transition-all duration-300 animate-fade-in"
//         role="tabpanel"
//       >
//         {renderTabContent}
//       </div>
//     </div>
//   );
// };

// export default FinancialTab;



// import React, { useState, useMemo } from "react";
// import FinanceOverview from "./FinanceOverview";
// import IncomeState from "./IncomeState";
// import BalanceSheet from "./BalanceSheet";
// import CashFlowState from "./CashFlowState";
// import FinancialRatios from "./FinancialRatios";

// const subTabs = [
//   { key: "overview", label: "Overview" },
//   { key: "income", label: "Income Statement" },
//   { key: "balance", label: "Balance Sheet" },
//   { key: "cashflow", label: "Cash Flow" },
//   { key: "ratios", label: "Financial Ratios" },
// ];

// const mainTabs = [
//   { key: "standalone", label: "Standalone" },
//   { key: "consolidated", label: "Consolidated" },
// ];

// const FinancialTab = ({ symbol }) => {
//   const [mainTab, setMainTab] = useState("standalone");
//   const [activeSubTab, setActiveSubTab] = useState("overview");

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const renderTabContent = useMemo(() => {
//     const commonProps = { symbol, API_BASE, mainTab };

//     switch (activeSubTab) {
//       case "overview":
//         return <FinanceOverview {...commonProps} />;
//       case "income":
//         return <IncomeState {...commonProps} />;
//       case "balance":
//         return <BalanceSheet {...commonProps} />;
//       case "cashflow":
//         return <CashFlowState {...commonProps} />;
//       case "ratios":
//         return <FinancialRatios {...commonProps} />;
//       default:
//         return null;
//     }
//   }, [activeSubTab, symbol, API_BASE, mainTab]);

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header *
//       {/* <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
//           Financial Analysis
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400 text-lg">Comprehensive financial insights for <span className="text-sky-600 dark:text-gray-400 text-lg p-3 text-1xl font-bold rounded-2xl p-2.5 shadow-lg border border-gray-100 dark:border-slate-700">{symbol}</span></p>
//       </div>

//       {/* Main Tabs *
//       <div className="flex justify-center mb-8">
//         <div className="bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-lg border border-gray-100 dark:border-slate-700">
//           {mainTabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => {
//                 setMainTab(tab.key);
//                 setActiveSubTab("overview");
//               }}
//               className={`relative px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${mainTab === tab.key
//                 ? "text-white shadow-lg"
//                 : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//                 }`}
//               style={{
//                 background: mainTab === tab.key
//                   ? 'linear-gradient(135deg, #0ea5e9, #0369a1)'
//                   : 'transparent'
//               }}
//             >
//               {tab.label}
//               {mainTab === tab.key && (
//                 <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 -z-10 animate-pulse-subtle"></div>
//               )}
//             </button>
//           ))}
//         </div>
//       </div> */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
//         {/* Header - Left Corner */}
//         <div className="text-left">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
//             Financial Analysis
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 text-lg">
//             Comprehensive financial insights for{" "}
//             <span className="text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-900/20 px-3 py-1 rounded-lg border border-sky-200 dark:border-sky-700">
//               {symbol}
//             </span>
//           </p>
//         </div>

//         {/* Main Tabs - Right Corner */}
//         <div className="bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-lg border border-gray-100 dark:border-slate-700">
//           {mainTabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => {
//                 setMainTab(tab.key);
//                 setActiveSubTab("overview");
//               }}
//               className={`relative px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${mainTab === tab.key
//                   ? "text-white shadow-lg"
//                   : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//                 }`}
//               style={{
//                 background:
//                   mainTab === tab.key
//                     ? "linear-gradient(135deg, #0ea5e9, #0369a1)"
//                     : "transparent",
//               }}
//             >
//               {tab.label}
//               {mainTab === tab.key && (
//                 <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 -z-10 animate-pulse-subtle"></div>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Sub Tabs */}
//       <div className="flex justify-center mb-8">
//         <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-1.5 shadow-inner border border-gray-200 dark:border-slate-700">
//           <div className="flex gap-1">
//             {subTabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveSubTab(tab.key)}
//                 className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${activeSubTab === tab.key
//                   ? "text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 shadow-md"
//                   : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
//                   }`}
//               >
//                 {tab.label}
//                 {activeSubTab === tab.key && (
//                   <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
//                 )}
//                 <div className={`absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${activeSubTab === tab.key ? 'opacity-20' : ''
//                   }`}></div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="relative">
//         {/* Animated Background Glow */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-cyan-900/10 rounded-2xl -z-10"></div>

//         {/* Content Container */}
//         <div className="relative rounded-2xl shadow-xl border border-gray-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
//           {/* Animated Border */}
//           <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-5"></div>

//           {/* Content */}
//           <div className="relative p-6">
//             {renderTabContent}
//           </div>
//         </div>
//       </div>

//       {/* Footer Note */}
//       <div className="text-center mt-6">
//         <p className="text-sm text-gray-500 dark:text-gray-500">
//           Financial data presented in millions • Real-time updates
//         </p>
//       </div>
//     </div>
//   );
// };

// export default FinancialTab;

import React, { useState, useMemo } from "react";
import FinanceOverview from "./FinanceOverview";
import IncomeState from "./IncomeState";
import BalanceSheet from "./BalanceSheet";
import CashFlowState from "./CashFlowState";
import FinancialRatios from "./FinancialRatios";

const subTabs = [
  { key: "overview", label: "Overview" },
  { key: "income", label: "Income Statement" },
  { key: "balance", label: "Balance Sheet" },
  { key: "cashflow", label: "Cash Flow" },
  { key: "ratios", label: "Financial Ratios" },
];

const mainTabs = [
  { key: "standalone", label: "Standalone" },
  { key: "consolidated", label: "Consolidated" },
];

const FinancialTab = ({ symbol }) => {
  const [mainTab, setMainTab] = useState("standalone");
  const [activeSubTab, setActiveSubTab] = useState("overview");

  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const renderTabContent = useMemo(() => {
    const commonProps = { symbol, API_BASE, mainTab };

    switch (activeSubTab) {
      case "overview":
        return <FinanceOverview {...commonProps} />;
      case "income":
        return <IncomeState {...commonProps} />;
      case "balance":
        return <BalanceSheet {...commonProps} />;
      case "cashflow":
        return <CashFlowState {...commonProps} />;
      case "ratios":
        return <FinancialRatios {...commonProps} />;
      default:
        return null;
    }
  }, [activeSubTab, symbol, API_BASE, mainTab]);

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Header & Main Tabs - Responsive Layout */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 md:mb-8 gap-4 md:gap-6">
        {/* Header - Left Side */}
        <div className="text-center lg:text-left flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
            Financial Analysis
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Comprehensive insights for{" "}
            <span className="text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-900/20 px-2 sm:px-3 py-1 rounded-lg border border-sky-200 dark:border-sky-700 text-xs sm:text-sm">
              {symbol}
            </span>
          </p>
        </div>

        {/* Main Tabs - Right Side */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-1 shadow-lg border border-gray-100 dark:border-slate-700 w-fit mx-auto lg:mx-0">
          <div className="flex gap-1">
            {mainTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setMainTab(tab.key);
                  setActiveSubTab("overview");
                }}
                className={`relative px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${mainTab === tab.key
                    ? "text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                style={{
                  background:
                    mainTab === tab.key
                      ? "linear-gradient(135deg, #0ea5e9, #0369a1)"
                      : "transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub Tabs - Fully Responsive */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="w-full max-w-4xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl sm:rounded-2xl p-1 shadow-inner border border-gray-200 dark:border-slate-700">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {subTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSubTab(tab.key)}
                className={`relative px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-1 min-w-0 ${activeSubTab === tab.key
                    ? "text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 shadow-sm sm:shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
              >
                {tab.label}
                {activeSubTab === tab.key && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 sm:w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area - Fully Responsive */}
      <div className="relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-cyan-900/10 rounded-xl sm:rounded-2xl -z-10"></div>

        {/* Content Container */}
        <div className="relative rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-5"></div>

          {/* Content with responsive padding */}
          <div className="relative p-3 sm:p-4 md:p-6">
            {renderTabContent}
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default FinancialTab;