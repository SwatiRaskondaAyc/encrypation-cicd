import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";
import { equityInsightsApi } from "../../services/equityInsightsApi";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getQuarter = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor(d.getMonth() / 3) + 1;
};

const getYear = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.getFullYear();
};

const SectionList = ({ items }) => (
  <div className="space-y-3">
    {items.length === 0 ? (
      <div className="text-sm text-slate-400 font-semibold">
        No announcements available
      </div>
    ) : (
      items.map((item) => (
        <div
          key={item.key}
          className="p-3 rounded-xl bg-slate-50 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-slate-800">
              {item.title}
            </div>
            <div className="text-xs font-bold text-slate-500">
              {formatDate(item.date)}
            </div>
          </div>
          {item.subtitle && (
            <div className="text-xs text-slate-500 mt-1">
              {item.subtitle}
            </div>
          )}
          {item.meta?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
              {item.meta.map((meta) => (
                <span
                  key={meta}
                  className="px-2 py-1 rounded-full bg-white border border-slate-200"
                >
                  {meta}
                </span>
              ))}
            </div>
          )}
          {item.pdf && (
            <div className="mt-2">
              <a
                href={item.pdf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <FileText className="w-4 h-4" /> PDF
              </a>
            </div>
          )}
        </div>
      ))
    )}
  </div>
);

const AnnouncementsPanel = ({ fincode }) => {
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState({
    dividends: [],
    splits: [],
    earnings: [],
  });
  const [activeTab, setActiveTab] = useState("dividends");
  const [filterYear, setFilterYear] = useState("all");
  const [filterQuarter, setFilterQuarter] = useState("all");

  useEffect(() => {
    if (!fincode) return;
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await equityInsightsApi.getCorporateAnnouncements(fincode);
        if (!isMounted) return;
        setAnnouncements({
          dividends: data.dividends || [],
          splits: data.splits || [],
          earnings: data.earnings || [],
        });
      } catch (err) {
        console.error("Announcements fetch error:", err);
        if (isMounted) {
          setAnnouncements({ dividends: [], splits: [], earnings: [] });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, [fincode]);

  const { dividendItems, splitItems, boardItems, resultItems, years } = useMemo(() => {
    const mapDividends = (arr) =>
      arr
        .map((item) => ({
          key: `div-${item.Ex_date}-${item.Announcement_text}`,
          title: item.Purpose || item.Announcement_text || "Dividend",
          subtitle: item.Dividend_Amount
            ? `Amount: ${item.Dividend_Amount}`
            : null,
          date: item.Ex_date || item.Announcement_Date,
          meta: [
            item.Ex_date ? `Ex: ${formatDate(item.Ex_date)}` : null,
            item.Rd_Date ? `RD: ${formatDate(item.Rd_Date)}` : null,
            item.Announcement_Date
              ? `Ann: ${formatDate(item.Announcement_Date)}`
              : null,
          ].filter(Boolean),
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const mapSplits = (arr) =>
      arr
        .map((item) => ({
          key: `split-${item.Ex_date}-${item.Ratio}`,
          title: item.Purpose || item.Announcement_text || "Stock Split",
          subtitle: item.Ratio ? `Ratio: ${item.Ratio}` : null,
          date: item.Ex_date || item.Announcement_Date,
          meta: [
            item.Ex_date ? `Ex: ${formatDate(item.Ex_date)}` : null,
            item.Rd_Date ? `RD: ${formatDate(item.Rd_Date)}` : null,
            item.Announcement_Date
              ? `Ann: ${formatDate(item.Announcement_Date)}`
              : null,
          ].filter(Boolean),
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const board = [];
    const results = [];
    (announcements.earnings || []).forEach((item) => {
      const headline = item.Headline || "Announcement";
      const isBoard =
        headline.toLowerCase().includes("board meeting") ||
        headline.toLowerCase().includes("intimation") ||
        headline.toLowerCase().includes("outcome");
      const isResult = headline.toLowerCase().includes("results");
      const base = {
        key: `${item.Date}-${headline}`,
        title: headline,
        subtitle: item.PDF_URL ? "PDF available" : null,
        date: item.Date,
        pdf: item.PDF_URL || null,
      };
      if (isBoard) board.push(base);
      else if (isResult) results.push(base);
      else results.push(base);
    });

    const allItems = [
      ...mapDividends(announcements.dividends || []),
      ...mapSplits(announcements.splits || []),
      ...board,
      ...results,
    ];
    const yearSet = new Set(
      allItems
        .map((item) => getYear(item.date))
        .filter((year) => year)
    );

    return {
      dividendItems: mapDividends(announcements.dividends || []),
      splitItems: mapSplits(announcements.splits || []),
      boardItems: board.sort((a, b) => new Date(b.date) - new Date(a.date)),
      resultItems: results.sort((a, b) => new Date(b.date) - new Date(a.date)),
      years: Array.from(yearSet).sort((a, b) => b - a),
    };
  }, [announcements]);

  const applyFilters = (items) => {
    return items.filter((item) => {
      const year = getYear(item.date);
      const quarter = getQuarter(item.date);
      const yearOk = filterYear === "all" || year === Number(filterYear);
      const quarterOk =
        filterQuarter === "all" || quarter === Number(filterQuarter);
      return yearOk && quarterOk;
    });
  };

  const filtered = useMemo(() => {
    return {
      dividends: applyFilters(dividendItems),
      splits: applyFilters(splitItems),
      boards: applyFilters(boardItems),
      results: applyFilters(resultItems),
    };
  }, [dividendItems, splitItems, boardItems, resultItems, filterYear, filterQuarter]);

  if (!fincode) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-sm text-slate-500">
        Select a stock with fincode to view announcements.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-12 bg-slate-100 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-2 py-1 shadow-sm">
          {[
            { id: "dividends", label: "Dividends" },
            { id: "splits", label: "Splits" },
            { id: "boards", label: "Board Meetings" },
            { id: "results", label: "Financial Results" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-blue-600"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>FY</span>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border border-slate-200 rounded-md px-2 py-1 text-xs"
          >
            <option value="all">All</option>
            {years.map((year) => (
              <option key={year} value={year}>
                FY {year}
              </option>
            ))}
          </select>
          <span>Q</span>
          <select
            value={filterQuarter}
            onChange={(e) => setFilterQuarter(e.target.value)}
            className="border border-slate-200 rounded-md px-2 py-1 text-xs"
          >
            <option value="all">All</option>
            <option value="1">Q1</option>
            <option value="2">Q2</option>
            <option value="3">Q3</option>
            <option value="4">Q4</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "dividends" && <SectionList items={filtered.dividends} />}
          {activeTab === "splits" && <SectionList items={filtered.splits} />}
          {activeTab === "boards" && <SectionList items={filtered.boards} />}
          {activeTab === "results" && <SectionList items={filtered.results} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementsPanel;
