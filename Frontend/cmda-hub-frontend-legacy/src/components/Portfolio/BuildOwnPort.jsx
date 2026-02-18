
/////////////////////////////////////////////////////////////////////////////////////////////previous code

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {
//   RiSearchLine,
//   RiAddCircleFill,
//   RiDeleteBinLine,
//   RiEdit2Line,
//   RiCloseCircleFill,
//   RiCheckboxCircleFill,
// } from 'react-icons/ri';
// import { FaLock, FaHome } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import Navbar from '../Navbar';
// import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';
// import { saveAs } from 'file-saver';
// import { useMemo } from 'react'; 

// export default function PaperTrading() {
//   /* ────────────────────── AUTH ────────────────────── */
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const getToken = () => {
//     const t = localStorage.getItem('authToken');
//     return t && t !== 'null' ? t : null;
//   };
//   const navigate = useNavigate();

//   /* ────────────────────── LOADING ────────────────────── */
//   const [loading, setLoading] = useState(false);


// /* ────────────────────── DOWNALOAD CSV  ────────────────────── */
// const downloadCSV = () => {
//   const rows = selectedPortfolio?.transactions || [];
//   if (!rows.length) return;

//   // ---- 1. Fixed column order (exactly as in your sample) ----
//   const headers = [
//     'Symbol',
//     'Date',
//     'Time',
//     'OrderType',
//     'Qty',
//     'Price',
//     'MarketValue',
//     'BrokerageAmount',
//   ];

//   // ---- 2. Split DateTime into separate Date & Time fields ----
//   const csvContent = [
//     headers.join(','),                                   // header line
//     ...rows.map(row => {
//       const [date, time] = (row.DateTime || '').split(' ');
//       return headers
//         .map(h => {
//           // Use the split values for Date / Time, otherwise the original field
//           const value = h === 'Date' ? date
//                      : h === 'Time' ? time
//                      : row[h] ?? '';
//           return `"${value}"`;
//         })
//         .join(',');
//     }),
//   ].join('\n');

//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   saveAs(blob, `${selectedPortfolio.name}_transactions.csv`);
// };

//   /* ────────────────────── PORTFOLIOS ────────────────────── */
//   const [portfolios, setPortfolios] = useState([]);
//   const [selectedPortfolio, setSelectedPortfolio] = useState(null);

//   /* ────────────────────── TABS ────────────────────── */
//   const [activeTab, setActiveTab] = useState('overview');

//   /* ────────────────────── Book profit ────────────────────── */
//   const calculateTotalBookProfit = useCallback((transactions) => {
//     if (!transactions || transactions.length === 0) return 0;

//     const sorted = [...transactions].sort((a, b) => {
//       const aDate = new Date(a.DateTime || '');
//       const bDate = new Date(b.DateTime || '');
//       return aDate - bDate;
//     });

//     const holdings = {};
//     let totalProfit = 0;

//     sorted.forEach(tx => {
//       const symbol = tx.Symbol;
//       const qty = parseFloat(tx.Qty) || 0;
//       const price = parseFloat(tx.Price) || 0;

//       if (!holdings[symbol]) {
//         holdings[symbol] = { qty: 0, cost: 0 };
//       }

//       if (tx.OrderType === 'B') {
//         holdings[symbol].qty += qty;
//         holdings[symbol].cost += qty * price;
//       } else if (tx.OrderType === 'S') {
//         const avgCost = holdings[symbol].qty > 0
//           ? holdings[symbol].cost / holdings[symbol].qty
//           : 0;
//         const profit = qty * (price - avgCost);
//         totalProfit += profit;

//         holdings[symbol].qty -= qty;
//         holdings[symbol].cost -= avgCost * qty;

//         if (holdings[symbol].qty < 0.001) {
//           holdings[symbol].qty = 0;
//           holdings[symbol].cost = 0;
//         }
//       }
//     });

//     return totalProfit;
//   }, []);

//   // Now safe: selectedPortfolio is declared above
//   const totalBookProfit = useMemo(() => {
//     return selectedPortfolio
//       ? calculateTotalBookProfit(selectedPortfolio.transactions || [])
//       : 0;
//   }, [selectedPortfolio, calculateTotalBookProfit]);

//   /* ────────────────────── CREATE MODAL ────────────────────── */
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newPortfolioName, setNewPortfolioName] = useState('');
//   const [newCorpus, setNewCorpus] = useState('');

//   /* ────────────────────── EDIT / DELETE ────────────────────── */
//   const [showEditMenu, setShowEditMenu] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingPortfolio, setEditingPortfolio] = useState(null);
//   const [editName, setEditName] = useState('');
//   const [editCorpus, setEditCorpus] = useState('');

//   /* ────────────────────── TRADE UI ────────────────────── */
//   const [searchMode, setSearchMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [exchange, setExchange] = useState('NSE');
//   // const [quantity, setQuantity] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [quantities, setQuantities] = useState({});
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [confirmAction, setConfirmAction] = useState('buy');

//   /* ────────────────────── STOCK DATA ────────────────────── */
//   const [stockData, setStockData] = useState([]);

//   /* ────────────────────── FILTER STATE ────────────────────── */
//   const [brokerageFilter, setBrokerageFilter] = useState('all');

//   /* ────────────────────── FETCH STOCK LIST ────────────────────── */
//   useEffect(() => {
//     const fetchStocks = async () => {
//       try {
//         const res = await axios.post(`${API_BASE}/file/build_Portfolio`);
//         setStockData(res.data.portfolio_data || []);
//       } catch (err) {
//         toast.error('Failed to load stock list');
//       }
//     };
//     fetchStocks();
//   }, [API_BASE]);

//   /* ────────────────────── SEARCH (client‑side) ────────────────────── */
//   useEffect(() => {
//     if (!searchQuery) {
//       setSearchResults([]);
//       return;
//     }
//     const filtered = stockData.filter((s) =>
//       s.Symbol.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setSearchResults(filtered);
//   }, [searchQuery, stockData]);

//   /* ────────────────────── CHECK LOGIN ────────────────────── */
//   useEffect(() => {
//     const token = getToken();
//     setIsLoggedIn(!!token);
//   }, []);

//   /* ────────────────────── Helper to get/set quantity per symbol ────────────────────── */
//     const getQty = (symbol) => quantities[symbol] || '';
//     const setQty = (symbol, value) => {
//       setQuantities(prev => ({ ...prev, [symbol]: value }));
//     };


//   /* ────────────────────── TOTAL BROKERAGE CALCULATION & DISPLAY ────────────────────── */
//   const totalBrokerage = useMemo(() => {
//     if (!selectedPortfolio?.transactions) return 0;
//     return selectedPortfolio.transactions.reduce((sum, t) => {
//       return sum + parseFloat(t.BrokerageAmount || 0);
//     }, 0);
//   }, [selectedPortfolio]);

//   /* ────────────────────── TOTAL INVESTED WITH LTP ────────────────────── */
//   const getTotalInvested = (symbol, qtyStr) => {
//     const qty = parseInt(qtyStr) || 0;
//     const stock = stockData.find(s => s.Symbol === symbol);
//     if (!stock || qty === 0) return '0.00';
//     return (qty * stock.Close).toFixed(2);
//   };

//   /* ────────────────────── FETCH PORTFOLIOS ────────────────────── */
//   const fetchPortfolios = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       setIsLoggedIn(false);
//       toast.error('Please log in to view your portfolios.');
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/paper-trade/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const options = processPortfolios(res.data || []);
//       setPortfolios(options);

//       if (options.length > 0 && !selectedPortfolio) {
//         setSelectedPortfolio(options[0]);
//       }
//     } catch (e) {
//       console.error(e);
//       toast.error(e.response?.data?.message || 'Failed to load portfolios');
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE]);

//   useEffect(() => {
//     const token = getToken();
//     if (token) {
//       setIsLoggedIn(true);
//       fetchPortfolios();
//     } else {
//       setIsLoggedIn(false);
//       setLoading(false);
//     }
//   }, [fetchPortfolios]);



//   /* ────────────────────── PROCESS RAW PORTFOLIOS ────────────────────── */
//   const processPortfolios = (raw) => {
//     return raw.map((p) => ({
//       displayName: p.displayName || `Portfolio ${p.series}`,
//       name: p.displayName || `Portfolio ${p.series}`,
//       value: p.series?.toString() || '',
//       corpus: Number(p.corpus),
//       data: Array.isArray(p.data)
//         ? p.data.map((item) => {
//             let dateObj = new Date();
//             if (typeof item.Date === 'string' && item.Date.includes('/')) {
//               const [day, month, year] = item.Date.split('/');
//               dateObj = new Date(`${year}-${month}-${day}T${item.Time || '00:00:00'}`);
//             } else if (typeof item.Date === 'number' || !isNaN(parseInt(item.Date))) {
//               dateObj = new Date(parseInt(item.Date));
//             }
//             const formattedDate = dateObj.toLocaleDateString('en-GB', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric',
//             });
//             const formattedTime = dateObj.toLocaleTimeString('en-GB', {
//               hour12: false,
//               hour: '2-digit',
//               minute: '2-digit',
//               second: '2-digit',
//             });
//             const dateTimeStr = `${formattedDate} ${formattedTime}`;
//             return {
//               ...item,
//               Qty: item.Qty?.toString() || '0',
//               Price: parseFloat(item.Price || 0).toFixed(2),
//               MarketValue: parseFloat(item.MarketValue || 0).toFixed(2),
//               BrokerageAmount: isNaN(item.BrokerageAmount)
//                 ? '0.00'
//                 : parseFloat(item.BrokerageAmount).toFixed(2),
//               DateTime: dateTimeStr,
//               frame: item.Frame || item.frame || '—',
//             };
//           })
//         : [],
//       transactions: Array.isArray(p.data)
//         ? p.data.map((item) => {
//             let dateObj = new Date();
//             if (typeof item.Date === 'string' && item.Date.includes('/')) {
//               const [day, month, year] = item.Date.split('/');
//               dateObj = new Date(`${year}-${month}-${day}T${item.Time || '00:00:00'}`);
//             } else if (typeof item.Date === 'number' || !isNaN(parseInt(item.Date))) {
//               dateObj = new Date(parseInt(item.Date));
//             }
//             const formattedDate = dateObj.toLocaleDateString('en-GB', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric',
//             });
//             const formattedTime = dateObj.toLocaleTimeString('en-GB', {
//               hour12: false,
//               hour: '2-digit',
//               minute: '2-digit',
//               second: '2-digit',
//             });
//             return {
//               ...item,
//               DateTime: `${formattedDate} ${formattedTime}`,
//               frame: item.Frame || item.frame || '—',
//             };
//           })
//         : [],
//       tableName: p.internalTableName,
//     }));
//   };

//   /* ────────────────────── CREATE PORTFOLIO ────────────────────── */
//   const createPortfolio = async () => {
//     const token = getToken();
//     if (!token) return toast.error('Please log in.');
//     if (!newPortfolioName || !newCorpus) return;

//     try {
//       await axios.post(
//         `${API_BASE}/paper-trade/create?name=${encodeURIComponent(newPortfolioName)}&corpus=${newCorpus}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Portfolio created');
//       setShowCreateModal(false);
//       setNewPortfolioName('');
//       setNewCorpus('');
//       fetchPortfolios();
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to create portfolio');
//     }
//   };

//   /* ────────────────────── EDIT PORTFOLIO ────────────────────── */
//   const editPortfolio = async () => {
//     const token = getToken();
//     if (!token || !editingPortfolio) return;

//     try {
//       await axios.patch(
//         `${API_BASE}/paper-trade/edit`,
//         {},
//         {
//           params: {
//             portfolioname: editingPortfolio.name,
//             ...(editName && editName !== editingPortfolio.name && { newName: editName }),
//             ...(editCorpus && { corpus: editCorpus }),
//           },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success('Portfolio updated');
//       setShowEditModal(false);
//       setEditingPortfolio(null);
//       setEditName('');
//       setEditCorpus('');
//       const updated = await fetchPortfolios();
//       const updatedPortfolio = portfolios.find(
//         (port) => port.name === editingPortfolio.name || port.name === editName
//       );
//       if (updatedPortfolio) setSelectedPortfolio(updatedPortfolio);
//     } catch (e) {
//       toast.error(e.response?.data?.error || 'Failed to update');
//     }
//   };

//   /* ────────────────────── DELETE TRANSACTION ────────────────────── */
//   const deleteTransaction = async (transactionId) => {
//     const token = getToken();
//     if (!token || !selectedPortfolio) return;

//     if (!window.confirm('Delete this transaction?')) return;

//     try {
//       await axios.delete(`${API_BASE}/paper-trade/transaction-delete`, {
//         params: { portfolioname: selectedPortfolio.name, transactionId },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Transaction deleted');
//       fetchPortfolios();
//     } catch (e) {
//       toast.error(e.response?.data?.error || 'Failed to delete');
//     }
//   };

//   /* ────────────────────── DELETE PORTFOLIO ────────────────────── */
//   const deletePortfolio = async (name) => {
//     const token = getToken();
//     if (!token) return toast.error('Please log in.');

//     try {
//       await axios.delete(`${API_BASE}/paper-trade/delete?portfolioname=${name}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Portfolio deleted');
//       fetchPortfolios();
//       if (selectedPortfolio?.name === name) {
//         setSelectedPortfolio(portfolios[0] || null);
//       }
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to delete');
//     }
//   };

//   /* ────────────────────── SAVE TRANSACTION ────────────────────── */
//   const saveTransaction = async (transaction, portfolioName) => {
//     const token = getToken();
//     if (!token) {
//       toast.error('Not logged in.');
//       return;
//     }

//     try {
//       const payload = [transaction];
//       await axios.post(
//         `${API_BASE}/paper-trade/save?portfolioname=${portfolioName}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       toast.success(
//         `${transaction.OrderType === 'B' ? 'Bought' : 'Sold'} ${transaction.Qty} ${transaction.Symbol}`
//       );
//       await fetchPortfoliosAndSelectCurrent(portfolioName);
//       resetTradeForm();
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Trade failed');
//       throw e;
//     }
//   };

//   const resetTradeForm = () => {
//     setSearchMode(false);
//     setSearchQuery('');
//     setSelectedStock(null);
//     setQuantity('');
//     setExchange('NSE');
//   };

//   const handleBuySell = (action) => {
//     if (!selectedStock || !quantity || parseFloat(quantity) <= 0 || !selectedPortfolio) {
//       toast.error('Enter a valid quantity');
//       return;
//     }
//     setConfirmAction(action);
//     setShowConfirmModal(true);
//   };

//   const fetchPortfoliosAndSelectCurrent = async (portfolioName) => {
//     const token = getToken();
//     if (!token || !portfolioName) return;

//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/paper-trade/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const options = processPortfolios(res.data || []);
//       setPortfolios(options);
//       const updated = options.find((p) => p.name === portfolioName);
//       if (updated) setSelectedPortfolio(updated);
//     } catch (e) {
//       console.error(e);
//       toast.error(e.response?.data?.message || 'Failed to refresh');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateCorpusOnServer = async (newCorpus) => {
//     const token = getToken();
//     if (!token || !selectedPortfolio) return;

//     try {
//       await axios.patch(
//         `${API_BASE}/paper-trade/edit`,
//         {},
//         {
//           params: { portfolioname: selectedPortfolio.name, corpus: newCorpus },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (e) {
//       toast.error('Failed to update corpus on server');
//       console.error(e);
//     }
//   };

//   const confirmTrade = async () => {
//     if (!selectedStock || !quantity || parseInt(quantity) <= 0 || !Number.isInteger(parseInt(quantity))) {
//       toast.error('Invalid quantity');
//       return;
//     }

//     const qty = parseFloat(quantity);
//     const price = selectedStock.Close;
//     const orderType = confirmAction === 'buy' ? 'B' : 'S';
//     const tradeValue = qty * price;
//     const brokerageAmount =
//       orderType === 'B' ? Math.min(0.0003 * tradeValue, 20) : 0.0005 * tradeValue;
//     const totalCost = tradeValue + brokerageAmount;
//     const totalProceeds = tradeValue - brokerageAmount;
//     const currentCorpus = selectedPortfolio.corpus;

//     if (orderType === 'B' && totalCost > currentCorpus) {
//       toast.error(
//         `Insufficient corpus! Need ₹${totalCost.toFixed(2)}, Available: ₹${currentCorpus.toFixed(2)}`
//       );
//       setShowConfirmModal(false);
//       return;
//     }

//     if (orderType === 'S') {
//       const holding = getHoldings().find((h) => h.symbol === selectedStock.Symbol);
//       if (!holding || qty > holding.qty) {
//         toast.error(`Cannot sell ${qty}. Only ${holding?.qty || 0} available.`);
//         setShowConfirmModal(false);
//         return;
//       }
//     }

//     const updatedCorpus = orderType === 'B' ? currentCorpus - totalCost : currentCorpus + totalProceeds;
//     const portfolioName = selectedPortfolio.name;

//     // ──────────────────────────────
//   //  BUSINESS DATE LOGIC (INDIA NSE)
//   // ──────────────────────────────
//   const getPreviousTradingDay = () => {
//     const date = new Date();
//     const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

//     // Weekend or Monday → go back to Friday
//     if (day === 0 || day === 6 || day === 1) {
//       // Set to previous Friday
//       const daysToFriday = day === 0 ? 2 : day === 6 ? 1 : 3;
//       date.setDate(date.getDate() - daysToFriday);
//       return date;
//     }

//     // Tuesday to Friday → go back exactly 1 day
//     date.setDate(date.getDate() - 1);
//     return date;
//   };

//   const tradeDate = getPreviousTradingDay();

//   const transaction = {
//     Symbol: selectedStock.Symbol,
//     Date: tradeDate.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }),
//     Time: new Date().toLocaleTimeString('en-GB', {
//       hour12: false,
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     }),
//     OrderType: orderType,
//     Qty: qty.toString(),
//     Price: price.toFixed(2),
//     MarketValue: tradeValue.toFixed(2),
//     BrokerageAmount: brokerageAmount.toFixed(2),
//   };

//   try {
//     await saveTransaction(transaction, portfolioName);
//     await updateCorpusOnServer(updatedCorpus);
//     await fetchPortfoliosAndSelectCurrent(portfolioName);
//   } catch (err) {
//     toast.error('Trade failed – corpus reverted');
//     console.error(err);
//   } finally {
//     setShowConfirmModal(false);
//   }
// };


//   const getFilteredTransactions = () => {
//     if (!selectedPortfolio?.transactions) return [];
//     const now = new Date();
//     const cutoffMap = { '3d': 3, '1w': 7, '2w': 14, '1m': 30, '3m': 90, '1y': 365 };
//     if (brokerageFilter === 'all') return selectedPortfolio.transactions;
//     const days = cutoffMap[brokerageFilter];
//     const cutoff = new Date(now);
//     cutoff.setDate(now.getDate() - days);
//     return selectedPortfolio.transactions.filter((t) => {
//       const [dateStr] = t.DateTime.split(' ');
//       const [d, m, y] = dateStr.split('/');
//       const txDate = new Date(`${y}-${m}-${d}`);
//       return txDate >= cutoff;
//     });
//   };

//   const getClosedTrades = () => {
//     if (!selectedPortfolio || !Array.isArray(selectedPortfolio.transactions)) return [];
//     const trades = {};
//     const sellEvents = {};
//     selectedPortfolio.transactions.forEach((t) => {
//       const symbol = t.Symbol;
//       const qty = parseFloat(t.Qty) || 0;
//       const price = parseFloat(t.Price) || 0;
//       const dateTime = t.DateTime || '01/01/1970 00:00:00';
//       const date = dateTime.split(' ')[0];
//       if (!trades[symbol]) trades[symbol] = { buy: 0, sell: 0, invested: 0, soldValue: 0 };
//       if (t.OrderType === 'B') {
//         trades[symbol].buy += qty;
//         trades[symbol].invested += qty * price;
//       } else {
//         trades[symbol].sell += qty;
//         trades[symbol].soldValue += qty * price;
//         if (!sellEvents[symbol]) sellEvents[symbol] = date;
//       }
//     });
//     return Object.entries(trades)
//       .filter(([, t]) => Math.abs(t.buy - t.sell) < 0.001)
//       .map(([symbol, t]) => {
//         const avgBuy = t.buy > 0 ? (t.invested / t.buy).toFixed(2) : '0.00';
//         const pnl = (t.soldValue - t.invested).toFixed(2);
//         return {
//           symbol,
//           qty: t.buy,
//           avgPrice: avgBuy,
//           pnl: parseFloat(pnl),
//           sellDate: sellEvents[symbol] || 'Unknown',
//         };
//       })
//       .sort((a, b) => b.sellDate.localeCompare(a.sellDate));
//   };

//   const getHoldings = () => {
//     if (!selectedPortfolio) return [];
//     const holdings = {};
//     selectedPortfolio.transactions.forEach((t) => {
//       if (!holdings[t.Symbol]) holdings[t.Symbol] = { qty: 0, invested: 0 };
//       const qty = parseFloat(t.Qty);
//       if (t.OrderType === 'B') {
//         holdings[t.Symbol].qty += qty;
//         holdings[t.Symbol].invested += qty * parseFloat(t.Price);
//       } else {
//         holdings[t.Symbol].qty -= qty;

//         // const avgPrice = holdings[symbol].invested / (holdings[symbol].qty + qty);
//         // holdings[t.Symbol].invested -= avgPrice * qty;
//       }
//     });
//     return Object.entries(holdings)
//       .filter(([, h]) => h.qty > 0)
//       .map(([symbol, h]) => {
//         const avg = (h.invested / h.qty).toFixed(2);
//         const ltp = stockData.find((s) => s.Symbol === symbol)?.Close || 0;
//         return { symbol, qty: h.qty, avgPrice: avg, ltp };
//       });
//   };

//   /* ────────────────────── NOT LOGGED IN ────────────────────── */
//     if (!isLoggedIn) {
//       return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
//           <Navbar />
//           <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="glass-card rounded-3xl p-12 max-w-md w-full text-center"
//             >
//               <FaLock className="mx-auto text-cyan-600 dark:text-cyan-400 text-6xl mb-6" />
//               <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-gray-600 mb-4">
//                 Please Login First
//               </h1>
//               <button
//                 onClick={() => navigate('/login')}
//                 className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-10 rounded-full transition"
//               >
//                 Login
//               </button>
//             </motion.div>
//           </div>
//         </div>
//       );
//     }


//   /* ────────────────────── MAIN UI ────────────────────── */
//   return (
//     <>
//       <ToastContainer position="top-right" theme="colored" />
//       {/* <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800"> */}

//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
//         <Navbar />

//         {/* Hero Glow */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           {/* <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl top-20 left-20 animate-pulse" />
//           <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse" /> */}

//           <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl top-20 left-20 animate-pulse" />
//           <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse" />



//         </div>

//         {/* <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10"> */}
//          <div className= "w-full mx-auto px-6 pt-24 pb-16 relative z-10">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: -30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-12"
//           >
//             {/* <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600">
//               Paper Trading
//             </h1> */}

//             <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-gray-500">
//               Paper Trading
//             </h1>

//             <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
//               Practice strategies with live market data — zero risk.
//             </p>
//             <p className="mt-2 text-sm font-medium text-orange-600 dark:text-orange-400">
//               ⚠️ Disclaimer : This paper trading platform uses virtual funds with no actual monetary value. All prices are based on real market data to simulate authentic trading conditions.
//                 No exchanges of any shares takes place.
//             </p>
//           </motion.div>

//           {/* Loading */}
//           {loading && (
//             <div className="flex justify-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-600"></div>
//             </div>
//           )}

//           {/* No portfolios */}
//           {portfolios.length === 0 && !loading && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="glass-card rounded-3xl p-12 text-center"
//             >
//               <RiAddCircleFill className="mx-auto text-cyan-600 text-5xl mb-4" />
//               <h3 className="text-2xl font-bold mb-3">Create Your First Corpus</h3>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full transition"
//               >
//                 Create Corpus
//               </button>
//             </motion.div>
//           )}

//                  {/* Portfolio Cards */}
//                   {/* Portfolio Cards */}
// {portfolios.length > 0 && (
//   <div className="relative mb-16">
//     {/* Background Glow */}
//     <div className="absolute inset-x-0 -top-24 h-48 bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-gray-400/10 blur-3xl -z-10" />

//     {/* Scrollable Container */}
//     <div className="overflow-x-auto pt-12 pb-12 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-cyan-400">
//       {/* Inner container with padding */}
//       <div className="flex gap-6 pl-6 pr-6 min-w-max">
//         {portfolios.map((p, i) => {
//           const isSelected = selectedPortfolio?.name === p.name;
//           return (
//             <motion.div
//               key={p.name}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.06 }}
//               onClick={() => setSelectedPortfolio(p)}
//               className={`
//                 relative flex-shrink-0 w-96 snap-center
//                 rounded-2xl p-10 cursor-pointer
//                 bg-white/25 dark:bg-gray-800/25 backdrop-blur-md
//                 border border-transparent
//                 transition-all duration-300
//                 ${isSelected
//                   ? 'ring-2 ring-blue-600 ring-offset-2 shadow-2xl shadow-blue-500/30 z-10'
//                   : 'hover:shadow-xl hover:scale-[1.02]'
//                 }
//               `}
//               style={{
//                 transform: isSelected ? 'scale(1.03)' : undefined,
//                 transformOrigin: 'center',
//               }}
//             >


//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex-1">
//                   <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate">{p.name}</h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                     Corpus:{' '}
//                     <span className="font-semibold text-cyan-600">
//                       ₹{p.corpus?.toLocaleString()}
//                     </span>
//                   </p>
//                 </div>
//                 <div className="relative ml-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setShowEditMenu(showEditMenu === p.name ? null : p.name);
//                     }}
//                     className="text-gray-500 hover:text-cyan-600 transition p-1"
//                   >
//                     <RiEdit2Line size={18} />
//                   </button>
//                   <AnimatePresence>
//                     {showEditMenu === p.name && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -8 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -8 }}
//                         className="absolute right-0 mt-2 w-44 bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-xl shadow-xl py-2 z-30 border border-gray-200 dark:border-gray-700"
//                       >
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setEditingPortfolio(p);
//                             setEditName(p.name);
//                             setEditCorpus(p.corpus.toString());
//                             setShowEditModal(true);
//                             setShowEditMenu(null);
//                           }}
//                           className="w-full text-left px-4 py-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/50 flex items-center gap-2 text-sm transition-colors"
//                         >
//                           <RiEdit2Line className="text-cyan-600" size={16} /> Edit
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             deletePortfolio(p.name);
//                             setShowEditMenu(null);
//                           }}
//                           className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 flex items-center gap-2 text-sm transition-colors"
//                         >
//                           <RiDeleteBinLine size={16} /> Delete
//                         </button>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}

//         {/* Create New Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="
//             flex-shrink-0 w-96 snap-center
//             rounded-2xl p-10 flex flex-col items-center justify-center
//             bg-white/25 dark:bg-gray-800/25 backdrop-blur-md
//             cursor-pointer hover:shadow-xl transition-all duration-300
//             border border-transparent
//           "
//           onClick={() => setShowCreateModal(true)}
//         >
//           <RiAddCircleFill className="text-cyan-600 text-5xl mb-2" />
//           <span className="text-lg font-semibold text-cyan-600">Create New</span>
//         </motion.div>
//       </div>
//     </div>

//     {/* Optional: Safe area indicator */}
//     <div className="absolute left-6 right-6 top-12 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none -z-10" />
//   </div>
// )}

//           {/* Selected Portfolio View */}
//           {selectedPortfolio && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="glass-card rounded-3xl p-8"
//             >
//               {/* Summary Header */}

//                 {/* Stats Grid - NO TEXT, ONLY +/− WITH COLOR */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//                   {[
//                     {
//                       label: 'Total Corpus',
//                       rawValue: selectedPortfolio.corpus,
//                       format: (v) => `₹${v?.toLocaleString()}`,
//                       bg: 'bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
//                       textGradient: 'from-cyan-500 to-blue-600',
//                     },
//                     {
//                       label: 'Holdings Value',
//                       rawValue: getHoldings().reduce((s, h) => s + h.qty * h.ltp, 0),
//                       format: (v) => `₹${v.toFixed(2)}`,
//                       bg: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
//                       textGradient: 'from-emerald-500 to-teal-600',
//                     },
//                     {
//                       label: 'Realised P&L',
//                       rawValue: getClosedTrades().reduce((s, t) => s + t.pnl, 0),
//                       isPnL: true,
//                     },
//                     {
//                       label: 'Unrealised P&L',
//                       rawValue: getHoldings().reduce((s, h) => s + h.qty * (h.ltp - h.avgPrice), 0),
//                       isPnL: true,
//                     },
//                     {
//                       label: 'Total Brokerage',
//                       rawValue: totalBrokerage.toFixed(2),
//                       // isPnL: true,
//                       format: (v) => `₹${Math.abs(v)}`,
//                       bg: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
//                       textGradient: 'from-orange-500 to-amber-600',
//                     },
//                   ].map((item, i) => {
//                     const value = item.rawValue;
//                     const isPositive = value >= 0;
//                     const absValue = Math.abs(value).toFixed(2);
//                     const displayValue = item.isPnL
//                       ? `${isPositive ? '+' : '-'}₹${absValue}`
//                       : item.format(value);

//                     const isPnLCard = item.isPnL;
//                     const bg = item.bg || (isPnLCard
//                       ? isPositive
//                         ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
//                         : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
//                       : '');
//                     const textGradient = item.textGradient || (isPnLCard
//                       ? isPositive
//                         ? 'from-green-500 to-emerald-600'
//                         : 'from-red-500 to-rose-600'
//                       : '');

//                     return (
//                       <motion.div
//                         key={i}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: i * 0.1 }}
//                         whileHover={{ y: -4, scale: 1.02 }}
//                         className={`
//                           relative group cursor-pointer w-full
//                           ${bg} rounded-2xl p-6 text-center border border-white/20
//                           hover:shadow-xl transition-all duration-300
//                           overflow-hidden
//                         `}
//                       >
//                         <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

//                         <div className="relative z-10">
//                           <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
//                             {item.label}
//                           </p>
//                           <p
//                             className={`
//                               text-xl sm:text-2xl font-bold
//                               bg-gradient-to-r ${textGradient} bg-clip-text text-transparent
//                             `}
//                           >
//                             {displayValue}
//                           </p>
//                         </div>

//                         {/* Bottom accent bar */}
//                         <div className={`
//                           absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl
//                           opacity-0 group-hover:opacity-100 transition-opacity duration-300
//                           ${isPnLCard
//                             ? isPositive
//                               ? 'bg-gradient-to-r from-green-500 to-emerald-500'
//                               : 'bg-gradient-to-r from-red-500 to-rose-500'
//                             : 'bg-gradient-to-r ' + textGradient
//                           }
//                         `}></div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>




//               {/* Tabs */}
//               <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
//                 {['overview', 'transactions'].map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`flex-1 py-3 text-lg font-medium transition-colors capitalize ${
//                       activeTab === tab
//                         ? 'text-cyan-600 border-b-4 border-cyan-600'
//                         : 'text-gray-500 hover:text-cyan-600'
//                     }`}
//                   >
//                     {tab === 'overview' ? 'Portfolio Overview' : 'Transactions'}
//                   </button>
//                 ))}
//               </div>

//               {/* Tab Content */}
//               {activeTab === 'overview' ? (
//                 <>
//                   {/* Trade Section */}
//                   <div className="mb-10">
//                     {!searchMode ? (
//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => setSearchMode(true)}
//                         className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center transition"
//                       >
//                         <RiAddCircleFill className="mr-3 text-2xl" />
//                         Purchase Stock
//                       </motion.button>
//                     ) : (
//                       <div className="space-y-5">
//                         <div className="relative">
//                           <input
//                             type="text"
//                             placeholder="Search stock symbol..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-cyan-300 outline-none text-lg"
//                           />
//                           <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
//                           <button
//                             onClick={resetTradeForm}
//                             className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
//                           >
//                             <RiCloseCircleFill size={24} />
//                           </button>
//                         </div>

//                         {selectedStock ? (
//                           <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="glass-card rounded-2xl p-5"
//                           >
//                             <div className="flex justify-between items-center mb-4">
//                               <button
//                                 onClick={() => {
//                                   setSelectedStock(null);
//                                   setSearchQuery('');
//                                 }}
//                                 className="text-cyan-600 font-bold text-xl hover:underline"
//                               >
//                                 {selectedStock.Symbol}
//                               </button>
//                               <span className="text-lg font-medium">LTP: ₹{selectedStock.Close}</span>
//                             </div>
//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                               <div>
//                               <input
//                                 type="number"
//                                 placeholder="Quantity"
//                                 value={quantity}
//                                 onChange={(e) => {
//                                   const val = e.target.value;
//                                   if (val === '' || /^\d+$/.test(val)) {
//                                     setQuantity(val === '' ? '' : parseInt(val).toString());
//                                   }
//                                 }}

//                                 onKeyDown={(e) => {
//                                   if (['.', 'e', 'E', '-', '+'].includes(e.key)) e.preventDefault();
//                                 }}
//                                 className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
//                                 min="1"
//                                 step="1"
//                               />

//                               {/* Show Total Invested */}
//                               {quantity && parseInt(quantity) > 0 && (
//                                 <p className="text-sm text-gray-600 mt-1 text-right">
//                                   Total: ₹{getTotalInvested(selectedStock.Symbol, quantity)}
//                                 </p>
//                               )}
//                           </div>


//                               <select
//                                 value={exchange}
//                                 onChange={(e) => setExchange(e.target.value)}
//                                 className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
//                               >
//                                 <option>NSE</option>
//                                 <option disabled>BSE (soon)</option>
//                               </select>
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => handleBuySell('buy')}
//                                   className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl"
//                                 >
//                                   Buy
//                                 </button>
//                                 {/* <button
//                                   onClick={() => handleBuySell('sell')}
//                                   className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-3 rounded-xl"
//                                 >
//                                   Sell
//                                 </button> */}
//                               </div>
//                             </div>
//                           </motion.div>
//                         ) : searchResults.length > 0 ? (
//                           <div className="space-y-2 max-h-64 overflow-y-auto">
//                             {searchResults.map((s) => (
//                               <motion.div
//                                 key={s.Symbol}
//                                 whileHover={{ x: 4 }}
//                                 onClick={() => {
//                                   setSelectedStock(s);
//                                   setSearchQuery(s.Symbol);
//                                   setQuantity('');
//                                 }}
//                                 className="flex justify-between items-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition"
//                               >
//                                 <span className="font-semibold text-lg">{s.Symbol}</span>
//                                 <span className="text-cyan-600 font-medium">₹{s.Close}</span>
//                               </motion.div>
//                             ))}
//                           </div>
//                         ) : searchQuery ? (
//                           <p className="text-center text-gray-500 py-10">No stocks found</p>
//                         ) : null}
//                       </div>
//                     )}
//                   </div>

//                   {/* Holdings */}
//                   <div className="mb-10">
//                     <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Holdings</h3>
//                     {getHoldings().length === 0 ? (
//                       <p className="text-center text-gray-500 py-12">No holdings yet. Buy your first stock!</p>
//                     ) : (
//                       <div className="space-y-6">

//                       {/* ────────────────────── HOLDINGS – BIGGER & IN ONE LINE ────────────────────── */}


//                       {getHoldings().map((h) => {
//                         const invested = (h.qty * h.avgPrice).toFixed(2);
//                         const current   = (h.qty * h.ltp).toFixed(2);
//                         const pnl       = (h.ltp - h.avgPrice) * h.qty;
//                         const pnlPct    = h.avgPrice > 0 ? ((h.ltp - h.avgPrice) / h.avgPrice) * 100 : 0;
//                         const profit    = pnl >= 0;

//                         return (
//                           <motion.div
//                             key={h.symbol}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             className="glass-card rounded-2xl p-6"
//                           >
//                             {/* Stock name + LTP */}
//                             <div className="flex justify-between items-start mb-4">
//                               <div>
//                                 <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{h.symbol}</h4>
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <span className="text-sm text-gray-600">LTP</span>
//                                   <span className="font-bold text-lg">₹{h.ltp.toFixed(2)}</span>
//                                   <span className={`flex items-center text-sm font-medium ${profit ? 'text-green-600' : 'text-red-600'}`}>
//                                     {profit ? <FiArrowUp /> : <FiArrowDown />} {Math.abs(pnlPct).toFixed(1)}%
//                                   </span>
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 {/* <div className="text-sm text-gray-600">Avg</div>
//                                 <div className="font-bold">₹{h.avgPrice}</div>
//                                 <div className="text-xs text-gray-500">{h.qty} Qty</div> */}


//                                   <span className="text-sm text-gray-600">Avg </span>
//                                     <span className="font-bold text-lg">₹{h.avgPrice}</span>
//                                     <div className="text-xs text-gray-500">{h.qty} Qty</div>

//                               </div>
//                             </div>

//                             {/* ──── BIG VALUES + QTY + BUY/SELL IN ONE ROW ──── */}
//                             <div className="flex items-center justify-between gap-4">
//                               {/* Invested / Current / P&L */}
//                               <div className="flex-1 grid grid-cols-3 gap-6 text-center">
//                                 <div>
//                                   <div className="text-sm font-medium text-gray-600">Invested</div>
//                                   <div className="text-lg font-bold text-gray-800 dark:text-white">₹{invested}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-sm font-medium text-gray-600">Current</div>
//                                   <div className="text-lg font-bold text-gray-800 dark:text-white">₹{current}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-sm font-medium text-gray-600">P/L</div>
//                                   <div className={`text-lg font-bold ${profit ? 'text-green-600' : 'text-red-600'}`}>
//                                     {profit ? '+' : ''}₹{Math.abs(pnl).toFixed(0)}
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Qty input + Buy / Sell */}
//                               <div className="flex items-center gap-2">
//                                 <input
//                                       type="number"
//                                       placeholder="Qty"
//                                       value={getQty(h.symbol)}
//                                       onChange={(e) => {
//                                         const val = e.target.value;
//                                         if (val === '' || /^\d+$/.test(val)) {
//                                           setQty(h.symbol, val === '' ? '' : parseInt(val).toString());
//                                         }
//                                       }}
//                                       onKeyDown={(e) => {
//                                         if (['.', 'e', 'E', '-', '+'].includes(e.key)) e.preventDefault();
//                                       }}
//                                       className="w-20 px-3 py-2 text-sm border rounded-lg"
//                                       min="1"
//                                       step="1"
//                                     />
//                                   {getQty(h.symbol) && parseInt(getQty(h.symbol)) > 0 && (
//                                     <p className="text-xs text-gray-500 mt-1 text-right">
//                                       ₹{getTotalInvested(h.symbol, getQty(h.symbol))}
//                                     </p>
//                                   )}
//                                 <button
//                                   onClick={() => {
//                                     const q = parseFloat(getQty(h.symbol)) || 0;
//                                     if (q <= 0) return toast.error('Enter valid quantity');
//                                     const stock = stockData.find((s) => s.Symbol === h.symbol);
//                                     if (!stock) return;
//                                     setSelectedStock(stock);
//                                     setQuantity(q.toString());
//                                     setConfirmAction('buy');
//                                     setShowConfirmModal(true);
//                                   }}
//                                   className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-lg font-medium"
//                                 >
//                                   Buy
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     const q = parseFloat(getQty(h.symbol)) || 0;
//                                     if (q <= 0) return toast.error('Enter quantity');
//                                     if (q > h.qty) return toast.error(`Only ${h.qty} available`);
//                                     const stock = stockData.find((s) => s.Symbol === h.symbol);
//                                     if (!stock) return;
//                                     setSelectedStock(stock);
//                                     setQuantity(q.toString());
//                                     setConfirmAction('sell');
//                                     setShowConfirmModal(true);
//                                   }}
//                                   className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm rounded-lg font-medium"
//                                 >
//                                   Sell
//                                 </button>
//                               </div>
//                             </div>
//                           </motion.div>
//                         );
//                       })}

//                       </div>
//                     )}
//                   </div>

//                   {/* Closed Trades */}
//                   <div>
//                     <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Closed Trades</h3>
//                     {getClosedTrades().length === 0 ? (
//                       <p className="text-center text-gray-500 py-12">No closed trades yet.</p>
//                     ) : (
//                       <div className="space-y-6">
//                         {getClosedTrades().map((trade) => {
//                           const invested = (trade.qty * trade.avgPrice).toFixed(2);
//                           const sold = (parseFloat(invested) + trade.pnl).toFixed(2);
//                           const profit = trade.pnl >= 0;
//                           const pnlPct =
//                             trade.avgPrice > 0
//                               ? (trade.pnl / (trade.qty * trade.avgPrice)) * 100
//                               : 0;
//                           return (
//                             <motion.div
//                               key={`${trade.symbol}-${trade.sellDate}`}
//                               initial={{ opacity: 0, x: -20 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               className="glass-card rounded-2xl p-6"
//                             >
//                               <div className="flex justify-between items-start mb-4">
//                                 <div>
//                                   <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{trade.symbol}</h4>
//                                   <div className="flex items-center gap-2 mt-1">
//                                     <span className="text-sm text-gray-600">Avg</span>
//                                     <span className="font-bold text-lg">₹{trade.avgPrice}</span>
//                                     <span
//                                       className={`flex items-center text-sm font-medium ${
//                                         profit ? 'text-green-600' : 'text-red-600'
//                                       }`}
//                                     >
//                                       {profit ? <FiArrowUp /> : <FiArrowDown />} {Math.abs(pnlPct).toFixed(1)}%
//                                     </span>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <div className="text-xs text-gray-500">{trade.qty} Qty</div>
//                                   <div className="badge-closed">Closed</div>
//                                 </div>
//                               </div>

//                               <div className="grid grid-cols-3 gap-4 text-center">
//                                 <div>
//                                   <div className="text-xs text-gray-600">Invested</div>
//                                   <div className="font-semibold">₹{invested}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-xs text-gray-600">Sold</div>
//                                   <div className="font-semibold">₹{sold}</div>
//                                 </div>
//                                 <div>
//                                   <div className="text-xs text-gray-600">P/L</div>
//                                   <div className={`font-semibold ${profit ? 'text-green-600' : 'text-red-600'}`}>
//                                     {profit ? '+' : ''}₹{Math.abs(trade.pnl).toFixed(0)}
//                                   </div>
//                                 </div>
//                               </div>
//                             </motion.div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 /* Transactions Tab */
//                 <div>

//                    {/* Instructional Note with Link */}
//                     <div className="flex justify-end mb-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
//                       To perform a detailed analysis, download your transaction data and upload it on the{' '}
//                       <Link
//                         to="/portfolio"
//                         className="font-medium text-cyan-600 hover:underline"
//                       >
//                         Upload File
//                       </Link>{' '}
//                       page.
//                     </p>
//                     </div>

//                   <div className="flex justify-end mb-4">
//                         <button
//                           onClick={downloadCSV}
//                           className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition"
//                         >
//                           Download CSV
//                         </button>
//                   </div>

//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Transaction History</h3>
//                     <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
//                       {[
//                         { k: 'all', l: 'All' },
//                         { k: '3d', l: '3D' },
//                         { k: '1w', l: '1W' },
//                         { k: '2w', l: '2W' },
//                         { k: '1m', l: '1M' },
//                         { k: '3m', l: '3M' },
//                         { k: '1y', l: '1Y' },
//                       ].map(({ k, l }) => (
//                         <button
//                           key={k}
//                           onClick={() => setBrokerageFilter(k)}
//                           className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
//                             brokerageFilter === k
//                               ? 'bg-white dark:bg-gray-900 text-cyan-600 shadow-md'
//                               : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600'
//                           }`}
//                         >
//                           {l}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="overflow-x-auto rounded-xl">
//                     <table className="w-full text-sm">
//                       <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
//                         <tr>
//                           {[
//                             'Symbol',
//                             'Date & Time',
//                             'Qty',
//                             'Price',
//                             'Value',
//                             'Brokerage',
//                             'Frame',
//                             'Exchange',
//                             'Type',
//                             'Action',
//                           ].map((h) => (
//                             <th key={h} className="text-left p-4 font-medium">
//                               {h}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                         {getFilteredTransactions().length === 0 ? (
//                           <tr>
//                             <td colSpan={10} className="text-center py-12 text-gray-500">
//                               No transactions in selected period
//                             </td>
//                           </tr>
//                         ) : (
//                           getFilteredTransactions().map((t, i) => (
//                             <motion.tr
//                               key={i}
//                               initial={{ opacity: 0 }}
//                               animate={{ opacity: 1 }}
//                               transition={{ delay: i * 0.03 }}
//                               className="hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition"
//                             >
//                               <td className="p-4 font-medium">{t.Symbol}</td>
//                               <td className="p-4 font-mono text-xs">{t.DateTime}</td>
//                               <td className="p-4">{t.Qty}</td>
//                               <td className="p-4">₹{t.Price}</td>
//                               <td className="p-4">₹{t.MarketValue}</td>
//                               <td className="p-4">₹{t.BrokerageAmount}</td>
//                               <td className="p-4 font-medium">{t.frame}</td>
//                               <td className="p-4">{exchange}</td>
//                               <td className="p-4">
//                                 <span
//                                   className={`px-3 py-1 rounded-full text-xs font-bold ${
//                                     t.OrderType === 'B'
//                                       ? 'bg-green-100 text-green-700'
//                                       : 'bg-red-100 text-red-700'
//                                   }`}
//                                 >
//                                   {t.OrderType === 'B' ? 'BUY' : 'SELL'}
//                                 </span>
//                               </td>
//                               <td className="p-4">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     const id = t.ID || t.Id || t.id;
//                                     if (id) deleteTransaction(id);
//                                   }}
//                                   className="text-red-600 hover:text-red-800 transition"
//                                   title="Delete"
//                                 >
//                                   <RiDeleteBinLine size={18} />
//                                 </button>
//                               </td>
//                             </motion.tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </div>

//         {/* ──────── MODALS ──────── */}
//         {/* Create Modal */}
//         <AnimatePresence>
//           {showCreateModal && (
//             <ModalBackdrop onClick={() => setShowCreateModal(false)}>
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="glass-card rounded-3xl p-8 max-w-md w-full"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <h3 className="text-2xl font-bold mb-6 text-center">Create New Corpus</h3>
//                 <input
//                   type="text"
//                   placeholder="Portfolio Name"
//                   value={newPortfolioName}
//                   onChange={(e) => setNewPortfolioName(e.target.value)}
//                   className="w-full mb-4 px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-lg"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Initial Corpus (₹)"
//                   value={newCorpus}
//                   onChange={(e) => setNewCorpus(e.target.value)}
//                   className="w-full mb-6 px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-lg"
//                 />
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setShowCreateModal(false)}
//                     className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={createPortfolio}
//                     className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl font-bold"
//                   >
//                     Create
//                   </button>
//                 </div>
//               </motion.div>
//             </ModalBackdrop>
//           )}
//         </AnimatePresence>

//         {/* Edit Modal */}
//         <AnimatePresence>
//           {showEditModal && editingPortfolio && (
//             <ModalBackdrop onClick={() => setShowEditModal(false)}>
//               <motion.div
//                   initial={{ scale: 0.95, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   exit={{ scale: 0.95, opacity: 0 }}
//                   className="rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto
//                             bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
//                             border border-gray-200 dark:border-gray-700
//                             shadow-xl text-gray-800 dark:text-gray-100"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                 <h3 className="text-2xl font-bold mb-6 text-center">Edit Portfolio</h3>
//                 <input
//                   type="text"
//                   value={editName}
//                   onChange={(e) => setEditName(e.target.value)}
//                   className="w-full mb-4 px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-lg"
//                 />
//                 <input
//                   type="number"
//                   value={editCorpus}
//                   onChange={(e) => setEditCorpus(e.target.value)}
//                   className="w-full mb-6 px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-lg"
//                 />
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setShowEditModal(false)}
//                     className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={editPortfolio}
//                     className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl font-bold"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </motion.div>
//             </ModalBackdrop>
//           )}
//         </AnimatePresence>

//         {/* Confirm Trade Modal */}
//         <AnimatePresence>
//           {showConfirmModal && selectedStock && (
//             <ModalBackdrop>
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="glass-card rounded-3xl p-8 max-w-lg w-full"
//               >
//                 <RiCheckboxCircleFill
//                   className={`mx-auto text-6xl mb-4 ${
//                     confirmAction === 'buy' ? 'text-green-500' : 'text-red-500'
//                   }`}
//                 />
//                 <h3 className="text-2xl font-bold text-center mb-6">
//                   Confirm {confirmAction === 'buy' ? 'Buy' : 'Sell'}
//                 </h3>
//                 <div className="space-y-3 text-lg">
//                   <div className="flex justify-between">
//                     <span>Symbol:</span>
//                     <span className="font-bold">{selectedStock.Symbol}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Quantity:</span>
//                     <span className="font-bold">{quantity}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Price:</span>
//                     <span>₹{selectedStock.Close}</span>
//                   </div>
//                   <div className="flex justify-between font-bold">
//                     <span>Trade Value:</span>
//                     <span>₹{(parseFloat(quantity) * selectedStock.Close).toFixed(2)}</span>
//                   </div>

//                   {confirmAction === 'buy' && (
//                     <>
//                       <div className="flex justify-between text-orange-600">
//                         <span>Brokerage:</span>
//                         <span>₹{Math.min(0.0003 * (parseFloat(quantity) * selectedStock.Close), 20).toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between font-bold text-xl border-t pt-3">
//                         <span>Total Cost:</span>
//                         <span>₹{(parseFloat(quantity) * selectedStock.Close + Math.min(0.0003 * (parseFloat(quantity) * selectedStock.Close), 20)).toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-500">
//                         <span>Available Corpus:</span>
//                         <span>₹{selectedPortfolio.corpus.toFixed(2)}</span>
//                       </div>
//                     </>
//                   )}

//                   {confirmAction === 'sell' && (
//                     <>
//                       <div className="flex justify-between text-orange-600">
//                         <span>Brokerage:</span>
//                         <span>₹{(0.0005 * (parseFloat(quantity) * selectedStock.Close)).toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between font-bold text-xl border-t pt-3">
//                         <span>Net Proceeds:</span>
//                         <span>₹{(parseFloat(quantity) * selectedStock.Close - 0.0005 * (parseFloat(quantity) * selectedStock.Close)).toFixed(2)}</span>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 <div className="flex gap-3 mt-8">
//                   <button
//                     onClick={() => setShowConfirmModal(false)}
//                     className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmTrade}
//                     className={`flex-1 py-3 rounded-xl font-bold text-white ${
//                       confirmAction === 'buy'
//                         ? 'bg-gradient-to-r from-green-500 to-emerald-600'
//                         : 'bg-gradient-to-r from-red-500 to-rose-600'
//                     }`}
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </motion.div>
//             </ModalBackdrop>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Global CSS helpers */}
//       <style jsx>{`
//         .glass-card {
//           background: rgba(255, 255, 255, 0.25);
//           backdrop-filter: blur(12px);
//           -webkit-backdrop-filter: blur(12px);
//           border: 1px solid rgba(255, 255, 255, 0.3);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//         }
//         .badge-closed {
//            @apply px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full;
//         }
//       `}</style>
//     </>
//   );
// }

// /* Reusable Modal Backdrop */
// const ModalBackdrop = ({ children, onClick }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
//     onClick={onClick}
//   >
//     <div
//       className="w-full max-w-lg mx-auto rounded-3xl p-8 max-h-[90vh] overflow-y-auto
//                  bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
//                  border border-gray-200 dark:border-gray-700
//                  shadow-xl text-gray-800 dark:text-gray-100"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {children}
//     </div>
//   </motion.div>
// );


////////////////////////////////////////////////////////////// new code by Digambar////////////////////////

// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {
//   RiSearchLine,
//   RiAddCircleFill,
//   RiDeleteBinLine,
//   RiEdit2Line,
//   RiCloseCircleFill,
//   RiCheckboxCircleFill,
// } from 'react-icons/ri';
// import { FaLock, FaExclamationTriangle } from 'react-icons/fa';
// import { AiOutlinePlus, AiOutlineDownload } from 'react-icons/ai';
// import { GiStairsGoal } from 'react-icons/gi';
// import { BiTrendingUp } from 'react-icons/bi';
// import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
// import { Link, useNavigate } from 'react-router-dom';
// import Navbar from '../Navbar';
// import { saveAs } from 'file-saver';

// export default function PaperTrading() {
//   /* ────────────────────── AUTH ────────────────────── */
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const getToken = () => {
//     const t = localStorage.getItem('authToken');
//     return t && t !== 'null' ? t : null;
//   };
//   const navigate = useNavigate();

//   /* ────────────────────── LOADING ────────────────────── */
//   const [loading, setLoading] = useState(false);

//   /* ────────────────────── CSV DOWNLOAD ────────────────────── */
//   const downloadCSV = () => {
//     const rows = selectedPortfolio?.transactions || [];
//     if (!rows.length) return;

//     const headers = [
//       'Symbol',
//       'Date',
//       'Time',
//       'OrderType',
//       'Qty',
//       'Price',
//       'MarketValue',
//       'BrokerageAmount',
//     ];

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => {
//         const [date, time] = (row.DateTime || '').split(' ');
//         return headers
//           .map(h => {
//             const value = h === 'Date' ? date : h === 'Time' ? time : row[h] ?? '';
//             return `"${value}"`;
//           })
//           .join(',');
//       }),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, `${selectedPortfolio.name}_transactions.csv`);
//   };

//   /* ────────────────────── PORTFOLIOS ────────────────────── */
//   const [portfolios, setPortfolios] = useState([]);
//   const [selectedPortfolio, setSelectedPortfolio] = useState(null);

//   /* ────────────────────── TABS ────────────────────── */
//   const [activeTab, setActiveTab] = useState('overview');

//   /* ────────────────────── Book profit ────────────────────── */
//   const calculateTotalBookProfit = useCallback((transactions) => {
//     if (!transactions || transactions.length === 0) return 0;

//     const sorted = [...transactions].sort((a, b) => {
//       const aDate = new Date(a.DateTime || '');
//       const bDate = new Date(b.DateTime || '');
//       return aDate - bDate;
//     });

//     const holdings = {};
//     let totalProfit = 0;

//     sorted.forEach(tx => {
//       const symbol = tx.Symbol;
//       const qty = parseFloat(tx.Qty) || 0;
//       const price = parseFloat(tx.Price) || 0;

//       if (!holdings[symbol]) {
//         holdings[symbol] = { qty: 0, cost: 0 };
//       }

//       if (tx.OrderType === 'B') {
//         holdings[symbol].qty += qty;
//         holdings[symbol].cost += qty * price;
//       } else if (tx.OrderType === 'S') {
//         const avgCost = holdings[symbol].qty > 0
//           ? holdings[symbol].cost / holdings[symbol].qty
//           : 0;
//         const profit = qty * (price - avgCost);
//         totalProfit += profit;

//         holdings[symbol].qty -= qty;
//         holdings[symbol].cost -= avgCost * qty;

//         if (holdings[symbol].qty < 0.001) {
//           holdings[symbol].qty = 0;
//           holdings[symbol].cost = 0;
//         }
//       }
//     });

//     return totalProfit;
//   }, []);

//   const totalBookProfit = useMemo(() => {
//     return selectedPortfolio
//       ? calculateTotalBookProfit(selectedPortfolio.transactions || [])
//       : 0;
//   }, [selectedPortfolio, calculateTotalBookProfit]);

//   /* ────────────────────── CREATE / EDIT / MODALS ────────────────────── */
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newPortfolioName, setNewPortfolioName] = useState('');
//   const [newCorpus, setNewCorpus] = useState('');
//   const [showEditMenu, setShowEditMenu] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingPortfolio, setEditingPortfolio] = useState(null);
//   const [editName, setEditName] = useState('');
//   const [editCorpus, setEditCorpus] = useState('');

//   /* ────────────────────── TRADE UI ────────────────────── */
//   const [searchMode, setSearchMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [exchange, setExchange] = useState('NSE');
//   const [quantity, setQuantity] = useState('');
//   const [quantities, setQuantities] = useState({});
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [confirmAction, setConfirmAction] = useState('buy');

//   /* ────────────────────── STOCK DATA ────────────────────── */
//   const [stockData, setStockData] = useState([]);

//   /* ────────────────────── FILTER STATE ────────────────────── */
//   const [brokerageFilter, setBrokerageFilter] = useState('all');

//   /* ────────────────────── FETCH STOCK LIST ────────────────────── */
//   useEffect(() => {
//     const fetchStocks = async () => {
//       try {
//         const res = await axios.post(`${API_BASE}/file/build_Portfolio`);
//         setStockData(res.data.portfolio_data || []);
//       } catch (err) {
//         toast.error('Failed to load stock list');
//       }
//     };
//     fetchStocks();
//   }, [API_BASE]);

//   /* ────────────────────── SEARCH (client-side) ────────────────────── */
//   useEffect(() => {
//     if (!searchQuery) {
//       setSearchResults([]);
//       return;
//     }
//     const filtered = stockData.filter((s) =>
//       s.Symbol.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setSearchResults(filtered);
//   }, [searchQuery, stockData]);

//   /* ────────────────────── CHECK LOGIN ────────────────────── */
//   useEffect(() => {
//     const token = getToken();
//     setIsLoggedIn(!!token);
//   }, []);

//   /* ────────────────────── HELPERS ────────────────────── */
//   const getQty = (symbol) => quantities[symbol] || '';
//   const setQty = (symbol, value) => {
//     setQuantities(prev => ({ ...prev, [symbol]: value }));
//   };

//   const totalBrokerage = useMemo(() => {
//     if (!selectedPortfolio?.transactions) return 0;
//     return selectedPortfolio.transactions.reduce((sum, t) => {
//       return sum + parseFloat(t.BrokerageAmount || 0);
//     }, 0);
//   }, [selectedPortfolio]);

//   const getTotalInvested = (symbol, qtyStr) => {
//     const qty = parseInt(qtyStr) || 0;
//     const stock = stockData.find(s => s.Symbol === symbol);
//     if (!stock || qty === 0) return '0.00';
//     return (qty * stock.Close).toFixed(2);
//   };

//   /* ────────────────────── FETCH PORTFOLIOS ────────────────────── */
//   const fetchPortfolios = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       setIsLoggedIn(false);
//       toast.error('Please log in to view your portfolios.');
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/paper-trade/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const options = processPortfolios(res.data || []);
//       setPortfolios(options);

//       if (options.length > 0 && !selectedPortfolio) {
//         setSelectedPortfolio(options[0]);
//       }
//     } catch (e) {
//       console.error(e);
//       toast.error(e.response?.data?.message || 'Failed to load portfolios');
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE]);

//   useEffect(() => {
//     const token = getToken();
//     if (token) {
//       setIsLoggedIn(true);
//       fetchPortfolios();
//     } else {
//       setIsLoggedIn(false);
//       setLoading(false);
//     }
//   }, [fetchPortfolios]);

//   /* ────────────────────── PROCESS RAW PORTFOLIOS ────────────────────── */
//   const processPortfolios = (raw) => {
//     return raw.map((p) => ({
//       displayName: p.displayName || `Portfolio ${p.series}`,
//       name: p.displayName || `Portfolio ${p.series}`,
//       value: p.series?.toString() || '',
//       corpus: Number(p.corpus),
//       data: Array.isArray(p.data)
//         ? p.data.map((item) => {
//             let dateObj = new Date();
//             if (typeof item.Date === 'string' && item.Date.includes('/')) {
//               const [day, month, year] = item.Date.split('/');
//               dateObj = new Date(`${year}-${month}-${day}T${item.Time || '00:00:00'}`);
//             } else if (typeof item.Date === 'number' || !isNaN(parseInt(item.Date))) {
//               dateObj = new Date(parseInt(item.Date));
//             }
//             const formattedDate = dateObj.toLocaleDateString('en-GB', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric',
//             });
//             const formattedTime = dateObj.toLocaleTimeString('en-GB', {
//               hour12: false,
//               hour: '2-digit',
//               minute: '2-digit',
//               second: '2-digit',
//             });
//             const dateTimeStr = `${formattedDate} ${formattedTime}`;
//             return {
//               ...item,
//               Qty: item.Qty?.toString() || '0',
//               Price: parseFloat(item.Price || 0).toFixed(2),
//               MarketValue: parseFloat(item.MarketValue || 0).toFixed(2),
//               BrokerageAmount: isNaN(item.BrokerageAmount)
//                 ? '0.00'
//                 : parseFloat(item.BrokerageAmount).toFixed(2),
//               DateTime: dateTimeStr,
//               frame: item.Frame || item.frame || '—',
//             };
//           })
//         : [],
//       transactions: Array.isArray(p.data)
//         ? p.data.map((item) => {
//             let dateObj = new Date();
//             if (typeof item.Date === 'string' && item.Date.includes('/')) {
//               const [day, month, year] = item.Date.split('/');
//               dateObj = new Date(`${year}-${month}-${day}T${item.Time || '00:00:00'}`);
//             } else if (typeof item.Date === 'number' || !isNaN(parseInt(item.Date))) {
//               dateObj = new Date(parseInt(item.Date));
//             }
//             const formattedDate = dateObj.toLocaleDateString('en-GB', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric',
//             });
//             const formattedTime = dateObj.toLocaleTimeString('en-GB', {
//               hour12: false,
//               hour: '2-digit',
//               minute: '2-digit',
//               second: '2-digit',
//             });
//             return {
//               ...item,
//               DateTime: `${formattedDate} ${formattedTime}`,
//               frame: item.Frame || item.frame || '—',
//             };
//           })
//         : [],
//       tableName: p.internalTableName,
//     }));
//   };

//   /* ────────────────────── CREATE / EDIT / DELETE / SAVE / TRADE ────────────────────── */
//   const createPortfolio = async () => {
//     const token = getToken();
//     if (!token) return toast.error('Please log in.');
//     if (!newPortfolioName || !newCorpus) return;

//     try {
//       await axios.post(
//         `${API_BASE}/paper-trade/create?name=${encodeURIComponent(newPortfolioName)}&corpus=${newCorpus}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Portfolio created');
//       setShowCreateModal(false);
//       setNewPortfolioName('');
//       setNewCorpus('');
//       fetchPortfolios();
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to create portfolio');
//     }
//   };

//   const editPortfolio = async () => {
//     const token = getToken();
//     if (!token || !editingPortfolio) return;

//     try {
//       await axios.patch(
//         `${API_BASE}/paper-trade/edit`,
//         {},
//         {
//           params: {
//             portfolioname: editingPortfolio.name,
//             ...(editName && editName !== editingPortfolio.name && { newName: editName }),
//             ...(editCorpus && { corpus: editCorpus }),
//           },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success('Portfolio updated');
//       setShowEditModal(false);
//       setEditingPortfolio(null);
//       setEditName('');
//       setEditCorpus('');
//       await fetchPortfolios();
//     } catch (e) {
//       toast.error(e.response?.data?.error || 'Failed to update');
//     }
//   };

//   const deleteTransaction = async (transactionId) => {
//     const token = getToken();
//     if (!token || !selectedPortfolio) return;

//     if (!window.confirm('Delete this transaction?')) return;

//     try {
//       await axios.delete(`${API_BASE}/paper-trade/transaction-delete`, {
//         params: { portfolioname: selectedPortfolio.name, transactionId },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Transaction deleted');
//       fetchPortfolios();
//     } catch (e) {
//       toast.error(e.response?.data?.error || 'Failed to delete');
//     }
//   };

//   const deletePortfolio = async (name) => {
//     const token = getToken();
//     if (!token) return toast.error('Please log in.');

//     try {
//       await axios.delete(`${API_BASE}/paper-trade/delete?portfolioname=${name}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Portfolio deleted');
//       fetchPortfolios();
//       if (selectedPortfolio?.name === name) {
//         setSelectedPortfolio(portfolios[0] || null);
//       }
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to delete');
//     }
//   };

//   const saveTransaction = async (transaction, portfolioName) => {
//     const token = getToken();
//     if (!token) {
//       toast.error('Not logged in.');
//       return;
//     }

//     try {
//       const payload = [transaction];
//       await axios.post(
//         `${API_BASE}/paper-trade/save?portfolioname=${portfolioName}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       toast.success(
//         `${transaction.OrderType === 'B' ? 'Bought' : 'Sold'} ${transaction.Qty} ${transaction.Symbol}`
//       );
//       await fetchPortfoliosAndSelectCurrent(portfolioName);
//       resetTradeForm();
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Trade failed');
//       throw e;
//     }
//   };

//   const resetTradeForm = () => {
//     setSearchMode(false);
//     setSearchQuery('');
//     setSelectedStock(null);
//     setQuantity('');
//     setExchange('NSE');
//   };

//   const handleBuySell = (action) => {
//     if (!selectedStock || !quantity || parseFloat(quantity) <= 0 || !selectedPortfolio) {
//       toast.error('Enter a valid quantity');
//       return;
//     }
//     setConfirmAction(action);
//     setShowConfirmModal(true);
//   };

//   const fetchPortfoliosAndSelectCurrent = async (portfolioName) => {
//     const token = getToken();
//     if (!token || !portfolioName) return;

//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/paper-trade/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const options = processPortfolios(res.data || []);
//       setPortfolios(options);
//       const updated = options.find((p) => p.name === portfolioName);
//       if (updated) setSelectedPortfolio(updated);
//     } catch (e) {
//       console.error(e);
//       toast.error(e.response?.data?.message || 'Failed to refresh');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateCorpusOnServer = async (newCorpus) => {
//     const token = getToken();
//     if (!token || !selectedPortfolio) return;

//     try {
//       await axios.patch(
//         `${API_BASE}/paper-trade/edit`,
//         {},
//         {
//           params: { portfolioname: selectedPortfolio.name, corpus: newCorpus },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (e) {
//       toast.error('Failed to update corpus on server');
//       console.error(e);
//     }
//   };

//   const confirmTrade = async () => {
//     if (!selectedStock || !quantity || parseInt(quantity) <= 0 || !Number.isInteger(parseInt(quantity))) {
//       toast.error('Invalid quantity');
//       return;
//     }

//     const qty = parseFloat(quantity);
//     const price = selectedStock.Close;
//     const orderType = confirmAction === 'buy' ? 'B' : 'S';
//     const tradeValue = qty * price;
//     const brokerageAmount =
//       orderType === 'B' ? Math.min(0.0003 * tradeValue, 20) : 0.0005 * tradeValue;
//     const totalCost = tradeValue + brokerageAmount;
//     const totalProceeds = tradeValue - brokerageAmount;
//     const currentCorpus = selectedPortfolio.corpus;

//     if (orderType === 'B' && totalCost > currentCorpus) {
//       toast.error(
//         `Insufficient corpus! Need ₹${totalCost.toFixed(2)}, Available: ₹${currentCorpus.toFixed(2)}`
//       );
//       setShowConfirmModal(false);
//       return;
//     }

//     if (orderType === 'S') {
//       const holding = getHoldings().find((h) => h.symbol === selectedStock.Symbol);
//       if (!holding || qty > holding.qty) {
//         toast.error(`Cannot sell ${qty}. Only ${holding?.qty || 0} available.`);
//         setShowConfirmModal(false);
//         return;
//       }
//     }

//     const updatedCorpus = orderType === 'B' ? currentCorpus - totalCost : currentCorpus + totalProceeds;
//     const portfolioName = selectedPortfolio.name;

//     // Business date logic (unchanged)
//     const getPreviousTradingDay = () => {
//       const date = new Date();
//       const day = date.getDay();
//       if (day === 0 || day === 6 || day === 1) {
//         const daysToFriday = day === 0 ? 2 : day === 6 ? 1 : 3;
//         date.setDate(date.getDate() - daysToFriday);
//         return date;
//       }
//       date.setDate(date.getDate() - 1);
//       return date;
//     };

//     const tradeDate = getPreviousTradingDay();

//     const transaction = {
//       Symbol: selectedStock.Symbol,
//       Date: tradeDate.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       }),
//       Time: new Date().toLocaleTimeString('en-GB', {
//         hour12: false,
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//       }),
//       OrderType: orderType,
//       Qty: qty.toString(),
//       Price: price.toFixed(2),
//       MarketValue: tradeValue.toFixed(2),
//       BrokerageAmount: brokerageAmount.toFixed(2),
//     };

//     try {
//       await saveTransaction(transaction, portfolioName);
//       await updateCorpusOnServer(updatedCorpus);
//       await fetchPortfoliosAndSelectCurrent(portfolioName);
//     } catch (err) {
//       toast.error('Trade failed – corpus reverted');
//       console.error(err);
//     } finally {
//       setShowConfirmModal(false);
//     }
//   };

//   const getFilteredTransactions = () => {
//     if (!selectedPortfolio?.transactions) return [];
//     const now = new Date();
//     const cutoffMap = { '3d': 3, '1w': 7, '2w': 14, '1m': 30, '3m': 90, '1y': 365 };
//     if (brokerageFilter === 'all') return selectedPortfolio.transactions;
//     const days = cutoffMap[brokerageFilter];
//     const cutoff = new Date(now);
//     cutoff.setDate(now.getDate() - days);
//     return selectedPortfolio.transactions.filter((t) => {
//       const [dateStr] = t.DateTime.split(' ');
//       const [d, m, y] = dateStr.split('/');
//       const txDate = new Date(`${y}-${m}-${d}`);
//       return txDate >= cutoff;
//     });
//   };

//   const getClosedTrades = () => {
//     if (!selectedPortfolio || !Array.isArray(selectedPortfolio.transactions)) return [];
//     const trades = {};
//     const sellEvents = {};
//     selectedPortfolio.transactions.forEach((t) => {
//       const symbol = t.Symbol;
//       const qty = parseFloat(t.Qty) || 0;
//       const price = parseFloat(t.Price) || 0;
//       const dateTime = t.DateTime || '01/01/1970 00:00:00';
//       const date = dateTime.split(' ')[0];
//       if (!trades[symbol]) trades[symbol] = { buy: 0, sell: 0, invested: 0, soldValue: 0 };
//       if (t.OrderType === 'B') {
//         trades[symbol].buy += qty;
//         trades[symbol].invested += qty * price;
//       } else {
//         trades[symbol].sell += qty;
//         trades[symbol].soldValue += qty * price;
//         if (!sellEvents[symbol]) sellEvents[symbol] = date;
//       }
//     });
//     return Object.entries(trades)
//       .filter(([, t]) => Math.abs(t.buy - t.sell) < 0.001)
//       .map(([symbol, t]) => {
//         const avgBuy = t.buy > 0 ? (t.invested / t.buy).toFixed(2) : '0.00';
//         const pnl = (t.soldValue - t.invested).toFixed(2);
//         return {
//           symbol,
//           qty: t.buy,
//           avgPrice: avgBuy,
//           pnl: parseFloat(pnl),
//           sellDate: sellEvents[symbol] || 'Unknown',
//         };
//       })
//       .sort((a, b) => b.sellDate.localeCompare(a.sellDate));
//   };

//   const getHoldings = () => {
//     if (!selectedPortfolio) return [];
//     const holdings = {};
//     selectedPortfolio.transactions.forEach((t) => {
//       if (!holdings[t.Symbol]) holdings[t.Symbol] = { qty: 0, invested: 0 };
//       const qty = parseFloat(t.Qty);
//       if (t.OrderType === 'B') {
//         holdings[t.Symbol].qty += qty;
//         holdings[t.Symbol].invested += qty * parseFloat(t.Price);
//       } else {
//         holdings[t.Symbol].qty -= qty;

//         const avgPrice =
//           holdings[t.Symbol].qty + qty > 0
//             ? holdings[t.Symbol].invested / (holdings[t.Symbol].qty + qty)
//             : 0;

//         holdings[t.Symbol].invested -= avgPrice * qty;
//       }
//     });
//     return Object.entries(holdings)
//       .filter(([, h]) => h.qty > 0)
//       .map(([symbol, h]) => {
//         const avg = (h.invested / h.qty).toFixed(2);
//         const ltp = stockData.find((s) => s.Symbol === symbol)?.Close || 0;
//         return { symbol, qty: h.qty, avgPrice: avg, ltp };
//       });
//   };

//   /* ────────────────────── NOT LOGGED IN ────────────────────── */
//   if (!isLoggedIn) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
//         <Navbar />
//         <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="glass-card rounded-3xl p-12 max-w-md w-full text-center shadow-2xl"
//           >
//             <FaLock className="mx-auto text-cyan-600 dark:text-cyan-400 text-6xl mb-6" />
//             <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-gray-600 mb-4">
//               Please Login First
//             </h1>
//             <button
//               onClick={() => navigate('/login')}
//               className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-10 rounded-full transition shadow-lg hover:shadow-xl"
//             >
//               Login
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   /* ────────────────────── RENDER ────────────────────── */
//   return (
//     <>
//       <ToastContainer position="top-right" theme="colored" />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 relative">
//         <Navbar />

//         {/* Floating hero glows */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl top-20 left-20 animate-pulse" />
//           <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse" />
//         </div>

//         <div className="w-full mx-auto px-6 pt-24 pb-16 relative z-10 max-w-7xl">
//           {/* Header Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-center mb-8"
//           >
//             <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Paper Trading</h1>
//             <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
//               Practice strategies with live market data — zero risk
//             </p>

//             {/* Disclaimer moved below header */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="mt-6 bg-gradient-to-r from-orange-400 to-amber-500 text-white py-3 px-6 rounded-2xl shadow-lg max-w-2xl mx-auto"
//             >
//               <div className="flex items-center justify-center gap-3">
//                 <FaExclamationTriangle className="text-lg" />
//                 <p className="text-sm font-medium text-center">
//                   This is a paper trading platform — virtual funds only. No actual shares are exchanged.
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Loading */}
//           {loading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="flex justify-center py-8"
//             >
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-600"></div>
//             </motion.div>
//           )}

//           {/* Portfolio Controls */}
//           {portfolios.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex items-center justify-center mb-8 gap-4"
//             >
//               {/* Portfolio selector */}
//               <motion.div 
//                 whileHover={{ scale: 1.02 }}
//                 className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/70 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-sm"
//               >
//                 <select
//                   value={selectedPortfolio?.name || ''}
//                   onChange={(e) => {
//                     const p = portfolios.find(pf => pf.name === e.target.value);
//                     if (p) setSelectedPortfolio(p);
//                   }}
//                   className="bg-transparent px-2 py-1 outline-none text-sm font-medium"
//                 >
//                   {portfolios.map((p) => (
//                     <option key={p.name} value={p.name}>{p.name}</option>
//                   ))}
//                 </select>
//               </motion.div>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowCreateModal(true)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium hover:from-cyan-700 hover:to-blue-700 transition-shadow shadow-md"
//               >
//                 <AiOutlinePlus /> New Portfolio
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={downloadCSV}
//                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
//               >
//                 <AiOutlineDownload className="text-lg" />
//                 <span className="text-sm font-medium">Export</span>
//               </motion.button>
//             </motion.div>
//           )}

//           {/* No portfolios UI */}
//           {portfolios.length === 0 && !loading && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="glass-card rounded-2xl p-8 text-center shadow-xl max-w-md mx-auto"
//             >
//               <RiAddCircleFill className="mx-auto text-cyan-600 text-4xl mb-3" />
//               <h3 className="text-xl font-bold mb-2">Create Your First Portfolio</h3>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowCreateModal(true)}
//                 className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto text-sm"
//               >
//                 <AiOutlinePlus /> Create Portfolio
//               </motion.button>
//             </motion.div>
//           )}

//           {/* Portfolio Cards - Reduced Size */}
//           {portfolios.length > 0 && (
//             <div className="relative mb-8">
//               <div className="overflow-x-auto pt-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-cyan-400">
//                 <div className="flex gap-4 pl-4 pr-4 min-w-max">
//                   {portfolios.map((p, i) => {
//                     const isSelected = selectedPortfolio?.name === p.name;
//                     return (
//                       <motion.div
//                         key={p.name}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: i * 0.04 }}
//                         whileHover={{ scale: 1.02 }}
//                         onClick={() => setSelectedPortfolio(p)}
//                         className={`relative flex-shrink-0 w-64 snap-center rounded-xl p-4 cursor-pointer bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 shadow-lg transform scale-105 border-blue-400' : 'hover:shadow-md border-white/50'}`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex-1">
//                             <h3 className="text-base font-bold text-gray-800 dark:text-white truncate">{p.name}</h3>
//                             <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Corpus: <span className="font-semibold text-cyan-600">₹{p.corpus?.toLocaleString()}</span></p>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <motion.button
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               onClick={(e) => { e.stopPropagation(); setShowEditMenu(showEditMenu === p.name ? null : p.name); }}
//                               className="text-gray-500 hover:text-cyan-600 p-1 rounded transition text-sm"
//                             >
//                               <RiEdit2Line />
//                             </motion.button>
//                             <AnimatePresence>
//                               {showEditMenu === p.name && (
//                                 <motion.div 
//                                   initial={{ opacity: 0, y: -8, scale: 0.9 }} 
//                                   animate={{ opacity: 1, y: 0, scale: 1 }} 
//                                   exit={{ opacity: 0, y: -8, scale: 0.9 }} 
//                                   className="absolute right-2 top-12 w-36 bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-lg shadow-xl py-2 z-30 border border-gray-200 dark:border-gray-700"
//                                 >
//                                   <button onClick={(e) => { e.stopPropagation(); setEditingPortfolio(p); setEditName(p.name); setEditCorpus(p.corpus.toString()); setShowEditModal(true); setShowEditMenu(null); }} className="w-full text-left px-3 py-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/50 flex items-center gap-2 text-xs transition-colors">
//                                     <RiEdit2Line className="text-cyan-600" /> Edit
//                                   </button>
//                                   <button onClick={(e) => { e.stopPropagation(); deletePortfolio(p.name); setShowEditMenu(null); }} className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 flex items-center gap-2 text-xs transition-colors">
//                                     <RiDeleteBinLine /> Delete
//                                   </button>
//                                 </motion.div>
//                               )}
//                             </AnimatePresence>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })}

//                   {/* Create quick card - Reduced Size */}
//                   <motion.div 
//                     initial={{ opacity: 0, y: 20 }} 
//                     animate={{ opacity: 1, y: 0 }}
//                     whileHover={{ scale: 1.02 }}
//                     className="flex-shrink-0 w-64 snap-center rounded-xl p-4 flex flex-col items-center justify-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-md cursor-pointer border border-dashed border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-50/30 transition" 
//                     onClick={() => setShowCreateModal(true)}
//                   >
//                     <RiAddCircleFill className="text-cyan-600 text-3xl mb-1" />
//                     <span className="text-sm font-semibold text-cyan-600">Create New</span>
//                   </motion.div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Selected Portfolio View */}
//           {selectedPortfolio && (
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }} 
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="glass-card rounded-2xl p-6 shadow-xl"
//             >
//               {/* Summary cards - Reduced Size */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//                 {[
//                   { label: 'Total Corpus', rawValue: selectedPortfolio.corpus, format: (v) => `₹${v?.toLocaleString()}`, bg: 'bg-gradient-to-br from-cyan-50 to-blue-50', textGradient: 'from-cyan-500 to-blue-600', icon: <GiStairsGoal className="text-lg" /> },
//                   { label: 'Holdings Value', rawValue: getHoldings().reduce((s, h) => s + h.qty * h.ltp, 0), format: (v) => `₹${v.toFixed(2)}`, bg: 'bg-gradient-to-br from-emerald-50 to-teal-50', textGradient: 'from-emerald-500 to-teal-600', icon: <BiTrendingUp className="text-lg" /> },
//                   { label: 'Realised P&L', rawValue: getClosedTrades().reduce((s, t) => s + t.pnl, 0), isPnL: true, icon: <RiCheckboxCircleFill className="text-lg" /> },
//                   { label: 'Unrealised P&L', rawValue: getHoldings().reduce((s, h) => s + h.qty * (h.ltp - h.avgPrice), 0), isPnL: true, icon: <FiArrowUp className="text-lg" /> },
//                   { label: 'Total Brokerage', rawValue: totalBrokerage.toFixed(2), format: (v) => `₹${Math.abs(v)}`, bg: 'bg-gradient-to-br from-orange-50 to-amber-50', textGradient: 'from-orange-500 to-amber-600', icon: <RiMoneyDollarCircleLine className="text-lg" /> },
//                 ].map((item, i) => {
//                   const value = item.rawValue;
//                   const isPositive = value >= 0;
//                   const absValue = Math.abs(value).toFixed(2);
//                   const displayValue = item.isPnL ? `${isPositive ? '+' : '-'}₹${absValue}` : item.format?.(value);
//                   const isPnLCard = item.isPnL;
//                   const bg = item.bg || (isPnLCard ? (isPositive ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-rose-50') : '');
//                   const textGradient = item.textGradient || (isPnLCard ? (isPositive ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600') : '');
//                   return (
//                     <motion.div 
//                       key={i} 
//                       initial={{ opacity: 0, y: 20 }} 
//                       animate={{ opacity: 1, y: 0 }} 
//                       transition={{ delay: i * 0.06 }} 
//                       whileHover={{ y: -2, scale: 1.01 }} 
//                       className={`${bg} rounded-xl p-3 text-center border border-white/10 overflow-hidden`}
//                     >
//                       <div className="relative z-10">
//                         <div className="mb-1 inline-block">{item.icon}</div>
//                         <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
//                         <p className={`text-sm font-bold bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}>{displayValue}</p>
//                       </div>
//                       <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl ${isPnLCard ? (value >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500') : 'bg-gradient-to-r ' + textGradient}`} />
//                     </motion.div>
//                   );
//                 })}
//               </div>

//               {/* Rest of the component remains the same but with reduced sizes... */}
//               {/* Tabs */}
//               <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 relative">
//                 {['overview', 'transactions'].map((tab) => (
//                   <motion.button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`flex-1 py-3 text-base font-semibold transition-all duration-300 capitalize relative ${activeTab === tab ? 'text-cyan-600' : 'text-gray-500 hover:text-cyan-600'}`}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     {tab === 'overview' ? 'Portfolio Overview' : 'Transactions'}
//                     {activeTab === tab && (
//                       <motion.div
//                         layoutId="activeTab"
//                         className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-full"
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                       />
//                     )}
//                   </motion.button>
//                 ))}
//               </div>

//               {/* Tab Content - The rest of your existing tab content remains the same */}
//               {/* ... */}

//                         {activeTab === 'overview' ? (
//                 <>
//                   {/* Trade Section */}
//                   <div className="mb-10">
//                     {!searchMode ? (
//                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSearchMode(true)} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center transition shadow-lg hover:shadow-xl">
//                         <RiAddCircleFill className="mr-3 text-2xl" />
//                         Purchase Stock
//                       </motion.button>
//                     ) : (
//                       <div className="space-y-5">
//                         <div className="relative">
//                           <input type="text" placeholder="Search stock symbol..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-cyan-300 outline-none text-lg shadow-sm" />
//                           <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
//                           <button onClick={resetTradeForm} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"><RiCloseCircleFill size={24} /></button>
//                         </div>

//                         {selectedStock ? (
//                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 shadow-lg">
//                             <div className="flex justify-between items-center mb-4">
//                               <button onClick={() => { setSelectedStock(null); setSearchQuery(''); }} className="text-cyan-600 font-bold text-xl hover:underline flex items-center gap-2">
//                                 <span>{selectedStock.Symbol}</span>
//                                 <RiCloseCircleFill className="text-red-500" size={20} />
//                               </button>
//                               <span className="text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">LTP: ₹{selectedStock.Close}</span>
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                               <div>
//                                 <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => {
//                                   const val = e.target.value;
//                                   if (val === '' || /^\d+$/.test(val)) {
//                                     setQuantity(val === '' ? '' : parseInt(val).toString());
//                                   }
//                                 }} onKeyDown={(e) => { if (['.', 'e', 'E', '-', '+'].includes(e.key)) e.preventDefault(); }} className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-300 outline-none" min="1" step="1" />
//                                 {quantity && parseInt(quantity) > 0 && (<p className="text-sm text-gray-600 mt-2 text-right font-medium">Total: ₹{getTotalInvested(selectedStock.Symbol, quantity)}</p>)}
//                               </div>

//                               <select value={exchange} onChange={(e) => setExchange(e.target.value)} className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-300 outline-none">
//                                 <option>NSE</option>
//                                 <option disabled>BSE (soon)</option>
//                               </select>

//                               <div className="flex gap-2">
//                                 <button onClick={() => handleBuySell('buy')} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all">Buy</button>
//                               </div>
//                             </div>
//                           </motion.div>
//                         ) : searchResults.length > 0 ? (
//                           <div className="space-y-2 max-h-64 overflow-y-auto rounded-2xl">
//                             {searchResults.map((s) => (
//                               <motion.div key={s.Symbol} whileHover={{ x: 4, scale: 1.01 }} onClick={() => { setSelectedStock(s); setSearchQuery(s.Symbol); setQuantity(''); }} className="flex justify-between items-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all border-2 border-transparent hover:border-cyan-200 dark:hover:border-cyan-700">
//                                 <span className="font-semibold text-lg text-gray-800 dark:text-white">{s.Symbol}</span>
//                                 <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent font-bold">₹{s.Close}</span>
//                               </motion.div>
//                             ))}
//                           </div>
//                         ) : searchQuery ? (
//                           <div className="text-center text-gray-500 py-10 glass-card rounded-2xl">
//                             <RiSearchLine className="mx-auto text-4xl mb-3 opacity-50" />
//                             No stocks found
//                           </div>
//                         ) : null}
//                       </div>
//                     )}
//                   </div>

//                   {/* Holdings Section (pro table) */}
//                   <div className="mb-10">
//                     <div className="flex justify-between items-center mb-6">
//                       <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Current Holdings</h3>
//                       <span className="text-sm text-gray-600 dark:text-gray-400 bg-cyan-100 dark:bg-cyan-900/30 px-3 py-1 rounded-full font-medium">{getHoldings().length} stocks</span>
//                     </div>

//                     {getHoldings().length === 0 ? (
//                       <div className="glass-card rounded-2xl p-12 text-center">
//                         <RiAddCircleFill className="mx-auto text-cyan-500 text-5xl mb-4 opacity-60" />
//                         <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Holdings Yet</h4>
//                         <p className="text-gray-500 dark:text-gray-400">Buy your first stock to start building your portfolio</p>
//                       </div>
//                     ) : (
//                       <div className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
//                         <div className="overflow-x-auto">
//                           <table className="w-full">
//                             <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
//                               <tr>
//                                 <th className="text-left p-4 font-semibold">Symbol</th>
//                                 <th className="text-left p-4 font-semibold">Quantity</th>
//                                 <th className="text-left p-4 font-semibold">Avg Price</th>
//                                 <th className="text-left p-4 font-semibold">LTP</th>
//                                 <th className="text-left p-4 font-semibold">Invested</th>
//                                 <th className="text-left p-4 font-semibold">Current Value</th>
//                                 <th className="text-left p-4 font-semibold">P&L</th>
//                                 <th className="text-left p-4 font-semibold">Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                               {getHoldings().map((h, index) => {
//                                 const invested = (h.qty * h.avgPrice).toFixed(2);
//                                 const current = (h.qty * h.ltp).toFixed(2);
//                                 const pnl = (h.ltp - h.avgPrice) * h.qty;
//                                 const pnlPct = h.avgPrice > 0 ? ((h.ltp - h.avgPrice) / h.avgPrice) * 100 : 0;
//                                 const profit = pnl >= 0;

//                                 return (
//                                   <motion.tr key={h.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                                     <td className="p-4"><div className="font-bold text-gray-800 dark:text-white text-lg">{h.symbol}</div></td>
//                                     <td className="p-4"><span className="font-semibold text-gray-700 dark:text-gray-300">{h.qty}</span></td>
//                                     <td className="p-4"><span className="text-gray-600 dark:text-gray-400">₹{h.avgPrice}</span></td>
//                                     <td className="p-4"><span className="font-semibold text-cyan-600">₹{h.ltp.toFixed(2)}</span></td>
//                                     <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">₹{invested}</span></td>
//                                     <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">₹{current}</span></td>
//                                     <td className="p-4">
//                                       <div className="flex items-center gap-2">
//                                         <span className={`font-bold ${profit ? 'text-green-600' : 'text-red-600'}`}>{profit ? '+' : ''}₹{Math.abs(pnl).toFixed(0)}</span>
//                                         <span className={`text-xs px-2 py-1 rounded-full ${profit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{profit ? <FiArrowUp className="inline" /> : <FiArrowDown className="inline" />}{Math.abs(pnlPct).toFixed(1)}%</span>
//                                       </div>
//                                     </td>
//                                     <td className="p-4">
//                                       <div className="flex gap-2">
//                                         <input type="number" placeholder="Qty" value={getQty(h.symbol)} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d+$/.test(val)) setQty(h.symbol, val === '' ? '' : parseInt(val).toString()); }} onKeyDown={(e) => { if (['.', 'e', 'E', '-', '+'].includes(e.key)) e.preventDefault(); }} className="w-20 px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-300 outline-none" min="1" step="1" />
//                                         <div className="flex gap-1">
//                                           <button onClick={() => { const q = parseFloat(getQty(h.symbol)) || 0; if (q <= 0) return toast.error('Enter valid quantity'); const stock = stockData.find((s) => s.Symbol === h.symbol); if (!stock) return; setSelectedStock(stock); setQuantity(q.toString()); setConfirmAction('buy'); setShowConfirmModal(true); }} className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-lg font-medium shadow-sm transition-all">Buy</button>
//                                           <button onClick={() => { const q = parseFloat(getQty(h.symbol)) || 0; if (q <= 0) return toast.error('Enter quantity'); if (q > h.qty) return toast.error(`Only ${h.qty} available`); const stock = stockData.find((s) => s.Symbol === h.symbol); if (!stock) return; setSelectedStock(stock); setQuantity(q.toString()); setConfirmAction('sell'); setShowConfirmModal(true); }} className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm rounded-lg font-medium shadow-sm transition-all">Sell</button>
//                                         </div>
//                                       </div>
//                                       {getQty(h.symbol) && parseInt(getQty(h.symbol)) > 0 && (<p className="text-xs text-gray-500 mt-1 text-center">₹{getTotalInvested(h.symbol, getQty(h.symbol))}</p>)}
//                                     </td>
//                                   </motion.tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Closed Trades Section */}
//                   <div>
//                     <div className="flex justify-between items-center mb-6">
//                       <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Closed Trades</h3>
//                       <span className="text-sm text-gray-600 dark:text-gray-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full font-medium">{getClosedTrades().length} trades</span>
//                     </div>

//                     {getClosedTrades().length === 0 ? (
//                       <div className="glass-card rounded-2xl p-12 text-center">
//                         <RiCheckboxCircleFill className="mx-auto text-purple-500 text-5xl mb-4 opacity-60" />
//                         <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Closed Trades</h4>
//                         <p className="text-gray-500 dark:text-gray-400">Your completed trades will appear here</p>
//                       </div>
//                     ) : (
//                       <div className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
//                         <div className="overflow-x-auto">
//                           <table className="w-full">
//                             <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
//                               <tr>
//                                 <th className="text-left p-4 font-semibold">Symbol</th>
//                                 <th className="text-left p-4 font-semibold">Quantity</th>
//                                 <th className="text-left p-4 font-semibold">Avg Price</th>
//                                 <th className="text-left p-4 font-semibold">Invested</th>
//                                 <th className="text-left p-4 font-semibold">Sold Value</th>
//                                 <th className="text-left p-4 font-semibold">P&L</th>
//                                 <th className="text-left p-4 font-semibold">Return %</th>
//                                 <th className="text-left p-4 font-semibold">Closed Date</th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                               {getClosedTrades().map((trade, index) => {
//                                 const invested = (trade.qty * trade.avgPrice).toFixed(2);
//                                 const sold = (parseFloat(invested) + trade.pnl).toFixed(2);
//                                 const profit = trade.pnl >= 0;
//                                 const pnlPct = trade.avgPrice > 0 ? (trade.pnl / (trade.qty * trade.avgPrice)) * 100 : 0;

//                                 return (
//                                   <motion.tr key={`${trade.symbol}-${trade.sellDate}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                                     <td className="p-4"><div className="font-bold text-gray-800 dark:text-white">{trade.symbol}</div></td>
//                                     <td className="p-4"><span className="font-semibold text-gray-700 dark:text-gray-300">{trade.qty}</span></td>
//                                     <td className="p-4"><span className="text-gray-600 dark:text-gray-400">₹{trade.avgPrice}</span></td>
//                                     <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">₹{invested}</span></td>
//                                     <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">₹{sold}</span></td>
//                                     <td className="p-4"><div className="flex items-center gap-2"><span className={`font-bold ${profit ? 'text-green-600' : 'text-red-600'}`}>{profit ? '+' : ''}₹{Math.abs(trade.pnl).toFixed(0)}</span></div></td>
//                                     <td className="p-4"><span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${profit ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>{profit ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}{Math.abs(pnlPct).toFixed(1)}%</span></td>
//                                     <td className="p-4"><span className="text-sm text-gray-500 dark:text-gray-400">{trade.sellDate}</span></td>
//                                   </motion.tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 /* Transactions Tab (unchanged logic; styled) */
//                 <div>
//                   <div className="flex justify-end mb-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">To perform a detailed analysis, download your transaction data and upload it on the <Link to="/portfolio" className="font-medium text-cyan-600 hover:underline">Upload File</Link> page.</p>
//                   </div>

//                   <div className="flex justify-end mb-4">
//                     <button onClick={downloadCSV} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition shadow-lg hover:shadow-xl flex items-center gap-2"><AiOutlineDownload /> Download CSV</button>
//                   </div>

//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Transaction History</h3>
//                     <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
//                       {[
//                         { k: 'all', l: 'All' },
//                         { k: '3d', l: '3D' },
//                         { k: '1w', l: '1W' },
//                         { k: '2w', l: '2W' },
//                         { k: '1m', l: '1M' },
//                         { k: '3m', l: '3M' },
//                         { k: '1y', l: '1Y' },
//                       ].map(({ k, l }) => (
//                         <button key={k} onClick={() => setBrokerageFilter(k)} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${brokerageFilter === k ? 'bg-white dark:bg-gray-900 text-cyan-600 shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600'}`}>{l}</button>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
//                           <tr>
//                             {[
//                               'Symbol',
//                               'Date & Time',
//                               'Qty',
//                               'Price',
//                               'Value',
//                               'Brokerage',
//                               'Frame',
//                               'Exchange',
//                               'Type',
//                             //   'Action',
//                             ].map((h) => (
//                               <th key={h} className="p-4 font-semibold text-left tracking-wide text-xs uppercase">{h}</th>
//                             ))}
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {getFilteredTransactions().length === 0 ? (
//                             <tr>
//                               <td colSpan={10} className="text-center py-12 text-gray-500 dark:text-gray-400">No transactions in selected period</td>
//                             </tr>
//                           ) : (
//                             getFilteredTransactions().map((t, i) => (
//                               <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
//                                 <td className="p-4 font-medium">{t.Symbol}</td>
//                                 <td className="p-4 font-mono text-xs">{t.DateTime}</td>
//                                 <td className="p-4">{t.Qty}</td>
//                                 <td className="p-4">₹{t.Price}</td>
//                                 <td className="p-4">₹{t.MarketValue}</td>
//                                 <td className="p-4">₹{t.BrokerageAmount}</td>
//                                 <td className="p-4 font-medium">{t.frame}</td>
//                                 <td className="p-4">{exchange}</td>
//                                 <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${t.OrderType === 'B' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.OrderType === 'B' ? 'BUY' : 'SELL'}</span></td>
//                                 {/* <td className="p-4">
//                                   <button onClick={(e) => { e.stopPropagation(); const id = t.ID || t.Id || t.id; if (id) deleteTransaction(id); }} className="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50" title="Delete"><RiDeleteBinLine size={18} /></button>
//                                 </td> */}
//                               </motion.tr>
//                             ))
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </div>

//         {/* Modals - Reduced sizes */}
//         <AnimatePresence>
//           {showCreateModal && (
//             <ModalBackdrop onClick={() => setShowCreateModal(false)}>
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="glass-card rounded-2xl p-6 max-w-md w-full shadow-xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <h3 className="text-xl font-bold mb-4 text-center">Create New Portfolio</h3>
//                 <input type="text" placeholder="Portfolio Name" value={newPortfolioName} onChange={(e) => setNewPortfolioName(e.target.value)} className="w-full mb-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none" />
//                 <input type="number" placeholder="Initial Corpus (₹)" value={newCorpus} onChange={(e) => setNewCorpus(e.target.value)} className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none" />
//                 <div className="flex gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowCreateModal(false)}
//                     className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={createPortfolio}
//                     className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-sm"
//                   >
//                     Create
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </ModalBackdrop>
//           )}
//         </AnimatePresence>

//         {/* Other modals follow similar reduced size pattern... */}
//         {/* Add this Confirmation Modal */}
// <AnimatePresence>
//   {showConfirmModal && (
//     <ModalBackdrop onClick={() => setShowConfirmModal(false)}>
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="glass-card rounded-2xl p-6 max-w-md w-full shadow-xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="text-center mb-6">
//           <RiCheckboxCircleFill 
//             className={`mx-auto text-4xl mb-4 ${
//               confirmAction === 'buy' ? 'text-green-500' : 'text-red-500'
//             }`} 
//           />
//           <h3 className="text-xl font-bold mb-2">
//             Confirm {confirmAction === 'buy' ? 'Buy' : 'Sell'}
//           </h3>
//           <p className="text-gray-600 dark:text-gray-300">
//             {confirmAction === 'buy' ? 'Buy' : 'Sell'} {quantity} shares of {selectedStock?.Symbol} 
//             at ₹{selectedStock?.Close}?
//           </p>
//           <p className="font-semibold mt-2">
//             Total: ₹{getTotalInvested(selectedStock?.Symbol, quantity)}
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowConfirmModal(false)}
//             className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//           >
//             Cancel
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={confirmTrade}
//             className={`flex-1 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all ${
//               confirmAction === 'buy' 
//                 ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
//                 : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
//             }`}
//           >
//             Confirm {confirmAction === 'buy' ? 'Buy' : 'Sell'}
//           </motion.button>
//         </div>
//       </motion.div>
//     </ModalBackdrop>
//   )}
// </AnimatePresence>
//       </div>
//     </>
//   );
// }

// /* Reusable Modal Backdrop */
// const ModalBackdrop = ({ children, onClick }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
//     onClick={onClick}
//   >
//     <div
//       className="w-full max-w-md mx-auto rounded-2xl p-6 max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl text-gray-800 dark:text-gray-100"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {children}
//     </div>
//   </motion.div>
// );

// // Add the missing icon component
// const RiMoneyDollarCircleLine = ({ className }) => (
//   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//     <path fill="none" d="M0 0h24v24H0z"></path>
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"></path>
//   </svg>
// );


///////////////////////////////////////////new updated changes /////////////////////////////////////////////



// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {
//   RiSearchLine,
//   RiAddCircleFill,
//   RiDeleteBinLine,
//   RiEdit2Line,
//   RiCloseCircleFill,
//   RiCheckboxCircleFill,
// } from 'react-icons/ri';
// import { FaLock, FaExclamationTriangle } from 'react-icons/fa';
// import { AiOutlinePlus, AiOutlineDownload } from 'react-icons/ai';
// import { GiStairsGoal } from 'react-icons/gi';
// import { BiTrendingUp } from 'react-icons/bi';
// import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
// import { Link, useNavigate } from 'react-router-dom';
// import Navbar from '../Navbar';
// import { saveAs } from 'file-saver';

// // Format number to Indian numbering system (1,03,45,678) - only show decimals if non-zero
// const formatIndianNumber = (number, decimals = 2) => {
//   if (number === null || number === undefined || isNaN(number)) return '0';

//   const num = parseFloat(number);
//   if (num === 0) return '0';

//   // Check if the number has non-zero decimal values
//   const hasNonZeroDecimals = Math.abs(num - Math.floor(num)) > 0.0001;

//   // For very small numbers, always show decimals
//   if (Math.abs(num) < 0.01 && Math.abs(num) > 0) {
//     return num.toFixed(decimals);
//   }

//   const parts = num.toFixed(decimals).split('.');
//   let integerPart = parts[0];
//   const decimalPart = parts[1] || '';

//   // Handle negative numbers
//   const isNegative = integerPart.startsWith('-');
//   if (isNegative) {
//     integerPart = integerPart.substring(1);
//   }

//   // Indian numbering system: 1,03,45,678
//   let lastThree = integerPart.substring(integerPart.length - 3);
//   const otherNumbers = integerPart.substring(0, integerPart.length - 3);

//   if (otherNumbers !== '') {
//     lastThree = ',' + lastThree;
//   }

//   const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

//   // Only include decimal part if it has non-zero values
//   const result = (isNegative ? '-' : '') + formattedInteger + 
//     (hasNonZeroDecimals && decimalPart && parseInt(decimalPart) !== 0 ? '.' + decimalPart.replace(/0+$/, '') : '');

//   return result;
// };

// // Format currency with ₹ symbol - only show decimals if non-zero
// const formatCurrency = (amount, decimals = 2) => {
//   const formatted = formatIndianNumber(amount, decimals);
//   return `₹${formatted}`;
// };

// // Special format for quantities (no decimals ever)
// const formatQuantity = (quantity) => {
//   return formatIndianNumber(quantity, 0);
// };

// export default function PaperTrading() {
//   /* ────────────────────── AUTH ────────────────────── */
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const getToken = () => {
//     const t = localStorage.getItem('authToken');
//     return t && t !== 'null' ? t : null;
//   };
//   const navigate = useNavigate();

//   /* ────────────────────── LOADING ────────────────────── */
//   const [loading, setLoading] = useState(false);

//   /* ────────────────────── CSV DOWNLOAD ────────────────────── */
//   const downloadCSV = () => {
//     const rows = selectedPortfolio?.transactions || [];
//     if (!rows.length) return;

//     const headers = [
//       'Symbol',
//       'Date',
//       'Time',
//       'OrderType',
//       'Qty',
//       'Price',
//       'MarketValue',
//       'BrokerageAmount',
//     ];

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => {
//         const [date, time] = (row.DateTime || '').split(' ');
//         return headers
//           .map(h => {
//             const value = h === 'Date' ? date : h === 'Time' ? time : row[h] ?? '';
//             return `"${value}"`;
//           })
//           .join(',');
//       }),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, `${selectedPortfolio.name}_transactions.csv`);
//   };

//   /* ────────────────────── PORTFOLIOS ────────────────────── */
//   const [portfolios, setPortfolios] = useState([]);
//   const [selectedPortfolio, setSelectedPortfolio] = useState(null);

//   /* ────────────────────── TABS ────────────────────── */
//   const [activeTab, setActiveTab] = useState('overview');

//   /* ────────────────────── Book profit ────────────────────── */
//   const calculateTotalBookProfit = useCallback((transactions) => {
//     if (!transactions || transactions.length === 0) return 0;

//     const sorted = [...transactions].sort((a, b) => {
//       const aDate = new Date(a.DateTime || '');
//       const bDate = new Date(b.DateTime || '');
//       return aDate - bDate;
//     });

//     const holdings = {};
//     let totalProfit = 0;

//     sorted.forEach(tx => {
//       const symbol = tx.Symbol;
//       const qty = parseFloat(tx.Qty) || 0;
//       const price = parseFloat(tx.Price) || 0;

//       if (!holdings[symbol]) {
//         holdings[symbol] = { qty: 0, cost: 0 };
//       }

//       if (tx.OrderType === 'B') {
//         holdings[symbol].qty += qty;
//         holdings[symbol].cost += qty * price;
//       } else if (tx.OrderType === 'S') {
//         const avgCost = holdings[symbol].qty > 0
//           ? holdings[symbol].cost / holdings[symbol].qty
//           : 0;
//         const profit = qty * (price - avgCost);
//         totalProfit += profit;

//         holdings[symbol].qty -= qty;
//         holdings[symbol].cost -= avgCost * qty;

//         if (holdings[symbol].qty < 0.001) {
//           holdings[symbol].qty = 0;
//           holdings[symbol].cost = 0;
//         }
//       }
//     });

//     return totalProfit;
//   }, []);

//   const totalBookProfit = useMemo(() => {
//     return selectedPortfolio
//       ? calculateTotalBookProfit(selectedPortfolio.transactions || [])
//       : 0;
//   }, [selectedPortfolio, calculateTotalBookProfit]);

//   /* ────────────────────── CREATE / EDIT / MODALS ────────────────────── */
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newPortfolioName, setNewPortfolioName] = useState('');
//   const [newCorpus, setNewCorpus] = useState('');
//   const [showEditMenu, setShowEditMenu] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingPortfolio, setEditingPortfolio] = useState(null);
//   const [editName, setEditName] = useState('');
//   const [editCorpus, setEditCorpus] = useState('');

//   /* ────────────────────── TRADE UI ────────────────────── */
//   const [searchMode, setSearchMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [exchange, setExchange] = useState('NSE');
//   const [quantity, setQuantity] = useState('');
//   const [quantities, setQuantities] = useState({});
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [confirmAction, setConfirmAction] = useState('buy');

//   /* ────────────────────── STOCK DATA ────────────────────── */
//   const [stockData, setStockData] = useState([]);

//   /* ────────────────────── FILTER STATE ────────────────────── */
//   const [brokerageFilter, setBrokerageFilter] = useState('all');

//   /* ────────────────────── FETCH STOCK LIST ────────────────────── */
//   useEffect(() => {
//     const fetchStocks = async () => {
//       try {
//         const res = await axios.post(`${API_BASE}/file/build_Portfolio`);
//         setStockData(res.data.portfolio_data || []);
//       } catch (err) {
//         toast.error('Failed to load stock list');
//       }
//     };
//     fetchStocks();
//   }, [API_BASE]);

//   /* ────────────────────── SEARCH (client-side) ────────────────────── */
//   useEffect(() => {
//     if (!searchQuery) {
//       setSearchResults([]);
//       return;
//     }
//     const filtered = stockData.filter((s) =>
//       s.Symbol.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setSearchResults(filtered);
//   }, [searchQuery, stockData]);

//   /* ────────────────────── CHECK LOGIN ────────────────────── */
//   useEffect(() => {
//     const token = getToken();
//     setIsLoggedIn(!!token);
//   }, []);

//   /* ────────────────────── HELPERS ────────────────────── */
//   const getQty = (symbol) => quantities[symbol] || '';
//   const setQty = (symbol, value) => {
//     setQuantities(prev => ({ ...prev, [symbol]: value }));
//   };

//   const totalBrokerage = useMemo(() => {
//     if (!selectedPortfolio?.transactions) return 0;
//     return selectedPortfolio.transactions.reduce((sum, t) => {
//       return sum + parseFloat(t.BrokerageAmount || 0);
//     }, 0);
//   }, [selectedPortfolio]);

//   const getTotalInvested = (symbol, qtyStr) => {
//     const qty = parseInt(qtyStr) || 0;
//     const stock = stockData.find(s => s.Symbol === symbol);
//     if (!stock || qty === 0) return '0.00';
//     return (qty * stock.Close).toFixed(2);
//   };

//   const getFormattedTotalInvested = (symbol, qtyStr) => {
//     const total = getTotalInvested(symbol, qtyStr);
//     return formatCurrency(total);
//   };

//   /* ────────────────────── FETCH PORTFOLIOS ────────────────────── */
//   const fetchPortfolios = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       setIsLoggedIn(false);
//       toast.error('Please log in to view your portfolios.');
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/paper-trade/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const options = processPortfolios(res.data || []);
//       setPortfolios(options);

//       if (options.length > 0 && !selectedPortfolio) {
//         setSelectedPortfolio(options[0]);
//       }
//     } catch (e) {
//       console.error(e);
//       toast.error(e.response?.data?.message || 'Failed to load portfolios');
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE]);

//   useEffect(() => {
//     const token = getToken();
//     if (token) {
//       setIsLoggedIn(true);
//       fetchPortfolios();
//     } else {
//       setIsLoggedIn(false);
//       setLoading(false);
//     }
//   }, [fetchPortfolios]);

//   /* ────────────────────── PROCESS RAW PORTFOLIOS ────────────────────── */
//   const processPortfolios = (raw) => {
//     return raw.map((p) => ({
//       displayName: p.displayName || `Portfolio ${p.series}`,
//       name: p.displayName || `Portfolio ${p.series}`,
//       value: p.series?.toString() || '',
//       corpus: Number(p.corpus),
//       data: Array.isArray(p.data)
//         ? p.data.map((item) => {
//             let dateObj = new Date();
//             if (typeof item.Date === 'string' && item.Date.includes('/')) {
//               const [day, month, year] = item.Date.split('/');
//               dateObj = new Date(`${year}-${month}-${day}T${item.Time || '00:00:00'}`);
//             } else if (typeof item.Date === 'number' || !isNaN(parseInt(item.Date))) {
//               dateObj = new Date(parseInt(item.Date));
//             }
//             const formattedDate = dateObj.toLocaleDateString('en-GB', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric',
//             });
//             const formattedTime = dateObj.toLocaleTimeString('en-GB', {
//               hour12: false,
//               hour: '2-digit',
//               minute: '2-digit',
//               second: '2-digit',
//             });
//             const dateTimeStr = `${formattedDate} ${formattedTime}`;
//             return {
//               ...item,
//               Qty: item.Qty?.toString() || '0',
//               Price: parseFloat(item.Price || 0).toFixed(2),
//               MarketValue: parseFloat(item.MarketValue || 0).toFixed(2),
//               BrokerageAmount: isNaN(item.BrokerageAmount)
//                 ? '0.00'
//                 : parseFloat(item.BrokerageAmount).toFixed(2),
//               DateTime: dateTimeStr,
//               frame: item.Frame || item.frame || '—',
//             };
//           })
//         : [],
//       transactions: Array.isArray(p.data)
//         ? p.data.map((item) => {
//             let dateObj = new Date();
//             if (typeof item.Date === 'string' && item.Date.includes('/')) {
//               const [day, month, year] = item.Date.split('/');
//               dateObj = new Date(`${year}-${month}-${day}T${item.Time || '00:00:00'}`);
//             } else if (typeof item.Date === 'number' || !isNaN(parseInt(item.Date))) {
//               dateObj = new Date(parseInt(item.Date));
//             }
//             const formattedDate = dateObj.toLocaleDateString('en-GB', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric',
//             });
//             const formattedTime = dateObj.toLocaleTimeString('en-GB', {
//               hour12: false,
//               hour: '2-digit',
//               minute: '2-digit',
//               second: '2-digit',
//             });
//             return {
//               ...item,
//               DateTime: `${formattedDate} ${formattedTime}`,
//               frame: item.Frame || item.frame || '—',
//             };
//           })
//         : [],
//       tableName: p.internalTableName,
//     }));
//   };

//   /* ────────────────────── CREATE / EDIT / DELETE / SAVE / TRADE ────────────────────── */
//   const createPortfolio = async () => {
//     const token = getToken();
//     if (!token) return toast.error('Please log in.');
//     if (!newPortfolioName || !newCorpus) return;

//     try {
//       await axios.post(
//         `${API_BASE}/paper-trade/create?name=${encodeURIComponent(newPortfolioName)}&corpus=${newCorpus}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Portfolio created');
//       setShowCreateModal(false);
//       setNewPortfolioName('');
//       setNewCorpus('');
//       fetchPortfolios();
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to create portfolio');
//     }
//   };

//   const editPortfolio = async () => {
//   const token = getToken();
//   if (!token || !editingPortfolio) return;

//   // Validate inputs
//   if (!editName.trim()) {
//     toast.error('Please enter a portfolio name');
//     return;
//   }

//   if (!editCorpus || parseFloat(editCorpus) <= 0) {
//     toast.error('Please enter a valid corpus amount');
//     return;
//   }

//   try {
//     await axios.patch(
//       `${API_BASE}/paper-trade/edit`,
//       {},
//       {
//         params: {
//           portfolioname: editingPortfolio.name,
//           ...(editName && editName !== editingPortfolio.name && { newName: editName }),
//           ...(editCorpus && { corpus: editCorpus }),
//         },
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     toast.success('Portfolio updated successfully');
//     setShowEditModal(false);
//     setEditingPortfolio(null);
//     setEditName('');
//     setEditCorpus('');
//     await fetchPortfolios();
//   } catch (e) {
//     console.error('Edit portfolio error:', e);
//     toast.error(e.response?.data?.error || 'Failed to update portfolio');
//   }
// };

//   const deleteTransaction = async (transactionId) => {
//     const token = getToken();
//     if (!token || !selectedPortfolio) return;

//     if (!window.confirm('Delete this transaction?')) return;

//     try {
//       await axios.delete(`${API_BASE}/paper-trade/transaction-delete`, {
//         params: { portfolioname: selectedPortfolio.name, transactionId },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Transaction deleted');
//       fetchPortfolios();
//     } catch (e) {
//       toast.error(e.response?.data?.error || 'Failed to delete');
//     }
//   };

//   const deletePortfolio = async (name) => {
//     const token = getToken();
//     if (!token) return toast.error('Please log in.');

//     try {
//       await axios.delete(`${API_BASE}/paper-trade/delete?portfolioname=${name}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Portfolio deleted');
//       fetchPortfolios();
//       if (selectedPortfolio?.name === name) {
//         setSelectedPortfolio(portfolios[0] || null);
//       }
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Failed to delete');
//     }
//   };

//   const saveTransaction = async (transaction, portfolioName) => {
//     const token = getToken();
//     if (!token) {
//       toast.error('Not logged in.');
//       return;
//     }

//     try {
//       const payload = [transaction];
//       await axios.post(
//         `${API_BASE}/paper-trade/save?portfolioname=${portfolioName}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       toast.success(
//         `${transaction.OrderType === 'B' ? 'Bought' : 'Sold'} ${transaction.Qty} ${transaction.Symbol}`
//       );
//       await fetchPortfoliosAndSelectCurrent(portfolioName);
//       resetTradeForm();
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Trade failed');
//       throw e;
//     }
//   };

//   const resetTradeForm = () => {
//     setSearchMode(false);
//     setSearchQuery('');
//     setSelectedStock(null);
//     setQuantity('');
//     setExchange('NSE');
//   };

//   const handleBuySell = (action) => {
//     if (!selectedStock || !quantity || parseFloat(quantity) <= 0 || !selectedPortfolio) {
//       toast.error('Enter a valid quantity');
//       return;
//     }
//     setConfirmAction(action);
//     setShowConfirmModal(true);
//   };

//   const fetchPortfoliosAndSelectCurrent = async (portfolioName) => {
//     const token = getToken();
//     if (!token || !portfolioName) return;

//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/paper-trade/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const options = processPortfolios(res.data || []);
//       setPortfolios(options);
//       const updated = options.find((p) => p.name === portfolioName);
//       if (updated) setSelectedPortfolio(updated);
//     } catch (e) {
//       console.error(e);
//       toast.error(e.response?.data?.message || 'Failed to refresh');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateCorpusOnServer = async (newCorpus) => {
//     const token = getToken();
//     if (!token || !selectedPortfolio) return;

//     try {
//       await axios.patch(
//         `${API_BASE}/paper-trade/edit`,
//         {},
//         {
//           params: { portfolioname: selectedPortfolio.name, corpus: newCorpus },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     } catch (e) {
//       toast.error('Failed to update corpus on server');
//       console.error(e);
//     }
//   };

//   const confirmTrade = async () => {
//     if (!selectedStock || !quantity || parseInt(quantity) <= 0 || !Number.isInteger(parseInt(quantity))) {
//       toast.error('Invalid quantity');
//       return;
//     }

//     const qty = parseFloat(quantity);
//     const price = selectedStock.Close;
//     const orderType = confirmAction === 'buy' ? 'B' : 'S';
//     const tradeValue = qty * price;
//     const brokerageAmount =
//       orderType === 'B' ? Math.min(0.0003 * tradeValue, 20) : 0.0005 * tradeValue;
//     const totalCost = tradeValue + brokerageAmount;
//     const totalProceeds = tradeValue - brokerageAmount;
//     const currentCorpus = selectedPortfolio.corpus;

//     if (orderType === 'B' && totalCost > currentCorpus) {
//       toast.error(
//         `Insufficient corpus! Need ${formatCurrency(totalCost)}, Available: ${formatCurrency(currentCorpus)}`
//       );
//       setShowConfirmModal(false);
//       return;
//     }

//     if (orderType === 'S') {
//       const holding = getHoldings().find((h) => h.symbol === selectedStock.Symbol);
//       if (!holding || qty > holding.qty) {
//         toast.error(`Cannot sell ${qty}. Only ${holding?.qty || 0} available.`);
//         setShowConfirmModal(false);
//         return;
//       }
//     }

//     const updatedCorpus = orderType === 'B' ? currentCorpus - totalCost : currentCorpus + totalProceeds;
//     const portfolioName = selectedPortfolio.name;

//     // Business date logic (unchanged)
//     const getPreviousTradingDay = () => {
//       const date = new Date();
//       const day = date.getDay();
//       if (day === 0 || day === 6 || day === 1) {
//         const daysToFriday = day === 0 ? 2 : day === 6 ? 1 : 3;
//         date.setDate(date.getDate() - daysToFriday);
//         return date;
//       }
//       date.setDate(date.getDate() - 1);
//       return date;
//     };

//     const tradeDate = getPreviousTradingDay();

//     const transaction = {
//       Symbol: selectedStock.Symbol,
//       Date: tradeDate.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       }),
//       Time: new Date().toLocaleTimeString('en-GB', {
//         hour12: false,
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//       }),
//       OrderType: orderType,
//       Qty: qty.toString(),
//       Price: price.toFixed(2),
//       MarketValue: tradeValue.toFixed(2),
//       BrokerageAmount: brokerageAmount.toFixed(2),
//     };

//     try {
//       await saveTransaction(transaction, portfolioName);
//       await updateCorpusOnServer(updatedCorpus);
//       await fetchPortfoliosAndSelectCurrent(portfolioName);
//     } catch (err) {
//       toast.error('Trade failed – corpus reverted');
//       console.error(err);
//     } finally {
//       setShowConfirmModal(false);
//     }
//   };

//   const getFilteredTransactions = () => {
//     if (!selectedPortfolio?.transactions) return [];
//     const now = new Date();
//     const cutoffMap = { '3d': 3, '1w': 7, '2w': 14, '1m': 30, '3m': 90, '1y': 365 };
//     if (brokerageFilter === 'all') return selectedPortfolio.transactions;
//     const days = cutoffMap[brokerageFilter];
//     const cutoff = new Date(now);
//     cutoff.setDate(now.getDate() - days);
//     return selectedPortfolio.transactions.filter((t) => {
//       const [dateStr] = t.DateTime.split(' ');
//       const [d, m, y] = dateStr.split('/');
//       const txDate = new Date(`${y}-${m}-${d}`);
//       return txDate >= cutoff;
//     });
//   };

//   const getClosedTrades = () => {
//     if (!selectedPortfolio || !Array.isArray(selectedPortfolio.transactions)) return [];
//     const trades = {};
//     const sellEvents = {};
//     selectedPortfolio.transactions.forEach((t) => {
//       const symbol = t.Symbol;
//       const qty = parseFloat(t.Qty) || 0;
//       const price = parseFloat(t.Price) || 0;
//       const dateTime = t.DateTime || '01/01/1970 00:00:00';
//       const date = dateTime.split(' ')[0];
//       if (!trades[symbol]) trades[symbol] = { buy: 0, sell: 0, invested: 0, soldValue: 0 };
//       if (t.OrderType === 'B') {
//         trades[symbol].buy += qty;
//         trades[symbol].invested += qty * price;
//       } else {
//         trades[symbol].sell += qty;
//         trades[symbol].soldValue += qty * price;
//         if (!sellEvents[symbol]) sellEvents[symbol] = date;
//       }
//     });
//     return Object.entries(trades)
//       .filter(([, t]) => Math.abs(t.buy - t.sell) < 0.001)
//       .map(([symbol, t]) => {
//         const avgBuy = t.buy > 0 ? (t.invested / t.buy).toFixed(2) : '0.00';
//         const pnl = (t.soldValue - t.invested).toFixed(2);
//         return {
//           symbol,
//           qty: t.buy,
//           avgPrice: avgBuy,
//           pnl: parseFloat(pnl),
//           sellDate: sellEvents[symbol] || 'Unknown',
//         };
//       })
//       .sort((a, b) => b.sellDate.localeCompare(a.sellDate));
//   };

//   const getHoldings = () => {
//     if (!selectedPortfolio) return [];
//     const holdings = {};
//     selectedPortfolio.transactions.forEach((t) => {
//       if (!holdings[t.Symbol]) holdings[t.Symbol] = { qty: 0, invested: 0 };
//       const qty = parseFloat(t.Qty);
//       if (t.OrderType === 'B') {
//         holdings[t.Symbol].qty += qty;
//         holdings[t.Symbol].invested += qty * parseFloat(t.Price);
//       } else {
//         holdings[t.Symbol].qty -= qty;

//         const avgPrice =
//           holdings[t.Symbol].qty + qty > 0
//             ? holdings[t.Symbol].invested / (holdings[t.Symbol].qty + qty)
//             : 0;

//         holdings[t.Symbol].invested -= avgPrice * qty;
//       }
//     });
//     return Object.entries(holdings)
//       .filter(([, h]) => h.qty > 0)
//       .map(([symbol, h]) => {
//         const avg = (h.invested / h.qty).toFixed(2);
//         const ltp = stockData.find((s) => s.Symbol === symbol)?.Close || 0;
//         return { symbol, qty: h.qty, avgPrice: avg, ltp };
//       });
//   };

//   /* ────────────────────── NOT LOGGED IN ────────────────────── */
//   if (!isLoggedIn) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
//         <Navbar />
//         <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="glass-card rounded-3xl p-12 max-w-md w-full text-center shadow-2xl"
//           >
//             <FaLock className="mx-auto text-cyan-600 dark:text-cyan-400 text-6xl mb-6" />
//             <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-gray-600 mb-4">
//               Please Login First
//             </h1>
//             <button
//               onClick={() => navigate('/login')}
//               className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-10 rounded-full transition shadow-lg hover:shadow-xl"
//             >
//               Login
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   /* ────────────────────── RENDER ────────────────────── */
//   return (
//     <>
//       <ToastContainer position="top-right" theme="colored" />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 relative">
//         <Navbar />

//         {/* Floating hero glows */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl top-20 left-20 animate-pulse" />
//           <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse" />
//         </div>

//         <div className="w-full mx-auto px-6 pt-24 pb-16 relative z-10 max-w-7xl">
//           {/* Header Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-center mb-8"
//           >
//             <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Paper Trading</h1>
//             <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
//               Practice strategies with live market data — zero risk
//             </p>

//             {/* Disclaimer moved below header */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="mt-6 bg-gradient-to-r from-orange-400 to-amber-500 text-white py-3 px-6 rounded-2xl shadow-lg max-w-2xl mx-auto"
//             >
//               <div className="flex items-center justify-center gap-3">
//                 <FaExclamationTriangle className="text-lg" />
//                 <p className="text-sm font-medium text-center">
//                   This is a paper trading platform — virtual funds only. No actual shares are exchanged.
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Loading */}
//           {loading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="flex justify-center py-8"
//             >
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-600"></div>
//             </motion.div>
//           )}

//           {/* Portfolio Controls */}
//           {portfolios.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex items-center justify-center mb-8 gap-4"
//             >
//               {/* Portfolio selector */}
//               <motion.div 
//                 whileHover={{ scale: 1.02 }}
//                 className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/70 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-sm"
//               >
//                 <select
//                   value={selectedPortfolio?.name || ''}
//                   onChange={(e) => {
//                     const p = portfolios.find(pf => pf.name === e.target.value);
//                     if (p) setSelectedPortfolio(p);
//                   }}
//                   className="bg-transparent px-2 py-1 outline-none text-sm font-medium"
//                 >
//                   {portfolios.map((p) => (
//                     <option key={p.name} value={p.name}>{p.name}</option>
//                   ))}
//                 </select>
//               </motion.div>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowCreateModal(true)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium hover:from-cyan-700 hover:to-blue-700 transition-shadow shadow-md"
//               >
//                 <AiOutlinePlus /> New Portfolio
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={downloadCSV}
//                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
//               >
//                 <AiOutlineDownload className="text-lg" />
//                 <span className="text-sm font-medium">Export</span>
//               </motion.button>
//             </motion.div>
//           )}

//           {/* No portfolios UI */}
//           {portfolios.length === 0 && !loading && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="glass-card rounded-2xl p-8 text-center shadow-xl max-w-md mx-auto"
//             >
//               <RiAddCircleFill className="mx-auto text-cyan-600 text-4xl mb-3" />
//               <h3 className="text-xl font-bold mb-2">Create Your First Portfolio</h3>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowCreateModal(true)}
//                 className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto text-sm"
//               >
//                 <AiOutlinePlus /> Create Portfolio
//               </motion.button>
//             </motion.div>
//           )}


// {/* Portfolio Cards - Create Card Only Fixed When Needed */}
// {portfolios.length > 0 && (
//   <div className="relative mb-8">
//     <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//       {portfolios.map((p, i) => {
//         const isSelected = selectedPortfolio?.name === p.name;
//         return (
//           <motion.div
//             key={p.name}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.04 }}
//             whileHover={{ scale: 1.02 }}
//             onClick={() => setSelectedPortfolio(p)}
//             className={`flex-shrink-0 w-64 rounded-xl p-4 cursor-pointer bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 shadow-lg transform scale-105 border-blue-400' : 'hover:shadow-md border-white/50'}`}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <h3 className="text-base font-bold text-gray-800 dark:text-white truncate">{p.name}</h3>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Corpus: <span className="font-semibold text-cyan-600">{formatCurrency(p.corpus, 0)}</span></p>
//               </div>
//               <div className="flex items-center gap-1">
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={(e) => { 
//                     e.stopPropagation(); 
//                     setEditingPortfolio(p); 
//                     setEditName(p.name); 
//                     setEditCorpus(p.corpus.toString()); 
//                     setShowEditModal(true); 
//                   }}
//                   className="text-cyan-600 hover:text-cyan-700 p-1 rounded transition text-sm"
//                   title="Edit Portfolio"
//                 >
//                   <RiEdit2Line />
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={(e) => { 
//                     e.stopPropagation(); 
//                     if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
//                       deletePortfolio(p.name);
//                     }
//                   }}
//                   className="text-red-500 hover:text-red-600 p-1 rounded transition text-sm"
//                   title="Delete Portfolio"
//                 >
//                   <RiDeleteBinLine />
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         );
//       })}

//       {/* Create New Card - Always at the end of the list */}
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }} 
//         animate={{ opacity: 1, y: 0 }}
//         whileHover={{ scale: 1.02 }}
//         className="flex-shrink-0 w-64 rounded-xl p-4 flex flex-col items-center justify-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-md cursor-pointer border border-dashed border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-50/30 transition" 
//         onClick={() => setShowCreateModal(true)}
//       >
//         <RiAddCircleFill className="text-cyan-600 text-3xl mb-1" />
//         <span className="text-sm font-semibold text-cyan-600">Create New</span>
//       </motion.div>
//     </div>
//   </div>
// )}

// {/* Edit Portfolio Modal - Add this after the Create Modal */}
// <AnimatePresence>
//   {showEditModal && editingPortfolio && (
//     <ModalBackdrop onClick={() => {
//       setShowEditModal(false);
//       setEditingPortfolio(null);
//       setEditName('');
//       setEditCorpus('');
//     }}>
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="rounded-2xl p-6 max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h3 className="text-xl font-bold mb-4 text-center">Edit Portfolio</h3>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Portfolio Name
//           </label>
//           <input 
//             type="text" 
//             placeholder="Portfolio Name" 
//             value={editName} 
//             onChange={(e) => setEditName(e.target.value)} 
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none" 
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Corpus (₹)
//           </label>
//           <input 
//             type="number" 
//             placeholder="Corpus (₹)" 
//             value={editCorpus} 
//             onChange={(e) => setEditCorpus(e.target.value)} 
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none" 
//           />
//         </div>
//         <div className="flex gap-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => {
//               setShowEditModal(false);
//               setEditingPortfolio(null);
//               setEditName('');
//               setEditCorpus('');
//             }}
//             className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
//           >
//             Cancel
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => {
//               if (!editName.trim()) {
//                 toast.error('Please enter a portfolio name');
//                 return;
//               }
//               if (!editCorpus || parseFloat(editCorpus) <= 0) {
//                 toast.error('Please enter a valid corpus amount');
//                 return;
//               }
//               editPortfolio();
//             }}
//             className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-sm"
//           >
//             Update Portfolio
//           </motion.button>
//         </div>
//       </motion.div>
//     </ModalBackdrop>
//   )}
// </AnimatePresence>

//           {/* Selected Portfolio View */}
//           {selectedPortfolio && (
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }} 
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="glass-card rounded-2xl p-6 shadow-xl"
//             >
//               {/* Summary cards - Reduced Size */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//                 {[
//                   { label: 'Total Corpus', rawValue: selectedPortfolio.corpus, format: (v) => formatCurrency(v, 0), bg: 'bg-gradient-to-br from-cyan-50 to-blue-50', textGradient: 'from-cyan-500 to-blue-600', icon: <GiStairsGoal className="text-lg" /> },
//                   { label: 'Current Portfolio Value', rawValue: getHoldings().reduce((s, h) => s + h.qty * h.ltp, 0), format: (v) => formatCurrency(v), bg: 'bg-gradient-to-br from-emerald-50 to-teal-50', textGradient: 'from-emerald-500 to-teal-600', icon: <BiTrendingUp className="text-lg" /> },
//                   { label: 'Realised P&L', rawValue: getClosedTrades().reduce((s, t) => s + t.pnl, 0), isPnL: true, icon: <RiCheckboxCircleFill className="text-lg" /> },
//                   { label: 'Unrealised P&L', rawValue: getHoldings().reduce((s, h) => s + h.qty * (h.ltp - h.avgPrice), 0), isPnL: true, icon: <FiArrowUp className="text-lg" /> },
//                   { label: 'Total Brokerage', rawValue: totalBrokerage, format: (v) => formatCurrency(Math.abs(v)), bg: 'bg-gradient-to-br from-orange-50 to-amber-50', textGradient: 'from-orange-500 to-amber-600', icon: <RiMoneyDollarCircleLine className="text-lg" /> },
//                 ].map((item, i) => {
//                   const value = item.rawValue;
//                   const isPositive = value >= 0;
//                   const absValue = Math.abs(value);
//                   const displayValue = item.isPnL ? `${isPositive ? '+' : '-'}${formatCurrency(absValue)}` : item.format?.(value);
//                   const isPnLCard = item.isPnL;
//                   const bg = item.bg || (isPnLCard ? (isPositive ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-rose-50') : '');
//                   const textGradient = item.textGradient || (isPnLCard ? (isPositive ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600') : '');
//                   return (
//                     <motion.div 
//                       key={i} 
//                       initial={{ opacity: 0, y: 20 }} 
//                       animate={{ opacity: 1, y: 0 }} 
//                       transition={{ delay: i * 0.06 }} 
//                       whileHover={{ y: -2, scale: 1.01 }} 
//                       className={`${bg} rounded-xl p-3 text-center border border-white/10 overflow-hidden`}
//                     >
//                       <div className="relative z-10">
//                         <div className="mb-1 inline-block">{item.icon}</div>
//                         <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
//                         <p className={`text-sm font-bold bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}>{displayValue}</p>
//                       </div>
//                       <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl ${isPnLCard ? (value >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500') : 'bg-gradient-to-r ' + textGradient}`} />
//                     </motion.div>
//                   );
//                 })}
//               </div>

//               {/* Tabs */}
//               <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 relative">
//                 {['overview', 'transactions'].map((tab) => (
//                   <motion.button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`flex-1 py-3 text-base font-semibold transition-all duration-300 capitalize relative ${activeTab === tab ? 'text-cyan-600' : 'text-gray-500 hover:text-cyan-600'}`}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     {tab === 'overview' ? 'Portfolio Overview' : 'Transactions'}
//                     {activeTab === tab && (
//                       <motion.div
//                         layoutId="activeTab"
//                         className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-full"
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                       />
//                     )}
//                   </motion.button>
//                 ))}
//               </div>

//               {/* Tab Content */}
//               {activeTab === 'overview' ? (
//                 <>
//                   {/* Trade Section */}
//                   <div className="mb-10">
//                     {!searchMode ? (
//                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSearchMode(true)} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center transition shadow-lg hover:shadow-xl">
//                         <RiAddCircleFill className="mr-3 text-2xl" />
//                         Purchase Stock
//                       </motion.button>
//                     ) : (
//                       <div className="space-y-5">
//                         <div className="relative">
//                           <input type="text" placeholder="Search stock symbol..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-cyan-300 outline-none text-lg shadow-sm" />
//                           <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
//                           <button onClick={resetTradeForm} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"><RiCloseCircleFill size={24} /></button>
//                         </div>

//                         {selectedStock ? (
//                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 shadow-lg">
//                             <div className="flex justify-between items-center mb-4">
//                               <button onClick={() => { setSelectedStock(null); setSearchQuery(''); }} className="text-cyan-600 font-bold text-xl hover:underline flex items-center gap-2">
//                                 <span>{selectedStock.Symbol}</span>
//                                 <RiCloseCircleFill className="text-red-500" size={20} />
//                               </button>
//                               <span className="text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">LTP: {formatCurrency(selectedStock.Close)}</span>
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                               <div>
//                                 <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => {
//                                   const val = e.target.value;
//                                   if (val === '' || /^\d+$/.test(val)) {
//                                     setQuantity(val === '' ? '' : parseInt(val).toString());
//                                   }
//                                 }} onKeyDown={(e) => { if (['.', 'e', 'E', '-', '+'].includes(e.key)) e.preventDefault(); }} className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-300 outline-none" min="1" step="1" />
//                                 {quantity && parseInt(quantity) > 0 && (<p className="text-sm text-gray-600 mt-2 text-right font-medium">Total: {getFormattedTotalInvested(selectedStock.Symbol, quantity)}</p>)}
//                               </div>

//                               <select value={exchange} onChange={(e) => setExchange(e.target.value)} className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-300 outline-none">
//                                 <option>NSE</option>
//                                 <option disabled>BSE (soon)</option>
//                               </select>

//                               <div className="flex gap-2">
//                                 <button onClick={() => handleBuySell('buy')} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all">Buy</button>
//                               </div>
//                             </div>
//                           </motion.div>
//                         ) : searchResults.length > 0 ? (
//                           <div className="space-y-2 max-h-64 overflow-y-auto rounded-2xl">
//                             {searchResults.map((s) => (
//                               <motion.div key={s.Symbol} whileHover={{ x: 4, scale: 1.01 }} onClick={() => { setSelectedStock(s); setSearchQuery(s.Symbol); setQuantity(''); }} className="flex justify-between items-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all border-2 border-transparent hover:border-cyan-200 dark:hover:border-cyan-700">
//                                 <span className="font-semibold text-lg text-gray-800 dark:text-white">{s.Symbol}</span>
//                                 <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent font-bold">{formatCurrency(s.Close)}</span>
//                               </motion.div>
//                             ))}
//                           </div>
//                         ) : searchQuery ? (
//                           <div className="text-center text-gray-500 py-10 glass-card rounded-2xl">
//                             <RiSearchLine className="mx-auto text-4xl mb-3 opacity-50" />
//                             No stocks found
//                           </div>
//                         ) : null}
//                       </div>
//                     )}
//                   </div>

//                   {/* Holdings Section */}
//                   <div className="mb-10">
//                     <div className="flex justify-between items-center mb-6">
//                       <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Current Holdings</h3>
//                       <span className="text-sm text-gray-600 dark:text-gray-400 bg-cyan-100 dark:bg-cyan-900/30 px-3 py-1 rounded-full font-medium">{getHoldings().length} stocks</span>
//                     </div>

//                     {getHoldings().length === 0 ? (
//                       <div className="glass-card rounded-2xl p-12 text-center">
//                         <RiAddCircleFill className="mx-auto text-cyan-500 text-5xl mb-4 opacity-60" />
//                         <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Holdings Yet</h4>
//                         <p className="text-gray-500 dark:text-gray-400">Buy your first stock to start building your portfolio</p>
//                       </div>
//                     ) : (
//                       <div className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
//                         <div className="overflow-x-auto">
//                           <table className="w-full">
//                             <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
//                               <tr>
//                                 <th className="text-left p-4 font-semibold">Symbol</th>
//                                 <th className="text-left p-4 font-semibold">Quantity</th>
//                                 <th className="text-left p-4 font-semibold">Avg Price</th>
//                                 <th className="text-left p-4 font-semibold">LTP</th>
//                                 <th className="text-left p-4 font-semibold">Invested</th>
//                                 <th className="text-left p-4 font-semibold">Current Value</th>
//                                 <th className="text-left p-4 font-semibold">P&L</th>
//                                 <th className="text-left p-4 font-semibold">Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                               {getHoldings().map((h, index) => {
//                                 const invested = (h.qty * h.avgPrice);
//                                 const current = (h.qty * h.ltp);
//                                 const pnl = (h.ltp - h.avgPrice) * h.qty;
//                                 const pnlPct = h.avgPrice > 0 ? ((h.ltp - h.avgPrice) / h.avgPrice) * 100 : 0;
//                                 const profit = pnl >= 0;

//                                 return (
//                                   <motion.tr key={h.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                                     <td className="p-4"><div className="font-bold text-gray-800 dark:text-white text-lg">{h.symbol}</div></td>
//                                     <td className="p-4"><span className="font-semibold text-gray-700 dark:text-gray-300">{formatQuantity(h.qty)}</span></td>
//                                     <td className="p-4"><span className="text-gray-600 dark:text-gray-400">{formatCurrency(h.avgPrice)}</span></td>
//                                     <td className="p-4"><span className="font-semibold text-cyan-600">{formatCurrency(h.ltp)}</span></td>
//                                     <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(invested)}</span></td>
//                                     <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(current)}</span></td>
//                                     <td className="p-4">
//                                       <div className="flex items-center gap-2">
//                                         <span className={`font-bold ${profit ? 'text-green-600' : 'text-red-600'}`}>{profit ? '+' : ''}{formatCurrency(Math.abs(pnl), 0)}</span>
//                                         <span className={`text-xs px-2 py-1 rounded-full ${profit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{profit ? <FiArrowUp className="inline" /> : <FiArrowDown className="inline" />}{Math.abs(pnlPct).toFixed(1)}%</span>
//                                       </div>
//                                     </td>
//                                     <td className="p-4">
//                                       <div className="flex gap-2">
//                                         <input type="number" placeholder="Qty" value={getQty(h.symbol)} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d+$/.test(val)) setQty(h.symbol, val === '' ? '' : parseInt(val).toString()); }} onKeyDown={(e) => { if (['.', 'e', 'E', '-', '+'].includes(e.key)) e.preventDefault(); }} className="w-20 px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-300 outline-none" min="1" step="1" />
//                                         <div className="flex gap-1">
//                                           <button onClick={() => { const q = parseFloat(getQty(h.symbol)) || 0; if (q <= 0) return toast.error('Enter valid quantity'); const stock = stockData.find((s) => s.Symbol === h.symbol); if (!stock) return; setSelectedStock(stock); setQuantity(q.toString()); setConfirmAction('buy'); setShowConfirmModal(true); }} className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-lg font-medium shadow-sm transition-all">Buy</button>
//                                           <button onClick={() => { const q = parseFloat(getQty(h.symbol)) || 0; if (q <= 0) return toast.error('Enter quantity'); if (q > h.qty) return toast.error(`Only ${formatQuantity(h.qty)} available`); const stock = stockData.find((s) => s.Symbol === h.symbol); if (!stock) return; setSelectedStock(stock); setQuantity(q.toString()); setConfirmAction('sell'); setShowConfirmModal(true); }} className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm rounded-lg font-medium shadow-sm transition-all">Sell</button>
//                                         </div>
//                                       </div>
//                                       {getQty(h.symbol) && parseInt(getQty(h.symbol)) > 0 && (<p className="text-xs text-gray-500 mt-1 text-center">{getFormattedTotalInvested(h.symbol, getQty(h.symbol))}</p>)}
//                                     </td>
//                                   </motion.tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Closed Trades Section */}
//                   <div>
//                     <div className="flex justify-between items-center mb-6">
//                       <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Closed Trades</h3>
//                       <span className="text-sm text-gray-600 dark:text-gray-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full font-medium">{getClosedTrades().length} trades</span>
//                     </div>

//                     {getClosedTrades().length === 0 ? (
//                       <div className="glass-card rounded-2xl p-12 text-center">
//                         <RiCheckboxCircleFill className="mx-auto text-purple-500 text-5xl mb-4 opacity-60" />
//                         <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Closed Trades</h4>
//                         <p className="text-gray-500 dark:text-gray-400">Your completed trades will appear here</p>
//                       </div>
//                     ) : (
//                       <div className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
//                         <div className="overflow-x-auto">
//                           <table className="w-full">
//                             <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
//                               <tr>
//                                 <th className="text-left p-4 font-semibold">Symbol</th>
//                                 <th className="text-left p-4 font-semibold">Quantity</th>
//                                 <th className="text-left p-4 font-semibold">Avg Price</th>
//                                 <th className="text-left p-4 font-semibold">Invested</th>
//                                 <th className="text-left p-4 font-semibold">Sold Value</th>
//                                 <th className="text-left p-4 font-semibold">P&L</th>
//                                 <th className="text-left p-4 font-semibold">Return %</th>
//                                 <th className="text-left p-4 font-semibold">Closed Date</th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                               {getClosedTrades().map((trade, index) => {
//                                 const invested = (trade.qty * trade.avgPrice);
//                                 const sold = (parseFloat(invested) + trade.pnl);
//                                 const profit = trade.pnl >= 0;
//                                 const pnlPct = trade.avgPrice > 0 ? (trade.pnl / (trade.qty * trade.avgPrice)) * 100 : 0;

//                                 return (
//                                   <motion.tr key={`${trade.symbol}-${trade.sellDate}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                                     <td className="p-4"><div className="font-bold text-gray-800 dark:text-white">{trade.symbol}</div></td>
//                                     <td className="p-4"><span className="font-semibold text-gray-700 dark:text-gray-300">{formatQuantity(trade.qty)}</span></td>
//                                     <td className="p-4"><span className="text-gray-600 dark:text-gray-400">{formatCurrency(trade.avgPrice)}</span></td>
//                                     <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(invested)}</span></td>
//                                     <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(sold)}</span></td>
//                                     <td className="p-4"><div className="flex items-center gap-2"><span className={`font-bold ${profit ? 'text-green-600' : 'text-red-600'}`}>{profit ? '+' : ''}{formatCurrency(Math.abs(trade.pnl), 0)}</span></div></td>
//                                     <td className="p-4"><span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${profit ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>{profit ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}{Math.abs(pnlPct).toFixed(1)}%</span></td>
//                                     <td className="p-4"><span className="text-sm text-gray-500 dark:text-gray-400">{trade.sellDate}</span></td>
//                                   </motion.tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 /* Transactions Tab */
//                 <div>
//                   <div className="flex justify-end mb-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">To perform a detailed analysis, download your transaction data and upload it on the <Link to="/portfolio" className="font-medium text-cyan-600 hover:underline">Upload File</Link> page.</p>
//                   </div>

//                   <div className="flex justify-end mb-4">
//                     <button onClick={downloadCSV} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition shadow-lg hover:shadow-xl flex items-center gap-2"><AiOutlineDownload /> Download CSV</button>
//                   </div>

//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Transaction History</h3>
//                     <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
//                       {[
//                         { k: 'all', l: 'All' },
//                         { k: '3d', l: '3D' },
//                         { k: '1w', l: '1W' },
//                         { k: '2w', l: '2W' },
//                         { k: '1m', l: '1M' },
//                         { k: '3m', l: '3M' },
//                         { k: '1y', l: '1Y' },
//                       ].map(({ k, l }) => (
//                         <button key={k} onClick={() => setBrokerageFilter(k)} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${brokerageFilter === k ? 'bg-white dark:bg-gray-900 text-cyan-600 shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600'}`}>{l}</button>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
//                           <tr>
//                             {[
//                               'Symbol',
//                               'Date & Time',
//                               'Qty',
//                               'Price',
//                               'Value',
//                               'Brokerage',
//                               'Frame',
//                               'Exchange',
//                               'Type',
//                             ].map((h) => (
//                               <th key={h} className="p-4 font-semibold text-left tracking-wide text-xs uppercase">{h}</th>
//                             ))}
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {getFilteredTransactions().length === 0 ? (
//                             <tr>
//                               <td colSpan={10} className="text-center py-12 text-gray-500 dark:text-gray-400">No transactions in selected period</td>
//                             </tr>
//                           ) : (
//                             getFilteredTransactions().map((t, i) => (
//                               <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
//                                 <td className="p-4 font-medium">{t.Symbol}</td>
//                                 <td className="p-4 font-mono text-xs">{t.DateTime}</td>
//                                 <td className="p-4">{formatQuantity(t.Qty)}</td>
//                                 <td className="p-4">{formatCurrency(t.Price)}</td>
//                                 <td className="p-4">{formatCurrency(t.MarketValue)}</td>
//                                 <td className="p-4">{formatCurrency(t.BrokerageAmount)}</td>
//                                 <td className="p-4 font-medium">{t.frame}</td>
//                                 <td className="p-4">{exchange}</td>
//                                 <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${t.OrderType === 'B' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.OrderType === 'B' ? 'BUY' : 'SELL'}</span></td>
//                               </motion.tr>
//                             ))
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </div>

//         {/* Modals */}
//         <AnimatePresence>
//           {showCreateModal && (
//             <ModalBackdrop onClick={() => setShowCreateModal(false)}>
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="glass-card rounded-2xl p-6 max-w-md w-full shadow-xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <h3 className="text-xl font-bold mb-4 text-center">Create New Portfolio</h3>
//                 <input type="text" placeholder="Portfolio Name" value={newPortfolioName} onChange={(e) => setNewPortfolioName(e.target.value)} className="w-full mb-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none" />
//                 <input type="number" placeholder="Initial Corpus (₹)" value={newCorpus} onChange={(e) => setNewCorpus(e.target.value)} className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none" />
//                 <div className="flex gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowCreateModal(false)}
//                     className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={createPortfolio}
//                     className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-sm"
//                   >
//                     Create
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </ModalBackdrop>
//           )}
//         </AnimatePresence>

//         {/* Confirmation Modal */}
//         <AnimatePresence>
//           {showConfirmModal && (
//             <ModalBackdrop onClick={() => setShowConfirmModal(false)}>
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="glass-card rounded-2xl p-6 max-w-md w-full shadow-xl"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="text-center mb-6">
//                   <RiCheckboxCircleFill 
//                     className={`mx-auto text-4xl mb-4 ${
//                       confirmAction === 'buy' ? 'text-green-500' : 'text-red-500'
//                     }`} 
//                   />
//                   <h3 className="text-xl font-bold mb-2">
//                     Confirm {confirmAction === 'buy' ? 'Buy' : 'Sell'}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-300">
//                     {confirmAction === 'buy' ? 'Buy' : 'Sell'} {quantity} shares of {selectedStock?.Symbol} 
//                     at {formatCurrency(selectedStock?.Close)}?
//                   </p>
//                   <p className="font-semibold mt-2">
//                     Total: {getFormattedTotalInvested(selectedStock?.Symbol, quantity)}
//                   </p>
//                 </div>

//                 <div className="flex gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowConfirmModal(false)}
//                     className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={confirmTrade}
//                     className={`flex-1 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all ${
//                       confirmAction === 'buy' 
//                         ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
//                         : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
//                     }`}
//                   >
//                     Confirm {confirmAction === 'buy' ? 'Buy' : 'Sell'}
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </ModalBackdrop>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// }

// /* Reusable Modal Backdrop */
// const ModalBackdrop = ({ children, onClick }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
//     onClick={onClick}
//   >
//     <div
//       className="w-full max-w-md mx-auto rounded-2xl p-6 max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl text-gray-800 dark:text-gray-100"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {children}
//     </div>
//   </motion.div>
// );

// // Add the missing icon component
// const RiMoneyDollarCircleLine = ({ className }) => (
//   <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
//     <path fill="none" d="M0 0h24v24H0z"></path>
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"></path>
//   </svg>
// );


import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  RiSearchLine,
  RiAddCircleFill,
  RiDeleteBinLine,
  RiEdit2Line,
  RiCloseCircleFill,
  RiCheckboxCircleFill,
} from 'react-icons/ri';
import { FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineDownload } from 'react-icons/ai';
import { GiStairsGoal } from 'react-icons/gi';
import { BiTrendingUp } from 'react-icons/bi';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { saveAs } from 'file-saver';
import { trackAction, trackCMDAHubTools } from '../../utils/tracking';

// Format number to Indian numbering system (1,03,45,678) - only show decimals if non-zero
const formatIndianNumber = (number, decimals = 2) => {
  if (number === null || number === undefined || isNaN(number)) return '0';

  const num = parseFloat(number);
  if (num === 0) return '0';

  // Check if the number has non-zero decimal values
  const hasNonZeroDecimals = Math.abs(num - Math.floor(num)) > 0.0001;

  // For very small numbers, always show decimals
  if (Math.abs(num) < 0.01 && Math.abs(num) > 0) {
    return num.toFixed(decimals);
  }

  const parts = num.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Handle negative numbers
  const isNegative = integerPart.startsWith('-');
  if (isNegative) {
    integerPart = integerPart.substring(1);
  }

  // Indian numbering system: 1,03,45,678
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  // Only include decimal part if it has non-zero values
  const result = (isNegative ? '-' : '') + formattedInteger +
    (hasNonZeroDecimals && decimalPart && parseInt(decimalPart) !== 0 ? '.' + decimalPart.replace(/0+$/, '') : '');

  return result;
};

// Format currency with ₹ symbol - only show decimals if non-zero
const formatCurrency = (amount, decimals = 2) => {
  const formatted = formatIndianNumber(amount, decimals);
  return `₹${formatted}`;
};

// Special format for quantities (no decimals ever)
const formatQuantity = (quantity) => {
  return formatIndianNumber(quantity, 0);
};

export default function PaperTrading() {
  /* ────────────────────── AUTH ────────────────────── */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const getToken = () => {
    const t = localStorage.getItem('authToken');
    return t && t !== 'null' ? t : null;
  };
  const navigate = useNavigate();

  /* ────────────────────── LOADING ────────────────────── */
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackCMDAHubTools.paperTrading.view();
  }, []);

  /* ────────────────────── CSV DOWNLOAD ────────────────────── */
  const downloadCSV = () => {
    const rows = selectedPortfolio?.transactions || [];
    if (!rows.length) return;

    const headers = [
      'Symbol',
      'Date',
      'Time',
      'OrderType',
      'Qty',
      'Price',
      'MarketValue',
      'BrokerageAmount',
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => {
        const [date, time] = (row.DateTime || '').split(' ');
        return headers
          .map(h => {
            const value = h === 'Date' ? date : h === 'Time' ? time : row[h] ?? '';
            return `"${value}"`;
          })
          .join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${selectedPortfolio.name}_transactions.csv`);
  };

  /* ────────────────────── PORTFOLIOS ────────────────────── */
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  /* ────────────────────── TABS ────────────────────── */
  const [activeTab, setActiveTab] = useState('overview');

  /* ────────────────────── Book profit ────────────────────── */
  const calculateTotalBookProfit = useCallback((transactions) => {
    if (!transactions || transactions.length === 0) return 0;

    const sorted = [...transactions].sort((a, b) => {
      const aDate = new Date(a.DateTime || '');
      const bDate = new Date(b.DateTime || '');
      return aDate - bDate;
    });

    const holdings = {};
    let totalProfit = 0;

    sorted.forEach(tx => {
      const symbol = tx.Symbol;
      const qty = parseFloat(tx.Qty) || 0;
      const price = parseFloat(tx.Price) || 0;

      if (!holdings[symbol]) {
        holdings[symbol] = { qty: 0, cost: 0 };
      }

      if (tx.OrderType === 'B') {
        holdings[symbol].qty += qty;
        holdings[symbol].cost += qty * price;
      } else if (tx.OrderType === 'S') {
        const avgCost = holdings[symbol].qty > 0
          ? holdings[symbol].cost / holdings[symbol].qty
          : 0;
        const profit = qty * (price - avgCost);
        totalProfit += profit;

        holdings[symbol].qty -= qty;
        holdings[symbol].cost -= avgCost * qty;

        if (holdings[symbol].qty < 0.001) {
          holdings[symbol].qty = 0;
          holdings[symbol].cost = 0;
        }
      }
    });

    return totalProfit;
  }, []);

  const totalBookProfit = useMemo(() => {
    return selectedPortfolio
      ? calculateTotalBookProfit(selectedPortfolio.transactions || [])
      : 0;
  }, [selectedPortfolio, calculateTotalBookProfit]);

  /* ────────────────────── CREATE / EDIT / MODALS ────────────────────── */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newCorpus, setNewCorpus] = useState('');
  const [showEditMenu, setShowEditMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCorpus, setEditCorpus] = useState('');

  /* ────────────────────── TRADE UI ────────────────────── */
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [exchange, setExchange] = useState('NSE');
  const [quantity, setQuantity] = useState('');
  const [quantities, setQuantities] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState('buy');

  /* ────────────────────── STOCK DATA ────────────────────── */
  const [stockData, setStockData] = useState([]);

  /* ────────────────────── FILTER STATE ────────────────────── */
  const [brokerageFilter, setBrokerageFilter] = useState('all');

  /* ────────────────────── FETCH STOCK LIST ────────────────────── */
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.post(`${API_BASE}/file/build_Portfolio`);
        setStockData(res.data.portfolio_data || []);
      } catch (err) {
        toast.error('Failed to load stock list');
      }
    };
    fetchStocks();
  }, [API_BASE]);

  /* ────────────────────── SEARCH (client-side) ────────────────────── */
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const filtered = stockData.filter((s) =>
      s.Symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery, stockData]);

  /* ────────────────────── CHECK LOGIN ────────────────────── */
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  /* ────────────────────── HELPERS ────────────────────── */
  const getQty = (symbol) => quantities[symbol] || '';
  const setQty = (symbol, value) => {
    setQuantities(prev => ({ ...prev, [symbol]: value }));
  };

  const totalBrokerage = useMemo(() => {
    if (!selectedPortfolio?.transactions) return 0;
    return selectedPortfolio.transactions.reduce((sum, t) => {
      return sum + parseFloat(t.BrokerageAmount || 0);
    }, 0);
  }, [selectedPortfolio]);

  const getTotalInvested = (symbol, qtyStr) => {
    const qty = parseInt(qtyStr) || 0;
    const stock = stockData.find(s => s.Symbol === symbol);
    if (!stock || qty === 0) return '0.00';
    return (qty * stock.Close).toFixed(2);
  };

  const getFormattedTotalInvested = (symbol, qtyStr) => {
    const total = getTotalInvested(symbol, qtyStr);
    return formatCurrency(total);
  };

  /* ────────────────────── FETCH PORTFOLIOS ────────────────────── */
  const fetchPortfolios = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoggedIn(false);
      toast.error('Please log in to view your portfolios.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/paper-trade/fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const options = processPortfolios(res.data || []);
      setPortfolios(options);

      if (options.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(options[0]);
      }
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      fetchPortfolios();
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, [fetchPortfolios]);

  /* ────────────────────── PROCESS RAW PORTFOLIOS ────────────────────── */
  const processPortfolios = (raw) => {
    return raw.map((p) => ({
      displayName: p.displayName || `Portfolio ${p.series}`,
      name: p.displayName || `Portfolio ${p.series}`,
      value: p.series?.toString() || '',
      corpus: Number(p.corpus),
      data: Array.isArray(p.data)
        ? p.data.map((item) => {
          let dateObj = new Date();
          if (typeof item.Date === 'string' && item.Date.includes('/')) {
            const [day, month, year] = item.Date.split('/');
            dateObj = new Date(`${year}-${month}-${day}T${item.Time || '00:00:00'}`);
          } else if (typeof item.Date === 'number' || !isNaN(parseInt(item.Date))) {
            dateObj = new Date(parseInt(item.Date));
          }
          const formattedDate = dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          const formattedTime = dateObj.toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          const dateTimeStr = `${formattedDate} ${formattedTime}`;
          return {
            ...item,
            Qty: item.Qty?.toString() || '0',
            Price: parseFloat(item.Price || 0).toFixed(2),
            MarketValue: parseFloat(item.MarketValue || 0).toFixed(2),
            BrokerageAmount: isNaN(item.BrokerageAmount)
              ? '0.00'
              : parseFloat(item.BrokerageAmount).toFixed(2),
            DateTime: dateTimeStr,
            frame: item.Frame || item.frame || '—',
          };
        })
        : [],
      transactions: Array.isArray(p.data)
        ? p.data.map((item) => {
          let dateObj = new Date();
          if (typeof item.Date === 'string' && item.Date.includes('/')) {
            const [day, month, year] = item.Date.split('/');
            dateObj = new Date(`${year}-${month}-${day}T${item.Time || '00:00:00'}`);
          } else if (typeof item.Date === 'number' || !isNaN(parseInt(item.Date))) {
            dateObj = new Date(parseInt(item.Date));
          }
          const formattedDate = dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          const formattedTime = dateObj.toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          return {
            ...item,
            DateTime: `${formattedDate} ${formattedTime}`,
            frame: item.Frame || item.frame || '—',
          };
        })
        : [],
      tableName: p.internalTableName,
    }));
  };

  /* ────────────────────── CREATE / EDIT / DELETE / SAVE / TRADE ────────────────────── */
  const createPortfolio = async () => {
    const token = getToken();
    if (!token) return toast.error('Please log in.');
    if (!newPortfolioName || !newCorpus) return;

    try {
      await axios.post(
        `${API_BASE}/paper-trade/create?name=${encodeURIComponent(newPortfolioName)}&corpus=${newCorpus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Portfolio created');
      setShowCreateModal(false);
      setNewPortfolioName('');
      setNewCorpus('');
      fetchPortfolios();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create portfolio');
    }
  };

  const editPortfolio = async () => {
    const token = getToken();
    if (!token || !editingPortfolio) return;

    // Validate inputs
    if (!editName.trim()) {
      toast.error('Please enter a portfolio name');
      return;
    }

    if (!editCorpus || parseFloat(editCorpus) <= 0) {
      toast.error('Please enter a valid corpus amount');
      return;
    }

    try {
      await axios.patch(
        `${API_BASE}/paper-trade/edit`,
        {},
        {
          params: {
            portfolioname: editingPortfolio.name,
            ...(editName && editName !== editingPortfolio.name && { newName: editName }),
            ...(editCorpus && { corpus: editCorpus }),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Portfolio updated successfully');
      setShowEditModal(false);
      setEditingPortfolio(null);
      setEditName('');
      setEditCorpus('');
      await fetchPortfolios();
    } catch (e) {
      console.error('Edit portfolio error:', e);
      toast.error(e.response?.data?.error || 'Failed to update portfolio');
    }
  };

  const deleteTransaction = async (transactionId) => {
    const token = getToken();
    if (!token || !selectedPortfolio) return;

    if (!window.confirm('Delete this transaction?')) return;

    try {
      await axios.delete(`${API_BASE}/paper-trade/transaction-delete`, {
        params: { portfolioname: selectedPortfolio.name, transactionId },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Transaction deleted');
      fetchPortfolios();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to delete');
    }
  };

  const deletePortfolio = async (name) => {
    const token = getToken();
    if (!token) return toast.error('Please log in.');

    try {
      await axios.delete(`${API_BASE}/paper-trade/delete?portfolioname=${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Portfolio deleted');
      fetchPortfolios();
      if (selectedPortfolio?.name === name) {
        setSelectedPortfolio(portfolios[0] || null);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete');
    }
  };

  const saveTransaction = async (transaction, portfolioName) => {
    const token = getToken();
    if (!token) {
      toast.error('Not logged in.');
      return;
    }

    try {
      const payload = [transaction];
      await axios.post(
        `${API_BASE}/paper-trade/save?portfolioname=${portfolioName}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (transaction.OrderType === 'B') {
        trackCMDAHubTools.portfolio.addStock(transaction.Symbol, transaction.Qty);
      } else {
        trackCMDAHubTools.portfolio.deleteStock(transaction.Symbol);
      }
      toast.success(
        `${transaction.OrderType === 'B' ? 'Bought' : 'Sold'} ${transaction.Qty} ${transaction.Symbol}`
      );
      await fetchPortfoliosAndSelectCurrent(portfolioName);
      resetTradeForm();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Trade failed');
      throw e;
    }
  };

  const resetTradeForm = () => {
    setSearchMode(false);
    setSearchQuery('');
    setSelectedStock(null);
    setQuantity('');
    setExchange('NSE');
  };

  const handleBuySell = (action) => {
    if (!selectedStock || !quantity || parseFloat(quantity) <= 0 || !selectedPortfolio) {
      toast.error('Enter a valid quantity');
      return;
    }
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const fetchPortfoliosAndSelectCurrent = async (portfolioName) => {
    const token = getToken();
    if (!token || !portfolioName) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/paper-trade/fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const options = processPortfolios(res.data || []);
      setPortfolios(options);
      const updated = options.find((p) => p.name === portfolioName);
      if (updated) setSelectedPortfolio(updated);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to refresh');
    } finally {
      setLoading(false);
    }
  };

  const updateCorpusOnServer = async (newCorpus) => {
    const token = getToken();
    if (!token || !selectedPortfolio) return;

    try {
      await axios.patch(
        `${API_BASE}/paper-trade/edit`,
        {},
        {
          params: { portfolioname: selectedPortfolio.name, corpus: newCorpus },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (e) {
      toast.error('Failed to update corpus on server');
      console.error(e);
    }
  };

  const confirmTrade = async () => {
    if (!selectedStock || !quantity || parseInt(quantity) <= 0 || !Number.isInteger(parseInt(quantity))) {
      toast.error('Invalid quantity');
      return;
    }

    const qty = parseFloat(quantity);
    const price = selectedStock.Close;
    const orderType = confirmAction === 'buy' ? 'B' : 'S';
    const tradeValue = qty * price;
    const brokerageAmount =
      orderType === 'B' ? Math.min(0.0003 * tradeValue, 20) : 0.0005 * tradeValue;
    const totalCost = tradeValue + brokerageAmount;
    const totalProceeds = tradeValue - brokerageAmount;
    const currentCorpus = selectedPortfolio.corpus;

    if (orderType === 'B' && totalCost > currentCorpus) {
      toast.error(
        `Insufficient corpus! Need ${formatCurrency(totalCost)}, Available: ${formatCurrency(currentCorpus)}`
      );
      setShowConfirmModal(false);
      return;
    }

    if (orderType === 'S') {
      const holding = getHoldings().find((h) => h.symbol === selectedStock.Symbol);
      if (!holding || qty > holding.qty) {
        toast.error(`Cannot sell ${qty}. Only ${holding?.qty || 0} available.`);
        setShowConfirmModal(false);
        return;
      }
    }

    const updatedCorpus = orderType === 'B' ? currentCorpus - totalCost : currentCorpus + totalProceeds;
    const portfolioName = selectedPortfolio.name;

    // Business date logic (unchanged)
    const getPreviousTradingDay = () => {
      const date = new Date();
      const day = date.getDay();
      if (day === 0 || day === 6 || day === 1) {
        const daysToFriday = day === 0 ? 2 : day === 6 ? 1 : 3;
        date.setDate(date.getDate() - daysToFriday);
        return date;
      }
      date.setDate(date.getDate() - 1);
      return date;
    };

    const tradeDate = getPreviousTradingDay();

    const transaction = {
      Symbol: selectedStock.Symbol,
      Date: tradeDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      Time: new Date().toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      OrderType: orderType,
      Qty: qty.toString(),
      Price: price.toFixed(2),
      MarketValue: tradeValue.toFixed(2),
      BrokerageAmount: brokerageAmount.toFixed(2),
    };

    try {
      await saveTransaction(transaction, portfolioName);
      await updateCorpusOnServer(updatedCorpus);
      await fetchPortfoliosAndSelectCurrent(portfolioName);
    } catch (err) {
      toast.error('Trade failed – corpus reverted');
      console.error(err);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const getFilteredTransactions = () => {
    if (!selectedPortfolio?.transactions) return [];
    const now = new Date();
    const cutoffMap = { '3d': 3, '1w': 7, '2w': 14, '1m': 30, '3m': 90, '1y': 365 };
    if (brokerageFilter === 'all') return selectedPortfolio.transactions;
    const days = cutoffMap[brokerageFilter];
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - days);
    return selectedPortfolio.transactions.filter((t) => {
      const [dateStr] = t.DateTime.split(' ');
      const [d, m, y] = dateStr.split('/');
      const txDate = new Date(`${y}-${m}-${d}`);
      return txDate >= cutoff;
    });
  };

  const getClosedTrades = () => {
    if (!selectedPortfolio || !Array.isArray(selectedPortfolio.transactions)) return [];
    const trades = {};
    const sellEvents = {};
    selectedPortfolio.transactions.forEach((t) => {
      const symbol = t.Symbol;
      const qty = parseFloat(t.Qty) || 0;
      const price = parseFloat(t.Price) || 0;
      const dateTime = t.DateTime || '01/01/1970 00:00:00';
      const date = dateTime.split(' ')[0];
      if (!trades[symbol]) trades[symbol] = { buy: 0, sell: 0, invested: 0, soldValue: 0 };
      if (t.OrderType === 'B') {
        trades[symbol].buy += qty;
        trades[symbol].invested += qty * price;
      } else {
        trades[symbol].sell += qty;
        trades[symbol].soldValue += qty * price;
        if (!sellEvents[symbol]) sellEvents[symbol] = date;
      }
    });
    return Object.entries(trades)
      .filter(([, t]) => Math.abs(t.buy - t.sell) < 0.001)
      .map(([symbol, t]) => {
        const avgBuy = t.buy > 0 ? (t.invested / t.buy).toFixed(2) : '0.00';
        const pnl = (t.soldValue - t.invested).toFixed(2);
        return {
          symbol,
          qty: t.buy,
          avgPrice: avgBuy,
          pnl: parseFloat(pnl),
          sellDate: sellEvents[symbol] || 'Unknown',
        };
      })
      .sort((a, b) => b.sellDate.localeCompare(a.sellDate));
  };

  const getHoldings = () => {
    if (!selectedPortfolio) return [];
    const holdings = {};
    selectedPortfolio.transactions.forEach((t) => {
      if (!holdings[t.Symbol]) holdings[t.Symbol] = { qty: 0, invested: 0 };
      const qty = parseFloat(t.Qty);
      if (t.OrderType === 'B') {
        holdings[t.Symbol].qty += qty;
        holdings[t.Symbol].invested += qty * parseFloat(t.Price);
      } else {
        holdings[t.Symbol].qty -= qty;

        const avgPrice =
          holdings[t.Symbol].qty + qty > 0
            ? holdings[t.Symbol].invested / (holdings[t.Symbol].qty + qty)
            : 0;

        holdings[t.Symbol].invested -= avgPrice * qty;
      }
    });
    return Object.entries(holdings)
      .filter(([, h]) => h.qty > 0)
      .map(([symbol, h]) => {
        const avg = (h.invested / h.qty).toFixed(2);
        const ltp = stockData.find((s) => s.Symbol === symbol)?.Close || 0;
        return { symbol, qty: h.qty, avgPrice: avg, ltp };
      });
  };

  /* ────────────────────── NOT LOGGED IN ────────────────────── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-12 max-w-md w-full text-center shadow-2xl"
          >
            <FaLock className="mx-auto text-cyan-600 dark:text-cyan-400 text-6xl mb-6" />
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-gray-600 mb-4">
              Please Login First
            </h1>
            <button
              onClick={() => navigate('/login')}
              className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-10 rounded-full transition shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ────────────────────── RENDER ────────────────────── */
  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 relative">
        <Navbar />

        {/* Floating hero glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl top-20 left-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse" />
        </div>

        <div className="w-full mx-auto px-6 pt-24 pb-16 relative z-10 max-w-7xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Paper Trading</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Practice strategies with live market data — zero risk
            </p>

            {/* Disclaimer moved below header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 bg-gradient-to-r from-orange-400 to-amber-500 text-white py-3 px-6 rounded-2xl shadow-lg max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3">
                <FaExclamationTriangle className="text-lg" />
                <p className="text-sm font-medium text-center">
                  This is a paper trading platform — virtual funds only. No actual shares are exchanged.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-600"></div>
            </motion.div>
          )}

          {/* Portfolio Controls */}
          {portfolios.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-8 gap-4"
            >
              {/* Portfolio selector */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/70 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <select
                  value={selectedPortfolio?.name || ''}
                  onChange={(e) => {
                    const p = portfolios.find(pf => pf.name === e.target.value);
                    if (p) setSelectedPortfolio(p);
                  }}
                  className="bg-transparent px-2 py-1 outline-none text-sm font-medium"
                >
                  {portfolios.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium hover:from-cyan-700 hover:to-blue-700 transition-shadow shadow-md"
              >
                <AiOutlinePlus /> New Portfolio
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
              >
                <AiOutlineDownload className="text-lg" />
                <span className="text-sm font-medium">Export</span>
              </motion.button>
            </motion.div>
          )}

          {/* No portfolios UI */}
          {portfolios.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 text-center shadow-xl max-w-md mx-auto"
            >
              <RiAddCircleFill className="mx-auto text-cyan-600 text-4xl mb-3" />
              <h3 className="text-xl font-bold mb-2">Create Your First Portfolio</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto text-sm"
              >
                <AiOutlinePlus /> Create Portfolio
              </motion.button>
            </motion.div>
          )}


          {/* Portfolio Cards - Create Card Only Fixed When Needed */}
          {portfolios.length > 0 && (
            <div className="relative mb-8">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                {portfolios.map((p, i) => {
                  const isSelected = selectedPortfolio?.name === p.name;
                  return (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedPortfolio(p)}
                      className={`flex-shrink-0 w-64 rounded-xl p-4 cursor-pointer bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 shadow-lg transform scale-105 border-blue-400' : 'hover:shadow-md border-white/50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-800 dark:text-white truncate">{p.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Corpus: <span className="font-semibold text-cyan-600">{formatCurrency(p.corpus, 0)}</span></p>
                        </div>
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPortfolio(p);
                              setEditName(p.name);
                              setEditCorpus(p.corpus.toString());
                              setShowEditModal(true);
                            }}
                            className="text-cyan-600 hover:text-cyan-700 p-1 rounded transition text-sm"
                            title="Edit Portfolio"
                          >
                            <RiEdit2Line />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                deletePortfolio(p.name);
                              }
                            }}
                            className="text-red-500 hover:text-red-600 p-1 rounded transition text-sm"
                            title="Delete Portfolio"
                          >
                            <RiDeleteBinLine />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Create New Card - Always at the end of the list */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex-shrink-0 w-64 rounded-xl p-4 flex flex-col items-center justify-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-md cursor-pointer border border-dashed border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-50/30 transition"
                  onClick={() => setShowCreateModal(true)}
                >
                  <RiAddCircleFill className="text-cyan-600 text-3xl mb-1" />
                  <span className="text-sm font-semibold text-cyan-600">Create New</span>
                </motion.div>
              </div>
            </div>
          )}

          {/* Edit Portfolio Modal - Add this after the Create Modal */}
          <AnimatePresence>
            {showEditModal && editingPortfolio && (
              <ModalBackdrop onClick={() => {
                setShowEditModal(false);
                setEditingPortfolio(null);
                setEditName('');
                setEditCorpus('');
              }}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="rounded-2xl p-6 max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4 text-center">Edit Portfolio</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Portfolio Name
                    </label>
                    <input
                      type="text"
                      placeholder="Portfolio Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Corpus (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Corpus (₹)"
                      value={editCorpus}
                      onChange={(e) => setEditCorpus(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingPortfolio(null);
                        setEditName('');
                        setEditCorpus('');
                      }}
                      className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (!editName.trim()) {
                          toast.error('Please enter a portfolio name');
                          return;
                        }
                        if (!editCorpus || parseFloat(editCorpus) <= 0) {
                          toast.error('Please enter a valid corpus amount');
                          return;
                        }
                        editPortfolio();
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-sm"
                    >
                      Update Portfolio
                    </motion.button>
                  </div>
                </motion.div>
              </ModalBackdrop>
            )}
          </AnimatePresence>

          {/* Selected Portfolio View */}
          {selectedPortfolio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 shadow-xl"
            >
              {/* Summary cards - Reduced Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {[
                  { label: 'Total Corpus', rawValue: selectedPortfolio.corpus, format: (v) => formatCurrency(v, 0), bg: 'bg-gradient-to-br from-cyan-50 to-blue-50', textGradient: 'from-cyan-500 to-blue-600', icon: <GiStairsGoal className="text-lg" /> },
                  { label: 'Current Portfolio Value', rawValue: getHoldings().reduce((s, h) => s + h.qty * h.ltp, 0), format: (v) => formatCurrency(v), bg: 'bg-gradient-to-br from-emerald-50 to-teal-50', textGradient: 'from-emerald-500 to-teal-600', icon: <BiTrendingUp className="text-lg" /> },
                  { label: 'Realised P&L', rawValue: getClosedTrades().reduce((s, t) => s + t.pnl, 0), isPnL: true, icon: <RiCheckboxCircleFill className="text-lg" /> },
                  { label: 'Unrealised P&L', rawValue: getHoldings().reduce((s, h) => s + h.qty * (h.ltp - h.avgPrice), 0), isPnL: true, icon: <FiArrowUp className="text-lg" /> },
                  { label: 'Total Brokerage', rawValue: totalBrokerage, format: (v) => formatCurrency(Math.abs(v)), bg: 'bg-gradient-to-br from-orange-50 to-amber-50', textGradient: 'from-orange-500 to-amber-600', icon: <RiMoneyDollarCircleLine className="text-lg" /> },
                ].map((item, i) => {
                  const value = item.rawValue;
                  const isPositive = value >= 0;
                  const absValue = Math.abs(value);
                  const displayValue = item.isPnL ? `${isPositive ? '+' : '-'}${formatCurrency(absValue)}` : item.format?.(value);
                  const isPnLCard = item.isPnL;
                  const bg = item.bg || (isPnLCard ? (isPositive ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-rose-50') : '');
                  const textGradient = item.textGradient || (isPnLCard ? (isPositive ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600') : '');
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className={`${bg} rounded-xl p-3 text-center border border-white/10 overflow-hidden`}
                    >
                      <div className="relative z-10">
                        <div className="mb-1 inline-block">{item.icon}</div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                        <p className={`text-sm font-bold bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}>{displayValue}</p>
                      </div>
                      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl ${isPnLCard ? (value >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500') : 'bg-gradient-to-r ' + textGradient}`} />
                    </motion.div>
                  );
                })}
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 relative">
                {['overview', 'transactions'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-base font-semibold transition-all duration-300 capitalize relative ${activeTab === tab ? 'text-cyan-600' : 'text-gray-500 hover:text-cyan-600'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab === 'overview' ? 'Portfolio Overview' : 'Transactions'}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' ? (
                <>
                  {/* Trade Section */}
                  <div className="mb-10">
                    {!searchMode ? (
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSearchMode(true)} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center transition shadow-lg hover:shadow-xl">
                        <RiAddCircleFill className="mr-3 text-2xl" />
                        Purchase Stock
                      </motion.button>
                    ) : (
                      <div className="space-y-5">
                        <div className="relative">
                          <input type="text" placeholder="Search stock symbol..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-cyan-300 outline-none text-lg shadow-sm" />
                          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                          <button onClick={resetTradeForm} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"><RiCloseCircleFill size={24} /></button>
                        </div>

                        {selectedStock ? (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                              <button onClick={() => { setSelectedStock(null); setSearchQuery(''); }} className="text-cyan-600 font-bold text-xl hover:underline flex items-center gap-2">
                                <span>{selectedStock.Symbol}</span>
                                <RiCloseCircleFill className="text-red-500" size={20} />
                              </button>
                              <span className="text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">LTP: {formatCurrency(selectedStock.Close)}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '' || /^\d+$/.test(val)) {
                                    setQuantity(val === '' ? '' : parseInt(val).toString());
                                  }
                                }} onKeyDown={(e) => { if (['.', 'e', 'E', '-', '+'].includes(e.key)) e.preventDefault(); }} className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-300 outline-none" min="1" step="1" />
                                {quantity && parseInt(quantity) > 0 && (<p className="text-sm text-gray-600 mt-2 text-right font-medium">Total: {getFormattedTotalInvested(selectedStock.Symbol, quantity)}</p>)}
                              </div>

                              <select value={exchange} onChange={(e) => setExchange(e.target.value)} className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-300 outline-none">
                                <option>NSE</option>
                                <option disabled>BSE (soon)</option>
                              </select>

                              <div className="flex gap-2">
                                <button onClick={() => handleBuySell('buy')} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all">Buy</button>
                              </div>
                            </div>
                          </motion.div>
                        ) : searchResults.length > 0 ? (
                          <div className="space-y-2 max-h-64 overflow-y-auto rounded-2xl">
                            {searchResults.map((s) => (
                              <motion.div key={s.Symbol} whileHover={{ x: 4, scale: 1.01 }} onClick={() => { setSelectedStock(s); setSearchQuery(s.Symbol); setQuantity(''); }} className="flex justify-between items-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all border-2 border-transparent hover:border-cyan-200 dark:hover:border-cyan-700">
                                <span className="font-semibold text-lg text-gray-800 dark:text-white">{s.Symbol}</span>
                                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent font-bold">{formatCurrency(s.Close)}</span>
                              </motion.div>
                            ))}
                          </div>
                        ) : searchQuery ? (
                          <div className="text-center text-gray-500 py-10 glass-card rounded-2xl">
                            <RiSearchLine className="mx-auto text-4xl mb-3 opacity-50" />
                            No stocks found
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Holdings Section */}
                  <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Current Holdings</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400 bg-cyan-100 dark:bg-cyan-900/30 px-3 py-1 rounded-full font-medium">{getHoldings().length} stocks</span>
                    </div>

                    {getHoldings().length === 0 ? (
                      <div className="glass-card rounded-2xl p-12 text-center">
                        <RiAddCircleFill className="mx-auto text-cyan-500 text-5xl mb-4 opacity-60" />
                        <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Holdings Yet</h4>
                        <p className="text-gray-500 dark:text-gray-400">Buy your first stock to start building your portfolio</p>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                              <tr>
                                <th className="text-left p-4 font-semibold">Symbol</th>
                                <th className="text-left p-4 font-semibold">Quantity</th>
                                <th className="text-left p-4 font-semibold">Avg Price</th>
                                <th className="text-left p-4 font-semibold">LTP</th>
                                <th className="text-left p-4 font-semibold">Invested</th>
                                <th className="text-left p-4 font-semibold">Current Value</th>
                                <th className="text-left p-4 font-semibold">P&L</th>
                                <th className="text-left p-4 font-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {getHoldings().map((h, index) => {
                                const invested = (h.qty * h.avgPrice);
                                const current = (h.qty * h.ltp);
                                const pnl = (h.ltp - h.avgPrice) * h.qty;
                                const pnlPct = h.avgPrice > 0 ? ((h.ltp - h.avgPrice) / h.avgPrice) * 100 : 0;
                                const profit = pnl >= 0;

                                return (
                                  <motion.tr key={h.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4"><div className="font-bold text-gray-800 dark:text-white text-lg">{h.symbol}</div></td>
                                    <td className="p-4"><span className="font-semibold text-gray-700 dark:text-gray-300">{formatQuantity(h.qty)}</span></td>
                                    <td className="p-4"><span className="text-gray-600 dark:text-gray-400">{formatCurrency(h.avgPrice)}</span></td>
                                    <td className="p-4"><span className="font-semibold text-cyan-600">{formatCurrency(h.ltp)}</span></td>
                                    <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(invested)}</span></td>
                                    <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(current)}</span></td>
                                    <td className="p-4">
                                      <div className="flex items-center gap-2">
                                        <span className={`font-bold ${profit ? 'text-green-600' : 'text-red-600'}`}>{profit ? '+' : ''}{formatCurrency(Math.abs(pnl), 0)}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${profit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{profit ? <FiArrowUp className="inline" /> : <FiArrowDown className="inline" />}{Math.abs(pnlPct).toFixed(1)}%</span>
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      <div className="flex gap-2">
                                        <input type="number" placeholder="Qty" value={getQty(h.symbol)} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d+$/.test(val)) setQty(h.symbol, val === '' ? '' : parseInt(val).toString()); }} onKeyDown={(e) => { if (['.', 'e', 'E', '-', '+'].includes(e.key)) e.preventDefault(); }} className="w-20 px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-300 outline-none" min="1" step="1" />
                                        <div className="flex gap-1">
                                          <button onClick={() => { const q = parseFloat(getQty(h.symbol)) || 0; if (q <= 0) return toast.error('Enter valid quantity'); const stock = stockData.find((s) => s.Symbol === h.symbol); if (!stock) return; setSelectedStock(stock); setQuantity(q.toString()); setConfirmAction('buy'); setShowConfirmModal(true); }} className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-lg font-medium shadow-sm transition-all">Buy</button>
                                          <button onClick={() => { const q = parseFloat(getQty(h.symbol)) || 0; if (q <= 0) return toast.error('Enter quantity'); if (q > h.qty) return toast.error(`Only ${formatQuantity(h.qty)} available`); const stock = stockData.find((s) => s.Symbol === h.symbol); if (!stock) return; setSelectedStock(stock); setQuantity(q.toString()); setConfirmAction('sell'); setShowConfirmModal(true); }} className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm rounded-lg font-medium shadow-sm transition-all">Sell</button>
                                        </div>
                                      </div>
                                      {getQty(h.symbol) && parseInt(getQty(h.symbol)) > 0 && (<p className="text-xs text-gray-500 mt-1 text-center">{getFormattedTotalInvested(h.symbol, getQty(h.symbol))}</p>)}
                                    </td>
                                  </motion.tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Closed Trades Section */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Closed Trades</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full font-medium">{getClosedTrades().length} trades</span>
                    </div>

                    {getClosedTrades().length === 0 ? (
                      <div className="glass-card rounded-2xl p-12 text-center">
                        <RiCheckboxCircleFill className="mx-auto text-purple-500 text-5xl mb-4 opacity-60" />
                        <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Closed Trades</h4>
                        <p className="text-gray-500 dark:text-gray-400">Your completed trades will appear here</p>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                              <tr>
                                <th className="text-left p-4 font-semibold">Symbol</th>
                                <th className="text-left p-4 font-semibold">Quantity</th>
                                <th className="text-left p-4 font-semibold">Avg Price</th>
                                <th className="text-left p-4 font-semibold">Invested</th>
                                <th className="text-left p-4 font-semibold">Sold Value</th>
                                <th className="text-left p-4 font-semibold">P&L</th>
                                <th className="text-left p-4 font-semibold">Return %</th>
                                <th className="text-left p-4 font-semibold">Closed Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {getClosedTrades().map((trade, index) => {
                                const invested = (trade.qty * trade.avgPrice);
                                const sold = (parseFloat(invested) + trade.pnl);
                                const profit = trade.pnl >= 0;
                                const pnlPct = trade.avgPrice > 0 ? (trade.pnl / (trade.qty * trade.avgPrice)) * 100 : 0;

                                return (
                                  <motion.tr key={`${trade.symbol}-${trade.sellDate}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4"><div className="font-bold text-gray-800 dark:text-white">{trade.symbol}</div></td>
                                    <td className="p-4"><span className="font-semibold text-gray-700 dark:text-gray-300">{formatQuantity(trade.qty)}</span></td>
                                    <td className="p-4"><span className="text-gray-600 dark:text-gray-400">{formatCurrency(trade.avgPrice)}</span></td>
                                    <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(invested)}</span></td>
                                    <td className="p-4"><span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(sold)}</span></td>
                                    <td className="p-4"><div className="flex items-center gap-2"><span className={`font-bold ${profit ? 'text-green-600' : 'text-red-600'}`}>{profit ? '+' : ''}{formatCurrency(Math.abs(trade.pnl), 0)}</span></div></td>
                                    <td className="p-4"><span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${profit ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>{profit ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}{Math.abs(pnlPct).toFixed(1)}%</span></td>
                                    <td className="p-4"><span className="text-sm text-gray-500 dark:text-gray-400">{trade.sellDate}</span></td>
                                  </motion.tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Transactions Tab */
                <div>
                  <div className="flex justify-end mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">To perform a detailed analysis, download your transaction data and upload it on the <Link to="/portfolio" className="font-medium text-cyan-600 hover:underline">Upload File</Link> page.</p>
                  </div>

                  <div className="flex justify-end mb-4">
                    <button onClick={downloadCSV} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition shadow-lg hover:shadow-xl flex items-center gap-2"><AiOutlineDownload /> Download CSV</button>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Transaction History</h3>
                    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                      {[
                        { k: 'all', l: 'All' },
                        { k: '3d', l: '3D' },
                        { k: '1w', l: '1W' },
                        { k: '2w', l: '2W' },
                        { k: '1m', l: '1M' },
                        { k: '3m', l: '3M' },
                        { k: '1y', l: '1Y' },
                      ].map(({ k, l }) => (
                        <button key={k} onClick={() => setBrokerageFilter(k)} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${brokerageFilter === k ? 'bg-white dark:bg-gray-900 text-cyan-600 shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-cyan-600'}`}>{l}</button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                          <tr>
                            {[
                              'Symbol',
                              'Date & Time',
                              'Qty',
                              'Price',
                              'Value',
                              'Brokerage',
                              'Frame',
                              'Exchange',
                              'Type',
                            ].map((h) => (
                              <th key={h} className="p-4 font-semibold text-left tracking-wide text-xs uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {getFilteredTransactions().length === 0 ? (
                            <tr>
                              <td colSpan={10} className="text-center py-12 text-gray-500 dark:text-gray-400">No transactions in selected period</td>
                            </tr>
                          ) : (
                            getFilteredTransactions().map((t, i) => (
                              <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium">{t.Symbol}</td>
                                <td className="p-4 font-mono text-xs">{t.DateTime}</td>
                                <td className="p-4">{formatQuantity(t.Qty)}</td>
                                <td className="p-4">{formatCurrency(t.Price)}</td>
                                <td className="p-4">{formatCurrency(t.MarketValue)}</td>
                                <td className="p-4">{formatCurrency(t.BrokerageAmount)}</td>
                                <td className="p-4 font-medium">{t.frame}</td>
                                <td className="p-4">{exchange}</td>
                                <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${t.OrderType === 'B' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.OrderType === 'B' ? 'BUY' : 'SELL'}</span></td>
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showCreateModal && (
            <ModalBackdrop onClick={() => setShowCreateModal(false)}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card rounded-2xl p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4 text-center">Create New Portfolio</h3>
                <input type="text" placeholder="Portfolio Name" value={newPortfolioName} onChange={(e) => setNewPortfolioName(e.target.value)} className="w-full mb-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none" />
                <input type="number" placeholder="Initial Corpus (₹)" value={newCorpus} onChange={(e) => setNewCorpus(e.target.value)} className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base focus:ring-2 focus:ring-cyan-300 outline-none" />
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createPortfolio}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-sm"
                  >
                    Create
                  </motion.button>
                </div>
              </motion.div>
            </ModalBackdrop>
          )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <ModalBackdrop onClick={() => setShowConfirmModal(false)}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card rounded-2xl p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <RiCheckboxCircleFill
                    className={`mx-auto text-4xl mb-4 ${confirmAction === 'buy' ? 'text-green-500' : 'text-red-500'
                      }`}
                  />
                  <h3 className="text-xl font-bold mb-2">
                    Confirm {confirmAction === 'buy' ? 'Buy' : 'Sell'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {confirmAction === 'buy' ? 'Buy' : 'Sell'} {quantity} shares of {selectedStock?.Symbol}
                    at {formatCurrency(selectedStock?.Close)}?
                  </p>
                  <p className="font-semibold mt-2">
                    Total: {getFormattedTotalInvested(selectedStock?.Symbol, quantity)}
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmTrade}
                    className={`flex-1 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all ${confirmAction === 'buy'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                      }`}
                  >
                    Confirm {confirmAction === 'buy' ? 'Buy' : 'Sell'}
                  </motion.button>
                </div>
              </motion.div>
            </ModalBackdrop>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* Reusable Modal Backdrop */
const ModalBackdrop = ({ children, onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
    onClick={onClick}
  >
    <div
      className="w-full max-w-md mx-auto rounded-2xl p-6 max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl text-gray-800 dark:text-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </motion.div>
);

// Add the missing icon component
const RiMoneyDollarCircleLine = ({ className }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"></path>
  </svg>
);
