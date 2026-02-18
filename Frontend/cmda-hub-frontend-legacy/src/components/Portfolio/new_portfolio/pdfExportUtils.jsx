import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

/**
 * Portfolio PDF Export Utility using @react-pdf/renderer
 * No oklch color issues! Pure React-based PDF generation
 */

export const exportPortfolioToPDF = async (pdfDocument, options = {}) => {
    const {
        filename = 'Portfolio_Analysis_Report.pdf',
        onProgress = null,
    } = options;

    try {
        // Show progress
        if (onProgress) onProgress(10, 'Preparing document...');

        if (!pdfDocument) {
            throw new Error('PDF Document component is required');
        }

        if (onProgress) onProgress(30, 'Rendering PDF...');

        // Generate PDF blob
        const blob = await pdf(pdfDocument).toBlob();

        if (onProgress) onProgress(80, 'Finalizing PDF...');

        // Save the PDF
        saveAs(blob, filename);

        if (onProgress) onProgress(100, 'PDF generated successfully!');

        return {
            success: true,
            filename: filename,
            size: blob.size,
        };

    } catch (error) {
        console.error('PDF Export Error:', error);
        if (onProgress) onProgress(0, 'Export failed');

        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * PDF Export Progress Modal Component
 */
export const PDFExportModal = ({ isVisible, progress, message }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-white animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Generating PDF Report
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {message}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {progress}%
                        </span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                        Please wait while we compile your portfolio analysis into a professional PDF report.
                        This may take a few moments.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default { exportPortfolioToPDF, PDFExportModal };
