//-------------working code ------------------



// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';

// const SharedDashboard = () => {
//   const [dashboard, setDashboard] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const { shareToken } = useParams();
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`; // http://147.93.107.167:8080

//   useEffect(() => {
//     const fetchSharedDashboard = async () => {
//       try {
//         const apiUrl = `${API_BASE}/api/dashboard/view/${shareToken}`;
//         console.log("API_BASE:", API_BASE);
//         console.log("Fetching from:", apiUrl);
//         console.log("Fetching shared dashboard for token:", shareToken);
//         const response = await fetch(apiUrl);
//         console.log("Response headers:", Object.fromEntries(response.headers.entries()));
//         if (!response.ok) {
//           const text = await response.text();
//           console.error("Response status:", response.status);
//           console.error("Response text:", text);
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log("Shared dashboard data:", data);
//         setDashboard(data.dashboard);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("Error loading shared dashboard: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSharedDashboard();
//   }, [shareToken]);

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graph_type];
//     if (!Component) {
//       return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
//     }
//     if (isPortfolio) {
//       // Pass both uploadId and fileData to the component
//       return <Component uploadId={plot.upload_id} fileData={plot.fileData} />;
//     }
//     return <Component symbol={plot.symbol} />;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-gray-800 p-8">
//       {loading ? (
//         <p className="text-gray-600 dark:text-gray-300">Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : dashboard ? (
//         <div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
//           <h3 className="text-2xl font-bold text-cyan-600 mb-6">{dashboard.dashboardName}</h3>
//           {dashboard.plots?.portfolioPlots?.length > 0 && (
//             <>
//               <h4 className="text-lg text-purple-600 font-semibold mb-4">Portfolio Plots</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {dashboard.plots.portfolioPlots.map((plot, idx) => (
//                   <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow">
//                     <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                     <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//           {dashboard.plots?.equityHubPlots?.length > 0 && (
//             <>
//               <h4 className="text-lg text-cyan-500 font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {dashboard.plots.equityHubPlots.map((plot, idx) => (
//                   <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow">
//                     <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                     <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       ) : (
//         <p className="text-red-500">No dashboard data available.</p>
//       )}
//     </div>
//   );
// };

// export default SharedDashboard;

//----------------------------------------------------
// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import html2canvas from 'html2canvas';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';

// const SharedDashboard = () => {
//   const [dashboard, setDashboard] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [capturedImages, setCapturedImages] = useState({});
//   const [isGuestViewer, setIsGuestViewer] = useState(false);
//   const { shareToken } = useParams();
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const fetchSharedDashboard = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         setIsGuestViewer(!token); // if no token, treat as guest

//         if (!shareToken || typeof shareToken !== 'string') {
//           throw new Error("Missing or invalid share token.");
//         }

//         const apiUrl = `${API_BASE}/api/dashboard/view/${shareToken}`;
//         console.log("Fetching dashboard from:", apiUrl);

//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//           const text = await response.text();
//           throw new Error(`HTTP ${response.status}: ${text}`);
//         }

//         const data = await response.json();
//         setDashboard(data.dashboard);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("Failed to load dashboard images: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSharedDashboard();
//   }, [shareToken]);

//   const capturePlotAsImage = async (plotId, ref) => {
//     if (!ref.current) return;

//     try {
//       const canvas = await html2canvas(ref.current, {
//         useCORS: true,
//         backgroundColor: null,
//       });
//       const imageDataUrl = canvas.toDataURL('image/png');
//       setCapturedImages(prev => ({ ...prev, [plotId]: imageDataUrl }));
//     } catch (err) {
//       console.error(`Failed to capture image for plot ${plotId}:`, err);
//     }
//   };

//   const downloadImage = (plotId) => {
//     const imageUrl = capturedImages[plotId];
//     if (!imageUrl) return;

//     const link = document.createElement('a');
//     link.href = imageUrl;
//     link.download = `${plotId}.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const renderComponent = (plot, isPortfolio, index) => {
//     const plotId = `${isPortfolio ? 'portfolio' : 'equity'}-${index}`;
//     const ref = useRef(null);

//     useEffect(() => {
//       if (!capturedImages[plotId]) {
//         setTimeout(() => capturePlotAsImage(plotId, ref), 1000);
//       }
//     }, [capturedImages]);

//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graph_type];

//     if (!Component) {
//       console.warn(`No component found for: ${plot.graph_type}`);
//       return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
//     }

//     if (isGuestViewer && capturedImages[plotId]) {
//       return (
//         <div>
//           <img
//             src={capturedImages[plotId]}
//             alt={`Static image of ${plot.graph_type}`}
//             className="w-full border border-gray-300 rounded-lg mb-2"
//           />
//           <button
//             onClick={() => downloadImage(plotId)}
//             className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Download Image
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div ref={ref}>
//         <p className="text-xs text-gray-400">Rendering: {plot.graph_type}</p>
//         {isPortfolio
//           ? plot.upload_id
//             ? <Component uploadId={plot.upload_id} />
//             : <p className="text-red-500">Missing upload_id</p>
//           : <Component symbol={plot.symbol} />}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-gray-800 p-8">
//       {loading ? (
//         <p className="text-gray-600 dark:text-gray-300">Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : dashboard ? (
//         <div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
//           <h3 className="text-2xl font-bold text-cyan-600 mb-6">{dashboard.dashboardName}</h3>

//           {dashboard.plots?.portfolioPlots?.length > 0 && (
//             <>
//               <h4 className="text-lg text-purple-600 font-semibold mb-4">Portfolio Plots</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {dashboard.plots.portfolioPlots.map((plot, idx) => (
//                   <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow">
//                     <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                     <div className="min-h-[200px]">
//                       {renderComponent(plot, true, idx)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}

//           {dashboard.plots?.equityHubPlots?.length > 0 && (
//             <>
//               <h4 className="text-lg text-cyan-500 font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {dashboard.plots.equityHubPlots.map((plot, idx) => (
//                   <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow">
//                     <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
//                     <div className="min-h-[200px]">
//                       {renderComponent(plot, false, idx)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       ) : (
//         <p className="text-red-500">No dashboard data available.</p>
//       )}
//     </div>
//   );
// };

// export default SharedDashboard;

//----------------------------16-06-25 :12:42 -------------------------

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { equityHubMap, portfolioMap } from './ComponentRegistry';

const SharedDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [capturedImages, setCapturedImages] = useState({});
  const [isGuestViewer, setIsGuestViewer] = useState(false);
  const { shareToken } = useParams();
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    const fetchSharedDashboard = async () => {
      try {
        const token = localStorage.getItem('authToken');
        setIsGuestViewer(!token); // If no token, treat as guest (e.g., QR code access)

        if (!shareToken || typeof shareToken !== 'string') {
          throw new Error("Missing or invalid share token.");
        }

        const apiUrl = `${API_BASE}/dashboard/view/${shareToken}`;
        console.log("Fetching dashboard from:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = await response.json();
        setDashboard(data.dashboard);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load dashboard: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDashboard();
  }, [shareToken]);

  const capturePlotAsImage = async (plotId, ref) => {
    if (!ref.current) return;

    try {
      const canvas = await html2canvas(ref.current, {
        useCORS: true,
        backgroundColor: null,
      });
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImages(prev => ({ ...prev, [plotId]: imageDataUrl }));
    } catch (err) {
      console.error(`Failed to capture image for plot ${plotId}:`, err);
    }
  };

  const downloadImage = (plotId) => {
    const imageUrl = capturedImages[plotId];
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${plotId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderComponent = (plot, isPortfolio, uniqueId) => {
    const plotId = `${isPortfolio ? 'portfolio' : 'equity'}-${uniqueId}`;
    const ref = useRef(null);

    useEffect(() => {
      if (!capturedImages[plotId]) {
        const timer = setTimeout(() => capturePlotAsImage(plotId, ref), 1000);
        return () => clearTimeout(timer); // Cleanup to prevent memory leaks
      }
    }, [capturedImages, plotId]);

    const map = isPortfolio ? portfolioMap : equityHubMap;
    const Component = map[plot.graph_type];

    if (!Component) {
      console.warn(`No component found for graphing type: ${plot.graph_type}`);
      return <p className="text-red-500">Component not found: {plot.graph_type}</p>;
    }

    return (
      <div>
        {isGuestViewer && capturedImages[plotId] ? (
          <div>
            <img
              src={capturedImages[plotId]}
              alt={`Static image of ${plot.graph_type}`}
              className="w-full border border-gray-300 rounded-lg mb-2"
            />
            <button
              onClick={() => downloadImage(plotId)}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download Image
            </button>
          </div>
        ) : (
          <div ref={ref}>
            <p className="text-xs text-gray-400">Rendering: {plot.graph_type}</p>
            {isPortfolio ? (
              <Component platform={plot.platform} /> // Use platform instead of upload_id
            ) : plot.symbol ? (
              <Component symbol={plot.symbol} />
            ) : (
              <p className="text-red-500">Missing symbol</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-gray-800 p-8">
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : dashboard ? (
        <div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-cyan-600 mb-6">{dashboard.dashboardName}</h3>

          {dashboard.plots?.portfolioPlots?.length > 0 && (
            <>
              <h4 className="text-lg text-purple-600 font-semibold mb-4">Portfolio Plots</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboard.plots.portfolioPlots.map((plot) => (
                  <div key={plot.dash_port_id} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow">
                    <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
                    <div className="min-h-[200px]">
                      {renderComponent(plot, true, plot.dash_port_id)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {dashboard.plots?.equityHubPlots?.length > 0 && (
            <>
              <h4 className="text-lg text-cyan-500 font-semibold mt-8 mb-4">Equity Hub Plots</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboard.plots.equityHubPlots.map((plot) => (
                  <div key={plot.dash_equity_hub_id} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl shadow">
                    <h5 className="font-semibold text-gray-700 dark:text-white mb-2">{plot.graph_type}</h5>
                    <div className="min-h-[200px]">
                      {renderComponent(plot, false, plot.dash_equity_hub_id)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-red-500">No dashboard data available.</p>
      )}
    </div>
  );
};

export default SharedDashboard;


// import React from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import { equityHubMap, portfolioMap } from './ComponentRegistry';
// import { GraphDataProvider } from '../Portfolio/GraphDataContext';

// const ViewDashboard = () => {
//   const { dashId } = useParams();
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const encodedData = query.get('data');
//   const dashboardData = encodedData ? JSON.parse(decodeURIComponent(encodedData)) : JSON.parse(localStorage.getItem('dashboards') || '[]').find(d => d.dashId === dashId);

//   if (!dashboardData) {
//     return <p className="text-red-500">Dashboard not found</p>;
//   }

//   const isAuthenticated = !!localStorage.getItem('authToken'); // Simple auth check

//   const renderComponent = (plot, isPortfolio) => {
//     const map = isPortfolio ? portfolioMap : equityHubMap;
//     const Component = map[plot.graphType || plot.graph_type];
//     if (!Component) {
//       return <p className="text-red-500">Component not found: {plot.graphType || plot.graph_type}</p>;
//     }
//     return isPortfolio ? (
//       <GraphDataProvider>
//         <Component uploadId={plot.uploadId || plot.upload_id} />
//       </GraphDataProvider>
//     ) : (
//       <Component symbol={plot.symbol} />
//     );
//   };

//   if (isAuthenticated) {
//     // Render interactive dashboard
//     return (
//       <div className="p-8">
//         <h3 className="text-2xl font-bold text-cyan-600">{dashboardData.dashboard.dashboardName}</h3>
//         {dashboardData.portfolioPlots?.length > 0 && (
//           <>
//             <h4 className="text-lg text-purple-600 font-semibold mt-8 mb-4">Portfolio Plots</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {dashboardData.portfolioPlots.map((plot, idx) => (
//                 <div key={idx} className="p-4 bg-slate-100 rounded-xl shadow">
//                   <h5 className="font-semibold text-gray-700 mb-2">{plot.graph_type}</h5>
//                   <div className="min-h-[200px]">{renderComponent(plot, true)}</div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//         {dashboardData.equityHubPlots?.length > 0 && (
//           <>
//             <h4 className="text-lg text-cyan-500 font-semibold mt-8 mb-4">Equity Hub Plots</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {dashboardData.equityHubPlots.map((plot, idx) => (
//                 <div key={idx} className="p-4 bg-slate-100 rounded-xl shadow">
//                   <h5 className="font-semibold text-gray-700 mb-2">{plot.graph_type}</h5>
//                   <div className="min-h-[200px]">{renderComponent(plot, false)}</div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     );
//   } else {
//     // Render screenshots for unauthorized users
//     return (
//       <div className="p-8">
//         <h3 className="text-2xl font-bold text-cyan-600">Dashboard Preview (Unauthorized)</h3>
//         {dashboardData.screenshots?.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {dashboardData.screenshots.map((screenshot, idx) => (
//               <div key={idx} className="p-4 bg-slate-100 rounded-xl shadow">
//                 <h5 className="font-semibold text-gray-700 mb-2">{`${screenshot.type} Plot ${screenshot.index}`}</h5>
//                 <img src={`data:image/png;base64,${screenshot.screenshot}`} alt={`${screenshot.type} Plot`} className="max-w-full" />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-red-500">No screenshots available</p>
//         )}
//       </div>
//     );
//   }
// };

// export default ViewDashboard;