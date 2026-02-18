// import React, { useState, useEffect } from "react";
// import Plot from "react-plotly.js";

// const TechnicalPlot = ({ symbol }) => {
//   const [plotData, setPlotData] = useState(null); // Store the plot data
//   const [isSpeaking, setIsSpeaking] = useState(false); // Handle speech synthesis state

//   useEffect(() => {
//       if (symbol) {
//         fetch("http://localhost:8080/api/stocks/technical_plot", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ symbol }),
//         })
//           .then((response) => response.json())
//           .then((data) => setPlotData(data)) // Access the figure key from the response
//           .catch((error) => console.error("Error fetching plot data:", error));
//       }
//     }, [symbol]);

//   const handlePlayVoice = () => {
//     if (plotData && plotData.comment) {
//       const utterance = new SpeechSynthesisUtterance(plotData.comment);
//       utterance.onstart = () => setIsSpeaking(true);
//       utterance.onend = () => setIsSpeaking(false);
//       speechSynthesis.speak(utterance);
//     }
//   };

//   if (!plotData) {
//     return <span className="loading loading-bars loading-lg"></span>;
//   }

//   const { figure, comment } = plotData; // Destructure correctly

//   return (
//     <div>
//       <h2 className="text-2xl text-center font-bold mb-3">Technical Plot</h2>
//       <Plot className='m-10'data={figure.data} layout={figure.layout} />
//       <p className="text-l font-bold">{comment}</p>
//       <button className="m-5 btn btn-wide btn-warning" onClick={handlePlayVoice} disabled={isSpeaking}>
//         {isSpeaking ? "Speaking..." : "Play Voice"}
//       </button>
//     </div>
//   );
// }  

// export default TechnicalPlot;



// import React, { useState, useEffect } from "react";
// import { IoIosPlay } from "react-icons/io";
// import { RiInformation2Fill } from "react-icons/ri";
// import { TbPlayerPauseFilled } from "react-icons/tb";
// import Plot from "react-plotly.js";

// const TechnicalPlot = ({ symbol }) => {
//   const [plotData, setPlotData] = useState(null); // Store the plot data
//   const [isSpeaking, setIsSpeaking] = useState(false); // Handle speech synthesis state
//   const [showComment,setShowComment]=useState(false)
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     if (symbol) {
//       // fetch("http://192.168.1.250:8080/CMDA-3.3.9/api/stocks/technical_plot", {
//         fetch(`${API_BASE}/api/stocks/technical_plot`, {

//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ symbol }),
//       })
//         .then((response) => response.json())
//         .then((data) => setPlotData(data)) // Access the figure key from the response
//         .catch((error) => console.error("Error fetching plot data:", error));
//     }
//   }, [symbol]);

//   const handlePlayVoice = () => {
//     if (plotData && plotData.comment) {
//       const utterance = new SpeechSynthesisUtterance(plotData.comment);
//       utterance.onstart = () => setIsSpeaking(true);
//       utterance.onend = () => setIsSpeaking(false);
//       speechSynthesis.speak(utterance);
//     }
//   };

//   if (!plotData) {
//     return <span className="loading loading-bars loading-lg"></span>;
//   }

//   const { figure, config } = plotData; // Destructure config as well

//   return (
//     <div>
//       <h2 className="text-2xl text-center font-bold mb-3">Candle Stick </h2>
//       <Plot 
//         className="m-10"
//         data={figure.data} 
//         layout={figure.layout} 
//         config={config}  // Pass config to Plot
//       />
//       <div className="bg-gray-200 p-4 dark:bg-slate-500 dark:text-white">
//         {/* Button container with background */}
//         <div className="bg-white flex justify-center items-center space-x-4 p-3 rounded-lg shadow-md dark:bg-slate-800 dark:text-white">
//           <button
//             className="px-6 text-xl font-bold"
//             onClick={() => setShowComment(!showComment)}
//           >
//             {showComment ? 'Hide info' : <RiInformation2Fill />}
//           </button>

//           <button
//             className="text-xl font-bold"
//             onClick={handlePlayVoice}
//             disabled={isSpeaking && !speechSynthesis.speaking}
//           >
//             {isSpeaking ? <TbPlayerPauseFilled /> : <IoIosPlay />}
//           </button>
//         </div>

//         {/* Comments section */}
//         {showComment && (
//           <div className="flex justify-center items-center mt-4 p-4 border rounded bg-gray-100 dark:bg-slate-800 dark:text-white">
//             <p className="text-l font-bold">{plotData.comment}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TechnicalPlot;



// import React, { useState, useEffect } from "react";
// import { IoIosPlay } from "react-icons/io";
// import { RiInformation2Fill } from "react-icons/ri";
// import { TbPlayerPauseFilled } from "react-icons/tb";
// import { FaExpand } from "react-icons/fa";
// import Plot from "react-plotly.js";

// const TechnicalPlot = ({ symbol }) => {
//   const [plotData, setPlotData] = useState(null); // Store the plot data
//   const [isSpeaking, setIsSpeaking] = useState(false); // Handle speech synthesis state
//   const [showComment,setShowComment]=useState(false);
//    const [fullscreen, setFullscreen] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     if (symbol) {
//       // fetch("http://192.168.1.250:8080/CMDA-3.3.9/api/stocks/technical_plot", {
//         fetch(`${API_BASE}/api/stocks/technical_plot`, {

//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ symbol }),
//       })
//         .then((response) => response.json())
//         .then((data) => setPlotData(data)) // Access the figure key from the response
//         .catch((error) => console.error("Error fetching plot data:", error));
//     }
//   }, [symbol]);

//   // const handlePlayVoice = () => {
//   //   if (plotData && plotData.comment) {
//   //     const utterance = new SpeechSynthesisUtterance(plotData.comment);
//   //     utterance.onstart = () => setIsSpeaking(true);
//   //     utterance.onend = () => setIsSpeaking(false);
//   //     speechSynthesis.speak(utterance);
//   //   }
//   // };

//   if (!plotData) {
//     return <span className="loading loading-bars loading-lg"></span>;
//   }

//   const { figure, config } = plotData; // Destructure config as well

//     const GraphContent = () => (
//     <>
//       <h2 className="text-2xl text-center font-bold mb-3">Candle Stick</h2>
//       <Plot
//         className="m-10"
//         data={figure.data}
//         layout={figure.layout}
//         config={config}
//       />
//       <div className="bg-gray-200 p-4 dark:bg-slate-500 dark:text-white">
//         <div className="bg-white flex justify-center items-center space-x-4 p-3 rounded-lg shadow-md dark:bg-slate-800 dark:text-white">
//           <button
//             className="px-6 text-xl font-bold"
//             onClick={() => setShowComment(!showComment)}
//           >
//             {showComment ? "Hide info" : <RiInformation2Fill />}
//           </button>

//           {/* <button
//             className="text-xl font-bold"
//             onClick={handlePlayVoice}
//             disabled={isSpeaking && !speechSynthesis.speaking}
//           >
//             {isSpeaking ? <TbPlayerPauseFilled /> : <IoIosPlay />}
//           </button> */}
//         </div>

//         {showComment && (
//           <div className="flex justify-center items-center mt-4 p-4 border rounded bg-gray-100 dark:bg-slate-800 dark:text-white">
//             <p className="text-l font-bold">{plotData.comment}</p>
//           </div>
//         )}
//       </div>
//     </>
//   );

//   return (
//     // <div className="relative">
//     //   <h2 className="text-2xl text-center font-bold mb-3">Candle Stick </h2>
//     //   <Plot 
//     //     className="m-10"
//     //     data={figure.data} 
//     //     layout={figure.layout} 
//     //     config={config}  // Pass config to Plot
//     //   />
//     //   <div className="bg-gray-200 p-4 dark:bg-slate-500 dark:text-white">
//     //     {/* Button container with background */}
//     //     <div className="bg-white flex justify-center items-center space-x-4 p-3 rounded-lg shadow-md dark:bg-slate-800 dark:text-white">
//     //       <button
//     //         className="px-6 text-xl font-bold"
//     //         onClick={() => setShowComment(!showComment)}
//     //       >
//     //         {showComment ? 'Hide info' : <RiInformation2Fill />}
//     //       </button>

//     //       <button
//     //         className="text-xl font-bold"
//     //         onClick={handlePlayVoice}
//     //         disabled={isSpeaking && !speechSynthesis.speaking}
//     //       >
//     //         {isSpeaking ? <TbPlayerPauseFilled /> : <IoIosPlay />}
//     //       </button>
//     //     </div>

//     //     {/* Comments section */}
//     //     {showComment && (
//     //       <div className="flex justify-center items-center mt-4 p-4 border rounded bg-gray-100 dark:bg-slate-800 dark:text-white">
//     //         <p className="text-l font-bold">{plotData.comment}</p>
//     //       </div>
//     //     )}
//     //   </div>
//     // </div>


//     <div className="relative">
//       {/* Expand Icon */}
//       <div
//         className="absolute top-0 right-0 text-gray-500 hover:text-cyan-600 cursor-pointer z-10 m-2"
//         onClick={() => setFullscreen(true)}
//       >
//         <FaExpand size={20} />
//       </div>

//       {/* Regular Graph View */}
//       <GraphContent />

//       {/* Fullscreen Modal */}
//       {fullscreen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
//           onClick={() => setFullscreen(false)}
//         >
//           <div
//             className="relative w-full max-w-6xl bg-white dark:bg-slate-900 p-6 rounded shadow-lg overflow-y-auto max-h-[95vh]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-2 right-4 text-3xl font-bold text-white hover:text-red-500"
//               onClick={() => setFullscreen(false)}
//             >
//               ×
//             </button>
//             <GraphContent />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TechnicalPlot;

//--------------------25/06/25---------------------------

// import React, { useState, useEffect } from "react";
// import { IoIosPlay } from "react-icons/io";
// import { RiInformation2Fill } from "react-icons/ri";
// import { TbPlayerPauseFilled } from "react-icons/tb";
// import { FaExpand } from "react-icons/fa";
// import Plot from "react-plotly.js";
// import { HashLoader } from "react-spinners";

// const TechnicalPlot = ({ symbol }) => {
//   const [plotData, setPlotData] = useState(null);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [showComment, setShowComment] = useState(false);
//   const [fullscreen, setFullscreen] = useState(false);
//   const [error, setError] = useState(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     const { data, timestamp } = JSON.parse(cached);
//     if (Date.now() - timestamp > CACHE_TTL) {
//       localStorage.removeItem(key);
//       return null;
//     }
//     return data;
//   };

//   const setCachedData = (key, data) => {
//     localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
//   };

//   useEffect(() => {
//     if (!symbol) return;

//     const cacheKey = `technical_plot_${symbol}`;
//     const cachedData = getCachedData(cacheKey);
//     if (cachedData) {
//       setPlotData(cachedData);
//       setError(null);
//       return;
//     }

//     fetch(`${API_BASE}/stocks/technical_plot`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//       body: JSON.stringify({ symbol }),
//     })
//       .then((response) => {
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         return response.json();
//       })
//       .then((data) => {
//         if (!data.figure || !data.config) {
//           throw new Error("Invalid data structure received from API");
//         }
//         setPlotData(data);
//         setCachedData(cacheKey, data);
//         setError(null);
//       })
//       .catch((error) => {
//         console.error("Error fetching plot data:", error);
//         setError(error.message);
//         setPlotData(null);
//       });
//   }, [symbol]);

//   if (error) {
//     return <div className="text-red-500 text-center">Error: {error}</div>;
//   }

//   if (!plotData) {
//     return  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
//       <HashLoader color="#0369a1" size={60} />
//       <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
//         CMDA...
//       </p>
//     </div>;
//   }

//   const GraphContent = () => (
//     <>
//       <h2 className="text-2xl text-center font-bold mb-3">Candle Stick</h2>
//       <Plot
//         className="m-10"
//         data={plotData.figure.data}
//         layout={plotData.figure.layout}
//         config={plotData.config}
//       />
//       <div className="bg-gray-200 p-4 dark:bg-slate-500 dark:text-white">
//         <div className="bg-white flex justify-center items-center space-x-4 p-3 rounded-lg shadow-md dark:bg-slate-800 dark:text-white">
//           <button
//             className="px-6 text-xl font-bold"
//             onClick={() => setShowComment(!showComment)}
//           >
//             {showComment ? "Hide info" : <RiInformation2Fill />}
//           </button>
//         </div>
//         {showComment && (
//           <div className="flex justify-center items-center mt-4 p-4 border rounded bg-gray-100 dark:bg-slate-800 dark:text-white">
//             <p className="text-l font-bold">{plotData.comment || "No comment available"}</p>
//           </div>
//         )}
//       </div>
//     </>
//   );

//   return (
//     <div className="relative">
//       <div
//         className="absolute top-0 right-0 text-gray-500 hover:text-cyan-600 cursor-pointer z-10 m-2"
//         onClick={() => setFullscreen(true)}
//       >
//         <FaExpand size={20} />
//       </div>
//       <GraphContent />
//       {fullscreen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
//           onClick={() => setFullscreen(false)}
//         >
//           <div
//             className="relative w-full max-w-6xl bg-white dark:bg-slate-900 p-6 rounded shadow-lg overflow-y-auto max-h-[95vh]"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-2 right-4 text-3xl font-bold text-black hover:text-red-500"
//               onClick={() => setFullscreen(false)}
//             >
//               ×
//             </button>
//             <GraphContent />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TechnicalPlot;











import React, { useState, useEffect } from "react";
import { IoIosPlay } from "react-icons/io";
import { RiInformation2Fill } from "react-icons/ri";
import { TbPlayerPauseFilled } from "react-icons/tb";
import { FaExpand } from "react-icons/fa";
import Plot from "react-plotly.js";

const TechnicalPlot = ({ symbol }) => {
  const [plotData, setPlotData] = useState(null);


  const [fullscreen, setFullscreen] = useState(false);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    if (symbol) {
      fetch(`${API_BASE}/stocks/technical_plot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol }),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          const transformedData = {
            ...data,
            figure: {
              ...data.figure,
              data: data.figure.data.map((trace) => {
                if (trace.x) {
                  return {
                    ...trace,
                    x: trace.x.map((ns) => {
                      const ms = ns / 1e6;
                      return new Date(ms).toISOString().split("T")[0];
                    }),
                  };
                }
                return trace;
              }),
            },
          };
          setPlotData(transformedData);
        })
        .catch((error) => console.error("Error fetching plot data:", error));
    }
  }, [symbol]);

  if (!plotData) {
    return <span className="loading loading-bars loading-lg"></span>;
  }

  const { figure, config } = plotData;

  const GraphContent = () => (
    <>
      <h2 className="text-2xl text-center font-bold mb-3">Candle Stick</h2>
      <div className="w-full">
        <Plot
          className="w-full h-full" // Full width, fixed height
          data={figure.data}
          layout={{
            ...figure.layout,
            xaxis: { ...figure.layout.xaxis, type: "date" },
            autosize: true, // Make plot responsive
            margin: { l: 50, r: 50, t: 50, b: 50 }, // Adjust margins if needed
          }}
          config={{ ...config, responsive: true }} // Enable responsive config
          useResizeHandler={true} // Handle container resizing
        />
      </div>

    </>
  );

  return (
    <div className="relative w-full">
      <div
        className="absolute top-0 right-0 text-gray-500 hover:text-cyan-600 cursor-pointer z-10 m-2"
        onClick={() => setFullscreen(true)}
      >
        <FaExpand size={20} />
      </div>
      <GraphContent />
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="relative w-full h-full max-w-[95vw] max-h-[95vh] bg-white dark:bg-slate-900 p-6 rounded shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-4 text-3xl font-bold text-white hover:text-red-500"
              onClick={() => setFullscreen(false)}
            >
              ×
            </button>
            <GraphContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalPlot;