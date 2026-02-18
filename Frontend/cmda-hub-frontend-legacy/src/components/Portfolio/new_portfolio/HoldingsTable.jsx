import React, { useState } from "react";
import { Settings, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";

/**
 * Customizable Holdings Table
 * Allows user to select up to 6 columns to view detailed stock metrics.
 */
const HoldingsTable = ({ holdings = [] }) => {
  const [selectedColumns, setSelectedColumns] = useState([
    "Alpha_Pct",
    "Beta",
    "Annualized_Return",
    "Annualized_Volatility",
    "Sharpe_Ratio",
    "SMB_Beta",
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Available Columns configuration
  const availableColumns = [
    {
      key: "Alpha_Pct",
      label: "Alpha (%)",
      format: (v) => (v ? (v * 100).toFixed(2) : "-"),
    },
    { key: "Beta", label: "Beta", format: (v) => (v ? v.toFixed(2) : "-") },
    {
      key: "Annualized_Return",
      label: "Ann. Return",
      format: (v) => (v ? (v * 100).toFixed(1) + "%" : "-"),
    },
    {
      key: "Annualized_Volatility",
      label: "Ann. Volatility",
      format: (v) => (v ? (v * 100).toFixed(1) + "%" : "-"),
    },

    {
      key: "Sharpe_Ratio",
      label: "Sharpe",
      format: (v) => (v ? v.toFixed(2) : "-"),
    },
    {
      key: "Sortino_Ratio",
      label: "Sortino",
      format: (v) => (v ? v.toFixed(2) : "-"),
    },
    {
      key: "Treynor_Ratio",
      label: "Treynor",
      format: (v) => (v ? v.toFixed(2) : "-"),
    },
    {
      key: "Information_Ratio",
      label: "Info Ratio",
      format: (v) => (v ? v.toFixed(2) : "-"),
    },

    {
      key: "Tracking_Error",
      label: "Tracking Err",
      format: (v) => (v ? (v * 100).toFixed(1) + "%" : "-"),
    },
    {
      key: "Omega_Ratio",
      label: "Omega",
      format: (v) => (v ? v.toFixed(2) : "-"),
    },

    // Factors
    {
      key: "SMB_Beta",
      label: "SMB (Size)",
      format: (v) => (v ? v.toFixed(2) : "-"),
    },
    {
      key: "HML_Beta",
      label: "HML (Value)",
      format: (v) => (v ? v.toFixed(2) : "-"),
    },
    {
      key: "MOM_Beta",
      label: "MOM (Momtm)",
      format: (v) => (v ? v.toFixed(2) : "-"),
    },
    {
      key: "VOL_Beta",
      label: "VOL (LowVol)",
      format: (v) => (v ? v.toFixed(2) : "-"),
    },
  ];

  const handleToggleColumn = (key) => {
    if (selectedColumns.includes(key)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== key));
    } else {
      if (selectedColumns.length < 6) {
        setSelectedColumns([...selectedColumns, key]);
      }
    }
  };

  // Helper to format values safely
  const formatCell = (row, colKey) => {
    const colDef = availableColumns.find((c) => c.key === colKey);
    const val = row[colKey];
    if (val === undefined || val === null) return "-";
    return colDef ? colDef.format(val) : val;
  };

  // Color logic for specific metric text
  const getCellClass = (key, val) => {
    if (!val) return "text-gray-500 dark:text-gray-400";
    if (
      [
        "Alpha_Pct",
        "Annualized_Return",
        "Sharpe_Ratio",
        "Sortino_Ratio",
      ].includes(key)
    ) {
      return val > 0
        ? "text-green-600 dark:text-green-400 font-medium"
        : "text-red-500 dark:text-red-400 font-medium";
    }
    if (["Beta"].includes(key)) {
      return val > 1.2 ? "text-orange-500 dark:text-orange-400" : "text-gray-700 dark:text-gray-300";
    }
    return "text-gray-700 dark:text-gray-300";
  };

  if (!holdings || holdings.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="p-6 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center bg-gray-50/30 dark:bg-slate-900/10">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            In-Depth Holdings Analytics
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Compare individual stock risk factors and returns
          </p>
        </div>

        {/* Column Configurator */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm transition-all"
          >
            <Settings size={16} />
            Columns ({selectedColumns.length}/6)
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Visible Metrics
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Done
                </button>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {availableColumns.map((col) => {
                  const isSelected = selectedColumns.includes(col.key);
                  const isDisabled = !isSelected && selectedColumns.length >= 6;

                  return (
                    <button
                      key={col.key}
                      onClick={() => handleToggleColumn(col.key)}
                      disabled={isDisabled}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all ${isSelected
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium"
                          : isDisabled
                            ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                            : "hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      <span>{col.label}</span>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">
                Stock Symbol
              </th>
              {selectedColumns.map((colKey) => {
                const col = availableColumns.find((c) => c.key === colKey);
                return (
                  <th
                    key={colKey}
                    className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-right whitespace-nowrap"
                  >
                    {col?.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
            {holdings.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {row.Symbol}
                </td>
                {selectedColumns.map((colKey) => (
                  <td
                    key={colKey}
                    className={`px-6 py-4 text-right whitespace-nowrap ${getCellClass(
                      colKey,
                      row[colKey]
                    )}`}
                  >
                    {formatCell(row, colKey)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {holdings.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          No metrics available. Ensure you have active holdings and risk
          analysis enabled.
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;
