// import React, { useState, useEffect } from "react";
// // import { IoIosPlay } from "react-icons/io";
// import { RiInformation2Fill } from "react-icons/ri";
// // import { TbPlayerPauseFilled } from "react-icons/tb";
// import Plot from "react-plotly.js";

// const AvgBoxPlots = ({symbol}) => {
//   const [plotData, setPlotData] = useState(null); // State to store the plot data
//   // const [isSpeaking, setIsSpeaking] = useState(false); // State to handle voiceover status
//   // const [utterance, setUtterance] = useState(null); // Store the utterance object
//   // const [speechPosition, setSpeechPosition] = useState(0);
//   const [showComment,setShowComment]=useState(false)
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // Fetch the plot data from the backend
//   useEffect(() => {
//      if (symbol) {
//       //  fetch("http://192.168.1.250:8080/CMDA-3.3.9/api/stocks/avg_box", {
//         fetch(`${API_BASE}/api/stocks/avg_box`, {

//          method: "POST",
//          headers: {
//            "Content-Type": "application/json",
//          },

//          body: JSON.stringify({
//                  symbol: symbol,
//                  companyName: symbol  // Sending symbol as companyName too for now
//                }),
//        })
//          .then((response) => response.json())
//          .then((data) => setPlotData(data))
//          .catch((error) => console.error("Error fetching plot data:", error));
//      }
//    }, [symbol]);

//   //  const handlePlayVoice = () => {
//   //   if (isSpeaking) {
//   //     // If speaking, stop the speech and store the position
//   //     speechSynthesis.cancel();
//   //     setIsSpeaking(false);
//   //   } else if (plotData && plotData.comment) {
//   //     // If not speaking, start the speech from the last position or from the start
//   //     const newUtterance = new SpeechSynthesisUtterance(plotData.comment);
//   //     newUtterance.onstart = () => setIsSpeaking(true);
//   //     newUtterance.onend = () => setIsSpeaking(false);
//   //     newUtterance.onboundary = (event) => {
//   //       if (event.name === "word") {
//   //         // Store the position in words
//   //         setSpeechPosition(event.charIndex);
//   //       }
//   //     };

//   //     // If we already have a speech position, start from there
//   //     if (speechPosition > 0) {
//   //       newUtterance.text = plotData.comment.substring(speechPosition);
//   //     }

//   //     speechSynthesis.speak(newUtterance);
//   //     setUtterance(newUtterance); // Store the utterance for future control
//   //   }
//   // };

//   // Render loading state
//   if (!plotData) {
//     return <span className="loading loading-bars loading-lg"></span>;
//   }

//   const { box_plot_data, layout, comment,config } = plotData; // Extract data from backend response

//   return (
//     <div>
//       {/* <h2 className="text-2xl text-center font-bold mb-3">Average Box Plot</h2> */}
//       <Plot
//         data={box_plot_data}
//         layout={{
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
// />
//       <div className="bg-gray-200 p-4  dark:bg-slate-500 dark:text-white">
//   {/* Button container with background */}
//   <div className="bg-white flex justify-center items-center space-x-4 p-3 rounded-lg shadow-md  dark:bg-slate-800 dark:text-white">
//     <button
//       className="px-6 text-xl font-bold"
//       onClick={() => setShowComment(!showComment)}
//     >
//       {showComment ? 'Hide info' : <RiInformation2Fill />}
//     </button>

//     {/* <button
//       className="text-xl font-bold"
//       onClick={handlePlayVoice}
//       disabled={isSpeaking && !speechSynthesis.speaking}
//     >
//       {isSpeaking ? <TbPlayerPauseFilled /> : <IoIosPlay />}
//     </button> */}
//   </div>

//   {/* Comments section */}
//   {showComment && (
//     <div className="flex justify-center items-center mt-4 p-4 border rounded bg-gray-100  dark:bg-slate-800 dark:text-white">
//       <p className="text-l font-bold">{plotData.comment}</p>
//     </div>
//   )}
// </div>
//     </div>
//   );
// };

// export default AvgBoxPlots;

// AYCanalytics@007star

import React, { useState, useEffect } from "react";
// import { RiInformation2Fill } from "react-icons/ri";
import Plot from "react-plotly.js";
import { HashLoader } from "react-spinners";
import RatingSystem from "../RatingFile/RatingSystem";
import { generatePlot } from "../../services/mtmApi";

const AvgBoxPlots = ({ symbol }) => {
  const [plotData, setPlotData] = useState(null);

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

  const handleRatingUpdate = (newRating) => {
    console.log("Box Plot Data rating updated:", newRating);
  };
  useEffect(() => {
    if (!symbol) return;

    const cacheKey = `avg_box_${symbol}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setPlotData(cachedData);
      return;
    }

    // Use MTM API service
    generatePlot(symbol, "price_trend")
      .then((data) => {
        setPlotData(data);
        setCachedData(cacheKey, data);
      })
      .catch((error) => console.error("Error fetching plot data:", error));
  }, [symbol]);

  if (!plotData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <HashLoader color="#0369a1" size={60} />
        <p className="mt-4 text-sky-700 dark:text-white font-semibold text-lg animate-pulse">
          CMDA...
        </p>
      </div>
    );
  }

  const { box_plot_data, layout, config } = plotData;

  // return (
  //   <div>
  //     {/* Rating Section */}
  //       <div className="flex justify-end p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
  //         <div className="flex items-center gap-2">
  //           <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">
  //
  //           </span>
  //           <RatingSystem
  //             plotType="price-trend"
  //             onRatingUpdate={handleRatingUpdate}
  //             className="flex items-center"
  //             aria-label="Rate price trend analysis"
  //           />
  //         </div>
  //       </div>
  //     <Plot
  //       data={box_plot_data}
  //       layout={{
  //         ...layout,
  //         autosize: true,
  //         responsive: true,
  //         margin: { t: 50, l: 50, r: 30, b: 50 },
  //         height: 600,
  //       }}
  //       useResizeHandler={true}
  //       style={{ width: '100%', minHeight: "600px" }}
  //       config={{
  //         responsive: true,
  //         ...(config || {})
  //       }}
  //     />

  //   </div>
  // );
  return (
    // <div className="w-full  mx-auto p-4 sm:p-6 lg:p-8">
    //   {/* Card Container */}
    //   <div className="bg-white dark:bg-gray-800 ">
    //     {/* Header */}
    //     <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
    //       <div>
    //         <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
    //           Price Trend Analysis
    //         </h3>
    //         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
    //           Box plot showing price distribution and trends
    //         </p>
    //       </div>

    //     </div>

    //     {/* Rating Section */}
    //     <div className="flex justify-end p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
    //       <div className="flex items-center gap-2">
    //         <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">

    //         </span>
    //         <RatingSystem
    //           plotType="price_trend"
    //           onRatingUpdate={handleRatingUpdate}
    //           className="flex items-center"
    //           aria-label="Rate price trend analysis"
    //         />
    //       </div>
    //     </div>

    //     {/* Box Plot */}
    //     <div className="p-4 sm:p-6">
    //       <Plot
    //         data={box_plot_data}
    //         layout={{
    //           ...layout,
    //           autosize: true,
    //           responsive: true,
    //           margin: { t: 50, l: 50, r: 30, b: 50 },
    //           height: 600,
    //         }}
    //         useResizeHandler={true}
    //         style={{ width: '100%', minHeight: "600px" }}
    //         config={{
    //           responsive: true,
    //           ...(config || {})
    //         }}
    //       />
    //     </div>

    //     {/* Info/Legend */}
    //     <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300">
    //       <p>
    //         This box plot displays the distribution of stock prices over time. Each box represents the interquartile range (IQR), with whiskers showing the minimum and maximum values, and outliers as individual points.
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Compact Card Container */}
      <div className="bg-white dark:bg-gray-800  overflow-hidden">
        {/* Header with Integrated Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 gap-4">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1">
              Price Trend Analysis
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Box plot showing price distribution and trends with quartile
              ranges
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RatingSystem
              plotType="price_trend"
              onRatingUpdate={handleRatingUpdate}
              compact={true}
              className="flex items-center"
              aria-label="Rate price trend analysis"
            />
          </div>
        </div>

        {/* Box Plot - Optimized Height */}
        <div className="p-4 sm:p-6">
          <div className="h-[400px] sm:h-[450px]">
            {" "}
            {/* Fixed height container */}
            <Plot
              data={box_plot_data}
              layout={{
                ...layout,
                autosize: true,
                responsive: true,
                margin: { t: 40, l: 60, r: 30, b: 60 },
                height: null, // Let container handle height
                font: { family: "Inter, sans-serif", size: 12 },
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                xaxis: {
                  ...layout?.xaxis,
                  tickfont: { size: 11 },
                  title: { ...layout?.xaxis?.title, font: { size: 12 } },
                },
                yaxis: {
                  ...layout?.yaxis,
                  tickfont: { size: 11 },
                  title: { ...layout?.yaxis?.title, font: { size: 12 } },
                },
              }}
              useResizeHandler={true}
              style={{ width: "100%", height: "100%" }}
              config={{
                responsive: true,
                displayModeBar: false,
                displaylogo: false,
                staticPlot: false,
                ...(config || {}),
              }}
            />
          </div>
        </div>

        {/* Compact Info Section with Visual Legend */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Description */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                This box plot displays the distribution of stock prices over
                time. Each box represents the interquartile range (IQR) between
                Q1 and Q3, with the median line inside. Whiskers extend to show
                the data range while outliers appear as individual points.
              </p>
            </div>

            {/* Visual Legend */}
            {/* <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-blue-200 border border-blue-400"></div>
                <span className="text-gray-600 dark:text-gray-300">IQR (Q1-Q3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-orange-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Median</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-gray-400 border-t border-b border-gray-600"></div>
                <span className="text-gray-600 dark:text-gray-300">Whiskers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Outliers</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Quick Stats Bar (Optional - if you have summary data) */}
        {/* Uncomment if you have summary statistics available
        <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Current Range:</span>
              <span className="text-gray-600 dark:text-gray-400">₹X - ₹Y</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Volatility:</span>
              <span className="text-gray-600 dark:text-gray-400">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Trend:</span>
              <span className="text-green-600 dark:text-green-400">↑ Bullish</span>
            </div>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default AvgBoxPlots;
