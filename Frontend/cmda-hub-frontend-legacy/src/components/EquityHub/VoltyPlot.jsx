// import React, { useState, useEffect } from "react";
// import { IoIosPlay } from "react-icons/io";
// import { RiInformation2Fill } from "react-icons/ri";
// import { TbPlayerPauseFilled } from "react-icons/tb";
// import Plot from "react-plotly.js";

// const VoltyPlot = ({symbol}) => {
//   const [plotData, setPlotData] = useState(null);
//   const [isSpeaking, setIsSpeaking] = useState(false); // State to handle voiceover status
//    const [utterance, setUtterance] = useState(null); // Store the utterance object
//    const [speechPosition, setSpeechPosition] = useState(0); 
//    const [showComment,setShowComment]=useState(false)
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//    useEffect(() => {
//       if (symbol) {
//         // fetch("http://192.168.1.250:8080/CMDA-3.3.9/api/stocks/predict_volatility", {
//           fetch(`${API_BASE}/api/stocks/predict_volatility`, {

//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ symbol }),
//         })
//           .then((response) => response.json())
//           .then((data) => setPlotData(data))
//           .catch((error) => console.error("Error fetching plot data:", error));
//       }
//     }, [symbol]);

//     const handlePlayVoice = () => {
//     if (isSpeaking) {
//       // If speaking, stop the speech and store the position
//       speechSynthesis.cancel();
//       setIsSpeaking(false);
//     } else if (plotData && plotData.comment) {
//       // If not speaking, start the speech from the last position or from the start
//       const newUtterance = new SpeechSynthesisUtterance(plotData.comment);
//       newUtterance.onstart = () => setIsSpeaking(true);
//       newUtterance.onend = () => setIsSpeaking(false);
//       newUtterance.onboundary = (event) => {
//         if (event.name === "word") {
//           // Store the position in words
//           setSpeechPosition(event.charIndex);
//         }
//       };

//       // If we already have a speech position, start from there
//       if (speechPosition > 0) {
//         newUtterance.text = plotData.comment.substring(speechPosition);
//       }

//       speechSynthesis.speak(newUtterance);
//       setUtterance(newUtterance); // Store the utterance for future control
//     }
//   };

//   if (!plotData) {
//     return <span className="loading loading-bars loading-lg"></span>;
//   }

//   const { scatter_data, layout, comment,config } = plotData;

//   return (
//     <div>
//       {/* <h2 className="text-2xl text-center font-bold mb-3">Volatility Distribution</h2> */}
//       <Plot 
//       data={scatter_data} 
//        layout={{
//           ...layout,
//            autosize: true,
//         responsive: true,

//         margin: { t: 50, l: 50, r: 30, b: 50 },
//         }}
//          useResizeHandler={true}
//       style={{ width: '100%', height: '100%' }}
//        config={{
//     responsive: true,
//     ...(config || {})  // Merge backend config safely
//   }}
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

// export default VoltyPlot;


import React, { useState, useEffect } from "react";
import { IoIosPlay } from "react-icons/io";
import { RiInformation2Fill } from "react-icons/ri";
import { TbPlayerPauseFilled } from "react-icons/tb";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";

const VoltyPlot = ({ symbol }) => {
  const [plotData, setPlotData] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [speechPosition, setSpeechPosition] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  const getCachedData = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  };

  const setCachedData = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  useEffect(() => {
    if (!symbol) return;

    const cacheKey = `predict_volatility_${symbol}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setPlotData(cachedData);
      return;
    }

    fetch(`${API_BASE}/stocks/predict_volatility`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ symbol }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPlotData(data);
        setCachedData(cacheKey, data);
      })
      .catch((error) => console.error("Error fetching plot data:", error));
  }, [symbol]);

  const handlePlayVoice = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (plotData && plotData.comment) {
      const newUtterance = new SpeechSynthesisUtterance(plotData.comment);
      newUtterance.onstart = () => setIsSpeaking(true);
      newUtterance.onend = () => setIsSpeaking(false);
      newUtterance.onboundary = (event) => {
        if (event.name === "word") {
          setSpeechPosition(event.charIndex);
        }
      };
      if (speechPosition > 0) {
        newUtterance.text = plotData.comment.substring(speechPosition);
      }
      speechSynthesis.speak(newUtterance);
      setUtterance(newUtterance);
    }
  };

  if (!plotData) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <HashLoader color="#0369a1" size={60} />
      <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
        CMDA...
      </p>
    </div>;
  }

  const { scatter_data, layout, comment, config } = plotData;

  return (
    <div>
      <Plot
        data={scatter_data}
        layout={{
          ...layout,
          autosize: true,
          responsive: true,
          margin: { t: 50, l: 50, r: 30, b: 50 },
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "600px" }}
        config={{
          responsive: true,
          ...(config || {})
        }}
      />
      <div className="bg-gray-200 p-4 dark:bg-slate-500 dark:text-white">
        <div className="bg-white flex justify-center items-center space-x-4 p-3 rounded-lg shadow-md dark:bg-slate-800 dark:text-white">
          <button
            className="px-6 text-xl font-bold"
            onClick={() => setShowComment(!showComment)}
          >
            {showComment ? "Hide info" : <RiInformation2Fill />}
          </button>
          <button
            className="text-xl font-bold"
            onClick={handlePlayVoice}
            disabled={isSpeaking && !speechSynthesis.speaking}
          >
            {isSpeaking ? <TbPlayerPauseFilled /> : <IoIosPlay />}
          </button>
        </div>
        {showComment && (
          <div className="flex justify-center items-center mt-4 p-4 border rounded bg-gray-100 dark:bg-slate-800 dark:text-white">
            <p className="text-l font-bold">{comment}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoltyPlot;