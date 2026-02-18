// src/components/Modals/SaveModal.jsx (New)
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { RiBarChartLine } from "react-icons/ri";

const SaveModal = ({
  show,
  onClose,
  portfolioName,
  selectedBroker,
  selectedFile,
  savedPortfoliosLength,
  isAuthenticated,
  onJustAnalyze,
  onSaveAndAnalyze,
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Save this portfolio?</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ml-4"
            >
              <IoClose className="w-6 h-6" />
            </motion.button>
          </div>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="font-medium text-blue-800 dark:text-blue-300">Portfolio Details:</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
              Name: {portfolioName}<br />
              Broker: {selectedBroker}<br />
              File: {selectedFile?.name}
            </p>
          </div>
          {savedPortfoliosLength >= 5 ? (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <p className="font-medium text-red-800 dark:text-red-300">Cannot Save:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You have reached the maximum limit of 5 portfolios.
                Please delete one first.
              </p>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
              Saving allows you to reload it later and keep it in your list.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={onJustAnalyze}
              className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Just Analyze
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={onSaveAndAnalyze}
              disabled={savedPortfoliosLength >= 5 || !isAuthenticated()}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <RiBarChartLine className="w-5 h-5" />
              Save & Analyze
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SaveModal;