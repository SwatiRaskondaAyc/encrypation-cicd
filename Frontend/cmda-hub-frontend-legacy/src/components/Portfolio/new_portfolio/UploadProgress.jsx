// src/components/PortLandPage/UploadProgress.jsx (New)
import React from "react";
import { motion } from "framer-motion";
import { HashLoader } from "react-spinners";

const UploadProgress = ({ progress }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="my-12 flex flex-col items-center"
  >
    <HashLoader color="#3b82f6" size={60} />
    <p className="mt-6 text-lg sm:text-xl text-blue-600 dark:text-blue-400">Processing your portfolio...</p>
    <div className="w-full max-w-xs sm:max-w-md h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
      />
    </div>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{progress}%</p>
  </motion.div>
);

export default UploadProgress;