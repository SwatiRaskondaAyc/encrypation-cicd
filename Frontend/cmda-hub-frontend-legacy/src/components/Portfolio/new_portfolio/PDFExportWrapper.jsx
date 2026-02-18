import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import CoverPage from './CoverPage';
import TableOfContents from './TableOfContents';
import GlossaryPage from './GlossaryPage';
import SummaryCard from './SummaryCard';
import AlphaCard from './AlphaCard';
import BetaCard from './BetaCard';
import MetricsCard from './MetricsCard';
import GraphCatalog from './GraphCatalog';
import TransactionSheet from './TransactionSheet';
import { exportPortfolioToPDF, PDFExportModal } from './pdfExportUtils';

/**
 * PDF Export Wrapper Component
 * Structures all portfolio content for professional PDF export
 */
const PDFExportWrapper = ({
    data,
    portfolioName,
    companyLogo = '/cmda_logo1.png',
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportMessage, setExportMessage] = useState('');

    const handleExportPDF = async () => {
        setIsExporting(true);
        setExportProgress(0);
        setExportMessage('Initializing...');

        const result = await exportPortfolioToPDF({
            portfolioName,
            companyLogo,
            elementId: 'pdf-export-content',
            filename: `${portfolioName.replace(/\s+/g, '_')}_Analysis_${new Date().toISOString().split('T')[0]}.pdf`,
            onProgress: (progress, message) => {
                setExportProgress(progress);
                setExportMessage(message);
            },
        });

        // Keep modal visible for a moment to show completion
        setTimeout(() => {
            setIsExporting(false);
            setExportProgress(0);
            setExportMessage('');
        }, 1000);

        if (result.success) {
            console.log(`PDF generated successfully: ${result.filename} (${result.pages} pages)`);
        } else {
            console.error('PDF generation failed:', result.error);
            alert(`PDF Export Failed: ${result.error}`);
        }
    };

    const summary = data?.portfolio_summary || {};

    const currentHoldingsConverted = (() => {
        let holdings = data.ledger?.holdings || [];
        if (holdings.length === 0) {
            holdings = data.ledger?.current_holdings || [];
        }
        return holdings.map((h) => ({
            symbol: h.scrip || h.Symbol,
            quantity: h.qty || h.Qty,
            current_price: h.current_price || h.Current_Price || h.Mkt_Price,
        }));
    })();

    return (
        <div className="pdf-export-container">
            {/* Export Button */}
            <div className="mb-8 flex justify-end">
                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileDown className="w-5 h-5" />
                    {isExporting ? 'Exporting...' : 'Export to PDF'}
                </button>
            </div>

            {/* Progress Modal */}
            <PDFExportModal
                isVisible={isExporting}
                progress={exportProgress}
                message={exportMessage}
            />

            {/* PDF Content (Hidden from view, used for export) */}
            <div id="pdf-export-content" className="hidden">
                {/* Page 1: Cover Page */}
                <CoverPage
                    portfolioName={portfolioName}
                    companyLogo={companyLogo}
                />

                {/* Page 2: Table of Contents */}
                <TableOfContents />

                {/* Page 3: Current Holdings Overview */}
                <div className="page-break-before bg-white dark:bg-slate-900 p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            1. Current Holdings Overview
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    </div>
                    <div className="page-break-inside-avoid">
                        <TransactionSheet ledgerData={data.ledger} isExporting={true} />
                    </div>
                </div>

                {/* Page 4: Portfolio Performance Summary */}
                <div className="page-break-before bg-white dark:bg-slate-900 p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            2. Portfolio Performance Summary
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    </div>

                    {/* Summary Metrics Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8 page-break-inside-avoid">
                        <SummaryCard
                            title="Deployed Capital"
                            value={summary.total_deployed_amount}
                            isCurrency
                            isExporting={true}
                        />
                        <SummaryCard
                            title="Current Market Value"
                            value={summary.current_market_value}
                            isCurrency
                            isExporting={true}
                        />
                        <SummaryCard
                            title="Overall P&L"
                            value={summary.overall_pnl}
                            isCurrency
                            colorScale
                            isExporting={true}
                        />
                        <SummaryCard
                            title="Total Return"
                            value={summary.overall_return_percentage}
                            suffix="%"
                            colorScale
                            isExporting={true}
                        />
                    </div>

                    {/* Best/Worst Performers */}
                    <div className="grid grid-cols-2 gap-6 page-break-inside-avoid">
                        <SummaryCard
                            title={summary.best_performer?.symbol ? `Best: ${summary.best_performer.symbol}` : "Best Performer"}
                            value={summary.best_performer?.unrealized_pnl}
                            isCurrency
                            highlight
                            isExporting={true}
                        />
                        <SummaryCard
                            title={summary.worst_performer?.symbol ? `Worst: ${summary.worst_performer.symbol}` : "Worst Performer"}
                            value={summary.worst_performer?.unrealized_pnl}
                            isCurrency
                            colorScale
                            isExporting={true}
                        />
                    </div>
                </div>

                {/* Page 5: Alpha Metrics Analysis */}
                <div className="page-break-before bg-white dark:bg-slate-900 p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            3. Alpha Metrics Analysis
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                        <p className="text-slate-600 dark:text-slate-400 mt-4">
                            Alpha measures excess returns generated beyond the market benchmark, indicating portfolio manager skill.
                        </p>
                    </div>
                    <div className="page-break-inside-avoid">
                        <AlphaCard
                            alphaMetrics={data.alpha_metrics}
                            currentHoldings={currentHoldingsConverted}
                            isExporting={true}
                        />
                    </div>
                </div>

                {/* Page 6: Beta Metrics & Risk Assessment */}
                <div className="page-break-before bg-white dark:bg-slate-900 p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            4. Beta Metrics & Risk Assessment
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                        <p className="text-slate-600 dark:text-slate-400 mt-4">
                            Beta measures portfolio volatility relative to the market, indicating systematic risk exposure.
                        </p>
                    </div>
                    <div className="page-break-inside-avoid">
                        <BetaCard
                            betaMetrics={data.beta_metrics}
                            currentHoldings={currentHoldingsConverted}
                            isExporting={true}
                        />
                    </div>
                </div>

                {/* Page 7: Valuation Ratios & Metrics */}
                <div className="page-break-before bg-white dark:bg-slate-900 p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            5. Valuation Ratios & Metrics
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                        <p className="text-slate-600 dark:text-slate-400 mt-4">
                            Key valuation metrics including P/E, P/B ratios and dividend yield for portfolio assessment.
                        </p>
                    </div>

                    {/* Metrics Card */}
                    <div className="mb-8 page-break-inside-avoid">
                        <MetricsCard
                            ratioMetrics={data.ratio_metrics}
                            currentHoldings={currentHoldingsConverted}
                            isExporting={true}
                        />
                    </div>

                    {/* Valuation Summary */}
                    <div className="grid grid-cols-3 gap-6 page-break-inside-avoid">
                        <SummaryCard
                            title="Portfolio P/E"
                            value={data.valuation_metrics?.portfolio_metrics?.pe}
                            customColor="violet"
                            isExporting={true}
                        />
                        <SummaryCard
                            title="Portfolio P/B"
                            value={data.valuation_metrics?.portfolio_metrics?.pb}
                            customColor="emerald"
                            isExporting={true}
                        />
                        <SummaryCard
                            title="Dividend Yield"
                            value={data.valuation_metrics?.portfolio_metrics?.dividend_yield}
                            suffix="%"
                            customColor="amber"
                            isExporting={true}
                        />
                    </div>
                </div>

                {/* Page 8: Visual Insights & Charts */}
                <div className="page-break-before bg-white dark:bg-slate-900 p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                            6. Visual Insights & Charts
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                        <p className="text-slate-600 dark:text-slate-400 mt-4">
                            Comprehensive visual analysis of portfolio composition, performance trends, and sector allocation.
                        </p>
                    </div>
                    <div className="page-break-inside-avoid">
                        <GraphCatalog graphs={data.graphs || {}} isExporting={true} />
                    </div>
                </div>

                {/* Page 9: Detailed Analysis & Glossary */}
                <GlossaryPage metricDefinitions={data.metric_definitions} />
            </div>

            {/* Visible Preview (Optional - can show a sample or preview) */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    PDF Export Preview
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Click "Export to PDF" to generate a comprehensive portfolio analysis report with the following structure:
                </p>
                <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-decimal list-inside">
                    <li>Cover Page - Portfolio name and company branding</li>
                    <li>Table of Contents - Quick navigation reference</li>
                    <li>Current Holdings Overview - Detailed holdings table</li>
                    <li>Portfolio Performance Summary - Key metrics and returns</li>
                    <li>Alpha Metrics Analysis - Excess return analysis</li>
                    <li>Beta Metrics & Risk Assessment - Volatility and risk metrics</li>
                    <li>Valuation Ratios & Metrics - P/E, P/B, dividend yield</li>
                    <li>Visual Insights & Charts - All performance graphs</li>
                    <li>Detailed Analysis & Glossary - Complete metric explanations</li>
                </ol>
            </div>
        </div>
    );
};

export default PDFExportWrapper;
