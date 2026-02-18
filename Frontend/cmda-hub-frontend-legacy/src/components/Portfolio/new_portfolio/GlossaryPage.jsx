import React from "react";
import { BookOpen, Info, Target, BarChart, TrendingUp, Activity, PieChart } from "lucide-react";

const GlossaryPage = ({ metricDefinitions = {} }) => {
    const glossaryItems = [
        {
            icon: Target,
            color: "violet",
            term: "P/E Ratio (Price-to-Earnings)",
            definition: "The Price-to-Earnings ratio measures how many rupees you're paying for each rupee of annual earnings. A P/E of 25 means you're paying ₹25 for every ₹1 the company earns annually.",
            formula: "P/E = Market Price per Share ÷ Earnings per Share (EPS)",
            interpretation: [
                { label: "Low P/E (<15)", desc: "Value stocks, potential bargains, or mature industries" },
                { label: "High P/E (>30)", desc: "High growth expectations, common in tech and pharma" }
            ]
        },
        {
            icon: BarChart,
            color: "emerald",
            term: "P/B Ratio (Price-to-Book)",
            definition: "The Price-to-Book ratio tells you if you're paying more or less than the company's net asset value. Book value is Total Assets minus Total Liabilities.",
            formula: "P/B = Market Price per Share ÷ Book Value per Share",
            interpretation: [
                { label: "Low P/B (<1.0)", desc: "Buying at discount to net assets, common in banks" },
                { label: "High P/B (>5.0)", desc: "Market values intangibles like brand, IP, and growth" }
            ]
        },
        {
            icon: TrendingUp,
            color: "amber",
            term: "Dividend Yield",
            definition: "Dividend Yield measures the annual cash flow your portfolio generates relative to its price. It's the 'interest rate' you earn just for holding the stocks.",
            formula: "Dividend Yield = (Annual Dividend per Share ÷ Price per Share) × 100",
            interpretation: [
                { label: "Low Yield (0-2%)", desc: "Growth-focused companies that reinvest profits" },
                { label: "High Yield (>4%)", desc: "Income-focused stocks, mature companies" }
            ]
        },
        {
            icon: Activity,
            color: "blue",
            term: "Alpha Metrics",
            definition: "Alpha measures the excess return of an investment relative to the return of a benchmark index. Positive alpha indicates outperformance.",
            formula: "Alpha = Actual Return - Expected Return (based on Beta and Market Return)",
            interpretation: [
                { label: "Positive Alpha", desc: "Portfolio is outperforming the benchmark" },
                { label: "Negative Alpha", desc: "Portfolio is underperforming the benchmark" }
            ]
        },
        {
            icon: PieChart,
            color: "purple",
            term: "Beta Metrics",
            definition: "Beta measures a portfolio's volatility relative to the overall market. A beta of 1.0 means the portfolio moves in line with the market.",
            formula: "Beta = Covariance(Portfolio Returns, Market Returns) ÷ Variance(Market Returns)",
            interpretation: [
                { label: "Beta < 1", desc: "Less volatile than the market, lower risk" },
                { label: "Beta > 1", desc: "More volatile than the market, higher risk" }
            ]
        },
        {
            icon: BarChart,
            color: "cyan",
            term: "Sharpe Ratio",
            definition: "The Sharpe Ratio measures risk-adjusted returns. It shows how much excess return you receive for the extra volatility you endure.",
            formula: "Sharpe Ratio = (Portfolio Return - Risk-Free Rate) ÷ Standard Deviation",
            interpretation: [
                { label: "Sharpe > 1", desc: "Good risk-adjusted returns" },
                { label: "Sharpe > 2", desc: "Excellent risk-adjusted returns" }
            ]
        },
        {
            icon: TrendingUp,
            color: "rose",
            term: "Sortino Ratio",
            definition: "Similar to Sharpe Ratio but only considers downside volatility, providing a better measure of risk-adjusted return for portfolios with asymmetric returns.",
            formula: "Sortino Ratio = (Portfolio Return - Risk-Free Rate) ÷ Downside Deviation",
            interpretation: [
                { label: "Sortino > 1", desc: "Good downside risk-adjusted returns" },
                { label: "Sortino > 2", desc: "Excellent downside risk management" }
            ]
        }
    ];

    const colorClasses = {
        violet: "from-violet-500 to-purple-600",
        emerald: "from-emerald-500 to-green-600",
        amber: "from-amber-500 to-orange-600",
        blue: "from-blue-500 to-cyan-600",
        purple: "from-purple-500 to-pink-600",
        cyan: "from-cyan-500 to-blue-600",
        rose: "from-rose-500 to-red-600"
    };

    return (
        <div className="glossary-page min-h-screen bg-slate-50 dark:bg-slate-900 p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                            Detailed Analysis & Glossary
                        </h1>
                    </div>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3"></div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Comprehensive explanations of all metrics, formulas, and investment concepts used in this report.
                    </p>
                </div>

                {/* Glossary Items */}
                <div className="space-y-6">
                    {glossaryItems.map((item, index) => {
                        const IconComponent = item.icon;
                        const gradientClass = colorClasses[item.color] || colorClasses.blue;

                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 page-break-inside-avoid"
                            >
                                {/* Header */}
                                <div className={`bg-gradient-to-r ${gradientClass} p-6`}>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">
                                                {item.term}
                                            </h3>
                                            <p className="text-white/90 text-sm">
                                                {item.definition}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 space-y-4">
                                    {/* Formula */}
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                Formula
                                            </span>
                                        </div>
                                        <p className="font-mono text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                            {item.formula}
                                        </p>
                                    </div>

                                    {/* Interpretation */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Interpretation Guide
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {item.interpretation.map((interp, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${gradientClass} mt-1.5 flex-shrink-0`}></div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">
                                                                {interp.label}
                                                            </p>
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                                {interp.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        Important Note
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                        All metrics and calculations in this report are based on the latest available financial data.
                        Portfolio metrics are weighted averages where each stock's impact is proportional to its market value.
                        Past performance is not indicative of future results. Please consult with a financial advisor before making investment decisions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GlossaryPage;
