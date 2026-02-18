
// import React, { useEffect, useState } from 'react';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { FiHome, FiBarChart2, FiFileText, FiMail, FiPrinter, FiSettings, FiLogOut } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// // import QRCodescan from '../../../public/dashScan.png'


// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
// const [collapsed, setCollapsed] = useState(false);
// const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

// const navItems = [
//     { label: "Dashboard", icon: <FiHome /> },

//   ];
//   useEffect(() => {
//     const fetchDashboards = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           setError("Please log in to view your dashboard.");
//           setLoading(false);
//           return;
//         }

//         const response = await fetch(`${API_BASE}/api/dashboard/fetch`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errText = await response.text();
//           throw new Error(errText || "Failed to fetch dashboards");
//         }

//         const data = await response.json();
//         setDashboards(data.dashboards || []);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("Error loading dashboards.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboards();
//   }, []);

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graph_type];
//     if (!Component) {
//       return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
//     }

//     return isPortfolio
//       ? <Component uploadId={plot.upload_id} />
//       : <Component symbol={plot.symbol} />;
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards(prev =>
//       prev.map(dash => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter(p => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter(p => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/api/dashboard/delete/${dashId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete dashboard');
//       }

//       setDashboards(prev => prev.filter(dash => dash.dashId !== dashId));
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   return (


// <div className="flex h-screen overflow-hidden font-sans">
//   {/* Sidebar */}
//   <aside
//         className={`${
//           collapsed ? "w-20" : "w-64"
//         } bg-gray-900 text-white flex flex-col justify-between shadow-xl transition-all duration-300`}
//       >
//         <div>
//           {/* Header with Menu Icon */}
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//                 #CMD<span className="text-yellow-400">A</span>
//                 <span className="text-yellow-500">Dashboard</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-white text-2xl focus:outline-none"
//             >
//               <IoMenu />
//             </button>

//           </div>

//           {/* Nav Items */}
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon }) => (
//               <div
//                 key={label}
//                 className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition cursor-pointer text-sm font-medium"
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </div>
//             ))}
//           </nav>
//         </div>

//         {/* Sign Out */}
//         <div className="p-4 border-t border-gray-700">
//           <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//   {/* Main Content */}
//   <main className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-gray-800 overflow-y-auto p-8">
//     <div className="mb-8 flex justify-between items-center">
//       <h2 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//         📊 Saved Dashboards
//       </h2>
//        <div>

//         {/* <figure className="w-full ">
//           <img
//             src={QRCodescan}

//             className="w-full object-cover h-64 md:h-96"
//           />
//         </figure> */}
//             </div>
//     </div>

//     {loading ? (
//       <p className="text-gray-600 dark:text-gray-300">Loading...</p>
//     ) : error ? (
//       <p className="text-red-500">{error}</p>
//     ) : (
//       dashboards.map((dash, dashIdx) => (
//         <div key={dashIdx} className="mb-12 p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 relative border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
//           <button
//             onClick={() => {
//               if (window.confirm("Are you sure you want to delete this dashboard?")) {
//                 handleDeleteDashboard(dash.dashId);
//               }
//             }}
//             className="absolute top-4 right-4 px-4 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 shadow"
//           >
//             Delete Dashboard
//           </button>

//           <h3 className="text-2xl font-bold text-cyan-600 mb-6">{dash.dashboardName}</h3>

//           {/* Portfolio Plots */}
//           {dash.plots?.portfolioPlots?.length > 0 && (
//             <>
//               <h4 className="text-lg text-purple-600 font-semibold mb-4">Portfolio Plots</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {dash.plots.portfolioPlots.map((plot, idx) => (
//                   <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                     <button
//                       onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                       className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
//                     >
//                       🗑
//                     </button>
//                     <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                     <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}

//           {/* Equity Hub Plots */}
//           {dash.plots?.equityHubPlots?.length > 0 && (
//             <>
//               <h4 className="text-lg text-cyan-500 font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {dash.plots.equityHubPlots.map((plot, idx) => (
//                   <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                     <button
//                       onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                       className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
//                     >
//                       🗑
//                     </button>
//                     <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                     <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       ))
//     )}
//   </main>
// </div>

//   );
// };

// export default SavedDashboard;



// import React, { useEffect, useState } from 'react';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { FiHome, FiLogOut, FiShare2 } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [formData, setFormData] = useState({
//     dashboardName: '',
//     equityHubPlots: [{ symbol: '', companyName: '', graphType: '' }],
//     portfolioPlots: [{ uploadId: '', graphType: '', platform: '' }],
//   });
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const navItems = [{ label: "Dashboard", icon: <FiHome /> }];

//   useEffect(() => {
//     fetchDashboards();
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/api/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errText = await response.text();
//         throw new Error(errText || "Failed to fetch dashboards");
//       }

//       const data = await response.json();
//       console.log("Fetched dashboards:", data.dashboards); // Debug
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Error loading dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e, index, type) => {
//     const { name, value } = e.target;
//     if (type === 'equity') {
//       const updatedPlots = [...formData.equityHubPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, equityHubPlots: updatedPlots });
//     } else if (type === 'portfolio') {
//       const updatedPlots = [...formData.portfolioPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, portfolioPlots: updatedPlots });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSaveDashboard = async (e) => {
//     e.preventDefault();
//     const dashboardData = {
//       dashboard: { dashboardName: formData.dashboardName },
//       equityHubPlots: formData.equityHubPlots,
//       portfolioPlots: formData.portfolioPlots,
//     };
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/api/dashboard/save`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dashboardData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save dashboard');
//       }

//       const data = await response.json();
//       console.log("Saved dashboard:", data); // Debug

//       // Re-fetch dashboards to update state
//       await fetchDashboards();
//     } catch (err) {
//       console.error("Save error:", err);
//       setError("Error saving dashboard.");
//     }
//   };

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graph_type];
//     if (!Component) {
//       return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
//     }
//     return isPortfolio ? <Component uploadId={plot.upload_id} /> : <Component symbol={plot.symbol} />;
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards(prev =>
//       prev.map(dash => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter(p => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter(p => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/api/dashboard/delete/${dashId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete dashboard');
//       }

//       setDashboards(prev => prev.filter(dash => dash.dashId !== dashId));
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden font-sans">
//       <aside
//         className={`${collapsed ? "w-20" : "w-64"} bg-gray-900 text-white flex flex-col justify-between shadow-xl transition-all duration-300`}
//       >
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//                 #CMD<span className="text-yellow-400">A</span>
//                 <span className="text-yellow-500">Dashboard</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-white text-2xl focus:outline-none"
//             >
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon }) => (
//               <div
//                 key={label}
//                 className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition cursor-pointer text-sm font-medium"
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </div>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-gray-700">
//           <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-gray-800 overflow-y-auto p-8">
//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//             📊 Saved Dashboards
//           </h2>
//         </div>

//         <form onSubmit={handleSaveDashboard} className="mb-8">
//           <input
//             type="text"
//             name="dashboardName"
//             value={formData.dashboardName}
//             onChange={(e) => handleInputChange(e, null, 'dashboard')}
//             placeholder="Dashboard Name"
//             className="p-2 border rounded"
//           />
//           <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
//             Save Dashboard
//           </button>
//         </form>

//         {loading ? (
//           <p className="text-gray-600 dark:text-gray-300">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           dashboards.map((dash, dashIdx) => {
//             console.log(`Rendering dashboard ${dash.dashboardName}:`, { qrCode: dash.qrCode }); // Debug
//             return (
//               <div key={dashIdx} className="mb-12 p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 relative border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-2xl font-bold text-cyan-600">{dash.dashboardName}</h3>
//                   <div className="flex gap-2">
//                     {dash.qrCode && (
//                       <div className="relative group">
//                         <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 shadow">
//                           <FiShare2 className="inline mr-2" /> Share
//                         </button>
//                         <div className="absolute bg-white p-2 rounded shadow-lg">
//                           <img 
//                             src={`data:image/png;base64,${dash.qrCode}`} 
//                             alt="Dashboard QR Code" 
//                             className="w-32 h-32"
//                           />
//                         </div>
//                       </div>
//                     )}
//                     <button
//                       onClick={() => {
//                         if (window.confirm("Are you sure you want to delete this dashboard?")) {
//                           handleDeleteDashboard(dash.dashId);
//                         }
//                       }}
//                       className="px-4 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 shadow"
//                     >
//                       Delete Dashboard
//                     </button>
//                   </div>
//                 </div>
//                 {dash.plots?.portfolioPlots?.length > 0 && (
//                   <>
//                     <h4 className="text-lg text-purple-600 font-semibold mb-4">Portfolio Plots</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {dash.plots.portfolioPlots.map((plot, idx) => (
//                         <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                           <button
//                             onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                             className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
//                           >
//                             🗑
//                           </button>
//                           <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                           <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//                 {dash.plots?.equityHubPlots?.length > 0 && (
//                   <>
//                     <h4 className="text-lg text-cyan-500 font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {dash.plots.equityHubPlots.map((plot, idx) => (
//                         <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                           <button
//                             onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                             className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
//                           >
//                             🗑
//                           </button>
//                           <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                           <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;



// import React, { useEffect, useState } from 'react';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { FiHome, FiLogOut, FiShare2 } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// import { GraphDataProvider } from '../Portfolio/GraphDataContext'; // Import GraphDataProvider
// import { MdOutlineDashboard } from "react-icons/md";

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//    const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle state
//   const [formData, setFormData] = useState({
//     dashboardName: '',
//     equityHubPlots: [{ symbol: '', companyName: '', graphType: '' }],
//     portfolioPlots: [{ uploadId: '', graphType: '', platform: '' }],
//   });
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//  const navItems = [
//      { label: "Home", icon: <FiHome className="text-xl" />, path: "/" },
//     { label: "Dashboard", icon: <MdOutlineDashboard className="text-xl" />, path: "/dashboard" },

//     // { label: "Back", icon: <IoMdArrowBack className="text-xl" />, path: "/dashboard" }
//   ];

//   useEffect(() => {
//     fetchDashboards();
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errText = await response.text();
//         throw new Error(errText || "Failed to fetch dashboards");
//       }

//       const data = await response.json();
//       console.log("Fetched dashboards:", data.dashboards); // Debug
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Error loading dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e, index, type) => {
//     const { name, value } = e.target;
//     if (type === 'equity') {
//       const updatedPlots = [...formData.equityHubPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, equityHubPlots: updatedPlots });
//     } else if (type === 'portfolio') {
//       const updatedPlots = [...formData.portfolioPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, portfolioPlots: updatedPlots });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//    const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('userEmail');
//     alert("Logout successfully");
//     navigate('/');
//   };

//   const handleSaveDashboard = async (e) => {
//     e.preventDefault();
//     const dashboardData = {
//       dashboard: { dashboardName: formData.dashboardName },
//       equityHubPlots: formData.equityHubPlots,
//       portfolioPlots: formData.portfolioPlots,
//     };
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/save`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dashboardData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save dashboard');
//       }

//       const data = await response.json();
//       console.log("Saved dashboard:", data); // Debug

//       // Re-fetch dashboards to update state
//       await fetchDashboards();
//     } catch (err) {
//       console.error("Save error:", err);
//       setError("Error saving dashboard.");
//     }
//   };

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graph_type];
//     if (!Component) {
//       return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
//     }
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Component uploadId={plot.upload_id} />
//       </GraphDataProvider>
//     ) : (
//       <Component symbol={plot.symbol} />
//     );
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards(prev =>
//       prev.map(dash => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter(p => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter(p => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete dashboard');
//       }

//       setDashboards(prev => prev.filter(dash => dash.dashId !== dashId));
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden font-sans">
//       <aside
//         className={`${collapsed ? "w-20" : "w-64"} bg-gray-900 text-white flex flex-col justify-between shadow-xl transition-all duration-300`}
//       >
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//                 #CMD<span className="text-yellow-400">A</span>
//                 <span className="text-yellow-500">Dashboard</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-white text-2xl focus:outline-none"
//             >
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon }) => (
//               <div
//                 key={label}
//                 className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition cursor-pointer text-sm font-medium"
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </div>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-gray-700">
//           <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//  {/*
//        <aside className={`bg-sky-900 text-white flex flex-col fixed top-0 left-0 h-full z-50 shadow-xl transition-all duration-300
//         ${sidebarOpen ? 'w-64' : 'w-20'}`}>
//         <div className="flex flex-col h-full justify-between">
//           {/* Header 
//           <div className="p-4 flex items-center justify-between">
//           <div className="text-xl font-bold whitespace-nowrap flex items-center space-x-1">
//   {sidebarOpen ? (
//     <>
//       <span className="text-white">#CMDA</span>
//       <span className="text-sky-400">Dash</span>
//     </>
//   ) : (
//     <span className="text-white"><img src='public/assets/cmda (3).png' /></span>
//   )}
// </div>

//             <button
//               className="text-white text-2xl sm:block"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               <FaBars />
//             </button>
//           </div>

//           {/* Navigation *
//           <nav className="mt-4 space-y-2 px-2 flex-1 overflow-y-auto">
//             {navItems.map(({ label, icon, path }) => {
//               const isActive = location.pathname === path;
//               return (
//                 <Link
//                   to={path}
//                   key={label}
//                   className={`flex items-center gap-3 px-4 py-3 rounded transition cursor-pointer text-sm font-medium
//                     ${isActive ? 'bg-gray-800 text-white' : 'text-white hover:bg-gray-700'}`}
//                 >
//                   {icon}
//                   {sidebarOpen && <span>{label}</span>}
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Logout 
//           <div className="p-4 border-t border-gray-700">
//             <button
//               onClick={handleLogout}
//               className="w-full bg-sky-900 border border-white hover:bg-cyan-700 text-white py-2 rounded-full flex justify-center items-center gap-2 transition"
//             >
//               <FiLogOut className="text-xl" />
//               {sidebarOpen && <span>Log out</span>}
//             </button>
//           </div>
//         </div>
//       </aside>*/}

//       <main className='transition-all duration-300 flex-1 p-4 sm:p-6 md:p-8 ml-20' >
//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//             📊 Saved Dashboards
//           </h2>
//         </div>

//         <form onSubmit={handleSaveDashboard} className="mb-8">
//           <input
//             type="text"
//             name="dashboardName"
//             value={formData.dashboardName}
//             onChange={(e) => handleInputChange(e, null, 'dashboard')}
//             placeholder="Dashboard Name"
//             className="p-2 border rounded"
//           />
//           <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
//             Save Dashboard
//           </button>
//         </form>

//         {loading ? (
//           <p className="text-gray-600 dark:text-gray-300">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           dashboards.map((dash, dashIdx) => {
//             //console.log(`Rendering dashboard ${dash.dashboardName}:`, { qrCode: dash.qrCode }); // Debug
//             return (
//               <div key={dashIdx} className="mb-12 p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 relative border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-2xl font-bold text-cyan-600">{dash.dashboardName}</h3>
//                   <div className="flex gap-2">
//                     {/*
//                     {dash.qrCode && (
//                       <div className="relative group">
//                         <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 shadow">
//                           <FiShare2 className="inline mr-2" /> Share
//                         </button>
//                         <div className="absolute bg-white p-2 rounded shadow-lg">
//                           <img 
//                             src={`data:image/png;base64,${dash.qrCode}`} 
//                             alt="Dashboard QR Code" 
//                             className="w-32 h-32"
//                           />
//                         </div>
//                       </div>
//                     )}*/}
//                     <button
//                       onClick={() => {
//                         if (window.confirm("Are you sure you want to delete this dashboard?")) {
//                           handleDeleteDashboard(dash.dashId);
//                         }
//                       }}
//                       className="px-4 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 shadow"
//                     >
//                       Delete Dashboard
//                     </button>
//                   </div>
//                 </div>
//                 {dash.plots?.portfolioPlots?.length > 0 && (
//                   <>
//                     <h4 className="text-lg text-purple-600 font-semibold mb-4">Portfolio Plots</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {dash.plots.portfolioPlots.map((plot, idx) => (
//                         <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                           <button
//                             onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                             className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
//                           >
//                             🗑
//                           </button>
//                           <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                           <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//                 {dash.plots?.equityHubPlots?.length > 0 && (
//                   <>
//                     <h4 className="text-lg text-cyan-500 font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {dash.plots.equityHubPlots.map((plot, idx) => (
//                         <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                           <button
//                             onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                             className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg">
//                             🗑
//                           </button>
//                           <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                           <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;


// import React, { useEffect, useState } from 'react';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { FiHome, FiLogOut, FiShare2 } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [formData, setFormData] = useState({
//     dashboardName: '',
//     equityHubPlots: [{ symbol: '', companyName: '', graphType: '' }],
//     portfolioPlots: [{ uploadId: '', graphType: '', platform: '' }],
//   });
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const navItems = [{ label: "Dashboard", icon: <FiHome /> }];

//   useEffect(() => {
//     fetchDashboards();
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/api/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errText = await response.text();
//         throw new Error(errText || "Failed to fetch dashboards");
//       }

//       const data = await response.json();
//       console.log("Fetched dashboards:", data.dashboards); // Debug
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Error loading dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e, index, type) => {
//     const { name, value } = e.target;
//     if (type === 'equity') {
//       const updatedPlots = [...formData.equityHubPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, equityHubPlots: updatedPlots });
//     } else if (type === 'portfolio') {
//       const updatedPlots = [...formData.portfolioPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, portfolioPlots: updatedPlots });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSaveDashboard = async (e) => {
//     e.preventDefault();
//     const dashboardData = {
//       dashboard: { dashboardName: formData.dashboardName },
//       equityHubPlots: formData.equityHubPlots,
//       portfolioPlots: formData.portfolioPlots,
//     };
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/api/dashboard/save`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dashboardData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save dashboard');
//       }

//       const data = await response.json();
//       console.log("Saved dashboard:", data); // Debug

//       // Re-fetch dashboards to update state
//       await fetchDashboards();
//     } catch (err) {
//       console.error("Save error:", err);
//       setError("Error saving dashboard.");
//     }
//   };

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graph_type];
//     if (!Component) {
//       return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
//     }
//     return isPortfolio ? <Component uploadId={plot.upload_id} /> : <Component symbol={plot.symbol} />;
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards(prev =>
//       prev.map(dash => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter(p => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter(p => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/api/dashboard/delete/${dashId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete dashboard');
//       }

//       setDashboards(prev => prev.filter(dash => dash.dashId !== dashId));
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden font-sans">
//       <aside
//         className={`${collapsed ? "w-20" : "w-64"} bg-gray-900 text-white flex flex-col justify-between shadow-xl transition-all duration-300`}
//       >
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//                 #CMD<span className="text-yellow-400">A</span>
//                 <span className="text-yellow-500">Dashboard</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-white text-2xl focus:outline-none"
//             >
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon }) => (
//               <div
//                 key={label}
//                 className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition cursor-pointer text-sm font-medium"
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </div>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-gray-700">
//           <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-gray-800 overflow-y-auto p-8">
//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//             📊 Saved Dashboards
//           </h2>
//         </div>

//         <form onSubmit={handleSaveDashboard} className="mb-8">
//           <input
//             type="text"
//             name="dashboardName"
//             value={formData.dashboardName}
//             onChange={(e) => handleInputChange(e, null, 'dashboard')}
//             placeholder="Dashboard Name"
//             className="p-2 border rounded"
//           />
//           <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
//             Save Dashboard
//           </button>
//         </form>

//         {loading ? (
//           <p className="text-gray-600 dark:text-gray-300">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           dashboards.map((dash, dashIdx) => {
//             console.log(`Rendering dashboard ${dash.dashboardName}:`, { qrCode: dash.qrCode }); // Debug
//             return (
//               <div key={dashIdx} className="mb-12 p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 relative border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-2xl font-bold text-cyan-600">{dash.dashboardName}</h3>
//                   <div className="flex gap-2">
//                     {dash.qrCode && (
//                       <div className="relative group">
//                         <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 shadow">
//                           <FiShare2 className="inline mr-2" /> Share
//                         </button>
//                         <div className="absolute bg-white p-2 rounded shadow-lg">
//                           <img 
//                             src={`data:image/png;base64,${dash.qrCode}`} 
//                             alt="Dashboard QR Code" 
//                             className="w-32 h-32"
//                           />
//                         </div>
//                       </div>
//                     )}
//                     <button
//                       onClick={() => {
//                         if (window.confirm("Are you sure you want to delete this dashboard?")) {
//                           handleDeleteDashboard(dash.dashId);
//                         }
//                       }}
//                       className="px-4 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 shadow"
//                     >
//                       Delete Dashboard
//                     </button>
//                   </div>
//                 </div>
//                 {dash.plots?.portfolioPlots?.length > 0 && (
//                   <>
//                     <h4 className="text-lg text-purple-600 font-semibold mb-4">Portfolio Plots</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {dash.plots.portfolioPlots.map((plot, idx) => (
//                         <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                           <button
//                             onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                             className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
//                           >
//                             🗑
//                           </button>
//                           <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                           <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//                 {dash.plots?.equityHubPlots?.length > 0 && (
//                   <>
//                     <h4 className="text-lg text-cyan-500 font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {dash.plots.equityHubPlots.map((plot, idx) => (
//                         <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                           <button
//                             onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                             className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
//                           >
//                             🗑
//                           </button>
//                           <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                           <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;





















// ================================Working code===================================

// import React, { useEffect, useState } from 'react';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { FiHome, FiLogOut, FiShare2 } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [formData, setFormData] = useState({
//     dashboardName: '',
//     equityHubPlots: [{ symbol: '', companyName: '', graphType: '' }],
//     portfolioPlots: [{ uploadId: '', graphType: '', platform: '' }],
//   });

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const navItems = [{ label: "Dashboard", icon: <FiHome /> }];

//   useEffect(() => {
//     fetchDashboards();
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error(await response.text());

//       const data = await response.json();
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Error loading dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e, index, type) => {
//     const { name, value } = e.target;
//     if (type === 'equity') {
//       const updatedPlots = [...formData.equityHubPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, equityHubPlots: updatedPlots });
//     } else if (type === 'portfolio') {
//       const updatedPlots = [...formData.portfolioPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, portfolioPlots: updatedPlots });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSaveDashboard = async (e) => {
//     e.preventDefault();
//     const dashboardData = {
//       dashboard: { dashboardName: formData.dashboardName },
//       equityHubPlots: formData.equityHubPlots,
//       portfolioPlots: formData.portfolioPlots,
//     };
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/save`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dashboardData),
//       });

//       if (!response.ok) throw new Error('Failed to save dashboard');
//       await fetchDashboards();
//     } catch (err) {
//       console.error("Save error:", err);
//       setError("Error saving dashboard.");
//     }
//   };

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graph_type];
//     if (!Component) {
//       return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
//     }
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Component uploadId={plot.upload_id} />
//       </GraphDataProvider>
//     ) : (
//       <Component symbol={plot.symbol} />
//     );
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards(prev =>
//       prev.map(dash => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter(p => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter(p => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error('Failed to delete dashboard');
//       setDashboards(prev => prev.filter(dash => dash.dashId !== dashId));
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden font-sans">
//       {/* Sidebar */}
//       <aside className={`${collapsed ? "w-20" : "w-64"} bg-gray-900 text-white flex flex-col justify-between shadow-xl transition-all duration-300`}>
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//                 #SMD<span className="text-yellow-400">A</span>
//                 <span className="text-yellow-500">Dashboard</span>
//               </div>
//             )}
//             <button onClick={() => setCollapsed(!collapsed)} className="text-white text-2xl">
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon }) => (
//               <div key={label} className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition cursor-pointer text-sm font-medium">
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </div>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-gray-700">
//           <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-gray-800 overflow-y-auto p-8">
//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
//             📊 Saved Dashboards
//           </h2>
//         </div>

//         <form onSubmit={handleSaveDashboard} className="mb-8">
//           <input
//             type="text"
//             name="dashboardName"
//             value={formData.dashboardName}
//             onChange={(e) => handleInputChange(e, null, 'dashboard')}
//             placeholder="Dashboard Name"
//             className="p-2 border rounded"
//           />
//           <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
//             Save Dashboard
//           </button>
//         </form>

//         {loading ? (
//           <p className="text-gray-600 dark:text-gray-300">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           dashboards.map((dash, dashIdx) => (
//             <div key={dashIdx} className="mb-12 p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 relative border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-2xl font-bold text-cyan-600">{dash.dashboardName}</h3>
//                 <div className="flex gap-2">
//                   {dash.qrCode && (
//                     <div className="relative group">
//                       <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 shadow">
//                         <FiShare2 className="inline mr-2" /> Share
//                       </button>
//                       <div className="absolute bg-white p-2 rounded shadow-lg">
//                         <img
//                           src={`data:image/png;base64,${dash.qrCode}`}
//                           alt="Dashboard QR Code"
//                           className="w-32 h-32"
//                         />
//                       </div>
//                     </div>
//                   )}
//                   <button
//                     onClick={() => {
//                       if (window.confirm("Are you sure you want to delete this dashboard?")) {
//                         handleDeleteDashboard(dash.dashId);
//                       }
//                     }}
//                     className="px-4 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 shadow"
//                   >
//                     Delete Dashboard
//                   </button>
//                 </div>
//               </div>

//               {dash.plots?.portfolioPlots?.length > 0 && (
//                 <>
//                   <h4 className="text-lg text-purple-600 font-semibold mb-4">Portfolio Plots</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {dash.plots.portfolioPlots.map((plot, idx) => (
//                       <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                         <button
//                           onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                           className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
//                         >
//                           🗑
//                         </button>
//                         <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                         <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}

//               {dash.plots?.equityHubPlots?.length > 0 && (
//                 <>
//                   <h4 className="text-lg text-cyan-500 font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {dash.plots.equityHubPlots.map((plot, idx) => (
//                       <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow relative">
//                         <button
//                           onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                           className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg">
//                           🗑
//                         </button>
//                         <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                         <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           ))
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;














// ================================Working code for all ===================================








// import React, { useEffect, useState } from 'react';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { FiHome, FiLogOut, FiShare2 } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';
// import html2canvas from 'html2canvas';

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [formData, setFormData] = useState({
//     dashboardName: '',
//     equityHubPlots: [{ symbol: '', companyName: '', graphType: '' }],
//     portfolioPlots: [{ uploadId: '', graphType: '', platform: '' }],
//     screenshots: [{ screenshot: '' }],
//   });

//   // const API_BASE = import.meta.env.VITE_URL || 'http://147.93.107.167:8181';
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const navItems = [{ label: "Dashboard", icon: <FiHome /> }];

//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       @font-face {
//         font-family: 'Poppins';
//         src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPezSQ.woff2') format('woff2');
//         font-weight: 400;
//         font-style: normal;
//       }
//       /* Ensure no oklch colors in font styles */
//       * {
//         color: inherit !important;
//         background-color: inherit !important;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   useEffect(() => {
//     fetchDashboards();
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error(await response.text());

//       const data = await response.json();
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Error loading dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e, index, type) => {
//     const { name, value } = e.target;
//     if (type === 'equity') {
//       const updatedPlots = [...formData.equityHubPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, equityHubPlots: updatedPlots });
//     } else if (type === 'portfolio') {
//       const updatedPlots = [...formData.portfolioPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, portfolioPlots: updatedPlots });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSaveDashboard = async (e) => {
//     e.preventDefault();
//     const dashboardData = {
//       dashboard: { dashboardName: formData.dashboardName },
//       equityHubPlots: formData.equityHubPlots,
//       portfolioPlots: formData.portfolioPlots,
//       screenshots: formData.screenshots,
//     };
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/save`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dashboardData),
//       });

//       if (!response.ok) throw new Error(await response.text());
//       await fetchDashboards();
//     } catch (err) {
//       console.error("Save error:", err);
//       setError("Error saving dashboard.");
//     }
//   };

//   const handleTakeSnap = async (dashId, dashboardElementId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to take a snapshot.");
//         return;
//       }

//       const element = document.getElementById(dashboardElementId);
//       if (!element) {
//         setError(`Dashboard element with ID "${dashboardElementId}" not found.`);
//         return;
//       }

//       // Clone the element to avoid modifying the original DOM
//       const clone = element.cloneNode(true);
//       document.body.appendChild(clone);

//       // Apply styles to remove oklch and ensure compatibility
//       clone.style.visibility = 'visible';
//       clone.style.position = 'absolute';
//       clone.style.top = '0';
//       clone.style.left = '0';
//       clone.style.backgroundColor = '#ffffff';
//       clone.style.color = '#000000';

//       // Remove any stylesheets that might contain oklch
//       const stylesheets = clone.querySelectorAll('style, link[rel="stylesheet"]');
//       stylesheets.forEach(sheet => sheet.remove());

//       // Apply inline styles to preserve appearance
//       const allElements = clone.querySelectorAll('*');
//       allElements.forEach(el => {
//         const computed = window.getComputedStyle(el);
//         el.style.backgroundColor = computed.backgroundColor.includes('oklch') ? '#ffffff' : computed.backgroundColor;
//         el.style.color = computed.color.includes('oklch') ? '#000000' : computed.color;
//         el.style.borderColor = computed.borderColor.includes('oklch') ? '#000000' : computed.borderColor;
//       });

//       // Wait for rendering
//       await new Promise(resolve => setTimeout(resolve, 500));

//       const canvas = await html2canvas(clone, {
//         backgroundColor: '#ffffff',
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });

//       // Clean up
//       document.body.removeChild(clone);

//       const base64Screenshot = canvas.toDataURL('image/png');
//       if (!base64Screenshot || base64Screenshot.length < 100) {
//         throw new Error("Generated screenshot is invalid or empty.");
//       }

//       const response = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ screenshot: base64Screenshot }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Backend error: ${errorText}`);
//       }

//       const data = await response.json();
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId ? { ...dash, qrCode: data.qrCode, screenshotPath: data.screenshotPath } : dash
//         )
//       );
//       alert("Snapshot saved successfully!");
//     } catch (err) {
//       console.error("Snapshot error:", err);
//       setError(`Failed to take snapshot: ${err.message}`);
//     }
//   };

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graph_type];
//     if (!Component) {
//       return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
//     }
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Component uploadId={plot.upload_id} />
//       </GraphDataProvider>
//     ) : (
//       <Component symbol={plot.symbol} />
//     );
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards(prev =>
//       prev.map(dash => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter(p => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter(p => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error(await response.text());
//       setDashboards(prev => prev.filter(dash => dash.dashId !== dashId));
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden font-sans bg-[#ffffff] dark:bg-[#0f172a]">
//       <aside className={`${collapsed ? "w-20" : "w-64"} bg-[#1f2937] text-white flex flex-col justify-between shadow-xl transition-all duration-300`}>
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-[#06b6d4] to-[#06b6d4] text-transparent bg-clip-text">
//                 #CMD<span className="text-[#9333ea]">A</span>
//                 <span className="text-[#9333ea]">Dashboard</span>
//               </div>
//             )}
//             <button onClick={() => setCollapsed(!collapsed)} className="text-white text-2xl">
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon }) => (
//               <div key={label} className="flex items-center gap-3 px-4 py-2 rounded hover:bg-[#374151] transition cursor-pointer text-sm font-medium">
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </div>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-[#4b5563]">
//           <button className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 bg-[#f3f4f6] dark:bg-[#1e293b] overflow-y-auto p-8">
//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-[#1f2937] dark:text-white bg-gradient-to-r from-[#06b6d4] to-[#06b6d4] text-transparent bg-clip-text">
//             📊 Saved Dashboards
//           </h2>
//         </div>

//         <form onSubmit={handleSaveDashboard} className="mb-8">
//           <input
//             type="text"
//             name="dashboardName"
//             value={formData.dashboardName}
//             onChange={(e) => handleInputChange(e, null, 'dashboard')}
//             placeholder="Dashboard Name"
//             className="p-2 border rounded bg-[#ffffff] dark:bg-[#374151] text-[#1f2937] dark:text-white"
//           />
//           <button type="submit" className="ml-2 p-2 bg-[#06b6d4] text-white rounded">
//             Save Dashboard
//           </button>
//         </form>

//         {loading ? (
//           <p className="text-[#64748b] dark:text-[#9ca3af]">Loading...</p>
//         ) : error ? (
//           <p className="text-[#dc2626]">{error}</p>
//         ) :
//         dashboards.length === 0 ? (
//         <p className="text-sky-600 dark:text-gray-300 text-lg ">
//          ⚠️ To continue, please save your dashboard first.
//         </p>
//       ) : (
//           dashboards.map((dash, dashIdx) => (
//             <div key={dashIdx} id={`dashboard-${dash.dashId}`} className="mb-12 p-6 rounded-2xl shadow-xl bg-[#ffffff] dark:bg-[#2d3748] border border-[#e5e7eb] dark:border-[#4b5563]">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-2xl font-bold text-[#06b6d4]">{dash.dashboardName}</h3>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleTakeSnap(dash.dashId, `dashboard-${dash.dashId}`)}
//                     className="px-4 py-1 bg-[#22c55e] text-white rounded-full text-sm hover:bg-[#16a34a] shadow"
//                   >
//                     Take Snap
//                   </button>
//                   {dash.qrCode && (
//                     <div className="relative group">
//                       <button className="px-4 py-1 bg-[#06b6d4] text-white rounded-full text-sm hover:bg-[#0891b2] shadow">
//                         <FiShare2 className="inline mr-2" /> Share
//                       </button>
//                       <div className="absolute hidden group-hover:block bg-[#ffffff] p-2 rounded shadow-lg">
//                         <img
//                           src={dash.qrCode}
//                           alt="Dashboard QR Code"
//                           className="w-32 h-32"
//                         />
//                       </div>
//                     </div>
//                   )}
//                   <button
//                     onClick={() => {
//                       if (window.confirm("Are you sure you want to delete this dashboard?")) {
//                         handleDeleteDashboard(dash.dashId);
//                       }
//                     }}
//                     className="px-4 py-1 bg-[#dc2626] text-white rounded-full text-sm hover:bg-[#b91c1c] shadow"
//                   >
//                     Delete Dashboard
//                   </button>
//                 </div>
//               </div>

//               {dash.plots?.portfolioPlots?.length > 0 && (
//                 <>
//                   <h4 className="text-lg text-[#9333ea] font-semibold mb-4">Portfolio Plots</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {dash.plots.portfolioPlots.map((plot, idx) => (
//                       <div key={idx} className="p-4 bg-[#f3f4f6] dark:bg-[#374151] rounded-xl shadow relative">
//                         <button
//                           onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                           className="absolute top-2 right-2 text-[#dc2626] hover:text-[#b91c1c] text-lg"
//                         >
//                           🗑
//                         </button>
//                         <h5 className="font-semibold text-[#1f2937] dark:text-white mb-2">{plot.graph_type}</h5>
//                         <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}

//               {dash.plots?.equityHubPlots?.length > 0 && (
//                 <>
//                   <h4 className="text-lg text-[#06b6d4] font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {dash.plots.equityHubPlots.map((plot, idx) => (
//                       <div key={idx} className="p-4 bg-[#f3f4f6] dark:bg-[#374151] rounded-xl shadow relative">
//                         <button
//                           onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                           className="absolute top-2 right-2 text-[#dc2626] hover:text-[#b91c1c] text-lg">
//                           🗑
//                         </button>
//                         <h5 className="font-semibold text-[#1f2937] dark:text-white mb-2">{plot.graph_type}</h5>
//                         <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           ))
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;


//----------------------------four graphs------------------------------------

// import React, { useEffect, useState } from 'react';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { FiHome, FiLogOut, FiShare2, FiCopy, FiDownload } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';
// import html2canvas from 'html2canvas';

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [formData, setFormData] = useState({
//     dashboardName: '',
//     equityHubPlots: [{ symbol: '', companyName: '', graphType: '' }],
//     portfolioPlots: [{ uploadId: '', graphType: '', platform: '' }],
//     screenshots: [{ screenshot: '' }],
//   });
//   const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedQrCode, setSelectedQrCode] = useState(null);

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const navItems = [{ label: "Dashboard", icon: <FiHome /> }];

//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       @font-face {
//         font-family: 'Poppins';
//         src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPezSQ.woff2') format('woff2');
//         font-weight: 400;
//         font-style: normal;
//       }
//       * {
//         color: inherit !important;
//         background-color: inherit !important;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   useEffect(() => {
//     fetchDashboards();
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error(await response.text());

//       const data = await response.json();
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Error loading dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e, index, type) => {
//     const { name, value } = e.target;
//     if (type === 'equity') {
//       const updatedPlots = [...formData.equityHubPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, equityHubPlots: updatedPlots });
//     } else if (type === 'portfolio') {
//       const updatedPlots = [...formData.portfolioPlots];
//       updatedPlots[index][name] = value;
//       setFormData({ ...formData, portfolioPlots: updatedPlots });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSaveDashboard = async (e) => {
//     e.preventDefault();
//     const dashboardData = {
//       dashboard: { dashboardName: formData.dashboardName },
//       equityHubPlots: formData.equityHubPlots,
//       portfolioPlots: formData.portfolioPlots,
//       screenshots: formData.screenshots,
//     };
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/save`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dashboardData),
//       });

//       if (!response.ok) throw new Error(await response.text());
//       await fetchDashboards();
//     } catch (err) {
//       console.error("Save error:", err);
//       setError("Error saving dashboard.");
//     }
//   };

//   const handleTakeSnap = async (dashId, dashboardElementId) => {
//     setIsTakingSnapshot(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to take a snapshot.");
//         return;
//       }

//       const element = document.getElementById(dashboardElementId);
//       if (!element) {
//         setError(`Dashboard element with ID "${dashboardElementId}" not found.`);
//         return;
//       }

//       const clone = element.cloneNode(true);
//       document.body.appendChild(clone);

//       clone.style.visibility = 'visible';
//       clone.style.position = 'absolute';
//       clone.style.top = '0';
//       clone.style.left = '0';
//       clone.style.backgroundColor = '#ffffff';
//       clone.style.color = '#000000';

//       const stylesheets = clone.querySelectorAll('style, link[rel="stylesheet"]');
//       stylesheets.forEach(sheet => sheet.remove());

//       const allElements = clone.querySelectorAll('*');
//       allElements.forEach(el => {
//         const computed = window.getComputedStyle(el);
//         el.style.backgroundColor = computed.backgroundColor.includes('oklch') ? '#ffffff' : computed.backgroundColor;
//         el.style.color = computed.color.includes('oklch') ? '#000000' : computed.color;
//         el.style.borderColor = computed.borderColor.includes('oklch') ? '#000000' : computed.borderColor;
//       });

//       await new Promise(resolve => setTimeout(resolve, 500));

//       const canvas = await html2canvas(clone, {
//         backgroundColor: '#ffffff',
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });

//       document.body.removeChild(clone);

//       const base64Screenshot = canvas.toDataURL('image/png');
//       if (!base64Screenshot || base64Screenshot.length < 100) {
//         throw new Error("Generated screenshot is invalid or empty.");
//       }

//       const response = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ screenshot: base64Screenshot }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Backend error: ${errorText}`);
//       }

//       const data = await response.json();
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId ? { ...dash, qrCode: data.qrCode, screenshotPath: data.screenshotPath } : dash
//         )
//       );
//       alert("Snapshot saved successfully!");
//     } catch (err) {
//       console.error("Snapshot error:", err);
//       setError(`Failed to take snapshot: ${err.message}`);
//     } finally {
//       setIsTakingSnapshot(false);
//     }
//   };

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graph_type];
//     if (!Component) {
//       return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
//     }
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Component uploadId={plot.upload_id} />
//       </GraphDataProvider>
//     ) : (
//       <Component symbol={plot.symbol} />
//     );
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards(prev =>
//       prev.map(dash => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter(p => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter(p => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error(await response.text());
//       setDashboards(prev => prev.filter(dash => dash.dashId !== dashId));
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   const openQrModal = (qrCode) => {
//     setSelectedQrCode(qrCode);
//     setShowModal(true);
//   };

//   const closeQrModal = () => {
//     setShowModal(false);
//     setSelectedQrCode(null);
//   };

//   // const handleCopyLink = () => {
//   //   // Implement your copy functionality here
//   //   navigator.clipboard.writeText("https://participate.schoolsurveys.com/a");
//   //   alert("Link copied to clipboard!");
//   // };

//   const handleDownloadQR = () => {
//     // Implement your download functionality here
//     const link = document.createElement('a');
//     link.href = selectedQrCode;
//     link.download = 'dashboard-qr-code.png';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden  bg-sky-900 dark:bg-slate-800">
//       <aside className={`${collapsed ? "w-20" : "w-64"} bg-black text-white flex flex-col justify-between shadow-xl transition-all duration-300`}>
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide  text-transparent bg-clip-text">
//                 #CMD<span className="text-sky-500">A</span>
//                 <span className="text-white">Dashboard</span>
//               </div>
//             )}
//             <button onClick={() => setCollapsed(!collapsed)} className="text-white text-2xl">
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon }) => (
//               <div key={label} className="flex items-center gap-3 px-4 py-2 rounded hover:bg-sky-900 transition cursor-pointer text-sm font-medium">
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </div>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-white">
//           <button className="w-full bg-sky-900 text-white hover:bg-sky-900 text-white py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//       <main className={`flex-1 bg-sky-900 dark:bg-sky-900 overflow-y-auto p-8 ${isTakingSnapshot ? 'pointer-events-none' : ''}`} style={{ position: 'relative' }}>
//         {isTakingSnapshot && (
//           <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//             <div className="text-white text-lg animate-pulse">Taking Snapshot...</div>
//           </div>
//         )}

//         {/* QR Code Modal */}
//         {showModal && selectedQrCode && (
//   <div 
//     className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" 
//     onClick={closeQrModal}
//   >
//     <div 
//       className="bg-white dark:bg-sky-900 p-6 rounded-2xl shadow-2xl w-full max-w-md relative"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <h3 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-4">
//         Share Dashboard
//       </h3>

//       <div className="flex flex-col items-center mb-6">
//         <img
//           src={selectedQrCode}
//           alt="Dashboard QR Code"
//           className="w-48 h-48 mb-3 border-4 border-gray-200 dark:border-gray-700 rounded-md"
//         />
//         <p className="text-center text-gray-600 dark:text-gray-300 text-sm max-w-xs">
//           Scan this QR code with your camera to view the dashboard instantly.
//         </p>
//       </div>

//       <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
//         <button 
//           onClick={handleDownloadQR}
//           className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm font-medium transition"
//         >
//           <FiDownload /> Download QR
//         </button>
//         {/*<button 
//           onClick={handleCopyLink}
//           className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium transition"
//         >
//           <FiCopy /> Copy Link
//         </button>*/}
//       </div>

//       <button
//         onClick={closeQrModal}
//         className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//       >
//         ✕
//       </button>
//     </div>
//   </div>
// )}

//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-black dark:text-white  text-transparent bg-clip-text">
//             📊 Saved Dashboards
//           </h2>
//         </div>

//         {loading ? (
//           <p className="text-black dark:text-white">Loading...</p>
//         ) : error ? (
//           <p className="text-black">{error}</p>
//         ) : (
//           dashboards.map((dash, dashIdx) => (
//             <div key={dashIdx} id={`dashboard-${dash.dashId}`} className="mb-12 p-6 rounded-2xl shadow-xl bg-sky-900 dark:bg-sky-900 ">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-2xl font-bold text-black">{dash.dashboardName}</h3>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleTakeSnap(dash.dashId, `dashboard-${dash.dashId}`)}
//                     className="px-4 py-1 bg-sky-900 text-white rounded-full text-sm hover:bg-sky-900 shadow"
//                     disabled={isTakingSnapshot}
//                   >
//                     Take Snap
//                   </button>
//                   {dash.qrCode && (
//                     <button
//                       onClick={() => openQrModal(dash.qrCode)}
//                       className="px-4 py-1 bg-slate-200 text-black rounded-full text-sm hover:bg-sky-900 shadow flex items-center gap-2"
//                     >
//                       <FiShare2 /> Share
//                     </button>
//                   )}
//                   <button
//                     onClick={() => {
//                       if (window.confirm("Are you sure you want to delete this dashboard?")) {
//                         handleDeleteDashboard(dash.dashId);
//                       }
//                     }}
//                     className="px-4 py-1 bg-cyan-800 text-white rounded-full text-sm hover:bg-sky-900 shadow"
//                   >
//                     Delete Dashboard
//                   </button>
//                 </div>
//               </div>

//               {dash.plots?.portfolioPlots?.length > 0 && (
//                 <>
//                   <h4 className="text-lg text-black font-semibold mb-4">Portfolio Plots</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {dash.plots.portfolioPlots.map((plot, idx) => (
//                       <div key={idx} className="p-4 bg-sky-900 dark:bg-sky-900 rounded-xl shadow relative">
//                         <button
//                           onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                           className="absolute top-2 right-2 text-black hover:text-black text-lg"
//                         >
//                           🗑
//                         </button>
//                         <h5 className="font-semibold text-black dark:text-white mb-2">{plot.graph_type}</h5>
//                         <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}

//               {dash.plots?.equityHubPlots?.length > 0 && (
//                 <>
//                   <h4 className="text-lg text-black font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {dash.plots.equityHubPlots.map((plot, idx) => (
//                       <div key={idx} className="p-4 bg-sky-900 dark:bg-sky-900 rounded-xl shadow relative">
//                         <button
//                           onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                           className="absolute top-2 right-2 text-black hover:text-white text-lg">
//                           🗑
//                         </button>
//                         <h5 className="font-semibold text-black dark:text-white mb-2">{plot.graph_type}</h5>
//                         <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           ))
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;


// import React, { useEffect, useState, useCallback } from "react";
// import { equityHubMap, portfolioMap } from "./ComponentRegistry";
// import { FiHome, FiLogOut, FiCopy, FiTrash, FiShare2, FiEye, FiInbox } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// import { HiOutlineDownload } from "react-icons/hi";
// import { GraphDataProvider } from "../Portfolio/GraphDataContext";
// import html2canvas from "html2canvas";
// import { useNavigate } from "react-router-dom";

// const MAX_SNAPSHOTS = 6;

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [snapshots, setSnapshots] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboards");
//   const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
//   const [selectedDashboard, setSelectedDashboard] = useState(null);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [lightboxImg, setLightboxImg] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [imageErrors, setImageErrors] = useState({});
//   const navigate = useNavigate();
//   const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState("");

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = `
//       @font-face {
//         font-family: 'Poppins';
//         src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPezSQ.woff2') format('woff2');
//         font-weight: 400;
//         font-style: normal;
//       }
//       * { color: inherit !important; background-color: inherit !important; }
//       .snapshot-spinner {
//         border: 4px solid rgba(255, 255, 255, 0.3);
//         border-top: 4px solid #ffffff;
//         border-radius: 50%;
//         width: 40px;
//         height: 40px;
//         animation: spin 1s linear infinite;
//       }
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   useEffect(() => {
//     fetchDashboards();
//     fetchSnapshots();
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch dashboards error:", err);
//       setError("Error loading dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSnapshots = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your snapshots.");
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/snapshots`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setSnapshots(data.snapshots || []);
//     } catch (err) {
//       console.error("Fetch snapshots error:", err);
//       setError("Error loading snapshots.");
//     }
//   };

//   const fetchScreenshot = useCallback(
//     async (dashId, screenshotPath) => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const imageUrl = `${API_BASE}/dashboard/image/${screenshotPath}`;
//         const res = await fetch(imageUrl, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error(`status: ${res.status}`);
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         setImageUrls((prev) => ({ ...prev, [dashId]: url }));
//       } catch (err) {
//         console.error(`Failed to fetch screenshot for ${dashId}:`, err);
//         setImageErrors((p) => ({ ...p, [dashId]: true }));
//       }
//     },
//     [API_BASE]
//   );

//   useEffect(() => {
//     [...dashboards, ...snapshots].forEach((item) => {
//       const id = item.dashId;
//       if (!imageUrls[id] && !imageErrors[id] && item.screenshotPath) {
//         fetchScreenshot(id, item.screenshotPath);
//       }
//     });
//   }, [dashboards, snapshots, imageUrls, imageErrors, fetchScreenshot]);

//   const handleDeleteSnapshot = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this snapshot?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       setSnapshots((prev) => prev.filter((s) => s.dashId !== dashId));
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId ? { ...dash, qrCode: null, screenshotPath: null } : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({ ...prev, qrCode: null, screenshotPath: null }));
//       }
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//     } catch (err) {
//       console.error("Snapshot delete error:", err);
//       alert("Failed to delete snapshot");
//     }
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this dashboard?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error(await response.text());
//       setDashboards((prev) => prev.filter((dash) => dash.dashId !== dashId));
//       setSnapshots((prev) => prev.filter((snap) => snap.dashId !== dashId));
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setSelectedDashboard(null);
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards((prev) =>
//       prev.map((dash) => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//     if (selectedDashboard) {
//       setSelectedDashboard((prev) => ({
//         ...prev,
//         plots: {
//           ...prev.plots,
//           portfolioPlots: isPortfolio
//             ? prev.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
//             : prev.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? prev.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
//             : prev.plots.equityHubPlots,
//         },
//       }));
//     }
//   };

//   const handleDownloadSnapshot = (imageUrl, dashboardName) => {
//     if (!imageUrl) {
//       alert("No image available to download.");
//       return;
//     }
//     const link = document.createElement("a");
//     link.href = imageUrl;
//     link.download = `${dashboardName || "dashboard"}_snapshot.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleTakeSnap = async (dashId, dashboardElementId) => {
//     if (snapshots.length >= MAX_SNAPSHOTS) {
//       alert(`You can keep only ${MAX_SNAPSHOTS} snapshots. Please delete one before creating a new snapshot.`);
//       return;
//     }
//     setIsTakingSnapshot(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Please log in to take a snapshot.");
//       const element = document.getElementById(dashboardElementId);
//       if (!element) throw new Error(`Element '${dashboardElementId}' not found`);
//       const clone = element.cloneNode(true);
//       document.body.appendChild(clone);
//       clone.style.visibility = "visible";
//       clone.style.position = "absolute";
//       clone.style.top = "-9999px";
//       clone.style.left = "-9999px";
//       clone.style.background = "#fff";
//       clone.style.color = "#000";
//       const stylesheets = clone.querySelectorAll('style, link[rel="stylesheet"]');
//       stylesheets.forEach(sheet => sheet.remove());
//       const allElements = clone.querySelectorAll('*');
//       allElements.forEach(el => {
//         const computed = window.getComputedStyle(el);
//         el.style.backgroundColor = computed.backgroundColor.includes('oklch') ? '#ffffff' : computed.backgroundColor;
//         el.style.color = computed.color.includes('oklch') ? '#000000' : computed.color;
//         el.style.borderColor = computed.borderColor.includes('oklch') ? '#000000' : computed.borderColor;
//       });
//       await new Promise((r) => setTimeout(r, 200));
//       const canvas = await html2canvas(clone, {
//         backgroundColor: "#ffffff",
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });
//       document.body.removeChild(clone);
//       const base64 = canvas.toDataURL("image/png");
//       if (!base64 || base64.length < 100) {
//         throw new Error("Generated screenshot is invalid or empty.");
//       }
//       const snapshotTime = new Date().toISOString();
//       const dashboard = dashboards.find((d) => d.dashId === dashId);
//       const plots = {
//         portfolioPlots: dashboard?.plots?.portfolioPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.companyName || "Unknown Company",
//           dash_port_id: p.dash_port_id,
//         })) || [],
//         equityHubPlots: dashboard?.plots?.equityHubPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.symbol || "Unknown Company",
//           dash_equity_hub_id: p.dash_equity_hub_id,
//         })) || [],
//       };
//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ screenshot: base64, createdAt: snapshotTime }),
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       const newSnapshot = {
//         dashId,
//         dashboardName: dashboard?.dashboardName || "Unnamed Dashboard",
//         screenshotPath: data.screenshotPath,
//         createdAt: data.createdAt || snapshotTime,
//         plots,
//       };
//       setSnapshots((prev) => {
//         const filtered = prev.filter((s) => s.dashId !== dashId);
//         return [...filtered, newSnapshot];
//       });
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId
//             ? { ...dash, qrCode: data.qrCode, screenshotPath: data.screenshotPath }
//             : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({
//           ...prev,
//           qrCode: data.qrCode,
//           screenshotPath: data.screenshotPath,
//         }));
//       }
//       await fetchScreenshot(dashId, data.screenshotPath);
//       setSnapshotSuccessMsg("Snapshot taken successfully!");
//       setTimeout(() => setSnapshotSuccessMsg(""), 3000);
//     } catch (err) {
//       console.error("Snapshot error:", err);
//       setError(err.message);
//     } finally {
//       setIsTakingSnapshot(false);
//     }
//   };

//   const openLightbox = (src) => {
//     setLightboxImg(src);
//     setLightboxOpen(true);
//   };

//   const closeLightbox = () => setLightboxOpen(false);

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Cmp = map[plot.graph_type];
//     if (!Cmp) return <p className="text-red-500">Component not found</p>;
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Cmp uploadId={plot.upload_id} />
//       </GraphDataProvider>
//     ) : (
//       <Cmp symbol={plot.symbol} />
//     );
//   };

//   const navItems = [
//     {
//       label: "Dashboard",
//       icon: <FiHome />,
//       onClick: () => {
//         setActiveTab("dashboards");
//         navigate("/dashboard");
//       },
//     },
//     {
//       label: "Saved Dashboard",
//       icon: <FiHome />,
//       onClick: () => {
//         setActiveTab("savedDashboard");
//         navigate("/savedDashboard");
//       },
//     },
//     {
//       label: "Snapshots",
//       icon: <FiCopy />,
//       onClick: () => setActiveTab("snapshots"),
//     },
//   ];

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   };

//   const handleViewDashboard = (dashboard) => {
//     setSelectedDashboard(dashboard);
//   };

//   const handleBackToList = () => {
//     setSelectedDashboard(null);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-sky-900 dark:bg-slate-800">
//       <aside
//         className={`${collapsed ? "w-20" : "w-64"} bg-black text-white flex flex-col justify-between shadow-xl transition-all duration-300`}
//       >
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text">
//                 #CMD<span className="text-sky-500">A</span>
//                 <span className="text-white">Dashboard</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-white text-2xl"
//             >
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon, onClick }) => (
//               <button
//                 key={label}
//                 onClick={onClick}
//                 className={`w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-sky-900 transition cursor-pointer text-sm font-medium ${
//                   (label === "Snapshots" && activeTab === "snapshots") ||
//                   (label === "Saved Dashboard" && activeTab === "savedDashboard") ||
//                   (label === "Dashboard" && activeTab === "dashboards")
//                     ? "bg-sky-900"
//                     : ""
//                 }`}
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-white">
//           <button className="w-full bg-sky-900 text-white hover:bg-sky-900 py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//       <main
//         className={`flex-1 bg-sky-900 dark:bg-sky-900 overflow-y-auto p-8 ${isTakingSnapshot ? "pointer-events-none" : ""}`}
//         style={{ position: "relative" }}
//       >
//         {isTakingSnapshot && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//             <div className="flex flex-col items-center gap-4">
//               <div className="snapshot-spinner"></div>
//               <div className="text-white text-lg font-semibold">Generating your snapshot...</div>
//             </div>
//           </div>
//         )}

//         {snapshotSuccessMsg && (
//           <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
//             {snapshotSuccessMsg}
//           </div>
//         )}

//         {lightboxOpen && (
//           <div
//             className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center"
//             onClick={closeLightbox}
//           >
//             <div
//               className="relative max-h-[90vh] max-w-[90vw]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={lightboxImg}
//                 alt="snapshot lightbox"
//                 className="rounded shadow-xl max-h-[90vh] max-w-full object-contain"
//               />
//               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
//                 <button
//                   onClick={closeLightbox}
//                   className="p-3 rounded-full bg-white/80 hover:bg-white text-black shadow"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-400 to-white">
//             {activeTab === "dashboards" ? (selectedDashboard ? selectedDashboard.dashboardName : "Saved Dashboards") : "Snapshots"}
//           </h2>
//           {selectedDashboard && (
//             <button
//               onClick={handleBackToList}
//               className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-600"
//             >
//               Back to List
//             </button>
//           )}
//         </div>

//         {loading ? (
//           <p className="text-white">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : activeTab === "snapshots" ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//             {snapshots.length ? (
//               snapshots.map((snap) => (
//                 <div key={snap.dashId} className="relative p-4 bg-sky-900 rounded-2xl shadow-xl">
//                   <button
//                     onClick={() => handleDeleteSnapshot(snap.dashId)}
//                     className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
//                   >
//                     <FiTrash />
//                   </button>
//                   <h3 className="text-lg font-semibold mb-2 text-white">{snap.dashboardName}</h3>

//                   {snap.screenshotPath ? (
//                     imageErrors[snap.dashId] ? (
//                       <p className="text-red-500">Failed to load image</p>
//                     ) : (
//                       <img
//                         src={imageUrls[snap.dashId]}
//                         alt="snapshot"
//                         className="rounded border cursor-zoom-in hover:opacity-90"
//                         onClick={() => openLightbox(imageUrls[snap.dashId])}
//                         onError={() => setImageErrors((p) => ({ ...p, [snap.dashId]: true }))}
//                       />
//                     )
//                   ) : (
//                     <p className="text-gray-400">No snapshot</p>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-white">No snapshots available.</p>
//             )}
//           </div>
//         ) : selectedDashboard ? (
//           <div id={`dashboard-${selectedDashboard.dashId}`} className="mb-12 p-6 rounded-2xl shadow-xl bg-sky-900">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-2xl font-bold text-white">{selectedDashboard.dashboardName}</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleTakeSnap(selectedDashboard.dashId, `dashboard-${selectedDashboard.dashId}`)}
//                   className="px-4 py-1 bg-sky-700 text-white rounded-full text-sm hover:bg-sky-600 shadow disabled:opacity-60"
//                   disabled={isTakingSnapshot}
//                 >
//                   Take Snap
//                 </button>
//                 {selectedDashboard.screenshotPath && imageUrls[selectedDashboard.dashId] && (
//                   <button
//                     onClick={() => handleDownloadSnapshot(imageUrls[selectedDashboard.dashId], selectedDashboard.dashboardName)}
//                     className="px-4 py-1 bg-slate-200 text-black rounded-full text-sm hover:bg-sky-600 shadow flex items-center gap-2"
//                   >
//                     <HiOutlineDownload /> Download
//                   </button>
//                 )}
//                 {selectedDashboard.qrCode && (
//                   <button
//                     onClick={() => openLightbox(selectedDashboard.qrCode)}
//                     className="px-4 py-1 bg-slate-200 text-black rounded-full text-sm hover:bg-sky-600 shadow flex items-center gap-2"
//                   >
//                     <FiShare2 /> Share
//                   </button>
//                 )}
//                 <button
//                   onClick={() => handleDeleteDashboard(selectedDashboard.dashId)}
//                   className="px-4 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 shadow flex items-center gap-1"
//                 >
//                   <FiTrash /> Delete Dashboard
//                 </button>
//               </div>
//             </div>
//             {snapshots.find((s) => s.dashId === selectedDashboard.dashId)?.createdAt && (
//               <p className="text-sm text-sky-200/80 mb-4">
//                 Snapshot Taken: {formatDate(snapshots.find((s) => s.dashId === selectedDashboard.dashId).createdAt)}
//               </p>
//             )}
//             {selectedDashboard.plots?.portfolioPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-white font-semibold mb-4">Portfolio Plots</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.portfolioPlots.map((plot) => (
//                     <div key={plot.dash_port_id} className="p-4 bg-sky-900 rounded-xl shadow relative">
//                       <button
//                         onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                         className="absolute top-2 right-2 text-[#dc2626] hover:text-[#b91c1c] text-lg"
//                       >
//                         Delete
//                       </button>
//                       <h5 className="font-semibold text-white mb-2">{plot.graph_type} - {plot.companyName || "Unknown Company"}</h5>
//                       <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//             {selectedDashboard.plots?.equityHubPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-white font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.equityHubPlots.map((plot) => (
//                     <div key={plot.dash_equity_hub_id} className="p-4 bg-sky-900 rounded-xl shadow relative">
//                       <button
//                         onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                         className="absolute top-2 right-2 text-[#dc2626] hover:text-[#b91c1c] text-lg"
//                       >
//                         Delete
//                       </button>
//                       <h5 className="font-semibold text-white mb-2">{plot.graph_type} - {plot.symbol || "Unknown Company"}</h5>
//                       <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         ) : (
//           <div className="bg-sky-900 rounded-xl shadow-lg overflow-hidden p-1">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-sky-700/50">
//                 <thead className="bg-sky-800/80">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">Dashboard Name</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">ID</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">Date/Time</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-sky-900/50 divide-y divide-sky-700/30">
//                   {dashboards.length > 0 ? (
//                     dashboards.map((dashboard) => (
//                       <tr key={dashboard.dashId} className="hover:bg-sky-800/40 transition-colors duration-150">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-white">{dashboard.dashboardName}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-sky-200/80">{dashboard.dashId}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-sky-200/80">{formatDate(dashboard.createdAt)}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex space-x-3">
//                             <button
//                               onClick={() => handleViewDashboard(dashboard)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
//                               title="View Dashboard"
//                             >
//                               <FiEye className="mr-1.5" /> View
//                             </button>
//                             <button
//                               onClick={() => handleDeleteDashboard(dashboard.dashId)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-rose-600/90 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
//                               title="Delete Dashboard"
//                             >
//                               <FiTrash className="mr-1.5" /> Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-8 text-center">
//                         <div className="flex flex-col items-center justify-center">
//                           <FiInbox className="w-12 h-12 text-sky-700/50 mb-3" />
//                           <span className="text-sm font-medium text-sky-400/70">No dashboards available</span>
//                           <span className="text-xs text-sky-600/50 mt-1">Create your first dashboard to get started</span>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;

// ==================woco====================================
// import React, { useEffect, useState, useCallback } from "react";
// import { equityHubMap, portfolioMap } from "./ComponentRegistry";
// import { FiHome, FiLogOut, FiCopy, FiTrash, FiShare2, FiEye, FiInbox } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// import { HiOutlineDownload } from "react-icons/hi";
// import { GraphDataProvider } from "../Portfolio/GraphDataContext";
// import html2canvas from "html2canvas";
// import { useNavigate } from "react-router-dom";

// const MAX_SNAPSHOTS = 5;

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [snapshots, setSnapshots] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboards");
//   const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
//   const [selectedDashboard, setSelectedDashboard] = useState(null);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [lightboxImg, setLightboxImg] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [imageErrors, setImageErrors] = useState({});
//   const navigate = useNavigate();
//   const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState("");

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = `
//       @font-face {
//         font-family: 'Poppins';
//         src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPezSQ.woff2') format('woff2');
//         font-weight: 400;
//         font-style: normal;
//       }
//       * { color: inherit !important; background-color: inherit !important; }
//       .snapshot-spinner {
//         border: 4px solid rgba(255, 255, 255, 0.3);
//         border-top: 4px solid #ffffff;
//         border-radius: 50%;
//         width: 40px;
//         height: 40px;
//         animation: spin 1s linear infinite;
//       }
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   useEffect(() => {
//     fetchDashboards();
//     fetchSnapshots();
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch dashboards error:", err);
//       setError("Please log in to view your dashboard.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSnapshots = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your snapshots.");
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/snapshots`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setSnapshots(data.snapshots || []);
//     } catch (err) {
//       console.error("Fetch snapshots error:", err);
//       setError("Please log in to view your snapshots.");
//     }
//   };

//   const fetchScreenshot = useCallback(
//     async (dashId, screenshotPath) => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const imageUrl = `${API_BASE}/dashboard/image/${screenshotPath}`;
//         const res = await fetch(imageUrl, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error(`status: ${res.status}`);
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         setImageUrls((prev) => ({ ...prev, [dashId]: url }));
//       } catch (err) {
//         console.error(`Failed to fetch screenshot for ${dashId}:`, err);
//         setImageErrors((p) => ({ ...p, [dashId]: true }));
//       }
//     },
//     [API_BASE]
//   );

//   useEffect(() => {
//     [...dashboards, ...snapshots].forEach((item) => {
//       const id = item.dashId;
//       if (!imageUrls[id] && !imageErrors[id] && item.screenshotPath) {
//         fetchScreenshot(id, item.screenshotPath);
//       }
//     });
//   }, [dashboards, snapshots, imageUrls, imageErrors, fetchScreenshot]);

//   const handleDeleteSnapshot = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this snapshot?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       setSnapshots((prev) => prev.filter((s) => s.dashId !== dashId));
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId ? { ...dash, qrCode: null, screenshotPath: null } : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({ ...prev, qrCode: null, screenshotPath: null }));
//       }
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//     } catch (err) {
//       console.error("Snapshot delete error:", err);
//       alert("Failed to delete snapshot");
//     }
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this dashboard?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error(await response.text());
//       setDashboards((prev) => prev.filter((dash) => dash.dashId !== dashId));
//       setSnapshots((prev) => prev.filter((snap) => snap.dashId !== dashId));
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setSelectedDashboard(null);
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards((prev) =>
//       prev.map((dash) => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//     if (selectedDashboard) {
//       setSelectedDashboard((prev) => ({
//         ...prev,
//         plots: {
//           ...prev.plots,
//           portfolioPlots: isPortfolio
//             ? prev.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
//             : prev.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? prev.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
//             : prev.plots.equityHubPlots,
//         },
//       }));
//     }
//   };

//   const handleDownloadSnapshot = (imageUrl, dashboardName) => {
//     if (!imageUrl) {
//       alert("No image available to download.");
//       return;
//     }
//     const link = document.createElement("a");
//     link.href = imageUrl;
//     link.download = `${dashboardName || "dashboard"}_snapshot.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleTakeSnap = async (dashId, dashboardElementId) => {
//     if (snapshots.length >= MAX_SNAPSHOTS) {
//       alert(`You can keep only ${MAX_SNAPSHOTS} snapshots. Please delete one before creating a new snapshot.`);
//       return;
//     }
//     setIsTakingSnapshot(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Please log in to take a snapshot.");
//       const element = document.getElementById(dashboardElementId);
//       if (!element) throw new Error(`Element '${dashboardElementId}' not found`);
//       const clone = element.cloneNode(true);
//       document.body.appendChild(clone);
//       clone.style.visibility = "visible";
//       clone.style.position = "absolute";
//       clone.style.top = "-9999px";
//       clone.style.left = "-9999px";
//       clone.style.background = "#fff";
//       clone.style.color = "#000";
//       const stylesheets = clone.querySelectorAll('style, link[rel="stylesheet"]');
//       stylesheets.forEach(sheet => sheet.remove());
//       const allElements = clone.querySelectorAll('*');
//       allElements.forEach(el => {
//         const computed = window.getComputedStyle(el);
//         el.style.backgroundColor = computed.backgroundColor.includes('oklch') ? '#ffffff' : computed.backgroundColor;
//         el.style.color = computed.color.includes('oklch') ? '#000000' : computed.color;
//         el.style.borderColor = computed.borderColor.includes('oklch') ? '#000000' : computed.borderColor;
//       });
//       await new Promise((r) => setTimeout(r, 200));
//       const canvas = await html2canvas(clone, {
//         backgroundColor: "#ffffff",
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });
//       document.body.removeChild(clone);
//       const base64 = canvas.toDataURL("image/png");
//       if (!base64 || base64.length < 100) {
//         throw new Error("Generated screenshot is invalid or empty.");
//       }
//       const snapshotTime = new Date().toISOString();
//       const dashboard = dashboards.find((d) => d.dashId === dashId);
//       const plots = {
//         portfolioPlots: dashboard?.plots?.portfolioPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.companyName || "Unknown Company",
//           dash_port_id: p.dash_port_id,
//         })) || [],
//         equityHubPlots: dashboard?.plots?.equityHubPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.symbol || "Unknown Company",
//           dash_equity_hub_id: p.dash_equity_hub_id,
//         })) || [],
//       };
//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ screenshot: base64, createdAt: snapshotTime }),
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       const newSnapshot = {
//         dashId,
//         dashboardName: dashboard?.dashboardName || "Unnamed Dashboard",
//         screenshotPath: data.screenshotPath,
//         createdAt: data.createdAt || snapshotTime,
//         plots,
//       };
//       setSnapshots((prev) => {
//         const filtered = prev.filter((s) => s.dashId !== dashId);
//         return [...filtered, newSnapshot];
//       });
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId
//             ? { ...dash, qrCode: data.qrCode, screenshotPath: data.screenshotPath }
//             : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({
//           ...prev,
//           qrCode: data.qrCode,
//           screenshotPath: data.screenshotPath,
//         }));
//       }
//       await fetchScreenshot(dashId, data.screenshotPath);
//       setSnapshotSuccessMsg("Snapshot taken successfully!");
//       setTimeout(() => setSnapshotSuccessMsg(""), 3000);
//     } catch (err) {
//       console.error("Snapshot error:", err);
//       setError(err.message);
//     } finally {
//       setIsTakingSnapshot(false);
//     }
//   };

//   const openLightbox = (src) => {
//     setLightboxImg(src);
//     setLightboxOpen(true);
//   };

//   const closeLightbox = () => setLightboxOpen(false);

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Cmp = map[plot.graph_type];
//     if (!Cmp) return <p className="text-red-500">Component not found</p>;
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Cmp uploadId={plot.upload_id} />
//       </GraphDataProvider>
//     ) : (
//       <Cmp symbol={plot.symbol} />
//     );
//   };

//   const navItems = [
//     {
//       label: "Dashboard",
//       icon: <FiHome />,
//       onClick: () => {
//         setActiveTab("dashboards");
//         navigate("/dashboard");
//       },
//     },
//     {
//       label: "Saved Dashboard",
//       icon: <FiHome />,
//       onClick: () => {
//         setActiveTab("savedDashboard");
//         navigate("/savedDashboard");
//       },
//     },
//     {
//       label: "Snapshots",
//       icon: <FiCopy />,
//       onClick: () => setActiveTab("snapshots"),
//     },
//   ];

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   };

//   const handleViewDashboard = (dashboard) => {
//     setSelectedDashboard(dashboard);
//   };

//   const handleBackToList = () => {
//     setSelectedDashboard(null);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-sky-900 dark:bg-slate-800">
//       <aside
//         className={`${collapsed ? "w-20" : "w-64"} bg-black text-white flex flex-col justify-between shadow-xl transition-all duration-300`}
//       >
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text">
//                 #CMD<span className="text-sky-500">A</span>
//                 <span className="text-white">Dashboard</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-white text-2xl"
//             >
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon, onClick }) => (
//               <button
//                 key={label}
//                 onClick={onClick}
//                 className={`w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-sky-900 transition cursor-pointer text-sm font-medium ${
//                   (label === "Snapshots" && activeTab === "snapshots") ||
//                   (label === "Saved Dashboard" && activeTab === "savedDashboard") ||
//                   (label === "Dashboard" && activeTab === "dashboards")
//                     ? "bg-sky-900"
//                     : ""
//                 }`}
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-white">
//           <button className="w-full bg-sky-900 text-white hover:bg-sky-900 py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//       <main
//         className={`flex-1 bg-sky-900 dark:bg-sky-900 overflow-y-auto p-8 ${isTakingSnapshot ? "pointer-events-none" : ""}`}
//         style={{ position: "relative" }}
//       >
//         {isTakingSnapshot && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//             <div className="flex flex-col items-center gap-4">
//               <div className="snapshot-spinner"></div>
//               <div className="text-white text-lg font-semibold">Generating your snapshot...</div>
//             </div>
//           </div>
//         )}

//         {snapshotSuccessMsg && (
//           <div className="fixed inset-0 flex items-center justify-center z-50">
//             <div className="bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
//               {snapshotSuccessMsg}
//             </div>
//           </div>
//         )}

//         {lightboxOpen && (
//           <div
//             className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center"
//             onClick={closeLightbox}
//           >
//             <div
//               className="relative max-h-[90vh] max-w-[90vw]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={lightboxImg}
//                 alt="snapshot lightbox"
//                 className="rounded shadow-xl max-h-[90vh] max-w-full object-contain"
//               />
//               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
//                 <button
//                   onClick={closeLightbox}
//                   className="p-3 rounded-full bg-white/80 hover:bg-white text-black shadow"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-400 to-white">
//             {activeTab === "dashboards" ? (selectedDashboard ? selectedDashboard.dashboardName : "Saved Dashboards") : "Snapshots"}
//           </h2>
//           {selectedDashboard && (
//             <button
//               onClick={handleBackToList}
//               className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-600"
//             >
//               Back to List
//             </button>
//           )}
//         </div>

//         {loading ? (
//           <p className="text-white">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : activeTab === "snapshots" ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//             {snapshots.length ? (
//               snapshots.map((snap) => (
//                 <div key={snap.dashId} className="relative p-4 bg-sky-900 rounded-2xl shadow-xl">
//                   <button
//                     onClick={() => handleDeleteSnapshot(snap.dashId)}
//                     className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
//                   >
//                     <FiTrash />
//                   </button>
//                   <h3 className="text-lg font-semibold mb-2 text-white">{snap.dashboardName}</h3>
//                   {snap.screenshotPath ? (
//                     imageErrors[snap.dashId] ? (
//                       <p className="text-red-500">Failed to load image</p>
//                     ) : (
//                       <img
//                         src={imageUrls[snap.dashId]}
//                         alt="snapshot"
//                         className="rounded border cursor-zoom-in hover:opacity-90"
//                         onClick={() => openLightbox(imageUrls[snap.dashId])}
//                         onError={() => setImageErrors((p) => ({ ...p, [snap.dashId]: true }))}
//                       />
//                     )
//                   ) : (
//                     <p className="text-gray-400">No snapshot</p>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-white">No snapshots available.</p>
//             )}
//           </div>
//         ) : selectedDashboard ? (
//           <div id={`dashboard-${selectedDashboard.dashId}`} className="mb-12 p-6 rounded-2xl shadow-xl bg-sky-900">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-2xl font-bold text-white">{selectedDashboard.dashboardName}</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleTakeSnap(selectedDashboard.dashId, `dashboard-${selectedDashboard.dashId}`)}
//                   className="px-4 py-1 bg-sky-700 text-white rounded-full text-sm hover:bg-sky-600 shadow disabled:opacity-60"
//                   disabled={isTakingSnapshot}
//                 >
//                   Take Snap
//                 </button>
//                 {selectedDashboard.screenshotPath && imageUrls[selectedDashboard.dashId] && (
//                   <>
//                     <button
//                       onClick={() => handleDownloadSnapshot(imageUrls[selectedDashboard.dashId], selectedDashboard.dashboardName)}
//                       className="px-4 py-1 bg-slate-200 text-black rounded-full text-sm hover:bg-sky-600 shadow flex items-center gap-2"
//                     >
//                       <HiOutlineDownload /> Download
//                     </button>
//                     <button
//                       onClick={() => openLightbox(selectedDashboard.qrCode)}
//                       className="px-4 py-1 bg-slate-200 text-black rounded-full text-sm hover:bg-sky-600 shadow flex items-center gap-2"
//                     >
//                       <FiShare2 /> Share
//                     </button>
//                   </>
//                 )}
//                 <button
//                   onClick={() => handleDeleteDashboard(selectedDashboard.dashId)}
//                   className="px-4 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 shadow flex items-center gap-1"
//                 >
//                   <FiTrash /> Delete Dashboard
//                 </button>
//               </div>
//             </div>
//             {snapshots.find((s) => s.dashId === selectedDashboard.dashId)?.createdAt && (
//               <p className="text-sm text-sky-200/80 mb-4">
//                 Snapshot Taken: {formatDate(snapshots.find((s) => s.dashId === selectedDashboard.dashId).createdAt)}
//               </p>
//             )}
//             {selectedDashboard.plots?.portfolioPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-white font-semibold mb-4">Portfolio Plots</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.portfolioPlots.map((plot) => (
//                     <div key={plot.dash_port_id} className="p-4 bg-sky-900 rounded-xl shadow relative">
//                       <button
//                         onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                         className="absolute top-2 right-2 text-[#dc2626] hover:text-[#b91c1c] text-lg"
//                       >
//                         Delete
//                       </button>
//                       <h5 className="font-semibold text-white mb-2">{plot.graph_type} - {plot.companyName || "Unknown Company"}</h5>
//                       <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//             {selectedDashboard.plots?.equityHubPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-white font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.equityHubPlots.map((plot) => (
//                     <div key={plot.dash_equity_hub_id} className="p-4 bg-sky-900 rounded-xl shadow relative">
//                       <button
//                         onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                         className="absolute top-2 right-2 text-[#dc2626] hover:text-[#b91c1c] text-lg"
//                       >
//                         Delete
//                       </button>
//                       <h5 className="font-semibold text-white mb-2">{plot.graph_type} - {plot.symbol || "Unknown Company"}</h5>
//                       <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         ) : (
//           <div className="bg-sky-900 rounded-xl shadow-lg overflow-hidden p-1">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-sky-700/50">
//                 <thead className="bg-sky-800/80">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">Dashboard Name</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">ID</th>
//                     {/* <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">Date/Time</th> */}
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-sky-900/50 divide-y divide-sky-700/30">
//                   {dashboards.length > 0 ? (
//                     dashboards.map((dashboard) => (
//                       <tr key={dashboard.dashId} className="hover:bg-sky-800/40 transition-colors duration-150">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-white">{dashboard.dashboardName}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-sky-200/80">{dashboard.dashId}</div>
//                         </td>
//                         {/* <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-sky-200/80">
//                             {dashboard.createdAt ? formatDate(dashboard.createdAt) : "N/A"}
//                           </div>
//                         </td> */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex space-x-3">
//                             <button
//                               onClick={() => handleViewDashboard(dashboard)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
//                               title="View Dashboard"
//                             >
//                               <FiEye className="mr-1.5" /> View
//                             </button>
//                             <button
//                               onClick={() => handleDeleteDashboard(dashboard.dashId)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-rose-600/90 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
//                               title="Delete Dashboard"
//                             >
//                               <FiTrash className="mr-1.5" /> Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-8 text-center">
//                         <div className="flex flex-col items-center justify-center">
//                           <FiInbox className="w-12 h-12 text-sky-700/50 mb-3" />
//                           <span className="text-sm font-medium text-sky-400/70">No dashboards available</span>
//                           <span className="text-xs text-sky-600/50 mt-1">Create your first dashboard to get started</span>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;

// import React, { useEffect, useState, useCallback } from "react";
// import { equityHubMap, portfolioMap } from "./ComponentRegistry";
// import { FiHome, FiLogOut, FiCopy, FiTrash, FiShare2, FiEye, FiInbox } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// import { HiOutlineDownload } from "react-icons/hi";
// import { GraphDataProvider } from "../Portfolio/GraphDataContext";
// import html2canvas from "html2canvas";
// import { useNavigate } from "react-router-dom";

// const MAX_SNAPSHOTS = 5;

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [snapshots, setSnapshots] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboards");
//   const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
//   const [selectedDashboard, setSelectedDashboard] = useState(null);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [lightboxImg, setLightboxImg] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [imageErrors, setImageErrors] = useState({});
//   const navigate = useNavigate();
//   const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState("");

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = `
//       @font-face {
//         font-family: 'Poppins';
//         src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPezSQ.woff2') format('woff2');
//         font-weight: 400;
//         font-style: normal;
//       }
//       * { color: inherit !important; background-color: inherit !important; }
//       .snapshot-spinner {
//         border: 4px solid rgba(255, 255, 255, 0.3);
//         border-top: 4px solid #ffffff;
//         border-radius: 50%;
//         width: 40px;
//         height: 40px;
//         animation: spin 1s linear infinite;
//       }
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//       @keyframes fadeInOut {
//         0% { opacity: 0; transform: translateY(-10px); }
//         10%, 90% { opacity: 1; transform: translateY(0); }
//         100% { opacity: 0; transform: translateY(-10px); }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   useEffect(() => {
//     fetchDashboards();
//     fetchSnapshots();
//     // fetchPortfolioDetails(); // Uncomment if platform is not included in dashboard data
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch dashboards error:", err);
//       setError("Please login to see the dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Optional: Fetch portfolio details to get platform names if not included in dashboard data
//   /*
//   const fetchPortfolioDetails = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) return;
//       const response = await fetch(`${API_BASE}/file/saved`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error(await response.text());
//       const portfolios = await response.json();
//       setDashboards((prev) =>
//         prev.map((dash) => ({
//           ...dash,
//           plots: {
//             ...dash.plots,
//             portfolioPlots: dash.plots.portfolioPlots.map((plot) => {
//               const portfolio = portfolios.find((p) => p.uploadId === plot.upload_id);
//               return { ...plot, platform: portfolio?.platform || "Unknown Platform" };
//             }),
//           },
//         }))
//       );
//     } catch (err) {
//       console.error("Error fetching portfolio details:", err);
//     }
//   };
//   */

//   const fetchSnapshots = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your snapshots.");
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/snapshots`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setSnapshots(data.snapshots || []);
//     } catch (err) {
//       console.error("Fetch snapshots error:", err);
//       setError("Error loading snapshots.");
//     }
//   };

//   const fetchScreenshot = useCallback(
//     async (dashId, screenshotPath) => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const imageUrl = `${API_BASE}/dashboard/image/${screenshotPath}`;
//         const res = await fetch(imageUrl, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error(`status: ${res.status}`);
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         setImageUrls((prev) => ({ ...prev, [dashId]: url }));
//       } catch (err) {
//         console.error(`Failed to fetch screenshot for ${dashId}:`, err);
//         setImageErrors((p) => ({ ...p, [dashId]: true }));
//       }
//     },
//     [API_BASE]
//   );

//   useEffect(() => {
//     [...dashboards, ...snapshots].forEach((item) => {
//       const id = item.dashId;
//       if (!imageUrls[id] && !imageErrors[id] && item.screenshotPath) {
//         fetchScreenshot(id, item.screenshotPath);
//       }
//     });
//   }, [dashboards, snapshots, imageUrls, imageErrors, fetchScreenshot]);

//   const handleDeleteSnapshot = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this snapshot?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to delete snapshot");

//       if (data.message === "No snapshot found for the specified dashboard") {
//         console.warn(`No snapshot found for dashId: ${dashId}`);
//       } else {
//         console.log(`Snapshot deleted successfully for dashId: ${dashId}`);
//       }

//       setSnapshots((prev) => prev.filter((s) => s.dashId !== dashId));
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId ? { ...dash, qrCode: null, screenshotPath: null } : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({ ...prev, qrCode: null, screenshotPath: null }));
//       }
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });

//       const dashboardRes = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const dashboardData = await dashboardRes.json();
//       setDashboards(dashboardData.dashboards || []);
//     } catch (err) {
//       console.error("Snapshot delete error:", err);
//       alert("Failed to delete snapshot: " + err.message);
//     }
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this dashboard?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error(await response.text());
//       setDashboards((prev) => prev.filter((dash) => dash.dashId !== dashId));
//       setSnapshots((prev) => prev.filter((snap) => snap.dashId !== dashId));
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setSelectedDashboard(null);
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   const handleDownloadSnapshot = (imageUrl, dashboardName) => {
//     if (!imageUrl) {
//       alert("No image available to download.");
//       return;
//     }
//     const link = document.createElement("a");
//     link.href = imageUrl;
//     link.download = `${dashboardName || "dashboard"}_snapshot.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleTakeSnap = async (dashId, dashboardElementId) => {
//     if (snapshots.length >= MAX_SNAPSHOTS) {
//       alert(`You can keep only ${MAX_SNAPSHOTS} snapshots. Please delete one before creating a new snapshot.`);
//       return;
//     }
//     setIsTakingSnapshot(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Please log in to take a snapshot.");
//       const element = document.getElementById(dashboardElementId);
//       if (!element) throw new Error(`Element '${dashboardElementId}' not found`);
//       const clone = element.cloneNode(true);
//       document.body.appendChild(clone);
//       clone.style.visibility = "visible";
//       clone.style.position = "absolute";
//       clone.style.top = "-9999px";
//       clone.style.left = "-9999px";
//       clone.style.background = "#fff";
//       clone.style.color = "#000";
//       const stylesheets = clone.querySelectorAll('style, link[rel="stylesheet"]');
//       stylesheets.forEach(sheet => sheet.remove());
//       const allElements = clone.querySelectorAll('*');
//       allElements.forEach(el => {
//         const computed = window.getComputedStyle(el);
//         el.style.backgroundColor = computed.backgroundColor.includes('oklch') ? '#ffffff' : computed.backgroundColor;
//         el.style.color = computed.color.includes('oklch') ? '#000000' : computed.color;
//         el.style.borderColor = computed.borderColor.includes('oklch') ? '#000000' : computed.borderColor;
//       });
//       await new Promise((r) => setTimeout(r, 200));
//       const canvas = await html2canvas(clone, {
//         backgroundColor: "#ffffff",
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });
//       document.body.removeChild(clone);
//       const base64 = canvas.toDataURL("image/png");
//       if (!base64 || base64.length < 100) {
//         throw new Error("Generated screenshot is invalid or empty.");
//       }
//       const snapshotTime = new Date().toISOString();
//       const dashboard = dashboards.find((d) => d.dashId === dashId);

//       // Collect platform names from portfolio plots
//       const platformNames = dashboard?.plots?.portfolioPlots
//         ?.map((p) => p.platform)
//         ?.filter((platform) => platform)
//         ?.join(", ") || "No Platform";

//       const plots = {
//         portfolioPlots: dashboard?.plots?.portfolioPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.companyName,
//           dash_port_id: p.dash_port_id,
//           platform: p.platform || "Unknown Platform",
//         })) || [],
//         equityHubPlots: dashboard?.plots?.equityHubPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.symbol || "Unknown Company",
//           dash_equity_hub_id: p.dash_equity_hub_id,
//         })) || [],
//       };
//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           screenshot: base64,
//           createdAt: snapshotTime,
//           platform: platformNames,
//         }),
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       const newSnapshot = {
//         dashId,
//         dashboardName: dashboard?.dashboardName || "Unnamed Dashboard",
//         screenshotPath: data.screenshotPath,
//         createdAt: data.createdAt || snapshotTime,
//         platform: platformNames,
//         plots,
//       };
//       setSnapshots((prev) => {
//         const filtered = prev.filter((s) => s.dashId !== dashId);
//         return [...filtered, newSnapshot];
//       });
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId
//             ? { ...dash, qrCode: data.qrCode, screenshotPath: data.screenshotPath }
//             : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({
//           ...prev,
//           qrCode: data.qrCode,
//           screenshotPath: data.screenshotPath,
//         }));
//       }
//       await fetchScreenshot(dashId, data.screenshotPath);
//       setSnapshotSuccessMsg("Snapshot taken successfully!");
//       setTimeout(() => setSnapshotSuccessMsg(""), 3000);
//     } catch (err) {
//       console.error("Snapshot error:", err);
//       setError(err.message);
//     } finally {
//       setIsTakingSnapshot(false);
//     }
//   };

//   const openLightbox = (src) => {
//     setLightboxImg(src);
//     setLightboxOpen(true);
//   };

//   const closeLightbox = () => setLightboxOpen(false);

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Cmp = map[plot.graph_type];
//     if (!Cmp) return <p className="text-red-500">Component not found</p>;
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Cmp uploadId={plot.upload_id} />
//       </GraphDataProvider>
//     ) : (
//       <Cmp symbol={plot.symbol} />
//     );
//   };

//   const navItems = [
//     {
//       label: "Dashboard",
//       icon: <FiHome />,
//       onClick: () => {
//         setActiveTab("dashboards");
//         navigate("/dashboard");
//       },
//     },
//     {
//       label: "Saved Dashboard",
//       icon: <FiHome />,
//       onClick: () => {
//         setActiveTab("savedDashboard");
//         navigate("/savedDashboard");
//       },
//     },
//     {
//       label: "Snapshots",
//       icon: <FiCopy />,
//       onClick: () => setActiveTab("snapshots"),
//     },
//   ];

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   };

//   const handleViewDashboard = (dashboard) => {
//     setSelectedDashboard(dashboard);
//   };

//   const handleBackToList = () => {
//     setSelectedDashboard(null);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-sky-900 dark:bg-slate-800">
//       <aside
//         className={`${collapsed ? "w-20" : "w-64"} bg-black text-white flex flex-col justify-between shadow-xl transition-all duration-300`}
//       >
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text">
//                 #CMD<span className="text-sky-500">AH</span>
//                 <span className="text-white">Dashboard</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-white text-2xl"
//             >
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon, onClick }) => (
//               <button
//                 key={label}
//                 onClick={onClick}
//                 className={`w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-sky-900 transition cursor-pointer text-sm font-medium ${
//                   (label === "Snapshots" && activeTab === "snapshots") ||
//                   (label === "Saved Dashboard" && activeTab === "savedDashboard") ||
//                   (label === "Dashboard" && activeTab === "dashboards")
//                     ? "bg-sky-900"
//                     : ""
//                 }`}
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-white">
//           <button className="w-full bg-sky-900 text-white hover:bg-sky-900 py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//       <main
//         className={`flex-1 bg-sky-900 dark:bg-sky-900 overflow-y-auto p-8 ${isTakingSnapshot ? "pointer-events-none" : ""}`}
//         style={{ position: "relative" }}
//       >
//         {isTakingSnapshot && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//             <div className="flex flex-col items-center gap-4">
//               <div className="snapshot-spinner"></div>
//               <div className="text-white text-lg font-semibold">Generating your snapshot...</div>
//             </div>
//           </div>
//         )}

//         {snapshotSuccessMsg && (
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               zIndex: 9999,
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: "#28a745",
//                 color: "#ffffff",
//                 padding: "10px 20px",
//                 borderRadius: "6px",
//                 boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//                 animation: "fadeInOut 3s ease-in-out",
//               }}
//             >
//               {snapshotSuccessMsg}
//             </div>
//           </div>
//         )}

//         {lightboxOpen && (
//           <div
//             className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center"
//             onClick={closeLightbox}
//           >
//             <div
//               className="relative max-h-[90vh] max-w-[90vw]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={lightboxImg}
//                 alt="snapshot lightbox"
//                 className="rounded shadow-xl max-h-[90vh] max-w-full object-contain"
//               />
//               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
//                 <button
//                   onClick={closeLightbox}
//                   className="p-3 rounded-full bg-white/80 hover:bg-white text-black shadow"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-400 to-white">
//             {activeTab === "dashboards"
//               ? selectedDashboard
//                 ? `${selectedDashboard.dashboardName} ${
//                     selectedDashboard.plots?.portfolioPlots?.length > 0
//                       ? `(${selectedDashboard.plots.portfolioPlots
//                           .map((p) => p.platform)
//                           .filter((p) => p)
//                           .join(", ") || "No Platform"})`
//                       : ""
//                   }`
//                 : "Saved Dashboards"
//               : "Snapshots"}
//           </h2>
//           {selectedDashboard && (
//             <button
//               onClick={handleBackToList}
//               className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-600"
//             >
//               Back to List
//             </button>
//           )}
//         </div>

//         {loading ? (
//           <p className="text-white">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : activeTab === "snapshots" ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//             {snapshots.length ? (
//               snapshots.map((snap) => (
//                 <div key={snap.dashId} className="relative p-4 bg-sky-900 rounded-2xl shadow-xl">
//                   <button
//                     onClick={() => handleDeleteSnapshot(snap.dashId)}
//                     className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
//                   >
//                     <FiTrash />
//                   </button>
//                   <h3 className="text-lg font-semibold mb-2 text-white">
//                     {snap.dashboardName} {snap.platform ? `(${snap.platform})` : ""}
//                   </h3>
//                   {snap.screenshotPath ? (
//                     imageErrors[snap.dashId] ? (
//                       <p className="text-red-500">Failed to load image</p>
//                     ) : (
//                       <img
//                         src={imageUrls[snap.dashId]}
//                         alt="snapshot"
//                         className="rounded border cursor-zoom-in hover:opacity-90"
//                         onClick={() => openLightbox(imageUrls[snap.dashId])}
//                         onError={() => setImageErrors((p) => ({ ...p, [snap.dashId]: true }))}
//                       />
//                     )
//                   ) : (
//                     <p className="text-gray-400">No snapshot</p>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-white">No snapshots available.</p>
//             )}
//           </div>
//         ) : selectedDashboard ? (
//           <div id={`dashboard-${selectedDashboard.dashId}`} className="mb-12 p-6 rounded-2xl shadow-xl bg-sky-900">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-2xl font-bold text-white">
//                 {selectedDashboard.dashboardName}
//                 {selectedDashboard.plots?.portfolioPlots?.length > 0 &&
//                   ` (${selectedDashboard.plots.portfolioPlots
//                     .map((p) => p.platform)
//                     .filter((p) => p)
//                     .join(", ") || "No Platform"})`}
//               </h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleTakeSnap(selectedDashboard.dashId, `dashboard-${selectedDashboard.dashId}`)}
//                   className="px-4 py-1 bg-sky-700 text-white rounded-full text-sm hover:bg-sky-600 shadow disabled:opacity-60"
//                   disabled={isTakingSnapshot}
//                 >
//                   Take Snap
//                 </button>
//                 {selectedDashboard.screenshotPath && imageUrls[selectedDashboard.dashId] && (
//                   <>
//                     <button
//                       onClick={() =>
//                         handleDownloadSnapshot(imageUrls[selectedDashboard.dashId], selectedDashboard.dashboardName)
//                       }
//                       className="px-4 py-1 bg-slate-200 text-black rounded-full text-sm hover:bg-sky-600 shadow flex items-center gap-2"
//                     >
//                       <HiOutlineDownload /> Download
//                     </button>
//                     <button
//                       onClick={() => openLightbox(selectedDashboard.qrCode)}
//                       className="px-4 py-1 bg-slate-200 text-black rounded-full text-sm hover:bg-sky-600 shadow flex items-center gap-2"
//                     >
//                       <FiShare2 /> Share
//                     </button>
//                   </>
//                 )}
//                 <button
//                   onClick={() => handleDeleteDashboard(selectedDashboard.dashId)}
//                   className="px-4 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 shadow flex items-center gap-1"
//                 >
//                   <FiTrash /> Delete Dashboard
//                 </button>
//               </div>
//             </div>
//             {snapshots.find((s) => s.dashId === selectedDashboard.dashId)?.createdAt && (
//               <p className="text-sm text-sky-200/80 mb-4">
//                 Snapshot Taken: {formatDate(snapshots.find((s) => s.dashId === selectedDashboard.dashId).createdAt)}
//               </p>
//             )}

//             {selectedDashboard.plots?.equityHubPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-white font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.equityHubPlots.map((plot) => (
//                     <div key={plot.dash_equity_hub_id} className="p-4 bg-sky-900 rounded-xl shadow relative">
//                       <h5 className="font-semibold text-white mb-2">
//                         {plot.graph_type} - {plot.symbol || "Unknown Company"}
//                       </h5>
//                       <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {selectedDashboard.plots?.portfolioPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-white font-semibold mb-4">Portfolio Plots</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.portfolioPlots.map((plot) => (
//                     <div key={plot.dash_port_id} className="p-4 bg-sky-900 rounded-xl shadow relative">
//                       <h5 className="font-semibold text-white mb-2">
//                         {plot.graph_type} - {plot.companyName} ({plot.platform || "Unknown Platform"})
//                       </h5>
//                       <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         ) : (
//           <div className="bg-sky-900 rounded-xl shadow-lg overflow-hidden p-1">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-sky-700/50">
//                 <thead className="bg-sky-800/80">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">
//                       Dashboard Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">ID</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-sky-900/50 divide-y divide-sky-700/30">
//                   {dashboards.length > 0 ? (
//                     dashboards.map((dashboard) => (
//                       <tr key={dashboard.dashId} className="hover:bg-sky-800/40 transition-colors duration-150">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-white">
//                             {dashboard.dashboardName}
//                             {dashboard.plots?.portfolioPlots?.length > 0 &&
//                               ` (${dashboard.plots.portfolioPlots
//                                 .map((p) => p.platform)
//                                 .filter((p) => p)
//                                 .join(", ") || "No Platform"})`}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-sky-200/80">{dashboard.dashId}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex space-x-3">
//                             <button
//                               onClick={() => handleViewDashboard(dashboard)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
//                               title="View Dashboard"
//                             >
//                               <FiEye className="mr-1.5" /> View
//                             </button>
//                             <button
//                               onClick={() => handleDeleteDashboard(dashboard.dashId)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-rose-600/90 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
//                               title="Delete Dashboard"
//                             >
//                               <FiTrash className="mr-1.5" /> Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-8 text-center">
//                         <div className="flex flex-col items-center justify-center">
//                           <FiInbox className="w-12 h-12 text-sky-700/50 mb-3" />
//                           <span className="text-sm font-medium text-sky-400/70">No dashboards available</span>
//                           <span className="text-xs text-sky-600/50 mt-1">Create your first dashboard to get started</span>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;


// import React, { useEffect, useState, useCallback } from "react";
// import { equityHubMap, portfolioMap } from "./ComponentRegistry";
// import { FiHome, FiLogOut, FiCopy, FiTrash, FiShare2, FiEye, FiInbox } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// import { HiOutlineDownload } from "react-icons/hi";
// import { GraphDataProvider } from "../Portfolio/GraphDataContext";
// import html2canvas from "html2canvas";
// import { useNavigate } from "react-router-dom";

// const MAX_SNAPSHOTS = 5;

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [snapshots, setSnapshots] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboards");
//   const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
//   const [selectedDashboard, setSelectedDashboard] = useState(null);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [lightboxImg, setLightboxImg] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [imageErrors, setImageErrors] = useState({});
//   const navigate = useNavigate();
//   const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState("");

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = `
//       @font-face {
//         font-family: 'Poppins';
//         src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPezSQ.woff2') format('woff2');
//         font-weight: 400;
//         font-style: normal;
//       }
//       * { color: inherit !important; background-color: inherit !important; }
//       .snapshot-spinner {
//         border: 4px solid rgba(255, 255, 255, 0.3);
//         border-top: 4px solid #ffffff;
//         border-radius: 50%;
//         width: 40px;
//         height: 40px;
//         animation: spin 1s linear infinite;
//       }
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//       @keyframes fadeInOut {
//         0% { opacity: 0; transform: translateY(-10px); }
//         10%, 90% { opacity: 1; transform: translateY(0); }
//         100% { opacity: 0; transform: translateY(-10px); }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   useEffect(() => {
//     fetchDashboards();
//     fetchSnapshots();
//     // fetchPortfolioDetails(); // Uncomment if platform is not included in dashboard data
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch dashboards error:", err);
//       setError("Please login to see the dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Optional: Fetch portfolio details to get platform names if not included in dashboard data
//   /*
//   const fetchPortfolioDetails = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) return;
//       const response = await fetch(`${API_BASE}/file/saved`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error(await response.text());
//       const portfolios = await response.json();
//       setDashboards((prev) =>
//         prev.map((dash) => ({
//           ...dash,
//           plots: {
//             ...dash.plots,
//             portfolioPlots: dash.plots.portfolioPlots.map((plot) => {
//               const portfolio = portfolios.find((p) => p.uploadId === plot.upload_id);
//               return { ...plot, platform: portfolio?.platform || "Unknown Platform" };
//             }),
//           },
//         }))
//       );
//     } catch (err) {
//       console.error("Error fetching portfolio details:", err);
//     }
//   };
//   */

//   const fetchSnapshots = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your snapshots.");
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/snapshots`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setSnapshots(data.snapshots || []);
//     } catch (err) {
//       console.error("Fetch snapshots error:", err);
//       setError("Error loading snapshots.");
//     }
//   };

//   const fetchScreenshot = useCallback(
//     async (dashId, screenshotPath) => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const imageUrl = `${API_BASE}/dashboard/image/${screenshotPath}`;
//         const res = await fetch(imageUrl, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error(`status: ${res.status}`);
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         setImageUrls((prev) => ({ ...prev, [dashId]: url }));
//       } catch (err) {
//         console.error(`Failed to fetch screenshot for ${dashId}:`, err);
//         setImageErrors((p) => ({ ...p, [dashId]: true }));
//       }
//     },
//     [API_BASE]
//   );

//   useEffect(() => {
//     [...dashboards, ...snapshots].forEach((item) => {
//       const id = item.dashId;
//       if (!imageUrls[id] && !imageErrors[id] && item.screenshotPath) {
//         fetchScreenshot(id, item.screenshotPath);
//       }
//     });
//   }, [dashboards, snapshots, imageUrls, imageErrors, fetchScreenshot]);

//   const handleDeleteSnapshot = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this snapshot?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to delete snapshot");

//       if (data.message === "No snapshot found for the specified dashboard") {
//         console.warn(`No snapshot found for dashId: ${dashId}`);
//       } else {
//         alert("Snapshot deleted successfully for dashId")
//         console.log(`Snapshot deleted successfully for dashId: ${dashId}`);
//       }

//       setSnapshots((prev) => prev.filter((s) => s.dashId !== dashId));
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId ? { ...dash, qrCode: null, screenshotPath: null } : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({ ...prev, qrCode: null, screenshotPath: null }));
//       }
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });

//       const dashboardRes = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const dashboardData = await dashboardRes.json();
//       setDashboards(dashboardData.dashboards || []);
//     } catch (err) {
//       console.error("Snapshot delete error:", err);
//       alert("Failed to delete snapshot: " + err.message);
//     }
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this dashboard?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error(await response.text());
//       setDashboards((prev) => prev.filter((dash) => dash.dashId !== dashId));
//       setSnapshots((prev) => prev.filter((snap) => snap.dashId !== dashId));
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setSelectedDashboard(null);
//       alert("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       alert("Failed to delete dashboard");
//     }
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards((prev) =>
//       prev.map((dash) => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//     if (selectedDashboard) {
//       setSelectedDashboard((prev) => ({
//         ...prev,
//         plots: {
//           ...prev.plots,
//           portfolioPlots: isPortfolio
//             ? prev.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
//             : prev.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? prev.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
//             : prev.plots.equityHubPlots,
//         },
//       }));
//     }
//   };

//   const handleDownloadSnapshot = (imageUrl, dashboardName) => {
//     if (!imageUrl) {
//       alert("No image available to download.");
//       return;
//     }
//     const link = document.createElement("a");
//     link.href = imageUrl;
//     link.download = `${dashboardName || "dashboard"}_snapshot.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleTakeSnap = async (dashId, dashboardElementId) => {
//     if (snapshots.length >= MAX_SNAPSHOTS) {
//       alert(`You can keep only ${MAX_SNAPSHOTS} snapshots. Please delete one before creating a new snapshot.`);
//       return;
//     }
//     setIsTakingSnapshot(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Please log in to take a snapshot.");
//       const element = document.getElementById(dashboardElementId);
//       if (!element) throw new Error(`Element '${dashboardElementId}' not found`);
//       const clone = element.cloneNode(true);
//       document.body.appendChild(clone);
//       clone.style.visibility = "visible";
//       clone.style.position = "absolute";
//       clone.style.top = "-9999px";
//       clone.style.left = "-9999px";
//       clone.style.background = "#fff";
//       clone.style.color = "#000";
//       const stylesheets = clone.querySelectorAll('style, link[rel="stylesheet"]');
//       stylesheets.forEach(sheet => sheet.remove());
//       const allElements = clone.querySelectorAll('*');
//       allElements.forEach(el => {
//         const computed = window.getComputedStyle(el);
//         el.style.backgroundColor = computed.backgroundColor.includes('oklch') ? '#ffffff' : computed.backgroundColor;
//         el.style.color = computed.color.includes('oklch') ? '#000000' : computed.color;
//         el.style.borderColor = computed.borderColor.includes('oklch') ? '#000000' : computed.borderColor;
//       });
//       await new Promise((r) => setTimeout(r, 200));
//       const canvas = await html2canvas(clone, {
//         backgroundColor: "#ffffff",
//         width: clone.scrollWidth,
//         height: clone.scrollHeight,
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });
//       document.body.removeChild(clone);
//       const base64 = canvas.toDataURL("image/png");
//       if (!base64 || base64.length < 100) {
//         throw new Error("Generated screenshot is invalid or empty.");
//       }
//       const snapshotTime = new Date().toISOString();
//       const dashboard = dashboards.find((d) => d.dashId === dashId);

//       // Collect platform names from portfolio plots
//       const platformNames = dashboard?.plots?.portfolioPlots
//         ?.map((p) => p.platform)
//         ?.filter((platform) => platform)
//         ?.join(", ") || "No Platform";

//       const plots = {
//         portfolioPlots: dashboard?.plots?.portfolioPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.companyName,
//           dash_port_id: p.dash_port_id,
//           platform: p.platform || "Unknown Platform",
//         })) || [],
//         equityHubPlots: dashboard?.plots?.equityHubPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.symbol || "Unknown Company",
//           dash_equity_hub_id: p.dash_equity_hub_id,
//         })) || [],
//       };
//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           screenshot: base64,
//           createdAt: snapshotTime,
//           platform: platformNames,
//         }),
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       const newSnapshot = {
//         dashId,
//         dashboardName: dashboard?.dashboardName || "Unnamed Dashboard",
//         screenshotPath: data.screenshotPath,
//         createdAt: data.createdAt || snapshotTime,
//         platform: platformNames,
//         plots,
//       };
//       setSnapshots((prev) => {
//         const filtered = prev.filter((s) => s.dashId !== dashId);
//         return [...filtered, newSnapshot];
//       });
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId
//             ? { ...dash, qrCode: data.qrCode, screenshotPath: data.screenshotPath }
//             : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({
//           ...prev,
//           qrCode: data.qrCode,
//           screenshotPath: data.screenshotPath,
//         }));
//       }
//       await fetchScreenshot(dashId, data.screenshotPath);
//       setSnapshotSuccessMsg("Snapshot taken successfully!");
//       setTimeout(() => setSnapshotSuccessMsg(""), 3000);
//     } catch (err) {
//       console.error("Snapshot error:", err);
//       setError(err.message);
//     } finally {
//       setIsTakingSnapshot(false);
//     }
//   };

//   const openLightbox = (src) => {
//     setLightboxImg(src);
//     setLightboxOpen(true);
//   };

//   const closeLightbox = () => setLightboxOpen(false);

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Cmp = map[plot.graph_type];
//     if (!Cmp) return <p className="text-red-500">Component not found</p>;
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Cmp uploadId={plot.upload_id} />
//       </GraphDataProvider>
//     ) : (
//       <Cmp symbol={plot.symbol} />
//     );
//   };

//   const navItems = [
//     {
//       label: "Dashboard",
//       icon: <FiHome />,
//       onClick: () => {
//         setActiveTab("dashboards");
//         navigate("/dashboard");
//       },
//     },
//     {
//       label: "Saved Dashboard",
//       icon: <FiHome />,
//       onClick: () => {
//         setActiveTab("savedDashboard");
//         navigate("/savedDashboard");
//       },
//     },
//     {
//       label: "Snapshots",
//       icon: <FiCopy />,
//       onClick: () => setActiveTab("snapshots"),
//     },
//   ];

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   };

//   const handleViewDashboard = (dashboard) => {
//     setSelectedDashboard(dashboard);
//   };

//   const handleBackToList = () => {
//     setSelectedDashboard(null);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-sky-900 dark:bg-slate-800">
//       <aside
//         className={`${collapsed ? "w-20" : "w-64"} bg-black text-white flex flex-col justify-between shadow-xl transition-all duration-300`}
//       >
//         <div>
//           <div className="flex items-center justify-between p-4">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text">
//                 #CMD<span className="text-sky-500">A</span>
//                 <span className="text-white">Dashboard</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-white text-2xl"
//             >
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon, onClick }) => (
//               <button
//                 key={label}
//                 onClick={onClick}
//                 className={`w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-sky-900 transition cursor-pointer text-sm font-medium ${(label === "Snapshots" && activeTab === "snapshots") ||
//                     (label === "Saved Dashboard" && activeTab === "savedDashboard") ||
//                     (label === "Dashboard" && activeTab === "dashboards")
//                     ? "bg-sky-900"
//                     : ""
//                   }`}
//               >
//                 {icon}
//                 {!collapsed && <span>{label}</span>}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-white">
//           <button className="w-full bg-sky-900 text-white hover:bg-sky-900 py-2 rounded-full flex justify-center items-center gap-2 transition">
//             <FiLogOut /> {!collapsed && "SIGN OUT"}
//           </button>
//         </div>
//       </aside>

//       <main
//         className={`flex-1 bg-sky-900 dark:bg-sky-900 overflow-y-auto p-8 ${isTakingSnapshot ? "pointer-events-none" : ""}`}
//         style={{ position: "relative" }}
//       >
//         {isTakingSnapshot && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//             <div className="flex flex-col items-center gap-4">
//               <div className="snapshot-spinner"></div>
//               <div className="text-white text-lg font-semibold">Generating your snapshot...</div>
//             </div>
//           </div>
//         )}

//         {snapshotSuccessMsg && (
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               zIndex: 9999,
//             }}
//           >
//             <div
//               style={{
//                 backgroundColor: "#28a745",
//                 color: "#ffffff",
//                 padding: "10px 20px",
//                 borderRadius: "6px",
//                 boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//                 animation: "fadeInOut 3s ease-in-out",
//               }}
//             >
//               {snapshotSuccessMsg}
//             </div>
//           </div>
//         )}

//         {lightboxOpen && (
//           <div
//             className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center"
//             onClick={closeLightbox}
//           >
//             <div
//               className="relative max-h-[90vh] max-w-[90vw]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={lightboxImg}
//                 alt="snapshot lightbox"
//                 className="rounded shadow-xl max-h-[90vh] max-w-full object-contain"
//               />
//               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
//                 <button
//                   onClick={closeLightbox}
//                   className="p-3 rounded-full bg-white/80 hover:bg-white text-black shadow"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-400 to-white">
//             {activeTab === "dashboards"
//               ? selectedDashboard
//                 ? `${selectedDashboard.dashboardName} ${selectedDashboard.plots?.portfolioPlots?.length > 0
//                   ? `(${selectedDashboard.plots.portfolioPlots
//                     .map((p) => p.platform)
//                     .filter((p) => p)
//                     .join(", ") || "No Platform"})`
//                   : ""
//                 }`
//                 : "Saved Dashboards"
//               : "Snapshots"}
//           </h2>
//           {selectedDashboard && (
//             <button
//               onClick={handleBackToList}
//               className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-600"
//             >
//               Back to List
//             </button>
//           )}
//         </div>

//         {loading ? (
//           <p className="text-white">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : activeTab === "snapshots" ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//             {snapshots.length ? (
//               snapshots.map((snap) => (
//                 <div key={snap.dashId} className="relative p-4 bg-sky-900 rounded-2xl shadow-xl">
//                   <button
//                     onClick={() => handleDeleteSnapshot(snap.dashId)}
//                     className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
//                   >
//                     <FiTrash />
//                   </button>
//                   <h3 className="text-lg font-semibold mb-2 text-white">
//                     {snap.dashboardName} {snap.platform ? `(${snap.platform})` : ""}
//                   </h3>
//                   {snap.screenshotPath ? (
//                     imageErrors[snap.dashId] ? (
//                       <p className="text-red-500">Failed to load image</p>
//                     ) : (
//                       <img
//                         src={imageUrls[snap.dashId]}
//                         alt="snapshot"
//                         className="rounded border cursor-zoom-in hover:opacity-90"
//                         onClick={() => openLightbox(imageUrls[snap.dashId])}
//                         onError={() => setImageErrors((p) => ({ ...p, [snap.dashId]: true }))}
//                       />
//                     )
//                   ) : (
//                     <p className="text-gray-400">No snapshot</p>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-white">No snapshots available.</p>
//             )}
//           </div>
//         ) : selectedDashboard ? (
//           <div id={`dashboard-${selectedDashboard.dashId}`} className="mb-12 p-6 rounded-2xl shadow-xl bg-sky-900">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-2xl font-bold text-white">
//                 {selectedDashboard.dashboardName}
//                 {selectedDashboard.plots?.portfolioPlots?.length > 0 &&
//                   ` (${selectedDashboard.plots.portfolioPlots
//                     .map((p) => p.platform)
//                     .filter((p) => p)
//                     .join(", ") || "No Platform"})`}
//               </h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleTakeSnap(selectedDashboard.dashId, `dashboard-${selectedDashboard.dashId}`)}
//                   className="px-4 py-1 bg-sky-700 text-white rounded-full text-sm hover:bg-sky-600 shadow disabled:opacity-60"
//                   disabled={isTakingSnapshot}
//                 >
//                   Take Snap
//                 </button>
//                 {selectedDashboard.screenshotPath && imageUrls[selectedDashboard.dashId] && (
//                   <>
//                     <button
//                       onClick={() =>
//                         handleDownloadSnapshot(imageUrls[selectedDashboard.dashId], selectedDashboard.dashboardName)
//                       }
//                       className="px-4 py-1 bg-slate-200 text-black rounded-full text-sm hover:bg-sky-600 shadow flex items-center gap-2"
//                     >
//                       <HiOutlineDownload /> Download
//                     </button>
//                     <button
//                       onClick={() => openLightbox(selectedDashboard.qrCode)}
//                       className="px-4 py-1 bg-slate-200 text-black rounded-full text-sm hover:bg-sky-600 shadow flex items-center gap-2"
//                     >
//                       <FiShare2 /> Share
//                     </button>
//                   </>
//                 )}
//                 <button
//                   onClick={() => handleDeleteDashboard(selectedDashboard.dashId)}
//                   className="px-4 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 shadow flex items-center gap-1"
//                 >
//                   <FiTrash /> Delete Dashboard
//                 </button>
//               </div>
//             </div>
//             {snapshots.find((s) => s.dashId === selectedDashboard.dashId)?.createdAt && (
//               <p className="text-sm text-sky-200/80 mb-4">
//                 Snapshot Taken: {formatDate(snapshots.find((s) => s.dashId === selectedDashboard.dashId).createdAt)}
//               </p>
//             )}

//             {selectedDashboard.plots?.equityHubPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-white font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.equityHubPlots.map((plot) => (
//                     <div key={plot.dash_equity_hub_id} className="p-4 bg-sky-900 rounded-xl shadow relative">
//                       <h5 className="font-semibold text-white mb-2">
//                         {plot.graph_type} - {plot.symbol || "Unknown Company"}
//                       </h5>
//                       <button
//                         onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                         className="absolute top-2 right-2 text-[#dc2626] hover:text-[#b91c1c] text-lg"
//                       >
//                         ✕
//                       </button>
//                       <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {selectedDashboard.plots?.portfolioPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-white font-semibold mb-4">Portfolio Plots</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.portfolioPlots.map((plot) => (
//                     <div key={plot.dash_port_id} className="p-4 bg-sky-900 rounded-xl shadow relative">
//                       <h5 className="font-semibold text-white mb-2">
//                         {plot.graph_type} - {plot.companyName} ({plot.platform || "Unknown Platform"})
//                       </h5>
//                       <button
//                         onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                         className="absolute top-2 right-2 text-[#dc2626] hover:text-[#b91c1c] text-lg"
//                       >
//                         ✕
//                       </button>
//                       <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         ) : (
//           <div className="bg-sky-900 rounded-xl shadow-lg overflow-hidden p-1">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-sky-700/50">
//                 <thead className="bg-sky-800/80">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">
//                       Dashboard Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">ID</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-sky-100 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-sky-900/50 divide-y divide-sky-700/30">
//                   {dashboards.length > 0 ? (
//                     dashboards.map((dashboard) => (
//                       <tr key={dashboard.dashId} className="hover:bg-sky-800/40 transition-colors duration-150">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-white">
//                             {dashboard.dashboardName}
//                             {dashboard.plots?.portfolioPlots?.length > 0 &&
//                               ` (${dashboard.plots.portfolioPlots
//                                 .map((p) => p.platform)
//                                 .filter((p) => p)
//                                 .join(", ") || "No Platform"})`}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-sky-200/80">{dashboard.dashId}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex space-x-3">
//                             <button
//                               onClick={() => handleViewDashboard(dashboard)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
//                               title="View Dashboard"
//                             >
//                               <FiEye className="mr-1.5" /> View
//                             </button>
//                             <button
//                               onClick={() => handleDeleteDashboard(dashboard.dashId)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-rose-600/90 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
//                               title="Delete Dashboard"
//                             >
//                               <FiTrash className="mr-1.5" /> Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-8 text-center">
//                         <div className="flex flex-col items-center justify-center">
//                           <FiInbox className="w-12 h-12 text-sky-700/50 mb-3" />
//                           <span className="text-sm font-medium text-sky-400/70">No dashboards available</span>
//                           <span className="text-xs text-sky-600/50 mt-1">Create your first dashboard to get started</span>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;


// import React, { useEffect, useState, useCallback } from "react";
// import { equityHubMap, portfolioMap } from "./ComponentRegistry";
// import { FiHome, FiLogOut, FiCopy, FiTrash, FiShare2, FiEye, FiInbox, FiChevronLeft } from "react-icons/fi";
// import { IoMenu } from "react-icons/io5";
// import { HiOutlineDownload } from "react-icons/hi";
// import { LuSaveAll } from "react-icons/lu";
// import { BsSun, BsMoon } from "react-icons/bs"; // Icons for theme toggle
// import { GraphDataProvider } from "../Portfolio/GraphDataContext";
// import * as htmlToImage from "html-to-image";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { MdDashboard } from "react-icons/md";

// const MAX_SNAPSHOTS = 5;

// const SavedDashboard = () => {
//   const [dashboards, setDashboards] = useState([]);
//   const [snapshots, setSnapshots] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [collapsed, setCollapsed] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboards");
//   const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
//   const [selectedDashboard, setSelectedDashboard] = useState(null);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [lightboxImg, setLightboxImg] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [imageErrors, setImageErrors] = useState({});
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "system"); // Track theme
//   const navigate = useNavigate();
//   const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState("");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // Handle system theme detection and manual theme toggle
//   useEffect(() => {
//     const applyTheme = () => {
//       const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//       const selectedTheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
//       document.documentElement.classList.toggle("dark", selectedTheme === "dark");
//       localStorage.setItem("theme", theme);
//     };

//     applyTheme();

//     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//     const handleChange = () => {
//       if (theme === "system") applyTheme();
//     };

//     mediaQuery.addEventListener("change", handleChange);
//     return () => mediaQuery.removeEventListener("change", handleChange);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prev) => {
//       const newTheme = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
//       return newTheme;
//     });
//   };

//   // Add font and styles
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = `
//       @font-face {
//         font-family: 'Poppins';
//         src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPezSQ.woff2') format('woff2');
//         font-weight: 400;
//         font-style: normal;
//       }
//       .snapshot-spinner {
//         border: 4px solid rgba(255, 255, 255, 0.3);
//         border-top: 4px solid #ffffff;
//         border-radius: 50%;
//         width: 32px;
//         height: 32px;
//         animation: spin 1s linear infinite;
//       }
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
//       @keyframes fadeInOut {
//         0% { opacity: 0; transform: translateY(-10px); }
//         10%, 90% { opacity: 1; transform: translateY(0); }
//         100% { opacity: 0; transform: translateY(-10px); }
//       }
//       .dashboard-card {
//         transition: all 0.3s ease;
//       }
//       .dashboard-card:hover {
//         transform: translateY(-5px);
//         box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
//       }
//       .glass-effect {
//         background: rgba(255, 255, 255, 0.1);
//         backdrop-filter: blur(10px);
//         -webkit-backdrop-filter: blur(10px);
//       }
//       .dark .glass-effect {
//         background: rgba(15, 23, 42, 0.7);
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   useEffect(() => {
//     fetchDashboards();
//     fetchSnapshots();
//   }, []);

//   const fetchDashboards = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your dashboard.");
//         setLoading(false);
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setDashboards(data.dashboards || []);
//     } catch (err) {
//       console.error("Fetch dashboards error:", err);
//       setError("Please login to see the dashboards.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSnapshots = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         setError("Please log in to view your snapshots.");
//         return;
//       }
//       const res = await fetch(`${API_BASE}/dashboard/snapshots`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       setSnapshots(data.snapshots || []);
//     } catch (err) {
//       console.error("Fetch snapshots error:", err);
//       setError("Error loading snapshots.");
//     }
//   };

//   const fetchScreenshot = useCallback(
//     async (dashId, screenshotPath) => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const imageUrl = `${API_BASE}/dashboard/image/${screenshotPath}`;
//         const res = await fetch(imageUrl, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error(`status: ${res.status}`);
//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         setImageUrls((prev) => ({ ...prev, [dashId]: url }));
//       } catch (err) {
//         console.error(`Failed to fetch screenshot for ${dashId}:`, err);
//         setImageErrors((p) => ({ ...p, [dashId]: true }));
//       }
//     },
//     [API_BASE]
//   );

//   useEffect(() => {
//     [...dashboards, ...snapshots].forEach((item) => {
//       const id = item.dashId;
//       if (!imageUrls[id] && !imageErrors[id] && item.screenshotPath) {
//         fetchScreenshot(id, item.screenshotPath);
//       }
//     });
//   }, [dashboards, snapshots, imageUrls, imageErrors, fetchScreenshot]);

//   const handleDeleteSnapshot = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this snapshot?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to delete snapshot");

//       setSnapshots((prev) => prev.filter((s) => s.dashId !== dashId));
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId ? { ...dash, qrCode: null, screenshotPath: null } : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({ ...prev, qrCode: null, screenshotPath: null }));
//       }
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });

//       const dashboardRes = await fetch(`${API_BASE}/dashboard/fetch`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const dashboardData = await dashboardRes.json();
//       setDashboards(dashboardData.dashboards || []);
//       toast.success("Snapshot deleted successfully");
//     } catch (err) {
//       console.error("Snapshot delete error:", err);
//       toast.error("Failed to delete snapshot: " + err.message);
//     }
//   };

//   const handleDeleteDashboard = async (dashId) => {
//     if (!window.confirm("Are you sure you want to delete this dashboard?")) return;
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error(await response.text());
//       setDashboards((prev) => prev.filter((dash) => dash.dashId !== dashId));
//       setSnapshots((prev) => prev.filter((snap) => snap.dashId !== dashId));
//       setImageUrls((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setImageErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[dashId];
//         return copy;
//       });
//       setSelectedDashboard(null);
//       toast.success("Dashboard deleted successfully");
//     } catch (err) {
//       console.error("Dashboard delete error:", err);
//       toast.error("Failed to delete dashboard");
//     }
//   };

//   const handleDeletePlot = (plotId, isPortfolio) => {
//     setDashboards((prev) =>
//       prev.map((dash) => ({
//         ...dash,
//         plots: {
//           ...dash.plots,
//           portfolioPlots: isPortfolio
//             ? dash.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
//             : dash.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? dash.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
//             : dash.plots.equityHubPlots,
//         },
//       }))
//     );
//     if (selectedDashboard) {
//       setSelectedDashboard((prev) => ({
//         ...prev,
//         plots: {
//           ...prev.plots,
//           portfolioPlots: isPortfolio
//             ? prev.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
//             : prev.plots.portfolioPlots,
//           equityHubPlots: !isPortfolio
//             ? prev.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
//             : prev.plots.equityHubPlots,
//         },
//       }));
//     }
//   };

//   const handleDownloadSnapshot = (imageUrl, dashboardName) => {
//     if (!imageUrl) {
//       toast.error("No image available to download.");
//       return;
//     }
//     const link = document.createElement("a");
//     link.href = imageUrl;
//     link.download = `${dashboardName || "dashboard"}_snapshot.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleTakeSnap = async (dashId, dashboardElementId) => {
//     if (snapshots.length >= MAX_SNAPSHOTS) {
//       toast.error(`You can keep only ${MAX_SNAPSHOTS} snapshots. Please delete one before creating a new snapshot.`);
//       return;
//     }
//     setIsTakingSnapshot(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("Please log in to take a snapshot.");
//       const element = document.getElementById(dashboardElementId);
//       if (!element) throw new Error(`Element '${dashboardElementId}' not found`);

//       const base64 = await htmlToImage.toPng(element, {
//         backgroundColor: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
//         pixelRatio: window.innerWidth < 640 ? 1 : 2,
//         cacheBust: true,
//         skipFonts: true,
//       });

//       if (!base64 || base64.length < 100) {
//         throw new Error("Generated screenshot is invalid or empty.");
//       }

//       const snapshotTime = new Date().toISOString();
//       const dashboard = dashboards.find((d) => d.dashId === dashId);

//       const platformNames = dashboard?.plots?.portfolioPlots
//         ?.map((p) => p.platform)
//         ?.filter((platform) => platform)
//         ?.join(", ") || "No Platform";

//       const plots = {
//         portfolioPlots: dashboard?.plots?.portfolioPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.companyName,
//           dash_port_id: p.dash_port_id,
//           platform: p.platform || "Unknown Platform",
//         })) || [],
//         equityHubPlots: dashboard?.plots?.equityHubPlots?.map((p) => ({
//           graph_type: p.graph_type,
//           companyName: p.symbol || "Unknown Company",
//           dash_equity_hub_id: p.dash_equity_hub_id,
//         })) || [],
//       };

//       const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           screenshot: base64,
//           createdAt: snapshotTime,
//           platform: platformNames,
//         }),
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const data = await res.json();
//       const newSnapshot = {
//         dashId,
//         dashboardName: dashboard?.dashboardName || "Unnamed Dashboard",
//         screenshotPath: data.screenshotPath,
//         createdAt: data.createdAt || snapshotTime,
//         platform: platformNames,
//         plots,
//       };
//       setSnapshots((prev) => {
//         const filtered = prev.filter((s) => s.dashId !== dashId);
//         return [...filtered, newSnapshot];
//       });
//       setDashboards((prev) =>
//         prev.map((dash) =>
//           dash.dashId === dashId
//             ? { ...dash, qrCode: data.qrCode, screenshotPath: data.screenshotPath }
//             : dash
//         )
//       );
//       if (selectedDashboard && selectedDashboard.dashId === dashId) {
//         setSelectedDashboard((prev) => ({
//           ...prev,
//           qrCode: data.qrCode,
//           screenshotPath: data.screenshotPath,
//         }));
//       }
//       await fetchScreenshot(dashId, data.screenshotPath);
//       setSnapshotSuccessMsg("Snapshot taken successfully!");
//       setTimeout(() => setSnapshotSuccessMsg(""), 3000);
//     } catch (err) {
//       console.error("Snapshot error:", err);
//       toast.error(err.message);
//     } finally {
//       setIsTakingSnapshot(false);
//     }
//   };

//   const openLightbox = (src) => {
//     setLightboxImg(src);
//     setLightboxOpen(true);
//   };

//   const closeLightbox = () => setLightboxOpen(false);

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Cmp = map[plot.graph_type];
//     if (!Cmp) return <p className="text-red-500">Component not found</p>;
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Cmp
//           uploadId={plot.upload_id || null} // Fixed: Use plot.upload_id with fallback
//           key={`portfolio-${plot.dash_port_id}-${plot.upload_id || "no-upload-id"}`}
//         />
//       </GraphDataProvider>
//     ) : (
//       <Cmp symbol={plot.symbol} key={`equity-${plot.dash_equity_hub_id}-${plot.symbol}`} />
//     );
//   };

//   const navItems = [
//     {
//       label: "Home",
//       icon: <FiHome className="text-lg" />,
//       onClick: () => {
//         setActiveTab("home");
//         navigate("/");
//       },
//     },
//     {
//       label: "Dashboard",
//       // icon: <FiHome className="text-lg" />,
//       icon: <MdDashboard className="text-lg" />,
//       onClick: () => {
//         setActiveTab("dashboards");
//         navigate("/dashboard");
//       },
//     },
//     {
//       label: "Saved Dashboard",
//       icon: <LuSaveAll className="text-lg" />,
//       onClick: () => {
//         setActiveTab("savedDashboard");
//         navigate("/savedDashboard");
//       },
//     },
//     {
//       label: "Snapshots",
//       icon: <FiCopy className="text-lg" />,
//       onClick: () => setActiveTab("snapshots"),
//     },
//   ];

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//   };

//   const handleViewDashboard = (dashboard) => {
//     setSelectedDashboard(dashboard);
//   };

//   const handleBackToList = () => {
//     setSelectedDashboard(null);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
//       {/* Sidebar */}
//       <aside
//         className={`${collapsed ? "w-20" : "w-64"} bg-white dark:bg-slate-900 text-gray-900 dark:text-white flex flex-col justify-between shadow-xl transition-all duration-300 border-r border-gray-200 dark:border-slate-700`}
//       >
//         <div>
//           <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
//             {!collapsed && (
//               <div className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">
//                 #CMD<span className="text-sky-500">A</span>
//                 <span className="text-gray-900 dark:text-white">Dashboard</span>
//               </div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white text-2xl transition-colors"
//             >
//               <IoMenu />
//             </button>
//           </div>
//           <nav className="mt-4 space-y-1 px-2">
//             {navItems.map(({ label, icon, onClick }) => (
//               <button
//                 key={label}
//                 onClick={onClick}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-sm font-medium ${(label === "Snapshots" && activeTab === "snapshots") ||
//                   (label === "Saved Dashboard" && activeTab === "savedDashboard") ||
//                   (label === "Dashboard" && activeTab === "dashboards")
//                   ? "bg-gray-100 dark:bg-slate-800 text-sky-500 dark:text-sky-400"
//                   : "text-gray-600 dark:text-slate-300"
//                   }`}
//               >
//                 <span className={`${!collapsed ? "mr-2" : "mx-auto"}`}>{icon}</span>
//                 {!collapsed && <span>{label}</span>}
//               </button>
//             ))}
//             <button
//               onClick={toggleTheme}
//               className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-sm font-medium text-gray-600 dark:text-slate-300"
//             >
//               <span className={`${!collapsed ? "mr-2" : "mx-auto"}`}>
//                 {theme === "light" ? <BsMoon className="text-lg" /> : <BsSun className="text-lg" />}
//               </span>
//               {!collapsed && <span>{theme === "light" ? "Dark Mode" : theme === "dark" ? "Light Mode" : "System Theme"}</span>}
//             </button>
//           </nav>
//         </div>
//         {/* <div className="p-4 border-t border-gray-200 dark:border-slate-700">
//           <button className="w-full bg-gradient-to-r from-sky-600 to-sky-700 text-white hover:from-sky-700 hover:to-sky-800 py-2.5 rounded-lg flex justify-center items-center gap-2 transition-all shadow-lg">
//             <FiLogOut /> {!collapsed && "Sign Out"}
//           </button>
//         </div> */}
//       </aside>

//       {/* Main Content */}
//       <main
//         className={`flex-1 overflow-y-auto p-6 ${isTakingSnapshot ? "pointer-events-none" : ""}`}
//         style={{ position: "relative" }}
//       >
//         {isTakingSnapshot && (
//           <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
//             <div className="flex flex-col items-center gap-4">
//               <div className="snapshot-spinner"></div>
//               <div className="text-white text-lg font-semibold animate-pulse">
//                 Generating your snapshot...
//               </div>
//             </div>
//           </div>
//         )}

//         {snapshotSuccessMsg && (
//           <div
//             className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
//             style={{
//               animation: "fadeInOut 3s ease-in-out",
//             }}
//           >
//             <div className="bg-sky-600 text-white px-6 py-3 rounded-lg shadow-lg font-medium">
//               {snapshotSuccessMsg}
//             </div>
//           </div>
//         )}

//         {lightboxOpen && (
//           <div
//             className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
//             onClick={closeLightbox}
//           >
//             <div
//               className="relative max-h-[90vh] max-w-[90vw]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={lightboxImg}
//                 alt="snapshot lightbox"
//                 className="rounded-lg shadow-2xl max-h-[90vh] max-w-full object-contain border-4 border-white/20"
//               />
//               <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 flex gap-4">
//                 <button
//                   onClick={closeLightbox}
//                   className="p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 dark:text-slate-900 shadow-lg transition-all hover:scale-110"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Header Section */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">
//               {activeTab === "dashboards"
//                 ? selectedDashboard
//                   ? `${selectedDashboard.dashboardName}`
//                   : "Saved Dashboards"
//                 : "Snapshots"}
//             </h2>
//             {selectedDashboard && (
//               <p className="text-gray-600 dark:text-slate-400 mt-1">
//                 {selectedDashboard.plots?.portfolioPlots?.length || 0} portfolio plots •{" "}
//                 {selectedDashboard.plots?.equityHubPlots?.length || 0} equity plots
//               </p>
//             )}
//           </div>
//           {selectedDashboard ? (
//             <button
//               onClick={handleBackToList}
//               className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-900 dark:text-slate-200 rounded-lg transition-all border border-gray-300 dark:border-slate-700"
//             >
//               <FiChevronLeft /> Back to List
//             </button>
//           ) : (
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setActiveTab("dashboards")}
//                 className={`px-4 py-2 rounded-lg transition-all ${activeTab === "dashboards"
//                   ? "bg-sky-600 text-white"
//                   : "bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-700"
//                   }`}
//               >
//                 Dashboards
//               </button>
//               <button
//                 onClick={() => setActiveTab("snapshots")}
//                 className={`px-4 py-2 rounded-lg transition-all ${activeTab === "snapshots"
//                   ? "bg-sky-600 text-white"
//                   : "bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-700"
//                   }`}
//               >
//                 Snapshots
//               </button>
//             </div>
//           )}
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-300">
//             {error}
//           </div>
//         ) : activeTab === "snapshots" ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {snapshots.length ? (
//               snapshots.map((snap) => (
//                 <div
//                   key={snap.dashId}
//                   className="dashboard-card relative p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 overflow-hidden group"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-sky-100/30 dark:from-sky-900/30 to-gray-50/50 dark:to-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                   <button
//                     onClick={() => handleDeleteSnapshot(snap.dashId)}
//                     className="absolute top-3 right-3 z-10 p-1.5 bg-gray-200/80 dark:bg-slate-800/80 hover:bg-red-600/90 text-gray-900 dark:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
//                   >
//                     <FiTrash className="text-sm" />
//                   </button>
//                   <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white truncate">
//                     {snap.dashboardName} {snap.platform && <span className="text-gray-600 dark:text-slate-400 text-sm">({snap.platform})</span>}
//                   </h3>
//                   {/* <p className="text-xs text-gray-600 dark:text-slate-400 mb-3">
//                     {formatDate(snap.createdAt)}
//                   </p> */}
//                   {snap.screenshotPath ? (
//                     imageErrors[snap.dashId] ? (
//                       <div className="bg-gray-100 dark:bg-slate-800/50 rounded flex items-center justify-center h-40 text-gray-500 dark:text-slate-500">
//                         Failed to load image
//                       </div>
//                     ) : (
//                       <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
//                         <img
//                           src={imageUrls[snap.dashId]}
//                           alt="snapshot"
//                           className="w-full h-auto cursor-zoom-in hover:opacity-90 transition-opacity"
//                           onClick={() => openLightbox(imageUrls[snap.dashId])}
//                           onError={() => setImageErrors((p) => ({ ...p, [snap.dashId]: true }))}
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
//                           <div className="flex gap-2 w-full">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDownloadSnapshot(imageUrls[snap.dashId], snap.dashboardName);
//                               }}
//                               className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-200/90 dark:bg-slate-800/90 hover:bg-gray-300/90 dark:hover:bg-slate-700/90 text-gray-900 dark:text-white rounded text-xs transition-all"
//                             >
//                               <HiOutlineDownload className="text-sm" /> Download
//                             </button>
//                             {/* <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 openLightbox(snap.qrCode);
//                               }}
//                               className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-200/90 dark:bg-slate-800/90 hover:bg-sky-600/90 text-gray-900 dark:text-white rounded text-xs transition-all"
//                             >
//                               <FiShare2 className="text-sm" /> Share
//                             </button> */}
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   ) : (
//                     <div className="bg-gray-100 dark:bg-slate-800/50 rounded flex items-center justify-center h-40 text-gray-500 dark:text-slate-500">
//                       No snapshot available
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
//                 <FiInbox className="w-16 h-16 text-gray-400 dark:text-slate-600 mb-4" />
//                 <h3 className="text-xl font-medium text-gray-700 dark:text-slate-300 mb-2">No snapshots yet</h3>
//                 <p className="text-gray-500 dark:text-slate-500 max-w-md">
//                   Take snapshots of your dashboards to save them here for future reference.
//                 </p>
//               </div>
//             )}
//           </div>
//         ) : selectedDashboard ? (
//           <div
//             id={`dashboard-${selectedDashboard.dashId}`}
//             className="mb-12 p-6 rounded-xl shadow-lg glass-effect border border-gray-200 dark:border-slate-700"
//           >
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {selectedDashboard.dashboardName}
//                 </h3>
//                 {snapshots.find((s) => s.dashId === selectedDashboard.dashId)?.createdAt && (
//                   <p className="text-sm text-sky-500 dark:text-sky-400/80 mt-1">
//                     Last Snapshot: {formatDate(snapshots.find((s) => s.dashId === selectedDashboard.dashId).createdAt)}
//                   </p>
//                 )}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   onClick={() => handleTakeSnap(selectedDashboard.dashId, `dashboard-${selectedDashboard.dashId}`)}
//                   className="px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-lg text-sm font-medium shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
//                   disabled={isTakingSnapshot}
//                 >
//                   {isTakingSnapshot ? (
//                     <>
//                       <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                       Taking...
//                     </>
//                   ) : (
//                     <>
//                       <FiCopy /> Take Snap
//                     </>
//                   )}
//                 </button>
//                 {selectedDashboard.screenshotPath && imageUrls[selectedDashboard.dashId] && (
//                   <>
//                     <button
//                       onClick={() =>
//                         handleDownloadSnapshot(imageUrls[selectedDashboard.dashId], selectedDashboard.dashboardName)
//                       }
//                       className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium shadow transition-all flex items-center gap-2"
//                     >
//                       <HiOutlineDownload /> Download
//                     </button>
//                     <button
//                       onClick={() => openLightbox(selectedDashboard.qrCode)}
//                       className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-sky-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium shadow transition-all flex items-center gap-2"
//                     >
//                       <FiShare2 /> Share
//                     </button>
//                   </>
//                 )}
//                 <button
//                   onClick={() => handleDeleteDashboard(selectedDashboard.dashId)}
//                   className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-sm font-medium shadow-lg transition-all flex items-center gap-2"
//                 >
//                   <FiTrash /> Delete
//                 </button>
//               </div>
//             </div>

//             {selectedDashboard.plots?.equityHubPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-gray-900 dark:text-white font-semibold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
//                   Equity Hub Plots ({selectedDashboard.plots.equityHubPlots.length})
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.equityHubPlots.map((plot) => (
//                     <div
//                       key={plot.dash_equity_hub_id}
//                       className="p-4 bg-white dark:bg-slate-800/50 rounded-xl shadow relative border border-gray-200 dark:border-slate-700"
//                     >
//                       <div className="flex justify-between items-start mb-3">
//                         <h5 className="font-semibold text-gray-900 dark:text-white">
//                           {plot.graph_type} - {plot.symbol || "Unknown Company"}
//                         </h5>
//                         <button
//                           onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
//                           className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg transition-colors"
//                           title="Delete Plot"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                       <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {selectedDashboard.plots?.portfolioPlots?.length > 0 && (
//               <>
//                 <h4 className="text-lg text-gray-900 dark:text-white font-semibold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
//                   Portfolio Plots ({selectedDashboard.plots.portfolioPlots.length})
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {selectedDashboard.plots.portfolioPlots.map((plot) => (
//                     <div
//                       key={plot.dash_port_id}
//                       className="p-4 bg-white dark:bg-slate-800/50 rounded-xl shadow relative border border-gray-200 dark:border-slate-700"
//                     >
//                       <div className="flex justify-between items-start mb-3">
//                         <h5 className="font-semibold text-gray-900 dark:text-white">
//                           {plot.graph_type} - {plot.companyName || "Portfolio"} ({plot.platform || "Unknown Platform"})
//                         </h5>
//                         <button
//                           onClick={() => handleDeletePlot(plot.dash_port_id, true)}
//                           className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg transition-colors"
//                           title="Delete Plot"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                       <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         ) : (
//           <div className="glass-effect rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700/50">
//                 <thead className="bg-gray-100 dark:bg-slate-800/80">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
//                       Dashboard Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
//                       Platform
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
//                       Last Updated
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200/30 dark:divide-slate-700/30">
//                   {dashboards.length > 0 ? (
//                     dashboards.map((dashboard) => (
//                       <tr
//                         key={dashboard.dashId}
//                         className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors duration-150"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900 dark:text-white">
//                             {dashboard.dashboardName}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-600 dark:text-slate-300">
//                             {dashboard.plots?.portfolioPlots?.length > 0
//                               ? dashboard.plots.portfolioPlots
//                                 .map((p) => p.platform)
//                                 .filter((p) => p)
//                                 .join(", ") || "No Platform"
//                               : "No Platform"}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-600 dark:text-slate-400">
//                             {dashboard.updatedAt ? formatDate(dashboard.updatedAt) : "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleViewDashboard(dashboard)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
//                               title="View Dashboard"
//                             >
//                               <FiEye className="mr-1.5" /> View
//                             </button>
//                             <button
//                               onClick={() => handleDeleteDashboard(dashboard.dashId)}
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600/90 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
//                               title="Delete Dashboard"
//                             >
//                               <FiTrash className="mr-1.5" /> Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-12 text-center">
//                         <div className="flex flex-col items-center justify-center">
//                           <LuSaveAll className="w-14 h-14 text-gray-400 dark:text-slate-600 mb-4" />
//                           <span className="text-lg font-medium text-gray-700 dark:text-slate-300 mb-1">
//                             No dashboards available
//                           </span>
//                           <span className="text-sm text-gray-500 dark:text-slate-500">
//                             Create your first dashboard to get started
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default SavedDashboard;


import React, { useEffect, useState, useCallback } from "react";
import { equityHubMap, portfolioMap } from "./ComponentRegistry";
import { FiHome, FiLogOut, FiCopy, FiTrash, FiShare2, FiEye, FiInbox, FiChevronLeft, FiX } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { HiOutlineDownload } from "react-icons/hi";
import { LuSaveAll } from "react-icons/lu";
import { BsSun, BsMoon, BsQrCode } from "react-icons/bs";
import { FaWhatsapp, FaLinkedin, FaTwitter, FaEnvelope, FaLink } from "react-icons/fa";
import { GraphDataProvider } from "../Portfolio/GraphDataContext";
import * as htmlToImage from "html-to-image";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDashboard } from "react-icons/md";
import { Helmet } from "react-helmet-async";

const MAX_SNAPSHOTS = 5;

const SavedDashboard = () => {
  const [dashboards, setDashboards] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboards");
  const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [currentQrData, setCurrentQrData] = useState(null);
  const navigate = useNavigate();
  const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState("");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  // Theme handling
  useEffect(() => {
    const applyTheme = () => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const selectedTheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
      document.documentElement.classList.toggle("dark", selectedTheme === "dark");
      localStorage.setItem("theme", theme);
    };

    applyTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") applyTheme();
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
      return newTheme;
    });
  };

  // Enhanced styles with animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      
      * {
        font-family: 'Poppins', sans-serif;
      }
      
      .snapshot-spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid #ffffff;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.4); }
        50% { box-shadow: 0 0 30px rgba(14, 165, 233, 0.8); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200px 0; }
        100% { background-position: 200px 0; }
      }
      
      .dashboard-card {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation: fadeInUp 0.6s ease-out;
      }
      
      .dashboard-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(14, 165, 233, 0.3);
      }
      
      .glass-effect {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .dark .glass-effect {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .gradient-border {
        position: relative;
        background: linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6);
        padding: 2px;
        border-radius: 16px;
      }
      
      .gradient-border::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 16px;
        padding: 2px;
        background: linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: xor;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
      }
      
      .shimmer {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200px 100%;
        animation: shimmer 1.5s infinite;
      }
      
      .dark .shimmer {
        background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
        background-size: 200px 100%;
        animation: shimmer 1.5s infinite;
      }
      
      .qr-modal-overlay {
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch data
  useEffect(() => {
    fetchDashboards();
    fetchSnapshots();
  }, []);

  const fetchDashboards = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to view your dashboard.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/dashboard/fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDashboards(data.dashboards || []);
    } catch (err) {
      console.error("Fetch dashboards error:", err);
      setError("Please login to see the dashboards.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSnapshots = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to view your snapshots.");
        return;
      }
      const res = await fetch(`${API_BASE}/dashboard/snapshots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch (err) {
      console.error("Fetch snapshots error:", err);
      setError("Error loading snapshots.");
    }
  };

  const fetchScreenshot = useCallback(
    async (dashId, screenshotPath) => {
      try {
        const token = localStorage.getItem("authToken");
        const imageUrl = `${API_BASE}/dashboard/image/${screenshotPath}`;
        const res = await fetch(imageUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`status: ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setImageUrls((prev) => ({ ...prev, [dashId]: url }));
      } catch (err) {
        console.error(`Failed to fetch screenshot for ${dashId}:`, err);
        setImageErrors((p) => ({ ...p, [dashId]: true }));
      }
    },
    [API_BASE]
  );

  useEffect(() => {
    [...dashboards, ...snapshots].forEach((item) => {
      const id = item.dashId;
      if (!imageUrls[id] && !imageErrors[id] && item.screenshotPath) {
        fetchScreenshot(id, item.screenshotPath);
      }
    });
  }, [dashboards, snapshots, imageUrls, imageErrors, fetchScreenshot]);

  // QR Code Sharing Modal
  const openQrModal = (dashboard) => {
    setCurrentQrData({
      qrCode: dashboard.qrCode,
      dashboardName: dashboard.dashboardName,
      dashboardId: dashboard.dashId
    });
    setQrModalOpen(true);
  };

  const closeQrModal = () => {
    setQrModalOpen(false);
    setCurrentQrData(null);
  };

  const shareQRCode = (platform) => {
    if (!currentQrData?.qrCode) {
      toast.error("No QR code available to share");
      return;
    }

    const shareText = `Check out my dashboard: ${currentQrData.dashboardName}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(window.location.origin + `/api/dashboard/${currentQrData.dashboardId}`);

    let shareUrl = "";

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedText}&body=${encodedText}%20${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.origin + `/api/dashboard/${currentQrData.dashboardId}`);
        toast.success("Link copied to clipboard!");
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    toast.success(`Sharing via ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
  };

  // Delete handlers
  const handleDeleteSnapshot = async (dashId) => {
    if (!window.confirm("Are you sure you want to delete this snapshot?")) return;
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete snapshot");

      setSnapshots((prev) => prev.filter((s) => s.dashId !== dashId));
      setDashboards((prev) =>
        prev.map((dash) =>
          dash.dashId === dashId ? { ...dash, qrCode: null, screenshotPath: null } : dash
        )
      );
      if (selectedDashboard && selectedDashboard.dashId === dashId) {
        setSelectedDashboard((prev) => ({ ...prev, qrCode: null, screenshotPath: null }));
      }
      setImageUrls((prev) => {
        const copy = { ...prev };
        delete copy[dashId];
        return copy;
      });
      setImageErrors((prev) => {
        const copy = { ...prev };
        delete copy[dashId];
        return copy;
      });

      const dashboardRes = await fetch(`${API_BASE}/dashboard/fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dashboardData = await dashboardRes.json();
      setDashboards(dashboardData.dashboards || []);
      toast.success("Snapshot deleted successfully");
    } catch (err) {
      console.error("Snapshot delete error:", err);
      toast.error("Failed to delete snapshot: " + err.message);
    }
  };

  const handleDeleteDashboard = async (dashId) => {
    if (!window.confirm("Are you sure you want to delete this dashboard?")) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE}/dashboard/delete/${dashId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(await response.text());
      setDashboards((prev) => prev.filter((dash) => dash.dashId !== dashId));
      setSnapshots((prev) => prev.filter((snap) => snap.dashId !== dashId));
      setImageUrls((prev) => {
        const copy = { ...prev };
        delete copy[dashId];
        return copy;
      });
      setImageErrors((prev) => {
        const copy = { ...prev };
        delete copy[dashId];
        return copy;
      });
      setSelectedDashboard(null);
      toast.success("Dashboard deleted successfully");
    } catch (err) {
      console.error("Dashboard delete error:", err);
      toast.error("Failed to delete dashboard");
    }
  };

  const handleDeletePlot = (plotId, isPortfolio) => {
    setDashboards((prev) =>
      prev.map((dash) => ({
        ...dash,
        plots: {
          ...dash.plots,
          portfolioPlots: isPortfolio
            ? dash.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
            : dash.plots.portfolioPlots,
          equityHubPlots: !isPortfolio
            ? dash.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
            : dash.plots.equityHubPlots,
        },
      }))
    );
    if (selectedDashboard) {
      setSelectedDashboard((prev) => ({
        ...prev,
        plots: {
          ...prev.plots,
          portfolioPlots: isPortfolio
            ? prev.plots.portfolioPlots.filter((p) => p.dash_port_id !== plotId)
            : prev.plots.portfolioPlots,
          equityHubPlots: !isPortfolio
            ? prev.plots.equityHubPlots.filter((p) => p.dash_equity_hub_id !== plotId)
            : prev.plots.equityHubPlots,
        },
      }));
    }
  };

  // Snapshot and download handlers
  const handleDownloadSnapshot = (imageUrl, dashboardName) => {
    if (!imageUrl) {
      toast.error("No image available to download.");
      return;
    }
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${dashboardName || "dashboard"}_snapshot.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTakeSnap = async (dashId, dashboardElementId) => {
    if (snapshots.length >= MAX_SNAPSHOTS) {
      toast.error(`You can keep only ${MAX_SNAPSHOTS} snapshots. Please delete one before creating a new snapshot.`);
      return;
    }
    setIsTakingSnapshot(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please log in to take a snapshot.");
      const element = document.getElementById(dashboardElementId);
      if (!element) throw new Error(`Element '${dashboardElementId}' not found`);

      const base64 = await htmlToImage.toPng(element, {
        backgroundColor: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
        pixelRatio: window.innerWidth < 640 ? 1 : 2,
        cacheBust: true,
        skipFonts: true,
      });

      if (!base64 || base64.length < 100) {
        throw new Error("Generated screenshot is invalid or empty.");
      }

      const snapshotTime = new Date().toISOString();
      const dashboard = dashboards.find((d) => d.dashId === dashId);

      const platformNames = dashboard?.plots?.portfolioPlots
        ?.map((p) => p.platform)
        ?.filter((platform) => platform)
        ?.join(", ") || "No Platform";

      const plots = {
        portfolioPlots: dashboard?.plots?.portfolioPlots?.map((p) => ({
          graph_type: p.graph_type,
          companyName: p.companyName,
          dash_port_id: p.dash_port_id,
          platform: p.platform || "Unknown Platform",
        })) || [],
        equityHubPlots: dashboard?.plots?.equityHubPlots?.map((p) => ({
          graph_type: p.graph_type,
          companyName: p.symbol || "Unknown Company",
          dash_equity_hub_id: p.dash_equity_hub_id,
        })) || [],
      };

      const res = await fetch(`${API_BASE}/dashboard/snapshot/${dashId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          screenshot: base64,
          createdAt: snapshotTime,
          platform: platformNames,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const newSnapshot = {
        dashId,
        dashboardName: dashboard?.dashboardName || "Unnamed Dashboard",
        screenshotPath: data.screenshotPath,
        createdAt: data.createdAt || snapshotTime,
        platform: platformNames,
        plots,
      };
      setSnapshots((prev) => {
        const filtered = prev.filter((s) => s.dashId !== dashId);
        return [...filtered, newSnapshot];
      });
      setDashboards((prev) =>
        prev.map((dash) =>
          dash.dashId === dashId
            ? { ...dash, qrCode: data.qrCode, screenshotPath: data.screenshotPath }
            : dash
        )
      );
      if (selectedDashboard && selectedDashboard.dashId === dashId) {
        setSelectedDashboard((prev) => ({
          ...prev,
          qrCode: data.qrCode,
          screenshotPath: data.screenshotPath,
        }));
      }
      await fetchScreenshot(dashId, data.screenshotPath);
      setSnapshotSuccessMsg("Snapshot taken successfully!");
      setTimeout(() => setSnapshotSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Snapshot error:", err);
      toast.error(err.message);
    } finally {
      setIsTakingSnapshot(false);
    }
  };

  const openLightbox = (src) => {
    setLightboxImg(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const renderComponent = (plot, isPortfolio) => {
    const map = isPortfolio ? portfolioMap : equityHubMap;
    const Cmp = map[plot.graph_type];
    if (!Cmp) return <p className="text-red-500">Component not found</p>;
    return isPortfolio ? (
      <GraphDataProvider>
        <Cmp
          uploadId={plot.upload_id || null}
          key={`portfolio-${plot.dash_port_id}-${plot.upload_id || "no-upload-id"}`}
        />
      </GraphDataProvider>
    ) : (
      <Cmp symbol={plot.symbol} key={`equity-${plot.dash_equity_hub_id}-${plot.symbol}`} />
    );
  };

  const navItems = [
    {
      label: "Home",
      icon: <FiHome className="text-lg" />,
      onClick: () => {
        setActiveTab("home");
        navigate("/");
      },
    },
    {
      label: "ResearchPanel",
      icon: <MdDashboard className="text-lg" />,
      onClick: () => {
        setActiveTab("researchPanel");
        navigate("/researchpanel");
      },
    },
    {
      label: "Saved Dashboard",
      icon: <LuSaveAll className="text-lg" />,
      onClick: () => {
        setActiveTab("savedDashboard");
        navigate("/saveddashboard");
      },
    },
    {
      label: "Snapshots",
      icon: <FiCopy className="text-lg" />,
      onClick: () => setActiveTab("snapshots"),
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  const handleViewDashboard = (dashboard) => {
    setSelectedDashboard(dashboard);
  };

  const handleBackToList = () => {
    setSelectedDashboard(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
      {/* ✅ Canonical tag and SEO meta setup */}
      <Helmet>
        <title>Saved Dashboards | CMDA Hub – Access, Share & Manage Your Insights</title>
        <meta
          name="description"
          content="Access all your saved dashboards in one place. Capture and share snapshots with QR codes, track insights, and manage your CMDA Hub analytics efficiently."
        />
        <meta
          name="keywords"
          content="saved dashboards, CMDA Hub, share dashboard, analytics snapshots, QR code sharing, custom dashboard, financial insights, data visualization"
        />
        <meta property="og:title" content="Saved Dashboards | CMDA Hub" />
        <meta
          property="og:description"
          content="View and manage your personalized dashboards on CMDA Hub. Instantly share snapshots or QR codes with others and keep your analytics at your fingertips."
        />
        <meta property="og:url" content="https://cmdahub.com/saveddashboard" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CMDA Hub" />
        <link rel="canonical" href="https://cmdahub.com/saveddashboard" />
      </Helmet>

      {/* Enhanced Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"} glass-effect text-gray-900 dark:text-white flex flex-col justify-between shadow-2xl transition-all duration-300 border-r border-gray-200 dark:border-slate-700`}
      >
        <div>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            {!collapsed && (
              <div className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">
                #CMD<span className="text-sky-500">A</span>
                <span className="text-gray-900 dark:text-white">Dashboard</span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white text-2xl transition-colors hover:scale-110"
            >
              <IoMenu />
            </button>
          </div>
          <nav className="mt-4 space-y-1 px-2">
            {navItems.map(({ label, icon, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-sm font-medium group ${(label === "Snapshots" && activeTab === "snapshots") ||
                  (label === "Saved Dashboard" && activeTab === "savedDashboard") ||
                  (label === "Dashboard" && activeTab === "dashboards")
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-slate-300"
                  }`}
              >
                <span className={`${!collapsed ? "mr-2" : "mx-auto"} group-hover:scale-110 transition-transform`}>
                  {icon}
                </span>
                {!collapsed && <span>{label}</span>}
              </button>
            ))}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-sm font-medium text-gray-600 dark:text-slate-300 group"
            >
              <span className={`${!collapsed ? "mr-2" : "mx-auto"} group-hover:scale-110 transition-transform`}>
                {theme === "light" ? <BsMoon className="text-lg" /> : <BsSun className="text-lg" />}
              </span>
              {!collapsed && <span>{theme === "light" ? "Dark Mode" : theme === "dark" ? "Light Mode" : "System Theme"}</span>}
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto p-6 ${isTakingSnapshot ? "pointer-events-none" : ""}`}
        style={{ position: "relative" }}
      >
        {isTakingSnapshot && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="snapshot-spinner"></div>
              <div className="text-white text-lg font-semibold animate-pulse">
                Generating your snapshot...
              </div>
            </div>
          </div>
        )}

        {snapshotSuccessMsg && (
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
            style={{
              animation: "fadeInUp 0.5s ease-out",
            }}
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              {snapshotSuccessMsg}
            </div>
          </div>
        )}

        {/* Enhanced Lightbox */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImg}
                alt="snapshot lightbox"
                className="rounded-2xl shadow-2xl max-h-[90vh] max-w-full object-contain border-4 border-white/20"
              />
              <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button
                  onClick={closeLightbox}
                  className="p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 dark:text-slate-900 shadow-lg transition-all hover:scale-110"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Sharing Modal */}
        {qrModalOpen && currentQrData && (
          <div className="fixed inset-0 z-50 qr-modal-overlay bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeInUp">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Share Dashboard
                </h3>
                <button
                  onClick={closeQrModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Scan QR code to view <span className="font-semibold">{currentQrData.dashboardName}</span>
                </p>
                <div className="gradient-border mx-auto w-48 h-48 flex items-center justify-center rounded-xl">
                  <img
                    src={currentQrData.qrCode}
                    alt="QR Code"
                    className="w-44 h-44 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3 mb-6">
                <button
                  onClick={() => shareQRCode('whatsapp')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all hover:scale-105"
                >
                  <FaWhatsapp className="text-green-600 dark:text-green-400 text-xl" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">WhatsApp</span>
                </button>

                <button
                  onClick={() => shareQRCode('twitter')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all hover:scale-105"
                >
                  <FaTwitter className="text-blue-500 dark:text-blue-400 text-xl" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Twitter</span>
                </button>

                <button
                  onClick={() => shareQRCode('linkedin')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all hover:scale-105"
                >
                  <FaLinkedin className="text-blue-700 dark:text-blue-400 text-xl" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">LinkedIn</span>
                </button>

                <button
                  onClick={() => shareQRCode('email')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all hover:scale-105"
                >
                  <FaEnvelope className="text-red-500 dark:text-red-400 text-xl" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Email</span>
                </button>

                <button
                  onClick={() => shareQRCode('copy')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all hover:scale-105"
                >
                  <FaLink className="text-purple-600 dark:text-purple-400 text-xl" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Copy</span>
                </button>
              </div>

              <button
                onClick={closeQrModal}
                className="w-full py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">
              {activeTab === "dashboards"
                ? selectedDashboard
                  ? `${selectedDashboard.dashboardName}`
                  : "Saved Dashboards"
                : "Snapshots"}
            </h2>
            {selectedDashboard && (
              <p className="text-gray-600 dark:text-slate-400 mt-2 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {selectedDashboard.plots?.portfolioPlots?.length || 0} portfolio plots
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {selectedDashboard.plots?.equityHubPlots?.length || 0} equity plots
                </span>
              </p>
            )}
          </div>
          {selectedDashboard ? (
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 px-4 py-2.5 glass-effect hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-slate-200 rounded-xl transition-all border border-gray-300 dark:border-slate-700 hover:scale-105"
            >
              <FiChevronLeft /> Back to List
            </button>
          ) : (
            <div className="flex gap-2 glass-effect p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("dashboards")}
                className={`px-6 py-2 rounded-xl transition-all ${activeTab === "dashboards"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-900 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
              >
                Dashboards
              </button>
              <button
                onClick={() => setActiveTab("snapshots")}
                className={`px-6 py-2 rounded-xl transition-all ${activeTab === "snapshots"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-900 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
              >
                Snapshots
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="dashboard-card p-4 rounded-xl glass-effect border border-gray-200 dark:border-slate-700">
                <div className="shimmer h-40 rounded-lg mb-4"></div>
                <div className="shimmer h-4 rounded w-3/4 mb-2"></div>
                <div className="shimmer h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-effect rounded-xl p-6 text-center border border-red-200 dark:border-red-800">
            <div className="text-red-500 dark:text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">{error}</h3>
            <p className="text-red-600 dark:text-red-400">Please try refreshing the page or check your connection.</p>
          </div>
        ) : activeTab === "snapshots" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snapshots.length ? (
              snapshots.map((snap, index) => (
                <div
                  key={snap.dashId}
                  className="dashboard-card relative p-4 rounded-xl glass-effect border border-gray-200 dark:border-slate-700 overflow-hidden group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-100/30 dark:from-sky-900/30 to-gray-50/50 dark:to-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <button
                    onClick={() => handleDeleteSnapshot(snap.dashId)}
                    className="absolute top-3 right-3 z-10 p-2 glass-effect hover:bg-red-600/90 text-gray-900 dark:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
                  >
                    <FiTrash className="text-sm" />
                  </button>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white truncate">
                    {snap.dashboardName} {snap.platform && <span className="text-gray-600 dark:text-slate-400 text-sm">({snap.platform})</span>}
                  </h3>
                  {snap.screenshotPath ? (
                    imageErrors[snap.dashId] ? (
                      <div className="glass-effect rounded-lg flex items-center justify-center h-40 text-gray-500 dark:text-slate-500">
                        Failed to load image
                      </div>
                    ) : (
                      <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
                        <img
                          src={imageUrls[snap.dashId]}
                          alt="snapshot"
                          className="w-full h-auto cursor-zoom-in hover:opacity-90 transition-opacity"
                          onClick={() => openLightbox(imageUrls[snap.dashId])}
                          onError={() => setImageErrors((p) => ({ ...p, [snap.dashId]: true }))}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadSnapshot(imageUrls[snap.dashId], snap.dashboardName);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 glass-effect hover:bg-gray-300/90 dark:hover:bg-slate-700/90 text-gray-900 dark:text-white rounded-lg text-xs transition-all hover:scale-105"
                            >
                              <HiOutlineDownload className="text-sm" /> Download
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="glass-effect rounded-lg flex items-center justify-center h-40 text-gray-500 dark:text-slate-500">
                      No snapshot available
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center glass-effect rounded-2xl">
                <FiInbox className="w-20 h-20 text-gray-400 dark:text-slate-600 mb-6" />
                <h3 className="text-2xl font-medium text-gray-700 dark:text-slate-300 mb-3">No snapshots yet</h3>
                <p className="text-gray-500 dark:text-slate-500 max-w-md text-lg">
                  Take snapshots of your dashboards to save them here for future reference.
                </p>
              </div>
            )}
          </div>
        ) : selectedDashboard ? (
          <div
            id={`dashboard-${selectedDashboard.dashId}`}
            className="mb-12 p-8 rounded-2xl shadow-xl glass-effect border border-gray-200 dark:border-slate-700"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedDashboard.dashboardName}
                </h3>
                {snapshots.find((s) => s.dashId === selectedDashboard.dashId)?.createdAt && (
                  <p className="text-sm text-sky-500 dark:text-sky-400/80">
                    Last Snapshot: {formatDate(snapshots.find((s) => s.dashId === selectedDashboard.dashId).createdAt)}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleTakeSnap(selectedDashboard.dashId, `dashboard-${selectedDashboard.dashId}`)}
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-sm font-medium shadow-lg transition-all disabled:opacity-60 flex items-center gap-2 hover:scale-105 animate-pulse-glow"
                  disabled={isTakingSnapshot}
                >
                  {isTakingSnapshot ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Taking...
                    </>
                  ) : (
                    <>
                      <FiCopy /> Take Snap
                    </>
                  )}
                </button>
                {selectedDashboard.screenshotPath && imageUrls[selectedDashboard.dashId] && (
                  <>
                    <button
                      onClick={() =>
                        handleDownloadSnapshot(imageUrls[selectedDashboard.dashId], selectedDashboard.dashboardName)
                      }
                      className="px-4 py-3 glass-effect hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-xl text-sm font-medium shadow transition-all flex items-center gap-2 hover:scale-105"
                    >
                      <HiOutlineDownload /> Download
                    </button>
                    {selectedDashboard.qrCode && (
                      <button
                        onClick={() => openQrModal(selectedDashboard)}
                        className="px-4 py-3 glass-effect hover:bg-sky-600 text-gray-900 dark:text-white rounded-xl text-sm font-medium shadow transition-all flex items-center gap-2 hover:scale-105"
                      >
                        <BsQrCode /> Share QR
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => handleDeleteDashboard(selectedDashboard.dashId)}
                  className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-medium shadow-lg transition-all flex items-center gap-2 hover:scale-105"
                >
                  <FiTrash /> Delete
                </button>
              </div>
            </div>

            {selectedDashboard.plots?.equityHubPlots?.length > 0 && (
              <>
                <h4 className="text-xl text-gray-900 dark:text-white font-semibold mt-8 mb-6 pb-3 border-b border-gray-200 dark:border-slate-700">
                  Equity Hub Plots ({selectedDashboard.plots.equityHubPlots.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDashboard.plots.equityHubPlots.map((plot) => (
                    <div
                      key={plot.dash_equity_hub_id}
                      className="p-6 glass-effect rounded-xl shadow relative border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          {plot.graph_type} - {plot.symbol || "Unknown Company"}
                        </h5>
                        <button
                          onClick={() => handleDeletePlot(plot.dash_equity_hub_id, false)}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg transition-colors hover:scale-110"
                          title="Delete Plot"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedDashboard.plots?.portfolioPlots?.length > 0 && (
              <>
                <h4 className="text-xl text-gray-900 dark:text-white font-semibold mt-8 mb-6 pb-3 border-b border-gray-200 dark:border-slate-700">
                  Portfolio Plots ({selectedDashboard.plots.portfolioPlots.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDashboard.plots.portfolioPlots.map((plot) => (
                    <div
                      key={plot.dash_port_id}
                      className="p-6 glass-effect rounded-xl shadow relative border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          {plot.graph_type} - {plot.companyName || "Portfolio"} ({plot.platform || "Unknown Platform"})
                        </h5>
                        <button
                          onClick={() => handleDeletePlot(plot.dash_port_id, true)}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg transition-colors hover:scale-110"
                          title="Delete Plot"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="glass-effect rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700/50">
                <thead className="bg-gray-100 dark:bg-slate-800/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                      Dashboard Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/30 dark:divide-slate-700/30">
                  {dashboards.length > 0 ? (
                    dashboards.map((dashboard) => (
                      <tr
                        key={dashboard.dashId}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {dashboard.dashboardName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-slate-300">
                            {dashboard.plots?.portfolioPlots?.length > 0
                              ? dashboard.plots.portfolioPlots
                                .map((p) => p.platform)
                                .filter((p) => p)
                                .join(", ") || "No Platform"
                              : "No Platform"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-slate-400">
                            {dashboard.updatedAt ? formatDate(dashboard.updatedAt) : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDashboard(dashboard)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all hover:scale-105"
                              title="View Dashboard"
                            >
                              <FiEye className="mr-1.5" /> View
                            </button>
                            <button
                              onClick={() => handleDeleteDashboard(dashboard.dashId)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all hover:scale-105"
                              title="Delete Dashboard"
                            >
                              <FiTrash className="mr-1.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <LuSaveAll className="w-16 h-16 text-gray-400 dark:text-slate-600 mb-4" />
                          <span className="text-xl font-medium text-gray-700 dark:text-slate-300 mb-2">
                            No dashboards available
                          </span>
                          <span className="text-sm text-gray-500 dark:text-slate-500">
                            Create your first dashboard to get started
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedDashboard;