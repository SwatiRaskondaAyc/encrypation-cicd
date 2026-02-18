
// // import React from "react";
// // import { motion } from "framer-motion";
// // import {
// //   RiUploadCloudLine,
// //   RiCheckLine,
// //   RiBarChartLine,
// //   RiArrowLeftSLine,
// // } from "react-icons/ri";
// // import { platforms } from "../utils/constants";
// // // import { platforms } from "../../utils/constants";

// // const Step = ({ label, number, active, completed }) => (
// //   <div className="flex items-center gap-3">
// //     <div
// //       className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${completed
// //           ? "bg-emerald-500 text-white"
// //           : active
// //             ? "bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/30"
// //             : "bg-gray-200 dark:bg-gray-700 text-gray-500"
// //         }`}
// //     >
// //       {completed ? <RiCheckLine className="w-5 h-5" /> : number}
// //     </div>
// //     <span
// //       className={`text-sm font-medium ${active || completed
// //           ? "text-gray-800 dark:text-gray-200"
// //           : "text-gray-500 dark:text-gray-500"
// //         }`}
// //     >
// //       {label}
// //     </span>
// //   </div>
// // );

// // const Divider = () => (
// //   <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-700 max-w-[100px]" />
// // );

// // const BrokerSelection = ({
// //   step,
// //   platform,
// //   file,
// //   onPlatformSelect,
// //   onFileSelect,
// //   onStepChange,
// //   onUploadChoice,
// //   disabled = false,
// //   triggerFileSelect = false,
// //   isAddMore = false,
// // }) => {
// //   const fileInputRef = React.useRef(null);

// //   React.useEffect(() => {
// //     if (triggerFileSelect && step === 2 && fileInputRef.current) {
// //       fileInputRef.current.click();
// //     }
// //   }, [triggerFileSelect, step]);

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files?.[0];
// //     if (selectedFile) {
// //       onFileSelect(selectedFile);
// //       if (!isAddMore) onStepChange(3);
// //     }
// //   };

// //   const handleSaveAndAnalyze = () => onUploadChoice?.(true);
// //   const handleJustAnalyze = () => onUploadChoice?.(false);

// //   return (
// //     <div className="py-8 px-4 max-w-5xl mx-auto">
// //       {/* Elegant Step Indicator */}
// //       <div className="flex items-center justify-center gap-8 mb-16 flex-wrap">
// //         <Step label="Choose Broker" number={1} active={step >= 1} completed={step > 1} />
// //         <Divider />
// //         <Step label="Upload File" number={2} active={step >= 2} completed={step > 2} />
// //         {!isAddMore && (
// //           <>
// //             <Divider />
// //             <Step label="Confirm" number={3} active={step >= 3} completed={false} />
// //           </>
// //         )}
// //       </div>

// //       {/* Step 1: Broker Selection */}
// //       {step === 1 && (
// //         <motion.section
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="text-center"
// //         >
// //           <h2 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-10">
// //             Select your broker
// //           </h2>

// //           <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-5 max-w-4xl mx-auto">
// //             {platforms.map((p, index) => (
// //               <motion.button
// //                 key={p.id}
// //                 initial={{ opacity: 0, scale: 0.9 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 transition={{ delay: index * 0.05 }}
// //                 disabled={disabled || p.comingSoon}
// //                 onClick={() => {
// //                   if (!p.comingSoon) {
// //                     onPlatformSelect(p.id);
// //                     onStepChange(2);
// //                   }
// //                 }}
// //                 whileHover={{ scale: 1.08, y: -4 }}
// //                 whileTap={{ scale: 0.96 }}
// //                 className={`group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${p.comingSoon || disabled
// //                     ? "opacity-60 cursor-not-allowed"
// //                     : platform === p.id
// //                       ? "ring-4 ring-indigo-400 shadow-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/40 dark:to-gray-800"
// //                       : "bg-white dark:bg-gray-800 shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700"
// //                   }`}
// //               >
// //                 <div className={`p-4 flex flex-col items-center justify-center h-full ${p.comingSoon ? "grayscale" : ""}`}>
// //                   <img
// //                     src={p.logo}
// //                     alt={p.name}
// //                     className="h-10 object-contain mb-2 transition-transform group-hover:scale-110"
// //                   />
// //                   <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
// //                     {p.name}
// //                   </p>
// //                 </div>

// //                 {p.comingSoon && (
// //                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
// //                     <span className="text-xs font-bold text-white bg-black/70 px-3 py-1 rounded-full">
// //                       Soon
// //                     </span>
// //                   </div>
// //                 )}
// //               </motion.button>
// //             ))}
// //           </div>
// //         </motion.section>
// //       )}

// //       {/* Step 2: File Upload */}
// //       {step === 2 && (
// //         <motion.section
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="max-w-md mx-auto text-center"
// //         >
// //           <h2 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-8">
// //             Upload statement from{" "}
// //             <span className="font-medium">
// //               {platforms.find((p) => p.id === platform)?.name}
// //             </span>
// //           </h2>

// //           <motion.div
// //             whileHover={{ scale: 1.02 }}
// //             className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/30 transition-all"
// //           >
// //             <RiUploadCloudLine className="mx-auto h-14 w-14 text-gray-400 mb-5" />
// //             <p className="text-base font-medium text-gray-700 dark:text-gray-300">
// //               Drop file here
// //             </p>
// //             <p className="text-xs text-gray-500 mt-1 mb-6">CSV, Excel supported</p>

// //             <input
// //               type="file"
// //               accept=".csv,.xlsx,.xls"
// //               ref={fileInputRef}
// //               onChange={handleFileChange}
// //               className="hidden"
// //             />
// //             <motion.button
// //               whileHover={{ scale: 1.05 }}
// //               whileTap={{ scale: 0.95 }}
// //               onClick={() => fileInputRef.current?.click()}
// //               className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg transition-all"
// //             >
// //               Select File
// //             </motion.button>
// //           </motion.div>

// //           <button
// //             onClick={() => onStepChange(1)}
// //             className="mt-8 text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mx-auto transition-colors"
// //           >
// //             <RiArrowLeftSLine className="w-4 h-4" />
// //             Change broker
// //           </button>
// //         </motion.section>
// //       )}

// //       {/* Step 3: Confirm */}
// //       {step === 3 && file && (
// //         <motion.section
// //           initial={{ opacity: 0, scale: 0.95 }}
// //           animate={{ opacity: 1, scale: 1 }}
// //           className="max-w-lg mx-auto"
// //         >
// //           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
// //             <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <RiCheckLine className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
// //             </div>

// //             <h2 className="text-2xl font-light text-center text-gray-900 dark:text-white mb-3">
// //               Ready for Analysis
// //             </h2>
// //             <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-8">
// //               {file.name} • {(file.size / (1024 * 1024)).toFixed(1)} MB
// //             </p>

// //             <div className="space-y-4">
// //               <motion.button
// //                 whileHover={{ scale: 1.02 }}
// //                 whileTap={{ scale: 0.98 }}
// //                 onClick={handleSaveAndAnalyze}
// //                 className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
// //               >
// //                 <RiBarChartLine className="w-6 h-6" />
// //                 Portfolio Review & Save
// //               </motion.button>

// //               <motion.button
// //                 whileHover={{ scale: 1.02 }}
// //                 whileTap={{ scale: 0.98 }}
// //                 onClick={handleJustAnalyze}
// //                 className="w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-all flex items-center justify-center gap-3"
// //               >
// //                 <RiBarChartLine className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
// //                 Quick Review Without Saving
// //               </motion.button>
// //             </div>

// //             <button
// //               onClick={() => onStepChange(2)}
// //               className="mt-8 text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mx-auto"
// //             >
// //               <RiArrowLeftSLine className="w-4 h-4" />
// //               Upload different file
// //             </button>
// //           </div>
// //         </motion.section>
// //       )}
// //     </div>
// //   );
// // };

// // export default BrokerSelection;



// import React from "react";
// import { motion } from "framer-motion";
// import {
//   RiUploadCloudLine,
//   RiCheckLine,
//   RiBarChartLine,
//   RiArrowLeftSLine,
// } from "react-icons/ri";
// import { platforms } from "../utils/constants";
// // import { platforms } from "../../utils/constants";

// const Step = ({ label, number, active, completed }) => (
//   <div className="flex items-center gap-3">
//     <div
//       className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${completed
//         ? "bg-emerald-500 text-white"
//         : active
//           ? "bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/30"
//           : "bg-gray-200 dark:bg-gray-700 text-gray-500"
//         }`}
//     >
//       {completed ? <RiCheckLine className="w-5 h-5" /> : number}
//     </div>
//     <span
//       className={`text-sm font-medium ${active || completed
//         ? "text-gray-800 dark:text-gray-200"
//         : "text-gray-500 dark:text-gray-500"
//         }`}
//     >
//       {label}
//     </span>
//   </div>
// );

// const Divider = () => (
//   <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-700 max-w-[100px]" />
// );

// const BrokerSelection = ({
//   step,
//   platform,
//   file,
//   onPlatformSelect,
//   onFileSelect,
//   onStepChange,
//   onUploadChoice,
//   disabled = false,
//   triggerFileSelect = false,
//   isAddMore = false,
// }) => {
//   const fileInputRef = React.useRef(null);

//   React.useEffect(() => {
//     if (triggerFileSelect && step === 2 && fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   }, [triggerFileSelect, step]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       onFileSelect(selectedFile);
//       if (!isAddMore) onStepChange(3);
//     }
//   };

//   const handleSaveAndAnalyze = () => onUploadChoice?.(true);
//   const handleJustAnalyze = () => onUploadChoice?.(false);

//   return (
//     <div className="py-8 px-4 max-w-5xl mx-auto">
//       {/* Elegant Step Indicator */}
//       <div className="flex items-center justify-center gap-8 mb-16 flex-wrap">
//         <Step label="Choose Broker" number={1} active={step >= 1} completed={step > 1} />
//         <Divider />
//         <Step label="Upload File" number={2} active={step >= 2} completed={step > 2} />
//         {!isAddMore && (
//           <>
//             <Divider />
//             <Step label="Confirm" number={3} active={step >= 3} completed={false} />
//           </>
//         )}
//       </div>

//       {/* Step 1: Broker Selection */}
//       {step === 1 && (
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <h2 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-10">
//             Select your broker
//           </h2>

//           <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-5 max-w-4xl mx-auto">
//             {platforms.map((p, index) => (
//               <motion.button
//                 key={p.id}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: index * 0.05 }}
//                 disabled={disabled || p.comingSoon}
//                 onClick={() => {
//                   if (!p.comingSoon) {
//                     onPlatformSelect(p.id);
//                     onStepChange(2);
//                   }
//                 }}
//                 whileHover={{ scale: 1.08, y: -4 }}
//                 whileTap={{ scale: 0.96 }}
//                 className={`group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${p.comingSoon || disabled
//                   ? "opacity-60 cursor-not-allowed"
//                   : platform === p.id
//                     ? "ring-4 ring-indigo-400 shadow-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/40 dark:to-gray-800"
//                     : "bg-white dark:bg-gray-800 shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700"
//                   }`}
//               >
//                 <div className={`p-4 flex flex-col items-center justify-center h-full ${p.comingSoon ? "grayscale" : ""}`}>
//                   <img
//                     src={p.logo}
//                     alt={p.name}
//                     className="h-10 object-contain mb-2 transition-transform group-hover:scale-110"
//                   />
//                   <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
//                     {p.name}
//                   </p>
//                 </div>

//                 {p.comingSoon && (
//                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                     <span className="text-xs font-bold text-white bg-black/70 px-3 py-1 rounded-full">
//                       Soon
//                     </span>
//                   </div>
//                 )}
//               </motion.button>
//             ))}
//           </div>
//         </motion.section>
//       )}

//       {/* Step 2: File Upload */}
//       {step === 2 && (
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-md mx-auto text-center"
//         >
//           <h2 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-8">
//             Upload statement from{" "}
//             <span className="font-medium">
//               {platforms.find((p) => p.id === platform)?.name}
//             </span>
//           </h2>

//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/30 transition-all"
//           >
//             <RiUploadCloudLine className="mx-auto h-14 w-14 text-gray-400 mb-5" />
//             <p className="text-base font-medium text-gray-700 dark:text-gray-300">
//               Drop file here
//             </p>
//             <p className="text-xs text-gray-500 mt-1 mb-6">CSV, Excel supported</p>

//             <input
//               type="file"
//               accept=".csv,.xlsx,.xls"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               className="hidden"
//             />
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => fileInputRef.current?.click()}
//               className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg transition-all"
//             >
//               Select File
//             </motion.button>
//           </motion.div>

//           <button
//             onClick={() => onStepChange(1)}
//             className="mt-8 text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mx-auto transition-colors"
//           >
//             <RiArrowLeftSLine className="w-4 h-4" />
//             Change broker
//           </button>
//         </motion.section>
//       )}

//       {/* Step 3: Confirm */}
//       {step === 3 && file && (
//         <motion.section
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="max-w-lg mx-auto"
//         >
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
//             <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
//               <RiCheckLine className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
//             </div>

//             <h2 className="text-2xl font-light text-center text-gray-900 dark:text-white mb-3">
//               Ready for Analysis
//             </h2>
//             <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-8">
//               {file.name} • {(file.size / (1024 * 1024)).toFixed(1)} MB
//             </p>

//             <div className="space-y-4">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleSaveAndAnalyze}
//                 className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
//               >
//                 <RiBarChartLine className="w-6 h-6" />
//                 Portfolio Review & Save
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleJustAnalyze}
//                 className="w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-all flex items-center justify-center gap-3"
//               >
//                 <RiBarChartLine className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
//                 Quick Review Without Saving
//               </motion.button>
//             </div>

//             <button
//               onClick={() => onStepChange(2)}
//               className="mt-8 text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mx-auto"
//             >
//               <RiArrowLeftSLine className="w-4 h-4" />
//               Upload different file
//             </button>
//           </div>
//         </motion.section>
//       )}
//     </div>
//   );
// };

// export default BrokerSelection;
import React from "react";
import { motion } from "framer-motion";
import {
  RiUploadCloudLine,
  RiCheckLine,
  RiBarChartLine,
  RiArrowLeftSLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { platforms } from "../../utils/constants";

const Step = ({ label, number, active, completed }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${completed
        ? "bg-emerald-500 text-white"
        : active
          ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/30"
          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        }`}
    >
      {completed ? <RiCheckLine className="w-5 h-5" /> : number}
    </div>
    <span
      className={`text-sm font-medium ${active || completed
        ? "text-gray-800 dark:text-gray-200"
        : "text-gray-500 dark:text-gray-500"
        }`}
    >
      {label}
    </span>
  </div>
);

const Divider = () => (
  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent dark:from-gray-700 max-w-[100px]" />
);

const BrokerSelection = ({
  step,
  platform,
  file,
  onPlatformSelect,
  onFileSelect,
  onStepChange,
  onUploadChoice,
  disabled = false,
  triggerFileSelect = false,
  isAddMore = false,
  isLoggedIn = false,
}) => {
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (triggerFileSelect && step === 2 && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [triggerFileSelect, step]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
      if (!isAddMore) onStepChange(3);
    }
  };

  const handleSaveAndAnalyze = () => onUploadChoice?.(true);
  const handleJustAnalyze = () => onUploadChoice?.(false);

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      {/* Elegant Step Indicator */}
      <div className="flex items-center justify-center gap-8 mb-16 flex-wrap">
        <Step label="Choose Broker" number={1} active={step >= 1} completed={step > 1} />
        <Divider />
        <Step label="Upload File" number={2} active={step >= 2} completed={step > 2} />
        {!isAddMore && (
          <>
            <Divider />
            <Step label="Confirm" number={3} active={step >= 3} completed={false} />
          </>
        )}
      </div>

      {/* Step 1: Broker Selection */}
      {step === 1 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-10">
            Select your broker
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-5 max-w-4xl mx-auto">
            {platforms.map((p, index) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                disabled={p.comingSoon}
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.info("Kindly log in before proceeding to your portfolio.");

                    return;
                  }
                  if (!p.comingSoon) {
                    onPlatformSelect(p.id);
                    onStepChange(2);
                  }
                }}



                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className={`group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${p.comingSoon
                  ? "opacity-60 cursor-not-allowed"
                  : platform === p.id
                    ? "ring-4 ring-blue-400 shadow-xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/40 dark:to-gray-800"
                    : "bg-white dark:bg-gray-800 shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700"
                  }`}
              >
                <div className={`p-4 flex flex-col items-center justify-center h-full ${p.comingSoon ? "grayscale" : ""}`}>
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="h-10 object-contain mb-2 transition-transform group-hover:scale-110"
                  />
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
                    {p.name}
                  </p>
                </div>

                {p.comingSoon && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-xs font-bold text-white bg-black/70 px-3 py-1 rounded-full">
                      Soon
                    </span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.section>
      )}

      {/* Step 2: File Upload */}
      {step === 2 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <h2 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-8">
            Upload statement from{" "}
            <span className="font-medium">
              {platforms.find((p) => p.id === platform)?.name}
            </span>
          </h2>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/30 transition-all"
          >
            <RiUploadCloudLine className="mx-auto h-14 w-14 text-gray-400 mb-5" />
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
              Drop file here
            </p>
            <p className="text-xs text-gray-500 mt-1 mb-6">CSV, Excel supported</p>

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!isLoggedIn) {
                  toast.info("Kindly log in before proceeding to your portfolio.");

                  return;
                }
                fileInputRef.current?.click();
              }}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition-all"
            >
              Select File
            </motion.button>
          </motion.div>

          <button
            onClick={() => onStepChange(1)}
            className="mt-8 text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 mx-auto transition-colors"
          >
            <RiArrowLeftSLine className="w-4 h-4" />
            Change broker
          </button>
        </motion.section>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && file && (
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <RiCheckLine className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
            </div>

            <h2 className="text-2xl font-light text-center text-gray-900 dark:text-white mb-3">
              Ready for Analysis
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-8">
              {file.name} • {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.info("Kindly log in before proceeding to your portfolio.");

                    return;
                  }
                  handleSaveAndAnalyze();
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <RiBarChartLine className="w-6 h-6" />
                Portfolio Preview & Save
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.info("Kindly log in before proceeding to your portfolio.");

                    return;
                  }
                  handleJustAnalyze();
                }}
                className="w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-all flex items-center justify-center gap-3"
              >
                <RiBarChartLine className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Quick Preview Without Saving
              </motion.button>
            </div>

            <button
              onClick={() => onStepChange(2)}
              className="mt-8 text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 mx-auto"
            >
              <RiArrowLeftSLine className="w-4 h-4" />
              Upload different file
            </button>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default BrokerSelection;