import React, { useState } from "react";
import { X, Info } from "lucide-react";
import ColumnHeaderWithInfo from "./ColumnHeaderWithInfo";

const MetricInfoModal = ({
  isOpen,
  onClose,
  title,
  concept,
  formula,
  interpretation,
  tableData,
  columns,
  color = "blue",
  example,
}) => {
  if (!isOpen) return null;

  const [showHelp, setShowHelp] = useState(false);

  const getColorStyles = (c) => {
    const colors = {
      blue: {
        bg: "bg-blue-600",
        bgLight: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        hover: "hover:bg-blue-700",
        headerText: "text-blue-700",
      },
      violet: {
        bg: "bg-violet-600",
        bgLight: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200",
        hover: "hover:bg-violet-700",
        headerText: "text-violet-700",
      },
      emerald: {
        bg: "bg-emerald-600",
        bgLight: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        hover: "hover:bg-emerald-700",
        headerText: "text-emerald-700",
      },
      amber: {
        bg: "bg-amber-600",
        bgLight: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        hover: "hover:bg-amber-700",
        headerText: "text-amber-700",
      },
      rose: {
        bg: "bg-rose-600",
        bgLight: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        hover: "hover:bg-rose-700",
        headerText: "text-rose-700",
      },
      cyan: {
        bg: "bg-cyan-600",
        bgLight: "bg-cyan-50",
        text: "text-cyan-700",
        border: "border-cyan-200",
        hover: "hover:bg-cyan-700",
        headerText: "text-cyan-700",
      },
    };
    return colors[c] || colors.blue;
  };

  const styles = getColorStyles(color);

  // Filter out stocks with 0 weight
  const filteredTableData = React.useMemo(() => {
    if (!tableData || !Array.isArray(tableData)) return [];
    return tableData.filter((row) => {
      const weight = parseFloat(row.weight);
      return weight > 0;
    });
  }, [tableData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col relative">
        {/* Header - Matching AlphaCard gradient style */}
        <div
          className={`bg-gradient-to-r from-${color}-600 to-${color}-700 ${styles.bg} px-6 py-4 flex items-center justify-between shrink-0`}
        >
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {title}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHelp(!showHelp);
                  }}
                  className={`bg-white/20 hover:bg-white/30 text-white rounded-full p-1 transition-colors`}
                  title={`Learn about ${title}`}
                >
                  <Info size={14} />
                </button>
              </h3>
              <p className="text-xs text-white text-opacity-80 mt-0.5">
                Portfolio valuation analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Glossary Overlay Panel - Matching AlphaCard style */}
        {showHelp && (
          <div className="absolute top-20 left-8 right-8 bottom-8 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Panel Header */}
            <div className="px-8 py-6 border-b border-gray-200 shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">
                    Understanding {title}
                  </h4>
                  <p className="text-gray-500 mt-1 text-sm">
                    Measuring Portfolio Value
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHelp(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Concept Section */}
                <div>
                  <h5
                    className={`font-bold ${styles.headerText} mb-3 uppercase text-xs tracking-wide`}
                  >
                    CONCEPT
                  </h5>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {concept}
                  </p>
                </div>

                {/* Example Section - if available */}
                {example && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-400">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-bold text-amber-900 mb-1">
                          Practical Example
                        </p>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          {example}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Formula Section */}
                <div>
                  <h5
                    className={`font-bold ${styles.headerText} mb-3 uppercase text-xs tracking-wide`}
                  >
                    THE FORMULA
                  </h5>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                    <div
                      className="font-serif italic text-lg text-slate-800"
                      dangerouslySetInnerHTML={{ __html: formula }}
                    />
                  </div>
                </div>
              </div>

              {/* Interpretation Guide */}
              {interpretation && (
                <div className="border-t pt-6">
                  <h5
                    className={`font-bold ${styles.headerText} mb-4 uppercase text-xs tracking-wide`}
                  >
                    INTERPRETATION GUIDE
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="font-bold text-emerald-900 mb-2 text-sm">
                        Low Values Indicate
                      </div>
                      <p className="text-sm text-emerald-700 leading-relaxed">
                        {interpretation.low}
                      </p>
                    </div>
                    <div className="p-5 bg-rose-50 rounded-lg border border-rose-100">
                      <div className="font-bold text-rose-900 mb-2 text-sm">
                        High Values Indicate
                      </div>
                      <p className="text-sm text-rose-700 leading-relaxed">
                        {interpretation.high}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content - Matching AlphaCard table style */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {/* Portfolio Summary */}
          <div
            className={`mb-6 p-5 ${styles.bgLight} rounded-lg border ${styles.border} flex items-center justify-between`}
          >
            <div>
              <h4 className={`text-lg font-semibold ${styles.text}`}>
                Portfolio {title}
              </h4>
              <p className={`text-sm opacity-80 mt-1 ${styles.text}`}>
                Weighted average based on current composition
              </p>
            </div>
          </div>

          {/* Individual Stock Analysis - EXACTLY like AlphaCard */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 px-1">
              Individual Stock Breakdown
            </h4>
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns &&
                      columns.map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {col.description ? (
                            <ColumnHeaderWithInfo
                              label={col.label}
                              description={col.description}
                            />
                          ) : (
                            col.label
                          )}
                          {col.subLabel && (
                            <div className="text-xs font-normal text-gray-400 mt-0.5">
                              {col.subLabel}
                            </div>
                          )}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTableData && filteredTableData.length > 0 ? (
                    filteredTableData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className={`px-4 py-3 text-sm ${
                              col.key === "symbol"
                                ? "font-bold text-gray-800"
                                : "text-gray-600"
                            }`}
                          >
                            {col.format
                              ? col.format(row[col.key], row)
                              : row[col.key] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns?.length || 1}
                        className="px-4 py-8 text-center text-gray-500 italic"
                      >
                        No calculation data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 shrink-0">
          <button
            onClick={onClose}
            className={`w-full px-4 py-2 ${styles.bg} text-white rounded-md font-medium text-sm ${styles.hover} transition-colors shadow-sm`}
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricInfoModal;
