// src/components/PortLandPage/ErrorAlert.jsx (New)
import React from "react";
import { motion } from "framer-motion";
import { RiErrorWarningLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

const ErrorAlert = ({ error, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="mb-8 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-md"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <RiErrorWarningLine className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
        <p className="text-red-800 dark:text-red-300 text-sm sm:text-base break-words">{error}</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDismiss}
        className="p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded transition-all"
        aria-label="Dismiss error"
      >
        <IoClose className="w-5 h-5 text-red-600 dark:text-red-400" />
      </motion.button>
    </div>
  </motion.div>
);

export default ErrorAlert;