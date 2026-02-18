
// import React, { useEffect, useState } from 'react';
// import { ResponsivePie } from '@nivo/pie';
// import { FaChartPie, FaBuilding, FaPortrait, FaInfoCircle, FaUserTie, FaUsers, FaGlobe, FaUniversity, FaEllipsisH } from 'react-icons/fa';

// const categoryIcons = {
//   Promoter: <FaUserTie />,
//   Public: <FaUsers />,
//   FII: <FaGlobe />,
//   DII: <FaUniversity />,
//   Others: <FaEllipsisH />,
// };

// export default function ShareholdingPlot() {
//   const [apiData, setApiData] = useState(null);
//   const [selected, setSelected] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  
//   useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE}/file/get_shareholding_data`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: new URLSearchParams({ uploadId })
//         })
//       .then(res => res.json())
//       .then(data => {
//         setApiData(data);
//         setSelected(data.symbols[0]);
//         setIsLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setIsLoading(false);
//       });
//   }, []);

//   if (isLoading) {
//     return (
//       <div style={{
//         width: '98vw',
//         maxWidth: '1400px',
//         padding: '20px',
//         boxSizing: 'border-box',
//         fontFamily: "'Inter', 'Segoe UI', sans-serif",
//         borderRadius: '16px',
//         margin: '24px auto'
//       }}>
//         <div style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(255, 255, 255, 0.9)',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 100,
//           borderRadius: '16px'
//         }}>
//           <div style={{
//             width: '50px',
//             height: '50px',
//             border: '4px solid rgba(67, 97, 238, 0.2)',
//             borderTop: '4px solid #4361ee',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             marginBottom: '1.5rem'
//           }}></div>
//           <div style={{
//             fontSize: '1.1rem',
//             fontWeight: 500,
//             color: '#495057'
//           }}>Analyzing shareholding data...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!apiData || !selected) {
//     return (
//       <div style={{
//         width: '98vw',
//         maxWidth: '1400px',
//         padding: '20px',
//         boxSizing: 'border-box',
//         fontFamily: "'Inter', 'Segoe UI', sans-serif",
//         borderRadius: '16px',
//         margin: '24px auto'
//       }}>
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: '3rem',
//           textAlign: 'center'
//         }}>
//           <FaInfoCircle style={{ fontSize: '3rem', color: '#ced4da', marginBottom: '1.5rem' }} />
//           <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#343a40' }}>Data Unavailable</h3>
//           <p style={{ color: '#6c757d', maxWidth: '500px' }}>Could not load shareholding data. Please try again later.</p>
//         </div>
//       </div>
//     );
//   }

//   const {
//     categories,
//     portfolio_exposures,
//     company_shareholdings,
//     symbols,
//     latest_date
//   } = apiData;

//   const portfolioData = categories.map((cat, i) => ({
//     id: cat,
//     label: cat,
//     value: portfolio_exposures[i],
//   }));

//   const companyData = company_shareholdings
//     .find(c => c.symbol === selected)
//     .values.map((v, i) => ({
//       id: categories[i],
//       label: categories[i],
//       value: v,
//     }));

//   // Premium color palette
//   const colors = ["#4361ee", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#8e44ad", "#27ae60", "#e74c3c", "#3498db"];

//   const commonProps = {
//     innerRadius: 0.5,
//     padAngle: 0.7,
//     cornerRadius: 6,
//     colors,
//     borderWidth: 1,
//     borderColor: { from: 'color', modifiers: [['darker', 0.2]] },
//     enableArcLinkLabels: true,
//     arcLinkLabelsThickness: 2,
//     arcLinkLabelsColor: { from: 'color' },
//     arcLinkLabelsTextColor: '#333333',
//     arcLabelsSkipAngle: 10,
//     enableArcLabels: false,
//     motionConfig: "gentle",
//     animate: true,
//     tooltip: ({ datum }) => (
//       <div style={{
//         background: 'white',
//         padding: '12px 16px',
//         borderRadius: '8px',
//         boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//         border: '1px solid rgba(241, 245, 249, 0.8)',
//         minWidth: '180px'
//       }}>
//         <div style={{
//           fontSize: '1rem',
//           fontWeight: 700,
//           color: '#212529',
//           marginBottom: '4px'
//         }}>{datum.id}</div>
//         <div style={{
//           fontSize: '1.2rem',
//           fontWeight: 700,
//           color: '#4361ee'
//         }}>{datum.value.toFixed(2)}%</div>
//       </div>
//     )
//   };

//   // Calculate portfolio metrics
//   const topPortfolioCategory = portfolioData.reduce((max, item) =>
//     item.value > max.value ? item : max, portfolioData[0]);

//   const topCompanyCategory = companyData.reduce((max, item) =>
//     item.value > max.value ? item : max, companyData[0]);

//   return (
//     <div style={{
//       width: '98vw',
//       maxWidth: '1400px',
//       padding: '20px',
//       boxSizing: 'border-box',
//       fontFamily: "'Inter', 'Segoe UI', sans-serif",
//       borderRadius: '16px',
//       margin: '24px auto'
//     }}>
//       <div style={{
//         position: 'relative',
//         background: 'rgba(255, 255, 255, 0.85)',
//         borderRadius: '16px',
//         boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)',
//         overflow: 'hidden',
//         border: '1px solid rgba(241, 245, 249, 0.6)',
//         backdropFilter: 'blur(10px)'
//       }}>
//         <div style={{
//           position: 'relative',
//           padding: '24px 32px 16px',
//           background: 'linear-gradient(120deg, rgba(249, 250, 251, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%)',
//           borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'flex-start',
//           flexWrap: 'wrap'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '1rem',
//             marginBottom: '1rem'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: '48px',
//               height: '48px',
//               background: 'linear-gradient(135deg, #4361ee 0%, #2a44c4 100%)',
//               borderRadius: '12px',
//               color: 'white',
//               fontSize: '1.5rem',
//               boxShadow: '0 4px 6px rgba(67, 97, 238, 0.2)'
//             }}>
//               <FaChartPie />
//             </div>
//             <div>
//               <h2 style={{
//                 fontSize: '1.6rem',
//                 fontWeight: 700,
//                 color: '#212529',
//                 marginBottom: '6px',
//                 letterSpacing: '-0.5px'
//               }}>Shareholding Analysis</h2>
//               <p style={{
//                 fontSize: '1rem',
//                 color: '#6c757d',
//                 fontWeight: 500,
//                 margin: 0
//               }}>Portfolio exposure and company shareholding distribution</p>
//             </div>
//           </div>
//         </div>

//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(2, 1fr)',
//           gap: '1.5rem',
//           margin: '1.5rem 32px'
//         }}>
//           <div style={{
//             background: 'white',
//             borderRadius: '8px',
//             padding: '1.25rem',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//             border: '1px solid #edf2f7',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '1rem'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: '48px',
//               height: '48px',
//               borderRadius: '12px',
//               background: '#f0f4fe',
//               color: '#4361ee',
//               fontSize: '1.25rem'
//             }}>
//               {categoryIcons[topCompanyCategory.id] || <FaEllipsisH />}
//             </div>
//             <div style={{ flex: 1 }}>
//               <div style={{
//                 fontSize: '0.9rem',
//                 color: '#6c757d',
//                 marginBottom: '0.25rem',
//                 fontWeight: 500
//               }}>Top {selected} Category</div>
//               <div style={{
//                 fontSize: '1.4rem',
//                 fontWeight: 700,
//                 color: '#212529'
//               }}>{topCompanyCategory.id}</div>
//               <div style={{
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 color: '#4361ee'
//               }}>{topCompanyCategory.value.toFixed(2)}%</div>
//             </div>
//           </div>

//           <div style={{
//             background: 'white',
//             borderRadius: '8px',
//             padding: '1.25rem',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)',
//             border: '1px solid #edf2f7',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '1rem'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: '48px',
//               height: '48px',
//               borderRadius: '12px',
//               background: '#f0f4fe',
//               color: '#4361ee',
//               fontSize: '1.25rem'
//             }}>
//               {categoryIcons[topPortfolioCategory.id] || <FaEllipsisH />}
//             </div>
//             <div style={{ flex: 1 }}>
//               <div style={{
//                 fontSize: '0.9rem',
//                 color: '#6c757d',
//                 marginBottom: '0.25rem',
//                 fontWeight: 500
//               }}>Top Portfolio Category</div>
//               <div style={{
//                 fontSize: '1.4rem',
//                 fontWeight: 700,
//                 color: '#212529'
//               }}>{topPortfolioCategory.id}</div>
//               <div style={{
//                 fontSize: '1rem',
//                 fontWeight: 600,
//                 color: '#4361ee'
//               }}>{topPortfolioCategory.value.toFixed(2)}%</div>
//             </div>
//           </div>
//         </div>

//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(2, 1fr)',
//           gap: '1.5rem',
//           padding: '0 32px 20px',
//           width: '100%'
//         }}>
//           <div style={{
//             background: 'white',
//             borderRadius: '12px',
//             boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
//             overflow: 'hidden',
//             border: '1px solid #e2e8f0'
//           }}>
//             <div style={{
//               padding: '16px 24px',
//               background: 'linear-gradient(120deg, rgba(249, 250, 251, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%)',
//               borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}>
//               <h3 style={{
//                 fontSize: '1.1rem',
//                 fontWeight: 600,
//                 color: '#343a40',
//                 margin: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem'
//               }}>
//                 <FaBuilding style={{ color: '#4361ee' }} /> {selected} Shareholding
//               </h3>
//               <div style={{
//                 display: 'flex',
//                 gap: '0.75rem'
//               }}>
//                 <select
//                   value={selected}
//                   onChange={e => setSelected(e.target.value)}
//                   style={{
//                     padding: '8px 16px',
//                     border: '1px solid #e2e8f0',
//                     borderRadius: '8px',
//                     background: 'white',
//                     color: '#343a40',
//                     fontSize: '0.95rem',
//                     fontWeight: 500,
//                     cursor: 'pointer',
//                     boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
//                   }}
//                   className="premium-select"
//                 >
//                   {symbols.map(sym => (
//                     <option key={sym} value={sym}>{sym}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div style={{
//               height: '350px',
//               padding: '16px'
//             }}>
//               <ResponsivePie
//                 data={companyData}
//                 {...commonProps}
//                 margin={{ top: 20, right: 20, bottom: 80, left: 20 }}
//                 legends={[
//                   {
//                     anchor: 'bottom',
//                     direction: 'row',
//                     translateY: 50,
//                     itemsSpacing: 10,
//                     itemWidth: 80,
//                     itemHeight: 14,
//                     symbolSize: 12,
//                     symbolShape: 'circle',
//                     itemDirection: 'left-to-right'
//                   }
//                 ]}
//                 theme={{
//                   fontFamily: 'Inter, sans-serif',
//                   fontSize: 12,
//                   textColor: '#4b5563',
//                   tooltip: {
//                     container: {
//                       background: 'white',
//                       color: '#1f2937',
//                       fontSize: '12px',
//                       borderRadius: '8px',
//                       boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//                       padding: '12px',
//                       border: '1px solid #f3f4f6'
//                     }
//                   },
//                   legends: {
//                     text: {
//                       fontSize: 11,
//                       fontWeight: 500
//                     }
//                   }
//                 }}
//               />
//             </div>
//           </div>

//           <div style={{
//             background: 'white',
//             borderRadius: '12px',
//             boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
//             overflow: 'hidden',
//             border: '1px solid #e2e8f0'
//           }}>
//             <div style={{
//               padding: '16px 24px',
//               background: 'linear-gradient(120deg, rgba(249, 250, 251, 0.7) 0%, rgba(240, 244, 248, 0.7) 100%)',
//               borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}>
//               <h3 style={{
//                 fontSize: '1.1rem',
//                 fontWeight: 600,
//                 color: '#343a40',
//                 margin: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem'
//               }}>
//                 <FaPortrait style={{ color: '#4361ee' }} /> Portfolio Exposure
//               </h3>
//             </div>
//             <div style={{
//               height: '350px',
//               padding: '16px'
//             }}>
//               <ResponsivePie
//                 data={portfolioData}
//                 {...commonProps}
//                 margin={{ top: 20, right: 20, bottom: 80, left: 20 }}
//                 legends={[
//                   {
//                     anchor: 'bottom',
//                     direction: 'row',
//                     translateY: 50,
//                     itemsSpacing: 10,
//                     itemWidth: 80,
//                     itemHeight: 14,
//                     symbolSize: 12,
//                     symbolShape: 'circle',
//                     itemDirection: 'left-to-right'
//                   }
//                 ]}
//                 theme={{
//                   fontFamily: 'Inter, sans-serif',
//                   fontSize: 12,
//                   textColor: '#4b5563',
//                   tooltip: {
//                     container: {
//                       background: 'white',
//                       color: '#1f2937',
//                       fontSize: '12px',
//                       borderRadius: '8px',
//                       boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//                       padding: '12px',
//                       border: '1px solid #f3f4f6'
//                     }
//                   },
//                   legends: {
//                     text: {
//                       fontSize: 11,
//                       fontWeight: 500
//                     }
//                   }
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         <div style={{
//           padding: '1.5rem 32px',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           borderTop: '1px solid rgba(226, 232, 240, 0.5)'
//         }}>
//           <div style={{
//             display: 'flex',
//             gap: '1.25rem',
//             flexWrap: 'wrap',
//             justifyContent: 'center'
//           }}>
//             {categories.map((category, index) => (
//               <div key={index} style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 fontSize: '0.9rem',
//                 fontWeight: 500,
//                 background: 'rgba(240, 244, 254, 0.6)',
//                 padding: '6px 12px',
//                 borderRadius: '20px'
//               }}>
//                 <div style={{
//                   width: '12px',
//                   height: '12px',
//                   borderRadius: '50%',
//                   backgroundColor: colors[index % colors.length]
//                 }}></div>
//                 <span>{category}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//             .slice path {
//               opacity: 0;
//               animation: slice-appear 0.6s ease-out forwards;
//               animation-delay: calc(var(--index) * 0.1s);
//             }
//             @keyframes slice-appear {
//               from { 
//                 opacity: 0;
//                 transform: scale(0.9);
//               }
//               to { 
//                 opacity: 1;
//                 transform: scale(1);
//               }
//             }
//             .premium-select:hover {
//               border-color: #cbd5e0;
//             }
//             .premium-select:focus {
//               outline: none;
//               border-color: #4361ee;
//               box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
//             }
//           `}
//         </style>
//       </div>
//     </div>
//   );
// }





// import React, { useEffect, useState } from 'react';
// import { ResponsivePie } from '@nivo/pie';
// import { FaChartPie, FaBuilding, FaPortrait, FaInfoCircle, FaUserTie, FaUsers, FaGlobe, FaUniversity, FaEllipsisH } from 'react-icons/fa';
// import { HashLoader } from 'react-spinners';

// const categoryIcons = {
//   Promoter: <FaUserTie />,
//   Public: <FaUsers />,
//   FII: <FaGlobe />,
//   DII: <FaUniversity />,
//   Others: <FaEllipsisH />,
// };

// export default function ShareholdingPlot() {
//   const [apiData, setApiData] = useState(null);
//   const [selected, setSelected] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const uploadId = localStorage.getItem("uploadId");
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE}/file/get_shareholding_data`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: new URLSearchParams({ uploadId })
//     })
//       .then(res => res.json())
//       .then(data => {
//         setApiData(data);
//         setSelected(data.symbols[0]);
//         setIsLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setIsLoading(false);
//       });
//   }, []);

//   if (isLoading) {
//     return (
//      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>
//     );
//   }

//   if (!apiData || !selected) {
//     return (
//       <div style={{
//         width: '100%',
//         maxWidth: '1500px',
//         margin: '16px auto',
//         padding: '16px',
//         fontFamily: "'Inter', 'Segoe UI', sans-serif",
//         overflow: 'hidden',
//       }}>
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           background: '#ffffff',
//           borderRadius: '12px',
//           boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//           padding: '2rem',
//           overflow: 'hidden',
//         }}>
//           <FaInfoCircle style={{ fontSize: '2.5rem', color: '#9ca3af', marginBottom: '1rem' }} />
//           <h3 style={{ fontSize: '1.25rem', color: '#1f2937', marginBottom: '0.5rem' }}>Data Unavailable</h3>
//           <p style={{ color: '#6b7280', maxWidth: '400px', textAlign: 'center' }}>
//             Could not load shareholding data. Please try again later.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const { categories, portfolio_exposures, company_shareholdings, symbols } = apiData;

//   const portfolioData = categories.map((cat, i) => ({
//     id: cat,
//     label: cat,
//     value: portfolio_exposures[i],
//   }));

//   const companyData = company_shareholdings
//     .find(c => c.symbol === selected)
//     .values.map((v, i) => ({
//       id: categories[i],
//       label: categories[i],
//       value: v,
//     }));

//   const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#8e44ad'];

//   const commonProps = {
//     innerRadius: 0.55,
//     padAngle: 0.5,
//     cornerRadius: 8,
//     colors,
//     borderWidth: 0.5,
//     borderColor: { from: 'color', modifiers: [['darker', 0.1]] },
//     enableArcLinkLabels: true,
//     arcLinkLabelsThickness: 2,
//     arcLinkLabelsColor: { from: 'color', modifiers: [['darker', 0.2]] },
//     arcLinkLabelsTextColor: '#1f2937',
//     arcLabelsSkipAngle: 12,
//     enableArcLabels: false,
//     motionConfig: 'default',
//     animate: true,
//     tooltip: ({ datum }) => (
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         background: '#ffffff',
//         padding: '8px 12px',
//         borderRadius: '4px',
//         boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//         fontSize: '0.875rem',
//         border: '1px solid #f1f5f9',
//       }}>
//         <span style={{ fontWeight: 600, color: '#1f2937' }}>{datum.id}</span>
//         <span style={{ fontWeight: 700, color: '#3b82f6' }}>{datum.value.toFixed(2)}%</span>
//       </div>
//     )
//   };

// // Calculate portfolio metrics
//   const topPortfolioCategory = portfolioData.reduce((max, item) =>
//     item.value > max.value ? item : max, portfolioData[0]);

//   const topCompanyCategory = companyData.reduce((max, item) =>
//     item.value > max.value ? item : max, companyData[0]);

//   return (
//     <div style={{
//       width: '100%',
//       maxWidth: '1500px',
//       margin: '0 auto',
//       padding: '16px',
//       fontFamily: "'Inter', sans-serif",
//       overflow: 'hidden',
//     }}>
//       <div style={{
//         background: '#ffffff',
//         borderRadius: '8px',
//         boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
//         overflow: 'hidden',
//         border: '1px solid #f1f1f1',
//       }}>
//         <div style={{
//           padding: '10px 20px',
//           backgroundColor: '#f9fafb',
//           borderBottom: '1px solid #e5e7eb',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '12px',
//         }}>
//           <div style={{
//             width: '32px',
//             height: '32px',
//             background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
//             borderRadius: '6px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: '#fff',
//             fontSize: '1.1rem',
//           }}>
//             <FaChartPie />
//           </div>
//           <div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: '0' }}>
//               Shareholding Analysis
//             </h3>
//             <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '2px 0 0' }}>
//               Portfolio & company distribution
//             </p>
//           </div>
//         </div>

//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
//           gap: '12px',
//           padding: '16px',
//           overflow: 'hidden',
//         }}>
//           <div style={{
//             background: '#f9fafb',
//             borderRadius: '6px',
//             padding: '10px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             border: '1px solid #e5e7eb',
//             overflow: 'hidden',
//           }}>
//             <div style={{
//               width: '32px',
//               height: '32px',
//               borderRadius: '6px',
//               background: '#eff6ff',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: '#3b82f6',
//               fontSize: '0.95rem',
//             }}>
//               {categoryIcons[topCompanyCategory.id] || <FaEllipsisH />}
//             </div>
//             <div>
//               <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>
//                 Top {selected} Category
//               </span>
//               <h4 style={{ fontSize: '1.1rem', margin: '2px 0 #111827', color: '#4b0082' }}>
//                 {topCompanyCategory.id}
//               </h4>
//               <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6' }}>
//                 {topCompanyCategory.value.toFixed(2)}%
//               </span>

//             </div>
//           </div>
//           <div style={{
//             background: '#f9fafb',
//             borderRadius: '6px',
//             padding: '10px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             border: '1px solid #e5e7eb',
//             overflow: 'hidden'
//           }}>
//             <div style={{
//               width: '32px',
//               height: '32px',
//               borderRadius: '6px',
//               background: '#eff6ff',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: '#3b82f6',
//               fontSize: '0.95rem',
//             }}>
//               {categoryIcons[topPortfolioCategory.id] || <FaEllipsisH />}
//             </div>
//             <div>
//               <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>
//                 Top Portfolio Category
//               </span>
//               <h4 style={{ fontSize: '1.1rem', color: '#111827', margin: '2px 0' }}>
//                 {topPortfolioCategory.id}
//               </h4>
//               <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6' }}>
//                 {topPortfolioCategory.value.toFixed(2)}%
//               </span>
//             </div>
//           </div>
//         </div>

//         <div style={{
//           display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
//           gap: '12px',
//           padding: '0 16px 16px',
//           overflow: 'hidden',
//         }}>
//           <div style={{
//             background: '#fff',
//             borderRadius: '6px',
//             border: '1px solid #e5e7eb',
//             overflow: 'hidden',
//           }}>
//             <div style={{
//               padding: '10px 12px',
//               background: '#f9fafb',
//               borderBottom: '1px solid #e5e7eb',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//             }}>
//               <h3 style={{
//                 fontSize: '0.95rem',
//                 fontWeight: 600,
//                 color: '#111827',
//                 margin: '0',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '6px',
//               }}>
//                 <FaBuilding style={{ color: '#3b82f6' }} /> {selected} Shareholding
//               </h3>
//               <select
//                 value={selected}
//                 onChange={e => setSelected(e.target.value)}
//                 style={{
//                   padding: '5px 10px',
//                   border: '1px solid #d1d5db',
//                   borderRadius: '5px',
//                   background: '#fff',
//                   color: '#111827',
//                   fontSize: '0.85rem',
//                   fontWeight: 500,
//                   cursor: 'pointer',
//                 }}
//                 className="premium-select"
//               >
//                 {symbols.map(sym => (
//                   <option key={sym} value={sym}>{sym}</option>
//                 ))}
//               </select>
//             </div>
//             <div style={{ height: '310px', padding: '10px', overflow: 'hidden' }}>
//               <ResponsivePie
//                 data={companyData}
//                 {...commonProps}
//                 margin={{ top: 15, right: 15, bottom: 50, left: 15 }}
//                 legends={[{
//                   anchor: 'bottom',
//                   direction: 'row',
//                   translateY: 45,
//                   itemsSpacing: 6,
//                   itemWidth: 65,
//                   itemHeight: 10,
//                   symbolSize: 8,
//                   symbolShape: 'circle',
//                 }]}
//                 theme={{
//                   fontFamily: 'Inter, sans-serif',
//                   fontSize: 10,
//                   textColor: '#4b5563',
//                   tooltip: { container: { background: '#fff', color: '#111827', fontSize: '10px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } },
//                   legends: { text: { fontSize: 9, fontWeight: 500 } }
//                 }}
//               />
//             </div>
//           </div>

//           <div style={{
//             background: '#fff',
//             borderRadius: '6px',
//             border: '1px solid #e5e7eb',
//             overflow: 'hidden',
//           }}>
//             <div style={{
//               padding: '10px 12px',
//               background: '#f9fafb',
//               borderBottom: '1px solid #e5e7eb',
//               display: 'flex',
//               alignItems: 'center',
//             }}>
//               <h3 style={{
//                 fontSize: '0.95rem',
//                 fontWeight: 600,
//                 color: '#111827',
//                 margin: '0',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '6px',
//               }}>
//                 <FaPortrait style={{ color: '#3b82f6' }} /> Portfolio Exposure
//               </h3>
//             </div>
//             <div style={{ height: '260px', padding: '10px', overflow: 'hidden' }}>
//               <ResponsivePie
//                 data={portfolioData}
//                 {...commonProps}
//                 margin={{ top: 15, right: 15, bottom: 50, left: 15 }}
//                 legends={[{
//                   anchor: 'bottom',
//                   direction: 'row',
//                   translateY: 45,
//                   itemsSpacing: 6,
//                   itemWidth: 65,
//                   itemHeight: 10,
//                   symbolSize: 8,
//                   symbolShape: 'circle',
//                 }]}
//                 theme={{
//                   fontFamily: 'Inter, sans-serif',
//                   fontSize: 10,
//                   textColor: '#4b5563',
//                   tooltip: { container: { background: '#fff', color: '#111827', fontSize: '10px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } },
//                   legends: { text: { fontSize: 9, fontWeight: 500 } }
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         <div style={{
//           padding: '12px 16px',
//           borderTop: '1px solid #e5e7eb',
//           display: 'flex',
//           justifyContent: 'center',
//           flexWrap: 'wrap',
//           gap: '8px',
//           overflow: 'hidden',
//         }}>
//           {categories.map((category, index) => (
//             <div key={index} style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '6px',
//               fontSize: '0.8rem',
//               fontWeight: 500,
//               background: '#eff6ff',
//               padding: '3px 8px',
//               borderRadius: '10px',
//             }}>
//               <div style={{
//                 width: '8px',
//                 height: '8px',
//                 borderRadius: '50%',
//                 backgroundColor: colors[index % colors.length]
//               }}></div>
//               <span>{category}</span>
//             </div>
//           ))}
//         </div>

//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//             .premium-select {
//               transition: all 0.2s ease;
//             }
//             .premium-select:hover {
//               border-color: #3b82f6;
//               background: #f9fafb;
//             }
//             .premium-select:focus {
//               outline: none;
//               border-color: #3b82f6;
//               box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
//             }
//             html, body {
//               overflow: hidden;
//             }
//           `}
//         </style>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { FaChartPie, FaBuilding, FaPortrait, FaInfoCircle, FaUserTie, FaUsers, FaGlobe, FaUniversity, FaEllipsisH } from 'react-icons/fa';
import { HashLoader } from 'react-spinners';

const categoryIcons = {
  Promoter: <FaUserTie />,
  Public: <FaUsers />,
  FII: <FaGlobe />,
  DII: <FaUniversity />,
  Others: <FaEllipsisH />,
};

export default function ShareholdingPlot() {
  const [apiData, setApiData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const uploadId = localStorage.getItem("uploadId");
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/file/get_shareholding_data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ uploadId })
    })
      .then(res => res.json())
      .then(data => {
        setApiData(data);
        setSelected(data.symbols[0]);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={40} />
        <p className="mt-3 text-sky-700 dark:text-white font-semibold text-sm animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }

  if (!apiData || !selected) {
    return (
      <div className="w-full max-w-4xl mx-auto p-2 font-sans rounded-xl overflow-hidden">
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <FaInfoCircle className="text-2xl text-gray-400 mb-2" />
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">Data Unavailable</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xs text-xs text-center">
            Could not load shareholding data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { categories, portfolio_exposures, company_shareholdings, symbols } = apiData;

  const portfolioData = categories.map((cat, i) => ({
    id: cat,
    label: cat,
    value: portfolio_exposures[i],
  }));

  const companyData = company_shareholdings
    .find(c => c.symbol === selected)
    .values.map((v, i) => ({
      id: categories[i],
      label: categories[i],
      value: v,
    }));

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#8e44ad'];

  const commonProps = {
    innerRadius: 0.55,
    padAngle: 0.5,
    cornerRadius: 8,
    colors,
    borderWidth: 0.5,
    borderColor: { from: 'color', modifiers: [['darker', 0.1]] },
    enableArcLinkLabels: true,
    arcLinkLabelsThickness: 2,
    arcLinkLabelsColor: { from: 'color', modifiers: [['darker', 0.2]] },
    arcLinkLabelsTextColor: '#1f2937',
    arcLabelsSkipAngle: 12,
    enableArcLabels: false,
    motionConfig: 'default',
    animate: true,
    tooltip: ({ datum }) => (
      <div className="flex flex-col bg-white p-2 rounded-md shadow-md border border-gray-100 text-xs">
        <span className="font-semibold text-gray-800">{datum.id}</span>
        <span className="font-bold text-blue-600">{datum.value.toFixed(2)}%</span>
      </div>
    )
  };

  const topPortfolioCategory = portfolioData.reduce((max, item) =>
    item.value > max.value ? item : max, portfolioData[0]);

  const topCompanyCategory = companyData.reduce((max, item) =>
    item.value > max.value ? item : max, companyData[0]);

  return (
    <div className="w-full max-w-6xl mx-auto p-2 font-sans rounded-xl overflow-hidden">
      <div className="bg-white rounded-lg shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center text-white text-sm">
            <FaChartPie />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Shareholding Analysis</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Portfolio & company distribution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-2 flex items-center gap-2 border border-gray-200 dark:border-gray-600">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm">
              {categoryIcons[topCompanyCategory.id] || <FaEllipsisH />}
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Top {selected} Category</span>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{topCompanyCategory.id}</h4>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{topCompanyCategory.value.toFixed(2)}%</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-2 flex items-center gap-2 border border-gray-200 dark:border-gray-600">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm">
              {categoryIcons[topPortfolioCategory.id] || <FaEllipsisH />}
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Top Portfolio Category</span>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{topPortfolioCategory.id}</h4>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{topPortfolioCategory.value.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-0 sm:p-2">
          <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 overflow-hidden">
            <div className="p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                <FaBuilding className="text-blue-600" /> {selected} Shareholding
              </h3>
              <select
                value={selected}
                onChange={e => setSelected(e.target.value)}
                className="p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs font-medium cursor-pointer hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {symbols.map(sym => (
                  <option key={sym} value={sym}>{sym}</option>
                ))}
              </select>
            </div>
            <div className="h-[300px] sm:h-[350px] p-2">
              <ResponsivePie
                data={companyData}
                {...commonProps}
                margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
                legends={[{
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 35,
                  itemsSpacing: 4,
                  itemWidth: 60,
                  itemHeight: 10,
                  symbolSize: 8,
                  symbolShape: 'circle',
                }]}
                theme={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 9,
                  textColor: '#4b5563',
                  tooltip: { container: { background: '#fff', color: '#111827', fontSize: '10px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } },
                  legends: { text: { fontSize: 8, fontWeight: 500 } }
                }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 overflow-hidden">
            <div className="p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                <FaPortrait className="text-blue-600" /> Portfolio Exposure
              </h3>
            </div>
            <div className="h-[250px] sm:h-[350px] p-2">
              <ResponsivePie
                data={portfolioData}
                {...commonProps}
                margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
                legends={[{
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 35,
                  itemsSpacing: 4,
                  itemWidth: 60,
                  itemHeight: 10,
                  symbolSize: 8,
                  symbolShape: 'circle',
                }]}
                theme={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 9,
                  textColor: '#4b5563',
                  tooltip: { container: { background: '#fff', color: '#111827', fontSize: '10px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } },
                  legends: { text: { fontSize: 8, fontWeight: 500 } }
                }}
              />
            </div>
          </div>
        </div>

        <div className="p-2 border-t border-gray-200 dark:border-gray-600 flex justify-center flex-wrap gap-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-1 text-xs font-medium bg-blue-50 dark:bg-blue-900 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}