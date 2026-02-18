// -------------------wc -code-------------------------------------
// File: Frontend_Test/src/components/DashBoard/DashBoard.jsx
// -------------------------------------------------------------------
// Description: This file contains the main dashboard component for a web application. It includes features such as drag-and-drop functionality, tab management, and saving/loading dashboards. The component uses various libraries like React, DndKit, Framer Motion, and React Router for its implementation.
// -------------------------------------------------------------------

// import React, { useEffect, useState, useRef } from 'react';
// import Navbar from '../Navbar';
// import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
// import { MdOutlineDashboardCustomize, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
// import { BiSolidSave } from 'react-icons/bi';
// import { IoMdClose, IoMdSave } from 'react-icons/io';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Modal from 'react-modal';
// import SidebarRight from './SidebarRight';
// import AddNewModal from './AddNewModal';
// import DragStartModal from './DragStartModal';
// import DroppableArea from './DroppableArea';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { GoSidebarExpand } from 'react-icons/go';
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';
// import PortfolioSelectModal from './PortfolioSelectModal';
// import { Search } from 'lucide-react';
// import SearchList from '../EquityHub/SearchList';
// import { useAuth } from '../AuthContext';
// import { CiLogout } from 'react-icons/ci';
// import { logActivity } from '../../services/api';
// import { IoMdArrowDropdown } from 'react-icons/io';
// import axios from 'axios';
// import {
//     Panel,
//     PanelGroup,
//     PanelResizeHandle,
// } from 'react-resizable-panels';
// import { FaChartLine, FaBriefcase, FaInfoCircle, FaRocket } from 'react-icons/fa';

// Modal.setAppElement('#root');

// const DashBoard = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const [showModal, setShowModal] = useState(false);
//     const [tabs, setTabs] = useState(['Dashboard 1']);
//     const [activeTab, setActiveTab] = useState('Dashboard 1');
//     const [uploadId, setUploadId] = useState(null);
//     const [platform, setPlatform] = useState('');
//     const [symbol, setSymbol] = useState(null);
//     const [savedStocks, setSavedStocks] = useState([]);
//     const [savedPortfolios, setSavedPortfolios] = useState([]);
//     const [droppedMap, setDroppedMap] = useState({ 'Dashboard 1': { general: [] } });
//     const [savedDroppedMap, setSavedDroppedMap] = useState({});
//     const [editingTab, setEditingTab] = useState(null);
//     const [editedTabName, setEditedTabName] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchedStocks, setSearchedStocks] = useState([]);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [showDragModal, setShowDragModal] = useState(false);
//     const [showPortfolioModal, setShowPortfolioModal] = useState(false);
//     const [collapsed, setCollapsed] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [dragCountMap, setDragCountMap] = useState({ 'Dashboard 1': {} });
//     const [currentDragItem, setCurrentDragItem] = useState(null);
//     const [error, setError] = useState(null);
//     const [showUnsavedModal, setShowUnsavedModal] = useState(false);
//     const [showSavedModal, setShowSavedModal] = useState(false);
//     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//     const [pendingNavigation, setPendingNavigation] = useState(null);
//     const [pendingTab, setPendingTab] = useState(null);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const queryParams = new URLSearchParams(location.search);
//     const [sticky, setSticky] = useState(false);
//     const [userType, setUserType] = useState(null);
//     const [fullName, setFullName] = useState('');
//     const initialQuery = queryParams.get('query') || '';
//     const [isDisabled, setIsDisabled] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [results, setResults] = useState([]);
//     const { login, logout } = useAuth();
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
//     const drawerRef = useRef(null);
//     const [resizing, setResizing] = useState(false);

//     const ResizeHandle = ({ direction = "horizontal" }) => (
//         <div className={`
//       relative group transition-all duration-200
//       ${direction === "horizontal" ? "w-2 h-full mx-1" : "h-2 w-full my-1"}
//     `}>
//             <div className={`
//         absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10
//         rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
//         ${resizing ? 'opacity-100 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20' : ''}
//       `} />
//             <div className={`
//         absolute inset-0 flex items-center justify-center
//         ${direction === "horizontal" ? "flex-col" : "flex-row"}
//       `}>
//                 <div className={`
//           bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full
//           transition-all duration-200 group-hover:scale-110
//           ${direction === "horizontal" ? "w-1 h-8" : "h-1 w-8"}
//           ${resizing ? 'scale-110 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary-dark)]' : ''}
//         `} />
//             </div>
//         </div>
//     );

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (!event.target.closest("#portfolio-dropdown")) {
//                 setIsPortfolioOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     useEffect(() => {
//         const handleScroll = () => setSticky(window.scrollY > 0);
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     // Track unsaved changes
//     useEffect(() => {
//         const currentTab = droppedMap[activeTab] || { general: [] };
//         const savedTab = savedDroppedMap[activeTab] || { general: [] };
//         const hasChanges = JSON.stringify(currentTab.general) !== JSON.stringify(savedTab.general);
//         setHasUnsavedChanges(hasChanges);
//     }, [droppedMap, activeTab, savedDroppedMap]);

//     useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         if (token) setIsLoggedIn(true);
//     }, []);

//     useEffect(() => {
//         const storedUploadId = localStorage.getItem('uploadId');
//         const storedPlatform = localStorage.getItem('platform');
//         if (storedUploadId && storedPlatform) {
//             setUploadId(storedUploadId);
//             setPlatform(storedPlatform);
//         }
//     }, []);

//     const fetchSavedPortfolio = async () => {
//         try {
//             setError('');
//             const token = localStorage.getItem('authToken');
//             if (!token) {
//                 setError('Please login to view your portfolios');
//                 return;
//             }
//             const response = await fetch(`${API_BASE}/file/saved`, {
//                 method: 'GET',
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) {
//                 const err = await response.json();
//                 setError(err.error || 'Failed to fetch saved portfolios');
//                 return;
//             }
//             const data = await response.json();
//             if (data.length > 0) {
//                 setSavedPortfolios(data);
//                 setUploadId(data[0].uploadId);
//                 setPlatform(data[0].platform);
//             } else {
//                 setSavedPortfolios([]);
//                 setError('No portfolios found');
//             }
//         } catch (err) {
//             console.error('Error fetching saved portfolios:', err);
//             setError('Network error. Please try again later.');
//         }
//     };

//     useEffect(() => {
//         fetchSavedPortfolio();
//     }, [API_BASE]);

//     const handleStockSearch = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${API_BASE}/stocks/test/search?query=${searchTerm}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const data = await response.json();
//             if (Array.isArray(data) && data.length > 0) {
//                 setSearchedStocks(data);
//                 setSavedStocks(data);
//             } else {
//                 setSearchedStocks([]);
//                 toast.info('No stocks found for the search term.');
//                 setError('Company not found');
//             }
//         } catch (err) {
//             console.error('Error fetching stock suggestions:', err);
//             setSearchedStocks([]);
//             setError('Company not found in our list. Please check the name and search again.');
//         }
//     };

//     const handleRenameTab = (oldName, newName) => {
//         if (!newName || newName.trim() === '') return;
//         if (tabs.includes(newName)) {
//             toast.info('A dashboard with this name already exists.');
//             return;
//         }
//         setTabs((prevTabs) => prevTabs.map((tab) => (tab === oldName ? newName : tab)));
//         setDroppedMap((prev) => {
//             const updated = { ...prev };
//             updated[newName] = prev[oldName];
//             delete updated[oldName];
//             return updated;
//         });
//         setSavedDroppedMap((prev) => {
//             const updated = { ...prev };
//             updated[newName] = prev[oldName];
//             delete updated[oldName];
//             return updated;
//         });
//         setDragCountMap((prev) => {
//             const updated = { ...prev };
//             updated[newName] = prev[oldName];
//             delete updated[oldName];
//             return updated;
//         });
//         if (activeTab === oldName) setActiveTab(newName);
//         setEditingTab(null);
//         setEditedTabName('');
//     };

//     const handleDeleteComponent = (index) => {
//         setDroppedMap((prev) => {
//             const updated = { ...prev };
//             updated[activeTab] = {
//                 ...prev[activeTab],
//                 general: prev[activeTab].general.filter((_, idx) => idx !== index),
//             };
//             return updated;
//         });
//         const label = droppedMap[activeTab].general[index].label;
//         const remaining = droppedMap[activeTab].general.filter((item, idx) => idx !== index && item.label === label);
//         if (remaining.length === 0) {
//             setDragCountMap((prev) => ({
//                 ...prev,
//                 [activeTab]: { ...prev[activeTab], [label]: 0 },
//             }));
//         }
//     };

//     const handleClearCompany = (companyName) => {
//         setDroppedMap((prev) => ({
//             ...prev,
//             [activeTab]: {
//                 ...prev[activeTab],
//                 general: prev[activeTab].general.filter((item) => item.companyName !== companyName),
//             },
//         }));
//         const affectedLabels = droppedMap[activeTab].general
//             .filter((item) => item.companyName === companyName)
//             .map((item) => item.label);
//         setDragCountMap((prev) => {
//             const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//             affectedLabels.forEach((label) => {
//                 const remaining = droppedMap[activeTab].general.filter(
//                     (item) => item.label === label && item.companyName !== companyName
//                 );
//                 updated[activeTab][label] = remaining.length > 0 ? prev[activeTab][label] || 1 : 0;
//             });
//             return updated;
//         });
//         toast.success(`Company ${companyName} and associated graphs removed`);
//     };

//     const generateDefaultDashboardName = async (baseName = 'Dashboard') => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Failed to fetch dashboards');
//             const data = await response.json();
//             const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//             let index = 1;
//             let defaultName;
//             do {
//                 defaultName = `${baseName} ${index}`;
//                 index++;
//             } while (existingNames.includes(defaultName) || tabs.includes(defaultName));
//             return defaultName;
//         } catch (err) {
//             console.error('Error fetching dashboards for name generation:', err);
//             let index = 1;
//             let defaultName;
//             do {
//                 defaultName = `${baseName} ${index}`;
//                 index++;
//             } while (tabs.includes(defaultName));
//             return defaultName;
//         }
//     };

//     const handleNewDashboard = async (title) => {
//         const newTitle = title && title.trim() ? title : await generateDefaultDashboardName();
//         if (tabs.includes(newTitle)) {
//             toast.info('A dashboard with this name already exists.');
//             return;
//         }
//         setTabs((prev) => [...prev, newTitle]);
//         setDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//         setSavedDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//         setActiveTab(newTitle);
//         setShowModal(false);
//         setDragCountMap((prev) => ({ ...prev, [newTitle]: {} }));
//         setIsMenuOpen(false);
//         setHasUnsavedChanges(false);
//     };

//     const handleDragStart = (event) => {
//         const { active } = event;
//         const label = active?.data?.current?.label;
//         setCurrentDragItem(active?.data?.current);
//         const equityLabels = Object.keys(equityHubMap);
//         const portfolioLabels = Object.keys(portfolioMap);
//         if (equityLabels.includes(label)) {
//             const currentDragCount = dragCountMap[activeTab]?.[label] || 0;
//             if (currentDragCount === 0 && !droppedMap[activeTab].general.some((item) => item.label === label)) {
//                 setShowDragModal(true);
//             } else if (currentDragCount >= 1) {
//                 setShowDragModal(true);
//             }
//         } else if (portfolioLabels.includes(label)) {
//             setShowPortfolioModal(true);
//         }
//     };

//     const handleItemClick = (item) => {
//         const { id, label } = item;
//         const equityLabels = Object.keys(equityHubMap);
//         const portfolioLabels = Object.keys(portfolioMap);

//         let section = null;
//         if (equityLabels.includes(label)) section = 'equity';
//         if (portfolioLabels.includes(label)) section = 'portfolio';

//         if (section === 'equity') {
//             setCurrentDragItem({ label });
//             setShowDragModal(true);
//             return;
//         }

//         if (section === 'portfolio') {
//             setCurrentDragItem({ label });
//             setShowPortfolioModal(true);
//             return;
//         }
//     };

//     const handleDragEnd = (event) => {
//         const { over, active } = event;
//         const label = active?.data?.current?.label;
//         const id = active?.id;
//         if (!over || !label || !id) return;

//         if (over.id !== 'general') {
//             toast.error(`"${label}" can only be dropped in the whiteboard area.`);
//             return;
//         }

//         const equityLabels = Object.keys(equityHubMap);
//         const portfolioLabels = Object.keys(portfolioMap);

//         if (equityLabels.includes(label)) {
//             setCurrentDragItem(active?.data?.current);
//             setShowDragModal(true);
//             return;
//         }

//         if (portfolioLabels.includes(label)) {
//             setCurrentDragItem(active?.data?.current);
//             setShowPortfolioModal(true);
//             return;
//         }
//     };

//     const handlePortfolioSelect = (portfolio) => {
//         if (currentDragItem) {
//             const draggedItem = {
//                 label: currentDragItem.label,
//                 symbol: '',
//                 companyName: '',
//                 graphType: currentDragItem.label,
//                 uploadId: portfolio.uploadId,
//                 platform: portfolio.platform,
//                 id: `${currentDragItem.label}-${Date.now()}`,
//                 type: 'portfolio',
//             };

//             setDroppedMap((prev) => {
//                 const currentTab = prev[activeTab] || { general: [] };
//                 const currentSection = currentTab['general'] || [];
//                 return {
//                     ...prev,
//                     [activeTab]: { ...currentTab, general: [...currentSection, draggedItem] },
//                 };
//             });
//             setUploadId(portfolio.uploadId);
//             setPlatform(portfolio.platform);
//             localStorage.setItem('uploadId', portfolio.uploadId.toString());
//             localStorage.setItem('platform', portfolio.platform);
//             setShowPortfolioModal(false);
//             setCurrentDragItem(null);
//             setHasUnsavedChanges(true);
//         }
//     };

//     const getGridClass = (items) => {
//         if (items.length === 0) return 'grid-cols-1';
//         const firstRowCount = Math.min(items.length, 2);
//         const remainingCount = items.length - firstRowCount;
//         return `grid grid-cols-1 sm:grid-cols-${firstRowCount} gap-4 ${remainingCount > 0 ? 'sm:grid-rows-2' : ''}`;
//     };

//     const getVisibleItems = (items) => items;

//     //   useEffect(() => {
//     //     const fetchSavedStocks = async () => {
//     //       try {
//     //         const token = localStorage.getItem('authToken');
//     //         const response = await fetch(`${API_BASE}/stocks/saved`, {
//     //           headers: { Authorization: `Bearer ${token}` },
//     //         });
//     //         const data = await response.json();
//     //         if (Array.isArray(data)) {
//     //           const symbols = data.map((stock) => stock.symbol);
//     //           setSymbol(symbols);
//     //         }
//     //       } catch (err) {
//     //         console.error('Failed to fetch saved stocks:', err);
//     //       }
//     //     };
//     //     fetchSavedStocks();
//     //   }, [API_BASE]);

//     const handleSaveDashboard = async () => {
//         const token = localStorage.getItem('authToken');
//         const userId = localStorage.getItem('userId');
//         const userType = localStorage.getItem('userType');
//         const generalPlots = droppedMap?.[activeTab]?.general || [];

//         if (!token) {
//             toast.error('Please login first to save your dashboard.');
//             return;
//         }

//         if (generalPlots.length === 0) {
//             toast.error('Please drag and drop at least one plot before saving.');
//             return;
//         }

//         let finalDashboardName = activeTab;

//         try {
//             const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Failed to fetch dashboards');
//             const data = await response.json();
//             const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//             if (existingNames.includes(finalDashboardName)) {
//                 finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//                 setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//                 setDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setSavedDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = { general: generalPlots };
//                     if (activeTab !== finalDashboardName) delete updated[activeTab];
//                     return updated;
//                 });
//                 setDragCountMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setActiveTab(finalDashboardName);
//                 toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//             }
//         } catch (err) {
//             console.error('Error checking dashboard names:', err);
//             if (tabs.includes(finalDashboardName)) {
//                 finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//                 setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//                 setDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setSavedDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = { general: generalPlots };
//                     if (activeTab !== finalDashboardName) delete updated[activeTab];
//                     return updated;
//                 });
//                 setDragCountMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setActiveTab(finalDashboardName);
//                 toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//             }
//         }

//         const savedData = {
//             dashboard: { dashboardName: finalDashboardName, userId: userId ? parseInt(userId) : 0, userType: userType || '' },
//             equityHubPlots: [],
//             portfolioPlots: [],
//         };

//         generalPlots.forEach(({ label, symbol, companyName, graphType, uploadId, platform, type }) => {
//             if (type === 'equity') {
//                 let finalSymbol = symbol;
//                 let finalCompany = companyName;

//                 if (!finalSymbol || !finalCompany) {
//                     const matched = savedStocks.find(
//                         (stock) => stock.symbol === finalSymbol || stock.graphType === graphType || stock.label === label
//                     );
//                     if (matched) {
//                         finalSymbol = finalSymbol || matched.symbol;
//                         finalCompany = finalCompany || matched.companyName;
//                     }
//                 }

//                 savedData.equityHubPlots.push({ symbol: finalSymbol, companyName: finalCompany, graphType: graphType || label });
//             } else if (type === 'portfolio') {
//                 savedData.portfolioPlots.push({ uploadId, platform, graphType: label });
//             }
//         });

//         try {
//             const response = await fetch(`${API_BASE}/dashboard/save`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//                 body: JSON.stringify(savedData),
//             });
//             if (response.ok) {
//                 const result = await response.json();
//                 setSavedDroppedMap((prev) => ({
//                     ...prev,
//                     [finalDashboardName]: { general: generalPlots },
//                 }));
//                 setHasUnsavedChanges(false);
//                 setShowSavedModal(true);
//                 setTimeout(() => setShowSavedModal(false), 2000);
//             } else {
//                 toast.error('Failed to save dashboard');
//             }
//         } catch (err) {
//             console.error('Save failed:', err);
//             toast.error('Save failed');
//         }
//         setIsMenuOpen(false);
//     };

//     const handleDeleteDashboardAPI = async (dashboardName) => {
//         if (hasUnsavedChanges) {
//             setPendingTab(dashboardName);
//             setShowUnsavedModal(true);
//             return;
//         }
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${API_BASE}/dashboard/delete/${dashboardName}`, {
//                 method: 'DELETE',
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Failed to delete dashboard');
//             setTabs((prev) => prev.filter((tab) => tab !== dashboardName));
//             setDroppedMap((prev) => {
//                 const updated = { ...prev };
//                 delete updated[dashboardName];
//                 return updated;
//             });
//             setSavedDroppedMap((prev) => {
//                 const updated = { ...prev };
//                 delete updated[dashboardName];
//                 return updated;
//             });
//             setDragCountMap((prev) => {
//                 const updated = { ...prev };
//                 delete updated[dashboardName];
//                 return updated;
//             });
//             if (activeTab === dashboardName) {
//                 const remainingTabs = tabs.filter((tab) => tab !== dashboardName);
//                 setActiveTab(remainingTabs[0] || '');
//             }
//             toast.success('Dashboard deleted successfully');
//             setIsMenuOpen(false);
//         } catch (err) {
//             console.error('Delete error:', err);
//             toast.error('Failed to delete dashboard');
//         }
//     };

//     const getUniqueCompanies = () => {
//         const generalItems = droppedMap[activeTab]?.general || [];
//         return [...new Set(generalItems.filter(item => item.companyName).map((item) => item.companyName))];
//     };

//     const isDashboardEmpty = () => {
//         const currentTab = droppedMap[activeTab] || { general: [] };
//         return currentTab.general.length === 0;
//     };

//     const getCachedData = (key) => {
//         const cached = localStorage.getItem(key);
//         if (!cached) return null;
//         try {
//             const { data, timestamp } = JSON.parse(cached);
//             if (Date.now() - timestamp > 3600000) { // 1 hour TTL
//                 localStorage.removeItem(key);
//                 return null;
//             }
//             return data;
//         } catch (err) {
//             setError("Failed to parse cached data.");
//             console.error("Cache parse error:", err);
//             return null;
//         }
//     };

//     const setCachedData = (key, data) => {
//         try {
//             localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//         } catch (err) {
//             setError("Failed to cache data.");
//             console.error("Cache set error:", err);
//         }
//     };

//     const handleClearSearch = () => {
//         setSearchQuery('');
//         setResults([]);
//         setError(null);
//     };

//     const handleLoginClick = () => setShowLoginModal(true);
//     const handleCloseModal = () => setShowLoginModal(false);
//     const handleLoginSuccess = () => {
//         login();
//         handleCloseModal();
//     };

//     const handleLogout = () => {
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label: 'logout', path: '/' });
//             setShowUnsavedModal(true);
//             setShowSavedModal(false); // Ensure saved modal is hidden
//             return;
//         }
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success("Logout successfully!");
//         navigate('/');
//     };

//     const handleDeleteAccount = async () => {
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label: 'deleteAccount', path: '/' });
//             setShowUnsavedModal(true);
//             setShowSavedModal(false); // Ensure saved modal is hidden
//             return;
//         }
//         const apiUrl =
//             userType === "corporate"
//                 ? `${API_BASE}/corporate/delete-account`
//                 : `${API_BASE}/Userprofile/delete-account`;

//         try {
//             await axios.delete(apiUrl, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//                     "Content-Type": "application/json",
//                 },
//             });
//             toast.success("Account deleted successfully");
//             localStorage.removeItem("authToken");
//             localStorage.removeItem("userType");
//             localStorage.removeItem("hasShownQuizPopup");
//             logout();
//             navigate("/");
//             setShowDeleteModal(false);
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to delete account");
//         }
//     };

//     const handleNavClick = async (label, path, state = {}) => {
//         setShowSavedModal(false); // Reset saved modal
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label, path, state });
//             setShowUnsavedModal(true);
//         } else {
//             await logActivity(`${label} tab clicked`);
//             navigate(path, { state });
//         }
//     };

//     const handleTabSwitch = (tab) => {
//         setShowSavedModal(false); // Reset saved modal
//         if (hasUnsavedChanges && activeTab !== tab) {
//             setPendingTab(tab);
//             setShowUnsavedModal(true);
//         } else {
//             setActiveTab(tab);
//             setIsMenuOpen(false);
//         }
//     };

//     const handleConfirmNavigation = async () => {
//         setShowUnsavedModal(false);
//         setShowSavedModal(false); // Ensure saved modal is hidden
//         if (pendingNavigation) {
//             if (pendingNavigation.label === 'logout') {
//                 localStorage.removeItem('authToken');
//                 localStorage.removeItem('userType');
//                 localStorage.removeItem('userEmail');
//                 logout();
//                 toast.success("Logout successfully!");
//                 navigate('/');
//             } else if (pendingNavigation.label === 'deleteAccount') {
//                 await handleDeleteAccount();
//             } else if (pendingNavigation.label === 'addDashboard') {
//                 setShowModal(true);
//                 setIsMenuOpen(false);
//             } else {
//                 await logActivity(`${pendingNavigation.label} tab clicked`);
//                 navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//             }
//             setPendingNavigation(null);
//         } else if (pendingTab) {
//             setActiveTab(pendingTab);
//             setPendingTab(null);
//             setIsMenuOpen(false);
//         }
//     };

//     const handleCancelNavigation = () => {
//         setShowUnsavedModal(false);
//         setShowSavedModal(false); // Ensure saved modal is hidden
//         setPendingNavigation(null);
//         setPendingTab(null);
//     };

//     const handleSaveAndNavigate = async () => {
//         setShowUnsavedModal(false);
//         setShowSavedModal(false); // Explicitly prevent saved modal during navigation
//         await handleSaveDashboard();
//         setShowSavedModal(false); // Ensure it stays hidden after save
//         if (pendingNavigation) {
//             if (pendingNavigation.label === 'logout') {
//                 localStorage.removeItem('authToken');
//                 localStorage.removeItem('userType');
//                 localStorage.removeItem('userEmail');
//                 logout();
//                 toast.success("Logout successfully!");
//                 navigate('/');
//             } else if (pendingNavigation.label === 'deleteAccount') {
//                 await handleDeleteAccount();
//             } else if (pendingNavigation.label === 'addDashboard') {
//                 setShowModal(true);
//                 setIsMenuOpen(false);
//             } else {
//                 await logActivity(`${pendingNavigation.label} tab clicked`);
//                 navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//             }
//             setPendingNavigation(null);
//         } else if (pendingTab) {
//             setActiveTab(pendingTab);
//             setPendingTab(null);
//             setIsMenuOpen(false);
//         }
//     };

//     const sensors = useSensors(
//         useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
//         useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
//     );



//     const handleTopCompanyClick = async () => {
//         try {
//             const apiUrl = `${API_BASE}/market/top-company`;
//             const response = await fetch(apiUrl, {
//                 method: 'GET',
//             });

//             if (!response.ok) {
//                 const err = await response.json();
//                 throw new Error(err.error || 'Failed to fetch top company');
//             }
//             const topCompany = await response.json();

//             // Validate top company data
//             if (!topCompany || !topCompany.Symbol || !topCompany.CompanyName) {
//                 toast.error('No top company data available.');
//                 return;
//             }

//             const plotsToAdd = [
//                 { label: 'MacdPlot', graphType: 'MacdPlot' },
//                 { label: 'SensexCalculator', graphType: 'SensexCalculator' },
//                 { label: 'CandlePatternPlot', graphType: 'CandlePatternPlot' },
//             ];

//             setDroppedMap((prev) => {
//                 const currentTab = prev[activeTab] || { general: [] };
//                 const currentSection = currentTab.general || [];
//                 const newItems = plotsToAdd.map((plot) => ({
//                     label: plot.label,
//                     symbol: topCompany.Symbol, // Updated to match API field
//                     companyName: topCompany.CompanyName, // Updated to match API field
//                     graphType: plot.graphType,
//                     id: `${plot.label}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                     type: 'equity',
//                 }));
//                 return {
//                     ...prev,
//                     [activeTab]: { ...currentTab, general: [...currentSection, ...newItems] },
//                 };
//             });

//             setDragCountMap((prev) => {
//                 const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//                 plotsToAdd.forEach((plot) => {
//                     updated[activeTab][plot.label] = (updated[activeTab][plot.label] || 0) + 1;
//                 });
//                 return updated;
//             });

//             setHasUnsavedChanges(true);
//             toast.success(`Sample Dashboard is added by showing the  for ${topCompany.CompanyName}`);
//         } catch (err) {
//             setError('Failed to fetch top company plots.');
//             toast.error('Failed to fetch top company plots.');
//         }
//     };
//     return (
//         <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background-dark)] flex flex-col transition-colors duration-300">
//             <style jsx>{`
//         :root {
//           --primary: #2563eb;
//           --primary-dark: #1e40af;
//           --secondary: #7c3aed;
//           --secondary-dark: #5b21b6;
//           --background: #f8fafc;
//           --background-dark: #0f172a;
//           --text: #1e293b;
//           --text-dark: #e2e8f0;
//           --border: #e5e7eb;
//           --border-dark: #374151;
//         }

//         html, body {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           line-height: 1.5;
//           color: var(--text);
//         }

//         .dark {
//           color: var(--text-dark);
//           background-color: var(--background-dark);
//         }

//         .scrollbar-thin {
//           scrollbar-width: thin;
//           scrollbar-color: var(--primary) var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar {
//           width: 8px;
//         }

//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary);
//           border-radius: 4px;
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border-dark);
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary-dark);
//         }

//         .tooltip {
//           position: relative;
//           display: inline-block;
//         }

//         .tooltip .tooltip-text {
//           visibility: hidden;
//           width: 200px;
//           background-color: #1e293b;
//           color: #fff;
//           text-align: center;
//           border-radius: 6px;
//           padding: 8px;
//           position: absolute;
//           z-index: 1000;
//           bottom: 125%;
//           left: 50%;
//           transform: translateX(-50%);
//           opacity: 0;
//           transition: opacity 0.3s;
//           font-size: 12px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .tooltip:hover .tooltip-text {
//           visibility: visible;
//           opacity: 1;
//         }

//         .dark .tooltip .tooltip-text {
//           background-color: #e2e8f0;
//           color: #1e293b;
//         }
//       `}</style>

//             <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[var(--background-dark)] shadow-sm">
//                 <Navbar
//                     handleNavClick={handleNavClick}
//                     hasUnsavedChanges={hasUnsavedChanges}
//                     setPendingNavigation={setPendingNavigation}
//                     setShowUnsavedModal={setShowUnsavedModal}
//                 />
//             </div>

//             <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//                 <div className="flex flex-1 mt-16">
//                     <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] z-40">
//                         <SidebarRight collapsed={collapsed} setCollapsed={setCollapsed} onItemClick={handleItemClick} />
//                     </div>

//                     {showModal && (
//                         <AddNewModal onClose={() => setShowModal(false)} onCreateTab={handleNewDashboard} />
//                     )}

//                     <div className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'pr-14' : 'pr-80'} overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin`}>
//                         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                             <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg rounded-xl p-2 dark:border-[var(--border-dark)] shadow-sm">
//                                 {tabs.map((tab) => (
//                                     <div key={tab} className="flex items-center bg-[var(--background)] dark:bg-[var(--background-dark)] px-3 py-1.5 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm">
//                                         {editingTab === tab ? (
//                                             <div className="flex items-center gap-2">
//                                                 <input
//                                                     type="text"
//                                                     value={editedTabName}
//                                                     onChange={(e) => setEditedTabName(e.target.value)}
//                                                     onKeyDown={(e) => e.key === 'Enter' && handleRenameTab(tab, editedTabName)}
//                                                     className="w-32 px-2 py-1 bg-white dark:bg-[var(--background-dark)] border border-[var(--border)] dark:border-[var(--border-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
//                                                     autoFocus
//                                                 />
//                                                 <button
//                                                     onClick={() => handleRenameTab(tab, editedTabName)}
//                                                     className="p-1 text-green-600 hover:text-green-700 transition-colors"
//                                                     title="Save"
//                                                 >
//                                                     <IoMdSave size={16} />
//                                                 </button>
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-center gap-2">
//                                                 <button
//                                                     onClick={() => handleTabSwitch(tab)}
//                                                     className={`text-sm font-medium transition-all duration-200 ${activeTab === tab
//                                                         ? 'text-[var(--primary)]'
//                                                         : 'text-[var(--text)] dark:text-[var(--text-dark)] hover:text-[var(--primary)]'
//                                                         }`}
//                                                 >
//                                                     {tab}
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setEditingTab(tab);
//                                                         setEditedTabName(tab);
//                                                     }}
//                                                     className="p-1 text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors"
//                                                     title="Rename"
//                                                 >
//                                                     <MdOutlineDriveFileRenameOutline size={16} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDeleteDashboardAPI(tab)}
//                                                     className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors"
//                                                     title="Delete"
//                                                 >
//                                                     <IoMdClose size={16} />
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}

//                                 <div className="flex items-center gap-3">
//                                     <button
//                                         onClick={() => {
//                                             setShowSavedModal(false); // Clear saved modal
//                                             if (hasUnsavedChanges) {
//                                                 setPendingNavigation({ label: 'addDashboard', path: null });
//                                                 setShowUnsavedModal(true);
//                                                 return;
//                                             }
//                                             setShowModal(true);
//                                             setIsMenuOpen(false);
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                                         data-tour="dashboard-add"
//                                     >
//                                         <MdOutlineDashboardCustomize size={18} /> Add Dashboard
//                                     </button>

//                                     <button
//                                         onClick={handleSaveDashboard}
//                                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                                         data-tour="dashboard-save"
//                                     >
//                                         <BiSolidSave size={18} /> Save
//                                     </button>

//                                     <div className="relative inline-block">
//                                         <button
//                                             onClick={handleTopCompanyClick}
//                                             className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-semibold"
//                                             data-tour="top-company"
//                                         >
//                                             <FaRocket size={18} /> Market Leader

//                                             {/* Info Icon fixed at bottom-right inside button */}
//                                             <div className="absolute bottom-0 right-0 group">
//                                                 <FaInfoCircle size={14} className="text-white/80 cursor-pointer" />

//                                                 {/* Tooltip shows only on hover of the icon */}
//                                                 <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                     Adds MACD, Sensex Calculator, and Candlestick plots.
//                                                 </span>
//                                             </div>
//                                         </button>
//                                     </div>



//                                     <button
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             setShowSavedModal(false); // Clear saved modal
//                                             if (!isLoggedIn) {
//                                                 toast.error('Login first to see your dashboards.');
//                                                 return;
//                                             }
//                                             handleNavClick('Saved Dashboards', '/savedDashboard');
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                                         data-tour="dashboard-saved"
//                                     >
//                                         <BiSolidSave size={18} /> Saved Dashboards
//                                     </button>
//                                 </div>
//                             </div>

//                             {getUniqueCompanies().length > 0 ? (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="flex flex-wrap gap-3 items-center mb-6 bg-white/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg rounded-xl p-4 border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                                 >
//                                     <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] bg-[var(--border)] dark:bg-[var(--border-dark)] px-3 py-1 rounded-full">
//                                         Selected Stocks:
//                                     </span>
//                                     {getUniqueCompanies().map((companyName) => (
//                                         <motion.div
//                                             key={companyName}
//                                             initial={{ scale: 0.8, opacity: 0 }}
//                                             animate={{ scale: 1, opacity: 1 }}
//                                             className="flex items-center gap-2 px-3 py-1.5 bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                                         >
//                                             <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate max-w-[120px]">
//                                                 {companyName}
//                                             </span>
//                                             <button
//                                                 onClick={() => handleClearCompany(companyName)}
//                                                 className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                                                 title="Remove"
//                                             >
//                                                 <IoMdClose size={14} />
//                                             </button>
//                                         </motion.div>
//                                     ))}
//                                 </motion.div>
//                             ) : (
//                                 <motion.p
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     className="text-sm text-[var(--text)]/60 dark:text-[var(--text-dark)]/60 mb-6 text-center py-4 bg-white/30 dark:bg-[var(--background-dark)]/30 rounded-xl border border-dashed border-[var(--border)] dark:border-[var(--border-dark)]"
//                                 >
//                                     No stocks selected. Add stocks from the sidebar to get started!
//                                 </motion.p>
//                             )}
//                         </div>

//                         {/* <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
//                             <section className="space-y-6">
//                                 <div className="text-center">
//                                     <motion.h2
//                                         initial={{ opacity: 0, y: -20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="text-2xl font-semibold bg-sky-700 bg-clip-text text-transparent"
//                                     >
//                                         Interactive Whiteboard
//                                     </motion.h2>
//                                     <motion.p
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         transition={{ delay: 0.1 }}
//                                         className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mt-2 text-sm"
//                                     >
//                                         Drag components from the sidebar and resize plots using the handles
//                                     </motion.p>
//                                 </div>

//                                 <DroppableArea id="general">
//                                     {(() => {
//                                         const droppedItems = droppedMap?.[activeTab]?.general || [];
//                                         const visibleItems = getVisibleItems(droppedItems);

//                                         if (visibleItems.length === 0) {
//                                             return (
//                                                 <motion.div
//                                                     initial={{ opacity: 0, scale: 0.95 }}
//                                                     animate={{ opacity: 1, scale: 1 }}
//                                                     className="flex flex-col items-center  py-20 min-h-[900px] px-4 bg-white/50 dark:bg-[var(--background-dark)]/50 rounded-2xl border-2 border-dashed border-[var(--border)] dark:border-[var(--border-dark)] shadow-inner"
//                                                 >
//                                                     <motion.div
//                                                         animate={{
//                                                             y: [0, -10, 0],
//                                                             rotate: [0, 5, -5, 0]
//                                                         }}
//                                                         transition={{
//                                                             duration: 4,
//                                                             repeat: Infinity,
//                                                             ease: "easeInOut"
//                                                         }}
//                                                         className="mb-6"
//                                                     >
//                                                         <svg className="h-20 w-20 text-[var(--primary)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8v8m0 0h8m-8 0l8-8m4 8v-8m0 0H8m8 0l-8 8" />
//                                                         </svg>
//                                                     </motion.div>
//                                                     <h3 className="text-xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                                                         Your Whiteboard Awaits!
//                                                     </h3>
//                                                     <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 text-center max-w-md">
//                                                         Drag and drop components from the sidebar to start building your dashboard.
//                                                         Resize plots using the visible handles for optimal layout.
//                                                     </p>
//                                                     <motion.button
//                                                         whileHover={{ scale: 1.05 }}
//                                                         whileTap={{ scale: 0.95 }}
//                                                         onClick={() => setCollapsed(false)}
//                                                         className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg font-medium"
//                                                     >
//                                                         <GoSidebarExpand size={20} /> Open Sidebar
//                                                     </motion.button>
//                                                 </motion.div>
//                                             );
//                                         }

//                                         const renderPlot = (plotItem, index, allItems) => {
//                                             const { label, symbol, companyName, id, uploadId, platform, type } = plotItem;
//                                             const ComponentMap = type === 'equity' ? equityHubMap : portfolioMap;
//                                             const Component = ComponentMap[label];

//                                             if (!Component) {
//                                                 return (
//                                                     <motion.div
//                                                         key={`general-${id}`}
//                                                         initial={{ opacity: 0, scale: 0.9 }}
//                                                         animate={{ opacity: 1, scale: 1 }}
//                                                         transition={{ duration: 0.3, delay: index * 0.1 }}
//                                                         className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-200 dark:border-red-800/50 h-full"
//                                                     >
//                                                         <button
//                                                             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//                                                             className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                                                             aria-label="Delete component"
//                                                         >
//                                                             <IoMdClose size={18} />
//                                                         </button>
//                                                         <div className="text-center py-8">
//                                                             <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                                                                 <IoMdClose className="text-red-500 text-xl" />
//                                                             </div>
//                                                             <p className="text-red-500 font-medium">Component "{label}" not found</p>
//                                                         </div>
//                                                     </motion.div>
//                                                 );
//                                             }

//                                             if (type === 'equity' && !symbol) {
//                                                 return (
//                                                     <motion.div
//                                                         key={`general-${id}`}
//                                                         initial={{ opacity: 0, scale: 0.9 }}
//                                                         animate={{ opacity: 1, scale: 1 }}
//                                                         transition={{ duration: 0.3, delay: index * 0.1 }}
//                                                         className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-200 dark:border-yellow-800/50 h-full"
//                                                     >
//                                                         <button
//                                                             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//                                                             className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                                                             aria-label="Delete component"
//                                                         >
//                                                             <IoMdClose size={18} />
//                                                         </button>
//                                                         <div className="text-center py-8">
//                                                             <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                                                                 <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                                 </svg>
//                                                             </div>
//                                                             <p className="text-yellow-600 dark:text-yellow-400 font-medium">Waiting for company selection</p>
//                                                             <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 text-sm mt-1">for {label}</p>
//                                                         </div>
//                                                     </motion.div>
//                                                 );
//                                             }

//                                             return (
//                                                 <motion.div
//                                                     key={`general-${id}`}
//                                                     initial={{ opacity: 0, scale: 0.9 }}
//                                                     animate={{ opacity: 1, scale: 1 }}
//                                                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                                                     className="relative bg-white dark:bg-[var(--background-dark)] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border)] dark:border-[var(--border-dark)] h-full group"
//                                                 >
//                                                     <div className="flex items-center justify-between p-4 border-b border-[var(--border)] dark:border-[var(--border-dark)] bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-t-xl">
//                                                         <h3 className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate flex items-center gap-2">
//                                                             <span className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"></span>
//                                                             {label}
//                                                             <span className="text-xs text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                                                                 {companyName ? `(${companyName})` : platform ? `(${platform})` : ''}
//                                                             </span>
//                                                         </h3>
//                                                         <button
//                                                             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//                                                             className="p-1.5 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
//                                                             aria-label="Delete component"
//                                                         >
//                                                             <IoMdClose size={16} />
//                                                         </button>
//                                                     </div>

//                                                     <div className="p-4 min-h-[800px]">
//                                                         {type === 'equity' ? (
//                                                             <Component symbol={symbol} key={`${id}-${symbol}`} />
//                                                         ) : (
//                                                             <GraphDataProvider>
//                                                                 <Component uploadId={uploadId} key={`${id}-${uploadId}`} />
//                                                             </GraphDataProvider>
//                                                         )}
//                                                     </div>

//                                                     <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/30 rounded-xl pointer-events-none transition-all duration-300" />
//                                                 </motion.div>
//                                             );
//                                         };

//                                         const firstTwo = visibleItems.slice(0, 2);
//                                         const remaining = visibleItems.slice(2);
//                                         const hasRemaining = remaining.length > 0;

//                                         return (
//                                             <PanelGroup
//                                                 direction={hasRemaining ? "vertical" : "horizontal"}
//                                                 className="min-h-[800px] rounded-2xl bg-white/30 dark:bg-[var(--background-dark)]/30 border border-[var(--border)] dark:border-[var(--border-dark)] shadow-md backdrop-blur-sm"
//                                                 onLayout={() => setResizing(false)}
//                                             >
//                                                 <Panel defaultSize={hasRemaining ? 50 : 100} minSize={30}>
//                                                     <PanelGroup direction="horizontal">
//                                                         {firstTwo.map((item, idx) => (
//                                                             <React.Fragment key={`first-${item.id}`}>
//                                                                 {idx > 0 && (
//                                                                     <PanelResizeHandle
//                                                                         onDragging={setResizing}
//                                                                         className="relative group"
//                                                                     >
//                                                                         <ResizeHandle direction="horizontal" />
//                                                                     </PanelResizeHandle>
//                                                                 )}
//                                                                 <Panel defaultSize={100 / firstTwo.length} minSize={20}>
//                                                                     {renderPlot(item, idx, droppedItems)}
//                                                                 </Panel>
//                                                             </React.Fragment>
//                                                         ))}
//                                                     </PanelGroup>
//                                                 </Panel>

//                                                 {hasRemaining && (
//                                                     <>
//                                                         <PanelResizeHandle onDragging={setResizing}>
//                                                             <ResizeHandle direction="vertical" />
//                                                         </PanelResizeHandle>
//                                                         <Panel defaultSize={50} minSize={30}>
//                                                             <PanelGroup direction="horizontal">
//                                                                 {remaining.map((item, idx) => (
//                                                                     <React.Fragment key={`rem-${item.id}`}>
//                                                                         {idx > 0 && (
//                                                                             <PanelResizeHandle onDragging={setResizing}>
//                                                                                 <ResizeHandle direction="horizontal" />
//                                                                             </PanelResizeHandle>
//                                                                         )}
//                                                                         <Panel defaultSize={100 / remaining.length} minSize={20}>
//                                                                             {renderPlot(item, idx + 3, droppedItems)}
//                                                                         </Panel>
//                                                                     </React.Fragment>
//                                                                 ))}
//                                                             </PanelGroup>
//                                                         </Panel>
//                                                     </>
//                                                 )}
//                                             </PanelGroup>
//                                         );
//                                     })()}
//                                 </DroppableArea>
//                             </section>
//                         </main> */}
//                         <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
//                             <section className="space-y-6">
//                                 <div className="text-center">
//                                     <motion.h2
//                                         initial={{ opacity: 0, y: -20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="text-2xl font-semibold bg-sky-700 bg-clip-text text-transparent"
//                                     >
//                                         Interactive Whiteboard
//                                     </motion.h2>
//                                     <motion.p
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         transition={{ delay: 0.1 }}
//                                         className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mt-2 text-sm"
//                                     >
//                                         Drag components from the sidebar and resize plots using the handles
//                                     </motion.p>
//                                 </div>

//                                 <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//                                     <DroppableArea id="general">
//                                         <SortableContext items={items.map(item => item.sortableId)} strategy={() => null}>
//                                             {(() => {
//                                                 const visibleItems = getVisibleItems(items);

//                                                 if (visibleItems.length === 0) {
//                                                     return (
//                                                         <motion.div
//                                                             initial={{ opacity: 0, scale: 0.95 }}
//                                                             animate={{ opacity: 1, scale: 1 }}
//                                                             className="flex flex-col items-center py-20 min-h-[900px] px-4 bg-white/50 dark:bg-[var(--background-dark)]/50 rounded-2xl border-2 border-dashed border-[var(--border)] dark:border-[var(--border-dark)] shadow-inner"
//                                                         >
//                                                             <motion.div
//                                                                 animate={{
//                                                                     y: [0, -10, 0],
//                                                                     rotate: [0, 5, -5, 0],
//                                                                 }}
//                                                                 transition={{
//                                                                     duration: 4,
//                                                                     repeat: Infinity,
//                                                                     ease: 'easeInOut',
//                                                                 }}
//                                                                 className="mb-6"
//                                                             >
//                                                                 <svg className="h-20 w-20 text-[var(--primary)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8v8m0 0h8m-8 0l8-8m4 8v-8m0 0H8m8 0l-8 8" />
//                                                                 </svg>
//                                                             </motion.div>
//                                                             <h3 className="text-xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                                                                 Your Whiteboard Awaits!
//                                                             </h3>
//                                                             <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 text-center max-w-md">
//                                                                 Drag and drop components from the sidebar to start building your dashboard.
//                                                                 Resize plots using the visible handles for optimal layout.
//                                                             </p>
//                                                             <motion.button
//                                                                 whileHover={{ scale: 1.05 }}
//                                                                 whileTap={{ scale: 0.95 }}
//                                                                 onClick={() => setCollapsed(false)}
//                                                                 className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg font-medium"
//                                                             >
//                                                                 <GoSidebarExpand size={20} /> Open Sidebar
//                                                             </motion.button>
//                                                         </motion.div>
//                                                     );
//                                                 }

//                                                 const firstTwo = visibleItems.slice(0, 2);
//                                                 const remaining = visibleItems.slice(2);
//                                                 const hasRemaining = remaining.length > 0;

//                                                 return (
//                                                     <PanelGroup
//                                                         direction={hasRemaining ? 'vertical' : 'horizontal'}
//                                                         className="min-h-[800px] rounded-2xl bg-white/30 dark:bg-[var(--background-dark)]/30 border border-[var(--border)] dark:border-[var(--border-dark)] shadow-md backdrop-blur-sm"
//                                                         onLayout={() => setResizing(false)}
//                                                     >
//                                                         <Panel defaultSize={hasRemaining ? 50 : 100} minSize={30}>
//                                                             <PanelGroup direction="horizontal">
//                                                                 {firstTwo.map((item, idx) => (
//                                                                     <React.Fragment key={`first-${item.id}`}>
//                                                                         {idx > 0 && (
//                                                                             <PanelResizeHandle onDragging={setResizing}>
//                                                                                 <ResizeHandle direction="horizontal" />
//                                                                             </PanelResizeHandle>
//                                                                         )}
//                                                                         <Panel defaultSize={100 / firstTwo.length} minSize={30}>
//                                                                             <Draggable id={item.sortableId}>
//                                                                                 {renderPlot(item, idx, items)}
//                                                                             </Draggable>
//                                                                         </Panel>
//                                                                     </React.Fragment>
//                                                                 ))}
//                                                             </PanelGroup>
//                                                         </Panel>
//                                                         {hasRemaining && (
//                                                             <>
//                                                                 <PanelResizeHandle onDragging={setResizing}>
//                                                                     <ResizeHandle direction="vertical" />
//                                                                 </PanelResizeHandle>
//                                                                 <Panel defaultSize={50} minSize={30}>
//                                                                     <PanelGroup direction="horizontal">
//                                                                         {remaining.map((item, idx) => (
//                                                                             <React.Fragment key={`rem-${item.id}`}>
//                                                                                 {idx > 0 && (
//                                                                                     <PanelResizeHandle onDragging={setResizing}>
//                                                                                         <ResizeHandle direction="horizontal" />
//                                                                                     </PanelResizeHandle>
//                                                                                 )}
//                                                                                 <Panel defaultSize={100 / remaining.length} minSize={30}>
//                                                                                     <Draggable id={item.sortableId}>
//                                                                                         {renderPlot(item, idx + 3, items)}
//                                                                                     </Draggable>
//                                                                                 </Panel>
//                                                                             </React.Fragment>
//                                                                         ))}
//                                                                     </PanelGroup>
//                                                                 </Panel>
//                                                             </>
//                                                         )}
//                                                     </PanelGroup>
//                                                 );
//                                             })()}
//                                         </SortableContext>
//                                     </DroppableArea>
//                                 </DndContext>
//                             </section>
//                         </main>

//                     </div>

//                     <AnimatePresence>
//                         {showUnsavedModal && (
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
//                             >
//                                 <motion.div
//                                     initial={{ scale: 0.9, opacity: 0 }}
//                                     animate={{ scale: 1, opacity: 1 }}
//                                     exit={{ scale: 0.9, opacity: 0 }}
//                                     className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//                                 >
//                                     <div className="text-center mb-6">
//                                         <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                                             <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                                             </svg>
//                                         </div>
//                                         <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">Unsaved Changes</h2>
//                                         <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                                             You have unsaved changes. Would you like to save before {pendingNavigation ? `navigating to ${pendingNavigation.label}` : pendingTab ? `switching to ${pendingTab}` : 'leaving'}?
//                                         </p>
//                                     </div>
//                                     <div className="flex gap-3">
//                                         <button
//                                             onClick={handleSaveAndNavigate}
//                                             className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md"
//                                         >
//                                             Save & Continue
//                                         </button>
//                                         <button
//                                             onClick={handleConfirmNavigation}
//                                             className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md"
//                                         >
//                                             Leave Anyway
//                                         </button>
//                                     </div>
//                                     <button
//                                         onClick={handleCancelNavigation}
//                                         className="w-full mt-3 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-colors"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </motion.div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     {showSavedModal && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//                         >
//                             <motion.div
//                                 initial={{ scale: 0.9, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 exit={{ scale: 0.9, opacity: 0 }}
//                                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)] text-center"
//                             >
//                                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <BiSolidSave className="w-8 h-8 text-green-500" />
//                                 </div>
//                                 <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">Dashboard Saved!</h2>
//                                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">Your changes have been saved successfully.</p>
//                             </motion.div>
//                         </motion.div>
//                     )}

//                     <DragStartModal
//                         isOpen={showDragModal}
//                         onClose={() => {
//                             setShowDragModal(false);
//                             setCurrentDragItem(null);
//                             setError(null);
//                         }}
//                         onSearch={handleStockSearch}
//                         searchTerm={searchTerm}
//                         setSearchTerm={(value) => {
//                             setSearchTerm(value);
//                             setError(null);
//                             if (value.length >= 2) handleStockSearch();
//                             else setSearchedStocks([]);
//                         }}
//                         searchedStocks={searchedStocks}
//                         onSelectItem={(item) => {
//                             if (currentDragItem) {
//                                 setDroppedMap((prev) => {
//                                     const currentTab = prev[activeTab] || { general: [] };
//                                     const generalItems = currentTab.general || [];
//                                     const lastItemIndex = generalItems.findLastIndex(
//                                         (i) => i.label === currentDragItem.label && !i.symbol
//                                     );
//                                     if (lastItemIndex >= 0) {
//                                         const updatedItems = [...generalItems];
//                                         updatedItems[lastItemIndex] = {
//                                             ...updatedItems[lastItemIndex],
//                                             symbol: item.symbol,
//                                             companyName: item.companyName,
//                                             type: 'equity',
//                                         };
//                                         return { ...prev, [activeTab]: { ...currentTab, general: updatedItems } };
//                                     } else {
//                                         const newItem = {
//                                             label: currentDragItem.label,
//                                             symbol: item.symbol,
//                                             companyName: item.companyName,
//                                             graphType: currentDragItem.label,
//                                             id: `${currentDragItem.label}-${Date.now()}`,
//                                             type: 'equity',
//                                         };
//                                         return { ...prev, [activeTab]: { ...currentTab, general: [...generalItems, newItem] } };
//                                     }
//                                 });
//                                 setDragCountMap((prev) => ({
//                                     ...prev,
//                                     [activeTab]: {
//                                         ...prev[activeTab],
//                                         [currentDragItem.label]: (prev[activeTab]?.[currentDragItem.label] || 0) + 1,
//                                     },
//                                 }));
//                                 setHasUnsavedChanges(true);
//                             }
//                             setSearchTerm('');
//                             setSearchedStocks([]);
//                             setShowDragModal(false);
//                             setCurrentDragItem(null);
//                             setError(null);
//                         }}
//                         onClear={() => {
//                             setSearchTerm('');
//                             setSearchedStocks([]);
//                             setError(null);
//                         }}
//                         selectedCompany={null}
//                         error={error}
//                     />

//                     <PortfolioSelectModal
//                         isOpen={showPortfolioModal}
//                         onClose={() => {
//                             setShowPortfolioModal(false);
//                             setCurrentDragItem(null);
//                             setError(null);
//                         }}
//                         portfolios={savedPortfolios}
//                         onSelectPortfolio={handlePortfolioSelect}
//                         error={error}
//                     />

//                     {showDeleteModal && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//                         >
//                             <motion.div
//                                 initial={{ scale: 0.9, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 exit={{ scale: 0.9, opacity: 0 }}
//                                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//                             >
//                                 <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-4">Confirm Deletion</h2>
//                                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mb-6">
//                                     Are you sure you want to delete your account? This action cannot be undone.
//                                 </p>
//                                 <div className="flex gap-4">
//                                     <button
//                                         onClick={handleDeleteAccount}
//                                         className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
//                                     >
//                                         Delete
//                                     </button>
//                                     <button
//                                         onClick={() => setShowDeleteModal(false)}
//                                         className="flex-1 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-all duration-300"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     )}
//                 </div>
//             </DndContext>
//         </div>
//     );
// };

// export default DashBoard;


//--------------------working code---------------------------------


// import React, { useEffect, useState, useRef } from 'react';
// import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
// import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import Navbar from '../Navbar';
// import { MdOutlineDashboardCustomize, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
// import { BiSolidSave } from 'react-icons/bi';
// import { IoMdClose, IoMdSave } from 'react-icons/io';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Modal from 'react-modal';
// import SidebarRight from './SidebarRight';
// import AddNewModal from './AddNewModal';
// import DragStartModal from './DragStartModal';
// import DroppableArea from './DroppableArea';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { GoSidebarExpand } from 'react-icons/go';
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';
// import PortfolioSelectModal from './PortfolioSelectModal';
// import { Search } from 'lucide-react';
// import SearchList from '../EquityHub/SearchList';
// import { useAuth } from '../AuthContext';
// import { CiLogout } from 'react-icons/ci';
// import { logActivity } from '../../services/api';
// import { IoMdArrowDropdown } from 'react-icons/io';
// import axios from 'axios';
// import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
// import { FaChartLine, FaBriefcase, FaInfoCircle, FaRocket } from 'react-icons/fa';

// Modal.setAppElement('#root');

// // Custom Draggable component
// const Draggable = ({ id, children }) => {
//     const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//     };

//     return (
//         <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//             {children}
//         </div>
//     );
// };

// // Custom ResizeHandle component
// const ResizeHandle = ({ direction = 'horizontal' }) => (
//     <div
//         className={`
//       relative group transition-all duration-200
//       ${direction === 'horizontal' ? 'w-2 h-full mx-1' : 'h-2 w-full my-1'}
//     `}
//     >
//         <div
//             className={`
//         absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10
//         rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
//       `}
//         />
//         <div
//             className={`
//         absolute inset-0 flex items-center justify-center
//         ${direction === 'horizontal' ? 'flex-col' : 'flex-row'}
//       `}
//         >
//             <div
//                 className={`
//           bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full
//           transition-all duration-200 group-hover:scale-110
//           ${direction === 'horizontal' ? 'w-1 h-8' : 'h-1 w-8'}
//         `}
//             />
//         </div>
//     </div>
// );

// const DashBoard = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const [showModal, setShowModal] = useState(false);
//     const [tabs, setTabs] = useState(['Dashboard 1']);
//     const [activeTab, setActiveTab] = useState('Dashboard 1');
//     const [uploadId, setUploadId] = useState(null);
//     const [platform, setPlatform] = useState('');
//     const [symbol, setSymbol] = useState(null);
//     const [savedStocks, setSavedStocks] = useState([]);
//     const [savedPortfolios, setSavedPortfolios] = useState([]);
//     const [droppedMap, setDroppedMap] = useState({ 'Dashboard 1': { general: [] } });
//     const [savedDroppedMap, setSavedDroppedMap] = useState({});
//     const [editingTab, setEditingTab] = useState(null);
//     const [editedTabName, setEditedTabName] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchedStocks, setSearchedStocks] = useState([]);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [showDragModal, setShowDragModal] = useState(false);
//     const [showPortfolioModal, setShowPortfolioModal] = useState(false);
//     const [collapsed, setCollapsed] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [dragCountMap, setDragCountMap] = useState({ 'Dashboard 1': {} });
//     const [currentDragItem, setCurrentDragItem] = useState(null);
//     const [error, setError] = useState(null);
//     const [showUnsavedModal, setShowUnsavedModal] = useState(false);
//     const [showSavedModal, setShowSavedModal] = useState(false);
//     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//     const [pendingNavigation, setPendingNavigation] = useState(null);
//     const [pendingTab, setPendingTab] = useState(null);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const queryParams = new URLSearchParams(location.search);
//     const [sticky, setSticky] = useState(false);
//     const [userType, setUserType] = useState(null);
//     const [fullName, setFullName] = useState('');
//     const initialQuery = queryParams.get('query') || '';
//     const [isDisabled, setIsDisabled] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [results, setResults] = useState([]);
//     const { login, logout } = useAuth();
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
//     const drawerRef = useRef(null);
//     const [resizing, setResizing] = useState(false);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (!event.target.closest('#portfolio-dropdown')) {
//                 setIsPortfolioOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     useEffect(() => {
//         const handleScroll = () => setSticky(window.scrollY > 0);
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     useEffect(() => {
//         const currentTab = droppedMap[activeTab] || { general: [] };
//         const savedTab = savedDroppedMap[activeTab] || { general: [] };
//         const hasChanges = JSON.stringify(currentTab.general) !== JSON.stringify(savedTab.general);
//         setHasUnsavedChanges(hasChanges);
//     }, [droppedMap, activeTab, savedDroppedMap]);

//     useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         if (token) setIsLoggedIn(true);
//     }, []);

//     useEffect(() => {
//         const storedUploadId = localStorage.getItem('uploadId');
//         const storedPlatform = localStorage.getItem('platform');
//         if (storedUploadId && storedPlatform) {
//             setUploadId(storedUploadId);
//             setPlatform(storedPlatform);
//         }
//     }, []);

//     const fetchSavedPortfolio = async () => {
//         try {
//             setError('');
//             const token = localStorage.getItem('authToken');
//             if (!token) {
//                 setError('Please login to view your portfolios');
//                 return;
//             }
//             const response = await fetch(`${API_BASE}/file/saved`, {
//                 method: 'GET',
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) {
//                 const err = await response.json();
//                 setError(err.error || 'Failed to fetch saved portfolios');
//                 return;
//             }
//             const data = await response.json();
//             if (data.length > 0) {
//                 setSavedPortfolios(data);
//                 setUploadId(data[0].uploadId);
//                 setPlatform(data[0].platform);
//             } else {
//                 setSavedPortfolios([]);
//                 setError('No portfolios found');
//             }
//         } catch (err) {
//             console.error('Error fetching saved portfolios:', err);
//             setError('Network error. Please try again later.');
//         }
//     };

//     useEffect(() => {
//         fetchSavedPortfolio();
//     }, [API_BASE]);

//     const handleStockSearch = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${API_BASE}/stocks/test/search?query=${searchTerm}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const data = await response.json();
//             if (Array.isArray(data) && data.length > 0) {
//                 setSearchedStocks(data);
//                 setSavedStocks(data);
//             } else {
//                 setSearchedStocks([]);
//                 toast.info('No stocks found for the search term.');
//                 setError('Company not found');
//             }
//         } catch (err) {
//             console.error('Error fetching stock suggestions:', err);
//             setSearchedStocks([]);
//             setError('Company not found in our list. Please check the name and search again.');
//         }
//     };

//     const handleRenameTab = (oldName, newName) => {
//         if (!newName || newName.trim() === '') return;
//         if (tabs.includes(newName)) {
//             toast.info('A dashboard with this name already exists.');
//             return;
//         }
//         setTabs((prevTabs) => prevTabs.map((tab) => (tab === oldName ? newName : tab)));
//         setDroppedMap((prev) => {
//             const updated = { ...prev };
//             updated[newName] = prev[oldName];
//             delete updated[oldName];
//             return updated;
//         });
//         setSavedDroppedMap((prev) => {
//             const updated = { ...prev };
//             updated[newName] = prev[oldName];
//             delete updated[oldName];
//             return updated;
//         });
//         setDragCountMap((prev) => {
//             const updated = { ...prev };
//             updated[newName] = prev[oldName];
//             delete updated[oldName];
//             return updated;
//         });
//         if (activeTab === oldName) setActiveTab(newName);
//         setEditingTab(null);
//         setEditedTabName('');
//     };

//     const handleDeleteComponent = (index) => {
//         setDroppedMap((prev) => {
//             const updated = { ...prev };
//             updated[activeTab] = {
//                 ...prev[activeTab],
//                 general: prev[activeTab].general.filter((_, idx) => idx !== index),
//             };
//             return updated;
//         });
//         const label = droppedMap[activeTab].general[index].label;
//         const remaining = droppedMap[activeTab].general.filter((item, idx) => idx !== index && item.label === label);
//         if (remaining.length === 0) {
//             setDragCountMap((prev) => ({
//                 ...prev,
//                 [activeTab]: { ...prev[activeTab], [label]: 0 },
//             }));
//         }
//         setHasUnsavedChanges(true);
//     };

//     const handleClearCompany = (companyName) => {
//         setDroppedMap((prev) => ({
//             ...prev,
//             [activeTab]: {
//                 ...prev[activeTab],
//                 general: prev[activeTab].general.filter((item) => item.companyName !== companyName),
//             },
//         }));
//         const affectedLabels = droppedMap[activeTab].general
//             .filter((item) => item.companyName === companyName)
//             .map((item) => item.label);
//         setDragCountMap((prev) => {
//             const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//             affectedLabels.forEach((label) => {
//                 const remaining = droppedMap[activeTab].general.filter(
//                     (item) => item.label === label && item.companyName !== companyName
//                 );
//                 updated[activeTab][label] = remaining.length > 0 ? prev[activeTab][label] || 1 : 0;
//             });
//             return updated;
//         });
//         toast.success(`Company ${companyName} and associated graphs removed`);
//         setHasUnsavedChanges(true);
//     };

//     const generateDefaultDashboardName = async (baseName = 'Dashboard') => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Failed to fetch dashboards');
//             const data = await response.json();
//             const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//             let index = 1;
//             let defaultName;
//             do {
//                 defaultName = `${baseName} ${index}`;
//                 index++;
//             } while (existingNames.includes(defaultName) || tabs.includes(defaultName));
//             return defaultName;
//         } catch (err) {
//             console.error('Error fetching dashboards for name generation:', err);
//             let index = 1;
//             let defaultName;
//             do {
//                 defaultName = `${baseName} ${index}`;
//                 index++;
//             } while (tabs.includes(defaultName));
//             return defaultName;
//         }
//     };

//     const handleNewDashboard = async (title) => {
//         const newTitle = title && title.trim() ? title : await generateDefaultDashboardName();
//         if (tabs.includes(newTitle)) {
//             toast.info('A dashboard with this name already exists.');
//             return;
//         }
//         setTabs((prev) => [...prev, newTitle]);
//         setDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//         setSavedDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//         setActiveTab(newTitle);
//         setShowModal(false);
//         setDragCountMap((prev) => ({ ...prev, [newTitle]: {} }));
//         setIsMenuOpen(false);
//         setHasUnsavedChanges(false);
//     };

//     const handleDragStart = (event) => {
//         const { active } = event;
//         const label = active?.data?.current?.label;
//         setCurrentDragItem(active?.data?.current);
//         const equityLabels = Object.keys(equityHubMap);
//         const portfolioLabels = Object.keys(portfolioMap);
//         if (equityLabels.includes(label)) {
//             const currentDragCount = dragCountMap[activeTab]?.[label] || 0;
//             if (currentDragCount === 0 && !droppedMap[activeTab].general.some((item) => item.label === label)) {
//                 setShowDragModal(true);
//             } else if (currentDragCount >= 1) {
//                 setShowDragModal(true);
//             }
//         } else if (portfolioLabels.includes(label)) {
//             setShowPortfolioModal(true);
//         }
//     };

//     const handleItemClick = (item) => {
//         const { id, label } = item;
//         const equityLabels = Object.keys(equityHubMap);
//         const portfolioLabels = Object.keys(portfolioMap);

//         let section = null;
//         if (equityLabels.includes(label)) section = 'equity';
//         if (portfolioLabels.includes(label)) section = 'portfolio';

//         if (section === 'equity') {
//             setCurrentDragItem({ label });
//             setShowDragModal(true);
//             return;
//         }

//         if (section === 'portfolio') {
//             setCurrentDragItem({ label });
//             setShowPortfolioModal(true);
//             return;
//         }
//     };

//     const handleDragEnd = (event) => {
//         const { over, active } = event;
//         const label = active?.data?.current?.label;
//         const id = active?.id;

//         // Handle reordering of existing items
//         if (active.data.current?.sortable) {
//             const items = droppedMap[activeTab]?.general || [];
//             const oldIndex = items.findIndex((item) => item.sortableId === active.id);
//             const newIndex = items.findIndex((item) => item.sortableId === over?.id);
//             if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//                 setDroppedMap((prev) => ({
//                     ...prev,
//                     [activeTab]: {
//                         ...prev[activeTab],
//                         general: arrayMove(prev[activeTab].general, oldIndex, newIndex),
//                     },
//                 }));
//                 setHasUnsavedChanges(true);
//             }
//             return;
//         }

//         // Handle new item drop
//         if (!over || !label || !id) return;

//         // if (over.id !== 'general') {
//         //     toast.error(`"${label}" can only be dropped in the whiteboard area.`);
//         //     return;
//         // }

//         const equityLabels = Object.keys(equityHubMap);
//         const portfolioLabels = Object.keys(portfolioMap);

//         if (equityLabels.includes(label)) {
//             setCurrentDragItem(active?.data?.current);
//             setShowDragModal(true);
//             return;
//         }

//         if (portfolioLabels.includes(label)) {
//             setCurrentDragItem(active?.data?.current);
//             setShowPortfolioModal(true);
//             return;
//         }
//     };

//     const handlePortfolioSelect = (portfolio) => {
//         if (currentDragItem) {
//             const draggedItem = {
//                 label: currentDragItem.label,
//                 symbol: '',
//                 companyName: '',
//                 graphType: currentDragItem.label,
//                 uploadId: portfolio.uploadId,
//                 platform: portfolio.platform,
//                 id: `${currentDragItem.label}-${Date.now()}`,
//                 type: 'portfolio',
//                 sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//             };

//             setDroppedMap((prev) => {
//                 const currentTab = prev[activeTab] || { general: [] };
//                 const currentSection = currentTab.general || [];
//                 return {
//                     ...prev,
//                     [activeTab]: { ...currentTab, general: [...currentSection, draggedItem] },
//                 };
//             });
//             setUploadId(portfolio.uploadId);
//             setPlatform(portfolio.platform);
//             localStorage.setItem('uploadId', portfolio.uploadId.toString());
//             localStorage.setItem('platform', portfolio.platform);
//             setShowPortfolioModal(false);
//             setCurrentDragItem(null);
//             setHasUnsavedChanges(true);
//         }
//     };

//     const getVisibleItems = (items) => items;

//     const handleSaveDashboard = async () => {
//         const token = localStorage.getItem('authToken');
//         const userId = localStorage.getItem('userId');
//         const userType = localStorage.getItem('userType');
//         const generalPlots = droppedMap?.[activeTab]?.general || [];

//         if (!token) {
//             toast.error('Please login first to save your dashboard.');
//             return;
//         }

//         if (generalPlots.length === 0) {
//             toast.error('Please drag and drop at least one plot before saving.');
//             return;
//         }

//         let finalDashboardName = activeTab;

//         try {
//             const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Failed to fetch dashboards');
//             const data = await response.json();
//             const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//             if (existingNames.includes(finalDashboardName)) {
//                 finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//                 setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//                 setDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setSavedDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = { general: generalPlots };
//                     if (activeTab !== finalDashboardName) delete updated[activeTab];
//                     return updated;
//                 });
//                 setDragCountMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setActiveTab(finalDashboardName);
//                 toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//             }
//         } catch (err) {
//             console.error('Error checking dashboard names:', err);
//             if (tabs.includes(finalDashboardName)) {
//                 finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//                 setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//                 setDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setSavedDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = { general: generalPlots };
//                     if (activeTab !== finalDashboardName) delete updated[activeTab];
//                     return updated;
//                 });
//                 setDragCountMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setActiveTab(finalDashboardName);
//                 toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//             }
//         }

//         const savedData = {
//             dashboard: { dashboardName: finalDashboardName, userId: userId ? parseInt(userId) : 0, userType: userType || '' },
//             equityHubPlots: [],
//             portfolioPlots: [],
//         };

//         generalPlots.forEach(({ label, symbol, companyName, graphType, uploadId, platform, type }) => {
//             if (type === 'equity') {
//                 let finalSymbol = symbol;
//                 let finalCompany = companyName;

//                 if (!finalSymbol || !finalCompany) {
//                     const matched = savedStocks.find(
//                         (stock) => stock.symbol === finalSymbol || stock.graphType === graphType || stock.label === label
//                     );
//                     if (matched) {
//                         finalSymbol = finalSymbol || matched.symbol;
//                         finalCompany = finalCompany || matched.companyName;
//                     }
//                 }

//                 savedData.equityHubPlots.push({ symbol: finalSymbol, companyName: finalCompany, graphType: graphType || label });
//             } else if (type === 'portfolio') {
//                 savedData.portfolioPlots.push({ uploadId, platform, graphType: label });
//             }
//         });

//         try {
//             const response = await fetch(`${API_BASE}/dashboard/save`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//                 body: JSON.stringify(savedData),
//             });
//             if (response.ok) {
//                 const result = await response.json();
//                 setSavedDroppedMap((prev) => ({
//                     ...prev,
//                     [finalDashboardName]: { general: generalPlots },
//                 }));
//                 setHasUnsavedChanges(false);
//                 setShowSavedModal(true);
//                 setTimeout(() => setShowSavedModal(false), 2000);
//             } else {
//                 toast.error('Failed to save dashboard');
//             }
//         } catch (err) {
//             console.error('Save failed:', err);
//             toast.error('Save failed');
//         }
//         setIsMenuOpen(false);
//     };

//     const handleDeleteDashboardAPI = async (dashboardName) => {
//         if (hasUnsavedChanges) {
//             setPendingTab(dashboardName);
//             setShowUnsavedModal(true);
//             return;
//         }
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${API_BASE}/dashboard/delete/${dashboardName}`, {
//                 method: 'DELETE',
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Failed to delete dashboard');
//             setTabs((prev) => prev.filter((tab) => tab !== dashboardName));
//             setDroppedMap((prev) => {
//                 const updated = { ...prev };
//                 delete updated[dashboardName];
//                 return updated;
//             });
//             setSavedDroppedMap((prev) => {
//                 const updated = { ...prev };
//                 delete updated[dashboardName];
//                 return updated;
//             });
//             setDragCountMap((prev) => {
//                 const updated = { ...prev };
//                 delete updated[dashboardName];
//                 return updated;
//             });
//             if (activeTab === dashboardName) {
//                 const remainingTabs = tabs.filter((tab) => tab !== dashboardName);
//                 setActiveTab(remainingTabs[0] || '');
//             }
//             toast.success('Dashboard deleted successfully');
//             setIsMenuOpen(false);
//         } catch (err) {
//             console.error('Delete error:', err);
//             toast.error('Failed to delete dashboard');
//         }
//     };

//     const getUniqueCompanies = () => {
//         const generalItems = droppedMap[activeTab]?.general || [];
//         return [...new Set(generalItems.filter((item) => item.companyName).map((item) => item.companyName))];
//     };

//     const isDashboardEmpty = () => {
//         const currentTab = droppedMap[activeTab] || { general: [] };
//         return currentTab.general.length === 0;
//     };

//     const getCachedData = (key) => {
//         const cached = localStorage.getItem(key);
//         if (!cached) return null;
//         try {
//             const { data, timestamp } = JSON.parse(cached);
//             if (Date.now() - timestamp > 3600000) {
//                 // 1 hour TTL
//                 localStorage.removeItem(key);
//                 return null;
//             }
//             return data;
//         } catch (err) {
//             setError('Failed to parse cached data.');
//             console.error('Cache parse error:', err);
//             return null;
//         }
//     };

//     const setCachedData = (key, data) => {
//         try {
//             localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//         } catch (err) {
//             setError('Failed to cache data.');
//             console.error('Cache set error:', err);
//         }
//     };

//     const handleClearSearch = () => {
//         setSearchQuery('');
//         setResults([]);
//         setError(null);
//     };

//     const handleLoginClick = () => setShowLoginModal(true);
//     const handleCloseModal = () => setShowLoginModal(false);
//     const handleLoginSuccess = () => {
//         login();
//         handleCloseModal();
//     };

//     const handleLogout = () => {
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label: 'logout', path: '/' });
//             setShowUnsavedModal(true);
//             setShowSavedModal(false);
//             return;
//         }
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logout successfully!');
//         navigate('/');
//     };

//     const handleDeleteAccount = async () => {
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label: 'deleteAccount', path: '/' });
//             setShowUnsavedModal(true);
//             setShowSavedModal(false);
//             return;
//         }
//         const apiUrl =
//             userType === "corporate"
//                 ? `${API_BASE}/corporate/delete-account`
//                 : `${API_BASE}/Userprofile/delete-account`;


//         try {
//             await axios.delete(apiUrl, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             toast.success('Account deleted successfully');
//             localStorage.removeItem('authToken');
//             localStorage.removeItem('userType');
//             localStorage.removeItem('hasShownQuizPopup');
//             logout();
//             navigate('/');
//             setShowDeleteModal(false);
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to delete account');
//         }
//     };

//     const handleNavClick = async (label, path, state = {}) => {
//         setShowSavedModal(false);
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label, path, state });
//             setShowUnsavedModal(true);
//         } else {
//             await logActivity(`${label} tab clicked`);
//             navigate(path, { state });
//         }
//     };

//     const handleTabSwitch = (tab) => {
//         setShowSavedModal(false);
//         if (hasUnsavedChanges && activeTab !== tab) {
//             setPendingTab(tab);
//             setShowUnsavedModal(true);
//         } else {
//             setActiveTab(tab);
//             setIsMenuOpen(false);
//         }
//     };

//     const handleConfirmNavigation = async () => {
//         setShowUnsavedModal(false);
//         setShowSavedModal(false);
//         if (pendingNavigation) {
//             if (pendingNavigation.label === 'logout') {
//                 localStorage.removeItem('authToken');
//                 localStorage.removeItem('userType');
//                 localStorage.removeItem('userEmail');
//                 logout();
//                 toast.success('Logout successfully!');
//                 navigate('/');
//             } else if (pendingNavigation.label === 'deleteAccount') {
//                 await handleDeleteAccount();
//             } else if (pendingNavigation.label === 'addDashboard') {
//                 setShowModal(true);
//                 setIsMenuOpen(false);
//             } else {
//                 await logActivity(`${pendingNavigation.label} tab clicked`);
//                 navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//             }
//             setPendingNavigation(null);
//         } else if (pendingTab) {
//             setActiveTab(pendingTab);
//             setPendingTab(null);
//             setIsMenuOpen(false);
//         }
//     };

//     const handleCancelNavigation = () => {
//         setShowUnsavedModal(false);
//         setShowSavedModal(false);
//         setPendingNavigation(null);
//         setPendingTab(null);
//     };

//     const handleSaveAndNavigate = async () => {
//         setShowUnsavedModal(false);
//         setShowSavedModal(false);
//         await handleSaveDashboard();
//         setShowSavedModal(false);
//         if (pendingNavigation) {
//             if (pendingNavigation.label === 'logout') {
//                 localStorage.removeItem('authToken');
//                 localStorage.removeItem('userType');
//                 localStorage.removeItem('userEmail');
//                 logout();
//                 toast.success('Logout successfully!');
//                 navigate('/');
//             } else if (pendingNavigation.label === 'deleteAccount') {
//                 await handleDeleteAccount();
//             } else if (pendingNavigation.label === 'addDashboard') {
//                 setShowModal(true);
//                 setIsMenuOpen(false);
//             } else {
//                 await logActivity(`${pendingNavigation.label} tab clicked`);
//                 navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//             }
//             setPendingNavigation(null);
//         } else if (pendingTab) {
//             setActiveTab(pendingTab);
//             setPendingTab(null);
//             setIsMenuOpen(false);
//         }
//     };

//     const sensors = useSensors(
//         useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
//         useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
//     );

//     const handleTopCompanyClick = async () => {
//         try {
//             const apiUrl = `${API_BASE}/market/top-company`;
//             const response = await fetch(apiUrl, {
//                 method: 'GET',
//             });

//             if (!response.ok) {
//                 const err = await response.json();
//                 throw new Error(err.error || 'Failed to fetch top company');
//             }
//             const topCompany = await response.json();

//             if (!topCompany || !topCompany.Symbol || !topCompany.CompanyName) {
//                 toast.error('No top company data available.');
//                 return;
//             }

//             const plotsToAdd = [
//                 { label: 'MacdPlot', graphType: 'MacdPlot' },
//                 { label: 'SensexCalculator', graphType: 'SensexCalculator' },
//                 { label: 'CandlePatternPlot', graphType: 'CandlePatternPlot' },
//             ];

//             setDroppedMap((prev) => {
//                 const currentTab = prev[activeTab] || { general: [] };
//                 const currentSection = currentTab.general || [];
//                 const newItems = plotsToAdd.map((plot) => ({
//                     label: plot.label,
//                     symbol: topCompany.Symbol,
//                     companyName: topCompany.CompanyName,
//                     graphType: plot.graphType,
//                     id: `${plot.label}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                     type: 'equity',
//                     sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                 }));
//                 return {
//                     ...prev,
//                     [activeTab]: { ...currentTab, general: [...currentSection, ...newItems] },
//                 };
//             });

//             setDragCountMap((prev) => {
//                 const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//                 plotsToAdd.forEach((plot) => {
//                     updated[activeTab][plot.label] = (updated[activeTab][plot.label] || 0) + 1;
//                 });
//                 return updated;
//             });

//             setHasUnsavedChanges(true);
//             toast.success(`Sample Dashboard is added by showing the for ${topCompany.CompanyName}`);
//         } catch (err) {
//             setError('Failed to fetch top company plots.');
//             toast.error('Failed to fetch top company plots.');
//         }
//     };

//     const renderPlot = (plotItem, index, allItems) => {
//         const { label, symbol, companyName, id, uploadId, platform, type } = plotItem;
//         const ComponentMap = type === 'equity' ? equityHubMap : portfolioMap;
//         const Component = ComponentMap[label];

//         if (!Component) {
//             return (
//                 <motion.div
//                     key={`general-${id}`}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                     className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-200 dark:border-red-800/50 h-full"
//                 >
//                     <button
//                         onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//                         className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                         aria-label="Delete component"
//                     >
//                         <IoMdClose size={18} />
//                     </button>
//                     <div className="text-center py-8">
//                         <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <IoMdClose className="text-red-500 text-xl" />
//                         </div>
//                         <p className="text-red-500 font-medium">Component "{label}" not found</p>
//                     </div>
//                 </motion.div>
//             );
//         }

//         if (type === 'equity' && !symbol) {
//             return (
//                 <motion.div
//                     key={`general-${id}`}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                     className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-200 dark:border-yellow-800/50 h-full"
//                 >
//                     <button
//                         onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//                         className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                         aria-label="Delete component"
//                     >
//                         <IoMdClose size={18} />
//                     </button>
//                     <div className="text-center py-8">
//                         <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                         </div>
//                         <p className="text-yellow-600 dark:text-yellow-400 font-medium">Waiting for company selection</p>
//                         <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 text-sm mt-1">for {label}</p>
//                     </div>
//                 </motion.div>
//             );
//         }

//         return (
//             <motion.div
//                 key={`general-${id}`}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="relative bg-white dark:bg-[var(--background-dark)] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border)] dark:border-[var(--border-dark)] h-full group"
//             >
//                 <div className="flex items-center justify-between p-4 border-b border-[var(--border)] dark:border-[var(--border-dark)] bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-t-xl">
//                     <h3 className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate flex items-center gap-2">
//                         <span className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"></span>
//                         {label}
//                         <span className="text-xs text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                             {companyName ? `(${companyName})` : platform ? `(${platform})` : ''}
//                         </span>
//                     </h3>
//                     <button
//                         onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//                         className="p-1.5 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
//                         aria-label="Delete component"
//                     >
//                         <IoMdClose size={16} />
//                     </button>
//                 </div>

//                 <div className="p-4 min-h-[800px]">
//                     {type === 'equity' ? (
//                         <Component symbol={symbol} key={`${id}-${symbol}`} />
//                     ) : (
//                         <GraphDataProvider>
//                             <Component uploadId={uploadId} key={`${id}-${uploadId}`} />
//                         </GraphDataProvider>
//                     )}
//                 </div>

//                 <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/30 rounded-xl pointer-events-none transition-all duration-300" />
//             </motion.div>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background-dark)] flex flex-col transition-colors duration-300">
//             <style jsx>{`
//         :root {
//           --primary: #2563eb;
//           --primary-dark: #1e40af;
//           --secondary: #7c3aed;
//           --secondary-dark: #5b21b6;
//           --background: #f8fafc;
//           --background-dark: #0f172a;
//           --text: #1e293b;
//           --text-dark: #e2e8f0;
//           --border: #e5e7eb;
//           --border-dark: #374151;
//         }

//         html, body {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           line-height: 1.5;
//           color: var(--text);
//         }

//         .dark {
//           color: var(--text-dark);
//           background-color: var(--background-dark);
//         }

//         .scrollbar-thin {
//           scrollbar-width: thin;
//           scrollbar-color: var(--primary) var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar {
//           width: 8px;
//         }

//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary);
//           border-radius: 4px;
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border-dark);
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary-dark);
//         }

//         .tooltip {
//           position: relative;
//           display: inline-block;
//         }

//         .tooltip .tooltip-text {
//           visibility: hidden;
//           width: 200px;
//           background-color: #1e293b;
//           color: #fff;
//           text-align: center;
//           border-radius: 6px;
//           padding: 8px;
//           position: absolute;
//           z-index: 1000;
//           bottom: 125%;
//           left: 50%;
//           transform: translateX(-50%);
//           opacity: 0;
//           transition: opacity 0.3s;
//           font-size: 12px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .tooltip:hover .tooltip-text {
//           visibility: visible;
//           opacity: 1;
//         }

//         .dark .tooltip .tooltip-text {
//           background-color: #e2e8f0;
//           color: #1e293b;
//         }
//       `}</style>

//             <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[var(--background-dark)] shadow-sm">
//                 <Navbar
//                     handleNavClick={handleNavClick}
//                     hasUnsavedChanges={hasUnsavedChanges}
//                     setPendingNavigation={setPendingNavigation}
//                     setShowUnsavedModal={setShowUnsavedModal}
//                 />
//             </div>

//             <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//                 <div className="flex flex-1 mt-16">
//                     <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] z-40">
//                         <SidebarRight collapsed={collapsed} setCollapsed={setCollapsed} onItemClick={handleItemClick} />
//                     </div>

//                     {showModal && <AddNewModal onClose={() => setShowModal(false)} onCreateTab={handleNewDashboard} />}

//                     <div
//                         className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'pr-14' : 'pr-80'
//                             } overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin`}
//                     >
//                         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                             <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg rounded-xl p-2 dark:border-[var(--border-dark)] shadow-sm">
//                                 {tabs.map((tab) => (
//                                     <div
//                                         key={tab}
//                                         className="flex items-center bg-[var(--background)] dark:bg-[var(--background-dark)] px-3 py-1.5 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                                     >
//                                         {editingTab === tab ? (
//                                             <div className="flex items-center gap-2">
//                                                 <input
//                                                     type="text"
//                                                     value={editedTabName}
//                                                     onChange={(e) => setEditedTabName(e.target.value)}
//                                                     onKeyDown={(e) => e.key === 'Enter' && handleRenameTab(tab, editedTabName)}
//                                                     className="w-32 px-2 py-1 bg-white dark:bg-[var(--background-dark)] border border-[var(--border)] dark:border-[var(--border-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
//                                                     autoFocus
//                                                 />
//                                                 <button
//                                                     onClick={() => handleRenameTab(tab, editedTabName)}
//                                                     className="p-1 text-green-600 hover:text-green-700 transition-colors"
//                                                     title="Save"
//                                                 >
//                                                     <IoMdSave size={16} />
//                                                 </button>
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-center gap-2">
//                                                 <button
//                                                     onClick={() => handleTabSwitch(tab)}
//                                                     className={`text-sm font-medium transition-all duration-200 ${activeTab === tab
//                                                         ? 'text-[var(--primary)]'
//                                                         : 'text-[var(--text)] dark:text-[var(--text-dark)] hover:text-[var(--primary)]'
//                                                         }`}
//                                                 >
//                                                     {tab}
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setEditingTab(tab);
//                                                         setEditedTabName(tab);
//                                                     }}
//                                                     className="p-1 text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors"
//                                                     title="Rename"
//                                                 >
//                                                     <MdOutlineDriveFileRenameOutline size={16} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDeleteDashboardAPI(tab)}
//                                                     className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors"
//                                                     title="Delete"
//                                                 >
//                                                     <IoMdClose size={16} />
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}

//                                 <div className="flex items-center gap-3">
//                                     <button
//                                         onClick={() => {
//                                             setShowSavedModal(false);
//                                             if (hasUnsavedChanges) {
//                                                 setPendingNavigation({ label: 'addDashboard', path: null });
//                                                 setShowUnsavedModal(true);
//                                                 return;
//                                             }
//                                             setShowModal(true);
//                                             setIsMenuOpen(false);
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                                         data-tour="dashboard-add"
//                                     >
//                                         <MdOutlineDashboardCustomize size={18} /> Add Dashboard
//                                     </button>

//                                     <button
//                                         onClick={handleSaveDashboard}
//                                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                                         data-tour="dashboard-save"
//                                     >
//                                         <BiSolidSave size={18} /> Save
//                                     </button>

//                                     <div className="relative inline-block">
//                                         <button
//                                             onClick={handleTopCompanyClick}
//                                             className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-semibold"
//                                             data-tour="top-company"
//                                         >
//                                             <FaRocket size={18} /> Market Leader
//                                             <div className="absolute bottom-0 right-0 group">
//                                                 <FaInfoCircle size={14} className="text-white/80 cursor-pointer" />
//                                                 <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                     Adds MACD, Sensex Calculator, and Candlestick plots.
//                                                 </span>
//                                             </div>
//                                         </button>
//                                     </div>

//                                     <button
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             setShowSavedModal(false);
//                                             if (!isLoggedIn) {
//                                                 toast.error('Login first to see your dashboards.');
//                                                 return;
//                                             }
//                                             handleNavClick('Saved Dashboards', '/savedDashboard');
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                                         data-tour="dashboard-saved"
//                                     >
//                                         <BiSolidSave size={18} /> Saved Dashboards
//                                     </button>
//                                 </div>
//                             </div>

//                             {getUniqueCompanies().length > 0 ? (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="flex flex-wrap gap-3 items-center mb-6 bg-white/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg rounded-xl p-4 border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                                 >
//                                     <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] bg-[var(--border)] dark:bg-[var(--border-dark)] px-3 py-1 rounded-full">
//                                         Selected Stocks:
//                                     </span>
//                                     {getUniqueCompanies().map((companyName) => (
//                                         <motion.div
//                                             key={companyName}
//                                             initial={{ scale: 0.8, opacity: 0 }}
//                                             animate={{ scale: 1, opacity: 1 }}
//                                             className="flex items-center gap-2 px-3 py-1.5 bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                                         >
//                                             <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate max-w-[120px]">
//                                                 {companyName}
//                                             </span>
//                                             <button
//                                                 onClick={() => handleClearCompany(companyName)}
//                                                 className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                                                 title="Remove"
//                                             >
//                                                 <IoMdClose size={14} />
//                                             </button>
//                                         </motion.div>
//                                     ))}
//                                 </motion.div>
//                             ) : (
//                                 <motion.p
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     className="text-sm text-[var(--text)]/60 dark:text-[var(--text-dark)]/60 mb-6 text-center py-4 bg-white/30 dark:bg-[var(--background-dark)]/30 rounded-xl border border-dashed border-[var(--border)] dark:border-[var(--border-dark)]"
//                                 >
//                                     No stocks selected. Add stocks from the sidebar to get started!
//                                 </motion.p>
//                             )}
//                         </div>

//                         <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
//                             <section className="space-y-6">
//                                 <div className="text-center">
//                                     <motion.h2
//                                         initial={{ opacity: 0, y: -20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="text-2xl font-semibold bg-sky-700 bg-clip-text text-transparent"
//                                     >
//                                         Interactive Whiteboard
//                                     </motion.h2>
//                                     <motion.p
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         transition={{ delay: 0.1 }}
//                                         className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mt-2 text-sm"
//                                     >
//                                         Drag components from the sidebar and resize plots using the handles
//                                     </motion.p>
//                                 </div>

//                                 <DroppableArea id="general">
//                                     {(() => {
//                                         const droppedItems = droppedMap?.[activeTab]?.general || [];
//                                         const visibleItems = getVisibleItems(
//                                             droppedItems.map((item) => ({
//                                                 ...item,
//                                                 sortableId: item.sortableId || `item-${item.id}`,
//                                             }))
//                                         );

//                                         if (visibleItems.length === 0) {
//                                             return (
//                                                 <motion.div
//                                                     initial={{ opacity: 0, scale: 0.95 }}
//                                                     animate={{ opacity: 1, scale: 1 }}
//                                                     className="flex flex-col items-center py-20 min-h-[900px] px-4 bg-white/50 dark:bg-[var(--background-dark)]/50 rounded-2xl border-2 border-dashed border-[var(--border)] dark:border-[var(--border-dark)] shadow-inner"
//                                                 >
//                                                     <motion.div
//                                                         animate={{
//                                                             y: [0, -10, 0],
//                                                             rotate: [0, 5, -5, 0],
//                                                         }}
//                                                         transition={{
//                                                             duration: 4,
//                                                             repeat: Infinity,
//                                                             ease: 'easeInOut',
//                                                         }}
//                                                         className="mb-6"
//                                                     >
//                                                         <svg
//                                                             className="h-20 w-20 text-[var(--primary)]/60"
//                                                             fill="none"
//                                                             stroke="currentColor"
//                                                             viewBox="0 0 24 24"
//                                                         >
//                                                             <path
//                                                                 strokeLinecap="round"
//                                                                 strokeLinejoin="round"
//                                                                 strokeWidth="1.5"
//                                                                 d="M4 8v8m0 0h8m-8 0l8-8m4 8v-8m0 0H8m8 0l-8 8"
//                                                             />
//                                                         </svg>
//                                                     </motion.div>
//                                                     <h3 className="text-xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                                                         Your Whiteboard Awaits!
//                                                     </h3>
//                                                     <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 text-center max-w-md">
//                                                         Drag and drop components from the sidebar to start building your dashboard.
//                                                         Resize plots using the visible handles for optimal layout.
//                                                     </p>
//                                                     <motion.button
//                                                         whileHover={{ scale: 1.05 }}
//                                                         whileTap={{ scale: 0.95 }}
//                                                         onClick={() => setCollapsed(false)}
//                                                         className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg font-medium"
//                                                     >
//                                                         <GoSidebarExpand size={20} /> Open Sidebar
//                                                     </motion.button>
//                                                 </motion.div>
//                                             );
//                                         }

//                                         const firstTwo = visibleItems.slice(0, 2);
//                                         const remaining = visibleItems.slice(2);
//                                         const hasRemaining = remaining.length > 0;

//                                         return (
//                                             <SortableContext items={visibleItems.map((item) => item.sortableId)} strategy={() => null}>
//                                                 <PanelGroup
//                                                     direction={hasRemaining ? 'vertical' : 'horizontal'}
//                                                     className="min-h-[800px] rounded-2xl bg-white/30 backdrop-blur-sm"
//                                                     onLayout={() => setResizing(false)}
//                                                 >
//                                                     <Panel defaultSize={hasRemaining ? 50 : 100} minSize={50}>
//                                                         <PanelGroup direction="horizontal">
//                                                             {firstTwo.map((item, idx) => (
//                                                                 <React.Fragment key={`first-${item.id}`}>
//                                                                     {idx > 0 && (
//                                                                         <PanelResizeHandle onDragging={setResizing}>
//                                                                             <ResizeHandle direction="horizontal" />
//                                                                         </PanelResizeHandle>
//                                                                     )}
//                                                                     <Panel defaultSize={50 / firstTwo.length} minSize={30}>
//                                                                         <Draggable id={item.sortableId}>
//                                                                             {renderPlot(item, idx, visibleItems)}
//                                                                         </Draggable>
//                                                                     </Panel>
//                                                                 </React.Fragment>
//                                                             ))}
//                                                         </PanelGroup>
//                                                     </Panel>
//                                                     {hasRemaining && (
//                                                         <>
//                                                             <PanelResizeHandle onDragging={setResizing}>
//                                                                 <ResizeHandle direction="vertical" />
//                                                             </PanelResizeHandle>
//                                                             <Panel defaultSize={50} minSize={30}>
//                                                                 <PanelGroup direction="horizontal">
//                                                                     {remaining.map((item, idx) => (
//                                                                         <React.Fragment key={`rem-${item.id}`}>
//                                                                             {idx > 0 && (
//                                                                                 <PanelResizeHandle onDragging={setResizing}>
//                                                                                     <ResizeHandle direction="horizontal" />
//                                                                                 </PanelResizeHandle>
//                                                                             )}
//                                                                             <Panel defaultSize={100 / remaining.length} minSize={30}>
//                                                                                 <Draggable id={item.sortableId}>
//                                                                                     {renderPlot(item, idx + 2, visibleItems)}
//                                                                                 </Draggable>
//                                                                             </Panel>
//                                                                         </React.Fragment>
//                                                                     ))}
//                                                                 </PanelGroup>
//                                                             </Panel>
//                                                         </>
//                                                     )}
//                                                 </PanelGroup>
//                                             </SortableContext>
//                                         );
//                                     })()}
//                                 </DroppableArea>
//                             </section>
//                         </main>
//                     </div>

//                     <AnimatePresence>
//                         {showUnsavedModal && (
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
//                             >
//                                 <motion.div
//                                     initial={{ scale: 0.9, opacity: 0 }}
//                                     animate={{ scale: 1, opacity: 1 }}
//                                     exit={{ scale: 0.9, opacity: 0 }}
//                                     className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//                                 >
//                                     <div className="text-center ">
//                                         <div className="w-16 h- bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                                             <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth="2"
//                                                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
//                                                 />
//                                             </svg>
//                                         </div>
//                                         <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                                             Unsaved Changes
//                                         </h2>
//                                         <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                                             You have unsaved changes. Would you like to save before{' '}
//                                             {pendingNavigation ? `navigating to ${pendingNavigation.label}` : pendingTab ? `switching to ${pendingTab}` : 'leaving'}?
//                                         </p>
//                                     </div>
//                                     <div className="flex gap-3">
//                                         <button
//                                             onClick={handleSaveAndNavigate}
//                                             className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md"
//                                         >
//                                             Save & Continue
//                                         </button>
//                                         <button
//                                             onClick={handleConfirmNavigation}
//                                             className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md"
//                                         >
//                                             Leave Anyway
//                                         </button>
//                                     </div>
//                                     <button
//                                         onClick={handleCancelNavigation}
//                                         className="w-full mt-3 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-colors"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </motion.div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     {showSavedModal && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//                         >
//                             <motion.div
//                                 initial={{ scale: 0.9, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 exit={{ scale: 0.9, opacity: 0 }}
//                                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)] text-center"
//                             >
//                                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <BiSolidSave className="w-8 h-8 text-green-500" />
//                                 </div>
//                                 <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">Dashboard Saved!</h2>
//                                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                                     Your changes have been saved successfully.
//                                 </p>
//                             </motion.div>
//                         </motion.div>
//                     )}

//                     <DragStartModal
//                         isOpen={showDragModal}
//                         onClose={() => {
//                             setShowDragModal(false);
//                             setCurrentDragItem(null);
//                             setError(null);
//                         }}
//                         onSearch={handleStockSearch}
//                         searchTerm={searchTerm}
//                         setSearchTerm={(value) => {
//                             setSearchTerm(value);
//                             setError(null);
//                             if (value.length >= 2) handleStockSearch();
//                             else setSearchedStocks([]);
//                         }}
//                         searchedStocks={searchedStocks}
//                         onSelectItem={(item) => {
//                             if (currentDragItem) {
//                                 setDroppedMap((prev) => {
//                                     const currentTab = prev[activeTab] || { general: [] };
//                                     const generalItems = currentTab.general || [];
//                                     const lastItemIndex = generalItems.findLastIndex(
//                                         (i) => i.label === currentDragItem.label && !i.symbol
//                                     );
//                                     if (lastItemIndex >= 0) {
//                                         const updatedItems = [...generalItems];
//                                         updatedItems[lastItemIndex] = {
//                                             ...updatedItems[lastItemIndex],
//                                             symbol: item.symbol,
//                                             companyName: item.companyName,
//                                             type: 'equity',
//                                             sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                                         };
//                                         return { ...prev, [activeTab]: { ...currentTab, general: updatedItems } };
//                                     } else {
//                                         const newItem = {
//                                             label: currentDragItem.label,
//                                             symbol: item.symbol,
//                                             companyName: item.companyName,
//                                             graphType: currentDragItem.label,
//                                             id: `${currentDragItem.label}-${Date.now()}`,
//                                             type: 'equity',
//                                             sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                                         };
//                                         return { ...prev, [activeTab]: { ...currentTab, general: [...generalItems, newItem] } };
//                                     }
//                                 });
//                                 setDragCountMap((prev) => ({
//                                     ...prev,
//                                     [activeTab]: {
//                                         ...prev[activeTab],
//                                         [currentDragItem.label]: (prev[activeTab]?.[currentDragItem.label] || 0) + 1,
//                                     },
//                                 }));
//                                 setHasUnsavedChanges(true);
//                             }
//                             setSearchTerm('');
//                             setSearchedStocks([]);
//                             setShowDragModal(false);
//                             setCurrentDragItem(null);
//                             setError(null);
//                         }}
//                         onClear={() => {
//                             setSearchTerm('');
//                             setSearchedStocks([]);
//                             setError(null);
//                         }}
//                         selectedCompany={null}
//                         error={error}
//                     />

//                     <PortfolioSelectModal
//                         isOpen={showPortfolioModal}
//                         onClose={() => {
//                             setShowPortfolioModal(false);
//                             setCurrentDragItem(null);
//                             setError(null);
//                         }}
//                         portfolios={savedPortfolios}
//                         onSelectPortfolio={handlePortfolioSelect}
//                         error={error}
//                     />

//                     {showDeleteModal && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//                         >
//                             <motion.div
//                                 initial={{ scale: 0.9, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 exit={{ scale: 0.9, opacity: 0 }}
//                                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//                             >
//                                 <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-4">
//                                     Confirm Deletion
//                                 </h2>
//                                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mb-6">
//                                     Are you sure you want to delete your account? This action cannot be undone.
//                                 </p>
//                                 <div className="flex gap-4">
//                                     <button
//                                         onClick={handleDeleteAccount}
//                                         className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
//                                     >
//                                         Delete
//                                     </button>
//                                     <button
//                                         onClick={() => setShowDeleteModal(false)}
//                                         className="flex-1 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-all duration-300"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     )}
//                 </div>
//             </DndContext>
//         </div>
//     );
// };

// export default DashBoard;



// -----------------wc  03/10/2025   -------------------------

// import React, { useEffect, useState, useRef } from 'react';
// import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
// import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import Navbar from '../Navbar';
// import { MdOutlineDashboardCustomize, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
// import { BiSolidSave } from 'react-icons/bi';
// import { IoMdClose, IoMdSave } from 'react-icons/io';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Modal from 'react-modal';
// import SidebarRight from './SidebarRight';
// import AddNewModal from './AddNewModal';
// import DragStartModal from './DragStartModal';
// import DroppableArea from './DroppableArea';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { GoSidebarExpand } from 'react-icons/go';
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';
// import PortfolioSelectModal from './PortfolioSelectModal';
// import { Search } from 'lucide-react';
// import SearchList from '../EquityHub/SearchList';
// import { useAuth } from '../AuthContext';
// import { CiLogout } from 'react-icons/ci';
// import { logActivity } from '../../services/api';
// import { IoMdArrowDropdown } from 'react-icons/io';
// import axios from 'axios';
// import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
// import { FaChartLine, FaBriefcase, FaInfoCircle, FaRocket } from 'react-icons/fa';
// import DraggableItem from './DraggableItem';
// import ResizeHandle from './ResizeHandle';

// Modal.setAppElement('#root');

// // Custom Draggable component
// const Draggable = ({ id, children }) => {
//     const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//     };

//     return (
//         <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//             {children}
//         </div>
//     );
// };

// // Custom ResizeHandle component
// // const ResizeHandle = ({ direction = 'horizontal' }) => (
// //     <div
// //         className={`
// //       relative group transition-all duration-200
// //       ${direction === 'horizontal' ? 'w-2 h-full mx-1' : 'h-2 w-full my-1'}
// //     `}
// //     >
// //         <div
// //             className={`
// //         absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10
// //         rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
// //       `}
// //         />
// //         <div
// //             className={`
// //         absolute inset-0 flex items-center justify-center
// //         ${direction === 'horizontal' ? 'flex-col' : 'flex-row'}
// //       `}
// //         >
// //             <div
// //                 className={`
// //           bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full
// //           transition-all duration-200 group-hover:scale-110
// //           ${direction === 'horizontal' ? 'w-1 h-8' : 'h-1 w-8'}
// //         `}
// //             />
// //         </div>
// //     </div>
// // );

// const DashBoard = () => {
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const [showModal, setShowModal] = useState(false);
//     const [tabs, setTabs] = useState(['Dashboard 1']);
//     const [activeTab, setActiveTab] = useState('Dashboard 1');
//     const [uploadId, setUploadId] = useState(null);
//     const [platform, setPlatform] = useState('');
//     const [symbol, setSymbol] = useState(null);
//     const [savedStocks, setSavedStocks] = useState([]);
//     const [savedPortfolios, setSavedPortfolios] = useState([]);
//     const [droppedMap, setDroppedMap] = useState({ 'Dashboard 1': { general: [] } });
//     const [savedDroppedMap, setSavedDroppedMap] = useState({});
//     const [editingTab, setEditingTab] = useState(null);
//     const [editedTabName, setEditedTabName] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchedStocks, setSearchedStocks] = useState([]);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [showDragModal, setShowDragModal] = useState(false);
//     const [showPortfolioModal, setShowPortfolioModal] = useState(false);
//     const [collapsed, setCollapsed] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [dragCountMap, setDragCountMap] = useState({ 'Dashboard 1': {} });
//     const [currentDragItem, setCurrentDragItem] = useState(null);
//     const [error, setError] = useState(null);
//     const [showUnsavedModal, setShowUnsavedModal] = useState(false);
//     const [showSavedModal, setShowSavedModal] = useState(false);
//     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//     const [pendingNavigation, setPendingNavigation] = useState(null);
//     const [pendingTab, setPendingTab] = useState(null);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const queryParams = new URLSearchParams(location.search);
//     const [sticky, setSticky] = useState(false);
//     const [userType, setUserType] = useState(null);
//     const [fullName, setFullName] = useState('');
//     const initialQuery = queryParams.get('query') || '';
//     const [isDisabled, setIsDisabled] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [results, setResults] = useState([]);
//     const { login, logout } = useAuth();
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
//     const drawerRef = useRef(null);
//     const [resizing, setResizing] = useState(false);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (!event.target.closest('#portfolio-dropdown')) {
//                 setIsPortfolioOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     useEffect(() => {
//         const handleScroll = () => setSticky(window.scrollY > 0);
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     useEffect(() => {
//         const currentTab = droppedMap[activeTab] || { general: [] };
//         const savedTab = savedDroppedMap[activeTab] || { general: [] };
//         const hasChanges = JSON.stringify(currentTab.general) !== JSON.stringify(savedTab.general);
//         setHasUnsavedChanges(hasChanges);
//     }, [droppedMap, activeTab, savedDroppedMap]);

//     useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         if (token) setIsLoggedIn(true);
//     }, []);

//     useEffect(() => {
//         const storedUploadId = localStorage.getItem('uploadId');
//         const storedPlatform = localStorage.getItem('platform');
//         if (storedUploadId && storedPlatform) {
//             setUploadId(storedUploadId);
//             setPlatform(storedPlatform);
//         }
//     }, []);

//     const fetchSavedPortfolio = async () => {
//         try {
//             setError('');
//             const token = localStorage.getItem('authToken');
//             if (!token) {
//                 setError('Please login to view your portfolios');
//                 return;
//             }
//             const response = await fetch(`${API_BASE}/file/saved`, {
//                 method: 'GET',
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) {
//                 const err = await response.json();
//                 setError(err.error || 'Failed to fetch saved portfolios');
//                 return;
//             }
//             const data = await response.json();
//             if (data.length > 0) {
//                 setSavedPortfolios(data);
//                 setUploadId(data[0].uploadId);
//                 setPlatform(data[0].platform);
//             } else {
//                 setSavedPortfolios([]);
//                 setError('No portfolios found');
//             }
//         } catch (err) {
//             console.error('Error fetching saved portfolios:', err);
//             setError('Network error. Please try again later.');
//         }
//     };

//     useEffect(() => {
//         fetchSavedPortfolio();
//     }, [API_BASE]);

//     const handleStockSearch = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${API_BASE}/stocks/test/search?query=${searchTerm}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const data = await response.json();
//             if (Array.isArray(data) && data.length > 0) {
//                 setSearchedStocks(data);
//                 setSavedStocks(data);
//             } else {
//                 setSearchedStocks([]);
//                 toast.info('No stocks found for the search term.');
//                 setError('Company not found');
//             }
//         } catch (err) {
//             console.error('Error fetching stock suggestions:', err);
//             setSearchedStocks([]);
//             setError('Company not found in our list. Please check the name and search again.');
//         }
//     };

//     const handleRenameTab = (oldName, newName) => {
//         if (!newName || newName.trim() === '') return;
//         if (tabs.includes(newName)) {
//             toast.info('A dashboard with this name already exists.');
//             return;
//         }
//         setTabs((prevTabs) => prevTabs.map((tab) => (tab === oldName ? newName : tab)));
//         setDroppedMap((prev) => {
//             const updated = { ...prev };
//             updated[newName] = prev[oldName];
//             delete updated[oldName];
//             return updated;
//         });
//         setSavedDroppedMap((prev) => {
//             const updated = { ...prev };
//             updated[newName] = prev[oldName];
//             delete updated[oldName];
//             return updated;
//         });
//         setDragCountMap((prev) => {
//             const updated = { ...prev };
//             updated[newName] = prev[oldName];
//             delete updated[oldName];
//             return updated;
//         });
//         if (activeTab === oldName) setActiveTab(newName);
//         setEditingTab(null);
//         setEditedTabName('');
//     };

//     const handleDeleteComponent = (index) => {
//         setDroppedMap((prev) => {
//             const updated = { ...prev };
//             updated[activeTab] = {
//                 ...prev[activeTab],
//                 general: prev[activeTab].general.filter((_, idx) => idx !== index),
//             };
//             return updated;
//         });
//         const label = droppedMap[activeTab].general[index].label;
//         const remaining = droppedMap[activeTab].general.filter((item, idx) => idx !== index && item.label === label);
//         if (remaining.length === 0) {
//             setDragCountMap((prev) => ({
//                 ...prev,
//                 [activeTab]: { ...prev[activeTab], [label]: 0 },
//             }));
//         }
//         setHasUnsavedChanges(true);
//     };

//     const handleClearCompany = (companyName) => {
//         setDroppedMap((prev) => ({
//             ...prev,
//             [activeTab]: {
//                 ...prev[activeTab],
//                 general: prev[activeTab].general.filter((item) => item.companyName !== companyName),
//             },
//         }));
//         const affectedLabels = droppedMap[activeTab].general
//             .filter((item) => item.companyName === companyName)
//             .map((item) => item.label);
//         setDragCountMap((prev) => {
//             const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//             affectedLabels.forEach((label) => {
//                 const remaining = droppedMap[activeTab].general.filter(
//                     (item) => item.label === label && item.companyName !== companyName
//                 );
//                 updated[activeTab][label] = remaining.length > 0 ? prev[activeTab][label] || 1 : 0;
//             });
//             return updated;
//         });
//         toast.success(`Company ${companyName} and associated graphs removed`);
//         setHasUnsavedChanges(true);
//     };

//     const generateDefaultDashboardName = async (baseName = 'Dashboard') => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Failed to fetch dashboards');
//             const data = await response.json();
//             const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//             let index = 1;
//             let defaultName;
//             do {
//                 defaultName = `${baseName} ${index}`;
//                 index++;
//             } while (existingNames.includes(defaultName) || tabs.includes(defaultName));
//             return defaultName;
//         } catch (err) {
//             console.error('Error fetching dashboards for name generation:', err);
//             let index = 1;
//             let defaultName;
//             do {
//                 defaultName = `${baseName} ${index}`;
//                 index++;
//             } while (tabs.includes(defaultName));
//             return defaultName;
//         }
//     };

//     const handleNewDashboard = async (title) => {
//         const newTitle = title && title.trim() ? title : await generateDefaultDashboardName();
//         if (tabs.includes(newTitle)) {
//             toast.info('A dashboard with this name already exists.');
//             return;
//         }
//         setTabs((prev) => [...prev, newTitle]);
//         setDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//         setSavedDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//         setActiveTab(newTitle);
//         setShowModal(false);
//         setDragCountMap((prev) => ({ ...prev, [newTitle]: {} }));
//         setIsMenuOpen(false);
//         setHasUnsavedChanges(false);
//     };

//     const handleDragStart = (event) => {
//         const { active } = event;
//         const label = active?.data?.current?.label;
//         setCurrentDragItem(active?.data?.current);
//         const equityLabels = Object.keys(equityHubMap);
//         const portfolioLabels = Object.keys(portfolioMap);
//         if (equityLabels.includes(label)) {
//             const currentDragCount = dragCountMap[activeTab]?.[label] || 0;
//             if (currentDragCount === 0 && !droppedMap[activeTab].general.some((item) => item.label === label)) {
//                 setShowDragModal(true);
//             } else if (currentDragCount >= 1) {
//                 setShowDragModal(true);
//             }
//         } else if (portfolioLabels.includes(label)) {
//             setShowPortfolioModal(true);
//         }
//     };

//     const handleItemClick = (item) => {
//         const { id, label } = item;
//         const equityLabels = Object.keys(equityHubMap);
//         const portfolioLabels = Object.keys(portfolioMap);

//         let section = null;
//         if (equityLabels.includes(label)) section = 'equity';
//         if (portfolioLabels.includes(label)) section = 'portfolio';

//         if (section === 'equity') {
//             setCurrentDragItem({ label });
//             setShowDragModal(true);
//             return;
//         }

//         if (section === 'portfolio') {
//             setCurrentDragItem({ label });
//             setShowPortfolioModal(true);
//             return;
//         }
//     };

//     const handleDragEnd = (event) => {
//         const { over, active } = event;
//         const label = active?.data?.current?.label;
//         const id = active?.id;

//         // Handle reordering of existing items
//         if (active.data.current?.sortable) {
//             const items = droppedMap[activeTab]?.general || [];
//             const oldIndex = items.findIndex((item) => item.sortableId === active.id);
//             const newIndex = items.findIndex((item) => item.sortableId === over?.id);
//             if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//                 setDroppedMap((prev) => ({
//                     ...prev,
//                     [activeTab]: {
//                         ...prev[activeTab],
//                         general: arrayMove(prev[activeTab].general, oldIndex, newIndex),
//                     },
//                 }));
//                 setHasUnsavedChanges(true);
//             }
//             return;
//         }

//         // Handle new item drop
//         if (!over || !label || !id) return;

//         const equityLabels = Object.keys(equityHubMap);
//         const portfolioLabels = Object.keys(portfolioMap);

//         if (equityLabels.includes(label)) {
//             setCurrentDragItem(active?.data?.current);
//             setShowDragModal(true);
//             return;
//         }

//         if (portfolioLabels.includes(label)) {
//             setCurrentDragItem(active?.data?.current);
//             setShowPortfolioModal(true);
//             return;
//         }
//     };

//     const handlePortfolioSelect = (portfolio) => {
//         if (currentDragItem) {
//             const draggedItem = {
//                 label: currentDragItem.label,
//                 symbol: '',
//                 companyName: '',
//                 graphType: currentDragItem.label,
//                 uploadId: portfolio.uploadId,
//                 platform: portfolio.platform,
//                 id: `${currentDragItem.label}-${Date.now()}`,
//                 type: 'portfolio',
//                 sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//             };

//             setDroppedMap((prev) => {
//                 const currentTab = prev[activeTab] || { general: [] };
//                 const currentSection = currentTab.general || [];
//                 return {
//                     ...prev,
//                     [activeTab]: { ...currentTab, general: [...currentSection, draggedItem] },
//                 };
//             });
//             setUploadId(portfolio.uploadId);
//             setPlatform(portfolio.platform);
//             localStorage.setItem('uploadId', portfolio.uploadId.toString());
//             localStorage.setItem('platform', portfolio.platform);
//             setShowPortfolioModal(false);
//             setCurrentDragItem(null);
//             setHasUnsavedChanges(true);
//         }
//     };

//     const getVisibleItems = (items) => items;

//     const handleSaveDashboard = async () => {
//         const token = localStorage.getItem('authToken');
//         const userId = localStorage.getItem('userId');
//         const userType = localStorage.getItem('userType');
//         const generalPlots = droppedMap?.[activeTab]?.general || [];

//         if (!token) {
//             toast.error('Please login first to save your dashboard.');
//             return;
//         }

//         if (generalPlots.length === 0) {
//             toast.error('Please drag and drop at least one plot before saving.');
//             return;
//         }

//         let finalDashboardName = activeTab;

//         try {
//             const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Failed to fetch dashboards');
//             const data = await response.json();
//             const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//             if (existingNames.includes(finalDashboardName)) {
//                 finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//                 setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//                 setDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setSavedDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = { general: generalPlots };
//                     if (activeTab !== finalDashboardName) delete updated[activeTab];
//                     return updated;
//                 });
//                 setDragCountMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setActiveTab(finalDashboardName);
//                 toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//             }
//         } catch (err) {
//             console.error('Error checking dashboard names:', err);
//             if (tabs.includes(finalDashboardName)) {
//                 finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//                 setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//                 setDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setSavedDroppedMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = { general: generalPlots };
//                     if (activeTab !== finalDashboardName) delete updated[activeTab];
//                     return updated;
//                 });
//                 setDragCountMap((prev) => {
//                     const updated = { ...prev };
//                     updated[finalDashboardName] = prev[activeTab];
//                     delete updated[activeTab];
//                     return updated;
//                 });
//                 setActiveTab(finalDashboardName);
//                 toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//             }
//         }

//         const savedData = {
//             dashboard: { dashboardName: finalDashboardName, userId: userId ? parseInt(userId) : 0, userType: userType || '' },
//             equityHubPlots: [],
//             portfolioPlots: [],
//         };

//         generalPlots.forEach(({ label, symbol, companyName, graphType, uploadId, platform, type }) => {
//             if (type === 'equity') {
//                 let finalSymbol = symbol;
//                 let finalCompany = companyName;

//                 if (!finalSymbol || !finalCompany) {
//                     const matched = savedStocks.find(
//                         (stock) => stock.symbol === finalSymbol || stock.graphType === graphType || stock.label === label
//                     );
//                     if (matched) {
//                         finalSymbol = finalSymbol || matched.symbol;
//                         finalCompany = finalCompany || matched.companyName;
//                     }
//                 }

//                 savedData.equityHubPlots.push({ symbol: finalSymbol, companyName: finalCompany, graphType: graphType || label });
//             } else if (type === 'portfolio') {
//                 savedData.portfolioPlots.push({ uploadId, platform, graphType: label });
//             }
//         });

//         try {
//             const response = await fetch(`${API_BASE}/dashboard/save`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//                 body: JSON.stringify(savedData),
//             });
//             if (response.ok) {
//                 const result = await response.json();
//                 setSavedDroppedMap((prev) => ({
//                     ...prev,
//                     [finalDashboardName]: { general: generalPlots },
//                 }));
//                 setHasUnsavedChanges(false);
//                 setShowSavedModal(true);
//                 setTimeout(() => setShowSavedModal(false), 2000);
//             } else {
//                 toast.error('Failed to save dashboard');
//             }
//         } catch (err) {
//             console.error('Save failed:', err);
//             toast.error('Save failed');
//         }
//         setIsMenuOpen(false);
//     };

//     const handleDeleteDashboardAPI = async (dashboardName) => {
//         if (hasUnsavedChanges) {
//             setPendingTab(dashboardName);
//             setShowUnsavedModal(true);
//             return;
//         }
//         try {
//             const token = localStorage.getItem('authToken');
//             const response = await fetch(`${API_BASE}/dashboard/delete/${dashboardName}`, {
//                 method: 'DELETE',
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('Failed to delete dashboard');
//             setTabs((prev) => prev.filter((tab) => tab !== dashboardName));
//             setDroppedMap((prev) => {
//                 const updated = { ...prev };
//                 delete updated[dashboardName];
//                 return updated;
//             });
//             setSavedDroppedMap((prev) => {
//                 const updated = { ...prev };
//                 delete updated[dashboardName];
//                 return updated;
//             });
//             setDragCountMap((prev) => {
//                 const updated = { ...prev };
//                 delete updated[dashboardName];
//                 return updated;
//             });
//             if (activeTab === dashboardName) {
//                 const remainingTabs = tabs.filter((tab) => tab !== dashboardName);
//                 setActiveTab(remainingTabs[0] || '');
//             }
//             toast.success('Dashboard deleted successfully');
//             setIsMenuOpen(false);
//         } catch (err) {
//             console.error('Delete error:', err);
//             toast.error('Failed to delete dashboard');
//         }
//     };

//     const getUniqueCompanies = () => {
//         const generalItems = droppedMap[activeTab]?.general || [];
//         return [...new Set(generalItems.filter((item) => item.companyName).map((item) => item.companyName))];
//     };

//     const isDashboardEmpty = () => {
//         const currentTab = droppedMap[activeTab] || { general: [] };
//         return currentTab.general.length === 0;
//     };

//     const getCachedData = (key) => {
//         const cached = localStorage.getItem(key);
//         if (!cached) return null;
//         try {
//             const { data, timestamp } = JSON.parse(cached);
//             if (Date.now() - timestamp > 3600000) {
//                 // 1 hour TTL
//                 localStorage.removeItem(key);
//                 return null;
//             }
//             return data;
//         } catch (err) {
//             setError('Failed to parse cached data.');
//             console.error('Cache parse error:', err);
//             return null;
//         }
//     };

//     const setCachedData = (key, data) => {
//         try {
//             localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//         } catch (err) {
//             setError('Failed to cache data.');
//             console.error('Cache set error:', err);
//         }
//     };

//     const handleClearSearch = () => {
//         setSearchQuery('');
//         setResults([]);
//         setError(null);
//     };

//     const handleLoginClick = () => setShowLoginModal(true);
//     const handleCloseModal = () => setShowLoginModal(false);
//     const handleLoginSuccess = () => {
//         login();
//         handleCloseModal();
//     };

//     const handleLogout = () => {
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label: 'logout', path: '/' });
//             setShowUnsavedModal(true);
//             setShowSavedModal(false);
//             return;
//         }
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logout successfully!');
//         navigate('/');
//     };

//     const handleDeleteAccount = async () => {
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label: 'deleteAccount', path: '/' });
//             setShowUnsavedModal(true);
//             setShowSavedModal(false);
//             return;
//         }
//         const apiUrl =
//             userType === "corporate"
//                 ? `${API_BASE}/corporate/delete-account`
//                 : `${API_BASE}/Userprofile/delete-account`;


//         try {
//             await axios.delete(apiUrl, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             toast.success('Account deleted successfully');
//             localStorage.removeItem('authToken');
//             localStorage.removeItem('userType');
//             localStorage.removeItem('hasShownQuizPopup');
//             logout();
//             navigate('/');
//             setShowDeleteModal(false);
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to delete account');
//         }
//     };

//     const handleNavClick = async (label, path, state = {}) => {
//         setShowSavedModal(false);
//         if (hasUnsavedChanges) {
//             setPendingNavigation({ label, path, state });
//             setShowUnsavedModal(true);
//         } else {
//             await logActivity(`${label} tab clicked`);
//             navigate(path, { state });
//         }
//     };

//     const handleTabSwitch = (tab) => {
//         setShowSavedModal(false);
//         if (hasUnsavedChanges && activeTab !== tab) {
//             setPendingTab(tab);
//             setShowUnsavedModal(true);
//         } else {
//             setActiveTab(tab);
//             setIsMenuOpen(false);
//         }
//     };

//     const handleConfirmNavigation = async () => {
//         setShowUnsavedModal(false);
//         setShowSavedModal(false);
//         if (pendingNavigation) {
//             if (pendingNavigation.label === 'logout') {
//                 localStorage.removeItem('authToken');
//                 localStorage.removeItem('userType');
//                 localStorage.removeItem('userEmail');
//                 logout();
//                 toast.success('Logout successfully!');
//                 navigate('/');
//             } else if (pendingNavigation.label === 'deleteAccount') {
//                 await handleDeleteAccount();
//             } else if (pendingNavigation.label === 'addDashboard') {
//                 setShowModal(true);
//                 setIsMenuOpen(false);
//             } else {
//                 await logActivity(`${pendingNavigation.label} tab clicked`);
//                 navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//             }
//             setPendingNavigation(null);
//         } else if (pendingTab) {
//             setActiveTab(pendingTab);
//             setPendingTab(null);
//             setIsMenuOpen(false);
//         }
//     };

//     const handleCancelNavigation = () => {
//         setShowUnsavedModal(false);
//         setShowSavedModal(false);
//         setPendingNavigation(null);
//         setPendingTab(null);
//     };

//     const handleSaveAndNavigate = async () => {
//         setShowUnsavedModal(false);
//         setShowSavedModal(false);
//         await handleSaveDashboard();
//         setShowSavedModal(false);
//         if (pendingNavigation) {
//             if (pendingNavigation.label === 'logout') {
//                 localStorage.removeItem('authToken');
//                 localStorage.removeItem('userType');
//                 localStorage.removeItem('userEmail');
//                 logout();
//                 toast.success('Logout successfully!');
//                 navigate('/');
//             } else if (pendingNavigation.label === 'deleteAccount') {
//                 await handleDeleteAccount();
//             } else if (pendingNavigation.label === 'addDashboard') {
//                 setShowModal(true);
//                 setIsMenuOpen(false);
//             } else {
//                 await logActivity(`${pendingNavigation.label} tab clicked`);
//                 navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//             }
//             setPendingNavigation(null);
//         } else if (pendingTab) {
//             setActiveTab(pendingTab);
//             setPendingTab(null);
//             setIsMenuOpen(false);
//         }
//     };

//     const sensors = useSensors(
//         useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
//         useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
//     );

//     const handleTopCompanyClick = async () => {
//         try {
//             const apiUrl = `${API_BASE}/market/top-company`;
//             const response = await fetch(apiUrl, {
//                 method: 'GET',
//             });

//             if (!response.ok) {
//                 const err = await response.json();
//                 throw new Error(err.error || 'Failed to fetch top company');
//             }
//             const topCompany = await response.json();

//             if (!topCompany || !topCompany.Symbol || !topCompany.CompanyName) {
//                 toast.error('No top company data available.');
//                 return;
//             }

//             const plotsToAdd = [
//                 { label: 'MacdPlot', graphType: 'MacdPlot' },
//                 { label: 'SensexCalculator', graphType: 'SensexCalculator' },
//                 { label: 'CandlePatternPlot', graphType: 'CandlePatternPlot' },
//             ];

//             setDroppedMap((prev) => {
//                 const currentTab = prev[activeTab] || { general: [] };
//                 const currentSection = currentTab.general || [];
//                 const newItems = plotsToAdd.map((plot) => ({
//                     label: plot.label,
//                     symbol: topCompany.Symbol,
//                     companyName: topCompany.CompanyName,
//                     graphType: plot.graphType,
//                     id: `${plot.label}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                     type: 'equity',
//                     sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                 }));
//                 return {
//                     ...prev,
//                     [activeTab]: { ...currentTab, general: [...currentSection, ...newItems] },
//                 };
//             });

//             setDragCountMap((prev) => {
//                 const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//                 plotsToAdd.forEach((plot) => {
//                     updated[activeTab][plot.label] = (updated[activeTab][plot.label] || 0) + 1;
//                 });
//                 return updated;
//             });

//             setHasUnsavedChanges(true);
//             toast.success(`Sample Dashboard is added by showing the for ${topCompany.CompanyName}`);
//         } catch (err) {
//             setError('Failed to fetch top company plots.');
//             toast.error('Failed to fetch top company plots.');
//         }
//     };

//     const renderPlot = (plotItem, index, allItems) => {
//         const { label, symbol, companyName, id, uploadId, platform, type } = plotItem;
//         const ComponentMap = type === 'equity' ? equityHubMap : portfolioMap;
//         const Component = ComponentMap[label];

//         if (!Component) {
//             return (
//                 <motion.div
//                     key={`general-${id}`}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                     className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-200 dark:border-red-800/50 h-full"
//                 >
//                     <button
//                         onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//                         className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                         aria-label="Delete component"
//                     >
//                         <IoMdClose size={18} />
//                     </button>
//                     <div className="text-center py-8">
//                         <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <IoMdClose className="text-red-500 text-xl" />
//                         </div>
//                         <p className="text-red-500 font-medium">Component "{label}" not found</p>
//                     </div>
//                 </motion.div>
//             );
//         }

//         if (type === 'equity' && !symbol) {
//             return (
//                 <motion.div
//                     key={`general-${id}`}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                     className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-200 dark:border-yellow-800/50 h-full"
//                 >
//                     <button
//                         onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//                         className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                         aria-label="Delete component"
//                     >
//                         <IoMdClose size={18} />
//                     </button>
//                     <div className="text-center py-8">
//                         <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                         </div>
//                         <p className="text-yellow-600 dark:text-yellow-400 font-medium">Waiting for company selection</p>
//                         <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 text-sm mt-1">for {label}</p>
//                     </div>
//                 </motion.div>
//             );
//         }

//         return (
//             <motion.div
//                 key={`general-${id}`}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="relative bg-white dark:bg-[var(--background-dark)] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border)] dark:border-[var(--border-dark)] h-full group"
//             >
//                 <div className="flex items-center justify-between p-4 border-b border-[var(--border)] dark:border-[var(--border-dark)] bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-t-xl">
//                     <h3 className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate flex items-center gap-2">
//                         <span className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"></span>
//                         {label}
//                         <span className="text-xs text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                             {companyName ? `(${companyName})` : platform ? `(${platform})` : ''}
//                         </span>
//                     </h3>
//                     <button
//                         onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//                         className="p-1.5 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
//                         aria-label="Delete component"
//                     >
//                         <IoMdClose size={16} />
//                     </button>
//                 </div>

//                 <div className="p-4 min-h-[800px]">
//                     {type === 'equity' ? (
//                         <Component symbol={symbol} key={`${id}-${symbol}`} />
//                     ) : (
//                         <GraphDataProvider>
//                             <Component uploadId={uploadId} key={`${id}-${uploadId}`} />
//                         </GraphDataProvider>
//                     )}
//                 </div>

//                 <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/30 rounded-xl pointer-events-none transition-all duration-300" />
//             </motion.div>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background-dark)] flex flex-col transition-colors duration-300">
//             <style jsx>{`
//         :root {
//           --primary: #2563eb;
//           --primary-dark: #1e40af;
//           --secondary: #7c3aed;
//           --secondary-dark: #5b21b6;
//           --background: #f8fafc;
//           --background-dark: #0f172a;
//           --text: #1e293b;
//           --text-dark: #e2e8f0;
//           --border: #e5e7eb;
//           --border-dark: #374151;
//         }

//         html, body {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           line-height: 1.5;
//           color: var(--text);
//         }

//         .dark {
//           color: var(--text-dark);
//           background-color: var(--background-dark);
//         }

//         .scrollbar-thin {
//           scrollbar-width: thin;
//           scrollbar-color: var(--primary) var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar {
//           width: 8px;
//         }

//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary);
//           border-radius: 4px;
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border-dark);
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary-dark);
//         }

//         .tooltip {
//           position: relative;
//           display: inline-block;
//         }

//         .tooltip .tooltip-text {
//           visibility: hidden;
//           width: 200px;
//           background-color: #1e293b;
//           color: #fff;
//           text-align: center;
//           border-radius: 6px;
//           padding: 8px;
//           position: absolute;
//           z-index: 1000;
//           bottom: 125%;
//           left: 50%;
//           transform: translateX(-50%);
//           opacity: 0;
//           transition: opacity 0.3s;
//           font-size: 12px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .tooltip:hover .tooltip-text {
//           visibility: visible;
//           opacity: 1;
//         }

//         .dark .tooltip .tooltip-text {
//           background-color: #e2e8f0;
//           color: #1e293b;
//         }
//       `}</style>

//             <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[var(--background-dark)] shadow-sm">
//                 <Navbar
//                     handleNavClick={handleNavClick}
//                     hasUnsavedChanges={hasUnsavedChanges}
//                     setPendingNavigation={setPendingNavigation}
//                     setShowUnsavedModal={setShowUnsavedModal}
//                 />
//             </div>

//             <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//                 <div className="flex flex-1 mt-16">
//                     <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] z-40">
//                         <SidebarRight collapsed={collapsed} setCollapsed={setCollapsed} onItemClick={handleItemClick} />
//                     </div>

//                     {showModal && <AddNewModal onClose={() => setShowModal(false)} onCreateTab={handleNewDashboard} />}

//                     <div
//                         className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'pr-14' : 'pr-80'
//                             } overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin`}
//                     >
//                         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                             <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/80 dark:bg-slate-900 backdrop-blur-lg rounded-xl p-2 dark:border-[var(--border-dark)] shadow-sm">
//                                 {tabs.map((tab) => (
//                                     <div
//                                         key={tab}
//                                         className="flex items-center bg-[var(--background)] dark:bg-[var(--background-dark)] px-3 py-1.5 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                                     >
//                                         {editingTab === tab ? (
//                                             <div className="flex items-center gap-2">
//                                                 <input
//                                                     type="text"
//                                                     value={editedTabName}
//                                                     onChange={(e) => setEditedTabName(e.target.value)}
//                                                     onKeyDown={(e) => e.key === 'Enter' && handleRenameTab(tab, editedTabName)}
//                                                     className="w-32 px-2 py-1 bg-white dark:bg-[var(--background-dark)] border border-[var(--border)] dark:border-[var(--border-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
//                                                     autoFocus
//                                                 />
//                                                 <button
//                                                     onClick={() => handleRenameTab(tab, editedTabName)}
//                                                     className="p-1 text-green-600 hover:text-green-700 transition-colors"
//                                                     title="Save"
//                                                 >
//                                                     <IoMdSave size={16} />
//                                                 </button>
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-center gap-2">
//                                                 <button
//                                                     onClick={() => handleTabSwitch(tab)}
//                                                     className={`text-sm font-medium transition-all duration-200 ${activeTab === tab
//                                                         ? 'text-[var(--primary)]'
//                                                         : 'text-[var(--text)] dark:text-[var(--text-dark)] hover:text-[var(--primary)]'
//                                                         }`}
//                                                 >
//                                                     {tab}
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setEditingTab(tab);
//                                                         setEditedTabName(tab);
//                                                     }}
//                                                     className="p-1 text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors"
//                                                     title="Rename"
//                                                 >
//                                                     <MdOutlineDriveFileRenameOutline size={16} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDeleteDashboardAPI(tab)}
//                                                     className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors"
//                                                     title="Delete"
//                                                 >
//                                                     <IoMdClose size={16} />
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}

//                                 <div className="flex items-center gap-3">
//                                     <button
//                                         onClick={() => {
//                                             setShowSavedModal(false);
//                                             if (hasUnsavedChanges) {
//                                                 setPendingNavigation({ label: 'addDashboard', path: null });
//                                                 setShowUnsavedModal(true);
//                                                 return;
//                                             }
//                                             setShowModal(true);
//                                             setIsMenuOpen(false);
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                                         data-tour="dashboard-add"
//                                     >
//                                         <MdOutlineDashboardCustomize size={18} /> Add Dashboard
//                                     </button>

//                                       <div className="relative inline-block">
//                                         <button
//                                             onClick={handleTopCompanyClick}
//                                             className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm "
//                                             data-tour="top-company"
//                                         >
//                                             <FaRocket size={18} /> Market Leader
//                                             <div className="absolute bottom-0 right-0 group">
//                                                 <FaInfoCircle size={14} className="text-white/80 cursor-pointer" />
//                                                 <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                     Adds MACD, Sensex Calculator, and Candlestick plots.
//                                                 </span>
//                                             </div>
//                                         </button>
//                                     </div>

//                                     <button
//                                         onClick={handleSaveDashboard}
//                                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                                         data-tour="dashboard-save"
//                                     >
//                                         <BiSolidSave size={18} /> Save
//                                     </button>



//                                     <button
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             setShowSavedModal(false);
//                                             if (!isLoggedIn) {
//                                                 toast.error('Login first to see your dashboards.');
//                                                 return;
//                                             }
//                                             handleNavClick('Saved Dashboards', '/savedDashboard');
//                                         }}
//                                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                                         data-tour="dashboard-saved"
//                                     >
//                                         <BiSolidSave size={18} /> Saved Dashboards
//                                     </button>
//                                 </div>
//                             </div>

//                             {getUniqueCompanies().length > 0 ? (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     className="flex flex-wrap gap-3 items-center mb-6 bg-white/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg rounded-xl p-4 border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                                 >
//                                     <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] bg-[var(--border)] dark:bg-[var(--border-dark)] px-3 py-1 rounded-full">
//                                         Selected Stocks:
//                                     </span>
//                                     {getUniqueCompanies().map((companyName) => (
//                                         <motion.div
//                                             key={companyName}
//                                             initial={{ scale: 0.8, opacity: 0 }}
//                                             animate={{ scale: 1, opacity: 1 }}
//                                             className="flex items-center gap-2 px-3 py-1.5 bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                                         >
//                                             <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate max-w-[120px]">
//                                                 {companyName}
//                                             </span>
//                                             <button
//                                                 onClick={() => handleClearCompany(companyName)}
//                                                 className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                                                 title="Remove"
//                                             >
//                                                 <IoMdClose size={14} />
//                                             </button>
//                                         </motion.div>
//                                     ))}
//                                 </motion.div>
//                             ) : (
//                                 <motion.p
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     className="text-sm text-[var(--text)]/60 dark:text-white mb-6 text-center py-4 bg-white/30 dark:bg-slate-900 rounded-xl border border-dashed border-[var(--border)] dark:border-[var(--border-dark)]"
//                                 >
//                                     No stocks selected. Add stocks from the sidebar to get started!
//                                 </motion.p>
//                             )}
//                         </div>

//                         <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
//                             <section className="space-y-6">
//                                 <div className="text-center">
//                                     <motion.h2
//                                         initial={{ opacity: 0, y: -20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="text-2xl font-semibold bg-gray-700 bg-clip-text text-transparent dark:bg-gray-100"
//                                     >
//                                         Interactive Whiteboard
//                                     </motion.h2>
//                                     <motion.p
//                                         initial={{ opacity: 0 }}
//                                         animate={{ opacity: 1 }}
//                                         transition={{ delay: 0.1 }}
//                                         className="text-[var(--text)]/70 dark:text-gray-300 mt-2 text-sm"
//                                     >
//                                         Drag components from the sidebar and resize plots using the handles
//                                     </motion.p>
//                                 </div>

//                                 <DroppableArea id="general">
//                                     {(() => {
//                                         const droppedItems = droppedMap?.[activeTab]?.general || [];
//                                         const visibleItems = getVisibleItems(
//                                             droppedItems.map((item) => ({
//                                                 ...item,
//                                                 sortableId: item.sortableId || `item-${item.id}`,
//                                             }))
//                                         );

//                                         if (visibleItems.length === 0) {
//                                             return (
//                                                 <motion.div
//                                                     initial={{ opacity: 0, scale: 0.95 }}
//                                                     animate={{ opacity: 1, scale: 1 }}
//                                                     className="flex flex-col items-center py-20 min-h-[900px] px-4 bg-white/50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-[var(--border)] dark:border-[var(--border-dark)] shadow-inner"
//                                                 >
//                                                     <motion.div
//                                                         animate={{
//                                                             y: [0, -10, 0],
//                                                             rotate: [0, 5, -5, 0],
//                                                         }}
//                                                         transition={{
//                                                             duration: 4,
//                                                             repeat: Infinity,
//                                                             ease: 'easeInOut',
//                                                         }}
//                                                         className="mb-4"
//                                                     >
//                                                         <svg
//                                                             className="h-20 w-20 text-[var(--primary)]/60 dark:text-gray-300"
//                                                             fill="none"
//                                                             stroke="currentColor"
//                                                             viewBox="0 0 24 24"
//                                                         >
//                                                             <path
//                                                                 strokeLinecap="round"
//                                                                 strokeLinejoin="round"
//                                                                 strokeWidth="1.5"
//                                                                 d="M4 8v8m0 0h8m-8 0l8-8m4 8v-8m0 0H8m8 0l-8 8"
//                                                             />
//                                                         </svg>
//                                                     </motion.div>
//                                                     <h3 className="text-xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                                                         Your Whiteboard Awaits!
//                                                     </h3>
//                                                     <p className="text-[var(--text)]/70 dark:text-gray-300 text-center max-w-md">
//                                                         Drag and drop components from the sidebar to start building your dashboard.
//                                                         Resize plots using the visible handles for optimal layout.
//                                                     </p>
//                                                     <motion.button
//                                                         whileHover={{ scale: 1.05 }}
//                                                         whileTap={{ scale: 0.95 }}
//                                                         onClick={() => setCollapsed(false)}
//                                                         className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg font-medium"
//                                                     >
//                                                         <GoSidebarExpand size={20} /> Open Sidebar
//                                                     </motion.button>
//                                                 </motion.div>
//                                             );
//                                         }

//                                         // Group items into pairs for rows
//                                         const rows = [];
//                                         for (let i = 0; i < visibleItems.length; i += 2) {
//                                             rows.push(visibleItems.slice(i, i + 2));
//                                         }

//                                         return (
//                                             <SortableContext items={visibleItems.map((item) => item.sortableId)} strategy={() => null}>
//                                                 <PanelGroup
//                                                     direction="vertical"
//                                                     className="min-h-[800px] rounded-2xl bg-white/30 backdrop-blur-sm"
//                                                     onLayout={() => setResizing(false)}
//                                                 >
//                                                     {rows.map((rowItems, rowIndex) => (
//                                                         <React.Fragment key={`row-${rowIndex}`}>
//                                                             {rowIndex > 0 && (
//                                                                 <PanelResizeHandle onDragging={setResizing}>
//                                                                     <ResizeHandle direction="vertical" />
//                                                                 </PanelResizeHandle>
//                                                             )}
//                                                             <Panel defaultSize={100 / rows.length} minSize={30}>
//                                                                 <PanelGroup direction="horizontal">
//                                                                     {rowItems.map((item, idx) => (
//                                                                         <React.Fragment key={`item-${item.id}`}>
//                                                                             {idx > 0 && (
//                                                                                 <PanelResizeHandle onDragging={setResizing}>
//                                                                                     <ResizeHandle direction="horizontal" />
//                                                                                 </PanelResizeHandle>
//                                                                             )}
//                                                                             <Panel defaultSize={100 / rowItems.length} minSize={30}>
//                                                                                 <Draggable id={item.sortableId}>
//                                                                                     {renderPlot(item, rowIndex * 2 + idx, visibleItems)}
//                                                                                 </Draggable>
//                                                                             </Panel>
//                                                                         </React.Fragment>
//                                                                     ))}
//                                                                 </PanelGroup>
//                                                             </Panel>
//                                                         </React.Fragment>
//                                                     ))}
//                                                 </PanelGroup>
//                                             </SortableContext>
//                                         );
//                                     })()}
//                                 </DroppableArea>
//                             </section>
//                         </main>
//                     </div>

//                     <AnimatePresence>
//                         {showUnsavedModal && (
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
//                             >
//                                 <motion.div
//                                     initial={{ scale: 0.9, opacity: 0 }}
//                                     animate={{ scale: 1, opacity: 1 }}
//                                     exit={{ scale: 0.9, opacity: 0 }}
//                                     className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//                                 >
//                                     <div className="text-center ">
//                                         <div className="w-16 h- bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                                             <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth="2"
//                                                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
//                                                 />
//                                             </svg>
//                                         </div>
//                                         <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                                             Unsaved Changes
//                                         </h2>
//                                         <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                                             You have unsaved changes. Would you like to save before{' '}
//                                             {pendingNavigation ? `navigating to ${pendingNavigation.label}` : pendingTab ? `switching to ${pendingTab}` : 'leaving'}?
//                                         </p>
//                                     </div>
//                                     <div className="flex gap-3">
//                                         <button
//                                             onClick={handleSaveAndNavigate}
//                                             className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md"
//                                         >
//                                             Save & Continue
//                                         </button>
//                                         <button
//                                             onClick={handleConfirmNavigation}
//                                             className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md"
//                                         >
//                                             Leave Anyway
//                                         </button>
//                                     </div>
//                                     <button
//                                         onClick={handleCancelNavigation}
//                                         className="w-full mt-3 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-colors"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </motion.div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     {showSavedModal && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//                         >
//                             <motion.div
//                                 initial={{ scale: 0.9, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 exit={{ scale: 0.9, opacity: 0 }}
//                                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)] text-center"
//                             >
//                                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <BiSolidSave className="w-8 h-8 text-green-500" />
//                                 </div>
//                                 <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">Dashboard Saved!</h2>
//                                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                                     Your changes have been saved successfully.
//                                 </p>
//                             </motion.div>
//                         </motion.div>
//                     )}

//                     <DragStartModal
//                         isOpen={showDragModal}
//                         onClose={() => {
//                             setShowDragModal(false);
//                             setCurrentDragItem(null);
//                             setError(null);
//                         }}
//                         onSearch={handleStockSearch}
//                         searchTerm={searchTerm}
//                         setSearchTerm={(value) => {
//                             setSearchTerm(value);
//                             setError(null);
//                             if (value.length >= 2) handleStockSearch();
//                             else setSearchedStocks([]);
//                         }}
//                         searchedStocks={searchedStocks}
//                         onSelectItem={(item) => {
//                             if (currentDragItem) {
//                                 setDroppedMap((prev) => {
//                                     const currentTab = prev[activeTab] || { general: [] };
//                                     const generalItems = currentTab.general || [];
//                                     const lastItemIndex = generalItems.findLastIndex(
//                                         (i) => i.label === currentDragItem.label && !i.symbol
//                                     );
//                                     if (lastItemIndex >= 0) {
//                                         const updatedItems = [...generalItems];
//                                         updatedItems[lastItemIndex] = {
//                                             ...updatedItems[lastItemIndex],
//                                             symbol: item.symbol,
//                                             companyName: item.companyName,
//                                             type: 'equity',
//                                             sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                                         };
//                                         return { ...prev, [activeTab]: { ...currentTab, general: updatedItems } };
//                                     } else {
//                                         const newItem = {
//                                             label: currentDragItem.label,
//                                             symbol: item.symbol,
//                                             companyName: item.companyName,
//                                             graphType: currentDragItem.label,
//                                             id: `${currentDragItem.label}-${Date.now()}`,
//                                             type: 'equity',
//                                             sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                                         };
//                                         return { ...prev, [activeTab]: { ...currentTab, general: [...generalItems, newItem] } };
//                                     }
//                                 });
//                                 setDragCountMap((prev) => ({
//                                     ...prev,
//                                     [activeTab]: {
//                                         ...prev[activeTab],
//                                         [currentDragItem.label]: (prev[activeTab]?.[currentDragItem.label] || 0) + 1,
//                                     },
//                                 }));
//                                 setHasUnsavedChanges(true);
//                             }
//                             setSearchTerm('');
//                             setSearchedStocks([]);
//                             setShowDragModal(false);
//                             setCurrentDragItem(null);
//                             setError(null);
//                         }}
//                         onClear={() => {
//                             setSearchTerm('');
//                             setSearchedStocks([]);
//                             setError(null);
//                         }}
//                         selectedCompany={null}
//                         error={error}
//                     />

//                     <PortfolioSelectModal
//                         isOpen={showPortfolioModal}
//                         onClose={() => {
//                             setShowPortfolioModal(false);
//                             setCurrentDragItem(null);
//                             setError(null);
//                         }}
//                         portfolios={savedPortfolios}
//                         onSelectPortfolio={handlePortfolioSelect}
//                         error={error}
//                     />

//                     {showDeleteModal && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//                         >
//                             <motion.div
//                                 initial={{ scale: 0.9, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 exit={{ scale: 0.9, opacity: 0 }}
//                                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//                             >
//                                 <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-4">
//                                     Confirm Deletion
//                                 </h2>
//                                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mb-6">
//                                     Are you sure you want to delete your account? This action cannot be undone.
//                                 </p>
//                                 <div className="flex gap-4">
//                                     <button
//                                         onClick={handleDeleteAccount}
//                                         className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
//                                     >
//                                         Delete
//                                     </button>
//                                     <button
//                                         onClick={() => setShowDeleteModal(false)}
//                                         className="flex-1 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-all duration-300"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     )}
//                 </div>
//             </DndContext>
//         </div>
//     );
// };

// export default DashBoard;




// -----------------------------3. DashBoard.jsx-----------------------------



// import React, { useEffect, useState, useRef } from 'react';
// import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter, rectIntersection } from '@dnd-kit/core';
// import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import Navbar from '../Navbar';
// import { MdOutlineDashboardCustomize, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
// import { BiSolidSave } from 'react-icons/bi';
// import { IoMdClose, IoMdSave } from 'react-icons/io';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Modal from 'react-modal';
// import SidebarRight from './SidebarRight';
// import AddNewModal from './AddNewModal';
// import DragStartModal from './DragStartModal';
// import DroppableArea from './DroppableArea';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { GoSidebarExpand } from 'react-icons/go';
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';
// import PortfolioSelectModal from './PortfolioSelectModal';
// import { Search } from 'lucide-react';
// import SearchList from '../EquityHub/SearchList';
// import { useAuth } from '../AuthContext';
// import { CiLogout } from 'react-icons/ci';
// import { logActivity } from '../../services/api';
// import { IoMdArrowDropdown } from 'react-icons/io';
// import axios from 'axios';
// import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
// import { FaChartLine, FaBriefcase, FaInfoCircle, FaRocket } from 'react-icons/fa';
// import DraggableItem from './DraggableItem';
// import ResizeHandle from './ResizeHandle';
// import { Helmet } from 'react-helmet-async';

// Modal.setAppElement('#root');

// // Custom Draggable component
// const Draggable = ({ id, children }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// };

// // Custom ResizeHandle component
// // const ResizeHandle = ({ direction = 'horizontal' }) => (
// //   <div
// //     className={`
// //       relative group transition-all duration-200
// //       ${direction === 'horizontal' ? 'w-2 h-full mx-1' : 'h-2 w-full my-1'}
// //     `}
// //   >
// //     <div
// //       className={`
// //         absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10
// //         rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
// //       `}
// //     />
// //     <div
// //       className={`
// //         absolute inset-0 flex items-center justify-center
// //         ${direction === 'horizontal' ? 'flex-col' : 'flex-row'}
// //       `}
// //     >
// //       <div
// //         className={`
// //           bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full
// //           transition-all duration-200 group-hover:scale-110
// //           ${direction === 'horizontal' ? 'w-1 h-8' : 'h-1 w-8'}
// //         `}
// //       />
// //     </div>
// //   </div>
// // );

// const DashBoard = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [showModal, setShowModal] = useState(false);
//   const [tabs, setTabs] = useState(['Dashboard 1']);
//   const [activeTab, setActiveTab] = useState('Dashboard 1');
//   const [uploadId, setUploadId] = useState(null);
//   const [platform, setPlatform] = useState('');
//   const [symbol, setSymbol] = useState(null);
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [savedPortfolios, setSavedPortfolios] = useState([]);
//   const [droppedMap, setDroppedMap] = useState({ 'Dashboard 1': { general: [] } });
//   const [savedDroppedMap, setSavedDroppedMap] = useState({});
//   const [editingTab, setEditingTab] = useState(null);
//   const [editedTabName, setEditedTabName] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchedStocks, setSearchedStocks] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showDragModal, setShowDragModal] = useState(false);
//   const [showPortfolioModal, setShowPortfolioModal] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [dragCountMap, setDragCountMap] = useState({ 'Dashboard 1': {} });
//   const [currentDragItem, setCurrentDragItem] = useState(null);
//   const [error, setError] = useState(null);
//   const [showUnsavedModal, setShowUnsavedModal] = useState(false);
//   const [showSavedModal, setShowSavedModal] = useState(false);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [pendingNavigation, setPendingNavigation] = useState(null);
//   const [pendingTab, setPendingTab] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const [sticky, setSticky] = useState(false);
//   const [userType, setUserType] = useState(null);
//   const [fullName, setFullName] = useState('');
//   const initialQuery = queryParams.get('query') || '';
//   const [isDisabled, setIsDisabled] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const { login, logout } = useAuth();
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
//   const drawerRef = useRef(null);
//   const [resizing, setResizing] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('#portfolio-dropdown')) {
//         setIsPortfolioOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setSticky(window.scrollY > 0);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const currentTab = droppedMap[activeTab] || { general: [] };
//     const savedTab = savedDroppedMap[activeTab] || { general: [] };
//     const hasChanges = JSON.stringify(currentTab.general) !== JSON.stringify(savedTab.general);
//     setHasUnsavedChanges(hasChanges);
//   }, [droppedMap, activeTab, savedDroppedMap]);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) setIsLoggedIn(true);
//   }, []);

//   useEffect(() => {
//     const storedUploadId = localStorage.getItem('uploadId');
//     const storedPlatform = localStorage.getItem('platform');
//     if (storedUploadId && storedPlatform) {
//       setUploadId(storedUploadId);
//       setPlatform(storedPlatform);
//     }
//   }, []);

//   const fetchSavedPortfolio = async () => {
//     try {
//       setError('');
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError('Please login to view your portfolios');
//         return;
//       }
//       const response = await fetch(`${API_BASE}/file/saved`, {
//         method: 'GET',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) {
//         const err = await response.json();
//         setError(err.error || 'Failed to fetch saved portfolios');
//         return;
//       }
//       const data = await response.json();
//       if (data.length > 0) {
//         setSavedPortfolios(data);
//         setUploadId(data[0].uploadId);
//         setPlatform(data[0].platform);
//       } else {
//         setSavedPortfolios([]);
//         setError('No portfolios found');
//       }
//     } catch (err) {
//       console.error('Error fetching saved portfolios:', err);
//       setError('Network error. Please try again later.');
//     }
//   };

//   useEffect(() => {
//     fetchSavedPortfolio();
//   }, [API_BASE]);

//   const handleStockSearch = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/stocks/test/search?query=${searchTerm}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       if (Array.isArray(data) && data.length > 0) {
//         setSearchedStocks(data);
//         setSavedStocks(data);
//       } else {
//         setSearchedStocks([]);
//         toast.info('No stocks found for the search term.');
//         setError('Company not found');
//       }
//     } catch (err) {
//       console.error('Error fetching stock suggestions:', err);
//       setSearchedStocks([]);
//       setError('Company not found in our list. Please check the name and search again.');
//     }
//   };

//   const handleRenameTab = (oldName, newName) => {
//     if (!newName || newName.trim() === '') return;
//     if (tabs.includes(newName)) {
//       toast.info('A dashboard with this name already exists.');
//       return;
//     }
//     setTabs((prevTabs) => prevTabs.map((tab) => (tab === oldName ? newName : tab)));
//     setDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[newName] = prev[oldName];
//       delete updated[oldName];
//       return updated;
//     });
//     setSavedDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[newName] = prev[oldName];
//       delete updated[oldName];
//       return updated;
//     });
//     setDragCountMap((prev) => {
//       const updated = { ...prev };
//       updated[newName] = prev[oldName];
//       delete updated[oldName];
//       return updated;
//     });
//     if (activeTab === oldName) setActiveTab(newName);
//     setEditingTab(null);
//     setEditedTabName('');
//   };

//   const handleDeleteComponent = (index) => {
//     setDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[activeTab] = {
//         ...prev[activeTab],
//         general: prev[activeTab].general.filter((_, idx) => idx !== index),
//       };
//       return updated;
//     });
//     const label = droppedMap[activeTab].general[index].label;
//     const remaining = droppedMap[activeTab].general.filter((item, idx) => idx !== index && item.label === label);
//     if (remaining.length === 0) {
//       setDragCountMap((prev) => ({
//         ...prev,
//         [activeTab]: { ...prev[activeTab], [label]: 0 },
//       }));
//     }
//     setHasUnsavedChanges(true);
//   };

//   const handleClearCompany = (companyName) => {
//     setDroppedMap((prev) => ({
//       ...prev,
//       [activeTab]: {
//         ...prev[activeTab],
//         general: prev[activeTab].general.filter((item) => item.companyName !== companyName),
//       },
//     }));
//     const affectedLabels = droppedMap[activeTab].general
//       .filter((item) => item.companyName === companyName)
//       .map((item) => item.label);
//     setDragCountMap((prev) => {
//       const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//       affectedLabels.forEach((label) => {
//         const remaining = droppedMap[activeTab].general.filter(
//           (item) => item.label === label && item.companyName !== companyName
//         );
//         updated[activeTab][label] = remaining.length > 0 ? prev[activeTab][label] || 1 : 0;
//       });
//       return updated;
//     });
//     toast.success(`Company ${companyName} and associated graphs removed`);
//     setHasUnsavedChanges(true);
//   };

//   const generateDefaultDashboardName = async (baseName = 'Dashboard') => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboards');
//       const data = await response.json();
//       const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//       let index = 1;
//       let defaultName;
//       do {
//         defaultName = `${baseName} ${index}`;
//         index++;
//       } while (existingNames.includes(defaultName) || tabs.includes(defaultName));
//       return defaultName;
//     } catch (err) {
//       console.error('Error fetching dashboards for name generation:', err);
//       let index = 1;
//       let defaultName;
//       do {
//         defaultName = `${baseName} ${index}`;
//         index++;
//       } while (tabs.includes(defaultName));
//       return defaultName;
//     }
//   };

//   const handleNewDashboard = async (title) => {
//     const newTitle = title && title.trim() ? title : await generateDefaultDashboardName();
//     if (tabs.includes(newTitle)) {
//       toast.info('A dashboard with this name already exists.');
//       return;
//     }
//     setTabs((prev) => [...prev, newTitle]);
//     setDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//     setSavedDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//     setActiveTab(newTitle);
//     setShowModal(false);
//     setDragCountMap((prev) => ({ ...prev, [newTitle]: {} }));
//     setIsMenuOpen(false);
//     setHasUnsavedChanges(false);
//   };

//   const handleDragStart = (event) => {
//     const { active } = event;
//     const label = active?.data?.current?.label;
//     setCurrentDragItem(active?.data?.current);
//     const equityLabels = Object.keys(equityHubMap);
//     const portfolioLabels = Object.keys(portfolioMap);
//     if (equityLabels.includes(label)) {
//       const currentDragCount = dragCountMap[activeTab]?.[label] || 0;
//       if (currentDragCount === 0 && !droppedMap[activeTab].general.some((item) => item.label === label)) {
//         setShowDragModal(true);
//       } else if (currentDragCount >= 1) {
//         setShowDragModal(true);
//       }
//     } else if (portfolioLabels.includes(label)) {
//       setShowPortfolioModal(true);
//     }
//   };

//   const handleItemClick = (item) => {
//     const { id, label } = item;
//     const equityLabels = Object.keys(equityHubMap);
//     const portfolioLabels = Object.keys(portfolioMap);

//     let section = null;
//     if (equityLabels.includes(label)) section = 'equity';
//     if (portfolioLabels.includes(label)) section = 'portfolio';

//     if (section === 'equity') {
//       setCurrentDragItem({ label });
//       setShowDragModal(true);
//       return;
//     }

//     if (section === 'portfolio') {
//       setCurrentDragItem({ label });
//       setShowPortfolioModal(true);
//       return;
//     }
//   };

//   const handleDragEnd = (event) => {
//     const { over, active } = event;
//     const label = active?.data?.current?.label;
//     const id = active?.id;

//     // Handle reordering of existing items
//     if (active.data.current?.sortable) {
//       const items = droppedMap[activeTab]?.general || [];
//       const oldIndex = items.findIndex((item) => item.sortableId === active.id);
//       const newIndex = items.findIndex((item) => item.sortableId === over?.id);
//       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//         setDroppedMap((prev) => ({
//           ...prev,
//           [activeTab]: {
//             ...prev[activeTab],
//             general: arrayMove(prev[activeTab].general, oldIndex, newIndex),
//           },
//         }));
//         setHasUnsavedChanges(true);
//       }
//       return;
//     }

//     // Handle new item drop
//     if (!over || !label || !id) return;

//     const equityLabels = Object.keys(equityHubMap);
//     const portfolioLabels = Object.keys(portfolioMap);

//     if (equityLabels.includes(label)) {
//       setCurrentDragItem(active?.data?.current);
//       setShowDragModal(true);
//       return;
//     }

//     if (portfolioLabels.includes(label)) {
//       setCurrentDragItem(active?.data?.current);
//       setShowPortfolioModal(true);
//       return;
//     }
//   };

//   const handlePortfolioSelect = (portfolio) => {
//     if (currentDragItem) {
//       const draggedItem = {
//         label: currentDragItem.label,
//         symbol: '',
//         companyName: '',
//         graphType: currentDragItem.label,
//         uploadId: portfolio.uploadId,
//         platform: portfolio.platform,
//         id: `${currentDragItem.label}-${Date.now()}`,
//         type: 'portfolio',
//         sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       };

//       setDroppedMap((prev) => {
//         const currentTab = prev[activeTab] || { general: [] };
//         const currentSection = currentTab.general || [];
//         return {
//           ...prev,
//           [activeTab]: { ...currentTab, general: [...currentSection, draggedItem] },
//         };
//       });
//       setUploadId(portfolio.uploadId);
//       setPlatform(portfolio.platform);
//       localStorage.setItem('uploadId', portfolio.uploadId.toString());
//       localStorage.setItem('platform', portfolio.platform);
//       setShowPortfolioModal(false);
//       setCurrentDragItem(null);
//       setHasUnsavedChanges(true);
//     }
//   };

//   const getVisibleItems = (items) => items;

//   const handleSaveDashboard = async () => {
//     const token = localStorage.getItem('authToken');
//     const userId = localStorage.getItem('userId');
//     const userType = localStorage.getItem('userType');
//     const generalPlots = droppedMap?.[activeTab]?.general || [];

//     if (!token) {
//       toast.error('Please login first to save your dashboard.');
//       return;
//     }

//     if (generalPlots.length === 0) {
//       toast.error('Please drag and drop at least one plot before saving.');
//       return;
//     }

//     let finalDashboardName = activeTab;

//     try {
//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboards');
//       const data = await response.json();
//       const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//       if (existingNames.includes(finalDashboardName)) {
//         finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//         setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//         setDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setSavedDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = { general: generalPlots };
//           if (activeTab !== finalDashboardName) delete updated[activeTab];
//           return updated;
//         });
//         setDragCountMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setActiveTab(finalDashboardName);
//         toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//       }
//     } catch (err) {
//       console.error('Error checking dashboard names:', err);
//       if (tabs.includes(finalDashboardName)) {
//         finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//         setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//         setDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setSavedDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = { general: generalPlots };
//           if (activeTab !== finalDashboardName) delete updated[activeTab];
//           return updated;
//         });
//         setDragCountMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setActiveTab(finalDashboardName);
//         toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//       }
//     }

//     const savedData = {
//       dashboard: { dashboardName: finalDashboardName, userId: userId ? parseInt(userId) : 0, userType: userType || '' },
//       equityHubPlots: [],
//       portfolioPlots: [],
//     };

//     generalPlots.forEach(({ label, symbol, companyName, graphType, uploadId, platform, type }) => {
//       if (type === 'equity') {
//         let finalSymbol = symbol;
//         let finalCompany = companyName;

//         if (!finalSymbol || !finalCompany) {
//           const matched = savedStocks.find(
//             (stock) => stock.symbol === finalSymbol || stock.graphType === graphType || stock.label === label
//           );
//           if (matched) {
//             finalSymbol = finalSymbol || matched.symbol;
//             finalCompany = finalCompany || matched.companyName;
//           }
//         }

//         savedData.equityHubPlots.push({ symbol: finalSymbol, companyName: finalCompany, graphType: graphType || label });
//       } else if (type === 'portfolio') {
//         savedData.portfolioPlots.push({ uploadId, platform, graphType: label });
//       }
//     });

//     try {
//       const response = await fetch(`${API_BASE}/dashboard/save`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(savedData),
//       });
//       if (response.ok) {
//         const result = await response.json();
//         setSavedDroppedMap((prev) => ({
//           ...prev,
//           [finalDashboardName]: { general: generalPlots },
//         }));
//         setHasUnsavedChanges(false);
//         setShowSavedModal(true);
//         setTimeout(() => setShowSavedModal(false), 2000);
//       } else {
//         toast.error('Failed to save dashboard');
//       }
//     } catch (err) {
//       console.error('Save failed:', err);
//       toast.error('Save failed');
//     }
//     setIsMenuOpen(false);
//   };

//   const handleDeleteDashboardAPI = async (dashboardName) => {
//     if (hasUnsavedChanges) {
//       setPendingTab(dashboardName);
//       setShowUnsavedModal(true);
//       return;
//     }
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashboardName}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to delete dashboard');
//       setTabs((prev) => prev.filter((tab) => tab !== dashboardName));
//       setDroppedMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       setSavedDroppedMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       setDragCountMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       if (activeTab === dashboardName) {
//         const remainingTabs = tabs.filter((tab) => tab !== dashboardName);
//         setActiveTab(remainingTabs[0] || '');
//       }
//       toast.success('Dashboard deleted successfully');
//       setIsMenuOpen(false);
//     } catch (err) {
//       console.error('Delete error:', err);
//       toast.error('Failed to delete dashboard');
//     }
//   };

//   const getUniqueCompanies = () => {
//     const generalItems = droppedMap[activeTab]?.general || [];
//     return [...new Set(generalItems.filter((item) => item.companyName).map((item) => item.companyName))];
//   };

//   const isDashboardEmpty = () => {
//     const currentTab = droppedMap[activeTab] || { general: [] };
//     return currentTab.general.length === 0;
//   };

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > 3600000) {
//         // 1 hour TTL
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       setError('Failed to parse cached data.');
//       console.error('Cache parse error:', err);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       setError('Failed to cache data.');
//       console.error('Cache set error:', err);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//     setResults([]);
//     setError(null);
//   };

//   const handleLoginClick = () => setShowLoginModal(true);
//   const handleCloseModal = () => setShowLoginModal(false);
//   const handleLoginSuccess = () => {
//     login();
//     handleCloseModal();
//   };

//   const handleLogout = () => {
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label: 'logout', path: '/' });
//       setShowUnsavedModal(true);
//       setShowSavedModal(false);
//       return;
//     }
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('userEmail');
//     logout();
//     toast.success('Logout successfully!');
//     navigate('/');
//   };

//   const handleDeleteAccount = async () => {
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label: 'deleteAccount', path: '/' });
//       setShowUnsavedModal(true);
//       setShowSavedModal(false);
//       return;
//     }
//     const apiUrl =
//       userType === "corporate"
//         ? `${API_BASE}/corporate/delete-account`
//         : `${API_BASE}/Userprofile/delete-account`;


//     try {
//       await axios.delete(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       toast.success('Account deleted successfully');
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('userType');
//       localStorage.removeItem('hasShownQuizPopup');
//       logout();
//       navigate('/');
//       setShowDeleteModal(false);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete account');
//     }
//   };

//   const handleNavClick = async (label, path, state = {}) => {
//     setShowSavedModal(false);
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label, path, state });
//       setShowUnsavedModal(true);
//     } else {
//       await logActivity(`${label} tab clicked`);
//       navigate(path, { state });
//     }
//   };

//   const handleTabSwitch = (tab) => {
//     setShowSavedModal(false);
//     if (hasUnsavedChanges && activeTab !== tab) {
//       setPendingTab(tab);
//       setShowUnsavedModal(true);
//     } else {
//       setActiveTab(tab);
//       setIsMenuOpen(false);
//     }
//   };

//   const handleConfirmNavigation = async () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     if (pendingNavigation) {
//       if (pendingNavigation.label === 'logout') {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logout successfully!');
//         navigate('/');
//       } else if (pendingNavigation.label === 'deleteAccount') {
//         await handleDeleteAccount();
//       } else if (pendingNavigation.label === 'addDashboard') {
//         setShowModal(true);
//         setIsMenuOpen(false);
//       } else {
//         await logActivity(`${pendingNavigation.label} tab clicked`);
//         navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//       }
//       setPendingNavigation(null);
//     } else if (pendingTab) {
//       setActiveTab(pendingTab);
//       setPendingTab(null);
//       setIsMenuOpen(false);
//     }
//   };

//   const handleCancelNavigation = () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     setPendingNavigation(null);
//     setPendingTab(null);
//   };

//   const handleSaveAndNavigate = async () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     await handleSaveDashboard();
//     setShowSavedModal(false);
//     if (pendingNavigation) {
//       if (pendingNavigation.label === 'logout') {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logout successfully!');
//         navigate('/');
//       } else if (pendingNavigation.label === 'deleteAccount') {
//         await handleDeleteAccount();
//       } else if (pendingNavigation.label === 'addDashboard') {
//         setShowModal(true);
//         setIsMenuOpen(false);
//       } else {
//         await logActivity(`${pendingNavigation.label} tab clicked`);
//         navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//       }
//       setPendingNavigation(null);
//     } else if (pendingTab) {
//       setActiveTab(pendingTab);
//       setPendingTab(null);
//       setIsMenuOpen(false);
//     }
//   };

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
//     useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
//   );

//   const handleTopCompanyClick = async () => {
//     try {
//       const apiUrl = `${API_BASE}/market/top-company`;
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || 'Failed to fetch top company');
//       }
//       const topCompany = await response.json();

//       if (!topCompany || !topCompany.Symbol || !topCompany.CompanyName) {
//         toast.error('No top company data available.');
//         return;
//       }

//       const plotsToAdd = [
//         { label: 'MacdPlot', graphType: 'MacdPlot' },
//         { label: 'SensexCalculator', graphType: 'SensexCalculator' },
//         { label: 'CandlePatternPlot', graphType: 'CandlePatternPlot' },
//       ];

//       setDroppedMap((prev) => {
//         const currentTab = prev[activeTab] || { general: [] };
//         const currentSection = currentTab.general || [];
//         const newItems = plotsToAdd.map((plot) => ({
//           label: plot.label,
//           symbol: topCompany.Symbol,
//           companyName: topCompany.CompanyName,
//           graphType: plot.graphType,
//           id: `${plot.label}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//           type: 'equity',
//           sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         }));
//         return {
//           ...prev,
//           [activeTab]: { ...currentTab, general: [...currentSection, ...newItems] },
//         };
//       });

//       setDragCountMap((prev) => {
//         const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//         plotsToAdd.forEach((plot) => {
//           updated[activeTab][plot.label] = (updated[activeTab][plot.label] || 0) + 1;
//         });
//         return updated;
//       });

//       setHasUnsavedChanges(true);
//       toast.success(`Sample Dashboard is added by showing the for ${topCompany.CompanyName}`);
//     } catch (err) {
//       setError('Failed to fetch top company plots.');
//       toast.error('Failed to fetch top company plots.');
//     }
//   };

//   const renderPlot = (plotItem, index, allItems) => {
//     const { label, symbol, companyName, id, uploadId, platform, type } = plotItem;
//     const ComponentMap = type === 'equity' ? equityHubMap : portfolioMap;
//     const Component = ComponentMap[label];

//     if (!Component) {
//       return (
//         <motion.div
//           key={`general-${id}`}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3, delay: index * 0.1 }}
//           className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-200 dark:border-red-800/50 h-full"
//         >
//           <button
//             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//             className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//             aria-label="Delete component"
//           >
//             <IoMdClose size={18} />
//           </button>
//           <div className="text-center py-8">
//             <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <IoMdClose className="text-red-500 text-xl" />
//             </div>
//             <p className="text-red-500 font-medium">Component "{label}" not found</p>
//           </div>
//         </motion.div>
//       );
//     }

//     if (type === 'equity' && !symbol) {
//       return (
//         <motion.div
//           key={`general-${id}`}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3, delay: index * 0.1 }}
//           className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-200 dark:border-yellow-800/50 h-full"
//         >
//           <button
//             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//             className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//             aria-label="Delete component"
//           >
//             <IoMdClose size={18} />
//           </button>
//           <div className="text-center py-8">
//             <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <p className="text-yellow-600 dark:text-yellow-400 font-medium">Waiting for company selection</p>
//             <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 text-sm mt-1">for {label}</p>
//           </div>
//         </motion.div>
//       );
//     }

//     return (
//       <motion.div
//         key={`general-${id}`}
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3, delay: index * 0.1 }}
//         className="relative bg-white dark:bg-[var(--background-dark)] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border)] dark:border-[var(--border-dark)] h-full group"
//       >
//         <div className="flex items-center justify-between p-4 border-b border-[var(--border)] dark:border-[var(--border-dark)] bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-t-xl">
//           <h3 className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate flex items-center gap-2">
//             <span className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"></span>
//             {label}
//             <span className="text-xs text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//               {companyName ? `(${companyName})` : platform ? `(${platform})` : ''}
//             </span>
//           </h3>
//           <button
//             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//             className="p-1.5 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
//             aria-label="Delete component"
//           >
//             <IoMdClose size={16} />
//           </button>
//         </div>

//         <div className="p-4 min-h-[800px]">
//           {type === 'equity' ? (
//             <Component symbol={symbol} key={`${id}-${symbol}`} />
//           ) : (
//             <GraphDataProvider>
//               <Component uploadId={uploadId} key={`${id}-${uploadId}`} />
//             </GraphDataProvider>
//           )}
//         </div>

//         <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/30 rounded-xl pointer-events-none transition-all duration-300" />
//       </motion.div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background-dark)] flex flex-col transition-colors duration-300">
//       <style jsx>{`
//         :root {
//           --primary: #2563eb;
//           --primary-dark: #1e40af;
//           --secondary: #7c3aed;
//           --secondary-dark: #5b21b6;
//           --background: #f8fafc;
//           --background-dark: #0f172a;
//           --text: #1e293b;
//           --text-dark: #e2e8f0;
//           --border: #e5e7eb;
//           --border-dark: #374151;
//         }

//         html, body {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           line-height: 1.5;
//           color: var(--text);
//         }

//         .dark {
//           color: var(--text-dark);
//           background-color: var(--background-dark);
//         }

//         .scrollbar-thin {
//           scrollbar-width: thin;
//           scrollbar-color: var(--primary) var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar {
//           width: 8px;
//         }

//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary);
//           border-radius: 4px;
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border-dark);
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary-dark);
//         }

//         .tooltip {
//           position: relative;
//           display: inline-block;
//         }

//         .tooltip .tooltip-text {
//           visibility: hidden;
//           width: 200px;
//           background-color: #1e293b;
//           color: #fff;
//           text-align: center;
//           border-radius: 6px;
//           padding: 8px;
//           position: absolute;
//           z-index: 1000;
//           bottom: 125%;
//           left: 50%;
//           transform: translateX(-50%);
//           opacity: 0;
//           transition: opacity 0.3s;
//           font-size: 12px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .tooltip:hover .tooltip-text {
//           visibility: visible;
//           opacity: 1;
//         }

//         .dark .tooltip .tooltip-text {
//           background-color: #e2e8f0;
//           color: #1e293b;
//         }
//       `}</style>

//       <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[var(--background-dark)] shadow-sm">

//         <Helmet>
//           <link rel="canonical" href="https://cmdahub.com/researchpanel" />
//         </Helmet>
//         <Navbar
//           handleNavClick={handleNavClick}
//           hasUnsavedChanges={hasUnsavedChanges}
//           setPendingNavigation={setPendingNavigation}
//           setShowUnsavedModal={setShowUnsavedModal}
//         />
//       </div>

//       <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//         <div className="flex flex-1 mt-16">
//           <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] z-40">
//             <SidebarRight collapsed={collapsed} setCollapsed={setCollapsed} onItemClick={handleItemClick} />
//           </div>

//           {showModal && <AddNewModal onClose={() => setShowModal(false)} onCreateTab={handleNewDashboard} />}

//           <div
//             className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'pr-14' : 'pr-80'
//               } overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin`}
//           >
//             <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//               <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/80 dark:bg-slate-900 backdrop-blur-lg rounded-xl p-2 dark:border-[var(--border-dark)] shadow-sm">
//                 {tabs.map((tab) => (
//                   <div
//                     key={tab}
//                     className="flex items-center bg-[var(--background)] dark:bg-[var(--background-dark)] px-3 py-1.5 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                   >
//                     {editingTab === tab ? (
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="text"
//                           value={editedTabName}
//                           onChange={(e) => setEditedTabName(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && handleRenameTab(tab, editedTabName)}
//                           className="w-32 px-2 py-1 bg-white dark:bg-[var(--background-dark)] border border-[var(--border)] dark:border-[var(--border-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
//                           autoFocus
//                         />
//                         <button
//                           onClick={() => handleRenameTab(tab, editedTabName)}
//                           className="p-1 text-green-600 hover:text-green-700 transition-colors"
//                           title="Save"
//                         >
//                           <IoMdSave size={16} />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleTabSwitch(tab)}
//                           className={`text-sm font-medium transition-all duration-200 ${activeTab === tab
//                             ? 'text-[var(--primary)]'
//                             : 'text-[var(--text)] dark:text-[var(--text-dark)] hover:text-[var(--primary)]'
//                             }`}
//                         >
//                           {tab}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setEditingTab(tab);
//                             setEditedTabName(tab);
//                           }}
//                           className="p-1 text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors"
//                           title="Rename"
//                         >
//                           <MdOutlineDriveFileRenameOutline size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteDashboardAPI(tab)}
//                           className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors"
//                           title="Delete"
//                         >
//                           <IoMdClose size={16} />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => {
//                       setShowSavedModal(false);
//                       if (hasUnsavedChanges) {
//                         setPendingNavigation({ label: 'addDashboard', path: null });
//                         setShowUnsavedModal(true);
//                         return;
//                       }
//                       setShowModal(true);
//                       setIsMenuOpen(false);
//                     }}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                     data-tour="dashboard-add"
//                   >
//                     <MdOutlineDashboardCustomize size={18} /> Add Dashboard
//                   </button>

//                   <div className="relative inline-block">
//                     <button
//                       onClick={handleTopCompanyClick}
//                       className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm "
//                       data-tour="top-company"
//                     >
//                       <FaRocket size={18} /> Market Leader
//                       <div className="absolute bottom-0 right-0 group">
//                         <FaInfoCircle size={14} className="text-white/80 cursor-pointer" />
//                         <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                           Adds MACD, Sensex Calculator, and Candlestick plots.
//                         </span>
//                       </div>
//                     </button>
//                   </div>

//                   <button
//                     onClick={handleSaveDashboard}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                     data-tour="dashboard-save"
//                   >
//                     <BiSolidSave size={18} /> Save
//                   </button>



//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setShowSavedModal(false);
//                       if (!isLoggedIn) {
//                         toast.error('Login first to see your dashboards.');
//                         return;
//                       }
//                       handleNavClick('Saved Dashboards', '/saveddashboard');
//                     }}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                     data-tour="dashboard-saved"
//                   >
//                     <BiSolidSave size={18} /> Saved Dashboards
//                   </button>
//                 </div>
//               </div>

//               {getUniqueCompanies().length > 0 ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex flex-wrap gap-3 items-center mb-6 bg-white/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg rounded-xl p-4 border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                 >
//                   <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] bg-[var(--border)] dark:bg-[var(--border-dark)] px-3 py-1 rounded-full">
//                     Selected Stocks:
//                   </span>
//                   {getUniqueCompanies().map((companyName) => (
//                     <motion.div
//                       key={companyName}
//                       initial={{ scale: 0.8, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       className="flex items-center gap-2 px-3 py-1.5 bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                     >
//                       <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate max-w-[120px]">
//                         {companyName}
//                       </span>
//                       <button
//                         onClick={() => handleClearCompany(companyName)}
//                         className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                         title="Remove"
//                       >
//                         <IoMdClose size={14} />
//                       </button>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               ) : (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-sm text-[var(--text)]/60 dark:text-white mb-6 text-center py-4 bg-white/30 dark:bg-slate-900 rounded-xl border border-dashed border-[var(--border)] dark:border-[var(--border-dark)]"
//                 >
//                   No stocks selected. Add stocks from the sidebar to get started!
//                 </motion.p>
//               )}
//             </div>

//             <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
//               <section className="space-y-6">
//                 <div className="text-center">
//                   <motion.h2
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-2xl font-semibold bg-gray-700 bg-clip-text text-transparent dark:bg-gray-100"
//                   >
//                     Interactive Whiteboard
//                   </motion.h2>
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.1 }}
//                     className="text-[var(--text)]/70 dark:text-gray-300 mt-2 text-sm"
//                   >
//                     Drag components from the sidebar and resize plots using the handles
//                   </motion.p>
//                 </div>

//                 <DroppableArea id="general">
//                   {(() => {
//                     const droppedItems = droppedMap?.[activeTab]?.general || [];
//                     const visibleItems = getVisibleItems(
//                       droppedItems.map((item) => ({
//                         ...item,
//                         sortableId: item.sortableId || `item-${item.id}`,
//                       }))
//                     );

//                     if (visibleItems.length === 0) {
//                       return (
//                         <motion.div
//                           initial={{ opacity: 0, scale: 0.95 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="flex flex-col items-center py-20 min-h-[900px] px-4 bg-white/50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-[var(--border)] dark:border-[var(--border-dark)] shadow-inner"
//                         >
//                           <motion.div
//                             animate={{
//                               y: [0, -10, 0],
//                               rotate: [0, 5, -5, 0],
//                             }}
//                             transition={{
//                               duration: 4,
//                               repeat: Infinity,
//                               ease: 'easeInOut',
//                             }}
//                             className="mb-4"
//                           >
//                             <svg
//                               className="h-20 w-20 text-[var(--primary)]/60 dark:text-gray-300"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="1.5"
//                                 d="M4 8v8m0 0h8m-8 0l8-8m4 8v-8m0 0H8m8 0l-8 8"
//                               />
//                             </svg>
//                           </motion.div>
//                           <h3 className="text-xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                             Your Whiteboard Awaits!
//                           </h3>
//                           <p className="text-[var(--text)]/70 dark:text-gray-300 text-center max-w-md">
//                             Drag and drop components from the sidebar to start building your dashboard.
//                             Resize plots using the visible handles for optimal layout.
//                           </p>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => setCollapsed(false)}
//                             className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg font-medium"
//                           >
//                             <GoSidebarExpand size={20} /> Open Sidebar
//                           </motion.button>
//                         </motion.div>
//                       );
//                     }

//                     // Group items into pairs for rows
//                     const rows = [];
//                     for (let i = 0; i < visibleItems.length; i += 2) {
//                       rows.push(visibleItems.slice(i, i + 2));
//                     }

//                     const minHeightPerRow = 700; // Minimum height per row
//                     const totalMinHeight = Math.max(minHeightPerRow * rows.length, 900); // Ensure at least 900px for empty state
//                     return (
//                       <SortableContext items={visibleItems.map((item) => item.sortableId)} strategy={() => null}>
//                         <PanelGroup
//                           direction="vertical"
//                           className=" rounded-2xl bg-white/30 backdrop-blur-sm"
//                           style={{ minHeight: `${totalMinHeight}px` }}
//                           onLayout={() => setResizing(false)}
//                         >
//                           {rows.map((rowItems, rowIndex) => (
//                             <React.Fragment key={`row-${rowIndex}`}>
//                               {rowIndex > 0 && (
//                                 <PanelResizeHandle onDragging={setResizing}>
//                                   <ResizeHandle direction="vertical" />
//                                 </PanelResizeHandle>
//                               )}
//                               <Panel defaultSize={100 / rows.length} minSize={30}>
//                                 <PanelGroup direction="horizontal">
//                                   {rowItems.map((item, idx) => (
//                                     <React.Fragment key={`item-${item.id}`}>
//                                       {idx > 0 && (
//                                         <PanelResizeHandle onDragging={setResizing}>
//                                           <ResizeHandle direction="horizontal" />
//                                         </PanelResizeHandle>
//                                       )}
//                                       <Panel defaultSize={100 / rowItems.length} minSize={30}>
//                                         <Draggable id={item.sortableId}>
//                                           <div className="h-full" style={{ minHeight: `${minHeightPerRow - 50}px` }}>
//                                             {renderPlot(item, rowIndex * 2 + idx, visibleItems)}
//                                           </div>
//                                         </Draggable>
//                                       </Panel>
//                                     </React.Fragment>
//                                   ))}
//                                 </PanelGroup>
//                               </Panel>
//                             </React.Fragment>
//                           ))}
//                         </PanelGroup>
//                       </SortableContext>
//                     );
//                   })()}
//                 </DroppableArea>
//               </section>
//             </main>
//           </div>

//           <AnimatePresence>
//             {showUnsavedModal && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
//               >
//                 <motion.div
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   exit={{ scale: 0.9, opacity: 0 }}
//                   className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//                 >
//                   <div className="text-center ">
//                     <div className="w-16 h- bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
//                         />
//                       </svg>
//                     </div>
//                     <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                       Unsaved Changes
//                     </h2>
//                     <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                       You have unsaved changes. Would you like to save before{' '}
//                       {pendingNavigation ? `navigating to ${pendingNavigation.label}` : pendingTab ? `switching to ${pendingTab}` : 'leaving'}?
//                     </p>
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={handleSaveAndNavigate}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md"
//                     >
//                       Save & Continue
//                     </button>
//                     <button
//                       onClick={handleConfirmNavigation}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md"
//                     >
//                       Leave Anyway
//                     </button>
//                   </div>
//                   <button
//                     onClick={handleCancelNavigation}
//                     className="w-full mt-3 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {showSavedModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)] text-center"
//               >
//                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <BiSolidSave className="w-8 h-8 text-green-500" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">Dashboard Saved!</h2>
//                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                   Your changes have been saved successfully.
//                 </p>
//               </motion.div>
//             </motion.div>
//           )}

//           <DragStartModal
//             isOpen={showDragModal}
//             onClose={() => {
//               setShowDragModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             onSearch={handleStockSearch}
//             searchTerm={searchTerm}
//             setSearchTerm={(value) => {
//               setSearchTerm(value);
//               setError(null);
//               if (value.length >= 2) handleStockSearch();
//               else setSearchedStocks([]);
//             }}
//             searchedStocks={searchedStocks}
//             onSelectItem={(item) => {
//               if (currentDragItem) {
//                 setDroppedMap((prev) => {
//                   const currentTab = prev[activeTab] || { general: [] };
//                   const generalItems = currentTab.general || [];
//                   const lastItemIndex = generalItems.findLastIndex(
//                     (i) => i.label === currentDragItem.label && !i.symbol
//                   );
//                   if (lastItemIndex >= 0) {
//                     const updatedItems = [...generalItems];
//                     updatedItems[lastItemIndex] = {
//                       ...updatedItems[lastItemIndex],
//                       symbol: item.symbol,
//                       companyName: item.companyName,
//                       type: 'equity',
//                       sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                     };
//                     return { ...prev, [activeTab]: { ...currentTab, general: updatedItems } };
//                   } else {
//                     const newItem = {
//                       label: currentDragItem.label,
//                       symbol: item.symbol,
//                       companyName: item.companyName,
//                       graphType: currentDragItem.label,
//                       id: `${currentDragItem.label}-${Date.now()}`,
//                       type: 'equity',
//                       sortableId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//                     };
//                     return { ...prev, [activeTab]: { ...currentTab, general: [...generalItems, newItem] } };
//                   }
//                 });
//                 setDragCountMap((prev) => ({
//                   ...prev,
//                   [activeTab]: {
//                     ...prev[activeTab],
//                     [currentDragItem.label]: (prev[activeTab]?.[currentDragItem.label] || 0) + 1,
//                   },
//                 }));
//                 setHasUnsavedChanges(true);
//               }
//               setSearchTerm('');
//               setSearchedStocks([]);
//               setShowDragModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             onClear={() => {
//               setSearchTerm('');
//               setSearchedStocks([]);
//               setError(null);
//             }}
//             selectedCompany={null}
//             error={error}
//           />

//           <PortfolioSelectModal
//             isOpen={showPortfolioModal}
//             onClose={() => {
//               setShowPortfolioModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             portfolios={savedPortfolios}
//             onSelectPortfolio={handlePortfolioSelect}
//             error={error}
//           />

//           {showDeleteModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//               >
//                 <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-4">
//                   Confirm Deletion
//                 </h2>
//                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mb-6">
//                   Are you sure you want to delete your account? This action cannot be undone.
//                 </p>
//                 <div className="flex gap-4">
//                   <button
//                     onClick={handleDeleteAccount}
//                     className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     className="flex-1 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-all duration-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </div>
//       </DndContext>
//     </div>
//   );
// };

// export default DashBoard;













// ------------------wc 07/10/2025---------------------------



// import React, { useEffect, useState, useRef } from 'react';
// import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
// import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import Navbar from '../Navbar';
// import { MdOutlineDashboardCustomize, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
// import { BiSolidSave } from 'react-icons/bi';
// import { IoMdClose, IoMdSave } from 'react-icons/io';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Modal from 'react-modal';
// import SidebarRight from './SidebarRight';
// import AddNewModal from './AddNewModal';
// import DragStartModal from './DragStartModal';
// import DroppableArea from './DroppableArea';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { GoSidebarExpand } from 'react-icons/go';
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';
// import PortfolioSelectModal from './PortfolioSelectModal';
// import { Search } from 'lucide-react';
// import SearchList from '../EquityHub/SearchList';
// import { useAuth } from '../AuthContext';
// import { CiLogout } from 'react-icons/ci';
// import { logActivity } from '../../services/api';
// import { IoMdArrowDropdown } from 'react-icons/io';
// import axios from 'axios';
// import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
// import { FaChartLine, FaBriefcase, FaInfoCircle, FaRocket } from 'react-icons/fa';
// import DraggableItem from './DraggableItem';
// import ResizeHandle from './ResizeHandle';
// import { Helmet } from 'react-helmet-async';

// Modal.setAppElement('#root');

// // Custom Draggable component
// const Draggable = ({ id, children }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// };

// const DashBoard = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [showModal, setShowModal] = useState(false);
//   const [tabs, setTabs] = useState(['Dashboard 1']);
//   const [activeTab, setActiveTab] = useState('Dashboard 1');
//   const [uploadId, setUploadId] = useState(null);
//   const [platform, setPlatform] = useState('');
//   const [symbol, setSymbol] = useState(null);
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [savedPortfolios, setSavedPortfolios] = useState([]);
//   const [droppedMap, setDroppedMap] = useState({ 'Dashboard 1': { general: [] } });
//   const [savedDroppedMap, setSavedDroppedMap] = useState({});
//   const [editingTab, setEditingTab] = useState(null);
//   const [editedTabName, setEditedTabName] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchedStocks, setSearchedStocks] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showDragModal, setShowDragModal] = useState(false);
//   const [showPortfolioModal, setShowPortfolioModal] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [dragCountMap, setDragCountMap] = useState({ 'Dashboard 1': {} });
//   const [currentDragItem, setCurrentDragItem] = useState(null);
//   const [error, setError] = useState(null);
//   const [showUnsavedModal, setShowUnsavedModal] = useState(false);
//   const [showSavedModal, setShowSavedModal] = useState(false);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [pendingNavigation, setPendingNavigation] = useState(null);
//   const [pendingTab, setPendingTab] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const [sticky, setSticky] = useState(false);
//   const [userType, setUserType] = useState(null);
//   const [fullName, setFullName] = useState('');
//   const initialQuery = queryParams.get('query') || '';
//   const [isDisabled, setIsDisabled] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const { login, logout } = useAuth();
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
//   const drawerRef = useRef(null);
//   const [resizing, setResizing] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('#portfolio-dropdown')) {
//         setIsPortfolioOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setSticky(window.scrollY > 0);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const currentTab = droppedMap[activeTab] || { general: [] };
//     const savedTab = savedDroppedMap[activeTab] || { general: [] };
//     const hasChanges = JSON.stringify(currentTab.general) !== JSON.stringify(savedTab.general);
//     setHasUnsavedChanges(hasChanges);
//   }, [droppedMap, activeTab, savedDroppedMap]);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) setIsLoggedIn(true);
//   }, []);

//   useEffect(() => {
//     const storedUploadId = localStorage.getItem('uploadId');
//     const storedPlatform = localStorage.getItem('platform');
//     if (storedUploadId && storedPlatform) {
//       setUploadId(storedUploadId);
//       setPlatform(storedPlatform);
//     }
//   }, []);

//   const fetchSavedPortfolio = async () => {
//     try {
//       setError('');
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError('Please login to view your portfolios');
//         return;
//       }
//       const response = await fetch(`${API_BASE}/file/saved`, {
//         method: 'GET',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) {
//         const err = await response.json();
//         setError(err.error || 'Failed to fetch saved portfolios');
//         return;
//       }
//       const data = await response.json();
//       if (data.length > 0) {
//         setSavedPortfolios(data);
//         setUploadId(data[0].uploadId);
//         setPlatform(data[0].platform);
//       } else {
//         setSavedPortfolios([]);
//         setError('No portfolios found');
//       }
//     } catch (err) {
//       console.error('Error fetching saved portfolios:', err);
//       setError('Network error. Please try again later.');
//     }
//   };

//   useEffect(() => {
//     fetchSavedPortfolio();
//   }, [API_BASE]);

//   const handleStockSearch = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/stocks/test/search?query=${searchTerm}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       if (Array.isArray(data) && data.length > 0) {
//         setSearchedStocks(data);
//         setSavedStocks(data);
//       } else {
//         setSearchedStocks([]);
//         toast.info('No stocks found for the search term.');
//         setError('Company not found');
//       }
//     } catch (err) {
//       console.error('Error fetching stock suggestions:', err);
//       setSearchedStocks([]);
//       setError('Company not found in our list. Please check the name and search again.');
//     }
//   };

//   const handleRenameTab = (oldName, newName) => {
//     if (!newName || newName.trim() === '') return;
//     if (tabs.includes(newName)) {
//       toast.info('A dashboard with this name already exists.');
//       return;
//     }
//     setTabs((prevTabs) => prevTabs.map((tab) => (tab === oldName ? newName : tab)));
//     setDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[newName] = prev[oldName];
//       delete updated[oldName];
//       return updated;
//     });
//     setSavedDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[newName] = prev[oldName];
//       delete updated[oldName];
//       return updated;
//     });
//     setDragCountMap((prev) => {
//       const updated = { ...prev };
//       updated[newName] = prev[oldName];
//       delete updated[oldName];
//       return updated;
//     });
//     if (activeTab === oldName) setActiveTab(newName);
//     setEditingTab(null);
//     setEditedTabName('');
//   };

//   const handleDeleteComponent = (index) => {
//     setDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[activeTab] = {
//         ...prev[activeTab],
//         general: prev[activeTab].general.filter((_, idx) => idx !== index),
//       };
//       return updated;
//     });
//     const label = droppedMap[activeTab].general[index].label;
//     const remaining = droppedMap[activeTab].general.filter((item, idx) => idx !== index && item.label === label);
//     if (remaining.length === 0) {
//       setDragCountMap((prev) => ({
//         ...prev,
//         [activeTab]: { ...prev[activeTab], [label]: 0 },
//       }));
//     }
//     setHasUnsavedChanges(true);
//   };

//   const handleClearCompany = (companyName) => {
//     setDroppedMap((prev) => ({
//       ...prev,
//       [activeTab]: {
//         ...prev[activeTab],
//         general: prev[activeTab].general.filter((item) => item.companyName !== companyName),
//       },
//     }));
//     const affectedLabels = droppedMap[activeTab].general
//       .filter((item) => item.companyName === companyName)
//       .map((item) => item.label);
//     setDragCountMap((prev) => {
//       const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//       affectedLabels.forEach((label) => {
//         const remaining = droppedMap[activeTab].general.filter(
//           (item) => item.label === label && item.companyName !== companyName
//         );
//         updated[activeTab][label] = remaining.length > 0 ? prev[activeTab][label] || 1 : 0;
//       });
//       return updated;
//     });
//     toast.success(`Company ${companyName} and associated graphs removed`);
//     setHasUnsavedChanges(true);
//   };

//   const generateDefaultDashboardName = async (baseName = 'Dashboard') => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboards');
//       const data = await response.json();
//       const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//       let index = 1;
//       let defaultName;
//       do {
//         defaultName = `${baseName} ${index}`;
//         index++;
//       } while (existingNames.includes(defaultName) || tabs.includes(defaultName));
//       return defaultName;
//     } catch (err) {
//       console.error('Error fetching dashboards for name generation:', err);
//       let index = 1;
//       let defaultName;
//       do {
//         defaultName = `${baseName} ${index}`;
//         index++;
//       } while (tabs.includes(defaultName));
//       return defaultName;
//     }
//   };

//   const handleNewDashboard = async (title) => {
//     const newTitle = title && title.trim() ? title : await generateDefaultDashboardName();
//     if (tabs.includes(newTitle)) {
//       toast.info('A dashboard with this name already exists.');
//       return;
//     }
//     setTabs((prev) => [...prev, newTitle]);
//     setDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//     setSavedDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//     setActiveTab(newTitle);
//     setShowModal(false);
//     setDragCountMap((prev) => ({ ...prev, [newTitle]: {} }));
//     setIsMenuOpen(false);
//     setHasUnsavedChanges(false);
//   };

//   const handleDragStart = (event) => {
//     const { active } = event;
//     const label = active?.data?.current?.label;
//     setCurrentDragItem(active?.data?.current);
//     const equityLabels = Object.keys(equityHubMap);
//     const portfolioLabels = Object.keys(portfolioMap);
//     if (equityLabels.includes(label)) {
//       const currentDragCount = dragCountMap[activeTab]?.[label] || 0;
//       if (currentDragCount === 0 && !droppedMap[activeTab].general.some((item) => item.label === label)) {
//         setShowDragModal(true);
//       } else if (currentDragCount >= 1) {
//         setShowDragModal(true);
//       }
//     } else if (portfolioLabels.includes(label)) {
//       setShowPortfolioModal(true);
//     }
//   };

//   const handleItemClick = (item) => {
//     const { id, label } = item;
//     const equityLabels = Object.keys(equityHubMap);
//     const portfolioLabels = Object.keys(portfolioMap);

//     let section = null;
//     if (equityLabels.includes(label)) section = 'equity';
//     if (portfolioLabels.includes(label)) section = 'portfolio';

//     if (section === 'equity') {
//       setCurrentDragItem({ label });
//       setShowDragModal(true);
//       return;
//     }

//     if (section === 'portfolio') {
//       setCurrentDragItem({ label });
//       setShowPortfolioModal(true);
//       return;
//     }
//   };

//   const handleDragEnd = (event) => {
//     const { over, active } = event;
//     const label = active?.data?.current?.label;
//     const id = active?.id;

//     // Handle reordering of existing items
//     if (active.data.current?.sortable) {
//       const items = droppedMap[activeTab]?.general || [];
//       const oldIndex = items.findIndex((item) => item.sortableId === active.id);
//       const newIndex = items.findIndex((item) => item.sortableId === over?.id);
//       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//         setDroppedMap((prev) => ({
//           ...prev,
//           [activeTab]: {
//             ...prev[activeTab],
//             general: arrayMove(prev[activeTab].general, oldIndex, newIndex),
//           },
//         }));
//         setHasUnsavedChanges(true);
//       }
//       return;
//     }

//     // Handle new item drop
//     if (!over || !label || !id) return;

//     const equityLabels = Object.keys(equityHubMap);
//     const portfolioLabels = Object.keys(portfolioMap);

//     if (equityLabels.includes(label)) {
//       setCurrentDragItem(active?.data?.current);
//       setShowDragModal(true);
//       return;
//     }

//     if (portfolioLabels.includes(label)) {
//       setCurrentDragItem(active?.data?.current);
//       setShowPortfolioModal(true);
//       return;
//     }
//   };

//   const handlePortfolioSelect = (portfolio) => {
//     if (currentDragItem) {
//       const uniqueId = `${currentDragItem.label}-${portfolio.uploadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//       const draggedItem = {
//         label: currentDragItem.label,
//         symbol: '',
//         companyName: '',
//         graphType: currentDragItem.label,
//         uploadId: portfolio.uploadId,
//         platform: portfolio.platform,
//         id: uniqueId,
//         type: 'portfolio',
//         sortableId: uniqueId,
//       };

//       setDroppedMap((prev) => {
//         const currentTab = prev[activeTab] || { general: [] };
//         const currentSection = currentTab.general || [];
//         return {
//           ...prev,
//           [activeTab]: { ...currentTab, general: [...currentSection, draggedItem] },
//         };
//       });
//       setUploadId(portfolio.uploadId);
//       setPlatform(portfolio.platform);
//       localStorage.setItem('uploadId', portfolio.uploadId.toString());
//       localStorage.setItem('platform', portfolio.platform);
//       setShowPortfolioModal(false);
//       setCurrentDragItem(null);
//       setHasUnsavedChanges(true);
//     }
//   };

//   const getVisibleItems = (items) => items;

//   const handleSaveDashboard = async () => {
//     const token = localStorage.getItem('authToken');
//     const userId = localStorage.getItem('userId');
//     const userType = localStorage.getItem('userType');
//     const generalPlots = droppedMap?.[activeTab]?.general || [];

//     if (!token) {
//       toast.error('Please login first to save your dashboard.');
//       return;
//     }

//     if (generalPlots.length === 0) {
//       toast.error('Please drag and drop at least one plot before saving.');
//       return;
//     }

//     let finalDashboardName = activeTab;

//     try {
//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboards');
//       const data = await response.json();
//       const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//       if (existingNames.includes(finalDashboardName)) {
//         finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//         setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//         setDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setSavedDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = { general: generalPlots };
//           if (activeTab !== finalDashboardName) delete updated[activeTab];
//           return updated;
//         });
//         setDragCountMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setActiveTab(finalDashboardName);
//         toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//       }
//     } catch (err) {
//       console.error('Error checking dashboard names:', err);
//       if (tabs.includes(finalDashboardName)) {
//         finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//         setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//         setDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setSavedDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = { general: generalPlots };
//           if (activeTab !== finalDashboardName) delete updated[activeTab];
//           return updated;
//         });
//         setDragCountMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setActiveTab(finalDashboardName);
//         toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//       }
//     }

//     const savedData = {
//       dashboard: { dashboardName: finalDashboardName, userId: userId ? parseInt(userId) : 0, userType: userType || '' },
//       equityHubPlots: [],
//       portfolioPlots: [],
//     };

//     generalPlots.forEach(({ label, symbol, companyName, graphType, uploadId, platform, type }) => {
//       if (type === 'equity') {
//         let finalSymbol = symbol;
//         let finalCompany = companyName;

//         if (!finalSymbol || !finalCompany) {
//           const matched = savedStocks.find(
//             (stock) => stock.symbol === finalSymbol || stock.graphType === graphType || stock.label === label
//           );
//           if (matched) {
//             finalSymbol = finalSymbol || matched.symbol;
//             finalCompany = finalCompany || matched.companyName;
//           }
//         }

//         savedData.equityHubPlots.push({ symbol: finalSymbol, companyName: finalCompany, graphType: graphType || label });
//       } else if (type === 'portfolio') {
//         savedData.portfolioPlots.push({ uploadId, platform, graphType: label });
//       }
//     });

//     try {
//       const response = await fetch(`${API_BASE}/dashboard/save`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(savedData),
//       });
//       if (response.ok) {
//         const result = await response.json();
//         setSavedDroppedMap((prev) => ({
//           ...prev,
//           [finalDashboardName]: { general: generalPlots },
//         }));
//         setHasUnsavedChanges(false);
//         setShowSavedModal(true);
//         setTimeout(() => setShowSavedModal(false), 2000);
//       } else {
//         toast.error('Failed to save dashboard');
//       }
//     } catch (err) {
//       console.error('Save failed:', err);
//       toast.error('Save failed');
//     }
//     setIsMenuOpen(false);
//   };

//   const handleDeleteDashboardAPI = async (dashboardName) => {
//     if (hasUnsavedChanges) {
//       setPendingTab(dashboardName);
//       setShowUnsavedModal(true);
//       return;
//     }
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashboardName}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to delete dashboard');
//       setTabs((prev) => prev.filter((tab) => tab !== dashboardName));
//       setDroppedMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       setSavedDroppedMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       setDragCountMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       if (activeTab === dashboardName) {
//         const remainingTabs = tabs.filter((tab) => tab !== dashboardName);
//         setActiveTab(remainingTabs[0] || '');
//       }
//       toast.success('Dashboard deleted successfully');
//       setIsMenuOpen(false);
//     } catch (err) {
//       console.error('Delete error:', err);
//       toast.error('Failed to delete dashboard');
//     }
//   };

//   const getUniqueCompanies = () => {
//     const generalItems = droppedMap[activeTab]?.general || [];
//     return [...new Set(generalItems.filter((item) => item.companyName).map((item) => item.companyName))];
//   };

//   const isDashboardEmpty = () => {
//     const currentTab = droppedMap[activeTab] || { general: [] };
//     return currentTab.general.length === 0;
//   };

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > 3600000) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       setError('Failed to parse cached data.');
//       console.error('Cache parse error:', err);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       setError('Failed to cache data.');
//       console.error('Cache set error:', err);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//     setResults([]);
//     setError(null);
//   };

//   const handleLoginClick = () => setShowLoginModal(true);
//   const handleCloseModal = () => setShowLoginModal(false);
//   const handleLoginSuccess = () => {
//     login();
//     handleCloseModal();
//   };

//   const handleLogout = () => {
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label: 'logout', path: '/' });
//       setShowUnsavedModal(true);
//       setShowSavedModal(false);
//       return;
//     }
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('userEmail');
//     logout();
//     toast.success('Logout successfully!');
//     navigate('/');
//   };

//   const handleDeleteAccount = async () => {
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label: 'deleteAccount', path: '/' });
//       setShowUnsavedModal(true);
//       setShowSavedModal(false);
//       return;
//     }
//     const apiUrl =
//       userType === "corporate"
//         ? `${API_BASE}/corporate/delete-account`
//         : `${API_BASE}/Userprofile/delete-account`;

//     try {
//       await axios.delete(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       toast.success('Account deleted successfully');
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('userType');
//       localStorage.removeItem('hasShownQuizPopup');
//       logout();
//       navigate('/');
//       setShowDeleteModal(false);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete account');
//     }
//   };

//   const handleNavClick = async (label, path, state = {}) => {
//     setShowSavedModal(false);
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label, path, state });
//       setShowUnsavedModal(true);
//     } else {
//       await logActivity(`${label} tab clicked`);
//       navigate(path, { state });
//     }
//   };

//   const handleTabSwitch = (tab) => {
//     setShowSavedModal(false);
//     if (hasUnsavedChanges && activeTab !== tab) {
//       setPendingTab(tab);
//       setShowUnsavedModal(true);
//     } else {
//       setActiveTab(tab);
//       setIsMenuOpen(false);
//     }
//   };

//   const handleConfirmNavigation = async () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     if (pendingNavigation) {
//       if (pendingNavigation.label === 'logout') {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logout successfully!');
//         navigate('/');
//       } else if (pendingNavigation.label === 'deleteAccount') {
//         await handleDeleteAccount();
//       } else if (pendingNavigation.label === 'addDashboard') {
//         setShowModal(true);
//         setIsMenuOpen(false);
//       } else {
//         await logActivity(`${pendingNavigation.label} tab clicked`);
//         navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//       }
//       setPendingNavigation(null);
//     } else if (pendingTab) {
//       setActiveTab(pendingTab);
//       setPendingTab(null);
//       setIsMenuOpen(false);
//     }
//   };

//   const handleCancelNavigation = () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     setPendingNavigation(null);
//     setPendingTab(null);
//   };

//   const handleSaveAndNavigate = async () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     await handleSaveDashboard();
//     setShowSavedModal(false);
//     if (pendingNavigation) {
//       if (pendingNavigation.label === 'logout') {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logout successfully!');
//         navigate('/');
//       } else if (pendingNavigation.label === 'deleteAccount') {
//         await handleDeleteAccount();
//       } else if (pendingNavigation.label === 'addDashboard') {
//         setShowModal(true);
//         setIsMenuOpen(false);
//       } else {
//         await logActivity(`${pendingNavigation.label} tab clicked`);
//         navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//       }
//       setPendingNavigation(null);
//     } else if (pendingTab) {
//       setActiveTab(pendingTab);
//       setPendingTab(null);
//       setIsMenuOpen(false);
//     }
//   };

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
//     useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
//   );

//   const handleTopCompanyClick = async () => {
//     try {
//       const apiUrl = `${API_BASE}/market/top-company`;
//       const response = await fetch(apiUrl, { method: 'GET' });
//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || 'Failed to fetch top company');
//       }
//       const topCompany = await response.json();
//       if (!topCompany || !topCompany.Symbol || !topCompany.CompanyName) {
//         toast.error('No top company data available.');
//         return;
//       }

//       const plotsToAdd = [
//         { label: 'MacdPlot', graphType: 'MacdPlot' },
//         { label: 'SensexCalculator', graphType: 'SensexCalculator' },
//         { label: 'CandlePatternPlot', graphType: 'CandlePatternPlot' },
//       ];

//       setDroppedMap((prev) => {
//         const currentTab = prev[activeTab] || { general: [] };
//         const currentSection = currentTab.general || [];
//         const newItems = plotsToAdd.map((plot) => {
//           const uniqueId = `${plot.label}-${topCompany.Symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//           return {
//             label: plot.label,
//             symbol: topCompany.Symbol,
//             companyName: topCompany.CompanyName,
//             graphType: plot.graphType,
//             id: uniqueId,
//             type: 'equity',
//             sortableId: uniqueId,
//           };
//         });
//         return {
//           ...prev,
//           [activeTab]: { ...currentTab, general: [...currentSection, ...newItems] },
//         };
//       });

//       setDragCountMap((prev) => {
//         const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//         plotsToAdd.forEach((plot) => {
//           updated[activeTab][plot.label] = (updated[activeTab][plot.label] || 0) + 1;
//         });
//         return updated;
//       });

//       setHasUnsavedChanges(true);
//       toast.success(`Sample Dashboard is added for ${topCompany.CompanyName}`);
//     } catch (err) {
//       setError('Failed to fetch top company plots.');
//       toast.error('Failed to fetch top company plots.');
//     }
//   };

//   const renderPlot = (plotItem, index, allItems) => {
//     const { label, symbol, companyName, id, uploadId, platform, type } = plotItem;
//     console.log(`Rendering plot: ${label}, symbol: ${symbol}, id: ${id}`); // Debug log
//     const ComponentMap = type === 'equity' ? equityHubMap : portfolioMap;
//     const Component = ComponentMap[label];

//     if (!Component) {
//       return (
//         <motion.div
//           key={`general-${id}`}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3, delay: index * 0.1 }}
//           className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-200 dark:border-red-800/50 h-full"
//         >
//           <button
//             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//             className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//             aria-label="Delete component"
//           >
//             <IoMdClose size={18} />
//           </button>
//           <div className="text-center py-8">
//             <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <IoMdClose className="text-red-500 text-xl" />
//             </div>
//             <p className="text-red-500 font-medium">Component "{label}" not found</p>
//           </div>
//         </motion.div>
//       );
//     }

//     if (type === 'equity' && !symbol) {
//       return (
//         <motion.div
//           key={`general-${id}`}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3, delay: index * 0.1 }}
//           className="relative bg-white dark:bg-[var(--background-dark)] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-200 dark:border-yellow-800/50 h-full"
//         >
//           <button
//             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//             className="absolute top-4 right-4 p-2 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//             aria-label="Delete component"
//           >
//             <IoMdClose size={18} />
//           </button>
//           <div className="text-center py-8">
//             <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <p className="text-yellow-600 dark:text-yellow-400 font-medium">Waiting for company selection</p>
//             <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 text-sm mt-1">for {label}</p>
//           </div>
//         </motion.div>
//       );
//     }

//     return (
//       <motion.div
//         key={`general-${id}`}
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3, delay: index * 0.1 }}
//         className="relative bg-white dark:bg-[var(--background-dark)] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border)] dark:border-[var(--border-dark)] h-full group"
//       >
//         <div className="flex items-center justify-between p-4 border-b border-[var(--border)] dark:border-[var(--border-dark)] bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-t-xl">
//           <h3 className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate flex items-center gap-2">
//             <span className="w-2 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"></span>
//             {label}
//             <span className="text-xs text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//               {companyName ? `(${companyName})` : platform ? `(${platform})` : ''}
//             </span>
//           </h3>
//           <button
//             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//             className="p-1.5 text-[var(--text)]/60 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
//             aria-label="Delete component"
//           >
//             <IoMdClose size={16} />
//           </button>
//         </div>

//         <div className="p-4 min-h-[800px]">
//           {type === 'equity' ? (
//             <Component symbol={symbol || ''} key={`${id}-${symbol || 'default'}`} />
//           ) : (
//             <GraphDataProvider>
//               <Component uploadId={uploadId} key={`${id}-${uploadId}`} />
//             </GraphDataProvider>
//           )}
//         </div>

//         <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/30 rounded-xl pointer-events-none transition-all duration-300" />
//       </motion.div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background-dark)] flex flex-col transition-colors duration-300">
//       <style jsx>{`
//         :root {
//           --primary: #2563eb;
//           --primary-dark: #1e40af;
//           --secondary: #7c3aed;
//           --secondary-dark: #5b21b6;
//           --background: #f8fafc;
//           --background-dark: #0f172a;
//           --text: #1e293b;
//           --text-dark: #e2e8f0;
//           --border: #e5e7eb;
//           --border-dark: #374151;
//         }

//         html, body {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           line-height: 1.5;
//           color: var(--text);
//         }

//         .dark {
//           color: var(--text-dark);
//           background-color: var(--background-dark);
//         }

//         .scrollbar-thin {
//           scrollbar-width: thin;
//           scrollbar-color: var(--primary) var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar {
//           width: 8px;
//         }

//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary);
//           border-radius: 4px;
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border-dark);
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary-dark);
//         }

//         .tooltip {
//           position: relative;
//           display: inline-block;
//         }

//         .tooltip .tooltip-text {
//           visibility: hidden;
//           width: 200px;
//           background-color: #1e293b;
//           color: #fff;
//           text-align: center;
//           border-radius: 6px;
//           padding: 8px;
//           position: absolute;
//           z-index: 1000;
//           bottom: 125%;
//           left: 50%;
//           transform: translateX(-50%);
//           opacity: 0;
//           transition: opacity 0.3s;
//           font-size: 12px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .tooltip:hover .tooltip-text {
//           visibility: visible;
//           opacity: 1;
//         }

//         .dark .tooltip .tooltip-text {
//           background-color: #e2e8f0;
//           color: #1e293b;
//         }
//       `}</style>

//       <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-[var(--background-dark)] shadow-sm">
//         <Helmet>
//           <link rel="canonical" href="https://cmdahub.com/researchpanel" />
//         </Helmet>
//         <Navbar
//           handleNavClick={handleNavClick}
//           hasUnsavedChanges={hasUnsavedChanges}
//           setPendingNavigation={setPendingNavigation}
//           setShowUnsavedModal={setShowUnsavedModal}
//         />
//       </div>

//       <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//         <div className="flex flex-1 mt-16">
//           <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] z-40">
//             <SidebarRight collapsed={collapsed} setCollapsed={setCollapsed} onItemClick={handleItemClick} />
//           </div>

//           {showModal && <AddNewModal onClose={() => setShowModal(false)} onCreateTab={handleNewDashboard} />}

//           <div
//             className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'pr-14' : 'pr-80'} overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin`}
//           >
//             <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//               <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/80 dark:bg-slate-900 backdrop-blur-lg rounded-xl p-2 dark:border-[var(--border-dark)] shadow-sm">
//                 {tabs.map((tab) => (
//                   <div
//                     key={tab}
//                     className="flex items-center bg-[var(--background)] dark:bg-[var(--background-dark)] px-3 py-1.5 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                   >
//                     {editingTab === tab ? (
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="text"
//                           value={editedTabName}
//                           onChange={(e) => setEditedTabName(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && handleRenameTab(tab, editedTabName)}
//                           className="w-32 px-2 py-1 bg-white dark:bg-[var(--background-dark)] border border-[var(--border)] dark:border-[var(--border-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
//                           autoFocus
//                         />
//                         <button
//                           onClick={() => handleRenameTab(tab, editedTabName)}
//                           className="p-1 text-green-600 hover:text-green-700 transition-colors"
//                           title="Save"
//                         >
//                           <IoMdSave size={16} />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleTabSwitch(tab)}
//                           className={`text-sm font-medium transition-all duration-200 ${activeTab === tab
//                             ? 'text-[var(--primary)]'
//                             : 'text-[var(--text)] dark:text-[var(--text-dark)] hover:text-[var(--primary)]'
//                             }`}
//                         >
//                           {tab}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setEditingTab(tab);
//                             setEditedTabName(tab);
//                           }}
//                           className="p-1 text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors"
//                           title="Rename"
//                         >
//                           <MdOutlineDriveFileRenameOutline size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteDashboardAPI(tab)}
//                           className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors"
//                           title="Delete"
//                         >
//                           <IoMdClose size={16} />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => {
//                       setShowSavedModal(false);
//                       if (hasUnsavedChanges) {
//                         setPendingNavigation({ label: 'addDashboard', path: null });
//                         setShowUnsavedModal(true);
//                         return;
//                       }
//                       setShowModal(true);
//                       setIsMenuOpen(false);
//                     }}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                     data-tour="dashboard-add"
//                   >
//                     <MdOutlineDashboardCustomize size={18} /> Add Dashboard
//                   </button>

//                   <div className="relative inline-block">
//                     <button
//                       onClick={handleTopCompanyClick}
//                       className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
//                       data-tour="top-company"
//                     >
//                       <FaRocket size={18} /> Market Leader
//                       <div className="absolute bottom-0 right-0 group">
//                         <FaInfoCircle size={14} className="text-white/80 cursor-pointer" />
//                         <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                           Adds MACD, Sensex Calculator, and Candlestick plots.
//                         </span>
//                       </div>
//                     </button>
//                   </div>

//                   <button
//                     onClick={handleSaveDashboard}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                     data-tour="dashboard-save"
//                   >
//                     <BiSolidSave size={18} /> Save
//                   </button>

//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setShowSavedModal(false);
//                       if (!isLoggedIn) {
//                         toast.error('Login first to see your dashboards.');
//                         return;
//                       }
//                       handleNavClick('Saved Dashboards', '/saveddashboard');
//                     }}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                     data-tour="dashboard-saved"
//                   >
//                     <BiSolidSave size={18} /> Saved Dashboards
//                   </button>
//                 </div>
//               </div>

//               {getUniqueCompanies().length > 0 ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex flex-wrap gap-3 items-center mb-6 bg-white/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg rounded-xl p-4 border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                 >
//                   <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] bg-[var(--border)] dark:bg-[var(--border-dark)] px-3 py-1 rounded-full">
//                     Selected Stocks:
//                   </span>
//                   {getUniqueCompanies().map((companyName) => (
//                     <motion.div
//                       key={companyName}
//                       initial={{ scale: 0.8, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       className="flex items-center gap-2 px-3 py-1.5 bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                     >
//                       <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate max-w-[120px]">
//                         {companyName}
//                       </span>
//                       <button
//                         onClick={() => handleClearCompany(companyName)}
//                         className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                         title="Remove"
//                       >
//                         <IoMdClose size={14} />
//                       </button>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               ) : (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-sm text-[var(--text)]/60 dark:text-white mb-6 text-center py-4 bg-white/30 dark:bg-slate-900 rounded-xl border border-dashed border-[var(--border)] dark:border-[var(--border-dark)]"
//                 >
//                   No stocks selected. Add stocks from the sidebar to get started!
//                 </motion.p>
//               )}
//             </div>

//             <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
//               <section className="space-y-6">
//                 <div className="text-center">
//                   <motion.h2
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-2xl font-semibold bg-gray-700 bg-clip-text text-transparent dark:bg-gray-100"
//                   >
//                     Interactive Whiteboard
//                   </motion.h2>
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.1 }}
//                     className="text-[var(--text)]/70 dark:text-gray-300 mt-2 text-sm"
//                   >
//                     Drag components from the sidebar and resize plots using the handles
//                   </motion.p>
//                 </div>

//                 <DroppableArea id="general">
//                   {(() => {
//                     const droppedItems = droppedMap?.[activeTab]?.general || [];
//                     const visibleItems = getVisibleItems(
//                       droppedItems.map((item) => ({
//                         ...item,
//                         sortableId: item.sortableId || `item-${item.id}`,
//                       }))
//                     );

//                     if (visibleItems.length === 0) {
//                       return (
//                         <motion.div
//                           initial={{ opacity: 0, scale: 0.95 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="flex flex-col items-center py-20 min-h-[900px] px-4 bg-white/50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-[var(--border)] dark:border-[var(--border-dark)] shadow-inner"
//                         >
//                           <motion.div
//                             animate={{
//                               y: [0, -10, 0],
//                               rotate: [0, 5, -5, 0],
//                             }}
//                             transition={{
//                               duration: 4,
//                               repeat: Infinity,
//                               ease: 'easeInOut',
//                             }}
//                             className="mb-4"
//                           >
//                             <svg
//                               className="h-20 w-20 text-[var(--primary)]/60 dark:text-gray-300"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="1.5"
//                                 d="M4 8v8m0 0h8m-8 0l8-8m4 8v-8m0 0H8m8 0l-8 8"
//                               />
//                             </svg>
//                           </motion.div>
//                           <h3 className="text-xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                             Your Whiteboard Awaits!
//                           </h3>
//                           <p className="text-[var(--text)]/70 dark:text-gray-300 text-center max-w-md">
//                             Drag and drop components from the sidebar to start building your dashboard.
//                             Resize plots using the visible handles for optimal layout.
//                           </p>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => setCollapsed(false)}
//                             className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg font-medium"
//                           >
//                             <GoSidebarExpand size={20} /> Open Sidebar
//                           </motion.button>
//                         </motion.div>
//                       );
//                     }

//                     const rows = [];
//                     for (let i = 0; i < visibleItems.length; i += 2) {
//                       rows.push(visibleItems.slice(i, i + 2));
//                     }

//                     const minHeightPerRow = 800;
//                     const totalMinHeight = Math.max(minHeightPerRow * rows.length, 900);

//                     return (
//                       <SortableContext items={visibleItems.map((item) => item.sortableId)} strategy={() => null}>
//                         <PanelGroup
//                           direction="vertical"
//                           className="rounded-2xl bg-white/30 backdrop-blur-sm"
//                           style={{ minHeight: `${totalMinHeight}px` }}
//                           onLayout={() => setResizing(false)}
//                         >
//                           {rows.map((rowItems, rowIndex) => (
//                             <React.Fragment key={`row-${rowIndex}`}>
//                               {rowIndex > 0 && (
//                                 <PanelResizeHandle onDragging={setResizing}>
//                                   <ResizeHandle direction="vertical" />
//                                 </PanelResizeHandle>
//                               )}
//                               <Panel defaultSize={100 / rows.length} minSize={40}>
//                                 <PanelGroup direction="horizontal">
//                                   {rowItems.map((item, idx) => (
//                                     <React.Fragment key={`item-${item.id}`}>
//                                       {idx > 0 && (
//                                         <PanelResizeHandle onDragging={setResizing}>
//                                           <ResizeHandle direction="horizontal" />
//                                         </PanelResizeHandle>
//                                       )}
//                                       <Panel defaultSize={100 / rowItems.length} minSize={30}>
//                                         <Draggable id={item.sortableId}>
//                                           <div className="h-full" style={{ minHeight: `${minHeightPerRow - 50}px` }}>
//                                             {renderPlot(item, rowIndex * 2 + idx, visibleItems)}
//                                           </div>
//                                         </Draggable>
//                                       </Panel>
//                                     </React.Fragment>
//                                   ))}
//                                 </PanelGroup>
//                               </Panel>
//                             </React.Fragment>
//                           ))}
//                         </PanelGroup>
//                       </SortableContext>
//                     );
//                   })()}
//                 </DroppableArea>
//               </section>
//             </main>
//           </div>

//           <AnimatePresence>
//             {showUnsavedModal && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
//               >
//                 <motion.div
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   exit={{ scale: 0.9, opacity: 0 }}
//                   className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//                 >
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
//                         />
//                       </svg>
//                     </div>
//                     <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                       Unsaved Changes
//                     </h2>
//                     <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                       You have unsaved changes. Would you like to save before{' '}
//                       {pendingNavigation ? `navigating to ${pendingNavigation.label}` : pendingTab ? `switching to ${pendingTab}` : 'leaving'}?
//                     </p>
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={handleSaveAndNavigate}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md"
//                     >
//                       Save & Continue
//                     </button>
//                     <button
//                       onClick={handleConfirmNavigation}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md"
//                     >
//                       Leave Anyway
//                     </button>
//                   </div>
//                   <button
//                     onClick={handleCancelNavigation}
//                     className="w-full mt-3 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {showSavedModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)] text-center"
//               >
//                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <BiSolidSave className="w-8 h-8 text-green-500" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">Dashboard Saved!</h2>
//                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                   Your changes have been saved successfully.
//                 </p>
//               </motion.div>
//             </motion.div>
//           )}

//           <DragStartModal
//             isOpen={showDragModal}
//             onClose={() => {
//               setShowDragModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             onSearch={handleStockSearch}
//             searchTerm={searchTerm}
//             setSearchTerm={(value) => {
//               setSearchTerm(value);
//               setError(null);
//               if (value.length >= 2) handleStockSearch();
//               else setSearchedStocks([]);
//             }}
//             searchedStocks={searchedStocks}
//             onSelectItem={(item) => {
//               if (currentDragItem) {
//                 const uniqueId = `${currentDragItem.label}-${item.symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//                 setDroppedMap((prev) => {
//                   const currentTab = prev[activeTab] || { general: [] };
//                   const generalItems = currentTab.general || [];
//                   const lastItemIndex = generalItems.findLastIndex(
//                     (i) => i.label === currentDragItem.label && !i.symbol
//                   );
//                   if (lastItemIndex >= 0) {
//                     const updatedItems = [...generalItems];
//                     updatedItems[lastItemIndex] = {
//                       ...updatedItems[lastItemIndex],
//                       symbol: item.symbol,
//                       companyName: item.companyName,
//                       type: 'equity',
//                       sortableId: uniqueId,
//                       id: uniqueId,
//                     };
//                     return { ...prev, [activeTab]: { ...currentTab, general: updatedItems } };
//                   } else {
//                     const newItem = {
//                       label: currentDragItem.label,
//                       symbol: item.symbol,
//                       companyName: item.companyName,
//                       graphType: currentDragItem.label,
//                       id: uniqueId,
//                       type: 'equity',
//                       sortableId: uniqueId,
//                     };
//                     return { ...prev, [activeTab]: { ...currentTab, general: [...generalItems, newItem] } };
//                   }
//                 });
//                 setDragCountMap((prev) => ({
//                   ...prev,
//                   [activeTab]: {
//                     ...prev[activeTab],
//                     [currentDragItem.label]: (prev[activeTab]?.[currentDragItem.label] || 0) + 1,
//                   },
//                 }));
//                 setHasUnsavedChanges(true);
//               }
//               setSearchTerm('');
//               setSearchedStocks([]);
//               setShowDragModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             onClear={() => {
//               setSearchTerm('');
//               setSearchedStocks([]);
//               setError(null);
//             }}
//             selectedCompany={null}
//             error={error}
//           />

//           <PortfolioSelectModal
//             isOpen={showPortfolioModal}
//             onClose={() => {
//               setShowPortfolioModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             portfolios={savedPortfolios}
//             onSelectPortfolio={handlePortfolioSelect}
//             error={error}
//           />

//           {showDeleteModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//               >
//                 <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-4">
//                   Confirm Deletion
//                 </h2>
//                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mb-6">
//                   Are you sure you want to delete your account? This action cannot be undone.
//                 </p>
//                 <div className="flex gap-4">
//                   <button
//                     onClick={handleDeleteAccount}
//                     className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     className="flex-1 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-all duration-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </div>
//       </DndContext>
//     </div>
//   );
// };

// export default DashBoard;





//new

// ------------------15-11-25-----------------

// import React, { useEffect, useState, useRef } from 'react';
// import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
// import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import Navbar from '../Navbar';
// import { MdOutlineDashboardCustomize, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
// import { BiSolidSave } from 'react-icons/bi';
// import { IoMdClose, IoMdSave } from 'react-icons/io';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Modal from 'react-modal';
// import SidebarRight from './SidebarRight';
// import AddNewModal from './AddNewModal';
// import DragStartModal from './DragStartModal';
// import DroppableArea from './DroppableArea';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { GoSidebarExpand } from 'react-icons/go';
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';
// import PortfolioSelectModal from './PortfolioSelectModal';
// import { Search } from 'lucide-react';
// import SearchList from '../EquityHub/SearchList';
// import { useAuth } from '../AuthContext';
// import { CiLogout } from 'react-icons/ci';
// import { logActivity } from '../../services/api';
// import { IoMdArrowDropdown } from 'react-icons/io';
// import axios from 'axios';
// import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
// import { FaChartLine, FaBriefcase, FaInfoCircle, FaRocket } from 'react-icons/fa';
// import DraggableItem from './DraggableItem';
// import ResizeHandle from './ResizeHandle';
// import { Helmet } from 'react-helmet-async';

// Modal.setAppElement('#root');

// // Graph size scores for all plot types
// const graphSizeScores = {
//   CandlePatternPlot: 80,
//   Heatmap: 50,
//   MacdPlot: 55,
//   SensexCalculator: 45,
//   CandleSpread: 55,
//   CandleBreach: 50,
//   LastTraded: 45,
//   AvgBoxPlots: 50,
//   WormsPlots: 50,
//   SensexStockCorrBar: 60,
//   SensexVsStockCorr: 60,
//   DelRate: 45,
//   IndustryBubble: 70,
//   PegyWormPlot: 55,

//   LatestInsights: 45,
//   ShortNseTable: 45,
//   PortfolioResults: 70,
//   PortfMatrics: 45,
//   TopTenScript: 60,
//   ShareholdingPlot: 55,
//   PriceAcquisitionPlot: 50,
//   StockDepAmtOverTime: 60,
//   CombinedBox: 65,
//   CreatePNL: 50,
//   SwotPlot: 50,
//   ComBubChart: 70,
//   InvAmtPlot: 65,
//   BestTradePlot: 50,
//   ClassifyStockRisk: 50,
//   EPSQuarterlyChart: 60,
//   default: 50,
// };

// // Maximum cumulative size score for a row
// const MAX_ROW_SIZE_SCORE = 100;

// // Custom Draggable component
// const Draggable = ({ id, children }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// };

// const DashBoard = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [showModal, setShowModal] = useState(false);
//   const [tabs, setTabs] = useState(['Dashboard 1']);
//   const [activeTab, setActiveTab] = useState('Dashboard 1');
//   const [uploadId, setUploadId] = useState(null);
//   const [platform, setPlatform] = useState('');
//   const [symbol, setSymbol] = useState(null);
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [savedPortfolios, setSavedPortfolios] = useState([]);
//   const [droppedMap, setDroppedMap] = useState({ 'Dashboard 1': { general: [] } });
//   const [savedDroppedMap, setSavedDroppedMap] = useState({});
//   const [editingTab, setEditingTab] = useState(null);
//   const [editedTabName, setEditedTabName] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchedStocks, setSearchedStocks] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showDragModal, setShowDragModal] = useState(false);
//   const [showPortfolioModal, setShowPortfolioModal] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [dragCountMap, setDragCountMap] = useState({ 'Dashboard 1': {} });
//   const [currentDragItem, setCurrentDragItem] = useState(null);
//   const [error, setError] = useState(null);
//   const [showUnsavedModal, setShowUnsavedModal] = useState(false);
//   const [showSavedModal, setShowSavedModal] = useState(false);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [pendingNavigation, setPendingNavigation] = useState(null);
//   const [pendingTab, setPendingTab] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const [sticky, setSticky] = useState(false);
//   const [userType, setUserType] = useState(null);
//   const [fullName, setFullName] = useState('');
//   const initialQuery = queryParams.get('query') || '';
//   const [isDisabled, setIsDisabled] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
//   const drawerRef = useRef(null);
//   const [resizing, setResizing] = useState(false);
//   const { login, logout } = useAuth();
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('#portfolio-dropdown')) {
//         setIsPortfolioOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setSticky(window.scrollY > 0);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const currentTab = droppedMap[activeTab] || { general: [] };
//     const savedTab = savedDroppedMap[activeTab] || { general: [] };
//     const hasChanges = JSON.stringify(currentTab.general) !== JSON.stringify(savedTab.general);
//     setHasUnsavedChanges(hasChanges);
//   }, [droppedMap, activeTab, savedDroppedMap]);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) setIsLoggedIn(true);
//   }, []);

//   useEffect(() => {
//     const storedUploadId = localStorage.getItem('uploadId');
//     const storedPlatform = localStorage.getItem('platform');
//     if (storedUploadId && storedPlatform) {
//       setUploadId(storedUploadId);
//       setPlatform(storedPlatform);
//     }
//   }, []);

//   const fetchSavedPortfolio = async () => {
//     try {
//       setError('');
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError('Please login to view your portfolios');
//         return;
//       }
//       const response = await fetch(`${API_BASE}/file/saved`, {
//         method: 'GET',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) {
//         const err = await response.json();
//         setError(err.error || 'Failed to fetch saved portfolios');
//         return;
//       }
//       const data = await response.json();
//       if (data.length > 0) {
//         setSavedPortfolios(data);
//         setUploadId(data[0].uploadId);
//         setPlatform(data[0].platform);
//       } else {
//         setSavedPortfolios([]);
//         setError('No portfolios found');
//       }
//     } catch (err) {
//       console.error('Error fetching saved portfolios:', err);
//       setError('Network error. Please try again later.');
//     }
//   };

//   useEffect(() => {
//     fetchSavedPortfolio();
//   }, [API_BASE]);

//   const handleStockSearch = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/stocks/test/search?query=${searchTerm}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       if (Array.isArray(data) && data.length > 0) {
//         setSearchedStocks(data);
//         setSavedStocks(data);
//       } else {
//         setSearchedStocks([]);
//         toast.info('No stocks found for the search term.');
//         setError('Company not found');
//       }
//     } catch (err) {
//       console.error('Error fetching stock suggestions:', err);
//       setSearchedStocks([]);
//       setError('Company not found in our list. Please check the name and search again.');
//     }
//   };

//   const handleRenameTab = (oldName, newName) => {
//     if (!newName || newName.trim() === '') return;
//     if (tabs.includes(newName)) {
//       toast.info('A dashboard with this name already exists.');
//       return;
//     }
//     setTabs((prevTabs) => prevTabs.map((tab) => (tab === oldName ? newName : tab)));
//     setDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[newName] = prev[oldName];
//       delete updated[oldName];
//       return updated;
//     });
//     setSavedDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[newName] = prev[oldName];
//       delete updated[oldName];
//       return updated;
//     });
//     setDragCountMap((prev) => {
//       const updated = { ...prev };
//       updated[newName] = prev[oldName];
//       delete updated[oldName];
//       return updated;
//     });
//     if (activeTab === oldName) setActiveTab(newName);
//     setEditingTab(null);
//     setEditedTabName('');
//   };

//   const handleDeleteComponent = (index) => {
//     setDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[activeTab] = {
//         ...prev[activeTab],
//         general: prev[activeTab].general.filter((_, idx) => idx !== index),
//       };
//       return updated;
//     });
//     const label = droppedMap[activeTab].general[index].label;
//     const remaining = droppedMap[activeTab].general.filter((item, idx) => idx !== index && item.label === label);
//     if (remaining.length === 0) {
//       setDragCountMap((prev) => ({
//         ...prev,
//         [activeTab]: { ...prev[activeTab], [label]: 0 },
//       }));
//     }
//     setHasUnsavedChanges(true);
//   };

//   const handleClearCompany = (companyName) => {
//     setDroppedMap((prev) => ({
//       ...prev,
//       [activeTab]: {
//         ...prev[activeTab],
//         general: prev[activeTab].general.filter((item) => item.companyName !== companyName),
//       },
//     }));
//     const affectedLabels = droppedMap[activeTab].general
//       .filter((item) => item.companyName === companyName)
//       .map((item) => item.label);
//     setDragCountMap((prev) => {
//       const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//       affectedLabels.forEach((label) => {
//         const remaining = droppedMap[activeTab].general.filter(
//           (item) => item.label === label && item.companyName !== companyName
//         );
//         updated[activeTab][label] = remaining.length > 0 ? prev[activeTab][label] || 1 : 0;
//       });
//       return updated;
//     });
//     toast.success(`Company ${companyName} and associated graphs removed`);
//     setHasUnsavedChanges(true);
//   };

//   const generateDefaultDashboardName = async (baseName = 'Dashboard') => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboards');
//       const data = await response.json();
//       const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//       let index = 1;
//       let defaultName;
//       do {
//         defaultName = `${baseName} ${index}`;
//         index++;
//       } while (existingNames.includes(defaultName) || tabs.includes(defaultName));
//       return defaultName;
//     } catch (err) {
//       console.error('Error fetching dashboards for name generation:', err);
//       let index = 1;
//       let defaultName;
//       do {
//         defaultName = `${baseName} ${index}`;
//         index++;
//       } while (tabs.includes(defaultName));
//       return defaultName;
//     }
//   };

//   const handleNewDashboard = async (title) => {
//     const newTitle = title && title.trim() ? title : await generateDefaultDashboardName();
//     if (tabs.includes(newTitle)) {
//       toast.info('A dashboard with this name already exists.');
//       return;
//     }
//     setTabs((prev) => [...prev, newTitle]);
//     setDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//     setSavedDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//     setActiveTab(newTitle);
//     setShowModal(false);
//     setDragCountMap((prev) => ({ ...prev, [newTitle]: {} }));
//     setIsMenuOpen(false);
//     setHasUnsavedChanges(false);
//   };

//   const handleDragStart = (event) => {
//     const { active } = event;
//     const label = active?.data?.current?.label;
//     setCurrentDragItem(active?.data?.current);
//     const equityLabels = Object.keys(equityHubMap);
//     const portfolioLabels = Object.keys(portfolioMap);
//     if (equityLabels.includes(label)) {
//       setShowDragModal(true);
//     } else if (portfolioLabels.includes(label)) {
//       setShowPortfolioModal(true);
//     }
//   };

//   const handleItemClick = (item) => {
//     const { id, label } = item;
//     const equityLabels = Object.keys(equityHubMap);
//     const portfolioLabels = Object.keys(portfolioMap);

//     let section = null;
//     if (equityLabels.includes(label)) section = 'equity';
//     if (portfolioLabels.includes(label)) section = 'portfolio';

//     if (section === 'equity') {
//       setCurrentDragItem({ label });
//       setShowDragModal(true);
//       return;
//     }

//     if (section === 'portfolio') {
//       setCurrentDragItem({ label });
//       setShowPortfolioModal(true);
//       return;
//     }
//   };

//   const handleDragEnd = (event) => {
//     const { over, active } = event;
//     const label = active?.data?.current?.label;
//     const id = active?.id;

//     // Handle reordering of existing items
//     if (active.data.current?.sortable) {
//       const items = droppedMap[activeTab]?.general || [];
//       const oldIndex = items.findIndex((item) => item.sortableId === active.id);
//       const newIndex = items.findIndex((item) => item.sortableId === over?.id);
//       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//         setDroppedMap((prev) => ({
//           ...prev,
//           [activeTab]: {
//             ...prev[activeTab],
//             general: arrayMove(prev[activeTab].general, oldIndex, newIndex),
//           },
//         }));
//         setHasUnsavedChanges(true);
//       }
//       return;
//     }

//     // Handle new item drop
//     if (!over || !label || !id) return;

//     const equityLabels = Object.keys(equityHubMap);
//     const portfolioLabels = Object.keys(portfolioMap);

//     if (equityLabels.includes(label)) {
//       setCurrentDragItem(active?.data?.current);
//       setShowDragModal(true);
//       return;
//     }

//     if (portfolioLabels.includes(label)) {
//       setCurrentDragItem(active?.data?.current);
//       setShowPortfolioModal(true);
//       return;
//     }
//   };

//   const handlePortfolioSelect = (portfolio) => {
//     if (currentDragItem) {
//       const uniqueId = `${currentDragItem.label}-${portfolio.uploadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//       const draggedItem = {
//         label: currentDragItem.label,
//         symbol: '',
//         companyName: '',
//         graphType: currentDragItem.label,
//         uploadId: portfolio.uploadId,
//         platform: portfolio.platform,
//         id: uniqueId,
//         type: 'portfolio',
//         sortableId: uniqueId,
//       };

//       setDroppedMap((prev) => {
//         const currentTab = prev[activeTab] || { general: [] };
//         const currentSection = currentTab.general || [];
//         return {
//           ...prev,
//           [activeTab]: { ...currentTab, general: [...currentSection, draggedItem] },
//         };
//       });
//       setUploadId(portfolio.uploadId);
//       setPlatform(portfolio.platform);
//       localStorage.setItem('uploadId', portfolio.uploadId.toString());
//       localStorage.setItem('platform', portfolio.platform);
//       setShowPortfolioModal(false);
//       setCurrentDragItem(null);
//       setHasUnsavedChanges(true);
//     }
//   };

//   const getVisibleItems = (items) => items;

//   const handleSaveDashboard = async () => {
//     const token = localStorage.getItem('authToken');
//     const userId = localStorage.getItem('userId');
//     const userType = localStorage.getItem('userType');
//     const generalPlots = droppedMap?.[activeTab]?.general || [];

//     if (!token) {
//       toast.error('Please login first to save your dashboard.');
//       return;
//     }

//     if (generalPlots.length === 0) {
//       toast.error('Please drag and drop at least one plot before saving.');
//       return;
//     }

//     let finalDashboardName = activeTab;

//     try {
//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboards');
//       const data = await response.json();
//       const existingNames = data.dashboards.map((dash) => dash.dashboardName);
//       if (existingNames.includes(finalDashboardName)) {
//         finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//         setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//         setDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setSavedDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = { general: generalPlots };
//           if (activeTab !== finalDashboardName) delete updated[activeTab];
//           return updated;
//         });
//         setDragCountMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setActiveTab(finalDashboardName);
//         toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//       }
//     } catch (err) {
//       console.error('Error checking dashboard names:', err);
//       if (tabs.includes(finalDashboardName)) {
//         finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//         setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//         setDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setSavedDroppedMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = { general: generalPlots };
//           if (activeTab !== finalDashboardName) delete updated[activeTab];
//           return updated;
//         });
//         setDragCountMap((prev) => {
//           const updated = { ...prev };
//           updated[finalDashboardName] = prev[activeTab];
//           delete updated[activeTab];
//           return updated;
//         });
//         setActiveTab(finalDashboardName);
//         toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
//       }
//     }

//     const savedData = {
//       dashboard: { dashboardName: finalDashboardName, userId: userId ? parseInt(userId) : 0, userType: userType || '' },
//       equityHubPlots: [],
//       portfolioPlots: [],
//     };

//     generalPlots.forEach(({ label, symbol, companyName, graphType, uploadId, platform, type }) => {
//       if (type === 'equity') {
//         let finalSymbol = symbol;
//         let finalCompany = companyName;

//         if (!finalSymbol || !finalCompany) {
//           const matched = savedStocks.find(
//             (stock) => stock.symbol === finalSymbol || stock.graphType === graphType || stock.label === label
//           );
//           if (matched) {
//             finalSymbol = finalSymbol || matched.symbol;
//             finalCompany = finalCompany || matched.companyName;
//           }
//         }

//         savedData.equityHubPlots.push({ symbol: finalSymbol, companyName: finalCompany, graphType: graphType || label });
//       } else if (type === 'portfolio') {
//         savedData.portfolioPlots.push({ uploadId, platform, graphType: label });
//       }
//     });

//     try {
//       const response = await fetch(`${API_BASE}/dashboard/save`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(savedData),
//       });
//       if (response.ok) {
//         const result = await response.json();
//         setSavedDroppedMap((prev) => ({
//           ...prev,
//           [finalDashboardName]: { general: generalPlots },
//         }));
//         setHasUnsavedChanges(false);
//         setShowSavedModal(true);
//         setTimeout(() => setShowSavedModal(false), 2000);
//       } else {
//         toast.error('Failed to save dashboard');
//       }
//     } catch (err) {
//       console.error('Save failed:', err);
//       toast.error('Save failed');
//     }
//     setIsMenuOpen(false);
//   };

//   const handleDeleteDashboardAPI = async (dashboardName) => {
//     if (hasUnsavedChanges) {
//       setPendingTab(dashboardName);
//       setShowUnsavedModal(true);
//       return;
//     }
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashboardName}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to delete dashboard');
//       setTabs((prev) => prev.filter((tab) => tab !== dashboardName));
//       setDroppedMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       setSavedDroppedMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       setDragCountMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       if (activeTab === dashboardName) {
//         const remainingTabs = tabs.filter((tab) => tab !== dashboardName);
//         setActiveTab(remainingTabs[0] || '');
//       }
//       toast.success('Dashboard deleted successfully');
//       setIsMenuOpen(false);
//     } catch (err) {
//       console.error('Delete error:', err);
//       toast.error('Failed to delete dashboard');
//     }
//   };

//   const getUniqueCompanies = () => {
//     const generalItems = droppedMap[activeTab]?.general || [];
//     return [...new Set(generalItems.filter((item) => item.companyName).map((item) => item.companyName))];
//   };

//   const isDashboardEmpty = () => {
//     const currentTab = droppedMap[activeTab] || { general: [] };
//     return currentTab.general.length === 0;
//   };

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > 3600000) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       setError('Failed to parse cached data.');
//       console.error('Cache parse error:', err);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       setError('Failed to cache data.');
//       console.error('Cache set error:', err);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//     setResults([]);
//     setError(null);
//   };

//   const handleLoginClick = () => setShowLoginModal(true);
//   const handleCloseModal = () => setShowLoginModal(false);
//   const handleLoginSuccess = () => {
//     login();
//     handleCloseModal();
//   };
//   const handleLogout = () => {
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label: 'logout', path: '/' });
//       setShowUnsavedModal(true);
//       setShowSavedModal(false);
//       return;
//     }
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('userEmail');
//     logout();
//     toast.success('Logout successfully!');
//     navigate('/');
//   };

//   const handleDeleteAccount = async () => {
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label: 'deleteAccount', path: '/' });
//       setShowUnsavedModal(true);
//       setShowSavedModal(false);
//       return;
//     }
//     const apiUrl =
//       userType === 'corporate'
//         ? `${API_BASE}/corporate/delete-account`
//         : `${API_BASE}/Userprofile/delete-account`;

//     try {
//       await axios.delete(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       toast.success('Account deleted successfully');
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('userType');
//       localStorage.removeItem('hasShownQuizPopup');
//       logout();
//       navigate('/');
//       setShowDeleteModal(false);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete account');
//     }
//   };

//   const handleNavClick = async (label, path, state = {}) => {
//     setShowSavedModal(false);
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label, path, state });
//       setShowUnsavedModal(true);
//     } else {
//       await logActivity(`${label} tab clicked`);
//       navigate(path, { state });
//     }
//   };

//   const handleTabSwitch = (tab) => {
//     setShowSavedModal(false);
//     if (hasUnsavedChanges && activeTab !== tab) {
//       setPendingTab(tab);
//       setShowUnsavedModal(true);
//     } else {
//       setActiveTab(tab);
//       setIsMenuOpen(false);
//     }
//   };

//   const handleConfirmNavigation = async () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     if (pendingNavigation) {
//       if (pendingNavigation.label === 'logout') {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logout successfully!');
//         navigate('/');
//       } else if (pendingNavigation.label === 'deleteAccount') {
//         await handleDeleteAccount();
//       } else if (pendingNavigation.label === 'addDashboard') {
//         setShowModal(true);
//         setIsMenuOpen(false);
//       } else {
//         await logActivity(`${pendingNavigation.label} tab clicked`);
//         navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//       }
//       setPendingNavigation(null);
//     } else if (pendingTab) {
//       setActiveTab(pendingTab);
//       setPendingTab(null);
//       setIsMenuOpen(false);
//     }
//   };

//   const handleCancelNavigation = () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     setPendingNavigation(null);
//     setPendingTab(null);
//   };

//   const handleSaveAndNavigate = async () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     await handleSaveDashboard();
//     setShowSavedModal(false);
//     if (pendingNavigation) {
//       if (pendingNavigation.label === 'logout') {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logout successfully!');
//         navigate('/');
//       } else if (pendingNavigation.label === 'deleteAccount') {
//         await handleDeleteAccount();
//       } else if (pendingNavigation.label === 'addDashboard') {
//         setShowModal(true);
//         setIsMenuOpen(false);
//       } else {
//         await logActivity(`${pendingNavigation.label} tab clicked`);
//         navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//       }
//       setPendingNavigation(null);
//     } else if (pendingTab) {
//       setActiveTab(pendingTab);
//       setPendingTab(null);
//       setIsMenuOpen(false);
//     }
//   };

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
//     useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
//   );

//   const handleTopCompanyClick = async () => {
//     try {
//       const apiUrl = `${API_BASE}/market/top-company`;
//       const response = await fetch(apiUrl, { method: 'GET' });
//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || 'Failed to fetch top company');
//       }
//       const topCompany = await response.json();
//       if (!topCompany || !topCompany.Symbol || !topCompany.CompanyName) {
//         toast.error('No top company data available.');
//         return;
//       }

//       const plotsToAdd = [
//         { label: 'MacdPlot', graphType: 'MacdPlot' },
//         { label: 'SensexCalculator', graphType: 'SensexCalculator' },
//         { label: 'CandlePatternPlot', graphType: 'CandlePatternPlot' },

//       ];

//       setDroppedMap((prev) => {
//         const currentTab = prev[activeTab] || { general: [] };
//         const currentSection = currentTab.general || [];
//         const newItems = plotsToAdd.map((plot) => {
//           const uniqueId = `${plot.label}-${topCompany.Symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//           return {
//             label: plot.label,
//             symbol: topCompany.Symbol,
//             companyName: topCompany.CompanyName,
//             graphType: plot.graphType,
//             id: uniqueId,
//             type: 'equity',
//             sortableId: uniqueId,
//           };
//         });
//         return {
//           ...prev,
//           [activeTab]: { ...currentTab, general: [...currentSection, ...newItems] },
//         };
//       });

//       setDragCountMap((prev) => {
//         const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//         plotsToAdd.forEach((plot) => {
//           updated[activeTab][plot.label] = (updated[activeTab][plot.label] || 0) + 1;
//         });
//         return updated;
//       });

//       setHasUnsavedChanges(true);
//       toast.success(`Sample Dashboard is added for ${topCompany.CompanyName}`);
//     } catch (err) {
//       setError('Failed to fetch top company plots.');
//       toast.error('Failed to fetch top company plots.');
//     }
//   };

//   const renderPlot = (plotItem, index, allItems) => {
//     const { label, symbol, companyName, id, uploadId, platform, type } = plotItem;
//     console.log(`Rendering plot: ${label}, symbol: ${symbol}, id: ${id}`);
//     const ComponentMap = type === 'equity' ? equityHubMap : portfolioMap;
//     const Component = ComponentMap[label];
//     const sizeScore = graphSizeScores[label] || graphSizeScores.default;

//     if (!Component) {
//       return (
//         <motion.div
//           key={`general-${id}`}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3, delay: index * 0.1 }}
//           className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-200 dark:border-red-700/50 h-full"
//         >
//           <button
//             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//             className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//             aria-label="Delete component"
//           >
//             <IoMdClose size={18} />
//           </button>
//           <div className="text-center py-8">
//             <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <IoMdClose className="text-red-500 text-xl" />
//             </div>
//             <p className="text-red-500 font-medium">Component "{label}" not found</p>
//           </div>
//         </motion.div>
//       );
//     }

//     if (type === 'equity' && !symbol) {
//       return (
//         <motion.div
//           key={`general-${id}`}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3, delay: index * 0.1 }}
//           className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-200 dark:border-yellow-700/50 h-full"
//         >
//           <button
//             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//             className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//             aria-label="Delete component"
//           >
//             <IoMdClose size={18} />
//           </button>
//           <div className="text-center py-8">
//             <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <p className="text-yellow-600 dark:text-yellow-400 font-medium">Waiting for company selection</p>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">for {label}</p>
//           </div>
//         </motion.div>
//       );
//     }

//     return (
//       <motion.div
//         key={`general-${id}`}
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3, delay: index * 0.1 }}
//         className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full group"
//         data-size-score={sizeScore}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl">
//           <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
//             <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
//             {label}
//             <span className="text-xs text-gray-500 dark:text-gray-400">
//               {companyName ? `(${companyName})` : platform ? `(${platform})` : ''}
//             </span>
//           </h3>
//           <button
//             onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//             className="p-1.5 text-gray-500 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
//             aria-label="Delete component"
//           >
//             <IoMdClose size={16} />
//           </button>
//         </div>

//         <div className="p-4 min-h-[700px] flex flex-col">
//           {type === 'equity' ? (
//             <div className="flex-1">
//               <Component symbol={symbol || ''} key={`${id}-${symbol || 'default'}`} />
//             </div>
//           ) : (
//             <GraphDataProvider>
//               <div className="flex-1">
//                 <Component uploadId={uploadId} key={`${id}-${uploadId}`} />
//               </div>
//             </GraphDataProvider>
//           )}
//         </div>

//         {/* <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-xl pointer-events-none transition-all duration-300" /> */}
//       </motion.div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
//       <style jsx>{`
//         :root {
//           --primary: #2563eb;
//           --primary-dark: #1e40af;
//           --secondary: #7c3aed;
//           --secondary-dark: #5b21b6;
//           --background: #f8fafc;
//           --background-dark: #0f172a;
//           --text: #1e293b;
//           --text-dark: #e2e8f0;
//           --border: #e5e7eb;
//           --border-dark: #374151;
//         }

//         html, body {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           line-height: 1.5;
//           color: var(--text);
//         }

//         .dark {
//           color: var(--text-dark);
//           background-color: var(--background-dark);
//         }

//         .scrollbar-thin {
//           scrollbar-width: thin;
//           scrollbar-color: var(--primary) var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar {
//           width: 8px;
//         }

//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border);
//         }

//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary);
//           border-radius: 4px;
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-track {
//           background: var(--border-dark);
//         }

//         .dark .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: var(--primary-dark);
//         }

//         .tooltip {
//           position: relative;
//           display: inline-block;
//         }

//         .tooltip .tooltip-text {
//           visibility: hidden;
//           width: 200px;
//           background-color: #1e293b;
//           color: #fff;
//           text-align: center;
//           border-radius: 6px;
//           padding: 8px;
//           position: absolute;
//           z-index: 1000;
//           bottom: 125%;
//           left: 50%;
//           transform: translateX(-50%);
//           opacity: 0;
//           transition: opacity 0.3s;
//           font-size: 12px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .tooltip:hover .tooltip-text {
//           visibility: visible;
//           opacity: 1;
//         }

//         .dark .tooltip .tooltip-text {
//           background-color: #e2e8f0;
//           color: #1e293b;
//         }
//       `}</style>

//       <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-800 shadow-sm">
//         {/* ✅ SEO & Open Graph Meta Tags */}
//         <Helmet>
//           <title>Research Panel | CMDA Hub – Customize & Compare Your Investment Dashboard</title>

//           <meta
//             name="description"
//             content="Use CMDA Hub’s Research Panel to compare equities and portfolios in one place. Drag, drop, and customize your dashboard for smarter investment insights and analytics."
//           />

//           <meta
//             name="keywords"
//             content="research panel, equity comparison, portfolio analysis, customizable dashboard, CMDA Hub, investment analytics, stock research, Accord Fintech"
//           />

//           {/* Open Graph for social media previews */}
//           <meta property="og:title" content="Research Panel | CMDA Hub" />
//           <meta
//             property="og:description"
//             content="Compare equities, analyze portfolios, and build your own investment dashboard — all in CMDA Hub’s Research Panel."
//           />
//           <meta property="og:url" content="https://cmdahub.com/researchpanel" />
//           <meta property="og:type" content="website" />
//           <meta property="og:site_name" content="CMDA Hub" />

//           {/* Canonical URL */}
//           <link rel="canonical" href="https://cmdahub.com/researchpanel" />
//         </Helmet>

//         <Navbar
//           handleNavClick={handleNavClick}
//           hasUnsavedChanges={hasUnsavedChanges}
//           setPendingNavigation={setPendingNavigation}
//           setShowUnsavedModal={setShowUnsavedModal}
//         />
//       </div>

//       <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//         <div className="flex flex-1 mt-16">
//           <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] z-40">
//             <SidebarRight collapsed={collapsed} setCollapsed={setCollapsed} onItemClick={handleItemClick} />
//           </div>

//           {showModal && <AddNewModal onClose={() => setShowModal(false)} onCreateTab={handleNewDashboard} />}

//           <div
//             className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'pr-14' : 'pr-80'} overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin`}
//           >
//             <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//               <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-2 border border-gray-200 dark:border-gray-700 shadow-sm">
//                 {tabs.map((tab) => (
//                   <div
//                     key={tab}
//                     className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
//                   >
//                     {editingTab === tab ? (
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="text"
//                           value={editedTabName}
//                           onChange={(e) => setEditedTabName(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && handleRenameTab(tab, editedTabName)}
//                           className="w-32 px-2 py-1 bg-white dark:bg-[var(--background-dark)] border border-[var(--border)] dark:border-[var(--border-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
//                           autoFocus
//                         />
//                         <button
//                           onClick={() => handleRenameTab(tab, editedTabName)}
//                           className="p-1 text-green-600 hover:text-green-700 transition-colors"
//                           title="Save"
//                         >
//                           <IoMdSave size={16} />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleTabSwitch(tab)}
//                           className={`text-sm font-medium transition-all duration-200 ${activeTab === tab
//                             ? 'text-[var(--primary)]'
//                             : 'text-[var(--text)] dark:text-[var(--text-dark)] hover:text-[var(--primary)]'
//                             }`}
//                         >
//                           {tab}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setEditingTab(tab);
//                             setEditedTabName(tab);
//                           }}
//                           className="p-1 text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors"
//                           title="Rename"
//                         >
//                           <MdOutlineDriveFileRenameOutline size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteDashboardAPI(tab)}
//                           className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors"
//                           title="Delete"
//                         >
//                           <IoMdClose size={16} />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => {
//                       setShowSavedModal(false);
//                       if (hasUnsavedChanges) {
//                         setPendingNavigation({ label: 'addDashboard', path: null });
//                         setShowUnsavedModal(true);
//                         return;
//                       }
//                       setShowModal(true);
//                       setIsMenuOpen(false);
//                     }}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                     data-tour="dashboard-add"
//                   >
//                     <MdOutlineDashboardCustomize size={18} /> Add Dashboard
//                   </button>

//                   <div className="relative inline-block">
//                     <button
//                       onClick={handleTopCompanyClick}
//                       className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
//                       data-tour="top-company"
//                     >
//                       <FaRocket size={18} /> Market Leader
//                       <div className="absolute bottom-0 right-0 group">
//                         <FaInfoCircle size={14} className="text-white/80 cursor-pointer" />
//                         {/* <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         Adds MACD, Sensex Calculator, and Candlestick plots.
//                           </span> */}
//                         <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap 
//   bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
//   group-hover:opacity-100 transition-opacity 
//   z-50 pointer-events-none"
//                         >
//                           Adds MACD, Sensex Calculator, and Candlestick plots.
//                         </span>
//                       </div>
//                     </button>
//                   </div>

//                   <button
//                     onClick={handleSaveDashboard}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                     data-tour="dashboard-save"
//                   >
//                     <BiSolidSave size={18} /> Save
//                   </button>

//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setShowSavedModal(false);
//                       if (!isLoggedIn) {
//                         toast.error('Login first to see your dashboards.');
//                         return;
//                       }
//                       handleNavClick('Saved Dashboards', '/saveddashboard');
//                     }}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
//                     data-tour="dashboard-saved"
//                   >
//                     <BiSolidSave size={18} /> Saved Dashboards
//                   </button>
//                 </div>
//               </div>

//               {getUniqueCompanies().length > 0 ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex flex-wrap gap-3 items-center mb-6 bg-white/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg rounded-xl p-4 border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                 >
//                   <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] bg-[var(--border)] dark:bg-[var(--border-dark)] px-3 py-1 rounded-full">
//                     Selected Stocks:
//                   </span>
//                   {getUniqueCompanies().map((companyName) => (
//                     <motion.div
//                       key={companyName}
//                       initial={{ scale: 0.8, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       className="flex items-center gap-2 px-3 py-1.5 bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
//                     >
//                       <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate max-w-[120px]">
//                         {companyName}
//                       </span>
//                       <button
//                         onClick={() => handleClearCompany(companyName)}
//                         className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
//                         title="Remove"
//                       >
//                         <IoMdClose size={14} />
//                       </button>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               ) : (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="text-sm text-[var(--text)]/60 dark:text-white mb-6 text-center py-4 bg-white/30 dark:bg-slate-900 rounded-xl border border-dashed border-[var(--border)] dark:border-[var(--border-dark)]"
//                 >
//                   No stocks selected. Add stocks from the sidebar to get started!
//                 </motion.p>
//               )}
//             </div>

//             <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
//               <section className="space-y-6">
//                 <div className="text-center">
//                   <motion.h2
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-2xl font-semibold bg-gray-700 bg-clip-text text-transparent dark:bg-gray-100"
//                   >
//                     Interactive Whiteboard
//                   </motion.h2>
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.1 }}
//                     className="text-[var(--text)]/70 dark:text-gray-300 mt-2 text-sm"
//                   >
//                     Drag components from the sidebar and resize plots using the handles
//                   </motion.p>
//                 </div>

//                 <DroppableArea id="general">
//                   {(() => {
//                     const droppedItems = droppedMap?.[activeTab]?.general || [];
//                     const visibleItems = getVisibleItems(
//                       droppedItems.map((item) => ({
//                         ...item,
//                         sortableId: item.sortableId || `item-${item.id}`,
//                       }))
//                     );

//                     if (visibleItems.length === 0) {
//                       return (
//                         <motion.div
//                           initial={{ opacity: 0, scale: 0.95 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="flex flex-col items-center py-20 min-h-[900px] px-4 bg-white/50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-[var(--border)] dark:border-[var(--border-dark)] shadow-inner"
//                         >
//                           <motion.div
//                             animate={{
//                               y: [0, -10, 0],
//                               rotate: [0, 5, -5, 0],
//                             }}
//                             transition={{
//                               duration: 4,
//                               repeat: Infinity,
//                               ease: 'easeInOut',
//                             }}
//                             className="mb-4"
//                           >
//                             <svg
//                               className="h-20 w-20 text-[var(--primary)]/60 dark:text-gray-300"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="1.5"
//                                 d="M4 8v8m0 0h8m-8 0l8-8m4 8v-8m0 0H8m8 0l-8 8"
//                               />
//                             </svg>
//                           </motion.div>
//                           <h3 className="text-xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                             Your Whiteboard Awaits!
//                           </h3>
//                           <p className="text-[var(--text)]/70 dark:text-gray-300 text-center max-w-md">
//                             Drag and drop components from the sidebar to start building your dashboard.
//                             Resize plots using the visible handles for optimal layout.
//                           </p>
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => setCollapsed(false)}
//                             className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
//                           >
//                             <GoSidebarExpand size={20} /> Open Sidebar
//                           </motion.button>
//                         </motion.div>
//                       );
//                     }

//                     // Build rows based on size scores
//                     const rows = [];
//                     let currentRow = [];
//                     let currentRowSizeScore = 0;

//                     for (let i = 0; i < visibleItems.length; i++) {
//                       const item = visibleItems[i];
//                       const sizeScore = graphSizeScores[item.label] || graphSizeScores.default;

//                       if (currentRow.length >= 2 || currentRowSizeScore + sizeScore > MAX_ROW_SIZE_SCORE) {
//                         rows.push(currentRow);
//                         currentRow = [item];
//                         currentRowSizeScore = sizeScore;
//                       } else {
//                         currentRow.push(item);
//                         currentRowSizeScore += sizeScore;
//                       }
//                     }
//                     if (currentRow.length > 0) {
//                       rows.push(currentRow);
//                     }

//                     const minHeightPerRow = 800;
//                     const totalMinHeight = Math.max(minHeightPerRow * rows.length, 900);

//                     return (
//                       <SortableContext items={visibleItems.map((item) => item.sortableId)} strategy={() => null}>
//                         <PanelGroup
//                           direction="vertical"
//                           className="rounded-2xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm"
//                           style={{ minHeight: `${totalMinHeight}px` }}
//                           onLayout={() => setResizing(false)}
//                         >
//                           {rows.map((rowItems, rowIndex) => (
//                             <React.Fragment key={`row-${rowIndex}`}>
//                               {rowIndex > 0 && (
//                                 <PanelResizeHandle onDragging={setResizing}>
//                                   <ResizeHandle direction="vertical" />
//                                 </PanelResizeHandle>
//                               )}
//                               <Panel defaultSize={100 / rows.length} minSize={30}>
//                                 <PanelGroup direction="horizontal">
//                                   {rowItems.map((item, idx) => {
//                                     const sizeScore = graphSizeScores[item.label] || graphSizeScores.default;
//                                     let defaultSize = 100 / rowItems.length;
//                                     let minSize = 25;
//                                     if (rowItems.length === 1) {
//                                       defaultSize = 100;
//                                       minSize = 100;
//                                     } else if (rowItems.length === 2) {
//                                       const otherItem = rowItems[idx === 0 ? 1 : 0];
//                                       const otherSizeScore = graphSizeScores[otherItem.label] || graphSizeScores.default;
//                                       const totalScore = sizeScore + otherSizeScore;
//                                       defaultSize = (sizeScore / totalScore) * 100;
//                                       defaultSize = Math.max(defaultSize, 40);
//                                       minSize = 40;
//                                     }
//                                     return (
//                                       <React.Fragment key={`item-${item.id}`}>
//                                         {idx > 0 && (
//                                           <PanelResizeHandle onDragging={setResizing}>
//                                             <ResizeHandle direction="horizontal" />
//                                           </PanelResizeHandle>
//                                         )}
//                                         <Panel defaultSize={defaultSize} minSize={minSize}>
//                                           <Draggable id={item.sortableId}>
//                                             <div className="h-full" style={{ minHeight: `${minHeightPerRow}px` }}>
//                                               {renderPlot(item, rowIndex * 2 + idx, visibleItems)}
//                                             </div>
//                                           </Draggable>
//                                         </Panel>
//                                       </React.Fragment>
//                                     );
//                                   })}
//                                 </PanelGroup>
//                               </Panel>
//                             </React.Fragment>
//                           ))}
//                         </PanelGroup>
//                       </SortableContext>
//                     );
//                   })()}
//                 </DroppableArea>
//               </section>
//             </main>
//           </div>

//           <AnimatePresence>
//             {showUnsavedModal && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
//               >
//                 <motion.div
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   exit={{ scale: 0.9, opacity: 0 }}
//                   className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//                 >
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
//                         />
//                       </svg>
//                     </div>
//                     <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
//                       Unsaved Changes
//                     </h2>
//                     <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                       You have unsaved changes. Would you like to save before{' '}
//                       {pendingNavigation ? `navigating to ${pendingNavigation.label}` : pendingTab ? `switching to ${pendingTab}` : 'leaving'}?
//                     </p>
//                   </div>
//                   <div className="flex gap-3 mt-6">
//                     <button
//                       onClick={handleSaveAndNavigate}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md"
//                     >
//                       Save & Continue
//                     </button>
//                     <button
//                       onClick={handleConfirmNavigation}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md"
//                     >
//                       Leave Anyway
//                     </button>
//                   </div>
//                   <button
//                     onClick={handleCancelNavigation}
//                     className="w-full mt-3 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {showSavedModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)] text-center"
//               >
//                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <BiSolidSave className="w-8 h-8 text-green-500" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">Dashboard Saved!</h2>
//                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
//                   Your changes have been saved successfully.
//                 </p>
//               </motion.div>
//             </motion.div>
//           )}

//           <DragStartModal
//             isOpen={showDragModal}
//             onClose={() => {
//               setShowDragModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             onSearch={handleStockSearch}
//             searchTerm={searchTerm}
//             setSearchTerm={(value) => {
//               setSearchTerm(value);
//               setError(null);
//               if (value.length >= 2) handleStockSearch();
//               else setSearchedStocks([]);
//             }}
//             searchedStocks={searchedStocks}
//             onSelectItem={(item) => {
//               if (currentDragItem) {
//                 const uniqueId = `${currentDragItem.label}-${item.symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//                 setDroppedMap((prev) => {
//                   const currentTab = prev[activeTab] || { general: [] };
//                   const generalItems = currentTab.general || [];
//                   const lastItemIndex = generalItems.findLastIndex(
//                     (i) => i.label === currentDragItem.label && !i.symbol
//                   );
//                   if (lastItemIndex >= 0) {
//                     const updatedItems = [...generalItems];
//                     updatedItems[lastItemIndex] = {
//                       ...updatedItems[lastItemIndex],
//                       symbol: item.symbol,
//                       companyName: item.companyName,
//                       type: 'equity',
//                       sortableId: uniqueId,
//                       id: uniqueId,
//                     };
//                     return { ...prev, [activeTab]: { ...currentTab, general: updatedItems } };
//                   } else {
//                     const newItem = {
//                       label: currentDragItem.label,
//                       symbol: item.symbol,
//                       companyName: item.companyName,
//                       graphType: currentDragItem.label,
//                       id: uniqueId,
//                       type: 'equity',
//                       sortableId: uniqueId,
//                     };
//                     return { ...prev, [activeTab]: { ...currentTab, general: [...generalItems, newItem] } };
//                   }
//                 });
//                 setDragCountMap((prev) => ({
//                   ...prev,
//                   [activeTab]: {
//                     ...prev[activeTab],
//                     [currentDragItem.label]: (prev[activeTab]?.[currentDragItem.label] || 0) + 1,
//                   },
//                 }));
//                 setHasUnsavedChanges(true);
//               }
//               setSearchTerm('');
//               setSearchedStocks([]);
//               setShowDragModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             onClear={() => {
//               setSearchTerm('');
//               setSearchedStocks([]);
//               setError(null);
//             }}
//             selectedCompany={null}
//             error={error}
//           />

//           <PortfolioSelectModal
//             isOpen={showPortfolioModal}
//             onClose={() => {
//               setShowPortfolioModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             portfolios={savedPortfolios}
//             onSelectPortfolio={handlePortfolioSelect}
//             error={error}
//           />

//           {showDeleteModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
//               >
//                 <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-4">
//                   Confirm Deletion
//                 </h2>
//                 <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mb-6">
//                   Are you sure you want to delete your account? This action cannot be undone.
//                 </p>
//                 <div className="flex gap-4">
//                   <button
//                     onClick={handleDeleteAccount}
//                     className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     className="flex-1 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-all duration-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </div>
//       </DndContext>
//     </div>
//   );
// };

// export default DashBoard;







// import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
// import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
// import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { MdOutlineDashboardCustomize, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
// import { BiSolidSave } from 'react-icons/bi';
// import { IoMdClose, IoMdSave } from 'react-icons/io';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Modal from 'react-modal';
// import { GoSidebarExpand } from 'react-icons/go';
// import { Search } from 'lucide-react';
// import { IoMdArrowDropdown } from 'react-icons/io';
// import axios from 'axios';
// import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
// import { FaChartLine, FaBriefcase, FaInfoCircle, FaRocket, FaPalette, FaMagic } from 'react-icons/fa';
// import { Helmet } from 'react-helmet-async';

// // Placeholder components (replace with actual implementations)
// const Navbar = ({ handleNavClick, hasUnsavedChanges, setPendingNavigation, setShowUnsavedModal }) => (
//   <nav className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
//     <button
//       onClick={() => handleNavClick('home', '/')}
//       className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary-light transition-colors"
//     >
//       Home
//     </button>
//   </nav>
// );

// const SidebarRight = ({ collapsed, setCollapsed, onItemClick }) => (
//   <div className={`bg-white dark:bg-slate-800 ${collapsed ? 'w-16' : 'w-64'} h-full p-4 transition-all duration-300 shadow-lg`}>
//     <button
//       onClick={() => setCollapsed(!collapsed)}
//       className="mb-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
//     >
//       <GoSidebarExpand size={24} className="text-slate-600 dark:text-slate-300" />
//     </button>
//     <div className="space-y-2">
//       <button
//         onClick={() => onItemClick({ id: 'macd', label: 'MacdPlot' })}
//         className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
//       >
//         Macd Plot
//       </button>
//       <button
//         onClick={() => onItemClick({ id: 'portfolio', label: 'PortfolioOverview' })}
//         className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
//       >
//         Portfolio Overview
//       </button>
//     </div>
//   </div>
// );

// const AddNewModal = ({ onClose, onCreateTab }) => (
//   <Modal isOpen={true} onRequestClose={onClose} className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md mx-auto mt-20">
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Create New Dashboard</h2>
//       <input
//         type="text"
//         placeholder="Dashboard Name"
//         onKeyDown={(e) => e.key === 'Enter' && onCreateTab(e.target.value)}
//         className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
//       />
//       <button
//         onClick={onClose}
//         className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
//       >
//         Close
//       </button>
//     </div>
//   </Modal>
// );

// const DragStartModal = ({ isOpen, onClose, onSelect }) => (
//   <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md mx-auto mt-20">
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Select Company</h2>
//       <input
//         type="text"
//         placeholder="Search company"
//         className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
//       />
//       <button
//         onClick={onClose}
//         className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
//       >
//         Close
//       </button>
//     </div>
//   </Modal>
// );

// const PortfolioSelectModal = ({ isOpen, onClose, portfolios, onSelectPortfolio, error }) => (
//   <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md mx-auto mt-20">
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Select Portfolio</h2>
//       {error && <p className="text-red-500">{error}</p>}
//       {portfolios.map((p) => (
//         <button
//           key={p.uploadId}
//           onClick={() => onSelectPortfolio(p)}
//           className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
//         >
//           {p.platform}
//         </button>
//       ))}
//       <button
//         onClick={onClose}
//         className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
//       >
//         Close
//       </button>
//     </div>
//   </Modal>
// );

// const DroppableArea = ({ id, children }) => (
//   <div id={id} className="w-full">
//     {children}
//   </div>
// );

// const GraphDataProvider = ({ children }) => <div>{children}</div>;

// // Placeholder ComponentRegistry
// const equityHubMap = {
//   MacdPlot: ({ symbol }) => <div className="p-4">MACD Plot for {symbol}</div>,
//   SensexCalculator: ({ symbol }) => <div className="p-4">Sensex Calculator for {symbol}</div>,
//   CandlePatternPlot: ({ symbol }) => <div className="p-4">Candle Pattern Plot for {symbol}</div>,
// };

// const portfolioMap = {
//   PortfolioOverview: ({ uploadId }) => <div className="p-4">Portfolio Overview for {uploadId}</div>,
//   AssetAllocation: ({ uploadId }) => <div className="p-4">Asset Allocation for {uploadId}</div>,
// };

// // Placeholder useAuth hook
// const useAuth = () => ({
//   login: () => localStorage.setItem('authToken', 'mock-token'),
//   logout: () => localStorage.removeItem('authToken'),
// });

// // Placeholder API service
// const logActivity = async (activity) => console.log(`Activity: ${activity}`);

// // Set Modal app element
// Modal.setAppElement('#root');

// // Custom Draggable component
// const Draggable = ({ id, children }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// };

// // Placeholder ResizeHandle component
// const ResizeHandle = ({ direction }) => (
//   <div
//     className={`bg-slate-200 dark:bg-slate-700 ${direction === 'vertical' ? 'h-2 w-full' : 'w-2 h-full'
//       } cursor-${direction === 'vertical' ? 'row-resize' : 'col-resize'}`}
//   />
// );

// const DashBoard = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [showModal, setShowModal] = useState(false);
//   const [tabs, setTabs] = useState(['Dashboard 1']);
//   const [activeTab, setActiveTab] = useState('Dashboard 1');
//   const [uploadId, setUploadId] = useState(null);
//   const [platform, setPlatform] = useState('');
//   const [symbol, setSymbol] = useState(null);
//   const [savedStocks, setSavedStocks] = useState([]);
//   const [savedPortfolios, setSavedPortfolios] = useState([]);
//   const [droppedMap, setDroppedMap] = useState({ 'Dashboard 1': { general: [] } });
//   const [savedDroppedMap, setSavedDroppedMap] = useState({});
//   const [editingTab, setEditingTab] = useState(null);
//   const [editedTabName, setEditedTabName] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchedStocks, setSearchedStocks] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showDragModal, setShowDragModal] = useState(false);
//   const [showPortfolioModal, setShowPortfolioModal] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [dragCountMap, setDragCountMap] = useState({ 'Dashboard 1': {} });
//   const [currentDragItem, setCurrentDragItem] = useState(null);
//   const [error, setError] = useState(null);
//   const [showUnsavedModal, setShowUnsavedModal] = useState(false);
//   const [showSavedModal, setShowSavedModal] = useState(false);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [pendingNavigation, setPendingNavigation] = useState(null);
//   const [pendingTab, setPendingTab] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [sticky, setSticky] = useState(false);
//   const [userType, setUserType] = useState(null);
//   const [fullName, setFullName] = useState('');
//   const [isDisabled, setIsDisabled] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const { login, logout } = useAuth();
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const drawerRef = useRef(null);
//   const [resizing, setResizing] = useState(false);

//   // Memoized unsaved changes check
//   const hasUnsavedChangesMemo = useMemo(() => {
//     const currentTab = droppedMap[activeTab] || { general: [] };
//     const savedTab = savedDroppedMap[activeTab] || { general: [] };
//     return JSON.stringify(currentTab.general) !== JSON.stringify(savedTab.general);
//   }, [droppedMap, activeTab, savedDroppedMap]);

//   useEffect(() => {
//     setHasUnsavedChanges(hasUnsavedChangesMemo);
//   }, [hasUnsavedChangesMemo]);

//   // Handle outside clicks for portfolio dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (drawerRef.current && !event.target.closest('#portfolio-dropdown')) {
//         setIsMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle sticky navbar
//   useEffect(() => {
//     const handleScroll = () => setSticky(window.scrollY > 0);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Check login status
//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) setIsLoggedIn(true);
//   }, []);

//   // Load stored uploadId and platform
//   useEffect(() => {
//     const storedUploadId = localStorage.getItem('uploadId');
//     const storedPlatform = localStorage.getItem('platform');
//     if (storedUploadId && storedPlatform) {
//       setUploadId(storedUploadId);
//       setPlatform(storedPlatform);
//     }
//   }, []);

//   // Fetch saved portfolios
//   const fetchSavedPortfolio = useCallback(async () => {
//     try {
//       setError('');
//       const token = localStorage.getItem('authToken');
//       if (!token) throw new Error('Please login to view your portfolios');
//       const response = await fetch(`${API_BASE}/file/saved`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || 'Failed to fetch portfolios');
//       }
//       const data = await response.json();
//       setSavedPortfolios(data);
//       if (data.length > 0) {
//         setUploadId(data[0].uploadId);
//         setPlatform(data[0].platform);
//       } else {
//         setError('No portfolios found');
//       }
//     } catch (err) {
//       console.error('Error fetching portfolios:', err);
//       setError(err.message || 'Network error. Please try again.');
//     }
//   }, [API_BASE]);

//   useEffect(() => {
//     fetchSavedPortfolio();
//   }, [fetchSavedPortfolio]);

//   // Stock search handler
//   const handleStockSearch = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) throw new Error('Authentication required');
//       const response = await fetch(`${API_BASE}/stocks/test/search?query=${searchTerm}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || 'Failed to fetch stocks');
//       }
//       const data = await response.json();
//       if (Array.isArray(data) && data.length > 0) {
//         setSearchedStocks(data);
//         setSavedStocks(data);
//       } else {
//         setSearchedStocks([]);
//         toast.info('No stocks found.');
//         setError('Company not found');
//       }
//     } catch (err) {
//       console.error('Stock search error:', err);
//       setSearchedStocks([]);
//       setError(err.message || 'Failed to fetch stocks.');
//       toast.error(err.message || 'Search failed.');
//     }
//   }, [searchTerm, API_BASE]);

//   // Rename tab
//   const handleRenameTab = useCallback((oldName, newName) => {
//     if (!newName?.trim() || tabs.includes(newName)) {
//       toast.info('Invalid or duplicate dashboard name.');
//       return;
//     }
//     setTabs((prev) => prev.map((tab) => (tab === oldName ? newName : tab)));
//     setDroppedMap((prev) => {
//       const updated = { ...prev, [newName]: prev[oldName] };
//       delete updated[oldName];
//       return updated;
//     });
//     setSavedDroppedMap((prev) => {
//       const updated = { ...prev, [newName]: prev[oldName] };
//       delete updated[oldName];
//       return updated;
//     });
//     setDragCountMap((prev) => {
//       const updated = { ...prev, [newName]: prev[oldName] };
//       delete updated[oldName];
//       return updated;
//     });
//     if (activeTab === oldName) setActiveTab(newName);
//     setEditingTab(null);
//     setEditedTabName('');
//   }, [tabs, activeTab]);

//   // Delete component
//   const handleDeleteComponent = useCallback((index) => {
//     setDroppedMap((prev) => {
//       const updated = { ...prev };
//       updated[activeTab] = {
//         ...prev[activeTab],
//         general: prev[activeTab].general.filter((_, idx) => idx !== index),
//       };
//       return updated;
//     });
//     const label = droppedMap[activeTab].general[index].label;
//     setDragCountMap((prev) => {
//       const remaining = droppedMap[activeTab].general.filter((item, idx) => idx !== index && item.label === label);
//       return {
//         ...prev,
//         [activeTab]: { ...prev[activeTab], [label]: remaining.length },
//       };
//     });
//     setHasUnsavedChanges(true);
//   }, [droppedMap, activeTab]);

//   // Clear company
//   const handleClearCompany = useCallback((companyName) => {
//     setDroppedMap((prev) => ({
//       ...prev,
//       [activeTab]: {
//         ...prev[activeTab],
//         general: prev[activeTab].general.filter((item) => item.companyName !== companyName),
//       },
//     }));
//     setDragCountMap((prev) => {
//       const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//       const affectedLabels = droppedMap[activeTab].general
//         .filter((item) => item.companyName === companyName)
//         .map((item) => item.label);
//       affectedLabels.forEach((label) => {
//         const remaining = droppedMap[activeTab].general.filter(
//           (item) => item.label === label && item.companyName !== companyName
//         );
//         updated[activeTab][label] = remaining.length;
//       });
//       return updated;
//     });
//     toast.success(`Removed ${companyName}`);
//     setHasUnsavedChanges(true);
//   }, [droppedMap, activeTab]);

//   // Generate unique dashboard name
//   const generateDefaultDashboardName = useCallback(async (baseName = 'Dashboard') => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboards');
//       const { dashboards } = await response.json();
//       const existingNames = dashboards.map((dash) => dash.dashboardName);
//       let index = 1;
//       let defaultName;
//       do {
//         defaultName = `${baseName} ${index++}`;
//       } while (existingNames.includes(defaultName) || tabs.includes(defaultName));
//       return defaultName;
//     } catch (err) {
//       console.error('Error generating dashboard name:', err);
//       let index = 1;
//       let defaultName;
//       do {
//         defaultName = `${baseName} ${index++}`;
//       } while (tabs.includes(defaultName));
//       return defaultName;
//     }
//   }, [tabs, API_BASE]);

//   // Create new dashboard
//   const handleNewDashboard = useCallback(async (title) => {
//     const newTitle = title?.trim() || (await generateDefaultDashboardName());
//     if (tabs.includes(newTitle)) {
//       toast.info('Dashboard name already exists.');
//       return;
//     }
//     setTabs((prev) => [...prev, newTitle]);
//     setDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//     setSavedDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
//     setDragCountMap((prev) => ({ ...prev, [newTitle]: {} }));
//     setActiveTab(newTitle);
//     setShowModal(false);
//     setIsMenuOpen(false);
//     setHasUnsavedChanges(false);
//   }, [tabs, generateDefaultDashboardName]);

//   // Handle drag start
//   const handleDragStart = useCallback((event) => {
//     const { active } = event;
//     const label = active?.data?.current?.label;
//     setCurrentDragItem(active?.data?.current);
//     if (Object.keys(equityHubMap).includes(label)) {
//       const currentDragCount = dragCountMap[activeTab]?.[label] || 0;
//       if (currentDragCount === 0 || droppedMap[activeTab].general.some((item) => item.label === label)) {
//         setShowDragModal(true);
//       }
//     } else if (Object.keys(portfolioMap).includes(label)) {
//       setShowPortfolioModal(true);
//     }
//   }, [dragCountMap, droppedMap, activeTab]);

//   // Handle item click from sidebar
//   const handleItemClick = useCallback((item) => {
//     const { label } = item;
//     setCurrentDragItem({ label });
//     if (Object.keys(equityHubMap).includes(label)) {
//       setShowDragModal(true);
//     } else if (Object.keys(portfolioMap).includes(label)) {
//       setShowPortfolioModal(true);
//     }
//   }, []);

//   // Handle drag end
//   const handleDragEnd = useCallback((event) => {
//     const { over, active } = event;
//     const { label, sortable } = active?.data?.current || {};
//     if (!over || !label) return;

//     if (sortable) {
//       const items = droppedMap[activeTab]?.general || [];
//       const oldIndex = items.findIndex((item) => item.sortableId === active.id);
//       const newIndex = items.findIndex((item) => item.sortableId === over.id);
//       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//         setDroppedMap((prev) => ({
//           ...prev,
//           [activeTab]: {
//             ...prev[activeTab],
//             general: arrayMove(prev[activeTab].general, oldIndex, newIndex),
//           },
//         }));
//         setHasUnsavedChanges(true);
//       }
//       return;
//     }

//     setCurrentDragItem(active?.data?.current);
//     if (Object.keys(equityHubMap).includes(label)) {
//       setShowDragModal(true);
//     } else if (Object.keys(portfolioMap).includes(label)) {
//       setShowPortfolioModal(true);
//     }
//   }, [droppedMap, activeTab]);

//   // Handle portfolio selection
//   const handlePortfolioSelect = useCallback((portfolio) => {
//     if (currentDragItem) {
//       const uniqueId = `${currentDragItem.label}-${portfolio.uploadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//       const draggedItem = {
//         label: currentDragItem.label,
//         symbol: '',
//         companyName: '',
//         graphType: currentDragItem.label,
//         uploadId: portfolio.uploadId,
//         platform: portfolio.platform,
//         id: uniqueId,
//         type: 'portfolio',
//         sortableId: uniqueId,
//       };
//       setDroppedMap((prev) => ({
//         ...prev,
//         [activeTab]: {
//           ...prev[activeTab],
//           general: [...(prev[activeTab]?.general || []), draggedItem],
//         },
//       }));
//       setUploadId(portfolio.uploadId);
//       setPlatform(portfolio.platform);
//       localStorage.setItem('uploadId', portfolio.uploadId.toString());
//       localStorage.setItem('platform', portfolio.platform);
//       setShowPortfolioModal(false);
//       setCurrentDragItem(null);
//       setHasUnsavedChanges(true);
//     }
//   }, [currentDragItem, activeTab]);

//   // Save dashboard
//   const handleSaveDashboard = useCallback(async () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast.error('Please log in to save your dashboard.');
//       return;
//     }

//     const generalPlots = droppedMap?.[activeTab]?.general || [];
//     if (generalPlots.length === 0) {
//       toast.error('Please add at least one plot before saving.');
//       return;
//     }

//     let finalDashboardName = activeTab;

//     try {
//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch dashboards');
//       const { dashboards } = await response.json();
//       const existingNames = dashboards.map((dash) => dash.dashboardName);

//       if (existingNames.includes(finalDashboardName)) {
//         finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
//         setTabs((prev) => prev.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
//         setDroppedMap((prev) => {
//           const updated = { ...prev, [finalDashboardName]: prev[activeTab] };
//           delete updated[activeTab];
//           return updated;
//         });
//         setSavedDroppedMap((prev) => {
//           const updated = { ...prev, [finalDashboardName]: { general: generalPlots } };
//           delete updated[activeTab];
//           return updated;
//         });
//         setDragCountMap((prev) => {
//           const updated = { ...prev, [finalDashboardName]: prev[activeTab] };
//           delete updated[activeTab];
//           return updated;
//         });
//         setActiveTab(finalDashboardName);
//         toast.info(`Dashboard renamed to "${finalDashboardName}" to avoid duplication.`);
//       }

//       const savedData = {
//         dashboard: {
//           dashboardName: finalDashboardName,
//           userId: parseInt(localStorage.getItem('userId') || '0'),
//           userType: localStorage.getItem('userType') || '',
//         },
//         equityHubPlots: generalPlots
//           .filter((plot) => plot.type === 'equity')
//           .map(({ label, symbol, companyName, graphType }) => ({
//             symbol: symbol || savedStocks.find((s) => s.label === label)?.symbol || '',
//             companyName: companyName || savedStocks.find((s) => s.label === label)?.companyName || '',
//             graphType: graphType || label,
//           })),
//         portfolioPlots: generalPlots
//           .filter((plot) => plot.type === 'portfolio')
//           .map(({ label, uploadId, platform }) => ({ uploadId, platform, graphType: label })),
//       };

//       const saveResponse = await fetch(`${API_BASE}/dashboard/save`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(savedData),
//       });

//       if (!saveResponse.ok) {
//         const err = await saveResponse.json();
//         throw new Error(err.error || 'Failed to save dashboard');
//       }

//       setSavedDroppedMap((prev) => ({
//         ...prev,
//         [finalDashboardName]: { general: generalPlots },
//       }));
//       setHasUnsavedChanges(false);
//       setShowSavedModal(true);
//       setTimeout(() => setShowSavedModal(false), 3000);
//       toast.success('Dashboard saved successfully!');
//     } catch (err) {
//       console.error('Save dashboard error:', err);
//       toast.error(err.message || 'Failed to save dashboard.');
//     } finally {
//       setIsMenuOpen(false);
//     }
//   }, [droppedMap, activeTab, savedStocks, generateDefaultDashboardName, API_BASE]);

//   // Delete dashboard
//   const handleDeleteDashboardAPI = useCallback(async (dashboardName) => {
//     if (hasUnsavedChanges) {
//       setPendingTab(dashboardName);
//       setShowUnsavedModal(true);
//       return;
//     }
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashboardName}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error('Failed to delete dashboard');
//       setTabs((prev) => prev.filter((tab) => tab !== dashboardName));
//       setDroppedMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       setSavedDroppedMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       setDragCountMap((prev) => {
//         const updated = { ...prev };
//         delete updated[dashboardName];
//         return updated;
//       });
//       if (activeTab === dashboardName) {
//         const remainingTabs = tabs.filter((tab) => tab !== dashboardName);
//         setActiveTab(remainingTabs[0] || '');
//       }
//       toast.success('Dashboard deleted successfully');
//       setIsMenuOpen(false);
//     } catch (err) {
//       console.error('Delete dashboard error:', err);
//       toast.error('Failed to delete dashboard');
//     }
//   }, [hasUnsavedChanges, activeTab, tabs, API_BASE]);

//   // Get unique companies
//   const getUniqueCompanies = useCallback(() => {
//     const generalItems = droppedMap[activeTab]?.general || [];
//     return [...new Set(generalItems.filter((item) => item.companyName).map((item) => item.companyName))];
//   }, [droppedMap, activeTab]);

//   // Check if dashboard is empty
//   const isDashboardEmpty = useCallback(() => {
//     return (droppedMap[activeTab]?.general || []).length === 0;
//   }, [droppedMap, activeTab]);

//   // Cache data
//   const getCachedData = useCallback((key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > 3600000) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       console.error('Cache parse error:', err);
//       setError('Failed to parse cached data.');
//       return null;
//     }
//   }, []);

//   const setCachedData = useCallback((key, data) => {
//     try {
//       localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//     } catch (err) {
//       console.error('Cache set error:', err);
//       setError('Failed to cache data.');
//     }
//   }, []);

//   // Handle navigation
//   const handleNavClick = useCallback(
//     async (label, path, state = {}) => {
//       setShowSavedModal(false);
//       if (hasUnsavedChanges) {
//         setPendingNavigation({ label, path, state });
//         setShowUnsavedModal(true);
//       } else {
//         await logActivity(`${label} tab clicked`);
//         navigate(path, { state });
//       }
//     },
//     [hasUnsavedChanges, navigate]
//   );

//   // Handle tab switch
//   const handleTabSwitch = useCallback(
//     (tab) => {
//       setShowSavedModal(false);
//       if (hasUnsavedChanges && activeTab !== tab) {
//         setPendingTab(tab);
//         setShowUnsavedModal(true);
//       } else {
//         setActiveTab(tab);
//         setIsMenuOpen(false);
//       }
//     },
//     [hasUnsavedChanges, activeTab]
//   );

//   // Handle confirm navigation
//   const handleConfirmNavigation = useCallback(async () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     if (pendingNavigation) {
//       if (pendingNavigation.label === 'logout') {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logged out successfully!');
//         navigate('/');
//       } else if (pendingNavigation.label === 'deleteAccount') {
//         await handleDeleteAccount();
//       } else if (pendingNavigation.label === 'addDashboard') {
//         setShowModal(true);
//         setIsMenuOpen(false);
//       } else {
//         await logActivity(`${pendingNavigation.label} tab clicked`);
//         navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//       }
//       setPendingNavigation(null);
//     } else if (pendingTab) {
//       setActiveTab(pendingTab);
//       setPendingTab(null);
//       setIsMenuOpen(false);
//     }
//   }, [pendingNavigation, pendingTab, navigate, logout]);

//   // Handle cancel navigation
//   const handleCancelNavigation = useCallback(() => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     setPendingNavigation(null);
//     setPendingTab(null);
//   }, []);

//   // Handle save and navigate
//   const handleSaveAndNavigate = useCallback(async () => {
//     setShowUnsavedModal(false);
//     setShowSavedModal(false);
//     await handleSaveDashboard();
//     setShowSavedModal(false);
//     if (pendingNavigation) {
//       if (pendingNavigation.label === 'logout') {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userType');
//         localStorage.removeItem('userEmail');
//         logout();
//         toast.success('Logged out successfully!');
//         navigate('/');
//       } else if (pendingNavigation.label === 'deleteAccount') {
//         await handleDeleteAccount();
//       } else if (pendingNavigation.label === 'addDashboard') {
//         setShowModal(true);
//         setIsMenuOpen(false);
//       } else {
//         await logActivity(`${pendingNavigation.label} tab clicked`);
//         navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
//       }
//       setPendingNavigation(null);
//     } else if (pendingTab) {
//       setActiveTab(pendingTab);
//       setPendingTab(null);
//       setIsMenuOpen(false);
//     }
//   }, [pendingNavigation, pendingTab, handleSaveDashboard, navigate, logout]);

//   // Handle delete account
//   const handleDeleteAccount = useCallback(async () => {
//     if (hasUnsavedChanges) {
//       setPendingNavigation({ label: 'deleteAccount', path: '/' });
//       setShowUnsavedModal(true);
//       setShowSavedModal(false);
//       return;
//     }
//     const apiUrl =
//       userType === 'corporate'
//         ? `${API_BASE}/corporate/delete-account`
//         : `${API_BASE}/Userprofile/delete-account`;

//     try {
//       await axios.delete(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       toast.success('Account deleted successfully');
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('userType');
//       localStorage.removeItem('hasShownQuizPopup');
//       logout();
//       navigate('/');
//       setShowDeleteModal(false);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete account');
//     }
//   }, [hasUnsavedChanges, userType, API_BASE, logout, navigate]);

//   // Handle top company click
//   const handleTopCompanyClick = useCallback(async () => {
//     try {
//       const response = await fetch(`${API_BASE}/market/top-company`, { method: 'GET' });
//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.error || 'Failed to fetch top company');
//       }
//       const topCompany = await response.json();
//       if (!topCompany?.Symbol || !topCompany?.CompanyName) {
//         toast.error('No top company data available.');
//         return;
//       }

//       const plotsToAdd = [
//         { label: 'MacdPlot', graphType: 'MacdPlot' },
//         { label: 'SensexCalculator', graphType: 'SensexCalculator' },
//         { label: 'CandlePatternPlot', graphType: 'CandlePatternPlot' },
//       ];

//       setDroppedMap((prev) => {
//         const currentTab = prev[activeTab] || { general: [] };
//         const newItems = plotsToAdd.map((plot) => {
//           const uniqueId = `${plot.label}-${topCompany.Symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//           return {
//             label: plot.label,
//             symbol: topCompany.Symbol,
//             companyName: topCompany.CompanyName,
//             graphType: plot.graphType,
//             id: uniqueId,
//             type: 'equity',
//             sortableId: uniqueId,
//           };
//         });
//         return {
//           ...prev,
//           [activeTab]: { ...currentTab, general: [...(currentTab.general || []), ...newItems] },
//         };
//       });

//       setDragCountMap((prev) => {
//         const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
//         plotsToAdd.forEach((plot) => {
//           updated[activeTab][plot.label] = (updated[activeTab][plot.label] || 0) + 1;
//         });
//         return updated;
//       });

//       setHasUnsavedChanges(true);
//       toast.success(`Added plots for ${topCompany.CompanyName}`);
//     } catch (err) {
//       console.error('Top company error:', err);
//       setError('Failed to fetch top company plots.');
//       toast.error('Failed to fetch top company plots.');
//     }
//   }, [activeTab, API_BASE]);

//   // Render plot
//   const renderPlot = useCallback(
//     (plotItem, index, allItems) => {
//       const { label, symbol, companyName, id, uploadId, platform, type } = plotItem;
//       const ComponentMap = type === 'equity' ? equityHubMap : portfolioMap;
//       const Component = ComponentMap[label];

//       const getPlotDimensions = (plotLabel, screenWidth) => {
//         const baseDimensions = {
//           MacdPlot: { minHeight: 'min-h-[650px]', aspectRatio: 'aspect-[16/9]' },
//           SensexCalculator: { minHeight: 'min-h-[600px]', aspectRatio: 'aspect-[16/9]' },
//           CandlePatternPlot: { minHeight: 'min-h-[700px]', aspectRatio: 'aspect-[16/9]' },
//           PortfolioOverview: { minHeight: 'min-h-[600px]', aspectRatio: 'aspect-[16/9]' },
//           default: { minHeight: 'min-h-[600px]', aspectRatio: 'aspect-[16/9]' },
//         };
//         const dimensions = baseDimensions[plotLabel] || baseDimensions.default;
//         return screenWidth < 768 ? { minHeight: 'min-h-[400px]', aspectRatio: 'aspect-[4/3]' } : dimensions;
//       };

//       const dimensions = getPlotDimensions(label, window.innerWidth);

//       if (!Component) {
//         return (
//           <motion.div
//             key={`general-${id}`}
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: index * 0.1 }}
//             className={`relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 h-full ${dimensions.minHeight}`}
//           >
//             <button
//               onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//               className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
//               aria-label={`Delete ${label} component`}
//             >
//               <IoMdClose size={18} />
//             </button>
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <IoMdClose className="text-red-500 text-2xl" />
//               </div>
//               <p className="text-red-500 font-semibold text-lg">Component "{label}" not found</p>
//             </div>
//           </motion.div>
//         );
//       }

//       if (type === 'equity' && !symbol) {
//         return (
//           <motion.div
//             key={`general-${id}`}
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: index * 0.1 }}
//             className={`relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 h-full ${dimensions.minHeight}`}
//           >
//             <button
//               onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//               className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
//               aria-label={`Delete ${label} component`}
//             >
//               <IoMdClose size={18} />
//             </button>
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <p className="text-amber-600 dark:text-amber-400 font-semibold text-lg">Waiting for company selection</p>
//             </div>
//           </motion.div>
//         );
//       }

//       return (
//         <motion.div
//           key={`general-${id}`}
//           initial={{ opacity: 0, scale: 0.9, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: index * 0.1 }}
//           className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-full group ${dimensions.minHeight}`}
//         >
//           <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-t-2xl">
//             <div className="flex items-center gap-3">
//               <div className="w-3 h-3 bg-gradient-to-r from-sky-500 to-purple-600 rounded-full"></div>
//               <div>
//                 <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</h3>
//                 <p className="text-xs text-slate-600 dark:text-slate-400">{companyName || platform || 'Financial Analytics'}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
//               className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
//               aria-label={`Delete ${label} component`}
//             >
//               <IoMdClose size={16} />
//             </button>
//           </div>
//           <div className={`p-5 w-full ${dimensions.minHeight.replace('min-h-', 'min-h-[calc(').replace(')', '-80px)]')} ${dimensions.aspectRatio}`}>
//             {type === 'equity' ? (
//               <div className="w-full h-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-4">
//                 <Component symbol={symbol || ''} key={`${id}-${symbol || 'default'}`} />
//               </div>
//             ) : (
//               <div className="w-full h-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-4">
//                 <GraphDataProvider>
//                   <Component uploadId={uploadId} key={`${id}-${uploadId}`} />
//                 </GraphDataProvider>
//               </div>
//             )}
//           </div>
//           <div className="absolute inset-0 border-2 border-transparent group-hover:border-sky-400/40 rounded-2xl pointer-events-none" />
//         </motion.div>
//       );
//     },
//     [handleDeleteComponent]
//   );

//   // Drag-and-drop sensors
//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
//     useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
//       <Helmet>
//         <link rel="canonical" href="https://cmdahub.com/researchpanel" />
//       </Helmet>
//       <div className="fixed top-0 left-0 right-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
//         <Navbar
//           handleNavClick={handleNavClick}
//           hasUnsavedChanges={hasUnsavedChanges}
//           setPendingNavigation={setPendingNavigation}
//           setShowUnsavedModal={setShowUnsavedModal}
//         />
//       </div>

//       <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//         <div className="flex flex-1 mt-16">
//           <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] z-40">
//             <SidebarRight collapsed={collapsed} setCollapsed={setCollapsed} onItemClick={handleItemClick} />
//           </div>

//           <div className={`flex-1 transition-all duration-500 ${collapsed ? 'pr-14' : 'pr-64'} overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin`}>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-slate-200/50 dark:border-slate-700/50"
//               >
//                 <div className="flex flex-wrap items-center justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-gradient-to-br from-sky-500 to-purple-600 rounded-xl">
//                       <FaPalette className="text-white text-lg" />
//                     </div>
//                     <div>
//                       <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
//                         Professional Dashboard
//                       </h1>
//                       <p className="text-slate-600 dark:text-slate-400 text-sm">Customize your financial analytics</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={handleTopCompanyClick}
//                       className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-sky-600 to-purple-600 text-white rounded-xl"
//                     >
//                       <FaRocket className="text-lg" />
//                       Market Leader
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={handleSaveDashboard}
//                       className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl"
//                     >
//                       <BiSolidSave className="text-lg" />
//                       Save Dashboard
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>

//               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 mb-8">
//                 {tabs.map((tab) => (
//                   <div key={tab} className={`border-2 border-transparent ${activeTab === tab ? 'opacity-100' : 'opacity-70 hover:opacity-100'} rounded-[16px] bg-gradient-to-r from-sky-500 to-purple-600 p-[2px]`}>
//                     <div className="flex items-center bg-white dark:bg-slate-800 px-4 py-2.5 rounded-[14px]">
//                       {editingTab === tab ? (
//                         <div className="flex items-center gap-2">
//                           <input
//                             type="text"
//                             value={editedTabName}
//                             onChange={(e) => setEditedTabName(e.target.value)}
//                             onKeyDown={(e) => e.key === 'Enter' && handleRenameTab(tab, editedTabName)}
//                             className="w-32 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
//                             autoFocus
//                           />
//                           <button
//                             onClick={() => handleRenameTab(tab, editedTabName)}
//                             className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg"
//                             title="Save"
//                           >
//                             <IoMdSave size={16} />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleTabSwitch(tab)}
//                             className={`text-sm font-semibold ${activeTab === tab ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'}`}
//                           >
//                             {tab}
//                           </button>
//                           <button
//                             onClick={() => {
//                               setEditingTab(tab);
//                               setEditedTabName(tab);
//                             }}
//                             className="p-1.5 text-slate-400 hover:text-sky-500 rounded-lg"
//                             title="Rename"
//                           >
//                             <MdOutlineDriveFileRenameOutline size={14} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteDashboardAPI(tab)}
//                             className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
//                             title="Delete"
//                           >
//                             <IoMdClose size={14} />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setShowModal(true)}
//                   className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-600"
//                 >
//                   <MdOutlineDashboardCustomize size={18} />
//                   New Dashboard
//                 </motion.button>
//               </motion.div>

//               {getUniqueCompanies().length > 0 && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="flex flex-wrap gap-3 items-center mb-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50"
//                 >
//                   <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-full">
//                     Selected Stocks:
//                   </span>
//                   {getUniqueCompanies().map((companyName) => (
//                     <motion.div
//                       key={companyName}
//                       initial={{ scale: 0.8, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-600"
//                     >
//                       <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
//                         {companyName}
//                       </span>
//                       <button
//                         onClick={() => handleClearCompany(companyName)}
//                         className="p-1 text-slate-400 hover:text-red-500 rounded-lg"
//                         title="Remove"
//                       >
//                         <IoMdClose size={14} />
//                       </button>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               )}

//               <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
//                 <section className="space-y-6">
//                   <div className="text-center">
//                     <motion.h2
//                       initial={{ opacity: 0, y: -20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="text-2xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
//                     >
//                       Interactive Whiteboard
//                     </motion.h2>
//                     <motion.p
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.1 }}
//                       className="text-slate-600 dark:text-slate-300 mt-2 text-sm"
//                     >
//                       Drag components from the sidebar and resize plots
//                     </motion.p>
//                   </div>

//                   <DroppableArea id="general">
//                     {(() => {
//                       const droppedItems = droppedMap?.[activeTab]?.general || [];
//                       const visibleItems = droppedItems.map((item) => ({
//                         ...item,
//                         sortableId: item.sortableId || `item-${item.id}`,
//                       }));

//                       if (visibleItems.length === 0) {
//                         return (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="flex flex-col items-center justify-center py-24 min-h-[800px] px-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600"
//                           >
//                             <motion.div
//                               animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
//                               transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
//                               className="mb-6"
//                             >
//                               <div className="p-6 bg-gradient-to-br from-sky-500/10 to-purple-600/10 rounded-2xl">
//                                 <FaMagic className="h-16 w-16 text-sky-500 dark:text-sky-400" />
//                               </div>
//                             </motion.div>
//                             <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
//                               Create Your Masterpiece
//                             </h3>
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => setCollapsed(false)}
//                               className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-600 to-purple-600 text-white rounded-2xl"
//                             >
//                               <GoSidebarExpand size={24} />
//                               Explore Components
//                             </motion.button>
//                           </motion.div>
//                         );
//                       }

//                       const rows = [];
//                       for (let i = 0; i < visibleItems.length; i += 2) {
//                         rows.push(visibleItems.slice(i, i + 2));
//                       }

//                       const minHeightPerRow = 800;
//                       const totalMinHeight = Math.max(minHeightPerRow * rows.length, 900);

//                       return (
//                         <SortableContext items={visibleItems.map((item) => item.sortableId)} strategy={() => null}>
//                           <PanelGroup
//                             direction="vertical"
//                             className="rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md"
//                             style={{ minHeight: `${totalMinHeight}px` }}
//                             onLayout={() => setResizing(false)}
//                           >
//                             {rows.map((rowItems, rowIndex) => (
//                               <React.Fragment key={`row-${rowIndex}`}>
//                                 {rowIndex > 0 && (
//                                   <PanelResizeHandle onDragging={setResizing}>
//                                     <ResizeHandle direction="vertical" />
//                                   </PanelResizeHandle>
//                                 )}
//                                 <Panel defaultSize={100 / rows.length} minSize={40}>
//                                   <PanelGroup direction="horizontal">
//                                     {rowItems.map((item, idx) => (
//                                       <React.Fragment key={`item-${item.id}`}>
//                                         {idx > 0 && (
//                                           <PanelResizeHandle onDragging={setResizing}>
//                                             <ResizeHandle direction="horizontal" />
//                                           </PanelResizeHandle>
//                                         )}
//                                         <Panel defaultSize={100 / rowItems.length} minSize={30}>
//                                           <Draggable id={item.sortableId}>
//                                             <div className="h-full p-2">{renderPlot(item, rowIndex * 2 + idx, visibleItems)}</div>
//                                           </Draggable>
//                                         </Panel>
//                                       </React.Fragment>
//                                     ))}
//                                   </PanelGroup>
//                                 </Panel>
//                               </React.Fragment>
//                             ))}
//                           </PanelGroup>
//                         </SortableContext>
//                       );
//                     })()}
//                   </DroppableArea>
//                 </section>
//               </main>
//             </div>
//           </div>

//           <AnimatePresence>
//             {showUnsavedModal && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-lg"
//               >
//                 <motion.div
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   exit={{ scale: 0.9, opacity: 0 }}
//                   className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full border-2 border-transparent bg-gradient-to-r from-sky-500 to-purple-600 p-[2px]"
//                 >
//                   <div className="bg-white dark:bg-slate-800 rounded-[14px] p-6">
//                     <div className="text-center">
//                       <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                         <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
//                           />
//                         </svg>
//                       </div>
//                       <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">Unsaved Changes</h2>
//                       <p className="text-slate-600 dark:text-slate-400 mb-6">
//                         You have unsaved changes. Would you like to save before{' '}
//                         {pendingNavigation ? `navigating to ${pendingNavigation.label}` : pendingTab ? `switching to ${pendingTab}` : 'leaving'}?
//                       </p>
//                     </div>
//                     <div className="flex gap-4">
//                       <button
//                         onClick={handleSaveAndNavigate}
//                         className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl"
//                       >
//                         Save & Continue
//                       </button>
//                       <button
//                         onClick={handleConfirmNavigation}
//                         className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl"
//                       >
//                         Leave Anyway
//                       </button>
//                     </div>
//                     <button
//                       onClick={handleCancelNavigation}
//                       className="w-full mt-4 px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <PortfolioSelectModal
//             isOpen={showPortfolioModal}
//             onClose={() => {
//               setShowPortfolioModal(false);
//               setCurrentDragItem(null);
//               setError(null);
//             }}
//             portfolios={savedPortfolios}
//             onSelectPortfolio={handlePortfolioSelect}
//             error={error}
//           />

//           <DragStartModal
//             isOpen={showDragModal}
//             onClose={() => {
//               setShowDragModal(false);
//               setCurrentDragItem(null);
//             }}
//             onSelect={(stock) => {
//               if (currentDragItem) {
//                 const uniqueId = `${currentDragItem.label}-${stock.symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//                 setDroppedMap((prev) => ({
//                   ...prev,
//                   [activeTab]: {
//                     ...prev[activeTab],
//                     general: [
//                       ...(prev[activeTab]?.general || []),
//                       {
//                         label: currentDragItem.label,
//                         symbol: stock.symbol,
//                         companyName: stock.companyName,
//                         graphType: currentDragItem.label,
//                         id: uniqueId,
//                         type: 'equity',
//                         sortableId: uniqueId,
//                       },
//                     ],
//                   },
//                 }));
//                 setDragCountMap((prev) => ({
//                   ...prev,
//                   [activeTab]: {
//                     ...prev[activeTab],
//                     [currentDragItem.label]: (prev[activeTab]?.[currentDragItem.label] || 0) + 1,
//                   },
//                 }));
//                 setShowDragModal(false);
//                 setCurrentDragItem(null);
//                 setHasUnsavedChanges(true);
//               }
//             }}
//           />

//           {showDeleteModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-md w-full"
//               >
//                 <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Confirm Deletion</h2>
//                 <p className="text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to delete your account?</p>
//                 <div className="flex gap-4">
//                   <button
//                     onClick={handleDeleteAccount}
//                     className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </div>
//       </DndContext>
//     </div>
//   );
// };

// export default DashBoard;





import React, { useEffect, useState, useRef } from 'react';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Navbar from '../Navbar';
import { MdOutlineDashboardCustomize, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { BiSolidSave } from 'react-icons/bi';
import { IoMdClose, IoMdSave } from 'react-icons/io';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import SidebarRight from './SidebarRight';
import AddNewModal from './AddNewModal';
import DragStartModal from './DragStartModal';
import DroppableArea from './DroppableArea';
import { equityHubMap, portfolioMap } from './ComponentRegistry';
import { GoSidebarExpand } from 'react-icons/go';
import { GraphDataProvider } from '../Portfolio/GraphDataContext';
import PortfolioSelectModal from './PortfolioSelectModal';
import { Search } from 'lucide-react';
import SearchList from '../EquityHub/SearchList';
import { useAuth } from '../AuthContext';
import { CiLogout } from 'react-icons/ci';
import { logActivity } from '../../services/api';
import { IoMdArrowDropdown } from 'react-icons/io';
import axios from 'axios';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FaChartLine, FaBriefcase, FaInfoCircle, FaRocket } from 'react-icons/fa';
import DraggableItem from './DraggableItem';
import ResizeHandle from './ResizeHandle';
import { Helmet } from 'react-helmet-async';
import ResearchChart from '../CandlePatternComponent/ResearchChart';

Modal.setAppElement('#root');

// Graph size scores for all plot types
const graphSizeScores = {
  CandlePatternPlot: 80,
  Heatmap: 50,
  MacdPlot: 55,
  SensexCalculator: 45,
  CandleSpread: 55,
  CandleBreach: 50,
  LastTraded: 45,
  AvgBoxPlots: 50,
  WormsPlots: 50,
  SensexStockCorrBar: 60,
  SensexVsStockCorr: 60,
  DelRate: 45,
  IndustryBubble: 70,
  PegyWormPlot: 55,
  ResearchChart: 80,
  
  LatestInsights: 45,
  ShortNseTable: 45,
  PortfolioResults: 70,
  PortfMatrics: 45,
  TopTenScript: 60,
  ShareholdingPlot: 55,
  PriceAcquisitionPlot: 50,
  StockDepAmtOverTime: 60,
  CombinedBox: 65,
  CreatePNL: 50,
  SwotPlot: 50,
  ComBubChart: 70,
  InvAmtPlot: 65,
  BestTradePlot: 50,
  ClassifyStockRisk: 50,
  EPSQuarterlyChart: 60,
  default: 50,
};

// Maximum cumulative size score for a row
const MAX_ROW_SIZE_SCORE = 100;

// Custom Draggable component
const Draggable = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const DashBoard = () => {
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const [showModal, setShowModal] = useState(false);
  const [tabs, setTabs] = useState(['Dashboard 1']);
  const [activeTab, setActiveTab] = useState('Dashboard 1');
  const [uploadId, setUploadId] = useState(null);
  const [platform, setPlatform] = useState('');
  const [symbol, setSymbol] = useState(null);
  const [savedStocks, setSavedStocks] = useState([]);
  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [droppedMap, setDroppedMap] = useState({ 'Dashboard 1': { general: [] } });
  const [savedDroppedMap, setSavedDroppedMap] = useState({});
  const [editingTab, setEditingTab] = useState(null);
  const [editedTabName, setEditedTabName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedStocks, setSearchedStocks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDragModal, setShowDragModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dragCountMap, setDragCountMap] = useState({ 'Dashboard 1': {} });
  const [currentDragItem, setCurrentDragItem] = useState(null);
  const [error, setError] = useState(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [pendingTab, setPendingTab] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [sticky, setSticky] = useState(false);
  const [userType, setUserType] = useState(null);
  const [fullName, setFullName] = useState('');
  const initialQuery = queryParams.get('query') || '';
  const [isDisabled, setIsDisabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const drawerRef = useRef(null);
  const [resizing, setResizing] = useState(false);
  const { login, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [researchCharts, setResearchCharts] = useState([]);
  const [showResearchCharts, setShowResearchCharts] = useState(false);
    const [researchChartsAdded, setResearchChartsAdded] = useState(false);  
  // Check for research data when component mounts or location changes
  // Auto-add research charts when component mounts
  useEffect(() => {
    const addResearchChartsToDashboard = () => {
      // Don't add if already added in this session
      if (researchChartsAdded) return;

      let researchData = null;

      // Check location state first
      if (location.state?.fromPatternScanner && location.state?.researchData) {
        researchData = location.state.researchData;
        // Clear the state to avoid adding again
        window.history.replaceState({}, document.title);
      } else {
        // Check localStorage as fallback
        const storedResearchData = localStorage.getItem('researchChartData');
        if (storedResearchData) {
          try {
            researchData = JSON.parse(storedResearchData);
            // Clear localStorage after reading
            localStorage.removeItem('researchChartData');
          } catch (error) {
            console.error('Error parsing research chart data:', error);
            return;
          }
        }
      }

      if (researchData?.researchCharts && researchData.researchCharts.length > 0) {
        // Add each research chart to the dashboard
        researchData.researchCharts.forEach((researchChart, index) => {
          const uniqueId = `ResearchChart-${researchChart.fincode}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
          
          const newResearchItem = {
            label: "ResearchChart",
            symbol: researchChart.symbol,
            companyName: researchChart.symbol,
            graphType: "ResearchChart",
            id: uniqueId,
            type: 'research',
            sortableId: uniqueId,
            researchData: researchChart
          };

          setDroppedMap((prev) => {
            const currentTab = prev[activeTab] || { general: [] };
            const currentSection = currentTab.general || [];
            return {
              ...prev,
              [activeTab]: { ...currentTab, general: [...currentSection, newResearchItem] },
            };
          });
        });

        setHasUnsavedChanges(true);
        setResearchChartsAdded(true);
        
        // Show success message
        setTimeout(() => {
          toast.success(`Added ${researchData.researchCharts.length} research chart(s) to your dashboard`);
        }, 500);
      }
    };

    addResearchChartsToDashboard();
  }, [location, researchChartsAdded, activeTab]);
  // Function to handle closing research charts and returning to normal dashboard
  const handleCloseResearchCharts = () => {
    setShowResearchCharts(false);
    setResearchCharts([]);
    localStorage.removeItem('researchChartData');
  };

  // Function to add research chart to current dashboard
  const handleAddResearchChartToDashboard = (researchChart) => {
    const uniqueId = `ResearchChart-${researchChart.fincode}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newResearchItem = {
      label: "ResearchChart",
      symbol: researchChart.symbol,
      companyName: researchChart.symbol,
      graphType: "ResearchChart",
      id: uniqueId,
      type: 'research',
      sortableId: uniqueId,
      researchData: researchChart
    };

    setDroppedMap((prev) => {
      const currentTab = prev[activeTab] || { general: [] };
      const currentSection = currentTab.general || [];
      return {
        ...prev,
        [activeTab]: { ...currentTab, general: [...currentSection, newResearchItem] },
      };
    });

    setHasUnsavedChanges(true);
    toast.success(`Research chart for ${researchChart.symbol} added to dashboard`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#portfolio-dropdown')) {
        setIsPortfolioOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const currentTab = droppedMap[activeTab] || { general: [] };
    const savedTab = savedDroppedMap[activeTab] || { general: [] };
    const hasChanges = JSON.stringify(currentTab.general) !== JSON.stringify(savedTab.general);
    setHasUnsavedChanges(hasChanges);
  }, [droppedMap, activeTab, savedDroppedMap]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const storedUploadId = localStorage.getItem('uploadId');
    const storedPlatform = localStorage.getItem('platform');
    if (storedUploadId && storedPlatform) {
      setUploadId(storedUploadId);
      setPlatform(storedPlatform);
    }
  }, []);

  const fetchSavedPortfolio = async () => {
    try {
      setError('');
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to view your portfolios');
        return;
      }
      const response = await fetch(`${API_BASE}/file/saved`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Failed to fetch saved portfolios');
        return;
      }
      const data = await response.json();
      if (data.length > 0) {
        setSavedPortfolios(data);
        setUploadId(data[0].uploadId);
        setPlatform(data[0].platform);
      } else {
        setSavedPortfolios([]);
        setError('No portfolios found');
      }
    } catch (err) {
      console.error('Error fetching saved portfolios:', err);
      setError('Network error. Please try again later.');
    }
  };

  useEffect(() => {
    fetchSavedPortfolio();
  }, [API_BASE]);

  const handleStockSearch = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/stocks/test/search?query=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setSearchedStocks(data);
        setSavedStocks(data);
      } else {
        setSearchedStocks([]);
        toast.info('No stocks found for the search term.');
        setError('Company not found');
      }
    } catch (err) {
      console.error('Error fetching stock suggestions:', err);
      setSearchedStocks([]);
      setError('Company not found in our list. Please check the name and search again.');
    }
  };

  const handleRenameTab = (oldName, newName) => {
    if (!newName || newName.trim() === '') return;
    if (tabs.includes(newName)) {
      toast.info('A dashboard with this name already exists.');
      return;
    }
    setTabs((prevTabs) => prevTabs.map((tab) => (tab === oldName ? newName : tab)));
    setDroppedMap((prev) => {
      const updated = { ...prev };
      updated[newName] = prev[oldName];
      delete updated[oldName];
      return updated;
    });
    setSavedDroppedMap((prev) => {
      const updated = { ...prev };
      updated[newName] = prev[oldName];
      delete updated[oldName];
      return updated;
    });
    setDragCountMap((prev) => {
      const updated = { ...prev };
      updated[newName] = prev[oldName];
      delete updated[oldName];
      return updated;
    });
    if (activeTab === oldName) setActiveTab(newName);
    setEditingTab(null);
    setEditedTabName('');
  };

  const handleDeleteComponent = (index) => {
    setDroppedMap((prev) => {
      const updated = { ...prev };
      updated[activeTab] = {
        ...prev[activeTab],
        general: prev[activeTab].general.filter((_, idx) => idx !== index),
      };
      return updated;
    });
    const label = droppedMap[activeTab].general[index].label;
    const remaining = droppedMap[activeTab].general.filter((item, idx) => idx !== index && item.label === label);
    if (remaining.length === 0) {
      setDragCountMap((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], [label]: 0 },
      }));
    }
    setHasUnsavedChanges(true);
  };

  const handleClearCompany = (companyName) => {
    setDroppedMap((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        general: prev[activeTab].general.filter((item) => item.companyName !== companyName),
      },
    }));
    const affectedLabels = droppedMap[activeTab].general
      .filter((item) => item.companyName === companyName)
      .map((item) => item.label);
    setDragCountMap((prev) => {
      const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
      affectedLabels.forEach((label) => {
        const remaining = droppedMap[activeTab].general.filter(
          (item) => item.label === label && item.companyName !== companyName
        );
        updated[activeTab][label] = remaining.length > 0 ? prev[activeTab][label] || 1 : 0;
      });
      return updated;
    });
    toast.success(`Company ${companyName} and associated graphs removed`);
    setHasUnsavedChanges(true);
  };

  const generateDefaultDashboardName = async (baseName = 'Dashboard') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/dashboard/fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch dashboards');
      const data = await response.json();
      const existingNames = data.dashboards.map((dash) => dash.dashboardName);
      let index = 1;
      let defaultName;
      do {
        defaultName = `${baseName} ${index}`;
        index++;
      } while (existingNames.includes(defaultName) || tabs.includes(defaultName));
      return defaultName;
    } catch (err) {
      console.error('Error fetching dashboards for name generation:', err);
      let index = 1;
      let defaultName;
      do {
        defaultName = `${baseName} ${index}`;
        index++;
      } while (tabs.includes(defaultName));
      return defaultName;
    }
  };

  const handleNewDashboard = async (title) => {
    const newTitle = title && title.trim() ? title : await generateDefaultDashboardName();
    if (tabs.includes(newTitle)) {
      toast.info('A dashboard with this name already exists.');
      return;
    }
    setTabs((prev) => [...prev, newTitle]);
    setDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
    setSavedDroppedMap((prev) => ({ ...prev, [newTitle]: { general: [] } }));
    setActiveTab(newTitle);
    setShowModal(false);
    setDragCountMap((prev) => ({ ...prev, [newTitle]: {} }));
    setIsMenuOpen(false);
    setHasUnsavedChanges(false);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const label = active?.data?.current?.label;
    setCurrentDragItem(active?.data?.current);
    const equityLabels = Object.keys(equityHubMap);
    const portfolioLabels = Object.keys(portfolioMap);
    if (equityLabels.includes(label)) {
      setShowDragModal(true);
    } else if (portfolioLabels.includes(label)) {
      setShowPortfolioModal(true);
    }
  };

  const handleItemClick = (item) => {
    const { id, label } = item;
    const equityLabels = Object.keys(equityHubMap);
    const portfolioLabels = Object.keys(portfolioMap);

    let section = null;
    if (equityLabels.includes(label)) section = 'equity';
    if (portfolioLabels.includes(label)) section = 'portfolio';

    if (section === 'equity') {
      setCurrentDragItem({ label });
      setShowDragModal(true);
      return;
    }

    if (section === 'portfolio') {
      setCurrentDragItem({ label });
      setShowPortfolioModal(true);
      return;
    }
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    const label = active?.data?.current?.label;
    const id = active?.id;

    // Handle reordering of existing items
    if (active.data.current?.sortable) {
      const items = droppedMap[activeTab]?.general || [];
      const oldIndex = items.findIndex((item) => item.sortableId === active.id);
      const newIndex = items.findIndex((item) => item.sortableId === over?.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setDroppedMap((prev) => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            general: arrayMove(prev[activeTab].general, oldIndex, newIndex),
          },
        }));
        setHasUnsavedChanges(true);
      }
      return;
    }

    // Handle new item drop
    if (!over || !label || !id) return;

    const equityLabels = Object.keys(equityHubMap);
    const portfolioLabels = Object.keys(portfolioMap);

    if (equityLabels.includes(label)) {
      setCurrentDragItem(active?.data?.current);
      setShowDragModal(true);
      return;
    }

    if (portfolioLabels.includes(label)) {
      setCurrentDragItem(active?.data?.current);
      setShowPortfolioModal(true);
      return;
    }
  };

  const handlePortfolioSelect = (portfolio) => {
    if (currentDragItem) {
      const uniqueId = `${currentDragItem.label}-${portfolio.uploadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const draggedItem = {
        label: currentDragItem.label,
        symbol: '',
        companyName: '',
        graphType: currentDragItem.label,
        uploadId: portfolio.uploadId,
        platform: portfolio.platform,
        id: uniqueId,
        type: 'portfolio',
        sortableId: uniqueId,
      };

      setDroppedMap((prev) => {
        const currentTab = prev[activeTab] || { general: [] };
        const currentSection = currentTab.general || [];
        return {
          ...prev,
          [activeTab]: { ...currentTab, general: [...currentSection, draggedItem] },
        };
      });
      setUploadId(portfolio.uploadId);
      setPlatform(portfolio.platform);
      localStorage.setItem('uploadId', portfolio.uploadId.toString());
      localStorage.setItem('platform', portfolio.platform);
      setShowPortfolioModal(false);
      setCurrentDragItem(null);
      setHasUnsavedChanges(true);
    }
  };

  const getVisibleItems = (items) => items;

  const handleSaveDashboard = async () => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    const generalPlots = droppedMap?.[activeTab]?.general || [];

    if (!token) {
      toast.error('Please login first to save your dashboard.');
      return;
    }

    if (generalPlots.length === 0) {
      toast.error('Please drag and drop at least one plot before saving.');
      return;
    }

    let finalDashboardName = activeTab;

    try {
      const response = await fetch(`${API_BASE}/dashboard/fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch dashboards');
      const data = await response.json();
      const existingNames = data.dashboards.map((dash) => dash.dashboardName);
      if (existingNames.includes(finalDashboardName)) {
        finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
        setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
        setDroppedMap((prev) => {
          const updated = { ...prev };
          updated[finalDashboardName] = prev[activeTab];
          delete updated[activeTab];
          return updated;
        });
        setSavedDroppedMap((prev) => {
          const updated = { ...prev };
          updated[finalDashboardName] = { general: generalPlots };
          if (activeTab !== finalDashboardName) delete updated[activeTab];
          return updated;
        });
        setDragCountMap((prev) => {
          const updated = { ...prev };
          updated[finalDashboardName] = prev[activeTab];
          delete updated[activeTab];
          return updated;
        });
        setActiveTab(finalDashboardName);
        toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
      }
    } catch (err) {
      console.error('Error checking dashboard names:', err);
      if (tabs.includes(finalDashboardName)) {
        finalDashboardName = await generateDefaultDashboardName(activeTab.split(' ')[0] || 'Dashboard');
        setTabs((prevTabs) => prevTabs.map((tab) => (tab === activeTab ? finalDashboardName : tab)));
        setDroppedMap((prev) => {
          const updated = { ...prev };
          updated[finalDashboardName] = prev[activeTab];
          delete updated[activeTab];
          return updated;
        });
        setSavedDroppedMap((prev) => {
          const updated = { ...prev };
          updated[finalDashboardName] = { general: generalPlots };
          if (activeTab !== finalDashboardName) delete updated[activeTab];
          return updated;
        });
        setDragCountMap((prev) => {
          const updated = { ...prev };
          updated[finalDashboardName] = prev[activeTab];
          delete updated[activeTab];
          return updated;
        });
        setActiveTab(finalDashboardName);
        toast.info(`Dashboard name changed to "${finalDashboardName}" to avoid duplication.`);
      }
    }

    const savedData = {
      dashboard: { dashboardName: finalDashboardName, userId: userId ? parseInt(userId) : 0, userType: userType || '' },
      equityHubPlots: [],
      portfolioPlots: [],
       researchCharts: [],

    };

    generalPlots.forEach(({ label, symbol, companyName, graphType, uploadId, platform, type, researchData }) => {
      if (type === 'equity') {
        let finalSymbol = symbol;
        let finalCompany = companyName;

        if (!finalSymbol || !finalCompany) {
          const matched = savedStocks.find(
            (stock) => stock.symbol === finalSymbol || stock.graphType === graphType || stock.label === label
          );
          if (matched) {
            finalSymbol = finalSymbol || matched.symbol;
            finalCompany = finalCompany || matched.companyName;
          }
        }

        savedData.equityHubPlots.push({ symbol: finalSymbol, companyName: finalCompany, graphType: graphType || label });
      } else if (type === 'portfolio') {
        savedData.portfolioPlots.push({ uploadId, platform, graphType: label });
      }
      else if (type === 'research') {
    // Handle research charts
    savedData.researchCharts.push({
      symbol: researchData?.symbol || symbol,
      companyName: researchData?.symbol || companyName,
      graphType: "ResearchChart",
      researchData: researchData // Save the complete research data
    });
  }
    });

    try {
      const response = await fetch(`${API_BASE}/dashboard/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(savedData),
      });
      if (response.ok) {
        const result = await response.json();
        setSavedDroppedMap((prev) => ({
          ...prev,
          [finalDashboardName]: { general: generalPlots },
        }));
        setHasUnsavedChanges(false);
        setShowSavedModal(true);
        setTimeout(() => setShowSavedModal(false), 2000);
      } else {
        toast.error('Failed to save dashboard');
      }
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Save failed');
    }
    setIsMenuOpen(false);
  };

  const handleDeleteDashboardAPI = async (dashboardName) => {
    if (hasUnsavedChanges) {
      setPendingTab(dashboardName);
      setShowUnsavedModal(true);
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE}/dashboard/delete/${dashboardName}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete dashboard');
      setTabs((prev) => prev.filter((tab) => tab !== dashboardName));
      setDroppedMap((prev) => {
        const updated = { ...prev };
        delete updated[dashboardName];
        return updated;
      });
      setSavedDroppedMap((prev) => {
        const updated = { ...prev };
        delete updated[dashboardName];
        return updated;
      });
      setDragCountMap((prev) => {
        const updated = { ...prev };
        delete updated[dashboardName];
        return updated;
      });
      if (activeTab === dashboardName) {
        const remainingTabs = tabs.filter((tab) => tab !== dashboardName);
        setActiveTab(remainingTabs[0] || '');
      }
      toast.success('Dashboard deleted successfully');
      setIsMenuOpen(false);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete dashboard');
    }
  };

  const getUniqueCompanies = () => {
    const generalItems = droppedMap[activeTab]?.general || [];
    return [...new Set(generalItems.filter((item) => item.companyName).map((item) => item.companyName))];
  };

  const isDashboardEmpty = () => {
    const currentTab = droppedMap[activeTab] || { general: [] };
    return currentTab.general.length === 0;
  };

  const getCachedData = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > 3600000) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (err) {
      setError('Failed to parse cached data.');
      console.error('Cache parse error:', err);
      return null;
    }
  };

  const setCachedData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (err) {
      setError('Failed to cache data.');
      console.error('Cache set error:', err);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setError(null);
  };

  const handleLoginClick = () => setShowLoginModal(true);
  const handleCloseModal = () => setShowLoginModal(false);
  const handleLoginSuccess = () => {
    login();
    handleCloseModal();
  };
  const handleLogout = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation({ label: 'logout', path: '/' });
      setShowUnsavedModal(true);
      setShowSavedModal(false);
      return;
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    logout();
    toast.success('Logout successfully!');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (hasUnsavedChanges) {
      setPendingNavigation({ label: 'deleteAccount', path: '/' });
      setShowUnsavedModal(true);
      setShowSavedModal(false);
      return;
    }
    const apiUrl =
      userType === 'corporate'
        ? `${API_BASE}/corporate/delete-account`
        : `${API_BASE}/Userprofile/delete-account`;

    try {
      await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Account deleted successfully');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('hasShownQuizPopup');
      logout();
      navigate('/');
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const handleNavClick = async (label, path, state = {}) => {
    setShowSavedModal(false);
    if (hasUnsavedChanges) {
      setPendingNavigation({ label, path, state });
      setShowUnsavedModal(true);
    } else {
      await logActivity(`${label} tab clicked`);
      navigate(path, { state });
    }
  };

  const handleTabSwitch = (tab) => {
    setShowSavedModal(false);
    if (hasUnsavedChanges && activeTab !== tab) {
      setPendingTab(tab);
      setShowUnsavedModal(true);
    } else {
      setActiveTab(tab);
      setIsMenuOpen(false);
    }
  };

  const handleConfirmNavigation = async () => {
    setShowUnsavedModal(false);
    setShowSavedModal(false);
    if (pendingNavigation) {
      if (pendingNavigation.label === 'logout') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        logout();
        toast.success('Logout successfully!');
        navigate('/');
      } else if (pendingNavigation.label === 'deleteAccount') {
        await handleDeleteAccount();
      } else if (pendingNavigation.label === 'addDashboard') {
        setShowModal(true);
        setIsMenuOpen(false);
      } else {
        await logActivity(`${pendingNavigation.label} tab clicked`);
        navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
      }
      setPendingNavigation(null);
    } else if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
      setIsMenuOpen(false);
    }
  };

  const handleCancelNavigation = () => {
    setShowUnsavedModal(false);
    setShowSavedModal(false);
    setPendingNavigation(null);
    setPendingTab(null);
  };

  const handleSaveAndNavigate = async () => {
    setShowUnsavedModal(false);
    setShowSavedModal(false);
    await handleSaveDashboard();
    setShowSavedModal(false);
    if (pendingNavigation) {
      if (pendingNavigation.label === 'logout') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        logout();
        toast.success('Logout successfully!');
        navigate('/');
      } else if (pendingNavigation.label === 'deleteAccount') {
        await handleDeleteAccount();
      } else if (pendingNavigation.label === 'addDashboard') {
        setShowModal(true);
        setIsMenuOpen(false);
      } else {
        await logActivity(`${pendingNavigation.label} tab clicked`);
        navigate(pendingNavigation.path, { state: pendingNavigation.state || {} });
      }
      setPendingNavigation(null);
    } else if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
      setIsMenuOpen(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleTopCompanyClick = async () => {
    try {
      const apiUrl = `${API_BASE}/market/top-company`;
      const response = await fetch(apiUrl, { method: 'GET' });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch top company');
      }
      const topCompany = await response.json();
      if (!topCompany || !topCompany.Symbol || !topCompany.CompanyName) {
        toast.error('No top company data available.');
        return;
      }

      const plotsToAdd = [
        { label: 'MacdPlot', graphType: 'MacdPlot' },
        { label: 'SensexCalculator', graphType: 'SensexCalculator' },
        { label: 'CandlePatternPlot', graphType: 'CandlePatternPlot' },

      ];

      setDroppedMap((prev) => {
        const currentTab = prev[activeTab] || { general: [] };
        const currentSection = currentTab.general || [];
        const newItems = plotsToAdd.map((plot) => {
          const uniqueId = `${plot.label}-${topCompany.Symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          return {
            label: plot.label,
            symbol: topCompany.Symbol,
            companyName: topCompany.CompanyName,
            graphType: plot.graphType,
            id: uniqueId,
            type: 'equity',
            sortableId: uniqueId,
          };
        });
        return {
          ...prev,
          [activeTab]: { ...currentTab, general: [...currentSection, ...newItems] },
        };
      });

      setDragCountMap((prev) => {
        const updated = { ...prev, [activeTab]: { ...prev[activeTab] } };
        plotsToAdd.forEach((plot) => {
          updated[activeTab][plot.label] = (updated[activeTab][plot.label] || 0) + 1;
        });
        return updated;
      });

      setHasUnsavedChanges(true);
      toast.success(`Sample Dashboard is added for ${topCompany.CompanyName}`);
    } catch (err) {
      setError('Failed to fetch top company plots.');
      toast.error('Failed to fetch top company plots.');
    }
  };

  const renderPlot = (plotItem, index, allItems) => {
    const { label, symbol, companyName, id, uploadId, platform, type,researchData  } = plotItem;
    console.log(`Rendering plot: ${label}, symbol: ${symbol}, id: ${id}`);
    const ComponentMap = type === 'equity' ? equityHubMap : portfolioMap;
    const Component = ComponentMap[label];
    const sizeScore = graphSizeScores[label] || graphSizeScores.default;

     if (label === "ResearchChart" && researchData) {
      return (
        <motion.div
          key={`research-${id}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full group"
          data-size-score={80} // Research charts are larger
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></span>
              Pattern Analysis - {researchData.symbol}
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                {researchData.patterns.length} pattern(s)
              </span>
            </h3>
            <button
              onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
              className="p-1.5 text-gray-500 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
              aria-label="Delete component"
            >
              <IoMdClose size={16} />
            </button>
          </div>

          <div className="p-4 min-h-[700px] flex flex-col">
            <div className="flex-1">
              <ResearchChart 
                priceData={researchData.priceData}
                patterns={researchData.patterns}
                fincode={researchData.fincode}
              />
            </div>
          </div>
        </motion.div>
      );
    }
    if (!Component) {
      return (
        <motion.div
          key={`general-${id}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-200 dark:border-red-700/50 h-full"
        >
          <button
            onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
            aria-label="Delete component"
          >
            <IoMdClose size={18} />
          </button>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoMdClose className="text-red-500 text-xl" />
            </div>
            <p className="text-red-500 font-medium">Component "{label}" not found</p>
          </div>
        </motion.div>
      );
    }

    if (type === 'equity' && !symbol) {
      return (
        <motion.div
          key={`general-${id}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-200 dark:border-yellow-700/50 h-full"
        >
          <button
            onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
            aria-label="Delete component"
          >
            <IoMdClose size={18} />
          </button>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-yellow-600 dark:text-yellow-400 font-medium">Waiting for company selection</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">for {label}</p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={`general-${id}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full group"
        data-size-score={sizeScore}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
            {label}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {companyName ? `(${companyName})` : platform ? `(${platform})` : ''}
            </span>
          </h3>
          <button
            onClick={() => handleDeleteComponent(allItems.findIndex((item) => item.id === id))}
            className="p-1.5 text-gray-500 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
            aria-label="Delete component"
          >
            <IoMdClose size={16} />
          </button>
        </div>

        <div className="p-4 min-h-[700px] flex flex-col">
          {type === 'equity' ? (
            <div className="flex-1">
              <Component symbol={symbol || ''} key={`${id}-${symbol || 'default'}`} />
            </div>
          ) : (
            <GraphDataProvider>
              <div className="flex-1">
                <Component uploadId={uploadId} key={`${id}-${uploadId}`} />
              </div>
            </GraphDataProvider>
          )}
        </div>

        {/* <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-xl pointer-events-none transition-all duration-300" /> */}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <style jsx>{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --secondary: #7c3aed;
          --secondary-dark: #5b21b6;
          --background: #f8fafc;
          --background-dark: #0f172a;
          --text: #1e293b;
          --text-dark: #e2e8f0;
          --border: #e5e7eb;
          --border-dark: #374151;
        }

        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: var(--text);
        }

        .dark {
          color: var(--text-dark);
          background-color: var(--background-dark);
        }

        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: var(--primary) var(--border);
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: var(--border);
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 4px;
        }

        .dark .scrollbar-thin::-webkit-scrollbar-track {
          background: var(--border-dark);
        }

        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--primary-dark);
        }

        .tooltip {
          position: relative;
          display: inline-block;
        }

        .tooltip .tooltip-text {
          visibility: hidden;
          width: 200px;
          background-color: #1e293b;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px;
          position: absolute;
          z-index: 1000;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }

        .dark .tooltip .tooltip-text {
          background-color: #e2e8f0;
          color: #1e293b;
        }
      `}</style>

      <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-800 shadow-sm">
        {/* ✅ SEO & Open Graph Meta Tags */}
        <Helmet>
          <title>Research Panel | CMDA Hub – Customize & Compare Your Investment Dashboard</title>

          <meta
            name="description"
            content="Use CMDA Hub’s Research Panel to compare equities and portfolios in one place. Drag, drop, and customize your dashboard for smarter investment insights and analytics."
          />

          <meta
            name="keywords"
            content="research panel, equity comparison, portfolio analysis, customizable dashboard, CMDA Hub, investment analytics, stock research, Accord Fintech"
          />

          {/* Open Graph for social media previews */}
          <meta property="og:title" content="Research Panel | CMDA Hub" />
          <meta
            property="og:description"
            content="Compare equities, analyze portfolios, and build your own investment dashboard — all in CMDA Hub’s Research Panel."
          />
          <meta property="og:url" content="https://cmdahub.com/researchpanel" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="CMDA Hub" />

          {/* Canonical URL */}
          <link rel="canonical" href="https://cmdahub.com/researchpanel" />
        </Helmet>

        <Navbar
          handleNavClick={handleNavClick}
          hasUnsavedChanges={hasUnsavedChanges}
          setPendingNavigation={setPendingNavigation}
          setShowUnsavedModal={setShowUnsavedModal}
        />
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-1 mt-16">
          <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] z-40">
            <SidebarRight collapsed={collapsed} setCollapsed={setCollapsed} onItemClick={handleItemClick} />
          </div>

          {showModal && <AddNewModal onClose={() => setShowModal(false)} onCreateTab={handleNewDashboard} />}

          <div
            className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'pr-14' : 'pr-80'} overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin`}
          >
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-2 border border-gray-200 dark:border-gray-700 shadow-sm">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    {editingTab === tab ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editedTabName}
                          onChange={(e) => setEditedTabName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRenameTab(tab, editedTabName)}
                          className="w-32 px-2 py-1 bg-white dark:bg-[var(--background-dark)] border border-[var(--border)] dark:border-[var(--border-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRenameTab(tab, editedTabName)}
                          className="p-1 text-green-600 hover:text-green-700 transition-colors"
                          title="Save"
                        >
                          <IoMdSave size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTabSwitch(tab)}
                          className={`text-sm font-medium transition-all duration-200 ${activeTab === tab
                            ? 'text-[var(--primary)]'
                            : 'text-[var(--text)] dark:text-[var(--text-dark)] hover:text-[var(--primary)]'
                            }`}
                        >
                          {tab}
                        </button>
                        <button
                          onClick={() => {
                            setEditingTab(tab);
                            setEditedTabName(tab);
                          }}
                          className="p-1 text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors"
                          title="Rename"
                        >
                          <MdOutlineDriveFileRenameOutline size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteDashboardAPI(tab)}
                          className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <IoMdClose size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowSavedModal(false);
                      if (hasUnsavedChanges) {
                        setPendingNavigation({ label: 'addDashboard', path: null });
                        setShowUnsavedModal(true);
                        return;
                      }
                      setShowModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                    data-tour="dashboard-add"
                  >
                    <MdOutlineDashboardCustomize size={18} /> Add Dashboard
                  </button>

                  <div className="relative inline-block">
                    <button
                      onClick={handleTopCompanyClick}
                      className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                      data-tour="top-company"
                    >
                      <FaRocket size={18} /> Market Leader
                      <div className="absolute bottom-0 right-0 group">
                        <FaInfoCircle size={14} className="text-white/80 cursor-pointer" />
                        {/* <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Adds MACD, Sensex Calculator, and Candlestick plots.
                          </span> */}
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap 
  bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
  group-hover:opacity-100 transition-opacity 
  z-50 pointer-events-none"
                        >
                          Adds MACD, Sensex Calculator, and Candlestick plots.
                        </span>
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={handleSaveDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                    data-tour="dashboard-save"
                  >
                    <BiSolidSave size={18} /> Save
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSavedModal(false);
                      if (!isLoggedIn) {
                        toast.error('Login first to see your dashboards.');
                        return;
                      }
                      handleNavClick('Saved Dashboards', '/saveddashboard');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                    data-tour="dashboard-saved"
                  >
                    <BiSolidSave size={18} /> Saved Dashboards
                  </button>
                </div>
              </div>

              {getUniqueCompanies().length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-3 items-center mb-6 bg-white/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg rounded-xl p-4 border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
                >
                  <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] bg-[var(--border)] dark:bg-[var(--border-dark)] px-3 py-1 rounded-full">
                    Selected Stocks:
                  </span>
                  {getUniqueCompanies().map((companyName) => (
                    <motion.div
                      key={companyName}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[var(--background)] dark:bg-[var(--background-dark)] rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] shadow-sm"
                    >
                      <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] truncate max-w-[120px]">
                        {companyName}
                      </span>
                      <button
                        onClick={() => handleClearCompany(companyName)}
                        className="p-1 text-[var(--text)]/60 hover:text-red-500 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                        title="Remove"
                      >
                        <IoMdClose size={14} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-[var(--text)]/60 dark:text-white mb-6 text-center py-4 bg-white/30 dark:bg-slate-900 rounded-xl border border-dashed border-[var(--border)] dark:border-[var(--border-dark)]"
                >
                  No stocks selected. Add stocks from the sidebar to get started!
                </motion.p>
              )}
            </div>

            <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
   
            
              <section className="space-y-6">
                <div className="text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-semibold bg-gray-700 bg-clip-text text-transparent dark:bg-gray-100"
                  >
                    Interactive Whiteboard
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-[var(--text)]/70 dark:text-gray-300 mt-2 text-sm"
                  >
                    Drag components from the sidebar and resize plots using the handles
                  </motion.p>
                </div>

                <DroppableArea id="general">
                  {(() => {
                    const droppedItems = droppedMap?.[activeTab]?.general || [];
                    const visibleItems = getVisibleItems(
                      droppedItems.map((item) => ({
                        ...item,
                        sortableId: item.sortableId || `item-${item.id}`,
                      }))
                    );

                    if (visibleItems.length === 0) {
                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center py-20 min-h-[900px] px-4 bg-white/50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-[var(--border)] dark:border-[var(--border-dark)] shadow-inner"
                        >
                          <motion.div
                            animate={{
                              y: [0, -10, 0],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="mb-4"
                          >
                            <svg
                              className="h-20 w-20 text-[var(--primary)]/60 dark:text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M4 8v8m0 0h8m-8 0l8-8m4 8v-8m0 0H8m8 0l-8 8"
                              />
                            </svg>
                          </motion.div>
                          <h3 className="text-xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
                            Your Whiteboard Awaits!
                          </h3>
                          <p className="text-[var(--text)]/70 dark:text-gray-300 text-center max-w-md">
                            Drag and drop components from the sidebar to start building your dashboard.
                            Resize plots using the visible handles for optimal layout.
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCollapsed(false)}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                          >
                            <GoSidebarExpand size={20} /> Open Sidebar
                          </motion.button>
                        </motion.div>
                      );
                    }

                    // Build rows based on size scores
                    const rows = [];
                    let currentRow = [];
                    let currentRowSizeScore = 0;

                    for (let i = 0; i < visibleItems.length; i++) {
                      const item = visibleItems[i];
                      const sizeScore = graphSizeScores[item.label] || graphSizeScores.default;

                      if (currentRow.length >= 2 || currentRowSizeScore + sizeScore > MAX_ROW_SIZE_SCORE) {
                        rows.push(currentRow);
                        currentRow = [item];
                        currentRowSizeScore = sizeScore;
                      } else {
                        currentRow.push(item);
                        currentRowSizeScore += sizeScore;
                      }
                    }
                    if (currentRow.length > 0) {
                      rows.push(currentRow);
                    }

                    const minHeightPerRow = 800;
                    const totalMinHeight = Math.max(minHeightPerRow * rows.length, 900);

                    return (
                      <SortableContext items={visibleItems.map((item) => item.sortableId)} strategy={() => null}>
                        <PanelGroup
                          direction="vertical"
                          className="rounded-2xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm"
                          style={{ minHeight: `${totalMinHeight}px` }}
                          onLayout={() => setResizing(false)}
                        >
                          {rows.map((rowItems, rowIndex) => (
                            <React.Fragment key={`row-${rowIndex}`}>
                              {rowIndex > 0 && (
                                <PanelResizeHandle onDragging={setResizing}>
                                  <ResizeHandle direction="vertical" />
                                </PanelResizeHandle>
                              )}
                              <Panel defaultSize={100 / rows.length} minSize={30}>
                                <PanelGroup direction="horizontal">
                                  {rowItems.map((item, idx) => {
                                    const sizeScore = graphSizeScores[item.label] || graphSizeScores.default;
                                    let defaultSize = 100 / rowItems.length;
                                    let minSize = 25;
                                    if (rowItems.length === 1) {
                                      defaultSize = 100;
                                      minSize = 100;
                                    } else if (rowItems.length === 2) {
                                      const otherItem = rowItems[idx === 0 ? 1 : 0];
                                      const otherSizeScore = graphSizeScores[otherItem.label] || graphSizeScores.default;
                                      const totalScore = sizeScore + otherSizeScore;
                                      defaultSize = (sizeScore / totalScore) * 100;
                                      defaultSize = Math.max(defaultSize, 40);
                                      minSize = 40;
                                    }
                                    return (
                                      <React.Fragment key={`item-${item.id}`}>
                                        {idx > 0 && (
                                          <PanelResizeHandle onDragging={setResizing}>
                                            <ResizeHandle direction="horizontal" />
                                          </PanelResizeHandle>
                                        )}
                                        <Panel defaultSize={defaultSize} minSize={minSize}>
                                          <Draggable id={item.sortableId}>
                                            <div className="h-full" style={{ minHeight: `${minHeightPerRow}px` }}>
                                              {renderPlot(item, rowIndex * 2 + idx, visibleItems)}
                                            </div>
                                          </Draggable>
                                        </Panel>
                                      </React.Fragment>
                                    );
                                  })}
                                </PanelGroup>
                              </Panel>
                            </React.Fragment>
                          ))}
                        </PanelGroup>
                      </SortableContext>
                    );
                  })()}
                </DroppableArea>
              </section>
            </main>
          </div>

          <AnimatePresence>
            {showUnsavedModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
                      Unsaved Changes
                    </h2>
                    <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
                      You have unsaved changes. Would you like to save before{' '}
                      {pendingNavigation ? `navigating to ${pendingNavigation.label}` : pendingTab ? `switching to ${pendingTab}` : 'leaving'}?
                    </p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSaveAndNavigate}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md"
                    >
                      Save & Continue
                    </button>
                    <button
                      onClick={handleConfirmNavigation}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md"
                    >
                      Leave Anyway
                    </button>
                  </div>
                  <button
                    onClick={handleCancelNavigation}
                    className="w-full mt-3 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-colors"
                  >
                    Cancel
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {showSavedModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)] text-center"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BiSolidSave className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">Dashboard Saved!</h2>
                <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70">
                  Your changes have been saved successfully.
                </p>
              </motion.div>
            </motion.div>
          )}

          <DragStartModal
            isOpen={showDragModal}
            onClose={() => {
              setShowDragModal(false);
              setCurrentDragItem(null);
              setError(null);
            }}
            onSearch={handleStockSearch}
            searchTerm={searchTerm}
            setSearchTerm={(value) => {
              setSearchTerm(value);
              setError(null);
              if (value.length >= 2) handleStockSearch();
              else setSearchedStocks([]);
            }}
            searchedStocks={searchedStocks}
            onSelectItem={(item) => {
              if (currentDragItem) {
                const uniqueId = `${currentDragItem.label}-${item.symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                setDroppedMap((prev) => {
                  const currentTab = prev[activeTab] || { general: [] };
                  const generalItems = currentTab.general || [];
                  const lastItemIndex = generalItems.findLastIndex(
                    (i) => i.label === currentDragItem.label && !i.symbol
                  );
                  if (lastItemIndex >= 0) {
                    const updatedItems = [...generalItems];
                    updatedItems[lastItemIndex] = {
                      ...updatedItems[lastItemIndex],
                      symbol: item.symbol,
                      companyName: item.companyName,
                      type: 'equity',
                      sortableId: uniqueId,
                      id: uniqueId,
                    };
                    return { ...prev, [activeTab]: { ...currentTab, general: updatedItems } };
                  } else {
                    const newItem = {
                      label: currentDragItem.label,
                      symbol: item.symbol,
                      companyName: item.companyName,
                      graphType: currentDragItem.label,
                      id: uniqueId,
                      type: 'equity',
                      sortableId: uniqueId,
                    };
                    return { ...prev, [activeTab]: { ...currentTab, general: [...generalItems, newItem] } };
                  }
                });
                setDragCountMap((prev) => ({
                  ...prev,
                  [activeTab]: {
                    ...prev[activeTab],
                    [currentDragItem.label]: (prev[activeTab]?.[currentDragItem.label] || 0) + 1,
                  },
                }));
                setHasUnsavedChanges(true);
              }
              setSearchTerm('');
              setSearchedStocks([]);
              setShowDragModal(false);
              setCurrentDragItem(null);
              setError(null);
            }}
            onClear={() => {
              setSearchTerm('');
              setSearchedStocks([]);
              setError(null);
            }}
            selectedCompany={null}
            error={error}
          />

          <PortfolioSelectModal
            isOpen={showPortfolioModal}
            onClose={() => {
              setShowPortfolioModal(false);
              setCurrentDragItem(null);
              setError(null);
            }}
            portfolios={savedPortfolios}
            onSelectPortfolio={handlePortfolioSelect}
            error={error}
          />

          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-[var(--background-dark)] rounded-xl p-8 max-w-md w-full shadow-2xl border border-[var(--border)] dark:border-[var(--border-dark)]"
              >
                <h2 className="text-2xl font-semibold text-[var(--text)] dark:text-[var(--text-dark)] mb-4">
                  Confirm Deletion
                </h2>
                <p className="text-[var(--text)]/70 dark:text-[var(--text-dark)]/70 mb-6">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-[var(--border)] dark:bg-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] rounded-lg hover:bg-[var(--border)]/80 dark:hover:bg-[var(--border-dark)]/80 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default DashBoard;