import html2pdf from 'html2pdf.js';
import './pdfStyles.css';

/**
 * Portfolio PDF Export Utility
 * Generates a professional multi-page PDF with proper structure:
 * 1. Cover Page
 * 2. Table of Contents
 * 3. Current Holdings
 * 4. Summary Cards
 * 5. Alpha Cards
 * 6. Beta Cards
 * 7. Metrics Cards
 * 8. Graphs
 * 9. Glossary & Details
 */

export const exportPortfolioToPDF = async (options = {}) => {
    const {
        portfolioName,
        companyLogo = '/cmda_logo1.png',
        elementId = 'pdf-export-content',
        filename = 'Portfolio_Analysis_Report.pdf',
        onProgress = null,
    } = options;

    try {
        // Show progress
        if (onProgress) onProgress(10, 'Preparing document...');

        const element = document.getElementById(elementId);

        if (!element) {
            throw new Error(`Element with id '${elementId}' not found`);
        }

        // Add PDF-specific classes to prevent orphans
        element.classList.add('pdf-content');

        // Configure html2pdf options
        const pdfOptions = {
            margin: [15, 15, 15, 15], // top, right, bottom, left in mm
            filename: filename,
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                letterRendering: true,
                scrollY: 0,
                scrollX: 0,
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true,
            },
            pagebreak: {
                mode: ['avoid-all', 'css', 'legacy'],
                before: ['.page-break-before', '.page-break-after'],
                after: ['.page-break-after'],
                avoid: [
                    '.page-break-inside-avoid',
                    '.summary-card',
                    '.alpha-card',
                    '.beta-card',
                    '.metrics-card',
                    'table',
                    'h1',
                    'h2',
                    'h3',
                    '.chart-wrapper',
                    '.modal-content-pdf'
                ],
            },
        };

        if (onProgress) onProgress(30, 'Rendering content...');

        // Generate PDF
        const pdf = await html2pdf()
            .from(element)
            .set(pdfOptions)
            .toPdf()
            .get('pdf');

        if (onProgress) onProgress(80, 'Adding page numbers...');

        // Add page numbers and footer
        const totalPages = pdf.internal.getNumberOfPages();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();

        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);

            // Skip page numbers on cover page
            if (i > 1) {
                pdf.setFontSize(9);
                pdf.setTextColor(100, 100, 100);

                // Page number
                pdf.text(
                    `Page ${i - 1} of ${totalPages - 1}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );

                // Footer line
                pdf.setDrawColor(200, 200, 200);
                pdf.setLineWidth(0.5);
                pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

                // Confidential notice
                pdf.setFontSize(7);
                pdf.setTextColor(150, 150, 150);
                pdf.text(
                    `${portfolioName} - Confidential`,
                    15,
                    pageHeight - 10
                );

                // Generated date
                const genDate = new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                pdf.text(
                    genDate,
                    pageWidth - 15,
                    pageHeight - 10,
                    { align: 'right' }
                );
            }
        }

        if (onProgress) onProgress(95, 'Finalizing PDF...');

        // Save the PDF
        await pdf.save();

        if (onProgress) onProgress(100, 'PDF generated successfully!');

        // Remove PDF class
        element.classList.remove('pdf-content');

        return {
            success: true,
            filename: filename,
            pages: totalPages,
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
