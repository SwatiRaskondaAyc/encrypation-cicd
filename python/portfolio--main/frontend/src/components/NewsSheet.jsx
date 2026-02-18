import React, { useState, useMemo, useEffect, useRef } from 'react';
import NewsCard from './NewsCard';
import { Calendar, X, Loader2 } from 'lucide-react';

const parsePublishedDate = (d) => {
  if (!d) return 0;
  const tryParse = Date.parse(d);
  if (!isNaN(tryParse)) return tryParse;
  try {
    const parts = d.split(' ');
    if (parts.length === 3) {
      return Date.parse(`${parts[1]} ${parts[0]} ${parts[2]}`);
    }
  } catch (e) {}
  return 0;
};

const NewsSheet = ({ newsData, onDateSelect }) => {
  const [dateFilter, setDateFilter] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  
  // REF for the hidden date input
  const dateInputRef = useRef(null);

  const availableSymbols = useMemo(() => {
    if (!newsData || !newsData.articles) return [];
    const set = new Set();
    newsData.articles.forEach((a) => {
      (a.matched_symbols || []).forEach((m) => set.add(m.symbol));
    });
    return Array.from(set).sort();
  }, [newsData]);

  useEffect(() => {
    if (availableSymbols.length > 0) {
      setSelectedSymbols(availableSymbols.slice());
    } else {
      setSelectedSymbols([]);
    }
  }, [availableSymbols.length]);

  // --- DATE LOGIC ---
  const handleDateChange = (e) => {
    const val = e.target.value;
    setDateFilter(val);

    if (onDateSelect) {
      setLocalLoading(true);
      const result = onDateSelect(val || null);
      if (result && typeof result.then === 'function') {
          result.finally(() => setTimeout(() => setLocalLoading(false), 500));
      } else {
          setTimeout(() => setLocalLoading(false), 2000);
      }
    }
  };

  const clearDate = (e) => {
    e.stopPropagation(); // Prevent clicking the parent container
    setDateFilter('');
    if (onDateSelect) {
      setLocalLoading(true);
      const result = onDateSelect(null);
      if (result && typeof result.then === 'function') {
          result.finally(() => setTimeout(() => setLocalLoading(false), 500));
      } else {
          setTimeout(() => setLocalLoading(false), 2000);
      }
    }
  };

  // FAIL-SAFE TRIGGER: Click the hidden input programmatically
  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      if (dateInputRef.current.showPicker) {
        dateInputRef.current.showPicker(); // Modern browsers
      } else {
        dateInputRef.current.click(); // Older fallback
      }
    }
  };

  const toggleSymbol = (sym) => {
    if (!sym) return;
    setSelectedSymbols((prev) => {
      if (!prev || prev.length === 0) return [sym];
      const idx = prev.indexOf(sym);
      if (idx === -1) return [...prev, sym];
      else {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
    });
  };

  const setAllSymbols = () => {
    setSelectedSymbols(availableSymbols.slice());
  };

  const sortedFilteredArticles = useMemo(() => {
    if (!newsData || !newsData.articles) return [];
    let articles = newsData.articles.slice();

    if (selectedSymbols && selectedSymbols.length > 0) {
      articles = articles.filter((a) => {
        const syms = (a.matched_symbols || []).map((m) => m.symbol);
        return syms.some((s) => selectedSymbols.includes(s));
      });
    }

    articles.sort((a, b) => {
      const da = parsePublishedDate(a.published_date || a.date || '');
      const db = parsePublishedDate(b.published_date || b.date || '');
      return db - da;
    });

    return articles;
  }, [newsData, selectedSymbols]);

  if (!newsData) {
    return <div className="text-sm text-slate-500">No news loaded yet.</div>;
  }

  return (
    <div className="relative min-h-[400px] space-y-6">
      
      {/* LOADING OVERLAY */}
      {localLoading && (
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl transition-opacity duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
              <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">Fetching Market News...</span>
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">News Feed</h2>
              <p className="text-xs text-slate-500 mt-1">
                {dateFilter ? `Showing stories for ${dateFilter}` : 'Latest updates'}
              </p>
            </div>

            <div className="flex items-center gap-3">
                {/* DATE PICKER BUTTON (Clicking this triggers the hidden input) */}
                <button 
                    onClick={triggerDatePicker}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all active:scale-95 ${
                        dateFilter 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <Calendar className="w-4 h-4 pointer-events-none" />
                    <span className="pointer-events-none">{dateFilter || "Select Date"}</span>
                    
                    {/* Clear Button - Inside button but stops propagation */}
                    {dateFilter && (
                        <div
                            onClick={clearDate}
                            className="ml-1 p-0.5 hover:bg-red-100 rounded-full text-slate-400 hover:text-red-500 cursor-pointer z-20"
                        >
                            <X className="w-3 h-3" />
                        </div>
                    )}
                </button>

                {/* 
                   HIDDEN INPUT: 
                   - Visibility: hidden (so it doesn't mess up layout)
                   - Position: absolute (out of flow)
                   - We trigger it via ref.current.showPicker() or .click()
                */}
                <input
                    ref={dateInputRef}
                    type="date"
                    value={dateFilter}
                    onChange={handleDateChange}
                    className="absolute opacity-0 w-0 h-0 pointer-events-none"
                    tabIndex={-1}
                />
            </div>
        </div>

        {/* Symbol Filter Chips */}
        {availableSymbols.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
            <button
                type="button"
                onClick={setAllSymbols}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                selectedSymbols.length === availableSymbols.length
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
            >
                ALL
            </button>
            {availableSymbols.map((sym) => {
                const active = selectedSymbols.includes(sym);
                return (
                <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymbol(sym)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                    active
                        ? 'bg-amber-100 text-amber-900 border-amber-200'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {sym}
                </button>
                );
            })}
            </div>
        )}
      </div>

      {/* Cards Grid */}
      {sortedFilteredArticles.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          No news found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFilteredArticles.map((article, idx) => (
            <NewsCard key={article.id || idx} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSheet;
