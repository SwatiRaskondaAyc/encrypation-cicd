// import React, { useState } from 'react';
// import { motion, useInView } from 'framer-motion';
// import { FaSortUp, FaSortDown } from 'react-icons/fa';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const SectorDetails = ({ sector, isOpen, onClose }) => {
//     if (!isOpen || !sector) return null;

//     const [sortKey, setSortKey] = useState('PE');
//     const [sortOrder, setSortOrder] = useState('desc');
//     const [companyQuery, setCompanyQuery] = useState('');
//     const [searchParams, setSearchParams] = useSearchParams();
//     const navigate = useNavigate();
//     const selectedSymbol = searchParams.get('symbol');

//     // Transform companies data to match the expected structure
//     const transformCompanies = (companies) => {
//         if (!companies || !companies.Symbol || !Array.isArray(companies.Symbol)) return [];
//         const keys = Object.keys(companies);
//         const length = companies.Symbol.length;
//         const result = [];

//         for (let i = 0; i < length; i++) {
//             const company = {};
//             keys.forEach((key) => {
//                 company[key] = companies[key][i] ?? null; // Ensure null for undefined values
//             });
//             result.push(company);
//         }
//         return result;
//     };

//     const onRowClick = (symbol) => {
//         if (symbol) {
//             navigate(`/equityhub?symbol=${symbol}`);
//         }
//     };
//     // Format values based on key
//     const formatValue = (value, key) => {
//         if (value === null || value === undefined || !Number.isFinite(Number(value))) return '-';

//         const rupeeFormatter = new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//         });

//         if (key.includes('CAGR') || key.includes('DividendYield')) {
//             return `${(value * 100).toFixed(2)}%`;
//         }

//         if (key.includes('MarketCap')) {
//             const crValue = value / 1e7;
//             return `₹${crValue.toFixed(2)} Cr`;
//         }

//         if (key === 'Price') {
//             return rupeeFormatter.format(value);
//         }

//         if (key === 'UpDownAmt') {
//             const formatted = rupeeFormatter.format(Math.abs(value));
//             return value >= 0 ? `+${formatted}` : `-${formatted}`;
//         }

//         return Number(value).toFixed(2);
//     };

//     // Render company table rows with sorting and filtering
//     const renderCompanyTable = (companies) => {
//         if (!companies || !Array.isArray(companies)) return null;
//         const filtered = companyQuery
//             ? companies.filter((c) => c.Symbol?.toLowerCase().includes(companyQuery.toLowerCase()))
//             : companies;

//         const sorted = [...filtered].sort((a, b) => {
//             if (sortKey === 'Symbol') {
//                 return sortOrder === 'asc'
//                     ? (a.Symbol || '').localeCompare(b.Symbol || '')
//                     : (b.Symbol || '').localeCompare(a.Symbol || '');
//             }

//             const av = a[sortKey] != null ? Number(a[sortKey]) : null;
//             const bv = b[sortKey] != null ? Number(b[sortKey]) : null;

//             if (av === null && bv === null) return 0;
//             if (av === null) return sortOrder === 'asc' ? 1 : -1;
//             if (bv === null) return sortOrder === 'asc' ? -1 : 1;

//             return sortOrder === 'asc' ? av - bv : bv - av;
//         });

//         return sorted.map((c) => (
//             <tr
//                 key={c.Symbol || Math.random()}
//                 onClick={() => onRowClick(c.Symbol)}
//                 className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${c.UpDown === 'Up'
//                     ? 'text-green-600 dark:text-green-400'
//                     : c.UpDown === 'Down'
//                         ? 'text-red-600 dark:text-red-400'
//                         : ''
//                     }`}
//             >
//                 <td className="px-4 py-3 whitespace-nowrap">{c.Symbol || '-'}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.Price, 'Price')}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.PE, 'PE')}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.MarketCap, 'MarketCap')}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.bookValue, 'bookValue')}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.EPS, 'EPS')}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.CAGR_1Y_MCap, 'CAGR_1Y_MCap')}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.UpDownAmt, 'UpDownAmt')}</td>
//             </tr>
//         ));
//     };

//     // Transformed companies data
//     const companies = transformCompanies(sector.Companies);

//     return (
//         <div className="inset-0 mt-10  bg-slate bg-opacity-50 flex items-center justify-center z-50">
//             <motion.div
//                 className="bg-white max-w-7xl dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 max-w-3xl w-full max-h-[80vh] overflow-x-auto overflow-y-auto"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3 }}
//             >

//                 <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                         {sector.Sector} - Details
//                     </h3>
//                     <button
//                         onClick={onClose}
//                         className="px-3 py-1  text-black rounded-lg text-2xl font-medium hover:bg-sky-700 transition-colors"
//                     >
//                         ×
//                     </button>
//                 </div>

//                 <div className="space-y-4">

//                     <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 ">
//                         <div className='p-5 bg-gray-100 '>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600 dark:text-gray-400">Market Cap:</span>
//                                 <span className="font-medium text-gray-900 dark:text-gray-100">
//                                     {sector.SectorMarketCap ? `₹${(sector.SectorMarketCap / 1e7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}cr` : 'N/A'}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600 dark:text-gray-400">1Y Growth:</span>
//                                 <span className={`font-medium ${sector.SectorCAGR_1Y_MCap >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                     {sector.SectorCAGR_1Y_MCap ? `${(sector.SectorCAGR_1Y_MCap * 100).toFixed(2)}%` : 'N/A'}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600 dark:text-gray-400">PE Ratio:</span>
//                                 <span className="font-medium text-gray-900 dark:text-gray-100">
//                                     {sector.SectorPE_Mode ? sector.SectorPE_Mode.toFixed(2) : 'N/A'}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600 dark:text-gray-400">Total Companies:</span>
//                                 <span className="font-medium text-gray-900 dark:text-gray-100">{sector.TotalCompanies}</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div>
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//                             <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Companies</h4>
//                             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//                                 <select
//                                     value={sortKey}
//                                     onChange={(e) => {
//                                         setSortKey(e.target.value);
//                                         setSortOrder('desc');
//                                     }}
//                                     className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-sky-500"
//                                 >
//                                     <option value="Symbol">Sort by Symbol</option>
//                                     <option value="Price">Sort by Price</option>
//                                     <option value="PE">Sort by P/E</option>
//                                     <option value="MarketCap">Sort by Market Cap</option>
//                                     <option value="bookValue">Sort by Book Value</option>
//                                     <option value="EPS">Sort by EPS</option>
//                                     <option value="CAGR_1Y_MCap">Sort by 1Y CAGR</option>
//                                     <option value="UpDownAmt">Sort by Change</option>
//                                 </select>
//                                 <button
//                                     onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//                                     className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-sky-500"
//                                 >
//                                     {sortOrder === 'asc' ? <FaSortUp size={20} /> : <FaSortDown size={20} />}
//                                 </button>
//                                 <input
//                                     type="text"
//                                     placeholder="Search companies..."
//                                     value={companyQuery}
//                                     onChange={(e) => setCompanyQuery(e.target.value)}
//                                     className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-sky-500"
//                                 />
//                             </div>
//                         </div>
//                         {/* <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
//                             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
//                                 <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
//                                     <tr>
//                                         {[
//                                             { label: 'Symbol', key: 'Symbol' },
//                                             { label: 'Price', key: 'Price' },
//                                             { label: 'P/E', key: 'PE' },
//                                             { label: 'Market Cap', key: 'MarketCap' },
//                                             { label: 'Book Value', key: 'bookValue' },
//                                             { label: 'EPS', key: 'EPS' },
//                                             { label: '1Y CAGR', key: 'CAGR_1Y_MCap' },
//                                             { label: 'Change', key: 'UpDownAmt' },
//                                         ].map(({ label, key }) => (
//                                             <th
//                                                 key={key}
//                                                 onClick={() => {
//                                                     setSortKey(key);
//                                                     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//                                                 }}
//                                                 className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide cursor-pointer hover:text-sky-600"
//                                             >
//                                                 <div className="flex items-center gap-1">
//                                                     {label}
//                                                     {sortKey === key && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
//                                                 </div>
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                                     {renderCompanyTable(companies)}
//                                 </tbody>
//                             </table>
//                         </div> */}
//                         <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-lg border border-gray-200 dark:border-gray-700 shadow">
//                             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
//                                 <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
//                                     <tr>
//                                         {[
//                                             { label: 'Symbol', key: 'Symbol' },
//                                             { label: 'Price', key: 'Price' },
//                                             { label: 'P/E', key: 'PE' },
//                                             { label: 'Market Cap', key: 'MarketCap' },
//                                             { label: 'Book Value', key: 'bookValue' },
//                                             { label: 'EPS', key: 'EPS' },
//                                             { label: '1Y CAGR', key: 'CAGR_1Y_MCap' },
//                                             { label: 'Change', key: 'UpDownAmt' },
//                                         ].map(({ label, key }) => (
//                                             <th
//                                                 key={key}
//                                                 onClick={() => {
//                                                     setSortKey(key);
//                                                     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//                                                 }}
//                                                 className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide cursor-pointer hover:text-sky-600"
//                                             >
//                                                 <div className="flex items-center gap-1">
//                                                     {label}
//                                                     {sortKey === key && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
//                                                 </div>
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                                     {renderCompanyTable(companies)}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>

//             </motion.div>
//         </div>
//     );
// };

// export default SectorDetails;


import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SectorDetails = ({ sector, isOpen, onClose }) => {
    if (!isOpen || !sector) return null;

    const [sortKey, setSortKey] = useState('PE');
    const [sortOrder, setSortOrder] = useState('desc');
    const [companyQuery, setCompanyQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const selectedSymbol = searchParams.get('symbol');

    // Transform companies data to match the expected structure
    const transformCompanies = (companies) => {
        if (!companies || !companies.Symbol || !Array.isArray(companies.Symbol)) return [];
        const keys = Object.keys(companies);
        const length = companies.Symbol.length;
        const result = [];

        for (let i = 0; i < length; i++) {
            const company = {};
            keys.forEach((key) => {
                company[key] = companies[key][i] ?? null; // Ensure null for undefined values
            });
            result.push(company);
        }
        return result;
    };

    const onRowClick = (symbol) => {
        if (symbol) {
            navigate(`/equityinsights?symbol=${symbol}`);
        }
    };
    // Format values based on key
    const formatValue = (value, key) => {
        if (value === null || value === undefined || !Number.isFinite(Number(value))) return '-';

        const rupeeFormatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        if (key.includes('CAGR') || key.includes('DividendYield')) {
            return `${(value * 100).toFixed(2)}%`;
        }

        if (key.includes('MarketCap')) {
            const crValue = value / 1e7;
            return `₹${crValue.toFixed(2)} Cr`;
        }

        if (key === 'Price') {
            return rupeeFormatter.format(value);
        }

        if (key === 'UpDownAmt') {
            const formatted = rupeeFormatter.format(Math.abs(value));
            return value >= 0 ? `+${formatted}` : `-${formatted}`;
        }

        return Number(value).toFixed(2);
    };

    // Render company table rows with sorting and filtering
    const renderCompanyTable = (companies) => {
        if (!companies || !Array.isArray(companies)) return null;
        const filtered = companyQuery
            ? companies.filter((c) => c.Symbol?.toLowerCase().includes(companyQuery.toLowerCase()))
            : companies;

        const sorted = [...filtered].sort((a, b) => {
            if (sortKey === 'Symbol') {
                return sortOrder === 'asc'
                    ? (a.Symbol || '').localeCompare(b.Symbol || '')
                    : (b.Symbol || '').localeCompare(a.Symbol || '');
            }

            const av = a[sortKey] != null ? Number(a[sortKey]) : null;
            const bv = b[sortKey] != null ? Number(b[sortKey]) : null;

            if (av === null && bv === null) return 0;
            if (av === null) return sortOrder === 'asc' ? 1 : -1;
            if (bv === null) return sortOrder === 'asc' ? -1 : 1;

            return sortOrder === 'asc' ? av - bv : bv - av;
        });

        return sorted.map((c) => (
            <tr
                key={c.Symbol || Math.random()}
                onClick={() => onRowClick(c.Symbol)}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${c.UpDown === 'Up'
                    ? 'text-green-600 dark:text-green-400'
                    : c.UpDown === 'Down'
                        ? 'text-red-600 dark:text-red-400'
                        : ''
                    }`}
            >
                <td className="px-4 py-3 whitespace-nowrap">{c.Symbol || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.Price, 'Price')}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.PE, 'PE')}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.MarketCap, 'MarketCap')}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.bookValue, 'bookValue')}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.EPS, 'EPS')}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.CAGR_1Y_MCap, 'CAGR_1Y_MCap')}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatValue(c.UpDownAmt, 'UpDownAmt')}</td>
            </tr>
        ));
    };

    // Transformed companies data
    const companies = transformCompanies(sector.Companies);

    return (
        <div className="inset-0 mt-10  bg-slate bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                className="bg-white max-w-7xl dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 max-w-3xl w-full max-h-[80vh] overflow-x-auto overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
            >

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {sector.Sector} - Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="px-3 py-1  text-black rounded-lg text-2xl font-medium hover:bg-sky-700 transition-colors"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4 dark:bg-slate-800 dark:text-white ">

                    <div className="bg-white dark:bg-slate-800 p-4 border-b border-gray-200 dark:border-gray-700 ">
                        <div className='p-5 bg-gray-100 '>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-white">Market Cap:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {sector.SectorMarketCap ? `₹${(sector.SectorMarketCap / 1e7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}cr` : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-white">TTM Revenue (%Chng):</span>
                                <span className={`font-medium ${sector.SectorCAGR_1Y_MCap >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {sector.SectorCAGR_1Y_MCap ? `${(sector.SectorCAGR_1Y_MCap * 100).toFixed(2)}%` : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-white">PE Ratio:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {sector.SectorPE_Mode ? sector.SectorPE_Mode.toFixed(2) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-white">Total Companies:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{sector.TotalCompanies}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Companies</h4>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <select
                                    value={sortKey}
                                    onChange={(e) => {
                                        setSortKey(e.target.value);
                                        setSortOrder('desc');
                                    }}
                                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="Symbol">Sort by Symbol</option>
                                    <option value="Price">Sort by Price</option>
                                    <option value="PE">Sort by P/E</option>
                                    <option value="MarketCap">Sort by Market Cap</option>
                                    <option value="bookValue">Sort by Book Value</option>
                                    <option value="EPS">Sort by EPS</option>
                                    <option value="CAGR_1Y_MCap">Sort by TTM Revenue (%Chng)</option>
                                    <option value="UpDownAmt">Sort by Change</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-sky-500"
                                >
                                    {sortOrder === 'asc' ? <FaSortUp size={20} /> : <FaSortDown size={20} />}
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search companies..."
                                    value={companyQuery}
                                    onChange={(e) => setCompanyQuery(e.target.value)}
                                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                        {/* <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
                                    <tr>
                                        {[
                                            { label: 'Symbol', key: 'Symbol' },
                                            { label: 'Price', key: 'Price' },
                                            { label: 'P/E', key: 'PE' },
                                            { label: 'Market Cap', key: 'MarketCap' },
                                            { label: 'Book Value', key: 'bookValue' },
                                            { label: 'EPS', key: 'EPS' },
                                            { label: '1Y CAGR', key: 'CAGR_1Y_MCap' },
                                            { label: 'Change', key: 'UpDownAmt' },
                                        ].map(({ label, key }) => (
                                            <th
                                                key={key}
                                                onClick={() => {
                                                    setSortKey(key);
                                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                }}
                                                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide cursor-pointer hover:text-sky-600"
                                            >
                                                <div className="flex items-center gap-1">
                                                    {label}
                                                    {sortKey === key && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {renderCompanyTable(companies)}
                                </tbody>
                            </table>
                        </div> */}
                        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-lg border border-gray-200 dark:border-gray-700 shadow">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        {[
                                            { label: 'Symbol', key: 'Symbol' },
                                            { label: 'Price', key: 'Price' },
                                            { label: 'P/E', key: 'PE' },
                                            { label: 'Market Cap', key: 'MarketCap' },
                                            { label: 'Book Value', key: 'bookValue' },
                                            { label: 'EPS', key: 'EPS' },
                                            { label: 'TTM Revenue (%Chng)', key: 'CAGR_1Y_MCap' },
                                            { label: 'Change', key: 'UpDownAmt' },
                                        ].map(({ label, key }) => (
                                            <th
                                                key={key}
                                                onClick={() => {
                                                    setSortKey(key);
                                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                }}
                                                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide cursor-pointer hover:text-sky-600"
                                            >
                                                <div className="flex items-center gap-1">
                                                    {label}
                                                    {sortKey === key && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {renderCompanyTable(companies)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default SectorDetails;