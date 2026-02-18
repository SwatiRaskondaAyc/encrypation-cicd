


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Plot from "react-plotly.js";
// import { useGraphData } from "./GraphDataContext";
// import { HashLoader } from "react-spinners";

// const SwotPlot = () => {
//   const [graphData, setLocalGraphData] = useState(null); // Renamed to avoid conflict
//   const [error, setError] = useState("");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const { getGraphData, setGraphData } = useGraphData();

//   useEffect(() => {
//     const fetchGraphData = async () => {
//       const uploadId = localStorage.getItem("uploadId");
//       const cacheKey = `swot_plot_${uploadId}`;

//       if (!uploadId) {
//         setError("Please upload a file first.");
//         return;
//       }

//       // Check cache first
//       const cachedData = getGraphData(cacheKey);
//       if (cachedData) {
//         setLocalGraphData(cachedData);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${API_BASE}/file/create_swot_plot`,
//           new URLSearchParams({ uploadId })
//         );

//         console.log("SwotPlot Data:", response.data);

//         if (!response.data || !response.data.figure) {
//           setError("Graph generation failed. Please check the data or try again.");
//           return;
//         }

//         setLocalGraphData(response.data.figure);
//         // Cache the data
//         setGraphData(cacheKey, response.data.figure);
//       } catch (err) {
//         setError("Graph generation failed. Please check the data or try again");
//         console.error("Graph SwotPlot API Error:", err.response ? err.response.data : err.message);
//       }
//     };

//     fetchGraphData();
//   }, [getGraphData, setGraphData]);

//   return (
//     <div className="w-full px-4 py-6">
//       {error ? (
//         <p className="text-red-500 text-center">{error}</p>
//       ) : graphData && graphData.data && graphData.layout ? (
//         <div className="bg-white dark:bg-gray-900 rounded-xl  p-4 w-full max-w-6xl mx-auto">
//           <Plot
//             data={graphData.data}
//             layout={{
//               ...graphData.layout,
//               autosize: true,
//               responsive: true,
//               title: graphData.layout?.title || 'SWOT Plot',
//               margin: { t: 30, l: 10, r: 10, b: 30 },
//             }}
//             useResizeHandler={true}
//             style={{ width: '100%', height: '100%' }}
//             config={{
//               responsive: true,
//               displaylogo: false,
//               ...(graphData?.config || {}),
//             }}
//           />
//         </div>
//       ) : (


//  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>

//       )}
//     </div>
//   );
// };

// export default SwotPlot;



// import React, { useEffect, useState } from 'react';

// export default function SwotPlot() {
//   const [raw, setRaw] = useState(null);
//   const [rateType, setRateType] = useState('FD');
//   const [returnType, setReturnType] = useState('nominal');
//   const [quads, setQuads] = useState({
//     Strengths: [],
//     Opportunities: [],
//     Weaknesses: [],
//     Threats: [],
//   });
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalQuad, setModalQuad] = useState('');
//   const uploadId = localStorage.getItem('uploadId');
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     fetch(`${API_BASE}/file/create_swot_plot`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams({ uploadId }),
//     })
//       .then((r) => r.json())
//       .then((json) => setRaw(json))
//       .catch(console.error);
//   }, [uploadId]);

//   useEffect(() => {
//     if (!raw || !raw[rateType] || !raw[rateType][returnType]) {
//       console.warn('Missing data for:', rateType, returnType);
//       return;
//     }

//     const { x, y, text, hover } = raw[rateType][returnType];
//     const newQuads = {
//       Strengths: [],
//       Opportunities: [],
//       Weaknesses: [],
//       Threats: [],
//     };

//     // Categorize data into quadrants
//     for (let i = 0; i < x.length; i++) {
//       const item = { label: text[i], desc: hover[i] };
//       if (x[i] > 0 && y[i] > 0) {
//         newQuads.Strengths.push(item);
//       } else if (x[i] > 0 && y[i] < 0) {
//         newQuads.Opportunities.push(item);
//       } else if (x[i] < 0 && y[i] > 0) {
//         newQuads.Weaknesses.push(item);
//       } else if (x[i] < 0 && y[i] < 0) {
//         newQuads.Threats.push(item);
//       }
//     }

//     setQuads(newQuads);
//   }, [rateType, returnType, raw]);

//   if (!raw) {
//     return (
//       <div
//         style={{
//           textAlign: 'center',
//           padding: '60px',
//           fontSize: '18px',
//           color: '#666',
//         }}
//       >
//         Loading SWOT…
//       </div>
//     );
//   }

//   const quadrantMeta = [
//     { key: 'Strengths', color: '#5ac709' },
//     { key: 'Weaknesses', color: '#e73245' },
//     { key: 'Opportunities', color: '#00b9e5' },
//     { key: 'Threats', color: '#F57C00' },
//   ];

//   const THRESHOLD = 5;

//   return (
//     <div
//       style={{
//         padding: '32px',
//         background: '#ffffff',
//         borderRadius: '16px',
//         margin: '24px',
//       }}
//     >
//       <div
//         style={{
//           maxWidth: '1200px',
//           margin: '0 auto',
//           padding: '24px',
//           fontFamily: "'Segoe UI', Roboto, sans-serif",
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: '16px',
//             marginBottom: '24px',
//           }}
//         >
//           <select
//             value={rateType}
//             onChange={(e) => setRateType(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               border: '1px solid #DDD',
//               borderRadius: '8px',
//               background: '#FAFAFA',
//               fontSize: '14px',
//             }}
//           >
//             <option value="FD">FD Rates</option>
//             <option value="MF">Mutual Fund Rates</option>
//           </select>
//           <select
//             value={returnType}
//             onChange={(e) => setReturnType(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               border: '1px solid #DDD',
//               borderRadius: '8px',
//               background: '#FAFAFA',
//               fontSize: '14px',
//             }}
//           >
//             <option value="nominal">Nominal</option>
//             <option value="real">Inflation-Adjusted</option>
//           </select>
//         </div>

//         <h2 style={{ textAlign: 'center', color: '#333333', marginBottom: '10px' }}>
//           SWOT Analysis
//         </h2>

//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(2,1fr)',
//             gridTemplateRows: 'repeat(2,1fr)',
//             gap: '24px',
//           }}
//         >
//           {quadrantMeta.map(({ key, color }) => (
//             <div
//               key={key}
//               className="swot-card-grid"
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 border: `2px solid ${color}`,
//                 borderRadius: '12px',
//                 background: '#FFF',
//                 boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
//                 overflow: 'hidden',
//                 transition: 'transform .2s, box-shadow .2s',
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   padding: '12px 16px',
//                   backgroundColor: `${color}20`,
//                 }}
//               >
//                 <h3 style={{ color, fontSize: '18px', margin: 0 }}>{key}</h3>
//                 <span
//                   style={{
//                     background: '#FFF',
//                     padding: '4px 8px',
//                     borderRadius: '50%',
//                     fontWeight: 600,
//                   }}
//                 >
//                   {quads[key].length}
//                 </span>
//               </div>

//               <div
//                 style={{
//                   flex: 1,
//                   padding: '16px',
//                   fontSize: '14px',
//                   color: '#444',
//                 }}
//               >
//                 {quads[key].slice(0, THRESHOLD).map((item, i) => (
//                   <p key={i} title={item.desc} style={{ margin: '0 0 8px 0' }}>
//                     {item.label}
//                   </p>
//                 ))}
//                 {quads[key].length === 0 && (
//                   <p
//                     style={{
//                       fontStyle: 'italic',
//                       color: '#888',
//                       margin: '0 0 8px 0',
//                     }}
//                   >
//                     No {key}
//                   </p>
//                 )}
//               </div>

//               {quads[key].length > THRESHOLD && (
//                 <div
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'flex-end',
//                     alignItems: 'center',
//                     padding: '12px 16px',
//                     borderTop: '1px solid rgba(0,0,0,0.05)',
//                     cursor: 'pointer',
//                     fontWeight: 500,
//                   }}
//                   onClick={() => {
//                     setModalQuad(key);
//                     setModalOpen(true);
//                   }}
//                 >
//                   <span>See more</span>
//                   <span style={{ marginLeft: '8px', fontSize: '16px' }}>→</span>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {modalOpen && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backdropFilter: 'blur(6px)',
//             background: 'rgba(0,0,0,0.25)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 1000,
//           }}
//           onClick={() => setModalOpen(false)}
//         >
//           <div
//             style={{
//               background: '#fff',
//               borderRadius: '12px',
//               padding: '24px',
//               width: '90%',
//               maxWidth: '480px',
//               maxHeight: '80vh',
//               overflowY: 'auto',
//               boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: '16px',
//               }}
//             >
//               <h2 style={{ margin: 0, fontSize: '20px' }}>{modalQuad}</h2>
//               <button
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '24px',
//                   cursor: 'pointer',
//                   color: '#333',
//                 }}
//                 onClick={() => setModalOpen(false)}
//               >
//                 ×
//               </button>
//             </div>
//             <div>
//               {quads[modalQuad].map((item, idx) => (
//                 <div
//                   key={idx}
//                   title={item.desc}
//                   style={{
//                     padding: '8px 0',
//                     fontSize: '14px',
//                     color: '#444',
//                     borderBottom: '1px solid rgba(0,0,0,0.05)',
//                   }}
//                 >
//                   {item.label}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       <style>
//         {`
//           .swot-card-grid:hover {
//             transform: translateY(-4px);
//             box-shadow: 0 8px 24px rgba(0,0,0,0.12);
//           }
//         `}
//       </style>
//     </div>
//   );
// }






import React, { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';

export default function SwotPlot() {
  const [raw, setRaw] = useState(null);
  const [rateType, setRateType] = useState('FD');
  const [returnType, setReturnType] = useState('nominal');
  const [quads, setQuads] = useState({
    Strengths: [],
    Opportunities: [],
    Weaknesses: [],
    Threats: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalQuad, setModalQuad] = useState('');
  const uploadId = localStorage.getItem('uploadId');
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    fetch(`${API_BASE}/file/create_swot_plot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ uploadId }),
    })
      .then((r) => r.json())
      .then((json) => setRaw(json))
      .catch(console.error);
  }, [uploadId]);

  useEffect(() => {
    if (!raw || !raw[rateType] || !raw[rateType][returnType]) {
      console.warn('Missing data for:', rateType, returnType);
      return;
    }

    const { x, y, text, hover } = raw[rateType][returnType];
    const newQuads = {
      Strengths: [],
      Opportunities: [],
      Weaknesses: [],
      Threats: [],
    };

    // Categorize data into quadrants
    // for (let i = 0; i < x.length; i++) {
    //   const item = { label: text[i], desc: hover[i] };
    //   if (x[i] > 0 && y[i] > 0) {
    //     newQuads.Strengths.push(item);
    //   } else if (x[i] > 0 && y[i] < 0) {
    //     newQuads.Opportunities.push(item);
    //   } else if (x[i] < 0 && y[i] > 0) {
    //     newQuads.Weaknesses.push(item);
    //   } else if (x[i] < 0 && y[i] < 0) {
    //     newQuads.Threats.push(item);
    //   }
    // }

    for (let i = 0; i < x.length; i++) {
      const item = { label: text[i], desc: hover[i] };
      if (x[i] > 0 && y[i] > 0) {
        newQuads.Opportunities.push(item);
      } else if (x[i] > 0 && y[i] < 0) {
        newQuads.Threats.push(item);
      } else if (x[i] < 0 && y[i] > 0) {
        newQuads.Strengths.push(item);
      } else if (x[i] < 0 && y[i] < 0) {
        newQuads.Weaknesses.push(item);
      }
    }


    setQuads(newQuads);
  }, [rateType, returnType, raw]);

  if (!raw) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }

  const quadrantMeta = [
    { key: 'Strengths', color: '#4CAF50', icon: '💪' },
    { key: 'Weaknesses', color: '#F44336', icon: '⚠️' },
    { key: 'Opportunities', color: '#2196F3', icon: '🔍' },
    { key: 'Threats', color: '#FF9800', icon: '⚠️' },
  ];

  const THRESHOLD = 5;

  return (
    <div className="swot-container">
      <div className="swot-header">
        <h1>SWOT Analysis Matrix</h1>
        <div className="swot-controls">
          <select
            value={rateType}
            onChange={(e) => setRateType(e.target.value)}
            className="swot-select"
          >
            <option value="FD">FD Rates</option>
            <option value="MF">Mutual Fund Rates</option>
          </select>
          <select
            value={returnType}
            onChange={(e) => setReturnType(e.target.value)}
            className="swot-select"
          >
            <option value="nominal">Nominal</option>
            <option value="real">Inflation-Adjusted</option>
          </select>
        </div>
      </div>

      <div className="swot-grid">
        {quadrantMeta.map(({ key, color, icon }) => (
          <div
            key={key}
            className="swot-card"
            style={{ borderColor: color }}
          >
            <div className="swot-card-header" style={{ backgroundColor: `${color}20` }}>
              <span className="swot-icon">{icon}</span>
              <h3>{key}</h3>
              <span className="swot-count">{quads[key].length}</span>
            </div>

            <div className="swot-card-body">
              {quads[key].slice(0, THRESHOLD).map((item, i) => (
                <div key={i} className="swot-item" title={item.desc}>
                  <div className="swot-bullet" style={{ backgroundColor: color }}></div>
                  <span>{item.label}</span>
                </div>
              ))}
              {quads[key].length === 0 && (
                <div className="swot-empty">No {key} identified</div>
              )}
            </div>

            {quads[key].length > THRESHOLD && (
              <div
                className="swot-see-more"
                onClick={() => {
                  setModalQuad(key);
                  setModalOpen(true);
                }}
              >
                <span>View all {quads[key].length} items</span>
                <span className="swot-arrow">→</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="swot-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="swot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="swot-modal-header">
              <h2>{modalQuad}</h2>
              <button onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="swot-modal-body">
              {quads[modalQuad].map((item, idx) => (
                <div key={idx} className="swot-modal-item" title={item.desc}>
                  <div className="swot-modal-bullet"></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .swot-container {
          padding: 20px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          max-width: 1000px;
          margin: 0 auto;
          height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #4CAF50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .loading-text {
          font-size: 18px;
          color: #666;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .swot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .swot-header h1 {
          font-size: 24px;
          color: #333;
          margin: 0;
        }
        
        .swot-controls {
          display: flex;
          gap: 12px;
        }
        
        .swot-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f9f9f9;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .swot-select:hover {
          border-color: #bbb;
          background: #fff;
        }
        
        .swot-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 16px;
          flex: 1;
          min-height: 0;
        }
        
        .swot-card {
          display: flex;
          flex-direction: column;
          border: 2px solid;
          border-radius: 12px;
          background: #FFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        
        .swot-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .swot-card-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 10px;
        }
        
        .swot-icon {
          font-size: 20px;
        }
        
        .swot-card-header h3 {
          font-size: 16px;
          margin: 0;
          flex: 1;
          color: #333;
        }
        
        .swot-count {
          background: #fff;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
        }
        
        .swot-card-body {
          flex: 1;
          padding: 12px;
          overflow: auto;
          min-height: 0;
        }
        
        .swot-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 13px;
          line-height: 1.4;
        }
        
        .swot-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }
        
        .swot-empty {
          font-style: italic;
          color: #888;
          text-align: center;
          padding: 10px;
          font-size: 13px;
        }
        
        .swot-see-more {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          border-top: 1px solid rgba(0,0,0,0.05);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #666;
          transition: background 0.2s;
        }
        
        .swot-see-more:hover {
          background: rgba(0,0,0,0.02);
        }
        
        .swot-arrow {
          font-size: 16px;
        }
        
        .swot-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        
        .swot-modal {
          background: #fff;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 70vh;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .swot-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #eee;
        }
        
        .swot-modal-header h2 {
          margin: 0;
          font-size: 18px;
        }
        
        .swot-modal-header button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }
        
        .swot-modal-header button:hover {
          background: #f5f5f5;
        }
        
        .swot-modal-body {
          padding: 16px;
          overflow-y: auto;
          flex: 1;
        }
        
        .swot-modal-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #f5f5f5;
          font-size: 14px;
        }
        
        .swot-modal-bullet {
          width: 6px;
          height: 6px;
          background: #666;
          border-radius: 50%;
          margin-top: 7px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}