import React from 'react';
import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { equityHubMap, portfolioMap } from './ComponentRegistry';
import { GraphDataProvider } from '../Portfolio/GraphDataContext';

const PlotCard = ({ label, symbol, companyName, id, uploadId, platform, type, delay = 0, onDelete }) => {
    const ComponentMap = type === 'equity' ? equityHubMap : portfolioMap;
    const Component = ComponentMap[label];
    // Default uploadId for the sample file, overridden by prop if provided
    const effectiveUploadId = uploadId || "eaf8f73b-3063-4d87-8f78-7647f1a400f4";

    if (!Component) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay }}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow w-full h-full"
            >
                <button
                    onClick={onDelete}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                    aria-label="Delete component"
                >
                    <IoMdClose size={20} />
                </button>
                <p className="text-red-500 text-sm">Component "{label}" not found</p>
            </motion.div>
        );
    }

    if (type === 'equity' && !symbol) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay }}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow w-full h-full"
            >
                <button
                    onClick={onDelete}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                    aria-label="Delete component"
                >
                    <IoMdClose size={20} />
                </button>
                <p className="text-yellow-500 text-sm">Waiting for company selection for {label}</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow w-full h-full"
        >
            <button
                onClick={onDelete}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                aria-label="Delete component"
            >
                <IoMdClose size={20} />
            </button>
            <h3 className="text-base font-semibold mb-4 text-gray-800 dark:text-white truncate">
                {label} {companyName ? `(${companyName})` : platform ? `(${platform})` : ''}
            </h3>
            <div className="w-full h-full overflow-hidden">
                {type === 'equity' ? (
                    <Component symbol={symbol} key={`${id}-${symbol}`} />
                ) : (
                    <GraphDataProvider>
                        <Component uploadId={effectiveUploadId} key={`${id}-${effectiveUploadId}`} />
                    </GraphDataProvider>
                )}
            </div>
        </motion.div>
    );
};

export default PlotCard;