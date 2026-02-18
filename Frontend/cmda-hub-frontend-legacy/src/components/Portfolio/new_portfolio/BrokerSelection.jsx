// src/components/PortLandPage/BrokerSelection.jsx (Refactored from BrokerPage)
import React from "react";
import { motion } from "framer-motion";
import {
  RiUploadCloudLine,
  RiPlayCircleLine,
  RiCheckLine,
  RiBarChartLine,
} from "react-icons/ri";
import { platforms } from "../../utils/constants"; // Assume platforms moved here

const Step = ({ label, number, active, completed }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-3"
  >
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${completed
          ? "bg-green-500 text-white shadow-lg"
          : active
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-200 dark:bg-gray-700 text-gray-500"
        }`}
    >
      {completed ? <RiCheckLine className="w-5 h-5" /> : number}
    </div>
    <span
      className={`text-sm font-medium transition-colors ${active || completed ? "text-gray-900 dark:text-white" : "text-gray-500"
        }`}
    >
      {label}
    </span>
  </motion.div>
);

const Divider = () => (
  <motion.div
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    className="flex-1 h-px bg-gray-300 dark:bg-gray-600 max-w-[80px] mx-4"
  />
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
}) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
      onStepChange(3);
    }
  };

  const handleSaveAndAnalyze = () => onUploadChoice?.(true);
  const handleJustAnalyze = () => onUploadChoice?.(false);

  return (
    <div className="mb-16 space-y-8">
      {/* Steps (responsive) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col sm:flex-row items-center gap-6 mb-12 justify-center"
      >
        <Step label="Choose Broker" number={1} active={step >= 1} completed={step > 1} />
        <Divider />
        <Step label="Upload File" number={2} active={step >= 2} completed={step > 2} />
        <Divider />
        <Step label="Confirm" number={3} active={step >= 3} completed={false} />
      </motion.div>

      {/* Step 1: Broker Selection (grid responsive) */}
      {step === 1 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold mb-8 text-gray-800 dark:text-gray-200">
            Select your broker
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 max-w-5xl mx-auto px-4">
            {platforms.map((p, index) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                disabled={disabled || p.comingSoon}
                onClick={() => {
                  if (p.comingSoon) return;
                  onPlatformSelect(p.id);
                  onStepChange(2);
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-2xl border-2 p-4 sm:p-6 transition-all duration-300 overflow-hidden ${p.comingSoon
                    ? "cursor-not-allowed border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
                    : platform === p.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400"
                  } ${disabled ? "opacity-50" : ""}`}
              >
                <div className={p.comingSoon ? "opacity-40 grayscale" : ""}>
                  <img src={p.logo} alt={p.name} className="h-10 sm:h-12 mx-auto mb-3 object-contain" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{p.name}</p>
                </div>
                {p.comingSoon && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/70"
                  >
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wide bg-black/70 text-white rounded-full">
                      Coming Soon
                    </span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className="mt-8 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2 mx-auto hover:underline transition-all"
          >
            <RiPlayCircleLine className="w-5 h-5" />
            How to download statement?
          </motion.button>
        </motion.section>
      )}

      {/* Step 2: File Upload (responsive padding) */}
      {step === 2 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-xl font-semibold mb-8 text-gray-800 dark:text-gray-200">
            Upload your transaction file from {platform}
          </h2>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 transition-all duration-300"
          >
            <RiUploadCloudLine className="mx-auto h-16 sm:h-20 w-16 sm:w-20 text-gray-400 mb-6" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drop your CSV or Excel file here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Supported formats: .csv, .xlsx, .xls
            </p>

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              id="broker-file-input"
              onChange={handleFileChange}
            />
            <motion.label
              htmlFor="broker-file-input"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              Choose File
            </motion.label>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onStepChange(1)}
            className="mt-8 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
          >
            ← Change broker
          </motion.button>
        </motion.section>
      )}

      {/* Step 3: Confirm (responsive buttons) */}
      {step === 3 && file && (
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 text-center border border-gray-200 dark:border-gray-700"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 sm:w-20 h-16 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
            >
              <RiCheckLine className="w-10 sm:w-12 h-10 sm:h-12 text-green-600 dark:text-green-400" />
            </motion.div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              File Ready!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-medium">{file.name}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Size: {(file.size / (1024 * 1024)).toFixed(2)} MB • Broker: {platform}
            </p>

            <div className="mt-8 sm:mt-10">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-8">
                What would you like to do?
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveAndAnalyze}
                  className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex flex-col items-center gap-3"
                >
                  <RiBarChartLine className="w-8 sm:w-10 h-8 sm:h-10" />
                  <span>Save & Analyze</span>
                  <span className="text-sm font-normal opacity-90">
                    Keep this portfolio for later
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJustAnalyze}
                  className="p-6 sm:p-8 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex flex-col items-center gap-3"
                >
                  <RiBarChartLine className="w-8 sm:w-10 h-8 sm:h-10 text-blue-600 dark:text-blue-400" />
                  <span>Just Analyze</span>
                  <span className="text-sm font-normal opacity-80">
                    View once, no saving
                  </span>
                </motion.button>
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onStepChange(2)}
              className="mt-8 sm:mt-10 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
            >
              ← Upload different file
            </motion.button>
          </motion.div>
        </motion.section>
      )}
    </div>
  );
};

export default BrokerSelection;