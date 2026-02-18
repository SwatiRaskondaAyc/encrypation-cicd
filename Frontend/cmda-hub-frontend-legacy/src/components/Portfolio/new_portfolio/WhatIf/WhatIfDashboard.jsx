import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCcw,
  Search,
  X,
  ChevronRight,
  Zap,
  HelpCircle,
} from "lucide-react";
import axios from "axios";
import CandleLoader from "../CandleLoader";
import HowToUseGuide from "./HowToUseGuide";
import HoldingsList from "./HoldingsList";
import WhatIfAnalysis from "./WhatIfAnalysis";

const WhatIfDashboard = ({ transactionsData }) => {
  const [initialHoldings, setInitialHoldings] = useState([]);
  const [currentHoldings, setCurrentHoldings] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  // "Source" stock for simulation
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  // Hierarchy Data (Populated when user selects a stock to SWAP)
  const [hierarchyData, setHierarchyData] = useState(null);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);

  // View State for Hierarchy Modal
  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);
  const [viewMode, setViewMode] = useState("HIERARCHY"); // "HIERARCHY" | "SECTORS"
  const [allSectors, setAllSectors] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const analysisRef = useRef(null);
  const API_BASE_URL = `${import.meta.env.VITE_URL}/portfolio`;
  const token = localStorage.getItem("authToken");

  // --- 1. DATA LOADING & NORMALIZATION ---
  useEffect(() => {
    if (transactionsData) {
      let rawHoldings = [];
      // Attempt to extract holdings from various shapes
      if (Array.isArray(transactionsData.current_holdings)) {
        rawHoldings = transactionsData.current_holdings;
      } else if (
        transactionsData.ledger &&
        Array.isArray(transactionsData.ledger.current_holdings)
      ) {
        rawHoldings = transactionsData.ledger.current_holdings;
      } else if (
        transactionsData.ledger &&
        Array.isArray(transactionsData.ledger.holdings)
      ) {
        rawHoldings = transactionsData.ledger.holdings;
      } else if (Array.isArray(transactionsData)) {
        rawHoldings = transactionsData;
      }

      // Normalize
      const normalized = rawHoldings
        .map((h) => ({
          symbol:
            h.symbol || h.Symbol || h.scrip || h.scrip_name || h.Scrip_Name,
          quantity: Number(h.quantity || h.qty || h.Qty || h.Quantity),
          current_price: Number(
            h.current_price || h.LastPrice || h.Close || h.Mkt_Price || 0
          ),
          name: h.name || h.Scrip_Name || h.scrip || h.symbol || h.Symbol,
          sector: h.sector || h.Sector || h.industry || h.Industry || "Unknown",
        }))
        .filter((h) => h.symbol && h.quantity > 0);

      // Enrich holdings with sector data from backend (async IIFE)
      (async () => {
        try {
          const res = await axios.post(
            `${API_BASE_URL}/what-if/enrich-holdings`,
            {
              holdings: normalized,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.data && res.data.holdings) {
            console.log("✅ Enriched holdings received:", res.data.holdings);
            console.log("Sample enriched holding:", res.data.holdings[0]);
            setInitialHoldings(res.data.holdings);
            setCurrentHoldings(res.data.holdings);
          } else {
            // Fallback if enrichment fails
            console.warn("⚠️ Enrichment returned no data, using normalized");
            setInitialHoldings(normalized);
            setCurrentHoldings(normalized);
          }
        } catch (err) {
          console.error("❌ Enrichment failed, using normalized data:", err);
          setInitialHoldings(normalized);
          setCurrentHoldings(normalized);
        }
      })();
    }
  }, [transactionsData]);

  // --- 2. API ACTIONS ---

  const fetchAllSectors = async () => {
    setLoadingHierarchy(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/what-if/sectors`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(res.data)) {
        setAllSectors(res.data);
        setViewMode("SECTORS");
      }
    } catch (err) {
      console.error("Error fetching sectors", err);
      setError("Could not load sectors.");
    } finally {
      setLoadingHierarchy(false);
    }
  };

  const handleSectorSelect = async (sectorName) => {
    setLoadingHierarchy(true);
    setError(null);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/what-if/hierarchy/sector/${encodeURIComponent(
          sectorName
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHierarchyData(res.data);
      setViewMode("HIERARCHY");
    } catch (err) {
      console.error("Error fetching sector hierarchy", err);
      setError(`Could not load hierarchy for ${sectorName}`);
    } finally {
      setLoadingHierarchy(false);
    }
  };

  const handleGlobalSearch = async () => {
    if (!searchTerm || viewMode !== "SECTORS") return;

    setLoadingHierarchy(true);
    setError(null);
    try {
      // Try to find if this is a stock
      const res = await axios.get(
        `${API_BASE_URL}/what-if/sector-hierarchy/${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && !res.data.error && res.data.sector) {
        setHierarchyData(res.data);
        setViewMode("HIERARCHY");
      } else {
        // Fallback or just show error
        setError(`Stock '${searchTerm}' not found in database.`);
      }
    } catch (err) {
      console.error("Global search error", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoadingHierarchy(false);
    }
  };

  // Called when user clicks "Swap" on a holding card
  const handleInitiateSwap = async (stock) => {
    setSelectedStock(stock); // Set the "Source"
    setIsHierarchyOpen(true); // Open the modal to choose "Target"

    setLoadingHierarchy(true);
    setHierarchyData(null);
    setSelectedIndustry(null);
    setViewMode("HIERARCHY");
    setSearchTerm(""); // Reset search term when opening modal

    // For Add New Stock mode, skip hierarchy and show all sectors
    if (stock.symbol === "__ADD_NEW__") {
      setViewMode("SECTORS");
      fetchAllSectors();
      // Remove premature setLoadingHierarchy(false) - let fetchAllSectors handle it
    } else {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/what-if/sector-hierarchy/${stock.symbol}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHierarchyData(res.data);
      } catch (err) {
        console.error("Hierarchy fetch error", err);
        fetchAllSectors();
      } finally {
        setLoadingHierarchy(false);
      }
    }
  };

  const handleTargetSelect = (targetPeer) => {
    setIsHierarchyOpen(false);
    setSelectedStock((prev) => ({
      ...prev,
      preSelectedTarget: targetPeer,
    }));
  };

  const handleSimulate = async (payload) => {
    setLoading(true);
    setError(null);

    // Immediate scroll to show current state (loader)
    setTimeout(() => {
      if (analysisRef.current) {
        analysisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);

    try {
      // Extract current portfolio metrics from transactionsData
      const currentMetrics = transactionsData?.portfolio_metrics || null;

      const reqPayload = {
        current_holdings: currentHoldings,
        current_metrics: currentMetrics, // Pass metrics from dashboard
        ...payload,
      };

      const res = await axios.post(
        `${API_BASE_URL}/what-if/simulate`,
        reqPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysisResult(res.data);
      if (res.data.modified_holdings) {
        setCurrentHoldings(res.data.modified_holdings);
      }
      setSelectedStock(null);
    } catch (err) {
      console.error("Simulation error", err);
      setError("Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentHoldings(initialHoldings);
    setAnalysisResult(null);
    setSelectedStock(null);
    setError(null);
  };

  // --- 3. RENDER HELPERS ---

  return (
    <div className="w-full h-full font-sans text-slate-800 dark:text-slate-100 pb-12 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-800 dark:selection:text-indigo-100">
      {/* HEADER */}
      <div className="relative z-10 w-full bg-transparent border-b border-indigo-50/50 dark:border-slate-700/50 py-6 mb-6">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                What-If Simulation
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Optimize your portfolio with AI-driven scenarios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-all border border-indigo-100 dark:border-indigo-800"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Guide</span>
            </button>

            {analysisResult && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-700 shadow-sm transition-all group"
              >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>Reset Portfolio</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-8">
        {/* ERROR TOAST */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50/80 dark:bg-rose-900/30 backdrop-blur-sm border border-rose-200 dark:border-rose-700 rounded-2xl text-rose-700 dark:text-rose-300 text-sm font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT: HOLDINGS & ACTION AREA */}
          <div className="col-span-12 xl:col-span-5 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
            {/* If no analysis yet, we center this more. If analysis exists, it moves left. */}
            <HoldingsList
              holdings={currentHoldings}
              initialHoldings={initialHoldings}
              // Interactivity
              onInitiateSwap={handleInitiateSwap}
              selectedStock={selectedStock}
              onCancelSelection={() => setSelectedStock(null)}
              // Simulation Form Props
              onConfirmSimulation={handleSimulate}
            />
          </div>

          {/* RIGHT: ANALYSIS DASHBOARD */}
          <div className="col-span-12 xl:col-span-7 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]" ref={analysisRef}>
            {loading ? (
              <div className="min-h-[500px] flex flex-col items-center justify-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-3xl rounded-[32px] border border-white/60 dark:border-slate-700/60 shadow-2xl">
                <CandleLoader />
                <p className="mt-10 text-slate-500 dark:text-slate-400 font-bold tracking-wide animate-pulse">
                  Running Monte Carlo Simulations...
                </p>
              </div>
            ) : analysisResult ? (
              <WhatIfAnalysis
                result={analysisResult}
                initialHoldings={initialHoldings}
              />
            ) : (
              <div className="min-h-[500px] flex flex-col items-center justify-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-3xl rounded-[32px] border border-white/60 dark:border-slate-700/60 shadow-2xl p-12 text-center">
                <div className="mb-6 p-6 bg-indigo-50 dark:bg-indigo-900/40 rounded-full">
                  <Zap className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                  Ready to Simulate
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
                  Select a stock from your holdings to explore AI-powered swap
                  scenarios and see how changes would impact your portfolio
                  metrics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* HIERARCHY / PEER SELECTOR MODAL */}
      {isHierarchyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
          <div
            className="absolute inset-0 bg-slate-900/30 dark:bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsHierarchyOpen(false)}
          />
          <div className="relative bg-white/80 dark:bg-slate-800/90 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/60 dark:border-slate-700/60 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-indigo-50 dark:border-slate-700 flex flex-col bg-white/40 dark:bg-slate-800/40">
              {/* Header with Search */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {viewMode === "SECTORS" ? "Select Sector" : "Select Asset"}
                </h2>
                <button
                  onClick={() => setIsHierarchyOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder={
                    viewMode === "SECTORS"
                      ? "Search sectors or type a stock name (Enter)..."
                      : "Search industries or stocks..."
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && viewMode === "SECTORS") {
                      handleGlobalSearch();
                    }
                  }}
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {loadingHierarchy ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500 animate-pulse">
                    Loading market structure...
                  </p>
                </div>
              ) : viewMode === "SECTORS" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allSectors
                    .filter((sec) =>
                      sec.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((sec) => (
                      <button
                        key={sec}
                        onClick={() => handleSectorSelect(sec)}
                        className="p-6 text-left bg-white/60 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg hover:shadow-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all group text-slate-800 dark:text-slate-100"
                      >
                        <span className="text-base font-bold group-hover:scale-105 block transition-transform">
                          {sec}
                        </span>
                      </button>
                    ))}
                </div>
              ) : hierarchyData ? (
                <div className="space-y-6">
                  {/* Breadcrumb / Sector switcher */}
                  <div className="flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-900/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg uppercase tracking-wide">
                        {hierarchyData.sector}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-bold">
                        Sector Analysis
                      </span>
                    </div>
                    <button
                      onClick={fetchAllSectors}
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline decoration-2 underline-offset-4"
                    >
                      Change Sector
                    </button>
                  </div>

                  {/* Industry List with Search Filter */}
                  <div className="space-y-4">
                    {Object.keys(
                      hierarchyData.peers_by_sector?.[hierarchyData.sector] ||
                      {}
                    )
                      .filter((ind) => {
                        if (!searchTerm) return true;
                        const term = searchTerm.toLowerCase();
                        // Match Industry Name
                        if (ind.toLowerCase().includes(term)) return true;
                        // Match any stock in the industry
                        const stocks =
                          hierarchyData?.peers_by_sector?.[
                          hierarchyData.sector
                          ]?.[ind] || [];
                        return stocks.some(
                          (s) =>
                            (s.symbol &&
                              s.symbol.toLowerCase().includes(term)) ||
                            (s.name && s.name.toLowerCase().includes(term))
                        );
                      })
                      .map((ind) => {
                        // Check if we should auto-expand (if search term matches stocks in this industry)
                        const stocks =
                          hierarchyData?.peers_by_sector?.[
                          hierarchyData.sector
                          ]?.[ind] || [];
                        const hasStockMatch =
                          searchTerm &&
                          stocks.some(
                            (s) =>
                              (s.symbol &&
                                s.symbol
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())) ||
                              (s.name &&
                                s.name
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()))
                          );

                        // If searching, force expand if stock matches. Otherwise respect manual selection.
                        // If term matches Industry name only, we don't necessarily force expand, but we could.
                        const isExpanded = searchTerm
                          ? hasStockMatch
                          : selectedIndustry === ind;

                        return (
                          <div
                            key={ind}
                            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                          >
                            <button
                              onClick={() =>
                                setSelectedIndustry(
                                  selectedIndustry === ind ? null : ind
                                )
                              }
                              className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                              <span
                                className={`font-bold text-base ${isExpanded
                                  ? "text-indigo-600 dark:text-indigo-400"
                                  : "text-slate-700 dark:text-slate-200"
                                  }`}
                              >
                                {ind}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full">
                                  {stocks.length}
                                </span>
                                <Zap
                                  className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""
                                    }`}
                                />
                              </div>
                            </button>

                            {/* Expanded Industry Stocks */}
                            {isExpanded && (
                              <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 p-4 grid gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {stocks
                                  .filter(
                                    (peer) =>
                                      !searchTerm ||
                                      (peer.symbol &&
                                        peer.symbol
                                          .toLowerCase()
                                          .includes(
                                            searchTerm.toLowerCase()
                                          )) ||
                                      (peer.name &&
                                        peer.name
                                          .toLowerCase()
                                          .includes(searchTerm.toLowerCase()))
                                  )
                                  .map((peer) => (
                                    <button
                                      key={peer.symbol}
                                      onClick={() => handleTargetSelect(peer)}
                                      className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group text-left"
                                    >
                                      <div>
                                        <div className="font-bold text-slate-800 dark:text-slate-100 text-base group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                                          {peer.symbol}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[240px] mt-0.5">
                                          {peer.name}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                                          ₹{peer.current_price}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 dark:text-slate-500">
                  <p className="text-lg font-medium">
                    No hierarchy data found.
                  </p>
                  <button
                    onClick={fetchAllSectors}
                    className="text-indigo-500 dark:text-indigo-400 text-base font-bold mt-4 hover:underline"
                  >
                    Browse All Sectors
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GUIDE MODAL */}
      {showGuide && <HowToUseGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
};

export default WhatIfDashboard;
