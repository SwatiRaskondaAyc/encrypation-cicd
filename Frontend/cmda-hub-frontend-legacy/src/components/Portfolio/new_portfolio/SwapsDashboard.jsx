import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

const SwapsDashboard = ({ initialData, file }) => {
  const API_BASE = import.meta.env.VITE_URL;
  const [targetSymbol, setTargetSymbol] = useState(null);
  const [swapSymbol, setSwapSymbol] = useState(null);
  const [availableHoldings, setAvailableHoldings] = useState([]);

  // Candidates State
  const [candidates, setCandidates] = useState(null);
  const [expandedIndustries, setExpandedIndustries] = useState({});

  // Results State
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData && initialData.available_holdings) {
      setAvailableHoldings(initialData.available_holdings);
    }
  }, [initialData]);

  const fetchCandidates = async (symbol) => {
    setLoading(true);
    setError(null);
    setCandidates(null);
    setSimulationResult(null);
    setSwapSymbol(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target_symbol", symbol);

      const response = await axios.post(`${API_BASE}/graph/swaps_analysis`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.graph_data) {
        const data = response.data.graph_data;
        if (data.error) {
          setError(data.error);
        } else if (data.candidates) {
          setCandidates(data.candidates);
          const initialExpanded = {};
          Object.keys(data.candidates.grouped_candidates || {}).forEach(
            (k) => (initialExpanded[k] = true)
          );
          setExpandedIndustries(initialExpanded);
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch candidates.");
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    if (!targetSymbol || !swapSymbol) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target_symbol", targetSymbol);
      formData.append("swap_symbol", swapSymbol);

      const response = await axios.post(`${API_BASE}/graph/swaps_analysis`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.graph_data) {
        if (response.data.graph_data.error) {
          setError(response.data.graph_data.error);
        } else {
          setSimulationResult(response.data.graph_data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  const toggleIndustry = (ind) => {
    setExpandedIndustries((prev) => ({ ...prev, [ind]: !prev[ind] }));
  };

  const handleTargetChange = (e) => {
    const sym = e.target.value;
    setTargetSymbol(sym);
    if (sym) fetchCandidates(sym);
  };

  // --- Render Helpers ---

  const MetricCard = ({
    label,
    original,
    simulated,
    formatter = (val) => val,
  }) => {
    const diff = simulated - original;
    const isPositive = diff > 0;
    const percentChange =
      original !== 0 ? ((diff / Math.abs(original)) * 100).toFixed(1) : 0;

    return (
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
          {label}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-slate-400 dark:text-gray-500 mb-1">Original HOLD</div>
            <div className="text-lg font-bold text-slate-700 dark:text-gray-200">
              {formatter(original)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-indigo-500 dark:text-indigo-400 mb-1 font-semibold">
              If SWAPPED
            </div>
            <div
              className={`text-xl font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                }`}
            >
              {formatter(simulated)}
            </div>
          </div>
        </div>
        <div
          className={`mt-4 pt-3 border-t border-slate-50 dark:border-slate-700 text-xs flex items-center justify-between ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
            }`}
        >
          <span className="text-slate-400 dark:text-gray-500">Net Impact</span>
          <div className="flex items-center font-bold">
            {isPositive ? (
              <TrendingUp size={14} className="mr-1" />
            ) : (
              <TrendingDown size={14} className="mr-1" />
            )}
            {isPositive ? "+" : ""}
            {formatter(diff)} ({isPositive ? "+" : ""}
            {percentChange}%)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl min-h-[600px] text-slate-800 dark:text-gray-200">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Counterfactual Swaps
        </h2>
        <p className="text-slate-500 dark:text-gray-400 max-w-2xl">
          Simulate how your portfolio would have performed if you had picked a
          different stock within the same sector.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-xl mb-6 flex items-start space-x-3 text-rose-700 dark:text-rose-400">
          <div className="mt-0.5">
            <TrendingDown size={18} />
          </div>
          <div>{error}</div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* 1. Select Holding */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-600 dark:text-gray-300">
              1
            </span>
            Select Current Holding
          </label>
          <div className="relative">
            <select
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-700 dark:text-gray-200 font-medium shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
              value={targetSymbol || ""}
              onChange={handleTargetChange}
            >
              <option value="">-- Choose Stock --</option>
              {availableHoldings.map((h) => (
                <option key={h.Symbol} value={h.Symbol}>
                  {h.Symbol}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-gray-500">
              <ChevronDown size={20} />
            </div>
          </div>
          {targetSymbol && (
            <div className="text-xs text-slate-400 dark:text-gray-500 px-1">
              Sector:{" "}
              {availableHoldings.find((h) => h.Symbol === targetSymbol)?.Sector}
            </div>
          )}
        </div>

        {/* 2. Select Swap Candidate */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xs">
              2
            </span>
            Swap Candidate
          </label>
          <div className="relative">
            {!targetSymbol ? (
              <div className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 border-dashed rounded-xl p-4 text-slate-400 dark:text-gray-500 italic text-center h-[58px] flex items-center justify-center">
                Select a holding first
              </div>
            ) : candidates ? (
              <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-h-[400px] overflow-y-auto shadow-sm custom-scrollbar">
                {Object.entries(candidates.grouped_candidates || {}).map(
                  ([industry, stocks]) => (
                    <div
                      key={industry}
                      className="border-b border-slate-100 dark:border-slate-700 last:border-0"
                    >
                      {/* Accordion Header */}
                      <div
                        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                        onClick={() => toggleIndustry(industry)}
                      >
                        <span className="font-semibold text-sm text-slate-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {industry}
                        </span>
                        {expandedIndustries[industry] ? (
                          <ChevronDown size={16} className="text-slate-400 dark:text-gray-500" />
                        ) : (
                          <ChevronRight size={16} className="text-slate-400 dark:text-gray-500" />
                        )}
                      </div>

                      {/* List */}
                      {expandedIndustries[industry] && (
                        <div className="bg-slate-50/50 dark:bg-slate-900/30 px-2 pb-2 grid grid-cols-2 gap-2">
                          {stocks.map((stock) => (
                            <div
                              key={stock}
                              className={`px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-all ${swapSymbol === stock
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/50"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                }`}
                              onClick={() => setSwapSymbol(stock)}
                            >
                              <span className="font-medium">{stock}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : loading ? (
              <div className="p-4 text-center text-slate-400 dark:text-gray-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                Loading peers...
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 dark:text-gray-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                No peers found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-center mb-10">
        <button
          onClick={runSimulation}
          disabled={!targetSymbol || !swapSymbol || loading}
          className={`
                        flex items-center space-x-2 px-10 py-4 rounded-full font-bold shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0
                        ${!targetSymbol || !swapSymbol
              ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-gray-500 cursor-not-allowed shadow-none"
              : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-indigo-200 dark:shadow-indigo-900/50"
            }
                    `}
        >
          {loading ? (
            <RefreshCcw className="animate-spin" size={20} />
          ) : (
            <RefreshCcw size={20} />
          )}
          <span>{loading ? "Simulating..." : "Run Simulation"}</span>
        </button>
      </div>

      {/* RESULTS DASHBOARD */}
      {simulationResult && simulationResult.target_metrics && (
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-xs text-slate-400 dark:text-gray-500 font-bold uppercase mb-1">
                Selling
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {targetSymbol}
              </div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
              <ArrowRight className="text-slate-400 dark:text-gray-500" />
            </div>
            <div className="text-center">
              <div className="text-xs text-indigo-400 font-bold uppercase mb-1">
                Buying
              </div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {swapSymbol}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              label="Total P&L"
              original={simulationResult.target_metrics.total_pnl}
              simulated={simulationResult.simulated_metrics?.total_pnl || 0}
              formatter={(val) =>
                `₹${val?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
              }
            />
            <MetricCard
              label="Total Return %"
              original={simulationResult.target_metrics.return_pct}
              simulated={simulationResult.simulated_metrics?.return_pct || 0}
              formatter={(val) => `${val?.toFixed(2)}%`}
            />
            <MetricCard
              label="Current Value"
              original={simulationResult.target_metrics.current_value}
              simulated={simulationResult.simulated_metrics?.current_value || 0}
              formatter={(val) =>
                `₹${val?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapsDashboard;
