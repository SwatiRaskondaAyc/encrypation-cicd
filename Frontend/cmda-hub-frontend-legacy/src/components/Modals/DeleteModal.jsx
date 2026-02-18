// src/components/Modals/DeleteModal.jsx (New)
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiErrorWarningLine } from "react-icons/ri";

const DeleteModal = ({ show, onClose, onConfirm }) => (
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
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <RiErrorWarningLine className="w-12 sm:w-16 h-12 sm:h-16 text-red-600 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Portfolio?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">This action cannot be undone.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={onConfirm}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-all"
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DeleteModal;