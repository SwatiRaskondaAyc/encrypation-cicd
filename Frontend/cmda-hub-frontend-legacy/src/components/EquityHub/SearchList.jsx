// -----------------------SEARCH LIST COMPONENT (SWati code)-----------------------

// import React from "react";
// import { X } from "lucide-react";

// const SearchList = ({ results, query, onSelectItem, onClear }) => {
//   const highlightText = (text, query) => {
//     if (!query) return text;
//     const regex = new RegExp(`(${query})`, "gi");
//     return text.split(regex).map((part, index) =>
//       part.toLowerCase() === query.toLowerCase() ? (
//         <span key={index} className="text-cyan-500 font-bold">
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   const handleClearClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation(); // Prevent bubbling to parent
//     if (onClear) onClear();
//   };

//   const handleItemClick = (item, e) => {
//     e.preventDefault();
//     e.stopPropagation(); // Prevent bubbling to clear button
//     if (onSelectItem) onSelectItem(item);
//   };

//   return (
//     <div className="bg-white border">
//       {results.length > 0 && (
//         <div className="dark:bg-slate-800 dark:text-white relative w-full border-gray-300 rounded-md shadow-lg z-50">
//           {/* Close Button */}
//           <button
//             onClick={handleClearClick}
//             className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//             style={{ zIndex: 60 }} // Ensure it’s above list items
//           >
//             <X size={20} />
//           </button>

//           <ul className="pt-8 pb-2"> {/* Increased padding to avoid overlap */}
//             {results.slice(0, 5).map((result, index) => (
//               <li
//                 key={index}
//                 onClick={(e) => handleItemClick(result, e)}
//                 className="px-6 py-2 text-black hover:bg-gray-200 cursor-pointer dark:bg-slate-800 dark:text-white relative"
//                 style={{ pointerEvents: 'auto', zIndex: 51 }} // Ensure clickable
//               >
//                 {highlightText(result.symbol, query)}
//                 <br />
//                 <span>{result.companyName}</span>
//                 <br />
//                 <span>{result.basicIndustry}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchList;

// -----------------------SEARCH LIST COMPONENT (vedant code)-----------------------

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Filter,
  ChevronRight,
  ChevronDown,
  X,
  Search,
  XCircle,
} from "lucide-react";
import { equityInsightsApi } from "../../services/equityInsightsApi";

function SearchList({ onSelect }) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter State
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState("House");
  const [selectedHouses, setSelectedHouses] = useState(new Set());
  const [selectedSectors, setSelectedSectors] = useState(new Set());
  const [selectedIndustries, setSelectedIndustries] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 0]); // Initialize with 0
  const [expandedSectors, setExpandedSectors] = useState(new Set());
  const [houseSearch, setHouseSearch] = useState(""); // New state for house search

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Correct API Config - Now using centralized API service

  // Derived Data for Filters
  const { uniqueHouses, sectorMap, maxPrice } = useMemo(() => {
    const houses = new Map();
    const sectors = new Map();
    let maxP = 0;

    companies.forEach((c) => {
      if (c.houseCode && c.house) houses.set(c.houseCode, c.house);

      if (c.sectorCode && c.sector) {
        if (!sectors.has(c.sectorCode)) {
          sectors.set(c.sectorCode, { label: c.sector, industries: new Map() });
        }
        if (c.indCode && c.industry) {
          sectors.get(c.sectorCode).industries.set(c.indCode, c.industry);
        }
      }

      if (c.price && c.price > maxP) maxP = c.price;
    });

    return {
      uniqueHouses: Array.from(houses.entries())
        .map(([code, label]) => ({ code, label }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      sectorMap: sectors,
      maxPrice: maxP > 0 ? maxP : 100000, // Fallback if no data
    };
  }, [companies]);

  // Initialize price range once data is loaded
  useEffect(() => {
    if (maxPrice > 0 && (priceRange[1] === 0 || priceRange[1] === 100000)) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  // Filter companies dynamically
  const filteredResults = useMemo(() => {
    const s = search.toLowerCase().trim();

    const results = companies.filter((c) => {
      // 1. Search Text
      const matchesSearch =
        !s ||
        c.symbol.toLowerCase().includes(s) ||
        c.companyName.toLowerCase().includes(s);
      if (!matchesSearch) return false;

      // 2. House Filter
      if (selectedHouses.size > 0 && !selectedHouses.has(c.houseCode))
        return false;

      // 3. Sector/Industry Filter
      if (selectedSectors.size > 0 || selectedIndustries.size > 0) {
        const inSector = selectedSectors.has(c.sectorCode);
        const inIndustry = selectedIndustries.has(c.indCode);
        if (!inSector && !inIndustry) return false;
      }

      // 4. Price Filter
      const p = c.price || 0;
      if (p < priceRange[0] || p > priceRange[1]) return false;

      return true;
    });

    // Sort by relevance
    if (!s) return results;

    return results.sort((a, b) => {
      const symA = a.symbol.toLowerCase();
      const symB = b.symbol.toLowerCase();
      const nameA = a.companyName.toLowerCase();
      const nameB = b.companyName.toLowerCase();

      // 1. Exact Symbol Match
      if (symA === s && symB !== s) return -1;
      if (symB === s && symA !== s) return 1;

      // 2. Exact Name Match
      if (nameA === s && nameB !== s) return -1;
      if (nameB === s && nameA !== s) return 1;

      // 3. Symbol Starts With
      const startSymA = symA.startsWith(s);
      const startSymB = symB.startsWith(s);
      if (startSymA && !startSymB) return -1;
      if (startSymB && !startSymA) return 1;

      // 4. Name Starts With
      const startNameA = nameA.startsWith(s);
      const startNameB = nameB.startsWith(s);
      if (startNameA && !startNameB) return -1;
      if (startNameB && !startNameA) return 1;

      // 5. Alphabetical
      return symA.localeCompare(symB);
    });
  }, [
    companies,
    search,
    selectedHouses,
    selectedSectors,
    selectedIndustries,
    priceRange,
  ]);

  // ✅ API Integration using centralized service
  const fetchData = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      // Use centralized API service
      const options = await equityInsightsApi.getSearchOptions();

      const rows = options.Symbol.map((symbol, i) => ({
        symbol,
        companyName: options.Company_ShortName[i],
        fincode: options.FINCODE[i],
        equityPA_Flag: options.EquityPA_Flag[i],
        sector: options.Sector[i],
        industry: options.Industry_ShortName[i],
        house: options.House[i],
        // New Fields
        indCode: options.IND_CODE[i],
        sectorCode: options.Sector_code[i],
        houseCode: options.HSE_CODE[i],
        price: options.Price[i],
      }));

      setCompanies(rows);
    } catch (err) {
      setError("Server Error.");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount to populate filters
  useEffect(() => {
    fetchData("");
  }, [fetchData]);

  // Input change handling
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setSelectedIndex(-1);
    setShowDropdown(true);
  };

  // Scroll to selected item
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = document.getElementById(
        `search-result-${selectedIndex}`,
      );
      if (selectedElement) {
        const container = dropdownRef.current;
        const itemTop = selectedElement.offsetTop;
        const itemBottom = itemTop + selectedElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.offsetHeight;

        if (itemTop < containerTop) {
          container.scrollTop = itemTop;
        } else if (itemBottom > containerBottom) {
          container.scrollTop = itemBottom - container.offsetHeight;
        }
      }
    }
  }, [selectedIndex]);

  // Select company
  const handleSelect = (company) => {
    setSearch(`${company.symbol} - ${company.companyName}`);
    setShowDropdown(false);
    setSelectedIndex(-1);

    if (onSelect) {
      onSelect(company);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || filteredResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((p) => (p < filteredResults.length - 1 ? p + 1 : p));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((p) => (p > 0 ? p - 1 : -1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) handleSelect(filteredResults[selectedIndex]);
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        // Move up
        setSelectedIndex((p) => (p > 0 ? p - 1 : -1));
      } else {
        // Move down
        setSelectedIndex((p) => (p < filteredResults.length - 1 ? p + 1 : p));
      }
    }

    if (e.key === "Escape") {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  // Filter Handlers
  const toggleSet = (set, val) => {
    const newSet = new Set(set);
    if (newSet.has(val)) newSet.delete(val);
    else newSet.add(val);
    return newSet;
  };

  const toggleSector = (code) => {
    // If sector is unchecked, uncheck all its industries too?
    // Or just toggle sector. Let's just toggle sector.
    setSelectedSectors((prev) => toggleSet(prev, code));
  };

  const toggleIndustry = (code) => {
    setSelectedIndustries((prev) => toggleSet(prev, code));
  };

  const toggleExpandSector = (code) => {
    setExpandedSectors((prev) => toggleSet(prev, code));
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar + Filter Toggle */}
        {/* <div className="flex gap-2 relative">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search by symbol or company name"
              className="w-full p-3 border rounded-lg pl-10"
            />
            {/* Search Icon placeholder if needed *
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`p-3 rounded-lg border flex items-center gap-2 transition-colors ${showFilter ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Filter size={20} />
            <span>Filter</span>
          </button>


        </div> */}

        <div className="flex gap-3 items-center">
          {/* Search Input with Icon + Clear Button */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <Search size={20} />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search by symbol or company name..."
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 font-medium text-base shadow-sm hover:shadow-md"
            />

            {/* Clear Button - Only shows when there's input */}
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setShowDropdown(true);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 group"
                aria-label="Clear search"
              >
                <XCircle
                  size={20}
                  className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2.5 px-5 py-4 rounded-xl font-medium transition-all duration-300 shadow-sm ${
              showFilter
                ? "bg-cyan-600 text-white ring-2 ring-cyan-500 ring-offset-2"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 hover:shadow-md"
            }`}
          >
            <Filter size={19} />
            <span>Filters</span>
            {/* Optional: Show active filter count badge */}
            {(selectedHouses.size > 0 ||
              selectedSectors.size > 0 ||
              selectedIndustries.size > 0 ||
              priceRange[0] > 0 ||
              priceRange[1] < maxPrice) && (
              <span className="ml-1.5 bg-white text-cyan-600 dark:bg-cyan-500 dark:text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {selectedHouses.size +
                  selectedSectors.size +
                  selectedIndustries.size +
                  (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mt-2 border rounded-lg shadow-lg bg-white overflow-hidden flex h-80">
            {/* Sidebar */}
            <div className="w-1/3 border-r bg-gray-50 p-2 flex flex-col gap-1">
              {["House", "Sector", "Price"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilterCategory(cat)}
                  className={`p-3 text-left rounded-md font-medium transition-colors ${activeFilterCategory === cat ? "bg-white shadow text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {cat}
                </button>
              ))}

              <div className="mt-auto p-2">
                <div className="text-xs text-gray-500 mb-1">
                  Active Filters:
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedHouses.size > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      House ({selectedHouses.size})
                    </span>
                  )}
                  {(selectedSectors.size > 0 ||
                    selectedIndustries.size > 0) && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Sector/Ind
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Price
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowDropdown(true);
                    setShowFilter(false);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 mt-3 shadow-sm"
                >
                  Apply Filters
                </button>

                <button
                  onClick={() => {
                    setSelectedHouses(new Set());
                    setSelectedSectors(new Set());
                    setSelectedIndustries(new Set());
                    setPriceRange([0, maxPrice]);
                  }}
                  className="text-xs text-red-600 hover:underline mt-2 w-full text-center"
                >
                  Reset All
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="w-2/3 flex flex-col">
              {activeFilterCategory === "House" && (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b bg-white z-10">
                    <input
                      type="text"
                      placeholder="Search houses..."
                      value={houseSearch}
                      onChange={(e) => setHouseSearch(e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                      {uniqueHouses
                        .filter((h) =>
                          h.label
                            .toLowerCase()
                            .includes(houseSearch.toLowerCase()),
                        )
                        .map((h) => (
                          <label
                            key={h.code}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={selectedHouses.has(h.code)}
                              onChange={() =>
                                setSelectedHouses((prev) =>
                                  toggleSet(prev, h.code),
                                )
                              }
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {h.label}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {activeFilterCategory === "Sector" && (
                <div className="h-full overflow-y-auto p-4 space-y-2">
                  {Array.from(sectorMap.entries())
                    .sort((a, b) => a[1].label.localeCompare(b[1].label))
                    .map(([code, data]) => (
                      <div
                        key={code}
                        className="border rounded-md overflow-hidden"
                      >
                        <div className="flex items-center bg-gray-50 p-2">
                          <button
                            onClick={() => toggleExpandSector(code)}
                            className="p-1 hover:bg-gray-200 rounded mr-2"
                          >
                            {expandedSectors.has(code) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                          <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={selectedSectors.has(code)}
                              onChange={() => toggleSector(code)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-medium text-sm text-gray-800">
                              {data.label}
                            </span>
                          </label>
                        </div>

                        {expandedSectors.has(code) && (
                          <div className="pl-10 pr-2 py-2 space-y-1 bg-white border-t">
                            {Array.from(data.industries.entries()).map(
                              ([indCode, indLabel]) => (
                                <label
                                  key={indCode}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedIndustries.has(indCode)}
                                    onChange={() => toggleIndustry(indCode)}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-600">
                                    {indLabel}
                                  </span>
                                </label>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {activeFilterCategory === "Price" && (
                <div className="h-full overflow-y-auto">
                  <div className="p-4">
                    <h3 className="font-medium mb-4">Price Range</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">
                          Min Price
                        </label>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([
                              Number(e.target.value),
                              priceRange[1],
                            ])
                          }
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">
                          Max Price
                        </label>
                        <input
                          type="number"
                          value={priceRange[1] + 1}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              Number(e.target.value),
                            ])
                          }
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                    <div className="relative w-full h-8 mt-2">
                      <style>{`
                      .dual-range-slider::-webkit-slider-thumb {
                        pointer-events: auto;
                        -webkit-appearance: none;
                        height: 18px;
                        width: 18px;
                        border-radius: 50%;
                        background: white;
                        border: 2px solid #2563eb;
                        cursor: pointer;
                        /* margin-top removed to fix alignment */
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                      }
                      .dual-range-slider::-moz-range-thumb {
                        pointer-events: auto;
                        height: 18px;
                        width: 18px;
                        border: 2px solid #2563eb;
                        border-radius: 50%;
                        background: white;
                        cursor: pointer;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                      }
                    `}</style>

                      {/* Track Background */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full -translate-y-1/2 pointer-events-none"></div>

                      {/* Active Range Track */}
                      <div
                        className="absolute top-1/2 h-1 bg-blue-600 rounded-full -translate-y-1/2 pointer-events-none z-10"
                        style={{
                          left: `${(priceRange[0] / maxPrice) * 100}%`,
                          right: `${100 - (priceRange[1] / maxPrice) * 100}%`,
                        }}
                      ></div>

                      {/* Min Slider */}
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const val = Math.min(
                            Number(e.target.value),
                            priceRange[1] - 1,
                          );
                          setPriceRange([val, priceRange[1]]);
                        }}
                        className="dual-range-slider absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent pointer-events-none z-20"
                      />

                      {/* Max Slider */}
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const val = Math.max(
                            Number(e.target.value),
                            priceRange[0] + 1,
                          );
                          setPriceRange([priceRange[0], val]);
                        }}
                        className="dual-range-slider absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent pointer-events-none z-20"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0</span>
                      <span>{maxPrice.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dropdown Results */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="relative bg-white border mt-1 rounded-lg shadow-lg w-full h-80 overflow-y-auto z-50"
          >
            {filteredResults.length > 0 ? (
              filteredResults.map((company, index) => (
                <div
                  key={company.fincode}
                  id={`search-result-${index}`}
                  onClick={() => handleSelect(company)}
                  className={`px-3 py-2 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 ${
                    index === selectedIndex ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    {/* Top Row: Symbol & Company Name */}
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-900 text-base">
                        {company.symbol}
                      </span>
                      <span className="text-sm font-medium text-gray-600 truncate ml-4">
                        {company.companyName}
                      </span>
                    </div>

                    {/* Bottom Row: Metadata */}
                    <div className="flex justify-between items-center mt-0">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {company.sector}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">
                          {company.industry}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {company.price && (
                          <span className="text-sm font-bold text-green-700">
                            ₹{company.price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                          {company.house}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-600">No results found</div>
            )}
          </div>
        )}

        {error && (
          <p className="mt-3 p-3 bg-red-100 text-red-800 rounded-lg">{error}</p>
        )}
      </div>
    </div>
  );
}

export default SearchList;
