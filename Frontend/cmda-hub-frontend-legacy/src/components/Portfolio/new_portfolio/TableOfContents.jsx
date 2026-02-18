import React from "react";
import {
    Layers,
    TrendingUp,
    Activity,
    BarChart3,
    PieChart,
    LineChart,
    BookOpen,
    CheckCircle2
} from "lucide-react";

const TableOfContents = ({ sections = [] }) => {
    const defaultSections = [
        { number: 1, title: "Current Holdings Overview", icon: Layers, page: 3 },
        { number: 2, title: "Portfolio Performance Summary", icon: TrendingUp, page: 4 },
        { number: 3, title: "Alpha Metrics Analysis", icon: Activity, page: 5 },
        { number: 4, title: "Beta Metrics & Risk Assessment", icon: BarChart3, page: 6 },
        { number: 5, title: "Valuation Ratios & Metrics", icon: PieChart, page: 7 },
        { number: 6, title: "Visual Insights & Charts", icon: LineChart, page: 8 },
        { number: 7, title: "Detailed Analysis & Glossary", icon: BookOpen, page: 9 },
    ];

    const contentSections = sections.length > 0 ? sections : defaultSections;

    return (
        <div className="table-of-contents min-h-screen bg-slate-50 dark:bg-slate-900 p-12 page-break-after">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                            Table of Contents
                        </h1>
                    </div>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </div>

                {/* Table Content */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-8 space-y-1">
                        {contentSections.map((section, index) => {
                            const IconComponent = section.icon;
                            return (
                                <div
                                    key={index}
                                    className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Section Number */}
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                                            {section.number}
                                        </div>

                                        {/* Icon */}
                                        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                            <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {section.title}
                                        </h3>
                                    </div>

                                    {/* Page Number */}
                                    <div className="flex items-center gap-3">
                                        <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent w-12"></div>
                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Page {section.page}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation Guide */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                                Navigation Guide
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                This report is structured to provide a comprehensive view of your portfolio.
                                Start with the Current Holdings Overview and progress through each section for detailed insights.
                                The Glossary section at the end contains detailed explanations of all metrics and formulas used.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableOfContents;
