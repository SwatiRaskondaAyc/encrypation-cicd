
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import PortLandPage from "./PortLandPage";
import MyPortfolioPage from "./MyPortfolioPage";
import BuildOwnPort from "./BuildOwnPort";
import BrokerageCalculator from "../Finance/BrokerageCalculator";
import { IoTrash } from "react-icons/io5";
import {
  RiLineChartLine,
  RiScales2Line,
  RiArrowDownSLine,
  RiWalletLine,
  RiPieChartLine,
  RiBarChartFill,
  RiFolderLine,
} from "react-icons/ri";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calculator,
  Menu,
  X,
} from "lucide-react";
// import { portfolioService } from '../../utils/portfolioService';
import { portfolioApi } from '../../utils/portfolioApi';
import { platforms } from "../../utils/constants"; // Import platforms
import { trackAction } from '../../utils/tracking';
import { Helmet } from "react-helmet-async";

const NAVBAR_HEIGHT = 72;

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("My Portfolio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [activePortfolioId, setActivePortfolioId] = useState(null);
  const [portfolioTrades, setPortfolioTrades] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [newPortfolioName, setNewPortfolioName] = useState("");

  /* ===============================
     RESPONSIVE HANDLER
  =============================== */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===============================
     GET BROKER LOGO
  =============================== */
  // const getBrokerLogo = (brokerId) => {
  //   if (!brokerId) return null;

  //   const platform = platforms.find(p => 
  //     p.id === brokerId || 
  //     p.name.toLowerCase() === brokerId.toLowerCase()
  //   );

  //   return platform?.logo || null;
  // };

  /* ===============================
     GET BROKER LOGO
  =============================== */
  const getBrokerLogo = (brokerId) => {
    if (!brokerId) return null;

    try {
      // Normalize broker ID
      const normalizedBrokerId = brokerId.toString().toLowerCase().trim();

      const platform = platforms.find(p => {
        // Check multiple possible matches
        const platformId = p.id?.toString().toLowerCase().trim();
        const platformName = p.name?.toString().toLowerCase().trim();

        return platformId === normalizedBrokerId ||
          platformName === normalizedBrokerId ||
          platformId?.includes(normalizedBrokerId) ||
          platformName?.includes(normalizedBrokerId);
      });

      return platform?.logo || null;
    } catch (err) {
      console.warn("Error getting broker logo for:", brokerId, err);
      return null;
    }
  };

  /* ===============================
       FETCH SAVED PORTFOLIOS
    =============================== */
  const fetchSavedPortfolios = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoadingPortfolios(true);
      }

      const token = localStorage.getItem("authToken");

      if (!token) {
        setSavedPortfolios([]);
        return;
      }

      console.log("Fetching portfolios...");
      const data = await portfolioApi.getMyPortfolios();

      console.log("Portfolios API response:", data);

      // Handle different response formats
      let portfolios = [];

      if (data) {
        if (Array.isArray(data)) {
          portfolios = data;
        } else if (data.data && Array.isArray(data.data)) {
          portfolios = data.data;
        } else if (data.portfolios && Array.isArray(data.portfolios)) {
          portfolios = data.portfolios;
        } else if (typeof data === 'object') {
          // If it's a single portfolio object, wrap it in an array
          portfolios = [data];
        }
      }

      console.log(`Processed ${portfolios.length} portfolios`);


      const normalizePortfolioData = (portfolio) => {
        if (!portfolio) return null;

        const portfolioId = portfolio.pid || portfolio.portfolioId || portfolio.id;
        const portfolioName = portfolio.portfolioName || portfolio.name || portfolio.portfolio_name || "Unnamed Portfolio";
        const brokerId = portfolio.brokerId || portfolio.broker || portfolio.broker_id || portfolio.brokerName;

        return {
          ...portfolio,
          id: portfolioId,
          portfolioId,
          name: portfolioName,
          portfolioName,
          brokerId,
          broker: brokerId,
          brokerLogo: getBrokerLogo(brokerId),
        };
      };
      const portfoliosWithBrokerInfo = portfolios
        .map(portfolio => normalizePortfolioData(portfolio))
        .filter(portfolio => portfolio !== null); // Remove any null entries

      console.log(`Setting ${portfoliosWithBrokerInfo.length} portfolios with broker info`);

      setSavedPortfolios(portfoliosWithBrokerInfo);

    } catch (err) {
      console.error("Portfolio fetch error:", err.message);

      // Don't show error for auth failures or empty responses
      if (!err.message.includes("401") &&
        !err.message.includes("403") &&
        !err.message.includes("session") &&
        !err.message.includes("404")) {
        console.error("Failed to fetch portfolios:", err);
      }

      setSavedPortfolios([]);
    } finally {
      if (showLoading) {
        setLoadingPortfolios(false);
      }
    }
  };

  /* ===============================
     INITIAL FETCH & AUTO REFRESH
  =============================== */
  useEffect(() => {
    // Initial fetch WITHOUT loader
    fetchSavedPortfolios(false);

    // Load active portfolio from sessionStorage on initial load
    const savedActiveId = sessionStorage.getItem("ACTIVE_PORTFOLIO_ID");
    if (savedActiveId) {
      setActivePortfolioId(savedActiveId);
    }

    // Setup event listener for real-time updates
    const handlePortfolioUpdate = () => {
      console.log("Portfolio update detected, refreshing list...");
      fetchSavedPortfolios(false); // No loader on updates
    };

    // Listen for custom events
    window.addEventListener("portfolioCreated", handlePortfolioUpdate);
    window.addEventListener("portfolioUpdated", handlePortfolioUpdate);
    window.addEventListener("portfolioDeleted", handlePortfolioUpdate);

    // Add auth state listener
    const handleAuthChange = () => {
      fetchSavedPortfolios(false);
    };
    window.addEventListener("authStateChanged", handleAuthChange);

    return () => {
      window.removeEventListener("portfolioCreated", handlePortfolioUpdate);
      window.removeEventListener("portfolioUpdated", handlePortfolioUpdate);
      window.removeEventListener("portfolioDeleted", handlePortfolioUpdate);
      window.removeEventListener("authStateChanged", handleAuthChange);
    };
  }, []);

  /* ===============================
     PORTFOLIO OPERATIONS
  =============================== */
  const confirmDeletePortfolio = async () => {
    trackAction('portfolio_delete', 'Portfolio', { name: selectedPortfolio?.name });
    if (!selectedPortfolio) return;

    const portfolioId =
      selectedPortfolio.pid ||
      selectedPortfolio.portfolioId ||
      selectedPortfolio.id;

    try {
      await portfolioApi.deletePortfolio(portfolioId);

      // Update local state
      setSavedPortfolios((prev) =>
        prev.filter(
          (p) =>
            (p.pid || p.portfolioId || p.id) !== portfolioId
        )
      );

      if (activePortfolioId === portfolioId) {
        setActivePortfolioId(null);
        sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
      }

      // Dispatch event for other components
      window.dispatchEvent(new Event("portfolioDeleted"));

    } catch (err) {
      alert("Failed to delete portfolio");
    } finally {
      setShowDeleteModal(false);
      setSelectedPortfolio(null);
    }
  };

  // const confirmRenamePortfolio = async () => {
  //   if (!selectedPortfolio || !newPortfolioName.trim()) return;

  //   const portfolioId =
  //     selectedPortfolio.pid ||
  //     selectedPortfolio.portfolioId ||
  //     selectedPortfolio.id;

  //   try {
  //     await portfolioApi.updatePortfolioName(
  //       portfolioId,
  //       newPortfolioName.trim()
  //     );

  //     // Update local state
  //     setSavedPortfolios((prev) =>
  //       prev.map((p) =>
  //         (p.pid || p.portfolioId || p.id) === portfolioId
  //           ? {
  //               ...p,
  //               portfolioName: newPortfolioName.trim(),
  //               name: newPortfolioName.trim(),
  //             }
  //           : p
  //       )
  //     );

  //     // Dispatch event for other components
  //     window.dispatchEvent(new Event("portfolioUpdated"));

  //   } catch (err) {
  //     alert("Failed to rename portfolio");
  //   } finally {
  //     setShowRenameModal(false);
  //     setSelectedPortfolio(null);
  //     setNewPortfolioName("");
  //   }
  // };

  const confirmRenamePortfolio = async () => {
    trackAction('portfolio_rename', 'Portfolio', { from: selectedPortfolio?.name, to: newPortfolioName });
    if (!selectedPortfolio || !newPortfolioName.trim()) return;

    const portfolioId =
      selectedPortfolio.pid ||
      selectedPortfolio.portfolioId ||
      selectedPortfolio.id;

    try {
      // Use the correct API endpoint with proper parameters
      await portfolioApi.updatePortfolioName(
        portfolioId,
        newPortfolioName.trim()
      );

      // Update local state
      setSavedPortfolios((prev) =>
        prev.map((p) =>
          (p.pid || p.portfolioId || p.id) === portfolioId
            ? {
              ...p,
              portfolioName: newPortfolioName.trim(),
              name: newPortfolioName.trim(),
            }
            : p
        )
      );

      // Dispatch event for other components
      window.dispatchEvent(new Event("portfolioUpdated"));

      console.log("Portfolio renamed successfully");
    } catch (err) {
      console.error("Rename failed:", err);
      alert("Failed to rename portfolio");
    } finally {
      setShowRenameModal(false);
      setSelectedPortfolio(null);
      setNewPortfolioName("");
    }
  };
  const handleDeletePortfolio = async (portfolioId, e) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this portfolio?")) {
      return;
    }

    try {
      await portfolioApi.deletePortfolio(portfolioId);

      // Immediately remove from local state
      setSavedPortfolios(prev => prev.filter(p =>
        (p.pid || p.portfolioId || p.id) !== portfolioId
      ));

      // If this was the active portfolio, clear it
      if (activePortfolioId === portfolioId) {
        setActivePortfolioId(null);
        sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
      }

      // Dispatch event for other components
      window.dispatchEvent(new Event("portfolioDeleted"));

      console.log(`Portfolio ${portfolioId} deleted successfully`);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete portfolio: " + err.message);
    }
  };

  const handleRenamePortfolio = async (portfolio, e) => {
    e.stopPropagation();

    const portfolioId = portfolio.pid || portfolio.portfolioId || portfolio.id;
    const currentName = portfolio.portfolioName || portfolio.name || "";

    const newName = prompt("Enter new portfolio name:", currentName);

    if (!newName || newName.trim() === currentName) return;

    try {
      await portfolioApi.updatePortfolioName(
        portfolioId,
        newName.trim()
      );

      // Update UI immediately
      setSavedPortfolios((prev) =>
        prev.map((p) =>
          (p.pid || p.portfolioId || p.id) === portfolioId
            ? { ...p, portfolioName: newName.trim(), name: newName.trim() }
            : p
        )
      );

      // Dispatch event for other components
      window.dispatchEvent(new Event("portfolioUpdated"));

      console.log("Portfolio renamed successfully");
    } catch (err) {
      console.error("Rename failed:", err);
      alert("Failed to rename portfolio");
    }
  };

  /* ===============================
     NAVIGATION HANDLERS
  =============================== */
  const toggleSidebar = () => {
    trackAction('portfolio_sidebar_toggle', 'Portfolio', { isOpen: isMobile ? !isMobileMenuOpen : !isSidebarOpen });
    isMobile
      ? setIsMobileMenuOpen((p) => !p)
      : setIsSidebarOpen((p) => !p);
  };

  const handleNavClick = (item) => {
    trackAction('portfolio_nav_click', 'Portfolio', { item: item.name });
    if (item.subItems) {
      setExpandedMenus((p) => ({ ...p, [item.name]: !p[item.name] }));
    } else {
      setActiveTab(item.name);
      // Clear active portfolio when clicking "My Portfolio" tab
      if (item.name === "My Portfolio") {
        setActivePortfolioId(null);
        sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
      }
    }
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const handleSubNavClick = (id) => {
    trackAction('portfolio_subnav_click', 'Portfolio', { item: id });
    setActiveTab(id);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  /* ===============================
       SAVED PORTFOLIO CLICK
    =============================== */
  const handleSavedPortfolioClick = async (portfolio) => {
    trackAction('portfolio_saved_load', 'Portfolio', { name: portfolio.name || portfolio.portfolioName });
    const portfolioId = portfolio.pid || portfolio.portfolioId || portfolio.id;
    const portfolioName = portfolio.portfolioName || portfolio.name || "Portfolio";
    const brokerId = portfolio.brokerId || portfolio.broker;

    if (!portfolioId) {
      console.error("No portfolio ID found");
      return;
    }

    try {
      console.log(`Loading portfolio: ${portfolioId} (${portfolioName}) with broker: ${brokerId}`);

      // Store the portfolio ID and broker info immediately
      setActivePortfolioId(portfolioId);
      sessionStorage.setItem("ACTIVE_PORTFOLIO_ID", portfolioId);

      // Also store broker info for consistency
      if (brokerId) {
        sessionStorage.setItem("ACTIVE_PORTFOLIO_BROKER", brokerId);
      }

      // Navigate to My Portfolio tab
      setActiveTab("My Portfolio");

      if (isMobile) setIsMobileMenuOpen(false);

      // Dispatch event to notify PortLandPage about the loaded portfolio
      window.dispatchEvent(new CustomEvent("portfolioLoaded", {
        detail: {
          portfolioId,
          portfolioName,
          brokerId
        }
      }));

    } catch (error) {
      console.error("Error in handleSavedPortfolioClick:", error);

      // Show user-friendly error
      alert(`Failed to load portfolio "${portfolioName}". Please try again.`);

      // Reset states
      setActivePortfolioId(null);
      sessionStorage.removeItem("ACTIVE_PORTFOLIO_ID");
      sessionStorage.removeItem("ACTIVE_PORTFOLIO_BROKER");
    }
  };
  /* ===============================
     NAV ITEMS
  =============================== */
  const navItems = [
    {
      name: "My Portfolio",
      icon: <RiBarChartFill className="w-5 h-5" />,
    },
    {
      name: "Paper Trading",
      icon: <RiLineChartLine className="w-5 h-5" />,
    },
    {
      name: "Financial Tools",
      icon: <RiScales2Line className="w-5 h-5" />,
      subItems: [
        {
          name: "Brokerage Calculator",
          id: "Brokerage Calculator",
          icon: <Calculator className="w-4 h-4" />,
        },
        {
          name: "EMI Calculator",
          id: "EMI Calculator",
          icon: <RiWalletLine className="w-4 h-4" />,
          comingSoon: true,
        },
        {
          name: "Risk Analyzer",
          id: "Risk Analyzer",
          icon: <RiPieChartLine className="w-4 h-4" />,
          comingSoon: true,
        },
      ],
    },
  ];


  /* ===============================
     MAIN CONTENT
  =============================== */
  const renderContent = () => {
    switch (activeTab) {
      case "My Portfolio":
        // Get the active portfolio from savedPortfolios to pass broker info
        const activePortfolio = savedPortfolios.find(p =>
          (p.pid || p.portfolioId || p.id) === activePortfolioId
        );

        return (
          <PortLandPage
            key={activePortfolioId || "new-portfolio"}
            activePortfolioId={activePortfolioId}
            activePortfolioBroker={activePortfolio?.brokerId || activePortfolio?.broker}
            preloadedTrades={portfolioTrades?.portfolioId === activePortfolioId ? portfolioTrades.data : null}
            onPortfolioLoaded={() => fetchSavedPortfolios()}
          />
        );
      case "Paper Trading":
        return <BuildOwnPort />;
      case "Brokerage Calculator":
        return <BrokerageCalculator withLayout={false} />;
      default:
        return <MyPortfolioPage />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <Helmet>
        <title>Portfolio Analytics – Track & Analyze Your Market Portfolio | CMDA</title>

        <meta
          name="description"
          content="Analyze your portfolio with CMDA’s portfolio analytics tools. Track performance, equity positions, risk metrics, sector exposure, and real-time market movements."
        />

        <meta
          name="keywords"
          content="portfolio analytics, stock portfolio tracker, CMDA portfolio, equity positions, portfolio performance, investment portfolio analysis, risk metrics, market portfolio tracker, portfolio insights, real-time portfolio analysis, sector allocation, financial dashboard"
        />

        <meta property="og:title" content="Portfolio Analytics – CMDA Hub" />

        <meta
          property="og:description"
          content="Monitor your portfolio performance with CMDA Hub. Track equity positions, risk metrics, sector exposure, and real-time market analytics."
        />

        <meta property="og:url" content="https://cmdahub.com/portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CMDA Hub" />

        <link rel="canonical" href="https://cmdahub.com/portfolio" />
      </Helmet>

      <div className="flex" style={{ paddingTop: NAVBAR_HEIGHT }}>
        {/* MOBILE TOGGLE */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="fixed top-24 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 text-gray-900 dark:text-white"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        )}

        {/* SIDEBAR */}
        <aside
          className={`fixed z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all overflow-y-auto
          ${isMobile
              ? isMobileMenuOpen
                ? "translate-x-0 w-80"
                : "-translate-x-full"
              : isSidebarOpen
                ? "w-64"
                : "w-20"
            }`}
          style={{ top: NAVBAR_HEIGHT }}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-600 dark:text-blue-400" />
              {(isSidebarOpen || isMobileMenuOpen) && (
                <span className="font-semibold text-gray-900 dark:text-white">Portfolio Analyzer</span>
              )}
            </div>
            {!isMobile && (
              <button onClick={toggleSidebar}>
                {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
              </button>
            )}
          </div>

          {/* NAV */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${activeTab === item.name
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                    }`}
                >
                  {item.icon}
                  {(isSidebarOpen || isMobileMenuOpen) && (
                    <span>{item.name}</span>
                  )}
                  {item.subItems && <RiArrowDownSLine className="ml-auto" />}
                </button>

                {item.subItems && expandedMenus[item.name] && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        disabled={sub.comingSoon}
                        onClick={() =>
                          !sub.comingSoon && handleSubNavClick(sub.id)
                        }
                        className={`w-full text-left text-sm px-2 py-1 opacity-80 hover:opacity-100 rounded transition-colors ${activeTab === sub.id
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {sub.name} {sub.comingSoon && "(Soon)"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* SAVED PORTFOLIOS */}
          {(isSidebarOpen || isMobileMenuOpen) && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">


              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Saved Portfolios</p>
                <button
                  onClick={() => fetchSavedPortfolios(true)}
                  disabled={loadingPortfolios}
                  className={`text-xs px-2 py-1 rounded transition-colors ${loadingPortfolios
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    }`}
                  title="Refresh portfolio list"
                >
                  {loadingPortfolios ? (
                    <span className="flex items-center gap-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      Refreshing...
                    </span>
                  ) : (
                    'Refresh'
                  )}
                </button>
              </div>



              {!loadingPortfolios && savedPortfolios.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center">
                  No saved portfolios
                </p>
              )}

              <div className="space-y-1 max-h-60 overflow-y-auto">
                {savedPortfolios.map((portfolio) => {
                  const portfolioId = portfolio.pid || portfolio.portfolioId || portfolio.id;
                  const portfolioName = portfolio.portfolioName || portfolio.name || "Unnamed Portfolio";
                  const isActive = activePortfolioId === portfolioId;
                  const brokerLogo = portfolio.brokerLogo;

                  return (
                    <div
                      key={portfolioId}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors ${isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                          : ""
                        }`}
                    >
                      <button
                        onClick={() => handleSavedPortfolioClick(portfolio)}
                        className="flex-1 flex items-center gap-2 text-sm text-left min-w-0 text-gray-700 dark:text-gray-300"
                      >
                        {/* Broker Logo or Default Folder Icon */}
                        {brokerLogo ? (
                          <img
                            src={brokerLogo}
                            alt={portfolio.brokerId || "Broker"}
                            className="w-6 h-6 object-contain flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.insertBefore(
                                <RiFolderLine className="flex-shrink-0" />,
                                e.target
                              );
                            }}
                          />
                        ) : (
                          <RiFolderLine className="flex-shrink-0" />
                        )}

                        <span className="truncate">{portfolioName}</span>


                      </button>

                      {/* Rename Button */}
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPortfolio(portfolio);
                          setNewPortfolioName(portfolioName);
                          setShowRenameModal(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-100 rounded text-blue-600"
                        title="Rename portfolio"
                      >
                        ✏️
                      </button> */}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPortfolio(portfolio);
                          setNewPortfolioName(portfolioName);
                          setShowRenameModal(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors"
                        title="Rename portfolio"
                      >
                        ✏️
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPortfolio(portfolio);
                          setShowDeleteModal(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
                        title="Delete portfolio"
                      >
                        <IoTrash className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* CONTENT */}
        <main
          className={`flex-1 transition-all bg-gray-50 dark:bg-gray-900 ${!isMobile && (isSidebarOpen ? "ml-64" : "ml-20")
            }`}
        >
          <div className="p-6 max-w-9xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Delete Portfolio
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this portfolio? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePortfolio}
                className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Rename Portfolio
            </h2>

            <input
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter portfolio name"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRenamePortfolio}
                className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;