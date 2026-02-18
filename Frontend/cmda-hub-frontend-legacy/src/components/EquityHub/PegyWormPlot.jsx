import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";
import RatingSystem from "../RatingFile/RatingSystem";
import { generatePlot } from "../../services/mtmApi";

/**
 * PegyWormPlot
 * ----------------
 * Props:
 *  - symbol (string) required
 *  - apiBase (string) optional, defaults to VITE_URL or window.location.origin + '/api'
 *  - cacheTTL (number) optional in ms (default 1h)
 *
 * This component expects the backend JSON shape produced by create_pegy_worm_payload:
 * {
 *   scatter_data: [...],
 *   layout: {...},
 *   comment: "...",
 *   config: {...}
 * }
 *
 * The component sanitizes arrays and numeric types that may arrive as strings
 * (e.g. "[1,2,3]" or "1.234") so Plotly receives native JS arrays/scalars.
 */

const PegyWormPlot = ({ symbol, apiBase, cacheTTL = 1000 * 60 * 60 }) => {
  const [plotData, setPlotData] = useState([]);
  const [layout, setLayout] = useState({});
  const [config, setConfig] = useState({});
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE =
    apiBase || import.meta.env.VITE_URL || `${window.location.origin}`;

  // Local cache helpers
  const getCached = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.timestamp) return null;
      if (Date.now() - parsed.timestamp > cacheTTL) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch (e) {
      console.warn("PegyWormPlot: failed reading cache", e);
      return null;
    }
  };
  const setCached = (key, data) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ data, timestamp: Date.now() }),
      );
    } catch (e) {
      console.warn("PegyWormPlot: failed saving cache", e);
    }
  };

  // Utilities to coerce values into native JS types
  function tryParseJSONOrArray(val) {
    if (val === null || val === undefined) return val;

    // Already array
    if (Array.isArray(val)) return val;

    // Numbers / booleans
    if (typeof val === "number" || typeof val === "boolean") return val;

    if (typeof val === "string") {
      const s = val.trim();

      // ✅ Detect dd-mm-yyyy format
      const dateMatch = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (dateMatch) {
        const [_, dd, mm, yyyy] = dateMatch;
        return `${yyyy}-${mm}-${dd}`; // convert to ISO
      }

      // Looks like JSON (array/object)
      if (
        (s.startsWith("[") && s.endsWith("]")) ||
        (s.startsWith("{") && s.endsWith("}"))
      ) {
        try {
          const parsed = JSON.parse(s);
          return parsed;
        } catch (e) {
          // ignore parse error, fallback below
        }
      }

      // Comma-separated values like "01-10-2025,02-10-2025" or "1,2,3"
      if (s.indexOf(",") !== -1 && s.match(/[0-9\-T:\.]/)) {
        const parts = s
          .replace(/^[\[\]]+|[\[\]]+$/g, "")
          .split(",")
          .map((p) => p.trim());
        return parts.map((p) => {
          // number check
          const n = Number(p);
          if (!Number.isNaN(n)) return n;

          // ✅ Check for dd-mm-yyyy inside array
          const dm = p.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (dm) return `${dm[3]}-${dm[2]}-${dm[1]}`;

          return p;
        });
      }

      // Try to parse number
      const n = Number(s);
      if (!Number.isNaN(n)) return n;

      return s; // return as string if nothing else works
    }

    return val;
  }

  function sanitizeTrace(trace) {
    // shallow clone
    const t = { ...trace };
    // x/y arrays
    if (t.x !== undefined) t.x = tryParseJSONOrArray(t.x);
    if (t.y !== undefined) t.y = tryParseJSONOrArray(t.y);
    if (t.z !== undefined) t.z = tryParseJSONOrArray(t.z);

    // customdata may be array of arrays
    if (t.customdata !== undefined) {
      const cd = tryParseJSONOrArray(t.customdata);
      if (Array.isArray(cd)) {
        t.customdata = cd.map((row) => {
          if (Array.isArray(row)) return row.map((v) => tryParseJSONOrArray(v));
          return tryParseJSONOrArray(row);
        });
      } else {
        t.customdata = cd;
      }
    }

    // marker
    if (t.marker) {
      const mk = { ...t.marker };
      if (mk.size !== undefined) mk.size = tryParseJSONOrArray(mk.size);
      if (mk.color !== undefined) mk.color = tryParseJSONOrArray(mk.color);
      // marker.color might be array of colors or single string; leave as-is if string
      t.marker = mk;
    }

    // line, text, hovertext
    if (t.text !== undefined) t.text = tryParseJSONOrArray(t.text);
    if (t.hovertext !== undefined)
      t.hovertext = tryParseJSONOrArray(t.hovertext);

    return t;
  }

  function sanitizePayload(payload) {
    if (!payload) return null;
    const { scatter_data, layout: l, comment: c, config: cfg } = payload;
    const sanitizedData = Array.isArray(scatter_data)
      ? scatter_data.map((tr) => sanitizeTrace(tr))
      : [];

    // Layout often contains nested objects; we only need to ensure dates and arrays inside are fine.
    // We'll do a minimal pass to convert arrays encoded as strings to JS arrays in layout annotations/axis ticks
    const sanitizedLayout = JSON.parse(JSON.stringify(l || {}));

    // quick sanitizer for layout attributes that may be strings representing arrays
    const layoutStrFields = [
      "xaxis",
      "yaxis",
      "shapes",
      "annotations",
      "updatemenus",
      "title",
    ];
    layoutStrFields.forEach((k) => {
      try {
        if (sanitizedLayout[k] && typeof sanitizedLayout[k] === "string") {
          sanitizedLayout[k] = tryParseJSONOrArray(sanitizedLayout[k]);
        }
      } catch (e) {
        /* ignore */
      }
    });

    return {
      scatter_data: sanitizedData,
      layout: sanitizedLayout,
      comment: c || "",
      config: cfg || {},
    };
  }

  const handleRatingUpdate = (newRating) => {
    console.log("Pegy worm plot rating updated:", newRating);
  };

  useEffect(() => {
    if (!symbol) return;
    const cacheKey = `pegy_worm_${symbol}`;
    const cached = getCached(cacheKey);
    if (cached) {
      const payload = sanitizePayload(cached);
      if (!payload) {
        setError("Invalid cached payload");
        setLoading(false);
        return;
      }
      setPlotData(payload.scatter_data);
      setLayout(payload.layout);
      setConfig(payload.config);
      setComment(payload.comment);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Use MTM API service
    generatePlot(symbol, "pegy")
      .then((wrapper) => {
        // Your API wraps payload in success_response; try to find the inner payload
        const payload = wrapper?.data || wrapper;
        if (!payload || (!payload.scatter_data && !payload.layout)) {
          throw new Error("Invalid payload from server");
        }
        const sanitized = sanitizePayload(payload);
        setPlotData(sanitized.scatter_data);
        setLayout(sanitized.layout);
        setConfig(sanitized.config);
        setComment(sanitized.comment);
        setCached(cacheKey, payload);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("PegyWormPlot fetch error:", err);
        setError(err.message || "Failed to load plot");
        setLoading(false);
      });
  }, [symbol, API_BASE, cacheTTL]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          CMDA...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="w-full">
      {/* Reusable Rating Component */}
      <div className="flex items-center justify-end pb-4 border-b border-gray-200">
        <div className="text-right">
          {/* <p className="text-sm font-medium text-gray-700 mb-2"></p> */}
          <RatingSystem plotType="pegy" onRatingUpdate={handleRatingUpdate} />
        </div>
      </div>
      <Plot
        data={plotData}
        layout={{ ...layout, autosize: true }}
        config={config}
        useResizeHandler={true}
        style={{ width: "100%", height: layout?.height || 600 }}
      />
      {comment && (
        <div className="mt-4">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-3 border border-indigo-200 dark:border-gray-700 shadow-md transition-all duration-300 hover:bg-opacity-90">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                Note:
              </span>{" "}
              {comment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PegyWormPlot;

// import React, { useEffect, useState, useCallback } from "react";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";
// import PropTypes from "prop-types";

// /**
//  * PegyWormPlot
//  * ----------------
//  * Props:
//  *  - symbol (string) required: The stock symbol to fetch PEGY data for.
//  *  - apiBase (string) optional: Base URL for the API (defaults to VITE_URL or window.location.origin + '/api').
//  *  - cacheTTL (number) optional: Cache time-to-live in ms (default 1 hour).
//  *  - disableCache (bool) optional: If true, disables localStorage caching.
//  *
//  * This component fetches PEGY data from the backend and renders a Plotly plot.
//  * It expects the backend JSON shape: { scatter_data: [...], layout: {...}, comment: "...", config: {...} }
//  *
//  * Data is sanitized recursively to convert string-encoded arrays/numbers to native JS types for Plotly.
//  */

// const PegyWormPlot = ({ symbol, apiBase, cacheTTL = 1000 * 60 * 60, disableCache = false }) => {
//   const [plotData, setPlotData] = useState([]);
//   const [layout, setLayout] = useState({});
//   const [config, setConfig] = useState({});
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_BASE = apiBase || import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // Recursive sanitizer to convert string-encoded arrays/numbers/objects to native types
//   const deepSanitize = useCallback((value) => {
//     if (value === null || value === undefined) return value;
//     if (Array.isArray(value)) return value.map(deepSanitize);
//     if (typeof value === "object") {
//       const sanitizedObj = {};
//       for (const key in value) {
//         sanitizedObj[key] = deepSanitize(value[key]);
//       }
//       return sanitizedObj;
//     }
//     if (typeof value === "string") {
//       const trimmed = value.trim();
//       // Try parsing as JSON (array/object)
//       try {
//         const parsed = JSON.parse(trimmed);
//         return deepSanitize(parsed); // Recurse into parsed structure
//       } catch {
//         // Not JSON; try as number
//         const num = Number(trimmed);
//         if (!Number.isNaN(num)) return num;
//         // Comma-separated string to array (fallback)
//         if (trimmed.includes(",")) {
//           const parts = trimmed.split(",").map((p) => p.trim());
//           const nums = parts.map(Number).filter((n) => !Number.isNaN(n));
//           if (nums.length === parts.length) return nums;
//         }
//       }
//     }
//     return value;
//   }, []);

//   // Local cache helpers
//   const getCached = useCallback(
//     (key) => {
//       if (disableCache) return null;
//       try {
//         const raw = localStorage.getItem(key);
//         if (!raw) return null;
//         const { data, timestamp } = JSON.parse(raw);
//         if (Date.now() - timestamp > cacheTTL) {
//           localStorage.removeItem(key);
//           return null;
//         }
//         return data;
//       } catch (e) {
//         console.warn("PegyWormPlot: failed reading cache", e);
//         return null;
//       }
//     },
//     [cacheTTL, disableCache]
//   );

//   const setCached = useCallback(
//     (key, data) => {
//       if (disableCache) return;
//       try {
//         localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//       } catch (e) {
//         console.warn("PegyWormPlot: failed saving cache", e);
//       }
//     },
//     [disableCache]
//   );

//   // Fetch and process data
//   const fetchData = useCallback(() => {
//     setLoading(true);
//     setError(null);

//     const controller = new AbortController();
//     fetch(`${API_BASE}/stocks/test/pegy`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
//       },
//       body: JSON.stringify({ symbol }),
//       signal: controller.signal,
//     })
//       .then(async (res) => {
//         if (!res.ok) {
//           const txt = await res.text();
//           throw new Error(`${res.status} ${res.statusText} - ${txt}`);
//         }
//         return res.json();
//       })
//       .then((response) => {
//         // Unwrap if nested under 'data'
//         const payload = response?.data || response;
//         if (!payload || !payload.scatter_data || !payload.layout) {
//           throw new Error("Invalid payload from server");
//         }
//         const sanitized = deepSanitize(payload);
//         setPlotData(sanitized.scatter_data || []);
//         setLayout(sanitized.layout || {});
//         setConfig(sanitized.config || {});
//         setComment(sanitized.comment || "");
//         setCached(`pegy_worm_${symbol}`, payload); // Cache original payload
//         setLoading(false);
//       })
//       .catch((err) => {
//         if (err.name !== "AbortError") {
//           console.error("PegyWormPlot fetch error:", err);
//           setError(err.message || "Failed to load plot");
//           setLoading(false);
//         }
//       });

//     return () => controller.abort();
//   }, [symbol, API_BASE, deepSanitize, setCached]);

//   useEffect(() => {
//     if (!symbol) {
//       setError("No symbol provided");
//       setLoading(false);
//       return;
//     }

//     const cacheKey = `pegy_worm_${symbol}`;
//     const cached = getCached(cacheKey);
//     if (cached) {
//       const sanitized = deepSanitize(cached);
//       if (sanitized && sanitized.scatter_data && sanitized.layout) {
//         setPlotData(sanitized.scatter_data);
//         setLayout(sanitized.layout);
//         setConfig(sanitized.config || {});
//         setComment(sanitized.comment || "");
//         setLoading(false);
//         setError(null);
//         return;
//       } else {
//         console.warn("PegyWormPlot: Invalid cached data, fetching fresh");
//       }
//     }

//     return fetchData();
//   }, [symbol, fetchData, getCached]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[520px] w-full bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//         <HashLoader color="#0369a1" size={60} />
//         <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//           Loading PEGY Worm Plot...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[520px] w-full p-4 text-center">
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={fetchData}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-[720px] max-w-7xl mx-auto p-4">
//       <div className="bg-white dark:bg-gray-800 transition-all duration-300l">
//         <Plot
//           data={plotData}
//           layout={{ ...layout, autosize: true }}
//           config={{ ...config, responsive: true, displayModeBar: false }} // Hide default Plotly toolbar for cleaner look
//           useResizeHandler={true}
//           style={{
//             width: "100%",
//             height: layout?.height || "520px",
//             backgroundColor: "transparent", // Ensure plot background matches container
//           }}
//           className="p-4" // Add padding inside the plot area
//         />
//       </div>
//       {comment && (
//         <div className="mt-4">
//           <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-3 border border-indigo-200 dark:border-gray-700 shadow-md transition-all duration-300 hover:bg-opacity-90">
//             <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
//               <span className="font-bold text-indigo-600 dark:text-indigo-400">Note:</span>{" "}
//               {comment}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// PegyWormPlot.propTypes = {
//   symbol: PropTypes.string.isRequired,
//   apiBase: PropTypes.string,
//   cacheTTL: PropTypes.number,
//   disableCache: PropTypes.bool,
// };

// export default PegyWormPlot;
